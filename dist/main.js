const c = "paranormal-toolkit", on = "Paranormal Toolkit", _i = "ordemparanormal";
class Pe {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function it(e) {
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
function an(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : sn(t) ? y(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Ti(e) {
  return sn(e.getFlag(c, "automation"));
}
function sn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && $i(t.source) && Ri(t.definition);
}
function Ri(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && $(t.label) && Array.isArray(t.steps) && t.steps.every(Ci) && (t.conditionApplications === void 0 || Di(t.conditionApplications));
}
function $i(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? $(t.presetId) && $(t.presetVersion) && $(t.appliedAt) : t.type === "manual" ? $(t.label) && $(t.appliedAt) : !1;
}
function Ci(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return wi(t);
    case "spendRitualCost":
      return ki(t);
    case "rollFormula":
      return Ei(t);
    case "modifyResource":
      return Ii(t);
    case "chatCard":
      return Si(t);
    default:
      return !1;
  }
}
function wi(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && ho(t);
}
function ki(e) {
  return e.type === "spendRitualCost";
}
function Ei(e) {
  const t = e;
  return t.type === "rollFormula" && $(t.id) && $(t.formula) && (t.intent === void 0 || Fi(t.intent)) && (t.damageType === void 0 || $(t.damageType));
}
function Ii(e) {
  const t = e;
  return t.type === "modifyResource" && yo(t.actor) && Ni(t.resource) && Oi(t.operation) && ho(t) && (t.damageType === void 0 || t.damageType === null || $(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Si(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Di(e) {
  return Array.isArray(e) && e.every(Li);
}
function Li(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return $(t.id) && yo(t.actor) && $(t.conditionId) && (t.label === void 0 || $(t.label)) && (t.duration === void 0 || t.duration === null || Pi(t.duration)) && (t.source === void 0 || $(t.source)) && (t.actionSectionId === void 0 || $(t.actionSectionId)) && (t.actionSectionTitle === void 0 || $(t.actionSectionTitle)) && (t.executedLabel === void 0 || $(t.executedLabel));
}
function Pi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || xi(t.rounds)) && (t.expiry === void 0 || t.expiry === null || vi(t.expiry));
}
function vi(e) {
  return e === "turnStart" || e === "turnEnd";
}
function ho(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || $(e.amountFrom);
}
function yo(e) {
  return e === "self" || e === "target";
}
function Ni(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Oi(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Fi(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function xi(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function $(e) {
  return typeof e == "string" && e.length > 0;
}
function ln(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(xn);
    if (Ui(t))
      return Array.from(t).filter(xn);
  }
  return [];
}
function Mi(e) {
  return ln(e)[0] ?? null;
}
function Bi(e) {
  return ln(e).find(Ti) ?? null;
}
function Ui(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function xn(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ve(e) {
  return ln(e).filter((t) => t.type === "ritual");
}
function bo(e) {
  return ve(e)[0] ?? null;
}
function qi(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(it);
      return d.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Re("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Me(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Un);
      return d.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Re("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Me(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await Bt(e, r, o.value);
      d.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Re("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Me(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        d.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await Bt(e, n, r.preset);
      d.info(`Melhor preset aplicado em ${n.name}.`, { match: Un(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Mn(e);
    },
    async applyBestPresetsToActorRituals() {
      return Mn(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Re("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Me(t);
      n && (await e.automationBinder.clear(n), d.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Mn(e) {
  const t = Re("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = ve(t);
  if (n.length === 0)
    return d.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Bn(t);
  const r = Bn(t, n.length);
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
    const i = await Bt(e, o, a.preset);
    r.applied.push(zi(o, a, i));
  }
  return d.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), ji(r), r;
}
async function Bt(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function zi(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: it(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Bn(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function ji(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Un(e) {
  return {
    preset: it(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Re(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Me(e) {
  const t = bo(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ee(e) {
  return e ? {
    id: e.id,
    source: {
      ...Vi(e.sourceActor),
      token: e.sourceToken
    },
    item: Hi(e.item),
    targets: e.targets.map(Gi),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: qn(e.rollRequests, Ao),
    rolls: qn(e.rolls, Wi),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(cn),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function cn(e) {
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
function Vi(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Hi(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Gi(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Ao(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Wi(e) {
  return {
    ...Ao(e),
    total: e.total
  };
}
function qn(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function Ki(e) {
  return {
    getSelected() {
      return Pe.getSelectedActor();
    },
    logResources() {
      const t = W(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      d.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && d.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await re(
        e,
        "Gasto de PE",
        W("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await re(
        e,
        "Gasto de PD",
        W("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await re(
        e,
        "Dano em PV",
        W("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await re(
        e,
        "Cura de PV",
        W("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await re(
        e,
        "Dano em SAN",
        W("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await re(
        e,
        "Recuperação de SAN",
        W("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function re(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    Yi(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (i) {
    d.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  d.info(`${t} realizado:`, cn(a));
}
function W(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Yi(e) {
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
function Qi() {
  Be(O.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Be(O.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Be(O.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Be(O.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Ut() {
  return {
    enabled: Ue(O.enabled),
    console: Ue(O.console),
    ui: Ue(O.ui),
    chat: Ue(O.chat)
  };
}
async function z(e, t) {
  await game.settings.set(c, O[e], t);
}
function Be(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Ue(e) {
  return game.settings.get(c, e) === !0;
}
function Zi() {
  return {
    status() {
      return Ut();
    },
    async enable() {
      await z("enabled", !0);
    },
    async disable() {
      await z("enabled", !1);
    },
    async enableConsole() {
      await z("console", !0);
    },
    async disableConsole() {
      await z("console", !1);
    },
    async enableUi() {
      await z("ui", !0);
    },
    async disableUi() {
      await z("ui", !1);
    },
    async enableChat() {
      await z("chat", !0);
    },
    async disableChat() {
      await z("chat", !1);
    }
  };
}
const _o = "ritual.costOnly", To = "ritual.simpleHealing", Xi = "ritual.eletrocussao", Ro = "ritual.simpleDamage", $o = "generic.simpleHealing", Co = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Ji() {
  return [
    es(),
    ts(),
    ns(),
    rs(),
    os()
  ];
}
function es() {
  return {
    id: _o,
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
function ts() {
  return {
    id: To,
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
    automation: wo(),
    itemPatch: is()
  };
}
function ns() {
  return {
    id: Xi,
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
    automation: as(),
    itemPatch: ss()
  };
}
function rs() {
  return {
    id: Ro,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: un()
  };
}
function os() {
  return {
    id: $o,
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
function wo(e = "2d8+2") {
  return ko(
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
function as() {
  return {
    ...un("3d6", {
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
function un(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return ko(
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
function is() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Co,
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
function ss() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Co,
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
function ko(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function dn() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ae(t.id),
    actorId: ae(t.actor?.id),
    sceneId: ae(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Eo() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: ae(e.id),
    actorId: ae(t?.id),
    sceneId: ae(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ae(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ls(e) {
  return {
    logFirstRitualCost() {
      const t = K("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = Y(t);
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
      const r = K("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = Y(r);
      if (o) {
        if (!ds(t, n)) {
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
      const t = K("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = Y(t);
      n && (await n.unsetFlag(c, "ritual.cost"), d.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = K("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = Y(t);
      if (!n) return;
      const r = e.automationRegistry.require(_o);
      if (!r.ok) {
        d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), d.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = K("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = Y(n);
      if (!r) return;
      if (!zn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(To);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: wo(t)
      }), d.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = K("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = Y(n);
      if (!r) return;
      if (!zn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Ro);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: un(t)
      }), d.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = K("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = Y(t);
      n && await cs(e, t, n);
    }
  };
}
async function cs(e, t, n) {
  const r = an(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Eo(),
    item: n,
    targets: dn()
  });
  if (!o.ok) {
    us(o.error);
    return;
  }
  d.info("Automação de ritual executada com sucesso.", ee(o.value.context));
}
function us(e) {
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
function K(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Y(e) {
  const t = bo(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ds(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function zn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const ms = ["disabled", "ask", "automatic"], fs = ["buttons", "confirm"], Io = "ask";
function ps(e) {
  return typeof e == "string" && ms.includes(e);
}
function gs(e) {
  return typeof e == "string" && fs.includes(e);
}
function hs(e) {
  return ps(e) ? e : gs(e) ? "ask" : Io;
}
const ys = ["keep", "replace"], bs = ["manual", "assisted"], So = "keep", Do = "assisted", As = !0, I = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function _s() {
  game.settings.register(c, I.executionMode, {
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
    default: Io
  }), game.settings.register(c, I.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: So
  }), game.settings.register(c, I.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: Do
  }), game.settings.register(c, I.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: As
  }), game.settings.register(c, I.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function jn() {
  const e = hs(game.settings.get(c, I.executionMode)), t = Po(game.settings.get(c, I.systemCardMode)), n = vo(game.settings.get(c, I.damageResolutionMode));
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: Lo()
  };
}
function Ts() {
  return Po(game.settings.get(c, I.systemCardMode));
}
function Rs() {
  return vo(game.settings.get(c, I.damageResolutionMode));
}
function Lo() {
  return game.settings.get(c, I.ritualCastingCheckEnabled) === !0;
}
async function Q(e) {
  await game.settings.set(c, I.executionMode, e);
}
function Po(e) {
  return ys.includes(e) ? e : So;
}
function vo(e) {
  return bs.includes(e) ? e : Do;
}
function $s(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await Q("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await Q("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await Q(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await Q("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await Q("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await Q("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await Q("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Cs = [
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
function ws(e) {
  return {
    phases() {
      return Cs;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = _t("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Bi(t);
      if (!n) {
        d.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Vn(e, t, n);
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
      if (!Is(n)) {
        d.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Es(n) ?? _t("Nenhum ator encontrado para executar automação do item.");
      r && await Vn(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = _t("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Mi(t);
      if (!n) {
        d.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require($o);
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
async function Vn(e, t, n) {
  const r = an(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Eo(),
    item: n,
    targets: dn()
  });
  if (!o.ok) {
    ks(o.error);
    return;
  }
  d.info("Automação executada com sucesso.", ee(o.value.context));
}
function ks(e) {
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
function _t(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Es(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Is(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ss(e) {
  const t = Ki(e), n = qi(e), r = ls(e), o = ws(e), a = Zi(), i = $s(e);
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
function Ds(e) {
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
      const r = Hn();
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
      return Ls(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Hn();
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
      return Ps(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Hn() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function Ls(e) {
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
function Ps(e) {
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
function vs(e) {
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
    conditions: Ds(e.conditions),
    debug: Ss(e)
  }, n = globalThis;
  return n[c] = t, n.ParanormalToolkit = t, t;
}
class Gn {
  static isSupportedSystem() {
    return game.system.id === _i;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Ns() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ie(t.id),
    actorId: ie(t.actor?.id),
    sceneId: ie(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function No() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: ie(e.id),
    actorId: ie(t?.id),
    sceneId: ie(e.scene?.id),
    name: n
  };
}
function Os(e, t = No()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Fs(e) {
  if (!Bs(e)) return null;
  const t = e.getFlag(c, "workflow");
  return Ms(t) ? t : null;
}
function xs() {
  return `flags.${c}.workflow`;
}
function Wn(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), n = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || n !== void 0;
}
function Kn(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return qt(t) || qt(n);
}
function Ms(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Bs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ie(e) {
  return qt(e) ? e : null;
}
function qt(e) {
  return typeof e == "string" && e.length > 0;
}
function Us() {
  const e = (t, n) => {
    qs(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function qs(e, t) {
  const n = Fs(e);
  if (!n || n.targets.length === 0) return;
  const r = js(t);
  if (!r || r.querySelector(`.${c}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(zs(n));
}
function zs(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Yn("Origem", e.source.name)), t.append(Yn("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Yn(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${c}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function js(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Vs() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!Hs(r) || !Gs(e) || Wn(e) || Wn(t)) return;
    const o = Ns();
    if (o.length === 0 || !Kn(e) && !Kn(t)) return;
    const a = No();
    e.updateSource({
      [xs()]: Os(o, a)
    }), d.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Hs(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Gs(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let Qn = !1, Tt = !1, Rt = !1, qe = null;
const Ws = 1e3, Ks = 750, Ys = 1e3;
function Qs(e) {
  Qn || (Hooks.on("combatTurnChange", (t) => {
    Xs(e, Zn(t));
  }), Hooks.on("deleteCombat", (t) => {
    Js(e, Zn(t));
  }), Qn = !0, Zs(e));
}
function Zs(e) {
  st() && (Tt || (Tt = !0, globalThis.setTimeout(() => {
    Tt = !1, mn(e, "ready");
  }, Ws)));
}
function Xs(e, t) {
  st() && t && (qe && globalThis.clearTimeout(qe), qe = globalThis.setTimeout(() => {
    qe = null, mn(e, "combat-turn-change", t);
  }, Ks));
}
function Js(e, t) {
  st() && t && (Rt || (Rt = !0, globalThis.setTimeout(() => {
    Rt = !1, mn(e, "combat-deleted", t);
  }, Ys)));
}
async function mn(e, t, n) {
  if (st())
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
function st() {
  return game.user?.isGM === !0;
}
function Zn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Oo = {
  enabled: "dice.animations.enabled"
};
function el() {
  game.settings.register(c, Oo.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function tl() {
  return {
    enabled: game.settings.get(c, Oo.enabled) === !0
  };
}
const Fo = "chatCard", Xn = "data-paranormal-toolkit-prompt-id", s = `${c}-item-use-prompt`, nl = `.${s}__title`, xo = `.${s}__header`, rl = `.${s}__roll-card`, ol = `.${s}__roll-meta`, al = `.${s}__roll-meta-pill`, fn = `.${s}__resistance`, il = `.${s}__resistance-header`, Mo = `.${s}__resistance-description`, pn = `.${s}__resistance-roll-button`, Bo = `.${s}__resistance-roll-result`, Jn = `${s}__resistance-content`, Uo = `.${s}__workflow-section`, qo = `.${s}__workflow-roll`, zo = `${s}__workflow-roll--dice-open`, jo = `.${s}__workflow-roll-formula`, Vo = `${s}__workflow-roll-formula--toggle`, gn = `.${s}__workflow-dice-tray`, sl = `.${s}__roll-detail-toggle`, ll = `.${s}__roll-detail-list`, cl = `.${s}__ritual-element-badge`, ul = `.${s}__ritual-metadata`, dl = "casting-backlash", ml = "data-paranormal-toolkit-action-section", fl = "data-paranormal-toolkit-prompt-id", pl = "data-paranormal-toolkit-pending-id", er = "data-paranormal-toolkit-casting-backlash-enhanced", tr = `.${s}`, gl = `.${s}__workflow-section--casting`, hl = `.${s}__workflow-section-header`, yl = `.${s}__workflow-notes`, bl = `[${ml}="${dl}"]`, nr = `${s}__workflow-section-title-row`, Al = `${s}__workflow-section-header--casting-backlash`, Ho = `${s}__casting-backlash-button`;
function _l(e) {
  for (const t of Tl(e))
    Rl(t), El(t);
}
function Tl(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(tr) && t.add(e);
  for (const n of e.querySelectorAll(tr))
    t.add(n);
  return Array.from(t);
}
function Rl(e) {
  const t = e.querySelector(bl);
  if (!t) return;
  const n = $l(t);
  if (!n) return;
  const r = e.querySelector(`${gl} ${hl}`);
  r && (r.classList.add(Al), Cl(r), wl(n), r.append(n), t.remove());
}
function $l(e) {
  return e.querySelector(
    `button[${pl}], button[${fl}]`
  );
}
function Cl(e) {
  const t = e.querySelector(`:scope > .${nr}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(nr);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(Ho) || n.append(o));
  return n;
}
function wl(e) {
  if (e.getAttribute(er) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = kl(t, e.disabled);
  e.classList.add(Ho), e.setAttribute(er, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function kl(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function El(e) {
  for (const t of e.querySelectorAll(yl)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Il(e) {
  for (const t of Array.from(e.querySelectorAll(Uo)))
    for (const n of Array.from(t.querySelectorAll(`${sl}, ${ll}`)))
      n.remove();
}
const Sl = "data-paranormal-toolkit-resistance-roll-result-enhanced", $e = "data-paranormal-toolkit-prompt-id", hn = `.${s}__actions`, Ne = `.${s}__actions-title`, yn = `.${s}__button`, Dl = `${s}__button--executed`, Ll = "data-paranormal-toolkit-executed-label", Pl = "data-paranormal-toolkit-action-section", vl = "data-paranormal-toolkit-damage-resolution-state", rr = "data-paranormal-toolkit-damage-icon-enhanced", Ie = "data-paranormal-toolkit-effect-icon-enhanced", de = "data-paranormal-toolkit-effect-action-compacted", lt = "data-paranormal-toolkit-effect-resistance-gate", Nl = `${s}__workflow-section--effect-action`, or = "data-paranormal-toolkit-resistance-damage-refresh-bound", Ol = `.${s}__workflow-section--effect`, Fl = [0, 80, 180, 400, 900, 1600], xl = "Conjuração DT", Ml = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function Bl(e) {
  for (const t of Array.from(e.querySelectorAll(fn)))
    Ul(t);
  Yl(e), Ql(e);
}
function Ul(e) {
  const t = e.querySelector(il), n = e.querySelector(Mo), r = e.querySelector(pn), o = e.querySelector(Bo);
  if (!r || !t && !n && !o) return;
  const a = ql(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && (o.parentElement !== e && !r.contains(o) && e.append(o), zl(o)), r.parentElement !== e && e.append(r);
}
function ql(e, t) {
  const n = e.querySelector(`.${Jn}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Jn), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function zl(e) {
  const t = jl(e.textContent ?? "");
  t && (e.setAttribute(Sl, "true"), e.replaceChildren(Gl(t)));
}
function jl(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, a = n?.trim() ?? "Resistência", i = Number(o);
  if (!Number.isFinite(i)) return null;
  const { formula: l, diceValues: u } = Vl(r ?? "");
  return l ? {
    skillLabel: a,
    formula: l,
    total: Math.trunc(i),
    diceValues: u
  } : null;
}
function Vl(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Hl(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Hl(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Gl(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${s}__workflow-roll`,
    `${s}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${s}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Wl(e);
  return r && t.append(r), t;
}
function Wl(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${s}__workflow-dice-tray`);
  for (const n of Kl(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${s}__workflow-die`), n.active || r.classList.add(`${s}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Kl(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ar(e, "highest") : n.includes("kl") ? ar(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ar(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Yl(e) {
  for (const t of Array.from(e.querySelectorAll(`.${s}__roll-card`)))
    Go(t);
}
function Go(e) {
  const t = uc(e);
  if (!t) return;
  const n = dc(e), r = e.querySelector(fn);
  if (r && r.parentElement !== t && t.append(r), n) {
    n.classList.add(`${s}__actions--embedded`, `${s}__actions--damage-resolution`);
    const a = n.querySelector(Ne);
    a && (a.textContent = "Aplicar dano"), n.parentElement !== t && t.append(n), fc(e), mc(e, n);
  }
  const o = Zl(e);
  o && (Wo(o), Xl(e, t, o), nc(e, o));
}
function Ql(e) {
  for (const t of Array.from(e.querySelectorAll(hn)))
    Wo(t);
}
function Wo(e) {
  const t = e.querySelector(Ne), n = x(t?.textContent);
  if (n !== "aplicar efeito" && n !== "efeito") return !1;
  e.classList.add(
    `${s}__actions--effect-resolution`,
    `${s}__workflow-section`,
    Nl
  ), t && (t.textContent = "Efeito");
  const r = e.querySelector(yn);
  if (!r) return !0;
  const o = r.textContent?.trim() ?? "";
  if (!o) return !0;
  const a = Ko(r, o);
  return a && Jl(e, t, a), Yo(r, o) ? (Zo(r), !0) : (tc(r, o) || Qo(r, a ?? o), !0);
}
function Zl(e) {
  return Array.from(e.parentElement?.querySelectorAll(hn) ?? []).find((n) => {
    const r = n.querySelector(Ne), o = x(r?.textContent);
    return o === "aplicar efeito" || o === "efeito";
  }) ?? null;
}
function Xl(e, t, n) {
  if (n.parentElement === e && n.previousElementSibling === t) return;
  const r = t.nextElementSibling;
  e.insertBefore(n, r);
}
function Jl(e, t, n) {
  if (e.querySelector(`.${s}__effect-resolution-label`)) return;
  const r = document.createElement("span");
  r.classList.add(`${s}__effect-resolution-label`), r.textContent = cc(n), t?.after(r);
}
function Ko(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && x(n) !== "efeito aplicado") return n;
  const r = ec(e);
  if (r) return r;
  const o = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && x(o) !== "aplicado" ? o : null;
}
function ec(e) {
  const t = e.getAttribute($e);
  if (!t) return null;
  const n = na(e), r = ra(n), i = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => ct(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof i == "string" && i.trim().length > 0 ? i.trim() : null;
}
function Yo(e, t) {
  return e.classList.contains(Dl) || x(t).includes("aplicado");
}
function tc(e, t) {
  const n = e.getAttribute(lt);
  if (n === "pending" || n === "resisted") return !0;
  const r = oa(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function Qo(e, t) {
  if (e.getAttribute(de) === "true" && e.getAttribute(Ie) === "true") return;
  const n = document.createElement("span");
  n.classList.add(`${s}__button-icon`, `${s}__button-icon--effect`), n.setAttribute("aria-hidden", "true"), n.textContent = "✦";
  const r = document.createElement("span");
  r.classList.add(`${s}__button-label`), r.textContent = "Aplicar", e.classList.add(`${s}__button--effect-resolution-action`), e.setAttribute(de, "true"), e.setAttribute(Ie, "true"), e.setAttribute(Ll, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(n, r);
}
function Zo(e) {
  if (e.getAttribute(de) === "true" && x(e.textContent) === "✓ aplicado") return;
  const t = document.createElement("span");
  t.classList.add(`${s}__button-icon`, `${s}__button-icon--effect-applied`), t.setAttribute("aria-hidden", "true"), t.textContent = "✓";
  const n = document.createElement("span");
  n.classList.add(`${s}__button-label`), n.textContent = "Aplicado", e.classList.add(`${s}__button--effect-resolution-action`, `${s}__button--effect-resolution-applied`), e.setAttribute(de, "true"), e.setAttribute(Ie, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(t, n);
}
function nc(e, t) {
  const n = t.querySelector(yn);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (Yo(n, r)) {
    Zo(n);
    return;
  }
  const o = rc(t, n, r);
  if (!oc(e, o)) {
    Xo(n);
    return;
  }
  const a = ta(e), i = ea(e);
  if (a === null || i === null) {
    ac(n);
    return;
  }
  if (i >= a) {
    ic(n);
    return;
  }
  sc(n, o);
}
function rc(e, t, n) {
  const r = e.querySelector(`.${s}__effect-resolution-label`)?.textContent?.trim();
  return r || (Ko(t, n) ?? n);
}
function oc(e, t) {
  if (!e.querySelector(fn)) return !1;
  const n = oa(t);
  return n.includes("vulneravel") || n.includes("vulnerable");
}
function ac(e) {
  e.disabled = !0, e.removeAttribute(de), e.removeAttribute(Ie), e.classList.remove(
    `${s}__button--effect-resolution-applied`,
    `${s}__button--effect-resolution-resisted`
  ), e.classList.add(`${s}__button--effect-resolution-waiting`), e.setAttribute(lt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Jo("Role resistência"));
}
function ic(e) {
  e.disabled = !0, e.removeAttribute(de), e.removeAttribute(Ie), e.classList.remove(
    `${s}__button--effect-resolution-applied`,
    `${s}__button--effect-resolution-waiting`
  ), e.classList.add(`${s}__button--effect-resolution-resisted`), e.setAttribute(lt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    lc("✓", `${s}__button-icon--effect-resisted`),
    Jo("Resistiu")
  );
}
function sc(e, t) {
  Xo(e), e.disabled = !1, Qo(e, t);
}
function Xo(e) {
  e.classList.remove(
    `${s}__button--effect-resolution-waiting`,
    `${s}__button--effect-resolution-resisted`
  ), e.removeAttribute(lt);
}
function lc(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${s}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Jo(e) {
  const t = document.createElement("span");
  return t.classList.add(`${s}__button-label`), t.textContent = e, t;
}
function cc(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
function uc(e) {
  return Array.from(e.querySelectorAll(Ol)).find((t) => {
    const n = t.querySelector(`.${s}__workflow-section-header strong`)?.textContent?.trim();
    return x(n) === "dano";
  }) ?? null;
}
function dc(e) {
  const t = Array.from(e.parentElement?.querySelectorAll(hn) ?? []);
  return t.find((n) => n.getAttribute(Pl) === "apply-damage") ?? t.find((n) => x(n.querySelector(Ne)?.textContent) === "aplicar danos") ?? null;
}
function mc(e, t) {
  const n = Array.from(t.querySelectorAll(yn)), r = ir(n, "normal"), o = ir(n, "half");
  if (!r || !o) {
    t.classList.add(`${s}__actions--compact`);
    return;
  }
  sr(r, "normal"), sr(o, "half");
  const a = Tc();
  if (t.classList.toggle(`${s}__actions--assisted`, a === "assisted"), t.classList.toggle(`${s}__actions--manual`, a !== "assisted"), a !== "assisted") {
    j(r, !0), j(o, !0), ze(t, "manual", null);
    return;
  }
  const i = ea(e), l = ta(e);
  if (l === null) {
    j(r, !0), j(o, !0), ze(t, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (i === null) {
    j(r, !0), j(o, !1), ze(t, "pending", null);
    return;
  }
  const u = i >= l;
  j(r, !u), j(o, u), ze(
    t,
    u ? "resisted" : "failed",
    u ? `Resistiu: ${i} vs DT ${l}.` : `Falhou: ${i} vs DT ${l}.`
  );
}
function ir(e, t) {
  const n = Ml[t];
  return e.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function sr(e, t) {
  if (e.getAttribute(rr) === "true") return;
  const n = e.textContent?.trim() ?? "";
  if (!n || n.startsWith("✓")) return;
  const r = document.createElement("i");
  r.classList.add(
    "fa-solid",
    t === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${s}__button-icon`
  ), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  o.classList.add(`${s}__button-label`), o.textContent = n, e.classList.add(
    `${s}__button--damage-resolution-action`,
    `${s}__button--damage-resolution-${t}`
  ), e.setAttribute(rr, "true"), e.setAttribute("aria-label", n), e.replaceChildren(r, o);
}
function j(e, t) {
  e.hidden = !t, e.classList.toggle(`${s}__button--damage-resolution-selected`, t);
}
function ze(e, t, n) {
  e.setAttribute(vl, t);
  const r = e.querySelector(`.${s}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${s}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(Ne)?.after(o);
}
function fc(e) {
  const t = e.querySelector(pn);
  t && t.getAttribute(or) !== "true" && (t.setAttribute(or, "true"), t.addEventListener("click", () => {
    for (const n of Fl)
      globalThis.setTimeout(() => {
        Go(e);
      }, n);
  }));
}
function ea(e) {
  const t = e.querySelector(pn)?.getAttribute("data-paranormal-toolkit-resistance-roll-result"), n = Se(t);
  if (n !== null) return n;
  const r = e.querySelector(Bo)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Se(o?.[1] ?? null);
}
function ta(e) {
  const t = yc(e), n = pc(t);
  if (n !== null) return n;
  const r = gc(t);
  return r !== null ? r : hc(e);
}
function pc(e) {
  const t = Ac(e);
  return t.length === 0 ? null : Se(_c(t, xl));
}
function gc(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : lr(r, ["system", "ritual", "DT"]) ?? lr(r, ["system", "ritual", "dt"]);
}
function hc(e) {
  const t = Array.from(e.querySelectorAll(`.${s}__workflow-section--casting .${s}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Se(n?.[1] ?? null);
}
function yc(e) {
  const t = bc(e);
  if (!t) return null;
  const n = na(e), r = ra(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => ct(a) ? a.pendingId === t : !1) ?? null;
}
function bc(e) {
  return (e.closest(`[${$e}]`) ?? e.querySelector(`[${$e}]`) ?? e.parentElement?.querySelector(`[${$e}]`) ?? null)?.getAttribute($e) ?? null;
}
function na(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return Rc(o) ? o : null;
}
function ra(e) {
  const t = e?.getFlag?.(c, Fo);
  return ct(t) ? t : null;
}
function Ac(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function _c(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function lr(e, t) {
  let n = e;
  for (const r of t) {
    if (!ct(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Se(typeof n == "string" ? n : null);
}
function Se(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Tc() {
  try {
    return Rs();
  } catch {
    return "assisted";
  }
}
function x(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function oa(e) {
  return x(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Rc(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function ct(e) {
  return !!(e && typeof e == "object");
}
function cr(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function bn() {
  const e = globalThis.game;
  return ut(e) ? e : null;
}
function D(e, t) {
  const n = $c(e, t);
  return Ge(n);
}
function $c(e, t) {
  return t.split(".").reduce((n, r) => ut(n) ? n[r] : null, e);
}
function Cc(e, t) {
  const n = e.indexOf(":");
  return n < 0 || De(e.slice(0, n)) !== De(t) ? null : pe(e.slice(n + 1));
}
function Ge(e) {
  return typeof e == "string" ? pe(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function ut(e) {
  return !!e && typeof e == "object";
}
function wc(e) {
  return typeof e == "string";
}
function dt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function pe(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function De(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function zt(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function H(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function aa(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function kc(e) {
  for (const t of Array.from(e.querySelectorAll(rl))) {
    const n = vc(t);
    Ec(t), n && (Ic(t, n), Sc(t, n));
  }
}
function Ec(e) {
  for (const t of Array.from(e.querySelectorAll(ol)))
    t.remove();
}
function Ic(e, t) {
  const r = e.closest(`.${s}`)?.querySelector(xo) ?? null, o = r?.querySelector(nl) ?? null, a = r ?? e, i = a.querySelector(cl);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const l = i ?? document.createElement("span");
  if (l.className = Qc(t.elementTone), l.textContent = Yc(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", l);
      return;
    }
    a.prepend(l);
  }
}
function Sc(e, t) {
  const n = Dc(e);
  Lc(e, n);
  const r = Pc(t);
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
  const a = e.querySelector(Uo);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function Dc(e) {
  return e.closest(`.${s}`)?.querySelector(xo) ?? null;
}
function Lc(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(ul)))
      o.remove();
}
function Pc(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${zt(e.target)}` : null,
    e.duration ? `Duração: ${zt(e.duration)}` : null,
    e.resistance ? `Resistência: ${aa(e.resistance)}` : null
  ].filter(dt);
}
function vc(e) {
  const t = Nc(e), n = Uc(e), o = (t ? Bc(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = An(D(o, "element")), l = M("op.elementChoices", i) ?? ur(X(a, "Elemento")) ?? ur(n.damageType), u = i ?? Zc(l), m = D(o, "circle") ?? X(a, "Círculo"), f = jc(o) ?? X(a, "Alvo"), A = Wc(o, "duration", "op.durationChoices") ?? X(a, "Duração"), T = qc(e) ?? Hc(o) ?? X(a, "Resistência"), R = zc(a) ?? n.cost, g = {
    elementLabel: l,
    elementTone: u,
    circle: m,
    cost: R,
    target: f,
    duration: A,
    resistance: T
  };
  return Kc(g) ? g : null;
}
function Nc(e) {
  const t = Oc(e);
  if (!t) return null;
  const n = t.getFlag?.(c, Fo), r = xc(n);
  if (r.length === 0) return null;
  const o = Fc(e);
  if (o.size > 0) {
    const a = r.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function Oc(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? bn()?.messages?.get?.(n) ?? null : null;
}
function Fc(e) {
  const t = e.closest(`.${s}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${Xn}]`))) {
    const o = r.getAttribute(Xn)?.trim();
    o && n.add(o);
  }
  return n;
}
function xc(e) {
  if (!ut(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Mc).filter((n) => n !== null) : [];
}
function Mc(e) {
  return ut(e) ? {
    pendingId: Ge(e.pendingId),
    actorId: Ge(e.actorId),
    itemId: Ge(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(wc) : []
  } : null;
}
function Bc(e) {
  if (!e.itemId) return null;
  const t = bn(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Uc(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(al))) {
    const o = pe(r.textContent);
    if (!o) continue;
    const a = Cc(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function qc(e) {
  const t = pe(e.querySelector(Mo)?.textContent);
  return t ? aa(t) : null;
}
function X(e, t) {
  const n = De(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || De(r.slice(0, o)) !== n))
      return pe(r.slice(o + 1));
  }
  return null;
}
function zc(e) {
  const t = X(e, "Custo") ?? X(e, "PE");
  return t || (e.map(pe).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function jc(e) {
  const t = D(e, "target");
  if (!t) return null;
  if (t === "area")
    return Vc(e) ?? M("op.targetChoices", t) ?? "Área";
  const n = M("op.targetChoices", t) ?? H(t);
  return [t === "people" || t === "creatures" ? D(e, "targetQtd") : null, n].filter(dt).join(" ");
}
function Vc(e) {
  const t = D(e, "area.name"), n = D(e, "area.size"), r = D(e, "area.type"), o = t ? M("op.areaChoices", t) ?? H(t) : null, a = r ? M("op.areaTypeChoices", r) ?? H(r) : null;
  return o ? n ? a ? `${o} ${n}m ${zt(a)}` : `${o} ${n}m` : o : null;
}
function Hc(e) {
  const t = D(e, "skillResis"), n = D(e, "resistance");
  if (!t || !n) return null;
  const r = M("op.skill", t) ?? H(t), o = Gc(n);
  return [r, o].filter(dt).join(" ");
}
function Gc(e) {
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
      return M("op.resistanceChoices", e) ?? H(e);
  }
}
function Wc(e, t, n) {
  const r = D(e, t);
  return r ? M(n, r) ?? H(r) : null;
}
function Kc(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Yc(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Qc(e) {
  return [
    `${s}__ritual-element-badge`,
    e ? `${s}__ritual-element-badge--${e}` : null
  ].filter(dt).join(" ");
}
function An(e) {
  const t = De(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function ur(e) {
  const t = An(e);
  return t ? M("op.elementChoices", t) ?? H(t) : e ? H(e) : null;
}
function Zc(e) {
  return An(e);
}
function M(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = bn()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const dr = "data-paranormal-toolkit-dice-toggle-enhanced";
function Xc(e) {
  for (const t of Array.from(e.querySelectorAll(qo)))
    ia(t);
}
function Jc(e) {
  const t = la(e.target);
  if (!t) return;
  const n = _n(t);
  n && (e.preventDefault(), sa(n, t));
}
function eu(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = la(e.target);
  if (!t) return;
  const n = _n(t);
  n && (e.preventDefault(), sa(n, t));
}
function ia(e) {
  const t = e.querySelector(gn);
  if (!t) return;
  const n = e.querySelector(jo);
  if (n && n.getAttribute(dr) !== "true" && (n.setAttribute(dr, "true"), n.classList.add(Vo), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function sa(e, t) {
  const n = e.querySelector(gn);
  if (!n) return;
  const r = !e.classList.contains(zo);
  tu(e, t, n, r);
}
function tu(e, t, n, r) {
  e.classList.toggle(zo, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function la(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(jo);
  if (!t) return null;
  const n = _n(t);
  return n ? (ia(n), t.classList.contains(Vo) ? t : null) : null;
}
function _n(e) {
  const t = e.closest(qo);
  return t && t.querySelector(gn) ? t : null;
}
const mr = `${c}-workflow-dice-toggle-styles`;
function nu() {
  if (document.getElementById(mr)) return;
  const e = document.createElement("style");
  e.id = mr, e.textContent = `
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
  grid-template-areas:
    "content button"
    "result result";
  align-items: start !important;
  column-gap: 0.62rem;
  row-gap: 0.36rem;
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
  align-self: start;
}

.${s}__resistance > .${s}__resistance-roll-result,
.${s}__resistance-content .${s}__resistance-roll-result {
  grid-area: result;
  display: block;
  min-width: 0;
  width: 100%;
  margin-top: 0;
}

.${s}__resistance-workflow-roll {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 0.34rem;
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
  gap: 0.34rem !important;
  white-space: normal !important;
  aspect-ratio: auto !important;
}

.${s}__actions--damage-resolution .${s}__button-icon {
  flex: 0 0 auto;
  font-size: 0.78rem;
  line-height: 1;
  opacity: 0.88;
}

.${s}__actions--damage-resolution .${s}__button-label {
  min-width: 0;
  overflow-wrap: anywhere;
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

/* 0.21.4 — Card compacto de efeito e botão com brilho */
.${s}__actions--effect-resolution {
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${s}__actions--effect-resolution .${s}__button {
  gap: 0.34rem !important;
  border-color: rgba(123, 72, 73, 0.42) !important;
  background: rgba(228, 214, 209, 0.74) !important;
  color: rgba(42, 30, 27, 0.94) !important;
}

.${s}__actions--effect-resolution .${s}__button:hover,
.${s}__actions--effect-resolution .${s}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${s}__button-icon--effect {
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
  transform: translateY(-0.02rem);
}

.${s}__button--effect-resolution-action .${s}__button-label {
  line-height: 1;
}

/* 0.21.5 — Efeito dentro do card principal e estado aplicado compacto */
/* 0.21.6 — Aproxima o Efeito do bloco de Dano para manter o ritmo visual do card */
/* 0.21.7 — Normaliza Efeito como seção irmã de Dano, sem margem herdada de actions */
.${s}__roll-card > .${s}__actions--effect-resolution {
  margin: 0 !important;
}

.${s}__roll-card > .${s}__workflow-section--effect + .${s}__actions--effect-resolution {
  margin-top: 0 !important;
}

.${s}__actions--effect-resolution.${s}__workflow-section {
  align-items: center !important;
}

.${s}__actions--effect-resolution .${s}__button--executed,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${s}__button-icon--effect-applied {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.8 — Efeito condicionado ao resultado da resistência */
.${s}__actions--effect-resolution .${s}__button--effect-resolution-waiting,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted {
  color: rgba(34, 93, 55, 0.84) !important;
}

.${s}__button-icon--effect-resisted {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.9 — Estados bloqueados de efeito não devem parecer clicáveis */
.${s}__actions--effect-resolution .${s}__button--effect-resolution-waiting:hover,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-waiting:focus,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted:hover,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted:focus,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-waiting:disabled,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted:disabled {
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  cursor: default !important;
}

.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted:hover,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted:focus,
.${s}__actions--effect-resolution .${s}__button--effect-resolution-resisted:disabled {
  color: rgba(34, 93, 55, 0.84) !important;
}

`, document.head.append(e);
}
const ru = [0, 100, 500, 1500, 3e3];
let fr = !1, $t = null;
function ou() {
  if (!fr) {
    fr = !0, nu(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Ce(cr(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Ce(cr(t));
    }), Hooks.once("ready", () => {
      Ce(document), au();
    }), document.addEventListener("click", Jc), document.addEventListener("keydown", eu);
    for (const e of ru)
      globalThis.setTimeout(() => Ce(document), e);
  }
}
function au() {
  $t || !document.body || ($t = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Ce(n);
  }), $t.observe(document.body, { childList: !0, subtree: !0 }));
}
function Ce(e) {
  e && (Il(e), kc(e), Bl(e), Xc(e), _l(e));
}
function iu() {
  ou();
}
const su = "data-paranormal-toolkit-action-section", lu = "ritual-log", cu = ".paranormal-toolkit-item-use-prompt__actions", uu = ".paranormal-toolkit-item-use-prompt__actions-title", du = [0, 100, 500, 1500];
let pr = !1;
function mu() {
  if (pr) return;
  const e = (t, n) => {
    gr(hu(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), gr(document), pr = !0;
}
function gr(e) {
  for (const t of du)
    globalThis.setTimeout(() => fu(e), t);
}
function fu(e) {
  pu(e), gu(e);
}
function pu(e) {
  for (const t of e.querySelectorAll(
    `[${su}="${lu}"]`
  ))
    t.remove();
}
function gu(e) {
  for (const t of e.querySelectorAll(cu)) {
    if (hr(t.querySelector(uu)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (a) => hr(a.textContent ?? "")
    ).some((a) => a.includes("ritual conjurado")) && t.remove();
  }
}
function hu(e) {
  if (e instanceof HTMLElement || yu(e))
    return e;
  if (bu(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function yu(e) {
  return e instanceof HTMLElement;
}
function bu(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function hr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Au = {
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
}, _u = new Set(
  Object.values(Au)
), Tu = {
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
function Ru(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = $u(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Tu[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : _u.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function ca(e) {
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
function $u(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Cu {
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
      const A = wu(f, m);
      if (!A.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const T = Ru(f.damageType);
      if (!T.ok)
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
          ku(A.id, f, T.value)
        );
        continue;
      }
      try {
        const R = await Promise.resolve(
          a.call(n, A.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: f.ignoreResistance === !0,
            nonLethal: f.nonLethal === !0
          })
        );
        for (const v of Iu(R.conditions))
          l.add(v);
        const g = Eu(R.newPV);
        g !== null && (u = g), i.push({
          id: A.id,
          label: f.label ?? ca(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: A.amount,
          finalDamage: yr(R.finalDamage, A.amount),
          blocked: yr(R.blocked, 0),
          damageType: f.damageType ? String(f.damageType) : null,
          systemDamageType: T.value,
          ignoreResistance: f.ignoreResistance === !0,
          nonLethal: f.nonLethal === !0
        });
      } catch (R) {
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: f,
          cause: R
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
function wu(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function ku(e, t, n) {
  return {
    id: e,
    label: t.label ?? ca(n),
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
function yr(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Eu(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Iu(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const we = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, ua = {
  PV: "system.attributes.hp"
}, jt = {
  PV: [we.PV, ua.PV],
  SAN: [we.SAN],
  PE: [we.PE],
  PD: [we.PD]
}, Vt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Su {
  getResource(t, n) {
    const r = br(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, i = `${o}.max`, l = foundry.utils.getProperty(t, a), u = foundry.utils.getProperty(t, i), m = _r(t, n, a, l, "valor atual");
    if (m) return p(m);
    const f = _r(t, n, i, u, "valor máximo");
    return f ? p(f) : y({
      value: l,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = br(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function br(e, t) {
  const n = Du(e.type, t);
  if (n && Ar(e, n))
    return y(n);
  const r = jt[t].find(
    (o) => Ar(e, o)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Lu(e, t),
    path: jt[t].join(" | ")
  });
}
function Du(e, t) {
  return e === "threat" ? ua[t] ?? null : e === "agent" ? we[t] : null;
}
function Ar(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Lu(e, t) {
  const n = e.type ?? "unknown", r = jt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function _r(e, t, n, r, o) {
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
class Pu {
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
      const i = Vt.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: r, value: o } = n, a = vu(o);
    return a ? y(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Vt.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function vu(e) {
  if (Tr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Tr(n))
      return n;
  }
  return null;
}
function Tr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Nu = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Ou {
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
    const r = n.value, o = Fu(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: Nu[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Fu(e, t) {
  const n = e.getFlag(c, "ritual.cost");
  return n == null ? { ok: !0, value: null } : xu(n) ? {
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
function xu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Ct = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Mu(e) {
  if (!Vu(e.item)) return null;
  const t = Ht(e.actor) ? e.actor : Bu(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: qu(e.token) ?? Uu(t),
    targets: dn(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Bu(e) {
  const t = e;
  return Ht(t.actor) ? t.actor : Ht(e.parent) ? e.parent : null;
}
function Uu(e) {
  const t = zu(e) ?? ju(e);
  return t ? da(t) : null;
}
function qu(e) {
  return Gt(e) ? da(e) : null;
}
function zu(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Gt(n) ? n : (t.getActiveTokens?.() ?? []).find(Gt) ?? null;
}
function ju(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function da(e) {
  const t = e.actor ?? null;
  return {
    tokenId: wt(e.id),
    actorId: wt(t?.id),
    sceneId: wt(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Vu(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ht(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Gt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function wt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Hu {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Ct.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, d.info(`${Ct.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Mu(Gu(t));
    if (!n) {
      d.warn(`${Ct.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Gu(e) {
  return e && typeof e == "object" ? e : {};
}
class Wu {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return kt("missing-item-patch");
    if (t.type !== "ritual") return kt("unsupported-item-type");
    const o = Ku(r);
    return Object.keys(o).length === 0 ? kt("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Ku(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (w(t, "system.circle", n.circle), w(t, "system.element", n.element), w(t, "system.target", n.target), w(t, "system.targetQtd", n.targetQuantity), w(t, "system.execution", n.execution), w(t, "system.range", n.range), w(t, "system.duration", n.duration), w(t, "system.skillResis", n.resistanceSkill), w(t, "system.resistance", n.resistance), w(t, "system.studentForm", n.studentForm), w(t, "system.trueForm", n.trueForm)), t;
}
function w(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function kt(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Yu {
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
    return this.getNumber(t, Vt.ritual.dt, 0);
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
class Qu {
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
class Zu {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Xu(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Et(t)), y(t)) : n;
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
    return n ? Et(n) : null;
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
    return Array.from(this.presets.values()).map(Et);
  }
  findForItem(t) {
    return this.list().map((n) => Ju(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Xu(e) {
  return !It(e.id) || !It(e.version) || !It(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function Ju(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = ed(o, t);
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
function ed(e, t) {
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
      const n = Rr(t.name), r = e.names.map(Rr).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = td(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Rr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function td(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Et(e) {
  return structuredClone(e);
}
function It(e) {
  return typeof e == "string" && e.length > 0;
}
function Ze(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = mt(e.amountFrom);
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
function mt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const nd = "dice-so-nice";
async function ma(e) {
  if (!rd() || !od()) return;
  const t = ad();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      d.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function rd() {
  try {
    return tl().enabled;
  } catch {
    return !1;
  }
}
function od() {
  return game.modules?.get?.(nd)?.active === !0;
}
function ad() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function id(e, t, n) {
  if (!$r(e.id) || !$r(e.formula))
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
    await ma(o);
    const l = {
      ...n.rollRequests[e.id] ?? fa(e, t),
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
function fa(e, t) {
  const n = e.intent ?? sd(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function sd(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function $r(e) {
  return typeof e == "string" && e.length > 0;
}
async function Xe(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? je(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? je(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? je(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? je(t, n, r, o) : e.recover(t, n, o);
  }
}
function je(e, t, n, r) {
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
function ld(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = cd(t, n, r, o);
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
    const i = ud(t, n, r, o);
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
function cd(e, t, n, r) {
  const o = mt(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: pa(t.id, "damage", r, t.damageInstances.length),
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
function ud(e, t, n, r) {
  const o = mt(e.amountFrom);
  return {
    id: pa(t.id, "healing", r, t.healingInstances.length),
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
function pa(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function dd(e, t, n) {
  const r = mt(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function md(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), ga("before", e), Cr("before", e), Cr("resolve", e);
}
function fd(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), ga("apply", e);
}
function pd(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function ga(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t, l = gd(e, n.operation);
  l && i.emit(l, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Cr(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t;
  n.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function gd(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function hd(e, t, n) {
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
async function yd(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return bd(e, t);
    case "spendRitualCost":
      return Ad(e, t);
  }
}
async function bd(e, t) {
  const { context: n, resources: r } = e, o = Ze(t, n);
  return o.ok ? ha(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function Ad(e, t) {
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
  }), ha(await r.spend(n.sourceActor, i.resource, i.amount), n, t);
}
function ha(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function _d(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, i = Td(t);
  for (const u of i.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const l = await a();
  if (!l.ok)
    return l;
  for (const u of i.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return l;
}
function Td(e) {
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
class Rd {
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
        return _d({
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
    const o = await yd({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = fa(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const i = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, i), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: i }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await id(t, r, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = Ze(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = dd(t, n, o.value);
    md({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), fd({
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
      const u = await Xe(this.resources, l, t.resource, t.operation, o.value), m = this.handleResourceOperationResult(u, n, r, t);
      if (!m.ok)
        return m;
      ld({
        step: t,
        context: n,
        transaction: m.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return pd({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = Ze(t, n);
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
      const l = await Xe(this.resources, i, t.resource, t.operation, o.value), u = this.handleResourceOperationResult(l, n, r, t);
      if (!u.ok)
        return u;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await hd(this.messages, t, n);
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
    const l = $d(t, n.intent);
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
function $d(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Cd {
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
function ya(e) {
  return {
    id: wd(),
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
function wd() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class kd {
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
    return ee(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = ya(n);
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
class Ed {
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
class Id {
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
    const n = Ut();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Sd(),
      flags: {
        ...t.flags,
        [c]: {
          ...Dd(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && d.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = Ut();
    if (!r.enabled)
      return;
    const o = n.notification ?? wr(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = wr(n);
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
function wr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Sd() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Dd(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function Ld(e, t) {
  const n = Md(e?.rounds);
  if (!n)
    return kr(null);
  const r = e?.anchor ?? ba(t);
  if (!r)
    return {
      ...kr(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Pd(),
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
function ba(e) {
  const t = Bd();
  if (!t?.id || !Aa(t.round)) return null;
  const n = Fd(t), r = vd(e, n) ?? Od(t), o = V(r?.id), a = qd(r?.initiative), i = Nd(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: i,
    initiative: a,
    time: Ud()
  };
}
function Pd() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function kr(e) {
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
function vd(e, t) {
  return e?.id ? t.find((n) => xd(n) === e.id) ?? null : null;
}
function Nd(e, t, n) {
  const r = V(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return zd(e.turn) ? e.turn : null;
}
function Od(e) {
  return We(e.combatant) ? e.combatant : null;
}
function Fd(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(We);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(We);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(We);
  }
  return [];
}
function xd(e) {
  return V(e.actor?.id) ?? V(e.actorId) ?? V(e.token?.actor?.id) ?? V(e.token?.actorId) ?? V(e.document?.actor?.id) ?? V(e.document?.actorId);
}
function Md(e) {
  return Aa(e) ? Math.trunc(e) : null;
}
function Bd() {
  return game.combat ?? null;
}
function Ud() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function We(e) {
  return !!(e && typeof e == "object");
}
function V(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function qd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Aa(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function zd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class jd {
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
    if (!Jd(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = Ld(t.duration, r), i = Vd(o, t, a), u = t.refreshExisting ?? !0 ? em(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(i)), y(Er(r, o, u.id ?? null, !1, !0, a));
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
      return y(Er(r, o, f, !0, !1, a));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = Ta(n, r);
    let a = 0;
    try {
      for (const i of o)
        await Ir(n, i) === "deleted" && (a += 1);
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
    const n = rm(), r = [];
    let o = 0, a = 0;
    for (const i of n) {
      const l = Tn(i);
      o += l.length;
      for (const u of l) {
        if (!Wd(u, t)) continue;
        const m = _a(u);
        try {
          await Ir(i, u) === "deleted" && (a += 1);
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
function Vd(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: fm(),
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
    duration: Hd(n.duration),
    start: Gd(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [c]: r
    }
  };
}
function Hd(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Gd(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: mm(),
    ...e
  };
}
function Er(e, t, n, r, o, a) {
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
function Wd(e, t) {
  const n = _a(e);
  if (!n.conditionId || !Kd(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = dm();
  return n.durationMode === "combatantTurn" || Yd(n) ? Zd(n, r) : Qd(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !L(n.startRound) || !L(n.requestedRounds) || !L(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Kd(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && L(e.requestedRounds);
}
function Yd(e) {
  return !!(e.combatDurationApplied && L(e.requestedRounds) && L(e.startRound) && (e.startCombatantId || Je(e.startTurn)));
}
function Qd(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Zd(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !L(e.startRound) || !L(e.requestedRounds) || !L(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Xd(t);
  return e.startCombatantId ? r === e.startCombatantId : Je(e.startTurn) && Je(t.turn) ? t.turn === e.startTurn : !1;
}
function Xd(e) {
  return se(e.combatant?.id);
}
function _a(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ke(e, "conditionId"),
    requestedRounds: Sr(e, "requestedRounds") ?? ke(t.value) ?? ke(t.rounds),
    combatDurationApplied: St(e, "combatDurationApplied"),
    combatId: Ke(e, "combatId") ?? se(n.combat) ?? se(t.combat),
    startCombatantId: Ke(e, "startCombatantId") ?? se(n.combatant),
    startInitiative: sm(e, "startInitiative") ?? Ra(n.initiative),
    startRound: Sr(e, "startRound") ?? ke(n.round) ?? ke(t.startRound),
    startTurn: im(e, "startTurn") ?? Wt(n.turn) ?? Wt(t.startTurn),
    expiryEvent: lm(e, "expiryEvent") ?? $a(t.expiry),
    durationMode: cm(e, "durationMode"),
    deleteOnExpire: St(e, "deleteOnExpire"),
    expiresWithCombat: St(e, "expiresWithCombat")
  };
}
function Jd(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function em(e, t) {
  return Ta(e, t)[0] ?? null;
}
function Ta(e, t) {
  return Tn(e).filter((n) => am(n) === t);
}
async function Ir(e, t) {
  const n = t.id ?? null, r = n ? tm(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (nm(o)) return "missing";
    throw o;
  }
}
function tm(e, t) {
  return Tn(e).find((n) => n.id === t) ?? null;
}
function nm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function rm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Ve(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Ve(e, n);
  });
  for (const n of om())
    Ve(e, n.actor), Ve(e, n.document?.actor);
  return Array.from(e.values());
}
function Ve(e, t) {
  if (!um(t)) return;
  const r = se(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function om() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Tn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function am(e) {
  return Ke(e, "conditionId");
}
function Ke(e, t) {
  return se(ne(e, t));
}
function Sr(e, t) {
  return ke(ne(e, t));
}
function im(e, t) {
  return Wt(ne(e, t));
}
function sm(e, t) {
  return Ra(ne(e, t));
}
function lm(e, t) {
  return $a(ne(e, t));
}
function cm(e, t) {
  const n = ne(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function St(e, t) {
  return ne(e, t) === !0;
}
function ne(e, t) {
  const n = e.getFlag?.(c, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const o = r[c];
  if (!(!o || typeof o != "object"))
    return o[t];
}
function se(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ke(e) {
  return L(e) ? Math.trunc(e) : null;
}
function Wt(e) {
  return Je(e) ? Math.trunc(e) : null;
}
function Ra(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function $a(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function um(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function dm() {
  return game.combat ?? null;
}
function mm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function L(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Je(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function fm() {
  return game.user?.id ?? null;
}
const pm = "icons/svg/downgrade.svg", gm = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? pm,
    description: gm,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const hm = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), ym = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), bm = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Am = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), _m = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Tm = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Rm = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), $m = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Cm = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), wm = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), km = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Em = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Im = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Sm = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Dm = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Lm = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Pm = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), vm = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Nm = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Om = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Fm = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), xm = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Mm = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Bm = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Um = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), qm = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), zm = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), jm = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Vm = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Hm = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), Gm = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Wm = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Km = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Ym = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Qm = [
  hm,
  ym,
  bm,
  Am,
  _m,
  Tm,
  Rm,
  $m,
  Cm,
  wm,
  km,
  Em,
  Im,
  Sm,
  Dm,
  Lm,
  Pm,
  vm,
  Nm,
  Om,
  Fm,
  xm,
  Mm,
  Bm,
  Um,
  qm,
  zm,
  jm,
  Vm,
  Hm,
  Gm,
  Wm,
  Km,
  Ym
];
class Zm {
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
    return Array.from(this.definitions.values()).map(Dr);
  }
  get(t) {
    const n = this.lookup.get(Lr(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(Dr(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Lr(t);
    r && this.lookup.set(r, n);
  }
}
function Xm() {
  return new Zm(Qm);
}
function Dr(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Lr(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const Jm = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Ca = `${c}-inline-roll-neutralized`, ef = `${c}-inline-roll-notice`, Rn = `data-${c}-inline-roll-neutralized`, Pr = `data-${c}-inline-roll-notice`, tf = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function vr(e) {
  const t = hf(e.message), n = await nf(e.message), r = rf(t);
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
async function nf(e) {
  const t = ff(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = of(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await pf(t, n.content), replacementCount: n.replacementCount };
}
function rf(e) {
  const t = e ? gf(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = wa(t);
  return n > 0 && ka(uf(t)), { replacementCount: n };
}
function of(e) {
  const t = af(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = wa(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (ka(n.content), { content: n.innerHTML, replacementCount: o });
}
function af(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, lf(o.trim()))), replacementCount: t };
}
function wa(e) {
  const t = sf(e);
  for (const n of t)
    n.replaceWith(cf(df(n)));
  return t.length;
}
function sf(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(Jm))
    n.getAttribute(Rn) !== "true" && t.add(n);
  return Array.from(t);
}
function lf(e) {
  return `<span class="${Ca}" ${Rn}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${yf(e)}</span>`;
}
function cf(e) {
  const t = document.createElement("span");
  return t.classList.add(Ca), t.setAttribute(Rn, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function ka(e) {
  if (e.querySelector?.(`[${Pr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(ef), t.setAttribute(Pr, "true"), t.textContent = tf, e.append(t);
}
function uf(e) {
  return e.querySelector(".message-content") ?? e;
}
function df(e) {
  const n = e.getAttribute("data-formula") ?? mf(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function mf(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function ff(e) {
  return e && typeof e == "object" ? e : null;
}
async function pf(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return d.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function gf(e) {
  const t = bf(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function hf(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function yf(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function bf(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const et = "ritualRollConfig", le = "ritual-roll";
function ft() {
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
function Ea(e) {
  const t = e.getFlag(c, et);
  return Kt(t);
}
function Ia(e) {
  return Ea(e) ?? ft();
}
async function Af(e, t) {
  const n = Kt(t) ?? Kt({
    ...ft(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(c, et, n), n;
}
async function _f(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, c, et));
    return;
  }
  await e.setFlag(c, et, null);
}
function Kt(e) {
  if (!pt(e)) return null;
  const t = Sf(e.intent);
  if (!t) return null;
  const n = ft();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: tt(e.damageType),
    utilityLabel: tt(e.utilityLabel) ?? n.utilityLabel,
    note: $n(e.note),
    forms: Df(e.forms)
  };
}
function Tf(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Rf(e) {
  const t = Ea(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = $f(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...Cf(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: kf(e, t),
    resistance: t.intent === "damage" ? Ef(e) : void 0
  };
}
function $f(e, t) {
  const n = {
    type: "rollFormula",
    id: le,
    formula: t,
    intent: If(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function Cf(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${le}.total`,
          ...wf(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${le}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function wf(e) {
  return e ? { damageType: e } : {};
}
function kf(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [le]: n
      }
    }
  };
  return Nr(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [le]: t.forms.discente.formula.trim()
    }
  }), Nr(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [le]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Ef(e) {
  const t = Sa(e), n = tt(t.skillResis), r = tt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = Lf(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function If(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Sf(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function Df(e) {
  const t = ft();
  return pt(e) ? {
    base: Dt(e.base),
    discente: Dt(e.discente),
    verdadeiro: Dt(e.verdadeiro)
  } : t.forms;
}
function Dt(e) {
  return pt(e) ? { formula: $n(e.formula) } : { formula: "" };
}
function Nr(e, t) {
  const n = Sa(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return Pf(r);
}
function Sa(e) {
  const t = e.system;
  return pt(t) ? t : {};
}
function Lf(e) {
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
function Pf(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function $n(e) {
  return typeof e == "string" ? e.trim() : "";
}
function tt(e) {
  const t = $n(e);
  return t.length > 0 ? t : null;
}
function pt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const Or = "occultism";
function vf(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Nf(e) {
  const t = vf(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await Of(e, Or);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await ma(n);
  const r = Mf(n);
  return {
    skill: Or,
    skillLabel: "Ocultismo",
    roll: n,
    formula: xf(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: Bf(n)
  };
}
async function Of(e, t) {
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
  return Ff(r);
}
function Ff(e) {
  return Fr(e) ? e : Array.isArray(e) ? e.find(Fr) ?? null : null;
}
function Fr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function xf(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Mf(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Bf(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Uf);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Uf(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function qf(e) {
  switch (zf(e)) {
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
      return jf(String(e ?? ""));
  }
}
function zf(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function jf(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function Vf(e) {
  return {
    header: {
      eyebrow: on,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Yf(e.ritual)
    },
    forms: e.variantOptions.map((t) => Hf(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: Kf(e.automationStatus ?? "assisted")
  };
}
function Hf(e, t) {
  const n = Gf(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Wf(t) : "—",
    details: n
  };
}
function Gf(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Wf(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function Kf(e) {
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
function Yf(e) {
  const t = e.system, n = [Zf(t?.element), Qf(t?.circle)].filter(ep);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function Qf(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Zf(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (Xf(e)) {
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
      return Jf(e);
  }
}
function Xf(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function Jf(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function ep(e) {
  return typeof e == "string" && e.length > 0;
}
const Da = ["base", "discente", "verdadeiro"];
function La(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function nt(e) {
  return typeof e == "string" && Da.includes(e);
}
const { ApplicationV2: tp } = foundry.applications.api;
class Ee extends tp {
  constructor(t, n) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = Vf(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: Ee.onCast,
      cancel: Ee.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new Ee(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    rp(o, (a) => {
      this.selectedVariant = a;
    }), op(o, (a) => {
      this.spendResource = a;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${k(this.model.header.eyebrow)}</p>
        <div>
          <h2>${k(this.model.header.title)}</h2>
          <p>${k(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(np).join("")}
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
          <div><dt>Custo base</dt><dd>${k(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${k(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${k(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${k(this.model.automation.title)}</strong></p>
        <p>${k(this.model.automation.description)}</p>
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
    const n = sp(t), r = ap(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function np(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((a) => `<span>${k(a)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${k(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${k(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${k(e.label)}</strong>
        <em>${k(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function rp(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => xr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), xr(e, o, t));
    });
  const r = Pa(e);
  r && t(r);
}
function xr(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !nt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Pa(e));
}
function Pa(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && nt(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function op(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function ap(e, t, n) {
  const r = ip(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function ip(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (nt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return nt(n) ? n : null;
}
function sp(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function k(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function lp(e) {
  return Ee.request(e);
}
const Cn = {
  label: "Padrão"
}, cp = {
  label: "Discente",
  extraCost: 2
}, up = {
  label: "Verdadeiro",
  extraCost: 5
};
class dp {
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
    const r = this.resolveCostPreview(t), o = tg(n), a = Xp(
      n,
      t.item,
      r,
      o
    ), i = await lp({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((C) => C.name),
      cost: r,
      defaultSpendResource: sg(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const l = mp(i), u = rg(
      n,
      t.item,
      l.variant,
      o
    ), m = Lo();
    let f = null;
    if (m) {
      const C = await pp(
        this.resources,
        t.actor,
        l,
        u,
        r
      );
      if (!C.ok)
        return {
          status: "failed",
          reason: C.reason,
          message: C.message
        };
      try {
        f = await Nf(
          t.actor
        );
      } catch (q) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: q instanceof Error ? q.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: q
        };
      }
    }
    const A = fp(
      n,
      l,
      u,
      r,
      {
        includeCostSteps: !m
      }
    );
    if (A.steps.length === 0) {
      const C = ng(
        t,
        l
      ), q = Mr(
        t.actor,
        f,
        u,
        r
      ), Fn = Br(
        n,
        l,
        u,
        r,
        C,
        t,
        f
      );
      return q.length > 0 ? {
        status: "ready",
        workflowContext: C,
        actions: q,
        summaryLines: Fn
      } : {
        status: "completed-without-actions",
        workflowContext: C,
        summaryLines: Fn
      };
    }
    const T = await this.workflow.runAutomation(A, {
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
    if (!T.ok)
      return {
        status: "failed",
        reason: T.error.reason,
        message: T.error.message,
        cause: T.error
      };
    const R = T.value.context, g = Tp(
      n,
      t,
      R
    ), v = hp(
      n,
      t
    ), be = Mr(
      t.actor,
      f,
      u,
      r
    ), Ae = Br(
      n,
      l,
      u,
      r,
      R,
      t,
      f
    );
    if (!g.ok)
      return {
        status: "failed",
        reason: g.reason,
        message: g.message
      };
    if (!v.ok)
      return {
        status: "failed",
        reason: v.reason,
        message: v.message
      };
    const _e = [
      ...be,
      ...g.actions,
      ...v.actions
    ];
    return _e.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: R,
      summaryLines: Ae
    } : {
      status: "ready",
      workflowContext: R,
      actions: _e,
      summaryLines: Ae
    };
  }
  async applyAction(t) {
    return Xe(
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
function mp(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function fp(e, t, n, r, o) {
  const a = [], i = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || kn(l) && (!o.includeCostSteps || !i) || a.push(gp(l, n));
  return o.includeCostSteps && i && r && lg(n.extraCost) && a.push({
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
async function pp(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Oe(o, r);
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
function gp(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Mr(e, t, n, r) {
  if (!t || t.success) return [];
  const o = Oe(r, n);
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
function hp(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = wn(r.actor, t);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const a of o) {
      const i = ba(a);
      n.push(
        yp(
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
function yp(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? _p(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: bp(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Ap(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function bp(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Ap(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function _p(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Tp(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const i = Ze(a, n);
    if (!i.ok)
      return {
        ok: !1,
        reason: i.error.reason,
        message: i.error.message
      };
    const l = wn(a.actor, t);
    if (l.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of l) {
      if (Rp(a)) {
        $p(
          o,
          u,
          Cp(a, n, i.value)
        );
        continue;
      }
      r.push(kp(a, u, i.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...wp(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function Rp(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function $p(e, t, n) {
  const r = Dp(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Cp(e, t, n) {
  const r = Lp(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function wp(e, t, n, r) {
  const o = Op(e), a = o.length > 1 ? Mp() : void 0;
  return o.map((i) => {
    const l = r.map(
      (m, f) => {
        const A = Fp(m.amount, i);
        return {
          id: Ep(m, i, f),
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
      label: Ip(u, i, o.length > 1),
      executedLabel: Sp(
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
function kp(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = Np(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: Pp(e, r, n),
    executedLabel: vp(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function Ep(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Ip(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Sp(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Dp(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Lp(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function Pp(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function vp(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Np(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Op(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Fp(e, t) {
  const n = e * t.multiplier, r = xp(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function xp(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Mp() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function wn(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Br(e, t, n, r, o, a, i = null) {
  return [
    `Forma: ${La(t.variant)}`,
    zp(t, n, r),
    ...qp(i),
    ...Object.values(o.rolls).flatMap(jp),
    ...Bp(e, a),
    ...Vp(e.resistance),
    ...Qp(n)
  ];
}
function Bp(e, t) {
  return Up(e) ? wn("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Up(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function qp(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function zp(e, t, n) {
  const r = Oe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function jp(e) {
  const n = [`${Zp(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = Hp(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${qf(e.damageType)}`), n;
}
function Vp(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function Hp(e) {
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
    const i = Gp(a);
    i && (Yp(
      n,
      i.operator ?? r,
      i.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Gp(e) {
  const t = Wp(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Kp(e);
}
function Wp(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Kp(e) {
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
function Yp(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function Qp(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Zp(e) {
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
function Xp(e, t, n, r) {
  return Da.map((o) => {
    const a = va(
      e,
      t,
      o,
      r
    ), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? La(o),
      enabled: i,
      details: a ? Jp(a, n, r) : [],
      finalCostText: a ? eg(n, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function Jp(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = Oe(t, e);
  return r.push(
    a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"
  ), r;
}
function Oe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function eg(e, t) {
  const n = Oe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function tg(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(kn);
}
function ng(e, t) {
  return ya({
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
function rg(e, t, n, r) {
  return va(e, t, n, r) ?? Cn;
}
function va(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? ag(t, n) ? og(n) : null : n === "base" ? Cn : null);
}
function og(e) {
  switch (e) {
    case "base":
      return Cn;
    case "discente":
      return cp;
    case "verdadeiro":
      return up;
  }
}
function ag(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return ig(foundry.utils.getProperty(e, n));
}
function ig(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function sg(e) {
  return e.steps.some(kn);
}
function kn(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function lg(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function cg(e, t) {
  const n = await ug(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: mg(n),
    total: fg(n),
    diceBreakdown: pg(n)
  };
}
function Na(e) {
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
async function ug(e, t) {
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
  return dg(r);
}
function dg(e) {
  return Ur(e) ? e : Array.isArray(e) ? e.find(Ur) ?? null : null;
}
function Ur(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function mg(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function fg(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function pg(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(gg);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function gg(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Oa = "itemUsePrompts", Fa = "chatCard", gt = "data-paranormal-toolkit-prompt-id", ht = "data-paranormal-toolkit-pending-id", En = "data-paranormal-toolkit-executed-label", Yt = "data-paranormal-toolkit-choice-group", xa = "data-paranormal-toolkit-skipped-label", qr = "data-paranormal-toolkit-action-section", zr = "data-paranormal-toolkit-detail-key", jr = "data-paranormal-toolkit-roll-card", In = "data-paranormal-toolkit-roll-detail-toggle", Ma = "data-paranormal-toolkit-roll-detail-id", Ba = "data-paranormal-toolkit-resistance-roll-button", Ua = "data-paranormal-toolkit-resistance-skill", qa = "data-paranormal-toolkit-resistance-skill-label", za = "data-paranormal-toolkit-resistance-target-actor-id", ja = "data-paranormal-toolkit-resistance-target-name", Va = "data-paranormal-toolkit-resistance-roll-result", Vr = "data-paranormal-toolkit-system-card-replaced", hg = `[${ht}]`, yg = `[${In}]`, bg = `[${Ba}]`, Qt = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, Ag = `${h}__actions`, Hr = `${h}__details`, Ha = `${h}__summary`, _g = `${h}__title`, Ga = `${h}__button--executed`, Gr = `${h}__roll-card`;
let Wr = !1, Zt = null;
const P = /* @__PURE__ */ new Map(), Tg = [0, 100, 500, 1500, 3e3], Rg = 3e4, $g = [0, 100, 500, 1500, 3e3];
function Cg(e) {
  if (Zt = e, Wr) {
    Yr(e);
    return;
  }
  const t = (n, r) => {
    Ka(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Wr = !0, Yr(e);
}
async function Kr(e) {
  const t = Wa(e);
  P.set(e.pendingId, t), await Ln(t) || oi(t), Ya(e.pendingId);
}
async function wg(e) {
  const t = Wa({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await Ln(t) || oi(t), Ya(e.pendingId);
}
async function Lt(e, t) {
  const n = P.get(e);
  P.delete(e), n && await Ch(n, t);
}
function Sn(e) {
  const t = di();
  for (const n of t) {
    const r = U(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function kg(e, t) {
  const n = Sn(e);
  if (!n) return;
  const r = U(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await ge(n.message, r));
}
async function Eg(e, t, n) {
  if (!t) return;
  const r = Sn(e);
  if (!r) return;
  const o = U(r.message);
  let a = !1;
  for (const [i, l] of Object.entries(o))
    i !== e && l.choiceGroupId === t && (o[i] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await ge(r.message, o);
}
function Wa(e) {
  const t = G(e.context.message), n = e.context.targets.find((i) => tn(i)), r = n ? tn(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Jg(e.context),
    executed: !1
  };
}
function Ka(e, t, n) {
  $h();
  const r = bt(t);
  if (!r) return;
  const o = _h(e, r);
  o.length > 0 && rt(r);
  for (const a of o)
    Xt(r, a);
  Xa(r, n), Jt(r), en(r);
}
function Yr(e) {
  for (const t of $g)
    globalThis.setTimeout(() => {
      Ig(e);
    }, t);
}
function Ig(e) {
  for (const t of Sg()) {
    const n = yt(t);
    Dg(n) && Ka(n, t, e);
  }
}
function Sg() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Dg(e) {
  return e ? Pn(e) ? !0 : kh(e).length > 0 : !1;
}
function Ya(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? Th(t.messageId) : null;
  if (n) {
    eo(n, t), rt(n), Xt(n, t), Qr(n), Jt(n), en(n);
    return;
  }
  if (t.messageId) {
    rn(t);
    return;
  }
  const r = Rh(t);
  if (r) {
    eo(r, t), rt(r), Xt(r, t), Qr(r), Jt(r), en(r);
    return;
  }
  rn(t);
}
function Qr(e) {
  Zt && Xa(e, Zt);
}
function rt(e) {
  const t = Lg();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Za(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Vr) === "true") return;
  const r = n.querySelector(`.${Qt}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Vr, "true");
}
function Lg() {
  try {
    return Ts() === "replace";
  } catch {
    return !1;
  }
}
function Xt(e, t) {
  if (rt(e), e.querySelector(`[${gt}="${he(t.pendingId)}"]`)) return;
  const n = Pg(e, t);
  Ng(n, t), Kg(n, Yg(t)).append(Xg(t));
}
function Pg(e, t) {
  const n = e.querySelector(`.${Qt}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Qt, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(_g), i.textContent = vg(t);
  const l = document.createElement("span");
  return l.classList.add(Ha), l.textContent = t.summary, o.append(a, i, l), r.append(o), th(e).append(r), r;
}
function vg(e) {
  const t = E(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Ng(e, t) {
  const n = t.summaryLines ?? [], r = ni(n, t);
  if (r) {
    Og(e, r, t);
    return;
  }
  Qg(e, n);
}
function Og(e, t, n) {
  if (e.querySelector(`[${jr}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Gr, `${Gr}--${t.intent}`), r.setAttribute(jr, "true"), t.castingCheck && Zr(r, xg(t.castingCheck), n.pendingId, "casting"), Fg(t) && Zr(r, Mg(t), n.pendingId, "effect"), jg(r, t), Vg(r, t, n), Wg(r, t), e.append(r);
}
function Fg(e) {
  return e.intent !== "casting";
}
function xg(e) {
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
function Mg(e) {
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
function Zr(e, t, n, r) {
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
  Bg(o, t), Gg(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Bg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = Ug(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function Ug(e, t) {
  const n = qg(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of zg(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function qg(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function zg(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Xr(e, "highest") : n.includes("kl") ? Xr(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Xr(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function jg(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Vh);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function Vg(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = Hg(t, n);
  o.append(a), i && o.append(i);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(o, l), t.resistanceRollResult && r.append(Qa(t.resistanceRollResult)), e.append(r);
}
function Hg(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(gt, t.pendingId), n.setAttribute(Ba, "true"), n.setAttribute(Ua, e.resistanceSkill), n.setAttribute(qa, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(za, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(ja, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Va, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Qa(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = ei(e), t;
}
function Gg(e, t, n, r, o) {
  const a = t.filter((m) => m.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(In, i), l.setAttribute("aria-expanded", "false"), l.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(Ma, i), u.hidden = !0;
  for (const m of a) {
    const f = document.createElement("dt");
    f.textContent = m.label;
    const A = document.createElement("dd");
    A.textContent = m.value, u.append(f, A);
  }
  e.append(l, u);
}
function Wg(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function Kg(e, t) {
  const n = `[${qr}="${he(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Ag), o.setAttribute(qr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function Yg(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = ni(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Qg(e, t) {
  if (t.length === 0) return;
  const n = Zg(e);
  for (const r of t) {
    const o = Hh(r);
    if (n.querySelector(`[${zr}="${he(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(zr, o), n.append(a);
  }
}
function Zg(e) {
  const t = e.querySelector(`.${Hr}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Hr), e.append(n), n;
}
function Xg(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(gt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Ga), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(ht, e.pendingId), t.setAttribute(En, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Yt, e.choiceGroupId), t.setAttribute(xa, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Jg(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = eh(e);
  return `${t} → ${n}`;
}
function eh(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function th(e) {
  return Za(e) ?? e;
}
function Za(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Xa(e, t) {
  const n = bt(e);
  if (!n) return;
  const r = n.querySelectorAll(hg);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      gh(o, t);
    }));
}
function Jt(e) {
  const t = bt(e);
  if (!t) return;
  const n = t.querySelectorAll(yg);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      nh(t, r);
    }));
}
function en(e) {
  const t = bt(e);
  if (!t) return;
  const n = t.querySelectorAll(bg);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      rh(t, r);
    }));
}
function nh(e, t) {
  const n = t.getAttribute(In);
  if (!n) return;
  const r = e.querySelector(`[${Ma}="${he(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function rh(e, t) {
  const n = t.getAttribute(gt), r = t.getAttribute(Ua), o = t.getAttribute(qa) ?? (r ? Na(r) : "Resistência");
  if (!n || !r) return;
  const a = ih(e, n), i = sh(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await cg(i, r);
    await mh(u.roll);
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
    oh(t, m), ah(t, m), fh(n, m), await ph(e, n, m);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function oh(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Va, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function ah(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Qa(t);
  if (r) {
    r.textContent = ei(t);
    return;
  }
  n.append(o);
}
function ih(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = yt(e);
  return U(r)[t] ?? null;
}
function sh(e, t) {
  const n = e?.resistanceTargetActor;
  if (F(n)) return n;
  const o = e?.context?.targets.map(tn).find(F) ?? null;
  if (o) return o;
  const a = t.getAttribute(za) ?? e?.resistanceTargetActorId ?? null, i = a ? ch(a) : null;
  return i || uh(
    t.getAttribute(ja) ?? e?.resistanceTargetName ?? lh(t)
  );
}
function lh(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Ha}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function tn(e) {
  const t = e.actor;
  if (F(t)) return t;
  const n = e.token, r = Le(n);
  if (r) return r;
  const o = e.document;
  return Le(o);
}
function Le(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (F(t)) return t;
  const n = e.document?.actor;
  return F(n) ? n : null;
}
function ch(e) {
  const n = game.actors?.get?.(e);
  return F(n) ? n : Ja().map((a) => Le(a)).find((a) => a?.id === e) ?? null;
}
function uh(e) {
  const t = ce(e);
  if (!t) return null;
  const n = Ja().filter((a) => ce(dh(a)) === t).map((a) => Le(a)).find(F) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => F(a) && ce(a.name) === t);
  return F(o) ? o : null;
}
function Ja() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function dh(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Le(e)?.name ?? null;
}
function ce(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function F(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ei(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function mh(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function fh(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function ph(e, t, n) {
  const r = yt(e);
  if (r)
    try {
      const o = U(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await ge(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function yt(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return B(r?.get?.(n));
}
async function gh(e, t) {
  const n = e.getAttribute(ht);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    ti(e, e.getAttribute(En) ?? "✓ Automação aplicada"), hh(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function ti(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Ga), e.removeAttribute(ht), e.removeAttribute(En);
}
function hh(e) {
  const t = e.getAttribute(Yt);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Yt}="${he(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(xa) ?? "✓ Outra opção escolhida";
    ti(o, a);
  }
}
function ni(e, t) {
  const n = e.map(Dn).filter(zh), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = E(e, "Forma"), a = E(e, "Custo"), i = E(e, "Dados") ?? E(e, `Dados (${r.label})`), l = E(e, "Tipo"), u = E(e, "Resistência"), m = E(e, "Resistência Perícia"), f = E(e, "Resistência Rótulo") ?? (m ? Na(m) : null), A = ri(e, "Observação"), T = e.filter((g) => Ah(g, r)), R = yh(e);
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
    details: T,
    castingCheck: R,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function yh(e) {
  const t = e.map(Dn).find((a) => a?.intent === "casting") ?? null, n = E(e, "Conjuração DT"), r = E(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: E(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: E(e, "Dados (Conjuração)")
  } : null;
}
function Dn(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: bh(n)
  } : null;
}
function bh(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function E(e, t) {
  return ri(e, t)[0] ?? null;
}
function ri(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Ah(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Dn(e) ? !1 : e.trim().length > 0;
}
function _h(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    nn(r, e, t) && n.set(r.pendingId, r);
  for (const r of wh(e))
    nn(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function nn(e, t, n) {
  const r = G(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !Jr(n, "itemId", e.itemId) ? !1 : !e.actorId || Jr(n, "actorId", e.actorId);
}
function Jr(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${Gh(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Th(e) {
  const t = he(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Rh(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (nn(e, null, t))
      return t;
  return null;
}
function $h() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function eo(e, t) {
  const n = yt(e);
  if (!n) return !1;
  try {
    const r = U(n);
    return r[t.pendingId] = vn(t, G(n)), await ge(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Ln(e) {
  const t = si(e);
  if (!t) return !1;
  try {
    const n = U(t);
    return n[e.pendingId] = vn(e, G(t)), await ge(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function oi(e) {
  for (const t of Tg)
    globalThis.setTimeout(() => {
      rn(e);
    }, t);
}
async function rn(e) {
  const t = si(e);
  if (Pn(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await Ln(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function Ch(e, t) {
  const n = ii(e.context.message);
  if (n)
    try {
      const r = U(n), o = r[e.pendingId] ?? vn(e, G(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await ge(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function wh(e) {
  return Object.values(U(B(e))).filter(Fe);
}
function U(e) {
  if (!e) return {};
  const t = {}, n = Pn(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(ai(e)))
    t[r] ??= o;
  return t;
}
function kh(e) {
  return Object.values(ai(B(e))).filter(Fe);
}
function ai(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, Oa);
  if (!me(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Fe(o) && (n[r] = o);
  return n;
}
async function ge(e, t) {
  typeof e.setFlag == "function" && (await Ih(e, t), await Eh(e, t));
}
async function Eh(e, t) {
  await Promise.resolve(e.setFlag?.(c, Oa, t));
}
function Pn(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, Fa);
  return Uh(t) ? t : null;
}
async function Ih(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Fe).sort((a, i) => a.createdAt - i.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((a) => a.createdAt)),
    messageId: r.messageId ?? G(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: Sh(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(c, Fa, o));
}
function Sh(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function vn(e, t) {
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
function ii(e) {
  const t = B(e);
  if (t?.setFlag)
    return t;
  const n = Dh(e);
  if (n?.setFlag)
    return n;
  const r = G(e);
  if (!r) return null;
  const o = game.messages;
  return B(o?.get?.(r));
}
function Dh(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(B).find((n) => typeof n?.setFlag == "function") ?? null;
}
function si(e) {
  const t = ii(e.context.message);
  if (t) return t;
  const n = e.messageId ? Lh(e.messageId) : null;
  if (n) return n;
  const r = di().slice().reverse();
  return r.find((o) => Ph(o, e)) ?? r.find((o) => vh(o, e)) ?? null;
}
function Lh(e) {
  const t = game.messages;
  return B(t?.get?.(e));
}
function Ph(e, t) {
  const n = G(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!li(e, t)) return !1;
  const o = ci(e);
  return !t.actorId || !o || o === t.actorId;
}
function vh(e, t) {
  if (!Oh(e, t)) return !1;
  const n = ci(e);
  return t.actorId && n === t.actorId ? !0 : li(e, t);
}
function li(e, t) {
  const n = ce(Nh(e));
  if (!n) return !1;
  const r = ce(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = ce(t.itemId);
  return !!(o && n.includes(o));
}
function Nh(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function ci(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Oh(e, t) {
  const n = Fh(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Rg;
}
function Fh(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function B(e) {
  return e && typeof e == "object" ? e : null;
}
function Fe(e) {
  return me(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && Z(e.resistanceTargetActorId) && Z(e.resistanceTargetName) && qh(e.resistanceRollResult) && xh(e.actionPayload) && Pt(e.title) && Pt(e.buttonLabel) && Pt(e.executedLabel) && Z(e.choiceGroupId) && Z(e.skippedLabel) && Z(e.actionSectionId) && Z(e.actionSectionTitle) && jh(e.summaryLines) : !1;
}
function xh(e) {
  return e == null ? !0 : me(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && Mh(e.resource) && Bh(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Mh(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Bh(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Uh(e) {
  return me(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && me(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Fe) : !1;
}
function qh(e) {
  return e == null ? !0 : me(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function zh(e) {
  return e !== null;
}
function me(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function S(e) {
  return e === null || typeof e == "string";
}
function Pt(e) {
  return e === void 0 || typeof e == "string";
}
function Z(e) {
  return e == null || typeof e == "string";
}
function jh(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Vh(e) {
  return typeof e == "string" && e.length > 0;
}
function di() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(B).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(B).filter((r) => r !== null) : [];
}
function bt(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function G(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function Hh(e) {
  return e.trim().toLowerCase();
}
function Gh(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function he(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const to = 1e3;
class Wh {
  constructor(t, n, r, o, a, i) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = i, this.ritualAssistant = new dp(
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
      settings: jn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = jn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = an(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && ty(t.item) && n.executionMode === "ask") {
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
    if (await vr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ot(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await Lt(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Lt(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Sn(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = oy(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await Xe(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await kg(t), await Eg(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Cg(
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
    if (await vr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ot(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      ny(t.item)
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
          ee(r.workflowContext)
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
      return o.ok ? (ey(n, o.value), await Kh(o.value), {
        ok: !0,
        executedLabel: Yh(o.value)
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
    const n = vt(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && vt(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== t.id && (this.pendingExecutions.delete(o), await Lt(
        o,
        ro(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Ft();
    await wg({
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
      const l = Ft();
      a ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: i,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Kr({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: i.label,
        executedLabel: i.executedLabel,
        choiceGroupId: vt(i),
        skippedLabel: ro(i),
        actionSectionId: i.actionSectionId,
        actionSectionTitle: i.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: i.actor,
        resistanceTargetActorId: i.actor.id ?? null,
        resistanceTargetName: i.actorName,
        actionPayload: ry(i)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      a
    ), d.info(
      "Ritual assistido preparado com ações pendentes.",
      ee(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = Ft();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Kr({
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
      ee(o.value.context)
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
    const n = Date.now(), r = oo(t);
    for (const [a, i] of this.recentExecutionKeys.entries())
      n - i > to && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= to;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(oo(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = Ot(
      t,
      n,
      r,
      o
    );
  }
}
async function Kh(e) {
  const t = Jh();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: Qh(e)
      });
    } catch (n) {
      d.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function Yh(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function Qh(e) {
  const t = e.instances.map((i) => {
    const l = i.blocked > 0 ? ` <span class="muted">(RD ${i.blocked})</span>` : "";
    return `<li><strong>${Ye(i.label ?? "Dano")}</strong>: ${i.inputAmount} → ${i.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = Zh(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Ye(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${Ye(e.actorName)}</strong></p>
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
function Zh(e) {
  const t = Xh(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Ye(o)}</li>`;
}
function Xh(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = no(n?.value);
  return r === null ? null : {
    value: r,
    max: no(n?.max)
  };
}
function no(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Jh() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function Ye(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function vt(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function ro(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function ey(e, t) {
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
function ty(e) {
  return e.type === "ritual";
}
function ny(e) {
  return Rf(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function ry(e) {
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
function oy(e) {
  const t = e.actorUuid ? ay(e.actorUuid) : null;
  if (fe(t)) return t;
  const n = e.actorId ? iy(e.actorId) : null;
  return n || sy(e.actorName);
}
function ay(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function iy(e) {
  const n = game.actors?.get?.(e);
  if (fe(n)) return n;
  for (const r of mi()) {
    const o = Nn(r);
    if (o?.id === e) return o;
  }
  return null;
}
function sy(e) {
  const t = Nt(e);
  if (!t) return null;
  for (const o of mi()) {
    const a = ly(o);
    if (Nt(a) === t) {
      const i = Nn(o);
      if (i) return i;
    }
  }
  const r = game.actors?.find?.(
    (o) => fe(o) && Nt(o.name) === t
  );
  return fe(r) ? r : null;
}
function mi() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function ly(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Nn(e)?.name ?? null;
}
function Nn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (fe(t)) return t;
  const n = e.document?.actor;
  return fe(n) ? n : null;
}
function Nt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function fe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ot(e, t, n, r) {
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
function oo(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Ft() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class cy {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = ve(t);
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
class uy {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = ve(t).map((l) => this.analyzeRitual(l)), r = n.filter(He("upToDate")), o = n.filter(He("available")), a = n.filter(He("outdated")), i = n.filter(He("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = dy(t);
    return n ? r ? r.source.type !== "preset" ? Te({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? Te({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : Te({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: my(r, n.preset)
    }) : Te({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : Te({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Te(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? it(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function dy(e) {
  const t = e.getFlag(c, "automation");
  return sn(t) ? t : null;
}
function my(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function He(e) {
  return (t) => t.status === e;
}
class fy {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = cn(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), o = ee(t);
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
    const n = _(t.actorName), r = _(t.resource), o = _(ao(t)), a = _(gy(t));
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
    const r = _(n.title ?? "Automação"), o = n.message ? `<p>${_(n.message)}</p>` : "", a = _(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), i = _(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((g) => _(g.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map(
      (g) => `<li><strong>${_(g.id)}:</strong> ${_(g.formula)} = ${g.total} <em>(${_(py(g.intent))})</em>${g.damageType ? ` — ${_(g.damageType)}` : ""}</li>`
    ), m = t.ritualCosts.map(
      (g) => `<li><strong>${_(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${_(g.resource)} (${_(hy(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${_(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${_(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (g) => `<li><strong>${_(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${_(g.actorName)}:</strong> ${_(ao(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), R = t.phases.map((g) => _(g)).join(" &rarr; ");
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
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${R}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function py(e) {
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
function ao(e) {
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
function gy(e) {
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
function hy(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function _(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function yy() {
  const e = new Su(), t = new Cd(e), n = new Cu(), r = new Pu(), o = new Ou(r), a = new Yu(e), i = new Zu(), l = i.registerMany(
    Ji()
  );
  if (!l.ok)
    throw new Error(l.error.message);
  const u = new Qu(), m = new Wu(), f = Xm(), A = new jd(f), T = new uy(
    i
  ), R = new cy(
    T,
    u,
    m
  ), g = new Id(), v = new fy(g), be = new Ed(), Ae = new Rd(
    t,
    o,
    v,
    be
  ), _e = new kd(Ae, be), C = new Wh(
    _e,
    t,
    o,
    n,
    A,
    g
  );
  return C.addStrategy(
    new Hu(
      (q) => C.handleItemUsed(q)
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
    chatMessages: v,
    workflowHooks: be,
    automation: Ae,
    workflow: _e,
    itemUseIntegration: C,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: R
  };
}
const { ApplicationV2: by } = foundry.applications.api;
class ot extends by {
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
      apply: ot.onApply,
      cancel: ot.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${N(on)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${N(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${xt("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${xt("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${xt("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function xt(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${N(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Ay(n) : Ty(t)}
    </section>
  `;
}
function Ay(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(_y).join("")}</ol>`;
}
function _y(e) {
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
function Ty(e) {
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
const at = `${c}.manageRitualPresets`, io = `__${c}_ritualPresetHeaderControlRegistered`, Ry = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function $y(e) {
  const t = globalThis;
  if (!t[io]) {
    for (const n of Ry)
      Hooks.on(n, (r, o) => {
        Cy(r, o, e);
      });
    t[io] = !0, d.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Cy(e, t, n) {
  Array.isArray(t) && ky(e) && (wy(e, n), !t.some((r) => r.action === at) && t.push({
    action: at,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), fi(e, n);
    }
  }));
}
function wy(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[at] && (e.options.actions[at] = (n) => {
    n.preventDefault(), n.stopPropagation(), fi(e, t);
  }));
}
function ky(e) {
  if (!game.user?.isGM) return !1;
  const t = pi(e);
  return t ? t.type === "agent" && ve(t).length > 0 : !1;
}
function fi(e, t) {
  const n = pi(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new ot(n, t).render({ force: !0 });
}
function pi(e) {
  return so(e.actor) ? e.actor : so(e.document) ? e.document : null;
}
function so(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const gi = "data-paranormal-toolkit-ritual-roll-config", xe = "data-paranormal-toolkit-ritual-roll-field", te = "data-paranormal-toolkit-ritual-roll-action", lo = `__${c}_ritualRollConfigBlockRegistered`, Ey = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], Iy = [
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
function Sy() {
  const e = globalThis;
  if (!e[lo]) {
    Dy();
    for (const t of Ey)
      Hooks.on(t, (...n) => {
        Ly(n[0], n[1]);
      });
    e[lo] = !0, d.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function Dy() {
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
function Ly(e, t) {
  const n = Hy(e);
  if (!n || n.type !== "ritual") return;
  const r = Ky(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  vy(o);
  const a = yi(n), i = Ia(n), l = Gy(n), u = Ny(n, i, a, l);
  Uy(u, n, a, l), Py(o, u), On(u);
}
function Py(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function vy(e) {
  for (const t of Array.from(e.querySelectorAll(`[${gi}]`)))
    t.remove();
}
function Ny(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${c}-ritual-roll-config`), o.setAttribute(gi, e.uuid ?? e.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${c}-ritual-roll-config__header`);
  const i = document.createElement("div");
  i.classList.add(`${c}-ritual-roll-config__title`), i.append(co("strong", "Paranormal Toolkit")), i.append(co("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${c}-ritual-roll-config__badge`), l.textContent = Ai(t) ? "Configurada" : "Rascunho", a.append(i, l), o.append(a);
  const u = document.createElement("p");
  u.classList.add(`${c}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const m = document.createElement("div");
  m.classList.add(`${c}-ritual-roll-config__fields`), m.append(Oy(t, r)), m.append(Fy(t, r)), m.append(xy(t, r)), o.append(m), o.append(My(t, n, r)), o.append(By(r));
  const f = document.createElement("p");
  return f.classList.add(`${c}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function Oy(e, t) {
  const n = At("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(xe, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = Tf(o), a.selected = e.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function Fy(e, t) {
  const n = At("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(xe, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const a of Iy) {
    const i = document.createElement("option");
    i.value = a.value, i.textContent = a.label, i.selected = e.damageType === a.value, r.append(i);
  }
  return n.append(r), n;
}
function xy(e, t) {
  const n = At("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(xe, "utilityLabel"), n.append(r), n;
}
function My(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${c}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${c}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const a = document.createElement("div");
  return a.classList.add(`${c}-ritual-roll-config__forms-grid`), a.append(Mt("base", "Padrão", e.forms.base.formula, !0, n)), a.append(Mt("discente", "Discente", e.forms.discente.formula, t.discente, n)), a.append(Mt("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(a), r;
}
function Mt(e, t, n, r, o) {
  const a = At(t);
  a.classList.add(`${c}-ritual-roll-config__form-card`), a.dataset.ritualRollForm = e;
  const i = document.createElement("input");
  if (i.type = "text", i.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", i.value = n, i.disabled = !o || !r, i.setAttribute(xe, `formula.${e}`), a.append(i), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", a.append(l);
  }
  return a;
}
function By(e) {
  const t = document.createElement("div");
  t.classList.add(`${c}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(te, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(te, "clear"), t.append(n, r), t;
}
function At(e) {
  const t = document.createElement("label");
  t.classList.add(`${c}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function co(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function Uy(e, t, n, r) {
  ye(e, "intent")?.addEventListener("change", () => On(e)), fo(e, "system.studentForm")?.addEventListener("change", () => uo(e, t)), fo(e, "system.trueForm")?.addEventListener("change", () => uo(e, t)), e.querySelector(`[${te}="save"]`)?.addEventListener("click", () => {
    r && qy(e, t, n);
  }), e.querySelector(`[${te}="clear"]`)?.addEventListener("click", () => {
    r && zy(e, t);
  });
}
async function qy(e, t, n) {
  const r = e.querySelector(`[${te}="save"]`);
  r?.setAttribute("disabled", "true"), ue(e, "Salvando configuração...");
  try {
    const o = jy(e, n);
    await Af(t, o), hi(e, o), ue(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), ue(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function zy(e, t) {
  const n = e.querySelector(`[${te}="clear"]`);
  n?.setAttribute("disabled", "true"), ue(e, "Limpando configuração...");
  try {
    await _f(t);
    const r = Ia(t);
    Vy(e, r), hi(e, r), ue(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), ue(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function hi(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__badge`);
  n && (n.textContent = Ai(t) ? "Configurada" : "Rascunho");
}
function jy(e, t) {
  return {
    schemaVersion: 1,
    intent: bi(ye(e, "intent")?.value),
    damageType: po(e, "damageType"),
    utilityLabel: po(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Qe(e, "formula.base") },
      discente: { formula: Qe(e, "formula.discente") },
      verdadeiro: { formula: Qe(e, "formula.verdadeiro") }
    }
  };
}
function Vy(e, t) {
  oe(e, "intent", t.intent), oe(e, "damageType", t.damageType ?? ""), oe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), oe(e, "formula.base", t.forms.base.formula), oe(e, "formula.discente", t.forms.discente.formula), oe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), On(e);
}
function On(e) {
  const t = bi(ye(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function uo(e, t) {
  const n = yi(t);
  mo(e, "discente", n.discente), mo(e, "verdadeiro", n.verdadeiro);
}
function mo(e, t, n) {
  const r = ye(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${te}="save"]`)?.disabled;
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
function ue(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function yi(e) {
  const t = Wy(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function Hy(e) {
  return go(e.item) ? e.item : go(e.document) ? e.document : null;
}
function Gy(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function Wy(e) {
  const t = e.system;
  return Yy(t) ? t : {};
}
function fo(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ye(e, t) {
  return e.querySelector(`[${xe}="${Qy(t)}"]`);
}
function Qe(e, t) {
  return ye(e, t)?.value.trim() ?? "";
}
function po(e, t) {
  const n = Qe(e, t);
  return n.length > 0 ? n : null;
}
function oe(e, t, n) {
  const r = ye(e, t);
  r && (r.value = n);
}
function bi(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Ai(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function Ky(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function go(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function Yy(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function Qy(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let J = null;
Hooks.once("init", () => {
  Qi(), _s(), el(), iu(), d.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Gn.isSupportedSystem()) {
    d.warn(
      `Sistema não suportado: ${Gn.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  J = yy(), J.itemUseIntegration.registerStrategies(), Qs(J.conditions), vs(J), Vs(), Us(), mu(), $y(J), Sy(), d.info("Inicializado para o sistema Ordem Paranormal."), d.info(
    `API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${on} inicializado.`);
});
function Zy() {
  if (!J)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return J;
}
export {
  Zy as getToolkitServices
};
//# sourceMappingURL=main.js.map
