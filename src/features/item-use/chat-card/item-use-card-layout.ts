import { PROMPT_CLASS } from "./item-use-chat-card-constants";
import { enhanceMultiTargetCardLayout } from "./item-use-card-multi-target";
import { enhanceSingleTargetCardLayout } from "./single-target/single-target-card-enhancer";

const LAYOUT_REFRESH_DELAYS_MS = [0, 80, 180, 400, 900, 1_600, 3_000] as const;

const scheduledLayoutRoots = new WeakSet<ParentNode>();

export function enhanceRitualCardLayout(root: ParentNode): void {
  normalizeRitualCards(root);
  scheduleRitualCardLayoutRefresh(root);
}

function normalizeRitualCards(root: ParentNode): void {
  for (const rollCard of Array.from(root.querySelectorAll<HTMLElement>(`.${PROMPT_CLASS}__roll-card`))) {
    normalizeRitualCardLayout(rollCard);
  }
}

function scheduleRitualCardLayoutRefresh(root: ParentNode): void {
  if (scheduledLayoutRoots.has(root)) return;
  scheduledLayoutRoots.add(root);

  for (const delayMs of LAYOUT_REFRESH_DELAYS_MS) {
    globalThis.setTimeout(() => {
      normalizeRitualCards(root);
    }, delayMs);
  }
}

function normalizeRitualCardLayout(rollCard: HTMLElement): void {
  const singleTargetLayout = enhanceSingleTargetCardLayout({
    rollCard,
    refreshDelaysMs: LAYOUT_REFRESH_DELAYS_MS,
    onRefresh: () => normalizeRitualCardLayout(rollCard),
  });

  enhanceMultiTargetCardLayout({
    rollCard,
    damageSection: singleTargetLayout.damageSection,
    effectSection: singleTargetLayout.effectSection
  });
}
