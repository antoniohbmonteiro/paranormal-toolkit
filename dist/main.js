const u = "paranormal-toolkit", Wt = "Paranormal Toolkit", Gt = "ordemparanormal";
class U {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function pe(e) {
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
class i {
  static info(t, ...r) {
    console.log(`${u} | ${t}`, ...r);
  }
  static warn(t, ...r) {
    console.warn(`${u} | ${t}`, ...r);
  }
  static error(t, ...r) {
    console.error(`${u} | ${t}`, ...r);
  }
}
function d(e) {
  return { ok: !0, value: e };
}
function c(e) {
  return { ok: !1, error: e };
}
function ge(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? c({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : nt(t) ? d(t.definition) : c({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Kt(e) {
  return nt(e.getFlag(u, "automation"));
}
function nt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Qt(t.source) && Yt(t.definition);
}
function Yt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(Xt);
}
function Qt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function Xt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Zt(t);
    case "spendRitualCost":
      return Jt(t);
    case "rollFormula":
      return er(t);
    case "modifyResource":
      return tr(t);
    case "chatCard":
      return rr(t);
    default:
      return !1;
  }
}
function Zt(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && st(t);
}
function Jt(e) {
  return e.type === "spendRitualCost";
}
function er(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || sr(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function tr(e) {
  const t = e;
  return t.type === "modifyResource" && ar(t.actor) && or(t.resource) && nr(t.operation) && st(t);
}
function rr(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function st(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function ar(e) {
  return e === "self" || e === "target";
}
function or(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function nr(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function sr(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function he(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(Te);
    if (cr(t))
      return Array.from(t).filter(Te);
  }
  return [];
}
function ir(e) {
  return he(e)[0] ?? null;
}
function ur(e) {
  return he(e).find(Kt) ?? null;
}
function cr(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Te(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function it(e) {
  return he(e).filter((t) => t.type === "ritual");
}
function ut(e) {
  return it(e)[0] ?? null;
}
function lr(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(pe);
      return i.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = _("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = H(t);
      if (!r) return [];
      const a = e.automationRegistry.findForItem(r).map(Ie);
      return i.info(`Presets encontrados para ${r.name}.`, a), a;
    },
    async applyPresetToFirstRitual(t) {
      const r = _("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const a = H(r);
      if (!a) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        i.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const n = await te(e, a, o.value);
      i.info(`Preset ${o.value.id} aplicado em ${a.name}.`, { itemPatch: n }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = _("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = H(t);
      if (!r) return;
      const a = e.automationRegistry.findForItem(r)[0];
      if (!a) {
        i.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const o = await te(e, r, a.preset);
      i.info(`Melhor preset aplicado em ${r.name}.`, { match: Ie(a), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return $e(e);
    },
    async applyBestPresetsToActorRituals() {
      return $e(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = _("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = H(t);
      r && (await e.automationBinder.clear(r), i.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function $e(e) {
  const t = _("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = it(t);
  if (r.length === 0)
    return i.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Ce(t);
  const a = Ce(t, r.length);
  for (const o of r) {
    const n = e.automationRegistry.findForItem(o)[0];
    if (!n) {
      a.skipped.push({
        itemId: o.id ?? null,
        itemName: o.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await te(e, o, n.preset);
    a.applied.push(mr(o, n, s));
  }
  return i.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, a), dr(a), a;
}
async function te(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function mr(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: pe(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function Ce(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function dr(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((a) => a.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function Ie(e) {
  return {
    preset: pe(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function _(e) {
  const t = U.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function H(e) {
  const t = ut(e);
  return t || (i.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function S(e) {
  return e ? {
    id: e.id,
    source: {
      ...fr(e.sourceActor),
      token: e.sourceToken
    },
    item: pr(e.item),
    targets: e.targets.map(gr),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Se(e.rollRequests, ct),
    rolls: Se(e.rolls, hr),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(ye),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function ye(e) {
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
function fr(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function pr(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function gr(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function ct(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function hr(e) {
  return {
    ...ct(e),
    total: e.total
  };
}
function Se(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, a]) => [r, t(a)]));
}
function yr(e) {
  return {
    getSelected() {
      return U.getSelectedActor();
    },
    logResources() {
      const t = T(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const r = e.ordem.getActorSnapshot(t);
      i.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && i.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(t) {
      await v(
        e,
        "Gasto de PE",
        T("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await v(
        e,
        "Gasto de PD",
        T("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await v(
        e,
        "Dano em PV",
        T("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await v(
        e,
        "Cura de PV",
        T("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await v(
        e,
        "Dano em SAN",
        T("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await v(
        e,
        "Recuperação de SAN",
        T("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function v(e, t, r, a) {
  if (!r) return;
  const o = await a(r);
  if (!o.ok) {
    Ar(o.error);
    return;
  }
  const n = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: n });
  } catch (s) {
    i.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  i.info(`${t} realizado:`, ye(n));
}
function T(e) {
  const t = U.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ar(e) {
  if (e.reason === "update-failed") {
    i.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    i.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  i.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const w = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Rr() {
  V(w.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), V(w.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), V(w.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), V(w.chat, {
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
async function k(e, t) {
  await game.settings.set(u, w[e], t);
}
function V(e, t) {
  game.settings.register(u, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function q(e) {
  return game.settings.get(u, e) === !0;
}
function wr() {
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
const lt = "ritual.costOnly", mt = "ritual.simpleHealing", kr = "ritual.eletrocussao", dt = "ritual.simpleDamage", ft = "generic.simpleHealing", pt = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Pr() {
  return [
    br(),
    Tr(),
    $r(),
    Cr(),
    Ir()
  ];
}
function br() {
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
function Tr() {
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
    itemPatch: Er()
  };
}
function $r() {
  return {
    id: kr,
    version: "1.0.0",
    label: "Eletrocussão",
    description: "Preset inicial de dano de energia. Gasta o custo do ritual, rola dano conforme a forma escolhida e prepara ação assistida para aplicar dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["eletrocussao", "eletrocucao"]
      }
    ],
    automation: Sr(),
    itemPatch: vr()
  };
}
function Cr() {
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
function Ir() {
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
function gt(e = "2d8+2") {
  return ht(
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
function Sr() {
  return {
    ...Ae("1d8", {
      label: "Eletrocussão",
      title: "Eletrocussão",
      damageType: "energia",
      message: "Gasta o custo do ritual, rola dano de energia e prepara aplicação de dano em PV do alvo. Resistência deve ser resolvida manualmente por enquanto."
    }),
    ritualForms: {
      base: {
        label: "Padrão",
        rollFormulaOverrides: {
          damage: "1d8"
        }
      },
      discente: {
        label: "Discente",
        extraCost: 2,
        rollFormulaOverrides: {
          damage: "3d8"
        }
      },
      verdadeiro: {
        label: "Verdadeiro",
        extraCost: 5,
        rollFormulaOverrides: {
          damage: "6d8"
        },
        notes: ["Se o alvo falhar na Fortitude, aplique Atordoado por 1 rodada manualmente."]
      }
    }
  };
}
function Ae(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", a = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", n = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return ht(
    {
      version: 1,
      label: r,
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
          title: a,
          message: n
        }
      ]
    },
    "damage",
    e
  );
}
function Er() {
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
      resistance: "",
      studentForm: !1,
      trueForm: !1
    }
  };
}
function vr() {
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
      resistance: "reducesByHalf",
      studentForm: !0,
      trueForm: !0
    }
  };
}
function ht(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((a) => a.type !== "rollFormula" || a.id !== t ? a : {
      ...a,
      formula: r
    })
  };
}
function Re() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: D(t.id),
    actorId: D(t.actor?.id),
    sceneId: D(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function yt() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: D(e.id),
    actorId: D(t?.id),
    sceneId: D(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function D(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Dr(e) {
  return {
    logFirstRitualCost() {
      const t = $("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const r = C(t);
      if (!r) return;
      const a = e.ritualCosts.getCost({ actor: t, ritual: r });
      if (!a.ok) {
        i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      i.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: r.name,
        cost: a.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${r.name} custa ${a.value.amount} ${a.value.resource} (${a.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, r = "PE") {
      const a = $("Nenhum ator encontrado para configurar custo customizado.");
      if (!a) return;
      const o = C(a);
      if (o) {
        if (!Or(t, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(u, "ritual.cost", {
          resource: r,
          amount: t
        }), i.info(`Custo customizado aplicado em ${o.name}.`, { resource: r, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = $("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = C(t);
      r && (await r.unsetFlag(u, "ritual.cost"), i.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = $("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = C(t);
      if (!r) return;
      const a = e.automationRegistry.require(lt);
      if (!a.ok) {
        i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value), i.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = $("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const a = C(r);
      if (!a) return;
      if (!Ee(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(mt);
      if (!o.ok) {
        i.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, o.value, {
        definition: gt(t)
      }), i.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = $("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const a = C(r);
      if (!a) return;
      if (!Ee(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(dt);
      if (!o.ok) {
        i.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, o.value, {
        definition: Ae(t)
      }), i.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = $("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = C(t);
      r && await Fr(e, t, r);
    }
  };
}
async function Fr(e, t, r) {
  const a = ge(r);
  if (!a.ok) {
    i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: yt(),
    item: r,
    targets: Re()
  });
  if (!o.ok) {
    Nr(o.error);
    return;
  }
  i.info("Automação de ritual executada com sucesso.", S(o.value.context));
}
function Nr(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    i.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    i.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  i.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function $(e) {
  const t = U.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function C(e) {
  const t = ut(e);
  return t || (i.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Or(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Ee(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const _r = ["disabled", "ask", "automatic"], Mr = ["buttons", "confirm"], At = "ask";
function Lr(e) {
  return typeof e == "string" && _r.includes(e);
}
function Ur(e) {
  return typeof e == "string" && Mr.includes(e);
}
function Hr(e) {
  return Lr(e) ? e : Ur(e) ? "ask" : At;
}
const B = {
  executionMode: "itemUse.executionMode",
  autoRun: "itemUse.autoRun.enabled"
};
function Vr() {
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
    default: At
  }), game.settings.register(u, B.autoRun, {
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
    executionMode: Hr(game.settings.get(u, B.executionMode))
  };
}
async function I(e) {
  await game.settings.set(u, B.executionMode, e);
}
function qr(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await I("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await I("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await I(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await I("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await I("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await I("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await I("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const jr = [
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
function Br(e) {
  return {
    phases() {
      return jr;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = G("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = ur(t);
      if (!r) {
        i.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await De(e, t, r);
    },
    async runSelectedItemAutomation() {
      await this.runFirstAutomation();
    },
    async runItemAutomationByUuid(t) {
      if (!t || typeof t != "string") {
        ui.notifications?.warn("Paranormal Toolkit: UUID inválido.");
        return;
      }
      const r = await fromUuid(t);
      if (!Wr(r)) {
        i.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = xr(r) ?? G("Nenhum ator encontrado para executar automação do item.");
      a && await De(e, a, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = G("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = ir(t);
      if (!r) {
        i.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = e.automationRegistry.require(ft);
        if (!a.ok) {
          i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(r, a.value), i.info(`Preset de teste aplicado ao item: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${r.name}.`);
      } catch (a) {
        i.error("Falha ao configurar automação de teste no item.", a), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function De(e, t, r) {
  const a = ge(r);
  if (!a.ok) {
    i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: yt(),
    item: r,
    targets: Re()
  });
  if (!o.ok) {
    zr(o.error);
    return;
  }
  i.info("Automação executada com sucesso.", S(o.value.context));
}
function zr(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    i.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    i.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  i.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function G(e) {
  const t = U.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function xr(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Wr(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Gr(e) {
  const t = yr(e), r = lr(e), a = Dr(e), o = Br(e), n = wr(), s = qr(e);
  return {
    actor: t,
    automation: r,
    ritual: a,
    workflow: o,
    output: n,
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
function Kr(e) {
  const t = {
    services: e,
    ordem: e.ordem,
    resources: e.resources,
    ritualCosts: e.ritualCosts,
    automation: e.automation,
    automationRegistry: e.automationRegistry,
    automationBinder: e.automationBinder,
    workflow: e.workflow,
    itemUseIntegration: e.itemUseIntegration,
    debug: Gr(e)
  }, r = globalThis;
  return r[u] = t, r.ParanormalToolkit = t, t;
}
class Fe {
  static isSupportedSystem() {
    return game.system.id === Gt;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Yr() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: F(t.id),
    actorId: F(t.actor?.id),
    sceneId: F(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Rt() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, r = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: F(e.id),
    actorId: F(t?.id),
    sceneId: F(e.scene?.id),
    name: r
  };
}
function Qr(e, t = Rt()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Xr(e) {
  if (!ea(e)) return null;
  const t = e.getFlag(u, "workflow");
  return Jr(t) ? t : null;
}
function Zr() {
  return `flags.${u}.workflow`;
}
function Ne(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), r = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || r !== void 0;
}
function Oe(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return ae(t) || ae(r);
}
function Jr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function ea(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function F(e) {
  return ae(e) ? e : null;
}
function ae(e) {
  return typeof e == "string" && e.length > 0;
}
function ta() {
  const e = (t, r) => {
    ra(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function ra(e, t) {
  const r = Xr(e);
  if (!r || r.targets.length === 0) return;
  const a = oa(t);
  if (!a || a.querySelector(`.${u}-chat-enrichment`)) return;
  (a.querySelector(".message-content") ?? a).append(aa(r));
}
function aa(e) {
  const t = document.createElement("section");
  t.classList.add(`${u}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(_e("Origem", e.source.name)), t.append(_e("Alvo", e.targets.map((a) => a.name).join(", "))), t;
}
function _e(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${u}-chat-enrichment__row`);
  const a = document.createElement("span");
  a.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, r.append(a, o), r;
}
function oa(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function na() {
  Hooks.on("preCreateChatMessage", (e, t, r, a) => {
    if (!sa(a) || !ia(e) || Ne(e) || Ne(t)) return;
    const o = Yr();
    if (o.length === 0 || !Oe(e) && !Oe(t)) return;
    const n = Rt();
    e.updateSource({
      [Zr()]: Qr(o, n)
    }), i.info("Targets capturados para ChatMessage.", { source: n, targets: o });
  });
}
function sa(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function ia(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const M = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, wt = {
  PV: "system.attributes.hp"
}, oe = {
  PV: [M.PV, wt.PV],
  SAN: [M.SAN],
  PE: [M.PE],
  PD: [M.PD]
}, ne = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class ua {
  getResource(t, r) {
    const a = Me(t, r);
    if (!a.ok)
      return c(a.error);
    const o = a.value, n = `${o}.value`, s = `${o}.max`, l = foundry.utils.getProperty(t, n), f = foundry.utils.getProperty(t, s), g = Ue(t, r, n, l, "valor atual");
    if (g) return c(g);
    const h = Ue(t, r, s, f, "valor máximo");
    return h ? c(h) : d({
      value: l,
      max: f
    });
  }
  async updateResourceValue(t, r, a) {
    const o = Me(t, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: a });
  }
}
function Me(e, t) {
  const r = ca(e.type, t);
  if (r && Le(e, r))
    return d(r);
  const a = oe[t].find(
    (o) => Le(e, o)
  );
  return a ? d(a) : c({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: la(e, t),
    path: oe[t].join(" | ")
  });
}
function ca(e, t) {
  return e === "threat" ? wt[t] ?? null : e === "agent" ? M[t] : null;
}
function Le(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), a = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof a == "number" && Number.isFinite(a);
}
function la(e, t) {
  const r = e.type ?? "unknown", a = oe[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${a}.`;
}
function Ue(e, t, r, a, o) {
  return a == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${o} de ${t} não encontrado: ${r}.`,
    path: r,
    value: a
  } : typeof a != "number" || !Number.isFinite(a) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${o} de ${t} em ${r}.`,
    path: r,
    value: a
  } : null;
}
class ma {
  isRitual(t) {
    return t.type === "ritual";
  }
  getCircle(t) {
    if (!this.isRitual(t))
      return c({
        reason: "not-a-ritual",
        message: `Item ${t.name ?? "sem nome"} não é um ritual.`,
        ritual: t
      });
    const r = this.readCircleFromKnownPaths(t);
    if (!r) {
      const s = ne.ritualItem.circleCandidates;
      return c({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: a, value: o } = r, n = da(o);
    return n ? d(n) : c({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: a,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of ne.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(t, r);
      if (a != null)
        return { path: r, value: a };
    }
    return null;
  }
}
function da(e) {
  if (He(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (He(r))
      return r;
  }
  return null;
}
function He(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const fa = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class pa {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const r = this.ritualAdapter.getCircle(t.ritual);
    if (!r.ok)
      return c({
        ...r.error,
        actor: t.actor
      });
    const a = r.value, o = ga(t.ritual, a);
    return o.ok ? o.value ? d(o.value) : d({
      resource: "PE",
      amount: fa[a],
      source: "default-by-circle",
      circle: a
    }) : c(o.error);
  }
}
function ga(e, t) {
  const r = e.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : ha(r) ? {
    ok: !0,
    value: {
      resource: r.resource,
      amount: r.amount,
      source: "custom-flag",
      circle: t
    }
  } : {
    ok: !1,
    error: {
      reason: "invalid-custom-cost",
      message: `Custo customizado do ritual ${e.name ?? "sem nome"} é inválido.`,
      ritual: e,
      value: r
    }
  };
}
function ha(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const K = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function ya(e) {
  if (!ba(e.item)) return null;
  const t = se(e.actor) ? e.actor : Aa(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: wa(e.token) ?? Ra(t),
    targets: Re(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Aa(e) {
  const t = e;
  return se(t.actor) ? t.actor : se(e.parent) ? e.parent : null;
}
function Ra(e) {
  const t = ka(e) ?? Pa(e);
  return t ? kt(t) : null;
}
function wa(e) {
  return ie(e) ? kt(e) : null;
}
function ka(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return ie(r) ? r : (t.getActiveTokens?.() ?? []).find(ie) ?? null;
}
function Pa(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function kt(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Y(e.id),
    actorId: Y(t?.id),
    sceneId: Y(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ba(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function se(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function ie(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Y(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Ta {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(K.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, i.info(`${K.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = ya($a(t));
    if (!r) {
      i.warn(`${K.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function $a(e) {
  return e && typeof e == "object" ? e : {};
}
class Ca {
  async applyPresetItemPatch(t, r) {
    const a = r.itemPatch;
    if (!a) return Q("missing-item-patch");
    if (t.type !== "ritual") return Q("unsupported-item-type");
    const o = Ia(a);
    return Object.keys(o).length === 0 ? Q("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Ia(e) {
  const t = {};
  y(t, "name", e.name), y(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (y(t, "system.circle", r.circle), y(t, "system.element", r.element), y(t, "system.target", r.target), y(t, "system.targetQtd", r.targetQuantity), y(t, "system.execution", r.execution), y(t, "system.range", r.range), y(t, "system.duration", r.duration), y(t, "system.skillResis", r.resistanceSkill), y(t, "system.resistance", r.resistance), y(t, "system.studentForm", r.studentForm), y(t, "system.trueForm", r.trueForm)), t;
}
function y(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function Q(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Sa {
  constructor(t) {
    this.resourceAdapter = t;
  }
  resourceAdapter;
  getActorSnapshot(t) {
    const r = this.getResources(t);
    return {
      id: t.id ?? null,
      name: t.name ?? "Ator sem nome",
      type: t.type ?? "unknown",
      resources: r.values,
      resourceErrors: r.errors,
      ritualDT: this.getRitualDT(t)
    };
  }
  getRitualDT(t) {
    return this.getNumber(t, ne.ritual.dt, 0);
  }
  getResources(t) {
    const r = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, a = [];
    for (const o of ["PV", "SAN", "PE", "PD"]) {
      const n = this.resourceAdapter.getResource(t, o);
      n.ok ? r[o] = n.value : a.push(n.error);
    }
    return { values: r, errors: a };
  }
  getNumber(t, r, a) {
    const o = foundry.utils.getProperty(t, r);
    return typeof o == "number" && Number.isFinite(o) ? o : a;
  }
}
class Ea {
  async applyPreset(t, r, a = {}) {
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
    return await this.writeAutomationFlag(t, o), o;
  }
  async applyManualDefinition(t, r, a = r.label) {
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
    return await this.writeAutomationFlag(t, o), o;
  }
  async clear(t) {
    await t.unsetFlag(u, "automation");
  }
  async writeAutomationFlag(t, r) {
    await this.clear(t), await t.setFlag(u, "automation", r);
  }
}
class va {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = Da(t);
    return r.ok ? this.presets.has(t.id) ? c({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, X(t)), d(t)) : r;
  }
  registerMany(t) {
    const r = [];
    for (const a of t) {
      const o = this.register(a);
      if (!o.ok)
        return o;
      r.push(o.value);
    }
    return d(r);
  }
  get(t) {
    const r = this.presets.get(t);
    return r ? X(r) : null;
  }
  require(t) {
    const r = this.get(t);
    return r ? d(r) : c({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(X);
  }
  findForItem(t) {
    return this.list().map((r) => Fa(r, t)).filter((r) => r !== null).sort((r, a) => a.score - r.score || r.preset.id.localeCompare(a.preset.id));
  }
}
function Da(e) {
  return !Z(e.id) || !Z(e.version) || !Z(e.label) ? c({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? c({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : d(e);
}
function Fa(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let a = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    a += 10, r.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const n = Na(o, t);
    if (!n.matches)
      return null;
    a += n.score, r.push(n.reason);
  }
  return {
    preset: e,
    score: a,
    reasons: r
  };
}
function Na(e, t) {
  switch (e.type) {
    case "itemType": {
      const r = e.itemTypes.includes(t.type);
      return {
        matches: r,
        score: r ? 10 : 0,
        reason: `itemType:${t.type}`
      };
    }
    case "normalizedName": {
      const r = Ve(t.name), a = e.names.map(Ve).includes(r);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Oa(t), a = r !== null && e.circles.includes(r);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function Ve(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Oa(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function X(e) {
  return structuredClone(e);
}
function Z(e) {
  return typeof e == "string" && e.length > 0;
}
function z(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? c({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : d(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = W(e.amountFrom);
    if (!r)
      return c({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const a = t.rolls[r];
    if (!a)
      return c({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${r}.`
      });
    const o = Math.trunc(a.total);
    return !Number.isInteger(o) || o <= 0 ? c({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${r} não gerou um amount positivo.`
    }) : d(o);
  }
  return c({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function W(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function _a(e, t, r) {
  if (!qe(e.id) || !qe(e.formula))
    return c({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const a = new Roll(e.formula), o = await Promise.resolve(a.evaluate()), n = o.total;
    if (typeof n != "number" || !Number.isFinite(n))
      return c({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    const l = {
      ...r.rollRequests[e.id] ?? Pt(e, t),
      total: n,
      roll: o
    };
    return r.rolls[e.id] = l, d(l);
  } catch (a) {
    return c({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: a
    });
  }
}
function Pt(e, t) {
  const r = e.intent ?? Ma(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function Ma(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function qe(e) {
  return typeof e == "string" && e.length > 0;
}
async function ue(e, t, r, a, o) {
  switch (a) {
    case "spend":
      return r !== "PE" && r !== "PD" ? j(t, r, a, o) : e.spend(t, r, o);
    case "damage":
      return r !== "PV" && r !== "SAN" ? j(t, r, a, o) : e.damage(t, r, o);
    case "heal":
      return r !== "PV" ? j(t, r, a, o) : e.heal(t, r, o);
    case "recover":
      return r !== "SAN" ? j(t, r, a, o) : e.recover(t, r, o);
  }
}
function j(e, t, r, a) {
  return c({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    resource: t,
    operation: r,
    reason: "invalid-resource-operation",
    message: `Operação ${r} não é válida para ${t}.`,
    requestedAmount: a
  });
}
function La(e) {
  const { step: t, context: r, transaction: a, stepIndex: o, lifecycle: n } = e;
  if (t.operation === "damage") {
    const s = Ua(t, r, a, o);
    r.damageInstances.push(s), n.emit("afterDamageResolution", r, {
      stepIndex: o,
      step: t,
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
      step: t,
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
  if (t.operation === "heal") {
    const s = Ha(t, r, a, o);
    r.healingInstances.push(s), n.emit("afterApplyHealing", r, {
      stepIndex: o,
      step: t,
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
function Ua(e, t, r, a) {
  const o = W(e.amountFrom), n = o ? t.rolls[o] : void 0;
  return {
    id: bt(t.id, "damage", a, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: o ?? void 0,
    damageType: n?.damageType,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Ha(e, t, r, a) {
  const o = W(e.amountFrom);
  return {
    id: bt(t.id, "healing", a, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: o ?? void 0,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function bt(e, t, r, a) {
  return `${e}.${t}.${r}.${a}`;
}
function Va(e, t, r) {
  const a = W(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    amountFrom: e.amountFrom,
    rollId: a,
    rollIntent: o?.intent,
    damageType: o?.damageType
  };
}
function qa(e) {
  const { step: t, context: r, stepIndex: a, metadata: o, lifecycle: n } = e;
  n.emit("beforeApply", r, { stepIndex: a, step: t, metadata: o }), Tt("before", e), je("before", e), je("resolve", e);
}
function ja(e) {
  const { step: t, context: r, stepIndex: a, metadata: o, lifecycle: n } = e;
  n.emit("apply", r, { stepIndex: a, step: t, metadata: o }), Tt("apply", e);
}
function Ba(e) {
  const { step: t, context: r, stepIndex: a, metadata: o, lifecycle: n } = e;
  n.emit("afterApply", r, { stepIndex: a, step: t, metadata: o });
}
function Tt(e, t) {
  const { step: r, context: a, stepIndex: o, metadata: n, lifecycle: s } = t, l = za(e, r.operation);
  l && s.emit(l, a, {
    stepIndex: o,
    step: r,
    metadata: n
  });
}
function je(e, t) {
  const { step: r, context: a, stepIndex: o, metadata: n, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: o,
    step: r,
    metadata: n
  });
}
function za(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function xa(e, t, r) {
  try {
    return await e.createWorkflowSummaryMessage(r, t), d(void 0);
  } catch (a) {
    return c({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: a
    });
  }
}
async function Wa(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Ga(e, t);
    case "spendRitualCost":
      return Ka(e, t);
  }
}
async function Ga(e, t) {
  const { context: r, resources: a } = e, o = z(t, r);
  return o.ok ? $t(await a.spend(r.sourceActor, t.resource, o.value), r) : c(o.error);
}
async function Ka(e, t) {
  const { context: r, resources: a, ritualCosts: o } = e, n = o.getCost({
    actor: r.sourceActor,
    ritual: r.item
  });
  if (!n.ok)
    return c({
      reason: "ritual-cost-failed",
      message: n.error.message,
      cause: n.error
    });
  const s = n.value;
  return r.ritualCosts.push({
    ...s,
    itemId: r.item.id ?? null,
    itemName: r.item.name ?? "Ritual sem nome"
  }), $t(await a.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function $t(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), d(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), c({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Ya(e) {
  const { step: t, context: r, stepIndex: a, lifecycle: o, execute: n } = e, s = Qa(t);
  for (const f of s.before)
    o.emit(f, r, { stepIndex: a, step: t });
  const l = await n();
  if (!l.ok)
    return l;
  for (const f of s.after)
    o.emit(f, r, { stepIndex: a, step: t });
  return l;
}
function Qa(e) {
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
class Xa {
  constructor(t, r, a, o) {
    this.resources = t, this.ritualCosts = r, this.messages = a, this.lifecycle = o;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, r) {
    if (t.steps.length === 0)
      return c({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: r
      });
    for (const [a, o] of t.steps.entries()) {
      const n = await this.runStep(o, r, a);
      if (!n.ok)
        return n;
    }
    return d({ definition: t, context: r });
  }
  async runStep(t, r, a) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, r, a);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, r, a);
      default:
        return Ya({
          step: t,
          context: r,
          stepIndex: a,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(t, r, a)
        });
    }
  }
  async executeStep(t, r, a) {
    switch (t.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(t, r, a);
      case "rollFormula":
        return this.runRollFormulaStep(t, r, a);
      case "modifyResource":
        return this.runModifyResourceStep(t, r, a);
      case "chatCard":
        return this.runChatCardStep(t, r, a);
      default:
        return c({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: a,
          step: t,
          context: r
        });
    }
  }
  async runCostStep(t, r, a) {
    const o = await Wa({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? d(void 0) : c({ ...o.error, stepIndex: a, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, a) {
    const o = Pt(t, a);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: a, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, a, t), this.lifecycle.emit("roll", r, { stepIndex: a, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, a, t);
    const n = await this.runRollFormulaStep(t, r, a);
    if (!n.ok)
      return n;
    const s = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, a, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: a, step: t, rollRequest: o, rollResult: s }), d(void 0);
  }
  async runRollFormulaStep(t, r, a) {
    const o = await _a(t, a, r);
    return o.ok ? d(void 0) : c({ ...o.error, stepIndex: a, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, a) {
    const o = z(t, r);
    if (!o.ok)
      return c({ ...o.error, stepIndex: a, step: t, context: r });
    const n = Va(t, r, o.value);
    qa({
      step: t,
      context: r,
      stepIndex: a,
      metadata: n,
      lifecycle: this.lifecycle
    }), ja({
      step: t,
      context: r,
      stepIndex: a,
      metadata: n,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, r);
    if (s.length === 0)
      return c({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: t,
        context: r
      });
    for (const l of s) {
      const f = await ue(this.resources, l, t.resource, t.operation, o.value), g = this.handleResourceOperationResult(f, r, a, t);
      if (!g.ok)
        return g;
      La({
        step: t,
        context: r,
        transaction: g.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return Ba({
      step: t,
      context: r,
      stepIndex: a,
      metadata: n,
      lifecycle: this.lifecycle
    }), d(void 0);
  }
  async runModifyResourceStep(t, r, a) {
    const o = z(t, r);
    if (!o.ok)
      return c({ ...o.error, stepIndex: a, step: t, context: r });
    const n = this.resolveActors(t.actor, r);
    if (n.length === 0)
      return c({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: t,
        context: r
      });
    for (const s of n) {
      const l = await ue(this.resources, s, t.resource, t.operation, o.value), f = this.handleResourceOperationResult(l, r, a, t);
      if (!f.ok)
        return f;
    }
    return d(void 0);
  }
  async runChatCardStep(t, r, a) {
    const o = await xa(this.messages, t, r);
    return o.ok ? d(void 0) : c({ ...o.error, stepIndex: a, step: t, context: r });
  }
  handleResourceOperationResult(t, r, a, o) {
    return t.ok ? (r.resourceTransactions.push(t.value), d(t.value)) : c({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: a,
      step: o,
      context: r,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, r, a, o, n, s) {
    const l = Za(t, r.intent);
    l && this.lifecycle.emit(l, a, {
      stepIndex: o,
      step: n,
      rollRequest: r,
      rollResult: s
    });
  }
  resolveActors(t, r) {
    switch (t) {
      case "self":
        return [r.sourceActor];
      case "target":
        return r.targets.flatMap((a) => a.actor ? [a.actor] : []);
    }
  }
}
function Za(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Ja {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async spend(t, r, a) {
    return this.execute(t, r, "spend", a);
  }
  async damage(t, r, a) {
    return this.execute(t, r, "damage", a);
  }
  async heal(t, r, a) {
    return this.execute(t, r, "heal", a);
  }
  async recover(t, r, a) {
    return this.execute(t, r, "recover", a);
  }
  async execute(t, r, a, o) {
    if (!Number.isInteger(o) || o <= 0)
      return c({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: o
      });
    const n = this.adapter.getResource(t, r);
    if (!n.ok)
      return c({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: n.error.reason,
        message: n.error.message,
        requestedAmount: o,
        path: n.error.path,
        value: n.error.value
      });
    const s = n.value, l = this.calculate(a, s, o);
    if (!l.ok)
      return c({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: l.error.reason,
        message: l.error.message,
        requestedAmount: o,
        current: s.value,
        required: o
      });
    const { afterValue: f, appliedAmount: g } = l.value, h = {
      value: f,
      max: s.max
    };
    try {
      f !== s.value && await this.adapter.updateResourceValue(t, r, f);
    } catch (A) {
      return c({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: "update-failed",
        message: `Falha ao atualizar ${r} no ator.`,
        requestedAmount: o,
        current: s.value,
        required: o,
        cause: A
      });
    }
    return d({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: r,
      operation: a,
      requestedAmount: o,
      appliedAmount: g,
      before: s,
      after: h
    });
  }
  calculate(t, r, a) {
    switch (t) {
      case "spend":
        return r.value < a ? c({
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
function eo(e) {
  return {
    id: to(),
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
function to() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class ro {
  constructor(t, r) {
    this.automation = t, this.hooks = r;
  }
  automation;
  hooks;
  lastContext = null;
  getLastContext() {
    return this.lastContext;
  }
  getLastDebugSnapshot() {
    return S(this.lastContext);
  }
  async runAutomation(t, r) {
    const a = eo(r);
    this.lastContext = a, this.hooks.emit("created", a, {
      metadata: {
        definitionLabel: t.label,
        itemId: a.item.id ?? null,
        itemName: a.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", a), this.hooks.emit("resolveTargets", a, {
      metadata: {
        targetCount: a.targets.length
      }
    });
    const o = await this.automation.run(t, a);
    return o.ok ? (this.hooks.emit("completed", a), o) : (this.emitFailed(a, o.error), o);
  }
  emitFailed(t, r) {
    this.hooks.emit("failed", t, {
      stepIndex: r.stepIndex,
      step: r.step,
      metadata: {
        reason: r.reason,
        message: r.message
      }
    });
  }
}
class ao {
  emit(t, r, a = {}) {
    const o = {
      phase: t,
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
    return r.phases.push(t), r.lifecycleEvents.push({
      phase: t,
      stepIndex: a.stepIndex,
      stepType: a.step?.type,
      rollId: a.rollRequest?.id ?? a.rollResult?.id,
      rollIntent: a.rollRequest?.intent ?? a.rollResult?.intent,
      damageId: a.damage?.id,
      healingId: a.healing?.id,
      resourceOperation: a.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${u}.workflow.${t}`, o), Hooks.callAll(`${u}.workflow.phase`, o), o;
  }
}
class oo {
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
    const r = re();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: no(),
      flags: {
        ...t.flags,
        [u]: {
          ...so(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && i.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const a = re();
    if (!a.enabled)
      return;
    const o = r.notification ?? Be(r);
    a.console && this.emitConsole(t, r), a.ui && this.emitUi(t, o);
  }
  emitConsole(t, r) {
    const a = Be(r);
    switch (t) {
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
  emitUi(t, r) {
    switch (t) {
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
function Be(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function no() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function so(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const io = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Ct = `${u}-inline-roll-neutralized`, uo = `${u}-inline-roll-notice`, we = `data-${u}-inline-roll-neutralized`, ze = `data-${u}-inline-roll-notice`, co = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function lo(e) {
  const t = $o(e.message), r = await mo(e.message), a = fo(t);
  return r.replacementCount + a.replacementCount > 0 && i.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: e.item.id ?? null,
    itemName: e.item.name ?? "Item sem nome",
    messageId: t,
    contentReplacementCount: r.replacementCount,
    renderedReplacementCount: a.replacementCount
  }), {
    messageId: t,
    contentUpdated: r.updated,
    contentReplacementCount: r.replacementCount,
    renderedReplacementCount: a.replacementCount
  };
}
async function mo(e) {
  const t = Po(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = po(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await bo(t, r.content), replacementCount: r.replacementCount };
}
function fo(e) {
  const t = e ? To(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = It(t);
  return r > 0 && St(Ro(t)), { replacementCount: r };
}
function po(e) {
  const t = go(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const a = It(r.content), o = t.replacementCount + a;
  return o === 0 ? { content: e, replacementCount: 0 } : (St(r.content), { content: r.innerHTML, replacementCount: o });
}
function go(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (a, o) => (t += 1, yo(o.trim()))), replacementCount: t };
}
function It(e) {
  const t = ho(e);
  for (const r of t)
    r.replaceWith(Ao(wo(r)));
  return t.length;
}
function ho(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(io))
    r.getAttribute(we) !== "true" && t.add(r);
  return Array.from(t);
}
function yo(e) {
  return `<span class="${Ct}" ${we}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Co(e)}</span>`;
}
function Ao(e) {
  const t = document.createElement("span");
  return t.classList.add(Ct), t.setAttribute(we, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function St(e) {
  if (e.querySelector?.(`[${ze}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(uo), t.setAttribute(ze, "true"), t.textContent = co, e.append(t);
}
function Ro(e) {
  return e.querySelector(".message-content") ?? e;
}
function wo(e) {
  const r = e.getAttribute("data-formula") ?? ko(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function ko(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Po(e) {
  return e && typeof e == "object" ? e : null;
}
async function bo(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return i.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function To(e) {
  const t = Io(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function $o(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Co(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Io(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Et = ["base", "discente", "verdadeiro"];
function vt(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function So(e) {
  return typeof e == "string" && Et.includes(e);
}
async function Eo(e) {
  const t = _o();
  return t ? new Promise((r) => {
    let a = !1;
    const o = (n) => {
      a || (a = !0, r(n));
    };
    new t({
      title: `Conjurar ${e.ritual.name ?? "ritual"}`,
      content: vo(e),
      default: "cast",
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: () => o(null)
        },
        cast: {
          icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
          label: "Conjurar",
          callback: (n) => o(Fo(n, e.defaultSpendResource))
        }
      },
      close: () => o(null)
    }).render(!0);
  }) : (ui.notifications?.warn("Paranormal Toolkit: Dialog não disponível. Usando opções padrão do ritual."), {
    variant: "base",
    spendResource: e.defaultSpendResource
  });
}
function vo(e) {
  const t = e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado", r = e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido", a = e.defaultSpendResource ? "checked" : "";
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
        ${e.variantOptions.map(Do).join("")}
      </fieldset>

      <label class="paranormal-toolkit-ritual-cast-dialog__checkbox">
        <input type="checkbox" name="spendResource" ${a}>
        Gastar PE/PD automaticamente
      </label>

      <dl class="paranormal-toolkit-ritual-cast-dialog__summary">
        <div><dt>Custo base previsto</dt><dd>${N(r)}</dd></div>
        <div><dt>Conjurador</dt><dd>${N(e.actor.name ?? "Ator sem nome")}</dd></div>
        <div><dt>Alvos</dt><dd>${N(t)}</dd></div>
      </dl>
    </form>
  `;
}
function Do(e) {
  const t = e.variant === "base" ? "checked" : "", r = e.enabled ? "" : "disabled", a = e.enabled ? "" : e.unavailableReason ?? "não disponível neste ritual", o = [...e.details, a].filter((s) => s.length > 0).join(" · ");
  return `
    <label class="paranormal-toolkit-ritual-cast-dialog__variant${e.enabled ? "" : " paranormal-toolkit-ritual-cast-dialog__variant--disabled"}">
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-main">
        <input type="radio" name="variant" value="${N(e.variant)}" ${t} ${r}>
        <strong>${N(e.label)}</strong>
      </span>
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-details">${N(o)}</span>
    </label>
  `;
}
function Fo(e, t) {
  const r = Oo(e), a = No(r), o = r?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: a,
    spendResource: o
  };
}
function No(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return So(t) ? t : "base";
}
function Oo(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function _o() {
  return globalThis.Dialog ?? null;
}
function N(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const Dt = {
  label: "Padrão"
};
class Mo {
  constructor(t, r, a) {
    this.workflow = t, this.resources = r, this.ritualCosts = a;
  }
  workflow;
  resources;
  ritualCosts;
  canHandle(t, r) {
    return t.item.type === "ritual" || r.steps.some((a) => a.type === "spendRitualCost");
  }
  async run(t, r) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const a = this.resolveCostPreview(t), o = Yo(r, a), n = await Eo({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((b) => b.name),
      cost: a,
      defaultSpendResource: Zo(r),
      variantOptions: o
    });
    if (!n)
      return { status: "cancelled" };
    const s = Xo(r, n.variant), l = Lo(r, n, s, a);
    if (l.steps.length === 0)
      return {
        status: "failed",
        reason: "empty-preparation",
        message: "O ritual não possui custo ou rolagem para preparar antes das ações no chat."
      };
    const f = await this.workflow.runAutomation(l, {
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
          variant: n.variant,
          spendResource: n.spendResource
        }
      }
    });
    if (!f.ok)
      return {
        status: "failed",
        reason: f.error.reason,
        message: f.error.message,
        cause: f.error
      };
    const g = f.value.context, h = Ho(r, t, g), A = zo(n, s, a, g);
    return h.ok ? h.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: g,
      summaryLines: A
    } : {
      status: "ready",
      workflowContext: g,
      actions: h.actions,
      summaryLines: A
    } : {
      status: "failed",
      reason: h.reason,
      message: h.message
    };
  }
  async applyAction(t) {
    return ue(this.resources, t.actor, t.resource, t.operation, t.amount);
  }
  resolveCostPreview(t) {
    if (!t.actor) return null;
    const r = this.ritualCosts.getCost({
      actor: t.actor,
      ritual: t.item
    });
    return r.ok ? r.value : null;
  }
}
function Lo(e, t, r, a) {
  const o = [];
  for (const n of e.steps)
    n.type === "modifyResource" || n.type === "chatCard" || Nt(n) && !t.spendResource || o.push(Uo(n, r));
  return t.spendResource && a && Ot(r.extraCost) && o.push({
    type: "spendResource",
    actor: "self",
    resource: a.resource,
    amount: r.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: o
  };
}
function Uo(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function Ho(e, t, r) {
  const a = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const n = z(o, r);
    if (!n.ok)
      return {
        ok: !1,
        reason: n.error.reason,
        message: n.error.message
      };
    const s = Bo(o.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const l of s)
      a.push(Vo(o, l, n.value));
  }
  return { ok: !0, actions: a };
}
function Vo(e, t, r) {
  const a = t.name ?? "Ator sem nome";
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: qo(e, a, r),
    executedLabel: jo(e, a)
  };
}
function qo(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${t} em ${r} PV` : e.operation === "damage" ? `Aplicar ${r} de dano em ${t}` : e.operation === "recover" ? `Recuperar ${r} ${e.resource} de ${t}` : e.operation === "spend" ? `Gastar ${r} ${e.resource} de ${t}` : `Aplicar ${r} ${e.resource} em ${t}`;
}
function jo(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Bo(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function zo(e, t, r, a) {
  return [
    `Forma: ${vt(e.variant)}`,
    xo(e, t, r),
    ...Object.values(a.rolls).map(Wo),
    ...Go(t)
  ];
}
function xo(e, t, r) {
  const a = t.extraCost ?? 0;
  return r ? e.spendResource ? a > 0 ? `Custo: ${r.amount + a} ${r.resource} gasto (${r.amount} base + ${a} extra)` : `Custo: ${r.amount} ${r.resource} gasto` : a > 0 ? `Custo: ${r.amount} ${r.resource} + ${a} extra não gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? a > 0 ? `Custo: não resolvido (+${a} extra)` : "Custo: não resolvido" : "Custo: não gasto";
}
function Wo(e) {
  return `${Ko(e)}: ${e.formula} = ${Math.trunc(e.total)}`;
}
function Go(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Ko(e) {
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
function Yo(e, t) {
  return Et.map((r) => {
    const a = Ft(e, r), o = r === "base" || a !== null, n = a ?? (r === "base" ? Dt : null);
    return {
      variant: r,
      label: n?.label ?? vt(r),
      enabled: o,
      details: n ? Qo(n, t) : [],
      unavailableReason: o ? void 0 : "não disponível neste ritual"
    };
  });
}
function Qo(e, t) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {});
  return a.length > 0 && r.push(a.join(", ")), Ot(e.extraCost) ? r.push(t ? `+${e.extraCost} ${t.resource}` : `+${e.extraCost} PE/PD`) : r.push("custo base"), r;
}
function Xo(e, t) {
  return Ft(e, t) ?? Dt;
}
function Ft(e, t) {
  return e.ritualForms?.[t] ?? null;
}
function Zo(e) {
  return e.steps.some(Nt);
}
function Nt(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Ot(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const _t = "itemUsePrompts", Mt = "data-paranormal-toolkit-prompt-id", x = "data-paranormal-toolkit-pending-id", ce = "data-paranormal-toolkit-executed-label", xe = "data-paranormal-toolkit-detail-key", Jo = `[${x}]`, We = `${u}-chat-enrichment`, P = `${u}-item-use-prompt`, Ge = `${P}__actions`, Ke = `${P}__details`, en = `${P}__summary`, tn = `${P}__title`, Lt = `${P}__button--executed`;
let Ye = !1, le = null;
const E = /* @__PURE__ */ new Map();
function rn(e) {
  le = e, !Ye && (Hooks.on("renderChatMessageHTML", (t, r) => {
    on(t, r, e);
  }), Ye = !0);
}
async function Qe(e) {
  const t = an(e);
  E.set(e.pendingId, t), await wn(t), nn(e.pendingId);
}
async function Xe(e) {
  const t = E.get(e);
  E.delete(e), t && await kn(t);
}
function an(e) {
  const t = Pe(e.context.message);
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    summary: dn(e.context),
    executed: !1
  };
}
function on(e, t, r) {
  Rn();
  const a = zt(t);
  if (!a) return;
  const o = hn(e, a);
  for (const n of o)
    me(a, n);
  Ut(a, r);
}
function nn(e) {
  const t = E.get(e);
  if (!t) return;
  const r = t.messageId ? yn(t.messageId) : null;
  if (r) {
    me(r, t), Ze(r);
    return;
  }
  if (t.messageId) return;
  const a = An(t);
  a && (me(a, t), Ze(a));
}
function Ze(e) {
  le && Ut(e, le);
}
function me(e, t) {
  if (e.querySelector(`[${Mt}="${be(t.pendingId)}"]`)) return;
  const r = sn(e, t);
  cn(r, t.summaryLines ?? []), un(r).append(mn(t));
}
function sn(e, t) {
  const r = e.querySelector(`.${We}`);
  if (r)
    return r;
  const a = document.createElement("section");
  a.classList.add(We, P);
  const o = document.createElement("header");
  o.classList.add(`${P}__header`);
  const n = document.createElement("strong");
  n.classList.add(tn), n.textContent = t.title ?? "Paranormal Toolkit";
  const s = document.createElement("span");
  return s.classList.add(en), s.textContent = t.summary, o.append(n, s), a.append(o), pn(e).append(a), a;
}
function un(e) {
  const t = e.querySelector(`.${Ge}`);
  if (t)
    return t;
  const r = document.createElement("div");
  return r.classList.add(Ge), e.append(r), r;
}
function cn(e, t) {
  if (t.length === 0) return;
  const r = ln(e);
  for (const a of t) {
    const o = Tn(a);
    if (r.querySelector(`[${xe}="${be(o)}"]`)) continue;
    const n = document.createElement("li");
    n.textContent = a, n.setAttribute(xe, o), r.append(n);
  }
}
function ln(e) {
  const t = e.querySelector(`.${Ke}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(Ke), e.append(r), r;
}
function mn(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${P}__button`), t.setAttribute(Mt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Lt), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(x, e.pendingId), t.setAttribute(ce, e.executedLabel ?? "✓ Automação aplicada"), t);
}
function dn(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = fn(e);
  return `${t} → ${r}`;
}
function fn(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function pn(e) {
  return e.querySelector(".message-content") ?? e;
}
function Ut(e, t) {
  const r = zt(e);
  if (!r) return;
  const a = r.querySelectorAll(Jo);
  for (const o of a)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      gn(o, t);
    }));
}
async function gn(e, t) {
  const r = e.getAttribute(x);
  if (!r) return;
  e.disabled = !0;
  const a = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    e.textContent = e.getAttribute(ce) ?? "✓ Automação aplicada", e.classList.add(Lt), e.removeAttribute(x), e.removeAttribute(ce);
    return;
  }
  e.disabled = !1, e.textContent = a;
}
function hn(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const a of E.values())
    de(a, e, t) && r.set(a.pendingId, a);
  for (const a of Pn(e))
    de(a, e, t) && !r.has(a.pendingId) && r.set(a.pendingId, a);
  return Array.from(r.values()).sort((a, o) => a.createdAt - o.createdAt);
}
function de(e, t, r) {
  const a = Pe(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === a : !e.itemId || !Je(r, "itemId", e.itemId) ? !1 : !e.actorId || Je(r, "actorId", e.actorId);
}
function Je(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const a = `data-${$n(t)}`;
  for (const o of e.querySelectorAll(`[${a}]`))
    if (o.getAttribute(a) === r)
      return !0;
  return !1;
}
function yn(e) {
  const t = be(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function An(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (de(e, null, t))
      return t;
  return null;
}
function Rn() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, a] of E.entries())
    e - a.createdAt > t && E.delete(r);
}
async function wn(e) {
  const t = qt(e.context.message);
  if (t)
    try {
      const r = ke(t);
      r[e.pendingId] = Vt(e), await Ht(t, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r);
    }
}
async function kn(e) {
  const t = qt(e.context.message);
  if (t)
    try {
      const r = ke(t), a = r[e.pendingId] ?? Vt(e);
      r[e.pendingId] = {
        ...a,
        executed: !0
      }, await Ht(t, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function Pn(e) {
  return Object.values(ke(fe(e))).filter(jt);
}
function ke(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, _t);
  if (!Bt(t))
    return {};
  const r = {};
  for (const [a, o] of Object.entries(t))
    jt(o) && (r[a] = o);
  return r;
}
async function Ht(e, t) {
  typeof e.setFlag == "function" && await Promise.resolve(e.setFlag(u, _t, t));
}
function Vt(e) {
  return {
    schemaVersion: 1,
    pendingId: e.pendingId,
    mode: e.mode,
    title: e.title,
    buttonLabel: e.buttonLabel,
    executedLabel: e.executedLabel,
    summaryLines: e.summaryLines ? [...e.summaryLines] : void 0,
    createdAt: e.createdAt,
    messageId: e.messageId,
    itemId: e.itemId,
    actorId: e.actorId,
    summary: e.summary,
    executed: e.executed
  };
}
function qt(e) {
  const t = fe(e);
  if (t?.setFlag)
    return t;
  const r = Pe(e);
  if (!r) return null;
  const a = game.messages;
  return fe(a?.get?.(r));
}
function fe(e) {
  return e && typeof e == "object" ? e : null;
}
function jt(e) {
  return Bt(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && J(e.messageId) && J(e.itemId) && J(e.actorId) && ee(e.title) && ee(e.buttonLabel) && ee(e.executedLabel) && bn(e.summaryLines) : !1;
}
function Bt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function J(e) {
  return e === null || typeof e == "string";
}
function ee(e) {
  return e === void 0 || typeof e == "string";
}
function bn(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function zt(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Pe(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Tn(e) {
  return e.trim().toLowerCase();
}
function $n(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function be(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const et = 1e3;
class Cn {
  constructor(t, r, a, o) {
    this.workflow = t, this.debugOutput = o, this.ritualAssistant = new Mo(t, r, a);
  }
  workflow;
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
      settings: ve(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = ve();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const a = ge(t.item);
    if (!a.ok) {
      const o = a.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, o, a.error.reason), a.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: a.error.message,
        data: a.error
      });
      return;
    }
    if (await lo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: tt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(t), r.executionMode) {
      case "ask":
        await this.handleAskMode(t, a.value);
        return;
      case "automatic":
        await this.executeAutomation(t, a.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const r = this.pendingExecutions.get(t);
    if (!r)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    if (r.kind === "workflow")
      return this.pendingExecutions.delete(t), await Xe(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const a = await this.ritualAssistant.applyAction(r.action);
    return a.ok ? (r.workflowContext.resourceTransactions.push(a.value), this.pendingExecutions.delete(t), await Xe(t), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (rn((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleAssistedRitual(t, r) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const a = await this.ritualAssistant.run(t, r);
    switch (a.status) {
      case "cancelled":
        this.setAttempt(t, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(t, "failed", a.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: a.message,
          data: a.cause ?? a
        }), ui.notifications?.warn(`Paranormal Toolkit: ${a.message}`);
        return;
      case "completed-without-actions":
        this.setAttempt(t, "completed", "ritual-assisted-no-actions"), i.info("Ritual assistido concluído sem ações pendentes.", S(a.workflowContext));
        return;
      case "ready":
        await this.registerAssistedResourceActions(t, a.workflowContext, a.actions, a.summaryLines);
        return;
    }
  }
  async registerAssistedResourceActions(t, r, a, o) {
    let n;
    for (const s of a) {
      const l = at();
      n ??= l, this.pendingExecutions.set(l, {
        kind: "resource-action",
        id: l,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await Qe({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        summaryLines: o
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", n), i.info("Ritual assistido preparado com ações pendentes.", S(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const a = at();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Qe({
      pendingId: a,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", a);
  }
  async executeAutomation(t, r, a) {
    this.setAttempt(t, "running");
    const o = await this.workflow.runAutomation(r, {
      sourceActor: t.actor,
      sourceToken: t.token,
      item: t.item,
      targets: t.targets,
      flags: {
        itemUse: {
          source: t.source,
          executionMode: a
        }
      }
    });
    if (!o.ok) {
      this.setAttempt(t, "failed", o.error.reason), this.handleAutomationFailure(o.error);
      return;
    }
    this.setAttempt(t, "completed"), i.info("Automação executada por uso normal de item.", S(o.value.context));
  }
  handleAutomationFailure(t) {
    const r = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      i.warn(r, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      i.error(r, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    i.warn(r, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    i.warn(`Ação assistida falhou: ${t.error.message}`, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const r = Date.now(), a = rt(t);
    for (const [n, s] of this.recentExecutionKeys.entries())
      r - s > et && this.recentExecutionKeys.delete(n);
    const o = this.recentExecutionKeys.get(a);
    return o !== void 0 && r - o <= et;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(rt(t), Date.now());
  }
  setAttempt(t, r, a, o) {
    this.lastAttempt = tt(t, r, a, o);
  }
}
function tt(e, t, r, a) {
  return {
    source: e.source,
    status: t,
    reason: r,
    pendingId: a,
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
function rt(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function at() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class In {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), a = ye(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: r,
      data: a,
      flags: {
        [u]: {
          resourceTransaction: a
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, r) {
    const a = this.createWorkflowSummaryContent(t, r), o = S(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: a,
      data: o,
      flags: {
        [u]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const r = p(t.actorName), a = p(t.resource), o = p(ot(t)), n = p(En(t));
    return `
      <section class="${u}-card ${u}-resource-card">
        <header class="${u}-card__header">
          <strong>${o}</strong>
          <span>${r}</span>
        </header>
        <div class="${u}-card__body">
          <p><strong>${n}:</strong> ${t.appliedAmount}</p>
          <p><strong>${a}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, r) {
    const a = p(r.title ?? "Automação"), o = r.message ? `<p>${p(r.message)}</p>` : "", n = p(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = p(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((m) => p(m.name)).join(", ") : "Nenhum", f = Object.values(t.rolls).map(
      (m) => `<li><strong>${p(m.id)}:</strong> ${p(m.formula)} = ${m.total} <em>(${p(Sn(m.intent))})</em>${m.damageType ? ` — ${p(m.damageType)}` : ""}</li>`
    ), g = t.ritualCosts.map(
      (m) => `<li><strong>${p(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${p(m.resource)} (${p(vn(m.source))})</li>`
    ), h = t.damageInstances.map(
      (m) => `<li><strong>${p(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${p(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (m) => `<li><strong>${p(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), b = t.resourceTransactions.map(
      (m) => `<li><strong>${p(m.actorName)}:</strong> ${p(ot(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), O = t.phases.map((m) => p(m)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${a}</strong>
          <span>${s}</span>
        </header>
        <div class="${u}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${n}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${g.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${g.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${h.length > 0 ? `<p><strong>Dano:</strong></p><ul>${h.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Cura:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${b.join("")}</ul>` : ""}
          ${O.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${O}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Sn(e) {
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
function ot(e) {
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
function En(e) {
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
function vn(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function p(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function Dn() {
  const e = new ua(), t = new Ja(e), r = new ma(), a = new pa(r), o = new Sa(e), n = new va(), s = n.registerMany(Pr());
  if (!s.ok)
    throw new Error(s.error.message);
  const l = new Ea(), f = new Ca(), g = new oo(), h = new In(g), A = new ao(), b = new Xa(t, a, h, A), O = new ro(b, A), m = new Cn(O, t, a, g);
  return m.addStrategy(new Ta((xt) => m.handleItemUsed(xt))), {
    ordem: o,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: a,
    resources: t,
    automationRegistry: n,
    automationBinder: l,
    itemPatches: f,
    debugOutput: g,
    chatMessages: h,
    workflowHooks: A,
    automation: b,
    workflow: O,
    itemUseIntegration: m
  };
}
let L = null;
Hooks.once("init", () => {
  Rr(), Vr(), i.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Fe.isSupportedSystem()) {
    i.warn(
      `Sistema não suportado: ${Fe.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  L = Dn(), L.itemUseIntegration.registerStrategies(), Kr(L), na(), ta(), i.info("Inicializado para o sistema Ordem Paranormal."), i.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Wt} inicializado.`);
});
function Fn() {
  if (!L)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return L;
}
export {
  Fn as getToolkitServices
};
//# sourceMappingURL=main.js.map
