import type { DamageEngine } from "../../core/damage/damage-engine";
import type { DamageApplicationResult } from "../../core/damage/damage-application";
import { ModuleLogger } from "../../core/module-logger";
import type { ResourceEngine } from "../../core/resources/resource-engine";
import { resolveWorkflowTargetActor } from "../../core/workflow/workflow-target-reference";
import { canCurrentUserApplyAssistedActions } from "../item-use/assisted-actions/assisted-action-policy";
import { whisperDamageApplicationResultToGms } from "../item-use/assisted-actions/assisted-damage-feedback-service";
import type {
  AbilityAssistedAction,
  AbilityUseCardState,
} from "./ability-use-card-state";

export type AbilityAssistedActionExecutionResult =
  | { ok: true }
  | { ok: false; message: string; sideEffect: "none" | "uncertain" };

type DamageFeedbackService = (
  result: DamageApplicationResult,
) => Promise<void>;

export class AbilityAssistedActionService {
  constructor(
    private readonly damage: DamageEngine,
    private readonly resources: ResourceEngine,
    private readonly damageFeedback: DamageFeedbackService =
      whisperDamageApplicationResultToGms,
  ) {}

  async execute(
    state: AbilityUseCardState,
    action: AbilityAssistedAction,
  ): Promise<AbilityAssistedActionExecutionResult> {
    if (!canCurrentUserApplyAssistedActions()) {
      return failure("Apenas o Mestre pode aplicar ações assistidas.", "none");
    }

    const roll = state.rolls.find((entry) => entry.id === action.rollId);
    const target = state.targets.find((entry) => entry.id === action.targetId);
    if (!roll || roll.intent !== action.kind || !target) {
      return failure("A ação persistida não corresponde ao resultado do card.", "none");
    }
    if (!Number.isInteger(roll.total) || roll.total <= 0) {
      return failure("O resultado persistido não pode ser aplicado.", "none");
    }

    const actor = await resolveWorkflowTargetActor(target);
    if (!actor) {
      return failure(`Não foi possível localizar o alvo original ${target.name}.`, "none");
    }

    if (action.kind === "healing") {
      return this.applyHealing(actor, roll.total);
    }
    return this.applyDamage(state, action, actor, roll);
  }

  private async applyHealing(
    actor: Actor,
    amount: number,
  ): Promise<AbilityAssistedActionExecutionResult> {
    try {
      const result = await this.resources.heal(actor, "PV", amount);
      if (result.ok) return { ok: true };
      return failure(
        result.error.message,
        result.error.reason === "update-failed" ? "uncertain" : "none",
      );
    } catch (cause) {
      return failure(readErrorMessage(cause, "Falha inesperada ao aplicar cura."), "uncertain");
    }
  }

  private async applyDamage(
    state: AbilityUseCardState,
    action: AbilityAssistedAction,
    actor: Actor,
    roll: AbilityUseCardState["rolls"][number],
  ): Promise<AbilityAssistedActionExecutionResult> {
    try {
      const result = await this.damage.applyDamage({
        actor,
        instances: [
          {
            id: action.id,
            amount: roll.total,
            damageType: roll.damageType,
            sourceRollId: roll.sourceRollId,
          },
        ],
        source: "ability-use.assisted-action",
        originUuid: state.item.uuid,
      });
      if (result.ok) {
        await this.publishDamageFeedback(result.value);
        return { ok: true };
      }
      return failure(
        result.error.message,
        result.error.reason === "application-failed" ? "uncertain" : "none",
      );
    } catch (cause) {
      return failure(readErrorMessage(cause, "Falha inesperada ao aplicar dano."), "uncertain");
    }
  }

  private async publishDamageFeedback(
    result: DamageApplicationResult,
  ): Promise<void> {
    try {
      await this.damageFeedback(result);
    } catch (cause) {
      ModuleLogger.warn(
        "Dano de habilidade aplicado, mas o feedback privado aos Mestres falhou.",
        {
          actorId: result.actorId,
          source: result.source,
          cause,
        },
      );
    }
  }
}

function failure(
  message: string,
  sideEffect: "none" | "uncertain",
): AbilityAssistedActionExecutionResult {
  return { ok: false, message, sideEffect };
}

function readErrorMessage(cause: unknown, fallback: string): string {
  return cause instanceof Error ? cause.message : fallback;
}
