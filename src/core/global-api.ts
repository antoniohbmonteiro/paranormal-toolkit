import { MODULE_ID } from "../constants";
import { createDebugApi, DebugApi } from "../debug/debug-api";
import { PARANORMAL_TOOLKIT_HOOKS } from "./public-api/paranormal-toolkit-hooks";
import {
  createConditionApi,
  type ToolkitConditionApi,
} from "../features/conditions/condition-api";
import type { ToolkitServices } from "../toolkit-services";

export type ParanormalToolkitApi = {
  services: ToolkitServices;
  ordem: ToolkitServices["ordem"];
  resources: ToolkitServices["resources"];
  damage: ToolkitServices["damage"];
  ritualCosts: ToolkitServices["ritualCosts"];
  automation: ToolkitServices["automation"];
  automationRegistry: ToolkitServices["automationRegistry"];
  automationBinder: ToolkitServices["automationBinder"];
  workflow: ToolkitServices["workflow"];
  itemUseIntegration: ToolkitServices["itemUseIntegration"];
  conditions: ToolkitConditionApi;
  debug: DebugApi;
  hooks: typeof PARANORMAL_TOOLKIT_HOOKS;
};

export function registerGlobalApi(
  services: ToolkitServices,
): ParanormalToolkitApi {
  const api: ParanormalToolkitApi = {
    services,
    ordem: services.ordem,
    resources: services.resources,
    damage: services.damage,
    ritualCosts: services.ritualCosts,
    automation: services.automation,
    automationRegistry: services.automationRegistry,
    automationBinder: services.automationBinder,
    workflow: services.workflow,
    itemUseIntegration: services.itemUseIntegration,
    conditions: createConditionApi(services.conditions),
    debug: createDebugApi(services),
    hooks: PARANORMAL_TOOLKIT_HOOKS,
  };

  const globalObject = globalThis as typeof globalThis &
    Record<string, unknown> & {
      ParanormalToolkit?: ParanormalToolkitApi;
    };

  globalObject[MODULE_ID] = api;
  globalObject.ParanormalToolkit = api;

  return api;
}
