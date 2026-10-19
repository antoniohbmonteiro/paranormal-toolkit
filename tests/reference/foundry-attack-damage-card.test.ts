import { afterEach, describe, expect, it, vi } from "vitest";
import { MODULE_ID } from "../../src/constants";
import { createAttackReference, loadAttackReference } from "./helpers/attack-reference";

const ordemRoot = process.env.PARANORMAL_TOOLKIT_ORDEM_REFERENCE;
const foundryRoot = process.env.PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE;
afterEach(() => vi.unstubAllGlobals());

// Only the chat DOM is doubled; rolls, damage application and the user collection use the real sources.
function messageRoot() {
  return new class extends HTMLElement {
    summary = "";
    clickHandler?: (event: any) => void;
    querySelector(selector: string): any {
      if (selector === ".message-content") return this;
      if (selector === "[data-toolkit-attack-summary]" && this.summary) return { remove: () => { this.summary = ""; } };
      return null;
    }
    insertAdjacentHTML(_position: string, markup: string) { this.summary += markup; }
    addEventListener(_type: string, callback: any) { this.clickHandler = callback; }
  }();
}

function useNativeUsers(harness: Awaited<ReturnType<typeof createAttackReference>>) {
  const { default: Collection } = loadAttackReference(foundryRoot!, "common/utils/collection.mjs", {});
  harness.game.users = new Collection(harness.users.map(user => [user.id, user]));
  expect(harness.game.users.flatMap).toBeUndefined();
}

describe.skipIf(!ordemRoot || !foundryRoot)("damage card with native Foundry user collection", () => {
  it("renders the GM apply action, applies penetration to the original target and stays applied after rerender", async () => {
    const h = await createAttackReference(ordemRoot!);
    await h.invoke("attack"); await h.invoke("damage");
    useNativeUsers(h); h.game.user = h.users[0];
    const message = h.damageMessages()[0], root = messageRoot();
    expect(message.getFlag("ordemparanormal", "damageTarget")).toBeUndefined();
    Hooks.callAll("renderChatMessageHTML", message, root);
    expect(root.summary).toContain("Dano do ataque");
    expect(root.summary).toContain("Aplicar ao alvo original");
    expect(root.summary).toContain('data-toolkit-attack-action="apply">');
    Hooks.callAll("ordemparanormal.renderChatMessage", message, root);
    expect(root.summary.match(/data-toolkit-attack-action="apply"/g)).toHaveLength(1);
    h.game.user.targets = new Set([h.targets[1]]);
    const button = { disabled: false, dataset: { toolkitAttackAction: "apply" } };
    const event = { target: { closest: () => button }, preventDefault() {}, stopPropagation() {} };
    root.clickHandler!(event); root.clickHandler!(event);
    await vi.waitFor(() => expect(h.cards.readDamage(message)?.application.state).toBe("completed"));
    expect(h.targets[0].actor.system.attributes.hp.value).toBe(73);
    expect(h.targets[1].actor.system.attributes.hp.value).toBe(100);
    expect(h.damageMessages()).toHaveLength(1);
    Hooks.callAll("renderChatMessageHTML", message, root);
    expect(root.summary).toContain('data-toolkit-attack-action="apply" disabled');
    expect(root.summary).toContain("Dano aplicado");
  });

  it("keeps the apply action GM-only and disables it for another GM", async () => {
    const h = await createAttackReference(ordemRoot!);
    await h.invoke("attack"); await h.invoke("damage"); useNativeUsers(h);
    const message = h.damageMessages()[0], root = messageRoot();
    Hooks.callAll("renderChatMessageHTML", message, root);
    expect(root.summary).toContain("Dano do ataque");
    expect(root.summary).not.toContain('data-toolkit-attack-action="apply"');
    const otherGm = { id: "gm2", isGM: true, active: true };
    h.game.users.set(otherGm.id, otherGm); h.game.user = otherGm;
    Hooks.callAll("renderChatMessageHTML", message, root);
    expect(root.summary).toContain('data-toolkit-attack-action="apply" disabled');
    expect(root.summary).toContain("Mestre executor conectado");
    await expect(h.assisted.apply(message)).rejects.toThrow("Mestre executor");
    expect(h.targets[0].actor.system.attributes.hp.value).toBe(100);
  });

  it.each(["untargeted", "mixed"])("keeps %s damage manual", async mode => {
    const h = await createAttackReference(ordemRoot!, { targeted: mode === "untargeted" ? 0 : 1 });
    if (mode === "mixed") h.weapon.system.formulas.damage.parts = [["1d6", "fireDamage"]];
    await h.invoke("attack"); await h.invoke("damage"); useNativeUsers(h); h.game.user = h.users[0];
    const message = h.damageMessages()[0], root = messageRoot();
    Hooks.callAll("renderChatMessageHTML", message, root);
    expect(root.summary).toContain("Aplicação manual");
    expect(root.summary).not.toContain('data-toolkit-attack-action="apply"');
    expect(h.cards.readDamage(message)?.application.state).toBe("available");
    expect(message.getFlag(MODULE_ID, "attackDamage")).toBeTruthy();
  });
});
