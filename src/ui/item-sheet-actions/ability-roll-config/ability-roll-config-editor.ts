import { MODULE_ID } from "../../../constants";
import {
  createDefaultAbilityRollEntry,
  hasConfiguredAbilityRolls,
  MAX_ABILITY_ROLLS,
  normalizeAbilityRollConfig,
  type AbilityRollConfig,
} from "../../../features/abilities/config/ability-roll-config";
import { createButton } from "./ability-roll-config-dom";
import { createAbilityRollCard } from "./ability-roll-config-roll-card";

export type AbilityRollConfigEditorOptions = {
  itemKey: string;
  config: AbilityRollConfig;
  editable: boolean;
  onSave(config: AbilityRollConfig): Promise<AbilityRollConfig>;
  onClear(): Promise<AbilityRollConfig>;
};

export function createAbilityRollConfigEditor(
  options: AbilityRollConfigEditorOptions,
): HTMLElement {
  let state = copyConfig(options.config);

  const block = document.createElement("section");
  block.classList.add(`${MODULE_ID}-ability-roll-config`);
  block.dataset.paranormalToolkitAbilityRollConfig = options.itemKey;

  const header = createHeader(state);
  const hint = document.createElement("p");
  hint.classList.add(`${MODULE_ID}-ability-roll-config__hint`);
  hint.textContent =
    "Configure uma ou mais rolagens. Cada uma pode usar uma fórmula fixa ou uma progressão liberada conforme o NEX do personagem.";

  const list = document.createElement("div");
  list.classList.add(`${MODULE_ID}-ability-roll-config__list`);

  const addRoll = createButton(
    "Adicionar rolagem",
    "fa-solid fa-plus",
    `${MODULE_ID}-ability-roll-config__add-roll`,
  );
  addRoll.addEventListener("click", () => {
    if (state.rolls.length >= MAX_ABILITY_ROLLS) return;
    state.rolls.push(createDefaultAbilityRollEntry(state.rolls.length + 1));
    renderList();
    setStatus("Rolagem adicionada. Salve para confirmar.");
  });

  const actions = document.createElement("div");
  actions.classList.add(`${MODULE_ID}-ability-roll-config__actions`);

  const save = createButton("Salvar fórmulas", "fa-solid fa-floppy-disk");
  const clear = createButton("Limpar", "fa-solid fa-eraser");
  actions.append(save, clear);

  const footer = document.createElement("footer");
  footer.classList.add(`${MODULE_ID}-ability-roll-config__footer`);
  footer.append(addRoll, actions);

  const status = document.createElement("p");
  status.classList.add(`${MODULE_ID}-ability-roll-config__status`);
  status.textContent = options.editable
    ? "Salvo em flags do módulo; não altera os campos do sistema."
    : "Somente leitura nesta ficha.";

  block.append(header, hint, list, footer, status);

  save.addEventListener("click", () => {
    if (!options.editable) return;
    void saveState();
  });

  clear.addEventListener("click", () => {
    if (!options.editable) return;
    void clearState();
  });

  renderList();
  return block;

  function renderList(): void {
    list.replaceChildren();

    if (state.rolls.length === 0) {
      const empty = document.createElement("p");
      empty.classList.add(`${MODULE_ID}-ability-roll-config__empty`);
      empty.textContent = "Nenhuma rolagem configurada.";
      list.append(empty);
    } else {
      state.rolls.forEach((roll, index) => {
        list.append(
          createAbilityRollCard({
            roll,
            index,
            editable: options.editable,
            onChange: () => {
              updateBadge(header, state);
              setStatus("Alterações pendentes. Salve para confirmar.");
            },
            onRemove: () => {
              state.rolls.splice(index, 1);
              renderList();
              setStatus("Rolagem removida. Salve para confirmar.");
            },
          }),
        );
      });
    }

    updateBadge(header, state);
    updateActionAvailability(false);
  }

  async function saveState(): Promise<void> {
    setBusy(true);
    setStatus("Salvando configuração...");

    try {
      const normalized = normalizeAbilityRollConfig(state);
      if (!normalized) throw new Error("Configuração inválida.");

      state = copyConfig(await options.onSave(normalized));
      renderList();
      setStatus("Configuração salva.");
    } catch (cause) {
      console.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade.",
        cause,
      );
      setStatus("Não foi possível salvar a configuração.");
      ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível salvar as rolagens da habilidade.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function clearState(): Promise<void> {
    setBusy(true);
    setStatus("Limpando configuração...");

    try {
      state = copyConfig(await options.onClear());
      renderList();
      setStatus("Configuração removida.");
    } catch (cause) {
      console.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade.",
        cause,
      );
      setStatus("Não foi possível limpar a configuração.");
      ui.notifications?.warn(
        "Paranormal Toolkit: não foi possível limpar as rolagens da habilidade.",
      );
    } finally {
      setBusy(false);
    }
  }

  function setBusy(busy: boolean): void {
    block.classList.toggle(`${MODULE_ID}-ability-roll-config--busy`, busy);
    updateActionAvailability(busy);
  }

  function updateActionAvailability(busy: boolean): void {
    save.disabled = busy || !options.editable;
    clear.disabled = busy || !options.editable;
    addRoll.disabled =
      busy || !options.editable || state.rolls.length >= MAX_ABILITY_ROLLS;
  }

  function setStatus(message: string): void {
    status.textContent = message;
  }
}

function createHeader(config: AbilityRollConfig): HTMLElement {
  const header = document.createElement("header");
  header.classList.add(`${MODULE_ID}-ability-roll-config__header`);

  const title = document.createElement("div");
  title.classList.add(`${MODULE_ID}-ability-roll-config__title`);
  const moduleName = document.createElement("strong");
  moduleName.textContent = "Paranormal Toolkit";
  const featureName = document.createElement("span");
  featureName.textContent = "Fórmulas de rolagem";
  title.append(moduleName, featureName);

  const badge = document.createElement("span");
  badge.classList.add(`${MODULE_ID}-ability-roll-config__badge`);
  header.append(title, badge);
  updateBadge(header, config);
  return header;
}

function updateBadge(header: HTMLElement, config: AbilityRollConfig): void {
  const badge = header.querySelector<HTMLElement>(
    `.${MODULE_ID}-ability-roll-config__badge`,
  );
  if (badge) {
    badge.textContent = hasConfiguredAbilityRolls(config)
      ? "Configurada"
      : "Rascunho";
  }
}

function copyConfig(config: AbilityRollConfig): AbilityRollConfig {
  return JSON.parse(JSON.stringify(config)) as AbilityRollConfig;
}
