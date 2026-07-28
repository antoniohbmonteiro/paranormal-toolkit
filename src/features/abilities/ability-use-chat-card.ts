import {
  renderAbilityUseCard as renderCurrentAbilityUseCard,
  type AbilityResultSectionViewModel,
  type AbilityUseCardViewModel,
} from "../../ui/components/ability/ability-use-card";
import {
  getAbilityDamageTypeLabel,
  type ResolvedAbilityRoll,
} from "./config/ability-roll-config";

export {
  AbilityUseChatCardService,
  renderPersistedAbilityCard,
} from "./ability-use-chat-card-service";

export type LegacyAbilityUseCardModel = {
  abilityName: string;
  abilityImage: string;
  actorName: string;
  activationLabel: string;
  description: string;
  resource: "PE" | "PD";
  cost: number;
  passive: boolean;
  spentResource: boolean;
  resourceBefore: number;
  resourceAfter: number;
  rolls: ResolvedAbilityRoll[];
};

/** Compatibility facade for the pre-v3 pure renderer tests and consumers. */
export function renderAbilityUseCard(
  model: AbilityUseCardViewModel | LegacyAbilityUseCardModel,
): string {
  return renderCurrentAbilityUseCard(
    "header" in model ? model : convertLegacyCardModel(model),
  );
}

function convertLegacyCardModel(
  model: LegacyAbilityUseCardModel,
): AbilityUseCardViewModel {
  return {
    header: {
      image: { src: model.abilityImage, alt: model.abilityName },
      eyebrow: "Habilidade",
      title: model.abilityName,
      context: model.actorName,
    },
    description: model.description.trim()
      ? { html: model.description }
      : undefined,
    metadata: {
      items: [
        { text: createLegacyCostLabel(model) },
        { text: `Execução: ${model.activationLabel}` },
      ],
    },
    rolls: model.rolls.map(convertLegacyRoll),
    resourceStatus: createLegacyResourceStatus(model),
  };
}

function createLegacyCostLabel(model: LegacyAbilityUseCardModel): string {
  if (model.passive) return "Passiva";
  return model.cost > 0 ? `${model.cost} ${model.resource}` : "Sem custo";
}

function convertLegacyRoll(
  roll: ResolvedAbilityRoll,
): AbilityResultSectionViewModel {
  const details = [createLegacyIntentLabel(roll)];
  if (roll.nexThreshold !== null) details.push(`NEX ${roll.nexThreshold}%`);

  return {
    label: roll.label,
    detail: details.join(" · "),
    tone:
      roll.intent === "damage"
        ? "damage"
        : roll.intent === "healing"
          ? "healing"
          : "effect",
    roll: { formula: roll.formula },
  };
}

function createLegacyIntentLabel(roll: ResolvedAbilityRoll): string {
  if (roll.intent === "healing") return "Cura";
  if (roll.intent === "generic") return "Rolagem genérica";
  return roll.damageType
    ? `Dano · ${getAbilityDamageTypeLabel(roll.damageType)}`
    : "Dano";
}

function createLegacyResourceStatus(
  model: LegacyAbilityUseCardModel,
): AbilityUseCardViewModel["resourceStatus"] {
  if (model.passive || model.cost <= 0) {
    return { text: "Sem gasto de recurso", tone: "neutral" };
  }
  if (!model.spentResource) {
    return {
      text: `${model.cost} ${model.resource} não descontados`,
      tone: "not-spent",
    };
  }
  return {
    text: `${model.cost} ${model.resource} gastos (${model.resourceBefore} → ${model.resourceAfter})`,
    tone: "spent",
  };
}
