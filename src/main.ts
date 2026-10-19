import { MODULE_ID } from "./constants";
import { registerGlobalApi } from "./core/global-api";
import { ModuleLogger } from "./core/module-logger";
import { SystemGuard } from "./core/system-guard";
import { registerDebugOutputSettings } from "./debug/output/debug-output-settings";
import { registerAllyLifecycleHooks } from "./features/allies/ally-lifecycle-hooks";
import { registerAllySettings } from "./features/allies/ally-settings";
import { AllySheet, refreshAllySheets } from "./applications/ally-sheet";
import { registerAllyActor } from "./features/allies/ally-registration";
import { registerAllyEffectSheetIntegration } from "./features/allies/ally-effect-sheet-integration";
import { registerAbilityUseIntegration } from "./features/abilities/ability-use-integration";
import { registerConditionLifecycleHooks } from "./features/conditions/condition-lifecycle-hooks";
import { registerDiceAnimationSettings } from "./features/dice/dice-animation-settings";
import { registerItemUseSettings } from "./features/item-use/item-use-settings";
import { registerItemUseWorkflowDiceToggle } from "./features/item-use/item-use-workflow-dice-toggle";
import { registerRitualLogActionCleanup } from "./features/item-use/chat-card/ritual-log-action-cleanup";
import { createToolkitServices, type ToolkitServices } from "./toolkit-services";
import { registerActorSheetRitualPresetAction } from "./ui/actor-sheet-actions/actor-sheet-ritual-preset-action";
import { registerItemSheetAbilityRollConfigBlock } from "./ui/item-sheet-actions/item-sheet-ability-roll-config-block";
import { registerItemSheetAbilityEffectConfigBlock } from "./ui/item-sheet-actions/item-sheet-ability-effect-config-block";
import { registerItemSheetRitualResistanceOutcomeBlock } from "./ui/item-sheet-actions/item-sheet-ritual-resistance-outcome-block";
import { registerItemSheetRitualRollConfigBlock } from "./ui/item-sheet-actions/item-sheet-ritual-roll-config-block";

let services: ToolkitServices | null = null;

Hooks.once("init", () => {
  registerAllyActor();
  registerAllySettings();
  registerAllyEffectSheetIntegration();
  registerDebugOutputSettings();
  registerItemUseSettings();
  registerDiceAnimationSettings();
  registerItemUseWorkflowDiceToggle();
  ModuleLogger.info("Inicializando módulo.");
});

Hooks.once("ready", () => {
  if (!SystemGuard.isSupportedSystem()) {
    ModuleLogger.warn(
      `Sistema não suportado: ${SystemGuard.getCurrentSystemId()}. O módulo requer ordemparanormal.`,
    );
    return;
  }

  services = createToolkitServices();
  try { services.attackModifiers.register(); }
  catch (cause) { ModuleLogger.warn("Modificadores de ataque não foram ativados; confira a compatibilidade do sistema.", cause); }
  services.allySupportRequests.register();
  services.allySupportRequests.onPendingChange = actorId => { void refreshAllySheets(actorId); };
  services.allyShortcuts.onPendingChange = allyId => { void refreshAllySheets(allyId); };
  AllySheet.configureServices({ support: services.allySupportRequests, shortcuts: services.allyShortcuts });
  services.itemUseIntegration.registerStrategies();
  registerAbilityUseIntegration(
    services.resources,
    services.resourceAdapter,
    services.damage,
    services.allyUses.gateway,
  );
  registerConditionLifecycleHooks(services.conditions);
  registerAllyLifecycleHooks(services, refreshAllySheets);
  registerGlobalApi(services);
  registerRitualLogActionCleanup();
  registerActorSheetRitualPresetAction(services);
  registerItemSheetRitualRollConfigBlock();
  registerItemSheetRitualResistanceOutcomeBlock();
  registerItemSheetAbilityRollConfigBlock();
  registerItemSheetAbilityEffectConfigBlock();

  ModuleLogger.info("Inicializado para o sistema Ordem Paranormal.");
  ModuleLogger.info(
    `API de debug disponível em globalThis["${MODULE_ID}"] e globalThis.ParanormalToolkit.`,
  );
});

export function getToolkitServices(): ToolkitServices {
  if (!services) {
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  }

  return services;
}
