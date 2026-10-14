import { createAllyProfile, type AllyProfile } from "../../core/allies/ally-profile";

export class AllyDataModel extends foundry.abstract.TypeDataModel {
  declare schemaVersion: AllyProfile["schemaVersion"];
  declare description: AllyProfile["description"];
  declare isDrone: AllyProfile["isDrone"];

  static defineSchema() {
    const fields = foundry.data.fields;
    const initial = createAllyProfile();
    return {
      schemaVersion: new fields.NumberField({
        required: true, integer: true, min: 1, max: 1, initial: initial.schemaVersion,
      }),
      description: new fields.HTMLField({ required: true, blank: true, initial: initial.description }),
      isDrone: new fields.BooleanField({ required: true, initial: initial.isDrone }),
    };
  }
}
