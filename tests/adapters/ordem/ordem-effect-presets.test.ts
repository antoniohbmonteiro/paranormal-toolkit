import { describe, expect, it } from "vitest";
import { buildAllyPresetTemplate, buildCustomTemplate, buildDefenseTemplate } from "../../../src/adapters/ordem/ordem-ally-effect-presets";
import { isOrdemAgentSkillId, ORDEM_AGENT_SKILLS } from "../../../src/adapters/ordem/ordem-agent-skills";
import {
  buildOrdemEffectPreset, ORDEM_EFFECT_PRESETS, parseOrdemBonusValue, recognizeOrdemEffectPreset, readOrdemEffectPreset,
} from "../../../src/adapters/ordem/ordem-effect-presets";
import { readEffectTemplate, stableEffectFingerprint } from "../../../src/core/allies/ally-passive-effect";

const bonus = (key: string, value: number) => ({ key, type: "add", value, phase: "initial", priority: 20 });

describe("Ordem effect presets", () => {
  it.each([
    ["defense", undefined, "Bônus de Defesa", "system.defense.value", "+5 Defesa"],
    ["movement", undefined, "Bônus de Deslocamento", "system.desloc.value", "+5 Deslocamento"],
    ["maxPV", undefined, "Bônus de PV máximo", "system.PV.bonus", "+5 PV máximo"],
    ["maxPE", undefined, "Bônus de PE máximo", "system.PE.bonus", "+5 PE máximo"],
    ["maxPD", undefined, "Bônus de PD máximo", "system.PD.bonus", "+5 PD máximo"],
    ["skill", "occultism", "Bônus de Perícia (Ocultismo)", "system.skills.occultism.value", "Ocultismo +5"],
  ])("builds the %s preset as one additive initial change and recognizes it", (presetId, skillId, name, key, summary) => {
    const result = buildOrdemEffectPreset({ presetId, value: "5", skillId });
    expect(result).toEqual({ ok: true, value: { presetId, name, changes: [bonus(key, 5)] } });
    if (!result.ok) return;
    expect(recognizeOrdemEffectPreset(result.value.changes)).toEqual({ presetId, summary });
  });

  it("keeps builders free of flags, transfer and ally data", () => {
    const result = buildOrdemEffectPreset({ presetId: "maxPV", value: "-2" });
    expect(result.ok && Object.keys(result.value).sort()).toEqual(["changes", "name", "presetId"]);
    expect(JSON.stringify(result)).not.toMatch(/allyPassive|transfer|flags/);
  });

  it.each(["", "  ", "abc", "1.5", "0", "-0", "1e3", "5px", "99999999999999999999"])("rejects the value %j", value => {
    expect(parseOrdemBonusValue(value)).toBeNull();
    expect(buildOrdemEffectPreset({ presetId: "defense", value })).toEqual({ ok: false, error: "Informe um valor inteiro diferente de zero." });
  });

  it.each([["+5", 5], ["-2", -2], [" 10 ", 10]])("accepts the integer %j", (value, expected) => {
    expect(parseOrdemBonusValue(value)).toBe(expected);
  });

  it.each([undefined, "", "freeSkill", "__proto__", "constructor", "Occultism", "system.skills"])("rejects the skill %j", skillId => {
    expect(buildOrdemEffectPreset({ presetId: "skill", value: "5", skillId })).toEqual({ ok: false, error: "Selecione uma perícia válida." });
  });

  it("lists the 27 standard Ordem agent skills with unique ids, excluding the free skill", () => {
    expect(ORDEM_AGENT_SKILLS).toHaveLength(27);
    expect(new Set(ORDEM_AGENT_SKILLS.map(skill => skill.id)).size).toBe(27);
    expect(isOrdemAgentSkillId("freeSkill")).toBe(false);
    expect(isOrdemAgentSkillId("will")).toBe(true);
  });

  it("keeps the dice preset visible but refuses to build it", () => {
    expect(ORDEM_EFFECT_PRESETS.find(preset => preset.id === "diceBonus")).toMatchObject({
      label: "Bônus de Dados (+Xd20)", fields: [], unavailableMessage: "AINDA NÃO IMPLEMENTADO NO SISTEMA",
    });
    expect(buildOrdemEffectPreset({ presetId: "diceBonus", value: "1" })).toEqual({ ok: false, error: "AINDA NÃO IMPLEMENTADO NO SISTEMA" });
    expect(buildOrdemEffectPreset({ presetId: "unknown", value: "1" })).toEqual({ ok: false, error: "Tipo de benefício desconhecido." });
  });

  it("does not recognize multi-change, other phases, other types or other keys", () => {
    expect(recognizeOrdemEffectPreset([])).toBeNull();
    expect(recognizeOrdemEffectPreset([bonus("system.defense.value", 1), bonus("system.desloc.value", 1)])).toBeNull();
    expect(recognizeOrdemEffectPreset([{ ...bonus("system.defense.value", 1), phase: "final" }])).toBeNull();
    expect(recognizeOrdemEffectPreset([{ ...bonus("system.defense.value", 1), type: "override" }])).toBeNull();
    expect(recognizeOrdemEffectPreset([bonus("system.skills.occultism.mod", 1)])).toBeNull();
    expect(recognizeOrdemEffectPreset([bonus("system.skills.freeSkill.value", 1)])).toBeNull();
    expect(readOrdemEffectPreset([{ ...bonus("system.defense.value", 0), value: "@NEX.value" }])).toBeNull();
    expect(recognizeOrdemEffectPreset([bonus("system.defense.value", -3)])).toEqual({ presetId: "defense", summary: "-3 Defesa" });
  });

  it.each(["PV", "PE", "PD", "SAN"])("identifies %s maximum formulas for display without treating them as editable presets", resource => {
    const changes = [{ ...bonus(`system.${resource}.bonus`, 0), value: "\n(@NEX.value / 5) * 1", priority: null }];
    const before = structuredClone(changes);
    expect(recognizeOrdemEffectPreset(changes)).toEqual({ presetId: `max${resource}`, summary: `Bônus de ${resource} máximo · fórmula personalizada` });
    expect(readOrdemEffectPreset(changes)).toBeNull();
    expect(changes).toEqual(before);
    expect(recognizeOrdemEffectPreset([{ ...changes[0], key: `system.${resource}.max` }])).toBeNull();
    expect(recognizeOrdemEffectPreset([{ ...changes[0], value: " \n " }])).toBeNull();
    expect(recognizeOrdemEffectPreset([{ ...changes[0], type: "override" }])).toBeNull();
    expect(recognizeOrdemEffectPreset([{ ...changes[0], phase: "final" }])).toBeNull();
  });
});

