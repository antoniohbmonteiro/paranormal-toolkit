import type { AttackModifierPreset } from "../attack-modifier-preset";

export const DEATH_SHOT_PRESET: AttackModifierPreset = {
  id: "attack.disparoDaMorte", version: "1.1.0", label: "Disparo da Morte",
  recognitionNames: ["Disparo da Morte"],
  requirements: { weaponType: "armament", ranged: true, rangedSubtypes: ["fire", "shoot"] },
  options: [
    { id: "use", label: "Disparo da Morte",
      description: "Gaste 2 pontos de esforço para receber +2 na margem de ameaça com arma de fogo ou de disparo.",
      contribution: { effortCost: 2, threatBonus: 2 } },
    { id: "affinity", label: "Possui afinidade", requires: ["use"],
      description: "Ignora cobertura leve e até 10 RD. A cobertura é resolvida manualmente pelo jogador ou mestre.",
      contribution: { resistancePenetration: { amount: 10, group: "death-shot", stacking: "highest" } } },
  ],
};
