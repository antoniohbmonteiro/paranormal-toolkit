import { MODULE_ID } from "../../../constants";
import { PROMPT_CLASS } from "./item-use-chat-card-constants";

const STYLE_ID = `${MODULE_ID}-workflow-dice-toggle-styles`;

export function ensureItemUseChatCardStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
.${PROMPT_CLASS}__workflow-section .${PROMPT_CLASS}__roll-detail-toggle,
.${PROMPT_CLASS}__workflow-section .${PROMPT_CLASS}__roll-detail-list {
  display: none !important;
}

.${PROMPT_CLASS}__workflow-roll:not(.${PROMPT_CLASS}__workflow-roll--dice-open) .${PROMPT_CLASS}__workflow-dice-tray,
.${PROMPT_CLASS}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${PROMPT_CLASS}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${PROMPT_CLASS}__workflow-roll-formula--toggle:hover,
.${PROMPT_CLASS}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${PROMPT_CLASS}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${PROMPT_CLASS}__header .${PROMPT_CLASS}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${PROMPT_CLASS}__ritual-element-badge {
  display: inline-flex;
  align-items: center;
  min-height: 1.08rem;
  border: 1px solid rgba(36, 27, 24, 0.14);
  border-radius: 2px;
  padding: 0.06rem 0.3rem 0.07rem;
  background: rgba(74, 64, 54, 0.86);
  color: rgba(255, 255, 255, 0.96);
  font-size: 0.66rem;
  font-weight: 950;
  letter-spacing: 0.025em;
  line-height: 1;
  text-transform: uppercase;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.${PROMPT_CLASS}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${PROMPT_CLASS}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${PROMPT_CLASS}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${PROMPT_CLASS}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${PROMPT_CLASS}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${PROMPT_CLASS}__header .${PROMPT_CLASS}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${PROMPT_CLASS}__roll-card > .${PROMPT_CLASS}__ritual-metadata {
  display: none !important;
}

.${PROMPT_CLASS}__ritual-metadata-chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  border: 1px solid rgba(66, 47, 34, 0.14);
  border-radius: 999px;
  padding: 0.12rem 0.42rem;
  background: rgba(255, 255, 255, 0.42);
  color: rgba(36, 27, 24, 0.82);
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.${PROMPT_CLASS}__resistance {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 34px;
  grid-template-areas: "content button";
  align-items: center !important;
  column-gap: 0.62rem;
  row-gap: 0;
  padding: 0.56rem 0.58rem !important;
}

.${PROMPT_CLASS}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${PROMPT_CLASS}__resistance-content .${PROMPT_CLASS}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${PROMPT_CLASS}__resistance-content .${PROMPT_CLASS}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${PROMPT_CLASS}__resistance-content .${PROMPT_CLASS}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${PROMPT_CLASS}__resistance > .${PROMPT_CLASS}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: center;
}

.${PROMPT_CLASS}__resistance-content .${PROMPT_CLASS}__resistance-roll-result {
  display: block;
  min-width: 0;
  margin-top: 0;
}

.${PROMPT_CLASS}__resistance-workflow-roll {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 0.34rem;
  padding-top: 0.1rem;
}

.${PROMPT_CLASS}__resistance-workflow-roll .${PROMPT_CLASS}__workflow-roll-formula {
  display: inline-flex;
  width: 100%;
  max-width: 100%;
  min-height: 1.78rem;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

.${PROMPT_CLASS}__resistance-workflow-roll .${PROMPT_CLASS}__workflow-roll-formula i {
  margin-left: auto;
}

.${PROMPT_CLASS}__resistance-workflow-roll .${PROMPT_CLASS}__workflow-dice-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
  border-top: 1px solid rgba(79, 55, 42, 0.12);
  padding-top: 0.34rem;
}

.${PROMPT_CLASS}__resistance-workflow-roll .${PROMPT_CLASS}__workflow-die {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.22rem;
  min-height: 1.22rem;
  border: 1px solid rgba(82, 57, 25, 0.18);
  border-radius: 999px;
  padding: 0 0.27rem;
  background: rgba(255, 255, 255, 0.64);
  color: rgba(36, 27, 24, 0.9);
  font-family: var(--font-mono, monospace);
  font-size: 0.7rem;
  font-weight: 800;
  line-height: 1;
  box-sizing: border-box;
}

.${PROMPT_CLASS}__resistance-workflow-roll .${PROMPT_CLASS}__workflow-die--inactive {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(36, 27, 24, 0.46);
  opacity: 0.58;
}
.${PROMPT_CLASS}__workflow-section--casting .${PROMPT_CLASS}__workflow-section-header--casting-backlash {
  grid-template-columns: minmax(0, 1fr) 34px;
}

.${PROMPT_CLASS}__workflow-section-title-row {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.38rem;
}

.${PROMPT_CLASS}__workflow-section-title-row .${PROMPT_CLASS}__workflow-section-status {
  flex: 0 0 auto;
}

.${PROMPT_CLASS}__casting-backlash-button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  justify-self: end;
  width: 34px !important;
  min-width: 34px !important;
  height: 34px !important;
  min-height: 34px !important;
  margin: 0 !important;
  border: 1px solid rgba(125, 39, 43, 0.46) !important;
  border-radius: 7px !important;
  padding: 0 !important;
  background: rgba(158, 82, 87, 0.88) !important;
  color: #fffaf3 !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 1px 2px rgba(0, 0, 0, 0.12) !important;
  font-size: 0 !important;
  line-height: 1 !important;
  overflow: hidden !important;
  text-shadow: none !important;
}

