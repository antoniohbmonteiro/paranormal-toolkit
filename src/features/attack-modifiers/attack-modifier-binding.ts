import { MODULE_ID } from "../../constants";

export const ATTACK_MODIFIER_BINDING = "attackModifier";
export type AttackModifierBinding = { schemaVersion: 1; presetId: string; presetVersion: string };

export function readAttackModifierBinding(item: Pick<Item, "getFlag">): AttackModifierBinding | null {
  const raw = item.getFlag(MODULE_ID, ATTACK_MODIFIER_BINDING) as Partial<AttackModifierBinding> | null;
  return raw?.schemaVersion === 1 && typeof raw.presetId === "string" && raw.presetId.length > 0
    && typeof raw.presetVersion === "string" && raw.presetVersion.length > 0 ? raw as AttackModifierBinding : null;
}
export async function writeAttackModifierBinding(item: Item, binding: AttackModifierBinding | null): Promise<void> {
  if (binding) await item.setFlag(MODULE_ID, ATTACK_MODIFIER_BINDING, binding);
  else await item.unsetFlag(MODULE_ID, ATTACK_MODIFIER_BINDING);
}
