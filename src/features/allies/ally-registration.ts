import { MODULE_ID } from "../../constants";
import { SystemGuard } from "../../core/system-guard";
import { AllySheet } from "../../applications/ally-sheet";
import { AllyDataModel } from "./ally-data-model";
import { ALLY_TYPE } from "./config/ally-ability-config";

export const ALLY_ACTOR_TYPE = ALLY_TYPE;

export function registerAllyActor(): void {
  if (!SystemGuard.isSupportedSystem()) return;
  if (CONFIG.Actor.dataModels[ALLY_ACTOR_TYPE] === AllyDataModel) return;
  CONFIG.Actor.dataModels[ALLY_ACTOR_TYPE] = AllyDataModel;
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    CONFIG.Actor.documentClass, MODULE_ID, AllySheet,
    { types: [ALLY_ACTOR_TYPE], makeDefault: true, label: "Aliado (PoC)" },
  );
}
