import { MODULE_ID } from "../../constants";
import { ModuleLogger } from "../../core/module-logger";
import { RitualPresetManagerApplication } from "../../applications/ritual-preset-manager-app";
import { getActorRituals } from "../../features/rituals/ritual-item-resolver";
import type { ToolkitServices } from "../../toolkit-services";

const ACTION_ID = `${MODULE_ID}.manageRitualPresets`;
const PATCH_FLAG = `__${MODULE_ID}_ritualPresetHeaderControlPatched`;

type HeaderControlEntry = {
  action: string;
  icon: string;
  label: string;
  visible?: boolean | (() => boolean);
  ownership?: string | number;
};

type PatchableActorSheetPrototype = {
  [PATCH_FLAG]?: true;
  _getHeaderControls?: (this: ActorSheetLike) => HeaderControlEntry[];
  _onClickAction?: (this: ActorSheetLike, event: PointerEvent, target: HTMLElement) => void;
};

type ActorSheetLike = {
  actor?: Actor;
  document?: unknown;
};

export function registerActorSheetRitualPresetAction(services: ToolkitServices): void {
  const actorSheetClass = foundry.applications.sheets.ActorSheetV2 as { prototype?: PatchableActorSheetPrototype } | undefined;
  const prototype = actorSheetClass?.prototype;

  if (!prototype || prototype[PATCH_FLAG]) return;

  const originalGetHeaderControls = prototype._getHeaderControls;
  const originalOnClickAction = prototype._onClickAction;

  if (typeof originalGetHeaderControls !== "function") {
    ModuleLogger.warn("Não foi possível registrar ação de presets: ActorSheetV2 não expõe _getHeaderControls.");
    return;
  }

  prototype._getHeaderControls = function patchedGetHeaderControls(this: ActorSheetLike): HeaderControlEntry[] {
    const controls = originalGetHeaderControls.call(this);

    if (!controls.some((control) => control.action === ACTION_ID)) {
      controls.push(createHeaderControl(this));
    }

    return controls;
  };

  prototype._onClickAction = function patchedOnClickAction(this: ActorSheetLike, event: PointerEvent, target: HTMLElement): void {
    if (target.dataset.action === ACTION_ID) {
      event.preventDefault();
      event.stopPropagation();
      openPresetManager(this, services);
      return;
    }

    originalOnClickAction?.call(this, event, target);
  };

  prototype[PATCH_FLAG] = true;
  ModuleLogger.info("Ação de presets de rituais registrada no menu da ficha de ator.");
}

function createHeaderControl(sheet: ActorSheetLike): HeaderControlEntry {
  return {
    action: ACTION_ID,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: () => canShowPresetAction(sheet)
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

  new RitualPresetManagerApplication(actor, services).render({ force: true });
}

function getSheetActor(sheet: ActorSheetLike): Actor | null {
  if (isActor(sheet.actor)) return sheet.actor;
  if (isActor(sheet.document)) return sheet.document;
  return null;
}

function isActor(value: unknown): value is Actor {
  return Boolean(value && typeof value === "object" && "items" in value && "type" in value);
}
