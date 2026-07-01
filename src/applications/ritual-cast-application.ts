import { MODULE_ID } from "../constants";
import {
  createRitualCastDialogModel,
  type RitualCastDialogModel,
  type RitualCastDialogModelInput,
  type RitualCastFormModel
} from "../features/rituals/casting/ritual-cast-dialog-model";
import {
  isRitualCastVariant,
  type RitualCastOptions,
  type RitualCastVariant
} from "../features/rituals/ritual-cast-options";

const { ApplicationV2 } = foundry.applications.api;

export type RitualCastApplicationInput = RitualCastDialogModelInput;

type RitualCastResolution = (value: RitualCastOptions | null) => void;

export class RitualCastApplication extends ApplicationV2 {
  private readonly model: RitualCastDialogModel;
  private selectedVariant: RitualCastVariant = "base";
  private spendResource = true;
  private isResolved = false;

  static DEFAULT_OPTIONS = {
    id: `${MODULE_ID}-ritual-cast`,
    classes: [MODULE_ID, "paranormal-toolkit-ritual-cast-app"],
    tag: "section",
    position: {
      width: 540,
      height: "auto"
    },
    window: {
      title: "Conjurar ritual",
      icon: "fa-solid fa-wand-magic-sparkles",
      resizable: true
    },
    actions: {
      cast: RitualCastApplication.onCast,
      cancel: RitualCastApplication.onCancel
    }
  };

  static async request(input: RitualCastApplicationInput): Promise<RitualCastOptions | null> {
    return new Promise((resolve) => {
      const app = new RitualCastApplication(input, resolve);
      void app.render({ force: true });
    });
  }

  constructor(input: RitualCastApplicationInput, private readonly resolveRequest: RitualCastResolution) {
    super({
      id: `${MODULE_ID}-ritual-cast-${input.actor.id ?? foundry.utils.randomID()}-${input.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${input.ritual.name ?? "ritual"}`
      }
    });

