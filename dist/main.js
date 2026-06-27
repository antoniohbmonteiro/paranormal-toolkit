const u = "paranormal-toolkit", Ge = "Paranormal Toolkit", Be = "ordemparanormal";
class F {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Te(t) {
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
function l(t) {
  return { ok: !1, error: t };
}
function J(t) {
  const e = t.getFlag(u, "automation");
  return e == null ? l({
    reason: "missing-automation",
    message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
  }) : be(e) ? d(e.definition) : l({
    reason: "invalid-automation",
    message: `Automação do item ${t.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: e
  });
}
function ze(t) {
  return be(t.getFlag(u, "automation"));
}
function be(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.schemaVersion === 1 && Ye(e.source) && Ke(e.definition);
}
function Ke(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && y(e.label) && Array.isArray(e.steps) && e.steps.every(Qe);
}
function Ye(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.type === "preset" ? y(e.presetId) && y(e.presetVersion) && y(e.appliedAt) : e.type === "manual" ? y(e.label) && y(e.appliedAt) : !1;
}
function Qe(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  switch (e.type) {
    case "spendResource":
      return Ze(e);
    case "spendRitualCost":
      return Je(e);
    case "rollFormula":
      return Xe(e);
    case "modifyResource":
      return xe(e);
    case "chatCard":
      return et(e);
    default:
      return !1;
  }
}
function Ze(t) {
  const e = t;
  return e.type === "spendResource" && e.actor === "self" && (e.resource === "PE" || e.resource === "PD") && Se(e);
}
function Je(t) {
  return t.type === "spendRitualCost";
}
function Xe(t) {
  const e = t;
  return e.type === "rollFormula" && y(e.id) && y(e.formula) && (e.intent === void 0 || ot(e.intent)) && (e.damageType === void 0 || y(e.damageType));
}
function xe(t) {
  const e = t;
  return e.type === "modifyResource" && tt(e.actor) && rt(e.resource) && at(e.operation) && Se(e);
}
function et(t) {
  const e = t;
  return e.type === "chatCard" && (e.title === void 0 || typeof e.title == "string") && (e.message === void 0 || typeof e.message == "string");
}
function Se(t) {
  return typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0 || y(t.amountFrom);
}
function tt(t) {
  return t === "self" || t === "target";
}
function rt(t) {
  return t === "PV" || t === "SAN" || t === "PE" || t === "PD";
}
function at(t) {
  return t === "spend" || t === "damage" || t === "heal" || t === "recover";
}
function ot(t) {
  return t === "attack" || t === "damage" || t === "healing" || t === "resistance" || t === "skill" || t === "ritual" || t === "generic";
}
function y(t) {
  return typeof t == "string" && t.length > 0;
}
function X(t) {
  const e = t.items;
  if (Array.isArray(e))
    return e;
  if (e && typeof e == "object") {
    const r = e;
    if (Array.isArray(r.contents))
      return r.contents.filter(te);
    if (st(e))
      return Array.from(e).filter(te);
  }
  return [];
}
function nt(t) {
  return X(t)[0] ?? null;
}
function it(t) {
  return X(t).find(ze) ?? null;
}
function st(t) {
  return !!(t && typeof t == "object" && Symbol.iterator in t);
}
function te(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function ut(t) {
  return X(t).filter((e) => e.type === "ritual");
}
function Ie(t) {
  return ut(t)[0] ?? null;
}
function lt(t) {
  return {
    listPresets() {
      const e = t.automationRegistry.list().map(Te);
      return s.info("Presets de automação registrados.", e), e;
    },
    findPresetsForFirstRitual() {
      const e = E("Nenhum ator encontrado para buscar presets de ritual.");
      if (!e) return [];
      const r = O(e);
      if (!r) return [];
      const a = t.automationRegistry.findForItem(r).map(re);
      return s.info(`Presets encontrados para ${r.name}.`, a), a;
    },
    async applyPresetToFirstRitual(e) {
      const r = E("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const a = O(r);
      if (!a) return;
      const o = t.automationRegistry.require(e);
      if (!o.ok) {
        s.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(a, o.value), s.info(`Preset ${o.value.id} aplicado em ${a.name}.`), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const e = E("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!e) return;
      const r = O(e);
      if (!r) return;
      const a = t.automationRegistry.findForItem(r)[0];
      if (!a) {
        s.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      await t.automationBinder.applyPreset(r, a.preset), s.info(`Melhor preset aplicado em ${r.name}.`, re(a)), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${r.name}.`);
    },
    async clearAutomationFromFirstRitual() {
      const e = E("Nenhum ator encontrado para limpar automação de ritual.");
      if (!e) return;
      const r = O(e);
      r && (await t.automationBinder.clear(r), s.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
function re(t) {
  return {
    preset: Te(t.preset),
    score: t.score,
    reasons: [...t.reasons]
  };
}
function E(t) {
  const e = F.getSelectedActor();
  return e || (s.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function O(t) {
  const e = Ie(t);
  return e || (s.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function D(t) {
  return t ? {
    id: t.id,
    source: {
      ...ct(t.sourceActor),
      token: t.sourceToken
    },
    item: mt(t.item),
    targets: t.targets.map(dt),
    phases: [...t.phases],
    lifecycleEvents: t.lifecycleEvents.map((e) => ({ ...e })),
    rollRequests: ae(t.rollRequests, Ce),
    rolls: ae(t.rolls, ft),
    ritualCosts: t.ritualCosts.map((e) => ({ ...e })),
    damageInstances: t.damageInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    healingInstances: t.healingInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    resourceTransactions: t.resourceTransactions.map(x),
    flagKeys: Object.keys(t.flags)
  } : null;
}
function x(t) {
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
function ct(t) {
  return {
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown"
  };
}
function mt(t) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Item sem nome",
    itemType: t.type ?? "unknown",
    itemUuid: t.uuid ?? null
  };
}
function dt(t) {
  return {
    tokenId: t.tokenId,
    actorId: t.actorId,
    sceneId: t.sceneId,
    name: t.name,
    actorName: t.actor?.name,
    actorType: t.actor?.type
  };
}
function Ce(t) {
  return {
    id: t.id,
    formula: t.formula,
    intent: t.intent,
    damageType: t.damageType,
    sourceStepIndex: t.sourceStepIndex
  };
}
function ft(t) {
  return {
    ...Ce(t),
    total: t.total
  };
}
function ae(t, e) {
  return Object.fromEntries(Object.entries(t).map(([r, a]) => [r, e(a)]));
}
function gt(t) {
  return {
    getSelected() {
      return F.getSelectedActor();
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
      await b(
        t,
        "Gasto de PE",
        P("Nenhum ator encontrado para gastar PE."),
        (r) => t.resources.spend(r, "PE", e)
      );
    },
    async spendPD(e) {
      await b(
        t,
        "Gasto de PD",
        P("Nenhum ator encontrado para gastar PD."),
        (r) => t.resources.spend(r, "PD", e)
      );
    },
    async damagePV(e) {
      await b(
        t,
        "Dano em PV",
        P("Nenhum ator encontrado para causar dano em PV."),
        (r) => t.resources.damage(r, "PV", e)
      );
    },
    async healPV(e) {
      await b(
        t,
        "Cura de PV",
        P("Nenhum ator encontrado para curar PV."),
        (r) => t.resources.heal(r, "PV", e)
      );
    },
    async damageSAN(e) {
      await b(
        t,
        "Dano em SAN",
        P("Nenhum ator encontrado para causar dano em SAN."),
        (r) => t.resources.damage(r, "SAN", e)
      );
    },
    async recoverSAN(e) {
      await b(
        t,
        "Recuperação de SAN",
        P("Nenhum ator encontrado para recuperar SAN."),
        (r) => t.resources.recover(r, "SAN", e)
      );
    }
  };
}
async function b(t, e, r, a) {
  if (!r) return;
  const o = await a(r);
  if (!o.ok) {
    pt(o.error);
    return;
  }
  const n = o.value;
  try {
    await t.chatMessages.createResourceOperationMessage({ transaction: n });
  } catch (i) {
    s.error(`${e} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  s.info(`${e} realizado:`, x(n));
}
function P(t) {
  const e = F.getSelectedActor();
  return e || (s.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function pt(t) {
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
function ht() {
  U(A.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), U(A.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), U(A.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), U(A.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function B() {
  return {
    enabled: _(A.enabled),
    console: _(A.console),
    ui: _(A.ui),
    chat: _(A.chat)
  };
}
async function R(t, e) {
  await game.settings.set(u, A[t], e);
}
function U(t, e) {
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
function yt() {
  return {
    status() {
      return B();
    },
    async enable() {
      await R("enabled", !0);
    },
    async disable() {
      await R("enabled", !1);
    },
    async enableConsole() {
      await R("console", !0);
    },
    async disableConsole() {
      await R("console", !1);
    },
    async enableUi() {
      await R("ui", !0);
    },
    async disableUi() {
      await R("ui", !1);
    },
    async enableChat() {
      await R("chat", !0);
    },
    async disableChat() {
      await R("chat", !1);
    }
  };
}
const ve = "ritual.costOnly", Ne = "ritual.simpleHealing", Fe = "ritual.simpleDamage", De = "generic.simpleHealing";
function At() {
  return [
    wt(),
    Rt(),
    kt(),
    Pt()
  ];
}
function wt() {
  return {
    id: ve,
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
function Rt() {
  return {
    id: Ne,
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
    automation: Ee()
  };
}
function kt() {
  return {
    id: Fe,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Oe()
  };
}
function Pt() {
  return {
    id: De,
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
function Ee(t = "2d8+2") {
  return Ue(
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
function Oe(t = "1d8") {
  return Ue(
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
function Ue(t, e, r) {
  return {
    ...t,
    steps: t.steps.map((a) => a.type !== "rollFormula" || a.id !== e ? a : {
      ...a,
      formula: r
    })
  };
}
function V() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: S(e.id),
    actorId: S(e.actor?.id),
    sceneId: S(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  }));
}
function _e() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null;
  return {
    tokenId: S(t.id),
    actorId: S(e?.id),
    sceneId: S(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function S(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function $t(t) {
  return {
    logFirstRitualCost() {
      const e = $("Nenhum ator encontrado para consultar custo de ritual.");
      if (!e) return;
      const r = T(e);
      if (!r) return;
      const a = t.ritualCosts.getCost({ actor: e, ritual: r });
      if (!a.ok) {
        s.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      s.info("Custo do primeiro ritual:", {
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
        if (!St(e, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(u, "ritual.cost", {
          resource: r,
          amount: e
        }), s.info(`Custo customizado aplicado em ${o.name}.`, { resource: r, amount: e }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${e} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const e = $("Nenhum ator encontrado para limpar custo customizado.");
      if (!e) return;
      const r = T(e);
      r && (await r.unsetFlag(u, "ritual.cost"), s.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const e = $("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!e) return;
      const r = T(e);
      if (!r) return;
      const a = t.automationRegistry.require(ve);
      if (!a.ok) {
        s.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(r, a.value), s.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(e = "2d8+2") {
      const r = $("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const a = T(r);
      if (!a) return;
      if (!oe(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = t.automationRegistry.require(Ne);
      if (!o.ok) {
        s.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(a, o.value, {
        definition: Ee(e)
      }), s.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(e = "1d8") {
      const r = $("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const a = T(r);
      if (!a) return;
      if (!oe(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = t.automationRegistry.require(Fe);
      if (!o.ok) {
        s.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(a, o.value, {
        definition: Oe(e)
      }), s.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const e = $("Nenhum ator encontrado para executar automação de ritual.");
      if (!e) return;
      const r = T(e);
      r && await Tt(t, e, r);
    }
  };
}
async function Tt(t, e, r) {
  const a = J(r);
  if (!a.ok) {
    s.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(a.value, {
    sourceActor: e,
    sourceToken: _e(),
    item: r,
    targets: V()
  });
  if (!o.ok) {
    bt(o.error);
    return;
  }
  s.info("Automação de ritual executada com sucesso.", D(o.value.context));
}
function bt(t) {
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
function $(t) {
  const e = F.getSelectedActor();
  return e || (s.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function T(t) {
  const e = Ie(t);
  return e || (s.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function St(t, e) {
  return Number.isInteger(t) && t > 0 && (e === "PE" || e === "PD");
}
function oe(t) {
  return typeof t == "string" && t.trim().length > 0;
}
const ee = {
  autoRun: "itemUse.autoRun.enabled"
};
function It() {
  game.settings.register(u, ee.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Quando ativo, itens com automação do Paranormal Toolkit executam o workflow ao serem usados pela ficha. Experimental na versão 0.8.x.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  });
}
function ne() {
  return {
    autoRun: game.settings.get(u, ee.autoRun) === !0
  };
}
async function ie(t) {
  await game.settings.set(u, ee.autoRun, t);
}
function Ct(t) {
  return {
    status() {
      return t.itemUseIntegration.status();
    },
    async enable() {
      await ie(!0), ui.notifications?.info("Paranormal Toolkit: automação ao usar item ativada.");
    },
    async disable() {
      await ie(!1), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    }
  };
}
const vt = [
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
function Nt(t) {
  return {
    phases() {
      return vt;
    },
    lastContext() {
      return t.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const e = L("Nenhum ator encontrado para executar automação.");
      if (!e) return;
      const r = it(e);
      if (!r) {
        s.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await se(t, e, r);
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
      if (!Et(r)) {
        s.warn(`UUID não resolveu para um Item: ${e}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = Dt(r) ?? L("Nenhum ator encontrado para executar automação do item.");
      a && await se(t, a, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const e = L("Nenhum ator encontrado para configurar automação de teste.");
      if (!e) return;
      const r = nt(e);
      if (!r) {
        s.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = t.automationRegistry.require(De);
        if (!a.ok) {
          s.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
          return;
        }
        await t.automationBinder.applyPreset(r, a.value), s.info(`Preset de teste aplicado ao item: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${r.name}.`);
      } catch (a) {
        s.error("Falha ao configurar automação de teste no item.", a), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function se(t, e, r) {
  const a = J(r);
  if (!a.ok) {
    s.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(a.value, {
    sourceActor: e,
    sourceToken: _e(),
    item: r,
    targets: V()
  });
  if (!o.ok) {
    Ft(o.error);
    return;
  }
  s.info("Automação executada com sucesso.", D(o.value.context));
}
function Ft(t) {
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
function L(t) {
  const e = F.getSelectedActor();
  return e || (s.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Dt(t) {
  const e = t.parent;
  return e instanceof Actor ? e : null;
}
function Et(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function Ot(t) {
  const e = gt(t), r = lt(t), a = $t(t), o = Nt(t), n = yt(), i = Ct(t);
  return {
    actor: e,
    automation: r,
    ritual: a,
    workflow: o,
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
function Ut(t) {
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
    debug: Ot(t)
  }, r = globalThis;
  return r[u] = e, r.ParanormalToolkit = e, e;
}
class ue {
  static isSupportedSystem() {
    return game.system.id === Be;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function _t() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: I(e.id),
    actorId: I(e.actor?.id),
    sceneId: I(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome"
  }));
}
function Me() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null, r = t.name ?? e?.name ?? "Origem sem nome";
  return {
    tokenId: I(t.id),
    actorId: I(e?.id),
    sceneId: I(t.scene?.id),
    name: r
  };
}
function Mt(t, e = Me()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: e,
    targets: t
  };
}
function Vt(t) {
  if (!qt(t)) return null;
  const e = t.getFlag(u, "workflow");
  return Lt(e) ? e : null;
}
function Ht() {
  return `flags.${u}.workflow`;
}
function le(t) {
  if (!t || typeof t != "object") return !1;
  const e = foundry.utils.getProperty(t, `flags.${u}`), r = foundry.utils.getProperty(t, `_source.flags.${u}`);
  return e !== void 0 || r !== void 0;
}
function ce(t) {
  const e = foundry.utils.getProperty(t, "speaker.actor"), r = foundry.utils.getProperty(t, "_source.speaker.actor");
  return z(e) || z(r);
}
function Lt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && e.kind === "chat-targets" && (e.source === null || typeof e.source == "object") && Array.isArray(e.targets);
}
function qt(t) {
  return !!(t && typeof t == "object" && "getFlag" in t);
}
function I(t) {
  return z(t) ? t : null;
}
function z(t) {
  return typeof t == "string" && t.length > 0;
}
function jt() {
  const t = (e, r) => {
    Wt(e, r);
  };
  Hooks.on("renderChatMessageHTML", t);
}
function Wt(t, e) {
  const r = Vt(t);
  if (!r || r.targets.length === 0) return;
  const a = Bt(e);
  if (!a || a.querySelector(`.${u}-chat-enrichment`)) return;
  (a.querySelector(".message-content") ?? a).append(Gt(r));
}
function Gt(t) {
  const e = document.createElement("section");
  e.classList.add(`${u}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", e.append(r), t.source && e.append(me("Origem", t.source.name)), e.append(me("Alvo", t.targets.map((a) => a.name).join(", "))), e;
}
function me(t, e) {
  const r = document.createElement("p");
  r.classList.add(`${u}-chat-enrichment__row`);
  const a = document.createElement("span");
  a.textContent = `${t}: `;
  const o = document.createElement("span");
  return o.textContent = e, r.append(a, o), r;
}
function Bt(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function zt() {
  Hooks.on("preCreateChatMessage", (t, e, r, a) => {
    if (!Kt(a) || !Yt(t) || le(t) || le(e)) return;
    const o = _t();
    if (o.length === 0 || !ce(t) && !ce(e)) return;
    const n = Me();
    t.updateSource({
      [Ht()]: Mt(o, n)
    }), s.info("Targets capturados para ChatMessage.", { source: n, targets: o });
  });
}
function Kt(t) {
  const e = game.user?.id;
  return !e || typeof t != "string" ? !0 : t === e;
}
function Yt(t) {
  return !!(t && typeof t == "object" && "updateSource" in t);
}
const v = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Ve = {
  PV: "system.attributes.hp"
}, K = {
  PV: [v.PV, Ve.PV],
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
class Qt {
  getResource(e, r) {
    const a = de(e, r);
    if (!a.ok)
      return l(a.error);
    const o = a.value, n = `${o}.value`, i = `${o}.max`, m = foundry.utils.getProperty(e, n), g = foundry.utils.getProperty(e, i), p = ge(e, r, n, m, "valor atual");
    if (p) return l(p);
    const h = ge(e, r, i, g, "valor máximo");
    return h ? l(h) : d({
      value: m,
      max: g
    });
  }
  async updateResourceValue(e, r, a) {
    const o = de(e, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await e.update({ [`${o.value}.value`]: a });
  }
}
function de(t, e) {
  const r = Zt(t.type, e);
  if (r && fe(t, r))
    return d(r);
  const a = K[e].find(
    (o) => fe(t, o)
  );
  return a ? d(a) : l({
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "resource-path-not-found",
    message: Jt(t, e),
    path: K[e].join(" | ")
  });
}
function Zt(t, e) {
  return t === "threat" ? Ve[e] ?? null : t === "agent" ? v[e] : null;
}
function fe(t, e) {
  const r = foundry.utils.getProperty(t, `${e}.value`), a = foundry.utils.getProperty(t, `${e}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof a == "number" && Number.isFinite(a);
}
function Jt(t, e) {
  const r = t.type ?? "unknown", a = K[e].join(", ");
  return `${e} não encontrado no ator ${t.name ?? "sem nome"} (${r}). Paths testados: ${a}.`;
}
function ge(t, e, r, a, o) {
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
class Xt {
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
      const i = Y.ritualItem.circleCandidates;
      return l({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: e,
        paths: [...i]
      });
    }
    const { path: a, value: o } = r, n = xt(o);
    return n ? d(n) : l({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: e,
      path: a,
      value: o
    });
  }
  readCircleFromKnownPaths(e) {
    for (const r of Y.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(e, r);
      if (a != null)
        return { path: r, value: a };
    }
    return null;
  }
}
function xt(t) {
  if (pe(t))
    return t;
  if (typeof t == "string") {
    const e = t.trim();
    if (!/^\d+$/.test(e))
      return null;
    const r = Number(e);
    if (pe(r))
      return r;
  }
  return null;
}
function pe(t) {
  return t === 1 || t === 2 || t === 3 || t === 4;
}
const er = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class tr {
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
    const a = r.value, o = rr(e.ritual, a);
    return o.ok ? o.value ? d(o.value) : d({
      resource: "PE",
      amount: er[a],
      source: "default-by-circle",
      circle: a
    }) : l(o.error);
  }
}
function rr(t, e) {
  const r = t.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : ar(r) ? {
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
function ar(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return (e.resource === "PE" || e.resource === "PD") && typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0;
}
function or(t, e) {
  const r = He(t);
  return {
    source: "ordem-item-roll-wrapper",
    actor: r,
    item: t,
    token: Le(r),
    targets: V(),
    originalResult: e
  };
}
function nr(t) {
  if (!lr(t.item)) return null;
  const e = Q(t.actor) ? t.actor : He(t.item);
  return {
    source: "ordem-item-used-hook",
    actor: e,
    item: t.item,
    token: ir(t.token) ?? Le(e),
    targets: V(),
    message: t.message
  };
}
function He(t) {
  const e = t;
  return Q(e.actor) ? e.actor : Q(t.parent) ? t.parent : null;
}
function Le(t) {
  const e = sr(t) ?? ur(t);
  return e ? qe(e) : null;
}
function ir(t) {
  return Z(t) ? qe(t) : null;
}
function sr(t) {
  if (!t) return null;
  const e = t, r = e.token;
  return Z(r) ? r : (e.getActiveTokens?.() ?? []).find(Z) ?? null;
}
function ur(t) {
  return t ? canvas?.tokens?.controlled?.find((e) => e.actor?.id === t.id) ?? null : null;
}
function qe(t) {
  const e = t.actor ?? null;
  return {
    tokenId: q(t.id),
    actorId: q(e?.id),
    sceneId: q(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function lr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function Q(t) {
  return !!(t && typeof t == "object" && "update" in t && "items" in t);
}
function Z(t) {
  return !!(t && typeof t == "object" && ("actor" in t || "id" in t || "name" in t));
}
function q(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
class cr {
  constructor(e) {
    this.onItemUsed = e;
  }
  onItemUsed;
  id = "ordem-item-roll-wrapper";
  registered = !1;
  register() {
    const e = mr();
    if (!e?.roll) {
      s.warn("Não foi possível registrar fallback de uso de item: CONFIG.Item.documentClass.prototype.roll não encontrado.");
      return;
    }
    if (e.__paranormalToolkitRollWrapped) {
      this.registered = !0;
      return;
    }
    const r = e.roll, a = this;
    e.__paranormalToolkitOriginalRoll = r, e.roll = async function(...n) {
      const i = await r.apply(this, n), m = or(this, i);
      return m && await a.onItemUsed(m), i;
    }, e.__paranormalToolkitRollWrapped = !0, this.registered = !0, s.info("Fallback de uso de item registrado em OrdemItem.roll().");
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
}
function mr() {
  return CONFIG?.Item?.documentClass?.prototype ?? null;
}
class dr {
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
    const r = nr(fr(e));
    if (!r) {
      s.warn("Hook ordemparanormal.itemUsed disparou sem payload de item válido.", e);
      return;
    }
    await this.onItemUsed(r);
  }
}
function fr(t) {
  return t && typeof t == "object" ? t : {};
}
class gr {
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
class pr {
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
    await e.unsetFlag(u, "automation");
  }
  async writeAutomationFlag(e, r) {
    await this.clear(e), await e.setFlag(u, "automation", r);
  }
}
class hr {
  presets = /* @__PURE__ */ new Map();
  register(e) {
    const r = yr(e);
    return r.ok ? this.presets.has(e.id) ? l({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${e.id}.`,
      presetId: e.id
    }) : (this.presets.set(e.id, j(e)), d(e)) : r;
  }
  registerMany(e) {
    const r = [];
    for (const a of e) {
      const o = this.register(a);
      if (!o.ok)
        return o;
      r.push(o.value);
    }
    return d(r);
  }
  get(e) {
    const r = this.presets.get(e);
    return r ? j(r) : null;
  }
  require(e) {
    const r = this.get(e);
    return r ? d(r) : l({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${e}.`,
      presetId: e
    });
  }
  list() {
    return Array.from(this.presets.values()).map(j);
  }
  findForItem(e) {
    return this.list().map((r) => Ar(r, e)).filter((r) => r !== null).sort((r, a) => a.score - r.score || r.preset.id.localeCompare(a.preset.id));
  }
}
function yr(t) {
  return !W(t.id) || !W(t.version) || !W(t.label) ? l({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: t.id
  }) : !t.automation || t.automation.version !== 1 || !Array.isArray(t.automation.steps) ? l({
    reason: "invalid-preset",
    message: `Preset ${t.id} possui definição de automação inválida.`,
    presetId: t.id
  }) : d(t);
}
function Ar(t, e) {
  if (t.matchers.length === 0)
    return null;
  const r = [];
  let a = 0;
  if (t.itemTypes.length > 0) {
    if (!t.itemTypes.includes(e.type)) return null;
    a += 10, r.push(`itemType:${e.type}`);
  }
  for (const o of t.matchers) {
    const n = wr(o, e);
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
function wr(t, e) {
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
      const r = he(e.name), a = t.names.map(he).includes(r);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Rr(e), a = r !== null && t.circles.includes(r);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function he(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Rr(t) {
  const e = foundry.utils.getProperty(t, "system.circle"), r = typeof e == "string" ? Number(e) : e;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function j(t) {
  return structuredClone(t);
}
function W(t) {
  return typeof t == "string" && t.length > 0;
}
function G(t, e) {
  if (typeof t.amount == "number")
    return !Number.isInteger(t.amount) || t.amount <= 0 ? l({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : d(t.amount);
  if (typeof t.amountFrom == "string") {
    const r = H(t.amountFrom);
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
    }) : d(o);
  }
  return l({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function H(t) {
  return t ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(t)?.groups?.rollId ?? null : null;
}
async function kr(t, e, r) {
  if (!ye(t.id) || !ye(t.formula))
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
    const m = {
      ...r.rollRequests[t.id] ?? je(t, e),
      total: n,
      roll: o
    };
    return r.rolls[t.id] = m, d(m);
  } catch (a) {
    return l({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${t.formula}.`,
      cause: a
    });
  }
}
function je(t, e) {
  const r = t.intent ?? Pr(t.id);
  return {
    id: t.id,
    formula: t.formula,
    intent: r,
    damageType: t.damageType,
    sourceStepIndex: e
  };
}
function Pr(t) {
  const e = t.toLowerCase();
  return e.includes("damage") || e.includes("dano") ? "damage" : e.includes("healing") || e.includes("heal") || e.includes("cura") ? "healing" : e.includes("attack") || e.includes("ataque") ? "attack" : e.includes("resistance") || e.includes("resistencia") || e.includes("resistência") ? "resistance" : "generic";
}
function ye(t) {
  return typeof t == "string" && t.length > 0;
}
async function Ae(t, e, r, a, o) {
  switch (a) {
    case "spend":
      return r !== "PE" && r !== "PD" ? M(e, r, a, o) : t.spend(e, r, o);
    case "damage":
      return r !== "PV" && r !== "SAN" ? M(e, r, a, o) : t.damage(e, r, o);
    case "heal":
      return r !== "PV" ? M(e, r, a, o) : t.heal(e, r, o);
    case "recover":
      return r !== "SAN" ? M(e, r, a, o) : t.recover(e, r, o);
  }
}
function M(t, e, r, a) {
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
function $r(t) {
  const { step: e, context: r, transaction: a, stepIndex: o, lifecycle: n } = t;
  if (e.operation === "damage") {
    const i = Tr(e, r, a, o);
    r.damageInstances.push(i), n.emit("afterDamageResolution", r, {
      stepIndex: o,
      step: e,
      damage: i,
      resourceTransaction: a,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount,
        damageType: i.damageType
      }
    }), n.emit("afterApplyDamage", r, {
      stepIndex: o,
      step: e,
      damage: i,
      resourceTransaction: a,
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
    const i = br(e, r, a, o);
    r.healingInstances.push(i), n.emit("afterApplyHealing", r, {
      stepIndex: o,
      step: e,
      healing: i,
      resourceTransaction: a,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount
      }
    });
  }
}
function Tr(t, e, r, a) {
  const o = H(t.amountFrom), n = o ? e.rolls[o] : void 0;
  return {
    id: We(e.id, "damage", a, e.damageInstances.length),
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
function br(t, e, r, a) {
  const o = H(t.amountFrom);
  return {
    id: We(e.id, "healing", a, e.healingInstances.length),
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
function We(t, e, r, a) {
  return `${t}.${e}.${r}.${a}`;
}
class Sr {
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
    return d({ definition: e, context: r });
  }
  async runStep(e, r, a) {
    switch (e.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(e, r, a);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(e, r, a);
      default:
        return this.runGenericStepWithLifecycle(e, r, a);
    }
  }
  async runGenericStepWithLifecycle(e, r, a) {
    const o = Ir(e);
    for (const i of o.before)
      this.lifecycle.emit(i, r, { stepIndex: a, step: e });
    const n = await this.executeStep(e, r, a);
    if (!n.ok)
      return n;
    for (const i of o.after)
      this.lifecycle.emit(i, r, { stepIndex: a, step: e });
    return d(void 0);
  }
  async executeStep(e, r, a) {
    switch (e.type) {
      case "spendResource":
        return this.runSpendResourceStep(e, r, a);
      case "spendRitualCost":
        return this.runSpendRitualCostStep(e, r, a);
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
  async runSpendResourceStep(e, r, a) {
    const o = G(e, r);
    if (!o.ok)
      return l({ ...o.error, stepIndex: a, step: e, context: r });
    const n = await this.resources.spend(r.sourceActor, e.resource, o.value), i = this.handleResourceOperationResult(n, r, a, e);
    return i.ok ? d(void 0) : i;
  }
  async runSpendRitualCostStep(e, r, a) {
    const o = this.ritualCosts.getCost({
      actor: r.sourceActor,
      ritual: r.item
    });
    if (!o.ok)
      return l({
        reason: "ritual-cost-failed",
        message: o.error.message,
        stepIndex: a,
        step: e,
        context: r,
        cause: o.error
      });
    const n = o.value;
    r.ritualCosts.push({
      ...n,
      itemId: r.item.id ?? null,
      itemName: r.item.name ?? "Ritual sem nome"
    });
    const i = await this.resources.spend(r.sourceActor, n.resource, n.amount), m = this.handleResourceOperationResult(i, r, a, e);
    return m.ok ? d(void 0) : m;
  }
  async runRollFormulaStepWithLifecycle(e, r, a) {
    const o = je(e, a);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: a, step: e, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, a, e), this.lifecycle.emit("roll", r, { stepIndex: a, step: e, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, a, e);
    const n = await this.runRollFormulaStep(e, r, a);
    if (!n.ok)
      return n;
    const i = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, a, e, i), this.lifecycle.emit("afterRoll", r, { stepIndex: a, step: e, rollRequest: o, rollResult: i }), d(void 0);
  }
  async runRollFormulaStep(e, r, a) {
    const o = await kr(e, a, r);
    return o.ok ? d(void 0) : l({ ...o.error, stepIndex: a, step: e, context: r });
  }
  async runModifyResourceStepWithLifecycle(e, r, a) {
    const o = G(e, r);
    if (!o.ok)
      return l({ ...o.error, stepIndex: a, step: e, context: r });
    const n = this.createApplyMetadata(e, r, o.value);
    this.lifecycle.emit("beforeApply", r, { stepIndex: a, step: e, metadata: n }), this.emitSpecificApplyPhase("before", e, r, a, n), this.emitDamageResolutionPhase("before", e, r, a, n), this.emitDamageResolutionPhase("resolve", e, r, a, n), this.lifecycle.emit("apply", r, { stepIndex: a, step: e, metadata: n }), this.emitSpecificApplyPhase("apply", e, r, a, n);
    const i = this.resolveActors(e.actor, r);
    if (i.length === 0)
      return l({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: e,
        context: r
      });
    for (const m of i) {
      const g = await Ae(this.resources, m, e.resource, e.operation, o.value), p = this.handleResourceOperationResult(g, r, a, e);
      if (!p.ok)
        return p;
      $r({
        step: e,
        context: r,
        transaction: p.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return this.lifecycle.emit("afterApply", r, { stepIndex: a, step: e, metadata: n }), d(void 0);
  }
  async runModifyResourceStep(e, r, a) {
    const o = G(e, r);
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
    for (const i of n) {
      const m = await Ae(this.resources, i, e.resource, e.operation, o.value), g = this.handleResourceOperationResult(m, r, a, e);
      if (!g.ok)
        return g;
    }
    return d(void 0);
  }
  async runChatCardStep(e, r, a) {
    try {
      return await this.messages.createWorkflowSummaryMessage(r, e), d(void 0);
    } catch (o) {
      return l({
        reason: "chat-card-failed",
        message: "Workflow executado, mas falhou ao criar chat card de resumo.",
        stepIndex: a,
        step: e,
        context: r,
        cause: o
      });
    }
  }
  handleResourceOperationResult(e, r, a, o) {
    return e.ok ? (r.resourceTransactions.push(e.value), d(e.value)) : l({
      reason: "resource-operation-failed",
      message: e.error.message,
      stepIndex: a,
      step: o,
      context: r,
      cause: e.error
    });
  }
  emitSpecificRollPhase(e, r, a, o, n, i) {
    const m = Cr(e, r.intent);
    m && this.lifecycle.emit(m, a, {
      stepIndex: o,
      step: n,
      rollRequest: r,
      rollResult: i
    });
  }
  createApplyMetadata(e, r, a) {
    const o = H(e.amountFrom), n = o ? r.rolls[o] : void 0;
    return {
      actorSelector: e.actor,
      resource: e.resource,
      operation: e.operation,
      amount: a,
      amountFrom: e.amountFrom,
      rollId: o,
      rollIntent: n?.intent,
      damageType: n?.damageType
    };
  }
  emitSpecificApplyPhase(e, r, a, o, n) {
    const i = vr(e, r.operation);
    i && this.lifecycle.emit(i, a, {
      stepIndex: o,
      step: r,
      metadata: n
    });
  }
  emitDamageResolutionPhase(e, r, a, o, n) {
    r.operation === "damage" && this.lifecycle.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", a, {
      stepIndex: o,
      step: r,
      metadata: n
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
function Ir(t) {
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
function Cr(t, e) {
  return e === "damage" ? t === "before" ? "beforeDamageRoll" : t === "roll" ? "damageRoll" : "afterDamageRoll" : e === "healing" ? t === "before" ? "beforeHealingRoll" : t === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
function vr(t, e) {
  return e === "damage" ? t === "before" ? "beforeApplyDamage" : t === "apply" ? "applyDamage" : "afterApplyDamage" : e === "heal" ? t === "before" ? "beforeApplyHealing" : t === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
class Nr {
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
    const i = n.value, m = this.calculate(a, i, o);
    if (!m.ok)
      return l({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: m.error.reason,
        message: m.error.message,
        requestedAmount: o,
        current: i.value,
        required: o
      });
    const { afterValue: g, appliedAmount: p } = m.value, h = {
      value: g,
      max: i.max
    };
    try {
      g !== i.value && await this.adapter.updateResourceValue(e, r, g);
    } catch (k) {
      return l({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: "update-failed",
        message: `Falha ao atualizar ${r} no ator.`,
        requestedAmount: o,
        current: i.value,
        required: o,
        cause: k
      });
    }
    return d({
      actor: e,
      actorId: e.id ?? null,
      actorName: e.name ?? "Ator sem nome",
      resource: r,
      operation: a,
      requestedAmount: o,
      appliedAmount: p,
      before: i,
      after: h
    });
  }
  calculate(e, r, a) {
    switch (e) {
      case "spend":
        return r.value < a ? l({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${r.value}; custo: ${a}.`
        }) : d({
          afterValue: r.value - a,
          appliedAmount: a
        });
      case "damage": {
        const o = Math.max(0, r.value - a);
        return d({
          afterValue: o,
          appliedAmount: r.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(r.max, r.value + a);
        return d({
          afterValue: o,
          appliedAmount: o - r.value
        });
      }
    }
  }
}
function Fr(t) {
  return {
    id: Dr(),
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
function Dr() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Er {
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
    return D(this.lastContext);
  }
  async runAutomation(e, r) {
    const a = Fr(r);
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
class Or {
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
    }), Hooks.callAll(`${u}.workflow.${e}`, o), Hooks.callAll(`${u}.workflow.phase`, o), o;
  }
}
class Ur {
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
    const r = B();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: e.speaker,
      content: e.content,
      whisper: _r(),
      flags: {
        ...e.flags,
        [u]: {
          ...Mr(e.flags),
          debugOutput: !0
        }
      }
    }), r.console && e.data !== void 0 && s.info("Debug chat criado.", e.data), !0);
  }
  emit(e, r) {
    const a = B();
    if (!a.enabled)
      return;
    const o = r.notification ?? we(r);
    a.console && this.emitConsole(e, r), a.ui && this.emitUi(e, o);
  }
  emitConsole(e, r) {
    const a = we(r);
    switch (e) {
      case "info":
        s.info(a, r.data ?? "");
        return;
      case "warn":
        s.warn(a, r.data ?? "");
        return;
      case "error":
        s.error(a, r.data ?? "");
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
function we(t) {
  return t.message ? `${t.title}: ${t.message}` : t.title;
}
function _r() {
  const t = game.users?.filter((e) => e.isGM === !0 && e.id).map((e) => e.id) ?? [];
  return t.length > 0 ? t : game.user?.id ? [game.user.id] : [];
}
function Mr(t) {
  const e = t?.[u];
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const Re = 1e3;
class Vr {
  constructor(e, r) {
    this.workflow = e, this.debugOutput = r;
  }
  workflow;
  debugOutput;
  strategies = [];
  recentExecutionKeys = /* @__PURE__ */ new Map();
  lastAttempt = null;
  addStrategy(e) {
    this.strategies.push(e);
  }
  registerStrategies() {
    for (const e of this.strategies)
      e.register();
  }
  status() {
    return {
      settings: ne(),
      strategies: this.strategies.map((e) => e.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null
    };
  }
  async handleItemUsed(e) {
    if (!ne().autoRun) {
      this.setAttempt(e, "skipped", "auto-run-disabled");
      return;
    }
    const a = J(e.item);
    if (!a.ok) {
      const n = a.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(e, n, a.error.reason), a.error.reason === "invalid-automation" && this.debugOutput.warn({
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
        data: ke(e, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(e)) {
      this.setAttempt(e, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(e), this.setAttempt(e, "running");
    const o = await this.workflow.runAutomation(a.value, {
      sourceActor: e.actor,
      sourceToken: e.token,
      item: e.item,
      targets: e.targets,
      flags: {
        itemUse: {
          source: e.source
        }
      }
    });
    if (!o.ok) {
      this.setAttempt(e, "failed", o.error.reason), this.handleAutomationFailure(o.error);
      return;
    }
    this.setAttempt(e, "completed"), s.info("Automação executada por uso normal de item.", D(o.value.context));
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
    const r = Date.now(), a = Pe(e);
    for (const [n, i] of this.recentExecutionKeys.entries())
      r - i > Re && this.recentExecutionKeys.delete(n);
    const o = this.recentExecutionKeys.get(a);
    return o !== void 0 && r - o <= Re;
  }
  markExecution(e) {
    this.recentExecutionKeys.set(Pe(e), Date.now());
  }
  setAttempt(e, r, a) {
    this.lastAttempt = ke(e, r, a);
  }
}
function ke(t, e, r) {
  return {
    source: t.source,
    status: e,
    reason: r,
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
function Pe(t) {
  const e = t.actor?.id ?? "no-actor", r = t.item.uuid ?? t.item.id ?? t.item.name ?? "unknown-item";
  return `${e}:${r}`;
}
class Hr {
  constructor(e) {
    this.debugOutput = e;
  }
  debugOutput;
  async createResourceOperationMessage(e) {
    const r = this.createResourceOperationContent(e.transaction), a = x(e.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: e.transaction.actor }),
      content: r,
      data: a,
      flags: {
        [u]: {
          resourceTransaction: a
        }
      }
    });
  }
  async createWorkflowSummaryMessage(e, r) {
    const a = this.createWorkflowSummaryContent(e, r), o = D(e);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: e.sourceActor }),
      content: a,
      data: o,
      flags: {
        [u]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(e) {
    const r = f(e.actorName), a = f(e.resource), o = f($e(e)), n = f(qr(e));
    return `
      <section class="${u}-card ${u}-resource-card">
        <header class="${u}-card__header">
          <strong>${o}</strong>
          <span>${r}</span>
        </header>
        <div class="${u}-card__body">
          <p><strong>${n}:</strong> ${e.appliedAmount}</p>
          <p><strong>${a}:</strong> ${e.before.value}/${e.before.max} &rarr; ${e.after.value}/${e.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(e, r) {
    const a = f(r.title ?? "Automação"), o = r.message ? `<p>${f(r.message)}</p>` : "", n = f(e.sourceToken?.name ?? e.sourceActor.name ?? "Origem sem nome"), i = f(e.item.name ?? "Item sem nome"), m = e.targets.length > 0 ? e.targets.map((c) => f(c.name)).join(", ") : "Nenhum", g = Object.values(e.rolls).map(
      (c) => `<li><strong>${f(c.id)}:</strong> ${f(c.formula)} = ${c.total} <em>(${f(Lr(c.intent))})</em>${c.damageType ? ` — ${f(c.damageType)}` : ""}</li>`
    ), p = e.ritualCosts.map(
      (c) => `<li><strong>${f(c.itemName)}:</strong> ${c.circle}º círculo — ${c.amount} ${f(c.resource)} (${f(jr(c.source))})</li>`
    ), h = e.damageInstances.map(
      (c) => `<li><strong>${f(c.targetActorName)}:</strong> bruto ${c.rawAmount}${c.damageType ? ` ${f(c.damageType)}` : ""} &rarr; final ${c.finalAmount} &rarr; aplicado ${c.appliedAmount}</li>`
    ), k = e.healingInstances.map(
      (c) => `<li><strong>${f(c.targetActorName)}:</strong> bruto ${c.rawAmount} &rarr; final ${c.finalAmount} &rarr; aplicado ${c.appliedAmount}</li>`
    ), C = e.resourceTransactions.map(
      (c) => `<li><strong>${f(c.actorName)}:</strong> ${f($e(c))} — ${c.before.value}/${c.before.max} &rarr; ${c.after.value}/${c.after.max}</li>`
    ), w = e.phases.map((c) => f(c)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${a}</strong>
          <span>${i}</span>
        </header>
        <div class="${u}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${n}</p>
          <p><strong>Alvo:</strong> ${m}</p>
          ${p.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${p.join("")}</ul>` : ""}
          ${g.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${g.join("")}</ul>` : ""}
          ${h.length > 0 ? `<p><strong>Dano:</strong></p><ul>${h.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p><strong>Cura:</strong></p><ul>${k.join("")}</ul>` : ""}
          ${C.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${C.join("")}</ul>` : ""}
          ${w.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${w}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Lr(t) {
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
function $e(t) {
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
function qr(t) {
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
function jr(t) {
  switch (t) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return t;
  }
}
function f(t) {
  return t.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function Wr() {
  const t = new Qt(), e = new Nr(t), r = new Xt(), a = new tr(r), o = new gr(t), n = new hr(), i = n.registerMany(At());
  if (!i.ok)
    throw new Error(i.error.message);
  const m = new pr(), g = new Ur(), p = new Hr(g), h = new Or(), k = new Sr(e, a, p, h), C = new Er(k, h), w = new Vr(C, g);
  return w.addStrategy(new dr((c) => w.handleItemUsed(c))), w.addStrategy(new cr((c) => w.handleItemUsed(c))), {
    ordem: o,
    resourceAdapter: t,
    ritualAdapter: r,
    ritualCosts: a,
    resources: e,
    automationRegistry: n,
    automationBinder: m,
    debugOutput: g,
    chatMessages: p,
    workflowHooks: h,
    automation: k,
    workflow: C,
    itemUseIntegration: w
  };
}
let N = null;
Hooks.once("init", () => {
  ht(), It(), s.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!ue.isSupportedSystem()) {
    s.warn(
      `Sistema não suportado: ${ue.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  N = Wr(), N.itemUseIntegration.registerStrategies(), Ut(N), zt(), jt(), s.info("Inicializado para o sistema Ordem Paranormal."), s.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Ge} inicializado.`);
});
function Gr() {
  if (!N)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return N;
}
export {
  Gr as getToolkitServices
};
//# sourceMappingURL=main.js.map
