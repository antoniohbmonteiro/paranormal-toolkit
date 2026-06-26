import { failure, type Result, success } from "../result";
import type { AutomationPreset, AutomationPresetMatcher } from "./automation-preset";

export type AutomationRegistryFailureReason = "duplicate-preset" | "preset-not-found" | "invalid-preset";

export type AutomationRegistryFailure = {
  reason: AutomationRegistryFailureReason;
  message: string;
  presetId?: string;
};

export type AutomationPresetMatch = {
  preset: AutomationPreset;
  score: number;
  reasons: string[];
};

export class AutomationRegistry {
  private readonly presets = new Map<string, AutomationPreset>();

  register(preset: AutomationPreset): Result<AutomationPreset, AutomationRegistryFailure> {
    const validation = validatePreset(preset);

    if (!validation.ok) {
      return validation;
    }

    if (this.presets.has(preset.id)) {
      return failure({
        reason: "duplicate-preset",
        message: `Preset de automação duplicado: ${preset.id}.`,
        presetId: preset.id
      });
    }

    this.presets.set(preset.id, clonePreset(preset));
    return success(preset);
  }

  registerMany(presets: AutomationPreset[]): Result<AutomationPreset[], AutomationRegistryFailure> {
    const registered: AutomationPreset[] = [];

    for (const preset of presets) {
      const result = this.register(preset);

      if (!result.ok) {
        return result;
      }

      registered.push(result.value);
    }

    return success(registered);
  }

  get(presetId: string): AutomationPreset | null {
    const preset = this.presets.get(presetId);
    return preset ? clonePreset(preset) : null;
  }

  require(presetId: string): Result<AutomationPreset, AutomationRegistryFailure> {
    const preset = this.get(presetId);

    if (!preset) {
      return failure({
        reason: "preset-not-found",
        message: `Preset de automação não encontrado: ${presetId}.`,
        presetId
      });
    }

    return success(preset);
  }

  list(): AutomationPreset[] {
    return Array.from(this.presets.values()).map(clonePreset);
  }

  findForItem(item: Item): AutomationPresetMatch[] {
    return this.list()
      .map((preset) => matchPresetForItem(preset, item))
      .filter((match): match is AutomationPresetMatch => match !== null)
      .sort((left, right) => right.score - left.score || left.preset.id.localeCompare(right.preset.id));
  }
}

function validatePreset(preset: AutomationPreset): Result<AutomationPreset, AutomationRegistryFailure> {
  if (!isNonEmptyString(preset.id) || !isNonEmptyString(preset.version) || !isNonEmptyString(preset.label)) {
    return failure({
      reason: "invalid-preset",
      message: "Preset de automação precisa de id, version e label válidos.",
      presetId: preset.id
    });
  }

  if (!preset.automation || preset.automation.version !== 1 || !Array.isArray(preset.automation.steps)) {
    return failure({
      reason: "invalid-preset",
      message: `Preset ${preset.id} possui definição de automação inválida.`,
      presetId: preset.id
    });
  }

  return success(preset);
}

function matchPresetForItem(preset: AutomationPreset, item: Item): AutomationPresetMatch | null {
  if (preset.matchers.length === 0) {
    return null;
  }

  const reasons: string[] = [];
  let score = 0;

  if (preset.itemTypes.length > 0) {
    if (!preset.itemTypes.includes(item.type)) return null;
    score += 10;
    reasons.push(`itemType:${item.type}`);
  }

  for (const matcher of preset.matchers) {
    const result = matchMatcher(matcher, item);

    if (!result.matches) {
      return null;
    }

    score += result.score;
    reasons.push(result.reason);
  }

  return {
    preset,
    score,
    reasons
  };
}

function matchMatcher(matcher: AutomationPresetMatcher, item: Item): { matches: boolean; score: number; reason: string } {
  switch (matcher.type) {
    case "itemType": {
      const matches = matcher.itemTypes.includes(item.type);
      return {
        matches,
        score: matches ? 10 : 0,
        reason: `itemType:${item.type}`
      };
    }
    case "normalizedName": {
      const normalizedItemName = normalizeAutomationName(item.name);
      const matches = matcher.names.map(normalizeAutomationName).includes(normalizedItemName);
      return {
        matches,
        score: matches ? 100 : 0,
        reason: `normalizedName:${normalizedItemName}`
      };
    }
    case "ritualCircle": {
      const circle = readRitualCircleValue(item);
      const matches = circle !== null && matcher.circles.includes(circle);
      return {
        matches,
        score: matches ? 20 : 0,
        reason: `ritualCircle:${circle ?? "unknown"}`
      };
    }
  }
}

export function normalizeAutomationName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function readRitualCircleValue(item: Item): 1 | 2 | 3 | 4 | null {
  const value = foundry.utils.getProperty(item, "system.circle");
  const numeric = typeof value === "string" ? Number(value) : value;

  if (numeric === 1 || numeric === 2 || numeric === 3 || numeric === 4) {
    return numeric;
  }

  return null;
}

function clonePreset(preset: AutomationPreset): AutomationPreset {
  return structuredClone(preset);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
