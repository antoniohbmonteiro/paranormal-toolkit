import { MODULE_ID, MODULE_TITLE } from "../constants";
import type { RitualCost } from "../core/rituals/ritual-types";
import {
  isRitualCastVariant,
  type RitualCastOptions,
  type RitualCastVariant,
  type RitualCastVariantOption
} from "../features/rituals/ritual-cast-options";

const { ApplicationV2 } = foundry.applications.api;

export type RitualCastApplicationInput = {
  actor: Actor;
  ritual: Item;
  targetNames: string[];
  cost: RitualCost | null;
  defaultSpendResource: boolean;
  variantOptions: RitualCastVariantOption[];
  automationStatus?: "assisted" | "generic";
};

type RitualCastResolution = (value: RitualCastOptions | null) => void;

export class RitualCastApplication extends ApplicationV2 {
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

  constructor(
    private readonly input: RitualCastApplicationInput,
    private readonly resolveRequest: RitualCastResolution
  ) {
    super({
      id: `${MODULE_ID}-ritual-cast-${input.actor.id ?? foundry.utils.randomID()}-${input.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${input.ritual.name ?? "ritual"}`
      }
    });
  }

  async _renderHTML(_context: object, _options: object): Promise<HTMLElement> {
    const root = document.createElement("div");
    root.className = "paranormal-toolkit-ritual-cast";
    root.innerHTML = this.renderContent();
    return root;
  }

  _replaceHTML(result: HTMLElement, content: HTMLElement, _options: object): void {
    content.replaceChildren(result);
  }

  async close(options?: object): Promise<this> {
    this.settle(null);
    return super.close(options) as Promise<this>;
  }

  private renderContent(): string {
    const ritualName = this.input.ritual.name ?? "Ritual sem nome";
    const targetText = this.input.targetNames.length > 0 ? this.input.targetNames.join(", ") : "Nenhum alvo selecionado";
    const baseCost = this.input.cost ? `${this.input.cost.amount} ${this.input.cost.resource}` : "não resolvido";
    const checked = this.input.defaultSpendResource ? "checked" : "";

    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${escapeHtml(MODULE_TITLE)}</p>
        <div>
          <h2>${escapeHtml(ritualName)}</h2>
          <p>${escapeHtml(createRitualSubtitle(this.input.ritual))}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.input.variantOptions.map((option) => renderVariantOption(option, this.input.cost)).join("")}
        </div>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--cost">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Custo</h3>
          <label class="paranormal-toolkit-ritual-cast__spend-toggle">
            <input type="checkbox" name="spendResource" ${checked}>
            <span>Gastar ao conjurar</span>
          </label>
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo base</dt><dd>${escapeHtml(baseCost)}</dd></div>
          <div><dt>Conjurador</dt><dd>${escapeHtml(this.input.actor.name ?? "Ator sem nome")}</dd></div>
          <div><dt>Alvos</dt><dd>${escapeHtml(targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.input.automationStatus ?? "assisted"}">
        <h3>Automação</h3>
        ${renderAutomationSummary(this.input)}
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
    const options = readOptionsFromRoot(root, this.input.defaultSpendResource);

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

function renderVariantOption(option: RitualCastVariantOption, cost: RitualCost | null): string {
  const checked = option.variant === "base" ? "checked" : "";
  const disabled = option.enabled ? "" : "disabled";
  const disabledClass = option.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled";
  const finalCost = option.finalCostText ?? createFallbackFinalCostText(cost);
  const details = [...option.details, option.enabled ? "" : option.unavailableReason ?? "não disponível neste ritual"]
    .filter((detail) => detail.trim().length > 0)
    .filter((detail) => !detail.toLocaleLowerCase().startsWith("custo final"))
    .map((detail) => `<span>${escapeHtml(detail)}</span>`)
    .join("");

  return `
    <label class="paranormal-toolkit-ritual-cast__form${disabledClass}">
      <input type="radio" name="variant" value="${escapeHtml(option.variant)}" ${checked} ${disabled}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${escapeHtml(option.label)}</strong>
        <em>${escapeHtml(finalCost)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${details}</span>
    </label>
  `;
}

function createFallbackFinalCostText(cost: RitualCost | null): string {
  return cost ? `${cost.amount} ${cost.resource}` : "custo não resolvido";
}

function renderAutomationSummary(input: RitualCastApplicationInput): string {
  if (input.automationStatus === "generic") {
    return `
      <p><strong>Sem automação configurada.</strong></p>
      <p>O Toolkit vai registrar a conjuração e gastar o recurso escolhido. Rolagens, dano, resistência e efeitos continuam manuais.</p>
    `;
  }

  return `
    <p><strong>Automação assistida disponível.</strong></p>
    <p>O Toolkit vai preparar custo, rolagens e ações assistidas no card persistente do chat.</p>
  `;
}

function readOptionsFromRoot(root: HTMLElement | null, defaultSpendResource: boolean): RitualCastOptions {
  const variant = readVariant(root);
  const spendResource = root?.querySelector<HTMLInputElement>('input[name="spendResource"]')?.checked ?? defaultSpendResource;

  return {
    variant,
    spendResource
  };
}

function readVariant(root: HTMLElement | null): RitualCastVariant {
  const value = root?.querySelector<HTMLInputElement>('input[name="variant"]:checked')?.value;
  return isRitualCastVariant(value) ? value : "base";
}

function resolveActionRoot(event: Event): HTMLElement | null {
  const target = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
  return target?.closest<HTMLElement>(".paranormal-toolkit-ritual-cast") ?? null;
}

function createRitualSubtitle(ritual: Item): string {
  const system = ritual.system as { element?: unknown; circle?: unknown } | undefined;
  const parts = [formatUnknownLabel(system?.element), formatCircle(system?.circle)].filter(isNonEmptyString);
  return parts.length > 0 ? parts.join(" • ") : "Conjuração de ritual";
}

function formatCircle(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return `${value}º Círculo`;
}

function formatUnknownLabel(value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  const trimmed = value.trim();
  return `${trimmed.charAt(0).toLocaleUpperCase()}${trimmed.slice(1)}`;
}

function isNonEmptyString(value: string | null): value is string {
  return typeof value === "string" && value.length > 0;
}

function escapeHtml(value: string): string {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
