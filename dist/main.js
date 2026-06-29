const u = "paranormal-toolkit", qt = "Paranormal Toolkit", Xr = "ordemparanormal";
class J {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function me(e) {
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
class c {
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
function g(e) {
  return { ok: !0, value: e };
}
function d(e) {
  return { ok: !1, error: e };
}
function Ge(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? d({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : qe(t) ? g(t.definition) : d({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Zr(e) {
  return qe(e.getFlag(u, "automation"));
}
function qe(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && ea(t.source) && Jr(t.definition);
}
function Jr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && k(t.label) && Array.isArray(t.steps) && t.steps.every(ta);
}
function ea(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? k(t.presetId) && k(t.presetVersion) && k(t.appliedAt) : t.type === "manual" ? k(t.label) && k(t.appliedAt) : !1;
}
function ta(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return ra(t);
    case "spendRitualCost":
      return aa(t);
    case "rollFormula":
      return na(t);
    case "modifyResource":
      return oa(t);
    case "chatCard":
      return sa(t);
    default:
      return !1;
  }
}
function ra(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && zt(t);
}
function aa(e) {
  return e.type === "spendRitualCost";
}
function na(e) {
  const t = e;
  return t.type === "rollFormula" && k(t.id) && k(t.formula) && (t.intent === void 0 || la(t.intent)) && (t.damageType === void 0 || k(t.damageType));
}
function oa(e) {
  const t = e;
  return t.type === "modifyResource" && ia(t.actor) && ca(t.resource) && ua(t.operation) && zt(t);
}
function sa(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function zt(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || k(e.amountFrom);
}
function ia(e) {
  return e === "self" || e === "target";
}
function ca(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function ua(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function la(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function k(e) {
  return typeof e == "string" && e.length > 0;
}
function ze(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(nt);
    if (fa(t))
      return Array.from(t).filter(nt);
  }
  return [];
}
function da(e) {
  return ze(e)[0] ?? null;
}
function ma(e) {
  return ze(e).find(Zr) ?? null;
}
function fa(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function nt(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ee(e) {
  return ze(e).filter((t) => t.type === "ritual");
}
function Wt(e) {
  return ee(e)[0] ?? null;
}
function pa(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(me);
      return c.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Q("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = te(t);
      if (!r) return [];
      const a = e.automationRegistry.findForItem(r).map(it);
      return c.info(`Presets encontrados para ${r.name}.`, a), a;
    },
    async applyPresetToFirstRitual(t) {
      const r = Q("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const a = te(r);
      if (!a) return;
      const n = e.automationRegistry.require(t);
      if (!n.ok) {
        c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      const o = await _e(e, a, n.value);
      c.info(`Preset ${n.value.id} aplicado em ${a.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Q("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = te(t);
      if (!r) return;
      const a = e.automationRegistry.findForItem(r)[0];
      if (!a) {
        c.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const n = await _e(e, r, a.preset);
      c.info(`Melhor preset aplicado em ${r.name}.`, { match: it(a), itemPatch: n }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return ot(e);
    },
    async applyBestPresetsToActorRituals() {
      return ot(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Q("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = te(t);
      r && (await e.automationBinder.clear(r), c.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function ot(e) {
  const t = Q("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = ee(t);
  if (r.length === 0)
    return c.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), st(t);
  const a = st(t, r.length);
  for (const n of r) {
    const o = e.automationRegistry.findForItem(n)[0];
    if (!o) {
      a.skipped.push({
        itemId: n.id ?? null,
        itemName: n.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await _e(e, n, o.preset);
    a.applied.push(ga(n, o, s));
  }
  return c.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, a), ha(a), a;
}
async function _e(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function ga(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: me(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function st(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function ha(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((a) => a.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function it(e) {
  return {
    preset: me(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Q(e) {
  const t = J.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function te(e) {
  const t = Wt(e);
  return t || (c.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function O(e) {
  return e ? {
    id: e.id,
    source: {
      ...ya(e.sourceActor),
      token: e.sourceToken
    },
    item: Aa(e.item),
    targets: e.targets.map(Ra),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: ct(e.rollRequests, Kt),
    rolls: ct(e.rolls, ba),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(We),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function We(e) {
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
function ya(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Aa(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Ra(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Kt(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ba(e) {
  return {
    ...Kt(e),
    total: e.total
  };
}
function ct(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, a]) => [r, t(a)]));
}
function ka(e) {
  return {
    getSelected() {
      return J.getSelectedActor();
    },
    logResources() {
      const t = _(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const r = e.ordem.getActorSnapshot(t);
      c.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && c.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(t) {
      await x(
        e,
        "Gasto de PE",
        _("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await x(
        e,
        "Gasto de PD",
        _("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await x(
        e,
        "Dano em PV",
        _("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await x(
        e,
        "Cura de PV",
        _("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await x(
        e,
        "Dano em SAN",
        _("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await x(
        e,
        "Recuperação de SAN",
        _("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function x(e, t, r, a) {
  if (!r) return;
  const n = await a(r);
  if (!n.ok) {
    Ta(n.error);
    return;
  }
  const o = n.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    c.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  c.info(`${t} realizado:`, We(o));
}
function _(e) {
  const t = J.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ta(e) {
  if (e.reason === "update-failed") {
    c.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    c.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  c.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const $ = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Pa() {
  re($.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), re($.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), re($.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), re($.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function ve() {
  return {
    enabled: ae($.enabled),
    console: ae($.console),
    ui: ae($.ui),
    chat: ae($.chat)
  };
}
async function E(e, t) {
  await game.settings.set(u, $[e], t);
}
function re(e, t) {
  game.settings.register(u, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function ae(e) {
  return game.settings.get(u, e) === !0;
}
function wa() {
  return {
    status() {
      return ve();
    },
    async enable() {
      await E("enabled", !0);
    },
    async disable() {
      await E("enabled", !1);
    },
    async enableConsole() {
      await E("console", !0);
    },
    async disableConsole() {
      await E("console", !1);
    },
    async enableUi() {
      await E("ui", !0);
    },
    async disableUi() {
      await E("ui", !1);
    },
    async enableChat() {
      await E("chat", !0);
    },
    async disableChat() {
      await E("chat", !1);
    }
  };
}
const Yt = "ritual.costOnly", Qt = "ritual.simpleHealing", $a = "ritual.eletrocussao", Xt = "ritual.simpleDamage", Zt = "generic.simpleHealing", Jt = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Ia() {
  return [
    Sa(),
    Ca(),
    Ea(),
    _a(),
    va()
  ];
}
function Sa() {
  return {
    id: Yt,
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
function Ca() {
  return {
    id: Qt,
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
    automation: er(),
    itemPatch: Na()
  };
}
function Ea() {
  return {
    id: $a,
    version: "1.1.0",
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
    automation: Da(),
    itemPatch: La()
  };
}
function _a() {
  return {
    id: Xt,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Ke()
  };
}
function va() {
  return {
    id: Zt,
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
function er(e = "2d8+2") {
  return tr(
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
function Da() {
  return {
    ...Ke("1d8", {
      label: "Eletrocussão",
      title: "Eletrocussão",
      damageType: "energia",
      message: "Gasta o custo do ritual, rola dano de energia e prepara aplicação de dano em PV do alvo. Resistência deve ser resolvida manualmente por enquanto."
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
function Ke(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", a = t.title ?? "Ritual de dano simples", n = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return tr(
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
          damageType: n
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
          message: o
        }
      ]
    },
    "damage",
    e
  );
}
function Na() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Jt,
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
function La() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Jt,
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
function tr(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((a) => a.type !== "rollFormula" || a.id !== t ? a : {
      ...a,
      formula: r
    })
  };
}
function Ye() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: V(t.id),
    actorId: V(t.actor?.id),
    sceneId: V(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function rr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: V(e.id),
    actorId: V(t?.id),
    sceneId: V(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function V(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Oa(e) {
  return {
    logFirstRitualCost() {
      const t = v("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const r = D(t);
      if (!r) return;
      const a = e.ritualCosts.getCost({ actor: t, ritual: r });
      if (!a.ok) {
        c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      c.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: r.name,
        cost: a.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${r.name} custa ${a.value.amount} ${a.value.resource} (${a.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, r = "PE") {
      const a = v("Nenhum ator encontrado para configurar custo customizado.");
      if (!a) return;
      const n = D(a);
      if (n) {
        if (!Ua(t, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await n.setFlag(u, "ritual.cost", {
          resource: r,
          amount: t
        }), c.info(`Custo customizado aplicado em ${n.name}.`, { resource: r, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${n.name} agora custa ${t} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = v("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = D(t);
      r && (await r.unsetFlag(u, "ritual.cost"), c.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = v("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = D(t);
      if (!r) return;
      const a = e.automationRegistry.require(Yt);
      if (!a.ok) {
        c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value), c.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = v("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const a = D(r);
      if (!a) return;
      if (!ut(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const n = e.automationRegistry.require(Qt);
      if (!n.ok) {
        c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, n.value, {
        definition: er(t)
      }), c.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = v("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const a = D(r);
      if (!a) return;
      if (!ut(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const n = e.automationRegistry.require(Xt);
      if (!n.ok) {
        c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, n.value, {
        definition: Ke(t)
      }), c.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = v("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = D(t);
      r && await Fa(e, t, r);
    }
  };
}
async function Fa(e, t, r) {
  const a = Ge(r);
  if (!a.ok) {
    c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const n = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: rr(),
    item: r,
    targets: Ye()
  });
  if (!n.ok) {
    Ma(n.error);
    return;
  }
  c.info("Automação de ritual executada com sucesso.", O(n.value.context));
}
function Ma(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    c.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    c.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  c.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function v(e) {
  const t = J.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function D(e) {
  const t = Wt(e);
  return t || (c.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ua(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function ut(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Ba = ["disabled", "ask", "automatic"], xa = ["buttons", "confirm"], ar = "ask";
function Ha(e) {
  return typeof e == "string" && Ba.includes(e);
}
function Va(e) {
  return typeof e == "string" && xa.includes(e);
}
function ja(e) {
  return Ha(e) ? e : Va(e) ? "ask" : ar;
}
const Ga = ["keep", "replace"], nr = "keep", F = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled"
};
function qa() {
  game.settings.register(u, F.executionMode, {
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
    default: ar
  }), game.settings.register(u, F.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: nr
  }), game.settings.register(u, F.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function lt() {
  const e = ja(game.settings.get(u, F.executionMode)), t = or(game.settings.get(u, F.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t
  };
}
function za() {
  return or(game.settings.get(u, F.systemCardMode));
}
async function N(e) {
  await game.settings.set(u, F.executionMode, e);
}
function or(e) {
  return Ga.includes(e) ? e : nr;
}
function Wa(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await N("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await N("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await N(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await N("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await N("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await N("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await N("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Ka = [
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
function Ya(e) {
  return {
    phases() {
      return Ka;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Re("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = ma(t);
      if (!r) {
        c.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await dt(e, t, r);
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
      if (!Za(r)) {
        c.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = Xa(r) ?? Re("Nenhum ator encontrado para executar automação do item.");
      a && await dt(e, a, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Re("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = da(t);
      if (!r) {
        c.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = e.automationRegistry.require(Zt);
        if (!a.ok) {
          c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(r, a.value), c.info(`Preset de teste aplicado ao item: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${r.name}.`);
      } catch (a) {
        c.error("Falha ao configurar automação de teste no item.", a), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function dt(e, t, r) {
  const a = Ge(r);
  if (!a.ok) {
    c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const n = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: rr(),
    item: r,
    targets: Ye()
  });
  if (!n.ok) {
    Qa(n.error);
    return;
  }
  c.info("Automação executada com sucesso.", O(n.value.context));
}
function Qa(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    c.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    c.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  c.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Re(e) {
  const t = J.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Xa(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Za(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ja(e) {
  const t = ka(e), r = pa(e), a = Oa(e), n = Ya(e), o = wa(), s = Wa(e);
  return {
    actor: t,
    automation: r,
    ritual: a,
    workflow: n,
    output: o,
    itemUseIntegration: s,
    getSelectedActor() {
      return t.getSelected();
    },
    logSelectedActorResources() {
      t.logResources();
    },
    async spendSelectedActorPE(i) {
      await t.spendPE(i);
    }
  };
}
function en(e) {
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
    debug: Ja(e)
  }, r = globalThis;
  return r[u] = t, r.ParanormalToolkit = t, t;
}
class mt {
  static isSupportedSystem() {
    return game.system.id === Xr;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function tn() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: j(t.id),
    actorId: j(t.actor?.id),
    sceneId: j(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function sr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, r = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: j(e.id),
    actorId: j(t?.id),
    sceneId: j(e.scene?.id),
    name: r
  };
}
function rn(e, t = sr()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function an(e) {
  if (!sn(e)) return null;
  const t = e.getFlag(u, "workflow");
  return on(t) ? t : null;
}
function nn() {
  return `flags.${u}.workflow`;
}
function ft(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), r = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || r !== void 0;
}
function pt(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return De(t) || De(r);
}
function on(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function sn(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function j(e) {
  return De(e) ? e : null;
}
function De(e) {
  return typeof e == "string" && e.length > 0;
}
function cn() {
  const e = (t, r) => {
    un(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function un(e, t) {
  const r = an(e);
  if (!r || r.targets.length === 0) return;
  const a = dn(t);
  if (!a || a.querySelector(`.${u}-chat-enrichment`)) return;
  (a.querySelector(".message-content") ?? a).append(ln(r));
}
function ln(e) {
  const t = document.createElement("section");
  t.classList.add(`${u}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(gt("Origem", e.source.name)), t.append(gt("Alvo", e.targets.map((a) => a.name).join(", "))), t;
}
function gt(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${u}-chat-enrichment__row`);
  const a = document.createElement("span");
  a.textContent = `${e}: `;
  const n = document.createElement("span");
  return n.textContent = t, r.append(a, n), r;
}
function dn(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function mn() {
  Hooks.on("preCreateChatMessage", (e, t, r, a) => {
    if (!fn(a) || !pn(e) || ft(e) || ft(t)) return;
    const n = tn();
    if (n.length === 0 || !pt(e) && !pt(t)) return;
    const o = sr();
    e.updateSource({
      [nn()]: rn(n, o)
    }), c.info("Targets capturados para ChatMessage.", { source: o, targets: n });
  });
}
function fn(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function pn(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const ir = {
  enabled: "dice.animations.enabled"
};
function gn() {
  game.settings.register(u, ir.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function hn() {
  return {
    enabled: game.settings.get(u, ir.enabled) === !0
  };
}
const X = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, cr = {
  PV: "system.attributes.hp"
}, Ne = {
  PV: [X.PV, cr.PV],
  SAN: [X.SAN],
  PE: [X.PE],
  PD: [X.PD]
}, Le = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class yn {
  getResource(t, r) {
    const a = ht(t, r);
    if (!a.ok)
      return d(a.error);
    const n = a.value, o = `${n}.value`, s = `${n}.max`, i = foundry.utils.getProperty(t, o), l = foundry.utils.getProperty(t, s), p = At(t, r, o, i, "valor atual");
    if (p) return d(p);
    const y = At(t, r, s, l, "valor máximo");
    return y ? d(y) : g({
      value: i,
      max: l
    });
  }
  async updateResourceValue(t, r, a) {
    const n = ht(t, r);
    if (!n.ok)
      throw new Error(n.error.message);
    await t.update({ [`${n.value}.value`]: a });
  }
}
function ht(e, t) {
  const r = An(e.type, t);
  if (r && yt(e, r))
    return g(r);
  const a = Ne[t].find(
    (n) => yt(e, n)
  );
  return a ? g(a) : d({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Rn(e, t),
    path: Ne[t].join(" | ")
  });
}
function An(e, t) {
  return e === "threat" ? cr[t] ?? null : e === "agent" ? X[t] : null;
}
function yt(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), a = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof a == "number" && Number.isFinite(a);
}
function Rn(e, t) {
  const r = e.type ?? "unknown", a = Ne[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${a}.`;
}
function At(e, t, r, a, n) {
  return a == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${n} de ${t} não encontrado: ${r}.`,
    path: r,
    value: a
  } : typeof a != "number" || !Number.isFinite(a) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${n} de ${t} em ${r}.`,
    path: r,
    value: a
  } : null;
}
class bn {
  isRitual(t) {
    return t.type === "ritual";
  }
  getCircle(t) {
    if (!this.isRitual(t))
      return d({
        reason: "not-a-ritual",
        message: `Item ${t.name ?? "sem nome"} não é um ritual.`,
        ritual: t
      });
    const r = this.readCircleFromKnownPaths(t);
    if (!r) {
      const s = Le.ritualItem.circleCandidates;
      return d({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: a, value: n } = r, o = kn(n);
    return o ? g(o) : d({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(n)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: a,
      value: n
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of Le.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(t, r);
      if (a != null)
        return { path: r, value: a };
    }
    return null;
  }
}
function kn(e) {
  if (Rt(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (Rt(r))
      return r;
  }
  return null;
}
function Rt(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Tn = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Pn {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const r = this.ritualAdapter.getCircle(t.ritual);
    if (!r.ok)
      return d({
        ...r.error,
        actor: t.actor
      });
    const a = r.value, n = wn(t.ritual, a);
    return n.ok ? n.value ? g(n.value) : g({
      resource: "PE",
      amount: Tn[a],
      source: "default-by-circle",
      circle: a
    }) : d(n.error);
  }
}
function wn(e, t) {
  const r = e.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : $n(r) ? {
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
function $n(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const be = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function In(e) {
  if (!Dn(e.item)) return null;
  const t = Oe(e.actor) ? e.actor : Sn(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: En(e.token) ?? Cn(t),
    targets: Ye(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Sn(e) {
  const t = e;
  return Oe(t.actor) ? t.actor : Oe(e.parent) ? e.parent : null;
}
function Cn(e) {
  const t = _n(e) ?? vn(e);
  return t ? ur(t) : null;
}
function En(e) {
  return Fe(e) ? ur(e) : null;
}
function _n(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return Fe(r) ? r : (t.getActiveTokens?.() ?? []).find(Fe) ?? null;
}
function vn(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function ur(e) {
  const t = e.actor ?? null;
  return {
    tokenId: ke(e.id),
    actorId: ke(t?.id),
    sceneId: ke(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Dn(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Oe(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Fe(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function ke(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Nn {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(be.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, c.info(`${be.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = In(Ln(t));
    if (!r) {
      c.warn(`${be.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function Ln(e) {
  return e && typeof e == "object" ? e : {};
}
class On {
  async applyPresetItemPatch(t, r) {
    const a = r.itemPatch;
    if (!a) return Te("missing-item-patch");
    if (t.type !== "ritual") return Te("unsupported-item-type");
    const n = Fn(a);
    return Object.keys(n).length === 0 ? Te("empty-update") : (await t.update(n), {
      applied: !0,
      updateData: n
    });
  }
}
function Fn(e) {
  const t = {};
  R(t, "name", e.name), R(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (R(t, "system.circle", r.circle), R(t, "system.element", r.element), R(t, "system.target", r.target), R(t, "system.targetQtd", r.targetQuantity), R(t, "system.execution", r.execution), R(t, "system.range", r.range), R(t, "system.duration", r.duration), R(t, "system.skillResis", r.resistanceSkill), R(t, "system.resistance", r.resistance), R(t, "system.studentForm", r.studentForm), R(t, "system.trueForm", r.trueForm)), t;
}
function R(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function Te(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Mn {
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
    return this.getNumber(t, Le.ritual.dt, 0);
  }
  getResources(t) {
    const r = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, a = [];
    for (const n of ["PV", "SAN", "PE", "PD"]) {
      const o = this.resourceAdapter.getResource(t, n);
      o.ok ? r[n] = o.value : a.push(o.error);
    }
    return { values: r, errors: a };
  }
  getNumber(t, r, a) {
    const n = foundry.utils.getProperty(t, r);
    return typeof n == "number" && Number.isFinite(n) ? n : a;
  }
}
class Un {
  async applyPreset(t, r, a = {}) {
    const n = {
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
    return await this.writeAutomationFlag(t, n), n;
  }
  async applyManualDefinition(t, r, a = r.label) {
    const n = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: a,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: r
    };
    return await this.writeAutomationFlag(t, n), n;
  }
  async clear(t) {
    await t.unsetFlag(u, "automation");
  }
  async writeAutomationFlag(t, r) {
    await this.clear(t), await t.setFlag(u, "automation", r);
  }
}
class Bn {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = xn(t);
    return r.ok ? this.presets.has(t.id) ? d({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Pe(t)), g(t)) : r;
  }
  registerMany(t) {
    const r = [];
    for (const a of t) {
      const n = this.register(a);
      if (!n.ok)
        return n;
      r.push(n.value);
    }
    return g(r);
  }
  get(t) {
    const r = this.presets.get(t);
    return r ? Pe(r) : null;
  }
  require(t) {
    const r = this.get(t);
    return r ? g(r) : d({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(Pe);
  }
  findForItem(t) {
    return this.list().map((r) => Hn(r, t)).filter((r) => r !== null).sort((r, a) => a.score - r.score || r.preset.id.localeCompare(a.preset.id));
  }
}
function xn(e) {
  return !we(e.id) || !we(e.version) || !we(e.label) ? d({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? d({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : g(e);
}
function Hn(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let a = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    a += 10, r.push(`itemType:${t.type}`);
  }
  for (const n of e.matchers) {
    const o = Vn(n, t);
    if (!o.matches)
      return null;
    a += o.score, r.push(o.reason);
  }
  return {
    preset: e,
    score: a,
    reasons: r
  };
}
function Vn(e, t) {
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
      const r = bt(t.name), a = e.names.map(bt).includes(r);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = jn(t), a = r !== null && e.circles.includes(r);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function bt(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function jn(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function Pe(e) {
  return structuredClone(e);
}
function we(e) {
  return typeof e == "string" && e.length > 0;
}
function ie(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? d({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : g(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = fe(e.amountFrom);
    if (!r)
      return d({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const a = t.rolls[r];
    if (!a)
      return d({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${r}.`
      });
    const n = Math.trunc(a.total);
    return !Number.isInteger(n) || n <= 0 ? d({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${r} não gerou um amount positivo.`
    }) : g(n);
  }
  return d({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function fe(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const Gn = "dice-so-nice";
async function qn(e) {
  if (!hn().enabled || !zn()) return;
  const t = Wn();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      c.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function zn() {
  return game.modules.get(Gn)?.active === !0;
}
function Wn() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Kn(e, t, r) {
  if (!kt(e.id) || !kt(e.formula))
    return d({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const a = new Roll(e.formula), n = await Promise.resolve(a.evaluate()), o = n.total;
    if (typeof o != "number" || !Number.isFinite(o))
      return d({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await qn(n);
    const i = {
      ...r.rollRequests[e.id] ?? lr(e, t),
      total: o,
      roll: n
    };
    return r.rolls[e.id] = i, g(i);
  } catch (a) {
    return d({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: a
    });
  }
}
function lr(e, t) {
  const r = e.intent ?? Yn(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function Yn(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function kt(e) {
  return typeof e == "string" && e.length > 0;
}
async function ce(e, t, r, a, n) {
  switch (a) {
    case "spend":
      return r !== "PE" && r !== "PD" ? ne(t, r, a, n) : e.spend(t, r, n);
    case "damage":
      return r !== "PV" && r !== "SAN" ? ne(t, r, a, n) : e.damage(t, r, n);
    case "heal":
      return r !== "PV" ? ne(t, r, a, n) : e.heal(t, r, n);
    case "recover":
      return r !== "SAN" ? ne(t, r, a, n) : e.recover(t, r, n);
  }
}
function ne(e, t, r, a) {
  return d({
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
function Qn(e) {
  const { step: t, context: r, transaction: a, stepIndex: n, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = Xn(t, r, a, n);
    r.damageInstances.push(s), o.emit("afterDamageResolution", r, {
      stepIndex: n,
      step: t,
      damage: s,
      resourceTransaction: a,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), o.emit("afterApplyDamage", r, {
      stepIndex: n,
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
    const s = Zn(t, r, a, n);
    r.healingInstances.push(s), o.emit("afterApplyHealing", r, {
      stepIndex: n,
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
function Xn(e, t, r, a) {
  const n = fe(e.amountFrom), o = n ? t.rolls[n] : void 0;
  return {
    id: dr(t.id, "damage", a, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: n ?? void 0,
    damageType: o?.damageType,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Zn(e, t, r, a) {
  const n = fe(e.amountFrom);
  return {
    id: dr(t.id, "healing", a, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: n ?? void 0,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function dr(e, t, r, a) {
  return `${e}.${t}.${r}.${a}`;
}
function Jn(e, t, r) {
  const a = fe(e.amountFrom), n = a ? t.rolls[a] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    amountFrom: e.amountFrom,
    rollId: a,
    rollIntent: n?.intent,
    damageType: n?.damageType
  };
}
function eo(e) {
  const { step: t, context: r, stepIndex: a, metadata: n, lifecycle: o } = e;
  o.emit("beforeApply", r, { stepIndex: a, step: t, metadata: n }), mr("before", e), Tt("before", e), Tt("resolve", e);
}
function to(e) {
  const { step: t, context: r, stepIndex: a, metadata: n, lifecycle: o } = e;
  o.emit("apply", r, { stepIndex: a, step: t, metadata: n }), mr("apply", e);
}
function ro(e) {
  const { step: t, context: r, stepIndex: a, metadata: n, lifecycle: o } = e;
  o.emit("afterApply", r, { stepIndex: a, step: t, metadata: n });
}
function mr(e, t) {
  const { step: r, context: a, stepIndex: n, metadata: o, lifecycle: s } = t, i = ao(e, r.operation);
  i && s.emit(i, a, {
    stepIndex: n,
    step: r,
    metadata: o
  });
}
function Tt(e, t) {
  const { step: r, context: a, stepIndex: n, metadata: o, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: n,
    step: r,
    metadata: o
  });
}
function ao(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function no(e, t, r) {
  try {
    return await e.createWorkflowSummaryMessage(r, t), g(void 0);
  } catch (a) {
    return d({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: a
    });
  }
}
async function oo(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return so(e, t);
    case "spendRitualCost":
      return io(e, t);
  }
}
async function so(e, t) {
  const { context: r, resources: a } = e, n = ie(t, r);
  return n.ok ? fr(await a.spend(r.sourceActor, t.resource, n.value), r) : d(n.error);
}
async function io(e, t) {
  const { context: r, resources: a, ritualCosts: n } = e, o = n.getCost({
    actor: r.sourceActor,
    ritual: r.item
  });
  if (!o.ok)
    return d({
      reason: "ritual-cost-failed",
      message: o.error.message,
      cause: o.error
    });
  const s = o.value;
  return r.ritualCosts.push({
    ...s,
    itemId: r.item.id ?? null,
    itemName: r.item.name ?? "Ritual sem nome"
  }), fr(await a.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function fr(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), g(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), d({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function co(e) {
  const { step: t, context: r, stepIndex: a, lifecycle: n, execute: o } = e, s = uo(t);
  for (const l of s.before)
    n.emit(l, r, { stepIndex: a, step: t });
  const i = await o();
  if (!i.ok)
    return i;
  for (const l of s.after)
    n.emit(l, r, { stepIndex: a, step: t });
  return i;
}
function uo(e) {
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
class lo {
  constructor(t, r, a, n) {
    this.resources = t, this.ritualCosts = r, this.messages = a, this.lifecycle = n;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, r) {
    if (t.steps.length === 0)
      return d({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: r
      });
    for (const [a, n] of t.steps.entries()) {
      const o = await this.runStep(n, r, a);
      if (!o.ok)
        return o;
    }
    return g({ definition: t, context: r });
  }
  async runStep(t, r, a) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, r, a);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, r, a);
      default:
        return co({
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
        return d({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: a,
          step: t,
          context: r
        });
    }
  }
  async runCostStep(t, r, a) {
    const n = await oo({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return n.ok ? g(void 0) : d({ ...n.error, stepIndex: a, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, a) {
    const n = lr(t, a);
    r.rollRequests[n.id] = n, this.lifecycle.emit("beforeRoll", r, { stepIndex: a, step: t, rollRequest: n }), this.emitSpecificRollPhase("before", n, r, a, t), this.lifecycle.emit("roll", r, { stepIndex: a, step: t, rollRequest: n }), this.emitSpecificRollPhase("roll", n, r, a, t);
    const o = await this.runRollFormulaStep(t, r, a);
    if (!o.ok)
      return o;
    const s = r.rolls[n.id];
    return this.emitSpecificRollPhase("after", n, r, a, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: a, step: t, rollRequest: n, rollResult: s }), g(void 0);
  }
  async runRollFormulaStep(t, r, a) {
    const n = await Kn(t, a, r);
    return n.ok ? g(void 0) : d({ ...n.error, stepIndex: a, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, a) {
    const n = ie(t, r);
    if (!n.ok)
      return d({ ...n.error, stepIndex: a, step: t, context: r });
    const o = Jn(t, r, n.value);
    eo({
      step: t,
      context: r,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), to({
      step: t,
      context: r,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, r);
    if (s.length === 0)
      return d({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: t,
        context: r
      });
    for (const i of s) {
      const l = await ce(this.resources, i, t.resource, t.operation, n.value), p = this.handleResourceOperationResult(l, r, a, t);
      if (!p.ok)
        return p;
      Qn({
        step: t,
        context: r,
        transaction: p.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return ro({
      step: t,
      context: r,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), g(void 0);
  }
  async runModifyResourceStep(t, r, a) {
    const n = ie(t, r);
    if (!n.ok)
      return d({ ...n.error, stepIndex: a, step: t, context: r });
    const o = this.resolveActors(t.actor, r);
    if (o.length === 0)
      return d({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: t,
        context: r
      });
    for (const s of o) {
      const i = await ce(this.resources, s, t.resource, t.operation, n.value), l = this.handleResourceOperationResult(i, r, a, t);
      if (!l.ok)
        return l;
    }
    return g(void 0);
  }
  async runChatCardStep(t, r, a) {
    const n = await no(this.messages, t, r);
    return n.ok ? g(void 0) : d({ ...n.error, stepIndex: a, step: t, context: r });
  }
  handleResourceOperationResult(t, r, a, n) {
    return t.ok ? (r.resourceTransactions.push(t.value), g(t.value)) : d({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: a,
      step: n,
      context: r,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, r, a, n, o, s) {
    const i = mo(t, r.intent);
    i && this.lifecycle.emit(i, a, {
      stepIndex: n,
      step: o,
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
function mo(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class fo {
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
  async execute(t, r, a, n) {
    if (!Number.isInteger(n) || n <= 0)
      return d({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: n
      });
    const o = this.adapter.getResource(t, r);
    if (!o.ok)
      return d({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: o.error.reason,
        message: o.error.message,
        requestedAmount: n,
        path: o.error.path,
        value: o.error.value
      });
    const s = o.value, i = this.calculate(a, s, n);
    if (!i.ok)
      return d({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: i.error.reason,
        message: i.error.message,
        requestedAmount: n,
        current: s.value,
        required: n
      });
    const { afterValue: l, appliedAmount: p } = i.value, y = {
      value: l,
      max: s.max
    };
    try {
      l !== s.value && await this.adapter.updateResourceValue(t, r, l);
    } catch (A) {
      return d({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: "update-failed",
        message: `Falha ao atualizar ${r} no ator.`,
        requestedAmount: n,
        current: s.value,
        required: n,
        cause: A
      });
    }
    return g({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: r,
      operation: a,
      requestedAmount: n,
      appliedAmount: p,
      before: s,
      after: y
    });
  }
  calculate(t, r, a) {
    switch (t) {
      case "spend":
        return r.value < a ? d({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${r.value}; custo: ${a}.`
        }) : g({
          afterValue: r.value - a,
          appliedAmount: a
        });
      case "damage": {
        const n = Math.max(0, r.value - a);
        return g({
          afterValue: n,
          appliedAmount: r.value - n
        });
      }
      case "heal":
      case "recover": {
        const n = Math.min(r.max, r.value + a);
        return g({
          afterValue: n,
          appliedAmount: n - r.value
        });
      }
    }
  }
}
function po(e) {
  return {
    id: go(),
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
function go() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class ho {
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
    return O(this.lastContext);
  }
  async runAutomation(t, r) {
    const a = po(r);
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
    const n = await this.automation.run(t, a);
    return n.ok ? (this.hooks.emit("completed", a), n) : (this.emitFailed(a, n.error), n);
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
class yo {
  emit(t, r, a = {}) {
    const n = {
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
    }), Hooks.callAll(`${u}.workflow.${t}`, n), Hooks.callAll(`${u}.workflow.phase`, n), n;
  }
}
class Ao {
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
    const r = ve();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Ro(),
      flags: {
        ...t.flags,
        [u]: {
          ...bo(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && c.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const a = ve();
    if (!a.enabled)
      return;
    const n = r.notification ?? Pt(r);
    a.console && this.emitConsole(t, r), a.ui && this.emitUi(t, n);
  }
  emitConsole(t, r) {
    const a = Pt(r);
    switch (t) {
      case "info":
        c.info(a, r.data ?? "");
        return;
      case "warn":
        c.warn(a, r.data ?? "");
        return;
      case "error":
        c.error(a, r.data ?? "");
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
function Pt(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Ro() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function bo(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const ko = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", pr = `${u}-inline-roll-neutralized`, To = `${u}-inline-roll-notice`, Qe = `data-${u}-inline-roll-neutralized`, wt = `data-${u}-inline-roll-notice`, Po = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function wo(e) {
  const t = Uo(e.message), r = await $o(e.message), a = Io(t);
  return r.replacementCount + a.replacementCount > 0 && c.info("Rolagens inline neutralizadas para item automatizado.", {
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
async function $o(e) {
  const t = Oo(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = So(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await Fo(t, r.content), replacementCount: r.replacementCount };
}
function Io(e) {
  const t = e ? Mo(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = gr(t);
  return r > 0 && hr(Do(t)), { replacementCount: r };
}
function So(e) {
  const t = Co(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const a = gr(r.content), n = t.replacementCount + a;
  return n === 0 ? { content: e, replacementCount: 0 } : (hr(r.content), { content: r.innerHTML, replacementCount: n });
}
function Co(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (a, n) => (t += 1, _o(n.trim()))), replacementCount: t };
}
function gr(e) {
  const t = Eo(e);
  for (const r of t)
    r.replaceWith(vo(No(r)));
  return t.length;
}
function Eo(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(ko))
    r.getAttribute(Qe) !== "true" && t.add(r);
  return Array.from(t);
}
function _o(e) {
  return `<span class="${pr}" ${Qe}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Bo(e)}</span>`;
}
function vo(e) {
  const t = document.createElement("span");
  return t.classList.add(pr), t.setAttribute(Qe, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function hr(e) {
  if (e.querySelector?.(`[${wt}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(To), t.setAttribute(wt, "true"), t.textContent = Po, e.append(t);
}
function Do(e) {
  return e.querySelector(".message-content") ?? e;
}
function No(e) {
  const r = e.getAttribute("data-formula") ?? Lo(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function Lo(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Oo(e) {
  return e && typeof e == "object" ? e : null;
}
async function Fo(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return c.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function Mo(e) {
  const t = xo(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Uo(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Bo(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function xo(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const yr = ["base", "discente", "verdadeiro"];
function Ar(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Ho(e) {
  return typeof e == "string" && yr.includes(e);
}
async function Vo(e) {
  const t = Ko();
  return t ? new Promise((r) => {
    let a = !1;
    const n = (o) => {
      a || (a = !0, r(o));
    };
    new t({
      title: `Conjurar ${e.ritual.name ?? "ritual"}`,
      content: jo(e),
      default: "cast",
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: () => n(null)
        },
        cast: {
          icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
          label: "Conjurar",
          callback: (o) => n(qo(o, e.defaultSpendResource))
        }
      },
      close: () => n(null)
    }).render(!0);
  }) : (ui.notifications?.warn("Paranormal Toolkit: Dialog não disponível. Usando opções padrão do ritual."), {
    variant: "base",
    spendResource: e.defaultSpendResource
  });
}
function jo(e) {
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
        ${e.variantOptions.map(Go).join("")}
      </fieldset>

      <label class="paranormal-toolkit-ritual-cast-dialog__checkbox">
        <input type="checkbox" name="spendResource" ${a}>
        Gastar PE/PD automaticamente
      </label>

      <dl class="paranormal-toolkit-ritual-cast-dialog__summary">
        <div><dt>Custo base previsto</dt><dd>${G(r)}</dd></div>
        <div><dt>Conjurador</dt><dd>${G(e.actor.name ?? "Ator sem nome")}</dd></div>
        <div><dt>Alvos</dt><dd>${G(t)}</dd></div>
      </dl>
    </form>
  `;
}
function Go(e) {
  const t = e.variant === "base" ? "checked" : "", r = e.enabled ? "" : "disabled", a = e.enabled ? "" : e.unavailableReason ?? "não disponível neste ritual", n = [...e.details, a].filter((s) => s.length > 0).join(" · ");
  return `
    <label class="paranormal-toolkit-ritual-cast-dialog__variant${e.enabled ? "" : " paranormal-toolkit-ritual-cast-dialog__variant--disabled"}">
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-main">
        <input type="radio" name="variant" value="${G(e.variant)}" ${t} ${r}>
        <strong>${G(e.label)}</strong>
      </span>
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-details">${G(n)}</span>
    </label>
  `;
}
function qo(e, t) {
  const r = Wo(e), a = zo(r), n = r?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: a,
    spendResource: n
  };
}
function zo(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return Ho(t) ? t : "base";
}
function Wo(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ko() {
  return globalThis.Dialog ?? null;
}
function G(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const Rr = {
  label: "Padrão"
};
class Yo {
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
    const a = this.resolveCostPreview(t), n = bs(r, a), o = await Vo({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((T) => T.name),
      cost: a,
      defaultSpendResource: Ps(r),
      variantOptions: n
    });
    if (!o)
      return { status: "cancelled" };
    const s = Ts(r, o.variant), i = Qo(r, o, s, a);
    if (i.steps.length === 0)
      return {
        status: "failed",
        reason: "empty-preparation",
        message: "O ritual não possui custo ou rolagem para preparar antes das ações no chat."
      };
    const l = await this.workflow.runAutomation(i, {
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
          variant: o.variant,
          spendResource: o.spendResource
        }
      }
    });
    if (!l.ok)
      return {
        status: "failed",
        reason: l.error.reason,
        message: l.error.message,
        cause: l.error
      };
    const p = l.value.context, y = Zo(r, t, p), A = cs(r, o, s, a, p);
    return y.ok ? y.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: p,
      summaryLines: A
    } : {
      status: "ready",
      workflowContext: p,
      actions: y.actions,
      summaryLines: A
    } : {
      status: "failed",
      reason: y.reason,
      message: y.message
    };
  }
  async applyAction(t) {
    return ce(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function Qo(e, t, r, a) {
  const n = [];
  for (const o of e.steps)
    o.type === "modifyResource" || o.type === "chatCard" || Tr(o) && !t.spendResource || n.push(Xo(o, r));
  return t.spendResource && a && Pr(r.extraCost) && n.push({
    type: "spendResource",
    actor: "self",
    resource: a.resource,
    amount: r.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: n
  };
}
function Xo(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function Zo(e, t, r) {
  const a = [];
  for (const n of e.steps) {
    if (n.type !== "modifyResource") continue;
    const o = ie(n, r);
    if (!o.ok)
      return {
        ok: !1,
        reason: o.error.reason,
        message: o.error.message
      };
    const s = is(n.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      a.push(...Jo(e, n, i, o.value));
  }
  return { ok: !0, actions: a };
}
function Jo(e, t, r, a) {
  if (!as(e, t))
    return [$t(t, r, a)];
  const n = ss();
  return br(e).map((o) => {
    const s = ns(a, o);
    return $t(t, r, s, {
      option: o,
      choiceGroupId: n
    });
  });
}
function $t(e, t, r, a) {
  const n = t.name ?? "Ator sem nome", o = rs(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: n,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: es(e, n, r, a?.option),
    executedLabel: ts(e, n, a?.option),
    choiceGroupId: a?.choiceGroupId,
    choiceGroupResolvedLabel: a ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function es(e, t, r, a) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? a ? `${a.id === "normal" ? "Normal" : a.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function ts(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function rs(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function as(e, t) {
  return t.operation === "damage" && t.resource === "PV" && br(e).length > 1;
}
function br(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function ns(e, t) {
  const r = e * t.multiplier, a = os(r, t.rounding ?? "floor");
  return Math.max(0, a);
}
function os(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function ss() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function is(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function cs(e, t, r, a, n) {
  return [
    `Forma: ${Ar(t.variant)}`,
    us(t, r, a),
    ...Object.values(n.rolls).flatMap(ls),
    ...ds(e.resistance),
    ...As(r)
  ];
}
function us(e, t, r) {
  const a = t.extraCost ?? 0;
  return r ? e.spendResource ? a > 0 ? `Custo: ${r.amount + a} ${r.resource} gasto (${r.amount} base + ${a} extra)` : `Custo: ${r.amount} ${r.resource} gasto` : a > 0 ? `Custo: ${r.amount} ${r.resource} + ${a} extra não gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? a > 0 ? `Custo: não resolvido (+${a} extra)` : "Custo: não resolvido" : "Custo: não gasto";
}
function ls(e) {
  const r = [`${Rs(e)}: ${e.formula} = ${Math.trunc(e.total)}`], a = ms(e.roll);
  return a && r.push(`Dados: ${a}`), e.damageType && r.push(`Tipo: ${ys(e.damageType)}`), r;
}
function ds(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function ms(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const r = [];
  let a = "+";
  for (const n of t) {
    if (!n || typeof n != "object") continue;
    const o = n;
    if (o.operator === "+" || o.operator === "-") {
      a = o.operator;
      continue;
    }
    const s = fs(o);
    s && (hs(r, s.operator ?? a, s.value), a = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function fs(e) {
  const t = ps(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : gs(e);
}
function ps(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function gs(e) {
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
function hs(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function ys(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function As(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Rs(e) {
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
function bs(e, t) {
  return yr.map((r) => {
    const a = kr(e, r), n = r === "base" || a !== null, o = a ?? (r === "base" ? Rr : null);
    return {
      variant: r,
      label: o?.label ?? Ar(r),
      enabled: n,
      details: o ? ks(o, t) : [],
      unavailableReason: n ? void 0 : "não disponível neste ritual"
    };
  });
}
function ks(e, t) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {});
  return a.length > 0 && r.push(a.join(", ")), Pr(e.extraCost) ? r.push(t ? `+${e.extraCost} ${t.resource}` : `+${e.extraCost} PE/PD`) : r.push("custo base"), r;
}
function Ts(e, t) {
  return kr(e, t) ?? Rr;
}
function kr(e, t) {
  return e.ritualForms?.[t] ?? null;
}
function Ps(e) {
  return e.steps.some(Tr);
}
function Tr(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Pr(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function ws(e, t) {
  const r = await $s(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: Ss(r),
    total: Cs(r),
    diceBreakdown: Es(r)
  };
}
function wr(e) {
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
async function $s(e, t) {
  const r = e;
  if (typeof r.rollSkill != "function")
    return null;
  const a = await Promise.resolve(
    r.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return Is(a);
}
function Is(e) {
  return It(e) ? e : Array.isArray(e) ? e.find(It) ?? null : null;
}
function It(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Ss(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Cs(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Es(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(_s);
  if (!r) return null;
  const n = (Array.isArray(r.results) ? r.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return n.length > 0 ? `(${n.join(", ")})` : null;
}
function _s(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const $r = "itemUsePrompts", Ir = "chatCard", pe = "data-paranormal-toolkit-prompt-id", ge = "data-paranormal-toolkit-pending-id", Xe = "data-paranormal-toolkit-executed-label", Me = "data-paranormal-toolkit-choice-group", Sr = "data-paranormal-toolkit-skipped-label", St = "data-paranormal-toolkit-action-section", Ct = "data-paranormal-toolkit-detail-key", Et = "data-paranormal-toolkit-roll-card", Ze = "data-paranormal-toolkit-roll-detail-toggle", Cr = "data-paranormal-toolkit-roll-detail-id", Er = "data-paranormal-toolkit-resistance-roll-button", _r = "data-paranormal-toolkit-resistance-skill", vr = "data-paranormal-toolkit-resistance-skill-label", Dr = "data-paranormal-toolkit-resistance-target-actor-id", Nr = "data-paranormal-toolkit-resistance-target-name", Lr = "data-paranormal-toolkit-resistance-roll-result", _t = "data-paranormal-toolkit-system-card-replaced", vs = `[${ge}]`, Ds = `[${Ze}]`, Ns = `[${Er}]`, Ue = `${u}-chat-enrichment`, f = `${u}-item-use-prompt`, Ls = `${f}__actions`, vt = `${f}__details`, Or = `${f}__summary`, Os = `${f}__title`, Fr = `${f}__button--executed`, Dt = `${f}__roll-card`;
let Nt = !1, Be = null;
const S = /* @__PURE__ */ new Map();
function Fs(e) {
  Be = e, !Nt && (Hooks.on("renderChatMessageHTML", (t, r) => {
    xs(t, r, e);
  }), Nt = !0);
}
async function Lt(e) {
  const t = Bs(e);
  S.set(e.pendingId, t), await Ci(t), Hs(e.pendingId);
}
async function $e(e, t) {
  const r = S.get(e);
  S.delete(e), r && await Ei(r, t);
}
function Je(e) {
  const t = ji();
  for (const r of t) {
    const a = C(r)[e];
    if (a) return { message: r, prompt: a };
  }
  return null;
}
async function Ms(e, t) {
  const r = Je(e);
  if (!r) return;
  const a = C(r.message), n = a[e];
  n && (a[e] = {
    ...n,
    executedLabel: n.executedLabel,
    executed: !0
  }, await W(r.message, a));
}
async function Us(e, t, r) {
  if (!t) return;
  const a = Je(e);
  if (!a) return;
  const n = C(a.message);
  let o = !1;
  for (const [s, i] of Object.entries(n))
    s !== e && i.choiceGroupId === t && (n[s] = {
      ...i,
      executedLabel: r ?? i.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await W(a.message, n);
}
function Bs(e) {
  const t = U(e.context.message), r = e.context.targets.find((s) => je(s)), a = r ? je(r) : null, n = e.resistanceTargetActor ?? a, o = e.resistanceTargetName ?? r?.name ?? n?.name ?? e.context.targets[0]?.name ?? null;
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    resistanceTargetActorId: e.resistanceTargetActorId ?? n?.id ?? null,
    resistanceTargetName: o,
    resistanceRollResult: null,
    actionPayload: e.actionPayload ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: ai(e.context),
    executed: !1
  };
}
function xs(e, t, r) {
  Si();
  const a = ye(t);
  if (!a) return;
  const n = wi(e, a);
  n.length > 0 && ue(a);
  for (const o of n)
    xe(a, o);
  Br(a, r), He(a), Ve(a);
}
function Hs(e) {
  const t = S.get(e);
  if (!t) return;
  const r = t.messageId ? $i(t.messageId) : null;
  if (r) {
    Mt(r, t), ue(r), xe(r, t), Ot(r), He(r), Ve(r);
    return;
  }
  if (t.messageId) return;
  const a = Ii(t);
  a && (Mt(a, t), ue(a), xe(a, t), Ot(a), He(a), Ve(a));
}
function Ot(e) {
  Be && Br(e, Be);
}
function ue(e) {
  const t = Vs();
  e.classList.toggle(`${f}--system-card-replaced`, t);
  const r = Ur(e);
  if (!r || (r.classList.toggle(`${f}__host--system-card-replaced`, t), !t) || r.getAttribute(_t) === "true") return;
  const a = r.querySelector(`.${Ue}`);
  a ? r.replaceChildren(a) : r.replaceChildren(), r.setAttribute(_t, "true");
}
function Vs() {
  try {
    return za() === "replace";
  } catch {
    return !1;
  }
}
function xe(e, t) {
  if (ue(e), e.querySelector(`[${pe}="${K(t.pendingId)}"]`)) return;
  const r = js(e, t);
  qs(r, t), Zs(r, Js(t)).append(ri(t));
}
function js(e, t) {
  const r = e.querySelector(`.${Ue}`);
  if (r)
    return r;
  const a = document.createElement("section");
  a.classList.add(Ue, f);
  const n = document.createElement("header");
  n.classList.add(`${f}__header`);
  const o = document.createElement("span");
  o.classList.add(`${f}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Os), s.textContent = Gs(t);
  const i = document.createElement("span");
  return i.classList.add(Or), i.textContent = t.summary, n.append(o, s, i), a.append(n), oi(e).append(a), a;
}
function Gs(e) {
  const t = P(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function qs(e, t) {
  const r = t.summaryLines ?? [], a = jr(r, t);
  if (a) {
    zs(e, a, t);
    return;
  }
  ei(e, r);
}
function zs(e, t, r) {
  if (e.querySelector(`[${Et}="true"]`)) return;
  const a = document.createElement("article");
  a.classList.add(Dt, `${Dt}--${t.intent}`), a.setAttribute(Et, "true");
  const n = document.createElement("div");
  n.classList.add(`${f}__roll-summary`);
  const o = document.createElement("span");
  o.classList.add(`${f}__roll-chip`, `${f}__roll-chip--${t.intent}`), o.textContent = t.label.toUpperCase();
  const s = document.createElement("strong");
  s.classList.add(`${f}__roll-total`), s.textContent = String(t.total);
  const i = document.createElement("span");
  i.classList.add(`${f}__roll-formula`), i.textContent = t.formula, n.append(o, s, i), a.append(n), Ws(a, t), Ks(a, t, r), Qs(a, t, r.pendingId), e.append(a);
}
function Ws(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Vi);
  if (r.length === 0) return;
  const a = document.createElement("div");
  a.classList.add(`${f}__roll-meta`);
  for (const n of r) {
    const o = document.createElement("span");
    o.classList.add(`${f}__roll-meta-pill`), o.textContent = n, a.append(o);
  }
  e.append(a);
}
function Ks(e, t, r) {
  if (!t.resistance) return;
  const a = document.createElement("div");
  a.classList.add(`${f}__resistance`);
  const n = document.createElement("div");
  n.classList.add(`${f}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = Ys(t, r);
  n.append(o), s && n.append(s);
  const i = document.createElement("span");
  i.classList.add(`${f}__resistance-description`), i.textContent = t.resistance, a.append(n, i), t.resistanceRollResult && a.append(Mr(t.resistanceRollResult)), e.append(a);
}
function Ys(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${f}__resistance-roll-button`), r.setAttribute(pe, t.pendingId), r.setAttribute(Er, "true"), r.setAttribute(_r, e.resistanceSkill), r.setAttribute(vr, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(Dr, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(Nr, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${f}__resistance-roll-button--rolled`), r.setAttribute(Lr, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const a = document.createElement("i");
  a.classList.add("fa-solid", "fa-dice-d20"), a.setAttribute("aria-hidden", "true");
  const n = document.createElement("span");
  return n.classList.add(`${f}__resistance-roll-fallback`), n.textContent = "d20", r.append(a, n), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function Mr(e) {
  const t = document.createElement("span");
  return t.classList.add(`${f}__resistance-roll-result`), t.textContent = Hr(e), t;
}
function Qs(e, t, r) {
  const a = Xs(t);
  if (a.length === 0) return;
  const n = `${r}-roll-details`, o = document.createElement("button");
  o.type = "button", o.classList.add(`${f}__roll-detail-toggle`), o.setAttribute(Ze, n), o.setAttribute("aria-expanded", "false"), o.textContent = "▸ Ver detalhes";
  const s = document.createElement("dl");
  s.classList.add(`${f}__roll-detail-list`), s.setAttribute(Cr, n), s.hidden = !0;
  for (const i of a) {
    const l = document.createElement("dt");
    l.textContent = i.label;
    const p = document.createElement("dd");
    p.textContent = i.value, s.append(l, p);
  }
  e.append(o, s);
}
function Xs(e) {
  const t = [
    { label: "Fórmula", value: e.formula }
  ];
  e.diceBreakdown && t.push({ label: "Dados", value: e.diceBreakdown }), e.damageType && t.push({ label: "Tipo", value: e.damageType }), e.resistance && t.push({ label: "Resistência", value: e.resistance }), e.form && t.push({ label: "Forma", value: e.form }), e.cost && t.push({ label: "Custo", value: e.cost });
  for (const r of e.notes)
    t.push({ label: "Observação", value: r });
  for (const r of e.details)
    t.push({ label: "Detalhe", value: r });
  return t;
}
function Zs(e, t) {
  const r = `[${St}="${K(t.id)}"]`, a = e.querySelector(r);
  if (a)
    return a;
  const n = document.createElement("div");
  n.classList.add(Ls), n.setAttribute(St, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${f}__actions-title`), o.textContent = t.title, n.append(o), e.append(n), n;
}
function Js(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const a = jr(e.summaryLines ?? [], e);
  return a?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : a?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function ei(e, t) {
  if (t.length === 0) return;
  const r = ti(e);
  for (const a of t) {
    const n = Gi(a);
    if (r.querySelector(`[${Ct}="${K(n)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = a, o.setAttribute(Ct, n), r.append(o);
  }
}
function ti(e) {
  const t = e.querySelector(`.${vt}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(vt), e.append(r), r;
}
function ri(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${f}__button`), t.setAttribute(pe, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Fr), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(ge, e.pendingId), t.setAttribute(Xe, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Me, e.choiceGroupId), t.setAttribute(Sr, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function ai(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = ni(e);
  return `${t} → ${r}`;
}
function ni(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function oi(e) {
  return Ur(e) ?? e;
}
function Ur(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Br(e, t) {
  const r = ye(e);
  if (!r) return;
  const a = r.querySelectorAll(vs);
  for (const n of a)
    n.dataset.paranormalToolkitBound !== "true" && (n.dataset.paranormalToolkitBound = "true", n.addEventListener("click", () => {
      bi(n, t);
    }));
}
function He(e) {
  const t = ye(e);
  if (!t) return;
  const r = t.querySelectorAll(Ds);
  for (const a of r)
    a.dataset.paranormalToolkitRollDetailsBound !== "true" && (a.dataset.paranormalToolkitRollDetailsBound = "true", a.addEventListener("click", () => {
      si(t, a);
    }));
}
function Ve(e) {
  const t = ye(e);
  if (!t) return;
  const r = t.querySelectorAll(Ns);
  for (const a of r)
    a.dataset.paranormalToolkitResistanceRollBound !== "true" && (a.dataset.paranormalToolkitResistanceRollBound = "true", a.addEventListener("click", () => {
      ii(t, a);
    }));
}
function si(e, t) {
  const r = t.getAttribute(Ze);
  if (!r) return;
  const a = e.querySelector(`[${Cr}="${K(r)}"]`);
  if (!a) return;
  const n = a.hidden;
  a.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.textContent = n ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function ii(e, t) {
  const r = t.getAttribute(pe), a = t.getAttribute(_r), n = t.getAttribute(vr) ?? (a ? wr(a) : "Resistência");
  if (!r || !a) return;
  const o = di(e, r), s = mi(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const l = await ws(s, a);
    await yi(l.roll);
    const p = {
      skill: a,
      skillLabel: n,
      formula: l.formula,
      total: l.total,
      targetName: s.name ?? o?.resistanceTargetName ?? "alvo",
      diceBreakdown: l.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    ci(t, p), li(t, p), Ai(r, p), await Ri(e, r, p);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", l), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${n}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function ci(e, t) {
  e.classList.add(`${f}__resistance-roll-button--rolled`), e.setAttribute(Lr, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function li(e, t) {
  const r = e.closest(`.${f}__resistance`);
  if (!r) return;
  const a = r.querySelector(`.${f}__resistance-roll-result`), n = a ?? Mr(t);
  if (a) {
    a.textContent = Hr(t);
    return;
  }
  r.append(n);
}
function di(e, t) {
  const r = S.get(t);
  if (r) return r;
  const a = et(e);
  return C(a)[t] ?? null;
}
function mi(e, t) {
  const r = e?.resistanceTargetActor;
  if (I(r)) return r;
  const n = e?.context?.targets.map(je).find(I) ?? null;
  if (n) return n;
  const o = t.getAttribute(Dr) ?? e?.resistanceTargetActorId ?? null, s = o ? pi(o) : null;
  return s || gi(
    t.getAttribute(Nr) ?? e?.resistanceTargetName ?? fi(t)
  );
}
function fi(e) {
  const r = e.closest(`.${f}`)?.querySelector(`.${Or}`)?.textContent ?? null;
  if (!r) return null;
  const a = "→";
  if (!r.includes(a)) return null;
  const n = r.split(a), o = n[n.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function je(e) {
  const t = e.actor;
  if (I(t)) return t;
  const r = e.token, a = Z(r);
  if (a) return a;
  const n = e.document;
  return Z(n);
}
function Z(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (I(t)) return t;
  const r = e.document?.actor;
  return I(r) ? r : null;
}
function pi(e) {
  const r = game.actors?.get?.(e);
  return I(r) ? r : xr().map((o) => Z(o)).find((o) => o?.id === e) ?? null;
}
function gi(e) {
  const t = Ie(e);
  if (!t) return null;
  const r = xr().filter((o) => Ie(hi(o)) === t).map((o) => Z(o)).find(I) ?? null;
  if (r) return r;
  const n = game.actors?.find?.((o) => I(o) && Ie(o.name) === t);
  return I(n) ? n : null;
}
function xr() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function hi(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : Z(e)?.name ?? null;
}
function Ie(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function I(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Hr(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function yi(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Ai(e, t) {
  const r = S.get(e);
  r && (r.resistanceRollResult = t);
}
async function Ri(e, t, r) {
  const a = et(e);
  if (a)
    try {
      const n = C(a), o = n[t];
      if (!o) return;
      n[t] = {
        ...o,
        resistanceRollResult: r
      }, await W(a, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", n);
    }
}
function et(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const a = game.messages;
  return M(a?.get?.(r));
}
async function bi(e, t) {
  const r = e.getAttribute(ge);
  if (!r) return;
  e.disabled = !0;
  const a = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    Vr(e, e.getAttribute(Xe) ?? "✓ Automação aplicada"), ki(e);
    return;
  }
  e.disabled = !1, e.textContent = a;
}
function Vr(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Fr), e.removeAttribute(ge), e.removeAttribute(Xe);
}
function ki(e) {
  const t = e.getAttribute(Me);
  if (!t) return;
  const r = e.closest(`.${f}`) ?? e.parentElement;
  if (!r) return;
  const a = `[${Me}="${K(t)}"]`;
  for (const n of r.querySelectorAll(a)) {
    if (n === e) continue;
    const o = n.getAttribute(Sr) ?? "✓ Outra opção escolhida";
    Vr(n, o);
  }
}
function jr(e, t) {
  const r = e.map(Gr).find(xi);
  if (!r) return null;
  const a = P(e, "Forma"), n = P(e, "Custo"), o = P(e, "Dados") ?? P(e, `Dados (${r.label})`), s = P(e, "Tipo"), i = P(e, "Resistência"), l = P(e, "Resistência Perícia"), p = P(e, "Resistência Rótulo") ?? (l ? wr(l) : null), y = qr(e, "Observação"), A = e.filter((T) => Pi(T, r));
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: a,
    cost: n,
    diceBreakdown: o,
    damageType: s,
    resistance: i,
    resistanceSkill: l,
    resistanceSkillLabel: p,
    notes: y,
    details: A,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function Gr(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, a, n] = t, o = Number(n);
  return Number.isFinite(o) ? {
    label: r,
    formula: a,
    total: o,
    intent: Ti(r)
  } : null;
}
function Ti(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : "generic";
}
function P(e, t) {
  return qr(e, t)[0] ?? null;
}
function qr(e, t) {
  const r = `${t}:`;
  return e.flatMap((a) => {
    if (!a.startsWith(r)) return [];
    const n = a.slice(r.length).trim();
    return n.length > 0 ? [n] : [];
  });
}
function Pi(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || Gr(e) ? !1 : e.trim().length > 0;
}
function wi(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const a of S.values())
    se(a, e, t) && r.set(a.pendingId, a);
  for (const a of vi(e))
    se(a, e, t) && !r.has(a.pendingId) && r.set(a.pendingId, a);
  for (const a of _i(e))
    se(a, e, t) && !r.has(a.pendingId) && r.set(a.pendingId, a);
  return Array.from(r.values()).sort((a, n) => a.createdAt - n.createdAt);
}
function se(e, t, r) {
  const a = U(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === a : !e.itemId || !Ft(r, "itemId", e.itemId) ? !1 : !e.actorId || Ft(r, "actorId", e.actorId);
}
function Ft(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const a = `data-${qi(t)}`;
  for (const n of e.querySelectorAll(`[${a}]`))
    if (n.getAttribute(a) === r)
      return !0;
  return !1;
}
function $i(e) {
  const t = K(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Ii(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (se(e, null, t))
      return t;
  return null;
}
function Si() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, a] of S.entries())
    e - a.createdAt > t && S.delete(r);
}
async function Mt(e, t) {
  const r = et(e);
  if (r)
    try {
      const a = C(r);
      a[t.pendingId] = tt(t, U(r)), await W(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", a);
    }
}
async function Ci(e) {
  const t = zr(e.context.message);
  if (t)
    try {
      const r = C(t);
      r[e.pendingId] = tt(e, U(t)), await W(t, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r);
    }
}
async function Ei(e, t) {
  const r = zr(e.context.message);
  if (r)
    try {
      const a = C(r), n = a[e.pendingId] ?? tt(e, U(r));
      a[e.pendingId] = {
        ...n,
        executedLabel: t ?? n.executedLabel,
        executed: !0
      }, await W(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", a);
    }
}
function _i(e) {
  return Object.values(C(M(e))).filter(he);
}
function vi(e) {
  return Di(M(e))?.prompts ?? [];
}
function C(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, $r);
  if (!q(t))
    return {};
  const r = {};
  for (const [a, n] of Object.entries(t))
    he(n) && (r[a] = n);
  return r;
}
async function W(e, t) {
  typeof e.setFlag == "function" && (await Promise.resolve(e.setFlag(u, $r, t)), await Ni(e, t));
}
function Di(e) {
  if (!e) return null;
  const t = e.getFlag?.(u, Ir);
  return Ui(t) ? t : null;
}
async function Ni(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(he).sort((o, s) => o.createdAt - s.createdAt);
  if (r.length === 0) return;
  const a = r[0];
  if (!a) return;
  const n = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...r.map((o) => o.createdAt)),
    messageId: a.messageId ?? U(e) ?? null,
    source: {
      actorId: a.actorId,
      actorName: Li(a.summary),
      itemId: a.itemId,
      itemName: a.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(u, Ir, n));
}
function Li(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function tt(e, t) {
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
function zr(e) {
  const t = M(e);
  if (t?.setFlag)
    return t;
  const r = U(e);
  if (!r) return null;
  const a = game.messages;
  return M(a?.get?.(r));
}
function M(e) {
  return e && typeof e == "object" ? e : null;
}
function he(e) {
  return q(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && b(e.messageId) && b(e.itemId) && b(e.actorId) && b(e.itemName) && L(e.resistanceTargetActorId) && L(e.resistanceTargetName) && Bi(e.resistanceRollResult) && Oi(e.actionPayload) && Se(e.title) && Se(e.buttonLabel) && Se(e.executedLabel) && L(e.choiceGroupId) && L(e.skippedLabel) && L(e.actionSectionId) && L(e.actionSectionTitle) && Hi(e.summaryLines) : !1;
}
function Oi(e) {
  return e == null ? !0 : q(e) ? e.kind === "resource-operation" && b(e.actorId) && b(e.actorUuid) && typeof e.actorName == "string" && Fi(e.resource) && Mi(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Fi(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Mi(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Ui(e) {
  return q(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && b(e.messageId) && q(e.source) && b(e.source.actorId) && b(e.source.actorName) && b(e.source.itemId) && b(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(he) : !1;
}
function Bi(e) {
  return e == null ? !0 : q(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && L(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function xi(e) {
  return e !== null;
}
function q(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function b(e) {
  return e === null || typeof e == "string";
}
function Se(e) {
  return e === void 0 || typeof e == "string";
}
function L(e) {
  return e == null || typeof e == "string";
}
function Hi(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Vi(e) {
  return typeof e == "string" && e.length > 0;
}
function ji() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(M).filter((a) => a !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(M).filter((a) => a !== null) : [];
}
function ye(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function U(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Gi(e) {
  return e.trim().toLowerCase();
}
function qi(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function K(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ut = 1e3;
class zi {
  constructor(t, r, a, n) {
    this.workflow = t, this.resources = r, this.debugOutput = n, this.ritualAssistant = new Yo(t, r, a);
  }
  workflow;
  resources;
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
      settings: lt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = lt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const a = Ge(t.item);
    if (!a.ok) {
      const n = a.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, n, a.error.reason), a.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: a.error.message,
        data: a.error
      });
      return;
    }
    if (await wo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Bt(t, "failed", "missing-actor")
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
      return this.executePersistedPendingAutomation(t);
    if (r.kind === "workflow")
      return this.pendingExecutions.delete(t), await $e(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const a = await this.ritualAssistant.applyAction(r.action);
    return a.ok ? (r.workflowContext.resourceTransactions.push(a.value), this.pendingExecutions.delete(t), await $e(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(a), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = Je(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const a = r.prompt.actionPayload, n = Ki(a);
    if (!n)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${a.actorName} para aplicar a ação persistida.`), !1;
    const o = await ce(this.resources, n, a.resource, a.operation, a.amount);
    return o.ok ? (await Ms(t), await Us(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Fs((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
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
        this.setAttempt(t, "completed", "ritual-assisted-no-actions"), c.info("Ritual assistido concluído sem ações pendentes.", O(a.workflowContext));
        return;
      case "ready":
        await this.registerAssistedResourceActions(t, a.workflowContext, a.actions, a.summaryLines);
        return;
    }
  }
  async resolveAlternativeResourceActions(t) {
    const r = t.action.choiceGroupId;
    if (!r) return;
    const a = Array.from(this.pendingExecutions.entries()).filter(([, n]) => n.kind === "resource-action" && n.action.choiceGroupId === r);
    for (const [n, o] of a)
      o.kind === "resource-action" && (this.pendingExecutions.delete(n), await $e(
        n,
        o.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerAssistedResourceActions(t, r, a, n) {
    let o;
    for (const s of a) {
      const i = Ht();
      o ??= i, this.pendingExecutions.set(i, {
        kind: "resource-action",
        id: i,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await Lt({
        pendingId: i,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: s.choiceGroupId ?? null,
        skippedLabel: s.choiceGroupResolvedLabel ?? null,
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: n,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: Wi(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", o), c.info("Ritual assistido preparado com ações pendentes.", O(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const a = Ht();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Lt({
      pendingId: a,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", a);
  }
  async executeAutomation(t, r, a) {
    this.setAttempt(t, "running");
    const n = await this.workflow.runAutomation(r, {
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
    if (!n.ok) {
      this.setAttempt(t, "failed", n.error.reason), this.handleAutomationFailure(n.error);
      return;
    }
    this.setAttempt(t, "completed"), c.info("Automação executada por uso normal de item.", O(n.value.context));
  }
  handleAutomationFailure(t) {
    const r = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      c.warn(r, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      c.error(r, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    c.warn(r, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    c.warn(`Ação assistida falhou: ${t.error.message}`, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const r = Date.now(), a = xt(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      r - s > Ut && this.recentExecutionKeys.delete(o);
    const n = this.recentExecutionKeys.get(a);
    return n !== void 0 && r - n <= Ut;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(xt(t), Date.now());
  }
  setAttempt(t, r, a, n) {
    this.lastAttempt = Bt(t, r, a, n);
  }
}
function Wi(e) {
  return {
    kind: "resource-operation",
    actorId: e.actor.id ?? null,
    actorUuid: e.actor.uuid ?? null,
    actorName: e.actorName,
    resource: e.resource,
    operation: e.operation,
    amount: e.amount
  };
}
function Ki(e) {
  const t = e.actorUuid ? Yi(e.actorUuid) : null;
  if (z(t)) return t;
  const r = e.actorId ? Qi(e.actorId) : null;
  return r || Xi(e.actorName);
}
function Yi(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Qi(e) {
  const r = game.actors?.get?.(e);
  if (z(r)) return r;
  for (const a of Wr()) {
    const n = rt(a);
    if (n?.id === e) return n;
  }
  return null;
}
function Xi(e) {
  const t = Ce(e);
  if (!t) return null;
  for (const n of Wr()) {
    const o = Zi(n);
    if (Ce(o) === t) {
      const s = rt(n);
      if (s) return s;
    }
  }
  const a = game.actors?.find?.((n) => z(n) && Ce(n.name) === t);
  return z(a) ? a : null;
}
function Wr() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Zi(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : rt(e)?.name ?? null;
}
function rt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (z(t)) return t;
  const r = e.document?.actor;
  return z(r) ? r : null;
}
function Ce(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function z(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Bt(e, t, r, a) {
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
function xt(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function Ht() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ji {
  constructor(t, r, a) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = a;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), a = [], n = [], o = ee(t);
    for (const s of r) {
      const i = s.itemId ? o.find((y) => y.id === s.itemId) ?? null : null, l = s.match?.preset ?? null;
      if (!i || !l) {
        n.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(i, l);
      const p = await this.itemPatches.applyPresetItemPatch(i, l);
      a.push({
        itemId: i.id ?? null,
        itemName: i.name ?? "Ritual sem nome",
        presetId: l.id,
        presetLabel: l.label,
        previousStatus: s.status,
        itemPatch: p
      });
    }
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      applied: a,
      skipped: n
    };
  }
}
class ec {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = ee(t).map((i) => this.analyzeRitual(i)), a = r.filter(oe("upToDate")), n = r.filter(oe("available")), o = r.filter(oe("outdated")), s = r.filter(oe("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: r.length,
      upToDate: a,
      available: n,
      outdated: o,
      unsupported: s,
      canApply: n.length > 0 || o.length > 0
    };
  }
  getApplicableEntries(t) {
    const r = this.analyzeActor(t);
    return [...r.available, ...r.outdated];
  }
  analyzeRitual(t) {
    const r = this.automationRegistry.findForItem(t)[0] ?? null, a = tc(t);
    return r ? a ? a.source.type !== "preset" ? Y({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: a,
      reason: `Automação manual encontrada. Preset sugerido: ${r.preset.label}.`
    }) : a.source.presetId === r.preset.id && a.source.presetVersion === r.preset.version ? Y({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: a,
      reason: `Preset ${r.preset.label} v${r.preset.version} já aplicado.`
    }) : Y({
      ritual: t,
      status: "outdated",
      match: r,
      flag: a,
      reason: rc(a, r.preset)
    }) : Y({
      ritual: t,
      status: "available",
      match: r,
      flag: a,
      reason: `Preset encontrado: ${r.preset.label}.`
    }) : Y({
      ritual: t,
      status: "unsupported",
      match: r,
      flag: a,
      reason: a ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Y(e) {
  const t = e.flag?.source, r = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? me(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function tc(e) {
  const t = e.getFlag(u, "automation");
  return qe(t) ? t : null;
}
function rc(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function oe(e) {
  return (t) => t.status === e;
}
class ac {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), a = We(t.transaction);
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
    const a = this.createWorkflowSummaryContent(t, r), n = O(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: a,
      data: n,
      flags: {
        [u]: {
          workflowSummary: n
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const r = h(t.actorName), a = h(t.resource), n = h(Vt(t)), o = h(oc(t));
    return `
      <section class="${u}-card ${u}-resource-card">
        <header class="${u}-card__header">
          <strong>${n}</strong>
          <span>${r}</span>
        </header>
        <div class="${u}-card__body">
          <p><strong>${o}:</strong> ${t.appliedAmount}</p>
          <p><strong>${a}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, r) {
    const a = h(r.title ?? "Automação"), n = r.message ? `<p>${h(r.message)}</p>` : "", o = h(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = h(t.item.name ?? "Item sem nome"), i = t.targets.length > 0 ? t.targets.map((m) => h(m.name)).join(", ") : "Nenhum", l = Object.values(t.rolls).map(
      (m) => `<li><strong>${h(m.id)}:</strong> ${h(m.formula)} = ${m.total} <em>(${h(nc(m.intent))})</em>${m.damageType ? ` — ${h(m.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (m) => `<li><strong>${h(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${h(m.resource)} (${h(sc(m.source))})</li>`
    ), y = t.damageInstances.map(
      (m) => `<li><strong>${h(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${h(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (m) => `<li><strong>${h(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (m) => `<li><strong>${h(m.actorName)}:</strong> ${h(Vt(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), B = t.phases.map((m) => h(m)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${a}</strong>
          <span>${s}</span>
        </header>
        <div class="${u}-card__body">
          ${n}
          <p><strong>Origem:</strong> ${o}</p>
          <p><strong>Alvo:</strong> ${i}</p>
          ${p.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${p.join("")}</ul>` : ""}
          ${l.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${l.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Cura:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${B.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${B}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function nc(e) {
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
function Vt(e) {
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
function oc(e) {
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
function sc(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function h(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function ic() {
  const e = new yn(), t = new fo(e), r = new bn(), a = new Pn(r), n = new Mn(e), o = new Bn(), s = o.registerMany(Ia());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new Un(), l = new On(), p = new ec(o), y = new Ji(p, i, l), A = new Ao(), T = new ac(A), B = new yo(), m = new lo(t, a, T, B), at = new ho(m, B), Ae = new zi(at, t, a, A);
  return Ae.addStrategy(new Nn((Qr) => Ae.handleItemUsed(Qr))), {
    ordem: n,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: a,
    resources: t,
    automationRegistry: o,
    automationBinder: i,
    itemPatches: l,
    debugOutput: A,
    chatMessages: T,
    workflowHooks: B,
    automation: m,
    workflow: at,
    itemUseIntegration: Ae,
    ritualPresetDiagnostic: p,
    ritualPresetApplications: y
  };
}
const { ApplicationV2: cc } = foundry.applications.api;
class le extends cc {
  constructor(t, r) {
    super({
      id: `${u}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Presets de rituais: ${t.name ?? "Ator"}`
      }
    }), this.actor = t, this.services = r;
  }
  actor;
  services;
  isApplying = !1;
  lastApplicationResult = null;
  static DEFAULT_OPTIONS = {
    id: `${u}-ritual-preset-manager`,
    classes: [u, "paranormal-toolkit-ritual-preset-manager"],
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
      apply: le.onApply,
      cancel: le.onCancel
    }
  };
  async _renderHTML(t, r) {
    const a = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), n = document.createElement("div");
    return n.className = "paranormal-toolkit-preset-manager", n.innerHTML = this.renderContent(a), n;
  }
  _replaceHTML(t, r, a) {
    r.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${w(qt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${w(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Ee("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Ee("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Ee("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
    const t = this.lastApplicationResult.applied.length, r = this.lastApplicationResult.skipped.length, a = r > 0 ? ` ${r} pendente(s) não puderam ser aplicados.` : "";
    return `
      <div class="paranormal-toolkit-preset-manager__result">
        <strong>Aplicação concluída.</strong>
        <span>${t} preset(s) aplicado(s).${a}</span>
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
        const a = this.lastApplicationResult.applied.length;
        ui.notifications?.info(`Paranormal Toolkit: ${a} preset(s) aplicado(s) em ${this.actor.name ?? "ator"}.`);
      } finally {
        this.isApplying = !1, await this.render({ force: !0 });
      }
    }
  }
  static async onCancel(t) {
    t.preventDefault(), await this.close();
  }
}
function Ee(e, t, r, a) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${a}"></i>
        <span>${w(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? uc(r) : dc(t)}
    </section>
  `;
}
function uc(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(lc).join("")}</ol>`;
}
function lc(e) {
  const t = e.preset, r = t ? `${t.label} v${t.version}` : "Sem preset", a = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${w(e.appliedPresetId)} v${w(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${w(e.itemName)}</strong>
        <span>${w(e.reason)}</span>
        ${a}
      </div>
      <em>${w(r)}</em>
    </li>
  `;
}
function dc(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${w({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function w(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const de = `${u}.manageRitualPresets`, jt = `__${u}_ritualPresetHeaderControlRegistered`, mc = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function fc(e) {
  const t = globalThis;
  if (!t[jt]) {
    for (const r of mc)
      Hooks.on(r, (a, n) => {
        pc(a, n, e);
      });
    t[jt] = !0, c.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function pc(e, t, r) {
  Array.isArray(t) && hc(e) && (gc(e, r), !t.some((a) => a.action === de) && t.push({
    action: de,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (a) => {
      a.preventDefault(), a.stopPropagation(), Kr(e, r);
    }
  }));
}
function gc(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[de] && (e.options.actions[de] = (r) => {
    r.preventDefault(), r.stopPropagation(), Kr(e, t);
  }));
}
function hc(e) {
  if (!game.user?.isGM) return !1;
  const t = Yr(e);
  return t ? t.type === "agent" && ee(t).length > 0 : !1;
}
function Kr(e, t) {
  const r = Yr(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new le(r, t).render({ force: !0 });
}
function Yr(e) {
  return Gt(e.actor) ? e.actor : Gt(e.document) ? e.document : null;
}
function Gt(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let H = null;
Hooks.once("init", () => {
  Pa(), qa(), gn(), c.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!mt.isSupportedSystem()) {
    c.warn(
      `Sistema não suportado: ${mt.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  H = ic(), H.itemUseIntegration.registerStrategies(), en(H), mn(), cn(), fc(H), c.info("Inicializado para o sistema Ordem Paranormal."), c.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${qt} inicializado.`);
});
function yc() {
  if (!H)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return H;
}
export {
  yc as getToolkitServices
};
//# sourceMappingURL=main.js.map
