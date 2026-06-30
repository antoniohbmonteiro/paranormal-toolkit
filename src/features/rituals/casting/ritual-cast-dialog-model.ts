import { MODULE_TITLE } from "../../../constants";
import type { RitualCost } from "../../../core/rituals/ritual-types";
import type { RitualCastVariant, RitualCastVariantOption } from "../ritual-cast-options";

export type RitualCastDialogModelInput = {
  actor: Actor;
  ritual: Item;
  targetNames: string[];
  cost: RitualCost | null;
  defaultSpendResource: boolean;
  variantOptions: RitualCastVariantOption[];
  automationStatus?: "assisted" | "generic";
};

export type RitualCastDialogModel = {
  header: RitualCastDialogHeaderModel;
  forms: RitualCastFormModel[];
  cost: RitualCastCostPanelModel;
  automation: RitualCastAutomationModel;
};

export type RitualCastDialogHeaderModel = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export type RitualCastFormModel = {
  variant: RitualCastVariant;
  label: string;
  enabled: boolean;
  checked: boolean;
  costText: string;
  details: string[];
};

export type RitualCastCostPanelModel = {
  spendResourceChecked: boolean;
  baseCostText: string;
  casterName: string;
  targetText: string;
};

export type RitualCastAutomationModel = {
  status: "assisted" | "generic";
  title: string;
  description: string;
};

export function createRitualCastDialogModel(input: RitualCastDialogModelInput): RitualCastDialogModel {
  return {
    header: {
      eyebrow: MODULE_TITLE,
      title: input.ritual.name ?? "Ritual sem nome",
      subtitle: createRitualSubtitle(input.ritual),
    },
    forms: input.variantOptions.map((option) => createFormModel(option, input.cost)),
    cost: {
      spendResourceChecked: input.defaultSpendResource,
      baseCostText: input.cost ? `${input.cost.amount} ${input.cost.resource}` : "não resolvido",
      casterName: input.actor.name ?? "Ator sem nome",
      targetText: input.targetNames.length > 0 ? input.targetNames.join(", ") : "Nenhum alvo selecionado",
    },
    automation: createAutomationModel(input.automationStatus ?? "assisted"),
  };
}

function createFormModel(option: RitualCastVariantOption, cost: RitualCost | null): RitualCastFormModel {
  const details = createFormDetails(option);

  return {
    variant: option.variant,
    label: option.label,
    enabled: option.enabled,
    checked: option.variant === "base",
    costText: option.enabled ? option.finalCostText ?? createFallbackFinalCostText(cost) : "—",
    details,
  };
}

function createFormDetails(option: RitualCastVariantOption): string[] {
  if (!option.enabled) {
    return [option.unavailableReason ?? "não disponível neste ritual"];
  }

  return option.details
    .map((detail) => detail.trim())
    .filter((detail) => detail.length > 0)
    .filter((detail) => !detail.toLocaleLowerCase().startsWith("custo final"));
}

function createFallbackFinalCostText(cost: RitualCost | null): string {
  return cost ? `${cost.amount} ${cost.resource}` : "custo não resolvido";
}

function createAutomationModel(status: "assisted" | "generic"): RitualCastAutomationModel {
  if (status === "generic") {
    return {
      status,
      title: "Sem automação configurada.",
      description:
        "O Toolkit vai registrar a conjuração e gastar o recurso escolhido. Rolagens, dano, resistência e efeitos continuam manuais.",
    };
  }

  return {
    status,
    title: "Automação assistida disponível.",
    description: "O Toolkit vai preparar custo, rolagens e ações assistidas no card persistente do chat.",
  };
}

function createRitualSubtitle(ritual: Item): string {
  const system = ritual.system as { element?: unknown; circle?: unknown } | undefined;
  const parts = [formatRitualElementLabel(system?.element), formatCircle(system?.circle)].filter(isNonEmptyString);
  return parts.length > 0 ? parts.join(" • ") : "Conjuração de ritual";
}

function formatCircle(value: unknown): string | null {
  const numeric = typeof value === "string" ? Number(value) : value;
  if (typeof numeric !== "number" || !Number.isFinite(numeric)) return null;
  return `${numeric}º Círculo`;
}

function formatRitualElementLabel(value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;

  switch (normalizeRitualElementKey(value)) {
    case "blood":
    case "op.elementchoices.blood":
      return "Sangue";
    case "death":
    case "op.elementchoices.death":
      return "Morte";
    case "knowledge":
    case "op.elementchoices.knowledge":
      return "Conhecimento";
    case "energy":
    case "op.elementchoices.energy":
      return "Energia";
    case "fear":
    case "op.elementchoices.fear":
      return "Medo";
    default:
      return formatUnknownLabel(value);
  }
}

function normalizeRitualElementKey(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "");
}

function formatUnknownLabel(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return `${trimmed.charAt(0).toLocaleUpperCase()}${trimmed.slice(1)}`;
}

function isNonEmptyString(value: string | null): value is string {
  return typeof value === "string" && value.length > 0;
}
