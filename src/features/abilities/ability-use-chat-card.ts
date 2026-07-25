import { MODULE_ID } from "../../constants";
import type { ItemUseContext } from "../item-use/item-use-context";
import { getItemUseSystemCardMode } from "../item-use/item-use-settings";
import {
  ABILITY_ROLL_ACTION_ATTRIBUTE,
  type AbilityUseMessageFlag,
} from "./ability-roll-chat-contract";
import type { AbilityResource, AbilityUseData } from "./ability-use-options";
import { renderChatCardHeader } from "../../ui/components/chat/chat-card-header";
import {
  getAbilityDamageTypeLabel,
  type ResolvedAbilityRoll,
} from "./config/ability-roll-config";

type UpdatableChatMessage = {
  update(data: Record<string, unknown>): Promise<unknown>;
};

export type AbilityUseCardModel = {
  abilityName: string;
  abilityImage: string;
  actorName: string;
  activationLabel: string;
  description: string;
  resource: AbilityResource;
  cost: number;
  passive: boolean;
  spentResource: boolean;
  resourceBefore: number;
  resourceAfter: number;
  rolls: ResolvedAbilityRoll[];
};

export type AbilityUseCardState = {
  spentResource: boolean;
  resourceBefore: number;
  resourceAfter: number;
};

export class AbilityUseChatCardService {
  async publish(
    context: ItemUseContext,
    ability: AbilityUseData,
    state: AbilityUseCardState,
  ): Promise<void> {
    const description = await enrichAbilityDescription(ability);

    const content = renderAbilityUseCard({
      abilityName: ability.name,
      abilityImage: ability.image,
      actorName: ability.actor.name ?? "Personagem sem nome",
      activationLabel: ability.activationLabel,
      description,
      resource: ability.resource,
      cost: ability.cost,
      passive: ability.passive,
      spentResource: state.spentResource,
      resourceBefore: state.resourceBefore,
      resourceAfter: state.resourceAfter,
      rolls: ability.rolls,
    });

    const abilityUseFlag: AbilityUseMessageFlag = {
      version: 2,
      actorUuid: ability.actor.uuid ?? ability.actor.id ?? "",
      itemUuid: ability.item.uuid ?? ability.item.id ?? "",
      abilityName: ability.name,
      rolls: ability.rolls,
      resource: ability.resource,
      cost: ability.cost,
      spentResource: state.spentResource,
      resourceBefore: state.resourceBefore,
      resourceAfter: state.resourceAfter,
    };

    const messageData = {
      speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
      content,
      flags: {
        [MODULE_ID]: {
          abilityUse: abilityUseFlag,
        },
      },
    };

    const existingMessage = asUpdatableChatMessage(context.message);
    if (getItemUseSystemCardMode() === "replace" && existingMessage) {
      await existingMessage.update(messageData);
      return;
    }

    await ChatMessage.create(messageData);
  }
}

export function renderAbilityUseCard(model: AbilityUseCardModel): string {
  const costText = model.cost > 0
    ? `${model.cost} ${model.resource}`
    : "Nenhum";
  const spendText = model.cost <= 0 || model.passive
    ? "Sem gasto de recurso"
    : model.spentResource
      ? `${model.cost} ${model.resource} gastos (${model.resourceBefore} → ${model.resourceAfter})`
      : `${model.cost} ${model.resource} não descontados`;
  const spendClass = model.cost <= 0 || model.passive
    ? "paranormal-toolkit-ability-card__status--neutral"
    : model.spentResource
      ? "paranormal-toolkit-ability-card__status--spent"
      : "paranormal-toolkit-ability-card__status--not-spent";
  const rollActions = renderRollActions(model.rolls);
  const description = renderDescription(model.description);

  return `
    <article class="paranormal-toolkit-ability-card">
      ${renderChatCardHeader({
        imageUrl: model.abilityImage,
        imageAlt: model.abilityName,
        eyebrow: "Habilidade",
        title: model.abilityName,
        context: model.actorName,
      })}

      <div class="paranormal-toolkit-ability-card__meta">
        <span><strong>Execução</strong>${escapeHtml(model.activationLabel)}</span>
        <span><strong>Custo</strong>${escapeHtml(costText)}</span>
      </div>

      ${rollActions}
      ${description}

      <footer class="paranormal-toolkit-ability-card__status ${spendClass}">
        <i class="fa-solid ${model.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${escapeHtml(spendText)}</span>
      </footer>
    </article>
  `;
}

