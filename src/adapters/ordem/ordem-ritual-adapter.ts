import { failure, type Result, success } from "../../core/result";
import type { RitualCircle, RitualReadFailure } from "../../core/rituals/ritual-types";
import { ORDEM_PATHS } from "./ordem-paths";

export type RitualCircleResult = Result<RitualCircle, RitualReadFailure>;

export class OrdemRitualAdapter {
  isRitual(item: Item): boolean {
    return item.type === "ritual";
  }

  getCircle(ritual: Item): RitualCircleResult {
    if (!this.isRitual(ritual)) {
      return failure({
        reason: "not-a-ritual",
        message: `Item ${ritual.name ?? "sem nome"} não é um ritual.`,
        ritual
      });
    }

    const circle = this.readCircleFromKnownPaths(ritual);

    if (!circle) {
      const paths = ORDEM_PATHS.ritualItem.circleCandidates;

      return failure({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${paths.join(", ")}.`,
        ritual,
        paths: [...paths]
      });
    }

    const { path, value } = circle;
    const parsedCircle = parseRitualCircle(value);

    if (!parsedCircle) {
      return failure({
        reason: "invalid-ritual-circle",
        message: `Círculo do ritual inválido em ${path}: ${String(value)}. Esperado 1, 2, 3 ou 4.`,
        ritual,
        path,
        value
      });
    }

    return success(parsedCircle);
  }

  private readCircleFromKnownPaths(ritual: Item): { path: string; value: unknown } | null {
    for (const path of ORDEM_PATHS.ritualItem.circleCandidates) {
      const value = foundry.utils.getProperty(ritual, path);

      if (value !== undefined && value !== null) {
        return { path, value };
      }
    }

    return null;
  }
}

function parseRitualCircle(value: unknown): RitualCircle | null {
  if (isRitualCircle(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim();

    if (!/^\d+$/.test(normalizedValue)) {
      return null;
    }

    const parsedValue = Number(normalizedValue);

    if (isRitualCircle(parsedValue)) {
      return parsedValue;
    }
  }

  return null;
}

function isRitualCircle(value: unknown): value is RitualCircle {
  return value === 1 || value === 2 || value === 3 || value === 4;
}
