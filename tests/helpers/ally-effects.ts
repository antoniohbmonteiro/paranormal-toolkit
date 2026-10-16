import { buildDefenseTemplate } from "../../src/adapters/ordem/ordem-ally-effect-presets";
import type { AllyBenefit } from "../../src/core/allies/ally-definition";
export function defenseBenefit(id = "defense", value = 5): AllyBenefit {
  return { id, effectId: id, template: buildDefenseTemplate("Bônus de Defesa", value) };
}
