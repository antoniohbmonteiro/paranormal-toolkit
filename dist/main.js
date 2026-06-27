const c = "paranormal-toolkit", ht = "Paranormal Toolkit", yt = "ordemparanormal";
class M {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Ge(t) {
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
class i {
  static info(e, ...r) {
    console.log(`${c} | ${e}`, ...r);
  }
  static warn(e, ...r) {
    console.warn(`${c} | ${e}`, ...r);
  }
  static error(e, ...r) {
    console.error(`${c} | ${e}`, ...r);
  }
}
function f(t) {
  return { ok: !0, value: t };
}
function l(t) {
  return { ok: !1, error: t };
}
function ue(t) {
  const e = t.getFlag(c, "automation");
  return e == null ? l({
    reason: "missing-automation",
    message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
  }) : ze(e) ? f(e.definition) : l({
    reason: "invalid-automation",
    message: `Automação do item ${t.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: e
  });
}
function At(t) {
  return ze(t.getFlag(c, "automation"));
}
function ze(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.schemaVersion === 1 && kt(e.source) && wt(e.definition);
}
function wt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && y(e.label) && Array.isArray(e.steps) && e.steps.every(Rt);
}
function kt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.type === "preset" ? y(e.presetId) && y(e.presetVersion) && y(e.appliedAt) : e.type === "manual" ? y(e.label) && y(e.appliedAt) : !1;
}
function Rt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  switch (e.type) {
    case "spendResource":
      return Pt(e);
    case "spendRitualCost":
      return $t(e);
    case "rollFormula":
      return Tt(e);
    case "modifyResource":
      return bt(e);
    case "chatCard":
      return Ct(e);
    default:
      return !1;
  }
}
function Pt(t) {
  const e = t;
  return e.type === "spendResource" && e.actor === "self" && (e.resource === "PE" || e.resource === "PD") && Ke(e);
}
function $t(t) {
  return t.type === "spendRitualCost";
}
function Tt(t) {
  const e = t;
  return e.type === "rollFormula" && y(e.id) && y(e.formula) && (e.intent === void 0 || Et(e.intent)) && (e.damageType === void 0 || y(e.damageType));
}
function bt(t) {
  const e = t;
  return e.type === "modifyResource" && St(e.actor) && It(e.resource) && vt(e.operation) && Ke(e);
}
function Ct(t) {
  const e = t;
  return e.type === "chatCard" && (e.title === void 0 || typeof e.title == "string") && (e.message === void 0 || typeof e.message == "string");
}
function Ke(t) {
  return typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0 || y(t.amountFrom);
}
function St(t) {
  return t === "self" || t === "target";
}
function It(t) {
  return t === "PV" || t === "SAN" || t === "PE" || t === "PD";
}
function vt(t) {
  return t === "spend" || t === "damage" || t === "heal" || t === "recover";
}
function Et(t) {
  return t === "attack" || t === "damage" || t === "healing" || t === "resistance" || t === "skill" || t === "ritual" || t === "generic";
}
function y(t) {
  return typeof t == "string" && t.length > 0;
}
function ce(t) {
  const e = t.items;
  if (Array.isArray(e))
    return e;
  if (e && typeof e == "object") {
    const r = e;
    if (Array.isArray(r.contents))
      return r.contents.filter(fe);
    if (Ft(e))
      return Array.from(e).filter(fe);
  }
  return [];
}
function Dt(t) {
  return ce(t)[0] ?? null;
}
function Nt(t) {
  return ce(t).find(At) ?? null;
}
function Ft(t) {
  return !!(t && typeof t == "object" && Symbol.iterator in t);
}
function fe(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function Ot(t) {
  return ce(t).filter((e) => e.type === "ritual");
}
function xe(t) {
  return Ot(t)[0] ?? null;
}
function _t(t) {
  return {
    listPresets() {
      const e = t.automationRegistry.list().map(Ge);
      return i.info("Presets de automação registrados.", e), e;
    },
    findPresetsForFirstRitual() {
      const e = L("Nenhum ator encontrado para buscar presets de ritual.");
      if (!e) return [];
      const r = U(e);
      if (!r) return [];
      const a = t.automationRegistry.findForItem(r).map(pe);
      return i.info(`Presets encontrados para ${r.name}.`, a), a;
    },
    async applyPresetToFirstRitual(e) {
      const r = L("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const a = U(r);
      if (!a) return;
      const o = t.automationRegistry.require(e);
      if (!o.ok) {
        i.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(a, o.value), i.info(`Preset ${o.value.id} aplicado em ${a.name}.`), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const e = L("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!e) return;
      const r = U(e);
      if (!r) return;
      const a = t.automationRegistry.findForItem(r)[0];
      if (!a) {
        i.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      await t.automationBinder.applyPreset(r, a.preset), i.info(`Melhor preset aplicado em ${r.name}.`, pe(a)), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${r.name}.`);
    },
    async clearAutomationFromFirstRitual() {
      const e = L("Nenhum ator encontrado para limpar automação de ritual.");
      if (!e) return;
      const r = U(e);
      r && (await t.automationBinder.clear(r), i.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
function pe(t) {
  return {
    preset: Ge(t.preset),
    score: t.score,
    reasons: [...t.reasons]
  };
}
function L(t) {
  const e = M.getSelectedActor();
  return e || (i.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function U(t) {
  const e = xe(t);
  return e || (i.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function C(t) {
  return t ? {
    id: t.id,
    source: {
      ...Mt(t.sourceActor),
      token: t.sourceToken
    },
    item: Lt(t.item),
    targets: t.targets.map(Ut),
    phases: [...t.phases],
    lifecycleEvents: t.lifecycleEvents.map((e) => ({ ...e })),
    rollRequests: ge(t.rollRequests, Ye),
    rolls: ge(t.rolls, Ht),
    ritualCosts: t.ritualCosts.map((e) => ({ ...e })),
    damageInstances: t.damageInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    healingInstances: t.healingInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    resourceTransactions: t.resourceTransactions.map(le),
    flagKeys: Object.keys(t.flags)
  } : null;
}
function le(t) {
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
function Mt(t) {
  return {
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown"
  };
}
function Lt(t) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Item sem nome",
    itemType: t.type ?? "unknown",
    itemUuid: t.uuid ?? null
  };
}
function Ut(t) {
  return {
    tokenId: t.tokenId,
    actorId: t.actorId,
    sceneId: t.sceneId,
    name: t.name,
    actorName: t.actor?.name,
    actorType: t.actor?.type
  };
}
function Ye(t) {
  return {
    id: t.id,
    formula: t.formula,
    intent: t.intent,
    damageType: t.damageType,
    sourceStepIndex: t.sourceStepIndex
  };
}
function Ht(t) {
  return {
    ...Ye(t),
    total: t.total
  };
}
function ge(t, e) {
  return Object.fromEntries(Object.entries(t).map(([r, a]) => [r, e(a)]));
}
function qt(t) {
  return {
    getSelected() {
      return M.getSelectedActor();
    },
    logResources() {
      const e = P(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!e) return;
      const r = t.ordem.getActorSnapshot(e);
      i.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && i.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(e) {
      await I(
        t,
        "Gasto de PE",
        P("Nenhum ator encontrado para gastar PE."),
        (r) => t.resources.spend(r, "PE", e)
      );
    },
    async spendPD(e) {
      await I(
        t,
        "Gasto de PD",
        P("Nenhum ator encontrado para gastar PD."),
        (r) => t.resources.spend(r, "PD", e)
      );
    },
    async damagePV(e) {
      await I(
        t,
        "Dano em PV",
        P("Nenhum ator encontrado para causar dano em PV."),
        (r) => t.resources.damage(r, "PV", e)
      );
    },
    async healPV(e) {
      await I(
        t,
        "Cura de PV",
        P("Nenhum ator encontrado para curar PV."),
        (r) => t.resources.heal(r, "PV", e)
      );
    },
    async damageSAN(e) {
      await I(
        t,
        "Dano em SAN",
        P("Nenhum ator encontrado para causar dano em SAN."),
        (r) => t.resources.damage(r, "SAN", e)
      );
    },
    async recoverSAN(e) {
      await I(
        t,
        "Recuperação de SAN",
        P("Nenhum ator encontrado para recuperar SAN."),
        (r) => t.resources.recover(r, "SAN", e)
      );
    }
  };
}
async function I(t, e, r, a) {
  if (!r) return;
  const o = await a(r);
  if (!o.ok) {
    Vt(o.error);
    return;
  }
  const n = o.value;
  try {
    await t.chatMessages.createResourceOperationMessage({ transaction: n });
  } catch (s) {
    i.error(`${e} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  i.info(`${e} realizado:`, le(n));
}
function P(t) {
  const e = M.getSelectedActor();
  return e || (i.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Vt(t) {
  if (t.reason === "update-failed") {
    i.error(t.message, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  if (t.reason === "resource-path-not-found" || t.reason === "invalid-resource-value") {
    i.error("Falha de adapter ao ler recurso.", t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  i.warn(`Operação de recurso não realizada: ${t.message}`, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
}
const A = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function jt() {
  H(A.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), H(A.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), H(A.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), H(A.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Q() {
  return {
    enabled: q(A.enabled),
    console: q(A.console),
    ui: q(A.ui),
    chat: q(A.chat)
  };
}
async function w(t, e) {
  await game.settings.set(c, A[t], e);
}
function H(t, e) {
  game.settings.register(c, t, {
    name: e.name,
    hint: e.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: e.default
  });
}
function q(t) {
  return game.settings.get(c, t) === !0;
}
function Bt() {
  return {
    status() {
      return Q();
    },
    async enable() {
      await w("enabled", !0);
    },
    async disable() {
      await w("enabled", !1);
    },
    async enableConsole() {
      await w("console", !0);
    },
    async disableConsole() {
      await w("console", !1);
    },
    async enableUi() {
      await w("ui", !0);
    },
    async disableUi() {
      await w("ui", !1);
    },
    async enableChat() {
      await w("chat", !0);
    },
    async disableChat() {
      await w("chat", !1);
    }
  };
}
const Xe = "ritual.costOnly", Qe = "ritual.simpleHealing", Ze = "ritual.simpleDamage", Je = "generic.simpleHealing";
function Wt() {
  return [
    Gt(),
    zt(),
    Kt(),
    xt()
  ];
}
function Gt() {
  return {
    id: Xe,
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
function zt() {
  return {
    id: Qe,
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
    automation: et()
  };
}
function Kt() {
  return {
    id: Ze,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: tt()
  };
}
function xt() {
  return {
    id: Je,
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
function et(t = "2d8+2") {
  return rt(
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
function tt(t = "1d8") {
  return rt(
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
function rt(t, e, r) {
  return {
    ...t,
    steps: t.steps.map((a) => a.type !== "rollFormula" || a.id !== e ? a : {
      ...a,
      formula: r
    })
  };
}
function me() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: v(e.id),
    actorId: v(e.actor?.id),
    sceneId: v(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  }));
}
function at() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null;
  return {
    tokenId: v(t.id),
    actorId: v(e?.id),
    sceneId: v(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function v(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function Yt(t) {
  return {
    logFirstRitualCost() {
      const e = $("Nenhum ator encontrado para consultar custo de ritual.");
      if (!e) return;
      const r = T(e);
      if (!r) return;
      const a = t.ritualCosts.getCost({ actor: e, ritual: r });
      if (!a.ok) {
        i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      i.info("Custo do primeiro ritual:", {
        actor: e.name,
        ritual: r.name,
        cost: a.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${r.name} custa ${a.value.amount} ${a.value.resource} (${a.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(e, r = "PE") {
      const a = $("Nenhum ator encontrado para configurar custo customizado.");
      if (!a) return;
      const o = T(a);
      if (o) {
        if (!Zt(e, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(c, "ritual.cost", {
          resource: r,
          amount: e
        }), i.info(`Custo customizado aplicado em ${o.name}.`, { resource: r, amount: e }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${e} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const e = $("Nenhum ator encontrado para limpar custo customizado.");
      if (!e) return;
      const r = T(e);
      r && (await r.unsetFlag(c, "ritual.cost"), i.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const e = $("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!e) return;
      const r = T(e);
      if (!r) return;
      const a = t.automationRegistry.require(Xe);
      if (!a.ok) {
        i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(r, a.value), i.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(e = "2d8+2") {
      const r = $("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const a = T(r);
      if (!a) return;
      if (!he(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = t.automationRegistry.require(Qe);
      if (!o.ok) {
        i.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(a, o.value, {
        definition: et(e)
      }), i.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(e = "1d8") {
      const r = $("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const a = T(r);
      if (!a) return;
      if (!he(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = t.automationRegistry.require(Ze);
      if (!o.ok) {
        i.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(a, o.value, {
        definition: tt(e)
      }), i.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const e = $("Nenhum ator encontrado para executar automação de ritual.");
      if (!e) return;
      const r = T(e);
      r && await Xt(t, e, r);
    }
  };
}
async function Xt(t, e, r) {
  const a = ue(r);
  if (!a.ok) {
    i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(a.value, {
    sourceActor: e,
    sourceToken: at(),
    item: r,
    targets: me()
  });
  if (!o.ok) {
    Qt(o.error);
    return;
  }
  i.info("Automação de ritual executada com sucesso.", C(o.value.context));
}
function Qt(t) {
  const e = `Automação de ritual falhou: ${t.message}`;
  if (t.reason === "resource-operation-failed") {
    i.warn(e, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  if (t.reason === "chat-card-failed") {
    i.error(e, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  i.warn(e, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
}
function $(t) {
  const e = M.getSelectedActor();
  return e || (i.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function T(t) {
  const e = xe(t);
  return e || (i.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Zt(t, e) {
  return Number.isInteger(t) && t > 0 && (e === "PE" || e === "PD");
}
function he(t) {
  return typeof t == "string" && t.trim().length > 0;
}
const Jt = ["disabled", "ask", "automatic"], er = ["buttons", "confirm"], ot = "ask";
function tr(t) {
  return typeof t == "string" && Jt.includes(t);
}
function rr(t) {
  return typeof t == "string" && er.includes(t);
}
function ar(t) {
  return tr(t) ? t : rr(t) ? "ask" : ot;
}
const j = {
  executionMode: "itemUse.executionMode",
  autoRun: "itemUse.autoRun.enabled"
};
function or() {
  game.settings.register(c, j.executionMode, {
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
    default: ot
  }), game.settings.register(c, j.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function ye() {
  return {
    executionMode: ar(game.settings.get(c, j.executionMode))
  };
}
async function b(t) {
  await game.settings.set(c, j.executionMode, t);
}
function nr(t) {
  return {
    status() {
      return t.itemUseIntegration.status();
    },
    async enable() {
      await b("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await b("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(e) {
      await b(e), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${e}.`);
    },
    async ask() {
      await b("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await b("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await b("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await b("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const sr = [
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
function ir(t) {
  return {
    phases() {
      return sr;
    },
    lastContext() {
      return t.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const e = G("Nenhum ator encontrado para executar automação.");
      if (!e) return;
      const r = Nt(e);
      if (!r) {
        i.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Ae(t, e, r);
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
      if (!lr(r)) {
        i.warn(`UUID não resolveu para um Item: ${e}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = cr(r) ?? G("Nenhum ator encontrado para executar automação do item.");
      a && await Ae(t, a, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const e = G("Nenhum ator encontrado para configurar automação de teste.");
      if (!e) return;
      const r = Dt(e);
      if (!r) {
        i.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = t.automationRegistry.require(Je);
        if (!a.ok) {
          i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
          return;
        }
        await t.automationBinder.applyPreset(r, a.value), i.info(`Preset de teste aplicado ao item: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${r.name}.`);
      } catch (a) {
        i.error("Falha ao configurar automação de teste no item.", a), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function Ae(t, e, r) {
  const a = ue(r);
  if (!a.ok) {
    i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(a.value, {
    sourceActor: e,
    sourceToken: at(),
    item: r,
    targets: me()
  });
  if (!o.ok) {
    ur(o.error);
    return;
  }
  i.info("Automação executada com sucesso.", C(o.value.context));
}
function ur(t) {
  const e = `Automação falhou: ${t.message}`;
  if (t.reason === "resource-operation-failed") {
    i.warn(e, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  if (t.reason === "chat-card-failed") {
    i.error(e, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  i.warn(e, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
}
function G(t) {
  const e = M.getSelectedActor();
  return e || (i.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function cr(t) {
  const e = t.parent;
  return e instanceof Actor ? e : null;
}
function lr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function mr(t) {
  const e = qt(t), r = _t(t), a = Yt(t), o = ir(t), n = Bt(), s = nr(t);
  return {
    actor: e,
    automation: r,
    ritual: a,
    workflow: o,
    output: n,
    itemUseIntegration: s,
    getSelectedActor() {
      return e.getSelected();
    },
    logSelectedActorResources() {
      e.logResources();
    },
    async spendSelectedActorPE(u) {
      await e.spendPE(u);
    }
  };
}
function dr(t) {
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
    debug: mr(t)
  }, r = globalThis;
  return r[c] = e, r.ParanormalToolkit = e, e;
}
class we {
  static isSupportedSystem() {
    return game.system.id === yt;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function fr() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: E(e.id),
    actorId: E(e.actor?.id),
    sceneId: E(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome"
  }));
}
function nt() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null, r = t.name ?? e?.name ?? "Origem sem nome";
  return {
    tokenId: E(t.id),
    actorId: E(e?.id),
    sceneId: E(t.scene?.id),
    name: r
  };
}
function pr(t, e = nt()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: e,
    targets: t
  };
}
function gr(t) {
  if (!Ar(t)) return null;
  const e = t.getFlag(c, "workflow");
  return yr(e) ? e : null;
}
function hr() {
  return `flags.${c}.workflow`;
}
function ke(t) {
  if (!t || typeof t != "object") return !1;
  const e = foundry.utils.getProperty(t, `flags.${c}`), r = foundry.utils.getProperty(t, `_source.flags.${c}`);
  return e !== void 0 || r !== void 0;
}
function Re(t) {
  const e = foundry.utils.getProperty(t, "speaker.actor"), r = foundry.utils.getProperty(t, "_source.speaker.actor");
  return Z(e) || Z(r);
}
function yr(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && e.kind === "chat-targets" && (e.source === null || typeof e.source == "object") && Array.isArray(e.targets);
}
function Ar(t) {
  return !!(t && typeof t == "object" && "getFlag" in t);
}
function E(t) {
  return Z(t) ? t : null;
}
function Z(t) {
  return typeof t == "string" && t.length > 0;
}
function wr() {
  const t = (e, r) => {
    kr(e, r);
  };
  Hooks.on("renderChatMessageHTML", t);
}
function kr(t, e) {
  const r = gr(t);
  if (!r || r.targets.length === 0) return;
  const a = Pr(e);
  if (!a || a.querySelector(`.${c}-chat-enrichment`)) return;
  (a.querySelector(".message-content") ?? a).append(Rr(r));
}
function Rr(t) {
  const e = document.createElement("section");
  e.classList.add(`${c}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", e.append(r), t.source && e.append(Pe("Origem", t.source.name)), e.append(Pe("Alvo", t.targets.map((a) => a.name).join(", "))), e;
}
function Pe(t, e) {
  const r = document.createElement("p");
  r.classList.add(`${c}-chat-enrichment__row`);
  const a = document.createElement("span");
  a.textContent = `${t}: `;
  const o = document.createElement("span");
  return o.textContent = e, r.append(a, o), r;
}
function Pr(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function $r() {
  Hooks.on("preCreateChatMessage", (t, e, r, a) => {
    if (!Tr(a) || !br(t) || ke(t) || ke(e)) return;
    const o = fr();
    if (o.length === 0 || !Re(t) && !Re(e)) return;
    const n = nt();
    t.updateSource({
      [hr()]: pr(o, n)
    }), i.info("Targets capturados para ChatMessage.", { source: n, targets: o });
  });
}
function Tr(t) {
  const e = game.user?.id;
  return !e || typeof t != "string" ? !0 : t === e;
}
function br(t) {
  return !!(t && typeof t == "object" && "updateSource" in t);
}
const F = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, st = {
  PV: "system.attributes.hp"
}, J = {
  PV: [F.PV, st.PV],
  SAN: [F.SAN],
  PE: [F.PE],
  PD: [F.PD]
}, ee = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Cr {
  getResource(e, r) {
    const a = $e(e, r);
    if (!a.ok)
      return l(a.error);
    const o = a.value, n = `${o}.value`, s = `${o}.max`, u = foundry.utils.getProperty(e, n), d = foundry.utils.getProperty(e, s), g = be(e, r, n, u, "valor atual");
    if (g) return l(g);
    const h = be(e, r, s, d, "valor máximo");
    return h ? l(h) : f({
      value: u,
      max: d
    });
  }
  async updateResourceValue(e, r, a) {
    const o = $e(e, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await e.update({ [`${o.value}.value`]: a });
  }
}
function $e(t, e) {
  const r = Sr(t.type, e);
  if (r && Te(t, r))
    return f(r);
  const a = J[e].find(
    (o) => Te(t, o)
  );
  return a ? f(a) : l({
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "resource-path-not-found",
    message: Ir(t, e),
    path: J[e].join(" | ")
  });
}
function Sr(t, e) {
  return t === "threat" ? st[e] ?? null : t === "agent" ? F[e] : null;
}
function Te(t, e) {
  const r = foundry.utils.getProperty(t, `${e}.value`), a = foundry.utils.getProperty(t, `${e}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof a == "number" && Number.isFinite(a);
}
function Ir(t, e) {
  const r = t.type ?? "unknown", a = J[e].join(", ");
  return `${e} não encontrado no ator ${t.name ?? "sem nome"} (${r}). Paths testados: ${a}.`;
}
function be(t, e, r, a, o) {
  return a == null ? {
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "resource-path-not-found",
    message: `Path de ${o} de ${e} não encontrado: ${r}.`,
    path: r,
    value: a
  } : typeof a != "number" || !Number.isFinite(a) ? {
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${o} de ${e} em ${r}.`,
    path: r,
    value: a
  } : null;
}
class vr {
  isRitual(e) {
    return e.type === "ritual";
  }
  getCircle(e) {
    if (!this.isRitual(e))
      return l({
        reason: "not-a-ritual",
        message: `Item ${e.name ?? "sem nome"} não é um ritual.`,
        ritual: e
      });
    const r = this.readCircleFromKnownPaths(e);
    if (!r) {
      const s = ee.ritualItem.circleCandidates;
      return l({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: e,
        paths: [...s]
      });
    }
    const { path: a, value: o } = r, n = Er(o);
    return n ? f(n) : l({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: e,
      path: a,
      value: o
    });
  }
  readCircleFromKnownPaths(e) {
    for (const r of ee.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(e, r);
      if (a != null)
        return { path: r, value: a };
    }
    return null;
  }
}
function Er(t) {
  if (Ce(t))
    return t;
  if (typeof t == "string") {
    const e = t.trim();
    if (!/^\d+$/.test(e))
      return null;
    const r = Number(e);
    if (Ce(r))
      return r;
  }
  return null;
}
function Ce(t) {
  return t === 1 || t === 2 || t === 3 || t === 4;
}
const Dr = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Nr {
  constructor(e) {
    this.ritualAdapter = e;
  }
  ritualAdapter;
  getCost(e) {
    const r = this.ritualAdapter.getCircle(e.ritual);
    if (!r.ok)
      return l({
        ...r.error,
        actor: e.actor
      });
    const a = r.value, o = Fr(e.ritual, a);
    return o.ok ? o.value ? f(o.value) : f({
      resource: "PE",
      amount: Dr[a],
      source: "default-by-circle",
      circle: a
    }) : l(o.error);
  }
}
function Fr(t, e) {
  const r = t.getFlag(c, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Or(r) ? {
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
function Or(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return (e.resource === "PE" || e.resource === "PD") && typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0;
}
const z = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function _r(t) {
  if (!Vr(t.item)) return null;
  const e = te(t.actor) ? t.actor : Mr(t.item);
  return {
    source: "ordem-item-used-hook",
    actor: e,
    item: t.item,
    token: Ur(t.token) ?? Lr(e),
    targets: me(),
    message: t.message,
    chatMessageData: t.chatMessageData
  };
}
function Mr(t) {
  const e = t;
  return te(e.actor) ? e.actor : te(t.parent) ? t.parent : null;
}
function Lr(t) {
  const e = Hr(t) ?? qr(t);
  return e ? it(e) : null;
}
function Ur(t) {
  return re(t) ? it(t) : null;
}
function Hr(t) {
  if (!t) return null;
  const e = t, r = e.token;
  return re(r) ? r : (e.getActiveTokens?.() ?? []).find(re) ?? null;
}
function qr(t) {
  return t ? canvas?.tokens?.controlled?.find((e) => e.actor?.id === t.id) ?? null : null;
}
function it(t) {
  const e = t.actor ?? null;
  return {
    tokenId: K(t.id),
    actorId: K(e?.id),
    sceneId: K(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function Vr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function te(t) {
  return !!(t && typeof t == "object" && "update" in t && "items" in t);
}
function re(t) {
  return !!(t && typeof t == "object" && ("actor" in t || "id" in t || "name" in t));
}
function K(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
class jr {
  constructor(e) {
    this.onItemUsed = e;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(z.ITEM_USED, (e) => {
      this.handleHook(e);
    }), this.registered = !0, i.info(`${z.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(e) {
    const r = _r(Br(e));
    if (!r) {
      i.warn(`${z.ITEM_USED} disparou sem payload de item válido.`, e);
      return;
    }
    await this.onItemUsed(r);
  }
}
function Br(t) {
  return t && typeof t == "object" ? t : {};
}
class Wr {
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
    return this.getNumber(e, ee.ritual.dt, 0);
  }
  getResources(e) {
    const r = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, a = [];
    for (const o of ["PV", "SAN", "PE", "PD"]) {
      const n = this.resourceAdapter.getResource(e, o);
      n.ok ? r[o] = n.value : a.push(n.error);
    }
    return { values: r, errors: a };
  }
  getNumber(e, r, a) {
    const o = foundry.utils.getProperty(e, r);
    return typeof o == "number" && Number.isFinite(o) ? o : a;
  }
}
class Gr {
  async applyPreset(e, r, a = {}) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: r.id,
        presetVersion: r.version,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: a.definition ?? r.automation
    };
    return await this.writeAutomationFlag(e, o), o;
  }
  async applyManualDefinition(e, r, a = r.label) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: a,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: r
    };
    return await this.writeAutomationFlag(e, o), o;
  }
  async clear(e) {
    await e.unsetFlag(c, "automation");
  }
  async writeAutomationFlag(e, r) {
    await this.clear(e), await e.setFlag(c, "automation", r);
  }
}
class zr {
  presets = /* @__PURE__ */ new Map();
  register(e) {
    const r = Kr(e);
    return r.ok ? this.presets.has(e.id) ? l({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${e.id}.`,
      presetId: e.id
    }) : (this.presets.set(e.id, x(e)), f(e)) : r;
  }
  registerMany(e) {
    const r = [];
    for (const a of e) {
      const o = this.register(a);
      if (!o.ok)
        return o;
      r.push(o.value);
    }
    return f(r);
  }
  get(e) {
    const r = this.presets.get(e);
    return r ? x(r) : null;
  }
  require(e) {
    const r = this.get(e);
    return r ? f(r) : l({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${e}.`,
      presetId: e
    });
  }
  list() {
    return Array.from(this.presets.values()).map(x);
  }
  findForItem(e) {
    return this.list().map((r) => xr(r, e)).filter((r) => r !== null).sort((r, a) => a.score - r.score || r.preset.id.localeCompare(a.preset.id));
  }
}
function Kr(t) {
  return !Y(t.id) || !Y(t.version) || !Y(t.label) ? l({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: t.id
  }) : !t.automation || t.automation.version !== 1 || !Array.isArray(t.automation.steps) ? l({
    reason: "invalid-preset",
    message: `Preset ${t.id} possui definição de automação inválida.`,
    presetId: t.id
  }) : f(t);
}
function xr(t, e) {
  if (t.matchers.length === 0)
    return null;
  const r = [];
  let a = 0;
  if (t.itemTypes.length > 0) {
    if (!t.itemTypes.includes(e.type)) return null;
    a += 10, r.push(`itemType:${e.type}`);
  }
  for (const o of t.matchers) {
    const n = Yr(o, e);
    if (!n.matches)
      return null;
    a += n.score, r.push(n.reason);
  }
  return {
    preset: t,
    score: a,
    reasons: r
  };
}
function Yr(t, e) {
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
      const r = Se(e.name), a = t.names.map(Se).includes(r);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Xr(e), a = r !== null && t.circles.includes(r);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function Se(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Xr(t) {
  const e = foundry.utils.getProperty(t, "system.circle"), r = typeof e == "string" ? Number(e) : e;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function x(t) {
  return structuredClone(t);
}
function Y(t) {
  return typeof t == "string" && t.length > 0;
}
function B(t, e) {
  if (typeof t.amount == "number")
    return !Number.isInteger(t.amount) || t.amount <= 0 ? l({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : f(t.amount);
  if (typeof t.amountFrom == "string") {
    const r = W(t.amountFrom);
    if (!r)
      return l({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${t.amountFrom}. Use o formato rollId.total.`
      });
    const a = e.rolls[r];
    if (!a)
      return l({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${r}.`
      });
    const o = Math.trunc(a.total);
    return !Number.isInteger(o) || o <= 0 ? l({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${r} não gerou um amount positivo.`
    }) : f(o);
  }
  return l({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function W(t) {
  return t ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(t)?.groups?.rollId ?? null : null;
}
async function Qr(t, e, r) {
  if (!Ie(t.id) || !Ie(t.formula))
    return l({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const a = new Roll(t.formula), o = await Promise.resolve(a.evaluate()), n = o.total;
    if (typeof n != "number" || !Number.isFinite(n))
      return l({
        reason: "roll-failed",
        message: `A rolagem ${t.id} não retornou um total numérico válido.`
      });
    const u = {
      ...r.rollRequests[t.id] ?? ut(t, e),
      total: n,
      roll: o
    };
    return r.rolls[t.id] = u, f(u);
  } catch (a) {
    return l({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${t.formula}.`,
      cause: a
    });
  }
}
function ut(t, e) {
  const r = t.intent ?? Zr(t.id);
  return {
    id: t.id,
    formula: t.formula,
    intent: r,
    damageType: t.damageType,
    sourceStepIndex: e
  };
}
function Zr(t) {
  const e = t.toLowerCase();
  return e.includes("damage") || e.includes("dano") ? "damage" : e.includes("healing") || e.includes("heal") || e.includes("cura") ? "healing" : e.includes("attack") || e.includes("ataque") ? "attack" : e.includes("resistance") || e.includes("resistencia") || e.includes("resistência") ? "resistance" : "generic";
}
function Ie(t) {
  return typeof t == "string" && t.length > 0;
}
async function ae(t, e, r, a, o) {
  switch (a) {
    case "spend":
      return r !== "PE" && r !== "PD" ? V(e, r, a, o) : t.spend(e, r, o);
    case "damage":
      return r !== "PV" && r !== "SAN" ? V(e, r, a, o) : t.damage(e, r, o);
    case "heal":
      return r !== "PV" ? V(e, r, a, o) : t.heal(e, r, o);
    case "recover":
      return r !== "SAN" ? V(e, r, a, o) : t.recover(e, r, o);
  }
}
function V(t, e, r, a) {
  return l({
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    resource: e,
    operation: r,
    reason: "invalid-resource-operation",
    message: `Operação ${r} não é válida para ${e}.`,
    requestedAmount: a
  });
}
function Jr(t) {
  const { step: e, context: r, transaction: a, stepIndex: o, lifecycle: n } = t;
  if (e.operation === "damage") {
    const s = ea(e, r, a, o);
    r.damageInstances.push(s), n.emit("afterDamageResolution", r, {
      stepIndex: o,
      step: e,
      damage: s,
      resourceTransaction: a,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), n.emit("afterApplyDamage", r, {
      stepIndex: o,
      step: e,
      damage: s,
      resourceTransaction: a,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    });
    return;
  }
  if (e.operation === "heal") {
    const s = ta(e, r, a, o);
    r.healingInstances.push(s), n.emit("afterApplyHealing", r, {
      stepIndex: o,
      step: e,
      healing: s,
      resourceTransaction: a,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount
      }
    });
  }
}
function ea(t, e, r, a) {
  const o = W(t.amountFrom), n = o ? e.rolls[o] : void 0;
  return {
    id: ct(e.id, "damage", a, e.damageInstances.length),
    source: e.item.type === "ritual" ? "ritual" : "automation",
    sourceId: e.item.id ?? null,
    sourceName: e.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: o ?? void 0,
    damageType: n?.damageType,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", t.resource]
  };
}
function ta(t, e, r, a) {
  const o = W(t.amountFrom);
  return {
    id: ct(e.id, "healing", a, e.healingInstances.length),
    source: e.item.type === "ritual" ? "ritual" : "automation",
    sourceId: e.item.id ?? null,
    sourceName: e.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: o ?? void 0,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", t.resource]
  };
}
function ct(t, e, r, a) {
  return `${t}.${e}.${r}.${a}`;
}
function ra(t, e, r) {
  const a = W(t.amountFrom), o = a ? e.rolls[a] : void 0;
  return {
    actorSelector: t.actor,
    resource: t.resource,
    operation: t.operation,
    amount: r,
    amountFrom: t.amountFrom,
    rollId: a,
    rollIntent: o?.intent,
    damageType: o?.damageType
  };
}
function aa(t) {
  const { step: e, context: r, stepIndex: a, metadata: o, lifecycle: n } = t;
  n.emit("beforeApply", r, { stepIndex: a, step: e, metadata: o }), lt("before", t), ve("before", t), ve("resolve", t);
}
function oa(t) {
  const { step: e, context: r, stepIndex: a, metadata: o, lifecycle: n } = t;
  n.emit("apply", r, { stepIndex: a, step: e, metadata: o }), lt("apply", t);
}
function na(t) {
  const { step: e, context: r, stepIndex: a, metadata: o, lifecycle: n } = t;
  n.emit("afterApply", r, { stepIndex: a, step: e, metadata: o });
}
function lt(t, e) {
  const { step: r, context: a, stepIndex: o, metadata: n, lifecycle: s } = e, u = sa(t, r.operation);
  u && s.emit(u, a, {
    stepIndex: o,
    step: r,
    metadata: n
  });
}
function ve(t, e) {
  const { step: r, context: a, stepIndex: o, metadata: n, lifecycle: s } = e;
  r.operation === "damage" && s.emit(t === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: o,
    step: r,
    metadata: n
  });
}
function sa(t, e) {
  return e === "damage" ? t === "before" ? "beforeApplyDamage" : t === "apply" ? "applyDamage" : "afterApplyDamage" : e === "heal" ? t === "before" ? "beforeApplyHealing" : t === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function ia(t, e, r) {
  try {
    return await t.createWorkflowSummaryMessage(r, e), f(void 0);
  } catch (a) {
    return l({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: a
    });
  }
}
async function ua(t) {
  const { step: e } = t;
  switch (e.type) {
    case "spendResource":
      return ca(t, e);
    case "spendRitualCost":
      return la(t, e);
  }
}
async function ca(t, e) {
  const { context: r, resources: a } = t, o = B(e, r);
  return o.ok ? mt(await a.spend(r.sourceActor, e.resource, o.value), r) : l(o.error);
}
async function la(t, e) {
  const { context: r, resources: a, ritualCosts: o } = t, n = o.getCost({
    actor: r.sourceActor,
    ritual: r.item
  });
  if (!n.ok)
    return l({
      reason: "ritual-cost-failed",
      message: n.error.message,
      cause: n.error
    });
  const s = n.value;
  return r.ritualCosts.push({
    ...s,
    itemId: r.item.id ?? null,
    itemName: r.item.name ?? "Ritual sem nome"
  }), mt(await a.spend(r.sourceActor, s.resource, s.amount), r, e);
}
function mt(t, e, r) {
  return t.ok ? (e.resourceTransactions.push(t.value), f(void 0)) : (r?.type === "spendRitualCost" && e.ritualCosts.pop(), l({
    reason: "resource-operation-failed",
    message: t.error.message,
    cause: t.error
  }));
}
async function ma(t) {
  const { step: e, context: r, stepIndex: a, lifecycle: o, execute: n } = t, s = da(e);
  for (const d of s.before)
    o.emit(d, r, { stepIndex: a, step: e });
  const u = await n();
  if (!u.ok)
    return u;
  for (const d of s.after)
    o.emit(d, r, { stepIndex: a, step: e });
  return u;
}
function da(t) {
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
class fa {
  constructor(e, r, a, o) {
    this.resources = e, this.ritualCosts = r, this.messages = a, this.lifecycle = o;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(e, r) {
    if (e.steps.length === 0)
      return l({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: r
      });
    for (const [a, o] of e.steps.entries()) {
      const n = await this.runStep(o, r, a);
      if (!n.ok)
        return n;
    }
    return f({ definition: e, context: r });
  }
  async runStep(e, r, a) {
    switch (e.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(e, r, a);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(e, r, a);
      default:
        return ma({
          step: e,
          context: r,
          stepIndex: a,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(e, r, a)
        });
    }
  }
  async executeStep(e, r, a) {
    switch (e.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(e, r, a);
      case "rollFormula":
        return this.runRollFormulaStep(e, r, a);
      case "modifyResource":
        return this.runModifyResourceStep(e, r, a);
      case "chatCard":
        return this.runChatCardStep(e, r, a);
      default:
        return l({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: a,
          step: e,
          context: r
        });
    }
  }
  async runCostStep(e, r, a) {
    const o = await ua({
      step: e,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? f(void 0) : l({ ...o.error, stepIndex: a, step: e, context: r });
  }
  async runRollFormulaStepWithLifecycle(e, r, a) {
    const o = ut(e, a);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: a, step: e, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, a, e), this.lifecycle.emit("roll", r, { stepIndex: a, step: e, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, a, e);
    const n = await this.runRollFormulaStep(e, r, a);
    if (!n.ok)
      return n;
    const s = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, a, e, s), this.lifecycle.emit("afterRoll", r, { stepIndex: a, step: e, rollRequest: o, rollResult: s }), f(void 0);
  }
  async runRollFormulaStep(e, r, a) {
    const o = await Qr(e, a, r);
    return o.ok ? f(void 0) : l({ ...o.error, stepIndex: a, step: e, context: r });
  }
  async runModifyResourceStepWithLifecycle(e, r, a) {
    const o = B(e, r);
    if (!o.ok)
      return l({ ...o.error, stepIndex: a, step: e, context: r });
    const n = ra(e, r, o.value);
    aa({
      step: e,
      context: r,
      stepIndex: a,
      metadata: n,
      lifecycle: this.lifecycle
    }), oa({
      step: e,
      context: r,
      stepIndex: a,
      metadata: n,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(e.actor, r);
    if (s.length === 0)
      return l({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: e,
        context: r
      });
    for (const u of s) {
      const d = await ae(this.resources, u, e.resource, e.operation, o.value), g = this.handleResourceOperationResult(d, r, a, e);
      if (!g.ok)
        return g;
      Jr({
        step: e,
        context: r,
        transaction: g.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return na({
      step: e,
      context: r,
      stepIndex: a,
      metadata: n,
      lifecycle: this.lifecycle
    }), f(void 0);
  }
  async runModifyResourceStep(e, r, a) {
    const o = B(e, r);
    if (!o.ok)
      return l({ ...o.error, stepIndex: a, step: e, context: r });
    const n = this.resolveActors(e.actor, r);
    if (n.length === 0)
      return l({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: e,
        context: r
      });
    for (const s of n) {
      const u = await ae(this.resources, s, e.resource, e.operation, o.value), d = this.handleResourceOperationResult(u, r, a, e);
      if (!d.ok)
        return d;
    }
    return f(void 0);
  }
  async runChatCardStep(e, r, a) {
    const o = await ia(this.messages, e, r);
    return o.ok ? f(void 0) : l({ ...o.error, stepIndex: a, step: e, context: r });
  }
  handleResourceOperationResult(e, r, a, o) {
    return e.ok ? (r.resourceTransactions.push(e.value), f(e.value)) : l({
      reason: "resource-operation-failed",
      message: e.error.message,
      stepIndex: a,
      step: o,
      context: r,
      cause: e.error
    });
  }
  emitSpecificRollPhase(e, r, a, o, n, s) {
    const u = pa(e, r.intent);
    u && this.lifecycle.emit(u, a, {
      stepIndex: o,
      step: n,
      rollRequest: r,
      rollResult: s
    });
  }
  resolveActors(e, r) {
    switch (e) {
      case "self":
        return [r.sourceActor];
      case "target":
        return r.targets.flatMap((a) => a.actor ? [a.actor] : []);
    }
  }
}
function pa(t, e) {
  return e === "damage" ? t === "before" ? "beforeDamageRoll" : t === "roll" ? "damageRoll" : "afterDamageRoll" : e === "healing" ? t === "before" ? "beforeHealingRoll" : t === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class ga {
  constructor(e) {
    this.adapter = e;
  }
  adapter;
  async spend(e, r, a) {
    return this.execute(e, r, "spend", a);
  }
  async damage(e, r, a) {
    return this.execute(e, r, "damage", a);
  }
  async heal(e, r, a) {
    return this.execute(e, r, "heal", a);
  }
  async recover(e, r, a) {
    return this.execute(e, r, "recover", a);
  }
  async execute(e, r, a, o) {
    if (!Number.isInteger(o) || o <= 0)
      return l({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: o
      });
    const n = this.adapter.getResource(e, r);
    if (!n.ok)
      return l({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: n.error.reason,
        message: n.error.message,
        requestedAmount: o,
        path: n.error.path,
        value: n.error.value
      });
    const s = n.value, u = this.calculate(a, s, o);
    if (!u.ok)
      return l({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: u.error.reason,
        message: u.error.message,
        requestedAmount: o,
        current: s.value,
        required: o
      });
    const { afterValue: d, appliedAmount: g } = u.value, h = {
      value: d,
      max: s.max
    };
    try {
      d !== s.value && await this.adapter.updateResourceValue(e, r, d);
    } catch (R) {
      return l({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: "update-failed",
        message: `Falha ao atualizar ${r} no ator.`,
        requestedAmount: o,
        current: s.value,
        required: o,
        cause: R
      });
    }
    return f({
      actor: e,
      actorId: e.id ?? null,
      actorName: e.name ?? "Ator sem nome",
      resource: r,
      operation: a,
      requestedAmount: o,
      appliedAmount: g,
      before: s,
      after: h
    });
  }
  calculate(e, r, a) {
    switch (e) {
      case "spend":
        return r.value < a ? l({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${r.value}; custo: ${a}.`
        }) : f({
          afterValue: r.value - a,
          appliedAmount: a
        });
      case "damage": {
        const o = Math.max(0, r.value - a);
        return f({
          afterValue: o,
          appliedAmount: r.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(r.max, r.value + a);
        return f({
          afterValue: o,
          appliedAmount: o - r.value
        });
      }
    }
  }
}
function ha(t) {
  return {
    id: ya(),
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
function ya() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Aa {
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
    return C(this.lastContext);
  }
  async runAutomation(e, r) {
    const a = ha(r);
    this.lastContext = a, this.hooks.emit("created", a, {
      metadata: {
        definitionLabel: e.label,
        itemId: a.item.id ?? null,
        itemName: a.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", a), this.hooks.emit("resolveTargets", a, {
      metadata: {
        targetCount: a.targets.length
      }
    });
    const o = await this.automation.run(e, a);
    return o.ok ? (this.hooks.emit("completed", a), o) : (this.emitFailed(a, o.error), o);
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
class wa {
  emit(e, r, a = {}) {
    const o = {
      phase: e,
      context: r,
      stepIndex: a.stepIndex,
      step: a.step,
      rollRequest: a.rollRequest,
      rollResult: a.rollResult,
      damage: a.damage,
      healing: a.healing,
      resourceTransaction: a.resourceTransaction,
      metadata: a.metadata
    };
    return r.phases.push(e), r.lifecycleEvents.push({
      phase: e,
      stepIndex: a.stepIndex,
      stepType: a.step?.type,
      rollId: a.rollRequest?.id ?? a.rollResult?.id,
      rollIntent: a.rollRequest?.intent ?? a.rollResult?.intent,
      damageId: a.damage?.id,
      healingId: a.healing?.id,
      resourceOperation: a.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${c}.workflow.${e}`, o), Hooks.callAll(`${c}.workflow.phase`, o), o;
  }
}
class ka {
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
    const r = Q();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: e.speaker,
      content: e.content,
      whisper: Ra(),
      flags: {
        ...e.flags,
        [c]: {
          ...Pa(e.flags),
          debugOutput: !0
        }
      }
    }), r.console && e.data !== void 0 && i.info("Debug chat criado.", e.data), !0);
  }
  emit(e, r) {
    const a = Q();
    if (!a.enabled)
      return;
    const o = r.notification ?? Ee(r);
    a.console && this.emitConsole(e, r), a.ui && this.emitUi(e, o);
  }
  emitConsole(e, r) {
    const a = Ee(r);
    switch (e) {
      case "info":
        i.info(a, r.data ?? "");
        return;
      case "warn":
        i.warn(a, r.data ?? "");
        return;
      case "error":
        i.error(a, r.data ?? "");
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
function Ee(t) {
  return t.message ? `${t.title}: ${t.message}` : t.title;
}
function Ra() {
  const t = game.users?.filter((e) => e.isGM === !0 && e.id).map((e) => e.id) ?? [];
  return t.length > 0 ? t : game.user?.id ? [game.user.id] : [];
}
function Pa(t) {
  const e = t?.[c];
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const $a = ["base", "discente", "verdadeiro"];
function Ta(t) {
  switch (t) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function ba(t) {
  return typeof t == "string" && $a.includes(t);
}
async function Ca(t) {
  const e = Da();
  return e ? new Promise((r) => {
    let a = !1;
    const o = (n) => {
      a || (a = !0, r(n));
    };
    new e({
      title: `Conjurar ${t.ritual.name ?? "ritual"}`,
      content: Sa(t),
      default: "cast",
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: () => o(null)
        },
        cast: {
          icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
          label: "Conjurar",
          callback: (n) => o(Ia(n, t.defaultSpendResource))
        }
      },
      close: () => o(null)
    }).render(!0);
  }) : (ui.notifications?.warn("Paranormal Toolkit: Dialog não disponível. Usando opções padrão do ritual."), {
    variant: "base",
    spendResource: t.defaultSpendResource
  });
}
function Sa(t) {
  const e = t.targetNames.length > 0 ? t.targetNames.join(", ") : "Nenhum alvo selecionado", r = t.cost ? `${t.cost.amount} ${t.cost.resource}` : "não resolvido";
  return `
    <form class="paranormal-toolkit-ritual-cast-dialog">
      <p class="paranormal-toolkit-ritual-cast-dialog__hint">
        Configure a conjuração antes do Toolkit gastar recurso, rolar dados ou preparar ações no chat.
      </p>

      <fieldset class="paranormal-toolkit-ritual-cast-dialog__fieldset">
        <legend>Forma</legend>
        <label><input type="radio" name="variant" value="base" checked> Padrão</label>
        <label><input type="radio" name="variant" value="discente"> Discente</label>
        <label><input type="radio" name="variant" value="verdadeiro"> Verdadeiro</label>
      </fieldset>

      <label class="paranormal-toolkit-ritual-cast-dialog__checkbox">
        <input type="checkbox" name="spendResource" ${t.defaultSpendResource ? "checked" : ""}>
        Gastar PE/PD automaticamente
      </label>

      <dl class="paranormal-toolkit-ritual-cast-dialog__summary">
        <div><dt>Custo previsto</dt><dd>${X(r)}</dd></div>
        <div><dt>Conjurador</dt><dd>${X(t.actor.name ?? "Ator sem nome")}</dd></div>
        <div><dt>Alvos</dt><dd>${X(e)}</dd></div>
      </dl>
    </form>
  `;
}
function Ia(t, e) {
  const r = Ea(t), a = va(r), o = r?.querySelector('input[name="spendResource"]')?.checked ?? e;
  return {
    variant: a,
    spendResource: o
  };
}
function va(t) {
  const e = t?.querySelector('input[name="variant"]:checked')?.value;
  return ba(e) ? e : "base";
}
function Ea(t) {
  if (t instanceof HTMLElement) return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function Da() {
  return globalThis.Dialog ?? null;
}
function X(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
class Na {
  constructor(e, r, a) {
    this.workflow = e, this.resources = r, this.ritualCosts = a;
  }
  workflow;
  resources;
  ritualCosts;
  canHandle(e, r) {
    return e.item.type === "ritual" || r.steps.some((a) => a.type === "spendRitualCost");
  }
  async run(e, r) {
    if (!e.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const a = this.resolveCostPreview(e), o = await Ca({
      actor: e.actor,
      ritual: e.item,
      targetNames: e.targets.map((h) => h.name),
      cost: a,
      defaultSpendResource: Ba(r)
    });
    if (!o)
      return { status: "cancelled" };
    const n = Fa(r, o);
    if (n.steps.length === 0)
      return {
        status: "failed",
        reason: "empty-preparation",
        message: "O ritual não possui custo ou rolagem para preparar antes das ações no chat."
      };
    const s = await this.workflow.runAutomation(n, {
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
          variant: o.variant,
          spendResource: o.spendResource
        }
      }
    });
    if (!s.ok)
      return {
        status: "failed",
        reason: s.error.reason,
        message: s.error.message,
        cause: s.error
      };
    const u = s.value.context, d = Oa(r, e, u), g = Ha(o, a, u);
    return d.ok ? d.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: u,
      summaryLines: g
    } : {
      status: "ready",
      workflowContext: u,
      actions: d.actions,
      summaryLines: g
    } : {
      status: "failed",
      reason: d.reason,
      message: d.message
    };
  }
  async applyAction(e) {
    return ae(this.resources, e.actor, e.resource, e.operation, e.amount);
  }
  resolveCostPreview(e) {
    if (!e.actor) return null;
    const r = this.ritualCosts.getCost({
      actor: e.actor,
      ritual: e.item
    });
    return r.ok ? r.value : null;
  }
}
function Fa(t, e) {
  const r = [];
  for (const a of t.steps)
    a.type === "modifyResource" || a.type === "chatCard" || dt(a) && !e.spendResource || r.push(a);
  return {
    ...t,
    label: `${t.label} · Conjuração assistida`,
    steps: r
  };
}
function Oa(t, e, r) {
  const a = [];
  for (const o of t.steps) {
    if (o.type !== "modifyResource") continue;
    const n = B(o, r);
    if (!n.ok)
      return {
        ok: !1,
        reason: n.error.reason,
        message: n.error.message
      };
    const s = Ua(o.actor, e);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const u of s)
      a.push(_a(o, u, n.value));
  }
  return { ok: !0, actions: a };
}
function _a(t, e, r) {
  const a = e.name ?? "Ator sem nome";
  return {
    kind: "resource-operation",
    actor: e,
    actorName: a,
    resource: t.resource,
    operation: t.operation,
    amount: r,
    label: Ma(t, a, r),
    executedLabel: La(t, a)
  };
}
function Ma(t, e, r) {
  return t.operation === "heal" && t.resource === "PV" ? `Curar ${e} em ${r} PV` : t.operation === "damage" ? `Aplicar ${r} de dano em ${e}` : t.operation === "recover" ? `Recuperar ${r} ${t.resource} de ${e}` : t.operation === "spend" ? `Gastar ${r} ${t.resource} de ${e}` : `Aplicar ${r} ${t.resource} em ${e}`;
}
function La(t, e) {
  return t.operation === "heal" && t.resource === "PV" ? `✓ ${e} curado` : t.operation === "damage" ? `✓ Dano aplicado em ${e}` : t.operation === "recover" ? `✓ ${e} recuperado` : t.operation === "spend" ? `✓ Recurso gasto de ${e}` : "✓ Ação aplicada";
}
function Ua(t, e) {
  switch (t) {
    case "self":
      return e.actor ? [e.actor] : [];
    case "target":
      return e.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function Ha(t, e, r) {
  return [
    `Forma: ${Ta(t.variant)}`,
    qa(t, e),
    ...Object.values(r.rolls).map(Va)
  ];
}
function qa(t, e) {
  if (!e)
    return t.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
  const r = t.spendResource ? "gasto" : "não gasto";
  return `Custo: ${e.amount} ${e.resource} ${r}`;
}
function Va(t) {
  return `${ja(t)}: ${t.formula} = ${Math.trunc(t.total)}`;
}
function ja(t) {
  switch (t.intent) {
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
function Ba(t) {
  return t.steps.some(dt);
}
function dt(t) {
  return t.type === "spendResource" || t.type === "spendRitualCost";
}
const _ = "data-paranormal-toolkit-pending-id", oe = "data-paranormal-toolkit-executed-label", De = "data-paranormal-toolkit-detail-key", Wa = `[${_}]`, Ne = `${c}-chat-enrichment`, k = `${c}-item-use-prompt`, Fe = `${k}__actions`, Oe = `${k}__details`, Ga = `${k}__summary`, za = `${k}__title`, Ka = `${k}__button--executed`;
let _e = !1, ne = null;
const D = /* @__PURE__ */ new Map();
function xa(t) {
  ne = t, !_e && (Hooks.on("renderChatMessageHTML", (e, r) => {
    Xa(e, r, t);
  }), _e = !0);
}
function Me(t) {
  const e = Ya(t);
  D.set(t.pendingId, e), Qa(t.pendingId);
}
function Le(t) {
  D.delete(t);
}
function Ya(t) {
  return {
    ...t,
    createdAt: Date.now(),
    messageId: gt(t.context.message),
    itemId: t.context.item.id ?? null,
    actorId: t.context.actor?.id ?? null
  };
}
function Xa(t, e, r) {
  lo();
  const a = pt(e);
  if (!a) return;
  const o = io(t, a);
  if (!o) {
    ie(a, r);
    return;
  }
  se(a, o), ie(a, r);
}
function Qa(t) {
  const e = D.get(t);
  if (!e) return;
  const r = e.messageId ? uo(e.messageId) : null;
  if (r) {
    se(r, e), Ue(r);
    return;
  }
  if (e.messageId) return;
  const a = co(e);
  a && (se(a, e), Ue(a));
}
function Ue(t) {
  ne && ie(t, ne);
}
function se(t, e) {
  if (t.querySelector(`[${_}="${de(e.pendingId)}"]`)) return;
  const r = Za(t, e);
  eo(r, e.summaryLines ?? []), Ja(r).append(ro(e));
}
function Za(t, e) {
  const r = t.querySelector(`.${Ne}`);
  if (r)
    return r;
  const a = document.createElement("section");
  a.classList.add(Ne, k);
  const o = document.createElement("header");
  o.classList.add(`${k}__header`);
  const n = document.createElement("strong");
  n.classList.add(za), n.textContent = e.title ?? "Paranormal Toolkit";
  const s = document.createElement("span");
  return s.classList.add(Ga), s.textContent = ao(e.context), o.append(n, s), a.append(o), no(t).append(a), a;
}
function Ja(t) {
  const e = t.querySelector(`.${Fe}`);
  if (e)
    return e;
  const r = document.createElement("div");
  return r.classList.add(Fe), t.append(r), r;
}
function eo(t, e) {
  if (e.length === 0) return;
  const r = to(t);
  for (const a of e) {
    const o = mo(a);
    if (r.querySelector(`[${De}="${de(o)}"]`)) continue;
    const n = document.createElement("li");
    n.textContent = a, n.setAttribute(De, o), r.append(n);
  }
}
function to(t) {
  const e = t.querySelector(`.${Oe}`);
  if (e)
    return e;
  const r = document.createElement("ul");
  return r.classList.add(Oe), t.append(r), r;
}
function ro(t) {
  const e = document.createElement("button");
  return e.type = "button", e.classList.add(`${k}__button`), e.textContent = t.buttonLabel ?? "Aplicar automação", e.setAttribute(_, t.pendingId), e.setAttribute(oe, t.executedLabel ?? "✓ Automação aplicada"), e;
}
function ao(t) {
  const e = t.actor?.name ?? t.token?.name ?? "Origem não resolvida", r = oo(t);
  return `${e} → ${r}`;
}
function oo(t) {
  return t.targets.length > 0 ? t.targets.map((e) => e.name).join(", ") : "nenhum alvo";
}
function no(t) {
  return t.querySelector(".message-content") ?? t;
}
function ie(t, e) {
  const r = pt(t);
  if (!r) return;
  const a = r.querySelectorAll(Wa);
  for (const o of a)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      so(o, e);
    }));
}
async function so(t, e) {
  const r = t.getAttribute(_);
  if (!r) return;
  t.disabled = !0;
  const a = t.textContent;
  if (t.textContent = "Aplicando...", await e(r)) {
    t.textContent = t.getAttribute(oe) ?? "✓ Automação aplicada", t.classList.add(Ka), t.removeAttribute(_), t.removeAttribute(oe);
    return;
  }
  t.disabled = !1, t.textContent = a;
}
function io(t, e) {
  for (const r of D.values())
    if (ft(r, t, e))
      return r;
  return null;
}
function ft(t, e, r) {
  const a = gt(e) ?? r.dataset.messageId ?? null;
  return t.messageId ? t.messageId === a : !t.itemId || !He(r, "itemId", t.itemId) ? !1 : !t.actorId || He(r, "actorId", t.actorId);
}
function He(t, e, r) {
  if (t.dataset[e] === r)
    return !0;
  const a = `data-${fo(e)}`;
  for (const o of t.querySelectorAll(`[${a}]`))
    if (o.getAttribute(a) === r)
      return !0;
  return !1;
}
function uo(t) {
  const e = de(t);
  return document.querySelector(
    `.chat-message[data-message-id="${e}"], [data-message-id="${e}"]`
  );
}
function co(t) {
  for (const e of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (ft(t, null, e))
      return e;
  return null;
}
function lo() {
  const t = Date.now(), e = 300 * 1e3;
  for (const [r, a] of D.entries())
    t - a.createdAt > e && D.delete(r);
}
function pt(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function gt(t) {
  if (!t || typeof t != "object") return null;
  const e = t;
  return typeof e.id == "string" && e.id.length > 0 ? e.id : null;
}
function mo(t) {
  return t.trim().toLowerCase();
}
function fo(t) {
  return t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
}
function de(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const qe = 1e3;
class po {
  constructor(e, r, a, o) {
    this.workflow = e, this.debugOutput = o, this.ritualAssistant = new Na(e, r, a);
  }
  workflow;
  debugOutput;
  strategies = [];
  recentExecutionKeys = /* @__PURE__ */ new Map();
  pendingExecutions = /* @__PURE__ */ new Map();
  ritualAssistant;
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
      settings: ye(),
      strategies: this.strategies.map((e) => e.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(e) {
    const r = ye();
    if (r.executionMode === "disabled") {
      this.setAttempt(e, "skipped", "execution-mode-disabled");
      return;
    }
    const a = ue(e.item);
    if (!a.ok) {
      const o = a.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(e, o, a.error.reason), a.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: a.error.message,
        data: a.error
      });
      return;
    }
    if (!e.actor) {
      this.setAttempt(e, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${e.item.name}.`,
        data: Ve(e, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(e)) {
      this.setAttempt(e, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(e), r.executionMode) {
      case "ask":
        await this.handleAskMode(e, a.value);
        return;
      case "automatic":
        await this.executeAutomation(e, a.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(e) {
    const r = this.pendingExecutions.get(e);
    if (!r)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    if (r.kind === "workflow")
      return this.pendingExecutions.delete(e), Le(e), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const a = await this.ritualAssistant.applyAction(r.action);
    return a.ok ? (r.workflowContext.resourceTransactions.push(a.value), this.pendingExecutions.delete(e), Le(e), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (xa((e) => this.executePendingAutomation(e)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(e, r) {
    if (this.ritualAssistant.canHandle(e, r)) {
      await this.handleAssistedRitual(e, r);
      return;
    }
    await this.createPendingWorkflowPrompt(e, r);
  }
  async handleAssistedRitual(e, r) {
    this.setAttempt(e, "running", "ritual-assisted-cast");
    const a = await this.ritualAssistant.run(e, r);
    switch (a.status) {
      case "cancelled":
        this.setAttempt(e, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(e, "failed", a.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: a.message,
          data: a.cause ?? a
        }), ui.notifications?.warn(`Paranormal Toolkit: ${a.message}`);
        return;
      case "completed-without-actions":
        this.setAttempt(e, "completed", "ritual-assisted-no-actions"), i.info("Ritual assistido concluído sem ações pendentes.", C(a.workflowContext));
        return;
      case "ready":
        this.registerAssistedResourceActions(e, a.workflowContext, a.actions, a.summaryLines);
        return;
    }
  }
  registerAssistedResourceActions(e, r, a, o) {
    let n;
    for (const s of a) {
      const u = Be();
      n ??= u, this.pendingExecutions.set(u, {
        kind: "resource-action",
        id: u,
        action: s,
        context: e,
        workflowContext: r,
        createdAt: Date.now()
      }), Me({
        pendingId: u,
        context: e,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        summaryLines: o
      });
    }
    this.setAttempt(e, "pending", "ritual-assisted-actions", n), i.info("Ritual assistido preparado com ações pendentes.", C(r));
  }
  async createPendingWorkflowPrompt(e, r) {
    const a = Be();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: r,
      context: e,
      mode: "ask",
      createdAt: Date.now()
    }), Me({
      pendingId: a,
      context: e,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(e, "pending", "execution-mode-ask", a);
  }
  async executeAutomation(e, r, a) {
    this.setAttempt(e, "running");
    const o = await this.workflow.runAutomation(r, {
      sourceActor: e.actor,
      sourceToken: e.token,
      item: e.item,
      targets: e.targets,
      flags: {
        itemUse: {
          source: e.source,
          executionMode: a
        }
      }
    });
    if (!o.ok) {
      this.setAttempt(e, "failed", o.error.reason), this.handleAutomationFailure(o.error);
      return;
    }
    this.setAttempt(e, "completed"), i.info("Automação executada por uso normal de item.", C(o.value.context));
  }
  handleAutomationFailure(e) {
    const r = `Automação por uso de item falhou: ${e.message}`;
    if (e.reason === "resource-operation-failed") {
      i.warn(r, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
      return;
    }
    if (e.reason === "chat-card-failed") {
      i.error(r, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
      return;
    }
    i.warn(r, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
  }
  handleResourceActionFailure(e) {
    i.warn(`Ação assistida falhou: ${e.error.message}`, e.error), ui.notifications?.warn(`Paranormal Toolkit: ${e.error.message}`);
  }
  isDuplicate(e) {
    const r = Date.now(), a = je(e);
    for (const [n, s] of this.recentExecutionKeys.entries())
      r - s > qe && this.recentExecutionKeys.delete(n);
    const o = this.recentExecutionKeys.get(a);
    return o !== void 0 && r - o <= qe;
  }
  markExecution(e) {
    this.recentExecutionKeys.set(je(e), Date.now());
  }
  setAttempt(e, r, a, o) {
    this.lastAttempt = Ve(e, r, a, o);
  }
}
function Ve(t, e, r, a) {
  return {
    source: t.source,
    status: e,
    reason: r,
    pendingId: a,
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
function je(t) {
  const e = t.actor?.id ?? "no-actor", r = t.item.uuid ?? t.item.id ?? t.item.name ?? "unknown-item";
  return `${e}:${r}`;
}
function Be() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class go {
  constructor(e) {
    this.debugOutput = e;
  }
  debugOutput;
  async createResourceOperationMessage(e) {
    const r = this.createResourceOperationContent(e.transaction), a = le(e.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: e.transaction.actor }),
      content: r,
      data: a,
      flags: {
        [c]: {
          resourceTransaction: a
        }
      }
    });
  }
  async createWorkflowSummaryMessage(e, r) {
    const a = this.createWorkflowSummaryContent(e, r), o = C(e);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: e.sourceActor }),
      content: a,
      data: o,
      flags: {
        [c]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(e) {
    const r = p(e.actorName), a = p(e.resource), o = p(We(e)), n = p(yo(e));
    return `
      <section class="${c}-card ${c}-resource-card">
        <header class="${c}-card__header">
          <strong>${o}</strong>
          <span>${r}</span>
        </header>
        <div class="${c}-card__body">
          <p><strong>${n}:</strong> ${e.appliedAmount}</p>
          <p><strong>${a}:</strong> ${e.before.value}/${e.before.max} &rarr; ${e.after.value}/${e.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(e, r) {
    const a = p(r.title ?? "Automação"), o = r.message ? `<p>${p(r.message)}</p>` : "", n = p(e.sourceToken?.name ?? e.sourceActor.name ?? "Origem sem nome"), s = p(e.item.name ?? "Item sem nome"), u = e.targets.length > 0 ? e.targets.map((m) => p(m.name)).join(", ") : "Nenhum", d = Object.values(e.rolls).map(
      (m) => `<li><strong>${p(m.id)}:</strong> ${p(m.formula)} = ${m.total} <em>(${p(ho(m.intent))})</em>${m.damageType ? ` — ${p(m.damageType)}` : ""}</li>`
    ), g = e.ritualCosts.map(
      (m) => `<li><strong>${p(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${p(m.resource)} (${p(Ao(m.source))})</li>`
    ), h = e.damageInstances.map(
      (m) => `<li><strong>${p(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${p(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), R = e.healingInstances.map(
      (m) => `<li><strong>${p(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), N = e.resourceTransactions.map(
      (m) => `<li><strong>${p(m.actorName)}:</strong> ${p(We(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), S = e.phases.map((m) => p(m)).join(" &rarr; ");
    return `
      <section class="${c}-card ${c}-workflow-card">
        <header class="${c}-card__header">
          <strong>${a}</strong>
          <span>${s}</span>
        </header>
        <div class="${c}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${n}</p>
          <p><strong>Alvo:</strong> ${u}</p>
          ${g.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${g.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${h.length > 0 ? `<p><strong>Dano:</strong></p><ul>${h.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Cura:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${N.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${N.join("")}</ul>` : ""}
          ${S.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${S}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function ho(t) {
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
function We(t) {
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
function yo(t) {
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
function Ao(t) {
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
function wo() {
  const t = new Cr(), e = new ga(t), r = new vr(), a = new Nr(r), o = new Wr(t), n = new zr(), s = n.registerMany(Wt());
  if (!s.ok)
    throw new Error(s.error.message);
  const u = new Gr(), d = new ka(), g = new go(d), h = new wa(), R = new fa(e, a, g, h), N = new Aa(R, h), S = new po(N, e, a, d);
  return S.addStrategy(new jr((m) => S.handleItemUsed(m))), {
    ordem: o,
    resourceAdapter: t,
    ritualAdapter: r,
    ritualCosts: a,
    resources: e,
    automationRegistry: n,
    automationBinder: u,
    debugOutput: d,
    chatMessages: g,
    workflowHooks: h,
    automation: R,
    workflow: N,
    itemUseIntegration: S
  };
}
let O = null;
Hooks.once("init", () => {
  jt(), or(), i.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!we.isSupportedSystem()) {
    i.warn(
      `Sistema não suportado: ${we.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  O = wo(), O.itemUseIntegration.registerStrategies(), dr(O), $r(), wr(), i.info("Inicializado para o sistema Ordem Paranormal."), i.info(`API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${ht} inicializado.`);
});
function ko() {
  if (!O)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return O;
}
export {
  ko as getToolkitServices
};
//# sourceMappingURL=main.js.map
