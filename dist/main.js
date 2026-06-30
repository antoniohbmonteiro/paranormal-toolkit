const l = "paranormal-toolkit", Pt = "Paranormal Toolkit", Zo = "ordemparanormal";
class be {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Be(e) {
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
function Nt(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? m({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Lt(t) ? y(t.definition) : m({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Xo(e) {
  return Lt(e.getFlag(l, "automation"));
}
function Lt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && ea(t.source) && Jo(t.definition);
}
function Jo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(ta) && (t.conditionApplications === void 0 || sa(t.conditionApplications));
}
function ea(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function ta(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return na(t);
    case "spendRitualCost":
      return ra(t);
    case "rollFormula":
      return oa(t);
    case "modifyResource":
      return aa(t);
    case "chatCard":
      return ia(t);
    default:
      return !1;
  }
}
function na(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && hr(t);
}
function ra(e) {
  return e.type === "spendRitualCost";
}
function oa(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || fa(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function aa(e) {
  const t = e;
  return t.type === "modifyResource" && yr(t.actor) && da(t.resource) && ma(t.operation) && hr(t);
}
function ia(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function sa(e) {
  return Array.isArray(e) && e.every(ca);
}
function ca(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && yr(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || la(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel));
}
function la(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || pa(t.rounds)) && (t.expiry === void 0 || t.expiry === null || ua(t.expiry));
}
function ua(e) {
  return e === "turnStart" || e === "turnEnd";
}
function hr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function yr(e) {
  return e === "self" || e === "target";
}
function da(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function ma(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function fa(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function pa(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function Dt(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(tn);
    if (ya(t))
      return Array.from(t).filter(tn);
  }
  return [];
}
function ga(e) {
  return Dt(e)[0] ?? null;
}
function ha(e) {
  return Dt(e).find(Xo) ?? null;
}
function ya(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function tn(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Te(e) {
  return Dt(e).filter((t) => t.type === "ritual");
}
function Ar(e) {
  return Te(e)[0] ?? null;
}
function Aa(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Be);
      return u.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = me("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Ie(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(on);
      return u.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = me("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Ie(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await dt(e, r, o.value);
      u.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = me("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Ie(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        u.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await dt(e, n, r.preset);
      u.info(`Melhor preset aplicado em ${n.name}.`, { match: on(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return nn(e);
    },
    async applyBestPresetsToActorRituals() {
      return nn(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = me("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Ie(t);
      n && (await e.automationBinder.clear(n), u.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function nn(e) {
  const t = me("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Te(t);
  if (n.length === 0)
    return u.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), rn(t);
  const r = rn(t, n.length);
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
    const i = await dt(e, o, a.preset);
    r.applied.push(ba(o, a, i));
  }
  return u.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Ta(r), r;
}
async function dt(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function ba(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Be(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function rn(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Ta(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function on(e) {
  return {
    preset: Be(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function me(e) {
  const t = be.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ie(e) {
  const t = Ar(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Z(e) {
  return e ? {
    id: e.id,
    source: {
      ...Ra(e.sourceActor),
      token: e.sourceToken
    },
    item: Ca(e.item),
    targets: e.targets.map(ka),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: an(e.rollRequests, br),
    rolls: an(e.rolls, Ia),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(vt),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function vt(e) {
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
function Ra(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Ca(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function ka(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function br(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Ia(e) {
  return {
    ...br(e),
    total: e.total
  };
}
function an(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function wa(e) {
  return {
    getSelected() {
      return be.getSelectedActor();
    },
    logResources() {
      const t = V(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      u.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && u.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await ee(
        e,
        "Gasto de PE",
        V("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await ee(
        e,
        "Gasto de PD",
        V("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await ee(
        e,
        "Dano em PV",
        V("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await ee(
        e,
        "Cura de PV",
        V("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await ee(
        e,
        "Dano em SAN",
        V("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await ee(
        e,
        "Recuperação de SAN",
        V("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function ee(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    $a(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (i) {
    u.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  u.info(`${t} realizado:`, vt(a));
}
function V(e) {
  const t = be.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function $a(e) {
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
function _a() {
  we(L.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), we(L.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), we(L.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), we(L.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function mt() {
  return {
    enabled: $e(L.enabled),
    console: $e(L.console),
    ui: $e(L.ui),
    chat: $e(L.chat)
  };
}
async function U(e, t) {
  await game.settings.set(l, L[e], t);
}
function we(e, t) {
  game.settings.register(l, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function $e(e) {
  return game.settings.get(l, e) === !0;
}
function Ea() {
  return {
    status() {
      return mt();
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
const Tr = "ritual.costOnly", Rr = "ritual.simpleHealing", Sa = "ritual.eletrocussao", Cr = "ritual.simpleDamage", kr = "generic.simpleHealing", Ir = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Pa() {
  return [
    Na(),
    La(),
    Da(),
    va(),
    Oa()
  ];
}
function Na() {
  return {
    id: Tr,
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
function La() {
  return {
    id: Rr,
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
    automation: wr(),
    itemPatch: Ma()
  };
}
function Da() {
  return {
    id: Sa,
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
    automation: Fa(),
    itemPatch: xa()
  };
}
function va() {
  return {
    id: Cr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Ot()
  };
}
function Oa() {
  return {
    id: kr,
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
function wr(e = "2d8+2") {
  return $r(
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
function Fa() {
  return {
    ...Ot("3d6", {
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
function Ot(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return $r(
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
function Ma() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Ir,
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
function xa() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Ir,
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
function $r(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Ft() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: te(t.id),
    actorId: te(t.actor?.id),
    sceneId: te(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function _r() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: te(e.id),
    actorId: te(t?.id),
    sceneId: te(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function te(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ua(e) {
  return {
    logFirstRitualCost() {
      const t = G("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = z(t);
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
      const r = G("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = z(r);
      if (o) {
        if (!qa(t, n)) {
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
      const t = G("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = z(t);
      n && (await n.unsetFlag(l, "ritual.cost"), u.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = G("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = z(t);
      if (!n) return;
      const r = e.automationRegistry.require(Tr);
      if (!r.ok) {
        u.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), u.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = G("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = z(n);
      if (!r) return;
      if (!sn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Rr);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: wr(t)
      }), u.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = G("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = z(n);
      if (!r) return;
      if (!sn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Cr);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Ot(t)
      }), u.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = G("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = z(t);
      n && await Ba(e, t, n);
    }
  };
}
async function Ba(e, t, n) {
  const r = Nt(n);
  if (!r.ok) {
    u.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: _r(),
    item: n,
    targets: Ft()
  });
  if (!o.ok) {
    ja(o.error);
    return;
  }
  u.info("Automação de ritual executada com sucesso.", Z(o.value.context));
}
function ja(e) {
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
function G(e) {
  const t = be.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function z(e) {
  const t = Ar(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function qa(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function sn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Ha = ["disabled", "ask", "automatic"], Va = ["buttons", "confirm"], Er = "ask";
function Ga(e) {
  return typeof e == "string" && Ha.includes(e);
}
function za(e) {
  return typeof e == "string" && Va.includes(e);
}
function Wa(e) {
  return Ga(e) ? e : za(e) ? "ask" : Er;
}
const Ka = ["keep", "replace"], Sr = "keep", Ya = !0, D = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Qa() {
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
    default: Er
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
    default: Sr
  }), game.settings.register(l, D.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Ya
  }), game.settings.register(l, D.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function cn() {
  const e = Wa(game.settings.get(l, D.executionMode)), t = Nr(game.settings.get(l, D.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: Pr()
  };
}
function Za() {
  return Nr(game.settings.get(l, D.systemCardMode));
}
function Pr() {
  return game.settings.get(l, D.ritualCastingCheckEnabled) === !0;
}
async function W(e) {
  await game.settings.set(l, D.executionMode, e);
}
function Nr(e) {
  return Ka.includes(e) ? e : Sr;
}
function Xa(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await W("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await W("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await W(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await W("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await W("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await W("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await W("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Ja = [
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
function ei(e) {
  return {
    phases() {
      return Ja;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Ye("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = ha(t);
      if (!n) {
        u.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await ln(e, t, n);
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
      if (!ri(n)) {
        u.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = ni(n) ?? Ye("Nenhum ator encontrado para executar automação do item.");
      r && await ln(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Ye("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = ga(t);
      if (!n) {
        u.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(kr);
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
async function ln(e, t, n) {
  const r = Nt(n);
  if (!r.ok) {
    u.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: _r(),
    item: n,
    targets: Ft()
  });
  if (!o.ok) {
    ti(o.error);
    return;
  }
  u.info("Automação executada com sucesso.", Z(o.value.context));
}
function ti(e) {
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
function Ye(e) {
  const t = be.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ni(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ri(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function oi(e) {
  const t = wa(e), n = Aa(e), r = Ua(e), o = ei(e), a = Ea(), i = Xa(e);
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
function ai(e) {
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
      const r = un();
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
      return ii(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = un();
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
      return si(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function un() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function ii(e) {
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
function si(e) {
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
function ci(e) {
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
    conditions: ai(e.conditions),
    debug: oi(e)
  }, n = globalThis;
  return n[l] = t, n.ParanormalToolkit = t, t;
}
class dn {
  static isSupportedSystem() {
    return game.system.id === Zo;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function li() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ne(t.id),
    actorId: ne(t.actor?.id),
    sceneId: ne(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Lr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: ne(e.id),
    actorId: ne(t?.id),
    sceneId: ne(e.scene?.id),
    name: n
  };
}
function di(e, t = Lr()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function mi(e) {
  if (!gi(e)) return null;
  const t = e.getFlag(l, "workflow");
  return pi(t) ? t : null;
}
function fi() {
  return `flags.${l}.workflow`;
}
function mn(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${l}`), n = foundry.utils.getProperty(e, `_source.flags.${l}`);
  return t !== void 0 || n !== void 0;
}
function fn(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return ft(t) || ft(n);
}
function pi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function gi(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ne(e) {
  return ft(e) ? e : null;
}
function ft(e) {
  return typeof e == "string" && e.length > 0;
}
function hi() {
  const e = (t, n) => {
    yi(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function yi(e, t) {
  const n = mi(e);
  if (!n || n.targets.length === 0) return;
  const r = bi(t);
  if (!r || r.querySelector(`.${l}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Ai(n));
}
function Ai(e) {
  const t = document.createElement("section");
  t.classList.add(`${l}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(pn("Origem", e.source.name)), t.append(pn("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function pn(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${l}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function bi(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ti() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!Ri(r) || !Ci(e) || mn(e) || mn(t)) return;
    const o = li();
    if (o.length === 0 || !fn(e) && !fn(t)) return;
    const a = Lr();
    e.updateSource({
      [fi()]: di(o, a)
    }), u.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Ri(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Ci(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let gn = !1, Qe = !1, Ze = !1, _e = null;
const ki = 1e3, Ii = 750, wi = 1e3;
function $i(e) {
  gn || (Hooks.on("combatTurnChange", (t) => {
    Ei(e, hn(t));
  }), Hooks.on("deleteCombat", (t) => {
    Si(e, hn(t));
  }), gn = !0, _i(e));
}
function _i(e) {
  je() && (Qe || (Qe = !0, globalThis.setTimeout(() => {
    Qe = !1, Mt(e, "ready");
  }, ki)));
}
function Ei(e, t) {
  je() && t && (_e && globalThis.clearTimeout(_e), _e = globalThis.setTimeout(() => {
    _e = null, Mt(e, "combat-turn-change", t);
  }, Ii));
}
function Si(e, t) {
  je() && t && (Ze || (Ze = !0, globalThis.setTimeout(() => {
    Ze = !1, Mt(e, "combat-deleted", t);
  }, wi)));
}
async function Mt(e, t, n) {
  if (je())
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
function je() {
  return game.user?.isGM === !0;
}
function hn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Dr = {
  enabled: "dice.animations.enabled"
};
function Pi() {
  game.settings.register(l, Dr.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Ni() {
  return {
    enabled: game.settings.get(l, Dr.enabled) === !0
  };
}
const Li = "chatCard", yn = "data-paranormal-toolkit-prompt-id", c = `${l}-item-use-prompt`, Di = `.${c}__title`, vr = `.${c}__header`, vi = `.${c}__roll-card`, Oi = `.${c}__roll-meta`, Fi = `.${c}__roll-meta-pill`, Mi = `.${c}__resistance`, xi = `.${c}__resistance-header`, Or = `.${c}__resistance-description`, Ui = `.${c}__resistance-roll-button`, Bi = `.${c}__resistance-roll-result`, An = `${c}__resistance-content`, Fr = `.${c}__workflow-section`, Mr = `.${c}__workflow-roll`, xr = `${c}__workflow-roll--dice-open`, Ur = `.${c}__workflow-roll-formula`, Br = `${c}__workflow-roll-formula--toggle`, xt = `.${c}__workflow-dice-tray`, ji = `.${c}__roll-detail-toggle`, qi = `.${c}__roll-detail-list`, Hi = `.${c}__ritual-element-badge`, Vi = `.${c}__ritual-metadata`, Gi = "casting-backlash", zi = "data-paranormal-toolkit-action-section", Wi = "data-paranormal-toolkit-prompt-id", Ki = "data-paranormal-toolkit-pending-id", bn = "data-paranormal-toolkit-casting-backlash-enhanced", Tn = `.${c}`, Yi = `.${c}__workflow-section--casting`, Qi = `.${c}__workflow-section-header`, Zi = `.${c}__workflow-notes`, Xi = `[${zi}="${Gi}"]`, Rn = `${c}__workflow-section-title-row`, Ji = `${c}__workflow-section-header--casting-backlash`, jr = `${c}__casting-backlash-button`;
function es(e) {
  for (const t of ts(e))
    ns(t), ss(t);
}
function ts(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Tn) && t.add(e);
  for (const n of e.querySelectorAll(Tn))
    t.add(n);
  return Array.from(t);
}
function ns(e) {
  const t = e.querySelector(Xi);
  if (!t) return;
  const n = rs(t);
  if (!n) return;
  const r = e.querySelector(`${Yi} ${Qi}`);
  r && (r.classList.add(Ji), os(r), as(n), r.append(n), t.remove());
}
function rs(e) {
  return e.querySelector(
    `button[${Ki}], button[${Wi}]`
  );
}
function os(e) {
  const t = e.querySelector(`:scope > .${Rn}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Rn);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(jr) || n.append(o));
  return n;
}
function as(e) {
  if (e.getAttribute(bn) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = is(t, e.disabled);
  e.classList.add(jr), e.setAttribute(bn, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function is(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function ss(e) {
  for (const t of e.querySelectorAll(Zi)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function cs(e) {
  for (const t of Array.from(e.querySelectorAll(Fr)))
    for (const n of Array.from(t.querySelectorAll(`${ji}, ${qi}`)))
      n.remove();
}
function ls(e) {
  for (const t of Array.from(e.querySelectorAll(Mi)))
    us(t);
}
function us(e) {
  const t = e.querySelector(xi), n = e.querySelector(Or), r = e.querySelector(Ui), o = e.querySelector(Bi);
  if (!r || !t && !n && !o) return;
  const a = ds(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && o.parentElement !== a && !r.contains(o) && a.append(o), r.parentElement !== e && e.append(r);
}
function ds(e, t) {
  const n = e.querySelector(`.${An}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(An), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function Cn(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Ut() {
  const e = globalThis.game;
  return qe(e) ? e : null;
}
function S(e, t) {
  const n = ms(e, t);
  return Ne(n);
}
function ms(e, t) {
  return t.split(".").reduce((n, r) => qe(n) ? n[r] : null, e);
}
function fs(e, t) {
  const n = e.indexOf(":");
  return n < 0 || ye(e.slice(0, n)) !== ye(t) ? null : se(e.slice(n + 1));
}
function Ne(e) {
  return typeof e == "string" ? se(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function qe(e) {
  return !!e && typeof e == "object";
}
function ps(e) {
  return typeof e == "string";
}
function He(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function se(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function ye(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function pt(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function q(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function qr(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function gs(e) {
  for (const t of Array.from(e.querySelectorAll(vi))) {
    const n = Cs(t);
    hs(t), n && (ys(t, n), As(t, n));
  }
}
function hs(e) {
  for (const t of Array.from(e.querySelectorAll(Oi)))
    t.remove();
}
function ys(e, t) {
  const r = e.closest(`.${c}`)?.querySelector(vr) ?? null, o = r?.querySelector(Di) ?? null, a = r ?? e, i = a.querySelector(Hi);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const s = i ?? document.createElement("span");
  if (s.className = Us(t.elementTone), s.textContent = xs(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", s);
      return;
    }
    a.prepend(s);
  }
}
function As(e, t) {
  const n = bs(e);
  Ts(e, n);
  const r = Rs(t);
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
  const a = e.querySelector(Fr);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function bs(e) {
  return e.closest(`.${c}`)?.querySelector(vr) ?? null;
}
function Ts(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(Vi)))
      o.remove();
}
function Rs(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${pt(e.target)}` : null,
    e.duration ? `Duração: ${pt(e.duration)}` : null,
    e.resistance ? `Resistência: ${qr(e.resistance)}` : null
  ].filter(He);
}
function Cs(e) {
  const t = ks(e), n = Ss(e), o = (t ? Es(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = Bt(S(o, "element")), s = O("op.elementChoices", i) ?? kn(Y(a, "Elemento")) ?? kn(n.damageType), d = i ?? Bs(s), p = S(o, "circle") ?? Y(a, "Círculo"), A = Ls(o) ?? Y(a, "Alvo"), T = Fs(o, "duration", "op.durationChoices") ?? Y(a, "Duração"), k = Ps(e) ?? vs(o) ?? Y(a, "Resistência"), C = Ns(a) ?? n.cost, f = {
    elementLabel: s,
    elementTone: d,
    circle: p,
    cost: C,
    target: A,
    duration: T,
    resistance: k
  };
  return Ms(f) ? f : null;
}
function ks(e) {
  const t = Is(e);
  if (!t) return null;
  const n = t.getFlag?.(l, Li), r = $s(n);
  if (r.length === 0) return null;
  const o = ws(e);
  if (o.size > 0) {
    const a = r.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function Is(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Ut()?.messages?.get?.(n) ?? null : null;
}
function ws(e) {
  const t = e.closest(`.${c}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${yn}]`))) {
    const o = r.getAttribute(yn)?.trim();
    o && n.add(o);
  }
  return n;
}
function $s(e) {
  if (!qe(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(_s).filter((n) => n !== null) : [];
}
function _s(e) {
  return qe(e) ? {
    pendingId: Ne(e.pendingId),
    actorId: Ne(e.actorId),
    itemId: Ne(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(ps) : []
  } : null;
}
function Es(e) {
  if (!e.itemId) return null;
  const t = Ut(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Ss(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(Fi))) {
    const o = se(r.textContent);
    if (!o) continue;
    const a = fs(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function Ps(e) {
  const t = se(e.querySelector(Or)?.textContent);
  return t ? qr(t) : null;
}
function Y(e, t) {
  const n = ye(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || ye(r.slice(0, o)) !== n))
      return se(r.slice(o + 1));
  }
  return null;
}
function Ns(e) {
  const t = Y(e, "Custo") ?? Y(e, "PE");
  return t || (e.map(se).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Ls(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return Ds(e) ?? O("op.targetChoices", t) ?? "Área";
  const n = O("op.targetChoices", t) ?? q(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, n].filter(He).join(" ");
}
function Ds(e) {
  const t = S(e, "area.name"), n = S(e, "area.size"), r = S(e, "area.type"), o = t ? O("op.areaChoices", t) ?? q(t) : null, a = r ? O("op.areaTypeChoices", r) ?? q(r) : null;
  return o ? n ? a ? `${o} ${n}m ${pt(a)}` : `${o} ${n}m` : o : null;
}
function vs(e) {
  const t = S(e, "skillResis"), n = S(e, "resistance");
  if (!t || !n) return null;
  const r = O("op.skill", t) ?? q(t), o = Os(n);
  return [r, o].filter(He).join(" ");
}
function Os(e) {
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
      return O("op.resistanceChoices", e) ?? q(e);
  }
}
function Fs(e, t, n) {
  const r = S(e, t);
  return r ? O(n, r) ?? q(r) : null;
}
function Ms(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function xs(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Us(e) {
  return [
    `${c}__ritual-element-badge`,
    e ? `${c}__ritual-element-badge--${e}` : null
  ].filter(He).join(" ");
}
function Bt(e) {
  const t = ye(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function kn(e) {
  const t = Bt(e);
  return t ? O("op.elementChoices", t) ?? q(t) : e ? q(e) : null;
}
function Bs(e) {
  return Bt(e);
}
function O(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Ut()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const In = "data-paranormal-toolkit-dice-toggle-enhanced";
function js(e) {
  for (const t of Array.from(e.querySelectorAll(Mr)))
    Hr(t);
}
function qs(e) {
  const t = Gr(e.target);
  if (!t) return;
  const n = jt(t);
  n && (e.preventDefault(), Vr(n, t));
}
function Hs(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Gr(e.target);
  if (!t) return;
  const n = jt(t);
  n && (e.preventDefault(), Vr(n, t));
}
function Hr(e) {
  const t = e.querySelector(xt);
  if (!t) return;
  const n = e.querySelector(Ur);
  if (n && n.getAttribute(In) !== "true" && (n.setAttribute(In, "true"), n.classList.add(Br), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Vr(e, t) {
  const n = e.querySelector(xt);
  if (!n) return;
  const r = !e.classList.contains(xr);
  Vs(e, t, n, r);
}
function Vs(e, t, n, r) {
  e.classList.toggle(xr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Gr(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Ur);
  if (!t) return null;
  const n = jt(t);
  return n ? (Hr(n), t.classList.contains(Br) ? t : null) : null;
}
function jt(e) {
  const t = e.closest(Mr);
  return t && t.querySelector(xt) ? t : null;
}
const wn = `${l}-workflow-dice-toggle-styles`;
function Gs() {
  if (document.getElementById(wn)) return;
  const e = document.createElement("style");
  e.id = wn, e.textContent = `
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
const zs = [0, 100, 500, 1500, 3e3];
let $n = !1, Xe = null;
function Ws() {
  if (!$n) {
    $n = !0, Gs(), Hooks.on("renderChatMessageHTML", (e, t) => {
      fe(Cn(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      fe(Cn(t));
    }), Hooks.once("ready", () => {
      fe(document), Ks();
    }), document.addEventListener("click", qs), document.addEventListener("keydown", Hs);
    for (const e of zs)
      globalThis.setTimeout(() => fe(document), e);
  }
}
function Ks() {
  Xe || !document.body || (Xe = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && fe(n);
  }), Xe.observe(document.body, { childList: !0, subtree: !0 }));
}
function fe(e) {
  e && (cs(e), gs(e), ls(e), js(e), es(e));
}
function Ys() {
  Ws();
}
const pe = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, zr = {
  PV: "system.attributes.hp"
}, gt = {
  PV: [pe.PV, zr.PV],
  SAN: [pe.SAN],
  PE: [pe.PE],
  PD: [pe.PD]
}, ht = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Qs {
  getResource(t, n) {
    const r = _n(t, n);
    if (!r.ok)
      return m(r.error);
    const o = r.value, a = `${o}.value`, i = `${o}.max`, s = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, i), p = Sn(t, n, a, s, "valor atual");
    if (p) return m(p);
    const A = Sn(t, n, i, d, "valor máximo");
    return A ? m(A) : y({
      value: s,
      max: d
    });
  }
  async updateResourceValue(t, n, r) {
    const o = _n(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function _n(e, t) {
  const n = Zs(e.type, t);
  if (n && En(e, n))
    return y(n);
  const r = gt[t].find(
    (o) => En(e, o)
  );
  return r ? y(r) : m({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Xs(e, t),
    path: gt[t].join(" | ")
  });
}
function Zs(e, t) {
  return e === "threat" ? zr[t] ?? null : e === "agent" ? pe[t] : null;
}
function En(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Xs(e, t) {
  const n = e.type ?? "unknown", r = gt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Sn(e, t, n, r, o) {
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
class Js {
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
      const i = ht.ritualItem.circleCandidates;
      return m({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: r, value: o } = n, a = ec(o);
    return a ? y(a) : m({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of ht.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function ec(e) {
  if (Pn(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Pn(n))
      return n;
  }
  return null;
}
function Pn(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const tc = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class nc {
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
    const r = n.value, o = rc(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: tc[r],
      source: "default-by-circle",
      circle: r
    }) : m(o.error);
  }
}
function rc(e, t) {
  const n = e.getFlag(l, "ritual.cost");
  return n == null ? { ok: !0, value: null } : oc(n) ? {
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
function oc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Je = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function ac(e) {
  if (!dc(e.item)) return null;
  const t = yt(e.actor) ? e.actor : ic(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: cc(e.token) ?? sc(t),
    targets: Ft(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function ic(e) {
  const t = e;
  return yt(t.actor) ? t.actor : yt(e.parent) ? e.parent : null;
}
function sc(e) {
  const t = lc(e) ?? uc(e);
  return t ? Wr(t) : null;
}
function cc(e) {
  return At(e) ? Wr(e) : null;
}
function lc(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return At(n) ? n : (t.getActiveTokens?.() ?? []).find(At) ?? null;
}
function uc(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Wr(e) {
  const t = e.actor ?? null;
  return {
    tokenId: et(e.id),
    actorId: et(t?.id),
    sceneId: et(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function dc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function yt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function At(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function et(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class mc {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Je.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, u.info(`${Je.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = ac(fc(t));
    if (!n) {
      u.warn(`${Je.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function fc(e) {
  return e && typeof e == "object" ? e : {};
}
class pc {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return tt("missing-item-patch");
    if (t.type !== "ritual") return tt("unsupported-item-type");
    const o = gc(r);
    return Object.keys(o).length === 0 ? tt("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function gc(e) {
  const t = {};
  I(t, "name", e.name), I(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (I(t, "system.circle", n.circle), I(t, "system.element", n.element), I(t, "system.target", n.target), I(t, "system.targetQtd", n.targetQuantity), I(t, "system.execution", n.execution), I(t, "system.range", n.range), I(t, "system.duration", n.duration), I(t, "system.skillResis", n.resistanceSkill), I(t, "system.resistance", n.resistance), I(t, "system.studentForm", n.studentForm), I(t, "system.trueForm", n.trueForm)), t;
}
function I(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function tt(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class hc {
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
    return this.getNumber(t, ht.ritual.dt, 0);
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
class yc {
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
class Ac {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = bc(t);
    return n.ok ? this.presets.has(t.id) ? m({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, nt(t)), y(t)) : n;
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
    return n ? nt(n) : null;
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
    return Array.from(this.presets.values()).map(nt);
  }
  findForItem(t) {
    return this.list().map((n) => Tc(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function bc(e) {
  return !rt(e.id) || !rt(e.version) || !rt(e.label) ? m({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? m({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function Tc(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = Rc(o, t);
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
function Rc(e, t) {
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
      const n = Nn(t.name), r = e.names.map(Nn).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Cc(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Nn(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Cc(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function nt(e) {
  return structuredClone(e);
}
function rt(e) {
  return typeof e == "string" && e.length > 0;
}
function ve(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? m({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = Ve(e.amountFrom);
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
function Ve(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const kc = "dice-so-nice";
async function Kr(e) {
  if (!Ni().enabled || !Ic()) return;
  const t = wc();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      u.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Ic() {
  return game.modules.get(kc)?.active === !0;
}
function wc() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function $c(e, t, n) {
  if (!Ln(e.id) || !Ln(e.formula))
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
    await Kr(o);
    const s = {
      ...n.rollRequests[e.id] ?? Yr(e, t),
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
function Yr(e, t) {
  const n = e.intent ?? _c(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function _c(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Ln(e) {
  return typeof e == "string" && e.length > 0;
}
async function Oe(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Ee(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Ee(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? Ee(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? Ee(t, n, r, o) : e.recover(t, n, o);
  }
}
function Ee(e, t, n, r) {
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
function Ec(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = Sc(t, n, r, o);
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
    const i = Pc(t, n, r, o);
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
function Sc(e, t, n, r) {
  const o = Ve(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: Qr(t.id, "damage", r, t.damageInstances.length),
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
function Pc(e, t, n, r) {
  const o = Ve(e.amountFrom);
  return {
    id: Qr(t.id, "healing", r, t.healingInstances.length),
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
function Qr(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Nc(e, t, n) {
  const r = Ve(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function Lc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Zr("before", e), Dn("before", e), Dn("resolve", e);
}
function Dc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Zr("apply", e);
}
function vc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Zr(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t, s = Oc(e, n.operation);
  s && i.emit(s, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Dn(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t;
  n.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Oc(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Fc(e, t, n) {
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
async function Mc(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return xc(e, t);
    case "spendRitualCost":
      return Uc(e, t);
  }
}
async function xc(e, t) {
  const { context: n, resources: r } = e, o = ve(t, n);
  return o.ok ? Xr(await r.spend(n.sourceActor, t.resource, o.value), n) : m(o.error);
}
async function Uc(e, t) {
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
  }), Xr(await r.spend(n.sourceActor, i.resource, i.amount), n, t);
}
function Xr(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), m({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Bc(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, i = jc(t);
  for (const d of i.before)
    o.emit(d, n, { stepIndex: r, step: t });
  const s = await a();
  if (!s.ok)
    return s;
  for (const d of i.after)
    o.emit(d, n, { stepIndex: r, step: t });
  return s;
}
function jc(e) {
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
class qc {
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
        return Bc({
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
    const o = await Mc({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? y(void 0) : m({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = Yr(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const i = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, i), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: i }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await $c(t, r, n);
    return o.ok ? y(void 0) : m({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = ve(t, n);
    if (!o.ok)
      return m({ ...o.error, stepIndex: r, step: t, context: n });
    const a = Nc(t, n, o.value);
    Lc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), Dc({
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
      const d = await Oe(this.resources, s, t.resource, t.operation, o.value), p = this.handleResourceOperationResult(d, n, r, t);
      if (!p.ok)
        return p;
      Ec({
        step: t,
        context: n,
        transaction: p.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return vc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = ve(t, n);
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
      const s = await Oe(this.resources, i, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(s, n, r, t);
      if (!d.ok)
        return d;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await Fc(this.messages, t, n);
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
    const s = Hc(t, n.intent);
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
function Hc(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Vc {
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
    } catch (T) {
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
        cause: T
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
function Jr(e) {
  return {
    id: Gc(),
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
function Gc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class zc {
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
    return Z(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = Jr(n);
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
class Wc {
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
class Kc {
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
    const n = mt();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Yc(),
      flags: {
        ...t.flags,
        [l]: {
          ...Qc(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && u.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = mt();
    if (!r.enabled)
      return;
    const o = n.notification ?? vn(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = vn(n);
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
function vn(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Yc() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Qc(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function Zc(e) {
  const t = tl(e?.rounds);
  if (!t)
    return On(null);
  const n = e?.anchor ?? eo();
  if (!n)
    return {
      ...On(t),
      warning: `Duração de ${t} rodada(s) ignorada porque não há combate ativo.`
    };
  const r = e?.expiry ?? "turnStart";
  return {
    duration: {
      value: t,
      units: "rounds",
      expiry: r
    },
    start: {
      combat: n.combatId,
      combatant: n.combatantId,
      initiative: n.initiative,
      round: n.round,
      turn: n.turn,
      time: n.time
    },
    requestedRounds: t,
    combatDurationApplied: !0,
    combatId: n.combatId,
    startCombatantId: n.combatantId,
    startInitiative: n.initiative,
    startRound: n.round,
    startTurn: n.turn,
    expiryEvent: r,
    durationMode: "sourceTurn",
    warning: null
  };
}
function eo(e) {
  const t = nl();
  if (!t?.id || !no(t.round)) return null;
  const n = el(t), r = Xc(t, e, n) ?? to(t), o = B(r?.id), a = ol(r?.initiative), i = Jc(t, r, n);
  return {
    mode: "sourceTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: i,
    initiative: a,
    time: rl()
  };
}
function On(e) {
  return {
    duration: {},
    start: {},
    requestedRounds: e,
    combatDurationApplied: !1,
    combatId: null,
    startCombatantId: null,
    startInitiative: null,
    startRound: null,
    startTurn: null,
    expiryEvent: null,
    durationMode: "none",
    warning: null
  };
}
function Xc(e, t, n) {
  if (!t?.id) return null;
  const r = to(e);
  return r && Fn(r) === t.id ? r : n.find((o) => Fn(o) === t.id) ?? null;
}
function Jc(e, t, n) {
  const r = B(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return al(e.turn) ? e.turn : null;
}
function to(e) {
  return Le(e.combatant) ? e.combatant : null;
}
function el(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Le);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Le);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(Le);
  }
  return [];
}
function Fn(e) {
  return B(e.actor?.id) ?? B(e.actorId) ?? B(e.token?.actor?.id) ?? B(e.token?.actorId) ?? B(e.document?.actor?.id) ?? B(e.document?.actorId);
}
function tl(e) {
  return no(e) ? Math.trunc(e) : null;
}
function nl() {
  return game.combat ?? null;
}
function rl() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Le(e) {
  return !!(e && typeof e == "object");
}
function B(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ol(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function no(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function al(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class il {
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
    if (!gl(r))
      return m({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = Zc(t.duration), i = sl(o, t, a), d = t.refreshExisting ?? !0 ? hl(r, o.id) : null;
    if (d)
      try {
        return await Promise.resolve(d.update?.(i)), y(Mn(r, o, d.id ?? null, !1, !0, a));
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
      return y(Mn(r, o, A, !0, !1, a));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = oo(n, r);
    let a = 0;
    try {
      for (const i of o)
        await xn(n, i) === "deleted" && (a += 1);
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
    const n = bl(), r = [];
    let o = 0, a = 0;
    for (const i of n) {
      const s = qt(i);
      o += s.length;
      for (const d of s) {
        if (!ul(d, t)) continue;
        const p = ro(d);
        try {
          await xn(i, d) === "deleted" && (a += 1);
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
function sl(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Sl(),
    requestedRounds: n.requestedRounds,
    combatDurationApplied: n.combatDurationApplied,
    combatId: n.combatId,
    startCombatantId: n.startCombatantId,
    startInitiative: n.startInitiative,
    startRound: n.startRound,
    startTurn: n.startTurn,
    expiryEvent: n.expiryEvent,
    durationMode: n.durationMode,
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
    duration: cl(n.duration),
    start: ll(n.start),
    flags: {
      [l]: r
    }
  };
}
function cl(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function ll(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: El(),
    ...e
  };
}
function Mn(e, t, n, r, o, a) {
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
function ul(e, t) {
  const n = ro(e);
  if (!n.conditionId || !dl(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  if (ml(e)) return !0;
  const r = _l();
  return !r?.id || n.combatId && n.combatId !== r.id ? !0 : !j(n.startRound) || !j(n.requestedRounds) || !j(r.round) ? !1 : n.durationMode === "sourceTurn" ? fl(n, r) : r.round >= n.startRound + n.requestedRounds;
}
function dl(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && j(e.requestedRounds);
}
function ml(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function fl(e, t) {
  if (!j(e.startRound) || !j(e.requestedRounds) || !j(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = pl(t);
  return e.startCombatantId && r === e.startCombatantId ? !0 : Tt(e.startTurn) && Tt(t.turn) ? t.turn >= e.startTurn : !1;
}
function pl(e) {
  return re(e.combatant?.id);
}
function ro(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: De(e, "conditionId"),
    requestedRounds: Un(e, "requestedRounds") ?? ge(t.value) ?? ge(t.rounds),
    combatDurationApplied: ot(e, "combatDurationApplied"),
    combatId: De(e, "combatId") ?? re(n.combat) ?? re(t.combat),
    startCombatantId: De(e, "startCombatantId") ?? re(n.combatant),
    startInitiative: kl(e, "startInitiative") ?? ao(n.initiative),
    startRound: Un(e, "startRound") ?? ge(n.round) ?? ge(t.startRound),
    startTurn: Cl(e, "startTurn") ?? bt(n.turn) ?? bt(t.startTurn),
    expiryEvent: Il(e, "expiryEvent") ?? io(t.expiry),
    durationMode: wl(e, "durationMode"),
    deleteOnExpire: ot(e, "deleteOnExpire"),
    expiresWithCombat: ot(e, "expiresWithCombat")
  };
}
function gl(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function hl(e, t) {
  return oo(e, t)[0] ?? null;
}
function oo(e, t) {
  return qt(e).filter((n) => Rl(n) === t);
}
async function xn(e, t) {
  const n = t.id ?? null, r = n ? yl(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (Al(o)) return "missing";
    throw o;
  }
}
function yl(e, t) {
  return qt(e).find((n) => n.id === t) ?? null;
}
function Al(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function bl() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Se(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Se(e, n);
  });
  for (const n of Tl())
    Se(e, n.actor), Se(e, n.document?.actor);
  return Array.from(e.values());
}
function Se(e, t) {
  if (!$l(t)) return;
  const r = re(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Tl() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function qt(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Rl(e) {
  return De(e, "conditionId");
}
function De(e, t) {
  return re(e.getFlag?.(l, t));
}
function Un(e, t) {
  return ge(e.getFlag?.(l, t));
}
function Cl(e, t) {
  return bt(e.getFlag?.(l, t));
}
function kl(e, t) {
  return ao(e.getFlag?.(l, t));
}
function Il(e, t) {
  return io(e.getFlag?.(l, t));
}
function wl(e, t) {
  return e.getFlag?.(l, t) === "sourceTurn" ? "sourceTurn" : "none";
}
function ot(e, t) {
  return e.getFlag?.(l, t) === !0;
}
function re(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ge(e) {
  return j(e) ? Math.trunc(e) : null;
}
function bt(e) {
  return Tt(e) ? Math.trunc(e) : null;
}
function ao(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function io(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function $l(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function _l() {
  return game.combat ?? null;
}
function El() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function j(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Tt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Sl() {
  return game.user?.id ?? null;
}
const Pl = "icons/svg/downgrade.svg", Nl = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function h(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Pl,
    description: Nl,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Ll = h({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Dl = h({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), vl = h({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Ol = h({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Fl = h({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Ml = h({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), xl = h({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Ul = h({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Bl = h({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), jl = h({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), ql = h({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Hl = h({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Vl = h({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Gl = h({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), zl = h({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Wl = h({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Kl = h({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Yl = h({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Ql = h({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Zl = h({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Xl = h({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Jl = h({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), eu = h({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), tu = h({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), nu = h({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), ru = h({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), ou = h({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), au = h({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), iu = h({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), su = h({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), cu = h({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), lu = h({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), uu = h({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), du = h({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), mu = [
  Ll,
  Dl,
  vl,
  Ol,
  Fl,
  Ml,
  xl,
  Ul,
  Bl,
  jl,
  ql,
  Hl,
  Vl,
  Gl,
  zl,
  Wl,
  Kl,
  Yl,
  Ql,
  Zl,
  Xl,
  Jl,
  eu,
  tu,
  nu,
  ru,
  ou,
  au,
  iu,
  su,
  cu,
  lu,
  uu,
  du
];
class fu {
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
    return Array.from(this.definitions.values()).map(Bn);
  }
  get(t) {
    const n = this.lookup.get(jn(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(Bn(r)) : m({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = jn(t);
    r && this.lookup.set(r, n);
  }
}
function pu() {
  return new fu(mu);
}
function Bn(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function jn(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const gu = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", so = `${l}-inline-roll-neutralized`, hu = `${l}-inline-roll-notice`, Ht = `data-${l}-inline-roll-neutralized`, qn = `data-${l}-inline-roll-notice`, yu = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Hn(e) {
  const t = Nu(e.message), n = await Au(e.message), r = bu(t);
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
async function Au(e) {
  const t = Eu(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = Tu(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Su(t, n.content), replacementCount: n.replacementCount };
}
function bu(e) {
  const t = e ? Pu(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = co(t);
  return n > 0 && lo(wu(t)), { replacementCount: n };
}
function Tu(e) {
  const t = Ru(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = co(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (lo(n.content), { content: n.innerHTML, replacementCount: o });
}
function Ru(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, ku(o.trim()))), replacementCount: t };
}
function co(e) {
  const t = Cu(e);
  for (const n of t)
    n.replaceWith(Iu($u(n)));
  return t.length;
}
function Cu(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(gu))
    n.getAttribute(Ht) !== "true" && t.add(n);
  return Array.from(t);
}
function ku(e) {
  return `<span class="${so}" ${Ht}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Lu(e)}</span>`;
}
function Iu(e) {
  const t = document.createElement("span");
  return t.classList.add(so), t.setAttribute(Ht, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function lo(e) {
  if (e.querySelector?.(`[${qn}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(hu), t.setAttribute(qn, "true"), t.textContent = yu, e.append(t);
}
function wu(e) {
  return e.querySelector(".message-content") ?? e;
}
function $u(e) {
  const n = e.getAttribute("data-formula") ?? _u(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function _u(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Eu(e) {
  return e && typeof e == "object" ? e : null;
}
async function Su(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return u.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Pu(e) {
  const t = Du(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Nu(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Lu(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Du(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Vn = "occultism";
function vu(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Ou(e) {
  const t = vu(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await Fu(e, Vn);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Kr(n);
  const r = Uu(n);
  return {
    skill: Vn,
    skillLabel: "Ocultismo",
    roll: n,
    formula: xu(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: Bu(n)
  };
}
async function Fu(e, t) {
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
  return Mu(r);
}
function Mu(e) {
  return Gn(e) ? e : Array.isArray(e) ? e.find(Gn) ?? null : null;
}
function Gn(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function xu(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Uu(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Bu(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(ju);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function ju(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function qu(e) {
  return {
    header: {
      eyebrow: Pt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Wu(e.ritual)
    },
    forms: e.variantOptions.map((t) => Hu(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: zu(e.automationStatus ?? "assisted")
  };
}
function Hu(e, t) {
  const n = Vu(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Gu(t) : "—",
    details: n
  };
}
function Vu(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Gu(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function zu(e) {
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
function Wu(e) {
  const t = e.system, n = [Yu(t?.element), Ku(t?.circle)].filter(Qu);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function Ku(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Yu(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function Qu(e) {
  return typeof e == "string" && e.length > 0;
}
const uo = ["base", "discente", "verdadeiro"];
function mo(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Fe(e) {
  return typeof e == "string" && uo.includes(e);
}
const { ApplicationV2: Zu } = foundry.applications.api;
class he extends Zu {
  constructor(t, n) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = n, this.model = qu(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: he.onCast,
      cancel: he.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new he(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    Ju(o, (a) => {
      this.selectedVariant = a;
    }), ed(o, (a) => {
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
          ${this.model.forms.map(Xu).join("")}
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
    const n = rd(t), r = td(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function Xu(e) {
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
function Ju(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => zn(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), zn(e, o, t));
    });
  const r = fo(e);
  r && t(r);
}
function zn(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Fe(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), fo(e));
}
function fo(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && Fe(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function ed(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function td(e, t, n) {
  const r = nd(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function nd(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Fe(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Fe(n) ? n : null;
}
function rd(e) {
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
async function od(e) {
  return he.request(e);
}
const Vt = {
  label: "Padrão"
}, ad = {
  label: "Discente",
  extraCost: 2
}, id = {
  label: "Verdadeiro",
  extraCost: 5
};
class sd {
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
    const r = this.resolveCostPreview(t), o = jd(n), a = xd(n, t.item, r, o), i = await od({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((_) => _.name),
      cost: r,
      defaultSpendResource: Wd(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const s = cd(i), d = Hd(n, t.item, s.variant, o), p = Pr();
    let A = null;
    if (p) {
      const _ = await ud(this.resources, t.actor, s, d, r);
      if (!_.ok)
        return {
          status: "failed",
          reason: _.reason,
          message: _.message
        };
      try {
        A = await Ou(t.actor);
      } catch (J) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: J instanceof Error ? J.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: J
        };
      }
    }
    const T = ld(n, s, d, r, {
      includeCostSteps: !p
    });
    if (T.steps.length === 0) {
      const _ = qd(t, s), J = Wn(t.actor, A, d, r), en = Yn(n, s, d, r, _, A);
      return J.length > 0 ? {
        status: "ready",
        workflowContext: _,
        actions: J,
        summaryLines: en
      } : {
        status: "completed-without-actions",
        workflowContext: _,
        summaryLines: en
      };
    }
    const k = await this.workflow.runAutomation(T, {
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
    if (!k.ok)
      return {
        status: "failed",
        reason: k.error.reason,
        message: k.error.message,
        cause: k.error
      };
    const C = k.value.context, f = yd(n, t, C), x = md(n, t), ke = Wn(t.actor, A, d, r), ue = Yn(n, s, d, r, C, A);
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
    const X = [...ke, ...f.actions, ...x.actions];
    return X.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: C,
      summaryLines: ue
    } : {
      status: "ready",
      workflowContext: C,
      actions: X,
      summaryLines: ue
    };
  }
  async applyAction(t) {
    return Oe(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function cd(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function ld(e, t, n, r, o) {
  const a = [], i = t.spendResource === !0;
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || Gt(s) && (!o.includeCostSteps || !i) || a.push(dd(s, n));
  return o.includeCostSteps && i && r && Kd(n.extraCost) && a.push({
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
async function ud(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Re(o, r);
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
function dd(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Wn(e, t, n, r) {
  if (!t || t.success) return [];
  const o = Re(r, n);
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
function md(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = go(r.actor, t);
    if (o.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    const a = eo(t.actor);
    for (const i of o)
      n.push(fd(r, i, t.item, a));
  }
  return { ok: !0, actions: n };
}
function fd(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? hd(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: pd(e.duration ?? null, r),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: gd(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function pd(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function gd(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function hd(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function yd(e, t, n) {
  const r = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const a = ve(o, n);
    if (!a.ok)
      return {
        ok: !1,
        reason: a.error.reason,
        message: a.error.message
      };
    const i = go(o.actor, t);
    if (i.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const s of i)
      r.push(...Ad(e, o, s, a.value));
  }
  return { ok: !0, actions: r };
}
function Ad(e, t, n, r) {
  if (!Cd(e, t))
    return [Kn(t, n, r)];
  const o = wd();
  return po(e).map((a) => {
    const i = kd(r, a);
    return Kn(t, n, i, {
      option: a,
      choiceGroupId: o
    });
  });
}
function Kn(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = Rd(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: bd(e, o, n, r?.option),
    executedLabel: Td(e, o, r?.option),
    choiceGroupId: r?.choiceGroupId,
    choiceGroupResolvedLabel: r ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function bd(e, t, n, r) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? r ? `${r.id === "normal" ? "Normal" : r.label}: ${n} PV` : `Dano: ${n} PV` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Td(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? n ? `✓ ${n.id === "normal" ? "dano normal" : n.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Rd(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Cd(e, t) {
  return t.operation === "damage" && t.resource === "PV" && po(e).length > 1;
}
function po(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function kd(e, t) {
  const n = e * t.multiplier, r = Id(n, t.rounding ?? "floor");
  return Math.max(0, r);
}
function Id(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function wd() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function go(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((n) => n.actor ? [n.actor] : []);
  }
}
function Yn(e, t, n, r, o, a = null) {
  return [
    `Forma: ${mo(t.variant)}`,
    _d(t, n, r),
    ...$d(a),
    ...Object.values(o.rolls).flatMap(Ed),
    ...Sd(e.resistance),
    ...Fd(n)
  ];
}
function $d(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function _d(e, t, n) {
  const r = Re(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Ed(e) {
  const n = [`${Md(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = Pd(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${Od(e.damageType)}`), n;
}
function Sd(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function Pd(e) {
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
    const i = Nd(a);
    i && (vd(n, i.operator ?? r, i.value), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Nd(e) {
  const t = Ld(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Dd(e);
}
function Ld(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Dd(e) {
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
function vd(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function Od(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Fd(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Md(e) {
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
function xd(e, t, n, r) {
  return uo.map((o) => {
    const a = ho(e, t, o, r), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? mo(o),
      enabled: i,
      details: a ? Ud(a, n, r) : [],
      finalCostText: a ? Bd(n, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function Ud(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = Re(t, e);
  return r.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), r;
}
function Re(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function Bd(e, t) {
  const n = Re(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function jd(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Gt);
}
function qd(e, t) {
  return Jr({
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
function Hd(e, t, n, r) {
  return ho(e, t, n, r) ?? Vt;
}
function ho(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? Gd(t, n) ? Vd(n) : null : n === "base" ? Vt : null);
}
function Vd(e) {
  switch (e) {
    case "base":
      return Vt;
    case "discente":
      return ad;
    case "verdadeiro":
      return id;
  }
}
function Gd(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return zd(foundry.utils.getProperty(e, n));
}
function zd(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Wd(e) {
  return e.steps.some(Gt);
}
function Gt(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Kd(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Yd(e, t) {
  const n = await Qd(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: Xd(n),
    total: Jd(n),
    diceBreakdown: em(n)
  };
}
function yo(e) {
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
async function Qd(e, t) {
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
  return Zd(r);
}
function Zd(e) {
  return Qn(e) ? e : Array.isArray(e) ? e.find(Qn) ?? null : null;
}
function Qn(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Xd(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Jd(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function em(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(tm);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function tm(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Ao = "itemUsePrompts", bo = "chatCard", Ge = "data-paranormal-toolkit-prompt-id", ze = "data-paranormal-toolkit-pending-id", zt = "data-paranormal-toolkit-executed-label", Rt = "data-paranormal-toolkit-choice-group", To = "data-paranormal-toolkit-skipped-label", Zn = "data-paranormal-toolkit-action-section", Xn = "data-paranormal-toolkit-detail-key", Jn = "data-paranormal-toolkit-roll-card", Wt = "data-paranormal-toolkit-roll-detail-toggle", Ro = "data-paranormal-toolkit-roll-detail-id", Co = "data-paranormal-toolkit-resistance-roll-button", ko = "data-paranormal-toolkit-resistance-skill", Io = "data-paranormal-toolkit-resistance-skill-label", wo = "data-paranormal-toolkit-resistance-target-actor-id", $o = "data-paranormal-toolkit-resistance-target-name", _o = "data-paranormal-toolkit-resistance-roll-result", er = "data-paranormal-toolkit-system-card-replaced", nm = `[${ze}]`, rm = `[${Wt}]`, om = `[${Co}]`, Ct = `${l}-chat-enrichment`, g = `${l}-item-use-prompt`, am = `${g}__actions`, tr = `${g}__details`, Eo = `${g}__summary`, im = `${g}__title`, So = `${g}__button--executed`, nr = `${g}__roll-card`;
let rr = !1, kt = null;
const P = /* @__PURE__ */ new Map(), sm = [0, 100, 500, 1500, 3e3], cm = 3e4, lm = [0, 100, 500, 1500, 3e3];
function um(e) {
  if (kt = e, rr) {
    ar(e);
    return;
  }
  const t = (n, r) => {
    No(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), rr = !0, ar(e);
}
async function or(e) {
  const t = Po(e);
  P.set(e.pendingId, t), await Qt(t) || jo(t), Lo(e.pendingId);
}
async function dm(e) {
  const t = Po({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await Qt(t) || jo(t), Lo(e.pendingId);
}
async function at(e, t) {
  const n = P.get(e);
  P.delete(e), n && await df(n, t);
}
function Kt(e) {
  const t = Wo();
  for (const n of t) {
    const r = M(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function mm(e, t) {
  const n = Kt(e);
  if (!n) return;
  const r = M(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await ce(n.message, r));
}
async function fm(e, t, n) {
  if (!t) return;
  const r = Kt(e);
  if (!r) return;
  const o = M(r.message);
  let a = !1;
  for (const [i, s] of Object.entries(o))
    i !== e && s.choiceGroupId === t && (o[i] = {
      ...s,
      executedLabel: n ?? s.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await ce(r.message, o);
}
function Po(e) {
  const t = H(e.context.message), n = e.context.targets.find((i) => _t(i)), r = n ? _t(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Um(e.context),
    executed: !1
  };
}
function No(e, t, n) {
  uf();
  const r = Ke(t);
  if (!r) return;
  const o = sf(e, r);
  o.length > 0 && Me(r);
  for (const a of o)
    It(r, a);
  Oo(r, n), wt(r), $t(r);
}
function ar(e) {
  for (const t of lm)
    globalThis.setTimeout(() => {
      pm(e);
    }, t);
}
function pm(e) {
  for (const t of gm()) {
    const n = We(t);
    hm(n) && No(n, t, e);
  }
}
function gm() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function hm(e) {
  return e ? Zt(e) ? !0 : ff(e).length > 0 : !1;
}
function Lo(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? cf(t.messageId) : null;
  if (n) {
    ur(n, t), Me(n), It(n, t), ir(n), wt(n), $t(n);
    return;
  }
  if (t.messageId) {
    St(t);
    return;
  }
  const r = lf(t);
  if (r) {
    ur(r, t), Me(r), It(r, t), ir(r), wt(r), $t(r);
    return;
  }
  St(t);
}
function ir(e) {
  kt && Oo(e, kt);
}
function Me(e) {
  const t = ym();
  e.classList.toggle(`${g}--system-card-replaced`, t);
  const n = vo(e);
  if (!n || (n.classList.toggle(`${g}__host--system-card-replaced`, t), !t) || n.getAttribute(er) === "true") return;
  const r = n.querySelector(`.${Ct}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(er, "true");
}
function ym() {
  try {
    return Za() === "replace";
  } catch {
    return !1;
  }
}
function It(e, t) {
  if (Me(e), e.querySelector(`[${Ge}="${le(t.pendingId)}"]`)) return;
  const n = Am(e, t);
  Tm(n, t), vm(n, Om(t)).append(xm(t));
}
function Am(e, t) {
  const n = e.querySelector(`.${Ct}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Ct, g);
  const o = document.createElement("header");
  o.classList.add(`${g}__header`);
  const a = document.createElement("span");
  a.classList.add(`${g}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(im), i.textContent = bm(t);
  const s = document.createElement("span");
  return s.classList.add(Eo), s.textContent = t.summary, o.append(a, i, s), r.append(o), jm(e).append(r), r;
}
function bm(e) {
  const t = $(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Tm(e, t) {
  const n = t.summaryLines ?? [], r = Uo(n, t);
  if (r) {
    Rm(e, r, t);
    return;
  }
  Fm(e, n);
}
function Rm(e, t, n) {
  if (e.querySelector(`[${Jn}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(nr, `${nr}--${t.intent}`), r.setAttribute(Jn, "true"), t.castingCheck && sr(r, km(t.castingCheck), n.pendingId, "casting"), Cm(t) && sr(r, Im(t), n.pendingId, "effect"), Sm(r, t), Pm(r, t, n), Dm(r, t), e.append(r);
}
function Cm(e) {
  return e.intent !== "casting";
}
function km(e) {
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
function Im(e) {
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
function sr(e, t, n, r) {
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
  wm(o, t), Lm(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function wm(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${g}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${g}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = $m(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function $m(e, t) {
  const n = _m(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${g}__workflow-dice-tray`);
  for (const o of Em(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${g}__workflow-die`), o.active || a.classList.add(`${g}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function _m(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Em(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? cr(e, "highest") : n.includes("kl") ? cr(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function cr(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Sm(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Nf);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${g}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function Pm(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${g}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = Nm(t, n);
  o.append(a), i && o.append(i);
  const s = document.createElement("span");
  s.classList.add(`${g}__resistance-description`), s.textContent = t.resistance, r.append(o, s), t.resistanceRollResult && r.append(Do(t.resistanceRollResult)), e.append(r);
}
function Nm(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${g}__resistance-roll-button`), n.setAttribute(Ge, t.pendingId), n.setAttribute(Co, "true"), n.setAttribute(ko, e.resistanceSkill), n.setAttribute(Io, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(wo, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute($o, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${g}__resistance-roll-button--rolled`), n.setAttribute(_o, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${g}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Do(e) {
  const t = document.createElement("span");
  return t.classList.add(`${g}__resistance-roll-result`), t.textContent = Mo(e), t;
}
function Lm(e, t, n, r, o) {
  const a = t.filter((p) => p.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${n}-roll-details-${r}`, s = document.createElement("button");
  s.type = "button", s.classList.add(`${g}__roll-detail-toggle`), s.setAttribute(Wt, i), s.setAttribute("aria-expanded", "false"), s.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${g}__roll-detail-list`), d.setAttribute(Ro, i), d.hidden = !0;
  for (const p of a) {
    const A = document.createElement("dt");
    A.textContent = p.label;
    const T = document.createElement("dd");
    T.textContent = p.value, d.append(A, T);
  }
  e.append(s, d);
}
function Dm(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function vm(e, t) {
  const n = `[${Zn}="${le(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(am), o.setAttribute(Zn, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${g}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function Om(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = Uo(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Fm(e, t) {
  if (t.length === 0) return;
  const n = Mm(e);
  for (const r of t) {
    const o = Lf(r);
    if (n.querySelector(`[${Xn}="${le(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(Xn, o), n.append(a);
  }
}
function Mm(e) {
  const t = e.querySelector(`.${tr}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(tr), e.append(n), n;
}
function xm(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${g}__button`), t.setAttribute(Ge, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(So), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(ze, e.pendingId), t.setAttribute(zt, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Rt, e.choiceGroupId), t.setAttribute(To, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Um(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Bm(e);
  return `${t} → ${n}`;
}
function Bm(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function jm(e) {
  return vo(e) ?? e;
}
function vo(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Oo(e, t) {
  const n = Ke(e);
  if (!n) return;
  const r = n.querySelectorAll(nm);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      tf(o, t);
    }));
}
function wt(e) {
  const t = Ke(e);
  if (!t) return;
  const n = t.querySelectorAll(rm);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      qm(t, r);
    }));
}
function $t(e) {
  const t = Ke(e);
  if (!t) return;
  const n = t.querySelectorAll(om);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Hm(t, r);
    }));
}
function qm(e, t) {
  const n = t.getAttribute(Wt);
  if (!n) return;
  const r = e.querySelector(`[${Ro}="${le(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Hm(e, t) {
  const n = t.getAttribute(Ge), r = t.getAttribute(ko), o = t.getAttribute(Io) ?? (r ? yo(r) : "Resistência");
  if (!n || !r) return;
  const a = zm(e, n), i = Wm(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const s = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Yd(i, r);
    await Xm(d.roll);
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
    Vm(t, p), Gm(t, p), Jm(n, p), await ef(e, n, p);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1;
  }
}
function Vm(e, t) {
  e.classList.add(`${g}__resistance-roll-button--rolled`), e.setAttribute(_o, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Gm(e, t) {
  const n = e.closest(`.${g}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${g}__resistance-roll-result`), o = r ?? Do(t);
  if (r) {
    r.textContent = Mo(t);
    return;
  }
  n.append(o);
}
function zm(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = We(e);
  return M(r)[t] ?? null;
}
function Wm(e, t) {
  const n = e?.resistanceTargetActor;
  if (v(n)) return n;
  const o = e?.context?.targets.map(_t).find(v) ?? null;
  if (o) return o;
  const a = t.getAttribute(wo) ?? e?.resistanceTargetActorId ?? null, i = a ? Ym(a) : null;
  return i || Qm(
    t.getAttribute($o) ?? e?.resistanceTargetName ?? Km(t)
  );
}
function Km(e) {
  const n = e.closest(`.${g}`)?.querySelector(`.${Eo}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function _t(e) {
  const t = e.actor;
  if (v(t)) return t;
  const n = e.token, r = Ae(n);
  if (r) return r;
  const o = e.document;
  return Ae(o);
}
function Ae(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (v(t)) return t;
  const n = e.document?.actor;
  return v(n) ? n : null;
}
function Ym(e) {
  const n = game.actors?.get?.(e);
  return v(n) ? n : Fo().map((a) => Ae(a)).find((a) => a?.id === e) ?? null;
}
function Qm(e) {
  const t = oe(e);
  if (!t) return null;
  const n = Fo().filter((a) => oe(Zm(a)) === t).map((a) => Ae(a)).find(v) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => v(a) && oe(a.name) === t);
  return v(o) ? o : null;
}
function Fo() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Zm(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ae(e)?.name ?? null;
}
function oe(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function v(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Mo(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Xm(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Jm(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function ef(e, t, n) {
  const r = We(e);
  if (r)
    try {
      const o = M(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await ce(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function We(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return F(r?.get?.(n));
}
async function tf(e, t) {
  const n = e.getAttribute(ze);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    xo(e, e.getAttribute(zt) ?? "✓ Automação aplicada"), nf(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function xo(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(So), e.removeAttribute(ze), e.removeAttribute(zt);
}
function nf(e) {
  const t = e.getAttribute(Rt);
  if (!t) return;
  const n = e.closest(`.${g}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Rt}="${le(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(To) ?? "✓ Outra opção escolhida";
    xo(o, a);
  }
}
function Uo(e, t) {
  const n = e.map(Yt).filter(Sf), r = n.find((f) => f.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = $(e, "Forma"), a = $(e, "Custo"), i = $(e, "Dados") ?? $(e, `Dados (${r.label})`), s = $(e, "Tipo"), d = $(e, "Resistência"), p = $(e, "Resistência Perícia"), A = $(e, "Resistência Rótulo") ?? (p ? yo(p) : null), T = Bo(e, "Observação"), k = e.filter((f) => af(f, r)), C = rf(e);
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
    notes: T,
    details: k,
    castingCheck: C,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function rf(e) {
  const t = e.map(Yt).find((a) => a?.intent === "casting") ?? null, n = $(e, "Conjuração DT"), r = $(e, "Conjuração Resultado");
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
function Yt(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: of(n)
  } : null;
}
function of(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function $(e, t) {
  return Bo(e, t)[0] ?? null;
}
function Bo(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function af(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Yt(e) ? !1 : e.trim().length > 0;
}
function sf(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    Et(r, e, t) && n.set(r.pendingId, r);
  for (const r of mf(e))
    Et(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Et(e, t, n) {
  const r = H(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !lr(n, "itemId", e.itemId) ? !1 : !e.actorId || lr(n, "actorId", e.actorId);
}
function lr(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${Df(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function cf(e) {
  const t = le(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function lf(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Et(e, null, t))
      return t;
  return null;
}
function uf() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function ur(e, t) {
  const n = We(e);
  if (!n) return !1;
  try {
    const r = M(n);
    return r[t.pendingId] = Xt(t, H(n)), await ce(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Qt(e) {
  const t = Vo(e);
  if (!t) return !1;
  try {
    const n = M(t);
    return n[e.pendingId] = Xt(e, H(t)), await ce(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function jo(e) {
  for (const t of sm)
    globalThis.setTimeout(() => {
      St(e);
    }, t);
}
async function St(e) {
  const t = Vo(e);
  if (Zt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await Qt(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function df(e, t) {
  const n = Ho(e.context.message);
  if (n)
    try {
      const r = M(n), o = r[e.pendingId] ?? Xt(e, H(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await ce(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function mf(e) {
  return Object.values(M(F(e))).filter(Ce);
}
function M(e) {
  if (!e) return {};
  const t = {}, n = Zt(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(qo(e)))
    t[r] ??= o;
  return t;
}
function ff(e) {
  return Object.values(qo(F(e))).filter(Ce);
}
function qo(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, Ao);
  if (!ae(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Ce(o) && (n[r] = o);
  return n;
}
async function ce(e, t) {
  typeof e.setFlag == "function" && (await gf(e, t), await pf(e, t));
}
async function pf(e, t) {
  await Promise.resolve(e.setFlag?.(l, Ao, t));
}
function Zt(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, bo);
  return _f(t) ? t : null;
}
async function gf(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Ce).sort((a, i) => a.createdAt - i.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((a) => a.createdAt)),
    messageId: r.messageId ?? H(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: hf(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(l, bo, o));
}
function hf(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Xt(e, t) {
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
function Ho(e) {
  const t = F(e);
  if (t?.setFlag)
    return t;
  const n = yf(e);
  if (n?.setFlag)
    return n;
  const r = H(e);
  if (!r) return null;
  const o = game.messages;
  return F(o?.get?.(r));
}
function yf(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(F).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Vo(e) {
  const t = Ho(e.context.message);
  if (t) return t;
  const n = e.messageId ? Af(e.messageId) : null;
  if (n) return n;
  const r = Wo().slice().reverse();
  return r.find((o) => bf(o, e)) ?? r.find((o) => Tf(o, e)) ?? null;
}
function Af(e) {
  const t = game.messages;
  return F(t?.get?.(e));
}
function bf(e, t) {
  const n = H(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Go(e, t)) return !1;
  const o = zo(e);
  return !t.actorId || !o || o === t.actorId;
}
function Tf(e, t) {
  if (!Cf(e, t)) return !1;
  const n = zo(e);
  return t.actorId && n === t.actorId ? !0 : Go(e, t);
}
function Go(e, t) {
  const n = oe(Rf(e));
  if (!n) return !1;
  const r = oe(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = oe(t.itemId);
  return !!(o && n.includes(o));
}
function Rf(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function zo(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Cf(e, t) {
  const n = kf(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= cm;
}
function kf(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function F(e) {
  return e && typeof e == "object" ? e : null;
}
function Ce(e) {
  return ae(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && E(e.messageId) && E(e.itemId) && E(e.actorId) && E(e.itemName) && K(e.resistanceTargetActorId) && K(e.resistanceTargetName) && Ef(e.resistanceRollResult) && If(e.actionPayload) && it(e.title) && it(e.buttonLabel) && it(e.executedLabel) && K(e.choiceGroupId) && K(e.skippedLabel) && K(e.actionSectionId) && K(e.actionSectionTitle) && Pf(e.summaryLines) : !1;
}
function If(e) {
  return e == null ? !0 : ae(e) ? e.kind === "resource-operation" && E(e.actorId) && E(e.actorUuid) && typeof e.actorName == "string" && wf(e.resource) && $f(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function wf(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function $f(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function _f(e) {
  return ae(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && E(e.messageId) && ae(e.source) && E(e.source.actorId) && E(e.source.actorName) && E(e.source.itemId) && E(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Ce) : !1;
}
function Ef(e) {
  return e == null ? !0 : ae(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && K(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Sf(e) {
  return e !== null;
}
function ae(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function E(e) {
  return e === null || typeof e == "string";
}
function it(e) {
  return e === void 0 || typeof e == "string";
}
function K(e) {
  return e == null || typeof e == "string";
}
function Pf(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Nf(e) {
  return typeof e == "string" && e.length > 0;
}
function Wo() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(F).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(F).filter((r) => r !== null) : [];
}
function Ke(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function H(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function Lf(e) {
  return e.trim().toLowerCase();
}
function Df(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function le(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const dr = 1e3;
class vf {
  constructor(t, n, r, o, a) {
    this.workflow = t, this.resources = n, this.conditions = o, this.debugOutput = a, this.ritualAssistant = new sd(t, n, r);
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
      settings: cn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = cn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Nt(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && Of(t.item) && n.executionMode === "ask") {
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
    if (await Hn(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: ct(t, "failed", "missing-actor")
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
    return n ? n.kind === "workflow" ? (this.pendingExecutions.delete(t), await at(t), await this.executeAutomation(n.context, n.definition, n.mode), !0) : await this.executeAssistedAction(n.action, n.workflowContext) ? (this.pendingExecutions.delete(t), await at(t), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1 : this.executePersistedPendingAutomation(t);
  }
  async executePersistedPendingAutomation(t) {
    const n = Kt(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const r = n.prompt.actionPayload, o = xf(r);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`), !1;
    const a = await Oe(this.resources, o, r.resource, r.operation, r.amount);
    return a.ok ? (await mm(t), await fm(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (um((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, n) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await Hn(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: ct(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, Ff(t.item));
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
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), u.info("Ritual assistido concluído sem ações pendentes.", Z(r.workflowContext));
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
      a.kind === "assisted-action" && a.action.kind === "resource-operation" && (this.pendingExecutions.delete(o), await at(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = lt();
    await dm({
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
      const s = lt();
      a ??= s, this.pendingExecutions.set(s, {
        kind: "assisted-action",
        id: s,
        action: i,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await or({
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
        actionPayload: Mf(i)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), u.info("Ritual assistido preparado com ações pendentes.", Z(n));
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = lt();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await or({
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
    this.setAttempt(t, "completed"), u.info("Automação executada por uso normal de item.", Z(o.value.context));
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
    const n = Date.now(), r = mr(t);
    for (const [a, i] of this.recentExecutionKeys.entries())
      n - i > dr && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= dr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(mr(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = ct(t, n, r, o);
  }
}
function Of(e) {
  return e.type === "ritual";
}
function Ff(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Mf(e) {
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
function xf(e) {
  const t = e.actorUuid ? Uf(e.actorUuid) : null;
  if (ie(t)) return t;
  const n = e.actorId ? Bf(e.actorId) : null;
  return n || jf(e.actorName);
}
function Uf(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Bf(e) {
  const n = game.actors?.get?.(e);
  if (ie(n)) return n;
  for (const r of Ko()) {
    const o = Jt(r);
    if (o?.id === e) return o;
  }
  return null;
}
function jf(e) {
  const t = st(e);
  if (!t) return null;
  for (const o of Ko()) {
    const a = qf(o);
    if (st(a) === t) {
      const i = Jt(o);
      if (i) return i;
    }
  }
  const r = game.actors?.find?.((o) => ie(o) && st(o.name) === t);
  return ie(r) ? r : null;
}
function Ko() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function qf(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Jt(e)?.name ?? null;
}
function Jt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ie(t)) return t;
  const n = e.document?.actor;
  return ie(n) ? n : null;
}
function st(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ie(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ct(e, t, n, r) {
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
function mr(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function lt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Hf {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = Te(t);
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
class Vf {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Te(t).map((s) => this.analyzeRitual(s)), r = n.filter(Pe("upToDate")), o = n.filter(Pe("available")), a = n.filter(Pe("outdated")), i = n.filter(Pe("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = Gf(t);
    return n ? r ? r.source.type !== "preset" ? de({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? de({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : de({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: zf(r, n.preset)
    }) : de({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : de({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function de(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? Be(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function Gf(e) {
  const t = e.getFlag(l, "automation");
  return Lt(t) ? t : null;
}
function zf(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Pe(e) {
  return (t) => t.status === e;
}
class Wf {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = vt(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), o = Z(t);
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
    const n = b(t.actorName), r = b(t.resource), o = b(fr(t)), a = b(Yf(t));
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
      (f) => `<li><strong>${b(f.id)}:</strong> ${b(f.formula)} = ${f.total} <em>(${b(Kf(f.intent))})</em>${f.damageType ? ` — ${b(f.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (f) => `<li><strong>${b(f.itemName)}:</strong> ${f.circle}º círculo — ${f.amount} ${b(f.resource)} (${b(Qf(f.source))})</li>`
    ), A = t.damageInstances.map(
      (f) => `<li><strong>${b(f.targetActorName)}:</strong> bruto ${f.rawAmount}${f.damageType ? ` ${b(f.damageType)}` : ""} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), T = t.healingInstances.map(
      (f) => `<li><strong>${b(f.targetActorName)}:</strong> bruto ${f.rawAmount} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), k = t.resourceTransactions.map(
      (f) => `<li><strong>${b(f.actorName)}:</strong> ${b(fr(f))} — ${f.before.value}/${f.before.max} &rarr; ${f.after.value}/${f.after.max}</li>`
    ), C = t.phases.map((f) => b(f)).join(" &rarr; ");
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
          ${T.length > 0 ? `<p><strong>Cura:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${k.join("")}</ul>` : ""}
          ${C.length > 0 ? `<p class="${l}-workflow-card__phases"><strong>Fases:</strong> ${C}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Kf(e) {
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
function fr(e) {
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
function Yf(e) {
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
function Qf(e) {
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
function Zf() {
  const e = new Qs(), t = new Vc(e), n = new Js(), r = new nc(n), o = new hc(e), a = new Ac(), i = a.registerMany(Pa());
  if (!i.ok)
    throw new Error(i.error.message);
  const s = new yc(), d = new pc(), p = pu(), A = new il(p), T = new Vf(a), k = new Hf(T, s, d), C = new Kc(), f = new Wf(C), x = new Wc(), ke = new qc(t, r, f, x), ue = new zc(ke, x), X = new vf(ue, t, r, A, C);
  return X.addStrategy(new mc((_) => X.handleItemUsed(_))), {
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
    debugOutput: C,
    chatMessages: f,
    workflowHooks: x,
    automation: ke,
    workflow: ue,
    itemUseIntegration: X,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: k
  };
}
const { ApplicationV2: Xf } = foundry.applications.api;
class xe extends Xf {
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
      apply: xe.onApply,
      cancel: xe.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${N(Pt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${N(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${ut("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${ut("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${ut("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function ut(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${N(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Jf(n) : tp(t)}
    </section>
  `;
}
function Jf(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(ep).join("")}</ol>`;
}
function ep(e) {
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
function tp(e) {
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
const Ue = `${l}.manageRitualPresets`, pr = `__${l}_ritualPresetHeaderControlRegistered`, np = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function rp(e) {
  const t = globalThis;
  if (!t[pr]) {
    for (const n of np)
      Hooks.on(n, (r, o) => {
        op(r, o, e);
      });
    t[pr] = !0, u.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function op(e, t, n) {
  Array.isArray(t) && ip(e) && (ap(e, n), !t.some((r) => r.action === Ue) && t.push({
    action: Ue,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Yo(e, n);
    }
  }));
}
function ap(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Ue] && (e.options.actions[Ue] = (n) => {
    n.preventDefault(), n.stopPropagation(), Yo(e, t);
  }));
}
function ip(e) {
  if (!game.user?.isGM) return !1;
  const t = Qo(e);
  return t ? t.type === "agent" && Te(t).length > 0 : !1;
}
function Yo(e, t) {
  const n = Qo(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new xe(n, t).render({ force: !0 });
}
function Qo(e) {
  return gr(e.actor) ? e.actor : gr(e.document) ? e.document : null;
}
function gr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let Q = null;
Hooks.once("init", () => {
  _a(), Qa(), Pi(), Ys(), u.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!dn.isSupportedSystem()) {
    u.warn(
      `Sistema não suportado: ${dn.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Q = Zf(), Q.itemUseIntegration.registerStrategies(), $i(Q.conditions), ci(Q), Ti(), hi(), rp(Q), u.info("Inicializado para o sistema Ordem Paranormal."), u.info(`API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Pt} inicializado.`);
});
function sp() {
  if (!Q)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Q;
}
export {
  sp as getToolkitServices
};
//# sourceMappingURL=main.js.map
