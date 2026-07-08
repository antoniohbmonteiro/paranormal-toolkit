export type ResistanceDifficultyLabelInput = {
  description: string | null | undefined;
  skillLabel: string | null | undefined;
  difficulty: number | null | undefined;
};

export type ResistanceDifficultyLabelParts = {
  skillLabel: string;
  difficultyLabel: string;
  difficulty: number;
  description: string | null;
};

export function createResistanceDifficultyLabel(input: ResistanceDifficultyLabelInput): string | null {
  const parts = createResistanceDifficultyLabelParts(input);
  if (!parts) return null;

  return [parts.skillLabel, parts.difficultyLabel, parts.description]
    .filter((part): part is string => Boolean(part))
    .join(" · ");
}

export function createResistanceDifficultyLabelParts(
  input: ResistanceDifficultyLabelInput,
): ResistanceDifficultyLabelParts | null {
  const difficulty = normalizeDifficulty(input.difficulty);
  if (difficulty === null) return null;

  const skillLabel = normalizeLabel(input.skillLabel) ?? "Resistência";
  const description = normalizeLabel(input.description);
  const descriptionWithoutSkill = removeLeadingSkillLabel(description, skillLabel);
  const descriptionWithoutDifficulty = removeLeadingDifficultyLabel(descriptionWithoutSkill, difficulty);

  return {
    skillLabel,
    difficulty,
    difficultyLabel: `DT ${difficulty}`,
    description: descriptionWithoutDifficulty,
  };
}

function normalizeDifficulty(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.trunc(value);
}

function normalizeLabel(value: string | null | undefined): string | null {
  const normalized = value?.replace(/\s+/gu, " ").trim();
  if (!normalized) return null;
  return normalized.replace(/[.]$/u, "");
}

function removeLeadingSkillLabel(description: string | null, skillLabel: string): string | null {
  if (!description) return null;

  const normalizedDescription = normalizeForComparison(description);
  const normalizedSkill = normalizeForComparison(skillLabel);

  if (!normalizedDescription.startsWith(normalizedSkill)) return description;

  const remainder = description
    .slice(skillLabel.length)
    .replace(/^\s*[:·,;\-–—]?\s*/u, "")
    .trim();

  return remainder.length > 0 ? remainder : null;
}

function removeLeadingDifficultyLabel(description: string | null, difficulty: number): string | null {
  if (!description) return null;

  const match = /^DT\s*(-?\d+)\b\s*[:·,;\-–—]?\s*/iu.exec(description);
  if (!match) return description;

  const existingDifficulty = Number(match[1]);
  if (!Number.isFinite(existingDifficulty) || existingDifficulty !== difficulty) return description;

  const remainder = description.slice(match[0].length).trim();
  return remainder.length > 0 ? remainder : null;
}

function normalizeForComparison(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLocaleLowerCase();
}
