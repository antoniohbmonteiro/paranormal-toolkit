import { renderItemEffectConfig } from "../item-effects/item-effect-config";
import type { ItemEffectConfigView } from "../../../features/item-effects/item-effect-config-view";
export type { ItemEffectFieldView as AllyBenefitFieldView, ItemEffectRowView as AllyBenefitRowView, ItemEffectConfigView as AllyBenefitConfigView } from "../../../features/item-effects/item-effect-config-view";

export function renderAllyAbilityConfig(view: ItemEffectConfigView): string {
  return renderItemEffectConfig({ ...view, benefits: true });
}