describe("ally composition of Ordem presets", () => {
  it("keeps the legacy defense template byte-stable for migration fingerprints", () => {
    expect(buildDefenseTemplate("Bônus de Defesa +7", 7)).toEqual({
      name: "Bônus de Defesa +7", type: "base", img: "icons/svg/aura.svg", description: "",
      system: { changes: [{ key: "system.defense.value", type: "add", value: 7, phase: "initial", priority: 20 }] },
      statuses: [], tint: "#ffffff", showIcon: 1, duration: { value: null, units: "seconds", expiry: null },
    });
  });

  it("composes every functional preset into a valid native template matching the custom shape", () => {
    for (const preset of ORDEM_EFFECT_PRESETS.filter(entry => !entry.unavailableMessage)) {
      const result = buildOrdemEffectPreset({ presetId: preset.id, value: "4", skillId: "fighting" });
      if (!result.ok) throw new Error(result.error);
      const template = buildAllyPresetTemplate(result.value);
      expect(readEffectTemplate(template)).toEqual(template);
      expect({ ...template, name: "x", system: { changes: [] } }).toEqual({ ...buildCustomTemplate("x") });
      result.value.changes[0].value = 99;
      expect(template.system.changes[0].value).toBe(4);
    }
    const defense = buildOrdemEffectPreset({ presetId: "defense", value: "5" });
    if (!defense.ok) throw new Error(defense.error);
    expect(stableEffectFingerprint(buildAllyPresetTemplate(defense.value))).toBe(stableEffectFingerprint(buildDefenseTemplate("Bônus de Defesa", 5)));
  });
});
