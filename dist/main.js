const c = "paranormal-toolkit", ln = "Paranormal Toolkit", ki = "ordemparanormal";
class Pe {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function st(e) {
  return {
    id: e.id,
    version: e.version,
    label: e.label,
    description: e.description,
    category: e.category,
    itemTypes: [...e.itemTypes],
    matchers: e.matchers.map((t) => ({ ...t })),
    hasItemPatch: e.itemPatch !== void 0
  };
}
class d {
  static info(t, ...n) {
    console.log(`${c} | ${t}`, ...n);
  }
  static warn(t, ...n) {
    console.warn(`${c} | ${t}`, ...n);
  }
  static error(t, ...n) {
    console.error(`${c} | ${t}`, ...n);
  }
}
function y(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function cn(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : un(t) ? y(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Ei(e) {
  return un(e.getFlag(c, "automation"));
}
function un(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Si(t.source) && Ii(t.definition);
}
function Ii(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && $(t.label) && Array.isArray(t.steps) && t.steps.every(Di) && (t.conditionApplications === void 0 || Fi(t.conditionApplications));
}
function Si(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? $(t.presetId) && $(t.presetVersion) && $(t.appliedAt) : t.type === "manual" ? $(t.label) && $(t.appliedAt) : !1;
}
function Di(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Li(t);
    case "spendRitualCost":
      return Pi(t);
    case "rollFormula":
      return vi(t);
    case "modifyResource":
      return Ni(t);
    case "chatCard":
      return Oi(t);
    default:
      return !1;
  }
}
function Li(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ao(t);
}
function Pi(e) {
  return e.type === "spendRitualCost";
}
function vi(e) {
  const t = e;
  return t.type === "rollFormula" && $(t.id) && $(t.formula) && (t.intent === void 0 || zi(t.intent)) && (t.damageType === void 0 || $(t.damageType));
}
function Ni(e) {
  const t = e;
  return t.type === "modifyResource" && _o(t.actor) && Ui(t.resource) && qi(t.operation) && Ao(t) && (t.damageType === void 0 || t.damageType === null || $(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Oi(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Fi(e) {
  return Array.isArray(e) && e.every(xi);
}
function xi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return $(t.id) && _o(t.actor) && $(t.conditionId) && (t.label === void 0 || $(t.label)) && (t.duration === void 0 || t.duration === null || Mi(t.duration)) && (t.source === void 0 || $(t.source)) && (t.actionSectionId === void 0 || $(t.actionSectionId)) && (t.actionSectionTitle === void 0 || $(t.actionSectionTitle)) && (t.executedLabel === void 0 || $(t.executedLabel));
}
function Mi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || ji(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Bi(t.expiry));
}
function Bi(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Ao(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || $(e.amountFrom);
}
function _o(e) {
  return e === "self" || e === "target";
}
function Ui(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function qi(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function zi(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function ji(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function $(e) {
  return typeof e == "string" && e.length > 0;
}
function dn(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Un);
    if (Gi(t))
      return Array.from(t).filter(Un);
  }
  return [];
}
function Hi(e) {
  return dn(e)[0] ?? null;
}
function Vi(e) {
  return dn(e).find(Ei) ?? null;
}
function Gi(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Un(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ve(e) {
  return dn(e).filter((t) => t.type === "ritual");
}
function To(e) {
  return ve(e)[0] ?? null;
}
function Wi(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(st);
      return d.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Re("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Me(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(jn);
      return d.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Re("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Me(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await qt(e, r, o.value);
      d.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Re("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Me(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        d.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await qt(e, n, r.preset);
      d.info(`Melhor preset aplicado em ${n.name}.`, { match: jn(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return qn(e);
    },
    async applyBestPresetsToActorRituals() {
      return qn(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Re("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Me(t);
      n && (await e.automationBinder.clear(n), d.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function qn(e) {
  const t = Re("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = ve(t);
  if (n.length === 0)
    return d.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), zn(t);
  const r = zn(t, n.length);
  for (const o of n) {
    const a = e.automationRegistry.findForItem(o)[0];
    if (!a) {
      r.skipped.push({
        itemId: o.id ?? null,
        itemName: o.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await qt(e, o, a.preset);
    r.applied.push(Ki(o, a, s));
  }
  return d.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Yi(r), r;
}
async function qt(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Ki(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: st(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function zn(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Yi(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function jn(e) {
  return {
    preset: st(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Re(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Me(e) {
  const t = To(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ee(e) {
  return e ? {
    id: e.id,
    source: {
      ...Qi(e.sourceActor),
      token: e.sourceToken
    },
    item: Zi(e.item),
    targets: e.targets.map(Xi),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Hn(e.rollRequests, Ro),
    rolls: Hn(e.rolls, Ji),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(mn),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function mn(e) {
  return {
    actorId: e.actorId,
    actorName: e.actorName,
    resource: e.resource,
    operation: e.operation,
    requestedAmount: e.requestedAmount,
    appliedAmount: e.appliedAmount,
    before: {
      value: e.before.value,
      max: e.before.max
    },
    after: {
      value: e.after.value,
      max: e.after.max
    }
  };
}
function Qi(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Zi(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Xi(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Ro(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Ji(e) {
  return {
    ...Ro(e),
    total: e.total
  };
}
function Hn(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function es(e) {
  return {
    getSelected() {
      return Pe.getSelectedActor();
    },
    logResources() {
      const t = W(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      d.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && d.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await re(
        e,
        "Gasto de PE",
        W("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await re(
        e,
        "Gasto de PD",
        W("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await re(
        e,
        "Dano em PV",
        W("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await re(
        e,
        "Cura de PV",
        W("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await re(
        e,
        "Dano em SAN",
        W("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await re(
        e,
        "Recuperação de SAN",
        W("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function re(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    ts(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    d.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  d.info(`${t} realizado:`, mn(a));
}
function W(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ts(e) {
  if (e.reason === "update-failed") {
    d.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    d.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  d.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const O = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function ns() {
  Be(O.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Be(O.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Be(O.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Be(O.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function zt() {
  return {
    enabled: Ue(O.enabled),
    console: Ue(O.console),
    ui: Ue(O.ui),
    chat: Ue(O.chat)
  };
}
async function z(e, t) {
  await game.settings.set(c, O[e], t);
}
function Be(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Ue(e) {
  return game.settings.get(c, e) === !0;
}
function rs() {
  return {
    status() {
      return zt();
    },
    async enable() {
      await z("enabled", !0);
    },
    async disable() {
      await z("enabled", !1);
    },
    async enableConsole() {
      await z("console", !0);
    },
    async disableConsole() {
      await z("console", !1);
    },
    async enableUi() {
      await z("ui", !0);
    },
    async disableUi() {
      await z("ui", !1);
    },
    async enableChat() {
      await z("chat", !0);
    },
    async disableChat() {
      await z("chat", !1);
    }
  };
}
const $o = "ritual.costOnly", wo = "ritual.simpleHealing", os = "ritual.eletrocussao", Co = "ritual.simpleDamage", ko = "generic.simpleHealing", Eo = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function as() {
  return [
    is(),
    ss(),
    ls(),
    cs(),
    us()
  ];
}
function is() {
  return {
    id: $o,
    version: "1.0.0",
    label: "Gasto de custo de ritual",
    description: "Calcula o custo do ritual pelo círculo e gasta o recurso configurado.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: {
      version: 1,
      label: "Gasto de custo de ritual",
      ritualForms: {
        base: {
          label: "Padrão"
        }
      },
      steps: [
        {
          type: "spendRitualCost"
        },
        {
          type: "chatCard",
          title: "Gasto de custo de ritual",
          message: "Calcula o custo do ritual pelo círculo e gasta o recurso configurado."
        }
      ]
    }
  };
}
function ss() {
  return {
    id: wo,
    version: "1.0.0",
    label: "Cicatrização",
    description: "Gasta o custo do ritual, rola 2d8+2 de cura e recupera PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["cicatrizacao"]
      }
    ],
    automation: Io(),
    itemPatch: ms()
  };
}
function ls() {
  return {
    id: os,
    version: "1.4.1",
    label: "Eletrocussão",
    description: "Preset inicial de dano de eletricidade. Gasta o custo do ritual, rola 3d6/6d6/8d6 conforme a forma escolhida e prepara ações assistidas para aplicar dano via adapter do sistema e Vulnerável por 1 rodada no alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["eletrocussao", "eletrocucao"]
      }
    ],
    automation: ds(),
    itemPatch: fs()
  };
}
function cs() {
  return {
    id: Co,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: fn()
  };
}
function us() {
  return {
    id: ko,
    version: "1.0.0",
    label: "Cura simples de teste",
    description: "Gasta 1 PE, rola 1d8 e cura PV do alvo.",
    category: "generic",
    itemTypes: [],
    matchers: [],
    automation: {
      version: 1,
      label: "Cura simples de teste",
      steps: [
        {
          type: "spendResource",
          actor: "self",
          resource: "PE",
          amount: 1
        },
        {
          type: "rollFormula",
          id: "healing",
          formula: "1d8",
          intent: "healing"
        },
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: "healing.total"
        },
        {
          type: "chatCard",
          title: "Cura simples de teste",
          message: "Gasta 1 PE, rola 1d8 e cura PV do alvo."
        }
      ]
    }
  };
}
function Io(e = "2d8+2") {
  return So(
    {
      version: 1,
      label: "Cicatrização",
      ritualForms: {
        base: {
          label: "Padrão",
          rollFormulaOverrides: {
            healing: e
          }
        }
      },
      steps: [
        {
          type: "spendRitualCost"
        },
        {
          type: "rollFormula",
          id: "healing",
          formula: "1d8",
          intent: "healing"
        },
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: "healing.total"
        },
        {
          type: "chatCard",
          title: "Cicatrização",
          message: "Gasta o custo do ritual, rola a fórmula de cura e recupera PV do alvo."
        }
      ]
    },
    "healing",
    e
  );
}
function ds() {
  return {
    ...fn("3d6", {
      label: "Eletrocussão",
      title: "Eletrocussão",
      damageType: "electric",
      message: "Gasta o custo do ritual, rola dano de eletricidade e prepara aplicação de dano em PV do alvo pelo adapter do sistema. Resistência deve ser resolvida manualmente por enquanto."
    }),
    resistance: {
      skill: "resilience",
      label: "Fortitude",
      effect: "reducesByHalf",
      summary: "Fortitude reduz dano à metade.",
      damageApplications: [
        {
          id: "normal",
          label: "Dano normal",
          multiplier: 1
        },
        {
          id: "half",
          label: "Metade",
          multiplier: 0.5,
          rounding: "floor",
          summary: "Use se o alvo resistiu."
        }
      ]
    },
    conditionApplications: [
      {
        id: "eletrocussao-vulnerable",
        actor: "target",
        conditionId: "vulnerable",
        label: "Vulnerável",
        duration: {
          rounds: 1
        },
        source: "ritual.eletrocussao",
        actionSectionId: "apply-effects",
        actionSectionTitle: "Aplicar efeito",
        executedLabel: "✓ Vulnerável aplicado"
      }
    ],
    ritualForms: {
      base: {
        label: "Padrão",
        rollFormulaOverrides: {
          damage: "3d6"
        }
      },
      discente: {
        label: "Discente",
        extraCost: 2,
        rollFormulaOverrides: {
          damage: "6d6"
        }
      },
      verdadeiro: {
        label: "Verdadeiro",
        extraCost: 5,
        rollFormulaOverrides: {
          damage: "8d6"
        },
        notes: [
          "Se o alvo falhar na Fortitude, aplique Atordoado por 1 rodada manualmente."
        ]
      }
    }
  };
}
function fn(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return So(
    {
      version: 1,
      label: n,
      ritualForms: {
        base: {
          label: "Padrão",
          rollFormulaOverrides: {
            damage: e
          }
        }
      },
      steps: [
        {
          type: "spendRitualCost"
        },
        {
          type: "rollFormula",
          id: "damage",
          formula: "1d8",
          intent: "damage",
          damageType: o
        },
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: "damage.total"
        },
        {
          type: "chatCard",
          title: r,
          message: a
        }
      ]
    },
    "damage",
    e
  );
}
function ms() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Eo,
    ritual: {
      circle: 1,
      element: "death",
      execution: "default",
      range: "touch",
      target: "creatures",
      targetQuantity: "1",
      duration: "instantaneous",
      resistanceSkill: "",
      resistance: "",
      studentForm: !1,
      trueForm: !1
    }
  };
}
function fs() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Eo,
    ritual: {
      circle: 1,
      element: "energy",
      execution: "default",
      range: "medium",
      target: "creatures",
      targetQuantity: "1",
      duration: "instantaneous",
      resistanceSkill: "resilience",
      resistance: "reducesByHalf",
      studentForm: !0,
      trueForm: !0
    }
  };
}
function So(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function pn() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ae(t.id),
    actorId: ae(t.actor?.id),
    sceneId: ae(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Do() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: ae(e.id),
    actorId: ae(t?.id),
    sceneId: ae(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ae(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ps(e) {
  return {
    logFirstRitualCost() {
      const t = K("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = Y(t);
      if (!n) return;
      const r = e.ritualCosts.getCost({ actor: t, ritual: n });
      if (!r.ok) {
        d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      d.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: n.name,
        cost: r.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${n.name} custa ${r.value.amount} ${r.value.resource} (${r.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, n = "PE") {
      const r = K("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = Y(r);
      if (o) {
        if (!ys(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(c, "ritual.cost", {
          resource: n,
          amount: t
        }), d.info(`Custo customizado aplicado em ${o.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = K("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = Y(t);
      n && (await n.unsetFlag(c, "ritual.cost"), d.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = K("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = Y(t);
      if (!n) return;
      const r = e.automationRegistry.require($o);
      if (!r.ok) {
        d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), d.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = K("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = Y(n);
      if (!r) return;
      if (!Vn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(wo);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Io(t)
      }), d.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = K("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = Y(n);
      if (!r) return;
      if (!Vn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Co);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: fn(t)
      }), d.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = K("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = Y(t);
      n && await gs(e, t, n);
    }
  };
}
async function gs(e, t, n) {
  const r = cn(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Do(),
    item: n,
    targets: pn()
  });
  if (!o.ok) {
    hs(o.error);
    return;
  }
  d.info("Automação de ritual executada com sucesso.", ee(o.value.context));
}
function hs(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    d.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    d.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  d.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function K(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Y(e) {
  const t = To(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ys(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Vn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const bs = ["disabled", "ask", "automatic"], As = ["buttons", "confirm"], Lo = "ask";
function _s(e) {
  return typeof e == "string" && bs.includes(e);
}
function Ts(e) {
  return typeof e == "string" && As.includes(e);
}
function Rs(e) {
  return _s(e) ? e : Ts(e) ? "ask" : Lo;
}
const $s = ["keep", "replace"], ws = ["manual", "assisted"], Po = "keep", vo = "assisted", Cs = !0, I = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function ks() {
  game.settings.register(c, I.executionMode, {
    name: "Modo de automação ao usar item",
    hint: "Controla como o Paranormal Toolkit reage quando um item com automação é usado pela ficha.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      disabled: "Desativado",
      ask: "Perguntar no chat",
      automatic: "Automático"
    },
    default: Lo
  }), game.settings.register(c, I.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Po
  }), game.settings.register(c, I.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: vo
  }), game.settings.register(c, I.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Cs
  }), game.settings.register(c, I.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Gn() {
  const e = Rs(game.settings.get(c, I.executionMode)), t = Oo(game.settings.get(c, I.systemCardMode)), n = Fo(game.settings.get(c, I.damageResolutionMode));
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: No()
  };
}
function Es() {
  return Oo(game.settings.get(c, I.systemCardMode));
}
function Is() {
  return Fo(game.settings.get(c, I.damageResolutionMode));
}
function No() {
  return game.settings.get(c, I.ritualCastingCheckEnabled) === !0;
}
async function Q(e) {
  await game.settings.set(c, I.executionMode, e);
}
function Oo(e) {
  return $s.includes(e) ? e : Po;
}
function Fo(e) {
  return ws.includes(e) ? e : vo;
}
function Ss(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await Q("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await Q("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await Q(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await Q("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await Q("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await Q("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await Q("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Ds = [
  "created",
  "beforeItemUse",
  "resolveTargets",
  "beforeCost",
  "spendCost",
  "afterCost",
  "beforeRoll",
  "beforeDamageRoll",
  "beforeHealingRoll",
  "roll",
  "damageRoll",
  "healingRoll",
  "afterDamageRoll",
  "afterHealingRoll",
  "afterRoll",
  "beforeDamageResolution",
  "damageResolution",
  "afterDamageResolution",
  "beforeApply",
  "beforeApplyDamage",
  "beforeApplyHealing",
  "apply",
  "applyDamage",
  "applyHealing",
  "afterApplyDamage",
  "afterApplyHealing",
  "afterApply",
  "beforeChat",
  "chat",
  "completed",
  "failed"
];
function Ls(e) {
  return {
    phases() {
      return Ds;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Rt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Vi(t);
      if (!n) {
        d.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Wn(e, t, n);
    },
    async runSelectedItemAutomation() {
      await this.runFirstAutomation();
    },
    async runItemAutomationByUuid(t) {
      if (!t || typeof t != "string") {
        ui.notifications?.warn("Paranormal Toolkit: UUID inválido.");
        return;
      }
      const n = await fromUuid(t);
      if (!Ns(n)) {
        d.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = vs(n) ?? Rt("Nenhum ator encontrado para executar automação do item.");
      r && await Wn(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Rt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Hi(t);
      if (!n) {
        d.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(ko);
        if (!r.ok) {
          d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(n, r.value), d.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (r) {
        d.error("Falha ao configurar automação de teste no item.", r), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function Wn(e, t, n) {
  const r = cn(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Do(),
    item: n,
    targets: pn()
  });
  if (!o.ok) {
    Ps(o.error);
    return;
  }
  d.info("Automação executada com sucesso.", ee(o.value.context));
}
function Ps(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    d.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    d.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  d.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Rt(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function vs(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Ns(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Os(e) {
  const t = es(e), n = Wi(e), r = ps(e), o = Ls(e), a = rs(), s = Ss(e);
  return {
    actor: t,
    automation: n,
    ritual: r,
    workflow: o,
    output: a,
    itemUseIntegration: s,
    getSelectedActor() {
      return t.getSelected();
    },
    logSelectedActorResources() {
      t.logResources();
    },
    async spendSelectedActorPE(l) {
      await t.spendPE(l);
    }
  };
}
function Fs(e) {
  return {
    list: () => e.listConditions(),
    get: (t) => {
      const n = e.getCondition(t);
      return n.ok ? n.value : null;
    },
    applyToActor: (t, n, r = {}) => e.applyCondition({
      actor: t,
      conditionId: n,
      duration: r.duration,
      originUuid: r.originUuid,
      source: r.source ?? "api.applyToActor",
      refreshExisting: r.refreshExisting
    }),
    removeFromActor: (t, n) => e.removeCondition({
      actor: t,
      conditionId: n
    }),
    applyToSelectedTokens: async (t, n = {}) => {
      const r = Kn();
      if (r.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const o = await Promise.all(
        r.map(
          (a) => e.applyCondition({
            actor: a,
            conditionId: t,
            duration: n.duration,
            originUuid: n.originUuid,
            source: n.source ?? "api.applyToSelectedTokens",
            refreshExisting: n.refreshExisting
          })
        )
      );
      return xs(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Kn();
      if (n.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para remover a condição."), [];
      const r = await Promise.all(
        n.map(
          (o) => e.removeCondition({
            actor: o,
            conditionId: t
          })
        )
      );
      return Ms(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Kn() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function xs(e) {
  let t = 0;
  for (const n of e) {
    if (n.ok) {
      t += 1, n.value.warning && ui.notifications?.warn(`Paranormal Toolkit: ${n.value.warning}`);
      continue;
    }
    ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
  }
  t > 0 && ui.notifications?.info(`Paranormal Toolkit: condição aplicada em ${t} ator(es).`);
}
function Ms(e) {
  let t = 0;
  for (const n of e) {
    if (n.ok) {
      t += n.value.removed;
      continue;
    }
    ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
  }
  ui.notifications?.info(`Paranormal Toolkit: ${t} efeito(s) removido(s).`);
}
function Bs(e) {
  const t = {
    services: e,
    ordem: e.ordem,
    resources: e.resources,
    damage: e.damage,
    ritualCosts: e.ritualCosts,
    automation: e.automation,
    automationRegistry: e.automationRegistry,
    automationBinder: e.automationBinder,
    workflow: e.workflow,
    itemUseIntegration: e.itemUseIntegration,
    conditions: Fs(e.conditions),
    debug: Os(e)
  }, n = globalThis;
  return n[c] = t, n.ParanormalToolkit = t, t;
}
class Yn {
  static isSupportedSystem() {
    return game.system.id === ki;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Us() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ie(t.id),
    actorId: ie(t.actor?.id),
    sceneId: ie(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function xo() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: ie(e.id),
    actorId: ie(t?.id),
    sceneId: ie(e.scene?.id),
    name: n
  };
}
function qs(e, t = xo()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function zs(e) {
  if (!Vs(e)) return null;
  const t = e.getFlag(c, "workflow");
  return Hs(t) ? t : null;
}
function js() {
  return `flags.${c}.workflow`;
}
function Qn(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), n = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || n !== void 0;
}
function Zn(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return jt(t) || jt(n);
}
function Hs(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Vs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ie(e) {
  return jt(e) ? e : null;
}
function jt(e) {
  return typeof e == "string" && e.length > 0;
}
function Gs() {
  const e = (t, n) => {
    Ws(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Ws(e, t) {
  const n = zs(e);
  if (!n || n.targets.length === 0) return;
  const r = Ys(t);
  if (!r || r.querySelector(`.${c}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Ks(n));
}
function Ks(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Xn("Origem", e.source.name)), t.append(Xn("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Xn(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${c}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function Ys(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Qs() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!Zs(r) || !Xs(e) || Qn(e) || Qn(t)) return;
    const o = Us();
    if (o.length === 0 || !Zn(e) && !Zn(t)) return;
    const a = xo();
    e.updateSource({
      [js()]: qs(o, a)
    }), d.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Zs(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Xs(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let Jn = !1, $t = !1, wt = !1, qe = null;
const Js = 1e3, el = 750, tl = 1e3;
function nl(e) {
  Jn || (Hooks.on("combatTurnChange", (t) => {
    ol(e, er(t));
  }), Hooks.on("deleteCombat", (t) => {
    al(e, er(t));
  }), Jn = !0, rl(e));
}
function rl(e) {
  lt() && ($t || ($t = !0, globalThis.setTimeout(() => {
    $t = !1, gn(e, "ready");
  }, Js)));
}
function ol(e, t) {
  lt() && t && (qe && globalThis.clearTimeout(qe), qe = globalThis.setTimeout(() => {
    qe = null, gn(e, "combat-turn-change", t);
  }, el));
}
function al(e, t) {
  lt() && t && (wt || (wt = !0, globalThis.setTimeout(() => {
    wt = !1, gn(e, "combat-deleted", t);
  }, tl)));
}
async function gn(e, t, n) {
  if (lt())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && d.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const o of r.failures)
        d.warn(o.message);
    } catch (r) {
      d.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function lt() {
  return game.user?.isGM === !0;
}
function er(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Mo = {
  enabled: "dice.animations.enabled"
};
function il() {
  game.settings.register(c, Mo.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function sl() {
  return {
    enabled: game.settings.get(c, Mo.enabled) === !0
  };
}
const Bo = "chatCard", tr = "data-paranormal-toolkit-prompt-id", i = `${c}-item-use-prompt`, ll = `.${i}__title`, Uo = `.${i}__header`, cl = `.${i}__roll-card`, ul = `.${i}__roll-meta`, dl = `.${i}__roll-meta-pill`, hn = `.${i}__resistance`, ml = `.${i}__resistance-header`, qo = `.${i}__resistance-description`, yn = `.${i}__resistance-roll-button`, zo = `.${i}__resistance-roll-result`, nr = `${i}__resistance-content`, jo = `.${i}__workflow-section`, Ho = `.${i}__workflow-roll`, Vo = `${i}__workflow-roll--dice-open`, Go = `.${i}__workflow-roll-formula`, Wo = `${i}__workflow-roll-formula--toggle`, bn = `.${i}__workflow-dice-tray`, fl = `.${i}__roll-detail-toggle`, pl = `.${i}__roll-detail-list`, gl = `.${i}__ritual-element-badge`, hl = `.${i}__ritual-metadata`, yl = "casting-backlash", bl = "data-paranormal-toolkit-action-section", Al = "data-paranormal-toolkit-prompt-id", _l = "data-paranormal-toolkit-pending-id", rr = "data-paranormal-toolkit-casting-backlash-enhanced", or = `.${i}`, Tl = `.${i}__workflow-section--casting`, Rl = `.${i}__workflow-section-header`, $l = `.${i}__workflow-notes`, wl = `[${bl}="${yl}"]`, ar = `${i}__workflow-section-title-row`, Cl = `${i}__workflow-section-header--casting-backlash`, Ko = `${i}__casting-backlash-button`;
function kl(e) {
  for (const t of El(e))
    Il(t), vl(t);
}
function El(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(or) && t.add(e);
  for (const n of e.querySelectorAll(or))
    t.add(n);
  return Array.from(t);
}
function Il(e) {
  const t = e.querySelector(wl);
  if (!t) return;
  const n = Sl(t);
  if (!n) return;
  const r = e.querySelector(`${Tl} ${Rl}`);
  r && (r.classList.add(Cl), Dl(r), Ll(n), r.append(n), t.remove());
}
function Sl(e) {
  return e.querySelector(
    `button[${_l}], button[${Al}]`
  );
}
function Dl(e) {
  const t = e.querySelector(`:scope > .${ar}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(ar);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(Ko) || n.append(o));
  return n;
}
function Ll(e) {
  if (e.getAttribute(rr) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Pl(t, e.disabled);
  e.classList.add(Ko), e.setAttribute(rr, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Pl(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function vl(e) {
  for (const t of e.querySelectorAll($l)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Nl(e) {
  for (const t of Array.from(e.querySelectorAll(jo)))
    for (const n of Array.from(t.querySelectorAll(`${fl}, ${pl}`)))
      n.remove();
}
const $e = "data-paranormal-toolkit-prompt-id", Ol = "data-paranormal-toolkit-resistance-roll-result", Fl = "Conjuração DT";
function Yo(e) {
  const t = e.querySelector(yn)?.getAttribute(Ol), n = Ie(t);
  if (n !== null) return n;
  const r = e.querySelector(zo)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Ie(o?.[1] ?? null);
}
function Qo(e) {
  const t = ql(e), n = Ml(t);
  if (n !== null) return n;
  const r = Bl(t);
  return r !== null ? r : Ul(e);
}
function xl(e) {
  const t = e.getAttribute($e);
  if (!t) return null;
  const n = Xo(e), r = Jo(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => ct(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function x(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Zo(e) {
  return x(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Ml(e) {
  const t = jl(e);
  return t.length === 0 ? null : Ie(Hl(t, Fl));
}
function Bl(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : ir(r, ["system", "ritual", "DT"]) ?? ir(r, ["system", "ritual", "dt"]);
}
function Ul(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Ie(n?.[1] ?? null);
}
function ql(e) {
  const t = zl(e);
  if (!t) return null;
  const n = Xo(e), r = Jo(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => ct(a) ? a.pendingId === t : !1) ?? null;
}
function zl(e) {
  return (e.closest(`[${$e}]`) ?? e.querySelector(`[${$e}]`) ?? e.parentElement?.querySelector(`[${$e}]`) ?? null)?.getAttribute($e) ?? null;
}
function Xo(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return Vl(o) ? o : null;
}
function Jo(e) {
  const t = e?.getFlag?.(c, Bo);
  return ct(t) ? t : null;
}
function jl(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Hl(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function ir(e, t) {
  let n = e;
  for (const r of t) {
    if (!ct(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Ie(typeof n == "string" ? n : null);
}
function Ie(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Vl(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function ct(e) {
  return !!(e && typeof e == "object");
}
const ea = `.${i}__actions`, ut = `.${i}__actions-title`, An = `.${i}__button`, Gl = "data-paranormal-toolkit-action-section", Wl = `${i}__button--executed`, Kl = "data-paranormal-toolkit-executed-label";
function ta(e) {
  return x(e.querySelector(ut)?.textContent);
}
function na(e, t) {
  const n = e.querySelector(ut);
  n && (n.textContent = t);
}
function Yl(e, t) {
  const n = x(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const o = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return x(o) === n;
  }) ?? null;
}
function _n(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Ne(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const Ql = "data-paranormal-toolkit-damage-resolution-state", sr = "data-paranormal-toolkit-damage-icon-enhanced", Zl = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function Xl(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), na(t, "Aplicar dano"), Jl(e, t);
}
function Jl(e, t) {
  const n = Array.from(t.querySelectorAll(An)), r = lr(n, "normal"), o = lr(n, "half");
  if (!r || !o) {
    t.classList.add(`${i}__actions--compact`);
    return;
  }
  cr(r, "normal"), cr(o, "half");
  const a = ec();
  if (t.classList.toggle(`${i}__actions--assisted`, a === "assisted"), t.classList.toggle(`${i}__actions--manual`, a !== "assisted"), a !== "assisted") {
    j(r, !0), j(o, !0), ze(t, "manual", null);
    return;
  }
  const s = Yo(e), l = Qo(e);
  if (l === null) {
    j(r, !0), j(o, !0), ze(t, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (s === null) {
    j(r, !0), j(o, !1), ze(t, "pending", null);
    return;
  }
  const u = s >= l;
  j(r, !u), j(o, u), ze(
    t,
    u ? "resisted" : "failed",
    u ? `Resistiu: ${s} vs DT ${l}.` : `Falhou: ${s} vs DT ${l}.`
  );
}
function lr(e, t) {
  const n = Zl[t];
  return e.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function cr(e, t) {
  if (e.getAttribute(sr) === "true") return;
  const n = e.textContent?.trim() ?? "";
  if (!n || n.startsWith("✓")) return;
  const r = document.createElement("i");
  r.classList.add(
    "fa-solid",
    t === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), r.setAttribute("aria-hidden", "true"), e.classList.add(
    `${i}__button--damage-resolution-action`,
    `${i}__button--damage-resolution-${t}`
  ), e.setAttribute(sr, "true"), e.setAttribute("aria-label", n), e.replaceChildren(r, Ne(n));
}
function j(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function ze(e, t, n) {
  e.setAttribute(Ql, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${i}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(ut)?.after(o);
}
function ec() {
  try {
    return Is();
  } catch {
    return "assisted";
  }
}
const Se = "data-paranormal-toolkit-effect-icon-enhanced", de = "data-paranormal-toolkit-effect-action-compacted", dt = "data-paranormal-toolkit-effect-resistance-gate", tc = `${i}__workflow-section--effect-action`;
function ra(e) {
  const t = e.querySelector(ut), n = x(t?.textContent);
  if (n !== "aplicar efeito" && n !== "efeito") return !1;
  e.classList.add(
    `${i}__actions--effect-resolution`,
    `${i}__workflow-section`,
    tc
  ), na(e, "Efeito");
  const r = e.querySelector(An);
  if (!r) return !0;
  const o = r.textContent?.trim() ?? "";
  if (!o) return !0;
  const a = oa(r, o);
  return a && rc(e, t, a), aa(r, o) ? (sa(r), !0) : (oc(r, o) || ia(r, a ?? o), !0);
}
function nc(e, t) {
  const n = t.querySelector(An);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (aa(n, r)) {
    sa(n);
    return;
  }
  const o = ac(t, n, r);
  if (!ic(e, o)) {
    la(n);
    return;
  }
  const a = Qo(e), s = Yo(e);
  if (a === null || s === null) {
    sc(n);
    return;
  }
  if (s >= a) {
    lc(n);
    return;
  }
  cc(n, o);
}
function rc(e, t, n) {
  if (e.querySelector(`.${i}__effect-resolution-label`)) return;
  const r = document.createElement("span");
  r.classList.add(`${i}__effect-resolution-label`), r.textContent = uc(n), t?.after(r);
}
function oa(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && x(n) !== "efeito aplicado") return n;
  const r = xl(e);
  if (r) return r;
  const o = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && x(o) !== "aplicado" ? o : null;
}
function aa(e, t) {
  return e.classList.contains(Wl) || x(t).includes("aplicado");
}
function oc(e, t) {
  const n = e.getAttribute(dt);
  if (n === "pending" || n === "resisted") return !0;
  const r = Zo(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function ia(e, t) {
  e.getAttribute(de) === "true" && e.getAttribute(Se) === "true" || (e.classList.add(`${i}__button--effect-resolution-action`), e.setAttribute(de, "true"), e.setAttribute(Se, "true"), e.setAttribute(Kl, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    _n("✦", `${i}__button-icon--effect`),
    Ne("Aplicar")
  ));
}
function sa(e) {
  e.getAttribute(de) === "true" && x(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.setAttribute(de, "true"), e.setAttribute(Se, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    _n("✓", `${i}__button-icon--effect-applied`),
    Ne("Aplicado")
  ));
}
function ac(e, t, n) {
  const r = e.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return r || (oa(t, n) ?? n);
}
function ic(e, t) {
  if (!e.querySelector(hn)) return !1;
  const n = Zo(t);
  return n.includes("vulneravel") || n.includes("vulnerable");
}
function sc(e) {
  e.disabled = !0, e.removeAttribute(de), e.removeAttribute(Se), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-waiting`), e.setAttribute(dt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Ne("Role resistência"));
}
function lc(e) {
  e.disabled = !0, e.removeAttribute(de), e.removeAttribute(Se), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-resisted`), e.setAttribute(dt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    _n("✓", `${i}__button-icon--effect-resisted`),
    Ne("Resistiu")
  );
}
function cc(e, t) {
  la(e), e.disabled = !1, ia(e, t);
}
function la(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(dt);
}
function uc(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const Ze = "data-paranormal-toolkit-prompt-id", dc = "data-paranormal-toolkit-card-layout-normalized", ur = "data-paranormal-toolkit-card-layout-refresh-bound", mc = "apply-damage", fc = [0, 80, 180, 400, 900, 1600];
function pc(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    ua(ca(t));
  Tc(e);
}
function ca(e) {
  return {
    rollCard: e,
    damageSection: Yl(e, "Dano"),
    resistance: e.querySelector(hn),
    damageActions: gc(e),
    effectActions: hc(e)
  };
}
function ua(e) {
  const { rollCard: t, damageSection: n, resistance: r, damageActions: o, effectActions: a } = e;
  t.setAttribute(dc, "true"), t.classList.add(`${i}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), Xl(t, o)), a && (ra(a), Ac(t, n, a), nc(t, a)), Rc(t);
}
function gc(e) {
  return Ht(e).find((t) => t.getAttribute(Gl) === mc) ?? Ht(e).find((t) => ta(t) === "aplicar danos") ?? null;
}
function hc(e) {
  return Ht(e).find((t) => {
    const n = ta(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function Ht(e) {
  const t = e.closest(`.${i}`) ?? e.parentElement;
  if (!t) return [];
  const n = bc(e), r = Array.from(t.querySelectorAll(ea));
  return n ? r.filter((o) => yc(o, n)) : r;
}
function yc(e, t) {
  return Array.from(e.querySelectorAll(`[${Ze}]`)).some((n) => n.getAttribute(Ze) === t);
}
function bc(e) {
  return e.querySelector(`[${Ze}]`)?.getAttribute(Ze) ?? null;
}
function Ac(e, t, n) {
  if (n.parentElement === e && _c(n, t)) return;
  const r = t?.nextElementSibling ?? null;
  e.insertBefore(n, r);
}
function _c(e, t) {
  return t ? e.previousElementSibling === t : e.parentElement?.firstElementChild === e;
}
function Tc(e) {
  for (const t of Array.from(e.querySelectorAll(ea)))
    t.closest(`.${i}__roll-card`) || ra(t);
}
function Rc(e) {
  const t = e.querySelector(yn);
  t && t.getAttribute(ur) !== "true" && (t.setAttribute(ur, "true"), t.addEventListener("click", () => {
    for (const n of fc)
      globalThis.setTimeout(() => {
        ua(ca(e));
      }, n);
  }));
}
const $c = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function wc(e) {
  for (const t of Array.from(e.querySelectorAll(hn)))
    Cc(t);
  pc(e);
}
function Cc(e) {
  const t = e.querySelector(ml), n = e.querySelector(qo), r = e.querySelector(yn), o = e.querySelector(zo);
  if (!r || !t && !n && !o) return;
  const a = kc(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && (o.parentElement !== e && !r.contains(o) && e.append(o), Ec(o)), r.parentElement !== e && e.append(r);
}
function kc(e, t) {
  const n = e.querySelector(`.${nr}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(nr), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function Ec(e) {
  const t = Ic(e.textContent ?? "");
  t && (e.setAttribute($c, "true"), e.replaceChildren(Lc(t)));
}
function Ic(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, a = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: u } = Sc(r ?? "");
  return l ? {
    skillLabel: a,
    formula: l,
    total: Math.trunc(s),
    diceValues: u
  } : null;
}
function Sc(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Dc(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Dc(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Lc(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Pc(e);
  return r && t.append(r), t;
}
function Pc(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of vc(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function vc(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? dr(e, "highest") : n.includes("kl") ? dr(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function dr(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function mr(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Tn() {
  const e = globalThis.game;
  return mt(e) ? e : null;
}
function D(e, t) {
  const n = Nc(e, t);
  return Ge(n);
}
function Nc(e, t) {
  return t.split(".").reduce((n, r) => mt(n) ? n[r] : null, e);
}
function Oc(e, t) {
  const n = e.indexOf(":");
  return n < 0 || De(e.slice(0, n)) !== De(t) ? null : pe(e.slice(n + 1));
}
function Ge(e) {
  return typeof e == "string" ? pe(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function mt(e) {
  return !!e && typeof e == "object";
}
function Fc(e) {
  return typeof e == "string";
}
function ft(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function pe(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function De(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Vt(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function V(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function da(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function xc(e) {
  for (const t of Array.from(e.querySelectorAll(cl))) {
    const n = Hc(t);
    Mc(t), n && (Bc(t, n), Uc(t, n));
  }
}
function Mc(e) {
  for (const t of Array.from(e.querySelectorAll(ul)))
    t.remove();
}
function Bc(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(Uo) ?? null, o = r?.querySelector(ll) ?? null, a = r ?? e, s = a.querySelector(gl);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = su(t.elementTone), l.textContent = iu(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", l);
      return;
    }
    a.prepend(l);
  }
}
function Uc(e, t) {
  const n = qc(e);
  zc(e, n);
  const r = jc(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${i}__ritual-metadata`);
  for (const s of r) {
    const l = document.createElement("span");
    l.classList.add(`${i}__ritual-metadata-chip`), l.textContent = s, o.append(l);
  }
  if (n) {
    const s = n.querySelector(`.${i}__summary`);
    if (s?.parentElement === n) {
      s.insertAdjacentElement("afterend", o);
      return;
    }
    n.append(o);
    return;
  }
  const a = e.querySelector(jo);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function qc(e) {
  return e.closest(`.${i}`)?.querySelector(Uo) ?? null;
}
function zc(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(hl)))
      o.remove();
}
function jc(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Vt(e.target)}` : null,
    e.duration ? `Duração: ${Vt(e.duration)}` : null,
    e.resistance ? `Resistência: ${da(e.resistance)}` : null
  ].filter(ft);
}
function Hc(e) {
  const t = Vc(e), n = Zc(e), o = (t ? Qc(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = Rn(D(o, "element")), l = M("op.elementChoices", s) ?? fr(X(a, "Elemento")) ?? fr(n.damageType), u = s ?? lu(l), m = D(o, "circle") ?? X(a, "Círculo"), f = eu(o) ?? X(a, "Alvo"), A = ou(o, "duration", "op.durationChoices") ?? X(a, "Duração"), T = Xc(e) ?? nu(o) ?? X(a, "Resistência"), R = Jc(a) ?? n.cost, g = {
    elementLabel: l,
    elementTone: u,
    circle: m,
    cost: R,
    target: f,
    duration: A,
    resistance: T
  };
  return au(g) ? g : null;
}
function Vc(e) {
  const t = Gc(e);
  if (!t) return null;
  const n = t.getFlag?.(c, Bo), r = Kc(n);
  if (r.length === 0) return null;
  const o = Wc(e);
  if (o.size > 0) {
    const a = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function Gc(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Tn()?.messages?.get?.(n) ?? null : null;
}
function Wc(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${tr}]`))) {
    const o = r.getAttribute(tr)?.trim();
    o && n.add(o);
  }
  return n;
}
function Kc(e) {
  if (!mt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Yc).filter((n) => n !== null) : [];
}
function Yc(e) {
  return mt(e) ? {
    pendingId: Ge(e.pendingId),
    actorId: Ge(e.actorId),
    itemId: Ge(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Fc) : []
  } : null;
}
function Qc(e) {
  if (!e.itemId) return null;
  const t = Tn(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Zc(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(dl))) {
    const o = pe(r.textContent);
    if (!o) continue;
    const a = Oc(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function Xc(e) {
  const t = pe(e.querySelector(qo)?.textContent);
  return t ? da(t) : null;
}
function X(e, t) {
  const n = De(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || De(r.slice(0, o)) !== n))
      return pe(r.slice(o + 1));
  }
  return null;
}
function Jc(e) {
  const t = X(e, "Custo") ?? X(e, "PE");
  return t || (e.map(pe).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function eu(e) {
  const t = D(e, "target");
  if (!t) return null;
  if (t === "area")
    return tu(e) ?? M("op.targetChoices", t) ?? "Área";
  const n = M("op.targetChoices", t) ?? V(t);
  return [t === "people" || t === "creatures" ? D(e, "targetQtd") : null, n].filter(ft).join(" ");
}
function tu(e) {
  const t = D(e, "area.name"), n = D(e, "area.size"), r = D(e, "area.type"), o = t ? M("op.areaChoices", t) ?? V(t) : null, a = r ? M("op.areaTypeChoices", r) ?? V(r) : null;
  return o ? n ? a ? `${o} ${n}m ${Vt(a)}` : `${o} ${n}m` : o : null;
}
function nu(e) {
  const t = D(e, "skillResis"), n = D(e, "resistance");
  if (!t || !n) return null;
  const r = M("op.skill", t) ?? V(t), o = ru(n);
  return [r, o].filter(ft).join(" ");
}
function ru(e) {
  switch (e) {
    case "reducesByHalf":
      return "reduz à metade";
    case "nullifies":
      return "anula";
    case "discredits":
      return "desacredita";
    case "partial":
      return "parcial";
    default:
      return M("op.resistanceChoices", e) ?? V(e);
  }
}
function ou(e, t, n) {
  const r = D(e, t);
  return r ? M(n, r) ?? V(r) : null;
}
function au(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function iu(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function su(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(ft).join(" ");
}
function Rn(e) {
  const t = De(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function fr(e) {
  const t = Rn(e);
  return t ? M("op.elementChoices", t) ?? V(t) : e ? V(e) : null;
}
function lu(e) {
  return Rn(e);
}
function M(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Tn()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const pr = "data-paranormal-toolkit-dice-toggle-enhanced";
function cu(e) {
  for (const t of Array.from(e.querySelectorAll(Ho)))
    ma(t);
}
function uu(e) {
  const t = pa(e.target);
  if (!t) return;
  const n = $n(t);
  n && (e.preventDefault(), fa(n, t));
}
function du(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = pa(e.target);
  if (!t) return;
  const n = $n(t);
  n && (e.preventDefault(), fa(n, t));
}
function ma(e) {
  const t = e.querySelector(bn);
  if (!t) return;
  const n = e.querySelector(Go);
  if (n && n.getAttribute(pr) !== "true" && (n.setAttribute(pr, "true"), n.classList.add(Wo), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function fa(e, t) {
  const n = e.querySelector(bn);
  if (!n) return;
  const r = !e.classList.contains(Vo);
  mu(e, t, n, r);
}
function mu(e, t, n, r) {
  e.classList.toggle(Vo, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function pa(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Go);
  if (!t) return null;
  const n = $n(t);
  return n ? (ma(n), t.classList.contains(Wo) ? t : null) : null;
}
function $n(e) {
  const t = e.closest(Ho);
  return t && t.querySelector(bn) ? t : null;
}
const gr = `${c}-workflow-dice-toggle-styles`;
function fu() {
  if (document.getElementById(gr)) return;
  const e = document.createElement("style");
  e.id = gr, e.textContent = `
.${i}__workflow-section .${i}__roll-detail-toggle,
.${i}__workflow-section .${i}__roll-detail-list {
  display: none !important;
}

.${i}__workflow-roll:not(.${i}__workflow-roll--dice-open) .${i}__workflow-dice-tray,
.${i}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${i}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${i}__workflow-roll-formula--toggle:hover,
.${i}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${i}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${i}__header .${i}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${i}__ritual-element-badge {
  display: inline-flex;
  align-items: center;
  min-height: 1.08rem;
  border: 1px solid rgba(36, 27, 24, 0.14);
  border-radius: 2px;
  padding: 0.06rem 0.3rem 0.07rem;
  background: rgba(74, 64, 54, 0.86);
  color: rgba(255, 255, 255, 0.96);
  font-size: 0.66rem;
  font-weight: 950;
  letter-spacing: 0.025em;
  line-height: 1;
  text-transform: uppercase;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.${i}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${i}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${i}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${i}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${i}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${i}__header .${i}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${i}__roll-card > .${i}__ritual-metadata {
  display: none !important;
}

.${i}__ritual-metadata-chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  border: 1px solid rgba(66, 47, 34, 0.14);
  border-radius: 999px;
  padding: 0.12rem 0.42rem;
  background: rgba(255, 255, 255, 0.42);
  color: rgba(36, 27, 24, 0.82);
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.${i}__resistance {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 34px;
  grid-template-areas:
    "content button"
    "result result";
  align-items: start !important;
  column-gap: 0.62rem;
  row-gap: 0.36rem;
  padding: 0.56rem 0.58rem !important;
}

.${i}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${i}__resistance-content .${i}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${i}__resistance-content .${i}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${i}__resistance-content .${i}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${i}__resistance > .${i}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: start;
}

.${i}__resistance > .${i}__resistance-roll-result,
.${i}__resistance-content .${i}__resistance-roll-result {
  grid-area: result;
  display: block;
  min-width: 0;
  width: 100%;
  margin-top: 0;
}

.${i}__resistance-workflow-roll {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 0.34rem;
}

.${i}__resistance-workflow-roll .${i}__workflow-roll-formula {
  display: inline-flex;
  width: 100%;
  max-width: 100%;
  min-height: 1.78rem;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

.${i}__resistance-workflow-roll .${i}__workflow-roll-formula i {
  margin-left: auto;
}

.${i}__resistance-workflow-roll .${i}__workflow-dice-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
  border-top: 1px solid rgba(79, 55, 42, 0.12);
  padding-top: 0.34rem;
}

.${i}__resistance-workflow-roll .${i}__workflow-die {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.22rem;
  min-height: 1.22rem;
  border: 1px solid rgba(82, 57, 25, 0.18);
  border-radius: 999px;
  padding: 0 0.27rem;
  background: rgba(255, 255, 255, 0.64);
  color: rgba(36, 27, 24, 0.9);
  font-family: var(--font-mono, monospace);
  font-size: 0.7rem;
  font-weight: 800;
  line-height: 1;
  box-sizing: border-box;
}

.${i}__resistance-workflow-roll .${i}__workflow-die--inactive {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(36, 27, 24, 0.46);
  opacity: 0.58;
}
.${i}__workflow-section--casting .${i}__workflow-section-header--casting-backlash {
  grid-template-columns: minmax(0, 1fr) 34px;
}

.${i}__workflow-section-title-row {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.38rem;
}

.${i}__workflow-section-title-row .${i}__workflow-section-status {
  flex: 0 0 auto;
}

.${i}__casting-backlash-button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  justify-self: end;
  width: 34px !important;
  min-width: 34px !important;
  height: 34px !important;
  min-height: 34px !important;
  margin: 0 !important;
  border: 1px solid rgba(125, 39, 43, 0.46) !important;
  border-radius: 7px !important;
  padding: 0 !important;
  background: rgba(158, 82, 87, 0.88) !important;
  color: #fffaf3 !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 1px 2px rgba(0, 0, 0, 0.12) !important;
  font-size: 0 !important;
  line-height: 1 !important;
  overflow: hidden !important;
  text-shadow: none !important;
}

.${i}__casting-backlash-button::before {
  content: "↪";
  font-size: 1rem;
  font-weight: 950;
  line-height: 1;
}

.${i}__casting-backlash-button:hover,
.${i}__casting-backlash-button:focus {
  border-color: rgba(125, 39, 43, 0.66) !important;
  background: rgba(143, 62, 67, 0.94) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 0 0 2px rgba(125, 39, 43, 0.16) !important;
  outline: none !important;
}

.${i}__casting-backlash-button:disabled {
  cursor: default !important;
  opacity: 0.78 !important;
}

.${i}__casting-backlash-button.${i}__button--executed::before {
  content: "✓";
}

/* 0.21.2 — Resolução de dano integrada no bloco de Dano */
.${i}__workflow-section--effect .${i}__resistance {
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.48rem 0.52rem !important;
  background: rgba(255, 246, 229, 0.52) !important;
  box-shadow: none !important;
}

.${i}__workflow-section--effect .${i}__resistance-content {
  gap: 0.22rem !important;
}

.${i}__workflow-section--effect .${i}__resistance-header strong {
  display: inline !important;
  margin: 0 !important;
}

.${i}__workflow-section--effect .${i}__resistance-description {
  font-size: 0.75rem !important;
  line-height: 1.25 !important;
}

.${i}__actions--embedded {
  margin-top: 0.46rem !important;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${i}__actions--compact,
.${i}__actions--damage-resolution {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center !important;
  gap: 0.34rem !important;
}

.${i}__actions--damage-resolution .${i}__actions-title {
  grid-column: 1 / -1;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.02rem !important;
  color: rgba(71, 47, 34, 0.62) !important;
  font-size: 0.68rem !important;
  font-weight: 900 !important;
  letter-spacing: 0.045em !important;
  line-height: 1 !important;
  text-align: center;
  text-transform: uppercase !important;
}

.${i}__actions--damage-resolution .${i}__actions-title::before,
.${i}__actions--damage-resolution .${i}__actions-title::after {
  content: "";
  display: block;
  border-top: 1px solid rgba(79, 55, 42, 0.16);
}

.${i}__damage-resolution-summary {
  grid-column: 1 / -1;
  margin: -0.04rem 0 0.02rem;
  color: rgba(54, 39, 31, 0.64);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.24;
  text-align: center;
}

.${i}__actions--damage-resolution .${i}__button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: none !important;
  height: auto !important;
  min-height: 1.85rem !important;
  max-height: none !important;
  margin: 0 !important;
  border-radius: 7px !important;
  padding: 0.34rem 0.52rem !important;
  font-size: 0.76rem !important;
  font-weight: 900 !important;
  line-height: 1.1 !important;
  gap: 0.34rem !important;
  white-space: normal !important;
  aspect-ratio: auto !important;
}

.${i}__actions--damage-resolution .${i}__button-icon {
  flex: 0 0 auto;
  font-size: 0.78rem;
  line-height: 1;
  opacity: 0.88;
}

.${i}__actions--damage-resolution .${i}__button-label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="pending"] .${i}__button,
.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${i}__button,
.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${i}__button {
  grid-column: 1 / -1;
}

.${i}__actions--damage-resolution .${i}__button[hidden] {
  display: none !important;
}

.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${i}__damage-resolution-summary {
  color: rgba(34, 93, 55, 0.84);
}

.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${i}__damage-resolution-summary {
  color: rgba(112, 44, 44, 0.82);
}

.${i}__actions--effect-resolution {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "title button"
    "label button";
  align-items: center !important;
  gap: 0.18rem 0.52rem !important;
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.54rem 0.58rem !important;
  background: rgba(255, 250, 238, 0.58) !important;
  box-shadow: none !important;
}

.${i}__actions--effect-resolution .${i}__actions-title {
  grid-area: title;
  margin: 0 !important;
  color: rgba(107, 78, 35, 0.95) !important;
  font-size: 0.78rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.055em !important;
  line-height: 1 !important;
  text-transform: uppercase !important;
}

.${i}__effect-resolution-label {
  grid-area: label;
  min-width: 0;
  color: rgba(36, 27, 24, 0.9);
  font-size: 0.82rem;
  font-weight: 850;
  line-height: 1.22;
  overflow-wrap: anywhere;
}

.${i}__actions--effect-resolution .${i}__button {
  grid-area: button;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: auto !important;
  min-width: 5rem !important;
  max-width: 7rem !important;
  min-height: 1.9rem !important;
  margin: 0 !important;
  border-radius: 7px !important;
  padding: 0.34rem 0.62rem !important;
  font-size: 0.78rem !important;
  font-weight: 900 !important;
  line-height: 1.1 !important;
  white-space: nowrap !important;
  aspect-ratio: auto !important;
}

/* 0.21.4 — Card compacto de efeito e botão com brilho */
.${i}__actions--effect-resolution {
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${i}__actions--effect-resolution .${i}__button {
  gap: 0.34rem !important;
  border-color: rgba(123, 72, 73, 0.42) !important;
  background: rgba(228, 214, 209, 0.74) !important;
  color: rgba(42, 30, 27, 0.94) !important;
}

.${i}__actions--effect-resolution .${i}__button:hover,
.${i}__actions--effect-resolution .${i}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${i}__button-icon--effect {
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
  transform: translateY(-0.02rem);
}

.${i}__button--effect-resolution-action .${i}__button-label {
  line-height: 1;
}

/* 0.21.5 — Efeito dentro do card principal e estado aplicado compacto */
/* 0.21.6 — Aproxima o Efeito do bloco de Dano para manter o ritmo visual do card */
/* 0.21.7 — Normaliza Efeito como seção irmã de Dano, sem margem herdada de actions */
.${i}__roll-card > .${i}__actions--effect-resolution {
  margin: 0 !important;
}

.${i}__roll-card > .${i}__workflow-section--effect + .${i}__actions--effect-resolution {
  margin-top: 0 !important;
}

.${i}__actions--effect-resolution.${i}__workflow-section {
  align-items: center !important;
}

.${i}__actions--effect-resolution .${i}__button--executed,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${i}__button-icon--effect-applied {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.8 — Efeito condicionado ao resultado da resistência */
.${i}__actions--effect-resolution .${i}__button--effect-resolution-waiting,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted {
  color: rgba(34, 93, 55, 0.84) !important;
}

.${i}__button-icon--effect-resisted {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.9 — Estados bloqueados de efeito não devem parecer clicáveis */
.${i}__actions--effect-resolution .${i}__button--effect-resolution-waiting:hover,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-waiting:focus,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:hover,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:focus,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-waiting:disabled,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:disabled {
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  cursor: default !important;
}

.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:hover,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:focus,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:disabled {
  color: rgba(34, 93, 55, 0.84) !important;
}

/* 0.22.0 — Card estruturado: remove moldura externa e mantém cards internos */
.${i}__roll-card--structured {
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${i}__roll-card--structured > .${i}__workflow-section,
.${i}__roll-card--structured > .${i}__actions--effect-resolution {
  margin-inline: 0 !important;
}

.${i}__roll-card--structured > .${i}__workflow-section + .${i}__workflow-section,
.${i}__roll-card--structured > .${i}__workflow-section + .${i}__actions--effect-resolution,
.${i}__roll-card--structured > .${i}__actions--effect-resolution + .${i}__workflow-section {
  margin-top: 0.28rem !important;
}

.${i}__roll-card--structured > .${i}__roll-meta,
.${i}__roll-card--structured > .${i}__workflow-notes {
  margin-inline: 0.08rem !important;
}

`, document.head.append(e);
}
const pu = [0, 100, 500, 1500, 3e3];
let hr = !1, Ct = null;
function gu() {
  if (!hr) {
    hr = !0, fu(), Hooks.on("renderChatMessageHTML", (e, t) => {
      we(mr(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      we(mr(t));
    }), Hooks.once("ready", () => {
      we(document), hu();
    }), document.addEventListener("click", uu), document.addEventListener("keydown", du);
    for (const e of pu)
      globalThis.setTimeout(() => we(document), e);
  }
}
function hu() {
  Ct || !document.body || (Ct = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && we(n);
  }), Ct.observe(document.body, { childList: !0, subtree: !0 }));
}
function we(e) {
  e && (Nl(e), xc(e), wc(e), cu(e), kl(e));
}
function yu() {
  gu();
}
const bu = "data-paranormal-toolkit-action-section", Au = "ritual-log", _u = ".paranormal-toolkit-item-use-prompt__actions", Tu = ".paranormal-toolkit-item-use-prompt__actions-title", Ru = [0, 100, 500, 1500];
let yr = !1;
function $u() {
  if (yr) return;
  const e = (t, n) => {
    br(Eu(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), br(document), yr = !0;
}
function br(e) {
  for (const t of Ru)
    globalThis.setTimeout(() => wu(e), t);
}
function wu(e) {
  Cu(e), ku(e);
}
function Cu(e) {
  for (const t of e.querySelectorAll(
    `[${bu}="${Au}"]`
  ))
    t.remove();
}
function ku(e) {
  for (const t of e.querySelectorAll(_u)) {
    if (Ar(t.querySelector(Tu)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (a) => Ar(a.textContent ?? "")
    ).some((a) => a.includes("ritual conjurado")) && t.remove();
  }
}
function Eu(e) {
  if (e instanceof HTMLElement || Iu(e))
    return e;
  if (Su(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Iu(e) {
  return e instanceof HTMLElement;
}
function Su(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Ar(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Du = {
  cutting: "cuttingDamage",
  impact: "impactDamage",
  piercing: "piercingDamage",
  ballistic: "ballisticDamage",
  blood: "bloodDamage",
  death: "deathDamage",
  knowledge: "knowledgeDamage",
  energy: "energyDamage",
  fear: "fearDamage",
  fire: "fireDamage",
  cold: "coldDamage",
  electric: "eletricDamage",
  chemical: "chemicalDamage",
  mental: "mentalDamage"
}, Lu = new Set(
  Object.values(Du)
), Pu = {
  generic: null,
  none: null,
  indefinido: null,
  semtipo: null,
  untyped: null,
  cutting: "cuttingDamage",
  corte: "cuttingDamage",
  cuttingdamage: "cuttingDamage",
  impact: "impactDamage",
  impacto: "impactDamage",
  impactdamage: "impactDamage",
  piercing: "piercingDamage",
  perfurante: "piercingDamage",
  perfuracao: "piercingDamage",
  perfuração: "piercingDamage",
  piercingdamage: "piercingDamage",
  ballistic: "ballisticDamage",
  balistico: "ballisticDamage",
  balístico: "ballisticDamage",
  ballisticdamage: "ballisticDamage",
  blood: "bloodDamage",
  sangue: "bloodDamage",
  blooddamage: "bloodDamage",
  death: "deathDamage",
  morte: "deathDamage",
  deathdamage: "deathDamage",
  knowledge: "knowledgeDamage",
  conhecimento: "knowledgeDamage",
  knowledgedamage: "knowledgeDamage",
  energy: "energyDamage",
  energia: "energyDamage",
  energydamage: "energyDamage",
  fear: "fearDamage",
  medo: "fearDamage",
  feardamage: "fearDamage",
  fire: "fireDamage",
  fogo: "fireDamage",
  firedamage: "fireDamage",
  cold: "coldDamage",
  frio: "coldDamage",
  colddamage: "coldDamage",
  electric: "eletricDamage",
  eletrico: "eletricDamage",
  elétrico: "eletricDamage",
  eletrica: "eletricDamage",
  elétrica: "eletricDamage",
  eletricidade: "eletricDamage",
  electricidade: "eletricDamage",
  electricdamage: "eletricDamage",
  eletricdamage: "eletricDamage",
  chemical: "chemicalDamage",
  quimico: "chemicalDamage",
  químico: "chemicalDamage",
  quimica: "chemicalDamage",
  química: "chemicalDamage",
  chemicaldamage: "chemicalDamage",
  mental: "mentalDamage",
  ment: "mentalDamage",
  mentaldamage: "mentalDamage"
};
function vu(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Nu(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Pu[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Lu.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function ga(e) {
  switch (e) {
    case "cuttingDamage":
      return "Corte";
    case "impactDamage":
      return "Impacto";
    case "piercingDamage":
      return "Perfurante";
    case "ballisticDamage":
      return "Balístico";
    case "bloodDamage":
      return "Sangue";
    case "deathDamage":
      return "Morte";
    case "knowledgeDamage":
      return "Conhecimento";
    case "energyDamage":
      return "Energia";
    case "fearDamage":
      return "Medo";
    case "fireDamage":
      return "Fogo";
    case "coldDamage":
      return "Frio";
    case "eletricDamage":
      return "Eletricidade";
    case "chemicalDamage":
      return "Químico";
    case "mentalDamage":
      return "Mental";
    case null:
      return "Sem tipo";
  }
}
function Nu(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Ou {
  async applyDamage(t) {
    const n = t.actor, r = n.name ?? "Ator sem nome", o = n.id ?? null;
    if (!Array.isArray(t.instances) || t.instances.length === 0)
      return p({
        actor: n,
        actorId: o,
        actorName: r,
        reason: "empty-damage",
        message: "Nenhuma instância de dano foi informada."
      });
    const a = n.applyDamage;
    if (typeof a != "function")
      return p({
        actor: n,
        actorId: o,
        actorName: r,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const s = [], l = /* @__PURE__ */ new Set();
    let u = null;
    for (const [m, f] of t.instances.entries()) {
      const A = Fu(f, m);
      if (!A.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const T = vu(f.damageType);
      if (!T.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(f.damageType)}.`,
          instance: f,
          damageType: f.damageType
        });
      if (A.amount === 0) {
        s.push(
          xu(A.id, f, T.value)
        );
        continue;
      }
      try {
        const R = await Promise.resolve(
          a.call(n, A.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: f.ignoreResistance === !0,
            nonLethal: f.nonLethal === !0
          })
        );
        for (const v of Bu(R.conditions))
          l.add(v);
        const g = Mu(R.newPV);
        g !== null && (u = g), s.push({
          id: A.id,
          label: f.label ?? ga(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: A.amount,
          finalDamage: _r(R.finalDamage, A.amount),
          blocked: _r(R.blocked, 0),
          damageType: f.damageType ? String(f.damageType) : null,
          systemDamageType: T.value,
          ignoreResistance: f.ignoreResistance === !0,
          nonLethal: f.nonLethal === !0
        });
      } catch (R) {
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: f,
          cause: R
        });
      }
    }
    return y({
      actor: n,
      actorId: o,
      actorName: r,
      totalRawDamage: s.reduce(
        (m, f) => m + f.inputAmount,
        0
      ),
      totalFinalDamage: s.reduce(
        (m, f) => m + f.finalDamage,
        0
      ),
      totalBlocked: s.reduce(
        (m, f) => m + f.blocked,
        0
      ),
      newPV: u,
      conditions: Array.from(l),
      instances: s,
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
function Fu(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function xu(e, t, n) {
  return {
    id: e,
    label: t.label ?? ga(n),
    sourceRollId: t.sourceRollId ?? null,
    inputAmount: 0,
    finalDamage: 0,
    blocked: 0,
    damageType: t.damageType ? String(t.damageType) : null,
    systemDamageType: n,
    ignoreResistance: t.ignoreResistance === !0,
    nonLethal: t.nonLethal === !0
  };
}
function _r(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Mu(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Bu(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const Ce = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, ha = {
  PV: "system.attributes.hp"
}, Gt = {
  PV: [Ce.PV, ha.PV],
  SAN: [Ce.SAN],
  PE: [Ce.PE],
  PD: [Ce.PD]
}, Wt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Uu {
  getResource(t, n) {
    const r = Tr(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, s = `${o}.max`, l = foundry.utils.getProperty(t, a), u = foundry.utils.getProperty(t, s), m = $r(t, n, a, l, "valor atual");
    if (m) return p(m);
    const f = $r(t, n, s, u, "valor máximo");
    return f ? p(f) : y({
      value: l,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = Tr(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function Tr(e, t) {
  const n = qu(e.type, t);
  if (n && Rr(e, n))
    return y(n);
  const r = Gt[t].find(
    (o) => Rr(e, o)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: zu(e, t),
    path: Gt[t].join(" | ")
  });
}
function qu(e, t) {
  return e === "threat" ? ha[t] ?? null : e === "agent" ? Ce[t] : null;
}
function Rr(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function zu(e, t) {
  const n = e.type ?? "unknown", r = Gt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function $r(e, t, n, r, o) {
  return r == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${o} de ${t} não encontrado: ${n}.`,
    path: n,
    value: r
  } : typeof r != "number" || !Number.isFinite(r) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${o} de ${t} em ${n}.`,
    path: n,
    value: r
  } : null;
}
class ju {
  isRitual(t) {
    return t.type === "ritual";
  }
  getCircle(t) {
    if (!this.isRitual(t))
      return p({
        reason: "not-a-ritual",
        message: `Item ${t.name ?? "sem nome"} não é um ritual.`,
        ritual: t
      });
    const n = this.readCircleFromKnownPaths(t);
    if (!n) {
      const s = Wt.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: o } = n, a = Hu(o);
    return a ? y(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Wt.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Hu(e) {
  if (wr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (wr(n))
      return n;
  }
  return null;
}
function wr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Vu = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Gu {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const n = this.ritualAdapter.getCircle(t.ritual);
    if (!n.ok)
      return p({
        ...n.error,
        actor: t.actor
      });
    const r = n.value, o = Wu(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: Vu[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Wu(e, t) {
  const n = e.getFlag(c, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Ku(n) ? {
    ok: !0,
    value: {
      resource: n.resource,
      amount: n.amount,
      source: "custom-flag",
      circle: t
    }
  } : {
    ok: !1,
    error: {
      reason: "invalid-custom-cost",
      message: `Custo customizado do ritual ${e.name ?? "sem nome"} é inválido.`,
      ritual: e,
      value: n
    }
  };
}
function Ku(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const kt = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Yu(e) {
  if (!td(e.item)) return null;
  const t = Kt(e.actor) ? e.actor : Qu(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Xu(e.token) ?? Zu(t),
    targets: pn(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Qu(e) {
  const t = e;
  return Kt(t.actor) ? t.actor : Kt(e.parent) ? e.parent : null;
}
function Zu(e) {
  const t = Ju(e) ?? ed(e);
  return t ? ya(t) : null;
}
function Xu(e) {
  return Yt(e) ? ya(e) : null;
}
function Ju(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Yt(n) ? n : (t.getActiveTokens?.() ?? []).find(Yt) ?? null;
}
function ed(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function ya(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Et(e.id),
    actorId: Et(t?.id),
    sceneId: Et(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function td(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Kt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Yt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Et(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class nd {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(kt.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, d.info(`${kt.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Yu(rd(t));
    if (!n) {
      d.warn(`${kt.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function rd(e) {
  return e && typeof e == "object" ? e : {};
}
class od {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return It("missing-item-patch");
    if (t.type !== "ritual") return It("unsupported-item-type");
    const o = ad(r);
    return Object.keys(o).length === 0 ? It("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function ad(e) {
  const t = {};
  C(t, "name", e.name), C(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (C(t, "system.circle", n.circle), C(t, "system.element", n.element), C(t, "system.target", n.target), C(t, "system.targetQtd", n.targetQuantity), C(t, "system.execution", n.execution), C(t, "system.range", n.range), C(t, "system.duration", n.duration), C(t, "system.skillResis", n.resistanceSkill), C(t, "system.resistance", n.resistance), C(t, "system.studentForm", n.studentForm), C(t, "system.trueForm", n.trueForm)), t;
}
function C(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function It(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class id {
  constructor(t) {
    this.resourceAdapter = t;
  }
  resourceAdapter;
  getActorSnapshot(t) {
    const n = this.getResources(t);
    return {
      id: t.id ?? null,
      name: t.name ?? "Ator sem nome",
      type: t.type ?? "unknown",
      resources: n.values,
      resourceErrors: n.errors,
      ritualDT: this.getRitualDT(t)
    };
  }
  getRitualDT(t) {
    return this.getNumber(t, Wt.ritual.dt, 0);
  }
  getResources(t) {
    const n = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, r = [];
    for (const o of ["PV", "SAN", "PE", "PD"]) {
      const a = this.resourceAdapter.getResource(t, o);
      a.ok ? n[o] = a.value : r.push(a.error);
    }
    return { values: n, errors: r };
  }
  getNumber(t, n, r) {
    const o = foundry.utils.getProperty(t, n);
    return typeof o == "number" && Number.isFinite(o) ? o : r;
  }
}
class sd {
  async applyPreset(t, n, r = {}) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: n.id,
        presetVersion: n.version,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: r.definition ?? n.automation
    };
    return await this.writeAutomationFlag(t, o), o;
  }
  async applyManualDefinition(t, n, r = n.label) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: r,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: n
    };
    return await this.writeAutomationFlag(t, o), o;
  }
  async clear(t) {
    await t.unsetFlag(c, "automation");
  }
  async writeAutomationFlag(t, n) {
    await this.clear(t), await t.setFlag(c, "automation", n);
  }
}
class ld {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = cd(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, St(t)), y(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const o = this.register(r);
      if (!o.ok)
        return o;
      n.push(o.value);
    }
    return y(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? St(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? y(n) : p({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(St);
  }
  findForItem(t) {
    return this.list().map((n) => ud(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function cd(e) {
  return !Dt(e.id) || !Dt(e.version) || !Dt(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function ud(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = dd(o, t);
    if (!a.matches)
      return null;
    r += a.score, n.push(a.reason);
  }
  return {
    preset: e,
    score: r,
    reasons: n
  };
}
function dd(e, t) {
  switch (e.type) {
    case "itemType": {
      const n = e.itemTypes.includes(t.type);
      return {
        matches: n,
        score: n ? 10 : 0,
        reason: `itemType:${t.type}`
      };
    }
    case "normalizedName": {
      const n = Cr(t.name), r = e.names.map(Cr).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = md(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Cr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function md(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function St(e) {
  return structuredClone(e);
}
function Dt(e) {
  return typeof e == "string" && e.length > 0;
}
function Xe(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = pt(e.amountFrom);
    if (!n)
      return p({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const r = t.rolls[n];
    if (!r)
      return p({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${n}.`
      });
    const o = Math.trunc(r.total);
    return !Number.isInteger(o) || o <= 0 ? p({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : y(o);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function pt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const fd = "dice-so-nice";
async function ba(e) {
  if (!pd() || !gd()) return;
  const t = hd();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      d.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function pd() {
  try {
    return sl().enabled;
  } catch {
    return !1;
  }
}
function gd() {
  return game.modules?.get?.(fd)?.active === !0;
}
function hd() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function yd(e, t, n) {
  if (!kr(e.id) || !kr(e.formula))
    return p({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(e.formula), o = await Promise.resolve(r.evaluate()), a = o.total;
    if (typeof a != "number" || !Number.isFinite(a))
      return p({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await ba(o);
    const l = {
      ...n.rollRequests[e.id] ?? Aa(e, t),
      total: a,
      roll: o
    };
    return n.rolls[e.id] = l, y(l);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function Aa(e, t) {
  const n = e.intent ?? bd(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function bd(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function kr(e) {
  return typeof e == "string" && e.length > 0;
}
async function Je(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? je(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? je(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? je(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? je(t, n, r, o) : e.recover(t, n, o);
  }
}
function je(e, t, n, r) {
  return p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    resource: t,
    operation: n,
    reason: "invalid-resource-operation",
    message: `Operação ${n} não é válida para ${t}.`,
    requestedAmount: r
  });
}
function Ad(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = _d(t, n, r, o);
    n.damageInstances.push(s), a.emit("afterDamageResolution", n, {
      stepIndex: o,
      step: t,
      damage: s,
      resourceTransaction: r,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), a.emit("afterApplyDamage", n, {
      stepIndex: o,
      step: t,
      damage: s,
      resourceTransaction: r,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    });
    return;
  }
  if (t.operation === "heal") {
    const s = Td(t, n, r, o);
    n.healingInstances.push(s), a.emit("afterApplyHealing", n, {
      stepIndex: o,
      step: t,
      healing: s,
      resourceTransaction: r,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount
      }
    });
  }
}
function _d(e, t, n, r) {
  const o = pt(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: _a(t.id, "damage", r, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    damageType: a?.damageType,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Td(e, t, n, r) {
  const o = pt(e.amountFrom);
  return {
    id: _a(t.id, "healing", r, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function _a(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Rd(e, t, n) {
  const r = pt(e.amountFrom), o = r ? t.rolls[r] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    amountFrom: e.amountFrom,
    rollId: r,
    rollIntent: o?.intent,
    damageType: o?.damageType
  };
}
function $d(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Ta("before", e), Er("before", e), Er("resolve", e);
}
function wd(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Ta("apply", e);
}
function Cd(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Ta(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = t, l = kd(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Er(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function kd(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Ed(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), y(void 0);
  } catch (r) {
    return p({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function Id(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Sd(e, t);
    case "spendRitualCost":
      return Dd(e, t);
  }
}
async function Sd(e, t) {
  const { context: n, resources: r } = e, o = Xe(t, n);
  return o.ok ? Ra(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function Dd(e, t) {
  const { context: n, resources: r, ritualCosts: o } = e, a = o.getCost({
    actor: n.sourceActor,
    ritual: n.item
  });
  if (!a.ok)
    return p({
      reason: "ritual-cost-failed",
      message: a.error.message,
      cause: a.error
    });
  const s = a.value;
  return n.ritualCosts.push({
    ...s,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), Ra(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Ra(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Ld(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, s = Pd(t);
  for (const u of s.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const l = await a();
  if (!l.ok)
    return l;
  for (const u of s.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return l;
}
function Pd(e) {
  switch (e.type) {
    case "spendResource":
    case "spendRitualCost":
      return {
        before: ["beforeCost", "spendCost"],
        after: ["afterCost"]
      };
    case "chatCard":
      return {
        before: ["beforeChat", "chat"],
        after: []
      };
    default:
      return {
        before: [],
        after: []
      };
  }
}
class vd {
  constructor(t, n, r, o) {
    this.resources = t, this.ritualCosts = n, this.messages = r, this.lifecycle = o;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, n) {
    if (t.steps.length === 0)
      return p({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: n
      });
    for (const [r, o] of t.steps.entries()) {
      const a = await this.runStep(o, n, r);
      if (!a.ok)
        return a;
    }
    return y({ definition: t, context: n });
  }
  async runStep(t, n, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, r);
      default:
        return Ld({
          step: t,
          context: n,
          stepIndex: r,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(t, n, r)
        });
    }
  }
  async executeStep(t, n, r) {
    switch (t.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(t, n, r);
      case "rollFormula":
        return this.runRollFormulaStep(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStep(t, n, r);
      case "chatCard":
        return this.runChatCardStep(t, n, r);
      default:
        return p({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: r,
          step: t,
          context: n
        });
    }
  }
  async runCostStep(t, n, r) {
    const o = await Id({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = Aa(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await yd(t, r, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = Xe(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = Rd(t, n, o.value);
    $d({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), wd({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, n);
    if (s.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const l of s) {
      const u = await Je(this.resources, l, t.resource, t.operation, o.value), m = this.handleResourceOperationResult(u, n, r, t);
      if (!m.ok)
        return m;
      Ad({
        step: t,
        context: n,
        transaction: m.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Cd({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = Xe(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = this.resolveActors(t.actor, n);
    if (a.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const s of a) {
      const l = await Je(this.resources, s, t.resource, t.operation, o.value), u = this.handleResourceOperationResult(l, n, r, t);
      if (!u.ok)
        return u;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await Ed(this.messages, t, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, o) {
    return t.ok ? (n.resourceTransactions.push(t.value), y(t.value)) : p({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: o,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, o, a, s) {
    const l = Nd(t, n.intent);
    l && this.lifecycle.emit(l, r, {
      stepIndex: o,
      step: a,
      rollRequest: n,
      rollResult: s
    });
  }
  resolveActors(t, n) {
    switch (t) {
      case "self":
        return [n.sourceActor];
      case "target":
        return n.targets.flatMap((r) => r.actor ? [r.actor] : []);
    }
  }
}
function Nd(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Od {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async spend(t, n, r) {
    return this.execute(t, n, "spend", r);
  }
  async damage(t, n, r) {
    return this.execute(t, n, "damage", r);
  }
  async heal(t, n, r) {
    return this.execute(t, n, "heal", r);
  }
  async recover(t, n, r) {
    return this.execute(t, n, "recover", r);
  }
  async execute(t, n, r, o) {
    if (!Number.isInteger(o) || o <= 0)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: o
      });
    const a = this.adapter.getResource(t, n);
    if (!a.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: a.error.reason,
        message: a.error.message,
        requestedAmount: o,
        path: a.error.path,
        value: a.error.value
      });
    const s = a.value, l = this.calculate(r, s, o);
    if (!l.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: l.error.reason,
        message: l.error.message,
        requestedAmount: o,
        current: s.value,
        required: o
      });
    const { afterValue: u, appliedAmount: m } = l.value, f = {
      value: u,
      max: s.max
    };
    try {
      u !== s.value && await this.adapter.updateResourceValue(t, n, u);
    } catch (A) {
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "update-failed",
        message: `Falha ao atualizar ${n} no ator.`,
        requestedAmount: o,
        current: s.value,
        required: o,
        cause: A
      });
    }
    return y({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: o,
      appliedAmount: m,
      before: s,
      after: f
    });
  }
  calculate(t, n, r) {
    switch (t) {
      case "spend":
        return n.value < r ? p({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${n.value}; custo: ${r}.`
        }) : y({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const o = Math.max(0, n.value - r);
        return y({
          afterValue: o,
          appliedAmount: n.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(n.max, n.value + r);
        return y({
          afterValue: o,
          appliedAmount: o - n.value
        });
      }
    }
  }
}
function $a(e) {
  return {
    id: Fd(),
    sourceActor: e.sourceActor,
    sourceToken: e.sourceToken ?? null,
    item: e.item,
    targets: e.targets ?? [],
    phases: [],
    lifecycleEvents: [],
    rollRequests: {},
    rolls: {},
    ritualCosts: [],
    damageInstances: [],
    healingInstances: [],
    resourceTransactions: [],
    flags: e.flags ?? {}
  };
}
function Fd() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class xd {
  constructor(t, n) {
    this.automation = t, this.hooks = n;
  }
  automation;
  hooks;
  lastContext = null;
  getLastContext() {
    return this.lastContext;
  }
  getLastDebugSnapshot() {
    return ee(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = $a(n);
    this.lastContext = r, this.hooks.emit("created", r, {
      metadata: {
        definitionLabel: t.label,
        itemId: r.item.id ?? null,
        itemName: r.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", r), this.hooks.emit("resolveTargets", r, {
      metadata: {
        targetCount: r.targets.length
      }
    });
    const o = await this.automation.run(t, r);
    return o.ok ? (this.hooks.emit("completed", r), o) : (this.emitFailed(r, o.error), o);
  }
  emitFailed(t, n) {
    this.hooks.emit("failed", t, {
      stepIndex: n.stepIndex,
      step: n.step,
      metadata: {
        reason: n.reason,
        message: n.message
      }
    });
  }
}
class Md {
  emit(t, n, r = {}) {
    const o = {
      phase: t,
      context: n,
      stepIndex: r.stepIndex,
      step: r.step,
      rollRequest: r.rollRequest,
      rollResult: r.rollResult,
      damage: r.damage,
      healing: r.healing,
      resourceTransaction: r.resourceTransaction,
      metadata: r.metadata
    };
    return n.phases.push(t), n.lifecycleEvents.push({
      phase: t,
      stepIndex: r.stepIndex,
      stepType: r.step?.type,
      rollId: r.rollRequest?.id ?? r.rollResult?.id,
      rollIntent: r.rollRequest?.intent ?? r.rollResult?.intent,
      damageId: r.damage?.id,
      healingId: r.healing?.id,
      resourceOperation: r.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${c}.workflow.${t}`, o), Hooks.callAll(`${c}.workflow.phase`, o), o;
  }
}
class Bd {
  info(t) {
    this.emit("info", t);
  }
  warn(t) {
    this.emit("warn", t);
  }
  error(t) {
    this.emit("error", t);
  }
  async chat(t) {
    const n = zt();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Ud(),
      flags: {
        ...t.flags,
        [c]: {
          ...qd(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && d.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = zt();
    if (!r.enabled)
      return;
    const o = n.notification ?? Ir(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = Ir(n);
    switch (t) {
      case "info":
        d.info(r, n.data ?? "");
        return;
      case "warn":
        d.warn(r, n.data ?? "");
        return;
      case "error":
        d.error(r, n.data ?? "");
        return;
    }
  }
  emitUi(t, n) {
    switch (t) {
      case "info":
        ui.notifications?.info(`Paranormal Toolkit: ${n}`);
        return;
      case "warn":
        ui.notifications?.warn(`Paranormal Toolkit: ${n}`);
        return;
      case "error":
        ui.notifications?.error(`Paranormal Toolkit: ${n}`);
        return;
    }
  }
}
function Ir(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Ud() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function qd(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function zd(e, t) {
  const n = Yd(e?.rounds);
  if (!n)
    return Sr(null);
  const r = e?.anchor ?? wa(t);
  if (!r)
    return {
      ...Sr(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: jd(),
    start: {
      combat: r.combatId,
      combatant: r.combatantId,
      initiative: r.initiative,
      round: r.round,
      turn: r.turn,
      time: r.time
    },
    requestedRounds: n,
    combatDurationApplied: !0,
    combatId: r.combatId,
    startCombatantId: r.combatantId,
    startInitiative: r.initiative,
    startRound: r.round,
    startTurn: r.turn,
    expiryEvent: o,
    durationMode: "combatantTurn",
    warning: null
  };
}
function wa(e) {
  const t = Qd();
  if (!t?.id || !Ca(t.round)) return null;
  const n = Wd(t), r = Hd(e, n) ?? Gd(t), o = H(r?.id), a = Xd(r?.initiative), s = Vd(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: s,
    initiative: a,
    time: Zd()
  };
}
function jd() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Sr(e) {
  return {
    duration: {},
    start: {},
    requestedRounds: e,
    combatDurationApplied: !1,
    combatId: null,
    startCombatantId: null,
    startInitiative: null,
    startRound: null,
    startTurn: null,
    expiryEvent: null,
    durationMode: "none",
    warning: null
  };
}
function Hd(e, t) {
  return e?.id ? t.find((n) => Kd(n) === e.id) ?? null : null;
}
function Vd(e, t, n) {
  const r = H(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return Jd(e.turn) ? e.turn : null;
}
function Gd(e) {
  return We(e.combatant) ? e.combatant : null;
}
function Wd(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(We);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(We);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(We);
  }
  return [];
}
function Kd(e) {
  return H(e.actor?.id) ?? H(e.actorId) ?? H(e.token?.actor?.id) ?? H(e.token?.actorId) ?? H(e.document?.actor?.id) ?? H(e.document?.actorId);
}
function Yd(e) {
  return Ca(e) ? Math.trunc(e) : null;
}
function Qd() {
  return game.combat ?? null;
}
function Zd() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function We(e) {
  return !!(e && typeof e == "object");
}
function H(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Xd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ca(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Jd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class em {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? y(n.value) : p({
      conditionId: t,
      reason: "condition-not-found",
      message: n.error.message
    });
  }
  async applyCondition(t) {
    const n = this.registry.get(t.conditionId);
    if (!n.ok)
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "condition-not-found",
        message: n.error.message
      });
    const r = t.actor;
    if (!um(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = zd(t.duration, r), s = tm(o, t, a), u = t.refreshExisting ?? !0 ? dm(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(s)), y(Dr(r, o, u.id ?? null, !1, !0, a));
      } catch (m) {
        return p({
          actor: r,
          actorId: r.id ?? null,
          actorName: r.name ?? "Ator sem nome",
          conditionId: o.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
          cause: m
        });
      }
    try {
      const f = (await r.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return y(Dr(r, o, f, !0, !1, a));
    } catch (m) {
      return p({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: o.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
        cause: m
      });
    }
  }
  async removeCondition(t) {
    const n = t.actor;
    if (!n || typeof n != "object")
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: "Ator inválido para remover condição."
      });
    const r = this.resolveCanonicalConditionId(t.conditionId), o = Ea(n, r);
    let a = 0;
    try {
      for (const s of o)
        await Lr(n, s) === "deleted" && (a += 1);
    } catch (s) {
      return p({
        actor: n,
        actorId: n.id ?? null,
        actorName: n.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "delete-failed",
        message: `Falha ao remover condição ${t.conditionId} de ${n.name ?? "ator sem nome"}.`,
        cause: s
      });
    }
    return y({
      actor: n,
      actorId: n.id ?? null,
      actorName: n.name ?? "Ator sem nome",
      conditionId: r,
      removed: a
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = pm(), r = [];
    let o = 0, a = 0;
    for (const s of n) {
      const l = wn(s);
      o += l.length;
      for (const u of l) {
        if (!om(u, t)) continue;
        const m = ka(u);
        try {
          await Lr(s, u) === "deleted" && (a += 1);
        } catch (f) {
          r.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: u.id ?? null,
            conditionId: m.conditionId,
            message: `Falha ao remover condição expirada ${m.conditionId ?? u.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
            cause: f
          });
        }
      }
    }
    return {
      reason: t.reason ?? "manual",
      scannedActors: n.length,
      scannedEffects: o,
      removedEffects: a,
      failures: r
    };
  }
}
function tm(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: wm(),
    requestedRounds: n.requestedRounds,
    combatDurationApplied: n.combatDurationApplied,
    combatId: n.combatId,
    startCombatantId: n.startCombatantId,
    startInitiative: n.startInitiative,
    startRound: n.startRound,
    startTurn: n.startTurn,
    expiryEvent: n.expiryEvent,
    durationMode: n.durationMode,
    deleteOnExpire: n.combatDurationApplied,
    expiresWithCombat: n.combatDurationApplied
  };
  return {
    name: e.label,
    icon: e.icon,
    img: e.icon,
    description: e.description,
    origin: t.originUuid ?? void 0,
    disabled: !1,
    transfer: !1,
    changes: e.changes.map((o) => ({ ...o })),
    duration: nm(n.duration),
    start: rm(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [c]: r
    }
  };
}
function nm(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function rm(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: $m(),
    ...e
  };
}
function Dr(e, t, n, r, o, a) {
  return {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    conditionId: t.id,
    conditionLabel: t.label,
    effectId: n,
    created: r,
    refreshed: o,
    requestedRounds: a.requestedRounds,
    combatDurationApplied: a.combatDurationApplied,
    warning: a.warning
  };
}
function om(e, t) {
  const n = ka(e);
  if (!n.conditionId || !am(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Rm();
  return n.durationMode === "combatantTurn" || im(n) ? lm(n, r) : sm(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !L(n.startRound) || !L(n.requestedRounds) || !L(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function am(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && L(e.requestedRounds);
}
function im(e) {
  return !!(e.combatDurationApplied && L(e.requestedRounds) && L(e.startRound) && (e.startCombatantId || et(e.startTurn)));
}
function sm(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function lm(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !L(e.startRound) || !L(e.requestedRounds) || !L(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = cm(t);
  return e.startCombatantId ? r === e.startCombatantId : et(e.startTurn) && et(t.turn) ? t.turn === e.startTurn : !1;
}
function cm(e) {
  return se(e.combatant?.id);
}
function ka(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ke(e, "conditionId"),
    requestedRounds: Pr(e, "requestedRounds") ?? ke(t.value) ?? ke(t.rounds),
    combatDurationApplied: Lt(e, "combatDurationApplied"),
    combatId: Ke(e, "combatId") ?? se(n.combat) ?? se(t.combat),
    startCombatantId: Ke(e, "startCombatantId") ?? se(n.combatant),
    startInitiative: bm(e, "startInitiative") ?? Ia(n.initiative),
    startRound: Pr(e, "startRound") ?? ke(n.round) ?? ke(t.startRound),
    startTurn: ym(e, "startTurn") ?? Qt(n.turn) ?? Qt(t.startTurn),
    expiryEvent: Am(e, "expiryEvent") ?? Sa(t.expiry),
    durationMode: _m(e, "durationMode"),
    deleteOnExpire: Lt(e, "deleteOnExpire"),
    expiresWithCombat: Lt(e, "expiresWithCombat")
  };
}
function um(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function dm(e, t) {
  return Ea(e, t)[0] ?? null;
}
function Ea(e, t) {
  return wn(e).filter((n) => hm(n) === t);
}
async function Lr(e, t) {
  const n = t.id ?? null, r = n ? mm(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (fm(o)) return "missing";
    throw o;
  }
}
function mm(e, t) {
  return wn(e).find((n) => n.id === t) ?? null;
}
function fm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function pm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      He(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    He(e, n);
  });
  for (const n of gm())
    He(e, n.actor), He(e, n.document?.actor);
  return Array.from(e.values());
}
function He(e, t) {
  if (!Tm(t)) return;
  const r = se(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function gm() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function wn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function hm(e) {
  return Ke(e, "conditionId");
}
function Ke(e, t) {
  return se(ne(e, t));
}
function Pr(e, t) {
  return ke(ne(e, t));
}
function ym(e, t) {
  return Qt(ne(e, t));
}
function bm(e, t) {
  return Ia(ne(e, t));
}
function Am(e, t) {
  return Sa(ne(e, t));
}
function _m(e, t) {
  const n = ne(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Lt(e, t) {
  return ne(e, t) === !0;
}
function ne(e, t) {
  const n = e.getFlag?.(c, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const o = r[c];
  if (!(!o || typeof o != "object"))
    return o[t];
}
function se(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ke(e) {
  return L(e) ? Math.trunc(e) : null;
}
function Qt(e) {
  return et(e) ? Math.trunc(e) : null;
}
function Ia(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Sa(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Tm(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Rm() {
  return game.combat ?? null;
}
function $m() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function L(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function et(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function wm() {
  return game.user?.id ?? null;
}
const Cm = "icons/svg/downgrade.svg", km = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Cm,
    description: km,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Em = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Im = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Sm = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Dm = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Lm = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Pm = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), vm = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Nm = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Om = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Fm = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), xm = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Mm = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Bm = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Um = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), qm = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), zm = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), jm = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Hm = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Vm = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Gm = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Wm = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Km = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Ym = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Qm = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Zm = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Xm = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Jm = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), ef = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), tf = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), nf = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), rf = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), of = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), af = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), sf = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), lf = [
  Em,
  Im,
  Sm,
  Dm,
  Lm,
  Pm,
  vm,
  Nm,
  Om,
  Fm,
  xm,
  Mm,
  Bm,
  Um,
  qm,
  zm,
  jm,
  Hm,
  Vm,
  Gm,
  Wm,
  Km,
  Ym,
  Qm,
  Zm,
  Xm,
  Jm,
  ef,
  tf,
  nf,
  rf,
  of,
  af,
  sf
];
class cf {
  definitions = /* @__PURE__ */ new Map();
  lookup = /* @__PURE__ */ new Map();
  constructor(t) {
    for (const n of t) {
      this.definitions.set(n.id, n), this.registerLookup(n.id, n.id), this.registerLookup(n.label, n.id);
      for (const r of n.aliases ?? [])
        this.registerLookup(r, n.id);
    }
  }
  list() {
    return Array.from(this.definitions.values()).map(vr);
  }
  get(t) {
    const n = this.lookup.get(Nr(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(vr(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Nr(t);
    r && this.lookup.set(r, n);
  }
}
function uf() {
  return new cf(lf);
}
function vr(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Nr(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const df = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Da = `${c}-inline-roll-neutralized`, mf = `${c}-inline-roll-notice`, Cn = `data-${c}-inline-roll-neutralized`, Or = `data-${c}-inline-roll-notice`, ff = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Fr(e) {
  const t = Ef(e.message), n = await pf(e.message), r = gf(t);
  return n.replacementCount + r.replacementCount > 0 && d.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: e.item.id ?? null,
    itemName: e.item.name ?? "Item sem nome",
    messageId: t,
    contentReplacementCount: n.replacementCount,
    renderedReplacementCount: r.replacementCount
  }), {
    messageId: t,
    contentUpdated: n.updated,
    contentReplacementCount: n.replacementCount,
    renderedReplacementCount: r.replacementCount
  };
}
async function pf(e) {
  const t = wf(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = hf(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Cf(t, n.content), replacementCount: n.replacementCount };
}
function gf(e) {
  const t = e ? kf(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = La(t);
  return n > 0 && Pa(Tf(t)), { replacementCount: n };
}
function hf(e) {
  const t = yf(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = La(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (Pa(n.content), { content: n.innerHTML, replacementCount: o });
}
function yf(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, Af(o.trim()))), replacementCount: t };
}
function La(e) {
  const t = bf(e);
  for (const n of t)
    n.replaceWith(_f(Rf(n)));
  return t.length;
}
function bf(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(df))
    n.getAttribute(Cn) !== "true" && t.add(n);
  return Array.from(t);
}
function Af(e) {
  return `<span class="${Da}" ${Cn}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${If(e)}</span>`;
}
function _f(e) {
  const t = document.createElement("span");
  return t.classList.add(Da), t.setAttribute(Cn, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Pa(e) {
  if (e.querySelector?.(`[${Or}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(mf), t.setAttribute(Or, "true"), t.textContent = ff, e.append(t);
}
function Tf(e) {
  return e.querySelector(".message-content") ?? e;
}
function Rf(e) {
  const n = e.getAttribute("data-formula") ?? $f(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function $f(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function wf(e) {
  return e && typeof e == "object" ? e : null;
}
async function Cf(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return d.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function kf(e) {
  const t = Sf(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Ef(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function If(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Sf(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const tt = "ritualRollConfig", le = "ritual-roll";
function gt() {
  return {
    schemaVersion: 1,
    intent: "damage",
    damageType: null,
    utilityLabel: "Resultado",
    note: "",
    forms: {
      base: { formula: "" },
      discente: { formula: "" },
      verdadeiro: { formula: "" }
    }
  };
}
function va(e) {
  const t = e.getFlag(c, tt);
  return Zt(t);
}
function Na(e) {
  return va(e) ?? gt();
}
async function Df(e, t) {
  const n = Zt(t) ?? Zt({
    ...gt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(c, tt, n), n;
}
async function Lf(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, c, tt));
    return;
  }
  await e.setFlag(c, tt, null);
}
function Zt(e) {
  if (!ht(e)) return null;
  const t = Uf(e.intent);
  if (!t) return null;
  const n = gt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: nt(e.damageType),
    utilityLabel: nt(e.utilityLabel) ?? n.utilityLabel,
    note: kn(e.note),
    forms: qf(e.forms)
  };
}
function Pf(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function vf(e) {
  const t = va(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = Nf(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...Of(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: xf(e, t),
    resistance: t.intent === "damage" ? Mf(e) : void 0
  };
}
function Nf(e, t) {
  const n = {
    type: "rollFormula",
    id: le,
    formula: t,
    intent: Bf(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function Of(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${le}.total`,
          ...Ff(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${le}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function Ff(e) {
  return e ? { damageType: e } : {};
}
function xf(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [le]: n
      }
    }
  };
  return xr(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [le]: t.forms.discente.formula.trim()
    }
  }), xr(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [le]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Mf(e) {
  const t = Oa(e), n = nt(t.skillResis), r = nt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = zf(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function Bf(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Uf(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function qf(e) {
  const t = gt();
  return ht(e) ? {
    base: Pt(e.base),
    discente: Pt(e.discente),
    verdadeiro: Pt(e.verdadeiro)
  } : t.forms;
}
function Pt(e) {
  return ht(e) ? { formula: kn(e.formula) } : { formula: "" };
}
function xr(e, t) {
  const n = Oa(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return jf(r);
}
function Oa(e) {
  const t = e.system;
  return ht(t) ? t : {};
}
function zf(e) {
  switch (e) {
    case "resilience":
      return "Fortitude";
    case "reflexes":
      return "Reflexos";
    case "will":
      return "Vontade";
    default:
      return e;
  }
}
function jf(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function kn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function nt(e) {
  const t = kn(e);
  return t.length > 0 ? t : null;
}
function ht(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const Mr = "occultism";
function Hf(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Vf(e) {
  const t = Hf(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await Gf(e, Mr);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await ba(n);
  const r = Yf(n);
  return {
    skill: Mr,
    skillLabel: "Ocultismo",
    roll: n,
    formula: Kf(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: Qf(n)
  };
}
async function Gf(e, t) {
  const n = e;
  if (typeof n.rollSkill != "function")
    return null;
  const r = await Promise.resolve(
    n.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return Wf(r);
}
function Wf(e) {
  return Br(e) ? e : Array.isArray(e) ? e.find(Br) ?? null : null;
}
function Br(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Kf(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Yf(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Qf(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Zf);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Zf(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function Xf(e) {
  switch (Jf(e)) {
    case "cutting":
    case "cuttingdamage":
    case "corte":
      return "Corte";
    case "impact":
    case "impactdamage":
    case "impacto":
      return "Impacto";
    case "piercing":
    case "piercingdamage":
    case "perfurante":
      return "Perfurante";
    case "ballistic":
    case "ballisticdamage":
    case "balistico":
      return "Balístico";
    case "blood":
    case "blooddamage":
    case "sangue":
      return "Sangue";
    case "death":
    case "deathdamage":
    case "morte":
      return "Morte";
    case "knowledge":
    case "knowledgedamage":
    case "conhecimento":
      return "Conhecimento";
    case "energy":
    case "energydamage":
    case "energia":
      return "Energia";
    case "fear":
    case "feardamage":
    case "medo":
      return "Medo";
    case "fire":
    case "firedamage":
    case "fogo":
      return "Fogo";
    case "cold":
    case "colddamage":
    case "frio":
      return "Frio";
    case "electric":
    case "electricdamage":
    case "eletricdamage":
    case "eletricodamage":
    case "eletricidade":
    case "eletrico":
    case "eletrica":
      return "Eletricidade";
    case "chemical":
    case "chemicaldamage":
    case "quimico":
    case "quimica":
      return "Químico";
    case "mental":
    case "mentaldamage":
      return "Mental";
    case null:
      return "Sem tipo";
    default:
      return ep(String(e ?? ""));
  }
}
function Jf(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function ep(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function tp(e) {
  return {
    header: {
      eyebrow: ln,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: ip(e.ritual)
    },
    forms: e.variantOptions.map((t) => np(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: ap(e.automationStatus ?? "assisted")
  };
}
function np(e, t) {
  const n = rp(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? op(t) : "—",
    details: n
  };
}
function rp(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function op(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function ap(e) {
  return e === "generic" ? {
    status: e,
    title: "Sem automação configurada.",
    description: "O Toolkit vai registrar a conjuração e gastar o recurso escolhido. Rolagens, dano, resistência e efeitos continuam manuais."
  } : {
    status: e,
    title: "Automação assistida disponível.",
    description: "O Toolkit vai preparar custo, rolagens e ações assistidas no card persistente do chat."
  };
}
function ip(e) {
  const t = e.system, n = [lp(t?.element), sp(t?.circle)].filter(dp);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function sp(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function lp(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (cp(e)) {
    case "blood":
    case "op.elementchoices.blood":
      return "Sangue";
    case "death":
    case "op.elementchoices.death":
      return "Morte";
    case "knowledge":
    case "op.elementchoices.knowledge":
      return "Conhecimento";
    case "energy":
    case "op.elementchoices.energy":
      return "Energia";
    case "fear":
    case "op.elementchoices.fear":
      return "Medo";
    default:
      return up(e);
  }
}
function cp(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function up(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function dp(e) {
  return typeof e == "string" && e.length > 0;
}
const Fa = ["base", "discente", "verdadeiro"];
function xa(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function rt(e) {
  return typeof e == "string" && Fa.includes(e);
}
const { ApplicationV2: mp } = foundry.applications.api;
class Ee extends mp {
  constructor(t, n) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = tp(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
  }
  resolveRequest;
  model;
  selectedVariant = "base";
  spendResource = !0;
  isResolved = !1;
  static DEFAULT_OPTIONS = {
    id: `${c}-ritual-cast`,
    classes: [c, "paranormal-toolkit-ritual-cast-app"],
    tag: "section",
    position: {
      width: 540,
      height: "auto"
    },
    window: {
      title: "Conjurar ritual",
      icon: "fa-solid fa-wand-magic-sparkles",
      resizable: !0
    },
    actions: {
      cast: Ee.onCast,
      cancel: Ee.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new Ee(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    pp(o, (a) => {
      this.selectedVariant = a;
    }), gp(o, (a) => {
      this.spendResource = a;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${k(this.model.header.eyebrow)}</p>
        <div>
          <h2>${k(this.model.header.title)}</h2>
          <p>${k(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(fp).join("")}
        </div>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--cost">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Custo</h3>
          <label class="paranormal-toolkit-ritual-cast__spend-toggle">
            <input type="checkbox" name="spendResource" ${this.model.cost.spendResourceChecked ? "checked" : ""}>
            <span>Gastar ao conjurar</span>
          </label>
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo base</dt><dd>${k(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${k(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${k(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${k(this.model.automation.title)}</strong></p>
        <p>${k(this.model.automation.description)}</p>
      </section>

      <footer class="paranormal-toolkit-ritual-cast__footer">
        <button type="button" data-action="cancel">Cancelar</button>
        <button type="button" data-action="cast" class="paranormal-toolkit-ritual-cast__cast-button">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>Conjurar</span>
        </button>
      </footer>
    `;
  }
  static async onCast(t) {
    t.preventDefault();
    const n = bp(t), r = hp(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function fp(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((a) => `<span>${k(a)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${k(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${k(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${k(e.label)}</strong>
        <em>${k(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function pp(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Ur(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Ur(e, o, t));
    });
  const r = Ma(e);
  r && t(r);
}
function Ur(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !rt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Ma(e));
}
function Ma(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && rt(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function gp(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function hp(e, t, n) {
  const r = yp(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function yp(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (rt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return rt(n) ? n : null;
}
function bp(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function k(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function Ap(e) {
  return Ee.request(e);
}
const En = {
  label: "Padrão"
}, _p = {
  label: "Discente",
  extraCost: 2
}, Tp = {
  label: "Verdadeiro",
  extraCost: 5
};
class Rp {
  constructor(t, n, r) {
    this.workflow = t, this.resources = n, this.ritualCosts = r;
  }
  workflow;
  resources;
  ritualCosts;
  canHandle(t, n) {
    return t.item.type === "ritual" || n.steps.some((r) => r.type === "spendRitualCost");
  }
  async run(t, n) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const r = this.resolveCostPreview(t), o = mg(n), a = cg(
      n,
      t.item,
      r,
      o
    ), s = await Ap({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((w) => w.name),
      cost: r,
      defaultSpendResource: bg(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = $p(s), u = pg(
      n,
      t.item,
      l.variant,
      o
    ), m = No();
    let f = null;
    if (m) {
      const w = await Cp(
        this.resources,
        t.actor,
        l,
        u,
        r
      );
      if (!w.ok)
        return {
          status: "failed",
          reason: w.reason,
          message: w.message
        };
      try {
        f = await Vf(
          t.actor
        );
      } catch (q) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: q instanceof Error ? q.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: q
        };
      }
    }
    const A = wp(
      n,
      l,
      u,
      r,
      {
        includeCostSteps: !m
      }
    );
    if (A.steps.length === 0) {
      const w = fg(
        t,
        l
      ), q = qr(
        t.actor,
        f,
        u,
        r
      ), Bn = zr(
        n,
        l,
        u,
        r,
        w,
        t,
        f
      );
      return q.length > 0 ? {
        status: "ready",
        workflowContext: w,
        actions: q,
        summaryLines: Bn
      } : {
        status: "completed-without-actions",
        workflowContext: w,
        summaryLines: Bn
      };
    }
    const T = await this.workflow.runAutomation(A, {
      sourceActor: t.actor,
      sourceToken: t.token,
      item: t.item,
      targets: t.targets,
      flags: {
        itemUse: {
          source: t.source,
          executionMode: "ask"
        },
        ritualCast: {
          variant: l.variant,
          spendResource: l.spendResource
        }
      }
    });
    if (!T.ok)
      return {
        status: "failed",
        reason: T.error.reason,
        message: T.error.message,
        cause: T.error
      };
    const R = T.value.context, g = Pp(
      n,
      t,
      R
    ), v = Ep(
      n,
      t
    ), be = qr(
      t.actor,
      f,
      u,
      r
    ), Ae = zr(
      n,
      l,
      u,
      r,
      R,
      t,
      f
    );
    if (!g.ok)
      return {
        status: "failed",
        reason: g.reason,
        message: g.message
      };
    if (!v.ok)
      return {
        status: "failed",
        reason: v.reason,
        message: v.message
      };
    const _e = [
      ...be,
      ...g.actions,
      ...v.actions
    ];
    return _e.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: R,
      summaryLines: Ae
    } : {
      status: "ready",
      workflowContext: R,
      actions: _e,
      summaryLines: Ae
    };
  }
  async applyAction(t) {
    return Je(
      this.resources,
      t.actor,
      t.resource,
      t.operation,
      t.amount
    );
  }
  resolveCostPreview(t) {
    if (!t.actor) return null;
    const n = this.ritualCosts.getCost({
      actor: t.actor,
      ritual: t.item
    });
    return n.ok ? n.value : null;
  }
}
function $p(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function wp(e, t, n, r, o) {
  const a = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || Sn(l) && (!o.includeCostSteps || !s) || a.push(kp(l, n));
  return o.includeCostSteps && s && r && Ag(n.extraCost) && a.push({
    type: "spendResource",
    actor: "self",
    resource: r.resource,
    amount: n.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: a
  };
}
async function Cp(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Oe(o, r);
  if (!a)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (a.amount <= 0) return { ok: !0 };
  const s = await e.spend(
    t,
    a.resource,
    a.amount
  );
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function kp(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function qr(e, t, n, r) {
  if (!t || t.success) return [];
  const o = Oe(r, n);
  if (!o || o.amount <= 0) return [];
  const a = e.name ?? "Ator sem nome";
  return [
    {
      kind: "resource-operation",
      actor: e,
      actorName: a,
      resource: "SAN",
      operation: "damage",
      amount: o.amount,
      label: `Aplicar ${o.amount} SAN`,
      executedLabel: "✓ Dano na SAN aplicado",
      actionSectionId: "casting-backlash",
      actionSectionTitle: "Dano na sanidade"
    }
  ];
}
function Ep(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = In(r.actor, t);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const a of o) {
      const s = wa(a);
      n.push(
        Ip(
          r,
          a,
          t.item,
          s
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function Ip(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? Lp(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: Sp(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Dp(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Sp(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Dp(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Lp(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Pp(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const s = Xe(a, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = In(a.actor, t);
    if (l.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of l) {
      if (vp(a)) {
        Np(
          o,
          u,
          Op(a, n, s.value)
        );
        continue;
      }
      r.push(xp(a, u, s.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...Fp(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function vp(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Np(e, t, n) {
  const r = qp(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Op(e, t, n) {
  const r = zp(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function Fp(e, t, n, r) {
  const o = Gp(e), a = o.length > 1 ? Yp() : void 0;
  return o.map((s) => {
    const l = r.map(
      (m, f) => {
        const A = Wp(m.amount, s);
        return {
          id: Mp(m, s, f),
          amount: A,
          damageType: m.damageType,
          sourceRollId: m.sourceRollId,
          ignoreResistance: m.step.ignoreResistance === !0
        };
      }
    ), u = l.reduce(
      (m, f) => m + f.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: l,
      label: Bp(u, s, o.length > 1),
      executedLabel: Up(
        n.name ?? "Ator sem nome",
        s,
        o.length > 1
      ),
      choiceGroupId: a,
      choiceGroupResolvedLabel: a ? "✓ Outra opção escolhida" : void 0,
      actionSectionId: "apply-damage",
      actionSectionTitle: "Aplicar danos",
      source: "item-use.damage-action",
      originUuid: t.uuid ?? null
    };
  });
}
function xp(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = Vp(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: jp(e, r, n),
    executedLabel: Hp(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function Mp(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Bp(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Up(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function qp(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function zp(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function jp(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Hp(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Vp(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Gp(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Wp(e, t) {
  const n = e * t.multiplier, r = Kp(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function Kp(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Yp() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function In(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function zr(e, t, n, r, o, a, s = null) {
  return [
    `Forma: ${xa(t.variant)}`,
    Jp(t, n, r),
    ...Xp(s),
    ...Object.values(o.rolls).flatMap(eg),
    ...Qp(e, a),
    ...tg(e.resistance),
    ...sg(n)
  ];
}
function Qp(e, t) {
  return Zp(e) ? In("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Zp(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Xp(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Jp(e, t, n) {
  const r = Oe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function eg(e) {
  const n = [`${lg(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = ng(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${Xf(e.damageType)}`), n;
}
function tg(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function ng(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const n = [];
  let r = "+";
  for (const o of t) {
    if (!o || typeof o != "object") continue;
    const a = o;
    if (a.operator === "+" || a.operator === "-") {
      r = a.operator;
      continue;
    }
    const s = rg(a);
    s && (ig(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function rg(e) {
  const t = og(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : ag(e);
}
function og(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function ag(e) {
  if (typeof e.faces == "number") return null;
  if (typeof e.number == "number" && Number.isFinite(e.number)) {
    const t = Math.abs(e.number);
    return {
      value: String(t),
      operator: e.number < 0 ? "-" : void 0
    };
  }
  return null;
}
function ig(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function sg(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function lg(e) {
  switch (e.intent) {
    case "healing":
      return "Cura";
    case "damage":
      return "Dano";
    case "resistance":
      return "Resistência";
    case "attack":
      return "Ataque";
    case "ritual":
      return "Ritual";
    case "skill":
      return "Perícia";
    case "generic":
      return "Rolagem";
  }
}
function cg(e, t, n, r) {
  return Fa.map((o) => {
    const a = Ba(
      e,
      t,
      o,
      r
    ), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? xa(o),
      enabled: s,
      details: a ? ug(a, n, r) : [],
      finalCostText: a ? dg(n, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function ug(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = Oe(t, e);
  return r.push(
    a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"
  ), r;
}
function Oe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function dg(e, t) {
  const n = Oe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function mg(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Sn);
}
function fg(e, t) {
  return $a({
    sourceActor: e.actor,
    sourceToken: e.token,
    item: e.item,
    targets: e.targets,
    flags: {
      itemUse: {
        source: e.source,
        executionMode: "ask"
      },
      ritualCast: {
        variant: t.variant,
        spendResource: t.spendResource
      }
    }
  });
}
function pg(e, t, n, r) {
  return Ba(e, t, n, r) ?? En;
}
function Ba(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? hg(t, n) ? gg(n) : null : n === "base" ? En : null);
}
function gg(e) {
  switch (e) {
    case "base":
      return En;
    case "discente":
      return _p;
    case "verdadeiro":
      return Tp;
  }
}
function hg(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return yg(foundry.utils.getProperty(e, n));
}
function yg(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function bg(e) {
  return e.steps.some(Sn);
}
function Sn(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Ag(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function _g(e, t) {
  const n = await Tg(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: $g(n),
    total: wg(n),
    diceBreakdown: Cg(n)
  };
}
function Ua(e) {
  switch (e) {
    case "resilience":
      return "Fortitude";
    case "reflexes":
      return "Reflexos";
    case "will":
      return "Vontade";
    default:
      return e;
  }
}
async function Tg(e, t) {
  const n = e;
  if (typeof n.rollSkill != "function")
    return null;
  const r = await Promise.resolve(
    n.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return Rg(r);
}
function Rg(e) {
  return jr(e) ? e : Array.isArray(e) ? e.find(jr) ?? null : null;
}
function jr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function $g(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function wg(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Cg(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(kg);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function kg(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const qa = "itemUsePrompts", za = "chatCard", yt = "data-paranormal-toolkit-prompt-id", bt = "data-paranormal-toolkit-pending-id", Dn = "data-paranormal-toolkit-executed-label", Xt = "data-paranormal-toolkit-choice-group", ja = "data-paranormal-toolkit-skipped-label", Hr = "data-paranormal-toolkit-action-section", Vr = "data-paranormal-toolkit-detail-key", Gr = "data-paranormal-toolkit-roll-card", Ln = "data-paranormal-toolkit-roll-detail-toggle", Ha = "data-paranormal-toolkit-roll-detail-id", Va = "data-paranormal-toolkit-resistance-roll-button", Ga = "data-paranormal-toolkit-resistance-skill", Wa = "data-paranormal-toolkit-resistance-skill-label", Ka = "data-paranormal-toolkit-resistance-target-actor-id", Ya = "data-paranormal-toolkit-resistance-target-name", Qa = "data-paranormal-toolkit-resistance-roll-result", Wr = "data-paranormal-toolkit-system-card-replaced", Eg = `[${bt}]`, Ig = `[${Ln}]`, Sg = `[${Va}]`, Jt = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, Dg = `${h}__actions`, Kr = `${h}__details`, Za = `${h}__summary`, Lg = `${h}__title`, Xa = `${h}__button--executed`, Yr = `${h}__roll-card`;
let Qr = !1, en = null;
const P = /* @__PURE__ */ new Map(), Pg = [0, 100, 500, 1500, 3e3], vg = 3e4, Ng = [0, 100, 500, 1500, 3e3];
function Og(e) {
  if (en = e, Qr) {
    Xr(e);
    return;
  }
  const t = (n, r) => {
    ei(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Qr = !0, Xr(e);
}
async function Zr(e) {
  const t = Ja(e);
  P.set(e.pendingId, t), await Nn(t) || di(t), ti(e.pendingId);
}
async function Fg(e) {
  const t = Ja({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await Nn(t) || di(t), ti(e.pendingId);
}
async function vt(e, t) {
  const n = P.get(e);
  P.delete(e), n && await Oh(n, t);
}
function Pn(e) {
  const t = yi();
  for (const n of t) {
    const r = U(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function xg(e, t) {
  const n = Pn(e);
  if (!n) return;
  const r = U(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await ge(n.message, r));
}
async function Mg(e, t, n) {
  if (!t) return;
  const r = Pn(e);
  if (!r) return;
  const o = U(r.message);
  let a = !1;
  for (const [s, l] of Object.entries(o))
    s !== e && l.choiceGroupId === t && (o[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await ge(r.message, o);
}
function Ja(e) {
  const t = G(e.context.message), n = e.context.targets.find((s) => on(s)), r = n ? on(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    resistanceTargetActorId: e.resistanceTargetActorId ?? o?.id ?? null,
    resistanceTargetName: a,
    resistanceRollResult: null,
    actionPayload: e.actionPayload ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: uh(e.context),
    executed: !1
  };
}
function ei(e, t, n) {
  Nh();
  const r = _t(t);
  if (!r) return;
  const o = Lh(e, r);
  o.length > 0 && ot(r);
  for (const a of o)
    tn(r, a);
  oi(r, n), nn(r), rn(r);
}
function Xr(e) {
  for (const t of Ng)
    globalThis.setTimeout(() => {
      Bg(e);
    }, t);
}
function Bg(e) {
  for (const t of Ug()) {
    const n = At(t);
    qg(n) && ei(n, t, e);
  }
}
function Ug() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function qg(e) {
  return e ? On(e) ? !0 : xh(e).length > 0 : !1;
}
function ti(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? Ph(t.messageId) : null;
  if (n) {
    ro(n, t), ot(n), tn(n, t), Jr(n), nn(n), rn(n);
    return;
  }
  if (t.messageId) {
    sn(t);
    return;
  }
  const r = vh(t);
  if (r) {
    ro(r, t), ot(r), tn(r, t), Jr(r), nn(r), rn(r);
    return;
  }
  sn(t);
}
function Jr(e) {
  en && oi(e, en);
}
function ot(e) {
  const t = zg();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = ri(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Wr) === "true") return;
  const r = n.querySelector(`.${Jt}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Wr, "true");
}
function zg() {
  try {
    return Es() === "replace";
  } catch {
    return !1;
  }
}
function tn(e, t) {
  if (ot(e), e.querySelector(`[${yt}="${he(t.pendingId)}"]`)) return;
  const n = jg(e, t);
  Vg(n, t), ah(n, ih(t)).append(ch(t));
}
function jg(e, t) {
  const n = e.querySelector(`.${Jt}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Jt, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Lg), s.textContent = Hg(t);
  const l = document.createElement("span");
  return l.classList.add(Za), l.textContent = t.summary, o.append(a, s, l), r.append(o), mh(e).append(r), r;
}
function Hg(e) {
  const t = E(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Vg(e, t) {
  const n = t.summaryLines ?? [], r = li(n, t);
  if (r) {
    Gg(e, r, t);
    return;
  }
  sh(e, n);
}
function Gg(e, t, n) {
  if (e.querySelector(`[${Gr}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Yr, `${Yr}--${t.intent}`), r.setAttribute(Gr, "true"), t.castingCheck && eo(r, Kg(t.castingCheck), n.pendingId, "casting"), Wg(t) && eo(r, Yg(t), n.pendingId, "effect"), eh(r, t), th(r, t, n), oh(r, t), e.append(r);
}
function Wg(e) {
  return e.intent !== "casting";
}
function Kg(e) {
  const t = e.success ? "Sucesso" : "Falha";
  return {
    kind: "casting",
    title: "Conjuração",
    label: e.label,
    formula: e.formula,
    total: e.total,
    diceBreakdown: e.diceBreakdown,
    status: e.success ? "success" : "failure",
    statusLabel: t,
    description: `${e.label}: ${e.total} vs DT ${e.difficulty}`,
    detailRows: [
      { label: "Perícia", value: e.label },
      { label: "DT", value: String(e.difficulty) },
      { label: "Resultado", value: t },
      { label: "Fórmula", value: e.formula },
      ...e.diceBreakdown ? [{ label: "Dados", value: e.diceBreakdown }] : []
    ]
  };
}
function Yg(e) {
  const t = e.intent === "healing" ? "Cura" : e.intent === "damage" ? "Dano" : e.label, n = e.damageType ? `${e.damageType}` : null;
  return {
    kind: "effect",
    title: t,
    label: e.label,
    formula: e.formula,
    total: e.total,
    diceBreakdown: e.diceBreakdown,
    description: n,
    detailRows: [
      { label: "Fórmula", value: e.formula },
      ...e.diceBreakdown ? [{ label: "Dados", value: e.diceBreakdown }] : [],
      ...e.damageType ? [{ label: "Tipo", value: e.damageType }] : []
    ]
  };
}
function eo(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${h}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, a.append(s), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, a.append(l);
  }
  if (o.append(a), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, o.append(l);
  }
  Qg(o, t), rh(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Qg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = Zg(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function Zg(e, t) {
  const n = Xg(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of Jg(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function Xg(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Jg(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? to(e, "highest") : n.includes("kl") ? to(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function to(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function eh(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(ty);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function th(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = nh(t, n);
  o.append(a), s && o.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(o, l), t.resistanceRollResult && r.append(ni(t.resistanceRollResult)), e.append(r);
}
function nh(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(yt, t.pendingId), n.setAttribute(Va, "true"), n.setAttribute(Ga, e.resistanceSkill), n.setAttribute(Wa, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Ka, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Ya, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Qa, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function ni(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = ii(e), t;
}
function rh(e, t, n, r, o) {
  const a = t.filter((m) => m.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Ln, s), l.setAttribute("aria-expanded", "false"), l.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(Ha, s), u.hidden = !0;
  for (const m of a) {
    const f = document.createElement("dt");
    f.textContent = m.label;
    const A = document.createElement("dd");
    A.textContent = m.value, u.append(f, A);
  }
  e.append(l, u);
}
function oh(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function ah(e, t) {
  const n = `[${Hr}="${he(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Dg), o.setAttribute(Hr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function ih(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = li(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function sh(e, t) {
  if (t.length === 0) return;
  const n = lh(e);
  for (const r of t) {
    const o = ny(r);
    if (n.querySelector(`[${Vr}="${he(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(Vr, o), n.append(a);
  }
}
function lh(e) {
  const t = e.querySelector(`.${Kr}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Kr), e.append(n), n;
}
function ch(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(yt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Xa), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(bt, e.pendingId), t.setAttribute(Dn, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Xt, e.choiceGroupId), t.setAttribute(ja, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function uh(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = dh(e);
  return `${t} → ${n}`;
}
function dh(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function mh(e) {
  return ri(e) ?? e;
}
function ri(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function oi(e, t) {
  const n = _t(e);
  if (!n) return;
  const r = n.querySelectorAll(Eg);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      kh(o, t);
    }));
}
function nn(e) {
  const t = _t(e);
  if (!t) return;
  const n = t.querySelectorAll(Ig);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      fh(t, r);
    }));
}
function rn(e) {
  const t = _t(e);
  if (!t) return;
  const n = t.querySelectorAll(Sg);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      ph(t, r);
    }));
}
function fh(e, t) {
  const n = t.getAttribute(Ln);
  if (!n) return;
  const r = e.querySelector(`[${Ha}="${he(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function ph(e, t) {
  const n = t.getAttribute(yt), r = t.getAttribute(Ga), o = t.getAttribute(Wa) ?? (r ? Ua(r) : "Resistência");
  if (!n || !r) return;
  const a = yh(e, n), s = bh(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await _g(s, r);
    await $h(u.roll);
    const m = {
      skill: r,
      skillLabel: o,
      formula: u.formula,
      total: u.total,
      targetName: s.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: u.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    gh(t, m), hh(t, m), wh(n, m), await Ch(e, n, m);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function gh(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Qa, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function hh(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? ni(t);
  if (r) {
    r.textContent = ii(t);
    return;
  }
  n.append(o);
}
function yh(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = At(e);
  return U(r)[t] ?? null;
}
function bh(e, t) {
  const n = e?.resistanceTargetActor;
  if (F(n)) return n;
  const o = e?.context?.targets.map(on).find(F) ?? null;
  if (o) return o;
  const a = t.getAttribute(Ka) ?? e?.resistanceTargetActorId ?? null, s = a ? _h(a) : null;
  return s || Th(
    t.getAttribute(Ya) ?? e?.resistanceTargetName ?? Ah(t)
  );
}
function Ah(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Za}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function on(e) {
  const t = e.actor;
  if (F(t)) return t;
  const n = e.token, r = Le(n);
  if (r) return r;
  const o = e.document;
  return Le(o);
}
function Le(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (F(t)) return t;
  const n = e.document?.actor;
  return F(n) ? n : null;
}
function _h(e) {
  const n = game.actors?.get?.(e);
  return F(n) ? n : ai().map((a) => Le(a)).find((a) => a?.id === e) ?? null;
}
function Th(e) {
  const t = ce(e);
  if (!t) return null;
  const n = ai().filter((a) => ce(Rh(a)) === t).map((a) => Le(a)).find(F) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => F(a) && ce(a.name) === t);
  return F(o) ? o : null;
}
function ai() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Rh(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Le(e)?.name ?? null;
}
function ce(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function F(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ii(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function $h(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function wh(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function Ch(e, t, n) {
  const r = At(e);
  if (r)
    try {
      const o = U(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await ge(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function At(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return B(r?.get?.(n));
}
async function kh(e, t) {
  const n = e.getAttribute(bt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    si(e, e.getAttribute(Dn) ?? "✓ Automação aplicada"), Eh(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function si(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Xa), e.removeAttribute(bt), e.removeAttribute(Dn);
}
function Eh(e) {
  const t = e.getAttribute(Xt);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Xt}="${he(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(ja) ?? "✓ Outra opção escolhida";
    si(o, a);
  }
}
function li(e, t) {
  const n = e.map(vn).filter(Jh), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = E(e, "Forma"), a = E(e, "Custo"), s = E(e, "Dados") ?? E(e, `Dados (${r.label})`), l = E(e, "Tipo"), u = E(e, "Resistência"), m = E(e, "Resistência Perícia"), f = E(e, "Resistência Rótulo") ?? (m ? Ua(m) : null), A = ci(e, "Observação"), T = e.filter((g) => Dh(g, r)), R = Ih(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: s,
    damageType: l,
    resistance: u,
    resistanceSkill: m,
    resistanceSkillLabel: f,
    notes: A,
    details: T,
    castingCheck: R,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function Ih(e) {
  const t = e.map(vn).find((a) => a?.intent === "casting") ?? null, n = E(e, "Conjuração DT"), r = E(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: E(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: E(e, "Dados (Conjuração)")
  } : null;
}
function vn(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: Sh(n)
  } : null;
}
function Sh(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function E(e, t) {
  return ci(e, t)[0] ?? null;
}
function ci(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Dh(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || vn(e) ? !1 : e.trim().length > 0;
}
function Lh(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    an(r, e, t) && n.set(r.pendingId, r);
  for (const r of Fh(e))
    an(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function an(e, t, n) {
  const r = G(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !no(n, "itemId", e.itemId) ? !1 : !e.actorId || no(n, "actorId", e.actorId);
}
function no(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${ry(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Ph(e) {
  const t = he(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function vh(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (an(e, null, t))
      return t;
  return null;
}
function Nh() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function ro(e, t) {
  const n = At(e);
  if (!n) return !1;
  try {
    const r = U(n);
    return r[t.pendingId] = Fn(t, G(n)), await ge(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Nn(e) {
  const t = pi(e);
  if (!t) return !1;
  try {
    const n = U(t);
    return n[e.pendingId] = Fn(e, G(t)), await ge(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function di(e) {
  for (const t of Pg)
    globalThis.setTimeout(() => {
      sn(e);
    }, t);
}
async function sn(e) {
  const t = pi(e);
  if (On(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await Nn(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function Oh(e, t) {
  const n = fi(e.context.message);
  if (n)
    try {
      const r = U(n), o = r[e.pendingId] ?? Fn(e, G(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await ge(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function Fh(e) {
  return Object.values(U(B(e))).filter(Fe);
}
function U(e) {
  if (!e) return {};
  const t = {}, n = On(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(mi(e)))
    t[r] ??= o;
  return t;
}
function xh(e) {
  return Object.values(mi(B(e))).filter(Fe);
}
function mi(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, qa);
  if (!me(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Fe(o) && (n[r] = o);
  return n;
}
async function ge(e, t) {
  typeof e.setFlag == "function" && (await Bh(e, t), await Mh(e, t));
}
async function Mh(e, t) {
  await Promise.resolve(e.setFlag?.(c, qa, t));
}
function On(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, za);
  return Zh(t) ? t : null;
}
async function Bh(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Fe).sort((a, s) => a.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((a) => a.createdAt)),
    messageId: r.messageId ?? G(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: Uh(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(c, za, o));
}
function Uh(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Fn(e, t) {
  return {
    schemaVersion: 1,
    pendingId: e.pendingId,
    mode: e.mode,
    title: e.title,
    buttonLabel: e.buttonLabel,
    executedLabel: e.executedLabel,
    summaryLines: e.summaryLines ? [...e.summaryLines] : void 0,
    createdAt: e.createdAt,
    messageId: t ?? e.messageId,
    itemId: e.itemId,
    actorId: e.actorId,
    itemName: e.itemName,
    resistanceTargetActorId: e.resistanceTargetActorId,
    resistanceTargetName: e.resistanceTargetName,
    resistanceRollResult: e.resistanceRollResult ?? null,
    actionPayload: e.actionPayload ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: e.summary,
    executed: e.executed
  };
}
function fi(e) {
  const t = B(e);
  if (t?.setFlag)
    return t;
  const n = qh(e);
  if (n?.setFlag)
    return n;
  const r = G(e);
  if (!r) return null;
  const o = game.messages;
  return B(o?.get?.(r));
}
function qh(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(B).find((n) => typeof n?.setFlag == "function") ?? null;
}
function pi(e) {
  const t = fi(e.context.message);
  if (t) return t;
  const n = e.messageId ? zh(e.messageId) : null;
  if (n) return n;
  const r = yi().slice().reverse();
  return r.find((o) => jh(o, e)) ?? r.find((o) => Hh(o, e)) ?? null;
}
function zh(e) {
  const t = game.messages;
  return B(t?.get?.(e));
}
function jh(e, t) {
  const n = G(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!gi(e, t)) return !1;
  const o = hi(e);
  return !t.actorId || !o || o === t.actorId;
}
function Hh(e, t) {
  if (!Gh(e, t)) return !1;
  const n = hi(e);
  return t.actorId && n === t.actorId ? !0 : gi(e, t);
}
function gi(e, t) {
  const n = ce(Vh(e));
  if (!n) return !1;
  const r = ce(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = ce(t.itemId);
  return !!(o && n.includes(o));
}
function Vh(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function hi(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Gh(e, t) {
  const n = Wh(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= vg;
}
function Wh(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function B(e) {
  return e && typeof e == "object" ? e : null;
}
function Fe(e) {
  return me(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && Z(e.resistanceTargetActorId) && Z(e.resistanceTargetName) && Xh(e.resistanceRollResult) && Kh(e.actionPayload) && Nt(e.title) && Nt(e.buttonLabel) && Nt(e.executedLabel) && Z(e.choiceGroupId) && Z(e.skippedLabel) && Z(e.actionSectionId) && Z(e.actionSectionTitle) && ey(e.summaryLines) : !1;
}
function Kh(e) {
  return e == null ? !0 : me(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && Yh(e.resource) && Qh(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Yh(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Qh(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Zh(e) {
  return me(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && me(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Fe) : !1;
}
function Xh(e) {
  return e == null ? !0 : me(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Jh(e) {
  return e !== null;
}
function me(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function S(e) {
  return e === null || typeof e == "string";
}
function Nt(e) {
  return e === void 0 || typeof e == "string";
}
function Z(e) {
  return e == null || typeof e == "string";
}
function ey(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function ty(e) {
  return typeof e == "string" && e.length > 0;
}
function yi() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(B).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(B).filter((r) => r !== null) : [];
}
function _t(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function G(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function ny(e) {
  return e.trim().toLowerCase();
}
function ry(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function he(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const oo = 1e3;
class oy {
  constructor(t, n, r, o, a, s) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = s, this.ritualAssistant = new Rp(
      t,
      n,
      r
    );
  }
  workflow;
  resources;
  damage;
  conditions;
  debugOutput;
  strategies = [];
  recentExecutionKeys = /* @__PURE__ */ new Map();
  pendingExecutions = /* @__PURE__ */ new Map();
  ritualAssistant;
  lastAttempt = null;
  promptRendererRegistered = !1;
  addStrategy(t) {
    this.strategies.push(t);
  }
  registerStrategies() {
    for (const t of this.strategies)
      t.register();
    this.registerPromptRenderer();
  }
  status() {
    return {
      settings: Gn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Gn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = cn(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && my(t.item) && n.executionMode === "ask") {
        await this.handleGenericRitual(t);
        return;
      }
      const o = r.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, o, r.error.reason), r.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: r.error.message,
        data: r.error
      });
      return;
    }
    if (await Fr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: xt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(t), n.executionMode) {
      case "ask":
        await this.handleAskMode(t, r.value);
        return;
      case "automatic":
        await this.executeAutomation(t, r.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const n = this.pendingExecutions.get(t);
    if (!n)
      return this.executePersistedPendingAutomation(t);
    if (n.kind === "workflow")
      return this.pendingExecutions.delete(t), await vt(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await vt(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Pn(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = gy(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await Je(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await xg(t), await Mg(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Og(
      (t) => this.executePendingAutomation(t)
    ), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, n) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await Fr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: xt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      fy(t.item)
    );
  }
  async handleAssistedRitual(t, n) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const r = await this.ritualAssistant.run(t, n);
    switch (r.status) {
      case "cancelled":
        this.setAttempt(t, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(t, "failed", r.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: r.message,
          data: r.cause ?? r
        }), ui.notifications?.warn(`Paranormal Toolkit: ${r.message}`);
        return;
      case "completed-without-actions":
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), d.info(
          "Ritual assistido concluído sem ações pendentes.",
          ee(r.workflowContext)
        );
        return;
      case "ready":
        await this.registerAssistedActions(
          t,
          r.workflowContext,
          r.actions,
          r.summaryLines
        );
        return;
    }
  }
  async executeAssistedAction(t, n) {
    if (t.kind === "resource-operation") {
      const o = await this.ritualAssistant.applyAction(t);
      return o.ok ? (n.resourceTransactions.push(o.value), { ok: !0 }) : (this.handleResourceActionFailure(o), { ok: !1 });
    }
    if (t.kind === "damage-application") {
      const o = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return o.ok ? (dy(n, o.value), await ay(o.value), {
        ok: !0,
        executedLabel: iy(o.value)
      }) : (this.handleDamageActionFailure(o.error), { ok: !1 });
    }
    const r = await this.conditions.applyCondition({
      actor: t.actor,
      conditionId: t.conditionId,
      duration: t.duration,
      originUuid: t.originUuid,
      source: t.source ?? "item-use.condition-action"
    });
    return r.ok ? (r.value.warning && ui.notifications?.warn(`Paranormal Toolkit: ${r.value.warning}`), { ok: !0 }) : (this.handleConditionActionFailure(r), { ok: !1 });
  }
  async resolveAlternativeActions(t) {
    const n = Ot(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && Ot(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== t.id && (this.pendingExecutions.delete(o), await vt(
        o,
        io(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Mt();
    await Fg({
      pendingId: r,
      context: t,
      mode: "ask",
      title: "Paranormal Toolkit · Ritual",
      buttonLabel: "Ritual conjurado",
      executedLabel: "✓ Ritual conjurado",
      actionSectionId: "ritual-log",
      actionSectionTitle: "Registro",
      summaryLines: n
    });
  }
  async registerAssistedActions(t, n, r, o) {
    let a;
    for (const s of r) {
      const l = Mt();
      a ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Zr({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Ot(s),
        skippedLabel: io(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: py(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      a
    ), d.info(
      "Ritual assistido preparado com ações pendentes.",
      ee(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = Mt();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Zr({
      pendingId: r,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", r);
  }
  async executeAutomation(t, n, r) {
    this.setAttempt(t, "running");
    const o = await this.workflow.runAutomation(n, {
      sourceActor: t.actor,
      sourceToken: t.token,
      item: t.item,
      targets: t.targets,
      flags: {
        itemUse: {
          source: t.source,
          executionMode: r
        }
      }
    });
    if (!o.ok) {
      this.setAttempt(t, "failed", o.error.reason), this.handleAutomationFailure(o.error);
      return;
    }
    this.setAttempt(t, "completed"), d.info(
      "Automação executada por uso normal de item.",
      ee(o.value.context)
    );
  }
  handleAutomationFailure(t) {
    const n = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      d.warn(n, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      d.error(n, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    d.warn(n, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    d.warn(
      `Ação assistida falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  handleDamageActionFailure(t) {
    d.warn(`Ação assistida de dano falhou: ${t.message}`, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleConditionActionFailure(t) {
    d.warn(
      `Ação assistida de condição falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const n = Date.now(), r = so(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      n - s > oo && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= oo;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(so(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = xt(
      t,
      n,
      r,
      o
    );
  }
}
async function ay(e) {
  const t = uy();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: sy(e)
      });
    } catch (n) {
      d.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function iy(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function sy(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Ye(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = ly(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Ye(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${Ye(e.actorName)}</strong></p>
      <ul>
        ${t}
        ${n}
        ${r}
        ${o}
        ${a}
      </ul>
    </div>
  `;
}
function ly(e) {
  const t = cy(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Ye(o)}</li>`;
}
function cy(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = ao(n?.value);
  return r === null ? null : {
    value: r,
    max: ao(n?.max)
  };
}
function ao(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function uy() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function Ye(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function Ot(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function io(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function dy(e, t) {
  for (const n of t.instances)
    e.damageInstances.push({
      id: n.id,
      source: "ritual",
      sourceId: t.originUuid,
      sourceName: t.source ?? "Dano assistido",
      targetActorId: t.actorId,
      targetActorName: t.actorName,
      rollId: n.sourceRollId ?? void 0,
      damageType: n.damageType ?? n.systemDamageType ?? void 0,
      rawAmount: n.inputAmount,
      resistance: n.blocked > 0 ? n.blocked : void 0,
      finalAmount: n.finalDamage,
      appliedAmount: n.finalDamage,
      tags: ["ordem-apply-damage"]
    });
}
function my(e) {
  return e.type === "ritual";
}
function fy(e) {
  return vf(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function py(e) {
  return e.kind === "damage-application" || e.kind !== "resource-operation" ? null : {
    kind: "resource-operation",
    actorId: e.actor.id ?? null,
    actorUuid: e.actor.uuid ?? null,
    actorName: e.actorName,
    resource: e.resource,
    operation: e.operation,
    amount: e.amount
  };
}
function gy(e) {
  const t = e.actorUuid ? hy(e.actorUuid) : null;
  if (fe(t)) return t;
  const n = e.actorId ? yy(e.actorId) : null;
  return n || by(e.actorName);
}
function hy(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function yy(e) {
  const n = game.actors?.get?.(e);
  if (fe(n)) return n;
  for (const r of bi()) {
    const o = xn(r);
    if (o?.id === e) return o;
  }
  return null;
}
function by(e) {
  const t = Ft(e);
  if (!t) return null;
  for (const o of bi()) {
    const a = Ay(o);
    if (Ft(a) === t) {
      const s = xn(o);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (o) => fe(o) && Ft(o.name) === t
  );
  return fe(r) ? r : null;
}
function bi() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ay(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : xn(e)?.name ?? null;
}
function xn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (fe(t)) return t;
  const n = e.document?.actor;
  return fe(n) ? n : null;
}
function Ft(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function fe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function xt(e, t, n, r) {
  return {
    source: e.source,
    status: t,
    reason: n,
    pendingId: r,
    itemId: e.item.id ?? null,
    itemName: e.item.name ?? "Item sem nome",
    itemType: e.item.type ?? "unknown",
    itemUuid: e.item.uuid ?? null,
    actorId: e.actor?.id ?? null,
    actorName: e.actor?.name ?? null,
    targetCount: e.targets.length,
    timestamp: Date.now()
  };
}
function so(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Mt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class _y {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = ve(t);
    for (const s of n) {
      const l = s.itemId ? a.find((f) => f.id === s.itemId) ?? null : null, u = s.match?.preset ?? null;
      if (!l || !u) {
        o.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(l, u);
      const m = await this.itemPatches.applyPresetItemPatch(l, u);
      r.push({
        itemId: l.id ?? null,
        itemName: l.name ?? "Ritual sem nome",
        presetId: u.id,
        presetLabel: u.label,
        previousStatus: s.status,
        itemPatch: m
      });
    }
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      applied: r,
      skipped: o
    };
  }
}
class Ty {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = ve(t).map((l) => this.analyzeRitual(l)), r = n.filter(Ve("upToDate")), o = n.filter(Ve("available")), a = n.filter(Ve("outdated")), s = n.filter(Ve("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: o,
      outdated: a,
      unsupported: s,
      canApply: o.length > 0 || a.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = Ry(t);
    return n ? r ? r.source.type !== "preset" ? Te({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? Te({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : Te({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: $y(r, n.preset)
    }) : Te({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : Te({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Te(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? st(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function Ry(e) {
  const t = e.getFlag(c, "automation");
  return un(t) ? t : null;
}
function $y(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Ve(e) {
  return (t) => t.status === e;
}
class wy {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = mn(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: n,
      data: r,
      flags: {
        [c]: {
          resourceTransaction: r
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, n) {
    const r = this.createWorkflowSummaryContent(t, n), o = ee(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: r,
      data: o,
      flags: {
        [c]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const n = _(t.actorName), r = _(t.resource), o = _(lo(t)), a = _(ky(t));
    return `
      <section class="${c}-card ${c}-resource-card">
        <header class="${c}-card__header">
          <strong>${o}</strong>
          <span>${n}</span>
        </header>
        <div class="${c}-card__body">
          <p><strong>${a}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, n) {
    const r = _(n.title ?? "Automação"), o = n.message ? `<p>${_(n.message)}</p>` : "", a = _(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = _(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((g) => _(g.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map(
      (g) => `<li><strong>${_(g.id)}:</strong> ${_(g.formula)} = ${g.total} <em>(${_(Cy(g.intent))})</em>${g.damageType ? ` — ${_(g.damageType)}` : ""}</li>`
    ), m = t.ritualCosts.map(
      (g) => `<li><strong>${_(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${_(g.resource)} (${_(Ey(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${_(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${_(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (g) => `<li><strong>${_(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${_(g.actorName)}:</strong> ${_(lo(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), R = t.phases.map((g) => _(g)).join(" &rarr; ");
    return `
      <section class="${c}-card ${c}-workflow-card">
        <header class="${c}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${c}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${m.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${m.join("")}</ul>` : ""}
          ${u.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Dano:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Cura:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${R}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Cy(e) {
  switch (e) {
    case "damage":
      return "dano";
    case "healing":
      return "cura";
    case "attack":
      return "ataque";
    case "resistance":
      return "resistência";
    case "skill":
      return "perícia";
    case "ritual":
      return "ritual";
    default:
      return "genérica";
  }
}
function lo(e) {
  switch (e.operation) {
    case "spend":
      return `Gasto de ${e.resource}`;
    case "damage":
      return `Dano em ${e.resource}`;
    case "heal":
      return `Cura de ${e.resource}`;
    case "recover":
      return `Recuperação de ${e.resource}`;
  }
}
function ky(e) {
  switch (e.operation) {
    case "spend":
      return `${e.resource} gasto`;
    case "damage":
      return "Dano aplicado";
    case "heal":
      return "Cura aplicada";
    case "recover":
      return "Recuperação aplicada";
  }
}
function Ey(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function _(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function Iy() {
  const e = new Uu(), t = new Od(e), n = new Ou(), r = new ju(), o = new Gu(r), a = new id(e), s = new ld(), l = s.registerMany(
    as()
  );
  if (!l.ok)
    throw new Error(l.error.message);
  const u = new sd(), m = new od(), f = uf(), A = new em(f), T = new Ty(
    s
  ), R = new _y(
    T,
    u,
    m
  ), g = new Bd(), v = new wy(g), be = new Md(), Ae = new vd(
    t,
    o,
    v,
    be
  ), _e = new xd(Ae, be), w = new oy(
    _e,
    t,
    o,
    n,
    A,
    g
  );
  return w.addStrategy(
    new nd(
      (q) => w.handleItemUsed(q)
    )
  ), {
    ordem: a,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: o,
    resources: t,
    damage: n,
    automationRegistry: s,
    automationBinder: u,
    itemPatches: m,
    conditionRegistry: f,
    conditions: A,
    debugOutput: g,
    chatMessages: v,
    workflowHooks: be,
    automation: Ae,
    workflow: _e,
    itemUseIntegration: w,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: R
  };
}
const { ApplicationV2: Sy } = foundry.applications.api;
class at extends Sy {
  constructor(t, n) {
    super({
      id: `${c}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Presets de rituais: ${t.name ?? "Ator"}`
      }
    }), this.actor = t, this.services = n;
  }
  actor;
  services;
  isApplying = !1;
  lastApplicationResult = null;
  static DEFAULT_OPTIONS = {
    id: `${c}-ritual-preset-manager`,
    classes: [c, "paranormal-toolkit-ritual-preset-manager"],
    tag: "section",
    position: {
      width: 560,
      height: "auto"
    },
    window: {
      title: "Gerenciar presets de rituais",
      icon: "fa-solid fa-wand-magic-sparkles",
      resizable: !0
    },
    actions: {
      apply: at.onApply,
      cancel: at.onCancel
    }
  };
  async _renderHTML(t, n) {
    const r = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), o = document.createElement("div");
    return o.className = "paranormal-toolkit-preset-manager", o.innerHTML = this.renderContent(r), o;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${N(ln)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${N(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Bt("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Bt("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Bt("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
      </div>

      <footer class="paranormal-toolkit-preset-manager__footer">
        <button type="button" data-action="cancel">Cancelar</button>
        <button type="button" data-action="apply" ${t.canApply && !this.isApplying ? "" : "disabled"}>
          ${this.isApplying ? "Aplicando..." : "Aplicar"}
        </button>
      </footer>
    `;
  }
  renderSummary(t) {
    return `
      <div class="paranormal-toolkit-preset-manager__summary" aria-label="Resumo dos presets">
        <span><strong>${t.available.length}</strong> prontos</span>
        <span><strong>${t.outdated.length}</strong> desatualizados</span>
        <span><strong>${t.upToDate.length}</strong> automatizados</span>
      </div>
    `;
  }
  renderLastResult() {
    if (!this.lastApplicationResult) return "";
    const t = this.lastApplicationResult.applied.length, n = this.lastApplicationResult.skipped.length, r = n > 0 ? ` ${n} pendente(s) não puderam ser aplicados.` : "";
    return `
      <div class="paranormal-toolkit-preset-manager__result">
        <strong>Aplicação concluída.</strong>
        <span>${t} preset(s) aplicado(s).${r}</span>
      </div>
    `;
  }
  static async onApply(t) {
    if (t.preventDefault(), !game.user?.isGM) {
      ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode aplicar presets de rituais.");
      return;
    }
    if (!(!this.services.ritualPresetDiagnostic.analyzeActor(this.actor).canApply || this.isApplying)) {
      this.isApplying = !0, await this.render({ force: !0 });
      try {
        this.lastApplicationResult = await this.services.ritualPresetApplications.applyPending(this.actor);
        const r = this.lastApplicationResult.applied.length;
        ui.notifications?.info(`Paranormal Toolkit: ${r} preset(s) aplicado(s) em ${this.actor.name ?? "ator"}.`);
      } finally {
        this.isApplying = !1, await this.render({ force: !0 });
      }
    }
  }
  static async onCancel(t) {
    t.preventDefault(), await this.close();
  }
}
function Bt(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${N(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Dy(n) : Py(t)}
    </section>
  `;
}
function Dy(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Ly).join("")}</ol>`;
}
function Ly(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${N(e.appliedPresetId)} v${N(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${N(e.itemName)}</strong>
        <span>${N(e.reason)}</span>
        ${r}
      </div>
      <em>${N(n)}</em>
    </li>
  `;
}
function Py(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${N({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function N(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const it = `${c}.manageRitualPresets`, co = `__${c}_ritualPresetHeaderControlRegistered`, vy = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Ny(e) {
  const t = globalThis;
  if (!t[co]) {
    for (const n of vy)
      Hooks.on(n, (r, o) => {
        Oy(r, o, e);
      });
    t[co] = !0, d.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Oy(e, t, n) {
  Array.isArray(t) && xy(e) && (Fy(e, n), !t.some((r) => r.action === it) && t.push({
    action: it,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Ai(e, n);
    }
  }));
}
function Fy(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[it] && (e.options.actions[it] = (n) => {
    n.preventDefault(), n.stopPropagation(), Ai(e, t);
  }));
}
function xy(e) {
  if (!game.user?.isGM) return !1;
  const t = _i(e);
  return t ? t.type === "agent" && ve(t).length > 0 : !1;
}
function Ai(e, t) {
  const n = _i(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new at(n, t).render({ force: !0 });
}
function _i(e) {
  return uo(e.actor) ? e.actor : uo(e.document) ? e.document : null;
}
function uo(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Ti = "data-paranormal-toolkit-ritual-roll-config", xe = "data-paranormal-toolkit-ritual-roll-field", te = "data-paranormal-toolkit-ritual-roll-action", mo = `__${c}_ritualRollConfigBlockRegistered`, My = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], By = [
  { value: "cutting", label: "Corte" },
  { value: "impact", label: "Impacto" },
  { value: "piercing", label: "Perfurante" },
  { value: "ballistic", label: "Balístico" },
  { value: "blood", label: "Sangue" },
  { value: "death", label: "Morte" },
  { value: "knowledge", label: "Conhecimento" },
  { value: "energy", label: "Energia" },
  { value: "fear", label: "Medo" },
  { value: "fire", label: "Fogo" },
  { value: "cold", label: "Frio" },
  { value: "electric", label: "Eletricidade" },
  { value: "chemical", label: "Químico" },
  { value: "mental", label: "Mental" }
];
function Uy() {
  const e = globalThis;
  if (!e[mo]) {
    qy();
    for (const t of My)
      Hooks.on(t, (...n) => {
        zy(n[0], n[1]);
      });
    e[mo] = !0, d.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function qy() {
  const e = `${c}-ritual-roll-config-inline-style`;
  if (document.getElementById(e)) return;
  const t = document.createElement("style");
  t.id = e, t.textContent = `
.${c}-ritual-roll-config {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  border: 1px solid rgba(89, 36, 42, 0.28);
  border-left: 4px solid rgba(89, 36, 42, 0.78);
  border-radius: 8px;
  padding: 10px;
  background: linear-gradient(180deg, rgba(248, 244, 237, 0.96), rgba(234, 226, 214, 0.98));
  color: rgba(24, 19, 18, 0.94);
}
.${c}-ritual-roll-config__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.${c}-ritual-roll-config__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.${c}-ritual-roll-config__title strong {
  color: rgba(89, 36, 42, 0.96);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}
.${c}-ritual-roll-config__title span {
  font-size: 0.9rem;
  font-weight: 800;
}
.${c}-ritual-roll-config__badge {
  border: 1px solid rgba(89, 36, 42, 0.25);
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.36);
  color: rgba(89, 36, 42, 0.9);
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
}
.${c}-ritual-roll-config__hint,
.${c}-ritual-roll-config__status {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.35;
  opacity: 0.8;
}
.${c}-ritual-roll-config__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.${c}-ritual-roll-config__forms-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.${c}-ritual-roll-config__forms-title {
  color: rgba(24, 19, 18, 0.9);
  font-size: 0.8rem;
  font-weight: 900;
}
.${c}-ritual-roll-config__forms-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.${c}-ritual-roll-config__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: left;
}
.${c}-ritual-roll-config__field input,
.${c}-ritual-roll-config__field select,
.${c}-ritual-roll-config__field textarea {
  width: 100%;
  min-width: 0;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
}
.${c}-ritual-roll-config__field textarea {
  resize: vertical;
}
.${c}-ritual-roll-config__field small {
  color: rgba(89, 36, 42, 0.78);
  font-size: 0.72rem;
  font-weight: 700;
}
.${c}-ritual-roll-config__form-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 7px;
  padding: 7px;
  background: rgba(255, 255, 255, 0.28);
}
.${c}-ritual-roll-config__form-card:has(input:disabled) {
  opacity: 0.72;
}
.${c}-ritual-roll-config__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.${c}-ritual-roll-config__actions button {
  width: auto;
  margin: 0;
}
.${c}-ritual-roll-config [hidden] {
  display: none !important;
}
@media (max-width: 620px) {
  .${c}-ritual-roll-config__fields,
  .${c}-ritual-roll-config__forms-grid {
    grid-template-columns: 1fr;
  }
}
`, document.head.append(t);
}
function zy(e, t) {
  const n = nb(e);
  if (!n || n.type !== "ritual") return;
  const r = ab(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  Hy(o);
  const a = $i(n), s = Na(n), l = rb(n), u = Vy(n, s, a, l);
  Zy(u, n, a, l), jy(o, u), Mn(u);
}
function jy(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function Hy(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Ti}]`)))
    t.remove();
}
function Vy(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${c}-ritual-roll-config`), o.setAttribute(Ti, e.uuid ?? e.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${c}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${c}-ritual-roll-config__title`), s.append(fo("strong", "Paranormal Toolkit")), s.append(fo("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${c}-ritual-roll-config__badge`), l.textContent = Ci(t) ? "Configurada" : "Rascunho", a.append(s, l), o.append(a);
  const u = document.createElement("p");
  u.classList.add(`${c}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const m = document.createElement("div");
  m.classList.add(`${c}-ritual-roll-config__fields`), m.append(Gy(t, r)), m.append(Wy(t, r)), m.append(Ky(t, r)), o.append(m), o.append(Yy(t, n, r)), o.append(Qy(r));
  const f = document.createElement("p");
  return f.classList.add(`${c}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function Gy(e, t) {
  const n = Tt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(xe, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = Pf(o), a.selected = e.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function Wy(e, t) {
  const n = Tt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(xe, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const a of By) {
    const s = document.createElement("option");
    s.value = a.value, s.textContent = a.label, s.selected = e.damageType === a.value, r.append(s);
  }
  return n.append(r), n;
}
function Ky(e, t) {
  const n = Tt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(xe, "utilityLabel"), n.append(r), n;
}
function Yy(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${c}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${c}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const a = document.createElement("div");
  return a.classList.add(`${c}-ritual-roll-config__forms-grid`), a.append(Ut("base", "Padrão", e.forms.base.formula, !0, n)), a.append(Ut("discente", "Discente", e.forms.discente.formula, t.discente, n)), a.append(Ut("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(a), r;
}
function Ut(e, t, n, r, o) {
  const a = Tt(t);
  a.classList.add(`${c}-ritual-roll-config__form-card`), a.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !o || !r, s.setAttribute(xe, `formula.${e}`), a.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", a.append(l);
  }
  return a;
}
function Qy(e) {
  const t = document.createElement("div");
  t.classList.add(`${c}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(te, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(te, "clear"), t.append(n, r), t;
}
function Tt(e) {
  const t = document.createElement("label");
  t.classList.add(`${c}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function fo(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function Zy(e, t, n, r) {
  ye(e, "intent")?.addEventListener("change", () => Mn(e)), ho(e, "system.studentForm")?.addEventListener("change", () => po(e, t)), ho(e, "system.trueForm")?.addEventListener("change", () => po(e, t)), e.querySelector(`[${te}="save"]`)?.addEventListener("click", () => {
    r && Xy(e, t, n);
  }), e.querySelector(`[${te}="clear"]`)?.addEventListener("click", () => {
    r && Jy(e, t);
  });
}
async function Xy(e, t, n) {
  const r = e.querySelector(`[${te}="save"]`);
  r?.setAttribute("disabled", "true"), ue(e, "Salvando configuração...");
  try {
    const o = eb(e, n);
    await Df(t, o), Ri(e, o), ue(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), ue(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function Jy(e, t) {
  const n = e.querySelector(`[${te}="clear"]`);
  n?.setAttribute("disabled", "true"), ue(e, "Limpando configuração...");
  try {
    await Lf(t);
    const r = Na(t);
    tb(e, r), Ri(e, r), ue(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), ue(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Ri(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__badge`);
  n && (n.textContent = Ci(t) ? "Configurada" : "Rascunho");
}
function eb(e, t) {
  return {
    schemaVersion: 1,
    intent: wi(ye(e, "intent")?.value),
    damageType: yo(e, "damageType"),
    utilityLabel: yo(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Qe(e, "formula.base") },
      discente: { formula: Qe(e, "formula.discente") },
      verdadeiro: { formula: Qe(e, "formula.verdadeiro") }
    }
  };
}
function tb(e, t) {
  oe(e, "intent", t.intent), oe(e, "damageType", t.damageType ?? ""), oe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), oe(e, "formula.base", t.forms.base.formula), oe(e, "formula.discente", t.forms.discente.formula), oe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Mn(e);
}
function Mn(e) {
  const t = wi(ye(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function po(e, t) {
  const n = $i(t);
  go(e, "discente", n.discente), go(e, "verdadeiro", n.verdadeiro);
}
function go(e, t, n) {
  const r = ye(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${te}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const a = r.closest(`.${c}-ritual-roll-config__field`), s = a?.querySelector("small");
  if (a) {
    if (n) {
      s?.remove();
      return;
    }
    if (!s) {
      const l = document.createElement("small");
      l.textContent = "Indisponível neste ritual.", a.append(l);
    }
  }
}
function ue(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function $i(e) {
  const t = ob(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function nb(e) {
  return bo(e.item) ? e.item : bo(e.document) ? e.document : null;
}
function rb(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function ob(e) {
  const t = e.system;
  return ib(t) ? t : {};
}
function ho(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ye(e, t) {
  return e.querySelector(`[${xe}="${sb(t)}"]`);
}
function Qe(e, t) {
  return ye(e, t)?.value.trim() ?? "";
}
function yo(e, t) {
  const n = Qe(e, t);
  return n.length > 0 ? n : null;
}
function oe(e, t, n) {
  const r = ye(e, t);
  r && (r.value = n);
}
function wi(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Ci(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function ab(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function bo(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function ib(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function sb(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let J = null;
Hooks.once("init", () => {
  ns(), ks(), il(), yu(), d.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Yn.isSupportedSystem()) {
    d.warn(
      `Sistema não suportado: ${Yn.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  J = Iy(), J.itemUseIntegration.registerStrategies(), nl(J.conditions), Bs(J), Qs(), Gs(), $u(), Ny(J), Uy(), d.info("Inicializado para o sistema Ordem Paranormal."), d.info(
    `API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${ln} inicializado.`);
});
function lb() {
  if (!J)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return J;
}
export {
  lb as getToolkitServices
};
//# sourceMappingURL=main.js.map
