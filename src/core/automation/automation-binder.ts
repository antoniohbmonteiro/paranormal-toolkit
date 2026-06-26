import { MODULE_ID } from "../../constants";
import type { AutomationDefinition } from "./automation-definition";
import type { AutomationPreset } from "./automation-preset";

export type AutomationFlagSource =
  | {
      type: "preset";
      presetId: string;
      presetVersion: string;
      appliedAt: string;
      appliedBy: string | null;
    }
  | {
      type: "manual";
      label: string;
      appliedAt: string;
      appliedBy: string | null;
    };

export type AutomationFlagValue = {
  schemaVersion: 1;
  source: AutomationFlagSource;
  definition: AutomationDefinition;
};

export type ApplyAutomationPresetOptions = {
  definition?: AutomationDefinition;
};

export class AutomationBinder {
  async applyPreset(item: Item, preset: AutomationPreset, options: ApplyAutomationPresetOptions = {}): Promise<AutomationFlagValue> {
    const flag: AutomationFlagValue = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: preset.id,
        presetVersion: preset.version,
        appliedAt: new Date().toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: options.definition ?? preset.automation
    };

    await this.writeAutomationFlag(item, flag);
    return flag;
  }

  async applyManualDefinition(item: Item, definition: AutomationDefinition, label = definition.label): Promise<AutomationFlagValue> {
    const flag: AutomationFlagValue = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label,
        appliedAt: new Date().toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition
    };

    await this.writeAutomationFlag(item, flag);
    return flag;
  }

  async clear(item: Item): Promise<void> {
    await item.unsetFlag(MODULE_ID, "automation");
  }

  private async writeAutomationFlag(item: Item, flag: AutomationFlagValue): Promise<void> {
    // Foundry merges object flags recursively when setting them.
    // Clear first so legacy top-level fields like version/label/steps do not survive.
    await this.clear(item);
    await item.setFlag(MODULE_ID, "automation", flag);
  }
}
