import { MODULE_ID } from "../../constants";
import { ALLY_PASSIVE_EFFECT_FLAG } from "./config/ally-ability-config";

export function registerAllyEffectSheetIntegration(): void {
  const reject = () => { ui.notifications?.warn("Benefícios passivos usam projeção pelo suporte. A transferência nativa deve permanecer desativada."); return false; };
  Hooks.on("preCreateActiveEffect", (effect: AllyEffectLike, data: Record<string, any>) => {
    if ((effect.parent as Item | undefined)?.type !== "ability" || !effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG)) return;
    if ((data.transfer ?? effect.transfer) === true) return reject();
  });
  Hooks.on("preUpdateActiveEffect", (effect: AllyEffectLike, changes: Record<string, any>) => {
    const proposed = changes[`flags.${MODULE_ID}.${ALLY_PASSIVE_EFFECT_FLAG}`]
      ?? changes[`flags.${MODULE_ID}`]?.[ALLY_PASSIVE_EFFECT_FLAG]
      ?? changes.flags?.[MODULE_ID]?.[ALLY_PASSIVE_EFFECT_FLAG];
    const marker = proposed
      ?? effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG);
    if ((effect.parent as Item | undefined)?.type === "ability" && marker
      && (changes.transfer === true || (proposed && (changes.transfer ?? effect.transfer) === true))) return reject();
  });
  Hooks.on("preCreateItem", (item: Item) => {
    if (item.type !== "ability") return;
    const effects = item.toObject(true).effects as Record<string, any>[] | undefined;
    if (!effects?.some(effect => effect.flags?.[MODULE_ID]?.[ALLY_PASSIVE_EFFECT_FLAG] && effect.transfer)) return;
    return reject();
  });
}
