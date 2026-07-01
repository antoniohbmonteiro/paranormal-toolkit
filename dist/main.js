const c = "paranormal-toolkit", rn = "Paranormal Toolkit", Ai = "ordemparanormal";
class Pe {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function it(e) {
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
function on(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : an(t) ? y(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function _i(e) {
  return an(e.getFlag(c, "automation"));
}
function an(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Ri(t.source) && Ti(t.definition);
}
function Ti(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && $(t.label) && Array.isArray(t.steps) && t.steps.every($i) && (t.conditionApplications === void 0 || Si(t.conditionApplications));
}
function Ri(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? $(t.presetId) && $(t.presetVersion) && $(t.appliedAt) : t.type === "manual" ? $(t.label) && $(t.appliedAt) : !1;
}
function $i(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Ci(t);
    case "spendRitualCost":
      return wi(t);
    case "rollFormula":
      return ki(t);
    case "modifyResource":
      return Ei(t);
    case "chatCard":
      return Ii(t);
    default:
      return !1;
  }
}
function Ci(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && ho(t);
}
function wi(e) {
  return e.type === "spendRitualCost";
}
function ki(e) {
  const t = e;
  return t.type === "rollFormula" && $(t.id) && $(t.formula) && (t.intent === void 0 || Oi(t.intent)) && (t.damageType === void 0 || $(t.damageType));
}
function Ei(e) {
  const t = e;
  return t.type === "modifyResource" && yo(t.actor) && vi(t.resource) && Ni(t.operation) && ho(t) && (t.damageType === void 0 || t.damageType === null || $(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Ii(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Si(e) {
  return Array.isArray(e) && e.every(Di);
}
function Di(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return $(t.id) && yo(t.actor) && $(t.conditionId) && (t.label === void 0 || $(t.label)) && (t.duration === void 0 || t.duration === null || Li(t.duration)) && (t.source === void 0 || $(t.source)) && (t.actionSectionId === void 0 || $(t.actionSectionId)) && (t.actionSectionTitle === void 0 || $(t.actionSectionTitle)) && (t.executedLabel === void 0 || $(t.executedLabel));
}
function Li(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Fi(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Pi(t.expiry));
}
function Pi(e) {
  return e === "turnStart" || e === "turnEnd";
}
function ho(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || $(e.amountFrom);
}
function yo(e) {
  return e === "self" || e === "target";
}
function vi(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ni(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Oi(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Fi(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function $(e) {
  return typeof e == "string" && e.length > 0;
}
function sn(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(xn);
    if (Bi(t))
      return Array.from(t).filter(xn);
  }
  return [];
}
function xi(e) {
  return sn(e)[0] ?? null;
}
function Mi(e) {
  return sn(e).find(_i) ?? null;
}
function Bi(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function xn(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ve(e) {
  return sn(e).filter((t) => t.type === "ritual");
}
function bo(e) {
  return ve(e)[0] ?? null;
}
function Ui(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(it);
      return d.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Re("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Me(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Un);
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
      const a = await Mt(e, r, o.value);
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
      const o = await Mt(e, n, r.preset);
      d.info(`Melhor preset aplicado em ${n.name}.`, { match: Un(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Mn(e);
    },
    async applyBestPresetsToActorRituals() {
      return Mn(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Re("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Me(t);
      n && (await e.automationBinder.clear(n), d.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Mn(e) {
  const t = Re("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = ve(t);
  if (n.length === 0)
    return d.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Bn(t);
  const r = Bn(t, n.length);
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
    const i = await Mt(e, o, a.preset);
    r.applied.push(qi(o, a, i));
  }
  return d.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), zi(r), r;
}
async function Mt(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function qi(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: it(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Bn(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function zi(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Un(e) {
  return {
    preset: it(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Re(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Me(e) {
  const t = bo(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ee(e) {
  return e ? {
    id: e.id,
    source: {
      ...ji(e.sourceActor),
      token: e.sourceToken
    },
    item: Vi(e.item),
    targets: e.targets.map(Hi),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: qn(e.rollRequests, Ao),
    rolls: qn(e.rolls, Gi),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(ln),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function ln(e) {
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
function ji(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Vi(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Hi(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Ao(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Gi(e) {
  return {
    ...Ao(e),
    total: e.total
  };
}
function qn(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function Wi(e) {
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
    Ki(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (i) {
    d.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  d.info(`${t} realizado:`, ln(a));
}
function W(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ki(e) {
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
function Yi() {
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
function Bt() {
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
function Qi() {
  return {
    status() {
      return Bt();
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
const _o = "ritual.costOnly", To = "ritual.simpleHealing", Zi = "ritual.eletrocussao", Ro = "ritual.simpleDamage", $o = "generic.simpleHealing", Co = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Xi() {
  return [
    Ji(),
    es(),
    ts(),
    ns(),
    rs()
  ];
}
function Ji() {
  return {
    id: _o,
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
function es() {
  return {
    id: To,
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
    automation: wo(),
    itemPatch: as()
  };
}
function ts() {
  return {
    id: Zi,
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
    automation: os(),
    itemPatch: is()
  };
}
function ns() {
  return {
    id: Ro,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: cn()
  };
}
function rs() {
  return {
    id: $o,
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
function wo(e = "2d8+2") {
  return ko(
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
function os() {
  return {
    ...cn("3d6", {
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
function cn(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return ko(
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
function as() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Co,
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
function is() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Co,
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
function ko(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function un() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ae(t.id),
    actorId: ae(t.actor?.id),
    sceneId: ae(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Eo() {
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
function ss(e) {
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
        if (!us(t, n)) {
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
      const r = e.automationRegistry.require(_o);
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
      if (!zn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(To);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: wo(t)
      }), d.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = K("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = Y(n);
      if (!r) return;
      if (!zn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Ro);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: cn(t)
      }), d.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = K("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = Y(t);
      n && await ls(e, t, n);
    }
  };
}
async function ls(e, t, n) {
  const r = on(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Eo(),
    item: n,
    targets: un()
  });
  if (!o.ok) {
    cs(o.error);
    return;
  }
  d.info("Automação de ritual executada com sucesso.", ee(o.value.context));
}
function cs(e) {
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
  const t = bo(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function us(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function zn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const ds = ["disabled", "ask", "automatic"], ms = ["buttons", "confirm"], Io = "ask";
function fs(e) {
  return typeof e == "string" && ds.includes(e);
}
function ps(e) {
  return typeof e == "string" && ms.includes(e);
}
function gs(e) {
  return fs(e) ? e : ps(e) ? "ask" : Io;
}
const hs = ["keep", "replace"], ys = ["manual", "assisted"], So = "keep", Do = "assisted", bs = !0, I = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function As() {
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
    default: Io
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
    default: So
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
    default: Do
  }), game.settings.register(c, I.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: bs
  }), game.settings.register(c, I.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function jn() {
  const e = gs(game.settings.get(c, I.executionMode)), t = Po(game.settings.get(c, I.systemCardMode)), n = vo(game.settings.get(c, I.damageResolutionMode));
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: Lo()
  };
}
function _s() {
  return Po(game.settings.get(c, I.systemCardMode));
}
function Ts() {
  return vo(game.settings.get(c, I.damageResolutionMode));
}
function Lo() {
  return game.settings.get(c, I.ritualCastingCheckEnabled) === !0;
}
async function Q(e) {
  await game.settings.set(c, I.executionMode, e);
}
function Po(e) {
  return hs.includes(e) ? e : So;
}
function vo(e) {
  return ys.includes(e) ? e : Do;
}
function Rs(e) {
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
const $s = [
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
function Cs(e) {
  return {
    phases() {
      return $s;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = At("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Mi(t);
      if (!n) {
        d.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Vn(e, t, n);
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
      if (!Es(n)) {
        d.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = ks(n) ?? At("Nenhum ator encontrado para executar automação do item.");
      r && await Vn(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = At("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = xi(t);
      if (!n) {
        d.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require($o);
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
async function Vn(e, t, n) {
  const r = on(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Eo(),
    item: n,
    targets: un()
  });
  if (!o.ok) {
    ws(o.error);
    return;
  }
  d.info("Automação executada com sucesso.", ee(o.value.context));
}
function ws(e) {
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
function At(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ks(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Es(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Is(e) {
  const t = Wi(e), n = Ui(e), r = ss(e), o = Cs(e), a = Qi(), i = Rs(e);
  return {
    actor: t,
    automation: n,
    ritual: r,
    workflow: o,
    output: a,
    itemUseIntegration: i,
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
function Ss(e) {
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
      const r = Hn();
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
      return Ds(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Hn();
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
      return Ls(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Hn() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function Ds(e) {
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
function Ls(e) {
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
function Ps(e) {
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
    conditions: Ss(e.conditions),
    debug: Is(e)
  }, n = globalThis;
  return n[c] = t, n.ParanormalToolkit = t, t;
}
class Gn {
  static isSupportedSystem() {
    return game.system.id === Ai;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function vs() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ie(t.id),
    actorId: ie(t.actor?.id),
    sceneId: ie(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function No() {
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
function Ns(e, t = No()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Os(e) {
  if (!Ms(e)) return null;
  const t = e.getFlag(c, "workflow");
  return xs(t) ? t : null;
}
function Fs() {
  return `flags.${c}.workflow`;
}
function Wn(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), n = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || n !== void 0;
}
function Kn(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Ut(t) || Ut(n);
}
function xs(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Ms(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ie(e) {
  return Ut(e) ? e : null;
}
function Ut(e) {
  return typeof e == "string" && e.length > 0;
}
function Bs() {
  const e = (t, n) => {
    Us(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Us(e, t) {
  const n = Os(e);
  if (!n || n.targets.length === 0) return;
  const r = zs(t);
  if (!r || r.querySelector(`.${c}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(qs(n));
}
function qs(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Yn("Origem", e.source.name)), t.append(Yn("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Yn(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${c}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function zs(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function js() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!Vs(r) || !Hs(e) || Wn(e) || Wn(t)) return;
    const o = vs();
    if (o.length === 0 || !Kn(e) && !Kn(t)) return;
    const a = No();
    e.updateSource({
      [Fs()]: Ns(o, a)
    }), d.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Vs(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Hs(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let Qn = !1, _t = !1, Tt = !1, qe = null;
const Gs = 1e3, Ws = 750, Ks = 1e3;
function Ys(e) {
  Qn || (Hooks.on("combatTurnChange", (t) => {
    Zs(e, Zn(t));
  }), Hooks.on("deleteCombat", (t) => {
    Xs(e, Zn(t));
  }), Qn = !0, Qs(e));
}
function Qs(e) {
  st() && (_t || (_t = !0, globalThis.setTimeout(() => {
    _t = !1, dn(e, "ready");
  }, Gs)));
}
function Zs(e, t) {
  st() && t && (qe && globalThis.clearTimeout(qe), qe = globalThis.setTimeout(() => {
    qe = null, dn(e, "combat-turn-change", t);
  }, Ws));
}
function Xs(e, t) {
  st() && t && (Tt || (Tt = !0, globalThis.setTimeout(() => {
    Tt = !1, dn(e, "combat-deleted", t);
  }, Ks)));
}
async function dn(e, t, n) {
  if (st())
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
function st() {
  return game.user?.isGM === !0;
}
function Zn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Oo = {
  enabled: "dice.animations.enabled"
};
function Js() {
  game.settings.register(c, Oo.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function el() {
  return {
    enabled: game.settings.get(c, Oo.enabled) === !0
  };
}
const Fo = "chatCard", Xn = "data-paranormal-toolkit-prompt-id", s = `${c}-item-use-prompt`, tl = `.${s}__title`, xo = `.${s}__header`, nl = `.${s}__roll-card`, rl = `.${s}__roll-meta`, ol = `.${s}__roll-meta-pill`, mn = `.${s}__resistance`, al = `.${s}__resistance-header`, Mo = `.${s}__resistance-description`, fn = `.${s}__resistance-roll-button`, Bo = `.${s}__resistance-roll-result`, Jn = `${s}__resistance-content`, Uo = `.${s}__workflow-section`, qo = `.${s}__workflow-roll`, zo = `${s}__workflow-roll--dice-open`, jo = `.${s}__workflow-roll-formula`, Vo = `${s}__workflow-roll-formula--toggle`, pn = `.${s}__workflow-dice-tray`, il = `.${s}__roll-detail-toggle`, sl = `.${s}__roll-detail-list`, ll = `.${s}__ritual-element-badge`, cl = `.${s}__ritual-metadata`, ul = "casting-backlash", dl = "data-paranormal-toolkit-action-section", ml = "data-paranormal-toolkit-prompt-id", fl = "data-paranormal-toolkit-pending-id", er = "data-paranormal-toolkit-casting-backlash-enhanced", tr = `.${s}`, pl = `.${s}__workflow-section--casting`, gl = `.${s}__workflow-section-header`, hl = `.${s}__workflow-notes`, yl = `[${dl}="${ul}"]`, nr = `${s}__workflow-section-title-row`, bl = `${s}__workflow-section-header--casting-backlash`, Ho = `${s}__casting-backlash-button`;
function Al(e) {
  for (const t of _l(e))
    Tl(t), kl(t);
}
function _l(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(tr) && t.add(e);
  for (const n of e.querySelectorAll(tr))
    t.add(n);
  return Array.from(t);
}
function Tl(e) {
  const t = e.querySelector(yl);
  if (!t) return;
  const n = Rl(t);
  if (!n) return;
  const r = e.querySelector(`${pl} ${gl}`);
  r && (r.classList.add(bl), $l(r), Cl(n), r.append(n), t.remove());
}
function Rl(e) {
  return e.querySelector(
    `button[${fl}], button[${ml}]`
  );
}
function $l(e) {
  const t = e.querySelector(`:scope > .${nr}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(nr);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(Ho) || n.append(o));
  return n;
}
function Cl(e) {
  if (e.getAttribute(er) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = wl(t, e.disabled);
  e.classList.add(Ho), e.setAttribute(er, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function wl(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function kl(e) {
  for (const t of e.querySelectorAll(hl)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function El(e) {
  for (const t of Array.from(e.querySelectorAll(Uo)))
    for (const n of Array.from(t.querySelectorAll(`${il}, ${sl}`)))
      n.remove();
}
const Il = "data-paranormal-toolkit-resistance-roll-result-enhanced", $e = "data-paranormal-toolkit-prompt-id", gn = `.${s}__actions`, Ne = `.${s}__actions-title`, hn = `.${s}__button`, Sl = `${s}__button--executed`, Dl = "data-paranormal-toolkit-executed-label", Ll = "data-paranormal-toolkit-action-section", Pl = "data-paranormal-toolkit-damage-resolution-state", rr = "data-paranormal-toolkit-damage-icon-enhanced", Ie = "data-paranormal-toolkit-effect-icon-enhanced", de = "data-paranormal-toolkit-effect-action-compacted", yn = "data-paranormal-toolkit-effect-resistance-gate", vl = `${s}__workflow-section--effect-action`, or = "data-paranormal-toolkit-resistance-damage-refresh-bound", Nl = `.${s}__workflow-section--effect`, Ol = [0, 80, 180, 400, 900, 1600], Fl = "Conjuração DT", xl = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function Ml(e) {
  for (const t of Array.from(e.querySelectorAll(mn)))
    Bl(t);
  Kl(e), Yl(e);
}
function Bl(e) {
  const t = e.querySelector(al), n = e.querySelector(Mo), r = e.querySelector(fn), o = e.querySelector(Bo);
  if (!r || !t && !n && !o) return;
  const a = Ul(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && (o.parentElement !== e && !r.contains(o) && e.append(o), ql(o)), r.parentElement !== e && e.append(r);
}
function Ul(e, t) {
  const n = e.querySelector(`.${Jn}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Jn), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function ql(e) {
  const t = zl(e.textContent ?? "");
  t && (e.setAttribute(Il, "true"), e.replaceChildren(Hl(t)));
}
function zl(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, a = n?.trim() ?? "Resistência", i = Number(o);
  if (!Number.isFinite(i)) return null;
  const { formula: l, diceValues: u } = jl(r ?? "");
  return l ? {
    skillLabel: a,
    formula: l,
    total: Math.trunc(i),
    diceValues: u
  } : null;
}
function jl(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Vl(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Vl(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Hl(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${s}__workflow-roll`,
    `${s}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${s}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Gl(e);
  return r && t.append(r), t;
}
function Gl(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${s}__workflow-dice-tray`);
  for (const n of Wl(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${s}__workflow-die`), n.active || r.classList.add(`${s}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Wl(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ar(e, "highest") : n.includes("kl") ? ar(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ar(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Kl(e) {
  for (const t of Array.from(e.querySelectorAll(`.${s}__roll-card`)))
    Go(t);
}
function Go(e) {
  const t = lc(e);
  if (!t) return;
  const n = cc(e), r = e.querySelector(mn);
  if (r && r.parentElement !== t && t.append(r), n) {
    n.classList.add(`${s}__actions--embedded`, `${s}__actions--damage-resolution`);
    const a = n.querySelector(Ne);
    a && (a.textContent = "Aplicar dano"), n.parentElement !== t && t.append(n), dc(e), uc(e, n);
  }
  const o = Ql(e);
  o && (Wo(o), Zl(e, t, o), ec(e, o));
}
function Yl(e) {
  for (const t of Array.from(e.querySelectorAll(gn)))
    Wo(t);
}
function Wo(e) {
  const t = e.querySelector(Ne), n = x(t?.textContent);
  if (n !== "aplicar efeito" && n !== "efeito") return !1;
  e.classList.add(
    `${s}__actions--effect-resolution`,
    `${s}__workflow-section`,
    vl
  ), t && (t.textContent = "Efeito");
  const r = e.querySelector(hn);
  if (!r) return !0;
  const o = r.textContent?.trim() ?? "";
  if (!o) return !0;
  const a = Ko(r, o);
  return a && Xl(e, t, a), Yo(r, o) ? (Zo(r), !0) : (Qo(r, a ?? o), !0);
}
function Ql(e) {
  return Array.from(e.parentElement?.querySelectorAll(gn) ?? []).find((n) => {
    const r = n.querySelector(Ne), o = x(r?.textContent);
    return o === "aplicar efeito" || o === "efeito";
  }) ?? null;
}
function Zl(e, t, n) {
  if (n.parentElement === e && n.previousElementSibling === t) return;
  const r = t.nextElementSibling;
  e.insertBefore(n, r);
}
function Xl(e, t, n) {
  if (e.querySelector(`.${s}__effect-resolution-label`)) return;
  const r = document.createElement("span");
  r.classList.add(`${s}__effect-resolution-label`), r.textContent = sc(n), t?.after(r);
}
function Ko(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && x(n) !== "efeito aplicado") return n;
  const r = Jl(e);
  if (r) return r;
  const o = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && x(o) !== "aplicado" ? o : null;
}
function Jl(e) {
  const t = e.getAttribute($e);
  if (!t) return null;
  const n = na(e), r = ra(n), i = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => lt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof i == "string" && i.trim().length > 0 ? i.trim() : null;
}
function Yo(e, t) {
  return e.classList.contains(Sl) || x(t).includes("aplicado");
}
function Qo(e, t) {
  if (e.getAttribute(de) === "true" && e.getAttribute(Ie) === "true") return;
  const n = document.createElement("span");
  n.classList.add(`${s}__button-icon`, `${s}__button-icon--effect`), n.setAttribute("aria-hidden", "true"), n.textContent = "✦";
  const r = document.createElement("span");
  r.classList.add(`${s}__button-label`), r.textContent = "Aplicar", e.classList.add(`${s}__button--effect-resolution-action`), e.setAttribute(de, "true"), e.setAttribute(Ie, "true"), e.setAttribute(Dl, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(n, r);
}
function Zo(e) {
  if (e.getAttribute(de) === "true" && x(e.textContent) === "✓ aplicado") return;
  const t = document.createElement("span");
  t.classList.add(`${s}__button-icon`, `${s}__button-icon--effect-applied`), t.setAttribute("aria-hidden", "true"), t.textContent = "✓";
  const n = document.createElement("span");
  n.classList.add(`${s}__button-label`), n.textContent = "Aplicado", e.classList.add(`${s}__button--effect-resolution-action`, `${s}__button--effect-resolution-applied`), e.setAttribute(de, "true"), e.setAttribute(Ie, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(t, n);
}
function ec(e, t) {
  const n = t.querySelector(hn);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (Yo(n, r)) {
    Zo(n);
    return;
  }
  const o = tc(t, n, r);
  if (!nc(e, o)) {
    Xo(n);
    return;
  }
  const a = ta(e), i = ea(e);
  if (a === null || i === null) {
    rc(n);
    return;
  }
  if (i >= a) {
    oc(n);
    return;
  }
  ac(n, o);
}
function tc(e, t, n) {
  const r = e.querySelector(`.${s}__effect-resolution-label`)?.textContent?.trim();
  return r || (Ko(t, n) ?? n);
}
function nc(e, t) {
  if (!e.querySelector(mn)) return !1;
  const n = _c(t);
  return n.includes("vulneravel") || n.includes("vulnerable");
}
function rc(e) {
  e.disabled = !0, e.removeAttribute(de), e.removeAttribute(Ie), e.classList.remove(
    `${s}__button--effect-resolution-applied`,
    `${s}__button--effect-resolution-resisted`
  ), e.classList.add(`${s}__button--effect-resolution-waiting`), e.setAttribute(yn, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Jo("Role resistência"));
}
function oc(e) {
  e.disabled = !0, e.removeAttribute(de), e.removeAttribute(Ie), e.classList.remove(
    `${s}__button--effect-resolution-applied`,
    `${s}__button--effect-resolution-waiting`
  ), e.classList.add(`${s}__button--effect-resolution-resisted`), e.setAttribute(yn, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    ic("✓", `${s}__button-icon--effect-resisted`),
    Jo("Resistiu")
  );
}
function ac(e, t) {
  Xo(e), e.disabled = !1, Qo(e, t);
}
function Xo(e) {
  e.classList.remove(
    `${s}__button--effect-resolution-waiting`,
    `${s}__button--effect-resolution-resisted`
  ), e.removeAttribute(yn);
}
function ic(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${s}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Jo(e) {
  const t = document.createElement("span");
  return t.classList.add(`${s}__button-label`), t.textContent = e, t;
}
function sc(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
function lc(e) {
  return Array.from(e.querySelectorAll(Nl)).find((t) => {
    const n = t.querySelector(`.${s}__workflow-section-header strong`)?.textContent?.trim();
    return x(n) === "dano";
  }) ?? null;
}
function cc(e) {
  const t = Array.from(e.parentElement?.querySelectorAll(gn) ?? []);
  return t.find((n) => n.getAttribute(Ll) === "apply-damage") ?? t.find((n) => x(n.querySelector(Ne)?.textContent) === "aplicar danos") ?? null;
}
function uc(e, t) {
  const n = Array.from(t.querySelectorAll(hn)), r = ir(n, "normal"), o = ir(n, "half");
  if (!r || !o) {
    t.classList.add(`${s}__actions--compact`);
    return;
  }
  sr(r, "normal"), sr(o, "half");
  const a = Ac();
  if (t.classList.toggle(`${s}__actions--assisted`, a === "assisted"), t.classList.toggle(`${s}__actions--manual`, a !== "assisted"), a !== "assisted") {
    j(r, !0), j(o, !0), ze(t, "manual", null);
    return;
  }
  const i = ea(e), l = ta(e);
  if (l === null) {
    j(r, !0), j(o, !0), ze(t, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (i === null) {
    j(r, !0), j(o, !1), ze(t, "pending", null);
    return;
  }
  const u = i >= l;
  j(r, !u), j(o, u), ze(
    t,
    u ? "resisted" : "failed",
    u ? `Resistiu: ${i} vs DT ${l}.` : `Falhou: ${i} vs DT ${l}.`
  );
}
function ir(e, t) {
  const n = xl[t];
  return e.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function sr(e, t) {
  if (e.getAttribute(rr) === "true") return;
  const n = e.textContent?.trim() ?? "";
  if (!n || n.startsWith("✓")) return;
  const r = document.createElement("i");
  r.classList.add(
    "fa-solid",
    t === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${s}__button-icon`
  ), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  o.classList.add(`${s}__button-label`), o.textContent = n, e.classList.add(
    `${s}__button--damage-resolution-action`,
    `${s}__button--damage-resolution-${t}`
  ), e.setAttribute(rr, "true"), e.setAttribute("aria-label", n), e.replaceChildren(r, o);
}
function j(e, t) {
  e.hidden = !t, e.classList.toggle(`${s}__button--damage-resolution-selected`, t);
}
function ze(e, t, n) {
  e.setAttribute(Pl, t);
  const r = e.querySelector(`.${s}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${s}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(Ne)?.after(o);
}
function dc(e) {
  const t = e.querySelector(fn);
  t && t.getAttribute(or) !== "true" && (t.setAttribute(or, "true"), t.addEventListener("click", () => {
    for (const n of Ol)
      globalThis.setTimeout(() => {
        Go(e);
      }, n);
  }));
}
function ea(e) {
  const t = e.querySelector(fn)?.getAttribute("data-paranormal-toolkit-resistance-roll-result"), n = Se(t);
  if (n !== null) return n;
  const r = e.querySelector(Bo)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Se(o?.[1] ?? null);
}
function ta(e) {
  const t = gc(e), n = mc(t);
  if (n !== null) return n;
  const r = fc(t);
  return r !== null ? r : pc(e);
}
function mc(e) {
  const t = yc(e);
  return t.length === 0 ? null : Se(bc(t, Fl));
}
function fc(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : lr(r, ["system", "ritual", "DT"]) ?? lr(r, ["system", "ritual", "dt"]);
}
function pc(e) {
  const t = Array.from(e.querySelectorAll(`.${s}__workflow-section--casting .${s}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Se(n?.[1] ?? null);
}
function gc(e) {
  const t = hc(e);
  if (!t) return null;
  const n = na(e), r = ra(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => lt(a) ? a.pendingId === t : !1) ?? null;
}
function hc(e) {
  return (e.closest(`[${$e}]`) ?? e.querySelector(`[${$e}]`) ?? e.parentElement?.querySelector(`[${$e}]`) ?? null)?.getAttribute($e) ?? null;
}
function na(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return Tc(o) ? o : null;
}
function ra(e) {
  const t = e?.getFlag?.(c, Fo);
  return lt(t) ? t : null;
}
function yc(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function bc(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function lr(e, t) {
  let n = e;
  for (const r of t) {
    if (!lt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Se(typeof n == "string" ? n : null);
}
function Se(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Ac() {
  try {
    return Ts();
  } catch {
    return "assisted";
  }
}
function x(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function _c(e) {
  return x(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Tc(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function lt(e) {
  return !!(e && typeof e == "object");
}
function cr(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function bn() {
  const e = globalThis.game;
  return ct(e) ? e : null;
}
function D(e, t) {
  const n = Rc(e, t);
  return Ge(n);
}
function Rc(e, t) {
  return t.split(".").reduce((n, r) => ct(n) ? n[r] : null, e);
}
function $c(e, t) {
  const n = e.indexOf(":");
  return n < 0 || De(e.slice(0, n)) !== De(t) ? null : pe(e.slice(n + 1));
}
function Ge(e) {
  return typeof e == "string" ? pe(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function ct(e) {
  return !!e && typeof e == "object";
}
function Cc(e) {
  return typeof e == "string";
}
function ut(e) {
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
function qt(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function H(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function oa(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function wc(e) {
  for (const t of Array.from(e.querySelectorAll(nl))) {
    const n = Pc(t);
    kc(t), n && (Ec(t, n), Ic(t, n));
  }
}
function kc(e) {
  for (const t of Array.from(e.querySelectorAll(rl)))
    t.remove();
}
function Ec(e, t) {
  const r = e.closest(`.${s}`)?.querySelector(xo) ?? null, o = r?.querySelector(tl) ?? null, a = r ?? e, i = a.querySelector(ll);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const l = i ?? document.createElement("span");
  if (l.className = Yc(t.elementTone), l.textContent = Kc(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", l);
      return;
    }
    a.prepend(l);
  }
}
function Ic(e, t) {
  const n = Sc(e);
  Dc(e, n);
  const r = Lc(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${s}__ritual-metadata`);
  for (const i of r) {
    const l = document.createElement("span");
    l.classList.add(`${s}__ritual-metadata-chip`), l.textContent = i, o.append(l);
  }
  if (n) {
    const i = n.querySelector(`.${s}__summary`);
    if (i?.parentElement === n) {
      i.insertAdjacentElement("afterend", o);
      return;
    }
    n.append(o);
    return;
  }
  const a = e.querySelector(Uo);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function Sc(e) {
  return e.closest(`.${s}`)?.querySelector(xo) ?? null;
}
function Dc(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(cl)))
      o.remove();
}
function Lc(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${qt(e.target)}` : null,
    e.duration ? `Duração: ${qt(e.duration)}` : null,
    e.resistance ? `Resistência: ${oa(e.resistance)}` : null
  ].filter(ut);
}
function Pc(e) {
  const t = vc(e), n = Bc(e), o = (t ? Mc(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = An(D(o, "element")), l = M("op.elementChoices", i) ?? ur(X(a, "Elemento")) ?? ur(n.damageType), u = i ?? Qc(l), m = D(o, "circle") ?? X(a, "Círculo"), f = zc(o) ?? X(a, "Alvo"), A = Gc(o, "duration", "op.durationChoices") ?? X(a, "Duração"), T = Uc(e) ?? Vc(o) ?? X(a, "Resistência"), R = qc(a) ?? n.cost, g = {
    elementLabel: l,
    elementTone: u,
    circle: m,
    cost: R,
    target: f,
    duration: A,
    resistance: T
  };
  return Wc(g) ? g : null;
}
function vc(e) {
  const t = Nc(e);
  if (!t) return null;
  const n = t.getFlag?.(c, Fo), r = Fc(n);
  if (r.length === 0) return null;
  const o = Oc(e);
  if (o.size > 0) {
    const a = r.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function Nc(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? bn()?.messages?.get?.(n) ?? null : null;
}
function Oc(e) {
  const t = e.closest(`.${s}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${Xn}]`))) {
    const o = r.getAttribute(Xn)?.trim();
    o && n.add(o);
  }
  return n;
}
function Fc(e) {
  if (!ct(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(xc).filter((n) => n !== null) : [];
}
function xc(e) {
  return ct(e) ? {
    pendingId: Ge(e.pendingId),
    actorId: Ge(e.actorId),
    itemId: Ge(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Cc) : []
  } : null;
}
function Mc(e) {
  if (!e.itemId) return null;
  const t = bn(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Bc(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(ol))) {
    const o = pe(r.textContent);
    if (!o) continue;
    const a = $c(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function Uc(e) {
  const t = pe(e.querySelector(Mo)?.textContent);
  return t ? oa(t) : null;
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
function qc(e) {
  const t = X(e, "Custo") ?? X(e, "PE");
  return t || (e.map(pe).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function zc(e) {
  const t = D(e, "target");
  if (!t) return null;
  if (t === "area")
    return jc(e) ?? M("op.targetChoices", t) ?? "Área";
  const n = M("op.targetChoices", t) ?? H(t);
  return [t === "people" || t === "creatures" ? D(e, "targetQtd") : null, n].filter(ut).join(" ");
}
function jc(e) {
  const t = D(e, "area.name"), n = D(e, "area.size"), r = D(e, "area.type"), o = t ? M("op.areaChoices", t) ?? H(t) : null, a = r ? M("op.areaTypeChoices", r) ?? H(r) : null;
  return o ? n ? a ? `${o} ${n}m ${qt(a)}` : `${o} ${n}m` : o : null;
}
function Vc(e) {
  const t = D(e, "skillResis"), n = D(e, "resistance");
  if (!t || !n) return null;
  const r = M("op.skill", t) ?? H(t), o = Hc(n);
  return [r, o].filter(ut).join(" ");
}
function Hc(e) {
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
      return M("op.resistanceChoices", e) ?? H(e);
  }
}
function Gc(e, t, n) {
  const r = D(e, t);
  return r ? M(n, r) ?? H(r) : null;
}
function Wc(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Kc(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Yc(e) {
  return [
    `${s}__ritual-element-badge`,
    e ? `${s}__ritual-element-badge--${e}` : null
  ].filter(ut).join(" ");
}
function An(e) {
  const t = De(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function ur(e) {
  const t = An(e);
  return t ? M("op.elementChoices", t) ?? H(t) : e ? H(e) : null;
}
function Qc(e) {
  return An(e);
}
function M(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = bn()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const dr = "data-paranormal-toolkit-dice-toggle-enhanced";
function Zc(e) {
  for (const t of Array.from(e.querySelectorAll(qo)))
    aa(t);
}
function Xc(e) {
  const t = sa(e.target);
  if (!t) return;
  const n = _n(t);
  n && (e.preventDefault(), ia(n, t));
}
function Jc(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = sa(e.target);
  if (!t) return;
  const n = _n(t);
  n && (e.preventDefault(), ia(n, t));
}
function aa(e) {
  const t = e.querySelector(pn);
  if (!t) return;
  const n = e.querySelector(jo);
  if (n && n.getAttribute(dr) !== "true" && (n.setAttribute(dr, "true"), n.classList.add(Vo), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function ia(e, t) {
  const n = e.querySelector(pn);
  if (!n) return;
  const r = !e.classList.contains(zo);
  eu(e, t, n, r);
}
function eu(e, t, n, r) {
  e.classList.toggle(zo, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function sa(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(jo);
  if (!t) return null;
  const n = _n(t);
  return n ? (aa(n), t.classList.contains(Vo) ? t : null) : null;
}
function _n(e) {
  const t = e.closest(qo);
  return t && t.querySelector(pn) ? t : null;
}
const mr = `${c}-workflow-dice-toggle-styles`;
function tu() {
  if (document.getElementById(mr)) return;
  const e = document.createElement("style");
  e.id = mr, e.textContent = `
.${s}__workflow-section .${s}__roll-detail-toggle,
.${s}__workflow-section .${s}__roll-detail-list {
  display: none !important;
}

.${s}__workflow-roll:not(.${s}__workflow-roll--dice-open) .${s}__workflow-dice-tray,
.${s}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${s}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${s}__workflow-roll-formula--toggle:hover,
.${s}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${s}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${s}__header .${s}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${s}__ritual-element-badge {
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

.${s}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${s}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${s}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${s}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${s}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${s}__header .${s}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${s}__roll-card > .${s}__ritual-metadata {
  display: none !important;
}

.${s}__ritual-metadata-chip {
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

.${s}__resistance {
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

.${s}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${s}__resistance-content .${s}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${s}__resistance-content .${s}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${s}__resistance-content .${s}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${s}__resistance > .${s}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: start;
}

.${s}__resistance > .${s}__resistance-roll-result,
.${s}__resistance-content .${s}__resistance-roll-result {
  grid-area: result;
  display: block;
  min-width: 0;
  width: 100%;
  margin-top: 0;
}

.${s}__resistance-workflow-roll {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 0.34rem;
}

.${s}__resistance-workflow-roll .${s}__workflow-roll-formula {
  display: inline-flex;
  width: 100%;
  max-width: 100%;
  min-height: 1.78rem;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

.${s}__resistance-workflow-roll .${s}__workflow-roll-formula i {
  margin-left: auto;
}

.${s}__resistance-workflow-roll .${s}__workflow-dice-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
  border-top: 1px solid rgba(79, 55, 42, 0.12);
  padding-top: 0.34rem;
}

.${s}__resistance-workflow-roll .${s}__workflow-die {
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

.${s}__resistance-workflow-roll .${s}__workflow-die--inactive {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(36, 27, 24, 0.46);
  opacity: 0.58;
}
.${s}__workflow-section--casting .${s}__workflow-section-header--casting-backlash {
  grid-template-columns: minmax(0, 1fr) 34px;
}

.${s}__workflow-section-title-row {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.38rem;
}

.${s}__workflow-section-title-row .${s}__workflow-section-status {
  flex: 0 0 auto;
}

.${s}__casting-backlash-button {
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

.${s}__casting-backlash-button::before {
  content: "↪";
  font-size: 1rem;
  font-weight: 950;
  line-height: 1;
}

.${s}__casting-backlash-button:hover,
.${s}__casting-backlash-button:focus {
  border-color: rgba(125, 39, 43, 0.66) !important;
  background: rgba(143, 62, 67, 0.94) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 0 0 2px rgba(125, 39, 43, 0.16) !important;
  outline: none !important;
}

.${s}__casting-backlash-button:disabled {
  cursor: default !important;
  opacity: 0.78 !important;
}

.${s}__casting-backlash-button.${s}__button--executed::before {
  content: "✓";
}

/* 0.21.2 — Resolução de dano integrada no bloco de Dano */
.${s}__workflow-section--effect .${s}__resistance {
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.48rem 0.52rem !important;
  background: rgba(255, 246, 229, 0.52) !important;
  box-shadow: none !important;
}

.${s}__workflow-section--effect .${s}__resistance-content {
  gap: 0.22rem !important;
}

.${s}__workflow-section--effect .${s}__resistance-header strong {
  display: inline !important;
  margin: 0 !important;
}

.${s}__workflow-section--effect .${s}__resistance-description {
  font-size: 0.75rem !important;
  line-height: 1.25 !important;
}

.${s}__actions--embedded {
  margin-top: 0.46rem !important;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${s}__actions--compact,
.${s}__actions--damage-resolution {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center !important;
  gap: 0.34rem !important;
}

.${s}__actions--damage-resolution .${s}__actions-title {
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

.${s}__actions--damage-resolution .${s}__actions-title::before,
.${s}__actions--damage-resolution .${s}__actions-title::after {
  content: "";
  display: block;
  border-top: 1px solid rgba(79, 55, 42, 0.16);
}

.${s}__damage-resolution-summary {
  grid-column: 1 / -1;
  margin: -0.04rem 0 0.02rem;
  color: rgba(54, 39, 31, 0.64);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.24;
  text-align: center;
}

.${s}__actions--damage-resolution .${s}__button {
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

.${s}__actions--damage-resolution .${s}__button-icon {
  flex: 0 0 auto;
  font-size: 0.78rem;
  line-height: 1;
  opacity: 0.88;
}

.${s}__actions--damage-resolution .${s}__button-label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="pending"] .${s}__button,
.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${s}__button,
.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${s}__button {
  grid-column: 1 / -1;
}

.${s}__actions--damage-resolution .${s}__button[hidden] {
  display: none !important;
}

.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${s}__damage-resolution-summary {
  color: rgba(34, 93, 55, 0.84);
}

.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${s}__damage-resolution-summary {
  color: rgba(112, 44, 44, 0.82);
}

.${s}__actions--effect-resolution {
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

.${s}__actions--effect-resolution .${s}__actions-title {
  grid-area: title;
  margin: 0 !important;
  color: rgba(107, 78, 35, 0.95) !important;
  font-size: 0.78rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.055em !important;
  line-height: 1 !important;
  text-transform: uppercase !important;
}

.${s}__effect-resolution-label {
  grid-area: label;
  min-width: 0;
  color: rgba(36, 27, 24, 0.9);
  font-size: 0.82rem;
  font-weight: 850;
  line-height: 1.22;
  overflow-wrap: anywhere;
}

.${s}__actions--effect-resolution .${s}__button {
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
.${s}__actions--effect-resolution {
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${s}__actions--effect-resolution .${s}__button {
  gap: 0.34rem !important;
  border-color: rgba(123, 72, 73, 0.42) !important;
  background: rgba(228, 214, 209, 0.74) !important;
  color: rgba(42, 30, 27, 0.94) !important;
}

.${s}__actions--effect-resolution .${s}__button:hover,
.${s}__actions--effect-resolution .${s}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${s}__button-icon--effect {
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
  transform: translateY(-0.02rem);
}

.${s}__button--effect-resolution-action .${s}__button-label {
  line-height: 1;
}

/* 0.21.5 — Efeito dentro do card principal e estado aplicado compacto */
/* 0.21.6 — Aproxima o Efeito do bloco de Dano para manter o ritmo visual do card */
/* 0.21.7 — Normaliza Efeito como seção irmã de Dano, sem margem herdada de actions */
.${s}__roll-card > .${s}__actions--effect-resolution {
  margin: 0 !important;
}

.${s}__roll-card > .${s}__workflow-section--effect + .${s}__actions--effect-resolution {
  margin-top: 0 !important;
}

.${s}__actions--effect-resolution.${s}__workflow-section {
  align-items: center !important;
}

.${s}__actions--effect-resolution .${s}__button--executed,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${s}__button-icon--effect-applied {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.8 — Efeito condicionado ao resultado da resistência */
.${s}__actions--effect-resolution .${s}__button--effect-resolution-waiting,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted {
  color: rgba(34, 93, 55, 0.84) !important;
}

.${s}__button-icon--effect-resisted {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

`, document.head.append(e);
}
const nu = [0, 100, 500, 1500, 3e3];
let fr = !1, Rt = null;
function ru() {
  if (!fr) {
    fr = !0, tu(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Ce(cr(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Ce(cr(t));
    }), Hooks.once("ready", () => {
      Ce(document), ou();
    }), document.addEventListener("click", Xc), document.addEventListener("keydown", Jc);
    for (const e of nu)
      globalThis.setTimeout(() => Ce(document), e);
  }
}
function ou() {
  Rt || !document.body || (Rt = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Ce(n);
  }), Rt.observe(document.body, { childList: !0, subtree: !0 }));
}
function Ce(e) {
  e && (El(e), wc(e), Ml(e), Zc(e), Al(e));
}
function au() {
  ru();
}
const iu = "data-paranormal-toolkit-action-section", su = "ritual-log", lu = ".paranormal-toolkit-item-use-prompt__actions", cu = ".paranormal-toolkit-item-use-prompt__actions-title", uu = [0, 100, 500, 1500];
let pr = !1;
function du() {
  if (pr) return;
  const e = (t, n) => {
    gr(gu(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), gr(document), pr = !0;
}
function gr(e) {
  for (const t of uu)
    globalThis.setTimeout(() => mu(e), t);
}
function mu(e) {
  fu(e), pu(e);
}
function fu(e) {
  for (const t of e.querySelectorAll(
    `[${iu}="${su}"]`
  ))
    t.remove();
}
function pu(e) {
  for (const t of e.querySelectorAll(lu)) {
    if (hr(t.querySelector(cu)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (a) => hr(a.textContent ?? "")
    ).some((a) => a.includes("ritual conjurado")) && t.remove();
  }
}
function gu(e) {
  if (e instanceof HTMLElement || hu(e))
    return e;
  if (yu(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function hu(e) {
  return e instanceof HTMLElement;
}
function yu(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function hr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const bu = {
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
}, Au = new Set(
  Object.values(bu)
), _u = {
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
function Tu(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Ru(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = _u[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Au.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function la(e) {
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
function Ru(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class $u {
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
    const i = [], l = /* @__PURE__ */ new Set();
    let u = null;
    for (const [m, f] of t.instances.entries()) {
      const A = Cu(f, m);
      if (!A.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const T = Tu(f.damageType);
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
        i.push(
          wu(A.id, f, T.value)
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
        for (const v of Eu(R.conditions))
          l.add(v);
        const g = ku(R.newPV);
        g !== null && (u = g), i.push({
          id: A.id,
          label: f.label ?? la(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: A.amount,
          finalDamage: yr(R.finalDamage, A.amount),
          blocked: yr(R.blocked, 0),
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
      totalRawDamage: i.reduce(
        (m, f) => m + f.inputAmount,
        0
      ),
      totalFinalDamage: i.reduce(
        (m, f) => m + f.finalDamage,
        0
      ),
      totalBlocked: i.reduce(
        (m, f) => m + f.blocked,
        0
      ),
      newPV: u,
      conditions: Array.from(l),
      instances: i,
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
function Cu(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function wu(e, t, n) {
  return {
    id: e,
    label: t.label ?? la(n),
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
function yr(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function ku(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Eu(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const we = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, ca = {
  PV: "system.attributes.hp"
}, zt = {
  PV: [we.PV, ca.PV],
  SAN: [we.SAN],
  PE: [we.PE],
  PD: [we.PD]
}, jt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Iu {
  getResource(t, n) {
    const r = br(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, i = `${o}.max`, l = foundry.utils.getProperty(t, a), u = foundry.utils.getProperty(t, i), m = _r(t, n, a, l, "valor atual");
    if (m) return p(m);
    const f = _r(t, n, i, u, "valor máximo");
    return f ? p(f) : y({
      value: l,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = br(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function br(e, t) {
  const n = Su(e.type, t);
  if (n && Ar(e, n))
    return y(n);
  const r = zt[t].find(
    (o) => Ar(e, o)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Du(e, t),
    path: zt[t].join(" | ")
  });
}
function Su(e, t) {
  return e === "threat" ? ca[t] ?? null : e === "agent" ? we[t] : null;
}
function Ar(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Du(e, t) {
  const n = e.type ?? "unknown", r = zt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function _r(e, t, n, r, o) {
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
class Lu {
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
      const i = jt.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: r, value: o } = n, a = Pu(o);
    return a ? y(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of jt.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Pu(e) {
  if (Tr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Tr(n))
      return n;
  }
  return null;
}
function Tr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const vu = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Nu {
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
    const r = n.value, o = Ou(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: vu[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Ou(e, t) {
  const n = e.getFlag(c, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Fu(n) ? {
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
function Fu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const $t = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function xu(e) {
  if (!ju(e.item)) return null;
  const t = Vt(e.actor) ? e.actor : Mu(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Uu(e.token) ?? Bu(t),
    targets: un(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Mu(e) {
  const t = e;
  return Vt(t.actor) ? t.actor : Vt(e.parent) ? e.parent : null;
}
function Bu(e) {
  const t = qu(e) ?? zu(e);
  return t ? ua(t) : null;
}
function Uu(e) {
  return Ht(e) ? ua(e) : null;
}
function qu(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Ht(n) ? n : (t.getActiveTokens?.() ?? []).find(Ht) ?? null;
}
function zu(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function ua(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Ct(e.id),
    actorId: Ct(t?.id),
    sceneId: Ct(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ju(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Vt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Ht(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Ct(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Vu {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on($t.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, d.info(`${$t.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = xu(Hu(t));
    if (!n) {
      d.warn(`${$t.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Hu(e) {
  return e && typeof e == "object" ? e : {};
}
class Gu {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return wt("missing-item-patch");
    if (t.type !== "ritual") return wt("unsupported-item-type");
    const o = Wu(r);
    return Object.keys(o).length === 0 ? wt("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Wu(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (w(t, "system.circle", n.circle), w(t, "system.element", n.element), w(t, "system.target", n.target), w(t, "system.targetQtd", n.targetQuantity), w(t, "system.execution", n.execution), w(t, "system.range", n.range), w(t, "system.duration", n.duration), w(t, "system.skillResis", n.resistanceSkill), w(t, "system.resistance", n.resistance), w(t, "system.studentForm", n.studentForm), w(t, "system.trueForm", n.trueForm)), t;
}
function w(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function wt(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Ku {
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
    return this.getNumber(t, jt.ritual.dt, 0);
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
class Yu {
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
class Qu {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Zu(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, kt(t)), y(t)) : n;
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
    return n ? kt(n) : null;
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
    return Array.from(this.presets.values()).map(kt);
  }
  findForItem(t) {
    return this.list().map((n) => Xu(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Zu(e) {
  return !Et(e.id) || !Et(e.version) || !Et(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function Xu(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = Ju(o, t);
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
function Ju(e, t) {
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
      const n = Rr(t.name), r = e.names.map(Rr).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = ed(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Rr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function ed(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function kt(e) {
  return structuredClone(e);
}
function Et(e) {
  return typeof e == "string" && e.length > 0;
}
function Ze(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = dt(e.amountFrom);
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
function dt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const td = "dice-so-nice";
async function da(e) {
  if (!nd() || !rd()) return;
  const t = od();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      d.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function nd() {
  try {
    return el().enabled;
  } catch {
    return !1;
  }
}
function rd() {
  return game.modules?.get?.(td)?.active === !0;
}
function od() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function ad(e, t, n) {
  if (!$r(e.id) || !$r(e.formula))
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
    await da(o);
    const l = {
      ...n.rollRequests[e.id] ?? ma(e, t),
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
function ma(e, t) {
  const n = e.intent ?? id(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function id(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function $r(e) {
  return typeof e == "string" && e.length > 0;
}
async function Xe(e, t, n, r, o) {
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
function sd(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = ld(t, n, r, o);
    n.damageInstances.push(i), a.emit("afterDamageResolution", n, {
      stepIndex: o,
      step: t,
      damage: i,
      resourceTransaction: r,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount,
        damageType: i.damageType
      }
    }), a.emit("afterApplyDamage", n, {
      stepIndex: o,
      step: t,
      damage: i,
      resourceTransaction: r,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount,
        damageType: i.damageType
      }
    });
    return;
  }
  if (t.operation === "heal") {
    const i = cd(t, n, r, o);
    n.healingInstances.push(i), a.emit("afterApplyHealing", n, {
      stepIndex: o,
      step: t,
      healing: i,
      resourceTransaction: r,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount
      }
    });
  }
}
function ld(e, t, n, r) {
  const o = dt(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: fa(t.id, "damage", r, t.damageInstances.length),
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
function cd(e, t, n, r) {
  const o = dt(e.amountFrom);
  return {
    id: fa(t.id, "healing", r, t.healingInstances.length),
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
function fa(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function ud(e, t, n) {
  const r = dt(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function dd(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), pa("before", e), Cr("before", e), Cr("resolve", e);
}
function md(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), pa("apply", e);
}
function fd(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function pa(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t, l = pd(e, n.operation);
  l && i.emit(l, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Cr(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t;
  n.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function pd(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function gd(e, t, n) {
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
async function hd(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return yd(e, t);
    case "spendRitualCost":
      return bd(e, t);
  }
}
async function yd(e, t) {
  const { context: n, resources: r } = e, o = Ze(t, n);
  return o.ok ? ga(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function bd(e, t) {
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
  const i = a.value;
  return n.ritualCosts.push({
    ...i,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), ga(await r.spend(n.sourceActor, i.resource, i.amount), n, t);
}
function ga(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Ad(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, i = _d(t);
  for (const u of i.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const l = await a();
  if (!l.ok)
    return l;
  for (const u of i.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return l;
}
function _d(e) {
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
class Td {
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
        return Ad({
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
    const o = await hd({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = ma(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const i = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, i), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: i }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await ad(t, r, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = Ze(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = ud(t, n, o.value);
    dd({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), md({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    });
    const i = this.resolveActors(t.actor, n);
    if (i.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const l of i) {
      const u = await Xe(this.resources, l, t.resource, t.operation, o.value), m = this.handleResourceOperationResult(u, n, r, t);
      if (!m.ok)
        return m;
      sd({
        step: t,
        context: n,
        transaction: m.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return fd({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = Ze(t, n);
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
    for (const i of a) {
      const l = await Xe(this.resources, i, t.resource, t.operation, o.value), u = this.handleResourceOperationResult(l, n, r, t);
      if (!u.ok)
        return u;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await gd(this.messages, t, n);
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
  emitSpecificRollPhase(t, n, r, o, a, i) {
    const l = Rd(t, n.intent);
    l && this.lifecycle.emit(l, r, {
      stepIndex: o,
      step: a,
      rollRequest: n,
      rollResult: i
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
function Rd(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class $d {
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
    const i = a.value, l = this.calculate(r, i, o);
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
        current: i.value,
        required: o
      });
    const { afterValue: u, appliedAmount: m } = l.value, f = {
      value: u,
      max: i.max
    };
    try {
      u !== i.value && await this.adapter.updateResourceValue(t, n, u);
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
        current: i.value,
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
      before: i,
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
function ha(e) {
  return {
    id: Cd(),
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
function Cd() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class wd {
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
    const r = ha(n);
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
class kd {
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
class Ed {
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
    const n = Bt();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Id(),
      flags: {
        ...t.flags,
        [c]: {
          ...Sd(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && d.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = Bt();
    if (!r.enabled)
      return;
    const o = n.notification ?? wr(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = wr(n);
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
function wr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Id() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Sd(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function Dd(e, t) {
  const n = xd(e?.rounds);
  if (!n)
    return kr(null);
  const r = e?.anchor ?? ya(t);
  if (!r)
    return {
      ...kr(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Ld(),
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
function ya(e) {
  const t = Md();
  if (!t?.id || !ba(t.round)) return null;
  const n = Od(t), r = Pd(e, n) ?? Nd(t), o = V(r?.id), a = Ud(r?.initiative), i = vd(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: i,
    initiative: a,
    time: Bd()
  };
}
function Ld() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function kr(e) {
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
function Pd(e, t) {
  return e?.id ? t.find((n) => Fd(n) === e.id) ?? null : null;
}
function vd(e, t, n) {
  const r = V(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return qd(e.turn) ? e.turn : null;
}
function Nd(e) {
  return We(e.combatant) ? e.combatant : null;
}
function Od(e) {
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
function Fd(e) {
  return V(e.actor?.id) ?? V(e.actorId) ?? V(e.token?.actor?.id) ?? V(e.token?.actorId) ?? V(e.document?.actor?.id) ?? V(e.document?.actorId);
}
function xd(e) {
  return ba(e) ? Math.trunc(e) : null;
}
function Md() {
  return game.combat ?? null;
}
function Bd() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function We(e) {
  return !!(e && typeof e == "object");
}
function V(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ud(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ba(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function qd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class zd {
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
    if (!Xd(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = Dd(t.duration, r), i = jd(o, t, a), u = t.refreshExisting ?? !0 ? Jd(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(i)), y(Er(r, o, u.id ?? null, !1, !0, a));
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
      const f = (await r.createEmbeddedDocuments("ActiveEffect", [i]))[0]?.id ?? null;
      return y(Er(r, o, f, !0, !1, a));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = _a(n, r);
    let a = 0;
    try {
      for (const i of o)
        await Ir(n, i) === "deleted" && (a += 1);
    } catch (i) {
      return p({
        actor: n,
        actorId: n.id ?? null,
        actorName: n.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "delete-failed",
        message: `Falha ao remover condição ${t.conditionId} de ${n.name ?? "ator sem nome"}.`,
        cause: i
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
    const n = nm(), r = [];
    let o = 0, a = 0;
    for (const i of n) {
      const l = Tn(i);
      o += l.length;
      for (const u of l) {
        if (!Gd(u, t)) continue;
        const m = Aa(u);
        try {
          await Ir(i, u) === "deleted" && (a += 1);
        } catch (f) {
          r.push({
            actorId: i.id ?? null,
            actorName: i.name ?? "Ator sem nome",
            effectId: u.id ?? null,
            conditionId: m.conditionId,
            message: `Falha ao remover condição expirada ${m.conditionId ?? u.name ?? "desconhecida"} de ${i.name ?? "ator sem nome"}.`,
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
function jd(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: mm(),
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
    duration: Vd(n.duration),
    start: Hd(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [c]: r
    }
  };
}
function Vd(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Hd(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: dm(),
    ...e
  };
}
function Er(e, t, n, r, o, a) {
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
function Gd(e, t) {
  const n = Aa(e);
  if (!n.conditionId || !Wd(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = um();
  return n.durationMode === "combatantTurn" || Kd(n) ? Qd(n, r) : Yd(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !L(n.startRound) || !L(n.requestedRounds) || !L(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Wd(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && L(e.requestedRounds);
}
function Kd(e) {
  return !!(e.combatDurationApplied && L(e.requestedRounds) && L(e.startRound) && (e.startCombatantId || Je(e.startTurn)));
}
function Yd(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Qd(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !L(e.startRound) || !L(e.requestedRounds) || !L(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Zd(t);
  return e.startCombatantId ? r === e.startCombatantId : Je(e.startTurn) && Je(t.turn) ? t.turn === e.startTurn : !1;
}
function Zd(e) {
  return se(e.combatant?.id);
}
function Aa(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ke(e, "conditionId"),
    requestedRounds: Sr(e, "requestedRounds") ?? ke(t.value) ?? ke(t.rounds),
    combatDurationApplied: It(e, "combatDurationApplied"),
    combatId: Ke(e, "combatId") ?? se(n.combat) ?? se(t.combat),
    startCombatantId: Ke(e, "startCombatantId") ?? se(n.combatant),
    startInitiative: im(e, "startInitiative") ?? Ta(n.initiative),
    startRound: Sr(e, "startRound") ?? ke(n.round) ?? ke(t.startRound),
    startTurn: am(e, "startTurn") ?? Gt(n.turn) ?? Gt(t.startTurn),
    expiryEvent: sm(e, "expiryEvent") ?? Ra(t.expiry),
    durationMode: lm(e, "durationMode"),
    deleteOnExpire: It(e, "deleteOnExpire"),
    expiresWithCombat: It(e, "expiresWithCombat")
  };
}
function Xd(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Jd(e, t) {
  return _a(e, t)[0] ?? null;
}
function _a(e, t) {
  return Tn(e).filter((n) => om(n) === t);
}
async function Ir(e, t) {
  const n = t.id ?? null, r = n ? em(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (tm(o)) return "missing";
    throw o;
  }
}
function em(e, t) {
  return Tn(e).find((n) => n.id === t) ?? null;
}
function tm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function nm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Ve(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Ve(e, n);
  });
  for (const n of rm())
    Ve(e, n.actor), Ve(e, n.document?.actor);
  return Array.from(e.values());
}
function Ve(e, t) {
  if (!cm(t)) return;
  const r = se(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function rm() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Tn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function om(e) {
  return Ke(e, "conditionId");
}
function Ke(e, t) {
  return se(ne(e, t));
}
function Sr(e, t) {
  return ke(ne(e, t));
}
function am(e, t) {
  return Gt(ne(e, t));
}
function im(e, t) {
  return Ta(ne(e, t));
}
function sm(e, t) {
  return Ra(ne(e, t));
}
function lm(e, t) {
  const n = ne(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function It(e, t) {
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
function Gt(e) {
  return Je(e) ? Math.trunc(e) : null;
}
function Ta(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ra(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function cm(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function um() {
  return game.combat ?? null;
}
function dm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function L(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Je(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function mm() {
  return game.user?.id ?? null;
}
const fm = "icons/svg/downgrade.svg", pm = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? fm,
    description: pm,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const gm = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), hm = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), ym = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), bm = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Am = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), _m = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Tm = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Rm = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), $m = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Cm = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), wm = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), km = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Em = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Im = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Sm = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Dm = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Lm = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Pm = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), vm = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Nm = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Om = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Fm = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), xm = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Mm = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Bm = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Um = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), qm = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), zm = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), jm = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Vm = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), Hm = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Gm = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Wm = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Km = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Ym = [
  gm,
  hm,
  ym,
  bm,
  Am,
  _m,
  Tm,
  Rm,
  $m,
  Cm,
  wm,
  km,
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
  Vm,
  Hm,
  Gm,
  Wm,
  Km
];
class Qm {
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
    return Array.from(this.definitions.values()).map(Dr);
  }
  get(t) {
    const n = this.lookup.get(Lr(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(Dr(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Lr(t);
    r && this.lookup.set(r, n);
  }
}
function Zm() {
  return new Qm(Ym);
}
function Dr(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Lr(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const Xm = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", $a = `${c}-inline-roll-neutralized`, Jm = `${c}-inline-roll-notice`, Rn = `data-${c}-inline-roll-neutralized`, Pr = `data-${c}-inline-roll-notice`, ef = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function vr(e) {
  const t = gf(e.message), n = await tf(e.message), r = nf(t);
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
async function tf(e) {
  const t = mf(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = rf(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await ff(t, n.content), replacementCount: n.replacementCount };
}
function nf(e) {
  const t = e ? pf(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Ca(t);
  return n > 0 && wa(cf(t)), { replacementCount: n };
}
function rf(e) {
  const t = of(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Ca(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (wa(n.content), { content: n.innerHTML, replacementCount: o });
}
function of(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, sf(o.trim()))), replacementCount: t };
}
function Ca(e) {
  const t = af(e);
  for (const n of t)
    n.replaceWith(lf(uf(n)));
  return t.length;
}
function af(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(Xm))
    n.getAttribute(Rn) !== "true" && t.add(n);
  return Array.from(t);
}
function sf(e) {
  return `<span class="${$a}" ${Rn}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${hf(e)}</span>`;
}
function lf(e) {
  const t = document.createElement("span");
  return t.classList.add($a), t.setAttribute(Rn, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function wa(e) {
  if (e.querySelector?.(`[${Pr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Jm), t.setAttribute(Pr, "true"), t.textContent = ef, e.append(t);
}
function cf(e) {
  return e.querySelector(".message-content") ?? e;
}
function uf(e) {
  const n = e.getAttribute("data-formula") ?? df(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function df(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function mf(e) {
  return e && typeof e == "object" ? e : null;
}
async function ff(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return d.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function pf(e) {
  const t = yf(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function gf(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function hf(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function yf(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const et = "ritualRollConfig", le = "ritual-roll";
function mt() {
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
function ka(e) {
  const t = e.getFlag(c, et);
  return Wt(t);
}
function Ea(e) {
  return ka(e) ?? mt();
}
async function bf(e, t) {
  const n = Wt(t) ?? Wt({
    ...mt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(c, et, n), n;
}
async function Af(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, c, et));
    return;
  }
  await e.setFlag(c, et, null);
}
function Wt(e) {
  if (!ft(e)) return null;
  const t = If(e.intent);
  if (!t) return null;
  const n = mt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: tt(e.damageType),
    utilityLabel: tt(e.utilityLabel) ?? n.utilityLabel,
    note: $n(e.note),
    forms: Sf(e.forms)
  };
}
function _f(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Tf(e) {
  const t = ka(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = Rf(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...$f(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: wf(e, t),
    resistance: t.intent === "damage" ? kf(e) : void 0
  };
}
function Rf(e, t) {
  const n = {
    type: "rollFormula",
    id: le,
    formula: t,
    intent: Ef(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function $f(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${le}.total`,
          ...Cf(e.damageType)
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
function Cf(e) {
  return e ? { damageType: e } : {};
}
function wf(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [le]: n
      }
    }
  };
  return Nr(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [le]: t.forms.discente.formula.trim()
    }
  }), Nr(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [le]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function kf(e) {
  const t = Ia(e), n = tt(t.skillResis), r = tt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = Df(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function Ef(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function If(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function Sf(e) {
  const t = mt();
  return ft(e) ? {
    base: St(e.base),
    discente: St(e.discente),
    verdadeiro: St(e.verdadeiro)
  } : t.forms;
}
function St(e) {
  return ft(e) ? { formula: $n(e.formula) } : { formula: "" };
}
function Nr(e, t) {
  const n = Ia(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return Lf(r);
}
function Ia(e) {
  const t = e.system;
  return ft(t) ? t : {};
}
function Df(e) {
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
function Lf(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function $n(e) {
  return typeof e == "string" ? e.trim() : "";
}
function tt(e) {
  const t = $n(e);
  return t.length > 0 ? t : null;
}
function ft(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const Or = "occultism";
function Pf(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function vf(e) {
  const t = Pf(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await Nf(e, Or);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await da(n);
  const r = xf(n);
  return {
    skill: Or,
    skillLabel: "Ocultismo",
    roll: n,
    formula: Ff(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: Mf(n)
  };
}
async function Nf(e, t) {
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
  return Of(r);
}
function Of(e) {
  return Fr(e) ? e : Array.isArray(e) ? e.find(Fr) ?? null : null;
}
function Fr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Ff(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function xf(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Mf(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Bf);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Bf(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function Uf(e) {
  switch (qf(e)) {
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
      return zf(String(e ?? ""));
  }
}
function qf(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function zf(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function jf(e) {
  return {
    header: {
      eyebrow: rn,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Kf(e.ritual)
    },
    forms: e.variantOptions.map((t) => Vf(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: Wf(e.automationStatus ?? "assisted")
  };
}
function Vf(e, t) {
  const n = Hf(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Gf(t) : "—",
    details: n
  };
}
function Hf(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Gf(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function Wf(e) {
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
function Kf(e) {
  const t = e.system, n = [Qf(t?.element), Yf(t?.circle)].filter(Jf);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function Yf(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Qf(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (Zf(e)) {
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
      return Xf(e);
  }
}
function Zf(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function Xf(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function Jf(e) {
  return typeof e == "string" && e.length > 0;
}
const Sa = ["base", "discente", "verdadeiro"];
function Da(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function nt(e) {
  return typeof e == "string" && Sa.includes(e);
}
const { ApplicationV2: ep } = foundry.applications.api;
class Ee extends ep {
  constructor(t, n) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = jf(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    np(o, (a) => {
      this.selectedVariant = a;
    }), rp(o, (a) => {
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
          ${this.model.forms.map(tp).join("")}
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
    const n = ip(t), r = op(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function tp(e) {
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
function np(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => xr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), xr(e, o, t));
    });
  const r = La(e);
  r && t(r);
}
function xr(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !nt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), La(e));
}
function La(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && nt(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function rp(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function op(e, t, n) {
  const r = ap(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function ap(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (nt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return nt(n) ? n : null;
}
function ip(e) {
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
async function sp(e) {
  return Ee.request(e);
}
const Cn = {
  label: "Padrão"
}, lp = {
  label: "Discente",
  extraCost: 2
}, cp = {
  label: "Verdadeiro",
  extraCost: 5
};
class up {
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
    const r = this.resolveCostPreview(t), o = eg(n), a = Zp(
      n,
      t.item,
      r,
      o
    ), i = await sp({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((C) => C.name),
      cost: r,
      defaultSpendResource: ig(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const l = dp(i), u = ng(
      n,
      t.item,
      l.variant,
      o
    ), m = Lo();
    let f = null;
    if (m) {
      const C = await fp(
        this.resources,
        t.actor,
        l,
        u,
        r
      );
      if (!C.ok)
        return {
          status: "failed",
          reason: C.reason,
          message: C.message
        };
      try {
        f = await vf(
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
    const A = mp(
      n,
      l,
      u,
      r,
      {
        includeCostSteps: !m
      }
    );
    if (A.steps.length === 0) {
      const C = tg(
        t,
        l
      ), q = Mr(
        t.actor,
        f,
        u,
        r
      ), Fn = Br(
        n,
        l,
        u,
        r,
        C,
        t,
        f
      );
      return q.length > 0 ? {
        status: "ready",
        workflowContext: C,
        actions: q,
        summaryLines: Fn
      } : {
        status: "completed-without-actions",
        workflowContext: C,
        summaryLines: Fn
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
    const R = T.value.context, g = _p(
      n,
      t,
      R
    ), v = gp(
      n,
      t
    ), be = Mr(
      t.actor,
      f,
      u,
      r
    ), Ae = Br(
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
    return Xe(
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
function dp(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function mp(e, t, n, r, o) {
  const a = [], i = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || kn(l) && (!o.includeCostSteps || !i) || a.push(pp(l, n));
  return o.includeCostSteps && i && r && sg(n.extraCost) && a.push({
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
async function fp(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Oe(o, r);
  if (!a)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (a.amount <= 0) return { ok: !0 };
  const i = await e.spend(
    t,
    a.resource,
    a.amount
  );
  return i.ok ? { ok: !0 } : {
    ok: !1,
    reason: i.error.reason,
    message: i.error.message
  };
}
function pp(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Mr(e, t, n, r) {
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
function gp(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = wn(r.actor, t);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const a of o) {
      const i = ya(a);
      n.push(
        hp(
          r,
          a,
          t.item,
          i
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function hp(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? Ap(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: yp(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: bp(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function yp(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function bp(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Ap(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function _p(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const i = Ze(a, n);
    if (!i.ok)
      return {
        ok: !1,
        reason: i.error.reason,
        message: i.error.message
      };
    const l = wn(a.actor, t);
    if (l.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of l) {
      if (Tp(a)) {
        Rp(
          o,
          u,
          $p(a, n, i.value)
        );
        continue;
      }
      r.push(wp(a, u, i.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...Cp(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function Tp(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Rp(e, t, n) {
  const r = Sp(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function $p(e, t, n) {
  const r = Dp(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function Cp(e, t, n, r) {
  const o = Np(e), a = o.length > 1 ? xp() : void 0;
  return o.map((i) => {
    const l = r.map(
      (m, f) => {
        const A = Op(m.amount, i);
        return {
          id: kp(m, i, f),
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
      label: Ep(u, i, o.length > 1),
      executedLabel: Ip(
        n.name ?? "Ator sem nome",
        i,
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
function wp(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = vp(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: Lp(e, r, n),
    executedLabel: Pp(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function kp(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Ep(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Ip(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Sp(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Dp(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function Lp(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Pp(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function vp(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Np(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Op(e, t) {
  const n = e * t.multiplier, r = Fp(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function Fp(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function xp() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function wn(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Br(e, t, n, r, o, a, i = null) {
  return [
    `Forma: ${Da(t.variant)}`,
    qp(t, n, r),
    ...Up(i),
    ...Object.values(o.rolls).flatMap(zp),
    ...Mp(e, a),
    ...jp(e.resistance),
    ...Yp(n)
  ];
}
function Mp(e, t) {
  return Bp(e) ? wn("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Bp(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Up(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function qp(e, t, n) {
  const r = Oe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function zp(e) {
  const n = [`${Qp(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = Vp(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${Uf(e.damageType)}`), n;
}
function jp(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function Vp(e) {
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
    const i = Hp(a);
    i && (Kp(
      n,
      i.operator ?? r,
      i.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Hp(e) {
  const t = Gp(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Wp(e);
}
function Gp(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Wp(e) {
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
function Kp(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function Yp(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Qp(e) {
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
function Zp(e, t, n, r) {
  return Sa.map((o) => {
    const a = Pa(
      e,
      t,
      o,
      r
    ), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? Da(o),
      enabled: i,
      details: a ? Xp(a, n, r) : [],
      finalCostText: a ? Jp(n, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function Xp(e, t, n) {
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
function Jp(e, t) {
  const n = Oe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function eg(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(kn);
}
function tg(e, t) {
  return ha({
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
function ng(e, t, n, r) {
  return Pa(e, t, n, r) ?? Cn;
}
function Pa(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? og(t, n) ? rg(n) : null : n === "base" ? Cn : null);
}
function rg(e) {
  switch (e) {
    case "base":
      return Cn;
    case "discente":
      return lp;
    case "verdadeiro":
      return cp;
  }
}
function og(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return ag(foundry.utils.getProperty(e, n));
}
function ag(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function ig(e) {
  return e.steps.some(kn);
}
function kn(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function sg(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function lg(e, t) {
  const n = await cg(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: dg(n),
    total: mg(n),
    diceBreakdown: fg(n)
  };
}
function va(e) {
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
async function cg(e, t) {
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
  return ug(r);
}
function ug(e) {
  return Ur(e) ? e : Array.isArray(e) ? e.find(Ur) ?? null : null;
}
function Ur(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function dg(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function mg(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function fg(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(pg);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function pg(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Na = "itemUsePrompts", Oa = "chatCard", pt = "data-paranormal-toolkit-prompt-id", gt = "data-paranormal-toolkit-pending-id", En = "data-paranormal-toolkit-executed-label", Kt = "data-paranormal-toolkit-choice-group", Fa = "data-paranormal-toolkit-skipped-label", qr = "data-paranormal-toolkit-action-section", zr = "data-paranormal-toolkit-detail-key", jr = "data-paranormal-toolkit-roll-card", In = "data-paranormal-toolkit-roll-detail-toggle", xa = "data-paranormal-toolkit-roll-detail-id", Ma = "data-paranormal-toolkit-resistance-roll-button", Ba = "data-paranormal-toolkit-resistance-skill", Ua = "data-paranormal-toolkit-resistance-skill-label", qa = "data-paranormal-toolkit-resistance-target-actor-id", za = "data-paranormal-toolkit-resistance-target-name", ja = "data-paranormal-toolkit-resistance-roll-result", Vr = "data-paranormal-toolkit-system-card-replaced", gg = `[${gt}]`, hg = `[${In}]`, yg = `[${Ma}]`, Yt = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, bg = `${h}__actions`, Hr = `${h}__details`, Va = `${h}__summary`, Ag = `${h}__title`, Ha = `${h}__button--executed`, Gr = `${h}__roll-card`;
let Wr = !1, Qt = null;
const P = /* @__PURE__ */ new Map(), _g = [0, 100, 500, 1500, 3e3], Tg = 3e4, Rg = [0, 100, 500, 1500, 3e3];
function $g(e) {
  if (Qt = e, Wr) {
    Yr(e);
    return;
  }
  const t = (n, r) => {
    Wa(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Wr = !0, Yr(e);
}
async function Kr(e) {
  const t = Ga(e);
  P.set(e.pendingId, t), await Ln(t) || ri(t), Ka(e.pendingId);
}
async function Cg(e) {
  const t = Ga({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await Ln(t) || ri(t), Ka(e.pendingId);
}
async function Dt(e, t) {
  const n = P.get(e);
  P.delete(e), n && await $h(n, t);
}
function Sn(e) {
  const t = ci();
  for (const n of t) {
    const r = U(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function wg(e, t) {
  const n = Sn(e);
  if (!n) return;
  const r = U(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await ge(n.message, r));
}
async function kg(e, t, n) {
  if (!t) return;
  const r = Sn(e);
  if (!r) return;
  const o = U(r.message);
  let a = !1;
  for (const [i, l] of Object.entries(o))
    i !== e && l.choiceGroupId === t && (o[i] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await ge(r.message, o);
}
function Ga(e) {
  const t = G(e.context.message), n = e.context.targets.find((i) => en(i)), r = n ? en(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Xg(e.context),
    executed: !1
  };
}
function Wa(e, t, n) {
  Rh();
  const r = yt(t);
  if (!r) return;
  const o = Ah(e, r);
  o.length > 0 && rt(r);
  for (const a of o)
    Zt(r, a);
  Za(r, n), Xt(r), Jt(r);
}
function Yr(e) {
  for (const t of Rg)
    globalThis.setTimeout(() => {
      Eg(e);
    }, t);
}
function Eg(e) {
  for (const t of Ig()) {
    const n = ht(t);
    Sg(n) && Wa(n, t, e);
  }
}
function Ig() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Sg(e) {
  return e ? Pn(e) ? !0 : wh(e).length > 0 : !1;
}
function Ka(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? _h(t.messageId) : null;
  if (n) {
    eo(n, t), rt(n), Zt(n, t), Qr(n), Xt(n), Jt(n);
    return;
  }
  if (t.messageId) {
    nn(t);
    return;
  }
  const r = Th(t);
  if (r) {
    eo(r, t), rt(r), Zt(r, t), Qr(r), Xt(r), Jt(r);
    return;
  }
  nn(t);
}
function Qr(e) {
  Qt && Za(e, Qt);
}
function rt(e) {
  const t = Dg();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Qa(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Vr) === "true") return;
  const r = n.querySelector(`.${Yt}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Vr, "true");
}
function Dg() {
  try {
    return _s() === "replace";
  } catch {
    return !1;
  }
}
function Zt(e, t) {
  if (rt(e), e.querySelector(`[${pt}="${he(t.pendingId)}"]`)) return;
  const n = Lg(e, t);
  vg(n, t), Wg(n, Kg(t)).append(Zg(t));
}
function Lg(e, t) {
  const n = e.querySelector(`.${Yt}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Yt, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(Ag), i.textContent = Pg(t);
  const l = document.createElement("span");
  return l.classList.add(Va), l.textContent = t.summary, o.append(a, i, l), r.append(o), eh(e).append(r), r;
}
function Pg(e) {
  const t = E(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function vg(e, t) {
  const n = t.summaryLines ?? [], r = ti(n, t);
  if (r) {
    Ng(e, r, t);
    return;
  }
  Yg(e, n);
}
function Ng(e, t, n) {
  if (e.querySelector(`[${jr}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Gr, `${Gr}--${t.intent}`), r.setAttribute(jr, "true"), t.castingCheck && Zr(r, Fg(t.castingCheck), n.pendingId, "casting"), Og(t) && Zr(r, xg(t), n.pendingId, "effect"), zg(r, t), jg(r, t, n), Gg(r, t), e.append(r);
}
function Og(e) {
  return e.intent !== "casting";
}
function Fg(e) {
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
function xg(e) {
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
function Zr(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${h}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-section-header`);
  const i = document.createElement("strong");
  if (i.textContent = t.title, a.append(i), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, a.append(l);
  }
  if (o.append(a), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, o.append(l);
  }
  Mg(o, t), Hg(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Mg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = Bg(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function Bg(e, t) {
  const n = Ug(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of qg(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function Ug(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function qg(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Xr(e, "highest") : n.includes("kl") ? Xr(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Xr(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function zg(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(jh);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function jg(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = Vg(t, n);
  o.append(a), i && o.append(i);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(o, l), t.resistanceRollResult && r.append(Ya(t.resistanceRollResult)), e.append(r);
}
function Vg(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(pt, t.pendingId), n.setAttribute(Ma, "true"), n.setAttribute(Ba, e.resistanceSkill), n.setAttribute(Ua, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(qa, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(za, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(ja, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Ya(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = Ja(e), t;
}
function Hg(e, t, n, r, o) {
  const a = t.filter((m) => m.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(In, i), l.setAttribute("aria-expanded", "false"), l.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(xa, i), u.hidden = !0;
  for (const m of a) {
    const f = document.createElement("dt");
    f.textContent = m.label;
    const A = document.createElement("dd");
    A.textContent = m.value, u.append(f, A);
  }
  e.append(l, u);
}
function Gg(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function Wg(e, t) {
  const n = `[${qr}="${he(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(bg), o.setAttribute(qr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function Kg(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = ti(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Yg(e, t) {
  if (t.length === 0) return;
  const n = Qg(e);
  for (const r of t) {
    const o = Vh(r);
    if (n.querySelector(`[${zr}="${he(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(zr, o), n.append(a);
  }
}
function Qg(e) {
  const t = e.querySelector(`.${Hr}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Hr), e.append(n), n;
}
function Zg(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(pt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Ha), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(gt, e.pendingId), t.setAttribute(En, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Kt, e.choiceGroupId), t.setAttribute(Fa, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Xg(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Jg(e);
  return `${t} → ${n}`;
}
function Jg(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function eh(e) {
  return Qa(e) ?? e;
}
function Qa(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Za(e, t) {
  const n = yt(e);
  if (!n) return;
  const r = n.querySelectorAll(gg);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      ph(o, t);
    }));
}
function Xt(e) {
  const t = yt(e);
  if (!t) return;
  const n = t.querySelectorAll(hg);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      th(t, r);
    }));
}
function Jt(e) {
  const t = yt(e);
  if (!t) return;
  const n = t.querySelectorAll(yg);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      nh(t, r);
    }));
}
function th(e, t) {
  const n = t.getAttribute(In);
  if (!n) return;
  const r = e.querySelector(`[${xa}="${he(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function nh(e, t) {
  const n = t.getAttribute(pt), r = t.getAttribute(Ba), o = t.getAttribute(Ua) ?? (r ? va(r) : "Resistência");
  if (!n || !r) return;
  const a = ah(e, n), i = ih(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await lg(i, r);
    await dh(u.roll);
    const m = {
      skill: r,
      skillLabel: o,
      formula: u.formula,
      total: u.total,
      targetName: i.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: u.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    rh(t, m), oh(t, m), mh(n, m), await fh(e, n, m);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function rh(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(ja, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function oh(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Ya(t);
  if (r) {
    r.textContent = Ja(t);
    return;
  }
  n.append(o);
}
function ah(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = ht(e);
  return U(r)[t] ?? null;
}
function ih(e, t) {
  const n = e?.resistanceTargetActor;
  if (F(n)) return n;
  const o = e?.context?.targets.map(en).find(F) ?? null;
  if (o) return o;
  const a = t.getAttribute(qa) ?? e?.resistanceTargetActorId ?? null, i = a ? lh(a) : null;
  return i || ch(
    t.getAttribute(za) ?? e?.resistanceTargetName ?? sh(t)
  );
}
function sh(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Va}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function en(e) {
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
function lh(e) {
  const n = game.actors?.get?.(e);
  return F(n) ? n : Xa().map((a) => Le(a)).find((a) => a?.id === e) ?? null;
}
function ch(e) {
  const t = ce(e);
  if (!t) return null;
  const n = Xa().filter((a) => ce(uh(a)) === t).map((a) => Le(a)).find(F) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => F(a) && ce(a.name) === t);
  return F(o) ? o : null;
}
function Xa() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function uh(e) {
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
function Ja(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function dh(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function mh(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function fh(e, t, n) {
  const r = ht(e);
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
function ht(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return B(r?.get?.(n));
}
async function ph(e, t) {
  const n = e.getAttribute(gt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    ei(e, e.getAttribute(En) ?? "✓ Automação aplicada"), gh(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function ei(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Ha), e.removeAttribute(gt), e.removeAttribute(En);
}
function gh(e) {
  const t = e.getAttribute(Kt);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Kt}="${he(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(Fa) ?? "✓ Outra opção escolhida";
    ei(o, a);
  }
}
function ti(e, t) {
  const n = e.map(Dn).filter(qh), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = E(e, "Forma"), a = E(e, "Custo"), i = E(e, "Dados") ?? E(e, `Dados (${r.label})`), l = E(e, "Tipo"), u = E(e, "Resistência"), m = E(e, "Resistência Perícia"), f = E(e, "Resistência Rótulo") ?? (m ? va(m) : null), A = ni(e, "Observação"), T = e.filter((g) => bh(g, r)), R = hh(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: i,
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
function hh(e) {
  const t = e.map(Dn).find((a) => a?.intent === "casting") ?? null, n = E(e, "Conjuração DT"), r = E(e, "Conjuração Resultado");
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
function Dn(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: yh(n)
  } : null;
}
function yh(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function E(e, t) {
  return ni(e, t)[0] ?? null;
}
function ni(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function bh(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Dn(e) ? !1 : e.trim().length > 0;
}
function Ah(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    tn(r, e, t) && n.set(r.pendingId, r);
  for (const r of Ch(e))
    tn(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function tn(e, t, n) {
  const r = G(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !Jr(n, "itemId", e.itemId) ? !1 : !e.actorId || Jr(n, "actorId", e.actorId);
}
function Jr(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${Hh(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function _h(e) {
  const t = he(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Th(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (tn(e, null, t))
      return t;
  return null;
}
function Rh() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function eo(e, t) {
  const n = ht(e);
  if (!n) return !1;
  try {
    const r = U(n);
    return r[t.pendingId] = vn(t, G(n)), await ge(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Ln(e) {
  const t = ii(e);
  if (!t) return !1;
  try {
    const n = U(t);
    return n[e.pendingId] = vn(e, G(t)), await ge(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function ri(e) {
  for (const t of _g)
    globalThis.setTimeout(() => {
      nn(e);
    }, t);
}
async function nn(e) {
  const t = ii(e);
  if (Pn(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await Ln(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function $h(e, t) {
  const n = ai(e.context.message);
  if (n)
    try {
      const r = U(n), o = r[e.pendingId] ?? vn(e, G(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await ge(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function Ch(e) {
  return Object.values(U(B(e))).filter(Fe);
}
function U(e) {
  if (!e) return {};
  const t = {}, n = Pn(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(oi(e)))
    t[r] ??= o;
  return t;
}
function wh(e) {
  return Object.values(oi(B(e))).filter(Fe);
}
function oi(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, Na);
  if (!me(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Fe(o) && (n[r] = o);
  return n;
}
async function ge(e, t) {
  typeof e.setFlag == "function" && (await Eh(e, t), await kh(e, t));
}
async function kh(e, t) {
  await Promise.resolve(e.setFlag?.(c, Na, t));
}
function Pn(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, Oa);
  return Bh(t) ? t : null;
}
async function Eh(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Fe).sort((a, i) => a.createdAt - i.createdAt);
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
      actorName: Ih(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(c, Oa, o));
}
function Ih(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function vn(e, t) {
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
function ai(e) {
  const t = B(e);
  if (t?.setFlag)
    return t;
  const n = Sh(e);
  if (n?.setFlag)
    return n;
  const r = G(e);
  if (!r) return null;
  const o = game.messages;
  return B(o?.get?.(r));
}
function Sh(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(B).find((n) => typeof n?.setFlag == "function") ?? null;
}
function ii(e) {
  const t = ai(e.context.message);
  if (t) return t;
  const n = e.messageId ? Dh(e.messageId) : null;
  if (n) return n;
  const r = ci().slice().reverse();
  return r.find((o) => Lh(o, e)) ?? r.find((o) => Ph(o, e)) ?? null;
}
function Dh(e) {
  const t = game.messages;
  return B(t?.get?.(e));
}
function Lh(e, t) {
  const n = G(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!si(e, t)) return !1;
  const o = li(e);
  return !t.actorId || !o || o === t.actorId;
}
function Ph(e, t) {
  if (!Nh(e, t)) return !1;
  const n = li(e);
  return t.actorId && n === t.actorId ? !0 : si(e, t);
}
function si(e, t) {
  const n = ce(vh(e));
  if (!n) return !1;
  const r = ce(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = ce(t.itemId);
  return !!(o && n.includes(o));
}
function vh(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function li(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Nh(e, t) {
  const n = Oh(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Tg;
}
function Oh(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function B(e) {
  return e && typeof e == "object" ? e : null;
}
function Fe(e) {
  return me(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && Z(e.resistanceTargetActorId) && Z(e.resistanceTargetName) && Uh(e.resistanceRollResult) && Fh(e.actionPayload) && Lt(e.title) && Lt(e.buttonLabel) && Lt(e.executedLabel) && Z(e.choiceGroupId) && Z(e.skippedLabel) && Z(e.actionSectionId) && Z(e.actionSectionTitle) && zh(e.summaryLines) : !1;
}
function Fh(e) {
  return e == null ? !0 : me(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && xh(e.resource) && Mh(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function xh(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Mh(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Bh(e) {
  return me(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && me(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Fe) : !1;
}
function Uh(e) {
  return e == null ? !0 : me(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function qh(e) {
  return e !== null;
}
function me(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function S(e) {
  return e === null || typeof e == "string";
}
function Lt(e) {
  return e === void 0 || typeof e == "string";
}
function Z(e) {
  return e == null || typeof e == "string";
}
function zh(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function jh(e) {
  return typeof e == "string" && e.length > 0;
}
function ci() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(B).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(B).filter((r) => r !== null) : [];
}
function yt(e) {
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
function Vh(e) {
  return e.trim().toLowerCase();
}
function Hh(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function he(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const to = 1e3;
class Gh {
  constructor(t, n, r, o, a, i) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = i, this.ritualAssistant = new up(
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
      settings: jn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = jn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = on(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && ey(t.item) && n.executionMode === "ask") {
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
    if (await vr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Nt(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await Dt(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Dt(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Sn(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = ry(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await Xe(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await wg(t), await kg(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || ($g(
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
    if (await vr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Nt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      ty(t.item)
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
      return o.ok ? (Jh(n, o.value), await Wh(o.value), {
        ok: !0,
        executedLabel: Kh(o.value)
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
    const n = Pt(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && Pt(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== t.id && (this.pendingExecutions.delete(o), await Dt(
        o,
        ro(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Ot();
    await Cg({
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
    for (const i of r) {
      const l = Ot();
      a ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: i,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Kr({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: i.label,
        executedLabel: i.executedLabel,
        choiceGroupId: Pt(i),
        skippedLabel: ro(i),
        actionSectionId: i.actionSectionId,
        actionSectionTitle: i.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: i.actor,
        resistanceTargetActorId: i.actor.id ?? null,
        resistanceTargetName: i.actorName,
        actionPayload: ny(i)
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
    const r = Ot();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Kr({
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
    const n = Date.now(), r = oo(t);
    for (const [a, i] of this.recentExecutionKeys.entries())
      n - i > to && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= to;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(oo(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = Nt(
      t,
      n,
      r,
      o
    );
  }
}
async function Wh(e) {
  const t = Xh();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: Yh(e)
      });
    } catch (n) {
      d.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function Kh(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function Yh(e) {
  const t = e.instances.map((i) => {
    const l = i.blocked > 0 ? ` <span class="muted">(RD ${i.blocked})</span>` : "";
    return `<li><strong>${Ye(i.label ?? "Dano")}</strong>: ${i.inputAmount} → ${i.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = Qh(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Ye(e.conditions.join(", "))}</li>` : "";
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
function Qh(e) {
  const t = Zh(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Ye(o)}</li>`;
}
function Zh(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = no(n?.value);
  return r === null ? null : {
    value: r,
    max: no(n?.max)
  };
}
function no(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Xh() {
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
function Pt(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function ro(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function Jh(e, t) {
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
function ey(e) {
  return e.type === "ritual";
}
function ty(e) {
  return Tf(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function ny(e) {
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
function ry(e) {
  const t = e.actorUuid ? oy(e.actorUuid) : null;
  if (fe(t)) return t;
  const n = e.actorId ? ay(e.actorId) : null;
  return n || iy(e.actorName);
}
function oy(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function ay(e) {
  const n = game.actors?.get?.(e);
  if (fe(n)) return n;
  for (const r of di()) {
    const o = Nn(r);
    if (o?.id === e) return o;
  }
  return null;
}
function iy(e) {
  const t = vt(e);
  if (!t) return null;
  for (const o of di()) {
    const a = sy(o);
    if (vt(a) === t) {
      const i = Nn(o);
      if (i) return i;
    }
  }
  const r = game.actors?.find?.(
    (o) => fe(o) && vt(o.name) === t
  );
  return fe(r) ? r : null;
}
function di() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function sy(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Nn(e)?.name ?? null;
}
function Nn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (fe(t)) return t;
  const n = e.document?.actor;
  return fe(n) ? n : null;
}
function vt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function fe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Nt(e, t, n, r) {
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
function oo(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Ot() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class ly {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = ve(t);
    for (const i of n) {
      const l = i.itemId ? a.find((f) => f.id === i.itemId) ?? null : null, u = i.match?.preset ?? null;
      if (!l || !u) {
        o.push(i);
        continue;
      }
      await this.automationBinder.applyPreset(l, u);
      const m = await this.itemPatches.applyPresetItemPatch(l, u);
      r.push({
        itemId: l.id ?? null,
        itemName: l.name ?? "Ritual sem nome",
        presetId: u.id,
        presetLabel: u.label,
        previousStatus: i.status,
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
class cy {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = ve(t).map((l) => this.analyzeRitual(l)), r = n.filter(He("upToDate")), o = n.filter(He("available")), a = n.filter(He("outdated")), i = n.filter(He("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: o,
      outdated: a,
      unsupported: i,
      canApply: o.length > 0 || a.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = uy(t);
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
      reason: dy(r, n.preset)
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
    preset: e.match ? it(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function uy(e) {
  const t = e.getFlag(c, "automation");
  return an(t) ? t : null;
}
function dy(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function He(e) {
  return (t) => t.status === e;
}
class my {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = ln(t.transaction);
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
    const n = _(t.actorName), r = _(t.resource), o = _(ao(t)), a = _(py(t));
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
    const r = _(n.title ?? "Automação"), o = n.message ? `<p>${_(n.message)}</p>` : "", a = _(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), i = _(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((g) => _(g.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map(
      (g) => `<li><strong>${_(g.id)}:</strong> ${_(g.formula)} = ${g.total} <em>(${_(fy(g.intent))})</em>${g.damageType ? ` — ${_(g.damageType)}` : ""}</li>`
    ), m = t.ritualCosts.map(
      (g) => `<li><strong>${_(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${_(g.resource)} (${_(gy(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${_(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${_(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (g) => `<li><strong>${_(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${_(g.actorName)}:</strong> ${_(ao(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), R = t.phases.map((g) => _(g)).join(" &rarr; ");
    return `
      <section class="${c}-card ${c}-workflow-card">
        <header class="${c}-card__header">
          <strong>${r}</strong>
          <span>${i}</span>
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
function fy(e) {
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
function ao(e) {
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
function py(e) {
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
function gy(e) {
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
function hy() {
  const e = new Iu(), t = new $d(e), n = new $u(), r = new Lu(), o = new Nu(r), a = new Ku(e), i = new Qu(), l = i.registerMany(
    Xi()
  );
  if (!l.ok)
    throw new Error(l.error.message);
  const u = new Yu(), m = new Gu(), f = Zm(), A = new zd(f), T = new cy(
    i
  ), R = new ly(
    T,
    u,
    m
  ), g = new Ed(), v = new my(g), be = new kd(), Ae = new Td(
    t,
    o,
    v,
    be
  ), _e = new wd(Ae, be), C = new Gh(
    _e,
    t,
    o,
    n,
    A,
    g
  );
  return C.addStrategy(
    new Vu(
      (q) => C.handleItemUsed(q)
    )
  ), {
    ordem: a,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: o,
    resources: t,
    damage: n,
    automationRegistry: i,
    automationBinder: u,
    itemPatches: m,
    conditionRegistry: f,
    conditions: A,
    debugOutput: g,
    chatMessages: v,
    workflowHooks: be,
    automation: Ae,
    workflow: _e,
    itemUseIntegration: C,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: R
  };
}
const { ApplicationV2: yy } = foundry.applications.api;
class ot extends yy {
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
      apply: ot.onApply,
      cancel: ot.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${N(rn)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${N(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Ft("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Ft("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Ft("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Ft(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${N(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? by(n) : _y(t)}
    </section>
  `;
}
function by(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Ay).join("")}</ol>`;
}
function Ay(e) {
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
function _y(e) {
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
const at = `${c}.manageRitualPresets`, io = `__${c}_ritualPresetHeaderControlRegistered`, Ty = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Ry(e) {
  const t = globalThis;
  if (!t[io]) {
    for (const n of Ty)
      Hooks.on(n, (r, o) => {
        $y(r, o, e);
      });
    t[io] = !0, d.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function $y(e, t, n) {
  Array.isArray(t) && wy(e) && (Cy(e, n), !t.some((r) => r.action === at) && t.push({
    action: at,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), mi(e, n);
    }
  }));
}
function Cy(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[at] && (e.options.actions[at] = (n) => {
    n.preventDefault(), n.stopPropagation(), mi(e, t);
  }));
}
function wy(e) {
  if (!game.user?.isGM) return !1;
  const t = fi(e);
  return t ? t.type === "agent" && ve(t).length > 0 : !1;
}
function mi(e, t) {
  const n = fi(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new ot(n, t).render({ force: !0 });
}
function fi(e) {
  return so(e.actor) ? e.actor : so(e.document) ? e.document : null;
}
function so(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const pi = "data-paranormal-toolkit-ritual-roll-config", xe = "data-paranormal-toolkit-ritual-roll-field", te = "data-paranormal-toolkit-ritual-roll-action", lo = `__${c}_ritualRollConfigBlockRegistered`, ky = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], Ey = [
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
function Iy() {
  const e = globalThis;
  if (!e[lo]) {
    Sy();
    for (const t of ky)
      Hooks.on(t, (...n) => {
        Dy(n[0], n[1]);
      });
    e[lo] = !0, d.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function Sy() {
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
function Dy(e, t) {
  const n = Vy(e);
  if (!n || n.type !== "ritual") return;
  const r = Wy(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  Py(o);
  const a = hi(n), i = Ea(n), l = Hy(n), u = vy(n, i, a, l);
  By(u, n, a, l), Ly(o, u), On(u);
}
function Ly(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function Py(e) {
  for (const t of Array.from(e.querySelectorAll(`[${pi}]`)))
    t.remove();
}
function vy(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${c}-ritual-roll-config`), o.setAttribute(pi, e.uuid ?? e.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${c}-ritual-roll-config__header`);
  const i = document.createElement("div");
  i.classList.add(`${c}-ritual-roll-config__title`), i.append(co("strong", "Paranormal Toolkit")), i.append(co("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${c}-ritual-roll-config__badge`), l.textContent = bi(t) ? "Configurada" : "Rascunho", a.append(i, l), o.append(a);
  const u = document.createElement("p");
  u.classList.add(`${c}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const m = document.createElement("div");
  m.classList.add(`${c}-ritual-roll-config__fields`), m.append(Ny(t, r)), m.append(Oy(t, r)), m.append(Fy(t, r)), o.append(m), o.append(xy(t, n, r)), o.append(My(r));
  const f = document.createElement("p");
  return f.classList.add(`${c}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function Ny(e, t) {
  const n = bt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(xe, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = _f(o), a.selected = e.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function Oy(e, t) {
  const n = bt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(xe, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const a of Ey) {
    const i = document.createElement("option");
    i.value = a.value, i.textContent = a.label, i.selected = e.damageType === a.value, r.append(i);
  }
  return n.append(r), n;
}
function Fy(e, t) {
  const n = bt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(xe, "utilityLabel"), n.append(r), n;
}
function xy(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${c}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${c}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const a = document.createElement("div");
  return a.classList.add(`${c}-ritual-roll-config__forms-grid`), a.append(xt("base", "Padrão", e.forms.base.formula, !0, n)), a.append(xt("discente", "Discente", e.forms.discente.formula, t.discente, n)), a.append(xt("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(a), r;
}
function xt(e, t, n, r, o) {
  const a = bt(t);
  a.classList.add(`${c}-ritual-roll-config__form-card`), a.dataset.ritualRollForm = e;
  const i = document.createElement("input");
  if (i.type = "text", i.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", i.value = n, i.disabled = !o || !r, i.setAttribute(xe, `formula.${e}`), a.append(i), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", a.append(l);
  }
  return a;
}
function My(e) {
  const t = document.createElement("div");
  t.classList.add(`${c}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(te, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(te, "clear"), t.append(n, r), t;
}
function bt(e) {
  const t = document.createElement("label");
  t.classList.add(`${c}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function co(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function By(e, t, n, r) {
  ye(e, "intent")?.addEventListener("change", () => On(e)), fo(e, "system.studentForm")?.addEventListener("change", () => uo(e, t)), fo(e, "system.trueForm")?.addEventListener("change", () => uo(e, t)), e.querySelector(`[${te}="save"]`)?.addEventListener("click", () => {
    r && Uy(e, t, n);
  }), e.querySelector(`[${te}="clear"]`)?.addEventListener("click", () => {
    r && qy(e, t);
  });
}
async function Uy(e, t, n) {
  const r = e.querySelector(`[${te}="save"]`);
  r?.setAttribute("disabled", "true"), ue(e, "Salvando configuração...");
  try {
    const o = zy(e, n);
    await bf(t, o), gi(e, o), ue(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), ue(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function qy(e, t) {
  const n = e.querySelector(`[${te}="clear"]`);
  n?.setAttribute("disabled", "true"), ue(e, "Limpando configuração...");
  try {
    await Af(t);
    const r = Ea(t);
    jy(e, r), gi(e, r), ue(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), ue(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function gi(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__badge`);
  n && (n.textContent = bi(t) ? "Configurada" : "Rascunho");
}
function zy(e, t) {
  return {
    schemaVersion: 1,
    intent: yi(ye(e, "intent")?.value),
    damageType: po(e, "damageType"),
    utilityLabel: po(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Qe(e, "formula.base") },
      discente: { formula: Qe(e, "formula.discente") },
      verdadeiro: { formula: Qe(e, "formula.verdadeiro") }
    }
  };
}
function jy(e, t) {
  oe(e, "intent", t.intent), oe(e, "damageType", t.damageType ?? ""), oe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), oe(e, "formula.base", t.forms.base.formula), oe(e, "formula.discente", t.forms.discente.formula), oe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), On(e);
}
function On(e) {
  const t = yi(ye(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function uo(e, t) {
  const n = hi(t);
  mo(e, "discente", n.discente), mo(e, "verdadeiro", n.verdadeiro);
}
function mo(e, t, n) {
  const r = ye(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${te}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const a = r.closest(`.${c}-ritual-roll-config__field`), i = a?.querySelector("small");
  if (a) {
    if (n) {
      i?.remove();
      return;
    }
    if (!i) {
      const l = document.createElement("small");
      l.textContent = "Indisponível neste ritual.", a.append(l);
    }
  }
}
function ue(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function hi(e) {
  const t = Gy(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function Vy(e) {
  return go(e.item) ? e.item : go(e.document) ? e.document : null;
}
function Hy(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function Gy(e) {
  const t = e.system;
  return Ky(t) ? t : {};
}
function fo(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ye(e, t) {
  return e.querySelector(`[${xe}="${Yy(t)}"]`);
}
function Qe(e, t) {
  return ye(e, t)?.value.trim() ?? "";
}
function po(e, t) {
  const n = Qe(e, t);
  return n.length > 0 ? n : null;
}
function oe(e, t, n) {
  const r = ye(e, t);
  r && (r.value = n);
}
function yi(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function bi(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function Wy(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function go(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function Ky(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function Yy(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let J = null;
Hooks.once("init", () => {
  Yi(), As(), Js(), au(), d.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Gn.isSupportedSystem()) {
    d.warn(
      `Sistema não suportado: ${Gn.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  J = hy(), J.itemUseIntegration.registerStrategies(), Ys(J.conditions), Ps(J), js(), Bs(), du(), Ry(J), Iy(), d.info("Inicializado para o sistema Ordem Paranormal."), d.info(
    `API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${rn} inicializado.`);
});
function Qy() {
  if (!J)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return J;
}
export {
  Qy as getToolkitServices
};
//# sourceMappingURL=main.js.map
