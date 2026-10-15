import { MODULE_ID } from "../../constants";
import { ALLY_PASSIVE_EFFECT_FLAG, canConfigureAllyEffects } from "./config/ally-ability-config";

export function registerAllyEffectSheetIntegration(): void {
  Hooks.on("getHeaderControlsItemSheetV2", (sheet: { item?: Item; document?: Item }, controls: any[]) => {
    const item = sheet.item ?? sheet.document;
    const action = `${MODULE_ID}.passiveBenefits`;
    if (!item || !canConfigureAllyEffects(item) || controls.some(control => control.action === action)) return;
    controls.push({ action, icon: "fa-solid fa-shield-halved", label: "Benefícios passivos — Toolkit", visible: true,
      onClick: () => { void import("../../applications/ally-ability-config-application").then(async ({ AllyAbilityConfigApplication }) => {
        if (canConfigureAllyEffects(item)) await new AllyAbilityConfigApplication(item).render({ force: true });
      }).catch(error => ui.notifications?.warn(error instanceof Error ? error.message : "Falha ao abrir benefícios passivos.")); },
    });
  });
  Hooks.on("preCreateActiveEffect", (effect: AllyEffectLike, data: Record<string, any>) => {
    if ((effect.parent as Item | undefined)?.type !== "ability" || !effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG)) return;
    effect.updateSource({ transfer: false }); data.transfer = false;
  });
  Hooks.on("preUpdateActiveEffect", (effect: AllyEffectLike, changes: Record<string, any>) => {
    const marker = changes[`flags.${MODULE_ID}.${ALLY_PASSIVE_EFFECT_FLAG}`] ?? changes.flags?.[MODULE_ID]?.[ALLY_PASSIVE_EFFECT_FLAG]
      ?? effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG);
    if ((effect.parent as Item | undefined)?.type === "ability" && marker) changes.transfer = false;
  });
  Hooks.on("preCreateItem", (item: Item) => {
    if (item.type !== "ability") return;
    const effects = item.toObject(true).effects as Record<string, any>[] | undefined;
    if (!effects?.some(effect => effect.flags?.[MODULE_ID]?.[ALLY_PASSIVE_EFFECT_FLAG] && effect.transfer)) return;
    item.updateSource({ effects: effects.map(effect => effect.flags?.[MODULE_ID]?.[ALLY_PASSIVE_EFFECT_FLAG]
      ? { ...effect, transfer: false } : effect) });
  });
}
