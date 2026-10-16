import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { foundryDataModel } from "./helpers/foundry-data-model";

const root = process.env.PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE;

describe.skipIf(!root)("Ally title with native v14 localization and DocumentSheetV2", () => {
  it("localizes the full module subtype and follows Actor renames without overriding the native title", () => {
    const native = foundryDataModel(root!);
    const Localization = native.load("client/helpers/localization.mjs", { "./hooks.mjs": {} }).default;
    const i18n = new Localization("pt-BR.core");
    i18n.translations = native.nativeObject(JSON.parse(readFileSync("lang/pt-BR.json", "utf8")));
    native.evaluate("globalThis.game = {}; globalThis.CONFIG = {Actor: {typeLabels: {'paranormal-toolkit.ally': 'TYPES.Actor.paranormal-toolkit.ally'}}};");
    native.evaluate("globalThis._loc = key => game.i18n.localize(key);");
    native.evaluate("game").i18n = i18n;
    const Sheet = native.load("client/applications/api/document-sheet.mjs", {
      "./application.mjs": { default: class {} }, "@common/constants.mjs": { DOCUMENT_OWNERSHIP_LEVELS: {} },
      "../elements/secret-block.mjs": { default: class {} }, "../apps/file-picker.mjs": {},
    }).default;
    const title = Object.getOwnPropertyDescriptor(Sheet.prototype, "title")!.get!;
    const document = { name: "Íris", type: "paranormal-toolkit.ally", constructor: { hasTypeData: true, documentName: "Actor" } };
    expect(title.call({ document })).toBe("Aliado: Íris");
    document.name = "Íris Médica";
    expect(title.call({ document })).toBe("Aliado: Íris Médica");
    expect(i18n.localize("TYPES.Actor.ally")).toBe("Aliado");
  });
});
