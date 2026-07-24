import { describe, expect, it } from "vitest";
import { createAbilityUseDialogModel } from "../../../../src/features/abilities/ability-use-dialog-model";

describe("createAbilityUseDialogModel", () => {
  it("prepares automatic PE spending by default", () => {
    const model = createAbilityUseDialogModel({
      abilityName: "Ataque Especial",
      abilityImage: "icons/attack.webp",
      actorName: "Agente",
      activationLabel: "Livre",
      resource: "PE",
      cost: 2,
      currentResource: 7,
      passive: false,
    });

    expect(model.header.actorName).toBe("Agente");
    expect(model.cost.hasCost).toBe(true);
    expect(model.cost.canSpend).toBe(true);
    expect(model.cost.spendResourceChecked).toBe(true);
    expect(model.cost.after).toBe(5);
    expect(model.cost.toggleLabel).toBe("Gastar 2 PE automaticamente");
    expect(model.primaryActionLabel).toBe("Usar habilidade");
  });

  it("marks insufficient resource without allowing negative preview", () => {
    const model = createAbilityUseDialogModel({
      abilityName: "Habilidade cara",
      abilityImage: "icons/ability.webp",
      actorName: "Agente",
      activationLabel: "Padrão",
      resource: "PD",
      cost: 3,
      currentResource: 1,
      passive: false,
    });

    expect(model.cost.canSpend).toBe(false);
    expect(model.cost.after).toBe(0);
    expect(model.cost.afterText).toBe("0 PD");
  });

  it("does not offer spending for passive abilities", () => {
    const model = createAbilityUseDialogModel({
      abilityName: "Sentido Tático",
      abilityImage: "icons/passive.webp",
      actorName: "Agente",
      activationLabel: "Passiva",
      resource: "PE",
      cost: 2,
      currentResource: 10,
      passive: true,
    });

    expect(model.passive).toBe(true);
    expect(model.cost.hasCost).toBe(false);
    expect(model.cost.spendResourceChecked).toBe(false);
    expect(model.primaryActionLabel).toBe("Enviar ao chat");
  });

  it("normalizes invalid and negative costs to zero", () => {
    const model = createAbilityUseDialogModel({
      abilityName: "Sem custo",
      abilityImage: "icons/free.webp",
      actorName: "Agente",
      activationLabel: "Livre",
      resource: "PE",
      cost: -4.5,
      currentResource: 3,
      passive: false,
    });

    expect(model.cost.amount).toBe(0);
    expect(model.cost.hasCost).toBe(false);
    expect(model.cost.costText).toBe("Nenhum");
    expect(model.primaryActionLabel).toBe("Usar habilidade");
  });
});
