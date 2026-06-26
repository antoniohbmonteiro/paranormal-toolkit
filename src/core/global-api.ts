import { MODULE_ID } from "../constants";
import { createDebugApi, DebugApi } from "../debug/debug-api";
import type { ToolkitServices } from "../toolkit-services";

export type ParanormalToolkitApi = {
  services: ToolkitServices;
  ordem: ToolkitServices["ordem"];
  resources: ToolkitServices["resources"];
  ritualCosts: ToolkitServices["ritualCosts"];
  automation: ToolkitServices["automation"];
  automationRegistry: ToolkitServices["automationRegistry"];
  automationBinder: ToolkitServices["automationBinder"];
  workflow: ToolkitServices["workflow"];
  itemUseIntegration: ToolkitServices["itemUseIntegration"];
  debug: DebugApi;
};

export function registerGlobalApi(services: ToolkitServices): ParanormalToolkitApi {
  const api: ParanormalToolkitApi = {
    services,
    ordem: services.ordem,
    resources: services.resources,
    ritualCosts: services.ritualCosts,
    automation: services.automation,
    automationRegistry: services.automationRegistry,
    automationBinder: services.automationBinder,
    workflow: services.workflow,
    itemUseIntegration: services.itemUseIntegration,
    debug: createDebugApi(services)
  };

  const globalObject = globalThis as typeof globalThis & Record<string, unknown> & {
    ParanormalToolkit?: ParanormalToolkitApi;
  };

  globalObject[MODULE_ID] = api;
  globalObject.ParanormalToolkit = api;

  return api;
}
