import type { AutomationDefinition } from "./automation-definition";

export type AutomationPresetCategory = "ritual" | "weapon" | "resource" | "generic";

export type AutomationPresetMatcher =
  | AutomationPresetItemTypeMatcher
  | AutomationPresetNormalizedNameMatcher
  | AutomationPresetRitualCircleMatcher;

export type AutomationPresetItemTypeMatcher = {
  type: "itemType";
  itemTypes: string[];
};

export type AutomationPresetNormalizedNameMatcher = {
  type: "normalizedName";
  names: string[];
};

export type AutomationPresetRitualCircleMatcher = {
  type: "ritualCircle";
  circles: Array<1 | 2 | 3 | 4>;
};

export type AutomationPresetItemPatch = {
  kind: "ritual";
  name?: string;
  descriptionHtml?: string;
  ritual?: AutomationPresetRitualItemPatch;
};

export type AutomationPresetRitualItemPatch = {
  circle?: 1 | 2 | 3 | 4;
  element?: string;
  target?: string;
  targetQuantity?: string;
  execution?: string;
  range?: string;
  duration?: string;
  resistanceSkill?: string;
  resistance?: string;
};

export type AutomationPreset = {
  id: string;
  version: string;
  label: string;
  description?: string;
  category: AutomationPresetCategory;
  itemTypes: string[];
  matchers: AutomationPresetMatcher[];
  automation: AutomationDefinition;
  itemPatch?: AutomationPresetItemPatch;
};

export type AutomationPresetSummary = {
  id: string;
  version: string;
  label: string;
  description?: string;
  category: AutomationPresetCategory;
  itemTypes: string[];
  matchers: AutomationPresetMatcher[];
  hasItemPatch: boolean;
};

export function createAutomationPresetSummary(preset: AutomationPreset): AutomationPresetSummary {
  return {
    id: preset.id,
    version: preset.version,
    label: preset.label,
    description: preset.description,
    category: preset.category,
    itemTypes: [...preset.itemTypes],
    matchers: preset.matchers.map((matcher) => ({ ...matcher })),
    hasItemPatch: preset.itemPatch !== undefined
  };
}
