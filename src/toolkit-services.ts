import { OrdemResourceAdapter } from "./adapters/ordem/ordem-resource-adapter";
import { OrdemRitualAdapter } from "./adapters/ordem/ordem-ritual-adapter";
import { OrdemRitualCostProvider } from "./adapters/ordem/ordem-ritual-cost-provider";
import { OrdemSystemAdapter } from "./adapters/ordem/ordem-system-adapter";
import { AutomationRunner } from "./core/automation/automation-runner";
import { ResourceEngine } from "./core/resources/resource-engine";
import { DebugOutputService } from "./debug/output/debug-output-service";
import { ChatMessageService } from "./ui/chat-message-service";

export type ToolkitServices = {
  ordem: OrdemSystemAdapter;
  resourceAdapter: OrdemResourceAdapter;
  ritualAdapter: OrdemRitualAdapter;
  ritualCosts: OrdemRitualCostProvider;
  resources: ResourceEngine;
  debugOutput: DebugOutputService;
  chatMessages: ChatMessageService;
  automation: AutomationRunner;
};

export function createToolkitServices(): ToolkitServices {
  const resourceAdapter = new OrdemResourceAdapter();
  const resources = new ResourceEngine(resourceAdapter);
  const ritualAdapter = new OrdemRitualAdapter();
  const ritualCosts = new OrdemRitualCostProvider(ritualAdapter);
  const ordem = new OrdemSystemAdapter(resourceAdapter);
  const debugOutput = new DebugOutputService();
  const chatMessages = new ChatMessageService(debugOutput);
  const automation = new AutomationRunner(resources, ritualCosts, chatMessages);

  return {
    ordem,
    resourceAdapter,
    ritualAdapter,
    ritualCosts,
    resources,
    debugOutput,
    chatMessages,
    automation
  };
}
