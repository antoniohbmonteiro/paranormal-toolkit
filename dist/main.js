const u = "paranormal-toolkit", Et = "Paranormal Toolkit", vt = "ordemparanormal";
class U {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function me(t) {
  return {
    id: t.id,
    version: t.version,
    label: t.label,
    description: t.description,
    category: t.category,
    itemTypes: [...t.itemTypes],
    matchers: t.matchers.map((e) => ({ ...e })),
    hasItemPatch: t.itemPatch !== void 0
  };
}
class i {
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
function de(t) {
  const e = t.getFlag(u, "automation");
  return e == null ? l({
    reason: "missing-automation",
    message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
  }) : et(e) ? d(e.definition) : l({
    reason: "invalid-automation",
    message: `Automação do item ${t.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: e
  });
}
function Dt(t) {
  return et(t.getFlag(u, "automation"));
}
function et(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.schemaVersion === 1 && Ot(e.source) && Nt(e.definition);
}
function Nt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && A(e.label) && Array.isArray(e.steps) && e.steps.every(_t);
}
function Ot(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.type === "preset" ? A(e.presetId) && A(e.presetVersion) && A(e.appliedAt) : e.type === "manual" ? A(e.label) && A(e.appliedAt) : !1;
}
function _t(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  switch (e.type) {
    case "spendResource":
      return Mt(e);
    case "spendRitualCost":
      return Ft(e);
    case "rollFormula":
      return Lt(e);
    case "modifyResource":
      return Ut(e);
    case "chatCard":
      return Ht(e);
    default:
      return !1;
  }
}
function Mt(t) {
  const e = t;
  return e.type === "spendResource" && e.actor === "self" && (e.resource === "PE" || e.resource === "PD") && tt(e);
}
function Ft(t) {
  return t.type === "spendRitualCost";
}
function Lt(t) {
  const e = t;
  return e.type === "rollFormula" && A(e.id) && A(e.formula) && (e.intent === void 0 || Bt(e.intent)) && (e.damageType === void 0 || A(e.damageType));
}
function Ut(t) {
  const e = t;
  return e.type === "modifyResource" && qt(e.actor) && Vt(e.resource) && jt(e.operation) && tt(e);
}
function Ht(t) {
  const e = t;
  return e.type === "chatCard" && (e.title === void 0 || typeof e.title == "string") && (e.message === void 0 || typeof e.message == "string");
}
function tt(t) {
  return typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0 || A(t.amountFrom);
}
function qt(t) {
  return t === "self" || t === "target";
}
function Vt(t) {
  return t === "PV" || t === "SAN" || t === "PE" || t === "PD";
}
function jt(t) {
  return t === "spend" || t === "damage" || t === "heal" || t === "recover";
}
function Bt(t) {
  return t === "attack" || t === "damage" || t === "healing" || t === "resistance" || t === "skill" || t === "ritual" || t === "generic";
}
function A(t) {
  return typeof t == "string" && t.length > 0;
}
function fe(t) {
  const e = t.items;
  if (Array.isArray(e))
    return e;
  if (e && typeof e == "object") {
    const r = e;
    if (Array.isArray(r.contents))
      return r.contents.filter(Re);
    if (Gt(e))
      return Array.from(e).filter(Re);
  }
  return [];
}
function zt(t) {
  return fe(t)[0] ?? null;
}
function Wt(t) {
  return fe(t).find(Dt) ?? null;
}
function Gt(t) {
  return !!(t && typeof t == "object" && Symbol.iterator in t);
}
function Re(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function rt(t) {
  return fe(t).filter((e) => e.type === "ritual");
}
function at(t) {
  return rt(t)[0] ?? null;
}
function xt(t) {
  return {
    listPresets() {
      const e = t.automationRegistry.list().map(me);
      return i.info("Presets de automação registrados.", e), e;
    },
    findPresetsForFirstRitual() {
      const e = _("Nenhum ator encontrado para buscar presets de ritual.");
      if (!e) return [];
      const r = H(e);
      if (!r) return [];
      const a = t.automationRegistry.findForItem(r).map(Pe);
      return i.info(`Presets encontrados para ${r.name}.`, a), a;
    },
    async applyPresetToFirstRitual(e) {
      const r = _("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const a = H(r);
      if (!a) return;
      const o = t.automationRegistry.require(e);
      if (!o.ok) {
        i.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const n = await J(t, a, o.value);
      i.info(`Preset ${o.value.id} aplicado em ${a.name}.`, { itemPatch: n }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const e = _("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!e) return;
      const r = H(e);
      if (!r) return;
      const a = t.automationRegistry.findForItem(r)[0];
      if (!a) {
        i.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const o = await J(t, r, a.preset);
      i.info(`Melhor preset aplicado em ${r.name}.`, { match: Pe(a), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return we(t);
    },
    async applyBestPresetsToActorRituals() {
      return we(t);
    },
    async clearAutomationFromFirstRitual() {
      const e = _("Nenhum ator encontrado para limpar automação de ritual.");
      if (!e) return;
      const r = H(e);
      r && (await t.automationBinder.clear(r), i.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function we(t) {
  const e = _("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!e) return null;
  const r = rt(e);
  if (r.length === 0)
    return i.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), ke(e);
  const a = ke(e, r.length);
  for (const o of r) {
    const n = t.automationRegistry.findForItem(o)[0];
    if (!n) {
      a.skipped.push({
        itemId: o.id ?? null,
        itemName: o.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await J(t, o, n.preset);
    a.applied.push(Kt(o, n, s));
  }
  return i.info(`Presets aplicados em rituais de ${e.name ?? "ator sem nome"}.`, a), Yt(a), a;
}
async function J(t, e, r) {
  return await t.automationBinder.applyPreset(e, r), t.itemPatches.applyPresetItemPatch(e, r);
}
function Kt(t, e, r) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Ritual sem nome",
    preset: me(e.preset),
    score: e.score,
    reasons: [...e.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function ke(t, e = 0) {
  return {
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    total: e,
    applied: [],
    skipped: []
  };
}
function Yt(t) {
  const e = t.skipped.length > 0 ? `, ${t.skipped.length} sem preset compatível` : "", r = t.applied.some((a) => a.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${t.applied.length}/${t.total} presets aplicados em rituais${r}${e}.`
  );
}
function Pe(t) {
  return {
    preset: me(t.preset),
    score: t.score,
    reasons: [...t.reasons]
  };
}
function _(t) {
  const e = U.getSelectedActor();
  return e || (i.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function H(t) {
  const e = at(t);
  return e || (i.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function I(t) {
  return t ? {
    id: t.id,
    source: {
      ...Qt(t.sourceActor),
      token: t.sourceToken
    },
    item: Xt(t.item),
    targets: t.targets.map(Zt),
    phases: [...t.phases],
    lifecycleEvents: t.lifecycleEvents.map((e) => ({ ...e })),
    rollRequests: Te(t.rollRequests, ot),
    rolls: Te(t.rolls, Jt),
    ritualCosts: t.ritualCosts.map((e) => ({ ...e })),
    damageInstances: t.damageInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    healingInstances: t.healingInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    resourceTransactions: t.resourceTransactions.map(pe),
    flagKeys: Object.keys(t.flags)
  } : null;
}
function pe(t) {
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
function Qt(t) {
  return {
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown"
  };
}
function Xt(t) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Item sem nome",
    itemType: t.type ?? "unknown",
    itemUuid: t.uuid ?? null
  };
}
function Zt(t) {
  return {
    tokenId: t.tokenId,
    actorId: t.actorId,
    sceneId: t.sceneId,
    name: t.name,
    actorName: t.actor?.name,
    actorType: t.actor?.type
  };
}
function ot(t) {
  return {
    id: t.id,
    formula: t.formula,
    intent: t.intent,
    damageType: t.damageType,
    sourceStepIndex: t.sourceStepIndex
  };
}
function Jt(t) {
  return {
    ...ot(t),
    total: t.total
  };
}
function Te(t, e) {
  return Object.fromEntries(Object.entries(t).map(([r, a]) => [r, e(a)]));
}
function er(t) {
  return {
    getSelected() {
      return U.getSelectedActor();
    },
    logResources() {
      const e = T(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!e) return;
      const r = t.ordem.getActorSnapshot(e);
      i.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && i.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(e) {
      await S(
        t,
        "Gasto de PE",
        T("Nenhum ator encontrado para gastar PE."),
        (r) => t.resources.spend(r, "PE", e)
      );
    },
    async spendPD(e) {
      await S(
        t,
        "Gasto de PD",
        T("Nenhum ator encontrado para gastar PD."),
        (r) => t.resources.spend(r, "PD", e)
      );
    },
    async damagePV(e) {
      await S(
        t,
        "Dano em PV",
        T("Nenhum ator encontrado para causar dano em PV."),
        (r) => t.resources.damage(r, "PV", e)
      );
    },
    async healPV(e) {
      await S(
        t,
        "Cura de PV",
        T("Nenhum ator encontrado para curar PV."),
        (r) => t.resources.heal(r, "PV", e)
      );
    },
    async damageSAN(e) {
      await S(
        t,
        "Dano em SAN",
        T("Nenhum ator encontrado para causar dano em SAN."),
        (r) => t.resources.damage(r, "SAN", e)
      );
    },
    async recoverSAN(e) {
      await S(
        t,
        "Recuperação de SAN",
        T("Nenhum ator encontrado para recuperar SAN."),
        (r) => t.resources.recover(r, "SAN", e)
      );
    }
  };
}
async function S(t, e, r, a) {
  if (!r) return;
  const o = await a(r);
  if (!o.ok) {
    tr(o.error);
    return;
  }
  const n = o.value;
  try {
    await t.chatMessages.createResourceOperationMessage({ transaction: n });
  } catch (s) {
    i.error(`${e} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  i.info(`${e} realizado:`, pe(n));
}
function T(t) {
  const e = U.getSelectedActor();
  return e || (i.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function tr(t) {
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
const R = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function rr() {
  q(R.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), q(R.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), q(R.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), q(R.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function ee() {
  return {
    enabled: V(R.enabled),
    console: V(R.console),
    ui: V(R.ui),
    chat: V(R.chat)
  };
}
async function k(t, e) {
  await game.settings.set(u, R[t], e);
}
function q(t, e) {
  game.settings.register(u, t, {
    name: e.name,
    hint: e.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: e.default
  });
}
function V(t) {
  return game.settings.get(u, t) === !0;
}
function ar() {
  return {
    status() {
      return ee();
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
const nt = "ritual.costOnly", st = "ritual.simpleHealing", or = "ritual.eletrocussao", it = "ritual.simpleDamage", ut = "generic.simpleHealing", ct = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function nr() {
  return [
    sr(),
    ir(),
    ur(),
    cr(),
    lr()
  ];
}
function sr() {
  return {
    id: nt,
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
function ir() {
  return {
    id: st,
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
    automation: lt(),
    itemPatch: dr()
  };
}
function ur() {
  return {
    id: or,
    version: "1.0.0",
    label: "Eletrocussão",
    description: "Preset inicial de dano de energia. Gasta o custo do ritual, rola 1d8 e prepara ação assistida para aplicar dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["eletrocussao", "eletrocucao"]
      }
    ],
    automation: mr(),
    itemPatch: fr()
  };
}
function cr() {
  return {
    id: it,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: ge()
  };
}
function lr() {
  return {
    id: ut,
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
function lt(t = "2d8+2") {
  return mt(
    {
      version: 1,
      label: "Cicatrização",
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
    t
  );
}
function mr(t = "1d8") {
  return ge(t, {
    label: "Eletrocussão",
    title: "Eletrocussão",
    damageType: "energia",
    message: "Gasta o custo do ritual, rola dano de energia e prepara aplicação de dano em PV do alvo. Resistência deve ser resolvida manualmente por enquanto."
  });
}
function ge(t = "1d8", e = {}) {
  const r = e.label ?? "Ritual de dano simples", a = e.title ?? "Ritual de dano simples", o = e.damageType ?? "generic", n = e.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return mt(
    {
      version: 1,
      label: r,
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
          title: a,
          message: n
        }
      ]
    },
    "damage",
    t
  );
}
function dr() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: ct,
    ritual: {
      circle: 1,
      element: "death",
      execution: "default",
      range: "touch",
      target: "creatures",
      targetQuantity: "1",
      duration: "instantaneous",
      resistanceSkill: "",
      resistance: ""
    }
  };
}
function fr() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: ct,
    ritual: {
      circle: 1,
      element: "energy",
      execution: "default",
      range: "medium",
      target: "creatures",
      targetQuantity: "1",
      duration: "instantaneous",
      resistanceSkill: "resilience",
      resistance: "reducesByHalf"
    }
  };
}
function mt(t, e, r) {
  return {
    ...t,
    steps: t.steps.map((a) => a.type !== "rollFormula" || a.id !== e ? a : {
      ...a,
      formula: r
    })
  };
}
function he() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: E(e.id),
    actorId: E(e.actor?.id),
    sceneId: E(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  }));
}
function dt() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null;
  return {
    tokenId: E(t.id),
    actorId: E(e?.id),
    sceneId: E(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function E(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function pr(t) {
  return {
    logFirstRitualCost() {
      const e = $("Nenhum ator encontrado para consultar custo de ritual.");
      if (!e) return;
      const r = C(e);
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
      const o = C(a);
      if (o) {
        if (!yr(e, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(u, "ritual.cost", {
          resource: r,
          amount: e
        }), i.info(`Custo customizado aplicado em ${o.name}.`, { resource: r, amount: e }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${e} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const e = $("Nenhum ator encontrado para limpar custo customizado.");
      if (!e) return;
      const r = C(e);
      r && (await r.unsetFlag(u, "ritual.cost"), i.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const e = $("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!e) return;
      const r = C(e);
      if (!r) return;
      const a = t.automationRegistry.require(nt);
      if (!a.ok) {
        i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(r, a.value), i.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(e = "2d8+2") {
      const r = $("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const a = C(r);
      if (!a) return;
      if (!$e(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = t.automationRegistry.require(st);
      if (!o.ok) {
        i.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(a, o.value, {
        definition: lt(e)
      }), i.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(e = "1d8") {
      const r = $("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const a = C(r);
      if (!a) return;
      if (!$e(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = t.automationRegistry.require(it);
      if (!o.ok) {
        i.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(a, o.value, {
        definition: ge(e)
      }), i.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const e = $("Nenhum ator encontrado para executar automação de ritual.");
      if (!e) return;
      const r = C(e);
      r && await gr(t, e, r);
    }
  };
}
async function gr(t, e, r) {
  const a = de(r);
  if (!a.ok) {
    i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(a.value, {
    sourceActor: e,
    sourceToken: dt(),
    item: r,
    targets: he()
  });
  if (!o.ok) {
    hr(o.error);
    return;
  }
  i.info("Automação de ritual executada com sucesso.", I(o.value.context));
}
function hr(t) {
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
  const e = U.getSelectedActor();
  return e || (i.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function C(t) {
  const e = at(t);
  return e || (i.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function yr(t, e) {
  return Number.isInteger(t) && t > 0 && (e === "PE" || e === "PD");
}
function $e(t) {
  return typeof t == "string" && t.trim().length > 0;
}
const Ar = ["disabled", "ask", "automatic"], Rr = ["buttons", "confirm"], ft = "ask";
function wr(t) {
  return typeof t == "string" && Ar.includes(t);
}
function kr(t) {
  return typeof t == "string" && Rr.includes(t);
}
function Pr(t) {
  return wr(t) ? t : kr(t) ? "ask" : ft;
}
const B = {
  executionMode: "itemUse.executionMode",
  autoRun: "itemUse.autoRun.enabled"
};
function Tr() {
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
    default: ft
  }), game.settings.register(u, B.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Ce() {
  return {
    executionMode: Pr(game.settings.get(u, B.executionMode))
  };
}
async function b(t) {
  await game.settings.set(u, B.executionMode, t);
}
function $r(t) {
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
const Cr = [
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
function br(t) {
  return {
    phases() {
      return Cr;
    },
    lastContext() {
      return t.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const e = G("Nenhum ator encontrado para executar automação.");
      if (!e) return;
      const r = Wt(e);
      if (!r) {
        i.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await be(t, e, r);
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
      if (!Er(r)) {
        i.warn(`UUID não resolveu para um Item: ${e}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = Sr(r) ?? G("Nenhum ator encontrado para executar automação do item.");
      a && await be(t, a, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const e = G("Nenhum ator encontrado para configurar automação de teste.");
      if (!e) return;
      const r = zt(e);
      if (!r) {
        i.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = t.automationRegistry.require(ut);
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
async function be(t, e, r) {
  const a = de(r);
  if (!a.ok) {
    i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(a.value, {
    sourceActor: e,
    sourceToken: dt(),
    item: r,
    targets: he()
  });
  if (!o.ok) {
    Ir(o.error);
    return;
  }
  i.info("Automação executada com sucesso.", I(o.value.context));
}
function Ir(t) {
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
  const e = U.getSelectedActor();
  return e || (i.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Sr(t) {
  const e = t.parent;
  return e instanceof Actor ? e : null;
}
function Er(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function vr(t) {
  const e = er(t), r = xt(t), a = pr(t), o = br(t), n = ar(), s = $r(t);
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
    async spendSelectedActorPE(c) {
      await e.spendPE(c);
    }
  };
}
function Dr(t) {
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
    debug: vr(t)
  }, r = globalThis;
  return r[u] = e, r.ParanormalToolkit = e, e;
}
class Ie {
  static isSupportedSystem() {
    return game.system.id === vt;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Nr() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: v(e.id),
    actorId: v(e.actor?.id),
    sceneId: v(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome"
  }));
}
function pt() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null, r = t.name ?? e?.name ?? "Origem sem nome";
  return {
    tokenId: v(t.id),
    actorId: v(e?.id),
    sceneId: v(t.scene?.id),
    name: r
  };
}
function Or(t, e = pt()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: e,
    targets: t
  };
}
function _r(t) {
  if (!Lr(t)) return null;
  const e = t.getFlag(u, "workflow");
  return Fr(e) ? e : null;
}
function Mr() {
  return `flags.${u}.workflow`;
}
function Se(t) {
  if (!t || typeof t != "object") return !1;
  const e = foundry.utils.getProperty(t, `flags.${u}`), r = foundry.utils.getProperty(t, `_source.flags.${u}`);
  return e !== void 0 || r !== void 0;
}
function Ee(t) {
  const e = foundry.utils.getProperty(t, "speaker.actor"), r = foundry.utils.getProperty(t, "_source.speaker.actor");
  return te(e) || te(r);
}
function Fr(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && e.kind === "chat-targets" && (e.source === null || typeof e.source == "object") && Array.isArray(e.targets);
}
function Lr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t);
}
function v(t) {
  return te(t) ? t : null;
}
function te(t) {
  return typeof t == "string" && t.length > 0;
}
function Ur() {
  const t = (e, r) => {
    Hr(e, r);
  };
  Hooks.on("renderChatMessageHTML", t);
}
function Hr(t, e) {
  const r = _r(t);
  if (!r || r.targets.length === 0) return;
  const a = Vr(e);
  if (!a || a.querySelector(`.${u}-chat-enrichment`)) return;
  (a.querySelector(".message-content") ?? a).append(qr(r));
}
function qr(t) {
  const e = document.createElement("section");
  e.classList.add(`${u}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", e.append(r), t.source && e.append(ve("Origem", t.source.name)), e.append(ve("Alvo", t.targets.map((a) => a.name).join(", "))), e;
}
function ve(t, e) {
  const r = document.createElement("p");
  r.classList.add(`${u}-chat-enrichment__row`);
  const a = document.createElement("span");
  a.textContent = `${t}: `;
  const o = document.createElement("span");
  return o.textContent = e, r.append(a, o), r;
}
function Vr(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function jr() {
  Hooks.on("preCreateChatMessage", (t, e, r, a) => {
    if (!Br(a) || !zr(t) || Se(t) || Se(e)) return;
    const o = Nr();
    if (o.length === 0 || !Ee(t) && !Ee(e)) return;
    const n = pt();
    t.updateSource({
      [Mr()]: Or(o, n)
    }), i.info("Targets capturados para ChatMessage.", { source: n, targets: o });
  });
}
function Br(t) {
  const e = game.user?.id;
  return !e || typeof t != "string" ? !0 : t === e;
}
function zr(t) {
  return !!(t && typeof t == "object" && "updateSource" in t);
}
const M = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, gt = {
  PV: "system.attributes.hp"
}, re = {
  PV: [M.PV, gt.PV],
  SAN: [M.SAN],
  PE: [M.PE],
  PD: [M.PD]
}, ae = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Wr {
  getResource(e, r) {
    const a = De(e, r);
    if (!a.ok)
      return l(a.error);
    const o = a.value, n = `${o}.value`, s = `${o}.max`, c = foundry.utils.getProperty(e, n), f = foundry.utils.getProperty(e, s), g = Oe(e, r, n, c, "valor atual");
    if (g) return l(g);
    const h = Oe(e, r, s, f, "valor máximo");
    return h ? l(h) : d({
      value: c,
      max: f
    });
  }
  async updateResourceValue(e, r, a) {
    const o = De(e, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await e.update({ [`${o.value}.value`]: a });
  }
}
function De(t, e) {
  const r = Gr(t.type, e);
  if (r && Ne(t, r))
    return d(r);
  const a = re[e].find(
    (o) => Ne(t, o)
  );
  return a ? d(a) : l({
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "resource-path-not-found",
    message: xr(t, e),
    path: re[e].join(" | ")
  });
}
function Gr(t, e) {
  return t === "threat" ? gt[e] ?? null : t === "agent" ? M[e] : null;
}
function Ne(t, e) {
  const r = foundry.utils.getProperty(t, `${e}.value`), a = foundry.utils.getProperty(t, `${e}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof a == "number" && Number.isFinite(a);
}
function xr(t, e) {
  const r = t.type ?? "unknown", a = re[e].join(", ");
  return `${e} não encontrado no ator ${t.name ?? "sem nome"} (${r}). Paths testados: ${a}.`;
}
function Oe(t, e, r, a, o) {
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
class Kr {
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
      const s = ae.ritualItem.circleCandidates;
      return l({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: e,
        paths: [...s]
      });
    }
    const { path: a, value: o } = r, n = Yr(o);
    return n ? d(n) : l({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: e,
      path: a,
      value: o
    });
  }
  readCircleFromKnownPaths(e) {
    for (const r of ae.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(e, r);
      if (a != null)
        return { path: r, value: a };
    }
    return null;
  }
}
function Yr(t) {
  if (_e(t))
    return t;
  if (typeof t == "string") {
    const e = t.trim();
    if (!/^\d+$/.test(e))
      return null;
    const r = Number(e);
    if (_e(r))
      return r;
  }
  return null;
}
function _e(t) {
  return t === 1 || t === 2 || t === 3 || t === 4;
}
const Qr = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Xr {
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
    const a = r.value, o = Zr(e.ritual, a);
    return o.ok ? o.value ? d(o.value) : d({
      resource: "PE",
      amount: Qr[a],
      source: "default-by-circle",
      circle: a
    }) : l(o.error);
  }
}
function Zr(t, e) {
  const r = t.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Jr(r) ? {
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
function Jr(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return (e.resource === "PE" || e.resource === "PD") && typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0;
}
const x = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function ea(t) {
  if (!sa(t.item)) return null;
  const e = oe(t.actor) ? t.actor : ta(t.item);
  return {
    source: "ordem-item-used-hook",
    actor: e,
    item: t.item,
    token: aa(t.token) ?? ra(e),
    targets: he(),
    message: t.message,
    chatMessageData: t.chatMessageData
  };
}
function ta(t) {
  const e = t;
  return oe(e.actor) ? e.actor : oe(t.parent) ? t.parent : null;
}
function ra(t) {
  const e = oa(t) ?? na(t);
  return e ? ht(e) : null;
}
function aa(t) {
  return ne(t) ? ht(t) : null;
}
function oa(t) {
  if (!t) return null;
  const e = t, r = e.token;
  return ne(r) ? r : (e.getActiveTokens?.() ?? []).find(ne) ?? null;
}
function na(t) {
  return t ? canvas?.tokens?.controlled?.find((e) => e.actor?.id === t.id) ?? null : null;
}
function ht(t) {
  const e = t.actor ?? null;
  return {
    tokenId: K(t.id),
    actorId: K(e?.id),
    sceneId: K(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function sa(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function oe(t) {
  return !!(t && typeof t == "object" && "update" in t && "items" in t);
}
function ne(t) {
  return !!(t && typeof t == "object" && ("actor" in t || "id" in t || "name" in t));
}
function K(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
class ia {
  constructor(e) {
    this.onItemUsed = e;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(x.ITEM_USED, (e) => {
      this.handleHook(e);
    }), this.registered = !0, i.info(`${x.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(e) {
    const r = ea(ua(e));
    if (!r) {
      i.warn(`${x.ITEM_USED} disparou sem payload de item válido.`, e);
      return;
    }
    await this.onItemUsed(r);
  }
}
function ua(t) {
  return t && typeof t == "object" ? t : {};
}
class ca {
  async applyPresetItemPatch(e, r) {
    const a = r.itemPatch;
    if (!a) return Y("missing-item-patch");
    if (e.type !== "ritual") return Y("unsupported-item-type");
    const o = la(a);
    return Object.keys(o).length === 0 ? Y("empty-update") : (await e.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function la(t) {
  const e = {};
  y(e, "name", t.name), y(e, "system.description", t.descriptionHtml);
  const r = t.ritual;
  return r && (y(e, "system.circle", r.circle), y(e, "system.element", r.element), y(e, "system.target", r.target), y(e, "system.targetQtd", r.targetQuantity), y(e, "system.execution", r.execution), y(e, "system.range", r.range), y(e, "system.duration", r.duration), y(e, "system.skillResis", r.resistanceSkill), y(e, "system.resistance", r.resistance)), e;
}
function y(t, e, r) {
  r !== void 0 && (t[e] = r);
}
function Y(t) {
  return {
    applied: !1,
    reason: t,
    updateData: {}
  };
}
class ma {
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
    return this.getNumber(e, ae.ritual.dt, 0);
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
class da {
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
class fa {
  presets = /* @__PURE__ */ new Map();
  register(e) {
    const r = pa(e);
    return r.ok ? this.presets.has(e.id) ? l({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${e.id}.`,
      presetId: e.id
    }) : (this.presets.set(e.id, Q(e)), d(e)) : r;
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
    return r ? Q(r) : null;
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
    return Array.from(this.presets.values()).map(Q);
  }
  findForItem(e) {
    return this.list().map((r) => ga(r, e)).filter((r) => r !== null).sort((r, a) => a.score - r.score || r.preset.id.localeCompare(a.preset.id));
  }
}
function pa(t) {
  return !X(t.id) || !X(t.version) || !X(t.label) ? l({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: t.id
  }) : !t.automation || t.automation.version !== 1 || !Array.isArray(t.automation.steps) ? l({
    reason: "invalid-preset",
    message: `Preset ${t.id} possui definição de automação inválida.`,
    presetId: t.id
  }) : d(t);
}
function ga(t, e) {
  if (t.matchers.length === 0)
    return null;
  const r = [];
  let a = 0;
  if (t.itemTypes.length > 0) {
    if (!t.itemTypes.includes(e.type)) return null;
    a += 10, r.push(`itemType:${e.type}`);
  }
  for (const o of t.matchers) {
    const n = ha(o, e);
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
function ha(t, e) {
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
      const r = Me(e.name), a = t.names.map(Me).includes(r);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = ya(e), a = r !== null && t.circles.includes(r);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function Me(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function ya(t) {
  const e = foundry.utils.getProperty(t, "system.circle"), r = typeof e == "string" ? Number(e) : e;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function Q(t) {
  return structuredClone(t);
}
function X(t) {
  return typeof t == "string" && t.length > 0;
}
function z(t, e) {
  if (typeof t.amount == "number")
    return !Number.isInteger(t.amount) || t.amount <= 0 ? l({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : d(t.amount);
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
    }) : d(o);
  }
  return l({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function W(t) {
  return t ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(t)?.groups?.rollId ?? null : null;
}
async function Aa(t, e, r) {
  if (!Fe(t.id) || !Fe(t.formula))
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
    const c = {
      ...r.rollRequests[t.id] ?? yt(t, e),
      total: n,
      roll: o
    };
    return r.rolls[t.id] = c, d(c);
  } catch (a) {
    return l({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${t.formula}.`,
      cause: a
    });
  }
}
function yt(t, e) {
  const r = t.intent ?? Ra(t.id);
  return {
    id: t.id,
    formula: t.formula,
    intent: r,
    damageType: t.damageType,
    sourceStepIndex: e
  };
}
function Ra(t) {
  const e = t.toLowerCase();
  return e.includes("damage") || e.includes("dano") ? "damage" : e.includes("healing") || e.includes("heal") || e.includes("cura") ? "healing" : e.includes("attack") || e.includes("ataque") ? "attack" : e.includes("resistance") || e.includes("resistencia") || e.includes("resistência") ? "resistance" : "generic";
}
function Fe(t) {
  return typeof t == "string" && t.length > 0;
}
async function se(t, e, r, a, o) {
  switch (a) {
    case "spend":
      return r !== "PE" && r !== "PD" ? j(e, r, a, o) : t.spend(e, r, o);
    case "damage":
      return r !== "PV" && r !== "SAN" ? j(e, r, a, o) : t.damage(e, r, o);
    case "heal":
      return r !== "PV" ? j(e, r, a, o) : t.heal(e, r, o);
    case "recover":
      return r !== "SAN" ? j(e, r, a, o) : t.recover(e, r, o);
  }
}
function j(t, e, r, a) {
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
function wa(t) {
  const { step: e, context: r, transaction: a, stepIndex: o, lifecycle: n } = t;
  if (e.operation === "damage") {
    const s = ka(e, r, a, o);
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
    const s = Pa(e, r, a, o);
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
function ka(t, e, r, a) {
  const o = W(t.amountFrom), n = o ? e.rolls[o] : void 0;
  return {
    id: At(e.id, "damage", a, e.damageInstances.length),
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
function Pa(t, e, r, a) {
  const o = W(t.amountFrom);
  return {
    id: At(e.id, "healing", a, e.healingInstances.length),
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
function At(t, e, r, a) {
  return `${t}.${e}.${r}.${a}`;
}
function Ta(t, e, r) {
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
function $a(t) {
  const { step: e, context: r, stepIndex: a, metadata: o, lifecycle: n } = t;
  n.emit("beforeApply", r, { stepIndex: a, step: e, metadata: o }), Rt("before", t), Le("before", t), Le("resolve", t);
}
function Ca(t) {
  const { step: e, context: r, stepIndex: a, metadata: o, lifecycle: n } = t;
  n.emit("apply", r, { stepIndex: a, step: e, metadata: o }), Rt("apply", t);
}
function ba(t) {
  const { step: e, context: r, stepIndex: a, metadata: o, lifecycle: n } = t;
  n.emit("afterApply", r, { stepIndex: a, step: e, metadata: o });
}
function Rt(t, e) {
  const { step: r, context: a, stepIndex: o, metadata: n, lifecycle: s } = e, c = Ia(t, r.operation);
  c && s.emit(c, a, {
    stepIndex: o,
    step: r,
    metadata: n
  });
}
function Le(t, e) {
  const { step: r, context: a, stepIndex: o, metadata: n, lifecycle: s } = e;
  r.operation === "damage" && s.emit(t === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: o,
    step: r,
    metadata: n
  });
}
function Ia(t, e) {
  return e === "damage" ? t === "before" ? "beforeApplyDamage" : t === "apply" ? "applyDamage" : "afterApplyDamage" : e === "heal" ? t === "before" ? "beforeApplyHealing" : t === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Sa(t, e, r) {
  try {
    return await t.createWorkflowSummaryMessage(r, e), d(void 0);
  } catch (a) {
    return l({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: a
    });
  }
}
async function Ea(t) {
  const { step: e } = t;
  switch (e.type) {
    case "spendResource":
      return va(t, e);
    case "spendRitualCost":
      return Da(t, e);
  }
}
async function va(t, e) {
  const { context: r, resources: a } = t, o = z(e, r);
  return o.ok ? wt(await a.spend(r.sourceActor, e.resource, o.value), r) : l(o.error);
}
async function Da(t, e) {
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
  }), wt(await a.spend(r.sourceActor, s.resource, s.amount), r, e);
}
function wt(t, e, r) {
  return t.ok ? (e.resourceTransactions.push(t.value), d(void 0)) : (r?.type === "spendRitualCost" && e.ritualCosts.pop(), l({
    reason: "resource-operation-failed",
    message: t.error.message,
    cause: t.error
  }));
}
async function Na(t) {
  const { step: e, context: r, stepIndex: a, lifecycle: o, execute: n } = t, s = Oa(e);
  for (const f of s.before)
    o.emit(f, r, { stepIndex: a, step: e });
  const c = await n();
  if (!c.ok)
    return c;
  for (const f of s.after)
    o.emit(f, r, { stepIndex: a, step: e });
  return c;
}
function Oa(t) {
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
class _a {
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
        return Na({
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
    const o = await Ea({
      step: e,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? d(void 0) : l({ ...o.error, stepIndex: a, step: e, context: r });
  }
  async runRollFormulaStepWithLifecycle(e, r, a) {
    const o = yt(e, a);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: a, step: e, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, a, e), this.lifecycle.emit("roll", r, { stepIndex: a, step: e, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, a, e);
    const n = await this.runRollFormulaStep(e, r, a);
    if (!n.ok)
      return n;
    const s = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, a, e, s), this.lifecycle.emit("afterRoll", r, { stepIndex: a, step: e, rollRequest: o, rollResult: s }), d(void 0);
  }
  async runRollFormulaStep(e, r, a) {
    const o = await Aa(e, a, r);
    return o.ok ? d(void 0) : l({ ...o.error, stepIndex: a, step: e, context: r });
  }
  async runModifyResourceStepWithLifecycle(e, r, a) {
    const o = z(e, r);
    if (!o.ok)
      return l({ ...o.error, stepIndex: a, step: e, context: r });
    const n = Ta(e, r, o.value);
    $a({
      step: e,
      context: r,
      stepIndex: a,
      metadata: n,
      lifecycle: this.lifecycle
    }), Ca({
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
    for (const c of s) {
      const f = await se(this.resources, c, e.resource, e.operation, o.value), g = this.handleResourceOperationResult(f, r, a, e);
      if (!g.ok)
        return g;
      wa({
        step: e,
        context: r,
        transaction: g.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return ba({
      step: e,
      context: r,
      stepIndex: a,
      metadata: n,
      lifecycle: this.lifecycle
    }), d(void 0);
  }
  async runModifyResourceStep(e, r, a) {
    const o = z(e, r);
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
      const c = await se(this.resources, s, e.resource, e.operation, o.value), f = this.handleResourceOperationResult(c, r, a, e);
      if (!f.ok)
        return f;
    }
    return d(void 0);
  }
  async runChatCardStep(e, r, a) {
    const o = await Sa(this.messages, e, r);
    return o.ok ? d(void 0) : l({ ...o.error, stepIndex: a, step: e, context: r });
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
  emitSpecificRollPhase(e, r, a, o, n, s) {
    const c = Ma(e, r.intent);
    c && this.lifecycle.emit(c, a, {
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
function Ma(t, e) {
  return e === "damage" ? t === "before" ? "beforeDamageRoll" : t === "roll" ? "damageRoll" : "afterDamageRoll" : e === "healing" ? t === "before" ? "beforeHealingRoll" : t === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Fa {
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
    const s = n.value, c = this.calculate(a, s, o);
    if (!c.ok)
      return l({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: c.error.reason,
        message: c.error.message,
        requestedAmount: o,
        current: s.value,
        required: o
      });
    const { afterValue: f, appliedAmount: g } = c.value, h = {
      value: f,
      max: s.max
    };
    try {
      f !== s.value && await this.adapter.updateResourceValue(e, r, f);
    } catch (w) {
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
        cause: w
      });
    }
    return d({
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
function La(t) {
  return {
    id: Ua(),
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
function Ua() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ha {
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
    return I(this.lastContext);
  }
  async runAutomation(e, r) {
    const a = La(r);
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
class qa {
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
class Va {
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
    const r = ee();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: e.speaker,
      content: e.content,
      whisper: ja(),
      flags: {
        ...e.flags,
        [u]: {
          ...Ba(e.flags),
          debugOutput: !0
        }
      }
    }), r.console && e.data !== void 0 && i.info("Debug chat criado.", e.data), !0);
  }
  emit(e, r) {
    const a = ee();
    if (!a.enabled)
      return;
    const o = r.notification ?? Ue(r);
    a.console && this.emitConsole(e, r), a.ui && this.emitUi(e, o);
  }
  emitConsole(e, r) {
    const a = Ue(r);
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
function Ue(t) {
  return t.message ? `${t.title}: ${t.message}` : t.title;
}
function ja() {
  const t = game.users?.filter((e) => e.isGM === !0 && e.id).map((e) => e.id) ?? [];
  return t.length > 0 ? t : game.user?.id ? [game.user.id] : [];
}
function Ba(t) {
  const e = t?.[u];
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const za = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", kt = `${u}-inline-roll-neutralized`, Wa = `${u}-inline-roll-notice`, ye = `data-${u}-inline-roll-neutralized`, He = `data-${u}-inline-roll-notice`, Ga = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function xa(t) {
  const e = io(t.message), r = await Ka(t.message), a = Ya(e);
  return r.replacementCount + a.replacementCount > 0 && i.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: t.item.id ?? null,
    itemName: t.item.name ?? "Item sem nome",
    messageId: e,
    contentReplacementCount: r.replacementCount,
    renderedReplacementCount: a.replacementCount
  }), {
    messageId: e,
    contentUpdated: r.updated,
    contentReplacementCount: r.replacementCount,
    renderedReplacementCount: a.replacementCount
  };
}
async function Ka(t) {
  const e = oo(t);
  if (!e || typeof e.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = Qa(e.content);
  return r.replacementCount === 0 || r.content === e.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await no(e, r.content), replacementCount: r.replacementCount };
}
function Ya(t) {
  const e = t ? so(t) : null;
  if (!e)
    return { replacementCount: 0 };
  const r = Pt(e);
  return r > 0 && Tt(to(e)), { replacementCount: r };
}
function Qa(t) {
  const e = Xa(t), r = document.createElement("template");
  r.innerHTML = e.content;
  const a = Pt(r.content), o = e.replacementCount + a;
  return o === 0 ? { content: t, replacementCount: 0 } : (Tt(r.content), { content: r.innerHTML, replacementCount: o });
}
function Xa(t) {
  let e = 0;
  return { content: t.replace(/\[\[([^\[\]]+)\]\]/g, (a, o) => (e += 1, Ja(o.trim()))), replacementCount: e };
}
function Pt(t) {
  const e = Za(t);
  for (const r of e)
    r.replaceWith(eo(ro(r)));
  return e.length;
}
function Za(t) {
  const e = /* @__PURE__ */ new Set();
  for (const r of t.querySelectorAll(za))
    r.getAttribute(ye) !== "true" && e.add(r);
  return Array.from(e);
}
function Ja(t) {
  return `<span class="${kt}" ${ye}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${uo(t)}</span>`;
}
function eo(t) {
  const e = document.createElement("span");
  return e.classList.add(kt), e.setAttribute(ye, "true"), e.title = "Rolagem inline ignorada pelo Paranormal Toolkit", e.textContent = t, e;
}
function Tt(t) {
  if (t.querySelector?.(`[${He}="true"]`)) return;
  const e = document.createElement("p");
  e.classList.add(Wa), e.setAttribute(He, "true"), e.textContent = Ga, t.append(e);
}
function to(t) {
  return t.querySelector(".message-content") ?? t;
}
function ro(t) {
  const r = t.getAttribute("data-formula") ?? ao(t.getAttribute("data-roll")) ?? t.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function ao(t) {
  if (!t) return null;
  try {
    const e = JSON.parse(t);
    return typeof e.formula == "string" && e.formula.length > 0 ? e.formula : null;
  } catch {
    return null;
  }
}
function oo(t) {
  return t && typeof t == "object" ? t : null;
}
async function no(t, e) {
  if (typeof t.update != "function")
    return !1;
  try {
    return await Promise.resolve(t.update({ content: e })), !0;
  } catch (r) {
    return i.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function so(t) {
  const e = co(t);
  return document.querySelector(
    `.chat-message[data-message-id="${e}"], [data-message-id="${e}"]`
  );
}
function io(t) {
  if (!t || typeof t != "object") return null;
  const e = t;
  return typeof e.id == "string" && e.id.length > 0 ? e.id : null;
}
function uo(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function co(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const lo = ["base", "discente", "verdadeiro"];
function mo(t) {
  switch (t) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function fo(t) {
  return typeof t == "string" && lo.includes(t);
}
async function po(t) {
  const e = Ro();
  return e ? new Promise((r) => {
    let a = !1;
    const o = (n) => {
      a || (a = !0, r(n));
    };
    new e({
      title: `Conjurar ${t.ritual.name ?? "ritual"}`,
      content: go(t),
      default: "cast",
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: () => o(null)
        },
        cast: {
          icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
          label: "Conjurar",
          callback: (n) => o(ho(n, t.defaultSpendResource))
        }
      },
      close: () => o(null)
    }).render(!0);
  }) : (ui.notifications?.warn("Paranormal Toolkit: Dialog não disponível. Usando opções padrão do ritual."), {
    variant: "base",
    spendResource: t.defaultSpendResource
  });
}
function go(t) {
  const e = t.targetNames.length > 0 ? t.targetNames.join(", ") : "Nenhum alvo selecionado", r = t.cost ? `${t.cost.amount} ${t.cost.resource}` : "não resolvido";
  return `
    <form class="paranormal-toolkit-ritual-cast-dialog">
      <p class="paranormal-toolkit-ritual-cast-dialog__hint">
        Configure a conjuração antes do Toolkit gastar recurso, rolar dados ou preparar ações no chat.
      </p>

      <aside class="paranormal-toolkit-ritual-cast-dialog__warning" role="note">
        <strong>Aviso temporário</strong>
        <span>
          O Toolkit ainda não consegue impedir completamente as rolagens inline da descrição nem bloquear o card original antes desta confirmação. Use o resultado oficial exibido pelo Paranormal Toolkit.
        </span>
      </aside>

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
        <div><dt>Custo previsto</dt><dd>${Z(r)}</dd></div>
        <div><dt>Conjurador</dt><dd>${Z(t.actor.name ?? "Ator sem nome")}</dd></div>
        <div><dt>Alvos</dt><dd>${Z(e)}</dd></div>
      </dl>
    </form>
  `;
}
function ho(t, e) {
  const r = Ao(t), a = yo(r), o = r?.querySelector('input[name="spendResource"]')?.checked ?? e;
  return {
    variant: a,
    spendResource: o
  };
}
function yo(t) {
  const e = t?.querySelector('input[name="variant"]:checked')?.value;
  return fo(e) ? e : "base";
}
function Ao(t) {
  if (t instanceof HTMLElement) return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function Ro() {
  return globalThis.Dialog ?? null;
}
function Z(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
class wo {
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
    const a = this.resolveCostPreview(e), o = await po({
      actor: e.actor,
      ritual: e.item,
      targetNames: e.targets.map((h) => h.name),
      cost: a,
      defaultSpendResource: Do(r)
    });
    if (!o)
      return { status: "cancelled" };
    const n = ko(r, o);
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
    const c = s.value.context, f = Po(r, e, c), g = Io(o, a, c);
    return f.ok ? f.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: c,
      summaryLines: g
    } : {
      status: "ready",
      workflowContext: c,
      actions: f.actions,
      summaryLines: g
    } : {
      status: "failed",
      reason: f.reason,
      message: f.message
    };
  }
  async applyAction(e) {
    return se(this.resources, e.actor, e.resource, e.operation, e.amount);
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
function ko(t, e) {
  const r = [];
  for (const a of t.steps)
    a.type === "modifyResource" || a.type === "chatCard" || $t(a) && !e.spendResource || r.push(a);
  return {
    ...t,
    label: `${t.label} · Conjuração assistida`,
    steps: r
  };
}
function Po(t, e, r) {
  const a = [];
  for (const o of t.steps) {
    if (o.type !== "modifyResource") continue;
    const n = z(o, r);
    if (!n.ok)
      return {
        ok: !1,
        reason: n.error.reason,
        message: n.error.message
      };
    const s = bo(o.actor, e);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const c of s)
      a.push(To(o, c, n.value));
  }
  return { ok: !0, actions: a };
}
function To(t, e, r) {
  const a = e.name ?? "Ator sem nome";
  return {
    kind: "resource-operation",
    actor: e,
    actorName: a,
    resource: t.resource,
    operation: t.operation,
    amount: r,
    label: $o(t, a, r),
    executedLabel: Co(t, a)
  };
}
function $o(t, e, r) {
  return t.operation === "heal" && t.resource === "PV" ? `Curar ${e} em ${r} PV` : t.operation === "damage" ? `Aplicar ${r} de dano em ${e}` : t.operation === "recover" ? `Recuperar ${r} ${t.resource} de ${e}` : t.operation === "spend" ? `Gastar ${r} ${t.resource} de ${e}` : `Aplicar ${r} ${t.resource} em ${e}`;
}
function Co(t, e) {
  return t.operation === "heal" && t.resource === "PV" ? `✓ ${e} curado` : t.operation === "damage" ? `✓ Dano aplicado em ${e}` : t.operation === "recover" ? `✓ ${e} recuperado` : t.operation === "spend" ? `✓ Recurso gasto de ${e}` : "✓ Ação aplicada";
}
function bo(t, e) {
  switch (t) {
    case "self":
      return e.actor ? [e.actor] : [];
    case "target":
      return e.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function Io(t, e, r) {
  return [
    `Forma: ${mo(t.variant)}`,
    So(t, e),
    ...Object.values(r.rolls).map(Eo)
  ];
}
function So(t, e) {
  if (!e)
    return t.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
  const r = t.spendResource ? "gasto" : "não gasto";
  return `Custo: ${e.amount} ${e.resource} ${r}`;
}
function Eo(t) {
  return `${vo(t)}: ${t.formula} = ${Math.trunc(t.total)}`;
}
function vo(t) {
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
function Do(t) {
  return t.steps.some($t);
}
function $t(t) {
  return t.type === "spendResource" || t.type === "spendRitualCost";
}
const L = "data-paranormal-toolkit-pending-id", ie = "data-paranormal-toolkit-executed-label", qe = "data-paranormal-toolkit-detail-key", No = `[${L}]`, Ve = `${u}-chat-enrichment`, P = `${u}-item-use-prompt`, je = `${P}__actions`, Be = `${P}__details`, Oo = `${P}__summary`, _o = `${P}__title`, Mo = `${P}__button--executed`;
let ze = !1, ue = null;
const D = /* @__PURE__ */ new Map();
function Fo(t) {
  ue = t, !ze && (Hooks.on("renderChatMessageHTML", (e, r) => {
    Uo(e, r, t);
  }), ze = !0);
}
function We(t) {
  const e = Lo(t);
  D.set(t.pendingId, e), Ho(t.pendingId);
}
function Ge(t) {
  D.delete(t);
}
function Lo(t) {
  return {
    ...t,
    createdAt: Date.now(),
    messageId: It(t.context.message),
    itemId: t.context.item.id ?? null,
    actorId: t.context.actor?.id ?? null
  };
}
function Uo(t, e, r) {
  Zo();
  const a = bt(e);
  if (!a) return;
  const o = Yo(t, a);
  if (!o) {
    le(a, r);
    return;
  }
  ce(a, o), le(a, r);
}
function Ho(t) {
  const e = D.get(t);
  if (!e) return;
  const r = e.messageId ? Qo(e.messageId) : null;
  if (r) {
    ce(r, e), xe(r);
    return;
  }
  if (e.messageId) return;
  const a = Xo(e);
  a && (ce(a, e), xe(a));
}
function xe(t) {
  ue && le(t, ue);
}
function ce(t, e) {
  if (t.querySelector(`[${L}="${Ae(e.pendingId)}"]`)) return;
  const r = qo(t, e);
  jo(r, e.summaryLines ?? []), Vo(r).append(zo(e));
}
function qo(t, e) {
  const r = t.querySelector(`.${Ve}`);
  if (r)
    return r;
  const a = document.createElement("section");
  a.classList.add(Ve, P);
  const o = document.createElement("header");
  o.classList.add(`${P}__header`);
  const n = document.createElement("strong");
  n.classList.add(_o), n.textContent = e.title ?? "Paranormal Toolkit";
  const s = document.createElement("span");
  return s.classList.add(Oo), s.textContent = Wo(e.context), o.append(n, s), a.append(o), xo(t).append(a), a;
}
function Vo(t) {
  const e = t.querySelector(`.${je}`);
  if (e)
    return e;
  const r = document.createElement("div");
  return r.classList.add(je), t.append(r), r;
}
function jo(t, e) {
  if (e.length === 0) return;
  const r = Bo(t);
  for (const a of e) {
    const o = Jo(a);
    if (r.querySelector(`[${qe}="${Ae(o)}"]`)) continue;
    const n = document.createElement("li");
    n.textContent = a, n.setAttribute(qe, o), r.append(n);
  }
}
function Bo(t) {
  const e = t.querySelector(`.${Be}`);
  if (e)
    return e;
  const r = document.createElement("ul");
  return r.classList.add(Be), t.append(r), r;
}
function zo(t) {
  const e = document.createElement("button");
  return e.type = "button", e.classList.add(`${P}__button`), e.textContent = t.buttonLabel ?? "Aplicar automação", e.setAttribute(L, t.pendingId), e.setAttribute(ie, t.executedLabel ?? "✓ Automação aplicada"), e;
}
function Wo(t) {
  const e = t.actor?.name ?? t.token?.name ?? "Origem não resolvida", r = Go(t);
  return `${e} → ${r}`;
}
function Go(t) {
  return t.targets.length > 0 ? t.targets.map((e) => e.name).join(", ") : "nenhum alvo";
}
function xo(t) {
  return t.querySelector(".message-content") ?? t;
}
function le(t, e) {
  const r = bt(t);
  if (!r) return;
  const a = r.querySelectorAll(No);
  for (const o of a)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Ko(o, e);
    }));
}
async function Ko(t, e) {
  const r = t.getAttribute(L);
  if (!r) return;
  t.disabled = !0;
  const a = t.textContent;
  if (t.textContent = "Aplicando...", await e(r)) {
    t.textContent = t.getAttribute(ie) ?? "✓ Automação aplicada", t.classList.add(Mo), t.removeAttribute(L), t.removeAttribute(ie);
    return;
  }
  t.disabled = !1, t.textContent = a;
}
function Yo(t, e) {
  for (const r of D.values())
    if (Ct(r, t, e))
      return r;
  return null;
}
function Ct(t, e, r) {
  const a = It(e) ?? r.dataset.messageId ?? null;
  return t.messageId ? t.messageId === a : !t.itemId || !Ke(r, "itemId", t.itemId) ? !1 : !t.actorId || Ke(r, "actorId", t.actorId);
}
function Ke(t, e, r) {
  if (t.dataset[e] === r)
    return !0;
  const a = `data-${en(e)}`;
  for (const o of t.querySelectorAll(`[${a}]`))
    if (o.getAttribute(a) === r)
      return !0;
  return !1;
}
function Qo(t) {
  const e = Ae(t);
  return document.querySelector(
    `.chat-message[data-message-id="${e}"], [data-message-id="${e}"]`
  );
}
function Xo(t) {
  for (const e of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Ct(t, null, e))
      return e;
  return null;
}
function Zo() {
  const t = Date.now(), e = 300 * 1e3;
  for (const [r, a] of D.entries())
    t - a.createdAt > e && D.delete(r);
}
function bt(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function It(t) {
  if (!t || typeof t != "object") return null;
  const e = t;
  return typeof e.id == "string" && e.id.length > 0 ? e.id : null;
}
function Jo(t) {
  return t.trim().toLowerCase();
}
function en(t) {
  return t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
}
function Ae(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ye = 1e3;
class tn {
  constructor(e, r, a, o) {
    this.workflow = e, this.debugOutput = o, this.ritualAssistant = new wo(e, r, a);
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
      settings: Ce(),
      strategies: this.strategies.map((e) => e.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(e) {
    const r = Ce();
    if (r.executionMode === "disabled") {
      this.setAttempt(e, "skipped", "execution-mode-disabled");
      return;
    }
    const a = de(e.item);
    if (!a.ok) {
      const o = a.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(e, o, a.error.reason), a.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: a.error.message,
        data: a.error
      });
      return;
    }
    if (await xa(e), !e.actor) {
      this.setAttempt(e, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${e.item.name}.`,
        data: Qe(e, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(e), Ge(e), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const a = await this.ritualAssistant.applyAction(r.action);
    return a.ok ? (r.workflowContext.resourceTransactions.push(a.value), this.pendingExecutions.delete(e), Ge(e), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Fo((e) => this.executePendingAutomation(e)), this.promptRendererRegistered = !0);
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
        this.setAttempt(e, "completed", "ritual-assisted-no-actions"), i.info("Ritual assistido concluído sem ações pendentes.", I(a.workflowContext));
        return;
      case "ready":
        this.registerAssistedResourceActions(e, a.workflowContext, a.actions, a.summaryLines);
        return;
    }
  }
  registerAssistedResourceActions(e, r, a, o) {
    let n;
    for (const s of a) {
      const c = Ze();
      n ??= c, this.pendingExecutions.set(c, {
        kind: "resource-action",
        id: c,
        action: s,
        context: e,
        workflowContext: r,
        createdAt: Date.now()
      }), We({
        pendingId: c,
        context: e,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        summaryLines: o
      });
    }
    this.setAttempt(e, "pending", "ritual-assisted-actions", n), i.info("Ritual assistido preparado com ações pendentes.", I(r));
  }
  async createPendingWorkflowPrompt(e, r) {
    const a = Ze();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: r,
      context: e,
      mode: "ask",
      createdAt: Date.now()
    }), We({
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
    this.setAttempt(e, "completed"), i.info("Automação executada por uso normal de item.", I(o.value.context));
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
    const r = Date.now(), a = Xe(e);
    for (const [n, s] of this.recentExecutionKeys.entries())
      r - s > Ye && this.recentExecutionKeys.delete(n);
    const o = this.recentExecutionKeys.get(a);
    return o !== void 0 && r - o <= Ye;
  }
  markExecution(e) {
    this.recentExecutionKeys.set(Xe(e), Date.now());
  }
  setAttempt(e, r, a, o) {
    this.lastAttempt = Qe(e, r, a, o);
  }
}
function Qe(t, e, r, a) {
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
function Xe(t) {
  const e = t.actor?.id ?? "no-actor", r = t.item.uuid ?? t.item.id ?? t.item.name ?? "unknown-item";
  return `${e}:${r}`;
}
function Ze() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class rn {
  constructor(e) {
    this.debugOutput = e;
  }
  debugOutput;
  async createResourceOperationMessage(e) {
    const r = this.createResourceOperationContent(e.transaction), a = pe(e.transaction);
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
    const a = this.createWorkflowSummaryContent(e, r), o = I(e);
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
    const r = p(e.actorName), a = p(e.resource), o = p(Je(e)), n = p(on(e));
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
    const a = p(r.title ?? "Automação"), o = r.message ? `<p>${p(r.message)}</p>` : "", n = p(e.sourceToken?.name ?? e.sourceActor.name ?? "Origem sem nome"), s = p(e.item.name ?? "Item sem nome"), c = e.targets.length > 0 ? e.targets.map((m) => p(m.name)).join(", ") : "Nenhum", f = Object.values(e.rolls).map(
      (m) => `<li><strong>${p(m.id)}:</strong> ${p(m.formula)} = ${m.total} <em>(${p(an(m.intent))})</em>${m.damageType ? ` — ${p(m.damageType)}` : ""}</li>`
    ), g = e.ritualCosts.map(
      (m) => `<li><strong>${p(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${p(m.resource)} (${p(nn(m.source))})</li>`
    ), h = e.damageInstances.map(
      (m) => `<li><strong>${p(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${p(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), w = e.healingInstances.map(
      (m) => `<li><strong>${p(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), N = e.resourceTransactions.map(
      (m) => `<li><strong>${p(m.actorName)}:</strong> ${p(Je(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), O = e.phases.map((m) => p(m)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${a}</strong>
          <span>${s}</span>
        </header>
        <div class="${u}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${n}</p>
          <p><strong>Alvo:</strong> ${c}</p>
          ${g.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${g.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${h.length > 0 ? `<p><strong>Dano:</strong></p><ul>${h.join("")}</ul>` : ""}
          ${w.length > 0 ? `<p><strong>Cura:</strong></p><ul>${w.join("")}</ul>` : ""}
          ${N.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${N.join("")}</ul>` : ""}
          ${O.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${O}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function an(t) {
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
function Je(t) {
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
function on(t) {
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
function nn(t) {
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
function sn() {
  const t = new Wr(), e = new Fa(t), r = new Kr(), a = new Xr(r), o = new ma(t), n = new fa(), s = n.registerMany(nr());
  if (!s.ok)
    throw new Error(s.error.message);
  const c = new da(), f = new ca(), g = new Va(), h = new rn(g), w = new qa(), N = new _a(e, a, h, w), O = new Ha(N, w), m = new tn(O, e, a, g);
  return m.addStrategy(new ia((St) => m.handleItemUsed(St))), {
    ordem: o,
    resourceAdapter: t,
    ritualAdapter: r,
    ritualCosts: a,
    resources: e,
    automationRegistry: n,
    automationBinder: c,
    itemPatches: f,
    debugOutput: g,
    chatMessages: h,
    workflowHooks: w,
    automation: N,
    workflow: O,
    itemUseIntegration: m
  };
}
let F = null;
Hooks.once("init", () => {
  rr(), Tr(), i.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Ie.isSupportedSystem()) {
    i.warn(
      `Sistema não suportado: ${Ie.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  F = sn(), F.itemUseIntegration.registerStrategies(), Dr(F), jr(), Ur(), i.info("Inicializado para o sistema Ordem Paranormal."), i.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Et} inicializado.`);
});
function un() {
  if (!F)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return F;
}
export {
  un as getToolkitServices
};
//# sourceMappingURL=main.js.map
