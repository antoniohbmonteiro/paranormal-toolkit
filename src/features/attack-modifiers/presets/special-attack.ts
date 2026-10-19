import type { AttackModifierContribution, AttackModifierPreset, AttackProgression, SpecialAttackConfiguration } from "../attack-modifier-preset";

export const SPECIAL_ATTACK_PRESET: AttackModifierPreset = {
  id: "attack.ataqueEspecial", version: "1.0.0", label: "Ataque Especial",
  recognitionNames: ["Ataque Especial"], requirements: { weaponType: "armament" },
  options: [{ id: "use", label: "Ataque Especial",
    description: "Distribua blocos de +5 entre ataque e dano, respeitando sua progressão. O bônus fixo de dano não multiplica no crítico.",
    contribution: {} }],
};

const SPECIAL_ATTACK_LIMITS = [
  { nex: 5, level: 1, blocks: 1 }, { nex: 25, level: 5, blocks: 2 },
  { nex: 55, level: 11, blocks: 3 }, { nex: 85, level: 17, blocks: 4 },
] as const;

export function specialAttackMaxBlocks(progression: AttackProgression | null | undefined): number | null {
  if (!progression || !["nex", "level"].includes(progression.mode) || !Number.isSafeInteger(progression.value)
    || progression.value < (progression.mode === "nex" ? 0 : 1) || progression.mode === "nex" && progression.value > 99) return null;
  return SPECIAL_ATTACK_LIMITS.reduce((limit, step) => progression.value >= step[progression.mode] ? step.blocks : limit, 0);
}

export function resolveSpecialAttack(configuration: SpecialAttackConfiguration | undefined,
  progression: AttackProgression | null | undefined): AttackModifierContribution {
  const limit = specialAttackMaxBlocks(progression);
  if (limit === null) throw new Error("Progressão indisponível para Ataque Especial. Confira o NEX ou nível da ficha.");
  if (!configuration || ![configuration.attackBlocks, configuration.damageBlocks]
    .every(value => Number.isSafeInteger(value) && value >= 0 && value <= 4)) {
    throw new Error("Distribuição de Ataque Especial inválida.");
  }
  const count = configuration.attackBlocks + configuration.damageBlocks;
  if (count > limit) throw new Error("Ataque Especial excede o limite da sua progressão.");
  if (count === 0) throw new Error(limit === 0 ? "Ataque Especial exige NEX de pelo menos 5% para distribuir bônus."
    : "Distribua ao menos um bloco de +5 ou desmarque Ataque Especial.");
  return { attackBonus: configuration.attackBlocks * 5, damageBonus: configuration.damageBlocks * 5, effortCost: count + 1 };
}
