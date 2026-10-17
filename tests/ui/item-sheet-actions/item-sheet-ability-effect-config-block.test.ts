import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerItemSheetAbilityEffectConfigBlock, mountItemEffectConfigBlock } from "../../../src/ui/item-sheet-actions/item-sheet-ability-effect-config-block";
import { renderItemEffectConfigEntry } from "../../../src/ui/components/item-effects/item-effect-config";
import { itemFixture } from "../../helpers/item-effects";

beforeEach(() => {
  delete (globalThis as any)["__paranormal-toolkit_itemEffectConfigBlockRegistered"];
});

describe("public v14 effects part integration", () => {
  it("registers one render/close pair and no header or tab hooks", () => {
    const hooks = new Map<string, Function[]>();
    vi.stubGlobal("Hooks", { on: (name: string, callback: Function) => hooks.set(name, [...hooks.get(name) ?? [], callback]) });
    registerItemSheetAbilityEffectConfigBlock(); registerItemSheetAbilityEffectConfigBlock();
    expect([...hooks.keys()]).toEqual(["renderItemSheetV2", "closeItemSheetV2"]);
    expect(hooks.get("renderItemSheetV2")).toHaveLength(1);
  });
  it("fails safely on unsupported parts and contexts without writing any document", () => {
    vi.stubGlobal("game", { user: { id: "gm", isGM: true } });
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const item = itemFixture(); const before = item.toObject();
    const sheet: any = { item, element: { contains: () => false }, parts: {} };
    mountItemEffectConfigBlock(sheet); mountItemEffectConfigBlock(sheet);
    expect(item.toObject()).toEqual(before); expect(item.createEmbeddedDocuments).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledTimes(1);
    sheet.item = itemFixture({}, { type: "threat" });
    mountItemEffectConfigBlock(sheet); expect(console.warn).toHaveBeenCalledTimes(1);
  });
  it("renders only a contextual entry without a second editor or native actions", () => {
    const html = renderItemEffectConfigEntry({ benefits: false, readOnly: true, independent: true });
    expect(html).toContain("Efeitos da habilidade"); expect(html).toContain("Somente leitura");
    expect(html).toContain("Configurar efeitos da habilidade");
    expect(html).toContain('type="button"'); expect(html).not.toMatch(/data-action=|<form|<select|<input|effect-list/);
    const ally = renderItemEffectConfigEntry({ benefits: true, readOnly: false, independent: false });
    expect(ally).toContain("Benefícios passivos"); expect(ally).toContain("Configurar benefícios passivos");
  });
});
