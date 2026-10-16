import { describe, expect, it } from "vitest";
import { foundryDataModel } from "./helpers/foundry-data-model";

const root = process.env.PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE;
describe.skipIf(!root)("native v14 grant authority APIs (database and document inheritance doubled)", () => {
  function nativePermissions() {
    const native = foundryDataModel(root!);
    const constants = native.load("common/constants.mjs", { "./utils/helpers.mjs": native.helpers });
    const DocumentDouble = native.evaluate('(class { static metadata = {permissions: {update: "OWNER"}}; getUserLevel() { return 0; } })');
    const operators = native.load("common/data/operators.mjs", {});
    const User = native.load("common/documents/user.mjs", {
      "../abstract/document.mjs": { default: DocumentDouble }, "../data/fields.mjs": native.fields,
      "../constants.mjs": constants, "../utils/helpers.mjs": native.helpers,
      "../data/validators.mjs": { isValidId: () => true }, "../utils/color.mjs": { default: class {} },
      "./actor.mjs": { default: class {} }, "../data/operators.mjs": operators,
    }).default;
    const Message = native.load("common/documents/chat-message.mjs", {
      "../abstract/document.mjs": { default: DocumentDouble }, "../utils/helpers.mjs": native.helpers,
      "../data/fields.mjs": native.fields, "../constants.mjs": constants,
    }).default;
    return { ...native, User, Message, constants };
  }
  it("denies player writes to GM User flags while allowing their own User", () => {
    const { User, constants } = nativePermissions();
    const player = { id: "player", role: constants.USER_ROLES.PLAYER, isGM: false };
    const gm = { id: "gm", role: constants.USER_ROLES.GAMEMASTER };
    const update = User.metadata.permissions.update;
    expect(update(player, gm, { flags: { "paranormal-toolkit": { allyGrantRouteIndex: {} } } })).toBe(false);
    expect(update(player, player, { flags: {} })).toBe(true);
    expect(update(gm, player, { flags: {} })).toBe(true);
  });
  it("gives message ownership to its actual author and uses server-managed creation statistics", () => {
    const { Message, fields, constants } = nativePermissions();
    const message = { _source: { author: "gm" }, pack: null };
    expect(Message.prototype.getUserLevel.call(message, { id: "player" })).toBe(constants.DOCUMENT_OWNERSHIP_LEVELS.NONE);
    expect(Message.prototype.getUserLevel.call(message, { id: "gm" })).toBe(constants.DOCUMENT_OWNERSHIP_LEVELS.OWNER);
    expect(fields.DocumentStatsField.managedFields).toEqual(expect.arrayContaining(["createdTime", "lastModifiedBy"]));
  });
  it("includes native transfer effects regardless of ability execution and omits non-transfer effects", () => {
    const native = foundryDataModel(root!);
    const Actor = native.load("client/documents/actor.mjs", {
      "@common/documents/actor.mjs": { default: class {} }, "./abstract/client-document.mjs": { default: (Base: any) => Base },
      "./item.mjs": { default: class {} }, "./token.mjs": { default: class {} },
      "./active-effect.mjs": { default: class {} },
      "@client/helpers/hooks.mjs": {},
      "@client/utils/helpers.mjs": { getDocumentClass: () => class {} },
      "@common/data/operators.mjs": native.load("common/data/operators.mjs", {}),
    }).default;
    const transferable = { id: "native", transfer: true }, passive = { id: "passive", transfer: false };
    expect([...Actor.prototype.allApplicableEffects.call({ effects: [], items: [{ effects: [transferable, passive] }] })]).toEqual([transferable]);
  });
});
