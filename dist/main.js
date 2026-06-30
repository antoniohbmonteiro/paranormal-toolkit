const u = "paranormal-toolkit", Ze = "Paranormal Toolkit", kn = "ordemparanormal";
class re {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function ge(e) {
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
function m(e) {
  return { ok: !1, error: e };
}
function Je(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? m({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : et(t) ? g(t.definition) : m({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function bn(e) {
  return et(e.getFlag(u, "automation"));
}
function et(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && wn(t.source) && Tn(t.definition);
}
function Tn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && $(t.label) && Array.isArray(t.steps) && t.steps.every(Cn);
}
function wn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? $(t.presetId) && $(t.presetVersion) && $(t.appliedAt) : t.type === "manual" ? $(t.label) && $(t.appliedAt) : !1;
}
function Cn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return $n(t);
    case "spendRitualCost":
      return Pn(t);
    case "rollFormula":
      return In(t);
    case "modifyResource":
      return Sn(t);
    case "chatCard":
      return En(t);
    default:
      return !1;
  }
}
function $n(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && or(t);
}
function Pn(e) {
  return e.type === "spendRitualCost";
}
function In(e) {
  const t = e;
  return t.type === "rollFormula" && $(t.id) && $(t.formula) && (t.intent === void 0 || Dn(t.intent)) && (t.damageType === void 0 || $(t.damageType));
}
function Sn(e) {
  const t = e;
  return t.type === "modifyResource" && _n(t.actor) && vn(t.resource) && Nn(t.operation) && or(t);
}
function En(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function or(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || $(e.amountFrom);
}
function _n(e) {
  return e === "self" || e === "target";
}
function vn(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Nn(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Dn(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function $(e) {
  return typeof e == "string" && e.length > 0;
}
function tt(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(gt);
    if (On(t))
      return Array.from(t).filter(gt);
  }
  return [];
}
function Ln(e) {
  return tt(e)[0] ?? null;
}
function Mn(e) {
  return tt(e).find(bn) ?? null;
}
function On(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function gt(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ne(e) {
  return tt(e).filter((t) => t.type === "ritual");
}
function sr(e) {
  return ne(e)[0] ?? null;
}
function Fn(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(ge);
      return c.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Z("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = oe(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(At);
      return c.info(`Presets encontrados para ${r.name}.`, n), n;
    },
    async applyPresetToFirstRitual(t) {
      const r = Z("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const n = oe(r);
      if (!n) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await Oe(e, n, a.value);
      c.info(`Preset ${a.value.id} aplicado em ${n.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Z("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = oe(t);
      if (!r) return;
      const n = e.automationRegistry.findForItem(r)[0];
      if (!n) {
        c.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const a = await Oe(e, r, n.preset);
      c.info(`Melhor preset aplicado em ${r.name}.`, { match: At(n), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return ht(e);
    },
    async applyBestPresetsToActorRituals() {
      return ht(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Z("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = oe(t);
      r && (await e.automationBinder.clear(r), c.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function ht(e) {
  const t = Z("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = ne(t);
  if (r.length === 0)
    return c.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), yt(t);
  const n = yt(t, r.length);
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
    const s = await Oe(e, a, o.preset);
    n.applied.push(Un(a, o, s));
  }
  return c.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), Bn(n), n;
}
async function Oe(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function Un(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: ge(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function yt(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Bn(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((n) => n.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function At(e) {
  return {
    preset: ge(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Z(e) {
  const t = re.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function oe(e) {
  const t = sr(e);
  return t || (c.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function x(e) {
  return e ? {
    id: e.id,
    source: {
      ...jn(e.sourceActor),
      token: e.sourceToken
    },
    item: xn(e.item),
    targets: e.targets.map(Hn),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Rt(e.rollRequests, ir),
    rolls: Rt(e.rolls, Vn),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(rt),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function rt(e) {
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
function jn(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function xn(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Hn(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function ir(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Vn(e) {
  return {
    ...ir(e),
    total: e.total
  };
}
function Rt(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function Gn(e) {
  return {
    getSelected() {
      return re.getSelectedActor();
    },
    logResources() {
      const t = O(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const r = e.ordem.getActorSnapshot(t);
      c.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && c.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(t) {
      await H(
        e,
        "Gasto de PE",
        O("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await H(
        e,
        "Gasto de PD",
        O("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await H(
        e,
        "Dano em PV",
        O("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await H(
        e,
        "Cura de PV",
        O("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await H(
        e,
        "Dano em SAN",
        O("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await H(
        e,
        "Recuperação de SAN",
        O("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function H(e, t, r, n) {
  if (!r) return;
  const a = await n(r);
  if (!a.ok) {
    qn(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    c.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  c.info(`${t} realizado:`, rt(o));
}
function O(e) {
  const t = re.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function qn(e) {
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
const E = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function zn() {
  se(E.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), se(E.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), se(E.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), se(E.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Fe() {
  return {
    enabled: ie(E.enabled),
    console: ie(E.console),
    ui: ie(E.ui),
    chat: ie(E.chat)
  };
}
async function L(e, t) {
  await game.settings.set(u, E[e], t);
}
function se(e, t) {
  game.settings.register(u, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function ie(e) {
  return game.settings.get(u, e) === !0;
}
function Wn() {
  return {
    status() {
      return Fe();
    },
    async enable() {
      await L("enabled", !0);
    },
    async disable() {
      await L("enabled", !1);
    },
    async enableConsole() {
      await L("console", !0);
    },
    async disableConsole() {
      await L("console", !1);
    },
    async enableUi() {
      await L("ui", !0);
    },
    async disableUi() {
      await L("ui", !1);
    },
    async enableChat() {
      await L("chat", !0);
    },
    async disableChat() {
      await L("chat", !1);
    }
  };
}
const cr = "ritual.costOnly", ur = "ritual.simpleHealing", Kn = "ritual.eletrocussao", lr = "ritual.simpleDamage", dr = "generic.simpleHealing", mr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Yn() {
  return [
    Qn(),
    Xn(),
    Zn(),
    Jn(),
    ea()
  ];
}
function Qn() {
  return {
    id: cr,
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
function Xn() {
  return {
    id: ur,
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
    automation: fr(),
    itemPatch: ra()
  };
}
function Zn() {
  return {
    id: Kn,
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
    automation: ta(),
    itemPatch: na()
  };
}
function Jn() {
  return {
    id: lr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: nt()
  };
}
function ea() {
  return {
    id: dr,
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
function fr(e = "2d8+2") {
  return pr(
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
function ta() {
  return {
    ...nt("1d8", {
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
function nt(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return pr(
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
function ra() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: mr,
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
function na() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: mr,
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
function pr(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((n) => n.type !== "rollFormula" || n.id !== t ? n : {
      ...n,
      formula: r
    })
  };
}
function at() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: G(t.id),
    actorId: G(t.actor?.id),
    sceneId: G(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function gr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: G(e.id),
    actorId: G(t?.id),
    sceneId: G(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function G(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function aa(e) {
  return {
    logFirstRitualCost() {
      const t = F("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const r = U(t);
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
      const n = F("Nenhum ator encontrado para configurar custo customizado.");
      if (!n) return;
      const a = U(n);
      if (a) {
        if (!ia(t, r)) {
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
      const t = F("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = U(t);
      r && (await r.unsetFlag(u, "ritual.cost"), c.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = F("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = U(t);
      if (!r) return;
      const n = e.automationRegistry.require(cr);
      if (!n.ok) {
        c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value), c.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = F("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const n = U(r);
      if (!n) return;
      if (!kt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(ur);
      if (!a.ok) {
        c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, a.value, {
        definition: fr(t)
      }), c.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = F("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = U(r);
      if (!n) return;
      if (!kt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(lr);
      if (!a.ok) {
        c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, a.value, {
        definition: nt(t)
      }), c.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = F("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = U(t);
      r && await oa(e, t, r);
    }
  };
}
async function oa(e, t, r) {
  const n = Je(r);
  if (!n.ok) {
    c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: gr(),
    item: r,
    targets: at()
  });
  if (!a.ok) {
    sa(a.error);
    return;
  }
  c.info("Automação de ritual executada com sucesso.", x(a.value.context));
}
function sa(e) {
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
function F(e) {
  const t = re.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function U(e) {
  const t = sr(e);
  return t || (c.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ia(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function kt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const ca = ["disabled", "ask", "automatic"], ua = ["buttons", "confirm"], hr = "ask";
function la(e) {
  return typeof e == "string" && ca.includes(e);
}
function da(e) {
  return typeof e == "string" && ua.includes(e);
}
function ma(e) {
  return la(e) ? e : da(e) ? "ask" : hr;
}
const fa = ["keep", "replace"], yr = "keep", pa = !0, _ = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function ga() {
  game.settings.register(u, _.executionMode, {
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
    default: hr
  }), game.settings.register(u, _.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: yr
  }), game.settings.register(u, _.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: pa
  }), game.settings.register(u, _.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function bt() {
  const e = ma(game.settings.get(u, _.executionMode)), t = Rr(game.settings.get(u, _.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: Ar()
  };
}
function ha() {
  return Rr(game.settings.get(u, _.systemCardMode));
}
function Ar() {
  return game.settings.get(u, _.ritualCastingCheckEnabled) === !0;
}
async function B(e) {
  await game.settings.set(u, _.executionMode, e);
}
function Rr(e) {
  return fa.includes(e) ? e : yr;
}
function ya(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await B("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await B("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await B(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await B("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await B("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await B("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await B("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Aa = [
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
function Ra(e) {
  return {
    phases() {
      return Aa;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = we("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = Mn(t);
      if (!r) {
        c.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Tt(e, t, r);
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
      if (!Ta(r)) {
        c.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = ba(r) ?? we("Nenhum ator encontrado para executar automação do item.");
      n && await Tt(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = we("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = Ln(t);
      if (!r) {
        c.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(dr);
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
async function Tt(e, t, r) {
  const n = Je(r);
  if (!n.ok) {
    c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: gr(),
    item: r,
    targets: at()
  });
  if (!a.ok) {
    ka(a.error);
    return;
  }
  c.info("Automação executada com sucesso.", x(a.value.context));
}
function ka(e) {
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
function we(e) {
  const t = re.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ba(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Ta(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function wa(e) {
  const t = Gn(e), r = Fn(e), n = aa(e), a = Ra(e), o = Wn(), s = ya(e);
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
function Ca(e) {
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
    debug: wa(e)
  }, r = globalThis;
  return r[u] = t, r.ParanormalToolkit = t, t;
}
class wt {
  static isSupportedSystem() {
    return game.system.id === kn;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function $a() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: q(t.id),
    actorId: q(t.actor?.id),
    sceneId: q(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function kr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, r = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: q(e.id),
    actorId: q(t?.id),
    sceneId: q(e.scene?.id),
    name: r
  };
}
function Pa(e, t = kr()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Ia(e) {
  if (!_a(e)) return null;
  const t = e.getFlag(u, "workflow");
  return Ea(t) ? t : null;
}
function Sa() {
  return `flags.${u}.workflow`;
}
function Ct(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), r = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || r !== void 0;
}
function $t(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Ue(t) || Ue(r);
}
function Ea(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function _a(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function q(e) {
  return Ue(e) ? e : null;
}
function Ue(e) {
  return typeof e == "string" && e.length > 0;
}
function va() {
  const e = (t, r) => {
    Na(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Na(e, t) {
  const r = Ia(e);
  if (!r || r.targets.length === 0) return;
  const n = La(t);
  if (!n || n.querySelector(`.${u}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(Da(r));
}
function Da(e) {
  const t = document.createElement("section");
  t.classList.add(`${u}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(Pt("Origem", e.source.name)), t.append(Pt("Alvo", e.targets.map((n) => n.name).join(", "))), t;
}
function Pt(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${u}-chat-enrichment__row`);
  const n = document.createElement("span");
  n.textContent = `${e}: `;
  const a = document.createElement("span");
  return a.textContent = t, r.append(n, a), r;
}
function La(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ma() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!Oa(n) || !Fa(e) || Ct(e) || Ct(t)) return;
    const a = $a();
    if (a.length === 0 || !$t(e) && !$t(t)) return;
    const o = kr();
    e.updateSource({
      [Sa()]: Pa(a, o)
    }), c.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function Oa(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Fa(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const br = {
  enabled: "dice.animations.enabled"
};
function Ua() {
  game.settings.register(u, br.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Ba() {
  return {
    enabled: game.settings.get(u, br.enabled) === !0
  };
}
const J = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Tr = {
  PV: "system.attributes.hp"
}, Be = {
  PV: [J.PV, Tr.PV],
  SAN: [J.SAN],
  PE: [J.PE],
  PD: [J.PD]
}, je = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class ja {
  getResource(t, r) {
    const n = It(t, r);
    if (!n.ok)
      return m(n.error);
    const a = n.value, o = `${a}.value`, s = `${a}.max`, i = foundry.utils.getProperty(t, o), d = foundry.utils.getProperty(t, s), p = Et(t, r, o, i, "valor atual");
    if (p) return m(p);
    const y = Et(t, r, s, d, "valor máximo");
    return y ? m(y) : g({
      value: i,
      max: d
    });
  }
  async updateResourceValue(t, r, n) {
    const a = It(t, r);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: n });
  }
}
function It(e, t) {
  const r = xa(e.type, t);
  if (r && St(e, r))
    return g(r);
  const n = Be[t].find(
    (a) => St(e, a)
  );
  return n ? g(n) : m({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Ha(e, t),
    path: Be[t].join(" | ")
  });
}
function xa(e, t) {
  return e === "threat" ? Tr[t] ?? null : e === "agent" ? J[t] : null;
}
function St(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function Ha(e, t) {
  const r = e.type ?? "unknown", n = Be[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function Et(e, t, r, n, a) {
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
class Va {
  isRitual(t) {
    return t.type === "ritual";
  }
  getCircle(t) {
    if (!this.isRitual(t))
      return m({
        reason: "not-a-ritual",
        message: `Item ${t.name ?? "sem nome"} não é um ritual.`,
        ritual: t
      });
    const r = this.readCircleFromKnownPaths(t);
    if (!r) {
      const s = je.ritualItem.circleCandidates;
      return m({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: n, value: a } = r, o = Ga(a);
    return o ? g(o) : m({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${n}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: n,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of je.ritualItem.circleCandidates) {
      const n = foundry.utils.getProperty(t, r);
      if (n != null)
        return { path: r, value: n };
    }
    return null;
  }
}
function Ga(e) {
  if (_t(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (_t(r))
      return r;
  }
  return null;
}
function _t(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const qa = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class za {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const r = this.ritualAdapter.getCircle(t.ritual);
    if (!r.ok)
      return m({
        ...r.error,
        actor: t.actor
      });
    const n = r.value, a = Wa(t.ritual, n);
    return a.ok ? a.value ? g(a.value) : g({
      resource: "PE",
      amount: qa[n],
      source: "default-by-circle",
      circle: n
    }) : m(a.error);
  }
}
function Wa(e, t) {
  const r = e.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Ka(r) ? {
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
function Ka(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Ce = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ya(e) {
  if (!to(e.item)) return null;
  const t = xe(e.actor) ? e.actor : Qa(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Za(e.token) ?? Xa(t),
    targets: at(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Qa(e) {
  const t = e;
  return xe(t.actor) ? t.actor : xe(e.parent) ? e.parent : null;
}
function Xa(e) {
  const t = Ja(e) ?? eo(e);
  return t ? wr(t) : null;
}
function Za(e) {
  return He(e) ? wr(e) : null;
}
function Ja(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return He(r) ? r : (t.getActiveTokens?.() ?? []).find(He) ?? null;
}
function eo(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function wr(e) {
  const t = e.actor ?? null;
  return {
    tokenId: $e(e.id),
    actorId: $e(t?.id),
    sceneId: $e(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function to(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function xe(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function He(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function $e(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class ro {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Ce.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, c.info(`${Ce.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = Ya(no(t));
    if (!r) {
      c.warn(`${Ce.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function no(e) {
  return e && typeof e == "object" ? e : {};
}
class ao {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return Pe("missing-item-patch");
    if (t.type !== "ritual") return Pe("unsupported-item-type");
    const a = oo(n);
    return Object.keys(a).length === 0 ? Pe("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function oo(e) {
  const t = {};
  k(t, "name", e.name), k(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (k(t, "system.circle", r.circle), k(t, "system.element", r.element), k(t, "system.target", r.target), k(t, "system.targetQtd", r.targetQuantity), k(t, "system.execution", r.execution), k(t, "system.range", r.range), k(t, "system.duration", r.duration), k(t, "system.skillResis", r.resistanceSkill), k(t, "system.resistance", r.resistance), k(t, "system.studentForm", r.studentForm), k(t, "system.trueForm", r.trueForm)), t;
}
function k(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function Pe(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class so {
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
    return this.getNumber(t, je.ritual.dt, 0);
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
class io {
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
class co {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = uo(t);
    return r.ok ? this.presets.has(t.id) ? m({
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
    return r ? g(r) : m({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(Ie);
  }
  findForItem(t) {
    return this.list().map((r) => lo(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function uo(e) {
  return !Se(e.id) || !Se(e.version) || !Se(e.label) ? m({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? m({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : g(e);
}
function lo(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = mo(a, t);
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
function mo(e, t) {
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
      const r = vt(t.name), n = e.names.map(vt).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = fo(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function vt(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function fo(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function Ie(e) {
  return structuredClone(e);
}
function Se(e) {
  return typeof e == "string" && e.length > 0;
}
function le(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? m({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : g(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = he(e.amountFrom);
    if (!r)
      return m({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const n = t.rolls[r];
    if (!n)
      return m({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${r}.`
      });
    const a = Math.trunc(n.total);
    return !Number.isInteger(a) || a <= 0 ? m({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${r} não gerou um amount positivo.`
    }) : g(a);
  }
  return m({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function he(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const po = "dice-so-nice";
async function Cr(e) {
  if (!Ba().enabled || !go()) return;
  const t = ho();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      c.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function go() {
  return game.modules.get(po)?.active === !0;
}
function ho() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function yo(e, t, r) {
  if (!Nt(e.id) || !Nt(e.formula))
    return m({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const n = new Roll(e.formula), a = await Promise.resolve(n.evaluate()), o = a.total;
    if (typeof o != "number" || !Number.isFinite(o))
      return m({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await Cr(a);
    const i = {
      ...r.rollRequests[e.id] ?? $r(e, t),
      total: o,
      roll: a
    };
    return r.rolls[e.id] = i, g(i);
  } catch (n) {
    return m({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: n
    });
  }
}
function $r(e, t) {
  const r = e.intent ?? Ao(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function Ao(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Nt(e) {
  return typeof e == "string" && e.length > 0;
}
async function de(e, t, r, n, a) {
  switch (n) {
    case "spend":
      return r !== "PE" && r !== "PD" ? ce(t, r, n, a) : e.spend(t, r, a);
    case "damage":
      return r !== "PV" && r !== "SAN" ? ce(t, r, n, a) : e.damage(t, r, a);
    case "heal":
      return r !== "PV" ? ce(t, r, n, a) : e.heal(t, r, a);
    case "recover":
      return r !== "SAN" ? ce(t, r, n, a) : e.recover(t, r, a);
  }
}
function ce(e, t, r, n) {
  return m({
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
function Ro(e) {
  const { step: t, context: r, transaction: n, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = ko(t, r, n, a);
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
    const s = bo(t, r, n, a);
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
function ko(e, t, r, n) {
  const a = he(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Pr(t.id, "damage", n, t.damageInstances.length),
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
function bo(e, t, r, n) {
  const a = he(e.amountFrom);
  return {
    id: Pr(t.id, "healing", n, t.healingInstances.length),
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
function Pr(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function To(e, t, r) {
  const n = he(e.amountFrom), a = n ? t.rolls[n] : void 0;
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
function wo(e) {
  const { step: t, context: r, stepIndex: n, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", r, { stepIndex: n, step: t, metadata: a }), Ir("before", e), Dt("before", e), Dt("resolve", e);
}
function Co(e) {
  const { step: t, context: r, stepIndex: n, metadata: a, lifecycle: o } = e;
  o.emit("apply", r, { stepIndex: n, step: t, metadata: a }), Ir("apply", e);
}
function $o(e) {
  const { step: t, context: r, stepIndex: n, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", r, { stepIndex: n, step: t, metadata: a });
}
function Ir(e, t) {
  const { step: r, context: n, stepIndex: a, metadata: o, lifecycle: s } = t, i = Po(e, r.operation);
  i && s.emit(i, n, {
    stepIndex: a,
    step: r,
    metadata: o
  });
}
function Dt(e, t) {
  const { step: r, context: n, stepIndex: a, metadata: o, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: a,
    step: r,
    metadata: o
  });
}
function Po(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Io(e, t, r) {
  try {
    return await e.createWorkflowSummaryMessage(r, t), g(void 0);
  } catch (n) {
    return m({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: n
    });
  }
}
async function So(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Eo(e, t);
    case "spendRitualCost":
      return _o(e, t);
  }
}
async function Eo(e, t) {
  const { context: r, resources: n } = e, a = le(t, r);
  return a.ok ? Sr(await n.spend(r.sourceActor, t.resource, a.value), r) : m(a.error);
}
async function _o(e, t) {
  const { context: r, resources: n, ritualCosts: a } = e, o = a.getCost({
    actor: r.sourceActor,
    ritual: r.item
  });
  if (!o.ok)
    return m({
      reason: "ritual-cost-failed",
      message: o.error.message,
      cause: o.error
    });
  const s = o.value;
  return r.ritualCosts.push({
    ...s,
    itemId: r.item.id ?? null,
    itemName: r.item.name ?? "Ritual sem nome"
  }), Sr(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function Sr(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), g(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), m({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function vo(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: a, execute: o } = e, s = No(t);
  for (const d of s.before)
    a.emit(d, r, { stepIndex: n, step: t });
  const i = await o();
  if (!i.ok)
    return i;
  for (const d of s.after)
    a.emit(d, r, { stepIndex: n, step: t });
  return i;
}
function No(e) {
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
class Do {
  constructor(t, r, n, a) {
    this.resources = t, this.ritualCosts = r, this.messages = n, this.lifecycle = a;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, r) {
    if (t.steps.length === 0)
      return m({
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
        return vo({
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
        return m({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: n,
          step: t,
          context: r
        });
    }
  }
  async runCostStep(t, r, n) {
    const a = await So({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? g(void 0) : m({ ...a.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const a = $r(t, n);
    r.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, r, n, t);
    const o = await this.runRollFormulaStep(t, r, n);
    if (!o.ok)
      return o;
    const s = r.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, r, n, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: a, rollResult: s }), g(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const a = await yo(t, n, r);
    return a.ok ? g(void 0) : m({ ...a.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const a = le(t, r);
    if (!a.ok)
      return m({ ...a.error, stepIndex: n, step: t, context: r });
    const o = To(t, r, a.value);
    wo({
      step: t,
      context: r,
      stepIndex: n,
      metadata: o,
      lifecycle: this.lifecycle
    }), Co({
      step: t,
      context: r,
      stepIndex: n,
      metadata: o,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, r);
    if (s.length === 0)
      return m({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: n,
        step: t,
        context: r
      });
    for (const i of s) {
      const d = await de(this.resources, i, t.resource, t.operation, a.value), p = this.handleResourceOperationResult(d, r, n, t);
      if (!p.ok)
        return p;
      Ro({
        step: t,
        context: r,
        transaction: p.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return $o({
      step: t,
      context: r,
      stepIndex: n,
      metadata: o,
      lifecycle: this.lifecycle
    }), g(void 0);
  }
  async runModifyResourceStep(t, r, n) {
    const a = le(t, r);
    if (!a.ok)
      return m({ ...a.error, stepIndex: n, step: t, context: r });
    const o = this.resolveActors(t.actor, r);
    if (o.length === 0)
      return m({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: n,
        step: t,
        context: r
      });
    for (const s of o) {
      const i = await de(this.resources, s, t.resource, t.operation, a.value), d = this.handleResourceOperationResult(i, r, n, t);
      if (!d.ok)
        return d;
    }
    return g(void 0);
  }
  async runChatCardStep(t, r, n) {
    const a = await Io(this.messages, t, r);
    return a.ok ? g(void 0) : m({ ...a.error, stepIndex: n, step: t, context: r });
  }
  handleResourceOperationResult(t, r, n, a) {
    return t.ok ? (r.resourceTransactions.push(t.value), g(t.value)) : m({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: n,
      step: a,
      context: r,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, r, n, a, o, s) {
    const i = Lo(t, r.intent);
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
function Lo(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Mo {
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
      return m({
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
      return m({
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
      return m({
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
    const { afterValue: d, appliedAmount: p } = i.value, y = {
      value: d,
      max: s.max
    };
    try {
      d !== s.value && await this.adapter.updateResourceValue(t, r, d);
    } catch (A) {
      return m({
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
        return r.value < n ? m({
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
function Er(e) {
  return {
    id: Oo(),
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
function Oo() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Fo {
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
    return x(this.lastContext);
  }
  async runAutomation(t, r) {
    const n = Er(r);
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
class Uo {
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
class Bo {
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
    const r = Fe();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: jo(),
      flags: {
        ...t.flags,
        [u]: {
          ...xo(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && c.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = Fe();
    if (!n.enabled)
      return;
    const a = r.notification ?? Lt(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, a);
  }
  emitConsole(t, r) {
    const n = Lt(r);
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
function Lt(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function jo() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function xo(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const Ho = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", _r = `${u}-inline-roll-neutralized`, Vo = `${u}-inline-roll-notice`, ot = `data-${u}-inline-roll-neutralized`, Mt = `data-${u}-inline-roll-notice`, Go = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Ot(e) {
  const t = as(e.message), r = await qo(e.message), n = zo(t);
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
async function qo(e) {
  const t = ts(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = Wo(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await rs(t, r.content), replacementCount: r.replacementCount };
}
function zo(e) {
  const t = e ? ns(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = vr(t);
  return r > 0 && Nr(Zo(t)), { replacementCount: r };
}
function Wo(e) {
  const t = Ko(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = vr(r.content), a = t.replacementCount + n;
  return a === 0 ? { content: e, replacementCount: 0 } : (Nr(r.content), { content: r.innerHTML, replacementCount: a });
}
function Ko(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, a) => (t += 1, Qo(a.trim()))), replacementCount: t };
}
function vr(e) {
  const t = Yo(e);
  for (const r of t)
    r.replaceWith(Xo(Jo(r)));
  return t.length;
}
function Yo(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(Ho))
    r.getAttribute(ot) !== "true" && t.add(r);
  return Array.from(t);
}
function Qo(e) {
  return `<span class="${_r}" ${ot}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${os(e)}</span>`;
}
function Xo(e) {
  const t = document.createElement("span");
  return t.classList.add(_r), t.setAttribute(ot, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Nr(e) {
  if (e.querySelector?.(`[${Mt}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Vo), t.setAttribute(Mt, "true"), t.textContent = Go, e.append(t);
}
function Zo(e) {
  return e.querySelector(".message-content") ?? e;
}
function Jo(e) {
  const r = e.getAttribute("data-formula") ?? es(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function es(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function ts(e) {
  return e && typeof e == "object" ? e : null;
}
async function rs(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return c.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function ns(e) {
  const t = ss(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function as(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function os(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function ss(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ft = "occultism";
function is(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function cs(e) {
  const t = is(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await us(e, Ft);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Cr(r);
  const n = ms(r);
  return {
    skill: Ft,
    skillLabel: "Ocultismo",
    roll: r,
    formula: ds(r),
    total: n,
    difficulty: t,
    success: n >= t,
    diceBreakdown: fs(r)
  };
}
async function us(e, t) {
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
  return ls(n);
}
function ls(e) {
  return Ut(e) ? e : Array.isArray(e) ? e.find(Ut) ?? null : null;
}
function Ut(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function ds(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function ms(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function fs(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(ps);
  if (!r) return null;
  const a = (Array.isArray(r.results) ? r.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function ps(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Dr = ["base", "discente", "verdadeiro"];
function Lr(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function gs(e) {
  return typeof e == "string" && Dr.includes(e);
}
const { ApplicationV2: hs } = foundry.applications.api;
class ee extends hs {
  constructor(t, r) {
    super({
      id: `${u}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = r;
  }
  input;
  resolveRequest;
  isResolved = !1;
  static DEFAULT_OPTIONS = {
    id: `${u}-ritual-cast`,
    classes: [u, "paranormal-toolkit-ritual-cast-app"],
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
      cast: ee.onCast,
      cancel: ee.onCancel
    }
  };
  static async request(t) {
    return new Promise((r) => {
      new ee(t, r).render({ force: !0 });
    });
  }
  async _renderHTML(t, r) {
    const n = document.createElement("div");
    return n.className = "paranormal-toolkit-ritual-cast", n.innerHTML = this.renderContent(), n;
  }
  _replaceHTML(t, r, n) {
    r.replaceChildren(t);
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    const t = this.input.ritual.name ?? "Ritual sem nome", r = this.input.targetNames.length > 0 ? this.input.targetNames.join(", ") : "Nenhum alvo selecionado", n = this.input.cost ? `${this.input.cost.amount} ${this.input.cost.resource}` : "não resolvido", a = this.input.defaultSpendResource ? "checked" : "";
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${C(Ze)}</p>
        <div>
          <h2>${C(t)}</h2>
          <p>${C(ws(this.input.ritual))}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.input.variantOptions.map((o) => ys(o, this.input.cost)).join("")}
        </div>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--cost">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Custo</h3>
          <label class="paranormal-toolkit-ritual-cast__spend-toggle">
            <input type="checkbox" name="spendResource" ${a}>
            <span>Gastar ao conjurar</span>
          </label>
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo base</dt><dd>${C(n)}</dd></div>
          <div><dt>Conjurador</dt><dd>${C(this.input.actor.name ?? "Ator sem nome")}</dd></div>
          <div><dt>Alvos</dt><dd>${C(r)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.input.automationStatus ?? "assisted"}">
        <h3>Automação</h3>
        ${Rs(this.input)}
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
    const r = Ts(t), n = ks(r, this.input.defaultSpendResource);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function ys(e, t) {
  const r = e.variant === "base" ? "checked" : "", n = e.enabled ? "" : "disabled", a = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.finalCostText ?? As(t), s = [...e.details, e.enabled ? "" : e.unavailableReason ?? "não disponível neste ritual"].filter((i) => i.trim().length > 0).filter((i) => !i.toLocaleLowerCase().startsWith("custo final")).map((i) => `<span>${C(i)}</span>`).join("");
  return `
    <label class="paranormal-toolkit-ritual-cast__form${a}">
      <input type="radio" name="variant" value="${C(e.variant)}" ${r} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${C(e.label)}</strong>
        <em>${C(o)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${s}</span>
    </label>
  `;
}
function As(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function Rs(e) {
  return e.automationStatus === "generic" ? `
      <p><strong>Sem automação configurada.</strong></p>
      <p>O Toolkit vai registrar a conjuração e gastar o recurso escolhido. Rolagens, dano, resistência e efeitos continuam manuais.</p>
    ` : `
    <p><strong>Automação assistida disponível.</strong></p>
    <p>O Toolkit vai preparar custo, rolagens e ações assistidas no card persistente do chat.</p>
  `;
}
function ks(e, t) {
  const r = bs(e), n = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: n
  };
}
function bs(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return gs(t) ? t : "base";
}
function Ts(e) {
  return (e.currentTarget instanceof HTMLElement ? e.currentTarget : null)?.closest(".paranormal-toolkit-ritual-cast") ?? null;
}
function ws(e) {
  const t = e.system, r = [$s(t?.element), Cs(t?.circle)].filter(Ps);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function Cs(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : `${e}º Círculo`;
}
function $s(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function Ps(e) {
  return typeof e == "string" && e.length > 0;
}
function C(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function Is(e) {
  return ee.request(e);
}
const Mr = {
  label: "Padrão"
};
class Ss {
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
    const n = this.resolveCostPreview(t), a = ei(r, n), o = await Is({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((l) => l.name),
      cost: n,
      defaultSpendResource: oi(r),
      variantOptions: a,
      automationStatus: ni(r) ? "generic" : "assisted"
    });
    if (!o)
      return { status: "cancelled" };
    const s = ai(r, o.variant), i = Ar();
    let d = null;
    if (i) {
      const l = await _s(this.resources, t.actor, o, s, n);
      if (!l.ok)
        return {
          status: "failed",
          reason: l.reason,
          message: l.message
        };
      try {
        d = await cs(t.actor);
      } catch (I) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: I instanceof Error ? I.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: I
        };
      }
      if (!d.success) {
        const I = jt(t, o);
        return {
          status: "completed-without-actions",
          workflowContext: I,
          summaryLines: Ee(r, o, s, n, I, d, {
            effectStopped: !0
          })
        };
      }
    }
    const p = Es(r, o, s, n, {
      includeCostSteps: !i
    });
    if (p.steps.length === 0) {
      const l = jt(t, o);
      return {
        status: "completed-without-actions",
        workflowContext: l,
        summaryLines: Ee(r, o, s, n, l, d)
      };
    }
    const y = await this.workflow.runAutomation(p, {
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
    if (!y.ok)
      return {
        status: "failed",
        reason: y.error.reason,
        message: y.error.message,
        cause: y.error
      };
    const A = y.value.context, R = Ns(r, t, A), T = Ee(r, o, s, n, A, d);
    return R.ok ? R.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: A,
      summaryLines: T
    } : {
      status: "ready",
      workflowContext: A,
      actions: R.actions,
      summaryLines: T
    } : {
      status: "failed",
      reason: R.reason,
      message: R.message
    };
  }
  async applyAction(t) {
    return de(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function Es(e, t, r, n, a) {
  const o = [];
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || st(s) && (!a.includeCostSteps || !t.spendResource) || o.push(vs(s, r));
  return a.includeCostSteps && t.spendResource && n && si(r.extraCost) && o.push({
    type: "spendResource",
    actor: "self",
    resource: n.resource,
    amount: r.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: o
  };
}
async function _s(e, t, r, n, a) {
  if (!r.spendResource) return { ok: !0 };
  const o = ye(a, n);
  if (!o)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (o.amount <= 0) return { ok: !0 };
  const s = await e.spend(t, o.resource, o.amount);
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function vs(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function Ns(e, t, r) {
  const n = [];
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const o = le(a, r);
    if (!o.ok)
      return {
        ok: !1,
        reason: o.error.reason,
        message: o.error.message
      };
    const s = xs(a.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(...Ds(e, a, i, o.value));
  }
  return { ok: !0, actions: n };
}
function Ds(e, t, r, n) {
  if (!Fs(e, t))
    return [Bt(t, r, n)];
  const a = js();
  return Or(e).map((o) => {
    const s = Us(n, o);
    return Bt(t, r, s, {
      option: o,
      choiceGroupId: a
    });
  });
}
function Bt(e, t, r, n) {
  const a = t.name ?? "Ator sem nome", o = Os(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: Ls(e, a, r, n?.option),
    executedLabel: Ms(e, a, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function Ls(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function Ms(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Os(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Fs(e, t) {
  return t.operation === "damage" && t.resource === "PV" && Or(e).length > 1;
}
function Or(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Us(e, t) {
  const r = e * t.multiplier, n = Bs(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function Bs(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function js() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function xs(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function Ee(e, t, r, n, a, o = null, s = {}) {
  const i = s.effectStopped === !0;
  return [
    `Forma: ${Lr(t.variant)}`,
    Vs(t, r, n),
    ...Hs(o),
    ...i ? [] : Object.values(a.rolls).flatMap(Gs),
    ...i ? [] : qs(e.resistance),
    ...Zs(r),
    ...i ? ["Observação: O efeito do ritual não foi resolvido porque a conjuração falhou."] : []
  ];
}
function Hs(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Vs(e, t, r) {
  const n = ye(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Gs(e) {
  const r = [`${Js(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = zs(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${Xs(e.damageType)}`), r;
}
function qs(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function zs(e) {
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
    const s = Ws(o);
    s && (Qs(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function Ws(e) {
  const t = Ks(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Ys(e);
}
function Ks(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function Ys(e) {
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
function Qs(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function Xs(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Zs(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Js(e) {
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
function ei(e, t) {
  return Dr.map((r) => {
    const n = Fr(e, r), a = r === "base" || n !== null, o = n ?? (r === "base" ? Mr : null);
    return {
      variant: r,
      label: o?.label ?? Lr(r),
      enabled: a,
      details: o ? ti(o, t) : [],
      finalCostText: o ? ri(t, o) : null,
      unavailableReason: a ? void 0 : "não disponível neste ritual"
    };
  });
}
function ti(e, t) {
  const r = [], n = Object.values(e.rollFormulaOverrides ?? {});
  n.length > 0 && r.push(n.join(", "));
  const a = ye(t, e);
  return r.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), r;
}
function ye(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function ri(e, t) {
  const r = ye(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function ni(e) {
  return !e.ritualForms && !e.resistance && e.steps.length > 0 && e.steps.every(st);
}
function jt(e, t) {
  return Er({
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
function ai(e, t) {
  return Fr(e, t) ?? Mr;
}
function Fr(e, t) {
  return e.ritualForms?.[t] ?? null;
}
function oi(e) {
  return e.steps.some(st);
}
function st(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function si(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function ii(e, t) {
  const r = await ci(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: di(r),
    total: mi(r),
    diceBreakdown: fi(r)
  };
}
function Ur(e) {
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
async function ci(e, t) {
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
  return li(n);
}
function li(e) {
  return xt(e) ? e : Array.isArray(e) ? e.find(xt) ?? null : null;
}
function xt(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function di(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function mi(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function fi(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(pi);
  if (!r) return null;
  const a = (Array.isArray(r.results) ? r.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function pi(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Br = "itemUsePrompts", jr = "chatCard", Ae = "data-paranormal-toolkit-prompt-id", Re = "data-paranormal-toolkit-pending-id", it = "data-paranormal-toolkit-executed-label", Ve = "data-paranormal-toolkit-choice-group", xr = "data-paranormal-toolkit-skipped-label", Ht = "data-paranormal-toolkit-action-section", Vt = "data-paranormal-toolkit-detail-key", Gt = "data-paranormal-toolkit-roll-card", ct = "data-paranormal-toolkit-roll-detail-toggle", Hr = "data-paranormal-toolkit-roll-detail-id", Vr = "data-paranormal-toolkit-resistance-roll-button", Gr = "data-paranormal-toolkit-resistance-skill", qr = "data-paranormal-toolkit-resistance-skill-label", zr = "data-paranormal-toolkit-resistance-target-actor-id", Wr = "data-paranormal-toolkit-resistance-target-name", Kr = "data-paranormal-toolkit-resistance-roll-result", qt = "data-paranormal-toolkit-system-card-replaced", gi = `[${Re}]`, hi = `[${ct}]`, yi = `[${Vr}]`, Ge = `${u}-chat-enrichment`, f = `${u}-item-use-prompt`, Ai = `${f}__actions`, zt = `${f}__details`, Yr = `${f}__summary`, Ri = `${f}__title`, Qr = `${f}__button--executed`, Wt = `${f}__roll-card`;
let Kt = !1, qe = null;
const P = /* @__PURE__ */ new Map(), ki = [0, 100, 500, 1500, 3e3], bi = 3e4, Ti = [0, 100, 500, 1500, 3e3];
function wi(e) {
  if (qe = e, Kt) {
    Qt(e);
    return;
  }
  const t = (r, n) => {
    Zr(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Kt = !0, Qt(e);
}
async function Yt(e) {
  const t = Xr(e);
  P.set(e.pendingId, t), await dt(t) || un(t), Jr(e.pendingId);
}
async function Ci(e) {
  const t = Xr({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await dt(t) || un(t), Jr(e.pendingId);
}
async function _e(e, t) {
  const r = P.get(e);
  P.delete(e), r && await yc(r, t);
}
function ut(e) {
  const t = gn();
  for (const r of t) {
    const n = D(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function $i(e, t) {
  const r = ut(e);
  if (!r) return;
  const n = D(r.message), a = n[e];
  a && (n[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Y(r.message, n));
}
async function Pi(e, t, r) {
  if (!t) return;
  const n = ut(e);
  if (!n) return;
  const a = D(n.message);
  let o = !1;
  for (const [s, i] of Object.entries(a))
    s !== e && i.choiceGroupId === t && (a[s] = {
      ...i,
      executedLabel: r ?? i.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Y(n.message, a);
}
function Xr(e) {
  const t = M(e.context.message), r = e.context.targets.find((s) => Ye(s)), n = r ? Ye(r) : null, a = e.resistanceTargetActor ?? n, o = e.resistanceTargetName ?? r?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: zi(e.context),
    executed: !1
  };
}
function Zr(e, t, r) {
  hc();
  const n = be(t);
  if (!n) return;
  const a = fc(e, n);
  a.length > 0 && me(n);
  for (const o of a)
    ze(n, o);
  rn(n, r), We(n), Ke(n);
}
function Qt(e) {
  for (const t of Ti)
    globalThis.setTimeout(() => {
      Ii(e);
    }, t);
}
function Ii(e) {
  for (const t of Si()) {
    const r = ke(t);
    Ei(r) && Zr(r, t, e);
  }
}
function Si() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function Ei(e) {
  return e ? mt(e) ? !0 : Rc(e).length > 0 : !1;
}
function Jr(e) {
  const t = P.get(e);
  if (!t) return;
  const r = t.messageId ? pc(t.messageId) : null;
  if (r) {
    Jt(r, t), me(r), ze(r, t), Xt(r), We(r), Ke(r);
    return;
  }
  if (t.messageId) {
    Xe(t);
    return;
  }
  const n = gc(t);
  if (n) {
    Jt(n, t), me(n), ze(n, t), Xt(n), We(n), Ke(n);
    return;
  }
  Xe(t);
}
function Xt(e) {
  qe && rn(e, qe);
}
function me(e) {
  const t = _i();
  e.classList.toggle(`${f}--system-card-replaced`, t);
  const r = tn(e);
  if (!r || (r.classList.toggle(`${f}__host--system-card-replaced`, t), !t) || r.getAttribute(qt) === "true") return;
  const n = r.querySelector(`.${Ge}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(qt, "true");
}
function _i() {
  try {
    return ha() === "replace";
  } catch {
    return !1;
  }
}
function ze(e, t) {
  if (me(e), e.querySelector(`[${Ae}="${Q(t.pendingId)}"]`)) return;
  const r = vi(e, t);
  Di(r, t), xi(r, Hi(t)).append(qi(t));
}
function vi(e, t) {
  const r = e.querySelector(`.${Ge}`);
  if (r)
    return r;
  const n = document.createElement("section");
  n.classList.add(Ge, f);
  const a = document.createElement("header");
  a.classList.add(`${f}__header`);
  const o = document.createElement("span");
  o.classList.add(`${f}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Ri), s.textContent = Ni(t);
  const i = document.createElement("span");
  return i.classList.add(Yr), i.textContent = t.summary, a.append(o, s, i), n.append(a), Ki(e).append(n), n;
}
function Ni(e) {
  const t = b(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function Di(e, t) {
  const r = t.summaryLines ?? [], n = sn(r, t);
  if (n) {
    Li(e, n, t);
    return;
  }
  Vi(e, r);
}
function Li(e, t, r) {
  if (e.querySelector(`[${Gt}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(Wt, `${Wt}--${t.intent}`), n.setAttribute(Gt, "true");
  const a = document.createElement("div");
  a.classList.add(`${f}__roll-summary`);
  const o = document.createElement("span");
  o.classList.add(`${f}__roll-chip`, `${f}__roll-chip--${t.intent}`), o.textContent = t.label.toUpperCase();
  const s = document.createElement("strong");
  s.classList.add(`${f}__roll-total`), s.textContent = String(t.total);
  const i = document.createElement("span");
  i.classList.add(`${f}__roll-formula`), i.textContent = t.formula, a.append(o, s, i), n.append(a), Mi(n, t), Oi(n, t), Fi(n, t, r), Bi(n, t, r.pendingId), e.append(n);
}
function Mi(e, t) {
  const r = t.castingCheck;
  if (!r) return;
  const n = document.createElement("div");
  n.classList.add(
    `${f}__casting-check`,
    `${f}__casting-check--${r.success ? "success" : "failure"}`
  );
  const a = document.createElement("div");
  a.classList.add(`${f}__casting-check-header`);
  const o = document.createElement("strong");
  o.textContent = "Conjuração";
  const s = document.createElement("span");
  s.classList.add(`${f}__casting-check-status`), s.textContent = r.success ? "Sucesso" : "Falha", a.append(o, s);
  const i = document.createElement("span");
  if (i.classList.add(`${f}__casting-check-result`), i.textContent = `${r.label}: ${r.total} vs DT ${r.difficulty}`, n.append(a, i), r.diceBreakdown) {
    const d = document.createElement("span");
    d.classList.add(`${f}__casting-check-dice`), d.textContent = `Dados: ${r.diceBreakdown}`, n.append(d);
  }
  e.append(n);
}
function Oi(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Fc);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${f}__roll-meta`);
  for (const a of r) {
    const o = document.createElement("span");
    o.classList.add(`${f}__roll-meta-pill`), o.textContent = a, n.append(o);
  }
  e.append(n);
}
function Fi(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${f}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${f}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = Ui(t, r);
  a.append(o), s && a.append(s);
  const i = document.createElement("span");
  i.classList.add(`${f}__resistance-description`), i.textContent = t.resistance, n.append(a, i), t.resistanceRollResult && n.append(en(t.resistanceRollResult)), e.append(n);
}
function Ui(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${f}__resistance-roll-button`), r.setAttribute(Ae, t.pendingId), r.setAttribute(Vr, "true"), r.setAttribute(Gr, e.resistanceSkill), r.setAttribute(qr, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(zr, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(Wr, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${f}__resistance-roll-button--rolled`), r.setAttribute(Kr, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${f}__resistance-roll-fallback`), a.textContent = "d20", r.append(n, a), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function en(e) {
  const t = document.createElement("span");
  return t.classList.add(`${f}__resistance-roll-result`), t.textContent = an(e), t;
}
function Bi(e, t, r) {
  const n = ji(t);
  if (n.length === 0) return;
  const a = `${r}-roll-details`, o = document.createElement("button");
  o.type = "button", o.classList.add(`${f}__roll-detail-toggle`), o.setAttribute(ct, a), o.setAttribute("aria-expanded", "false"), o.textContent = "▸ Ver detalhes";
  const s = document.createElement("dl");
  s.classList.add(`${f}__roll-detail-list`), s.setAttribute(Hr, a), s.hidden = !0;
  for (const i of n) {
    const d = document.createElement("dt");
    d.textContent = i.label;
    const p = document.createElement("dd");
    p.textContent = i.value, s.append(d, p);
  }
  e.append(o, s);
}
function ji(e) {
  const t = [
    { label: "Fórmula", value: e.formula }
  ];
  e.diceBreakdown && t.push({ label: "Dados", value: e.diceBreakdown }), e.castingCheck && (t.push({
    label: "Conjuração",
    value: `${e.castingCheck.label}: ${e.castingCheck.total} vs DT ${e.castingCheck.difficulty}`
  }), t.push({ label: "Resultado", value: e.castingCheck.success ? "Sucesso" : "Falha" })), e.damageType && t.push({ label: "Tipo", value: e.damageType }), e.resistance && t.push({ label: "Resistência", value: e.resistance }), e.form && t.push({ label: "Forma", value: e.form }), e.cost && t.push({ label: "Custo", value: e.cost });
  for (const r of e.notes)
    t.push({ label: "Observação", value: r });
  for (const r of e.details)
    t.push({ label: "Detalhe", value: r });
  return t;
}
function xi(e, t) {
  const r = `[${Ht}="${Q(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const a = document.createElement("div");
  a.classList.add(Ai), a.setAttribute(Ht, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${f}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function Hi(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = sn(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Vi(e, t) {
  if (t.length === 0) return;
  const r = Gi(e);
  for (const n of t) {
    const a = Uc(n);
    if (r.querySelector(`[${Vt}="${Q(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = n, o.setAttribute(Vt, a), r.append(o);
  }
}
function Gi(e) {
  const t = e.querySelector(`.${zt}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(zt), e.append(r), r;
}
function qi(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${f}__button`), t.setAttribute(Ae, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Qr), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Re, e.pendingId), t.setAttribute(it, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Ve, e.choiceGroupId), t.setAttribute(xr, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function zi(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = Wi(e);
  return `${t} → ${r}`;
}
function Wi(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Ki(e) {
  return tn(e) ?? e;
}
function tn(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function rn(e, t) {
  const r = be(e);
  if (!r) return;
  const n = r.querySelectorAll(gi);
  for (const a of n)
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      cc(a, t);
    }));
}
function We(e) {
  const t = be(e);
  if (!t) return;
  const r = t.querySelectorAll(hi);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      Yi(t, n);
    }));
}
function Ke(e) {
  const t = be(e);
  if (!t) return;
  const r = t.querySelectorAll(yi);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      Qi(t, n);
    }));
}
function Yi(e, t) {
  const r = t.getAttribute(ct);
  if (!r) return;
  const n = e.querySelector(`[${Hr}="${Q(r)}"]`);
  if (!n) return;
  const a = n.hidden;
  n.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Qi(e, t) {
  const r = t.getAttribute(Ae), n = t.getAttribute(Gr), a = t.getAttribute(qr) ?? (n ? Ur(n) : "Resistência");
  if (!r || !n) return;
  const o = Ji(e, r), s = ec(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await ii(s, n);
    await oc(d.roll);
    const p = {
      skill: n,
      skillLabel: a,
      formula: d.formula,
      total: d.total,
      targetName: s.name ?? o?.resistanceTargetName ?? "alvo",
      diceBreakdown: d.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Xi(t, p), Zi(t, p), sc(r, p), await ic(e, r, p);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function Xi(e, t) {
  e.classList.add(`${f}__resistance-roll-button--rolled`), e.setAttribute(Kr, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Zi(e, t) {
  const r = e.closest(`.${f}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${f}__resistance-roll-result`), a = n ?? en(t);
  if (n) {
    n.textContent = an(t);
    return;
  }
  r.append(a);
}
function Ji(e, t) {
  const r = P.get(t);
  if (r) return r;
  const n = ke(e);
  return D(n)[t] ?? null;
}
function ec(e, t) {
  const r = e?.resistanceTargetActor;
  if (v(r)) return r;
  const a = e?.context?.targets.map(Ye).find(v) ?? null;
  if (a) return a;
  const o = t.getAttribute(zr) ?? e?.resistanceTargetActorId ?? null, s = o ? rc(o) : null;
  return s || nc(
    t.getAttribute(Wr) ?? e?.resistanceTargetName ?? tc(t)
  );
}
function tc(e) {
  const r = e.closest(`.${f}`)?.querySelector(`.${Yr}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const a = r.split(n), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Ye(e) {
  const t = e.actor;
  if (v(t)) return t;
  const r = e.token, n = te(r);
  if (n) return n;
  const a = e.document;
  return te(a);
}
function te(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (v(t)) return t;
  const r = e.document?.actor;
  return v(r) ? r : null;
}
function rc(e) {
  const r = game.actors?.get?.(e);
  return v(r) ? r : nn().map((o) => te(o)).find((o) => o?.id === e) ?? null;
}
function nc(e) {
  const t = z(e);
  if (!t) return null;
  const r = nn().filter((o) => z(ac(o)) === t).map((o) => te(o)).find(v) ?? null;
  if (r) return r;
  const a = game.actors?.find?.((o) => v(o) && z(o.name) === t);
  return v(a) ? a : null;
}
function nn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function ac(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : te(e)?.name ?? null;
}
function z(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function v(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function an(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function oc(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function sc(e, t) {
  const r = P.get(e);
  r && (r.resistanceRollResult = t);
}
async function ic(e, t, r) {
  const n = ke(e);
  if (n)
    try {
      const a = D(n), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: r
      }, await Y(n, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function ke(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return N(n?.get?.(r));
}
async function cc(e, t) {
  const r = e.getAttribute(Re);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    on(e, e.getAttribute(it) ?? "✓ Automação aplicada"), uc(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function on(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Qr), e.removeAttribute(Re), e.removeAttribute(it);
}
function uc(e) {
  const t = e.getAttribute(Ve);
  if (!t) return;
  const r = e.closest(`.${f}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${Ve}="${Q(t)}"]`;
  for (const a of r.querySelectorAll(n)) {
    if (a === e) continue;
    const o = a.getAttribute(xr) ?? "✓ Outra opção escolhida";
    on(a, o);
  }
}
function sn(e, t) {
  const r = e.map(lt).filter(Mc), n = r.find((l) => l.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const a = b(e, "Forma"), o = b(e, "Custo"), s = b(e, "Dados") ?? b(e, `Dados (${n.label})`), i = b(e, "Tipo"), d = b(e, "Resistência"), p = b(e, "Resistência Perícia"), y = b(e, "Resistência Rótulo") ?? (p ? Ur(p) : null), A = cn(e, "Observação"), R = e.filter((l) => mc(l, n)), T = lc(e);
  return {
    ...n,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: a,
    cost: o,
    diceBreakdown: s,
    damageType: i,
    resistance: d,
    resistanceSkill: p,
    resistanceSkillLabel: y,
    notes: A,
    details: R,
    castingCheck: T,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function lc(e) {
  const t = e.map(lt).find((o) => o?.intent === "casting") ?? null, r = b(e, "Conjuração DT"), n = b(e, "Conjuração Resultado");
  if (!t || !r || !n) return null;
  const a = Number(r);
  return Number.isFinite(a) ? {
    label: t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: n.toLowerCase() === "sucesso",
    diceBreakdown: b(e, "Dados (Conjuração)")
  } : null;
}
function lt(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, n, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: r,
    formula: n,
    total: o,
    intent: dc(r)
  } : null;
}
function dc(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function b(e, t) {
  return cn(e, t)[0] ?? null;
}
function cn(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const a = n.slice(r.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function mc(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || lt(e) ? !1 : e.trim().length > 0;
}
function fc(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of P.values())
    Qe(n, e, t) && r.set(n.pendingId, n);
  for (const n of Ac(e))
    Qe(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, a) => n.createdAt - a.createdAt);
}
function Qe(e, t, r) {
  const n = M(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !Zt(r, "itemId", e.itemId) ? !1 : !e.actorId || Zt(r, "actorId", e.actorId);
}
function Zt(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${Bc(t)}`;
  for (const a of e.querySelectorAll(`[${n}]`))
    if (a.getAttribute(n) === r)
      return !0;
  return !1;
}
function pc(e) {
  const t = Q(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function gc(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Qe(e, null, t))
      return t;
  return null;
}
function hc() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of P.entries())
    e - n.createdAt > t && P.delete(r);
}
async function Jt(e, t) {
  const r = ke(e);
  if (!r) return !1;
  try {
    const n = D(r);
    return n[t.pendingId] = ft(t, M(r)), await Y(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function dt(e) {
  const t = mn(e);
  if (!t) return !1;
  try {
    const r = D(t);
    return r[e.pendingId] = ft(e, M(t)), await Y(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function un(e) {
  for (const t of ki)
    globalThis.setTimeout(() => {
      Xe(e);
    }, t);
}
async function Xe(e) {
  const t = mn(e);
  if (mt(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const n = await dt(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function yc(e, t) {
  const r = dn(e.context.message);
  if (r)
    try {
      const n = D(r), a = n[e.pendingId] ?? ft(e, M(r));
      n[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Y(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function Ac(e) {
  return Object.values(D(N(e))).filter(ae);
}
function D(e) {
  if (!e) return {};
  const t = {}, r = mt(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, a] of Object.entries(ln(e)))
    t[n] ??= a;
  return t;
}
function Rc(e) {
  return Object.values(ln(N(e))).filter(ae);
}
function ln(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, Br);
  if (!W(t))
    return {};
  const r = {};
  for (const [n, a] of Object.entries(t))
    ae(a) && (r[n] = a);
  return r;
}
async function Y(e, t) {
  typeof e.setFlag == "function" && (await bc(e, t), await kc(e, t));
}
async function kc(e, t) {
  await Promise.resolve(e.setFlag?.(u, Br, t));
}
function mt(e) {
  if (!e) return null;
  const t = e.getFlag?.(u, jr);
  return Dc(t) ? t : null;
}
async function bc(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(ae).sort((o, s) => o.createdAt - s.createdAt);
  if (r.length === 0) return;
  const n = r[0];
  if (!n) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...r.map((o) => o.createdAt)),
    messageId: n.messageId ?? M(e) ?? null,
    source: {
      actorId: n.actorId,
      actorName: Tc(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(u, jr, a));
}
function Tc(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function ft(e, t) {
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
function dn(e) {
  const t = N(e);
  if (t?.setFlag)
    return t;
  const r = wc(e);
  if (r?.setFlag)
    return r;
  const n = M(e);
  if (!n) return null;
  const a = game.messages;
  return N(a?.get?.(n));
}
function wc(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(N).find((r) => typeof r?.setFlag == "function") ?? null;
}
function mn(e) {
  const t = dn(e.context.message);
  if (t) return t;
  const r = e.messageId ? Cc(e.messageId) : null;
  if (r) return r;
  const n = gn().slice().reverse();
  return n.find((a) => $c(a, e)) ?? n.find((a) => Pc(a, e)) ?? null;
}
function Cc(e) {
  const t = game.messages;
  return N(t?.get?.(e));
}
function $c(e, t) {
  const r = M(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!fn(e, t)) return !1;
  const a = pn(e);
  return !t.actorId || !a || a === t.actorId;
}
function Pc(e, t) {
  if (!Sc(e, t)) return !1;
  const r = pn(e);
  return t.actorId && r === t.actorId ? !0 : fn(e, t);
}
function fn(e, t) {
  const r = z(Ic(e));
  if (!r) return !1;
  const n = z(t.itemName);
  if (n && r.includes(n)) return !0;
  const a = z(t.itemId);
  return !!(a && r.includes(a));
}
function Ic(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function pn(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Sc(e, t) {
  const r = Ec(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= bi;
}
function Ec(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function N(e) {
  return e && typeof e == "object" ? e : null;
}
function ae(e) {
  return W(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && w(e.messageId) && w(e.itemId) && w(e.actorId) && w(e.itemName) && j(e.resistanceTargetActorId) && j(e.resistanceTargetName) && Lc(e.resistanceRollResult) && _c(e.actionPayload) && ve(e.title) && ve(e.buttonLabel) && ve(e.executedLabel) && j(e.choiceGroupId) && j(e.skippedLabel) && j(e.actionSectionId) && j(e.actionSectionTitle) && Oc(e.summaryLines) : !1;
}
function _c(e) {
  return e == null ? !0 : W(e) ? e.kind === "resource-operation" && w(e.actorId) && w(e.actorUuid) && typeof e.actorName == "string" && vc(e.resource) && Nc(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function vc(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Nc(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Dc(e) {
  return W(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && w(e.messageId) && W(e.source) && w(e.source.actorId) && w(e.source.actorName) && w(e.source.itemId) && w(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ae) : !1;
}
function Lc(e) {
  return e == null ? !0 : W(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && j(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Mc(e) {
  return e !== null;
}
function W(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function w(e) {
  return e === null || typeof e == "string";
}
function ve(e) {
  return e === void 0 || typeof e == "string";
}
function j(e) {
  return e == null || typeof e == "string";
}
function Oc(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Fc(e) {
  return typeof e == "string" && e.length > 0;
}
function gn() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(N).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(N).filter((n) => n !== null) : [];
}
function be(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function M(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function Uc(e) {
  return e.trim().toLowerCase();
}
function Bc(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Q(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const er = 1e3;
class jc {
  constructor(t, r, n, a) {
    this.workflow = t, this.resources = r, this.debugOutput = a, this.ritualAssistant = new Ss(t, r, n);
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
      settings: bt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = bt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = Je(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && xc(t.item) && r.executionMode === "ask") {
        await this.handleGenericRitual(t);
        return;
      }
      const a = n.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, a, n.error.reason), n.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: n.error.message,
        data: n.error
      });
      return;
    }
    if (await Ot(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: De(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await _e(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const n = await this.ritualAssistant.applyAction(r.action);
    return n.ok ? (r.workflowContext.resourceTransactions.push(n.value), this.pendingExecutions.delete(t), await _e(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(n), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = ut(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, a = Gc(n);
    if (!a)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const o = await de(this.resources, a, n.resource, n.operation, n.amount);
    return o.ok ? (await $i(t), await Pi(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (wi((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await Ot(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: De(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, Hc(t.item));
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
        await this.registerCompletedRitualCard(t, n.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), c.info("Ritual assistido concluído sem ações pendentes.", x(n.workflowContext));
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
      o.kind === "resource-action" && (this.pendingExecutions.delete(a), await _e(
        a,
        o.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, r) {
    const n = Le();
    await Ci({
      pendingId: n,
      context: t,
      mode: "ask",
      title: "Paranormal Toolkit · Ritual",
      buttonLabel: "Ritual conjurado",
      executedLabel: "✓ Ritual conjurado",
      actionSectionId: "ritual-log",
      actionSectionTitle: "Registro",
      summaryLines: r
    });
  }
  async registerAssistedResourceActions(t, r, n, a) {
    let o;
    for (const s of n) {
      const i = Le();
      o ??= i, this.pendingExecutions.set(i, {
        kind: "resource-action",
        id: i,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await Yt({
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
        actionPayload: Vc(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", o), c.info("Ritual assistido preparado com ações pendentes.", x(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = Le();
    this.pendingExecutions.set(n, {
      kind: "workflow",
      id: n,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Yt({
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
    this.setAttempt(t, "completed"), c.info("Automação executada por uso normal de item.", x(a.value.context));
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
    const r = Date.now(), n = tr(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      r - s > er && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(n);
    return a !== void 0 && r - a <= er;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(tr(t), Date.now());
  }
  setAttempt(t, r, n, a) {
    this.lastAttempt = De(t, r, n, a);
  }
}
function xc(e) {
  return e.type === "ritual";
}
function Hc(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Vc(e) {
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
function Gc(e) {
  const t = e.actorUuid ? qc(e.actorUuid) : null;
  if (K(t)) return t;
  const r = e.actorId ? zc(e.actorId) : null;
  return r || Wc(e.actorName);
}
function qc(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function zc(e) {
  const r = game.actors?.get?.(e);
  if (K(r)) return r;
  for (const n of hn()) {
    const a = pt(n);
    if (a?.id === e) return a;
  }
  return null;
}
function Wc(e) {
  const t = Ne(e);
  if (!t) return null;
  for (const a of hn()) {
    const o = Kc(a);
    if (Ne(o) === t) {
      const s = pt(a);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((a) => K(a) && Ne(a.name) === t);
  return K(n) ? n : null;
}
function hn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Kc(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : pt(e)?.name ?? null;
}
function pt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (K(t)) return t;
  const r = e.document?.actor;
  return K(r) ? r : null;
}
function Ne(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function K(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function De(e, t, r, n) {
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
function tr(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function Le() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Yc {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], a = [], o = ne(t);
    for (const s of r) {
      const i = s.itemId ? o.find((y) => y.id === s.itemId) ?? null : null, d = s.match?.preset ?? null;
      if (!i || !d) {
        a.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(i, d);
      const p = await this.itemPatches.applyPresetItemPatch(i, d);
      n.push({
        itemId: i.id ?? null,
        itemName: i.name ?? "Ritual sem nome",
        presetId: d.id,
        presetLabel: d.label,
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
class Qc {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = ne(t).map((i) => this.analyzeRitual(i)), n = r.filter(ue("upToDate")), a = r.filter(ue("available")), o = r.filter(ue("outdated")), s = r.filter(ue("unsupported"));
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
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = Xc(t);
    return r ? n ? n.source.type !== "preset" ? X({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Automação manual encontrada. Preset sugerido: ${r.preset.label}.`
    }) : n.source.presetId === r.preset.id && n.source.presetVersion === r.preset.version ? X({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Preset ${r.preset.label} v${r.preset.version} já aplicado.`
    }) : X({
      ritual: t,
      status: "outdated",
      match: r,
      flag: n,
      reason: Zc(n, r.preset)
    }) : X({
      ritual: t,
      status: "available",
      match: r,
      flag: n,
      reason: `Preset encontrado: ${r.preset.label}.`
    }) : X({
      ritual: t,
      status: "unsupported",
      match: r,
      flag: n,
      reason: n ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function X(e) {
  const t = e.flag?.source, r = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? ge(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function Xc(e) {
  const t = e.getFlag(u, "automation");
  return et(t) ? t : null;
}
function Zc(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function ue(e) {
  return (t) => t.status === e;
}
class Jc {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), n = rt(t.transaction);
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
    const n = this.createWorkflowSummaryContent(t, r), a = x(t);
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
    const r = h(t.actorName), n = h(t.resource), a = h(rr(t)), o = h(tu(t));
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
    const n = h(r.title ?? "Automação"), a = r.message ? `<p>${h(r.message)}</p>` : "", o = h(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = h(t.item.name ?? "Item sem nome"), i = t.targets.length > 0 ? t.targets.map((l) => h(l.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (l) => `<li><strong>${h(l.id)}:</strong> ${h(l.formula)} = ${l.total} <em>(${h(eu(l.intent))})</em>${l.damageType ? ` — ${h(l.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (l) => `<li><strong>${h(l.itemName)}:</strong> ${l.circle}º círculo — ${l.amount} ${h(l.resource)} (${h(ru(l.source))})</li>`
    ), y = t.damageInstances.map(
      (l) => `<li><strong>${h(l.targetActorName)}:</strong> bruto ${l.rawAmount}${l.damageType ? ` ${h(l.damageType)}` : ""} &rarr; final ${l.finalAmount} &rarr; aplicado ${l.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (l) => `<li><strong>${h(l.targetActorName)}:</strong> bruto ${l.rawAmount} &rarr; final ${l.finalAmount} &rarr; aplicado ${l.appliedAmount}</li>`
    ), R = t.resourceTransactions.map(
      (l) => `<li><strong>${h(l.actorName)}:</strong> ${h(rr(l))} — ${l.before.value}/${l.before.max} &rarr; ${l.after.value}/${l.after.max}</li>`
    ), T = t.phases.map((l) => h(l)).join(" &rarr; ");
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
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Cura:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${T}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function eu(e) {
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
function rr(e) {
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
function tu(e) {
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
function ru(e) {
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
function nu() {
  const e = new ja(), t = new Mo(e), r = new Va(), n = new za(r), a = new so(e), o = new co(), s = o.registerMany(Yn());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new io(), d = new ao(), p = new Qc(o), y = new Yc(p, i, d), A = new Bo(), R = new Jc(A), T = new Uo(), l = new Do(t, n, R, T), I = new Fo(l, T), Te = new jc(I, t, n, A);
  return Te.addStrategy(new ro((Rn) => Te.handleItemUsed(Rn))), {
    ordem: a,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: n,
    resources: t,
    automationRegistry: o,
    automationBinder: i,
    itemPatches: d,
    debugOutput: A,
    chatMessages: R,
    workflowHooks: T,
    automation: l,
    workflow: I,
    itemUseIntegration: Te,
    ritualPresetDiagnostic: p,
    ritualPresetApplications: y
  };
}
const { ApplicationV2: au } = foundry.applications.api;
class fe extends au {
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
      apply: fe.onApply,
      cancel: fe.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${S(Ze)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${S(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Me("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Me("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Me("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Me(e, t, r, n) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${n}"></i>
        <span>${S(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? ou(r) : iu(t)}
    </section>
  `;
}
function ou(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(su).join("")}</ol>`;
}
function su(e) {
  const t = e.preset, r = t ? `${t.label} v${t.version}` : "Sem preset", n = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${S(e.appliedPresetId)} v${S(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${S(e.itemName)}</strong>
        <span>${S(e.reason)}</span>
        ${n}
      </div>
      <em>${S(r)}</em>
    </li>
  `;
}
function iu(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${S({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function S(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const pe = `${u}.manageRitualPresets`, nr = `__${u}_ritualPresetHeaderControlRegistered`, cu = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function uu(e) {
  const t = globalThis;
  if (!t[nr]) {
    for (const r of cu)
      Hooks.on(r, (n, a) => {
        lu(n, a, e);
      });
    t[nr] = !0, c.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function lu(e, t, r) {
  Array.isArray(t) && mu(e) && (du(e, r), !t.some((n) => n.action === pe) && t.push({
    action: pe,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), yn(e, r);
    }
  }));
}
function du(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[pe] && (e.options.actions[pe] = (r) => {
    r.preventDefault(), r.stopPropagation(), yn(e, t);
  }));
}
function mu(e) {
  if (!game.user?.isGM) return !1;
  const t = An(e);
  return t ? t.type === "agent" && ne(t).length > 0 : !1;
}
function yn(e, t) {
  const r = An(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new fe(r, t).render({ force: !0 });
}
function An(e) {
  return ar(e.actor) ? e.actor : ar(e.document) ? e.document : null;
}
function ar(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let V = null;
Hooks.once("init", () => {
  zn(), ga(), Ua(), c.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!wt.isSupportedSystem()) {
    c.warn(
      `Sistema não suportado: ${wt.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  V = nu(), V.itemUseIntegration.registerStrategies(), Ca(V), Ma(), va(), uu(V), c.info("Inicializado para o sistema Ordem Paranormal."), c.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Ze} inicializado.`);
});
function fu() {
  if (!V)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return V;
}
export {
  fu as getToolkitServices
};
//# sourceMappingURL=main.js.map
