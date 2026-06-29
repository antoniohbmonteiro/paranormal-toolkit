const u = "paranormal-toolkit", Kt = "Paranormal Toolkit", cn = "ordemparanormal";
class ee {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function fe(e) {
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
function ze(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? d({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : We(t) ? g(t.definition) : d({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function un(e) {
  return We(e.getFlag(u, "automation"));
}
function We(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && dn(t.source) && ln(t.definition);
}
function ln(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && T(t.label) && Array.isArray(t.steps) && t.steps.every(mn);
}
function dn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? T(t.presetId) && T(t.presetVersion) && T(t.appliedAt) : t.type === "manual" ? T(t.label) && T(t.appliedAt) : !1;
}
function mn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return fn(t);
    case "spendRitualCost":
      return pn(t);
    case "rollFormula":
      return gn(t);
    case "modifyResource":
      return hn(t);
    case "chatCard":
      return yn(t);
    default:
      return !1;
  }
}
function fn(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Yt(t);
}
function pn(e) {
  return e.type === "spendRitualCost";
}
function gn(e) {
  const t = e;
  return t.type === "rollFormula" && T(t.id) && T(t.formula) && (t.intent === void 0 || Tn(t.intent)) && (t.damageType === void 0 || T(t.damageType));
}
function hn(e) {
  const t = e;
  return t.type === "modifyResource" && An(t.actor) && Rn(t.resource) && bn(t.operation) && Yt(t);
}
function yn(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Yt(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || T(e.amountFrom);
}
function An(e) {
  return e === "self" || e === "target";
}
function Rn(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function bn(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Tn(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function T(e) {
  return typeof e == "string" && e.length > 0;
}
function Ke(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(st);
    if (wn(t))
      return Array.from(t).filter(st);
  }
  return [];
}
function kn(e) {
  return Ke(e)[0] ?? null;
}
function Pn(e) {
  return Ke(e).find(un) ?? null;
}
function wn(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function st(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function te(e) {
  return Ke(e).filter((t) => t.type === "ritual");
}
function Qt(e) {
  return te(e)[0] ?? null;
}
function In(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(fe);
      return c.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = X("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = re(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(ut);
      return c.info(`Presets encontrados para ${r.name}.`, n), n;
    },
    async applyPresetToFirstRitual(t) {
      const r = X("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const n = re(r);
      if (!n) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await Ne(e, n, a.value);
      c.info(`Preset ${a.value.id} aplicado em ${n.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = X("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = re(t);
      if (!r) return;
      const n = e.automationRegistry.findForItem(r)[0];
      if (!n) {
        c.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const a = await Ne(e, r, n.preset);
      c.info(`Melhor preset aplicado em ${r.name}.`, { match: ut(n), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return it(e);
    },
    async applyBestPresetsToActorRituals() {
      return it(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = X("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = re(t);
      r && (await e.automationBinder.clear(r), c.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function it(e) {
  const t = X("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = te(t);
  if (r.length === 0)
    return c.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), ct(t);
  const n = ct(t, r.length);
  for (const a of r) {
    const o = e.automationRegistry.findForItem(a)[0];
    if (!o) {
      n.skipped.push({
        itemId: a.id ?? null,
        itemName: a.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await Ne(e, a, o.preset);
    n.applied.push($n(a, o, s));
  }
  return c.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), Cn(n), n;
}
async function Ne(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function $n(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: fe(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function ct(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Cn(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((n) => n.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function ut(e) {
  return {
    preset: fe(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function X(e) {
  const t = ee.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function re(e) {
  const t = Qt(e);
  return t || (c.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function F(e) {
  return e ? {
    id: e.id,
    source: {
      ...Sn(e.sourceActor),
      token: e.sourceToken
    },
    item: En(e.item),
    targets: e.targets.map(_n),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: lt(e.rollRequests, Xt),
    rolls: lt(e.rolls, Nn),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Ye),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Ye(e) {
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
function Sn(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function En(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function _n(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Xt(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Nn(e) {
  return {
    ...Xt(e),
    total: e.total
  };
}
function lt(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function Dn(e) {
  return {
    getSelected() {
      return ee.getSelectedActor();
    },
    logResources() {
      const t = D(
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
        D("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await x(
        e,
        "Gasto de PD",
        D("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await x(
        e,
        "Dano em PV",
        D("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await x(
        e,
        "Cura de PV",
        D("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await x(
        e,
        "Dano em SAN",
        D("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await x(
        e,
        "Recuperação de SAN",
        D("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function x(e, t, r, n) {
  if (!r) return;
  const a = await n(r);
  if (!a.ok) {
    vn(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    c.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  c.info(`${t} realizado:`, Ye(o));
}
function D(e) {
  const t = ee.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function vn(e) {
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
const I = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Ln() {
  ne(I.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), ne(I.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), ne(I.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), ne(I.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function De() {
  return {
    enabled: ae(I.enabled),
    console: ae(I.console),
    ui: ae(I.ui),
    chat: ae(I.chat)
  };
}
async function _(e, t) {
  await game.settings.set(u, I[e], t);
}
function ne(e, t) {
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
function Mn() {
  return {
    status() {
      return De();
    },
    async enable() {
      await _("enabled", !0);
    },
    async disable() {
      await _("enabled", !1);
    },
    async enableConsole() {
      await _("console", !0);
    },
    async disableConsole() {
      await _("console", !1);
    },
    async enableUi() {
      await _("ui", !0);
    },
    async disableUi() {
      await _("ui", !1);
    },
    async enableChat() {
      await _("chat", !0);
    },
    async disableChat() {
      await _("chat", !1);
    }
  };
}
const Zt = "ritual.costOnly", Jt = "ritual.simpleHealing", On = "ritual.eletrocussao", er = "ritual.simpleDamage", tr = "generic.simpleHealing", rr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Fn() {
  return [
    Un(),
    Bn(),
    xn(),
    Hn(),
    jn()
  ];
}
function Un() {
  return {
    id: Zt,
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
function Bn() {
  return {
    id: Jt,
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
    automation: nr(),
    itemPatch: Gn()
  };
}
function xn() {
  return {
    id: On,
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
    automation: Vn(),
    itemPatch: qn()
  };
}
function Hn() {
  return {
    id: er,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Qe()
  };
}
function jn() {
  return {
    id: tr,
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
function nr(e = "2d8+2") {
  return ar(
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
function Vn() {
  return {
    ...Qe("1d8", {
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
function Qe(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return ar(
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
          damageType: a
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
          title: n,
          message: o
        }
      ]
    },
    "damage",
    e
  );
}
function Gn() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: rr,
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
function qn() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: rr,
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
function ar(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((n) => n.type !== "rollFormula" || n.id !== t ? n : {
      ...n,
      formula: r
    })
  };
}
function Xe() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: j(t.id),
    actorId: j(t.actor?.id),
    sceneId: j(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function or() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: j(e.id),
    actorId: j(t?.id),
    sceneId: j(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function j(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function zn(e) {
  return {
    logFirstRitualCost() {
      const t = v("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const r = L(t);
      if (!r) return;
      const n = e.ritualCosts.getCost({ actor: t, ritual: r });
      if (!n.ok) {
        c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      c.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: r.name,
        cost: n.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${r.name} custa ${n.value.amount} ${n.value.resource} (${n.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, r = "PE") {
      const n = v("Nenhum ator encontrado para configurar custo customizado.");
      if (!n) return;
      const a = L(n);
      if (a) {
        if (!Yn(t, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await a.setFlag(u, "ritual.cost", {
          resource: r,
          amount: t
        }), c.info(`Custo customizado aplicado em ${a.name}.`, { resource: r, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${a.name} agora custa ${t} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = v("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = L(t);
      r && (await r.unsetFlag(u, "ritual.cost"), c.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = v("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = L(t);
      if (!r) return;
      const n = e.automationRegistry.require(Zt);
      if (!n.ok) {
        c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value), c.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = v("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const n = L(r);
      if (!n) return;
      if (!dt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(Jt);
      if (!a.ok) {
        c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, a.value, {
        definition: nr(t)
      }), c.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = v("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = L(r);
      if (!n) return;
      if (!dt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(er);
      if (!a.ok) {
        c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, a.value, {
        definition: Qe(t)
      }), c.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = v("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = L(t);
      r && await Wn(e, t, r);
    }
  };
}
async function Wn(e, t, r) {
  const n = ze(r);
  if (!n.ok) {
    c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: or(),
    item: r,
    targets: Xe()
  });
  if (!a.ok) {
    Kn(a.error);
    return;
  }
  c.info("Automação de ritual executada com sucesso.", F(a.value.context));
}
function Kn(e) {
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
  const t = ee.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function L(e) {
  const t = Qt(e);
  return t || (c.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Yn(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function dt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Qn = ["disabled", "ask", "automatic"], Xn = ["buttons", "confirm"], sr = "ask";
function Zn(e) {
  return typeof e == "string" && Qn.includes(e);
}
function Jn(e) {
  return typeof e == "string" && Xn.includes(e);
}
function ea(e) {
  return Zn(e) ? e : Jn(e) ? "ask" : sr;
}
const ta = ["keep", "replace"], ir = "keep", U = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled"
};
function ra() {
  game.settings.register(u, U.executionMode, {
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
    default: sr
  }), game.settings.register(u, U.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: ir
  }), game.settings.register(u, U.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function mt() {
  const e = ea(game.settings.get(u, U.executionMode)), t = cr(game.settings.get(u, U.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t
  };
}
function na() {
  return cr(game.settings.get(u, U.systemCardMode));
}
async function M(e) {
  await game.settings.set(u, U.executionMode, e);
}
function cr(e) {
  return ta.includes(e) ? e : ir;
}
function aa(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await M("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await M("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await M(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await M("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await M("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await M("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await M("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const oa = [
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
function sa(e) {
  return {
    phases() {
      return oa;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Te("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = Pn(t);
      if (!r) {
        c.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await ft(e, t, r);
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
      if (!ua(r)) {
        c.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = ca(r) ?? Te("Nenhum ator encontrado para executar automação do item.");
      n && await ft(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Te("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = kn(t);
      if (!r) {
        c.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(tr);
        if (!n.ok) {
          c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(r, n.value), c.info(`Preset de teste aplicado ao item: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${r.name}.`);
      } catch (n) {
        c.error("Falha ao configurar automação de teste no item.", n), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function ft(e, t, r) {
  const n = ze(r);
  if (!n.ok) {
    c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: or(),
    item: r,
    targets: Xe()
  });
  if (!a.ok) {
    ia(a.error);
    return;
  }
  c.info("Automação executada com sucesso.", F(a.value.context));
}
function ia(e) {
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
function Te(e) {
  const t = ee.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ca(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ua(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function la(e) {
  const t = Dn(e), r = In(e), n = zn(e), a = sa(e), o = Mn(), s = aa(e);
  return {
    actor: t,
    automation: r,
    ritual: n,
    workflow: a,
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
function da(e) {
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
    debug: la(e)
  }, r = globalThis;
  return r[u] = t, r.ParanormalToolkit = t, t;
}
class pt {
  static isSupportedSystem() {
    return game.system.id === cn;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function ma() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: V(t.id),
    actorId: V(t.actor?.id),
    sceneId: V(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function ur() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, r = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: V(e.id),
    actorId: V(t?.id),
    sceneId: V(e.scene?.id),
    name: r
  };
}
function fa(e, t = ur()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function pa(e) {
  if (!ya(e)) return null;
  const t = e.getFlag(u, "workflow");
  return ha(t) ? t : null;
}
function ga() {
  return `flags.${u}.workflow`;
}
function gt(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), r = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || r !== void 0;
}
function ht(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return ve(t) || ve(r);
}
function ha(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function ya(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function V(e) {
  return ve(e) ? e : null;
}
function ve(e) {
  return typeof e == "string" && e.length > 0;
}
function Aa() {
  const e = (t, r) => {
    Ra(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Ra(e, t) {
  const r = pa(e);
  if (!r || r.targets.length === 0) return;
  const n = Ta(t);
  if (!n || n.querySelector(`.${u}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(ba(r));
}
function ba(e) {
  const t = document.createElement("section");
  t.classList.add(`${u}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(yt("Origem", e.source.name)), t.append(yt("Alvo", e.targets.map((n) => n.name).join(", "))), t;
}
function yt(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${u}-chat-enrichment__row`);
  const n = document.createElement("span");
  n.textContent = `${e}: `;
  const a = document.createElement("span");
  return a.textContent = t, r.append(n, a), r;
}
function Ta(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function ka() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!Pa(n) || !wa(e) || gt(e) || gt(t)) return;
    const a = ma();
    if (a.length === 0 || !ht(e) && !ht(t)) return;
    const o = ur();
    e.updateSource({
      [ga()]: fa(a, o)
    }), c.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function Pa(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function wa(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const lr = {
  enabled: "dice.animations.enabled"
};
function Ia() {
  game.settings.register(u, lr.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function $a() {
  return {
    enabled: game.settings.get(u, lr.enabled) === !0
  };
}
const Z = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, dr = {
  PV: "system.attributes.hp"
}, Le = {
  PV: [Z.PV, dr.PV],
  SAN: [Z.SAN],
  PE: [Z.PE],
  PD: [Z.PD]
}, Me = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Ca {
  getResource(t, r) {
    const n = At(t, r);
    if (!n.ok)
      return d(n.error);
    const a = n.value, o = `${a}.value`, s = `${a}.max`, i = foundry.utils.getProperty(t, o), l = foundry.utils.getProperty(t, s), p = bt(t, r, o, i, "valor atual");
    if (p) return d(p);
    const y = bt(t, r, s, l, "valor máximo");
    return y ? d(y) : g({
      value: i,
      max: l
    });
  }
  async updateResourceValue(t, r, n) {
    const a = At(t, r);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: n });
  }
}
function At(e, t) {
  const r = Sa(e.type, t);
  if (r && Rt(e, r))
    return g(r);
  const n = Le[t].find(
    (a) => Rt(e, a)
  );
  return n ? g(n) : d({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Ea(e, t),
    path: Le[t].join(" | ")
  });
}
function Sa(e, t) {
  return e === "threat" ? dr[t] ?? null : e === "agent" ? Z[t] : null;
}
function Rt(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function Ea(e, t) {
  const r = e.type ?? "unknown", n = Le[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function bt(e, t, r, n, a) {
  return n == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${a} de ${t} não encontrado: ${r}.`,
    path: r,
    value: n
  } : typeof n != "number" || !Number.isFinite(n) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${a} de ${t} em ${r}.`,
    path: r,
    value: n
  } : null;
}
class _a {
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
      const s = Me.ritualItem.circleCandidates;
      return d({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: n, value: a } = r, o = Na(a);
    return o ? g(o) : d({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${n}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: n,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of Me.ritualItem.circleCandidates) {
      const n = foundry.utils.getProperty(t, r);
      if (n != null)
        return { path: r, value: n };
    }
    return null;
  }
}
function Na(e) {
  if (Tt(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (Tt(r))
      return r;
  }
  return null;
}
function Tt(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Da = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class va {
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
    const n = r.value, a = La(t.ritual, n);
    return a.ok ? a.value ? g(a.value) : g({
      resource: "PE",
      amount: Da[n],
      source: "default-by-circle",
      circle: n
    }) : d(a.error);
  }
}
function La(e, t) {
  const r = e.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Ma(r) ? {
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
function Ma(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const ke = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Oa(e) {
  if (!ja(e.item)) return null;
  const t = Oe(e.actor) ? e.actor : Fa(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Ba(e.token) ?? Ua(t),
    targets: Xe(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Fa(e) {
  const t = e;
  return Oe(t.actor) ? t.actor : Oe(e.parent) ? e.parent : null;
}
function Ua(e) {
  const t = xa(e) ?? Ha(e);
  return t ? mr(t) : null;
}
function Ba(e) {
  return Fe(e) ? mr(e) : null;
}
function xa(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return Fe(r) ? r : (t.getActiveTokens?.() ?? []).find(Fe) ?? null;
}
function Ha(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function mr(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Pe(e.id),
    actorId: Pe(t?.id),
    sceneId: Pe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ja(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Oe(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Fe(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Pe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Va {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(ke.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, c.info(`${ke.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = Oa(Ga(t));
    if (!r) {
      c.warn(`${ke.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function Ga(e) {
  return e && typeof e == "object" ? e : {};
}
class qa {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return we("missing-item-patch");
    if (t.type !== "ritual") return we("unsupported-item-type");
    const a = za(n);
    return Object.keys(a).length === 0 ? we("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function za(e) {
  const t = {};
  R(t, "name", e.name), R(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (R(t, "system.circle", r.circle), R(t, "system.element", r.element), R(t, "system.target", r.target), R(t, "system.targetQtd", r.targetQuantity), R(t, "system.execution", r.execution), R(t, "system.range", r.range), R(t, "system.duration", r.duration), R(t, "system.skillResis", r.resistanceSkill), R(t, "system.resistance", r.resistance), R(t, "system.studentForm", r.studentForm), R(t, "system.trueForm", r.trueForm)), t;
}
function R(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function we(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Wa {
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
    return this.getNumber(t, Me.ritual.dt, 0);
  }
  getResources(t) {
    const r = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, n = [];
    for (const a of ["PV", "SAN", "PE", "PD"]) {
      const o = this.resourceAdapter.getResource(t, a);
      o.ok ? r[a] = o.value : n.push(o.error);
    }
    return { values: r, errors: n };
  }
  getNumber(t, r, n) {
    const a = foundry.utils.getProperty(t, r);
    return typeof a == "number" && Number.isFinite(a) ? a : n;
  }
}
class Ka {
  async applyPreset(t, r, n = {}) {
    const a = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: r.id,
        presetVersion: r.version,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: n.definition ?? r.automation
    };
    return await this.writeAutomationFlag(t, a), a;
  }
  async applyManualDefinition(t, r, n = r.label) {
    const a = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: n,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: r
    };
    return await this.writeAutomationFlag(t, a), a;
  }
  async clear(t) {
    await t.unsetFlag(u, "automation");
  }
  async writeAutomationFlag(t, r) {
    await this.clear(t), await t.setFlag(u, "automation", r);
  }
}
class Ya {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = Qa(t);
    return r.ok ? this.presets.has(t.id) ? d({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Ie(t)), g(t)) : r;
  }
  registerMany(t) {
    const r = [];
    for (const n of t) {
      const a = this.register(n);
      if (!a.ok)
        return a;
      r.push(a.value);
    }
    return g(r);
  }
  get(t) {
    const r = this.presets.get(t);
    return r ? Ie(r) : null;
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
    return Array.from(this.presets.values()).map(Ie);
  }
  findForItem(t) {
    return this.list().map((r) => Xa(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function Qa(e) {
  return !$e(e.id) || !$e(e.version) || !$e(e.label) ? d({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? d({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : g(e);
}
function Xa(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = Za(a, t);
    if (!o.matches)
      return null;
    n += o.score, r.push(o.reason);
  }
  return {
    preset: e,
    score: n,
    reasons: r
  };
}
function Za(e, t) {
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
      const r = kt(t.name), n = e.names.map(kt).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Ja(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function kt(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Ja(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function Ie(e) {
  return structuredClone(e);
}
function $e(e) {
  return typeof e == "string" && e.length > 0;
}
function ce(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? d({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : g(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = pe(e.amountFrom);
    if (!r)
      return d({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const n = t.rolls[r];
    if (!n)
      return d({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${r}.`
      });
    const a = Math.trunc(n.total);
    return !Number.isInteger(a) || a <= 0 ? d({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${r} não gerou um amount positivo.`
    }) : g(a);
  }
  return d({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function pe(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const eo = "dice-so-nice";
async function to(e) {
  if (!$a().enabled || !ro()) return;
  const t = no();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      c.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function ro() {
  return game.modules.get(eo)?.active === !0;
}
function no() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function ao(e, t, r) {
  if (!Pt(e.id) || !Pt(e.formula))
    return d({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const n = new Roll(e.formula), a = await Promise.resolve(n.evaluate()), o = a.total;
    if (typeof o != "number" || !Number.isFinite(o))
      return d({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await to(a);
    const i = {
      ...r.rollRequests[e.id] ?? fr(e, t),
      total: o,
      roll: a
    };
    return r.rolls[e.id] = i, g(i);
  } catch (n) {
    return d({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: n
    });
  }
}
function fr(e, t) {
  const r = e.intent ?? oo(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function oo(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Pt(e) {
  return typeof e == "string" && e.length > 0;
}
async function ue(e, t, r, n, a) {
  switch (n) {
    case "spend":
      return r !== "PE" && r !== "PD" ? oe(t, r, n, a) : e.spend(t, r, a);
    case "damage":
      return r !== "PV" && r !== "SAN" ? oe(t, r, n, a) : e.damage(t, r, a);
    case "heal":
      return r !== "PV" ? oe(t, r, n, a) : e.heal(t, r, a);
    case "recover":
      return r !== "SAN" ? oe(t, r, n, a) : e.recover(t, r, a);
  }
}
function oe(e, t, r, n) {
  return d({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    resource: t,
    operation: r,
    reason: "invalid-resource-operation",
    message: `Operação ${r} não é válida para ${t}.`,
    requestedAmount: n
  });
}
function so(e) {
  const { step: t, context: r, transaction: n, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = io(t, r, n, a);
    r.damageInstances.push(s), o.emit("afterDamageResolution", r, {
      stepIndex: a,
      step: t,
      damage: s,
      resourceTransaction: n,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), o.emit("afterApplyDamage", r, {
      stepIndex: a,
      step: t,
      damage: s,
      resourceTransaction: n,
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
    const s = co(t, r, n, a);
    r.healingInstances.push(s), o.emit("afterApplyHealing", r, {
      stepIndex: a,
      step: t,
      healing: s,
      resourceTransaction: n,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount
      }
    });
  }
}
function io(e, t, r, n) {
  const a = pe(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: pr(t.id, "damage", n, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: a ?? void 0,
    damageType: o?.damageType,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function co(e, t, r, n) {
  const a = pe(e.amountFrom);
  return {
    id: pr(t.id, "healing", n, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: a ?? void 0,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function pr(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function uo(e, t, r) {
  const n = pe(e.amountFrom), a = n ? t.rolls[n] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    amountFrom: e.amountFrom,
    rollId: n,
    rollIntent: a?.intent,
    damageType: a?.damageType
  };
}
function lo(e) {
  const { step: t, context: r, stepIndex: n, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", r, { stepIndex: n, step: t, metadata: a }), gr("before", e), wt("before", e), wt("resolve", e);
}
function mo(e) {
  const { step: t, context: r, stepIndex: n, metadata: a, lifecycle: o } = e;
  o.emit("apply", r, { stepIndex: n, step: t, metadata: a }), gr("apply", e);
}
function fo(e) {
  const { step: t, context: r, stepIndex: n, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", r, { stepIndex: n, step: t, metadata: a });
}
function gr(e, t) {
  const { step: r, context: n, stepIndex: a, metadata: o, lifecycle: s } = t, i = po(e, r.operation);
  i && s.emit(i, n, {
    stepIndex: a,
    step: r,
    metadata: o
  });
}
function wt(e, t) {
  const { step: r, context: n, stepIndex: a, metadata: o, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: a,
    step: r,
    metadata: o
  });
}
function po(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function go(e, t, r) {
  try {
    return await e.createWorkflowSummaryMessage(r, t), g(void 0);
  } catch (n) {
    return d({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: n
    });
  }
}
async function ho(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return yo(e, t);
    case "spendRitualCost":
      return Ao(e, t);
  }
}
async function yo(e, t) {
  const { context: r, resources: n } = e, a = ce(t, r);
  return a.ok ? hr(await n.spend(r.sourceActor, t.resource, a.value), r) : d(a.error);
}
async function Ao(e, t) {
  const { context: r, resources: n, ritualCosts: a } = e, o = a.getCost({
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
  }), hr(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function hr(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), g(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), d({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Ro(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: a, execute: o } = e, s = bo(t);
  for (const l of s.before)
    a.emit(l, r, { stepIndex: n, step: t });
  const i = await o();
  if (!i.ok)
    return i;
  for (const l of s.after)
    a.emit(l, r, { stepIndex: n, step: t });
  return i;
}
function bo(e) {
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
class To {
  constructor(t, r, n, a) {
    this.resources = t, this.ritualCosts = r, this.messages = n, this.lifecycle = a;
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
    for (const [n, a] of t.steps.entries()) {
      const o = await this.runStep(a, r, n);
      if (!o.ok)
        return o;
    }
    return g({ definition: t, context: r });
  }
  async runStep(t, r, n) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, r, n);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, r, n);
      default:
        return Ro({
          step: t,
          context: r,
          stepIndex: n,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(t, r, n)
        });
    }
  }
  async executeStep(t, r, n) {
    switch (t.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(t, r, n);
      case "rollFormula":
        return this.runRollFormulaStep(t, r, n);
      case "modifyResource":
        return this.runModifyResourceStep(t, r, n);
      case "chatCard":
        return this.runChatCardStep(t, r, n);
      default:
        return d({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: n,
          step: t,
          context: r
        });
    }
  }
  async runCostStep(t, r, n) {
    const a = await ho({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? g(void 0) : d({ ...a.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const a = fr(t, n);
    r.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, r, n, t);
    const o = await this.runRollFormulaStep(t, r, n);
    if (!o.ok)
      return o;
    const s = r.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, r, n, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: a, rollResult: s }), g(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const a = await ao(t, n, r);
    return a.ok ? g(void 0) : d({ ...a.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const a = ce(t, r);
    if (!a.ok)
      return d({ ...a.error, stepIndex: n, step: t, context: r });
    const o = uo(t, r, a.value);
    lo({
      step: t,
      context: r,
      stepIndex: n,
      metadata: o,
      lifecycle: this.lifecycle
    }), mo({
      step: t,
      context: r,
      stepIndex: n,
      metadata: o,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, r);
    if (s.length === 0)
      return d({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: n,
        step: t,
        context: r
      });
    for (const i of s) {
      const l = await ue(this.resources, i, t.resource, t.operation, a.value), p = this.handleResourceOperationResult(l, r, n, t);
      if (!p.ok)
        return p;
      so({
        step: t,
        context: r,
        transaction: p.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return fo({
      step: t,
      context: r,
      stepIndex: n,
      metadata: o,
      lifecycle: this.lifecycle
    }), g(void 0);
  }
  async runModifyResourceStep(t, r, n) {
    const a = ce(t, r);
    if (!a.ok)
      return d({ ...a.error, stepIndex: n, step: t, context: r });
    const o = this.resolveActors(t.actor, r);
    if (o.length === 0)
      return d({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: n,
        step: t,
        context: r
      });
    for (const s of o) {
      const i = await ue(this.resources, s, t.resource, t.operation, a.value), l = this.handleResourceOperationResult(i, r, n, t);
      if (!l.ok)
        return l;
    }
    return g(void 0);
  }
  async runChatCardStep(t, r, n) {
    const a = await go(this.messages, t, r);
    return a.ok ? g(void 0) : d({ ...a.error, stepIndex: n, step: t, context: r });
  }
  handleResourceOperationResult(t, r, n, a) {
    return t.ok ? (r.resourceTransactions.push(t.value), g(t.value)) : d({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: n,
      step: a,
      context: r,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, r, n, a, o, s) {
    const i = ko(t, r.intent);
    i && this.lifecycle.emit(i, n, {
      stepIndex: a,
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
        return r.targets.flatMap((n) => n.actor ? [n.actor] : []);
    }
  }
}
function ko(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Po {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async spend(t, r, n) {
    return this.execute(t, r, "spend", n);
  }
  async damage(t, r, n) {
    return this.execute(t, r, "damage", n);
  }
  async heal(t, r, n) {
    return this.execute(t, r, "heal", n);
  }
  async recover(t, r, n) {
    return this.execute(t, r, "recover", n);
  }
  async execute(t, r, n, a) {
    if (!Number.isInteger(a) || a <= 0)
      return d({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: n,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: a
      });
    const o = this.adapter.getResource(t, r);
    if (!o.ok)
      return d({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: n,
        reason: o.error.reason,
        message: o.error.message,
        requestedAmount: a,
        path: o.error.path,
        value: o.error.value
      });
    const s = o.value, i = this.calculate(n, s, a);
    if (!i.ok)
      return d({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: n,
        reason: i.error.reason,
        message: i.error.message,
        requestedAmount: a,
        current: s.value,
        required: a
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
        operation: n,
        reason: "update-failed",
        message: `Falha ao atualizar ${r} no ator.`,
        requestedAmount: a,
        current: s.value,
        required: a,
        cause: A
      });
    }
    return g({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: r,
      operation: n,
      requestedAmount: a,
      appliedAmount: p,
      before: s,
      after: y
    });
  }
  calculate(t, r, n) {
    switch (t) {
      case "spend":
        return r.value < n ? d({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${r.value}; custo: ${n}.`
        }) : g({
          afterValue: r.value - n,
          appliedAmount: n
        });
      case "damage": {
        const a = Math.max(0, r.value - n);
        return g({
          afterValue: a,
          appliedAmount: r.value - a
        });
      }
      case "heal":
      case "recover": {
        const a = Math.min(r.max, r.value + n);
        return g({
          afterValue: a,
          appliedAmount: a - r.value
        });
      }
    }
  }
}
function wo(e) {
  return {
    id: Io(),
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
function Io() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class $o {
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
    return F(this.lastContext);
  }
  async runAutomation(t, r) {
    const n = wo(r);
    this.lastContext = n, this.hooks.emit("created", n, {
      metadata: {
        definitionLabel: t.label,
        itemId: n.item.id ?? null,
        itemName: n.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", n), this.hooks.emit("resolveTargets", n, {
      metadata: {
        targetCount: n.targets.length
      }
    });
    const a = await this.automation.run(t, n);
    return a.ok ? (this.hooks.emit("completed", n), a) : (this.emitFailed(n, a.error), a);
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
class Co {
  emit(t, r, n = {}) {
    const a = {
      phase: t,
      context: r,
      stepIndex: n.stepIndex,
      step: n.step,
      rollRequest: n.rollRequest,
      rollResult: n.rollResult,
      damage: n.damage,
      healing: n.healing,
      resourceTransaction: n.resourceTransaction,
      metadata: n.metadata
    };
    return r.phases.push(t), r.lifecycleEvents.push({
      phase: t,
      stepIndex: n.stepIndex,
      stepType: n.step?.type,
      rollId: n.rollRequest?.id ?? n.rollResult?.id,
      rollIntent: n.rollRequest?.intent ?? n.rollResult?.intent,
      damageId: n.damage?.id,
      healingId: n.healing?.id,
      resourceOperation: n.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${u}.workflow.${t}`, a), Hooks.callAll(`${u}.workflow.phase`, a), a;
  }
}
class So {
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
    const r = De();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Eo(),
      flags: {
        ...t.flags,
        [u]: {
          ..._o(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && c.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = De();
    if (!n.enabled)
      return;
    const a = r.notification ?? It(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, a);
  }
  emitConsole(t, r) {
    const n = It(r);
    switch (t) {
      case "info":
        c.info(n, r.data ?? "");
        return;
      case "warn":
        c.warn(n, r.data ?? "");
        return;
      case "error":
        c.error(n, r.data ?? "");
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
function It(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Eo() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function _o(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const No = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", yr = `${u}-inline-roll-neutralized`, Do = `${u}-inline-roll-notice`, Ze = `data-${u}-inline-roll-neutralized`, $t = `data-${u}-inline-roll-notice`, vo = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Lo(e) {
  const t = Ko(e.message), r = await Mo(e.message), n = Oo(t);
  return r.replacementCount + n.replacementCount > 0 && c.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: e.item.id ?? null,
    itemName: e.item.name ?? "Item sem nome",
    messageId: t,
    contentReplacementCount: r.replacementCount,
    renderedReplacementCount: n.replacementCount
  }), {
    messageId: t,
    contentUpdated: r.updated,
    contentReplacementCount: r.replacementCount,
    renderedReplacementCount: n.replacementCount
  };
}
async function Mo(e) {
  const t = qo(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = Fo(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await zo(t, r.content), replacementCount: r.replacementCount };
}
function Oo(e) {
  const t = e ? Wo(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = Ar(t);
  return r > 0 && Rr(jo(t)), { replacementCount: r };
}
function Fo(e) {
  const t = Uo(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = Ar(r.content), a = t.replacementCount + n;
  return a === 0 ? { content: e, replacementCount: 0 } : (Rr(r.content), { content: r.innerHTML, replacementCount: a });
}
function Uo(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, a) => (t += 1, xo(a.trim()))), replacementCount: t };
}
function Ar(e) {
  const t = Bo(e);
  for (const r of t)
    r.replaceWith(Ho(Vo(r)));
  return t.length;
}
function Bo(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(No))
    r.getAttribute(Ze) !== "true" && t.add(r);
  return Array.from(t);
}
function xo(e) {
  return `<span class="${yr}" ${Ze}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Yo(e)}</span>`;
}
function Ho(e) {
  const t = document.createElement("span");
  return t.classList.add(yr), t.setAttribute(Ze, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Rr(e) {
  if (e.querySelector?.(`[${$t}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Do), t.setAttribute($t, "true"), t.textContent = vo, e.append(t);
}
function jo(e) {
  return e.querySelector(".message-content") ?? e;
}
function Vo(e) {
  const r = e.getAttribute("data-formula") ?? Go(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function Go(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function qo(e) {
  return e && typeof e == "object" ? e : null;
}
async function zo(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return c.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function Wo(e) {
  const t = Qo(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Ko(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Yo(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Qo(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const br = ["base", "discente", "verdadeiro"];
function Tr(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Xo(e) {
  return typeof e == "string" && br.includes(e);
}
async function Zo(e) {
  const t = as();
  return t ? new Promise((r) => {
    let n = !1;
    const a = (o) => {
      n || (n = !0, r(o));
    };
    new t({
      title: `Conjurar ${e.ritual.name ?? "ritual"}`,
      content: Jo(e),
      default: "cast",
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: () => a(null)
        },
        cast: {
          icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
          label: "Conjurar",
          callback: (o) => a(ts(o, e.defaultSpendResource))
        }
      },
      close: () => a(null)
    }).render(!0);
  }) : (ui.notifications?.warn("Paranormal Toolkit: Dialog não disponível. Usando opções padrão do ritual."), {
    variant: "base",
    spendResource: e.defaultSpendResource
  });
}
function Jo(e) {
  const t = e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado", r = e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido", n = e.defaultSpendResource ? "checked" : "";
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
        ${e.variantOptions.map(es).join("")}
      </fieldset>

      <label class="paranormal-toolkit-ritual-cast-dialog__checkbox">
        <input type="checkbox" name="spendResource" ${n}>
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
function es(e) {
  const t = e.variant === "base" ? "checked" : "", r = e.enabled ? "" : "disabled", n = e.enabled ? "" : e.unavailableReason ?? "não disponível neste ritual", a = [...e.details, n].filter((s) => s.length > 0).join(" · ");
  return `
    <label class="paranormal-toolkit-ritual-cast-dialog__variant${e.enabled ? "" : " paranormal-toolkit-ritual-cast-dialog__variant--disabled"}">
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-main">
        <input type="radio" name="variant" value="${G(e.variant)}" ${t} ${r}>
        <strong>${G(e.label)}</strong>
      </span>
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-details">${G(a)}</span>
    </label>
  `;
}
function ts(e, t) {
  const r = ns(e), n = rs(r), a = r?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: n,
    spendResource: a
  };
}
function rs(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return Xo(t) ? t : "base";
}
function ns(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function as() {
  return globalThis.Dialog ?? null;
}
function G(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const kr = {
  label: "Padrão"
};
class os {
  constructor(t, r, n) {
    this.workflow = t, this.resources = r, this.ritualCosts = n;
  }
  workflow;
  resources;
  ritualCosts;
  canHandle(t, r) {
    return t.item.type === "ritual" || r.steps.some((n) => n.type === "spendRitualCost");
  }
  async run(t, r) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const n = this.resolveCostPreview(t), a = _s(r, n), o = await Zo({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((k) => k.name),
      cost: n,
      defaultSpendResource: vs(r),
      variantOptions: a
    });
    if (!o)
      return { status: "cancelled" };
    const s = Ds(r, o.variant), i = ss(r, o, s, n);
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
    const p = l.value.context, y = cs(r, t, p), A = As(r, o, s, n, p);
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
function ss(e, t, r, n) {
  const a = [];
  for (const o of e.steps)
    o.type === "modifyResource" || o.type === "chatCard" || Ir(o) && !t.spendResource || a.push(is(o, r));
  return t.spendResource && n && $r(r.extraCost) && a.push({
    type: "spendResource",
    actor: "self",
    resource: n.resource,
    amount: r.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: a
  };
}
function is(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function cs(e, t, r) {
  const n = [];
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const o = ce(a, r);
    if (!o.ok)
      return {
        ok: !1,
        reason: o.error.reason,
        message: o.error.message
      };
    const s = ys(a.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(...us(e, a, i, o.value));
  }
  return { ok: !0, actions: n };
}
function us(e, t, r, n) {
  if (!fs(e, t))
    return [Ct(t, r, n)];
  const a = hs();
  return Pr(e).map((o) => {
    const s = ps(n, o);
    return Ct(t, r, s, {
      option: o,
      choiceGroupId: a
    });
  });
}
function Ct(e, t, r, n) {
  const a = t.name ?? "Ator sem nome", o = ms(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: ls(e, a, r, n?.option),
    executedLabel: ds(e, a, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function ls(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function ds(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function ms(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function fs(e, t) {
  return t.operation === "damage" && t.resource === "PV" && Pr(e).length > 1;
}
function Pr(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function ps(e, t) {
  const r = e * t.multiplier, n = gs(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function gs(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function hs() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ys(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function As(e, t, r, n, a) {
  return [
    `Forma: ${Tr(t.variant)}`,
    Rs(t, r, n),
    ...Object.values(a.rolls).flatMap(bs),
    ...Ts(e.resistance),
    ...Ss(r)
  ];
}
function Rs(e, t, r) {
  const n = t.extraCost ?? 0;
  return r ? e.spendResource ? n > 0 ? `Custo: ${r.amount + n} ${r.resource} gasto (${r.amount} base + ${n} extra)` : `Custo: ${r.amount} ${r.resource} gasto` : n > 0 ? `Custo: ${r.amount} ${r.resource} + ${n} extra não gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? n > 0 ? `Custo: não resolvido (+${n} extra)` : "Custo: não resolvido" : "Custo: não gasto";
}
function bs(e) {
  const r = [`${Es(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = ks(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${Cs(e.damageType)}`), r;
}
function Ts(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function ks(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const r = [];
  let n = "+";
  for (const a of t) {
    if (!a || typeof a != "object") continue;
    const o = a;
    if (o.operator === "+" || o.operator === "-") {
      n = o.operator;
      continue;
    }
    const s = Ps(o);
    s && ($s(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function Ps(e) {
  const t = ws(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Is(e);
}
function ws(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function Is(e) {
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
function $s(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function Cs(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Ss(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Es(e) {
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
function _s(e, t) {
  return br.map((r) => {
    const n = wr(e, r), a = r === "base" || n !== null, o = n ?? (r === "base" ? kr : null);
    return {
      variant: r,
      label: o?.label ?? Tr(r),
      enabled: a,
      details: o ? Ns(o, t) : [],
      unavailableReason: a ? void 0 : "não disponível neste ritual"
    };
  });
}
function Ns(e, t) {
  const r = [], n = Object.values(e.rollFormulaOverrides ?? {});
  return n.length > 0 && r.push(n.join(", ")), $r(e.extraCost) ? r.push(t ? `+${e.extraCost} ${t.resource}` : `+${e.extraCost} PE/PD`) : r.push("custo base"), r;
}
function Ds(e, t) {
  return wr(e, t) ?? kr;
}
function wr(e, t) {
  return e.ritualForms?.[t] ?? null;
}
function vs(e) {
  return e.steps.some(Ir);
}
function Ir(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function $r(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Ls(e, t) {
  const r = await Ms(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: Fs(r),
    total: Us(r),
    diceBreakdown: Bs(r)
  };
}
function Cr(e) {
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
async function Ms(e, t) {
  const r = e;
  if (typeof r.rollSkill != "function")
    return null;
  const n = await Promise.resolve(
    r.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return Os(n);
}
function Os(e) {
  return St(e) ? e : Array.isArray(e) ? e.find(St) ?? null : null;
}
function St(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Fs(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Us(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Bs(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(xs);
  if (!r) return null;
  const a = (Array.isArray(r.results) ? r.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function xs(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Sr = "itemUsePrompts", Er = "chatCard", ge = "data-paranormal-toolkit-prompt-id", he = "data-paranormal-toolkit-pending-id", Je = "data-paranormal-toolkit-executed-label", Ue = "data-paranormal-toolkit-choice-group", _r = "data-paranormal-toolkit-skipped-label", Et = "data-paranormal-toolkit-action-section", _t = "data-paranormal-toolkit-detail-key", Nt = "data-paranormal-toolkit-roll-card", et = "data-paranormal-toolkit-roll-detail-toggle", Nr = "data-paranormal-toolkit-roll-detail-id", Dr = "data-paranormal-toolkit-resistance-roll-button", vr = "data-paranormal-toolkit-resistance-skill", Lr = "data-paranormal-toolkit-resistance-skill-label", Mr = "data-paranormal-toolkit-resistance-target-actor-id", Or = "data-paranormal-toolkit-resistance-target-name", Fr = "data-paranormal-toolkit-resistance-roll-result", Dt = "data-paranormal-toolkit-system-card-replaced", Hs = `[${he}]`, js = `[${et}]`, Vs = `[${Dr}]`, Be = `${u}-chat-enrichment`, f = `${u}-item-use-prompt`, Gs = `${f}__actions`, vt = `${f}__details`, Ur = `${f}__summary`, qs = `${f}__title`, Br = `${f}__button--executed`, Lt = `${f}__roll-card`;
let Mt = !1, xe = null;
const C = /* @__PURE__ */ new Map(), zs = [0, 100, 500, 1500, 3e3], Ws = 3e4, Ks = [0, 100, 500, 1500, 3e3];
function Ys(e) {
  if (xe = e, Mt) {
    Ft(e);
    return;
  }
  const t = (r, n) => {
    xr(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Mt = !0, Ft(e);
}
async function Ot(e) {
  const t = Zs(e);
  C.set(e.pendingId, t), await Qr(t) || Vi(t), ri(e.pendingId);
}
async function Ce(e, t) {
  const r = C.get(e);
  C.delete(e), r && await Gi(r, t);
}
function tt(e) {
  const t = rn();
  for (const r of t) {
    const n = E(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function Qs(e, t) {
  const r = tt(e);
  if (!r) return;
  const n = E(r.message), a = n[e];
  a && (n[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await K(r.message, n));
}
async function Xs(e, t, r) {
  if (!t) return;
  const n = tt(e);
  if (!n) return;
  const a = E(n.message);
  let o = !1;
  for (const [s, i] of Object.entries(a))
    s !== e && i.choiceGroupId === t && (a[s] = {
      ...i,
      executedLabel: r ?? i.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await K(n.message, a);
}
function Zs(e) {
  const t = N(e.context.message), r = e.context.targets.find((s) => Ge(s)), n = r ? Ge(r) : null, a = e.resistanceTargetActor ?? n, o = e.resistanceTargetName ?? r?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    resistanceTargetActorId: e.resistanceTargetActorId ?? a?.id ?? null,
    resistanceTargetName: o,
    resistanceRollResult: null,
    actionPayload: e.actionPayload ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: Ri(e.context),
    executed: !1
  };
}
function xr(e, t, r) {
  ji();
  const n = Re(t);
  if (!n) return;
  const a = Bi(e, n);
  a.length > 0 && le(n);
  for (const o of a)
    He(n, o);
  Vr(n, r), je(n), Ve(n);
}
function Ft(e) {
  for (const t of Ks)
    globalThis.setTimeout(() => {
      Js(e);
    }, t);
}
function Js(e) {
  for (const t of ei()) {
    const r = ye(t);
    ti(r) && xr(r, t, e);
  }
}
function ei() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function ti(e) {
  return e ? rt(e) ? !0 : Xr(e).length > 0 : !1;
}
function ri(e) {
  const t = C.get(e);
  if (!t) return;
  const r = t.messageId ? xi(t.messageId) : null;
  if (r) {
    xt(r, t), le(r), He(r, t), Ut(r), je(r), Ve(r);
    return;
  }
  if (t.messageId) {
    qe(t);
    return;
  }
  const n = Hi(t);
  if (n) {
    xt(n, t), le(n), He(n, t), Ut(n), je(n), Ve(n);
    return;
  }
  qe(t);
}
function Ut(e) {
  xe && Vr(e, xe);
}
function le(e) {
  const t = ni();
  e.classList.toggle(`${f}--system-card-replaced`, t);
  const r = jr(e);
  if (!r || (r.classList.toggle(`${f}__host--system-card-replaced`, t), !t) || r.getAttribute(Dt) === "true") return;
  const n = r.querySelector(`.${Be}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(Dt, "true");
}
function ni() {
  try {
    return na() === "replace";
  } catch {
    return !1;
  }
}
function He(e, t) {
  if (le(e), e.querySelector(`[${ge}="${Y(t.pendingId)}"]`)) return;
  const r = ai(e, t);
  si(r, t), pi(r, gi(t)).append(Ai(t));
}
function ai(e, t) {
  const r = e.querySelector(`.${Be}`);
  if (r)
    return r;
  const n = document.createElement("section");
  n.classList.add(Be, f);
  const a = document.createElement("header");
  a.classList.add(`${f}__header`);
  const o = document.createElement("span");
  o.classList.add(`${f}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(qs), s.textContent = oi(t);
  const i = document.createElement("span");
  return i.classList.add(Ur), i.textContent = t.summary, a.append(o, s, i), n.append(a), Ti(e).append(n), n;
}
function oi(e) {
  const t = P(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function si(e, t) {
  const r = t.summaryLines ?? [], n = Wr(r, t);
  if (n) {
    ii(e, n, t);
    return;
  }
  hi(e, r);
}
function ii(e, t, r) {
  if (e.querySelector(`[${Nt}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(Lt, `${Lt}--${t.intent}`), n.setAttribute(Nt, "true");
  const a = document.createElement("div");
  a.classList.add(`${f}__roll-summary`);
  const o = document.createElement("span");
  o.classList.add(`${f}__roll-chip`, `${f}__roll-chip--${t.intent}`), o.textContent = t.label.toUpperCase();
  const s = document.createElement("strong");
  s.classList.add(`${f}__roll-total`), s.textContent = String(t.total);
  const i = document.createElement("span");
  i.classList.add(`${f}__roll-formula`), i.textContent = t.formula, a.append(o, s, i), n.append(a), ci(n, t), li(n, t, r), mi(n, t, r.pendingId), e.append(n);
}
function ci(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(cc);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${f}__roll-meta`);
  for (const a of r) {
    const o = document.createElement("span");
    o.classList.add(`${f}__roll-meta-pill`), o.textContent = a, n.append(o);
  }
  e.append(n);
}
function li(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${f}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${f}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = di(t, r);
  a.append(o), s && a.append(s);
  const i = document.createElement("span");
  i.classList.add(`${f}__resistance-description`), i.textContent = t.resistance, n.append(a, i), t.resistanceRollResult && n.append(Hr(t.resistanceRollResult)), e.append(n);
}
function di(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${f}__resistance-roll-button`), r.setAttribute(ge, t.pendingId), r.setAttribute(Dr, "true"), r.setAttribute(vr, e.resistanceSkill), r.setAttribute(Lr, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(Mr, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(Or, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${f}__resistance-roll-button--rolled`), r.setAttribute(Fr, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${f}__resistance-roll-fallback`), a.textContent = "d20", r.append(n, a), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function Hr(e) {
  const t = document.createElement("span");
  return t.classList.add(`${f}__resistance-roll-result`), t.textContent = qr(e), t;
}
function mi(e, t, r) {
  const n = fi(t);
  if (n.length === 0) return;
  const a = `${r}-roll-details`, o = document.createElement("button");
  o.type = "button", o.classList.add(`${f}__roll-detail-toggle`), o.setAttribute(et, a), o.setAttribute("aria-expanded", "false"), o.textContent = "▸ Ver detalhes";
  const s = document.createElement("dl");
  s.classList.add(`${f}__roll-detail-list`), s.setAttribute(Nr, a), s.hidden = !0;
  for (const i of n) {
    const l = document.createElement("dt");
    l.textContent = i.label;
    const p = document.createElement("dd");
    p.textContent = i.value, s.append(l, p);
  }
  e.append(o, s);
}
function fi(e) {
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
function pi(e, t) {
  const r = `[${Et}="${Y(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const a = document.createElement("div");
  a.classList.add(Gs), a.setAttribute(Et, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${f}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function gi(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = Wr(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function hi(e, t) {
  if (t.length === 0) return;
  const r = yi(e);
  for (const n of t) {
    const a = uc(n);
    if (r.querySelector(`[${_t}="${Y(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = n, o.setAttribute(_t, a), r.append(o);
  }
}
function yi(e) {
  const t = e.querySelector(`.${vt}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(vt), e.append(r), r;
}
function Ai(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${f}__button`), t.setAttribute(ge, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Br), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(he, e.pendingId), t.setAttribute(Je, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Ue, e.choiceGroupId), t.setAttribute(_r, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Ri(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = bi(e);
  return `${t} → ${r}`;
}
function bi(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Ti(e) {
  return jr(e) ?? e;
}
function jr(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Vr(e, t) {
  const r = Re(e);
  if (!r) return;
  const n = r.querySelectorAll(Hs);
  for (const a of n)
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      Mi(a, t);
    }));
}
function je(e) {
  const t = Re(e);
  if (!t) return;
  const r = t.querySelectorAll(js);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      ki(t, n);
    }));
}
function Ve(e) {
  const t = Re(e);
  if (!t) return;
  const r = t.querySelectorAll(Vs);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      Pi(t, n);
    }));
}
function ki(e, t) {
  const r = t.getAttribute(et);
  if (!r) return;
  const n = e.querySelector(`[${Nr}="${Y(r)}"]`);
  if (!n) return;
  const a = n.hidden;
  n.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Pi(e, t) {
  const r = t.getAttribute(ge), n = t.getAttribute(vr), a = t.getAttribute(Lr) ?? (n ? Cr(n) : "Resistência");
  if (!r || !n) return;
  const o = $i(e, r), s = Ci(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const l = await Ls(s, n);
    await Di(l.roll);
    const p = {
      skill: n,
      skillLabel: a,
      formula: l.formula,
      total: l.total,
      targetName: s.name ?? o?.resistanceTargetName ?? "alvo",
      diceBreakdown: l.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    wi(t, p), Ii(t, p), vi(r, p), await Li(e, r, p);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", l), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function wi(e, t) {
  e.classList.add(`${f}__resistance-roll-button--rolled`), e.setAttribute(Fr, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Ii(e, t) {
  const r = e.closest(`.${f}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${f}__resistance-roll-result`), a = n ?? Hr(t);
  if (n) {
    n.textContent = qr(t);
    return;
  }
  r.append(a);
}
function $i(e, t) {
  const r = C.get(t);
  if (r) return r;
  const n = ye(e);
  return E(n)[t] ?? null;
}
function Ci(e, t) {
  const r = e?.resistanceTargetActor;
  if ($(r)) return r;
  const a = e?.context?.targets.map(Ge).find($) ?? null;
  if (a) return a;
  const o = t.getAttribute(Mr) ?? e?.resistanceTargetActorId ?? null, s = o ? Ei(o) : null;
  return s || _i(
    t.getAttribute(Or) ?? e?.resistanceTargetName ?? Si(t)
  );
}
function Si(e) {
  const r = e.closest(`.${f}`)?.querySelector(`.${Ur}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const a = r.split(n), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Ge(e) {
  const t = e.actor;
  if ($(t)) return t;
  const r = e.token, n = J(r);
  if (n) return n;
  const a = e.document;
  return J(a);
}
function J(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if ($(t)) return t;
  const r = e.document?.actor;
  return $(r) ? r : null;
}
function Ei(e) {
  const r = game.actors?.get?.(e);
  return $(r) ? r : Gr().map((o) => J(o)).find((o) => o?.id === e) ?? null;
}
function _i(e) {
  const t = q(e);
  if (!t) return null;
  const r = Gr().filter((o) => q(Ni(o)) === t).map((o) => J(o)).find($) ?? null;
  if (r) return r;
  const a = game.actors?.find?.((o) => $(o) && q(o.name) === t);
  return $(a) ? a : null;
}
function Gr() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ni(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : J(e)?.name ?? null;
}
function q(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function $(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function qr(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Di(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function vi(e, t) {
  const r = C.get(e);
  r && (r.resistanceRollResult = t);
}
async function Li(e, t, r) {
  const n = ye(e);
  if (n)
    try {
      const a = E(n), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: r
      }, await K(n, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function ye(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return S(n?.get?.(r));
}
async function Mi(e, t) {
  const r = e.getAttribute(he);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    zr(e, e.getAttribute(Je) ?? "✓ Automação aplicada"), Oi(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function zr(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Br), e.removeAttribute(he), e.removeAttribute(Je);
}
function Oi(e) {
  const t = e.getAttribute(Ue);
  if (!t) return;
  const r = e.closest(`.${f}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${Ue}="${Y(t)}"]`;
  for (const a of r.querySelectorAll(n)) {
    if (a === e) continue;
    const o = a.getAttribute(_r) ?? "✓ Outra opção escolhida";
    zr(a, o);
  }
}
function Wr(e, t) {
  const r = e.map(Kr).find(sc);
  if (!r) return null;
  const n = P(e, "Forma"), a = P(e, "Custo"), o = P(e, "Dados") ?? P(e, `Dados (${r.label})`), s = P(e, "Tipo"), i = P(e, "Resistência"), l = P(e, "Resistência Perícia"), p = P(e, "Resistência Rótulo") ?? (l ? Cr(l) : null), y = Yr(e, "Observação"), A = e.filter((k) => Ui(k, r));
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: n,
    cost: a,
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
function Kr(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, n, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: r,
    formula: n,
    total: o,
    intent: Fi(r)
  } : null;
}
function Fi(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : "generic";
}
function P(e, t) {
  return Yr(e, t)[0] ?? null;
}
function Yr(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const a = n.slice(r.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function Ui(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || Kr(e) ? !1 : e.trim().length > 0;
}
function Bi(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of C.values())
    ie(n, e, t) && r.set(n.pendingId, n);
  for (const n of qi(e))
    ie(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  for (const n of Xr(e))
    ie(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, a) => n.createdAt - a.createdAt);
}
function ie(e, t, r) {
  const n = N(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !Bt(r, "itemId", e.itemId) ? !1 : !e.actorId || Bt(r, "actorId", e.actorId);
}
function Bt(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${lc(t)}`;
  for (const a of e.querySelectorAll(`[${n}]`))
    if (a.getAttribute(n) === r)
      return !0;
  return !1;
}
function xi(e) {
  const t = Y(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Hi(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (ie(e, null, t))
      return t;
  return null;
}
function ji() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of C.entries())
    e - n.createdAt > t && C.delete(r);
}
async function xt(e, t) {
  const r = ye(e);
  if (!r) return !1;
  try {
    const n = E(r);
    return n[t.pendingId] = nt(t, N(r)), await K(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function Qr(e) {
  const t = Jr(e);
  if (!t) return !1;
  try {
    const r = E(t);
    return r[e.pendingId] = nt(e, N(t)), await K(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function Vi(e) {
  for (const t of zs)
    globalThis.setTimeout(() => {
      qe(e);
    }, t);
}
async function qe(e) {
  const t = Jr(e);
  if (rt(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const n = await Qr(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function Gi(e, t) {
  const r = Zr(e.context.message);
  if (r)
    try {
      const n = E(r), a = n[e.pendingId] ?? nt(e, N(r));
      n[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await K(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function Xr(e) {
  return Object.values(E(S(e))).filter(Ae);
}
function qi(e) {
  return rt(S(e))?.prompts ?? [];
}
function E(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, Sr);
  if (!z(t))
    return {};
  const r = {};
  for (const [n, a] of Object.entries(t))
    Ae(a) && (r[n] = a);
  return r;
}
async function K(e, t) {
  typeof e.setFlag == "function" && (await Promise.resolve(e.setFlag(u, Sr, t)), await zi(e, t));
}
function rt(e) {
  if (!e) return null;
  const t = e.getFlag?.(u, Er);
  return ac(t) ? t : null;
}
async function zi(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(Ae).sort((o, s) => o.createdAt - s.createdAt);
  if (r.length === 0) return;
  const n = r[0];
  if (!n) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...r.map((o) => o.createdAt)),
    messageId: n.messageId ?? N(e) ?? null,
    source: {
      actorId: n.actorId,
      actorName: Wi(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(u, Er, a));
}
function Wi(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function nt(e, t) {
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
function Zr(e) {
  const t = S(e);
  if (t?.setFlag)
    return t;
  const r = Ki(e);
  if (r?.setFlag)
    return r;
  const n = N(e);
  if (!n) return null;
  const a = game.messages;
  return S(a?.get?.(n));
}
function Ki(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(S).find((r) => typeof r?.setFlag == "function") ?? null;
}
function Jr(e) {
  const t = Zr(e.context.message);
  if (t) return t;
  const r = e.messageId ? Yi(e.messageId) : null;
  if (r) return r;
  const n = rn().slice().reverse();
  return n.find((a) => Qi(a, e)) ?? n.find((a) => Xi(a, e)) ?? null;
}
function Yi(e) {
  const t = game.messages;
  return S(t?.get?.(e));
}
function Qi(e, t) {
  const r = N(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!en(e, t)) return !1;
  const a = tn(e);
  return !t.actorId || !a || a === t.actorId;
}
function Xi(e, t) {
  if (!Ji(e, t)) return !1;
  const r = tn(e);
  return t.actorId && r === t.actorId ? !0 : en(e, t);
}
function en(e, t) {
  const r = q(Zi(e));
  if (!r) return !1;
  const n = q(t.itemName);
  if (n && r.includes(n)) return !0;
  const a = q(t.itemId);
  return !!(a && r.includes(a));
}
function Zi(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function tn(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Ji(e, t) {
  const r = ec(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= Ws;
}
function ec(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function S(e) {
  return e && typeof e == "object" ? e : null;
}
function Ae(e) {
  return z(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && b(e.messageId) && b(e.itemId) && b(e.actorId) && b(e.itemName) && O(e.resistanceTargetActorId) && O(e.resistanceTargetName) && oc(e.resistanceRollResult) && tc(e.actionPayload) && Se(e.title) && Se(e.buttonLabel) && Se(e.executedLabel) && O(e.choiceGroupId) && O(e.skippedLabel) && O(e.actionSectionId) && O(e.actionSectionTitle) && ic(e.summaryLines) : !1;
}
function tc(e) {
  return e == null ? !0 : z(e) ? e.kind === "resource-operation" && b(e.actorId) && b(e.actorUuid) && typeof e.actorName == "string" && rc(e.resource) && nc(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function rc(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function nc(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function ac(e) {
  return z(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && b(e.messageId) && z(e.source) && b(e.source.actorId) && b(e.source.actorName) && b(e.source.itemId) && b(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Ae) : !1;
}
function oc(e) {
  return e == null ? !0 : z(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && O(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function sc(e) {
  return e !== null;
}
function z(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function b(e) {
  return e === null || typeof e == "string";
}
function Se(e) {
  return e === void 0 || typeof e == "string";
}
function O(e) {
  return e == null || typeof e == "string";
}
function ic(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function cc(e) {
  return typeof e == "string" && e.length > 0;
}
function rn() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(S).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(S).filter((n) => n !== null) : [];
}
function Re(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function N(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function uc(e) {
  return e.trim().toLowerCase();
}
function lc(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Y(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ht = 1e3;
class dc {
  constructor(t, r, n, a) {
    this.workflow = t, this.resources = r, this.debugOutput = a, this.ritualAssistant = new os(t, r, n);
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
      settings: mt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = mt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = ze(t.item);
    if (!n.ok) {
      const a = n.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, a, n.error.reason), n.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: n.error.message,
        data: n.error
      });
      return;
    }
    if (await Lo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: jt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(t), r.executionMode) {
      case "ask":
        await this.handleAskMode(t, n.value);
        return;
      case "automatic":
        await this.executeAutomation(t, n.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const r = this.pendingExecutions.get(t);
    if (!r)
      return this.executePersistedPendingAutomation(t);
    if (r.kind === "workflow")
      return this.pendingExecutions.delete(t), await Ce(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const n = await this.ritualAssistant.applyAction(r.action);
    return n.ok ? (r.workflowContext.resourceTransactions.push(n.value), this.pendingExecutions.delete(t), await Ce(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(n), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = tt(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, a = fc(n);
    if (!a)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const o = await ue(this.resources, a, n.resource, n.operation, n.amount);
    return o.ok ? (await Qs(t), await Xs(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Ys((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
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
    const n = await this.ritualAssistant.run(t, r);
    switch (n.status) {
      case "cancelled":
        this.setAttempt(t, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(t, "failed", n.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: n.message,
          data: n.cause ?? n
        }), ui.notifications?.warn(`Paranormal Toolkit: ${n.message}`);
        return;
      case "completed-without-actions":
        this.setAttempt(t, "completed", "ritual-assisted-no-actions"), c.info("Ritual assistido concluído sem ações pendentes.", F(n.workflowContext));
        return;
      case "ready":
        await this.registerAssistedResourceActions(t, n.workflowContext, n.actions, n.summaryLines);
        return;
    }
  }
  async resolveAlternativeResourceActions(t) {
    const r = t.action.choiceGroupId;
    if (!r) return;
    const n = Array.from(this.pendingExecutions.entries()).filter(([, a]) => a.kind === "resource-action" && a.action.choiceGroupId === r);
    for (const [a, o] of n)
      o.kind === "resource-action" && (this.pendingExecutions.delete(a), await Ce(
        a,
        o.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerAssistedResourceActions(t, r, n, a) {
    let o;
    for (const s of n) {
      const i = Gt();
      o ??= i, this.pendingExecutions.set(i, {
        kind: "resource-action",
        id: i,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await Ot({
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
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: mc(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", o), c.info("Ritual assistido preparado com ações pendentes.", F(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = Gt();
    this.pendingExecutions.set(n, {
      kind: "workflow",
      id: n,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Ot({
      pendingId: n,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", n);
  }
  async executeAutomation(t, r, n) {
    this.setAttempt(t, "running");
    const a = await this.workflow.runAutomation(r, {
      sourceActor: t.actor,
      sourceToken: t.token,
      item: t.item,
      targets: t.targets,
      flags: {
        itemUse: {
          source: t.source,
          executionMode: n
        }
      }
    });
    if (!a.ok) {
      this.setAttempt(t, "failed", a.error.reason), this.handleAutomationFailure(a.error);
      return;
    }
    this.setAttempt(t, "completed"), c.info("Automação executada por uso normal de item.", F(a.value.context));
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
    const r = Date.now(), n = Vt(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      r - s > Ht && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(n);
    return a !== void 0 && r - a <= Ht;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Vt(t), Date.now());
  }
  setAttempt(t, r, n, a) {
    this.lastAttempt = jt(t, r, n, a);
  }
}
function mc(e) {
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
function fc(e) {
  const t = e.actorUuid ? pc(e.actorUuid) : null;
  if (W(t)) return t;
  const r = e.actorId ? gc(e.actorId) : null;
  return r || hc(e.actorName);
}
function pc(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function gc(e) {
  const r = game.actors?.get?.(e);
  if (W(r)) return r;
  for (const n of nn()) {
    const a = at(n);
    if (a?.id === e) return a;
  }
  return null;
}
function hc(e) {
  const t = Ee(e);
  if (!t) return null;
  for (const a of nn()) {
    const o = yc(a);
    if (Ee(o) === t) {
      const s = at(a);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((a) => W(a) && Ee(a.name) === t);
  return W(n) ? n : null;
}
function nn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function yc(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : at(e)?.name ?? null;
}
function at(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (W(t)) return t;
  const r = e.document?.actor;
  return W(r) ? r : null;
}
function Ee(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function W(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function jt(e, t, r, n) {
  return {
    source: e.source,
    status: t,
    reason: r,
    pendingId: n,
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
function Vt(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function Gt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ac {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], a = [], o = te(t);
    for (const s of r) {
      const i = s.itemId ? o.find((y) => y.id === s.itemId) ?? null : null, l = s.match?.preset ?? null;
      if (!i || !l) {
        a.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(i, l);
      const p = await this.itemPatches.applyPresetItemPatch(i, l);
      n.push({
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
      applied: n,
      skipped: a
    };
  }
}
class Rc {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = te(t).map((i) => this.analyzeRitual(i)), n = r.filter(se("upToDate")), a = r.filter(se("available")), o = r.filter(se("outdated")), s = r.filter(se("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: r.length,
      upToDate: n,
      available: a,
      outdated: o,
      unsupported: s,
      canApply: a.length > 0 || o.length > 0
    };
  }
  getApplicableEntries(t) {
    const r = this.analyzeActor(t);
    return [...r.available, ...r.outdated];
  }
  analyzeRitual(t) {
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = bc(t);
    return r ? n ? n.source.type !== "preset" ? Q({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Automação manual encontrada. Preset sugerido: ${r.preset.label}.`
    }) : n.source.presetId === r.preset.id && n.source.presetVersion === r.preset.version ? Q({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Preset ${r.preset.label} v${r.preset.version} já aplicado.`
    }) : Q({
      ritual: t,
      status: "outdated",
      match: r,
      flag: n,
      reason: Tc(n, r.preset)
    }) : Q({
      ritual: t,
      status: "available",
      match: r,
      flag: n,
      reason: `Preset encontrado: ${r.preset.label}.`
    }) : Q({
      ritual: t,
      status: "unsupported",
      match: r,
      flag: n,
      reason: n ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Q(e) {
  const t = e.flag?.source, r = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? fe(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function bc(e) {
  const t = e.getFlag(u, "automation");
  return We(t) ? t : null;
}
function Tc(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function se(e) {
  return (t) => t.status === e;
}
class kc {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), n = Ye(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: r,
      data: n,
      flags: {
        [u]: {
          resourceTransaction: n
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, r) {
    const n = this.createWorkflowSummaryContent(t, r), a = F(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: n,
      data: a,
      flags: {
        [u]: {
          workflowSummary: a
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const r = h(t.actorName), n = h(t.resource), a = h(qt(t)), o = h(wc(t));
    return `
      <section class="${u}-card ${u}-resource-card">
        <header class="${u}-card__header">
          <strong>${a}</strong>
          <span>${r}</span>
        </header>
        <div class="${u}-card__body">
          <p><strong>${o}:</strong> ${t.appliedAmount}</p>
          <p><strong>${n}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, r) {
    const n = h(r.title ?? "Automação"), a = r.message ? `<p>${h(r.message)}</p>` : "", o = h(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = h(t.item.name ?? "Item sem nome"), i = t.targets.length > 0 ? t.targets.map((m) => h(m.name)).join(", ") : "Nenhum", l = Object.values(t.rolls).map(
      (m) => `<li><strong>${h(m.id)}:</strong> ${h(m.formula)} = ${m.total} <em>(${h(Pc(m.intent))})</em>${m.damageType ? ` — ${h(m.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (m) => `<li><strong>${h(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${h(m.resource)} (${h(Ic(m.source))})</li>`
    ), y = t.damageInstances.map(
      (m) => `<li><strong>${h(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${h(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (m) => `<li><strong>${h(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), k = t.resourceTransactions.map(
      (m) => `<li><strong>${h(m.actorName)}:</strong> ${h(qt(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), B = t.phases.map((m) => h(m)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${n}</strong>
          <span>${s}</span>
        </header>
        <div class="${u}-card__body">
          ${a}
          <p><strong>Origem:</strong> ${o}</p>
          <p><strong>Alvo:</strong> ${i}</p>
          ${p.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${p.join("")}</ul>` : ""}
          ${l.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${l.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Cura:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${k.join("")}</ul>` : ""}
          ${B.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${B}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Pc(e) {
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
function qt(e) {
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
function wc(e) {
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
function Ic(e) {
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
function $c() {
  const e = new Ca(), t = new Po(e), r = new _a(), n = new va(r), a = new Wa(e), o = new Ya(), s = o.registerMany(Fn());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new Ka(), l = new qa(), p = new Rc(o), y = new Ac(p, i, l), A = new So(), k = new kc(A), B = new Co(), m = new To(t, n, k, B), ot = new $o(m, B), be = new dc(ot, t, n, A);
  return be.addStrategy(new Va((sn) => be.handleItemUsed(sn))), {
    ordem: a,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: n,
    resources: t,
    automationRegistry: o,
    automationBinder: i,
    itemPatches: l,
    debugOutput: A,
    chatMessages: k,
    workflowHooks: B,
    automation: m,
    workflow: ot,
    itemUseIntegration: be,
    ritualPresetDiagnostic: p,
    ritualPresetApplications: y
  };
}
const { ApplicationV2: Cc } = foundry.applications.api;
class de extends Cc {
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
      apply: de.onApply,
      cancel: de.onCancel
    }
  };
  async _renderHTML(t, r) {
    const n = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), a = document.createElement("div");
    return a.className = "paranormal-toolkit-preset-manager", a.innerHTML = this.renderContent(n), a;
  }
  _replaceHTML(t, r, n) {
    r.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${w(Kt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${w(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${_e("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${_e("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${_e("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
    const t = this.lastApplicationResult.applied.length, r = this.lastApplicationResult.skipped.length, n = r > 0 ? ` ${r} pendente(s) não puderam ser aplicados.` : "";
    return `
      <div class="paranormal-toolkit-preset-manager__result">
        <strong>Aplicação concluída.</strong>
        <span>${t} preset(s) aplicado(s).${n}</span>
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
        const n = this.lastApplicationResult.applied.length;
        ui.notifications?.info(`Paranormal Toolkit: ${n} preset(s) aplicado(s) em ${this.actor.name ?? "ator"}.`);
      } finally {
        this.isApplying = !1, await this.render({ force: !0 });
      }
    }
  }
  static async onCancel(t) {
    t.preventDefault(), await this.close();
  }
}
function _e(e, t, r, n) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${n}"></i>
        <span>${w(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? Sc(r) : _c(t)}
    </section>
  `;
}
function Sc(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Ec).join("")}</ol>`;
}
function Ec(e) {
  const t = e.preset, r = t ? `${t.label} v${t.version}` : "Sem preset", n = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${w(e.appliedPresetId)} v${w(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${w(e.itemName)}</strong>
        <span>${w(e.reason)}</span>
        ${n}
      </div>
      <em>${w(r)}</em>
    </li>
  `;
}
function _c(e) {
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
const me = `${u}.manageRitualPresets`, zt = `__${u}_ritualPresetHeaderControlRegistered`, Nc = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Dc(e) {
  const t = globalThis;
  if (!t[zt]) {
    for (const r of Nc)
      Hooks.on(r, (n, a) => {
        vc(n, a, e);
      });
    t[zt] = !0, c.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function vc(e, t, r) {
  Array.isArray(t) && Mc(e) && (Lc(e, r), !t.some((n) => n.action === me) && t.push({
    action: me,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), an(e, r);
    }
  }));
}
function Lc(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[me] && (e.options.actions[me] = (r) => {
    r.preventDefault(), r.stopPropagation(), an(e, t);
  }));
}
function Mc(e) {
  if (!game.user?.isGM) return !1;
  const t = on(e);
  return t ? t.type === "agent" && te(t).length > 0 : !1;
}
function an(e, t) {
  const r = on(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new de(r, t).render({ force: !0 });
}
function on(e) {
  return Wt(e.actor) ? e.actor : Wt(e.document) ? e.document : null;
}
function Wt(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let H = null;
Hooks.once("init", () => {
  Ln(), ra(), Ia(), c.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!pt.isSupportedSystem()) {
    c.warn(
      `Sistema não suportado: ${pt.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  H = $c(), H.itemUseIntegration.registerStrategies(), da(H), ka(), Aa(), Dc(H), c.info("Inicializado para o sistema Ordem Paranormal."), c.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Kt} inicializado.`);
});
function Oc() {
  if (!H)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return H;
}
export {
  Oc as getToolkitServices
};
//# sourceMappingURL=main.js.map
