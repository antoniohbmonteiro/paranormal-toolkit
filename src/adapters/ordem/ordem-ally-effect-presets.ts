import type { AllyEffectTemplate } from "../../core/allies/ally-passive-effect";
import type { OrdemEffectPreset } from "./ordem-effect-presets";
import { ordemBonusChange } from "./ordem-effect-presets";
import { ORDEM_AGENT_BONUS_PATHS } from "./ordem-paths";

// Legacy migration and projection fallback compare this output by fingerprint; keep it stable.
export function buildDefenseTemplate(name: string, value: number): AllyEffectTemplate {
  if (!name.trim() || !Number.isFinite(value)) throw new Error("Informe um nome e um bônus numérico válido.");
  return { ...buildCustomTemplate(name), system: {
    changes: [ordemBonusChange(ORDEM_AGENT_BONUS_PATHS.defense, value)],
  } };
}
export function buildCustomTemplate(name = "Benefício passivo personalizado"): AllyEffectTemplate {
  return { name, type: "base", img: "icons/svg/aura.svg", description: "", system: { changes: [] }, statuses: [],
    tint: "#ffffff", showIcon: 1, duration: { value: null, units: "seconds", expiry: null } };
}
export function buildAllyPresetTemplate(preset: OrdemEffectPreset): AllyEffectTemplate {
  return { ...buildCustomTemplate(preset.name), system: { changes: structuredClone(preset.changes) } };
}
