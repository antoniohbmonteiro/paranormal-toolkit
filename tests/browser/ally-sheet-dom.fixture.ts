import { renderAllySheet, type AllySheetViewModel } from "../../src/ui/components/ally/ally-sheet";
import { updateAllySheetDOM } from "../../src/applications/ally-sheet-dom";

// Run in a real browser with the repository's Vite server, without a DOM emulation dependency.
export function checkAllySheetDOM(): string[] {
  const checks: string[] = [], host = document.createElement("div");
  host.className = "application paranormal-toolkit-ally-sheet";
  host.style.cssText = "position:fixed;left:0;top:0;width:760px;height:320px;min-height:0;opacity:0;pointer-events:none";
  host.innerHTML = '<header class="window-header"><h1 class="window-title">Aliado: Íris</h1></header><section class="window-content"></section>';
  document.body.append(host);
  const content = host.querySelector<HTMLElement>(".window-content")!, windowHeader = host.querySelector<HTMLElement>(".window-header")!;
  const assert = (condition: unknown, label: string) => { if (!condition) throw new Error(label); checks.push(label); };
  const model: AllySheetViewModel = { idPrefix: "dom-check", name: "Íris", image: "", editable: true, activeTab: "details", editingName: true,
    profile: { schemaVersion: 1, description: "Descrição", isDrone: true },
    support: { revision: 1, status: "active", beneficiaryId: "mauro", waitRound: null, diagnostic: null, isGM: true,
      pilotAbilitiesEnabled: true, pilotId: "rafa", beneficiaries: [{ id: "mauro", name: "Mauro" }, { id: "rafa", name: "Rafa" }] },
    abilities: [{ id: "one", name: "Medicina", usable: true }, { id: "two", name: "Comando", usable: true }] };
  const render = () => { const result = document.createElement("div"); result.className = "ally-sheet-content"; result.innerHTML = renderAllySheet(model); updateAllySheetDOM(content, result); };
  try {
    render();
    const input = host.querySelector<HTMLInputElement>('[data-ally-field="name"]')!;
    const header = host.querySelector(".ally-header"), tabs = host.querySelector(".ally-tabs"), panel = host.querySelector<HTMLElement>('[data-tab="details"].tab')!;
    input.focus(); input.value = "Rascunho local"; input.setSelectionRange(2, 7);
    panel.scrollTop = 50;
    model.name = "Nome remoto"; model.abilities[0].name = "Medicina atualizada"; render();
    assert(host.querySelector('[data-ally-field="name"]') === input, "same editable node after reconciliation");
    assert(document.activeElement === input && input.value === "Rascunho local", "focused local text survives a remote update");
    assert(input.selectionStart === 2 && input.selectionEnd === 7, "text selection survives rendering");
    assert(panel.scrollTop === 50, "content scroll position survives rendering");
    assert(host.querySelector(".ally-header") === header && host.querySelector(".ally-tabs") === tabs, "header and navigation nodes stay mounted");
    assert(host.querySelector('[data-tab="details"].tab') === panel && panel?.classList.contains("active"), "active tab remains mounted");
    assert(header!.contains(input) && !panel.querySelector('[name="name"], [name="img"]'), "identity edits belong only to the permanent header");
    input.blur(); model.fields = { name: { value: "Rascunho local", baseline: "Íris", dirty: true, saving: false, error: "Conflito" } }; render();
    assert(input.value === "Rascunho local" && host.textContent?.includes("Conflito"), "dirty blurred text and field error survive updates");
    const row = host.querySelector('[data-ally-key="ability-one"]')!; const menu = row.querySelector("details")!; menu.open = true;
    model.abilities.reverse(); render(); assert(host.querySelector('[data-ally-key="ability-one"]') === row && menu.open, "keyed rows and an open menu survive reorder");
    model.abilities[1].expanded = true; model.abilities[1].descriptionHTML = "<p><em>Descrição real</em></p>"; render();
    const descriptions = host.querySelectorAll<HTMLElement>('.ally-ability-description:not([hidden])');
    assert(descriptions.length === 2 && Array.from(descriptions).every(node => node.querySelector("em")), "both tabs share expanded enriched ability rows");
    assert(!row.querySelector('button button, button details'), "use, expansion, edit and menu controls are independent");
    assert(getComputedStyle(host).boxShadow === "none", "only the Ally window has no external shadow");
    const frameStyle = getComputedStyle(host), windowHeaderStyle = getComputedStyle(windowHeader), contentStyle = getComputedStyle(content);
    assert(frameStyle.backgroundColor === windowHeaderStyle.backgroundColor && frameStyle.borderTopColor === windowHeaderStyle.backgroundColor
      && frameStyle.borderLeftColor === windowHeaderStyle.backgroundColor, "frame and title bar share the same dark surface and border");
    assert(contentStyle.backgroundColor === "rgb(248, 244, 238)" && contentStyle.backgroundColor !== frameStyle.backgroundColor,
      "the beige background belongs to window content, including its padding");
    assert(frameStyle.overflow === "hidden" && parseFloat(frameStyle.borderTopLeftRadius) > 0 && windowHeaderStyle.borderTopLeftRadius === "0px"
      && windowHeader.getBoundingClientRect().width === host.clientWidth, "the outer frame alone clips the full-width title bar to rounded corners");
    model.activeTab = "support"; render();
    const use = host.querySelector<HTMLButtonElement>('.ally-use')!, overlay = use.querySelector<HTMLElement>("i")!, icon = use.querySelector("img")!;
    const bounds = use.getBoundingClientRect(), iconBounds = icon.getBoundingClientRect(), overlayBounds = overlay.getBoundingClientRect();
    assert(getComputedStyle(overlay).opacity === "0" && iconBounds.width === bounds.width && iconBounds.height === bounds.height,
      "normal use icon shows the full Item image without a permanent die");
    assert(overlayBounds.width === bounds.width && overlayBounds.height === bounds.height && overlayBounds.x === bounds.x && overlayBounds.y === bounds.y,
      `roll overlay covers exactly the original icon area (${overlayBounds.width}×${overlayBounds.height} at ${overlayBounds.x},${overlayBounds.y}; icon ${bounds.width}×${bounds.height} at ${bounds.x},${bounds.y})`);
    use.focus(); getComputedStyle(overlay).opacity;
    for (const animation of overlay.getAnimations()) animation.finish();
    assert(getComputedStyle(overlay).opacity === "1" && use.getBoundingClientRect().width === bounds.width && use.getBoundingClientRect().height === bounds.height,
      "keyboard focus reveals the full roll overlay without layout movement");
    use.blur(); getComputedStyle(overlay).opacity;
    for (const animation of overlay.getAnimations()) animation.finish();
    assert(getComputedStyle(overlay).opacity === "0", "roll overlay disappears when focus ends");
    model.activeTab = "details"; model.profile!.description = ""; model.descriptionHTML = ""; render();
    const card = host.querySelector<HTMLElement>(".ally-description-card")!, cardStyle = getComputedStyle(card);
    const heading = host.querySelector<HTMLElement>(".ally-description > h2")!;
    assert(!card.contains(heading) && heading.parentElement === card.parentElement && heading.getBoundingClientRect().bottom <= card.getBoundingClientRect().top,
      "description title sits above and outside the bordered text card");
    assert(parseFloat(cardStyle.borderTopWidth) > 0 && parseFloat(cardStyle.paddingTop) > 0 && parseFloat(cardStyle.borderTopLeftRadius) > 0
      && cardStyle.backgroundColor !== "rgba(0, 0, 0, 0)" && card.getBoundingClientRect().height >= 180,
      "empty description retains a padded, bordered card with a light background");
    model.profile!.description = "<p><strong>Formatado</strong></p>"; model.descriptionHTML = model.profile!.description; render();
    assert(host.querySelector(".ally-description-card") === card && card.querySelector("prose-mirror strong") && !card.querySelector("textarea"),
      "formatted description stays inside the same card and native editor");
    model.support!.pilotAbilitiesEnabled = false; render(); assert(!host.querySelector('[data-ally-pilot]'), "pilot disappears without replacing details");
    assert(host.querySelector('[data-ally-field="name"]') === input, "policy changes preserve unrelated fields");
    model.editable = false; render(); assert(input.disabled, "lost ownership disables existing fields");
    assert(!host.querySelector('[data-action="removeAbility"]'), "lost ownership removes mutation actions");
    model.support!.beneficiaryId = null; model.support!.status = "inactive"; render();
    assert((host.querySelector('[data-ally-beneficiary]') as HTMLSelectElement).value === "", "clearing beneficiary selects Nenhum");
    return checks;
  } finally { host.remove(); }
}
