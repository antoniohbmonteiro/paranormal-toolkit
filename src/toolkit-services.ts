import { OrdemDamageAdapter } from "./adapters/ordem/ordem-damage-adapter";
import { FoundryAllyAbilityRequests } from "./adapters/foundry/foundry-ally-ability-request-adapter";
import { FoundryAllySupportRequests } from "./adapters/foundry/foundry-ally-request-adapter";
import { AllyGrantedAbilityShortcut } from "./features/allies/ally-granted-ability-shortcut";
import { AbilityUseWorkflow } from "./features/abilities/ability-use-workflow";
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
import { RitualEventBus } from "./core/public-api/ritual-event-bus";
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
import { FoundryAttackRollMessageBridge } from "./adapters/foundry/foundry-attack-roll-message-bridge";
import { OrdemAttackAdapter } from "./adapters/ordem/attacks/ordem-attack-adapter";
import { OrdemAttackObserver } from "./adapters/ordem/attacks/ordem-attack-observer";
import { OrdemAttackIntegration } from "./adapters/ordem/attacks/ordem-attack-integration";
import { AttackModifierRegistry } from "./features/attack-modifiers/attack-modifier-registry";
import { PresetManagerService } from "./features/presets/preset-manager-service";
import { AttackChatCardService } from "./features/attack-modifiers/attack-chat-card-service";
import { AttackResourceService } from "./features/attack-modifiers/attack-resource-service";
import { AttackModifierWorkflow } from "./features/attack-modifiers/attack-modifier-workflow";
import { AttackDamageResolver } from "./features/attack-modifiers/attack-damage-resolver";
import { AttackDamageWorkflow } from "./features/attack-modifiers/attack-damage-workflow";
import { AttackAssistedDamageService } from "./features/attack-modifiers/attack-assisted-damage-service";

export type ToolkitServices = {
  presetManager: PresetManagerService;
  attackModifiers: OrdemAttackIntegration;
  allyUses: FoundryAllyAbilityRequests;
  allySupportRequests: FoundryAllySupportRequests;
  allyShortcuts: AllyGrantedAbilityShortcut;
  abilityWorkflow: AbilityUseWorkflow;
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
  ritualEvents: RitualEventBus;
  automation: AutomationRunner;
  workflow: WorkflowEngine;
  itemUseIntegration: ItemUseIntegration;
  ritualPresetDiagnostic: RitualPresetDiagnosticService;
  ritualPresetApplications: RitualPresetApplicationService;
};

export function createToolkitServices(): ToolkitServices {
  const allyUses = new FoundryAllyAbilityRequests();
  const allySupportRequests = new FoundryAllySupportRequests();
  const allyShortcuts = new AllyGrantedAbilityShortcut(allyUses.gateway);
  const resourceAdapter = new OrdemResourceAdapter();
  const resources = new ResourceEngine(resourceAdapter);
  const damage = new DamageEngine(new OrdemDamageAdapter());
  const attackBridge = new FoundryAttackRollMessageBridge();
  const attackAdapter = new OrdemAttackAdapter();
  const attackCards = new AttackChatCardService();
  const attackRegistry = new AttackModifierRegistry();
  const attackWorkflow = new AttackModifierWorkflow(attackRegistry, attackAdapter, attackCards,
    new AttackResourceService(resources, resourceAdapter), attackBridge,
    async input => (await import("./applications/attack-modifier-application")).AttackModifierApplication.request(input),
    new OrdemAttackObserver());
  const attackResolver = new AttackDamageResolver(attackCards, attackAdapter);
  const attackDamage = new AttackDamageWorkflow(attackCards, attackResolver, attackAdapter, attackBridge);
  const attackModifiers = new OrdemAttackIntegration(attackWorkflow, attackDamage,
    new AttackAssistedDamageService(damage, attackCards, attackResolver), attackAdapter, attackBridge);
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
  const presetManager = new PresetManagerService(ritualPresetDiagnostic, ritualPresetApplications, attackRegistry);
  const debugOutput = new DebugOutputService();
  const chatMessages = new ChatMessageService(debugOutput);
  const workflowHooks = new WorkflowHookEmitter();
  const ritualEvents = new RitualEventBus();
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
    ritualEvents,
    allyUses.gateway,
  );

  itemUseIntegration.addStrategy(
    new OrdemItemUsedHookStrategy((context) =>
      itemUseIntegration.handleItemUsed(context),
    ),
  );

  return {
    presetManager,
    attackModifiers,
    allyUses,
    allySupportRequests,
    allyShortcuts,
    abilityWorkflow: new AbilityUseWorkflow(resources, resourceAdapter),
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
    ritualEvents,
    automation,
    workflow,
    itemUseIntegration,
    ritualPresetDiagnostic,
    ritualPresetApplications,
  };
}
