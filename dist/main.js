const c = "paranormal-toolkit", It = "Paranormal Toolkit", ka = "ordemparanormal";
class x {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function ee(e) {
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
  static info(t, ...a) {
    console.log(`${c} | ${t}`, ...a);
  }
  static warn(t, ...a) {
    console.warn(`${c} | ${t}`, ...a);
  }
  static error(t, ...a) {
    console.error(`${c} | ${t}`, ...a);
  }
}
function p(e) {
  return { ok: !0, value: e };
}
function l(e) {
  return { ok: !1, error: e };
}
function Ce(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? l({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Se(t) ? p(t.definition) : l({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function $a(e) {
  return Se(e.getFlag(c, "automation"));
}
function Se(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Pa(t.source) && wa(t.definition);
}
function wa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(Ta);
}
function Pa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function Ta(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Ia(t);
    case "spendRitualCost":
      return Ca(t);
    case "rollFormula":
      return Sa(t);
    case "modifyResource":
      return Ea(t);
    case "chatCard":
      return va(t);
    default:
      return !1;
  }
}
function Ia(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ct(t);
}
function Ca(e) {
  return e.type === "spendRitualCost";
}
function Sa(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || La(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function Ea(e) {
  const t = e;
  return t.type === "modifyResource" && Da(t.actor) && _a(t.resource) && Na(t.operation) && Ct(t);
}
function va(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Ct(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function Da(e) {
  return e === "self" || e === "target";
}
function _a(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Na(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function La(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function Ee(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const a = t;
    if (Array.isArray(a.contents))
      return a.contents.filter(Ve);
    if (Ma(t))
      return Array.from(t).filter(Ve);
  }
  return [];
}
function Oa(e) {
  return Ee(e)[0] ?? null;
}
function Fa(e) {
  return Ee(e).find($a) ?? null;
}
function Ma(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ve(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function B(e) {
  return Ee(e).filter((t) => t.type === "ritual");
}
function St(e) {
  return B(e)[0] ?? null;
}
function Ua(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(ee);
      return i.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = H("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const a = G(t);
      if (!a) return [];
      const r = e.automationRegistry.findForItem(a).map(je);
      return i.info(`Presets encontrados para ${a.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const a = H("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!a) return;
      const r = G(a);
      if (!r) return;
      const n = e.automationRegistry.require(t);
      if (!n.ok) {
        i.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      const o = await pe(e, r, n.value);
      i.info(`Preset ${n.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = H("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const a = G(t);
      if (!a) return;
      const r = e.automationRegistry.findForItem(a)[0];
      if (!r) {
        i.warn(`Nenhum preset compatível encontrado para ${a.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${a.name}.`);
        return;
      }
      const n = await pe(e, a, r.preset);
      i.info(`Melhor preset aplicado em ${a.name}.`, { match: je(r), itemPatch: n }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return xe(e);
    },
    async applyBestPresetsToActorRituals() {
      return xe(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = H("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const a = G(t);
      a && (await e.automationBinder.clear(a), i.info(`Automação removida do ritual ${a.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${a.name}.`));
    }
  };
}
async function xe(e) {
  const t = H("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const a = B(t);
  if (a.length === 0)
    return i.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Be(t);
  const r = Be(t, a.length);
  for (const n of a) {
    const o = e.automationRegistry.findForItem(n)[0];
    if (!o) {
      r.skipped.push({
        itemId: n.id ?? null,
        itemName: n.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await pe(e, n, o.preset);
    r.applied.push(Ha(n, o, s));
  }
  return i.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Va(r), r;
}
async function pe(e, t, a) {
  return await e.automationBinder.applyPreset(t, a), e.itemPatches.applyPresetItemPatch(t, a);
}
function Ha(e, t, a) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: ee(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: a.applied,
    itemPatchReason: a.applied ? void 0 : a.reason
  };
}
function Be(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Va(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", a = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${a}${t}.`
  );
}
function je(e) {
  return {
    preset: ee(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function H(e) {
  const t = x.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function G(e) {
  const t = St(e);
  return t || (i.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function v(e) {
  return e ? {
    id: e.id,
    source: {
      ...xa(e.sourceActor),
      token: e.sourceToken
    },
    item: Ba(e.item),
    targets: e.targets.map(ja),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Ge(e.rollRequests, Et),
    rolls: Ge(e.rolls, Ga),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(ve),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function ve(e) {
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
function xa(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Ba(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function ja(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Et(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Ga(e) {
  return {
    ...Et(e),
    total: e.total
  };
}
function Ge(e, t) {
  return Object.fromEntries(Object.entries(e).map(([a, r]) => [a, t(r)]));
}
function qa(e) {
  return {
    getSelected() {
      return x.getSelectedActor();
    },
    logResources() {
      const t = T(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const a = e.ordem.getActorSnapshot(t);
      i.info("Recursos do ator selecionado:", a), a.resourceErrors.length > 0 && i.warn("Alguns recursos não puderam ser lidos pelo adapter.", a.resourceErrors);
    },
    async spendPE(t) {
      await N(
        e,
        "Gasto de PE",
        T("Nenhum ator encontrado para gastar PE."),
        (a) => e.resources.spend(a, "PE", t)
      );
    },
    async spendPD(t) {
      await N(
        e,
        "Gasto de PD",
        T("Nenhum ator encontrado para gastar PD."),
        (a) => e.resources.spend(a, "PD", t)
      );
    },
    async damagePV(t) {
      await N(
        e,
        "Dano em PV",
        T("Nenhum ator encontrado para causar dano em PV."),
        (a) => e.resources.damage(a, "PV", t)
      );
    },
    async healPV(t) {
      await N(
        e,
        "Cura de PV",
        T("Nenhum ator encontrado para curar PV."),
        (a) => e.resources.heal(a, "PV", t)
      );
    },
    async damageSAN(t) {
      await N(
        e,
        "Dano em SAN",
        T("Nenhum ator encontrado para causar dano em SAN."),
        (a) => e.resources.damage(a, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await N(
        e,
        "Recuperação de SAN",
        T("Nenhum ator encontrado para recuperar SAN."),
        (a) => e.resources.recover(a, "SAN", t)
      );
    }
  };
}
async function N(e, t, a, r) {
  if (!a) return;
  const n = await r(a);
  if (!n.ok) {
    za(n.error);
    return;
  }
  const o = n.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    i.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  i.info(`${t} realizado:`, ve(o));
}
function T(e) {
  const t = x.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function za(e) {
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
function Wa() {
  q($.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), q($.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), q($.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), q($.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function fe() {
  return {
    enabled: z($.enabled),
    console: z($.console),
    ui: z($.ui),
    chat: z($.chat)
  };
}
async function w(e, t) {
  await game.settings.set(c, $[e], t);
}
function q(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function z(e) {
  return game.settings.get(c, e) === !0;
}
function Ka() {
  return {
    status() {
      return fe();
    },
    async enable() {
      await w("enabled", !0);
    },
    async disable() {
      await w("enabled", !1);
    },
    async enableConsole() {
      await w("console", !0);
    },
    async disableConsole() {
      await w("console", !1);
    },
    async enableUi() {
      await w("ui", !0);
    },
    async disableUi() {
      await w("ui", !1);
    },
    async enableChat() {
      await w("chat", !0);
    },
    async disableChat() {
      await w("chat", !1);
    }
  };
}
const vt = "ritual.costOnly", Dt = "ritual.simpleHealing", Ya = "ritual.eletrocussao", _t = "ritual.simpleDamage", Nt = "generic.simpleHealing", Lt = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Qa() {
  return [
    Xa(),
    Za(),
    Ja(),
    er(),
    tr()
  ];
}
function Xa() {
  return {
    id: vt,
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
function Za() {
  return {
    id: Dt,
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
    automation: Ot(),
    itemPatch: rr()
  };
}
function Ja() {
  return {
    id: Ya,
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
    automation: ar(),
    itemPatch: nr()
  };
}
function er() {
  return {
    id: _t,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: De()
  };
}
function tr() {
  return {
    id: Nt,
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
function Ot(e = "2d8+2") {
  return Ft(
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
function ar() {
  return {
    ...De("1d8", {
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
function De(e = "1d8", t = {}) {
  const a = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", n = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Ft(
    {
      version: 1,
      label: a,
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
          title: r,
          message: o
        }
      ]
    },
    "damage",
    e
  );
}
function rr() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Lt,
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
function nr() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Lt,
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
function Ft(e, t, a) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: a
    })
  };
}
function _e() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: O(t.id),
    actorId: O(t.actor?.id),
    sceneId: O(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Mt() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: O(e.id),
    actorId: O(t?.id),
    sceneId: O(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function O(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function or(e) {
  return {
    logFirstRitualCost() {
      const t = I("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const a = C(t);
      if (!a) return;
      const r = e.ritualCosts.getCost({ actor: t, ritual: a });
      if (!r.ok) {
        i.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      i.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: a.name,
        cost: r.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${a.name} custa ${r.value.amount} ${r.value.resource} (${r.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, a = "PE") {
      const r = I("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const n = C(r);
      if (n) {
        if (!ur(t, a)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await n.setFlag(c, "ritual.cost", {
          resource: a,
          amount: t
        }), i.info(`Custo customizado aplicado em ${n.name}.`, { resource: a, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${n.name} agora custa ${t} ${a}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = I("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const a = C(t);
      a && (await a.unsetFlag(c, "ritual.cost"), i.info(`Custo customizado removido de ${a.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${a.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = I("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const a = C(t);
      if (!a) return;
      const r = e.automationRegistry.require(vt);
      if (!r.ok) {
        i.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value), i.info(`Preset de custo aplicado ao ritual: ${a.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${a.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const a = I("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!a) return;
      const r = C(a);
      if (!r) return;
      if (!qe(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const n = e.automationRegistry.require(Dt);
      if (!n.ok) {
        i.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value, {
        definition: Ot(t)
      }), i.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const a = I("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!a) return;
      const r = C(a);
      if (!r) return;
      if (!qe(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const n = e.automationRegistry.require(_t);
      if (!n.ok) {
        i.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value, {
        definition: De(t)
      }), i.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = I("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const a = C(t);
      a && await sr(e, t, a);
    }
  };
}
async function sr(e, t, a) {
  const r = Ce(a);
  if (!r.ok) {
    i.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const n = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Mt(),
    item: a,
    targets: _e()
  });
  if (!n.ok) {
    ir(n.error);
    return;
  }
  i.info("Automação de ritual executada com sucesso.", v(n.value.context));
}
function ir(e) {
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
function I(e) {
  const t = x.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function C(e) {
  const t = St(e);
  return t || (i.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ur(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function qe(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const cr = ["disabled", "ask", "automatic"], lr = ["buttons", "confirm"], Ut = "ask";
function dr(e) {
  return typeof e == "string" && cr.includes(e);
}
function mr(e) {
  return typeof e == "string" && lr.includes(e);
}
function pr(e) {
  return dr(e) ? e : mr(e) ? "ask" : Ut;
}
const Q = {
  executionMode: "itemUse.executionMode",
  autoRun: "itemUse.autoRun.enabled"
};
function fr() {
  game.settings.register(c, Q.executionMode, {
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
    default: Ut
  }), game.settings.register(c, Q.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function ze() {
  return {
    executionMode: pr(game.settings.get(c, Q.executionMode))
  };
}
async function S(e) {
  await game.settings.set(c, Q.executionMode, e);
}
function gr(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await S("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await S("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await S(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await S("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await S("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await S("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await S("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const hr = [
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
function yr(e) {
  return {
    phases() {
      return hr;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = ne("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const a = Fa(t);
      if (!a) {
        i.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await We(e, t, a);
    },
    async runSelectedItemAutomation() {
      await this.runFirstAutomation();
    },
    async runItemAutomationByUuid(t) {
      if (!t || typeof t != "string") {
        ui.notifications?.warn("Paranormal Toolkit: UUID inválido.");
        return;
      }
      const a = await fromUuid(t);
      if (!Rr(a)) {
        i.warn(`UUID não resolveu para um Item: ${t}`, a), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = br(a) ?? ne("Nenhum ator encontrado para executar automação do item.");
      r && await We(e, r, a);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = ne("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const a = Oa(t);
      if (!a) {
        i.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Nt);
        if (!r.ok) {
          i.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(a, r.value), i.info(`Preset de teste aplicado ao item: ${a.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${a.name}.`);
      } catch (r) {
        i.error("Falha ao configurar automação de teste no item.", r), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function We(e, t, a) {
  const r = Ce(a);
  if (!r.ok) {
    i.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const n = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Mt(),
    item: a,
    targets: _e()
  });
  if (!n.ok) {
    Ar(n.error);
    return;
  }
  i.info("Automação executada com sucesso.", v(n.value.context));
}
function Ar(e) {
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
function ne(e) {
  const t = x.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function br(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Rr(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function kr(e) {
  const t = qa(e), a = Ua(e), r = or(e), n = yr(e), o = Ka(), s = gr(e);
  return {
    actor: t,
    automation: a,
    ritual: r,
    workflow: n,
    output: o,
    itemUseIntegration: s,
    getSelectedActor() {
      return t.getSelected();
    },
    logSelectedActorResources() {
      t.logResources();
    },
    async spendSelectedActorPE(u) {
      await t.spendPE(u);
    }
  };
}
function $r(e) {
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
    debug: kr(e)
  }, a = globalThis;
  return a[c] = t, a.ParanormalToolkit = t, t;
}
class Ke {
  static isSupportedSystem() {
    return game.system.id === ka;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function wr() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: F(t.id),
    actorId: F(t.actor?.id),
    sceneId: F(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Ht() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, a = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: F(e.id),
    actorId: F(t?.id),
    sceneId: F(e.scene?.id),
    name: a
  };
}
function Pr(e, t = Ht()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Tr(e) {
  if (!Sr(e)) return null;
  const t = e.getFlag(c, "workflow");
  return Cr(t) ? t : null;
}
function Ir() {
  return `flags.${c}.workflow`;
}
function Ye(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), a = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || a !== void 0;
}
function Qe(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), a = foundry.utils.getProperty(e, "_source.speaker.actor");
  return ge(t) || ge(a);
}
function Cr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Sr(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function F(e) {
  return ge(e) ? e : null;
}
function ge(e) {
  return typeof e == "string" && e.length > 0;
}
function Er() {
  const e = (t, a) => {
    vr(t, a);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function vr(e, t) {
  const a = Tr(e);
  if (!a || a.targets.length === 0) return;
  const r = _r(t);
  if (!r || r.querySelector(`.${c}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Dr(a));
}
function Dr(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const a = document.createElement("strong");
  return a.textContent = "Paranormal Toolkit", t.append(a), e.source && t.append(Xe("Origem", e.source.name)), t.append(Xe("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Xe(e, t) {
  const a = document.createElement("p");
  a.classList.add(`${c}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const n = document.createElement("span");
  return n.textContent = t, a.append(r, n), a;
}
function _r(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Nr() {
  Hooks.on("preCreateChatMessage", (e, t, a, r) => {
    if (!Lr(r) || !Or(e) || Ye(e) || Ye(t)) return;
    const n = wr();
    if (n.length === 0 || !Qe(e) && !Qe(t)) return;
    const o = Ht();
    e.updateSource({
      [Ir()]: Pr(n, o)
    }), i.info("Targets capturados para ChatMessage.", { source: o, targets: n });
  });
}
function Lr(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Or(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const Vt = {
  enabled: "dice.animations.enabled"
};
function Fr() {
  game.settings.register(c, Vt.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Mr() {
  return {
    enabled: game.settings.get(c, Vt.enabled) === !0
  };
}
const V = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, xt = {
  PV: "system.attributes.hp"
}, he = {
  PV: [V.PV, xt.PV],
  SAN: [V.SAN],
  PE: [V.PE],
  PD: [V.PD]
}, ye = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Ur {
  getResource(t, a) {
    const r = Ze(t, a);
    if (!r.ok)
      return l(r.error);
    const n = r.value, o = `${n}.value`, s = `${n}.max`, u = foundry.utils.getProperty(t, o), d = foundry.utils.getProperty(t, s), f = et(t, a, o, u, "valor atual");
    if (f) return l(f);
    const y = et(t, a, s, d, "valor máximo");
    return y ? l(y) : p({
      value: u,
      max: d
    });
  }
  async updateResourceValue(t, a, r) {
    const n = Ze(t, a);
    if (!n.ok)
      throw new Error(n.error.message);
    await t.update({ [`${n.value}.value`]: r });
  }
}
function Ze(e, t) {
  const a = Hr(e.type, t);
  if (a && Je(e, a))
    return p(a);
  const r = he[t].find(
    (n) => Je(e, n)
  );
  return r ? p(r) : l({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Vr(e, t),
    path: he[t].join(" | ")
  });
}
function Hr(e, t) {
  return e === "threat" ? xt[t] ?? null : e === "agent" ? V[t] : null;
}
function Je(e, t) {
  const a = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof a == "number" && Number.isFinite(a) && typeof r == "number" && Number.isFinite(r);
}
function Vr(e, t) {
  const a = e.type ?? "unknown", r = he[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${a}). Paths testados: ${r}.`;
}
function et(e, t, a, r, n) {
  return r == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${n} de ${t} não encontrado: ${a}.`,
    path: a,
    value: r
  } : typeof r != "number" || !Number.isFinite(r) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${n} de ${t} em ${a}.`,
    path: a,
    value: r
  } : null;
}
class xr {
  isRitual(t) {
    return t.type === "ritual";
  }
  getCircle(t) {
    if (!this.isRitual(t))
      return l({
        reason: "not-a-ritual",
        message: `Item ${t.name ?? "sem nome"} não é um ritual.`,
        ritual: t
      });
    const a = this.readCircleFromKnownPaths(t);
    if (!a) {
      const s = ye.ritualItem.circleCandidates;
      return l({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: n } = a, o = Br(n);
    return o ? p(o) : l({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(n)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: n
    });
  }
  readCircleFromKnownPaths(t) {
    for (const a of ye.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, a);
      if (r != null)
        return { path: a, value: r };
    }
    return null;
  }
}
function Br(e) {
  if (tt(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const a = Number(t);
    if (tt(a))
      return a;
  }
  return null;
}
function tt(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const jr = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Gr {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const a = this.ritualAdapter.getCircle(t.ritual);
    if (!a.ok)
      return l({
        ...a.error,
        actor: t.actor
      });
    const r = a.value, n = qr(t.ritual, r);
    return n.ok ? n.value ? p(n.value) : p({
      resource: "PE",
      amount: jr[r],
      source: "default-by-circle",
      circle: r
    }) : l(n.error);
  }
}
function qr(e, t) {
  const a = e.getFlag(c, "ritual.cost");
  return a == null ? { ok: !0, value: null } : zr(a) ? {
    ok: !0,
    value: {
      resource: a.resource,
      amount: a.amount,
      source: "custom-flag",
      circle: t
    }
  } : {
    ok: !1,
    error: {
      reason: "invalid-custom-cost",
      message: `Custo customizado do ritual ${e.name ?? "sem nome"} é inválido.`,
      ritual: e,
      value: a
    }
  };
}
function zr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const oe = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Wr(e) {
  if (!Jr(e.item)) return null;
  const t = Ae(e.actor) ? e.actor : Kr(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Qr(e.token) ?? Yr(t),
    targets: _e(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Kr(e) {
  const t = e;
  return Ae(t.actor) ? t.actor : Ae(e.parent) ? e.parent : null;
}
function Yr(e) {
  const t = Xr(e) ?? Zr(e);
  return t ? Bt(t) : null;
}
function Qr(e) {
  return be(e) ? Bt(e) : null;
}
function Xr(e) {
  if (!e) return null;
  const t = e, a = t.token;
  return be(a) ? a : (t.getActiveTokens?.() ?? []).find(be) ?? null;
}
function Zr(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Bt(e) {
  const t = e.actor ?? null;
  return {
    tokenId: se(e.id),
    actorId: se(t?.id),
    sceneId: se(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Jr(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ae(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function be(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function se(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class en {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(oe.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, i.info(`${oe.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const a = Wr(tn(t));
    if (!a) {
      i.warn(`${oe.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(a);
  }
}
function tn(e) {
  return e && typeof e == "object" ? e : {};
}
class an {
  async applyPresetItemPatch(t, a) {
    const r = a.itemPatch;
    if (!r) return ie("missing-item-patch");
    if (t.type !== "ritual") return ie("unsupported-item-type");
    const n = rn(r);
    return Object.keys(n).length === 0 ? ie("empty-update") : (await t.update(n), {
      applied: !0,
      updateData: n
    });
  }
}
function rn(e) {
  const t = {};
  A(t, "name", e.name), A(t, "system.description", e.descriptionHtml);
  const a = e.ritual;
  return a && (A(t, "system.circle", a.circle), A(t, "system.element", a.element), A(t, "system.target", a.target), A(t, "system.targetQtd", a.targetQuantity), A(t, "system.execution", a.execution), A(t, "system.range", a.range), A(t, "system.duration", a.duration), A(t, "system.skillResis", a.resistanceSkill), A(t, "system.resistance", a.resistance), A(t, "system.studentForm", a.studentForm), A(t, "system.trueForm", a.trueForm)), t;
}
function A(e, t, a) {
  a !== void 0 && (e[t] = a);
}
function ie(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class nn {
  constructor(t) {
    this.resourceAdapter = t;
  }
  resourceAdapter;
  getActorSnapshot(t) {
    const a = this.getResources(t);
    return {
      id: t.id ?? null,
      name: t.name ?? "Ator sem nome",
      type: t.type ?? "unknown",
      resources: a.values,
      resourceErrors: a.errors,
      ritualDT: this.getRitualDT(t)
    };
  }
  getRitualDT(t) {
    return this.getNumber(t, ye.ritual.dt, 0);
  }
  getResources(t) {
    const a = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, r = [];
    for (const n of ["PV", "SAN", "PE", "PD"]) {
      const o = this.resourceAdapter.getResource(t, n);
      o.ok ? a[n] = o.value : r.push(o.error);
    }
    return { values: a, errors: r };
  }
  getNumber(t, a, r) {
    const n = foundry.utils.getProperty(t, a);
    return typeof n == "number" && Number.isFinite(n) ? n : r;
  }
}
class on {
  async applyPreset(t, a, r = {}) {
    const n = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: a.id,
        presetVersion: a.version,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: r.definition ?? a.automation
    };
    return await this.writeAutomationFlag(t, n), n;
  }
  async applyManualDefinition(t, a, r = a.label) {
    const n = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: r,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: a
    };
    return await this.writeAutomationFlag(t, n), n;
  }
  async clear(t) {
    await t.unsetFlag(c, "automation");
  }
  async writeAutomationFlag(t, a) {
    await this.clear(t), await t.setFlag(c, "automation", a);
  }
}
class sn {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const a = un(t);
    return a.ok ? this.presets.has(t.id) ? l({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, ue(t)), p(t)) : a;
  }
  registerMany(t) {
    const a = [];
    for (const r of t) {
      const n = this.register(r);
      if (!n.ok)
        return n;
      a.push(n.value);
    }
    return p(a);
  }
  get(t) {
    const a = this.presets.get(t);
    return a ? ue(a) : null;
  }
  require(t) {
    const a = this.get(t);
    return a ? p(a) : l({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(ue);
  }
  findForItem(t) {
    return this.list().map((a) => cn(a, t)).filter((a) => a !== null).sort((a, r) => r.score - a.score || a.preset.id.localeCompare(r.preset.id));
  }
}
function un(e) {
  return !ce(e.id) || !ce(e.version) || !ce(e.label) ? l({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? l({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : p(e);
}
function cn(e, t) {
  if (e.matchers.length === 0)
    return null;
  const a = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, a.push(`itemType:${t.type}`);
  }
  for (const n of e.matchers) {
    const o = ln(n, t);
    if (!o.matches)
      return null;
    r += o.score, a.push(o.reason);
  }
  return {
    preset: e,
    score: r,
    reasons: a
  };
}
function ln(e, t) {
  switch (e.type) {
    case "itemType": {
      const a = e.itemTypes.includes(t.type);
      return {
        matches: a,
        score: a ? 10 : 0,
        reason: `itemType:${t.type}`
      };
    }
    case "normalizedName": {
      const a = at(t.name), r = e.names.map(at).includes(a);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${a}`
      };
    }
    case "ritualCircle": {
      const a = dn(t), r = a !== null && e.circles.includes(a);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${a ?? "unknown"}`
      };
    }
  }
}
function at(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function dn(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), a = typeof t == "string" ? Number(t) : t;
  return a === 1 || a === 2 || a === 3 || a === 4 ? a : null;
}
function ue(e) {
  return structuredClone(e);
}
function ce(e) {
  return typeof e == "string" && e.length > 0;
}
function X(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? l({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : p(e.amount);
  if (typeof e.amountFrom == "string") {
    const a = te(e.amountFrom);
    if (!a)
      return l({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const r = t.rolls[a];
    if (!r)
      return l({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${a}.`
      });
    const n = Math.trunc(r.total);
    return !Number.isInteger(n) || n <= 0 ? l({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${a} não gerou um amount positivo.`
    }) : p(n);
  }
  return l({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function te(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const mn = "dice-so-nice";
async function pn(e) {
  if (!Mr().enabled || !fn()) return;
  const t = gn();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (a) {
      i.warn("Não foi possível animar a rolagem com Dice So Nice.", a);
    }
}
function fn() {
  return game.modules.get(mn)?.active === !0;
}
function gn() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function hn(e, t, a) {
  if (!rt(e.id) || !rt(e.formula))
    return l({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(e.formula), n = await Promise.resolve(r.evaluate()), o = n.total;
    if (typeof o != "number" || !Number.isFinite(o))
      return l({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await pn(n);
    const u = {
      ...a.rollRequests[e.id] ?? jt(e, t),
      total: o,
      roll: n
    };
    return a.rolls[e.id] = u, p(u);
  } catch (r) {
    return l({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function jt(e, t) {
  const a = e.intent ?? yn(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: a,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function yn(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function rt(e) {
  return typeof e == "string" && e.length > 0;
}
async function Re(e, t, a, r, n) {
  switch (r) {
    case "spend":
      return a !== "PE" && a !== "PD" ? W(t, a, r, n) : e.spend(t, a, n);
    case "damage":
      return a !== "PV" && a !== "SAN" ? W(t, a, r, n) : e.damage(t, a, n);
    case "heal":
      return a !== "PV" ? W(t, a, r, n) : e.heal(t, a, n);
    case "recover":
      return a !== "SAN" ? W(t, a, r, n) : e.recover(t, a, n);
  }
}
function W(e, t, a, r) {
  return l({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    resource: t,
    operation: a,
    reason: "invalid-resource-operation",
    message: `Operação ${a} não é válida para ${t}.`,
    requestedAmount: r
  });
}
function An(e) {
  const { step: t, context: a, transaction: r, stepIndex: n, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = bn(t, a, r, n);
    a.damageInstances.push(s), o.emit("afterDamageResolution", a, {
      stepIndex: n,
      step: t,
      damage: s,
      resourceTransaction: r,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), o.emit("afterApplyDamage", a, {
      stepIndex: n,
      step: t,
      damage: s,
      resourceTransaction: r,
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
    const s = Rn(t, a, r, n);
    a.healingInstances.push(s), o.emit("afterApplyHealing", a, {
      stepIndex: n,
      step: t,
      healing: s,
      resourceTransaction: r,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount
      }
    });
  }
}
function bn(e, t, a, r) {
  const n = te(e.amountFrom), o = n ? t.rolls[n] : void 0;
  return {
    id: Gt(t.id, "damage", r, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: a.actorId,
    targetActorName: a.actorName,
    rollId: n ?? void 0,
    damageType: o?.damageType,
    rawAmount: a.requestedAmount,
    finalAmount: a.requestedAmount,
    appliedAmount: a.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Rn(e, t, a, r) {
  const n = te(e.amountFrom);
  return {
    id: Gt(t.id, "healing", r, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: a.actorId,
    targetActorName: a.actorName,
    rollId: n ?? void 0,
    rawAmount: a.requestedAmount,
    finalAmount: a.requestedAmount,
    appliedAmount: a.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Gt(e, t, a, r) {
  return `${e}.${t}.${a}.${r}`;
}
function kn(e, t, a) {
  const r = te(e.amountFrom), n = r ? t.rolls[r] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: a,
    amountFrom: e.amountFrom,
    rollId: r,
    rollIntent: n?.intent,
    damageType: n?.damageType
  };
}
function $n(e) {
  const { step: t, context: a, stepIndex: r, metadata: n, lifecycle: o } = e;
  o.emit("beforeApply", a, { stepIndex: r, step: t, metadata: n }), qt("before", e), nt("before", e), nt("resolve", e);
}
function wn(e) {
  const { step: t, context: a, stepIndex: r, metadata: n, lifecycle: o } = e;
  o.emit("apply", a, { stepIndex: r, step: t, metadata: n }), qt("apply", e);
}
function Pn(e) {
  const { step: t, context: a, stepIndex: r, metadata: n, lifecycle: o } = e;
  o.emit("afterApply", a, { stepIndex: r, step: t, metadata: n });
}
function qt(e, t) {
  const { step: a, context: r, stepIndex: n, metadata: o, lifecycle: s } = t, u = Tn(e, a.operation);
  u && s.emit(u, r, {
    stepIndex: n,
    step: a,
    metadata: o
  });
}
function nt(e, t) {
  const { step: a, context: r, stepIndex: n, metadata: o, lifecycle: s } = t;
  a.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: n,
    step: a,
    metadata: o
  });
}
function Tn(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function In(e, t, a) {
  try {
    return await e.createWorkflowSummaryMessage(a, t), p(void 0);
  } catch (r) {
    return l({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function Cn(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Sn(e, t);
    case "spendRitualCost":
      return En(e, t);
  }
}
async function Sn(e, t) {
  const { context: a, resources: r } = e, n = X(t, a);
  return n.ok ? zt(await r.spend(a.sourceActor, t.resource, n.value), a) : l(n.error);
}
async function En(e, t) {
  const { context: a, resources: r, ritualCosts: n } = e, o = n.getCost({
    actor: a.sourceActor,
    ritual: a.item
  });
  if (!o.ok)
    return l({
      reason: "ritual-cost-failed",
      message: o.error.message,
      cause: o.error
    });
  const s = o.value;
  return a.ritualCosts.push({
    ...s,
    itemId: a.item.id ?? null,
    itemName: a.item.name ?? "Ritual sem nome"
  }), zt(await r.spend(a.sourceActor, s.resource, s.amount), a, t);
}
function zt(e, t, a) {
  return e.ok ? (t.resourceTransactions.push(e.value), p(void 0)) : (a?.type === "spendRitualCost" && t.ritualCosts.pop(), l({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function vn(e) {
  const { step: t, context: a, stepIndex: r, lifecycle: n, execute: o } = e, s = Dn(t);
  for (const d of s.before)
    n.emit(d, a, { stepIndex: r, step: t });
  const u = await o();
  if (!u.ok)
    return u;
  for (const d of s.after)
    n.emit(d, a, { stepIndex: r, step: t });
  return u;
}
function Dn(e) {
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
class _n {
  constructor(t, a, r, n) {
    this.resources = t, this.ritualCosts = a, this.messages = r, this.lifecycle = n;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, a) {
    if (t.steps.length === 0)
      return l({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: a
      });
    for (const [r, n] of t.steps.entries()) {
      const o = await this.runStep(n, a, r);
      if (!o.ok)
        return o;
    }
    return p({ definition: t, context: a });
  }
  async runStep(t, a, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, a, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, a, r);
      default:
        return vn({
          step: t,
          context: a,
          stepIndex: r,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(t, a, r)
        });
    }
  }
  async executeStep(t, a, r) {
    switch (t.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(t, a, r);
      case "rollFormula":
        return this.runRollFormulaStep(t, a, r);
      case "modifyResource":
        return this.runModifyResourceStep(t, a, r);
      case "chatCard":
        return this.runChatCardStep(t, a, r);
      default:
        return l({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: r,
          step: t,
          context: a
        });
    }
  }
  async runCostStep(t, a, r) {
    const n = await Cn({
      step: t,
      context: a,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return n.ok ? p(void 0) : l({ ...n.error, stepIndex: r, step: t, context: a });
  }
  async runRollFormulaStepWithLifecycle(t, a, r) {
    const n = jt(t, r);
    a.rollRequests[n.id] = n, this.lifecycle.emit("beforeRoll", a, { stepIndex: r, step: t, rollRequest: n }), this.emitSpecificRollPhase("before", n, a, r, t), this.lifecycle.emit("roll", a, { stepIndex: r, step: t, rollRequest: n }), this.emitSpecificRollPhase("roll", n, a, r, t);
    const o = await this.runRollFormulaStep(t, a, r);
    if (!o.ok)
      return o;
    const s = a.rolls[n.id];
    return this.emitSpecificRollPhase("after", n, a, r, t, s), this.lifecycle.emit("afterRoll", a, { stepIndex: r, step: t, rollRequest: n, rollResult: s }), p(void 0);
  }
  async runRollFormulaStep(t, a, r) {
    const n = await hn(t, r, a);
    return n.ok ? p(void 0) : l({ ...n.error, stepIndex: r, step: t, context: a });
  }
  async runModifyResourceStepWithLifecycle(t, a, r) {
    const n = X(t, a);
    if (!n.ok)
      return l({ ...n.error, stepIndex: r, step: t, context: a });
    const o = kn(t, a, n.value);
    $n({
      step: t,
      context: a,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), wn({
      step: t,
      context: a,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, a);
    if (s.length === 0)
      return l({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: a
      });
    for (const u of s) {
      const d = await Re(this.resources, u, t.resource, t.operation, n.value), f = this.handleResourceOperationResult(d, a, r, t);
      if (!f.ok)
        return f;
      An({
        step: t,
        context: a,
        transaction: f.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Pn({
      step: t,
      context: a,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), p(void 0);
  }
  async runModifyResourceStep(t, a, r) {
    const n = X(t, a);
    if (!n.ok)
      return l({ ...n.error, stepIndex: r, step: t, context: a });
    const o = this.resolveActors(t.actor, a);
    if (o.length === 0)
      return l({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: a
      });
    for (const s of o) {
      const u = await Re(this.resources, s, t.resource, t.operation, n.value), d = this.handleResourceOperationResult(u, a, r, t);
      if (!d.ok)
        return d;
    }
    return p(void 0);
  }
  async runChatCardStep(t, a, r) {
    const n = await In(this.messages, t, a);
    return n.ok ? p(void 0) : l({ ...n.error, stepIndex: r, step: t, context: a });
  }
  handleResourceOperationResult(t, a, r, n) {
    return t.ok ? (a.resourceTransactions.push(t.value), p(t.value)) : l({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: n,
      context: a,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, a, r, n, o, s) {
    const u = Nn(t, a.intent);
    u && this.lifecycle.emit(u, r, {
      stepIndex: n,
      step: o,
      rollRequest: a,
      rollResult: s
    });
  }
  resolveActors(t, a) {
    switch (t) {
      case "self":
        return [a.sourceActor];
      case "target":
        return a.targets.flatMap((r) => r.actor ? [r.actor] : []);
    }
  }
}
function Nn(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Ln {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async spend(t, a, r) {
    return this.execute(t, a, "spend", r);
  }
  async damage(t, a, r) {
    return this.execute(t, a, "damage", r);
  }
  async heal(t, a, r) {
    return this.execute(t, a, "heal", r);
  }
  async recover(t, a, r) {
    return this.execute(t, a, "recover", r);
  }
  async execute(t, a, r, n) {
    if (!Number.isInteger(n) || n <= 0)
      return l({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: a,
        operation: r,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: n
      });
    const o = this.adapter.getResource(t, a);
    if (!o.ok)
      return l({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: a,
        operation: r,
        reason: o.error.reason,
        message: o.error.message,
        requestedAmount: n,
        path: o.error.path,
        value: o.error.value
      });
    const s = o.value, u = this.calculate(r, s, n);
    if (!u.ok)
      return l({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: a,
        operation: r,
        reason: u.error.reason,
        message: u.error.message,
        requestedAmount: n,
        current: s.value,
        required: n
      });
    const { afterValue: d, appliedAmount: f } = u.value, y = {
      value: d,
      max: s.max
    };
    try {
      d !== s.value && await this.adapter.updateResourceValue(t, a, d);
    } catch (b) {
      return l({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: a,
        operation: r,
        reason: "update-failed",
        message: `Falha ao atualizar ${a} no ator.`,
        requestedAmount: n,
        current: s.value,
        required: n,
        cause: b
      });
    }
    return p({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: a,
      operation: r,
      requestedAmount: n,
      appliedAmount: f,
      before: s,
      after: y
    });
  }
  calculate(t, a, r) {
    switch (t) {
      case "spend":
        return a.value < r ? l({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${a.value}; custo: ${r}.`
        }) : p({
          afterValue: a.value - r,
          appliedAmount: r
        });
      case "damage": {
        const n = Math.max(0, a.value - r);
        return p({
          afterValue: n,
          appliedAmount: a.value - n
        });
      }
      case "heal":
      case "recover": {
        const n = Math.min(a.max, a.value + r);
        return p({
          afterValue: n,
          appliedAmount: n - a.value
        });
      }
    }
  }
}
function On(e) {
  return {
    id: Fn(),
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
function Fn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Mn {
  constructor(t, a) {
    this.automation = t, this.hooks = a;
  }
  automation;
  hooks;
  lastContext = null;
  getLastContext() {
    return this.lastContext;
  }
  getLastDebugSnapshot() {
    return v(this.lastContext);
  }
  async runAutomation(t, a) {
    const r = On(a);
    this.lastContext = r, this.hooks.emit("created", r, {
      metadata: {
        definitionLabel: t.label,
        itemId: r.item.id ?? null,
        itemName: r.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", r), this.hooks.emit("resolveTargets", r, {
      metadata: {
        targetCount: r.targets.length
      }
    });
    const n = await this.automation.run(t, r);
    return n.ok ? (this.hooks.emit("completed", r), n) : (this.emitFailed(r, n.error), n);
  }
  emitFailed(t, a) {
    this.hooks.emit("failed", t, {
      stepIndex: a.stepIndex,
      step: a.step,
      metadata: {
        reason: a.reason,
        message: a.message
      }
    });
  }
}
class Un {
  emit(t, a, r = {}) {
    const n = {
      phase: t,
      context: a,
      stepIndex: r.stepIndex,
      step: r.step,
      rollRequest: r.rollRequest,
      rollResult: r.rollResult,
      damage: r.damage,
      healing: r.healing,
      resourceTransaction: r.resourceTransaction,
      metadata: r.metadata
    };
    return a.phases.push(t), a.lifecycleEvents.push({
      phase: t,
      stepIndex: r.stepIndex,
      stepType: r.step?.type,
      rollId: r.rollRequest?.id ?? r.rollResult?.id,
      rollIntent: r.rollRequest?.intent ?? r.rollResult?.intent,
      damageId: r.damage?.id,
      healingId: r.healing?.id,
      resourceOperation: r.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${c}.workflow.${t}`, n), Hooks.callAll(`${c}.workflow.phase`, n), n;
  }
}
class Hn {
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
    const a = fe();
    return !a.enabled || !a.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Vn(),
      flags: {
        ...t.flags,
        [c]: {
          ...xn(t.flags),
          debugOutput: !0
        }
      }
    }), a.console && t.data !== void 0 && i.info("Debug chat criado.", t.data), !0);
  }
  emit(t, a) {
    const r = fe();
    if (!r.enabled)
      return;
    const n = a.notification ?? ot(a);
    r.console && this.emitConsole(t, a), r.ui && this.emitUi(t, n);
  }
  emitConsole(t, a) {
    const r = ot(a);
    switch (t) {
      case "info":
        i.info(r, a.data ?? "");
        return;
      case "warn":
        i.warn(r, a.data ?? "");
        return;
      case "error":
        i.error(r, a.data ?? "");
        return;
    }
  }
  emitUi(t, a) {
    switch (t) {
      case "info":
        ui.notifications?.info(`Paranormal Toolkit: ${a}`);
        return;
      case "warn":
        ui.notifications?.warn(`Paranormal Toolkit: ${a}`);
        return;
      case "error":
        ui.notifications?.error(`Paranormal Toolkit: ${a}`);
        return;
    }
  }
}
function ot(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Vn() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function xn(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const Bn = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Wt = `${c}-inline-roll-neutralized`, jn = `${c}-inline-roll-notice`, Ne = `data-${c}-inline-roll-neutralized`, st = `data-${c}-inline-roll-notice`, Gn = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function qn(e) {
  const t = oo(e.message), a = await zn(e.message), r = Wn(t);
  return a.replacementCount + r.replacementCount > 0 && i.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: e.item.id ?? null,
    itemName: e.item.name ?? "Item sem nome",
    messageId: t,
    contentReplacementCount: a.replacementCount,
    renderedReplacementCount: r.replacementCount
  }), {
    messageId: t,
    contentUpdated: a.updated,
    contentReplacementCount: a.replacementCount,
    renderedReplacementCount: r.replacementCount
  };
}
async function zn(e) {
  const t = ao(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const a = Kn(t.content);
  return a.replacementCount === 0 || a.content === t.content ? { updated: !1, replacementCount: a.replacementCount } : { updated: await ro(t, a.content), replacementCount: a.replacementCount };
}
function Wn(e) {
  const t = e ? no(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const a = Kt(t);
  return a > 0 && Yt(Jn(t)), { replacementCount: a };
}
function Kn(e) {
  const t = Yn(e), a = document.createElement("template");
  a.innerHTML = t.content;
  const r = Kt(a.content), n = t.replacementCount + r;
  return n === 0 ? { content: e, replacementCount: 0 } : (Yt(a.content), { content: a.innerHTML, replacementCount: n });
}
function Yn(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, n) => (t += 1, Xn(n.trim()))), replacementCount: t };
}
function Kt(e) {
  const t = Qn(e);
  for (const a of t)
    a.replaceWith(Zn(eo(a)));
  return t.length;
}
function Qn(e) {
  const t = /* @__PURE__ */ new Set();
  for (const a of e.querySelectorAll(Bn))
    a.getAttribute(Ne) !== "true" && t.add(a);
  return Array.from(t);
}
function Xn(e) {
  return `<span class="${Wt}" ${Ne}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${so(e)}</span>`;
}
function Zn(e) {
  const t = document.createElement("span");
  return t.classList.add(Wt), t.setAttribute(Ne, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Yt(e) {
  if (e.querySelector?.(`[${st}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(jn), t.setAttribute(st, "true"), t.textContent = Gn, e.append(t);
}
function Jn(e) {
  return e.querySelector(".message-content") ?? e;
}
function eo(e) {
  const a = e.getAttribute("data-formula") ?? to(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return a && a.length > 0 ? a : "rolagem inline";
}
function to(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function ao(e) {
  return e && typeof e == "object" ? e : null;
}
async function ro(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (a) {
    return i.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", a), !1;
  }
}
function no(e) {
  const t = io(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function oo(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function so(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function io(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Qt = ["base", "discente", "verdadeiro"];
function Xt(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function uo(e) {
  return typeof e == "string" && Qt.includes(e);
}
async function co(e) {
  const t = ho();
  return t ? new Promise((a) => {
    let r = !1;
    const n = (o) => {
      r || (r = !0, a(o));
    };
    new t({
      title: `Conjurar ${e.ritual.name ?? "ritual"}`,
      content: lo(e),
      default: "cast",
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: () => n(null)
        },
        cast: {
          icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
          label: "Conjurar",
          callback: (o) => n(po(o, e.defaultSpendResource))
        }
      },
      close: () => n(null)
    }).render(!0);
  }) : (ui.notifications?.warn("Paranormal Toolkit: Dialog não disponível. Usando opções padrão do ritual."), {
    variant: "base",
    spendResource: e.defaultSpendResource
  });
}
function lo(e) {
  const t = e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado", a = e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido", r = e.defaultSpendResource ? "checked" : "";
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
        ${e.variantOptions.map(mo).join("")}
      </fieldset>

      <label class="paranormal-toolkit-ritual-cast-dialog__checkbox">
        <input type="checkbox" name="spendResource" ${r}>
        Gastar PE/PD automaticamente
      </label>

      <dl class="paranormal-toolkit-ritual-cast-dialog__summary">
        <div><dt>Custo base previsto</dt><dd>${M(a)}</dd></div>
        <div><dt>Conjurador</dt><dd>${M(e.actor.name ?? "Ator sem nome")}</dd></div>
        <div><dt>Alvos</dt><dd>${M(t)}</dd></div>
      </dl>
    </form>
  `;
}
function mo(e) {
  const t = e.variant === "base" ? "checked" : "", a = e.enabled ? "" : "disabled", r = e.enabled ? "" : e.unavailableReason ?? "não disponível neste ritual", n = [...e.details, r].filter((s) => s.length > 0).join(" · ");
  return `
    <label class="paranormal-toolkit-ritual-cast-dialog__variant${e.enabled ? "" : " paranormal-toolkit-ritual-cast-dialog__variant--disabled"}">
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-main">
        <input type="radio" name="variant" value="${M(e.variant)}" ${t} ${a}>
        <strong>${M(e.label)}</strong>
      </span>
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-details">${M(n)}</span>
    </label>
  `;
}
function po(e, t) {
  const a = go(e), r = fo(a), n = a?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: n
  };
}
function fo(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return uo(t) ? t : "base";
}
function go(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function ho() {
  return globalThis.Dialog ?? null;
}
function M(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const Zt = {
  label: "Padrão"
};
class yo {
  constructor(t, a, r) {
    this.workflow = t, this.resources = a, this.ritualCosts = r;
  }
  workflow;
  resources;
  ritualCosts;
  canHandle(t, a) {
    return t.item.type === "ritual" || a.steps.some((r) => r.type === "spendRitualCost");
  }
  async run(t, a) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const r = this.resolveCostPreview(t), n = xo(a, r), o = await co({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((P) => P.name),
      cost: r,
      defaultSpendResource: Go(a),
      variantOptions: n
    });
    if (!o)
      return { status: "cancelled" };
    const s = jo(a, o.variant), u = Ao(a, o, s, r);
    if (u.steps.length === 0)
      return {
        status: "failed",
        reason: "empty-preparation",
        message: "O ritual não possui custo ou rolagem para preparar antes das ações no chat."
      };
    const d = await this.workflow.runAutomation(u, {
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
    if (!d.ok)
      return {
        status: "failed",
        reason: d.error.reason,
        message: d.error.message,
        cause: d.error
      };
    const f = d.value.context, y = Ro(a, t, f), b = Eo(a, o, s, r, f);
    return y.ok ? y.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: f,
      summaryLines: b
    } : {
      status: "ready",
      workflowContext: f,
      actions: y.actions,
      summaryLines: b
    } : {
      status: "failed",
      reason: y.reason,
      message: y.message
    };
  }
  async applyAction(t) {
    return Re(this.resources, t.actor, t.resource, t.operation, t.amount);
  }
  resolveCostPreview(t) {
    if (!t.actor) return null;
    const a = this.ritualCosts.getCost({
      actor: t.actor,
      ritual: t.item
    });
    return a.ok ? a.value : null;
  }
}
function Ao(e, t, a, r) {
  const n = [];
  for (const o of e.steps)
    o.type === "modifyResource" || o.type === "chatCard" || ta(o) && !t.spendResource || n.push(bo(o, a));
  return t.spendResource && r && aa(a.extraCost) && n.push({
    type: "spendResource",
    actor: "self",
    resource: r.resource,
    amount: a.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: n
  };
}
function bo(e, t) {
  if (e.type !== "rollFormula") return e;
  const a = t.rollFormulaOverrides?.[e.id];
  return a ? {
    ...e,
    formula: a
  } : e;
}
function Ro(e, t, a) {
  const r = [];
  for (const n of e.steps) {
    if (n.type !== "modifyResource") continue;
    const o = X(n, a);
    if (!o.ok)
      return {
        ok: !1,
        reason: o.error.reason,
        message: o.error.message
      };
    const s = So(n.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const u of s)
      r.push(...ko(e, n, u, o.value));
  }
  return { ok: !0, actions: r };
}
function ko(e, t, a, r) {
  if (!Po(e, t))
    return [it(t, a, r)];
  const n = Co();
  return Jt(e).map((o) => {
    const s = To(r, o);
    return it(t, a, s, {
      option: o,
      choiceGroupId: n
    });
  });
}
function it(e, t, a, r) {
  const n = t.name ?? "Ator sem nome";
  return {
    kind: "resource-operation",
    actor: t,
    actorName: n,
    resource: e.resource,
    operation: e.operation,
    amount: a,
    label: $o(e, n, a, r?.option),
    executedLabel: wo(e, n, r?.option),
    choiceGroupId: r?.choiceGroupId,
    choiceGroupResolvedLabel: r ? "✓ Outra opção escolhida" : void 0
  };
}
function $o(e, t, a, r) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${t} em ${a} PV` : e.operation === "damage" ? r ? `${r.id === "normal" ? "Normal" : r.label}: ${a} PV` : `Aplicar ${a} de dano em ${t}` : e.operation === "recover" ? `Recuperar ${a} ${e.resource} de ${t}` : e.operation === "spend" ? `Gastar ${a} ${e.resource} de ${t}` : `Aplicar ${a} ${e.resource} em ${t}`;
}
function wo(e, t, a) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? a ? `✓ ${a.id === "normal" ? "dano normal" : a.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Po(e, t) {
  return t.operation === "damage" && t.resource === "PV" && Jt(e).length > 1;
}
function Jt(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function To(e, t) {
  const a = e * t.multiplier, r = Io(a, t.rounding ?? "floor");
  return Math.max(0, r);
}
function Io(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Co() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function So(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((a) => a.actor ? [a.actor] : []);
  }
}
function Eo(e, t, a, r, n) {
  return [
    `Forma: ${Xt(t.variant)}`,
    vo(t, a, r),
    ...Object.values(n.rolls).flatMap(Do),
    ..._o(e.resistance),
    ...Ho(a)
  ];
}
function vo(e, t, a) {
  const r = t.extraCost ?? 0;
  return a ? e.spendResource ? r > 0 ? `Custo: ${a.amount + r} ${a.resource} gasto (${a.amount} base + ${r} extra)` : `Custo: ${a.amount} ${a.resource} gasto` : r > 0 ? `Custo: ${a.amount} ${a.resource} + ${r} extra não gasto` : `Custo: ${a.amount} ${a.resource} não gasto` : e.spendResource ? r > 0 ? `Custo: não resolvido (+${r} extra)` : "Custo: não resolvido" : "Custo: não gasto";
}
function Do(e) {
  const a = [`${Vo(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = No(e.roll);
  return r && a.push(`Dados: ${r}`), e.damageType && a.push(`Tipo: ${Uo(e.damageType)}`), a;
}
function _o(e) {
  return e ? [`Resistência: ${e.summary}`] : [];
}
function No(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const a = [];
  let r = "+";
  for (const n of t) {
    if (!n || typeof n != "object") continue;
    const o = n;
    if (o.operator === "+" || o.operator === "-") {
      r = o.operator;
      continue;
    }
    const s = Lo(o);
    s && (Mo(a, s.operator ?? r, s.value), r = "+");
  }
  return a.length > 0 ? a.join(" ") : null;
}
function Lo(e) {
  const t = Oo(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Fo(e);
}
function Oo(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const a = t;
    return typeof a.result != "number" || !Number.isFinite(a.result) ? [] : a.active !== !1 && a.discarded !== !0 ? [String(a.result)] : [];
  }) : [];
}
function Fo(e) {
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
function Mo(e, t, a) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${a}` : a);
    return;
  }
  e.push(`${t} ${a}`);
}
function Uo(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Ho(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Vo(e) {
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
function xo(e, t) {
  return Qt.map((a) => {
    const r = ea(e, a), n = a === "base" || r !== null, o = r ?? (a === "base" ? Zt : null);
    return {
      variant: a,
      label: o?.label ?? Xt(a),
      enabled: n,
      details: o ? Bo(o, t) : [],
      unavailableReason: n ? void 0 : "não disponível neste ritual"
    };
  });
}
function Bo(e, t) {
  const a = [], r = Object.values(e.rollFormulaOverrides ?? {});
  return r.length > 0 && a.push(r.join(", ")), aa(e.extraCost) ? a.push(t ? `+${e.extraCost} ${t.resource}` : `+${e.extraCost} PE/PD`) : a.push("custo base"), a;
}
function jo(e, t) {
  return ea(e, t) ?? Zt;
}
function ea(e, t) {
  return e.ritualForms?.[t] ?? null;
}
function Go(e) {
  return e.steps.some(ta);
}
function ta(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function aa(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const ra = "itemUsePrompts", na = "data-paranormal-toolkit-prompt-id", ae = "data-paranormal-toolkit-pending-id", Le = "data-paranormal-toolkit-executed-label", ke = "data-paranormal-toolkit-choice-group", oa = "data-paranormal-toolkit-skipped-label", ut = "data-paranormal-toolkit-detail-key", ct = "data-paranormal-toolkit-roll-card", Oe = "data-paranormal-toolkit-roll-detail-toggle", sa = "data-paranormal-toolkit-roll-detail-id", qo = `[${ae}]`, zo = `[${Oe}]`, lt = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, dt = `${h}__actions`, mt = `${h}__details`, Wo = `${h}__summary`, Ko = `${h}__title`, ia = `${h}__button--executed`, pt = `${h}__roll-card`;
let ft = !1, $e = null;
const D = /* @__PURE__ */ new Map();
function Yo(e) {
  $e = e, !ft && (Hooks.on("renderChatMessageHTML", (t, a) => {
    Xo(t, a, e);
  }), ft = !0);
}
async function gt(e) {
  const t = Qo(e);
  D.set(e.pendingId, t), await Ps(t), Zo(e.pendingId);
}
async function le(e, t) {
  const a = D.get(e);
  D.delete(e), a && await Ts(a, t);
}
function Qo(e) {
  const t = Ue(e.context.message);
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    summary: ms(e.context),
    executed: !1
  };
}
function Xo(e, t, a) {
  ws();
  const r = Me(t);
  if (!r) return;
  const n = Rs(e, r);
  for (const o of n)
    we(r, o);
  ua(r, a), Pe(r);
}
function Zo(e) {
  const t = D.get(e);
  if (!t) return;
  const a = t.messageId ? ks(t.messageId) : null;
  if (a) {
    we(a, t), ht(a), Pe(a);
    return;
  }
  if (t.messageId) return;
  const r = $s(t);
  r && (we(r, t), ht(r), Pe(r));
}
function ht(e) {
  $e && ua(e, $e);
}
function we(e, t) {
  if (e.querySelector(`[${na}="${j(t.pendingId)}"]`)) return;
  const a = Jo(e, t);
  ts(a, t), is(a, us(t)).append(ds(t));
}
function Jo(e, t) {
  const a = e.querySelector(`.${lt}`);
  if (a)
    return a;
  const r = document.createElement("section");
  r.classList.add(lt, h);
  const n = document.createElement("header");
  n.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Ko), s.textContent = es(t);
  const u = document.createElement("span");
  return u.classList.add(Wo), u.textContent = t.summary, n.append(o, s, u), r.append(n), fs(e).append(r), r;
}
function es(e) {
  const t = E(e.summaryLines ?? [], "Forma"), a = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${a} • ${t}` : a;
}
function ts(e, t) {
  const a = t.summaryLines ?? [], r = la(a, t);
  if (r) {
    as(e, r, t.pendingId);
    return;
  }
  cs(e, a);
}
function as(e, t, a) {
  if (e.querySelector(`[${ct}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(pt, `${pt}--${t.intent}`), r.setAttribute(ct, "true");
  const n = document.createElement("div");
  n.classList.add(`${h}__roll-summary`);
  const o = document.createElement("span");
  o.classList.add(`${h}__roll-chip`, `${h}__roll-chip--${t.intent}`), o.textContent = t.label.toUpperCase();
  const s = document.createElement("strong");
  s.classList.add(`${h}__roll-total`), s.textContent = String(t.total);
  const u = document.createElement("span");
  u.classList.add(`${h}__roll-formula`), u.textContent = t.formula, n.append(o, s, u), r.append(n), rs(r, t), ns(r, t), os(r, t, a), e.append(r);
}
function rs(e, t) {
  const a = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Es);
  if (a.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const n of a) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = n, r.append(o);
  }
  e.append(r);
}
function ns(e, t) {
  if (!t.resistance) return;
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance`);
  const r = document.createElement("strong");
  r.textContent = "Resistência";
  const n = document.createElement("span");
  n.textContent = t.resistance, a.append(r, n), e.append(a);
}
function os(e, t, a) {
  const r = ss(t);
  if (r.length === 0) return;
  const n = `${a}-roll-details`, o = document.createElement("button");
  o.type = "button", o.classList.add(`${h}__roll-detail-toggle`), o.setAttribute(Oe, n), o.setAttribute("aria-expanded", "false"), o.textContent = "▸ Ver detalhes";
  const s = document.createElement("dl");
  s.classList.add(`${h}__roll-detail-list`), s.setAttribute(sa, n), s.hidden = !0;
  for (const u of r) {
    const d = document.createElement("dt");
    d.textContent = u.label;
    const f = document.createElement("dd");
    f.textContent = u.value, s.append(d, f);
  }
  e.append(o, s);
}
function ss(e) {
  const t = [
    { label: "Fórmula", value: e.formula }
  ];
  e.diceBreakdown && t.push({ label: "Dados", value: e.diceBreakdown }), e.damageType && t.push({ label: "Tipo", value: e.damageType }), e.resistance && t.push({ label: "Resistência", value: e.resistance }), e.form && t.push({ label: "Forma", value: e.form }), e.cost && t.push({ label: "Custo", value: e.cost });
  for (const a of e.notes)
    t.push({ label: "Observação", value: a });
  for (const a of e.details)
    t.push({ label: "Detalhe", value: a });
  return t;
}
function is(e, t) {
  const a = e.querySelector(`.${dt}`);
  if (a)
    return a;
  const r = document.createElement("div");
  r.classList.add(dt);
  const n = document.createElement("strong");
  return n.classList.add(`${h}__actions-title`), n.textContent = t, r.append(n), e.append(r), r;
}
function us(e) {
  const t = la(e.summaryLines ?? [], e);
  return t?.intent === "damage" ? "Aplicar danos" : t?.intent === "healing" ? "Aplicar cura" : "Ações";
}
function cs(e, t) {
  if (t.length === 0) return;
  const a = ls(e);
  for (const r of t) {
    const n = vs(r);
    if (a.querySelector(`[${ut}="${j(n)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(ut, n), a.append(o);
  }
}
function ls(e) {
  const t = e.querySelector(`.${mt}`);
  if (t)
    return t;
  const a = document.createElement("ul");
  return a.classList.add(mt), e.append(a), a;
}
function ds(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(na, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(ia), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(ae, e.pendingId), t.setAttribute(Le, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(ke, e.choiceGroupId), t.setAttribute(oa, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function ms(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", a = ps(e);
  return `${t} → ${a}`;
}
function ps(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function fs(e) {
  return e.querySelector(".message-content") ?? e;
}
function ua(e, t) {
  const a = Me(e);
  if (!a) return;
  const r = a.querySelectorAll(qo);
  for (const n of r)
    n.dataset.paranormalToolkitBound !== "true" && (n.dataset.paranormalToolkitBound = "true", n.addEventListener("click", () => {
      hs(n, t);
    }));
}
function Pe(e) {
  const t = Me(e);
  if (!t) return;
  const a = t.querySelectorAll(zo);
  for (const r of a)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      gs(t, r);
    }));
}
function gs(e, t) {
  const a = t.getAttribute(Oe);
  if (!a) return;
  const r = e.querySelector(`[${sa}="${j(a)}"]`);
  if (!r) return;
  const n = r.hidden;
  r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.textContent = n ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function hs(e, t) {
  const a = e.getAttribute(ae);
  if (!a) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(a)) {
    ca(e, e.getAttribute(Le) ?? "✓ Automação aplicada"), ys(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function ca(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(ia), e.removeAttribute(ae), e.removeAttribute(Le);
}
function ys(e) {
  const t = e.getAttribute(ke);
  if (!t) return;
  const a = e.closest(`.${h}`) ?? e.parentElement;
  if (!a) return;
  const r = `[${ke}="${j(t)}"]`;
  for (const n of a.querySelectorAll(r)) {
    if (n === e) continue;
    const o = n.getAttribute(oa) ?? "✓ Outra opção escolhida";
    ca(n, o);
  }
}
function la(e, t) {
  const a = e.map(da).find(Cs);
  if (!a) return null;
  const r = E(e, "Forma"), n = E(e, "Custo"), o = E(e, "Dados") ?? E(e, `Dados (${a.label})`), s = E(e, "Tipo"), u = E(e, "Resistência"), d = ma(e, "Observação"), f = e.filter((y) => bs(y, a));
  return {
    ...a,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: r,
    cost: n,
    diceBreakdown: o,
    damageType: s,
    resistance: u,
    notes: d,
    details: f
  };
}
function da(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, a, r, n] = t, o = Number(n);
  return Number.isFinite(o) ? {
    label: a,
    formula: r,
    total: o,
    intent: As(a)
  } : null;
}
function As(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : "generic";
}
function E(e, t) {
  return ma(e, t)[0] ?? null;
}
function ma(e, t) {
  const a = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(a)) return [];
    const n = r.slice(a.length).trim();
    return n.length > 0 ? [n] : [];
  });
}
function bs(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Observação:") || da(e) ? !1 : e.trim().length > 0;
}
function Rs(e, t) {
  const a = /* @__PURE__ */ new Map();
  for (const r of D.values())
    Te(r, e, t) && a.set(r.pendingId, r);
  for (const r of Is(e))
    Te(r, e, t) && !a.has(r.pendingId) && a.set(r.pendingId, r);
  return Array.from(a.values()).sort((r, n) => r.createdAt - n.createdAt);
}
function Te(e, t, a) {
  const r = Ue(t) ?? a.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !yt(a, "itemId", e.itemId) ? !1 : !e.actorId || yt(a, "actorId", e.actorId);
}
function yt(e, t, a) {
  if (e.dataset[t] === a)
    return !0;
  const r = `data-${Ds(t)}`;
  for (const n of e.querySelectorAll(`[${r}]`))
    if (n.getAttribute(r) === a)
      return !0;
  return !1;
}
function ks(e) {
  const t = j(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function $s(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Te(e, null, t))
      return t;
  return null;
}
function ws() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [a, r] of D.entries())
    e - r.createdAt > t && D.delete(a);
}
async function Ps(e) {
  const t = ga(e.context.message);
  if (t)
    try {
      const a = Fe(t);
      a[e.pendingId] = fa(e), await pa(t, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", a);
    }
}
async function Ts(e, t) {
  const a = ga(e.context.message);
  if (a)
    try {
      const r = Fe(a), n = r[e.pendingId] ?? fa(e);
      r[e.pendingId] = {
        ...n,
        executedLabel: t ?? n.executedLabel,
        executed: !0
      }, await pa(a, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function Is(e) {
  return Object.values(Fe(Ie(e))).filter(ha);
}
function Fe(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, ra);
  if (!ya(t))
    return {};
  const a = {};
  for (const [r, n] of Object.entries(t))
    ha(n) && (a[r] = n);
  return a;
}
async function pa(e, t) {
  typeof e.setFlag == "function" && await Promise.resolve(e.setFlag(c, ra, t));
}
function fa(e) {
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
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    summary: e.summary,
    executed: e.executed
  };
}
function ga(e) {
  const t = Ie(e);
  if (t?.setFlag)
    return t;
  const a = Ue(e);
  if (!a) return null;
  const r = game.messages;
  return Ie(r?.get?.(a));
}
function Ie(e) {
  return e && typeof e == "object" ? e : null;
}
function ha(e) {
  return ya(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && K(e.messageId) && K(e.itemId) && K(e.actorId) && K(e.itemName) && de(e.title) && de(e.buttonLabel) && de(e.executedLabel) && At(e.choiceGroupId) && At(e.skippedLabel) && Ss(e.summaryLines) : !1;
}
function Cs(e) {
  return e !== null;
}
function ya(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function K(e) {
  return e === null || typeof e == "string";
}
function de(e) {
  return e === void 0 || typeof e == "string";
}
function At(e) {
  return e == null || typeof e == "string";
}
function Ss(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Es(e) {
  return typeof e == "string" && e.length > 0;
}
function Me(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ue(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function vs(e) {
  return e.trim().toLowerCase();
}
function Ds(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function j(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const bt = 1e3;
class _s {
  constructor(t, a, r, n) {
    this.workflow = t, this.debugOutput = n, this.ritualAssistant = new yo(t, a, r);
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
      settings: ze(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const a = ze();
    if (a.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Ce(t.item);
    if (!r.ok) {
      const n = r.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, n, r.error.reason), r.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: r.error.message,
        data: r.error
      });
      return;
    }
    if (await qn(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Rt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(t), a.executionMode) {
      case "ask":
        await this.handleAskMode(t, r.value);
        return;
      case "automatic":
        await this.executeAutomation(t, r.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const a = this.pendingExecutions.get(t);
    if (!a)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    if (a.kind === "workflow")
      return this.pendingExecutions.delete(t), await le(t), await this.executeAutomation(a.context, a.definition, a.mode), !0;
    const r = await this.ritualAssistant.applyAction(a.action);
    return r.ok ? (a.workflowContext.resourceTransactions.push(r.value), this.pendingExecutions.delete(t), await le(t), await this.resolveAlternativeResourceActions(a), this.setAttempt(a.context, "completed"), !0) : (this.handleResourceActionFailure(r), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Yo((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, a) {
    if (this.ritualAssistant.canHandle(t, a)) {
      await this.handleAssistedRitual(t, a);
      return;
    }
    await this.createPendingWorkflowPrompt(t, a);
  }
  async handleAssistedRitual(t, a) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const r = await this.ritualAssistant.run(t, a);
    switch (r.status) {
      case "cancelled":
        this.setAttempt(t, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(t, "failed", r.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: r.message,
          data: r.cause ?? r
        }), ui.notifications?.warn(`Paranormal Toolkit: ${r.message}`);
        return;
      case "completed-without-actions":
        this.setAttempt(t, "completed", "ritual-assisted-no-actions"), i.info("Ritual assistido concluído sem ações pendentes.", v(r.workflowContext));
        return;
      case "ready":
        await this.registerAssistedResourceActions(t, r.workflowContext, r.actions, r.summaryLines);
        return;
    }
  }
  async resolveAlternativeResourceActions(t) {
    const a = t.action.choiceGroupId;
    if (!a) return;
    const r = Array.from(this.pendingExecutions.entries()).filter(([, n]) => n.kind === "resource-action" && n.action.choiceGroupId === a);
    for (const [n, o] of r)
      o.kind === "resource-action" && (this.pendingExecutions.delete(n), await le(
        n,
        o.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerAssistedResourceActions(t, a, r, n) {
    let o;
    for (const s of r) {
      const u = $t();
      o ??= u, this.pendingExecutions.set(u, {
        kind: "resource-action",
        id: u,
        action: s,
        context: t,
        workflowContext: a,
        createdAt: Date.now()
      }), await gt({
        pendingId: u,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: s.choiceGroupId ?? null,
        skippedLabel: s.choiceGroupResolvedLabel ?? null,
        summaryLines: n
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", o), i.info("Ritual assistido preparado com ações pendentes.", v(a));
  }
  async createPendingWorkflowPrompt(t, a) {
    const r = $t();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: a,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await gt({
      pendingId: r,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", r);
  }
  async executeAutomation(t, a, r) {
    this.setAttempt(t, "running");
    const n = await this.workflow.runAutomation(a, {
      sourceActor: t.actor,
      sourceToken: t.token,
      item: t.item,
      targets: t.targets,
      flags: {
        itemUse: {
          source: t.source,
          executionMode: r
        }
      }
    });
    if (!n.ok) {
      this.setAttempt(t, "failed", n.error.reason), this.handleAutomationFailure(n.error);
      return;
    }
    this.setAttempt(t, "completed"), i.info("Automação executada por uso normal de item.", v(n.value.context));
  }
  handleAutomationFailure(t) {
    const a = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      i.warn(a, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      i.error(a, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    i.warn(a, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    i.warn(`Ação assistida falhou: ${t.error.message}`, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const a = Date.now(), r = kt(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      a - s > bt && this.recentExecutionKeys.delete(o);
    const n = this.recentExecutionKeys.get(r);
    return n !== void 0 && a - n <= bt;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(kt(t), Date.now());
  }
  setAttempt(t, a, r, n) {
    this.lastAttempt = Rt(t, a, r, n);
  }
}
function Rt(e, t, a, r) {
  return {
    source: e.source,
    status: t,
    reason: a,
    pendingId: r,
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
function kt(e) {
  const t = e.actor?.id ?? "no-actor", a = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${a}`;
}
function $t() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ns {
  constructor(t, a, r) {
    this.diagnostic = t, this.automationBinder = a, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const a = this.diagnostic.getApplicableEntries(t), r = [], n = [], o = B(t);
    for (const s of a) {
      const u = s.itemId ? o.find((y) => y.id === s.itemId) ?? null : null, d = s.match?.preset ?? null;
      if (!u || !d) {
        n.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(u, d);
      const f = await this.itemPatches.applyPresetItemPatch(u, d);
      r.push({
        itemId: u.id ?? null,
        itemName: u.name ?? "Ritual sem nome",
        presetId: d.id,
        presetLabel: d.label,
        previousStatus: s.status,
        itemPatch: f
      });
    }
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      applied: r,
      skipped: n
    };
  }
}
class Ls {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const a = B(t).map((u) => this.analyzeRitual(u)), r = a.filter(Y("upToDate")), n = a.filter(Y("available")), o = a.filter(Y("outdated")), s = a.filter(Y("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: a.length,
      upToDate: r,
      available: n,
      outdated: o,
      unsupported: s,
      canApply: n.length > 0 || o.length > 0
    };
  }
  getApplicableEntries(t) {
    const a = this.analyzeActor(t);
    return [...a.available, ...a.outdated];
  }
  analyzeRitual(t) {
    const a = this.automationRegistry.findForItem(t)[0] ?? null, r = Os(t);
    return a ? r ? r.source.type !== "preset" ? U({
      ritual: t,
      status: "upToDate",
      match: a,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${a.preset.label}.`
    }) : r.source.presetId === a.preset.id && r.source.presetVersion === a.preset.version ? U({
      ritual: t,
      status: "upToDate",
      match: a,
      flag: r,
      reason: `Preset ${a.preset.label} v${a.preset.version} já aplicado.`
    }) : U({
      ritual: t,
      status: "outdated",
      match: a,
      flag: r,
      reason: Fs(r, a.preset)
    }) : U({
      ritual: t,
      status: "available",
      match: a,
      flag: r,
      reason: `Preset encontrado: ${a.preset.label}.`
    }) : U({
      ritual: t,
      status: "unsupported",
      match: a,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function U(e) {
  const t = e.flag?.source, a = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? ee(e.match.preset) : null,
    appliedPresetId: a?.presetId ?? null,
    appliedPresetVersion: a?.presetVersion ?? null,
    reason: e.reason
  };
}
function Os(e) {
  const t = e.getFlag(c, "automation");
  return Se(t) ? t : null;
}
function Fs(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Y(e) {
  return (t) => t.status === e;
}
class Ms {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const a = this.createResourceOperationContent(t.transaction), r = ve(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: a,
      data: r,
      flags: {
        [c]: {
          resourceTransaction: r
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, a) {
    const r = this.createWorkflowSummaryContent(t, a), n = v(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: r,
      data: n,
      flags: {
        [c]: {
          workflowSummary: n
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const a = g(t.actorName), r = g(t.resource), n = g(wt(t)), o = g(Hs(t));
    return `
      <section class="${c}-card ${c}-resource-card">
        <header class="${c}-card__header">
          <strong>${n}</strong>
          <span>${a}</span>
        </header>
        <div class="${c}-card__body">
          <p><strong>${o}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, a) {
    const r = g(a.title ?? "Automação"), n = a.message ? `<p>${g(a.message)}</p>` : "", o = g(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = g(t.item.name ?? "Item sem nome"), u = t.targets.length > 0 ? t.targets.map((m) => g(m.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (m) => `<li><strong>${g(m.id)}:</strong> ${g(m.formula)} = ${m.total} <em>(${g(Us(m.intent))})</em>${m.damageType ? ` — ${g(m.damageType)}` : ""}</li>`
    ), f = t.ritualCosts.map(
      (m) => `<li><strong>${g(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${g(m.resource)} (${g(Vs(m.source))})</li>`
    ), y = t.damageInstances.map(
      (m) => `<li><strong>${g(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${g(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), b = t.healingInstances.map(
      (m) => `<li><strong>${g(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), P = t.resourceTransactions.map(
      (m) => `<li><strong>${g(m.actorName)}:</strong> ${g(wt(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), _ = t.phases.map((m) => g(m)).join(" &rarr; ");
    return `
      <section class="${c}-card ${c}-workflow-card">
        <header class="${c}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${c}-card__body">
          ${n}
          <p><strong>Origem:</strong> ${o}</p>
          <p><strong>Alvo:</strong> ${u}</p>
          ${f.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p><strong>Cura:</strong></p><ul>${b.join("")}</ul>` : ""}
          ${P.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${P.join("")}</ul>` : ""}
          ${_.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${_}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Us(e) {
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
function wt(e) {
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
function Hs(e) {
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
function Vs(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function g(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function xs() {
  const e = new Ur(), t = new Ln(e), a = new xr(), r = new Gr(a), n = new nn(e), o = new sn(), s = o.registerMany(Qa());
  if (!s.ok)
    throw new Error(s.error.message);
  const u = new on(), d = new an(), f = new Ls(o), y = new Ns(f, u, d), b = new Hn(), P = new Ms(b), _ = new Un(), m = new _n(t, r, P, _), He = new Mn(m, _), re = new _s(He, t, r, b);
  return re.addStrategy(new en((Ra) => re.handleItemUsed(Ra))), {
    ordem: n,
    resourceAdapter: e,
    ritualAdapter: a,
    ritualCosts: r,
    resources: t,
    automationRegistry: o,
    automationBinder: u,
    itemPatches: d,
    debugOutput: b,
    chatMessages: P,
    workflowHooks: _,
    automation: m,
    workflow: He,
    itemUseIntegration: re,
    ritualPresetDiagnostic: f,
    ritualPresetApplications: y
  };
}
const { ApplicationV2: Bs } = foundry.applications.api;
class Z extends Bs {
  constructor(t, a) {
    super({
      id: `${c}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Presets de rituais: ${t.name ?? "Ator"}`
      }
    }), this.actor = t, this.services = a;
  }
  actor;
  services;
  isApplying = !1;
  lastApplicationResult = null;
  static DEFAULT_OPTIONS = {
    id: `${c}-ritual-preset-manager`,
    classes: [c, "paranormal-toolkit-ritual-preset-manager"],
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
      apply: Z.onApply,
      cancel: Z.onCancel
    }
  };
  async _renderHTML(t, a) {
    const r = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), n = document.createElement("div");
    return n.className = "paranormal-toolkit-preset-manager", n.innerHTML = this.renderContent(r), n;
  }
  _replaceHTML(t, a, r) {
    a.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${k(It)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${k(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${me("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${me("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${me("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
    const t = this.lastApplicationResult.applied.length, a = this.lastApplicationResult.skipped.length, r = a > 0 ? ` ${a} pendente(s) não puderam ser aplicados.` : "";
    return `
      <div class="paranormal-toolkit-preset-manager__result">
        <strong>Aplicação concluída.</strong>
        <span>${t} preset(s) aplicado(s).${r}</span>
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
        const r = this.lastApplicationResult.applied.length;
        ui.notifications?.info(`Paranormal Toolkit: ${r} preset(s) aplicado(s) em ${this.actor.name ?? "ator"}.`);
      } finally {
        this.isApplying = !1, await this.render({ force: !0 });
      }
    }
  }
  static async onCancel(t) {
    t.preventDefault(), await this.close();
  }
}
function me(e, t, a, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${k(e)}</span>
        <small>${a.length}</small>
      </h3>
      ${a.length > 0 ? js(a) : qs(t)}
    </section>
  `;
}
function js(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Gs).join("")}</ol>`;
}
function Gs(e) {
  const t = e.preset, a = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${k(e.appliedPresetId)} v${k(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${k(e.itemName)}</strong>
        <span>${k(e.reason)}</span>
        ${r}
      </div>
      <em>${k(a)}</em>
    </li>
  `;
}
function qs(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${k({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function k(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const J = `${c}.manageRitualPresets`, Pt = `__${c}_ritualPresetHeaderControlRegistered`, zs = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Ws(e) {
  const t = globalThis;
  if (!t[Pt]) {
    for (const a of zs)
      Hooks.on(a, (r, n) => {
        Ks(r, n, e);
      });
    t[Pt] = !0, i.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Ks(e, t, a) {
  Array.isArray(t) && Qs(e) && (Ys(e, a), !t.some((r) => r.action === J) && t.push({
    action: J,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Aa(e, a);
    }
  }));
}
function Ys(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[J] && (e.options.actions[J] = (a) => {
    a.preventDefault(), a.stopPropagation(), Aa(e, t);
  }));
}
function Qs(e) {
  if (!game.user?.isGM) return !1;
  const t = ba(e);
  return t ? t.type === "agent" && B(t).length > 0 : !1;
}
function Aa(e, t) {
  const a = ba(e);
  if (!a) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Z(a, t).render({ force: !0 });
}
function ba(e) {
  return Tt(e.actor) ? e.actor : Tt(e.document) ? e.document : null;
}
function Tt(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let L = null;
Hooks.once("init", () => {
  Wa(), fr(), Fr(), i.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Ke.isSupportedSystem()) {
    i.warn(
      `Sistema não suportado: ${Ke.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  L = xs(), L.itemUseIntegration.registerStrategies(), $r(L), Nr(), Er(), Ws(L), i.info("Inicializado para o sistema Ordem Paranormal."), i.info(`API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${It} inicializado.`);
});
function Xs() {
  if (!L)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return L;
}
export {
  Xs as getToolkitServices
};
//# sourceMappingURL=main.js.map
