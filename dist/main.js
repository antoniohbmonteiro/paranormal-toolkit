const u = "paranormal-toolkit", Vt = "Paranormal Toolkit", jt = "ordemparanormal";
class F {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function pe(t) {
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
function ge(t) {
  const e = t.getFlag(u, "automation");
  return e == null ? l({
    reason: "missing-automation",
    message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
  }) : nt(e) ? d(e.definition) : l({
    reason: "invalid-automation",
    message: `Automação do item ${t.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: e
  });
}
function Bt(t) {
  return nt(t.getFlag(u, "automation"));
}
function nt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.schemaVersion === 1 && Wt(e.source) && zt(e.definition);
}
function zt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && A(e.label) && Array.isArray(e.steps) && e.steps.every(xt);
}
function Wt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.type === "preset" ? A(e.presetId) && A(e.presetVersion) && A(e.appliedAt) : e.type === "manual" ? A(e.label) && A(e.appliedAt) : !1;
}
function xt(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  switch (e.type) {
    case "spendResource":
      return Gt(e);
    case "spendRitualCost":
      return Kt(e);
    case "rollFormula":
      return Yt(e);
    case "modifyResource":
      return Qt(e);
    case "chatCard":
      return Xt(e);
    default:
      return !1;
  }
}
function Gt(t) {
  const e = t;
  return e.type === "spendResource" && e.actor === "self" && (e.resource === "PE" || e.resource === "PD") && st(e);
}
function Kt(t) {
  return t.type === "spendRitualCost";
}
function Yt(t) {
  const e = t;
  return e.type === "rollFormula" && A(e.id) && A(e.formula) && (e.intent === void 0 || tr(e.intent)) && (e.damageType === void 0 || A(e.damageType));
}
function Qt(t) {
  const e = t;
  return e.type === "modifyResource" && Zt(e.actor) && Jt(e.resource) && er(e.operation) && st(e);
}
function Xt(t) {
  const e = t;
  return e.type === "chatCard" && (e.title === void 0 || typeof e.title == "string") && (e.message === void 0 || typeof e.message == "string");
}
function st(t) {
  return typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0 || A(t.amountFrom);
}
function Zt(t) {
  return t === "self" || t === "target";
}
function Jt(t) {
  return t === "PV" || t === "SAN" || t === "PE" || t === "PD";
}
function er(t) {
  return t === "spend" || t === "damage" || t === "heal" || t === "recover";
}
function tr(t) {
  return t === "attack" || t === "damage" || t === "healing" || t === "resistance" || t === "skill" || t === "ritual" || t === "generic";
}
function A(t) {
  return typeof t == "string" && t.length > 0;
}
function he(t) {
  const e = t.items;
  if (Array.isArray(e))
    return e;
  if (e && typeof e == "object") {
    const r = e;
    if (Array.isArray(r.contents))
      return r.contents.filter(be);
    if (or(e))
      return Array.from(e).filter(be);
  }
  return [];
}
function rr(t) {
  return he(t)[0] ?? null;
}
function ar(t) {
  return he(t).find(Bt) ?? null;
}
function or(t) {
  return !!(t && typeof t == "object" && Symbol.iterator in t);
}
function be(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function it(t) {
  return he(t).filter((e) => e.type === "ritual");
}
function ut(t) {
  return it(t)[0] ?? null;
}
function nr(t) {
  return {
    listPresets() {
      const e = t.automationRegistry.list().map(pe);
      return i.info("Presets de automação registrados.", e), e;
    },
    findPresetsForFirstRitual() {
      const e = M("Nenhum ator encontrado para buscar presets de ritual.");
      if (!e) return [];
      const r = U(e);
      if (!r) return [];
      const a = t.automationRegistry.findForItem(r).map(Ie);
      return i.info(`Presets encontrados para ${r.name}.`, a), a;
    },
    async applyPresetToFirstRitual(e) {
      const r = M("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const a = U(r);
      if (!a) return;
      const o = t.automationRegistry.require(e);
      if (!o.ok) {
        i.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const n = await te(t, a, o.value);
      i.info(`Preset ${o.value.id} aplicado em ${a.name}.`, { itemPatch: n }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const e = M("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!e) return;
      const r = U(e);
      if (!r) return;
      const a = t.automationRegistry.findForItem(r)[0];
      if (!a) {
        i.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const o = await te(t, r, a.preset);
      i.info(`Melhor preset aplicado em ${r.name}.`, { match: Ie(a), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return $e(t);
    },
    async applyBestPresetsToActorRituals() {
      return $e(t);
    },
    async clearAutomationFromFirstRitual() {
      const e = M("Nenhum ator encontrado para limpar automação de ritual.");
      if (!e) return;
      const r = U(e);
      r && (await t.automationBinder.clear(r), i.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function $e(t) {
  const e = M("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!e) return null;
  const r = it(e);
  if (r.length === 0)
    return i.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Ce(e);
  const a = Ce(e, r.length);
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
    const s = await te(t, o, n.preset);
    a.applied.push(sr(o, n, s));
  }
  return i.info(`Presets aplicados em rituais de ${e.name ?? "ator sem nome"}.`, a), ir(a), a;
}
async function te(t, e, r) {
  return await t.automationBinder.applyPreset(e, r), t.itemPatches.applyPresetItemPatch(e, r);
}
function sr(t, e, r) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Ritual sem nome",
    preset: pe(e.preset),
    score: e.score,
    reasons: [...e.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function Ce(t, e = 0) {
  return {
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    total: e,
    applied: [],
    skipped: []
  };
}
function ir(t) {
  const e = t.skipped.length > 0 ? `, ${t.skipped.length} sem preset compatível` : "", r = t.applied.some((a) => a.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${t.applied.length}/${t.total} presets aplicados em rituais${r}${e}.`
  );
}
function Ie(t) {
  return {
    preset: pe(t.preset),
    score: t.score,
    reasons: [...t.reasons]
  };
}
function M(t) {
  const e = F.getSelectedActor();
  return e || (i.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function U(t) {
  const e = ut(t);
  return e || (i.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function I(t) {
  return t ? {
    id: t.id,
    source: {
      ...ur(t.sourceActor),
      token: t.sourceToken
    },
    item: cr(t.item),
    targets: t.targets.map(lr),
    phases: [...t.phases],
    lifecycleEvents: t.lifecycleEvents.map((e) => ({ ...e })),
    rollRequests: Se(t.rollRequests, ct),
    rolls: Se(t.rolls, mr),
    ritualCosts: t.ritualCosts.map((e) => ({ ...e })),
    damageInstances: t.damageInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    healingInstances: t.healingInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    resourceTransactions: t.resourceTransactions.map(ye),
    flagKeys: Object.keys(t.flags)
  } : null;
}
function ye(t) {
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
function ur(t) {
  return {
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown"
  };
}
function cr(t) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Item sem nome",
    itemType: t.type ?? "unknown",
    itemUuid: t.uuid ?? null
  };
}
function lr(t) {
  return {
    tokenId: t.tokenId,
    actorId: t.actorId,
    sceneId: t.sceneId,
    name: t.name,
    actorName: t.actor?.name,
    actorType: t.actor?.type
  };
}
function ct(t) {
  return {
    id: t.id,
    formula: t.formula,
    intent: t.intent,
    damageType: t.damageType,
    sourceStepIndex: t.sourceStepIndex
  };
}
function mr(t) {
  return {
    ...ct(t),
    total: t.total
  };
}
function Se(t, e) {
  return Object.fromEntries(Object.entries(t).map(([r, a]) => [r, e(a)]));
}
function dr(t) {
  return {
    getSelected() {
      return F.getSelectedActor();
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
      await E(
        t,
        "Gasto de PE",
        T("Nenhum ator encontrado para gastar PE."),
        (r) => t.resources.spend(r, "PE", e)
      );
    },
    async spendPD(e) {
      await E(
        t,
        "Gasto de PD",
        T("Nenhum ator encontrado para gastar PD."),
        (r) => t.resources.spend(r, "PD", e)
      );
    },
    async damagePV(e) {
      await E(
        t,
        "Dano em PV",
        T("Nenhum ator encontrado para causar dano em PV."),
        (r) => t.resources.damage(r, "PV", e)
      );
    },
    async healPV(e) {
      await E(
        t,
        "Cura de PV",
        T("Nenhum ator encontrado para curar PV."),
        (r) => t.resources.heal(r, "PV", e)
      );
    },
    async damageSAN(e) {
      await E(
        t,
        "Dano em SAN",
        T("Nenhum ator encontrado para causar dano em SAN."),
        (r) => t.resources.damage(r, "SAN", e)
      );
    },
    async recoverSAN(e) {
      await E(
        t,
        "Recuperação de SAN",
        T("Nenhum ator encontrado para recuperar SAN."),
        (r) => t.resources.recover(r, "SAN", e)
      );
    }
  };
}
async function E(t, e, r, a) {
  if (!r) return;
  const o = await a(r);
  if (!o.ok) {
    fr(o.error);
    return;
  }
  const n = o.value;
  try {
    await t.chatMessages.createResourceOperationMessage({ transaction: n });
  } catch (s) {
    i.error(`${e} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  i.info(`${e} realizado:`, ye(n));
}
function T(t) {
  const e = F.getSelectedActor();
  return e || (i.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function fr(t) {
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
const w = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function pr() {
  H(w.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), H(w.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), H(w.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), H(w.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function re() {
  return {
    enabled: q(w.enabled),
    console: q(w.console),
    ui: q(w.ui),
    chat: q(w.chat)
  };
}
async function k(t, e) {
  await game.settings.set(u, w[t], e);
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
function gr() {
  return {
    status() {
      return re();
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
const lt = "ritual.costOnly", mt = "ritual.simpleHealing", hr = "ritual.eletrocussao", dt = "ritual.simpleDamage", ft = "generic.simpleHealing", pt = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function yr() {
  return [
    Ar(),
    wr(),
    Rr(),
    kr(),
    Pr()
  ];
}
function Ar() {
  return {
    id: lt,
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
function wr() {
  return {
    id: mt,
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
    automation: gt(),
    itemPatch: br()
  };
}
function Rr() {
  return {
    id: hr,
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
    automation: Tr(),
    itemPatch: $r()
  };
}
function kr() {
  return {
    id: dt,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Ae()
  };
}
function Pr() {
  return {
    id: ft,
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
function gt(t = "2d8+2") {
  return ht(
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
function Tr(t = "1d8") {
  return Ae(t, {
    label: "Eletrocussão",
    title: "Eletrocussão",
    damageType: "energia",
    message: "Gasta o custo do ritual, rola dano de energia e prepara aplicação de dano em PV do alvo. Resistência deve ser resolvida manualmente por enquanto."
  });
}
function Ae(t = "1d8", e = {}) {
  const r = e.label ?? "Ritual de dano simples", a = e.title ?? "Ritual de dano simples", o = e.damageType ?? "generic", n = e.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return ht(
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
function br() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: pt,
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
function $r() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: pt,
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
function ht(t, e, r) {
  return {
    ...t,
    steps: t.steps.map((a) => a.type !== "rollFormula" || a.id !== e ? a : {
      ...a,
      formula: r
    })
  };
}
function we() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: v(e.id),
    actorId: v(e.actor?.id),
    sceneId: v(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  }));
}
function yt() {
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
function Cr(t) {
  return {
    logFirstRitualCost() {
      const e = b("Nenhum ator encontrado para consultar custo de ritual.");
      if (!e) return;
      const r = $(e);
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
      const a = b("Nenhum ator encontrado para configurar custo customizado.");
      if (!a) return;
      const o = $(a);
      if (o) {
        if (!Er(e, r)) {
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
      const e = b("Nenhum ator encontrado para limpar custo customizado.");
      if (!e) return;
      const r = $(e);
      r && (await r.unsetFlag(u, "ritual.cost"), i.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const e = b("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!e) return;
      const r = $(e);
      if (!r) return;
      const a = t.automationRegistry.require(lt);
      if (!a.ok) {
        i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(r, a.value), i.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(e = "2d8+2") {
      const r = b("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const a = $(r);
      if (!a) return;
      if (!Ee(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = t.automationRegistry.require(mt);
      if (!o.ok) {
        i.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(a, o.value, {
        definition: gt(e)
      }), i.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(e = "1d8") {
      const r = b("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const a = $(r);
      if (!a) return;
      if (!Ee(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = t.automationRegistry.require(dt);
      if (!o.ok) {
        i.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(a, o.value, {
        definition: Ae(e)
      }), i.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const e = b("Nenhum ator encontrado para executar automação de ritual.");
      if (!e) return;
      const r = $(e);
      r && await Ir(t, e, r);
    }
  };
}
async function Ir(t, e, r) {
  const a = ge(r);
  if (!a.ok) {
    i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(a.value, {
    sourceActor: e,
    sourceToken: yt(),
    item: r,
    targets: we()
  });
  if (!o.ok) {
    Sr(o.error);
    return;
  }
  i.info("Automação de ritual executada com sucesso.", I(o.value.context));
}
function Sr(t) {
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
function b(t) {
  const e = F.getSelectedActor();
  return e || (i.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function $(t) {
  const e = ut(t);
  return e || (i.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Er(t, e) {
  return Number.isInteger(t) && t > 0 && (e === "PE" || e === "PD");
}
function Ee(t) {
  return typeof t == "string" && t.trim().length > 0;
}
const vr = ["disabled", "ask", "automatic"], Dr = ["buttons", "confirm"], At = "ask";
function Nr(t) {
  return typeof t == "string" && vr.includes(t);
}
function Or(t) {
  return typeof t == "string" && Dr.includes(t);
}
function Mr(t) {
  return Nr(t) ? t : Or(t) ? "ask" : At;
}
const j = {
  executionMode: "itemUse.executionMode",
  autoRun: "itemUse.autoRun.enabled"
};
function _r() {
  game.settings.register(u, j.executionMode, {
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
    default: At
  }), game.settings.register(u, j.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function ve() {
  return {
    executionMode: Mr(game.settings.get(u, j.executionMode))
  };
}
async function C(t) {
  await game.settings.set(u, j.executionMode, t);
}
function Lr(t) {
  return {
    status() {
      return t.itemUseIntegration.status();
    },
    async enable() {
      await C("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await C("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(e) {
      await C(e), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${e}.`);
    },
    async ask() {
      await C("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await C("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await C("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await C("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Fr = [
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
function Ur(t) {
  return {
    phases() {
      return Fr;
    },
    lastContext() {
      return t.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const e = x("Nenhum ator encontrado para executar automação.");
      if (!e) return;
      const r = ar(e);
      if (!r) {
        i.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await De(t, e, r);
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
      if (!Vr(r)) {
        i.warn(`UUID não resolveu para um Item: ${e}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = qr(r) ?? x("Nenhum ator encontrado para executar automação do item.");
      a && await De(t, a, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const e = x("Nenhum ator encontrado para configurar automação de teste.");
      if (!e) return;
      const r = rr(e);
      if (!r) {
        i.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = t.automationRegistry.require(ft);
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
async function De(t, e, r) {
  const a = ge(r);
  if (!a.ok) {
    i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(a.value, {
    sourceActor: e,
    sourceToken: yt(),
    item: r,
    targets: we()
  });
  if (!o.ok) {
    Hr(o.error);
    return;
  }
  i.info("Automação executada com sucesso.", I(o.value.context));
}
function Hr(t) {
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
function x(t) {
  const e = F.getSelectedActor();
  return e || (i.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function qr(t) {
  const e = t.parent;
  return e instanceof Actor ? e : null;
}
function Vr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function jr(t) {
  const e = dr(t), r = nr(t), a = Cr(t), o = Ur(t), n = gr(), s = Lr(t);
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
function Br(t) {
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
    debug: jr(t)
  }, r = globalThis;
  return r[u] = e, r.ParanormalToolkit = e, e;
}
class Ne {
  static isSupportedSystem() {
    return game.system.id === jt;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function zr() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: D(e.id),
    actorId: D(e.actor?.id),
    sceneId: D(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome"
  }));
}
function wt() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null, r = t.name ?? e?.name ?? "Origem sem nome";
  return {
    tokenId: D(t.id),
    actorId: D(e?.id),
    sceneId: D(t.scene?.id),
    name: r
  };
}
function Wr(t, e = wt()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: e,
    targets: t
  };
}
function xr(t) {
  if (!Yr(t)) return null;
  const e = t.getFlag(u, "workflow");
  return Kr(e) ? e : null;
}
function Gr() {
  return `flags.${u}.workflow`;
}
function Oe(t) {
  if (!t || typeof t != "object") return !1;
  const e = foundry.utils.getProperty(t, `flags.${u}`), r = foundry.utils.getProperty(t, `_source.flags.${u}`);
  return e !== void 0 || r !== void 0;
}
function Me(t) {
  const e = foundry.utils.getProperty(t, "speaker.actor"), r = foundry.utils.getProperty(t, "_source.speaker.actor");
  return ae(e) || ae(r);
}
function Kr(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && e.kind === "chat-targets" && (e.source === null || typeof e.source == "object") && Array.isArray(e.targets);
}
function Yr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t);
}
function D(t) {
  return ae(t) ? t : null;
}
function ae(t) {
  return typeof t == "string" && t.length > 0;
}
function Qr() {
  const t = (e, r) => {
    Xr(e, r);
  };
  Hooks.on("renderChatMessageHTML", t);
}
function Xr(t, e) {
  const r = xr(t);
  if (!r || r.targets.length === 0) return;
  const a = Jr(e);
  if (!a || a.querySelector(`.${u}-chat-enrichment`)) return;
  (a.querySelector(".message-content") ?? a).append(Zr(r));
}
function Zr(t) {
  const e = document.createElement("section");
  e.classList.add(`${u}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", e.append(r), t.source && e.append(_e("Origem", t.source.name)), e.append(_e("Alvo", t.targets.map((a) => a.name).join(", "))), e;
}
function _e(t, e) {
  const r = document.createElement("p");
  r.classList.add(`${u}-chat-enrichment__row`);
  const a = document.createElement("span");
  a.textContent = `${t}: `;
  const o = document.createElement("span");
  return o.textContent = e, r.append(a, o), r;
}
function Jr(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function ea() {
  Hooks.on("preCreateChatMessage", (t, e, r, a) => {
    if (!ta(a) || !ra(t) || Oe(t) || Oe(e)) return;
    const o = zr();
    if (o.length === 0 || !Me(t) && !Me(e)) return;
    const n = wt();
    t.updateSource({
      [Gr()]: Wr(o, n)
    }), i.info("Targets capturados para ChatMessage.", { source: n, targets: o });
  });
}
function ta(t) {
  const e = game.user?.id;
  return !e || typeof t != "string" ? !0 : t === e;
}
function ra(t) {
  return !!(t && typeof t == "object" && "updateSource" in t);
}
const _ = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Rt = {
  PV: "system.attributes.hp"
}, oe = {
  PV: [_.PV, Rt.PV],
  SAN: [_.SAN],
  PE: [_.PE],
  PD: [_.PD]
}, ne = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class aa {
  getResource(e, r) {
    const a = Le(e, r);
    if (!a.ok)
      return l(a.error);
    const o = a.value, n = `${o}.value`, s = `${o}.max`, c = foundry.utils.getProperty(e, n), f = foundry.utils.getProperty(e, s), g = Ue(e, r, n, c, "valor atual");
    if (g) return l(g);
    const h = Ue(e, r, s, f, "valor máximo");
    return h ? l(h) : d({
      value: c,
      max: f
    });
  }
  async updateResourceValue(e, r, a) {
    const o = Le(e, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await e.update({ [`${o.value}.value`]: a });
  }
}
function Le(t, e) {
  const r = oa(t.type, e);
  if (r && Fe(t, r))
    return d(r);
  const a = oe[e].find(
    (o) => Fe(t, o)
  );
  return a ? d(a) : l({
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "resource-path-not-found",
    message: na(t, e),
    path: oe[e].join(" | ")
  });
}
function oa(t, e) {
  return t === "threat" ? Rt[e] ?? null : t === "agent" ? _[e] : null;
}
function Fe(t, e) {
  const r = foundry.utils.getProperty(t, `${e}.value`), a = foundry.utils.getProperty(t, `${e}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof a == "number" && Number.isFinite(a);
}
function na(t, e) {
  const r = t.type ?? "unknown", a = oe[e].join(", ");
  return `${e} não encontrado no ator ${t.name ?? "sem nome"} (${r}). Paths testados: ${a}.`;
}
function Ue(t, e, r, a, o) {
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
class sa {
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
      const s = ne.ritualItem.circleCandidates;
      return l({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: e,
        paths: [...s]
      });
    }
    const { path: a, value: o } = r, n = ia(o);
    return n ? d(n) : l({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: e,
      path: a,
      value: o
    });
  }
  readCircleFromKnownPaths(e) {
    for (const r of ne.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(e, r);
      if (a != null)
        return { path: r, value: a };
    }
    return null;
  }
}
function ia(t) {
  if (He(t))
    return t;
  if (typeof t == "string") {
    const e = t.trim();
    if (!/^\d+$/.test(e))
      return null;
    const r = Number(e);
    if (He(r))
      return r;
  }
  return null;
}
function He(t) {
  return t === 1 || t === 2 || t === 3 || t === 4;
}
const ua = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class ca {
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
    const a = r.value, o = la(e.ritual, a);
    return o.ok ? o.value ? d(o.value) : d({
      resource: "PE",
      amount: ua[a],
      source: "default-by-circle",
      circle: a
    }) : l(o.error);
  }
}
function la(t, e) {
  const r = t.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : ma(r) ? {
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
function ma(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return (e.resource === "PE" || e.resource === "PD") && typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0;
}
const G = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function da(t) {
  if (!Aa(t.item)) return null;
  const e = se(t.actor) ? t.actor : fa(t.item);
  return {
    source: "ordem-item-used-hook",
    actor: e,
    item: t.item,
    token: ga(t.token) ?? pa(e),
    targets: we(),
    message: t.message,
    chatMessageData: t.chatMessageData
  };
}
function fa(t) {
  const e = t;
  return se(e.actor) ? e.actor : se(t.parent) ? t.parent : null;
}
function pa(t) {
  const e = ha(t) ?? ya(t);
  return e ? kt(e) : null;
}
function ga(t) {
  return ie(t) ? kt(t) : null;
}
function ha(t) {
  if (!t) return null;
  const e = t, r = e.token;
  return ie(r) ? r : (e.getActiveTokens?.() ?? []).find(ie) ?? null;
}
function ya(t) {
  return t ? canvas?.tokens?.controlled?.find((e) => e.actor?.id === t.id) ?? null : null;
}
function kt(t) {
  const e = t.actor ?? null;
  return {
    tokenId: K(t.id),
    actorId: K(e?.id),
    sceneId: K(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function Aa(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function se(t) {
  return !!(t && typeof t == "object" && "update" in t && "items" in t);
}
function ie(t) {
  return !!(t && typeof t == "object" && ("actor" in t || "id" in t || "name" in t));
}
function K(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
class wa {
  constructor(e) {
    this.onItemUsed = e;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(G.ITEM_USED, (e) => {
      this.handleHook(e);
    }), this.registered = !0, i.info(`${G.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(e) {
    const r = da(Ra(e));
    if (!r) {
      i.warn(`${G.ITEM_USED} disparou sem payload de item válido.`, e);
      return;
    }
    await this.onItemUsed(r);
  }
}
function Ra(t) {
  return t && typeof t == "object" ? t : {};
}
class ka {
  async applyPresetItemPatch(e, r) {
    const a = r.itemPatch;
    if (!a) return Y("missing-item-patch");
    if (e.type !== "ritual") return Y("unsupported-item-type");
    const o = Pa(a);
    return Object.keys(o).length === 0 ? Y("empty-update") : (await e.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Pa(t) {
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
class Ta {
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
    return this.getNumber(e, ne.ritual.dt, 0);
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
class ba {
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
class $a {
  presets = /* @__PURE__ */ new Map();
  register(e) {
    const r = Ca(e);
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
    return this.list().map((r) => Ia(r, e)).filter((r) => r !== null).sort((r, a) => a.score - r.score || r.preset.id.localeCompare(a.preset.id));
  }
}
function Ca(t) {
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
function Ia(t, e) {
  if (t.matchers.length === 0)
    return null;
  const r = [];
  let a = 0;
  if (t.itemTypes.length > 0) {
    if (!t.itemTypes.includes(e.type)) return null;
    a += 10, r.push(`itemType:${e.type}`);
  }
  for (const o of t.matchers) {
    const n = Sa(o, e);
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
function Sa(t, e) {
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
      const r = qe(e.name), a = t.names.map(qe).includes(r);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Ea(e), a = r !== null && t.circles.includes(r);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function qe(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Ea(t) {
  const e = foundry.utils.getProperty(t, "system.circle"), r = typeof e == "string" ? Number(e) : e;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function Q(t) {
  return structuredClone(t);
}
function X(t) {
  return typeof t == "string" && t.length > 0;
}
function B(t, e) {
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
async function va(t, e, r) {
  if (!Ve(t.id) || !Ve(t.formula))
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
      ...r.rollRequests[t.id] ?? Pt(t, e),
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
function Pt(t, e) {
  const r = t.intent ?? Da(t.id);
  return {
    id: t.id,
    formula: t.formula,
    intent: r,
    damageType: t.damageType,
    sourceStepIndex: e
  };
}
function Da(t) {
  const e = t.toLowerCase();
  return e.includes("damage") || e.includes("dano") ? "damage" : e.includes("healing") || e.includes("heal") || e.includes("cura") ? "healing" : e.includes("attack") || e.includes("ataque") ? "attack" : e.includes("resistance") || e.includes("resistencia") || e.includes("resistência") ? "resistance" : "generic";
}
function Ve(t) {
  return typeof t == "string" && t.length > 0;
}
async function ue(t, e, r, a, o) {
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
function Na(t) {
  const { step: e, context: r, transaction: a, stepIndex: o, lifecycle: n } = t;
  if (e.operation === "damage") {
    const s = Oa(e, r, a, o);
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
    const s = Ma(e, r, a, o);
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
function Oa(t, e, r, a) {
  const o = W(t.amountFrom), n = o ? e.rolls[o] : void 0;
  return {
    id: Tt(e.id, "damage", a, e.damageInstances.length),
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
function Ma(t, e, r, a) {
  const o = W(t.amountFrom);
  return {
    id: Tt(e.id, "healing", a, e.healingInstances.length),
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
function Tt(t, e, r, a) {
  return `${t}.${e}.${r}.${a}`;
}
function _a(t, e, r) {
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
function La(t) {
  const { step: e, context: r, stepIndex: a, metadata: o, lifecycle: n } = t;
  n.emit("beforeApply", r, { stepIndex: a, step: e, metadata: o }), bt("before", t), je("before", t), je("resolve", t);
}
function Fa(t) {
  const { step: e, context: r, stepIndex: a, metadata: o, lifecycle: n } = t;
  n.emit("apply", r, { stepIndex: a, step: e, metadata: o }), bt("apply", t);
}
function Ua(t) {
  const { step: e, context: r, stepIndex: a, metadata: o, lifecycle: n } = t;
  n.emit("afterApply", r, { stepIndex: a, step: e, metadata: o });
}
function bt(t, e) {
  const { step: r, context: a, stepIndex: o, metadata: n, lifecycle: s } = e, c = Ha(t, r.operation);
  c && s.emit(c, a, {
    stepIndex: o,
    step: r,
    metadata: n
  });
}
function je(t, e) {
  const { step: r, context: a, stepIndex: o, metadata: n, lifecycle: s } = e;
  r.operation === "damage" && s.emit(t === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: o,
    step: r,
    metadata: n
  });
}
function Ha(t, e) {
  return e === "damage" ? t === "before" ? "beforeApplyDamage" : t === "apply" ? "applyDamage" : "afterApplyDamage" : e === "heal" ? t === "before" ? "beforeApplyHealing" : t === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function qa(t, e, r) {
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
async function Va(t) {
  const { step: e } = t;
  switch (e.type) {
    case "spendResource":
      return ja(t, e);
    case "spendRitualCost":
      return Ba(t, e);
  }
}
async function ja(t, e) {
  const { context: r, resources: a } = t, o = B(e, r);
  return o.ok ? $t(await a.spend(r.sourceActor, e.resource, o.value), r) : l(o.error);
}
async function Ba(t, e) {
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
  }), $t(await a.spend(r.sourceActor, s.resource, s.amount), r, e);
}
function $t(t, e, r) {
  return t.ok ? (e.resourceTransactions.push(t.value), d(void 0)) : (r?.type === "spendRitualCost" && e.ritualCosts.pop(), l({
    reason: "resource-operation-failed",
    message: t.error.message,
    cause: t.error
  }));
}
async function za(t) {
  const { step: e, context: r, stepIndex: a, lifecycle: o, execute: n } = t, s = Wa(e);
  for (const f of s.before)
    o.emit(f, r, { stepIndex: a, step: e });
  const c = await n();
  if (!c.ok)
    return c;
  for (const f of s.after)
    o.emit(f, r, { stepIndex: a, step: e });
  return c;
}
function Wa(t) {
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
class xa {
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
        return za({
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
    const o = await Va({
      step: e,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? d(void 0) : l({ ...o.error, stepIndex: a, step: e, context: r });
  }
  async runRollFormulaStepWithLifecycle(e, r, a) {
    const o = Pt(e, a);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: a, step: e, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, a, e), this.lifecycle.emit("roll", r, { stepIndex: a, step: e, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, a, e);
    const n = await this.runRollFormulaStep(e, r, a);
    if (!n.ok)
      return n;
    const s = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, a, e, s), this.lifecycle.emit("afterRoll", r, { stepIndex: a, step: e, rollRequest: o, rollResult: s }), d(void 0);
  }
  async runRollFormulaStep(e, r, a) {
    const o = await va(e, a, r);
    return o.ok ? d(void 0) : l({ ...o.error, stepIndex: a, step: e, context: r });
  }
  async runModifyResourceStepWithLifecycle(e, r, a) {
    const o = B(e, r);
    if (!o.ok)
      return l({ ...o.error, stepIndex: a, step: e, context: r });
    const n = _a(e, r, o.value);
    La({
      step: e,
      context: r,
      stepIndex: a,
      metadata: n,
      lifecycle: this.lifecycle
    }), Fa({
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
      const f = await ue(this.resources, c, e.resource, e.operation, o.value), g = this.handleResourceOperationResult(f, r, a, e);
      if (!g.ok)
        return g;
      Na({
        step: e,
        context: r,
        transaction: g.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return Ua({
      step: e,
      context: r,
      stepIndex: a,
      metadata: n,
      lifecycle: this.lifecycle
    }), d(void 0);
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
      const c = await ue(this.resources, s, e.resource, e.operation, o.value), f = this.handleResourceOperationResult(c, r, a, e);
      if (!f.ok)
        return f;
    }
    return d(void 0);
  }
  async runChatCardStep(e, r, a) {
    const o = await qa(this.messages, e, r);
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
    const c = Ga(e, r.intent);
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
function Ga(t, e) {
  return e === "damage" ? t === "before" ? "beforeDamageRoll" : t === "roll" ? "damageRoll" : "afterDamageRoll" : e === "healing" ? t === "before" ? "beforeHealingRoll" : t === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Ka {
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
function Ya(t) {
  return {
    id: Qa(),
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
function Qa() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Xa {
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
    const a = Ya(r);
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
class Za {
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
class Ja {
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
    const r = re();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: e.speaker,
      content: e.content,
      whisper: eo(),
      flags: {
        ...e.flags,
        [u]: {
          ...to(e.flags),
          debugOutput: !0
        }
      }
    }), r.console && e.data !== void 0 && i.info("Debug chat criado.", e.data), !0);
  }
  emit(e, r) {
    const a = re();
    if (!a.enabled)
      return;
    const o = r.notification ?? Be(r);
    a.console && this.emitConsole(e, r), a.ui && this.emitUi(e, o);
  }
  emitConsole(e, r) {
    const a = Be(r);
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
function Be(t) {
  return t.message ? `${t.title}: ${t.message}` : t.title;
}
function eo() {
  const t = game.users?.filter((e) => e.isGM === !0 && e.id).map((e) => e.id) ?? [];
  return t.length > 0 ? t : game.user?.id ? [game.user.id] : [];
}
function to(t) {
  const e = t?.[u];
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const ro = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Ct = `${u}-inline-roll-neutralized`, ao = `${u}-inline-roll-notice`, Re = `data-${u}-inline-roll-neutralized`, ze = `data-${u}-inline-roll-notice`, oo = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function no(t) {
  const e = Ro(t.message), r = await so(t.message), a = io(e);
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
async function so(t) {
  const e = yo(t);
  if (!e || typeof e.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = uo(e.content);
  return r.replacementCount === 0 || r.content === e.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await Ao(e, r.content), replacementCount: r.replacementCount };
}
function io(t) {
  const e = t ? wo(t) : null;
  if (!e)
    return { replacementCount: 0 };
  const r = It(e);
  return r > 0 && St(po(e)), { replacementCount: r };
}
function uo(t) {
  const e = co(t), r = document.createElement("template");
  r.innerHTML = e.content;
  const a = It(r.content), o = e.replacementCount + a;
  return o === 0 ? { content: t, replacementCount: 0 } : (St(r.content), { content: r.innerHTML, replacementCount: o });
}
function co(t) {
  let e = 0;
  return { content: t.replace(/\[\[([^\[\]]+)\]\]/g, (a, o) => (e += 1, mo(o.trim()))), replacementCount: e };
}
function It(t) {
  const e = lo(t);
  for (const r of e)
    r.replaceWith(fo(go(r)));
  return e.length;
}
function lo(t) {
  const e = /* @__PURE__ */ new Set();
  for (const r of t.querySelectorAll(ro))
    r.getAttribute(Re) !== "true" && e.add(r);
  return Array.from(e);
}
function mo(t) {
  return `<span class="${Ct}" ${Re}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${ko(t)}</span>`;
}
function fo(t) {
  const e = document.createElement("span");
  return e.classList.add(Ct), e.setAttribute(Re, "true"), e.title = "Rolagem inline ignorada pelo Paranormal Toolkit", e.textContent = t, e;
}
function St(t) {
  if (t.querySelector?.(`[${ze}="true"]`)) return;
  const e = document.createElement("p");
  e.classList.add(ao), e.setAttribute(ze, "true"), e.textContent = oo, t.append(e);
}
function po(t) {
  return t.querySelector(".message-content") ?? t;
}
function go(t) {
  const r = t.getAttribute("data-formula") ?? ho(t.getAttribute("data-roll")) ?? t.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function ho(t) {
  if (!t) return null;
  try {
    const e = JSON.parse(t);
    return typeof e.formula == "string" && e.formula.length > 0 ? e.formula : null;
  } catch {
    return null;
  }
}
function yo(t) {
  return t && typeof t == "object" ? t : null;
}
async function Ao(t, e) {
  if (typeof t.update != "function")
    return !1;
  try {
    return await Promise.resolve(t.update({ content: e })), !0;
  } catch (r) {
    return i.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function wo(t) {
  const e = Po(t);
  return document.querySelector(
    `.chat-message[data-message-id="${e}"], [data-message-id="${e}"]`
  );
}
function Ro(t) {
  if (!t || typeof t != "object") return null;
  const e = t;
  return typeof e.id == "string" && e.id.length > 0 ? e.id : null;
}
function ko(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Po(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const To = ["base", "discente", "verdadeiro"];
function bo(t) {
  switch (t) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function $o(t) {
  return typeof t == "string" && To.includes(t);
}
async function Co(t) {
  const e = Do();
  return e ? new Promise((r) => {
    let a = !1;
    const o = (n) => {
      a || (a = !0, r(n));
    };
    new e({
      title: `Conjurar ${t.ritual.name ?? "ritual"}`,
      content: Io(t),
      default: "cast",
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: () => o(null)
        },
        cast: {
          icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
          label: "Conjurar",
          callback: (n) => o(So(n, t.defaultSpendResource))
        }
      },
      close: () => o(null)
    }).render(!0);
  }) : (ui.notifications?.warn("Paranormal Toolkit: Dialog não disponível. Usando opções padrão do ritual."), {
    variant: "base",
    spendResource: t.defaultSpendResource
  });
}
function Io(t) {
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
function So(t, e) {
  const r = vo(t), a = Eo(r), o = r?.querySelector('input[name="spendResource"]')?.checked ?? e;
  return {
    variant: a,
    spendResource: o
  };
}
function Eo(t) {
  const e = t?.querySelector('input[name="variant"]:checked')?.value;
  return $o(e) ? e : "base";
}
function vo(t) {
  if (t instanceof HTMLElement) return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function Do() {
  return globalThis.Dialog ?? null;
}
function Z(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
class No {
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
    const a = this.resolveCostPreview(e), o = await Co({
      actor: e.actor,
      ritual: e.item,
      targetNames: e.targets.map((h) => h.name),
      cost: a,
      defaultSpendResource: Bo(r)
    });
    if (!o)
      return { status: "cancelled" };
    const n = Oo(r, o);
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
    const c = s.value.context, f = Mo(r, e, c), g = Ho(o, a, c);
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
    return ue(this.resources, e.actor, e.resource, e.operation, e.amount);
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
function Oo(t, e) {
  const r = [];
  for (const a of t.steps)
    a.type === "modifyResource" || a.type === "chatCard" || Et(a) && !e.spendResource || r.push(a);
  return {
    ...t,
    label: `${t.label} · Conjuração assistida`,
    steps: r
  };
}
function Mo(t, e, r) {
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
    const s = Uo(o.actor, e);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const c of s)
      a.push(_o(o, c, n.value));
  }
  return { ok: !0, actions: a };
}
function _o(t, e, r) {
  const a = e.name ?? "Ator sem nome";
  return {
    kind: "resource-operation",
    actor: e,
    actorName: a,
    resource: t.resource,
    operation: t.operation,
    amount: r,
    label: Lo(t, a, r),
    executedLabel: Fo(t, a)
  };
}
function Lo(t, e, r) {
  return t.operation === "heal" && t.resource === "PV" ? `Curar ${e} em ${r} PV` : t.operation === "damage" ? `Aplicar ${r} de dano em ${e}` : t.operation === "recover" ? `Recuperar ${r} ${t.resource} de ${e}` : t.operation === "spend" ? `Gastar ${r} ${t.resource} de ${e}` : `Aplicar ${r} ${t.resource} em ${e}`;
}
function Fo(t, e) {
  return t.operation === "heal" && t.resource === "PV" ? `✓ ${e} curado` : t.operation === "damage" ? `✓ Dano aplicado em ${e}` : t.operation === "recover" ? `✓ ${e} recuperado` : t.operation === "spend" ? `✓ Recurso gasto de ${e}` : "✓ Ação aplicada";
}
function Uo(t, e) {
  switch (t) {
    case "self":
      return e.actor ? [e.actor] : [];
    case "target":
      return e.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function Ho(t, e, r) {
  return [
    `Forma: ${bo(t.variant)}`,
    qo(t, e),
    ...Object.values(r.rolls).map(Vo)
  ];
}
function qo(t, e) {
  if (!e)
    return t.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
  const r = t.spendResource ? "gasto" : "não gasto";
  return `Custo: ${e.amount} ${e.resource} ${r}`;
}
function Vo(t) {
  return `${jo(t)}: ${t.formula} = ${Math.trunc(t.total)}`;
}
function jo(t) {
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
function Bo(t) {
  return t.steps.some(Et);
}
function Et(t) {
  return t.type === "spendResource" || t.type === "spendRitualCost";
}
const vt = "itemUsePrompts", Dt = "data-paranormal-toolkit-prompt-id", z = "data-paranormal-toolkit-pending-id", ce = "data-paranormal-toolkit-executed-label", We = "data-paranormal-toolkit-detail-key", zo = `[${z}]`, xe = `${u}-chat-enrichment`, P = `${u}-item-use-prompt`, Ge = `${P}__actions`, Ke = `${P}__details`, Wo = `${P}__summary`, xo = `${P}__title`, Nt = `${P}__button--executed`;
let Ye = !1, le = null;
const S = /* @__PURE__ */ new Map();
function Go(t) {
  le = t, !Ye && (Hooks.on("renderChatMessageHTML", (e, r) => {
    Yo(e, r, t);
  }), Ye = !0);
}
async function Qe(t) {
  const e = Ko(t);
  S.set(t.pendingId, e), await mn(e), Qo(t.pendingId);
}
async function Xe(t) {
  const e = S.get(t);
  S.delete(t), e && await dn(e);
}
function Ko(t) {
  const e = Pe(t.context.message);
  return {
    ...t,
    createdAt: Date.now(),
    messageId: e,
    itemId: t.context.item.id ?? null,
    actorId: t.context.actor?.id ?? null,
    summary: rn(t.context),
    executed: !1
  };
}
function Yo(t, e, r) {
  ln();
  const a = Ht(e);
  if (!a) return;
  const o = sn(t, a);
  for (const n of o)
    me(a, n);
  Ot(a, r);
}
function Qo(t) {
  const e = S.get(t);
  if (!e) return;
  const r = e.messageId ? un(e.messageId) : null;
  if (r) {
    me(r, e), Ze(r);
    return;
  }
  if (e.messageId) return;
  const a = cn(e);
  a && (me(a, e), Ze(a));
}
function Ze(t) {
  le && Ot(t, le);
}
function me(t, e) {
  if (t.querySelector(`[${Dt}="${Te(e.pendingId)}"]`)) return;
  const r = Xo(t, e);
  Jo(r, e.summaryLines ?? []), Zo(r).append(tn(e));
}
function Xo(t, e) {
  const r = t.querySelector(`.${xe}`);
  if (r)
    return r;
  const a = document.createElement("section");
  a.classList.add(xe, P);
  const o = document.createElement("header");
  o.classList.add(`${P}__header`);
  const n = document.createElement("strong");
  n.classList.add(xo), n.textContent = e.title ?? "Paranormal Toolkit";
  const s = document.createElement("span");
  return s.classList.add(Wo), s.textContent = e.summary, o.append(n, s), a.append(o), on(t).append(a), a;
}
function Zo(t) {
  const e = t.querySelector(`.${Ge}`);
  if (e)
    return e;
  const r = document.createElement("div");
  return r.classList.add(Ge), t.append(r), r;
}
function Jo(t, e) {
  if (e.length === 0) return;
  const r = en(t);
  for (const a of e) {
    const o = gn(a);
    if (r.querySelector(`[${We}="${Te(o)}"]`)) continue;
    const n = document.createElement("li");
    n.textContent = a, n.setAttribute(We, o), r.append(n);
  }
}
function en(t) {
  const e = t.querySelector(`.${Ke}`);
  if (e)
    return e;
  const r = document.createElement("ul");
  return r.classList.add(Ke), t.append(r), r;
}
function tn(t) {
  const e = document.createElement("button");
  return e.type = "button", e.classList.add(`${P}__button`), e.setAttribute(Dt, t.pendingId), t.executed ? (e.disabled = !0, e.textContent = t.executedLabel ?? "✓ Automação aplicada", e.classList.add(Nt), e) : (e.textContent = t.buttonLabel ?? "Aplicar automação", e.setAttribute(z, t.pendingId), e.setAttribute(ce, t.executedLabel ?? "✓ Automação aplicada"), e);
}
function rn(t) {
  const e = t.actor?.name ?? t.token?.name ?? "Origem não resolvida", r = an(t);
  return `${e} → ${r}`;
}
function an(t) {
  return t.targets.length > 0 ? t.targets.map((e) => e.name).join(", ") : "nenhum alvo";
}
function on(t) {
  return t.querySelector(".message-content") ?? t;
}
function Ot(t, e) {
  const r = Ht(t);
  if (!r) return;
  const a = r.querySelectorAll(zo);
  for (const o of a)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      nn(o, e);
    }));
}
async function nn(t, e) {
  const r = t.getAttribute(z);
  if (!r) return;
  t.disabled = !0;
  const a = t.textContent;
  if (t.textContent = "Aplicando...", await e(r)) {
    t.textContent = t.getAttribute(ce) ?? "✓ Automação aplicada", t.classList.add(Nt), t.removeAttribute(z), t.removeAttribute(ce);
    return;
  }
  t.disabled = !1, t.textContent = a;
}
function sn(t, e) {
  const r = /* @__PURE__ */ new Map();
  for (const a of S.values())
    de(a, t, e) && r.set(a.pendingId, a);
  for (const a of fn(t))
    de(a, t, e) && !r.has(a.pendingId) && r.set(a.pendingId, a);
  return Array.from(r.values()).sort((a, o) => a.createdAt - o.createdAt);
}
function de(t, e, r) {
  const a = Pe(e) ?? r.dataset.messageId ?? null;
  return t.messageId ? t.messageId === a : !t.itemId || !Je(r, "itemId", t.itemId) ? !1 : !t.actorId || Je(r, "actorId", t.actorId);
}
function Je(t, e, r) {
  if (t.dataset[e] === r)
    return !0;
  const a = `data-${hn(e)}`;
  for (const o of t.querySelectorAll(`[${a}]`))
    if (o.getAttribute(a) === r)
      return !0;
  return !1;
}
function un(t) {
  const e = Te(t);
  return document.querySelector(
    `.chat-message[data-message-id="${e}"], [data-message-id="${e}"]`
  );
}
function cn(t) {
  for (const e of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (de(t, null, e))
      return e;
  return null;
}
function ln() {
  const t = Date.now(), e = 300 * 1e3;
  for (const [r, a] of S.entries())
    t - a.createdAt > e && S.delete(r);
}
async function mn(t) {
  const e = Lt(t.context.message);
  if (e)
    try {
      const r = ke(e);
      r[t.pendingId] = _t(t), await Mt(e, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r);
    }
}
async function dn(t) {
  const e = Lt(t.context.message);
  if (e)
    try {
      const r = ke(e), a = r[t.pendingId] ?? _t(t);
      r[t.pendingId] = {
        ...a,
        executed: !0
      }, await Mt(e, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function fn(t) {
  return Object.values(ke(fe(t))).filter(Ft);
}
function ke(t) {
  if (!t) return {};
  const e = t.getFlag?.(u, vt);
  if (!Ut(e))
    return {};
  const r = {};
  for (const [a, o] of Object.entries(e))
    Ft(o) && (r[a] = o);
  return r;
}
async function Mt(t, e) {
  typeof t.setFlag == "function" && await Promise.resolve(t.setFlag(u, vt, e));
}
function _t(t) {
  return {
    schemaVersion: 1,
    pendingId: t.pendingId,
    mode: t.mode,
    title: t.title,
    buttonLabel: t.buttonLabel,
    executedLabel: t.executedLabel,
    summaryLines: t.summaryLines ? [...t.summaryLines] : void 0,
    createdAt: t.createdAt,
    messageId: t.messageId,
    itemId: t.itemId,
    actorId: t.actorId,
    summary: t.summary,
    executed: t.executed
  };
}
function Lt(t) {
  const e = fe(t);
  if (e?.setFlag)
    return e;
  const r = Pe(t);
  if (!r) return null;
  const a = game.messages;
  return fe(a?.get?.(r));
}
function fe(t) {
  return t && typeof t == "object" ? t : null;
}
function Ft(t) {
  return Ut(t) ? t.schemaVersion === 1 && typeof t.pendingId == "string" && t.mode === "ask" && typeof t.createdAt == "number" && typeof t.summary == "string" && typeof t.executed == "boolean" && J(t.messageId) && J(t.itemId) && J(t.actorId) && ee(t.title) && ee(t.buttonLabel) && ee(t.executedLabel) && pn(t.summaryLines) : !1;
}
function Ut(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function J(t) {
  return t === null || typeof t == "string";
}
function ee(t) {
  return t === void 0 || typeof t == "string";
}
function pn(t) {
  return t === void 0 || Array.isArray(t) && t.every((e) => typeof e == "string");
}
function Ht(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function Pe(t) {
  if (!t || typeof t != "object") return null;
  const e = t;
  return typeof e.id == "string" && e.id.length > 0 ? e.id : null;
}
function gn(t) {
  return t.trim().toLowerCase();
}
function hn(t) {
  return t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
}
function Te(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const et = 1e3;
class yn {
  constructor(e, r, a, o) {
    this.workflow = e, this.debugOutput = o, this.ritualAssistant = new No(e, r, a);
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
      settings: ve(),
      strategies: this.strategies.map((e) => e.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(e) {
    const r = ve();
    if (r.executionMode === "disabled") {
      this.setAttempt(e, "skipped", "execution-mode-disabled");
      return;
    }
    const a = ge(e.item);
    if (!a.ok) {
      const o = a.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(e, o, a.error.reason), a.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: a.error.message,
        data: a.error
      });
      return;
    }
    if (await no(e), !e.actor) {
      this.setAttempt(e, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${e.item.name}.`,
        data: tt(e, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(e), await Xe(e), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const a = await this.ritualAssistant.applyAction(r.action);
    return a.ok ? (r.workflowContext.resourceTransactions.push(a.value), this.pendingExecutions.delete(e), await Xe(e), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Go((e) => this.executePendingAutomation(e)), this.promptRendererRegistered = !0);
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
        await this.registerAssistedResourceActions(e, a.workflowContext, a.actions, a.summaryLines);
        return;
    }
  }
  async registerAssistedResourceActions(e, r, a, o) {
    let n;
    for (const s of a) {
      const c = at();
      n ??= c, this.pendingExecutions.set(c, {
        kind: "resource-action",
        id: c,
        action: s,
        context: e,
        workflowContext: r,
        createdAt: Date.now()
      }), await Qe({
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
    const a = at();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: r,
      context: e,
      mode: "ask",
      createdAt: Date.now()
    }), await Qe({
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
    const r = Date.now(), a = rt(e);
    for (const [n, s] of this.recentExecutionKeys.entries())
      r - s > et && this.recentExecutionKeys.delete(n);
    const o = this.recentExecutionKeys.get(a);
    return o !== void 0 && r - o <= et;
  }
  markExecution(e) {
    this.recentExecutionKeys.set(rt(e), Date.now());
  }
  setAttempt(e, r, a, o) {
    this.lastAttempt = tt(e, r, a, o);
  }
}
function tt(t, e, r, a) {
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
function rt(t) {
  const e = t.actor?.id ?? "no-actor", r = t.item.uuid ?? t.item.id ?? t.item.name ?? "unknown-item";
  return `${e}:${r}`;
}
function at() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class An {
  constructor(e) {
    this.debugOutput = e;
  }
  debugOutput;
  async createResourceOperationMessage(e) {
    const r = this.createResourceOperationContent(e.transaction), a = ye(e.transaction);
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
    const r = p(e.actorName), a = p(e.resource), o = p(ot(e)), n = p(Rn(e));
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
      (m) => `<li><strong>${p(m.id)}:</strong> ${p(m.formula)} = ${m.total} <em>(${p(wn(m.intent))})</em>${m.damageType ? ` — ${p(m.damageType)}` : ""}</li>`
    ), g = e.ritualCosts.map(
      (m) => `<li><strong>${p(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${p(m.resource)} (${p(kn(m.source))})</li>`
    ), h = e.damageInstances.map(
      (m) => `<li><strong>${p(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${p(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), R = e.healingInstances.map(
      (m) => `<li><strong>${p(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), N = e.resourceTransactions.map(
      (m) => `<li><strong>${p(m.actorName)}:</strong> ${p(ot(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
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
          ${R.length > 0 ? `<p><strong>Cura:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${N.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${N.join("")}</ul>` : ""}
          ${O.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${O}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function wn(t) {
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
function ot(t) {
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
function Rn(t) {
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
function kn(t) {
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
function Pn() {
  const t = new aa(), e = new Ka(t), r = new sa(), a = new ca(r), o = new Ta(t), n = new $a(), s = n.registerMany(yr());
  if (!s.ok)
    throw new Error(s.error.message);
  const c = new ba(), f = new ka(), g = new Ja(), h = new An(g), R = new Za(), N = new xa(e, a, h, R), O = new Xa(N, R), m = new yn(O, e, a, g);
  return m.addStrategy(new wa((qt) => m.handleItemUsed(qt))), {
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
    workflowHooks: R,
    automation: N,
    workflow: O,
    itemUseIntegration: m
  };
}
let L = null;
Hooks.once("init", () => {
  pr(), _r(), i.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Ne.isSupportedSystem()) {
    i.warn(
      `Sistema não suportado: ${Ne.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  L = Pn(), L.itemUseIntegration.registerStrategies(), Br(L), ea(), Qr(), i.info("Inicializado para o sistema Ordem Paranormal."), i.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Vt} inicializado.`);
});
function Tn() {
  if (!L)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return L;
}
export {
  Tn as getToolkitServices
};
//# sourceMappingURL=main.js.map
