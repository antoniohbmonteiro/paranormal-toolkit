const u = "paranormal-toolkit", Ze = "Paranormal Toolkit", Je = "ordemparanormal";
class D {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Ee(t) {
  return {
    id: t.id,
    version: t.version,
    label: t.label,
    description: t.description,
    category: t.category,
    itemTypes: [...t.itemTypes],
    matchers: t.matchers.map((e) => ({ ...e }))
  };
}
class s {
  static info(e, ...r) {
    console.log(`${u} | ${e}`, ...r);
  }
  static warn(e, ...r) {
    console.warn(`${u} | ${e}`, ...r);
  }
  static error(e, ...r) {
    console.error(`${u} | ${e}`, ...r);
  }
}
function d(t) {
  return { ok: !0, value: t };
}
function c(t) {
  return { ok: !1, error: t };
}
function ee(t) {
  const e = t.getFlag(u, "automation");
  return e == null ? c({
    reason: "missing-automation",
    message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
  }) : ve(e) ? d(e.definition) : c({
    reason: "invalid-automation",
    message: `Automação do item ${t.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: e
  });
}
function et(t) {
  return ve(t.getFlag(u, "automation"));
}
function ve(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.schemaVersion === 1 && rt(e.source) && tt(e.definition);
}
function tt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && y(e.label) && Array.isArray(e.steps) && e.steps.every(ot);
}
function rt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.type === "preset" ? y(e.presetId) && y(e.presetVersion) && y(e.appliedAt) : e.type === "manual" ? y(e.label) && y(e.appliedAt) : !1;
}
function ot(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  switch (e.type) {
    case "spendResource":
      return at(e);
    case "spendRitualCost":
      return nt(e);
    case "rollFormula":
      return it(e);
    case "modifyResource":
      return st(e);
    case "chatCard":
      return ut(e);
    default:
      return !1;
  }
}
function at(t) {
  const e = t;
  return e.type === "spendResource" && e.actor === "self" && (e.resource === "PE" || e.resource === "PD") && Ne(e);
}
function nt(t) {
  return t.type === "spendRitualCost";
}
function it(t) {
  const e = t;
  return e.type === "rollFormula" && y(e.id) && y(e.formula) && (e.intent === void 0 || dt(e.intent)) && (e.damageType === void 0 || y(e.damageType));
}
function st(t) {
  const e = t;
  return e.type === "modifyResource" && ct(e.actor) && lt(e.resource) && mt(e.operation) && Ne(e);
}
function ut(t) {
  const e = t;
  return e.type === "chatCard" && (e.title === void 0 || typeof e.title == "string") && (e.message === void 0 || typeof e.message == "string");
}
function Ne(t) {
  return typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0 || y(t.amountFrom);
}
function ct(t) {
  return t === "self" || t === "target";
}
function lt(t) {
  return t === "PV" || t === "SAN" || t === "PE" || t === "PD";
}
function mt(t) {
  return t === "spend" || t === "damage" || t === "heal" || t === "recover";
}
function dt(t) {
  return t === "attack" || t === "damage" || t === "healing" || t === "resistance" || t === "skill" || t === "ritual" || t === "generic";
}
function y(t) {
  return typeof t == "string" && t.length > 0;
}
function te(t) {
  const e = t.items;
  if (Array.isArray(e))
    return e;
  if (e && typeof e == "object") {
    const r = e;
    if (Array.isArray(r.contents))
      return r.contents.filter(ae);
    if (gt(e))
      return Array.from(e).filter(ae);
  }
  return [];
}
function ft(t) {
  return te(t)[0] ?? null;
}
function pt(t) {
  return te(t).find(et) ?? null;
}
function gt(t) {
  return !!(t && typeof t == "object" && Symbol.iterator in t);
}
function ae(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function ht(t) {
  return te(t).filter((e) => e.type === "ritual");
}
function De(t) {
  return ht(t)[0] ?? null;
}
function yt(t) {
  return {
    listPresets() {
      const e = t.automationRegistry.list().map(Ee);
      return s.info("Presets de automação registrados.", e), e;
    },
    findPresetsForFirstRitual() {
      const e = O("Nenhum ator encontrado para buscar presets de ritual.");
      if (!e) return [];
      const r = U(e);
      if (!r) return [];
      const o = t.automationRegistry.findForItem(r).map(ne);
      return s.info(`Presets encontrados para ${r.name}.`, o), o;
    },
    async applyPresetToFirstRitual(e) {
      const r = O("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const o = U(r);
      if (!o) return;
      const a = t.automationRegistry.require(e);
      if (!a.ok) {
        s.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(o, a.value), s.info(`Preset ${a.value.id} aplicado em ${o.name}.`), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${o.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const e = O("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!e) return;
      const r = U(e);
      if (!r) return;
      const o = t.automationRegistry.findForItem(r)[0];
      if (!o) {
        s.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      await t.automationBinder.applyPreset(r, o.preset), s.info(`Melhor preset aplicado em ${r.name}.`, ne(o)), ui.notifications?.info(`Paranormal Toolkit: preset ${o.preset.label} aplicado em ${r.name}.`);
    },
    async clearAutomationFromFirstRitual() {
      const e = O("Nenhum ator encontrado para limpar automação de ritual.");
      if (!e) return;
      const r = U(e);
      r && (await t.automationBinder.clear(r), s.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
function ne(t) {
  return {
    preset: Ee(t.preset),
    score: t.score,
    reasons: [...t.reasons]
  };
}
function O(t) {
  const e = D.getSelectedActor();
  return e || (s.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function U(t) {
  const e = De(t);
  return e || (s.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function F(t) {
  return t ? {
    id: t.id,
    source: {
      ...At(t.sourceActor),
      token: t.sourceToken
    },
    item: wt(t.item),
    targets: t.targets.map(kt),
    phases: [...t.phases],
    lifecycleEvents: t.lifecycleEvents.map((e) => ({ ...e })),
    rollRequests: ie(t.rollRequests, Fe),
    rolls: ie(t.rolls, Rt),
    ritualCosts: t.ritualCosts.map((e) => ({ ...e })),
    damageInstances: t.damageInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    healingInstances: t.healingInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    resourceTransactions: t.resourceTransactions.map(re),
    flagKeys: Object.keys(t.flags)
  } : null;
}
function re(t) {
  return {
    actorId: t.actorId,
    actorName: t.actorName,
    resource: t.resource,
    operation: t.operation,
    requestedAmount: t.requestedAmount,
    appliedAmount: t.appliedAmount,
    before: {
      value: t.before.value,
      max: t.before.max
    },
    after: {
      value: t.after.value,
      max: t.after.max
    }
  };
}
function At(t) {
  return {
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown"
  };
}
function wt(t) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Item sem nome",
    itemType: t.type ?? "unknown",
    itemUuid: t.uuid ?? null
  };
}
function kt(t) {
  return {
    tokenId: t.tokenId,
    actorId: t.actorId,
    sceneId: t.sceneId,
    name: t.name,
    actorName: t.actor?.name,
    actorType: t.actor?.type
  };
}
function Fe(t) {
  return {
    id: t.id,
    formula: t.formula,
    intent: t.intent,
    damageType: t.damageType,
    sourceStepIndex: t.sourceStepIndex
  };
}
function Rt(t) {
  return {
    ...Fe(t),
    total: t.total
  };
}
function ie(t, e) {
  return Object.fromEntries(Object.entries(t).map(([r, o]) => [r, e(o)]));
}
function Pt(t) {
  return {
    getSelected() {
      return D.getSelectedActor();
    },
    logResources() {
      const e = P(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!e) return;
      const r = t.ordem.getActorSnapshot(e);
      s.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && s.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(e) {
      await $(
        t,
        "Gasto de PE",
        P("Nenhum ator encontrado para gastar PE."),
        (r) => t.resources.spend(r, "PE", e)
      );
    },
    async spendPD(e) {
      await $(
        t,
        "Gasto de PD",
        P("Nenhum ator encontrado para gastar PD."),
        (r) => t.resources.spend(r, "PD", e)
      );
    },
    async damagePV(e) {
      await $(
        t,
        "Dano em PV",
        P("Nenhum ator encontrado para causar dano em PV."),
        (r) => t.resources.damage(r, "PV", e)
      );
    },
    async healPV(e) {
      await $(
        t,
        "Cura de PV",
        P("Nenhum ator encontrado para curar PV."),
        (r) => t.resources.heal(r, "PV", e)
      );
    },
    async damageSAN(e) {
      await $(
        t,
        "Dano em SAN",
        P("Nenhum ator encontrado para causar dano em SAN."),
        (r) => t.resources.damage(r, "SAN", e)
      );
    },
    async recoverSAN(e) {
      await $(
        t,
        "Recuperação de SAN",
        P("Nenhum ator encontrado para recuperar SAN."),
        (r) => t.resources.recover(r, "SAN", e)
      );
    }
  };
}
async function $(t, e, r, o) {
  if (!r) return;
  const a = await o(r);
  if (!a.ok) {
    Tt(a.error);
    return;
  }
  const n = a.value;
  try {
    await t.chatMessages.createResourceOperationMessage({ transaction: n });
  } catch (i) {
    s.error(`${e} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  s.info(`${e} realizado:`, re(n));
}
function P(t) {
  const e = D.getSelectedActor();
  return e || (s.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Tt(t) {
  if (t.reason === "update-failed") {
    s.error(t.message, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  if (t.reason === "resource-path-not-found" || t.reason === "invalid-resource-value") {
    s.error("Falha de adapter ao ler recurso.", t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  s.warn(`Operação de recurso não realizada: ${t.message}`, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
}
const A = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function bt() {
  M(A.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), M(A.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), M(A.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), M(A.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function z() {
  return {
    enabled: _(A.enabled),
    console: _(A.console),
    ui: _(A.ui),
    chat: _(A.chat)
  };
}
async function k(t, e) {
  await game.settings.set(u, A[t], e);
}
function M(t, e) {
  game.settings.register(u, t, {
    name: e.name,
    hint: e.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: e.default
  });
}
function _(t) {
  return game.settings.get(u, t) === !0;
}
function $t() {
  return {
    status() {
      return z();
    },
    async enable() {
      await k("enabled", !0);
    },
    async disable() {
      await k("enabled", !1);
    },
    async enableConsole() {
      await k("console", !0);
    },
    async disableConsole() {
      await k("console", !1);
    },
    async enableUi() {
      await k("ui", !0);
    },
    async disableUi() {
      await k("ui", !1);
    },
    async enableChat() {
      await k("chat", !0);
    },
    async disableChat() {
      await k("chat", !1);
    }
  };
}
const Oe = "ritual.costOnly", Ue = "ritual.simpleHealing", Me = "ritual.simpleDamage", _e = "generic.simpleHealing";
function It() {
  return [
    St(),
    Ct(),
    Et(),
    vt()
  ];
}
function St() {
  return {
    id: Oe,
    version: "1.0.0",
    label: "Gasto de custo de ritual",
    description: "Calcula o custo do ritual pelo círculo e gasta o recurso configurado.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: {
      version: 1,
      label: "Gasto de custo de ritual",
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
function Ct() {
  return {
    id: Ue,
    version: "1.0.0",
    label: "Ritual de cura simples",
    description: "Gasta o custo do ritual, rola 2d8+2 de cura e recupera PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["cicatrizacao"]
      }
    ],
    automation: He()
  };
}
function Et() {
  return {
    id: Me,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Le()
  };
}
function vt() {
  return {
    id: _e,
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
function He(t = "2d8+2") {
  return Ve(
    {
      version: 1,
      label: "Ritual de cura simples",
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
          title: "Ritual de cura simples",
          message: "Gasta o custo do ritual, rola a fórmula de cura e recupera PV do alvo."
        }
      ]
    },
    "healing",
    t
  );
}
function Le(t = "1d8") {
  return Ve(
    {
      version: 1,
      label: "Ritual de dano simples",
      steps: [
        {
          type: "spendRitualCost"
        },
        {
          type: "rollFormula",
          id: "damage",
          formula: "1d8",
          intent: "damage",
          damageType: "generic"
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
          title: "Ritual de dano simples",
          message: "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo."
        }
      ]
    },
    "damage",
    t
  );
}
function Ve(t, e, r) {
  return {
    ...t,
    steps: t.steps.map((o) => o.type !== "rollFormula" || o.id !== e ? o : {
      ...o,
      formula: r
    })
  };
}
function V() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: I(e.id),
    actorId: I(e.actor?.id),
    sceneId: I(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  }));
}
function qe() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null;
  return {
    tokenId: I(t.id),
    actorId: I(e?.id),
    sceneId: I(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function I(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function Nt(t) {
  return {
    logFirstRitualCost() {
      const e = T("Nenhum ator encontrado para consultar custo de ritual.");
      if (!e) return;
      const r = b(e);
      if (!r) return;
      const o = t.ritualCosts.getCost({ actor: e, ritual: r });
      if (!o.ok) {
        s.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      s.info("Custo do primeiro ritual:", {
        actor: e.name,
        ritual: r.name,
        cost: o.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${r.name} custa ${o.value.amount} ${o.value.resource} (${o.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(e, r = "PE") {
      const o = T("Nenhum ator encontrado para configurar custo customizado.");
      if (!o) return;
      const a = b(o);
      if (a) {
        if (!Ot(e, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await a.setFlag(u, "ritual.cost", {
          resource: r,
          amount: e
        }), s.info(`Custo customizado aplicado em ${a.name}.`, { resource: r, amount: e }), ui.notifications?.info(`Paranormal Toolkit: ${a.name} agora custa ${e} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const e = T("Nenhum ator encontrado para limpar custo customizado.");
      if (!e) return;
      const r = b(e);
      r && (await r.unsetFlag(u, "ritual.cost"), s.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const e = T("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!e) return;
      const r = b(e);
      if (!r) return;
      const o = t.automationRegistry.require(Oe);
      if (!o.ok) {
        s.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(r, o.value), s.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(e = "2d8+2") {
      const r = T("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const o = b(r);
      if (!o) return;
      if (!se(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = t.automationRegistry.require(Ue);
      if (!a.ok) {
        s.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(o, a.value, {
        definition: He(e)
      }), s.info(`Preset de cura simples aplicado ao ritual: ${o.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${o.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(e = "1d8") {
      const r = T("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const o = b(r);
      if (!o) return;
      if (!se(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = t.automationRegistry.require(Me);
      if (!a.ok) {
        s.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(o, a.value, {
        definition: Le(e)
      }), s.info(`Preset de dano simples aplicado ao ritual: ${o.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${o.name}.`);
    },
    async runFirstRitualAutomation() {
      const e = T("Nenhum ator encontrado para executar automação de ritual.");
      if (!e) return;
      const r = b(e);
      r && await Dt(t, e, r);
    }
  };
}
async function Dt(t, e, r) {
  const o = ee(r);
  if (!o.ok) {
    s.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
    return;
  }
  const a = await t.workflow.runAutomation(o.value, {
    sourceActor: e,
    sourceToken: qe(),
    item: r,
    targets: V()
  });
  if (!a.ok) {
    Ft(a.error);
    return;
  }
  s.info("Automação de ritual executada com sucesso.", F(a.value.context));
}
function Ft(t) {
  const e = `Automação de ritual falhou: ${t.message}`;
  if (t.reason === "resource-operation-failed") {
    s.warn(e, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  if (t.reason === "chat-card-failed") {
    s.error(e, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  s.warn(e, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
}
function T(t) {
  const e = D.getSelectedActor();
  return e || (s.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function b(t) {
  const e = De(t);
  return e || (s.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ot(t, e) {
  return Number.isInteger(t) && t > 0 && (e === "PE" || e === "PD");
}
function se(t) {
  return typeof t == "string" && t.trim().length > 0;
}
const Ut = ["disabled", "buttons", "confirm", "automatic"], je = "buttons";
function Mt(t) {
  return typeof t == "string" && Ut.includes(t);
}
function _t(t) {
  return Mt(t) ? t : je;
}
const L = {
  executionMode: "itemUse.executionMode",
  autoRun: "itemUse.autoRun.enabled"
};
function Ht() {
  game.settings.register(u, L.executionMode, {
    name: "Modo de execução de automações ao usar item",
    hint: "Controla o que o Paranormal Toolkit faz quando um item com automação é usado pela ficha.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      disabled: "Desativado",
      buttons: "Botões no chat",
      confirm: "Confirmar antes de executar",
      automatic: "Automático"
    },
    default: je
  }), game.settings.register(u, L.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de execução de automações.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function ue() {
  const t = _t(game.settings.get(u, L.executionMode));
  return {
    executionMode: t,
    autoRun: t === "automatic"
  };
}
async function E(t) {
  await game.settings.set(u, L.executionMode, t);
}
async function ce(t) {
  await E(t ? "automatic" : "disabled");
}
function Lt(t) {
  return {
    status() {
      return t.itemUseIntegration.status();
    },
    async enable() {
      await ce(!0), ui.notifications?.info("Paranormal Toolkit: automação ao usar item em modo automático.");
    },
    async disable() {
      await ce(!1), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(e) {
      await E(e), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${e}.`);
    },
    async buttons() {
      await E("buttons"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo botões no chat.");
    },
    async confirm() {
      await E("confirm"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo confirmação.");
    },
    async automatic() {
      await E("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Vt = [
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
function qt(t) {
  return {
    phases() {
      return Vt;
    },
    lastContext() {
      return t.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const e = j("Nenhum ator encontrado para executar automação.");
      if (!e) return;
      const r = pt(e);
      if (!r) {
        s.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await le(t, e, r);
    },
    async runSelectedItemAutomation() {
      await this.runFirstAutomation();
    },
    async runItemAutomationByUuid(e) {
      if (!e || typeof e != "string") {
        ui.notifications?.warn("Paranormal Toolkit: UUID inválido.");
        return;
      }
      const r = await fromUuid(e);
      if (!Wt(r)) {
        s.warn(`UUID não resolveu para um Item: ${e}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const o = Bt(r) ?? j("Nenhum ator encontrado para executar automação do item.");
      o && await le(t, o, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const e = j("Nenhum ator encontrado para configurar automação de teste.");
      if (!e) return;
      const r = ft(e);
      if (!r) {
        s.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const o = t.automationRegistry.require(_e);
        if (!o.ok) {
          s.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
          return;
        }
        await t.automationBinder.applyPreset(r, o.value), s.info(`Preset de teste aplicado ao item: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${r.name}.`);
      } catch (o) {
        s.error("Falha ao configurar automação de teste no item.", o), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function le(t, e, r) {
  const o = ee(r);
  if (!o.ok) {
    s.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
    return;
  }
  const a = await t.workflow.runAutomation(o.value, {
    sourceActor: e,
    sourceToken: qe(),
    item: r,
    targets: V()
  });
  if (!a.ok) {
    jt(a.error);
    return;
  }
  s.info("Automação executada com sucesso.", F(a.value.context));
}
function jt(t) {
  const e = `Automação falhou: ${t.message}`;
  if (t.reason === "resource-operation-failed") {
    s.warn(e, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  if (t.reason === "chat-card-failed") {
    s.error(e, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  s.warn(e, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
}
function j(t) {
  const e = D.getSelectedActor();
  return e || (s.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Bt(t) {
  const e = t.parent;
  return e instanceof Actor ? e : null;
}
function Wt(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function Gt(t) {
  const e = Pt(t), r = yt(t), o = Nt(t), a = qt(t), n = $t(), i = Lt(t);
  return {
    actor: e,
    automation: r,
    ritual: o,
    workflow: a,
    output: n,
    itemUseIntegration: i,
    getSelectedActor() {
      return e.getSelected();
    },
    logSelectedActorResources() {
      e.logResources();
    },
    async spendSelectedActorPE(m) {
      await e.spendPE(m);
    }
  };
}
function zt(t) {
  const e = {
    services: t,
    ordem: t.ordem,
    resources: t.resources,
    ritualCosts: t.ritualCosts,
    automation: t.automation,
    automationRegistry: t.automationRegistry,
    automationBinder: t.automationBinder,
    workflow: t.workflow,
    itemUseIntegration: t.itemUseIntegration,
    debug: Gt(t)
  }, r = globalThis;
  return r[u] = e, r.ParanormalToolkit = e, e;
}
class me {
  static isSupportedSystem() {
    return game.system.id === Je;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function xt() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: S(e.id),
    actorId: S(e.actor?.id),
    sceneId: S(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome"
  }));
}
function Be() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null, r = t.name ?? e?.name ?? "Origem sem nome";
  return {
    tokenId: S(t.id),
    actorId: S(e?.id),
    sceneId: S(t.scene?.id),
    name: r
  };
}
function Kt(t, e = Be()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: e,
    targets: t
  };
}
function Yt(t) {
  if (!Zt(t)) return null;
  const e = t.getFlag(u, "workflow");
  return Xt(e) ? e : null;
}
function Qt() {
  return `flags.${u}.workflow`;
}
function de(t) {
  if (!t || typeof t != "object") return !1;
  const e = foundry.utils.getProperty(t, `flags.${u}`), r = foundry.utils.getProperty(t, `_source.flags.${u}`);
  return e !== void 0 || r !== void 0;
}
function fe(t) {
  const e = foundry.utils.getProperty(t, "speaker.actor"), r = foundry.utils.getProperty(t, "_source.speaker.actor");
  return x(e) || x(r);
}
function Xt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && e.kind === "chat-targets" && (e.source === null || typeof e.source == "object") && Array.isArray(e.targets);
}
function Zt(t) {
  return !!(t && typeof t == "object" && "getFlag" in t);
}
function S(t) {
  return x(t) ? t : null;
}
function x(t) {
  return typeof t == "string" && t.length > 0;
}
function Jt() {
  const t = (e, r) => {
    er(e, r);
  };
  Hooks.on("renderChatMessageHTML", t);
}
function er(t, e) {
  const r = Yt(t);
  if (!r || r.targets.length === 0) return;
  const o = rr(e);
  if (!o || o.querySelector(`.${u}-chat-enrichment`)) return;
  (o.querySelector(".message-content") ?? o).append(tr(r));
}
function tr(t) {
  const e = document.createElement("section");
  e.classList.add(`${u}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", e.append(r), t.source && e.append(pe("Origem", t.source.name)), e.append(pe("Alvo", t.targets.map((o) => o.name).join(", "))), e;
}
function pe(t, e) {
  const r = document.createElement("p");
  r.classList.add(`${u}-chat-enrichment__row`);
  const o = document.createElement("span");
  o.textContent = `${t}: `;
  const a = document.createElement("span");
  return a.textContent = e, r.append(o, a), r;
}
function rr(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function or() {
  Hooks.on("preCreateChatMessage", (t, e, r, o) => {
    if (!ar(o) || !nr(t) || de(t) || de(e)) return;
    const a = xt();
    if (a.length === 0 || !fe(t) && !fe(e)) return;
    const n = Be();
    t.updateSource({
      [Qt()]: Kt(a, n)
    }), s.info("Targets capturados para ChatMessage.", { source: n, targets: a });
  });
}
function ar(t) {
  const e = game.user?.id;
  return !e || typeof t != "string" ? !0 : t === e;
}
function nr(t) {
  return !!(t && typeof t == "object" && "updateSource" in t);
}
const v = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, We = {
  PV: "system.attributes.hp"
}, K = {
  PV: [v.PV, We.PV],
  SAN: [v.SAN],
  PE: [v.PE],
  PD: [v.PD]
}, Y = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class ir {
  getResource(e, r) {
    const o = ge(e, r);
    if (!o.ok)
      return c(o.error);
    const a = o.value, n = `${a}.value`, i = `${a}.max`, m = foundry.utils.getProperty(e, n), f = foundry.utils.getProperty(e, i), g = ye(e, r, n, m, "valor atual");
    if (g) return c(g);
    const h = ye(e, r, i, f, "valor máximo");
    return h ? c(h) : d({
      value: m,
      max: f
    });
  }
  async updateResourceValue(e, r, o) {
    const a = ge(e, r);
    if (!a.ok)
      throw new Error(a.error.message);
    await e.update({ [`${a.value}.value`]: o });
  }
}
function ge(t, e) {
  const r = sr(t.type, e);
  if (r && he(t, r))
    return d(r);
  const o = K[e].find(
    (a) => he(t, a)
  );
  return o ? d(o) : c({
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "resource-path-not-found",
    message: ur(t, e),
    path: K[e].join(" | ")
  });
}
function sr(t, e) {
  return t === "threat" ? We[e] ?? null : t === "agent" ? v[e] : null;
}
function he(t, e) {
  const r = foundry.utils.getProperty(t, `${e}.value`), o = foundry.utils.getProperty(t, `${e}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof o == "number" && Number.isFinite(o);
}
function ur(t, e) {
  const r = t.type ?? "unknown", o = K[e].join(", ");
  return `${e} não encontrado no ator ${t.name ?? "sem nome"} (${r}). Paths testados: ${o}.`;
}
function ye(t, e, r, o, a) {
  return o == null ? {
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "resource-path-not-found",
    message: `Path de ${a} de ${e} não encontrado: ${r}.`,
    path: r,
    value: o
  } : typeof o != "number" || !Number.isFinite(o) ? {
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${a} de ${e} em ${r}.`,
    path: r,
    value: o
  } : null;
}
class cr {
  isRitual(e) {
    return e.type === "ritual";
  }
  getCircle(e) {
    if (!this.isRitual(e))
      return c({
        reason: "not-a-ritual",
        message: `Item ${e.name ?? "sem nome"} não é um ritual.`,
        ritual: e
      });
    const r = this.readCircleFromKnownPaths(e);
    if (!r) {
      const i = Y.ritualItem.circleCandidates;
      return c({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: e,
        paths: [...i]
      });
    }
    const { path: o, value: a } = r, n = lr(a);
    return n ? d(n) : c({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${o}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: e,
      path: o,
      value: a
    });
  }
  readCircleFromKnownPaths(e) {
    for (const r of Y.ritualItem.circleCandidates) {
      const o = foundry.utils.getProperty(e, r);
      if (o != null)
        return { path: r, value: o };
    }
    return null;
  }
}
function lr(t) {
  if (Ae(t))
    return t;
  if (typeof t == "string") {
    const e = t.trim();
    if (!/^\d+$/.test(e))
      return null;
    const r = Number(e);
    if (Ae(r))
      return r;
  }
  return null;
}
function Ae(t) {
  return t === 1 || t === 2 || t === 3 || t === 4;
}
const mr = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class dr {
  constructor(e) {
    this.ritualAdapter = e;
  }
  ritualAdapter;
  getCost(e) {
    const r = this.ritualAdapter.getCircle(e.ritual);
    if (!r.ok)
      return c({
        ...r.error,
        actor: e.actor
      });
    const o = r.value, a = fr(e.ritual, o);
    return a.ok ? a.value ? d(a.value) : d({
      resource: "PE",
      amount: mr[o],
      source: "default-by-circle",
      circle: o
    }) : c(a.error);
  }
}
function fr(t, e) {
  const r = t.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : pr(r) ? {
    ok: !0,
    value: {
      resource: r.resource,
      amount: r.amount,
      source: "custom-flag",
      circle: e
    }
  } : {
    ok: !1,
    error: {
      reason: "invalid-custom-cost",
      message: `Custo customizado do ritual ${t.name ?? "sem nome"} é inválido.`,
      ritual: t,
      value: r
    }
  };
}
function pr(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return (e.resource === "PE" || e.resource === "PD") && typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0;
}
function gr(t, e) {
  const r = Ge(t);
  return {
    source: "ordem-item-roll-wrapper",
    actor: r,
    item: t,
    token: ze(r),
    targets: V(),
    originalResult: e
  };
}
function hr(t) {
  if (!kr(t.item)) return null;
  const e = Q(t.actor) ? t.actor : Ge(t.item);
  return {
    source: "ordem-item-used-hook",
    actor: e,
    item: t.item,
    token: yr(t.token) ?? ze(e),
    targets: V(),
    message: t.message
  };
}
function Ge(t) {
  const e = t;
  return Q(e.actor) ? e.actor : Q(t.parent) ? t.parent : null;
}
function ze(t) {
  const e = Ar(t) ?? wr(t);
  return e ? xe(e) : null;
}
function yr(t) {
  return X(t) ? xe(t) : null;
}
function Ar(t) {
  if (!t) return null;
  const e = t, r = e.token;
  return X(r) ? r : (e.getActiveTokens?.() ?? []).find(X) ?? null;
}
function wr(t) {
  return t ? canvas?.tokens?.controlled?.find((e) => e.actor?.id === t.id) ?? null : null;
}
function xe(t) {
  const e = t.actor ?? null;
  return {
    tokenId: B(t.id),
    actorId: B(e?.id),
    sceneId: B(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function kr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function Q(t) {
  return !!(t && typeof t == "object" && "update" in t && "items" in t);
}
function X(t) {
  return !!(t && typeof t == "object" && ("actor" in t || "id" in t || "name" in t));
}
function B(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
class Rr {
  constructor(e) {
    this.onItemUsed = e;
  }
  onItemUsed;
  id = "ordem-item-roll-wrapper";
  registered = !1;
  register() {
    const e = Pr();
    if (!e?.roll) {
      s.warn("Não foi possível registrar fallback de uso de item: CONFIG.Item.documentClass.prototype.roll não encontrado.");
      return;
    }
    if (e.__paranormalToolkitRollWrapped) {
      this.registered = !0;
      return;
    }
    const r = e.roll, o = this;
    e.__paranormalToolkitOriginalRoll = r, e.roll = async function(...n) {
      const i = await r.apply(this, n), m = gr(this, i);
      return m && await o.onItemUsed(m), i;
    }, e.__paranormalToolkitRollWrapped = !0, this.registered = !0, s.info("Fallback de uso de item registrado em OrdemItem.roll().");
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
}
function Pr() {
  return CONFIG?.Item?.documentClass?.prototype ?? null;
}
class Tr {
  constructor(e) {
    this.onItemUsed = e;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on("ordemparanormal.itemUsed", (e) => {
      this.handleHook(e);
    }), this.registered = !0, s.info("Strategy de hook ordemparanormal.itemUsed registrada."));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(e) {
    const r = hr(br(e));
    if (!r) {
      s.warn("Hook ordemparanormal.itemUsed disparou sem payload de item válido.", e);
      return;
    }
    await this.onItemUsed(r);
  }
}
function br(t) {
  return t && typeof t == "object" ? t : {};
}
class $r {
  constructor(e) {
    this.resourceAdapter = e;
  }
  resourceAdapter;
  getActorSnapshot(e) {
    const r = this.getResources(e);
    return {
      id: e.id ?? null,
      name: e.name ?? "Ator sem nome",
      type: e.type ?? "unknown",
      resources: r.values,
      resourceErrors: r.errors,
      ritualDT: this.getRitualDT(e)
    };
  }
  getRitualDT(e) {
    return this.getNumber(e, Y.ritual.dt, 0);
  }
  getResources(e) {
    const r = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, o = [];
    for (const a of ["PV", "SAN", "PE", "PD"]) {
      const n = this.resourceAdapter.getResource(e, a);
      n.ok ? r[a] = n.value : o.push(n.error);
    }
    return { values: r, errors: o };
  }
  getNumber(e, r, o) {
    const a = foundry.utils.getProperty(e, r);
    return typeof a == "number" && Number.isFinite(a) ? a : o;
  }
}
class Ir {
  async applyPreset(e, r, o = {}) {
    const a = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: r.id,
        presetVersion: r.version,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: o.definition ?? r.automation
    };
    return await this.writeAutomationFlag(e, a), a;
  }
  async applyManualDefinition(e, r, o = r.label) {
    const a = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: o,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: r
    };
    return await this.writeAutomationFlag(e, a), a;
  }
  async clear(e) {
    await e.unsetFlag(u, "automation");
  }
  async writeAutomationFlag(e, r) {
    await this.clear(e), await e.setFlag(u, "automation", r);
  }
}
class Sr {
  presets = /* @__PURE__ */ new Map();
  register(e) {
    const r = Cr(e);
    return r.ok ? this.presets.has(e.id) ? c({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${e.id}.`,
      presetId: e.id
    }) : (this.presets.set(e.id, W(e)), d(e)) : r;
  }
  registerMany(e) {
    const r = [];
    for (const o of e) {
      const a = this.register(o);
      if (!a.ok)
        return a;
      r.push(a.value);
    }
    return d(r);
  }
  get(e) {
    const r = this.presets.get(e);
    return r ? W(r) : null;
  }
  require(e) {
    const r = this.get(e);
    return r ? d(r) : c({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${e}.`,
      presetId: e
    });
  }
  list() {
    return Array.from(this.presets.values()).map(W);
  }
  findForItem(e) {
    return this.list().map((r) => Er(r, e)).filter((r) => r !== null).sort((r, o) => o.score - r.score || r.preset.id.localeCompare(o.preset.id));
  }
}
function Cr(t) {
  return !G(t.id) || !G(t.version) || !G(t.label) ? c({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: t.id
  }) : !t.automation || t.automation.version !== 1 || !Array.isArray(t.automation.steps) ? c({
    reason: "invalid-preset",
    message: `Preset ${t.id} possui definição de automação inválida.`,
    presetId: t.id
  }) : d(t);
}
function Er(t, e) {
  if (t.matchers.length === 0)
    return null;
  const r = [];
  let o = 0;
  if (t.itemTypes.length > 0) {
    if (!t.itemTypes.includes(e.type)) return null;
    o += 10, r.push(`itemType:${e.type}`);
  }
  for (const a of t.matchers) {
    const n = vr(a, e);
    if (!n.matches)
      return null;
    o += n.score, r.push(n.reason);
  }
  return {
    preset: t,
    score: o,
    reasons: r
  };
}
function vr(t, e) {
  switch (t.type) {
    case "itemType": {
      const r = t.itemTypes.includes(e.type);
      return {
        matches: r,
        score: r ? 10 : 0,
        reason: `itemType:${e.type}`
      };
    }
    case "normalizedName": {
      const r = we(e.name), o = t.names.map(we).includes(r);
      return {
        matches: o,
        score: o ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Nr(e), o = r !== null && t.circles.includes(r);
      return {
        matches: o,
        score: o ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function we(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Nr(t) {
  const e = foundry.utils.getProperty(t, "system.circle"), r = typeof e == "string" ? Number(e) : e;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function W(t) {
  return structuredClone(t);
}
function G(t) {
  return typeof t == "string" && t.length > 0;
}
function Z(t, e) {
  if (typeof t.amount == "number")
    return !Number.isInteger(t.amount) || t.amount <= 0 ? c({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : d(t.amount);
  if (typeof t.amountFrom == "string") {
    const r = q(t.amountFrom);
    if (!r)
      return c({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${t.amountFrom}. Use o formato rollId.total.`
      });
    const o = e.rolls[r];
    if (!o)
      return c({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${r}.`
      });
    const a = Math.trunc(o.total);
    return !Number.isInteger(a) || a <= 0 ? c({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${r} não gerou um amount positivo.`
    }) : d(a);
  }
  return c({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function q(t) {
  return t ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(t)?.groups?.rollId ?? null : null;
}
async function Dr(t, e, r) {
  if (!ke(t.id) || !ke(t.formula))
    return c({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const o = new Roll(t.formula), a = await Promise.resolve(o.evaluate()), n = a.total;
    if (typeof n != "number" || !Number.isFinite(n))
      return c({
        reason: "roll-failed",
        message: `A rolagem ${t.id} não retornou um total numérico válido.`
      });
    const m = {
      ...r.rollRequests[t.id] ?? Ke(t, e),
      total: n,
      roll: a
    };
    return r.rolls[t.id] = m, d(m);
  } catch (o) {
    return c({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${t.formula}.`,
      cause: o
    });
  }
}
function Ke(t, e) {
  const r = t.intent ?? Fr(t.id);
  return {
    id: t.id,
    formula: t.formula,
    intent: r,
    damageType: t.damageType,
    sourceStepIndex: e
  };
}
function Fr(t) {
  const e = t.toLowerCase();
  return e.includes("damage") || e.includes("dano") ? "damage" : e.includes("healing") || e.includes("heal") || e.includes("cura") ? "healing" : e.includes("attack") || e.includes("ataque") ? "attack" : e.includes("resistance") || e.includes("resistencia") || e.includes("resistência") ? "resistance" : "generic";
}
function ke(t) {
  return typeof t == "string" && t.length > 0;
}
async function Re(t, e, r, o, a) {
  switch (o) {
    case "spend":
      return r !== "PE" && r !== "PD" ? H(e, r, o, a) : t.spend(e, r, a);
    case "damage":
      return r !== "PV" && r !== "SAN" ? H(e, r, o, a) : t.damage(e, r, a);
    case "heal":
      return r !== "PV" ? H(e, r, o, a) : t.heal(e, r, a);
    case "recover":
      return r !== "SAN" ? H(e, r, o, a) : t.recover(e, r, a);
  }
}
function H(t, e, r, o) {
  return c({
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    resource: e,
    operation: r,
    reason: "invalid-resource-operation",
    message: `Operação ${r} não é válida para ${e}.`,
    requestedAmount: o
  });
}
function Or(t) {
  const { step: e, context: r, transaction: o, stepIndex: a, lifecycle: n } = t;
  if (e.operation === "damage") {
    const i = Ur(e, r, o, a);
    r.damageInstances.push(i), n.emit("afterDamageResolution", r, {
      stepIndex: a,
      step: e,
      damage: i,
      resourceTransaction: o,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount,
        damageType: i.damageType
      }
    }), n.emit("afterApplyDamage", r, {
      stepIndex: a,
      step: e,
      damage: i,
      resourceTransaction: o,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount,
        damageType: i.damageType
      }
    });
    return;
  }
  if (e.operation === "heal") {
    const i = Mr(e, r, o, a);
    r.healingInstances.push(i), n.emit("afterApplyHealing", r, {
      stepIndex: a,
      step: e,
      healing: i,
      resourceTransaction: o,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount
      }
    });
  }
}
function Ur(t, e, r, o) {
  const a = q(t.amountFrom), n = a ? e.rolls[a] : void 0;
  return {
    id: Ye(e.id, "damage", o, e.damageInstances.length),
    source: e.item.type === "ritual" ? "ritual" : "automation",
    sourceId: e.item.id ?? null,
    sourceName: e.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: a ?? void 0,
    damageType: n?.damageType,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", t.resource]
  };
}
function Mr(t, e, r, o) {
  const a = q(t.amountFrom);
  return {
    id: Ye(e.id, "healing", o, e.healingInstances.length),
    source: e.item.type === "ritual" ? "ritual" : "automation",
    sourceId: e.item.id ?? null,
    sourceName: e.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: a ?? void 0,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", t.resource]
  };
}
function Ye(t, e, r, o) {
  return `${t}.${e}.${r}.${o}`;
}
function _r(t, e, r) {
  const o = q(t.amountFrom), a = o ? e.rolls[o] : void 0;
  return {
    actorSelector: t.actor,
    resource: t.resource,
    operation: t.operation,
    amount: r,
    amountFrom: t.amountFrom,
    rollId: o,
    rollIntent: a?.intent,
    damageType: a?.damageType
  };
}
function Hr(t) {
  const { step: e, context: r, stepIndex: o, metadata: a, lifecycle: n } = t;
  n.emit("beforeApply", r, { stepIndex: o, step: e, metadata: a }), Qe("before", t), Pe("before", t), Pe("resolve", t);
}
function Lr(t) {
  const { step: e, context: r, stepIndex: o, metadata: a, lifecycle: n } = t;
  n.emit("apply", r, { stepIndex: o, step: e, metadata: a }), Qe("apply", t);
}
function Vr(t) {
  const { step: e, context: r, stepIndex: o, metadata: a, lifecycle: n } = t;
  n.emit("afterApply", r, { stepIndex: o, step: e, metadata: a });
}
function Qe(t, e) {
  const { step: r, context: o, stepIndex: a, metadata: n, lifecycle: i } = e, m = qr(t, r.operation);
  m && i.emit(m, o, {
    stepIndex: a,
    step: r,
    metadata: n
  });
}
function Pe(t, e) {
  const { step: r, context: o, stepIndex: a, metadata: n, lifecycle: i } = e;
  r.operation === "damage" && i.emit(t === "before" ? "beforeDamageResolution" : "damageResolution", o, {
    stepIndex: a,
    step: r,
    metadata: n
  });
}
function qr(t, e) {
  return e === "damage" ? t === "before" ? "beforeApplyDamage" : t === "apply" ? "applyDamage" : "afterApplyDamage" : e === "heal" ? t === "before" ? "beforeApplyHealing" : t === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function jr(t, e, r) {
  try {
    return await t.createWorkflowSummaryMessage(r, e), d(void 0);
  } catch (o) {
    return c({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: o
    });
  }
}
async function Br(t) {
  const { step: e } = t;
  switch (e.type) {
    case "spendResource":
      return Wr(t, e);
    case "spendRitualCost":
      return Gr(t, e);
  }
}
async function Wr(t, e) {
  const { context: r, resources: o } = t, a = Z(e, r);
  return a.ok ? Xe(await o.spend(r.sourceActor, e.resource, a.value), r) : c(a.error);
}
async function Gr(t, e) {
  const { context: r, resources: o, ritualCosts: a } = t, n = a.getCost({
    actor: r.sourceActor,
    ritual: r.item
  });
  if (!n.ok)
    return c({
      reason: "ritual-cost-failed",
      message: n.error.message,
      cause: n.error
    });
  const i = n.value;
  return r.ritualCosts.push({
    ...i,
    itemId: r.item.id ?? null,
    itemName: r.item.name ?? "Ritual sem nome"
  }), Xe(await o.spend(r.sourceActor, i.resource, i.amount), r, e);
}
function Xe(t, e, r) {
  return t.ok ? (e.resourceTransactions.push(t.value), d(void 0)) : (r?.type === "spendRitualCost" && e.ritualCosts.pop(), c({
    reason: "resource-operation-failed",
    message: t.error.message,
    cause: t.error
  }));
}
async function zr(t) {
  const { step: e, context: r, stepIndex: o, lifecycle: a, execute: n } = t, i = xr(e);
  for (const f of i.before)
    a.emit(f, r, { stepIndex: o, step: e });
  const m = await n();
  if (!m.ok)
    return m;
  for (const f of i.after)
    a.emit(f, r, { stepIndex: o, step: e });
  return m;
}
function xr(t) {
  switch (t.type) {
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
class Kr {
  constructor(e, r, o, a) {
    this.resources = e, this.ritualCosts = r, this.messages = o, this.lifecycle = a;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(e, r) {
    if (e.steps.length === 0)
      return c({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: r
      });
    for (const [o, a] of e.steps.entries()) {
      const n = await this.runStep(a, r, o);
      if (!n.ok)
        return n;
    }
    return d({ definition: e, context: r });
  }
  async runStep(e, r, o) {
    switch (e.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(e, r, o);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(e, r, o);
      default:
        return zr({
          step: e,
          context: r,
          stepIndex: o,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(e, r, o)
        });
    }
  }
  async executeStep(e, r, o) {
    switch (e.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(e, r, o);
      case "rollFormula":
        return this.runRollFormulaStep(e, r, o);
      case "modifyResource":
        return this.runModifyResourceStep(e, r, o);
      case "chatCard":
        return this.runChatCardStep(e, r, o);
      default:
        return c({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: o,
          step: e,
          context: r
        });
    }
  }
  async runCostStep(e, r, o) {
    const a = await Br({
      step: e,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? d(void 0) : c({ ...a.error, stepIndex: o, step: e, context: r });
  }
  async runRollFormulaStepWithLifecycle(e, r, o) {
    const a = Ke(e, o);
    r.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", r, { stepIndex: o, step: e, rollRequest: a }), this.emitSpecificRollPhase("before", a, r, o, e), this.lifecycle.emit("roll", r, { stepIndex: o, step: e, rollRequest: a }), this.emitSpecificRollPhase("roll", a, r, o, e);
    const n = await this.runRollFormulaStep(e, r, o);
    if (!n.ok)
      return n;
    const i = r.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, r, o, e, i), this.lifecycle.emit("afterRoll", r, { stepIndex: o, step: e, rollRequest: a, rollResult: i }), d(void 0);
  }
  async runRollFormulaStep(e, r, o) {
    const a = await Dr(e, o, r);
    return a.ok ? d(void 0) : c({ ...a.error, stepIndex: o, step: e, context: r });
  }
  async runModifyResourceStepWithLifecycle(e, r, o) {
    const a = Z(e, r);
    if (!a.ok)
      return c({ ...a.error, stepIndex: o, step: e, context: r });
    const n = _r(e, r, a.value);
    Hr({
      step: e,
      context: r,
      stepIndex: o,
      metadata: n,
      lifecycle: this.lifecycle
    }), Lr({
      step: e,
      context: r,
      stepIndex: o,
      metadata: n,
      lifecycle: this.lifecycle
    });
    const i = this.resolveActors(e.actor, r);
    if (i.length === 0)
      return c({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: o,
        step: e,
        context: r
      });
    for (const m of i) {
      const f = await Re(this.resources, m, e.resource, e.operation, a.value), g = this.handleResourceOperationResult(f, r, o, e);
      if (!g.ok)
        return g;
      Or({
        step: e,
        context: r,
        transaction: g.value,
        stepIndex: o,
        lifecycle: this.lifecycle
      });
    }
    return Vr({
      step: e,
      context: r,
      stepIndex: o,
      metadata: n,
      lifecycle: this.lifecycle
    }), d(void 0);
  }
  async runModifyResourceStep(e, r, o) {
    const a = Z(e, r);
    if (!a.ok)
      return c({ ...a.error, stepIndex: o, step: e, context: r });
    const n = this.resolveActors(e.actor, r);
    if (n.length === 0)
      return c({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: o,
        step: e,
        context: r
      });
    for (const i of n) {
      const m = await Re(this.resources, i, e.resource, e.operation, a.value), f = this.handleResourceOperationResult(m, r, o, e);
      if (!f.ok)
        return f;
    }
    return d(void 0);
  }
  async runChatCardStep(e, r, o) {
    const a = await jr(this.messages, e, r);
    return a.ok ? d(void 0) : c({ ...a.error, stepIndex: o, step: e, context: r });
  }
  handleResourceOperationResult(e, r, o, a) {
    return e.ok ? (r.resourceTransactions.push(e.value), d(e.value)) : c({
      reason: "resource-operation-failed",
      message: e.error.message,
      stepIndex: o,
      step: a,
      context: r,
      cause: e.error
    });
  }
  emitSpecificRollPhase(e, r, o, a, n, i) {
    const m = Yr(e, r.intent);
    m && this.lifecycle.emit(m, o, {
      stepIndex: a,
      step: n,
      rollRequest: r,
      rollResult: i
    });
  }
  resolveActors(e, r) {
    switch (e) {
      case "self":
        return [r.sourceActor];
      case "target":
        return r.targets.flatMap((o) => o.actor ? [o.actor] : []);
    }
  }
}
function Yr(t, e) {
  return e === "damage" ? t === "before" ? "beforeDamageRoll" : t === "roll" ? "damageRoll" : "afterDamageRoll" : e === "healing" ? t === "before" ? "beforeHealingRoll" : t === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Qr {
  constructor(e) {
    this.adapter = e;
  }
  adapter;
  async spend(e, r, o) {
    return this.execute(e, r, "spend", o);
  }
  async damage(e, r, o) {
    return this.execute(e, r, "damage", o);
  }
  async heal(e, r, o) {
    return this.execute(e, r, "heal", o);
  }
  async recover(e, r, o) {
    return this.execute(e, r, "recover", o);
  }
  async execute(e, r, o, a) {
    if (!Number.isInteger(a) || a <= 0)
      return c({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: r,
        operation: o,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: a
      });
    const n = this.adapter.getResource(e, r);
    if (!n.ok)
      return c({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: r,
        operation: o,
        reason: n.error.reason,
        message: n.error.message,
        requestedAmount: a,
        path: n.error.path,
        value: n.error.value
      });
    const i = n.value, m = this.calculate(o, i, a);
    if (!m.ok)
      return c({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: r,
        operation: o,
        reason: m.error.reason,
        message: m.error.message,
        requestedAmount: a,
        current: i.value,
        required: a
      });
    const { afterValue: f, appliedAmount: g } = m.value, h = {
      value: f,
      max: i.max
    };
    try {
      f !== i.value && await this.adapter.updateResourceValue(e, r, f);
    } catch (R) {
      return c({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: r,
        operation: o,
        reason: "update-failed",
        message: `Falha ao atualizar ${r} no ator.`,
        requestedAmount: a,
        current: i.value,
        required: a,
        cause: R
      });
    }
    return d({
      actor: e,
      actorId: e.id ?? null,
      actorName: e.name ?? "Ator sem nome",
      resource: r,
      operation: o,
      requestedAmount: a,
      appliedAmount: g,
      before: i,
      after: h
    });
  }
  calculate(e, r, o) {
    switch (e) {
      case "spend":
        return r.value < o ? c({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${r.value}; custo: ${o}.`
        }) : d({
          afterValue: r.value - o,
          appliedAmount: o
        });
      case "damage": {
        const a = Math.max(0, r.value - o);
        return d({
          afterValue: a,
          appliedAmount: r.value - a
        });
      }
      case "heal":
      case "recover": {
        const a = Math.min(r.max, r.value + o);
        return d({
          afterValue: a,
          appliedAmount: a - r.value
        });
      }
    }
  }
}
function Xr(t) {
  return {
    id: Zr(),
    sourceActor: t.sourceActor,
    sourceToken: t.sourceToken ?? null,
    item: t.item,
    targets: t.targets ?? [],
    phases: [],
    lifecycleEvents: [],
    rollRequests: {},
    rolls: {},
    ritualCosts: [],
    damageInstances: [],
    healingInstances: [],
    resourceTransactions: [],
    flags: t.flags ?? {}
  };
}
function Zr() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Jr {
  constructor(e, r) {
    this.automation = e, this.hooks = r;
  }
  automation;
  hooks;
  lastContext = null;
  getLastContext() {
    return this.lastContext;
  }
  getLastDebugSnapshot() {
    return F(this.lastContext);
  }
  async runAutomation(e, r) {
    const o = Xr(r);
    this.lastContext = o, this.hooks.emit("created", o, {
      metadata: {
        definitionLabel: e.label,
        itemId: o.item.id ?? null,
        itemName: o.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", o), this.hooks.emit("resolveTargets", o, {
      metadata: {
        targetCount: o.targets.length
      }
    });
    const a = await this.automation.run(e, o);
    return a.ok ? (this.hooks.emit("completed", o), a) : (this.emitFailed(o, a.error), a);
  }
  emitFailed(e, r) {
    this.hooks.emit("failed", e, {
      stepIndex: r.stepIndex,
      step: r.step,
      metadata: {
        reason: r.reason,
        message: r.message
      }
    });
  }
}
class eo {
  emit(e, r, o = {}) {
    const a = {
      phase: e,
      context: r,
      stepIndex: o.stepIndex,
      step: o.step,
      rollRequest: o.rollRequest,
      rollResult: o.rollResult,
      damage: o.damage,
      healing: o.healing,
      resourceTransaction: o.resourceTransaction,
      metadata: o.metadata
    };
    return r.phases.push(e), r.lifecycleEvents.push({
      phase: e,
      stepIndex: o.stepIndex,
      stepType: o.step?.type,
      rollId: o.rollRequest?.id ?? o.rollResult?.id,
      rollIntent: o.rollRequest?.intent ?? o.rollResult?.intent,
      damageId: o.damage?.id,
      healingId: o.healing?.id,
      resourceOperation: o.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${u}.workflow.${e}`, a), Hooks.callAll(`${u}.workflow.phase`, a), a;
  }
}
class to {
  info(e) {
    this.emit("info", e);
  }
  warn(e) {
    this.emit("warn", e);
  }
  error(e) {
    this.emit("error", e);
  }
  async chat(e) {
    const r = z();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: e.speaker,
      content: e.content,
      whisper: ro(),
      flags: {
        ...e.flags,
        [u]: {
          ...oo(e.flags),
          debugOutput: !0
        }
      }
    }), r.console && e.data !== void 0 && s.info("Debug chat criado.", e.data), !0);
  }
  emit(e, r) {
    const o = z();
    if (!o.enabled)
      return;
    const a = r.notification ?? Te(r);
    o.console && this.emitConsole(e, r), o.ui && this.emitUi(e, a);
  }
  emitConsole(e, r) {
    const o = Te(r);
    switch (e) {
      case "info":
        s.info(o, r.data ?? "");
        return;
      case "warn":
        s.warn(o, r.data ?? "");
        return;
      case "error":
        s.error(o, r.data ?? "");
        return;
    }
  }
  emitUi(e, r) {
    switch (e) {
      case "info":
        ui.notifications?.info(`Paranormal Toolkit: ${r}`);
        return;
      case "warn":
        ui.notifications?.warn(`Paranormal Toolkit: ${r}`);
        return;
      case "error":
        ui.notifications?.error(`Paranormal Toolkit: ${r}`);
        return;
    }
  }
}
function Te(t) {
  return t.message ? `${t.title}: ${t.message}` : t.title;
}
function ro() {
  const t = game.users?.filter((e) => e.isGM === !0 && e.id).map((e) => e.id) ?? [];
  return t.length > 0 ? t : game.user?.id ? [game.user.id] : [];
}
function oo(t) {
  const e = t?.[u];
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const oe = "data-paranormal-toolkit-pending-id", ao = `[${oe}]`;
let be = !1;
function no(t) {
  be || (Hooks.on("renderChatMessageHTML", (e, r) => {
    so(r, t);
  }), be = !0);
}
async function io(t) {
  const e = t.context.actor ? ChatMessage.getSpeaker({ actor: t.context.actor }) : void 0;
  await ChatMessage.create({
    speaker: e,
    content: co(t),
    flags: {
      [u]: {
        itemUseAutomationPrompt: {
          pendingId: t.pendingId,
          itemId: t.context.item.id ?? null,
          itemName: t.context.item.name ?? "Item sem nome",
          source: t.context.source,
          mode: t.mode
        }
      }
    }
  });
}
function so(t, e) {
  const r = lo(t);
  if (!r) return;
  const o = r.querySelectorAll(ao);
  for (const a of o)
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      uo(a, e);
    }));
}
async function uo(t, e) {
  const r = t.getAttribute(oe);
  if (!r) return;
  t.disabled = !0;
  const o = t.textContent;
  if (t.textContent = "Executando...", await e(r)) {
    t.textContent = "Executado";
    return;
  }
  t.disabled = !1, t.textContent = o;
}
function co(t) {
  const e = J(t.context.item.name ?? "Item sem nome"), r = t.context.targets.length > 0 ? J(t.context.targets.map((o) => o.name).join(", ")) : "Nenhum alvo selecionado";
  return `
<section class="${u}-item-use-prompt">
  <strong>Paranormal Toolkit</strong>
  <p>Automação disponível para <strong>${e}</strong>.</p>
  <p><span>Alvos:</span> ${r}</p>
  <button type="button" ${oe}="${mo(t.pendingId)}">
    Executar automação
  </button>
</section>
`.trim();
}
function lo(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function J(t) {
  const e = document.createElement("span");
  return e.textContent = t, e.innerHTML;
}
function mo(t) {
  return J(t).replaceAll('"', "&quot;");
}
async function fo(t) {
  const e = t.item.name ?? "Item sem nome", r = "Executar automação?", o = `<p>Executar a automação do Paranormal Toolkit para <strong>${go(e)}</strong>?</p>`, a = await po(r, o);
  if (a !== null)
    return a;
  const n = globalThis.confirm;
  return typeof n == "function" ? n(`Executar a automação do Paranormal Toolkit para ${e}?`) : !1;
}
async function po(t, e) {
  const o = globalThis.foundry?.applications?.api?.DialogV2;
  return typeof o?.confirm != "function" ? null : !!await o.confirm({
    window: { title: t },
    content: e,
    modal: !0,
    yes: { label: "Executar" },
    no: { label: "Cancelar" }
  });
}
function go(t) {
  const e = document.createElement("span");
  return e.textContent = t, e.innerHTML;
}
const $e = 1e3;
class ho {
  constructor(e, r) {
    this.workflow = e, this.debugOutput = r;
  }
  workflow;
  debugOutput;
  strategies = [];
  recentExecutionKeys = /* @__PURE__ */ new Map();
  pendingExecutions = /* @__PURE__ */ new Map();
  lastAttempt = null;
  promptRendererRegistered = !1;
  addStrategy(e) {
    this.strategies.push(e);
  }
  registerStrategies() {
    for (const e of this.strategies)
      e.register();
    this.registerPromptRenderer();
  }
  status() {
    return {
      settings: ue(),
      strategies: this.strategies.map((e) => e.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(e) {
    const r = ue();
    if (r.executionMode === "disabled") {
      this.setAttempt(e, "skipped", "execution-mode-disabled");
      return;
    }
    const o = ee(e.item);
    if (!o.ok) {
      const a = o.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(e, a, o.error.reason), o.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: o.error.message,
        data: o.error
      });
      return;
    }
    if (!e.actor) {
      this.setAttempt(e, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${e.item.name}.`,
        data: Ie(e, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(e)) {
      this.setAttempt(e, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(e), r.executionMode) {
      case "buttons":
        await this.createPendingPrompt(e, o.value);
        return;
      case "confirm":
        await this.handleConfirmedExecution(e, o.value);
        return;
      case "automatic":
        await this.executeAutomation(e, o.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(e) {
    const r = this.pendingExecutions.get(e);
    return r ? (this.pendingExecutions.delete(e), await this.executeAutomation(r.context, r.definition, r.mode), !0) : (ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (no((e) => this.executePendingAutomation(e)), this.promptRendererRegistered = !0);
  }
  async createPendingPrompt(e, r) {
    const o = yo();
    this.pendingExecutions.set(o, {
      id: o,
      definition: r,
      context: e,
      mode: "buttons",
      createdAt: Date.now()
    });
    try {
      await io({
        pendingId: o,
        context: e,
        mode: "buttons"
      }), this.setAttempt(e, "pending", "execution-mode-buttons", o);
    } catch (a) {
      this.pendingExecutions.delete(o), this.setAttempt(e, "failed", "prompt-message-failed", o), s.error("Falha ao criar prompt de automação no chat.", a), ui.notifications?.error("Paranormal Toolkit: falha ao criar prompt de automação no chat.");
    }
  }
  async handleConfirmedExecution(e, r) {
    if (!await fo(e)) {
      this.setAttempt(e, "skipped", "confirmation-cancelled");
      return;
    }
    await this.executeAutomation(e, r, "confirm");
  }
  async executeAutomation(e, r, o) {
    this.setAttempt(e, "running");
    const a = await this.workflow.runAutomation(r, {
      sourceActor: e.actor,
      sourceToken: e.token,
      item: e.item,
      targets: e.targets,
      flags: {
        itemUse: {
          source: e.source,
          executionMode: o
        }
      }
    });
    if (!a.ok) {
      this.setAttempt(e, "failed", a.error.reason), this.handleAutomationFailure(a.error);
      return;
    }
    this.setAttempt(e, "completed"), s.info("Automação executada por uso normal de item.", F(a.value.context));
  }
  handleAutomationFailure(e) {
    const r = `Automação por uso de item falhou: ${e.message}`;
    if (e.reason === "resource-operation-failed") {
      s.warn(r, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
      return;
    }
    if (e.reason === "chat-card-failed") {
      s.error(r, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
      return;
    }
    s.warn(r, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
  }
  isDuplicate(e) {
    const r = Date.now(), o = Se(e);
    for (const [n, i] of this.recentExecutionKeys.entries())
      r - i > $e && this.recentExecutionKeys.delete(n);
    const a = this.recentExecutionKeys.get(o);
    return a !== void 0 && r - a <= $e;
  }
  markExecution(e) {
    this.recentExecutionKeys.set(Se(e), Date.now());
  }
  setAttempt(e, r, o, a) {
    this.lastAttempt = Ie(e, r, o, a);
  }
}
function Ie(t, e, r, o) {
  return {
    source: t.source,
    status: e,
    reason: r,
    pendingId: o,
    itemId: t.item.id ?? null,
    itemName: t.item.name ?? "Item sem nome",
    itemType: t.item.type ?? "unknown",
    itemUuid: t.item.uuid ?? null,
    actorId: t.actor?.id ?? null,
    actorName: t.actor?.name ?? null,
    targetCount: t.targets.length,
    timestamp: Date.now()
  };
}
function Se(t) {
  const e = t.actor?.id ?? "no-actor", r = t.item.uuid ?? t.item.id ?? t.item.name ?? "unknown-item";
  return `${e}:${r}`;
}
function yo() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ao {
  constructor(e) {
    this.debugOutput = e;
  }
  debugOutput;
  async createResourceOperationMessage(e) {
    const r = this.createResourceOperationContent(e.transaction), o = re(e.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: e.transaction.actor }),
      content: r,
      data: o,
      flags: {
        [u]: {
          resourceTransaction: o
        }
      }
    });
  }
  async createWorkflowSummaryMessage(e, r) {
    const o = this.createWorkflowSummaryContent(e, r), a = F(e);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: e.sourceActor }),
      content: o,
      data: a,
      flags: {
        [u]: {
          workflowSummary: a
        }
      }
    });
  }
  createResourceOperationContent(e) {
    const r = p(e.actorName), o = p(e.resource), a = p(Ce(e)), n = p(ko(e));
    return `
      <section class="${u}-card ${u}-resource-card">
        <header class="${u}-card__header">
          <strong>${a}</strong>
          <span>${r}</span>
        </header>
        <div class="${u}-card__body">
          <p><strong>${n}:</strong> ${e.appliedAmount}</p>
          <p><strong>${o}:</strong> ${e.before.value}/${e.before.max} &rarr; ${e.after.value}/${e.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(e, r) {
    const o = p(r.title ?? "Automação"), a = r.message ? `<p>${p(r.message)}</p>` : "", n = p(e.sourceToken?.name ?? e.sourceActor.name ?? "Origem sem nome"), i = p(e.item.name ?? "Item sem nome"), m = e.targets.length > 0 ? e.targets.map((l) => p(l.name)).join(", ") : "Nenhum", f = Object.values(e.rolls).map(
      (l) => `<li><strong>${p(l.id)}:</strong> ${p(l.formula)} = ${l.total} <em>(${p(wo(l.intent))})</em>${l.damageType ? ` — ${p(l.damageType)}` : ""}</li>`
    ), g = e.ritualCosts.map(
      (l) => `<li><strong>${p(l.itemName)}:</strong> ${l.circle}º círculo — ${l.amount} ${p(l.resource)} (${p(Ro(l.source))})</li>`
    ), h = e.damageInstances.map(
      (l) => `<li><strong>${p(l.targetActorName)}:</strong> bruto ${l.rawAmount}${l.damageType ? ` ${p(l.damageType)}` : ""} &rarr; final ${l.finalAmount} &rarr; aplicado ${l.appliedAmount}</li>`
    ), R = e.healingInstances.map(
      (l) => `<li><strong>${p(l.targetActorName)}:</strong> bruto ${l.rawAmount} &rarr; final ${l.finalAmount} &rarr; aplicado ${l.appliedAmount}</li>`
    ), C = e.resourceTransactions.map(
      (l) => `<li><strong>${p(l.actorName)}:</strong> ${p(Ce(l))} — ${l.before.value}/${l.before.max} &rarr; ${l.after.value}/${l.after.max}</li>`
    ), w = e.phases.map((l) => p(l)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${o}</strong>
          <span>${i}</span>
        </header>
        <div class="${u}-card__body">
          ${a}
          <p><strong>Origem:</strong> ${n}</p>
          <p><strong>Alvo:</strong> ${m}</p>
          ${g.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${g.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${h.length > 0 ? `<p><strong>Dano:</strong></p><ul>${h.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Cura:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${C.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${C.join("")}</ul>` : ""}
          ${w.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${w}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function wo(t) {
  switch (t) {
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
function Ce(t) {
  switch (t.operation) {
    case "spend":
      return `Gasto de ${t.resource}`;
    case "damage":
      return `Dano em ${t.resource}`;
    case "heal":
      return `Cura de ${t.resource}`;
    case "recover":
      return `Recuperação de ${t.resource}`;
  }
}
function ko(t) {
  switch (t.operation) {
    case "spend":
      return `${t.resource} gasto`;
    case "damage":
      return "Dano aplicado";
    case "heal":
      return "Cura aplicada";
    case "recover":
      return "Recuperação aplicada";
  }
}
function Ro(t) {
  switch (t) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return t;
  }
}
function p(t) {
  return t.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function Po() {
  const t = new ir(), e = new Qr(t), r = new cr(), o = new dr(r), a = new $r(t), n = new Sr(), i = n.registerMany(It());
  if (!i.ok)
    throw new Error(i.error.message);
  const m = new Ir(), f = new to(), g = new Ao(f), h = new eo(), R = new Kr(e, o, g, h), C = new Jr(R, h), w = new ho(C, f);
  return w.addStrategy(new Tr((l) => w.handleItemUsed(l))), w.addStrategy(new Rr((l) => w.handleItemUsed(l))), {
    ordem: a,
    resourceAdapter: t,
    ritualAdapter: r,
    ritualCosts: o,
    resources: e,
    automationRegistry: n,
    automationBinder: m,
    debugOutput: f,
    chatMessages: g,
    workflowHooks: h,
    automation: R,
    workflow: C,
    itemUseIntegration: w
  };
}
let N = null;
Hooks.once("init", () => {
  bt(), Ht(), s.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!me.isSupportedSystem()) {
    s.warn(
      `Sistema não suportado: ${me.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  N = Po(), N.itemUseIntegration.registerStrategies(), zt(N), or(), Jt(), s.info("Inicializado para o sistema Ordem Paranormal."), s.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Ze} inicializado.`);
});
function To() {
  if (!N)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return N;
}
export {
  To as getToolkitServices
};
//# sourceMappingURL=main.js.map
