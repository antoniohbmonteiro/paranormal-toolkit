import { readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";
import { foundryDataModel } from "./helpers/foundry-data-model";
import { diagnoseAllyMessageAdmission } from "../../src/adapters/foundry/foundry-ally-receipt-adapter";

const root = process.env.PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE;
describe.skipIf(!root)("native v14.369 admission clocks and author (socket/database doubled)", () => {
  it("admits native server stats regardless of uptime and executor clock skew", async () => {
    const native = foundryDataModel(root!);
    native.evaluate(`
      globalThis.epoch = 1792104000000;
      Date.now = () => epoch;
      globalThis.setInterval = () => 0;
      globalThis.release = {version: "14.369"};
      globalThis.db = {Setting: {getValue: async () => 0}};
      globalThis.game = {system: {id: "ordemparanormal", version: "8.0.2"}, socket: {
        emit(event, callback) { callback({serverTime: activity.serverTime, worldTime: 0}); }
      }};
      globalThis.ui = {players: {refreshLatency() {}}};
      class Calendar { timeToComponents() { return {}; } }
      globalThis.CONFIG = {debug: {}, time: {worldCalendarClass: Calendar, earthCalendarClass: Calendar}};
    `);
    native.load("dist/components/activity.mjs", {});
    native.evaluate("globalThis.activity = new nativeExports.default({}); epoch += 60000;");
    const GameTime = native.load("client/helpers/time.mjs", {
      "./hooks.mjs": {}, "../documents/active-effect.mjs": { default: class {} },
    }).default;
    const clock = new GameTime(); await clock.sync();
    expect(clock.serverTime).toBe(60_000);

    const source = ts.createSourceFile("server-document.mjs", readFileSync(join(root!, "dist/database/backend/server-document.mjs"), "utf8"), ts.ScriptTarget.Latest, true);
    let tagMethod: string | undefined;
    const visit = (node: ts.Node) => {
      if (ts.isMethodDeclaration(node) && node.name.getText(source) === "_tagStats") tagMethod = node.getText(source);
      ts.forEachChild(node, visit);
    };
    visit(source); expect(tagMethod).toBeDefined();
    const tagStats = native.evaluate(`({${tagMethod}})._tagStats`);
    const data: any = {};
    tagStats.call({ schema: { has: () => true } }, data, { creation: true, user: { id: "clicking-user" } });
    expect(data._stats.createdTime).toBe(1792104060000);
    const message: any = { author: { id: "clicking-user" }, _stats: data._stats, getFlag: () => undefined };
    const executorClock = vi.spyOn(Date, "now");
    for (const now of [clock.serverTime, data._stats.createdTime - 60_000, data._stats.createdTime, data._stats.createdTime + 86_400_000]) {
      executorClock.mockReturnValue(now);
      expect(diagnoseAllyMessageAdmission(message, "clicking-user").failures).toEqual([]);
      expect(diagnoseAllyMessageAdmission(message, "another-user").failures).toEqual(["author-mismatch"]);
    }
  });
  it("defaults DocumentAuthorField to the creating client and resolves the native User", () => {
    const native = foundryDataModel(root!);
    const result = native.evaluate(`(() => {
      const user = {_id: "player0000000001", id: "player0000000001"};
      globalThis.game = {user, users: new Map([[user.id, user]]), collections: new Map()};
      class User extends foundry.abstract.DataModel { static get(id) { return game.users.get(id); } }
      const field = new foundry.data.fields.DocumentAuthorField(User);
      const value = field.clean(undefined);
      const initialize = field.initialize(value, {});
      return {sourceId: value, authorId: initialize().id};
    })()`);
    expect(result).toEqual({ sourceId: "player0000000001", authorId: "player0000000001" });
  });
});
