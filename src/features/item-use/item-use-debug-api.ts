import type { ToolkitServices } from "../../toolkit-services";
import { getItemUseSettings, setItemUseAutoRunEnabled } from "./item-use-settings";
import type { ItemUseIntegrationStatus } from "./item-use-integration";

export type ItemUseIntegrationDebugApi = {
  status(): ItemUseIntegrationStatus;
  enable(): Promise<void>;
  disable(): Promise<void>;
};

export function createItemUseIntegrationDebugApi(services: ToolkitServices): ItemUseIntegrationDebugApi {
  return {
    status(): ItemUseIntegrationStatus {
      return services.itemUseIntegration.status();
    },

    async enable(): Promise<void> {
      await setItemUseAutoRunEnabled(true);
      ui.notifications?.info("Paranormal Toolkit: automação ao usar item ativada.");
    },

    async disable(): Promise<void> {
      await setItemUseAutoRunEnabled(false);
      ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    }
  };
}

export function isItemUseAutoRunEnabled(): boolean {
  return getItemUseSettings().autoRun;
}
