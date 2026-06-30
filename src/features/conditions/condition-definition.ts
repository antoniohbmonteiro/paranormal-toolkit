export type ToolkitConditionId = "vulnerable";

export type ToolkitActiveEffectChange = {
  key: string;
  mode: number;
  value: string | number | boolean;
  priority?: number;
};

export type ToolkitConditionDefinition = {
  id: ToolkitConditionId;
  label: string;
  icon: string;
  description: string;
  definitionVersion: string;
  changes: ToolkitActiveEffectChange[];
};
