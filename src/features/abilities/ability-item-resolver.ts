import type { AbilityResource, AbilityUseData } from "./ability-use-options";

type AbilitySystemData = {
  activation?: unknown;
  cost?: unknown;
  description?: unknown;
};

export function resolveAbilityUseData(actor: Actor, item: Item): AbilityUseData {
  const system = asAbilitySystemData(item.system);
  const activation = asString(system.activation);
  const passive = isPassiveActivation(activation);
  const resource = resolveAbilityResource();

  return {
    actor,
    item,
    name: item.name ?? "Habilidade sem nome",
    image: resolveItemImage(item),
    activation,
    activationLabel: resolveActivationLabel(activation),
    description: asString(system.description),
    cost: passive ? 0 : normalizeCost(system.cost),
    resource,
    passive,
  };
}

export function resolveAbilityResource(): AbilityResource {
  const usesDeterminationPoints =
    game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === true;

  return usesDeterminationPoints ? "PD" : "PE";
}

export function resolveActivationLabel(activation: string): string {
  if (!activation) return "—";

  const localizationKey = `op.executionChoices.${activation}`;
  const localize = resolveLocalizeFunction();
  const localized = localize?.(localizationKey) ?? localizationKey;
  return localized === localizationKey ? activation : localized;
}

export function isPassiveActivation(activation: string): boolean {
  const normalized = activation.trim().toLocaleLowerCase("pt-BR");
  return (
    normalized === "passive" ||
    normalized === "passiva" ||
    normalized.includes("passiv")
  );
}

function normalizeCost(value: unknown): number {
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) return 0;
  return Math.max(0, Math.trunc(numberValue));
}

function asAbilitySystemData(value: unknown): AbilitySystemData {
  return value && typeof value === "object" ? (value as AbilitySystemData) : {};
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}


function resolveItemImage(item: Item): string {
  const candidate = item as unknown as { img?: unknown };
  return typeof candidate.img === "string" && candidate.img.length > 0
    ? candidate.img
    : "icons/svg/item-bag.svg";
}

function resolveLocalizeFunction(): ((key: string) => string) | null {
  const candidate = game as unknown as {
    i18n?: { localize?: (key: string) => string };
  };
  return typeof candidate.i18n?.localize === "function"
    ? candidate.i18n.localize.bind(candidate.i18n)
    : null;
}
