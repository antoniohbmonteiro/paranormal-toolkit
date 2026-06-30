export type ToolkitConditionId =
  "shaken" |
  "frightened" |
  "confused" |
  "insane" |
  "exhausted" |
  "fatigued" |
  "frustrated" |
  "dazed" |
  "blinded" |
  "debilitated" |
  "dehydrated" |
  "diseased" |
  "poisoned" |
  "starving" |
  "stabbed" |
  "weakened" |
  "bleeding" |
  "deafened" |
  "grabbed" |
  "prone" |
  "flatFooted" |
  "entangled" |
  "flanked" |
  "immobilized" |
  "slowed" |
  "dazzled" |
  "paralyzed" |
  "restrained" |
  "vulnerable" |
  "suffocating" |
  "unconscious" |
  "helpless" |
  "dying" |
  "petrified";

export type ToolkitActiveEffectChange = {
  key: string;
  mode: number;
  value: string | number | boolean;
  priority?: number;
};

export type ToolkitConditionDefinition = {
  id: ToolkitConditionId;
  aliases?: string[];
  label: string;
  icon: string;
  description: string;
  definitionVersion: string;
  changes: ToolkitActiveEffectChange[];
};

export const DEFAULT_CONDITION_ICON = "icons/svg/downgrade.svg";
export const INFORMATIVE_CONDITION_DESCRIPTION =
  "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";

export type InformativeConditionDefinitionInput = {
  id: ToolkitConditionId;
  label: string;
  aliases?: string[];
  icon?: string;
  definitionVersion?: string;
};

export function defineInformativeCondition(input: InformativeConditionDefinitionInput): ToolkitConditionDefinition {
  return {
    id: input.id,
    aliases: input.aliases ?? [],
    label: input.label,
    icon: input.icon ?? DEFAULT_CONDITION_ICON,
    description: INFORMATIVE_CONDITION_DESCRIPTION,
    definitionVersion: input.definitionVersion ?? "1.0.0",
    changes: []
  };
}
