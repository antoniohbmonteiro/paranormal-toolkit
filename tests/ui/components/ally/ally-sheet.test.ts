import { describe, expect, it } from "vitest";
import { renderAllySheet, type AllySheetViewModel } from "../../../../src/ui/components/ally/ally-sheet";

function model(): AllySheetViewModel {
  return { name: 'Íris"><script>alert(1)</script>', image: 'image.webp" onerror="alert(1)',
    profile: { schemaVersion: 1, description: "</textarea><script>alert(2)</script>", isDrone: true },
    editable: true, abilities: [{ id: 'a" onclick="x', name: "<img src=x onerror=x>" }] };
}

describe("ally sheet renderer", () => {
  it.each([[false, false], [false, true], [true, false], [true, true]])("only offers the pilot controls for enabled=%s drone=%s", (enabled, drone) => {
    const input = { ...model(), profile: { ...model().profile!, isDrone: drone }, support: { revision: 4, beneficiaryId: "b", status: "active", waitRound: null,
      diagnostic: null, isGM: false, pilotAbilitiesEnabled: enabled, pilotId: "p", abilityRecipientId: "p", combats: [],
      beneficiaries: [{ id: "b", name: "Beneficiário" }, { id: "p", name: '<script>Piloto</script>' }] } };
    const before = structuredClone(input); const html = renderAllySheet(Object.freeze(input));
    expect(html.includes('data-ally-pilot')).toBe(enabled && drone);
    expect(html.includes('data-action="savePilot"')).toBe(enabled && drone);
    expect(html).toContain("&lt;script&gt;Piloto&lt;/script&gt;"); expect(input).toEqual(before);
    expect(renderAllySheet({ ...input, editable: false })).not.toContain('data-action="savePilot"');
  });
  it("escapes user fields and offers item management without execution actions", () => {
    const input = model();
    const before = structuredClone(input);
    const html = renderAllySheet(Object.freeze(input));
    expect(input).toEqual(before);
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).toContain('data-action="createAbility"');
    expect(html).toContain('data-action="removeAbility"');
    expect(html).not.toMatch(/data-action="(?:useAbility|onRoll|roll)/);
    expect(html).toContain('name="system.isDrone" checked');
  });

  it("keeps read access without mutation controls for non-owners", () => {
    const html = renderAllySheet({ ...model(), editable: false });
    expect(html).toContain("<fieldset disabled>");
    expect(html).toContain('data-action="openAbility"');
    expect(html).not.toContain('data-action="createAbility"');
    expect(html).not.toContain('data-action="removeAbility"');
  });

  it("preserves unknown data by disabling edition", () => {
    const html = renderAllySheet({ ...model(), profile: null });
    expect(html).toContain('role="alert"');
    expect(html).toContain("<fieldset disabled>");
    expect(html).not.toContain('data-action="createAbility"');
  });
  it("offers support and GM reconciliation without approval or environment gates", () => {
    const html = renderAllySheet({ ...model(), support: { revision: 0, beneficiaryId: null,
      status: "inactive", waitRound: null, diagnostic: null, isGM: true, beneficiaries: [], combats: [] } });
    expect(html).toContain('data-action="assignSupport"');
    expect(html).toContain('data-action="activateSupport"');
    expect(html).toContain('data-action="deactivateSupport"');
    expect(html).toContain('data-action="reconcileSupport"');
    expect(html).not.toMatch(/approveSupport|validateSupport|aprova|validado|validação/);
  });
});
