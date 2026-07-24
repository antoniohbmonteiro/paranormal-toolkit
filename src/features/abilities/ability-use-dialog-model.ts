import type { AbilityResource } from "./ability-use-options";

export type AbilityUseDialogModelInput = {
  abilityName: string;
  abilityImage: string;
  actorName: string;
  activationLabel: string;
  resource: AbilityResource;
  cost: number;
  currentResource: number;
  passive: boolean;
};

export type AbilityUseDialogModel = {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: string;
    actorName: string;
  };
  cost: {
    resource: AbilityResource;
    amount: number;
    current: number;
    after: number;
    hasCost: boolean;
    canSpend: boolean;
    spendResourceChecked: boolean;
    toggleLabel: string;
    costText: string;
    currentText: string;
    afterText: string;
  };
  passive: boolean;
  primaryActionLabel: string;
};

export function createAbilityUseDialogModel(
  input: AbilityUseDialogModelInput,
): AbilityUseDialogModel {
  const amount = normalizeNonNegativeInteger(input.cost);
  const current = normalizeNonNegativeNumber(input.currentResource);
  const hasCost = amount > 0 && !input.passive;
  const canSpend = current >= amount;

  return {
    header: {
      eyebrow: input.passive ? "Habilidade passiva" : "Usar habilidade",
      title: input.abilityName,
      subtitle: `Execução: ${input.activationLabel}`,
      image: input.abilityImage,
      actorName: input.actorName,
    },
    cost: {
      resource: input.resource,
      amount,
      current,
      after: Math.max(0, current - amount),
      hasCost,
      canSpend,
      spendResourceChecked: hasCost,
      toggleLabel: `Gastar ${amount} ${input.resource} automaticamente`,
      costText: hasCost ? `${amount} ${input.resource}` : "Nenhum",
      currentText: `${current} ${input.resource}`,
      afterText: `${Math.max(0, current - amount)} ${input.resource}`,
    },
    passive: input.passive,
    primaryActionLabel: input.passive ? "Enviar ao chat" : "Usar habilidade",
  };
}

function normalizeNonNegativeInteger(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.trunc(value));
}

function normalizeNonNegativeNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}
