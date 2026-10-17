import { describe, expect, it } from "vitest";
import { renderAllyAbilityConfig, type AllyBenefitConfigView } from "../../../../src/ui/components/ally/ally-ability-config";

function view(overrides: Partial<AllyBenefitConfigView> = {}): AllyBenefitConfigView {
  return {
    editable: true,
    presets: [
      { id: "defense", label: "Bônus de Defesa", selected: true },
      { id: "skill", label: "Bônus de Perícia", selected: false },
      { id: "diceBonus", label: "Bônus de Dados (+Xd20)", selected: false },
    ],
    fields: [{ kind: "value", value: "5" }],
    unavailableMessage: null,
    canAdd: true,
    effects: [{ id: 'id"><script>x</script>', name: "Bônus de Defesa", kind: "defense", summary: "+5 Defesa", disabled: false, diagnostic: null }],
    ...overrides,
  };
}

describe("passive benefits window renderer", () => {
  it("renders presets, stacked fields and discreet row actions without mutating the view", () => {
    const config = view();
    const before = structuredClone(config);
    const html = renderAllyAbilityConfig(config);
    expect(config).toEqual(before);
    expect(html).toContain("automaticamente");
    expect(html).toContain('<select name="presetId">');
    expect(html).toContain('<option value="defense" selected>Bônus de Defesa</option>');
    expect(html).toContain('<option value="diceBonus">Bônus de Dados (+Xd20)</option>');
    expect(html).toContain('type="text" name="value"');
    expect(html).not.toContain('name="skillId"');
    expect(html.indexOf('name="presetId"')).toBeLessThan(html.indexOf('name="value"'));
    expect(html).toContain('data-action="addBenefit">');
    expect(html).toContain('data-action="createCustom"');
    expect(html).toContain('data-action="editEffect"');
    expect(html).toContain('data-action="removeEffect"');
    expect(html).toContain("+5 Defesa");
    expect(html).toContain("fa-shield");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("renders the skill selector above the value only when the preset needs it", () => {
    const html = renderAllyAbilityConfig(view({ fields: [
      { kind: "skill", options: [{ id: "occultism", label: "Ocultismo", selected: true }, { id: "fighting", label: "Luta", selected: false }] },
      { kind: "value", value: "3" },
    ] }));
    expect(html).toContain('<option value="occultism" selected>Ocultismo</option>');
    expect(html.indexOf('name="skillId"')).toBeLessThan(html.indexOf('name="value"'));
    expect(html).toContain('value="3"');
  });

  it("shows the unavailable notice and disables only the add button for the dice preset", () => {
    const html = renderAllyAbilityConfig(view({ fields: [], unavailableMessage: "AINDA NÃO IMPLEMENTADO NO SISTEMA", canAdd: false }));
    expect(html).toContain("AINDA NÃO IMPLEMENTADO NO SISTEMA");
    expect(html).toContain('data-action="addBenefit" disabled');
    expect(html).not.toContain('data-action="createCustom" title="Cria um efeito vazio e abre o editor nativo do Foundry" disabled');
    expect(html).not.toContain('name="value"');
  });

  it("marks disabled and incompatible rows and renders an empty state", () => {
    const html = renderAllyAbilityConfig(view({ effects: [
      { id: "custom", name: "Proteção", kind: "custom", summary: "Personalizado · 2 mudanças", disabled: true, diagnostic: "Estrutura incompatível" },
    ] }));
    expect(html).toContain("is-disabled");
    expect(html).toContain("Desativado");
    expect(html).toContain('role="alert"');
    expect(html).toContain("fa-file-lines");
    expect(renderAllyAbilityConfig(view({ effects: [] }))).toContain("Nenhum benefício configurado.");
  });

  it("disables every control for users who cannot configure the ability", () => {
    const html = renderAllyAbilityConfig(view({ editable: false, canAdd: false }));
    expect(html).toContain('<select name="presetId" disabled>');
    expect(html.match(/ disabled>/g)?.length).toBeGreaterThanOrEqual(5);
  });

  it("contains no ally sheet structures", () => {
    const html = renderAllyAbilityConfig(view());
    for (const fragment of ["ally-portrait", "ally-tabs", "data-ally-beneficiary", "data-ally-pilot", "data-effect-name"]) {
      expect(html).not.toContain(fragment);
    }
  });
});
