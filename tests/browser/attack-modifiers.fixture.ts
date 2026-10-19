import { INTUITIVE_SHOT_PRESET } from "../../src/features/attack-modifiers/presets/intuitive-shot";
import { SPECIAL_ATTACK_PRESET } from "../../src/features/attack-modifiers/presets/special-attack";
import { DEATH_SHOT_PRESET } from "../../src/features/attack-modifiers/presets/death-shot";
import { LETHAL_SHOT_PRESET } from "../../src/features/attack-modifiers/presets/lethal-shot";
import type { AttackModifierDialogInput } from "../../src/features/attack-modifiers/attack-modifier-dialog-model";
import type { AttackModifierContribution, AvailableAttackModifier } from "../../src/features/attack-modifiers/attack-modifier-preset";

const preview = document.querySelector<HTMLElement>("#preview")!, result = document.querySelector<HTMLElement>("#result")!;
class PreviewApplication {
  element: HTMLElement;
  constructor(public options: any) {
    this.element = document.createElement("section");
    this.element.className = "application paranormal-toolkit paranormal-toolkit-ritual-cast-app paranormal-toolkit-ability-use-app paranormal-toolkit-attack-modifier-app";
    this.element.innerHTML = '<header class="window-header"><span>⚔ Configurar ataque</span><button data-action="cancel" aria-label="Fechar">×</button></header><div class="window-content"></div>';
    this.element.addEventListener("click", event => {
      const action = (event.target as Element).closest<HTMLElement>("[data-action]")?.dataset.action;
      const handler = (this.constructor as any).DEFAULT_OPTIONS.actions[action ?? ""];
      if (handler) void handler.call(this, event);
    });
    preview.append(this.element);
  }
  async render() {
    const self = this as any;
    self._replaceHTML(await self._renderHTML({}, {}), this.element.querySelector(".window-content"), {});
  }
  async close() { this.element.remove(); return this; }
}
Object.assign(globalThis, {
  foundry: { applications: { api: { ApplicationV2: PreviewApplication } }, utils: { randomID: () => crypto.randomUUID() } },
  game: { modules: new Map(), user: { id: "player" }, packs: new Map() },
  ui: { notifications: { info: (text: string) => { result.textContent = text; }, warn: (text: string) => { result.textContent = text; } } },
});
const { AttackModifierApplication } = await import("../../src/applications/attack-modifier-application");
const input: AttackModifierDialogInput = {
  weaponName: "Fuzil de assalto", weaponImage: "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#79695c"/><path d="M10 32h39v7H10zm27-10h17v4H37zM25 39h8v14h-8z" fill="#eee6d9"/></svg>'),
  actorName: "Rafa Nakamura", targetName: null, baseCritical: { margin: 19, multiplier: 3 }, resource: "PE" as const, currentResource: 12,
  available: [INTUITIVE_SHOT_PRESET, SPECIAL_ATTACK_PRESET, DEATH_SHOT_PRESET, LETHAL_SHOT_PRESET].map(preset => ({
    preset, abilityUuid: "Actor.rafa.Item." + preset.id, abilityName: preset.label })),
  facts: { weaponType: "armament", ranged: true, firearm: true, automatic: true, rangedSubtype: "fire" },
  progression: { mode: "nex", value: 55 }, burstDamage: { faces: 10, type: "ballisticDamage" },
};
const fixtureModifier = (id: string, label: string, contribution: AttackModifierContribution): AvailableAttackModifier => ({
  abilityUuid: "Actor.rafa.Item." + id, abilityName: label,
  preset: { id, label, version: "1", requirements: {}, options: [{ id: "use", label, description: "Habilidade fictícia para conferir a soma dos modificadores.", contribution }] },
});
const combined = [fixtureModifier("fixture.bonus", "Teste: +2d20", { attackDiceModifier: 2, bonusWeaponDamageDice: 2 }),
  fixtureModifier("fixture.penalty", "Teste: −1d20", { attackDiceModifier: -1, bonusWeaponDamageDice: 1 })];
