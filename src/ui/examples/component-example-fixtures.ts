import type { RitualSingleTargetCardViewModel } from "../components";

export function createRitualSingleTargetFixture(): RitualSingleTargetCardViewModel {
  return {
    header: { image: { src: "icons/svg/lightning.svg", alt: "" }, eyebrow: "Ritual fictício", title: "Eletrocussão Prismática", subtitle: "Mercy", badges: [{ label: "Energia", tone: "accent" }] },
    context: { casterName: "Mercy", targetName: "Malvadão", pills: ["1 PE gasto", "Alvo: 1 Ser(es)", "Duração: instantânea"], resistanceLabel: "Resistência: Fortitude · DT 22 · reduz dano à metade" },
    conjuration: { skillLabel: "Ocultismo", difficulty: 21, selectedFormulaId: "standard", status: "success", options: [
      { id: "standard", label: "Fórmula padrão", formula: "1d20 + 10 + 5", total: 27, status: "success" },
      { id: "focused", label: "Fórmula concentrada", formula: "1d20 + 6", total: 18, status: "failure" },
      { id: "pending", label: "Fórmula pendente", formula: "1d20 + 8", total: null, status: "pending" },
    ] },
    damage: { damageType: "Eletricidade", selectedFormulaId: "base", options: [
      { id: "base", label: "Dano padrão", formula: "3d6", total: 11 },
      { id: "amplified", label: "Dano ampliado", formula: "5d6 + 2", total: 24 },
    ], resistance: { label: "Fortitude", difficulty: 22, consequence: "reduz dano à metade", state: "pending", total: null }, damageApplied: false },
    effect: { name: "Vulnerável", duration: "1 rodada", resistanceState: "pending", resistanceTotal: null },
  };
}

export const ritualSingleTargetPendingFixture = createRitualSingleTargetFixture();
export const ritualSingleTargetResolvedFixture: RitualSingleTargetCardViewModel = {
  ...createRitualSingleTargetFixture(),
  damage: { ...createRitualSingleTargetFixture().damage, resistance: { ...createRitualSingleTargetFixture().damage.resistance, state: "failure", total: 17 } },
  effect: { ...createRitualSingleTargetFixture().effect, resistanceState: "success", resistanceTotal: 25 },
};
