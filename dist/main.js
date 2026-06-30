const u = "paranormal-toolkit", Ze = "Paranormal Toolkit", Tn = "ordemparanormal";
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
function wn(e) {
  return et(e.getFlag(u, "automation"));
}
function et(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Cn(t.source) && $n(t.definition);
}
function $n(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && C(t.label) && Array.isArray(t.steps) && t.steps.every(Pn);
}
function Cn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? C(t.presetId) && C(t.presetVersion) && C(t.appliedAt) : t.type === "manual" ? C(t.label) && C(t.appliedAt) : !1;
}
function Pn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return In(t);
    case "spendRitualCost":
      return Sn(t);
    case "rollFormula":
      return En(t);
    case "modifyResource":
      return _n(t);
    case "chatCard":
      return Nn(t);
    default:
      return !1;
  }
}
function In(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && ir(t);
}
function Sn(e) {
  return e.type === "spendRitualCost";
}
function En(e) {
  const t = e;
  return t.type === "rollFormula" && C(t.id) && C(t.formula) && (t.intent === void 0 || Mn(t.intent)) && (t.damageType === void 0 || C(t.damageType));
}
function _n(e) {
  const t = e;
  return t.type === "modifyResource" && Ln(t.actor) && vn(t.resource) && Dn(t.operation) && ir(t);
}
function Nn(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function ir(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || C(e.amountFrom);
}
function Ln(e) {
  return e === "self" || e === "target";
}
function vn(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Dn(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Mn(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function C(e) {
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
    if (Un(t))
      return Array.from(t).filter(gt);
  }
  return [];
}
function On(e) {
  return tt(e)[0] ?? null;
}
function Fn(e) {
  return tt(e).find(wn) ?? null;
}
function Un(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function gt(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ne(e) {
  return tt(e).filter((t) => t.type === "ritual");
}
function cr(e) {
  return ne(e)[0] ?? null;
}
function Bn(e) {
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
    n.applied.push(jn(a, o, s));
  }
  return c.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), xn(n), n;
}
async function Oe(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function jn(e, t, r) {
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
function xn(e) {
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
  const t = cr(e);
  return t || (c.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function x(e) {
  return e ? {
    id: e.id,
    source: {
      ...Hn(e.sourceActor),
      token: e.sourceToken
    },
    item: Vn(e.item),
    targets: e.targets.map(Gn),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Rt(e.rollRequests, ur),
    rolls: Rt(e.rolls, qn),
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
function Hn(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Vn(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Gn(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function ur(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function qn(e) {
  return {
    ...ur(e),
    total: e.total
  };
}
function Rt(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function zn(e) {
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
    Wn(a.error);
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
function Wn(e) {
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
function Kn() {
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
async function D(e, t) {
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
function Yn() {
  return {
    status() {
      return Fe();
    },
    async enable() {
      await D("enabled", !0);
    },
    async disable() {
      await D("enabled", !1);
    },
    async enableConsole() {
      await D("console", !0);
    },
    async disableConsole() {
      await D("console", !1);
    },
    async enableUi() {
      await D("ui", !0);
    },
    async disableUi() {
      await D("ui", !1);
    },
    async enableChat() {
      await D("chat", !0);
    },
    async disableChat() {
      await D("chat", !1);
    }
  };
}
const lr = "ritual.costOnly", dr = "ritual.simpleHealing", Qn = "ritual.eletrocussao", mr = "ritual.simpleDamage", fr = "generic.simpleHealing", pr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Xn() {
  return [
    Zn(),
    Jn(),
    ea(),
    ta(),
    ra()
  ];
}
function Zn() {
  return {
    id: lr,
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
function Jn() {
  return {
    id: dr,
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
    automation: gr(),
    itemPatch: aa()
  };
}
function ea() {
  return {
    id: Qn,
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
    automation: na(),
    itemPatch: oa()
  };
}
function ta() {
  return {
    id: mr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: nt()
  };
}
function ra() {
  return {
    id: fr,
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
function gr(e = "2d8+2") {
  return hr(
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
function na() {
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
  return hr(
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
function aa() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: pr,
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
function oa() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: pr,
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
function hr(e, t, r) {
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
function yr() {
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
function sa(e) {
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
        if (!ua(t, r)) {
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
      const n = e.automationRegistry.require(lr);
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
      if (!bt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(dr);
      if (!a.ok) {
        c.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, a.value, {
        definition: gr(t)
      }), c.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = F("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = U(r);
      if (!n) return;
      if (!bt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(mr);
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
      r && await ia(e, t, r);
    }
  };
}
async function ia(e, t, r) {
  const n = Je(r);
  if (!n.ok) {
    c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: yr(),
    item: r,
    targets: at()
  });
  if (!a.ok) {
    ca(a.error);
    return;
  }
  c.info("Automação de ritual executada com sucesso.", x(a.value.context));
}
function ca(e) {
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
  const t = cr(e);
  return t || (c.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ua(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function bt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const la = ["disabled", "ask", "automatic"], da = ["buttons", "confirm"], Ar = "ask";
function ma(e) {
  return typeof e == "string" && la.includes(e);
}
function fa(e) {
  return typeof e == "string" && da.includes(e);
}
function pa(e) {
  return ma(e) ? e : fa(e) ? "ask" : Ar;
}
const ga = ["keep", "replace"], Rr = "keep", ha = !0, _ = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function ya() {
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
    default: Ar
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
    default: Rr
  }), game.settings.register(u, _.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: ha
  }), game.settings.register(u, _.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function kt() {
  const e = pa(game.settings.get(u, _.executionMode)), t = kr(game.settings.get(u, _.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: br()
  };
}
function Aa() {
  return kr(game.settings.get(u, _.systemCardMode));
}
function br() {
  return game.settings.get(u, _.ritualCastingCheckEnabled) === !0;
}
async function B(e) {
  await game.settings.set(u, _.executionMode, e);
}
function kr(e) {
  return ga.includes(e) ? e : Rr;
}
function Ra(e) {
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
const ba = [
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
function ka(e) {
  return {
    phases() {
      return ba;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = we("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = Fn(t);
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
      if (!$a(r)) {
        c.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = wa(r) ?? we("Nenhum ator encontrado para executar automação do item.");
      n && await Tt(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = we("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = On(t);
      if (!r) {
        c.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(fr);
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
    sourceToken: yr(),
    item: r,
    targets: at()
  });
  if (!a.ok) {
    Ta(a.error);
    return;
  }
  c.info("Automação executada com sucesso.", x(a.value.context));
}
function Ta(e) {
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
function wa(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function $a(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ca(e) {
  const t = zn(e), r = Bn(e), n = sa(e), a = ka(e), o = Yn(), s = Ra(e);
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
function Pa(e) {
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
    debug: Ca(e)
  }, r = globalThis;
  return r[u] = t, r.ParanormalToolkit = t, t;
}
class wt {
  static isSupportedSystem() {
    return game.system.id === Tn;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Ia() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: q(t.id),
    actorId: q(t.actor?.id),
    sceneId: q(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Tr() {
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
function Sa(e, t = Tr()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Ea(e) {
  if (!La(e)) return null;
  const t = e.getFlag(u, "workflow");
  return Na(t) ? t : null;
}
function _a() {
  return `flags.${u}.workflow`;
}
function $t(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), r = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || r !== void 0;
}
function Ct(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Ue(t) || Ue(r);
}
function Na(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function La(e) {
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
    Da(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Da(e, t) {
  const r = Ea(e);
  if (!r || r.targets.length === 0) return;
  const n = Oa(t);
  if (!n || n.querySelector(`.${u}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(Ma(r));
}
function Ma(e) {
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
function Oa(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Fa() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!Ua(n) || !Ba(e) || $t(e) || $t(t)) return;
    const a = Ia();
    if (a.length === 0 || !Ct(e) && !Ct(t)) return;
    const o = Tr();
    e.updateSource({
      [_a()]: Sa(a, o)
    }), c.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function Ua(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Ba(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const wr = {
  enabled: "dice.animations.enabled"
};
function ja() {
  game.settings.register(u, wr.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function xa() {
  return {
    enabled: game.settings.get(u, wr.enabled) === !0
  };
}
const J = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, $r = {
  PV: "system.attributes.hp"
}, Be = {
  PV: [J.PV, $r.PV],
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
class Ha {
  getResource(t, r) {
    const n = It(t, r);
    if (!n.ok)
      return m(n.error);
    const a = n.value, o = `${a}.value`, s = `${a}.max`, i = foundry.utils.getProperty(t, o), d = foundry.utils.getProperty(t, s), p = Et(t, r, o, i, "valor atual");
    if (p) return m(p);
    const h = Et(t, r, s, d, "valor máximo");
    return h ? m(h) : g({
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
  const r = Va(e.type, t);
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
    message: Ga(e, t),
    path: Be[t].join(" | ")
  });
}
function Va(e, t) {
  return e === "threat" ? $r[t] ?? null : e === "agent" ? J[t] : null;
}
function St(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function Ga(e, t) {
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
class qa {
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
    const { path: n, value: a } = r, o = za(a);
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
function za(e) {
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
const Wa = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Ka {
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
    const n = r.value, a = Ya(t.ritual, n);
    return a.ok ? a.value ? g(a.value) : g({
      resource: "PE",
      amount: Wa[n],
      source: "default-by-circle",
      circle: n
    }) : m(a.error);
  }
}
function Ya(e, t) {
  const r = e.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Qa(r) ? {
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
function Qa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const $e = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Xa(e) {
  if (!no(e.item)) return null;
  const t = xe(e.actor) ? e.actor : Za(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: eo(e.token) ?? Ja(t),
    targets: at(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Za(e) {
  const t = e;
  return xe(t.actor) ? t.actor : xe(e.parent) ? e.parent : null;
}
function Ja(e) {
  const t = to(e) ?? ro(e);
  return t ? Cr(t) : null;
}
function eo(e) {
  return He(e) ? Cr(e) : null;
}
function to(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return He(r) ? r : (t.getActiveTokens?.() ?? []).find(He) ?? null;
}
function ro(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Cr(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Ce(e.id),
    actorId: Ce(t?.id),
    sceneId: Ce(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function no(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function xe(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function He(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Ce(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class ao {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on($e.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, c.info(`${$e.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = Xa(oo(t));
    if (!r) {
      c.warn(`${$e.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function oo(e) {
  return e && typeof e == "object" ? e : {};
}
class so {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return Pe("missing-item-patch");
    if (t.type !== "ritual") return Pe("unsupported-item-type");
    const a = io(n);
    return Object.keys(a).length === 0 ? Pe("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function io(e) {
  const t = {};
  b(t, "name", e.name), b(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (b(t, "system.circle", r.circle), b(t, "system.element", r.element), b(t, "system.target", r.target), b(t, "system.targetQtd", r.targetQuantity), b(t, "system.execution", r.execution), b(t, "system.range", r.range), b(t, "system.duration", r.duration), b(t, "system.skillResis", r.resistanceSkill), b(t, "system.resistance", r.resistance), b(t, "system.studentForm", r.studentForm), b(t, "system.trueForm", r.trueForm)), t;
}
function b(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function Pe(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class co {
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
class uo {
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
class lo {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = mo(t);
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
    return this.list().map((r) => fo(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function mo(e) {
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
function fo(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = po(a, t);
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
function po(e, t) {
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
      const r = Nt(t.name), n = e.names.map(Nt).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = go(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function Nt(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function go(e) {
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
const ho = "dice-so-nice";
async function Pr(e) {
  if (!xa().enabled || !yo()) return;
  const t = Ao();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      c.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function yo() {
  return game.modules.get(ho)?.active === !0;
}
function Ao() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Ro(e, t, r) {
  if (!Lt(e.id) || !Lt(e.formula))
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
    await Pr(a);
    const i = {
      ...r.rollRequests[e.id] ?? Ir(e, t),
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
function Ir(e, t) {
  const r = e.intent ?? bo(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function bo(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Lt(e) {
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
function ko(e) {
  const { step: t, context: r, transaction: n, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = To(t, r, n, a);
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
    const s = wo(t, r, n, a);
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
function To(e, t, r, n) {
  const a = he(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Sr(t.id, "damage", n, t.damageInstances.length),
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
function wo(e, t, r, n) {
  const a = he(e.amountFrom);
  return {
    id: Sr(t.id, "healing", n, t.healingInstances.length),
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
function Sr(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function $o(e, t, r) {
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
function Co(e) {
  const { step: t, context: r, stepIndex: n, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", r, { stepIndex: n, step: t, metadata: a }), Er("before", e), vt("before", e), vt("resolve", e);
}
function Po(e) {
  const { step: t, context: r, stepIndex: n, metadata: a, lifecycle: o } = e;
  o.emit("apply", r, { stepIndex: n, step: t, metadata: a }), Er("apply", e);
}
function Io(e) {
  const { step: t, context: r, stepIndex: n, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", r, { stepIndex: n, step: t, metadata: a });
}
function Er(e, t) {
  const { step: r, context: n, stepIndex: a, metadata: o, lifecycle: s } = t, i = So(e, r.operation);
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
function So(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Eo(e, t, r) {
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
async function _o(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return No(e, t);
    case "spendRitualCost":
      return Lo(e, t);
  }
}
async function No(e, t) {
  const { context: r, resources: n } = e, a = le(t, r);
  return a.ok ? _r(await n.spend(r.sourceActor, t.resource, a.value), r) : m(a.error);
}
async function Lo(e, t) {
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
  }), _r(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function _r(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), g(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), m({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function vo(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: a, execute: o } = e, s = Do(t);
  for (const d of s.before)
    a.emit(d, r, { stepIndex: n, step: t });
  const i = await o();
  if (!i.ok)
    return i;
  for (const d of s.after)
    a.emit(d, r, { stepIndex: n, step: t });
  return i;
}
function Do(e) {
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
class Mo {
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
    const a = await _o({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? g(void 0) : m({ ...a.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const a = Ir(t, n);
    r.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, r, n, t);
    const o = await this.runRollFormulaStep(t, r, n);
    if (!o.ok)
      return o;
    const s = r.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, r, n, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: a, rollResult: s }), g(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const a = await Ro(t, n, r);
    return a.ok ? g(void 0) : m({ ...a.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const a = le(t, r);
    if (!a.ok)
      return m({ ...a.error, stepIndex: n, step: t, context: r });
    const o = $o(t, r, a.value);
    Co({
      step: t,
      context: r,
      stepIndex: n,
      metadata: o,
      lifecycle: this.lifecycle
    }), Po({
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
      ko({
        step: t,
        context: r,
        transaction: p.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return Io({
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
    const a = await Eo(this.messages, t, r);
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
    const i = Oo(t, r.intent);
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
function Oo(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Fo {
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
    const { afterValue: d, appliedAmount: p } = i.value, h = {
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
      after: h
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
function Nr(e) {
  return {
    id: Uo(),
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
function Uo() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Bo {
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
    const n = Nr(r);
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
class jo {
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
class xo {
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
      whisper: Ho(),
      flags: {
        ...t.flags,
        [u]: {
          ...Vo(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && c.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = Fe();
    if (!n.enabled)
      return;
    const a = r.notification ?? Dt(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, a);
  }
  emitConsole(t, r) {
    const n = Dt(r);
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
function Dt(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Ho() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Vo(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const Go = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Lr = `${u}-inline-roll-neutralized`, qo = `${u}-inline-roll-notice`, ot = `data-${u}-inline-roll-neutralized`, Mt = `data-${u}-inline-roll-notice`, zo = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Ot(e) {
  const t = ss(e.message), r = await Wo(e.message), n = Ko(t);
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
async function Wo(e) {
  const t = ns(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = Yo(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await as(t, r.content), replacementCount: r.replacementCount };
}
function Ko(e) {
  const t = e ? os(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = vr(t);
  return r > 0 && Dr(es(t)), { replacementCount: r };
}
function Yo(e) {
  const t = Qo(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = vr(r.content), a = t.replacementCount + n;
  return a === 0 ? { content: e, replacementCount: 0 } : (Dr(r.content), { content: r.innerHTML, replacementCount: a });
}
function Qo(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, a) => (t += 1, Zo(a.trim()))), replacementCount: t };
}
function vr(e) {
  const t = Xo(e);
  for (const r of t)
    r.replaceWith(Jo(ts(r)));
  return t.length;
}
function Xo(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(Go))
    r.getAttribute(ot) !== "true" && t.add(r);
  return Array.from(t);
}
function Zo(e) {
  return `<span class="${Lr}" ${ot}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${is(e)}</span>`;
}
function Jo(e) {
  const t = document.createElement("span");
  return t.classList.add(Lr), t.setAttribute(ot, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Dr(e) {
  if (e.querySelector?.(`[${Mt}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(qo), t.setAttribute(Mt, "true"), t.textContent = zo, e.append(t);
}
function es(e) {
  return e.querySelector(".message-content") ?? e;
}
function ts(e) {
  const r = e.getAttribute("data-formula") ?? rs(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function rs(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function ns(e) {
  return e && typeof e == "object" ? e : null;
}
async function as(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return c.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function os(e) {
  const t = cs(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function ss(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function is(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function cs(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ft = "occultism";
function us(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function ls(e) {
  const t = us(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await ds(e, Ft);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Pr(r);
  const n = ps(r);
  return {
    skill: Ft,
    skillLabel: "Ocultismo",
    roll: r,
    formula: fs(r),
    total: n,
    difficulty: t,
    success: n >= t,
    diceBreakdown: gs(r)
  };
}
async function ds(e, t) {
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
  return ms(n);
}
function ms(e) {
  return Ut(e) ? e : Array.isArray(e) ? e.find(Ut) ?? null : null;
}
function Ut(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function fs(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function ps(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function gs(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(hs);
  if (!r) return null;
  const a = (Array.isArray(r.results) ? r.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function hs(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Mr = ["base", "discente", "verdadeiro"];
function Or(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function ys(e) {
  return typeof e == "string" && Mr.includes(e);
}
const { ApplicationV2: As } = foundry.applications.api;
class ee extends As {
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
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${$(Ze)}</p>
        <div>
          <h2>${$(t)}</h2>
          <p>${$(Cs(this.input.ritual))}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.input.variantOptions.map((o) => Rs(o, this.input.cost)).join("")}
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
          <div><dt>Custo base</dt><dd>${$(n)}</dd></div>
          <div><dt>Conjurador</dt><dd>${$(this.input.actor.name ?? "Ator sem nome")}</dd></div>
          <div><dt>Alvos</dt><dd>${$(r)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.input.automationStatus ?? "assisted"}">
        <h3>Automação</h3>
        ${ks(this.input)}
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
    const r = $s(t), n = Ts(r, this.input.defaultSpendResource);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function Rs(e, t) {
  const r = e.variant === "base" ? "checked" : "", n = e.enabled ? "" : "disabled", a = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.finalCostText ?? bs(t), s = [...e.details, e.enabled ? "" : e.unavailableReason ?? "não disponível neste ritual"].filter((i) => i.trim().length > 0).filter((i) => !i.toLocaleLowerCase().startsWith("custo final")).map((i) => `<span>${$(i)}</span>`).join("");
  return `
    <label class="paranormal-toolkit-ritual-cast__form${a}">
      <input type="radio" name="variant" value="${$(e.variant)}" ${r} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${$(e.label)}</strong>
        <em>${$(o)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${s}</span>
    </label>
  `;
}
function bs(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function ks(e) {
  return e.automationStatus === "generic" ? `
      <p><strong>Sem automação configurada.</strong></p>
      <p>O Toolkit vai registrar a conjuração e gastar o recurso escolhido. Rolagens, dano, resistência e efeitos continuam manuais.</p>
    ` : `
    <p><strong>Automação assistida disponível.</strong></p>
    <p>O Toolkit vai preparar custo, rolagens e ações assistidas no card persistente do chat.</p>
  `;
}
function Ts(e, t) {
  const r = ws(e), n = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: n
  };
}
function ws(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return ys(t) ? t : "base";
}
function $s(e) {
  return (e.currentTarget instanceof HTMLElement ? e.currentTarget : null)?.closest(".paranormal-toolkit-ritual-cast") ?? null;
}
function Cs(e) {
  const t = e.system, r = [Is(t?.element), Ps(t?.circle)].filter(Ss);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function Ps(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : `${e}º Círculo`;
}
function Is(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function Ss(e) {
  return typeof e == "string" && e.length > 0;
}
function $(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function Es(e) {
  return ee.request(e);
}
const Fr = {
  label: "Padrão"
};
class _s {
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
    const n = this.resolveCostPreview(t), a = ri(r, n), o = await Es({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((l) => l.name),
      cost: n,
      defaultSpendResource: ii(r),
      variantOptions: a,
      automationStatus: oi(r) ? "generic" : "assisted"
    });
    if (!o)
      return { status: "cancelled" };
    const s = si(r, o.variant), i = br();
    let d = null;
    if (i) {
      const l = await Ls(this.resources, t.actor, o, s, n);
      if (!l.ok)
        return {
          status: "failed",
          reason: l.reason,
          message: l.message
        };
      try {
        d = await ls(t.actor);
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
    const p = Ns(r, o, s, n, {
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
    const h = await this.workflow.runAutomation(p, {
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
    if (!h.ok)
      return {
        status: "failed",
        reason: h.error.reason,
        message: h.error.message,
        cause: h.error
      };
    const A = h.value.context, R = Ds(r, t, A), T = Ee(r, o, s, n, A, d);
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
function Ns(e, t, r, n, a) {
  const o = [];
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || st(s) && (!a.includeCostSteps || !t.spendResource) || o.push(vs(s, r));
  return a.includeCostSteps && t.spendResource && n && ci(r.extraCost) && o.push({
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
async function Ls(e, t, r, n, a) {
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
function Ds(e, t, r) {
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
    const s = Vs(a.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(...Ms(e, a, i, o.value));
  }
  return { ok: !0, actions: n };
}
function Ms(e, t, r, n) {
  if (!Bs(e, t))
    return [Bt(t, r, n)];
  const a = Hs();
  return Ur(e).map((o) => {
    const s = js(n, o);
    return Bt(t, r, s, {
      option: o,
      choiceGroupId: a
    });
  });
}
function Bt(e, t, r, n) {
  const a = t.name ?? "Ator sem nome", o = Us(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: Os(e, a, r, n?.option),
    executedLabel: Fs(e, a, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function Os(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function Fs(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Us(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Bs(e, t) {
  return t.operation === "damage" && t.resource === "PV" && Ur(e).length > 1;
}
function Ur(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function js(e, t) {
  const r = e * t.multiplier, n = xs(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function xs(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Hs() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Vs(e, t) {
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
    `Forma: ${Or(t.variant)}`,
    qs(t, r, n),
    ...Gs(o),
    ...i ? [] : Object.values(a.rolls).flatMap(zs),
    ...i ? [] : Ws(e.resistance),
    ...ei(r),
    ...i ? ["Observação: O efeito do ritual não foi resolvido porque a conjuração falhou."] : []
  ];
}
function Gs(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function qs(e, t, r) {
  const n = ye(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function zs(e) {
  const r = [`${ti(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = Ks(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${Js(e.damageType)}`), r;
}
function Ws(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function Ks(e) {
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
    const s = Ys(o);
    s && (Zs(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function Ys(e) {
  const t = Qs(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Xs(e);
}
function Qs(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function Xs(e) {
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
function Zs(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function Js(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function ei(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function ti(e) {
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
function ri(e, t) {
  return Mr.map((r) => {
    const n = Br(e, r), a = r === "base" || n !== null, o = n ?? (r === "base" ? Fr : null);
    return {
      variant: r,
      label: o?.label ?? Or(r),
      enabled: a,
      details: o ? ni(o, t) : [],
      finalCostText: o ? ai(t, o) : null,
      unavailableReason: a ? void 0 : "não disponível neste ritual"
    };
  });
}
function ni(e, t) {
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
function ai(e, t) {
  const r = ye(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function oi(e) {
  return !e.ritualForms && !e.resistance && e.steps.length > 0 && e.steps.every(st);
}
function jt(e, t) {
  return Nr({
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
function si(e, t) {
  return Br(e, t) ?? Fr;
}
function Br(e, t) {
  return e.ritualForms?.[t] ?? null;
}
function ii(e) {
  return e.steps.some(st);
}
function st(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function ci(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function li(e, t) {
  const r = await di(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: fi(r),
    total: pi(r),
    diceBreakdown: gi(r)
  };
}
function jr(e) {
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
async function di(e, t) {
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
  return mi(n);
}
function mi(e) {
  return xt(e) ? e : Array.isArray(e) ? e.find(xt) ?? null : null;
}
function xt(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function fi(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function pi(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function gi(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(hi);
  if (!r) return null;
  const a = (Array.isArray(r.results) ? r.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function hi(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const xr = "itemUsePrompts", Hr = "chatCard", Ae = "data-paranormal-toolkit-prompt-id", Re = "data-paranormal-toolkit-pending-id", it = "data-paranormal-toolkit-executed-label", Ve = "data-paranormal-toolkit-choice-group", Vr = "data-paranormal-toolkit-skipped-label", Ht = "data-paranormal-toolkit-action-section", Vt = "data-paranormal-toolkit-detail-key", Gt = "data-paranormal-toolkit-roll-card", ct = "data-paranormal-toolkit-roll-detail-toggle", Gr = "data-paranormal-toolkit-roll-detail-id", qr = "data-paranormal-toolkit-resistance-roll-button", zr = "data-paranormal-toolkit-resistance-skill", Wr = "data-paranormal-toolkit-resistance-skill-label", Kr = "data-paranormal-toolkit-resistance-target-actor-id", Yr = "data-paranormal-toolkit-resistance-target-name", Qr = "data-paranormal-toolkit-resistance-roll-result", qt = "data-paranormal-toolkit-system-card-replaced", yi = `[${Re}]`, Ai = `[${ct}]`, Ri = `[${qr}]`, Ge = `${u}-chat-enrichment`, f = `${u}-item-use-prompt`, bi = `${f}__actions`, zt = `${f}__details`, Xr = `${f}__summary`, ki = `${f}__title`, Zr = `${f}__button--executed`, Wt = `${f}__roll-card`;
let Kt = !1, qe = null;
const P = /* @__PURE__ */ new Map(), Ti = [0, 100, 500, 1500, 3e3], wi = 3e4, $i = [0, 100, 500, 1500, 3e3];
function Ci(e) {
  if (qe = e, Kt) {
    Qt(e);
    return;
  }
  const t = (r, n) => {
    en(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Kt = !0, Qt(e);
}
async function Yt(e) {
  const t = Jr(e);
  P.set(e.pendingId, t), await dt(t) || dn(t), tn(e.pendingId);
}
async function Pi(e) {
  const t = Jr({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await dt(t) || dn(t), tn(e.pendingId);
}
async function _e(e, t) {
  const r = P.get(e);
  P.delete(e), r && await Cc(r, t);
}
function ut(e) {
  const t = yn();
  for (const r of t) {
    const n = v(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function Ii(e, t) {
  const r = ut(e);
  if (!r) return;
  const n = v(r.message), a = n[e];
  a && (n[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Y(r.message, n));
}
async function Si(e, t, r) {
  if (!t) return;
  const n = ut(e);
  if (!n) return;
  const a = v(n.message);
  let o = !1;
  for (const [s, i] of Object.entries(a))
    s !== e && i.choiceGroupId === t && (a[s] = {
      ...i,
      executedLabel: r ?? i.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Y(n.message, a);
}
function Jr(e) {
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
    summary: ec(e.context),
    executed: !1
  };
}
function en(e, t, r) {
  $c();
  const n = ke(t);
  if (!n) return;
  const a = kc(e, n);
  a.length > 0 && me(n);
  for (const o of a)
    ze(n, o);
  an(n, r), We(n), Ke(n);
}
function Qt(e) {
  for (const t of $i)
    globalThis.setTimeout(() => {
      Ei(e);
    }, t);
}
function Ei(e) {
  for (const t of _i()) {
    const r = be(t);
    Ni(r) && en(r, t, e);
  }
}
function _i() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function Ni(e) {
  return e ? mt(e) ? !0 : Ic(e).length > 0 : !1;
}
function tn(e) {
  const t = P.get(e);
  if (!t) return;
  const r = t.messageId ? Tc(t.messageId) : null;
  if (r) {
    tr(r, t), me(r), ze(r, t), Xt(r), We(r), Ke(r);
    return;
  }
  if (t.messageId) {
    Xe(t);
    return;
  }
  const n = wc(t);
  if (n) {
    tr(n, t), me(n), ze(n, t), Xt(n), We(n), Ke(n);
    return;
  }
  Xe(t);
}
function Xt(e) {
  qe && an(e, qe);
}
function me(e) {
  const t = Li();
  e.classList.toggle(`${f}--system-card-replaced`, t);
  const r = nn(e);
  if (!r || (r.classList.toggle(`${f}__host--system-card-replaced`, t), !t) || r.getAttribute(qt) === "true") return;
  const n = r.querySelector(`.${Ge}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(qt, "true");
}
function Li() {
  try {
    return Aa() === "replace";
  } catch {
    return !1;
  }
}
function ze(e, t) {
  if (me(e), e.querySelector(`[${Ae}="${Q(t.pendingId)}"]`)) return;
  const r = vi(e, t);
  Mi(r, t), Yi(r, Qi(t)).append(Ji(t));
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
  s.classList.add(ki), s.textContent = Di(t);
  const i = document.createElement("span");
  return i.classList.add(Xr), i.textContent = t.summary, a.append(o, s, i), n.append(a), rc(e).append(n), n;
}
function Di(e) {
  const t = k(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function Mi(e, t) {
  const r = t.summaryLines ?? [], n = un(r, t);
  if (n) {
    Oi(e, n, t);
    return;
  }
  Xi(e, r);
}
function Oi(e, t, r) {
  if (e.querySelector(`[${Gt}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(Wt, `${Wt}--${t.intent}`), n.setAttribute(Gt, "true"), t.castingCheck && Zt(n, Ui(t.castingCheck), r.pendingId, "casting"), Fi(t) && Zt(n, Bi(t), r.pendingId, "effect"), Gi(n, t), qi(n, t, r), Ki(n, t), e.append(n);
}
function Fi(e) {
  return e.intent !== "casting";
}
function Ui(e) {
  const t = e.success ? "Sucesso" : "Falha";
  return {
    kind: "casting",
    title: "Conjuração",
    label: e.label,
    formula: e.formula,
    total: e.total,
    diceBreakdown: e.diceBreakdown,
    status: e.success ? "success" : "failure",
    statusLabel: t,
    description: `${e.label}: ${e.total} vs DT ${e.difficulty}`,
    detailRows: [
      { label: "Perícia", value: e.label },
      { label: "DT", value: String(e.difficulty) },
      { label: "Resultado", value: t },
      { label: "Fórmula", value: e.formula },
      ...e.diceBreakdown ? [{ label: "Dados", value: e.diceBreakdown }] : []
    ]
  };
}
function Bi(e) {
  const t = e.intent === "healing" ? "Cura" : e.intent === "damage" ? "Dano" : e.label, r = e.damageType ? `${e.damageType}` : null;
  return {
    kind: "effect",
    title: t,
    label: e.label,
    formula: e.formula,
    total: e.total,
    diceBreakdown: e.diceBreakdown,
    description: r,
    detailRows: [
      { label: "Fórmula", value: e.formula },
      ...e.diceBreakdown ? [{ label: "Dados", value: e.diceBreakdown }] : [],
      ...e.damageType ? [{ label: "Tipo", value: e.damageType }] : []
    ]
  };
}
function Zt(e, t, r, n) {
  const a = document.createElement("section");
  a.classList.add(
    `${f}__workflow-section`,
    `${f}__workflow-section--${t.kind}`
  ), t.status && a.classList.add(`${f}__workflow-section--${t.status}`);
  const o = document.createElement("div");
  o.classList.add(`${f}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, o.append(s), t.statusLabel) {
    const i = document.createElement("span");
    i.classList.add(`${f}__workflow-section-status`), i.textContent = t.statusLabel, o.append(i);
  }
  if (a.append(o), t.description) {
    const i = document.createElement("span");
    i.classList.add(`${f}__workflow-section-description`), i.textContent = t.description, a.append(i);
  }
  ji(a, t), Wi(a, t.detailRows, r, n, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function ji(e, t) {
  const r = document.createElement("div");
  r.classList.add(`${f}__workflow-roll`);
  const n = document.createElement("span");
  n.classList.add(`${f}__workflow-roll-formula`), n.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${f}__workflow-roll-total`), a.textContent = String(t.total), r.append(n, a);
  const o = xi(t.formula, t.diceBreakdown);
  o && r.append(o), e.append(r);
}
function xi(e, t) {
  const r = Hi(t);
  if (r.length === 0) return null;
  const n = document.createElement("div");
  n.classList.add(`${f}__workflow-dice-tray`);
  for (const a of Vi(r, e)) {
    const o = document.createElement("span");
    o.classList.add(`${f}__workflow-die`), a.active || o.classList.add(`${f}__workflow-die--inactive`), o.textContent = String(a.value), n.append(o);
  }
  return n;
}
function Hi(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((n) => Number(n.trim())).filter((n) => Number.isFinite(n)).map((n) => Math.trunc(n)) : [];
}
function Vi(e, t) {
  if (e.length <= 1) return e.map((n) => ({ value: n, active: !0 }));
  const r = t.toLowerCase();
  return r.includes("kh") ? Jt(e, "highest") : r.includes("kl") ? Jt(e, "lowest") : e.map((n) => ({ value: n, active: !0 }));
}
function Jt(e, t) {
  const r = t === "highest" ? Math.max(...e) : Math.min(...e);
  let n = !1;
  return e.map((a) => {
    const o = !n && a === r;
    return o && (n = !0), { value: a, active: o };
  });
}
function Gi(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(qc);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${f}__roll-meta`);
  for (const a of r) {
    const o = document.createElement("span");
    o.classList.add(`${f}__roll-meta-pill`), o.textContent = a, n.append(o);
  }
  e.append(n);
}
function qi(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${f}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${f}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = zi(t, r);
  a.append(o), s && a.append(s);
  const i = document.createElement("span");
  i.classList.add(`${f}__resistance-description`), i.textContent = t.resistance, n.append(a, i), t.resistanceRollResult && n.append(rn(t.resistanceRollResult)), e.append(n);
}
function zi(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${f}__resistance-roll-button`), r.setAttribute(Ae, t.pendingId), r.setAttribute(qr, "true"), r.setAttribute(zr, e.resistanceSkill), r.setAttribute(Wr, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(Kr, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(Yr, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${f}__resistance-roll-button--rolled`), r.setAttribute(Qr, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${f}__resistance-roll-fallback`), a.textContent = "d20", r.append(n, a), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function rn(e) {
  const t = document.createElement("span");
  return t.classList.add(`${f}__resistance-roll-result`), t.textContent = sn(e), t;
}
function Wi(e, t, r, n, a) {
  const o = t.filter((p) => p.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${r}-roll-details-${n}`, i = document.createElement("button");
  i.type = "button", i.classList.add(`${f}__roll-detail-toggle`), i.setAttribute(ct, s), i.setAttribute("aria-expanded", "false"), i.textContent = a;
  const d = document.createElement("dl");
  d.classList.add(`${f}__roll-detail-list`), d.setAttribute(Gr, s), d.hidden = !0;
  for (const p of o) {
    const h = document.createElement("dt");
    h.textContent = p.label;
    const A = document.createElement("dd");
    A.textContent = p.value, d.append(h, A);
  }
  e.append(i, d);
}
function Ki(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${f}__workflow-notes`);
  for (const n of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = n, r.append(a);
  }
  e.append(r);
}
function Yi(e, t) {
  const r = `[${Ht}="${Q(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const a = document.createElement("div");
  a.classList.add(bi), a.setAttribute(Ht, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${f}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function Qi(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = un(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Xi(e, t) {
  if (t.length === 0) return;
  const r = Zi(e);
  for (const n of t) {
    const a = zc(n);
    if (r.querySelector(`[${Vt}="${Q(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = n, o.setAttribute(Vt, a), r.append(o);
  }
}
function Zi(e) {
  const t = e.querySelector(`.${zt}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(zt), e.append(r), r;
}
function Ji(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${f}__button`), t.setAttribute(Ae, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Zr), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Re, e.pendingId), t.setAttribute(it, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Ve, e.choiceGroupId), t.setAttribute(Vr, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function ec(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = tc(e);
  return `${t} → ${r}`;
}
function tc(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function rc(e) {
  return nn(e) ?? e;
}
function nn(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function an(e, t) {
  const r = ke(e);
  if (!r) return;
  const n = r.querySelectorAll(yi);
  for (const a of n)
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      hc(a, t);
    }));
}
function We(e) {
  const t = ke(e);
  if (!t) return;
  const r = t.querySelectorAll(Ai);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      nc(t, n);
    }));
}
function Ke(e) {
  const t = ke(e);
  if (!t) return;
  const r = t.querySelectorAll(Ri);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      ac(t, n);
    }));
}
function nc(e, t) {
  const r = t.getAttribute(ct);
  if (!r) return;
  const n = e.querySelector(`[${Gr}="${Q(r)}"]`);
  if (!n) return;
  const a = n.hidden;
  n.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function ac(e, t) {
  const r = t.getAttribute(Ae), n = t.getAttribute(zr), a = t.getAttribute(Wr) ?? (n ? jr(n) : "Resistência");
  if (!r || !n) return;
  const o = ic(e, r), s = cc(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await li(s, n);
    await fc(d.roll);
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
    oc(t, p), sc(t, p), pc(r, p), await gc(e, r, p);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function oc(e, t) {
  e.classList.add(`${f}__resistance-roll-button--rolled`), e.setAttribute(Qr, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function sc(e, t) {
  const r = e.closest(`.${f}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${f}__resistance-roll-result`), a = n ?? rn(t);
  if (n) {
    n.textContent = sn(t);
    return;
  }
  r.append(a);
}
function ic(e, t) {
  const r = P.get(t);
  if (r) return r;
  const n = be(e);
  return v(n)[t] ?? null;
}
function cc(e, t) {
  const r = e?.resistanceTargetActor;
  if (N(r)) return r;
  const a = e?.context?.targets.map(Ye).find(N) ?? null;
  if (a) return a;
  const o = t.getAttribute(Kr) ?? e?.resistanceTargetActorId ?? null, s = o ? lc(o) : null;
  return s || dc(
    t.getAttribute(Yr) ?? e?.resistanceTargetName ?? uc(t)
  );
}
function uc(e) {
  const r = e.closest(`.${f}`)?.querySelector(`.${Xr}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const a = r.split(n), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Ye(e) {
  const t = e.actor;
  if (N(t)) return t;
  const r = e.token, n = te(r);
  if (n) return n;
  const a = e.document;
  return te(a);
}
function te(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (N(t)) return t;
  const r = e.document?.actor;
  return N(r) ? r : null;
}
function lc(e) {
  const r = game.actors?.get?.(e);
  return N(r) ? r : on().map((o) => te(o)).find((o) => o?.id === e) ?? null;
}
function dc(e) {
  const t = z(e);
  if (!t) return null;
  const r = on().filter((o) => z(mc(o)) === t).map((o) => te(o)).find(N) ?? null;
  if (r) return r;
  const a = game.actors?.find?.((o) => N(o) && z(o.name) === t);
  return N(a) ? a : null;
}
function on() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function mc(e) {
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
function N(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function sn(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function fc(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function pc(e, t) {
  const r = P.get(e);
  r && (r.resistanceRollResult = t);
}
async function gc(e, t, r) {
  const n = be(e);
  if (n)
    try {
      const a = v(n), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: r
      }, await Y(n, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function be(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return L(n?.get?.(r));
}
async function hc(e, t) {
  const r = e.getAttribute(Re);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    cn(e, e.getAttribute(it) ?? "✓ Automação aplicada"), yc(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function cn(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Zr), e.removeAttribute(Re), e.removeAttribute(it);
}
function yc(e) {
  const t = e.getAttribute(Ve);
  if (!t) return;
  const r = e.closest(`.${f}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${Ve}="${Q(t)}"]`;
  for (const a of r.querySelectorAll(n)) {
    if (a === e) continue;
    const o = a.getAttribute(Vr) ?? "✓ Outra opção escolhida";
    cn(a, o);
  }
}
function un(e, t) {
  const r = e.map(lt).filter(Vc), n = r.find((l) => l.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const a = k(e, "Forma"), o = k(e, "Custo"), s = k(e, "Dados") ?? k(e, `Dados (${n.label})`), i = k(e, "Tipo"), d = k(e, "Resistência"), p = k(e, "Resistência Perícia"), h = k(e, "Resistência Rótulo") ?? (p ? jr(p) : null), A = ln(e, "Observação"), R = e.filter((l) => bc(l, n)), T = Ac(e);
  return {
    ...n,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: a,
    cost: o,
    diceBreakdown: s,
    damageType: i,
    resistance: d,
    resistanceSkill: p,
    resistanceSkillLabel: h,
    notes: A,
    details: R,
    castingCheck: T,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function Ac(e) {
  const t = e.map(lt).find((o) => o?.intent === "casting") ?? null, r = k(e, "Conjuração DT"), n = k(e, "Conjuração Resultado");
  if (!t || !r || !n) return null;
  const a = Number(r);
  return Number.isFinite(a) ? {
    label: t.formula,
    formula: k(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: n.toLowerCase() === "sucesso",
    diceBreakdown: k(e, "Dados (Conjuração)")
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
    intent: Rc(r)
  } : null;
}
function Rc(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function k(e, t) {
  return ln(e, t)[0] ?? null;
}
function ln(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const a = n.slice(r.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function bc(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || lt(e) ? !1 : e.trim().length > 0;
}
function kc(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of P.values())
    Qe(n, e, t) && r.set(n.pendingId, n);
  for (const n of Pc(e))
    Qe(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, a) => n.createdAt - a.createdAt);
}
function Qe(e, t, r) {
  const n = M(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !er(r, "itemId", e.itemId) ? !1 : !e.actorId || er(r, "actorId", e.actorId);
}
function er(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${Wc(t)}`;
  for (const a of e.querySelectorAll(`[${n}]`))
    if (a.getAttribute(n) === r)
      return !0;
  return !1;
}
function Tc(e) {
  const t = Q(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function wc(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Qe(e, null, t))
      return t;
  return null;
}
function $c() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of P.entries())
    e - n.createdAt > t && P.delete(r);
}
async function tr(e, t) {
  const r = be(e);
  if (!r) return !1;
  try {
    const n = v(r);
    return n[t.pendingId] = ft(t, M(r)), await Y(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function dt(e) {
  const t = pn(e);
  if (!t) return !1;
  try {
    const r = v(t);
    return r[e.pendingId] = ft(e, M(t)), await Y(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function dn(e) {
  for (const t of Ti)
    globalThis.setTimeout(() => {
      Xe(e);
    }, t);
}
async function Xe(e) {
  const t = pn(e);
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
async function Cc(e, t) {
  const r = fn(e.context.message);
  if (r)
    try {
      const n = v(r), a = n[e.pendingId] ?? ft(e, M(r));
      n[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Y(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function Pc(e) {
  return Object.values(v(L(e))).filter(ae);
}
function v(e) {
  if (!e) return {};
  const t = {}, r = mt(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, a] of Object.entries(mn(e)))
    t[n] ??= a;
  return t;
}
function Ic(e) {
  return Object.values(mn(L(e))).filter(ae);
}
function mn(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, xr);
  if (!W(t))
    return {};
  const r = {};
  for (const [n, a] of Object.entries(t))
    ae(a) && (r[n] = a);
  return r;
}
async function Y(e, t) {
  typeof e.setFlag == "function" && (await Ec(e, t), await Sc(e, t));
}
async function Sc(e, t) {
  await Promise.resolve(e.setFlag?.(u, xr, t));
}
function mt(e) {
  if (!e) return null;
  const t = e.getFlag?.(u, Hr);
  return xc(t) ? t : null;
}
async function Ec(e, t) {
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
      actorName: _c(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(u, Hr, a));
}
function _c(e) {
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
function fn(e) {
  const t = L(e);
  if (t?.setFlag)
    return t;
  const r = Nc(e);
  if (r?.setFlag)
    return r;
  const n = M(e);
  if (!n) return null;
  const a = game.messages;
  return L(a?.get?.(n));
}
function Nc(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(L).find((r) => typeof r?.setFlag == "function") ?? null;
}
function pn(e) {
  const t = fn(e.context.message);
  if (t) return t;
  const r = e.messageId ? Lc(e.messageId) : null;
  if (r) return r;
  const n = yn().slice().reverse();
  return n.find((a) => vc(a, e)) ?? n.find((a) => Dc(a, e)) ?? null;
}
function Lc(e) {
  const t = game.messages;
  return L(t?.get?.(e));
}
function vc(e, t) {
  const r = M(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!gn(e, t)) return !1;
  const a = hn(e);
  return !t.actorId || !a || a === t.actorId;
}
function Dc(e, t) {
  if (!Oc(e, t)) return !1;
  const r = hn(e);
  return t.actorId && r === t.actorId ? !0 : gn(e, t);
}
function gn(e, t) {
  const r = z(Mc(e));
  if (!r) return !1;
  const n = z(t.itemName);
  if (n && r.includes(n)) return !0;
  const a = z(t.itemId);
  return !!(a && r.includes(a));
}
function Mc(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function hn(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Oc(e, t) {
  const r = Fc(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= wi;
}
function Fc(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function L(e) {
  return e && typeof e == "object" ? e : null;
}
function ae(e) {
  return W(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && w(e.messageId) && w(e.itemId) && w(e.actorId) && w(e.itemName) && j(e.resistanceTargetActorId) && j(e.resistanceTargetName) && Hc(e.resistanceRollResult) && Uc(e.actionPayload) && Ne(e.title) && Ne(e.buttonLabel) && Ne(e.executedLabel) && j(e.choiceGroupId) && j(e.skippedLabel) && j(e.actionSectionId) && j(e.actionSectionTitle) && Gc(e.summaryLines) : !1;
}
function Uc(e) {
  return e == null ? !0 : W(e) ? e.kind === "resource-operation" && w(e.actorId) && w(e.actorUuid) && typeof e.actorName == "string" && Bc(e.resource) && jc(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Bc(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function jc(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function xc(e) {
  return W(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && w(e.messageId) && W(e.source) && w(e.source.actorId) && w(e.source.actorName) && w(e.source.itemId) && w(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ae) : !1;
}
function Hc(e) {
  return e == null ? !0 : W(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && j(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Vc(e) {
  return e !== null;
}
function W(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function w(e) {
  return e === null || typeof e == "string";
}
function Ne(e) {
  return e === void 0 || typeof e == "string";
}
function j(e) {
  return e == null || typeof e == "string";
}
function Gc(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function qc(e) {
  return typeof e == "string" && e.length > 0;
}
function yn() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(L).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(L).filter((n) => n !== null) : [];
}
function ke(e) {
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
function zc(e) {
  return e.trim().toLowerCase();
}
function Wc(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Q(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const rr = 1e3;
class Kc {
  constructor(t, r, n, a) {
    this.workflow = t, this.resources = r, this.debugOutput = a, this.ritualAssistant = new _s(t, r, n);
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
      settings: kt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = kt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = Je(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && Yc(t.item) && r.executionMode === "ask") {
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
        data: ve(t, "failed", "missing-actor")
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
    const n = r.prompt.actionPayload, a = Zc(n);
    if (!a)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const o = await de(this.resources, a, n.resource, n.operation, n.amount);
    return o.ok ? (await Ii(t), await Si(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Ci((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
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
        data: ve(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, Qc(t.item));
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
    const n = De();
    await Pi({
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
      const i = De();
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
        actionPayload: Xc(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", o), c.info("Ritual assistido preparado com ações pendentes.", x(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = De();
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
    const r = Date.now(), n = nr(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      r - s > rr && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(n);
    return a !== void 0 && r - a <= rr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(nr(t), Date.now());
  }
  setAttempt(t, r, n, a) {
    this.lastAttempt = ve(t, r, n, a);
  }
}
function Yc(e) {
  return e.type === "ritual";
}
function Qc(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Xc(e) {
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
function Zc(e) {
  const t = e.actorUuid ? Jc(e.actorUuid) : null;
  if (K(t)) return t;
  const r = e.actorId ? eu(e.actorId) : null;
  return r || tu(e.actorName);
}
function Jc(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function eu(e) {
  const r = game.actors?.get?.(e);
  if (K(r)) return r;
  for (const n of An()) {
    const a = pt(n);
    if (a?.id === e) return a;
  }
  return null;
}
function tu(e) {
  const t = Le(e);
  if (!t) return null;
  for (const a of An()) {
    const o = ru(a);
    if (Le(o) === t) {
      const s = pt(a);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((a) => K(a) && Le(a.name) === t);
  return K(n) ? n : null;
}
function An() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function ru(e) {
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
function Le(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function K(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ve(e, t, r, n) {
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
function nr(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function De() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class nu {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], a = [], o = ne(t);
    for (const s of r) {
      const i = s.itemId ? o.find((h) => h.id === s.itemId) ?? null : null, d = s.match?.preset ?? null;
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
class au {
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
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = ou(t);
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
      reason: su(n, r.preset)
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
function ou(e) {
  const t = e.getFlag(u, "automation");
  return et(t) ? t : null;
}
function su(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function ue(e) {
  return (t) => t.status === e;
}
class iu {
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
    const r = y(t.actorName), n = y(t.resource), a = y(ar(t)), o = y(uu(t));
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
    const n = y(r.title ?? "Automação"), a = r.message ? `<p>${y(r.message)}</p>` : "", o = y(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = y(t.item.name ?? "Item sem nome"), i = t.targets.length > 0 ? t.targets.map((l) => y(l.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (l) => `<li><strong>${y(l.id)}:</strong> ${y(l.formula)} = ${l.total} <em>(${y(cu(l.intent))})</em>${l.damageType ? ` — ${y(l.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (l) => `<li><strong>${y(l.itemName)}:</strong> ${l.circle}º círculo — ${l.amount} ${y(l.resource)} (${y(lu(l.source))})</li>`
    ), h = t.damageInstances.map(
      (l) => `<li><strong>${y(l.targetActorName)}:</strong> bruto ${l.rawAmount}${l.damageType ? ` ${y(l.damageType)}` : ""} &rarr; final ${l.finalAmount} &rarr; aplicado ${l.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (l) => `<li><strong>${y(l.targetActorName)}:</strong> bruto ${l.rawAmount} &rarr; final ${l.finalAmount} &rarr; aplicado ${l.appliedAmount}</li>`
    ), R = t.resourceTransactions.map(
      (l) => `<li><strong>${y(l.actorName)}:</strong> ${y(ar(l))} — ${l.before.value}/${l.before.max} &rarr; ${l.after.value}/${l.after.max}</li>`
    ), T = t.phases.map((l) => y(l)).join(" &rarr; ");
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
          ${h.length > 0 ? `<p><strong>Dano:</strong></p><ul>${h.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Cura:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${T}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function cu(e) {
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
function ar(e) {
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
function uu(e) {
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
function lu(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function y(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function du() {
  const e = new Ha(), t = new Fo(e), r = new qa(), n = new Ka(r), a = new co(e), o = new lo(), s = o.registerMany(Xn());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new uo(), d = new so(), p = new au(o), h = new nu(p, i, d), A = new xo(), R = new iu(A), T = new jo(), l = new Mo(t, n, R, T), I = new Bo(l, T), Te = new Kc(I, t, n, A);
  return Te.addStrategy(new ao((kn) => Te.handleItemUsed(kn))), {
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
    ritualPresetApplications: h
  };
}
const { ApplicationV2: mu } = foundry.applications.api;
class fe extends mu {
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
      ${r.length > 0 ? fu(r) : gu(t)}
    </section>
  `;
}
function fu(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(pu).join("")}</ol>`;
}
function pu(e) {
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
function gu(e) {
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
const pe = `${u}.manageRitualPresets`, or = `__${u}_ritualPresetHeaderControlRegistered`, hu = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function yu(e) {
  const t = globalThis;
  if (!t[or]) {
    for (const r of hu)
      Hooks.on(r, (n, a) => {
        Au(n, a, e);
      });
    t[or] = !0, c.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Au(e, t, r) {
  Array.isArray(t) && bu(e) && (Ru(e, r), !t.some((n) => n.action === pe) && t.push({
    action: pe,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), Rn(e, r);
    }
  }));
}
function Ru(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[pe] && (e.options.actions[pe] = (r) => {
    r.preventDefault(), r.stopPropagation(), Rn(e, t);
  }));
}
function bu(e) {
  if (!game.user?.isGM) return !1;
  const t = bn(e);
  return t ? t.type === "agent" && ne(t).length > 0 : !1;
}
function Rn(e, t) {
  const r = bn(e);
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
function bn(e) {
  return sr(e.actor) ? e.actor : sr(e.document) ? e.document : null;
}
function sr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let V = null;
Hooks.once("init", () => {
  Kn(), ya(), ja(), c.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!wt.isSupportedSystem()) {
    c.warn(
      `Sistema não suportado: ${wt.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  V = du(), V.itemUseIntegration.registerStrategies(), Pa(V), Fa(), va(), yu(V), c.info("Inicializado para o sistema Ordem Paranormal."), c.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Ze} inicializado.`);
});
function ku() {
  if (!V)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return V;
}
export {
  ku as getToolkitServices
};
//# sourceMappingURL=main.js.map
