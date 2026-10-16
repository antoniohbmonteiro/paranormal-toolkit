import { describe, expect, it } from "vitest";
import { renderAllySheet, type AllySheetViewModel } from "../../../../src/ui/components/ally/ally-sheet";

function model(): AllySheetViewModel {
  return { name: 'Íris"><script>alert(1)</script>', image: 'image.webp" onerror="alert(1)',
    profile: { schemaVersion: 1, description: "</textarea><script>alert(2)</script>", isDrone: true },
    editable: true, abilities: [{ id: 'a" onclick="x', name: "<img src=x onerror=x>", usable: true }],
    support: { revision: 4, beneficiaryId: "b", status: "active", waitRound: null, diagnostic: null, isGM: true,
      beneficiaries: [{ id: "b", name: "Mauro" }, { id: "p", name: '<script>Piloto</script>' }] } };
}
describe("final Ally sheet pure renderer", () => {
  it("renders header, three native tabs and content in that order without obsolete controls", () => {
    const input = model(), before = structuredClone(input), html = renderAllySheet(Object.freeze(input));
    expect(html.indexOf('class="ally-header"')).toBeLessThan(html.indexOf('role="tablist"'));
    expect(html.indexOf('role="tablist"')).toBeLessThan(html.indexOf('class="ally-content"'));
    expect(html.match(/role="tab"/g)).toHaveLength(3); expect(html.match(/role="tabpanel"/g)).toHaveLength(3);
    expect(html).toContain('data-tab="support" role="tab" aria-selected="true"');
    expect(html).toContain("Ajudando Mauro"); expect(html).toContain('<option value="">Nenhum</option>');
    expect(html).not.toMatch(/assignSupport|activateSupport|deactivateSupport|savePilot|type="submit"|Estado:|Destino das habilidades|ally-poc-notice/);
    expect(html).not.toContain('data-action="reconcileSupport"'); expect(input).toEqual(before);
  });
  it.each(["support", "abilities", "details"] as const)("preserves the selected %s tab while keeping the header", activeTab => {
    const html = renderAllySheet({ ...model(), activeTab });
    expect(html).toContain(`data-tab="${activeTab}" role="tab" aria-selected="true"`);
    expect(html).toContain('class="ally-header"'); expect(html.match(/aria-selected="true"/g)).toHaveLength(1);
  });
  it.each([[false, false], [false, true], [true, false], [true, true]])("shows pilot only for enabled=%s and drone=%s", (enabled, drone) => {
    const input = model(); input.profile!.isDrone = drone;
    Object.assign(input.support!, { pilotAbilitiesEnabled: enabled, pilotId: "p" });
    const html = renderAllySheet(input);
    expect(html.includes('data-ally-pilot')).toBe(enabled && drone);
    if (enabled && drone) {
      expect(html).toContain('value="">Sem piloto'); expect(html).toContain('value="p" selected');
      expect(html).toContain("&lt;script&gt;Piloto&lt;/script&gt;");
      expect(renderAllySheet({ ...input, editable: false })).toMatch(/data-ally-pilot[^>]*disabled/);
    }
  });
  it("escapes user data and separates source details, use and management actions", () => {
    const html = renderAllySheet(model());
    expect(html).not.toContain("<script>"); expect(html).toContain("&lt;script&gt;");
    expect(html).toContain('data-action="useAbility"'); expect(html).toContain('data-action="openAbility"');
    expect(html).toContain('data-action="configureBenefits"'); expect(html).toContain('data-action="removeAbility"');
    expect(html).toContain('name="system.isDrone" data-ally-field="system.isDrone" checked');
    expect(html).toContain('data-action="editAllyImage"'); expect(html).toContain('data-action="toggleAbility"');
  });
  it("keeps readable details and authorized use without granting editing controls to non-owners", () => {
    const html = renderAllySheet({ ...model(), editable: false });
    expect(html).toContain('data-action="openAbility"'); expect(html).toContain('data-action="useAbility"');
    expect(html).not.toMatch(/data-action="(?:createAbility|removeAbility|configureBenefits)"/);
    expect(html).toMatch(/data-ally-field="name"[^>]*disabled/);
  });
  it("disables unsupported profiles and pending selectors, and displays safe feedback", () => {
    const input = model(); input.support!.busy = true;
    const html = renderAllySheet({ ...input, profile: null });
    expect(html).toContain('role="alert"'); expect(html).toMatch(/data-ally-beneficiary[^>]*disabled/);
    expect(html).toContain("Atualizando suporte…"); expect(html).not.toContain('data-action="createAbility"');
  });
  it.each([[null, "inactive", null, "Sem suporte"], ["b", "pending", 5, "Aguardando rodada 5 — Mauro"]])("shows contextual support %s/%s", (beneficiaryId, status, waitRound, label) => {
    const input = model(); Object.assign(input.support!, { beneficiaryId, status, waitRound });
    expect(renderAllySheet(input)).toContain(String(label));
  });
  it("shows empty abilities, a disabled use reason and unique native panel IDs", () => {
    const input = model(); input.idPrefix = "world-sheet"; input.abilities[0] = { ...input.abilities[0], usable: false, useReason: "Sem permissão" };
    const html = renderAllySheet(input);
    expect(html).toContain('title="Sem permissão" disabled'); expect(html).toContain('id="world-sheet-support"');
    expect(renderAllySheet({ ...input, abilities: [] })).toContain("Nenhuma habilidade adicionada.");
  });
  it("uses exactly the same ability component on both tabs with distinct accessible IDs", () => {
    const input = model(); input.abilities[0] = { id: "one", name: "Medicina", execution: "Padrão", cost: "2 PE", usable: true, expanded: true, descriptionHTML: "<p><strong>Descrição enriquecida</strong></p>" };
    const html = renderAllySheet(input), lists = html.match(/<ul class="ally-abilities">[\s\S]*?<\/ul>/g)!;
    expect(lists).toHaveLength(2);
    expect(lists[0].replaceAll("ally-support-", "ally-abilities-")).toBe(lists[1]);
    expect(html.match(/aria-expanded="true"/g)).toHaveLength(2);
    expect(html).toContain(input.abilities[0].descriptionHTML);
    expect(html).not.toContain("ally-summary-row");
    const ids = Array.from(html.matchAll(/ id="([^"]+)"/g), match => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("keeps name and native portrait edits in the permanent header, with only drone and rich text in Details", () => {
    const input = model(); input.editingName = true; input.descriptionHTML = "<p>Descrição <em>formatada</em></p>";
    const html = renderAllySheet(input), header = html.match(/<header[\s\S]*?<\/header>/)![0];
    const details = html.slice(html.indexOf('aria-label="Detalhes do Aliado"'));
    expect(header).toContain('data-action="editAllyName"'); expect(header).toContain('data-action="editAllyImage"');
    expect(header).toMatch(/data-ally-field="name"[^>]*required>/);
    expect(details).not.toMatch(/name="(?:name|img)"|<textarea|<file-picker/);
    expect(details).toContain('name="system.description"'); expect(details).toContain(input.descriptionHTML);
    expect(html.match(/name="name"/g)).toHaveLength(1);
  });
  it("does not invent raw HTML for a profile lacking native enrichment", () => {
    const html = renderAllySheet(model());
    expect(html).not.toContain("<script>");
    expect(html).toMatch(/<prose-mirror[^>]+toggled>/);
    expect(renderAllySheet({ ...model(), editable: false })).toMatch(/<prose-mirror[^>]+toggled disabled>/);
  });
  it.each(["", "<p><strong>Formatado</strong></p>"])("keeps the description heading above and outside its text card for HTML %s", descriptionHTML => {
    const html = renderAllySheet({ ...model(), descriptionHTML });
    expect(html).toMatch(/<h2>Descrição<\/h2>\s*<div class="ally-description-card"/);
    const card = html.match(/<div class="ally-description-card"[\s\S]*?<\/div>/)![0];
    expect(card).toContain("<prose-mirror"); expect(card).toContain(descriptionHTML);
    expect(card).not.toContain("<h2>"); expect(card).not.toContain("<textarea");
  });
});
