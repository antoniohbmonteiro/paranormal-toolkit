import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DamageApplicationResult } from "../../../../src/core/damage/damage-application";
import { AbilityAssistedActionService } from "../../../../src/features/abilities/ability-assisted-action-service";
import type { AbilityUseCardState } from "../../../../src/features/abilities/ability-use-card-state";

const targetActor = {
  id: "target",
  uuid: "Actor.target",
  name: "Existido",
  system: {},
} as Actor;

function appliedDamageResult(): DamageApplicationResult {
  return {
    actor: targetActor,
    actorId: "target",
    actorName: "Existido",
    totalRawDamage: 13,
    totalFinalDamage: 9,
    totalBlocked: 4,
    newPV: 21,
    conditions: [],
    instances: [{
      id: "damage-roll:token:scene:token:damage",
      label: null,
      sourceRollId: "configured-roll",
      inputAmount: 13,
      finalDamage: 9,
      blocked: 4,
      damageType: "energy",
      systemDamageType: "energy",
      ignoreResistance: false,
      nonLethal: false,
    }],
    source: "ability-use.assisted-action",
    originUuid: "Actor.source.Item.item",
  };
}

function state(kind: "damage" | "healing" = "damage"): AbilityUseCardState {
  const rollId = `${kind}-roll`;
  const targetId = "token:scene:token";
  return {
    schemaVersion: 2,
    ability: { name: "Habilidade", image: null, descriptionHtml: null, activationLabel: "Livre" },
    actor: { id: "source", uuid: "Actor.source", name: "Agente" },
    item: { id: "item", uuid: "Actor.source.Item.item", name: "Habilidade" },
    resource: { type: "PE", cost: 0, passive: false, spent: false, before: 0, after: 0 },
    rolls: [{
      id: rollId,
      sourceRollId: "configured-roll",
      label: kind === "damage" ? "Dano energético" : "Cura",
      intent: kind,
      damageType: kind === "damage" ? "energy" : null,
      formula: kind === "damage" ? "2d6+4" : "2d8+2",
      total: kind === "damage" ? 13 : 11,
      diceResults: [4, 5],
      nexThreshold: null,
    }],
    targets: [{
      id: targetId,
      name: "Existido",
      sceneId: "scene",
      tokenId: "token",
      tokenUuid: "Scene.scene.Token.token",
      actorId: "target",
      actorUuid: "Actor.target",
    }],
    actions: [{
      id: `${rollId}:${targetId}:${kind}`,
      kind,
      rollId,
      targetId,
      state: "available",
      completedAt: null,
      completedByUserId: null,
    }],
    createdAt: 1,
  };
}

