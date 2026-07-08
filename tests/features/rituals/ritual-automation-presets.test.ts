import { describe, expect, it } from "vitest";
import {
  createRitualSimpleHealingDefinition,
  createRitualSimpleHealingPreset,
} from "../../../src/features/rituals/ritual-automation-presets";

describe("createRitualSimpleHealingPreset", () => {
  it("configura Cicatrização com fórmulas por forma", () => {
    const preset = createRitualSimpleHealingPreset();
    const forms = preset.automation.ritualForms;

    expect(preset.version).toBe("1.1.0");
    expect(forms?.base?.rollFormulaOverrides?.healing).toBe("3d8+3");
    expect(forms?.discente?.extraCost).toBe(2);
    expect(forms?.discente?.rollFormulaOverrides?.healing).toBe("5d8+5");
    expect(forms?.verdadeiro?.extraCost).toBe(9);
    expect(forms?.verdadeiro?.rollFormulaOverrides?.healing).toBe("7d8+7");
    expect(preset.itemPatch?.ritual.studentForm).toBe(true);
    expect(preset.itemPatch?.ritual.trueForm).toBe(true);
  });
});

describe("createRitualSimpleHealingDefinition", () => {
  it("mantém compatibilidade com fórmula simples customizada", () => {
    const definition = createRitualSimpleHealingDefinition("1d8");

    expect(definition.ritualForms?.base?.rollFormulaOverrides?.healing).toBe("1d8");
    expect(definition.ritualForms?.discente?.rollFormulaOverrides?.healing).toBe("1d8");
    expect(definition.ritualForms?.verdadeiro?.rollFormulaOverrides?.healing).toBe("1d8");
  });
});
