import { describe, expect, it } from "vitest";
import { buildCustomTemplate, buildDefenseTemplate } from "../../../../src/adapters/ordem/ordem-ally-effect-presets";
import { buildAllyBenefitConfigView, defaultAllyBenefitDraft } from "../../../../src/features/allies/ally-benefit-config-view";

const draft = (presetId: string) => ({ ...defaultAllyBenefitDraft(), presetId });

describe("passive benefits window view model", () => {
  it("starts on the defense preset with only the value field", () => {
    const view = buildAllyBenefitConfigView({ editable: true, draft: defaultAllyBenefitDraft(), effects: [] });
    expect(view.presets.map(preset => preset.id)).toEqual(["defense", "skill", "movement", "maxPV", "maxPE", "maxPD", "diceBonus"]);
    expect(view.presets.find(preset => preset.selected)?.id).toBe("defense");
    expect(view.fields).toEqual([{ kind: "value", value: "5" }]);
    expect(view).toMatchObject({ canAdd: true, unavailableMessage: null, effects: [] });
  });

  it.each(["defense", "movement", "maxPV", "maxPE", "maxPD"])("shows only the value for %s", presetId => {
    expect(buildAllyBenefitConfigView({ editable: true, draft: draft(presetId), effects: [] }).fields.map(field => field.kind)).toEqual(["value"]);
  });

  it("adds the skill selector before the value and keeps the drafted skill selected", () => {
    const view = buildAllyBenefitConfigView({ editable: true, draft: { presetId: "skill", value: "3", skillId: "occultism" }, effects: [] });
    expect(view.fields.map(field => field.kind)).toEqual(["skill", "value"]);
    const skill = view.fields[0];
    expect(skill.kind === "skill" && skill.options.filter(option => option.selected).map(option => option.id)).toEqual(["occultism"]);
    expect(view.fields[1]).toEqual({ kind: "value", value: "3" });
  });

  it("blocks the dice preset with the system notice and no fields", () => {
    const view = buildAllyBenefitConfigView({ editable: true, draft: draft("diceBonus"), effects: [] });
    expect(view).toMatchObject({ fields: [], canAdd: false, unavailableMessage: "AINDA NÃO IMPLEMENTADO NO SISTEMA" });
  });

  it("falls back to the first preset for unknown drafts and disables adding for read-only users", () => {
    expect(buildAllyBenefitConfigView({ editable: true, draft: draft("unknown"), effects: [] }).presets.find(preset => preset.selected)?.id).toBe("defense");
    expect(buildAllyBenefitConfigView({ editable: false, draft: defaultAllyBenefitDraft(), effects: [] }).canAdd).toBe(false);
  });

  it("describes recognized, legacy, custom, disabled and incompatible effects", () => {
    const skill = { ...buildCustomTemplate("Bônus de Perícia (Luta)"), system: { changes: [
      { key: "system.skills.fighting.value", type: "add", value: 2, phase: "initial", priority: 20 },
    ] } };
    const custom = { ...buildCustomTemplate("Proteção"), statuses: ["blind"], system: { changes: [
      { key: "system.defense.value", type: "add", value: 1, phase: "initial", priority: 20 },
      { key: "system.desloc.value", type: "add", value: 3, phase: "initial", priority: 20 },
    ] } };
    const view = buildAllyBenefitConfigView({ editable: true, draft: defaultAllyBenefitDraft(), effects: [
      { id: "legacy", name: "Bônus de Defesa +7", disabled: false, template: buildDefenseTemplate("Bônus de Defesa +7", 7) },
      { id: "skill", name: skill.name, disabled: true, template: skill },
      { id: "custom", name: "Proteção", disabled: false, template: custom },
      { id: "empty", name: "Novo", disabled: false, template: buildCustomTemplate("Novo") },
      { id: "broken", name: "Quebrado", disabled: false, template: null },
    ] });
    expect(view.effects).toEqual([
      { id: "legacy", name: "Bônus de Defesa +7", kind: "defense", summary: "+7 Defesa", disabled: false, diagnostic: null },
      { id: "skill", name: "Bônus de Perícia (Luta)", kind: "skill", summary: "Luta +2", disabled: true, diagnostic: null },
      { id: "custom", name: "Proteção", kind: "custom", summary: "Personalizado · 2 mudanças, 1 condição", disabled: false, diagnostic: null },
      { id: "empty", name: "Novo", kind: "custom", summary: "Personalizado · sem mudanças", disabled: false, diagnostic: null },
      { id: "broken", name: "Quebrado", kind: "custom", summary: "Personalizado", disabled: false,
        diagnostic: "Estrutura incompatível: revise as mudanças no editor nativo." },
    ]);
  });
});
