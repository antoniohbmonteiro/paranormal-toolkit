const c = "paranormal-toolkit", In = "Paranormal Toolkit", _s = "ordemparanormal";
class Fe {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function bt(e) {
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
class m {
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
function b(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function Sn(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Ln(t) ? b(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function ys(e) {
  return Ln(e.getFlag(c, "automation"));
}
function Ln(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Ts(t.source) && As(t.definition);
}
function As(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every($s) && (t.conditionApplications === void 0 || Is(t.conditionApplications));
}
function Ts(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function $s(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Rs(t);
    case "spendRitualCost":
      return ws(t);
    case "rollFormula":
      return ks(t);
    case "modifyResource":
      return Es(t);
    case "chatCard":
      return Cs(t);
    default:
      return !1;
  }
}
function Rs(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ho(t);
}
function ws(e) {
  return e.type === "spendRitualCost";
}
function ks(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || Ns(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function Es(e) {
  const t = e;
  return t.type === "modifyResource" && Wo(t.actor) && vs(t.resource) && Ps(t.operation) && Ho(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Cs(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Is(e) {
  return Array.isArray(e) && e.every(Ss);
}
function Ss(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && Wo(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || Ls(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel));
}
function Ls(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || xs(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Ds(t.expiry));
}
function Ds(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Ho(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function Wo(e) {
  return e === "self" || e === "target";
}
function vs(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ps(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Ns(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function xs(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function Dn(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(cr);
    if (Ms(t))
      return Array.from(t).filter(cr);
  }
  return [];
}
function Os(e) {
  return Dn(e)[0] ?? null;
}
function Fs(e) {
  return Dn(e).find(ys) ?? null;
}
function Ms(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function cr(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Me(e) {
  return Dn(e).filter((t) => t.type === "ritual");
}
function Ko(e) {
  return Me(e)[0] ?? null;
}
function Bs(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(bt);
      return m.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = ke("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Ge(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(mr);
      return m.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = ke("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Ge(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const i = await tn(e, r, o.value);
      m.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: i }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = ke("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Ge(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        m.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await tn(e, n, r.preset);
      m.info(`Melhor preset aplicado em ${n.name}.`, { match: mr(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return ur(e);
    },
    async applyBestPresetsToActorRituals() {
      return ur(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = ke("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Ge(t);
      n && (await e.automationBinder.clear(n), m.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function ur(e) {
  const t = ke("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Me(t);
  if (n.length === 0)
    return m.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), dr(t);
  const r = dr(t, n.length);
  for (const o of n) {
    const i = e.automationRegistry.findForItem(o)[0];
    if (!i) {
      r.skipped.push({
        itemId: o.id ?? null,
        itemName: o.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await tn(e, o, i.preset);
    r.applied.push(Us(o, i, s));
  }
  return m.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), qs(r), r;
}
async function tn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Us(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: bt(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function dr(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function qs(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function mr(e) {
  return {
    preset: bt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function ke(e) {
  const t = Fe.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ge(e) {
  const t = Ko(e);
  return t || (m.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ee(e) {
  return e ? {
    id: e.id,
    source: {
      ...zs(e.sourceActor),
      token: e.sourceToken
    },
    item: js(e.item),
    targets: e.targets.map(Gs),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: fr(e.rollRequests, Yo),
    rolls: fr(e.rolls, Vs),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(vn),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function vn(e) {
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
function zs(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function js(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Gs(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Yo(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Vs(e) {
  return {
    ...Yo(e),
    total: e.total
  };
}
function fr(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function Hs(e) {
  return {
    getSelected() {
      return Fe.getSelectedActor();
    },
    logResources() {
      const t = W(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      m.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && m.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await oe(
        e,
        "Gasto de PE",
        W("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await oe(
        e,
        "Gasto de PD",
        W("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await oe(
        e,
        "Dano em PV",
        W("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await oe(
        e,
        "Cura de PV",
        W("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await oe(
        e,
        "Dano em SAN",
        W("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await oe(
        e,
        "Recuperação de SAN",
        W("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function oe(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    Ws(o.error);
    return;
  }
  const i = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: i });
  } catch (s) {
    m.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  m.info(`${t} realizado:`, vn(i));
}
function W(e) {
  const t = Fe.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ws(e) {
  if (e.reason === "update-failed") {
    m.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    m.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  m.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const x = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Ks() {
  Ve(x.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Ve(x.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Ve(x.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Ve(x.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function nn() {
  return {
    enabled: He(x.enabled),
    console: He(x.console),
    ui: He(x.ui),
    chat: He(x.chat)
  };
}
async function q(e, t) {
  await game.settings.set(c, x[e], t);
}
function Ve(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function He(e) {
  return game.settings.get(c, e) === !0;
}
function Ys() {
  return {
    status() {
      return nn();
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
const Qo = "ritual.costOnly", Zo = "ritual.simpleHealing", Qs = "ritual.eletrocussao", Xo = "ritual.simpleDamage", Jo = "generic.simpleHealing", ea = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Zs() {
  return [
    Xs(),
    Js(),
    el(),
    tl(),
    nl()
  ];
}
function Xs() {
  return {
    id: Qo,
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
function Js() {
  return {
    id: Zo,
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
    automation: ta(),
    itemPatch: ol()
  };
}
function el() {
  return {
    id: Qs,
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
    automation: rl(),
    itemPatch: al()
  };
}
function tl() {
  return {
    id: Xo,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Pn()
  };
}
function nl() {
  return {
    id: Jo,
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
function ta(e = "2d8+2") {
  return na(
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
function rl() {
  return {
    ...Pn("3d6", {
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
function Pn(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", i = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return na(
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
          message: i
        }
      ]
    },
    "damage",
    e
  );
}
function ol() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: ea,
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
function al() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: ea,
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
function na(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Nn() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ie(t.id),
    actorId: ie(t.actor?.id),
    sceneId: ie(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function ra() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: ie(e.id),
    actorId: ie(t?.id),
    sceneId: ie(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ie(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function il(e) {
  return {
    logFirstRitualCost() {
      const t = K("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = Y(t);
      if (!n) return;
      const r = e.ritualCosts.getCost({ actor: t, ritual: n });
      if (!r.ok) {
        m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      m.info("Custo do primeiro ritual:", {
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
        if (!cl(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(c, "ritual.cost", {
          resource: n,
          amount: t
        }), m.info(`Custo customizado aplicado em ${o.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = K("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = Y(t);
      n && (await n.unsetFlag(c, "ritual.cost"), m.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = K("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = Y(t);
      if (!n) return;
      const r = e.automationRegistry.require(Qo);
      if (!r.ok) {
        m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), m.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = K("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = Y(n);
      if (!r) return;
      if (!pr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Zo);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: ta(t)
      }), m.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = K("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = Y(n);
      if (!r) return;
      if (!pr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Xo);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Pn(t)
      }), m.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = K("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = Y(t);
      n && await sl(e, t, n);
    }
  };
}
async function sl(e, t, n) {
  const r = Sn(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: ra(),
    item: n,
    targets: Nn()
  });
  if (!o.ok) {
    ll(o.error);
    return;
  }
  m.info("Automação de ritual executada com sucesso.", ee(o.value.context));
}
function ll(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    m.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    m.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  m.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function K(e) {
  const t = Fe.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Y(e) {
  const t = Ko(e);
  return t || (m.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function cl(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function pr(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const ul = ["disabled", "ask", "automatic"], dl = ["buttons", "confirm"], oa = "ask";
function ml(e) {
  return typeof e == "string" && ul.includes(e);
}
function fl(e) {
  return typeof e == "string" && dl.includes(e);
}
function pl(e) {
  return ml(e) ? e : fl(e) ? "ask" : oa;
}
const gl = ["keep", "replace"], hl = ["manual", "assisted"], aa = "keep", ia = "assisted", bl = !0, I = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function _l() {
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
    default: oa
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
    default: aa
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
    default: ia
  }), game.settings.register(c, I.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: bl
  }), game.settings.register(c, I.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function gr() {
  const e = pl(game.settings.get(c, I.executionMode)), t = la(game.settings.get(c, I.systemCardMode)), n = ca(game.settings.get(c, I.damageResolutionMode));
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: sa()
  };
}
function yl() {
  return la(game.settings.get(c, I.systemCardMode));
}
function Al() {
  return ca(game.settings.get(c, I.damageResolutionMode));
}
function sa() {
  return game.settings.get(c, I.ritualCastingCheckEnabled) === !0;
}
async function Q(e) {
  await game.settings.set(c, I.executionMode, e);
}
function la(e) {
  return gl.includes(e) ? e : aa;
}
function ca(e) {
  return hl.includes(e) ? e : ia;
}
function Tl(e) {
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
const $l = [
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
function Rl(e) {
  return {
    phases() {
      return $l;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = xt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Fs(t);
      if (!n) {
        m.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await hr(e, t, n);
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
      if (!El(n)) {
        m.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = kl(n) ?? xt("Nenhum ator encontrado para executar automação do item.");
      r && await hr(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = xt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Os(t);
      if (!n) {
        m.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Jo);
        if (!r.ok) {
          m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(n, r.value), m.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (r) {
        m.error("Falha ao configurar automação de teste no item.", r), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function hr(e, t, n) {
  const r = Sn(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: ra(),
    item: n,
    targets: Nn()
  });
  if (!o.ok) {
    wl(o.error);
    return;
  }
  m.info("Automação executada com sucesso.", ee(o.value.context));
}
function wl(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    m.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    m.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  m.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function xt(e) {
  const t = Fe.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function kl(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function El(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Cl(e) {
  const t = Hs(e), n = Bs(e), r = il(e), o = Rl(e), i = Ys(), s = Tl(e);
  return {
    actor: t,
    automation: n,
    ritual: r,
    workflow: o,
    output: i,
    itemUseIntegration: s,
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
function Il(e) {
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
      const r = br();
      if (r.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const o = await Promise.all(
        r.map(
          (i) => e.applyCondition({
            actor: i,
            conditionId: t,
            duration: n.duration,
            originUuid: n.originUuid,
            source: n.source ?? "api.applyToSelectedTokens",
            refreshExisting: n.refreshExisting
          })
        )
      );
      return Sl(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = br();
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
      return Ll(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function br() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const i = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(i, r);
  }
  return Array.from(t.values());
}
function Sl(e) {
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
function Ll(e) {
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
function Dl(e) {
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
    conditions: Il(e.conditions),
    debug: Cl(e)
  }, n = globalThis;
  return n[c] = t, n.ParanormalToolkit = t, t;
}
class _r {
  static isSupportedSystem() {
    return game.system.id === _s;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function vl() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: se(t.id),
    actorId: se(t.actor?.id),
    sceneId: se(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function ua() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: se(e.id),
    actorId: se(t?.id),
    sceneId: se(e.scene?.id),
    name: n
  };
}
function Pl(e, t = ua()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Nl(e) {
  if (!Fl(e)) return null;
  const t = e.getFlag(c, "workflow");
  return Ol(t) ? t : null;
}
function xl() {
  return `flags.${c}.workflow`;
}
function yr(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), n = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || n !== void 0;
}
function Ar(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return rn(t) || rn(n);
}
function Ol(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Fl(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function se(e) {
  return rn(e) ? e : null;
}
function rn(e) {
  return typeof e == "string" && e.length > 0;
}
function Ml() {
  const e = (t, n) => {
    Bl(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Bl(e, t) {
  const n = Nl(e);
  if (!n || n.targets.length === 0) return;
  const r = ql(t);
  if (!r || r.querySelector(`.${c}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Ul(n));
}
function Ul(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Tr("Origem", e.source.name)), t.append(Tr("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Tr(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${c}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function ql(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function zl() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!jl(r) || !Gl(e) || yr(e) || yr(t)) return;
    const o = vl();
    if (o.length === 0 || !Ar(e) && !Ar(t)) return;
    const i = ua();
    e.updateSource({
      [xl()]: Pl(o, i)
    }), m.info("Targets capturados para ChatMessage.", { source: i, targets: o });
  });
}
function jl(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Gl(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let $r = !1, Ot = !1, Ft = !1, We = null;
const Vl = 1e3, Hl = 750, Wl = 1e3;
function Kl(e) {
  $r || (Hooks.on("combatTurnChange", (t) => {
    Ql(e, Rr(t));
  }), Hooks.on("deleteCombat", (t) => {
    Zl(e, Rr(t));
  }), $r = !0, Yl(e));
}
function Yl(e) {
  _t() && (Ot || (Ot = !0, globalThis.setTimeout(() => {
    Ot = !1, xn(e, "ready");
  }, Vl)));
}
function Ql(e, t) {
  _t() && t && (We && globalThis.clearTimeout(We), We = globalThis.setTimeout(() => {
    We = null, xn(e, "combat-turn-change", t);
  }, Hl));
}
function Zl(e, t) {
  _t() && t && (Ft || (Ft = !0, globalThis.setTimeout(() => {
    Ft = !1, xn(e, "combat-deleted", t);
  }, Wl)));
}
async function xn(e, t, n) {
  if (_t())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && m.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const o of r.failures)
        m.warn(o.message);
    } catch (r) {
      m.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function _t() {
  return game.user?.isGM === !0;
}
function Rr(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const da = {
  enabled: "dice.animations.enabled"
};
function Xl() {
  game.settings.register(c, da.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Jl() {
  return {
    enabled: game.settings.get(c, da.enabled) === !0
  };
}
const yt = "chatCard", wr = "data-paranormal-toolkit-prompt-id", a = `${c}-item-use-prompt`, ec = `.${a}__title`, ma = `.${a}__header`, tc = `.${a}__roll-card`, nc = `.${a}__roll-meta`, rc = `.${a}__roll-meta-pill`, On = `.${a}__resistance`, oc = `.${a}__resistance-header`, fa = `.${a}__resistance-description`, At = `.${a}__resistance-roll-button`, pa = `.${a}__resistance-roll-result`, kr = `${a}__resistance-content`, ga = `.${a}__workflow-section`, ha = `.${a}__workflow-roll`, ba = `${a}__workflow-roll--dice-open`, _a = `.${a}__workflow-roll-formula`, ya = `${a}__workflow-roll-formula--toggle`, Fn = `.${a}__workflow-dice-tray`, ac = `.${a}__roll-detail-toggle`, ic = `.${a}__roll-detail-list`, sc = `.${a}__ritual-element-badge`, lc = `.${a}__ritual-metadata`, cc = "casting-backlash", uc = "data-paranormal-toolkit-action-section", dc = "data-paranormal-toolkit-prompt-id", mc = "data-paranormal-toolkit-pending-id", Er = "data-paranormal-toolkit-casting-backlash-enhanced", Cr = `.${a}`, fc = `.${a}__workflow-section--casting`, pc = `.${a}__workflow-section-header`, gc = `.${a}__workflow-notes`, hc = `[${uc}="${cc}"]`, Ir = `${a}__workflow-section-title-row`, bc = `${a}__workflow-section-header--casting-backlash`, Aa = `${a}__casting-backlash-button`;
function _c(e) {
  for (const t of yc(e))
    Ac(t), kc(t);
}
function yc(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Cr) && t.add(e);
  for (const n of e.querySelectorAll(Cr))
    t.add(n);
  return Array.from(t);
}
function Ac(e) {
  const t = e.querySelector(hc);
  if (!t) return;
  const n = Tc(t);
  if (!n) return;
  const r = e.querySelector(`${fc} ${pc}`);
  r && (r.classList.add(bc), $c(r), Rc(n), r.append(n), t.remove());
}
function Tc(e) {
  return e.querySelector(
    `button[${mc}], button[${dc}]`
  );
}
function $c(e) {
  const t = e.querySelector(`:scope > .${Ir}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Ir);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(Aa) || n.append(o));
  return n;
}
function Rc(e) {
  if (e.getAttribute(Er) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = wc(t, e.disabled);
  e.classList.add(Aa), e.setAttribute(Er, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function wc(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function kc(e) {
  for (const t of e.querySelectorAll(gc)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Ec(e) {
  for (const t of Array.from(e.querySelectorAll(ga)))
    for (const n of Array.from(t.querySelectorAll(`${ac}, ${ic}`)))
      n.remove();
}
const Ee = "data-paranormal-toolkit-prompt-id", Cc = "data-paranormal-toolkit-resistance-roll-result", Ic = "Conjuração DT";
function Ta(e) {
  const t = e.querySelector(At)?.getAttribute(Cc), n = ve(t);
  if (n !== null) return n;
  const r = e.querySelector(pa)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return ve(o?.[1] ?? null);
}
function Mn(e) {
  const t = Pc(e), n = Lc(t);
  if (n !== null) return n;
  const r = Dc(t);
  return r !== null ? r : vc(e);
}
function Sc(e) {
  const t = e.getAttribute(Ee);
  if (!t) return null;
  const n = Ra(e), r = wa(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Tt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function G(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function $a(e) {
  return G(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Lc(e) {
  const t = xc(e);
  return t.length === 0 ? null : ve(Oc(t, Ic));
}
function Dc(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : Sr(r, ["system", "ritual", "DT"]) ?? Sr(r, ["system", "ritual", "dt"]);
}
function vc(e) {
  const t = Array.from(e.querySelectorAll(`.${a}__workflow-section--casting .${a}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return ve(n?.[1] ?? null);
}
function Pc(e) {
  const t = Nc(e);
  if (!t) return null;
  const n = Ra(e), r = wa(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((i) => Tt(i) ? i.pendingId === t : !1) ?? null;
}
function Nc(e) {
  return (e.closest(`[${Ee}]`) ?? e.querySelector(`[${Ee}]`) ?? e.parentElement?.querySelector(`[${Ee}]`) ?? null)?.getAttribute(Ee) ?? null;
}
function Ra(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return Fc(o) ? o : null;
}
function wa(e) {
  const t = e?.getFlag?.(c, yt);
  return Tt(t) ? t : null;
}
function xc(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Oc(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function Sr(e, t) {
  let n = e;
  for (const r of t) {
    if (!Tt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : ve(typeof n == "string" ? n : null);
}
function ve(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Fc(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Tt(e) {
  return !!(e && typeof e == "object");
}
const Mc = `.${a}__actions`, Bn = `.${a}__actions-title`, st = `.${a}__button`, Bc = "data-paranormal-toolkit-action-section", Uc = `${a}__button--executed`, qc = "data-paranormal-toolkit-executed-label";
function ka(e) {
  return G(e.querySelector(Bn)?.textContent);
}
function zc(e, t) {
  const n = e.querySelector(Bn);
  n && (n.textContent = t);
}
function $t(e, t) {
  const n = G(t);
  return Array.from(e.querySelectorAll(`.${a}__workflow-section`)).find((r) => {
    const o = r.querySelector(`.${a}__workflow-section-header strong`)?.textContent;
    return G(o) === n;
  }) ?? null;
}
function Un(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${a}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Be(e) {
  const t = document.createElement("span");
  return t.classList.add(`${a}__button-label`), t.textContent = e, t;
}
const jc = "data-paranormal-toolkit-damage-resolution-state", Lr = "data-paranormal-toolkit-damage-icon-enhanced", Gc = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function Vc(e, t) {
  t.classList.add(`${a}__actions--embedded`, `${a}__actions--damage-resolution`), zc(t, "Aplicar dano"), Hc(e, t);
}
function Hc(e, t) {
  const n = Array.from(t.querySelectorAll(st)), r = Dr(n, "normal"), o = Dr(n, "half");
  if (!r || !o) {
    t.classList.add(`${a}__actions--compact`);
    return;
  }
  vr(r, "normal"), vr(o, "half");
  const i = Wc();
  if (t.classList.toggle(`${a}__actions--assisted`, i === "assisted"), t.classList.toggle(`${a}__actions--manual`, i !== "assisted"), i !== "assisted") {
    z(r, !0), z(o, !0), Ke(t, "manual", null);
    return;
  }
  const s = Ta(e), l = Mn(e);
  if (l === null) {
    z(r, !0), z(o, !0), Ke(t, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (s === null) {
    z(r, !0), z(o, !1), Ke(t, "pending", null);
    return;
  }
  const u = s >= l;
  z(r, !u), z(o, u), Ke(
    t,
    u ? "resisted" : "failed",
    u ? `Resistiu: ${s} vs DT ${l}.` : `Falhou: ${s} vs DT ${l}.`
  );
}
function Dr(e, t) {
  const n = Gc[t];
  return e.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function vr(e, t) {
  if (e.getAttribute(Lr) === "true") return;
  const n = e.textContent?.trim() ?? "";
  if (!n || n.startsWith("✓")) return;
  const r = document.createElement("i");
  r.classList.add(
    "fa-solid",
    t === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${a}__button-icon`
  ), r.setAttribute("aria-hidden", "true"), e.classList.add(
    `${a}__button--damage-resolution-action`,
    `${a}__button--damage-resolution-${t}`
  ), e.setAttribute(Lr, "true"), e.setAttribute("aria-label", n), e.replaceChildren(r, Be(n));
}
function z(e, t) {
  e.hidden = !t, e.classList.toggle(`${a}__button--damage-resolution-selected`, t);
}
function Ke(e, t, n) {
  e.setAttribute(jc, t);
  const r = e.querySelector(`.${a}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${a}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(Bn)?.after(o);
}
function Wc() {
  try {
    return Al();
  } catch {
    return "assisted";
  }
}
const Pe = "data-paranormal-toolkit-effect-icon-enhanced", fe = "data-paranormal-toolkit-effect-action-compacted", Rt = "data-paranormal-toolkit-effect-resistance-gate", qn = "data-paranormal-toolkit-effect-section", zn = "data-paranormal-toolkit-effect-label";
function Kc(e) {
  return e.querySelector(`[${qn}="true"]`);
}
function Yc(e) {
  const t = Zc(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? Xc(), r = su(n, e.sourceActions, t);
  return r && n.setAttribute(zn, r), Jc(n, t, r), au(e.rollCard, n, e.after ?? e.fallbackAfter), iu(e.sourceActions, n), n;
}
function Qc(e, t) {
  const n = t.querySelector(st);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (Ca(n, r)) {
    cu(n);
    return;
  }
  const o = Sa(t, n, r);
  if (!uu(e, o)) {
    La(n);
    return;
  }
  const i = Mn(e), s = Ta(e);
  if (i === null || s === null) {
    du(n);
    return;
  }
  if (s >= i) {
    mu(n);
    return;
  }
  fu(n, o);
}
function Zc(e) {
  return e.sourceActions?.querySelector(st) ?? e.existingSection?.querySelector(st) ?? null;
}
function Xc() {
  const e = document.createElement("section");
  return e.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-action`
  ), e.setAttribute(qn, "true"), e;
}
function Jc(e, t, n) {
  e.setAttribute(qn, "true"), e.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-action`
  ), e.classList.remove(`${a}__actions`, `${a}__actions--effect-resolution`);
  const r = eu(e), o = tu(r);
  o.textContent = "Efeito";
  const i = nu(e, r), s = ru(i);
  s.textContent = pu(n ?? Sa(e, t, t.textContent?.trim() ?? ""));
  const l = ou(i);
  t.parentElement !== l && l.append(t);
  const u = t.textContent?.trim() ?? "";
  !Ca(t, u) && !lu(t, u) && Ia(t, n ?? u);
}
function eu(e) {
  const t = e.querySelector(`:scope > .${a}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${a}__workflow-section-header`), e.prepend(n), n;
}
function tu(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function nu(e, t) {
  const n = e.querySelector(`:scope > .${a}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${a}__effect-section-body`), t.after(r), r;
}
function ru(e) {
  const t = e.querySelector(`:scope > .${a}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${a}__effect-section-label`), e.prepend(n), n;
}
function ou(e) {
  const t = e.querySelector(`:scope > .${a}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${a}__effect-section-action`), e.append(n), n;
}
function au(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function iu(e, t) {
  !e || e === t || e.remove();
}
function su(e, t, n) {
  const r = e.getAttribute(zn);
  if (r && r.trim().length > 0) return r.trim();
  const o = t?.querySelector(`.${a}__effect-resolution-label`)?.textContent?.trim();
  return o || Ea(n, n.textContent?.trim() ?? "");
}
function Ea(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && G(n) !== "efeito aplicado") return n;
  const r = Sc(e);
  if (r) return r;
  const o = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && G(o) !== "aplicado" ? o : null;
}
function Ca(e, t) {
  return e.classList.contains(Uc) || G(t).includes("aplicado");
}
function lu(e, t) {
  const n = e.getAttribute(Rt);
  if (n === "pending" || n === "resisted") return !0;
  const r = $a(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function Ia(e, t) {
  e.getAttribute(fe) === "true" && e.getAttribute(Pe) === "true" || (e.disabled = !1, e.classList.add(`${a}__button--effect-resolution-action`), e.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), e.setAttribute(fe, "true"), e.setAttribute(Pe, "true"), e.setAttribute(qc, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Un("✦", `${a}__button-icon--effect`),
    Be("Aplicar")
  ));
}
function cu(e) {
  e.getAttribute(fe) === "true" && G(e.textContent) === "✓ aplicado" || (e.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-applied`), e.classList.remove(
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), e.setAttribute(fe, "true"), e.setAttribute(Pe, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Un("✓", `${a}__button-icon--effect-applied`),
    Be("Aplicado")
  ));
}
function Sa(e, t, n) {
  const r = e.getAttribute(zn) ?? e.querySelector(`.${a}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Ea(t, n) ?? n;
}
function uu(e, t) {
  if (!e.querySelector(On)) return !1;
  const n = $a(t);
  return n.includes("vulneravel") || n.includes("vulnerable");
}
function du(e) {
  e.disabled = !0, e.removeAttribute(fe), e.removeAttribute(Pe), e.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-resisted`
  ), e.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-waiting`), e.setAttribute(Rt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Be("Role resistência"));
}
function mu(e) {
  e.disabled = !0, e.removeAttribute(fe), e.removeAttribute(Pe), e.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-waiting`
  ), e.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-resisted`), e.setAttribute(Rt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Un("✓", `${a}__button-icon--effect-resisted`),
    Be("Resistiu")
  );
}
function fu(e, t) {
  La(e), Ia(e, t);
}
function La(e) {
  e.classList.remove(
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), e.removeAttribute(Rt);
}
function pu(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
async function Da(e, t) {
  const n = await gu(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: bu(n),
    total: _u(n),
    diceBreakdown: yu(n)
  };
}
function Ue(e) {
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
async function gu(e, t) {
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
  return hu(r);
}
function hu(e) {
  return Pr(e) ? e : Array.isArray(e) ? e.find(Pr) ?? null : null;
}
function Pr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function bu(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function _u(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function yu(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Au);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((i) => {
    if (!i || typeof i != "object") return [];
    const s = i.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Au(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Ye = "data-paranormal-toolkit-prompt-id", Je = "multiTargetResistanceResults";
function Tu(e) {
  const t = /* @__PURE__ */ new Map(), r = Ru(e)?.[Je];
  if (!pe(r)) return t;
  for (const [o, i] of Object.entries(r))
    wu(i) && i.targetId === o && t.set(o, i);
  return t;
}
async function $u(e, t) {
  const n = va(e);
  if (!n) return;
  const r = Pa(e), o = Na(r);
  if (!r || !o || !Array.isArray(o.prompts)) return;
  let i = !1;
  const s = o.prompts.map((l) => {
    if (!pe(l) || l.pendingId !== n) return l;
    const u = pe(l[Je]) ? l[Je] : {};
    return i = !0, {
      ...l,
      [Je]: {
        ...u,
        [t.targetId]: t
      }
    };
  });
  i && await Promise.resolve(r.setFlag?.(c, yt, {
    ...o,
    prompts: s
  }));
}
function Ru(e) {
  const t = va(e);
  if (!t) return null;
  const n = Pa(e), r = Na(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((i) => pe(i) ? i.pendingId === t : !1) ?? null;
}
function va(e) {
  return (e.closest(`[${Ye}]`) ?? e.querySelector(`[${Ye}]`) ?? e.parentElement?.querySelector(`[${Ye}]`) ?? null)?.getAttribute(Ye) ?? null;
}
function Pa(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return ku(o) ? o : null;
}
function Na(e) {
  const t = e?.getFlag?.(c, yt);
  return pe(t) ? t : null;
}
function wu(e) {
  return pe(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function ku(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function pe(e) {
  return !!(e && typeof e == "object");
}
const xa = "data-paranormal-toolkit-resistance-skill", Oa = "data-paranormal-toolkit-resistance-skill-label", on = "data-paranormal-toolkit-multi-target-section", Fa = "data-paranormal-toolkit-multi-target-effect-info", Ma = "data-paranormal-toolkit-multi-target-toggle", Ba = "data-paranormal-toolkit-multi-target-details", Ne = "data-paranormal-toolkit-multi-target-target", Eu = "data-paranormal-toolkit-multi-target-state", an = "data-paranormal-toolkit-multi-target-roll-total", sn = "data-paranormal-toolkit-multi-target-roll-formula", et = "data-paranormal-toolkit-multi-target-roll-dice", ln = "data-paranormal-toolkit-multi-target-roll-skill", cn = "data-paranormal-toolkit-multi-target-roll-skill-label", un = "data-paranormal-toolkit-multi-target-roll-target-name", dn = "data-paranormal-toolkit-multi-target-roll-rolled-at", Ua = "pending", ne = "success", wt = "failure", qa = "rolled";
function Cu(e) {
  const t = za(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${a}__roll-card--multi-target`), Ou(e);
  const n = Fu(e.rollCard);
  if (ja(n, t), rd(e.rollCard, n), t.effect) {
    const r = od(e.rollCard);
    ad(r, t.effect), id(e.rollCard, r, n);
  } else
    Ka(e.rollCard)?.remove();
  return !0;
}
function za(e) {
  const t = Du(e.rollCard, e.damageSection), n = vu(e.rollCard), r = Iu(e.rollCard).map((o, i) => {
    const s = dd(o, i), l = n.get(s) ?? null;
    return {
      id: s,
      name: o,
      state: Nu(l, t?.difficulty ?? null),
      resistanceResult: l
    };
  });
  return r.length <= 1 || !e.damageSection ? null : {
    rollCard: e.rollCard,
    targets: r,
    damage: Su(e.damageSection),
    effect: Lu(e.effectSection),
    resistance: t
  };
}
function Iu(e) {
  const n = e.closest(`.${a}`)?.querySelector(`.${a}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((o) => o.trim()).filter((o) => o.length > 0 && Qa(o) !== "nenhum alvo") : [];
}
function Su(e) {
  const t = xu(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Lu(e) {
  const t = e?.querySelector(`.${a}__effect-section-label`)?.textContent?.trim();
  return t && t.length > 0 ? { label: t } : null;
}
function Du(e, t) {
  const n = t?.querySelector(`.${a}__resistance-description`)?.textContent?.trim(), r = t?.querySelector(At) ?? null, o = r?.getAttribute(xa) ?? null, i = r?.getAttribute(Oa) ?? (o ? Ue(o) : null);
  return !n && !o ? null : {
    description: n ?? "Resistência do alvo.",
    formula: t?.querySelector(`.${a}__resistance .${a}__workflow-roll-formula`)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: i,
    difficulty: Mn(e)
  };
}
function vu(e) {
  const t = Tu(e);
  for (const [n, r] of Pu(e))
    t.set(n, r);
  return t;
}
function Pu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${Ne}]`)) {
    const r = n.getAttribute(Ne), o = fd(n.getAttribute(an)), i = n.getAttribute(sn), s = n.getAttribute(ln), l = n.getAttribute(cn), u = n.getAttribute(un), d = n.getAttribute(dn);
    !r || o === null || !i || !s || !l || !u || !d || t.set(r, {
      targetId: r,
      targetName: u,
      skill: s,
      skillLabel: l,
      formula: i,
      total: o,
      diceBreakdown: n.getAttribute(et),
      rolledAt: d
    });
  }
  return t;
}
function Nu(e, t) {
  return e ? t === null ? qa : e.total >= t ? ne : wt : Ua;
}
function xu(e) {
  const t = e?.querySelector(`.${a}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Ou(e) {
  e.damageSection?.classList.add(`${a}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${a}__workflow-section--multi-target-effect-source`);
}
function Fu(e) {
  const t = e.querySelector(`[${on}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--targets`
  ), n.setAttribute(on, "true"), n;
}
function ja(e, t) {
  const n = Mu(e);
  e.replaceChildren(Bu(t), qu(t, n));
}
function Mu(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${Ne}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(Ne)).filter(md)
  );
}
function Bu(e) {
  const t = document.createElement("div");
  t.classList.add(`${a}__workflow-section-header`, `${a}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${a}__targets-status`), r.textContent = Uu(e.targets), t.append(n, r), t;
}
function Uu(e) {
  const t = e.length, n = e.filter((l) => l.state === wt).length, r = e.filter((l) => l.state === ne).length, o = e.filter((l) => l.state === Ua).length, i = e.filter((l) => l.state === qa).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), o > 0 && s.push(`${o} ${o === 1 ? "pendente" : "pendentes"}`), i > 0 && s.push(`${i} ${i === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function qu(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${a}__targets-list`);
  for (const r of e.targets)
    n.append(zu(r, e, t.has(r.id)));
  return n;
}
function zu(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${a}__target-row`, `${a}__target-row--${e.state}`), r.setAttribute(Ne, e.id), r.setAttribute(Eu, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Ga(r, e.resistanceResult);
  const o = ju(e, t, r), i = Xu(e, t);
  return i.hidden = !n, r.addEventListener("click", (s) => {
    xr(s.target) || Nr(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || xr(s.target) || (s.preventDefault(), Nr(r));
  }), r.append(o, i), r;
}
function Ga(e, t) {
  if (!t) {
    e.removeAttribute(an), e.removeAttribute(sn), e.removeAttribute(et), e.removeAttribute(ln), e.removeAttribute(cn), e.removeAttribute(un), e.removeAttribute(dn);
    return;
  }
  e.setAttribute(an, String(t.total)), e.setAttribute(sn, t.formula), e.setAttribute(ln, t.skill), e.setAttribute(cn, t.skillLabel), e.setAttribute(un, t.targetName), e.setAttribute(dn, t.rolledAt), t.diceBreakdown ? e.setAttribute(et, t.diceBreakdown) : e.removeAttribute(et);
}
function ju(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${a}__target-summary`);
  const o = document.createElement("div");
  o.classList.add(`${a}__target-summary-main`);
  const i = Gu(e), s = document.createElement("strong");
  s.classList.add(`${a}__target-name`), s.textContent = e.name;
  const l = Vu(e, t.resistance);
  Wu(l, n, e, t);
  const u = Zu(n);
  o.append(i, s, l, u);
  const d = document.createElement("div");
  return d.classList.add(`${a}__target-summary-actions`), d.append(
    Va(e, t, "compact"),
    Ha(e, t, "compact")
  ), r.append(o, d), r;
}
function Gu(e) {
  const t = document.createElement("span");
  return t.classList.add(`${a}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Vu(e, t) {
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${a}__target-resistance-button`, `${a}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Hu(e, t)), t?.skill && (n.setAttribute(xa, t.skill), n.setAttribute(Oa, t.skillLabel ?? Ue(t.skill))), !t?.skill)
    return n.disabled = !0, n.title = "Resistência não configurada", n.textContent = "—", n;
  if (n.title = e.resistanceResult ? `Rolar ${t.skillLabel ?? t.skill} novamente` : `Rolar ${t.skillLabel ?? t.skill} de ${e.name}`, !e.resistanceResult) {
    const i = document.createElement("i");
    i.classList.add("fa-solid", "fa-dice-d20"), i.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    return s.classList.add(`${a}__target-resistance-fallback`), s.textContent = "d20", n.append(i, s), n;
  }
  const r = document.createElement("span");
  r.classList.add(`${a}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const o = document.createElement("span");
  return o.classList.add(`${a}__target-resistance-mark`), o.setAttribute("aria-hidden", "true"), o.textContent = e.state === ne ? "✓" : e.state === wt ? "✕" : "", n.append(r, o), n;
}
function Hu(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === ne ? "sucesso" : e.state === wt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Wu(e, t, n, r) {
  e.addEventListener("click", (o) => {
    o.stopPropagation(), Ku(t, e, n, r);
  });
}
async function Ku(e, t, n, r) {
  const o = r.resistance, i = o?.skill, s = o?.skillLabel ?? (i ? Ue(i) : "Resistência");
  if (!i) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = sd(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${a}__target-resistance-button--rolling`);
  const u = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Da(l, i);
    await ud(d.roll);
    const f = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      skill: i,
      skillLabel: s,
      formula: d.formula,
      total: d.total,
      diceBreakdown: d.diceBreakdown,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Ga(e, f);
    try {
      await $u(r.rollCard, f);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", y);
    }
    Yu(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = u;
  } finally {
    t.disabled = !1, t.classList.remove(`${a}__target-resistance-button--rolling`);
  }
}
function Yu(e) {
  const t = e.closest(`[${on}="true"]`), n = e.closest(`.${a}__roll-card`);
  if (!t || !n) return;
  const r = za({
    rollCard: n,
    damageSection: $t(n, "Dano"),
    effectSection: Qu(n)
  });
  r && ja(t, r);
}
function Qu(e) {
  return e.querySelector(`.${a}__workflow-section--multi-target-effect-source`);
}
function Va(e, t, n) {
  const r = e.state === ne && t.damage.halfLabel && t.damage.halfCompactLabel, o = r ? n === "full" ? t.damage.halfLabel ?? "Metade: —" : t.damage.halfCompactLabel ?? "½ —" : n === "full" ? t.damage.normalLabel : t.damage.normalCompactLabel, i = r ? "🛡" : "⚡", s = r ? `${a}__target-action--half-damage` : `${a}__target-action--normal-damage`;
  return tt(i, o, `${a}__target-action--damage`, s);
}
function Ha(e, t, n) {
  return t.effect ? e.state === ne ? tt(
    "✓",
    n === "full" ? "Resistiu ao efeito" : "Resistiu",
    `${a}__target-action--effect`,
    `${a}__target-action--resisted`
  ) : tt(
    "✦",
    n === "full" ? "Aplicar efeito" : "Efeito",
    `${a}__target-action--effect`,
    `${a}__target-action--pending-effect`
  ) : tt("✦", "Sem efeito", `${a}__target-action--effect`, `${a}__target-action--disabled`);
}
function tt(e, t, ...n) {
  const r = document.createElement("button");
  r.type = "button", r.classList.add(`${a}__target-action`, `${a}__target-action--pending`, ...n), r.disabled = !0;
  const o = document.createElement("span");
  o.classList.add(`${a}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const i = document.createElement("span");
  return i.classList.add(`${a}__target-action-label`), i.textContent = t, r.append(o, i), r;
}
function Zu(e) {
  const t = document.createElement("span");
  return t.classList.add(`${a}__target-toggle`), t.setAttribute(Ma, "true"), t.setAttribute("aria-hidden", "true"), Wa(e, t), t;
}
function Nr(e) {
  const t = e.querySelector(`[${Ba}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Ma}="true"]`);
  r && Wa(e, r);
}
function Wa(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function xr(e) {
  return e instanceof HTMLElement && !!e.closest("button, a, input, select, textarea");
}
function Xu(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${a}__target-details`), n.setAttribute(Ba, "true");
  const r = document.createElement("div");
  r.classList.add(`${a}__target-resistance-details`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const i = document.createElement("span");
  i.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(o, i);
  const s = Ju(e, t.resistance);
  s && r.append(s);
  const l = td(ed(e, t.resistance)), u = nd(e, t);
  return n.append(r, l, u), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Ju(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${a}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === ne ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function ed(e, t) {
  if (e.resistanceResult) {
    const n = e.resistanceResult.diceBreakdown ? ` ${e.resistanceResult.diceBreakdown}` : "";
    return `${e.resistanceResult.formula}${n} = ${e.resistanceResult.total}`;
  }
  return t?.skillLabel ? `Clique no d20 para rolar ${t.skillLabel}` : t?.formula ?? "—";
}
function td(e) {
  const t = document.createElement("div");
  t.classList.add(`${a}__target-formula`);
  const n = document.createElement("span");
  n.textContent = e;
  const r = document.createElement("i");
  return r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true"), t.append(n, r), t;
}
function nd(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${a}__target-details-actions`), n.append(
    Va(e, t, "full"),
    Ha(e, t, "full")
  ), n;
}
function rd(e, t) {
  const n = $t(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function od(e) {
  const t = Ka(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-info`
  ), n.setAttribute(Fa, "true"), n;
}
function Ka(e) {
  return e.querySelector(`[${Fa}="true"]`);
}
function ad(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${a}__workflow-section-header`);
  const r = document.createElement("strong");
  r.textContent = "Efeito", n.append(r);
  const o = document.createElement("div");
  o.classList.add(`${a}__effect-info-body`);
  const i = document.createElement("span");
  i.classList.add(`${a}__effect-info-label`), i.textContent = t.label;
  const s = document.createElement("span");
  s.classList.add(`${a}__effect-info-hint`), s.textContent = "Aplicação por alvo", o.append(i, s), e.append(n, o);
}
function id(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function sd(e) {
  const t = Mt(e);
  if (!t) return null;
  const n = ld().filter((i) => Mt(cd(i)) === t).map((i) => Ya(i)).find(Le) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((i) => Le(i) && Mt(i.name) === t);
  return Le(o) ? o : null;
}
function ld() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function cd(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ya(e)?.name ?? null;
}
function Ya(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Le(t)) return t;
  const n = e.document?.actor;
  return Le(n) ? n : null;
}
function Le(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Mt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function ud(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function dd(e, t) {
  return `${t}-${Qa(e).replace(/[^a-z0-9]+/gu, "-")}`;
}
function Qa(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function md(e) {
  return typeof e == "string" && e.length > 0;
}
function fd(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const le = "data-paranormal-toolkit-prompt-id", pd = "data-paranormal-toolkit-card-layout-normalized", Or = "data-paranormal-toolkit-card-layout-refresh-bound", gd = "apply-damage", Za = [0, 80, 180, 400, 900, 1600, 3e3], Fr = /* @__PURE__ */ new WeakSet();
function hd(e) {
  Xa(e), bd(e);
}
function Xa(e) {
  for (const t of Array.from(e.querySelectorAll(`.${a}__roll-card`)))
    ei(Ja(t));
}
function bd(e) {
  if (!Fr.has(e)) {
    Fr.add(e);
    for (const t of Za)
      globalThis.setTimeout(() => {
        Xa(e);
      }, t);
  }
}
function Ja(e) {
  return {
    rollCard: e,
    damageSection: $t(e, "Dano"),
    resistance: e.querySelector(On),
    damageActions: _d(e),
    effectActionSource: yd(e),
    effectSection: Kc(e)
  };
}
function ei(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: o,
    effectActionSource: i,
    effectSection: s
  } = e;
  t.setAttribute(pd, "true"), t.classList.add(`${a}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), Vc(t, o));
  const l = Yc({
    rollCard: t,
    existingSection: s,
    sourceActions: i,
    after: n,
    fallbackAfter: $t(t, "Conjuração")
  });
  l && Qc(t, l), Cu({
    rollCard: t,
    damageSection: n,
    effectSection: l ?? s
  }), Ed(t);
}
function _d(e) {
  const t = Ad(e);
  return t.find((n) => n.getAttribute(Bc) === gd) ?? t.find((n) => ka(n) === "aplicar danos") ?? null;
}
function yd(e) {
  const t = ti(e), n = Mr(t);
  return n || Mr(Td(e));
}
function Mr(e) {
  return e.find((t) => {
    const n = ka(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function Ad(e) {
  const t = ti(e);
  return t.length > 0 ? t : jn(e);
}
function ti(e) {
  const t = wd(e);
  return t ? jn(e).filter((n) => Rd(n, t)) : [];
}
function Td(e) {
  const t = ni(e);
  if (!t) return [];
  const n = $d(e, t);
  return jn(e).filter((r) => !r.closest(`.${a}__roll-card`)).filter((r) => ri(e, r)).filter((r) => !n || kd(r, n));
}
function jn(e) {
  const t = ni(e);
  return t ? Array.from(t.querySelectorAll(Mc)) : [];
}
function ni(e) {
  return e.closest(`.${a}`) ?? e.parentElement;
}
function $d(e, t) {
  return Array.from(t.querySelectorAll(`.${a}__roll-card`)).find((n) => n !== e && ri(e, n)) ?? null;
}
function Rd(e, t) {
  return e.getAttribute(le) === t ? !0 : Array.from(e.querySelectorAll(`[${le}]`)).some((n) => n.getAttribute(le) === t);
}
function wd(e) {
  return e.getAttribute(le) ?? e.querySelector(`[${le}]`)?.getAttribute(le) ?? null;
}
function ri(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function kd(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Ed(e) {
  const t = e.querySelector(At);
  t && t.getAttribute(Or) !== "true" && (t.setAttribute(Or, "true"), t.addEventListener("click", () => {
    for (const n of Za)
      globalThis.setTimeout(() => {
        ei(Ja(e));
      }, n);
  }));
}
const Cd = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function Id(e) {
  for (const t of Array.from(e.querySelectorAll(On)))
    Sd(t);
  hd(e);
}
function Sd(e) {
  const t = e.querySelector(oc), n = e.querySelector(fa), r = e.querySelector(At), o = e.querySelector(pa);
  if (!r || !t && !n && !o) return;
  const i = Ld(e, r);
  t && t.parentElement !== i && i.append(t), n && n.parentElement !== i && i.append(n), o && (o.parentElement !== e && !r.contains(o) && e.append(o), Dd(o)), r.parentElement !== e && e.append(r);
}
function Ld(e, t) {
  const n = e.querySelector(`.${kr}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(kr), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function Dd(e) {
  const t = vd(e.textContent ?? "");
  t && (e.setAttribute(Cd, "true"), e.replaceChildren(xd(t)));
}
function vd(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, i = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: u } = Pd(r ?? "");
  return l ? {
    skillLabel: i,
    formula: l,
    total: Math.trunc(s),
    diceValues: u
  } : null;
}
function Pd(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Nd(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Nd(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function xd(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${a}__workflow-roll`,
    `${a}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${a}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Od(e);
  return r && t.append(r), t;
}
function Od(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${a}__workflow-dice-tray`);
  for (const n of Fd(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${a}__workflow-die`), n.active || r.classList.add(`${a}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Fd(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Br(e, "highest") : n.includes("kl") ? Br(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Br(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const i = !r && o === n;
    return i && (r = !0), { value: o, active: i };
  });
}
function Ur(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Gn() {
  const e = globalThis.game;
  return kt(e) ? e : null;
}
function L(e, t) {
  const n = Md(e, t);
  return nt(n);
}
function Md(e, t) {
  return t.split(".").reduce((n, r) => kt(n) ? n[r] : null, e);
}
function Bd(e, t) {
  const n = e.indexOf(":");
  return n < 0 || xe(e.slice(0, n)) !== xe(t) ? null : be(e.slice(n + 1));
}
function nt(e) {
  return typeof e == "string" ? be(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function kt(e) {
  return !!e && typeof e == "object";
}
function Ud(e) {
  return typeof e == "string";
}
function Et(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function be(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function xe(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function mn(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function V(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function oi(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function qd(e) {
  for (const t of Array.from(e.querySelectorAll(tc))) {
    const n = Kd(t);
    zd(t), n && (jd(t, n), Gd(t, n));
  }
}
function zd(e) {
  for (const t of Array.from(e.querySelectorAll(nc)))
    t.remove();
}
function jd(e, t) {
  const r = e.closest(`.${a}`)?.querySelector(ma) ?? null, o = r?.querySelector(ec) ?? null, i = r ?? e, s = i.querySelector(sc);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = dm(t.elementTone), l.textContent = um(t), !s) {
    if (o?.parentElement === i) {
      o.insertAdjacentElement("afterend", l);
      return;
    }
    i.prepend(l);
  }
}
function Gd(e, t) {
  const n = Vd(e);
  Hd(e, n);
  const r = Wd(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${a}__ritual-metadata`);
  for (const s of r) {
    const l = document.createElement("span");
    l.classList.add(`${a}__ritual-metadata-chip`), l.textContent = s, o.append(l);
  }
  if (n) {
    const s = n.querySelector(`.${a}__summary`);
    if (s?.parentElement === n) {
      s.insertAdjacentElement("afterend", o);
      return;
    }
    n.append(o);
    return;
  }
  const i = e.querySelector(ga);
  if (i) {
    e.insertBefore(o, i);
    return;
  }
  e.prepend(o);
}
function Vd(e) {
  return e.closest(`.${a}`)?.querySelector(ma) ?? null;
}
function Hd(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(lc)))
      o.remove();
}
function Wd(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${mn(e.target)}` : null,
    e.duration ? `Duração: ${mn(e.duration)}` : null,
    e.resistance ? `Resistência: ${oi(e.resistance)}` : null
  ].filter(Et);
}
function Kd(e) {
  const t = Yd(e), n = tm(e), o = (t ? em(t) : null)?.system ?? null, i = t?.summaryLines ?? [], s = Vn(L(o, "element")), l = F("op.elementChoices", s) ?? qr(X(i, "Elemento")) ?? qr(n.damageType), u = s ?? mm(l), d = L(o, "circle") ?? X(i, "Círculo"), f = om(o) ?? X(i, "Alvo"), y = lm(o, "duration", "op.durationChoices") ?? X(i, "Duração"), T = nm(e) ?? im(o) ?? X(i, "Resistência"), $ = rm(i) ?? n.cost, g = {
    elementLabel: l,
    elementTone: u,
    circle: d,
    cost: $,
    target: f,
    duration: y,
    resistance: T
  };
  return cm(g) ? g : null;
}
function Yd(e) {
  const t = Qd(e);
  if (!t) return null;
  const n = t.getFlag?.(c, yt), r = Xd(n);
  if (r.length === 0) return null;
  const o = Zd(e);
  if (o.size > 0) {
    const i = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (i) return i;
  }
  return r.find((i) => i.itemId || i.summaryLines.length > 0) ?? null;
}
function Qd(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Gn()?.messages?.get?.(n) ?? null : null;
}
function Zd(e) {
  const t = e.closest(`.${a}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${wr}]`))) {
    const o = r.getAttribute(wr)?.trim();
    o && n.add(o);
  }
  return n;
}
function Xd(e) {
  if (!kt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Jd).filter((n) => n !== null) : [];
}
function Jd(e) {
  return kt(e) ? {
    pendingId: nt(e.pendingId),
    actorId: nt(e.actorId),
    itemId: nt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Ud) : []
  } : null;
}
function em(e) {
  if (!e.itemId) return null;
  const t = Gn(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function tm(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(rc))) {
    const o = be(r.textContent);
    if (!o) continue;
    const i = Bd(o, "Tipo");
    i && (n = i), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function nm(e) {
  const t = be(e.querySelector(fa)?.textContent);
  return t ? oi(t) : null;
}
function X(e, t) {
  const n = xe(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || xe(r.slice(0, o)) !== n))
      return be(r.slice(o + 1));
  }
  return null;
}
function rm(e) {
  const t = X(e, "Custo") ?? X(e, "PE");
  return t || (e.map(be).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function om(e) {
  const t = L(e, "target");
  if (!t) return null;
  if (t === "area")
    return am(e) ?? F("op.targetChoices", t) ?? "Área";
  const n = F("op.targetChoices", t) ?? V(t);
  return [t === "people" || t === "creatures" ? L(e, "targetQtd") : null, n].filter(Et).join(" ");
}
function am(e) {
  const t = L(e, "area.name"), n = L(e, "area.size"), r = L(e, "area.type"), o = t ? F("op.areaChoices", t) ?? V(t) : null, i = r ? F("op.areaTypeChoices", r) ?? V(r) : null;
  return o ? n ? i ? `${o} ${n}m ${mn(i)}` : `${o} ${n}m` : o : null;
}
function im(e) {
  const t = L(e, "skillResis"), n = L(e, "resistance");
  if (!t || !n) return null;
  const r = F("op.skill", t) ?? V(t), o = sm(n);
  return [r, o].filter(Et).join(" ");
}
function sm(e) {
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
      return F("op.resistanceChoices", e) ?? V(e);
  }
}
function lm(e, t, n) {
  const r = L(e, t);
  return r ? F(n, r) ?? V(r) : null;
}
function cm(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function um(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function dm(e) {
  return [
    `${a}__ritual-element-badge`,
    e ? `${a}__ritual-element-badge--${e}` : null
  ].filter(Et).join(" ");
}
function Vn(e) {
  const t = xe(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function qr(e) {
  const t = Vn(e);
  return t ? F("op.elementChoices", t) ?? V(t) : e ? V(e) : null;
}
function mm(e) {
  return Vn(e);
}
function F(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Gn()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const zr = "data-paranormal-toolkit-dice-toggle-enhanced";
function fm(e) {
  for (const t of Array.from(e.querySelectorAll(ha)))
    ai(t);
}
function pm(e) {
  const t = si(e.target);
  if (!t) return;
  const n = Hn(t);
  n && (e.preventDefault(), ii(n, t));
}
function gm(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = si(e.target);
  if (!t) return;
  const n = Hn(t);
  n && (e.preventDefault(), ii(n, t));
}
function ai(e) {
  const t = e.querySelector(Fn);
  if (!t) return;
  const n = e.querySelector(_a);
  if (n && n.getAttribute(zr) !== "true" && (n.setAttribute(zr, "true"), n.classList.add(ya), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function ii(e, t) {
  const n = e.querySelector(Fn);
  if (!n) return;
  const r = !e.classList.contains(ba);
  hm(e, t, n, r);
}
function hm(e, t, n, r) {
  e.classList.toggle(ba, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function si(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(_a);
  if (!t) return null;
  const n = Hn(t);
  return n ? (ai(n), t.classList.contains(ya) ? t : null) : null;
}
function Hn(e) {
  const t = e.closest(ha);
  return t && t.querySelector(Fn) ? t : null;
}
const jr = `${c}-workflow-dice-toggle-styles`;
function bm() {
  if (document.getElementById(jr)) return;
  const e = document.createElement("style");
  e.id = jr, e.textContent = `
.${a}__workflow-section .${a}__roll-detail-toggle,
.${a}__workflow-section .${a}__roll-detail-list {
  display: none !important;
}

.${a}__workflow-roll:not(.${a}__workflow-roll--dice-open) .${a}__workflow-dice-tray,
.${a}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${a}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${a}__workflow-roll-formula--toggle:hover,
.${a}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${a}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${a}__header .${a}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${a}__ritual-element-badge {
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

.${a}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${a}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${a}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${a}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${a}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${a}__header .${a}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${a}__roll-card > .${a}__ritual-metadata {
  display: none !important;
}

.${a}__ritual-metadata-chip {
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

.${a}__resistance {
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

.${a}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${a}__resistance-content .${a}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${a}__resistance-content .${a}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${a}__resistance-content .${a}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${a}__resistance > .${a}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: start;
}

.${a}__resistance > .${a}__resistance-roll-result,
.${a}__resistance-content .${a}__resistance-roll-result {
  grid-area: result;
  display: block;
  min-width: 0;
  width: 100%;
  margin-top: 0;
}

.${a}__resistance-workflow-roll {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 0.34rem;
}

.${a}__resistance-workflow-roll .${a}__workflow-roll-formula {
  display: inline-flex;
  width: 100%;
  max-width: 100%;
  min-height: 1.78rem;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

.${a}__resistance-workflow-roll .${a}__workflow-roll-formula i {
  margin-left: auto;
}

.${a}__resistance-workflow-roll .${a}__workflow-dice-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
  border-top: 1px solid rgba(79, 55, 42, 0.12);
  padding-top: 0.34rem;
}

.${a}__resistance-workflow-roll .${a}__workflow-die {
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

.${a}__resistance-workflow-roll .${a}__workflow-die--inactive {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(36, 27, 24, 0.46);
  opacity: 0.58;
}
.${a}__workflow-section--casting .${a}__workflow-section-header--casting-backlash {
  grid-template-columns: minmax(0, 1fr) 34px;
}

.${a}__workflow-section-title-row {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.38rem;
}

.${a}__workflow-section-title-row .${a}__workflow-section-status {
  flex: 0 0 auto;
}

.${a}__casting-backlash-button {
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

.${a}__casting-backlash-button::before {
  content: "↪";
  font-size: 1rem;
  font-weight: 950;
  line-height: 1;
}

.${a}__casting-backlash-button:hover,
.${a}__casting-backlash-button:focus {
  border-color: rgba(125, 39, 43, 0.66) !important;
  background: rgba(143, 62, 67, 0.94) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 0 0 2px rgba(125, 39, 43, 0.16) !important;
  outline: none !important;
}

.${a}__casting-backlash-button:disabled {
  cursor: default !important;
  opacity: 0.78 !important;
}

.${a}__casting-backlash-button.${a}__button--executed::before {
  content: "✓";
}

/* 0.21.2 — Resolução de dano integrada no bloco de Dano */
.${a}__workflow-section--effect .${a}__resistance {
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.48rem 0.52rem !important;
  background: rgba(255, 246, 229, 0.52) !important;
  box-shadow: none !important;
}

.${a}__workflow-section--effect .${a}__resistance-content {
  gap: 0.22rem !important;
}

.${a}__workflow-section--effect .${a}__resistance-header strong {
  display: inline !important;
  margin: 0 !important;
}

.${a}__workflow-section--effect .${a}__resistance-description {
  font-size: 0.75rem !important;
  line-height: 1.25 !important;
}

.${a}__actions--embedded {
  margin-top: 0.46rem !important;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${a}__actions--compact,
.${a}__actions--damage-resolution {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center !important;
  gap: 0.34rem !important;
}

.${a}__actions--damage-resolution .${a}__actions-title {
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

.${a}__actions--damage-resolution .${a}__actions-title::before,
.${a}__actions--damage-resolution .${a}__actions-title::after {
  content: "";
  display: block;
  border-top: 1px solid rgba(79, 55, 42, 0.16);
}

.${a}__damage-resolution-summary {
  grid-column: 1 / -1;
  margin: -0.04rem 0 0.02rem;
  color: rgba(54, 39, 31, 0.64);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.24;
  text-align: center;
}

.${a}__actions--damage-resolution .${a}__button {
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

.${a}__actions--damage-resolution .${a}__button-icon {
  flex: 0 0 auto;
  font-size: 0.78rem;
  line-height: 1;
  opacity: 0.88;
}

.${a}__actions--damage-resolution .${a}__button-label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.${a}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="pending"] .${a}__button,
.${a}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${a}__button,
.${a}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${a}__button {
  grid-column: 1 / -1;
}

.${a}__actions--damage-resolution .${a}__button[hidden] {
  display: none !important;
}

.${a}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${a}__damage-resolution-summary {
  color: rgba(34, 93, 55, 0.84);
}

.${a}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${a}__damage-resolution-summary {
  color: rgba(112, 44, 44, 0.82);
}

.${a}__actions--effect-resolution {
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

.${a}__actions--effect-resolution .${a}__actions-title {
  grid-area: title;
  margin: 0 !important;
  color: rgba(107, 78, 35, 0.95) !important;
  font-size: 0.78rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.055em !important;
  line-height: 1 !important;
  text-transform: uppercase !important;
}

.${a}__effect-resolution-label {
  grid-area: label;
  min-width: 0;
  color: rgba(36, 27, 24, 0.9);
  font-size: 0.82rem;
  font-weight: 850;
  line-height: 1.22;
  overflow-wrap: anywhere;
}

.${a}__actions--effect-resolution .${a}__button {
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
.${a}__actions--effect-resolution {
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${a}__actions--effect-resolution .${a}__button {
  gap: 0.34rem !important;
  border-color: rgba(123, 72, 73, 0.42) !important;
  background: rgba(228, 214, 209, 0.74) !important;
  color: rgba(42, 30, 27, 0.94) !important;
}

.${a}__actions--effect-resolution .${a}__button:hover,
.${a}__actions--effect-resolution .${a}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${a}__button-icon--effect {
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
  transform: translateY(-0.02rem);
}

.${a}__button--effect-resolution-action .${a}__button-label {
  line-height: 1;
}

/* 0.21.5 — Efeito dentro do card principal e estado aplicado compacto */
/* 0.21.6 — Aproxima o Efeito do bloco de Dano para manter o ritmo visual do card */
/* 0.21.7 — Normaliza Efeito como seção irmã de Dano, sem margem herdada de actions */
.${a}__roll-card > .${a}__actions--effect-resolution {
  margin: 0 !important;
}

.${a}__roll-card > .${a}__workflow-section--effect + .${a}__actions--effect-resolution {
  margin-top: 0 !important;
}

.${a}__actions--effect-resolution.${a}__workflow-section {
  align-items: center !important;
}

.${a}__actions--effect-resolution .${a}__button--executed,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${a}__button-icon--effect-applied {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.8 — Efeito condicionado ao resultado da resistência */
.${a}__actions--effect-resolution .${a}__button--effect-resolution-waiting,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted {
  color: rgba(34, 93, 55, 0.84) !important;
}

.${a}__button-icon--effect-resisted {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.9 — Estados bloqueados de efeito não devem parecer clicáveis */
.${a}__actions--effect-resolution .${a}__button--effect-resolution-waiting:hover,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-waiting:focus,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted:hover,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted:focus,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-waiting:disabled,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted:disabled {
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  cursor: default !important;
}

.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted:hover,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted:focus,
.${a}__actions--effect-resolution .${a}__button--effect-resolution-resisted:disabled {
  color: rgba(34, 93, 55, 0.84) !important;
}

/* 0.22.0 — Card estruturado: remove moldura externa e mantém cards internos */
.${a}__roll-card--structured {
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${a}__roll-card--structured > .${a}__workflow-section,
.${a}__roll-card--structured > .${a}__actions--effect-resolution {
  margin-inline: 0 !important;
}

.${a}__roll-card--structured > .${a}__workflow-section + .${a}__workflow-section,
.${a}__roll-card--structured > .${a}__workflow-section + .${a}__actions--effect-resolution,
.${a}__roll-card--structured > .${a}__actions--effect-resolution + .${a}__workflow-section {
  margin-top: 0.28rem !important;
}

.${a}__roll-card--structured > .${a}__roll-meta,
.${a}__roll-card--structured > .${a}__workflow-notes {
  margin-inline: 0.08rem !important;
}

/* 0.22.2 — Unifica ritmo e tipografia do card de Efeito com Conjuração/Dano */
.${a}__roll-card--structured {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.18rem !important;
}

.${a}__roll-card--structured > .${a}__workflow-section,
.${a}__roll-card--structured > .${a}__actions--effect-resolution {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.${a}__roll-card--structured > .${a}__actions--effect-resolution {
  gap: 0.14rem 0.5rem !important;
  padding: 0.54rem 0.58rem !important;
}

.${a}__roll-card--structured > .${a}__actions--effect-resolution .${a}__actions-title {
  display: block !important;
  font-family: inherit !important;
  font-size: 0.74rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 950 !important;
  letter-spacing: 0.075em !important;
  line-height: 1.08 !important;
  text-transform: uppercase !important;
}

.${a}__roll-card--structured > .${a}__actions--effect-resolution .${a}__effect-resolution-label {
  font-family: inherit !important;
  font-size: 0.81rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 800 !important;
  line-height: 1.18 !important;
}

.${a}__roll-card--structured > .${a}__actions--effect-resolution .${a}__button {
  align-self: center !important;
}

/* 0.22.3 — Efeito como workflow-section real, sem card legado de actions */
.${a}__roll-card--structured {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.18rem !important;
}

.${a}__roll-card--structured > .${a}__workflow-section,
.${a}__roll-card--structured > .${a}__workflow-section--effect-action {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.${a}__workflow-section--effect-action {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "header button"
    "label button";
  align-items: center !important;
  gap: 0.14rem 0.5rem !important;
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${a}__workflow-section--effect-action > .${a}__workflow-section-header {
  grid-area: header;
  min-width: 0;
  margin: 0 !important;
}

.${a}__workflow-section--effect-action > .${a}__workflow-section-header strong {
  color: rgba(107, 78, 35, 0.95) !important;
  font-family: inherit !important;
  font-size: 0.74rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 950 !important;
  letter-spacing: 0.075em !important;
  line-height: 1.08 !important;
  text-transform: uppercase !important;
}

.${a}__effect-section-body {
  display: contents !important;
}

.${a}__effect-section-label {
  grid-area: label;
  min-width: 0;
  color: rgba(36, 27, 24, 0.9);
  font-family: inherit !important;
  font-size: 0.81rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 800 !important;
  line-height: 1.18 !important;
  overflow-wrap: anywhere;
}

.${a}__effect-section-action {
  grid-area: button;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  justify-self: end !important;
  align-self: center !important;
  min-width: 0;
}

.${a}__workflow-section--effect-action .${a}__button {
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
  border-color: rgba(123, 72, 73, 0.42) !important;
  background: rgba(228, 214, 209, 0.74) !important;
  color: rgba(42, 30, 27, 0.94) !important;
  font-size: 0.78rem !important;
  font-weight: 900 !important;
  line-height: 1.1 !important;
  gap: 0.34rem !important;
  white-space: nowrap !important;
  aspect-ratio: auto !important;
}

.${a}__workflow-section--effect-action .${a}__button:hover,
.${a}__workflow-section--effect-action .${a}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${a}__workflow-section--effect-action .${a}__button--executed,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${a}__workflow-section--effect-action .${a}__button--effect-resolution-waiting,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${a}__workflow-section--effect-action .${a}__button--effect-resolution-waiting:hover,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-waiting:focus,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-waiting:disabled,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted:hover,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted:focus,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted:disabled {
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  cursor: default !important;
}

.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted:hover,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted:focus,
.${a}__workflow-section--effect-action .${a}__button--effect-resolution-resisted:disabled {
  color: rgba(34, 93, 55, 0.84) !important;
}

/* 0.23.0 — Multi-target ritual card visual model */
.${a}__roll-card--multi-target
  > .${a}__workflow-section--multi-target-source,
.${a}__roll-card--multi-target
  > .${a}__workflow-section--multi-target-effect-source {
  display: none !important;
}

.${a}__workflow-section--targets {
  border-color: rgba(143, 54, 62, 0.24) !important;
  border-left: 3px solid rgba(133, 49, 59, 0.68) !important;
  background: linear-gradient(180deg, rgba(255, 248, 245, 0.84), rgba(250, 239, 235, 0.52)) !important;
}

.${a}__targets-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 0.5rem !important;
}

.${a}__workflow-section--targets
  .${a}__workflow-section-header strong {
  color: rgba(117, 48, 58, 0.94) !important;
}

.${a}__targets-status {
  display: inline-flex !important;
  align-items: center !important;
  min-width: 0 !important;
  border: 1px solid rgba(120, 61, 50, 0.14) !important;
  border-radius: 999px !important;
  padding: 0.14rem 0.48rem !important;
  background: rgba(255, 255, 255, 0.44) !important;
  color: rgba(36, 27, 24, 0.82) !important;
  font-size: 0.72rem !important;
  font-weight: 900 !important;
  line-height: 1 !important;
  white-space: nowrap !important;
}

.${a}__targets-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.3rem !important;
  margin-top: 0.42rem !important;
}

.${a}__target-row {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.34rem !important;
  border: 1px solid rgba(143, 54, 62, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.38rem !important;
  background: rgba(255, 255, 255, 0.34) !important;
  cursor: pointer !important;
}

.${a}__target-row:focus-visible {
  outline: 2px solid rgba(143, 54, 62, 0.34) !important;
  outline-offset: 2px !important;
}

.${a}__target-summary {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.32rem !important;
  min-width: 0 !important;
}

.${a}__target-summary-main {
  display: grid !important;
  grid-template-columns: auto minmax(0, 1fr) auto auto !important;
  align-items: center !important;
  gap: 0.34rem !important;
  min-width: 0 !important;
}

.${a}__target-summary-actions {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
  align-items: center !important;
  gap: 0.34rem !important;
  min-width: 0 !important;
}

.${a}__target-row[aria-expanded="true"] .${a}__target-summary-actions {
  display: none !important;
}

.${a}__target-avatar {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 1.62rem !important;
  height: 1.62rem !important;
  border: 1px solid rgba(139, 95, 48, 0.28) !important;
  border-radius: 999px !important;
  background: radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.92), rgba(231, 213, 194, 0.78)) !important;
  color: rgba(88, 56, 42, 0.8) !important;
  flex: 0 0 auto !important;
  font-size: 0.72rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

.${a}__target-name {
  min-width: 0 !important;
  color: rgba(36, 27, 24, 0.94) !important;
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1.12 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${a}__target-resistance-button,
.${a}__target-action {
  appearance: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 0 !important;
  margin: 0 !important;
  border-style: solid !important;
  border-width: 1px !important;
  box-shadow: none !important;
  font-family: inherit !important;
  line-height: 1 !important;
}

.${a}__target-resistance-button {
  width: 2.08rem !important;
  height: 1.82rem !important;
  border-color: rgba(123, 72, 73, 0.38) !important;
  border-radius: 7px !important;
  background: rgba(255, 252, 247, 0.74) !important;
  color: rgba(58, 45, 39, 0.84) !important;
  font-size: 0.76rem !important;
  font-weight: 950 !important;
  cursor: default !important;
}

.${a}__target-resistance-button i {
  font-size: 0.88rem !important;
}

.${a}__target-resistance-fallback {
  display: none !important;
}

.${a}__target-action {
  min-height: 1.82rem !important;
  border-color: rgba(123, 72, 73, 0.34) !important;
  border-radius: 7px !important;
  padding: 0.28rem 0.36rem !important;
  background: rgba(228, 214, 209, 0.64) !important;
  color: rgba(42, 30, 27, 0.82) !important;
  font-size: 0.72rem !important;
  font-weight: 900 !important;
  gap: 0.22rem !important;
  opacity: 0.74 !important;
  white-space: nowrap !important;
  cursor: default !important;
}

.${a}__target-action:disabled {
  opacity: 0.74 !important;
}

.${a}__target-summary-actions .${a}__target-action {
  width: 100% !important;
}

.${a}__target-action-icon {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

.${a}__target-action-label {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${a}__target-toggle {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 1.1rem !important;
  color: rgba(36, 27, 24, 0.78) !important;
  font-size: 1rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
  pointer-events: none !important;
  user-select: none !important;
}

.${a}__target-details {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  gap: 0.36rem !important;
  border: 1px solid rgba(151, 111, 45, 0.22) !important;
  border-radius: 8px !important;
  padding: 0.48rem !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.76), rgba(255, 245, 219, 0.42)) !important;
}

.${a}__target-details[hidden] {
  display: none !important;
}

.${a}__target-resistance-details {
  grid-column: 1 / -1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0.12rem !important;
  min-width: 0 !important;
}

.${a}__target-resistance-details strong {
  color: rgba(107, 78, 35, 0.96) !important;
  font-size: 0.74rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.075em !important;
  line-height: 1.08 !important;
  text-transform: uppercase !important;
}

.${a}__target-resistance-details span {
  color: rgba(36, 27, 24, 0.84) !important;
  font-size: 0.78rem !important;
  font-weight: 700 !important;
  line-height: 1.22 !important;
}

.${a}__target-formula {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  min-height: 1.82rem !important;
  min-width: 0 !important;
  border: 1px solid rgba(66, 47, 34, 0.18) !important;
  border-radius: 6px !important;
  padding: 0.28rem 0.46rem !important;
  background: rgba(255, 255, 255, 0.62) !important;
  color: rgba(36, 27, 24, 0.9) !important;
  font-size: 0.78rem !important;
  font-weight: 800 !important;
  line-height: 1 !important;
  gap: 0.46rem !important;
}

.${a}__target-formula span {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${a}__target-formula i {
  flex: 0 0 auto !important;
  font-size: 0.62rem !important;
  opacity: 0.68 !important;
}

.${a}__target-details-actions {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 0.32rem !important;
  grid-column: 1 / -1 !important;
}

.${a}__target-details-actions .${a}__target-action {
  justify-content: center !important;
  width: 100% !important;
  min-height: 2rem !important;
  padding-inline: 0.5rem !important;
}

.${a}__target-details-actions .${a}__target-action-label {
  overflow: visible !important;
  text-overflow: clip !important;
}

.${a}__workflow-section--effect-info {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  align-items: center !important;
  gap: 0.14rem 0.5rem !important;
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${a}__workflow-section--effect-info
  > .${a}__workflow-section-header strong {
  color: rgba(107, 78, 35, 0.95) !important;
}

.${a}__effect-info-body {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.12rem !important;
  min-width: 0 !important;
}

.${a}__effect-info-label {
  color: rgba(36, 27, 24, 0.9) !important;
  font-size: 0.81rem !important;
  font-weight: 850 !important;
  line-height: 1.18 !important;
  overflow-wrap: anywhere !important;
}

.${a}__effect-info-hint {
  color: rgba(36, 27, 24, 0.68) !important;
  font-size: 0.74rem !important;
  font-weight: 700 !important;
  line-height: 1.1 !important;
}

`, document.head.append(e);
}
const _m = [0, 100, 500, 1500, 3e3];
let Gr = !1, Bt = null;
function ym() {
  if (!Gr) {
    Gr = !0, bm(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Ce(Ur(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Ce(Ur(t));
    }), Hooks.once("ready", () => {
      Ce(document), Am();
    }), document.addEventListener("click", pm), document.addEventListener("keydown", gm);
    for (const e of _m)
      globalThis.setTimeout(() => Ce(document), e);
  }
}
function Am() {
  Bt || !document.body || (Bt = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Ce(n);
  }), Bt.observe(document.body, { childList: !0, subtree: !0 }));
}
function Ce(e) {
  e && (Ec(e), qd(e), Id(e), fm(e), _c(e));
}
function Tm() {
  ym();
}
const $m = "data-paranormal-toolkit-action-section", Rm = "ritual-log", wm = ".paranormal-toolkit-item-use-prompt__actions", km = ".paranormal-toolkit-item-use-prompt__actions-title", Em = [0, 100, 500, 1500];
let Vr = !1;
function Cm() {
  if (Vr) return;
  const e = (t, n) => {
    Hr(Dm(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Hr(document), Vr = !0;
}
function Hr(e) {
  for (const t of Em)
    globalThis.setTimeout(() => Im(e), t);
}
function Im(e) {
  Sm(e), Lm(e);
}
function Sm(e) {
  for (const t of e.querySelectorAll(
    `[${$m}="${Rm}"]`
  ))
    t.remove();
}
function Lm(e) {
  for (const t of e.querySelectorAll(wm)) {
    if (Wr(t.querySelector(km)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (i) => Wr(i.textContent ?? "")
    ).some((i) => i.includes("ritual conjurado")) && t.remove();
  }
}
function Dm(e) {
  if (e instanceof HTMLElement || vm(e))
    return e;
  if (Pm(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function vm(e) {
  return e instanceof HTMLElement;
}
function Pm(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Wr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Nm = {
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
}, xm = new Set(
  Object.values(Nm)
), Om = {
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
function Fm(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Mm(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Om[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : xm.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function li(e) {
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
function Mm(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Bm {
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
    const i = n.applyDamage;
    if (typeof i != "function")
      return p({
        actor: n,
        actorId: o,
        actorName: r,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const s = [], l = /* @__PURE__ */ new Set();
    let u = null;
    for (const [d, f] of t.instances.entries()) {
      const y = Um(f, d);
      if (!y.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const T = Fm(f.damageType);
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
      if (y.amount === 0) {
        s.push(
          qm(y.id, f, T.value)
        );
        continue;
      }
      try {
        const $ = await Promise.resolve(
          i.call(n, y.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: f.ignoreResistance === !0,
            nonLethal: f.nonLethal === !0
          })
        );
        for (const P of jm($.conditions))
          l.add(P);
        const g = zm($.newPV);
        g !== null && (u = g), s.push({
          id: y.id,
          label: f.label ?? li(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: Kr($.finalDamage, y.amount),
          blocked: Kr($.blocked, 0),
          damageType: f.damageType ? String(f.damageType) : null,
          systemDamageType: T.value,
          ignoreResistance: f.ignoreResistance === !0,
          nonLethal: f.nonLethal === !0
        });
      } catch ($) {
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: f,
          cause: $
        });
      }
    }
    return b({
      actor: n,
      actorId: o,
      actorName: r,
      totalRawDamage: s.reduce(
        (d, f) => d + f.inputAmount,
        0
      ),
      totalFinalDamage: s.reduce(
        (d, f) => d + f.finalDamage,
        0
      ),
      totalBlocked: s.reduce(
        (d, f) => d + f.blocked,
        0
      ),
      newPV: u,
      conditions: Array.from(l),
      instances: s,
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
function Um(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function qm(e, t, n) {
  return {
    id: e,
    label: t.label ?? li(n),
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
function Kr(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function zm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function jm(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const Ie = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, ci = {
  PV: "system.attributes.hp"
}, fn = {
  PV: [Ie.PV, ci.PV],
  SAN: [Ie.SAN],
  PE: [Ie.PE],
  PD: [Ie.PD]
}, pn = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Gm {
  getResource(t, n) {
    const r = Yr(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, i = `${o}.value`, s = `${o}.max`, l = foundry.utils.getProperty(t, i), u = foundry.utils.getProperty(t, s), d = Zr(t, n, i, l, "valor atual");
    if (d) return p(d);
    const f = Zr(t, n, s, u, "valor máximo");
    return f ? p(f) : b({
      value: l,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = Yr(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function Yr(e, t) {
  const n = Vm(e.type, t);
  if (n && Qr(e, n))
    return b(n);
  const r = fn[t].find(
    (o) => Qr(e, o)
  );
  return r ? b(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Hm(e, t),
    path: fn[t].join(" | ")
  });
}
function Vm(e, t) {
  return e === "threat" ? ci[t] ?? null : e === "agent" ? Ie[t] : null;
}
function Qr(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Hm(e, t) {
  const n = e.type ?? "unknown", r = fn[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Zr(e, t, n, r, o) {
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
class Wm {
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
      const s = pn.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: o } = n, i = Km(o);
    return i ? b(i) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of pn.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Km(e) {
  if (Xr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Xr(n))
      return n;
  }
  return null;
}
function Xr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Ym = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Qm {
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
    const r = n.value, o = Zm(t.ritual, r);
    return o.ok ? o.value ? b(o.value) : b({
      resource: "PE",
      amount: Ym[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Zm(e, t) {
  const n = e.getFlag(c, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Xm(n) ? {
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
function Xm(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Ut = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Jm(e) {
  if (!af(e.item)) return null;
  const t = gn(e.actor) ? e.actor : ef(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: nf(e.token) ?? tf(t),
    targets: Nn(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function ef(e) {
  const t = e;
  return gn(t.actor) ? t.actor : gn(e.parent) ? e.parent : null;
}
function tf(e) {
  const t = rf(e) ?? of(e);
  return t ? di(t) : null;
}
function nf(e) {
  return hn(e) ? di(e) : null;
}
function rf(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return hn(n) ? n : (t.getActiveTokens?.() ?? []).find(hn) ?? null;
}
function of(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function di(e) {
  const t = e.actor ?? null;
  return {
    tokenId: qt(e.id),
    actorId: qt(t?.id),
    sceneId: qt(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function af(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function gn(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function hn(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function qt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class sf {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Ut.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, m.info(`${Ut.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Jm(lf(t));
    if (!n) {
      m.warn(`${Ut.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function lf(e) {
  return e && typeof e == "object" ? e : {};
}
class cf {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return zt("missing-item-patch");
    if (t.type !== "ritual") return zt("unsupported-item-type");
    const o = uf(r);
    return Object.keys(o).length === 0 ? zt("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function uf(e) {
  const t = {};
  k(t, "name", e.name), k(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (k(t, "system.circle", n.circle), k(t, "system.element", n.element), k(t, "system.target", n.target), k(t, "system.targetQtd", n.targetQuantity), k(t, "system.execution", n.execution), k(t, "system.range", n.range), k(t, "system.duration", n.duration), k(t, "system.skillResis", n.resistanceSkill), k(t, "system.resistance", n.resistance), k(t, "system.studentForm", n.studentForm), k(t, "system.trueForm", n.trueForm)), t;
}
function k(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function zt(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class df {
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
    return this.getNumber(t, pn.ritual.dt, 0);
  }
  getResources(t) {
    const n = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, r = [];
    for (const o of ["PV", "SAN", "PE", "PD"]) {
      const i = this.resourceAdapter.getResource(t, o);
      i.ok ? n[o] = i.value : r.push(i.error);
    }
    return { values: n, errors: r };
  }
  getNumber(t, n, r) {
    const o = foundry.utils.getProperty(t, n);
    return typeof o == "number" && Number.isFinite(o) ? o : r;
  }
}
class mf {
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
class ff {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = pf(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, jt(t)), b(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const o = this.register(r);
      if (!o.ok)
        return o;
      n.push(o.value);
    }
    return b(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? jt(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? b(n) : p({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(jt);
  }
  findForItem(t) {
    return this.list().map((n) => gf(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function pf(e) {
  return !Gt(e.id) || !Gt(e.version) || !Gt(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : b(e);
}
function gf(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const i = hf(o, t);
    if (!i.matches)
      return null;
    r += i.score, n.push(i.reason);
  }
  return {
    preset: e,
    score: r,
    reasons: n
  };
}
function hf(e, t) {
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
      const n = Jr(t.name), r = e.names.map(Jr).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = bf(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Jr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function bf(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function jt(e) {
  return structuredClone(e);
}
function Gt(e) {
  return typeof e == "string" && e.length > 0;
}
function lt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : b(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = Ct(e.amountFrom);
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
    }) : b(o);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Ct(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const _f = "dice-so-nice";
async function mi(e) {
  if (!yf() || !Af()) return;
  const t = Tf();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      m.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function yf() {
  try {
    return Jl().enabled;
  } catch {
    return !1;
  }
}
function Af() {
  return game.modules?.get?.(_f)?.active === !0;
}
function Tf() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function $f(e, t, n) {
  if (!eo(e.id) || !eo(e.formula))
    return p({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(e.formula), o = await Promise.resolve(r.evaluate()), i = o.total;
    if (typeof i != "number" || !Number.isFinite(i))
      return p({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await mi(o);
    const l = {
      ...n.rollRequests[e.id] ?? fi(e, t),
      total: i,
      roll: o
    };
    return n.rolls[e.id] = l, b(l);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function fi(e, t) {
  const n = e.intent ?? Rf(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function Rf(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function eo(e) {
  return typeof e == "string" && e.length > 0;
}
async function ct(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Qe(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Qe(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? Qe(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? Qe(t, n, r, o) : e.recover(t, n, o);
  }
}
function Qe(e, t, n, r) {
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
function wf(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: i } = e;
  if (t.operation === "damage") {
    const s = kf(t, n, r, o);
    n.damageInstances.push(s), i.emit("afterDamageResolution", n, {
      stepIndex: o,
      step: t,
      damage: s,
      resourceTransaction: r,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), i.emit("afterApplyDamage", n, {
      stepIndex: o,
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
    const s = Ef(t, n, r, o);
    n.healingInstances.push(s), i.emit("afterApplyHealing", n, {
      stepIndex: o,
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
function kf(e, t, n, r) {
  const o = Ct(e.amountFrom), i = o ? t.rolls[o] : void 0;
  return {
    id: pi(t.id, "damage", r, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    damageType: i?.damageType,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Ef(e, t, n, r) {
  const o = Ct(e.amountFrom);
  return {
    id: pi(t.id, "healing", r, t.healingInstances.length),
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
function pi(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Cf(e, t, n) {
  const r = Ct(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function If(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: i } = e;
  i.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), gi("before", e), to("before", e), to("resolve", e);
}
function Sf(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: i } = e;
  i.emit("apply", n, { stepIndex: r, step: t, metadata: o }), gi("apply", e);
}
function Lf(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: i } = e;
  i.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function gi(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: i, lifecycle: s } = t, l = Df(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: o,
    step: n,
    metadata: i
  });
}
function to(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: i, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: i
  });
}
function Df(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function vf(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), b(void 0);
  } catch (r) {
    return p({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function Pf(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Nf(e, t);
    case "spendRitualCost":
      return xf(e, t);
  }
}
async function Nf(e, t) {
  const { context: n, resources: r } = e, o = lt(t, n);
  return o.ok ? hi(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function xf(e, t) {
  const { context: n, resources: r, ritualCosts: o } = e, i = o.getCost({
    actor: n.sourceActor,
    ritual: n.item
  });
  if (!i.ok)
    return p({
      reason: "ritual-cost-failed",
      message: i.error.message,
      cause: i.error
    });
  const s = i.value;
  return n.ritualCosts.push({
    ...s,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), hi(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function hi(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), b(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Of(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: i } = e, s = Ff(t);
  for (const u of s.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const l = await i();
  if (!l.ok)
    return l;
  for (const u of s.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return l;
}
function Ff(e) {
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
class Mf {
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
      const i = await this.runStep(o, n, r);
      if (!i.ok)
        return i;
    }
    return b({ definition: t, context: n });
  }
  async runStep(t, n, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, r);
      default:
        return Of({
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
    const o = await Pf({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? b(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = fi(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const i = await this.runRollFormulaStep(t, n, r);
    if (!i.ok)
      return i;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: s }), b(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await $f(t, r, n);
    return o.ok ? b(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = lt(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const i = Cf(t, n, o.value);
    If({
      step: t,
      context: n,
      stepIndex: r,
      metadata: i,
      lifecycle: this.lifecycle
    }), Sf({
      step: t,
      context: n,
      stepIndex: r,
      metadata: i,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, n);
    if (s.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const l of s) {
      const u = await ct(this.resources, l, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(u, n, r, t);
      if (!d.ok)
        return d;
      wf({
        step: t,
        context: n,
        transaction: d.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Lf({
      step: t,
      context: n,
      stepIndex: r,
      metadata: i,
      lifecycle: this.lifecycle
    }), b(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = lt(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
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
      const l = await ct(this.resources, s, t.resource, t.operation, o.value), u = this.handleResourceOperationResult(l, n, r, t);
      if (!u.ok)
        return u;
    }
    return b(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await vf(this.messages, t, n);
    return o.ok ? b(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, o) {
    return t.ok ? (n.resourceTransactions.push(t.value), b(t.value)) : p({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: o,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, o, i, s) {
    const l = Bf(t, n.intent);
    l && this.lifecycle.emit(l, r, {
      stepIndex: o,
      step: i,
      rollRequest: n,
      rollResult: s
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
function Bf(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Uf {
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
    const i = this.adapter.getResource(t, n);
    if (!i.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: i.error.reason,
        message: i.error.message,
        requestedAmount: o,
        path: i.error.path,
        value: i.error.value
      });
    const s = i.value, l = this.calculate(r, s, o);
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
        current: s.value,
        required: o
      });
    const { afterValue: u, appliedAmount: d } = l.value, f = {
      value: u,
      max: s.max
    };
    try {
      u !== s.value && await this.adapter.updateResourceValue(t, n, u);
    } catch (y) {
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "update-failed",
        message: `Falha ao atualizar ${n} no ator.`,
        requestedAmount: o,
        current: s.value,
        required: o,
        cause: y
      });
    }
    return b({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: o,
      appliedAmount: d,
      before: s,
      after: f
    });
  }
  calculate(t, n, r) {
    switch (t) {
      case "spend":
        return n.value < r ? p({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${n.value}; custo: ${r}.`
        }) : b({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const o = Math.max(0, n.value - r);
        return b({
          afterValue: o,
          appliedAmount: n.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(n.max, n.value + r);
        return b({
          afterValue: o,
          appliedAmount: o - n.value
        });
      }
    }
  }
}
function bi(e) {
  return {
    id: qf(),
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
function qf() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class zf {
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
    const r = bi(n);
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
class jf {
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
class Gf {
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
    const n = nn();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Vf(),
      flags: {
        ...t.flags,
        [c]: {
          ...Hf(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && m.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = nn();
    if (!r.enabled)
      return;
    const o = n.notification ?? no(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = no(n);
    switch (t) {
      case "info":
        m.info(r, n.data ?? "");
        return;
      case "warn":
        m.warn(r, n.data ?? "");
        return;
      case "error":
        m.error(r, n.data ?? "");
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
function no(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Vf() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Hf(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function Wf(e, t) {
  const n = ep(e?.rounds);
  if (!n)
    return ro(null);
  const r = e?.anchor ?? _i(t);
  if (!r)
    return {
      ...ro(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Kf(),
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
function _i(e) {
  const t = tp();
  if (!t?.id || !yi(t.round)) return null;
  const n = Xf(t), r = Yf(e, n) ?? Zf(t), o = j(r?.id), i = rp(r?.initiative), s = Qf(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: s,
    initiative: i,
    time: np()
  };
}
function Kf() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function ro(e) {
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
function Yf(e, t) {
  return e?.id ? t.find((n) => Jf(n) === e.id) ?? null : null;
}
function Qf(e, t, n) {
  const r = j(t?.id);
  if (r) {
    const o = n.findIndex((i) => i.id === r);
    if (o >= 0) return o;
  }
  return op(e.turn) ? e.turn : null;
}
function Zf(e) {
  return rt(e.combatant) ? e.combatant : null;
}
function Xf(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(rt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(rt);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(rt);
  }
  return [];
}
function Jf(e) {
  return j(e.actor?.id) ?? j(e.actorId) ?? j(e.token?.actor?.id) ?? j(e.token?.actorId) ?? j(e.document?.actor?.id) ?? j(e.document?.actorId);
}
function ep(e) {
  return yi(e) ? Math.trunc(e) : null;
}
function tp() {
  return game.combat ?? null;
}
function np() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function rt(e) {
  return !!(e && typeof e == "object");
}
function j(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function rp(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function yi(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function op(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class ap {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? b(n.value) : p({
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
    if (!gp(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, i = Wf(t.duration, r), s = ip(o, t, i), u = t.refreshExisting ?? !0 ? hp(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(s)), b(oo(r, o, u.id ?? null, !1, !0, i));
      } catch (d) {
        return p({
          actor: r,
          actorId: r.id ?? null,
          actorName: r.name ?? "Ator sem nome",
          conditionId: o.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
          cause: d
        });
      }
    try {
      const f = (await r.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return b(oo(r, o, f, !0, !1, i));
    } catch (d) {
      return p({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: o.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
        cause: d
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = Ti(n, r);
    let i = 0;
    try {
      for (const s of o)
        await ao(n, s) === "deleted" && (i += 1);
    } catch (s) {
      return p({
        actor: n,
        actorId: n.id ?? null,
        actorName: n.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "delete-failed",
        message: `Falha ao remover condição ${t.conditionId} de ${n.name ?? "ator sem nome"}.`,
        cause: s
      });
    }
    return b({
      actor: n,
      actorId: n.id ?? null,
      actorName: n.name ?? "Ator sem nome",
      conditionId: r,
      removed: i
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = yp(), r = [];
    let o = 0, i = 0;
    for (const s of n) {
      const l = Wn(s);
      o += l.length;
      for (const u of l) {
        if (!cp(u, t)) continue;
        const d = Ai(u);
        try {
          await ao(s, u) === "deleted" && (i += 1);
        } catch (f) {
          r.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: u.id ?? null,
            conditionId: d.conditionId,
            message: `Falha ao remover condição expirada ${d.conditionId ?? u.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
            cause: f
          });
        }
      }
    }
    return {
      reason: t.reason ?? "manual",
      scannedActors: n.length,
      scannedEffects: o,
      removedEffects: i,
      failures: r
    };
  }
}
function ip(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Sp(),
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
    duration: sp(n.duration),
    start: lp(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [c]: r
    }
  };
}
function sp(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function lp(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Ip(),
    ...e
  };
}
function oo(e, t, n, r, o, i) {
  return {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    conditionId: t.id,
    conditionLabel: t.label,
    effectId: n,
    created: r,
    refreshed: o,
    requestedRounds: i.requestedRounds,
    combatDurationApplied: i.combatDurationApplied,
    warning: i.warning
  };
}
function cp(e, t) {
  const n = Ai(e);
  if (!n.conditionId || !up(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Cp();
  return n.durationMode === "combatantTurn" || dp(n) ? fp(n, r) : mp(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !D(n.startRound) || !D(n.requestedRounds) || !D(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function up(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && D(e.requestedRounds);
}
function dp(e) {
  return !!(e.combatDurationApplied && D(e.requestedRounds) && D(e.startRound) && (e.startCombatantId || ut(e.startTurn)));
}
function mp(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function fp(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !D(e.startRound) || !D(e.requestedRounds) || !D(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = pp(t);
  return e.startCombatantId ? r === e.startCombatantId : ut(e.startTurn) && ut(t.turn) ? t.turn === e.startTurn : !1;
}
function pp(e) {
  return ce(e.combatant?.id);
}
function Ai(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: ot(e, "conditionId"),
    requestedRounds: io(e, "requestedRounds") ?? Se(t.value) ?? Se(t.rounds),
    combatDurationApplied: Vt(e, "combatDurationApplied"),
    combatId: ot(e, "combatId") ?? ce(n.combat) ?? ce(t.combat),
    startCombatantId: ot(e, "startCombatantId") ?? ce(n.combatant),
    startInitiative: Rp(e, "startInitiative") ?? $i(n.initiative),
    startRound: io(e, "startRound") ?? Se(n.round) ?? Se(t.startRound),
    startTurn: $p(e, "startTurn") ?? bn(n.turn) ?? bn(t.startTurn),
    expiryEvent: wp(e, "expiryEvent") ?? Ri(t.expiry),
    durationMode: kp(e, "durationMode"),
    deleteOnExpire: Vt(e, "deleteOnExpire"),
    expiresWithCombat: Vt(e, "expiresWithCombat")
  };
}
function gp(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function hp(e, t) {
  return Ti(e, t)[0] ?? null;
}
function Ti(e, t) {
  return Wn(e).filter((n) => Tp(n) === t);
}
async function ao(e, t) {
  const n = t.id ?? null, r = n ? bp(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (_p(o)) return "missing";
    throw o;
  }
}
function bp(e, t) {
  return Wn(e).find((n) => n.id === t) ?? null;
}
function _p(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function yp() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Ze(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Ze(e, n);
  });
  for (const n of Ap())
    Ze(e, n.actor), Ze(e, n.document?.actor);
  return Array.from(e.values());
}
function Ze(e, t) {
  if (!Ep(t)) return;
  const r = ce(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Ap() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Wn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Tp(e) {
  return ot(e, "conditionId");
}
function ot(e, t) {
  return ce(re(e, t));
}
function io(e, t) {
  return Se(re(e, t));
}
function $p(e, t) {
  return bn(re(e, t));
}
function Rp(e, t) {
  return $i(re(e, t));
}
function wp(e, t) {
  return Ri(re(e, t));
}
function kp(e, t) {
  const n = re(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Vt(e, t) {
  return re(e, t) === !0;
}
function re(e, t) {
  const n = e.getFlag?.(c, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const o = r[c];
  if (!(!o || typeof o != "object"))
    return o[t];
}
function ce(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Se(e) {
  return D(e) ? Math.trunc(e) : null;
}
function bn(e) {
  return ut(e) ? Math.trunc(e) : null;
}
function $i(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ri(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Ep(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Cp() {
  return game.combat ?? null;
}
function Ip() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function D(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function ut(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Sp() {
  return game.user?.id ?? null;
}
const Lp = "icons/svg/downgrade.svg", Dp = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function _(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Lp,
    description: Dp,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const vp = _({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Pp = _({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Np = _({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), xp = _({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Op = _({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Fp = _({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Mp = _({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Bp = _({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Up = _({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), qp = _({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), zp = _({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), jp = _({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Gp = _({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Vp = _({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Hp = _({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Wp = _({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Kp = _({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Yp = _({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Qp = _({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Zp = _({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Xp = _({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Jp = _({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), eg = _({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), tg = _({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), ng = _({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), rg = _({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), og = _({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), ag = _({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), ig = _({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), sg = _({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), lg = _({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), cg = _({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), ug = _({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), dg = _({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), mg = [
  vp,
  Pp,
  Np,
  xp,
  Op,
  Fp,
  Mp,
  Bp,
  Up,
  qp,
  zp,
  jp,
  Gp,
  Vp,
  Hp,
  Wp,
  Kp,
  Yp,
  Qp,
  Zp,
  Xp,
  Jp,
  eg,
  tg,
  ng,
  rg,
  og,
  ag,
  ig,
  sg,
  lg,
  cg,
  ug,
  dg
];
class fg {
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
    return Array.from(this.definitions.values()).map(so);
  }
  get(t) {
    const n = this.lookup.get(lo(t)), r = n ? this.definitions.get(n) : null;
    return r ? b(so(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = lo(t);
    r && this.lookup.set(r, n);
  }
}
function pg() {
  return new fg(mg);
}
function so(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function lo(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const gg = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", wi = `${c}-inline-roll-neutralized`, hg = `${c}-inline-roll-notice`, Kn = `data-${c}-inline-roll-neutralized`, co = `data-${c}-inline-roll-notice`, bg = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function uo(e) {
  const t = Dg(e.message), n = await _g(e.message), r = yg(t);
  return n.replacementCount + r.replacementCount > 0 && m.info("Rolagens inline neutralizadas para item automatizado.", {
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
async function _g(e) {
  const t = Ig(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = Ag(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Sg(t, n.content), replacementCount: n.replacementCount };
}
function yg(e) {
  const t = e ? Lg(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = ki(t);
  return n > 0 && Ei(kg(t)), { replacementCount: n };
}
function Ag(e) {
  const t = Tg(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = ki(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (Ei(n.content), { content: n.innerHTML, replacementCount: o });
}
function Tg(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, Rg(o.trim()))), replacementCount: t };
}
function ki(e) {
  const t = $g(e);
  for (const n of t)
    n.replaceWith(wg(Eg(n)));
  return t.length;
}
function $g(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(gg))
    n.getAttribute(Kn) !== "true" && t.add(n);
  return Array.from(t);
}
function Rg(e) {
  return `<span class="${wi}" ${Kn}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${vg(e)}</span>`;
}
function wg(e) {
  const t = document.createElement("span");
  return t.classList.add(wi), t.setAttribute(Kn, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Ei(e) {
  if (e.querySelector?.(`[${co}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(hg), t.setAttribute(co, "true"), t.textContent = bg, e.append(t);
}
function kg(e) {
  return e.querySelector(".message-content") ?? e;
}
function Eg(e) {
  const n = e.getAttribute("data-formula") ?? Cg(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Cg(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Ig(e) {
  return e && typeof e == "object" ? e : null;
}
async function Sg(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return m.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Lg(e) {
  const t = Pg(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Dg(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function vg(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Pg(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const dt = "ritualRollConfig", ue = "ritual-roll";
function It() {
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
function Ci(e) {
  const t = e.getFlag(c, dt);
  return _n(t);
}
function Ii(e) {
  return Ci(e) ?? It();
}
async function Ng(e, t) {
  const n = _n(t) ?? _n({
    ...It(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(c, dt, n), n;
}
async function xg(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, c, dt));
    return;
  }
  await e.setFlag(c, dt, null);
}
function _n(e) {
  if (!St(e)) return null;
  const t = Gg(e.intent);
  if (!t) return null;
  const n = It();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: mt(e.damageType),
    utilityLabel: mt(e.utilityLabel) ?? n.utilityLabel,
    note: Yn(e.note),
    forms: Vg(e.forms)
  };
}
function Og(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Fg(e) {
  const t = Ci(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = Mg(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...Bg(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: qg(e, t),
    resistance: t.intent === "damage" ? zg(e) : void 0
  };
}
function Mg(e, t) {
  const n = {
    type: "rollFormula",
    id: ue,
    formula: t,
    intent: jg(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function Bg(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${ue}.total`,
          ...Ug(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${ue}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function Ug(e) {
  return e ? { damageType: e } : {};
}
function qg(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [ue]: n
      }
    }
  };
  return mo(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [ue]: t.forms.discente.formula.trim()
    }
  }), mo(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [ue]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function zg(e) {
  const t = Si(e), n = mt(t.skillResis), r = mt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = Hg(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function jg(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Gg(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function Vg(e) {
  const t = It();
  return St(e) ? {
    base: Ht(e.base),
    discente: Ht(e.discente),
    verdadeiro: Ht(e.verdadeiro)
  } : t.forms;
}
function Ht(e) {
  return St(e) ? { formula: Yn(e.formula) } : { formula: "" };
}
function mo(e, t) {
  const n = Si(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return Wg(r);
}
function Si(e) {
  const t = e.system;
  return St(t) ? t : {};
}
function Hg(e) {
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
function Wg(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Yn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function mt(e) {
  const t = Yn(e);
  return t.length > 0 ? t : null;
}
function St(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const fo = "occultism";
function Kg(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Yg(e) {
  const t = Kg(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await Qg(e, fo);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await mi(n);
  const r = Jg(n);
  return {
    skill: fo,
    skillLabel: "Ocultismo",
    roll: n,
    formula: Xg(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: eh(n)
  };
}
async function Qg(e, t) {
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
  return Zg(r);
}
function Zg(e) {
  return po(e) ? e : Array.isArray(e) ? e.find(po) ?? null : null;
}
function po(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Xg(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Jg(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function eh(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(th);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((i) => {
    if (!i || typeof i != "object") return [];
    const s = i.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function th(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function nh(e) {
  switch (rh(e)) {
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
      return oh(String(e ?? ""));
  }
}
function rh(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function oh(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function ah(e) {
  return {
    header: {
      eyebrow: In,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: uh(e.ritual)
    },
    forms: e.variantOptions.map((t) => ih(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: ch(e.automationStatus ?? "assisted")
  };
}
function ih(e, t) {
  const n = sh(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? lh(t) : "—",
    details: n
  };
}
function sh(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function lh(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function ch(e) {
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
function uh(e) {
  const t = e.system, n = [mh(t?.element), dh(t?.circle)].filter(gh);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function dh(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function mh(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (fh(e)) {
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
      return ph(e);
  }
}
function fh(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function ph(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function gh(e) {
  return typeof e == "string" && e.length > 0;
}
const Li = ["base", "discente", "verdadeiro"];
function Di(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function ft(e) {
  return typeof e == "string" && Li.includes(e);
}
const { ApplicationV2: hh } = foundry.applications.api;
class De extends hh {
  constructor(t, n) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = ah(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: De.onCast,
      cancel: De.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new De(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    _h(o, (i) => {
      this.selectedVariant = i;
    }), yh(o, (i) => {
      this.spendResource = i;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${E(this.model.header.eyebrow)}</p>
        <div>
          <h2>${E(this.model.header.title)}</h2>
          <p>${E(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(bh).join("")}
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
          <div><dt>Custo base</dt><dd>${E(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${E(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${E(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${E(this.model.automation.title)}</strong></p>
        <p>${E(this.model.automation.description)}</p>
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
    const n = $h(t), r = Ah(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function bh(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((i) => `<span>${E(i)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${E(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${E(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${E(e.label)}</strong>
        <em>${E(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function _h(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => go(e, o, t)), o.addEventListener("keydown", (i) => {
      i.key !== "Enter" && i.key !== " " || (i.preventDefault(), go(e, o, t));
    });
  const r = vi(e);
  r && t(r);
}
function go(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !ft(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), vi(e));
}
function vi(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), i = o?.checked === !0;
    r.setAttribute("aria-checked", i ? "true" : "false"), i && ft(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function yh(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function Ah(e, t, n) {
  const r = Th(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function Th(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (ft(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return ft(n) ? n : null;
}
function $h(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function E(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function Rh(e) {
  return De.request(e);
}
const Qn = {
  label: "Padrão"
}, wh = {
  label: "Discente",
  extraCost: 2
}, kh = {
  label: "Verdadeiro",
  extraCost: 5
};
class Eh {
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
    const r = this.resolveCostPreview(t), o = hb(n), i = fb(
      n,
      t.item,
      r,
      o
    ), s = await Rh({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((w) => w.name),
      cost: r,
      defaultSpendResource: $b(n),
      variantOptions: i,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = Ch(s), u = _b(
      n,
      t.item,
      l.variant,
      o
    ), d = sa();
    let f = null;
    if (d) {
      const w = await Sh(
        this.resources,
        t.actor,
        l,
        u,
        r
      );
      if (!w.ok)
        return {
          status: "failed",
          reason: w.reason,
          message: w.message
        };
      try {
        f = await Yg(
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
    const y = Ih(
      n,
      l,
      u,
      r,
      {
        includeCostSteps: !d
      }
    );
    if (y.steps.length === 0) {
      const w = bb(
        t,
        l
      ), U = ho(
        t.actor,
        f,
        u,
        r
      ), lr = bo(
        n,
        l,
        u,
        r,
        w,
        t,
        f
      );
      return U.length > 0 ? {
        status: "ready",
        workflowContext: w,
        actions: U,
        summaryLines: lr
      } : {
        status: "completed-without-actions",
        workflowContext: w,
        summaryLines: lr
      };
    }
    const T = await this.workflow.runAutomation(y, {
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
    const $ = T.value.context, g = Oh(
      n,
      t,
      $
    ), P = Dh(
      n,
      t
    ), Te = ho(
      t.actor,
      f,
      u,
      r
    ), $e = bo(
      n,
      l,
      u,
      r,
      $,
      t,
      f
    );
    if (!g.ok)
      return {
        status: "failed",
        reason: g.reason,
        message: g.message
      };
    if (!P.ok)
      return {
        status: "failed",
        reason: P.reason,
        message: P.message
      };
    const Re = [
      ...Te,
      ...g.actions,
      ...P.actions
    ];
    return Re.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: $,
      summaryLines: $e
    } : {
      status: "ready",
      workflowContext: $,
      actions: Re,
      summaryLines: $e
    };
  }
  async applyAction(t) {
    return ct(
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
function Ch(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function Ih(e, t, n, r, o) {
  const i = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || Xn(l) && (!o.includeCostSteps || !s) || i.push(Lh(l, n));
  return o.includeCostSteps && s && r && Rb(n.extraCost) && i.push({
    type: "spendResource",
    actor: "self",
    resource: r.resource,
    amount: n.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: i
  };
}
async function Sh(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const i = qe(o, r);
  if (!i)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (i.amount <= 0) return { ok: !0 };
  const s = await e.spend(
    t,
    i.resource,
    i.amount
  );
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function Lh(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function ho(e, t, n, r) {
  if (!t || t.success) return [];
  const o = qe(r, n);
  if (!o || o.amount <= 0) return [];
  const i = e.name ?? "Ator sem nome";
  return [
    {
      kind: "resource-operation",
      actor: e,
      actorName: i,
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
function Dh(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = Zn(r.actor, t);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const i of o) {
      const s = _i(i);
      n.push(
        vh(
          r,
          i,
          t.item,
          s
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function vh(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", i = e.label ?? xh(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: i,
    duration: Ph(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Nh(i, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${i} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Ph(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Nh(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function xh(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Oh(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const i of e.steps) {
    if (i.type !== "modifyResource") continue;
    const s = lt(i, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = Zn(i.actor, t);
    if (l.length === 0) {
      if (i.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of l) {
      if (Fh(i)) {
        Mh(
          o,
          u,
          Bh(i, n, s.value)
        );
        continue;
      }
      r.push(qh(i, u, s.value));
    }
  }
  for (const i of o.values())
    r.push(
      ...Uh(
        e,
        t.item,
        i.actor,
        i.entries
      )
    );
  return { ok: !0, actions: r };
}
function Fh(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Mh(e, t, n) {
  const r = Vh(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Bh(e, t, n) {
  const r = Hh(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function Uh(e, t, n, r) {
  const o = Qh(e), i = o.length > 1 ? Jh() : void 0;
  return o.map((s) => {
    const l = r.map(
      (d, f) => {
        const y = Zh(d.amount, s);
        return {
          id: zh(d, s, f),
          amount: y,
          damageType: d.damageType,
          sourceRollId: d.sourceRollId,
          ignoreResistance: d.step.ignoreResistance === !0
        };
      }
    ), u = l.reduce(
      (d, f) => d + f.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: l,
      label: jh(u, s, o.length > 1),
      executedLabel: Gh(
        n.name ?? "Ator sem nome",
        s,
        o.length > 1
      ),
      choiceGroupId: i,
      choiceGroupResolvedLabel: i ? "✓ Outra opção escolhida" : void 0,
      actionSectionId: "apply-damage",
      actionSectionTitle: "Aplicar danos",
      source: "item-use.damage-action",
      originUuid: t.uuid ?? null
    };
  });
}
function qh(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = Yh(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: Wh(e, r, n),
    executedLabel: Kh(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function zh(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function jh(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Gh(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Vh(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Hh(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function Wh(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Kh(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Yh(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Qh(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Zh(e, t) {
  const n = e * t.multiplier, r = Xh(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function Xh(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Jh() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Zn(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function bo(e, t, n, r, o, i, s = null) {
  return [
    `Forma: ${Di(t.variant)}`,
    rb(t, n, r),
    ...nb(s),
    ...Object.values(o.rolls).flatMap(ob),
    ...eb(e, i),
    ...ab(e.resistance),
    ...db(n)
  ];
}
function eb(e, t) {
  return tb(e) ? Zn("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function tb(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function nb(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function rb(e, t, n) {
  const r = qe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function ob(e) {
  const n = [`${mb(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = ib(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${nh(e.damageType)}`), n;
}
function ab(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function ib(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const n = [];
  let r = "+";
  for (const o of t) {
    if (!o || typeof o != "object") continue;
    const i = o;
    if (i.operator === "+" || i.operator === "-") {
      r = i.operator;
      continue;
    }
    const s = sb(i);
    s && (ub(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function sb(e) {
  const t = lb(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : cb(e);
}
function lb(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function cb(e) {
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
function ub(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function db(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function mb(e) {
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
function fb(e, t, n, r) {
  return Li.map((o) => {
    const i = Pi(
      e,
      t,
      o,
      r
    ), s = i !== null;
    return {
      variant: o,
      label: i?.label ?? Di(o),
      enabled: s,
      details: i ? pb(i, n, r) : [],
      finalCostText: i ? gb(n, i) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function pb(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const i = qe(t, e);
  return r.push(
    i ? `Custo final: ${i.amount} ${i.resource}` : "Custo final não resolvido"
  ), r;
}
function qe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function gb(e, t) {
  const n = qe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function hb(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Xn);
}
function bb(e, t) {
  return bi({
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
function _b(e, t, n, r) {
  return Pi(e, t, n, r) ?? Qn;
}
function Pi(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? Ab(t, n) ? yb(n) : null : n === "base" ? Qn : null);
}
function yb(e) {
  switch (e) {
    case "base":
      return Qn;
    case "discente":
      return wh;
    case "verdadeiro":
      return kh;
  }
}
function Ab(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Tb(foundry.utils.getProperty(e, n));
}
function Tb(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function $b(e) {
  return e.steps.some(Xn);
}
function Xn(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Rb(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Ni = "itemUsePrompts", xi = "chatCard", Lt = "data-paranormal-toolkit-prompt-id", Dt = "data-paranormal-toolkit-pending-id", Jn = "data-paranormal-toolkit-executed-label", yn = "data-paranormal-toolkit-choice-group", Oi = "data-paranormal-toolkit-skipped-label", _o = "data-paranormal-toolkit-action-section", yo = "data-paranormal-toolkit-detail-key", Ao = "data-paranormal-toolkit-roll-card", er = "data-paranormal-toolkit-roll-detail-toggle", Fi = "data-paranormal-toolkit-roll-detail-id", Mi = "data-paranormal-toolkit-resistance-roll-button", Bi = "data-paranormal-toolkit-resistance-skill", Ui = "data-paranormal-toolkit-resistance-skill-label", qi = "data-paranormal-toolkit-resistance-target-actor-id", zi = "data-paranormal-toolkit-resistance-target-name", ji = "data-paranormal-toolkit-resistance-roll-result", To = "data-paranormal-toolkit-system-card-replaced", wb = `[${Dt}]`, kb = `[${er}]`, Eb = `[${Mi}]`, An = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, Cb = `${h}__actions`, $o = `${h}__details`, Gi = `${h}__summary`, Ib = `${h}__title`, Vi = `${h}__button--executed`, Ro = `${h}__roll-card`;
let wo = !1, Tn = null;
const v = /* @__PURE__ */ new Map(), Sb = [0, 100, 500, 1500, 3e3], Lb = 3e4, Db = [0, 100, 500, 1500, 3e3];
function vb(e) {
  if (Tn = e, wo) {
    Eo(e);
    return;
  }
  const t = (n, r) => {
    Wi(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), wo = !0, Eo(e);
}
async function ko(e) {
  const t = Hi(e);
  v.set(e.pendingId, t), await rr(t) || rs(t), Ki(e.pendingId);
}
async function Pb(e) {
  const t = Hi({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", v.set(e.pendingId, t), await rr(t) || rs(t), Ki(e.pendingId);
}
async function Wt(e, t) {
  const n = v.get(e);
  v.delete(e), n && await v_(n, t);
}
function tr(e) {
  const t = cs();
  for (const n of t) {
    const r = B(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Nb(e, t) {
  const n = tr(e);
  if (!n) return;
  const r = B(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await _e(n.message, r));
}
async function xb(e, t, n) {
  if (!t) return;
  const r = tr(e);
  if (!r) return;
  const o = B(r.message);
  let i = !1;
  for (const [s, l] of Object.entries(o))
    s !== e && l.choiceGroupId === t && (o[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, i = !0);
  i && await _e(r.message, o);
}
function Hi(e) {
  const t = H(e.context.message), n = e.context.targets.find((s) => kn(s)), r = n ? kn(n) : null, o = e.resistanceTargetActor ?? r, i = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    resistanceTargetActorId: e.resistanceTargetActorId ?? o?.id ?? null,
    resistanceTargetName: i,
    resistanceRollResult: null,
    actionPayload: e.actionPayload ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: s_(e.context),
    executed: !1
  };
}
function Wi(e, t, n) {
  D_();
  const r = Pt(t);
  if (!r) return;
  const o = I_(e, r);
  o.length > 0 && pt(r);
  for (const i of o)
    $n(r, i);
  Zi(r, n), Rn(r), wn(r);
}
function Eo(e) {
  for (const t of Db)
    globalThis.setTimeout(() => {
      Ob(e);
    }, t);
}
function Ob(e) {
  for (const t of Fb()) {
    const n = vt(t);
    Mb(n) && Wi(n, t, e);
  }
}
function Fb() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Mb(e) {
  return e ? or(e) ? !0 : N_(e).length > 0 : !1;
}
function Ki(e) {
  const t = v.get(e);
  if (!t) return;
  const n = t.messageId ? S_(t.messageId) : null;
  if (n) {
    Do(n, t), pt(n), $n(n, t), Co(n), Rn(n), wn(n);
    return;
  }
  if (t.messageId) {
    Cn(t);
    return;
  }
  const r = L_(t);
  if (r) {
    Do(r, t), pt(r), $n(r, t), Co(r), Rn(r), wn(r);
    return;
  }
  Cn(t);
}
function Co(e) {
  Tn && Zi(e, Tn);
}
function pt(e) {
  const t = Bb();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Qi(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(To) === "true") return;
  const r = n.querySelector(`.${An}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(To, "true");
}
function Bb() {
  try {
    return yl() === "replace";
  } catch {
    return !1;
  }
}
function $n(e, t) {
  if (pt(e), e.querySelector(`[${Lt}="${ye(t.pendingId)}"]`)) return;
  const n = Ub(e, t);
  zb(n, t), n_(n, r_(t)).append(i_(t));
}
function Ub(e, t) {
  const n = e.querySelector(`.${An}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(An, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const i = document.createElement("span");
  i.classList.add(`${h}__kicker`), i.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Ib), s.textContent = qb(t);
  const l = document.createElement("span");
  return l.classList.add(Gi), l.textContent = t.summary, o.append(i, s, l), r.append(o), c_(e).append(r), r;
}
function qb(e) {
  const t = C(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function zb(e, t) {
  const n = t.summaryLines ?? [], r = ts(n, t);
  if (r) {
    jb(e, r, t);
    return;
  }
  o_(e, n);
}
function jb(e, t, n) {
  if (e.querySelector(`[${Ao}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Ro, `${Ro}--${t.intent}`), r.setAttribute(Ao, "true"), t.castingCheck && Io(r, Vb(t.castingCheck), n.pendingId, "casting"), Gb(t) && Io(r, Hb(t), n.pendingId, "effect"), Zb(r, t), Xb(r, t, n), t_(r, t), e.append(r);
}
function Gb(e) {
  return e.intent !== "casting";
}
function Vb(e) {
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
function Hb(e) {
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
function Io(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${h}__workflow-section--${t.status}`);
  const i = document.createElement("div");
  i.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, i.append(s), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, i.append(l);
  }
  if (o.append(i), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, o.append(l);
  }
  Wb(o, t), e_(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Wb(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const i = Kb(t.formula, t.diceBreakdown);
  i && n.append(i), e.append(n);
}
function Kb(e, t) {
  const n = Yb(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of Qb(n, e)) {
    const i = document.createElement("span");
    i.classList.add(`${h}__workflow-die`), o.active || i.classList.add(`${h}__workflow-die--inactive`), i.textContent = String(o.value), r.append(i);
  }
  return r;
}
function Yb(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Qb(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? So(e, "highest") : n.includes("kl") ? So(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function So(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const i = !r && o === n;
    return i && (r = !0), { value: o, active: i };
  });
}
function Zb(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(X_);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const i = document.createElement("span");
    i.classList.add(`${h}__roll-meta-pill`), i.textContent = o, r.append(i);
  }
  e.append(r);
}
function Xb(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const i = document.createElement("strong");
  i.textContent = "Resistência";
  const s = Jb(t, n);
  o.append(i), s && o.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(o, l), t.resistanceRollResult && r.append(Yi(t.resistanceRollResult)), e.append(r);
}
function Jb(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Lt, t.pendingId), n.setAttribute(Mi, "true"), n.setAttribute(Bi, e.resistanceSkill), n.setAttribute(Ui, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(qi, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(zi, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(ji, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Yi(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = Ji(e), t;
}
function e_(e, t, n, r, o) {
  const i = t.filter((d) => d.value.trim().length > 0);
  if (i.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(er, s), l.setAttribute("aria-expanded", "false"), l.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(Fi, s), u.hidden = !0;
  for (const d of i) {
    const f = document.createElement("dt");
    f.textContent = d.label;
    const y = document.createElement("dd");
    y.textContent = d.value, u.append(f, y);
  }
  e.append(l, u);
}
function t_(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function n_(e, t) {
  const n = `[${_o}="${ye(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Cb), o.setAttribute(_o, t.id);
  const i = document.createElement("strong");
  return i.classList.add(`${h}__actions-title`), i.textContent = t.title, o.append(i), e.append(o), o;
}
function r_(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = ts(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function o_(e, t) {
  if (t.length === 0) return;
  const n = a_(e);
  for (const r of t) {
    const o = J_(r);
    if (n.querySelector(`[${yo}="${ye(o)}"]`)) continue;
    const i = document.createElement("li");
    i.textContent = r, i.setAttribute(yo, o), n.append(i);
  }
}
function a_(e) {
  const t = e.querySelector(`.${$o}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add($o), e.append(n), n;
}
function i_(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(Lt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Vi), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Dt, e.pendingId), t.setAttribute(Jn, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(yn, e.choiceGroupId), t.setAttribute(Oi, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function s_(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = l_(e);
  return `${t} → ${n}`;
}
function l_(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function c_(e) {
  return Qi(e) ?? e;
}
function Qi(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Zi(e, t) {
  const n = Pt(e);
  if (!n) return;
  const r = n.querySelectorAll(wb);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      R_(o, t);
    }));
}
function Rn(e) {
  const t = Pt(e);
  if (!t) return;
  const n = t.querySelectorAll(kb);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      u_(t, r);
    }));
}
function wn(e) {
  const t = Pt(e);
  if (!t) return;
  const n = t.querySelectorAll(Eb);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      d_(t, r);
    }));
}
function u_(e, t) {
  const n = t.getAttribute(er);
  if (!n) return;
  const r = e.querySelector(`[${Fi}="${ye(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function d_(e, t) {
  const n = t.getAttribute(Lt), r = t.getAttribute(Bi), o = t.getAttribute(Ui) ?? (r ? Ue(r) : "Resistência");
  if (!n || !r) return;
  const i = p_(e, n), s = g_(i, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Da(s, r);
    await A_(u.roll);
    const d = {
      skill: r,
      skillLabel: o,
      formula: u.formula,
      total: u.total,
      targetName: s.name ?? i?.resistanceTargetName ?? "alvo",
      diceBreakdown: u.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    m_(t, d), f_(t, d), T_(n, d), await $_(e, n, d);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function m_(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(ji, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function f_(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Yi(t);
  if (r) {
    r.textContent = Ji(t);
    return;
  }
  n.append(o);
}
function p_(e, t) {
  const n = v.get(t);
  if (n) return n;
  const r = vt(e);
  return B(r)[t] ?? null;
}
function g_(e, t) {
  const n = e?.resistanceTargetActor;
  if (O(n)) return n;
  const o = e?.context?.targets.map(kn).find(O) ?? null;
  if (o) return o;
  const i = t.getAttribute(qi) ?? e?.resistanceTargetActorId ?? null, s = i ? b_(i) : null;
  return s || __(
    t.getAttribute(zi) ?? e?.resistanceTargetName ?? h_(t)
  );
}
function h_(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Gi}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), i = o[o.length - 1]?.trim();
  return i && i.length > 0 ? i : null;
}
function kn(e) {
  const t = e.actor;
  if (O(t)) return t;
  const n = e.token, r = Oe(n);
  if (r) return r;
  const o = e.document;
  return Oe(o);
}
function Oe(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (O(t)) return t;
  const n = e.document?.actor;
  return O(n) ? n : null;
}
function b_(e) {
  const n = game.actors?.get?.(e);
  return O(n) ? n : Xi().map((i) => Oe(i)).find((i) => i?.id === e) ?? null;
}
function __(e) {
  const t = de(e);
  if (!t) return null;
  const n = Xi().filter((i) => de(y_(i)) === t).map((i) => Oe(i)).find(O) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((i) => O(i) && de(i.name) === t);
  return O(o) ? o : null;
}
function Xi() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function y_(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Oe(e)?.name ?? null;
}
function de(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function O(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ji(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function A_(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function T_(e, t) {
  const n = v.get(e);
  n && (n.resistanceRollResult = t);
}
async function $_(e, t, n) {
  const r = vt(e);
  if (r)
    try {
      const o = B(r), i = o[t];
      if (!i) return;
      o[t] = {
        ...i,
        resistanceRollResult: n
      }, await _e(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function vt(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return M(r?.get?.(n));
}
async function R_(e, t) {
  const n = e.getAttribute(Dt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    es(e, e.getAttribute(Jn) ?? "✓ Automação aplicada"), w_(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function es(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Vi), e.removeAttribute(Dt), e.removeAttribute(Jn);
}
function w_(e) {
  const t = e.getAttribute(yn);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${yn}="${ye(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const i = o.getAttribute(Oi) ?? "✓ Outra opção escolhida";
    es(o, i);
  }
}
function ts(e, t) {
  const n = e.map(nr).filter(Q_), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = C(e, "Forma"), i = C(e, "Custo"), s = C(e, "Dados") ?? C(e, `Dados (${r.label})`), l = C(e, "Tipo"), u = C(e, "Resistência"), d = C(e, "Resistência Perícia"), f = C(e, "Resistência Rótulo") ?? (d ? Ue(d) : null), y = ns(e, "Observação"), T = e.filter((g) => C_(g, r)), $ = k_(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: i,
    diceBreakdown: s,
    damageType: l,
    resistance: u,
    resistanceSkill: d,
    resistanceSkillLabel: f,
    notes: y,
    details: T,
    castingCheck: $,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function k_(e) {
  const t = e.map(nr).find((i) => i?.intent === "casting") ?? null, n = C(e, "Conjuração DT"), r = C(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: C(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: C(e, "Dados (Conjuração)")
  } : null;
}
function nr(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, i = Number(o);
  return Number.isFinite(i) ? {
    label: n,
    formula: r,
    total: i,
    intent: E_(n)
  } : null;
}
function E_(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function C(e, t) {
  return ns(e, t)[0] ?? null;
}
function ns(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function C_(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || nr(e) ? !1 : e.trim().length > 0;
}
function I_(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of v.values())
    En(r, e, t) && n.set(r.pendingId, r);
  for (const r of P_(e))
    En(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function En(e, t, n) {
  const r = H(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !Lo(n, "itemId", e.itemId) ? !1 : !e.actorId || Lo(n, "actorId", e.actorId);
}
function Lo(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${ey(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function S_(e) {
  const t = ye(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function L_(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (En(e, null, t))
      return t;
  return null;
}
function D_() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of v.entries())
    e - r.createdAt > t && v.delete(n);
}
async function Do(e, t) {
  const n = vt(e);
  if (!n) return !1;
  try {
    const r = B(n);
    return r[t.pendingId] = ar(t, H(n)), await _e(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function rr(e) {
  const t = is(e);
  if (!t) return !1;
  try {
    const n = B(t);
    return n[e.pendingId] = ar(e, H(t)), await _e(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function rs(e) {
  for (const t of Sb)
    globalThis.setTimeout(() => {
      Cn(e);
    }, t);
}
async function Cn(e) {
  const t = is(e);
  if (or(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await rr(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function v_(e, t) {
  const n = as(e.context.message);
  if (n)
    try {
      const r = B(n), o = r[e.pendingId] ?? ar(e, H(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await _e(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function P_(e) {
  return Object.values(B(M(e))).filter(ze);
}
function B(e) {
  if (!e) return {};
  const t = {}, n = or(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(os(e)))
    t[r] ??= o;
  return t;
}
function N_(e) {
  return Object.values(os(M(e))).filter(ze);
}
function os(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, Ni);
  if (!ge(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    ze(o) && (n[r] = o);
  return n;
}
async function _e(e, t) {
  typeof e.setFlag == "function" && (await O_(e, t), await x_(e, t));
}
async function x_(e, t) {
  await Promise.resolve(e.setFlag?.(c, Ni, t));
}
function or(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, xi);
  return K_(t) ? t : null;
}
async function O_(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(ze).sort((i, s) => i.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((i) => i.createdAt)),
    messageId: r.messageId ?? H(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: F_(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(c, xi, o));
}
function F_(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function ar(e, t) {
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
function as(e) {
  const t = M(e);
  if (t?.setFlag)
    return t;
  const n = M_(e);
  if (n?.setFlag)
    return n;
  const r = H(e);
  if (!r) return null;
  const o = game.messages;
  return M(o?.get?.(r));
}
function M_(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(M).find((n) => typeof n?.setFlag == "function") ?? null;
}
function is(e) {
  const t = as(e.context.message);
  if (t) return t;
  const n = e.messageId ? B_(e.messageId) : null;
  if (n) return n;
  const r = cs().slice().reverse();
  return r.find((o) => U_(o, e)) ?? r.find((o) => q_(o, e)) ?? null;
}
function B_(e) {
  const t = game.messages;
  return M(t?.get?.(e));
}
function U_(e, t) {
  const n = H(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!ss(e, t)) return !1;
  const o = ls(e);
  return !t.actorId || !o || o === t.actorId;
}
function q_(e, t) {
  if (!j_(e, t)) return !1;
  const n = ls(e);
  return t.actorId && n === t.actorId ? !0 : ss(e, t);
}
function ss(e, t) {
  const n = de(z_(e));
  if (!n) return !1;
  const r = de(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = de(t.itemId);
  return !!(o && n.includes(o));
}
function z_(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function ls(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function j_(e, t) {
  const n = G_(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Lb;
}
function G_(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function M(e) {
  return e && typeof e == "object" ? e : null;
}
function ze(e) {
  return ge(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && Z(e.resistanceTargetActorId) && Z(e.resistanceTargetName) && Y_(e.resistanceRollResult) && V_(e.actionPayload) && Kt(e.title) && Kt(e.buttonLabel) && Kt(e.executedLabel) && Z(e.choiceGroupId) && Z(e.skippedLabel) && Z(e.actionSectionId) && Z(e.actionSectionTitle) && Z_(e.summaryLines) : !1;
}
function V_(e) {
  return e == null ? !0 : ge(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && H_(e.resource) && W_(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function H_(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function W_(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function K_(e) {
  return ge(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && ge(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ze) : !1;
}
function Y_(e) {
  return e == null ? !0 : ge(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Q_(e) {
  return e !== null;
}
function ge(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function S(e) {
  return e === null || typeof e == "string";
}
function Kt(e) {
  return e === void 0 || typeof e == "string";
}
function Z(e) {
  return e == null || typeof e == "string";
}
function Z_(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function X_(e) {
  return typeof e == "string" && e.length > 0;
}
function cs() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(M).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(M).filter((r) => r !== null) : [];
}
function Pt(e) {
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
function J_(e) {
  return e.trim().toLowerCase();
}
function ey(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ye(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const vo = 1e3;
class ty {
  constructor(t, n, r, o, i, s) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = i, this.debugOutput = s, this.ritualAssistant = new Eh(
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
      settings: gr(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = gr();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Sn(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && cy(t.item) && n.executionMode === "ask") {
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
    if (await uo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Zt(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await Wt(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Wt(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = tr(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = my(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const i = await ct(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return i.ok ? (await Nb(t), await xb(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(i), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (vb(
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
    if (await uo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Zt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      uy(t.item)
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
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), m.info(
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
      return o.ok ? (ly(n, o.value), await ny(o.value), {
        ok: !0,
        executedLabel: ry(o.value)
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
    const n = Yt(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && Yt(o.action) === n);
    for (const [o, i] of r)
      i.kind === "assisted-action" && i.id !== t.id && (this.pendingExecutions.delete(o), await Wt(
        o,
        No(i.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Xt();
    await Pb({
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
    let i;
    for (const s of r) {
      const l = Xt();
      i ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await ko({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Yt(s),
        skippedLabel: No(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: dy(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      i
    ), m.info(
      "Ritual assistido preparado com ações pendentes.",
      ee(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = Xt();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await ko({
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
    this.setAttempt(t, "completed"), m.info(
      "Automação executada por uso normal de item.",
      ee(o.value.context)
    );
  }
  handleAutomationFailure(t) {
    const n = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      m.warn(n, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      m.error(n, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    m.warn(n, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    m.warn(
      `Ação assistida falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  handleDamageActionFailure(t) {
    m.warn(`Ação assistida de dano falhou: ${t.message}`, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleConditionActionFailure(t) {
    m.warn(
      `Ação assistida de condição falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const n = Date.now(), r = xo(t);
    for (const [i, s] of this.recentExecutionKeys.entries())
      n - s > vo && this.recentExecutionKeys.delete(i);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= vo;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(xo(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = Zt(
      t,
      n,
      r,
      o
    );
  }
}
async function ny(e) {
  const t = sy();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: oy(e)
      });
    } catch (n) {
      m.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function ry(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function oy(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${at(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = ay(e), i = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${at(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${at(e.actorName)}</strong></p>
      <ul>
        ${t}
        ${n}
        ${r}
        ${o}
        ${i}
      </ul>
    </div>
  `;
}
function ay(e) {
  const t = iy(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${at(o)}</li>`;
}
function iy(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = Po(n?.value);
  return r === null ? null : {
    value: r,
    max: Po(n?.max)
  };
}
function Po(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function sy() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function at(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function Yt(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function No(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function ly(e, t) {
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
function cy(e) {
  return e.type === "ritual";
}
function uy(e) {
  return Fg(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function dy(e) {
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
function my(e) {
  const t = e.actorUuid ? fy(e.actorUuid) : null;
  if (he(t)) return t;
  const n = e.actorId ? py(e.actorId) : null;
  return n || gy(e.actorName);
}
function fy(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function py(e) {
  const n = game.actors?.get?.(e);
  if (he(n)) return n;
  for (const r of us()) {
    const o = ir(r);
    if (o?.id === e) return o;
  }
  return null;
}
function gy(e) {
  const t = Qt(e);
  if (!t) return null;
  for (const o of us()) {
    const i = hy(o);
    if (Qt(i) === t) {
      const s = ir(o);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (o) => he(o) && Qt(o.name) === t
  );
  return he(r) ? r : null;
}
function us() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function hy(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : ir(e)?.name ?? null;
}
function ir(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (he(t)) return t;
  const n = e.document?.actor;
  return he(n) ? n : null;
}
function Qt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function he(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Zt(e, t, n, r) {
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
function xo(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Xt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class by {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], i = Me(t);
    for (const s of n) {
      const l = s.itemId ? i.find((f) => f.id === s.itemId) ?? null : null, u = s.match?.preset ?? null;
      if (!l || !u) {
        o.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(l, u);
      const d = await this.itemPatches.applyPresetItemPatch(l, u);
      r.push({
        itemId: l.id ?? null,
        itemName: l.name ?? "Ritual sem nome",
        presetId: u.id,
        presetLabel: u.label,
        previousStatus: s.status,
        itemPatch: d
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
class _y {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Me(t).map((l) => this.analyzeRitual(l)), r = n.filter(Xe("upToDate")), o = n.filter(Xe("available")), i = n.filter(Xe("outdated")), s = n.filter(Xe("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: o,
      outdated: i,
      unsupported: s,
      canApply: o.length > 0 || i.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = yy(t);
    return n ? r ? r.source.type !== "preset" ? we({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? we({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : we({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: Ay(r, n.preset)
    }) : we({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : we({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function we(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? bt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function yy(e) {
  const t = e.getFlag(c, "automation");
  return Ln(t) ? t : null;
}
function Ay(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Xe(e) {
  return (t) => t.status === e;
}
class Ty {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = vn(t.transaction);
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
    const n = A(t.actorName), r = A(t.resource), o = A(Oo(t)), i = A(Ry(t));
    return `
      <section class="${c}-card ${c}-resource-card">
        <header class="${c}-card__header">
          <strong>${o}</strong>
          <span>${n}</span>
        </header>
        <div class="${c}-card__body">
          <p><strong>${i}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, n) {
    const r = A(n.title ?? "Automação"), o = n.message ? `<p>${A(n.message)}</p>` : "", i = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = A(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((g) => A(g.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map(
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A($y(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), d = t.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(wy(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), y = t.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(Oo(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), $ = t.phases.map((g) => A(g)).join(" &rarr; ");
    return `
      <section class="${c}-card ${c}-workflow-card">
        <header class="${c}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${c}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${i}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${d.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${u.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Dano:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Cura:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${$.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${$}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function $y(e) {
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
function Oo(e) {
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
function Ry(e) {
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
function wy(e) {
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
function ky() {
  const e = new Gm(), t = new Uf(e), n = new Bm(), r = new Wm(), o = new Qm(r), i = new df(e), s = new ff(), l = s.registerMany(
    Zs()
  );
  if (!l.ok)
    throw new Error(l.error.message);
  const u = new mf(), d = new cf(), f = pg(), y = new ap(f), T = new _y(
    s
  ), $ = new by(
    T,
    u,
    d
  ), g = new Gf(), P = new Ty(g), Te = new jf(), $e = new Mf(
    t,
    o,
    P,
    Te
  ), Re = new zf($e, Te), w = new ty(
    Re,
    t,
    o,
    n,
    y,
    g
  );
  return w.addStrategy(
    new sf(
      (U) => w.handleItemUsed(U)
    )
  ), {
    ordem: i,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: o,
    resources: t,
    damage: n,
    automationRegistry: s,
    automationBinder: u,
    itemPatches: d,
    conditionRegistry: f,
    conditions: y,
    debugOutput: g,
    chatMessages: P,
    workflowHooks: Te,
    automation: $e,
    workflow: Re,
    itemUseIntegration: w,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: $
  };
}
const { ApplicationV2: Ey } = foundry.applications.api;
class gt extends Ey {
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
      apply: gt.onApply,
      cancel: gt.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${N(In)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${N(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Jt("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Jt("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Jt("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Jt(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${N(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Cy(n) : Sy(t)}
    </section>
  `;
}
function Cy(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Iy).join("")}</ol>`;
}
function Iy(e) {
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
function Sy(e) {
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
const ht = `${c}.manageRitualPresets`, Fo = `__${c}_ritualPresetHeaderControlRegistered`, Ly = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Dy(e) {
  const t = globalThis;
  if (!t[Fo]) {
    for (const n of Ly)
      Hooks.on(n, (r, o) => {
        vy(r, o, e);
      });
    t[Fo] = !0, m.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function vy(e, t, n) {
  Array.isArray(t) && Ny(e) && (Py(e, n), !t.some((r) => r.action === ht) && t.push({
    action: ht,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), ds(e, n);
    }
  }));
}
function Py(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[ht] && (e.options.actions[ht] = (n) => {
    n.preventDefault(), n.stopPropagation(), ds(e, t);
  }));
}
function Ny(e) {
  if (!game.user?.isGM) return !1;
  const t = ms(e);
  return t ? t.type === "agent" && Me(t).length > 0 : !1;
}
function ds(e, t) {
  const n = ms(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new gt(n, t).render({ force: !0 });
}
function ms(e) {
  return Mo(e.actor) ? e.actor : Mo(e.document) ? e.document : null;
}
function Mo(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const fs = "data-paranormal-toolkit-ritual-roll-config", je = "data-paranormal-toolkit-ritual-roll-field", te = "data-paranormal-toolkit-ritual-roll-action", Bo = `__${c}_ritualRollConfigBlockRegistered`, xy = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], Oy = [
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
function Fy() {
  const e = globalThis;
  if (!e[Bo]) {
    My();
    for (const t of xy)
      Hooks.on(t, (...n) => {
        By(n[0], n[1]);
      });
    e[Bo] = !0, m.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function My() {
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
function By(e, t) {
  const n = Jy(e);
  if (!n || n.type !== "ritual") return;
  const r = nA(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  qy(o);
  const i = gs(n), s = Ii(n), l = eA(n), u = zy(n, s, i, l);
  Ky(u, n, i, l), Uy(o, u), sr(u);
}
function Uy(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function qy(e) {
  for (const t of Array.from(e.querySelectorAll(`[${fs}]`)))
    t.remove();
}
function zy(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${c}-ritual-roll-config`), o.setAttribute(fs, e.uuid ?? e.id ?? "ritual");
  const i = document.createElement("header");
  i.classList.add(`${c}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${c}-ritual-roll-config__title`), s.append(Uo("strong", "Paranormal Toolkit")), s.append(Uo("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${c}-ritual-roll-config__badge`), l.textContent = bs(t) ? "Configurada" : "Rascunho", i.append(s, l), o.append(i);
  const u = document.createElement("p");
  u.classList.add(`${c}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const d = document.createElement("div");
  d.classList.add(`${c}-ritual-roll-config__fields`), d.append(jy(t, r)), d.append(Gy(t, r)), d.append(Vy(t, r)), o.append(d), o.append(Hy(t, n, r)), o.append(Wy(r));
  const f = document.createElement("p");
  return f.classList.add(`${c}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function jy(e, t) {
  const n = Nt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(je, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const i = document.createElement("option");
    i.value = o, i.textContent = Og(o), i.selected = e.intent === o, r.append(i);
  }
  return n.append(r), n;
}
function Gy(e, t) {
  const n = Nt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(je, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const i of Oy) {
    const s = document.createElement("option");
    s.value = i.value, s.textContent = i.label, s.selected = e.damageType === i.value, r.append(s);
  }
  return n.append(r), n;
}
function Vy(e, t) {
  const n = Nt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(je, "utilityLabel"), n.append(r), n;
}
function Hy(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${c}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${c}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const i = document.createElement("div");
  return i.classList.add(`${c}-ritual-roll-config__forms-grid`), i.append(en("base", "Padrão", e.forms.base.formula, !0, n)), i.append(en("discente", "Discente", e.forms.discente.formula, t.discente, n)), i.append(en("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(i), r;
}
function en(e, t, n, r, o) {
  const i = Nt(t);
  i.classList.add(`${c}-ritual-roll-config__form-card`), i.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !o || !r, s.setAttribute(je, `formula.${e}`), i.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", i.append(l);
  }
  return i;
}
function Wy(e) {
  const t = document.createElement("div");
  t.classList.add(`${c}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(te, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(te, "clear"), t.append(n, r), t;
}
function Nt(e) {
  const t = document.createElement("label");
  t.classList.add(`${c}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Uo(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function Ky(e, t, n, r) {
  Ae(e, "intent")?.addEventListener("change", () => sr(e)), jo(e, "system.studentForm")?.addEventListener("change", () => qo(e, t)), jo(e, "system.trueForm")?.addEventListener("change", () => qo(e, t)), e.querySelector(`[${te}="save"]`)?.addEventListener("click", () => {
    r && Yy(e, t, n);
  }), e.querySelector(`[${te}="clear"]`)?.addEventListener("click", () => {
    r && Qy(e, t);
  });
}
async function Yy(e, t, n) {
  const r = e.querySelector(`[${te}="save"]`);
  r?.setAttribute("disabled", "true"), me(e, "Salvando configuração...");
  try {
    const o = Zy(e, n);
    await Ng(t, o), ps(e, o), me(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), me(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function Qy(e, t) {
  const n = e.querySelector(`[${te}="clear"]`);
  n?.setAttribute("disabled", "true"), me(e, "Limpando configuração...");
  try {
    await xg(t);
    const r = Ii(t);
    Xy(e, r), ps(e, r), me(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), me(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function ps(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__badge`);
  n && (n.textContent = bs(t) ? "Configurada" : "Rascunho");
}
function Zy(e, t) {
  return {
    schemaVersion: 1,
    intent: hs(Ae(e, "intent")?.value),
    damageType: Go(e, "damageType"),
    utilityLabel: Go(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: it(e, "formula.base") },
      discente: { formula: it(e, "formula.discente") },
      verdadeiro: { formula: it(e, "formula.verdadeiro") }
    }
  };
}
function Xy(e, t) {
  ae(e, "intent", t.intent), ae(e, "damageType", t.damageType ?? ""), ae(e, "utilityLabel", t.utilityLabel ?? "Resultado"), ae(e, "formula.base", t.forms.base.formula), ae(e, "formula.discente", t.forms.discente.formula), ae(e, "formula.verdadeiro", t.forms.verdadeiro.formula), sr(e);
}
function sr(e) {
  const t = hs(Ae(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function qo(e, t) {
  const n = gs(t);
  zo(e, "discente", n.discente), zo(e, "verdadeiro", n.verdadeiro);
}
function zo(e, t, n) {
  const r = Ae(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${te}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const i = r.closest(`.${c}-ritual-roll-config__field`), s = i?.querySelector("small");
  if (i) {
    if (n) {
      s?.remove();
      return;
    }
    if (!s) {
      const l = document.createElement("small");
      l.textContent = "Indisponível neste ritual.", i.append(l);
    }
  }
}
function me(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function gs(e) {
  const t = tA(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function Jy(e) {
  return Vo(e.item) ? e.item : Vo(e.document) ? e.document : null;
}
function eA(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function tA(e) {
  const t = e.system;
  return rA(t) ? t : {};
}
function jo(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Ae(e, t) {
  return e.querySelector(`[${je}="${oA(t)}"]`);
}
function it(e, t) {
  return Ae(e, t)?.value.trim() ?? "";
}
function Go(e, t) {
  const n = it(e, t);
  return n.length > 0 ? n : null;
}
function ae(e, t, n) {
  const r = Ae(e, t);
  r && (r.value = n);
}
function hs(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function bs(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function nA(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Vo(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function rA(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function oA(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let J = null;
Hooks.once("init", () => {
  Ks(), _l(), Xl(), Tm(), m.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!_r.isSupportedSystem()) {
    m.warn(
      `Sistema não suportado: ${_r.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  J = ky(), J.itemUseIntegration.registerStrategies(), Kl(J.conditions), Dl(J), zl(), Ml(), Cm(), Dy(J), Fy(), m.info("Inicializado para o sistema Ordem Paranormal."), m.info(
    `API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${In} inicializado.`);
});
function aA() {
  if (!J)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return J;
}
export {
  aA as getToolkitServices
};
//# sourceMappingURL=main.js.map
