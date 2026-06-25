import { MODULE_ID } from "../constants";
import { OrdemAdapter } from "../adapters/ordem/ordem-adapter";
import { createDebugApi, DebugApi } from "../debug/debug-api";

export type ParanormalToolkitApi = {
  adapter: OrdemAdapter;
  debug: DebugApi;
};

export function registerGlobalApi(adapter: OrdemAdapter): ParanormalToolkitApi {
  const api: ParanormalToolkitApi = {
    adapter,
    debug: createDebugApi(adapter)
  };

  const globalObject = globalThis as typeof globalThis & Record<string, unknown> & {
    ParanormalToolkit?: ParanormalToolkitApi;
  };

  globalObject[MODULE_ID] = api;
  globalObject.ParanormalToolkit = api;

  return api;
}
