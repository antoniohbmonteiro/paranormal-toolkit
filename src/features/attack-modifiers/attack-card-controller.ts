import { MODULE_ID } from "../../constants";
import type { NativeAttackOptions, NativeAttackResult } from "../../adapters/ordem/attacks/ordem-attack-adapter";
import { formatAttackCritical, formatAttackDiceSummary, formatBonusWeaponDamage } from "./attack-modifier-composer";
import { ATTACK_CARD_FLAG, ATTACK_DAMAGE_FLAG, ATTACK_EXECUTION_FLAG, type AttackMessage } from "./attack-card-state";
import { AttackModifierWorkflow, type AttackUseContext } from "./attack-modifier-workflow";
import { AttackDamageWorkflow } from "./attack-damage-workflow";
import { AttackAssistedDamageService, isAttackDamageExecutor } from "./attack-assisted-damage-service";
import { renderAttackModifierSummary, type AttackSummaryView } from "../../ui/components/attack/attack-modifier-summary";
import { DEATH_SHOT_PRESET } from "./presets/death-shot";

export class AttackCardController {
  private readonly busy = new Map<string, Promise<unknown>>();
  private readonly roots = new WeakSet<HTMLElement>();
  constructor(private readonly attacks: AttackModifierWorkflow, private readonly damage: AttackDamageWorkflow,
    private readonly assisted: AttackAssistedDamageService,
    private readonly invokeAttack: (item: Item, options: NativeAttackOptions, use: AttackUseContext) => Promise<NativeAttackResult>) {}
  attack(message: AttackMessage, item: Item, options: NativeAttackOptions): Promise<unknown> {
    return this.once(message.id, async () => {
      const use = await this.attacks.begin(message);
      return this.invokeAttack(item, options, use);
    });
  }
  damageCard(message: AttackMessage, item: Item, useId: string, options: NativeAttackOptions): Promise<unknown> {
    return this.once(message.id, () => this.damage.card(message, useId, item, options));
  }
  enhance(message: AttackMessage, root: HTMLElement): void {
    if (!root?.querySelector || !message?.getFlag) return;
    root.querySelector("[data-toolkit-attack-summary]")?.remove();
    const rawBinding = message.getFlag(MODULE_ID, ATTACK_CARD_FLAG);
    const binding = this.attacks.cards.readBinding(message);
    const execution = this.attacks.cards.readExecution(message);
    const damage = this.attacks.cards.readDamage(message);
    let view: AttackSummaryView | null = null;
    if (binding) {
      view = { title: "Ataques deste acionamento", details: [
        binding.executions.filter(entry => entry.state === "published").length + " ataque(s) publicado(s).",
        ...(binding.executions.some(entry => entry.state === "uncertain") ? ["Há uma execução incerta. Confira o chat e os recursos."] : []),
      ] };
      const button = root.querySelector<HTMLButtonElement>('[data-action="damage"]');
      if (button) {
        button.dataset.toolkitAttackUseId = binding.activeUseId;
        button.disabled = true;
        const itemUuid = binding.executions.map(entry => entry.attackMessageId).filter((id): id is string => !!id)
          .map(id => game.messages.get?.(id)).map(entry => entry && this.attacks.cards.readExecution(entry as AttackMessage))
          .find(Boolean)?.snapshot.itemUuid;
        if (itemUuid) void fromUuid(itemUuid).then(async item => {
          await this.damage.resolver.card(message, binding.activeUseId, item as Item);
          if (button.dataset.toolkitAttackUseId === binding.activeUseId && this.attacks.cards.readBinding(message)?.activeUseId === binding.activeUseId) button.disabled = false;
        }).catch(() => undefined);
      }
    } else if (execution) {
      const snapshot = execution.snapshot;
      view = { title: "Configuração do ataque", details: [
        snapshot.modifiers.selected.map(entry => entry.label).join(" · ") || "Ataque normal",
        ...snapshot.modifiers.selected.flatMap(entry => entry.parameters ? ["Ataque Especial: +"
          + entry.parameters.attackBlocks * 5 + " no ataque e +" + entry.parameters.damageBlocks * 5 + " no dano."] : []),
        ...(snapshot.modifiers.attackBonus > 0 ? ["Bônus fixo de ataque: +" + snapshot.modifiers.attackBonus] : []),
        ...(snapshot.modifiers.damageBonus > 0 ? ["Bônus fixo de dano: +" + snapshot.modifiers.damageBonus + " (fora do crítico)."] : []),
        ...(snapshot.modifiers.selected.some(entry => entry.presetId === DEATH_SHOT_PRESET.id && entry.optionIds.includes("affinity"))
          ? ["Disparo da Morte: ignora cobertura leve e até 10 RD. Resolva a cobertura manualmente."] : []),
        ...(snapshot.generalActions.aim ? ["Mirar: ação declarada para este ataque."] : []),
        ...(snapshot.generalActions.burst ? ["Rajada selecionada."] : []),
        ...(snapshot.modifiers.attackDiceContributions.length > 0 ? ["Dados de ataque: " + formatAttackDiceSummary(snapshot.modifiers)] : []),
        ...(snapshot.bonusDamageDie ? ["Dano adicional: " + formatBonusWeaponDamage(snapshot.modifiers, snapshot.bonusDamageDie.faces)] : []),
        "Crítico: " + formatAttackCritical(snapshot.modifiers.critical),
        "Custo adicional: " + snapshot.modifiers.effortCost + " " + snapshot.resource,
        "Alvo: " + (snapshot.target?.name ?? "Sem alvo — aplicação manual"),
        ...(snapshot.modifiers.resistancePenetration ? ["Ignora até " + snapshot.modifiers.resistancePenetration + " RD se acertar, mesmo sem crítico."] : []),
        ...(["executing", "uncertain"].includes(execution.damage.state) ? ["Rolagem em andamento ou incerta. Confira o chat antes de repetir."] : []),
      ], action: { kind: "roll", label: execution.damage.state === "published" ? "Dano já registrado" : "Rolar dano",
        attackMessageId: message.id, disabled: !["available", "failed"].includes(execution.damage.state) } };
    } else if (damage) {
      const manual = !damage.target || damage.mixedTypes || !damage.damageType;
      view = { title: "Dano do ataque", details: [
        "Alvo: " + (damage.target?.name ?? "Sem alvo"),
        "Multiplicador: x" + damage.multiplier + " · Ignora até " + damage.resistancePenetration + " RD ao acertar",
        ...(manual ? ["Aplicação manual: " + (damage.mixedTypes ? "dano de tipos diferentes." : "alvo ou tipo de dano não definido.")] : []),
        ...(damage.application.state === "uncertain" ? ["Aplicação incerta. Confira o alvo antes de repetir."] : []),
        ...(!manual && game.user?.isGM && !isAttackDamageExecutor() ? ["A aplicação está sob controle do Mestre executor conectado."] : []),
      ], ...(!manual && game.user?.isGM ? { action: { kind: "apply" as const,
        label: damage.application.state === "completed" ? "Dano aplicado" : "Aplicar ao alvo original",
        disabled: !isAttackDamageExecutor() || !["available", "failed"].includes(damage.application.state) } } : {}) };
    } else if (rawBinding !== undefined || message.getFlag(MODULE_ID, ATTACK_EXECUTION_FLAG) !== undefined || message.getFlag(MODULE_ID, ATTACK_DAMAGE_FLAG) !== undefined) {
      view = { title: "Automação indisponível", details: ["Estado persistido inválido. Conteúdo original preservado."] };
      const button = root.querySelector<HTMLButtonElement>('[data-action="damage"]');
      if (button) button.disabled = true;
    }
    if (!view) return;
    const host = root.querySelector<HTMLElement>(".message-content") ?? root;
    host.insertAdjacentHTML("beforeend", renderAttackModifierSummary(view));
    if (this.roots.has(root)) return;
    this.roots.add(root);
    root.addEventListener("click", event => {
      const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-toolkit-attack-action]");
      if (!button) return;
      event.preventDefault(); event.stopPropagation(); button.disabled = true;
      void this.once(message.id, async () => {
        if (button.dataset.toolkitAttackAction === "apply") await this.assisted.apply(message);
        else {
          const flag = this.attacks.cards.readExecution(message);
          if (!flag) throw new Error("Execução de ataque inválida.");
          const item = await fromUuid(flag.snapshot.itemUuid) as Item | null;
          if (!item) throw new Error("A arma original não está disponível.");
          await this.damage.execute(item, { attackMessageId: message.id, event: event as unknown as { altKey?: boolean } });
        }
      }).catch(reportAttackFailure).finally(() => this.enhance(message, root));
    });
  }
  private once<T>(id: string, run: () => Promise<T>): Promise<T> {
    const existing = this.busy.get(id);
    if (existing) return existing as Promise<T>;
    const pending = Promise.resolve().then(run);
    this.busy.set(id, pending);
    void pending.finally(() => { if (this.busy.get(id) === pending) this.busy.delete(id); }).catch(() => undefined);
    return pending;
  }
}
export function reportAttackFailure(cause: unknown): void {
  console.warn("Paranormal Toolkit | Ataque", cause);
  ui.notifications?.warn(cause instanceof Error ? cause.message : "Não foi possível concluir a ação do ataque.");
}
