import { MODULE_ID } from "../../constants";
import { ModuleLogger } from "../../core/module-logger";
import { RitualPresetManagerApplication } from "../../applications/ritual-preset-manager-app";
import { getActorRituals } from "../../features/rituals/ritual-item-resolver";
import type { ToolkitServices } from "../../toolkit-services";

const ACTION_ID = `${MODULE_ID}.manageRitualPresets`;
const REGISTERED_FLAG = `__${MODULE_ID}_ritualPresetHeaderControlRegistered`;

const HEADER_CONTROL_HOOKS = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
] as const;

type HeaderControlEntry = {
  action: string;
  icon: string;
  label: string;
  visible?: boolean | (() => boolean);
  ownership?: string | number;
  onClick?: (event: Event) => void;
};

type ApplicationActionHandler = (event: PointerEvent, target: HTMLElement) => void;

type SheetActions = Record<string, ApplicationActionHandler>;

type ActorSheetLike = {
  actor?: Actor;
  document?: unknown;
  options?: {
    actions?: SheetActions;
  };
};

export function registerActorSheetRitualPresetAction(services: ToolkitServices): void {
  const globalObject = globalThis as typeof globalThis & Record<string, unknown>;

  if (globalObject[REGISTERED_FLAG]) return;

  for (const hookName of HEADER_CONTROL_HOOKS) {
    Hooks.on(hookName, (sheet: ActorSheetLike, controls: HeaderControlEntry[]) => {
      addPresetManagerControl(sheet, controls, services);
    });
  }

  globalObject[REGISTERED_FLAG] = true;
  ModuleLogger.info("Ação de presets de rituais registrada no menu da ficha de ator.");
}

function addPresetManagerControl(sheet: ActorSheetLike, controls: HeaderControlEntry[], services: ToolkitServices): void {
  if (!Array.isArray(controls)) return;
  if (!canShowPresetAction(sheet)) return;

  installActionHandler(sheet, services);

  if (controls.some((control) => control.action === ACTION_ID)) return;

  controls.push({
    action: ACTION_ID,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: true,
    onClick: (event) => {
      event.preventDefault();
      event.stopPropagation();
      openPresetManager(sheet, services);
    }
  });
}

function installActionHandler(sheet: ActorSheetLike, services: ToolkitServices): void {
  if (!sheet.options) return;

  sheet.options.actions ??= {};

  if (sheet.options.actions[ACTION_ID]) return;

  sheet.options.actions[ACTION_ID] = (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    openPresetManager(sheet, services);
  };
}

function canShowPresetAction(sheet: ActorSheetLike): boolean {
  if (!game.user?.isGM) return false;

  const actor = getSheetActor(sheet);
  if (!actor) return false;

  return actor.type === "agent" && getActorRituals(actor).length > 0;
}

function openPresetManager(sheet: ActorSheetLike, services: ToolkitServices): void {
  const actor = getSheetActor(sheet);

  if (!actor) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }

  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }

  void new RitualPresetManagerApplication(actor, services).render({ force: true });
}

function getSheetActor(sheet: ActorSheetLike): Actor | null {
  if (isActor(sheet.actor)) return sheet.actor;
  if (isActor(sheet.document)) return sheet.document;
  return null;
}

function isActor(value: unknown): value is Actor {
  return Boolean(value && typeof value === "object" && "items" in value && "type" in value);
}
