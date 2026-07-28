import type {
  AbilityResultSectionViewModel,
  AbilityUseCardViewModel,
} from "../../ui/components/ability/ability-use-card";
import type { AbilityUseCardState } from "./ability-use-card-state";
import { getToolkitDamageTypePresentation } from "../../core/damage/damage-types";

export function buildAbilityUseCardViewModel(
  state: AbilityUseCardState,
): AbilityUseCardViewModel {
  return {
    header: createHeader(state),
    description: state.ability.descriptionHtml
      ? { html: state.ability.descriptionHtml }
      : undefined,
    metadata: { items: createMetadata(state) },
    rolls: state.rolls.map(createRollSection),
  };
}

function createHeader(
  state: AbilityUseCardState,
): AbilityUseCardViewModel["header"] {
  return {
    image: state.ability.image
      ? { src: state.ability.image, alt: state.ability.name }
      : undefined,
    eyebrow: "Habilidade",
    title: state.ability.name,
    context: state.actor.name,
  };
}

function createMetadata(
  state: AbilityUseCardState,
): AbilityUseCardViewModel["metadata"]["items"] {
  return [
    { text: createCostLabel(state) },
    { text: `Execução: ${state.ability.activationLabel}` },
  ];
}

function createCostLabel(state: AbilityUseCardState): string {
  if (state.resource.passive) return "Passiva";
  if (state.resource.cost <= 0) return "Sem custo";
  const cost = `${state.resource.cost} ${state.resource.type}`;
  return state.resource.spent ? cost : `${cost} não descontados`;
}

function createRollSection(
  roll: AbilityUseCardState["rolls"][number],
): AbilityResultSectionViewModel {
  return {
    label: roll.label.trim() || "Rolagem",
    detail: createRollDetail(roll),
    damageTypeBadge:
      roll.intent === "damage" && roll.damageType
        ? getToolkitDamageTypePresentation(roll.damageType)
        : undefined,
    tone:
      roll.intent === "damage"
        ? "damage"
        : roll.intent === "healing"
          ? "healing"
          : "effect",
    roll: {
      formula: roll.formula,
      total: roll.total,
      diceResults: roll.diceResults,
    },
  };
}

function createRollDetail(
  roll: AbilityUseCardState["rolls"][number],
): string {
  const details = [createIntentLabel(roll)];
  if (roll.nexThreshold !== null) details.push(`NEX ${roll.nexThreshold}%`);
  return details.join(" · ");
}

function createIntentLabel(
  roll: AbilityUseCardState["rolls"][number],
): string {
  if (roll.intent === "healing") return "Cura";
  if (roll.intent === "generic") return "Rolagem genérica";
  return "Dano";
}
