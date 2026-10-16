import { renderAllySheet, type AllySheetViewModel } from "../../src/ui/components/ally/ally-sheet";
import { updateAllySheetDOM } from "../../src/applications/ally-sheet-dom";
import { bindAllyItemMenus } from "../../src/applications/ally-sheet-menus";

// Run in a real browser with the repository's Vite server: native details toggling, focus and event order.
export async function checkAllySheetMenus(): Promise<string[]> {
  const checks: string[] = [], host = document.createElement("form");
  host.className = "application paranormal-toolkit-ally-sheet";
  host.style.cssText = "position:fixed;left:0;top:0;width:760px;height:420px;opacity:0";
  host.innerHTML = '<section class="window-content"></section>';
  document.body.append(host);
  const content = host.querySelector<HTMLElement>(".window-content")!;
  const assert = (condition: unknown, label: string) => { if (!condition) throw new Error(label); checks.push(label); };
  const model: AllySheetViewModel = { idPrefix: "menu-check", name: "Íris", image: "", editable: true, activeTab: "support",
    profile: { schemaVersion: 1, description: "", isDrone: false },
    support: { revision: 1, status: "active", beneficiaryId: "mauro", waitRound: null, diagnostic: null, isGM: true,
      pilotAbilitiesEnabled: false, beneficiaries: [{ id: "mauro", name: "Mauro" }] },
    abilities: [{ id: "one", name: "Medicina", usable: true }, { id: "two", name: "Comando", usable: true }, { id: "three", name: "Faro", usable: true }] };
  const render = () => { const next = document.createElement("div"); next.className = "ally-sheet-content"; next.innerHTML = renderAllySheet(model); updateAllySheetDOM(content, next); };
  const executed: [string, boolean][] = [];
  // Stands in for the ApplicationV2 action dispatcher, bound to the same element in bubble phase.
  const dispatcher = (event: Event) => {
    const action = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
    if (action) executed.push([action.dataset.action!, Boolean(action.closest<HTMLDetailsElement>("details")?.open)]);
  };
  let escapesReachingWindow = 0;
  const windowEscape = (event: KeyboardEvent) => { if (event.key === "Escape") escapesReachingWindow++; };
  const tick = () => new Promise(resolve => setTimeout(resolve, 0));
  const menus = () => Array.from(host.querySelectorAll<HTMLDetailsElement>("details.ally-item-menu"));
  const opened = () => menus().filter(menu => menu.open);
  const press = async (element: Element) => {
    element.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    (element as HTMLElement).click(); await tick();
  };
  render();
  const binding = bindAllyItemMenus(host);
  host.addEventListener("click", dispatcher);
  window.addEventListener("keydown", windowEscape);
  try {
    const all = menus(), [supportOne, supportTwo] = all, abilitiesThree = all.at(-1)!;
    assert(all.length === 6, "support and abilities tabs share one menu per ability row");
    await press(supportOne.querySelector("summary")!);
    assert(opened().length === 1 && supportOne.open, "the three dots open the row menu");
    await press(document.body);
    assert(opened().length === 0, "a pointer outside the sheet closes the menu");
    await press(supportOne.querySelector("summary")!); await press(host.querySelector('[data-tab="abilities"][role="tab"]')!);
    assert(opened().length === 0, "a pointer elsewhere inside the sheet closes the menu");
    await press(supportOne.querySelector("summary")!); await press(supportOne.querySelector("summary")!);
    assert(opened().length === 0, "clicking the same three dots again toggles the menu closed");
    supportOne.querySelector<HTMLElement>("summary")!.click(); await tick();
    abilitiesThree.querySelector<HTMLElement>("summary")!.click(); await tick();
    assert(opened().length === 1 && abilitiesThree.open, "opening another menu without a pointer (keyboard) closes the previous one");
    await press(supportTwo.querySelector("summary")!);
    assert(opened().length === 1 && supportTwo.open, "opening another menu with the pointer closes the previous one");
    const configure = supportTwo.querySelector<HTMLButtonElement>('[data-action="configureBenefits"]')!;
    configure.focus(); executed.length = 0; await press(configure);
    assert(executed.length === 1 && executed[0][0] === "configureBenefits" && executed[0][1] === false && !supportTwo.open,
      "an action closes its menu before the action dispatcher runs");
    assert(document.activeElement === supportTwo.querySelector("summary"), "keyboard focus returns to the three dots after an action");
    await press(supportOne.querySelector("summary")!);
    const remove = supportOne.querySelector<HTMLButtonElement>('[data-action="removeAbility"]')!; remove.focus();
    const escape = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    remove.dispatchEvent(escape); await tick();
    assert(!supportOne.open && escape.defaultPrevented && escapesReachingWindow === 0, "Escape closes the menu without reaching Foundry's window handler");
    assert(document.activeElement === supportOne.querySelector("summary"), "Escape keeps focus on the three dots");
    host.querySelector<HTMLElement>('[data-tab="support"][role="tab"]')!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    assert(escapesReachingWindow === 1, "Escape outside a menu still reaches Foundry");
    await press(supportOne.querySelector("summary")!);
    model.abilities.reverse(); model.abilities[0].name = "Faro atualizado"; render(); await tick();
    assert(supportOne.isConnected && supportOne.open && opened().length === 1, "a re-render keeps the same open menu node");
    await press(document.body);
    assert(opened().length === 0, "outside closing still works after a re-render");
    binding.dispose();
    await press(supportOne.querySelector("summary")!); await press(document.body);
    assert(supportOne.open, "after dispose the sheet no longer reacts to document pointers");
    return checks;
  } finally {
    binding.dispose(); host.removeEventListener("click", dispatcher); window.removeEventListener("keydown", windowEscape); host.remove();
  }
}
