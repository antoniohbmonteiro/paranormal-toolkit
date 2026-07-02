import { OrdemDamageAdapter } from "./adapters/ordem/ordem-damage-adapter";
import { OrdemResourceAdapter } from "./adapters/ordem/ordem-resource-adapter";
import { OrdemResistanceAdapter } from "./adapters/ordem/ordem-resistance-roll-adapter";
import { OrdemRitualAdapter } from "./adapters/ordem/ordem-ritual-adapter";
import { OrdemRitualCastingAdapter } from "./adapters/ordem/ordem-ritual-casting-adapter";
import { OrdemRitualCostProvider } from "./adapters/ordem/ordem-ritual-cost-provider";
import { OrdemItemUsedHookStrategy } from "./adapters/ordem/item-use/ordem-item-used-hook-strategy";
import { OrdemItemPatchAdapter } from "./adapters/ordem/ordem-item-patch-adapter";
import { OrdemSystemAdapter } from "./adapters/ordem/ordem-system-adapter";
import { AutomationBinder } from "./core/automation/automation-binder";
import { AutomationRegistry } from "./core/automation/automation-registry";
import { AutomationRunner } from "./core/automation/automation-runner";
import { DamageEngine } from "./core/damage/damage-engine";
import { ResistanceEngine } from "./core/resistance/resistance-engine";
import { ResourceEngine } from "./core/resources/resource-engine";
import { RitualCastingEngine } from "./core/rituals/ritual-casting-engine";
import { WorkflowEngine } from "./core/workflow/workflow-engine";
import { WorkflowHookEmitter } from "./core/workflow/workflow-hook-emitter";
import { DebugOutputService } from "./debug/output/debug-output-service";
import { ConditionEngine } from "./features/conditions/condition-engine";
import {
  createToolkitConditionRegistry,
  type ConditionRegistry,
} from "./features/conditions/condition-registry";
import { ItemUseIntegration } from "./features/item-use/item-use-integration";
import { createBuiltInAutomationPresets } from "./features/rituals/ritual-automation-presets";
import { RitualPresetApplicationService } from "./features/rituals/presets/ritual-preset-application-service";
import { RitualPresetDiagnosticService } from "./features/rituals/presets/ritual-preset-diagnostic";
import { ChatMessageService } from "./ui/chat-message-service";

export type ToolkitServices = {
  ordem: OrdemSystemAdapter;
  resourceAdapter: OrdemResourceAdapter;
  ritualAdapter: OrdemRitualAdapter;
  ritualCosts: OrdemRitualCostProvider;
  resources: ResourceEngine;
  damage: DamageEngine;
  resistance: ResistanceEngine;
  ritualCasting: RitualCastingEngine;
  automationRegistry: AutomationRegistry;
  automationBinder: AutomationBinder;
  itemPatches: OrdemItemPatchAdapter;
  conditionRegistry: ConditionRegistry;
  conditions: ConditionEngine;
  debugOutput: DebugOutputService;
  chatMessages: ChatMessageService;
  workflowHooks: WorkflowHookEmitter;
  automation: AutomationRunner;
  workflow: WorkflowEngine;
  itemUseIntegration: ItemUseIntegration;
  ritualPresetDiagnostic: RitualPresetDiagnosticService;
  ritualPresetApplications: RitualPresetApplicationService;
};

export function createToolkitServices(): ToolkitServices {
  const resourceAdapter = new OrdemResourceAdapter();
  const resources = new ResourceEngine(resourceAdapter);
  const damage = new DamageEngine(new OrdemDamageAdapter());
  const resistance = new ResistanceEngine(new OrdemResistanceAdapter());
  const ritualCasting = new RitualCastingEngine(new OrdemRitualCastingAdapter());
  const ritualAdapter = new OrdemRitualAdapter();
  const ritualCosts = new OrdemRitualCostProvider(ritualAdapter);
  const ordem = new OrdemSystemAdapter(resourceAdapter);
  const automationRegistry = new AutomationRegistry();
  const registeredPresets = automationRegistry.registerMany(
    createBuiltInAutomationPresets(),
  );

  if (!registeredPresets.ok) {
    throw new Error(registeredPresets.error.message);
  }

  const automationBinder = new AutomationBinder();
  const itemPatches = new OrdemItemPatchAdapter();
  const conditionRegistry = createToolkitConditionRegistry();
  const conditions = new ConditionEngine(conditionRegistry);
  const ritualPresetDiagnostic = new RitualPresetDiagnosticService(
    automationRegistry,
  );
  const ritualPresetApplications = new RitualPresetApplicationService(
    ritualPresetDiagnostic,
    automationBinder,
    itemPatches,
  );
  const debugOutput = new DebugOutputService();
  const chatMessages = new ChatMessageService(debugOutput);
  const workflowHooks = new WorkflowHookEmitter();
  const automation = new AutomationRunner(
    resources,
    ritualCosts,
    chatMessages,
    workflowHooks,
  );
  const workflow = new WorkflowEngine(automation, workflowHooks);
  const itemUseIntegration = new ItemUseIntegration(
    workflow,
    resources,
    ritualCosts,
    damage,
    conditions,
    debugOutput,
  );

  itemUseIntegration.addStrategy(
    new OrdemItemUsedHookStrategy((context) =>
      itemUseIntegration.handleItemUsed(context),
    ),
  );

  return {
    ordem,
    resourceAdapter,
    ritualAdapter,
    ritualCosts,
    resources,
    damage,
    resistance,
    ritualCasting,
    automationRegistry,
    automationBinder,
    itemPatches,
    conditionRegistry,
    conditions,
    debugOutput,
    chatMessages,
    workflowHooks,
    automation,
    workflow,
    itemUseIntegration,
    ritualPresetDiagnostic,
    ritualPresetApplications,
  };
}
