import type { RitualSingleTargetCardViewModel, RitualPreviewState } from "../components";
import { createRitualSingleTargetFixture } from "./component-example-fixtures";

export class RitualPreviewController {
  private model = createRitualSingleTargetFixture();
  snapshot(): RitualSingleTargetCardViewModel { return structuredClone(this.model); }
  selectConjurationFormula(id: string): void {
    const option = this.model.conjuration.options.find((candidate) => candidate.id === id); if (!option) return;
    this.model.conjuration = { ...this.model.conjuration, selectedFormulaId: id, status: option.status ?? "pending" };
  }
  selectDamageFormula(id: string): void { if (this.model.damage.options.some((option) => option.id === id)) this.model.damage = { ...this.model.damage, selectedFormulaId: id }; }
  resolveResistance(state: Exclude<RitualPreviewState, "pending"> = "success"): void { this.model.damage = { ...this.model.damage, resistance: { ...this.model.damage.resistance, state, total: state === "success" ? 25 : 17 } }; }
  applyDamage(): void { if (this.model.damage.resistance.state !== "pending") this.model.damage = { ...this.model.damage, damageApplied: true }; }
  resolveEffectResistance(state: Exclude<RitualPreviewState, "pending"> = "success"): void { this.model.effect = { ...this.model.effect, resistanceState: state, resistanceTotal: state === "success" ? 24 : 14 }; }
  setScenario(scenario: string): void {
    this.model = createRitualSingleTargetFixture();
    if (scenario === "casting-pending") this.selectConjurationFormula("pending");
    if (scenario === "casting-failure") this.selectConjurationFormula("focused");
    if (scenario === "resistance-success") this.resolveResistance("success");
    if (scenario === "resistance-failure") this.resolveResistance("failure");
    if (scenario === "effect-resolved") this.resolveEffectResistance("success");
  }
}
