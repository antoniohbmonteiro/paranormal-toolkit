const c = "paranormal-toolkit", kt = "Paranormal Toolkit", pa = "ordemparanormal";
class B {
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
function f(e) {
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
  }) : Ie(t) ? f(t.definition) : l({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function ga(e) {
  return Ie(e.getFlag(c, "automation"));
}
function Ie(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && ya(t.source) && ha(t.definition);
}
function ha(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && b(t.label) && Array.isArray(t.steps) && t.steps.every(Aa);
}
function ya(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? b(t.presetId) && b(t.presetVersion) && b(t.appliedAt) : t.type === "manual" ? b(t.label) && b(t.appliedAt) : !1;
}
function Aa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Ra(t);
    case "spendRitualCost":
      return ba(t);
    case "rollFormula":
      return wa(t);
    case "modifyResource":
      return $a(t);
    case "chatCard":
      return ka(t);
    default:
      return !1;
  }
}
function Ra(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Pt(t);
}
function ba(e) {
  return e.type === "spendRitualCost";
}
function wa(e) {
  const t = e;
  return t.type === "rollFormula" && b(t.id) && b(t.formula) && (t.intent === void 0 || Ia(t.intent)) && (t.damageType === void 0 || b(t.damageType));
}
function $a(e) {
  const t = e;
  return t.type === "modifyResource" && Pa(t.actor) && Ta(t.resource) && Ca(t.operation) && Pt(t);
}
function ka(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Pt(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || b(e.amountFrom);
}
function Pa(e) {
  return e === "self" || e === "target";
}
function Ta(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ca(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Ia(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function b(e) {
  return typeof e == "string" && e.length > 0;
}
function Se(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const a = t;
    if (Array.isArray(a.contents))
      return a.contents.filter(Ue);
    if (va(t))
      return Array.from(t).filter(Ue);
  }
  return [];
}
function Sa(e) {
  return Se(e)[0] ?? null;
}
function Ea(e) {
  return Se(e).find(ga) ?? null;
}
function va(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ue(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function j(e) {
  return Se(e).filter((t) => t.type === "ritual");
}
function Tt(e) {
  return j(e)[0] ?? null;
}
function Da(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(ee);
      return i.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = H("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const a = q(t);
      if (!a) return [];
      const r = e.automationRegistry.findForItem(a).map(Be);
      return i.info(`Presets encontrados para ${a.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const a = H("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!a) return;
      const r = q(a);
      if (!r) return;
      const n = e.automationRegistry.require(t);
      if (!n.ok) {
        i.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      const o = await me(e, r, n.value);
      i.info(`Preset ${n.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = H("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const a = q(t);
      if (!a) return;
      const r = e.automationRegistry.findForItem(a)[0];
      if (!r) {
        i.warn(`Nenhum preset compatível encontrado para ${a.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${a.name}.`);
        return;
      }
      const n = await me(e, a, r.preset);
      i.info(`Melhor preset aplicado em ${a.name}.`, { match: Be(r), itemPatch: n }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return He(e);
    },
    async applyBestPresetsToActorRituals() {
      return He(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = H("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const a = q(t);
      a && (await e.automationBinder.clear(a), i.info(`Automação removida do ritual ${a.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${a.name}.`));
    }
  };
}
async function He(e) {
  const t = H("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const a = j(t);
  if (a.length === 0)
    return i.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Ve(t);
  const r = Ve(t, a.length);
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
    const s = await me(e, n, o.preset);
    r.applied.push(_a(n, o, s));
  }
  return i.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Na(r), r;
}
async function me(e, t, a) {
  return await e.automationBinder.applyPreset(t, a), e.itemPatches.applyPresetItemPatch(t, a);
}
function _a(e, t, a) {
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
function Ve(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Na(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", a = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${a}${t}.`
  );
}
function Be(e) {
  return {
    preset: ee(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function H(e) {
  const t = B.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function q(e) {
  const t = Tt(e);
  return t || (i.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function E(e) {
  return e ? {
    id: e.id,
    source: {
      ...Oa(e.sourceActor),
      token: e.sourceToken
    },
    item: Fa(e.item),
    targets: e.targets.map(La),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: je(e.rollRequests, Ct),
    rolls: je(e.rolls, Ma),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Ee),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Ee(e) {
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
function Oa(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Fa(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function La(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Ct(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Ma(e) {
  return {
    ...Ct(e),
    total: e.total
  };
}
function je(e, t) {
  return Object.fromEntries(Object.entries(e).map(([a, r]) => [a, t(r)]));
}
function Ua(e) {
  return {
    getSelected() {
      return B.getSelectedActor();
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
      await _(
        e,
        "Gasto de PE",
        T("Nenhum ator encontrado para gastar PE."),
        (a) => e.resources.spend(a, "PE", t)
      );
    },
    async spendPD(t) {
      await _(
        e,
        "Gasto de PD",
        T("Nenhum ator encontrado para gastar PD."),
        (a) => e.resources.spend(a, "PD", t)
      );
    },
    async damagePV(t) {
      await _(
        e,
        "Dano em PV",
        T("Nenhum ator encontrado para causar dano em PV."),
        (a) => e.resources.damage(a, "PV", t)
      );
    },
    async healPV(t) {
      await _(
        e,
        "Cura de PV",
        T("Nenhum ator encontrado para curar PV."),
        (a) => e.resources.heal(a, "PV", t)
      );
    },
    async damageSAN(t) {
      await _(
        e,
        "Dano em SAN",
        T("Nenhum ator encontrado para causar dano em SAN."),
        (a) => e.resources.damage(a, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await _(
        e,
        "Recuperação de SAN",
        T("Nenhum ator encontrado para recuperar SAN."),
        (a) => e.resources.recover(a, "SAN", t)
      );
    }
  };
}
async function _(e, t, a, r) {
  if (!a) return;
  const n = await r(a);
  if (!n.ok) {
    Ha(n.error);
    return;
  }
  const o = n.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    i.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  i.info(`${t} realizado:`, Ee(o));
}
function T(e) {
  const t = B.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ha(e) {
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
function Va() {
  x($.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), x($.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), x($.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), x($.chat, {
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
async function k(e, t) {
  await game.settings.set(c, $[e], t);
}
function x(e, t) {
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
function Ba() {
  return {
    status() {
      return fe();
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
const It = "ritual.costOnly", St = "ritual.simpleHealing", ja = "ritual.eletrocussao", Et = "ritual.simpleDamage", vt = "generic.simpleHealing", Dt = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function qa() {
  return [
    xa(),
    za(),
    Ga(),
    Wa(),
    Ka()
  ];
}
function xa() {
  return {
    id: It,
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
function za() {
  return {
    id: St,
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
    automation: _t(),
    itemPatch: Qa()
  };
}
function Ga() {
  return {
    id: ja,
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
    automation: Ya(),
    itemPatch: Xa()
  };
}
function Wa() {
  return {
    id: Et,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: ve()
  };
}
function Ka() {
  return {
    id: vt,
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
function _t(e = "2d8+2") {
  return Nt(
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
function Ya() {
  return {
    ...ve("1d8", {
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
function ve(e = "1d8", t = {}) {
  const a = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", n = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Nt(
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
function Qa() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Dt,
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
function Xa() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Dt,
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
function Nt(e, t, a) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: a
    })
  };
}
function De() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: F(t.id),
    actorId: F(t.actor?.id),
    sceneId: F(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Ot() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: F(e.id),
    actorId: F(t?.id),
    sceneId: F(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function F(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Za(e) {
  return {
    logFirstRitualCost() {
      const t = C("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const a = I(t);
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
      const r = C("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const n = I(r);
      if (n) {
        if (!tr(t, a)) {
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
      const t = C("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const a = I(t);
      a && (await a.unsetFlag(c, "ritual.cost"), i.info(`Custo customizado removido de ${a.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${a.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = C("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const a = I(t);
      if (!a) return;
      const r = e.automationRegistry.require(It);
      if (!r.ok) {
        i.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, r.value), i.info(`Preset de custo aplicado ao ritual: ${a.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${a.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const a = C("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!a) return;
      const r = I(a);
      if (!r) return;
      if (!qe(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const n = e.automationRegistry.require(St);
      if (!n.ok) {
        i.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value, {
        definition: _t(t)
      }), i.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const a = C("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!a) return;
      const r = I(a);
      if (!r) return;
      if (!qe(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const n = e.automationRegistry.require(Et);
      if (!n.ok) {
        i.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value, {
        definition: ve(t)
      }), i.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = C("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const a = I(t);
      a && await Ja(e, t, a);
    }
  };
}
async function Ja(e, t, a) {
  const r = Ce(a);
  if (!r.ok) {
    i.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const n = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ot(),
    item: a,
    targets: De()
  });
  if (!n.ok) {
    er(n.error);
    return;
  }
  i.info("Automação de ritual executada com sucesso.", E(n.value.context));
}
function er(e) {
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
function C(e) {
  const t = B.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function I(e) {
  const t = Tt(e);
  return t || (i.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function tr(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function qe(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const ar = ["disabled", "ask", "automatic"], rr = ["buttons", "confirm"], Ft = "ask";
function nr(e) {
  return typeof e == "string" && ar.includes(e);
}
function or(e) {
  return typeof e == "string" && rr.includes(e);
}
function sr(e) {
  return nr(e) ? e : or(e) ? "ask" : Ft;
}
const Y = {
  executionMode: "itemUse.executionMode",
  autoRun: "itemUse.autoRun.enabled"
};
function ir() {
  game.settings.register(c, Y.executionMode, {
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
    default: Ft
  }), game.settings.register(c, Y.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function xe() {
  return {
    executionMode: sr(game.settings.get(c, Y.executionMode))
  };
}
async function S(e) {
  await game.settings.set(c, Y.executionMode, e);
}
function ur(e) {
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
const cr = [
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
function lr(e) {
  return {
    phases() {
      return cr;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = ne("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const a = Ea(t);
      if (!a) {
        i.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await ze(e, t, a);
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
      if (!fr(a)) {
        i.warn(`UUID não resolveu para um Item: ${t}`, a), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = mr(a) ?? ne("Nenhum ator encontrado para executar automação do item.");
      r && await ze(e, r, a);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = ne("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const a = Sa(t);
      if (!a) {
        i.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(vt);
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
async function ze(e, t, a) {
  const r = Ce(a);
  if (!r.ok) {
    i.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const n = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ot(),
    item: a,
    targets: De()
  });
  if (!n.ok) {
    dr(n.error);
    return;
  }
  i.info("Automação executada com sucesso.", E(n.value.context));
}
function dr(e) {
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
  const t = B.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function mr(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function fr(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function pr(e) {
  const t = Ua(e), a = Da(e), r = Za(e), n = lr(e), o = Ba(), s = ur(e);
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
function gr(e) {
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
    debug: pr(e)
  }, a = globalThis;
  return a[c] = t, a.ParanormalToolkit = t, t;
}
class Ge {
  static isSupportedSystem() {
    return game.system.id === pa;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function hr() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: L(t.id),
    actorId: L(t.actor?.id),
    sceneId: L(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Lt() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, a = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: L(e.id),
    actorId: L(t?.id),
    sceneId: L(e.scene?.id),
    name: a
  };
}
function yr(e, t = Lt()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Ar(e) {
  if (!wr(e)) return null;
  const t = e.getFlag(c, "workflow");
  return br(t) ? t : null;
}
function Rr() {
  return `flags.${c}.workflow`;
}
function We(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), a = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || a !== void 0;
}
function Ke(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), a = foundry.utils.getProperty(e, "_source.speaker.actor");
  return pe(t) || pe(a);
}
function br(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function wr(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function L(e) {
  return pe(e) ? e : null;
}
function pe(e) {
  return typeof e == "string" && e.length > 0;
}
function $r() {
  const e = (t, a) => {
    kr(t, a);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function kr(e, t) {
  const a = Ar(e);
  if (!a || a.targets.length === 0) return;
  const r = Tr(t);
  if (!r || r.querySelector(`.${c}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Pr(a));
}
function Pr(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const a = document.createElement("strong");
  return a.textContent = "Paranormal Toolkit", t.append(a), e.source && t.append(Ye("Origem", e.source.name)), t.append(Ye("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Ye(e, t) {
  const a = document.createElement("p");
  a.classList.add(`${c}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const n = document.createElement("span");
  return n.textContent = t, a.append(r, n), a;
}
function Tr(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Cr() {
  Hooks.on("preCreateChatMessage", (e, t, a, r) => {
    if (!Ir(r) || !Sr(e) || We(e) || We(t)) return;
    const n = hr();
    if (n.length === 0 || !Ke(e) && !Ke(t)) return;
    const o = Lt();
    e.updateSource({
      [Rr()]: yr(n, o)
    }), i.info("Targets capturados para ChatMessage.", { source: o, targets: n });
  });
}
function Ir(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Sr(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const Mt = {
  enabled: "dice.animations.enabled"
};
function Er() {
  game.settings.register(c, Mt.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function vr() {
  return {
    enabled: game.settings.get(c, Mt.enabled) === !0
  };
}
const V = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Ut = {
  PV: "system.attributes.hp"
}, ge = {
  PV: [V.PV, Ut.PV],
  SAN: [V.SAN],
  PE: [V.PE],
  PD: [V.PD]
}, he = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Dr {
  getResource(t, a) {
    const r = Qe(t, a);
    if (!r.ok)
      return l(r.error);
    const n = r.value, o = `${n}.value`, s = `${n}.max`, u = foundry.utils.getProperty(t, o), d = foundry.utils.getProperty(t, s), p = Ze(t, a, o, u, "valor atual");
    if (p) return l(p);
    const y = Ze(t, a, s, d, "valor máximo");
    return y ? l(y) : f({
      value: u,
      max: d
    });
  }
  async updateResourceValue(t, a, r) {
    const n = Qe(t, a);
    if (!n.ok)
      throw new Error(n.error.message);
    await t.update({ [`${n.value}.value`]: r });
  }
}
function Qe(e, t) {
  const a = _r(e.type, t);
  if (a && Xe(e, a))
    return f(a);
  const r = ge[t].find(
    (n) => Xe(e, n)
  );
  return r ? f(r) : l({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Nr(e, t),
    path: ge[t].join(" | ")
  });
}
function _r(e, t) {
  return e === "threat" ? Ut[t] ?? null : e === "agent" ? V[t] : null;
}
function Xe(e, t) {
  const a = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof a == "number" && Number.isFinite(a) && typeof r == "number" && Number.isFinite(r);
}
function Nr(e, t) {
  const a = e.type ?? "unknown", r = ge[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${a}). Paths testados: ${r}.`;
}
function Ze(e, t, a, r, n) {
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
class Or {
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
      const s = he.ritualItem.circleCandidates;
      return l({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: n } = a, o = Fr(n);
    return o ? f(o) : l({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(n)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: n
    });
  }
  readCircleFromKnownPaths(t) {
    for (const a of he.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, a);
      if (r != null)
        return { path: a, value: r };
    }
    return null;
  }
}
function Fr(e) {
  if (Je(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const a = Number(t);
    if (Je(a))
      return a;
  }
  return null;
}
function Je(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Lr = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Mr {
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
    const r = a.value, n = Ur(t.ritual, r);
    return n.ok ? n.value ? f(n.value) : f({
      resource: "PE",
      amount: Lr[r],
      source: "default-by-circle",
      circle: r
    }) : l(n.error);
  }
}
function Ur(e, t) {
  const a = e.getFlag(c, "ritual.cost");
  return a == null ? { ok: !0, value: null } : Hr(a) ? {
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
function Hr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const oe = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Vr(e) {
  if (!Gr(e.item)) return null;
  const t = ye(e.actor) ? e.actor : Br(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: qr(e.token) ?? jr(t),
    targets: De(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Br(e) {
  const t = e;
  return ye(t.actor) ? t.actor : ye(e.parent) ? e.parent : null;
}
function jr(e) {
  const t = xr(e) ?? zr(e);
  return t ? Ht(t) : null;
}
function qr(e) {
  return Ae(e) ? Ht(e) : null;
}
function xr(e) {
  if (!e) return null;
  const t = e, a = t.token;
  return Ae(a) ? a : (t.getActiveTokens?.() ?? []).find(Ae) ?? null;
}
function zr(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Ht(e) {
  const t = e.actor ?? null;
  return {
    tokenId: se(e.id),
    actorId: se(t?.id),
    sceneId: se(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Gr(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ye(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Ae(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function se(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Wr {
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
    const a = Vr(Kr(t));
    if (!a) {
      i.warn(`${oe.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(a);
  }
}
function Kr(e) {
  return e && typeof e == "object" ? e : {};
}
class Yr {
  async applyPresetItemPatch(t, a) {
    const r = a.itemPatch;
    if (!r) return ie("missing-item-patch");
    if (t.type !== "ritual") return ie("unsupported-item-type");
    const n = Qr(r);
    return Object.keys(n).length === 0 ? ie("empty-update") : (await t.update(n), {
      applied: !0,
      updateData: n
    });
  }
}
function Qr(e) {
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
class Xr {
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
    return this.getNumber(t, he.ritual.dt, 0);
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
class Zr {
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
class Jr {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const a = en(t);
    return a.ok ? this.presets.has(t.id) ? l({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, ue(t)), f(t)) : a;
  }
  registerMany(t) {
    const a = [];
    for (const r of t) {
      const n = this.register(r);
      if (!n.ok)
        return n;
      a.push(n.value);
    }
    return f(a);
  }
  get(t) {
    const a = this.presets.get(t);
    return a ? ue(a) : null;
  }
  require(t) {
    const a = this.get(t);
    return a ? f(a) : l({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(ue);
  }
  findForItem(t) {
    return this.list().map((a) => tn(a, t)).filter((a) => a !== null).sort((a, r) => r.score - a.score || a.preset.id.localeCompare(r.preset.id));
  }
}
function en(e) {
  return !ce(e.id) || !ce(e.version) || !ce(e.label) ? l({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? l({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : f(e);
}
function tn(e, t) {
  if (e.matchers.length === 0)
    return null;
  const a = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, a.push(`itemType:${t.type}`);
  }
  for (const n of e.matchers) {
    const o = an(n, t);
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
function an(e, t) {
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
      const a = et(t.name), r = e.names.map(et).includes(a);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${a}`
      };
    }
    case "ritualCircle": {
      const a = rn(t), r = a !== null && e.circles.includes(a);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${a ?? "unknown"}`
      };
    }
  }
}
function et(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function rn(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), a = typeof t == "string" ? Number(t) : t;
  return a === 1 || a === 2 || a === 3 || a === 4 ? a : null;
}
function ue(e) {
  return structuredClone(e);
}
function ce(e) {
  return typeof e == "string" && e.length > 0;
}
function Q(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? l({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : f(e.amount);
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
    }) : f(n);
  }
  return l({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function te(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const nn = "dice-so-nice";
async function on(e) {
  if (!vr().enabled || !sn()) return;
  const t = un();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (a) {
      i.warn("Não foi possível animar a rolagem com Dice So Nice.", a);
    }
}
function sn() {
  return game.modules.get(nn)?.active === !0;
}
function un() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function cn(e, t, a) {
  if (!tt(e.id) || !tt(e.formula))
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
    await on(n);
    const u = {
      ...a.rollRequests[e.id] ?? Vt(e, t),
      total: o,
      roll: n
    };
    return a.rolls[e.id] = u, f(u);
  } catch (r) {
    return l({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function Vt(e, t) {
  const a = e.intent ?? ln(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: a,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function ln(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function tt(e) {
  return typeof e == "string" && e.length > 0;
}
async function Re(e, t, a, r, n) {
  switch (r) {
    case "spend":
      return a !== "PE" && a !== "PD" ? G(t, a, r, n) : e.spend(t, a, n);
    case "damage":
      return a !== "PV" && a !== "SAN" ? G(t, a, r, n) : e.damage(t, a, n);
    case "heal":
      return a !== "PV" ? G(t, a, r, n) : e.heal(t, a, n);
    case "recover":
      return a !== "SAN" ? G(t, a, r, n) : e.recover(t, a, n);
  }
}
function G(e, t, a, r) {
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
function dn(e) {
  const { step: t, context: a, transaction: r, stepIndex: n, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = mn(t, a, r, n);
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
    const s = fn(t, a, r, n);
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
function mn(e, t, a, r) {
  const n = te(e.amountFrom), o = n ? t.rolls[n] : void 0;
  return {
    id: Bt(t.id, "damage", r, t.damageInstances.length),
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
function fn(e, t, a, r) {
  const n = te(e.amountFrom);
  return {
    id: Bt(t.id, "healing", r, t.healingInstances.length),
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
function Bt(e, t, a, r) {
  return `${e}.${t}.${a}.${r}`;
}
function pn(e, t, a) {
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
function gn(e) {
  const { step: t, context: a, stepIndex: r, metadata: n, lifecycle: o } = e;
  o.emit("beforeApply", a, { stepIndex: r, step: t, metadata: n }), jt("before", e), at("before", e), at("resolve", e);
}
function hn(e) {
  const { step: t, context: a, stepIndex: r, metadata: n, lifecycle: o } = e;
  o.emit("apply", a, { stepIndex: r, step: t, metadata: n }), jt("apply", e);
}
function yn(e) {
  const { step: t, context: a, stepIndex: r, metadata: n, lifecycle: o } = e;
  o.emit("afterApply", a, { stepIndex: r, step: t, metadata: n });
}
function jt(e, t) {
  const { step: a, context: r, stepIndex: n, metadata: o, lifecycle: s } = t, u = An(e, a.operation);
  u && s.emit(u, r, {
    stepIndex: n,
    step: a,
    metadata: o
  });
}
function at(e, t) {
  const { step: a, context: r, stepIndex: n, metadata: o, lifecycle: s } = t;
  a.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: n,
    step: a,
    metadata: o
  });
}
function An(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Rn(e, t, a) {
  try {
    return await e.createWorkflowSummaryMessage(a, t), f(void 0);
  } catch (r) {
    return l({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function bn(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return wn(e, t);
    case "spendRitualCost":
      return $n(e, t);
  }
}
async function wn(e, t) {
  const { context: a, resources: r } = e, n = Q(t, a);
  return n.ok ? qt(await r.spend(a.sourceActor, t.resource, n.value), a) : l(n.error);
}
async function $n(e, t) {
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
  }), qt(await r.spend(a.sourceActor, s.resource, s.amount), a, t);
}
function qt(e, t, a) {
  return e.ok ? (t.resourceTransactions.push(e.value), f(void 0)) : (a?.type === "spendRitualCost" && t.ritualCosts.pop(), l({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function kn(e) {
  const { step: t, context: a, stepIndex: r, lifecycle: n, execute: o } = e, s = Pn(t);
  for (const d of s.before)
    n.emit(d, a, { stepIndex: r, step: t });
  const u = await o();
  if (!u.ok)
    return u;
  for (const d of s.after)
    n.emit(d, a, { stepIndex: r, step: t });
  return u;
}
function Pn(e) {
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
class Tn {
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
    return f({ definition: t, context: a });
  }
  async runStep(t, a, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, a, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, a, r);
      default:
        return kn({
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
    const n = await bn({
      step: t,
      context: a,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return n.ok ? f(void 0) : l({ ...n.error, stepIndex: r, step: t, context: a });
  }
  async runRollFormulaStepWithLifecycle(t, a, r) {
    const n = Vt(t, r);
    a.rollRequests[n.id] = n, this.lifecycle.emit("beforeRoll", a, { stepIndex: r, step: t, rollRequest: n }), this.emitSpecificRollPhase("before", n, a, r, t), this.lifecycle.emit("roll", a, { stepIndex: r, step: t, rollRequest: n }), this.emitSpecificRollPhase("roll", n, a, r, t);
    const o = await this.runRollFormulaStep(t, a, r);
    if (!o.ok)
      return o;
    const s = a.rolls[n.id];
    return this.emitSpecificRollPhase("after", n, a, r, t, s), this.lifecycle.emit("afterRoll", a, { stepIndex: r, step: t, rollRequest: n, rollResult: s }), f(void 0);
  }
  async runRollFormulaStep(t, a, r) {
    const n = await cn(t, r, a);
    return n.ok ? f(void 0) : l({ ...n.error, stepIndex: r, step: t, context: a });
  }
  async runModifyResourceStepWithLifecycle(t, a, r) {
    const n = Q(t, a);
    if (!n.ok)
      return l({ ...n.error, stepIndex: r, step: t, context: a });
    const o = pn(t, a, n.value);
    gn({
      step: t,
      context: a,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), hn({
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
      const d = await Re(this.resources, u, t.resource, t.operation, n.value), p = this.handleResourceOperationResult(d, a, r, t);
      if (!p.ok)
        return p;
      dn({
        step: t,
        context: a,
        transaction: p.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return yn({
      step: t,
      context: a,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), f(void 0);
  }
  async runModifyResourceStep(t, a, r) {
    const n = Q(t, a);
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
    return f(void 0);
  }
  async runChatCardStep(t, a, r) {
    const n = await Rn(this.messages, t, a);
    return n.ok ? f(void 0) : l({ ...n.error, stepIndex: r, step: t, context: a });
  }
  handleResourceOperationResult(t, a, r, n) {
    return t.ok ? (a.resourceTransactions.push(t.value), f(t.value)) : l({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: n,
      context: a,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, a, r, n, o, s) {
    const u = Cn(t, a.intent);
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
function Cn(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class In {
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
    const { afterValue: d, appliedAmount: p } = u.value, y = {
      value: d,
      max: s.max
    };
    try {
      d !== s.value && await this.adapter.updateResourceValue(t, a, d);
    } catch (R) {
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
        cause: R
      });
    }
    return f({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: a,
      operation: r,
      requestedAmount: n,
      appliedAmount: p,
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
        }) : f({
          afterValue: a.value - r,
          appliedAmount: r
        });
      case "damage": {
        const n = Math.max(0, a.value - r);
        return f({
          afterValue: n,
          appliedAmount: a.value - n
        });
      }
      case "heal":
      case "recover": {
        const n = Math.min(a.max, a.value + r);
        return f({
          afterValue: n,
          appliedAmount: n - a.value
        });
      }
    }
  }
}
function Sn(e) {
  return {
    id: En(),
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
function En() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class vn {
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
    return E(this.lastContext);
  }
  async runAutomation(t, a) {
    const r = Sn(a);
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
class Dn {
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
class _n {
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
      whisper: Nn(),
      flags: {
        ...t.flags,
        [c]: {
          ...On(t.flags),
          debugOutput: !0
        }
      }
    }), a.console && t.data !== void 0 && i.info("Debug chat criado.", t.data), !0);
  }
  emit(t, a) {
    const r = fe();
    if (!r.enabled)
      return;
    const n = a.notification ?? rt(a);
    r.console && this.emitConsole(t, a), r.ui && this.emitUi(t, n);
  }
  emitConsole(t, a) {
    const r = rt(a);
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
function rt(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Nn() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function On(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const Fn = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", xt = `${c}-inline-roll-neutralized`, Ln = `${c}-inline-roll-notice`, _e = `data-${c}-inline-roll-neutralized`, nt = `data-${c}-inline-roll-notice`, Mn = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Un(e) {
  const t = Zn(e.message), a = await Hn(e.message), r = Vn(t);
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
async function Hn(e) {
  const t = Yn(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const a = Bn(t.content);
  return a.replacementCount === 0 || a.content === t.content ? { updated: !1, replacementCount: a.replacementCount } : { updated: await Qn(t, a.content), replacementCount: a.replacementCount };
}
function Vn(e) {
  const t = e ? Xn(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const a = zt(t);
  return a > 0 && Gt(Gn(t)), { replacementCount: a };
}
function Bn(e) {
  const t = jn(e), a = document.createElement("template");
  a.innerHTML = t.content;
  const r = zt(a.content), n = t.replacementCount + r;
  return n === 0 ? { content: e, replacementCount: 0 } : (Gt(a.content), { content: a.innerHTML, replacementCount: n });
}
function jn(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, n) => (t += 1, xn(n.trim()))), replacementCount: t };
}
function zt(e) {
  const t = qn(e);
  for (const a of t)
    a.replaceWith(zn(Wn(a)));
  return t.length;
}
function qn(e) {
  const t = /* @__PURE__ */ new Set();
  for (const a of e.querySelectorAll(Fn))
    a.getAttribute(_e) !== "true" && t.add(a);
  return Array.from(t);
}
function xn(e) {
  return `<span class="${xt}" ${_e}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Jn(e)}</span>`;
}
function zn(e) {
  const t = document.createElement("span");
  return t.classList.add(xt), t.setAttribute(_e, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Gt(e) {
  if (e.querySelector?.(`[${nt}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Ln), t.setAttribute(nt, "true"), t.textContent = Mn, e.append(t);
}
function Gn(e) {
  return e.querySelector(".message-content") ?? e;
}
function Wn(e) {
  const a = e.getAttribute("data-formula") ?? Kn(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return a && a.length > 0 ? a : "rolagem inline";
}
function Kn(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Yn(e) {
  return e && typeof e == "object" ? e : null;
}
async function Qn(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (a) {
    return i.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", a), !1;
  }
}
function Xn(e) {
  const t = eo(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Zn(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Jn(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function eo(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Wt = ["base", "discente", "verdadeiro"];
function Kt(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function to(e) {
  return typeof e == "string" && Wt.includes(e);
}
async function ao(e) {
  const t = uo();
  return t ? new Promise((a) => {
    let r = !1;
    const n = (o) => {
      r || (r = !0, a(o));
    };
    new t({
      title: `Conjurar ${e.ritual.name ?? "ritual"}`,
      content: ro(e),
      default: "cast",
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: () => n(null)
        },
        cast: {
          icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
          label: "Conjurar",
          callback: (o) => n(oo(o, e.defaultSpendResource))
        }
      },
      close: () => n(null)
    }).render(!0);
  }) : (ui.notifications?.warn("Paranormal Toolkit: Dialog não disponível. Usando opções padrão do ritual."), {
    variant: "base",
    spendResource: e.defaultSpendResource
  });
}
function ro(e) {
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
        ${e.variantOptions.map(no).join("")}
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
function no(e) {
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
function oo(e, t) {
  const a = io(e), r = so(a), n = a?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: n
  };
}
function so(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return to(t) ? t : "base";
}
function io(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function uo() {
  return globalThis.Dialog ?? null;
}
function M(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const Yt = {
  label: "Padrão"
};
class co {
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
    const r = this.resolveCostPreview(t), n = Eo(a, r), o = await ao({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((P) => P.name),
      cost: r,
      defaultSpendResource: _o(a),
      variantOptions: n
    });
    if (!o)
      return { status: "cancelled" };
    const s = Do(a, o.variant), u = lo(a, o, s, r);
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
    const p = d.value.context, y = fo(a, t, p), R = Ao(o, s, r, p);
    return y.ok ? y.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: p,
      summaryLines: R
    } : {
      status: "ready",
      workflowContext: p,
      actions: y.actions,
      summaryLines: R
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
function lo(e, t, a, r) {
  const n = [];
  for (const o of e.steps)
    o.type === "modifyResource" || o.type === "chatCard" || Xt(o) && !t.spendResource || n.push(mo(o, a));
  return t.spendResource && r && Zt(a.extraCost) && n.push({
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
function mo(e, t) {
  if (e.type !== "rollFormula") return e;
  const a = t.rollFormulaOverrides?.[e.id];
  return a ? {
    ...e,
    formula: a
  } : e;
}
function fo(e, t, a) {
  const r = [];
  for (const n of e.steps) {
    if (n.type !== "modifyResource") continue;
    const o = Q(n, a);
    if (!o.ok)
      return {
        ok: !1,
        reason: o.error.reason,
        message: o.error.message
      };
    const s = yo(n.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const u of s)
      r.push(po(n, u, o.value));
  }
  return { ok: !0, actions: r };
}
function po(e, t, a) {
  const r = t.name ?? "Ator sem nome";
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: a,
    label: go(e, r, a),
    executedLabel: ho(e, r)
  };
}
function go(e, t, a) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${t} em ${a} PV` : e.operation === "damage" ? `Aplicar ${a} de dano em ${t}` : e.operation === "recover" ? `Recuperar ${a} ${e.resource} de ${t}` : e.operation === "spend" ? `Gastar ${a} ${e.resource} de ${t}` : `Aplicar ${a} ${e.resource} em ${t}`;
}
function ho(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function yo(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((a) => a.actor ? [a.actor] : []);
  }
}
function Ao(e, t, a, r) {
  return [
    `Forma: ${Kt(e.variant)}`,
    Ro(e, t, a),
    ...Object.values(r.rolls).flatMap(bo),
    ...Io(t)
  ];
}
function Ro(e, t, a) {
  const r = t.extraCost ?? 0;
  return a ? e.spendResource ? r > 0 ? `Custo: ${a.amount + r} ${a.resource} gasto (${a.amount} base + ${r} extra)` : `Custo: ${a.amount} ${a.resource} gasto` : r > 0 ? `Custo: ${a.amount} ${a.resource} + ${r} extra não gasto` : `Custo: ${a.amount} ${a.resource} não gasto` : e.spendResource ? r > 0 ? `Custo: não resolvido (+${r} extra)` : "Custo: não resolvido" : "Custo: não gasto";
}
function bo(e) {
  const a = [`${So(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = wo(e.roll);
  return r && a.push(`Dados: ${r}`), e.damageType && a.push(`Tipo: ${Co(e.damageType)}`), a;
}
function wo(e) {
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
    const s = $o(o);
    s && (To(a, s.operator ?? r, s.value), r = "+");
  }
  return a.length > 0 ? a.join(" ") : null;
}
function $o(e) {
  const t = ko(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Po(e);
}
function ko(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const a = t;
    return typeof a.result != "number" || !Number.isFinite(a.result) ? [] : a.active !== !1 && a.discarded !== !0 ? [String(a.result)] : [];
  }) : [];
}
function Po(e) {
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
function To(e, t, a) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${a}` : a);
    return;
  }
  e.push(`${t} ${a}`);
}
function Co(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Io(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function So(e) {
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
function Eo(e, t) {
  return Wt.map((a) => {
    const r = Qt(e, a), n = a === "base" || r !== null, o = r ?? (a === "base" ? Yt : null);
    return {
      variant: a,
      label: o?.label ?? Kt(a),
      enabled: n,
      details: o ? vo(o, t) : [],
      unavailableReason: n ? void 0 : "não disponível neste ritual"
    };
  });
}
function vo(e, t) {
  const a = [], r = Object.values(e.rollFormulaOverrides ?? {});
  return r.length > 0 && a.push(r.join(", ")), Zt(e.extraCost) ? a.push(t ? `+${e.extraCost} ${t.resource}` : `+${e.extraCost} PE/PD`) : a.push("custo base"), a;
}
function Do(e, t) {
  return Qt(e, t) ?? Yt;
}
function Qt(e, t) {
  return e.ritualForms?.[t] ?? null;
}
function _o(e) {
  return e.steps.some(Xt);
}
function Xt(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Zt(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Jt = "itemUsePrompts", ea = "data-paranormal-toolkit-prompt-id", X = "data-paranormal-toolkit-pending-id", be = "data-paranormal-toolkit-executed-label", ot = "data-paranormal-toolkit-detail-key", st = "data-paranormal-toolkit-roll-card", Ne = "data-paranormal-toolkit-roll-detail-toggle", ta = "data-paranormal-toolkit-roll-detail-id", No = `[${X}]`, Oo = `[${Ne}]`, it = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, ut = `${h}__actions`, ct = `${h}__details`, Fo = `${h}__summary`, Lo = `${h}__title`, aa = `${h}__button--executed`, lt = `${h}__roll-card`;
let dt = !1, we = null;
const v = /* @__PURE__ */ new Map();
function Mo(e) {
  we = e, !dt && (Hooks.on("renderChatMessageHTML", (t, a) => {
    Ho(t, a, e);
  }), dt = !0);
}
async function mt(e) {
  const t = Uo(e);
  v.set(e.pendingId, t), await ls(t), Vo(e.pendingId);
}
async function ft(e) {
  const t = v.get(e);
  v.delete(e), t && await ds(t);
}
function Uo(e) {
  const t = Le(e.context.message);
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    summary: Zo(e.context),
    executed: !1
  };
}
function Ho(e, t, a) {
  cs();
  const r = Fe(t);
  if (!r) return;
  const n = ss(e, r);
  for (const o of n)
    $e(r, o);
  ra(r, a), ke(r);
}
function Vo(e) {
  const t = v.get(e);
  if (!t) return;
  const a = t.messageId ? is(t.messageId) : null;
  if (a) {
    $e(a, t), pt(a), ke(a);
    return;
  }
  if (t.messageId) return;
  const r = us(t);
  r && ($e(r, t), pt(r), ke(r));
}
function pt(e) {
  we && ra(e, we);
}
function $e(e, t) {
  if (e.querySelector(`[${ea}="${ae(t.pendingId)}"]`)) return;
  const a = Bo(e, t);
  qo(a, t), Ko(a).append(Xo(t));
}
function Bo(e, t) {
  const a = e.querySelector(`.${it}`);
  if (a)
    return a;
  const r = document.createElement("section");
  r.classList.add(it, h);
  const n = document.createElement("header");
  n.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Lo), s.textContent = jo(t);
  const u = document.createElement("span");
  return u.classList.add(Fo), u.textContent = t.summary, n.append(o, s, u), r.append(n), es(e).append(r), r;
}
function jo(e) {
  const t = N(e.summaryLines ?? [], "Forma"), a = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${a} • ${t}` : a;
}
function qo(e, t) {
  const a = t.summaryLines ?? [], r = rs(a, t);
  if (r) {
    xo(e, r, t.pendingId);
    return;
  }
  Yo(e, a);
}
function xo(e, t, a) {
  if (e.querySelector(`[${st}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(lt, `${lt}--${t.intent}`), r.setAttribute(st, "true");
  const n = document.createElement("div");
  n.classList.add(`${h}__roll-summary`);
  const o = document.createElement("span");
  o.classList.add(`${h}__roll-chip`, `${h}__roll-chip--${t.intent}`), o.textContent = t.label.toUpperCase();
  const s = document.createElement("strong");
  s.classList.add(`${h}__roll-total`), s.textContent = String(t.total);
  const u = document.createElement("span");
  u.classList.add(`${h}__roll-formula`), u.textContent = t.formula, n.append(o, s, u), r.append(n), zo(r, t), Go(r, t, a), e.append(r);
}
function zo(e, t) {
  const a = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(gs);
  if (a.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const n of a) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = n, r.append(o);
  }
  e.append(r);
}
function Go(e, t, a) {
  const r = Wo(t);
  if (r.length === 0) return;
  const n = `${a}-roll-details`, o = document.createElement("button");
  o.type = "button", o.classList.add(`${h}__roll-detail-toggle`), o.setAttribute(Ne, n), o.setAttribute("aria-expanded", "false"), o.textContent = "▸ Ver detalhes";
  const s = document.createElement("dl");
  s.classList.add(`${h}__roll-detail-list`), s.setAttribute(ta, n), s.hidden = !0;
  for (const u of r) {
    const d = document.createElement("dt");
    d.textContent = u.label;
    const p = document.createElement("dd");
    p.textContent = u.value, s.append(d, p);
  }
  e.append(o, s);
}
function Wo(e) {
  const t = [
    { label: "Fórmula", value: e.formula }
  ];
  e.diceBreakdown && t.push({ label: "Dados", value: e.diceBreakdown }), e.damageType && t.push({ label: "Tipo", value: e.damageType }), e.form && t.push({ label: "Forma", value: e.form }), e.cost && t.push({ label: "Custo", value: e.cost });
  for (const a of e.notes)
    t.push({ label: "Observação", value: a });
  for (const a of e.details)
    t.push({ label: "Detalhe", value: a });
  return t;
}
function Ko(e) {
  const t = e.querySelector(`.${ut}`);
  if (t)
    return t;
  const a = document.createElement("div");
  return a.classList.add(ut), e.append(a), a;
}
function Yo(e, t) {
  if (t.length === 0) return;
  const a = Qo(e);
  for (const r of t) {
    const n = hs(r);
    if (a.querySelector(`[${ot}="${ae(n)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(ot, n), a.append(o);
  }
}
function Qo(e) {
  const t = e.querySelector(`.${ct}`);
  if (t)
    return t;
  const a = document.createElement("ul");
  return a.classList.add(ct), e.append(a), a;
}
function Xo(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(ea, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(aa), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(X, e.pendingId), t.setAttribute(be, e.executedLabel ?? "✓ Automação aplicada"), t);
}
function Zo(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", a = Jo(e);
  return `${t} → ${a}`;
}
function Jo(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function es(e) {
  return e.querySelector(".message-content") ?? e;
}
function ra(e, t) {
  const a = Fe(e);
  if (!a) return;
  const r = a.querySelectorAll(No);
  for (const n of r)
    n.dataset.paranormalToolkitBound !== "true" && (n.dataset.paranormalToolkitBound = "true", n.addEventListener("click", () => {
      as(n, t);
    }));
}
function ke(e) {
  const t = Fe(e);
  if (!t) return;
  const a = t.querySelectorAll(Oo);
  for (const r of a)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      ts(t, r);
    }));
}
function ts(e, t) {
  const a = t.getAttribute(Ne);
  if (!a) return;
  const r = e.querySelector(`[${ta}="${ae(a)}"]`);
  if (!r) return;
  const n = r.hidden;
  r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.textContent = n ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function as(e, t) {
  const a = e.getAttribute(X);
  if (!a) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(a)) {
    e.textContent = e.getAttribute(be) ?? "✓ Automação aplicada", e.classList.add(aa), e.removeAttribute(X), e.removeAttribute(be);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function rs(e, t) {
  const a = e.map(na).find(fs);
  if (!a) return null;
  const r = N(e, "Forma"), n = N(e, "Custo"), o = N(e, "Dados") ?? N(e, `Dados (${a.label})`), s = N(e, "Tipo"), u = oa(e, "Observação"), d = e.filter((p) => os(p, a));
  return {
    ...a,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: r,
    cost: n,
    diceBreakdown: o,
    damageType: s,
    notes: u,
    details: d
  };
}
function na(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, a, r, n] = t, o = Number(n);
  return Number.isFinite(o) ? {
    label: a,
    formula: r,
    total: o,
    intent: ns(a)
  } : null;
}
function ns(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : "generic";
}
function N(e, t) {
  return oa(e, t)[0] ?? null;
}
function oa(e, t) {
  const a = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(a)) return [];
    const n = r.slice(a.length).trim();
    return n.length > 0 ? [n] : [];
  });
}
function os(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Observação:") || na(e) ? !1 : e.trim().length > 0;
}
function ss(e, t) {
  const a = /* @__PURE__ */ new Map();
  for (const r of v.values())
    Pe(r, e, t) && a.set(r.pendingId, r);
  for (const r of ms(e))
    Pe(r, e, t) && !a.has(r.pendingId) && a.set(r.pendingId, r);
  return Array.from(a.values()).sort((r, n) => r.createdAt - n.createdAt);
}
function Pe(e, t, a) {
  const r = Le(t) ?? a.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !gt(a, "itemId", e.itemId) ? !1 : !e.actorId || gt(a, "actorId", e.actorId);
}
function gt(e, t, a) {
  if (e.dataset[t] === a)
    return !0;
  const r = `data-${ys(t)}`;
  for (const n of e.querySelectorAll(`[${r}]`))
    if (n.getAttribute(r) === a)
      return !0;
  return !1;
}
function is(e) {
  const t = ae(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function us(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Pe(e, null, t))
      return t;
  return null;
}
function cs() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [a, r] of v.entries())
    e - r.createdAt > t && v.delete(a);
}
async function ls(e) {
  const t = ua(e.context.message);
  if (t)
    try {
      const a = Oe(t);
      a[e.pendingId] = ia(e), await sa(t, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", a);
    }
}
async function ds(e) {
  const t = ua(e.context.message);
  if (t)
    try {
      const a = Oe(t), r = a[e.pendingId] ?? ia(e);
      a[e.pendingId] = {
        ...r,
        executed: !0
      }, await sa(t, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", a);
    }
}
function ms(e) {
  return Object.values(Oe(Te(e))).filter(ca);
}
function Oe(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, Jt);
  if (!la(t))
    return {};
  const a = {};
  for (const [r, n] of Object.entries(t))
    ca(n) && (a[r] = n);
  return a;
}
async function sa(e, t) {
  typeof e.setFlag == "function" && await Promise.resolve(e.setFlag(c, Jt, t));
}
function ia(e) {
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
    summary: e.summary,
    executed: e.executed
  };
}
function ua(e) {
  const t = Te(e);
  if (t?.setFlag)
    return t;
  const a = Le(e);
  if (!a) return null;
  const r = game.messages;
  return Te(r?.get?.(a));
}
function Te(e) {
  return e && typeof e == "object" ? e : null;
}
function ca(e) {
  return la(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && W(e.messageId) && W(e.itemId) && W(e.actorId) && W(e.itemName) && le(e.title) && le(e.buttonLabel) && le(e.executedLabel) && ps(e.summaryLines) : !1;
}
function fs(e) {
  return e !== null;
}
function la(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function W(e) {
  return e === null || typeof e == "string";
}
function le(e) {
  return e === void 0 || typeof e == "string";
}
function ps(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function gs(e) {
  return typeof e == "string" && e.length > 0;
}
function Fe(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Le(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function hs(e) {
  return e.trim().toLowerCase();
}
function ys(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ae(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const ht = 1e3;
class As {
  constructor(t, a, r, n) {
    this.workflow = t, this.debugOutput = n, this.ritualAssistant = new co(t, a, r);
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
      settings: xe(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const a = xe();
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
    if (await Un(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: yt(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await ft(t), await this.executeAutomation(a.context, a.definition, a.mode), !0;
    const r = await this.ritualAssistant.applyAction(a.action);
    return r.ok ? (a.workflowContext.resourceTransactions.push(r.value), this.pendingExecutions.delete(t), await ft(t), this.setAttempt(a.context, "completed"), !0) : (this.handleResourceActionFailure(r), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Mo((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
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
        this.setAttempt(t, "completed", "ritual-assisted-no-actions"), i.info("Ritual assistido concluído sem ações pendentes.", E(r.workflowContext));
        return;
      case "ready":
        await this.registerAssistedResourceActions(t, r.workflowContext, r.actions, r.summaryLines);
        return;
    }
  }
  async registerAssistedResourceActions(t, a, r, n) {
    let o;
    for (const s of r) {
      const u = Rt();
      o ??= u, this.pendingExecutions.set(u, {
        kind: "resource-action",
        id: u,
        action: s,
        context: t,
        workflowContext: a,
        createdAt: Date.now()
      }), await mt({
        pendingId: u,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        summaryLines: n
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", o), i.info("Ritual assistido preparado com ações pendentes.", E(a));
  }
  async createPendingWorkflowPrompt(t, a) {
    const r = Rt();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: a,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await mt({
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
    this.setAttempt(t, "completed"), i.info("Automação executada por uso normal de item.", E(n.value.context));
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
    const a = Date.now(), r = At(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      a - s > ht && this.recentExecutionKeys.delete(o);
    const n = this.recentExecutionKeys.get(r);
    return n !== void 0 && a - n <= ht;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(At(t), Date.now());
  }
  setAttempt(t, a, r, n) {
    this.lastAttempt = yt(t, a, r, n);
  }
}
function yt(e, t, a, r) {
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
function At(e) {
  const t = e.actor?.id ?? "no-actor", a = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${a}`;
}
function Rt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Rs {
  constructor(t, a, r) {
    this.diagnostic = t, this.automationBinder = a, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const a = this.diagnostic.getApplicableEntries(t), r = [], n = [], o = j(t);
    for (const s of a) {
      const u = s.itemId ? o.find((y) => y.id === s.itemId) ?? null : null, d = s.match?.preset ?? null;
      if (!u || !d) {
        n.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(u, d);
      const p = await this.itemPatches.applyPresetItemPatch(u, d);
      r.push({
        itemId: u.id ?? null,
        itemName: u.name ?? "Ritual sem nome",
        presetId: d.id,
        presetLabel: d.label,
        previousStatus: s.status,
        itemPatch: p
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
class bs {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const a = j(t).map((u) => this.analyzeRitual(u)), r = a.filter(K("upToDate")), n = a.filter(K("available")), o = a.filter(K("outdated")), s = a.filter(K("unsupported"));
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
    const a = this.automationRegistry.findForItem(t)[0] ?? null, r = ws(t);
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
      reason: $s(r, a.preset)
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
function ws(e) {
  const t = e.getFlag(c, "automation");
  return Ie(t) ? t : null;
}
function $s(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function K(e) {
  return (t) => t.status === e;
}
class ks {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const a = this.createResourceOperationContent(t.transaction), r = Ee(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, a), n = E(t);
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
    const a = g(t.actorName), r = g(t.resource), n = g(bt(t)), o = g(Ts(t));
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
      (m) => `<li><strong>${g(m.id)}:</strong> ${g(m.formula)} = ${m.total} <em>(${g(Ps(m.intent))})</em>${m.damageType ? ` — ${g(m.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (m) => `<li><strong>${g(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${g(m.resource)} (${g(Cs(m.source))})</li>`
    ), y = t.damageInstances.map(
      (m) => `<li><strong>${g(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${g(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), R = t.healingInstances.map(
      (m) => `<li><strong>${g(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), P = t.resourceTransactions.map(
      (m) => `<li><strong>${g(m.actorName)}:</strong> ${g(bt(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), D = t.phases.map((m) => g(m)).join(" &rarr; ");
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
          ${p.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${p.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Cura:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${P.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${P.join("")}</ul>` : ""}
          ${D.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${D}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Ps(e) {
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
function bt(e) {
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
function Ts(e) {
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
function Cs(e) {
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
function Is() {
  const e = new Dr(), t = new In(e), a = new Or(), r = new Mr(a), n = new Xr(e), o = new Jr(), s = o.registerMany(qa());
  if (!s.ok)
    throw new Error(s.error.message);
  const u = new Zr(), d = new Yr(), p = new bs(o), y = new Rs(p, u, d), R = new _n(), P = new ks(R), D = new Dn(), m = new Tn(t, r, P, D), Me = new vn(m, D), re = new As(Me, t, r, R);
  return re.addStrategy(new Wr((fa) => re.handleItemUsed(fa))), {
    ordem: n,
    resourceAdapter: e,
    ritualAdapter: a,
    ritualCosts: r,
    resources: t,
    automationRegistry: o,
    automationBinder: u,
    itemPatches: d,
    debugOutput: R,
    chatMessages: P,
    workflowHooks: D,
    automation: m,
    workflow: Me,
    itemUseIntegration: re,
    ritualPresetDiagnostic: p,
    ritualPresetApplications: y
  };
}
const { ApplicationV2: Ss } = foundry.applications.api;
class Z extends Ss {
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${w(kt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${w(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${de("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${de("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${de("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function de(e, t, a, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${w(e)}</span>
        <small>${a.length}</small>
      </h3>
      ${a.length > 0 ? Es(a) : Ds(t)}
    </section>
  `;
}
function Es(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(vs).join("")}</ol>`;
}
function vs(e) {
  const t = e.preset, a = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${w(e.appliedPresetId)} v${w(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${w(e.itemName)}</strong>
        <span>${w(e.reason)}</span>
        ${r}
      </div>
      <em>${w(a)}</em>
    </li>
  `;
}
function Ds(e) {
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
const J = `${c}.manageRitualPresets`, wt = `__${c}_ritualPresetHeaderControlRegistered`, _s = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Ns(e) {
  const t = globalThis;
  if (!t[wt]) {
    for (const a of _s)
      Hooks.on(a, (r, n) => {
        Os(r, n, e);
      });
    t[wt] = !0, i.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Os(e, t, a) {
  Array.isArray(t) && Ls(e) && (Fs(e, a), !t.some((r) => r.action === J) && t.push({
    action: J,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), da(e, a);
    }
  }));
}
function Fs(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[J] && (e.options.actions[J] = (a) => {
    a.preventDefault(), a.stopPropagation(), da(e, t);
  }));
}
function Ls(e) {
  if (!game.user?.isGM) return !1;
  const t = ma(e);
  return t ? t.type === "agent" && j(t).length > 0 : !1;
}
function da(e, t) {
  const a = ma(e);
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
function ma(e) {
  return $t(e.actor) ? e.actor : $t(e.document) ? e.document : null;
}
function $t(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let O = null;
Hooks.once("init", () => {
  Va(), ir(), Er(), i.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Ge.isSupportedSystem()) {
    i.warn(
      `Sistema não suportado: ${Ge.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  O = Is(), O.itemUseIntegration.registerStrategies(), gr(O), Cr(), $r(), Ns(O), i.info("Inicializado para o sistema Ordem Paranormal."), i.info(`API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${kt} inicializado.`);
});
function Ms() {
  if (!O)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return O;
}
export {
  Ms as getToolkitServices
};
//# sourceMappingURL=main.js.map
