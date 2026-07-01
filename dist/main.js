const c = "paranormal-toolkit", Jt = "Paranormal Toolkit", ni = "ordemparanormal";
class Ee {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function nt(e) {
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
class d {
  static info(t, ...n) {
    console.log(`${c} | ${t}`, ...n);
  }
  static warn(t, ...n) {
    console.warn(`${c} | ${t}`, ...n);
  }
  static error(t, ...n) {
    console.error(`${c} | ${t}`, ...n);
  }
}
function y(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function en(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : tn(t) ? y(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function ri(e) {
  return tn(e.getFlag(c, "automation"));
}
function tn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && ai(t.source) && oi(t.definition);
}
function oi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && C(t.label) && Array.isArray(t.steps) && t.steps.every(ii) && (t.conditionApplications === void 0 || fi(t.conditionApplications));
}
function ai(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? C(t.presetId) && C(t.presetVersion) && C(t.appliedAt) : t.type === "manual" ? C(t.label) && C(t.appliedAt) : !1;
}
function ii(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return si(t);
    case "spendRitualCost":
      return li(t);
    case "rollFormula":
      return ci(t);
    case "modifyResource":
      return di(t);
    case "chatCard":
      return mi(t);
    default:
      return !1;
  }
}
function si(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && so(t);
}
function li(e) {
  return e.type === "spendRitualCost";
}
function ci(e) {
  const t = e;
  return t.type === "rollFormula" && C(t.id) && C(t.formula) && (t.intent === void 0 || Ai(t.intent)) && (t.damageType === void 0 || C(t.damageType));
}
function di(e) {
  const t = e;
  return t.type === "modifyResource" && lo(t.actor) && yi(t.resource) && bi(t.operation) && so(t) && (t.damageType === void 0 || t.damageType === null || C(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function mi(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function fi(e) {
  return Array.isArray(e) && e.every(pi);
}
function pi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return C(t.id) && lo(t.actor) && C(t.conditionId) && (t.label === void 0 || C(t.label)) && (t.duration === void 0 || t.duration === null || gi(t.duration)) && (t.source === void 0 || C(t.source)) && (t.actionSectionId === void 0 || C(t.actionSectionId)) && (t.actionSectionTitle === void 0 || C(t.actionSectionTitle)) && (t.executedLabel === void 0 || C(t.executedLabel));
}
function gi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Ti(t.rounds)) && (t.expiry === void 0 || t.expiry === null || hi(t.expiry));
}
function hi(e) {
  return e === "turnStart" || e === "turnEnd";
}
function so(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || C(e.amountFrom);
}
function lo(e) {
  return e === "self" || e === "target";
}
function yi(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function bi(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Ai(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Ti(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function C(e) {
  return typeof e == "string" && e.length > 0;
}
function nn(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Ln);
    if (Ci(t))
      return Array.from(t).filter(Ln);
  }
  return [];
}
function Ri(e) {
  return nn(e)[0] ?? null;
}
function _i(e) {
  return nn(e).find(ri) ?? null;
}
function Ci(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ln(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Se(e) {
  return nn(e).filter((t) => t.type === "ritual");
}
function co(e) {
  return Se(e)[0] ?? null;
}
function ki(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(nt);
      return d.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Te("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Ne(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(vn);
      return d.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Te("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Ne(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await vt(e, r, o.value);
      d.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Te("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Ne(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        d.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await vt(e, n, r.preset);
      d.info(`Melhor preset aplicado em ${n.name}.`, { match: vn(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Pn(e);
    },
    async applyBestPresetsToActorRituals() {
      return Pn(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Te("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Ne(t);
      n && (await e.automationBinder.clear(n), d.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Pn(e) {
  const t = Te("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Se(t);
  if (n.length === 0)
    return d.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Nn(t);
  const r = Nn(t, n.length);
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
    const i = await vt(e, o, a.preset);
    r.applied.push(wi(o, a, i));
  }
  return d.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), $i(r), r;
}
async function vt(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function wi(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: nt(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Nn(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function $i(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function vn(e) {
  return {
    preset: nt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Te(e) {
  const t = Ee.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ne(e) {
  const t = co(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function J(e) {
  return e ? {
    id: e.id,
    source: {
      ...Ii(e.sourceActor),
      token: e.sourceToken
    },
    item: Ei(e.item),
    targets: e.targets.map(Si),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: On(e.rollRequests, uo),
    rolls: On(e.rolls, Di),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(rn),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function rn(e) {
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
function Ii(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Ei(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Si(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function uo(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Di(e) {
  return {
    ...uo(e),
    total: e.total
  };
}
function On(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function Li(e) {
  return {
    getSelected() {
      return Ee.getSelectedActor();
    },
    logResources() {
      const t = G(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      d.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && d.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await ne(
        e,
        "Gasto de PE",
        G("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await ne(
        e,
        "Gasto de PD",
        G("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await ne(
        e,
        "Dano em PV",
        G("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await ne(
        e,
        "Cura de PV",
        G("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await ne(
        e,
        "Dano em SAN",
        G("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await ne(
        e,
        "Recuperação de SAN",
        G("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function ne(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    Pi(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (i) {
    d.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  d.info(`${t} realizado:`, rn(a));
}
function G(e) {
  const t = Ee.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Pi(e) {
  if (e.reason === "update-failed") {
    d.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    d.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  d.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const O = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Ni() {
  ve(O.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), ve(O.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), ve(O.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), ve(O.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Ot() {
  return {
    enabled: Oe(O.enabled),
    console: Oe(O.console),
    ui: Oe(O.ui),
    chat: Oe(O.chat)
  };
}
async function q(e, t) {
  await game.settings.set(c, O[e], t);
}
function ve(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Oe(e) {
  return game.settings.get(c, e) === !0;
}
function vi() {
  return {
    status() {
      return Ot();
    },
    async enable() {
      await q("enabled", !0);
    },
    async disable() {
      await q("enabled", !1);
    },
    async enableConsole() {
      await q("console", !0);
    },
    async disableConsole() {
      await q("console", !1);
    },
    async enableUi() {
      await q("ui", !0);
    },
    async disableUi() {
      await q("ui", !1);
    },
    async enableChat() {
      await q("chat", !0);
    },
    async disableChat() {
      await q("chat", !1);
    }
  };
}
const mo = "ritual.costOnly", fo = "ritual.simpleHealing", Oi = "ritual.eletrocussao", po = "ritual.simpleDamage", go = "generic.simpleHealing", ho = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Fi() {
  return [
    xi(),
    Mi(),
    Bi(),
    Ui(),
    qi()
  ];
}
function xi() {
  return {
    id: mo,
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
function Mi() {
  return {
    id: fo,
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
    automation: yo(),
    itemPatch: zi()
  };
}
function Bi() {
  return {
    id: Oi,
    version: "1.4.1",
    label: "Eletrocussão",
    description: "Preset inicial de dano de eletricidade. Gasta o custo do ritual, rola 3d6/6d6/8d6 conforme a forma escolhida e prepara ações assistidas para aplicar dano via adapter do sistema e Vulnerável por 1 rodada no alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["eletrocussao", "eletrocucao"]
      }
    ],
    automation: ji(),
    itemPatch: Vi()
  };
}
function Ui() {
  return {
    id: po,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: on()
  };
}
function qi() {
  return {
    id: go,
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
function yo(e = "2d8+2") {
  return bo(
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
function ji() {
  return {
    ...on("3d6", {
      label: "Eletrocussão",
      title: "Eletrocussão",
      damageType: "electric",
      message: "Gasta o custo do ritual, rola dano de eletricidade e prepara aplicação de dano em PV do alvo pelo adapter do sistema. Resistência deve ser resolvida manualmente por enquanto."
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
        notes: [
          "Se o alvo falhar na Fortitude, aplique Atordoado por 1 rodada manualmente."
        ]
      }
    }
  };
}
function on(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return bo(
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
function zi() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: ho,
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
function Vi() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: ho,
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
function bo(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function an() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: oe(t.id),
    actorId: oe(t.actor?.id),
    sceneId: oe(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Ao() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: oe(e.id),
    actorId: oe(t?.id),
    sceneId: oe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function oe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Hi(e) {
  return {
    logFirstRitualCost() {
      const t = W("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = K(t);
      if (!n) return;
      const r = e.ritualCosts.getCost({ actor: t, ritual: n });
      if (!r.ok) {
        d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      d.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: n.name,
        cost: r.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${n.name} custa ${r.value.amount} ${r.value.resource} (${r.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, n = "PE") {
      const r = W("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = K(r);
      if (o) {
        if (!Ki(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(c, "ritual.cost", {
          resource: n,
          amount: t
        }), d.info(`Custo customizado aplicado em ${o.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = W("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = K(t);
      n && (await n.unsetFlag(c, "ritual.cost"), d.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = W("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = K(t);
      if (!n) return;
      const r = e.automationRegistry.require(mo);
      if (!r.ok) {
        d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), d.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = W("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = K(n);
      if (!r) return;
      if (!Fn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(fo);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: yo(t)
      }), d.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = W("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = K(n);
      if (!r) return;
      if (!Fn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(po);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: on(t)
      }), d.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = W("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = K(t);
      n && await Gi(e, t, n);
    }
  };
}
async function Gi(e, t, n) {
  const r = en(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ao(),
    item: n,
    targets: an()
  });
  if (!o.ok) {
    Wi(o.error);
    return;
  }
  d.info("Automação de ritual executada com sucesso.", J(o.value.context));
}
function Wi(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    d.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    d.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  d.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function W(e) {
  const t = Ee.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function K(e) {
  const t = co(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ki(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Fn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Yi = ["disabled", "ask", "automatic"], Qi = ["buttons", "confirm"], To = "ask";
function Zi(e) {
  return typeof e == "string" && Yi.includes(e);
}
function Xi(e) {
  return typeof e == "string" && Qi.includes(e);
}
function Ji(e) {
  return Zi(e) ? e : Xi(e) ? "ask" : To;
}
const es = ["keep", "replace"], ts = ["manual", "assisted"], Ro = "keep", _o = "assisted", ns = !0, E = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function rs() {
  game.settings.register(c, E.executionMode, {
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
    default: To
  }), game.settings.register(c, E.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Ro
  }), game.settings.register(c, E.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: _o
  }), game.settings.register(c, E.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: ns
  }), game.settings.register(c, E.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function xn() {
  const e = Ji(game.settings.get(c, E.executionMode)), t = ko(game.settings.get(c, E.systemCardMode)), n = wo(game.settings.get(c, E.damageResolutionMode));
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: Co()
  };
}
function os() {
  return ko(game.settings.get(c, E.systemCardMode));
}
function as() {
  return wo(game.settings.get(c, E.damageResolutionMode));
}
function Co() {
  return game.settings.get(c, E.ritualCastingCheckEnabled) === !0;
}
async function Y(e) {
  await game.settings.set(c, E.executionMode, e);
}
function ko(e) {
  return es.includes(e) ? e : Ro;
}
function wo(e) {
  return ts.includes(e) ? e : _o;
}
function is(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await Y("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await Y("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await Y(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await Y("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await Y("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await Y("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await Y("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const ss = [
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
function ls(e) {
  return {
    phases() {
      return ss;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = gt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = _i(t);
      if (!n) {
        d.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Mn(e, t, n);
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
      if (!ds(n)) {
        d.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = us(n) ?? gt("Nenhum ator encontrado para executar automação do item.");
      r && await Mn(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = gt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Ri(t);
      if (!n) {
        d.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(go);
        if (!r.ok) {
          d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(n, r.value), d.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (r) {
        d.error("Falha ao configurar automação de teste no item.", r), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function Mn(e, t, n) {
  const r = en(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ao(),
    item: n,
    targets: an()
  });
  if (!o.ok) {
    cs(o.error);
    return;
  }
  d.info("Automação executada com sucesso.", J(o.value.context));
}
function cs(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    d.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    d.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  d.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function gt(e) {
  const t = Ee.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function us(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ds(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ms(e) {
  const t = Li(e), n = ki(e), r = Hi(e), o = ls(e), a = vi(), i = is(e);
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
    async spendSelectedActorPE(l) {
      await t.spendPE(l);
    }
  };
}
function fs(e) {
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
      const r = Bn();
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
      return ps(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Bn();
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
      return gs(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Bn() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function ps(e) {
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
function gs(e) {
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
function hs(e) {
  const t = {
    services: e,
    ordem: e.ordem,
    resources: e.resources,
    damage: e.damage,
    ritualCosts: e.ritualCosts,
    automation: e.automation,
    automationRegistry: e.automationRegistry,
    automationBinder: e.automationBinder,
    workflow: e.workflow,
    itemUseIntegration: e.itemUseIntegration,
    conditions: fs(e.conditions),
    debug: ms(e)
  }, n = globalThis;
  return n[c] = t, n.ParanormalToolkit = t, t;
}
class Un {
  static isSupportedSystem() {
    return game.system.id === ni;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function ys() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ae(t.id),
    actorId: ae(t.actor?.id),
    sceneId: ae(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function $o() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: ae(e.id),
    actorId: ae(t?.id),
    sceneId: ae(e.scene?.id),
    name: n
  };
}
function bs(e, t = $o()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function As(e) {
  if (!_s(e)) return null;
  const t = e.getFlag(c, "workflow");
  return Rs(t) ? t : null;
}
function Ts() {
  return `flags.${c}.workflow`;
}
function qn(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), n = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || n !== void 0;
}
function jn(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Ft(t) || Ft(n);
}
function Rs(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function _s(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ae(e) {
  return Ft(e) ? e : null;
}
function Ft(e) {
  return typeof e == "string" && e.length > 0;
}
function Cs() {
  const e = (t, n) => {
    ks(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function ks(e, t) {
  const n = As(e);
  if (!n || n.targets.length === 0) return;
  const r = $s(t);
  if (!r || r.querySelector(`.${c}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(ws(n));
}
function ws(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(zn("Origem", e.source.name)), t.append(zn("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function zn(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${c}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function $s(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Is() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!Es(r) || !Ss(e) || qn(e) || qn(t)) return;
    const o = ys();
    if (o.length === 0 || !jn(e) && !jn(t)) return;
    const a = $o();
    e.updateSource({
      [Ts()]: bs(o, a)
    }), d.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Es(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Ss(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let Vn = !1, ht = !1, yt = !1, Fe = null;
const Ds = 1e3, Ls = 750, Ps = 1e3;
function Ns(e) {
  Vn || (Hooks.on("combatTurnChange", (t) => {
    Os(e, Hn(t));
  }), Hooks.on("deleteCombat", (t) => {
    Fs(e, Hn(t));
  }), Vn = !0, vs(e));
}
function vs(e) {
  rt() && (ht || (ht = !0, globalThis.setTimeout(() => {
    ht = !1, sn(e, "ready");
  }, Ds)));
}
function Os(e, t) {
  rt() && t && (Fe && globalThis.clearTimeout(Fe), Fe = globalThis.setTimeout(() => {
    Fe = null, sn(e, "combat-turn-change", t);
  }, Ls));
}
function Fs(e, t) {
  rt() && t && (yt || (yt = !0, globalThis.setTimeout(() => {
    yt = !1, sn(e, "combat-deleted", t);
  }, Ps)));
}
async function sn(e, t, n) {
  if (rt())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && d.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const o of r.failures)
        d.warn(o.message);
    } catch (r) {
      d.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function rt() {
  return game.user?.isGM === !0;
}
function Hn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Io = {
  enabled: "dice.animations.enabled"
};
function xs() {
  game.settings.register(c, Io.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Ms() {
  return {
    enabled: game.settings.get(c, Io.enabled) === !0
  };
}
const Eo = "chatCard", Gn = "data-paranormal-toolkit-prompt-id", s = `${c}-item-use-prompt`, Bs = `.${s}__title`, So = `.${s}__header`, Us = `.${s}__roll-card`, qs = `.${s}__roll-meta`, js = `.${s}__roll-meta-pill`, Do = `.${s}__resistance`, zs = `.${s}__resistance-header`, Lo = `.${s}__resistance-description`, ln = `.${s}__resistance-roll-button`, Po = `.${s}__resistance-roll-result`, Wn = `${s}__resistance-content`, No = `.${s}__workflow-section`, vo = `.${s}__workflow-roll`, Oo = `${s}__workflow-roll--dice-open`, Fo = `.${s}__workflow-roll-formula`, xo = `${s}__workflow-roll-formula--toggle`, cn = `.${s}__workflow-dice-tray`, Vs = `.${s}__roll-detail-toggle`, Hs = `.${s}__roll-detail-list`, Gs = `.${s}__ritual-element-badge`, Ws = `.${s}__ritual-metadata`, Ks = "casting-backlash", Ys = "data-paranormal-toolkit-action-section", Qs = "data-paranormal-toolkit-prompt-id", Zs = "data-paranormal-toolkit-pending-id", Kn = "data-paranormal-toolkit-casting-backlash-enhanced", Yn = `.${s}`, Xs = `.${s}__workflow-section--casting`, Js = `.${s}__workflow-section-header`, el = `.${s}__workflow-notes`, tl = `[${Ys}="${Ks}"]`, Qn = `${s}__workflow-section-title-row`, nl = `${s}__workflow-section-header--casting-backlash`, Mo = `${s}__casting-backlash-button`;
function rl(e) {
  for (const t of ol(e))
    al(t), ul(t);
}
function ol(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Yn) && t.add(e);
  for (const n of e.querySelectorAll(Yn))
    t.add(n);
  return Array.from(t);
}
function al(e) {
  const t = e.querySelector(tl);
  if (!t) return;
  const n = il(t);
  if (!n) return;
  const r = e.querySelector(`${Xs} ${Js}`);
  r && (r.classList.add(nl), sl(r), ll(n), r.append(n), t.remove());
}
function il(e) {
  return e.querySelector(
    `button[${Zs}], button[${Qs}]`
  );
}
function sl(e) {
  const t = e.querySelector(`:scope > .${Qn}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Qn);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(Mo) || n.append(o));
  return n;
}
function ll(e) {
  if (e.getAttribute(Kn) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = cl(t, e.disabled);
  e.classList.add(Mo), e.setAttribute(Kn, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function cl(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function ul(e) {
  for (const t of e.querySelectorAll(el)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function dl(e) {
  for (const t of Array.from(e.querySelectorAll(No)))
    for (const n of Array.from(t.querySelectorAll(`${Vs}, ${Hs}`)))
      n.remove();
}
const ml = "data-paranormal-toolkit-resistance-roll-result-enhanced", xe = "data-paranormal-toolkit-prompt-id", Bo = `.${s}__actions`, ot = `.${s}__actions-title`, Uo = `.${s}__button`, fl = "data-paranormal-toolkit-action-section", pl = "data-paranormal-toolkit-damage-resolution-state", Zn = "data-paranormal-toolkit-resistance-damage-refresh-bound", gl = `.${s}__workflow-section--effect`, hl = [0, 80, 180, 400, 900, 1600], yl = "Conjuração DT", bl = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function Al(e) {
  for (const t of Array.from(e.querySelectorAll(Do)))
    Tl(t);
  Sl(e), Dl(e);
}
function Tl(e) {
  const t = e.querySelector(zs), n = e.querySelector(Lo), r = e.querySelector(ln), o = e.querySelector(Po);
  if (!r || !t && !n && !o) return;
  const a = Rl(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && (o.parentElement !== a && !r.contains(o) && a.append(o), _l(o)), r.parentElement !== e && e.append(r);
}
function Rl(e, t) {
  const n = e.querySelector(`.${Wn}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Wn), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function _l(e) {
  const t = Cl(e.textContent ?? "");
  t && (e.setAttribute(ml, "true"), e.replaceChildren($l(t)));
}
function Cl(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, a = n?.trim() ?? "Resistência", i = Number(o);
  if (!Number.isFinite(i)) return null;
  const { formula: l, diceValues: u } = kl(r ?? "");
  return l ? {
    skillLabel: a,
    formula: l,
    total: Math.trunc(i),
    diceValues: u
  } : null;
}
function kl(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: wl(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function wl(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function $l(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${s}__workflow-roll`,
    `${s}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${s}__workflow-roll-formula`), n.textContent = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Il(e);
  return r && t.append(r), t;
}
function Il(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${s}__workflow-dice-tray`);
  for (const n of El(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${s}__workflow-die`), n.active || r.classList.add(`${s}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function El(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Xn(e, "highest") : n.includes("kl") ? Xn(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Xn(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Sl(e) {
  for (const t of Array.from(e.querySelectorAll(`.${s}__roll-card`)))
    qo(t);
}
function qo(e) {
  const t = Pl(e);
  if (!t) return;
  const n = Nl(e), r = e.querySelector(Do);
  if (r && r.parentElement !== t && t.append(r), !n) return;
  n.classList.add(`${s}__actions--embedded`, `${s}__actions--damage-resolution`);
  const o = n.querySelector(ot);
  o && (o.textContent = "Aplicar dano"), n.parentElement !== t && t.append(n), Ol(e), vl(e, n);
}
function Dl(e) {
  for (const t of Array.from(e.querySelectorAll(Bo))) {
    const n = t.querySelector(ot);
    if (un(n?.textContent) !== "aplicar efeito") continue;
    t.classList.add(`${s}__actions--effect-resolution`), n && (n.textContent = "Efeito");
    const r = t.querySelector(Uo);
    if (!r) continue;
    const o = r.textContent?.trim() ?? "";
    if (!o || o.startsWith("✓") || r.dataset.paranormalToolkitEffectActionCompacted === "true") continue;
    const a = document.createElement("span");
    a.classList.add(`${s}__effect-resolution-label`), a.textContent = Ll(o), r.setAttribute("aria-label", `Aplicar ${o}`), r.textContent = "Aplicar", r.dataset.paranormalToolkitEffectActionCompacted = "true", n?.after(a);
  }
}
function Ll(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
function Pl(e) {
  return Array.from(e.querySelectorAll(gl)).find((t) => {
    const n = t.querySelector(`.${s}__workflow-section-header strong`)?.textContent?.trim();
    return un(n) === "dano";
  }) ?? null;
}
function Nl(e) {
  const t = Array.from(e.parentElement?.querySelectorAll(Bo) ?? []);
  return t.find((n) => n.getAttribute(fl) === "apply-damage") ?? t.find((n) => un(n.querySelector(ot)?.textContent) === "aplicar danos") ?? null;
}
function vl(e, t) {
  const n = Array.from(t.querySelectorAll(Uo)), r = Jn(n, "normal"), o = Jn(n, "half");
  if (!r || !o) {
    t.classList.add(`${s}__actions--compact`);
    return;
  }
  const a = Wl();
  if (t.classList.toggle(`${s}__actions--assisted`, a === "assisted"), t.classList.toggle(`${s}__actions--manual`, a !== "assisted"), a !== "assisted") {
    j(r, !0), j(o, !0), Me(t, "manual", null);
    return;
  }
  const i = Fl(e), l = xl(e);
  if (l === null) {
    j(r, !0), j(o, !0), Me(t, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (i === null) {
    j(r, !0), j(o, !1), Me(t, "pending", null);
    return;
  }
  const u = i >= l;
  j(r, !u), j(o, u), Me(
    t,
    u ? "resisted" : "failed",
    u ? `Resistiu: ${i} vs DT ${l}.` : `Falhou: ${i} vs DT ${l}.`
  );
}
function Jn(e, t) {
  const n = bl[t];
  return e.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function j(e, t) {
  e.hidden = !t, e.classList.toggle(`${s}__button--damage-resolution-selected`, t);
}
function Me(e, t, n) {
  e.setAttribute(pl, t);
  const r = e.querySelector(`.${s}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${s}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(ot)?.after(o);
}
function Ol(e) {
  const t = e.querySelector(ln);
  t && t.getAttribute(Zn) !== "true" && (t.setAttribute(Zn, "true"), t.addEventListener("click", () => {
    for (const n of hl)
      globalThis.setTimeout(() => {
        qo(e);
      }, n);
  }));
}
function Fl(e) {
  const t = e.querySelector(ln)?.getAttribute("data-paranormal-toolkit-resistance-roll-result"), n = we(t);
  if (n !== null) return n;
  const r = e.querySelector(Po)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return we(o?.[1] ?? null);
}
function xl(e) {
  const t = ql(e), n = Ml(t);
  if (n !== null) return n;
  const r = Bl(t);
  return r !== null ? r : Ul(e);
}
function Ml(e) {
  const t = Hl(e);
  return t.length === 0 ? null : we(Gl(t, yl));
}
function Bl(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : er(r, ["system", "ritual", "DT"]) ?? er(r, ["system", "ritual", "dt"]);
}
function Ul(e) {
  const t = Array.from(e.querySelectorAll(`.${s}__workflow-section--casting .${s}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return we(n?.[1] ?? null);
}
function ql(e) {
  const t = jl(e);
  if (!t) return null;
  const n = zl(e), r = Vl(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => dn(a) ? a.pendingId === t : !1) ?? null;
}
function jl(e) {
  return (e.closest(`[${xe}]`) ?? e.querySelector(`[${xe}]`) ?? e.parentElement?.querySelector(`[${xe}]`) ?? null)?.getAttribute(xe) ?? null;
}
function zl(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return Kl(o) ? o : null;
}
function Vl(e) {
  const t = e?.getFlag?.(c, Eo);
  return dn(t) ? t : null;
}
function Hl(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Gl(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function er(e, t) {
  let n = e;
  for (const r of t) {
    if (!dn(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : we(typeof n == "string" ? n : null);
}
function we(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Wl() {
  try {
    return as();
  } catch {
    return "assisted";
  }
}
function un(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Kl(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function dn(e) {
  return !!(e && typeof e == "object");
}
function tr(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function mn() {
  const e = globalThis.game;
  return at(e) ? e : null;
}
function D(e, t) {
  const n = Yl(e, t);
  return je(n);
}
function Yl(e, t) {
  return t.split(".").reduce((n, r) => at(n) ? n[r] : null, e);
}
function Ql(e, t) {
  const n = e.indexOf(":");
  return n < 0 || $e(e.slice(0, n)) !== $e(t) ? null : me(e.slice(n + 1));
}
function je(e) {
  return typeof e == "string" ? me(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function at(e) {
  return !!e && typeof e == "object";
}
function Zl(e) {
  return typeof e == "string";
}
function it(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function me(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function $e(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function xt(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function V(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function jo(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Xl(e) {
  for (const t of Array.from(e.querySelectorAll(Us))) {
    const n = ac(t);
    Jl(t), n && (ec(t, n), tc(t, n));
  }
}
function Jl(e) {
  for (const t of Array.from(e.querySelectorAll(qs)))
    t.remove();
}
function ec(e, t) {
  const r = e.closest(`.${s}`)?.querySelector(So) ?? null, o = r?.querySelector(Bs) ?? null, a = r ?? e, i = a.querySelector(Gs);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const l = i ?? document.createElement("span");
  if (l.className = _c(t.elementTone), l.textContent = Rc(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", l);
      return;
    }
    a.prepend(l);
  }
}
function tc(e, t) {
  const n = nc(e);
  rc(e, n);
  const r = oc(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${s}__ritual-metadata`);
  for (const i of r) {
    const l = document.createElement("span");
    l.classList.add(`${s}__ritual-metadata-chip`), l.textContent = i, o.append(l);
  }
  if (n) {
    const i = n.querySelector(`.${s}__summary`);
    if (i?.parentElement === n) {
      i.insertAdjacentElement("afterend", o);
      return;
    }
    n.append(o);
    return;
  }
  const a = e.querySelector(No);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function nc(e) {
  return e.closest(`.${s}`)?.querySelector(So) ?? null;
}
function rc(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(Ws)))
      o.remove();
}
function oc(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${xt(e.target)}` : null,
    e.duration ? `Duração: ${xt(e.duration)}` : null,
    e.resistance ? `Resistência: ${jo(e.resistance)}` : null
  ].filter(it);
}
function ac(e) {
  const t = ic(e), n = mc(e), o = (t ? dc(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = fn(D(o, "element")), l = x("op.elementChoices", i) ?? nr(Z(a, "Elemento")) ?? nr(n.damageType), u = i ?? Cc(l), m = D(o, "circle") ?? Z(a, "Círculo"), f = gc(o) ?? Z(a, "Alvo"), A = Ac(o, "duration", "op.durationChoices") ?? Z(a, "Duração"), R = fc(e) ?? yc(o) ?? Z(a, "Resistência"), _ = pc(a) ?? n.cost, g = {
    elementLabel: l,
    elementTone: u,
    circle: m,
    cost: _,
    target: f,
    duration: A,
    resistance: R
  };
  return Tc(g) ? g : null;
}
function ic(e) {
  const t = sc(e);
  if (!t) return null;
  const n = t.getFlag?.(c, Eo), r = cc(n);
  if (r.length === 0) return null;
  const o = lc(e);
  if (o.size > 0) {
    const a = r.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function sc(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? mn()?.messages?.get?.(n) ?? null : null;
}
function lc(e) {
  const t = e.closest(`.${s}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${Gn}]`))) {
    const o = r.getAttribute(Gn)?.trim();
    o && n.add(o);
  }
  return n;
}
function cc(e) {
  if (!at(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(uc).filter((n) => n !== null) : [];
}
function uc(e) {
  return at(e) ? {
    pendingId: je(e.pendingId),
    actorId: je(e.actorId),
    itemId: je(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Zl) : []
  } : null;
}
function dc(e) {
  if (!e.itemId) return null;
  const t = mn(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function mc(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(js))) {
    const o = me(r.textContent);
    if (!o) continue;
    const a = Ql(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function fc(e) {
  const t = me(e.querySelector(Lo)?.textContent);
  return t ? jo(t) : null;
}
function Z(e, t) {
  const n = $e(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || $e(r.slice(0, o)) !== n))
      return me(r.slice(o + 1));
  }
  return null;
}
function pc(e) {
  const t = Z(e, "Custo") ?? Z(e, "PE");
  return t || (e.map(me).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function gc(e) {
  const t = D(e, "target");
  if (!t) return null;
  if (t === "area")
    return hc(e) ?? x("op.targetChoices", t) ?? "Área";
  const n = x("op.targetChoices", t) ?? V(t);
  return [t === "people" || t === "creatures" ? D(e, "targetQtd") : null, n].filter(it).join(" ");
}
function hc(e) {
  const t = D(e, "area.name"), n = D(e, "area.size"), r = D(e, "area.type"), o = t ? x("op.areaChoices", t) ?? V(t) : null, a = r ? x("op.areaTypeChoices", r) ?? V(r) : null;
  return o ? n ? a ? `${o} ${n}m ${xt(a)}` : `${o} ${n}m` : o : null;
}
function yc(e) {
  const t = D(e, "skillResis"), n = D(e, "resistance");
  if (!t || !n) return null;
  const r = x("op.skill", t) ?? V(t), o = bc(n);
  return [r, o].filter(it).join(" ");
}
function bc(e) {
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
      return x("op.resistanceChoices", e) ?? V(e);
  }
}
function Ac(e, t, n) {
  const r = D(e, t);
  return r ? x(n, r) ?? V(r) : null;
}
function Tc(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Rc(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function _c(e) {
  return [
    `${s}__ritual-element-badge`,
    e ? `${s}__ritual-element-badge--${e}` : null
  ].filter(it).join(" ");
}
function fn(e) {
  const t = $e(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function nr(e) {
  const t = fn(e);
  return t ? x("op.elementChoices", t) ?? V(t) : e ? V(e) : null;
}
function Cc(e) {
  return fn(e);
}
function x(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = mn()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const rr = "data-paranormal-toolkit-dice-toggle-enhanced";
function kc(e) {
  for (const t of Array.from(e.querySelectorAll(vo)))
    zo(t);
}
function wc(e) {
  const t = Ho(e.target);
  if (!t) return;
  const n = pn(t);
  n && (e.preventDefault(), Vo(n, t));
}
function $c(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Ho(e.target);
  if (!t) return;
  const n = pn(t);
  n && (e.preventDefault(), Vo(n, t));
}
function zo(e) {
  const t = e.querySelector(cn);
  if (!t) return;
  const n = e.querySelector(Fo);
  if (n && n.getAttribute(rr) !== "true" && (n.setAttribute(rr, "true"), n.classList.add(xo), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Vo(e, t) {
  const n = e.querySelector(cn);
  if (!n) return;
  const r = !e.classList.contains(Oo);
  Ic(e, t, n, r);
}
function Ic(e, t, n, r) {
  e.classList.toggle(Oo, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Ho(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Fo);
  if (!t) return null;
  const n = pn(t);
  return n ? (zo(n), t.classList.contains(xo) ? t : null) : null;
}
function pn(e) {
  const t = e.closest(vo);
  return t && t.querySelector(cn) ? t : null;
}
const or = `${c}-workflow-dice-toggle-styles`;
function Ec() {
  if (document.getElementById(or)) return;
  const e = document.createElement("style");
  e.id = or, e.textContent = `
.${s}__workflow-section .${s}__roll-detail-toggle,
.${s}__workflow-section .${s}__roll-detail-list {
  display: none !important;
}

.${s}__workflow-roll:not(.${s}__workflow-roll--dice-open) .${s}__workflow-dice-tray,
.${s}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${s}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${s}__workflow-roll-formula--toggle:hover,
.${s}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${s}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${s}__header .${s}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${s}__ritual-element-badge {
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

.${s}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${s}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${s}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${s}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${s}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${s}__header .${s}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${s}__roll-card > .${s}__ritual-metadata {
  display: none !important;
}

.${s}__ritual-metadata-chip {
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

.${s}__resistance {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 34px;
  grid-template-areas: "content button";
  align-items: center !important;
  column-gap: 0.62rem;
  row-gap: 0;
  padding: 0.56rem 0.58rem !important;
}

.${s}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${s}__resistance-content .${s}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${s}__resistance-content .${s}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${s}__resistance-content .${s}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${s}__resistance > .${s}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: center;
}

.${s}__resistance-content .${s}__resistance-roll-result {
  display: block;
  min-width: 0;
  margin-top: 0;
}

.${s}__resistance-workflow-roll {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 0.34rem;
  padding-top: 0.1rem;
}

.${s}__resistance-workflow-roll .${s}__workflow-roll-formula {
  display: inline-flex;
  width: 100%;
  max-width: 100%;
  min-height: 1.78rem;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

.${s}__resistance-workflow-roll .${s}__workflow-roll-formula i {
  margin-left: auto;
}

.${s}__resistance-workflow-roll .${s}__workflow-dice-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
  border-top: 1px solid rgba(79, 55, 42, 0.12);
  padding-top: 0.34rem;
}

.${s}__resistance-workflow-roll .${s}__workflow-die {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.22rem;
  min-height: 1.22rem;
  border: 1px solid rgba(82, 57, 25, 0.18);
  border-radius: 999px;
  padding: 0 0.27rem;
  background: rgba(255, 255, 255, 0.64);
  color: rgba(36, 27, 24, 0.9);
  font-family: var(--font-mono, monospace);
  font-size: 0.7rem;
  font-weight: 800;
  line-height: 1;
  box-sizing: border-box;
}

.${s}__resistance-workflow-roll .${s}__workflow-die--inactive {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(36, 27, 24, 0.46);
  opacity: 0.58;
}
.${s}__workflow-section--casting .${s}__workflow-section-header--casting-backlash {
  grid-template-columns: minmax(0, 1fr) 34px;
}

.${s}__workflow-section-title-row {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.38rem;
}

.${s}__workflow-section-title-row .${s}__workflow-section-status {
  flex: 0 0 auto;
}

.${s}__casting-backlash-button {
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

.${s}__casting-backlash-button::before {
  content: "↪";
  font-size: 1rem;
  font-weight: 950;
  line-height: 1;
}

.${s}__casting-backlash-button:hover,
.${s}__casting-backlash-button:focus {
  border-color: rgba(125, 39, 43, 0.66) !important;
  background: rgba(143, 62, 67, 0.94) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 0 0 2px rgba(125, 39, 43, 0.16) !important;
  outline: none !important;
}

.${s}__casting-backlash-button:disabled {
  cursor: default !important;
  opacity: 0.78 !important;
}

.${s}__casting-backlash-button.${s}__button--executed::before {
  content: "✓";
}

/* 0.21.2 — Resolução de dano integrada no bloco de Dano */
.${s}__workflow-section--effect .${s}__resistance {
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.48rem 0.52rem !important;
  background: rgba(255, 246, 229, 0.52) !important;
  box-shadow: none !important;
}

.${s}__workflow-section--effect .${s}__resistance-content {
  gap: 0.22rem !important;
}

.${s}__workflow-section--effect .${s}__resistance-header strong {
  display: inline !important;
  margin: 0 !important;
}

.${s}__workflow-section--effect .${s}__resistance-description {
  font-size: 0.75rem !important;
  line-height: 1.25 !important;
}

.${s}__actions--embedded {
  margin-top: 0.46rem !important;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${s}__actions--compact,
.${s}__actions--damage-resolution {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center !important;
  gap: 0.34rem !important;
}

.${s}__actions--damage-resolution .${s}__actions-title {
  grid-column: 1 / -1;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.02rem !important;
  color: rgba(71, 47, 34, 0.62) !important;
  font-size: 0.68rem !important;
  font-weight: 900 !important;
  letter-spacing: 0.045em !important;
  line-height: 1 !important;
  text-align: center;
  text-transform: uppercase !important;
}

.${s}__actions--damage-resolution .${s}__actions-title::before,
.${s}__actions--damage-resolution .${s}__actions-title::after {
  content: "";
  display: block;
  border-top: 1px solid rgba(79, 55, 42, 0.16);
}

.${s}__damage-resolution-summary {
  grid-column: 1 / -1;
  margin: -0.04rem 0 0.02rem;
  color: rgba(54, 39, 31, 0.64);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.24;
  text-align: center;
}

.${s}__actions--damage-resolution .${s}__button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: none !important;
  height: auto !important;
  min-height: 1.85rem !important;
  max-height: none !important;
  margin: 0 !important;
  border-radius: 7px !important;
  padding: 0.34rem 0.52rem !important;
  font-size: 0.76rem !important;
  font-weight: 900 !important;
  line-height: 1.1 !important;
  white-space: normal !important;
  aspect-ratio: auto !important;
}

.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="pending"] .${s}__button,
.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${s}__button,
.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${s}__button {
  grid-column: 1 / -1;
}

.${s}__actions--damage-resolution .${s}__button[hidden] {
  display: none !important;
}

.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${s}__damage-resolution-summary {
  color: rgba(34, 93, 55, 0.84);
}

.${s}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${s}__damage-resolution-summary {
  color: rgba(112, 44, 44, 0.82);
}

.${s}__actions--effect-resolution {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "title button"
    "label button";
  align-items: center !important;
  gap: 0.18rem 0.52rem !important;
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.54rem 0.58rem !important;
  background: rgba(255, 250, 238, 0.58) !important;
  box-shadow: none !important;
}

.${s}__actions--effect-resolution .${s}__actions-title {
  grid-area: title;
  margin: 0 !important;
  color: rgba(107, 78, 35, 0.95) !important;
  font-size: 0.78rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.055em !important;
  line-height: 1 !important;
  text-transform: uppercase !important;
}

.${s}__effect-resolution-label {
  grid-area: label;
  min-width: 0;
  color: rgba(36, 27, 24, 0.9);
  font-size: 0.82rem;
  font-weight: 850;
  line-height: 1.22;
  overflow-wrap: anywhere;
}

.${s}__actions--effect-resolution .${s}__button {
  grid-area: button;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: auto !important;
  min-width: 5rem !important;
  max-width: 7rem !important;
  min-height: 1.9rem !important;
  margin: 0 !important;
  border-radius: 7px !important;
  padding: 0.34rem 0.62rem !important;
  font-size: 0.78rem !important;
  font-weight: 900 !important;
  line-height: 1.1 !important;
  white-space: nowrap !important;
  aspect-ratio: auto !important;
}

`, document.head.append(e);
}
const Sc = [0, 100, 500, 1500, 3e3];
let ar = !1, bt = null;
function Dc() {
  if (!ar) {
    ar = !0, Ec(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Re(tr(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Re(tr(t));
    }), Hooks.once("ready", () => {
      Re(document), Lc();
    }), document.addEventListener("click", wc), document.addEventListener("keydown", $c);
    for (const e of Sc)
      globalThis.setTimeout(() => Re(document), e);
  }
}
function Lc() {
  bt || !document.body || (bt = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Re(n);
  }), bt.observe(document.body, { childList: !0, subtree: !0 }));
}
function Re(e) {
  e && (dl(e), Xl(e), Al(e), kc(e), rl(e));
}
function Pc() {
  Dc();
}
const Nc = "data-paranormal-toolkit-action-section", vc = "ritual-log", Oc = ".paranormal-toolkit-item-use-prompt__actions", Fc = ".paranormal-toolkit-item-use-prompt__actions-title", xc = [0, 100, 500, 1500];
let ir = !1;
function Mc() {
  if (ir) return;
  const e = (t, n) => {
    sr(jc(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), sr(document), ir = !0;
}
function sr(e) {
  for (const t of xc)
    globalThis.setTimeout(() => Bc(e), t);
}
function Bc(e) {
  Uc(e), qc(e);
}
function Uc(e) {
  for (const t of e.querySelectorAll(
    `[${Nc}="${vc}"]`
  ))
    t.remove();
}
function qc(e) {
  for (const t of e.querySelectorAll(Oc)) {
    if (lr(t.querySelector(Fc)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (a) => lr(a.textContent ?? "")
    ).some((a) => a.includes("ritual conjurado")) && t.remove();
  }
}
function jc(e) {
  if (e instanceof HTMLElement || zc(e))
    return e;
  if (Vc(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function zc(e) {
  return e instanceof HTMLElement;
}
function Vc(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function lr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Hc = {
  cutting: "cuttingDamage",
  impact: "impactDamage",
  piercing: "piercingDamage",
  ballistic: "ballisticDamage",
  blood: "bloodDamage",
  death: "deathDamage",
  knowledge: "knowledgeDamage",
  energy: "energyDamage",
  fear: "fearDamage",
  fire: "fireDamage",
  cold: "coldDamage",
  electric: "eletricDamage",
  chemical: "chemicalDamage",
  mental: "mentalDamage"
}, Gc = new Set(
  Object.values(Hc)
), Wc = {
  generic: null,
  none: null,
  indefinido: null,
  semtipo: null,
  untyped: null,
  cutting: "cuttingDamage",
  corte: "cuttingDamage",
  cuttingdamage: "cuttingDamage",
  impact: "impactDamage",
  impacto: "impactDamage",
  impactdamage: "impactDamage",
  piercing: "piercingDamage",
  perfurante: "piercingDamage",
  perfuracao: "piercingDamage",
  perfuração: "piercingDamage",
  piercingdamage: "piercingDamage",
  ballistic: "ballisticDamage",
  balistico: "ballisticDamage",
  balístico: "ballisticDamage",
  ballisticdamage: "ballisticDamage",
  blood: "bloodDamage",
  sangue: "bloodDamage",
  blooddamage: "bloodDamage",
  death: "deathDamage",
  morte: "deathDamage",
  deathdamage: "deathDamage",
  knowledge: "knowledgeDamage",
  conhecimento: "knowledgeDamage",
  knowledgedamage: "knowledgeDamage",
  energy: "energyDamage",
  energia: "energyDamage",
  energydamage: "energyDamage",
  fear: "fearDamage",
  medo: "fearDamage",
  feardamage: "fearDamage",
  fire: "fireDamage",
  fogo: "fireDamage",
  firedamage: "fireDamage",
  cold: "coldDamage",
  frio: "coldDamage",
  colddamage: "coldDamage",
  electric: "eletricDamage",
  eletrico: "eletricDamage",
  elétrico: "eletricDamage",
  eletrica: "eletricDamage",
  elétrica: "eletricDamage",
  eletricidade: "eletricDamage",
  electricidade: "eletricDamage",
  electricdamage: "eletricDamage",
  eletricdamage: "eletricDamage",
  chemical: "chemicalDamage",
  quimico: "chemicalDamage",
  químico: "chemicalDamage",
  quimica: "chemicalDamage",
  química: "chemicalDamage",
  chemicaldamage: "chemicalDamage",
  mental: "mentalDamage",
  ment: "mentalDamage",
  mentaldamage: "mentalDamage"
};
function Kc(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Yc(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Wc[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Gc.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function Go(e) {
  switch (e) {
    case "cuttingDamage":
      return "Corte";
    case "impactDamage":
      return "Impacto";
    case "piercingDamage":
      return "Perfurante";
    case "ballisticDamage":
      return "Balístico";
    case "bloodDamage":
      return "Sangue";
    case "deathDamage":
      return "Morte";
    case "knowledgeDamage":
      return "Conhecimento";
    case "energyDamage":
      return "Energia";
    case "fearDamage":
      return "Medo";
    case "fireDamage":
      return "Fogo";
    case "coldDamage":
      return "Frio";
    case "eletricDamage":
      return "Eletricidade";
    case "chemicalDamage":
      return "Químico";
    case "mentalDamage":
      return "Mental";
    case null:
      return "Sem tipo";
  }
}
function Yc(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Qc {
  async applyDamage(t) {
    const n = t.actor, r = n.name ?? "Ator sem nome", o = n.id ?? null;
    if (!Array.isArray(t.instances) || t.instances.length === 0)
      return p({
        actor: n,
        actorId: o,
        actorName: r,
        reason: "empty-damage",
        message: "Nenhuma instância de dano foi informada."
      });
    const a = n.applyDamage;
    if (typeof a != "function")
      return p({
        actor: n,
        actorId: o,
        actorName: r,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const i = [], l = /* @__PURE__ */ new Set();
    let u = null;
    for (const [m, f] of t.instances.entries()) {
      const A = Zc(f, m);
      if (!A.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const R = Kc(f.damageType);
      if (!R.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(f.damageType)}.`,
          instance: f,
          damageType: f.damageType
        });
      if (A.amount === 0) {
        i.push(
          Xc(A.id, f, R.value)
        );
        continue;
      }
      try {
        const _ = await Promise.resolve(
          a.call(n, A.amount, {
            damageType: R.value ?? void 0,
            ignoreRD: f.ignoreResistance === !0,
            nonLethal: f.nonLethal === !0
          })
        );
        for (const N of eu(_.conditions))
          l.add(N);
        const g = Jc(_.newPV);
        g !== null && (u = g), i.push({
          id: A.id,
          label: f.label ?? Go(R.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: A.amount,
          finalDamage: cr(_.finalDamage, A.amount),
          blocked: cr(_.blocked, 0),
          damageType: f.damageType ? String(f.damageType) : null,
          systemDamageType: R.value,
          ignoreResistance: f.ignoreResistance === !0,
          nonLethal: f.nonLethal === !0
        });
      } catch (_) {
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: f,
          cause: _
        });
      }
    }
    return y({
      actor: n,
      actorId: o,
      actorName: r,
      totalRawDamage: i.reduce(
        (m, f) => m + f.inputAmount,
        0
      ),
      totalFinalDamage: i.reduce(
        (m, f) => m + f.finalDamage,
        0
      ),
      totalBlocked: i.reduce(
        (m, f) => m + f.blocked,
        0
      ),
      newPV: u,
      conditions: Array.from(l),
      instances: i,
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
function Zc(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Xc(e, t, n) {
  return {
    id: e,
    label: t.label ?? Go(n),
    sourceRollId: t.sourceRollId ?? null,
    inputAmount: 0,
    finalDamage: 0,
    blocked: 0,
    damageType: t.damageType ? String(t.damageType) : null,
    systemDamageType: n,
    ignoreResistance: t.ignoreResistance === !0,
    nonLethal: t.nonLethal === !0
  };
}
function cr(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Jc(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function eu(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const _e = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Wo = {
  PV: "system.attributes.hp"
}, Mt = {
  PV: [_e.PV, Wo.PV],
  SAN: [_e.SAN],
  PE: [_e.PE],
  PD: [_e.PD]
}, Bt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class tu {
  getResource(t, n) {
    const r = ur(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, i = `${o}.max`, l = foundry.utils.getProperty(t, a), u = foundry.utils.getProperty(t, i), m = mr(t, n, a, l, "valor atual");
    if (m) return p(m);
    const f = mr(t, n, i, u, "valor máximo");
    return f ? p(f) : y({
      value: l,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = ur(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function ur(e, t) {
  const n = nu(e.type, t);
  if (n && dr(e, n))
    return y(n);
  const r = Mt[t].find(
    (o) => dr(e, o)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: ru(e, t),
    path: Mt[t].join(" | ")
  });
}
function nu(e, t) {
  return e === "threat" ? Wo[t] ?? null : e === "agent" ? _e[t] : null;
}
function dr(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function ru(e, t) {
  const n = e.type ?? "unknown", r = Mt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function mr(e, t, n, r, o) {
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
class ou {
  isRitual(t) {
    return t.type === "ritual";
  }
  getCircle(t) {
    if (!this.isRitual(t))
      return p({
        reason: "not-a-ritual",
        message: `Item ${t.name ?? "sem nome"} não é um ritual.`,
        ritual: t
      });
    const n = this.readCircleFromKnownPaths(t);
    if (!n) {
      const i = Bt.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: r, value: o } = n, a = au(o);
    return a ? y(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Bt.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function au(e) {
  if (fr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (fr(n))
      return n;
  }
  return null;
}
function fr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const iu = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class su {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const n = this.ritualAdapter.getCircle(t.ritual);
    if (!n.ok)
      return p({
        ...n.error,
        actor: t.actor
      });
    const r = n.value, o = lu(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: iu[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function lu(e, t) {
  const n = e.getFlag(c, "ritual.cost");
  return n == null ? { ok: !0, value: null } : cu(n) ? {
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
function cu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const At = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function uu(e) {
  if (!hu(e.item)) return null;
  const t = Ut(e.actor) ? e.actor : du(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: fu(e.token) ?? mu(t),
    targets: an(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function du(e) {
  const t = e;
  return Ut(t.actor) ? t.actor : Ut(e.parent) ? e.parent : null;
}
function mu(e) {
  const t = pu(e) ?? gu(e);
  return t ? Ko(t) : null;
}
function fu(e) {
  return qt(e) ? Ko(e) : null;
}
function pu(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return qt(n) ? n : (t.getActiveTokens?.() ?? []).find(qt) ?? null;
}
function gu(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Ko(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Tt(e.id),
    actorId: Tt(t?.id),
    sceneId: Tt(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function hu(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ut(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function qt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Tt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class yu {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(At.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, d.info(`${At.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = uu(bu(t));
    if (!n) {
      d.warn(`${At.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function bu(e) {
  return e && typeof e == "object" ? e : {};
}
class Au {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return Rt("missing-item-patch");
    if (t.type !== "ritual") return Rt("unsupported-item-type");
    const o = Tu(r);
    return Object.keys(o).length === 0 ? Rt("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Tu(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (w(t, "system.circle", n.circle), w(t, "system.element", n.element), w(t, "system.target", n.target), w(t, "system.targetQtd", n.targetQuantity), w(t, "system.execution", n.execution), w(t, "system.range", n.range), w(t, "system.duration", n.duration), w(t, "system.skillResis", n.resistanceSkill), w(t, "system.resistance", n.resistance), w(t, "system.studentForm", n.studentForm), w(t, "system.trueForm", n.trueForm)), t;
}
function w(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function Rt(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Ru {
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
    return this.getNumber(t, Bt.ritual.dt, 0);
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
class _u {
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
    await t.unsetFlag(c, "automation");
  }
  async writeAutomationFlag(t, n) {
    await this.clear(t), await t.setFlag(c, "automation", n);
  }
}
class Cu {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = ku(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, _t(t)), y(t)) : n;
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
    return n ? _t(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? y(n) : p({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(_t);
  }
  findForItem(t) {
    return this.list().map((n) => wu(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function ku(e) {
  return !Ct(e.id) || !Ct(e.version) || !Ct(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function wu(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = $u(o, t);
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
function $u(e, t) {
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
      const n = pr(t.name), r = e.names.map(pr).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Iu(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function pr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Iu(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function _t(e) {
  return structuredClone(e);
}
function Ct(e) {
  return typeof e == "string" && e.length > 0;
}
function We(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = st(e.amountFrom);
    if (!n)
      return p({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const r = t.rolls[n];
    if (!r)
      return p({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${n}.`
      });
    const o = Math.trunc(r.total);
    return !Number.isInteger(o) || o <= 0 ? p({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : y(o);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function st(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const Eu = "dice-so-nice";
async function Yo(e) {
  if (!Su() || !Du()) return;
  const t = Lu();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      d.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Su() {
  try {
    return Ms().enabled;
  } catch {
    return !1;
  }
}
function Du() {
  return game.modules?.get?.(Eu)?.active === !0;
}
function Lu() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Pu(e, t, n) {
  if (!gr(e.id) || !gr(e.formula))
    return p({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(e.formula), o = await Promise.resolve(r.evaluate()), a = o.total;
    if (typeof a != "number" || !Number.isFinite(a))
      return p({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await Yo(o);
    const l = {
      ...n.rollRequests[e.id] ?? Qo(e, t),
      total: a,
      roll: o
    };
    return n.rolls[e.id] = l, y(l);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function Qo(e, t) {
  const n = e.intent ?? Nu(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function Nu(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function gr(e) {
  return typeof e == "string" && e.length > 0;
}
async function Ke(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Be(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Be(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? Be(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? Be(t, n, r, o) : e.recover(t, n, o);
  }
}
function Be(e, t, n, r) {
  return p({
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
function vu(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = Ou(t, n, r, o);
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
    const i = Fu(t, n, r, o);
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
function Ou(e, t, n, r) {
  const o = st(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: Zo(t.id, "damage", r, t.damageInstances.length),
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
function Fu(e, t, n, r) {
  const o = st(e.amountFrom);
  return {
    id: Zo(t.id, "healing", r, t.healingInstances.length),
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
function Zo(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function xu(e, t, n) {
  const r = st(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function Mu(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Xo("before", e), hr("before", e), hr("resolve", e);
}
function Bu(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Xo("apply", e);
}
function Uu(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Xo(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t, l = qu(e, n.operation);
  l && i.emit(l, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function hr(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t;
  n.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function qu(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function ju(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), y(void 0);
  } catch (r) {
    return p({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function zu(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Vu(e, t);
    case "spendRitualCost":
      return Hu(e, t);
  }
}
async function Vu(e, t) {
  const { context: n, resources: r } = e, o = We(t, n);
  return o.ok ? Jo(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function Hu(e, t) {
  const { context: n, resources: r, ritualCosts: o } = e, a = o.getCost({
    actor: n.sourceActor,
    ritual: n.item
  });
  if (!a.ok)
    return p({
      reason: "ritual-cost-failed",
      message: a.error.message,
      cause: a.error
    });
  const i = a.value;
  return n.ritualCosts.push({
    ...i,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), Jo(await r.spend(n.sourceActor, i.resource, i.amount), n, t);
}
function Jo(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Gu(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, i = Wu(t);
  for (const u of i.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const l = await a();
  if (!l.ok)
    return l;
  for (const u of i.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return l;
}
function Wu(e) {
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
class Ku {
  constructor(t, n, r, o) {
    this.resources = t, this.ritualCosts = n, this.messages = r, this.lifecycle = o;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, n) {
    if (t.steps.length === 0)
      return p({
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
        return Gu({
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
        return p({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: r,
          step: t,
          context: n
        });
    }
  }
  async runCostStep(t, n, r) {
    const o = await zu({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = Qo(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const i = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, i), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: i }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await Pu(t, r, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = We(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = xu(t, n, o.value);
    Mu({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), Bu({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    });
    const i = this.resolveActors(t.actor, n);
    if (i.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const l of i) {
      const u = await Ke(this.resources, l, t.resource, t.operation, o.value), m = this.handleResourceOperationResult(u, n, r, t);
      if (!m.ok)
        return m;
      vu({
        step: t,
        context: n,
        transaction: m.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Uu({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = We(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = this.resolveActors(t.actor, n);
    if (a.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const i of a) {
      const l = await Ke(this.resources, i, t.resource, t.operation, o.value), u = this.handleResourceOperationResult(l, n, r, t);
      if (!u.ok)
        return u;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await ju(this.messages, t, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, o) {
    return t.ok ? (n.resourceTransactions.push(t.value), y(t.value)) : p({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: o,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, o, a, i) {
    const l = Yu(t, n.intent);
    l && this.lifecycle.emit(l, r, {
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
function Yu(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Qu {
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
      return p({
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
      return p({
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
    const i = a.value, l = this.calculate(r, i, o);
    if (!l.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: l.error.reason,
        message: l.error.message,
        requestedAmount: o,
        current: i.value,
        required: o
      });
    const { afterValue: u, appliedAmount: m } = l.value, f = {
      value: u,
      max: i.max
    };
    try {
      u !== i.value && await this.adapter.updateResourceValue(t, n, u);
    } catch (A) {
      return p({
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
        cause: A
      });
    }
    return y({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: o,
      appliedAmount: m,
      before: i,
      after: f
    });
  }
  calculate(t, n, r) {
    switch (t) {
      case "spend":
        return n.value < r ? p({
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
function ea(e) {
  return {
    id: Zu(),
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
function Zu() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Xu {
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
    return J(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = ea(n);
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
class Ju {
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
    }), Hooks.callAll(`${c}.workflow.${t}`, o), Hooks.callAll(`${c}.workflow.phase`, o), o;
  }
}
class ed {
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
    const n = Ot();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: td(),
      flags: {
        ...t.flags,
        [c]: {
          ...nd(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && d.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = Ot();
    if (!r.enabled)
      return;
    const o = n.notification ?? yr(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = yr(n);
    switch (t) {
      case "info":
        d.info(r, n.data ?? "");
        return;
      case "warn":
        d.warn(r, n.data ?? "");
        return;
      case "error":
        d.error(r, n.data ?? "");
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
function yr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function td() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function nd(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function rd(e, t) {
  const n = ud(e?.rounds);
  if (!n)
    return br(null);
  const r = e?.anchor ?? ta(t);
  if (!r)
    return {
      ...br(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: od(),
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
function ta(e) {
  const t = dd();
  if (!t?.id || !na(t.round)) return null;
  const n = ld(t), r = ad(e, n) ?? sd(t), o = z(r?.id), a = fd(r?.initiative), i = id(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: i,
    initiative: a,
    time: md()
  };
}
function od() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function br(e) {
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
function ad(e, t) {
  return e?.id ? t.find((n) => cd(n) === e.id) ?? null : null;
}
function id(e, t, n) {
  const r = z(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return pd(e.turn) ? e.turn : null;
}
function sd(e) {
  return ze(e.combatant) ? e.combatant : null;
}
function ld(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(ze);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(ze);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(ze);
  }
  return [];
}
function cd(e) {
  return z(e.actor?.id) ?? z(e.actorId) ?? z(e.token?.actor?.id) ?? z(e.token?.actorId) ?? z(e.document?.actor?.id) ?? z(e.document?.actorId);
}
function ud(e) {
  return na(e) ? Math.trunc(e) : null;
}
function dd() {
  return game.combat ?? null;
}
function md() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function ze(e) {
  return !!(e && typeof e == "object");
}
function z(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function fd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function na(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function pd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class gd {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? y(n.value) : p({
      conditionId: t,
      reason: "condition-not-found",
      message: n.error.message
    });
  }
  async applyCondition(t) {
    const n = this.registry.get(t.conditionId);
    if (!n.ok)
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "condition-not-found",
        message: n.error.message
      });
    const r = t.actor;
    if (!wd(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = rd(t.duration, r), i = hd(o, t, a), u = t.refreshExisting ?? !0 ? $d(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(i)), y(Ar(r, o, u.id ?? null, !1, !0, a));
      } catch (m) {
        return p({
          actor: r,
          actorId: r.id ?? null,
          actorName: r.name ?? "Ator sem nome",
          conditionId: o.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
          cause: m
        });
      }
    try {
      const f = (await r.createEmbeddedDocuments("ActiveEffect", [i]))[0]?.id ?? null;
      return y(Ar(r, o, f, !0, !1, a));
    } catch (m) {
      return p({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: o.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
        cause: m
      });
    }
  }
  async removeCondition(t) {
    const n = t.actor;
    if (!n || typeof n != "object")
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: "Ator inválido para remover condição."
      });
    const r = this.resolveCanonicalConditionId(t.conditionId), o = oa(n, r);
    let a = 0;
    try {
      for (const i of o)
        await Tr(n, i) === "deleted" && (a += 1);
    } catch (i) {
      return p({
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
    const n = Sd(), r = [];
    let o = 0, a = 0;
    for (const i of n) {
      const l = gn(i);
      o += l.length;
      for (const u of l) {
        if (!Ad(u, t)) continue;
        const m = ra(u);
        try {
          await Tr(i, u) === "deleted" && (a += 1);
        } catch (f) {
          r.push({
            actorId: i.id ?? null,
            actorName: i.name ?? "Ator sem nome",
            effectId: u.id ?? null,
            conditionId: m.conditionId,
            message: `Falha ao remover condição expirada ${m.conditionId ?? u.name ?? "desconhecida"} de ${i.name ?? "ator sem nome"}.`,
            cause: f
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
function hd(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Bd(),
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
    img: e.icon,
    description: e.description,
    origin: t.originUuid ?? void 0,
    disabled: !1,
    transfer: !1,
    changes: e.changes.map((o) => ({ ...o })),
    duration: yd(n.duration),
    start: bd(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [c]: r
    }
  };
}
function yd(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function bd(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Md(),
    ...e
  };
}
function Ar(e, t, n, r, o, a) {
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
function Ad(e, t) {
  const n = ra(e);
  if (!n.conditionId || !Td(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = xd();
  return n.durationMode === "combatantTurn" || Rd(n) ? Cd(n, r) : _d(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !L(n.startRound) || !L(n.requestedRounds) || !L(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Td(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && L(e.requestedRounds);
}
function Rd(e) {
  return !!(e.combatDurationApplied && L(e.requestedRounds) && L(e.startRound) && (e.startCombatantId || Ye(e.startTurn)));
}
function _d(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Cd(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !L(e.startRound) || !L(e.requestedRounds) || !L(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = kd(t);
  return e.startCombatantId ? r === e.startCombatantId : Ye(e.startTurn) && Ye(t.turn) ? t.turn === e.startTurn : !1;
}
function kd(e) {
  return ie(e.combatant?.id);
}
function ra(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ve(e, "conditionId"),
    requestedRounds: Rr(e, "requestedRounds") ?? Ce(t.value) ?? Ce(t.rounds),
    combatDurationApplied: kt(e, "combatDurationApplied"),
    combatId: Ve(e, "combatId") ?? ie(n.combat) ?? ie(t.combat),
    startCombatantId: Ve(e, "startCombatantId") ?? ie(n.combatant),
    startInitiative: Nd(e, "startInitiative") ?? aa(n.initiative),
    startRound: Rr(e, "startRound") ?? Ce(n.round) ?? Ce(t.startRound),
    startTurn: Pd(e, "startTurn") ?? jt(n.turn) ?? jt(t.startTurn),
    expiryEvent: vd(e, "expiryEvent") ?? ia(t.expiry),
    durationMode: Od(e, "durationMode"),
    deleteOnExpire: kt(e, "deleteOnExpire"),
    expiresWithCombat: kt(e, "expiresWithCombat")
  };
}
function wd(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function $d(e, t) {
  return oa(e, t)[0] ?? null;
}
function oa(e, t) {
  return gn(e).filter((n) => Ld(n) === t);
}
async function Tr(e, t) {
  const n = t.id ?? null, r = n ? Id(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (Ed(o)) return "missing";
    throw o;
  }
}
function Id(e, t) {
  return gn(e).find((n) => n.id === t) ?? null;
}
function Ed(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Sd() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Ue(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Ue(e, n);
  });
  for (const n of Dd())
    Ue(e, n.actor), Ue(e, n.document?.actor);
  return Array.from(e.values());
}
function Ue(e, t) {
  if (!Fd(t)) return;
  const r = ie(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Dd() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function gn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Ld(e) {
  return Ve(e, "conditionId");
}
function Ve(e, t) {
  return ie(te(e, t));
}
function Rr(e, t) {
  return Ce(te(e, t));
}
function Pd(e, t) {
  return jt(te(e, t));
}
function Nd(e, t) {
  return aa(te(e, t));
}
function vd(e, t) {
  return ia(te(e, t));
}
function Od(e, t) {
  const n = te(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function kt(e, t) {
  return te(e, t) === !0;
}
function te(e, t) {
  const n = e.getFlag?.(c, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const o = r[c];
  if (!(!o || typeof o != "object"))
    return o[t];
}
function ie(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ce(e) {
  return L(e) ? Math.trunc(e) : null;
}
function jt(e) {
  return Ye(e) ? Math.trunc(e) : null;
}
function aa(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ia(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Fd(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function xd() {
  return game.combat ?? null;
}
function Md() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function L(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Ye(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Bd() {
  return game.user?.id ?? null;
}
const Ud = "icons/svg/downgrade.svg", qd = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Ud,
    description: qd,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const jd = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), zd = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Vd = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Hd = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Gd = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Wd = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Kd = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Yd = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Qd = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Zd = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Xd = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Jd = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), em = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), tm = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), nm = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), rm = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), om = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), am = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), im = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), sm = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), lm = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), cm = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), um = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), dm = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), mm = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), fm = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), pm = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), gm = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), hm = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), ym = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), bm = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Am = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Tm = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Rm = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), _m = [
  jd,
  zd,
  Vd,
  Hd,
  Gd,
  Wd,
  Kd,
  Yd,
  Qd,
  Zd,
  Xd,
  Jd,
  em,
  tm,
  nm,
  rm,
  om,
  am,
  im,
  sm,
  lm,
  cm,
  um,
  dm,
  mm,
  fm,
  pm,
  gm,
  hm,
  ym,
  bm,
  Am,
  Tm,
  Rm
];
class Cm {
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
    return Array.from(this.definitions.values()).map(_r);
  }
  get(t) {
    const n = this.lookup.get(Cr(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(_r(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Cr(t);
    r && this.lookup.set(r, n);
  }
}
function km() {
  return new Cm(_m);
}
function _r(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Cr(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const wm = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", sa = `${c}-inline-roll-neutralized`, $m = `${c}-inline-roll-notice`, hn = `data-${c}-inline-roll-neutralized`, kr = `data-${c}-inline-roll-notice`, Im = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function wr(e) {
  const t = qm(e.message), n = await Em(e.message), r = Sm(t);
  return n.replacementCount + r.replacementCount > 0 && d.info("Rolagens inline neutralizadas para item automatizado.", {
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
async function Em(e) {
  const t = Mm(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = Dm(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Bm(t, n.content), replacementCount: n.replacementCount };
}
function Sm(e) {
  const t = e ? Um(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = la(t);
  return n > 0 && ca(Om(t)), { replacementCount: n };
}
function Dm(e) {
  const t = Lm(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = la(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (ca(n.content), { content: n.innerHTML, replacementCount: o });
}
function Lm(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, Nm(o.trim()))), replacementCount: t };
}
function la(e) {
  const t = Pm(e);
  for (const n of t)
    n.replaceWith(vm(Fm(n)));
  return t.length;
}
function Pm(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(wm))
    n.getAttribute(hn) !== "true" && t.add(n);
  return Array.from(t);
}
function Nm(e) {
  return `<span class="${sa}" ${hn}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${jm(e)}</span>`;
}
function vm(e) {
  const t = document.createElement("span");
  return t.classList.add(sa), t.setAttribute(hn, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function ca(e) {
  if (e.querySelector?.(`[${kr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add($m), t.setAttribute(kr, "true"), t.textContent = Im, e.append(t);
}
function Om(e) {
  return e.querySelector(".message-content") ?? e;
}
function Fm(e) {
  const n = e.getAttribute("data-formula") ?? xm(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function xm(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Mm(e) {
  return e && typeof e == "object" ? e : null;
}
async function Bm(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return d.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Um(e) {
  const t = zm(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function qm(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function jm(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function zm(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Qe = "ritualRollConfig", se = "ritual-roll";
function lt() {
  return {
    schemaVersion: 1,
    intent: "damage",
    damageType: null,
    utilityLabel: "Resultado",
    note: "",
    forms: {
      base: { formula: "" },
      discente: { formula: "" },
      verdadeiro: { formula: "" }
    }
  };
}
function ua(e) {
  const t = e.getFlag(c, Qe);
  return zt(t);
}
function da(e) {
  return ua(e) ?? lt();
}
async function Vm(e, t) {
  const n = zt(t) ?? zt({
    ...lt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(c, Qe, n), n;
}
async function Hm(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, c, Qe));
    return;
  }
  await e.setFlag(c, Qe, null);
}
function zt(e) {
  if (!ct(e)) return null;
  const t = ef(e.intent);
  if (!t) return null;
  const n = lt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Ze(e.damageType),
    utilityLabel: Ze(e.utilityLabel) ?? n.utilityLabel,
    note: yn(e.note),
    forms: tf(e.forms)
  };
}
function Gm(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Wm(e) {
  const t = ua(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = Km(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...Ym(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: Zm(e, t),
    resistance: t.intent === "damage" ? Xm(e) : void 0
  };
}
function Km(e, t) {
  const n = {
    type: "rollFormula",
    id: se,
    formula: t,
    intent: Jm(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function Ym(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${se}.total`,
          ...Qm(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${se}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function Qm(e) {
  return e ? { damageType: e } : {};
}
function Zm(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [se]: n
      }
    }
  };
  return $r(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [se]: t.forms.discente.formula.trim()
    }
  }), $r(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [se]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Xm(e) {
  const t = ma(e), n = Ze(t.skillResis), r = Ze(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = nf(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function Jm(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function ef(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function tf(e) {
  const t = lt();
  return ct(e) ? {
    base: wt(e.base),
    discente: wt(e.discente),
    verdadeiro: wt(e.verdadeiro)
  } : t.forms;
}
function wt(e) {
  return ct(e) ? { formula: yn(e.formula) } : { formula: "" };
}
function $r(e, t) {
  const n = ma(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return rf(r);
}
function ma(e) {
  const t = e.system;
  return ct(t) ? t : {};
}
function nf(e) {
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
function rf(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function yn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Ze(e) {
  const t = yn(e);
  return t.length > 0 ? t : null;
}
function ct(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const Ir = "occultism";
function of(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function af(e) {
  const t = of(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await sf(e, Ir);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Yo(n);
  const r = uf(n);
  return {
    skill: Ir,
    skillLabel: "Ocultismo",
    roll: n,
    formula: cf(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: df(n)
  };
}
async function sf(e, t) {
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
  return lf(r);
}
function lf(e) {
  return Er(e) ? e : Array.isArray(e) ? e.find(Er) ?? null : null;
}
function Er(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function cf(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function uf(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function df(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(mf);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function mf(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function ff(e) {
  switch (pf(e)) {
    case "cutting":
    case "cuttingdamage":
    case "corte":
      return "Corte";
    case "impact":
    case "impactdamage":
    case "impacto":
      return "Impacto";
    case "piercing":
    case "piercingdamage":
    case "perfurante":
      return "Perfurante";
    case "ballistic":
    case "ballisticdamage":
    case "balistico":
      return "Balístico";
    case "blood":
    case "blooddamage":
    case "sangue":
      return "Sangue";
    case "death":
    case "deathdamage":
    case "morte":
      return "Morte";
    case "knowledge":
    case "knowledgedamage":
    case "conhecimento":
      return "Conhecimento";
    case "energy":
    case "energydamage":
    case "energia":
      return "Energia";
    case "fear":
    case "feardamage":
    case "medo":
      return "Medo";
    case "fire":
    case "firedamage":
    case "fogo":
      return "Fogo";
    case "cold":
    case "colddamage":
    case "frio":
      return "Frio";
    case "electric":
    case "electricdamage":
    case "eletricdamage":
    case "eletricodamage":
    case "eletricidade":
    case "eletrico":
    case "eletrica":
      return "Eletricidade";
    case "chemical":
    case "chemicaldamage":
    case "quimico":
    case "quimica":
      return "Químico";
    case "mental":
    case "mentaldamage":
      return "Mental";
    case null:
      return "Sem tipo";
    default:
      return gf(String(e ?? ""));
  }
}
function pf(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function gf(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function hf(e) {
  return {
    header: {
      eyebrow: Jt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Rf(e.ritual)
    },
    forms: e.variantOptions.map((t) => yf(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: Tf(e.automationStatus ?? "assisted")
  };
}
function yf(e, t) {
  const n = bf(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Af(t) : "—",
    details: n
  };
}
function bf(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Af(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function Tf(e) {
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
function Rf(e) {
  const t = e.system, n = [Cf(t?.element), _f(t?.circle)].filter($f);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function _f(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Cf(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (kf(e)) {
    case "blood":
    case "op.elementchoices.blood":
      return "Sangue";
    case "death":
    case "op.elementchoices.death":
      return "Morte";
    case "knowledge":
    case "op.elementchoices.knowledge":
      return "Conhecimento";
    case "energy":
    case "op.elementchoices.energy":
      return "Energia";
    case "fear":
    case "op.elementchoices.fear":
      return "Medo";
    default:
      return wf(e);
  }
}
function kf(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function wf(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function $f(e) {
  return typeof e == "string" && e.length > 0;
}
const fa = ["base", "discente", "verdadeiro"];
function pa(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Xe(e) {
  return typeof e == "string" && fa.includes(e);
}
const { ApplicationV2: If } = foundry.applications.api;
class ke extends If {
  constructor(t, n) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = hf(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
  }
  resolveRequest;
  model;
  selectedVariant = "base";
  spendResource = !0;
  isResolved = !1;
  static DEFAULT_OPTIONS = {
    id: `${c}-ritual-cast`,
    classes: [c, "paranormal-toolkit-ritual-cast-app"],
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
      cast: ke.onCast,
      cancel: ke.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new ke(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    Sf(o, (a) => {
      this.selectedVariant = a;
    }), Df(o, (a) => {
      this.spendResource = a;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${$(this.model.header.eyebrow)}</p>
        <div>
          <h2>${$(this.model.header.title)}</h2>
          <p>${$(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(Ef).join("")}
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
          <div><dt>Custo base</dt><dd>${$(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${$(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${$(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${$(this.model.automation.title)}</strong></p>
        <p>${$(this.model.automation.description)}</p>
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
    const n = Nf(t), r = Lf(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function Ef(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((a) => `<span>${$(a)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${$(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${$(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${$(e.label)}</strong>
        <em>${$(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function Sf(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Sr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Sr(e, o, t));
    });
  const r = ga(e);
  r && t(r);
}
function Sr(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Xe(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), ga(e));
}
function ga(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && Xe(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Df(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function Lf(e, t, n) {
  const r = Pf(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function Pf(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Xe(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Xe(n) ? n : null;
}
function Nf(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function $(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function vf(e) {
  return ke.request(e);
}
const bn = {
  label: "Padrão"
}, Of = {
  label: "Discente",
  extraCost: 2
}, Ff = {
  label: "Verdadeiro",
  extraCost: 5
};
class xf {
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
    const r = this.resolveCostPreview(t), o = Ip(n), a = kp(
      n,
      t.item,
      r,
      o
    ), i = await vf({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((k) => k.name),
      cost: r,
      defaultSpendResource: Np(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const l = Mf(i), u = Sp(
      n,
      t.item,
      l.variant,
      o
    ), m = Co();
    let f = null;
    if (m) {
      const k = await Uf(
        this.resources,
        t.actor,
        l,
        u,
        r
      );
      if (!k.ok)
        return {
          status: "failed",
          reason: k.reason,
          message: k.message
        };
      try {
        f = await af(
          t.actor
        );
      } catch (U) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: U instanceof Error ? U.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: U
        };
      }
    }
    const A = Bf(
      n,
      l,
      u,
      r,
      {
        includeCostSteps: !m
      }
    );
    if (A.steps.length === 0) {
      const k = Ep(
        t,
        l
      ), U = Dr(
        t.actor,
        f,
        u,
        r
      ), Dn = Lr(
        n,
        l,
        u,
        r,
        k,
        t,
        f
      );
      return U.length > 0 ? {
        status: "ready",
        workflowContext: k,
        actions: U,
        summaryLines: Dn
      } : {
        status: "completed-without-actions",
        workflowContext: k,
        summaryLines: Dn
      };
    }
    const R = await this.workflow.runAutomation(A, {
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
          variant: l.variant,
          spendResource: l.spendResource
        }
      }
    });
    if (!R.ok)
      return {
        status: "failed",
        reason: R.error.reason,
        message: R.error.message,
        cause: R.error
      };
    const _ = R.value.context, g = Wf(
      n,
      t,
      _
    ), N = jf(
      n,
      t
    ), he = Dr(
      t.actor,
      f,
      u,
      r
    ), ye = Lr(
      n,
      l,
      u,
      r,
      _,
      t,
      f
    );
    if (!g.ok)
      return {
        status: "failed",
        reason: g.reason,
        message: g.message
      };
    if (!N.ok)
      return {
        status: "failed",
        reason: N.reason,
        message: N.message
      };
    const be = [
      ...he,
      ...g.actions,
      ...N.actions
    ];
    return be.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: _,
      summaryLines: ye
    } : {
      status: "ready",
      workflowContext: _,
      actions: be,
      summaryLines: ye
    };
  }
  async applyAction(t) {
    return Ke(
      this.resources,
      t.actor,
      t.resource,
      t.operation,
      t.amount
    );
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
function Mf(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function Bf(e, t, n, r, o) {
  const a = [], i = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || Tn(l) && (!o.includeCostSteps || !i) || a.push(qf(l, n));
  return o.includeCostSteps && i && r && vp(n.extraCost) && a.push({
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
async function Uf(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = De(o, r);
  if (!a)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (a.amount <= 0) return { ok: !0 };
  const i = await e.spend(
    t,
    a.resource,
    a.amount
  );
  return i.ok ? { ok: !0 } : {
    ok: !1,
    reason: i.error.reason,
    message: i.error.message
  };
}
function qf(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Dr(e, t, n, r) {
  if (!t || t.success) return [];
  const o = De(r, n);
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
function jf(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = An(r.actor, t);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const a of o) {
      const i = ta(a);
      n.push(
        zf(
          r,
          a,
          t.item,
          i
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function zf(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? Gf(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: Vf(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Hf(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Vf(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Hf(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Gf(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Wf(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const i = We(a, n);
    if (!i.ok)
      return {
        ok: !1,
        reason: i.error.reason,
        message: i.error.message
      };
    const l = An(a.actor, t);
    if (l.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of l) {
      if (Kf(a)) {
        Yf(
          o,
          u,
          Qf(a, n, i.value)
        );
        continue;
      }
      r.push(Xf(a, u, i.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...Zf(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function Kf(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Yf(e, t, n) {
  const r = np(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Qf(e, t, n) {
  const r = rp(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function Zf(e, t, n, r) {
  const o = sp(e), a = o.length > 1 ? up() : void 0;
  return o.map((i) => {
    const l = r.map(
      (m, f) => {
        const A = lp(m.amount, i);
        return {
          id: Jf(m, i, f),
          amount: A,
          damageType: m.damageType,
          sourceRollId: m.sourceRollId,
          ignoreResistance: m.step.ignoreResistance === !0
        };
      }
    ), u = l.reduce(
      (m, f) => m + f.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: l,
      label: ep(u, i, o.length > 1),
      executedLabel: tp(
        n.name ?? "Ator sem nome",
        i,
        o.length > 1
      ),
      choiceGroupId: a,
      choiceGroupResolvedLabel: a ? "✓ Outra opção escolhida" : void 0,
      actionSectionId: "apply-damage",
      actionSectionTitle: "Aplicar danos",
      source: "item-use.damage-action",
      originUuid: t.uuid ?? null
    };
  });
}
function Xf(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = ip(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: op(e, r, n),
    executedLabel: ap(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function Jf(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function ep(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function tp(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function np(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function rp(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function op(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function ap(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function ip(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function sp(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function lp(e, t) {
  const n = e * t.multiplier, r = cp(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function cp(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function up() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function An(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Lr(e, t, n, r, o, a, i = null) {
  return [
    `Forma: ${pa(t.variant)}`,
    pp(t, n, r),
    ...fp(i),
    ...Object.values(o.rolls).flatMap(gp),
    ...dp(e, a),
    ...hp(e.resistance),
    ..._p(n)
  ];
}
function dp(e, t) {
  return mp(e) ? An("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function mp(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function fp(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function pp(e, t, n) {
  const r = De(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function gp(e) {
  const n = [`${Cp(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = yp(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${ff(e.damageType)}`), n;
}
function hp(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function yp(e) {
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
    const i = bp(a);
    i && (Rp(
      n,
      i.operator ?? r,
      i.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function bp(e) {
  const t = Ap(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Tp(e);
}
function Ap(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Tp(e) {
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
function Rp(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function _p(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Cp(e) {
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
function kp(e, t, n, r) {
  return fa.map((o) => {
    const a = ha(
      e,
      t,
      o,
      r
    ), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? pa(o),
      enabled: i,
      details: a ? wp(a, n, r) : [],
      finalCostText: a ? $p(n, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function wp(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = De(t, e);
  return r.push(
    a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"
  ), r;
}
function De(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function $p(e, t) {
  const n = De(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function Ip(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Tn);
}
function Ep(e, t) {
  return ea({
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
function Sp(e, t, n, r) {
  return ha(e, t, n, r) ?? bn;
}
function ha(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? Lp(t, n) ? Dp(n) : null : n === "base" ? bn : null);
}
function Dp(e) {
  switch (e) {
    case "base":
      return bn;
    case "discente":
      return Of;
    case "verdadeiro":
      return Ff;
  }
}
function Lp(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Pp(foundry.utils.getProperty(e, n));
}
function Pp(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Np(e) {
  return e.steps.some(Tn);
}
function Tn(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function vp(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Op(e, t) {
  const n = await Fp(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: Mp(n),
    total: Bp(n),
    diceBreakdown: Up(n)
  };
}
function ya(e) {
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
async function Fp(e, t) {
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
  return xp(r);
}
function xp(e) {
  return Pr(e) ? e : Array.isArray(e) ? e.find(Pr) ?? null : null;
}
function Pr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Mp(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Bp(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Up(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(qp);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function qp(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const ba = "itemUsePrompts", Aa = "chatCard", ut = "data-paranormal-toolkit-prompt-id", dt = "data-paranormal-toolkit-pending-id", Rn = "data-paranormal-toolkit-executed-label", Vt = "data-paranormal-toolkit-choice-group", Ta = "data-paranormal-toolkit-skipped-label", Nr = "data-paranormal-toolkit-action-section", vr = "data-paranormal-toolkit-detail-key", Or = "data-paranormal-toolkit-roll-card", _n = "data-paranormal-toolkit-roll-detail-toggle", Ra = "data-paranormal-toolkit-roll-detail-id", _a = "data-paranormal-toolkit-resistance-roll-button", Ca = "data-paranormal-toolkit-resistance-skill", ka = "data-paranormal-toolkit-resistance-skill-label", wa = "data-paranormal-toolkit-resistance-target-actor-id", $a = "data-paranormal-toolkit-resistance-target-name", Ia = "data-paranormal-toolkit-resistance-roll-result", Fr = "data-paranormal-toolkit-system-card-replaced", jp = `[${dt}]`, zp = `[${_n}]`, Vp = `[${_a}]`, Ht = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, Hp = `${h}__actions`, xr = `${h}__details`, Ea = `${h}__summary`, Gp = `${h}__title`, Sa = `${h}__button--executed`, Mr = `${h}__roll-card`;
let Br = !1, Gt = null;
const P = /* @__PURE__ */ new Map(), Wp = [0, 100, 500, 1500, 3e3], Kp = 3e4, Yp = [0, 100, 500, 1500, 3e3];
function Qp(e) {
  if (Gt = e, Br) {
    qr(e);
    return;
  }
  const t = (n, r) => {
    La(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Br = !0, qr(e);
}
async function Ur(e) {
  const t = Da(e);
  P.set(e.pendingId, t), await wn(t) || qa(t), Pa(e.pendingId);
}
async function Zp(e) {
  const t = Da({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await wn(t) || qa(t), Pa(e.pendingId);
}
async function $t(e, t) {
  const n = P.get(e);
  P.delete(e), n && await Qg(n, t);
}
function Cn(e) {
  const t = Wa();
  for (const n of t) {
    const r = B(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Xp(e, t) {
  const n = Cn(e);
  if (!n) return;
  const r = B(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await fe(n.message, r));
}
async function Jp(e, t, n) {
  if (!t) return;
  const r = Cn(e);
  if (!r) return;
  const o = B(r.message);
  let a = !1;
  for (const [i, l] of Object.entries(o))
    i !== e && l.choiceGroupId === t && (o[i] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await fe(r.message, o);
}
function Da(e) {
  const t = H(e.context.message), n = e.context.targets.find((i) => Qt(i)), r = n ? Qt(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: wg(e.context),
    executed: !1
  };
}
function La(e, t, n) {
  Yg();
  const r = ft(t);
  if (!r) return;
  const o = Gg(e, r);
  o.length > 0 && Je(r);
  for (const a of o)
    Wt(r, a);
  Oa(r, n), Kt(r), Yt(r);
}
function qr(e) {
  for (const t of Yp)
    globalThis.setTimeout(() => {
      eg(e);
    }, t);
}
function eg(e) {
  for (const t of tg()) {
    const n = mt(t);
    ng(n) && La(n, t, e);
  }
}
function tg() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function ng(e) {
  return e ? $n(e) ? !0 : Xg(e).length > 0 : !1;
}
function Pa(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? Wg(t.messageId) : null;
  if (n) {
    Gr(n, t), Je(n), Wt(n, t), jr(n), Kt(n), Yt(n);
    return;
  }
  if (t.messageId) {
    Xt(t);
    return;
  }
  const r = Kg(t);
  if (r) {
    Gr(r, t), Je(r), Wt(r, t), jr(r), Kt(r), Yt(r);
    return;
  }
  Xt(t);
}
function jr(e) {
  Gt && Oa(e, Gt);
}
function Je(e) {
  const t = rg();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = va(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Fr) === "true") return;
  const r = n.querySelector(`.${Ht}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Fr, "true");
}
function rg() {
  try {
    return os() === "replace";
  } catch {
    return !1;
  }
}
function Wt(e, t) {
  if (Je(e), e.querySelector(`[${ut}="${pe(t.pendingId)}"]`)) return;
  const n = og(e, t);
  ig(n, t), Tg(n, Rg(t)).append(kg(t));
}
function og(e, t) {
  const n = e.querySelector(`.${Ht}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Ht, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(Gp), i.textContent = ag(t);
  const l = document.createElement("span");
  return l.classList.add(Ea), l.textContent = t.summary, o.append(a, i, l), r.append(o), Ig(e).append(r), r;
}
function ag(e) {
  const t = I(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function ig(e, t) {
  const n = t.summaryLines ?? [], r = Ba(n, t);
  if (r) {
    sg(e, r, t);
    return;
  }
  _g(e, n);
}
function sg(e, t, n) {
  if (e.querySelector(`[${Or}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Mr, `${Mr}--${t.intent}`), r.setAttribute(Or, "true"), t.castingCheck && zr(r, cg(t.castingCheck), n.pendingId, "casting"), lg(t) && zr(r, ug(t), n.pendingId, "effect"), gg(r, t), hg(r, t, n), Ag(r, t), e.append(r);
}
function lg(e) {
  return e.intent !== "casting";
}
function cg(e) {
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
function ug(e) {
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
function zr(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${h}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-section-header`);
  const i = document.createElement("strong");
  if (i.textContent = t.title, a.append(i), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, a.append(l);
  }
  if (o.append(a), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, o.append(l);
  }
  dg(o, t), bg(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function dg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = mg(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function mg(e, t) {
  const n = fg(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of pg(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function fg(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function pg(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Vr(e, "highest") : n.includes("kl") ? Vr(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Vr(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function gg(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(hh);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function hg(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = yg(t, n);
  o.append(a), i && o.append(i);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(o, l), t.resistanceRollResult && r.append(Na(t.resistanceRollResult)), e.append(r);
}
function yg(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(ut, t.pendingId), n.setAttribute(_a, "true"), n.setAttribute(Ca, e.resistanceSkill), n.setAttribute(ka, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(wa, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute($a, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Ia, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Na(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = xa(e), t;
}
function bg(e, t, n, r, o) {
  const a = t.filter((m) => m.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(_n, i), l.setAttribute("aria-expanded", "false"), l.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(Ra, i), u.hidden = !0;
  for (const m of a) {
    const f = document.createElement("dt");
    f.textContent = m.label;
    const A = document.createElement("dd");
    A.textContent = m.value, u.append(f, A);
  }
  e.append(l, u);
}
function Ag(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function Tg(e, t) {
  const n = `[${Nr}="${pe(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Hp), o.setAttribute(Nr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function Rg(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = Ba(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function _g(e, t) {
  if (t.length === 0) return;
  const n = Cg(e);
  for (const r of t) {
    const o = yh(r);
    if (n.querySelector(`[${vr}="${pe(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(vr, o), n.append(a);
  }
}
function Cg(e) {
  const t = e.querySelector(`.${xr}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(xr), e.append(n), n;
}
function kg(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(ut, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Sa), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(dt, e.pendingId), t.setAttribute(Rn, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Vt, e.choiceGroupId), t.setAttribute(Ta, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function wg(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = $g(e);
  return `${t} → ${n}`;
}
function $g(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Ig(e) {
  return va(e) ?? e;
}
function va(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Oa(e, t) {
  const n = ft(e);
  if (!n) return;
  const r = n.querySelectorAll(jp);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      qg(o, t);
    }));
}
function Kt(e) {
  const t = ft(e);
  if (!t) return;
  const n = t.querySelectorAll(zp);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Eg(t, r);
    }));
}
function Yt(e) {
  const t = ft(e);
  if (!t) return;
  const n = t.querySelectorAll(Vp);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Sg(t, r);
    }));
}
function Eg(e, t) {
  const n = t.getAttribute(_n);
  if (!n) return;
  const r = e.querySelector(`[${Ra}="${pe(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Sg(e, t) {
  const n = t.getAttribute(ut), r = t.getAttribute(Ca), o = t.getAttribute(ka) ?? (r ? ya(r) : "Resistência");
  if (!n || !r) return;
  const a = Pg(e, n), i = Ng(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Op(i, r);
    await Mg(u.roll);
    const m = {
      skill: r,
      skillLabel: o,
      formula: u.formula,
      total: u.total,
      targetName: i.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: u.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Dg(t, m), Lg(t, m), Bg(n, m), await Ug(e, n, m);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function Dg(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Ia, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Lg(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Na(t);
  if (r) {
    r.textContent = xa(t);
    return;
  }
  n.append(o);
}
function Pg(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = mt(e);
  return B(r)[t] ?? null;
}
function Ng(e, t) {
  const n = e?.resistanceTargetActor;
  if (F(n)) return n;
  const o = e?.context?.targets.map(Qt).find(F) ?? null;
  if (o) return o;
  const a = t.getAttribute(wa) ?? e?.resistanceTargetActorId ?? null, i = a ? Og(a) : null;
  return i || Fg(
    t.getAttribute($a) ?? e?.resistanceTargetName ?? vg(t)
  );
}
function vg(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Ea}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function Qt(e) {
  const t = e.actor;
  if (F(t)) return t;
  const n = e.token, r = Ie(n);
  if (r) return r;
  const o = e.document;
  return Ie(o);
}
function Ie(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (F(t)) return t;
  const n = e.document?.actor;
  return F(n) ? n : null;
}
function Og(e) {
  const n = game.actors?.get?.(e);
  return F(n) ? n : Fa().map((a) => Ie(a)).find((a) => a?.id === e) ?? null;
}
function Fg(e) {
  const t = le(e);
  if (!t) return null;
  const n = Fa().filter((a) => le(xg(a)) === t).map((a) => Ie(a)).find(F) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => F(a) && le(a.name) === t);
  return F(o) ? o : null;
}
function Fa() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function xg(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ie(e)?.name ?? null;
}
function le(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function F(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function xa(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Mg(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Bg(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function Ug(e, t, n) {
  const r = mt(e);
  if (r)
    try {
      const o = B(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await fe(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function mt(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return M(r?.get?.(n));
}
async function qg(e, t) {
  const n = e.getAttribute(dt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    Ma(e, e.getAttribute(Rn) ?? "✓ Automação aplicada"), jg(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function Ma(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Sa), e.removeAttribute(dt), e.removeAttribute(Rn);
}
function jg(e) {
  const t = e.getAttribute(Vt);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Vt}="${pe(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(Ta) ?? "✓ Outra opção escolhida";
    Ma(o, a);
  }
}
function Ba(e, t) {
  const n = e.map(kn).filter(ph), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = I(e, "Forma"), a = I(e, "Custo"), i = I(e, "Dados") ?? I(e, `Dados (${r.label})`), l = I(e, "Tipo"), u = I(e, "Resistência"), m = I(e, "Resistência Perícia"), f = I(e, "Resistência Rótulo") ?? (m ? ya(m) : null), A = Ua(e, "Observação"), R = e.filter((g) => Hg(g, r)), _ = zg(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: i,
    damageType: l,
    resistance: u,
    resistanceSkill: m,
    resistanceSkillLabel: f,
    notes: A,
    details: R,
    castingCheck: _,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function zg(e) {
  const t = e.map(kn).find((a) => a?.intent === "casting") ?? null, n = I(e, "Conjuração DT"), r = I(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: I(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: I(e, "Dados (Conjuração)")
  } : null;
}
function kn(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: Vg(n)
  } : null;
}
function Vg(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function I(e, t) {
  return Ua(e, t)[0] ?? null;
}
function Ua(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Hg(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || kn(e) ? !1 : e.trim().length > 0;
}
function Gg(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    Zt(r, e, t) && n.set(r.pendingId, r);
  for (const r of Zg(e))
    Zt(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Zt(e, t, n) {
  const r = H(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !Hr(n, "itemId", e.itemId) ? !1 : !e.actorId || Hr(n, "actorId", e.actorId);
}
function Hr(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${bh(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Wg(e) {
  const t = pe(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Kg(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Zt(e, null, t))
      return t;
  return null;
}
function Yg() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function Gr(e, t) {
  const n = mt(e);
  if (!n) return !1;
  try {
    const r = B(n);
    return r[t.pendingId] = In(t, H(n)), await fe(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function wn(e) {
  const t = Va(e);
  if (!t) return !1;
  try {
    const n = B(t);
    return n[e.pendingId] = In(e, H(t)), await fe(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function qa(e) {
  for (const t of Wp)
    globalThis.setTimeout(() => {
      Xt(e);
    }, t);
}
async function Xt(e) {
  const t = Va(e);
  if ($n(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await wn(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function Qg(e, t) {
  const n = za(e.context.message);
  if (n)
    try {
      const r = B(n), o = r[e.pendingId] ?? In(e, H(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await fe(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function Zg(e) {
  return Object.values(B(M(e))).filter(Le);
}
function B(e) {
  if (!e) return {};
  const t = {}, n = $n(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(ja(e)))
    t[r] ??= o;
  return t;
}
function Xg(e) {
  return Object.values(ja(M(e))).filter(Le);
}
function ja(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, ba);
  if (!ue(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Le(o) && (n[r] = o);
  return n;
}
async function fe(e, t) {
  typeof e.setFlag == "function" && (await eh(e, t), await Jg(e, t));
}
async function Jg(e, t) {
  await Promise.resolve(e.setFlag?.(c, ba, t));
}
function $n(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, Aa);
  return mh(t) ? t : null;
}
async function eh(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Le).sort((a, i) => a.createdAt - i.createdAt);
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
      actorName: th(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(c, Aa, o));
}
function th(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function In(e, t) {
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
function za(e) {
  const t = M(e);
  if (t?.setFlag)
    return t;
  const n = nh(e);
  if (n?.setFlag)
    return n;
  const r = H(e);
  if (!r) return null;
  const o = game.messages;
  return M(o?.get?.(r));
}
function nh(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(M).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Va(e) {
  const t = za(e.context.message);
  if (t) return t;
  const n = e.messageId ? rh(e.messageId) : null;
  if (n) return n;
  const r = Wa().slice().reverse();
  return r.find((o) => oh(o, e)) ?? r.find((o) => ah(o, e)) ?? null;
}
function rh(e) {
  const t = game.messages;
  return M(t?.get?.(e));
}
function oh(e, t) {
  const n = H(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Ha(e, t)) return !1;
  const o = Ga(e);
  return !t.actorId || !o || o === t.actorId;
}
function ah(e, t) {
  if (!sh(e, t)) return !1;
  const n = Ga(e);
  return t.actorId && n === t.actorId ? !0 : Ha(e, t);
}
function Ha(e, t) {
  const n = le(ih(e));
  if (!n) return !1;
  const r = le(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = le(t.itemId);
  return !!(o && n.includes(o));
}
function ih(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Ga(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function sh(e, t) {
  const n = lh(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Kp;
}
function lh(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function M(e) {
  return e && typeof e == "object" ? e : null;
}
function Le(e) {
  return ue(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && Q(e.resistanceTargetActorId) && Q(e.resistanceTargetName) && fh(e.resistanceRollResult) && ch(e.actionPayload) && It(e.title) && It(e.buttonLabel) && It(e.executedLabel) && Q(e.choiceGroupId) && Q(e.skippedLabel) && Q(e.actionSectionId) && Q(e.actionSectionTitle) && gh(e.summaryLines) : !1;
}
function ch(e) {
  return e == null ? !0 : ue(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && uh(e.resource) && dh(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function uh(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function dh(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function mh(e) {
  return ue(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && ue(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Le) : !1;
}
function fh(e) {
  return e == null ? !0 : ue(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Q(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function ph(e) {
  return e !== null;
}
function ue(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function S(e) {
  return e === null || typeof e == "string";
}
function It(e) {
  return e === void 0 || typeof e == "string";
}
function Q(e) {
  return e == null || typeof e == "string";
}
function gh(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function hh(e) {
  return typeof e == "string" && e.length > 0;
}
function Wa() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(M).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(M).filter((r) => r !== null) : [];
}
function ft(e) {
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
function yh(e) {
  return e.trim().toLowerCase();
}
function bh(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function pe(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Wr = 1e3;
class Ah {
  constructor(t, n, r, o, a, i) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = i, this.ritualAssistant = new xf(
      t,
      n,
      r
    );
  }
  workflow;
  resources;
  damage;
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
      settings: xn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = xn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = en(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && Ih(t.item) && n.executionMode === "ask") {
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
    if (await wr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Dt(t, "failed", "missing-actor")
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
    if (!n)
      return this.executePersistedPendingAutomation(t);
    if (n.kind === "workflow")
      return this.pendingExecutions.delete(t), await $t(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await $t(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Cn(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = Dh(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await Ke(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await Xp(t), await Jp(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Qp(
      (t) => this.executePendingAutomation(t)
    ), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, n) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await wr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Dt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      Eh(t.item)
    );
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
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), d.info(
          "Ritual assistido concluído sem ações pendentes.",
          J(r.workflowContext)
        );
        return;
      case "ready":
        await this.registerAssistedActions(
          t,
          r.workflowContext,
          r.actions,
          r.summaryLines
        );
        return;
    }
  }
  async executeAssistedAction(t, n) {
    if (t.kind === "resource-operation") {
      const o = await this.ritualAssistant.applyAction(t);
      return o.ok ? (n.resourceTransactions.push(o.value), { ok: !0 }) : (this.handleResourceActionFailure(o), { ok: !1 });
    }
    if (t.kind === "damage-application") {
      const o = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return o.ok ? ($h(n, o.value), await Th(o.value), {
        ok: !0,
        executedLabel: Rh(o.value)
      }) : (this.handleDamageActionFailure(o.error), { ok: !1 });
    }
    const r = await this.conditions.applyCondition({
      actor: t.actor,
      conditionId: t.conditionId,
      duration: t.duration,
      originUuid: t.originUuid,
      source: t.source ?? "item-use.condition-action"
    });
    return r.ok ? (r.value.warning && ui.notifications?.warn(`Paranormal Toolkit: ${r.value.warning}`), { ok: !0 }) : (this.handleConditionActionFailure(r), { ok: !1 });
  }
  async resolveAlternativeActions(t) {
    const n = Et(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && Et(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== t.id && (this.pendingExecutions.delete(o), await $t(
        o,
        Yr(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Lt();
    await Zp({
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
      const l = Lt();
      a ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: i,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Ur({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: i.label,
        executedLabel: i.executedLabel,
        choiceGroupId: Et(i),
        skippedLabel: Yr(i),
        actionSectionId: i.actionSectionId,
        actionSectionTitle: i.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: i.actor,
        resistanceTargetActorId: i.actor.id ?? null,
        resistanceTargetName: i.actorName,
        actionPayload: Sh(i)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      a
    ), d.info(
      "Ritual assistido preparado com ações pendentes.",
      J(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = Lt();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Ur({
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
    this.setAttempt(t, "completed"), d.info(
      "Automação executada por uso normal de item.",
      J(o.value.context)
    );
  }
  handleAutomationFailure(t) {
    const n = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      d.warn(n, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      d.error(n, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    d.warn(n, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    d.warn(
      `Ação assistida falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  handleDamageActionFailure(t) {
    d.warn(`Ação assistida de dano falhou: ${t.message}`, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleConditionActionFailure(t) {
    d.warn(
      `Ação assistida de condição falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const n = Date.now(), r = Qr(t);
    for (const [a, i] of this.recentExecutionKeys.entries())
      n - i > Wr && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= Wr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Qr(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = Dt(
      t,
      n,
      r,
      o
    );
  }
}
async function Th(e) {
  const t = wh();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: _h(e)
      });
    } catch (n) {
      d.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function Rh(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function _h(e) {
  const t = e.instances.map((i) => {
    const l = i.blocked > 0 ? ` <span class="muted">(RD ${i.blocked})</span>` : "";
    return `<li><strong>${He(i.label ?? "Dano")}</strong>: ${i.inputAmount} → ${i.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = Ch(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${He(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${He(e.actorName)}</strong></p>
      <ul>
        ${t}
        ${n}
        ${r}
        ${o}
        ${a}
      </ul>
    </div>
  `;
}
function Ch(e) {
  const t = kh(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${He(o)}</li>`;
}
function kh(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = Kr(n?.value);
  return r === null ? null : {
    value: r,
    max: Kr(n?.max)
  };
}
function Kr(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function wh() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function He(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function Et(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function Yr(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function $h(e, t) {
  for (const n of t.instances)
    e.damageInstances.push({
      id: n.id,
      source: "ritual",
      sourceId: t.originUuid,
      sourceName: t.source ?? "Dano assistido",
      targetActorId: t.actorId,
      targetActorName: t.actorName,
      rollId: n.sourceRollId ?? void 0,
      damageType: n.damageType ?? n.systemDamageType ?? void 0,
      rawAmount: n.inputAmount,
      resistance: n.blocked > 0 ? n.blocked : void 0,
      finalAmount: n.finalDamage,
      appliedAmount: n.finalDamage,
      tags: ["ordem-apply-damage"]
    });
}
function Ih(e) {
  return e.type === "ritual";
}
function Eh(e) {
  return Wm(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Sh(e) {
  return e.kind === "damage-application" || e.kind !== "resource-operation" ? null : {
    kind: "resource-operation",
    actorId: e.actor.id ?? null,
    actorUuid: e.actor.uuid ?? null,
    actorName: e.actorName,
    resource: e.resource,
    operation: e.operation,
    amount: e.amount
  };
}
function Dh(e) {
  const t = e.actorUuid ? Lh(e.actorUuid) : null;
  if (de(t)) return t;
  const n = e.actorId ? Ph(e.actorId) : null;
  return n || Nh(e.actorName);
}
function Lh(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Ph(e) {
  const n = game.actors?.get?.(e);
  if (de(n)) return n;
  for (const r of Ka()) {
    const o = En(r);
    if (o?.id === e) return o;
  }
  return null;
}
function Nh(e) {
  const t = St(e);
  if (!t) return null;
  for (const o of Ka()) {
    const a = vh(o);
    if (St(a) === t) {
      const i = En(o);
      if (i) return i;
    }
  }
  const r = game.actors?.find?.(
    (o) => de(o) && St(o.name) === t
  );
  return de(r) ? r : null;
}
function Ka() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function vh(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : En(e)?.name ?? null;
}
function En(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (de(t)) return t;
  const n = e.document?.actor;
  return de(n) ? n : null;
}
function St(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function de(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Dt(e, t, n, r) {
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
function Qr(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Lt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Oh {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = Se(t);
    for (const i of n) {
      const l = i.itemId ? a.find((f) => f.id === i.itemId) ?? null : null, u = i.match?.preset ?? null;
      if (!l || !u) {
        o.push(i);
        continue;
      }
      await this.automationBinder.applyPreset(l, u);
      const m = await this.itemPatches.applyPresetItemPatch(l, u);
      r.push({
        itemId: l.id ?? null,
        itemName: l.name ?? "Ritual sem nome",
        presetId: u.id,
        presetLabel: u.label,
        previousStatus: i.status,
        itemPatch: m
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
class Fh {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Se(t).map((l) => this.analyzeRitual(l)), r = n.filter(qe("upToDate")), o = n.filter(qe("available")), a = n.filter(qe("outdated")), i = n.filter(qe("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = xh(t);
    return n ? r ? r.source.type !== "preset" ? Ae({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? Ae({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : Ae({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: Mh(r, n.preset)
    }) : Ae({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : Ae({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Ae(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? nt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function xh(e) {
  const t = e.getFlag(c, "automation");
  return tn(t) ? t : null;
}
function Mh(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function qe(e) {
  return (t) => t.status === e;
}
class Bh {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = rn(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: n,
      data: r,
      flags: {
        [c]: {
          resourceTransaction: r
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, n) {
    const r = this.createWorkflowSummaryContent(t, n), o = J(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: r,
      data: o,
      flags: {
        [c]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const n = T(t.actorName), r = T(t.resource), o = T(Zr(t)), a = T(qh(t));
    return `
      <section class="${c}-card ${c}-resource-card">
        <header class="${c}-card__header">
          <strong>${o}</strong>
          <span>${n}</span>
        </header>
        <div class="${c}-card__body">
          <p><strong>${a}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, n) {
    const r = T(n.title ?? "Automação"), o = n.message ? `<p>${T(n.message)}</p>` : "", a = T(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), i = T(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((g) => T(g.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map(
      (g) => `<li><strong>${T(g.id)}:</strong> ${T(g.formula)} = ${g.total} <em>(${T(Uh(g.intent))})</em>${g.damageType ? ` — ${T(g.damageType)}` : ""}</li>`
    ), m = t.ritualCosts.map(
      (g) => `<li><strong>${T(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${T(g.resource)} (${T(jh(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${T(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${T(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (g) => `<li><strong>${T(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), R = t.resourceTransactions.map(
      (g) => `<li><strong>${T(g.actorName)}:</strong> ${T(Zr(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), _ = t.phases.map((g) => T(g)).join(" &rarr; ");
    return `
      <section class="${c}-card ${c}-workflow-card">
        <header class="${c}-card__header">
          <strong>${r}</strong>
          <span>${i}</span>
        </header>
        <div class="${c}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${m.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${m.join("")}</ul>` : ""}
          ${u.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Dano:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Cura:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${_.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${_}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Uh(e) {
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
function Zr(e) {
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
function qh(e) {
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
function jh(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function T(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function zh() {
  const e = new tu(), t = new Qu(e), n = new Qc(), r = new ou(), o = new su(r), a = new Ru(e), i = new Cu(), l = i.registerMany(
    Fi()
  );
  if (!l.ok)
    throw new Error(l.error.message);
  const u = new _u(), m = new Au(), f = km(), A = new gd(f), R = new Fh(
    i
  ), _ = new Oh(
    R,
    u,
    m
  ), g = new ed(), N = new Bh(g), he = new Ju(), ye = new Ku(
    t,
    o,
    N,
    he
  ), be = new Xu(ye, he), k = new Ah(
    be,
    t,
    o,
    n,
    A,
    g
  );
  return k.addStrategy(
    new yu(
      (U) => k.handleItemUsed(U)
    )
  ), {
    ordem: a,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: o,
    resources: t,
    damage: n,
    automationRegistry: i,
    automationBinder: u,
    itemPatches: m,
    conditionRegistry: f,
    conditions: A,
    debugOutput: g,
    chatMessages: N,
    workflowHooks: he,
    automation: ye,
    workflow: be,
    itemUseIntegration: k,
    ritualPresetDiagnostic: R,
    ritualPresetApplications: _
  };
}
const { ApplicationV2: Vh } = foundry.applications.api;
class et extends Vh {
  constructor(t, n) {
    super({
      id: `${c}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
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
      apply: et.onApply,
      cancel: et.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${v(Jt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${v(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Pt("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Pt("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Pt("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Pt(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${v(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Hh(n) : Wh(t)}
    </section>
  `;
}
function Hh(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Gh).join("")}</ol>`;
}
function Gh(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${v(e.appliedPresetId)} v${v(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${v(e.itemName)}</strong>
        <span>${v(e.reason)}</span>
        ${r}
      </div>
      <em>${v(n)}</em>
    </li>
  `;
}
function Wh(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${v({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function v(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const tt = `${c}.manageRitualPresets`, Xr = `__${c}_ritualPresetHeaderControlRegistered`, Kh = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Yh(e) {
  const t = globalThis;
  if (!t[Xr]) {
    for (const n of Kh)
      Hooks.on(n, (r, o) => {
        Qh(r, o, e);
      });
    t[Xr] = !0, d.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Qh(e, t, n) {
  Array.isArray(t) && Xh(e) && (Zh(e, n), !t.some((r) => r.action === tt) && t.push({
    action: tt,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Ya(e, n);
    }
  }));
}
function Zh(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[tt] && (e.options.actions[tt] = (n) => {
    n.preventDefault(), n.stopPropagation(), Ya(e, t);
  }));
}
function Xh(e) {
  if (!game.user?.isGM) return !1;
  const t = Qa(e);
  return t ? t.type === "agent" && Se(t).length > 0 : !1;
}
function Ya(e, t) {
  const n = Qa(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new et(n, t).render({ force: !0 });
}
function Qa(e) {
  return Jr(e.actor) ? e.actor : Jr(e.document) ? e.document : null;
}
function Jr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Za = "data-paranormal-toolkit-ritual-roll-config", Pe = "data-paranormal-toolkit-ritual-roll-field", ee = "data-paranormal-toolkit-ritual-roll-action", eo = `__${c}_ritualRollConfigBlockRegistered`, Jh = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], ey = [
  { value: "cutting", label: "Corte" },
  { value: "impact", label: "Impacto" },
  { value: "piercing", label: "Perfurante" },
  { value: "ballistic", label: "Balístico" },
  { value: "blood", label: "Sangue" },
  { value: "death", label: "Morte" },
  { value: "knowledge", label: "Conhecimento" },
  { value: "energy", label: "Energia" },
  { value: "fear", label: "Medo" },
  { value: "fire", label: "Fogo" },
  { value: "cold", label: "Frio" },
  { value: "electric", label: "Eletricidade" },
  { value: "chemical", label: "Químico" },
  { value: "mental", label: "Mental" }
];
function ty() {
  const e = globalThis;
  if (!e[eo]) {
    ny();
    for (const t of Jh)
      Hooks.on(t, (...n) => {
        ry(n[0], n[1]);
      });
    e[eo] = !0, d.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function ny() {
  const e = `${c}-ritual-roll-config-inline-style`;
  if (document.getElementById(e)) return;
  const t = document.createElement("style");
  t.id = e, t.textContent = `
.${c}-ritual-roll-config {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  border: 1px solid rgba(89, 36, 42, 0.28);
  border-left: 4px solid rgba(89, 36, 42, 0.78);
  border-radius: 8px;
  padding: 10px;
  background: linear-gradient(180deg, rgba(248, 244, 237, 0.96), rgba(234, 226, 214, 0.98));
  color: rgba(24, 19, 18, 0.94);
}
.${c}-ritual-roll-config__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.${c}-ritual-roll-config__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.${c}-ritual-roll-config__title strong {
  color: rgba(89, 36, 42, 0.96);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}
.${c}-ritual-roll-config__title span {
  font-size: 0.9rem;
  font-weight: 800;
}
.${c}-ritual-roll-config__badge {
  border: 1px solid rgba(89, 36, 42, 0.25);
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.36);
  color: rgba(89, 36, 42, 0.9);
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
}
.${c}-ritual-roll-config__hint,
.${c}-ritual-roll-config__status {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.35;
  opacity: 0.8;
}
.${c}-ritual-roll-config__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.${c}-ritual-roll-config__forms-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.${c}-ritual-roll-config__forms-title {
  color: rgba(24, 19, 18, 0.9);
  font-size: 0.8rem;
  font-weight: 900;
}
.${c}-ritual-roll-config__forms-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.${c}-ritual-roll-config__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: left;
}
.${c}-ritual-roll-config__field input,
.${c}-ritual-roll-config__field select,
.${c}-ritual-roll-config__field textarea {
  width: 100%;
  min-width: 0;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
}
.${c}-ritual-roll-config__field textarea {
  resize: vertical;
}
.${c}-ritual-roll-config__field small {
  color: rgba(89, 36, 42, 0.78);
  font-size: 0.72rem;
  font-weight: 700;
}
.${c}-ritual-roll-config__form-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 7px;
  padding: 7px;
  background: rgba(255, 255, 255, 0.28);
}
.${c}-ritual-roll-config__form-card:has(input:disabled) {
  opacity: 0.72;
}
.${c}-ritual-roll-config__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.${c}-ritual-roll-config__actions button {
  width: auto;
  margin: 0;
}
.${c}-ritual-roll-config [hidden] {
  display: none !important;
}
@media (max-width: 620px) {
  .${c}-ritual-roll-config__fields,
  .${c}-ritual-roll-config__forms-grid {
    grid-template-columns: 1fr;
  }
}
`, document.head.append(t);
}
function ry(e, t) {
  const n = yy(e);
  if (!n || n.type !== "ritual") return;
  const r = Ty(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  ay(o);
  const a = Ja(n), i = da(n), l = by(n), u = iy(n, i, a, l);
  my(u, n, a, l), oy(o, u), Sn(u);
}
function oy(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function ay(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Za}]`)))
    t.remove();
}
function iy(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${c}-ritual-roll-config`), o.setAttribute(Za, e.uuid ?? e.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${c}-ritual-roll-config__header`);
  const i = document.createElement("div");
  i.classList.add(`${c}-ritual-roll-config__title`), i.append(to("strong", "Paranormal Toolkit")), i.append(to("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${c}-ritual-roll-config__badge`), l.textContent = ti(t) ? "Configurada" : "Rascunho", a.append(i, l), o.append(a);
  const u = document.createElement("p");
  u.classList.add(`${c}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const m = document.createElement("div");
  m.classList.add(`${c}-ritual-roll-config__fields`), m.append(sy(t, r)), m.append(ly(t, r)), m.append(cy(t, r)), o.append(m), o.append(uy(t, n, r)), o.append(dy(r));
  const f = document.createElement("p");
  return f.classList.add(`${c}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function sy(e, t) {
  const n = pt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Pe, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = Gm(o), a.selected = e.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function ly(e, t) {
  const n = pt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Pe, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const a of ey) {
    const i = document.createElement("option");
    i.value = a.value, i.textContent = a.label, i.selected = e.damageType === a.value, r.append(i);
  }
  return n.append(r), n;
}
function cy(e, t) {
  const n = pt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Pe, "utilityLabel"), n.append(r), n;
}
function uy(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${c}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${c}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const a = document.createElement("div");
  return a.classList.add(`${c}-ritual-roll-config__forms-grid`), a.append(Nt("base", "Padrão", e.forms.base.formula, !0, n)), a.append(Nt("discente", "Discente", e.forms.discente.formula, t.discente, n)), a.append(Nt("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(a), r;
}
function Nt(e, t, n, r, o) {
  const a = pt(t);
  a.classList.add(`${c}-ritual-roll-config__form-card`), a.dataset.ritualRollForm = e;
  const i = document.createElement("input");
  if (i.type = "text", i.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", i.value = n, i.disabled = !o || !r, i.setAttribute(Pe, `formula.${e}`), a.append(i), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", a.append(l);
  }
  return a;
}
function dy(e) {
  const t = document.createElement("div");
  t.classList.add(`${c}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(ee, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(ee, "clear"), t.append(n, r), t;
}
function pt(e) {
  const t = document.createElement("label");
  t.classList.add(`${c}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function to(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function my(e, t, n, r) {
  ge(e, "intent")?.addEventListener("change", () => Sn(e)), oo(e, "system.studentForm")?.addEventListener("change", () => no(e, t)), oo(e, "system.trueForm")?.addEventListener("change", () => no(e, t)), e.querySelector(`[${ee}="save"]`)?.addEventListener("click", () => {
    r && fy(e, t, n);
  }), e.querySelector(`[${ee}="clear"]`)?.addEventListener("click", () => {
    r && py(e, t);
  });
}
async function fy(e, t, n) {
  const r = e.querySelector(`[${ee}="save"]`);
  r?.setAttribute("disabled", "true"), ce(e, "Salvando configuração...");
  try {
    const o = gy(e, n);
    await Vm(t, o), Xa(e, o), ce(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), ce(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function py(e, t) {
  const n = e.querySelector(`[${ee}="clear"]`);
  n?.setAttribute("disabled", "true"), ce(e, "Limpando configuração...");
  try {
    await Hm(t);
    const r = da(t);
    hy(e, r), Xa(e, r), ce(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), ce(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Xa(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__badge`);
  n && (n.textContent = ti(t) ? "Configurada" : "Rascunho");
}
function gy(e, t) {
  return {
    schemaVersion: 1,
    intent: ei(ge(e, "intent")?.value),
    damageType: ao(e, "damageType"),
    utilityLabel: ao(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Ge(e, "formula.base") },
      discente: { formula: Ge(e, "formula.discente") },
      verdadeiro: { formula: Ge(e, "formula.verdadeiro") }
    }
  };
}
function hy(e, t) {
  re(e, "intent", t.intent), re(e, "damageType", t.damageType ?? ""), re(e, "utilityLabel", t.utilityLabel ?? "Resultado"), re(e, "formula.base", t.forms.base.formula), re(e, "formula.discente", t.forms.discente.formula), re(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Sn(e);
}
function Sn(e) {
  const t = ei(ge(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function no(e, t) {
  const n = Ja(t);
  ro(e, "discente", n.discente), ro(e, "verdadeiro", n.verdadeiro);
}
function ro(e, t, n) {
  const r = ge(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${ee}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const a = r.closest(`.${c}-ritual-roll-config__field`), i = a?.querySelector("small");
  if (a) {
    if (n) {
      i?.remove();
      return;
    }
    if (!i) {
      const l = document.createElement("small");
      l.textContent = "Indisponível neste ritual.", a.append(l);
    }
  }
}
function ce(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Ja(e) {
  const t = Ay(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function yy(e) {
  return io(e.item) ? e.item : io(e.document) ? e.document : null;
}
function by(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function Ay(e) {
  const t = e.system;
  return Ry(t) ? t : {};
}
function oo(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ge(e, t) {
  return e.querySelector(`[${Pe}="${_y(t)}"]`);
}
function Ge(e, t) {
  return ge(e, t)?.value.trim() ?? "";
}
function ao(e, t) {
  const n = Ge(e, t);
  return n.length > 0 ? n : null;
}
function re(e, t, n) {
  const r = ge(e, t);
  r && (r.value = n);
}
function ei(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function ti(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function Ty(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function io(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function Ry(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function _y(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let X = null;
Hooks.once("init", () => {
  Ni(), rs(), xs(), Pc(), d.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Un.isSupportedSystem()) {
    d.warn(
      `Sistema não suportado: ${Un.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  X = zh(), X.itemUseIntegration.registerStrategies(), Ns(X.conditions), hs(X), Is(), Cs(), Mc(), Yh(X), ty(), d.info("Inicializado para o sistema Ordem Paranormal."), d.info(
    `API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Jt} inicializado.`);
});
function Cy() {
  if (!X)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return X;
}
export {
  Cy as getToolkitServices
};
//# sourceMappingURL=main.js.map
