import type { RitualCost } from "../../core/rituals/ritual-types";
import {
  isRitualCastVariant,
  type RitualCastOptions,
  type RitualCastVariant,
  type RitualCastVariantOption
} from "./ritual-cast-options";

type RitualCastDialogInput = {
  actor: Actor;
  ritual: Item;
  targetNames: string[];
  cost: RitualCost | null;
  defaultSpendResource: boolean;
  variantOptions: RitualCastVariantOption[];
};

type DialogHtmlLike = HTMLElement | { 0?: unknown };

type LegacyDialogData = {
  title: string;
  content: string;
  buttons: Record<string, { label: string; icon?: string; callback?: (html: unknown) => void }>;
  default: string;
  close: () => void;
};

type LegacyDialogInstance = {
  render(force?: boolean): void;
};

type LegacyDialogConstructor = new (data: LegacyDialogData) => LegacyDialogInstance;

export async function requestRitualCastOptions(input: RitualCastDialogInput): Promise<RitualCastOptions | null> {
  const DialogConstructor = getLegacyDialogConstructor();

  if (!DialogConstructor) {
    ui.notifications?.warn("Paranormal Toolkit: Dialog não disponível. Usando opções padrão do ritual.");
    return {
      variant: "base",
      spendResource: input.defaultSpendResource
    };
  }

  return new Promise((resolve) => {
    let resolved = false;

    const settle = (value: RitualCastOptions | null): void => {
      if (resolved) return;
      resolved = true;
      resolve(value);
    };

    new DialogConstructor({
      title: `Conjurar ${input.ritual.name ?? "ritual"}`,
      content: createDialogContent(input),
      default: "cast",
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: () => settle(null)
        },
        cast: {
          icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
          label: "Conjurar",
          callback: (html: unknown) => settle(readOptionsFromDialog(html, input.defaultSpendResource))
        }
      },
      close: () => settle(null)
    }).render(true);
  });
}

function createDialogContent(input: RitualCastDialogInput): string {
  const targetText = input.targetNames.length > 0 ? input.targetNames.join(", ") : "Nenhum alvo selecionado";
  const costText = input.cost ? `${input.cost.amount} ${input.cost.resource}` : "não resolvido";
  const checked = input.defaultSpendResource ? "checked" : "";

  return `
    <form class="paranormal-toolkit-ritual-cast-dialog">
      <p class="paranormal-toolkit-ritual-cast-dialog__hint">
        Configure a conjuração antes do Toolkit gastar recurso, rolar dados ou preparar ações no chat.
      </p>

      <aside class="paranormal-toolkit-ritual-cast-dialog__warning" role="note">
        <strong>Aviso temporário</strong>
        <span>
          O Toolkit ainda não consegue impedir completamente as rolagens inline da descrição nem bloquear o card original antes desta confirmação. Use o resultado oficial exibido pelo Paranormal Toolkit.
        </span>
      </aside>

      <fieldset class="paranormal-toolkit-ritual-cast-dialog__fieldset">
        <legend>Forma</legend>
        ${input.variantOptions.map(createVariantOptionMarkup).join("")}
      </fieldset>

      <label class="paranormal-toolkit-ritual-cast-dialog__checkbox">
        <input type="checkbox" name="spendResource" ${checked}>
        Gastar PE/PD automaticamente
      </label>

      <dl class="paranormal-toolkit-ritual-cast-dialog__summary">
        <div><dt>Custo base previsto</dt><dd>${escapeHtml(costText)}</dd></div>
        <div><dt>Conjurador</dt><dd>${escapeHtml(input.actor.name ?? "Ator sem nome")}</dd></div>
        <div><dt>Alvos</dt><dd>${escapeHtml(targetText)}</dd></div>
      </dl>
    </form>
  `;
}

function createVariantOptionMarkup(option: RitualCastVariantOption): string {
  const checked = option.variant === "base" ? "checked" : "";
  const disabled = option.enabled ? "" : "disabled";
  const unavailable = option.enabled ? "" : option.unavailableReason ?? "não disponível neste ritual";
  const details = [...option.details, unavailable].filter((detail) => detail.length > 0).join(" · ");
  const disabledClass = option.enabled ? "" : " paranormal-toolkit-ritual-cast-dialog__variant--disabled";

  return `
    <label class="paranormal-toolkit-ritual-cast-dialog__variant${disabledClass}">
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-main">
        <input type="radio" name="variant" value="${escapeHtml(option.variant)}" ${checked} ${disabled}>
        <strong>${escapeHtml(option.label)}</strong>
      </span>
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-details">${escapeHtml(details)}</span>
    </label>
  `;
}

function readOptionsFromDialog(html: unknown, defaultSpendResource: boolean): RitualCastOptions {
  const root = resolveRootElement(html);
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

function resolveRootElement(html: unknown): HTMLElement | null {
  if (html instanceof HTMLElement) return html;

  if (html && typeof html === "object") {
    const maybeArrayLike = html as DialogHtmlLike;

    if (maybeArrayLike[0] instanceof HTMLElement) {
      return maybeArrayLike[0];
    }
  }

  return null;
}

function getLegacyDialogConstructor(): LegacyDialogConstructor | null {
  const globalWithDialog = globalThis as { Dialog?: LegacyDialogConstructor };
  return globalWithDialog.Dialog ?? null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
