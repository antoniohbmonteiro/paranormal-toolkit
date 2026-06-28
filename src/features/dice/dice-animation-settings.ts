import { MODULE_ID } from "../../constants";

export const DICE_ANIMATION_SETTING_KEYS = {
  enabled: "dice.animations.enabled"
} as const;

export type DiceAnimationSettingsSnapshot = {
  enabled: boolean;
};

export function registerDiceAnimationSettings(): void {
  game.settings.register(MODULE_ID, DICE_ANIMATION_SETTING_KEYS.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
}

export function getDiceAnimationSettings(): DiceAnimationSettingsSnapshot {
  return {
    enabled: game.settings.get(MODULE_ID, DICE_ANIMATION_SETTING_KEYS.enabled) === true
  };
}

export async function setDiceAnimationEnabled(enabled: boolean): Promise<void> {
  await game.settings.set(MODULE_ID, DICE_ANIMATION_SETTING_KEYS.enabled, enabled);
}
