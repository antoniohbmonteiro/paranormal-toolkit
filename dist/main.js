const c = "paranormal-toolkit", On = "Paranormal Toolkit", Ms = "ordemparanormal";
class Fe {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function _t(e) {
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
class m {
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
function _(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function Mn(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Fn(t) ? _(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Fs(e) {
  return Fn(e.getFlag(c, "automation"));
}
function Fn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Us(t.source) && Bs(t.definition);
}
function Bs(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(qs) && (t.conditionApplications === void 0 || Ws(t.conditionApplications));
}
function Us(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function qs(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return zs(t);
    case "spendRitualCost":
      return js(t);
    case "rollFormula":
      return Gs(t);
    case "modifyResource":
      return Vs(t);
    case "chatCard":
      return Hs(t);
    default:
      return !1;
  }
}
function zs(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && oa(t);
}
function js(e) {
  return e.type === "spendRitualCost";
}
function Gs(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || Js(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function Vs(e) {
  const t = e;
  return t.type === "modifyResource" && aa(t.actor) && Zs(t.resource) && Xs(t.operation) && oa(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Hs(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Ws(e) {
  return Array.isArray(e) && e.every(Ks);
}
function Ks(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && aa(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || Ys(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel));
}
function Ys(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || el(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Qs(t.expiry));
}
function Qs(e) {
  return e === "turnStart" || e === "turnEnd";
}
function oa(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function aa(e) {
  return e === "self" || e === "target";
}
function Zs(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Xs(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Js(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function el(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function Bn(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Ar);
    if (rl(t))
      return Array.from(t).filter(Ar);
  }
  return [];
}
function tl(e) {
  return Bn(e)[0] ?? null;
}
function nl(e) {
  return Bn(e).find(Fs) ?? null;
}
function rl(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ar(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Be(e) {
  return Bn(e).filter((t) => t.type === "ritual");
}
function ia(e) {
  return Be(e)[0] ?? null;
}
function ol(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(_t);
      return m.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Ce("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Ve(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(wr);
      return m.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Ce("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Ve(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const i = await rn(e, r, o.value);
      m.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: i }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Ce("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Ve(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        m.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await rn(e, n, r.preset);
      m.info(`Melhor preset aplicado em ${n.name}.`, { match: wr(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Tr(e);
    },
    async applyBestPresetsToActorRituals() {
      return Tr(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Ce("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Ve(t);
      n && (await e.automationBinder.clear(n), m.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Tr(e) {
  const t = Ce("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Be(t);
  if (n.length === 0)
    return m.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), $r(t);
  const r = $r(t, n.length);
  for (const o of n) {
    const i = e.automationRegistry.findForItem(o)[0];
    if (!i) {
      r.skipped.push({
        itemId: o.id ?? null,
        itemName: o.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await rn(e, o, i.preset);
    r.applied.push(al(o, i, s));
  }
  return m.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), il(r), r;
}
async function rn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function al(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: _t(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function $r(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function il(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function wr(e) {
  return {
    preset: _t(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Ce(e) {
  const t = Fe.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ve(e) {
  const t = ia(e);
  return t || (m.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function re(e) {
  return e ? {
    id: e.id,
    source: {
      ...sl(e.sourceActor),
      token: e.sourceToken
    },
    item: ll(e.item),
    targets: e.targets.map(cl),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Rr(e.rollRequests, sa),
    rolls: Rr(e.rolls, ul),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Un),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Un(e) {
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
function sl(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function ll(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function cl(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function sa(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ul(e) {
  return {
    ...sa(e),
    total: e.total
  };
}
function Rr(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function dl(e) {
  return {
    getSelected() {
      return Fe.getSelectedActor();
    },
    logResources() {
      const t = Y(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      m.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && m.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await se(
        e,
        "Gasto de PE",
        Y("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await se(
        e,
        "Gasto de PD",
        Y("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await se(
        e,
        "Dano em PV",
        Y("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await se(
        e,
        "Cura de PV",
        Y("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await se(
        e,
        "Dano em SAN",
        Y("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await se(
        e,
        "Recuperação de SAN",
        Y("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function se(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    ml(o.error);
    return;
  }
  const i = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: i });
  } catch (s) {
    m.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  m.info(`${t} realizado:`, Un(i));
}
function Y(e) {
  const t = Fe.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ml(e) {
  if (e.reason === "update-failed") {
    m.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    m.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  m.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const x = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function fl() {
  He(x.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), He(x.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), He(x.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), He(x.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function on() {
  return {
    enabled: We(x.enabled),
    console: We(x.console),
    ui: We(x.ui),
    chat: We(x.chat)
  };
}
async function q(e, t) {
  await game.settings.set(c, x[e], t);
}
function He(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function We(e) {
  return game.settings.get(c, e) === !0;
}
function pl() {
  return {
    status() {
      return on();
    },
    async enable() {
      await q("enabled", !0);
    },
    async disable() {
      await q("enabled", !1);
    },
    async enableConsole() {
      await q("console", !0);
    },
    async disableConsole() {
      await q("console", !1);
    },
    async enableUi() {
      await q("ui", !0);
    },
    async disableUi() {
      await q("ui", !1);
    },
    async enableChat() {
      await q("chat", !0);
    },
    async disableChat() {
      await q("chat", !1);
    }
  };
}
const la = "ritual.costOnly", ca = "ritual.simpleHealing", gl = "ritual.eletrocussao", ua = "ritual.simpleDamage", da = "generic.simpleHealing", ma = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function hl() {
  return [
    _l(),
    bl(),
    yl(),
    Al(),
    Tl()
  ];
}
function _l() {
  return {
    id: la,
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
function bl() {
  return {
    id: ca,
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
    automation: fa(),
    itemPatch: wl()
  };
}
function yl() {
  return {
    id: gl,
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
    automation: $l(),
    itemPatch: Rl()
  };
}
function Al() {
  return {
    id: ua,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: qn()
  };
}
function Tl() {
  return {
    id: da,
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
function fa(e = "2d8+2") {
  return pa(
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
function $l() {
  return {
    ...qn("3d6", {
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
function qn(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", i = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return pa(
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
          message: i
        }
      ]
    },
    "damage",
    e
  );
}
function wl() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: ma,
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
function Rl() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: ma,
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
function pa(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function zn() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ce(t.id),
    actorId: ce(t.actor?.id),
    sceneId: ce(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function ga() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: ce(e.id),
    actorId: ce(t?.id),
    sceneId: ce(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ce(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function kl(e) {
  return {
    logFirstRitualCost() {
      const t = Q("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = Z(t);
      if (!n) return;
      const r = e.ritualCosts.getCost({ actor: t, ritual: n });
      if (!r.ok) {
        m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      m.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: n.name,
        cost: r.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${n.name} custa ${r.value.amount} ${r.value.resource} (${r.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, n = "PE") {
      const r = Q("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = Z(r);
      if (o) {
        if (!Il(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(c, "ritual.cost", {
          resource: n,
          amount: t
        }), m.info(`Custo customizado aplicado em ${o.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = Q("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = Z(t);
      n && (await n.unsetFlag(c, "ritual.cost"), m.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = Q("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = Z(t);
      if (!n) return;
      const r = e.automationRegistry.require(la);
      if (!r.ok) {
        m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), m.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = Q("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = Z(n);
      if (!r) return;
      if (!kr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(ca);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: fa(t)
      }), m.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = Q("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = Z(n);
      if (!r) return;
      if (!kr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(ua);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: qn(t)
      }), m.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = Q("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = Z(t);
      n && await El(e, t, n);
    }
  };
}
async function El(e, t, n) {
  const r = Mn(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: ga(),
    item: n,
    targets: zn()
  });
  if (!o.ok) {
    Cl(o.error);
    return;
  }
  m.info("Automação de ritual executada com sucesso.", re(o.value.context));
}
function Cl(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    m.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    m.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  m.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Q(e) {
  const t = Fe.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Z(e) {
  const t = ia(e);
  return t || (m.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Il(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function kr(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Sl = ["disabled", "ask", "automatic"], Ll = ["buttons", "confirm"], ha = "ask";
function Dl(e) {
  return typeof e == "string" && Sl.includes(e);
}
function Pl(e) {
  return typeof e == "string" && Ll.includes(e);
}
function vl(e) {
  return Dl(e) ? e : Pl(e) ? "ask" : ha;
}
const Nl = ["keep", "replace"], xl = ["manual", "assisted"], _a = "keep", ba = "assisted", Ol = !0, I = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Ml() {
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
    default: ha
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
    default: _a
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
    default: ba
  }), game.settings.register(c, I.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Ol
  }), game.settings.register(c, I.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Er() {
  const e = vl(game.settings.get(c, I.executionMode)), t = Aa(game.settings.get(c, I.systemCardMode)), n = Ta(game.settings.get(c, I.damageResolutionMode));
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: ya()
  };
}
function Fl() {
  return Aa(game.settings.get(c, I.systemCardMode));
}
function Bl() {
  return Ta(game.settings.get(c, I.damageResolutionMode));
}
function ya() {
  return game.settings.get(c, I.ritualCastingCheckEnabled) === !0;
}
async function X(e) {
  await game.settings.set(c, I.executionMode, e);
}
function Aa(e) {
  return Nl.includes(e) ? e : _a;
}
function Ta(e) {
  return xl.includes(e) ? e : ba;
}
function Ul(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await X("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await X("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await X(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await X("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await X("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await X("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await X("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const ql = [
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
function zl(e) {
  return {
    phases() {
      return ql;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Mt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = nl(t);
      if (!n) {
        m.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Cr(e, t, n);
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
      if (!Vl(n)) {
        m.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Gl(n) ?? Mt("Nenhum ator encontrado para executar automação do item.");
      r && await Cr(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Mt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = tl(t);
      if (!n) {
        m.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(da);
        if (!r.ok) {
          m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(n, r.value), m.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (r) {
        m.error("Falha ao configurar automação de teste no item.", r), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function Cr(e, t, n) {
  const r = Mn(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: ga(),
    item: n,
    targets: zn()
  });
  if (!o.ok) {
    jl(o.error);
    return;
  }
  m.info("Automação executada com sucesso.", re(o.value.context));
}
function jl(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    m.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    m.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  m.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Mt(e) {
  const t = Fe.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Gl(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Vl(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Hl(e) {
  const t = dl(e), n = ol(e), r = kl(e), o = zl(e), i = pl(), s = Ul(e);
  return {
    actor: t,
    automation: n,
    ritual: r,
    workflow: o,
    output: i,
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
function Wl(e) {
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
      const r = Ir();
      if (r.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const o = await Promise.all(
        r.map(
          (i) => e.applyCondition({
            actor: i,
            conditionId: t,
            duration: n.duration,
            originUuid: n.originUuid,
            source: n.source ?? "api.applyToSelectedTokens",
            refreshExisting: n.refreshExisting
          })
        )
      );
      return Kl(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Ir();
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
      return Yl(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Ir() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const i = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(i, r);
  }
  return Array.from(t.values());
}
function Kl(e) {
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
function Yl(e) {
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
function Ql(e) {
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
    conditions: Wl(e.conditions),
    debug: Hl(e)
  }, n = globalThis;
  return n[c] = t, n.ParanormalToolkit = t, t;
}
class Sr {
  static isSupportedSystem() {
    return game.system.id === Ms;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Zl() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ue(t.id),
    actorId: ue(t.actor?.id),
    sceneId: ue(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function $a() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: ue(e.id),
    actorId: ue(t?.id),
    sceneId: ue(e.scene?.id),
    name: n
  };
}
function Xl(e, t = $a()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Jl(e) {
  if (!nc(e)) return null;
  const t = e.getFlag(c, "workflow");
  return tc(t) ? t : null;
}
function ec() {
  return `flags.${c}.workflow`;
}
function Lr(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), n = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || n !== void 0;
}
function Dr(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return an(t) || an(n);
}
function tc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function nc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ue(e) {
  return an(e) ? e : null;
}
function an(e) {
  return typeof e == "string" && e.length > 0;
}
function rc() {
  const e = (t, n) => {
    oc(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function oc(e, t) {
  const n = Jl(e);
  if (!n || n.targets.length === 0) return;
  const r = ic(t);
  if (!r || r.querySelector(`.${c}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(ac(n));
}
function ac(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Pr("Origem", e.source.name)), t.append(Pr("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Pr(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${c}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function ic(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function sc() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!lc(r) || !cc(e) || Lr(e) || Lr(t)) return;
    const o = Zl();
    if (o.length === 0 || !Dr(e) && !Dr(t)) return;
    const i = $a();
    e.updateSource({
      [ec()]: Xl(o, i)
    }), m.info("Targets capturados para ChatMessage.", { source: i, targets: o });
  });
}
function lc(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function cc(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let vr = !1, Ft = !1, Bt = !1, Ke = null;
const uc = 1e3, dc = 750, mc = 1e3;
function fc(e) {
  vr || (Hooks.on("combatTurnChange", (t) => {
    gc(e, Nr(t));
  }), Hooks.on("deleteCombat", (t) => {
    hc(e, Nr(t));
  }), vr = !0, pc(e));
}
function pc(e) {
  bt() && (Ft || (Ft = !0, globalThis.setTimeout(() => {
    Ft = !1, jn(e, "ready");
  }, uc)));
}
function gc(e, t) {
  bt() && t && (Ke && globalThis.clearTimeout(Ke), Ke = globalThis.setTimeout(() => {
    Ke = null, jn(e, "combat-turn-change", t);
  }, dc));
}
function hc(e, t) {
  bt() && t && (Bt || (Bt = !0, globalThis.setTimeout(() => {
    Bt = !1, jn(e, "combat-deleted", t);
  }, mc)));
}
async function jn(e, t, n) {
  if (bt())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && m.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const o of r.failures)
        m.warn(o.message);
    } catch (r) {
      m.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function bt() {
  return game.user?.isGM === !0;
}
function Nr(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const wa = {
  enabled: "dice.animations.enabled"
};
function _c() {
  game.settings.register(c, wa.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function bc() {
  return {
    enabled: game.settings.get(c, wa.enabled) === !0
  };
}
const yt = "chatCard", xr = "data-paranormal-toolkit-prompt-id", a = `${c}-item-use-prompt`, yc = `.${a}__title`, Ra = `.${a}__header`, Ac = `.${a}__roll-card`, Tc = `.${a}__roll-meta`, $c = `.${a}__roll-meta-pill`, Gn = `.${a}__resistance`, wc = `.${a}__resistance-header`, ka = `.${a}__resistance-description`, At = `.${a}__resistance-roll-button`, Ea = `.${a}__resistance-roll-result`, Or = `${a}__resistance-content`, Ca = `.${a}__workflow-section`, Ia = `.${a}__workflow-roll`, Vn = `${a}__workflow-roll--dice-open`, Hn = `.${a}__workflow-roll-formula`, Wn = `${a}__workflow-roll-formula--toggle`, Tt = `.${a}__workflow-dice-tray`, Rc = `.${a}__roll-detail-toggle`, kc = `.${a}__roll-detail-list`, Ec = `.${a}__ritual-element-badge`, Cc = `.${a}__ritual-metadata`, Ic = "casting-backlash", Sc = "data-paranormal-toolkit-action-section", Lc = "data-paranormal-toolkit-prompt-id", Dc = "data-paranormal-toolkit-pending-id", Mr = "data-paranormal-toolkit-casting-backlash-enhanced", Fr = `.${a}`, Pc = `.${a}__workflow-section--casting`, vc = `.${a}__workflow-section-header`, Nc = `.${a}__workflow-notes`, xc = `[${Sc}="${Ic}"]`, Br = `${a}__workflow-section-title-row`, Oc = `${a}__workflow-section-header--casting-backlash`, Sa = `${a}__casting-backlash-button`;
function Mc(e) {
  for (const t of Fc(e))
    Bc(t), Gc(t);
}
function Fc(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Fr) && t.add(e);
  for (const n of e.querySelectorAll(Fr))
    t.add(n);
  return Array.from(t);
}
function Bc(e) {
  const t = e.querySelector(xc);
  if (!t) return;
  const n = Uc(t);
  if (!n) return;
  const r = e.querySelector(`${Pc} ${vc}`);
  r && (r.classList.add(Oc), qc(r), zc(n), r.append(n), t.remove());
}
function Uc(e) {
  return e.querySelector(
    `button[${Dc}], button[${Lc}]`
  );
}
function qc(e) {
  const t = e.querySelector(`:scope > .${Br}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Br);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(Sa) || n.append(o));
  return n;
}
function zc(e) {
  if (e.getAttribute(Mr) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = jc(t, e.disabled);
  e.classList.add(Sa), e.setAttribute(Mr, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function jc(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Gc(e) {
  for (const t of e.querySelectorAll(Nc)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Vc(e) {
  for (const t of Array.from(e.querySelectorAll(Ca)))
    for (const n of Array.from(t.querySelectorAll(`${Rc}, ${kc}`)))
      n.remove();
}
const Ie = "data-paranormal-toolkit-prompt-id", Hc = "data-paranormal-toolkit-resistance-roll-result", Wc = "Conjuração DT";
function La(e) {
  const t = e.querySelector(At)?.getAttribute(Hc), n = Ne(t);
  if (n !== null) return n;
  const r = e.querySelector(Ea)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Ne(o?.[1] ?? null);
}
function Kn(e) {
  const t = Xc(e), n = Yc(t);
  if (n !== null) return n;
  const r = Qc(t);
  return r !== null ? r : Zc(e);
}
function Kc(e) {
  const t = e.getAttribute(Ie);
  if (!t) return null;
  const n = Pa(e), r = va(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => $t(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function G(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Da(e) {
  return G(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Yc(e) {
  const t = eu(e);
  return t.length === 0 ? null : Ne(tu(t, Wc));
}
function Qc(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : Ur(r, ["system", "ritual", "DT"]) ?? Ur(r, ["system", "ritual", "dt"]);
}
function Zc(e) {
  const t = Array.from(e.querySelectorAll(`.${a}__workflow-section--casting .${a}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Ne(n?.[1] ?? null);
}
function Xc(e) {
  const t = Jc(e);
  if (!t) return null;
  const n = Pa(e), r = va(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((i) => $t(i) ? i.pendingId === t : !1) ?? null;
}
function Jc(e) {
  return (e.closest(`[${Ie}]`) ?? e.querySelector(`[${Ie}]`) ?? e.parentElement?.querySelector(`[${Ie}]`) ?? null)?.getAttribute(Ie) ?? null;
}
function Pa(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return nu(o) ? o : null;
}
function va(e) {
  const t = e?.getFlag?.(c, yt);
  return $t(t) ? t : null;
}
function eu(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function tu(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function Ur(e, t) {
  let n = e;
  for (const r of t) {
    if (!$t(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Ne(typeof n == "string" ? n : null);
}
function Ne(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function nu(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function $t(e) {
  return !!(e && typeof e == "object");
}
const ru = `.${a}__actions`, Yn = `.${a}__actions-title`, st = `.${a}__button`, ou = "data-paranormal-toolkit-action-section", au = `${a}__button--executed`, iu = "data-paranormal-toolkit-executed-label";
function Na(e) {
  return G(e.querySelector(Yn)?.textContent);
}
function su(e, t) {
  const n = e.querySelector(Yn);
  n && (n.textContent = t);
}
function wt(e, t) {
  const n = G(t);
  return Array.from(e.querySelectorAll(`.${a}__workflow-section`)).find((r) => {
    const o = r.querySelector(`.${a}__workflow-section-header strong`)?.textContent;
    return G(o) === n;
  }) ?? null;
}
function Qn(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${a}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Ue(e) {
  const t = document.createElement("span");
  return t.classList.add(`${a}__button-label`), t.textContent = e, t;
}
const lu = "data-paranormal-toolkit-damage-resolution-state", qr = "data-paranormal-toolkit-damage-icon-enhanced", cu = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function uu(e, t) {
  t.classList.add(`${a}__actions--embedded`, `${a}__actions--damage-resolution`), su(t, "Aplicar dano"), du(e, t);
}
function du(e, t) {
  const n = Array.from(t.querySelectorAll(st)), r = zr(n, "normal"), o = zr(n, "half");
  if (!r || !o) {
    t.classList.add(`${a}__actions--compact`);
    return;
  }
  jr(r, "normal"), jr(o, "half");
  const i = mu();
  if (t.classList.toggle(`${a}__actions--assisted`, i === "assisted"), t.classList.toggle(`${a}__actions--manual`, i !== "assisted"), i !== "assisted") {
    z(r, !0), z(o, !0), Ye(t, "manual", null);
    return;
  }
  const s = La(e), l = Kn(e);
  if (l === null) {
    z(r, !0), z(o, !0), Ye(t, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (s === null) {
    z(r, !0), z(o, !1), Ye(t, "pending", null);
    return;
  }
  const u = s >= l;
  z(r, !u), z(o, u), Ye(
    t,
    u ? "resisted" : "failed",
    u ? `Resistiu: ${s} vs DT ${l}.` : `Falhou: ${s} vs DT ${l}.`
  );
}
function zr(e, t) {
  const n = cu[t];
  return e.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function jr(e, t) {
  if (e.getAttribute(qr) === "true") return;
  const n = e.textContent?.trim() ?? "";
  if (!n || n.startsWith("✓")) return;
  const r = document.createElement("i");
  r.classList.add(
    "fa-solid",
    t === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${a}__button-icon`
  ), r.setAttribute("aria-hidden", "true"), e.classList.add(
    `${a}__button--damage-resolution-action`,
    `${a}__button--damage-resolution-${t}`
  ), e.setAttribute(qr, "true"), e.setAttribute("aria-label", n), e.replaceChildren(r, Ue(n));
}
function z(e, t) {
  e.hidden = !t, e.classList.toggle(`${a}__button--damage-resolution-selected`, t);
}
function Ye(e, t, n) {
  e.setAttribute(lu, t);
  const r = e.querySelector(`.${a}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${a}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(Yn)?.after(o);
}
function mu() {
  try {
    return Bl();
  } catch {
    return "assisted";
  }
}
const xe = "data-paranormal-toolkit-effect-icon-enhanced", he = "data-paranormal-toolkit-effect-action-compacted", Rt = "data-paranormal-toolkit-effect-resistance-gate", Zn = "data-paranormal-toolkit-effect-section", Xn = "data-paranormal-toolkit-effect-label";
function fu(e) {
  return e.querySelector(`[${Zn}="true"]`);
}
function pu(e) {
  const t = hu(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? _u(), r = Eu(n, e.sourceActions, t);
  return r && n.setAttribute(Xn, r), bu(n, t, r), Ru(e.rollCard, n, e.after ?? e.fallbackAfter), ku(e.sourceActions, n), n;
}
function gu(e, t) {
  const n = t.querySelector(st);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (Oa(n, r)) {
    Iu(n);
    return;
  }
  const o = Fa(t, n, r);
  if (!Su(e, o)) {
    Ba(n);
    return;
  }
  const i = Kn(e), s = La(e);
  if (i === null || s === null) {
    Lu(n);
    return;
  }
  if (s >= i) {
    Du(n);
    return;
  }
  Pu(n, o);
}
function hu(e) {
  return e.sourceActions?.querySelector(st) ?? e.existingSection?.querySelector(st) ?? null;
}
function _u() {
  const e = document.createElement("section");
  return e.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-action`
  ), e.setAttribute(Zn, "true"), e;
}
function bu(e, t, n) {
  e.setAttribute(Zn, "true"), e.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-action`
  ), e.classList.remove(`${a}__actions`, `${a}__actions--effect-resolution`);
  const r = yu(e), o = Au(r);
  o.textContent = "Efeito";
  const i = Tu(e, r), s = $u(i);
  s.textContent = vu(n ?? Fa(e, t, t.textContent?.trim() ?? ""));
  const l = wu(i);
  t.parentElement !== l && l.append(t);
  const u = t.textContent?.trim() ?? "";
  !Oa(t, u) && !Cu(t, u) && Ma(t, n ?? u);
}
function yu(e) {
  const t = e.querySelector(`:scope > .${a}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${a}__workflow-section-header`), e.prepend(n), n;
}
function Au(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function Tu(e, t) {
  const n = e.querySelector(`:scope > .${a}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${a}__effect-section-body`), t.after(r), r;
}
function $u(e) {
  const t = e.querySelector(`:scope > .${a}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${a}__effect-section-label`), e.prepend(n), n;
}
function wu(e) {
  const t = e.querySelector(`:scope > .${a}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${a}__effect-section-action`), e.append(n), n;
}
function Ru(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function ku(e, t) {
  !e || e === t || e.remove();
}
function Eu(e, t, n) {
  const r = e.getAttribute(Xn);
  if (r && r.trim().length > 0) return r.trim();
  const o = t?.querySelector(`.${a}__effect-resolution-label`)?.textContent?.trim();
  return o || xa(n, n.textContent?.trim() ?? "");
}
function xa(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && G(n) !== "efeito aplicado") return n;
  const r = Kc(e);
  if (r) return r;
  const o = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && G(o) !== "aplicado" ? o : null;
}
function Oa(e, t) {
  return e.classList.contains(au) || G(t).includes("aplicado");
}
function Cu(e, t) {
  const n = e.getAttribute(Rt);
  if (n === "pending" || n === "resisted") return !0;
  const r = Da(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function Ma(e, t) {
  e.getAttribute(he) === "true" && e.getAttribute(xe) === "true" || (e.disabled = !1, e.classList.add(`${a}__button--effect-resolution-action`), e.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), e.setAttribute(he, "true"), e.setAttribute(xe, "true"), e.setAttribute(iu, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Qn("✦", `${a}__button-icon--effect`),
    Ue("Aplicar")
  ));
}
function Iu(e) {
  e.getAttribute(he) === "true" && G(e.textContent) === "✓ aplicado" || (e.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-applied`), e.classList.remove(
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), e.setAttribute(he, "true"), e.setAttribute(xe, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Qn("✓", `${a}__button-icon--effect-applied`),
    Ue("Aplicado")
  ));
}
function Fa(e, t, n) {
  const r = e.getAttribute(Xn) ?? e.querySelector(`.${a}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : xa(t, n) ?? n;
}
function Su(e, t) {
  if (!e.querySelector(Gn)) return !1;
  const n = Da(t);
  return n.includes("vulneravel") || n.includes("vulnerable");
}
function Lu(e) {
  e.disabled = !0, e.removeAttribute(he), e.removeAttribute(xe), e.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-resisted`
  ), e.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-waiting`), e.setAttribute(Rt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Ue("Role resistência"));
}
function Du(e) {
  e.disabled = !0, e.removeAttribute(he), e.removeAttribute(xe), e.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-waiting`
  ), e.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-resisted`), e.setAttribute(Rt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Qn("✓", `${a}__button-icon--effect-resisted`),
    Ue("Resistiu")
  );
}
function Pu(e, t) {
  Ba(e), Ma(e, t);
}
function Ba(e) {
  e.classList.remove(
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), e.removeAttribute(Rt);
}
function vu(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const Nu = {
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
}, xu = new Set(
  Object.values(Nu)
), Ou = {
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
function Mu(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Fu(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Ou[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : xu.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function Ua(e) {
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
function Fu(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class qa {
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
    const i = n.applyDamage;
    if (typeof i != "function")
      return p({
        actor: n,
        actorId: o,
        actorName: r,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const s = [], l = /* @__PURE__ */ new Set();
    let u = null;
    for (const [d, f] of t.instances.entries()) {
      const y = Bu(f, d);
      if (!y.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const T = Mu(f.damageType);
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
      if (y.amount === 0) {
        s.push(
          Uu(y.id, f, T.value)
        );
        continue;
      }
      try {
        const $ = await Promise.resolve(
          i.call(n, y.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: f.ignoreResistance === !0,
            nonLethal: f.nonLethal === !0
          })
        );
        for (const v of zu($.conditions))
          l.add(v);
        const g = qu($.newPV);
        g !== null && (u = g), s.push({
          id: y.id,
          label: f.label ?? Ua(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: Gr($.finalDamage, y.amount),
          blocked: Gr($.blocked, 0),
          damageType: f.damageType ? String(f.damageType) : null,
          systemDamageType: T.value,
          ignoreResistance: f.ignoreResistance === !0,
          nonLethal: f.nonLethal === !0
        });
      } catch ($) {
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: f,
          cause: $
        });
      }
    }
    return _({
      actor: n,
      actorId: o,
      actorName: r,
      totalRawDamage: s.reduce(
        (d, f) => d + f.inputAmount,
        0
      ),
      totalFinalDamage: s.reduce(
        (d, f) => d + f.finalDamage,
        0
      ),
      totalBlocked: s.reduce(
        (d, f) => d + f.blocked,
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
function Bu(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Uu(e, t, n) {
  return {
    id: e,
    label: t.label ?? Ua(n),
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
function Gr(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function qu(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function zu(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
async function za(e, t) {
  const n = await ju(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: Vu(n),
    total: Hu(n),
    diceBreakdown: Wu(n)
  };
}
function qe(e) {
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
async function ju(e, t) {
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
  return Gu(r);
}
function Gu(e) {
  return Vr(e) ? e : Array.isArray(e) ? e.find(Vr) ?? null : null;
}
function Vr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Vu(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Hu(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Wu(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Ku);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((i) => {
    if (!i || typeof i != "object") return [];
    const s = i.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Ku(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function Yu(e) {
  const t = document.createElement("div");
  t.classList.add(`${a}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${a}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${a}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const o = Zu(e.formula, e.diceBreakdown ?? null);
  return o && t.append(o), t;
}
function Qu(e) {
  const t = Array.from(e?.querySelectorAll(`.${a}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function Zu(e, t) {
  const n = Xu(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${a}__workflow-dice-tray`);
  for (const o of Ju(n, e)) {
    const i = document.createElement("span");
    i.classList.add(`${a}__workflow-die`), o.active || i.classList.add(`${a}__workflow-die--inactive`), i.textContent = String(o.value), r.append(i);
  }
  return r;
}
function Xu(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Ju(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Hr(e, "highest") : n.includes("kl") ? Hr(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Hr(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const i = !r && o === n;
    return i && (r = !0), { value: o, active: i };
  });
}
const Qe = "data-paranormal-toolkit-prompt-id", ja = "multiTargetResistanceResults", Ga = "multiTargetDamageApplications";
function ed(e) {
  const t = /* @__PURE__ */ new Map(), r = Ha(e)?.[ja];
  if (!V(r)) return t;
  for (const [o, i] of Object.entries(r))
    od(i) && i.targetId === o && t.set(o, i);
  return t;
}
async function td(e, t) {
  await Va(e, ja, t.targetId, t);
}
function nd(e) {
  const t = /* @__PURE__ */ new Map(), r = Ha(e)?.[Ga];
  if (!V(r)) return t;
  for (const [o, i] of Object.entries(r))
    ad(i) && i.targetId === o && t.set(o, i);
  return t;
}
async function rd(e, t) {
  await Va(
    e,
    Ga,
    t.targetId,
    t
  );
}
async function Va(e, t, n, r) {
  const o = Wa(e);
  if (!o) return;
  const i = Ka(e), s = Ya(i);
  if (!i || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const u = s.prompts.map((d) => {
    if (!V(d) || d.pendingId !== o) return d;
    const f = V(d[t]) ? d[t] : {};
    return l = !0, {
      ...d,
      [t]: {
        ...f,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(i.setFlag?.(c, yt, {
    ...s,
    prompts: u
  }));
}
function Ha(e) {
  const t = Wa(e);
  if (!t) return null;
  const n = Ka(e), r = Ya(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((i) => V(i) ? i.pendingId === t : !1) ?? null;
}
function Wa(e) {
  return (e.closest(`[${Qe}]`) ?? e.querySelector(`[${Qe}]`) ?? e.parentElement?.querySelector(`[${Qe}]`) ?? null)?.getAttribute(Qe) ?? null;
}
function Ka(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return sd(o) ? o : null;
}
function Ya(e) {
  const t = e?.getFlag?.(c, yt);
  return V(t) ? t : null;
}
function od(e) {
  return V(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function ad(e) {
  return V(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && id(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.finalDamage == "number" && Number.isFinite(e.finalDamage) && typeof e.blocked == "number" && Number.isFinite(e.blocked) && typeof e.appliedAt == "string" : !1;
}
function id(e) {
  return e === "normal" || e === "half";
}
function sd(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function V(e) {
  return !!(e && typeof e == "object");
}
const Qa = "data-paranormal-toolkit-resistance-skill", Za = "data-paranormal-toolkit-resistance-skill-label", sn = "data-paranormal-toolkit-multi-target-section", Jn = "data-paranormal-toolkit-multi-target-damage-info", Xa = "data-paranormal-toolkit-multi-target-effect-info", Ja = "data-paranormal-toolkit-multi-target-toggle", ei = "data-paranormal-toolkit-multi-target-details", H = "data-paranormal-toolkit-multi-target-target", ld = "data-paranormal-toolkit-multi-target-state", ln = "data-paranormal-toolkit-multi-target-roll-total", cn = "data-paranormal-toolkit-multi-target-roll-formula", et = "data-paranormal-toolkit-multi-target-roll-dice", un = "data-paranormal-toolkit-multi-target-roll-skill", dn = "data-paranormal-toolkit-multi-target-roll-skill-label", mn = "data-paranormal-toolkit-multi-target-roll-target-name", fn = "data-paranormal-toolkit-multi-target-roll-rolled-at", pn = "data-paranormal-toolkit-multi-target-damage-mode", gn = "data-paranormal-toolkit-multi-target-damage-input-amount", hn = "data-paranormal-toolkit-multi-target-damage-final-amount", _n = "data-paranormal-toolkit-multi-target-damage-blocked", bn = "data-paranormal-toolkit-multi-target-damage-target-name", yn = "data-paranormal-toolkit-multi-target-damage-applied-at", cd = new qa(), kt = "pending", ae = "success", Et = "failure", ti = "rolled";
function ud(e) {
  const t = ni(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${a}__roll-card--multi-target`), wd(e);
  const n = Rd(e.rollCard);
  Ed(n, t.damage), Id(e.rollCard, n);
  const r = Sd(e.rollCard);
  if (oi(r, t), Qd(e.rollCard, r, n), t.effect) {
    const o = Zd(e.rollCard);
    Xd(o, t.effect), Jd(e.rollCard, o, r);
  } else
    pi(e.rollCard)?.remove();
  return !0;
}
function ni(e) {
  const t = pd(e.rollCard, e.damageSection), n = gd(e.rollCard), r = hd(e.rollCard), o = dd(e.rollCard).map((i, s) => {
    const l = rm(i, s), u = n.get(l) ?? null;
    return {
      id: l,
      name: i,
      state: yd(u, t?.difficulty ?? null),
      resistanceResult: u,
      damageApplication: r.get(l) ?? null
    };
  });
  return o.length <= 1 || !e.damageSection ? null : {
    rollCard: e.rollCard,
    targets: o,
    damage: md(e.damageSection),
    effect: fd(e.effectSection),
    resistance: t
  };
}
function dd(e) {
  const n = e.closest(`.${a}`)?.querySelector(`.${a}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((o) => o.trim()).filter((o) => o.length > 0 && _i(o) !== "nenhum alvo") : [];
}
function md(e) {
  const t = Ad(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: $d(e),
    formula: Td(e) ?? "—",
    total: t,
    diceBreakdown: Qu(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function fd(e) {
  const t = e?.querySelector(`.${a}__effect-section-label`)?.textContent?.trim();
  return t && t.length > 0 ? { label: t } : null;
}
function pd(e, t) {
  const n = t?.querySelector(`.${a}__resistance-description`)?.textContent?.trim(), r = t?.querySelector(At) ?? null, o = r?.getAttribute(Qa) ?? null, i = r?.getAttribute(Za) ?? (o ? qe(o) : null);
  return !n && !o ? null : {
    description: n ?? "Resistência do alvo.",
    formula: t?.querySelector(`.${a}__resistance .${a}__workflow-roll-formula`)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: i,
    difficulty: Kn(e)
  };
}
function gd(e) {
  const t = ed(e);
  for (const [n, r] of bd(e))
    t.set(n, r);
  return t;
}
function hd(e) {
  const t = nd(e);
  for (const [n, r] of _d(e))
    t.set(n, r);
  return t;
}
function _d(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${H}]`)) {
    const r = n.getAttribute(H), o = n.getAttribute(pn), i = tt(n.getAttribute(gn)), s = tt(n.getAttribute(hn)), l = tt(n.getAttribute(_n)), u = n.getAttribute(bn), d = n.getAttribute(yn);
    !r || !am(o) || i === null || s === null || l === null || !u || !d || t.set(r, {
      targetId: r,
      targetName: u,
      mode: o,
      inputAmount: i,
      finalDamage: s,
      blocked: l,
      appliedAt: d
    });
  }
  return t;
}
function bd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${H}]`)) {
    const r = n.getAttribute(H), o = tt(n.getAttribute(ln)), i = n.getAttribute(cn), s = n.getAttribute(un), l = n.getAttribute(dn), u = n.getAttribute(mn), d = n.getAttribute(fn);
    !r || o === null || !i || !s || !l || !u || !d || t.set(r, {
      targetId: r,
      targetName: u,
      skill: s,
      skillLabel: l,
      formula: i,
      total: o,
      diceBreakdown: n.getAttribute(et),
      rolledAt: d
    });
  }
  return t;
}
function yd(e, t) {
  return e ? t === null ? ti : e.total >= t ? ae : Et : kt;
}
function Ad(e) {
  const t = e?.querySelector(`.${a}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Td(e) {
  const t = e?.querySelector(`.${a}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function $d(e) {
  const t = e?.querySelector(`.${a}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function wd(e) {
  e.damageSection?.classList.add(`${a}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${a}__workflow-section--multi-target-effect-source`);
}
function Rd(e) {
  const t = kd(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect`,
    `${a}__workflow-section--damage-info`
  ), n.setAttribute(Jn, "true"), n;
}
function kd(e) {
  return e.querySelector(`[${Jn}="true"]`);
}
function Ed(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${a}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const o = document.createElement("span");
    o.classList.add(`${a}__workflow-section-description`), o.textContent = t.typeLabel, e.append(o);
  }
  e.append(ri(t.formula, t.total, t.diceBreakdown));
}
function ri(e, t, n, r = !1) {
  const o = Yu({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${a}__workflow-roll--compact-info`]
  });
  return Cd(o, r), o;
}
function Cd(e, t) {
  const n = e.querySelector(Tt), r = e.querySelector(Hn);
  if (!n || !r) return;
  e.classList.toggle(Vn, t), n.hidden = !t, r.classList.add(Wn), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const o = r.querySelector("i") ?? document.createElement("i");
  o.classList.add("fa-solid"), o.classList.toggle("fa-chevron-down", !t), o.classList.toggle("fa-chevron-up", t), o.setAttribute("aria-hidden", "true"), o.parentElement || r.append(o);
}
function Id(e, t) {
  const n = wt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Sd(e) {
  const t = e.querySelector(`[${sn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--targets`
  ), n.setAttribute(sn, "true"), n;
}
function oi(e, t) {
  const n = Ld(e);
  e.replaceChildren(Dd(t), vd(t, n));
}
function Ld(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${H}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(H)).filter(om)
  );
}
function Dd(e) {
  const t = document.createElement("div");
  t.classList.add(`${a}__workflow-section-header`, `${a}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${a}__targets-status`), r.textContent = Pd(e.targets), t.append(n, r), t;
}
function Pd(e) {
  const t = e.length, n = e.filter((l) => l.state === Et).length, r = e.filter((l) => l.state === ae).length, o = e.filter((l) => l.state === kt).length, i = e.filter((l) => l.state === ti).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), o > 0 && s.push(`${o} ${o === 1 ? "pendente" : "pendentes"}`), i > 0 && s.push(`${i} ${i === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function vd(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${a}__targets-list`);
  for (const r of e.targets)
    n.append(Nd(r, e, t.has(r.id)));
  return n;
}
function Nd(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${a}__target-row`, `${a}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${a}__target-row--damage-applied`), r.setAttribute(H, e.id), r.setAttribute(ld, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), ai(r, e.resistanceResult), ii(r, e.damageApplication);
  const o = xd(e, t, r), i = Hd(e, t);
  return i.hidden = !n, r.addEventListener("click", (s) => {
    Kr(s.target) || Wr(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || Kr(s.target) || (s.preventDefault(), Wr(r));
  }), r.append(o, i), r;
}
function ai(e, t) {
  if (!t) {
    e.removeAttribute(ln), e.removeAttribute(cn), e.removeAttribute(et), e.removeAttribute(un), e.removeAttribute(dn), e.removeAttribute(mn), e.removeAttribute(fn);
    return;
  }
  e.setAttribute(ln, String(t.total)), e.setAttribute(cn, t.formula), e.setAttribute(un, t.skill), e.setAttribute(dn, t.skillLabel), e.setAttribute(mn, t.targetName), e.setAttribute(fn, t.rolledAt), t.diceBreakdown ? e.setAttribute(et, t.diceBreakdown) : e.removeAttribute(et);
}
function ii(e, t) {
  if (!t) {
    e.removeAttribute(pn), e.removeAttribute(gn), e.removeAttribute(hn), e.removeAttribute(_n), e.removeAttribute(bn), e.removeAttribute(yn);
    return;
  }
  e.setAttribute(pn, t.mode), e.setAttribute(gn, String(t.inputAmount)), e.setAttribute(hn, String(t.finalDamage)), e.setAttribute(_n, String(t.blocked)), e.setAttribute(bn, t.targetName), e.setAttribute(yn, t.appliedAt);
}
function xd(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${a}__target-summary`);
  const o = document.createElement("div");
  o.classList.add(`${a}__target-summary-main`);
  const i = Od(e), s = document.createElement("strong");
  s.classList.add(`${a}__target-name`), s.textContent = e.name;
  const l = Md(e, t.resistance);
  Bd(l, n, e, t);
  const u = Vd(n);
  o.append(i, s, l, u);
  const d = document.createElement("div");
  return d.classList.add(`${a}__target-summary-actions`), d.append(
    li(e, t, "compact"),
    mi(e, t, "compact")
  ), r.append(o, d), r;
}
function Od(e) {
  const t = document.createElement("span");
  return t.classList.add(`${a}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Md(e, t) {
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${a}__target-resistance-button`, `${a}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Fd(e, t)), t?.skill && (n.setAttribute(Qa, t.skill), n.setAttribute(Za, t.skillLabel ?? qe(t.skill))), !t?.skill)
    return n.disabled = !0, n.title = "Resistência não configurada", n.textContent = "—", n;
  if (n.title = e.resistanceResult ? `Rolar ${t.skillLabel ?? t.skill} novamente` : `Rolar ${t.skillLabel ?? t.skill} de ${e.name}`, !e.resistanceResult) {
    const i = document.createElement("i");
    i.classList.add("fa-solid", "fa-dice-d20"), i.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    return s.classList.add(`${a}__target-resistance-fallback`), s.textContent = "d20", n.append(i, s), n;
  }
  const r = document.createElement("span");
  r.classList.add(`${a}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const o = document.createElement("span");
  return o.classList.add(`${a}__target-resistance-mark`), o.setAttribute("aria-hidden", "true"), o.textContent = e.state === ae ? "✓" : e.state === Et ? "✕" : "", n.append(r, o), n;
}
function Fd(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === ae ? "sucesso" : e.state === Et ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Bd(e, t, n, r) {
  e.addEventListener("click", (o) => {
    o.stopPropagation(), Ud(t, e, n, r);
  });
}
async function Ud(e, t, n, r) {
  const o = r.resistance, i = o?.skill, s = o?.skillLabel ?? (i ? qe(i) : "Resistência");
  if (!i) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = gi(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${a}__target-resistance-button--rolling`);
  const u = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await za(l, i);
    await nm(d.roll);
    const f = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      skill: i,
      skillLabel: s,
      formula: d.formula,
      total: d.total,
      diceBreakdown: d.diceBreakdown,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    ai(e, f);
    try {
      await td(r.rollCard, f);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", y);
    }
    si(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = u;
  } finally {
    t.disabled = !1, t.classList.remove(`${a}__target-resistance-button--rolling`);
  }
}
function si(e) {
  const t = e.closest(`[${sn}="true"]`), n = e.closest(`.${a}__roll-card`);
  if (!t || !n) return;
  const r = ni({
    rollCard: n,
    damageSection: qd(n) ?? wt(n, "Dano"),
    effectSection: zd(n)
  });
  r && oi(t, r);
}
function qd(e) {
  return Array.from(e.querySelectorAll(`.${a}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Jn) !== "true") ?? null;
}
function zd(e) {
  return e.querySelector(`.${a}__workflow-section--multi-target-effect-source`);
}
function li(e, t, n) {
  if (e.damageApplication)
    return ne(
      "✓",
      jd(e.damageApplication, n),
      [`${a}__target-action--damage`, `${a}__target-action--applied`],
      !0
    );
  if (e.state === kt)
    return ne(
      "◇",
      n === "full" ? "Role resistência primeiro" : "Role res.",
      [`${a}__target-action--damage`, `${a}__target-action--waiting-damage`],
      !0
    );
  const r = ci(e), o = di(r, t.damage);
  if (o === null)
    return ne(
      "⚡",
      "Dano indisponível",
      [`${a}__target-action--damage`, `${a}__target-action--disabled`],
      !0
    );
  const i = r === "half" ? n === "full" ? t.damage.halfLabel ?? `Metade: ${o} PV` : t.damage.halfCompactLabel ?? `½ ${o} PV` : n === "full" ? t.damage.normalLabel : t.damage.normalCompactLabel, s = r === "half" ? "🛡️" : "⚡", l = r === "half" ? `${a}__target-action--half-damage` : `${a}__target-action--normal-damage`, u = ne(
    s,
    i,
    [`${a}__target-action--damage`, l],
    !1
  );
  return u.title = `Aplicar ${i} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (d) => {
    d.stopPropagation();
    const f = u.closest(`[${H}]`);
    f && Gd(f, u, e, t);
  }), u;
}
function jd(e, t) {
  const n = e.blocked > 0 ? ` (RD ${e.blocked})` : "";
  return t === "compact" ? `${e.finalDamage} PV` : `Dano aplicado: ${e.finalDamage} PV${n}`;
}
function ci(e) {
  return e.state === ae ? "half" : "normal";
}
function di(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Gd(e, t, n, r) {
  if (n.damageApplication) return;
  if (n.state === kt) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const o = ci(n), i = di(o, r.damage);
  if (i === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const s = gi(n.name);
  if (!s) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${a}__target-action--applying`);
  const l = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await cd.applyDamage({
      actor: s,
      instances: [
        {
          id: `multi-target:${n.id}:${o}`,
          amount: i,
          damageType: r.damage.typeLabel,
          label: o === "half" ? "Metade" : "Dano normal",
          sourceRollId: "damage",
          ignoreResistance: !1
        }
      ],
      source: "item-use.multi-target-damage",
      originUuid: null
    });
    if (!u.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${u.error.message}`), t.innerHTML = l;
      return;
    }
    const d = {
      targetId: n.id,
      targetName: s.name ?? n.name,
      mode: o,
      inputAmount: i,
      finalDamage: u.value.totalFinalDamage,
      blocked: u.value.totalBlocked,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    ii(e, d);
    try {
      await rd(r.rollCard, d);
    } catch (f) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", f);
    }
    ui.notifications?.info?.(`Paranormal Toolkit: ${d.finalDamage} PV aplicado em ${d.targetName}.`), si(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1, t.classList.remove(`${a}__target-action--applying`);
  }
}
function mi(e, t, n) {
  return t.effect ? e.state === ae ? ne(
    "✓",
    n === "full" ? "Resistiu ao efeito" : "Resistiu",
    [`${a}__target-action--effect`, `${a}__target-action--resisted`],
    !0
  ) : ne(
    "✦",
    n === "full" ? "Aplicar efeito" : "Efeito",
    [`${a}__target-action--effect`, `${a}__target-action--pending-effect`],
    !0
  ) : ne(
    "✦",
    "Sem efeito",
    [`${a}__target-action--effect`, `${a}__target-action--disabled`],
    !0
  );
}
function ne(e, t, n, r) {
  const o = document.createElement("button");
  o.type = "button", o.classList.add(`${a}__target-action`, `${a}__target-action--pending`, ...n), o.disabled = r;
  const i = document.createElement("span");
  i.classList.add(`${a}__target-action-icon`), i.setAttribute("aria-hidden", "true"), i.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${a}__target-action-label`), s.textContent = t, o.append(i, s), o;
}
function Vd(e) {
  const t = document.createElement("span");
  return t.classList.add(`${a}__target-toggle`), t.setAttribute(Ja, "true"), t.setAttribute("aria-hidden", "true"), fi(e, t), t;
}
function Wr(e) {
  const t = e.querySelector(`[${ei}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Ja}="true"]`);
  r && fi(e, r);
}
function fi(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function Kr(e) {
  return e instanceof HTMLElement ? !!e.closest([
    "button",
    "a",
    "input",
    "select",
    "textarea",
    `.${a}__workflow-roll`,
    `.${a}__workflow-roll-formula`,
    `.${a}__workflow-dice-tray`
  ].join(", ")) : !1;
}
function Hd(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${a}__target-details`), n.setAttribute(ei, "true");
  const r = document.createElement("div");
  r.classList.add(`${a}__target-resistance-details`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const i = document.createElement("span");
  i.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(o, i);
  const s = Wd(e, t.resistance);
  s && r.append(s);
  const l = Kd(e, t.resistance), u = Yd(e, t);
  return n.append(r, l, u), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Wd(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${a}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === ae ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function Kd(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${a}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", o = e.resistanceResult?.total ?? null, i = ri(
    r,
    o,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(i), n;
}
function Yd(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${a}__target-details-actions`), n.append(
    li(e, t, "full"),
    mi(e, t, "full")
  ), n;
}
function Qd(e, t, n) {
  const r = n.parentElement === e ? n : wt(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function Zd(e) {
  const t = pi(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-info`
  ), n.setAttribute(Xa, "true"), n;
}
function pi(e) {
  return e.querySelector(`[${Xa}="true"]`);
}
function Xd(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${a}__workflow-section-header`);
  const r = document.createElement("strong");
  r.textContent = "Efeito", n.append(r);
  const o = document.createElement("div");
  o.classList.add(`${a}__effect-info-body`);
  const i = document.createElement("span");
  i.classList.add(`${a}__effect-info-label`), i.textContent = t.label;
  const s = document.createElement("span");
  s.classList.add(`${a}__effect-info-hint`), s.textContent = "Aplicação por alvo", o.append(i, s), e.append(n, o);
}
function Jd(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function gi(e) {
  const t = Ut(e);
  if (!t) return null;
  const n = em().filter((i) => Ut(tm(i)) === t).map((i) => hi(i)).find(Pe) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((i) => Pe(i) && Ut(i.name) === t);
  return Pe(o) ? o : null;
}
function em() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function tm(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : hi(e)?.name ?? null;
}
function hi(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Pe(t)) return t;
  const n = e.document?.actor;
  return Pe(n) ? n : null;
}
function Pe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ut(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function nm(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function rm(e, t) {
  return `${t}-${_i(e).replace(/[^a-z0-9]+/gu, "-")}`;
}
function _i(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function om(e) {
  return typeof e == "string" && e.length > 0;
}
function am(e) {
  return e === "normal" || e === "half";
}
function tt(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const de = "data-paranormal-toolkit-prompt-id", im = "data-paranormal-toolkit-card-layout-normalized", Yr = "data-paranormal-toolkit-card-layout-refresh-bound", sm = "apply-damage", lm = "data-paranormal-toolkit-multi-target-damage-info", bi = [0, 80, 180, 400, 900, 1600, 3e3], Qr = /* @__PURE__ */ new WeakSet();
function cm(e) {
  yi(e), um(e);
}
function yi(e) {
  for (const t of Array.from(e.querySelectorAll(`.${a}__roll-card`)))
    Ti(Ai(t));
}
function um(e) {
  if (!Qr.has(e)) {
    Qr.add(e);
    for (const t of bi)
      globalThis.setTimeout(() => {
        yi(e);
      }, t);
  }
}
function Ai(e) {
  return {
    rollCard: e,
    damageSection: dm(e),
    resistance: e.querySelector(Gn),
    damageActions: mm(e),
    effectActionSource: fm(e),
    effectSection: fu(e)
  };
}
function Ti(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: o,
    effectActionSource: i,
    effectSection: s
  } = e;
  t.setAttribute(im, "true"), t.classList.add(`${a}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), uu(t, o));
  const l = pu({
    rollCard: t,
    existingSection: s,
    sourceActions: i,
    after: n,
    fallbackAfter: wt(t, "Conjuração")
  });
  l && gu(t, l), ud({
    rollCard: t,
    damageSection: n,
    effectSection: l ?? s
  }), Am(t);
}
function dm(e) {
  return Array.from(e.querySelectorAll(`.${a}__workflow-section`)).find((t) => t.getAttribute(lm) === "true" ? !1 : t.querySelector(`.${a}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function mm(e) {
  const t = pm(e);
  return t.find((n) => n.getAttribute(ou) === sm) ?? t.find((n) => Na(n) === "aplicar danos") ?? null;
}
function fm(e) {
  const t = $i(e), n = Zr(t);
  return n || Zr(gm(e));
}
function Zr(e) {
  return e.find((t) => {
    const n = Na(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function pm(e) {
  const t = $i(e);
  return t.length > 0 ? t : er(e);
}
function $i(e) {
  const t = bm(e);
  return t ? er(e).filter((n) => _m(n, t)) : [];
}
function gm(e) {
  const t = wi(e);
  if (!t) return [];
  const n = hm(e, t);
  return er(e).filter((r) => !r.closest(`.${a}__roll-card`)).filter((r) => Ri(e, r)).filter((r) => !n || ym(r, n));
}
function er(e) {
  const t = wi(e);
  return t ? Array.from(t.querySelectorAll(ru)) : [];
}
function wi(e) {
  return e.closest(`.${a}`) ?? e.parentElement;
}
function hm(e, t) {
  return Array.from(t.querySelectorAll(`.${a}__roll-card`)).find((n) => n !== e && Ri(e, n)) ?? null;
}
function _m(e, t) {
  return e.getAttribute(de) === t ? !0 : Array.from(e.querySelectorAll(`[${de}]`)).some((n) => n.getAttribute(de) === t);
}
function bm(e) {
  return e.getAttribute(de) ?? e.querySelector(`[${de}]`)?.getAttribute(de) ?? null;
}
function Ri(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function ym(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Am(e) {
  const t = e.querySelector(At);
  t && t.getAttribute(Yr) !== "true" && (t.setAttribute(Yr, "true"), t.addEventListener("click", () => {
    for (const n of bi)
      globalThis.setTimeout(() => {
        Ti(Ai(e));
      }, n);
  }));
}
const Tm = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function $m(e) {
  for (const t of Array.from(e.querySelectorAll(Gn)))
    wm(t);
  cm(e);
}
function wm(e) {
  const t = e.querySelector(wc), n = e.querySelector(ka), r = e.querySelector(At), o = e.querySelector(Ea);
  if (!r || !t && !n && !o) return;
  const i = Rm(e, r);
  t && t.parentElement !== i && i.append(t), n && n.parentElement !== i && i.append(n), o && (o.parentElement !== e && !r.contains(o) && e.append(o), km(o)), r.parentElement !== e && e.append(r);
}
function Rm(e, t) {
  const n = e.querySelector(`.${Or}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Or), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function km(e) {
  const t = Em(e.textContent ?? "");
  t && (e.setAttribute(Tm, "true"), e.replaceChildren(Sm(t)));
}
function Em(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, i = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: u } = Cm(r ?? "");
  return l ? {
    skillLabel: i,
    formula: l,
    total: Math.trunc(s),
    diceValues: u
  } : null;
}
function Cm(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Im(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Im(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Sm(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${a}__workflow-roll`,
    `${a}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${a}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Lm(e);
  return r && t.append(r), t;
}
function Lm(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${a}__workflow-dice-tray`);
  for (const n of Dm(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${a}__workflow-die`), n.active || r.classList.add(`${a}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Dm(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Xr(e, "highest") : n.includes("kl") ? Xr(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Xr(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const i = !r && o === n;
    return i && (r = !0), { value: o, active: i };
  });
}
function Jr(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function tr() {
  const e = globalThis.game;
  return Ct(e) ? e : null;
}
function L(e, t) {
  const n = Pm(e, t);
  return nt(n);
}
function Pm(e, t) {
  return t.split(".").reduce((n, r) => Ct(n) ? n[r] : null, e);
}
function vm(e, t) {
  const n = e.indexOf(":");
  return n < 0 || Oe(e.slice(0, n)) !== Oe(t) ? null : ye(e.slice(n + 1));
}
function nt(e) {
  return typeof e == "string" ? ye(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Ct(e) {
  return !!e && typeof e == "object";
}
function Nm(e) {
  return typeof e == "string";
}
function It(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function ye(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function Oe(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function An(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function W(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function ki(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function xm(e) {
  for (const t of Array.from(e.querySelectorAll(Ac))) {
    const n = zm(t);
    Om(t), n && (Mm(t, n), Fm(t, n));
  }
}
function Om(e) {
  for (const t of Array.from(e.querySelectorAll(Tc)))
    t.remove();
}
function Mm(e, t) {
  const r = e.closest(`.${a}`)?.querySelector(Ra) ?? null, o = r?.querySelector(yc) ?? null, i = r ?? e, s = i.querySelector(Ec);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = af(t.elementTone), l.textContent = of(t), !s) {
    if (o?.parentElement === i) {
      o.insertAdjacentElement("afterend", l);
      return;
    }
    i.prepend(l);
  }
}
function Fm(e, t) {
  const n = Bm(e);
  Um(e, n);
  const r = qm(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${a}__ritual-metadata`);
  for (const s of r) {
    const l = document.createElement("span");
    l.classList.add(`${a}__ritual-metadata-chip`), l.textContent = s, o.append(l);
  }
  if (n) {
    const s = n.querySelector(`.${a}__summary`);
    if (s?.parentElement === n) {
      s.insertAdjacentElement("afterend", o);
      return;
    }
    n.append(o);
    return;
  }
  const i = e.querySelector(Ca);
  if (i) {
    e.insertBefore(o, i);
    return;
  }
  e.prepend(o);
}
function Bm(e) {
  return e.closest(`.${a}`)?.querySelector(Ra) ?? null;
}
function Um(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(Cc)))
      o.remove();
}
function qm(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${An(e.target)}` : null,
    e.duration ? `Duração: ${An(e.duration)}` : null,
    e.resistance ? `Resistência: ${ki(e.resistance)}` : null
  ].filter(It);
}
function zm(e) {
  const t = jm(e), n = Ym(e), o = (t ? Km(t) : null)?.system ?? null, i = t?.summaryLines ?? [], s = nr(L(o, "element")), l = M("op.elementChoices", s) ?? eo(ee(i, "Elemento")) ?? eo(n.damageType), u = s ?? sf(l), d = L(o, "circle") ?? ee(i, "Círculo"), f = Xm(o) ?? ee(i, "Alvo"), y = nf(o, "duration", "op.durationChoices") ?? ee(i, "Duração"), T = Qm(e) ?? ef(o) ?? ee(i, "Resistência"), $ = Zm(i) ?? n.cost, g = {
    elementLabel: l,
    elementTone: u,
    circle: d,
    cost: $,
    target: f,
    duration: y,
    resistance: T
  };
  return rf(g) ? g : null;
}
function jm(e) {
  const t = Gm(e);
  if (!t) return null;
  const n = t.getFlag?.(c, yt), r = Hm(n);
  if (r.length === 0) return null;
  const o = Vm(e);
  if (o.size > 0) {
    const i = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (i) return i;
  }
  return r.find((i) => i.itemId || i.summaryLines.length > 0) ?? null;
}
function Gm(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? tr()?.messages?.get?.(n) ?? null : null;
}
function Vm(e) {
  const t = e.closest(`.${a}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${xr}]`))) {
    const o = r.getAttribute(xr)?.trim();
    o && n.add(o);
  }
  return n;
}
function Hm(e) {
  if (!Ct(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Wm).filter((n) => n !== null) : [];
}
function Wm(e) {
  return Ct(e) ? {
    pendingId: nt(e.pendingId),
    actorId: nt(e.actorId),
    itemId: nt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Nm) : []
  } : null;
}
function Km(e) {
  if (!e.itemId) return null;
  const t = tr(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Ym(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll($c))) {
    const o = ye(r.textContent);
    if (!o) continue;
    const i = vm(o, "Tipo");
    i && (n = i), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function Qm(e) {
  const t = ye(e.querySelector(ka)?.textContent);
  return t ? ki(t) : null;
}
function ee(e, t) {
  const n = Oe(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || Oe(r.slice(0, o)) !== n))
      return ye(r.slice(o + 1));
  }
  return null;
}
function Zm(e) {
  const t = ee(e, "Custo") ?? ee(e, "PE");
  return t || (e.map(ye).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Xm(e) {
  const t = L(e, "target");
  if (!t) return null;
  if (t === "area")
    return Jm(e) ?? M("op.targetChoices", t) ?? "Área";
  const n = M("op.targetChoices", t) ?? W(t);
  return [t === "people" || t === "creatures" ? L(e, "targetQtd") : null, n].filter(It).join(" ");
}
function Jm(e) {
  const t = L(e, "area.name"), n = L(e, "area.size"), r = L(e, "area.type"), o = t ? M("op.areaChoices", t) ?? W(t) : null, i = r ? M("op.areaTypeChoices", r) ?? W(r) : null;
  return o ? n ? i ? `${o} ${n}m ${An(i)}` : `${o} ${n}m` : o : null;
}
function ef(e) {
  const t = L(e, "skillResis"), n = L(e, "resistance");
  if (!t || !n) return null;
  const r = M("op.skill", t) ?? W(t), o = tf(n);
  return [r, o].filter(It).join(" ");
}
function tf(e) {
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
      return M("op.resistanceChoices", e) ?? W(e);
  }
}
function nf(e, t, n) {
  const r = L(e, t);
  return r ? M(n, r) ?? W(r) : null;
}
function rf(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function of(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function af(e) {
  return [
    `${a}__ritual-element-badge`,
    e ? `${a}__ritual-element-badge--${e}` : null
  ].filter(It).join(" ");
}
function nr(e) {
  const t = Oe(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function eo(e) {
  const t = nr(e);
  return t ? M("op.elementChoices", t) ?? W(t) : e ? W(e) : null;
}
function sf(e) {
  return nr(e);
}
function M(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = tr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const to = "data-paranormal-toolkit-dice-toggle-enhanced";
function lf(e) {
  for (const t of Array.from(e.querySelectorAll(Ia)))
    Ei(t);
}
function cf(e) {
  const t = Ii(e.target);
  if (!t) return;
  const n = rr(t);
  n && (e.preventDefault(), Ci(n, t));
}
function uf(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Ii(e.target);
  if (!t) return;
  const n = rr(t);
  n && (e.preventDefault(), Ci(n, t));
}
function Ei(e) {
  const t = e.querySelector(Tt);
  if (!t) return;
  const n = e.querySelector(Hn);
  if (n && n.getAttribute(to) !== "true" && (n.setAttribute(to, "true"), n.classList.add(Wn), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Ci(e, t) {
  const n = e.querySelector(Tt);
  if (!n) return;
  const r = !e.classList.contains(Vn);
  df(e, t, n, r);
}
function df(e, t, n, r) {
  e.classList.toggle(Vn, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Ii(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Hn);
  if (!t) return null;
  const n = rr(t);
  return n ? (Ei(n), t.classList.contains(Wn) ? t : null) : null;
}
function rr(e) {
  const t = e.closest(Ia);
  return t && t.querySelector(Tt) ? t : null;
}
const no = `${c}-workflow-dice-toggle-styles`;
function mf() {
  if (document.getElementById(no)) return;
  const e = document.createElement("style");
  e.id = no, e.textContent = `
.${a}__workflow-section .${a}__roll-detail-toggle,
.${a}__workflow-section .${a}__roll-detail-list {
  display: none !important;
}

.${a}__workflow-roll:not(.${a}__workflow-roll--dice-open) .${a}__workflow-dice-tray,
.${a}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${a}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${a}__workflow-roll-formula--toggle:hover,
.${a}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${a}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${a}__header .${a}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${a}__ritual-element-badge {
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

.${a}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${a}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${a}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${a}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${a}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${a}__header .${a}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${a}__roll-card > .${a}__ritual-metadata {
  display: none !important;
}

.${a}__ritual-metadata-chip {
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

.${a}__resistance {
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

.${a}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${a}__resistance-content .${a}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${a}__resistance-content .${a}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${a}__resistance-content .${a}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${a}__resistance > .${a}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: start;
}

.${a}__resistance > .${a}__resistance-roll-result,
.${a}__resistance-content .${a}__resistance-roll-result {
  grid-area: result;
  display: block;
  min-width: 0;
  width: 100%;
  margin-top: 0;
}

.${a}__resistance-workflow-roll {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 0.34rem;
}

.${a}__resistance-workflow-roll .${a}__workflow-roll-formula {
  display: inline-flex;
  width: 100%;
  max-width: 100%;
  min-height: 1.78rem;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

.${a}__resistance-workflow-roll .${a}__workflow-roll-formula i {
  margin-left: auto;
}

.${a}__resistance-workflow-roll .${a}__workflow-dice-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
  border-top: 1px solid rgba(79, 55, 42, 0.12);
  padding-top: 0.34rem;
}

.${a}__resistance-workflow-roll .${a}__workflow-die {
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

.${a}__resistance-workflow-roll .${a}__workflow-die--inactive {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(36, 27, 24, 0.46);
  opacity: 0.58;
}
.${a}__workflow-section--casting .${a}__workflow-section-header--casting-backlash {
  grid-template-columns: minmax(0, 1fr) 34px;
}

.${a}__workflow-section-title-row {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.38rem;
}

.${a}__workflow-section-title-row .${a}__workflow-section-status {
  flex: 0 0 auto;
}

.${a}__casting-backlash-button {
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

.${a}__casting-backlash-button::before {
  content: "↪";
  font-size: 1rem;
  font-weight: 950;
  line-height: 1;
}

.${a}__casting-backlash-button:hover,
.${a}__casting-backlash-button:focus {
  border-color: rgba(125, 39, 43, 0.66) !important;
  background: rgba(143, 62, 67, 0.94) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 0 0 2px rgba(125, 39, 43, 0.16) !important;
  outline: none !important;
}

.${a}__casting-backlash-button:disabled {
  cursor: default !important;
  opacity: 0.78 !important;
}

.${a}__casting-backlash-button.${a}__button--executed::before {
  content: "✓";
}

/* 0.21.2 — Resolução de dano integrada no bloco de Dano */
.${a}__workflow-section--effect .${a}__resistance {
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.48rem 0.52rem !important;
  background: rgba(255, 246, 229, 0.52) !important;
  box-shadow: none !important;
}

.${a}__workflow-section--effect .${a}__resistance-content {
  gap: 0.22rem !important;
}

.${a}__workflow-section--effect .${a}__resistance-header strong {
  display: inline !important;
  margin: 0 !important;
}

.${a}__workflow-section--effect .${a}__resistance-description {
  font-size: 0.75rem !important;
  line-height: 1.25 !important;
}

.${a}__actions--embedded {
  margin-top: 0.46rem !important;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${a}__actions--compact,
.${a}__actions--damage-resolution {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center !important;
  gap: 0.34rem !important;
}

.${a}__actions--damage-resolution .${a}__actions-title {
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

.${a}__actions--damage-resolution .${a}__actions-title::before,
.${a}__actions--damage-resolution .${a}__actions-title::after {
  content: "";
  display: block;
  border-top: 1px solid rgba(79, 55, 42, 0.16);
}

.${a}__damage-resolution-summary {
  grid-column: 1 / -1;
  margin: -0.04rem 0 0.02rem;
  color: rgba(54, 39, 31, 0.64);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.24;
  text-align: center;
}

.${a}__actions--damage-resolution .${a}__button {
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

.${a}__actions--damage-resolution .${a}__button-icon {
  flex: 0 0 auto;
  font-size: 0.78rem;
  line-height: 1;
  opacity: 0.88;
}

.${a}__actions--damage-resolution .${a}__button-label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.${a}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="pending"] .${a}__button,
.${a}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${a}__button,
.${a}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${a}__button {
  grid-column: 1 / -1;
}

.${a}__actions--damage-resolution .${a}__button[hidden] {
  display: none !important;
}

.${a}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${a}__damage-resolution-summary {
  color: rgba(34, 93, 55, 0.84);
}

.${a}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${a}__damage-resolution-summary {
  color: rgba(112, 44, 44, 0.82);
}

.${a}__actions--effect-resolution {
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

.${a}__actions--effect-resolution .${a}__actions-title {
  grid-area: title;
  margin: 0 !important;
  color: rgba(107, 78, 35, 0.95) !important;
  font-size: 0.78rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.055em !important;
  line-height: 1 !important;
  text-transform: uppercase !important;
}

.${a}__effect-resolution-label {
  grid-area: label;
  min-width: 0;
  color: rgba(36, 27, 24, 0.9);
  font-size: 0.82rem;
  font-weight: 850;
  line-height: 1.22;
  overflow-wrap: anywhere;
}

.${a}__actions--effect-resolution .${a}__button {
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
.${a}__actions--effect-resolution {
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${a}__actions--effect-resolution .${a}__button {
  gap: 0.34rem !important;
  border-color: rgba(123, 72, 73, 0.42) !important;
  background: rgba(228, 214, 209, 0.74) !important;
  color: rgba(42, 30, 27, 0.94) !important;
}

.${a}__actions--effect-resolution .${a}__button:hover,
.${a}__actions--effect-resolution .${a}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${a}__button-icon--effect {
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
  transform: translateY(-0.02rem);
}

.${a}__button--effect-resolution-action .${a}__button-label {
  line-height: 1;
}

/* 0.21.5 — Efeito dentro do card principal e estado aplicado compacto */
/* 0.21.6 — Aproxima o Efeito do bloco de Dano para manter o ritmo visual do card */
/* 0.21.7 — Normaliza Efeito como seção irmã de Dano, sem margem herdada de actions */
.${a}__roll-card > .${a}__actions--effect-resolution {
  margin: 0 !important;
}

.${a}__roll-card > .${a}__workflow-section--effect + .${a}__actions--effect-resolution {
  margin-top: 0 !important;
}

.${a}__actions--effect-resolution.${a}__workflow-section {
  align-items: center !important;
}

.${a}__actions--effect-resolution .${a}__button--executed,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${a}__button-icon--effect-applied {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.8 — Efeito condicionado ao resultado da resistência */
.${a}__actions--effect-resolution .${a}__button--effect-resolution-waiting,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted {
  color: rgba(34, 93, 55, 0.84) !important;
}

.${a}__button-icon--effect-resisted {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.9 — Estados bloqueados de efeito não devem parecer clicáveis */
.${a}__actions--effect-resolution .${a}__button--effect-resolution-waiting:hover,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-waiting:focus,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted:hover,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted:focus,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-waiting:disabled,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted:disabled {
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  cursor: default !important;
}

.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted:hover,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted:focus,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted:disabled {
  color: rgba(34, 93, 55, 0.84) !important;
}

/* 0.22.0 — Card estruturado: remove moldura externa e mantém cards internos */
.${a}__roll-card--structured {
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${a}__roll-card--structured > .${a}__workflow-section,
.${a}__roll-card--structured > .${a}__actions--effect-resolution {
  margin-inline: 0 !important;
}

.${a}__roll-card--structured > .${a}__workflow-section + .${a}__workflow-section,
.${a}__roll-card--structured > .${a}__workflow-section + .${a}__actions--effect-resolution,
.${a}__roll-card--structured > .${a}__actions--effect-resolution + .${a}__workflow-section {
  margin-top: 0.28rem !important;
}

.${a}__roll-card--structured > .${a}__roll-meta,
.${a}__roll-card--structured > .${a}__workflow-notes {
  margin-inline: 0.08rem !important;
}

/* 0.22.2 — Unifica ritmo e tipografia do card de Efeito com Conjuração/Dano */
.${a}__roll-card--structured {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.18rem !important;
}

.${a}__roll-card--structured > .${a}__workflow-section,
.${a}__roll-card--structured > .${a}__actions--effect-resolution {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.${a}__roll-card--structured > .${a}__actions--effect-resolution {
  gap: 0.14rem 0.5rem !important;
  padding: 0.54rem 0.58rem !important;
}

.${a}__roll-card--structured > .${a}__actions--effect-resolution .${a}__actions-title {
  display: block !important;
  font-family: inherit !important;
  font-size: 0.74rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 950 !important;
  letter-spacing: 0.075em !important;
  line-height: 1.08 !important;
  text-transform: uppercase !important;
}

.${a}__roll-card--structured > .${a}__actions--effect-resolution .${a}__effect-resolution-label {
  font-family: inherit !important;
  font-size: 0.81rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 800 !important;
  line-height: 1.18 !important;
}

.${a}__roll-card--structured > .${a}__actions--effect-resolution .${a}__button {
  align-self: center !important;
}

/* 0.22.3 — Efeito como workflow-section real, sem card legado de actions */
.${a}__roll-card--structured {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.18rem !important;
}

.${a}__roll-card--structured > .${a}__workflow-section,
.${a}__roll-card--structured > .${a}__workflow-section--effect-action {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.${a}__workflow-section--effect-action {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "header button"
    "label button";
  align-items: center !important;
  gap: 0.14rem 0.5rem !important;
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${a}__workflow-section--effect-action > .${a}__workflow-section-header {
  grid-area: header;
  min-width: 0;
  margin: 0 !important;
}

.${a}__workflow-section--effect-action > .${a}__workflow-section-header strong {
  color: rgba(107, 78, 35, 0.95) !important;
  font-family: inherit !important;
  font-size: 0.74rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 950 !important;
  letter-spacing: 0.075em !important;
  line-height: 1.08 !important;
  text-transform: uppercase !important;
}

.${a}__effect-section-body {
  display: contents !important;
}

.${a}__effect-section-label {
  grid-area: label;
  min-width: 0;
  color: rgba(36, 27, 24, 0.9);
  font-family: inherit !important;
  font-size: 0.81rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 800 !important;
  line-height: 1.18 !important;
  overflow-wrap: anywhere;
}

.${a}__effect-section-action {
  grid-area: button;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  justify-self: end !important;
  align-self: center !important;
  min-width: 0;
}

.${a}__workflow-section--effect-action .${a}__button {
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
  border-color: rgba(123, 72, 73, 0.42) !important;
  background: rgba(228, 214, 209, 0.74) !important;
  color: rgba(42, 30, 27, 0.94) !important;
  font-size: 0.78rem !important;
  font-weight: 900 !important;
  line-height: 1.1 !important;
  gap: 0.34rem !important;
  white-space: nowrap !important;
  aspect-ratio: auto !important;
}

.${a}__workflow-section--effect-action .${a}__button:hover,
.${a}__workflow-section--effect-action .${a}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${a}__workflow-section--effect-action .${a}__button--executed,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${a}__workflow-section--effect-action .${a}__button--effect-resolution-waiting,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${a}__workflow-section--effect-action .${a}__button--effect-resolution-waiting:hover,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-waiting:focus,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-waiting:disabled,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted:hover,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted:focus,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted:disabled {
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  cursor: default !important;
}

.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted:hover,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted:focus,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted:disabled {
  color: rgba(34, 93, 55, 0.84) !important;
}

/* 0.23.0 — Multi-target ritual card visual model */
.${a}__roll-card--multi-target
  > .${a}__workflow-section--multi-target-source,
.${a}__roll-card--multi-target
  > .${a}__workflow-section--multi-target-effect-source {
  display: none !important;
}

.${a}__workflow-section--targets {
  border-color: rgba(143, 54, 62, 0.24) !important;
  border-left: 3px solid rgba(133, 49, 59, 0.68) !important;
  background: linear-gradient(180deg, rgba(255, 248, 245, 0.84), rgba(250, 239, 235, 0.52)) !important;
}

.${a}__targets-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 0.5rem !important;
}

.${a}__workflow-section--targets
  .${a}__workflow-section-header strong {
  color: rgba(117, 48, 58, 0.94) !important;
}

.${a}__targets-status {
  display: inline-flex !important;
  align-items: center !important;
  min-width: 0 !important;
  border: 1px solid rgba(120, 61, 50, 0.14) !important;
  border-radius: 999px !important;
  padding: 0.14rem 0.48rem !important;
  background: rgba(255, 255, 255, 0.44) !important;
  color: rgba(36, 27, 24, 0.82) !important;
  font-size: 0.72rem !important;
  font-weight: 900 !important;
  line-height: 1 !important;
  white-space: nowrap !important;
}

.${a}__targets-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.3rem !important;
  margin-top: 0.42rem !important;
}

.${a}__target-row {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.34rem !important;
  border: 1px solid rgba(143, 54, 62, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.38rem !important;
  background: rgba(255, 255, 255, 0.34) !important;
  cursor: pointer !important;
}

.${a}__target-row:focus-visible {
  outline: 2px solid rgba(143, 54, 62, 0.34) !important;
  outline-offset: 2px !important;
}

.${a}__target-summary {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.32rem !important;
  min-width: 0 !important;
}

.${a}__target-summary-main {
  display: grid !important;
  grid-template-columns: auto minmax(0, 1fr) auto auto !important;
  align-items: center !important;
  gap: 0.34rem !important;
  min-width: 0 !important;
}

.${a}__target-summary-actions {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
  align-items: center !important;
  gap: 0.34rem !important;
  min-width: 0 !important;
}

.${a}__target-row[aria-expanded="true"] .${a}__target-summary-actions {
  display: none !important;
}

.${a}__target-avatar {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 1.62rem !important;
  height: 1.62rem !important;
  border: 1px solid rgba(139, 95, 48, 0.28) !important;
  border-radius: 999px !important;
  background: radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.92), rgba(231, 213, 194, 0.78)) !important;
  color: rgba(88, 56, 42, 0.8) !important;
  flex: 0 0 auto !important;
  font-size: 0.72rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

.${a}__target-name {
  min-width: 0 !important;
  color: rgba(36, 27, 24, 0.94) !important;
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1.12 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${a}__target-resistance-button,
.${a}__target-action {
  appearance: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 0 !important;
  margin: 0 !important;
  border-style: solid !important;
  border-width: 1px !important;
  box-shadow: none !important;
  font-family: inherit !important;
  line-height: 1 !important;
}

.${a}__target-resistance-button {
  width: 2.08rem !important;
  height: 1.82rem !important;
  border-color: rgba(123, 72, 73, 0.38) !important;
  border-radius: 7px !important;
  background: rgba(255, 252, 247, 0.74) !important;
  color: rgba(58, 45, 39, 0.84) !important;
  font-size: 0.76rem !important;
  font-weight: 950 !important;
  cursor: default !important;
}

.${a}__target-resistance-button i {
  font-size: 0.88rem !important;
}

.${a}__target-resistance-fallback {
  display: none !important;
}

.${a}__target-action {
  min-height: 1.82rem !important;
  border-color: rgba(123, 72, 73, 0.34) !important;
  border-radius: 7px !important;
  padding: 0.28rem 0.36rem !important;
  background: rgba(228, 214, 209, 0.64) !important;
  color: rgba(42, 30, 27, 0.82) !important;
  font-size: 0.72rem !important;
  font-weight: 900 !important;
  gap: 0.22rem !important;
  opacity: 0.74 !important;
  white-space: nowrap !important;
  cursor: default !important;
}

.${a}__target-action:disabled {
  opacity: 0.74 !important;
}

.${a}__target-summary-actions .${a}__target-action {
  width: 100% !important;
}

.${a}__target-action-icon {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

.${a}__target-action-label {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${a}__target-toggle {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 1.1rem !important;
  color: rgba(36, 27, 24, 0.78) !important;
  font-size: 1rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
  pointer-events: none !important;
  user-select: none !important;
}

.${a}__target-details {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  gap: 0.36rem !important;
  border: 1px solid rgba(151, 111, 45, 0.22) !important;
  border-radius: 8px !important;
  padding: 0.48rem !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.76), rgba(255, 245, 219, 0.42)) !important;
}

.${a}__target-details[hidden] {
  display: none !important;
}

.${a}__target-resistance-details {
  grid-column: 1 / -1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0.12rem !important;
  min-width: 0 !important;
}

.${a}__target-resistance-details strong {
  color: rgba(107, 78, 35, 0.96) !important;
  font-size: 0.74rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.075em !important;
  line-height: 1.08 !important;
  text-transform: uppercase !important;
}

.${a}__target-resistance-details span {
  color: rgba(36, 27, 24, 0.84) !important;
  font-size: 0.78rem !important;
  font-weight: 700 !important;
  line-height: 1.22 !important;
}

.${a}__target-formula {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  min-height: 1.82rem !important;
  min-width: 0 !important;
  border: 1px solid rgba(66, 47, 34, 0.18) !important;
  border-radius: 6px !important;
  padding: 0.28rem 0.46rem !important;
  background: rgba(255, 255, 255, 0.62) !important;
  color: rgba(36, 27, 24, 0.9) !important;
  font-size: 0.78rem !important;
  font-weight: 800 !important;
  line-height: 1 !important;
  gap: 0.46rem !important;
}

.${a}__target-formula span {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${a}__target-formula i {
  flex: 0 0 auto !important;
  font-size: 0.62rem !important;
  opacity: 0.68 !important;
}

.${a}__target-details-actions {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 0.32rem !important;
  grid-column: 1 / -1 !important;
}

.${a}__target-details-actions .${a}__target-action {
  justify-content: center !important;
  width: 100% !important;
  min-height: 2rem !important;
  padding-inline: 0.5rem !important;
}

.${a}__target-details-actions .${a}__target-action-label {
  overflow: visible !important;
  text-overflow: clip !important;
}

.${a}__workflow-section--effect-info {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  align-items: center !important;
  gap: 0.14rem 0.5rem !important;
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${a}__workflow-section--effect-info
  > .${a}__workflow-section-header strong {
  color: rgba(107, 78, 35, 0.95) !important;
}

.${a}__effect-info-body {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.12rem !important;
  min-width: 0 !important;
}

.${a}__effect-info-label {
  color: rgba(36, 27, 24, 0.9) !important;
  font-size: 0.81rem !important;
  font-weight: 850 !important;
  line-height: 1.18 !important;
  overflow-wrap: anywhere !important;
}

.${a}__effect-info-hint {
  color: rgba(36, 27, 24, 0.68) !important;
  font-size: 0.74rem !important;
  font-weight: 700 !important;
  line-height: 1.1 !important;
}

`, document.head.append(e);
}
const ff = [0, 100, 500, 1500, 3e3];
let ro = !1, qt = null;
function pf() {
  if (!ro) {
    ro = !0, mf(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Se(Jr(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Se(Jr(t));
    }), Hooks.once("ready", () => {
      Se(document), gf();
    }), document.addEventListener("click", cf), document.addEventListener("keydown", uf);
    for (const e of ff)
      globalThis.setTimeout(() => Se(document), e);
  }
}
function gf() {
  qt || !document.body || (qt = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Se(n);
  }), qt.observe(document.body, { childList: !0, subtree: !0 }));
}
function Se(e) {
  e && (Vc(e), xm(e), $m(e), lf(e), Mc(e));
}
function hf() {
  pf();
}
const _f = "data-paranormal-toolkit-action-section", bf = "ritual-log", yf = ".paranormal-toolkit-item-use-prompt__actions", Af = ".paranormal-toolkit-item-use-prompt__actions-title", Tf = [0, 100, 500, 1500];
let oo = !1;
function $f() {
  if (oo) return;
  const e = (t, n) => {
    ao(Ef(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), ao(document), oo = !0;
}
function ao(e) {
  for (const t of Tf)
    globalThis.setTimeout(() => wf(e), t);
}
function wf(e) {
  Rf(e), kf(e);
}
function Rf(e) {
  for (const t of e.querySelectorAll(
    `[${_f}="${bf}"]`
  ))
    t.remove();
}
function kf(e) {
  for (const t of e.querySelectorAll(yf)) {
    if (io(t.querySelector(Af)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (i) => io(i.textContent ?? "")
    ).some((i) => i.includes("ritual conjurado")) && t.remove();
  }
}
function Ef(e) {
  if (e instanceof HTMLElement || Cf(e))
    return e;
  if (If(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Cf(e) {
  return e instanceof HTMLElement;
}
function If(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function io(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Le = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Si = {
  PV: "system.attributes.hp"
}, Tn = {
  PV: [Le.PV, Si.PV],
  SAN: [Le.SAN],
  PE: [Le.PE],
  PD: [Le.PD]
}, $n = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Sf {
  getResource(t, n) {
    const r = so(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, i = `${o}.value`, s = `${o}.max`, l = foundry.utils.getProperty(t, i), u = foundry.utils.getProperty(t, s), d = co(t, n, i, l, "valor atual");
    if (d) return p(d);
    const f = co(t, n, s, u, "valor máximo");
    return f ? p(f) : _({
      value: l,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = so(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function so(e, t) {
  const n = Lf(e.type, t);
  if (n && lo(e, n))
    return _(n);
  const r = Tn[t].find(
    (o) => lo(e, o)
  );
  return r ? _(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Df(e, t),
    path: Tn[t].join(" | ")
  });
}
function Lf(e, t) {
  return e === "threat" ? Si[t] ?? null : e === "agent" ? Le[t] : null;
}
function lo(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Df(e, t) {
  const n = e.type ?? "unknown", r = Tn[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function co(e, t, n, r, o) {
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
class Pf {
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
      const s = $n.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: o } = n, i = vf(o);
    return i ? _(i) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of $n.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function vf(e) {
  if (uo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (uo(n))
      return n;
  }
  return null;
}
function uo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Nf = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class xf {
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
    const r = n.value, o = Of(t.ritual, r);
    return o.ok ? o.value ? _(o.value) : _({
      resource: "PE",
      amount: Nf[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Of(e, t) {
  const n = e.getFlag(c, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Mf(n) ? {
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
function Mf(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const zt = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ff(e) {
  if (!Gf(e.item)) return null;
  const t = wn(e.actor) ? e.actor : Bf(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: qf(e.token) ?? Uf(t),
    targets: zn(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Bf(e) {
  const t = e;
  return wn(t.actor) ? t.actor : wn(e.parent) ? e.parent : null;
}
function Uf(e) {
  const t = zf(e) ?? jf(e);
  return t ? Li(t) : null;
}
function qf(e) {
  return Rn(e) ? Li(e) : null;
}
function zf(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Rn(n) ? n : (t.getActiveTokens?.() ?? []).find(Rn) ?? null;
}
function jf(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Li(e) {
  const t = e.actor ?? null;
  return {
    tokenId: jt(e.id),
    actorId: jt(t?.id),
    sceneId: jt(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Gf(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function wn(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Rn(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function jt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Vf {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(zt.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, m.info(`${zt.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Ff(Hf(t));
    if (!n) {
      m.warn(`${zt.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Hf(e) {
  return e && typeof e == "object" ? e : {};
}
class Wf {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return Gt("missing-item-patch");
    if (t.type !== "ritual") return Gt("unsupported-item-type");
    const o = Kf(r);
    return Object.keys(o).length === 0 ? Gt("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Kf(e) {
  const t = {};
  k(t, "name", e.name), k(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (k(t, "system.circle", n.circle), k(t, "system.element", n.element), k(t, "system.target", n.target), k(t, "system.targetQtd", n.targetQuantity), k(t, "system.execution", n.execution), k(t, "system.range", n.range), k(t, "system.duration", n.duration), k(t, "system.skillResis", n.resistanceSkill), k(t, "system.resistance", n.resistance), k(t, "system.studentForm", n.studentForm), k(t, "system.trueForm", n.trueForm)), t;
}
function k(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function Gt(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Yf {
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
    return this.getNumber(t, $n.ritual.dt, 0);
  }
  getResources(t) {
    const n = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, r = [];
    for (const o of ["PV", "SAN", "PE", "PD"]) {
      const i = this.resourceAdapter.getResource(t, o);
      i.ok ? n[o] = i.value : r.push(i.error);
    }
    return { values: n, errors: r };
  }
  getNumber(t, n, r) {
    const o = foundry.utils.getProperty(t, n);
    return typeof o == "number" && Number.isFinite(o) ? o : r;
  }
}
class Qf {
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
class Zf {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Xf(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Vt(t)), _(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const o = this.register(r);
      if (!o.ok)
        return o;
      n.push(o.value);
    }
    return _(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? Vt(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? _(n) : p({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(Vt);
  }
  findForItem(t) {
    return this.list().map((n) => Jf(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Xf(e) {
  return !Ht(e.id) || !Ht(e.version) || !Ht(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : _(e);
}
function Jf(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const i = ep(o, t);
    if (!i.matches)
      return null;
    r += i.score, n.push(i.reason);
  }
  return {
    preset: e,
    score: r,
    reasons: n
  };
}
function ep(e, t) {
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
      const n = mo(t.name), r = e.names.map(mo).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = tp(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function mo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function tp(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Vt(e) {
  return structuredClone(e);
}
function Ht(e) {
  return typeof e == "string" && e.length > 0;
}
function lt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : _(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = St(e.amountFrom);
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
    }) : _(o);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function St(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const np = "dice-so-nice";
async function Di(e) {
  if (!rp() || !op()) return;
  const t = ap();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      m.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function rp() {
  try {
    return bc().enabled;
  } catch {
    return !1;
  }
}
function op() {
  return game.modules?.get?.(np)?.active === !0;
}
function ap() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function ip(e, t, n) {
  if (!fo(e.id) || !fo(e.formula))
    return p({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(e.formula), o = await Promise.resolve(r.evaluate()), i = o.total;
    if (typeof i != "number" || !Number.isFinite(i))
      return p({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await Di(o);
    const l = {
      ...n.rollRequests[e.id] ?? Pi(e, t),
      total: i,
      roll: o
    };
    return n.rolls[e.id] = l, _(l);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function Pi(e, t) {
  const n = e.intent ?? sp(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function sp(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function fo(e) {
  return typeof e == "string" && e.length > 0;
}
async function ct(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Ze(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Ze(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? Ze(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? Ze(t, n, r, o) : e.recover(t, n, o);
  }
}
function Ze(e, t, n, r) {
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
function lp(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: i } = e;
  if (t.operation === "damage") {
    const s = cp(t, n, r, o);
    n.damageInstances.push(s), i.emit("afterDamageResolution", n, {
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
    }), i.emit("afterApplyDamage", n, {
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
    const s = up(t, n, r, o);
    n.healingInstances.push(s), i.emit("afterApplyHealing", n, {
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
function cp(e, t, n, r) {
  const o = St(e.amountFrom), i = o ? t.rolls[o] : void 0;
  return {
    id: vi(t.id, "damage", r, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    damageType: i?.damageType,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function up(e, t, n, r) {
  const o = St(e.amountFrom);
  return {
    id: vi(t.id, "healing", r, t.healingInstances.length),
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
function vi(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function dp(e, t, n) {
  const r = St(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function mp(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: i } = e;
  i.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Ni("before", e), po("before", e), po("resolve", e);
}
function fp(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: i } = e;
  i.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Ni("apply", e);
}
function pp(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: i } = e;
  i.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Ni(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: i, lifecycle: s } = t, l = gp(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: o,
    step: n,
    metadata: i
  });
}
function po(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: i, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: i
  });
}
function gp(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function hp(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), _(void 0);
  } catch (r) {
    return p({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function _p(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return bp(e, t);
    case "spendRitualCost":
      return yp(e, t);
  }
}
async function bp(e, t) {
  const { context: n, resources: r } = e, o = lt(t, n);
  return o.ok ? xi(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function yp(e, t) {
  const { context: n, resources: r, ritualCosts: o } = e, i = o.getCost({
    actor: n.sourceActor,
    ritual: n.item
  });
  if (!i.ok)
    return p({
      reason: "ritual-cost-failed",
      message: i.error.message,
      cause: i.error
    });
  const s = i.value;
  return n.ritualCosts.push({
    ...s,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), xi(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function xi(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), _(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Ap(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: i } = e, s = Tp(t);
  for (const u of s.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const l = await i();
  if (!l.ok)
    return l;
  for (const u of s.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return l;
}
function Tp(e) {
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
class $p {
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
      const i = await this.runStep(o, n, r);
      if (!i.ok)
        return i;
    }
    return _({ definition: t, context: n });
  }
  async runStep(t, n, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, r);
      default:
        return Ap({
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
    const o = await _p({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? _(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = Pi(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const i = await this.runRollFormulaStep(t, n, r);
    if (!i.ok)
      return i;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: s }), _(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await ip(t, r, n);
    return o.ok ? _(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = lt(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const i = dp(t, n, o.value);
    mp({
      step: t,
      context: n,
      stepIndex: r,
      metadata: i,
      lifecycle: this.lifecycle
    }), fp({
      step: t,
      context: n,
      stepIndex: r,
      metadata: i,
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
      const u = await ct(this.resources, l, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(u, n, r, t);
      if (!d.ok)
        return d;
      lp({
        step: t,
        context: n,
        transaction: d.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return pp({
      step: t,
      context: n,
      stepIndex: r,
      metadata: i,
      lifecycle: this.lifecycle
    }), _(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = lt(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const i = this.resolveActors(t.actor, n);
    if (i.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const s of i) {
      const l = await ct(this.resources, s, t.resource, t.operation, o.value), u = this.handleResourceOperationResult(l, n, r, t);
      if (!u.ok)
        return u;
    }
    return _(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await hp(this.messages, t, n);
    return o.ok ? _(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, o) {
    return t.ok ? (n.resourceTransactions.push(t.value), _(t.value)) : p({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: o,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, o, i, s) {
    const l = wp(t, n.intent);
    l && this.lifecycle.emit(l, r, {
      stepIndex: o,
      step: i,
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
function wp(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Rp {
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
    const i = this.adapter.getResource(t, n);
    if (!i.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: i.error.reason,
        message: i.error.message,
        requestedAmount: o,
        path: i.error.path,
        value: i.error.value
      });
    const s = i.value, l = this.calculate(r, s, o);
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
    const { afterValue: u, appliedAmount: d } = l.value, f = {
      value: u,
      max: s.max
    };
    try {
      u !== s.value && await this.adapter.updateResourceValue(t, n, u);
    } catch (y) {
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
        cause: y
      });
    }
    return _({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: o,
      appliedAmount: d,
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
        }) : _({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const o = Math.max(0, n.value - r);
        return _({
          afterValue: o,
          appliedAmount: n.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(n.max, n.value + r);
        return _({
          afterValue: o,
          appliedAmount: o - n.value
        });
      }
    }
  }
}
function Oi(e) {
  return {
    id: kp(),
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
function kp() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ep {
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
    return re(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = Oi(n);
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
class Cp {
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
class Ip {
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
    const n = on();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Sp(),
      flags: {
        ...t.flags,
        [c]: {
          ...Lp(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && m.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = on();
    if (!r.enabled)
      return;
    const o = n.notification ?? go(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = go(n);
    switch (t) {
      case "info":
        m.info(r, n.data ?? "");
        return;
      case "warn":
        m.warn(r, n.data ?? "");
        return;
      case "error":
        m.error(r, n.data ?? "");
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
function go(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Sp() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Lp(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function Dp(e, t) {
  const n = Fp(e?.rounds);
  if (!n)
    return ho(null);
  const r = e?.anchor ?? Mi(t);
  if (!r)
    return {
      ...ho(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Pp(),
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
function Mi(e) {
  const t = Bp();
  if (!t?.id || !Fi(t.round)) return null;
  const n = Op(t), r = vp(e, n) ?? xp(t), o = j(r?.id), i = qp(r?.initiative), s = Np(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: s,
    initiative: i,
    time: Up()
  };
}
function Pp() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function ho(e) {
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
function vp(e, t) {
  return e?.id ? t.find((n) => Mp(n) === e.id) ?? null : null;
}
function Np(e, t, n) {
  const r = j(t?.id);
  if (r) {
    const o = n.findIndex((i) => i.id === r);
    if (o >= 0) return o;
  }
  return zp(e.turn) ? e.turn : null;
}
function xp(e) {
  return rt(e.combatant) ? e.combatant : null;
}
function Op(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(rt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(rt);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(rt);
  }
  return [];
}
function Mp(e) {
  return j(e.actor?.id) ?? j(e.actorId) ?? j(e.token?.actor?.id) ?? j(e.token?.actorId) ?? j(e.document?.actor?.id) ?? j(e.document?.actorId);
}
function Fp(e) {
  return Fi(e) ? Math.trunc(e) : null;
}
function Bp() {
  return game.combat ?? null;
}
function Up() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function rt(e) {
  return !!(e && typeof e == "object");
}
function j(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function qp(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Fi(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function zp(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class jp {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? _(n.value) : p({
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
    if (!Jp(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, i = Dp(t.duration, r), s = Gp(o, t, i), u = t.refreshExisting ?? !0 ? eg(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(s)), _(_o(r, o, u.id ?? null, !1, !0, i));
      } catch (d) {
        return p({
          actor: r,
          actorId: r.id ?? null,
          actorName: r.name ?? "Ator sem nome",
          conditionId: o.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
          cause: d
        });
      }
    try {
      const f = (await r.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return _(_o(r, o, f, !0, !1, i));
    } catch (d) {
      return p({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: o.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
        cause: d
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = Ui(n, r);
    let i = 0;
    try {
      for (const s of o)
        await bo(n, s) === "deleted" && (i += 1);
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
    return _({
      actor: n,
      actorId: n.id ?? null,
      actorName: n.name ?? "Ator sem nome",
      conditionId: r,
      removed: i
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = rg(), r = [];
    let o = 0, i = 0;
    for (const s of n) {
      const l = or(s);
      o += l.length;
      for (const u of l) {
        if (!Wp(u, t)) continue;
        const d = Bi(u);
        try {
          await bo(s, u) === "deleted" && (i += 1);
        } catch (f) {
          r.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: u.id ?? null,
            conditionId: d.conditionId,
            message: `Falha ao remover condição expirada ${d.conditionId ?? u.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
            cause: f
          });
        }
      }
    }
    return {
      reason: t.reason ?? "manual",
      scannedActors: n.length,
      scannedEffects: o,
      removedEffects: i,
      failures: r
    };
  }
}
function Gp(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: fg(),
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
    duration: Vp(n.duration),
    start: Hp(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [c]: r
    }
  };
}
function Vp(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Hp(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: mg(),
    ...e
  };
}
function _o(e, t, n, r, o, i) {
  return {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    conditionId: t.id,
    conditionLabel: t.label,
    effectId: n,
    created: r,
    refreshed: o,
    requestedRounds: i.requestedRounds,
    combatDurationApplied: i.combatDurationApplied,
    warning: i.warning
  };
}
function Wp(e, t) {
  const n = Bi(e);
  if (!n.conditionId || !Kp(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = dg();
  return n.durationMode === "combatantTurn" || Yp(n) ? Zp(n, r) : Qp(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !D(n.startRound) || !D(n.requestedRounds) || !D(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Kp(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && D(e.requestedRounds);
}
function Yp(e) {
  return !!(e.combatDurationApplied && D(e.requestedRounds) && D(e.startRound) && (e.startCombatantId || ut(e.startTurn)));
}
function Qp(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Zp(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !D(e.startRound) || !D(e.requestedRounds) || !D(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Xp(t);
  return e.startCombatantId ? r === e.startCombatantId : ut(e.startTurn) && ut(t.turn) ? t.turn === e.startTurn : !1;
}
function Xp(e) {
  return me(e.combatant?.id);
}
function Bi(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: ot(e, "conditionId"),
    requestedRounds: yo(e, "requestedRounds") ?? De(t.value) ?? De(t.rounds),
    combatDurationApplied: Wt(e, "combatDurationApplied"),
    combatId: ot(e, "combatId") ?? me(n.combat) ?? me(t.combat),
    startCombatantId: ot(e, "startCombatantId") ?? me(n.combatant),
    startInitiative: sg(e, "startInitiative") ?? qi(n.initiative),
    startRound: yo(e, "startRound") ?? De(n.round) ?? De(t.startRound),
    startTurn: ig(e, "startTurn") ?? kn(n.turn) ?? kn(t.startTurn),
    expiryEvent: lg(e, "expiryEvent") ?? zi(t.expiry),
    durationMode: cg(e, "durationMode"),
    deleteOnExpire: Wt(e, "deleteOnExpire"),
    expiresWithCombat: Wt(e, "expiresWithCombat")
  };
}
function Jp(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function eg(e, t) {
  return Ui(e, t)[0] ?? null;
}
function Ui(e, t) {
  return or(e).filter((n) => ag(n) === t);
}
async function bo(e, t) {
  const n = t.id ?? null, r = n ? tg(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (ng(o)) return "missing";
    throw o;
  }
}
function tg(e, t) {
  return or(e).find((n) => n.id === t) ?? null;
}
function ng(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function rg() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Xe(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Xe(e, n);
  });
  for (const n of og())
    Xe(e, n.actor), Xe(e, n.document?.actor);
  return Array.from(e.values());
}
function Xe(e, t) {
  if (!ug(t)) return;
  const r = me(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function og() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function or(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function ag(e) {
  return ot(e, "conditionId");
}
function ot(e, t) {
  return me(ie(e, t));
}
function yo(e, t) {
  return De(ie(e, t));
}
function ig(e, t) {
  return kn(ie(e, t));
}
function sg(e, t) {
  return qi(ie(e, t));
}
function lg(e, t) {
  return zi(ie(e, t));
}
function cg(e, t) {
  const n = ie(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Wt(e, t) {
  return ie(e, t) === !0;
}
function ie(e, t) {
  const n = e.getFlag?.(c, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const o = r[c];
  if (!(!o || typeof o != "object"))
    return o[t];
}
function me(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function De(e) {
  return D(e) ? Math.trunc(e) : null;
}
function kn(e) {
  return ut(e) ? Math.trunc(e) : null;
}
function qi(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function zi(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function ug(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function dg() {
  return game.combat ?? null;
}
function mg() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function D(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function ut(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function fg() {
  return game.user?.id ?? null;
}
const pg = "icons/svg/downgrade.svg", gg = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? pg,
    description: gg,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const hg = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), _g = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), bg = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), yg = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Ag = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Tg = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), $g = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), wg = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Rg = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), kg = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Eg = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Cg = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Ig = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Sg = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Lg = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Dg = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Pg = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), vg = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Ng = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), xg = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Og = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Mg = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Fg = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Bg = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Ug = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), qg = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), zg = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), jg = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Gg = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Vg = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), Hg = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Wg = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Kg = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Yg = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Qg = [
  hg,
  _g,
  bg,
  yg,
  Ag,
  Tg,
  $g,
  wg,
  Rg,
  kg,
  Eg,
  Cg,
  Ig,
  Sg,
  Lg,
  Dg,
  Pg,
  vg,
  Ng,
  xg,
  Og,
  Mg,
  Fg,
  Bg,
  Ug,
  qg,
  zg,
  jg,
  Gg,
  Vg,
  Hg,
  Wg,
  Kg,
  Yg
];
class Zg {
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
    return Array.from(this.definitions.values()).map(Ao);
  }
  get(t) {
    const n = this.lookup.get(To(t)), r = n ? this.definitions.get(n) : null;
    return r ? _(Ao(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = To(t);
    r && this.lookup.set(r, n);
  }
}
function Xg() {
  return new Zg(Qg);
}
function Ao(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function To(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const Jg = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", ji = `${c}-inline-roll-neutralized`, eh = `${c}-inline-roll-notice`, ar = `data-${c}-inline-roll-neutralized`, $o = `data-${c}-inline-roll-notice`, th = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function wo(e) {
  const t = gh(e.message), n = await nh(e.message), r = rh(t);
  return n.replacementCount + r.replacementCount > 0 && m.info("Rolagens inline neutralizadas para item automatizado.", {
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
async function nh(e) {
  const t = mh(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = oh(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await fh(t, n.content), replacementCount: n.replacementCount };
}
function rh(e) {
  const t = e ? ph(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Gi(t);
  return n > 0 && Vi(ch(t)), { replacementCount: n };
}
function oh(e) {
  const t = ah(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Gi(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (Vi(n.content), { content: n.innerHTML, replacementCount: o });
}
function ah(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, sh(o.trim()))), replacementCount: t };
}
function Gi(e) {
  const t = ih(e);
  for (const n of t)
    n.replaceWith(lh(uh(n)));
  return t.length;
}
function ih(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(Jg))
    n.getAttribute(ar) !== "true" && t.add(n);
  return Array.from(t);
}
function sh(e) {
  return `<span class="${ji}" ${ar}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${hh(e)}</span>`;
}
function lh(e) {
  const t = document.createElement("span");
  return t.classList.add(ji), t.setAttribute(ar, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Vi(e) {
  if (e.querySelector?.(`[${$o}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(eh), t.setAttribute($o, "true"), t.textContent = th, e.append(t);
}
function ch(e) {
  return e.querySelector(".message-content") ?? e;
}
function uh(e) {
  const n = e.getAttribute("data-formula") ?? dh(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function dh(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function mh(e) {
  return e && typeof e == "object" ? e : null;
}
async function fh(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return m.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function ph(e) {
  const t = _h(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function gh(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function hh(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function _h(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const dt = "ritualRollConfig", fe = "ritual-roll";
function Lt() {
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
function Hi(e) {
  const t = e.getFlag(c, dt);
  return En(t);
}
function Wi(e) {
  return Hi(e) ?? Lt();
}
async function bh(e, t) {
  const n = En(t) ?? En({
    ...Lt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(c, dt, n), n;
}
async function yh(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, c, dt));
    return;
  }
  await e.setFlag(c, dt, null);
}
function En(e) {
  if (!Dt(e)) return null;
  const t = Ih(e.intent);
  if (!t) return null;
  const n = Lt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: mt(e.damageType),
    utilityLabel: mt(e.utilityLabel) ?? n.utilityLabel,
    note: ir(e.note),
    forms: Sh(e.forms)
  };
}
function Ah(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Th(e) {
  const t = Hi(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = $h(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...wh(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: kh(e, t),
    resistance: t.intent === "damage" ? Eh(e) : void 0
  };
}
function $h(e, t) {
  const n = {
    type: "rollFormula",
    id: fe,
    formula: t,
    intent: Ch(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function wh(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${fe}.total`,
          ...Rh(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${fe}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function Rh(e) {
  return e ? { damageType: e } : {};
}
function kh(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [fe]: n
      }
    }
  };
  return Ro(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [fe]: t.forms.discente.formula.trim()
    }
  }), Ro(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [fe]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Eh(e) {
  const t = Ki(e), n = mt(t.skillResis), r = mt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = Lh(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function Ch(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Ih(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function Sh(e) {
  const t = Lt();
  return Dt(e) ? {
    base: Kt(e.base),
    discente: Kt(e.discente),
    verdadeiro: Kt(e.verdadeiro)
  } : t.forms;
}
function Kt(e) {
  return Dt(e) ? { formula: ir(e.formula) } : { formula: "" };
}
function Ro(e, t) {
  const n = Ki(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return Dh(r);
}
function Ki(e) {
  const t = e.system;
  return Dt(t) ? t : {};
}
function Lh(e) {
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
function Dh(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function ir(e) {
  return typeof e == "string" ? e.trim() : "";
}
function mt(e) {
  const t = ir(e);
  return t.length > 0 ? t : null;
}
function Dt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const ko = "occultism";
function Ph(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function vh(e) {
  const t = Ph(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await Nh(e, ko);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Di(n);
  const r = Mh(n);
  return {
    skill: ko,
    skillLabel: "Ocultismo",
    roll: n,
    formula: Oh(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: Fh(n)
  };
}
async function Nh(e, t) {
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
  return xh(r);
}
function xh(e) {
  return Eo(e) ? e : Array.isArray(e) ? e.find(Eo) ?? null : null;
}
function Eo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Oh(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Mh(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Fh(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Bh);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((i) => {
    if (!i || typeof i != "object") return [];
    const s = i.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Bh(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function Uh(e) {
  switch (qh(e)) {
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
      return zh(String(e ?? ""));
  }
}
function qh(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function zh(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function jh(e) {
  return {
    header: {
      eyebrow: On,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Kh(e.ritual)
    },
    forms: e.variantOptions.map((t) => Gh(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: Wh(e.automationStatus ?? "assisted")
  };
}
function Gh(e, t) {
  const n = Vh(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Hh(t) : "—",
    details: n
  };
}
function Vh(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Hh(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function Wh(e) {
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
function Kh(e) {
  const t = e.system, n = [Qh(t?.element), Yh(t?.circle)].filter(Jh);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function Yh(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Qh(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (Zh(e)) {
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
      return Xh(e);
  }
}
function Zh(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function Xh(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function Jh(e) {
  return typeof e == "string" && e.length > 0;
}
const Yi = ["base", "discente", "verdadeiro"];
function Qi(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function ft(e) {
  return typeof e == "string" && Yi.includes(e);
}
const { ApplicationV2: e_ } = foundry.applications.api;
class ve extends e_ {
  constructor(t, n) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = jh(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: ve.onCast,
      cancel: ve.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new ve(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    n_(o, (i) => {
      this.selectedVariant = i;
    }), r_(o, (i) => {
      this.spendResource = i;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${E(this.model.header.eyebrow)}</p>
        <div>
          <h2>${E(this.model.header.title)}</h2>
          <p>${E(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(t_).join("")}
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
          <div><dt>Custo base</dt><dd>${E(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${E(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${E(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${E(this.model.automation.title)}</strong></p>
        <p>${E(this.model.automation.description)}</p>
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
    const n = i_(t), r = o_(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function t_(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((i) => `<span>${E(i)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${E(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${E(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${E(e.label)}</strong>
        <em>${E(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function n_(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Co(e, o, t)), o.addEventListener("keydown", (i) => {
      i.key !== "Enter" && i.key !== " " || (i.preventDefault(), Co(e, o, t));
    });
  const r = Zi(e);
  r && t(r);
}
function Co(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !ft(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Zi(e));
}
function Zi(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), i = o?.checked === !0;
    r.setAttribute("aria-checked", i ? "true" : "false"), i && ft(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function r_(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function o_(e, t, n) {
  const r = a_(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function a_(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (ft(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return ft(n) ? n : null;
}
function i_(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function E(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function s_(e) {
  return ve.request(e);
}
const sr = {
  label: "Padrão"
}, l_ = {
  label: "Discente",
  extraCost: 2
}, c_ = {
  label: "Verdadeiro",
  extraCost: 5
};
class u_ {
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
    const r = this.resolveCostPreview(t), o = eb(n), i = Z_(
      n,
      t.item,
      r,
      o
    ), s = await s_({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((R) => R.name),
      cost: r,
      defaultSpendResource: ib(n),
      variantOptions: i,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = d_(s), u = nb(
      n,
      t.item,
      l.variant,
      o
    ), d = ya();
    let f = null;
    if (d) {
      const R = await f_(
        this.resources,
        t.actor,
        l,
        u,
        r
      );
      if (!R.ok)
        return {
          status: "failed",
          reason: R.reason,
          message: R.message
        };
      try {
        f = await vh(
          t.actor
        );
      } catch (U) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: U instanceof Error ? U.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: U
        };
      }
    }
    const y = m_(
      n,
      l,
      u,
      r,
      {
        includeCostSteps: !d
      }
    );
    if (y.steps.length === 0) {
      const R = tb(
        t,
        l
      ), U = Io(
        t.actor,
        f,
        u,
        r
      ), yr = So(
        n,
        l,
        u,
        r,
        R,
        t,
        f
      );
      return U.length > 0 ? {
        status: "ready",
        workflowContext: R,
        actions: U,
        summaryLines: yr
      } : {
        status: "completed-without-actions",
        workflowContext: R,
        summaryLines: yr
      };
    }
    const T = await this.workflow.runAutomation(y, {
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
    const $ = T.value.context, g = A_(
      n,
      t,
      $
    ), v = g_(
      n,
      t
    ), we = Io(
      t.actor,
      f,
      u,
      r
    ), Re = So(
      n,
      l,
      u,
      r,
      $,
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
    const ke = [
      ...we,
      ...g.actions,
      ...v.actions
    ];
    return ke.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: $,
      summaryLines: Re
    } : {
      status: "ready",
      workflowContext: $,
      actions: ke,
      summaryLines: Re
    };
  }
  async applyAction(t) {
    return ct(
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
function d_(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function m_(e, t, n, r, o) {
  const i = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || cr(l) && (!o.includeCostSteps || !s) || i.push(p_(l, n));
  return o.includeCostSteps && s && r && sb(n.extraCost) && i.push({
    type: "spendResource",
    actor: "self",
    resource: r.resource,
    amount: n.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: i
  };
}
async function f_(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const i = ze(o, r);
  if (!i)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (i.amount <= 0) return { ok: !0 };
  const s = await e.spend(
    t,
    i.resource,
    i.amount
  );
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function p_(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Io(e, t, n, r) {
  if (!t || t.success) return [];
  const o = ze(r, n);
  if (!o || o.amount <= 0) return [];
  const i = e.name ?? "Ator sem nome";
  return [
    {
      kind: "resource-operation",
      actor: e,
      actorName: i,
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
function g_(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = lr(r.actor, t);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const i of o) {
      const s = Mi(i);
      n.push(
        h_(
          r,
          i,
          t.item,
          s
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function h_(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", i = e.label ?? y_(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: i,
    duration: __(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: b_(i, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${i} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function __(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function b_(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function y_(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function A_(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const i of e.steps) {
    if (i.type !== "modifyResource") continue;
    const s = lt(i, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = lr(i.actor, t);
    if (l.length === 0) {
      if (i.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of l) {
      if (T_(i)) {
        $_(
          o,
          u,
          w_(i, n, s.value)
        );
        continue;
      }
      r.push(k_(i, u, s.value));
    }
  }
  for (const i of o.values())
    r.push(
      ...R_(
        e,
        t.item,
        i.actor,
        i.entries
      )
    );
  return { ok: !0, actions: r };
}
function T_(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function $_(e, t, n) {
  const r = S_(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function w_(e, t, n) {
  const r = L_(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function R_(e, t, n, r) {
  const o = N_(e), i = o.length > 1 ? M_() : void 0;
  return o.map((s) => {
    const l = r.map(
      (d, f) => {
        const y = x_(d.amount, s);
        return {
          id: E_(d, s, f),
          amount: y,
          damageType: d.damageType,
          sourceRollId: d.sourceRollId,
          ignoreResistance: d.step.ignoreResistance === !0
        };
      }
    ), u = l.reduce(
      (d, f) => d + f.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: l,
      label: C_(u, s, o.length > 1),
      executedLabel: I_(
        n.name ?? "Ator sem nome",
        s,
        o.length > 1
      ),
      choiceGroupId: i,
      choiceGroupResolvedLabel: i ? "✓ Outra opção escolhida" : void 0,
      actionSectionId: "apply-damage",
      actionSectionTitle: "Aplicar danos",
      source: "item-use.damage-action",
      originUuid: t.uuid ?? null
    };
  });
}
function k_(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = v_(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: D_(e, r, n),
    executedLabel: P_(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function E_(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function C_(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function I_(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function S_(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function L_(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function D_(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function P_(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function v_(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function N_(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function x_(e, t) {
  const n = e * t.multiplier, r = O_(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function O_(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function M_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function lr(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function So(e, t, n, r, o, i, s = null) {
  return [
    `Forma: ${Qi(t.variant)}`,
    q_(t, n, r),
    ...U_(s),
    ...Object.values(o.rolls).flatMap(z_),
    ...F_(e, i),
    ...j_(e.resistance),
    ...Y_(n)
  ];
}
function F_(e, t) {
  return B_(e) ? lr("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function B_(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function U_(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function q_(e, t, n) {
  const r = ze(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function z_(e) {
  const n = [`${Q_(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = G_(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${Uh(e.damageType)}`), n;
}
function j_(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function G_(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const n = [];
  let r = "+";
  for (const o of t) {
    if (!o || typeof o != "object") continue;
    const i = o;
    if (i.operator === "+" || i.operator === "-") {
      r = i.operator;
      continue;
    }
    const s = V_(i);
    s && (K_(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function V_(e) {
  const t = H_(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : W_(e);
}
function H_(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function W_(e) {
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
function K_(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function Y_(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Q_(e) {
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
function Z_(e, t, n, r) {
  return Yi.map((o) => {
    const i = Xi(
      e,
      t,
      o,
      r
    ), s = i !== null;
    return {
      variant: o,
      label: i?.label ?? Qi(o),
      enabled: s,
      details: i ? X_(i, n, r) : [],
      finalCostText: i ? J_(n, i) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function X_(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const i = ze(t, e);
  return r.push(
    i ? `Custo final: ${i.amount} ${i.resource}` : "Custo final não resolvido"
  ), r;
}
function ze(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function J_(e, t) {
  const n = ze(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function eb(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(cr);
}
function tb(e, t) {
  return Oi({
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
function nb(e, t, n, r) {
  return Xi(e, t, n, r) ?? sr;
}
function Xi(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? ob(t, n) ? rb(n) : null : n === "base" ? sr : null);
}
function rb(e) {
  switch (e) {
    case "base":
      return sr;
    case "discente":
      return l_;
    case "verdadeiro":
      return c_;
  }
}
function ob(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return ab(foundry.utils.getProperty(e, n));
}
function ab(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function ib(e) {
  return e.steps.some(cr);
}
function cr(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function sb(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Ji = "itemUsePrompts", es = "chatCard", Pt = "data-paranormal-toolkit-prompt-id", vt = "data-paranormal-toolkit-pending-id", ur = "data-paranormal-toolkit-executed-label", Cn = "data-paranormal-toolkit-choice-group", ts = "data-paranormal-toolkit-skipped-label", Lo = "data-paranormal-toolkit-action-section", Do = "data-paranormal-toolkit-detail-key", Po = "data-paranormal-toolkit-roll-card", dr = "data-paranormal-toolkit-roll-detail-toggle", ns = "data-paranormal-toolkit-roll-detail-id", rs = "data-paranormal-toolkit-resistance-roll-button", os = "data-paranormal-toolkit-resistance-skill", as = "data-paranormal-toolkit-resistance-skill-label", is = "data-paranormal-toolkit-resistance-target-actor-id", ss = "data-paranormal-toolkit-resistance-target-name", ls = "data-paranormal-toolkit-resistance-roll-result", vo = "data-paranormal-toolkit-system-card-replaced", lb = `[${vt}]`, cb = `[${dr}]`, ub = `[${rs}]`, In = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, db = `${h}__actions`, No = `${h}__details`, cs = `${h}__summary`, mb = `${h}__title`, us = `${h}__button--executed`, xo = `${h}__roll-card`;
let Oo = !1, Sn = null;
const P = /* @__PURE__ */ new Map(), fb = [0, 100, 500, 1500, 3e3], pb = 3e4, gb = [0, 100, 500, 1500, 3e3];
function hb(e) {
  if (Sn = e, Oo) {
    Fo(e);
    return;
  }
  const t = (n, r) => {
    ms(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Oo = !0, Fo(e);
}
async function Mo(e) {
  const t = ds(e);
  P.set(e.pendingId, t), await pr(t) || $s(t), fs(e.pendingId);
}
async function _b(e) {
  const t = ds({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await pr(t) || $s(t), fs(e.pendingId);
}
async function Yt(e, t) {
  const n = P.get(e);
  P.delete(e), n && await hy(n, t);
}
function mr(e) {
  const t = Is();
  for (const n of t) {
    const r = B(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function bb(e, t) {
  const n = mr(e);
  if (!n) return;
  const r = B(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await Ae(n.message, r));
}
async function yb(e, t, n) {
  if (!t) return;
  const r = mr(e);
  if (!r) return;
  const o = B(r.message);
  let i = !1;
  for (const [s, l] of Object.entries(o))
    s !== e && l.choiceGroupId === t && (o[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, i = !0);
  i && await Ae(r.message, o);
}
function ds(e) {
  const t = K(e.context.message), n = e.context.targets.find((s) => vn(s)), r = n ? vn(n) : null, o = e.resistanceTargetActor ?? r, i = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    resistanceTargetActorId: e.resistanceTargetActorId ?? o?.id ?? null,
    resistanceTargetName: i,
    resistanceRollResult: null,
    actionPayload: e.actionPayload ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: Vb(e.context),
    executed: !1
  };
}
function ms(e, t, n) {
  gy();
  const r = xt(t);
  if (!r) return;
  const o = my(e, r);
  o.length > 0 && pt(r);
  for (const i of o)
    Ln(r, i);
  hs(r, n), Dn(r), Pn(r);
}
function Fo(e) {
  for (const t of gb)
    globalThis.setTimeout(() => {
      Ab(e);
    }, t);
}
function Ab(e) {
  for (const t of Tb()) {
    const n = Nt(t);
    $b(n) && ms(n, t, e);
  }
}
function Tb() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function $b(e) {
  return e ? gr(e) ? !0 : by(e).length > 0 : !1;
}
function fs(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? fy(t.messageId) : null;
  if (n) {
    jo(n, t), pt(n), Ln(n, t), Bo(n), Dn(n), Pn(n);
    return;
  }
  if (t.messageId) {
    xn(t);
    return;
  }
  const r = py(t);
  if (r) {
    jo(r, t), pt(r), Ln(r, t), Bo(r), Dn(r), Pn(r);
    return;
  }
  xn(t);
}
function Bo(e) {
  Sn && hs(e, Sn);
}
function pt(e) {
  const t = wb();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = gs(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(vo) === "true") return;
  const r = n.querySelector(`.${In}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(vo, "true");
}
function wb() {
  try {
    return Fl() === "replace";
  } catch {
    return !1;
  }
}
function Ln(e, t) {
  if (pt(e), e.querySelector(`[${Pt}="${Te(t.pendingId)}"]`)) return;
  const n = Rb(e, t);
  Eb(n, t), Ub(n, qb(t)).append(Gb(t));
}
function Rb(e, t) {
  const n = e.querySelector(`.${In}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(In, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const i = document.createElement("span");
  i.classList.add(`${h}__kicker`), i.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(mb), s.textContent = kb(t);
  const l = document.createElement("span");
  return l.classList.add(cs), l.textContent = t.summary, o.append(i, s, l), r.append(o), Wb(e).append(r), r;
}
function kb(e) {
  const t = C(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Eb(e, t) {
  const n = t.summaryLines ?? [], r = As(n, t);
  if (r) {
    Cb(e, r, t);
    return;
  }
  zb(e, n);
}
function Cb(e, t, n) {
  if (e.querySelector(`[${Po}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(xo, `${xo}--${t.intent}`), r.setAttribute(Po, "true"), t.castingCheck && Uo(r, Sb(t.castingCheck), n.pendingId, "casting"), Ib(t) && Uo(r, Lb(t), n.pendingId, "effect"), xb(r, t), Ob(r, t, n), Bb(r, t), e.append(r);
}
function Ib(e) {
  return e.intent !== "casting";
}
function Sb(e) {
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
function Lb(e) {
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
function Uo(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${h}__workflow-section--${t.status}`);
  const i = document.createElement("div");
  i.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, i.append(s), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, i.append(l);
  }
  if (o.append(i), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, o.append(l);
  }
  Db(o, t), Fb(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Db(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const i = Pb(t.formula, t.diceBreakdown);
  i && n.append(i), e.append(n);
}
function Pb(e, t) {
  const n = vb(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of Nb(n, e)) {
    const i = document.createElement("span");
    i.classList.add(`${h}__workflow-die`), o.active || i.classList.add(`${h}__workflow-die--inactive`), i.textContent = String(o.value), r.append(i);
  }
  return r;
}
function vb(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Nb(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? qo(e, "highest") : n.includes("kl") ? qo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function qo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const i = !r && o === n;
    return i && (r = !0), { value: o, active: i };
  });
}
function xb(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Oy);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const i = document.createElement("span");
    i.classList.add(`${h}__roll-meta-pill`), i.textContent = o, r.append(i);
  }
  e.append(r);
}
function Ob(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const i = document.createElement("strong");
  i.textContent = "Resistência";
  const s = Mb(t, n);
  o.append(i), s && o.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(o, l), t.resistanceRollResult && r.append(ps(t.resistanceRollResult)), e.append(r);
}
function Mb(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Pt, t.pendingId), n.setAttribute(rs, "true"), n.setAttribute(os, e.resistanceSkill), n.setAttribute(as, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(is, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(ss, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(ls, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function ps(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = bs(e), t;
}
function Fb(e, t, n, r, o) {
  const i = t.filter((d) => d.value.trim().length > 0);
  if (i.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(dr, s), l.setAttribute("aria-expanded", "false"), l.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(ns, s), u.hidden = !0;
  for (const d of i) {
    const f = document.createElement("dt");
    f.textContent = d.label;
    const y = document.createElement("dd");
    y.textContent = d.value, u.append(f, y);
  }
  e.append(l, u);
}
function Bb(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function Ub(e, t) {
  const n = `[${Lo}="${Te(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(db), o.setAttribute(Lo, t.id);
  const i = document.createElement("strong");
  return i.classList.add(`${h}__actions-title`), i.textContent = t.title, o.append(i), e.append(o), o;
}
function qb(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = As(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function zb(e, t) {
  if (t.length === 0) return;
  const n = jb(e);
  for (const r of t) {
    const o = My(r);
    if (n.querySelector(`[${Do}="${Te(o)}"]`)) continue;
    const i = document.createElement("li");
    i.textContent = r, i.setAttribute(Do, o), n.append(i);
  }
}
function jb(e) {
  const t = e.querySelector(`.${No}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(No), e.append(n), n;
}
function Gb(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(Pt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(us), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(vt, e.pendingId), t.setAttribute(ur, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Cn, e.choiceGroupId), t.setAttribute(ts, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Vb(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Hb(e);
  return `${t} → ${n}`;
}
function Hb(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Wb(e) {
  return gs(e) ?? e;
}
function gs(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function hs(e, t) {
  const n = xt(e);
  if (!n) return;
  const r = n.querySelectorAll(lb);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      sy(o, t);
    }));
}
function Dn(e) {
  const t = xt(e);
  if (!t) return;
  const n = t.querySelectorAll(cb);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Kb(t, r);
    }));
}
function Pn(e) {
  const t = xt(e);
  if (!t) return;
  const n = t.querySelectorAll(ub);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Yb(t, r);
    }));
}
function Kb(e, t) {
  const n = t.getAttribute(dr);
  if (!n) return;
  const r = e.querySelector(`[${ns}="${Te(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Yb(e, t) {
  const n = t.getAttribute(Pt), r = t.getAttribute(os), o = t.getAttribute(as) ?? (r ? qe(r) : "Resistência");
  if (!n || !r) return;
  const i = Xb(e, n), s = Jb(i, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await za(s, r);
    await oy(u.roll);
    const d = {
      skill: r,
      skillLabel: o,
      formula: u.formula,
      total: u.total,
      targetName: s.name ?? i?.resistanceTargetName ?? "alvo",
      diceBreakdown: u.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Qb(t, d), Zb(t, d), ay(n, d), await iy(e, n, d);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function Qb(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(ls, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Zb(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? ps(t);
  if (r) {
    r.textContent = bs(t);
    return;
  }
  n.append(o);
}
function Xb(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = Nt(e);
  return B(r)[t] ?? null;
}
function Jb(e, t) {
  const n = e?.resistanceTargetActor;
  if (O(n)) return n;
  const o = e?.context?.targets.map(vn).find(O) ?? null;
  if (o) return o;
  const i = t.getAttribute(is) ?? e?.resistanceTargetActorId ?? null, s = i ? ty(i) : null;
  return s || ny(
    t.getAttribute(ss) ?? e?.resistanceTargetName ?? ey(t)
  );
}
function ey(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${cs}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), i = o[o.length - 1]?.trim();
  return i && i.length > 0 ? i : null;
}
function vn(e) {
  const t = e.actor;
  if (O(t)) return t;
  const n = e.token, r = Me(n);
  if (r) return r;
  const o = e.document;
  return Me(o);
}
function Me(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (O(t)) return t;
  const n = e.document?.actor;
  return O(n) ? n : null;
}
function ty(e) {
  const n = game.actors?.get?.(e);
  return O(n) ? n : _s().map((i) => Me(i)).find((i) => i?.id === e) ?? null;
}
function ny(e) {
  const t = pe(e);
  if (!t) return null;
  const n = _s().filter((i) => pe(ry(i)) === t).map((i) => Me(i)).find(O) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((i) => O(i) && pe(i.name) === t);
  return O(o) ? o : null;
}
function _s() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function ry(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Me(e)?.name ?? null;
}
function pe(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function O(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function bs(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function oy(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function ay(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function iy(e, t, n) {
  const r = Nt(e);
  if (r)
    try {
      const o = B(r), i = o[t];
      if (!i) return;
      o[t] = {
        ...i,
        resistanceRollResult: n
      }, await Ae(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Nt(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return F(r?.get?.(n));
}
async function sy(e, t) {
  const n = e.getAttribute(vt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    ys(e, e.getAttribute(ur) ?? "✓ Automação aplicada"), ly(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function ys(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(us), e.removeAttribute(vt), e.removeAttribute(ur);
}
function ly(e) {
  const t = e.getAttribute(Cn);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Cn}="${Te(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const i = o.getAttribute(ts) ?? "✓ Outra opção escolhida";
    ys(o, i);
  }
}
function As(e, t) {
  const n = e.map(fr).filter(Ny), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = C(e, "Forma"), i = C(e, "Custo"), s = C(e, "Dados") ?? C(e, `Dados (${r.label})`), l = C(e, "Tipo"), u = C(e, "Resistência"), d = C(e, "Resistência Perícia"), f = C(e, "Resistência Rótulo") ?? (d ? qe(d) : null), y = Ts(e, "Observação"), T = e.filter((g) => dy(g, r)), $ = cy(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: i,
    diceBreakdown: s,
    damageType: l,
    resistance: u,
    resistanceSkill: d,
    resistanceSkillLabel: f,
    notes: y,
    details: T,
    castingCheck: $,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function cy(e) {
  const t = e.map(fr).find((i) => i?.intent === "casting") ?? null, n = C(e, "Conjuração DT"), r = C(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: C(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: C(e, "Dados (Conjuração)")
  } : null;
}
function fr(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, i = Number(o);
  return Number.isFinite(i) ? {
    label: n,
    formula: r,
    total: i,
    intent: uy(n)
  } : null;
}
function uy(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function C(e, t) {
  return Ts(e, t)[0] ?? null;
}
function Ts(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function dy(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || fr(e) ? !1 : e.trim().length > 0;
}
function my(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    Nn(r, e, t) && n.set(r.pendingId, r);
  for (const r of _y(e))
    Nn(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Nn(e, t, n) {
  const r = K(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !zo(n, "itemId", e.itemId) ? !1 : !e.actorId || zo(n, "actorId", e.actorId);
}
function zo(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${Fy(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function fy(e) {
  const t = Te(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function py(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Nn(e, null, t))
      return t;
  return null;
}
function gy() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function jo(e, t) {
  const n = Nt(e);
  if (!n) return !1;
  try {
    const r = B(n);
    return r[t.pendingId] = hr(t, K(n)), await Ae(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function pr(e) {
  const t = ks(e);
  if (!t) return !1;
  try {
    const n = B(t);
    return n[e.pendingId] = hr(e, K(t)), await Ae(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function $s(e) {
  for (const t of fb)
    globalThis.setTimeout(() => {
      xn(e);
    }, t);
}
async function xn(e) {
  const t = ks(e);
  if (gr(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await pr(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function hy(e, t) {
  const n = Rs(e.context.message);
  if (n)
    try {
      const r = B(n), o = r[e.pendingId] ?? hr(e, K(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await Ae(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function _y(e) {
  return Object.values(B(F(e))).filter(je);
}
function B(e) {
  if (!e) return {};
  const t = {}, n = gr(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(ws(e)))
    t[r] ??= o;
  return t;
}
function by(e) {
  return Object.values(ws(F(e))).filter(je);
}
function ws(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, Ji);
  if (!_e(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    je(o) && (n[r] = o);
  return n;
}
async function Ae(e, t) {
  typeof e.setFlag == "function" && (await Ay(e, t), await yy(e, t));
}
async function yy(e, t) {
  await Promise.resolve(e.setFlag?.(c, Ji, t));
}
function gr(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, es);
  return Py(t) ? t : null;
}
async function Ay(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(je).sort((i, s) => i.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((i) => i.createdAt)),
    messageId: r.messageId ?? K(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: Ty(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(c, es, o));
}
function Ty(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function hr(e, t) {
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
function Rs(e) {
  const t = F(e);
  if (t?.setFlag)
    return t;
  const n = $y(e);
  if (n?.setFlag)
    return n;
  const r = K(e);
  if (!r) return null;
  const o = game.messages;
  return F(o?.get?.(r));
}
function $y(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(F).find((n) => typeof n?.setFlag == "function") ?? null;
}
function ks(e) {
  const t = Rs(e.context.message);
  if (t) return t;
  const n = e.messageId ? wy(e.messageId) : null;
  if (n) return n;
  const r = Is().slice().reverse();
  return r.find((o) => Ry(o, e)) ?? r.find((o) => ky(o, e)) ?? null;
}
function wy(e) {
  const t = game.messages;
  return F(t?.get?.(e));
}
function Ry(e, t) {
  const n = K(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Es(e, t)) return !1;
  const o = Cs(e);
  return !t.actorId || !o || o === t.actorId;
}
function ky(e, t) {
  if (!Cy(e, t)) return !1;
  const n = Cs(e);
  return t.actorId && n === t.actorId ? !0 : Es(e, t);
}
function Es(e, t) {
  const n = pe(Ey(e));
  if (!n) return !1;
  const r = pe(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = pe(t.itemId);
  return !!(o && n.includes(o));
}
function Ey(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Cs(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Cy(e, t) {
  const n = Iy(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= pb;
}
function Iy(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function F(e) {
  return e && typeof e == "object" ? e : null;
}
function je(e) {
  return _e(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && J(e.resistanceTargetActorId) && J(e.resistanceTargetName) && vy(e.resistanceRollResult) && Sy(e.actionPayload) && Qt(e.title) && Qt(e.buttonLabel) && Qt(e.executedLabel) && J(e.choiceGroupId) && J(e.skippedLabel) && J(e.actionSectionId) && J(e.actionSectionTitle) && xy(e.summaryLines) : !1;
}
function Sy(e) {
  return e == null ? !0 : _e(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && Ly(e.resource) && Dy(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Ly(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Dy(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Py(e) {
  return _e(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && _e(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(je) : !1;
}
function vy(e) {
  return e == null ? !0 : _e(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && J(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Ny(e) {
  return e !== null;
}
function _e(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function S(e) {
  return e === null || typeof e == "string";
}
function Qt(e) {
  return e === void 0 || typeof e == "string";
}
function J(e) {
  return e == null || typeof e == "string";
}
function xy(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Oy(e) {
  return typeof e == "string" && e.length > 0;
}
function Is() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(F).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(F).filter((r) => r !== null) : [];
}
function xt(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function K(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function My(e) {
  return e.trim().toLowerCase();
}
function Fy(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Te(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Go = 1e3;
class By {
  constructor(t, n, r, o, i, s) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = i, this.debugOutput = s, this.ritualAssistant = new u_(
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
      settings: Er(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Er();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Mn(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && Wy(t.item) && n.executionMode === "ask") {
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
    if (await wo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Jt(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await Yt(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Yt(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = mr(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = Qy(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const i = await ct(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return i.ok ? (await bb(t), await yb(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(i), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (hb(
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
    if (await wo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Jt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      Ky(t.item)
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
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), m.info(
          "Ritual assistido concluído sem ações pendentes.",
          re(r.workflowContext)
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
      return o.ok ? (Hy(n, o.value), await Uy(o.value), {
        ok: !0,
        executedLabel: qy(o.value)
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
    const n = Zt(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && Zt(o.action) === n);
    for (const [o, i] of r)
      i.kind === "assisted-action" && i.id !== t.id && (this.pendingExecutions.delete(o), await Yt(
        o,
        Ho(i.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = en();
    await _b({
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
    let i;
    for (const s of r) {
      const l = en();
      i ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Mo({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Zt(s),
        skippedLabel: Ho(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: Yy(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      i
    ), m.info(
      "Ritual assistido preparado com ações pendentes.",
      re(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = en();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Mo({
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
    this.setAttempt(t, "completed"), m.info(
      "Automação executada por uso normal de item.",
      re(o.value.context)
    );
  }
  handleAutomationFailure(t) {
    const n = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      m.warn(n, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      m.error(n, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    m.warn(n, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    m.warn(
      `Ação assistida falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  handleDamageActionFailure(t) {
    m.warn(`Ação assistida de dano falhou: ${t.message}`, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleConditionActionFailure(t) {
    m.warn(
      `Ação assistida de condição falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const n = Date.now(), r = Wo(t);
    for (const [i, s] of this.recentExecutionKeys.entries())
      n - s > Go && this.recentExecutionKeys.delete(i);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= Go;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Wo(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = Jt(
      t,
      n,
      r,
      o
    );
  }
}
async function Uy(e) {
  const t = Vy();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: zy(e)
      });
    } catch (n) {
      m.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function qy(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function zy(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${at(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = jy(e), i = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${at(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${at(e.actorName)}</strong></p>
      <ul>
        ${t}
        ${n}
        ${r}
        ${o}
        ${i}
      </ul>
    </div>
  `;
}
function jy(e) {
  const t = Gy(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${at(o)}</li>`;
}
function Gy(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = Vo(n?.value);
  return r === null ? null : {
    value: r,
    max: Vo(n?.max)
  };
}
function Vo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Vy() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function at(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function Zt(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function Ho(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function Hy(e, t) {
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
function Wy(e) {
  return e.type === "ritual";
}
function Ky(e) {
  return Th(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Yy(e) {
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
function Qy(e) {
  const t = e.actorUuid ? Zy(e.actorUuid) : null;
  if (be(t)) return t;
  const n = e.actorId ? Xy(e.actorId) : null;
  return n || Jy(e.actorName);
}
function Zy(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Xy(e) {
  const n = game.actors?.get?.(e);
  if (be(n)) return n;
  for (const r of Ss()) {
    const o = _r(r);
    if (o?.id === e) return o;
  }
  return null;
}
function Jy(e) {
  const t = Xt(e);
  if (!t) return null;
  for (const o of Ss()) {
    const i = eA(o);
    if (Xt(i) === t) {
      const s = _r(o);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (o) => be(o) && Xt(o.name) === t
  );
  return be(r) ? r : null;
}
function Ss() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function eA(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : _r(e)?.name ?? null;
}
function _r(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (be(t)) return t;
  const n = e.document?.actor;
  return be(n) ? n : null;
}
function Xt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function be(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Jt(e, t, n, r) {
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
function Wo(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function en() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class tA {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], i = Be(t);
    for (const s of n) {
      const l = s.itemId ? i.find((f) => f.id === s.itemId) ?? null : null, u = s.match?.preset ?? null;
      if (!l || !u) {
        o.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(l, u);
      const d = await this.itemPatches.applyPresetItemPatch(l, u);
      r.push({
        itemId: l.id ?? null,
        itemName: l.name ?? "Ritual sem nome",
        presetId: u.id,
        presetLabel: u.label,
        previousStatus: s.status,
        itemPatch: d
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
class nA {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Be(t).map((l) => this.analyzeRitual(l)), r = n.filter(Je("upToDate")), o = n.filter(Je("available")), i = n.filter(Je("outdated")), s = n.filter(Je("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: o,
      outdated: i,
      unsupported: s,
      canApply: o.length > 0 || i.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = rA(t);
    return n ? r ? r.source.type !== "preset" ? Ee({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? Ee({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : Ee({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: oA(r, n.preset)
    }) : Ee({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : Ee({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Ee(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? _t(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function rA(e) {
  const t = e.getFlag(c, "automation");
  return Fn(t) ? t : null;
}
function oA(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Je(e) {
  return (t) => t.status === e;
}
class aA {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = Un(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), o = re(t);
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
    const n = A(t.actorName), r = A(t.resource), o = A(Ko(t)), i = A(sA(t));
    return `
      <section class="${c}-card ${c}-resource-card">
        <header class="${c}-card__header">
          <strong>${o}</strong>
          <span>${n}</span>
        </header>
        <div class="${c}-card__body">
          <p><strong>${i}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, n) {
    const r = A(n.title ?? "Automação"), o = n.message ? `<p>${A(n.message)}</p>` : "", i = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = A(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((g) => A(g.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map(
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(iA(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), d = t.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(lA(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), y = t.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(Ko(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), $ = t.phases.map((g) => A(g)).join(" &rarr; ");
    return `
      <section class="${c}-card ${c}-workflow-card">
        <header class="${c}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${c}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${i}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${d.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${u.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Dano:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Cura:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${$.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${$}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function iA(e) {
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
function Ko(e) {
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
function sA(e) {
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
function lA(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function A(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function cA() {
  const e = new Sf(), t = new Rp(e), n = new qa(), r = new Pf(), o = new xf(r), i = new Yf(e), s = new Zf(), l = s.registerMany(
    hl()
  );
  if (!l.ok)
    throw new Error(l.error.message);
  const u = new Qf(), d = new Wf(), f = Xg(), y = new jp(f), T = new nA(
    s
  ), $ = new tA(
    T,
    u,
    d
  ), g = new Ip(), v = new aA(g), we = new Cp(), Re = new $p(
    t,
    o,
    v,
    we
  ), ke = new Ep(Re, we), R = new By(
    ke,
    t,
    o,
    n,
    y,
    g
  );
  return R.addStrategy(
    new Vf(
      (U) => R.handleItemUsed(U)
    )
  ), {
    ordem: i,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: o,
    resources: t,
    damage: n,
    automationRegistry: s,
    automationBinder: u,
    itemPatches: d,
    conditionRegistry: f,
    conditions: y,
    debugOutput: g,
    chatMessages: v,
    workflowHooks: we,
    automation: Re,
    workflow: ke,
    itemUseIntegration: R,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: $
  };
}
const { ApplicationV2: uA } = foundry.applications.api;
class gt extends uA {
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
      apply: gt.onApply,
      cancel: gt.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${N(On)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${N(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${tn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${tn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${tn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function tn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${N(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? dA(n) : fA(t)}
    </section>
  `;
}
function dA(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(mA).join("")}</ol>`;
}
function mA(e) {
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
function fA(e) {
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
const ht = `${c}.manageRitualPresets`, Yo = `__${c}_ritualPresetHeaderControlRegistered`, pA = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function gA(e) {
  const t = globalThis;
  if (!t[Yo]) {
    for (const n of pA)
      Hooks.on(n, (r, o) => {
        hA(r, o, e);
      });
    t[Yo] = !0, m.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function hA(e, t, n) {
  Array.isArray(t) && bA(e) && (_A(e, n), !t.some((r) => r.action === ht) && t.push({
    action: ht,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Ls(e, n);
    }
  }));
}
function _A(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[ht] && (e.options.actions[ht] = (n) => {
    n.preventDefault(), n.stopPropagation(), Ls(e, t);
  }));
}
function bA(e) {
  if (!game.user?.isGM) return !1;
  const t = Ds(e);
  return t ? t.type === "agent" && Be(t).length > 0 : !1;
}
function Ls(e, t) {
  const n = Ds(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new gt(n, t).render({ force: !0 });
}
function Ds(e) {
  return Qo(e.actor) ? e.actor : Qo(e.document) ? e.document : null;
}
function Qo(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Ps = "data-paranormal-toolkit-ritual-roll-config", Ge = "data-paranormal-toolkit-ritual-roll-field", oe = "data-paranormal-toolkit-ritual-roll-action", Zo = `__${c}_ritualRollConfigBlockRegistered`, yA = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], AA = [
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
function TA() {
  const e = globalThis;
  if (!e[Zo]) {
    $A();
    for (const t of yA)
      Hooks.on(t, (...n) => {
        wA(n[0], n[1]);
      });
    e[Zo] = !0, m.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function $A() {
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
function wA(e, t) {
  const n = MA(e);
  if (!n || n.type !== "ritual") return;
  const r = UA(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  kA(o);
  const i = Ns(n), s = Wi(n), l = FA(n), u = EA(n, s, i, l);
  PA(u, n, i, l), RA(o, u), br(u);
}
function RA(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function kA(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Ps}]`)))
    t.remove();
}
function EA(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${c}-ritual-roll-config`), o.setAttribute(Ps, e.uuid ?? e.id ?? "ritual");
  const i = document.createElement("header");
  i.classList.add(`${c}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${c}-ritual-roll-config__title`), s.append(Xo("strong", "Paranormal Toolkit")), s.append(Xo("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${c}-ritual-roll-config__badge`), l.textContent = Os(t) ? "Configurada" : "Rascunho", i.append(s, l), o.append(i);
  const u = document.createElement("p");
  u.classList.add(`${c}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const d = document.createElement("div");
  d.classList.add(`${c}-ritual-roll-config__fields`), d.append(CA(t, r)), d.append(IA(t, r)), d.append(SA(t, r)), o.append(d), o.append(LA(t, n, r)), o.append(DA(r));
  const f = document.createElement("p");
  return f.classList.add(`${c}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function CA(e, t) {
  const n = Ot("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Ge, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const i = document.createElement("option");
    i.value = o, i.textContent = Ah(o), i.selected = e.intent === o, r.append(i);
  }
  return n.append(r), n;
}
function IA(e, t) {
  const n = Ot("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Ge, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const i of AA) {
    const s = document.createElement("option");
    s.value = i.value, s.textContent = i.label, s.selected = e.damageType === i.value, r.append(s);
  }
  return n.append(r), n;
}
function SA(e, t) {
  const n = Ot("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Ge, "utilityLabel"), n.append(r), n;
}
function LA(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${c}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${c}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const i = document.createElement("div");
  return i.classList.add(`${c}-ritual-roll-config__forms-grid`), i.append(nn("base", "Padrão", e.forms.base.formula, !0, n)), i.append(nn("discente", "Discente", e.forms.discente.formula, t.discente, n)), i.append(nn("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(i), r;
}
function nn(e, t, n, r, o) {
  const i = Ot(t);
  i.classList.add(`${c}-ritual-roll-config__form-card`), i.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !o || !r, s.setAttribute(Ge, `formula.${e}`), i.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", i.append(l);
  }
  return i;
}
function DA(e) {
  const t = document.createElement("div");
  t.classList.add(`${c}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(oe, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(oe, "clear"), t.append(n, r), t;
}
function Ot(e) {
  const t = document.createElement("label");
  t.classList.add(`${c}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Xo(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function PA(e, t, n, r) {
  $e(e, "intent")?.addEventListener("change", () => br(e)), ta(e, "system.studentForm")?.addEventListener("change", () => Jo(e, t)), ta(e, "system.trueForm")?.addEventListener("change", () => Jo(e, t)), e.querySelector(`[${oe}="save"]`)?.addEventListener("click", () => {
    r && vA(e, t, n);
  }), e.querySelector(`[${oe}="clear"]`)?.addEventListener("click", () => {
    r && NA(e, t);
  });
}
async function vA(e, t, n) {
  const r = e.querySelector(`[${oe}="save"]`);
  r?.setAttribute("disabled", "true"), ge(e, "Salvando configuração...");
  try {
    const o = xA(e, n);
    await bh(t, o), vs(e, o), ge(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), ge(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function NA(e, t) {
  const n = e.querySelector(`[${oe}="clear"]`);
  n?.setAttribute("disabled", "true"), ge(e, "Limpando configuração...");
  try {
    await yh(t);
    const r = Wi(t);
    OA(e, r), vs(e, r), ge(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), ge(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function vs(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__badge`);
  n && (n.textContent = Os(t) ? "Configurada" : "Rascunho");
}
function xA(e, t) {
  return {
    schemaVersion: 1,
    intent: xs($e(e, "intent")?.value),
    damageType: na(e, "damageType"),
    utilityLabel: na(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: it(e, "formula.base") },
      discente: { formula: it(e, "formula.discente") },
      verdadeiro: { formula: it(e, "formula.verdadeiro") }
    }
  };
}
function OA(e, t) {
  le(e, "intent", t.intent), le(e, "damageType", t.damageType ?? ""), le(e, "utilityLabel", t.utilityLabel ?? "Resultado"), le(e, "formula.base", t.forms.base.formula), le(e, "formula.discente", t.forms.discente.formula), le(e, "formula.verdadeiro", t.forms.verdadeiro.formula), br(e);
}
function br(e) {
  const t = xs($e(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function Jo(e, t) {
  const n = Ns(t);
  ea(e, "discente", n.discente), ea(e, "verdadeiro", n.verdadeiro);
}
function ea(e, t, n) {
  const r = $e(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${oe}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const i = r.closest(`.${c}-ritual-roll-config__field`), s = i?.querySelector("small");
  if (i) {
    if (n) {
      s?.remove();
      return;
    }
    if (!s) {
      const l = document.createElement("small");
      l.textContent = "Indisponível neste ritual.", i.append(l);
    }
  }
}
function ge(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Ns(e) {
  const t = BA(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function MA(e) {
  return ra(e.item) ? e.item : ra(e.document) ? e.document : null;
}
function FA(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function BA(e) {
  const t = e.system;
  return qA(t) ? t : {};
}
function ta(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function $e(e, t) {
  return e.querySelector(`[${Ge}="${zA(t)}"]`);
}
function it(e, t) {
  return $e(e, t)?.value.trim() ?? "";
}
function na(e, t) {
  const n = it(e, t);
  return n.length > 0 ? n : null;
}
function le(e, t, n) {
  const r = $e(e, t);
  r && (r.value = n);
}
function xs(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Os(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function UA(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function ra(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function qA(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function zA(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let te = null;
Hooks.once("init", () => {
  fl(), Ml(), _c(), hf(), m.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Sr.isSupportedSystem()) {
    m.warn(
      `Sistema não suportado: ${Sr.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  te = cA(), te.itemUseIntegration.registerStrategies(), fc(te.conditions), Ql(te), sc(), rc(), $f(), gA(te), TA(), m.info("Inicializado para o sistema Ordem Paranormal."), m.info(
    `API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${On} inicializado.`);
});
function jA() {
  if (!te)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return te;
}
export {
  jA as getToolkitServices
};
//# sourceMappingURL=main.js.map
