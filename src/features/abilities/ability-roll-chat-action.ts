import { MODULE_ID } from "../../constants";
import { ModuleLogger } from "../../core/module-logger";
import { resolveRootElement } from "../item-use/chat-card/item-use-chat-card-dom";
import { getAbilityDamageTypeLabel } from "./config/ability-roll-config";
import {
  ABILITY_ROLL_ACTION_ATTRIBUTE,
  normalizeAbilityUseMessageFlag,
  type AbilityRollMessageAction,
} from "./ability-roll-chat-contract";

const BOUND_DATASET_KEY = "paranormalToolkitAbilityRollBound";
let registered = false;

type FlaggedChatMessage = {
  getFlag?(scope: string, key: string): unknown;
};

type RollLike = {
  evaluate(options?: Record<string, unknown>): Promise<RollLike> | RollLike;
  toMessage(
    data?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<unknown> | unknown;
};

type RollConstructor = new (
  formula: string,
  data?: Record<string, unknown>,
  options?: Record<string, unknown>,
) => RollLike;

export function registerAbilityRollChatActions(): void {
  if (registered) return;
  registered = true;

  const enhance = (message: unknown, html: unknown): void => {
    bindAbilityRollButtons(message, resolveRootElement(html));
  };

  Hooks.on("renderChatMessageHTML", enhance);
  Hooks.on("renderChatMessage", enhance);

  ModuleLogger.info("Ações de rolagem de habilidades registradas no chat.");
}

export function bindAbilityRollButtons(
  message: unknown,
  root: ParentNode | null,
): number {
  if (!root) return 0;

  const selector = `[${ABILITY_ROLL_ACTION_ATTRIBUTE}]`;
  const buttons = collectButtons(root, selector);
  let bound = 0;

  for (const button of buttons) {
    if (button.dataset[BOUND_DATASET_KEY] === "true") continue;

    button.dataset[BOUND_DATASET_KEY] = "true";
    button.addEventListener("click", () => {
      void handleAbilityRollClick(message, button);
    });
    bound += 1;
  }

  return bound;
}

async function handleAbilityRollClick(
  message: unknown,
  button: HTMLButtonElement,
): Promise<void> {
  const rollId = button.getAttribute(ABILITY_ROLL_ACTION_ATTRIBUTE)?.trim();
  if (!rollId) return;

  const flag = readAbilityUseFlag(message);
  const rollAction = flag?.rolls.find((roll) => roll.id === rollId);
  if (!flag || !rollAction) {
    ui.notifications?.warn(
      "Paranormal Toolkit: esta rolagem não está mais disponível no card.",
    );
    return;
  }

  const actor = await resolveActor(flag.actorUuid);
  if (!actor) {
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível localizar o personagem desta habilidade.",
    );
    return;
  }

  if (!canCurrentUserRoll(actor)) {
    ui.notifications?.warn(
      "Paranormal Toolkit: você não possui permissão para fazer esta rolagem.",
    );
    return;
  }

  const rollConstructor = resolveRollConstructor();
  if (!rollConstructor) {
    ui.notifications?.warn(
      "Paranormal Toolkit: a API de rolagem do Foundry não está disponível.",
    );
    return;
  }

  setButtonBusy(button, true);

  try {
    const roll = new rollConstructor(
      rollAction.formula,
      resolveActorRollData(actor),
    );
    const evaluated = await Promise.resolve(roll.evaluate());

    await Promise.resolve(
      evaluated.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: createRollFlavor(flag.abilityName, rollAction),
      }),
    );
  } catch (cause) {
    console.warn(
      "Paranormal Toolkit: não foi possível executar a rolagem da habilidade.",
      cause,
    );
    ui.notifications?.warn(
      `Paranormal Toolkit: não foi possível rolar ${rollAction.label}. Revise a fórmula configurada.`,
    );
  } finally {
    setButtonBusy(button, false);
  }
}

function readAbilityUseFlag(message: unknown) {
  const candidate = message as FlaggedChatMessage | null;
  if (typeof candidate?.getFlag !== "function") return null;

  return normalizeAbilityUseMessageFlag(
    candidate.getFlag(MODULE_ID, "abilityUse"),
  );
}

async function resolveActor(actorUuid: string): Promise<Actor | null> {
  const globalObject = globalThis as typeof globalThis & {
    fromUuid?: (uuid: string) => Promise<unknown>;
  };

  if (typeof globalObject.fromUuid === "function") {
    try {
      const document = await globalObject.fromUuid(actorUuid);
      if (isActor(document)) return document;
    } catch (cause) {
      ModuleLogger.warn(
        `Não foi possível resolver o ator da habilidade por UUID: ${actorUuid}.`,
        cause,
      );
    }
  }

  const actorId = actorUuid.startsWith("Actor.")
    ? actorUuid.slice("Actor.".length)
    : actorUuid;
  const actors = (game as unknown as {
    actors?: { get?: (id: string) => unknown };
  }).actors;
  const actor = actors?.get?.(actorId);
  return isActor(actor) ? actor : null;
}

function resolveRollConstructor(): RollConstructor | null {
  const candidate = (globalThis as typeof globalThis & { Roll?: unknown }).Roll;
  return typeof candidate === "function" ? (candidate as RollConstructor) : null;
}

function resolveActorRollData(actor: Actor): Record<string, unknown> {
  const candidate = actor as unknown as { getRollData?: () => unknown };
  const rollData = candidate.getRollData?.();
  return rollData && typeof rollData === "object"
    ? (rollData as Record<string, unknown>)
    : {};
}

function canCurrentUserRoll(actor: Actor): boolean {
  if (game.user?.isGM) return true;
  return (actor as unknown as { isOwner?: unknown }).isOwner === true;
}

function createRollFlavor(
  abilityName: string,
  roll: AbilityRollMessageAction,
): string {
  const details = [getIntentLabel(roll)];
  if (roll.nexThreshold !== null) details.push(`NEX ${roll.nexThreshold}%`);

  return `
    <div class="paranormal-toolkit-ability-roll-flavor">
      <strong>${escapeHtml(abilityName)}</strong>
      <span>${escapeHtml(roll.label)}</span>
      <small>${escapeHtml(details.join(" · "))}</small>
    </div>
  `;
}

function getIntentLabel(roll: AbilityRollMessageAction): string {
  switch (roll.intent) {
    case "generic":
      return "Rolagem genérica";
    case "healing":
      return "Cura";
    case "damage":
      return roll.damageType
        ? `Dano · ${getAbilityDamageTypeLabel(roll.damageType)}`
        : "Dano";
  }
}


function collectButtons(
  root: ParentNode,
  selector: string,
): HTMLButtonElement[] {
  const buttons: HTMLButtonElement[] = [];

  if (root instanceof HTMLButtonElement && root.matches(selector)) {
    buttons.push(root);
  }

  if ("querySelectorAll" in root) {
    buttons.push(
      ...Array.from(root.querySelectorAll<HTMLButtonElement>(selector)),
    );
  }

  return buttons;
}

function setButtonBusy(button: HTMLButtonElement, busy: boolean): void {
  button.disabled = busy;
  button.classList.toggle(
    "paranormal-toolkit-ability-card__roll--busy",
    busy,
  );

  const icon = button.querySelector<HTMLElement>("i");
  if (!icon) return;

  icon.classList.toggle("fa-dice-d20", !busy);
  icon.classList.toggle("fa-spinner", busy);
  icon.classList.toggle("fa-spin", busy);
}

function isActor(value: unknown): value is Actor {
  return Boolean(
    value &&
      typeof value === "object" &&
      "system" in value &&
      ("uuid" in value || "id" in value),
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
