import type { AutomationPreset, AutomationPresetItemPatch } from "../../core/automation/automation-preset";

export type OrdemItemPatchFailureReason = "missing-item-patch" | "unsupported-item-type" | "empty-update";

export type OrdemItemPatchResult =
  | {
      applied: true;
      updateData: Record<string, unknown>;
    }
  | {
      applied: false;
      reason: OrdemItemPatchFailureReason;
      updateData: Record<string, unknown>;
    };

export class OrdemItemPatchAdapter {
  async applyPresetItemPatch(item: Item, preset: AutomationPreset): Promise<OrdemItemPatchResult> {
    const patch = preset.itemPatch;

    if (!patch) return createSkippedResult("missing-item-patch");
    if (item.type !== "ritual") return createSkippedResult("unsupported-item-type");

    const updateData = createRitualUpdateData(patch);

    if (Object.keys(updateData).length === 0) return createSkippedResult("empty-update");

    await item.update(updateData);

    return {
      applied: true,
      updateData
    };
  }
}

function createRitualUpdateData(patch: AutomationPresetItemPatch): Record<string, unknown> {
  const updateData: Record<string, unknown> = {};

  setIfDefined(updateData, "name", patch.name);
  setIfDefined(updateData, "system.description", patch.descriptionHtml);

  const ritual = patch.ritual;
  if (!ritual) return updateData;

  setIfDefined(updateData, "system.circle", ritual.circle);
  setIfDefined(updateData, "system.element", ritual.element);
  setIfDefined(updateData, "system.target", ritual.target);
  setIfDefined(updateData, "system.targetQtd", ritual.targetQuantity);
  setIfDefined(updateData, "system.execution", ritual.execution);
  setIfDefined(updateData, "system.range", ritual.range);
  setIfDefined(updateData, "system.duration", ritual.duration);
  setIfDefined(updateData, "system.skillResis", ritual.resistanceSkill);
  setIfDefined(updateData, "system.resistance", ritual.resistance);

  return updateData;
}

function setIfDefined(updateData: Record<string, unknown>, path: string, value: unknown): void {
  if (value === undefined) return;
  updateData[path] = value;
}

function createSkippedResult(reason: OrdemItemPatchFailureReason): OrdemItemPatchResult {
  return {
    applied: false,
    reason,
    updateData: {}
  };
}
