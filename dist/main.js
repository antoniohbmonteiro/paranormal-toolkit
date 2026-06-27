const u = "paranormal-toolkit", ut = "Paranormal Toolkit", ct = "ordemparanormal";
class M {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Ue(t) {
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
function ne(t) {
  const e = t.getFlag(u, "automation");
  return e == null ? c({
    reason: "missing-automation",
    message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
  }) : Le(e) ? d(e.definition) : c({
    reason: "invalid-automation",
    message: `Automação do item ${t.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: e
  });
}
function lt(t) {
  return Le(t.getFlag(u, "automation"));
}
function Le(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.schemaVersion === 1 && dt(e.source) && mt(e.definition);
}
function mt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && y(e.label) && Array.isArray(e.steps) && e.steps.every(ft);
}
function dt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.type === "preset" ? y(e.presetId) && y(e.presetVersion) && y(e.appliedAt) : e.type === "manual" ? y(e.label) && y(e.appliedAt) : !1;
}
function ft(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  switch (e.type) {
    case "spendResource":
      return gt(e);
    case "spendRitualCost":
      return pt(e);
    case "rollFormula":
      return ht(e);
    case "modifyResource":
      return yt(e);
    case "chatCard":
      return At(e);
    default:
      return !1;
  }
}
function gt(t) {
  const e = t;
  return e.type === "spendResource" && e.actor === "self" && (e.resource === "PE" || e.resource === "PD") && He(e);
}
function pt(t) {
  return t.type === "spendRitualCost";
}
function ht(t) {
  const e = t;
  return e.type === "rollFormula" && y(e.id) && y(e.formula) && (e.intent === void 0 || Rt(e.intent)) && (e.damageType === void 0 || y(e.damageType));
}
function yt(t) {
  const e = t;
  return e.type === "modifyResource" && wt(e.actor) && Pt(e.resource) && kt(e.operation) && He(e);
}
function At(t) {
  const e = t;
  return e.type === "chatCard" && (e.title === void 0 || typeof e.title == "string") && (e.message === void 0 || typeof e.message == "string");
}
function He(t) {
  return typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0 || y(t.amountFrom);
}
function wt(t) {
  return t === "self" || t === "target";
}
function Pt(t) {
  return t === "PV" || t === "SAN" || t === "PE" || t === "PD";
}
function kt(t) {
  return t === "spend" || t === "damage" || t === "heal" || t === "recover";
}
function Rt(t) {
  return t === "attack" || t === "damage" || t === "healing" || t === "resistance" || t === "skill" || t === "ritual" || t === "generic";
}
function y(t) {
  return typeof t == "string" && t.length > 0;
}
function ie(t) {
  const e = t.items;
  if (Array.isArray(e))
    return e;
  if (e && typeof e == "object") {
    const r = e;
    if (Array.isArray(r.contents))
      return r.contents.filter(ce);
    if (bt(e))
      return Array.from(e).filter(ce);
  }
  return [];
}
function Tt(t) {
  return ie(t)[0] ?? null;
}
function $t(t) {
  return ie(t).find(lt) ?? null;
}
function bt(t) {
  return !!(t && typeof t == "object" && Symbol.iterator in t);
}
function ce(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function It(t) {
  return ie(t).filter((e) => e.type === "ritual");
}
function qe(t) {
  return It(t)[0] ?? null;
}
function St(t) {
  return {
    listPresets() {
      const e = t.automationRegistry.list().map(Ue);
      return s.info("Presets de automação registrados.", e), e;
    },
    findPresetsForFirstRitual() {
      const e = U("Nenhum ator encontrado para buscar presets de ritual.");
      if (!e) return [];
      const r = L(e);
      if (!r) return [];
      const o = t.automationRegistry.findForItem(r).map(le);
      return s.info(`Presets encontrados para ${r.name}.`, o), o;
    },
    async applyPresetToFirstRitual(e) {
      const r = U("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const o = L(r);
      if (!o) return;
      const a = t.automationRegistry.require(e);
      if (!a.ok) {
        s.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(o, a.value), s.info(`Preset ${a.value.id} aplicado em ${o.name}.`), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${o.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const e = U("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!e) return;
      const r = L(e);
      if (!r) return;
      const o = t.automationRegistry.findForItem(r)[0];
      if (!o) {
        s.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      await t.automationBinder.applyPreset(r, o.preset), s.info(`Melhor preset aplicado em ${r.name}.`, le(o)), ui.notifications?.info(`Paranormal Toolkit: preset ${o.preset.label} aplicado em ${r.name}.`);
    },
    async clearAutomationFromFirstRitual() {
      const e = U("Nenhum ator encontrado para limpar automação de ritual.");
      if (!e) return;
      const r = L(e);
      r && (await t.automationBinder.clear(r), s.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
function le(t) {
  return {
    preset: Ue(t.preset),
    score: t.score,
    reasons: [...t.reasons]
  };
}
function U(t) {
  const e = M.getSelectedActor();
  return e || (s.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function L(t) {
  const e = qe(t);
  return e || (s.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function _(t) {
  return t ? {
    id: t.id,
    source: {
      ...Ct(t.sourceActor),
      token: t.sourceToken
    },
    item: Et(t.item),
    targets: t.targets.map(Dt),
    phases: [...t.phases],
    lifecycleEvents: t.lifecycleEvents.map((e) => ({ ...e })),
    rollRequests: me(t.rollRequests, Ve),
    rolls: me(t.rolls, vt),
    ritualCosts: t.ritualCosts.map((e) => ({ ...e })),
    damageInstances: t.damageInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    healingInstances: t.healingInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    resourceTransactions: t.resourceTransactions.map(se),
    flagKeys: Object.keys(t.flags)
  } : null;
}
function se(t) {
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
function Ct(t) {
  return {
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown"
  };
}
function Et(t) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Item sem nome",
    itemType: t.type ?? "unknown",
    itemUuid: t.uuid ?? null
  };
}
function Dt(t) {
  return {
    tokenId: t.tokenId,
    actorId: t.actorId,
    sceneId: t.sceneId,
    name: t.name,
    actorName: t.actor?.name,
    actorType: t.actor?.type
  };
}
function Ve(t) {
  return {
    id: t.id,
    formula: t.formula,
    intent: t.intent,
    damageType: t.damageType,
    sourceStepIndex: t.sourceStepIndex
  };
}
function vt(t) {
  return {
    ...Ve(t),
    total: t.total
  };
}
function me(t, e) {
  return Object.fromEntries(Object.entries(t).map(([r, o]) => [r, e(o)]));
}
function Nt(t) {
  return {
    getSelected() {
      return M.getSelectedActor();
    },
    logResources() {
      const e = k(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!e) return;
      const r = t.ordem.getActorSnapshot(e);
      s.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && s.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(e) {
      await S(
        t,
        "Gasto de PE",
        k("Nenhum ator encontrado para gastar PE."),
        (r) => t.resources.spend(r, "PE", e)
      );
    },
    async spendPD(e) {
      await S(
        t,
        "Gasto de PD",
        k("Nenhum ator encontrado para gastar PD."),
        (r) => t.resources.spend(r, "PD", e)
      );
    },
    async damagePV(e) {
      await S(
        t,
        "Dano em PV",
        k("Nenhum ator encontrado para causar dano em PV."),
        (r) => t.resources.damage(r, "PV", e)
      );
    },
    async healPV(e) {
      await S(
        t,
        "Cura de PV",
        k("Nenhum ator encontrado para curar PV."),
        (r) => t.resources.heal(r, "PV", e)
      );
    },
    async damageSAN(e) {
      await S(
        t,
        "Dano em SAN",
        k("Nenhum ator encontrado para causar dano em SAN."),
        (r) => t.resources.damage(r, "SAN", e)
      );
    },
    async recoverSAN(e) {
      await S(
        t,
        "Recuperação de SAN",
        k("Nenhum ator encontrado para recuperar SAN."),
        (r) => t.resources.recover(r, "SAN", e)
      );
    }
  };
}
async function S(t, e, r, o) {
  if (!r) return;
  const a = await o(r);
  if (!a.ok) {
    Ft(a.error);
    return;
  }
  const n = a.value;
  try {
    await t.chatMessages.createResourceOperationMessage({ transaction: n });
  } catch (i) {
    s.error(`${e} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  s.info(`${e} realizado:`, se(n));
}
function k(t) {
  const e = M.getSelectedActor();
  return e || (s.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ft(t) {
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
function Ot() {
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
function Y() {
  return {
    enabled: q(A.enabled),
    console: q(A.console),
    ui: q(A.ui),
    chat: q(A.chat)
  };
}
async function w(t, e) {
  await game.settings.set(u, A[t], e);
}
function H(t, e) {
  game.settings.register(u, t, {
    name: e.name,
    hint: e.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: e.default
  });
}
function q(t) {
  return game.settings.get(u, t) === !0;
}
function Mt() {
  return {
    status() {
      return Y();
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
const Be = "ritual.costOnly", je = "ritual.simpleHealing", Ge = "ritual.simpleDamage", We = "generic.simpleHealing";
function _t() {
  return [
    Ut(),
    Lt(),
    Ht(),
    qt()
  ];
}
function Ut() {
  return {
    id: Be,
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
function Lt() {
  return {
    id: je,
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
    automation: ze()
  };
}
function Ht() {
  return {
    id: Ge,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Ke()
  };
}
function qt() {
  return {
    id: We,
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
function ze(t = "2d8+2") {
  return xe(
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
function Ke(t = "1d8") {
  return xe(
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
function xe(t, e, r) {
  return {
    ...t,
    steps: t.steps.map((o) => o.type !== "rollFormula" || o.id !== e ? o : {
      ...o,
      formula: r
    })
  };
}
function ue() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: C(e.id),
    actorId: C(e.actor?.id),
    sceneId: C(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  }));
}
function Ye() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null;
  return {
    tokenId: C(t.id),
    actorId: C(e?.id),
    sceneId: C(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function C(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function Vt(t) {
  return {
    logFirstRitualCost() {
      const e = R("Nenhum ator encontrado para consultar custo de ritual.");
      if (!e) return;
      const r = T(e);
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
      const o = R("Nenhum ator encontrado para configurar custo customizado.");
      if (!o) return;
      const a = T(o);
      if (a) {
        if (!Gt(e, r)) {
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
      const e = R("Nenhum ator encontrado para limpar custo customizado.");
      if (!e) return;
      const r = T(e);
      r && (await r.unsetFlag(u, "ritual.cost"), s.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const e = R("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!e) return;
      const r = T(e);
      if (!r) return;
      const o = t.automationRegistry.require(Be);
      if (!o.ok) {
        s.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(r, o.value), s.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(e = "2d8+2") {
      const r = R("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const o = T(r);
      if (!o) return;
      if (!de(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = t.automationRegistry.require(je);
      if (!a.ok) {
        s.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(o, a.value, {
        definition: ze(e)
      }), s.info(`Preset de cura simples aplicado ao ritual: ${o.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${o.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(e = "1d8") {
      const r = R("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const o = T(r);
      if (!o) return;
      if (!de(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = t.automationRegistry.require(Ge);
      if (!a.ok) {
        s.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(o, a.value, {
        definition: Ke(e)
      }), s.info(`Preset de dano simples aplicado ao ritual: ${o.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${o.name}.`);
    },
    async runFirstRitualAutomation() {
      const e = R("Nenhum ator encontrado para executar automação de ritual.");
      if (!e) return;
      const r = T(e);
      r && await Bt(t, e, r);
    }
  };
}
async function Bt(t, e, r) {
  const o = ne(r);
  if (!o.ok) {
    s.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
    return;
  }
  const a = await t.workflow.runAutomation(o.value, {
    sourceActor: e,
    sourceToken: Ye(),
    item: r,
    targets: ue()
  });
  if (!a.ok) {
    jt(a.error);
    return;
  }
  s.info("Automação de ritual executada com sucesso.", _(a.value.context));
}
function jt(t) {
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
function R(t) {
  const e = M.getSelectedActor();
  return e || (s.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function T(t) {
  const e = qe(t);
  return e || (s.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Gt(t, e) {
  return Number.isInteger(t) && t > 0 && (e === "PE" || e === "PD");
}
function de(t) {
  return typeof t == "string" && t.trim().length > 0;
}
const Wt = ["disabled", "ask", "automatic"], zt = ["buttons", "confirm"], Xe = "ask";
function Kt(t) {
  return typeof t == "string" && Wt.includes(t);
}
function xt(t) {
  return typeof t == "string" && zt.includes(t);
}
function Yt(t) {
  return Kt(t) ? t : xt(t) ? "ask" : Xe;
}
const B = {
  executionMode: "itemUse.executionMode",
  autoRun: "itemUse.autoRun.enabled"
};
function Xt() {
  game.settings.register(u, B.executionMode, {
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
    default: Xe
  }), game.settings.register(u, B.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function fe() {
  return {
    executionMode: Yt(game.settings.get(u, B.executionMode))
  };
}
async function $(t) {
  await game.settings.set(u, B.executionMode, t);
}
function Qt(t) {
  return {
    status() {
      return t.itemUseIntegration.status();
    },
    async enable() {
      await $("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await $("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(e) {
      await $(e), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${e}.`);
    },
    async ask() {
      await $("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await $("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await $("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await $("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Zt = [
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
function Jt(t) {
  return {
    phases() {
      return Zt;
    },
    lastContext() {
      return t.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const e = G("Nenhum ator encontrado para executar automação.");
      if (!e) return;
      const r = $t(e);
      if (!r) {
        s.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await ge(t, e, r);
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
      if (!rr(r)) {
        s.warn(`UUID não resolveu para um Item: ${e}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const o = tr(r) ?? G("Nenhum ator encontrado para executar automação do item.");
      o && await ge(t, o, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const e = G("Nenhum ator encontrado para configurar automação de teste.");
      if (!e) return;
      const r = Tt(e);
      if (!r) {
        s.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const o = t.automationRegistry.require(We);
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
async function ge(t, e, r) {
  const o = ne(r);
  if (!o.ok) {
    s.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
    return;
  }
  const a = await t.workflow.runAutomation(o.value, {
    sourceActor: e,
    sourceToken: Ye(),
    item: r,
    targets: ue()
  });
  if (!a.ok) {
    er(a.error);
    return;
  }
  s.info("Automação executada com sucesso.", _(a.value.context));
}
function er(t) {
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
function G(t) {
  const e = M.getSelectedActor();
  return e || (s.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function tr(t) {
  const e = t.parent;
  return e instanceof Actor ? e : null;
}
function rr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function or(t) {
  const e = Nt(t), r = St(t), o = Vt(t), a = Jt(t), n = Mt(), i = Qt(t);
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
function ar(t) {
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
    debug: or(t)
  }, r = globalThis;
  return r[u] = e, r.ParanormalToolkit = e, e;
}
class pe {
  static isSupportedSystem() {
    return game.system.id === ct;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function nr() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: E(e.id),
    actorId: E(e.actor?.id),
    sceneId: E(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome"
  }));
}
function Qe() {
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
function ir(t, e = Qe()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: e,
    targets: t
  };
}
function sr(t) {
  if (!lr(t)) return null;
  const e = t.getFlag(u, "workflow");
  return cr(e) ? e : null;
}
function ur() {
  return `flags.${u}.workflow`;
}
function he(t) {
  if (!t || typeof t != "object") return !1;
  const e = foundry.utils.getProperty(t, `flags.${u}`), r = foundry.utils.getProperty(t, `_source.flags.${u}`);
  return e !== void 0 || r !== void 0;
}
function ye(t) {
  const e = foundry.utils.getProperty(t, "speaker.actor"), r = foundry.utils.getProperty(t, "_source.speaker.actor");
  return X(e) || X(r);
}
function cr(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && e.kind === "chat-targets" && (e.source === null || typeof e.source == "object") && Array.isArray(e.targets);
}
function lr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t);
}
function E(t) {
  return X(t) ? t : null;
}
function X(t) {
  return typeof t == "string" && t.length > 0;
}
function mr() {
  const t = (e, r) => {
    dr(e, r);
  };
  Hooks.on("renderChatMessageHTML", t);
}
function dr(t, e) {
  const r = sr(t);
  if (!r || r.targets.length === 0) return;
  const o = gr(e);
  if (!o || o.querySelector(`.${u}-chat-enrichment`)) return;
  (o.querySelector(".message-content") ?? o).append(fr(r));
}
function fr(t) {
  const e = document.createElement("section");
  e.classList.add(`${u}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", e.append(r), t.source && e.append(Ae("Origem", t.source.name)), e.append(Ae("Alvo", t.targets.map((o) => o.name).join(", "))), e;
}
function Ae(t, e) {
  const r = document.createElement("p");
  r.classList.add(`${u}-chat-enrichment__row`);
  const o = document.createElement("span");
  o.textContent = `${t}: `;
  const a = document.createElement("span");
  return a.textContent = e, r.append(o, a), r;
}
function gr(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function pr() {
  Hooks.on("preCreateChatMessage", (t, e, r, o) => {
    if (!hr(o) || !yr(t) || he(t) || he(e)) return;
    const a = nr();
    if (a.length === 0 || !ye(t) && !ye(e)) return;
    const n = Qe();
    t.updateSource({
      [ur()]: ir(a, n)
    }), s.info("Targets capturados para ChatMessage.", { source: n, targets: a });
  });
}
function hr(t) {
  const e = game.user?.id;
  return !e || typeof t != "string" ? !0 : t === e;
}
function yr(t) {
  return !!(t && typeof t == "object" && "updateSource" in t);
}
const N = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Ze = {
  PV: "system.attributes.hp"
}, Q = {
  PV: [N.PV, Ze.PV],
  SAN: [N.SAN],
  PE: [N.PE],
  PD: [N.PD]
}, Z = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Ar {
  getResource(e, r) {
    const o = we(e, r);
    if (!o.ok)
      return c(o.error);
    const a = o.value, n = `${a}.value`, i = `${a}.max`, m = foundry.utils.getProperty(e, n), f = foundry.utils.getProperty(e, i), p = ke(e, r, n, m, "valor atual");
    if (p) return c(p);
    const h = ke(e, r, i, f, "valor máximo");
    return h ? c(h) : d({
      value: m,
      max: f
    });
  }
  async updateResourceValue(e, r, o) {
    const a = we(e, r);
    if (!a.ok)
      throw new Error(a.error.message);
    await e.update({ [`${a.value}.value`]: o });
  }
}
function we(t, e) {
  const r = wr(t.type, e);
  if (r && Pe(t, r))
    return d(r);
  const o = Q[e].find(
    (a) => Pe(t, a)
  );
  return o ? d(o) : c({
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "resource-path-not-found",
    message: Pr(t, e),
    path: Q[e].join(" | ")
  });
}
function wr(t, e) {
  return t === "threat" ? Ze[e] ?? null : t === "agent" ? N[e] : null;
}
function Pe(t, e) {
  const r = foundry.utils.getProperty(t, `${e}.value`), o = foundry.utils.getProperty(t, `${e}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof o == "number" && Number.isFinite(o);
}
function Pr(t, e) {
  const r = t.type ?? "unknown", o = Q[e].join(", ");
  return `${e} não encontrado no ator ${t.name ?? "sem nome"} (${r}). Paths testados: ${o}.`;
}
function ke(t, e, r, o, a) {
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
class kr {
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
      const i = Z.ritualItem.circleCandidates;
      return c({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: e,
        paths: [...i]
      });
    }
    const { path: o, value: a } = r, n = Rr(a);
    return n ? d(n) : c({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${o}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: e,
      path: o,
      value: a
    });
  }
  readCircleFromKnownPaths(e) {
    for (const r of Z.ritualItem.circleCandidates) {
      const o = foundry.utils.getProperty(e, r);
      if (o != null)
        return { path: r, value: o };
    }
    return null;
  }
}
function Rr(t) {
  if (Re(t))
    return t;
  if (typeof t == "string") {
    const e = t.trim();
    if (!/^\d+$/.test(e))
      return null;
    const r = Number(e);
    if (Re(r))
      return r;
  }
  return null;
}
function Re(t) {
  return t === 1 || t === 2 || t === 3 || t === 4;
}
const Tr = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class $r {
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
    const o = r.value, a = br(e.ritual, o);
    return a.ok ? a.value ? d(a.value) : d({
      resource: "PE",
      amount: Tr[o],
      source: "default-by-circle",
      circle: o
    }) : c(a.error);
  }
}
function br(t, e) {
  const r = t.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Ir(r) ? {
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
function Ir(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return (e.resource === "PE" || e.resource === "PD") && typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0;
}
const W = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Sr(t) {
  if (!Fr(t.item)) return null;
  const e = J(t.actor) ? t.actor : Cr(t.item);
  return {
    source: "ordem-item-used-hook",
    actor: e,
    item: t.item,
    token: Dr(t.token) ?? Er(e),
    targets: ue(),
    message: t.message,
    chatMessageData: t.chatMessageData
  };
}
function Cr(t) {
  const e = t;
  return J(e.actor) ? e.actor : J(t.parent) ? t.parent : null;
}
function Er(t) {
  const e = vr(t) ?? Nr(t);
  return e ? Je(e) : null;
}
function Dr(t) {
  return ee(t) ? Je(t) : null;
}
function vr(t) {
  if (!t) return null;
  const e = t, r = e.token;
  return ee(r) ? r : (e.getActiveTokens?.() ?? []).find(ee) ?? null;
}
function Nr(t) {
  return t ? canvas?.tokens?.controlled?.find((e) => e.actor?.id === t.id) ?? null : null;
}
function Je(t) {
  const e = t.actor ?? null;
  return {
    tokenId: z(t.id),
    actorId: z(e?.id),
    sceneId: z(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function Fr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function J(t) {
  return !!(t && typeof t == "object" && "update" in t && "items" in t);
}
function ee(t) {
  return !!(t && typeof t == "object" && ("actor" in t || "id" in t || "name" in t));
}
function z(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
class Or {
  constructor(e) {
    this.onItemUsed = e;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(W.ITEM_USED, (e) => {
      this.handleHook(e);
    }), this.registered = !0, s.info(`${W.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(e) {
    const r = Sr(Mr(e));
    if (!r) {
      s.warn(`${W.ITEM_USED} disparou sem payload de item válido.`, e);
      return;
    }
    await this.onItemUsed(r);
  }
}
function Mr(t) {
  return t && typeof t == "object" ? t : {};
}
class _r {
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
    return this.getNumber(e, Z.ritual.dt, 0);
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
class Ur {
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
class Lr {
  presets = /* @__PURE__ */ new Map();
  register(e) {
    const r = Hr(e);
    return r.ok ? this.presets.has(e.id) ? c({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${e.id}.`,
      presetId: e.id
    }) : (this.presets.set(e.id, K(e)), d(e)) : r;
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
    return r ? K(r) : null;
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
    return Array.from(this.presets.values()).map(K);
  }
  findForItem(e) {
    return this.list().map((r) => qr(r, e)).filter((r) => r !== null).sort((r, o) => o.score - r.score || r.preset.id.localeCompare(o.preset.id));
  }
}
function Hr(t) {
  return !x(t.id) || !x(t.version) || !x(t.label) ? c({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: t.id
  }) : !t.automation || t.automation.version !== 1 || !Array.isArray(t.automation.steps) ? c({
    reason: "invalid-preset",
    message: `Preset ${t.id} possui definição de automação inválida.`,
    presetId: t.id
  }) : d(t);
}
function qr(t, e) {
  if (t.matchers.length === 0)
    return null;
  const r = [];
  let o = 0;
  if (t.itemTypes.length > 0) {
    if (!t.itemTypes.includes(e.type)) return null;
    o += 10, r.push(`itemType:${e.type}`);
  }
  for (const a of t.matchers) {
    const n = Vr(a, e);
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
function Vr(t, e) {
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
      const r = Te(e.name), o = t.names.map(Te).includes(r);
      return {
        matches: o,
        score: o ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Br(e), o = r !== null && t.circles.includes(r);
      return {
        matches: o,
        score: o ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function Te(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Br(t) {
  const e = foundry.utils.getProperty(t, "system.circle"), r = typeof e == "string" ? Number(e) : e;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function K(t) {
  return structuredClone(t);
}
function x(t) {
  return typeof t == "string" && t.length > 0;
}
function te(t, e) {
  if (typeof t.amount == "number")
    return !Number.isInteger(t.amount) || t.amount <= 0 ? c({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : d(t.amount);
  if (typeof t.amountFrom == "string") {
    const r = j(t.amountFrom);
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
function j(t) {
  return t ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(t)?.groups?.rollId ?? null : null;
}
async function jr(t, e, r) {
  if (!$e(t.id) || !$e(t.formula))
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
      ...r.rollRequests[t.id] ?? et(t, e),
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
function et(t, e) {
  const r = t.intent ?? Gr(t.id);
  return {
    id: t.id,
    formula: t.formula,
    intent: r,
    damageType: t.damageType,
    sourceStepIndex: e
  };
}
function Gr(t) {
  const e = t.toLowerCase();
  return e.includes("damage") || e.includes("dano") ? "damage" : e.includes("healing") || e.includes("heal") || e.includes("cura") ? "healing" : e.includes("attack") || e.includes("ataque") ? "attack" : e.includes("resistance") || e.includes("resistencia") || e.includes("resistência") ? "resistance" : "generic";
}
function $e(t) {
  return typeof t == "string" && t.length > 0;
}
async function be(t, e, r, o, a) {
  switch (o) {
    case "spend":
      return r !== "PE" && r !== "PD" ? V(e, r, o, a) : t.spend(e, r, a);
    case "damage":
      return r !== "PV" && r !== "SAN" ? V(e, r, o, a) : t.damage(e, r, a);
    case "heal":
      return r !== "PV" ? V(e, r, o, a) : t.heal(e, r, a);
    case "recover":
      return r !== "SAN" ? V(e, r, o, a) : t.recover(e, r, a);
  }
}
function V(t, e, r, o) {
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
function Wr(t) {
  const { step: e, context: r, transaction: o, stepIndex: a, lifecycle: n } = t;
  if (e.operation === "damage") {
    const i = zr(e, r, o, a);
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
    const i = Kr(e, r, o, a);
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
function zr(t, e, r, o) {
  const a = j(t.amountFrom), n = a ? e.rolls[a] : void 0;
  return {
    id: tt(e.id, "damage", o, e.damageInstances.length),
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
function Kr(t, e, r, o) {
  const a = j(t.amountFrom);
  return {
    id: tt(e.id, "healing", o, e.healingInstances.length),
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
function tt(t, e, r, o) {
  return `${t}.${e}.${r}.${o}`;
}
function xr(t, e, r) {
  const o = j(t.amountFrom), a = o ? e.rolls[o] : void 0;
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
function Yr(t) {
  const { step: e, context: r, stepIndex: o, metadata: a, lifecycle: n } = t;
  n.emit("beforeApply", r, { stepIndex: o, step: e, metadata: a }), rt("before", t), Ie("before", t), Ie("resolve", t);
}
function Xr(t) {
  const { step: e, context: r, stepIndex: o, metadata: a, lifecycle: n } = t;
  n.emit("apply", r, { stepIndex: o, step: e, metadata: a }), rt("apply", t);
}
function Qr(t) {
  const { step: e, context: r, stepIndex: o, metadata: a, lifecycle: n } = t;
  n.emit("afterApply", r, { stepIndex: o, step: e, metadata: a });
}
function rt(t, e) {
  const { step: r, context: o, stepIndex: a, metadata: n, lifecycle: i } = e, m = Zr(t, r.operation);
  m && i.emit(m, o, {
    stepIndex: a,
    step: r,
    metadata: n
  });
}
function Ie(t, e) {
  const { step: r, context: o, stepIndex: a, metadata: n, lifecycle: i } = e;
  r.operation === "damage" && i.emit(t === "before" ? "beforeDamageResolution" : "damageResolution", o, {
    stepIndex: a,
    step: r,
    metadata: n
  });
}
function Zr(t, e) {
  return e === "damage" ? t === "before" ? "beforeApplyDamage" : t === "apply" ? "applyDamage" : "afterApplyDamage" : e === "heal" ? t === "before" ? "beforeApplyHealing" : t === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Jr(t, e, r) {
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
async function eo(t) {
  const { step: e } = t;
  switch (e.type) {
    case "spendResource":
      return to(t, e);
    case "spendRitualCost":
      return ro(t, e);
  }
}
async function to(t, e) {
  const { context: r, resources: o } = t, a = te(e, r);
  return a.ok ? ot(await o.spend(r.sourceActor, e.resource, a.value), r) : c(a.error);
}
async function ro(t, e) {
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
  }), ot(await o.spend(r.sourceActor, i.resource, i.amount), r, e);
}
function ot(t, e, r) {
  return t.ok ? (e.resourceTransactions.push(t.value), d(void 0)) : (r?.type === "spendRitualCost" && e.ritualCosts.pop(), c({
    reason: "resource-operation-failed",
    message: t.error.message,
    cause: t.error
  }));
}
async function oo(t) {
  const { step: e, context: r, stepIndex: o, lifecycle: a, execute: n } = t, i = ao(e);
  for (const f of i.before)
    a.emit(f, r, { stepIndex: o, step: e });
  const m = await n();
  if (!m.ok)
    return m;
  for (const f of i.after)
    a.emit(f, r, { stepIndex: o, step: e });
  return m;
}
function ao(t) {
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
class no {
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
        return oo({
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
    const a = await eo({
      step: e,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? d(void 0) : c({ ...a.error, stepIndex: o, step: e, context: r });
  }
  async runRollFormulaStepWithLifecycle(e, r, o) {
    const a = et(e, o);
    r.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", r, { stepIndex: o, step: e, rollRequest: a }), this.emitSpecificRollPhase("before", a, r, o, e), this.lifecycle.emit("roll", r, { stepIndex: o, step: e, rollRequest: a }), this.emitSpecificRollPhase("roll", a, r, o, e);
    const n = await this.runRollFormulaStep(e, r, o);
    if (!n.ok)
      return n;
    const i = r.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, r, o, e, i), this.lifecycle.emit("afterRoll", r, { stepIndex: o, step: e, rollRequest: a, rollResult: i }), d(void 0);
  }
  async runRollFormulaStep(e, r, o) {
    const a = await jr(e, o, r);
    return a.ok ? d(void 0) : c({ ...a.error, stepIndex: o, step: e, context: r });
  }
  async runModifyResourceStepWithLifecycle(e, r, o) {
    const a = te(e, r);
    if (!a.ok)
      return c({ ...a.error, stepIndex: o, step: e, context: r });
    const n = xr(e, r, a.value);
    Yr({
      step: e,
      context: r,
      stepIndex: o,
      metadata: n,
      lifecycle: this.lifecycle
    }), Xr({
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
      const f = await be(this.resources, m, e.resource, e.operation, a.value), p = this.handleResourceOperationResult(f, r, o, e);
      if (!p.ok)
        return p;
      Wr({
        step: e,
        context: r,
        transaction: p.value,
        stepIndex: o,
        lifecycle: this.lifecycle
      });
    }
    return Qr({
      step: e,
      context: r,
      stepIndex: o,
      metadata: n,
      lifecycle: this.lifecycle
    }), d(void 0);
  }
  async runModifyResourceStep(e, r, o) {
    const a = te(e, r);
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
      const m = await be(this.resources, i, e.resource, e.operation, a.value), f = this.handleResourceOperationResult(m, r, o, e);
      if (!f.ok)
        return f;
    }
    return d(void 0);
  }
  async runChatCardStep(e, r, o) {
    const a = await Jr(this.messages, e, r);
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
    const m = io(e, r.intent);
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
function io(t, e) {
  return e === "damage" ? t === "before" ? "beforeDamageRoll" : t === "roll" ? "damageRoll" : "afterDamageRoll" : e === "healing" ? t === "before" ? "beforeHealingRoll" : t === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class so {
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
    const { afterValue: f, appliedAmount: p } = m.value, h = {
      value: f,
      max: i.max
    };
    try {
      f !== i.value && await this.adapter.updateResourceValue(e, r, f);
    } catch (P) {
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
        cause: P
      });
    }
    return d({
      actor: e,
      actorId: e.id ?? null,
      actorName: e.name ?? "Ator sem nome",
      resource: r,
      operation: o,
      requestedAmount: a,
      appliedAmount: p,
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
function uo(t) {
  return {
    id: co(),
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
function co() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class lo {
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
    return _(this.lastContext);
  }
  async runAutomation(e, r) {
    const o = uo(r);
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
class mo {
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
class fo {
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
    const r = Y();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: e.speaker,
      content: e.content,
      whisper: go(),
      flags: {
        ...e.flags,
        [u]: {
          ...po(e.flags),
          debugOutput: !0
        }
      }
    }), r.console && e.data !== void 0 && s.info("Debug chat criado.", e.data), !0);
  }
  emit(e, r) {
    const o = Y();
    if (!o.enabled)
      return;
    const a = r.notification ?? Se(r);
    o.console && this.emitConsole(e, r), o.ui && this.emitUi(e, a);
  }
  emitConsole(e, r) {
    const o = Se(r);
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
function Se(t) {
  return t.message ? `${t.title}: ${t.message}` : t.title;
}
function go() {
  const t = game.users?.filter((e) => e.isGM === !0 && e.id).map((e) => e.id) ?? [];
  return t.length > 0 ? t : game.user?.id ? [game.user.id] : [];
}
function po(t) {
  const e = t?.[u];
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const O = "data-paranormal-toolkit-pending-id", ho = `[${O}]`, Ce = `${u}-chat-enrichment`, b = `${u}-item-use-prompt`, Ee = `${b}__actions`, yo = `${b}__summary`, Ao = `${b}__title`, wo = `${b}__button--executed`;
let De = !1, re = null;
const D = /* @__PURE__ */ new Map();
function Po(t) {
  re = t, !De && (Hooks.on("renderChatMessageHTML", (e, r) => {
    $o(e, r, t);
  }), De = !0);
}
function ko(t) {
  const e = To(t);
  D.set(t.pendingId, e), bo(t.pendingId);
}
function Ro(t) {
  D.delete(t);
}
function To(t) {
  return {
    ...t,
    createdAt: Date.now(),
    messageId: it(t.context.message),
    itemId: t.context.item.id ?? null,
    actorId: t.context.actor?.id ?? null
  };
}
function $o(t, e, r) {
  _o();
  const o = nt(e);
  if (!o) return;
  const a = Fo(t, o);
  if (!a) {
    ae(o, r);
    return;
  }
  oe(o, a), ae(o, r);
}
function bo(t) {
  const e = D.get(t);
  if (!e) return;
  const r = e.messageId ? Oo(e.messageId) : null;
  if (r) {
    oe(r, e), ve(r);
    return;
  }
  if (e.messageId) return;
  const o = Mo(e);
  o && (oe(o, e), ve(o));
}
function ve(t) {
  re && ae(t, re);
}
function oe(t, e) {
  if (t.querySelector(`[${O}="${st(e.pendingId)}"]`)) return;
  const r = Io(t, e.context);
  So(r).append(Co(e.pendingId));
}
function Io(t, e) {
  const r = t.querySelector(`.${Ce}`);
  if (r)
    return r;
  const o = document.createElement("section");
  o.classList.add(Ce, b);
  const a = document.createElement("header");
  a.classList.add(`${b}__header`);
  const n = document.createElement("strong");
  n.classList.add(Ao), n.textContent = "Paranormal Toolkit";
  const i = document.createElement("span");
  return i.classList.add(yo), i.textContent = Eo(e), a.append(n, i), o.append(a), vo(t).append(o), o;
}
function So(t) {
  const e = t.querySelector(`.${Ee}`);
  if (e)
    return e;
  const r = document.createElement("div");
  return r.classList.add(Ee), t.append(r), r;
}
function Co(t) {
  const e = document.createElement("button");
  return e.type = "button", e.classList.add(`${b}__button`), e.textContent = "Aplicar automação", e.setAttribute(O, t), e;
}
function Eo(t) {
  const e = t.actor?.name ?? t.token?.name ?? "Origem não resolvida", r = Do(t);
  return `${e} → ${r}`;
}
function Do(t) {
  return t.targets.length > 0 ? t.targets.map((e) => e.name).join(", ") : "nenhum alvo";
}
function vo(t) {
  return t.querySelector(".message-content") ?? t;
}
function ae(t, e) {
  const r = nt(t);
  if (!r) return;
  const o = r.querySelectorAll(ho);
  for (const a of o)
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      No(a, e);
    }));
}
async function No(t, e) {
  const r = t.getAttribute(O);
  if (!r) return;
  t.disabled = !0;
  const o = t.textContent;
  if (t.textContent = "Aplicando...", await e(r)) {
    t.textContent = "✓ Automação aplicada", t.classList.add(wo), t.removeAttribute(O);
    return;
  }
  t.disabled = !1, t.textContent = o;
}
function Fo(t, e) {
  for (const r of D.values())
    if (at(r, t, e))
      return r;
  return null;
}
function at(t, e, r) {
  const o = it(e) ?? r.dataset.messageId ?? null;
  return t.messageId ? t.messageId === o : !t.itemId || !Ne(r, "itemId", t.itemId) ? !1 : !t.actorId || Ne(r, "actorId", t.actorId);
}
function Ne(t, e, r) {
  if (t.dataset[e] === r)
    return !0;
  const o = `data-${Uo(e)}`;
  for (const a of t.querySelectorAll(`[${o}]`))
    if (a.getAttribute(o) === r)
      return !0;
  return !1;
}
function Oo(t) {
  const e = st(t);
  return document.querySelector(
    `.chat-message[data-message-id="${e}"], [data-message-id="${e}"]`
  );
}
function Mo(t) {
  for (const e of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (at(t, null, e))
      return e;
  return null;
}
function _o() {
  const t = Date.now(), e = 300 * 1e3;
  for (const [r, o] of D.entries())
    t - o.createdAt > e && D.delete(r);
}
function nt(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function it(t) {
  if (!t || typeof t != "object") return null;
  const e = t;
  return typeof e.id == "string" && e.id.length > 0 ? e.id : null;
}
function Uo(t) {
  return t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
}
function st(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Fe = 1e3;
class Lo {
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
      settings: fe(),
      strategies: this.strategies.map((e) => e.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(e) {
    const r = fe();
    if (r.executionMode === "disabled") {
      this.setAttempt(e, "skipped", "execution-mode-disabled");
      return;
    }
    const o = ne(e.item);
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
        data: Oe(e, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(e)) {
      this.setAttempt(e, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(e), r.executionMode) {
      case "ask":
        await this.createPendingPrompt(e, o.value);
        return;
      case "automatic":
        await this.executeAutomation(e, o.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(e) {
    const r = this.pendingExecutions.get(e);
    return r ? (this.pendingExecutions.delete(e), Ro(e), await this.executeAutomation(r.context, r.definition, r.mode), !0) : (ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Po((e) => this.executePendingAutomation(e)), this.promptRendererRegistered = !0);
  }
  async createPendingPrompt(e, r) {
    const o = Ho();
    this.pendingExecutions.set(o, {
      id: o,
      definition: r,
      context: e,
      mode: "ask",
      createdAt: Date.now()
    }), ko({
      pendingId: o,
      context: e,
      mode: "ask"
    }), this.setAttempt(e, "pending", "execution-mode-ask", o);
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
    this.setAttempt(e, "completed"), s.info("Automação executada por uso normal de item.", _(a.value.context));
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
    const r = Date.now(), o = Me(e);
    for (const [n, i] of this.recentExecutionKeys.entries())
      r - i > Fe && this.recentExecutionKeys.delete(n);
    const a = this.recentExecutionKeys.get(o);
    return a !== void 0 && r - a <= Fe;
  }
  markExecution(e) {
    this.recentExecutionKeys.set(Me(e), Date.now());
  }
  setAttempt(e, r, o, a) {
    this.lastAttempt = Oe(e, r, o, a);
  }
}
function Oe(t, e, r, o) {
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
function Me(t) {
  const e = t.actor?.id ?? "no-actor", r = t.item.uuid ?? t.item.id ?? t.item.name ?? "unknown-item";
  return `${e}:${r}`;
}
function Ho() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class qo {
  constructor(e) {
    this.debugOutput = e;
  }
  debugOutput;
  async createResourceOperationMessage(e) {
    const r = this.createResourceOperationContent(e.transaction), o = se(e.transaction);
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
    const o = this.createWorkflowSummaryContent(e, r), a = _(e);
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
    const r = g(e.actorName), o = g(e.resource), a = g(_e(e)), n = g(Bo(e));
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
    const o = g(r.title ?? "Automação"), a = r.message ? `<p>${g(r.message)}</p>` : "", n = g(e.sourceToken?.name ?? e.sourceActor.name ?? "Origem sem nome"), i = g(e.item.name ?? "Item sem nome"), m = e.targets.length > 0 ? e.targets.map((l) => g(l.name)).join(", ") : "Nenhum", f = Object.values(e.rolls).map(
      (l) => `<li><strong>${g(l.id)}:</strong> ${g(l.formula)} = ${l.total} <em>(${g(Vo(l.intent))})</em>${l.damageType ? ` — ${g(l.damageType)}` : ""}</li>`
    ), p = e.ritualCosts.map(
      (l) => `<li><strong>${g(l.itemName)}:</strong> ${l.circle}º círculo — ${l.amount} ${g(l.resource)} (${g(jo(l.source))})</li>`
    ), h = e.damageInstances.map(
      (l) => `<li><strong>${g(l.targetActorName)}:</strong> bruto ${l.rawAmount}${l.damageType ? ` ${g(l.damageType)}` : ""} &rarr; final ${l.finalAmount} &rarr; aplicado ${l.appliedAmount}</li>`
    ), P = e.healingInstances.map(
      (l) => `<li><strong>${g(l.targetActorName)}:</strong> bruto ${l.rawAmount} &rarr; final ${l.finalAmount} &rarr; aplicado ${l.appliedAmount}</li>`
    ), v = e.resourceTransactions.map(
      (l) => `<li><strong>${g(l.actorName)}:</strong> ${g(_e(l))} — ${l.before.value}/${l.before.max} &rarr; ${l.after.value}/${l.after.max}</li>`
    ), I = e.phases.map((l) => g(l)).join(" &rarr; ");
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
          ${p.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${p.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${h.length > 0 ? `<p><strong>Dano:</strong></p><ul>${h.join("")}</ul>` : ""}
          ${P.length > 0 ? `<p><strong>Cura:</strong></p><ul>${P.join("")}</ul>` : ""}
          ${v.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${v.join("")}</ul>` : ""}
          ${I.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${I}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Vo(t) {
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
function _e(t) {
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
function Bo(t) {
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
function jo(t) {
  switch (t) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return t;
  }
}
function g(t) {
  return t.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function Go() {
  const t = new Ar(), e = new so(t), r = new kr(), o = new $r(r), a = new _r(t), n = new Lr(), i = n.registerMany(_t());
  if (!i.ok)
    throw new Error(i.error.message);
  const m = new Ur(), f = new fo(), p = new qo(f), h = new mo(), P = new no(e, o, p, h), v = new lo(P, h), I = new Lo(v, f);
  return I.addStrategy(new Or((l) => I.handleItemUsed(l))), {
    ordem: a,
    resourceAdapter: t,
    ritualAdapter: r,
    ritualCosts: o,
    resources: e,
    automationRegistry: n,
    automationBinder: m,
    debugOutput: f,
    chatMessages: p,
    workflowHooks: h,
    automation: P,
    workflow: v,
    itemUseIntegration: I
  };
}
let F = null;
Hooks.once("init", () => {
  Ot(), Xt(), s.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!pe.isSupportedSystem()) {
    s.warn(
      `Sistema não suportado: ${pe.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  F = Go(), F.itemUseIntegration.registerStrategies(), ar(F), pr(), mr(), s.info("Inicializado para o sistema Ordem Paranormal."), s.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${ut} inicializado.`);
});
function Wo() {
  if (!F)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return F;
}
export {
  Wo as getToolkitServices
};
//# sourceMappingURL=main.js.map