const open = async (overrides: Partial<AttackModifierDialogInput> = {}) => {
  preview.replaceChildren();
  const application = new AttackModifierApplication({ ...input, ...overrides }, value => { result.textContent = JSON.stringify(value); });
  await application.render({ force: true });
  return application;
};
document.querySelector("#open")!.addEventListener("click", () => void open());
document.querySelector("#without")!.addEventListener("click", () => void open({ available: [] }));
document.querySelector("#combined")!.addEventListener("click", () => void open({ available: combined }));
document.querySelector("#melee")!.addEventListener("click", () => void open({ available: [], facts: { ...input.facts, ranged: false } }));
document.querySelector("#many")!.addEventListener("click", () => void open({ available: [...input.available, ...Array.from({ length: 16 }, (_, index) => ({
  ...input.available[0], preset: { ...structuredClone(INTUITIVE_SHOT_PRESET), id: "fixture." + index, label: "Habilidade de teste " + (index + 1) },
}))] }));
document.querySelector("#check")!.addEventListener("click", async () => {
  result.textContent = "";
  try {
    await open();
    const check = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
    const inputAt = (id: string) => preview.querySelector<HTMLInputElement>('[data-preset-id="attack.tiroIntuitivo"][data-option-id="' + id + '"]')!;
    const actionAt = (id: string) => preview.querySelector<HTMLInputElement>('[data-general-action="' + id + '"]')!;
    const change = async (element: HTMLInputElement) => { element.focus(); element.click(); await new Promise(resolve => requestAnimationFrame(resolve)); };
    check(!inputAt("use").checked && !inputAt("empower") && !actionAt("aim").checked && !actionAt("burst").checked, "Estado inicial incorreto");
    check(!preview.textContent?.includes("RD ignorada") && !preview.textContent?.includes("Custo adicional"), "Blocos vazios visíveis");
    inputAt("use").click(); await new Promise(resolve => requestAnimationFrame(resolve));
    check(!inputAt("empower").disabled && preview.textContent?.includes("17/x3"), "Opção principal incorreta");
    inputAt("empower").click(); await new Promise(resolve => requestAnimationFrame(resolve));
    check(preview.textContent?.includes("17/x4") && preview.textContent.includes("10 PE"), "Resumo pago incorreto");
    await change(actionAt("aim"));
    check(!inputAt("use").checked && !inputAt("empower") && !preview.textContent?.includes("Custo adicional"), "Mirar não limpou a habilidade");
    check(document.activeElement === actionAt("aim"), "Foco perdido após atualização");
    await change(inputAt("use")); check(!actionAt("aim").checked, "Habilidade não limpou Mirar");
    await change(inputAt("empower")); await change(inputAt("use")); await change(inputAt("use"));
    check(!inputAt("empower").checked && !preview.textContent?.includes("Custo adicional"), "Dependência oculta permaneceu ativa");
    await change(actionAt("burst"));
    const summary = preview.querySelector("dl")?.textContent;
    check(summary?.includes("Dados de ataque−1d20") && summary.includes("Dano adicional+1d10"), "Cards de Rajada ausentes");
    preview.querySelector<HTMLButtonElement>('[data-action="attack"]')!.click();
    check(result.textContent?.includes('"burst":true'), "Confirmação não retornou as escolhas");
    await open(); preview.querySelector<HTMLButtonElement>('[data-action="cancel"]')!.click();
    check(result.textContent === "null", "Cancelamento não retornou null");
    await open({ available: combined });
    const presetAt = (id: string) => preview.querySelector<HTMLInputElement>('[data-preset-id="' + id + '"]')!;
    await change(presetAt("fixture.bonus")); await change(presetAt("fixture.penalty"));
    check(preview.querySelector("dl")?.textContent?.includes("Dados de ataque−1d20 + 2d20 = +1d20Dano adicional+1d10 + 2d10 = +3d10"), "Modificadores não foram consolidados");
    await change(actionAt("burst"));
    check(preview.querySelector("dl")?.textContent?.includes("Dados de ataque−1d20 − 1d20 + 2d20 = 0d20")
      && preview.querySelector("dl")?.textContent?.includes("Dano adicional+1d10 + 1d10 + 2d10 = +4d10"), "Cancelamento de dados incorreto");
    await open();
    const stageAt = (preset: string, option = "use") => preview.querySelector<HTMLInputElement>('[data-preset-id="' + preset + '"][data-option-id="' + option + '"]')!;
    const step = async (field: string, delta: number) => {
      const button = preview.querySelector<HTMLButtonElement>('button[data-special-field="' + field + '"][data-delta="' + delta + '"]')!;
      button.focus(); button.click(); await new Promise(resolve => requestAnimationFrame(resolve));
    };
    const confirm = () => preview.querySelector<HTMLButtonElement>('[data-action="attack"]')!;
    check(stageAt(LETHAL_SHOT_PRESET.id).disabled, "Disparo Letal deve exigir Mirar");
    await change(stageAt(SPECIAL_ATTACK_PRESET.id));
    check(confirm().disabled && !preview.textContent?.includes("Custo adicional"), "Zero blocos deve impedir confirmação sem custo");
    await step("attackBlocks", 1);
    check(document.activeElement?.getAttribute("data-control-id") === "special:attackBlocks:1", "Foco do incremento perdido");
    await step("damageBlocks", 1); await step("damageBlocks", 1);
    check(!confirm().disabled && preview.textContent?.includes("4 PE") && preview.textContent.includes("+10 (fora do crítico)"), "Distribuição e custo incorretos");
    check(preview.querySelector<HTMLButtonElement>('[data-special-field="attackBlocks"][data-delta="1"]')!.disabled, "Limite não bloqueou incremento");
    check(document.activeElement?.getAttribute("data-control-id") === "special:damageBlocks:-1", "Foco não preservado no limite");
    await change(stageAt(DEATH_SHOT_PRESET.id));
    check(!stageAt(DEATH_SHOT_PRESET.id, "affinity").checked && preview.textContent?.includes("6 PE"), "Afinidade inicial ou custo incorreto");
    await change(stageAt(DEATH_SHOT_PRESET.id, "affinity"));
    await change(actionAt("aim")); await change(stageAt(LETHAL_SHOT_PRESET.id));
    check(preview.textContent?.includes("15/x3") && preview.textContent.includes("7 PE"), "Composição com Mirar incorreta");
    await change(actionAt("aim"));
    check(!stageAt(LETHAL_SHOT_PRESET.id).checked && preview.textContent?.includes("6 PE"), "Disparo Letal não limpou custo");
    await change(inputAt("use")); await change(inputAt("empower"));
    check(preview.textContent?.includes("Até 20 RD") && preview.textContent.includes("8 PE"), "Penetração conjunta incorreta");
    await change(stageAt(SPECIAL_ATTACK_PRESET.id)); await change(stageAt(SPECIAL_ATTACK_PRESET.id));
    check(confirm().disabled && preview.querySelector("output")?.textContent === "+0", "Distribuição antiga reapareceu");
    result.textContent = "Etapas 1 e 2 aprovadas: ações gerais, custo, foco, limite, bônus fixos, afinidade, Mirar/Letal, 20 RD, persistência da seleção e cancelamento.";
    await open();
  } catch (error) { result.textContent = "FALHA: " + String(error); }
});
await open();
