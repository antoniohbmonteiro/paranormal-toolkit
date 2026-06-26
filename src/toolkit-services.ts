import { OrdemResourceAdapter } from "./adapters/ordem/ordem-resource-adapter";
import { OrdemSystemAdapter } from "./adapters/ordem/ordem-system-adapter";
import { ResourceEngine } from "./core/resources/resource-engine";

export type ToolkitServices = {
  ordem: OrdemSystemAdapter;
  resourceAdapter: OrdemResourceAdapter;
  resources: ResourceEngine;
};

export function createToolkitServices(): ToolkitServices {
  const resourceAdapter = new OrdemResourceAdapter();
  const resources = new ResourceEngine(resourceAdapter);
  const ordem = new OrdemSystemAdapter(resourceAdapter);

  return {
    ordem,
    resourceAdapter,
    resources
  };
}
