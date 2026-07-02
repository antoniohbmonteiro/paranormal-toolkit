import type { ItemUseActionState } from "./item-use-card-action-state";
import type { ItemUseCardResistanceUiState } from "./item-use-card-resistance-state";

export type ItemUseCardActionUiState = ItemUseActionState;

export type ItemUseCardUiState = {
  resistance: ItemUseCardResistanceUiState;
  damage: ItemUseCardActionUiState | null;
  effect: ItemUseCardActionUiState | null;
};

export type ItemUseCardTargetUiState = {
  id: string;
  name: string;
  resistance: ItemUseCardResistanceUiState;
  damage: ItemUseCardActionUiState | null;
  effect: ItemUseCardActionUiState | null;
};
