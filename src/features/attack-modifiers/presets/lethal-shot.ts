import type { AttackModifierPreset } from "../attack-modifier-preset";

export const LETHAL_SHOT_PRESET: AttackModifierPreset = {
  id: "attack.disparoLetal", version: "1.0.0", label: "Disparo Letal",
  recognitionNames: ["Disparo Letal", "NEX 40% - Disparo Letal"],
  requirements: { weaponType: "armament", ranged: true },
  options: [{ id: "use", label: "Disparo Letal",
    description: "Após realizar Mirar, gaste 1 ponto de esforço para receber +2 na margem de ameaça no próximo ataque até o final do próximo turno. O custo é registrado neste ataque; declare Mirar e confira a duração manualmente.",
    contribution: { effortCost: 1, threatBonus: 2 } }],
};