    this.model = createRitualCastDialogModel(input);
    this.selectedVariant = this.model.forms.find((form) => form.checked && form.enabled)?.variant ?? "base";
    this.spendResource = this.model.cost.spendResourceChecked;
  }

  async _renderHTML(_context: object, _options: object): Promise<HTMLElement> {
    const root = document.createElement("div");
    root.className = "paranormal-toolkit-ritual-cast";
    root.innerHTML = this.renderContent();
    return root;
  }

  _replaceHTML(result: HTMLElement, content: HTMLElement, _options: object): void {
    content.replaceChildren(result);

    const root = content.querySelector<HTMLElement>(".paranormal-toolkit-ritual-cast") ?? content;
    bindVariantSelection(root, (variant) => {
      this.selectedVariant = variant;
    });
    bindSpendResourceToggle(root, (spendResource) => {
      this.spendResource = spendResource;
    });
  }

  async close(options?: Record<string, unknown>): Promise<this> {
    this.settle(null);
    return super.close(options) as Promise<this>;
  }

  private renderContent(): string {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${escapeHtml(this.model.header.eyebrow)}</p>
        <div>
          <h2>${escapeHtml(this.model.header.title)}</h2>
          <p>${escapeHtml(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(renderVariantOption).join("")}
        </div>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--cost">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Custo</h3>
          <label class="paranormal-toolkit-ritual-cast__spend-toggle">
            <input type="checkbox" name="spendResource" ${this.model.cost.spendResourceChecked ? "checked" : ""}>
            <span>Gastar ao conjurar</span>
          </label>
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo base</dt><dd>${escapeHtml(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${escapeHtml(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${escapeHtml(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${escapeHtml(this.model.automation.title)}</strong></p>
        <p>${escapeHtml(this.model.automation.description)}</p>
      </section>

      <footer class="paranormal-toolkit-ritual-cast__footer">
        <button type="button" data-action="cancel">Cancelar</button>
        <button type="button" data-action="cast" class="paranormal-toolkit-ritual-cast__cast-button">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>Conjurar</span>
        </button>
      </footer>
    `;
  }

  private static async onCast(this: RitualCastApplication, event: PointerEvent): Promise<void> {
    event.preventDefault();

    const root = resolveActionRoot(event);
    const options = readOptionsFromRoot(root, this.spendResource, this.selectedVariant);

    this.settle(options);
    await this.close();
  }

  private static async onCancel(this: RitualCastApplication, event: PointerEvent): Promise<void> {
    event.preventDefault();
    this.settle(null);
    await this.close();
  }

  private settle(value: RitualCastOptions | null): void {
    if (this.isResolved) return;
    this.isResolved = true;
    this.resolveRequest(value);
  }
}

function renderVariantOption(option: RitualCastFormModel): string {
  const checked = option.checked ? "checked" : "";
  const disabled = option.enabled ? "" : "disabled";
  const disabledClass = option.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled";
  const details = option.details.map((detail) => `<span>${escapeHtml(detail)}</span>`).join("");

  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${disabledClass}"
      data-paranormal-toolkit-ritual-cast-form="${escapeHtml(option.variant)}"
      role="radio"
      aria-checked="${option.checked ? "true" : "false"}"
      aria-disabled="${option.enabled ? "false" : "true"}"
      tabindex="${option.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${escapeHtml(option.variant)}" ${checked} ${disabled}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${escapeHtml(option.label)}</strong>
        <em>${escapeHtml(option.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${details}</span>
    </label>
  `;
}

function bindVariantSelection(root: HTMLElement, onVariantSelected: (variant: RitualCastVariant) => void): void {
  const formCards = Array.from(root.querySelectorAll<HTMLElement>("[data-paranormal-toolkit-ritual-cast-form]"));

  for (const formCard of formCards) {
    formCard.addEventListener("click", () => selectVariantCard(root, formCard, onVariantSelected));
    formCard.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectVariantCard(root, formCard, onVariantSelected);
    });
  }

  const selectedVariant = updateVariantCardState(root);
  if (selectedVariant) {
    onVariantSelected(selectedVariant);
  }
}

function selectVariantCard(
  root: HTMLElement,
  formCard: HTMLElement,
  onVariantSelected: (variant: RitualCastVariant) => void
): void {
  const input = formCard.querySelector<HTMLInputElement>('input[name="variant"]');
  if (!input || input.disabled || !isRitualCastVariant(input.value)) return;

  input.checked = true;
  root.dataset.paranormalToolkitSelectedVariant = input.value;
  onVariantSelected(input.value);
  input.dispatchEvent(new Event("change", { bubbles: true }));
  updateVariantCardState(root);
}

function updateVariantCardState(root: HTMLElement): RitualCastVariant | null {
  const formCards = root.querySelectorAll<HTMLElement>("[data-paranormal-toolkit-ritual-cast-form]");
  let selectedVariant: RitualCastVariant | null = null;

  for (const formCard of formCards) {
    const input = formCard.querySelector<HTMLInputElement>('input[name="variant"]');
    const isChecked = input?.checked === true;
    formCard.setAttribute("aria-checked", isChecked ? "true" : "false");

    if (isChecked && isRitualCastVariant(input.value)) {
      selectedVariant = input.value;
    }
  }

  if (selectedVariant) {
    root.dataset.paranormalToolkitSelectedVariant = selectedVariant;
  }

  return selectedVariant;
}

function bindSpendResourceToggle(root: HTMLElement, onSpendResourceChanged: (spendResource: boolean) => void): void {
  const input = root.querySelector<HTMLInputElement>('input[name="spendResource"]');
  if (!input) return;

  onSpendResourceChanged(input.checked);
  input.addEventListener("change", () => {
    onSpendResourceChanged(input.checked);
  });
}

function readOptionsFromRoot(
  root: HTMLElement | null,
  fallbackSpendResource: boolean,
  fallbackVariant: RitualCastVariant
): RitualCastOptions {
  const variant = readVariant(root) ?? fallbackVariant;
  const spendResource = root?.querySelector<HTMLInputElement>('input[name="spendResource"]')?.checked ?? fallbackSpendResource;

  return {
    variant,
    spendResource
  };
}

function readVariant(root: HTMLElement | null): RitualCastVariant | null {
  const checkedValue = root?.querySelector<HTMLInputElement>('input[name="variant"]:checked')?.value;
  if (isRitualCastVariant(checkedValue)) return checkedValue;

  const selectedValue = root?.dataset.paranormalToolkitSelectedVariant;
  return isRitualCastVariant(selectedValue) ? selectedValue : null;
}

function resolveActionRoot(event: Event): HTMLElement | null {
  for (const entry of [event.currentTarget, event.target, ...event.composedPath()]) {
    if (!(entry instanceof HTMLElement)) continue;

    const root = entry.closest<HTMLElement>(".paranormal-toolkit-ritual-cast");
    if (root) return root;
  }

  return null;
}

function escapeHtml(value: string): string {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
