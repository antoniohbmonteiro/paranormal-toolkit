export type SectionCardTone = "casting" | "damage" | "resistance";

export interface SectionCardViewModel {
  tone: SectionCardTone;
  /** Trusted HTML produced exclusively by internal Paranormal Toolkit renderers. */
  content: string;
}

const TONE_CLASSES: Record<SectionCardTone, string> = {
  casting: "paranormal-toolkit-section-card--casting",
  damage: "paranormal-toolkit-section-card--damage",
  resistance: "paranormal-toolkit-section-card--resistance",
};

function toneClass(tone: SectionCardTone): string {
  return TONE_CLASSES[tone] ?? TONE_CLASSES.casting;
}

/** Wraps trusted internal component markup, never arbitrary user-authored HTML. */
export function renderSectionCard(model: SectionCardViewModel): string {
  return `<section class="paranormal-toolkit-section-card ${toneClass(model.tone)}">${model.content}</section>`;
}
