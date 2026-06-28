import { MODULE_ID, MODULE_TITLE } from "../constants";
import type { RitualPresetApplicationResult } from "../features/rituals/presets/ritual-preset-application-service";
import type { RitualPresetDiagnostic, RitualPresetDiagnosticEntry } from "../features/rituals/presets/ritual-preset-diagnostic";
import type { ToolkitServices } from "../toolkit-services";

const { ApplicationV2 } = foundry.applications.api;

export class RitualPresetManagerApplication extends ApplicationV2 {
  private isApplying = false;
  private lastApplicationResult: RitualPresetApplicationResult | null = null;

  static DEFAULT_OPTIONS = {
    id: `${MODULE_ID}-ritual-preset-manager`,
    classes: [MODULE_ID, "paranormal-toolkit-ritual-preset-manager"],
    tag: "section",
    position: {
      width: 560,
      height: "auto"
    },
    window: {
      title: "Gerenciar presets de rituais",
      icon: "fa-solid fa-wand-magic-sparkles",
      resizable: true
    },
    actions: {
      apply: RitualPresetManagerApplication.onApply,
      cancel: RitualPresetManagerApplication.onCancel
    }
  };

  constructor(
    private readonly actor: Actor,
    private readonly services: ToolkitServices
  ) {
    super({
      id: `${MODULE_ID}-ritual-preset-manager-${actor.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Presets de rituais: ${actor.name ?? "Ator"}`
      }
    });
  }

  async _renderHTML(_context: object, _options: object): Promise<HTMLElement> {
    const diagnostic = this.services.ritualPresetDiagnostic.analyzeActor(this.actor);
    const root = document.createElement("div");
    root.className = "paranormal-toolkit-preset-manager";
    root.innerHTML = this.renderContent(diagnostic);
    return root;
  }

  _replaceHTML(result: HTMLElement, content: HTMLElement, _options: object): void {
    content.replaceChildren(result);
  }

  private renderContent(diagnostic: RitualPresetDiagnostic): string {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${escapeHtml(MODULE_TITLE)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${escapeHtml(diagnostic.actorName)}</strong></p>
        </div>
        ${this.renderSummary(diagnostic)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${renderSection("Prontos para aplicar", "available", diagnostic.available, "fa-solid fa-plus")}
        ${renderSection("Desatualizados", "outdated", diagnostic.outdated, "fa-solid fa-rotate")}
        ${renderSection("Automatizados", "upToDate", diagnostic.upToDate, "fa-solid fa-check")}
      </div>

      <footer class="paranormal-toolkit-preset-manager__footer">
        <button type="button" data-action="cancel">Cancelar</button>
        <button type="button" data-action="apply" ${diagnostic.canApply && !this.isApplying ? "" : "disabled"}>
          ${this.isApplying ? "Aplicando..." : "Aplicar"}
        </button>
      </footer>
    `;
  }

  private renderSummary(diagnostic: RitualPresetDiagnostic): string {
    return `
      <div class="paranormal-toolkit-preset-manager__summary" aria-label="Resumo dos presets">
        <span><strong>${diagnostic.available.length}</strong> prontos</span>
        <span><strong>${diagnostic.outdated.length}</strong> desatualizados</span>
        <span><strong>${diagnostic.upToDate.length}</strong> automatizados</span>
      </div>
    `;
  }

  private renderLastResult(): string {
    if (!this.lastApplicationResult) return "";

    const applied = this.lastApplicationResult.applied.length;
    const skipped = this.lastApplicationResult.skipped.length;
    const detail = skipped > 0 ? ` ${skipped} pendente(s) não puderam ser aplicados.` : "";

    return `
      <div class="paranormal-toolkit-preset-manager__result">
        <strong>Aplicação concluída.</strong>
        <span>${applied} preset(s) aplicado(s).${detail}</span>
      </div>
    `;
  }

  private static async onApply(this: RitualPresetManagerApplication, event: PointerEvent): Promise<void> {
    event.preventDefault();

    if (!game.user?.isGM) {
      ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode aplicar presets de rituais.");
      return;
    }

    const diagnostic = this.services.ritualPresetDiagnostic.analyzeActor(this.actor);
    if (!diagnostic.canApply || this.isApplying) {
      return;
    }

    this.isApplying = true;
    await this.render({ force: true });

    try {
      this.lastApplicationResult = await this.services.ritualPresetApplications.applyPending(this.actor);
      const applied = this.lastApplicationResult.applied.length;
      ui.notifications?.info(`Paranormal Toolkit: ${applied} preset(s) aplicado(s) em ${this.actor.name ?? "ator"}.`);
    } finally {
      this.isApplying = false;
      await this.render({ force: true });
    }
  }

  private static async onCancel(this: RitualPresetManagerApplication, event: PointerEvent): Promise<void> {
    event.preventDefault();
    await this.close();
  }
}

function renderSection(
  title: string,
  status: RitualPresetDiagnosticEntry["status"],
  entries: RitualPresetDiagnosticEntry[],
  icon: string
): string {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${status}">
      <h3>
        <i class="${icon}"></i>
        <span>${escapeHtml(title)}</span>
        <small>${entries.length}</small>
      </h3>
      ${entries.length > 0 ? renderEntryList(entries) : renderEmptyState(status)}
    </section>
  `;
}

function renderEntryList(entries: RitualPresetDiagnosticEntry[]): string {
  const rows = entries.map(renderEntry).join("");
  return `<ol class="paranormal-toolkit-preset-manager__list">${rows}</ol>`;
}

function renderEntry(entry: RitualPresetDiagnosticEntry): string {
  const preset = entry.preset;
  const presetLabel = preset ? `${preset.label} v${preset.version}` : "Sem preset";
  const appliedVersion = entry.appliedPresetId
    ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${escapeHtml(entry.appliedPresetId)} v${escapeHtml(entry.appliedPresetVersion ?? "?")}</span>`
    : "";

  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${escapeHtml(entry.itemName)}</strong>
        <span>${escapeHtml(entry.reason)}</span>
        ${appliedVersion}
      </div>
      <em>${escapeHtml(presetLabel)}</em>
    </li>
  `;
}

function renderEmptyState(status: RitualPresetDiagnosticEntry["status"]): string {
  const messageByStatus: Record<RitualPresetDiagnosticEntry["status"], string> = {
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  };

  return `<p class="paranormal-toolkit-preset-manager__empty">${escapeHtml(messageByStatus[status])}</p>`;
}

function escapeHtml(value: string): string {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
