const c = "paranormal-toolkit", Zt = "Paranormal Toolkit", Qa = "ordemparanormal";
class Ie {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function et(e) {
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
function Xt(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Jt(t) ? y(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Za(e) {
  return Jt(e.getFlag(c, "automation"));
}
function Jt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Ja(t.source) && Xa(t.definition);
}
function Xa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && C(t.label) && Array.isArray(t.steps) && t.steps.every(ei) && (t.conditionApplications === void 0 || ii(t.conditionApplications));
}
function Ja(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? C(t.presetId) && C(t.presetVersion) && C(t.appliedAt) : t.type === "manual" ? C(t.label) && C(t.appliedAt) : !1;
}
function ei(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return ti(t);
    case "spendRitualCost":
      return ni(t);
    case "rollFormula":
      return ri(t);
    case "modifyResource":
      return oi(t);
    case "chatCard":
      return ai(t);
    default:
      return !1;
  }
}
function ti(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && ro(t);
}
function ni(e) {
  return e.type === "spendRitualCost";
}
function ri(e) {
  const t = e;
  return t.type === "rollFormula" && C(t.id) && C(t.formula) && (t.intent === void 0 || fi(t.intent)) && (t.damageType === void 0 || C(t.damageType));
}
function oi(e) {
  const t = e;
  return t.type === "modifyResource" && oo(t.actor) && di(t.resource) && mi(t.operation) && ro(t) && (t.damageType === void 0 || t.damageType === null || C(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function ai(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function ii(e) {
  return Array.isArray(e) && e.every(si);
}
function si(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return C(t.id) && oo(t.actor) && C(t.conditionId) && (t.label === void 0 || C(t.label)) && (t.duration === void 0 || t.duration === null || li(t.duration)) && (t.source === void 0 || C(t.source)) && (t.actionSectionId === void 0 || C(t.actionSectionId)) && (t.actionSectionTitle === void 0 || C(t.actionSectionTitle)) && (t.executedLabel === void 0 || C(t.executedLabel));
}
function li(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || pi(t.rounds)) && (t.expiry === void 0 || t.expiry === null || ci(t.expiry));
}
function ci(e) {
  return e === "turnStart" || e === "turnEnd";
}
function ro(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || C(e.amountFrom);
}
function oo(e) {
  return e === "self" || e === "target";
}
function di(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function mi(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function fi(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function pi(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function C(e) {
  return typeof e == "string" && e.length > 0;
}
function en(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(En);
    if (yi(t))
      return Array.from(t).filter(En);
  }
  return [];
}
function gi(e) {
  return en(e)[0] ?? null;
}
function hi(e) {
  return en(e).find(Za) ?? null;
}
function yi(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function En(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ee(e) {
  return en(e).filter((t) => t.type === "ritual");
}
function ao(e) {
  return Ee(e)[0] ?? null;
}
function bi(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(et);
      return d.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Te("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Pe(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Ln);
      return d.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Te("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Pe(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await Lt(e, r, o.value);
      d.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Te("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Pe(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        d.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await Lt(e, n, r.preset);
      d.info(`Melhor preset aplicado em ${n.name}.`, { match: Ln(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Sn(e);
    },
    async applyBestPresetsToActorRituals() {
      return Sn(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Te("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Pe(t);
      n && (await e.automationBinder.clear(n), d.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Sn(e) {
  const t = Te("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Ee(t);
  if (n.length === 0)
    return d.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Dn(t);
  const r = Dn(t, n.length);
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
    const i = await Lt(e, o, a.preset);
    r.applied.push(Ai(o, a, i));
  }
  return d.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Ti(r), r;
}
async function Lt(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Ai(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: et(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Dn(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Ti(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Ln(e) {
  return {
    preset: et(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Te(e) {
  const t = Ie.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Pe(e) {
  const t = ao(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function J(e) {
  return e ? {
    id: e.id,
    source: {
      ...Ri(e.sourceActor),
      token: e.sourceToken
    },
    item: _i(e.item),
    targets: e.targets.map(Ci),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Pn(e.rollRequests, io),
    rolls: Pn(e.rolls, ki),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(tn),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function tn(e) {
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
function Ri(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function _i(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Ci(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function io(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ki(e) {
  return {
    ...io(e),
    total: e.total
  };
}
function Pn(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function wi(e) {
  return {
    getSelected() {
      return Ie.getSelectedActor();
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
    $i(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (i) {
    d.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  d.info(`${t} realizado:`, tn(a));
}
function G(e) {
  const t = Ie.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function $i(e) {
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
function Ii() {
  Ne(O.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Ne(O.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Ne(O.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Ne(O.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Pt() {
  return {
    enabled: ve(O.enabled),
    console: ve(O.console),
    ui: ve(O.ui),
    chat: ve(O.chat)
  };
}
async function q(e, t) {
  await game.settings.set(c, O[e], t);
}
function Ne(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function ve(e) {
  return game.settings.get(c, e) === !0;
}
function Ei() {
  return {
    status() {
      return Pt();
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
const so = "ritual.costOnly", lo = "ritual.simpleHealing", Si = "ritual.eletrocussao", co = "ritual.simpleDamage", uo = "generic.simpleHealing", mo = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Di() {
  return [
    Li(),
    Pi(),
    Ni(),
    vi(),
    Oi()
  ];
}
function Li() {
  return {
    id: so,
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
function Pi() {
  return {
    id: lo,
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
    automation: fo(),
    itemPatch: Mi()
  };
}
function Ni() {
  return {
    id: Si,
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
    automation: Fi(),
    itemPatch: xi()
  };
}
function vi() {
  return {
    id: co,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: nn()
  };
}
function Oi() {
  return {
    id: uo,
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
function fo(e = "2d8+2") {
  return po(
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
function Fi() {
  return {
    ...nn("3d6", {
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
function nn(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return po(
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
function Mi() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: mo,
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
function xi() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: mo,
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
function po(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function rn() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: oe(t.id),
    actorId: oe(t.actor?.id),
    sceneId: oe(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function go() {
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
function Bi(e) {
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
        if (!ji(t, n)) {
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
      const r = e.automationRegistry.require(so);
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
      if (!Nn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(lo);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: fo(t)
      }), d.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = W("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = K(n);
      if (!r) return;
      if (!Nn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(co);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: nn(t)
      }), d.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = W("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = K(t);
      n && await Ui(e, t, n);
    }
  };
}
async function Ui(e, t, n) {
  const r = Xt(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: go(),
    item: n,
    targets: rn()
  });
  if (!o.ok) {
    qi(o.error);
    return;
  }
  d.info("Automação de ritual executada com sucesso.", J(o.value.context));
}
function qi(e) {
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
  const t = Ie.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function K(e) {
  const t = ao(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ji(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Nn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const zi = ["disabled", "ask", "automatic"], Vi = ["buttons", "confirm"], ho = "ask";
function Hi(e) {
  return typeof e == "string" && zi.includes(e);
}
function Gi(e) {
  return typeof e == "string" && Vi.includes(e);
}
function Wi(e) {
  return Hi(e) ? e : Gi(e) ? "ask" : ho;
}
const Ki = ["keep", "replace"], Yi = ["manual", "assisted"], yo = "keep", bo = "assisted", Qi = !0, E = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Zi() {
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
    default: ho
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
    default: yo
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
    default: bo
  }), game.settings.register(c, E.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Qi
  }), game.settings.register(c, E.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function vn() {
  const e = Wi(game.settings.get(c, E.executionMode)), t = To(game.settings.get(c, E.systemCardMode)), n = Ro(game.settings.get(c, E.damageResolutionMode));
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: Ao()
  };
}
function Xi() {
  return To(game.settings.get(c, E.systemCardMode));
}
function Ji() {
  return Ro(game.settings.get(c, E.damageResolutionMode));
}
function Ao() {
  return game.settings.get(c, E.ritualCastingCheckEnabled) === !0;
}
async function Y(e) {
  await game.settings.set(c, E.executionMode, e);
}
function To(e) {
  return Ki.includes(e) ? e : yo;
}
function Ro(e) {
  return Yi.includes(e) ? e : bo;
}
function es(e) {
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
const ts = [
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
function ns(e) {
  return {
    phases() {
      return ts;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = mt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = hi(t);
      if (!n) {
        d.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await On(e, t, n);
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
      if (!as(n)) {
        d.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = os(n) ?? mt("Nenhum ator encontrado para executar automação do item.");
      r && await On(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = mt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = gi(t);
      if (!n) {
        d.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(uo);
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
async function On(e, t, n) {
  const r = Xt(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: go(),
    item: n,
    targets: rn()
  });
  if (!o.ok) {
    rs(o.error);
    return;
  }
  d.info("Automação executada com sucesso.", J(o.value.context));
}
function rs(e) {
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
function mt(e) {
  const t = Ie.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function os(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function as(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function is(e) {
  const t = wi(e), n = bi(e), r = Bi(e), o = ns(e), a = Ei(), i = es(e);
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
function ss(e) {
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
      const r = Fn();
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
      return ls(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Fn();
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
      return cs(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Fn() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function ls(e) {
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
function cs(e) {
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
function us(e) {
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
    conditions: ss(e.conditions),
    debug: is(e)
  }, n = globalThis;
  return n[c] = t, n.ParanormalToolkit = t, t;
}
class Mn {
  static isSupportedSystem() {
    return game.system.id === Qa;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function ds() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ae(t.id),
    actorId: ae(t.actor?.id),
    sceneId: ae(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function _o() {
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
function ms(e, t = _o()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function fs(e) {
  if (!hs(e)) return null;
  const t = e.getFlag(c, "workflow");
  return gs(t) ? t : null;
}
function ps() {
  return `flags.${c}.workflow`;
}
function xn(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), n = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || n !== void 0;
}
function Bn(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Nt(t) || Nt(n);
}
function gs(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function hs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ae(e) {
  return Nt(e) ? e : null;
}
function Nt(e) {
  return typeof e == "string" && e.length > 0;
}
function ys() {
  const e = (t, n) => {
    bs(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function bs(e, t) {
  const n = fs(e);
  if (!n || n.targets.length === 0) return;
  const r = Ts(t);
  if (!r || r.querySelector(`.${c}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(As(n));
}
function As(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Un("Origem", e.source.name)), t.append(Un("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Un(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${c}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function Ts(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Rs() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!_s(r) || !Cs(e) || xn(e) || xn(t)) return;
    const o = ds();
    if (o.length === 0 || !Bn(e) && !Bn(t)) return;
    const a = _o();
    e.updateSource({
      [ps()]: ms(o, a)
    }), d.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function _s(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Cs(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let qn = !1, ft = !1, pt = !1, Oe = null;
const ks = 1e3, ws = 750, $s = 1e3;
function Is(e) {
  qn || (Hooks.on("combatTurnChange", (t) => {
    Ss(e, jn(t));
  }), Hooks.on("deleteCombat", (t) => {
    Ds(e, jn(t));
  }), qn = !0, Es(e));
}
function Es(e) {
  tt() && (ft || (ft = !0, globalThis.setTimeout(() => {
    ft = !1, on(e, "ready");
  }, ks)));
}
function Ss(e, t) {
  tt() && t && (Oe && globalThis.clearTimeout(Oe), Oe = globalThis.setTimeout(() => {
    Oe = null, on(e, "combat-turn-change", t);
  }, ws));
}
function Ds(e, t) {
  tt() && t && (pt || (pt = !0, globalThis.setTimeout(() => {
    pt = !1, on(e, "combat-deleted", t);
  }, $s)));
}
async function on(e, t, n) {
  if (tt())
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
function tt() {
  return game.user?.isGM === !0;
}
function jn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Co = {
  enabled: "dice.animations.enabled"
};
function Ls() {
  game.settings.register(c, Co.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Ps() {
  return {
    enabled: game.settings.get(c, Co.enabled) === !0
  };
}
const Ns = "chatCard", zn = "data-paranormal-toolkit-prompt-id", l = `${c}-item-use-prompt`, vs = `.${l}__title`, ko = `.${l}__header`, Os = `.${l}__roll-card`, Fs = `.${l}__roll-meta`, Ms = `.${l}__roll-meta-pill`, wo = `.${l}__resistance`, xs = `.${l}__resistance-header`, $o = `.${l}__resistance-description`, an = `.${l}__resistance-roll-button`, Io = `.${l}__resistance-roll-result`, Vn = `${l}__resistance-content`, Eo = `.${l}__workflow-section`, So = `.${l}__workflow-roll`, Do = `${l}__workflow-roll--dice-open`, Lo = `.${l}__workflow-roll-formula`, Po = `${l}__workflow-roll-formula--toggle`, sn = `.${l}__workflow-dice-tray`, Bs = `.${l}__roll-detail-toggle`, Us = `.${l}__roll-detail-list`, qs = `.${l}__ritual-element-badge`, js = `.${l}__ritual-metadata`, zs = "casting-backlash", Vs = "data-paranormal-toolkit-action-section", Hs = "data-paranormal-toolkit-prompt-id", Gs = "data-paranormal-toolkit-pending-id", Hn = "data-paranormal-toolkit-casting-backlash-enhanced", Gn = `.${l}`, Ws = `.${l}__workflow-section--casting`, Ks = `.${l}__workflow-section-header`, Ys = `.${l}__workflow-notes`, Qs = `[${Vs}="${zs}"]`, Wn = `${l}__workflow-section-title-row`, Zs = `${l}__workflow-section-header--casting-backlash`, No = `${l}__casting-backlash-button`;
function Xs(e) {
  for (const t of Js(e))
    el(t), al(t);
}
function Js(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Gn) && t.add(e);
  for (const n of e.querySelectorAll(Gn))
    t.add(n);
  return Array.from(t);
}
function el(e) {
  const t = e.querySelector(Qs);
  if (!t) return;
  const n = tl(t);
  if (!n) return;
  const r = e.querySelector(`${Ws} ${Ks}`);
  r && (r.classList.add(Zs), nl(r), rl(n), r.append(n), t.remove());
}
function tl(e) {
  return e.querySelector(
    `button[${Gs}], button[${Hs}]`
  );
}
function nl(e) {
  const t = e.querySelector(`:scope > .${Wn}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Wn);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(No) || n.append(o));
  return n;
}
function rl(e) {
  if (e.getAttribute(Hn) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = ol(t, e.disabled);
  e.classList.add(No), e.setAttribute(Hn, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function ol(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function al(e) {
  for (const t of e.querySelectorAll(Ys)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function il(e) {
  for (const t of Array.from(e.querySelectorAll(Eo)))
    for (const n of Array.from(t.querySelectorAll(`${Bs}, ${Us}`)))
      n.remove();
}
const sl = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function ll(e) {
  for (const t of Array.from(e.querySelectorAll(wo)))
    cl(t);
  kl(e);
}
function cl(e) {
  const t = e.querySelector(xs), n = e.querySelector($o), r = e.querySelector(an), o = e.querySelector(Io);
  if (!r || !t && !n && !o) return;
  const a = ul(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && (o.parentElement !== a && !r.contains(o) && a.append(o), dl(o)), r.parentElement !== e && e.append(r);
}
function ul(e, t) {
  const n = e.querySelector(`.${Vn}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Vn), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function dl(e) {
  const t = ml(e.textContent ?? "");
  t && (e.setAttribute(sl, "true"), e.replaceChildren(gl(t)));
}
function ml(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, a = n?.trim() ?? "Resistência", i = Number(o);
  if (!Number.isFinite(i)) return null;
  const { formula: s, diceValues: u } = fl(r ?? "");
  return s ? {
    skillLabel: a,
    formula: s,
    total: Math.trunc(i),
    diceValues: u
  } : null;
}
function fl(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: pl(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function pl(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function gl(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${l}__workflow-roll`,
    `${l}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${l}__workflow-roll-formula`), n.textContent = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = hl(e);
  return r && t.append(r), t;
}
function hl(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${l}__workflow-dice-tray`);
  for (const n of yl(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${l}__workflow-die`), n.active || r.classList.add(`${l}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function yl(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Kn(e, "highest") : n.includes("kl") ? Kn(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Kn(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
const bl = `.${l}__actions`, ln = `.${l}__actions-title`, Al = `.${l}__button`, Tl = "data-paranormal-toolkit-action-section", Rl = "data-paranormal-toolkit-damage-resolution-state", Yn = "data-paranormal-toolkit-resistance-damage-refresh-bound", _l = `.${l}__workflow-section--effect`, Cl = `.${l}__workflow-section--casting`;
function kl(e) {
  for (const t of Array.from(e.querySelectorAll(`.${l}__roll-card`)))
    vo(t);
}
function vo(e) {
  const t = wl(e);
  if (!t) return;
  const n = $l(e), r = e.querySelector(wo);
  if (r && r.parentElement !== t && t.append(r), !n) return;
  n.classList.add(`${l}__actions--embedded`, `${l}__actions--damage-resolution`);
  const o = n.querySelector(ln);
  o && (o.textContent = "Aplicar dano"), n.parentElement !== t && t.append(n), El(e), Il(e, n);
}
function wl(e) {
  return Array.from(e.querySelectorAll(_l)).find((t) => {
    const n = t.querySelector(`.${l}__workflow-section-header strong`)?.textContent?.trim();
    return Oo(n) === "dano";
  }) ?? null;
}
function $l(e) {
  const t = Array.from(e.parentElement?.querySelectorAll(bl) ?? []);
  return t.find((n) => n.getAttribute(Tl) === "apply-damage") ?? t.find((n) => Oo(n.querySelector(ln)?.textContent) === "aplicar danos") ?? null;
}
function Il(e, t) {
  const n = Array.from(t.querySelectorAll(Al)), r = Qn(n, "normal"), o = Qn(n, "half");
  if (!r || !o) {
    t.classList.add(`${l}__actions--compact`);
    return;
  }
  const a = Ll();
  if (t.classList.toggle(`${l}__actions--assisted`, a === "assisted"), t.classList.toggle(`${l}__actions--manual`, a !== "assisted"), a !== "assisted") {
    j(r, !0), j(o, !0), Fe(t, "manual", "Escolha manualmente o dano a aplicar.");
    return;
  }
  const i = Sl(e), s = Dl(e);
  if (s === null) {
    j(r, !0), j(o, !0), Fe(t, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (i === null) {
    j(r, !0), j(o, !1), Fe(t, "pending", "Aguardando resistência. O botão aplica dano normal até a resistência ser rolada.");
    return;
  }
  const u = i >= s;
  j(r, !u), j(o, u), Fe(
    t,
    u ? "resisted" : "failed",
    u ? `Resistiu: ${i} vs DT ${s}.` : `Falhou: ${i} vs DT ${s}.`
  );
}
function Qn(e, t) {
  const n = t === "normal" ? /\bnormal\b|\bcheio\b/iu : /\bmetade\b|\bmeio\b|1\/2/iu;
  return e.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function j(e, t) {
  e.hidden = !t, e.classList.toggle(`${l}__button--damage-resolution-selected`, t);
}
function Fe(e, t, n) {
  e.setAttribute(Rl, t);
  const r = e.querySelector(`.${l}__damage-resolution-summary`), o = r ?? document.createElement("span");
  o.classList.add(`${l}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(ln)?.after(o);
}
function El(e) {
  const t = e.querySelector(an);
  t && t.getAttribute(Yn) !== "true" && (t.setAttribute(Yn, "true"), t.addEventListener("click", () => {
    for (const n of [0, 80, 250, 700])
      globalThis.setTimeout(() => {
        vo(e);
      }, n);
  }));
}
function Sl(e) {
  const t = e.querySelector(an)?.getAttribute("data-paranormal-toolkit-resistance-roll-result"), n = vt(t);
  if (n !== null) return n;
  const r = e.querySelector(Io)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return vt(o?.[1] ?? null);
}
function Dl(e) {
  const n = e.querySelector(Cl)?.textContent ?? e.textContent ?? "", r = /\bDT\s*(-?\d+)\b/iu.exec(n);
  return vt(r?.[1] ?? null);
}
function vt(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Ll() {
  try {
    return Ji();
  } catch {
    return "assisted";
  }
}
function Oo(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Zn(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function cn() {
  const e = globalThis.game;
  return nt(e) ? e : null;
}
function D(e, t) {
  const n = Pl(e, t);
  return Ue(n);
}
function Pl(e, t) {
  return t.split(".").reduce((n, r) => nt(n) ? n[r] : null, e);
}
function Nl(e, t) {
  const n = e.indexOf(":");
  return n < 0 || we(e.slice(0, n)) !== we(t) ? null : me(e.slice(n + 1));
}
function Ue(e) {
  return typeof e == "string" ? me(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function nt(e) {
  return !!e && typeof e == "object";
}
function vl(e) {
  return typeof e == "string";
}
function rt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function me(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function we(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Ot(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function V(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Fo(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Ol(e) {
  for (const t of Array.from(e.querySelectorAll(Os))) {
    const n = jl(t);
    Fl(t), n && (Ml(t, n), xl(t, n));
  }
}
function Fl(e) {
  for (const t of Array.from(e.querySelectorAll(Fs)))
    t.remove();
}
function Ml(e, t) {
  const r = e.closest(`.${l}`)?.querySelector(ko) ?? null, o = r?.querySelector(vs) ?? null, a = r ?? e, i = a.querySelector(qs);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const s = i ?? document.createElement("span");
  if (s.className = ac(t.elementTone), s.textContent = oc(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", s);
      return;
    }
    a.prepend(s);
  }
}
function xl(e, t) {
  const n = Bl(e);
  Ul(e, n);
  const r = ql(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${l}__ritual-metadata`);
  for (const i of r) {
    const s = document.createElement("span");
    s.classList.add(`${l}__ritual-metadata-chip`), s.textContent = i, o.append(s);
  }
  if (n) {
    const i = n.querySelector(`.${l}__summary`);
    if (i?.parentElement === n) {
      i.insertAdjacentElement("afterend", o);
      return;
    }
    n.append(o);
    return;
  }
  const a = e.querySelector(Eo);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function Bl(e) {
  return e.closest(`.${l}`)?.querySelector(ko) ?? null;
}
function Ul(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(js)))
      o.remove();
}
function ql(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Ot(e.target)}` : null,
    e.duration ? `Duração: ${Ot(e.duration)}` : null,
    e.resistance ? `Resistência: ${Fo(e.resistance)}` : null
  ].filter(rt);
}
function jl(e) {
  const t = zl(e), n = Yl(e), o = (t ? Kl(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = un(D(o, "element")), s = M("op.elementChoices", i) ?? Xn(Z(a, "Elemento")) ?? Xn(n.damageType), u = i ?? ic(s), m = D(o, "circle") ?? Z(a, "Círculo"), f = Xl(o) ?? Z(a, "Alvo"), A = nc(o, "duration", "op.durationChoices") ?? Z(a, "Duração"), R = Ql(e) ?? ec(o) ?? Z(a, "Resistência"), _ = Zl(a) ?? n.cost, g = {
    elementLabel: s,
    elementTone: u,
    circle: m,
    cost: _,
    target: f,
    duration: A,
    resistance: R
  };
  return rc(g) ? g : null;
}
function zl(e) {
  const t = Vl(e);
  if (!t) return null;
  const n = t.getFlag?.(c, Ns), r = Gl(n);
  if (r.length === 0) return null;
  const o = Hl(e);
  if (o.size > 0) {
    const a = r.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function Vl(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? cn()?.messages?.get?.(n) ?? null : null;
}
function Hl(e) {
  const t = e.closest(`.${l}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${zn}]`))) {
    const o = r.getAttribute(zn)?.trim();
    o && n.add(o);
  }
  return n;
}
function Gl(e) {
  if (!nt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Wl).filter((n) => n !== null) : [];
}
function Wl(e) {
  return nt(e) ? {
    pendingId: Ue(e.pendingId),
    actorId: Ue(e.actorId),
    itemId: Ue(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(vl) : []
  } : null;
}
function Kl(e) {
  if (!e.itemId) return null;
  const t = cn(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Yl(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(Ms))) {
    const o = me(r.textContent);
    if (!o) continue;
    const a = Nl(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function Ql(e) {
  const t = me(e.querySelector($o)?.textContent);
  return t ? Fo(t) : null;
}
function Z(e, t) {
  const n = we(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || we(r.slice(0, o)) !== n))
      return me(r.slice(o + 1));
  }
  return null;
}
function Zl(e) {
  const t = Z(e, "Custo") ?? Z(e, "PE");
  return t || (e.map(me).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Xl(e) {
  const t = D(e, "target");
  if (!t) return null;
  if (t === "area")
    return Jl(e) ?? M("op.targetChoices", t) ?? "Área";
  const n = M("op.targetChoices", t) ?? V(t);
  return [t === "people" || t === "creatures" ? D(e, "targetQtd") : null, n].filter(rt).join(" ");
}
function Jl(e) {
  const t = D(e, "area.name"), n = D(e, "area.size"), r = D(e, "area.type"), o = t ? M("op.areaChoices", t) ?? V(t) : null, a = r ? M("op.areaTypeChoices", r) ?? V(r) : null;
  return o ? n ? a ? `${o} ${n}m ${Ot(a)}` : `${o} ${n}m` : o : null;
}
function ec(e) {
  const t = D(e, "skillResis"), n = D(e, "resistance");
  if (!t || !n) return null;
  const r = M("op.skill", t) ?? V(t), o = tc(n);
  return [r, o].filter(rt).join(" ");
}
function tc(e) {
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
      return M("op.resistanceChoices", e) ?? V(e);
  }
}
function nc(e, t, n) {
  const r = D(e, t);
  return r ? M(n, r) ?? V(r) : null;
}
function rc(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function oc(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function ac(e) {
  return [
    `${l}__ritual-element-badge`,
    e ? `${l}__ritual-element-badge--${e}` : null
  ].filter(rt).join(" ");
}
function un(e) {
  const t = we(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Xn(e) {
  const t = un(e);
  return t ? M("op.elementChoices", t) ?? V(t) : e ? V(e) : null;
}
function ic(e) {
  return un(e);
}
function M(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = cn()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Jn = "data-paranormal-toolkit-dice-toggle-enhanced";
function sc(e) {
  for (const t of Array.from(e.querySelectorAll(So)))
    Mo(t);
}
function lc(e) {
  const t = Bo(e.target);
  if (!t) return;
  const n = dn(t);
  n && (e.preventDefault(), xo(n, t));
}
function cc(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Bo(e.target);
  if (!t) return;
  const n = dn(t);
  n && (e.preventDefault(), xo(n, t));
}
function Mo(e) {
  const t = e.querySelector(sn);
  if (!t) return;
  const n = e.querySelector(Lo);
  if (n && n.getAttribute(Jn) !== "true" && (n.setAttribute(Jn, "true"), n.classList.add(Po), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function xo(e, t) {
  const n = e.querySelector(sn);
  if (!n) return;
  const r = !e.classList.contains(Do);
  uc(e, t, n, r);
}
function uc(e, t, n, r) {
  e.classList.toggle(Do, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Bo(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Lo);
  if (!t) return null;
  const n = dn(t);
  return n ? (Mo(n), t.classList.contains(Po) ? t : null) : null;
}
function dn(e) {
  const t = e.closest(So);
  return t && t.querySelector(sn) ? t : null;
}
const er = `${c}-workflow-dice-toggle-styles`;
function dc() {
  if (document.getElementById(er)) return;
  const e = document.createElement("style");
  e.id = er, e.textContent = `
.${l}__workflow-section .${l}__roll-detail-toggle,
.${l}__workflow-section .${l}__roll-detail-list {
  display: none !important;
}

.${l}__workflow-roll:not(.${l}__workflow-roll--dice-open) .${l}__workflow-dice-tray,
.${l}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${l}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${l}__workflow-roll-formula--toggle:hover,
.${l}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${l}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${l}__header .${l}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${l}__ritual-element-badge {
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

.${l}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${l}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${l}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${l}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${l}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${l}__header .${l}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${l}__roll-card > .${l}__ritual-metadata {
  display: none !important;
}

.${l}__ritual-metadata-chip {
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

.${l}__resistance {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 34px;
  grid-template-areas: "content button";
  align-items: center !important;
  column-gap: 0.62rem;
  row-gap: 0;
  padding: 0.56rem 0.58rem !important;
}

.${l}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${l}__resistance-content .${l}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${l}__resistance-content .${l}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${l}__resistance-content .${l}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${l}__resistance > .${l}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: center;
}

.${l}__resistance-content .${l}__resistance-roll-result {
  display: block;
  min-width: 0;
  margin-top: 0;
}

.${l}__resistance-workflow-roll {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 0.34rem;
  padding-top: 0.1rem;
}

.${l}__resistance-workflow-roll .${l}__workflow-roll-formula {
  display: inline-flex;
  width: 100%;
  max-width: 100%;
  min-height: 1.78rem;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

.${l}__resistance-workflow-roll .${l}__workflow-roll-formula i {
  margin-left: auto;
}

.${l}__resistance-workflow-roll .${l}__workflow-dice-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
  border-top: 1px solid rgba(79, 55, 42, 0.12);
  padding-top: 0.34rem;
}

.${l}__resistance-workflow-roll .${l}__workflow-die {
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

.${l}__resistance-workflow-roll .${l}__workflow-die--inactive {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(36, 27, 24, 0.46);
  opacity: 0.58;
}
.${l}__workflow-section--casting .${l}__workflow-section-header--casting-backlash {
  grid-template-columns: minmax(0, 1fr) 34px;
}

.${l}__workflow-section-title-row {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.38rem;
}

.${l}__workflow-section-title-row .${l}__workflow-section-status {
  flex: 0 0 auto;
}

.${l}__casting-backlash-button {
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

.${l}__casting-backlash-button::before {
  content: "↪";
  font-size: 1rem;
  font-weight: 950;
  line-height: 1;
}

.${l}__casting-backlash-button:hover,
.${l}__casting-backlash-button:focus {
  border-color: rgba(125, 39, 43, 0.66) !important;
  background: rgba(143, 62, 67, 0.94) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 0 0 2px rgba(125, 39, 43, 0.16) !important;
  outline: none !important;
}

.${l}__casting-backlash-button:disabled {
  cursor: default !important;
  opacity: 0.78 !important;
}

.${l}__casting-backlash-button.${l}__button--executed::before {
  content: "✓";
}

/* 0.21.0 — Resolução de dano assistida e ações compactas no card */
.${l}__workflow-section--effect .${l}__resistance {
  margin-top: 0.5rem !important;
  border: 1px solid rgba(127, 88, 39, 0.14) !important;
  border-radius: 8px !important;
  background: rgba(255, 246, 229, 0.48) !important;
}

.${l}__actions--embedded {
  margin-top: 0.46rem !important;
  border: 1px solid rgba(97, 63, 43, 0.12) !important;
  border-radius: 8px !important;
  padding: 0.48rem !important;
  background: rgba(255, 255, 255, 0.38) !important;
  box-shadow: none !important;
}

.${l}__actions--compact,
.${l}__actions--damage-resolution {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  gap: 0.34rem !important;
}

.${l}__actions--damage-resolution .${l}__actions-title {
  flex: 1 0 100%;
  margin: 0 !important;
  color: rgba(71, 47, 34, 0.74) !important;
  font-size: 0.68rem !important;
  font-weight: 900 !important;
  letter-spacing: 0.045em !important;
  line-height: 1 !important;
  text-transform: uppercase !important;
}

.${l}__damage-resolution-summary {
  flex: 1 0 100%;
  margin-top: -0.08rem;
  color: rgba(54, 39, 31, 0.64);
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.28;
}

.${l}__actions--embedded .${l}__button,
.${l}__actions--damage-resolution .${l}__button {
  flex: 1 1 8rem !important;
  min-height: 1.9rem !important;
  margin: 0 !important;
  border-radius: 999px !important;
  padding: 0.32rem 0.68rem !important;
  font-size: 0.76rem !important;
  font-weight: 900 !important;
  line-height: 1.1 !important;
}

.${l}__actions--damage-resolution .${l}__button[hidden] {
  display: none !important;
}

.${l}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${l}__damage-resolution-summary {
  color: rgba(34, 93, 55, 0.84);
}

.${l}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${l}__damage-resolution-summary {
  color: rgba(112, 44, 44, 0.82);
}

`, document.head.append(e);
}
const mc = [0, 100, 500, 1500, 3e3];
let tr = !1, gt = null;
function fc() {
  if (!tr) {
    tr = !0, dc(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Re(Zn(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Re(Zn(t));
    }), Hooks.once("ready", () => {
      Re(document), pc();
    }), document.addEventListener("click", lc), document.addEventListener("keydown", cc);
    for (const e of mc)
      globalThis.setTimeout(() => Re(document), e);
  }
}
function pc() {
  gt || !document.body || (gt = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Re(n);
  }), gt.observe(document.body, { childList: !0, subtree: !0 }));
}
function Re(e) {
  e && (il(e), Ol(e), ll(e), sc(e), Xs(e));
}
function gc() {
  fc();
}
const hc = "data-paranormal-toolkit-action-section", yc = "ritual-log", bc = ".paranormal-toolkit-item-use-prompt__actions", Ac = ".paranormal-toolkit-item-use-prompt__actions-title", Tc = [0, 100, 500, 1500];
let nr = !1;
function Rc() {
  if (nr) return;
  const e = (t, n) => {
    rr(wc(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), rr(document), nr = !0;
}
function rr(e) {
  for (const t of Tc)
    globalThis.setTimeout(() => _c(e), t);
}
function _c(e) {
  Cc(e), kc(e);
}
function Cc(e) {
  for (const t of e.querySelectorAll(
    `[${hc}="${yc}"]`
  ))
    t.remove();
}
function kc(e) {
  for (const t of e.querySelectorAll(bc)) {
    if (or(t.querySelector(Ac)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (a) => or(a.textContent ?? "")
    ).some((a) => a.includes("ritual conjurado")) && t.remove();
  }
}
function wc(e) {
  if (e instanceof HTMLElement || $c(e))
    return e;
  if (Ic(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function $c(e) {
  return e instanceof HTMLElement;
}
function Ic(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function or(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Ec = {
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
}, Sc = new Set(
  Object.values(Ec)
), Dc = {
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
function Lc(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Pc(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Dc[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Sc.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function Uo(e) {
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
function Pc(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Nc {
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
    const i = [], s = /* @__PURE__ */ new Set();
    let u = null;
    for (const [m, f] of t.instances.entries()) {
      const A = vc(f, m);
      if (!A.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const R = Lc(f.damageType);
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
          Oc(A.id, f, R.value)
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
        for (const N of Mc(_.conditions))
          s.add(N);
        const g = Fc(_.newPV);
        g !== null && (u = g), i.push({
          id: A.id,
          label: f.label ?? Uo(R.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: A.amount,
          finalDamage: ar(_.finalDamage, A.amount),
          blocked: ar(_.blocked, 0),
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
      conditions: Array.from(s),
      instances: i,
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
function vc(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Oc(e, t, n) {
  return {
    id: e,
    label: t.label ?? Uo(n),
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
function ar(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Fc(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Mc(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const _e = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, qo = {
  PV: "system.attributes.hp"
}, Ft = {
  PV: [_e.PV, qo.PV],
  SAN: [_e.SAN],
  PE: [_e.PE],
  PD: [_e.PD]
}, Mt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class xc {
  getResource(t, n) {
    const r = ir(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, i = `${o}.max`, s = foundry.utils.getProperty(t, a), u = foundry.utils.getProperty(t, i), m = lr(t, n, a, s, "valor atual");
    if (m) return p(m);
    const f = lr(t, n, i, u, "valor máximo");
    return f ? p(f) : y({
      value: s,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = ir(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function ir(e, t) {
  const n = Bc(e.type, t);
  if (n && sr(e, n))
    return y(n);
  const r = Ft[t].find(
    (o) => sr(e, o)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Uc(e, t),
    path: Ft[t].join(" | ")
  });
}
function Bc(e, t) {
  return e === "threat" ? qo[t] ?? null : e === "agent" ? _e[t] : null;
}
function sr(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Uc(e, t) {
  const n = e.type ?? "unknown", r = Ft[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function lr(e, t, n, r, o) {
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
class qc {
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
      const i = Mt.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: r, value: o } = n, a = jc(o);
    return a ? y(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Mt.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function jc(e) {
  if (cr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (cr(n))
      return n;
  }
  return null;
}
function cr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const zc = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Vc {
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
    const r = n.value, o = Hc(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: zc[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Hc(e, t) {
  const n = e.getFlag(c, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Gc(n) ? {
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
function Gc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const ht = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Wc(e) {
  if (!Jc(e.item)) return null;
  const t = xt(e.actor) ? e.actor : Kc(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Qc(e.token) ?? Yc(t),
    targets: rn(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Kc(e) {
  const t = e;
  return xt(t.actor) ? t.actor : xt(e.parent) ? e.parent : null;
}
function Yc(e) {
  const t = Zc(e) ?? Xc(e);
  return t ? jo(t) : null;
}
function Qc(e) {
  return Bt(e) ? jo(e) : null;
}
function Zc(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Bt(n) ? n : (t.getActiveTokens?.() ?? []).find(Bt) ?? null;
}
function Xc(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function jo(e) {
  const t = e.actor ?? null;
  return {
    tokenId: yt(e.id),
    actorId: yt(t?.id),
    sceneId: yt(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Jc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function xt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Bt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function yt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class eu {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(ht.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, d.info(`${ht.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Wc(tu(t));
    if (!n) {
      d.warn(`${ht.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function tu(e) {
  return e && typeof e == "object" ? e : {};
}
class nu {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return bt("missing-item-patch");
    if (t.type !== "ritual") return bt("unsupported-item-type");
    const o = ru(r);
    return Object.keys(o).length === 0 ? bt("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function ru(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (w(t, "system.circle", n.circle), w(t, "system.element", n.element), w(t, "system.target", n.target), w(t, "system.targetQtd", n.targetQuantity), w(t, "system.execution", n.execution), w(t, "system.range", n.range), w(t, "system.duration", n.duration), w(t, "system.skillResis", n.resistanceSkill), w(t, "system.resistance", n.resistance), w(t, "system.studentForm", n.studentForm), w(t, "system.trueForm", n.trueForm)), t;
}
function w(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function bt(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class ou {
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
    return this.getNumber(t, Mt.ritual.dt, 0);
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
class au {
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
class iu {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = su(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, At(t)), y(t)) : n;
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
    return n ? At(n) : null;
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
    return Array.from(this.presets.values()).map(At);
  }
  findForItem(t) {
    return this.list().map((n) => lu(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function su(e) {
  return !Tt(e.id) || !Tt(e.version) || !Tt(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function lu(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = cu(o, t);
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
function cu(e, t) {
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
      const n = ur(t.name), r = e.names.map(ur).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = uu(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function ur(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function uu(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function At(e) {
  return structuredClone(e);
}
function Tt(e) {
  return typeof e == "string" && e.length > 0;
}
function He(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = ot(e.amountFrom);
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
function ot(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const du = "dice-so-nice";
async function zo(e) {
  if (!mu() || !fu()) return;
  const t = pu();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      d.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function mu() {
  try {
    return Ps().enabled;
  } catch {
    return !1;
  }
}
function fu() {
  return game.modules?.get?.(du)?.active === !0;
}
function pu() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function gu(e, t, n) {
  if (!dr(e.id) || !dr(e.formula))
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
    await zo(o);
    const s = {
      ...n.rollRequests[e.id] ?? Vo(e, t),
      total: a,
      roll: o
    };
    return n.rolls[e.id] = s, y(s);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function Vo(e, t) {
  const n = e.intent ?? hu(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function hu(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function dr(e) {
  return typeof e == "string" && e.length > 0;
}
async function Ge(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Me(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Me(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? Me(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? Me(t, n, r, o) : e.recover(t, n, o);
  }
}
function Me(e, t, n, r) {
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
function yu(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = bu(t, n, r, o);
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
    const i = Au(t, n, r, o);
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
function bu(e, t, n, r) {
  const o = ot(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: Ho(t.id, "damage", r, t.damageInstances.length),
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
function Au(e, t, n, r) {
  const o = ot(e.amountFrom);
  return {
    id: Ho(t.id, "healing", r, t.healingInstances.length),
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
function Ho(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Tu(e, t, n) {
  const r = ot(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function Ru(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Go("before", e), mr("before", e), mr("resolve", e);
}
function _u(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Go("apply", e);
}
function Cu(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Go(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t, s = ku(e, n.operation);
  s && i.emit(s, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function mr(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t;
  n.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function ku(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function wu(e, t, n) {
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
async function $u(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Iu(e, t);
    case "spendRitualCost":
      return Eu(e, t);
  }
}
async function Iu(e, t) {
  const { context: n, resources: r } = e, o = He(t, n);
  return o.ok ? Wo(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function Eu(e, t) {
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
  }), Wo(await r.spend(n.sourceActor, i.resource, i.amount), n, t);
}
function Wo(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Su(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, i = Du(t);
  for (const u of i.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const s = await a();
  if (!s.ok)
    return s;
  for (const u of i.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return s;
}
function Du(e) {
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
class Lu {
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
        return Su({
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
    const o = await $u({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = Vo(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const i = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, i), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: i }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await gu(t, r, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = He(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = Tu(t, n, o.value);
    Ru({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), _u({
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
    for (const s of i) {
      const u = await Ge(this.resources, s, t.resource, t.operation, o.value), m = this.handleResourceOperationResult(u, n, r, t);
      if (!m.ok)
        return m;
      yu({
        step: t,
        context: n,
        transaction: m.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Cu({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = He(t, n);
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
      const s = await Ge(this.resources, i, t.resource, t.operation, o.value), u = this.handleResourceOperationResult(s, n, r, t);
      if (!u.ok)
        return u;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await wu(this.messages, t, n);
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
    const s = Pu(t, n.intent);
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
function Pu(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Nu {
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
    const i = a.value, s = this.calculate(r, i, o);
    if (!s.ok)
      return p({
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
    const { afterValue: u, appliedAmount: m } = s.value, f = {
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
function Ko(e) {
  return {
    id: vu(),
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
function vu() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ou {
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
    const r = Ko(n);
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
class Fu {
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
class Mu {
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
    const n = Pt();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: xu(),
      flags: {
        ...t.flags,
        [c]: {
          ...Bu(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && d.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = Pt();
    if (!r.enabled)
      return;
    const o = n.notification ?? fr(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = fr(n);
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
function fr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function xu() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Bu(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function Uu(e, t) {
  const n = Wu(e?.rounds);
  if (!n)
    return pr(null);
  const r = e?.anchor ?? Yo(t);
  if (!r)
    return {
      ...pr(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: qu(),
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
function Yo(e) {
  const t = Ku();
  if (!t?.id || !Qo(t.round)) return null;
  const n = Hu(t), r = ju(e, n) ?? Vu(t), o = z(r?.id), a = Qu(r?.initiative), i = zu(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: i,
    initiative: a,
    time: Yu()
  };
}
function qu() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function pr(e) {
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
function ju(e, t) {
  return e?.id ? t.find((n) => Gu(n) === e.id) ?? null : null;
}
function zu(e, t, n) {
  const r = z(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return Zu(e.turn) ? e.turn : null;
}
function Vu(e) {
  return qe(e.combatant) ? e.combatant : null;
}
function Hu(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(qe);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(qe);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(qe);
  }
  return [];
}
function Gu(e) {
  return z(e.actor?.id) ?? z(e.actorId) ?? z(e.token?.actor?.id) ?? z(e.token?.actorId) ?? z(e.document?.actor?.id) ?? z(e.document?.actorId);
}
function Wu(e) {
  return Qo(e) ? Math.trunc(e) : null;
}
function Ku() {
  return game.combat ?? null;
}
function Yu() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function qe(e) {
  return !!(e && typeof e == "object");
}
function z(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Qu(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Qo(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Zu(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class Xu {
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
    if (!ld(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = Uu(t.duration, r), i = Ju(o, t, a), u = t.refreshExisting ?? !0 ? cd(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(i)), y(gr(r, o, u.id ?? null, !1, !0, a));
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
      return y(gr(r, o, f, !0, !1, a));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = Xo(n, r);
    let a = 0;
    try {
      for (const i of o)
        await hr(n, i) === "deleted" && (a += 1);
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
    const n = md(), r = [];
    let o = 0, a = 0;
    for (const i of n) {
      const s = mn(i);
      o += s.length;
      for (const u of s) {
        if (!nd(u, t)) continue;
        const m = Zo(u);
        try {
          await hr(i, u) === "deleted" && (a += 1);
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
function Ju(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: _d(),
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
    duration: ed(n.duration),
    start: td(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [c]: r
    }
  };
}
function ed(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function td(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Rd(),
    ...e
  };
}
function gr(e, t, n, r, o, a) {
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
function nd(e, t) {
  const n = Zo(e);
  if (!n.conditionId || !rd(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Td();
  return n.durationMode === "combatantTurn" || od(n) ? id(n, r) : ad(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !L(n.startRound) || !L(n.requestedRounds) || !L(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function rd(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && L(e.requestedRounds);
}
function od(e) {
  return !!(e.combatDurationApplied && L(e.requestedRounds) && L(e.startRound) && (e.startCombatantId || We(e.startTurn)));
}
function ad(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function id(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !L(e.startRound) || !L(e.requestedRounds) || !L(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = sd(t);
  return e.startCombatantId ? r === e.startCombatantId : We(e.startTurn) && We(t.turn) ? t.turn === e.startTurn : !1;
}
function sd(e) {
  return ie(e.combatant?.id);
}
function Zo(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: je(e, "conditionId"),
    requestedRounds: yr(e, "requestedRounds") ?? Ce(t.value) ?? Ce(t.rounds),
    combatDurationApplied: Rt(e, "combatDurationApplied"),
    combatId: je(e, "combatId") ?? ie(n.combat) ?? ie(t.combat),
    startCombatantId: je(e, "startCombatantId") ?? ie(n.combatant),
    startInitiative: hd(e, "startInitiative") ?? Jo(n.initiative),
    startRound: yr(e, "startRound") ?? Ce(n.round) ?? Ce(t.startRound),
    startTurn: gd(e, "startTurn") ?? Ut(n.turn) ?? Ut(t.startTurn),
    expiryEvent: yd(e, "expiryEvent") ?? ea(t.expiry),
    durationMode: bd(e, "durationMode"),
    deleteOnExpire: Rt(e, "deleteOnExpire"),
    expiresWithCombat: Rt(e, "expiresWithCombat")
  };
}
function ld(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function cd(e, t) {
  return Xo(e, t)[0] ?? null;
}
function Xo(e, t) {
  return mn(e).filter((n) => pd(n) === t);
}
async function hr(e, t) {
  const n = t.id ?? null, r = n ? ud(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (dd(o)) return "missing";
    throw o;
  }
}
function ud(e, t) {
  return mn(e).find((n) => n.id === t) ?? null;
}
function dd(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function md() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      xe(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    xe(e, n);
  });
  for (const n of fd())
    xe(e, n.actor), xe(e, n.document?.actor);
  return Array.from(e.values());
}
function xe(e, t) {
  if (!Ad(t)) return;
  const r = ie(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function fd() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function mn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function pd(e) {
  return je(e, "conditionId");
}
function je(e, t) {
  return ie(te(e, t));
}
function yr(e, t) {
  return Ce(te(e, t));
}
function gd(e, t) {
  return Ut(te(e, t));
}
function hd(e, t) {
  return Jo(te(e, t));
}
function yd(e, t) {
  return ea(te(e, t));
}
function bd(e, t) {
  const n = te(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Rt(e, t) {
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
function Ut(e) {
  return We(e) ? Math.trunc(e) : null;
}
function Jo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ea(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Ad(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Td() {
  return game.combat ?? null;
}
function Rd() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function L(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function We(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function _d() {
  return game.user?.id ?? null;
}
const Cd = "icons/svg/downgrade.svg", kd = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Cd,
    description: kd,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const wd = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), $d = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Id = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Ed = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Sd = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Dd = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Ld = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Pd = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Nd = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), vd = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Od = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Fd = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Md = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), xd = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Bd = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Ud = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), qd = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), jd = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), zd = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Vd = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Hd = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Gd = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Wd = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Kd = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Yd = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Qd = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Zd = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Xd = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Jd = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), em = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), tm = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), nm = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), rm = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), om = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), am = [
  wd,
  $d,
  Id,
  Ed,
  Sd,
  Dd,
  Ld,
  Pd,
  Nd,
  vd,
  Od,
  Fd,
  Md,
  xd,
  Bd,
  Ud,
  qd,
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
  om
];
class im {
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
    return Array.from(this.definitions.values()).map(br);
  }
  get(t) {
    const n = this.lookup.get(Ar(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(br(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Ar(t);
    r && this.lookup.set(r, n);
  }
}
function sm() {
  return new im(am);
}
function br(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Ar(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const lm = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", ta = `${c}-inline-roll-neutralized`, cm = `${c}-inline-roll-notice`, fn = `data-${c}-inline-roll-neutralized`, Tr = `data-${c}-inline-roll-notice`, um = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Rr(e) {
  const t = km(e.message), n = await dm(e.message), r = mm(t);
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
async function dm(e) {
  const t = Rm(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = fm(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await _m(t, n.content), replacementCount: n.replacementCount };
}
function mm(e) {
  const t = e ? Cm(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = na(t);
  return n > 0 && ra(bm(t)), { replacementCount: n };
}
function fm(e) {
  const t = pm(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = na(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (ra(n.content), { content: n.innerHTML, replacementCount: o });
}
function pm(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, hm(o.trim()))), replacementCount: t };
}
function na(e) {
  const t = gm(e);
  for (const n of t)
    n.replaceWith(ym(Am(n)));
  return t.length;
}
function gm(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(lm))
    n.getAttribute(fn) !== "true" && t.add(n);
  return Array.from(t);
}
function hm(e) {
  return `<span class="${ta}" ${fn}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${wm(e)}</span>`;
}
function ym(e) {
  const t = document.createElement("span");
  return t.classList.add(ta), t.setAttribute(fn, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function ra(e) {
  if (e.querySelector?.(`[${Tr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(cm), t.setAttribute(Tr, "true"), t.textContent = um, e.append(t);
}
function bm(e) {
  return e.querySelector(".message-content") ?? e;
}
function Am(e) {
  const n = e.getAttribute("data-formula") ?? Tm(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Tm(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Rm(e) {
  return e && typeof e == "object" ? e : null;
}
async function _m(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return d.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Cm(e) {
  const t = $m(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function km(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function wm(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function $m(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ke = "ritualRollConfig", se = "ritual-roll";
function at() {
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
function oa(e) {
  const t = e.getFlag(c, Ke);
  return qt(t);
}
function aa(e) {
  return oa(e) ?? at();
}
async function Im(e, t) {
  const n = qt(t) ?? qt({
    ...at(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(c, Ke, n), n;
}
async function Em(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, c, Ke));
    return;
  }
  await e.setFlag(c, Ke, null);
}
function qt(e) {
  if (!it(e)) return null;
  const t = Mm(e.intent);
  if (!t) return null;
  const n = at();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Ye(e.damageType),
    utilityLabel: Ye(e.utilityLabel) ?? n.utilityLabel,
    note: pn(e.note),
    forms: xm(e.forms)
  };
}
function Sm(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Dm(e) {
  const t = oa(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = Lm(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...Pm(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: vm(e, t),
    resistance: t.intent === "damage" ? Om(e) : void 0
  };
}
function Lm(e, t) {
  const n = {
    type: "rollFormula",
    id: se,
    formula: t,
    intent: Fm(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function Pm(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${se}.total`,
          ...Nm(e.damageType)
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
function Nm(e) {
  return e ? { damageType: e } : {};
}
function vm(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [se]: n
      }
    }
  };
  return _r(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [se]: t.forms.discente.formula.trim()
    }
  }), _r(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [se]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Om(e) {
  const t = ia(e), n = Ye(t.skillResis), r = Ye(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = Bm(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function Fm(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Mm(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function xm(e) {
  const t = at();
  return it(e) ? {
    base: _t(e.base),
    discente: _t(e.discente),
    verdadeiro: _t(e.verdadeiro)
  } : t.forms;
}
function _t(e) {
  return it(e) ? { formula: pn(e.formula) } : { formula: "" };
}
function _r(e, t) {
  const n = ia(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return Um(r);
}
function ia(e) {
  const t = e.system;
  return it(t) ? t : {};
}
function Bm(e) {
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
function Um(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function pn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Ye(e) {
  const t = pn(e);
  return t.length > 0 ? t : null;
}
function it(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const Cr = "occultism";
function qm(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function jm(e) {
  const t = qm(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await zm(e, Cr);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await zo(n);
  const r = Gm(n);
  return {
    skill: Cr,
    skillLabel: "Ocultismo",
    roll: n,
    formula: Hm(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: Wm(n)
  };
}
async function zm(e, t) {
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
  return Vm(r);
}
function Vm(e) {
  return kr(e) ? e : Array.isArray(e) ? e.find(kr) ?? null : null;
}
function kr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Hm(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Gm(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Wm(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Km);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Km(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function Ym(e) {
  switch (Qm(e)) {
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
      return Zm(String(e ?? ""));
  }
}
function Qm(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function Zm(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function Xm(e) {
  return {
    header: {
      eyebrow: Zt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: rf(e.ritual)
    },
    forms: e.variantOptions.map((t) => Jm(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: nf(e.automationStatus ?? "assisted")
  };
}
function Jm(e, t) {
  const n = ef(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? tf(t) : "—",
    details: n
  };
}
function ef(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function tf(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function nf(e) {
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
function rf(e) {
  const t = e.system, n = [af(t?.element), of(t?.circle)].filter(cf);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function of(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function af(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (sf(e)) {
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
      return lf(e);
  }
}
function sf(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function lf(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function cf(e) {
  return typeof e == "string" && e.length > 0;
}
const sa = ["base", "discente", "verdadeiro"];
function la(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Qe(e) {
  return typeof e == "string" && sa.includes(e);
}
const { ApplicationV2: uf } = foundry.applications.api;
class ke extends uf {
  constructor(t, n) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = Xm(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    mf(o, (a) => {
      this.selectedVariant = a;
    }), ff(o, (a) => {
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
          ${this.model.forms.map(df).join("")}
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
    const n = hf(t), r = pf(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function df(e) {
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
function mf(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => wr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), wr(e, o, t));
    });
  const r = ca(e);
  r && t(r);
}
function wr(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Qe(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), ca(e));
}
function ca(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && Qe(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function ff(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function pf(e, t, n) {
  const r = gf(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function gf(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Qe(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Qe(n) ? n : null;
}
function hf(e) {
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
async function yf(e) {
  return ke.request(e);
}
const gn = {
  label: "Padrão"
}, bf = {
  label: "Discente",
  extraCost: 2
}, Af = {
  label: "Verdadeiro",
  extraCost: 5
};
class Tf {
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
    const r = this.resolveCostPreview(t), o = up(n), a = sp(
      n,
      t.item,
      r,
      o
    ), i = await yf({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((k) => k.name),
      cost: r,
      defaultSpendResource: hp(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const s = Rf(i), u = mp(
      n,
      t.item,
      s.variant,
      o
    ), m = Ao();
    let f = null;
    if (m) {
      const k = await Cf(
        this.resources,
        t.actor,
        s,
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
        f = await jm(
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
    const A = _f(
      n,
      s,
      u,
      r,
      {
        includeCostSteps: !m
      }
    );
    if (A.steps.length === 0) {
      const k = dp(
        t,
        s
      ), U = $r(
        t.actor,
        f,
        u,
        r
      ), In = Ir(
        n,
        s,
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
        summaryLines: In
      } : {
        status: "completed-without-actions",
        workflowContext: k,
        summaryLines: In
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
          variant: s.variant,
          spendResource: s.spendResource
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
    const _ = R.value.context, g = Df(
      n,
      t,
      _
    ), N = wf(
      n,
      t
    ), he = $r(
      t.actor,
      f,
      u,
      r
    ), ye = Ir(
      n,
      s,
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
    return Ge(
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
function Rf(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function _f(e, t, n, r, o) {
  const a = [], i = t.spendResource === !0;
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || yn(s) && (!o.includeCostSteps || !i) || a.push(kf(s, n));
  return o.includeCostSteps && i && r && yp(n.extraCost) && a.push({
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
async function Cf(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Se(o, r);
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
function kf(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function $r(e, t, n, r) {
  if (!t || t.success) return [];
  const o = Se(r, n);
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
function wf(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = hn(r.actor, t);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const a of o) {
      const i = Yo(a);
      n.push(
        $f(
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
function $f(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? Sf(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: If(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Ef(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function If(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Ef(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Sf(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Df(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const i = He(a, n);
    if (!i.ok)
      return {
        ok: !1,
        reason: i.error.reason,
        message: i.error.message
      };
    const s = hn(a.actor, t);
    if (s.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of s) {
      if (Lf(a)) {
        Pf(
          o,
          u,
          Nf(a, n, i.value)
        );
        continue;
      }
      r.push(Of(a, u, i.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...vf(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function Lf(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Pf(e, t, n) {
  const r = Bf(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Nf(e, t, n) {
  const r = Uf(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function vf(e, t, n, r) {
  const o = Vf(e), a = o.length > 1 ? Wf() : void 0;
  return o.map((i) => {
    const s = r.map(
      (m, f) => {
        const A = Hf(m.amount, i);
        return {
          id: Ff(m, i, f),
          amount: A,
          damageType: m.damageType,
          sourceRollId: m.sourceRollId,
          ignoreResistance: m.step.ignoreResistance === !0
        };
      }
    ), u = s.reduce(
      (m, f) => m + f.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: s,
      label: Mf(u, i, o.length > 1),
      executedLabel: xf(
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
function Of(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = zf(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: qf(e, r, n),
    executedLabel: jf(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function Ff(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Mf(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function xf(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Bf(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Uf(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function qf(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function jf(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function zf(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Vf(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Hf(e, t) {
  const n = e * t.multiplier, r = Gf(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function Gf(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Wf() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function hn(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Ir(e, t, n, r, o, a, i = null) {
  return [
    `Forma: ${la(t.variant)}`,
    Zf(t, n, r),
    ...Qf(i),
    ...Object.values(o.rolls).flatMap(Xf),
    ...Kf(e, a),
    ...Jf(e.resistance),
    ...ap(n)
  ];
}
function Kf(e, t) {
  return Yf(e) ? hn("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Yf(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Qf(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Zf(e, t, n) {
  const r = Se(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Xf(e) {
  const n = [`${ip(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = ep(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${Ym(e.damageType)}`), n;
}
function Jf(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function ep(e) {
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
    const i = tp(a);
    i && (op(
      n,
      i.operator ?? r,
      i.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function tp(e) {
  const t = np(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : rp(e);
}
function np(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function rp(e) {
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
function op(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function ap(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function ip(e) {
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
function sp(e, t, n, r) {
  return sa.map((o) => {
    const a = ua(
      e,
      t,
      o,
      r
    ), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? la(o),
      enabled: i,
      details: a ? lp(a, n, r) : [],
      finalCostText: a ? cp(n, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function lp(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = Se(t, e);
  return r.push(
    a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"
  ), r;
}
function Se(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function cp(e, t) {
  const n = Se(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function up(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(yn);
}
function dp(e, t) {
  return Ko({
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
function mp(e, t, n, r) {
  return ua(e, t, n, r) ?? gn;
}
function ua(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? pp(t, n) ? fp(n) : null : n === "base" ? gn : null);
}
function fp(e) {
  switch (e) {
    case "base":
      return gn;
    case "discente":
      return bf;
    case "verdadeiro":
      return Af;
  }
}
function pp(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return gp(foundry.utils.getProperty(e, n));
}
function gp(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function hp(e) {
  return e.steps.some(yn);
}
function yn(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function yp(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function bp(e, t) {
  const n = await Ap(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: Rp(n),
    total: _p(n),
    diceBreakdown: Cp(n)
  };
}
function da(e) {
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
async function Ap(e, t) {
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
  return Tp(r);
}
function Tp(e) {
  return Er(e) ? e : Array.isArray(e) ? e.find(Er) ?? null : null;
}
function Er(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Rp(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function _p(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Cp(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(kp);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function kp(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const ma = "itemUsePrompts", fa = "chatCard", st = "data-paranormal-toolkit-prompt-id", lt = "data-paranormal-toolkit-pending-id", bn = "data-paranormal-toolkit-executed-label", jt = "data-paranormal-toolkit-choice-group", pa = "data-paranormal-toolkit-skipped-label", Sr = "data-paranormal-toolkit-action-section", Dr = "data-paranormal-toolkit-detail-key", Lr = "data-paranormal-toolkit-roll-card", An = "data-paranormal-toolkit-roll-detail-toggle", ga = "data-paranormal-toolkit-roll-detail-id", ha = "data-paranormal-toolkit-resistance-roll-button", ya = "data-paranormal-toolkit-resistance-skill", ba = "data-paranormal-toolkit-resistance-skill-label", Aa = "data-paranormal-toolkit-resistance-target-actor-id", Ta = "data-paranormal-toolkit-resistance-target-name", Ra = "data-paranormal-toolkit-resistance-roll-result", Pr = "data-paranormal-toolkit-system-card-replaced", wp = `[${lt}]`, $p = `[${An}]`, Ip = `[${ha}]`, zt = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, Ep = `${h}__actions`, Nr = `${h}__details`, _a = `${h}__summary`, Sp = `${h}__title`, Ca = `${h}__button--executed`, vr = `${h}__roll-card`;
let Or = !1, Vt = null;
const P = /* @__PURE__ */ new Map(), Dp = [0, 100, 500, 1500, 3e3], Lp = 3e4, Pp = [0, 100, 500, 1500, 3e3];
function Np(e) {
  if (Vt = e, Or) {
    Mr(e);
    return;
  }
  const t = (n, r) => {
    wa(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Or = !0, Mr(e);
}
async function Fr(e) {
  const t = ka(e);
  P.set(e.pendingId, t), await _n(t) || Oa(t), $a(e.pendingId);
}
async function vp(e) {
  const t = ka({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await _n(t) || Oa(t), $a(e.pendingId);
}
async function Ct(e, t) {
  const n = P.get(e);
  P.delete(e), n && await Ng(n, t);
}
function Tn(e) {
  const t = qa();
  for (const n of t) {
    const r = B(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Op(e, t) {
  const n = Tn(e);
  if (!n) return;
  const r = B(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await fe(n.message, r));
}
async function Fp(e, t, n) {
  if (!t) return;
  const r = Tn(e);
  if (!r) return;
  const o = B(r.message);
  let a = !1;
  for (const [i, s] of Object.entries(o))
    i !== e && s.choiceGroupId === t && (o[i] = {
      ...s,
      executedLabel: n ?? s.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await fe(r.message, o);
}
function ka(e) {
  const t = H(e.context.message), n = e.context.targets.find((i) => Kt(i)), r = n ? Kt(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: lg(e.context),
    executed: !1
  };
}
function wa(e, t, n) {
  Pg();
  const r = ut(t);
  if (!r) return;
  const o = Sg(e, r);
  o.length > 0 && Ze(r);
  for (const a of o)
    Ht(r, a);
  Sa(r, n), Gt(r), Wt(r);
}
function Mr(e) {
  for (const t of Pp)
    globalThis.setTimeout(() => {
      Mp(e);
    }, t);
}
function Mp(e) {
  for (const t of xp()) {
    const n = ct(t);
    Bp(n) && wa(n, t, e);
  }
}
function xp() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Bp(e) {
  return e ? Cn(e) ? !0 : Og(e).length > 0 : !1;
}
function $a(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? Dg(t.messageId) : null;
  if (n) {
    jr(n, t), Ze(n), Ht(n, t), xr(n), Gt(n), Wt(n);
    return;
  }
  if (t.messageId) {
    Qt(t);
    return;
  }
  const r = Lg(t);
  if (r) {
    jr(r, t), Ze(r), Ht(r, t), xr(r), Gt(r), Wt(r);
    return;
  }
  Qt(t);
}
function xr(e) {
  Vt && Sa(e, Vt);
}
function Ze(e) {
  const t = Up();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Ea(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Pr) === "true") return;
  const r = n.querySelector(`.${zt}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Pr, "true");
}
function Up() {
  try {
    return Xi() === "replace";
  } catch {
    return !1;
  }
}
function Ht(e, t) {
  if (Ze(e), e.querySelector(`[${st}="${pe(t.pendingId)}"]`)) return;
  const n = qp(e, t);
  zp(n, t), rg(n, og(t)).append(sg(t));
}
function qp(e, t) {
  const n = e.querySelector(`.${zt}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(zt, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(Sp), i.textContent = jp(t);
  const s = document.createElement("span");
  return s.classList.add(_a), s.textContent = t.summary, o.append(a, i, s), r.append(o), ug(e).append(r), r;
}
function jp(e) {
  const t = I(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function zp(e, t) {
  const n = t.summaryLines ?? [], r = Na(n, t);
  if (r) {
    Vp(e, r, t);
    return;
  }
  ag(e, n);
}
function Vp(e, t, n) {
  if (e.querySelector(`[${Lr}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(vr, `${vr}--${t.intent}`), r.setAttribute(Lr, "true"), t.castingCheck && Br(r, Gp(t.castingCheck), n.pendingId, "casting"), Hp(t) && Br(r, Wp(t), n.pendingId, "effect"), Xp(r, t), Jp(r, t, n), ng(r, t), e.append(r);
}
function Hp(e) {
  return e.intent !== "casting";
}
function Gp(e) {
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
function Wp(e) {
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
function Br(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${h}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-section-header`);
  const i = document.createElement("strong");
  if (i.textContent = t.title, a.append(i), t.statusLabel) {
    const s = document.createElement("span");
    s.classList.add(`${h}__workflow-section-status`), s.textContent = t.statusLabel, a.append(s);
  }
  if (o.append(a), t.description) {
    const s = document.createElement("span");
    s.classList.add(`${h}__workflow-section-description`), s.textContent = t.description, o.append(s);
  }
  Kp(o, t), tg(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Kp(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = Yp(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function Yp(e, t) {
  const n = Qp(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of Zp(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function Qp(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Zp(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ur(e, "highest") : n.includes("kl") ? Ur(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ur(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Xp(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Jg);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function Jp(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = eg(t, n);
  o.append(a), i && o.append(i);
  const s = document.createElement("span");
  s.classList.add(`${h}__resistance-description`), s.textContent = t.resistance, r.append(o, s), t.resistanceRollResult && r.append(Ia(t.resistanceRollResult)), e.append(r);
}
function eg(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(st, t.pendingId), n.setAttribute(ha, "true"), n.setAttribute(ya, e.resistanceSkill), n.setAttribute(ba, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Aa, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Ta, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Ra, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Ia(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = La(e), t;
}
function tg(e, t, n, r, o) {
  const a = t.filter((m) => m.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${n}-roll-details-${r}`, s = document.createElement("button");
  s.type = "button", s.classList.add(`${h}__roll-detail-toggle`), s.setAttribute(An, i), s.setAttribute("aria-expanded", "false"), s.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(ga, i), u.hidden = !0;
  for (const m of a) {
    const f = document.createElement("dt");
    f.textContent = m.label;
    const A = document.createElement("dd");
    A.textContent = m.value, u.append(f, A);
  }
  e.append(s, u);
}
function ng(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function rg(e, t) {
  const n = `[${Sr}="${pe(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Ep), o.setAttribute(Sr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function og(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = Na(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function ag(e, t) {
  if (t.length === 0) return;
  const n = ig(e);
  for (const r of t) {
    const o = eh(r);
    if (n.querySelector(`[${Dr}="${pe(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(Dr, o), n.append(a);
  }
}
function ig(e) {
  const t = e.querySelector(`.${Nr}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Nr), e.append(n), n;
}
function sg(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(st, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Ca), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(lt, e.pendingId), t.setAttribute(bn, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(jt, e.choiceGroupId), t.setAttribute(pa, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function lg(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = cg(e);
  return `${t} → ${n}`;
}
function cg(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function ug(e) {
  return Ea(e) ?? e;
}
function Ea(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Sa(e, t) {
  const n = ut(e);
  if (!n) return;
  const r = n.querySelectorAll(wp);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      kg(o, t);
    }));
}
function Gt(e) {
  const t = ut(e);
  if (!t) return;
  const n = t.querySelectorAll($p);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      dg(t, r);
    }));
}
function Wt(e) {
  const t = ut(e);
  if (!t) return;
  const n = t.querySelectorAll(Ip);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      mg(t, r);
    }));
}
function dg(e, t) {
  const n = t.getAttribute(An);
  if (!n) return;
  const r = e.querySelector(`[${ga}="${pe(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function mg(e, t) {
  const n = t.getAttribute(st), r = t.getAttribute(ya), o = t.getAttribute(ba) ?? (r ? da(r) : "Resistência");
  if (!n || !r) return;
  const a = gg(e, n), i = hg(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const s = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await bp(i, r);
    await Rg(u.roll);
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
    fg(t, m), pg(t, m), _g(n, m), await Cg(e, n, m);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1;
  }
}
function fg(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Ra, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function pg(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Ia(t);
  if (r) {
    r.textContent = La(t);
    return;
  }
  n.append(o);
}
function gg(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = ct(e);
  return B(r)[t] ?? null;
}
function hg(e, t) {
  const n = e?.resistanceTargetActor;
  if (F(n)) return n;
  const o = e?.context?.targets.map(Kt).find(F) ?? null;
  if (o) return o;
  const a = t.getAttribute(Aa) ?? e?.resistanceTargetActorId ?? null, i = a ? bg(a) : null;
  return i || Ag(
    t.getAttribute(Ta) ?? e?.resistanceTargetName ?? yg(t)
  );
}
function yg(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${_a}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function Kt(e) {
  const t = e.actor;
  if (F(t)) return t;
  const n = e.token, r = $e(n);
  if (r) return r;
  const o = e.document;
  return $e(o);
}
function $e(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (F(t)) return t;
  const n = e.document?.actor;
  return F(n) ? n : null;
}
function bg(e) {
  const n = game.actors?.get?.(e);
  return F(n) ? n : Da().map((a) => $e(a)).find((a) => a?.id === e) ?? null;
}
function Ag(e) {
  const t = le(e);
  if (!t) return null;
  const n = Da().filter((a) => le(Tg(a)) === t).map((a) => $e(a)).find(F) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => F(a) && le(a.name) === t);
  return F(o) ? o : null;
}
function Da() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Tg(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : $e(e)?.name ?? null;
}
function le(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function F(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function La(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Rg(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function _g(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function Cg(e, t, n) {
  const r = ct(e);
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
function ct(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return x(r?.get?.(n));
}
async function kg(e, t) {
  const n = e.getAttribute(lt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    Pa(e, e.getAttribute(bn) ?? "✓ Automação aplicada"), wg(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function Pa(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Ca), e.removeAttribute(lt), e.removeAttribute(bn);
}
function wg(e) {
  const t = e.getAttribute(jt);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${jt}="${pe(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(pa) ?? "✓ Outra opção escolhida";
    Pa(o, a);
  }
}
function Na(e, t) {
  const n = e.map(Rn).filter(Zg), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = I(e, "Forma"), a = I(e, "Custo"), i = I(e, "Dados") ?? I(e, `Dados (${r.label})`), s = I(e, "Tipo"), u = I(e, "Resistência"), m = I(e, "Resistência Perícia"), f = I(e, "Resistência Rótulo") ?? (m ? da(m) : null), A = va(e, "Observação"), R = e.filter((g) => Eg(g, r)), _ = $g(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: i,
    damageType: s,
    resistance: u,
    resistanceSkill: m,
    resistanceSkillLabel: f,
    notes: A,
    details: R,
    castingCheck: _,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function $g(e) {
  const t = e.map(Rn).find((a) => a?.intent === "casting") ?? null, n = I(e, "Conjuração DT"), r = I(e, "Conjuração Resultado");
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
function Rn(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: Ig(n)
  } : null;
}
function Ig(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function I(e, t) {
  return va(e, t)[0] ?? null;
}
function va(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Eg(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Rn(e) ? !1 : e.trim().length > 0;
}
function Sg(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    Yt(r, e, t) && n.set(r.pendingId, r);
  for (const r of vg(e))
    Yt(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Yt(e, t, n) {
  const r = H(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !qr(n, "itemId", e.itemId) ? !1 : !e.actorId || qr(n, "actorId", e.actorId);
}
function qr(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${th(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Dg(e) {
  const t = pe(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Lg(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Yt(e, null, t))
      return t;
  return null;
}
function Pg() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function jr(e, t) {
  const n = ct(e);
  if (!n) return !1;
  try {
    const r = B(n);
    return r[t.pendingId] = kn(t, H(n)), await fe(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function _n(e) {
  const t = xa(e);
  if (!t) return !1;
  try {
    const n = B(t);
    return n[e.pendingId] = kn(e, H(t)), await fe(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Oa(e) {
  for (const t of Dp)
    globalThis.setTimeout(() => {
      Qt(e);
    }, t);
}
async function Qt(e) {
  const t = xa(e);
  if (Cn(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await _n(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function Ng(e, t) {
  const n = Ma(e.context.message);
  if (n)
    try {
      const r = B(n), o = r[e.pendingId] ?? kn(e, H(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await fe(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function vg(e) {
  return Object.values(B(x(e))).filter(De);
}
function B(e) {
  if (!e) return {};
  const t = {}, n = Cn(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(Fa(e)))
    t[r] ??= o;
  return t;
}
function Og(e) {
  return Object.values(Fa(x(e))).filter(De);
}
function Fa(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, ma);
  if (!ue(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    De(o) && (n[r] = o);
  return n;
}
async function fe(e, t) {
  typeof e.setFlag == "function" && (await Mg(e, t), await Fg(e, t));
}
async function Fg(e, t) {
  await Promise.resolve(e.setFlag?.(c, ma, t));
}
function Cn(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, fa);
  return Yg(t) ? t : null;
}
async function Mg(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(De).sort((a, i) => a.createdAt - i.createdAt);
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
      actorName: xg(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(c, fa, o));
}
function xg(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function kn(e, t) {
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
function Ma(e) {
  const t = x(e);
  if (t?.setFlag)
    return t;
  const n = Bg(e);
  if (n?.setFlag)
    return n;
  const r = H(e);
  if (!r) return null;
  const o = game.messages;
  return x(o?.get?.(r));
}
function Bg(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(x).find((n) => typeof n?.setFlag == "function") ?? null;
}
function xa(e) {
  const t = Ma(e.context.message);
  if (t) return t;
  const n = e.messageId ? Ug(e.messageId) : null;
  if (n) return n;
  const r = qa().slice().reverse();
  return r.find((o) => qg(o, e)) ?? r.find((o) => jg(o, e)) ?? null;
}
function Ug(e) {
  const t = game.messages;
  return x(t?.get?.(e));
}
function qg(e, t) {
  const n = H(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Ba(e, t)) return !1;
  const o = Ua(e);
  return !t.actorId || !o || o === t.actorId;
}
function jg(e, t) {
  if (!Vg(e, t)) return !1;
  const n = Ua(e);
  return t.actorId && n === t.actorId ? !0 : Ba(e, t);
}
function Ba(e, t) {
  const n = le(zg(e));
  if (!n) return !1;
  const r = le(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = le(t.itemId);
  return !!(o && n.includes(o));
}
function zg(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Ua(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Vg(e, t) {
  const n = Hg(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Lp;
}
function Hg(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function x(e) {
  return e && typeof e == "object" ? e : null;
}
function De(e) {
  return ue(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && Q(e.resistanceTargetActorId) && Q(e.resistanceTargetName) && Qg(e.resistanceRollResult) && Gg(e.actionPayload) && kt(e.title) && kt(e.buttonLabel) && kt(e.executedLabel) && Q(e.choiceGroupId) && Q(e.skippedLabel) && Q(e.actionSectionId) && Q(e.actionSectionTitle) && Xg(e.summaryLines) : !1;
}
function Gg(e) {
  return e == null ? !0 : ue(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && Wg(e.resource) && Kg(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Wg(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Kg(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Yg(e) {
  return ue(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && ue(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(De) : !1;
}
function Qg(e) {
  return e == null ? !0 : ue(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Q(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Zg(e) {
  return e !== null;
}
function ue(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function S(e) {
  return e === null || typeof e == "string";
}
function kt(e) {
  return e === void 0 || typeof e == "string";
}
function Q(e) {
  return e == null || typeof e == "string";
}
function Xg(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Jg(e) {
  return typeof e == "string" && e.length > 0;
}
function qa() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(x).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(x).filter((r) => r !== null) : [];
}
function ut(e) {
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
function eh(e) {
  return e.trim().toLowerCase();
}
function th(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function pe(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const zr = 1e3;
class nh {
  constructor(t, n, r, o, a, i) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = i, this.ritualAssistant = new Tf(
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
      settings: vn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = vn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Xt(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && uh(t.item) && n.executionMode === "ask") {
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
    if (await Rr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: It(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await Ct(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Ct(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Tn(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = fh(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await Ge(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await Op(t), await Fp(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Np(
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
    if (await Rr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: It(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      dh(t.item)
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
      return o.ok ? (ch(n, o.value), await rh(o.value), {
        ok: !0,
        executedLabel: oh(o.value)
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
    const n = wt(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && wt(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== t.id && (this.pendingExecutions.delete(o), await Ct(
        o,
        Hr(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Et();
    await vp({
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
      const s = Et();
      a ??= s, this.pendingExecutions.set(s, {
        kind: "assisted-action",
        id: s,
        action: i,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Fr({
        pendingId: s,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: i.label,
        executedLabel: i.executedLabel,
        choiceGroupId: wt(i),
        skippedLabel: Hr(i),
        actionSectionId: i.actionSectionId,
        actionSectionTitle: i.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: i.actor,
        resistanceTargetActorId: i.actor.id ?? null,
        resistanceTargetName: i.actorName,
        actionPayload: mh(i)
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
    const r = Et();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Fr({
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
    const n = Date.now(), r = Gr(t);
    for (const [a, i] of this.recentExecutionKeys.entries())
      n - i > zr && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= zr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Gr(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = It(
      t,
      n,
      r,
      o
    );
  }
}
async function rh(e) {
  const t = lh();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: ah(e)
      });
    } catch (n) {
      d.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function oh(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function ah(e) {
  const t = e.instances.map((i) => {
    const s = i.blocked > 0 ? ` <span class="muted">(RD ${i.blocked})</span>` : "";
    return `<li><strong>${ze(i.label ?? "Dano")}</strong>: ${i.inputAmount} → ${i.finalDamage} PV${s}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = ih(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${ze(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${ze(e.actorName)}</strong></p>
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
function ih(e) {
  const t = sh(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${ze(o)}</li>`;
}
function sh(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = Vr(n?.value);
  return r === null ? null : {
    value: r,
    max: Vr(n?.max)
  };
}
function Vr(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function lh() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function ze(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function wt(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function Hr(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function ch(e, t) {
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
function uh(e) {
  return e.type === "ritual";
}
function dh(e) {
  return Dm(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function mh(e) {
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
function fh(e) {
  const t = e.actorUuid ? ph(e.actorUuid) : null;
  if (de(t)) return t;
  const n = e.actorId ? gh(e.actorId) : null;
  return n || hh(e.actorName);
}
function ph(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function gh(e) {
  const n = game.actors?.get?.(e);
  if (de(n)) return n;
  for (const r of ja()) {
    const o = wn(r);
    if (o?.id === e) return o;
  }
  return null;
}
function hh(e) {
  const t = $t(e);
  if (!t) return null;
  for (const o of ja()) {
    const a = yh(o);
    if ($t(a) === t) {
      const i = wn(o);
      if (i) return i;
    }
  }
  const r = game.actors?.find?.(
    (o) => de(o) && $t(o.name) === t
  );
  return de(r) ? r : null;
}
function ja() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function yh(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : wn(e)?.name ?? null;
}
function wn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (de(t)) return t;
  const n = e.document?.actor;
  return de(n) ? n : null;
}
function $t(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function de(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function It(e, t, n, r) {
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
function Gr(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Et() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class bh {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = Ee(t);
    for (const i of n) {
      const s = i.itemId ? a.find((f) => f.id === i.itemId) ?? null : null, u = i.match?.preset ?? null;
      if (!s || !u) {
        o.push(i);
        continue;
      }
      await this.automationBinder.applyPreset(s, u);
      const m = await this.itemPatches.applyPresetItemPatch(s, u);
      r.push({
        itemId: s.id ?? null,
        itemName: s.name ?? "Ritual sem nome",
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
class Ah {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Ee(t).map((s) => this.analyzeRitual(s)), r = n.filter(Be("upToDate")), o = n.filter(Be("available")), a = n.filter(Be("outdated")), i = n.filter(Be("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = Th(t);
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
      reason: Rh(r, n.preset)
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
    preset: e.match ? et(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function Th(e) {
  const t = e.getFlag(c, "automation");
  return Jt(t) ? t : null;
}
function Rh(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Be(e) {
  return (t) => t.status === e;
}
class _h {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = tn(t.transaction);
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
    const n = T(t.actorName), r = T(t.resource), o = T(Wr(t)), a = T(kh(t));
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
    const r = T(n.title ?? "Automação"), o = n.message ? `<p>${T(n.message)}</p>` : "", a = T(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), i = T(t.item.name ?? "Item sem nome"), s = t.targets.length > 0 ? t.targets.map((g) => T(g.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map(
      (g) => `<li><strong>${T(g.id)}:</strong> ${T(g.formula)} = ${g.total} <em>(${T(Ch(g.intent))})</em>${g.damageType ? ` — ${T(g.damageType)}` : ""}</li>`
    ), m = t.ritualCosts.map(
      (g) => `<li><strong>${T(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${T(g.resource)} (${T(wh(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${T(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${T(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (g) => `<li><strong>${T(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), R = t.resourceTransactions.map(
      (g) => `<li><strong>${T(g.actorName)}:</strong> ${T(Wr(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
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
          <p><strong>Alvo:</strong> ${s}</p>
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
function Ch(e) {
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
function Wr(e) {
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
function kh(e) {
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
function wh(e) {
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
function $h() {
  const e = new xc(), t = new Nu(e), n = new Nc(), r = new qc(), o = new Vc(r), a = new ou(e), i = new iu(), s = i.registerMany(
    Di()
  );
  if (!s.ok)
    throw new Error(s.error.message);
  const u = new au(), m = new nu(), f = sm(), A = new Xu(f), R = new Ah(
    i
  ), _ = new bh(
    R,
    u,
    m
  ), g = new Mu(), N = new _h(g), he = new Fu(), ye = new Lu(
    t,
    o,
    N,
    he
  ), be = new Ou(ye, he), k = new nh(
    be,
    t,
    o,
    n,
    A,
    g
  );
  return k.addStrategy(
    new eu(
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
const { ApplicationV2: Ih } = foundry.applications.api;
class Xe extends Ih {
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
      apply: Xe.onApply,
      cancel: Xe.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${v(Zt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${v(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${St("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${St("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${St("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function St(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${v(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Eh(n) : Dh(t)}
    </section>
  `;
}
function Eh(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Sh).join("")}</ol>`;
}
function Sh(e) {
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
function Dh(e) {
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
const Je = `${c}.manageRitualPresets`, Kr = `__${c}_ritualPresetHeaderControlRegistered`, Lh = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Ph(e) {
  const t = globalThis;
  if (!t[Kr]) {
    for (const n of Lh)
      Hooks.on(n, (r, o) => {
        Nh(r, o, e);
      });
    t[Kr] = !0, d.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Nh(e, t, n) {
  Array.isArray(t) && Oh(e) && (vh(e, n), !t.some((r) => r.action === Je) && t.push({
    action: Je,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), za(e, n);
    }
  }));
}
function vh(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Je] && (e.options.actions[Je] = (n) => {
    n.preventDefault(), n.stopPropagation(), za(e, t);
  }));
}
function Oh(e) {
  if (!game.user?.isGM) return !1;
  const t = Va(e);
  return t ? t.type === "agent" && Ee(t).length > 0 : !1;
}
function za(e, t) {
  const n = Va(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Xe(n, t).render({ force: !0 });
}
function Va(e) {
  return Yr(e.actor) ? e.actor : Yr(e.document) ? e.document : null;
}
function Yr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Ha = "data-paranormal-toolkit-ritual-roll-config", Le = "data-paranormal-toolkit-ritual-roll-field", ee = "data-paranormal-toolkit-ritual-roll-action", Qr = `__${c}_ritualRollConfigBlockRegistered`, Fh = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], Mh = [
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
function xh() {
  const e = globalThis;
  if (!e[Qr]) {
    Bh();
    for (const t of Fh)
      Hooks.on(t, (...n) => {
        Uh(n[0], n[1]);
      });
    e[Qr] = !0, d.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function Bh() {
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
function Uh(e, t) {
  const n = ey(e);
  if (!n || n.type !== "ritual") return;
  const r = ry(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  jh(o);
  const a = Wa(n), i = aa(n), s = ty(n), u = zh(n, i, a, s);
  Yh(u, n, a, s), qh(o, u), $n(u);
}
function qh(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function jh(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Ha}]`)))
    t.remove();
}
function zh(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${c}-ritual-roll-config`), o.setAttribute(Ha, e.uuid ?? e.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${c}-ritual-roll-config__header`);
  const i = document.createElement("div");
  i.classList.add(`${c}-ritual-roll-config__title`), i.append(Zr("strong", "Paranormal Toolkit")), i.append(Zr("span", "Fórmula de rolagem"));
  const s = document.createElement("span");
  s.classList.add(`${c}-ritual-roll-config__badge`), s.textContent = Ya(t) ? "Configurada" : "Rascunho", a.append(i, s), o.append(a);
  const u = document.createElement("p");
  u.classList.add(`${c}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const m = document.createElement("div");
  m.classList.add(`${c}-ritual-roll-config__fields`), m.append(Vh(t, r)), m.append(Hh(t, r)), m.append(Gh(t, r)), o.append(m), o.append(Wh(t, n, r)), o.append(Kh(r));
  const f = document.createElement("p");
  return f.classList.add(`${c}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function Vh(e, t) {
  const n = dt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Le, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = Sm(o), a.selected = e.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function Hh(e, t) {
  const n = dt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Le, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const a of Mh) {
    const i = document.createElement("option");
    i.value = a.value, i.textContent = a.label, i.selected = e.damageType === a.value, r.append(i);
  }
  return n.append(r), n;
}
function Gh(e, t) {
  const n = dt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Le, "utilityLabel"), n.append(r), n;
}
function Wh(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${c}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${c}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const a = document.createElement("div");
  return a.classList.add(`${c}-ritual-roll-config__forms-grid`), a.append(Dt("base", "Padrão", e.forms.base.formula, !0, n)), a.append(Dt("discente", "Discente", e.forms.discente.formula, t.discente, n)), a.append(Dt("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(a), r;
}
function Dt(e, t, n, r, o) {
  const a = dt(t);
  a.classList.add(`${c}-ritual-roll-config__form-card`), a.dataset.ritualRollForm = e;
  const i = document.createElement("input");
  if (i.type = "text", i.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", i.value = n, i.disabled = !o || !r, i.setAttribute(Le, `formula.${e}`), a.append(i), !r) {
    const s = document.createElement("small");
    s.textContent = "Indisponível neste ritual.", a.append(s);
  }
  return a;
}
function Kh(e) {
  const t = document.createElement("div");
  t.classList.add(`${c}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(ee, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(ee, "clear"), t.append(n, r), t;
}
function dt(e) {
  const t = document.createElement("label");
  t.classList.add(`${c}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Zr(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function Yh(e, t, n, r) {
  ge(e, "intent")?.addEventListener("change", () => $n(e)), eo(e, "system.studentForm")?.addEventListener("change", () => Xr(e, t)), eo(e, "system.trueForm")?.addEventListener("change", () => Xr(e, t)), e.querySelector(`[${ee}="save"]`)?.addEventListener("click", () => {
    r && Qh(e, t, n);
  }), e.querySelector(`[${ee}="clear"]`)?.addEventListener("click", () => {
    r && Zh(e, t);
  });
}
async function Qh(e, t, n) {
  const r = e.querySelector(`[${ee}="save"]`);
  r?.setAttribute("disabled", "true"), ce(e, "Salvando configuração...");
  try {
    const o = Xh(e, n);
    await Im(t, o), Ga(e, o), ce(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), ce(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function Zh(e, t) {
  const n = e.querySelector(`[${ee}="clear"]`);
  n?.setAttribute("disabled", "true"), ce(e, "Limpando configuração...");
  try {
    await Em(t);
    const r = aa(t);
    Jh(e, r), Ga(e, r), ce(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), ce(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Ga(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__badge`);
  n && (n.textContent = Ya(t) ? "Configurada" : "Rascunho");
}
function Xh(e, t) {
  return {
    schemaVersion: 1,
    intent: Ka(ge(e, "intent")?.value),
    damageType: to(e, "damageType"),
    utilityLabel: to(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Ve(e, "formula.base") },
      discente: { formula: Ve(e, "formula.discente") },
      verdadeiro: { formula: Ve(e, "formula.verdadeiro") }
    }
  };
}
function Jh(e, t) {
  re(e, "intent", t.intent), re(e, "damageType", t.damageType ?? ""), re(e, "utilityLabel", t.utilityLabel ?? "Resultado"), re(e, "formula.base", t.forms.base.formula), re(e, "formula.discente", t.forms.discente.formula), re(e, "formula.verdadeiro", t.forms.verdadeiro.formula), $n(e);
}
function $n(e) {
  const t = Ka(ge(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function Xr(e, t) {
  const n = Wa(t);
  Jr(e, "discente", n.discente), Jr(e, "verdadeiro", n.verdadeiro);
}
function Jr(e, t, n) {
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
      const s = document.createElement("small");
      s.textContent = "Indisponível neste ritual.", a.append(s);
    }
  }
}
function ce(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Wa(e) {
  const t = ny(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function ey(e) {
  return no(e.item) ? e.item : no(e.document) ? e.document : null;
}
function ty(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function ny(e) {
  const t = e.system;
  return oy(t) ? t : {};
}
function eo(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ge(e, t) {
  return e.querySelector(`[${Le}="${ay(t)}"]`);
}
function Ve(e, t) {
  return ge(e, t)?.value.trim() ?? "";
}
function to(e, t) {
  const n = Ve(e, t);
  return n.length > 0 ? n : null;
}
function re(e, t, n) {
  const r = ge(e, t);
  r && (r.value = n);
}
function Ka(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Ya(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function ry(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function no(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function oy(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function ay(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let X = null;
Hooks.once("init", () => {
  Ii(), Zi(), Ls(), gc(), d.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Mn.isSupportedSystem()) {
    d.warn(
      `Sistema não suportado: ${Mn.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  X = $h(), X.itemUseIntegration.registerStrategies(), Is(X.conditions), us(X), Rs(), ys(), Rc(), Ph(X), xh(), d.info("Inicializado para o sistema Ordem Paranormal."), d.info(
    `API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Zt} inicializado.`);
});
function iy() {
  if (!X)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return X;
}
export {
  iy as getToolkitServices
};
//# sourceMappingURL=main.js.map
