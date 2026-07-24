import { MODULE_ID } from "../../constants";
import type { ItemUseContext } from "../item-use/item-use-context";
import { getItemUseSystemCardMode } from "../item-use/item-use-settings";
import type { AbilityResource, AbilityUseData } from "./ability-use-options";

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
    });

    const messageData = {
      speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
      content,
      flags: {
        [MODULE_ID]: {
          abilityUse: {
            version: 1,
            actorUuid: ability.actor.uuid,
            itemUuid: ability.item.uuid,
            resource: ability.resource,
            cost: ability.cost,
            spentResource: state.spentResource,
            resourceBefore: state.resourceBefore,
            resourceAfter: state.resourceAfter,
          },
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

  return `
    <article class="paranormal-toolkit-ability-card">
      <header class="paranormal-toolkit-ability-card__header">
        <img src="${escapeAttribute(model.abilityImage)}" alt="">
        <div>
          <span>Habilidade</span>
          <h3>${escapeHtml(model.abilityName)}</h3>
          <p>${escapeHtml(model.actorName)}</p>
        </div>
      </header>

      <div class="paranormal-toolkit-ability-card__meta">
        <span><strong>Execução</strong>${escapeHtml(model.activationLabel)}</span>
        <span><strong>Custo</strong>${escapeHtml(costText)}</span>
      </div>

      ${model.description ? `<section class="paranormal-toolkit-ability-card__description">${model.description}</section>` : ""}

      <footer class="paranormal-toolkit-ability-card__status ${spendClass}">
        <i class="fa-solid ${model.spentResource ? "fa-circle-check" : "fa-circle-info"}"></i>
        <span>${escapeHtml(spendText)}</span>
      </footer>
    </article>
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
  const textEditor = resolveTextEditor();
  if (!textEditor || !ability.description) return ability.description;

  return textEditor.enrichHTML(ability.description, {
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
