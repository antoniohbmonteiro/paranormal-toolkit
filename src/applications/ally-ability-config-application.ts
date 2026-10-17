import { ItemEffectConfigApplication, openItemEffectConfig } from "./item-effect-config-application";

export class AllyAbilityConfigApplication extends ItemEffectConfigApplication {
  static open(item: Item): Promise<ItemEffectConfigApplication> { return openItemEffectConfig(item); }
}
