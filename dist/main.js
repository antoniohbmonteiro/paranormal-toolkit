const u = "paranormal-toolkit", Ot = "Paranormal Toolkit", Br = "ordemparanormal";
class G {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function oe(e) {
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
function g(e) {
  return { ok: !0, value: e };
}
function d(e) {
  return { ok: !1, error: e };
}
function Fe(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? d({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Me(t) ? g(t.definition) : d({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function xr(e) {
  return Me(e.getFlag(u, "automation"));
}
function Me(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Vr(t.source) && Hr(t.definition);
}
function Hr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && b(t.label) && Array.isArray(t.steps) && t.steps.every(jr);
}
function Vr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? b(t.presetId) && b(t.presetVersion) && b(t.appliedAt) : t.type === "manual" ? b(t.label) && b(t.appliedAt) : !1;
}
function jr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return qr(t);
    case "spendRitualCost":
      return Gr(t);
    case "rollFormula":
      return zr(t);
    case "modifyResource":
      return Wr(t);
    case "chatCard":
      return Kr(t);
    default:
      return !1;
  }
}
function qr(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ft(t);
}
function Gr(e) {
  return e.type === "spendRitualCost";
}
function zr(e) {
  const t = e;
  return t.type === "rollFormula" && b(t.id) && b(t.formula) && (t.intent === void 0 || Zr(t.intent)) && (t.damageType === void 0 || b(t.damageType));
}
function Wr(e) {
  const t = e;
  return t.type === "modifyResource" && Yr(t.actor) && Qr(t.resource) && Xr(t.operation) && Ft(t);
}
function Kr(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Ft(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || b(e.amountFrom);
}
function Yr(e) {
  return e === "self" || e === "target";
}
function Qr(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Xr(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Zr(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function b(e) {
  return typeof e == "string" && e.length > 0;
}
function Ue(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(Ye);
    if (ta(t))
      return Array.from(t).filter(Ye);
  }
  return [];
}
function Jr(e) {
  return Ue(e)[0] ?? null;
}
function ea(e) {
  return Ue(e).find(xr) ?? null;
}
function ta(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ye(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function z(e) {
  return Ue(e).filter((t) => t.type === "ritual");
}
function Mt(e) {
  return z(e)[0] ?? null;
}
function ra(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(oe);
      return i.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = V("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = K(t);
      if (!r) return [];
      const a = e.automationRegistry.findForItem(r).map(Ze);
      return i.info(`Presets encontrados para ${r.name}.`, a), a;
    },
    async applyPresetToFirstRitual(t) {
      const r = V("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const a = K(r);
      if (!a) return;
      const n = e.automationRegistry.require(t);
      if (!n.ok) {
        i.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      const o = await Te(e, a, n.value);
      i.info(`Preset ${n.value.id} aplicado em ${a.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = V("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = K(t);
      if (!r) return;
      const a = e.automationRegistry.findForItem(r)[0];
      if (!a) {
        i.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const n = await Te(e, r, a.preset);
      i.info(`Melhor preset aplicado em ${r.name}.`, { match: Ze(a), itemPatch: n }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Qe(e);
    },
    async applyBestPresetsToActorRituals() {
      return Qe(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = V("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = K(t);
      r && (await e.automationBinder.clear(r), i.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function Qe(e) {
  const t = V("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = z(t);
  if (r.length === 0)
    return i.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Xe(t);
  const a = Xe(t, r.length);
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
    const s = await Te(e, n, o.preset);
    a.applied.push(aa(n, o, s));
  }
  return i.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, a), na(a), a;
}
async function Te(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function aa(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: oe(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function Xe(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function na(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((a) => a.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function Ze(e) {
  return {
    preset: oe(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function V(e) {
  const t = G.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function K(e) {
  const t = Mt(e);
  return t || (i.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function D(e) {
  return e ? {
    id: e.id,
    source: {
      ...oa(e.sourceActor),
      token: e.sourceToken
    },
    item: sa(e.item),
    targets: e.targets.map(ia),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Je(e.rollRequests, Ut),
    rolls: Je(e.rolls, ca),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Be),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Be(e) {
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
function oa(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function sa(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function ia(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Ut(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ca(e) {
  return {
    ...Ut(e),
    total: e.total
  };
}
function Je(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, a]) => [r, t(a)]));
}
function ua(e) {
  return {
    getSelected() {
      return G.getSelectedActor();
    },
    logResources() {
      const t = C(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const r = e.ordem.getActorSnapshot(t);
      i.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && i.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(t) {
      await L(
        e,
        "Gasto de PE",
        C("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await L(
        e,
        "Gasto de PD",
        C("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await L(
        e,
        "Dano em PV",
        C("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await L(
        e,
        "Cura de PV",
        C("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await L(
        e,
        "Dano em SAN",
        C("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await L(
        e,
        "Recuperação de SAN",
        C("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function L(e, t, r, a) {
  if (!r) return;
  const n = await a(r);
  if (!n.ok) {
    la(n.error);
    return;
  }
  const o = n.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    i.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  i.info(`${t} realizado:`, Be(o));
}
function C(e) {
  const t = G.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function la(e) {
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
const $ = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function da() {
  Y($.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Y($.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Y($.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Y($.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function ke() {
  return {
    enabled: Q($.enabled),
    console: Q($.console),
    ui: Q($.ui),
    chat: Q($.chat)
  };
}
async function S(e, t) {
  await game.settings.set(u, $[e], t);
}
function Y(e, t) {
  game.settings.register(u, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Q(e) {
  return game.settings.get(u, e) === !0;
}
function ma() {
  return {
    status() {
      return ke();
    },
    async enable() {
      await S("enabled", !0);
    },
    async disable() {
      await S("enabled", !1);
    },
    async enableConsole() {
      await S("console", !0);
    },
    async disableConsole() {
      await S("console", !1);
    },
    async enableUi() {
      await S("ui", !0);
    },
    async disableUi() {
      await S("ui", !1);
    },
    async enableChat() {
      await S("chat", !0);
    },
    async disableChat() {
      await S("chat", !1);
    }
  };
}
const Bt = "ritual.costOnly", xt = "ritual.simpleHealing", fa = "ritual.eletrocussao", Ht = "ritual.simpleDamage", Vt = "generic.simpleHealing", jt = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function pa() {
  return [
    ga(),
    ha(),
    ya(),
    Aa(),
    Ra()
  ];
}
function ga() {
  return {
    id: Bt,
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
function ha() {
  return {
    id: xt,
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
    automation: qt(),
    itemPatch: Ta()
  };
}
function ya() {
  return {
    id: fa,
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
    automation: ba(),
    itemPatch: ka()
  };
}
function Aa() {
  return {
    id: Ht,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: xe()
  };
}
function Ra() {
  return {
    id: Vt,
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
function qt(e = "2d8+2") {
  return Gt(
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
function ba() {
  return {
    ...xe("1d8", {
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
function xe(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", a = t.title ?? "Ritual de dano simples", n = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Gt(
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
function Ta() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: jt,
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
function ka() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: jt,
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
function Gt(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((a) => a.type !== "rollFormula" || a.id !== t ? a : {
      ...a,
      formula: r
    })
  };
}
function He() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: M(t.id),
    actorId: M(t.actor?.id),
    sceneId: M(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function zt() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: M(e.id),
    actorId: M(t?.id),
    sceneId: M(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function M(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function wa(e) {
  return {
    logFirstRitualCost() {
      const t = E("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const r = v(t);
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
      const a = E("Nenhum ator encontrado para configurar custo customizado.");
      if (!a) return;
      const n = v(a);
      if (n) {
        if (!Ia(t, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await n.setFlag(u, "ritual.cost", {
          resource: r,
          amount: t
        }), i.info(`Custo customizado aplicado em ${n.name}.`, { resource: r, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${n.name} agora custa ${t} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = E("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = v(t);
      r && (await r.unsetFlag(u, "ritual.cost"), i.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = E("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = v(t);
      if (!r) return;
      const a = e.automationRegistry.require(Bt);
      if (!a.ok) {
        i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value), i.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = E("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const a = v(r);
      if (!a) return;
      if (!et(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const n = e.automationRegistry.require(xt);
      if (!n.ok) {
        i.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, n.value, {
        definition: qt(t)
      }), i.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = E("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const a = v(r);
      if (!a) return;
      if (!et(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const n = e.automationRegistry.require(Ht);
      if (!n.ok) {
        i.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, n.value, {
        definition: xe(t)
      }), i.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = E("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = v(t);
      r && await $a(e, t, r);
    }
  };
}
async function $a(e, t, r) {
  const a = Fe(r);
  if (!a.ok) {
    i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const n = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: zt(),
    item: r,
    targets: He()
  });
  if (!n.ok) {
    Pa(n.error);
    return;
  }
  i.info("Automação de ritual executada com sucesso.", D(n.value.context));
}
function Pa(e) {
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
function E(e) {
  const t = G.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function v(e) {
  const t = Mt(e);
  return t || (i.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ia(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function et(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Sa = ["disabled", "ask", "automatic"], Ca = ["buttons", "confirm"], Wt = "ask";
function Ea(e) {
  return typeof e == "string" && Sa.includes(e);
}
function va(e) {
  return typeof e == "string" && Ca.includes(e);
}
function _a(e) {
  return Ea(e) ? e : va(e) ? "ask" : Wt;
}
const ee = {
  executionMode: "itemUse.executionMode",
  autoRun: "itemUse.autoRun.enabled"
};
function Da() {
  game.settings.register(u, ee.executionMode, {
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
    default: Wt
  }), game.settings.register(u, ee.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function tt() {
  return {
    executionMode: _a(game.settings.get(u, ee.executionMode))
  };
}
async function _(e) {
  await game.settings.set(u, ee.executionMode, e);
}
function Na(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await _("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await _("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await _(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await _("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await _("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await _("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await _("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const La = [
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
function Oa(e) {
  return {
    phases() {
      return La;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = de("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = ea(t);
      if (!r) {
        i.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await rt(e, t, r);
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
      if (!Ua(r)) {
        i.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = Ma(r) ?? de("Nenhum ator encontrado para executar automação do item.");
      a && await rt(e, a, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = de("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = Jr(t);
      if (!r) {
        i.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = e.automationRegistry.require(Vt);
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
async function rt(e, t, r) {
  const a = Fe(r);
  if (!a.ok) {
    i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const n = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: zt(),
    item: r,
    targets: He()
  });
  if (!n.ok) {
    Fa(n.error);
    return;
  }
  i.info("Automação executada com sucesso.", D(n.value.context));
}
function Fa(e) {
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
function de(e) {
  const t = G.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ma(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Ua(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ba(e) {
  const t = ua(e), r = ra(e), a = wa(e), n = Oa(e), o = ma(), s = Na(e);
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
    async spendSelectedActorPE(c) {
      await t.spendPE(c);
    }
  };
}
function xa(e) {
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
    debug: Ba(e)
  }, r = globalThis;
  return r[u] = t, r.ParanormalToolkit = t, t;
}
class at {
  static isSupportedSystem() {
    return game.system.id === Br;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Ha() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: U(t.id),
    actorId: U(t.actor?.id),
    sceneId: U(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Kt() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, r = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: U(e.id),
    actorId: U(t?.id),
    sceneId: U(e.scene?.id),
    name: r
  };
}
function Va(e, t = Kt()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function ja(e) {
  if (!za(e)) return null;
  const t = e.getFlag(u, "workflow");
  return Ga(t) ? t : null;
}
function qa() {
  return `flags.${u}.workflow`;
}
function nt(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), r = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || r !== void 0;
}
function ot(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return we(t) || we(r);
}
function Ga(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function za(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function U(e) {
  return we(e) ? e : null;
}
function we(e) {
  return typeof e == "string" && e.length > 0;
}
function Wa() {
  const e = (t, r) => {
    Ka(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Ka(e, t) {
  const r = ja(e);
  if (!r || r.targets.length === 0) return;
  const a = Qa(t);
  if (!a || a.querySelector(`.${u}-chat-enrichment`)) return;
  (a.querySelector(".message-content") ?? a).append(Ya(r));
}
function Ya(e) {
  const t = document.createElement("section");
  t.classList.add(`${u}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(st("Origem", e.source.name)), t.append(st("Alvo", e.targets.map((a) => a.name).join(", "))), t;
}
function st(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${u}-chat-enrichment__row`);
  const a = document.createElement("span");
  a.textContent = `${e}: `;
  const n = document.createElement("span");
  return n.textContent = t, r.append(a, n), r;
}
function Qa(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Xa() {
  Hooks.on("preCreateChatMessage", (e, t, r, a) => {
    if (!Za(a) || !Ja(e) || nt(e) || nt(t)) return;
    const n = Ha();
    if (n.length === 0 || !ot(e) && !ot(t)) return;
    const o = Kt();
    e.updateSource({
      [qa()]: Va(n, o)
    }), i.info("Targets capturados para ChatMessage.", { source: o, targets: n });
  });
}
function Za(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Ja(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const Yt = {
  enabled: "dice.animations.enabled"
};
function en() {
  game.settings.register(u, Yt.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function tn() {
  return {
    enabled: game.settings.get(u, Yt.enabled) === !0
  };
}
const j = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Qt = {
  PV: "system.attributes.hp"
}, $e = {
  PV: [j.PV, Qt.PV],
  SAN: [j.SAN],
  PE: [j.PE],
  PD: [j.PD]
}, Pe = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class rn {
  getResource(t, r) {
    const a = it(t, r);
    if (!a.ok)
      return d(a.error);
    const n = a.value, o = `${n}.value`, s = `${n}.max`, c = foundry.utils.getProperty(t, o), l = foundry.utils.getProperty(t, s), p = ut(t, r, o, c, "valor atual");
    if (p) return d(p);
    const y = ut(t, r, s, l, "valor máximo");
    return y ? d(y) : g({
      value: c,
      max: l
    });
  }
  async updateResourceValue(t, r, a) {
    const n = it(t, r);
    if (!n.ok)
      throw new Error(n.error.message);
    await t.update({ [`${n.value}.value`]: a });
  }
}
function it(e, t) {
  const r = an(e.type, t);
  if (r && ct(e, r))
    return g(r);
  const a = $e[t].find(
    (n) => ct(e, n)
  );
  return a ? g(a) : d({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: nn(e, t),
    path: $e[t].join(" | ")
  });
}
function an(e, t) {
  return e === "threat" ? Qt[t] ?? null : e === "agent" ? j[t] : null;
}
function ct(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), a = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof a == "number" && Number.isFinite(a);
}
function nn(e, t) {
  const r = e.type ?? "unknown", a = $e[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${a}.`;
}
function ut(e, t, r, a, n) {
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
class on {
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
      const s = Pe.ritualItem.circleCandidates;
      return d({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: a, value: n } = r, o = sn(n);
    return o ? g(o) : d({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(n)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: a,
      value: n
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of Pe.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(t, r);
      if (a != null)
        return { path: r, value: a };
    }
    return null;
  }
}
function sn(e) {
  if (lt(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (lt(r))
      return r;
  }
  return null;
}
function lt(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const cn = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class un {
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
    const a = r.value, n = ln(t.ritual, a);
    return n.ok ? n.value ? g(n.value) : g({
      resource: "PE",
      amount: cn[a],
      source: "default-by-circle",
      circle: a
    }) : d(n.error);
  }
}
function ln(e, t) {
  const r = e.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : dn(r) ? {
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
function dn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const me = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function mn(e) {
  if (!An(e.item)) return null;
  const t = Ie(e.actor) ? e.actor : fn(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: gn(e.token) ?? pn(t),
    targets: He(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function fn(e) {
  const t = e;
  return Ie(t.actor) ? t.actor : Ie(e.parent) ? e.parent : null;
}
function pn(e) {
  const t = hn(e) ?? yn(e);
  return t ? Xt(t) : null;
}
function gn(e) {
  return Se(e) ? Xt(e) : null;
}
function hn(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return Se(r) ? r : (t.getActiveTokens?.() ?? []).find(Se) ?? null;
}
function yn(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Xt(e) {
  const t = e.actor ?? null;
  return {
    tokenId: fe(e.id),
    actorId: fe(t?.id),
    sceneId: fe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function An(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ie(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Se(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function fe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Rn {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(me.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, i.info(`${me.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = mn(bn(t));
    if (!r) {
      i.warn(`${me.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function bn(e) {
  return e && typeof e == "object" ? e : {};
}
class Tn {
  async applyPresetItemPatch(t, r) {
    const a = r.itemPatch;
    if (!a) return pe("missing-item-patch");
    if (t.type !== "ritual") return pe("unsupported-item-type");
    const n = kn(a);
    return Object.keys(n).length === 0 ? pe("empty-update") : (await t.update(n), {
      applied: !0,
      updateData: n
    });
  }
}
function kn(e) {
  const t = {};
  R(t, "name", e.name), R(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (R(t, "system.circle", r.circle), R(t, "system.element", r.element), R(t, "system.target", r.target), R(t, "system.targetQtd", r.targetQuantity), R(t, "system.execution", r.execution), R(t, "system.range", r.range), R(t, "system.duration", r.duration), R(t, "system.skillResis", r.resistanceSkill), R(t, "system.resistance", r.resistance), R(t, "system.studentForm", r.studentForm), R(t, "system.trueForm", r.trueForm)), t;
}
function R(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function pe(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class wn {
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
    return this.getNumber(t, Pe.ritual.dt, 0);
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
class $n {
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
class Pn {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = In(t);
    return r.ok ? this.presets.has(t.id) ? d({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, ge(t)), g(t)) : r;
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
    return r ? ge(r) : null;
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
    return Array.from(this.presets.values()).map(ge);
  }
  findForItem(t) {
    return this.list().map((r) => Sn(r, t)).filter((r) => r !== null).sort((r, a) => a.score - r.score || r.preset.id.localeCompare(a.preset.id));
  }
}
function In(e) {
  return !he(e.id) || !he(e.version) || !he(e.label) ? d({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? d({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : g(e);
}
function Sn(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let a = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    a += 10, r.push(`itemType:${t.type}`);
  }
  for (const n of e.matchers) {
    const o = Cn(n, t);
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
function Cn(e, t) {
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
      const r = dt(t.name), a = e.names.map(dt).includes(r);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = En(t), a = r !== null && e.circles.includes(r);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function dt(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function En(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function ge(e) {
  return structuredClone(e);
}
function he(e) {
  return typeof e == "string" && e.length > 0;
}
function te(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? d({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : g(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = se(e.amountFrom);
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
function se(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const vn = "dice-so-nice";
async function _n(e) {
  if (!tn().enabled || !Dn()) return;
  const t = Nn();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      i.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function Dn() {
  return game.modules.get(vn)?.active === !0;
}
function Nn() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Ln(e, t, r) {
  if (!mt(e.id) || !mt(e.formula))
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
    await _n(n);
    const c = {
      ...r.rollRequests[e.id] ?? Zt(e, t),
      total: o,
      roll: n
    };
    return r.rolls[e.id] = c, g(c);
  } catch (a) {
    return d({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: a
    });
  }
}
function Zt(e, t) {
  const r = e.intent ?? On(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function On(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function mt(e) {
  return typeof e == "string" && e.length > 0;
}
async function Ce(e, t, r, a, n) {
  switch (a) {
    case "spend":
      return r !== "PE" && r !== "PD" ? X(t, r, a, n) : e.spend(t, r, n);
    case "damage":
      return r !== "PV" && r !== "SAN" ? X(t, r, a, n) : e.damage(t, r, n);
    case "heal":
      return r !== "PV" ? X(t, r, a, n) : e.heal(t, r, n);
    case "recover":
      return r !== "SAN" ? X(t, r, a, n) : e.recover(t, r, n);
  }
}
function X(e, t, r, a) {
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
function Fn(e) {
  const { step: t, context: r, transaction: a, stepIndex: n, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = Mn(t, r, a, n);
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
    const s = Un(t, r, a, n);
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
function Mn(e, t, r, a) {
  const n = se(e.amountFrom), o = n ? t.rolls[n] : void 0;
  return {
    id: Jt(t.id, "damage", a, t.damageInstances.length),
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
function Un(e, t, r, a) {
  const n = se(e.amountFrom);
  return {
    id: Jt(t.id, "healing", a, t.healingInstances.length),
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
function Jt(e, t, r, a) {
  return `${e}.${t}.${r}.${a}`;
}
function Bn(e, t, r) {
  const a = se(e.amountFrom), n = a ? t.rolls[a] : void 0;
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
function xn(e) {
  const { step: t, context: r, stepIndex: a, metadata: n, lifecycle: o } = e;
  o.emit("beforeApply", r, { stepIndex: a, step: t, metadata: n }), er("before", e), ft("before", e), ft("resolve", e);
}
function Hn(e) {
  const { step: t, context: r, stepIndex: a, metadata: n, lifecycle: o } = e;
  o.emit("apply", r, { stepIndex: a, step: t, metadata: n }), er("apply", e);
}
function Vn(e) {
  const { step: t, context: r, stepIndex: a, metadata: n, lifecycle: o } = e;
  o.emit("afterApply", r, { stepIndex: a, step: t, metadata: n });
}
function er(e, t) {
  const { step: r, context: a, stepIndex: n, metadata: o, lifecycle: s } = t, c = jn(e, r.operation);
  c && s.emit(c, a, {
    stepIndex: n,
    step: r,
    metadata: o
  });
}
function ft(e, t) {
  const { step: r, context: a, stepIndex: n, metadata: o, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: n,
    step: r,
    metadata: o
  });
}
function jn(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function qn(e, t, r) {
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
async function Gn(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return zn(e, t);
    case "spendRitualCost":
      return Wn(e, t);
  }
}
async function zn(e, t) {
  const { context: r, resources: a } = e, n = te(t, r);
  return n.ok ? tr(await a.spend(r.sourceActor, t.resource, n.value), r) : d(n.error);
}
async function Wn(e, t) {
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
  }), tr(await a.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function tr(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), g(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), d({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Kn(e) {
  const { step: t, context: r, stepIndex: a, lifecycle: n, execute: o } = e, s = Yn(t);
  for (const l of s.before)
    n.emit(l, r, { stepIndex: a, step: t });
  const c = await o();
  if (!c.ok)
    return c;
  for (const l of s.after)
    n.emit(l, r, { stepIndex: a, step: t });
  return c;
}
function Yn(e) {
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
class Qn {
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
        return Kn({
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
    const n = await Gn({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return n.ok ? g(void 0) : d({ ...n.error, stepIndex: a, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, a) {
    const n = Zt(t, a);
    r.rollRequests[n.id] = n, this.lifecycle.emit("beforeRoll", r, { stepIndex: a, step: t, rollRequest: n }), this.emitSpecificRollPhase("before", n, r, a, t), this.lifecycle.emit("roll", r, { stepIndex: a, step: t, rollRequest: n }), this.emitSpecificRollPhase("roll", n, r, a, t);
    const o = await this.runRollFormulaStep(t, r, a);
    if (!o.ok)
      return o;
    const s = r.rolls[n.id];
    return this.emitSpecificRollPhase("after", n, r, a, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: a, step: t, rollRequest: n, rollResult: s }), g(void 0);
  }
  async runRollFormulaStep(t, r, a) {
    const n = await Ln(t, a, r);
    return n.ok ? g(void 0) : d({ ...n.error, stepIndex: a, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, a) {
    const n = te(t, r);
    if (!n.ok)
      return d({ ...n.error, stepIndex: a, step: t, context: r });
    const o = Bn(t, r, n.value);
    xn({
      step: t,
      context: r,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), Hn({
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
    for (const c of s) {
      const l = await Ce(this.resources, c, t.resource, t.operation, n.value), p = this.handleResourceOperationResult(l, r, a, t);
      if (!p.ok)
        return p;
      Fn({
        step: t,
        context: r,
        transaction: p.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return Vn({
      step: t,
      context: r,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), g(void 0);
  }
  async runModifyResourceStep(t, r, a) {
    const n = te(t, r);
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
      const c = await Ce(this.resources, s, t.resource, t.operation, n.value), l = this.handleResourceOperationResult(c, r, a, t);
      if (!l.ok)
        return l;
    }
    return g(void 0);
  }
  async runChatCardStep(t, r, a) {
    const n = await qn(this.messages, t, r);
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
    const c = Xn(t, r.intent);
    c && this.lifecycle.emit(c, a, {
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
function Xn(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Zn {
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
    const s = o.value, c = this.calculate(a, s, n);
    if (!c.ok)
      return d({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: c.error.reason,
        message: c.error.message,
        requestedAmount: n,
        current: s.value,
        required: n
      });
    const { afterValue: l, appliedAmount: p } = c.value, y = {
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
function Jn(e) {
  return {
    id: eo(),
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
function eo() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class to {
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
    return D(this.lastContext);
  }
  async runAutomation(t, r) {
    const a = Jn(r);
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
class ro {
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
class ao {
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
    const r = ke();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: no(),
      flags: {
        ...t.flags,
        [u]: {
          ...oo(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && i.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const a = ke();
    if (!a.enabled)
      return;
    const n = r.notification ?? pt(r);
    a.console && this.emitConsole(t, r), a.ui && this.emitUi(t, n);
  }
  emitConsole(t, r) {
    const a = pt(r);
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
function pt(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function no() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function oo(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const so = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", rr = `${u}-inline-roll-neutralized`, io = `${u}-inline-roll-notice`, Ve = `data-${u}-inline-roll-neutralized`, gt = `data-${u}-inline-roll-notice`, co = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function uo(e) {
  const t = $o(e.message), r = await lo(e.message), a = mo(t);
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
async function lo(e) {
  const t = To(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = fo(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await ko(t, r.content), replacementCount: r.replacementCount };
}
function mo(e) {
  const t = e ? wo(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = ar(t);
  return r > 0 && nr(Ao(t)), { replacementCount: r };
}
function fo(e) {
  const t = po(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const a = ar(r.content), n = t.replacementCount + a;
  return n === 0 ? { content: e, replacementCount: 0 } : (nr(r.content), { content: r.innerHTML, replacementCount: n });
}
function po(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (a, n) => (t += 1, ho(n.trim()))), replacementCount: t };
}
function ar(e) {
  const t = go(e);
  for (const r of t)
    r.replaceWith(yo(Ro(r)));
  return t.length;
}
function go(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(so))
    r.getAttribute(Ve) !== "true" && t.add(r);
  return Array.from(t);
}
function ho(e) {
  return `<span class="${rr}" ${Ve}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Po(e)}</span>`;
}
function yo(e) {
  const t = document.createElement("span");
  return t.classList.add(rr), t.setAttribute(Ve, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function nr(e) {
  if (e.querySelector?.(`[${gt}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(io), t.setAttribute(gt, "true"), t.textContent = co, e.append(t);
}
function Ao(e) {
  return e.querySelector(".message-content") ?? e;
}
function Ro(e) {
  const r = e.getAttribute("data-formula") ?? bo(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function bo(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function To(e) {
  return e && typeof e == "object" ? e : null;
}
async function ko(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return i.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function wo(e) {
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
function Po(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Io(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const or = ["base", "discente", "verdadeiro"];
function sr(e) {
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
  return typeof e == "string" && or.includes(e);
}
async function Co(e) {
  const t = Lo();
  return t ? new Promise((r) => {
    let a = !1;
    const n = (o) => {
      a || (a = !0, r(o));
    };
    new t({
      title: `Conjurar ${e.ritual.name ?? "ritual"}`,
      content: Eo(e),
      default: "cast",
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: () => n(null)
        },
        cast: {
          icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
          label: "Conjurar",
          callback: (o) => n(_o(o, e.defaultSpendResource))
        }
      },
      close: () => n(null)
    }).render(!0);
  }) : (ui.notifications?.warn("Paranormal Toolkit: Dialog não disponível. Usando opções padrão do ritual."), {
    variant: "base",
    spendResource: e.defaultSpendResource
  });
}
function Eo(e) {
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
        ${e.variantOptions.map(vo).join("")}
      </fieldset>

      <label class="paranormal-toolkit-ritual-cast-dialog__checkbox">
        <input type="checkbox" name="spendResource" ${a}>
        Gastar PE/PD automaticamente
      </label>

      <dl class="paranormal-toolkit-ritual-cast-dialog__summary">
        <div><dt>Custo base previsto</dt><dd>${B(r)}</dd></div>
        <div><dt>Conjurador</dt><dd>${B(e.actor.name ?? "Ator sem nome")}</dd></div>
        <div><dt>Alvos</dt><dd>${B(t)}</dd></div>
      </dl>
    </form>
  `;
}
function vo(e) {
  const t = e.variant === "base" ? "checked" : "", r = e.enabled ? "" : "disabled", a = e.enabled ? "" : e.unavailableReason ?? "não disponível neste ritual", n = [...e.details, a].filter((s) => s.length > 0).join(" · ");
  return `
    <label class="paranormal-toolkit-ritual-cast-dialog__variant${e.enabled ? "" : " paranormal-toolkit-ritual-cast-dialog__variant--disabled"}">
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-main">
        <input type="radio" name="variant" value="${B(e.variant)}" ${t} ${r}>
        <strong>${B(e.label)}</strong>
      </span>
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-details">${B(n)}</span>
    </label>
  `;
}
function _o(e, t) {
  const r = No(e), a = Do(r), n = r?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: a,
    spendResource: n
  };
}
function Do(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return So(t) ? t : "base";
}
function No(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Lo() {
  return globalThis.Dialog ?? null;
}
function B(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const ir = {
  label: "Padrão"
};
class Oo {
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
    const a = this.resolveCostPreview(t), n = ss(r, a), o = await Co({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((T) => T.name),
      cost: a,
      defaultSpendResource: us(r),
      variantOptions: n
    });
    if (!o)
      return { status: "cancelled" };
    const s = cs(r, o.variant), c = Fo(r, o, s, a);
    if (c.steps.length === 0)
      return {
        status: "failed",
        reason: "empty-preparation",
        message: "O ritual não possui custo ou rolagem para preparar antes das ações no chat."
      };
    const l = await this.workflow.runAutomation(c, {
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
    const p = l.value.context, y = Uo(r, t, p), A = Ko(r, o, s, a, p);
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
    return Ce(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function Fo(e, t, r, a) {
  const n = [];
  for (const o of e.steps)
    o.type === "modifyResource" || o.type === "chatCard" || lr(o) && !t.spendResource || n.push(Mo(o, r));
  return t.spendResource && a && dr(r.extraCost) && n.push({
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
function Mo(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function Uo(e, t, r) {
  const a = [];
  for (const n of e.steps) {
    if (n.type !== "modifyResource") continue;
    const o = te(n, r);
    if (!o.ok)
      return {
        ok: !1,
        reason: o.error.reason,
        message: o.error.message
      };
    const s = Wo(n.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const c of s)
      a.push(...Bo(e, n, c, o.value));
  }
  return { ok: !0, actions: a };
}
function Bo(e, t, r, a) {
  if (!jo(e, t))
    return [ht(t, r, a)];
  const n = zo();
  return cr(e).map((o) => {
    const s = qo(a, o);
    return ht(t, r, s, {
      option: o,
      choiceGroupId: n
    });
  });
}
function ht(e, t, r, a) {
  const n = t.name ?? "Ator sem nome", o = Vo(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: n,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: xo(e, n, r, a?.option),
    executedLabel: Ho(e, n, a?.option),
    choiceGroupId: a?.choiceGroupId,
    choiceGroupResolvedLabel: a ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function xo(e, t, r, a) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? a ? `${a.id === "normal" ? "Normal" : a.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function Ho(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Vo(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function jo(e, t) {
  return t.operation === "damage" && t.resource === "PV" && cr(e).length > 1;
}
function cr(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function qo(e, t) {
  const r = e * t.multiplier, a = Go(r, t.rounding ?? "floor");
  return Math.max(0, a);
}
function Go(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function zo() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Wo(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function Ko(e, t, r, a, n) {
  return [
    `Forma: ${sr(t.variant)}`,
    Yo(t, r, a),
    ...Object.values(n.rolls).flatMap(Qo),
    ...Xo(e.resistance),
    ...ns(r)
  ];
}
function Yo(e, t, r) {
  const a = t.extraCost ?? 0;
  return r ? e.spendResource ? a > 0 ? `Custo: ${r.amount + a} ${r.resource} gasto (${r.amount} base + ${a} extra)` : `Custo: ${r.amount} ${r.resource} gasto` : a > 0 ? `Custo: ${r.amount} ${r.resource} + ${a} extra não gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? a > 0 ? `Custo: não resolvido (+${a} extra)` : "Custo: não resolvido" : "Custo: não gasto";
}
function Qo(e) {
  const r = [`${os(e)}: ${e.formula} = ${Math.trunc(e.total)}`], a = Zo(e.roll);
  return a && r.push(`Dados: ${a}`), e.damageType && r.push(`Tipo: ${as(e.damageType)}`), r;
}
function Xo(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function Zo(e) {
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
    const s = Jo(o);
    s && (rs(r, s.operator ?? a, s.value), a = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function Jo(e) {
  const t = es(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : ts(e);
}
function es(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function ts(e) {
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
function rs(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function as(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function ns(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function os(e) {
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
function ss(e, t) {
  return or.map((r) => {
    const a = ur(e, r), n = r === "base" || a !== null, o = a ?? (r === "base" ? ir : null);
    return {
      variant: r,
      label: o?.label ?? sr(r),
      enabled: n,
      details: o ? is(o, t) : [],
      unavailableReason: n ? void 0 : "não disponível neste ritual"
    };
  });
}
function is(e, t) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {});
  return a.length > 0 && r.push(a.join(", ")), dr(e.extraCost) ? r.push(t ? `+${e.extraCost} ${t.resource}` : `+${e.extraCost} PE/PD`) : r.push("custo base"), r;
}
function cs(e, t) {
  return ur(e, t) ?? ir;
}
function ur(e, t) {
  return e.ritualForms?.[t] ?? null;
}
function us(e) {
  return e.steps.some(lr);
}
function lr(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function dr(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function ls(e, t) {
  const r = await ds(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: fs(r),
    total: ps(r),
    diceBreakdown: gs(r)
  };
}
function mr(e) {
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
async function ds(e, t) {
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
  return ms(a);
}
function ms(e) {
  return yt(e) ? e : Array.isArray(e) ? e.find(yt) ?? null : null;
}
function yt(e) {
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
  const n = (Array.isArray(r.results) ? r.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return n.length > 0 ? `(${n.join(", ")})` : null;
}
function hs(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const fr = "itemUsePrompts", ie = "data-paranormal-toolkit-prompt-id", ce = "data-paranormal-toolkit-pending-id", je = "data-paranormal-toolkit-executed-label", Ee = "data-paranormal-toolkit-choice-group", pr = "data-paranormal-toolkit-skipped-label", At = "data-paranormal-toolkit-action-section", Rt = "data-paranormal-toolkit-detail-key", bt = "data-paranormal-toolkit-roll-card", qe = "data-paranormal-toolkit-roll-detail-toggle", gr = "data-paranormal-toolkit-roll-detail-id", hr = "data-paranormal-toolkit-resistance-roll-button", yr = "data-paranormal-toolkit-resistance-skill", Ar = "data-paranormal-toolkit-resistance-skill-label", Rr = "data-paranormal-toolkit-resistance-target-actor-id", br = "data-paranormal-toolkit-resistance-target-name", Tr = "data-paranormal-toolkit-resistance-roll-result", ys = `[${ce}]`, As = `[${qe}]`, Rs = `[${hr}]`, Tt = `${u}-chat-enrichment`, f = `${u}-item-use-prompt`, bs = `${f}__actions`, kt = `${f}__details`, kr = `${f}__summary`, Ts = `${f}__title`, wr = `${f}__button--executed`, wt = `${f}__roll-card`;
let $t = !1, ve = null;
const I = /* @__PURE__ */ new Map();
function ks(e) {
  ve = e, !$t && (Hooks.on("renderChatMessageHTML", (t, r) => {
    $s(t, r, e);
  }), $t = !0);
}
async function Pt(e) {
  const t = ws(e);
  I.set(e.pendingId, t), await di(t), Ps(e.pendingId);
}
async function ye(e, t) {
  const r = I.get(e);
  I.delete(e), r && await mi(r, t);
}
function ws(e) {
  const t = We(e.context.message), r = e.context.targets.find((s) => Le(s)), a = r ? Le(r) : null, n = e.resistanceTargetActor ?? a, o = e.resistanceTargetName ?? r?.name ?? n?.name ?? e.context.targets[0]?.name ?? null;
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
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: xs(e.context),
    executed: !1
  };
}
function $s(e, t, r) {
  li();
  const a = ue(t);
  if (!a) return;
  const n = si(e, a);
  for (const o of n)
    _e(a, o);
  Pr(a, r), De(a), Ne(a);
}
function Ps(e) {
  const t = I.get(e);
  if (!t) return;
  const r = t.messageId ? ii(t.messageId) : null;
  if (r) {
    _e(r, t), It(r), De(r), Ne(r);
    return;
  }
  if (t.messageId) return;
  const a = ci(t);
  a && (_e(a, t), It(a), De(a), Ne(a));
}
function It(e) {
  ve && Pr(e, ve);
}
function _e(e, t) {
  if (e.querySelector(`[${ie}="${x(t.pendingId)}"]`)) return;
  const r = Is(e, t);
  Cs(r, t), Os(r, Fs(t)).append(Bs(t));
}
function Is(e, t) {
  const r = e.querySelector(`.${Tt}`);
  if (r)
    return r;
  const a = document.createElement("section");
  a.classList.add(Tt, f);
  const n = document.createElement("header");
  n.classList.add(`${f}__header`);
  const o = document.createElement("span");
  o.classList.add(`${f}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Ts), s.textContent = Ss(t);
  const c = document.createElement("span");
  return c.classList.add(kr), c.textContent = t.summary, n.append(o, s, c), a.append(n), Vs(e).append(a), a;
}
function Ss(e) {
  const t = k(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function Cs(e, t) {
  const r = t.summaryLines ?? [], a = vr(r, t);
  if (a) {
    Es(e, a, t.pendingId);
    return;
  }
  Ms(e, r);
}
function Es(e, t, r) {
  if (e.querySelector(`[${bt}="true"]`)) return;
  const a = document.createElement("article");
  a.classList.add(wt, `${wt}--${t.intent}`), a.setAttribute(bt, "true");
  const n = document.createElement("div");
  n.classList.add(`${f}__roll-summary`);
  const o = document.createElement("span");
  o.classList.add(`${f}__roll-chip`, `${f}__roll-chip--${t.intent}`), o.textContent = t.label.toUpperCase();
  const s = document.createElement("strong");
  s.classList.add(`${f}__roll-total`), s.textContent = String(t.total);
  const c = document.createElement("span");
  c.classList.add(`${f}__roll-formula`), c.textContent = t.formula, n.append(o, s, c), a.append(n), vs(a, t), _s(a, t, prompt), Ns(a, t, r), e.append(a);
}
function vs(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(yi);
  if (r.length === 0) return;
  const a = document.createElement("div");
  a.classList.add(`${f}__roll-meta`);
  for (const n of r) {
    const o = document.createElement("span");
    o.classList.add(`${f}__roll-meta-pill`), o.textContent = n, a.append(o);
  }
  e.append(a);
}
function _s(e, t, r) {
  if (!t.resistance) return;
  const a = document.createElement("div");
  a.classList.add(`${f}__resistance`);
  const n = document.createElement("div");
  n.classList.add(`${f}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = Ds(t, r);
  n.append(o), s && n.append(s);
  const c = document.createElement("span");
  c.classList.add(`${f}__resistance-description`), c.textContent = t.resistance, a.append(n, c), t.resistanceRollResult && a.append($r(t.resistanceRollResult)), e.append(a);
}
function Ds(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${f}__resistance-roll-button`), r.setAttribute(ie, t.pendingId), r.setAttribute(hr, "true"), r.setAttribute(yr, e.resistanceSkill), r.setAttribute(Ar, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(Rr, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(br, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${f}__resistance-roll-button--rolled`), r.setAttribute(Tr, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const a = document.createElement("i");
  a.classList.add("fa-solid", "fa-dice-d20"), a.setAttribute("aria-hidden", "true");
  const n = document.createElement("span");
  return n.classList.add(`${f}__resistance-roll-fallback`), n.textContent = "d20", r.append(a, n), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function $r(e) {
  const t = document.createElement("span");
  return t.classList.add(`${f}__resistance-roll-result`), t.textContent = Sr(e), t;
}
function Ns(e, t, r) {
  const a = Ls(t);
  if (a.length === 0) return;
  const n = `${r}-roll-details`, o = document.createElement("button");
  o.type = "button", o.classList.add(`${f}__roll-detail-toggle`), o.setAttribute(qe, n), o.setAttribute("aria-expanded", "false"), o.textContent = "▸ Ver detalhes";
  const s = document.createElement("dl");
  s.classList.add(`${f}__roll-detail-list`), s.setAttribute(gr, n), s.hidden = !0;
  for (const c of a) {
    const l = document.createElement("dt");
    l.textContent = c.label;
    const p = document.createElement("dd");
    p.textContent = c.value, s.append(l, p);
  }
  e.append(o, s);
}
function Ls(e) {
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
function Os(e, t) {
  const r = `[${At}="${x(t.id)}"]`, a = e.querySelector(r);
  if (a)
    return a;
  const n = document.createElement("div");
  n.classList.add(bs), n.setAttribute(At, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${f}__actions-title`), o.textContent = t.title, n.append(o), e.append(n), n;
}
function Fs(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const a = vr(e.summaryLines ?? [], e);
  return a?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : a?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Ms(e, t) {
  if (t.length === 0) return;
  const r = Us(e);
  for (const a of t) {
    const n = Ai(a);
    if (r.querySelector(`[${Rt}="${x(n)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = a, o.setAttribute(Rt, n), r.append(o);
  }
}
function Us(e) {
  const t = e.querySelector(`.${kt}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(kt), e.append(r), r;
}
function Bs(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${f}__button`), t.setAttribute(ie, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(wr), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(ce, e.pendingId), t.setAttribute(je, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Ee, e.choiceGroupId), t.setAttribute(pr, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function xs(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = Hs(e);
  return `${t} → ${r}`;
}
function Hs(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Vs(e) {
  return e.querySelector(".message-content") ?? e;
}
function Pr(e, t) {
  const r = ue(e);
  if (!r) return;
  const a = r.querySelectorAll(ys);
  for (const n of a)
    n.dataset.paranormalToolkitBound !== "true" && (n.dataset.paranormalToolkitBound = "true", n.addEventListener("click", () => {
      ri(n, t);
    }));
}
function De(e) {
  const t = ue(e);
  if (!t) return;
  const r = t.querySelectorAll(As);
  for (const a of r)
    a.dataset.paranormalToolkitRollDetailsBound !== "true" && (a.dataset.paranormalToolkitRollDetailsBound = "true", a.addEventListener("click", () => {
      js(t, a);
    }));
}
function Ne(e) {
  const t = ue(e);
  if (!t) return;
  const r = t.querySelectorAll(Rs);
  for (const a of r)
    a.dataset.paranormalToolkitResistanceRollBound !== "true" && (a.dataset.paranormalToolkitResistanceRollBound = "true", a.addEventListener("click", () => {
      qs(t, a);
    }));
}
function js(e, t) {
  const r = t.getAttribute(qe);
  if (!r) return;
  const a = e.querySelector(`[${gr}="${x(r)}"]`);
  if (!a) return;
  const n = a.hidden;
  a.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.textContent = n ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function qs(e, t) {
  const r = t.getAttribute(ie), a = t.getAttribute(yr), n = t.getAttribute(Ar) ?? (a ? mr(a) : "Resistência");
  if (!r || !a) return;
  const o = Ws(e, r), s = Ks(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const l = await ls(s, a);
    await Js(l.roll);
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
    Gs(t, p), zs(t, p), ei(r, p), await ti(e, r, p);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", l), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${n}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1;
  }
}
function Gs(e, t) {
  e.classList.add(`${f}__resistance-roll-button--rolled`), e.setAttribute(Tr, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function zs(e, t) {
  const r = e.closest(`.${f}__resistance`);
  if (!r) return;
  const a = r.querySelector(`.${f}__resistance-roll-result`), n = a ?? $r(t);
  if (a) {
    a.textContent = Sr(t);
    return;
  }
  r.append(n);
}
function Ws(e, t) {
  const r = I.get(t);
  if (r) return r;
  const a = Cr(e);
  return W(a)[t] ?? null;
}
function Ks(e, t) {
  const r = e?.resistanceTargetActor;
  if (P(r)) return r;
  const n = e?.context?.targets.map(Le).find(P) ?? null;
  if (n) return n;
  const o = t.getAttribute(Rr) ?? e?.resistanceTargetActorId ?? null, s = o ? Qs(o) : null;
  return s || Xs(
    t.getAttribute(br) ?? e?.resistanceTargetName ?? Ys(t)
  );
}
function Ys(e) {
  const r = e.closest(`.${f}`)?.querySelector(`.${kr}`)?.textContent ?? null;
  if (!r) return null;
  const a = "→";
  if (!r.includes(a)) return null;
  const n = r.split(a), o = n[n.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Le(e) {
  const t = e.actor;
  if (P(t)) return t;
  const r = e.token, a = q(r);
  if (a) return a;
  const n = e.document;
  return q(n);
}
function q(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (P(t)) return t;
  const r = e.document?.actor;
  return P(r) ? r : null;
}
function Qs(e) {
  const r = game.actors?.get?.(e);
  return P(r) ? r : Ir().map((o) => q(o)).find((o) => o?.id === e) ?? null;
}
function Xs(e) {
  const t = Ae(e);
  if (!t) return null;
  const r = Ir().filter((o) => Ae(Zs(o)) === t).map((o) => q(o)).find(P) ?? null;
  if (r) return r;
  const n = game.actors?.find?.((o) => P(o) && Ae(o.name) === t);
  return P(n) ? n : null;
}
function Ir() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Zs(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : q(e)?.name ?? null;
}
function Ae(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function P(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Sr(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Js(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function ei(e, t) {
  const r = I.get(e);
  r && (r.resistanceRollResult = t);
}
async function ti(e, t, r) {
  const a = Cr(e);
  if (a)
    try {
      const n = W(a), o = n[t];
      if (!o) return;
      n[t] = {
        ...o,
        resistanceRollResult: r
      }, await Ge(a, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", n);
    }
}
function Cr(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const a = game.messages;
  return re(a?.get?.(r));
}
async function ri(e, t) {
  const r = e.getAttribute(ce);
  if (!r) return;
  e.disabled = !0;
  const a = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    Er(e, e.getAttribute(je) ?? "✓ Automação aplicada"), ai(e);
    return;
  }
  e.disabled = !1, e.textContent = a;
}
function Er(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(wr), e.removeAttribute(ce), e.removeAttribute(je);
}
function ai(e) {
  const t = e.getAttribute(Ee);
  if (!t) return;
  const r = e.closest(`.${f}`) ?? e.parentElement;
  if (!r) return;
  const a = `[${Ee}="${x(t)}"]`;
  for (const n of r.querySelectorAll(a)) {
    if (n === e) continue;
    const o = n.getAttribute(pr) ?? "✓ Outra opção escolhida";
    Er(n, o);
  }
}
function vr(e, t) {
  const r = e.map(_r).find(gi);
  if (!r) return null;
  const a = k(e, "Forma"), n = k(e, "Custo"), o = k(e, "Dados") ?? k(e, `Dados (${r.label})`), s = k(e, "Tipo"), c = k(e, "Resistência"), l = k(e, "Resistência Perícia"), p = k(e, "Resistência Rótulo") ?? (l ? mr(l) : null), y = Dr(e, "Observação"), A = e.filter((T) => oi(T, r));
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: a,
    cost: n,
    diceBreakdown: o,
    damageType: s,
    resistance: c,
    resistanceSkill: l,
    resistanceSkillLabel: p,
    notes: y,
    details: A,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function _r(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, a, n] = t, o = Number(n);
  return Number.isFinite(o) ? {
    label: r,
    formula: a,
    total: o,
    intent: ni(r)
  } : null;
}
function ni(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : "generic";
}
function k(e, t) {
  return Dr(e, t)[0] ?? null;
}
function Dr(e, t) {
  const r = `${t}:`;
  return e.flatMap((a) => {
    if (!a.startsWith(r)) return [];
    const n = a.slice(r.length).trim();
    return n.length > 0 ? [n] : [];
  });
}
function oi(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || _r(e) ? !1 : e.trim().length > 0;
}
function si(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const a of I.values())
    Oe(a, e, t) && r.set(a.pendingId, a);
  for (const a of fi(e))
    Oe(a, e, t) && !r.has(a.pendingId) && r.set(a.pendingId, a);
  return Array.from(r.values()).sort((a, n) => a.createdAt - n.createdAt);
}
function Oe(e, t, r) {
  const a = We(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === a : !e.itemId || !St(r, "itemId", e.itemId) ? !1 : !e.actorId || St(r, "actorId", e.actorId);
}
function St(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const a = `data-${Ri(t)}`;
  for (const n of e.querySelectorAll(`[${a}]`))
    if (n.getAttribute(a) === r)
      return !0;
  return !1;
}
function ii(e) {
  const t = x(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function ci(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Oe(e, null, t))
      return t;
  return null;
}
function li() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, a] of I.entries())
    e - a.createdAt > t && I.delete(r);
}
async function di(e) {
  const t = Lr(e.context.message);
  if (t)
    try {
      const r = W(t);
      r[e.pendingId] = Nr(e), await Ge(t, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r);
    }
}
async function mi(e, t) {
  const r = Lr(e.context.message);
  if (r)
    try {
      const a = W(r), n = a[e.pendingId] ?? Nr(e);
      a[e.pendingId] = {
        ...n,
        executedLabel: t ?? n.executedLabel,
        executed: !0
      }, await Ge(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", a);
    }
}
function fi(e) {
  return Object.values(W(re(e))).filter(Or);
}
function W(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, fr);
  if (!ze(t))
    return {};
  const r = {};
  for (const [a, n] of Object.entries(t))
    Or(n) && (r[a] = n);
  return r;
}
async function Ge(e, t) {
  typeof e.setFlag == "function" && await Promise.resolve(e.setFlag(u, fr, t));
}
function Nr(e) {
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
    itemName: e.itemName,
    resistanceTargetActorId: e.resistanceTargetActorId,
    resistanceTargetName: e.resistanceTargetName,
    resistanceRollResult: e.resistanceRollResult ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: e.summary,
    executed: e.executed
  };
}
function Lr(e) {
  const t = re(e);
  if (t?.setFlag)
    return t;
  const r = We(e);
  if (!r) return null;
  const a = game.messages;
  return re(a?.get?.(r));
}
function re(e) {
  return e && typeof e == "object" ? e : null;
}
function Or(e) {
  return ze(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && Z(e.messageId) && Z(e.itemId) && Z(e.actorId) && Z(e.itemName) && O(e.resistanceTargetActorId) && O(e.resistanceTargetName) && pi(e.resistanceRollResult) && Re(e.title) && Re(e.buttonLabel) && Re(e.executedLabel) && O(e.choiceGroupId) && O(e.skippedLabel) && O(e.actionSectionId) && O(e.actionSectionTitle) && hi(e.summaryLines) : !1;
}
function pi(e) {
  return e == null ? !0 : ze(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && typeof e.usedFallbackBonus == "boolean" && typeof e.rolledAt == "string" : !1;
}
function gi(e) {
  return e !== null;
}
function ze(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function Z(e) {
  return e === null || typeof e == "string";
}
function Re(e) {
  return e === void 0 || typeof e == "string";
}
function O(e) {
  return e == null || typeof e == "string";
}
function hi(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function yi(e) {
  return typeof e == "string" && e.length > 0;
}
function ue(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function We(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Ai(e) {
  return e.trim().toLowerCase();
}
function Ri(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function x(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ct = 1e3;
class bi {
  constructor(t, r, a, n) {
    this.workflow = t, this.debugOutput = n, this.ritualAssistant = new Oo(t, r, a);
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
      settings: tt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = tt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const a = Fe(t.item);
    if (!a.ok) {
      const n = a.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, n, a.error.reason), a.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: a.error.message,
        data: a.error
      });
      return;
    }
    if (await uo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Et(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await ye(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const a = await this.ritualAssistant.applyAction(r.action);
    return a.ok ? (r.workflowContext.resourceTransactions.push(a.value), this.pendingExecutions.delete(t), await ye(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (ks((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
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
        this.setAttempt(t, "completed", "ritual-assisted-no-actions"), i.info("Ritual assistido concluído sem ações pendentes.", D(a.workflowContext));
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
      o.kind === "resource-action" && (this.pendingExecutions.delete(n), await ye(
        n,
        o.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerAssistedResourceActions(t, r, a, n) {
    let o;
    for (const s of a) {
      const c = _t();
      o ??= c, this.pendingExecutions.set(c, {
        kind: "resource-action",
        id: c,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await Pt({
        pendingId: c,
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
        resistanceTargetName: s.actorName
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", o), i.info("Ritual assistido preparado com ações pendentes.", D(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const a = _t();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Pt({
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
    this.setAttempt(t, "completed"), i.info("Automação executada por uso normal de item.", D(n.value.context));
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
    const r = Date.now(), a = vt(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      r - s > Ct && this.recentExecutionKeys.delete(o);
    const n = this.recentExecutionKeys.get(a);
    return n !== void 0 && r - n <= Ct;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(vt(t), Date.now());
  }
  setAttempt(t, r, a, n) {
    this.lastAttempt = Et(t, r, a, n);
  }
}
function Et(e, t, r, a) {
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
function vt(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function _t() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ti {
  constructor(t, r, a) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = a;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), a = [], n = [], o = z(t);
    for (const s of r) {
      const c = s.itemId ? o.find((y) => y.id === s.itemId) ?? null : null, l = s.match?.preset ?? null;
      if (!c || !l) {
        n.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(c, l);
      const p = await this.itemPatches.applyPresetItemPatch(c, l);
      a.push({
        itemId: c.id ?? null,
        itemName: c.name ?? "Ritual sem nome",
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
class ki {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = z(t).map((c) => this.analyzeRitual(c)), a = r.filter(J("upToDate")), n = r.filter(J("available")), o = r.filter(J("outdated")), s = r.filter(J("unsupported"));
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
    const r = this.automationRegistry.findForItem(t)[0] ?? null, a = wi(t);
    return r ? a ? a.source.type !== "preset" ? H({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: a,
      reason: `Automação manual encontrada. Preset sugerido: ${r.preset.label}.`
    }) : a.source.presetId === r.preset.id && a.source.presetVersion === r.preset.version ? H({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: a,
      reason: `Preset ${r.preset.label} v${r.preset.version} já aplicado.`
    }) : H({
      ritual: t,
      status: "outdated",
      match: r,
      flag: a,
      reason: $i(a, r.preset)
    }) : H({
      ritual: t,
      status: "available",
      match: r,
      flag: a,
      reason: `Preset encontrado: ${r.preset.label}.`
    }) : H({
      ritual: t,
      status: "unsupported",
      match: r,
      flag: a,
      reason: a ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function H(e) {
  const t = e.flag?.source, r = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? oe(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function wi(e) {
  const t = e.getFlag(u, "automation");
  return Me(t) ? t : null;
}
function $i(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function J(e) {
  return (t) => t.status === e;
}
class Pi {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), a = Be(t.transaction);
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
    const a = this.createWorkflowSummaryContent(t, r), n = D(t);
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
    const r = h(t.actorName), a = h(t.resource), n = h(Dt(t)), o = h(Si(t));
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
    const a = h(r.title ?? "Automação"), n = r.message ? `<p>${h(r.message)}</p>` : "", o = h(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = h(t.item.name ?? "Item sem nome"), c = t.targets.length > 0 ? t.targets.map((m) => h(m.name)).join(", ") : "Nenhum", l = Object.values(t.rolls).map(
      (m) => `<li><strong>${h(m.id)}:</strong> ${h(m.formula)} = ${m.total} <em>(${h(Ii(m.intent))})</em>${m.damageType ? ` — ${h(m.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (m) => `<li><strong>${h(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${h(m.resource)} (${h(Ci(m.source))})</li>`
    ), y = t.damageInstances.map(
      (m) => `<li><strong>${h(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${h(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (m) => `<li><strong>${h(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (m) => `<li><strong>${h(m.actorName)}:</strong> ${h(Dt(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), N = t.phases.map((m) => h(m)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${a}</strong>
          <span>${s}</span>
        </header>
        <div class="${u}-card__body">
          ${n}
          <p><strong>Origem:</strong> ${o}</p>
          <p><strong>Alvo:</strong> ${c}</p>
          ${p.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${p.join("")}</ul>` : ""}
          ${l.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${l.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Cura:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${N.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${N}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Ii(e) {
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
function Dt(e) {
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
function Si(e) {
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
function Ci(e) {
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
function Ei() {
  const e = new rn(), t = new Zn(e), r = new on(), a = new un(r), n = new wn(e), o = new Pn(), s = o.registerMany(pa());
  if (!s.ok)
    throw new Error(s.error.message);
  const c = new $n(), l = new Tn(), p = new ki(o), y = new Ti(p, c, l), A = new ao(), T = new Pi(A), N = new ro(), m = new Qn(t, a, T, N), Ke = new to(m, N), le = new bi(Ke, t, a, A);
  return le.addStrategy(new Rn((Ur) => le.handleItemUsed(Ur))), {
    ordem: n,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: a,
    resources: t,
    automationRegistry: o,
    automationBinder: c,
    itemPatches: l,
    debugOutput: A,
    chatMessages: T,
    workflowHooks: N,
    automation: m,
    workflow: Ke,
    itemUseIntegration: le,
    ritualPresetDiagnostic: p,
    ritualPresetApplications: y
  };
}
const { ApplicationV2: vi } = foundry.applications.api;
class ae extends vi {
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
      apply: ae.onApply,
      cancel: ae.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${w(Ot)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${w(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${be("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${be("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${be("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function be(e, t, r, a) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${a}"></i>
        <span>${w(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? _i(r) : Ni(t)}
    </section>
  `;
}
function _i(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Di).join("")}</ol>`;
}
function Di(e) {
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
function Ni(e) {
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
const ne = `${u}.manageRitualPresets`, Nt = `__${u}_ritualPresetHeaderControlRegistered`, Li = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Oi(e) {
  const t = globalThis;
  if (!t[Nt]) {
    for (const r of Li)
      Hooks.on(r, (a, n) => {
        Fi(a, n, e);
      });
    t[Nt] = !0, i.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Fi(e, t, r) {
  Array.isArray(t) && Ui(e) && (Mi(e, r), !t.some((a) => a.action === ne) && t.push({
    action: ne,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (a) => {
      a.preventDefault(), a.stopPropagation(), Fr(e, r);
    }
  }));
}
function Mi(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[ne] && (e.options.actions[ne] = (r) => {
    r.preventDefault(), r.stopPropagation(), Fr(e, t);
  }));
}
function Ui(e) {
  if (!game.user?.isGM) return !1;
  const t = Mr(e);
  return t ? t.type === "agent" && z(t).length > 0 : !1;
}
function Fr(e, t) {
  const r = Mr(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new ae(r, t).render({ force: !0 });
}
function Mr(e) {
  return Lt(e.actor) ? e.actor : Lt(e.document) ? e.document : null;
}
function Lt(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let F = null;
Hooks.once("init", () => {
  da(), Da(), en(), i.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!at.isSupportedSystem()) {
    i.warn(
      `Sistema não suportado: ${at.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  F = Ei(), F.itemUseIntegration.registerStrategies(), xa(F), Xa(), Wa(), Oi(F), i.info("Inicializado para o sistema Ordem Paranormal."), i.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Ot} inicializado.`);
});
function Bi() {
  if (!F)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return F;
}
export {
  Bi as getToolkitServices
};
//# sourceMappingURL=main.js.map
