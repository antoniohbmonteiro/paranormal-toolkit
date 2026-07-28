import { describe, expect, it, vi } from "vitest";
import { OrdemItemPatchAdapter } from "../../../src/adapters/ordem/ordem-item-patch-adapter";
import { createRitualSimpleHealingPreset } from "../../../src/features/rituals/ritual-automation-presets";

describe("OrdemItemPatchAdapter", () => {
  it.each([
    ["plain text", "chat text"],
    ["<p><strong>HTML original</strong></p>", "<em>chat customizado</em>"],
    ["", ""],
  ])("preserves item and chat descriptions on apply and reapply", async (description, chatDescription) => {
    const update = vi.fn(async () => undefined);
    const item = { type: "ritual", system: { description, chatDescription }, update } as unknown as Item;
    const adapter = new OrdemItemPatchAdapter();
    const preset = createRitualSimpleHealingPreset();

    const first = await adapter.applyPresetItemPatch(item, preset);
    const second = await adapter.applyPresetItemPatch(item, preset);

    expect(update).toHaveBeenCalledTimes(2);
    for (const result of [first, second]) {
      expect(result.updateData).not.toHaveProperty("system.description");
      expect(result.updateData).not.toHaveProperty("system.chatDescription");
      expect(result.updateData).not.toHaveProperty("system");
      expect(result.updateData).toMatchObject({ "system.circle": 1, "system.studentForm": true, "system.trueForm": true });
    }
    expect(item.system).toEqual({ description, chatDescription });
  });

  it("defensively ignores legacy description fields in a runtime preset payload", async () => {
    const update = vi.fn(async () => undefined);
    const item = { type: "ritual", update } as unknown as Item;
    const preset = { ...createRitualSimpleHealingPreset(), itemPatch: { ...createRitualSimpleHealingPreset().itemPatch, descriptionHtml: "overwrite", chatDescription: "overwrite" } };
    const result = await new OrdemItemPatchAdapter().applyPresetItemPatch(item, preset);
    expect(result.updateData).not.toHaveProperty("system.description");
    expect(result.updateData).not.toHaveProperty("system.chatDescription");
  });
});