.${PROMPT_CLASS}__casting-backlash-button::before {
  content: "↪";
  font-size: 1rem;
  font-weight: 950;
  line-height: 1;
}

.${PROMPT_CLASS}__casting-backlash-button:hover,
.${PROMPT_CLASS}__casting-backlash-button:focus {
  border-color: rgba(125, 39, 43, 0.66) !important;
  background: rgba(143, 62, 67, 0.94) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 0 0 2px rgba(125, 39, 43, 0.16) !important;
  outline: none !important;
}

.${PROMPT_CLASS}__casting-backlash-button:disabled {
  cursor: default !important;
  opacity: 0.78 !important;
}

.${PROMPT_CLASS}__casting-backlash-button.${PROMPT_CLASS}__button--executed::before {
  content: "✓";
}

/* 0.21.2 — Resolução de dano integrada no bloco de Dano */
.${PROMPT_CLASS}__workflow-section--effect .${PROMPT_CLASS}__resistance {
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.48rem 0.52rem !important;
  background: rgba(255, 246, 229, 0.52) !important;
  box-shadow: none !important;
}

.${PROMPT_CLASS}__workflow-section--effect .${PROMPT_CLASS}__resistance-content {
  gap: 0.22rem !important;
}

.${PROMPT_CLASS}__workflow-section--effect .${PROMPT_CLASS}__resistance-header strong {
  display: inline !important;
  margin: 0 !important;
}

.${PROMPT_CLASS}__workflow-section--effect .${PROMPT_CLASS}__resistance-description {
  font-size: 0.75rem !important;
  line-height: 1.25 !important;
}

.${PROMPT_CLASS}__actions--embedded {
  margin-top: 0.46rem !important;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${PROMPT_CLASS}__actions--compact,
.${PROMPT_CLASS}__actions--damage-resolution {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center !important;
  gap: 0.34rem !important;
}

.${PROMPT_CLASS}__actions--damage-resolution .${PROMPT_CLASS}__actions-title {
  grid-column: 1 / -1;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.02rem !important;
  color: rgba(71, 47, 34, 0.62) !important;
  font-size: 0.68rem !important;
  font-weight: 900 !important;
  letter-spacing: 0.045em !important;
  line-height: 1 !important;
  text-align: center;
  text-transform: uppercase !important;
}

.${PROMPT_CLASS}__actions--damage-resolution .${PROMPT_CLASS}__actions-title::before,
.${PROMPT_CLASS}__actions--damage-resolution .${PROMPT_CLASS}__actions-title::after {
  content: "";
  display: block;
  border-top: 1px solid rgba(79, 55, 42, 0.16);
}

.${PROMPT_CLASS}__damage-resolution-summary {
  grid-column: 1 / -1;
  margin: -0.04rem 0 0.02rem;
  color: rgba(54, 39, 31, 0.64);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.24;
  text-align: center;
}

.${PROMPT_CLASS}__actions--damage-resolution .${PROMPT_CLASS}__button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: none !important;
  height: auto !important;
  min-height: 1.85rem !important;
  max-height: none !important;
  margin: 0 !important;
  border-radius: 7px !important;
  padding: 0.34rem 0.52rem !important;
  font-size: 0.76rem !important;
  font-weight: 900 !important;
  line-height: 1.1 !important;
  white-space: normal !important;
  aspect-ratio: auto !important;
}

.${PROMPT_CLASS}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="pending"] .${PROMPT_CLASS}__button,
.${PROMPT_CLASS}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${PROMPT_CLASS}__button,
.${PROMPT_CLASS}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${PROMPT_CLASS}__button {
  grid-column: 1 / -1;
}

.${PROMPT_CLASS}__actions--damage-resolution .${PROMPT_CLASS}__button[hidden] {
  display: none !important;
}

.${PROMPT_CLASS}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${PROMPT_CLASS}__damage-resolution-summary {
  color: rgba(34, 93, 55, 0.84);
}

.${PROMPT_CLASS}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${PROMPT_CLASS}__damage-resolution-summary {
  color: rgba(112, 44, 44, 0.82);
}

.${PROMPT_CLASS}__actions--effect-resolution {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "title button"
    "label button";
  align-items: center !important;
  gap: 0.18rem 0.52rem !important;
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.54rem 0.58rem !important;
  background: rgba(255, 250, 238, 0.58) !important;
  box-shadow: none !important;
}

.${PROMPT_CLASS}__actions--effect-resolution .${PROMPT_CLASS}__actions-title {
  grid-area: title;
  margin: 0 !important;
  color: rgba(107, 78, 35, 0.95) !important;
  font-size: 0.78rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.055em !important;
  line-height: 1 !important;
  text-transform: uppercase !important;
}

.${PROMPT_CLASS}__effect-resolution-label {
  grid-area: label;
  min-width: 0;
  color: rgba(36, 27, 24, 0.9);
  font-size: 0.82rem;
  font-weight: 850;
  line-height: 1.22;
  overflow-wrap: anywhere;
}

.${PROMPT_CLASS}__actions--effect-resolution .${PROMPT_CLASS}__button {
  grid-area: button;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: auto !important;
  min-width: 5rem !important;
  max-width: 7rem !important;
  min-height: 1.9rem !important;
  margin: 0 !important;
  border-radius: 7px !important;
  padding: 0.34rem 0.62rem !important;
  font-size: 0.78rem !important;
  font-weight: 900 !important;
  line-height: 1.1 !important;
  white-space: nowrap !important;
  aspect-ratio: auto !important;
}

`;

  document.head.append(style);
}
