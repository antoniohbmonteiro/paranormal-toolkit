const l = "paranormal-toolkit", Ct = "Paranormal Toolkit", Uo = "ordemparanormal";
class ge {
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
function h(e) {
  return { ok: !0, value: e };
}
function m(e) {
  return { ok: !1, error: e };
}
function $t(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? m({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : _t(t) ? h(t.definition) : m({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Bo(e) {
  return _t(e.getFlag(l, "automation"));
}
function _t(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && qo(t.source) && jo(t.definition);
}
function jo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(Ho) && (t.conditionApplications === void 0 || Yo(t.conditionApplications));
}
function qo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function Ho(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Vo(t);
    case "spendRitualCost":
      return Go(t);
    case "rollFormula":
      return zo(t);
    case "modifyResource":
      return Wo(t);
    case "chatCard":
      return Ko(t);
    default:
      return !1;
  }
}
function Vo(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && cr(t);
}
function Go(e) {
  return e.type === "spendRitualCost";
}
function zo(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || ea(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function Wo(e) {
  const t = e;
  return t.type === "modifyResource" && lr(t.actor) && Zo(t.resource) && Jo(t.operation) && cr(t);
}
function Ko(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Yo(e) {
  return Array.isArray(e) && e.every(Qo);
}
function Qo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && lr(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || Xo(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel));
}
function Xo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.rounds === void 0 || t.rounds === null || ta(t.rounds);
}
function cr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function lr(e) {
  return e === "self" || e === "target";
}
function Zo(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Jo(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function ea(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function ta(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function It(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Qt);
    if (oa(t))
      return Array.from(t).filter(Qt);
  }
  return [];
}
function na(e) {
  return It(e)[0] ?? null;
}
function ra(e) {
  return It(e).find(Bo) ?? null;
}
function oa(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Qt(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function he(e) {
  return It(e).filter((t) => t.type === "ritual");
}
function ur(e) {
  return he(e)[0] ?? null;
}
function aa(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(ve);
      return u.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = ce("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Re(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Jt);
      return u.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = ce("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Re(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await at(e, r, o.value);
      u.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = ce("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Re(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        u.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await at(e, n, r.preset);
      u.info(`Melhor preset aplicado em ${n.name}.`, { match: Jt(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Xt(e);
    },
    async applyBestPresetsToActorRituals() {
      return Xt(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = ce("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Re(t);
      n && (await e.automationBinder.clear(n), u.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Xt(e) {
  const t = ce("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = he(t);
  if (n.length === 0)
    return u.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Zt(t);
  const r = Zt(t, n.length);
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
    const i = await at(e, o, a.preset);
    r.applied.push(ia(o, a, i));
  }
  return u.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), sa(r), r;
}
async function at(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function ia(e, t, n) {
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
function Zt(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function sa(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Jt(e) {
  return {
    preset: ve(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function ce(e) {
  const t = ge.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Re(e) {
  const t = ur(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function K(e) {
  return e ? {
    id: e.id,
    source: {
      ...ca(e.sourceActor),
      token: e.sourceToken
    },
    item: la(e.item),
    targets: e.targets.map(ua),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: en(e.rollRequests, dr),
    rolls: en(e.rolls, da),
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
function ca(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function la(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function ua(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function dr(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function da(e) {
  return {
    ...dr(e),
    total: e.total
  };
}
function en(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function ma(e) {
  return {
    getSelected() {
      return ge.getSelectedActor();
    },
    logResources() {
      const t = j(
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
        j("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await X(
        e,
        "Gasto de PD",
        j("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await X(
        e,
        "Dano em PV",
        j("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await X(
        e,
        "Cura de PV",
        j("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await X(
        e,
        "Dano em SAN",
        j("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await X(
        e,
        "Recuperação de SAN",
        j("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function X(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    fa(o.error);
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
function j(e) {
  const t = ge.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function fa(e) {
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
function pa() {
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
function it() {
  return {
    enabled: Te(L.enabled),
    console: Te(L.console),
    ui: Te(L.ui),
    chat: Te(L.chat)
  };
}
async function x(e, t) {
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
function Te(e) {
  return game.settings.get(l, e) === !0;
}
function ga() {
  return {
    status() {
      return it();
    },
    async enable() {
      await x("enabled", !0);
    },
    async disable() {
      await x("enabled", !1);
    },
    async enableConsole() {
      await x("console", !0);
    },
    async disableConsole() {
      await x("console", !1);
    },
    async enableUi() {
      await x("ui", !0);
    },
    async disableUi() {
      await x("ui", !1);
    },
    async enableChat() {
      await x("chat", !0);
    },
    async disableChat() {
      await x("chat", !1);
    }
  };
}
const mr = "ritual.costOnly", fr = "ritual.simpleHealing", ha = "ritual.eletrocussao", pr = "ritual.simpleDamage", gr = "generic.simpleHealing", hr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function ya() {
  return [
    Aa(),
    ba(),
    Ra(),
    ka(),
    Ta()
  ];
}
function Aa() {
  return {
    id: mr,
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
function ba() {
  return {
    id: fr,
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
    automation: yr(),
    itemPatch: Ca()
  };
}
function Ra() {
  return {
    id: ha,
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
function ka() {
  return {
    id: pr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Et()
  };
}
function Ta() {
  return {
    id: gr,
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
function yr(e = "2d8+2") {
  return Ar(
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
    ...Et("3d6", {
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
function Et(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Ar(
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
function Ca() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: hr,
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
    descriptionHtml: hr,
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
function Ar(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Pt() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Z(t.id),
    actorId: Z(t.actor?.id),
    sceneId: Z(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function br() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: Z(e.id),
    actorId: Z(t?.id),
    sceneId: Z(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Z(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function _a(e) {
  return {
    logFirstRitualCost() {
      const t = q("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = H(t);
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
      const r = q("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = H(r);
      if (o) {
        if (!Ea(t, n)) {
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
      const t = q("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = H(t);
      n && (await n.unsetFlag(l, "ritual.cost"), u.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = q("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = H(t);
      if (!n) return;
      const r = e.automationRegistry.require(mr);
      if (!r.ok) {
        u.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), u.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = q("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = H(n);
      if (!r) return;
      if (!tn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(fr);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: yr(t)
      }), u.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = q("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = H(n);
      if (!r) return;
      if (!tn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(pr);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Et(t)
      }), u.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = q("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = H(t);
      n && await Ia(e, t, n);
    }
  };
}
async function Ia(e, t, n) {
  const r = $t(n);
  if (!r.ok) {
    u.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: br(),
    item: n,
    targets: Pt()
  });
  if (!o.ok) {
    Sa(o.error);
    return;
  }
  u.info("Automação de ritual executada com sucesso.", K(o.value.context));
}
function Sa(e) {
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
function q(e) {
  const t = ge.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function H(e) {
  const t = ur(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ea(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function tn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Pa = ["disabled", "ask", "automatic"], La = ["buttons", "confirm"], Rr = "ask";
function Na(e) {
  return typeof e == "string" && Pa.includes(e);
}
function Da(e) {
  return typeof e == "string" && La.includes(e);
}
function va(e) {
  return Na(e) ? e : Da(e) ? "ask" : Rr;
}
const Oa = ["keep", "replace"], kr = "keep", Ma = !0, N = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Fa() {
  game.settings.register(l, N.executionMode, {
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
    default: Rr
  }), game.settings.register(l, N.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: kr
  }), game.settings.register(l, N.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Ma
  }), game.settings.register(l, N.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function nn() {
  const e = va(game.settings.get(l, N.executionMode)), t = wr(game.settings.get(l, N.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: Tr()
  };
}
function xa() {
  return wr(game.settings.get(l, N.systemCardMode));
}
function Tr() {
  return game.settings.get(l, N.ritualCastingCheckEnabled) === !0;
}
async function V(e) {
  await game.settings.set(l, N.executionMode, e);
}
function wr(e) {
  return Oa.includes(e) ? e : kr;
}
function Ua(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await V("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await V("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await V(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await V("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await V("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await V("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await V("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Ba = [
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
function ja(e) {
  return {
    phases() {
      return Ba;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = He("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = ra(t);
      if (!n) {
        u.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await rn(e, t, n);
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
      if (!Va(n)) {
        u.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Ha(n) ?? He("Nenhum ator encontrado para executar automação do item.");
      r && await rn(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = He("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = na(t);
      if (!n) {
        u.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(gr);
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
async function rn(e, t, n) {
  const r = $t(n);
  if (!r.ok) {
    u.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: br(),
    item: n,
    targets: Pt()
  });
  if (!o.ok) {
    qa(o.error);
    return;
  }
  u.info("Automação executada com sucesso.", K(o.value.context));
}
function qa(e) {
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
function He(e) {
  const t = ge.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ha(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Va(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ga(e) {
  const t = ma(e), n = aa(e), r = _a(e), o = ja(e), a = ga(), i = Ua(e);
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
function za(e) {
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
      const r = on();
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
      return Wa(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = on();
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
      return Ka(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function on() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function Wa(e) {
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
function Ka(e) {
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
function Ya(e) {
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
    conditions: za(e.conditions),
    debug: Ga(e)
  }, n = globalThis;
  return n[l] = t, n.ParanormalToolkit = t, t;
}
class an {
  static isSupportedSystem() {
    return game.system.id === Uo;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Qa() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: J(t.id),
    actorId: J(t.actor?.id),
    sceneId: J(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Cr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: J(e.id),
    actorId: J(t?.id),
    sceneId: J(e.scene?.id),
    name: n
  };
}
function Xa(e, t = Cr()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Za(e) {
  if (!ti(e)) return null;
  const t = e.getFlag(l, "workflow");
  return ei(t) ? t : null;
}
function Ja() {
  return `flags.${l}.workflow`;
}
function sn(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${l}`), n = foundry.utils.getProperty(e, `_source.flags.${l}`);
  return t !== void 0 || n !== void 0;
}
function cn(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return st(t) || st(n);
}
function ei(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function ti(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function J(e) {
  return st(e) ? e : null;
}
function st(e) {
  return typeof e == "string" && e.length > 0;
}
function ni() {
  const e = (t, n) => {
    ri(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function ri(e, t) {
  const n = Za(e);
  if (!n || n.targets.length === 0) return;
  const r = ai(t);
  if (!r || r.querySelector(`.${l}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(oi(n));
}
function oi(e) {
  const t = document.createElement("section");
  t.classList.add(`${l}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(ln("Origem", e.source.name)), t.append(ln("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function ln(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${l}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function ai(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function ii() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!si(r) || !ci(e) || sn(e) || sn(t)) return;
    const o = Qa();
    if (o.length === 0 || !cn(e) && !cn(t)) return;
    const a = Cr();
    e.updateSource({
      [Ja()]: Xa(o, a)
    }), u.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function si(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function ci(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let un = !1, Ve = !1, Ge = !1, we = null;
const li = 1e3, di = 750, mi = 1e3;
function fi(e) {
  un || (Hooks.on("combatTurnChange", (t) => {
    gi(e, dn(t));
  }), Hooks.on("deleteCombat", (t) => {
    hi(e, dn(t));
  }), un = !0, pi(e));
}
function pi(e) {
  Oe() && (Ve || (Ve = !0, globalThis.setTimeout(() => {
    Ve = !1, Lt(e, "ready");
  }, li)));
}
function gi(e, t) {
  Oe() && t && (we && globalThis.clearTimeout(we), we = globalThis.setTimeout(() => {
    we = null, Lt(e, "combat-turn-change", t);
  }, di));
}
function hi(e, t) {
  Oe() && t && (Ge || (Ge = !0, globalThis.setTimeout(() => {
    Ge = !1, Lt(e, "combat-deleted", t);
  }, mi)));
}
async function Lt(e, t, n) {
  if (Oe())
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
function Oe() {
  return game.user?.isGM === !0;
}
function dn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const $r = {
  enabled: "dice.animations.enabled"
};
function yi() {
  game.settings.register(l, $r.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Ai() {
  return {
    enabled: game.settings.get(l, $r.enabled) === !0
  };
}
const bi = "chatCard", mn = "data-paranormal-toolkit-prompt-id", c = `${l}-item-use-prompt`, Ri = `.${c}__title`, _r = `.${c}__header`, ki = `.${c}__roll-card`, Ti = `.${c}__roll-meta`, wi = `.${c}__roll-meta-pill`, Ci = `.${c}__resistance`, $i = `.${c}__resistance-header`, Ir = `.${c}__resistance-description`, _i = `.${c}__resistance-roll-button`, Ii = `.${c}__resistance-roll-result`, fn = `${c}__resistance-content`, Sr = `.${c}__workflow-section`, Er = `.${c}__workflow-roll`, Pr = `${c}__workflow-roll--dice-open`, Lr = `.${c}__workflow-roll-formula`, Nr = `${c}__workflow-roll-formula--toggle`, Nt = `.${c}__workflow-dice-tray`, Si = `.${c}__roll-detail-toggle`, Ei = `.${c}__roll-detail-list`, Pi = `.${c}__ritual-element-badge`, Li = `.${c}__ritual-metadata`, Ni = "casting-backlash", Di = "data-paranormal-toolkit-action-section", vi = "data-paranormal-toolkit-prompt-id", Oi = "data-paranormal-toolkit-pending-id", pn = "data-paranormal-toolkit-casting-backlash-enhanced", gn = `.${c}`, Mi = `.${c}__workflow-section--casting`, Fi = `.${c}__workflow-section-header`, xi = `.${c}__workflow-notes`, Ui = `[${Di}="${Ni}"]`, hn = `${c}__workflow-section-title-row`, Bi = `${c}__workflow-section-header--casting-backlash`, Dr = `${c}__casting-backlash-button`;
function ji(e) {
  for (const t of qi(e))
    Hi(t), Ki(t);
}
function qi(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(gn) && t.add(e);
  for (const n of e.querySelectorAll(gn))
    t.add(n);
  return Array.from(t);
}
function Hi(e) {
  const t = e.querySelector(Ui);
  if (!t) return;
  const n = Vi(t);
  if (!n) return;
  const r = e.querySelector(`${Mi} ${Fi}`);
  r && (r.classList.add(Bi), Gi(r), zi(n), r.append(n), t.remove());
}
function Vi(e) {
  return e.querySelector(
    `button[${Oi}], button[${vi}]`
  );
}
function Gi(e) {
  const t = e.querySelector(`:scope > .${hn}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(hn);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(Dr) || n.append(o));
  return n;
}
function zi(e) {
  if (e.getAttribute(pn) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Wi(t, e.disabled);
  e.classList.add(Dr), e.setAttribute(pn, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Wi(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Ki(e) {
  for (const t of e.querySelectorAll(xi)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Yi(e) {
  for (const t of Array.from(e.querySelectorAll(Sr)))
    for (const n of Array.from(t.querySelectorAll(`${Si}, ${Ei}`)))
      n.remove();
}
function Qi(e) {
  for (const t of Array.from(e.querySelectorAll(Ci)))
    Xi(t);
}
function Xi(e) {
  const t = e.querySelector($i), n = e.querySelector(Ir), r = e.querySelector(_i), o = e.querySelector(Ii);
  if (!r || !t && !n && !o) return;
  const a = Zi(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && o.parentElement !== a && !r.contains(o) && a.append(o), r.parentElement !== e && e.append(r);
}
function Zi(e, t) {
  const n = e.querySelector(`.${fn}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(fn), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function yn(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Dt() {
  const e = globalThis.game;
  return Me(e) ? e : null;
}
function S(e, t) {
  const n = Ji(e, t);
  return Ie(n);
}
function Ji(e, t) {
  return t.split(".").reduce((n, r) => Me(n) ? n[r] : null, e);
}
function es(e, t) {
  const n = e.indexOf(":");
  return n < 0 || fe(e.slice(0, n)) !== fe(t) ? null : re(e.slice(n + 1));
}
function Ie(e) {
  return typeof e == "string" ? re(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Me(e) {
  return !!e && typeof e == "object";
}
function ts(e) {
  return typeof e == "string";
}
function Fe(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function re(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function fe(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function ct(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function U(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function vr(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function ns(e) {
  for (const t of Array.from(e.querySelectorAll(ki))) {
    const n = ls(t);
    rs(t), n && (os(t, n), as(t, n));
  }
}
function rs(e) {
  for (const t of Array.from(e.querySelectorAll(Ti)))
    t.remove();
}
function os(e, t) {
  const r = e.closest(`.${c}`)?.querySelector(_r) ?? null, o = r?.querySelector(Ri) ?? null, a = r ?? e, i = a.querySelector(Pi);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const s = i ?? document.createElement("span");
  if (s.className = _s(t.elementTone), s.textContent = $s(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", s);
      return;
    }
    a.prepend(s);
  }
}
function as(e, t) {
  const n = is(e);
  ss(e, n);
  const r = cs(t);
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
  const a = e.querySelector(Sr);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function is(e) {
  return e.closest(`.${c}`)?.querySelector(_r) ?? null;
}
function ss(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(Li)))
      o.remove();
}
function cs(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${ct(e.target)}` : null,
    e.duration ? `Duração: ${ct(e.duration)}` : null,
    e.resistance ? `Resistência: ${vr(e.resistance)}` : null
  ].filter(Fe);
}
function ls(e) {
  const t = us(e), n = hs(e), o = (t ? gs(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = vt(S(o, "element")), s = v("op.elementChoices", i) ?? An(z(a, "Elemento")) ?? An(n.damageType), d = i ?? Is(s), p = S(o, "circle") ?? z(a, "Círculo"), y = bs(o) ?? z(a, "Alvo"), b = ws(o, "duration", "op.durationChoices") ?? z(a, "Duração"), T = ys(e) ?? ks(o) ?? z(a, "Resistência"), k = As(a) ?? n.cost, f = {
    elementLabel: s,
    elementTone: d,
    circle: p,
    cost: k,
    target: y,
    duration: b,
    resistance: T
  };
  return Cs(f) ? f : null;
}
function us(e) {
  const t = ds(e);
  if (!t) return null;
  const n = t.getFlag?.(l, bi), r = fs(n);
  if (r.length === 0) return null;
  const o = ms(e);
  if (o.size > 0) {
    const a = r.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function ds(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Dt()?.messages?.get?.(n) ?? null : null;
}
function ms(e) {
  const t = e.closest(`.${c}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${mn}]`))) {
    const o = r.getAttribute(mn)?.trim();
    o && n.add(o);
  }
  return n;
}
function fs(e) {
  if (!Me(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(ps).filter((n) => n !== null) : [];
}
function ps(e) {
  return Me(e) ? {
    pendingId: Ie(e.pendingId),
    actorId: Ie(e.actorId),
    itemId: Ie(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(ts) : []
  } : null;
}
function gs(e) {
  if (!e.itemId) return null;
  const t = Dt(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function hs(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(wi))) {
    const o = re(r.textContent);
    if (!o) continue;
    const a = es(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function ys(e) {
  const t = re(e.querySelector(Ir)?.textContent);
  return t ? vr(t) : null;
}
function z(e, t) {
  const n = fe(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || fe(r.slice(0, o)) !== n))
      return re(r.slice(o + 1));
  }
  return null;
}
function As(e) {
  const t = z(e, "Custo") ?? z(e, "PE");
  return t || (e.map(re).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function bs(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return Rs(e) ?? v("op.targetChoices", t) ?? "Área";
  const n = v("op.targetChoices", t) ?? U(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, n].filter(Fe).join(" ");
}
function Rs(e) {
  const t = S(e, "area.name"), n = S(e, "area.size"), r = S(e, "area.type"), o = t ? v("op.areaChoices", t) ?? U(t) : null, a = r ? v("op.areaTypeChoices", r) ?? U(r) : null;
  return o ? n ? a ? `${o} ${n}m ${ct(a)}` : `${o} ${n}m` : o : null;
}
function ks(e) {
  const t = S(e, "skillResis"), n = S(e, "resistance");
  if (!t || !n) return null;
  const r = v("op.skill", t) ?? U(t), o = Ts(n);
  return [r, o].filter(Fe).join(" ");
}
function Ts(e) {
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
      return v("op.resistanceChoices", e) ?? U(e);
  }
}
function ws(e, t, n) {
  const r = S(e, t);
  return r ? v(n, r) ?? U(r) : null;
}
function Cs(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function $s(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function _s(e) {
  return [
    `${c}__ritual-element-badge`,
    e ? `${c}__ritual-element-badge--${e}` : null
  ].filter(Fe).join(" ");
}
function vt(e) {
  const t = fe(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function An(e) {
  const t = vt(e);
  return t ? v("op.elementChoices", t) ?? U(t) : e ? U(e) : null;
}
function Is(e) {
  return vt(e);
}
function v(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Dt()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const bn = "data-paranormal-toolkit-dice-toggle-enhanced";
function Ss(e) {
  for (const t of Array.from(e.querySelectorAll(Er)))
    Or(t);
}
function Es(e) {
  const t = Fr(e.target);
  if (!t) return;
  const n = Ot(t);
  n && (e.preventDefault(), Mr(n, t));
}
function Ps(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Fr(e.target);
  if (!t) return;
  const n = Ot(t);
  n && (e.preventDefault(), Mr(n, t));
}
function Or(e) {
  const t = e.querySelector(Nt);
  if (!t) return;
  const n = e.querySelector(Lr);
  if (n && n.getAttribute(bn) !== "true" && (n.setAttribute(bn, "true"), n.classList.add(Nr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Mr(e, t) {
  const n = e.querySelector(Nt);
  if (!n) return;
  const r = !e.classList.contains(Pr);
  Ls(e, t, n, r);
}
function Ls(e, t, n, r) {
  e.classList.toggle(Pr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Fr(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Lr);
  if (!t) return null;
  const n = Ot(t);
  return n ? (Or(n), t.classList.contains(Nr) ? t : null) : null;
}
function Ot(e) {
  const t = e.closest(Er);
  return t && t.querySelector(Nt) ? t : null;
}
const Rn = `${l}-workflow-dice-toggle-styles`;
function Ns() {
  if (document.getElementById(Rn)) return;
  const e = document.createElement("style");
  e.id = Rn, e.textContent = `
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
const Ds = [0, 100, 500, 1500, 3e3];
let kn = !1, ze = null;
function vs() {
  if (!kn) {
    kn = !0, Ns(), Hooks.on("renderChatMessageHTML", (e, t) => {
      le(yn(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      le(yn(t));
    }), Hooks.once("ready", () => {
      le(document), Os();
    }), document.addEventListener("click", Es), document.addEventListener("keydown", Ps);
    for (const e of Ds)
      globalThis.setTimeout(() => le(document), e);
  }
}
function Os() {
  ze || !document.body || (ze = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && le(n);
  }), ze.observe(document.body, { childList: !0, subtree: !0 }));
}
function le(e) {
  e && (Yi(e), ns(e), Qi(e), Ss(e), ji(e));
}
function Ms() {
  vs();
}
const ue = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, xr = {
  PV: "system.attributes.hp"
}, lt = {
  PV: [ue.PV, xr.PV],
  SAN: [ue.SAN],
  PE: [ue.PE],
  PD: [ue.PD]
}, ut = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Fs {
  getResource(t, n) {
    const r = Tn(t, n);
    if (!r.ok)
      return m(r.error);
    const o = r.value, a = `${o}.value`, i = `${o}.max`, s = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, i), p = Cn(t, n, a, s, "valor atual");
    if (p) return m(p);
    const y = Cn(t, n, i, d, "valor máximo");
    return y ? m(y) : h({
      value: s,
      max: d
    });
  }
  async updateResourceValue(t, n, r) {
    const o = Tn(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function Tn(e, t) {
  const n = xs(e.type, t);
  if (n && wn(e, n))
    return h(n);
  const r = lt[t].find(
    (o) => wn(e, o)
  );
  return r ? h(r) : m({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Us(e, t),
    path: lt[t].join(" | ")
  });
}
function xs(e, t) {
  return e === "threat" ? xr[t] ?? null : e === "agent" ? ue[t] : null;
}
function wn(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Us(e, t) {
  const n = e.type ?? "unknown", r = lt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Cn(e, t, n, r, o) {
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
class Bs {
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
      const i = ut.ritualItem.circleCandidates;
      return m({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: r, value: o } = n, a = js(o);
    return a ? h(a) : m({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of ut.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function js(e) {
  if ($n(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if ($n(n))
      return n;
  }
  return null;
}
function $n(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const qs = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Hs {
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
    const r = n.value, o = Vs(t.ritual, r);
    return o.ok ? o.value ? h(o.value) : h({
      resource: "PE",
      amount: qs[r],
      source: "default-by-circle",
      circle: r
    }) : m(o.error);
  }
}
function Vs(e, t) {
  const n = e.getFlag(l, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Gs(n) ? {
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
function Gs(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const We = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function zs(e) {
  if (!Zs(e.item)) return null;
  const t = dt(e.actor) ? e.actor : Ws(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Ys(e.token) ?? Ks(t),
    targets: Pt(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Ws(e) {
  const t = e;
  return dt(t.actor) ? t.actor : dt(e.parent) ? e.parent : null;
}
function Ks(e) {
  const t = Qs(e) ?? Xs(e);
  return t ? Ur(t) : null;
}
function Ys(e) {
  return mt(e) ? Ur(e) : null;
}
function Qs(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return mt(n) ? n : (t.getActiveTokens?.() ?? []).find(mt) ?? null;
}
function Xs(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Ur(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Ke(e.id),
    actorId: Ke(t?.id),
    sceneId: Ke(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Zs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function dt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function mt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Ke(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Js {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(We.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, u.info(`${We.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = zs(ec(t));
    if (!n) {
      u.warn(`${We.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function ec(e) {
  return e && typeof e == "object" ? e : {};
}
class tc {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return Ye("missing-item-patch");
    if (t.type !== "ritual") return Ye("unsupported-item-type");
    const o = nc(r);
    return Object.keys(o).length === 0 ? Ye("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function nc(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (w(t, "system.circle", n.circle), w(t, "system.element", n.element), w(t, "system.target", n.target), w(t, "system.targetQtd", n.targetQuantity), w(t, "system.execution", n.execution), w(t, "system.range", n.range), w(t, "system.duration", n.duration), w(t, "system.skillResis", n.resistanceSkill), w(t, "system.resistance", n.resistance), w(t, "system.studentForm", n.studentForm), w(t, "system.trueForm", n.trueForm)), t;
}
function w(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function Ye(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class rc {
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
    return this.getNumber(t, ut.ritual.dt, 0);
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
class oc {
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
class ac {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = ic(t);
    return n.ok ? this.presets.has(t.id) ? m({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Qe(t)), h(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const o = this.register(r);
      if (!o.ok)
        return o;
      n.push(o.value);
    }
    return h(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? Qe(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? h(n) : m({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(Qe);
  }
  findForItem(t) {
    return this.list().map((n) => sc(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function ic(e) {
  return !Xe(e.id) || !Xe(e.version) || !Xe(e.label) ? m({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? m({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : h(e);
}
function sc(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = cc(o, t);
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
function cc(e, t) {
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
      const n = _n(t.name), r = e.names.map(_n).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = lc(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function _n(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function lc(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Qe(e) {
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
    }) : h(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = xe(e.amountFrom);
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
    }) : h(o);
  }
  return m({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function xe(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const uc = "dice-so-nice";
async function Br(e) {
  if (!Ai().enabled || !dc()) return;
  const t = mc();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      u.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function dc() {
  return game.modules.get(uc)?.active === !0;
}
function mc() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function fc(e, t, n) {
  if (!In(e.id) || !In(e.formula))
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
    await Br(o);
    const s = {
      ...n.rollRequests[e.id] ?? jr(e, t),
      total: a,
      roll: o
    };
    return n.rolls[e.id] = s, h(s);
  } catch (r) {
    return m({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function jr(e, t) {
  const n = e.intent ?? pc(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function pc(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function In(e) {
  return typeof e == "string" && e.length > 0;
}
async function Ee(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Ce(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Ce(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? Ce(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? Ce(t, n, r, o) : e.recover(t, n, o);
  }
}
function Ce(e, t, n, r) {
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
function gc(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = hc(t, n, r, o);
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
    const i = yc(t, n, r, o);
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
function hc(e, t, n, r) {
  const o = xe(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: qr(t.id, "damage", r, t.damageInstances.length),
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
function yc(e, t, n, r) {
  const o = xe(e.amountFrom);
  return {
    id: qr(t.id, "healing", r, t.healingInstances.length),
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
function qr(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Ac(e, t, n) {
  const r = xe(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function bc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Hr("before", e), Sn("before", e), Sn("resolve", e);
}
function Rc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Hr("apply", e);
}
function kc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Hr(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t, s = Tc(e, n.operation);
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
function Tc(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function wc(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), h(void 0);
  } catch (r) {
    return m({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function Cc(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return $c(e, t);
    case "spendRitualCost":
      return _c(e, t);
  }
}
async function $c(e, t) {
  const { context: n, resources: r } = e, o = Se(t, n);
  return o.ok ? Vr(await r.spend(n.sourceActor, t.resource, o.value), n) : m(o.error);
}
async function _c(e, t) {
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
  }), Vr(await r.spend(n.sourceActor, i.resource, i.amount), n, t);
}
function Vr(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), h(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), m({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Ic(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, i = Sc(t);
  for (const d of i.before)
    o.emit(d, n, { stepIndex: r, step: t });
  const s = await a();
  if (!s.ok)
    return s;
  for (const d of i.after)
    o.emit(d, n, { stepIndex: r, step: t });
  return s;
}
function Sc(e) {
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
class Ec {
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
    return h({ definition: t, context: n });
  }
  async runStep(t, n, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, r);
      default:
        return Ic({
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
    const o = await Cc({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? h(void 0) : m({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = jr(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const i = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, i), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: i }), h(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await fc(t, r, n);
    return o.ok ? h(void 0) : m({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = Se(t, n);
    if (!o.ok)
      return m({ ...o.error, stepIndex: r, step: t, context: n });
    const a = Ac(t, n, o.value);
    bc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), Rc({
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
      const d = await Ee(this.resources, s, t.resource, t.operation, o.value), p = this.handleResourceOperationResult(d, n, r, t);
      if (!p.ok)
        return p;
      gc({
        step: t,
        context: n,
        transaction: p.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return kc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), h(void 0);
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
      const s = await Ee(this.resources, i, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(s, n, r, t);
      if (!d.ok)
        return d;
    }
    return h(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await wc(this.messages, t, n);
    return o.ok ? h(void 0) : m({ ...o.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, o) {
    return t.ok ? (n.resourceTransactions.push(t.value), h(t.value)) : m({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: o,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, o, a, i) {
    const s = Pc(t, n.intent);
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
function Pc(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Lc {
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
    const { afterValue: d, appliedAmount: p } = s.value, y = {
      value: d,
      max: i.max
    };
    try {
      d !== i.value && await this.adapter.updateResourceValue(t, n, d);
    } catch (b) {
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
        cause: b
      });
    }
    return h({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: o,
      appliedAmount: p,
      before: i,
      after: y
    });
  }
  calculate(t, n, r) {
    switch (t) {
      case "spend":
        return n.value < r ? m({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${n.value}; custo: ${r}.`
        }) : h({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const o = Math.max(0, n.value - r);
        return h({
          afterValue: o,
          appliedAmount: n.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(n.max, n.value + r);
        return h({
          afterValue: o,
          appliedAmount: o - n.value
        });
      }
    }
  }
}
function Gr(e) {
  return {
    id: Nc(),
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
function Nc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Dc {
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
    return K(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = Gr(n);
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
class vc {
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
class Oc {
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
    const n = it();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Mc(),
      flags: {
        ...t.flags,
        [l]: {
          ...Fc(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && u.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = it();
    if (!r.enabled)
      return;
    const o = n.notification ?? En(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = En(n);
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
function En(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Mc() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Fc(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function xc(e) {
  const t = Uc(e?.rounds);
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
  const n = Bc();
  if (!n?.id || !zr(n.round))
    return {
      duration: {},
      requestedRounds: t,
      combatDurationApplied: !1,
      combatId: null,
      startRound: null,
      startTurn: null,
      warning: `Duração de ${t} rodada(s) ignorada porque não há combate ativo.`
    };
  const r = jc(n.turn) ? n.turn : 0;
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
function Uc(e) {
  return zr(e) ? Math.trunc(e) : null;
}
function Bc() {
  return game.combat ?? null;
}
function zr(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function jc(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class qc {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? h(n.value) : m({
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
    if (!Kc(r))
      return m({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = xc(t.duration), i = Hc(o, t, a), d = t.refreshExisting ?? !0 ? Yc(r, o.id) : null;
    if (d)
      try {
        return await Promise.resolve(d.update?.(i)), h(Pn(r, o, d.id ?? null, !1, !0, a));
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
      const y = (await r.createEmbeddedDocuments("ActiveEffect", [i]))[0]?.id ?? null;
      return h(Pn(r, o, y, !0, !1, a));
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
    const r = Kr(n, t.conditionId);
    let o = 0;
    try {
      for (const a of r)
        await Ln(n, a) === "deleted" && (o += 1);
    } catch (a) {
      return m({
        actor: n,
        actorId: n.id ?? null,
        actorName: n.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "delete-failed",
        message: `Falha ao remover condição ${t.conditionId} de ${n.name ?? "ator sem nome"}.`,
        cause: a
      });
    }
    return h({
      actor: n,
      actorId: n.id ?? null,
      actorName: n.name ?? "Ator sem nome",
      conditionId: t.conditionId,
      removed: o
    });
  }
  async cleanupExpiredConditions(t = {}) {
    const n = Zc(), r = [];
    let o = 0, a = 0;
    for (const i of n) {
      const s = Mt(i);
      o += s.length;
      for (const d of s) {
        if (!Gc(d, t)) continue;
        const p = Wr(d);
        try {
          await Ln(i, d) === "deleted" && (a += 1);
        } catch (y) {
          r.push({
            actorId: i.id ?? null,
            actorName: i.name ?? "Ator sem nome",
            effectId: d.id ?? null,
            conditionId: p.conditionId,
            message: `Falha ao remover condição expirada ${p.conditionId ?? d.name ?? "desconhecida"} de ${i.name ?? "ator sem nome"}.`,
            cause: y
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
function Hc(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: rl(),
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
    duration: Vc(n.duration),
    flags: {
      [l]: r
    }
  };
}
function Vc(e) {
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
function Pn(e, t, n, r, o, a) {
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
function Gc(e, t) {
  const n = Wr(e);
  if (!n.conditionId || !zc(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  if (Wc(e)) return !0;
  const r = nl();
  return !r?.id || n.combatId && n.combatId !== r.id ? !0 : !de(n.startRound) || !de(n.requestedRounds) || !de(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function zc(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && de(e.requestedRounds);
}
function Wc(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Wr(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {};
  return {
    conditionId: ft(e, "conditionId"),
    requestedRounds: Nn(e, "requestedRounds") ?? pt(t.rounds),
    combatDurationApplied: Ze(e, "combatDurationApplied"),
    combatId: ft(e, "combatId") ?? Ft(t.combat),
    startRound: Nn(e, "startRound") ?? pt(t.startRound),
    deleteOnExpire: Ze(e, "deleteOnExpire"),
    expiresWithCombat: Ze(e, "expiresWithCombat")
  };
}
function Kc(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Yc(e, t) {
  return Kr(e, t)[0] ?? null;
}
function Kr(e, t) {
  return Mt(e).filter((n) => el(n) === t);
}
async function Ln(e, t) {
  const n = t.id ?? null, r = n ? Qc(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (Xc(o)) return "missing";
    throw o;
  }
}
function Qc(e, t) {
  return Mt(e).find((n) => n.id === t) ?? null;
}
function Xc(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Zc() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      $e(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    $e(e, n);
  });
  for (const n of Jc())
    $e(e, n.actor), $e(e, n.document?.actor);
  return Array.from(e.values());
}
function $e(e, t) {
  if (!tl(t)) return;
  const r = Ft(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Jc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Mt(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function el(e) {
  return ft(e, "conditionId");
}
function ft(e, t) {
  return Ft(e.getFlag?.(l, t));
}
function Nn(e, t) {
  return pt(e.getFlag?.(l, t));
}
function Ze(e, t) {
  return e.getFlag?.(l, t) === !0;
}
function Ft(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function pt(e) {
  return de(e) ? Math.trunc(e) : null;
}
function tl(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function nl() {
  return game.combat ?? null;
}
function de(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function rl() {
  return game.user?.id ?? null;
}
const ol = {
  id: "vulnerable",
  label: "Vulnerável",
  icon: "icons/svg/downgrade.svg",
  description: "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.",
  definitionVersion: "1.0.0",
  changes: []
};
class al {
  definitions = /* @__PURE__ */ new Map();
  constructor(t) {
    for (const n of t)
      this.definitions.set(n.id, n);
  }
  list() {
    return Array.from(this.definitions.values()).map(Dn);
  }
  get(t) {
    const n = this.definitions.get(t);
    return n ? h(Dn(n)) : m({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
}
function il() {
  return new al([ol]);
}
function Dn(e) {
  return {
    ...e,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
const sl = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Yr = `${l}-inline-roll-neutralized`, cl = `${l}-inline-roll-notice`, xt = `data-${l}-inline-roll-neutralized`, vn = `data-${l}-inline-roll-notice`, ll = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function On(e) {
  const t = wl(e.message), n = await ul(e.message), r = dl(t);
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
async function ul(e) {
  const t = Rl(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = ml(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await kl(t, n.content), replacementCount: n.replacementCount };
}
function dl(e) {
  const t = e ? Tl(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Qr(t);
  return n > 0 && Xr(yl(t)), { replacementCount: n };
}
function ml(e) {
  const t = fl(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Qr(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (Xr(n.content), { content: n.innerHTML, replacementCount: o });
}
function fl(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, gl(o.trim()))), replacementCount: t };
}
function Qr(e) {
  const t = pl(e);
  for (const n of t)
    n.replaceWith(hl(Al(n)));
  return t.length;
}
function pl(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(sl))
    n.getAttribute(xt) !== "true" && t.add(n);
  return Array.from(t);
}
function gl(e) {
  return `<span class="${Yr}" ${xt}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Cl(e)}</span>`;
}
function hl(e) {
  const t = document.createElement("span");
  return t.classList.add(Yr), t.setAttribute(xt, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Xr(e) {
  if (e.querySelector?.(`[${vn}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(cl), t.setAttribute(vn, "true"), t.textContent = ll, e.append(t);
}
function yl(e) {
  return e.querySelector(".message-content") ?? e;
}
function Al(e) {
  const n = e.getAttribute("data-formula") ?? bl(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function bl(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Rl(e) {
  return e && typeof e == "object" ? e : null;
}
async function kl(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return u.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Tl(e) {
  const t = $l(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function wl(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Cl(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function $l(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Mn = "occultism";
function _l(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Il(e) {
  const t = _l(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await Sl(e, Mn);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Br(n);
  const r = Ll(n);
  return {
    skill: Mn,
    skillLabel: "Ocultismo",
    roll: n,
    formula: Pl(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: Nl(n)
  };
}
async function Sl(e, t) {
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
  return El(r);
}
function El(e) {
  return Fn(e) ? e : Array.isArray(e) ? e.find(Fn) ?? null : null;
}
function Fn(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Pl(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Ll(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Nl(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Dl);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Dl(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function vl(e) {
  return {
    header: {
      eyebrow: Ct,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Ul(e.ritual)
    },
    forms: e.variantOptions.map((t) => Ol(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: xl(e.automationStatus ?? "assisted")
  };
}
function Ol(e, t) {
  const n = Ml(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Fl(t) : "—",
    details: n
  };
}
function Ml(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Fl(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function xl(e) {
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
function Ul(e) {
  const t = e.system, n = [jl(t?.element), Bl(t?.circle)].filter(ql);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function Bl(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function jl(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function ql(e) {
  return typeof e == "string" && e.length > 0;
}
const Zr = ["base", "discente", "verdadeiro"];
function Jr(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Pe(e) {
  return typeof e == "string" && Zr.includes(e);
}
const { ApplicationV2: Hl } = foundry.applications.api;
class me extends Hl {
  constructor(t, n) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = n, this.model = vl(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: me.onCast,
      cancel: me.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new me(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    Gl(o, (a) => {
      this.selectedVariant = a;
    }), zl(o, (a) => {
      this.spendResource = a;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${C(this.model.header.eyebrow)}</p>
        <div>
          <h2>${C(this.model.header.title)}</h2>
          <p>${C(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(Vl).join("")}
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
          <div><dt>Custo base</dt><dd>${C(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${C(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${C(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${C(this.model.automation.title)}</strong></p>
        <p>${C(this.model.automation.description)}</p>
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
    const n = Yl(t), r = Wl(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function Vl(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((a) => `<span>${C(a)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${C(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${C(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${C(e.label)}</strong>
        <em>${C(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function Gl(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => xn(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), xn(e, o, t));
    });
  const r = eo(e);
  r && t(r);
}
function xn(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Pe(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), eo(e));
}
function eo(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && Pe(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function zl(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function Wl(e, t, n) {
  const r = Kl(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function Kl(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Pe(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Pe(n) ? n : null;
}
function Yl(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function C(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function Ql(e) {
  return me.request(e);
}
const Ut = {
  label: "Padrão"
}, Xl = {
  label: "Discente",
  extraCost: 2
}, Zl = {
  label: "Verdadeiro",
  extraCost: 5
};
class Jl {
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
    const r = this.resolveCostPreview(t), o = Nu(n), a = Eu(n, t.item, r, o), i = await Ql({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((_) => _.name),
      cost: r,
      defaultSpendResource: xu(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const s = eu(i), d = vu(n, t.item, s.variant, o), p = Tr();
    let y = null;
    if (p) {
      const _ = await nu(this.resources, t.actor, s, d, r);
      if (!_.ok)
        return {
          status: "failed",
          reason: _.reason,
          message: _.message
        };
      try {
        y = await Il(t.actor);
      } catch (Q) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: Q instanceof Error ? Q.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: Q
        };
      }
    }
    const b = tu(n, s, d, r, {
      includeCostSteps: !p
    });
    if (b.steps.length === 0) {
      const _ = Du(t, s), Q = Un(t.actor, y, d, r), Yt = jn(n, s, d, r, _, y);
      return Q.length > 0 ? {
        status: "ready",
        workflowContext: _,
        actions: Q,
        summaryLines: Yt
      } : {
        status: "completed-without-actions",
        workflowContext: _,
        summaryLines: Yt
      };
    }
    const T = await this.workflow.runAutomation(b, {
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
    if (!T.ok)
      return {
        status: "failed",
        reason: T.error.reason,
        message: T.error.message,
        cause: T.error
      };
    const k = T.value.context, f = cu(n, t, k), F = ou(n, t), be = Un(t.actor, y, d, r), ie = jn(n, s, d, r, k, y);
    if (!f.ok)
      return {
        status: "failed",
        reason: f.reason,
        message: f.message
      };
    if (!F.ok)
      return {
        status: "failed",
        reason: F.reason,
        message: F.message
      };
    const Y = [...be, ...f.actions, ...F.actions];
    return Y.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: k,
      summaryLines: ie
    } : {
      status: "ready",
      workflowContext: k,
      actions: Y,
      summaryLines: ie
    };
  }
  async applyAction(t) {
    return Ee(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function eu(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function tu(e, t, n, r, o) {
  const a = [], i = t.spendResource === !0;
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || Bt(s) && (!o.includeCostSteps || !i) || a.push(ru(s, n));
  return o.includeCostSteps && i && r && Uu(n.extraCost) && a.push({
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
async function nu(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = ye(o, r);
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
function ru(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Un(e, t, n, r) {
  if (!t || t.success) return [];
  const o = ye(r, n);
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
function ou(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = no(r.actor, t);
    if (o.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    for (const a of o)
      n.push(au(r, a, t.item));
  }
  return { ok: !0, actions: n };
}
function au(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = e.label ?? su(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: r,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: e.duration ?? null,
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: iu(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function iu(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function su(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function cu(e, t, n) {
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
    const i = no(o.actor, t);
    if (i.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const s of i)
      r.push(...lu(e, o, s, a.value));
  }
  return { ok: !0, actions: r };
}
function lu(e, t, n, r) {
  if (!fu(e, t))
    return [Bn(t, n, r)];
  const o = hu();
  return to(e).map((a) => {
    const i = pu(r, a);
    return Bn(t, n, i, {
      option: a,
      choiceGroupId: o
    });
  });
}
function Bn(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = mu(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: uu(e, o, n, r?.option),
    executedLabel: du(e, o, r?.option),
    choiceGroupId: r?.choiceGroupId,
    choiceGroupResolvedLabel: r ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function uu(e, t, n, r) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? r ? `${r.id === "normal" ? "Normal" : r.label}: ${n} PV` : `Dano: ${n} PV` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function du(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? n ? `✓ ${n.id === "normal" ? "dano normal" : n.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function mu(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function fu(e, t) {
  return t.operation === "damage" && t.resource === "PV" && to(e).length > 1;
}
function to(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function pu(e, t) {
  const n = e * t.multiplier, r = gu(n, t.rounding ?? "floor");
  return Math.max(0, r);
}
function gu(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function hu() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function no(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((n) => n.actor ? [n.actor] : []);
  }
}
function jn(e, t, n, r, o, a = null) {
  return [
    `Forma: ${Jr(t.variant)}`,
    Au(t, n, r),
    ...yu(a),
    ...Object.values(o.rolls).flatMap(bu),
    ...Ru(e.resistance),
    ...Iu(n)
  ];
}
function yu(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Au(e, t, n) {
  const r = ye(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function bu(e) {
  const n = [`${Su(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = ku(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${_u(e.damageType)}`), n;
}
function Ru(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function ku(e) {
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
    const i = Tu(a);
    i && ($u(n, i.operator ?? r, i.value), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Tu(e) {
  const t = wu(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Cu(e);
}
function wu(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Cu(e) {
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
function $u(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function _u(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Iu(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Su(e) {
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
function Eu(e, t, n, r) {
  return Zr.map((o) => {
    const a = ro(e, t, o, r), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? Jr(o),
      enabled: i,
      details: a ? Pu(a, n, r) : [],
      finalCostText: a ? Lu(n, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function Pu(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = ye(t, e);
  return r.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), r;
}
function ye(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function Lu(e, t) {
  const n = ye(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function Nu(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Bt);
}
function Du(e, t) {
  return Gr({
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
function vu(e, t, n, r) {
  return ro(e, t, n, r) ?? Ut;
}
function ro(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? Mu(t, n) ? Ou(n) : null : n === "base" ? Ut : null);
}
function Ou(e) {
  switch (e) {
    case "base":
      return Ut;
    case "discente":
      return Xl;
    case "verdadeiro":
      return Zl;
  }
}
function Mu(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Fu(foundry.utils.getProperty(e, n));
}
function Fu(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function xu(e) {
  return e.steps.some(Bt);
}
function Bt(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Uu(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Bu(e, t) {
  const n = await ju(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: Hu(n),
    total: Vu(n),
    diceBreakdown: Gu(n)
  };
}
function oo(e) {
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
async function ju(e, t) {
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
  return qu(r);
}
function qu(e) {
  return qn(e) ? e : Array.isArray(e) ? e.find(qn) ?? null : null;
}
function qn(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Hu(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Vu(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Gu(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(zu);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function zu(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const ao = "itemUsePrompts", io = "chatCard", Ue = "data-paranormal-toolkit-prompt-id", Be = "data-paranormal-toolkit-pending-id", jt = "data-paranormal-toolkit-executed-label", gt = "data-paranormal-toolkit-choice-group", so = "data-paranormal-toolkit-skipped-label", Hn = "data-paranormal-toolkit-action-section", Vn = "data-paranormal-toolkit-detail-key", Gn = "data-paranormal-toolkit-roll-card", qt = "data-paranormal-toolkit-roll-detail-toggle", co = "data-paranormal-toolkit-roll-detail-id", lo = "data-paranormal-toolkit-resistance-roll-button", uo = "data-paranormal-toolkit-resistance-skill", mo = "data-paranormal-toolkit-resistance-skill-label", fo = "data-paranormal-toolkit-resistance-target-actor-id", po = "data-paranormal-toolkit-resistance-target-name", go = "data-paranormal-toolkit-resistance-roll-result", zn = "data-paranormal-toolkit-system-card-replaced", Wu = `[${Be}]`, Ku = `[${qt}]`, Yu = `[${lo}]`, ht = `${l}-chat-enrichment`, g = `${l}-item-use-prompt`, Qu = `${g}__actions`, Wn = `${g}__details`, ho = `${g}__summary`, Xu = `${g}__title`, yo = `${g}__button--executed`, Kn = `${g}__roll-card`;
let Yn = !1, yt = null;
const E = /* @__PURE__ */ new Map(), Zu = [0, 100, 500, 1500, 3e3], Ju = 3e4, ed = [0, 100, 500, 1500, 3e3];
function td(e) {
  if (yt = e, Yn) {
    Xn(e);
    return;
  }
  const t = (n, r) => {
    bo(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Yn = !0, Xn(e);
}
async function Qn(e) {
  const t = Ao(e);
  E.set(e.pendingId, t), await Gt(t) || Eo(t), Ro(e.pendingId);
}
async function nd(e) {
  const t = Ao({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", E.set(e.pendingId, t), await Gt(t) || Eo(t), Ro(e.pendingId);
}
async function Je(e, t) {
  const n = E.get(e);
  E.delete(e), n && await tm(n, t);
}
function Ht(e) {
  const t = Oo();
  for (const n of t) {
    const r = M(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function rd(e, t) {
  const n = Ht(e);
  if (!n) return;
  const r = M(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await oe(n.message, r));
}
async function od(e, t, n) {
  if (!t) return;
  const r = Ht(e);
  if (!r) return;
  const o = M(r.message);
  let a = !1;
  for (const [i, s] of Object.entries(o))
    i !== e && s.choiceGroupId === t && (o[i] = {
      ...s,
      executedLabel: n ?? s.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await oe(r.message, o);
}
function Ao(e) {
  const t = B(e.context.message), n = e.context.targets.find((i) => kt(i)), r = n ? kt(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Pd(e.context),
    executed: !1
  };
}
function bo(e, t, n) {
  em();
  const r = qe(t);
  if (!r) return;
  const o = Xd(e, r);
  o.length > 0 && Le(r);
  for (const a of o)
    At(r, a);
  wo(r, n), bt(r), Rt(r);
}
function Xn(e) {
  for (const t of ed)
    globalThis.setTimeout(() => {
      ad(e);
    }, t);
}
function ad(e) {
  for (const t of id()) {
    const n = je(t);
    sd(n) && bo(n, t, e);
  }
}
function id() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function sd(e) {
  return e ? zt(e) ? !0 : rm(e).length > 0 : !1;
}
function Ro(e) {
  const t = E.get(e);
  if (!t) return;
  const n = t.messageId ? Zd(t.messageId) : null;
  if (n) {
    nr(n, t), Le(n), At(n, t), Zn(n), bt(n), Rt(n);
    return;
  }
  if (t.messageId) {
    wt(t);
    return;
  }
  const r = Jd(t);
  if (r) {
    nr(r, t), Le(r), At(r, t), Zn(r), bt(r), Rt(r);
    return;
  }
  wt(t);
}
function Zn(e) {
  yt && wo(e, yt);
}
function Le(e) {
  const t = cd();
  e.classList.toggle(`${g}--system-card-replaced`, t);
  const n = To(e);
  if (!n || (n.classList.toggle(`${g}__host--system-card-replaced`, t), !t) || n.getAttribute(zn) === "true") return;
  const r = n.querySelector(`.${ht}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(zn, "true");
}
function cd() {
  try {
    return xa() === "replace";
  } catch {
    return !1;
  }
}
function At(e, t) {
  if (Le(e), e.querySelector(`[${Ue}="${ae(t.pendingId)}"]`)) return;
  const n = ld(e, t);
  dd(n, t), $d(n, _d(t)).append(Ed(t));
}
function ld(e, t) {
  const n = e.querySelector(`.${ht}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(ht, g);
  const o = document.createElement("header");
  o.classList.add(`${g}__header`);
  const a = document.createElement("span");
  a.classList.add(`${g}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(Xu), i.textContent = ud(t);
  const s = document.createElement("span");
  return s.classList.add(ho), s.textContent = t.summary, o.append(a, i, s), r.append(o), Nd(e).append(r), r;
}
function ud(e) {
  const t = $(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function dd(e, t) {
  const n = t.summaryLines ?? [], r = Io(n, t);
  if (r) {
    md(e, r, t);
    return;
  }
  Id(e, n);
}
function md(e, t, n) {
  if (e.querySelector(`[${Gn}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Kn, `${Kn}--${t.intent}`), r.setAttribute(Gn, "true"), t.castingCheck && Jn(r, pd(t.castingCheck), n.pendingId, "casting"), fd(t) && Jn(r, gd(t), n.pendingId, "effect"), Rd(r, t), kd(r, t, n), Cd(r, t), e.append(r);
}
function fd(e) {
  return e.intent !== "casting";
}
function pd(e) {
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
function gd(e) {
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
function Jn(e, t, n, r) {
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
  hd(o, t), wd(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function hd(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${g}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${g}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = yd(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function yd(e, t) {
  const n = Ad(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${g}__workflow-dice-tray`);
  for (const o of bd(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${g}__workflow-die`), o.active || a.classList.add(`${g}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function Ad(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function bd(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? er(e, "highest") : n.includes("kl") ? er(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function er(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Rd(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(km);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${g}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function kd(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${g}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = Td(t, n);
  o.append(a), i && o.append(i);
  const s = document.createElement("span");
  s.classList.add(`${g}__resistance-description`), s.textContent = t.resistance, r.append(o, s), t.resistanceRollResult && r.append(ko(t.resistanceRollResult)), e.append(r);
}
function Td(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${g}__resistance-roll-button`), n.setAttribute(Ue, t.pendingId), n.setAttribute(lo, "true"), n.setAttribute(uo, e.resistanceSkill), n.setAttribute(mo, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(fo, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(po, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${g}__resistance-roll-button--rolled`), n.setAttribute(go, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${g}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function ko(e) {
  const t = document.createElement("span");
  return t.classList.add(`${g}__resistance-roll-result`), t.textContent = $o(e), t;
}
function wd(e, t, n, r, o) {
  const a = t.filter((p) => p.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${n}-roll-details-${r}`, s = document.createElement("button");
  s.type = "button", s.classList.add(`${g}__roll-detail-toggle`), s.setAttribute(qt, i), s.setAttribute("aria-expanded", "false"), s.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${g}__roll-detail-list`), d.setAttribute(co, i), d.hidden = !0;
  for (const p of a) {
    const y = document.createElement("dt");
    y.textContent = p.label;
    const b = document.createElement("dd");
    b.textContent = p.value, d.append(y, b);
  }
  e.append(s, d);
}
function Cd(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function $d(e, t) {
  const n = `[${Hn}="${ae(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Qu), o.setAttribute(Hn, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${g}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function _d(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = Io(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Id(e, t) {
  if (t.length === 0) return;
  const n = Sd(e);
  for (const r of t) {
    const o = Tm(r);
    if (n.querySelector(`[${Vn}="${ae(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(Vn, o), n.append(a);
  }
}
function Sd(e) {
  const t = e.querySelector(`.${Wn}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Wn), e.append(n), n;
}
function Ed(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${g}__button`), t.setAttribute(Ue, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(yo), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Be, e.pendingId), t.setAttribute(jt, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(gt, e.choiceGroupId), t.setAttribute(so, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Pd(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Ld(e);
  return `${t} → ${n}`;
}
function Ld(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Nd(e) {
  return To(e) ?? e;
}
function To(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function wo(e, t) {
  const n = qe(e);
  if (!n) return;
  const r = n.querySelectorAll(Wu);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      zd(o, t);
    }));
}
function bt(e) {
  const t = qe(e);
  if (!t) return;
  const n = t.querySelectorAll(Ku);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Dd(t, r);
    }));
}
function Rt(e) {
  const t = qe(e);
  if (!t) return;
  const n = t.querySelectorAll(Yu);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      vd(t, r);
    }));
}
function Dd(e, t) {
  const n = t.getAttribute(qt);
  if (!n) return;
  const r = e.querySelector(`[${co}="${ae(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function vd(e, t) {
  const n = t.getAttribute(Ue), r = t.getAttribute(uo), o = t.getAttribute(mo) ?? (r ? oo(r) : "Resistência");
  if (!n || !r) return;
  const a = Fd(e, n), i = xd(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const s = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Bu(i, r);
    await Hd(d.roll);
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
    Od(t, p), Md(t, p), Vd(n, p), await Gd(e, n, p);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1;
  }
}
function Od(e, t) {
  e.classList.add(`${g}__resistance-roll-button--rolled`), e.setAttribute(go, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Md(e, t) {
  const n = e.closest(`.${g}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${g}__resistance-roll-result`), o = r ?? ko(t);
  if (r) {
    r.textContent = $o(t);
    return;
  }
  n.append(o);
}
function Fd(e, t) {
  const n = E.get(t);
  if (n) return n;
  const r = je(e);
  return M(r)[t] ?? null;
}
function xd(e, t) {
  const n = e?.resistanceTargetActor;
  if (D(n)) return n;
  const o = e?.context?.targets.map(kt).find(D) ?? null;
  if (o) return o;
  const a = t.getAttribute(fo) ?? e?.resistanceTargetActorId ?? null, i = a ? Bd(a) : null;
  return i || jd(
    t.getAttribute(po) ?? e?.resistanceTargetName ?? Ud(t)
  );
}
function Ud(e) {
  const n = e.closest(`.${g}`)?.querySelector(`.${ho}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function kt(e) {
  const t = e.actor;
  if (D(t)) return t;
  const n = e.token, r = pe(n);
  if (r) return r;
  const o = e.document;
  return pe(o);
}
function pe(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (D(t)) return t;
  const n = e.document?.actor;
  return D(n) ? n : null;
}
function Bd(e) {
  const n = game.actors?.get?.(e);
  return D(n) ? n : Co().map((a) => pe(a)).find((a) => a?.id === e) ?? null;
}
function jd(e) {
  const t = ee(e);
  if (!t) return null;
  const n = Co().filter((a) => ee(qd(a)) === t).map((a) => pe(a)).find(D) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => D(a) && ee(a.name) === t);
  return D(o) ? o : null;
}
function Co() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function qd(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : pe(e)?.name ?? null;
}
function ee(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function D(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function $o(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Hd(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Vd(e, t) {
  const n = E.get(e);
  n && (n.resistanceRollResult = t);
}
async function Gd(e, t, n) {
  const r = je(e);
  if (r)
    try {
      const o = M(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await oe(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function je(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return O(r?.get?.(n));
}
async function zd(e, t) {
  const n = e.getAttribute(Be);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    _o(e, e.getAttribute(jt) ?? "✓ Automação aplicada"), Wd(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function _o(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(yo), e.removeAttribute(Be), e.removeAttribute(jt);
}
function Wd(e) {
  const t = e.getAttribute(gt);
  if (!t) return;
  const n = e.closest(`.${g}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${gt}="${ae(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(so) ?? "✓ Outra opção escolhida";
    _o(o, a);
  }
}
function Io(e, t) {
  const n = e.map(Vt).filter(bm), r = n.find((f) => f.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = $(e, "Forma"), a = $(e, "Custo"), i = $(e, "Dados") ?? $(e, `Dados (${r.label})`), s = $(e, "Tipo"), d = $(e, "Resistência"), p = $(e, "Resistência Perícia"), y = $(e, "Resistência Rótulo") ?? (p ? oo(p) : null), b = So(e, "Observação"), T = e.filter((f) => Qd(f, r)), k = Kd(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: i,
    damageType: s,
    resistance: d,
    resistanceSkill: p,
    resistanceSkillLabel: y,
    notes: b,
    details: T,
    castingCheck: k,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function Kd(e) {
  const t = e.map(Vt).find((a) => a?.intent === "casting") ?? null, n = $(e, "Conjuração DT"), r = $(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: $(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: $(e, "Dados (Conjuração)")
  } : null;
}
function Vt(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: Yd(n)
  } : null;
}
function Yd(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function $(e, t) {
  return So(e, t)[0] ?? null;
}
function So(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Qd(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Vt(e) ? !1 : e.trim().length > 0;
}
function Xd(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of E.values())
    Tt(r, e, t) && n.set(r.pendingId, r);
  for (const r of nm(e))
    Tt(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Tt(e, t, n) {
  const r = B(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !tr(n, "itemId", e.itemId) ? !1 : !e.actorId || tr(n, "actorId", e.actorId);
}
function tr(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${wm(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Zd(e) {
  const t = ae(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Jd(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Tt(e, null, t))
      return t;
  return null;
}
function em() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of E.entries())
    e - r.createdAt > t && E.delete(n);
}
async function nr(e, t) {
  const n = je(e);
  if (!n) return !1;
  try {
    const r = M(n);
    return r[t.pendingId] = Wt(t, B(n)), await oe(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Gt(e) {
  const t = No(e);
  if (!t) return !1;
  try {
    const n = M(t);
    return n[e.pendingId] = Wt(e, B(t)), await oe(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Eo(e) {
  for (const t of Zu)
    globalThis.setTimeout(() => {
      wt(e);
    }, t);
}
async function wt(e) {
  const t = No(e);
  if (zt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await Gt(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function tm(e, t) {
  const n = Lo(e.context.message);
  if (n)
    try {
      const r = M(n), o = r[e.pendingId] ?? Wt(e, B(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await oe(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function nm(e) {
  return Object.values(M(O(e))).filter(Ae);
}
function M(e) {
  if (!e) return {};
  const t = {}, n = zt(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(Po(e)))
    t[r] ??= o;
  return t;
}
function rm(e) {
  return Object.values(Po(O(e))).filter(Ae);
}
function Po(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, ao);
  if (!te(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Ae(o) && (n[r] = o);
  return n;
}
async function oe(e, t) {
  typeof e.setFlag == "function" && (await am(e, t), await om(e, t));
}
async function om(e, t) {
  await Promise.resolve(e.setFlag?.(l, ao, t));
}
function zt(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, io);
  return ym(t) ? t : null;
}
async function am(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Ae).sort((a, i) => a.createdAt - i.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((a) => a.createdAt)),
    messageId: r.messageId ?? B(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: im(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(l, io, o));
}
function im(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Wt(e, t) {
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
function Lo(e) {
  const t = O(e);
  if (t?.setFlag)
    return t;
  const n = sm(e);
  if (n?.setFlag)
    return n;
  const r = B(e);
  if (!r) return null;
  const o = game.messages;
  return O(o?.get?.(r));
}
function sm(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(O).find((n) => typeof n?.setFlag == "function") ?? null;
}
function No(e) {
  const t = Lo(e.context.message);
  if (t) return t;
  const n = e.messageId ? cm(e.messageId) : null;
  if (n) return n;
  const r = Oo().slice().reverse();
  return r.find((o) => lm(o, e)) ?? r.find((o) => um(o, e)) ?? null;
}
function cm(e) {
  const t = game.messages;
  return O(t?.get?.(e));
}
function lm(e, t) {
  const n = B(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Do(e, t)) return !1;
  const o = vo(e);
  return !t.actorId || !o || o === t.actorId;
}
function um(e, t) {
  if (!mm(e, t)) return !1;
  const n = vo(e);
  return t.actorId && n === t.actorId ? !0 : Do(e, t);
}
function Do(e, t) {
  const n = ee(dm(e));
  if (!n) return !1;
  const r = ee(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = ee(t.itemId);
  return !!(o && n.includes(o));
}
function dm(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function vo(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function mm(e, t) {
  const n = fm(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Ju;
}
function fm(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function O(e) {
  return e && typeof e == "object" ? e : null;
}
function Ae(e) {
  return te(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && I(e.messageId) && I(e.itemId) && I(e.actorId) && I(e.itemName) && G(e.resistanceTargetActorId) && G(e.resistanceTargetName) && Am(e.resistanceRollResult) && pm(e.actionPayload) && et(e.title) && et(e.buttonLabel) && et(e.executedLabel) && G(e.choiceGroupId) && G(e.skippedLabel) && G(e.actionSectionId) && G(e.actionSectionTitle) && Rm(e.summaryLines) : !1;
}
function pm(e) {
  return e == null ? !0 : te(e) ? e.kind === "resource-operation" && I(e.actorId) && I(e.actorUuid) && typeof e.actorName == "string" && gm(e.resource) && hm(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function gm(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function hm(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function ym(e) {
  return te(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && I(e.messageId) && te(e.source) && I(e.source.actorId) && I(e.source.actorName) && I(e.source.itemId) && I(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Ae) : !1;
}
function Am(e) {
  return e == null ? !0 : te(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && G(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function bm(e) {
  return e !== null;
}
function te(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function I(e) {
  return e === null || typeof e == "string";
}
function et(e) {
  return e === void 0 || typeof e == "string";
}
function G(e) {
  return e == null || typeof e == "string";
}
function Rm(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function km(e) {
  return typeof e == "string" && e.length > 0;
}
function Oo() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(O).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(O).filter((r) => r !== null) : [];
}
function qe(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function B(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function Tm(e) {
  return e.trim().toLowerCase();
}
function wm(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ae(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const rr = 1e3;
class Cm {
  constructor(t, n, r, o, a) {
    this.workflow = t, this.resources = n, this.conditions = o, this.debugOutput = a, this.ritualAssistant = new Jl(t, n, r);
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
      settings: nn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = nn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = $t(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && $m(t.item) && n.executionMode === "ask") {
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
    if (await On(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: nt(t, "failed", "missing-actor")
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
    return n ? n.kind === "workflow" ? (this.pendingExecutions.delete(t), await Je(t), await this.executeAutomation(n.context, n.definition, n.mode), !0) : await this.executeAssistedAction(n.action, n.workflowContext) ? (this.pendingExecutions.delete(t), await Je(t), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1 : this.executePersistedPendingAutomation(t);
  }
  async executePersistedPendingAutomation(t) {
    const n = Ht(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const r = n.prompt.actionPayload, o = Sm(r);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`), !1;
    const a = await Ee(this.resources, o, r.resource, r.operation, r.amount);
    return a.ok ? (await rd(t), await od(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (td((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, n) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await On(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: nt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, _m(t.item));
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
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), u.info("Ritual assistido concluído sem ações pendentes.", K(r.workflowContext));
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
      a.kind === "assisted-action" && a.action.kind === "resource-operation" && (this.pendingExecutions.delete(o), await Je(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = rt();
    await nd({
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
      const s = rt();
      a ??= s, this.pendingExecutions.set(s, {
        kind: "assisted-action",
        id: s,
        action: i,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Qn({
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
        actionPayload: Im(i)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), u.info("Ritual assistido preparado com ações pendentes.", K(n));
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = rt();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Qn({
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
    this.setAttempt(t, "completed"), u.info("Automação executada por uso normal de item.", K(o.value.context));
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
    const n = Date.now(), r = or(t);
    for (const [a, i] of this.recentExecutionKeys.entries())
      n - i > rr && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= rr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(or(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = nt(t, n, r, o);
  }
}
function $m(e) {
  return e.type === "ritual";
}
function _m(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Im(e) {
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
function Sm(e) {
  const t = e.actorUuid ? Em(e.actorUuid) : null;
  if (ne(t)) return t;
  const n = e.actorId ? Pm(e.actorId) : null;
  return n || Lm(e.actorName);
}
function Em(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Pm(e) {
  const n = game.actors?.get?.(e);
  if (ne(n)) return n;
  for (const r of Mo()) {
    const o = Kt(r);
    if (o?.id === e) return o;
  }
  return null;
}
function Lm(e) {
  const t = tt(e);
  if (!t) return null;
  for (const o of Mo()) {
    const a = Nm(o);
    if (tt(a) === t) {
      const i = Kt(o);
      if (i) return i;
    }
  }
  const r = game.actors?.find?.((o) => ne(o) && tt(o.name) === t);
  return ne(r) ? r : null;
}
function Mo() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Nm(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Kt(e)?.name ?? null;
}
function Kt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ne(t)) return t;
  const n = e.document?.actor;
  return ne(n) ? n : null;
}
function tt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ne(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function nt(e, t, n, r) {
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
function or(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function rt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Dm {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = he(t);
    for (const i of n) {
      const s = i.itemId ? a.find((y) => y.id === i.itemId) ?? null : null, d = i.match?.preset ?? null;
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
class vm {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = he(t).map((s) => this.analyzeRitual(s)), r = n.filter(_e("upToDate")), o = n.filter(_e("available")), a = n.filter(_e("outdated")), i = n.filter(_e("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = Om(t);
    return n ? r ? r.source.type !== "preset" ? se({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? se({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : se({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: Mm(r, n.preset)
    }) : se({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : se({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function se(e) {
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
function Om(e) {
  const t = e.getFlag(l, "automation");
  return _t(t) ? t : null;
}
function Mm(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function _e(e) {
  return (t) => t.status === e;
}
class Fm {
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
    const r = this.createWorkflowSummaryContent(t, n), o = K(t);
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
    const n = A(t.actorName), r = A(t.resource), o = A(ar(t)), a = A(Um(t));
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
    const r = A(n.title ?? "Automação"), o = n.message ? `<p>${A(n.message)}</p>` : "", a = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), i = A(t.item.name ?? "Item sem nome"), s = t.targets.length > 0 ? t.targets.map((f) => A(f.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (f) => `<li><strong>${A(f.id)}:</strong> ${A(f.formula)} = ${f.total} <em>(${A(xm(f.intent))})</em>${f.damageType ? ` — ${A(f.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (f) => `<li><strong>${A(f.itemName)}:</strong> ${f.circle}º círculo — ${f.amount} ${A(f.resource)} (${A(Bm(f.source))})</li>`
    ), y = t.damageInstances.map(
      (f) => `<li><strong>${A(f.targetActorName)}:</strong> bruto ${f.rawAmount}${f.damageType ? ` ${A(f.damageType)}` : ""} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), b = t.healingInstances.map(
      (f) => `<li><strong>${A(f.targetActorName)}:</strong> bruto ${f.rawAmount} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (f) => `<li><strong>${A(f.actorName)}:</strong> ${A(ar(f))} — ${f.before.value}/${f.before.max} &rarr; ${f.after.value}/${f.after.max}</li>`
    ), k = t.phases.map((f) => A(f)).join(" &rarr; ");
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
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p><strong>Cura:</strong></p><ul>${b.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p class="${l}-workflow-card__phases"><strong>Fases:</strong> ${k}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function xm(e) {
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
function Um(e) {
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
function Bm(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function A(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function jm() {
  const e = new Fs(), t = new Lc(e), n = new Bs(), r = new Hs(n), o = new rc(e), a = new ac(), i = a.registerMany(ya());
  if (!i.ok)
    throw new Error(i.error.message);
  const s = new oc(), d = new tc(), p = il(), y = new qc(p), b = new vm(a), T = new Dm(b, s, d), k = new Oc(), f = new Fm(k), F = new vc(), be = new Ec(t, r, f, F), ie = new Dc(be, F), Y = new Cm(ie, t, r, y, k);
  return Y.addStrategy(new Js((_) => Y.handleItemUsed(_))), {
    ordem: o,
    resourceAdapter: e,
    ritualAdapter: n,
    ritualCosts: r,
    resources: t,
    automationRegistry: a,
    automationBinder: s,
    itemPatches: d,
    conditionRegistry: p,
    conditions: y,
    debugOutput: k,
    chatMessages: f,
    workflowHooks: F,
    automation: be,
    workflow: ie,
    itemUseIntegration: Y,
    ritualPresetDiagnostic: b,
    ritualPresetApplications: T
  };
}
const { ApplicationV2: qm } = foundry.applications.api;
class Ne extends qm {
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
      apply: Ne.onApply,
      cancel: Ne.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${P(Ct)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${P(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${ot("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${ot("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${ot("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function ot(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${P(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Hm(n) : Gm(t)}
    </section>
  `;
}
function Hm(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Vm).join("")}</ol>`;
}
function Vm(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${P(e.appliedPresetId)} v${P(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${P(e.itemName)}</strong>
        <span>${P(e.reason)}</span>
        ${r}
      </div>
      <em>${P(n)}</em>
    </li>
  `;
}
function Gm(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${P({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function P(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const De = `${l}.manageRitualPresets`, ir = `__${l}_ritualPresetHeaderControlRegistered`, zm = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Wm(e) {
  const t = globalThis;
  if (!t[ir]) {
    for (const n of zm)
      Hooks.on(n, (r, o) => {
        Km(r, o, e);
      });
    t[ir] = !0, u.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Km(e, t, n) {
  Array.isArray(t) && Qm(e) && (Ym(e, n), !t.some((r) => r.action === De) && t.push({
    action: De,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Fo(e, n);
    }
  }));
}
function Ym(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[De] && (e.options.actions[De] = (n) => {
    n.preventDefault(), n.stopPropagation(), Fo(e, t);
  }));
}
function Qm(e) {
  if (!game.user?.isGM) return !1;
  const t = xo(e);
  return t ? t.type === "agent" && he(t).length > 0 : !1;
}
function Fo(e, t) {
  const n = xo(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Ne(n, t).render({ force: !0 });
}
function xo(e) {
  return sr(e.actor) ? e.actor : sr(e.document) ? e.document : null;
}
function sr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let W = null;
Hooks.once("init", () => {
  pa(), Fa(), yi(), Ms(), u.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!an.isSupportedSystem()) {
    u.warn(
      `Sistema não suportado: ${an.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  W = jm(), W.itemUseIntegration.registerStrategies(), fi(W.conditions), Ya(W), ii(), ni(), Wm(W), u.info("Inicializado para o sistema Ordem Paranormal."), u.info(`API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Ct} inicializado.`);
});
function Xm() {
  if (!W)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return W;
}
export {
  Xm as getToolkitServices
};
//# sourceMappingURL=main.js.map
