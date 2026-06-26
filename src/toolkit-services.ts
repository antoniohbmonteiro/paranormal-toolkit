import { OrdemResourceAdapter } from "./adapters/ordem/ordem-resource-adapter";
import { OrdemSystemAdapter } from "./adapters/ordem/ordem-system-adapter";
import { AutomationRunner } from "./core/automation/automation-runner";
import { ResourceEngine } from "./core/resources/resource-engine";
import { ChatMessageService } from "./ui/chat-message-service";

export type ToolkitServices = {
  ordem: OrdemSystemAdapter;
  resourceAdapter: OrdemResourceAdapter;
  resources: ResourceEngine;
  automation: AutomationRunner;
};

export function createToolkitServices(): ToolkitServices {
  const resourceAdapter = new OrdemResourceAdapter();
  const resources = new ResourceEngine(resourceAdapter);
  const ordem = new OrdemSystemAdapter(resourceAdapter);
  const automation = new AutomationRunner(resources, ChatMessageService);

  return {
    ordem,
    resourceAdapter,
    resources,
    automation
  };
}
