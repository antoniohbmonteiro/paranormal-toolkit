import { OrdemResourceAdapter } from "./adapters/ordem/ordem-resource-adapter";
import { OrdemRitualAdapter } from "./adapters/ordem/ordem-ritual-adapter";
import { OrdemRitualCostProvider } from "./adapters/ordem/ordem-ritual-cost-provider";
import { OrdemItemUsedHookStrategy } from "./adapters/ordem/item-use/ordem-item-used-hook-strategy";
import { OrdemSystemAdapter } from "./adapters/ordem/ordem-system-adapter";
import { AutomationBinder } from "./core/automation/automation-binder";
import { AutomationRegistry } from "./core/automation/automation-registry";
import { AutomationRunner } from "./core/automation/automation-runner";
import { ResourceEngine } from "./core/resources/resource-engine";
import { WorkflowEngine } from "./core/workflow/workflow-engine";
import { WorkflowHookEmitter } from "./core/workflow/workflow-hook-emitter";
import { DebugOutputService } from "./debug/output/debug-output-service";
import { ItemUseIntegration } from "./features/item-use/item-use-integration";
import { createBuiltInAutomationPresets } from "./features/rituals/ritual-automation-presets";
import { ChatMessageService } from "./ui/chat-message-service";

export type ToolkitServices = {
  ordem: OrdemSystemAdapter;
  resourceAdapter: OrdemResourceAdapter;
  ritualAdapter: OrdemRitualAdapter;
  ritualCosts: OrdemRitualCostProvider;
  resources: ResourceEngine;
  automationRegistry: AutomationRegistry;
  automationBinder: AutomationBinder;
  debugOutput: DebugOutputService;
  chatMessages: ChatMessageService;
  workflowHooks: WorkflowHookEmitter;
  automation: AutomationRunner;
  workflow: WorkflowEngine;
  itemUseIntegration: ItemUseIntegration;
};

export function createToolkitServices(): ToolkitServices {
  const resourceAdapter = new OrdemResourceAdapter();
  const resources = new ResourceEngine(resourceAdapter);
  const ritualAdapter = new OrdemRitualAdapter();
  const ritualCosts = new OrdemRitualCostProvider(ritualAdapter);
  const ordem = new OrdemSystemAdapter(resourceAdapter);
  const automationRegistry = new AutomationRegistry();
  const registeredPresets = automationRegistry.registerMany(createBuiltInAutomationPresets());

  if (!registeredPresets.ok) {
    throw new Error(registeredPresets.error.message);
  }

  const automationBinder = new AutomationBinder();
  const debugOutput = new DebugOutputService();
  const chatMessages = new ChatMessageService(debugOutput);
  const workflowHooks = new WorkflowHookEmitter();
  const automation = new AutomationRunner(resources, ritualCosts, chatMessages, workflowHooks);
  const workflow = new WorkflowEngine(automation, workflowHooks);
  const itemUseIntegration = new ItemUseIntegration(workflow, resources, ritualCosts, debugOutput);

  itemUseIntegration.addStrategy(new OrdemItemUsedHookStrategy((context) => itemUseIntegration.handleItemUsed(context)));

  return {
    ordem,
    resourceAdapter,
    ritualAdapter,
    ritualCosts,
    resources,
    automationRegistry,
    automationBinder,
    debugOutput,
    chatMessages,
    workflowHooks,
    automation,
    workflow,
    itemUseIntegration
  };
}
