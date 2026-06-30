const u = "paranormal-toolkit", Nt = "Paranormal Toolkit", Qo = "ordemparanormal";
class Te {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function qe(e) {
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
class l {
  static info(t, ...n) {
    console.log(`${u} | ${t}`, ...n);
  }
  static warn(t, ...n) {
    console.warn(`${u} | ${t}`, ...n);
  }
  static error(t, ...n) {
    console.error(`${u} | ${t}`, ...n);
  }
}
function y(e) {
  return { ok: !0, value: e };
}
function m(e) {
  return { ok: !1, error: e };
}
function Lt(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? m({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Dt(t) ? y(t.definition) : m({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Zo(e) {
  return Dt(e.getFlag(u, "automation"));
}
function Dt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Jo(t.source) && Xo(t.definition);
}
function Xo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(ea) && (t.conditionApplications === void 0 || ia(t.conditionApplications));
}
function Jo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function ea(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return ta(t);
    case "spendRitualCost":
      return na(t);
    case "rollFormula":
      return ra(t);
    case "modifyResource":
      return oa(t);
    case "chatCard":
      return aa(t);
    default:
      return !1;
  }
}
function ta(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && hr(t);
}
function na(e) {
  return e.type === "spendRitualCost";
}
function ra(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || ma(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function oa(e) {
  const t = e;
  return t.type === "modifyResource" && yr(t.actor) && ua(t.resource) && da(t.operation) && hr(t);
}
function aa(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function ia(e) {
  return Array.isArray(e) && e.every(sa);
}
function sa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && yr(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || ca(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel));
}
function ca(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || fa(t.rounds)) && (t.expiry === void 0 || t.expiry === null || la(t.expiry));
}
function la(e) {
  return e === "turnStart" || e === "turnEnd";
}
function hr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function yr(e) {
  return e === "self" || e === "target";
}
function ua(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function da(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function ma(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function fa(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function vt(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(nn);
    if (ha(t))
      return Array.from(t).filter(nn);
  }
  return [];
}
function pa(e) {
  return vt(e)[0] ?? null;
}
function ga(e) {
  return vt(e).find(Zo) ?? null;
}
function ha(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function nn(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Re(e) {
  return vt(e).filter((t) => t.type === "ritual");
}
function Ar(e) {
  return Re(e)[0] ?? null;
}
function ya(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(qe);
      return l.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = fe("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = we(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(an);
      return l.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = fe("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = we(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await ft(e, r, o.value);
      l.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = fe("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = we(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        l.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await ft(e, n, r.preset);
      l.info(`Melhor preset aplicado em ${n.name}.`, { match: an(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return rn(e);
    },
    async applyBestPresetsToActorRituals() {
      return rn(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = fe("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = we(t);
      n && (await e.automationBinder.clear(n), l.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function rn(e) {
  const t = fe("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Re(t);
  if (n.length === 0)
    return l.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), on(t);
  const r = on(t, n.length);
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
    const i = await ft(e, o, a.preset);
    r.applied.push(Aa(o, a, i));
  }
  return l.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), ba(r), r;
}
async function ft(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Aa(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: qe(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function on(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function ba(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function an(e) {
  return {
    preset: qe(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function fe(e) {
  const t = Te.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function we(e) {
  const t = Ar(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Z(e) {
  return e ? {
    id: e.id,
    source: {
      ...Ta(e.sourceActor),
      token: e.sourceToken
    },
    item: Ra(e.item),
    targets: e.targets.map(Ca),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: sn(e.rollRequests, br),
    rolls: sn(e.rolls, ka),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Ot),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Ot(e) {
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
function Ta(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Ra(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Ca(e) {
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
function ka(e) {
  return {
    ...br(e),
    total: e.total
  };
}
function sn(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function Ia(e) {
  return {
    getSelected() {
      return Te.getSelectedActor();
    },
    logResources() {
      const t = V(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      l.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && l.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await te(
        e,
        "Gasto de PE",
        V("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await te(
        e,
        "Gasto de PD",
        V("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await te(
        e,
        "Dano em PV",
        V("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await te(
        e,
        "Cura de PV",
        V("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await te(
        e,
        "Dano em SAN",
        V("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await te(
        e,
        "Recuperação de SAN",
        V("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function te(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    wa(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (i) {
    l.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  l.info(`${t} realizado:`, Ot(a));
}
function V(e) {
  const t = Te.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function wa(e) {
  if (e.reason === "update-failed") {
    l.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    l.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  l.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const D = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function $a() {
  $e(D.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), $e(D.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), $e(D.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), $e(D.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function pt() {
  return {
    enabled: _e(D.enabled),
    console: _e(D.console),
    ui: _e(D.ui),
    chat: _e(D.chat)
  };
}
async function B(e, t) {
  await game.settings.set(u, D[e], t);
}
function $e(e, t) {
  game.settings.register(u, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function _e(e) {
  return game.settings.get(u, e) === !0;
}
function _a() {
  return {
    status() {
      return pt();
    },
    async enable() {
      await B("enabled", !0);
    },
    async disable() {
      await B("enabled", !1);
    },
    async enableConsole() {
      await B("console", !0);
    },
    async disableConsole() {
      await B("console", !1);
    },
    async enableUi() {
      await B("ui", !0);
    },
    async disableUi() {
      await B("ui", !1);
    },
    async enableChat() {
      await B("chat", !0);
    },
    async disableChat() {
      await B("chat", !1);
    }
  };
}
const Tr = "ritual.costOnly", Rr = "ritual.simpleHealing", Ea = "ritual.eletrocussao", Cr = "ritual.simpleDamage", kr = "generic.simpleHealing", Ir = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Sa() {
  return [
    Pa(),
    Na(),
    La(),
    Da(),
    va()
  ];
}
function Pa() {
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
function Na() {
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
function La() {
  return {
    id: Ea,
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
    automation: Oa(),
    itemPatch: Fa()
  };
}
function Da() {
  return {
    id: Cr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Mt()
  };
}
function va() {
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
function Oa() {
  return {
    ...Mt("3d6", {
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
function Mt(e = "1d8", t = {}) {
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
function Fa() {
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
    tokenId: ne(t.id),
    actorId: ne(t.actor?.id),
    sceneId: ne(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function _r() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: ne(e.id),
    actorId: ne(t?.id),
    sceneId: ne(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ne(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function xa(e) {
  return {
    logFirstRitualCost() {
      const t = G("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = z(t);
      if (!n) return;
      const r = e.ritualCosts.getCost({ actor: t, ritual: n });
      if (!r.ok) {
        l.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      l.info("Custo do primeiro ritual:", {
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
        if (!ja(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(u, "ritual.cost", {
          resource: n,
          amount: t
        }), l.info(`Custo customizado aplicado em ${o.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = G("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = z(t);
      n && (await n.unsetFlag(u, "ritual.cost"), l.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = G("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = z(t);
      if (!n) return;
      const r = e.automationRegistry.require(Tr);
      if (!r.ok) {
        l.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), l.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = G("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = z(n);
      if (!r) return;
      if (!cn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Rr);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: wr(t)
      }), l.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = G("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = z(n);
      if (!r) return;
      if (!cn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Cr);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Mt(t)
      }), l.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = G("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = z(t);
      n && await Ua(e, t, n);
    }
  };
}
async function Ua(e, t, n) {
  const r = Lt(n);
  if (!r.ok) {
    l.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: _r(),
    item: n,
    targets: Ft()
  });
  if (!o.ok) {
    Ba(o.error);
    return;
  }
  l.info("Automação de ritual executada com sucesso.", Z(o.value.context));
}
function Ba(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    l.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    l.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  l.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function G(e) {
  const t = Te.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function z(e) {
  const t = Ar(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ja(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function cn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const qa = ["disabled", "ask", "automatic"], Ha = ["buttons", "confirm"], Er = "ask";
function Va(e) {
  return typeof e == "string" && qa.includes(e);
}
function Ga(e) {
  return typeof e == "string" && Ha.includes(e);
}
function za(e) {
  return Va(e) ? e : Ga(e) ? "ask" : Er;
}
const Wa = ["keep", "replace"], Sr = "keep", Ka = !0, v = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Ya() {
  game.settings.register(u, v.executionMode, {
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
  }), game.settings.register(u, v.systemCardMode, {
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
  }), game.settings.register(u, v.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Ka
  }), game.settings.register(u, v.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function ln() {
  const e = za(game.settings.get(u, v.executionMode)), t = Nr(game.settings.get(u, v.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: Pr()
  };
}
function Qa() {
  return Nr(game.settings.get(u, v.systemCardMode));
}
function Pr() {
  return game.settings.get(u, v.ritualCastingCheckEnabled) === !0;
}
async function W(e) {
  await game.settings.set(u, v.executionMode, e);
}
function Nr(e) {
  return Wa.includes(e) ? e : Sr;
}
function Za(e) {
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
const Xa = [
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
function Ja(e) {
  return {
    phases() {
      return Xa;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Ze("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = ga(t);
      if (!n) {
        l.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await un(e, t, n);
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
      if (!ni(n)) {
        l.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = ti(n) ?? Ze("Nenhum ator encontrado para executar automação do item.");
      r && await un(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Ze("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = pa(t);
      if (!n) {
        l.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(kr);
        if (!r.ok) {
          l.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(n, r.value), l.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (r) {
        l.error("Falha ao configurar automação de teste no item.", r), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function un(e, t, n) {
  const r = Lt(n);
  if (!r.ok) {
    l.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: _r(),
    item: n,
    targets: Ft()
  });
  if (!o.ok) {
    ei(o.error);
    return;
  }
  l.info("Automação executada com sucesso.", Z(o.value.context));
}
function ei(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    l.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    l.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  l.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Ze(e) {
  const t = Te.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ti(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ni(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ri(e) {
  const t = Ia(e), n = ya(e), r = xa(e), o = Ja(e), a = _a(), i = Za(e);
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
function oi(e) {
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
      const r = dn();
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
      return ai(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = dn();
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
      return ii(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function dn() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function ai(e) {
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
function ii(e) {
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
function si(e) {
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
    conditions: oi(e.conditions),
    debug: ri(e)
  }, n = globalThis;
  return n[u] = t, n.ParanormalToolkit = t, t;
}
class mn {
  static isSupportedSystem() {
    return game.system.id === Qo;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function ci() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: re(t.id),
    actorId: re(t.actor?.id),
    sceneId: re(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Lr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: re(e.id),
    actorId: re(t?.id),
    sceneId: re(e.scene?.id),
    name: n
  };
}
function li(e, t = Lr()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function di(e) {
  if (!pi(e)) return null;
  const t = e.getFlag(u, "workflow");
  return fi(t) ? t : null;
}
function mi() {
  return `flags.${u}.workflow`;
}
function fn(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), n = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || n !== void 0;
}
function pn(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return gt(t) || gt(n);
}
function fi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function pi(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function re(e) {
  return gt(e) ? e : null;
}
function gt(e) {
  return typeof e == "string" && e.length > 0;
}
function gi() {
  const e = (t, n) => {
    hi(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function hi(e, t) {
  const n = di(e);
  if (!n || n.targets.length === 0) return;
  const r = Ai(t);
  if (!r || r.querySelector(`.${u}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(yi(n));
}
function yi(e) {
  const t = document.createElement("section");
  t.classList.add(`${u}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(gn("Origem", e.source.name)), t.append(gn("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function gn(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${u}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function Ai(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function bi() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!Ti(r) || !Ri(e) || fn(e) || fn(t)) return;
    const o = ci();
    if (o.length === 0 || !pn(e) && !pn(t)) return;
    const a = Lr();
    e.updateSource({
      [mi()]: li(o, a)
    }), l.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Ti(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Ri(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let hn = !1, Xe = !1, Je = !1, Ee = null;
const Ci = 1e3, ki = 750, Ii = 1e3;
function wi(e) {
  hn || (Hooks.on("combatTurnChange", (t) => {
    _i(e, yn(t));
  }), Hooks.on("deleteCombat", (t) => {
    Ei(e, yn(t));
  }), hn = !0, $i(e));
}
function $i(e) {
  He() && (Xe || (Xe = !0, globalThis.setTimeout(() => {
    Xe = !1, xt(e, "ready");
  }, Ci)));
}
function _i(e, t) {
  He() && t && (Ee && globalThis.clearTimeout(Ee), Ee = globalThis.setTimeout(() => {
    Ee = null, xt(e, "combat-turn-change", t);
  }, ki));
}
function Ei(e, t) {
  He() && t && (Je || (Je = !0, globalThis.setTimeout(() => {
    Je = !1, xt(e, "combat-deleted", t);
  }, Ii)));
}
async function xt(e, t, n) {
  if (He())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && l.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const o of r.failures)
        l.warn(o.message);
    } catch (r) {
      l.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function He() {
  return game.user?.isGM === !0;
}
function yn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Dr = {
  enabled: "dice.animations.enabled"
};
function Si() {
  game.settings.register(u, Dr.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Pi() {
  return {
    enabled: game.settings.get(u, Dr.enabled) === !0
  };
}
const Ni = "chatCard", An = "data-paranormal-toolkit-prompt-id", c = `${u}-item-use-prompt`, Li = `.${c}__title`, vr = `.${c}__header`, Di = `.${c}__roll-card`, vi = `.${c}__roll-meta`, Oi = `.${c}__roll-meta-pill`, Mi = `.${c}__resistance`, Fi = `.${c}__resistance-header`, Or = `.${c}__resistance-description`, xi = `.${c}__resistance-roll-button`, Ui = `.${c}__resistance-roll-result`, bn = `${c}__resistance-content`, Mr = `.${c}__workflow-section`, Fr = `.${c}__workflow-roll`, xr = `${c}__workflow-roll--dice-open`, Ur = `.${c}__workflow-roll-formula`, Br = `${c}__workflow-roll-formula--toggle`, Ut = `.${c}__workflow-dice-tray`, Bi = `.${c}__roll-detail-toggle`, ji = `.${c}__roll-detail-list`, qi = `.${c}__ritual-element-badge`, Hi = `.${c}__ritual-metadata`, Vi = "casting-backlash", Gi = "data-paranormal-toolkit-action-section", zi = "data-paranormal-toolkit-prompt-id", Wi = "data-paranormal-toolkit-pending-id", Tn = "data-paranormal-toolkit-casting-backlash-enhanced", Rn = `.${c}`, Ki = `.${c}__workflow-section--casting`, Yi = `.${c}__workflow-section-header`, Qi = `.${c}__workflow-notes`, Zi = `[${Gi}="${Vi}"]`, Cn = `${c}__workflow-section-title-row`, Xi = `${c}__workflow-section-header--casting-backlash`, jr = `${c}__casting-backlash-button`;
function Ji(e) {
  for (const t of es(e))
    ts(t), is(t);
}
function es(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Rn) && t.add(e);
  for (const n of e.querySelectorAll(Rn))
    t.add(n);
  return Array.from(t);
}
function ts(e) {
  const t = e.querySelector(Zi);
  if (!t) return;
  const n = ns(t);
  if (!n) return;
  const r = e.querySelector(`${Ki} ${Yi}`);
  r && (r.classList.add(Xi), rs(r), os(n), r.append(n), t.remove());
}
function ns(e) {
  return e.querySelector(
    `button[${Wi}], button[${zi}]`
  );
}
function rs(e) {
  const t = e.querySelector(`:scope > .${Cn}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Cn);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(jr) || n.append(o));
  return n;
}
function os(e) {
  if (e.getAttribute(Tn) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = as(t, e.disabled);
  e.classList.add(jr), e.setAttribute(Tn, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function as(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function is(e) {
  for (const t of e.querySelectorAll(Qi)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function ss(e) {
  for (const t of Array.from(e.querySelectorAll(Mr)))
    for (const n of Array.from(t.querySelectorAll(`${Bi}, ${ji}`)))
      n.remove();
}
function cs(e) {
  for (const t of Array.from(e.querySelectorAll(Mi)))
    ls(t);
}
function ls(e) {
  const t = e.querySelector(Fi), n = e.querySelector(Or), r = e.querySelector(xi), o = e.querySelector(Ui);
  if (!r || !t && !n && !o) return;
  const a = us(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && o.parentElement !== a && !r.contains(o) && a.append(o), r.parentElement !== e && e.append(r);
}
function us(e, t) {
  const n = e.querySelector(`.${bn}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(bn), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function kn(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Bt() {
  const e = globalThis.game;
  return Ve(e) ? e : null;
}
function S(e, t) {
  const n = ds(e, t);
  return Le(n);
}
function ds(e, t) {
  return t.split(".").reduce((n, r) => Ve(n) ? n[r] : null, e);
}
function ms(e, t) {
  const n = e.indexOf(":");
  return n < 0 || Ae(e.slice(0, n)) !== Ae(t) ? null : ce(e.slice(n + 1));
}
function Le(e) {
  return typeof e == "string" ? ce(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Ve(e) {
  return !!e && typeof e == "object";
}
function fs(e) {
  return typeof e == "string";
}
function Ge(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function ce(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function Ae(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function ht(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function q(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function qr(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function ps(e) {
  for (const t of Array.from(e.querySelectorAll(Di))) {
    const n = Rs(t);
    gs(t), n && (hs(t, n), ys(t, n));
  }
}
function gs(e) {
  for (const t of Array.from(e.querySelectorAll(vi)))
    t.remove();
}
function hs(e, t) {
  const r = e.closest(`.${c}`)?.querySelector(vr) ?? null, o = r?.querySelector(Li) ?? null, a = r ?? e, i = a.querySelector(qi);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const s = i ?? document.createElement("span");
  if (s.className = xs(t.elementTone), s.textContent = Fs(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", s);
      return;
    }
    a.prepend(s);
  }
}
function ys(e, t) {
  const n = As(e);
  bs(e, n);
  const r = Ts(t);
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
  const a = e.querySelector(Mr);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function As(e) {
  return e.closest(`.${c}`)?.querySelector(vr) ?? null;
}
function bs(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(Hi)))
      o.remove();
}
function Ts(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${ht(e.target)}` : null,
    e.duration ? `Duração: ${ht(e.duration)}` : null,
    e.resistance ? `Resistência: ${qr(e.resistance)}` : null
  ].filter(Ge);
}
function Rs(e) {
  const t = Cs(e), n = Es(e), o = (t ? _s(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = jt(S(o, "element")), s = M("op.elementChoices", i) ?? In(Y(a, "Elemento")) ?? In(n.damageType), d = i ?? Us(s), p = S(o, "circle") ?? Y(a, "Círculo"), A = Ns(o) ?? Y(a, "Alvo"), T = Os(o, "duration", "op.durationChoices") ?? Y(a, "Duração"), k = Ss(e) ?? Ds(o) ?? Y(a, "Resistência"), C = Ps(a) ?? n.cost, f = {
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
function Cs(e) {
  const t = ks(e);
  if (!t) return null;
  const n = t.getFlag?.(u, Ni), r = ws(n);
  if (r.length === 0) return null;
  const o = Is(e);
  if (o.size > 0) {
    const a = r.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function ks(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Bt()?.messages?.get?.(n) ?? null : null;
}
function Is(e) {
  const t = e.closest(`.${c}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${An}]`))) {
    const o = r.getAttribute(An)?.trim();
    o && n.add(o);
  }
  return n;
}
function ws(e) {
  if (!Ve(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map($s).filter((n) => n !== null) : [];
}
function $s(e) {
  return Ve(e) ? {
    pendingId: Le(e.pendingId),
    actorId: Le(e.actorId),
    itemId: Le(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(fs) : []
  } : null;
}
function _s(e) {
  if (!e.itemId) return null;
  const t = Bt(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Es(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(Oi))) {
    const o = ce(r.textContent);
    if (!o) continue;
    const a = ms(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function Ss(e) {
  const t = ce(e.querySelector(Or)?.textContent);
  return t ? qr(t) : null;
}
function Y(e, t) {
  const n = Ae(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || Ae(r.slice(0, o)) !== n))
      return ce(r.slice(o + 1));
  }
  return null;
}
function Ps(e) {
  const t = Y(e, "Custo") ?? Y(e, "PE");
  return t || (e.map(ce).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Ns(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return Ls(e) ?? M("op.targetChoices", t) ?? "Área";
  const n = M("op.targetChoices", t) ?? q(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, n].filter(Ge).join(" ");
}
function Ls(e) {
  const t = S(e, "area.name"), n = S(e, "area.size"), r = S(e, "area.type"), o = t ? M("op.areaChoices", t) ?? q(t) : null, a = r ? M("op.areaTypeChoices", r) ?? q(r) : null;
  return o ? n ? a ? `${o} ${n}m ${ht(a)}` : `${o} ${n}m` : o : null;
}
function Ds(e) {
  const t = S(e, "skillResis"), n = S(e, "resistance");
  if (!t || !n) return null;
  const r = M("op.skill", t) ?? q(t), o = vs(n);
  return [r, o].filter(Ge).join(" ");
}
function vs(e) {
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
      return M("op.resistanceChoices", e) ?? q(e);
  }
}
function Os(e, t, n) {
  const r = S(e, t);
  return r ? M(n, r) ?? q(r) : null;
}
function Ms(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Fs(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function xs(e) {
  return [
    `${c}__ritual-element-badge`,
    e ? `${c}__ritual-element-badge--${e}` : null
  ].filter(Ge).join(" ");
}
function jt(e) {
  const t = Ae(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function In(e) {
  const t = jt(e);
  return t ? M("op.elementChoices", t) ?? q(t) : e ? q(e) : null;
}
function Us(e) {
  return jt(e);
}
function M(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Bt()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const wn = "data-paranormal-toolkit-dice-toggle-enhanced";
function Bs(e) {
  for (const t of Array.from(e.querySelectorAll(Fr)))
    Hr(t);
}
function js(e) {
  const t = Gr(e.target);
  if (!t) return;
  const n = qt(t);
  n && (e.preventDefault(), Vr(n, t));
}
function qs(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Gr(e.target);
  if (!t) return;
  const n = qt(t);
  n && (e.preventDefault(), Vr(n, t));
}
function Hr(e) {
  const t = e.querySelector(Ut);
  if (!t) return;
  const n = e.querySelector(Ur);
  if (n && n.getAttribute(wn) !== "true" && (n.setAttribute(wn, "true"), n.classList.add(Br), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Vr(e, t) {
  const n = e.querySelector(Ut);
  if (!n) return;
  const r = !e.classList.contains(xr);
  Hs(e, t, n, r);
}
function Hs(e, t, n, r) {
  e.classList.toggle(xr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Gr(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Ur);
  if (!t) return null;
  const n = qt(t);
  return n ? (Hr(n), t.classList.contains(Br) ? t : null) : null;
}
function qt(e) {
  const t = e.closest(Fr);
  return t && t.querySelector(Ut) ? t : null;
}
const $n = `${u}-workflow-dice-toggle-styles`;
function Vs() {
  if (document.getElementById($n)) return;
  const e = document.createElement("style");
  e.id = $n, e.textContent = `
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
const Gs = [0, 100, 500, 1500, 3e3];
let _n = !1, et = null;
function zs() {
  if (!_n) {
    _n = !0, Vs(), Hooks.on("renderChatMessageHTML", (e, t) => {
      pe(kn(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      pe(kn(t));
    }), Hooks.once("ready", () => {
      pe(document), Ws();
    }), document.addEventListener("click", js), document.addEventListener("keydown", qs);
    for (const e of Gs)
      globalThis.setTimeout(() => pe(document), e);
  }
}
function Ws() {
  et || !document.body || (et = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && pe(n);
  }), et.observe(document.body, { childList: !0, subtree: !0 }));
}
function pe(e) {
  e && (ss(e), ps(e), cs(e), Bs(e), Ji(e));
}
function Ks() {
  zs();
}
const ge = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, zr = {
  PV: "system.attributes.hp"
}, yt = {
  PV: [ge.PV, zr.PV],
  SAN: [ge.SAN],
  PE: [ge.PE],
  PD: [ge.PD]
}, At = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Ys {
  getResource(t, n) {
    const r = En(t, n);
    if (!r.ok)
      return m(r.error);
    const o = r.value, a = `${o}.value`, i = `${o}.max`, s = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, i), p = Pn(t, n, a, s, "valor atual");
    if (p) return m(p);
    const A = Pn(t, n, i, d, "valor máximo");
    return A ? m(A) : y({
      value: s,
      max: d
    });
  }
  async updateResourceValue(t, n, r) {
    const o = En(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function En(e, t) {
  const n = Qs(e.type, t);
  if (n && Sn(e, n))
    return y(n);
  const r = yt[t].find(
    (o) => Sn(e, o)
  );
  return r ? y(r) : m({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Zs(e, t),
    path: yt[t].join(" | ")
  });
}
function Qs(e, t) {
  return e === "threat" ? zr[t] ?? null : e === "agent" ? ge[t] : null;
}
function Sn(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Zs(e, t) {
  const n = e.type ?? "unknown", r = yt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Pn(e, t, n, r, o) {
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
class Xs {
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
      const i = At.ritualItem.circleCandidates;
      return m({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: r, value: o } = n, a = Js(o);
    return a ? y(a) : m({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of At.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Js(e) {
  if (Nn(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Nn(n))
      return n;
  }
  return null;
}
function Nn(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const ec = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class tc {
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
    const r = n.value, o = nc(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: ec[r],
      source: "default-by-circle",
      circle: r
    }) : m(o.error);
  }
}
function nc(e, t) {
  const n = e.getFlag(u, "ritual.cost");
  return n == null ? { ok: !0, value: null } : rc(n) ? {
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
function rc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const tt = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function oc(e) {
  if (!uc(e.item)) return null;
  const t = bt(e.actor) ? e.actor : ac(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: sc(e.token) ?? ic(t),
    targets: Ft(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function ac(e) {
  const t = e;
  return bt(t.actor) ? t.actor : bt(e.parent) ? e.parent : null;
}
function ic(e) {
  const t = cc(e) ?? lc(e);
  return t ? Wr(t) : null;
}
function sc(e) {
  return Tt(e) ? Wr(e) : null;
}
function cc(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Tt(n) ? n : (t.getActiveTokens?.() ?? []).find(Tt) ?? null;
}
function lc(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Wr(e) {
  const t = e.actor ?? null;
  return {
    tokenId: nt(e.id),
    actorId: nt(t?.id),
    sceneId: nt(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function uc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function bt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Tt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function nt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class dc {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(tt.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, l.info(`${tt.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = oc(mc(t));
    if (!n) {
      l.warn(`${tt.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function mc(e) {
  return e && typeof e == "object" ? e : {};
}
class fc {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return rt("missing-item-patch");
    if (t.type !== "ritual") return rt("unsupported-item-type");
    const o = pc(r);
    return Object.keys(o).length === 0 ? rt("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function pc(e) {
  const t = {};
  I(t, "name", e.name), I(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (I(t, "system.circle", n.circle), I(t, "system.element", n.element), I(t, "system.target", n.target), I(t, "system.targetQtd", n.targetQuantity), I(t, "system.execution", n.execution), I(t, "system.range", n.range), I(t, "system.duration", n.duration), I(t, "system.skillResis", n.resistanceSkill), I(t, "system.resistance", n.resistance), I(t, "system.studentForm", n.studentForm), I(t, "system.trueForm", n.trueForm)), t;
}
function I(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function rt(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class gc {
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
    return this.getNumber(t, At.ritual.dt, 0);
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
class hc {
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
    await t.unsetFlag(u, "automation");
  }
  async writeAutomationFlag(t, n) {
    await this.clear(t), await t.setFlag(u, "automation", n);
  }
}
class yc {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Ac(t);
    return n.ok ? this.presets.has(t.id) ? m({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, ot(t)), y(t)) : n;
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
    return n ? ot(n) : null;
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
    return Array.from(this.presets.values()).map(ot);
  }
  findForItem(t) {
    return this.list().map((n) => bc(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Ac(e) {
  return !at(e.id) || !at(e.version) || !at(e.label) ? m({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? m({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function bc(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = Tc(o, t);
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
function Tc(e, t) {
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
      const n = Ln(t.name), r = e.names.map(Ln).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Rc(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Ln(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Rc(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function ot(e) {
  return structuredClone(e);
}
function at(e) {
  return typeof e == "string" && e.length > 0;
}
function Oe(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? m({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = ze(e.amountFrom);
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
function ze(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const Cc = "dice-so-nice";
async function Kr(e) {
  if (!Pi().enabled || !kc()) return;
  const t = Ic();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      l.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function kc() {
  return game.modules.get(Cc)?.active === !0;
}
function Ic() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function wc(e, t, n) {
  if (!Dn(e.id) || !Dn(e.formula))
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
  const n = e.intent ?? $c(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function $c(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Dn(e) {
  return typeof e == "string" && e.length > 0;
}
async function Me(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Se(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Se(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? Se(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? Se(t, n, r, o) : e.recover(t, n, o);
  }
}
function Se(e, t, n, r) {
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
function _c(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = Ec(t, n, r, o);
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
    const i = Sc(t, n, r, o);
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
function Ec(e, t, n, r) {
  const o = ze(e.amountFrom), a = o ? t.rolls[o] : void 0;
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
function Sc(e, t, n, r) {
  const o = ze(e.amountFrom);
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
function Pc(e, t, n) {
  const r = ze(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function Nc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Zr("before", e), vn("before", e), vn("resolve", e);
}
function Lc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Zr("apply", e);
}
function Dc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Zr(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t, s = vc(e, n.operation);
  s && i.emit(s, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function vn(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t;
  n.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function vc(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Oc(e, t, n) {
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
      return Fc(e, t);
    case "spendRitualCost":
      return xc(e, t);
  }
}
async function Fc(e, t) {
  const { context: n, resources: r } = e, o = Oe(t, n);
  return o.ok ? Xr(await r.spend(n.sourceActor, t.resource, o.value), n) : m(o.error);
}
async function xc(e, t) {
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
async function Uc(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, i = Bc(t);
  for (const d of i.before)
    o.emit(d, n, { stepIndex: r, step: t });
  const s = await a();
  if (!s.ok)
    return s;
  for (const d of i.after)
    o.emit(d, n, { stepIndex: r, step: t });
  return s;
}
function Bc(e) {
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
class jc {
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
        return Uc({
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
    const o = await wc(t, r, n);
    return o.ok ? y(void 0) : m({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = Oe(t, n);
    if (!o.ok)
      return m({ ...o.error, stepIndex: r, step: t, context: n });
    const a = Pc(t, n, o.value);
    Nc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), Lc({
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
      const d = await Me(this.resources, s, t.resource, t.operation, o.value), p = this.handleResourceOperationResult(d, n, r, t);
      if (!p.ok)
        return p;
      _c({
        step: t,
        context: n,
        transaction: p.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Dc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = Oe(t, n);
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
      const s = await Me(this.resources, i, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(s, n, r, t);
      if (!d.ok)
        return d;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await Oc(this.messages, t, n);
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
    const s = qc(t, n.intent);
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
function qc(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Hc {
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
    id: Vc(),
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
function Vc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Gc {
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
class zc {
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
    }), Hooks.callAll(`${u}.workflow.${t}`, o), Hooks.callAll(`${u}.workflow.phase`, o), o;
  }
}
class Wc {
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
    const n = pt();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Kc(),
      flags: {
        ...t.flags,
        [u]: {
          ...Yc(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && l.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = pt();
    if (!r.enabled)
      return;
    const o = n.notification ?? On(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = On(n);
    switch (t) {
      case "info":
        l.info(r, n.data ?? "");
        return;
      case "warn":
        l.warn(r, n.data ?? "");
        return;
      case "error":
        l.error(r, n.data ?? "");
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
function On(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Kc() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Yc(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function Qc(e, t) {
  const n = nl(e?.rounds);
  if (!n)
    return Mn(null);
  const r = e?.anchor ?? eo(t);
  if (!r)
    return {
      ...Mn(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // O Foundry precisa enxergar este ActiveEffect como temporário para exibir o ícone no token
    // e classificar o efeito corretamente na ficha. Porém não podemos dar uma duração finita
    // nativa, porque isso faz o Foundry marcar o efeito como expirado na virada da rodada.
    // Valor null vira duração infinita; o expiry mantém o efeito como trackable/temporário.
    // A expiração real por rodada de Ordem é controlada pelo ConditionEngine usando as flags.
    duration: {
      value: null,
      units: "rounds",
      expiry: o
    },
    start: {
      combat: r.combatId,
      combatant: r.combatantId,
      initiative: r.initiative,
      round: r.round,
      turn: r.turn,
      time: r.time
    },
    requestedRounds: n,
    combatDurationApplied: !0,
    combatId: r.combatId,
    startCombatantId: r.combatantId,
    startInitiative: r.initiative,
    startRound: r.round,
    startTurn: r.turn,
    expiryEvent: o,
    durationMode: "combatantTurn",
    warning: null
  };
}
function eo(e) {
  const t = rl();
  if (!t?.id || !to(t.round)) return null;
  const n = el(t), r = Zc(e, n) ?? Jc(t), o = j(r?.id), a = al(r?.initiative), i = Xc(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: i,
    initiative: a,
    time: ol()
  };
}
function Mn(e) {
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
function Zc(e, t) {
  return e?.id ? t.find((n) => tl(n) === e.id) ?? null : null;
}
function Xc(e, t, n) {
  const r = j(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return il(e.turn) ? e.turn : null;
}
function Jc(e) {
  return De(e.combatant) ? e.combatant : null;
}
function el(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(De);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(De);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(De);
  }
  return [];
}
function tl(e) {
  return j(e.actor?.id) ?? j(e.actorId) ?? j(e.token?.actor?.id) ?? j(e.token?.actorId) ?? j(e.document?.actor?.id) ?? j(e.document?.actorId);
}
function nl(e) {
  return to(e) ? Math.trunc(e) : null;
}
function rl() {
  return game.combat ?? null;
}
function ol() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function De(e) {
  return !!(e && typeof e == "object");
}
function j(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function al(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function to(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function il(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class sl {
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
    if (!yl(r))
      return m({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = Qc(t.duration, r), i = cl(o, t, a), d = t.refreshExisting ?? !0 ? Al(r, o.id) : null;
    if (d)
      try {
        return await Promise.resolve(d.update?.(i)), y(Fn(r, o, d.id ?? null, !1, !0, a));
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
      return y(Fn(r, o, A, !0, !1, a));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = ro(n, r);
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
    const n = Rl(), r = [];
    let o = 0, a = 0;
    for (const i of n) {
      const s = Ht(i);
      o += s.length;
      for (const d of s) {
        if (!dl(d, t)) continue;
        const p = no(d);
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
function cl(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Nl(),
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
    duration: ll(n.duration),
    start: ul(n.start),
    flags: {
      [u]: r
    }
  };
}
function ll(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function ul(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Pl(),
    ...e
  };
}
function Fn(e, t, n, r, o, a) {
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
function dl(e, t) {
  const n = no(e);
  if (!n.conditionId || !ml(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Sl();
  return n.durationMode === "combatantTurn" || fl(n) ? gl(n, r) : pl(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !P(n.startRound) || !P(n.requestedRounds) || !P(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function ml(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && P(e.requestedRounds);
}
function fl(e) {
  return !!(e.combatDurationApplied && P(e.requestedRounds) && P(e.startRound) && (e.startCombatantId || Fe(e.startTurn)));
}
function pl(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function gl(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id) return !0;
  if (!P(e.startRound) || !P(e.requestedRounds) || !P(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = hl(t);
  return e.startCombatantId && r === e.startCombatantId ? !0 : Fe(e.startTurn) && Fe(t.turn) ? t.turn >= e.startTurn : !1;
}
function hl(e) {
  return oe(e.combatant?.id);
}
function no(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: ve(e, "conditionId"),
    requestedRounds: Un(e, "requestedRounds") ?? he(t.value) ?? he(t.rounds),
    combatDurationApplied: it(e, "combatDurationApplied"),
    combatId: ve(e, "combatId") ?? oe(n.combat) ?? oe(t.combat),
    startCombatantId: ve(e, "startCombatantId") ?? oe(n.combatant),
    startInitiative: wl(e, "startInitiative") ?? oo(n.initiative),
    startRound: Un(e, "startRound") ?? he(n.round) ?? he(t.startRound),
    startTurn: Il(e, "startTurn") ?? Rt(n.turn) ?? Rt(t.startTurn),
    expiryEvent: $l(e, "expiryEvent") ?? ao(t.expiry),
    durationMode: _l(e, "durationMode"),
    deleteOnExpire: it(e, "deleteOnExpire"),
    expiresWithCombat: it(e, "expiresWithCombat")
  };
}
function yl(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Al(e, t) {
  return ro(e, t)[0] ?? null;
}
function ro(e, t) {
  return Ht(e).filter((n) => kl(n) === t);
}
async function xn(e, t) {
  const n = t.id ?? null, r = n ? bl(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (Tl(o)) return "missing";
    throw o;
  }
}
function bl(e, t) {
  return Ht(e).find((n) => n.id === t) ?? null;
}
function Tl(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Rl() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Pe(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Pe(e, n);
  });
  for (const n of Cl())
    Pe(e, n.actor), Pe(e, n.document?.actor);
  return Array.from(e.values());
}
function Pe(e, t) {
  if (!El(t)) return;
  const r = oe(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Cl() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ht(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function kl(e) {
  return ve(e, "conditionId");
}
function ve(e, t) {
  return oe(X(e, t));
}
function Un(e, t) {
  return he(X(e, t));
}
function Il(e, t) {
  return Rt(X(e, t));
}
function wl(e, t) {
  return oo(X(e, t));
}
function $l(e, t) {
  return ao(X(e, t));
}
function _l(e, t) {
  const n = X(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function it(e, t) {
  return X(e, t) === !0;
}
function X(e, t) {
  const n = e.getFlag?.(u, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const o = r[u];
  if (!(!o || typeof o != "object"))
    return o[t];
}
function oe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function he(e) {
  return P(e) ? Math.trunc(e) : null;
}
function Rt(e) {
  return Fe(e) ? Math.trunc(e) : null;
}
function oo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ao(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function El(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Sl() {
  return game.combat ?? null;
}
function Pl() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function P(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Fe(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Nl() {
  return game.user?.id ?? null;
}
const Ll = "icons/svg/downgrade.svg", Dl = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function h(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Ll,
    description: Dl,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const vl = h({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Ol = h({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Ml = h({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Fl = h({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), xl = h({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Ul = h({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Bl = h({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), jl = h({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), ql = h({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Hl = h({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Vl = h({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Gl = h({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), zl = h({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Wl = h({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Kl = h({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Yl = h({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Ql = h({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Zl = h({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Xl = h({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Jl = h({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), eu = h({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), tu = h({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), nu = h({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), ru = h({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), ou = h({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), au = h({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), iu = h({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), su = h({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), cu = h({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), lu = h({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), uu = h({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), du = h({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), mu = h({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), fu = h({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), pu = [
  vl,
  Ol,
  Ml,
  Fl,
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
  du,
  mu,
  fu
];
class gu {
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
function hu() {
  return new gu(pu);
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
const yu = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", io = `${u}-inline-roll-neutralized`, Au = `${u}-inline-roll-notice`, Vt = `data-${u}-inline-roll-neutralized`, qn = `data-${u}-inline-roll-notice`, bu = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Hn(e) {
  const t = Du(e.message), n = await Tu(e.message), r = Ru(t);
  return n.replacementCount + r.replacementCount > 0 && l.info("Rolagens inline neutralizadas para item automatizado.", {
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
async function Tu(e) {
  const t = Pu(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = Cu(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Nu(t, n.content), replacementCount: n.replacementCount };
}
function Ru(e) {
  const t = e ? Lu(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = so(t);
  return n > 0 && co(_u(t)), { replacementCount: n };
}
function Cu(e) {
  const t = ku(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = so(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (co(n.content), { content: n.innerHTML, replacementCount: o });
}
function ku(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, wu(o.trim()))), replacementCount: t };
}
function so(e) {
  const t = Iu(e);
  for (const n of t)
    n.replaceWith($u(Eu(n)));
  return t.length;
}
function Iu(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(yu))
    n.getAttribute(Vt) !== "true" && t.add(n);
  return Array.from(t);
}
function wu(e) {
  return `<span class="${io}" ${Vt}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${vu(e)}</span>`;
}
function $u(e) {
  const t = document.createElement("span");
  return t.classList.add(io), t.setAttribute(Vt, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function co(e) {
  if (e.querySelector?.(`[${qn}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Au), t.setAttribute(qn, "true"), t.textContent = bu, e.append(t);
}
function _u(e) {
  return e.querySelector(".message-content") ?? e;
}
function Eu(e) {
  const n = e.getAttribute("data-formula") ?? Su(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Su(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Pu(e) {
  return e && typeof e == "object" ? e : null;
}
async function Nu(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return l.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Lu(e) {
  const t = Ou(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Du(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function vu(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Ou(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Vn = "occultism";
function Mu(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Fu(e) {
  const t = Mu(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await xu(e, Vn);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Kr(n);
  const r = ju(n);
  return {
    skill: Vn,
    skillLabel: "Ocultismo",
    roll: n,
    formula: Bu(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: qu(n)
  };
}
async function xu(e, t) {
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
  return Uu(r);
}
function Uu(e) {
  return Gn(e) ? e : Array.isArray(e) ? e.find(Gn) ?? null : null;
}
function Gn(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Bu(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function ju(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function qu(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Hu);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Hu(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function Vu(e) {
  return {
    header: {
      eyebrow: Nt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Yu(e.ritual)
    },
    forms: e.variantOptions.map((t) => Gu(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: Ku(e.automationStatus ?? "assisted")
  };
}
function Gu(e, t) {
  const n = zu(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Wu(t) : "—",
    details: n
  };
}
function zu(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Wu(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function Ku(e) {
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
function Yu(e) {
  const t = e.system, n = [Zu(t?.element), Qu(t?.circle)].filter(Xu);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function Qu(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Zu(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function Xu(e) {
  return typeof e == "string" && e.length > 0;
}
const lo = ["base", "discente", "verdadeiro"];
function uo(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function xe(e) {
  return typeof e == "string" && lo.includes(e);
}
const { ApplicationV2: Ju } = foundry.applications.api;
class ye extends Ju {
  constructor(t, n) {
    super({
      id: `${u}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = n, this.model = Vu(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
  }
  input;
  resolveRequest;
  model;
  selectedVariant = "base";
  spendResource = !0;
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
      cast: ye.onCast,
      cancel: ye.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new ye(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    td(o, (a) => {
      this.selectedVariant = a;
    }), nd(o, (a) => {
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
          ${this.model.forms.map(ed).join("")}
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
    const n = ad(t), r = rd(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function ed(e) {
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
function td(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => zn(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), zn(e, o, t));
    });
  const r = mo(e);
  r && t(r);
}
function zn(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !xe(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), mo(e));
}
function mo(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && xe(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function nd(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function rd(e, t, n) {
  const r = od(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function od(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (xe(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return xe(n) ? n : null;
}
function ad(e) {
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
async function id(e) {
  return ye.request(e);
}
const Gt = {
  label: "Padrão"
}, sd = {
  label: "Discente",
  extraCost: 2
}, cd = {
  label: "Verdadeiro",
  extraCost: 5
};
class ld {
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
    const r = this.resolveCostPreview(t), o = Hd(n), a = Bd(n, t.item, r, o), i = await id({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((_) => _.name),
      cost: r,
      defaultSpendResource: Yd(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const s = ud(i), d = Gd(n, t.item, s.variant, o), p = Pr();
    let A = null;
    if (p) {
      const _ = await md(this.resources, t.actor, s, d, r);
      if (!_.ok)
        return {
          status: "failed",
          reason: _.reason,
          message: _.message
        };
      try {
        A = await Fu(t.actor);
      } catch (ee) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: ee instanceof Error ? ee.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: ee
        };
      }
    }
    const T = dd(n, s, d, r, {
      includeCostSteps: !p
    });
    if (T.steps.length === 0) {
      const _ = Vd(t, s), ee = Wn(t.actor, A, d, r), tn = Yn(n, s, d, r, _, A);
      return ee.length > 0 ? {
        status: "ready",
        workflowContext: _,
        actions: ee,
        summaryLines: tn
      } : {
        status: "completed-without-actions",
        workflowContext: _,
        summaryLines: tn
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
    const C = k.value.context, f = bd(n, t, C), U = pd(n, t), Ie = Wn(t.actor, A, d, r), de = Yn(n, s, d, r, C, A);
    if (!f.ok)
      return {
        status: "failed",
        reason: f.reason,
        message: f.message
      };
    if (!U.ok)
      return {
        status: "failed",
        reason: U.reason,
        message: U.message
      };
    const J = [...Ie, ...f.actions, ...U.actions];
    return J.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: C,
      summaryLines: de
    } : {
      status: "ready",
      workflowContext: C,
      actions: J,
      summaryLines: de
    };
  }
  async applyAction(t) {
    return Me(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function ud(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function dd(e, t, n, r, o) {
  const a = [], i = t.spendResource === !0;
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || zt(s) && (!o.includeCostSteps || !i) || a.push(fd(s, n));
  return o.includeCostSteps && i && r && Qd(n.extraCost) && a.push({
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
async function md(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Ce(o, r);
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
function fd(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Wn(e, t, n, r) {
  if (!t || t.success) return [];
  const o = Ce(r, n);
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
function pd(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = po(r.actor, t);
    if (o.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    for (const a of o) {
      const i = eo(a);
      n.push(gd(r, a, t.item, i));
    }
  }
  return { ok: !0, actions: n };
}
function gd(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? Ad(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: hd(e.duration ?? null, r),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: yd(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function hd(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function yd(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Ad(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function bd(e, t, n) {
  const r = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const a = Oe(o, n);
    if (!a.ok)
      return {
        ok: !1,
        reason: a.error.reason,
        message: a.error.message
      };
    const i = po(o.actor, t);
    if (i.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const s of i)
      r.push(...Td(e, o, s, a.value));
  }
  return { ok: !0, actions: r };
}
function Td(e, t, n, r) {
  if (!Id(e, t))
    return [Kn(t, n, r)];
  const o = _d();
  return fo(e).map((a) => {
    const i = wd(r, a);
    return Kn(t, n, i, {
      option: a,
      choiceGroupId: o
    });
  });
}
function Kn(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = kd(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: Rd(e, o, n, r?.option),
    executedLabel: Cd(e, o, r?.option),
    choiceGroupId: r?.choiceGroupId,
    choiceGroupResolvedLabel: r ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function Rd(e, t, n, r) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? r ? `${r.id === "normal" ? "Normal" : r.label}: ${n} PV` : `Dano: ${n} PV` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Cd(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? n ? `✓ ${n.id === "normal" ? "dano normal" : n.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function kd(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Id(e, t) {
  return t.operation === "damage" && t.resource === "PV" && fo(e).length > 1;
}
function fo(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function wd(e, t) {
  const n = e * t.multiplier, r = $d(n, t.rounding ?? "floor");
  return Math.max(0, r);
}
function $d(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function _d() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function po(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((n) => n.actor ? [n.actor] : []);
  }
}
function Yn(e, t, n, r, o, a = null) {
  return [
    `Forma: ${uo(t.variant)}`,
    Sd(t, n, r),
    ...Ed(a),
    ...Object.values(o.rolls).flatMap(Pd),
    ...Nd(e.resistance),
    ...xd(n)
  ];
}
function Ed(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Sd(e, t, n) {
  const r = Ce(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Pd(e) {
  const n = [`${Ud(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = Ld(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${Fd(e.damageType)}`), n;
}
function Nd(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function Ld(e) {
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
    const i = Dd(a);
    i && (Md(n, i.operator ?? r, i.value), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Dd(e) {
  const t = vd(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Od(e);
}
function vd(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Od(e) {
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
function Md(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function Fd(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function xd(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Ud(e) {
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
function Bd(e, t, n, r) {
  return lo.map((o) => {
    const a = go(e, t, o, r), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? uo(o),
      enabled: i,
      details: a ? jd(a, n, r) : [],
      finalCostText: a ? qd(n, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function jd(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = Ce(t, e);
  return r.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), r;
}
function Ce(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function qd(e, t) {
  const n = Ce(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function Hd(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(zt);
}
function Vd(e, t) {
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
function Gd(e, t, n, r) {
  return go(e, t, n, r) ?? Gt;
}
function go(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? Wd(t, n) ? zd(n) : null : n === "base" ? Gt : null);
}
function zd(e) {
  switch (e) {
    case "base":
      return Gt;
    case "discente":
      return sd;
    case "verdadeiro":
      return cd;
  }
}
function Wd(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Kd(foundry.utils.getProperty(e, n));
}
function Kd(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Yd(e) {
  return e.steps.some(zt);
}
function zt(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Qd(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Zd(e, t) {
  const n = await Xd(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: em(n),
    total: tm(n),
    diceBreakdown: nm(n)
  };
}
function ho(e) {
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
async function Xd(e, t) {
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
  return Jd(r);
}
function Jd(e) {
  return Qn(e) ? e : Array.isArray(e) ? e.find(Qn) ?? null : null;
}
function Qn(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function em(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function tm(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function nm(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(rm);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function rm(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const yo = "itemUsePrompts", Ao = "chatCard", We = "data-paranormal-toolkit-prompt-id", Ke = "data-paranormal-toolkit-pending-id", Wt = "data-paranormal-toolkit-executed-label", Ct = "data-paranormal-toolkit-choice-group", bo = "data-paranormal-toolkit-skipped-label", Zn = "data-paranormal-toolkit-action-section", Xn = "data-paranormal-toolkit-detail-key", Jn = "data-paranormal-toolkit-roll-card", Kt = "data-paranormal-toolkit-roll-detail-toggle", To = "data-paranormal-toolkit-roll-detail-id", Ro = "data-paranormal-toolkit-resistance-roll-button", Co = "data-paranormal-toolkit-resistance-skill", ko = "data-paranormal-toolkit-resistance-skill-label", Io = "data-paranormal-toolkit-resistance-target-actor-id", wo = "data-paranormal-toolkit-resistance-target-name", $o = "data-paranormal-toolkit-resistance-roll-result", er = "data-paranormal-toolkit-system-card-replaced", om = `[${Ke}]`, am = `[${Kt}]`, im = `[${Ro}]`, kt = `${u}-chat-enrichment`, g = `${u}-item-use-prompt`, sm = `${g}__actions`, tr = `${g}__details`, _o = `${g}__summary`, cm = `${g}__title`, Eo = `${g}__button--executed`, nr = `${g}__roll-card`;
let rr = !1, It = null;
const N = /* @__PURE__ */ new Map(), lm = [0, 100, 500, 1500, 3e3], um = 3e4, dm = [0, 100, 500, 1500, 3e3];
function mm(e) {
  if (It = e, rr) {
    ar(e);
    return;
  }
  const t = (n, r) => {
    Po(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), rr = !0, ar(e);
}
async function or(e) {
  const t = So(e);
  N.set(e.pendingId, t), await Zt(t) || Bo(t), No(e.pendingId);
}
async function fm(e) {
  const t = So({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", N.set(e.pendingId, t), await Zt(t) || Bo(t), No(e.pendingId);
}
async function st(e, t) {
  const n = N.get(e);
  N.delete(e), n && await ff(n, t);
}
function Yt(e) {
  const t = zo();
  for (const n of t) {
    const r = x(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function pm(e, t) {
  const n = Yt(e);
  if (!n) return;
  const r = x(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await le(n.message, r));
}
async function gm(e, t, n) {
  if (!t) return;
  const r = Yt(e);
  if (!r) return;
  const o = x(r.message);
  let a = !1;
  for (const [i, s] of Object.entries(o))
    i !== e && s.choiceGroupId === t && (o[i] = {
      ...s,
      executedLabel: n ?? s.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await le(r.message, o);
}
function So(e) {
  const t = H(e.context.message), n = e.context.targets.find((i) => Et(i)), r = n ? Et(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: jm(e.context),
    executed: !1
  };
}
function Po(e, t, n) {
  mf();
  const r = Qe(t);
  if (!r) return;
  const o = lf(e, r);
  o.length > 0 && Ue(r);
  for (const a of o)
    wt(r, a);
  vo(r, n), $t(r), _t(r);
}
function ar(e) {
  for (const t of dm)
    globalThis.setTimeout(() => {
      hm(e);
    }, t);
}
function hm(e) {
  for (const t of ym()) {
    const n = Ye(t);
    Am(n) && Po(n, t, e);
  }
}
function ym() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Am(e) {
  return e ? Xt(e) ? !0 : gf(e).length > 0 : !1;
}
function No(e) {
  const t = N.get(e);
  if (!t) return;
  const n = t.messageId ? uf(t.messageId) : null;
  if (n) {
    ur(n, t), Ue(n), wt(n, t), ir(n), $t(n), _t(n);
    return;
  }
  if (t.messageId) {
    Pt(t);
    return;
  }
  const r = df(t);
  if (r) {
    ur(r, t), Ue(r), wt(r, t), ir(r), $t(r), _t(r);
    return;
  }
  Pt(t);
}
function ir(e) {
  It && vo(e, It);
}
function Ue(e) {
  const t = bm();
  e.classList.toggle(`${g}--system-card-replaced`, t);
  const n = Do(e);
  if (!n || (n.classList.toggle(`${g}__host--system-card-replaced`, t), !t) || n.getAttribute(er) === "true") return;
  const r = n.querySelector(`.${kt}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(er, "true");
}
function bm() {
  try {
    return Qa() === "replace";
  } catch {
    return !1;
  }
}
function wt(e, t) {
  if (Ue(e), e.querySelector(`[${We}="${ue(t.pendingId)}"]`)) return;
  const n = Tm(e, t);
  Cm(n, t), Mm(n, Fm(t)).append(Bm(t));
}
function Tm(e, t) {
  const n = e.querySelector(`.${kt}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(kt, g);
  const o = document.createElement("header");
  o.classList.add(`${g}__header`);
  const a = document.createElement("span");
  a.classList.add(`${g}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(cm), i.textContent = Rm(t);
  const s = document.createElement("span");
  return s.classList.add(_o), s.textContent = t.summary, o.append(a, i, s), r.append(o), Hm(e).append(r), r;
}
function Rm(e) {
  const t = $(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Cm(e, t) {
  const n = t.summaryLines ?? [], r = xo(n, t);
  if (r) {
    km(e, r, t);
    return;
  }
  xm(e, n);
}
function km(e, t, n) {
  if (e.querySelector(`[${Jn}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(nr, `${nr}--${t.intent}`), r.setAttribute(Jn, "true"), t.castingCheck && sr(r, wm(t.castingCheck), n.pendingId, "casting"), Im(t) && sr(r, $m(t), n.pendingId, "effect"), Nm(r, t), Lm(r, t, n), Om(r, t), e.append(r);
}
function Im(e) {
  return e.intent !== "casting";
}
function wm(e) {
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
function $m(e) {
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
  _m(o, t), vm(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function _m(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${g}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${g}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = Em(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function Em(e, t) {
  const n = Sm(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${g}__workflow-dice-tray`);
  for (const o of Pm(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${g}__workflow-die`), o.active || a.classList.add(`${g}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function Sm(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Pm(e, t) {
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
function Nm(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Df);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${g}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function Lm(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${g}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = Dm(t, n);
  o.append(a), i && o.append(i);
  const s = document.createElement("span");
  s.classList.add(`${g}__resistance-description`), s.textContent = t.resistance, r.append(o, s), t.resistanceRollResult && r.append(Lo(t.resistanceRollResult)), e.append(r);
}
function Dm(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${g}__resistance-roll-button`), n.setAttribute(We, t.pendingId), n.setAttribute(Ro, "true"), n.setAttribute(Co, e.resistanceSkill), n.setAttribute(ko, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Io, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(wo, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${g}__resistance-roll-button--rolled`), n.setAttribute($o, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${g}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Lo(e) {
  const t = document.createElement("span");
  return t.classList.add(`${g}__resistance-roll-result`), t.textContent = Mo(e), t;
}
function vm(e, t, n, r, o) {
  const a = t.filter((p) => p.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${n}-roll-details-${r}`, s = document.createElement("button");
  s.type = "button", s.classList.add(`${g}__roll-detail-toggle`), s.setAttribute(Kt, i), s.setAttribute("aria-expanded", "false"), s.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${g}__roll-detail-list`), d.setAttribute(To, i), d.hidden = !0;
  for (const p of a) {
    const A = document.createElement("dt");
    A.textContent = p.label;
    const T = document.createElement("dd");
    T.textContent = p.value, d.append(A, T);
  }
  e.append(s, d);
}
function Om(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function Mm(e, t) {
  const n = `[${Zn}="${ue(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(sm), o.setAttribute(Zn, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${g}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function Fm(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = xo(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function xm(e, t) {
  if (t.length === 0) return;
  const n = Um(e);
  for (const r of t) {
    const o = vf(r);
    if (n.querySelector(`[${Xn}="${ue(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(Xn, o), n.append(a);
  }
}
function Um(e) {
  const t = e.querySelector(`.${tr}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(tr), e.append(n), n;
}
function Bm(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${g}__button`), t.setAttribute(We, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Eo), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Ke, e.pendingId), t.setAttribute(Wt, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Ct, e.choiceGroupId), t.setAttribute(bo, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function jm(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = qm(e);
  return `${t} → ${n}`;
}
function qm(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Hm(e) {
  return Do(e) ?? e;
}
function Do(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function vo(e, t) {
  const n = Qe(e);
  if (!n) return;
  const r = n.querySelectorAll(om);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      rf(o, t);
    }));
}
function $t(e) {
  const t = Qe(e);
  if (!t) return;
  const n = t.querySelectorAll(am);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Vm(t, r);
    }));
}
function _t(e) {
  const t = Qe(e);
  if (!t) return;
  const n = t.querySelectorAll(im);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Gm(t, r);
    }));
}
function Vm(e, t) {
  const n = t.getAttribute(Kt);
  if (!n) return;
  const r = e.querySelector(`[${To}="${ue(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Gm(e, t) {
  const n = t.getAttribute(We), r = t.getAttribute(Co), o = t.getAttribute(ko) ?? (r ? ho(r) : "Resistência");
  if (!n || !r) return;
  const a = Km(e, n), i = Ym(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const s = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Zd(i, r);
    await ef(d.roll);
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
    zm(t, p), Wm(t, p), tf(n, p), await nf(e, n, p);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1;
  }
}
function zm(e, t) {
  e.classList.add(`${g}__resistance-roll-button--rolled`), e.setAttribute($o, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Wm(e, t) {
  const n = e.closest(`.${g}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${g}__resistance-roll-result`), o = r ?? Lo(t);
  if (r) {
    r.textContent = Mo(t);
    return;
  }
  n.append(o);
}
function Km(e, t) {
  const n = N.get(t);
  if (n) return n;
  const r = Ye(e);
  return x(r)[t] ?? null;
}
function Ym(e, t) {
  const n = e?.resistanceTargetActor;
  if (O(n)) return n;
  const o = e?.context?.targets.map(Et).find(O) ?? null;
  if (o) return o;
  const a = t.getAttribute(Io) ?? e?.resistanceTargetActorId ?? null, i = a ? Zm(a) : null;
  return i || Xm(
    t.getAttribute(wo) ?? e?.resistanceTargetName ?? Qm(t)
  );
}
function Qm(e) {
  const n = e.closest(`.${g}`)?.querySelector(`.${_o}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function Et(e) {
  const t = e.actor;
  if (O(t)) return t;
  const n = e.token, r = be(n);
  if (r) return r;
  const o = e.document;
  return be(o);
}
function be(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (O(t)) return t;
  const n = e.document?.actor;
  return O(n) ? n : null;
}
function Zm(e) {
  const n = game.actors?.get?.(e);
  return O(n) ? n : Oo().map((a) => be(a)).find((a) => a?.id === e) ?? null;
}
function Xm(e) {
  const t = ae(e);
  if (!t) return null;
  const n = Oo().filter((a) => ae(Jm(a)) === t).map((a) => be(a)).find(O) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => O(a) && ae(a.name) === t);
  return O(o) ? o : null;
}
function Oo() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Jm(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : be(e)?.name ?? null;
}
function ae(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function O(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Mo(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function ef(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function tf(e, t) {
  const n = N.get(e);
  n && (n.resistanceRollResult = t);
}
async function nf(e, t, n) {
  const r = Ye(e);
  if (r)
    try {
      const o = x(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await le(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Ye(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return F(r?.get?.(n));
}
async function rf(e, t) {
  const n = e.getAttribute(Ke);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    Fo(e, e.getAttribute(Wt) ?? "✓ Automação aplicada"), of(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function Fo(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Eo), e.removeAttribute(Ke), e.removeAttribute(Wt);
}
function of(e) {
  const t = e.getAttribute(Ct);
  if (!t) return;
  const n = e.closest(`.${g}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Ct}="${ue(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(bo) ?? "✓ Outra opção escolhida";
    Fo(o, a);
  }
}
function xo(e, t) {
  const n = e.map(Qt).filter(Nf), r = n.find((f) => f.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = $(e, "Forma"), a = $(e, "Custo"), i = $(e, "Dados") ?? $(e, `Dados (${r.label})`), s = $(e, "Tipo"), d = $(e, "Resistência"), p = $(e, "Resistência Perícia"), A = $(e, "Resistência Rótulo") ?? (p ? ho(p) : null), T = Uo(e, "Observação"), k = e.filter((f) => cf(f, r)), C = af(e);
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
function af(e) {
  const t = e.map(Qt).find((a) => a?.intent === "casting") ?? null, n = $(e, "Conjuração DT"), r = $(e, "Conjuração Resultado");
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
function Qt(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: sf(n)
  } : null;
}
function sf(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function $(e, t) {
  return Uo(e, t)[0] ?? null;
}
function Uo(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function cf(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Qt(e) ? !1 : e.trim().length > 0;
}
function lf(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of N.values())
    St(r, e, t) && n.set(r.pendingId, r);
  for (const r of pf(e))
    St(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function St(e, t, n) {
  const r = H(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !lr(n, "itemId", e.itemId) ? !1 : !e.actorId || lr(n, "actorId", e.actorId);
}
function lr(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${Of(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function uf(e) {
  const t = ue(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function df(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (St(e, null, t))
      return t;
  return null;
}
function mf() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of N.entries())
    e - r.createdAt > t && N.delete(n);
}
async function ur(e, t) {
  const n = Ye(e);
  if (!n) return !1;
  try {
    const r = x(n);
    return r[t.pendingId] = Jt(t, H(n)), await le(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Zt(e) {
  const t = Ho(e);
  if (!t) return !1;
  try {
    const n = x(t);
    return n[e.pendingId] = Jt(e, H(t)), await le(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Bo(e) {
  for (const t of lm)
    globalThis.setTimeout(() => {
      Pt(e);
    }, t);
}
async function Pt(e) {
  const t = Ho(e);
  if (Xt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await Zt(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function ff(e, t) {
  const n = qo(e.context.message);
  if (n)
    try {
      const r = x(n), o = r[e.pendingId] ?? Jt(e, H(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await le(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function pf(e) {
  return Object.values(x(F(e))).filter(ke);
}
function x(e) {
  if (!e) return {};
  const t = {}, n = Xt(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(jo(e)))
    t[r] ??= o;
  return t;
}
function gf(e) {
  return Object.values(jo(F(e))).filter(ke);
}
function jo(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, yo);
  if (!ie(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    ke(o) && (n[r] = o);
  return n;
}
async function le(e, t) {
  typeof e.setFlag == "function" && (await yf(e, t), await hf(e, t));
}
async function hf(e, t) {
  await Promise.resolve(e.setFlag?.(u, yo, t));
}
function Xt(e) {
  if (!e) return null;
  const t = e.getFlag?.(u, Ao);
  return Sf(t) ? t : null;
}
async function yf(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(ke).sort((a, i) => a.createdAt - i.createdAt);
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
      actorName: Af(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(u, Ao, o));
}
function Af(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Jt(e, t) {
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
function qo(e) {
  const t = F(e);
  if (t?.setFlag)
    return t;
  const n = bf(e);
  if (n?.setFlag)
    return n;
  const r = H(e);
  if (!r) return null;
  const o = game.messages;
  return F(o?.get?.(r));
}
function bf(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(F).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Ho(e) {
  const t = qo(e.context.message);
  if (t) return t;
  const n = e.messageId ? Tf(e.messageId) : null;
  if (n) return n;
  const r = zo().slice().reverse();
  return r.find((o) => Rf(o, e)) ?? r.find((o) => Cf(o, e)) ?? null;
}
function Tf(e) {
  const t = game.messages;
  return F(t?.get?.(e));
}
function Rf(e, t) {
  const n = H(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Vo(e, t)) return !1;
  const o = Go(e);
  return !t.actorId || !o || o === t.actorId;
}
function Cf(e, t) {
  if (!If(e, t)) return !1;
  const n = Go(e);
  return t.actorId && n === t.actorId ? !0 : Vo(e, t);
}
function Vo(e, t) {
  const n = ae(kf(e));
  if (!n) return !1;
  const r = ae(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = ae(t.itemId);
  return !!(o && n.includes(o));
}
function kf(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Go(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function If(e, t) {
  const n = wf(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= um;
}
function wf(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function F(e) {
  return e && typeof e == "object" ? e : null;
}
function ke(e) {
  return ie(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && E(e.messageId) && E(e.itemId) && E(e.actorId) && E(e.itemName) && K(e.resistanceTargetActorId) && K(e.resistanceTargetName) && Pf(e.resistanceRollResult) && $f(e.actionPayload) && ct(e.title) && ct(e.buttonLabel) && ct(e.executedLabel) && K(e.choiceGroupId) && K(e.skippedLabel) && K(e.actionSectionId) && K(e.actionSectionTitle) && Lf(e.summaryLines) : !1;
}
function $f(e) {
  return e == null ? !0 : ie(e) ? e.kind === "resource-operation" && E(e.actorId) && E(e.actorUuid) && typeof e.actorName == "string" && _f(e.resource) && Ef(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function _f(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ef(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Sf(e) {
  return ie(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && E(e.messageId) && ie(e.source) && E(e.source.actorId) && E(e.source.actorName) && E(e.source.itemId) && E(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ke) : !1;
}
function Pf(e) {
  return e == null ? !0 : ie(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && K(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Nf(e) {
  return e !== null;
}
function ie(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function E(e) {
  return e === null || typeof e == "string";
}
function ct(e) {
  return e === void 0 || typeof e == "string";
}
function K(e) {
  return e == null || typeof e == "string";
}
function Lf(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Df(e) {
  return typeof e == "string" && e.length > 0;
}
function zo() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(F).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(F).filter((r) => r !== null) : [];
}
function Qe(e) {
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
function vf(e) {
  return e.trim().toLowerCase();
}
function Of(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ue(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const dr = 1e3;
class Mf {
  constructor(t, n, r, o, a) {
    this.workflow = t, this.resources = n, this.conditions = o, this.debugOutput = a, this.ritualAssistant = new ld(t, n, r);
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
      settings: ln(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = ln();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Lt(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && Ff(t.item) && n.executionMode === "ask") {
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
        data: ut(t, "failed", "missing-actor")
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
    return n ? n.kind === "workflow" ? (this.pendingExecutions.delete(t), await st(t), await this.executeAutomation(n.context, n.definition, n.mode), !0) : await this.executeAssistedAction(n.action, n.workflowContext) ? (this.pendingExecutions.delete(t), await st(t), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1 : this.executePersistedPendingAutomation(t);
  }
  async executePersistedPendingAutomation(t) {
    const n = Yt(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const r = n.prompt.actionPayload, o = Bf(r);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`), !1;
    const a = await Me(this.resources, o, r.resource, r.operation, r.amount);
    return a.ok ? (await pm(t), await gm(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (mm((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
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
        data: ut(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, xf(t.item));
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
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), l.info("Ritual assistido concluído sem ações pendentes.", Z(r.workflowContext));
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
      a.kind === "assisted-action" && a.action.kind === "resource-operation" && (this.pendingExecutions.delete(o), await st(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = dt();
    await fm({
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
      const s = dt();
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
        actionPayload: Uf(i)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), l.info("Ritual assistido preparado com ações pendentes.", Z(n));
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = dt();
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
    this.setAttempt(t, "completed"), l.info("Automação executada por uso normal de item.", Z(o.value.context));
  }
  handleAutomationFailure(t) {
    const n = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      l.warn(n, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      l.error(n, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    l.warn(n, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    l.warn(`Ação assistida falhou: ${t.error.message}`, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  handleConditionActionFailure(t) {
    l.warn(`Ação assistida de condição falhou: ${t.error.message}`, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
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
    this.lastAttempt = ut(t, n, r, o);
  }
}
function Ff(e) {
  return e.type === "ritual";
}
function xf(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Uf(e) {
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
function Bf(e) {
  const t = e.actorUuid ? jf(e.actorUuid) : null;
  if (se(t)) return t;
  const n = e.actorId ? qf(e.actorId) : null;
  return n || Hf(e.actorName);
}
function jf(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function qf(e) {
  const n = game.actors?.get?.(e);
  if (se(n)) return n;
  for (const r of Wo()) {
    const o = en(r);
    if (o?.id === e) return o;
  }
  return null;
}
function Hf(e) {
  const t = lt(e);
  if (!t) return null;
  for (const o of Wo()) {
    const a = Vf(o);
    if (lt(a) === t) {
      const i = en(o);
      if (i) return i;
    }
  }
  const r = game.actors?.find?.((o) => se(o) && lt(o.name) === t);
  return se(r) ? r : null;
}
function Wo() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Vf(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : en(e)?.name ?? null;
}
function en(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (se(t)) return t;
  const n = e.document?.actor;
  return se(n) ? n : null;
}
function lt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function se(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ut(e, t, n, r) {
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
function dt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Gf {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = Re(t);
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
class zf {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Re(t).map((s) => this.analyzeRitual(s)), r = n.filter(Ne("upToDate")), o = n.filter(Ne("available")), a = n.filter(Ne("outdated")), i = n.filter(Ne("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = Wf(t);
    return n ? r ? r.source.type !== "preset" ? me({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? me({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : me({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: Kf(r, n.preset)
    }) : me({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : me({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function me(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? qe(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function Wf(e) {
  const t = e.getFlag(u, "automation");
  return Dt(t) ? t : null;
}
function Kf(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Ne(e) {
  return (t) => t.status === e;
}
class Yf {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = Ot(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: n,
      data: r,
      flags: {
        [u]: {
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
        [u]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const n = b(t.actorName), r = b(t.resource), o = b(fr(t)), a = b(Zf(t));
    return `
      <section class="${u}-card ${u}-resource-card">
        <header class="${u}-card__header">
          <strong>${o}</strong>
          <span>${n}</span>
        </header>
        <div class="${u}-card__body">
          <p><strong>${a}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, n) {
    const r = b(n.title ?? "Automação"), o = n.message ? `<p>${b(n.message)}</p>` : "", a = b(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), i = b(t.item.name ?? "Item sem nome"), s = t.targets.length > 0 ? t.targets.map((f) => b(f.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (f) => `<li><strong>${b(f.id)}:</strong> ${b(f.formula)} = ${f.total} <em>(${b(Qf(f.intent))})</em>${f.damageType ? ` — ${b(f.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (f) => `<li><strong>${b(f.itemName)}:</strong> ${f.circle}º círculo — ${f.amount} ${b(f.resource)} (${b(Xf(f.source))})</li>`
    ), A = t.damageInstances.map(
      (f) => `<li><strong>${b(f.targetActorName)}:</strong> bruto ${f.rawAmount}${f.damageType ? ` ${b(f.damageType)}` : ""} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), T = t.healingInstances.map(
      (f) => `<li><strong>${b(f.targetActorName)}:</strong> bruto ${f.rawAmount} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), k = t.resourceTransactions.map(
      (f) => `<li><strong>${b(f.actorName)}:</strong> ${b(fr(f))} — ${f.before.value}/${f.before.max} &rarr; ${f.after.value}/${f.after.max}</li>`
    ), C = t.phases.map((f) => b(f)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${r}</strong>
          <span>${i}</span>
        </header>
        <div class="${u}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${s}</p>
          ${p.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${p.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Dano:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Cura:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${k.join("")}</ul>` : ""}
          ${C.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${C}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Qf(e) {
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
function Zf(e) {
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
function Xf(e) {
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
function Jf() {
  const e = new Ys(), t = new Hc(e), n = new Xs(), r = new tc(n), o = new gc(e), a = new yc(), i = a.registerMany(Sa());
  if (!i.ok)
    throw new Error(i.error.message);
  const s = new hc(), d = new fc(), p = hu(), A = new sl(p), T = new zf(a), k = new Gf(T, s, d), C = new Wc(), f = new Yf(C), U = new zc(), Ie = new jc(t, r, f, U), de = new Gc(Ie, U), J = new Mf(de, t, r, A, C);
  return J.addStrategy(new dc((_) => J.handleItemUsed(_))), {
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
    workflowHooks: U,
    automation: Ie,
    workflow: de,
    itemUseIntegration: J,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: k
  };
}
const { ApplicationV2: ep } = foundry.applications.api;
class Be extends ep {
  constructor(t, n) {
    super({
      id: `${u}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
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
      apply: Be.onApply,
      cancel: Be.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${L(Nt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${L(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${mt("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${mt("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${mt("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function mt(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${L(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? tp(n) : rp(t)}
    </section>
  `;
}
function tp(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(np).join("")}</ol>`;
}
function np(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${L(e.appliedPresetId)} v${L(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${L(e.itemName)}</strong>
        <span>${L(e.reason)}</span>
        ${r}
      </div>
      <em>${L(n)}</em>
    </li>
  `;
}
function rp(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${L({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function L(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const je = `${u}.manageRitualPresets`, pr = `__${u}_ritualPresetHeaderControlRegistered`, op = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function ap(e) {
  const t = globalThis;
  if (!t[pr]) {
    for (const n of op)
      Hooks.on(n, (r, o) => {
        ip(r, o, e);
      });
    t[pr] = !0, l.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function ip(e, t, n) {
  Array.isArray(t) && cp(e) && (sp(e, n), !t.some((r) => r.action === je) && t.push({
    action: je,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Ko(e, n);
    }
  }));
}
function sp(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[je] && (e.options.actions[je] = (n) => {
    n.preventDefault(), n.stopPropagation(), Ko(e, t);
  }));
}
function cp(e) {
  if (!game.user?.isGM) return !1;
  const t = Yo(e);
  return t ? t.type === "agent" && Re(t).length > 0 : !1;
}
function Ko(e, t) {
  const n = Yo(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Be(n, t).render({ force: !0 });
}
function Yo(e) {
  return gr(e.actor) ? e.actor : gr(e.document) ? e.document : null;
}
function gr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let Q = null;
Hooks.once("init", () => {
  $a(), Ya(), Si(), Ks(), l.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!mn.isSupportedSystem()) {
    l.warn(
      `Sistema não suportado: ${mn.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Q = Jf(), Q.itemUseIntegration.registerStrategies(), wi(Q.conditions), si(Q), bi(), gi(), ap(Q), l.info("Inicializado para o sistema Ordem Paranormal."), l.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Nt} inicializado.`);
});
function lp() {
  if (!Q)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Q;
}
export {
  lp as getToolkitServices
};
//# sourceMappingURL=main.js.map