function renderRollActions(rolls: ResolvedAbilityRoll[]): string {
  if (rolls.length === 0) return "";

  const buttons = rolls
    .map((roll) => {
      const intentClass = `paranormal-toolkit-ability-card__roll--${roll.intent}`;
      const intentLabel = getRollIntentLabel(roll);
      const threshold =
        roll.nexThreshold === null ? "" : `<span>NEX ${roll.nexThreshold}%</span>`;

      return `
        <button
          type="button"
          class="paranormal-toolkit-ability-card__roll ${intentClass}"
          ${ABILITY_ROLL_ACTION_ATTRIBUTE}="${escapeAttribute(roll.id)}"
          title="${escapeAttribute(roll.formula)}"
        >
          <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
          <span class="paranormal-toolkit-ability-card__roll-label">
            <strong>${escapeHtml(roll.label)}</strong>
            <small>${escapeHtml(intentLabel)}</small>
          </span>
          ${threshold}
        </button>
      `;
    })
    .join("");

  return `
    <section class="paranormal-toolkit-ability-card__rolls">
      <strong class="paranormal-toolkit-ability-card__rolls-title">Rolagens</strong>
      <div class="paranormal-toolkit-ability-card__rolls-list">
        ${buttons}
      </div>
    </section>
  `;
}

function getRollIntentLabel(roll: ResolvedAbilityRoll): string {
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

function renderDescription(description: string): string {
  if (!description.trim()) return "";

  return `
    <details class="paranormal-toolkit-ability-card__description">
      <summary>
        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        <span class="paranormal-toolkit-ability-card__description-show">Ver descrição</span>
        <span class="paranormal-toolkit-ability-card__description-hide">Ocultar descrição</span>
      </summary>
      <div class="paranormal-toolkit-ability-card__description-content">
        ${description}
      </div>
    </details>
  `;
}

function asUpdatableChatMessage(value: unknown): UpdatableChatMessage | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<UpdatableChatMessage>;
  return typeof candidate.update === "function"
    ? (candidate as UpdatableChatMessage)
    : null;
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

type FoundryTextEditor = {
  enrichHTML(
    content: string,
    options?: { relativeTo?: Item; rollData?: Record<string, unknown> },
  ): Promise<string>;
};

async function enrichAbilityDescription(
  ability: AbilityUseData,
): Promise<string> {
  const description = ability.chatDescription || ability.description;
  const textEditor = resolveTextEditor();
  if (!textEditor || !description) return description;

  return textEditor.enrichHTML(description, {
    relativeTo: ability.item,
    rollData: resolveActorRollData(ability.actor),
  });
}

function resolveTextEditor(): FoundryTextEditor | null {
  const candidate = foundry as unknown as {
    applications?: {
      ux?: {
        TextEditor?: { implementation?: Partial<FoundryTextEditor> };
      };
    };
  };
  const implementation = candidate.applications?.ux?.TextEditor?.implementation;
  return typeof implementation?.enrichHTML === "function"
    ? (implementation as FoundryTextEditor)
    : null;
}

function resolveActorRollData(actor: Actor): Record<string, unknown> {
  const candidate = actor as unknown as {
    getRollData?: () => unknown;
  };
  const rollData = candidate.getRollData?.();
  return rollData && typeof rollData === "object"
    ? (rollData as Record<string, unknown>)
    : {};
}
