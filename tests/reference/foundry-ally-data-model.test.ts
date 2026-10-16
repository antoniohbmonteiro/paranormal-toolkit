import { describe, expect, it } from "vitest";
import { readAllyProfile } from "../../src/core/allies/ally-profile";
import { foundryDataModel } from "./helpers/foundry-data-model";
import { readFoundryAllyProfile } from "../../src/adapters/foundry/foundry-ally-actor-resolver";

const root = process.env.PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE;
describe.skipIf(!root)("AllyDataModel with native Foundry v14 fields and validation", () => {
  it("reads real initialized and serialized fields, including an empty description", () => {
    const native = foundryDataModel(root!);
    const profile = { schemaVersion: 1, description: "", isDrone: true };
    const model = new native.AllyDataModel(native.nativeObject(profile));
    expect(model).toBeInstanceOf(native.TypeDataModel);
    expect(readAllyProfile(model)).toEqual(profile);
    expect(readAllyProfile(model.toObject())).toEqual(profile);
    expect(readFoundryAllyProfile({ system: model } as any)).toEqual(profile);
  });
  it("initializes defaults and preserves edited persisted data through model updates", () => {
    const native = foundryDataModel(root!);
    const model = new native.AllyDataModel(native.nativeObject({}));
    expect(readAllyProfile(model)).toEqual({ schemaVersion: 1, description: "", isDrone: false });
    model.updateSource(native.nativeObject({ description: "Drone", isDrone: true }));
    expect(readFoundryAllyProfile({ system: model } as any)).toEqual({ schemaVersion: 1, description: "Drone", isDrone: true });
  });
  it("reads persisted data when prepared properties differ, without mutating the model", () => {
    const native = foundryDataModel(root!);
    const model = new native.AllyDataModel(native.nativeObject({ schemaVersion: 1, description: "", isDrone: true }));
    model.schemaVersion = undefined;
    expect(readAllyProfile(model)).toBeNull();
    expect(readFoundryAllyProfile({ system: model } as any)).toEqual({ schemaVersion: 1, description: "", isDrone: true });
    expect(model.schemaVersion).toBeUndefined();
  });
  it("rejects corrupt serialized data even if the prepared profile remains valid", () => {
    const native = foundryDataModel(root!);
    const model = new native.AllyDataModel(native.nativeObject({}));
    expect(native.AllyDataModel.schema.fields.schemaVersion.validate(2)).toBeTruthy();
    model._source.schemaVersion = 2;
    expect(readAllyProfile(model)).not.toBeNull();
    expect(readFoundryAllyProfile({ system: model } as any)).toBeNull();
  });
});
