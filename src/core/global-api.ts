import { MODULE_ID } from "../constants";
import { createDebugApi, DebugApi } from "../debug/debug-api";
import type { ToolkitServices } from "../toolkit-services";

export type ParanormalToolkitApi = {
  services: ToolkitServices;
  ordem: ToolkitServices["ordem"];
  resources: ToolkitServices["resources"];
  ritualCosts: ToolkitServices["ritualCosts"];
  automation: ToolkitServices["automation"];
  workflow: ToolkitServices["workflow"];
  debug: DebugApi;
};

export function registerGlobalApi(services: ToolkitServices): ParanormalToolkitApi {
  const api: ParanormalToolkitApi = {
    services,
    ordem: services.ordem,
    resources: services.resources,
    ritualCosts: services.ritualCosts,
    automation: services.automation,
    workflow: services.workflow,
    debug: createDebugApi(services)
  };

  const globalObject = globalThis as typeof globalThis & Record<string, unknown> & {
    ParanormalToolkit?: ParanormalToolkitApi;
  };

  globalObject[MODULE_ID] = api;
  globalObject.ParanormalToolkit = api;

  return api;
}
