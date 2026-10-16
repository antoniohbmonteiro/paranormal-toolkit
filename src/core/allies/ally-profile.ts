export const ALLY_PROFILE_SCHEMA_VERSION = 1;

export type AllyProfile = {
  schemaVersion: 1;
  description: string;
  isDrone: boolean;
};

export function createAllyProfile(): AllyProfile {
  return { schemaVersion: ALLY_PROFILE_SCHEMA_VERSION, description: "", isDrone: false };
}

export function readAllyProfile(value: unknown): AllyProfile | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (
    data.schemaVersion !== ALLY_PROFILE_SCHEMA_VERSION ||
    typeof data.description !== "string" ||
    typeof data.isDrone !== "boolean"
  ) return null;
  return {
    schemaVersion: ALLY_PROFILE_SCHEMA_VERSION,
    description: data.description,
    isDrone: data.isDrone,
  };
}
