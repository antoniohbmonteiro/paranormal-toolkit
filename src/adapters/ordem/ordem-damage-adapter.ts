import { failure, success, type Result } from "../../core/result";
import type {
  DamageApplicationFailure,
  DamageApplicationInput,
  DamageApplicationInstanceInput,
  DamageApplicationInstanceResult,
  DamageApplicationResult,
} from "../../core/damage/damage-application";
import type { DamageApplicationAdapter } from "../../core/damage/damage-adapter";
import {
  getOrdemDamageTypeLabel,
  resolveOrdemDamageType,
  type OrdemDamageType,
} from "./ordem-damage-types";

type OrdemApplyDamageOptions = {
  damageType?: OrdemDamageType;
  ignoreRD?: boolean;
  nonLethal?: boolean;
};

type OrdemApplyDamageResult = {
  finalDamage?: unknown;
  blocked?: unknown;
  newPV?: unknown;
  conditions?: unknown;
};

type ActorWithApplyDamage = Actor & {
  applyDamage?: (
    amount: number,
    options?: OrdemApplyDamageOptions,
  ) => Promise<OrdemApplyDamageResult> | OrdemApplyDamageResult;
};

export class OrdemDamageAdapter implements DamageApplicationAdapter {
  async applyDamage(
    input: DamageApplicationInput,
  ): Promise<Result<DamageApplicationResult, DamageApplicationFailure>> {
    const actor = input.actor;
    const actorName = actor.name ?? "Ator sem nome";
    const actorId = actor.id ?? null;

    if (!Array.isArray(input.instances) || input.instances.length === 0) {
      return failure({
        actor,
        actorId,
        actorName,
        reason: "empty-damage",
        message: "Nenhuma instância de dano foi informada.",
      });
    }

    const applyDamage = (actor as ActorWithApplyDamage).applyDamage;

    if (typeof applyDamage !== "function") {
      return failure({
        actor,
        actorId,
        actorName,
        reason: "unsupported-actor",
        message:
          "O sistema Ordem atual não expõe actor.applyDamage para este ator.",
      });
    }

    const instanceResults: DamageApplicationInstanceResult[] = [];
    const conditions = new Set<string>();
    let newPV: number | null = null;

    for (const [index, instance] of input.instances.entries()) {
      const normalized = normalizeInstance(instance, index);

      if (!normalized.ok) {
        return failure({
          actor,
          actorId,
          actorName,
          reason: "invalid-amount",
          message:
            "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance,
        });
      }

      const damageType = resolveOrdemDamageType(instance.damageType);

      if (!damageType.ok) {
        return failure({
          actor,
          actorId,
          actorName,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(instance.damageType)}.`,
          instance,
          damageType: instance.damageType,
        });
      }

      if (normalized.amount === 0) {
        instanceResults.push(
          createZeroDamageResult(normalized.id, instance, damageType.value),
        );
        continue;
      }

      try {
        const result = await Promise.resolve(
          applyDamage.call(actor, normalized.amount, {
            damageType: damageType.value ?? undefined,
            ignoreRD: instance.ignoreResistance === true,
            nonLethal: instance.nonLethal === true,
          }),
        );

        for (const condition of readConditionList(result.conditions)) {
          conditions.add(condition);
        }

        const resultNewPV = readNullableNumber(result.newPV);
        if (resultNewPV !== null) newPV = resultNewPV;

        instanceResults.push({
          id: normalized.id,
          label: instance.label ?? getOrdemDamageTypeLabel(damageType.value),
          sourceRollId: instance.sourceRollId ?? null,
          inputAmount: normalized.amount,
          finalDamage: readFiniteNumber(result.finalDamage, normalized.amount),
          blocked: readFiniteNumber(result.blocked, 0),
          damageType: instance.damageType ? String(instance.damageType) : null,
          systemDamageType: damageType.value,
          ignoreResistance: instance.ignoreResistance === true,
          nonLethal: instance.nonLethal === true,
        });
      } catch (cause) {
        return failure({
          actor,
          actorId,
          actorName,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${actorName}.`,
          instance,
          cause,
        });
      }
    }

    return success({
      actor,
      actorId,
      actorName,
      totalRawDamage: instanceResults.reduce(
        (total, result) => total + result.inputAmount,
        0,
      ),
      totalFinalDamage: instanceResults.reduce(
        (total, result) => total + result.finalDamage,
        0,
      ),
      totalBlocked: instanceResults.reduce(
        (total, result) => total + result.blocked,
        0,
      ),
      newPV,
      conditions: Array.from(conditions),
      instances: instanceResults,
      source: input.source ?? null,
      originUuid: input.originUuid ?? null,
    });
  }
}

function normalizeInstance(
  instance: DamageApplicationInstanceInput,
  index: number,
): { ok: true; id: string; amount: number } | { ok: false } {
  if (!Number.isFinite(instance.amount)) return { ok: false };

  const amount = Math.max(0, Math.trunc(instance.amount));
  if (amount < 0) return { ok: false };

  return {
    ok: true,
    id: instance.id ?? `damage-${index + 1}`,
    amount,
  };
}

function createZeroDamageResult(
  id: string,
  instance: DamageApplicationInstanceInput,
  damageType: OrdemDamageType | null,
): DamageApplicationInstanceResult {
  return {
    id,
    label: instance.label ?? getOrdemDamageTypeLabel(damageType),
    sourceRollId: instance.sourceRollId ?? null,
    inputAmount: 0,
    finalDamage: 0,
    blocked: 0,
    damageType: instance.damageType ? String(instance.damageType) : null,
    systemDamageType: damageType,
    ignoreResistance: instance.ignoreResistance === true,
    nonLethal: instance.nonLethal === true,
  };
}

function readFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readConditionList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is string => typeof entry === "string" && entry.length > 0,
  );
}
