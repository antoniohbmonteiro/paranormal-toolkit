import type { AttackModifierPreset } from "../attack-modifier-preset";

export const INTUITIVE_SHOT_PRESET: AttackModifierPreset = {
  id: "attack.tiroIntuitivo",
  version: "1.0.0",
  label: "Tiro Intuitivo",
  recognitionNames: ["Tiro Intuitivo"],
  requirements: { ranged: true, weaponType: "armament" },
  options: [
    { id: "use", label: "Usar Tiro Intuitivo — sem Mirar",
      description: "Declaro que este ataque será realizado sem usar a ação Mirar. +2 na margem de ameaça.",
      contribution: { threatBonus: 2 } },
    { id: "empower", label: "Gastar 2 pontos de esforço",
      description: "+1 no multiplicador de crítico. Se acertar, o dano ignora até 10 RD, mesmo sem acerto crítico.",
      requires: ["use"], contribution: { effortCost: 2, multiplierBonus: 1,
        resistancePenetration: { amount: 10, group: "intuitive-shot", stacking: "highest" } } },
  ],
};
