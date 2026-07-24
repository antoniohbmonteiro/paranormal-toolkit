import { MODULE_ID } from "../constants";
import {
  createAbilityUseDialogModel,
  type AbilityUseDialogModel,
  type AbilityUseDialogModelInput,
} from "../features/abilities/ability-use-dialog-model";
import type { AbilityUseOptions } from "../features/abilities/ability-use-options";

const { ApplicationV2 } = foundry.applications.api;

type AbilityUseResolution = (value: AbilityUseOptions | null) => void;

export class AbilityUseApplication extends ApplicationV2 {
  private readonly model: AbilityUseDialogModel;
  private spendResource: boolean;
  private isResolved = false;

  static DEFAULT_OPTIONS = {
    id: `${MODULE_ID}-ability-use`,
    classes: [
      MODULE_ID,
      "paranormal-toolkit-ritual-cast-app",
      "paranormal-toolkit-ability-use-app",
    ],
    tag: "section",
    position: {
      width: 540,
      height: "auto",
    },
    window: {
      title: "Usar habilidade",
      icon: "fa-solid fa-bolt",
      resizable: true,
    },
    actions: {
      useAbility: AbilityUseApplication.onUseAbility,
      cancel: AbilityUseApplication.onCancel,
    },
  };

  static async request(
    input: AbilityUseDialogModelInput,
  ): Promise<AbilityUseOptions | null> {
    return new Promise((resolve) => {
      const app = new AbilityUseApplication(input, resolve);
      void app.render({ force: true });
    });
  }

  constructor(
    input: AbilityUseDialogModelInput,
    private readonly resolveRequest: AbilityUseResolution,
  ) {
    super({
      id: `${MODULE_ID}-ability-use-${foundry.utils.randomID()}`,
      window: {
        title: `Usar ${input.abilityName}`,
      },
    });

    this.model = createAbilityUseDialogModel(input);
    this.spendResource = this.model.cost.spendResourceChecked;
  }

  async _renderHTML(_context: object, _options: object): Promise<HTMLElement> {
    const root = document.createElement("div");
    root.className = "paranormal-toolkit-ritual-cast paranormal-toolkit-ability-use";
    root.innerHTML = this.renderContent();
    return root;
  }

  _replaceHTML(result: HTMLElement, content: HTMLElement, _options: object): void {
    content.replaceChildren(result);

    const root =
      content.querySelector<HTMLElement>(".paranormal-toolkit-ability-use") ??
      content;

    this.bindSpendResourceToggle(root);
    this.updateInteractiveState(root);
  }

  async close(options?: Record<string, unknown>): Promise<this> {
    this.settle(null);
    return super.close(options) as Promise<this>;
  }

  private renderContent(): string {
    const costSection = this.model.cost.hasCost
      ? this.renderPaidCostSection()
      : this.renderFreeCostSection();

    return `
      <header class="paranormal-toolkit-ritual-cast__header paranormal-toolkit-ability-use__header">
        <img
          class="paranormal-toolkit-ability-use__image"
          src="${escapeAttribute(this.model.header.image)}"
          alt=""
        >
        <div>
          <p class="paranormal-toolkit-ritual-cast__eyebrow">${escapeHtml(this.model.header.eyebrow)}</p>
          <h2>${escapeHtml(this.model.header.title)}</h2>
          <p>${escapeHtml(this.model.header.subtitle)}</p>
        </div>
      </header>

      ${costSection}

      <footer class="paranormal-toolkit-ritual-cast__footer">
        <button type="button" data-action="cancel">Cancelar</button>
        <button
          type="button"
          data-action="useAbility"
          class="paranormal-toolkit-ritual-cast__cast-button paranormal-toolkit-ability-use__submit"
        >
          <i class="fa-solid ${this.model.passive ? "fa-message" : "fa-bolt"}"></i>
          <span data-paranormal-toolkit-ability-submit-label>${escapeHtml(this.model.primaryActionLabel)}</span>
        </button>
      </footer>
    `;
  }

