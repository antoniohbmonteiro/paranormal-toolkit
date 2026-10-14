import { MODULE_ID } from "../../../constants";
import { readAllyAbilityDefinition, type AllyAbilityDefinition } from "../../../core/allies/ally-definition";

export const ALLY_ABILITY_FLAG = "allyAbility";
export const ALLY_TYPE = `${MODULE_ID}.ally`;
export function isAllySourceItem(item: Item): boolean {
  return (item.parent ?? item.actor)?.type === ALLY_TYPE;
}
export function readAllyAbility(item: Item): AllyAbilityDefinition | null {
  const flag = item.getFlag(MODULE_ID, ALLY_ABILITY_FLAG);
  return flag === undefined ? { version: 1, benefits: [] } : readAllyAbilityDefinition(flag);
}
export async function writeAllyAbility(item: Item, definition: AllyAbilityDefinition): Promise<void> {
  if (!game.user || !item.parent?.canUserModify(game.user, "update")
    || !isAllySourceItem(item) || item.type !== "ability") throw new Error("Sem permissão para configurar esta habilidade.");
  const parsed = readAllyAbilityDefinition(definition);
  if (!parsed) throw new Error("Configuração de benefício inválida.");
  await item.setFlag(MODULE_ID, ALLY_ABILITY_FLAG, parsed);
}
