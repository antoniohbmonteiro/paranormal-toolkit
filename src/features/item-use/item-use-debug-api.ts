import type { ToolkitServices } from "../../toolkit-services";
import { getItemUseSettings, setItemUseExecutionMode, type AutomationExecutionMode } from "./item-use-settings";
import type { ItemUseIntegrationStatus } from "./item-use-integration";

export type ItemUseIntegrationDebugApi = {
  status(): ItemUseIntegrationStatus;
  enable(): Promise<void>;
  disable(): Promise<void>;
  setMode(mode: AutomationExecutionMode): Promise<void>;
  ask(): Promise<void>;

  /** @deprecated Use ask() */
  buttons(): Promise<void>;

  /** @deprecated Use ask() */
  confirm(): Promise<void>;

  automatic(): Promise<void>;
};

export function createItemUseIntegrationDebugApi(services: ToolkitServices): ItemUseIntegrationDebugApi {
  return {
    status(): ItemUseIntegrationStatus {
      return services.itemUseIntegration.status();
    },

    async enable(): Promise<void> {
      await setItemUseExecutionMode("ask");
      ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },

    async disable(): Promise<void> {
      await setItemUseExecutionMode("disabled");
      ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },

    async setMode(mode: AutomationExecutionMode): Promise<void> {
      await setItemUseExecutionMode(mode);
      ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${mode}.`);
    },

    async ask(): Promise<void> {
      await setItemUseExecutionMode("ask");
      ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },

    async buttons(): Promise<void> {
      await setItemUseExecutionMode("ask");
      ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },

    async confirm(): Promise<void> {
      await setItemUseExecutionMode("ask");
      ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },

    async automatic(): Promise<void> {
      await setItemUseExecutionMode("automatic");
      ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}

/** @deprecated Use getItemUseSettings().executionMode === "automatic". */
export function isItemUseAutoRunEnabled(): boolean {
  return getItemUseSettings().executionMode === "automatic";
}
