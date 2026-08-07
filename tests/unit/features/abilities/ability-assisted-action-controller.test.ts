import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DamageApplicationResult } from "../../../../src/core/damage/damage-application";
import { AbilityAssistedActionService } from "../../../../src/features/abilities/ability-assisted-action-service";
import { executeAbilityAssistedActionInteraction } from "../../../../src/features/abilities/ability-assisted-action-controller";
import type { AbilityUseMessageFlagV3 } from "../../../../src/features/abilities/ability-roll-chat-contract";

function flag(): AbilityUseMessageFlagV3 {
  const targetId = "token:scene:target";
  return {
    version: 3,
    revision: 0,
    state: {
      schemaVersion: 2,
      ability: { name: "Habilidade", image: null, descriptionHtml: null, activationLabel: "Livre" },
      actor: { id: "source", uuid: "Actor.source", name: "Agente" },
      item: { id: "item", uuid: "Actor.source.Item.item", name: "Habilidade" },
      resource: { type: "PE", cost: 0, passive: false, spent: false, before: 0, after: 0 },
      rolls: [{
        id: "damage",
        sourceRollId: "damage",
        label: "Dano",
        intent: "damage",
        damageType: "energy",
        formula: "2d6",
        total: 7,
        diceResults: [3, 4],
        nexThreshold: null,
      }],
      targets: [{
        id: targetId,
        name: "Existido",
        sceneId: "scene",
        tokenId: "target",
        tokenUuid: "Scene.scene.Token.target",
        actorId: "target",
        actorUuid: "Actor.target",
      }],
      actions: [{
        id: `damage:${targetId}:damage`,
        kind: "damage",
        rollId: "damage",
        targetId,
        state: "available",
        completedAt: null,
        completedByUserId: null,
      }],
      createdAt: 1,
    },
  };
}

function message(initial = flag()) {
  let stored: unknown = structuredClone(initial);
  return {
    id: "message",
    getFlag: vi.fn(() => stored),
    setFlag: vi.fn(async (_scope: string, _key: string, value: unknown) => {
      stored = structuredClone(value);
    }),
    read: () => stored as AbilityUseMessageFlagV3,
  };
}

beforeEach(() => {
  vi.stubGlobal("game", { user: { id: "gm", isGM: true } });
  vi.stubGlobal("ui", { notifications: { warn: vi.fn() } });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ability assisted action controller", () => {
  it("claims and completes an action exactly once", async () => {
    const chatMessage = message();
    const execute = vi.fn().mockResolvedValue({ ok: true });
    const actionId = chatMessage.read().state.actions[0]!.id;

    await executeAbilityAssistedActionInteraction({
      message: chatMessage,
      actionId,
      service: { execute } as never,
    });
    await executeAbilityAssistedActionInteraction({
      message: chatMessage,
      actionId,
      service: { execute } as never,
    });

    expect(execute).toHaveBeenCalledOnce();
    expect(chatMessage.read()).toMatchObject({
      revision: 2,
      state: {
        actions: [{ state: "completed", completedByUserId: "gm" }],
      },
    });
  });

  it("returns a safe failure to available for retry", async () => {
    const chatMessage = message();
    const actionId = chatMessage.read().state.actions[0]!.id;

    await executeAbilityAssistedActionInteraction({
      message: chatMessage,
      actionId,
      service: {
        execute: vi.fn().mockResolvedValue({
          ok: false,
          sideEffect: "none",
          message: "Alvo ausente",
        }),
      } as never,
    });

    expect(chatMessage.read().state.actions[0]?.state).toBe("available");
  });

  it("keeps a possibly applied failure uncertain", async () => {
    const chatMessage = message();
    const actionId = chatMessage.read().state.actions[0]!.id;

    await executeAbilityAssistedActionInteraction({
      message: chatMessage,
      actionId,
      service: {
        execute: vi.fn().mockResolvedValue({
          ok: false,
          sideEffect: "uncertain",
          message: "Resposta incerta",
        }),
      } as never,
    });

    expect(chatMessage.read().state.actions[0]?.state).toBe("uncertain");
  });

  it("completes once without reapplying damage when only feedback fails", async () => {
    const actor = {
      id: "target",
      uuid: "Actor.target",
      name: "Existido",
      system: {},
    } as Actor;
    const damageResult: DamageApplicationResult = {
      actor,
      actorId: "target",
      actorName: "Existido",
      totalRawDamage: 7,
      totalFinalDamage: 7,
      totalBlocked: 0,
      newPV: 23,
      conditions: [],
      instances: [{
        id: "damage:token:scene:target:damage",
        label: null,
        sourceRollId: "damage",
        inputAmount: 7,
        finalDamage: 7,
        blocked: 0,
        damageType: "energy",
        systemDamageType: "energy",
        ignoreResistance: false,
        nonLethal: false,
      }],
      source: "ability-use.assisted-action",
      originUuid: "Actor.source.Item.item",
    };
    vi.stubGlobal("fromUuid", vi.fn().mockResolvedValue({ actor }));
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const applyDamage = vi.fn().mockResolvedValue({ ok: true, value: damageResult });
    const damageFeedback = vi.fn().mockRejectedValue(new Error("chat unavailable"));
    const service = new AbilityAssistedActionService(
      { applyDamage } as never,
      { heal: vi.fn() } as never,
      damageFeedback,
    );
    const chatMessage = message();
    const actionId = chatMessage.read().state.actions[0]!.id;

    await executeAbilityAssistedActionInteraction({
      message: chatMessage,
      actionId,
      service,
    });
    await executeAbilityAssistedActionInteraction({
      message: chatMessage,
      actionId,
      service,
    });

    expect(applyDamage).toHaveBeenCalledOnce();
    expect(damageFeedback).toHaveBeenCalledOnce();
    expect(chatMessage.read().state.actions[0]?.state).toBe("completed");
  });
});
