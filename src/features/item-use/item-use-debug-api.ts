import type { ToolkitServices } from "../../toolkit-services";
import {
  getItemUseSettings,
  setItemUseAutoRunEnabled,
  setItemUseExecutionMode,
  type AutomationExecutionMode
} from "./item-use-settings";
import type { ItemUseIntegrationStatus } from "./item-use-integration";

export type ItemUseIntegrationDebugApi = {
  status(): ItemUseIntegrationStatus;
  enable(): Promise<void>;
  disable(): Promise<void>;
  setMode(mode: AutomationExecutionMode): Promise<void>;
  buttons(): Promise<void>;
  confirm(): Promise<void>;
  automatic(): Promise<void>;
};

export function createItemUseIntegrationDebugApi(services: ToolkitServices): ItemUseIntegrationDebugApi {
  return {
    status(): ItemUseIntegrationStatus {
      return services.itemUseIntegration.status();
    },

    async enable(): Promise<void> {
      await setItemUseAutoRunEnabled(true);
      ui.notifications?.info("Paranormal Toolkit: automação ao usar item em modo automático.");
    },

    async disable(): Promise<void> {
      await setItemUseAutoRunEnabled(false);
      ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },

    async setMode(mode: AutomationExecutionMode): Promise<void> {
      await setItemUseExecutionMode(mode);
      ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${mode}.`);
    },

    async buttons(): Promise<void> {
      await setItemUseExecutionMode("buttons");
      ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo botões no chat.");
    },

    async confirm(): Promise<void> {
      await setItemUseExecutionMode("confirm");
      ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo confirmação.");
    },

    async automatic(): Promise<void> {
      await setItemUseExecutionMode("automatic");
      ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}

export function isItemUseAutoRunEnabled(): boolean {
  return getItemUseSettings().autoRun;
}
