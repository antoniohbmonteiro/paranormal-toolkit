const ACTION_SECTION_ATTRIBUTE = "data-paranormal-toolkit-action-section";
const RITUAL_LOG_SECTION_ID = "ritual-log";
const PROMPT_ACTIONS_SELECTOR = ".paranormal-toolkit-item-use-prompt__actions";
const PROMPT_ACTIONS_TITLE_SELECTOR = ".paranormal-toolkit-item-use-prompt__actions-title";
const CLEANUP_DELAYS_MS = [0, 100, 500, 1_500] as const;

let ritualLogActionCleanupRegistered = false;

export function registerRitualLogActionCleanup(): void {
  if (ritualLogActionCleanupRegistered) return;

  const cleanupRenderedMessage = (_message: unknown, html: unknown): void => {
    scheduleRitualLogActionCleanup(resolveRootElement(html) ?? document);
  };

  Hooks.on("renderChatMessageHTML", cleanupRenderedMessage);
  Hooks.on("renderChatMessage", cleanupRenderedMessage);

  scheduleRitualLogActionCleanup(document);
  ritualLogActionCleanupRegistered = true;
}

type RitualLogCleanupRoot = Document | HTMLElement;

function scheduleRitualLogActionCleanup(root: RitualLogCleanupRoot): void {
  for (const delayMs of CLEANUP_DELAYS_MS) {
    globalThis.setTimeout(() => removeRitualLogActions(root), delayMs);
  }
}

function removeRitualLogActions(root: RitualLogCleanupRoot): void {
  removeExplicitRitualLogActions(root);
  removeLegacyRitualLogActions(root);
}

function removeExplicitRitualLogActions(root: RitualLogCleanupRoot): void {
  for (const element of root.querySelectorAll<HTMLElement>(
    `[${ACTION_SECTION_ATTRIBUTE}="${RITUAL_LOG_SECTION_ID}"]`,
  )) {
    element.remove();
  }
}

function removeLegacyRitualLogActions(root: RitualLogCleanupRoot): void {
  for (const actions of root.querySelectorAll<HTMLElement>(PROMPT_ACTIONS_SELECTOR)) {
    const title = normalizeText(actions.querySelector(PROMPT_ACTIONS_TITLE_SELECTOR)?.textContent ?? "");
    if (title !== "registro") continue;

    const buttonTexts = Array.from(actions.querySelectorAll("button"), (button) =>
      normalizeText(button.textContent ?? ""),
    );
    const hasRitualLogButton = buttonTexts.some((text) => text.includes("ritual conjurado"));

    if (hasRitualLogButton) {
      actions.remove();
    }
  }
}

function resolveRootElement(html: unknown): HTMLElement | null {
  if (html instanceof HTMLElement) return html;

  if (isQueryableElement(html)) {
    return html;
  }

  if (isJQueryLike(html)) {
    const first = html[0];
    return first instanceof HTMLElement ? first : null;
  }

  return null;
}

function isQueryableElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

function isJQueryLike(value: unknown): value is { 0?: unknown } {
  return typeof value === "object" && value !== null && 0 in value;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/\s+/gu, " ")
    .trim()
    .toLocaleLowerCase();
}
