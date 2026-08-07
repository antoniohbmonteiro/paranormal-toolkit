import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createWorkflowTargetReference,
  createWorkflowTargetReferences,
  resolveWorkflowTargetActor,
} from "../../../src/core/workflow/workflow-target-reference";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("workflow target references", () => {
  it("creates deterministic token and actor identities without serializing Documents", () => {
    const actor = { id: "actor-a", uuid: "Actor.actor-a", name: "Existido" } as Actor;
    const tokenTarget = createWorkflowTargetReference({
      tokenId: "token-a",
      actorId: "actor-a",
      sceneId: "scene-a",
      name: "Existido",
      actor,
    });
    const actorTarget = createWorkflowTargetReference({
      tokenId: null,
      actorId: "actor-a",
      sceneId: null,
      name: "Existido",
      actor,
    });

    expect(tokenTarget).toEqual({
      id: "token:scene-a:token-a",
      name: "Existido",
      sceneId: "scene-a",
      tokenId: "token-a",
      tokenUuid: "Scene.scene-a.Token.token-a",
      actorId: "actor-a",
      actorUuid: "Actor.actor-a",
    });
    expect(actorTarget.id).toBe("actor:Actor.actor-a");
    expect(tokenTarget).not.toHaveProperty("actor");
    expect(createWorkflowTargetReferences([{ ...tokenTarget, actor } as never])[0]?.id)
      .toBe("token:scene-a:token-a");
  });

  it("resolves the original token actor before world actors", async () => {
    const tokenActor = { id: "a", uuid: "Actor.a", system: {} } as Actor;
    const worldActor = { id: "a", uuid: "Actor.a", system: {} } as Actor;
    vi.stubGlobal("fromUuid", vi.fn(async (uuid: string) =>
      uuid.startsWith("Scene.") ? { actor: tokenActor } : null));
    vi.stubGlobal("game", { actors: { get: vi.fn(() => worldActor) } });

    const resolved = await resolveWorkflowTargetActor({
      id: "token:s:t",
      name: "Alvo",
      sceneId: "s",
      tokenId: "t",
      tokenUuid: "Scene.s.Token.t",
      actorId: "a",
      actorUuid: "Actor.a",
    });

    expect(resolved).toBe(tokenActor);
    expect(game.actors.get).not.toHaveBeenCalled();
  });

  it("does not redirect a missing synthetic actor to a world actor", async () => {
    const worldActor = { id: "a", uuid: "Actor.a", system: {} } as Actor;
    vi.stubGlobal("fromUuid", vi.fn().mockResolvedValue(null));
    vi.stubGlobal("game", { actors: { get: vi.fn(() => worldActor) } });

    const resolved = await resolveWorkflowTargetActor({
      id: "token:s:t",
      name: "Alvo",
      sceneId: "s",
      tokenId: "t",
      tokenUuid: "Scene.s.Token.t",
      actorId: "a",
      actorUuid: "Scene.s.Token.t.Actor.a",
    });

    expect(resolved).toBeNull();
    expect(game.actors.get).not.toHaveBeenCalled();
  });

  it("uses the persisted world actor id when no actor UUID is available", async () => {
    const worldActor = { id: "a", uuid: "Actor.a", system: {} } as Actor;
    vi.stubGlobal("fromUuid", vi.fn());
    vi.stubGlobal("game", { actors: { get: vi.fn(() => worldActor) } });

    const resolved = await resolveWorkflowTargetActor({
      id: "actor:a",
      name: "Alvo",
      sceneId: null,
      tokenId: null,
      tokenUuid: null,
      actorId: "a",
      actorUuid: null,
    });

    expect(resolved).toBe(worldActor);
    expect(game.actors.get).toHaveBeenCalledWith("a");
  });
});