beforeEach(() => {
  vi.stubGlobal("game", { user: { isGM: true }, actors: { get: vi.fn() } });
  vi.stubGlobal("fromUuid", vi.fn(async (uuid: string) =>
    uuid.startsWith("Scene.") ? { actor: targetActor } : targetActor));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AbilityAssistedActionService", () => {
  it("uses the shared damage feedback service to whisper successful damage to GMs", async () => {
    const damageResult = appliedDamageResult();
    const create = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("game", {
      user: { isGM: true },
      users: [
        { id: "gm", isGM: true },
        { id: "player", isGM: false },
      ],
      actors: { get: vi.fn() },
    });
    vi.stubGlobal("ChatMessage", {
      create,
      getSpeaker: vi.fn(() => ({ actor: "target" })),
    });
    const card = state("damage");
    const service = new AbilityAssistedActionService(
      {
        applyDamage: vi.fn().mockResolvedValue({
          ok: true,
          value: damageResult,
        }),
      } as never,
      { heal: vi.fn() } as never,
    );

    await expect(service.execute(card, card.actions[0]!)).resolves.toEqual({ ok: true });
    expect(create).toHaveBeenCalledOnce();
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        whisper: ["gm"],
        content: expect.stringContaining("Dano aplicado em <strong>Existido</strong>"),
      }),
    );
  });

  it("applies the persisted damage total and type without rolling", async () => {
    const damageResult = appliedDamageResult();
    const applyDamage = vi.fn().mockResolvedValue({ ok: true, value: damageResult });
    const damageFeedback = vi.fn().mockResolvedValue(undefined);
    const heal = vi.fn();
    const card = state("damage");
    const service = new AbilityAssistedActionService(
      { applyDamage } as never,
      { heal } as never,
      damageFeedback,
    );

    await expect(service.execute(card, card.actions[0]!)).resolves.toEqual({ ok: true });
    expect(applyDamage).toHaveBeenCalledWith({
      actor: targetActor,
      instances: [{
        id: card.actions[0]!.id,
        amount: 13,
        damageType: "energy",
        sourceRollId: "configured-roll",
      }],
      source: "ability-use.assisted-action",
      originUuid: "Actor.source.Item.item",
    });
    expect(damageFeedback).toHaveBeenCalledOnce();
    expect(damageFeedback).toHaveBeenCalledWith(damageResult);
    expect(damageFeedback.mock.calls[0]?.[0]).toBe(damageResult);
    expect(heal).not.toHaveBeenCalled();
    expect((globalThis as { Roll?: unknown }).Roll).toBeUndefined();
  });

  it("uses ResourceEngine.heal for the persisted healing total", async () => {
    const heal = vi.fn().mockResolvedValue({ ok: true, value: {} });
    const damageFeedback = vi.fn();
    const card = state("healing");
    const service = new AbilityAssistedActionService(
      { applyDamage: vi.fn() } as never,
      { heal } as never,
      damageFeedback,
    );

    await expect(service.execute(card, card.actions[0]!)).resolves.toEqual({ ok: true });
    expect(heal).toHaveBeenCalledWith(targetActor, "PV", 11);
    expect(damageFeedback).not.toHaveBeenCalled();
  });

  it("keeps a successful damage result successful when only GM feedback fails", async () => {
    const damageResult = appliedDamageResult();
    const applyDamage = vi.fn().mockResolvedValue({ ok: true, value: damageResult });
    const damageFeedback = vi.fn().mockRejectedValue(new Error("chat unavailable"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const card = state("damage");
    const service = new AbilityAssistedActionService(
      { applyDamage } as never,
      { heal: vi.fn() } as never,
      damageFeedback,
    );

    await expect(service.execute(card, card.actions[0]!)).resolves.toEqual({ ok: true });
    expect(applyDamage).toHaveBeenCalledOnce();
    expect(damageFeedback).toHaveBeenCalledWith(damageResult);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("feedback privado aos Mestres falhou"),
      expect.objectContaining({ actorId: "target" }),
    );
  });

  it("enforces GM permission even when invoked outside the UI", async () => {
    vi.stubGlobal("game", { user: { isGM: false }, actors: { get: vi.fn() } });
    const applyDamage = vi.fn();
    const card = state();
    const result = await new AbilityAssistedActionService(
      { applyDamage } as never,
      { heal: vi.fn() } as never,
    ).execute(card, card.actions[0]!);

    expect(result).toMatchObject({ ok: false, sideEffect: "none" });
    expect(applyDamage).not.toHaveBeenCalled();
  });

  it("classifies adapter application failures as uncertain", async () => {
    const card = state();
    const result = await new AbilityAssistedActionService(
      {
        applyDamage: vi.fn().mockResolvedValue({
          ok: false,
          error: { reason: "application-failed", message: "Falha ao aplicar" },
        }),
      } as never,
      { heal: vi.fn() } as never,
    ).execute(card, card.actions[0]!);

    expect(result).toEqual({
      ok: false,
      sideEffect: "uncertain",
      message: "Falha ao aplicar",
    });
  });

  it("fails safely when the persisted target no longer exists", async () => {
    vi.stubGlobal("fromUuid", vi.fn().mockResolvedValue(null));
    const applyDamage = vi.fn();
    const card = state();
    const result = await new AbilityAssistedActionService(
      { applyDamage } as never,
      { heal: vi.fn() } as never,
    ).execute(card, card.actions[0]!);

    expect(result).toMatchObject({ ok: false, sideEffect: "none" });
    expect(applyDamage).not.toHaveBeenCalled();
  });
});
