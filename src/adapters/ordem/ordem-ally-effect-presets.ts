import type { AllyEffectTemplate } from "../../core/allies/ally-passive-effect";

export function buildDefenseTemplate(name: string, value: number): AllyEffectTemplate {
  if (!name.trim() || !Number.isFinite(value)) throw new Error("Informe um nome e um bônus numérico válido.");
  return { ...buildCustomTemplate(name), system: {
    changes: [{ key: "system.defense.value", type: "add", value, phase: "initial", priority: 20 }],
  } };
}
export function buildCustomTemplate(name = "Benefício passivo personalizado"): AllyEffectTemplate {
  return { name, type: "base", img: "icons/svg/aura.svg", description: "", system: { changes: [] }, statuses: [],
    tint: "#ffffff", showIcon: 1, duration: { value: null, units: "seconds", expiry: null } };
}
