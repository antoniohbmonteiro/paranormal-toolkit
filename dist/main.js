const u = "paranormal-toolkit", Ye = "Paranormal Toolkit", gn = "ordemparanormal";
class te {
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
function Qe(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? d({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Xe(t) ? g(t.definition) : d({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function hn(e) {
  return Xe(e.getFlag(u, "automation"));
}
function Xe(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && An(t.source) && yn(t.definition);
}
function yn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(Rn);
}
function An(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function Rn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return bn(t);
    case "spendRitualCost":
      return Tn(t);
    case "rollFormula":
      return kn(t);
    case "modifyResource":
      return wn(t);
    case "chatCard":
      return Pn(t);
    default:
      return !1;
  }
}
function bn(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && tr(t);
}
function Tn(e) {
  return e.type === "spendRitualCost";
}
function kn(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || Sn(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function wn(e) {
  const t = e;
  return t.type === "modifyResource" && $n(t.actor) && In(t.resource) && Cn(t.operation) && tr(t);
}
function Pn(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function tr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function $n(e) {
  return e === "self" || e === "target";
}
function In(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Cn(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Sn(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function Ze(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(ft);
    if (vn(t))
      return Array.from(t).filter(ft);
  }
  return [];
}
function En(e) {
  return Ze(e)[0] ?? null;
}
function _n(e) {
  return Ze(e).find(hn) ?? null;
}
function vn(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function ft(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function re(e) {
  return Ze(e).filter((t) => t.type === "ritual");
}
function rr(e) {
  return re(e)[0] ?? null;
}
function Nn(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(pe);
      return c.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = X("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = ae(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(ht);
      return c.info(`Presets encontrados para ${r.name}.`, n), n;
    },
    async applyPresetToFirstRitual(t) {
      const r = X("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const n = ae(r);
      if (!n) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await Le(e, n, a.value);
      c.info(`Preset ${a.value.id} aplicado em ${n.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = X("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = ae(t);
      if (!r) return;
      const n = e.automationRegistry.findForItem(r)[0];
      if (!n) {
        c.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const a = await Le(e, r, n.preset);
      c.info(`Melhor preset aplicado em ${r.name}.`, { match: ht(n), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return pt(e);
    },
    async applyBestPresetsToActorRituals() {
      return pt(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = X("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = ae(t);
      r && (await e.automationBinder.clear(r), c.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function pt(e) {
  const t = X("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = re(t);
  if (r.length === 0)
    return c.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), gt(t);
  const n = gt(t, r.length);
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
    const s = await Le(e, a, o.preset);
    n.applied.push(Ln(a, o, s));
  }
  return c.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), Dn(n), n;
}
async function Le(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function Ln(e, t, r) {
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
function gt(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Dn(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((n) => n.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function ht(e) {
  return {
    preset: pe(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function X(e) {
  const t = te.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ae(e) {
  const t = rr(e);
  return t || (c.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function U(e) {
  return e ? {
    id: e.id,
    source: {
      ...Mn(e.sourceActor),
      token: e.sourceToken
    },
    item: On(e.item),
    targets: e.targets.map(Fn),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: yt(e.rollRequests, nr),
    rolls: yt(e.rolls, Un),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Je),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Je(e) {
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
function Mn(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function On(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Fn(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function nr(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Un(e) {
  return {
    ...nr(e),
    total: e.total
  };
}
function yt(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function Bn(e) {
  return {
    getSelected() {
      return te.getSelectedActor();
    },
    logResources() {
      const t = L(
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
        L("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await H(
        e,
        "Gasto de PD",
        L("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await H(
        e,
        "Dano em PV",
        L("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await H(
        e,
        "Cura de PV",
        L("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await H(
        e,
        "Dano em SAN",
        L("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await H(
        e,
        "Recuperação de SAN",
        L("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function H(e, t, r, n) {
  if (!r) return;
  const a = await n(r);
  if (!a.ok) {
    xn(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    c.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  c.info(`${t} realizado:`, Je(o));
}
function L(e) {
  const t = te.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function xn(e) {
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
const C = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Hn() {
  oe(C.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), oe(C.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), oe(C.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), oe(C.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function De() {
  return {
    enabled: se(C.enabled),
    console: se(C.console),
    ui: se(C.ui),
    chat: se(C.chat)
  };
}
async function v(e, t) {
  await game.settings.set(u, C[e], t);
}
function oe(e, t) {
  game.settings.register(u, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function se(e) {
  return game.settings.get(u, e) === !0;
}
function jn() {
  return {
    status() {
      return De();
    },
    async enable() {
      await v("enabled", !0);
    },
    async disable() {
      await v("enabled", !1);
    },
    async enableConsole() {
      await v("console", !0);
    },
    async disableConsole() {
      await v("console", !1);
    },
    async enableUi() {
      await v("ui", !0);
    },
    async disableUi() {
      await v("ui", !1);
    },
    async enableChat() {
      await v("chat", !0);
    },
    async disableChat() {
      await v("chat", !1);
    }
  };
}
const ar = "ritual.costOnly", or = "ritual.simpleHealing", Vn = "ritual.eletrocussao", sr = "ritual.simpleDamage", ir = "generic.simpleHealing", cr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Gn() {
  return [
    qn(),
    zn(),
    Wn(),
    Kn(),
    Yn()
  ];
}
function qn() {
  return {
    id: ar,
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
function zn() {
  return {
    id: or,
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
    automation: ur(),
    itemPatch: Xn()
  };
}
function Wn() {
  return {
    id: Vn,
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
    automation: Qn(),
    itemPatch: Zn()
  };
}
function Kn() {
  return {
    id: sr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: et()
  };
}
function Yn() {
  return {
    id: ir,
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
function ur(e = "2d8+2") {
  return lr(
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
function Qn() {
  return {
    ...et("1d8", {
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
function et(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return lr(
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
function Xn() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: cr,
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
function Zn() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: cr,
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
function lr(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((n) => n.type !== "rollFormula" || n.id !== t ? n : {
      ...n,
      formula: r
    })
  };
}
function tt() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: V(t.id),
    actorId: V(t.actor?.id),
    sceneId: V(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function dr() {
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
function Jn(e) {
  return {
    logFirstRitualCost() {
      const t = D("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const r = M(t);
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
      const n = D("Nenhum ator encontrado para configurar custo customizado.");
      if (!n) return;
      const a = M(n);
      if (a) {
        if (!ra(t, r)) {
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
      const t = D("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = M(t);
      r && (await r.unsetFlag(u, "ritual.cost"), c.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = D("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = M(t);
      if (!r) return;
      const n = e.automationRegistry.require(ar);
      if (!n.ok) {
        c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value), c.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = D("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const n = M(r);
      if (!n) return;
      if (!At(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(or);
      if (!a.ok) {
        c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, a.value, {
        definition: ur(t)
      }), c.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = D("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = M(r);
      if (!n) return;
      if (!At(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(sr);
      if (!a.ok) {
        c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, a.value, {
        definition: et(t)
      }), c.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = D("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = M(t);
      r && await ea(e, t, r);
    }
  };
}
async function ea(e, t, r) {
  const n = Qe(r);
  if (!n.ok) {
    c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: dr(),
    item: r,
    targets: tt()
  });
  if (!a.ok) {
    ta(a.error);
    return;
  }
  c.info("Automação de ritual executada com sucesso.", U(a.value.context));
}
function ta(e) {
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
function D(e) {
  const t = te.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function M(e) {
  const t = rr(e);
  return t || (c.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ra(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function At(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const na = ["disabled", "ask", "automatic"], aa = ["buttons", "confirm"], mr = "ask";
function oa(e) {
  return typeof e == "string" && na.includes(e);
}
function sa(e) {
  return typeof e == "string" && aa.includes(e);
}
function ia(e) {
  return oa(e) ? e : sa(e) ? "ask" : mr;
}
const ca = ["keep", "replace"], fr = "keep", B = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled"
};
function ua() {
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
    default: mr
  }), game.settings.register(u, B.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: fr
  }), game.settings.register(u, B.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Rt() {
  const e = ia(game.settings.get(u, B.executionMode)), t = pr(game.settings.get(u, B.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t
  };
}
function la() {
  return pr(game.settings.get(u, B.systemCardMode));
}
async function O(e) {
  await game.settings.set(u, B.executionMode, e);
}
function pr(e) {
  return ca.includes(e) ? e : fr;
}
function da(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await O("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await O("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await O(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await O("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await O("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await O("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await O("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const ma = [
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
function fa(e) {
  return {
    phases() {
      return ma;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Te("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = _n(t);
      if (!r) {
        c.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await bt(e, t, r);
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
      if (!ha(r)) {
        c.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = ga(r) ?? Te("Nenhum ator encontrado para executar automação do item.");
      n && await bt(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Te("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = En(t);
      if (!r) {
        c.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(ir);
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
async function bt(e, t, r) {
  const n = Qe(r);
  if (!n.ok) {
    c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: dr(),
    item: r,
    targets: tt()
  });
  if (!a.ok) {
    pa(a.error);
    return;
  }
  c.info("Automação executada com sucesso.", U(a.value.context));
}
function pa(e) {
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
  const t = te.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ga(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ha(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ya(e) {
  const t = Bn(e), r = Nn(e), n = Jn(e), a = fa(e), o = jn(), s = da(e);
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
function Aa(e) {
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
    debug: ya(e)
  }, r = globalThis;
  return r[u] = t, r.ParanormalToolkit = t, t;
}
class Tt {
  static isSupportedSystem() {
    return game.system.id === gn;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Ra() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: G(t.id),
    actorId: G(t.actor?.id),
    sceneId: G(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function gr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, r = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: G(e.id),
    actorId: G(t?.id),
    sceneId: G(e.scene?.id),
    name: r
  };
}
function ba(e, t = gr()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Ta(e) {
  if (!Pa(e)) return null;
  const t = e.getFlag(u, "workflow");
  return wa(t) ? t : null;
}
function ka() {
  return `flags.${u}.workflow`;
}
function kt(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), r = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || r !== void 0;
}
function wt(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Me(t) || Me(r);
}
function wa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Pa(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function G(e) {
  return Me(e) ? e : null;
}
function Me(e) {
  return typeof e == "string" && e.length > 0;
}
function $a() {
  const e = (t, r) => {
    Ia(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Ia(e, t) {
  const r = Ta(e);
  if (!r || r.targets.length === 0) return;
  const n = Sa(t);
  if (!n || n.querySelector(`.${u}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(Ca(r));
}
function Ca(e) {
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
function Sa(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ea() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!_a(n) || !va(e) || kt(e) || kt(t)) return;
    const a = Ra();
    if (a.length === 0 || !wt(e) && !wt(t)) return;
    const o = gr();
    e.updateSource({
      [ka()]: ba(a, o)
    }), c.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function _a(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function va(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const hr = {
  enabled: "dice.animations.enabled"
};
function Na() {
  game.settings.register(u, hr.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function La() {
  return {
    enabled: game.settings.get(u, hr.enabled) === !0
  };
}
const Z = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, yr = {
  PV: "system.attributes.hp"
}, Oe = {
  PV: [Z.PV, yr.PV],
  SAN: [Z.SAN],
  PE: [Z.PE],
  PD: [Z.PD]
}, Fe = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Da {
  getResource(t, r) {
    const n = $t(t, r);
    if (!n.ok)
      return d(n.error);
    const a = n.value, o = `${a}.value`, s = `${a}.max`, i = foundry.utils.getProperty(t, o), l = foundry.utils.getProperty(t, s), p = Ct(t, r, o, i, "valor atual");
    if (p) return d(p);
    const y = Ct(t, r, s, l, "valor máximo");
    return y ? d(y) : g({
      value: i,
      max: l
    });
  }
  async updateResourceValue(t, r, n) {
    const a = $t(t, r);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: n });
  }
}
function $t(e, t) {
  const r = Ma(e.type, t);
  if (r && It(e, r))
    return g(r);
  const n = Oe[t].find(
    (a) => It(e, a)
  );
  return n ? g(n) : d({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Oa(e, t),
    path: Oe[t].join(" | ")
  });
}
function Ma(e, t) {
  return e === "threat" ? yr[t] ?? null : e === "agent" ? Z[t] : null;
}
function It(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function Oa(e, t) {
  const r = e.type ?? "unknown", n = Oe[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function Ct(e, t, r, n, a) {
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
class Fa {
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
      const s = Fe.ritualItem.circleCandidates;
      return d({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: n, value: a } = r, o = Ua(a);
    return o ? g(o) : d({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${n}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: n,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of Fe.ritualItem.circleCandidates) {
      const n = foundry.utils.getProperty(t, r);
      if (n != null)
        return { path: r, value: n };
    }
    return null;
  }
}
function Ua(e) {
  if (St(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (St(r))
      return r;
  }
  return null;
}
function St(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Ba = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class xa {
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
    const n = r.value, a = Ha(t.ritual, n);
    return a.ok ? a.value ? g(a.value) : g({
      resource: "PE",
      amount: Ba[n],
      source: "default-by-circle",
      circle: n
    }) : d(a.error);
  }
}
function Ha(e, t) {
  const r = e.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : ja(r) ? {
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
function ja(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const ke = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Va(e) {
  if (!Ya(e.item)) return null;
  const t = Ue(e.actor) ? e.actor : Ga(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: za(e.token) ?? qa(t),
    targets: tt(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Ga(e) {
  const t = e;
  return Ue(t.actor) ? t.actor : Ue(e.parent) ? e.parent : null;
}
function qa(e) {
  const t = Wa(e) ?? Ka(e);
  return t ? Ar(t) : null;
}
function za(e) {
  return Be(e) ? Ar(e) : null;
}
function Wa(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return Be(r) ? r : (t.getActiveTokens?.() ?? []).find(Be) ?? null;
}
function Ka(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Ar(e) {
  const t = e.actor ?? null;
  return {
    tokenId: we(e.id),
    actorId: we(t?.id),
    sceneId: we(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Ya(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ue(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Be(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function we(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Qa {
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
    const r = Va(Xa(t));
    if (!r) {
      c.warn(`${ke.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function Xa(e) {
  return e && typeof e == "object" ? e : {};
}
class Za {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return Pe("missing-item-patch");
    if (t.type !== "ritual") return Pe("unsupported-item-type");
    const a = Ja(n);
    return Object.keys(a).length === 0 ? Pe("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function Ja(e) {
  const t = {};
  R(t, "name", e.name), R(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (R(t, "system.circle", r.circle), R(t, "system.element", r.element), R(t, "system.target", r.target), R(t, "system.targetQtd", r.targetQuantity), R(t, "system.execution", r.execution), R(t, "system.range", r.range), R(t, "system.duration", r.duration), R(t, "system.skillResis", r.resistanceSkill), R(t, "system.resistance", r.resistance), R(t, "system.studentForm", r.studentForm), R(t, "system.trueForm", r.trueForm)), t;
}
function R(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function Pe(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class eo {
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
    return this.getNumber(t, Fe.ritual.dt, 0);
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
class to {
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
class ro {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = no(t);
    return r.ok ? this.presets.has(t.id) ? d({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, $e(t)), g(t)) : r;
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
    return r ? $e(r) : null;
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
    return Array.from(this.presets.values()).map($e);
  }
  findForItem(t) {
    return this.list().map((r) => ao(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function no(e) {
  return !Ie(e.id) || !Ie(e.version) || !Ie(e.label) ? d({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? d({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : g(e);
}
function ao(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = oo(a, t);
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
function oo(e, t) {
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
      const r = Et(t.name), n = e.names.map(Et).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = so(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function Et(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function so(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function $e(e) {
  return structuredClone(e);
}
function Ie(e) {
  return typeof e == "string" && e.length > 0;
}
function ue(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? d({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : g(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = ge(e.amountFrom);
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
function ge(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const io = "dice-so-nice";
async function co(e) {
  if (!La().enabled || !uo()) return;
  const t = lo();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      c.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function uo() {
  return game.modules.get(io)?.active === !0;
}
function lo() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function mo(e, t, r) {
  if (!_t(e.id) || !_t(e.formula))
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
    await co(a);
    const i = {
      ...r.rollRequests[e.id] ?? Rr(e, t),
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
function Rr(e, t) {
  const r = e.intent ?? fo(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function fo(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function _t(e) {
  return typeof e == "string" && e.length > 0;
}
async function le(e, t, r, n, a) {
  switch (n) {
    case "spend":
      return r !== "PE" && r !== "PD" ? ie(t, r, n, a) : e.spend(t, r, a);
    case "damage":
      return r !== "PV" && r !== "SAN" ? ie(t, r, n, a) : e.damage(t, r, a);
    case "heal":
      return r !== "PV" ? ie(t, r, n, a) : e.heal(t, r, a);
    case "recover":
      return r !== "SAN" ? ie(t, r, n, a) : e.recover(t, r, a);
  }
}
function ie(e, t, r, n) {
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
function po(e) {
  const { step: t, context: r, transaction: n, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = go(t, r, n, a);
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
    const s = ho(t, r, n, a);
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
function go(e, t, r, n) {
  const a = ge(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: br(t.id, "damage", n, t.damageInstances.length),
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
function ho(e, t, r, n) {
  const a = ge(e.amountFrom);
  return {
    id: br(t.id, "healing", n, t.healingInstances.length),
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
function br(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function yo(e, t, r) {
  const n = ge(e.amountFrom), a = n ? t.rolls[n] : void 0;
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
function Ao(e) {
  const { step: t, context: r, stepIndex: n, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", r, { stepIndex: n, step: t, metadata: a }), Tr("before", e), vt("before", e), vt("resolve", e);
}
function Ro(e) {
  const { step: t, context: r, stepIndex: n, metadata: a, lifecycle: o } = e;
  o.emit("apply", r, { stepIndex: n, step: t, metadata: a }), Tr("apply", e);
}
function bo(e) {
  const { step: t, context: r, stepIndex: n, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", r, { stepIndex: n, step: t, metadata: a });
}
function Tr(e, t) {
  const { step: r, context: n, stepIndex: a, metadata: o, lifecycle: s } = t, i = To(e, r.operation);
  i && s.emit(i, n, {
    stepIndex: a,
    step: r,
    metadata: o
  });
}
function vt(e, t) {
  const { step: r, context: n, stepIndex: a, metadata: o, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: a,
    step: r,
    metadata: o
  });
}
function To(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function ko(e, t, r) {
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
async function wo(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Po(e, t);
    case "spendRitualCost":
      return $o(e, t);
  }
}
async function Po(e, t) {
  const { context: r, resources: n } = e, a = ue(t, r);
  return a.ok ? kr(await n.spend(r.sourceActor, t.resource, a.value), r) : d(a.error);
}
async function $o(e, t) {
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
  }), kr(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function kr(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), g(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), d({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Io(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: a, execute: o } = e, s = Co(t);
  for (const l of s.before)
    a.emit(l, r, { stepIndex: n, step: t });
  const i = await o();
  if (!i.ok)
    return i;
  for (const l of s.after)
    a.emit(l, r, { stepIndex: n, step: t });
  return i;
}
function Co(e) {
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
class So {
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
        return Io({
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
    const a = await wo({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? g(void 0) : d({ ...a.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const a = Rr(t, n);
    r.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, r, n, t);
    const o = await this.runRollFormulaStep(t, r, n);
    if (!o.ok)
      return o;
    const s = r.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, r, n, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: a, rollResult: s }), g(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const a = await mo(t, n, r);
    return a.ok ? g(void 0) : d({ ...a.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const a = ue(t, r);
    if (!a.ok)
      return d({ ...a.error, stepIndex: n, step: t, context: r });
    const o = yo(t, r, a.value);
    Ao({
      step: t,
      context: r,
      stepIndex: n,
      metadata: o,
      lifecycle: this.lifecycle
    }), Ro({
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
      const l = await le(this.resources, i, t.resource, t.operation, a.value), p = this.handleResourceOperationResult(l, r, n, t);
      if (!p.ok)
        return p;
      po({
        step: t,
        context: r,
        transaction: p.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return bo({
      step: t,
      context: r,
      stepIndex: n,
      metadata: o,
      lifecycle: this.lifecycle
    }), g(void 0);
  }
  async runModifyResourceStep(t, r, n) {
    const a = ue(t, r);
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
      const i = await le(this.resources, s, t.resource, t.operation, a.value), l = this.handleResourceOperationResult(i, r, n, t);
      if (!l.ok)
        return l;
    }
    return g(void 0);
  }
  async runChatCardStep(t, r, n) {
    const a = await ko(this.messages, t, r);
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
    const i = Eo(t, r.intent);
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
function Eo(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class _o {
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
function wr(e) {
  return {
    id: vo(),
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
function vo() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class No {
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
    return U(this.lastContext);
  }
  async runAutomation(t, r) {
    const n = wr(r);
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
class Lo {
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
class Do {
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
      whisper: Mo(),
      flags: {
        ...t.flags,
        [u]: {
          ...Oo(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && c.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = De();
    if (!n.enabled)
      return;
    const a = r.notification ?? Nt(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, a);
  }
  emitConsole(t, r) {
    const n = Nt(r);
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
function Nt(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Mo() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Oo(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const Fo = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Pr = `${u}-inline-roll-neutralized`, Uo = `${u}-inline-roll-notice`, rt = `data-${u}-inline-roll-neutralized`, Lt = `data-${u}-inline-roll-notice`, Bo = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Dt(e) {
  const t = Jo(e.message), r = await xo(e.message), n = Ho(t);
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
async function xo(e) {
  const t = Qo(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = jo(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await Xo(t, r.content), replacementCount: r.replacementCount };
}
function Ho(e) {
  const t = e ? Zo(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = $r(t);
  return r > 0 && Ir(Wo(t)), { replacementCount: r };
}
function jo(e) {
  const t = Vo(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = $r(r.content), a = t.replacementCount + n;
  return a === 0 ? { content: e, replacementCount: 0 } : (Ir(r.content), { content: r.innerHTML, replacementCount: a });
}
function Vo(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, a) => (t += 1, qo(a.trim()))), replacementCount: t };
}
function $r(e) {
  const t = Go(e);
  for (const r of t)
    r.replaceWith(zo(Ko(r)));
  return t.length;
}
function Go(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(Fo))
    r.getAttribute(rt) !== "true" && t.add(r);
  return Array.from(t);
}
function qo(e) {
  return `<span class="${Pr}" ${rt}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${es(e)}</span>`;
}
function zo(e) {
  const t = document.createElement("span");
  return t.classList.add(Pr), t.setAttribute(rt, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Ir(e) {
  if (e.querySelector?.(`[${Lt}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Uo), t.setAttribute(Lt, "true"), t.textContent = Bo, e.append(t);
}
function Wo(e) {
  return e.querySelector(".message-content") ?? e;
}
function Ko(e) {
  const r = e.getAttribute("data-formula") ?? Yo(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function Yo(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Qo(e) {
  return e && typeof e == "object" ? e : null;
}
async function Xo(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return c.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function Zo(e) {
  const t = ts(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Jo(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function es(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function ts(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Cr = ["base", "discente", "verdadeiro"];
function Sr(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function rs(e) {
  return typeof e == "string" && Cr.includes(e);
}
const { ApplicationV2: ns } = foundry.applications.api;
class J extends ns {
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
      cast: J.onCast,
      cancel: J.onCancel
    }
  };
  static async request(t) {
    return new Promise((r) => {
      new J(t, r).render({ force: !0 });
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
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${k(Ye)}</p>
        <div>
          <h2>${k(t)}</h2>
          <p>${k(ls(this.input.ritual))}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.input.variantOptions.map((o) => as(o, this.input.cost)).join("")}
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
          <div><dt>Custo base</dt><dd>${k(n)}</dd></div>
          <div><dt>Conjurador</dt><dd>${k(this.input.actor.name ?? "Ator sem nome")}</dd></div>
          <div><dt>Alvos</dt><dd>${k(r)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.input.automationStatus ?? "assisted"}">
        <h3>Automação</h3>
        ${ss(this.input)}
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
    const r = us(t), n = is(r, this.input.defaultSpendResource);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function as(e, t) {
  const r = e.variant === "base" ? "checked" : "", n = e.enabled ? "" : "disabled", a = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.finalCostText ?? os(t), s = [...e.details, e.enabled ? "" : e.unavailableReason ?? "não disponível neste ritual"].filter((i) => i.trim().length > 0).filter((i) => !i.toLocaleLowerCase().startsWith("custo final")).map((i) => `<span>${k(i)}</span>`).join("");
  return `
    <label class="paranormal-toolkit-ritual-cast__form${a}">
      <input type="radio" name="variant" value="${k(e.variant)}" ${r} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${k(e.label)}</strong>
        <em>${k(o)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${s}</span>
    </label>
  `;
}
function os(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function ss(e) {
  return e.automationStatus === "generic" ? `
      <p><strong>Sem automação configurada.</strong></p>
      <p>O Toolkit vai registrar a conjuração e gastar o recurso escolhido. Rolagens, dano, resistência e efeitos continuam manuais.</p>
    ` : `
    <p><strong>Automação assistida disponível.</strong></p>
    <p>O Toolkit vai preparar custo, rolagens e ações assistidas no card persistente do chat.</p>
  `;
}
function is(e, t) {
  const r = cs(e), n = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: n
  };
}
function cs(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return rs(t) ? t : "base";
}
function us(e) {
  return (e.currentTarget instanceof HTMLElement ? e.currentTarget : null)?.closest(".paranormal-toolkit-ritual-cast") ?? null;
}
function ls(e) {
  const t = e.system, r = [ms(t?.element), ds(t?.circle)].filter(fs);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function ds(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : `${e}º Círculo`;
}
function ms(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function fs(e) {
  return typeof e == "string" && e.length > 0;
}
function k(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function ps(e) {
  return J.request(e);
}
const Er = {
  label: "Padrão"
};
class gs {
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
    const n = this.resolveCostPreview(t), a = Bs(r, n), o = await ps({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((b) => b.name),
      cost: n,
      defaultSpendResource: qs(r),
      variantOptions: a,
      automationStatus: js(r) ? "generic" : "assisted"
    });
    if (!o)
      return { status: "cancelled" };
    const s = Gs(r, o.variant), i = hs(r, o, s, n);
    if (i.steps.length === 0) {
      const b = Vs(t, o);
      return {
        status: "completed-without-actions",
        workflowContext: b,
        summaryLines: Ot(r, o, s, n, b)
      };
    }
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
    const p = l.value.context, y = As(r, t, p), A = Ot(r, o, s, n, p);
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
    return le(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function hs(e, t, r, n) {
  const a = [];
  for (const o of e.steps)
    o.type === "modifyResource" || o.type === "chatCard" || at(o) && !t.spendResource || a.push(ys(o, r));
  return t.spendResource && n && zs(r.extraCost) && a.push({
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
function ys(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function As(e, t, r) {
  const n = [];
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const o = ue(a, r);
    if (!o.ok)
      return {
        ok: !1,
        reason: o.error.reason,
        message: o.error.message
      };
    const s = Cs(a.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(...Rs(e, a, i, o.value));
  }
  return { ok: !0, actions: n };
}
function Rs(e, t, r, n) {
  if (!ws(e, t))
    return [Mt(t, r, n)];
  const a = Is();
  return _r(e).map((o) => {
    const s = Ps(n, o);
    return Mt(t, r, s, {
      option: o,
      choiceGroupId: a
    });
  });
}
function Mt(e, t, r, n) {
  const a = t.name ?? "Ator sem nome", o = ks(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: bs(e, a, r, n?.option),
    executedLabel: Ts(e, a, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function bs(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function Ts(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function ks(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function ws(e, t) {
  return t.operation === "damage" && t.resource === "PV" && _r(e).length > 1;
}
function _r(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Ps(e, t) {
  const r = e * t.multiplier, n = $s(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function $s(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Is() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Cs(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function Ot(e, t, r, n, a) {
  return [
    `Forma: ${Sr(t.variant)}`,
    Ss(t, r, n),
    ...Object.values(a.rolls).flatMap(Es),
    ..._s(e.resistance),
    ...Fs(r)
  ];
}
function Ss(e, t, r) {
  const n = nt(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Es(e) {
  const r = [`${Us(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = vs(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${Os(e.damageType)}`), r;
}
function _s(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function vs(e) {
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
    const s = Ns(o);
    s && (Ms(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function Ns(e) {
  const t = Ls(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Ds(e);
}
function Ls(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function Ds(e) {
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
function Ms(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function Os(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Fs(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Us(e) {
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
function Bs(e, t) {
  return Cr.map((r) => {
    const n = vr(e, r), a = r === "base" || n !== null, o = n ?? (r === "base" ? Er : null);
    return {
      variant: r,
      label: o?.label ?? Sr(r),
      enabled: a,
      details: o ? xs(o, t) : [],
      finalCostText: o ? Hs(t, o) : null,
      unavailableReason: a ? void 0 : "não disponível neste ritual"
    };
  });
}
function xs(e, t) {
  const r = [], n = Object.values(e.rollFormulaOverrides ?? {});
  n.length > 0 && r.push(n.join(", "));
  const a = nt(t, e);
  return r.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), r;
}
function nt(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function Hs(e, t) {
  const r = nt(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function js(e) {
  return !e.ritualForms && !e.resistance && e.steps.length > 0 && e.steps.every(at);
}
function Vs(e, t) {
  return wr({
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
function Gs(e, t) {
  return vr(e, t) ?? Er;
}
function vr(e, t) {
  return e.ritualForms?.[t] ?? null;
}
function qs(e) {
  return e.steps.some(at);
}
function at(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function zs(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Ws(e, t) {
  const r = await Ks(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: Qs(r),
    total: Xs(r),
    diceBreakdown: Zs(r)
  };
}
function Nr(e) {
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
async function Ks(e, t) {
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
  return Ys(n);
}
function Ys(e) {
  return Ft(e) ? e : Array.isArray(e) ? e.find(Ft) ?? null : null;
}
function Ft(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Qs(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Xs(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Zs(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(Js);
  if (!r) return null;
  const a = (Array.isArray(r.results) ? r.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Js(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Lr = "itemUsePrompts", Dr = "chatCard", he = "data-paranormal-toolkit-prompt-id", ye = "data-paranormal-toolkit-pending-id", ot = "data-paranormal-toolkit-executed-label", xe = "data-paranormal-toolkit-choice-group", Mr = "data-paranormal-toolkit-skipped-label", Ut = "data-paranormal-toolkit-action-section", Bt = "data-paranormal-toolkit-detail-key", xt = "data-paranormal-toolkit-roll-card", st = "data-paranormal-toolkit-roll-detail-toggle", Or = "data-paranormal-toolkit-roll-detail-id", Fr = "data-paranormal-toolkit-resistance-roll-button", Ur = "data-paranormal-toolkit-resistance-skill", Br = "data-paranormal-toolkit-resistance-skill-label", xr = "data-paranormal-toolkit-resistance-target-actor-id", Hr = "data-paranormal-toolkit-resistance-target-name", jr = "data-paranormal-toolkit-resistance-roll-result", Ht = "data-paranormal-toolkit-system-card-replaced", ei = `[${ye}]`, ti = `[${st}]`, ri = `[${Fr}]`, He = `${u}-chat-enrichment`, f = `${u}-item-use-prompt`, ni = `${f}__actions`, jt = `${f}__details`, Vr = `${f}__summary`, ai = `${f}__title`, Gr = `${f}__button--executed`, Vt = `${f}__roll-card`;
let Gt = !1, je = null;
const P = /* @__PURE__ */ new Map(), oi = [0, 100, 500, 1500, 3e3], si = 3e4, ii = [0, 100, 500, 1500, 3e3];
function ci(e) {
  if (je = e, Gt) {
    zt(e);
    return;
  }
  const t = (r, n) => {
    zr(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Gt = !0, zt(e);
}
async function qt(e) {
  const t = qr(e);
  P.set(e.pendingId, t), await ct(t) || nn(t), Wr(e.pendingId);
}
async function li(e) {
  const t = qr({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await ct(t) || nn(t), Wr(e.pendingId);
}
async function Ce(e, t) {
  const r = P.get(e);
  P.delete(e), r && await tc(r, t);
}
function it(e) {
  const t = ln();
  for (const r of t) {
    const n = _(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function di(e, t) {
  const r = it(e);
  if (!r) return;
  const n = _(r.message), a = n[e];
  a && (n[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await K(r.message, n));
}
async function mi(e, t, r) {
  if (!t) return;
  const n = it(e);
  if (!n) return;
  const a = _(n.message);
  let o = !1;
  for (const [s, i] of Object.entries(a))
    s !== e && i.choiceGroupId === t && (a[s] = {
      ...i,
      executedLabel: r ?? i.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await K(n.message, a);
}
function qr(e) {
  const t = N(e.context.message), r = e.context.targets.find((s) => ze(s)), n = r ? ze(r) : null, a = e.resistanceTargetActor ?? n, o = e.resistanceTargetName ?? r?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: vi(e.context),
    executed: !1
  };
}
function zr(e, t, r) {
  ec();
  const n = Re(t);
  if (!n) return;
  const a = Xi(e, n);
  a.length > 0 && de(n);
  for (const o of a)
    Ve(n, o);
  Qr(n, r), Ge(n), qe(n);
}
function zt(e) {
  for (const t of ii)
    globalThis.setTimeout(() => {
      fi(e);
    }, t);
}
function fi(e) {
  for (const t of pi()) {
    const r = Ae(t);
    gi(r) && zr(r, t, e);
  }
}
function pi() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function gi(e) {
  return e ? ut(e) ? !0 : nc(e).length > 0 : !1;
}
function Wr(e) {
  const t = P.get(e);
  if (!t) return;
  const r = t.messageId ? Zi(t.messageId) : null;
  if (r) {
    Yt(r, t), de(r), Ve(r, t), Wt(r), Ge(r), qe(r);
    return;
  }
  if (t.messageId) {
    Ke(t);
    return;
  }
  const n = Ji(t);
  if (n) {
    Yt(n, t), de(n), Ve(n, t), Wt(n), Ge(n), qe(n);
    return;
  }
  Ke(t);
}
function Wt(e) {
  je && Qr(e, je);
}
function de(e) {
  const t = hi();
  e.classList.toggle(`${f}--system-card-replaced`, t);
  const r = Yr(e);
  if (!r || (r.classList.toggle(`${f}__host--system-card-replaced`, t), !t) || r.getAttribute(Ht) === "true") return;
  const n = r.querySelector(`.${He}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(Ht, "true");
}
function hi() {
  try {
    return la() === "replace";
  } catch {
    return !1;
  }
}
function Ve(e, t) {
  if (de(e), e.querySelector(`[${he}="${Y(t.pendingId)}"]`)) return;
  const r = yi(e, t);
  Ri(r, t), Ii(r, Ci(t)).append(_i(t));
}
function yi(e, t) {
  const r = e.querySelector(`.${He}`);
  if (r)
    return r;
  const n = document.createElement("section");
  n.classList.add(He, f);
  const a = document.createElement("header");
  a.classList.add(`${f}__header`);
  const o = document.createElement("span");
  o.classList.add(`${f}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(ai), s.textContent = Ai(t);
  const i = document.createElement("span");
  return i.classList.add(Vr), i.textContent = t.summary, a.append(o, s, i), n.append(a), Li(e).append(n), n;
}
function Ai(e) {
  const t = $(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function Ri(e, t) {
  const r = t.summaryLines ?? [], n = en(r, t);
  if (n) {
    bi(e, n, t);
    return;
  }
  Si(e, r);
}
function bi(e, t, r) {
  if (e.querySelector(`[${xt}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(Vt, `${Vt}--${t.intent}`), n.setAttribute(xt, "true");
  const a = document.createElement("div");
  a.classList.add(`${f}__roll-summary`);
  const o = document.createElement("span");
  o.classList.add(`${f}__roll-chip`, `${f}__roll-chip--${t.intent}`), o.textContent = t.label.toUpperCase();
  const s = document.createElement("strong");
  s.classList.add(`${f}__roll-total`), s.textContent = String(t.total);
  const i = document.createElement("span");
  i.classList.add(`${f}__roll-formula`), i.textContent = t.formula, a.append(o, s, i), n.append(a), Ti(n, t), ki(n, t, r), Pi(n, t, r.pendingId), e.append(n);
}
function Ti(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Tc);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${f}__roll-meta`);
  for (const a of r) {
    const o = document.createElement("span");
    o.classList.add(`${f}__roll-meta-pill`), o.textContent = a, n.append(o);
  }
  e.append(n);
}
function ki(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${f}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${f}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = wi(t, r);
  a.append(o), s && a.append(s);
  const i = document.createElement("span");
  i.classList.add(`${f}__resistance-description`), i.textContent = t.resistance, n.append(a, i), t.resistanceRollResult && n.append(Kr(t.resistanceRollResult)), e.append(n);
}
function wi(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${f}__resistance-roll-button`), r.setAttribute(he, t.pendingId), r.setAttribute(Fr, "true"), r.setAttribute(Ur, e.resistanceSkill), r.setAttribute(Br, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(xr, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(Hr, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${f}__resistance-roll-button--rolled`), r.setAttribute(jr, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${f}__resistance-roll-fallback`), a.textContent = "d20", r.append(n, a), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function Kr(e) {
  const t = document.createElement("span");
  return t.classList.add(`${f}__resistance-roll-result`), t.textContent = Zr(e), t;
}
function Pi(e, t, r) {
  const n = $i(t);
  if (n.length === 0) return;
  const a = `${r}-roll-details`, o = document.createElement("button");
  o.type = "button", o.classList.add(`${f}__roll-detail-toggle`), o.setAttribute(st, a), o.setAttribute("aria-expanded", "false"), o.textContent = "▸ Ver detalhes";
  const s = document.createElement("dl");
  s.classList.add(`${f}__roll-detail-list`), s.setAttribute(Or, a), s.hidden = !0;
  for (const i of n) {
    const l = document.createElement("dt");
    l.textContent = i.label;
    const p = document.createElement("dd");
    p.textContent = i.value, s.append(l, p);
  }
  e.append(o, s);
}
function $i(e) {
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
function Ii(e, t) {
  const r = `[${Ut}="${Y(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const a = document.createElement("div");
  a.classList.add(ni), a.setAttribute(Ut, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${f}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function Ci(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = en(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Si(e, t) {
  if (t.length === 0) return;
  const r = Ei(e);
  for (const n of t) {
    const a = kc(n);
    if (r.querySelector(`[${Bt}="${Y(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = n, o.setAttribute(Bt, a), r.append(o);
  }
}
function Ei(e) {
  const t = e.querySelector(`.${jt}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(jt), e.append(r), r;
}
function _i(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${f}__button`), t.setAttribute(he, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Gr), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(ye, e.pendingId), t.setAttribute(ot, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(xe, e.choiceGroupId), t.setAttribute(Mr, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function vi(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = Ni(e);
  return `${t} → ${r}`;
}
function Ni(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Li(e) {
  return Yr(e) ?? e;
}
function Yr(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Qr(e, t) {
  const r = Re(e);
  if (!r) return;
  const n = r.querySelectorAll(ei);
  for (const a of n)
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      Wi(a, t);
    }));
}
function Ge(e) {
  const t = Re(e);
  if (!t) return;
  const r = t.querySelectorAll(ti);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      Di(t, n);
    }));
}
function qe(e) {
  const t = Re(e);
  if (!t) return;
  const r = t.querySelectorAll(ri);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      Mi(t, n);
    }));
}
function Di(e, t) {
  const r = t.getAttribute(st);
  if (!r) return;
  const n = e.querySelector(`[${Or}="${Y(r)}"]`);
  if (!n) return;
  const a = n.hidden;
  n.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Mi(e, t) {
  const r = t.getAttribute(he), n = t.getAttribute(Ur), a = t.getAttribute(Br) ?? (n ? Nr(n) : "Resistência");
  if (!r || !n) return;
  const o = Ui(e, r), s = Bi(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const l = await Ws(s, n);
    await Gi(l.roll);
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
    Oi(t, p), Fi(t, p), qi(r, p), await zi(e, r, p);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", l), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function Oi(e, t) {
  e.classList.add(`${f}__resistance-roll-button--rolled`), e.setAttribute(jr, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Fi(e, t) {
  const r = e.closest(`.${f}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${f}__resistance-roll-result`), a = n ?? Kr(t);
  if (n) {
    n.textContent = Zr(t);
    return;
  }
  r.append(a);
}
function Ui(e, t) {
  const r = P.get(t);
  if (r) return r;
  const n = Ae(e);
  return _(n)[t] ?? null;
}
function Bi(e, t) {
  const r = e?.resistanceTargetActor;
  if (S(r)) return r;
  const a = e?.context?.targets.map(ze).find(S) ?? null;
  if (a) return a;
  const o = t.getAttribute(xr) ?? e?.resistanceTargetActorId ?? null, s = o ? Hi(o) : null;
  return s || ji(
    t.getAttribute(Hr) ?? e?.resistanceTargetName ?? xi(t)
  );
}
function xi(e) {
  const r = e.closest(`.${f}`)?.querySelector(`.${Vr}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const a = r.split(n), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function ze(e) {
  const t = e.actor;
  if (S(t)) return t;
  const r = e.token, n = ee(r);
  if (n) return n;
  const a = e.document;
  return ee(a);
}
function ee(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (S(t)) return t;
  const r = e.document?.actor;
  return S(r) ? r : null;
}
function Hi(e) {
  const r = game.actors?.get?.(e);
  return S(r) ? r : Xr().map((o) => ee(o)).find((o) => o?.id === e) ?? null;
}
function ji(e) {
  const t = q(e);
  if (!t) return null;
  const r = Xr().filter((o) => q(Vi(o)) === t).map((o) => ee(o)).find(S) ?? null;
  if (r) return r;
  const a = game.actors?.find?.((o) => S(o) && q(o.name) === t);
  return S(a) ? a : null;
}
function Xr() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Vi(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : ee(e)?.name ?? null;
}
function q(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function S(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Zr(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Gi(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function qi(e, t) {
  const r = P.get(e);
  r && (r.resistanceRollResult = t);
}
async function zi(e, t, r) {
  const n = Ae(e);
  if (n)
    try {
      const a = _(n), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: r
      }, await K(n, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function Ae(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return E(n?.get?.(r));
}
async function Wi(e, t) {
  const r = e.getAttribute(ye);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    Jr(e, e.getAttribute(ot) ?? "✓ Automação aplicada"), Ki(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function Jr(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Gr), e.removeAttribute(ye), e.removeAttribute(ot);
}
function Ki(e) {
  const t = e.getAttribute(xe);
  if (!t) return;
  const r = e.closest(`.${f}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${xe}="${Y(t)}"]`;
  for (const a of r.querySelectorAll(n)) {
    if (a === e) continue;
    const o = a.getAttribute(Mr) ?? "✓ Outra opção escolhida";
    Jr(a, o);
  }
}
function en(e, t) {
  const r = e.map(tn).find(Rc);
  if (!r) return null;
  const n = $(e, "Forma"), a = $(e, "Custo"), o = $(e, "Dados") ?? $(e, `Dados (${r.label})`), s = $(e, "Tipo"), i = $(e, "Resistência"), l = $(e, "Resistência Perícia"), p = $(e, "Resistência Rótulo") ?? (l ? Nr(l) : null), y = rn(e, "Observação"), A = e.filter((b) => Qi(b, r));
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
function tn(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, n, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: r,
    formula: n,
    total: o,
    intent: Yi(r)
  } : null;
}
function Yi(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : "generic";
}
function $(e, t) {
  return rn(e, t)[0] ?? null;
}
function rn(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const a = n.slice(r.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function Qi(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || tn(e) ? !1 : e.trim().length > 0;
}
function Xi(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of P.values())
    We(n, e, t) && r.set(n.pendingId, n);
  for (const n of rc(e))
    We(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, a) => n.createdAt - a.createdAt);
}
function We(e, t, r) {
  const n = N(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !Kt(r, "itemId", e.itemId) ? !1 : !e.actorId || Kt(r, "actorId", e.actorId);
}
function Kt(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${wc(t)}`;
  for (const a of e.querySelectorAll(`[${n}]`))
    if (a.getAttribute(n) === r)
      return !0;
  return !1;
}
function Zi(e) {
  const t = Y(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Ji(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (We(e, null, t))
      return t;
  return null;
}
function ec() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of P.entries())
    e - n.createdAt > t && P.delete(r);
}
async function Yt(e, t) {
  const r = Ae(e);
  if (!r) return !1;
  try {
    const n = _(r);
    return n[t.pendingId] = lt(t, N(r)), await K(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function ct(e) {
  const t = sn(e);
  if (!t) return !1;
  try {
    const r = _(t);
    return r[e.pendingId] = lt(e, N(t)), await K(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function nn(e) {
  for (const t of oi)
    globalThis.setTimeout(() => {
      Ke(e);
    }, t);
}
async function Ke(e) {
  const t = sn(e);
  if (ut(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const n = await ct(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function tc(e, t) {
  const r = on(e.context.message);
  if (r)
    try {
      const n = _(r), a = n[e.pendingId] ?? lt(e, N(r));
      n[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await K(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function rc(e) {
  return Object.values(_(E(e))).filter(ne);
}
function _(e) {
  if (!e) return {};
  const t = {}, r = ut(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, a] of Object.entries(an(e)))
    t[n] ??= a;
  return t;
}
function nc(e) {
  return Object.values(an(E(e))).filter(ne);
}
function an(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, Lr);
  if (!z(t))
    return {};
  const r = {};
  for (const [n, a] of Object.entries(t))
    ne(a) && (r[n] = a);
  return r;
}
async function K(e, t) {
  typeof e.setFlag == "function" && (await oc(e, t), await ac(e, t));
}
async function ac(e, t) {
  await Promise.resolve(e.setFlag?.(u, Lr, t));
}
function ut(e) {
  if (!e) return null;
  const t = e.getFlag?.(u, Dr);
  return yc(t) ? t : null;
}
async function oc(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(ne).sort((o, s) => o.createdAt - s.createdAt);
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
      actorName: sc(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(u, Dr, a));
}
function sc(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function lt(e, t) {
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
function on(e) {
  const t = E(e);
  if (t?.setFlag)
    return t;
  const r = ic(e);
  if (r?.setFlag)
    return r;
  const n = N(e);
  if (!n) return null;
  const a = game.messages;
  return E(a?.get?.(n));
}
function ic(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(E).find((r) => typeof r?.setFlag == "function") ?? null;
}
function sn(e) {
  const t = on(e.context.message);
  if (t) return t;
  const r = e.messageId ? cc(e.messageId) : null;
  if (r) return r;
  const n = ln().slice().reverse();
  return n.find((a) => uc(a, e)) ?? n.find((a) => lc(a, e)) ?? null;
}
function cc(e) {
  const t = game.messages;
  return E(t?.get?.(e));
}
function uc(e, t) {
  const r = N(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!cn(e, t)) return !1;
  const a = un(e);
  return !t.actorId || !a || a === t.actorId;
}
function lc(e, t) {
  if (!mc(e, t)) return !1;
  const r = un(e);
  return t.actorId && r === t.actorId ? !0 : cn(e, t);
}
function cn(e, t) {
  const r = q(dc(e));
  if (!r) return !1;
  const n = q(t.itemName);
  if (n && r.includes(n)) return !0;
  const a = q(t.itemId);
  return !!(a && r.includes(a));
}
function dc(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function un(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function mc(e, t) {
  const r = fc(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= si;
}
function fc(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function E(e) {
  return e && typeof e == "object" ? e : null;
}
function ne(e) {
  return z(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && T(e.messageId) && T(e.itemId) && T(e.actorId) && T(e.itemName) && F(e.resistanceTargetActorId) && F(e.resistanceTargetName) && Ac(e.resistanceRollResult) && pc(e.actionPayload) && Se(e.title) && Se(e.buttonLabel) && Se(e.executedLabel) && F(e.choiceGroupId) && F(e.skippedLabel) && F(e.actionSectionId) && F(e.actionSectionTitle) && bc(e.summaryLines) : !1;
}
function pc(e) {
  return e == null ? !0 : z(e) ? e.kind === "resource-operation" && T(e.actorId) && T(e.actorUuid) && typeof e.actorName == "string" && gc(e.resource) && hc(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function gc(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function hc(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function yc(e) {
  return z(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && T(e.messageId) && z(e.source) && T(e.source.actorId) && T(e.source.actorName) && T(e.source.itemId) && T(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ne) : !1;
}
function Ac(e) {
  return e == null ? !0 : z(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && F(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Rc(e) {
  return e !== null;
}
function z(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function T(e) {
  return e === null || typeof e == "string";
}
function Se(e) {
  return e === void 0 || typeof e == "string";
}
function F(e) {
  return e == null || typeof e == "string";
}
function bc(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Tc(e) {
  return typeof e == "string" && e.length > 0;
}
function ln() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(E).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(E).filter((n) => n !== null) : [];
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
function kc(e) {
  return e.trim().toLowerCase();
}
function wc(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Y(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Qt = 1e3;
class Pc {
  constructor(t, r, n, a) {
    this.workflow = t, this.resources = r, this.debugOutput = a, this.ritualAssistant = new gs(t, r, n);
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
      settings: Rt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = Rt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = Qe(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && $c(t.item) && r.executionMode === "ask") {
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
    if (await Dt(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: _e(t, "failed", "missing-actor")
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
    const r = it(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, a = Sc(n);
    if (!a)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const o = await le(this.resources, a, n.resource, n.operation, n.amount);
    return o.ok ? (await di(t), await mi(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (ci((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await Dt(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: _e(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, Ic(t.item));
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
        await this.registerCompletedRitualCard(t, n.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), c.info("Ritual assistido concluído sem ações pendentes.", U(n.workflowContext));
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
  async registerCompletedRitualCard(t, r) {
    const n = ve();
    await li({
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
      const i = ve();
      o ??= i, this.pendingExecutions.set(i, {
        kind: "resource-action",
        id: i,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await qt({
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
        actionPayload: Cc(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", o), c.info("Ritual assistido preparado com ações pendentes.", U(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = ve();
    this.pendingExecutions.set(n, {
      kind: "workflow",
      id: n,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await qt({
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
    this.setAttempt(t, "completed"), c.info("Automação executada por uso normal de item.", U(a.value.context));
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
    const r = Date.now(), n = Xt(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      r - s > Qt && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(n);
    return a !== void 0 && r - a <= Qt;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Xt(t), Date.now());
  }
  setAttempt(t, r, n, a) {
    this.lastAttempt = _e(t, r, n, a);
  }
}
function $c(e) {
  return e.type === "ritual";
}
function Ic(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Cc(e) {
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
function Sc(e) {
  const t = e.actorUuid ? Ec(e.actorUuid) : null;
  if (W(t)) return t;
  const r = e.actorId ? _c(e.actorId) : null;
  return r || vc(e.actorName);
}
function Ec(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function _c(e) {
  const r = game.actors?.get?.(e);
  if (W(r)) return r;
  for (const n of dn()) {
    const a = dt(n);
    if (a?.id === e) return a;
  }
  return null;
}
function vc(e) {
  const t = Ee(e);
  if (!t) return null;
  for (const a of dn()) {
    const o = Nc(a);
    if (Ee(o) === t) {
      const s = dt(a);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((a) => W(a) && Ee(a.name) === t);
  return W(n) ? n : null;
}
function dn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Nc(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : dt(e)?.name ?? null;
}
function dt(e) {
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
function _e(e, t, r, n) {
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
function Xt(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function ve() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Lc {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], a = [], o = re(t);
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
class Dc {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = re(t).map((i) => this.analyzeRitual(i)), n = r.filter(ce("upToDate")), a = r.filter(ce("available")), o = r.filter(ce("outdated")), s = r.filter(ce("unsupported"));
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
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = Mc(t);
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
      reason: Oc(n, r.preset)
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
    preset: e.match ? pe(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function Mc(e) {
  const t = e.getFlag(u, "automation");
  return Xe(t) ? t : null;
}
function Oc(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function ce(e) {
  return (t) => t.status === e;
}
class Fc {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), n = Je(t.transaction);
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
    const n = this.createWorkflowSummaryContent(t, r), a = U(t);
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
    const r = h(t.actorName), n = h(t.resource), a = h(Zt(t)), o = h(Bc(t));
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
      (m) => `<li><strong>${h(m.id)}:</strong> ${h(m.formula)} = ${m.total} <em>(${h(Uc(m.intent))})</em>${m.damageType ? ` — ${h(m.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (m) => `<li><strong>${h(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${h(m.resource)} (${h(xc(m.source))})</li>`
    ), y = t.damageInstances.map(
      (m) => `<li><strong>${h(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${h(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (m) => `<li><strong>${h(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), b = t.resourceTransactions.map(
      (m) => `<li><strong>${h(m.actorName)}:</strong> ${h(Zt(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), x = t.phases.map((m) => h(m)).join(" &rarr; ");
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
          ${b.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${b.join("")}</ul>` : ""}
          ${x.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${x}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Uc(e) {
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
function Zt(e) {
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
function Bc(e) {
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
function xc(e) {
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
function Hc() {
  const e = new Da(), t = new _o(e), r = new Fa(), n = new xa(r), a = new eo(e), o = new ro(), s = o.registerMany(Gn());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new to(), l = new Za(), p = new Dc(o), y = new Lc(p, i, l), A = new Do(), b = new Fc(A), x = new Lo(), m = new So(t, n, b, x), mt = new No(m, x), be = new Pc(mt, t, n, A);
  return be.addStrategy(new Qa((pn) => be.handleItemUsed(pn))), {
    ordem: a,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: n,
    resources: t,
    automationRegistry: o,
    automationBinder: i,
    itemPatches: l,
    debugOutput: A,
    chatMessages: b,
    workflowHooks: x,
    automation: m,
    workflow: mt,
    itemUseIntegration: be,
    ritualPresetDiagnostic: p,
    ritualPresetApplications: y
  };
}
const { ApplicationV2: jc } = foundry.applications.api;
class me extends jc {
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
      apply: me.onApply,
      cancel: me.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${I(Ye)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${I(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Ne("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Ne("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Ne("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Ne(e, t, r, n) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${n}"></i>
        <span>${I(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? Vc(r) : qc(t)}
    </section>
  `;
}
function Vc(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Gc).join("")}</ol>`;
}
function Gc(e) {
  const t = e.preset, r = t ? `${t.label} v${t.version}` : "Sem preset", n = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${I(e.appliedPresetId)} v${I(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${I(e.itemName)}</strong>
        <span>${I(e.reason)}</span>
        ${n}
      </div>
      <em>${I(r)}</em>
    </li>
  `;
}
function qc(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${I({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function I(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const fe = `${u}.manageRitualPresets`, Jt = `__${u}_ritualPresetHeaderControlRegistered`, zc = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Wc(e) {
  const t = globalThis;
  if (!t[Jt]) {
    for (const r of zc)
      Hooks.on(r, (n, a) => {
        Kc(n, a, e);
      });
    t[Jt] = !0, c.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Kc(e, t, r) {
  Array.isArray(t) && Qc(e) && (Yc(e, r), !t.some((n) => n.action === fe) && t.push({
    action: fe,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), mn(e, r);
    }
  }));
}
function Yc(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[fe] && (e.options.actions[fe] = (r) => {
    r.preventDefault(), r.stopPropagation(), mn(e, t);
  }));
}
function Qc(e) {
  if (!game.user?.isGM) return !1;
  const t = fn(e);
  return t ? t.type === "agent" && re(t).length > 0 : !1;
}
function mn(e, t) {
  const r = fn(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new me(r, t).render({ force: !0 });
}
function fn(e) {
  return er(e.actor) ? e.actor : er(e.document) ? e.document : null;
}
function er(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let j = null;
Hooks.once("init", () => {
  Hn(), ua(), Na(), c.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Tt.isSupportedSystem()) {
    c.warn(
      `Sistema não suportado: ${Tt.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  j = Hc(), j.itemUseIntegration.registerStrategies(), Aa(j), Ea(), $a(), Wc(j), c.info("Inicializado para o sistema Ordem Paranormal."), c.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Ye} inicializado.`);
});
function Xc() {
  if (!j)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return j;
}
export {
  Xc as getToolkitServices
};
//# sourceMappingURL=main.js.map
