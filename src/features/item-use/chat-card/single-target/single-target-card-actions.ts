// Minimal single-target card action bindings. Resistance rolling itself stays in the legacy prompt module.
import { RESISTANCE_ROLL_BUTTON_SELECTOR } from "../item-use-chat-card-constants";

const REFRESH_BOUND_ATTRIBUTE = "data-paranormal-toolkit-card-layout-refresh-bound";

type BindSingleTargetCardRefreshInput = {
  rollCard: HTMLElement;
  refreshDelaysMs: readonly number[];
  onRefresh: () => void;
};

export function bindSingleTargetCardRefresh(input: BindSingleTargetCardRefreshInput): void {
  const resistanceButton = input.rollCard.querySelector<HTMLButtonElement>(RESISTANCE_ROLL_BUTTON_SELECTOR);
  if (!resistanceButton) return;
  if (resistanceButton.getAttribute(REFRESH_BOUND_ATTRIBUTE) === "true") return;

  resistanceButton.setAttribute(REFRESH_BOUND_ATTRIBUTE, "true");
  resistanceButton.addEventListener("click", () => {
    for (const delayMs of input.refreshDelaysMs) {
      globalThis.setTimeout(input.onRefresh, delayMs);
    }
  });
}
