import { describe, expect, it } from "vitest";
import {
  createResistanceDifficultyLabel,
  createResistanceDifficultyLabelParts,
} from "../../../../src/features/item-use/chat-card/item-use-card-resistance-label";

describe("createResistanceDifficultyLabel", () => {
  it("insere a DT entre a perícia e a descrição sem repetir a perícia", () => {
    expect(createResistanceDifficultyLabel({
      skillLabel: "Fortitude",
      difficulty: 24,
      description: "Fortitude reduz dano à metade.",
    })).toBe("Fortitude · DT 24 · reduz dano à metade");
  });

  it("mantém a descrição quando ela não começa com a perícia", () => {
    expect(createResistanceDifficultyLabel({
      skillLabel: "Vontade",
      difficulty: 18,
      description: "anula o efeito.",
    })).toBe("Vontade · DT 18 · anula o efeito");
  });

  it("não duplica a DT quando a descrição já foi enriquecida", () => {
    expect(createResistanceDifficultyLabel({
      skillLabel: "Fortitude",
      difficulty: 23,
      description: "Fortitude · DT 23 · reduz dano à metade",
    })).toBe("Fortitude · DT 23 · reduz dano à metade");
  });

  it("não cria label quando a DT não é confiável", () => {
    expect(createResistanceDifficultyLabel({
      skillLabel: "Reflexos",
      difficulty: null,
      description: "Reflexos evita o efeito.",
    })).toBeNull();
  });
});

describe("createResistanceDifficultyLabelParts", () => {
  it("separa a DT para destaque visual sem pesar o label inteiro", () => {
    expect(createResistanceDifficultyLabelParts({
      skillLabel: "Fortitude",
      difficulty: 23,
      description: "Fortitude reduz dano à metade.",
    })).toEqual({
      skillLabel: "Fortitude",
      difficulty: 23,
      difficultyLabel: "DT 23",
      description: "reduz dano à metade",
    });
  });
});
