import { afterEach, describe, expect, it, vi } from "vitest";
import { AttackEventBus } from "../../../src/core/public-api/attack-event-bus";
import { PARANORMAL_TOOLKIT_HOOKS } from "../../../src/core/public-api/paranormal-toolkit-hooks";
import type { AttackPublishedEvent } from "../../../src/core/public-api/attack-event-types";

afterEach(() => vi.unstubAllGlobals());

describe("AttackEventBus", () => {
  const event: AttackPublishedEvent = {
    version: 1, actionId: "action", messageId: "message", userId: "user",
    item: { uuid: "Actor.a.Item.i", name: "Pistola", type: "armament" }, source: null, target: null, visibility: "public",
  };

  it("publishes the versioned serializable contract without roll outcomes", () => {
    const callAll = vi.fn();
    vi.stubGlobal("Hooks", { callAll });
    new AttackEventBus().emitPublished(event);
    expect(callAll).toHaveBeenCalledWith(PARANORMAL_TOOLKIT_HOOKS.attack.published, event);
    expect(JSON.parse(JSON.stringify(event))).toEqual(event);
  });

  it("isolates listener failures from publication and resource accounting", () => {
    vi.stubGlobal("Hooks", { callAll() { throw new Error("listener failed"); } });
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(() => new AttackEventBus().emitPublished(event)).not.toThrow();
  });
});