  private renderPaidCostSection(): string {
    const warningHidden = this.model.cost.canSpend ? "hidden" : "";

    return `
      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--cost">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Custo</h3>
          <label class="paranormal-toolkit-ritual-cast__spend-toggle">
            <input type="checkbox" name="spendResource" checked>
            <span>${escapeHtml(this.model.cost.toggleLabel)}</span>
          </label>
        </div>

        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo</dt><dd>${escapeHtml(this.model.cost.costText)}</dd></div>
          <div><dt>Recurso atual</dt><dd>${escapeHtml(this.model.cost.currentText)}</dd></div>
          <div>
            <dt>Após o uso</dt>
            <dd data-paranormal-toolkit-ability-after>${escapeHtml(this.model.cost.afterText)}</dd>
          </div>
        </dl>

        <div
          class="paranormal-toolkit-ability-use__warning"
          data-paranormal-toolkit-ability-warning
          aria-live="polite"
          ${warningHidden}
        >
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>Você não possui ${escapeHtml(this.model.cost.resource)} suficiente para pagar este custo.</span>
        </div>
      </section>
    `;
  }

  private renderFreeCostSection(): string {
    const message = this.model.passive
      ? "Esta é uma habilidade passiva e não consome recursos."
      : "Esta habilidade não possui custo de recurso.";

    return `
      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--cost">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Custo</h3>
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo</dt><dd>Nenhum</dd></div>
          <div><dt>Personagem</dt><dd>${escapeHtml(this.model.header.actorName)}</dd></div>
        </dl>
        <p class="paranormal-toolkit-ability-use__note">${escapeHtml(message)}</p>
      </section>
    `;
  }

  private bindSpendResourceToggle(root: HTMLElement): void {
    const input = root.querySelector<HTMLInputElement>('input[name="spendResource"]');
    if (!input) return;

    input.addEventListener("change", () => {
      this.spendResource = input.checked;
      this.updateInteractiveState(root);
    });
  }

  private updateInteractiveState(root: HTMLElement): void {
    const submitButton = root.querySelector<HTMLButtonElement>(
      '[data-action="useAbility"]',
    );
    const submitLabel = root.querySelector<HTMLElement>(
      "[data-paranormal-toolkit-ability-submit-label]",
    );
    const afterValue = root.querySelector<HTMLElement>(
      "[data-paranormal-toolkit-ability-after]",
    );
    const warning = root.querySelector<HTMLElement>(
      "[data-paranormal-toolkit-ability-warning]",
    );

    const mustBlock =
      this.model.cost.hasCost &&
      this.spendResource &&
      !this.model.cost.canSpend;

    if (submitButton) submitButton.disabled = mustBlock;
    if (warning) warning.hidden = !mustBlock;
    if (afterValue) {
      afterValue.textContent = this.spendResource
        ? this.model.cost.afterText
        : "Não será alterado";
    }
    if (submitLabel && !this.model.passive) {
      submitLabel.textContent = this.model.cost.hasCost
        ? this.spendResource
          ? "Usar habilidade"
          : "Usar sem gastar"
        : this.model.primaryActionLabel;
    }
  }

  private static async onUseAbility(
    this: AbilityUseApplication,
    event: PointerEvent,
  ): Promise<void> {
    event.preventDefault();

    if (
      this.model.cost.hasCost &&
      this.spendResource &&
      !this.model.cost.canSpend
    ) {
      return;
    }

    this.settle({
      spendResource: this.model.cost.hasCost && this.spendResource,
    });
    await this.close();
  }

  private static async onCancel(
    this: AbilityUseApplication,
    event: PointerEvent,
  ): Promise<void> {
    event.preventDefault();
    this.settle(null);
    await this.close();
  }

  private settle(value: AbilityUseOptions | null): void {
    if (this.isResolved) return;
    this.isResolved = true;
    this.resolveRequest(value);
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
