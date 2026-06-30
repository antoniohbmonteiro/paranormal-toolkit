const l = "paranormal-toolkit", wt = "Paranormal Toolkit", jo = "ordemparanormal";
class he {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function ve(e) {
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
class u {
  static info(t, ...n) {
    console.log(`${l} | ${t}`, ...n);
  }
  static warn(t, ...n) {
    console.warn(`${l} | ${t}`, ...n);
  }
  static error(t, ...n) {
    console.error(`${l} | ${t}`, ...n);
  }
}
function y(e) {
  return { ok: !0, value: e };
}
function m(e) {
  return { ok: !1, error: e };
}
function _t(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? m({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : $t(t) ? y(t.definition) : m({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function qo(e) {
  return $t(e.getFlag(l, "automation"));
}
function $t(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Vo(t.source) && Ho(t.definition);
}
function Ho(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && T(t.label) && Array.isArray(t.steps) && t.steps.every(Go) && (t.conditionApplications === void 0 || Zo(t.conditionApplications));
}
function Vo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? T(t.presetId) && T(t.presetVersion) && T(t.appliedAt) : t.type === "manual" ? T(t.label) && T(t.appliedAt) : !1;
}
function Go(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return zo(t);
    case "spendRitualCost":
      return Wo(t);
    case "rollFormula":
      return Ko(t);
    case "modifyResource":
      return Yo(t);
    case "chatCard":
      return Qo(t);
    default:
      return !1;
  }
}
function zo(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && ur(t);
}
function Wo(e) {
  return e.type === "spendRitualCost";
}
function Ko(e) {
  const t = e;
  return t.type === "rollFormula" && T(t.id) && T(t.formula) && (t.intent === void 0 || na(t.intent)) && (t.damageType === void 0 || T(t.damageType));
}
function Yo(e) {
  const t = e;
  return t.type === "modifyResource" && dr(t.actor) && ea(t.resource) && ta(t.operation) && ur(t);
}
function Qo(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Zo(e) {
  return Array.isArray(e) && e.every(Xo);
}
function Xo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return T(t.id) && dr(t.actor) && T(t.conditionId) && (t.label === void 0 || T(t.label)) && (t.duration === void 0 || t.duration === null || Jo(t.duration)) && (t.source === void 0 || T(t.source)) && (t.actionSectionId === void 0 || T(t.actionSectionId)) && (t.actionSectionTitle === void 0 || T(t.actionSectionTitle)) && (t.executedLabel === void 0 || T(t.executedLabel));
}
function Jo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.rounds === void 0 || t.rounds === null || ra(t.rounds);
}
function ur(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || T(e.amountFrom);
}
function dr(e) {
  return e === "self" || e === "target";
}
function ea(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function ta(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function na(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function ra(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function T(e) {
  return typeof e == "string" && e.length > 0;
}
function Et(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Zt);
    if (ia(t))
      return Array.from(t).filter(Zt);
  }
  return [];
}
function oa(e) {
  return Et(e)[0] ?? null;
}
function aa(e) {
  return Et(e).find(qo) ?? null;
}
function ia(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Zt(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ye(e) {
  return Et(e).filter((t) => t.type === "ritual");
}
function mr(e) {
  return ye(e)[0] ?? null;
}
function sa(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(ve);
      return u.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = le("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Te(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(en);
      return u.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = le("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Te(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await it(e, r, o.value);
      u.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = le("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Te(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        u.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await it(e, n, r.preset);
      u.info(`Melhor preset aplicado em ${n.name}.`, { match: en(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Xt(e);
    },
    async applyBestPresetsToActorRituals() {
      return Xt(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = le("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Te(t);
      n && (await e.automationBinder.clear(n), u.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Xt(e) {
  const t = le("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = ye(t);
  if (n.length === 0)
    return u.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Jt(t);
  const r = Jt(t, n.length);
  for (const o of n) {
    const a = e.automationRegistry.findForItem(o)[0];
    if (!a) {
      r.skipped.push({
        itemId: o.id ?? null,
        itemName: o.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const i = await it(e, o, a.preset);
    r.applied.push(ca(o, a, i));
  }
  return u.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), la(r), r;
}
async function it(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function ca(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: ve(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Jt(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function la(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function en(e) {
  return {
    preset: ve(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function le(e) {
  const t = he.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Te(e) {
  const t = mr(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Y(e) {
  return e ? {
    id: e.id,
    source: {
      ...ua(e.sourceActor),
      token: e.sourceToken
    },
    item: da(e.item),
    targets: e.targets.map(ma),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: tn(e.rollRequests, fr),
    rolls: tn(e.rolls, fa),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(St),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function St(e) {
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
function ua(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function da(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function ma(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function fr(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function fa(e) {
  return {
    ...fr(e),
    total: e.total
  };
}
function tn(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function pa(e) {
  return {
    getSelected() {
      return he.getSelectedActor();
    },
    logResources() {
      const t = q(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      u.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && u.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await X(
        e,
        "Gasto de PE",
        q("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await X(
        e,
        "Gasto de PD",
        q("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await X(
        e,
        "Dano em PV",
        q("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await X(
        e,
        "Cura de PV",
        q("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await X(
        e,
        "Dano em SAN",
        q("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await X(
        e,
        "Recuperação de SAN",
        q("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function X(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    ga(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (i) {
    u.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  u.info(`${t} realizado:`, St(a));
}
function q(e) {
  const t = he.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ga(e) {
  if (e.reason === "update-failed") {
    u.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    u.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  u.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const L = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function ha() {
  ke(L.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), ke(L.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), ke(L.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), ke(L.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function st() {
  return {
    enabled: Ce(L.enabled),
    console: Ce(L.console),
    ui: Ce(L.ui),
    chat: Ce(L.chat)
  };
}
async function U(e, t) {
  await game.settings.set(l, L[e], t);
}
function ke(e, t) {
  game.settings.register(l, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Ce(e) {
  return game.settings.get(l, e) === !0;
}
function ya() {
  return {
    status() {
      return st();
    },
    async enable() {
      await U("enabled", !0);
    },
    async disable() {
      await U("enabled", !1);
    },
    async enableConsole() {
      await U("console", !0);
    },
    async disableConsole() {
      await U("console", !1);
    },
    async enableUi() {
      await U("ui", !0);
    },
    async disableUi() {
      await U("ui", !1);
    },
    async enableChat() {
      await U("chat", !0);
    },
    async disableChat() {
      await U("chat", !1);
    }
  };
}
const pr = "ritual.costOnly", gr = "ritual.simpleHealing", Aa = "ritual.eletrocussao", hr = "ritual.simpleDamage", yr = "generic.simpleHealing", Ar = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function ba() {
  return [
    Ra(),
    Ta(),
    ka(),
    Ca(),
    Ia()
  ];
}
function Ra() {
  return {
    id: pr,
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
function Ta() {
  return {
    id: gr,
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
    automation: br(),
    itemPatch: _a()
  };
}
function ka() {
  return {
    id: Aa,
    version: "1.3.0",
    label: "Eletrocussão",
    description: "Preset inicial de dano de energia. Gasta o custo do ritual, rola 3d6/6d6/8d6 conforme a forma escolhida e prepara ações assistidas para aplicar dano em PV e Vulnerável por 1 rodada no alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["eletrocussao", "eletrocucao"]
      }
    ],
    automation: wa(),
    itemPatch: $a()
  };
}
function Ca() {
  return {
    id: hr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Pt()
  };
}
function Ia() {
  return {
    id: yr,
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
function br(e = "2d8+2") {
  return Rr(
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
function wa() {
  return {
    ...Pt("3d6", {
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
    conditionApplications: [
      {
        id: "eletrocussao-vulnerable",
        actor: "target",
        conditionId: "vulnerable",
        label: "Vulnerável",
        duration: {
          rounds: 1
        },
        source: "ritual.eletrocussao",
        actionSectionId: "apply-effects",
        actionSectionTitle: "Aplicar efeito",
        executedLabel: "✓ Vulnerável aplicado"
      }
    ],
    ritualForms: {
      base: {
        label: "Padrão",
        rollFormulaOverrides: {
          damage: "3d6"
        }
      },
      discente: {
        label: "Discente",
        extraCost: 2,
        rollFormulaOverrides: {
          damage: "6d6"
        }
      },
      verdadeiro: {
        label: "Verdadeiro",
        extraCost: 5,
        rollFormulaOverrides: {
          damage: "8d6"
        },
        notes: ["Se o alvo falhar na Fortitude, aplique Atordoado por 1 rodada manualmente."]
      }
    }
  };
}
function Pt(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Rr(
    {
      version: 1,
      label: n,
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
          title: r,
          message: a
        }
      ]
    },
    "damage",
    e
  );
}
function _a() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Ar,
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
function $a() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Ar,
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
function Rr(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Nt() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: J(t.id),
    actorId: J(t.actor?.id),
    sceneId: J(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Tr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: J(e.id),
    actorId: J(t?.id),
    sceneId: J(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function J(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ea(e) {
  return {
    logFirstRitualCost() {
      const t = H("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = V(t);
      if (!n) return;
      const r = e.ritualCosts.getCost({ actor: t, ritual: n });
      if (!r.ok) {
        u.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      u.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: n.name,
        cost: r.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${n.name} custa ${r.value.amount} ${r.value.resource} (${r.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, n = "PE") {
      const r = H("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = V(r);
      if (o) {
        if (!Na(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(l, "ritual.cost", {
          resource: n,
          amount: t
        }), u.info(`Custo customizado aplicado em ${o.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = H("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = V(t);
      n && (await n.unsetFlag(l, "ritual.cost"), u.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = H("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = V(t);
      if (!n) return;
      const r = e.automationRegistry.require(pr);
      if (!r.ok) {
        u.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), u.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = H("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = V(n);
      if (!r) return;
      if (!nn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(gr);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: br(t)
      }), u.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = H("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = V(n);
      if (!r) return;
      if (!nn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(hr);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Pt(t)
      }), u.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = H("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = V(t);
      n && await Sa(e, t, n);
    }
  };
}
async function Sa(e, t, n) {
  const r = _t(n);
  if (!r.ok) {
    u.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Tr(),
    item: n,
    targets: Nt()
  });
  if (!o.ok) {
    Pa(o.error);
    return;
  }
  u.info("Automação de ritual executada com sucesso.", Y(o.value.context));
}
function Pa(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    u.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    u.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  u.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function H(e) {
  const t = he.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function V(e) {
  const t = mr(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Na(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function nn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const La = ["disabled", "ask", "automatic"], Da = ["buttons", "confirm"], kr = "ask";
function Oa(e) {
  return typeof e == "string" && La.includes(e);
}
function va(e) {
  return typeof e == "string" && Da.includes(e);
}
function Ma(e) {
  return Oa(e) ? e : va(e) ? "ask" : kr;
}
const Fa = ["keep", "replace"], Cr = "keep", xa = !0, D = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Ua() {
  game.settings.register(l, D.executionMode, {
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
    default: kr
  }), game.settings.register(l, D.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Cr
  }), game.settings.register(l, D.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: xa
  }), game.settings.register(l, D.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function rn() {
  const e = Ma(game.settings.get(l, D.executionMode)), t = wr(game.settings.get(l, D.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: Ir()
  };
}
function Ba() {
  return wr(game.settings.get(l, D.systemCardMode));
}
function Ir() {
  return game.settings.get(l, D.ritualCastingCheckEnabled) === !0;
}
async function G(e) {
  await game.settings.set(l, D.executionMode, e);
}
function wr(e) {
  return Fa.includes(e) ? e : Cr;
}
function ja(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await G("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await G("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await G(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await G("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await G("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await G("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await G("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const qa = [
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
function Ha(e) {
  return {
    phases() {
      return qa;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Ve("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = aa(t);
      if (!n) {
        u.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await on(e, t, n);
    },
    async runSelectedItemAutomation() {
      await this.runFirstAutomation();
    },
    async runItemAutomationByUuid(t) {
      if (!t || typeof t != "string") {
        ui.notifications?.warn("Paranormal Toolkit: UUID inválido.");
        return;
      }
      const n = await fromUuid(t);
      if (!za(n)) {
        u.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Ga(n) ?? Ve("Nenhum ator encontrado para executar automação do item.");
      r && await on(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Ve("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = oa(t);
      if (!n) {
        u.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(yr);
        if (!r.ok) {
          u.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(n, r.value), u.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (r) {
        u.error("Falha ao configurar automação de teste no item.", r), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function on(e, t, n) {
  const r = _t(n);
  if (!r.ok) {
    u.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Tr(),
    item: n,
    targets: Nt()
  });
  if (!o.ok) {
    Va(o.error);
    return;
  }
  u.info("Automação executada com sucesso.", Y(o.value.context));
}
function Va(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    u.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    u.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  u.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Ve(e) {
  const t = he.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ga(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function za(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Wa(e) {
  const t = pa(e), n = sa(e), r = Ea(e), o = Ha(e), a = ya(), i = ja(e);
  return {
    actor: t,
    automation: n,
    ritual: r,
    workflow: o,
    output: a,
    itemUseIntegration: i,
    getSelectedActor() {
      return t.getSelected();
    },
    logSelectedActorResources() {
      t.logResources();
    },
    async spendSelectedActorPE(s) {
      await t.spendPE(s);
    }
  };
}
function Ka(e) {
  return {
    list: () => e.listConditions(),
    get: (t) => {
      const n = e.getCondition(t);
      return n.ok ? n.value : null;
    },
    applyToActor: (t, n, r = {}) => e.applyCondition({
      actor: t,
      conditionId: n,
      duration: r.duration,
      originUuid: r.originUuid,
      source: r.source ?? "api.applyToActor",
      refreshExisting: r.refreshExisting
    }),
    removeFromActor: (t, n) => e.removeCondition({
      actor: t,
      conditionId: n
    }),
    applyToSelectedTokens: async (t, n = {}) => {
      const r = an();
      if (r.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const o = await Promise.all(
        r.map(
          (a) => e.applyCondition({
            actor: a,
            conditionId: t,
            duration: n.duration,
            originUuid: n.originUuid,
            source: n.source ?? "api.applyToSelectedTokens",
            refreshExisting: n.refreshExisting
          })
        )
      );
      return Ya(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = an();
      if (n.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para remover a condição."), [];
      const r = await Promise.all(
        n.map(
          (o) => e.removeCondition({
            actor: o,
            conditionId: t
          })
        )
      );
      return Qa(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function an() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function Ya(e) {
  let t = 0;
  for (const n of e) {
    if (n.ok) {
      t += 1, n.value.warning && ui.notifications?.warn(`Paranormal Toolkit: ${n.value.warning}`);
      continue;
    }
    ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
  }
  t > 0 && ui.notifications?.info(`Paranormal Toolkit: condição aplicada em ${t} ator(es).`);
}
function Qa(e) {
  let t = 0;
  for (const n of e) {
    if (n.ok) {
      t += n.value.removed;
      continue;
    }
    ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
  }
  ui.notifications?.info(`Paranormal Toolkit: ${t} efeito(s) removido(s).`);
}
function Za(e) {
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
    conditions: Ka(e.conditions),
    debug: Wa(e)
  }, n = globalThis;
  return n[l] = t, n.ParanormalToolkit = t, t;
}
class sn {
  static isSupportedSystem() {
    return game.system.id === jo;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Xa() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ee(t.id),
    actorId: ee(t.actor?.id),
    sceneId: ee(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function _r() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: ee(e.id),
    actorId: ee(t?.id),
    sceneId: ee(e.scene?.id),
    name: n
  };
}
function Ja(e, t = _r()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function ei(e) {
  if (!ri(e)) return null;
  const t = e.getFlag(l, "workflow");
  return ni(t) ? t : null;
}
function ti() {
  return `flags.${l}.workflow`;
}
function cn(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${l}`), n = foundry.utils.getProperty(e, `_source.flags.${l}`);
  return t !== void 0 || n !== void 0;
}
function ln(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return ct(t) || ct(n);
}
function ni(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function ri(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ee(e) {
  return ct(e) ? e : null;
}
function ct(e) {
  return typeof e == "string" && e.length > 0;
}
function oi() {
  const e = (t, n) => {
    ai(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function ai(e, t) {
  const n = ei(e);
  if (!n || n.targets.length === 0) return;
  const r = si(t);
  if (!r || r.querySelector(`.${l}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(ii(n));
}
function ii(e) {
  const t = document.createElement("section");
  t.classList.add(`${l}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(un("Origem", e.source.name)), t.append(un("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function un(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${l}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function si(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function ci() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!li(r) || !di(e) || cn(e) || cn(t)) return;
    const o = Xa();
    if (o.length === 0 || !ln(e) && !ln(t)) return;
    const a = _r();
    e.updateSource({
      [ti()]: Ja(o, a)
    }), u.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function li(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function di(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let dn = !1, Ge = !1, ze = !1, Ie = null;
const mi = 1e3, fi = 750, pi = 1e3;
function gi(e) {
  dn || (Hooks.on("combatTurnChange", (t) => {
    yi(e, mn(t));
  }), Hooks.on("deleteCombat", (t) => {
    Ai(e, mn(t));
  }), dn = !0, hi(e));
}
function hi(e) {
  Me() && (Ge || (Ge = !0, globalThis.setTimeout(() => {
    Ge = !1, Lt(e, "ready");
  }, mi)));
}
function yi(e, t) {
  Me() && t && (Ie && globalThis.clearTimeout(Ie), Ie = globalThis.setTimeout(() => {
    Ie = null, Lt(e, "combat-turn-change", t);
  }, fi));
}
function Ai(e, t) {
  Me() && t && (ze || (ze = !0, globalThis.setTimeout(() => {
    ze = !1, Lt(e, "combat-deleted", t);
  }, pi)));
}
async function Lt(e, t, n) {
  if (Me())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && u.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const o of r.failures)
        u.warn(o.message);
    } catch (r) {
      u.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function Me() {
  return game.user?.isGM === !0;
}
function mn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const $r = {
  enabled: "dice.animations.enabled"
};
function bi() {
  game.settings.register(l, $r.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Ri() {
  return {
    enabled: game.settings.get(l, $r.enabled) === !0
  };
}
const Ti = "chatCard", fn = "data-paranormal-toolkit-prompt-id", c = `${l}-item-use-prompt`, ki = `.${c}__title`, Er = `.${c}__header`, Ci = `.${c}__roll-card`, Ii = `.${c}__roll-meta`, wi = `.${c}__roll-meta-pill`, _i = `.${c}__resistance`, $i = `.${c}__resistance-header`, Sr = `.${c}__resistance-description`, Ei = `.${c}__resistance-roll-button`, Si = `.${c}__resistance-roll-result`, pn = `${c}__resistance-content`, Pr = `.${c}__workflow-section`, Nr = `.${c}__workflow-roll`, Lr = `${c}__workflow-roll--dice-open`, Dr = `.${c}__workflow-roll-formula`, Or = `${c}__workflow-roll-formula--toggle`, Dt = `.${c}__workflow-dice-tray`, Pi = `.${c}__roll-detail-toggle`, Ni = `.${c}__roll-detail-list`, Li = `.${c}__ritual-element-badge`, Di = `.${c}__ritual-metadata`, Oi = "casting-backlash", vi = "data-paranormal-toolkit-action-section", Mi = "data-paranormal-toolkit-prompt-id", Fi = "data-paranormal-toolkit-pending-id", gn = "data-paranormal-toolkit-casting-backlash-enhanced", hn = `.${c}`, xi = `.${c}__workflow-section--casting`, Ui = `.${c}__workflow-section-header`, Bi = `.${c}__workflow-notes`, ji = `[${vi}="${Oi}"]`, yn = `${c}__workflow-section-title-row`, qi = `${c}__workflow-section-header--casting-backlash`, vr = `${c}__casting-backlash-button`;
function Hi(e) {
  for (const t of Vi(e))
    Gi(t), Qi(t);
}
function Vi(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(hn) && t.add(e);
  for (const n of e.querySelectorAll(hn))
    t.add(n);
  return Array.from(t);
}
function Gi(e) {
  const t = e.querySelector(ji);
  if (!t) return;
  const n = zi(t);
  if (!n) return;
  const r = e.querySelector(`${xi} ${Ui}`);
  r && (r.classList.add(qi), Wi(r), Ki(n), r.append(n), t.remove());
}
function zi(e) {
  return e.querySelector(
    `button[${Fi}], button[${Mi}]`
  );
}
function Wi(e) {
  const t = e.querySelector(`:scope > .${yn}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(yn);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(vr) || n.append(o));
  return n;
}
function Ki(e) {
  if (e.getAttribute(gn) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Yi(t, e.disabled);
  e.classList.add(vr), e.setAttribute(gn, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Yi(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Qi(e) {
  for (const t of e.querySelectorAll(Bi)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Zi(e) {
  for (const t of Array.from(e.querySelectorAll(Pr)))
    for (const n of Array.from(t.querySelectorAll(`${Pi}, ${Ni}`)))
      n.remove();
}
function Xi(e) {
  for (const t of Array.from(e.querySelectorAll(_i)))
    Ji(t);
}
function Ji(e) {
  const t = e.querySelector($i), n = e.querySelector(Sr), r = e.querySelector(Ei), o = e.querySelector(Si);
  if (!r || !t && !n && !o) return;
  const a = es(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && o.parentElement !== a && !r.contains(o) && a.append(o), r.parentElement !== e && e.append(r);
}
function es(e, t) {
  const n = e.querySelector(`.${pn}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(pn), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function An(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Ot() {
  const e = globalThis.game;
  return Fe(e) ? e : null;
}
function S(e, t) {
  const n = ts(e, t);
  return Ee(n);
}
function ts(e, t) {
  return t.split(".").reduce((n, r) => Fe(n) ? n[r] : null, e);
}
function ns(e, t) {
  const n = e.indexOf(":");
  return n < 0 || pe(e.slice(0, n)) !== pe(t) ? null : oe(e.slice(n + 1));
}
function Ee(e) {
  return typeof e == "string" ? oe(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Fe(e) {
  return !!e && typeof e == "object";
}
function rs(e) {
  return typeof e == "string";
}
function xe(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function oe(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function pe(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function lt(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function B(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Mr(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function os(e) {
  for (const t of Array.from(e.querySelectorAll(Ci))) {
    const n = ds(t);
    as(t), n && (is(t, n), ss(t, n));
  }
}
function as(e) {
  for (const t of Array.from(e.querySelectorAll(Ii)))
    t.remove();
}
function is(e, t) {
  const r = e.closest(`.${c}`)?.querySelector(Er) ?? null, o = r?.querySelector(ki) ?? null, a = r ?? e, i = a.querySelector(Li);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const s = i ?? document.createElement("span");
  if (s.className = Es(t.elementTone), s.textContent = $s(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", s);
      return;
    }
    a.prepend(s);
  }
}
function ss(e, t) {
  const n = cs(e);
  ls(e, n);
  const r = us(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${c}__ritual-metadata`);
  for (const i of r) {
    const s = document.createElement("span");
    s.classList.add(`${c}__ritual-metadata-chip`), s.textContent = i, o.append(s);
  }
  if (n) {
    const i = n.querySelector(`.${c}__summary`);
    if (i?.parentElement === n) {
      i.insertAdjacentElement("afterend", o);
      return;
    }
    n.append(o);
    return;
  }
  const a = e.querySelector(Pr);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function cs(e) {
  return e.closest(`.${c}`)?.querySelector(Er) ?? null;
}
function ls(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(Di)))
      o.remove();
}
function us(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${lt(e.target)}` : null,
    e.duration ? `Duração: ${lt(e.duration)}` : null,
    e.resistance ? `Resistência: ${Mr(e.resistance)}` : null
  ].filter(xe);
}
function ds(e) {
  const t = ms(e), n = As(e), o = (t ? ys(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = vt(S(o, "element")), s = v("op.elementChoices", i) ?? bn(W(a, "Elemento")) ?? bn(n.damageType), d = i ?? Ss(s), p = S(o, "circle") ?? W(a, "Círculo"), A = Ts(o) ?? W(a, "Alvo"), R = ws(o, "duration", "op.durationChoices") ?? W(a, "Duração"), C = bs(e) ?? Cs(o) ?? W(a, "Resistência"), k = Rs(a) ?? n.cost, f = {
    elementLabel: s,
    elementTone: d,
    circle: p,
    cost: k,
    target: A,
    duration: R,
    resistance: C
  };
  return _s(f) ? f : null;
}
function ms(e) {
  const t = fs(e);
  if (!t) return null;
  const n = t.getFlag?.(l, Ti), r = gs(n);
  if (r.length === 0) return null;
  const o = ps(e);
  if (o.size > 0) {
    const a = r.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function fs(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Ot()?.messages?.get?.(n) ?? null : null;
}
function ps(e) {
  const t = e.closest(`.${c}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${fn}]`))) {
    const o = r.getAttribute(fn)?.trim();
    o && n.add(o);
  }
  return n;
}
function gs(e) {
  if (!Fe(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(hs).filter((n) => n !== null) : [];
}
function hs(e) {
  return Fe(e) ? {
    pendingId: Ee(e.pendingId),
    actorId: Ee(e.actorId),
    itemId: Ee(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(rs) : []
  } : null;
}
function ys(e) {
  if (!e.itemId) return null;
  const t = Ot(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function As(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(wi))) {
    const o = oe(r.textContent);
    if (!o) continue;
    const a = ns(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function bs(e) {
  const t = oe(e.querySelector(Sr)?.textContent);
  return t ? Mr(t) : null;
}
function W(e, t) {
  const n = pe(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || pe(r.slice(0, o)) !== n))
      return oe(r.slice(o + 1));
  }
  return null;
}
function Rs(e) {
  const t = W(e, "Custo") ?? W(e, "PE");
  return t || (e.map(oe).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Ts(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return ks(e) ?? v("op.targetChoices", t) ?? "Área";
  const n = v("op.targetChoices", t) ?? B(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, n].filter(xe).join(" ");
}
function ks(e) {
  const t = S(e, "area.name"), n = S(e, "area.size"), r = S(e, "area.type"), o = t ? v("op.areaChoices", t) ?? B(t) : null, a = r ? v("op.areaTypeChoices", r) ?? B(r) : null;
  return o ? n ? a ? `${o} ${n}m ${lt(a)}` : `${o} ${n}m` : o : null;
}
function Cs(e) {
  const t = S(e, "skillResis"), n = S(e, "resistance");
  if (!t || !n) return null;
  const r = v("op.skill", t) ?? B(t), o = Is(n);
  return [r, o].filter(xe).join(" ");
}
function Is(e) {
  switch (e) {
    case "reducesByHalf":
      return "reduz à metade";
    case "nullifies":
      return "anula";
    case "discredits":
      return "desacredita";
    case "partial":
      return "parcial";
    default:
      return v("op.resistanceChoices", e) ?? B(e);
  }
}
function ws(e, t, n) {
  const r = S(e, t);
  return r ? v(n, r) ?? B(r) : null;
}
function _s(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function $s(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Es(e) {
  return [
    `${c}__ritual-element-badge`,
    e ? `${c}__ritual-element-badge--${e}` : null
  ].filter(xe).join(" ");
}
function vt(e) {
  const t = pe(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function bn(e) {
  const t = vt(e);
  return t ? v("op.elementChoices", t) ?? B(t) : e ? B(e) : null;
}
function Ss(e) {
  return vt(e);
}
function v(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Ot()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Rn = "data-paranormal-toolkit-dice-toggle-enhanced";
function Ps(e) {
  for (const t of Array.from(e.querySelectorAll(Nr)))
    Fr(t);
}
function Ns(e) {
  const t = Ur(e.target);
  if (!t) return;
  const n = Mt(t);
  n && (e.preventDefault(), xr(n, t));
}
function Ls(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Ur(e.target);
  if (!t) return;
  const n = Mt(t);
  n && (e.preventDefault(), xr(n, t));
}
function Fr(e) {
  const t = e.querySelector(Dt);
  if (!t) return;
  const n = e.querySelector(Dr);
  if (n && n.getAttribute(Rn) !== "true" && (n.setAttribute(Rn, "true"), n.classList.add(Or), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function xr(e, t) {
  const n = e.querySelector(Dt);
  if (!n) return;
  const r = !e.classList.contains(Lr);
  Ds(e, t, n, r);
}
function Ds(e, t, n, r) {
  e.classList.toggle(Lr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Ur(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Dr);
  if (!t) return null;
  const n = Mt(t);
  return n ? (Fr(n), t.classList.contains(Or) ? t : null) : null;
}
function Mt(e) {
  const t = e.closest(Nr);
  return t && t.querySelector(Dt) ? t : null;
}
const Tn = `${l}-workflow-dice-toggle-styles`;
function Os() {
  if (document.getElementById(Tn)) return;
  const e = document.createElement("style");
  e.id = Tn, e.textContent = `
.${c}__workflow-section .${c}__roll-detail-toggle,
.${c}__workflow-section .${c}__roll-detail-list {
  display: none !important;
}

.${c}__workflow-roll:not(.${c}__workflow-roll--dice-open) .${c}__workflow-dice-tray,
.${c}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${c}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${c}__workflow-roll-formula--toggle:hover,
.${c}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${c}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${c}__header .${c}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${c}__ritual-element-badge {
  display: inline-flex;
  align-items: center;
  min-height: 1.08rem;
  border: 1px solid rgba(36, 27, 24, 0.14);
  border-radius: 2px;
  padding: 0.06rem 0.3rem 0.07rem;
  background: rgba(74, 64, 54, 0.86);
  color: rgba(255, 255, 255, 0.96);
  font-size: 0.66rem;
  font-weight: 950;
  letter-spacing: 0.025em;
  line-height: 1;
  text-transform: uppercase;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.${c}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${c}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${c}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${c}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${c}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${c}__header .${c}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${c}__roll-card > .${c}__ritual-metadata {
  display: none !important;
}

.${c}__ritual-metadata-chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  border: 1px solid rgba(66, 47, 34, 0.14);
  border-radius: 999px;
  padding: 0.12rem 0.42rem;
  background: rgba(255, 255, 255, 0.42);
  color: rgba(36, 27, 24, 0.82);
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.${c}__resistance {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 34px;
  grid-template-areas: "content button";
  align-items: center !important;
  column-gap: 0.62rem;
  row-gap: 0;
  padding: 0.56rem 0.58rem !important;
}

.${c}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${c}__resistance-content .${c}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${c}__resistance-content .${c}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${c}__resistance-content .${c}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${c}__resistance > .${c}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: center;
}

.${c}__resistance-content .${c}__resistance-roll-result {
  margin-top: 0;
}
.${c}__workflow-section--casting .${c}__workflow-section-header--casting-backlash {
  grid-template-columns: minmax(0, 1fr) 34px;
}

.${c}__workflow-section-title-row {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.38rem;
}

.${c}__workflow-section-title-row .${c}__workflow-section-status {
  flex: 0 0 auto;
}

.${c}__casting-backlash-button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  justify-self: end;
  width: 34px !important;
  min-width: 34px !important;
  height: 34px !important;
  min-height: 34px !important;
  margin: 0 !important;
  border: 1px solid rgba(125, 39, 43, 0.46) !important;
  border-radius: 7px !important;
  padding: 0 !important;
  background: rgba(158, 82, 87, 0.88) !important;
  color: #fffaf3 !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 1px 2px rgba(0, 0, 0, 0.12) !important;
  font-size: 0 !important;
  line-height: 1 !important;
  overflow: hidden !important;
  text-shadow: none !important;
}

.${c}__casting-backlash-button::before {
  content: "↪";
  font-size: 1rem;
  font-weight: 950;
  line-height: 1;
}

.${c}__casting-backlash-button:hover,
.${c}__casting-backlash-button:focus {
  border-color: rgba(125, 39, 43, 0.66) !important;
  background: rgba(143, 62, 67, 0.94) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 0 0 2px rgba(125, 39, 43, 0.16) !important;
  outline: none !important;
}

.${c}__casting-backlash-button:disabled {
  cursor: default !important;
  opacity: 0.78 !important;
}

.${c}__casting-backlash-button.${c}__button--executed::before {
  content: "✓";
}

`, document.head.append(e);
}
const vs = [0, 100, 500, 1500, 3e3];
let kn = !1, We = null;
function Ms() {
  if (!kn) {
    kn = !0, Os(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ue(An(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ue(An(t));
    }), Hooks.once("ready", () => {
      ue(document), Fs();
    }), document.addEventListener("click", Ns), document.addEventListener("keydown", Ls);
    for (const e of vs)
      globalThis.setTimeout(() => ue(document), e);
  }
}
function Fs() {
  We || !document.body || (We = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ue(n);
  }), We.observe(document.body, { childList: !0, subtree: !0 }));
}
function ue(e) {
  e && (Zi(e), os(e), Xi(e), Ps(e), Hi(e));
}
function xs() {
  Ms();
}
const de = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Br = {
  PV: "system.attributes.hp"
}, ut = {
  PV: [de.PV, Br.PV],
  SAN: [de.SAN],
  PE: [de.PE],
  PD: [de.PD]
}, dt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Us {
  getResource(t, n) {
    const r = Cn(t, n);
    if (!r.ok)
      return m(r.error);
    const o = r.value, a = `${o}.value`, i = `${o}.max`, s = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, i), p = wn(t, n, a, s, "valor atual");
    if (p) return m(p);
    const A = wn(t, n, i, d, "valor máximo");
    return A ? m(A) : y({
      value: s,
      max: d
    });
  }
  async updateResourceValue(t, n, r) {
    const o = Cn(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function Cn(e, t) {
  const n = Bs(e.type, t);
  if (n && In(e, n))
    return y(n);
  const r = ut[t].find(
    (o) => In(e, o)
  );
  return r ? y(r) : m({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: js(e, t),
    path: ut[t].join(" | ")
  });
}
function Bs(e, t) {
  return e === "threat" ? Br[t] ?? null : e === "agent" ? de[t] : null;
}
function In(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function js(e, t) {
  const n = e.type ?? "unknown", r = ut[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function wn(e, t, n, r, o) {
  return r == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${o} de ${t} não encontrado: ${n}.`,
    path: n,
    value: r
  } : typeof r != "number" || !Number.isFinite(r) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${o} de ${t} em ${n}.`,
    path: n,
    value: r
  } : null;
}
class qs {
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
    const n = this.readCircleFromKnownPaths(t);
    if (!n) {
      const i = dt.ritualItem.circleCandidates;
      return m({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: r, value: o } = n, a = Hs(o);
    return a ? y(a) : m({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of dt.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Hs(e) {
  if (_n(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (_n(n))
      return n;
  }
  return null;
}
function _n(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Vs = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Gs {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const n = this.ritualAdapter.getCircle(t.ritual);
    if (!n.ok)
      return m({
        ...n.error,
        actor: t.actor
      });
    const r = n.value, o = zs(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: Vs[r],
      source: "default-by-circle",
      circle: r
    }) : m(o.error);
  }
}
function zs(e, t) {
  const n = e.getFlag(l, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Ws(n) ? {
    ok: !0,
    value: {
      resource: n.resource,
      amount: n.amount,
      source: "custom-flag",
      circle: t
    }
  } : {
    ok: !1,
    error: {
      reason: "invalid-custom-cost",
      message: `Custo customizado do ritual ${e.name ?? "sem nome"} é inválido.`,
      ritual: e,
      value: n
    }
  };
}
function Ws(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Ke = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ks(e) {
  if (!ec(e.item)) return null;
  const t = mt(e.actor) ? e.actor : Ys(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Zs(e.token) ?? Qs(t),
    targets: Nt(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Ys(e) {
  const t = e;
  return mt(t.actor) ? t.actor : mt(e.parent) ? e.parent : null;
}
function Qs(e) {
  const t = Xs(e) ?? Js(e);
  return t ? jr(t) : null;
}
function Zs(e) {
  return ft(e) ? jr(e) : null;
}
function Xs(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return ft(n) ? n : (t.getActiveTokens?.() ?? []).find(ft) ?? null;
}
function Js(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function jr(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Ye(e.id),
    actorId: Ye(t?.id),
    sceneId: Ye(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ec(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function mt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function ft(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Ye(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class tc {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Ke.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, u.info(`${Ke.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Ks(nc(t));
    if (!n) {
      u.warn(`${Ke.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function nc(e) {
  return e && typeof e == "object" ? e : {};
}
class rc {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return Qe("missing-item-patch");
    if (t.type !== "ritual") return Qe("unsupported-item-type");
    const o = oc(r);
    return Object.keys(o).length === 0 ? Qe("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function oc(e) {
  const t = {};
  I(t, "name", e.name), I(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (I(t, "system.circle", n.circle), I(t, "system.element", n.element), I(t, "system.target", n.target), I(t, "system.targetQtd", n.targetQuantity), I(t, "system.execution", n.execution), I(t, "system.range", n.range), I(t, "system.duration", n.duration), I(t, "system.skillResis", n.resistanceSkill), I(t, "system.resistance", n.resistance), I(t, "system.studentForm", n.studentForm), I(t, "system.trueForm", n.trueForm)), t;
}
function I(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function Qe(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class ac {
  constructor(t) {
    this.resourceAdapter = t;
  }
  resourceAdapter;
  getActorSnapshot(t) {
    const n = this.getResources(t);
    return {
      id: t.id ?? null,
      name: t.name ?? "Ator sem nome",
      type: t.type ?? "unknown",
      resources: n.values,
      resourceErrors: n.errors,
      ritualDT: this.getRitualDT(t)
    };
  }
  getRitualDT(t) {
    return this.getNumber(t, dt.ritual.dt, 0);
  }
  getResources(t) {
    const n = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, r = [];
    for (const o of ["PV", "SAN", "PE", "PD"]) {
      const a = this.resourceAdapter.getResource(t, o);
      a.ok ? n[o] = a.value : r.push(a.error);
    }
    return { values: n, errors: r };
  }
  getNumber(t, n, r) {
    const o = foundry.utils.getProperty(t, n);
    return typeof o == "number" && Number.isFinite(o) ? o : r;
  }
}
class ic {
  async applyPreset(t, n, r = {}) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: n.id,
        presetVersion: n.version,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: r.definition ?? n.automation
    };
    return await this.writeAutomationFlag(t, o), o;
  }
  async applyManualDefinition(t, n, r = n.label) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: r,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: n
    };
    return await this.writeAutomationFlag(t, o), o;
  }
  async clear(t) {
    await t.unsetFlag(l, "automation");
  }
  async writeAutomationFlag(t, n) {
    await this.clear(t), await t.setFlag(l, "automation", n);
  }
}
class sc {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = cc(t);
    return n.ok ? this.presets.has(t.id) ? m({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Ze(t)), y(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const o = this.register(r);
      if (!o.ok)
        return o;
      n.push(o.value);
    }
    return y(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? Ze(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? y(n) : m({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(Ze);
  }
  findForItem(t) {
    return this.list().map((n) => lc(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function cc(e) {
  return !Xe(e.id) || !Xe(e.version) || !Xe(e.label) ? m({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? m({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function lc(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = uc(o, t);
    if (!a.matches)
      return null;
    r += a.score, n.push(a.reason);
  }
  return {
    preset: e,
    score: r,
    reasons: n
  };
}
function uc(e, t) {
  switch (e.type) {
    case "itemType": {
      const n = e.itemTypes.includes(t.type);
      return {
        matches: n,
        score: n ? 10 : 0,
        reason: `itemType:${t.type}`
      };
    }
    case "normalizedName": {
      const n = $n(t.name), r = e.names.map($n).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = dc(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function $n(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function dc(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Ze(e) {
  return structuredClone(e);
}
function Xe(e) {
  return typeof e == "string" && e.length > 0;
}
function Se(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? m({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = Ue(e.amountFrom);
    if (!n)
      return m({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const r = t.rolls[n];
    if (!r)
      return m({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${n}.`
      });
    const o = Math.trunc(r.total);
    return !Number.isInteger(o) || o <= 0 ? m({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : y(o);
  }
  return m({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Ue(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const mc = "dice-so-nice";
async function qr(e) {
  if (!Ri().enabled || !fc()) return;
  const t = pc();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      u.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function fc() {
  return game.modules.get(mc)?.active === !0;
}
function pc() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function gc(e, t, n) {
  if (!En(e.id) || !En(e.formula))
    return m({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(e.formula), o = await Promise.resolve(r.evaluate()), a = o.total;
    if (typeof a != "number" || !Number.isFinite(a))
      return m({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await qr(o);
    const s = {
      ...n.rollRequests[e.id] ?? Hr(e, t),
      total: a,
      roll: o
    };
    return n.rolls[e.id] = s, y(s);
  } catch (r) {
    return m({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function Hr(e, t) {
  const n = e.intent ?? hc(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function hc(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function En(e) {
  return typeof e == "string" && e.length > 0;
}
async function Pe(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? we(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? we(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? we(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? we(t, n, r, o) : e.recover(t, n, o);
  }
}
function we(e, t, n, r) {
  return m({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    resource: t,
    operation: n,
    reason: "invalid-resource-operation",
    message: `Operação ${n} não é válida para ${t}.`,
    requestedAmount: r
  });
}
function yc(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = Ac(t, n, r, o);
    n.damageInstances.push(i), a.emit("afterDamageResolution", n, {
      stepIndex: o,
      step: t,
      damage: i,
      resourceTransaction: r,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount,
        damageType: i.damageType
      }
    }), a.emit("afterApplyDamage", n, {
      stepIndex: o,
      step: t,
      damage: i,
      resourceTransaction: r,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount,
        damageType: i.damageType
      }
    });
    return;
  }
  if (t.operation === "heal") {
    const i = bc(t, n, r, o);
    n.healingInstances.push(i), a.emit("afterApplyHealing", n, {
      stepIndex: o,
      step: t,
      healing: i,
      resourceTransaction: r,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount
      }
    });
  }
}
function Ac(e, t, n, r) {
  const o = Ue(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: Vr(t.id, "damage", r, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    damageType: a?.damageType,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function bc(e, t, n, r) {
  const o = Ue(e.amountFrom);
  return {
    id: Vr(t.id, "healing", r, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Vr(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Rc(e, t, n) {
  const r = Ue(e.amountFrom), o = r ? t.rolls[r] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    amountFrom: e.amountFrom,
    rollId: r,
    rollIntent: o?.intent,
    damageType: o?.damageType
  };
}
function Tc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Gr("before", e), Sn("before", e), Sn("resolve", e);
}
function kc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Gr("apply", e);
}
function Cc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Gr(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t, s = Ic(e, n.operation);
  s && i.emit(s, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Sn(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t;
  n.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Ic(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function wc(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), y(void 0);
  } catch (r) {
    return m({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function _c(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return $c(e, t);
    case "spendRitualCost":
      return Ec(e, t);
  }
}
async function $c(e, t) {
  const { context: n, resources: r } = e, o = Se(t, n);
  return o.ok ? zr(await r.spend(n.sourceActor, t.resource, o.value), n) : m(o.error);
}
async function Ec(e, t) {
  const { context: n, resources: r, ritualCosts: o } = e, a = o.getCost({
    actor: n.sourceActor,
    ritual: n.item
  });
  if (!a.ok)
    return m({
      reason: "ritual-cost-failed",
      message: a.error.message,
      cause: a.error
    });
  const i = a.value;
  return n.ritualCosts.push({
    ...i,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), zr(await r.spend(n.sourceActor, i.resource, i.amount), n, t);
}
function zr(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), m({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Sc(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, i = Pc(t);
  for (const d of i.before)
    o.emit(d, n, { stepIndex: r, step: t });
  const s = await a();
  if (!s.ok)
    return s;
  for (const d of i.after)
    o.emit(d, n, { stepIndex: r, step: t });
  return s;
}
function Pc(e) {
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
class Nc {
  constructor(t, n, r, o) {
    this.resources = t, this.ritualCosts = n, this.messages = r, this.lifecycle = o;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, n) {
    if (t.steps.length === 0)
      return m({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: n
      });
    for (const [r, o] of t.steps.entries()) {
      const a = await this.runStep(o, n, r);
      if (!a.ok)
        return a;
    }
    return y({ definition: t, context: n });
  }
  async runStep(t, n, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, r);
      default:
        return Sc({
          step: t,
          context: n,
          stepIndex: r,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(t, n, r)
        });
    }
  }
  async executeStep(t, n, r) {
    switch (t.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(t, n, r);
      case "rollFormula":
        return this.runRollFormulaStep(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStep(t, n, r);
      case "chatCard":
        return this.runChatCardStep(t, n, r);
      default:
        return m({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: r,
          step: t,
          context: n
        });
    }
  }
  async runCostStep(t, n, r) {
    const o = await _c({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? y(void 0) : m({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = Hr(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const i = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, i), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: i }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await gc(t, r, n);
    return o.ok ? y(void 0) : m({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = Se(t, n);
    if (!o.ok)
      return m({ ...o.error, stepIndex: r, step: t, context: n });
    const a = Rc(t, n, o.value);
    Tc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), kc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    });
    const i = this.resolveActors(t.actor, n);
    if (i.length === 0)
      return m({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const s of i) {
      const d = await Pe(this.resources, s, t.resource, t.operation, o.value), p = this.handleResourceOperationResult(d, n, r, t);
      if (!p.ok)
        return p;
      yc({
        step: t,
        context: n,
        transaction: p.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Cc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = Se(t, n);
    if (!o.ok)
      return m({ ...o.error, stepIndex: r, step: t, context: n });
    const a = this.resolveActors(t.actor, n);
    if (a.length === 0)
      return m({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const i of a) {
      const s = await Pe(this.resources, i, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(s, n, r, t);
      if (!d.ok)
        return d;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await wc(this.messages, t, n);
    return o.ok ? y(void 0) : m({ ...o.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, o) {
    return t.ok ? (n.resourceTransactions.push(t.value), y(t.value)) : m({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: o,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, o, a, i) {
    const s = Lc(t, n.intent);
    s && this.lifecycle.emit(s, r, {
      stepIndex: o,
      step: a,
      rollRequest: n,
      rollResult: i
    });
  }
  resolveActors(t, n) {
    switch (t) {
      case "self":
        return [n.sourceActor];
      case "target":
        return n.targets.flatMap((r) => r.actor ? [r.actor] : []);
    }
  }
}
function Lc(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Dc {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async spend(t, n, r) {
    return this.execute(t, n, "spend", r);
  }
  async damage(t, n, r) {
    return this.execute(t, n, "damage", r);
  }
  async heal(t, n, r) {
    return this.execute(t, n, "heal", r);
  }
  async recover(t, n, r) {
    return this.execute(t, n, "recover", r);
  }
  async execute(t, n, r, o) {
    if (!Number.isInteger(o) || o <= 0)
      return m({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: o
      });
    const a = this.adapter.getResource(t, n);
    if (!a.ok)
      return m({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: a.error.reason,
        message: a.error.message,
        requestedAmount: o,
        path: a.error.path,
        value: a.error.value
      });
    const i = a.value, s = this.calculate(r, i, o);
    if (!s.ok)
      return m({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: s.error.reason,
        message: s.error.message,
        requestedAmount: o,
        current: i.value,
        required: o
      });
    const { afterValue: d, appliedAmount: p } = s.value, A = {
      value: d,
      max: i.max
    };
    try {
      d !== i.value && await this.adapter.updateResourceValue(t, n, d);
    } catch (R) {
      return m({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "update-failed",
        message: `Falha ao atualizar ${n} no ator.`,
        requestedAmount: o,
        current: i.value,
        required: o,
        cause: R
      });
    }
    return y({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: o,
      appliedAmount: p,
      before: i,
      after: A
    });
  }
  calculate(t, n, r) {
    switch (t) {
      case "spend":
        return n.value < r ? m({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${n.value}; custo: ${r}.`
        }) : y({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const o = Math.max(0, n.value - r);
        return y({
          afterValue: o,
          appliedAmount: n.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(n.max, n.value + r);
        return y({
          afterValue: o,
          appliedAmount: o - n.value
        });
      }
    }
  }
}
function Wr(e) {
  return {
    id: Oc(),
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
function Oc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class vc {
  constructor(t, n) {
    this.automation = t, this.hooks = n;
  }
  automation;
  hooks;
  lastContext = null;
  getLastContext() {
    return this.lastContext;
  }
  getLastDebugSnapshot() {
    return Y(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = Wr(n);
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
    const o = await this.automation.run(t, r);
    return o.ok ? (this.hooks.emit("completed", r), o) : (this.emitFailed(r, o.error), o);
  }
  emitFailed(t, n) {
    this.hooks.emit("failed", t, {
      stepIndex: n.stepIndex,
      step: n.step,
      metadata: {
        reason: n.reason,
        message: n.message
      }
    });
  }
}
class Mc {
  emit(t, n, r = {}) {
    const o = {
      phase: t,
      context: n,
      stepIndex: r.stepIndex,
      step: r.step,
      rollRequest: r.rollRequest,
      rollResult: r.rollResult,
      damage: r.damage,
      healing: r.healing,
      resourceTransaction: r.resourceTransaction,
      metadata: r.metadata
    };
    return n.phases.push(t), n.lifecycleEvents.push({
      phase: t,
      stepIndex: r.stepIndex,
      stepType: r.step?.type,
      rollId: r.rollRequest?.id ?? r.rollResult?.id,
      rollIntent: r.rollRequest?.intent ?? r.rollResult?.intent,
      damageId: r.damage?.id,
      healingId: r.healing?.id,
      resourceOperation: r.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${l}.workflow.${t}`, o), Hooks.callAll(`${l}.workflow.phase`, o), o;
  }
}
class Fc {
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
    const n = st();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: xc(),
      flags: {
        ...t.flags,
        [l]: {
          ...Uc(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && u.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = st();
    if (!r.enabled)
      return;
    const o = n.notification ?? Pn(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = Pn(n);
    switch (t) {
      case "info":
        u.info(r, n.data ?? "");
        return;
      case "warn":
        u.warn(r, n.data ?? "");
        return;
      case "error":
        u.error(r, n.data ?? "");
        return;
    }
  }
  emitUi(t, n) {
    switch (t) {
      case "info":
        ui.notifications?.info(`Paranormal Toolkit: ${n}`);
        return;
      case "warn":
        ui.notifications?.warn(`Paranormal Toolkit: ${n}`);
        return;
      case "error":
        ui.notifications?.error(`Paranormal Toolkit: ${n}`);
        return;
    }
  }
}
function Pn(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function xc() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Uc(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function Bc(e) {
  const t = jc(e?.rounds);
  if (!t)
    return {
      duration: {},
      requestedRounds: null,
      combatDurationApplied: !1,
      combatId: null,
      startRound: null,
      startTurn: null,
      warning: null
    };
  const n = qc();
  if (!n?.id || !Kr(n.round))
    return {
      duration: {},
      requestedRounds: t,
      combatDurationApplied: !1,
      combatId: null,
      startRound: null,
      startTurn: null,
      warning: `Duração de ${t} rodada(s) ignorada porque não há combate ativo.`
    };
  const r = Hc(n.turn) ? n.turn : 0;
  return {
    duration: {
      rounds: t,
      startRound: n.round,
      startTurn: r,
      combat: n.id
    },
    requestedRounds: t,
    combatDurationApplied: !0,
    combatId: n.id,
    startRound: n.round,
    startTurn: r,
    warning: null
  };
}
function jc(e) {
  return Kr(e) ? Math.trunc(e) : null;
}
function qc() {
  return game.combat ?? null;
}
function Kr(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Hc(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class Vc {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? y(n.value) : m({
      conditionId: t,
      reason: "condition-not-found",
      message: n.error.message
    });
  }
  async applyCondition(t) {
    const n = this.registry.get(t.conditionId);
    if (!n.ok)
      return m({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "condition-not-found",
        message: n.error.message
      });
    const r = t.actor;
    if (!Qc(r))
      return m({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = Bc(t.duration), i = Gc(o, t, a), d = t.refreshExisting ?? !0 ? Zc(r, o.id) : null;
    if (d)
      try {
        return await Promise.resolve(d.update?.(i)), y(Nn(r, o, d.id ?? null, !1, !0, a));
      } catch (p) {
        return m({
          actor: r,
          actorId: r.id ?? null,
          actorName: r.name ?? "Ator sem nome",
          conditionId: o.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
          cause: p
        });
      }
    try {
      const A = (await r.createEmbeddedDocuments("ActiveEffect", [i]))[0]?.id ?? null;
      return y(Nn(r, o, A, !0, !1, a));
    } catch (p) {
      return m({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: o.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
        cause: p
      });
    }
  }
  async removeCondition(t) {
    const n = t.actor;
    if (!n || typeof n != "object")
      return m({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: "Ator inválido para remover condição."
      });
    const r = this.resolveCanonicalConditionId(t.conditionId), o = Qr(n, r);
    let a = 0;
    try {
      for (const i of o)
        await Ln(n, i) === "deleted" && (a += 1);
    } catch (i) {
      return m({
        actor: n,
        actorId: n.id ?? null,
        actorName: n.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "delete-failed",
        message: `Falha ao remover condição ${t.conditionId} de ${n.name ?? "ator sem nome"}.`,
        cause: i
      });
    }
    return y({
      actor: n,
      actorId: n.id ?? null,
      actorName: n.name ?? "Ator sem nome",
      conditionId: r,
      removed: a
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = el(), r = [];
    let o = 0, a = 0;
    for (const i of n) {
      const s = Ft(i);
      o += s.length;
      for (const d of s) {
        if (!Wc(d, t)) continue;
        const p = Yr(d);
        try {
          await Ln(i, d) === "deleted" && (a += 1);
        } catch (A) {
          r.push({
            actorId: i.id ?? null,
            actorName: i.name ?? "Ator sem nome",
            effectId: d.id ?? null,
            conditionId: p.conditionId,
            message: `Falha ao remover condição expirada ${p.conditionId ?? d.name ?? "desconhecida"} de ${i.name ?? "ator sem nome"}.`,
            cause: A
          });
        }
      }
    }
    return {
      reason: t.reason ?? "manual",
      scannedActors: n.length,
      scannedEffects: o,
      removedEffects: a,
      failures: r
    };
  }
}
function Gc(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: al(),
    requestedRounds: n.requestedRounds,
    combatDurationApplied: n.combatDurationApplied,
    combatId: n.combatId,
    startRound: n.startRound,
    startTurn: n.startTurn,
    deleteOnExpire: n.combatDurationApplied,
    expiresWithCombat: n.combatDurationApplied
  };
  return {
    name: e.label,
    icon: e.icon,
    description: e.description,
    origin: t.originUuid ?? void 0,
    disabled: !1,
    transfer: !1,
    changes: e.changes.map((o) => ({ ...o })),
    duration: zc(n.duration),
    flags: {
      [l]: r
    }
  };
}
function zc(e) {
  return {
    seconds: null,
    rounds: null,
    turns: null,
    startTime: null,
    startRound: null,
    startTurn: null,
    combat: null,
    ...e
  };
}
function Nn(e, t, n, r, o, a) {
  return {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    conditionId: t.id,
    conditionLabel: t.label,
    effectId: n,
    created: r,
    refreshed: o,
    requestedRounds: a.requestedRounds,
    combatDurationApplied: a.combatDurationApplied,
    warning: a.warning
  };
}
function Wc(e, t) {
  const n = Yr(e);
  if (!n.conditionId || !Kc(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  if (Yc(e)) return !0;
  const r = ol();
  return !r?.id || n.combatId && n.combatId !== r.id ? !0 : !me(n.startRound) || !me(n.requestedRounds) || !me(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Kc(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && me(e.requestedRounds);
}
function Yc(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Yr(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {};
  return {
    conditionId: pt(e, "conditionId"),
    requestedRounds: Dn(e, "requestedRounds") ?? gt(t.rounds),
    combatDurationApplied: Je(e, "combatDurationApplied"),
    combatId: pt(e, "combatId") ?? xt(t.combat),
    startRound: Dn(e, "startRound") ?? gt(t.startRound),
    deleteOnExpire: Je(e, "deleteOnExpire"),
    expiresWithCombat: Je(e, "expiresWithCombat")
  };
}
function Qc(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Zc(e, t) {
  return Qr(e, t)[0] ?? null;
}
function Qr(e, t) {
  return Ft(e).filter((n) => nl(n) === t);
}
async function Ln(e, t) {
  const n = t.id ?? null, r = n ? Xc(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (Jc(o)) return "missing";
    throw o;
  }
}
function Xc(e, t) {
  return Ft(e).find((n) => n.id === t) ?? null;
}
function Jc(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function el() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      _e(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    _e(e, n);
  });
  for (const n of tl())
    _e(e, n.actor), _e(e, n.document?.actor);
  return Array.from(e.values());
}
function _e(e, t) {
  if (!rl(t)) return;
  const r = xt(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function tl() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ft(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function nl(e) {
  return pt(e, "conditionId");
}
function pt(e, t) {
  return xt(e.getFlag?.(l, t));
}
function Dn(e, t) {
  return gt(e.getFlag?.(l, t));
}
function Je(e, t) {
  return e.getFlag?.(l, t) === !0;
}
function xt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function gt(e) {
  return me(e) ? Math.trunc(e) : null;
}
function rl(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function ol() {
  return game.combat ?? null;
}
function me(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function al() {
  return game.user?.id ?? null;
}
const il = "icons/svg/downgrade.svg", sl = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function h(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? il,
    description: sl,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const cl = h({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), ll = h({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), ul = h({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), dl = h({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), ml = h({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), fl = h({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), pl = h({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), gl = h({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), hl = h({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), yl = h({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Al = h({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), bl = h({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Rl = h({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Tl = h({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), kl = h({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Cl = h({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Il = h({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), wl = h({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), _l = h({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), $l = h({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), El = h({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Sl = h({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Pl = h({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Nl = h({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Ll = h({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Dl = h({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Ol = h({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), vl = h({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Ml = h({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Fl = h({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), xl = h({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Ul = h({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Bl = h({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), jl = h({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), ql = [
  cl,
  ll,
  ul,
  dl,
  ml,
  fl,
  pl,
  gl,
  hl,
  yl,
  Al,
  bl,
  Rl,
  Tl,
  kl,
  Cl,
  Il,
  wl,
  _l,
  $l,
  El,
  Sl,
  Pl,
  Nl,
  Ll,
  Dl,
  Ol,
  vl,
  Ml,
  Fl,
  xl,
  Ul,
  Bl,
  jl
];
class Hl {
  definitions = /* @__PURE__ */ new Map();
  lookup = /* @__PURE__ */ new Map();
  constructor(t) {
    for (const n of t) {
      this.definitions.set(n.id, n), this.registerLookup(n.id, n.id), this.registerLookup(n.label, n.id);
      for (const r of n.aliases ?? [])
        this.registerLookup(r, n.id);
    }
  }
  list() {
    return Array.from(this.definitions.values()).map(On);
  }
  get(t) {
    const n = this.lookup.get(vn(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(On(r)) : m({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = vn(t);
    r && this.lookup.set(r, n);
  }
}
function Vl() {
  return new Hl(ql);
}
function On(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function vn(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const Gl = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Zr = `${l}-inline-roll-neutralized`, zl = `${l}-inline-roll-notice`, Ut = `data-${l}-inline-roll-neutralized`, Mn = `data-${l}-inline-roll-notice`, Wl = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Fn(e) {
  const t = su(e.message), n = await Kl(e.message), r = Yl(t);
  return n.replacementCount + r.replacementCount > 0 && u.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: e.item.id ?? null,
    itemName: e.item.name ?? "Item sem nome",
    messageId: t,
    contentReplacementCount: n.replacementCount,
    renderedReplacementCount: r.replacementCount
  }), {
    messageId: t,
    contentUpdated: n.updated,
    contentReplacementCount: n.replacementCount,
    renderedReplacementCount: r.replacementCount
  };
}
async function Kl(e) {
  const t = ou(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = Ql(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await au(t, n.content), replacementCount: n.replacementCount };
}
function Yl(e) {
  const t = e ? iu(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Xr(t);
  return n > 0 && Jr(tu(t)), { replacementCount: n };
}
function Ql(e) {
  const t = Zl(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Xr(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (Jr(n.content), { content: n.innerHTML, replacementCount: o });
}
function Zl(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, Jl(o.trim()))), replacementCount: t };
}
function Xr(e) {
  const t = Xl(e);
  for (const n of t)
    n.replaceWith(eu(nu(n)));
  return t.length;
}
function Xl(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(Gl))
    n.getAttribute(Ut) !== "true" && t.add(n);
  return Array.from(t);
}
function Jl(e) {
  return `<span class="${Zr}" ${Ut}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${cu(e)}</span>`;
}
function eu(e) {
  const t = document.createElement("span");
  return t.classList.add(Zr), t.setAttribute(Ut, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Jr(e) {
  if (e.querySelector?.(`[${Mn}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(zl), t.setAttribute(Mn, "true"), t.textContent = Wl, e.append(t);
}
function tu(e) {
  return e.querySelector(".message-content") ?? e;
}
function nu(e) {
  const n = e.getAttribute("data-formula") ?? ru(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function ru(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function ou(e) {
  return e && typeof e == "object" ? e : null;
}
async function au(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return u.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function iu(e) {
  const t = lu(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function su(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function cu(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function lu(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const xn = "occultism";
function uu(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function du(e) {
  const t = uu(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await mu(e, xn);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await qr(n);
  const r = gu(n);
  return {
    skill: xn,
    skillLabel: "Ocultismo",
    roll: n,
    formula: pu(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: hu(n)
  };
}
async function mu(e, t) {
  const n = e;
  if (typeof n.rollSkill != "function")
    return null;
  const r = await Promise.resolve(
    n.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return fu(r);
}
function fu(e) {
  return Un(e) ? e : Array.isArray(e) ? e.find(Un) ?? null : null;
}
function Un(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function pu(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function gu(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function hu(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(yu);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function yu(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function Au(e) {
  return {
    header: {
      eyebrow: wt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Cu(e.ritual)
    },
    forms: e.variantOptions.map((t) => bu(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: ku(e.automationStatus ?? "assisted")
  };
}
function bu(e, t) {
  const n = Ru(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Tu(t) : "—",
    details: n
  };
}
function Ru(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Tu(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function ku(e) {
  return e === "generic" ? {
    status: e,
    title: "Sem automação configurada.",
    description: "O Toolkit vai registrar a conjuração e gastar o recurso escolhido. Rolagens, dano, resistência e efeitos continuam manuais."
  } : {
    status: e,
    title: "Automação assistida disponível.",
    description: "O Toolkit vai preparar custo, rolagens e ações assistidas no card persistente do chat."
  };
}
function Cu(e) {
  const t = e.system, n = [wu(t?.element), Iu(t?.circle)].filter(_u);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function Iu(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function wu(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function _u(e) {
  return typeof e == "string" && e.length > 0;
}
const eo = ["base", "discente", "verdadeiro"];
function to(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Ne(e) {
  return typeof e == "string" && eo.includes(e);
}
const { ApplicationV2: $u } = foundry.applications.api;
class fe extends $u {
  constructor(t, n) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = n, this.model = Au(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
  }
  input;
  resolveRequest;
  model;
  selectedVariant = "base";
  spendResource = !0;
  isResolved = !1;
  static DEFAULT_OPTIONS = {
    id: `${l}-ritual-cast`,
    classes: [l, "paranormal-toolkit-ritual-cast-app"],
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
      cast: fe.onCast,
      cancel: fe.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new fe(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    Su(o, (a) => {
      this.selectedVariant = a;
    }), Pu(o, (a) => {
      this.spendResource = a;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${w(this.model.header.eyebrow)}</p>
        <div>
          <h2>${w(this.model.header.title)}</h2>
          <p>${w(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(Eu).join("")}
        </div>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--cost">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Custo</h3>
          <label class="paranormal-toolkit-ritual-cast__spend-toggle">
            <input type="checkbox" name="spendResource" ${this.model.cost.spendResourceChecked ? "checked" : ""}>
            <span>Gastar ao conjurar</span>
          </label>
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo base</dt><dd>${w(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${w(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${w(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${w(this.model.automation.title)}</strong></p>
        <p>${w(this.model.automation.description)}</p>
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
    const n = Du(t), r = Nu(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function Eu(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((a) => `<span>${w(a)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${w(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${w(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${w(e.label)}</strong>
        <em>${w(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function Su(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Bn(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Bn(e, o, t));
    });
  const r = no(e);
  r && t(r);
}
function Bn(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Ne(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), no(e));
}
function no(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && Ne(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Pu(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function Nu(e, t, n) {
  const r = Lu(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function Lu(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Ne(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Ne(n) ? n : null;
}
function Du(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function w(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function Ou(e) {
  return fe.request(e);
}
const Bt = {
  label: "Padrão"
}, vu = {
  label: "Discente",
  extraCost: 2
}, Mu = {
  label: "Verdadeiro",
  extraCost: 5
};
class Fu {
  constructor(t, n, r) {
    this.workflow = t, this.resources = n, this.ritualCosts = r;
  }
  workflow;
  resources;
  ritualCosts;
  canHandle(t, n) {
    return t.item.type === "ritual" || n.steps.some((r) => r.type === "spendRitualCost");
  }
  async run(t, n) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const r = this.resolveCostPreview(t), o = hd(n), a = fd(n, t.item, r, o), i = await Ou({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map(($) => $.name),
      cost: r,
      defaultSpendResource: kd(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const s = xu(i), d = Ad(n, t.item, s.variant, o), p = Ir();
    let A = null;
    if (p) {
      const $ = await Bu(this.resources, t.actor, s, d, r);
      if (!$.ok)
        return {
          status: "failed",
          reason: $.reason,
          message: $.message
        };
      try {
        A = await du(t.actor);
      } catch (Z) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: Z instanceof Error ? Z.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: Z
        };
      }
    }
    const R = Uu(n, s, d, r, {
      includeCostSteps: !p
    });
    if (R.steps.length === 0) {
      const $ = yd(t, s), Z = jn(t.actor, A, d, r), Qt = Hn(n, s, d, r, $, A);
      return Z.length > 0 ? {
        status: "ready",
        workflowContext: $,
        actions: Z,
        summaryLines: Qt
      } : {
        status: "completed-without-actions",
        workflowContext: $,
        summaryLines: Qt
      };
    }
    const C = await this.workflow.runAutomation(R, {
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
          variant: s.variant,
          spendResource: s.spendResource
        }
      }
    });
    if (!C.ok)
      return {
        status: "failed",
        reason: C.error.reason,
        message: C.error.message,
        cause: C.error
      };
    const k = C.value.context, f = zu(n, t, k), x = qu(n, t), Re = jn(t.actor, A, d, r), se = Hn(n, s, d, r, k, A);
    if (!f.ok)
      return {
        status: "failed",
        reason: f.reason,
        message: f.message
      };
    if (!x.ok)
      return {
        status: "failed",
        reason: x.reason,
        message: x.message
      };
    const Q = [...Re, ...f.actions, ...x.actions];
    return Q.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: k,
      summaryLines: se
    } : {
      status: "ready",
      workflowContext: k,
      actions: Q,
      summaryLines: se
    };
  }
  async applyAction(t) {
    return Pe(this.resources, t.actor, t.resource, t.operation, t.amount);
  }
  resolveCostPreview(t) {
    if (!t.actor) return null;
    const n = this.ritualCosts.getCost({
      actor: t.actor,
      ritual: t.item
    });
    return n.ok ? n.value : null;
  }
}
function xu(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function Uu(e, t, n, r, o) {
  const a = [], i = t.spendResource === !0;
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || jt(s) && (!o.includeCostSteps || !i) || a.push(ju(s, n));
  return o.includeCostSteps && i && r && Cd(n.extraCost) && a.push({
    type: "spendResource",
    actor: "self",
    resource: r.resource,
    amount: n.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: a
  };
}
async function Bu(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Ae(o, r);
  if (!a)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (a.amount <= 0) return { ok: !0 };
  const i = await e.spend(t, a.resource, a.amount);
  return i.ok ? { ok: !0 } : {
    ok: !1,
    reason: i.error.reason,
    message: i.error.message
  };
}
function ju(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function jn(e, t, n, r) {
  if (!t || t.success) return [];
  const o = Ae(r, n);
  if (!o || o.amount <= 0) return [];
  const a = e.name ?? "Ator sem nome";
  return [
    {
      kind: "resource-operation",
      actor: e,
      actorName: a,
      resource: "SAN",
      operation: "damage",
      amount: o.amount,
      label: `Aplicar ${o.amount} SAN`,
      executedLabel: "✓ Dano na SAN aplicado",
      actionSectionId: "casting-backlash",
      actionSectionTitle: "Dano na sanidade"
    }
  ];
}
function qu(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = oo(r.actor, t);
    if (o.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    for (const a of o)
      n.push(Hu(r, a, t.item));
  }
  return { ok: !0, actions: n };
}
function Hu(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = e.label ?? Gu(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: r,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: e.duration ?? null,
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Vu(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Vu(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Gu(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function zu(e, t, n) {
  const r = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const a = Se(o, n);
    if (!a.ok)
      return {
        ok: !1,
        reason: a.error.reason,
        message: a.error.message
      };
    const i = oo(o.actor, t);
    if (i.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const s of i)
      r.push(...Wu(e, o, s, a.value));
  }
  return { ok: !0, actions: r };
}
function Wu(e, t, n, r) {
  if (!Zu(e, t))
    return [qn(t, n, r)];
  const o = ed();
  return ro(e).map((a) => {
    const i = Xu(r, a);
    return qn(t, n, i, {
      option: a,
      choiceGroupId: o
    });
  });
}
function qn(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = Qu(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: Ku(e, o, n, r?.option),
    executedLabel: Yu(e, o, r?.option),
    choiceGroupId: r?.choiceGroupId,
    choiceGroupResolvedLabel: r ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function Ku(e, t, n, r) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? r ? `${r.id === "normal" ? "Normal" : r.label}: ${n} PV` : `Dano: ${n} PV` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Yu(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? n ? `✓ ${n.id === "normal" ? "dano normal" : n.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Qu(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Zu(e, t) {
  return t.operation === "damage" && t.resource === "PV" && ro(e).length > 1;
}
function ro(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Xu(e, t) {
  const n = e * t.multiplier, r = Ju(n, t.rounding ?? "floor");
  return Math.max(0, r);
}
function Ju(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function ed() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function oo(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((n) => n.actor ? [n.actor] : []);
  }
}
function Hn(e, t, n, r, o, a = null) {
  return [
    `Forma: ${to(t.variant)}`,
    nd(t, n, r),
    ...td(a),
    ...Object.values(o.rolls).flatMap(rd),
    ...od(e.resistance),
    ...dd(n)
  ];
}
function td(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function nd(e, t, n) {
  const r = Ae(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function rd(e) {
  const n = [`${md(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = ad(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${ud(e.damageType)}`), n;
}
function od(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function ad(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const n = [];
  let r = "+";
  for (const o of t) {
    if (!o || typeof o != "object") continue;
    const a = o;
    if (a.operator === "+" || a.operator === "-") {
      r = a.operator;
      continue;
    }
    const i = id(a);
    i && (ld(n, i.operator ?? r, i.value), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function id(e) {
  const t = sd(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : cd(e);
}
function sd(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function cd(e) {
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
function ld(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function ud(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function dd(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function md(e) {
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
function fd(e, t, n, r) {
  return eo.map((o) => {
    const a = ao(e, t, o, r), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? to(o),
      enabled: i,
      details: a ? pd(a, n, r) : [],
      finalCostText: a ? gd(n, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function pd(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = Ae(t, e);
  return r.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), r;
}
function Ae(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function gd(e, t) {
  const n = Ae(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function hd(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(jt);
}
function yd(e, t) {
  return Wr({
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
function Ad(e, t, n, r) {
  return ao(e, t, n, r) ?? Bt;
}
function ao(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? Rd(t, n) ? bd(n) : null : n === "base" ? Bt : null);
}
function bd(e) {
  switch (e) {
    case "base":
      return Bt;
    case "discente":
      return vu;
    case "verdadeiro":
      return Mu;
  }
}
function Rd(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Td(foundry.utils.getProperty(e, n));
}
function Td(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function kd(e) {
  return e.steps.some(jt);
}
function jt(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Cd(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Id(e, t) {
  const n = await wd(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: $d(n),
    total: Ed(n),
    diceBreakdown: Sd(n)
  };
}
function io(e) {
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
async function wd(e, t) {
  const n = e;
  if (typeof n.rollSkill != "function")
    return null;
  const r = await Promise.resolve(
    n.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return _d(r);
}
function _d(e) {
  return Vn(e) ? e : Array.isArray(e) ? e.find(Vn) ?? null : null;
}
function Vn(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function $d(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Ed(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Sd(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Pd);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Pd(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const so = "itemUsePrompts", co = "chatCard", Be = "data-paranormal-toolkit-prompt-id", je = "data-paranormal-toolkit-pending-id", qt = "data-paranormal-toolkit-executed-label", ht = "data-paranormal-toolkit-choice-group", lo = "data-paranormal-toolkit-skipped-label", Gn = "data-paranormal-toolkit-action-section", zn = "data-paranormal-toolkit-detail-key", Wn = "data-paranormal-toolkit-roll-card", Ht = "data-paranormal-toolkit-roll-detail-toggle", uo = "data-paranormal-toolkit-roll-detail-id", mo = "data-paranormal-toolkit-resistance-roll-button", fo = "data-paranormal-toolkit-resistance-skill", po = "data-paranormal-toolkit-resistance-skill-label", go = "data-paranormal-toolkit-resistance-target-actor-id", ho = "data-paranormal-toolkit-resistance-target-name", yo = "data-paranormal-toolkit-resistance-roll-result", Kn = "data-paranormal-toolkit-system-card-replaced", Nd = `[${je}]`, Ld = `[${Ht}]`, Dd = `[${mo}]`, yt = `${l}-chat-enrichment`, g = `${l}-item-use-prompt`, Od = `${g}__actions`, Yn = `${g}__details`, Ao = `${g}__summary`, vd = `${g}__title`, bo = `${g}__button--executed`, Qn = `${g}__roll-card`;
let Zn = !1, At = null;
const P = /* @__PURE__ */ new Map(), Md = [0, 100, 500, 1500, 3e3], Fd = 3e4, xd = [0, 100, 500, 1500, 3e3];
function Ud(e) {
  if (At = e, Zn) {
    Jn(e);
    return;
  }
  const t = (n, r) => {
    To(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Zn = !0, Jn(e);
}
async function Xn(e) {
  const t = Ro(e);
  P.set(e.pendingId, t), await zt(t) || No(t), ko(e.pendingId);
}
async function Bd(e) {
  const t = Ro({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await zt(t) || No(t), ko(e.pendingId);
}
async function et(e, t) {
  const n = P.get(e);
  P.delete(e), n && await Um(n, t);
}
function Vt(e) {
  const t = Fo();
  for (const n of t) {
    const r = F(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function jd(e, t) {
  const n = Vt(e);
  if (!n) return;
  const r = F(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await ae(n.message, r));
}
async function qd(e, t, n) {
  if (!t) return;
  const r = Vt(e);
  if (!r) return;
  const o = F(r.message);
  let a = !1;
  for (const [i, s] of Object.entries(o))
    i !== e && s.choiceGroupId === t && (o[i] = {
      ...s,
      executedLabel: n ?? s.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await ae(r.message, o);
}
function Ro(e) {
  const t = j(e.context.message), n = e.context.targets.find((i) => kt(i)), r = n ? kt(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    resistanceTargetActorId: e.resistanceTargetActorId ?? o?.id ?? null,
    resistanceTargetName: a,
    resistanceRollResult: null,
    actionPayload: e.actionPayload ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: pm(e.context),
    executed: !1
  };
}
function To(e, t, n) {
  xm();
  const r = He(t);
  if (!r) return;
  const o = vm(e, r);
  o.length > 0 && Le(r);
  for (const a of o)
    bt(r, a);
  wo(r, n), Rt(r), Tt(r);
}
function Jn(e) {
  for (const t of xd)
    globalThis.setTimeout(() => {
      Hd(e);
    }, t);
}
function Hd(e) {
  for (const t of Vd()) {
    const n = qe(t);
    Gd(n) && To(n, t, e);
  }
}
function Vd() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Gd(e) {
  return e ? Wt(e) ? !0 : jm(e).length > 0 : !1;
}
function ko(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? Mm(t.messageId) : null;
  if (n) {
    or(n, t), Le(n), bt(n, t), er(n), Rt(n), Tt(n);
    return;
  }
  if (t.messageId) {
    It(t);
    return;
  }
  const r = Fm(t);
  if (r) {
    or(r, t), Le(r), bt(r, t), er(r), Rt(r), Tt(r);
    return;
  }
  It(t);
}
function er(e) {
  At && wo(e, At);
}
function Le(e) {
  const t = zd();
  e.classList.toggle(`${g}--system-card-replaced`, t);
  const n = Io(e);
  if (!n || (n.classList.toggle(`${g}__host--system-card-replaced`, t), !t) || n.getAttribute(Kn) === "true") return;
  const r = n.querySelector(`.${yt}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Kn, "true");
}
function zd() {
  try {
    return Ba() === "replace";
  } catch {
    return !1;
  }
}
function bt(e, t) {
  if (Le(e), e.querySelector(`[${Be}="${ie(t.pendingId)}"]`)) return;
  const n = Wd(e, t);
  Yd(n, t), lm(n, um(t)).append(fm(t));
}
function Wd(e, t) {
  const n = e.querySelector(`.${yt}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(yt, g);
  const o = document.createElement("header");
  o.classList.add(`${g}__header`);
  const a = document.createElement("span");
  a.classList.add(`${g}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(vd), i.textContent = Kd(t);
  const s = document.createElement("span");
  return s.classList.add(Ao), s.textContent = t.summary, o.append(a, i, s), r.append(o), hm(e).append(r), r;
}
function Kd(e) {
  const t = _(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Yd(e, t) {
  const n = t.summaryLines ?? [], r = So(n, t);
  if (r) {
    Qd(e, r, t);
    return;
  }
  dm(e, n);
}
function Qd(e, t, n) {
  if (e.querySelector(`[${Wn}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Qn, `${Qn}--${t.intent}`), r.setAttribute(Wn, "true"), t.castingCheck && tr(r, Xd(t.castingCheck), n.pendingId, "casting"), Zd(t) && tr(r, Jd(t), n.pendingId, "effect"), om(r, t), am(r, t, n), cm(r, t), e.append(r);
}
function Zd(e) {
  return e.intent !== "casting";
}
function Xd(e) {
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
function Jd(e) {
  const t = e.intent === "healing" ? "Cura" : e.intent === "damage" ? "Dano" : e.label, n = e.damageType ? `${e.damageType}` : null;
  return {
    kind: "effect",
    title: t,
    label: e.label,
    formula: e.formula,
    total: e.total,
    diceBreakdown: e.diceBreakdown,
    description: n,
    detailRows: [
      { label: "Fórmula", value: e.formula },
      ...e.diceBreakdown ? [{ label: "Dados", value: e.diceBreakdown }] : [],
      ...e.damageType ? [{ label: "Tipo", value: e.damageType }] : []
    ]
  };
}
function tr(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${g}__workflow-section`,
    `${g}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${g}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${g}__workflow-section-header`);
  const i = document.createElement("strong");
  if (i.textContent = t.title, a.append(i), t.statusLabel) {
    const s = document.createElement("span");
    s.classList.add(`${g}__workflow-section-status`), s.textContent = t.statusLabel, a.append(s);
  }
  if (o.append(a), t.description) {
    const s = document.createElement("span");
    s.classList.add(`${g}__workflow-section-description`), s.textContent = t.description, o.append(s);
  }
  em(o, t), sm(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function em(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${g}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${g}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = tm(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function tm(e, t) {
  const n = nm(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${g}__workflow-dice-tray`);
  for (const o of rm(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${g}__workflow-die`), o.active || a.classList.add(`${g}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function nm(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function rm(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? nr(e, "highest") : n.includes("kl") ? nr(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function nr(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function om(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(af);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${g}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function am(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${g}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = im(t, n);
  o.append(a), i && o.append(i);
  const s = document.createElement("span");
  s.classList.add(`${g}__resistance-description`), s.textContent = t.resistance, r.append(o, s), t.resistanceRollResult && r.append(Co(t.resistanceRollResult)), e.append(r);
}
function im(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${g}__resistance-roll-button`), n.setAttribute(Be, t.pendingId), n.setAttribute(mo, "true"), n.setAttribute(fo, e.resistanceSkill), n.setAttribute(po, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(go, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(ho, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${g}__resistance-roll-button--rolled`), n.setAttribute(yo, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${g}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Co(e) {
  const t = document.createElement("span");
  return t.classList.add(`${g}__resistance-roll-result`), t.textContent = $o(e), t;
}
function sm(e, t, n, r, o) {
  const a = t.filter((p) => p.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${n}-roll-details-${r}`, s = document.createElement("button");
  s.type = "button", s.classList.add(`${g}__roll-detail-toggle`), s.setAttribute(Ht, i), s.setAttribute("aria-expanded", "false"), s.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${g}__roll-detail-list`), d.setAttribute(uo, i), d.hidden = !0;
  for (const p of a) {
    const A = document.createElement("dt");
    A.textContent = p.label;
    const R = document.createElement("dd");
    R.textContent = p.value, d.append(A, R);
  }
  e.append(s, d);
}
function cm(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function lm(e, t) {
  const n = `[${Gn}="${ie(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Od), o.setAttribute(Gn, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${g}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function um(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = So(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function dm(e, t) {
  if (t.length === 0) return;
  const n = mm(e);
  for (const r of t) {
    const o = sf(r);
    if (n.querySelector(`[${zn}="${ie(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(zn, o), n.append(a);
  }
}
function mm(e) {
  const t = e.querySelector(`.${Yn}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Yn), e.append(n), n;
}
function fm(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${g}__button`), t.setAttribute(Be, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(bo), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(je, e.pendingId), t.setAttribute(qt, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(ht, e.choiceGroupId), t.setAttribute(lo, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function pm(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = gm(e);
  return `${t} → ${n}`;
}
function gm(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function hm(e) {
  return Io(e) ?? e;
}
function Io(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function wo(e, t) {
  const n = He(e);
  if (!n) return;
  const r = n.querySelectorAll(Nd);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Pm(o, t);
    }));
}
function Rt(e) {
  const t = He(e);
  if (!t) return;
  const n = t.querySelectorAll(Ld);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      ym(t, r);
    }));
}
function Tt(e) {
  const t = He(e);
  if (!t) return;
  const n = t.querySelectorAll(Dd);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Am(t, r);
    }));
}
function ym(e, t) {
  const n = t.getAttribute(Ht);
  if (!n) return;
  const r = e.querySelector(`[${uo}="${ie(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Am(e, t) {
  const n = t.getAttribute(Be), r = t.getAttribute(fo), o = t.getAttribute(po) ?? (r ? io(r) : "Resistência");
  if (!n || !r) return;
  const a = Tm(e, n), i = km(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const s = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Id(i, r);
    await $m(d.roll);
    const p = {
      skill: r,
      skillLabel: o,
      formula: d.formula,
      total: d.total,
      targetName: i.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: d.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    bm(t, p), Rm(t, p), Em(n, p), await Sm(e, n, p);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1;
  }
}
function bm(e, t) {
  e.classList.add(`${g}__resistance-roll-button--rolled`), e.setAttribute(yo, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Rm(e, t) {
  const n = e.closest(`.${g}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${g}__resistance-roll-result`), o = r ?? Co(t);
  if (r) {
    r.textContent = $o(t);
    return;
  }
  n.append(o);
}
function Tm(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = qe(e);
  return F(r)[t] ?? null;
}
function km(e, t) {
  const n = e?.resistanceTargetActor;
  if (O(n)) return n;
  const o = e?.context?.targets.map(kt).find(O) ?? null;
  if (o) return o;
  const a = t.getAttribute(go) ?? e?.resistanceTargetActorId ?? null, i = a ? Im(a) : null;
  return i || wm(
    t.getAttribute(ho) ?? e?.resistanceTargetName ?? Cm(t)
  );
}
function Cm(e) {
  const n = e.closest(`.${g}`)?.querySelector(`.${Ao}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function kt(e) {
  const t = e.actor;
  if (O(t)) return t;
  const n = e.token, r = ge(n);
  if (r) return r;
  const o = e.document;
  return ge(o);
}
function ge(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (O(t)) return t;
  const n = e.document?.actor;
  return O(n) ? n : null;
}
function Im(e) {
  const n = game.actors?.get?.(e);
  return O(n) ? n : _o().map((a) => ge(a)).find((a) => a?.id === e) ?? null;
}
function wm(e) {
  const t = te(e);
  if (!t) return null;
  const n = _o().filter((a) => te(_m(a)) === t).map((a) => ge(a)).find(O) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => O(a) && te(a.name) === t);
  return O(o) ? o : null;
}
function _o() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function _m(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : ge(e)?.name ?? null;
}
function te(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function O(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function $o(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function $m(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Em(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function Sm(e, t, n) {
  const r = qe(e);
  if (r)
    try {
      const o = F(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await ae(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function qe(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return M(r?.get?.(n));
}
async function Pm(e, t) {
  const n = e.getAttribute(je);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    Eo(e, e.getAttribute(qt) ?? "✓ Automação aplicada"), Nm(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function Eo(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(bo), e.removeAttribute(je), e.removeAttribute(qt);
}
function Nm(e) {
  const t = e.getAttribute(ht);
  if (!t) return;
  const n = e.closest(`.${g}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${ht}="${ie(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(lo) ?? "✓ Outra opção escolhida";
    Eo(o, a);
  }
}
function So(e, t) {
  const n = e.map(Gt).filter(rf), r = n.find((f) => f.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = _(e, "Forma"), a = _(e, "Custo"), i = _(e, "Dados") ?? _(e, `Dados (${r.label})`), s = _(e, "Tipo"), d = _(e, "Resistência"), p = _(e, "Resistência Perícia"), A = _(e, "Resistência Rótulo") ?? (p ? io(p) : null), R = Po(e, "Observação"), C = e.filter((f) => Om(f, r)), k = Lm(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: i,
    damageType: s,
    resistance: d,
    resistanceSkill: p,
    resistanceSkillLabel: A,
    notes: R,
    details: C,
    castingCheck: k,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function Lm(e) {
  const t = e.map(Gt).find((a) => a?.intent === "casting") ?? null, n = _(e, "Conjuração DT"), r = _(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: _(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: _(e, "Dados (Conjuração)")
  } : null;
}
function Gt(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: Dm(n)
  } : null;
}
function Dm(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function _(e, t) {
  return Po(e, t)[0] ?? null;
}
function Po(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Om(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Gt(e) ? !1 : e.trim().length > 0;
}
function vm(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    Ct(r, e, t) && n.set(r.pendingId, r);
  for (const r of Bm(e))
    Ct(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Ct(e, t, n) {
  const r = j(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !rr(n, "itemId", e.itemId) ? !1 : !e.actorId || rr(n, "actorId", e.actorId);
}
function rr(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${cf(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Mm(e) {
  const t = ie(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Fm(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Ct(e, null, t))
      return t;
  return null;
}
function xm() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function or(e, t) {
  const n = qe(e);
  if (!n) return !1;
  try {
    const r = F(n);
    return r[t.pendingId] = Kt(t, j(n)), await ae(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function zt(e) {
  const t = Oo(e);
  if (!t) return !1;
  try {
    const n = F(t);
    return n[e.pendingId] = Kt(e, j(t)), await ae(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function No(e) {
  for (const t of Md)
    globalThis.setTimeout(() => {
      It(e);
    }, t);
}
async function It(e) {
  const t = Oo(e);
  if (Wt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await zt(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function Um(e, t) {
  const n = Do(e.context.message);
  if (n)
    try {
      const r = F(n), o = r[e.pendingId] ?? Kt(e, j(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await ae(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function Bm(e) {
  return Object.values(F(M(e))).filter(be);
}
function F(e) {
  if (!e) return {};
  const t = {}, n = Wt(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(Lo(e)))
    t[r] ??= o;
  return t;
}
function jm(e) {
  return Object.values(Lo(M(e))).filter(be);
}
function Lo(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, so);
  if (!ne(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    be(o) && (n[r] = o);
  return n;
}
async function ae(e, t) {
  typeof e.setFlag == "function" && (await Hm(e, t), await qm(e, t));
}
async function qm(e, t) {
  await Promise.resolve(e.setFlag?.(l, so, t));
}
function Wt(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, co);
  return tf(t) ? t : null;
}
async function Hm(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(be).sort((a, i) => a.createdAt - i.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((a) => a.createdAt)),
    messageId: r.messageId ?? j(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: Vm(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(l, co, o));
}
function Vm(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Kt(e, t) {
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
function Do(e) {
  const t = M(e);
  if (t?.setFlag)
    return t;
  const n = Gm(e);
  if (n?.setFlag)
    return n;
  const r = j(e);
  if (!r) return null;
  const o = game.messages;
  return M(o?.get?.(r));
}
function Gm(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(M).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Oo(e) {
  const t = Do(e.context.message);
  if (t) return t;
  const n = e.messageId ? zm(e.messageId) : null;
  if (n) return n;
  const r = Fo().slice().reverse();
  return r.find((o) => Wm(o, e)) ?? r.find((o) => Km(o, e)) ?? null;
}
function zm(e) {
  const t = game.messages;
  return M(t?.get?.(e));
}
function Wm(e, t) {
  const n = j(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!vo(e, t)) return !1;
  const o = Mo(e);
  return !t.actorId || !o || o === t.actorId;
}
function Km(e, t) {
  if (!Qm(e, t)) return !1;
  const n = Mo(e);
  return t.actorId && n === t.actorId ? !0 : vo(e, t);
}
function vo(e, t) {
  const n = te(Ym(e));
  if (!n) return !1;
  const r = te(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = te(t.itemId);
  return !!(o && n.includes(o));
}
function Ym(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Mo(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Qm(e, t) {
  const n = Zm(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Fd;
}
function Zm(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function M(e) {
  return e && typeof e == "object" ? e : null;
}
function be(e) {
  return ne(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && E(e.messageId) && E(e.itemId) && E(e.actorId) && E(e.itemName) && z(e.resistanceTargetActorId) && z(e.resistanceTargetName) && nf(e.resistanceRollResult) && Xm(e.actionPayload) && tt(e.title) && tt(e.buttonLabel) && tt(e.executedLabel) && z(e.choiceGroupId) && z(e.skippedLabel) && z(e.actionSectionId) && z(e.actionSectionTitle) && of(e.summaryLines) : !1;
}
function Xm(e) {
  return e == null ? !0 : ne(e) ? e.kind === "resource-operation" && E(e.actorId) && E(e.actorUuid) && typeof e.actorName == "string" && Jm(e.resource) && ef(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Jm(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function ef(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function tf(e) {
  return ne(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && E(e.messageId) && ne(e.source) && E(e.source.actorId) && E(e.source.actorName) && E(e.source.itemId) && E(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(be) : !1;
}
function nf(e) {
  return e == null ? !0 : ne(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function rf(e) {
  return e !== null;
}
function ne(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function E(e) {
  return e === null || typeof e == "string";
}
function tt(e) {
  return e === void 0 || typeof e == "string";
}
function z(e) {
  return e == null || typeof e == "string";
}
function of(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function af(e) {
  return typeof e == "string" && e.length > 0;
}
function Fo() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(M).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(M).filter((r) => r !== null) : [];
}
function He(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function j(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function sf(e) {
  return e.trim().toLowerCase();
}
function cf(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ie(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const ar = 1e3;
class lf {
  constructor(t, n, r, o, a) {
    this.workflow = t, this.resources = n, this.conditions = o, this.debugOutput = a, this.ritualAssistant = new Fu(t, n, r);
  }
  workflow;
  resources;
  conditions;
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
      settings: rn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = rn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = _t(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && uf(t.item) && n.executionMode === "ask") {
        await this.handleGenericRitual(t);
        return;
      }
      const o = r.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, o, r.error.reason), r.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: r.error.message,
        data: r.error
      });
      return;
    }
    if (await Fn(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: rt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(t), n.executionMode) {
      case "ask":
        await this.handleAskMode(t, r.value);
        return;
      case "automatic":
        await this.executeAutomation(t, r.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const n = this.pendingExecutions.get(t);
    return n ? n.kind === "workflow" ? (this.pendingExecutions.delete(t), await et(t), await this.executeAutomation(n.context, n.definition, n.mode), !0) : await this.executeAssistedAction(n.action, n.workflowContext) ? (this.pendingExecutions.delete(t), await et(t), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1 : this.executePersistedPendingAutomation(t);
  }
  async executePersistedPendingAutomation(t) {
    const n = Vt(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const r = n.prompt.actionPayload, o = ff(r);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`), !1;
    const a = await Pe(this.resources, o, r.resource, r.operation, r.amount);
    return a.ok ? (await jd(t), await qd(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Ud((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, n) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await Fn(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: rt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, df(t.item));
  }
  async handleAssistedRitual(t, n) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const r = await this.ritualAssistant.run(t, n);
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
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), u.info("Ritual assistido concluído sem ações pendentes.", Y(r.workflowContext));
        return;
      case "ready":
        await this.registerAssistedActions(t, r.workflowContext, r.actions, r.summaryLines);
        return;
    }
  }
  async executeAssistedAction(t, n) {
    if (t.kind === "resource-operation") {
      const o = await this.ritualAssistant.applyAction(t);
      return o.ok ? (n.resourceTransactions.push(o.value), !0) : (this.handleResourceActionFailure(o), !1);
    }
    const r = await this.conditions.applyCondition({
      actor: t.actor,
      conditionId: t.conditionId,
      duration: t.duration,
      originUuid: t.originUuid,
      source: t.source ?? "item-use.condition-action"
    });
    return r.ok ? (r.value.warning && ui.notifications?.warn(`Paranormal Toolkit: ${r.value.warning}`), !0) : (this.handleConditionActionFailure(r), !1);
  }
  async resolveAlternativeActions(t) {
    if (t.action.kind !== "resource-operation") return;
    const n = t.action.choiceGroupId;
    if (!n) return;
    const r = Array.from(this.pendingExecutions.entries()).filter(([, o]) => o.kind === "assisted-action" && o.action.kind === "resource-operation" && o.action.choiceGroupId === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.action.kind === "resource-operation" && (this.pendingExecutions.delete(o), await et(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = ot();
    await Bd({
      pendingId: r,
      context: t,
      mode: "ask",
      title: "Paranormal Toolkit · Ritual",
      buttonLabel: "Ritual conjurado",
      executedLabel: "✓ Ritual conjurado",
      actionSectionId: "ritual-log",
      actionSectionTitle: "Registro",
      summaryLines: n
    });
  }
  async registerAssistedActions(t, n, r, o) {
    let a;
    for (const i of r) {
      const s = ot();
      a ??= s, this.pendingExecutions.set(s, {
        kind: "assisted-action",
        id: s,
        action: i,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Xn({
        pendingId: s,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: i.label,
        executedLabel: i.executedLabel,
        choiceGroupId: i.kind === "resource-operation" ? i.choiceGroupId ?? null : null,
        skippedLabel: i.kind === "resource-operation" ? i.choiceGroupResolvedLabel ?? null : null,
        actionSectionId: i.actionSectionId,
        actionSectionTitle: i.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: i.actor,
        resistanceTargetActorId: i.actor.id ?? null,
        resistanceTargetName: i.actorName,
        actionPayload: mf(i)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), u.info("Ritual assistido preparado com ações pendentes.", Y(n));
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = ot();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Xn({
      pendingId: r,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", r);
  }
  async executeAutomation(t, n, r) {
    this.setAttempt(t, "running");
    const o = await this.workflow.runAutomation(n, {
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
    if (!o.ok) {
      this.setAttempt(t, "failed", o.error.reason), this.handleAutomationFailure(o.error);
      return;
    }
    this.setAttempt(t, "completed"), u.info("Automação executada por uso normal de item.", Y(o.value.context));
  }
  handleAutomationFailure(t) {
    const n = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      u.warn(n, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      u.error(n, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    u.warn(n, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    u.warn(`Ação assistida falhou: ${t.error.message}`, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  handleConditionActionFailure(t) {
    u.warn(`Ação assistida de condição falhou: ${t.error.message}`, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const n = Date.now(), r = ir(t);
    for (const [a, i] of this.recentExecutionKeys.entries())
      n - i > ar && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= ar;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(ir(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = rt(t, n, r, o);
  }
}
function uf(e) {
  return e.type === "ritual";
}
function df(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function mf(e) {
  return e.kind !== "resource-operation" ? null : {
    kind: "resource-operation",
    actorId: e.actor.id ?? null,
    actorUuid: e.actor.uuid ?? null,
    actorName: e.actorName,
    resource: e.resource,
    operation: e.operation,
    amount: e.amount
  };
}
function ff(e) {
  const t = e.actorUuid ? pf(e.actorUuid) : null;
  if (re(t)) return t;
  const n = e.actorId ? gf(e.actorId) : null;
  return n || hf(e.actorName);
}
function pf(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function gf(e) {
  const n = game.actors?.get?.(e);
  if (re(n)) return n;
  for (const r of xo()) {
    const o = Yt(r);
    if (o?.id === e) return o;
  }
  return null;
}
function hf(e) {
  const t = nt(e);
  if (!t) return null;
  for (const o of xo()) {
    const a = yf(o);
    if (nt(a) === t) {
      const i = Yt(o);
      if (i) return i;
    }
  }
  const r = game.actors?.find?.((o) => re(o) && nt(o.name) === t);
  return re(r) ? r : null;
}
function xo() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function yf(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Yt(e)?.name ?? null;
}
function Yt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (re(t)) return t;
  const n = e.document?.actor;
  return re(n) ? n : null;
}
function nt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function re(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function rt(e, t, n, r) {
  return {
    source: e.source,
    status: t,
    reason: n,
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
function ir(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function ot() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Af {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = ye(t);
    for (const i of n) {
      const s = i.itemId ? a.find((A) => A.id === i.itemId) ?? null : null, d = i.match?.preset ?? null;
      if (!s || !d) {
        o.push(i);
        continue;
      }
      await this.automationBinder.applyPreset(s, d);
      const p = await this.itemPatches.applyPresetItemPatch(s, d);
      r.push({
        itemId: s.id ?? null,
        itemName: s.name ?? "Ritual sem nome",
        presetId: d.id,
        presetLabel: d.label,
        previousStatus: i.status,
        itemPatch: p
      });
    }
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      applied: r,
      skipped: o
    };
  }
}
class bf {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = ye(t).map((s) => this.analyzeRitual(s)), r = n.filter($e("upToDate")), o = n.filter($e("available")), a = n.filter($e("outdated")), i = n.filter($e("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: o,
      outdated: a,
      unsupported: i,
      canApply: o.length > 0 || a.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = Rf(t);
    return n ? r ? r.source.type !== "preset" ? ce({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? ce({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : ce({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: Tf(r, n.preset)
    }) : ce({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : ce({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function ce(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? ve(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function Rf(e) {
  const t = e.getFlag(l, "automation");
  return $t(t) ? t : null;
}
function Tf(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function $e(e) {
  return (t) => t.status === e;
}
class kf {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = St(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: n,
      data: r,
      flags: {
        [l]: {
          resourceTransaction: r
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, n) {
    const r = this.createWorkflowSummaryContent(t, n), o = Y(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: r,
      data: o,
      flags: {
        [l]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const n = b(t.actorName), r = b(t.resource), o = b(sr(t)), a = b(If(t));
    return `
      <section class="${l}-card ${l}-resource-card">
        <header class="${l}-card__header">
          <strong>${o}</strong>
          <span>${n}</span>
        </header>
        <div class="${l}-card__body">
          <p><strong>${a}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, n) {
    const r = b(n.title ?? "Automação"), o = n.message ? `<p>${b(n.message)}</p>` : "", a = b(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), i = b(t.item.name ?? "Item sem nome"), s = t.targets.length > 0 ? t.targets.map((f) => b(f.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (f) => `<li><strong>${b(f.id)}:</strong> ${b(f.formula)} = ${f.total} <em>(${b(Cf(f.intent))})</em>${f.damageType ? ` — ${b(f.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (f) => `<li><strong>${b(f.itemName)}:</strong> ${f.circle}º círculo — ${f.amount} ${b(f.resource)} (${b(wf(f.source))})</li>`
    ), A = t.damageInstances.map(
      (f) => `<li><strong>${b(f.targetActorName)}:</strong> bruto ${f.rawAmount}${f.damageType ? ` ${b(f.damageType)}` : ""} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), R = t.healingInstances.map(
      (f) => `<li><strong>${b(f.targetActorName)}:</strong> bruto ${f.rawAmount} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), C = t.resourceTransactions.map(
      (f) => `<li><strong>${b(f.actorName)}:</strong> ${b(sr(f))} — ${f.before.value}/${f.before.max} &rarr; ${f.after.value}/${f.after.max}</li>`
    ), k = t.phases.map((f) => b(f)).join(" &rarr; ");
    return `
      <section class="${l}-card ${l}-workflow-card">
        <header class="${l}-card__header">
          <strong>${r}</strong>
          <span>${i}</span>
        </header>
        <div class="${l}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${s}</p>
          ${p.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${p.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Dano:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Cura:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${C.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${C.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p class="${l}-workflow-card__phases"><strong>Fases:</strong> ${k}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Cf(e) {
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
function sr(e) {
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
function If(e) {
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
function wf(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function b(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function _f() {
  const e = new Us(), t = new Dc(e), n = new qs(), r = new Gs(n), o = new ac(e), a = new sc(), i = a.registerMany(ba());
  if (!i.ok)
    throw new Error(i.error.message);
  const s = new ic(), d = new rc(), p = Vl(), A = new Vc(p), R = new bf(a), C = new Af(R, s, d), k = new Fc(), f = new kf(k), x = new Mc(), Re = new Nc(t, r, f, x), se = new vc(Re, x), Q = new lf(se, t, r, A, k);
  return Q.addStrategy(new tc(($) => Q.handleItemUsed($))), {
    ordem: o,
    resourceAdapter: e,
    ritualAdapter: n,
    ritualCosts: r,
    resources: t,
    automationRegistry: a,
    automationBinder: s,
    itemPatches: d,
    conditionRegistry: p,
    conditions: A,
    debugOutput: k,
    chatMessages: f,
    workflowHooks: x,
    automation: Re,
    workflow: se,
    itemUseIntegration: Q,
    ritualPresetDiagnostic: R,
    ritualPresetApplications: C
  };
}
const { ApplicationV2: $f } = foundry.applications.api;
class De extends $f {
  constructor(t, n) {
    super({
      id: `${l}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Presets de rituais: ${t.name ?? "Ator"}`
      }
    }), this.actor = t, this.services = n;
  }
  actor;
  services;
  isApplying = !1;
  lastApplicationResult = null;
  static DEFAULT_OPTIONS = {
    id: `${l}-ritual-preset-manager`,
    classes: [l, "paranormal-toolkit-ritual-preset-manager"],
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
      apply: De.onApply,
      cancel: De.onCancel
    }
  };
  async _renderHTML(t, n) {
    const r = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), o = document.createElement("div");
    return o.className = "paranormal-toolkit-preset-manager", o.innerHTML = this.renderContent(r), o;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${N(wt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${N(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${at("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${at("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${at("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
    const t = this.lastApplicationResult.applied.length, n = this.lastApplicationResult.skipped.length, r = n > 0 ? ` ${n} pendente(s) não puderam ser aplicados.` : "";
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
function at(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${N(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Ef(n) : Pf(t)}
    </section>
  `;
}
function Ef(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Sf).join("")}</ol>`;
}
function Sf(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${N(e.appliedPresetId)} v${N(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${N(e.itemName)}</strong>
        <span>${N(e.reason)}</span>
        ${r}
      </div>
      <em>${N(n)}</em>
    </li>
  `;
}
function Pf(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${N({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function N(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const Oe = `${l}.manageRitualPresets`, cr = `__${l}_ritualPresetHeaderControlRegistered`, Nf = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Lf(e) {
  const t = globalThis;
  if (!t[cr]) {
    for (const n of Nf)
      Hooks.on(n, (r, o) => {
        Df(r, o, e);
      });
    t[cr] = !0, u.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Df(e, t, n) {
  Array.isArray(t) && vf(e) && (Of(e, n), !t.some((r) => r.action === Oe) && t.push({
    action: Oe,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Uo(e, n);
    }
  }));
}
function Of(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Oe] && (e.options.actions[Oe] = (n) => {
    n.preventDefault(), n.stopPropagation(), Uo(e, t);
  }));
}
function vf(e) {
  if (!game.user?.isGM) return !1;
  const t = Bo(e);
  return t ? t.type === "agent" && ye(t).length > 0 : !1;
}
function Uo(e, t) {
  const n = Bo(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new De(n, t).render({ force: !0 });
}
function Bo(e) {
  return lr(e.actor) ? e.actor : lr(e.document) ? e.document : null;
}
function lr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let K = null;
Hooks.once("init", () => {
  ha(), Ua(), bi(), xs(), u.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!sn.isSupportedSystem()) {
    u.warn(
      `Sistema não suportado: ${sn.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  K = _f(), K.itemUseIntegration.registerStrategies(), gi(K.conditions), Za(K), ci(), oi(), Lf(K), u.info("Inicializado para o sistema Ordem Paranormal."), u.info(`API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${wt} inicializado.`);
});
function Mf() {
  if (!K)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return K;
}
export {
  Mf as getToolkitServices
};
//# sourceMappingURL=main.js.map
