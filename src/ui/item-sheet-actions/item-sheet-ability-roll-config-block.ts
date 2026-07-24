import { MODULE_ID } from "../../constants";
import { ModuleLogger } from "../../core/module-logger";
import {
  clearAbilityRollConfig,
  createDefaultAbilityRollConfig,
  getAbilityRollConfigForEditing,
  writeAbilityRollConfig,
} from "../../features/abilities/config/ability-roll-config";
import { ensureModuleStylesheet } from "../styles/module-stylesheet-loader";
import { createAbilityRollConfigEditor } from "./ability-roll-config/ability-roll-config-editor";

const BLOCK_SELECTOR = "[data-paranormal-toolkit-ability-roll-config]";
const REGISTERED_FLAG = `__${MODULE_ID}_abilityRollConfigBlockRegistered`;

const RENDER_HOOKS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2",
] as const;

type ItemSheetLike = {
  item?: Item;
  document?: unknown;
};

export function registerItemSheetAbilityRollConfigBlock(): void {
  const globalObject = globalThis as typeof globalThis & Record<string, unknown>;
  if (globalObject[REGISTERED_FLAG]) return;

  ensureModuleStylesheet("styles/ability-roll-config.css");

  for (const hookName of RENDER_HOOKS) {
    Hooks.on(hookName, (...args: unknown[]) => {
      renderAbilityRollConfigBlock(args[0] as ItemSheetLike, args[1]);
    });
  }

  globalObject[REGISTERED_FLAG] = true;
  ModuleLogger.info(
    "Bloco de configuração de rolagens de habilidade registrado na ficha de item.",
  );
}

function renderAbilityRollConfigBlock(
  sheet: ItemSheetLike,
  html: unknown,
): void {
  const item = getSheetItem(sheet);
  if (!item || item.type !== "ability") return;

  const root = resolveRootElement(html);
  if (!root) return;

  const abilityTab = root.querySelector<HTMLElement>(
    'section[data-tab="abilityAttr"]',
  );
  if (!abilityTab) return;

  for (const existing of Array.from(
    abilityTab.querySelectorAll<HTMLElement>(BLOCK_SELECTOR),
  )) {
    existing.remove();
  }

  const editor = createAbilityRollConfigEditor({
    itemKey: item.uuid ?? item.id ?? "ability",
    config: getAbilityRollConfigForEditing(item),
    editable: canEditAbilityRollConfig(item),
    onSave: async (config) => {
      const saved = await writeAbilityRollConfig(item, config);
      ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade salvas.",
      );
      return saved;
    },
    onClear: async () => {
      await clearAbilityRollConfig(item);
      ui.notifications?.info(
        "Paranormal Toolkit: rolagens da habilidade removidas.",
      );
      return createDefaultAbilityRollConfig();
    },
  });

  insertEditor(abilityTab, editor);
}

function insertEditor(abilityTab: HTMLElement, editor: HTMLElement): void {
  const systemSection = abilityTab.querySelector<HTMLElement>(
    ".class-attributes-section",
  );
  if (systemSection?.parentElement) {
    systemSection.insertAdjacentElement("afterend", editor);
    return;
  }

  const content =
    abilityTab.querySelector<HTMLElement>(".content-item") ?? abilityTab;
  content.append(editor);
}

function getSheetItem(sheet: ItemSheetLike): Item | null {
  if (isItem(sheet.item)) return sheet.item;
  if (isItem(sheet.document)) return sheet.document;
  return null;
}

function canEditAbilityRollConfig(item: Item): boolean {
  return Boolean(
    game.user?.isGM ||
      (item as unknown as { isOwner?: unknown }).isOwner === true,
  );
}

function resolveRootElement(html: unknown): HTMLElement | null {
  if (html instanceof HTMLElement) return html;

  if (html && typeof html === "object") {
    const arrayLike = html as { 0?: unknown; element?: unknown };
    if (arrayLike[0] instanceof HTMLElement) return arrayLike[0];
    if (arrayLike.element instanceof HTMLElement) return arrayLike.element;
  }

  return null;
}

function isItem(value: unknown): value is Item {
  return Boolean(
    value &&
      typeof value === "object" &&
      "type" in value &&
      "system" in value &&
      "getFlag" in value &&
      "setFlag" in value,
  );
}
