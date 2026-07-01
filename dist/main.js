const l = "paranormal-toolkit", ln = "Paranormal Toolkit", Hi = "ordemparanormal";
class Pe {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function lt(e) {
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
    console.log(`${l} | ${t}`, ...n);
  }
  static warn(t, ...n) {
    console.warn(`${l} | ${t}`, ...n);
  }
  static error(t, ...n) {
    console.error(`${l} | ${t}`, ...n);
  }
}
function b(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function un(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : dn(t) ? b(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Gi(e) {
  return dn(e.getFlag(l, "automation"));
}
function dn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Ki(t.source) && Wi(t.definition);
}
function Wi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(Yi) && (t.conditionApplications === void 0 || ts(t.conditionApplications));
}
function Ki(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function Yi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Qi(t);
    case "spendRitualCost":
      return Zi(t);
    case "rollFormula":
      return Xi(t);
    case "modifyResource":
      return Ji(t);
    case "chatCard":
      return es(t);
    default:
      return !1;
  }
}
function Qi(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && So(t);
}
function Zi(e) {
  return e.type === "spendRitualCost";
}
function Xi(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || ss(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function Ji(e) {
  const t = e;
  return t.type === "modifyResource" && Lo(t.actor) && as(t.resource) && is(t.operation) && So(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function es(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function ts(e) {
  return Array.isArray(e) && e.every(ns);
}
function ns(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && Lo(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || rs(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel));
}
function rs(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || cs(t.rounds)) && (t.expiry === void 0 || t.expiry === null || os(t.expiry));
}
function os(e) {
  return e === "turnStart" || e === "turnEnd";
}
function So(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function Lo(e) {
  return e === "self" || e === "target";
}
function as(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function is(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function ss(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function cs(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function w(e) {
  return typeof e == "string" && e.length > 0;
}
function mn(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Hn);
    if (ds(t))
      return Array.from(t).filter(Hn);
  }
  return [];
}
function ls(e) {
  return mn(e)[0] ?? null;
}
function us(e) {
  return mn(e).find(Gi) ?? null;
}
function ds(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Hn(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ne(e) {
  return mn(e).filter((t) => t.type === "ritual");
}
function Do(e) {
  return Ne(e)[0] ?? null;
}
function ms(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(lt);
      return d.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = we("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Be(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Kn);
      return d.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = we("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Be(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const i = await zt(e, r, o.value);
      d.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: i }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = we("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Be(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        d.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await zt(e, n, r.preset);
      d.info(`Melhor preset aplicado em ${n.name}.`, { match: Kn(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Gn(e);
    },
    async applyBestPresetsToActorRituals() {
      return Gn(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = we("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Be(t);
      n && (await e.automationBinder.clear(n), d.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Gn(e) {
  const t = we("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Ne(t);
  if (n.length === 0)
    return d.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Wn(t);
  const r = Wn(t, n.length);
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
    const s = await zt(e, o, i.preset);
    r.applied.push(fs(o, i, s));
  }
  return d.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), ps(r), r;
}
async function zt(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function fs(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: lt(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Wn(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function ps(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Kn(e) {
  return {
    preset: lt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function we(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Be(e) {
  const t = Do(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ee(e) {
  return e ? {
    id: e.id,
    source: {
      ...gs(e.sourceActor),
      token: e.sourceToken
    },
    item: hs(e.item),
    targets: e.targets.map(bs),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Yn(e.rollRequests, vo),
    rolls: Yn(e.rolls, ys),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(fn),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function fn(e) {
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
function gs(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function hs(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function bs(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function vo(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ys(e) {
  return {
    ...vo(e),
    total: e.total
  };
}
function Yn(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function _s(e) {
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
    As(o.error);
    return;
  }
  const i = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: i });
  } catch (s) {
    d.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  d.info(`${t} realizado:`, fn(i));
}
function W(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function As(e) {
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
const x = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function $s() {
  Ue(x.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Ue(x.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Ue(x.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Ue(x.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function jt() {
  return {
    enabled: qe(x.enabled),
    console: qe(x.console),
    ui: qe(x.ui),
    chat: qe(x.chat)
  };
}
async function q(e, t) {
  await game.settings.set(l, x[e], t);
}
function Ue(e, t) {
  game.settings.register(l, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function qe(e) {
  return game.settings.get(l, e) === !0;
}
function Ts() {
  return {
    status() {
      return jt();
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
const Po = "ritual.costOnly", No = "ritual.simpleHealing", ws = "ritual.eletrocussao", xo = "ritual.simpleDamage", Oo = "generic.simpleHealing", Fo = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Rs() {
  return [
    ks(),
    Es(),
    Cs(),
    Is(),
    Ss()
  ];
}
function ks() {
  return {
    id: Po,
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
function Es() {
  return {
    id: No,
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
    automation: Mo(),
    itemPatch: Ds()
  };
}
function Cs() {
  return {
    id: ws,
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
    automation: Ls(),
    itemPatch: vs()
  };
}
function Is() {
  return {
    id: xo,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: pn()
  };
}
function Ss() {
  return {
    id: Oo,
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
function Mo(e = "2d8+2") {
  return Bo(
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
function Ls() {
  return {
    ...pn("3d6", {
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
function pn(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", i = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Bo(
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
function Ds() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Fo,
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
function vs() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Fo,
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
function Bo(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function gn() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ae(t.id),
    actorId: ae(t.actor?.id),
    sceneId: ae(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Uo() {
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
function Ps(e) {
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
        if (!Os(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(l, "ritual.cost", {
          resource: n,
          amount: t
        }), d.info(`Custo customizado aplicado em ${o.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = K("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = Y(t);
      n && (await n.unsetFlag(l, "ritual.cost"), d.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = K("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = Y(t);
      if (!n) return;
      const r = e.automationRegistry.require(Po);
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
      if (!Qn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(No);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Mo(t)
      }), d.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = K("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = Y(n);
      if (!r) return;
      if (!Qn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(xo);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: pn(t)
      }), d.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = K("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = Y(t);
      n && await Ns(e, t, n);
    }
  };
}
async function Ns(e, t, n) {
  const r = un(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Uo(),
    item: n,
    targets: gn()
  });
  if (!o.ok) {
    xs(o.error);
    return;
  }
  d.info("Automação de ritual executada com sucesso.", ee(o.value.context));
}
function xs(e) {
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
  const t = Do(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Os(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Qn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Fs = ["disabled", "ask", "automatic"], Ms = ["buttons", "confirm"], qo = "ask";
function Bs(e) {
  return typeof e == "string" && Fs.includes(e);
}
function Us(e) {
  return typeof e == "string" && Ms.includes(e);
}
function qs(e) {
  return Bs(e) ? e : Us(e) ? "ask" : qo;
}
const zs = ["keep", "replace"], js = ["manual", "assisted"], zo = "keep", jo = "assisted", Vs = !0, I = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Hs() {
  game.settings.register(l, I.executionMode, {
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
    default: qo
  }), game.settings.register(l, I.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: zo
  }), game.settings.register(l, I.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: jo
  }), game.settings.register(l, I.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Vs
  }), game.settings.register(l, I.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Zn() {
  const e = qs(game.settings.get(l, I.executionMode)), t = Ho(game.settings.get(l, I.systemCardMode)), n = Go(game.settings.get(l, I.damageResolutionMode));
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: Vo()
  };
}
function Gs() {
  return Ho(game.settings.get(l, I.systemCardMode));
}
function Ws() {
  return Go(game.settings.get(l, I.damageResolutionMode));
}
function Vo() {
  return game.settings.get(l, I.ritualCastingCheckEnabled) === !0;
}
async function Q(e) {
  await game.settings.set(l, I.executionMode, e);
}
function Ho(e) {
  return zs.includes(e) ? e : zo;
}
function Go(e) {
  return js.includes(e) ? e : jo;
}
function Ks(e) {
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
const Ys = [
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
function Qs(e) {
  return {
    phases() {
      return Ys;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = wt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = us(t);
      if (!n) {
        d.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Xn(e, t, n);
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
      if (!Js(n)) {
        d.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Xs(n) ?? wt("Nenhum ator encontrado para executar automação do item.");
      r && await Xn(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = wt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = ls(t);
      if (!n) {
        d.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Oo);
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
async function Xn(e, t, n) {
  const r = un(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Uo(),
    item: n,
    targets: gn()
  });
  if (!o.ok) {
    Zs(o.error);
    return;
  }
  d.info("Automação executada com sucesso.", ee(o.value.context));
}
function Zs(e) {
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
function wt(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Xs(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Js(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ec(e) {
  const t = _s(e), n = ms(e), r = Ps(e), o = Qs(e), i = Ts(), s = Ks(e);
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
    async spendSelectedActorPE(c) {
      await t.spendPE(c);
    }
  };
}
function tc(e) {
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
      const r = Jn();
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
      return nc(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Jn();
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
      return rc(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Jn() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const i = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(i, r);
  }
  return Array.from(t.values());
}
function nc(e) {
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
function rc(e) {
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
function oc(e) {
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
    conditions: tc(e.conditions),
    debug: ec(e)
  }, n = globalThis;
  return n[l] = t, n.ParanormalToolkit = t, t;
}
class er {
  static isSupportedSystem() {
    return game.system.id === Hi;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function ac() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ie(t.id),
    actorId: ie(t.actor?.id),
    sceneId: ie(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Wo() {
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
function ic(e, t = Wo()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function sc(e) {
  if (!uc(e)) return null;
  const t = e.getFlag(l, "workflow");
  return lc(t) ? t : null;
}
function cc() {
  return `flags.${l}.workflow`;
}
function tr(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${l}`), n = foundry.utils.getProperty(e, `_source.flags.${l}`);
  return t !== void 0 || n !== void 0;
}
function nr(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Vt(t) || Vt(n);
}
function lc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function uc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ie(e) {
  return Vt(e) ? e : null;
}
function Vt(e) {
  return typeof e == "string" && e.length > 0;
}
function dc() {
  const e = (t, n) => {
    mc(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function mc(e, t) {
  const n = sc(e);
  if (!n || n.targets.length === 0) return;
  const r = pc(t);
  if (!r || r.querySelector(`.${l}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(fc(n));
}
function fc(e) {
  const t = document.createElement("section");
  t.classList.add(`${l}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(rr("Origem", e.source.name)), t.append(rr("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function rr(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${l}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function pc(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function gc() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!hc(r) || !bc(e) || tr(e) || tr(t)) return;
    const o = ac();
    if (o.length === 0 || !nr(e) && !nr(t)) return;
    const i = Wo();
    e.updateSource({
      [cc()]: ic(o, i)
    }), d.info("Targets capturados para ChatMessage.", { source: i, targets: o });
  });
}
function hc(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function bc(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let or = !1, Rt = !1, kt = !1, ze = null;
const yc = 1e3, _c = 750, Ac = 1e3;
function $c(e) {
  or || (Hooks.on("combatTurnChange", (t) => {
    wc(e, ar(t));
  }), Hooks.on("deleteCombat", (t) => {
    Rc(e, ar(t));
  }), or = !0, Tc(e));
}
function Tc(e) {
  ut() && (Rt || (Rt = !0, globalThis.setTimeout(() => {
    Rt = !1, hn(e, "ready");
  }, yc)));
}
function wc(e, t) {
  ut() && t && (ze && globalThis.clearTimeout(ze), ze = globalThis.setTimeout(() => {
    ze = null, hn(e, "combat-turn-change", t);
  }, _c));
}
function Rc(e, t) {
  ut() && t && (kt || (kt = !0, globalThis.setTimeout(() => {
    kt = !1, hn(e, "combat-deleted", t);
  }, Ac)));
}
async function hn(e, t, n) {
  if (ut())
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
function ut() {
  return game.user?.isGM === !0;
}
function ar(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Ko = {
  enabled: "dice.animations.enabled"
};
function kc() {
  game.settings.register(l, Ko.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Ec() {
  return {
    enabled: game.settings.get(l, Ko.enabled) === !0
  };
}
const Yo = "chatCard", ir = "data-paranormal-toolkit-prompt-id", a = `${l}-item-use-prompt`, Cc = `.${a}__title`, Qo = `.${a}__header`, Ic = `.${a}__roll-card`, Sc = `.${a}__roll-meta`, Lc = `.${a}__roll-meta-pill`, bn = `.${a}__resistance`, Dc = `.${a}__resistance-header`, Zo = `.${a}__resistance-description`, yn = `.${a}__resistance-roll-button`, Xo = `.${a}__resistance-roll-result`, sr = `${a}__resistance-content`, Jo = `.${a}__workflow-section`, ea = `.${a}__workflow-roll`, ta = `${a}__workflow-roll--dice-open`, na = `.${a}__workflow-roll-formula`, ra = `${a}__workflow-roll-formula--toggle`, _n = `.${a}__workflow-dice-tray`, vc = `.${a}__roll-detail-toggle`, Pc = `.${a}__roll-detail-list`, Nc = `.${a}__ritual-element-badge`, xc = `.${a}__ritual-metadata`, Oc = "casting-backlash", Fc = "data-paranormal-toolkit-action-section", Mc = "data-paranormal-toolkit-prompt-id", Bc = "data-paranormal-toolkit-pending-id", cr = "data-paranormal-toolkit-casting-backlash-enhanced", lr = `.${a}`, Uc = `.${a}__workflow-section--casting`, qc = `.${a}__workflow-section-header`, zc = `.${a}__workflow-notes`, jc = `[${Fc}="${Oc}"]`, ur = `${a}__workflow-section-title-row`, Vc = `${a}__workflow-section-header--casting-backlash`, oa = `${a}__casting-backlash-button`;
function Hc(e) {
  for (const t of Gc(e))
    Wc(t), Xc(t);
}
function Gc(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(lr) && t.add(e);
  for (const n of e.querySelectorAll(lr))
    t.add(n);
  return Array.from(t);
}
function Wc(e) {
  const t = e.querySelector(jc);
  if (!t) return;
  const n = Kc(t);
  if (!n) return;
  const r = e.querySelector(`${Uc} ${qc}`);
  r && (r.classList.add(Vc), Yc(r), Qc(n), r.append(n), t.remove());
}
function Kc(e) {
  return e.querySelector(
    `button[${Bc}], button[${Mc}]`
  );
}
function Yc(e) {
  const t = e.querySelector(`:scope > .${ur}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(ur);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(oa) || n.append(o));
  return n;
}
function Qc(e) {
  if (e.getAttribute(cr) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Zc(t, e.disabled);
  e.classList.add(oa), e.setAttribute(cr, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Zc(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Xc(e) {
  for (const t of e.querySelectorAll(zc)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Jc(e) {
  for (const t of Array.from(e.querySelectorAll(Jo)))
    for (const n of Array.from(t.querySelectorAll(`${vc}, ${Pc}`)))
      n.remove();
}
const Re = "data-paranormal-toolkit-prompt-id", el = "data-paranormal-toolkit-resistance-roll-result", tl = "Conjuração DT";
function aa(e) {
  const t = e.querySelector(yn)?.getAttribute(el), n = Se(t);
  if (n !== null) return n;
  const r = e.querySelector(Xo)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Se(o?.[1] ?? null);
}
function ia(e) {
  const t = il(e), n = rl(t);
  if (n !== null) return n;
  const r = ol(t);
  return r !== null ? r : al(e);
}
function nl(e) {
  const t = e.getAttribute(Re);
  if (!t) return null;
  const n = ca(e), r = la(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((c) => dt(c) ? c.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function V(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function sa(e) {
  return V(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function rl(e) {
  const t = cl(e);
  return t.length === 0 ? null : Se(ll(t, tl));
}
function ol(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : dr(r, ["system", "ritual", "DT"]) ?? dr(r, ["system", "ritual", "dt"]);
}
function al(e) {
  const t = Array.from(e.querySelectorAll(`.${a}__workflow-section--casting .${a}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Se(n?.[1] ?? null);
}
function il(e) {
  const t = sl(e);
  if (!t) return null;
  const n = ca(e), r = la(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((i) => dt(i) ? i.pendingId === t : !1) ?? null;
}
function sl(e) {
  return (e.closest(`[${Re}]`) ?? e.querySelector(`[${Re}]`) ?? e.parentElement?.querySelector(`[${Re}]`) ?? null)?.getAttribute(Re) ?? null;
}
function ca(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return ul(o) ? o : null;
}
function la(e) {
  const t = e?.getFlag?.(l, Yo);
  return dt(t) ? t : null;
}
function cl(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function ll(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function dr(e, t) {
  let n = e;
  for (const r of t) {
    if (!dt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Se(typeof n == "string" ? n : null);
}
function Se(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function ul(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function dt(e) {
  return !!(e && typeof e == "object");
}
const dl = `.${a}__actions`, An = `.${a}__actions-title`, Xe = `.${a}__button`, ml = "data-paranormal-toolkit-action-section", fl = `${a}__button--executed`, pl = "data-paranormal-toolkit-executed-label";
function ua(e) {
  return V(e.querySelector(An)?.textContent);
}
function gl(e, t) {
  const n = e.querySelector(An);
  n && (n.textContent = t);
}
function $n(e, t) {
  const n = V(t);
  return Array.from(e.querySelectorAll(`.${a}__workflow-section`)).find((r) => {
    const o = r.querySelector(`.${a}__workflow-section-header strong`)?.textContent;
    return V(o) === n;
  }) ?? null;
}
function Tn(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${a}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function xe(e) {
  const t = document.createElement("span");
  return t.classList.add(`${a}__button-label`), t.textContent = e, t;
}
const hl = "data-paranormal-toolkit-damage-resolution-state", mr = "data-paranormal-toolkit-damage-icon-enhanced", bl = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function yl(e, t) {
  t.classList.add(`${a}__actions--embedded`, `${a}__actions--damage-resolution`), gl(t, "Aplicar dano"), _l(e, t);
}
function _l(e, t) {
  const n = Array.from(t.querySelectorAll(Xe)), r = fr(n, "normal"), o = fr(n, "half");
  if (!r || !o) {
    t.classList.add(`${a}__actions--compact`);
    return;
  }
  pr(r, "normal"), pr(o, "half");
  const i = Al();
  if (t.classList.toggle(`${a}__actions--assisted`, i === "assisted"), t.classList.toggle(`${a}__actions--manual`, i !== "assisted"), i !== "assisted") {
    z(r, !0), z(o, !0), je(t, "manual", null);
    return;
  }
  const s = aa(e), c = ia(e);
  if (c === null) {
    z(r, !0), z(o, !0), je(t, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (s === null) {
    z(r, !0), z(o, !1), je(t, "pending", null);
    return;
  }
  const u = s >= c;
  z(r, !u), z(o, u), je(
    t,
    u ? "resisted" : "failed",
    u ? `Resistiu: ${s} vs DT ${c}.` : `Falhou: ${s} vs DT ${c}.`
  );
}
function fr(e, t) {
  const n = bl[t];
  return e.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function pr(e, t) {
  if (e.getAttribute(mr) === "true") return;
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
  ), e.setAttribute(mr, "true"), e.setAttribute("aria-label", n), e.replaceChildren(r, xe(n));
}
function z(e, t) {
  e.hidden = !t, e.classList.toggle(`${a}__button--damage-resolution-selected`, t);
}
function je(e, t, n) {
  e.setAttribute(hl, t);
  const r = e.querySelector(`.${a}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${a}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(An)?.after(o);
}
function Al() {
  try {
    return Ws();
  } catch {
    return "assisted";
  }
}
const Le = "data-paranormal-toolkit-effect-icon-enhanced", me = "data-paranormal-toolkit-effect-action-compacted", mt = "data-paranormal-toolkit-effect-resistance-gate", wn = "data-paranormal-toolkit-effect-section", Rn = "data-paranormal-toolkit-effect-label";
function $l(e) {
  return e.querySelector(`[${wn}="true"]`);
}
function Tl(e) {
  const t = Rl(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? kl(), r = Nl(n, e.sourceActions, t);
  return r && n.setAttribute(Rn, r), El(n, t, r), vl(e.rollCard, n, e.after ?? e.fallbackAfter), Pl(e.sourceActions, n), n;
}
function wl(e, t) {
  const n = t.querySelector(Xe);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (ma(n, r)) {
    Ol(n);
    return;
  }
  const o = pa(t, n, r);
  if (!Fl(e, o)) {
    ga(n);
    return;
  }
  const i = ia(e), s = aa(e);
  if (i === null || s === null) {
    Ml(n);
    return;
  }
  if (s >= i) {
    Bl(n);
    return;
  }
  Ul(n, o);
}
function Rl(e) {
  return e.sourceActions?.querySelector(Xe) ?? e.existingSection?.querySelector(Xe) ?? null;
}
function kl() {
  const e = document.createElement("section");
  return e.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-action`
  ), e.setAttribute(wn, "true"), e;
}
function El(e, t, n) {
  e.setAttribute(wn, "true"), e.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-action`
  ), e.classList.remove(`${a}__actions`, `${a}__actions--effect-resolution`);
  const r = Cl(e), o = Il(r);
  o.textContent = "Efeito";
  const i = Sl(e, r), s = Ll(i);
  s.textContent = ql(n ?? pa(e, t, t.textContent?.trim() ?? ""));
  const c = Dl(i);
  t.parentElement !== c && c.append(t);
  const u = t.textContent?.trim() ?? "";
  !ma(t, u) && !xl(t, u) && fa(t, n ?? u);
}
function Cl(e) {
  const t = e.querySelector(`:scope > .${a}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${a}__workflow-section-header`), e.prepend(n), n;
}
function Il(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function Sl(e, t) {
  const n = e.querySelector(`:scope > .${a}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${a}__effect-section-body`), t.after(r), r;
}
function Ll(e) {
  const t = e.querySelector(`:scope > .${a}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${a}__effect-section-label`), e.prepend(n), n;
}
function Dl(e) {
  const t = e.querySelector(`:scope > .${a}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${a}__effect-section-action`), e.append(n), n;
}
function vl(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Pl(e, t) {
  !e || e === t || e.remove();
}
function Nl(e, t, n) {
  const r = e.getAttribute(Rn);
  if (r && r.trim().length > 0) return r.trim();
  const o = t?.querySelector(`.${a}__effect-resolution-label`)?.textContent?.trim();
  return o || da(n, n.textContent?.trim() ?? "");
}
function da(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && V(n) !== "efeito aplicado") return n;
  const r = nl(e);
  if (r) return r;
  const o = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && V(o) !== "aplicado" ? o : null;
}
function ma(e, t) {
  return e.classList.contains(fl) || V(t).includes("aplicado");
}
function xl(e, t) {
  const n = e.getAttribute(mt);
  if (n === "pending" || n === "resisted") return !0;
  const r = sa(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function fa(e, t) {
  e.getAttribute(me) === "true" && e.getAttribute(Le) === "true" || (e.disabled = !1, e.classList.add(`${a}__button--effect-resolution-action`), e.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), e.setAttribute(me, "true"), e.setAttribute(Le, "true"), e.setAttribute(pl, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Tn("✦", `${a}__button-icon--effect`),
    xe("Aplicar")
  ));
}
function Ol(e) {
  e.getAttribute(me) === "true" && V(e.textContent) === "✓ aplicado" || (e.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-applied`), e.classList.remove(
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), e.setAttribute(me, "true"), e.setAttribute(Le, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Tn("✓", `${a}__button-icon--effect-applied`),
    xe("Aplicado")
  ));
}
function pa(e, t, n) {
  const r = e.getAttribute(Rn) ?? e.querySelector(`.${a}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : da(t, n) ?? n;
}
function Fl(e, t) {
  if (!e.querySelector(bn)) return !1;
  const n = sa(t);
  return n.includes("vulneravel") || n.includes("vulnerable");
}
function Ml(e) {
  e.disabled = !0, e.removeAttribute(me), e.removeAttribute(Le), e.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-resisted`
  ), e.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-waiting`), e.setAttribute(mt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(xe("Role resistência"));
}
function Bl(e) {
  e.disabled = !0, e.removeAttribute(me), e.removeAttribute(Le), e.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-waiting`
  ), e.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-resisted`), e.setAttribute(mt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Tn("✓", `${a}__button-icon--effect-resisted`),
    xe("Resistiu")
  );
}
function Ul(e, t) {
  ga(e), fa(e, t);
}
function ga(e) {
  e.classList.remove(
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), e.removeAttribute(mt);
}
function ql(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const gr = "data-paranormal-toolkit-multi-target-section", ha = "data-paranormal-toolkit-multi-target-effect-info", ba = "data-paranormal-toolkit-multi-target-toggle", ya = "data-paranormal-toolkit-multi-target-details", Ht = "data-paranormal-toolkit-multi-target-target", zl = "data-paranormal-toolkit-multi-target-state", _a = "pending";
function jl(e) {
  const t = Vl(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${a}__roll-card--multi-target`), Ql(e);
  const n = Zl(e.rollCard);
  if (Xl(n, t), du(e.rollCard, n), t.effect) {
    const r = mu(e.rollCard);
    fu(r, t.effect), pu(e.rollCard, r, n);
  } else
    $a(e.rollCard)?.remove();
  return !0;
}
function Vl(e) {
  const t = Hl(e.rollCard).map((n, r) => ({
    id: gu(n, r),
    name: n,
    state: _a
  }));
  return t.length <= 1 || !e.damageSection ? null : {
    targets: t,
    damage: Gl(e.damageSection),
    effect: Wl(e.effectSection),
    resistance: Kl(e.damageSection)
  };
}
function Hl(e) {
  const n = e.closest(`.${a}`)?.querySelector(`.${a}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((o) => o.trim()).filter((o) => o.length > 0 && Ta(o) !== "nenhum alvo") : [];
}
function Gl(e) {
  const t = Yl(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Wl(e) {
  const t = e?.querySelector(`.${a}__effect-section-label`)?.textContent?.trim();
  return t && t.length > 0 ? { label: t } : null;
}
function Kl(e) {
  const t = e?.querySelector(`.${a}__resistance-description`)?.textContent?.trim();
  return t ? {
    description: t,
    formula: e?.querySelector(`.${a}__resistance .${a}__workflow-roll-formula`)?.textContent?.trim() ?? null
  } : null;
}
function Yl(e) {
  const t = e?.querySelector(`.${a}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Ql(e) {
  e.damageSection?.classList.add(`${a}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${a}__workflow-section--multi-target-effect-source`);
}
function Zl(e) {
  const t = e.querySelector(`[${gr}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--targets`
  ), n.setAttribute(gr, "true"), n;
}
function Xl(e, t) {
  const n = Jl(e);
  e.replaceChildren(eu(t), nu(t, n));
}
function Jl(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${Ht}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(Ht)).filter(hu)
  );
}
function eu(e) {
  const t = document.createElement("div");
  t.classList.add(`${a}__workflow-section-header`, `${a}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${a}__targets-status`), r.textContent = tu(e.targets), t.append(n, r), t;
}
function tu(e) {
  const t = e.length, n = e.filter((o) => o.state === _a).length, r = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && r.push(`${n} ${n === 1 ? "pendente" : "pendentes"}`), r.join(" • ");
}
function nu(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${a}__targets-list`);
  for (const r of e.targets)
    n.append(ru(r, e, t.has(r.id)));
  return n;
}
function ru(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${a}__target-row`, `${a}__target-row--pending`), r.setAttribute(Ht, e.id), r.setAttribute(zl, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`);
  const o = ou(e, t, r), i = cu(e, t);
  return i.hidden = !n, r.addEventListener("click", (s) => {
    br(s.target) || hr(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || br(s.target) || (s.preventDefault(), hr(r));
  }), r.append(o, i), r;
}
function ou(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${a}__target-summary`);
  const o = document.createElement("div");
  o.classList.add(`${a}__target-summary-main`);
  const i = au(e), s = document.createElement("strong");
  s.classList.add(`${a}__target-name`), s.textContent = e.name;
  const c = iu(), u = su(n);
  o.append(i, s, c, u);
  const m = document.createElement("div");
  return m.classList.add(`${a}__target-summary-actions`), m.append(
    Je("⚡", t.damage.normalCompactLabel, `${a}__target-action--damage`),
    Je("✦", "Efeito", `${a}__target-action--effect`)
  ), r.append(o, m), r;
}
function au(e) {
  const t = document.createElement("span");
  return t.classList.add(`${a}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function iu() {
  const e = document.createElement("button");
  e.type = "button", e.classList.add(`${a}__target-resistance-button`, `${a}__target-resistance-button--pending`), e.setAttribute("aria-label", "Rolar resistência do alvo"), e.setAttribute("aria-disabled", "true");
  const t = document.createElement("i");
  t.classList.add("fa-solid", "fa-dice-d20"), t.setAttribute("aria-hidden", "true");
  const n = document.createElement("span");
  return n.classList.add(`${a}__target-resistance-fallback`), n.textContent = "d20", e.append(t, n), e;
}
function Je(e, t, n) {
  const r = document.createElement("button");
  r.type = "button", r.classList.add(`${a}__target-action`, n, `${a}__target-action--pending`), r.disabled = !0;
  const o = document.createElement("span");
  o.classList.add(`${a}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const i = document.createElement("span");
  return i.classList.add(`${a}__target-action-label`), i.textContent = t, r.append(o, i), r;
}
function su(e) {
  const t = document.createElement("span");
  return t.classList.add(`${a}__target-toggle`), t.setAttribute(ba, "true"), t.setAttribute("aria-hidden", "true"), Aa(e, t), t;
}
function hr(e) {
  const t = e.querySelector(`[${ya}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${ba}="true"]`);
  r && Aa(e, r);
}
function Aa(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function br(e) {
  return e instanceof HTMLElement && !!e.closest("button, a, input, select, textarea");
}
function cu(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${a}__target-details`), n.setAttribute(ya, "true");
  const r = document.createElement("div");
  r.classList.add(`${a}__target-resistance-details`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const i = document.createElement("span");
  i.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(o, i);
  const s = lu(t.resistance?.formula ?? "—"), c = uu(t);
  return n.append(r, s, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function lu(e) {
  const t = document.createElement("div");
  t.classList.add(`${a}__target-formula`);
  const n = document.createElement("span");
  n.textContent = e;
  const r = document.createElement("i");
  return r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), t.append(n, r), t;
}
function uu(e) {
  const t = document.createElement("div");
  return t.classList.add(`${a}__target-details-actions`), t.append(
    Je("⚡", e.damage.normalLabel, `${a}__target-action--damage`),
    Je("✦", "Aplicar efeito", `${a}__target-action--effect`)
  ), t;
}
function du(e, t) {
  const n = $n(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function mu(e) {
  const t = $a(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-info`
  ), n.setAttribute(ha, "true"), n;
}
function $a(e) {
  return e.querySelector(`[${ha}="true"]`);
}
function fu(e, t) {
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
function pu(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function gu(e, t) {
  return `${t}-${Ta(e).replace(/[^a-z0-9]+/gu, "-")}`;
}
function Ta(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function hu(e) {
  return typeof e == "string" && e.length > 0;
}
const se = "data-paranormal-toolkit-prompt-id", bu = "data-paranormal-toolkit-card-layout-normalized", yr = "data-paranormal-toolkit-card-layout-refresh-bound", yu = "apply-damage", wa = [0, 80, 180, 400, 900, 1600, 3e3], _r = /* @__PURE__ */ new WeakSet();
function _u(e) {
  Ra(e), Au(e);
}
function Ra(e) {
  for (const t of Array.from(e.querySelectorAll(`.${a}__roll-card`)))
    Ea(ka(t));
}
function Au(e) {
  if (!_r.has(e)) {
    _r.add(e);
    for (const t of wa)
      globalThis.setTimeout(() => {
        Ra(e);
      }, t);
  }
}
function ka(e) {
  return {
    rollCard: e,
    damageSection: $n(e, "Dano"),
    resistance: e.querySelector(bn),
    damageActions: $u(e),
    effectActionSource: Tu(e),
    effectSection: $l(e)
  };
}
function Ea(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: o,
    effectActionSource: i,
    effectSection: s
  } = e;
  t.setAttribute(bu, "true"), t.classList.add(`${a}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), yl(t, o));
  const c = Tl({
    rollCard: t,
    existingSection: s,
    sourceActions: i,
    after: n,
    fallbackAfter: $n(t, "Conjuração")
  });
  c && wl(t, c), jl({
    rollCard: t,
    damageSection: n,
    effectSection: c ?? s
  }), Su(t);
}
function $u(e) {
  const t = wu(e);
  return t.find((n) => n.getAttribute(ml) === yu) ?? t.find((n) => ua(n) === "aplicar danos") ?? null;
}
function Tu(e) {
  const t = Ca(e), n = Ar(t);
  return n || Ar(Ru(e));
}
function Ar(e) {
  return e.find((t) => {
    const n = ua(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function wu(e) {
  const t = Ca(e);
  return t.length > 0 ? t : kn(e);
}
function Ca(e) {
  const t = Cu(e);
  return t ? kn(e).filter((n) => Eu(n, t)) : [];
}
function Ru(e) {
  const t = Ia(e);
  if (!t) return [];
  const n = ku(e, t);
  return kn(e).filter((r) => !r.closest(`.${a}__roll-card`)).filter((r) => Sa(e, r)).filter((r) => !n || Iu(r, n));
}
function kn(e) {
  const t = Ia(e);
  return t ? Array.from(t.querySelectorAll(dl)) : [];
}
function Ia(e) {
  return e.closest(`.${a}`) ?? e.parentElement;
}
function ku(e, t) {
  return Array.from(t.querySelectorAll(`.${a}__roll-card`)).find((n) => n !== e && Sa(e, n)) ?? null;
}
function Eu(e, t) {
  return e.getAttribute(se) === t ? !0 : Array.from(e.querySelectorAll(`[${se}]`)).some((n) => n.getAttribute(se) === t);
}
function Cu(e) {
  return e.getAttribute(se) ?? e.querySelector(`[${se}]`)?.getAttribute(se) ?? null;
}
function Sa(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Iu(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Su(e) {
  const t = e.querySelector(yn);
  t && t.getAttribute(yr) !== "true" && (t.setAttribute(yr, "true"), t.addEventListener("click", () => {
    for (const n of wa)
      globalThis.setTimeout(() => {
        Ea(ka(e));
      }, n);
  }));
}
const Lu = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function Du(e) {
  for (const t of Array.from(e.querySelectorAll(bn)))
    vu(t);
  _u(e);
}
function vu(e) {
  const t = e.querySelector(Dc), n = e.querySelector(Zo), r = e.querySelector(yn), o = e.querySelector(Xo);
  if (!r || !t && !n && !o) return;
  const i = Pu(e, r);
  t && t.parentElement !== i && i.append(t), n && n.parentElement !== i && i.append(n), o && (o.parentElement !== e && !r.contains(o) && e.append(o), Nu(o)), r.parentElement !== e && e.append(r);
}
function Pu(e, t) {
  const n = e.querySelector(`.${sr}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(sr), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function Nu(e) {
  const t = xu(e.textContent ?? "");
  t && (e.setAttribute(Lu, "true"), e.replaceChildren(Mu(t)));
}
function xu(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, i = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: c, diceValues: u } = Ou(r ?? "");
  return c ? {
    skillLabel: i,
    formula: c,
    total: Math.trunc(s),
    diceValues: u
  } : null;
}
function Ou(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Fu(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Fu(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Mu(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${a}__workflow-roll`,
    `${a}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${a}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Bu(e);
  return r && t.append(r), t;
}
function Bu(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${a}__workflow-dice-tray`);
  for (const n of Uu(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${a}__workflow-die`), n.active || r.classList.add(`${a}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Uu(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? $r(e, "highest") : n.includes("kl") ? $r(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function $r(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const i = !r && o === n;
    return i && (r = !0), { value: o, active: i };
  });
}
function Tr(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function En() {
  const e = globalThis.game;
  return ft(e) ? e : null;
}
function L(e, t) {
  const n = qu(e, t);
  return We(n);
}
function qu(e, t) {
  return t.split(".").reduce((n, r) => ft(n) ? n[r] : null, e);
}
function zu(e, t) {
  const n = e.indexOf(":");
  return n < 0 || De(e.slice(0, n)) !== De(t) ? null : ge(e.slice(n + 1));
}
function We(e) {
  return typeof e == "string" ? ge(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function ft(e) {
  return !!e && typeof e == "object";
}
function ju(e) {
  return typeof e == "string";
}
function pt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function ge(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function De(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Gt(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function H(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function La(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Vu(e) {
  for (const t of Array.from(e.querySelectorAll(Ic))) {
    const n = Zu(t);
    Hu(t), n && (Gu(t, n), Wu(t, n));
  }
}
function Hu(e) {
  for (const t of Array.from(e.querySelectorAll(Sc)))
    t.remove();
}
function Gu(e, t) {
  const r = e.closest(`.${a}`)?.querySelector(Qo) ?? null, o = r?.querySelector(Cc) ?? null, i = r ?? e, s = i.querySelector(Nc);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const c = s ?? document.createElement("span");
  if (c.className = pd(t.elementTone), c.textContent = fd(t), !s) {
    if (o?.parentElement === i) {
      o.insertAdjacentElement("afterend", c);
      return;
    }
    i.prepend(c);
  }
}
function Wu(e, t) {
  const n = Ku(e);
  Yu(e, n);
  const r = Qu(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${a}__ritual-metadata`);
  for (const s of r) {
    const c = document.createElement("span");
    c.classList.add(`${a}__ritual-metadata-chip`), c.textContent = s, o.append(c);
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
  const i = e.querySelector(Jo);
  if (i) {
    e.insertBefore(o, i);
    return;
  }
  e.prepend(o);
}
function Ku(e) {
  return e.closest(`.${a}`)?.querySelector(Qo) ?? null;
}
function Yu(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(xc)))
      o.remove();
}
function Qu(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Gt(e.target)}` : null,
    e.duration ? `Duração: ${Gt(e.duration)}` : null,
    e.resistance ? `Resistência: ${La(e.resistance)}` : null
  ].filter(pt);
}
function Zu(e) {
  const t = Xu(e), n = od(e), o = (t ? rd(t) : null)?.system ?? null, i = t?.summaryLines ?? [], s = Cn(L(o, "element")), c = F("op.elementChoices", s) ?? wr(X(i, "Elemento")) ?? wr(n.damageType), u = s ?? gd(c), m = L(o, "circle") ?? X(i, "Círculo"), f = sd(o) ?? X(i, "Alvo"), _ = dd(o, "duration", "op.durationChoices") ?? X(i, "Duração"), $ = ad(e) ?? ld(o) ?? X(i, "Resistência"), T = id(i) ?? n.cost, g = {
    elementLabel: c,
    elementTone: u,
    circle: m,
    cost: T,
    target: f,
    duration: _,
    resistance: $
  };
  return md(g) ? g : null;
}
function Xu(e) {
  const t = Ju(e);
  if (!t) return null;
  const n = t.getFlag?.(l, Yo), r = td(n);
  if (r.length === 0) return null;
  const o = ed(e);
  if (o.size > 0) {
    const i = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (i) return i;
  }
  return r.find((i) => i.itemId || i.summaryLines.length > 0) ?? null;
}
function Ju(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? En()?.messages?.get?.(n) ?? null : null;
}
function ed(e) {
  const t = e.closest(`.${a}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${ir}]`))) {
    const o = r.getAttribute(ir)?.trim();
    o && n.add(o);
  }
  return n;
}
function td(e) {
  if (!ft(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(nd).filter((n) => n !== null) : [];
}
function nd(e) {
  return ft(e) ? {
    pendingId: We(e.pendingId),
    actorId: We(e.actorId),
    itemId: We(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(ju) : []
  } : null;
}
function rd(e) {
  if (!e.itemId) return null;
  const t = En(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function od(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(Lc))) {
    const o = ge(r.textContent);
    if (!o) continue;
    const i = zu(o, "Tipo");
    i && (n = i), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function ad(e) {
  const t = ge(e.querySelector(Zo)?.textContent);
  return t ? La(t) : null;
}
function X(e, t) {
  const n = De(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || De(r.slice(0, o)) !== n))
      return ge(r.slice(o + 1));
  }
  return null;
}
function id(e) {
  const t = X(e, "Custo") ?? X(e, "PE");
  return t || (e.map(ge).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function sd(e) {
  const t = L(e, "target");
  if (!t) return null;
  if (t === "area")
    return cd(e) ?? F("op.targetChoices", t) ?? "Área";
  const n = F("op.targetChoices", t) ?? H(t);
  return [t === "people" || t === "creatures" ? L(e, "targetQtd") : null, n].filter(pt).join(" ");
}
function cd(e) {
  const t = L(e, "area.name"), n = L(e, "area.size"), r = L(e, "area.type"), o = t ? F("op.areaChoices", t) ?? H(t) : null, i = r ? F("op.areaTypeChoices", r) ?? H(r) : null;
  return o ? n ? i ? `${o} ${n}m ${Gt(i)}` : `${o} ${n}m` : o : null;
}
function ld(e) {
  const t = L(e, "skillResis"), n = L(e, "resistance");
  if (!t || !n) return null;
  const r = F("op.skill", t) ?? H(t), o = ud(n);
  return [r, o].filter(pt).join(" ");
}
function ud(e) {
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
      return F("op.resistanceChoices", e) ?? H(e);
  }
}
function dd(e, t, n) {
  const r = L(e, t);
  return r ? F(n, r) ?? H(r) : null;
}
function md(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function fd(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function pd(e) {
  return [
    `${a}__ritual-element-badge`,
    e ? `${a}__ritual-element-badge--${e}` : null
  ].filter(pt).join(" ");
}
function Cn(e) {
  const t = De(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function wr(e) {
  const t = Cn(e);
  return t ? F("op.elementChoices", t) ?? H(t) : e ? H(e) : null;
}
function gd(e) {
  return Cn(e);
}
function F(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = En()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Rr = "data-paranormal-toolkit-dice-toggle-enhanced";
function hd(e) {
  for (const t of Array.from(e.querySelectorAll(ea)))
    Da(t);
}
function bd(e) {
  const t = Pa(e.target);
  if (!t) return;
  const n = In(t);
  n && (e.preventDefault(), va(n, t));
}
function yd(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Pa(e.target);
  if (!t) return;
  const n = In(t);
  n && (e.preventDefault(), va(n, t));
}
function Da(e) {
  const t = e.querySelector(_n);
  if (!t) return;
  const n = e.querySelector(na);
  if (n && n.getAttribute(Rr) !== "true" && (n.setAttribute(Rr, "true"), n.classList.add(ra), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function va(e, t) {
  const n = e.querySelector(_n);
  if (!n) return;
  const r = !e.classList.contains(ta);
  _d(e, t, n, r);
}
function _d(e, t, n, r) {
  e.classList.toggle(ta, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Pa(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(na);
  if (!t) return null;
  const n = In(t);
  return n ? (Da(n), t.classList.contains(ra) ? t : null) : null;
}
function In(e) {
  const t = e.closest(ea);
  return t && t.querySelector(_n) ? t : null;
}
const kr = `${l}-workflow-dice-toggle-styles`;
function Ad() {
  if (document.getElementById(kr)) return;
  const e = document.createElement("style");
  e.id = kr, e.textContent = `
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
const $d = [0, 100, 500, 1500, 3e3];
let Er = !1, Et = null;
function Td() {
  if (!Er) {
    Er = !0, Ad(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ke(Tr(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ke(Tr(t));
    }), Hooks.once("ready", () => {
      ke(document), wd();
    }), document.addEventListener("click", bd), document.addEventListener("keydown", yd);
    for (const e of $d)
      globalThis.setTimeout(() => ke(document), e);
  }
}
function wd() {
  Et || !document.body || (Et = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ke(n);
  }), Et.observe(document.body, { childList: !0, subtree: !0 }));
}
function ke(e) {
  e && (Jc(e), Vu(e), Du(e), hd(e), Hc(e));
}
function Rd() {
  Td();
}
const kd = "data-paranormal-toolkit-action-section", Ed = "ritual-log", Cd = ".paranormal-toolkit-item-use-prompt__actions", Id = ".paranormal-toolkit-item-use-prompt__actions-title", Sd = [0, 100, 500, 1500];
let Cr = !1;
function Ld() {
  if (Cr) return;
  const e = (t, n) => {
    Ir(Nd(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Ir(document), Cr = !0;
}
function Ir(e) {
  for (const t of Sd)
    globalThis.setTimeout(() => Dd(e), t);
}
function Dd(e) {
  vd(e), Pd(e);
}
function vd(e) {
  for (const t of e.querySelectorAll(
    `[${kd}="${Ed}"]`
  ))
    t.remove();
}
function Pd(e) {
  for (const t of e.querySelectorAll(Cd)) {
    if (Sr(t.querySelector(Id)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (i) => Sr(i.textContent ?? "")
    ).some((i) => i.includes("ritual conjurado")) && t.remove();
  }
}
function Nd(e) {
  if (e instanceof HTMLElement || xd(e))
    return e;
  if (Od(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function xd(e) {
  return e instanceof HTMLElement;
}
function Od(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Sr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Fd = {
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
}, Md = new Set(
  Object.values(Fd)
), Bd = {
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
function Ud(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = qd(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Bd[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Md.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function Na(e) {
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
function qd(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class zd {
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
    const s = [], c = /* @__PURE__ */ new Set();
    let u = null;
    for (const [m, f] of t.instances.entries()) {
      const _ = jd(f, m);
      if (!_.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const $ = Ud(f.damageType);
      if (!$.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(f.damageType)}.`,
          instance: f,
          damageType: f.damageType
        });
      if (_.amount === 0) {
        s.push(
          Vd(_.id, f, $.value)
        );
        continue;
      }
      try {
        const T = await Promise.resolve(
          i.call(n, _.amount, {
            damageType: $.value ?? void 0,
            ignoreRD: f.ignoreResistance === !0,
            nonLethal: f.nonLethal === !0
          })
        );
        for (const P of Gd(T.conditions))
          c.add(P);
        const g = Hd(T.newPV);
        g !== null && (u = g), s.push({
          id: _.id,
          label: f.label ?? Na($.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: _.amount,
          finalDamage: Lr(T.finalDamage, _.amount),
          blocked: Lr(T.blocked, 0),
          damageType: f.damageType ? String(f.damageType) : null,
          systemDamageType: $.value,
          ignoreResistance: f.ignoreResistance === !0,
          nonLethal: f.nonLethal === !0
        });
      } catch (T) {
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: f,
          cause: T
        });
      }
    }
    return b({
      actor: n,
      actorId: o,
      actorName: r,
      totalRawDamage: s.reduce(
        (m, f) => m + f.inputAmount,
        0
      ),
      totalFinalDamage: s.reduce(
        (m, f) => m + f.finalDamage,
        0
      ),
      totalBlocked: s.reduce(
        (m, f) => m + f.blocked,
        0
      ),
      newPV: u,
      conditions: Array.from(c),
      instances: s,
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
function jd(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Vd(e, t, n) {
  return {
    id: e,
    label: t.label ?? Na(n),
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
function Lr(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Hd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Gd(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const Ee = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, xa = {
  PV: "system.attributes.hp"
}, Wt = {
  PV: [Ee.PV, xa.PV],
  SAN: [Ee.SAN],
  PE: [Ee.PE],
  PD: [Ee.PD]
}, Kt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Wd {
  getResource(t, n) {
    const r = Dr(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, i = `${o}.value`, s = `${o}.max`, c = foundry.utils.getProperty(t, i), u = foundry.utils.getProperty(t, s), m = Pr(t, n, i, c, "valor atual");
    if (m) return p(m);
    const f = Pr(t, n, s, u, "valor máximo");
    return f ? p(f) : b({
      value: c,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = Dr(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function Dr(e, t) {
  const n = Kd(e.type, t);
  if (n && vr(e, n))
    return b(n);
  const r = Wt[t].find(
    (o) => vr(e, o)
  );
  return r ? b(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Yd(e, t),
    path: Wt[t].join(" | ")
  });
}
function Kd(e, t) {
  return e === "threat" ? xa[t] ?? null : e === "agent" ? Ee[t] : null;
}
function vr(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Yd(e, t) {
  const n = e.type ?? "unknown", r = Wt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Pr(e, t, n, r, o) {
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
class Qd {
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
      const s = Kt.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: o } = n, i = Zd(o);
    return i ? b(i) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Kt.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Zd(e) {
  if (Nr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Nr(n))
      return n;
  }
  return null;
}
function Nr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Xd = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Jd {
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
    const r = n.value, o = em(t.ritual, r);
    return o.ok ? o.value ? b(o.value) : b({
      resource: "PE",
      amount: Xd[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function em(e, t) {
  const n = e.getFlag(l, "ritual.cost");
  return n == null ? { ok: !0, value: null } : tm(n) ? {
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
function tm(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Ct = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function nm(e) {
  if (!cm(e.item)) return null;
  const t = Yt(e.actor) ? e.actor : rm(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: am(e.token) ?? om(t),
    targets: gn(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function rm(e) {
  const t = e;
  return Yt(t.actor) ? t.actor : Yt(e.parent) ? e.parent : null;
}
function om(e) {
  const t = im(e) ?? sm(e);
  return t ? Oa(t) : null;
}
function am(e) {
  return Qt(e) ? Oa(e) : null;
}
function im(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Qt(n) ? n : (t.getActiveTokens?.() ?? []).find(Qt) ?? null;
}
function sm(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Oa(e) {
  const t = e.actor ?? null;
  return {
    tokenId: It(e.id),
    actorId: It(t?.id),
    sceneId: It(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function cm(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Yt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Qt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function It(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class lm {
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
    const n = nm(um(t));
    if (!n) {
      d.warn(`${Ct.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function um(e) {
  return e && typeof e == "object" ? e : {};
}
class dm {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return St("missing-item-patch");
    if (t.type !== "ritual") return St("unsupported-item-type");
    const o = mm(r);
    return Object.keys(o).length === 0 ? St("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function mm(e) {
  const t = {};
  k(t, "name", e.name), k(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (k(t, "system.circle", n.circle), k(t, "system.element", n.element), k(t, "system.target", n.target), k(t, "system.targetQtd", n.targetQuantity), k(t, "system.execution", n.execution), k(t, "system.range", n.range), k(t, "system.duration", n.duration), k(t, "system.skillResis", n.resistanceSkill), k(t, "system.resistance", n.resistance), k(t, "system.studentForm", n.studentForm), k(t, "system.trueForm", n.trueForm)), t;
}
function k(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function St(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class fm {
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
    return this.getNumber(t, Kt.ritual.dt, 0);
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
class pm {
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
class gm {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = hm(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Lt(t)), b(t)) : n;
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
    return n ? Lt(n) : null;
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
    return Array.from(this.presets.values()).map(Lt);
  }
  findForItem(t) {
    return this.list().map((n) => bm(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function hm(e) {
  return !Dt(e.id) || !Dt(e.version) || !Dt(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : b(e);
}
function bm(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const i = ym(o, t);
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
function ym(e, t) {
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
      const n = xr(t.name), r = e.names.map(xr).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = _m(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function xr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function _m(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Lt(e) {
  return structuredClone(e);
}
function Dt(e) {
  return typeof e == "string" && e.length > 0;
}
function et(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : b(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = gt(e.amountFrom);
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
function gt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const Am = "dice-so-nice";
async function Fa(e) {
  if (!$m() || !Tm()) return;
  const t = wm();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      d.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function $m() {
  try {
    return Ec().enabled;
  } catch {
    return !1;
  }
}
function Tm() {
  return game.modules?.get?.(Am)?.active === !0;
}
function wm() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Rm(e, t, n) {
  if (!Or(e.id) || !Or(e.formula))
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
    await Fa(o);
    const c = {
      ...n.rollRequests[e.id] ?? Ma(e, t),
      total: i,
      roll: o
    };
    return n.rolls[e.id] = c, b(c);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function Ma(e, t) {
  const n = e.intent ?? km(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function km(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Or(e) {
  return typeof e == "string" && e.length > 0;
}
async function tt(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Ve(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Ve(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? Ve(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? Ve(t, n, r, o) : e.recover(t, n, o);
  }
}
function Ve(e, t, n, r) {
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
function Em(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: i } = e;
  if (t.operation === "damage") {
    const s = Cm(t, n, r, o);
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
    const s = Im(t, n, r, o);
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
function Cm(e, t, n, r) {
  const o = gt(e.amountFrom), i = o ? t.rolls[o] : void 0;
  return {
    id: Ba(t.id, "damage", r, t.damageInstances.length),
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
function Im(e, t, n, r) {
  const o = gt(e.amountFrom);
  return {
    id: Ba(t.id, "healing", r, t.healingInstances.length),
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
function Ba(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Sm(e, t, n) {
  const r = gt(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function Lm(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: i } = e;
  i.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Ua("before", e), Fr("before", e), Fr("resolve", e);
}
function Dm(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: i } = e;
  i.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Ua("apply", e);
}
function vm(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: i } = e;
  i.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Ua(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: i, lifecycle: s } = t, c = Pm(e, n.operation);
  c && s.emit(c, r, {
    stepIndex: o,
    step: n,
    metadata: i
  });
}
function Fr(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: i, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: i
  });
}
function Pm(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Nm(e, t, n) {
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
async function xm(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Om(e, t);
    case "spendRitualCost":
      return Fm(e, t);
  }
}
async function Om(e, t) {
  const { context: n, resources: r } = e, o = et(t, n);
  return o.ok ? qa(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function Fm(e, t) {
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
  }), qa(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function qa(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), b(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Mm(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: i } = e, s = Bm(t);
  for (const u of s.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const c = await i();
  if (!c.ok)
    return c;
  for (const u of s.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return c;
}
function Bm(e) {
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
class Um {
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
        return Mm({
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
    const o = await xm({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? b(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = Ma(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const i = await this.runRollFormulaStep(t, n, r);
    if (!i.ok)
      return i;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: s }), b(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await Rm(t, r, n);
    return o.ok ? b(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = et(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const i = Sm(t, n, o.value);
    Lm({
      step: t,
      context: n,
      stepIndex: r,
      metadata: i,
      lifecycle: this.lifecycle
    }), Dm({
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
    for (const c of s) {
      const u = await tt(this.resources, c, t.resource, t.operation, o.value), m = this.handleResourceOperationResult(u, n, r, t);
      if (!m.ok)
        return m;
      Em({
        step: t,
        context: n,
        transaction: m.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return vm({
      step: t,
      context: n,
      stepIndex: r,
      metadata: i,
      lifecycle: this.lifecycle
    }), b(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = et(t, n);
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
      const c = await tt(this.resources, s, t.resource, t.operation, o.value), u = this.handleResourceOperationResult(c, n, r, t);
      if (!u.ok)
        return u;
    }
    return b(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await Nm(this.messages, t, n);
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
    const c = qm(t, n.intent);
    c && this.lifecycle.emit(c, r, {
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
function qm(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class zm {
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
    const s = i.value, c = this.calculate(r, s, o);
    if (!c.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: c.error.reason,
        message: c.error.message,
        requestedAmount: o,
        current: s.value,
        required: o
      });
    const { afterValue: u, appliedAmount: m } = c.value, f = {
      value: u,
      max: s.max
    };
    try {
      u !== s.value && await this.adapter.updateResourceValue(t, n, u);
    } catch (_) {
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
        cause: _
      });
    }
    return b({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: o,
      appliedAmount: m,
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
function za(e) {
  return {
    id: jm(),
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
function jm() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Vm {
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
    const r = za(n);
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
class Hm {
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
class Gm {
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
    const n = jt();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Wm(),
      flags: {
        ...t.flags,
        [l]: {
          ...Km(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && d.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = jt();
    if (!r.enabled)
      return;
    const o = n.notification ?? Mr(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = Mr(n);
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
function Mr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Wm() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Km(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function Ym(e, t) {
  const n = nf(e?.rounds);
  if (!n)
    return Br(null);
  const r = e?.anchor ?? ja(t);
  if (!r)
    return {
      ...Br(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Qm(),
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
function ja(e) {
  const t = rf();
  if (!t?.id || !Va(t.round)) return null;
  const n = ef(t), r = Zm(e, n) ?? Jm(t), o = j(r?.id), i = af(r?.initiative), s = Xm(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: s,
    initiative: i,
    time: of()
  };
}
function Qm() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Br(e) {
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
function Zm(e, t) {
  return e?.id ? t.find((n) => tf(n) === e.id) ?? null : null;
}
function Xm(e, t, n) {
  const r = j(t?.id);
  if (r) {
    const o = n.findIndex((i) => i.id === r);
    if (o >= 0) return o;
  }
  return sf(e.turn) ? e.turn : null;
}
function Jm(e) {
  return Ke(e.combatant) ? e.combatant : null;
}
function ef(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Ke);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Ke);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(Ke);
  }
  return [];
}
function tf(e) {
  return j(e.actor?.id) ?? j(e.actorId) ?? j(e.token?.actor?.id) ?? j(e.token?.actorId) ?? j(e.document?.actor?.id) ?? j(e.document?.actorId);
}
function nf(e) {
  return Va(e) ? Math.trunc(e) : null;
}
function rf() {
  return game.combat ?? null;
}
function of() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Ke(e) {
  return !!(e && typeof e == "object");
}
function j(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function af(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Va(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function sf(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class cf {
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
    if (!yf(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, i = Ym(t.duration, r), s = lf(o, t, i), u = t.refreshExisting ?? !0 ? _f(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(s)), b(Ur(r, o, u.id ?? null, !1, !0, i));
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
      const f = (await r.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return b(Ur(r, o, f, !0, !1, i));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = Ga(n, r);
    let i = 0;
    try {
      for (const s of o)
        await qr(n, s) === "deleted" && (i += 1);
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
    const n = Tf(), r = [];
    let o = 0, i = 0;
    for (const s of n) {
      const c = Sn(s);
      o += c.length;
      for (const u of c) {
        if (!mf(u, t)) continue;
        const m = Ha(u);
        try {
          await qr(s, u) === "deleted" && (i += 1);
        } catch (f) {
          r.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: u.id ?? null,
            conditionId: m.conditionId,
            message: `Falha ao remover condição expirada ${m.conditionId ?? u.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
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
function lf(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: vf(),
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
    duration: uf(n.duration),
    start: df(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [l]: r
    }
  };
}
function uf(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function df(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Df(),
    ...e
  };
}
function Ur(e, t, n, r, o, i) {
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
function mf(e, t) {
  const n = Ha(e);
  if (!n.conditionId || !ff(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Lf();
  return n.durationMode === "combatantTurn" || pf(n) ? hf(n, r) : gf(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !D(n.startRound) || !D(n.requestedRounds) || !D(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function ff(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && D(e.requestedRounds);
}
function pf(e) {
  return !!(e.combatDurationApplied && D(e.requestedRounds) && D(e.startRound) && (e.startCombatantId || nt(e.startTurn)));
}
function gf(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function hf(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !D(e.startRound) || !D(e.requestedRounds) || !D(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = bf(t);
  return e.startCombatantId ? r === e.startCombatantId : nt(e.startTurn) && nt(t.turn) ? t.turn === e.startTurn : !1;
}
function bf(e) {
  return ce(e.combatant?.id);
}
function Ha(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ye(e, "conditionId"),
    requestedRounds: zr(e, "requestedRounds") ?? Ce(t.value) ?? Ce(t.rounds),
    combatDurationApplied: vt(e, "combatDurationApplied"),
    combatId: Ye(e, "combatId") ?? ce(n.combat) ?? ce(t.combat),
    startCombatantId: Ye(e, "startCombatantId") ?? ce(n.combatant),
    startInitiative: Ef(e, "startInitiative") ?? Wa(n.initiative),
    startRound: zr(e, "startRound") ?? Ce(n.round) ?? Ce(t.startRound),
    startTurn: kf(e, "startTurn") ?? Zt(n.turn) ?? Zt(t.startTurn),
    expiryEvent: Cf(e, "expiryEvent") ?? Ka(t.expiry),
    durationMode: If(e, "durationMode"),
    deleteOnExpire: vt(e, "deleteOnExpire"),
    expiresWithCombat: vt(e, "expiresWithCombat")
  };
}
function yf(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function _f(e, t) {
  return Ga(e, t)[0] ?? null;
}
function Ga(e, t) {
  return Sn(e).filter((n) => Rf(n) === t);
}
async function qr(e, t) {
  const n = t.id ?? null, r = n ? Af(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if ($f(o)) return "missing";
    throw o;
  }
}
function Af(e, t) {
  return Sn(e).find((n) => n.id === t) ?? null;
}
function $f(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Tf() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      He(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    He(e, n);
  });
  for (const n of wf())
    He(e, n.actor), He(e, n.document?.actor);
  return Array.from(e.values());
}
function He(e, t) {
  if (!Sf(t)) return;
  const r = ce(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function wf() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Sn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Rf(e) {
  return Ye(e, "conditionId");
}
function Ye(e, t) {
  return ce(ne(e, t));
}
function zr(e, t) {
  return Ce(ne(e, t));
}
function kf(e, t) {
  return Zt(ne(e, t));
}
function Ef(e, t) {
  return Wa(ne(e, t));
}
function Cf(e, t) {
  return Ka(ne(e, t));
}
function If(e, t) {
  const n = ne(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function vt(e, t) {
  return ne(e, t) === !0;
}
function ne(e, t) {
  const n = e.getFlag?.(l, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const o = r[l];
  if (!(!o || typeof o != "object"))
    return o[t];
}
function ce(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ce(e) {
  return D(e) ? Math.trunc(e) : null;
}
function Zt(e) {
  return nt(e) ? Math.trunc(e) : null;
}
function Wa(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ka(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Sf(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Lf() {
  return game.combat ?? null;
}
function Df() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function D(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function nt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function vf() {
  return game.user?.id ?? null;
}
const Pf = "icons/svg/downgrade.svg", Nf = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function y(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Pf,
    description: Nf,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const xf = y({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Of = y({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Ff = y({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Mf = y({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Bf = y({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Uf = y({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), qf = y({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), zf = y({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), jf = y({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Vf = y({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Hf = y({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Gf = y({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Wf = y({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Kf = y({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Yf = y({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Qf = y({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Zf = y({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Xf = y({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Jf = y({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), ep = y({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), tp = y({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), np = y({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), rp = y({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), op = y({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), ap = y({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), ip = y({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), sp = y({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), cp = y({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), lp = y({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), up = y({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), dp = y({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), mp = y({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), fp = y({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), pp = y({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), gp = [
  xf,
  Of,
  Ff,
  Mf,
  Bf,
  Uf,
  qf,
  zf,
  jf,
  Vf,
  Hf,
  Gf,
  Wf,
  Kf,
  Yf,
  Qf,
  Zf,
  Xf,
  Jf,
  ep,
  tp,
  np,
  rp,
  op,
  ap,
  ip,
  sp,
  cp,
  lp,
  up,
  dp,
  mp,
  fp,
  pp
];
class hp {
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
    return Array.from(this.definitions.values()).map(jr);
  }
  get(t) {
    const n = this.lookup.get(Vr(t)), r = n ? this.definitions.get(n) : null;
    return r ? b(jr(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Vr(t);
    r && this.lookup.set(r, n);
  }
}
function bp() {
  return new hp(gp);
}
function jr(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Vr(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const yp = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Ya = `${l}-inline-roll-neutralized`, _p = `${l}-inline-roll-notice`, Ln = `data-${l}-inline-roll-neutralized`, Hr = `data-${l}-inline-roll-notice`, Ap = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Gr(e) {
  const t = Np(e.message), n = await $p(e.message), r = Tp(t);
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
async function $p(e) {
  const t = Dp(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = wp(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await vp(t, n.content), replacementCount: n.replacementCount };
}
function Tp(e) {
  const t = e ? Pp(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Qa(t);
  return n > 0 && Za(Ip(t)), { replacementCount: n };
}
function wp(e) {
  const t = Rp(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Qa(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (Za(n.content), { content: n.innerHTML, replacementCount: o });
}
function Rp(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, Ep(o.trim()))), replacementCount: t };
}
function Qa(e) {
  const t = kp(e);
  for (const n of t)
    n.replaceWith(Cp(Sp(n)));
  return t.length;
}
function kp(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(yp))
    n.getAttribute(Ln) !== "true" && t.add(n);
  return Array.from(t);
}
function Ep(e) {
  return `<span class="${Ya}" ${Ln}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${xp(e)}</span>`;
}
function Cp(e) {
  const t = document.createElement("span");
  return t.classList.add(Ya), t.setAttribute(Ln, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Za(e) {
  if (e.querySelector?.(`[${Hr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(_p), t.setAttribute(Hr, "true"), t.textContent = Ap, e.append(t);
}
function Ip(e) {
  return e.querySelector(".message-content") ?? e;
}
function Sp(e) {
  const n = e.getAttribute("data-formula") ?? Lp(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Lp(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Dp(e) {
  return e && typeof e == "object" ? e : null;
}
async function vp(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return d.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Pp(e) {
  const t = Op(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Np(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function xp(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Op(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const rt = "ritualRollConfig", le = "ritual-roll";
function ht() {
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
function Xa(e) {
  const t = e.getFlag(l, rt);
  return Xt(t);
}
function Ja(e) {
  return Xa(e) ?? ht();
}
async function Fp(e, t) {
  const n = Xt(t) ?? Xt({
    ...ht(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(l, rt, n), n;
}
async function Mp(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, l, rt));
    return;
  }
  await e.setFlag(l, rt, null);
}
function Xt(e) {
  if (!bt(e)) return null;
  const t = Wp(e.intent);
  if (!t) return null;
  const n = ht();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: ot(e.damageType),
    utilityLabel: ot(e.utilityLabel) ?? n.utilityLabel,
    note: Dn(e.note),
    forms: Kp(e.forms)
  };
}
function Bp(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Up(e) {
  const t = Xa(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = qp(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...zp(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: Vp(e, t),
    resistance: t.intent === "damage" ? Hp(e) : void 0
  };
}
function qp(e, t) {
  const n = {
    type: "rollFormula",
    id: le,
    formula: t,
    intent: Gp(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function zp(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${le}.total`,
          ...jp(e.damageType)
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
function jp(e) {
  return e ? { damageType: e } : {};
}
function Vp(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [le]: n
      }
    }
  };
  return Wr(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [le]: t.forms.discente.formula.trim()
    }
  }), Wr(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [le]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Hp(e) {
  const t = ei(e), n = ot(t.skillResis), r = ot(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = Yp(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function Gp(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Wp(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function Kp(e) {
  const t = ht();
  return bt(e) ? {
    base: Pt(e.base),
    discente: Pt(e.discente),
    verdadeiro: Pt(e.verdadeiro)
  } : t.forms;
}
function Pt(e) {
  return bt(e) ? { formula: Dn(e.formula) } : { formula: "" };
}
function Wr(e, t) {
  const n = ei(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return Qp(r);
}
function ei(e) {
  const t = e.system;
  return bt(t) ? t : {};
}
function Yp(e) {
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
function Qp(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Dn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function ot(e) {
  const t = Dn(e);
  return t.length > 0 ? t : null;
}
function bt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const Kr = "occultism";
function Zp(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Xp(e) {
  const t = Zp(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await Jp(e, Kr);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Fa(n);
  const r = ng(n);
  return {
    skill: Kr,
    skillLabel: "Ocultismo",
    roll: n,
    formula: tg(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: rg(n)
  };
}
async function Jp(e, t) {
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
  return eg(r);
}
function eg(e) {
  return Yr(e) ? e : Array.isArray(e) ? e.find(Yr) ?? null : null;
}
function Yr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function tg(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function ng(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function rg(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(og);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((i) => {
    if (!i || typeof i != "object") return [];
    const s = i.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function og(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function ag(e) {
  switch (ig(e)) {
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
      return sg(String(e ?? ""));
  }
}
function ig(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function sg(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function cg(e) {
  return {
    header: {
      eyebrow: ln,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: fg(e.ritual)
    },
    forms: e.variantOptions.map((t) => lg(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: mg(e.automationStatus ?? "assisted")
  };
}
function lg(e, t) {
  const n = ug(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? dg(t) : "—",
    details: n
  };
}
function ug(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function dg(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function mg(e) {
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
function fg(e) {
  const t = e.system, n = [gg(t?.element), pg(t?.circle)].filter(yg);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function pg(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function gg(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (hg(e)) {
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
      return bg(e);
  }
}
function hg(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function bg(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function yg(e) {
  return typeof e == "string" && e.length > 0;
}
const ti = ["base", "discente", "verdadeiro"];
function ni(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function at(e) {
  return typeof e == "string" && ti.includes(e);
}
const { ApplicationV2: _g } = foundry.applications.api;
class Ie extends _g {
  constructor(t, n) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = cg(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
  }
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
      cast: Ie.onCast,
      cancel: Ie.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new Ie(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    $g(o, (i) => {
      this.selectedVariant = i;
    }), Tg(o, (i) => {
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
          ${this.model.forms.map(Ag).join("")}
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
    const n = kg(t), r = wg(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function Ag(e) {
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
function $g(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Qr(e, o, t)), o.addEventListener("keydown", (i) => {
      i.key !== "Enter" && i.key !== " " || (i.preventDefault(), Qr(e, o, t));
    });
  const r = ri(e);
  r && t(r);
}
function Qr(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !at(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), ri(e));
}
function ri(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), i = o?.checked === !0;
    r.setAttribute("aria-checked", i ? "true" : "false"), i && at(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Tg(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function wg(e, t, n) {
  const r = Rg(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function Rg(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (at(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return at(n) ? n : null;
}
function kg(e) {
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
async function Eg(e) {
  return Ie.request(e);
}
const vn = {
  label: "Padrão"
}, Cg = {
  label: "Discente",
  extraCost: 2
}, Ig = {
  label: "Verdadeiro",
  extraCost: 5
};
class Sg {
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
    const r = this.resolveCostPreview(t), o = _h(n), i = hh(
      n,
      t.item,
      r,
      o
    ), s = await Eg({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((R) => R.name),
      cost: r,
      defaultSpendResource: kh(n),
      variantOptions: i,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const c = Lg(s), u = $h(
      n,
      t.item,
      c.variant,
      o
    ), m = Vo();
    let f = null;
    if (m) {
      const R = await vg(
        this.resources,
        t.actor,
        c,
        u,
        r
      );
      if (!R.ok)
        return {
          status: "failed",
          reason: R.reason,
          message: R.message
        };
      try {
        f = await Xp(
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
    const _ = Dg(
      n,
      c,
      u,
      r,
      {
        includeCostSteps: !m
      }
    );
    if (_.steps.length === 0) {
      const R = Ah(
        t,
        c
      ), U = Zr(
        t.actor,
        f,
        u,
        r
      ), Vn = Xr(
        n,
        c,
        u,
        r,
        R,
        t,
        f
      );
      return U.length > 0 ? {
        status: "ready",
        workflowContext: R,
        actions: U,
        summaryLines: Vn
      } : {
        status: "completed-without-actions",
        workflowContext: R,
        summaryLines: Vn
      };
    }
    const $ = await this.workflow.runAutomation(_, {
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
          variant: c.variant,
          spendResource: c.spendResource
        }
      }
    });
    if (!$.ok)
      return {
        status: "failed",
        reason: $.error.reason,
        message: $.error.message,
        cause: $.error
      };
    const T = $.value.context, g = Bg(
      n,
      t,
      T
    ), P = Ng(
      n,
      t
    ), _e = Zr(
      t.actor,
      f,
      u,
      r
    ), Ae = Xr(
      n,
      c,
      u,
      r,
      T,
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
    const $e = [
      ..._e,
      ...g.actions,
      ...P.actions
    ];
    return $e.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: T,
      summaryLines: Ae
    } : {
      status: "ready",
      workflowContext: T,
      actions: $e,
      summaryLines: Ae
    };
  }
  async applyAction(t) {
    return tt(
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
function Lg(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function Dg(e, t, n, r, o) {
  const i = [], s = t.spendResource === !0;
  for (const c of e.steps)
    c.type === "modifyResource" || c.type === "chatCard" || Nn(c) && (!o.includeCostSteps || !s) || i.push(Pg(c, n));
  return o.includeCostSteps && s && r && Eh(n.extraCost) && i.push({
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
async function vg(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const i = Oe(o, r);
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
function Pg(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Zr(e, t, n, r) {
  if (!t || t.success) return [];
  const o = Oe(r, n);
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
function Ng(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = Pn(r.actor, t);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const i of o) {
      const s = ja(i);
      n.push(
        xg(
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
function xg(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", i = e.label ?? Mg(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: i,
    duration: Og(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Fg(i, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${i} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Og(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Fg(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Mg(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Bg(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const i of e.steps) {
    if (i.type !== "modifyResource") continue;
    const s = et(i, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const c = Pn(i.actor, t);
    if (c.length === 0) {
      if (i.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (Ug(i)) {
        qg(
          o,
          u,
          zg(i, n, s.value)
        );
        continue;
      }
      r.push(Vg(i, u, s.value));
    }
  }
  for (const i of o.values())
    r.push(
      ...jg(
        e,
        t.item,
        i.actor,
        i.entries
      )
    );
  return { ok: !0, actions: r };
}
function Ug(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function qg(e, t, n) {
  const r = Kg(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function zg(e, t, n) {
  const r = Yg(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function jg(e, t, n, r) {
  const o = Jg(e), i = o.length > 1 ? nh() : void 0;
  return o.map((s) => {
    const c = r.map(
      (m, f) => {
        const _ = eh(m.amount, s);
        return {
          id: Hg(m, s, f),
          amount: _,
          damageType: m.damageType,
          sourceRollId: m.sourceRollId,
          ignoreResistance: m.step.ignoreResistance === !0
        };
      }
    ), u = c.reduce(
      (m, f) => m + f.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: c,
      label: Gg(u, s, o.length > 1),
      executedLabel: Wg(
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
function Vg(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = Xg(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: Qg(e, r, n),
    executedLabel: Zg(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function Hg(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Gg(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Wg(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Kg(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Yg(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function Qg(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Zg(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Xg(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Jg(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function eh(e, t) {
  const n = e * t.multiplier, r = th(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function th(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function nh() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Pn(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Xr(e, t, n, r, o, i, s = null) {
  return [
    `Forma: ${ni(t.variant)}`,
    ih(t, n, r),
    ...ah(s),
    ...Object.values(o.rolls).flatMap(sh),
    ...rh(e, i),
    ...ch(e.resistance),
    ...ph(n)
  ];
}
function rh(e, t) {
  return oh(e) ? Pn("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function oh(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function ah(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function ih(e, t, n) {
  const r = Oe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function sh(e) {
  const n = [`${gh(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = lh(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${ag(e.damageType)}`), n;
}
function ch(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function lh(e) {
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
    const s = uh(i);
    s && (fh(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function uh(e) {
  const t = dh(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : mh(e);
}
function dh(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function mh(e) {
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
function fh(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function ph(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function gh(e) {
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
function hh(e, t, n, r) {
  return ti.map((o) => {
    const i = oi(
      e,
      t,
      o,
      r
    ), s = i !== null;
    return {
      variant: o,
      label: i?.label ?? ni(o),
      enabled: s,
      details: i ? bh(i, n, r) : [],
      finalCostText: i ? yh(n, i) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function bh(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const i = Oe(t, e);
  return r.push(
    i ? `Custo final: ${i.amount} ${i.resource}` : "Custo final não resolvido"
  ), r;
}
function Oe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function yh(e, t) {
  const n = Oe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function _h(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Nn);
}
function Ah(e, t) {
  return za({
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
function $h(e, t, n, r) {
  return oi(e, t, n, r) ?? vn;
}
function oi(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? wh(t, n) ? Th(n) : null : n === "base" ? vn : null);
}
function Th(e) {
  switch (e) {
    case "base":
      return vn;
    case "discente":
      return Cg;
    case "verdadeiro":
      return Ig;
  }
}
function wh(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Rh(foundry.utils.getProperty(e, n));
}
function Rh(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function kh(e) {
  return e.steps.some(Nn);
}
function Nn(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Eh(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Ch(e, t) {
  const n = await Ih(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: Lh(n),
    total: Dh(n),
    diceBreakdown: vh(n)
  };
}
function ai(e) {
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
async function Ih(e, t) {
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
  return Sh(r);
}
function Sh(e) {
  return Jr(e) ? e : Array.isArray(e) ? e.find(Jr) ?? null : null;
}
function Jr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Lh(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Dh(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function vh(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Ph);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((i) => {
    if (!i || typeof i != "object") return [];
    const s = i.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Ph(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const ii = "itemUsePrompts", si = "chatCard", yt = "data-paranormal-toolkit-prompt-id", _t = "data-paranormal-toolkit-pending-id", xn = "data-paranormal-toolkit-executed-label", Jt = "data-paranormal-toolkit-choice-group", ci = "data-paranormal-toolkit-skipped-label", eo = "data-paranormal-toolkit-action-section", to = "data-paranormal-toolkit-detail-key", no = "data-paranormal-toolkit-roll-card", On = "data-paranormal-toolkit-roll-detail-toggle", li = "data-paranormal-toolkit-roll-detail-id", di = "data-paranormal-toolkit-resistance-roll-button", mi = "data-paranormal-toolkit-resistance-skill", fi = "data-paranormal-toolkit-resistance-skill-label", pi = "data-paranormal-toolkit-resistance-target-actor-id", gi = "data-paranormal-toolkit-resistance-target-name", hi = "data-paranormal-toolkit-resistance-roll-result", ro = "data-paranormal-toolkit-system-card-replaced", Nh = `[${_t}]`, xh = `[${On}]`, Oh = `[${di}]`, en = `${l}-chat-enrichment`, h = `${l}-item-use-prompt`, Fh = `${h}__actions`, oo = `${h}__details`, bi = `${h}__summary`, Mh = `${h}__title`, yi = `${h}__button--executed`, ao = `${h}__roll-card`;
let io = !1, tn = null;
const v = /* @__PURE__ */ new Map(), Bh = [0, 100, 500, 1500, 3e3], Uh = 3e4, qh = [0, 100, 500, 1500, 3e3];
function zh(e) {
  if (tn = e, io) {
    co(e);
    return;
  }
  const t = (n, r) => {
    Ai(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), io = !0, co(e);
}
async function so(e) {
  const t = _i(e);
  v.set(e.pendingId, t), await Bn(t) || Li(t), $i(e.pendingId);
}
async function jh(e) {
  const t = _i({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", v.set(e.pendingId, t), await Bn(t) || Li(t), $i(e.pendingId);
}
async function Nt(e, t) {
  const n = v.get(e);
  v.delete(e), n && await zb(n, t);
}
function Fn(e) {
  const t = Oi();
  for (const n of t) {
    const r = B(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Vh(e, t) {
  const n = Fn(e);
  if (!n) return;
  const r = B(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await he(n.message, r));
}
async function Hh(e, t, n) {
  if (!t) return;
  const r = Fn(e);
  if (!r) return;
  const o = B(r.message);
  let i = !1;
  for (const [s, c] of Object.entries(o))
    s !== e && c.choiceGroupId === t && (o[s] = {
      ...c,
      executedLabel: n ?? c.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, i = !0);
  i && await he(r.message, o);
}
function _i(e) {
  const t = G(e.context.message), n = e.context.targets.find((s) => an(s)), r = n ? an(n) : null, o = e.resistanceTargetActor ?? r, i = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: bb(e.context),
    executed: !1
  };
}
function Ai(e, t, n) {
  qb();
  const r = $t(t);
  if (!r) return;
  const o = Mb(e, r);
  o.length > 0 && it(r);
  for (const i of o)
    nn(r, i);
  Ri(r, n), rn(r), on(r);
}
function co(e) {
  for (const t of qh)
    globalThis.setTimeout(() => {
      Gh(e);
    }, t);
}
function Gh(e) {
  for (const t of Wh()) {
    const n = At(t);
    Kh(n) && Ai(n, t, e);
  }
}
function Wh() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Kh(e) {
  return e ? Un(e) ? !0 : Vb(e).length > 0 : !1;
}
function $i(e) {
  const t = v.get(e);
  if (!t) return;
  const n = t.messageId ? Bb(t.messageId) : null;
  if (n) {
    po(n, t), it(n), nn(n, t), lo(n), rn(n), on(n);
    return;
  }
  if (t.messageId) {
    cn(t);
    return;
  }
  const r = Ub(t);
  if (r) {
    po(r, t), it(r), nn(r, t), lo(r), rn(r), on(r);
    return;
  }
  cn(t);
}
function lo(e) {
  tn && Ri(e, tn);
}
function it(e) {
  const t = Yh();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = wi(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(ro) === "true") return;
  const r = n.querySelector(`.${en}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(ro, "true");
}
function Yh() {
  try {
    return Gs() === "replace";
  } catch {
    return !1;
  }
}
function nn(e, t) {
  if (it(e), e.querySelector(`[${yt}="${be(t.pendingId)}"]`)) return;
  const n = Qh(e, t);
  Xh(n, t), mb(n, fb(t)).append(hb(t));
}
function Qh(e, t) {
  const n = e.querySelector(`.${en}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(en, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const i = document.createElement("span");
  i.classList.add(`${h}__kicker`), i.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Mh), s.textContent = Zh(t);
  const c = document.createElement("span");
  return c.classList.add(bi), c.textContent = t.summary, o.append(i, s, c), r.append(o), _b(e).append(r), r;
}
function Zh(e) {
  const t = C(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Xh(e, t) {
  const n = t.summaryLines ?? [], r = Ii(n, t);
  if (r) {
    Jh(e, r, t);
    return;
  }
  pb(e, n);
}
function Jh(e, t, n) {
  if (e.querySelector(`[${no}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(ao, `${ao}--${t.intent}`), r.setAttribute(no, "true"), t.castingCheck && uo(r, tb(t.castingCheck), n.pendingId, "casting"), eb(t) && uo(r, nb(t), n.pendingId, "effect"), sb(r, t), cb(r, t, n), db(r, t), e.append(r);
}
function eb(e) {
  return e.intent !== "casting";
}
function tb(e) {
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
function nb(e) {
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
function uo(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${h}__workflow-section--${t.status}`);
  const i = document.createElement("div");
  i.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, i.append(s), t.statusLabel) {
    const c = document.createElement("span");
    c.classList.add(`${h}__workflow-section-status`), c.textContent = t.statusLabel, i.append(c);
  }
  if (o.append(i), t.description) {
    const c = document.createElement("span");
    c.classList.add(`${h}__workflow-section-description`), c.textContent = t.description, o.append(c);
  }
  rb(o, t), ub(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function rb(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const i = ob(t.formula, t.diceBreakdown);
  i && n.append(i), e.append(n);
}
function ob(e, t) {
  const n = ab(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of ib(n, e)) {
    const i = document.createElement("span");
    i.classList.add(`${h}__workflow-die`), o.active || i.classList.add(`${h}__workflow-die--inactive`), i.textContent = String(o.value), r.append(i);
  }
  return r;
}
function ab(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function ib(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? mo(e, "highest") : n.includes("kl") ? mo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function mo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const i = !r && o === n;
    return i && (r = !0), { value: o, active: i };
  });
}
function sb(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(cy);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const i = document.createElement("span");
    i.classList.add(`${h}__roll-meta-pill`), i.textContent = o, r.append(i);
  }
  e.append(r);
}
function cb(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const i = document.createElement("strong");
  i.textContent = "Resistência";
  const s = lb(t, n);
  o.append(i), s && o.append(s);
  const c = document.createElement("span");
  c.classList.add(`${h}__resistance-description`), c.textContent = t.resistance, r.append(o, c), t.resistanceRollResult && r.append(Ti(t.resistanceRollResult)), e.append(r);
}
function lb(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(yt, t.pendingId), n.setAttribute(di, "true"), n.setAttribute(mi, e.resistanceSkill), n.setAttribute(fi, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(pi, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(gi, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(hi, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Ti(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = Ei(e), t;
}
function ub(e, t, n, r, o) {
  const i = t.filter((m) => m.value.trim().length > 0);
  if (i.length === 0) return;
  const s = `${n}-roll-details-${r}`, c = document.createElement("button");
  c.type = "button", c.classList.add(`${h}__roll-detail-toggle`), c.setAttribute(On, s), c.setAttribute("aria-expanded", "false"), c.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(li, s), u.hidden = !0;
  for (const m of i) {
    const f = document.createElement("dt");
    f.textContent = m.label;
    const _ = document.createElement("dd");
    _.textContent = m.value, u.append(f, _);
  }
  e.append(c, u);
}
function db(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function mb(e, t) {
  const n = `[${eo}="${be(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Fh), o.setAttribute(eo, t.id);
  const i = document.createElement("strong");
  return i.classList.add(`${h}__actions-title`), i.textContent = t.title, o.append(i), e.append(o), o;
}
function fb(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = Ii(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function pb(e, t) {
  if (t.length === 0) return;
  const n = gb(e);
  for (const r of t) {
    const o = ly(r);
    if (n.querySelector(`[${to}="${be(o)}"]`)) continue;
    const i = document.createElement("li");
    i.textContent = r, i.setAttribute(to, o), n.append(i);
  }
}
function gb(e) {
  const t = e.querySelector(`.${oo}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(oo), e.append(n), n;
}
function hb(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(yt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(yi), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(_t, e.pendingId), t.setAttribute(xn, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Jt, e.choiceGroupId), t.setAttribute(ci, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function bb(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = yb(e);
  return `${t} → ${n}`;
}
function yb(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function _b(e) {
  return wi(e) ?? e;
}
function wi(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Ri(e, t) {
  const n = $t(e);
  if (!n) return;
  const r = n.querySelectorAll(Nh);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Pb(o, t);
    }));
}
function rn(e) {
  const t = $t(e);
  if (!t) return;
  const n = t.querySelectorAll(xh);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Ab(t, r);
    }));
}
function on(e) {
  const t = $t(e);
  if (!t) return;
  const n = t.querySelectorAll(Oh);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      $b(t, r);
    }));
}
function Ab(e, t) {
  const n = t.getAttribute(On);
  if (!n) return;
  const r = e.querySelector(`[${li}="${be(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function $b(e, t) {
  const n = t.getAttribute(yt), r = t.getAttribute(mi), o = t.getAttribute(fi) ?? (r ? ai(r) : "Resistência");
  if (!n || !r) return;
  const i = Rb(e, n), s = kb(i, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Ch(s, r);
    await Lb(u.roll);
    const m = {
      skill: r,
      skillLabel: o,
      formula: u.formula,
      total: u.total,
      targetName: s.name ?? i?.resistanceTargetName ?? "alvo",
      diceBreakdown: u.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Tb(t, m), wb(t, m), Db(n, m), await vb(e, n, m);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1;
  }
}
function Tb(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(hi, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function wb(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Ti(t);
  if (r) {
    r.textContent = Ei(t);
    return;
  }
  n.append(o);
}
function Rb(e, t) {
  const n = v.get(t);
  if (n) return n;
  const r = At(e);
  return B(r)[t] ?? null;
}
function kb(e, t) {
  const n = e?.resistanceTargetActor;
  if (O(n)) return n;
  const o = e?.context?.targets.map(an).find(O) ?? null;
  if (o) return o;
  const i = t.getAttribute(pi) ?? e?.resistanceTargetActorId ?? null, s = i ? Cb(i) : null;
  return s || Ib(
    t.getAttribute(gi) ?? e?.resistanceTargetName ?? Eb(t)
  );
}
function Eb(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${bi}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), i = o[o.length - 1]?.trim();
  return i && i.length > 0 ? i : null;
}
function an(e) {
  const t = e.actor;
  if (O(t)) return t;
  const n = e.token, r = ve(n);
  if (r) return r;
  const o = e.document;
  return ve(o);
}
function ve(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (O(t)) return t;
  const n = e.document?.actor;
  return O(n) ? n : null;
}
function Cb(e) {
  const n = game.actors?.get?.(e);
  return O(n) ? n : ki().map((i) => ve(i)).find((i) => i?.id === e) ?? null;
}
function Ib(e) {
  const t = ue(e);
  if (!t) return null;
  const n = ki().filter((i) => ue(Sb(i)) === t).map((i) => ve(i)).find(O) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((i) => O(i) && ue(i.name) === t);
  return O(o) ? o : null;
}
function ki() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Sb(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : ve(e)?.name ?? null;
}
function ue(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function O(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ei(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Lb(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Db(e, t) {
  const n = v.get(e);
  n && (n.resistanceRollResult = t);
}
async function vb(e, t, n) {
  const r = At(e);
  if (r)
    try {
      const o = B(r), i = o[t];
      if (!i) return;
      o[t] = {
        ...i,
        resistanceRollResult: n
      }, await he(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function At(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return M(r?.get?.(n));
}
async function Pb(e, t) {
  const n = e.getAttribute(_t);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    Ci(e, e.getAttribute(xn) ?? "✓ Automação aplicada"), Nb(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function Ci(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(yi), e.removeAttribute(_t), e.removeAttribute(xn);
}
function Nb(e) {
  const t = e.getAttribute(Jt);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Jt}="${be(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const i = o.getAttribute(ci) ?? "✓ Outra opção escolhida";
    Ci(o, i);
  }
}
function Ii(e, t) {
  const n = e.map(Mn).filter(iy), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = C(e, "Forma"), i = C(e, "Custo"), s = C(e, "Dados") ?? C(e, `Dados (${r.label})`), c = C(e, "Tipo"), u = C(e, "Resistência"), m = C(e, "Resistência Perícia"), f = C(e, "Resistência Rótulo") ?? (m ? ai(m) : null), _ = Si(e, "Observação"), $ = e.filter((g) => Fb(g, r)), T = xb(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: i,
    diceBreakdown: s,
    damageType: c,
    resistance: u,
    resistanceSkill: m,
    resistanceSkillLabel: f,
    notes: _,
    details: $,
    castingCheck: T,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function xb(e) {
  const t = e.map(Mn).find((i) => i?.intent === "casting") ?? null, n = C(e, "Conjuração DT"), r = C(e, "Conjuração Resultado");
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
function Mn(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, i = Number(o);
  return Number.isFinite(i) ? {
    label: n,
    formula: r,
    total: i,
    intent: Ob(n)
  } : null;
}
function Ob(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function C(e, t) {
  return Si(e, t)[0] ?? null;
}
function Si(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Fb(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Mn(e) ? !1 : e.trim().length > 0;
}
function Mb(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of v.values())
    sn(r, e, t) && n.set(r.pendingId, r);
  for (const r of jb(e))
    sn(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function sn(e, t, n) {
  const r = G(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !fo(n, "itemId", e.itemId) ? !1 : !e.actorId || fo(n, "actorId", e.actorId);
}
function fo(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${uy(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Bb(e) {
  const t = be(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Ub(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (sn(e, null, t))
      return t;
  return null;
}
function qb() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of v.entries())
    e - r.createdAt > t && v.delete(n);
}
async function po(e, t) {
  const n = At(e);
  if (!n) return !1;
  try {
    const r = B(n);
    return r[t.pendingId] = qn(t, G(n)), await he(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Bn(e) {
  const t = Pi(e);
  if (!t) return !1;
  try {
    const n = B(t);
    return n[e.pendingId] = qn(e, G(t)), await he(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Li(e) {
  for (const t of Bh)
    globalThis.setTimeout(() => {
      cn(e);
    }, t);
}
async function cn(e) {
  const t = Pi(e);
  if (Un(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await Bn(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function zb(e, t) {
  const n = vi(e.context.message);
  if (n)
    try {
      const r = B(n), o = r[e.pendingId] ?? qn(e, G(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await he(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function jb(e) {
  return Object.values(B(M(e))).filter(Fe);
}
function B(e) {
  if (!e) return {};
  const t = {}, n = Un(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(Di(e)))
    t[r] ??= o;
  return t;
}
function Vb(e) {
  return Object.values(Di(M(e))).filter(Fe);
}
function Di(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, ii);
  if (!fe(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Fe(o) && (n[r] = o);
  return n;
}
async function he(e, t) {
  typeof e.setFlag == "function" && (await Gb(e, t), await Hb(e, t));
}
async function Hb(e, t) {
  await Promise.resolve(e.setFlag?.(l, ii, t));
}
function Un(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, si);
  return oy(t) ? t : null;
}
async function Gb(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Fe).sort((i, s) => i.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((i) => i.createdAt)),
    messageId: r.messageId ?? G(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: Wb(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(l, si, o));
}
function Wb(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function qn(e, t) {
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
function vi(e) {
  const t = M(e);
  if (t?.setFlag)
    return t;
  const n = Kb(e);
  if (n?.setFlag)
    return n;
  const r = G(e);
  if (!r) return null;
  const o = game.messages;
  return M(o?.get?.(r));
}
function Kb(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(M).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Pi(e) {
  const t = vi(e.context.message);
  if (t) return t;
  const n = e.messageId ? Yb(e.messageId) : null;
  if (n) return n;
  const r = Oi().slice().reverse();
  return r.find((o) => Qb(o, e)) ?? r.find((o) => Zb(o, e)) ?? null;
}
function Yb(e) {
  const t = game.messages;
  return M(t?.get?.(e));
}
function Qb(e, t) {
  const n = G(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Ni(e, t)) return !1;
  const o = xi(e);
  return !t.actorId || !o || o === t.actorId;
}
function Zb(e, t) {
  if (!Jb(e, t)) return !1;
  const n = xi(e);
  return t.actorId && n === t.actorId ? !0 : Ni(e, t);
}
function Ni(e, t) {
  const n = ue(Xb(e));
  if (!n) return !1;
  const r = ue(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = ue(t.itemId);
  return !!(o && n.includes(o));
}
function Xb(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function xi(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Jb(e, t) {
  const n = ey(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Uh;
}
function ey(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function M(e) {
  return e && typeof e == "object" ? e : null;
}
function Fe(e) {
  return fe(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && Z(e.resistanceTargetActorId) && Z(e.resistanceTargetName) && ay(e.resistanceRollResult) && ty(e.actionPayload) && xt(e.title) && xt(e.buttonLabel) && xt(e.executedLabel) && Z(e.choiceGroupId) && Z(e.skippedLabel) && Z(e.actionSectionId) && Z(e.actionSectionTitle) && sy(e.summaryLines) : !1;
}
function ty(e) {
  return e == null ? !0 : fe(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && ny(e.resource) && ry(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function ny(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function ry(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function oy(e) {
  return fe(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && fe(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Fe) : !1;
}
function ay(e) {
  return e == null ? !0 : fe(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function iy(e) {
  return e !== null;
}
function fe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function S(e) {
  return e === null || typeof e == "string";
}
function xt(e) {
  return e === void 0 || typeof e == "string";
}
function Z(e) {
  return e == null || typeof e == "string";
}
function sy(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function cy(e) {
  return typeof e == "string" && e.length > 0;
}
function Oi() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(M).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(M).filter((r) => r !== null) : [];
}
function $t(e) {
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
function ly(e) {
  return e.trim().toLowerCase();
}
function uy(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function be(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const go = 1e3;
class dy {
  constructor(t, n, r, o, i, s) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = i, this.debugOutput = s, this.ritualAssistant = new Sg(
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
      settings: Zn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Zn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = un(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && _y(t.item) && n.executionMode === "ask") {
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
    if (await Gr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Mt(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await Nt(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Nt(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Fn(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = Ty(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const i = await tt(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return i.ok ? (await Vh(t), await Hh(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(i), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (zh(
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
    if (await Gr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Mt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      Ay(t.item)
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
      return o.ok ? (yy(n, o.value), await my(o.value), {
        ok: !0,
        executedLabel: fy(o.value)
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
    const n = Ot(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && Ot(o.action) === n);
    for (const [o, i] of r)
      i.kind === "assisted-action" && i.id !== t.id && (this.pendingExecutions.delete(o), await Nt(
        o,
        bo(i.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Bt();
    await jh({
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
      const c = Bt();
      i ??= c, this.pendingExecutions.set(c, {
        kind: "assisted-action",
        id: c,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await so({
        pendingId: c,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Ot(s),
        skippedLabel: bo(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: $y(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      i
    ), d.info(
      "Ritual assistido preparado com ações pendentes.",
      ee(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = Bt();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await so({
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
    const n = Date.now(), r = yo(t);
    for (const [i, s] of this.recentExecutionKeys.entries())
      n - s > go && this.recentExecutionKeys.delete(i);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= go;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(yo(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = Mt(
      t,
      n,
      r,
      o
    );
  }
}
async function my(e) {
  const t = by();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: py(e)
      });
    } catch (n) {
      d.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function fy(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function py(e) {
  const t = e.instances.map((s) => {
    const c = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Qe(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${c}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = gy(e), i = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Qe(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${Qe(e.actorName)}</strong></p>
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
function gy(e) {
  const t = hy(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Qe(o)}</li>`;
}
function hy(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = ho(n?.value);
  return r === null ? null : {
    value: r,
    max: ho(n?.max)
  };
}
function ho(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function by() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function Qe(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function Ot(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function bo(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function yy(e, t) {
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
function _y(e) {
  return e.type === "ritual";
}
function Ay(e) {
  return Up(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function $y(e) {
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
function Ty(e) {
  const t = e.actorUuid ? wy(e.actorUuid) : null;
  if (pe(t)) return t;
  const n = e.actorId ? Ry(e.actorId) : null;
  return n || ky(e.actorName);
}
function wy(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Ry(e) {
  const n = game.actors?.get?.(e);
  if (pe(n)) return n;
  for (const r of Fi()) {
    const o = zn(r);
    if (o?.id === e) return o;
  }
  return null;
}
function ky(e) {
  const t = Ft(e);
  if (!t) return null;
  for (const o of Fi()) {
    const i = Ey(o);
    if (Ft(i) === t) {
      const s = zn(o);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (o) => pe(o) && Ft(o.name) === t
  );
  return pe(r) ? r : null;
}
function Fi() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ey(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : zn(e)?.name ?? null;
}
function zn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (pe(t)) return t;
  const n = e.document?.actor;
  return pe(n) ? n : null;
}
function Ft(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function pe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Mt(e, t, n, r) {
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
function yo(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Bt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Cy {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], i = Ne(t);
    for (const s of n) {
      const c = s.itemId ? i.find((f) => f.id === s.itemId) ?? null : null, u = s.match?.preset ?? null;
      if (!c || !u) {
        o.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(c, u);
      const m = await this.itemPatches.applyPresetItemPatch(c, u);
      r.push({
        itemId: c.id ?? null,
        itemName: c.name ?? "Ritual sem nome",
        presetId: u.id,
        presetLabel: u.label,
        previousStatus: s.status,
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
class Iy {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Ne(t).map((c) => this.analyzeRitual(c)), r = n.filter(Ge("upToDate")), o = n.filter(Ge("available")), i = n.filter(Ge("outdated")), s = n.filter(Ge("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = Sy(t);
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
      reason: Ly(r, n.preset)
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
    preset: e.match ? lt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function Sy(e) {
  const t = e.getFlag(l, "automation");
  return dn(t) ? t : null;
}
function Ly(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Ge(e) {
  return (t) => t.status === e;
}
class Dy {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = fn(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), o = ee(t);
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
    const n = A(t.actorName), r = A(t.resource), o = A(_o(t)), i = A(Py(t));
    return `
      <section class="${l}-card ${l}-resource-card">
        <header class="${l}-card__header">
          <strong>${o}</strong>
          <span>${n}</span>
        </header>
        <div class="${l}-card__body">
          <p><strong>${i}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, n) {
    const r = A(n.title ?? "Automação"), o = n.message ? `<p>${A(n.message)}</p>` : "", i = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = A(t.item.name ?? "Item sem nome"), c = t.targets.length > 0 ? t.targets.map((g) => A(g.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map(
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(vy(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), m = t.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(Ny(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), _ = t.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), $ = t.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(_o(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), T = t.phases.map((g) => A(g)).join(" &rarr; ");
    return `
      <section class="${l}-card ${l}-workflow-card">
        <header class="${l}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${l}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${i}</p>
          <p><strong>Alvo:</strong> ${c}</p>
          ${m.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${m.join("")}</ul>` : ""}
          ${u.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Dano:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${_.length > 0 ? `<p><strong>Cura:</strong></p><ul>${_.join("")}</ul>` : ""}
          ${$.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${$.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p class="${l}-workflow-card__phases"><strong>Fases:</strong> ${T}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function vy(e) {
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
function _o(e) {
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
function Py(e) {
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
function Ny(e) {
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
function xy() {
  const e = new Wd(), t = new zm(e), n = new zd(), r = new Qd(), o = new Jd(r), i = new fm(e), s = new gm(), c = s.registerMany(
    Rs()
  );
  if (!c.ok)
    throw new Error(c.error.message);
  const u = new pm(), m = new dm(), f = bp(), _ = new cf(f), $ = new Iy(
    s
  ), T = new Cy(
    $,
    u,
    m
  ), g = new Gm(), P = new Dy(g), _e = new Hm(), Ae = new Um(
    t,
    o,
    P,
    _e
  ), $e = new Vm(Ae, _e), R = new dy(
    $e,
    t,
    o,
    n,
    _,
    g
  );
  return R.addStrategy(
    new lm(
      (U) => R.handleItemUsed(U)
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
    itemPatches: m,
    conditionRegistry: f,
    conditions: _,
    debugOutput: g,
    chatMessages: P,
    workflowHooks: _e,
    automation: Ae,
    workflow: $e,
    itemUseIntegration: R,
    ritualPresetDiagnostic: $,
    ritualPresetApplications: T
  };
}
const { ApplicationV2: Oy } = foundry.applications.api;
class st extends Oy {
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
      apply: st.onApply,
      cancel: st.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${N(ln)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${N(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Ut("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Ut("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Ut("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Ut(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${N(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Fy(n) : By(t)}
    </section>
  `;
}
function Fy(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(My).join("")}</ol>`;
}
function My(e) {
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
function By(e) {
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
const ct = `${l}.manageRitualPresets`, Ao = `__${l}_ritualPresetHeaderControlRegistered`, Uy = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function qy(e) {
  const t = globalThis;
  if (!t[Ao]) {
    for (const n of Uy)
      Hooks.on(n, (r, o) => {
        zy(r, o, e);
      });
    t[Ao] = !0, d.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function zy(e, t, n) {
  Array.isArray(t) && Vy(e) && (jy(e, n), !t.some((r) => r.action === ct) && t.push({
    action: ct,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Mi(e, n);
    }
  }));
}
function jy(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[ct] && (e.options.actions[ct] = (n) => {
    n.preventDefault(), n.stopPropagation(), Mi(e, t);
  }));
}
function Vy(e) {
  if (!game.user?.isGM) return !1;
  const t = Bi(e);
  return t ? t.type === "agent" && Ne(t).length > 0 : !1;
}
function Mi(e, t) {
  const n = Bi(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new st(n, t).render({ force: !0 });
}
function Bi(e) {
  return $o(e.actor) ? e.actor : $o(e.document) ? e.document : null;
}
function $o(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Ui = "data-paranormal-toolkit-ritual-roll-config", Me = "data-paranormal-toolkit-ritual-roll-field", te = "data-paranormal-toolkit-ritual-roll-action", To = `__${l}_ritualRollConfigBlockRegistered`, Hy = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], Gy = [
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
function Wy() {
  const e = globalThis;
  if (!e[To]) {
    Ky();
    for (const t of Hy)
      Hooks.on(t, (...n) => {
        Yy(n[0], n[1]);
      });
    e[To] = !0, d.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function Ky() {
  const e = `${l}-ritual-roll-config-inline-style`;
  if (document.getElementById(e)) return;
  const t = document.createElement("style");
  t.id = e, t.textContent = `
.${l}-ritual-roll-config {
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
.${l}-ritual-roll-config__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.${l}-ritual-roll-config__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.${l}-ritual-roll-config__title strong {
  color: rgba(89, 36, 42, 0.96);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}
.${l}-ritual-roll-config__title span {
  font-size: 0.9rem;
  font-weight: 800;
}
.${l}-ritual-roll-config__badge {
  border: 1px solid rgba(89, 36, 42, 0.25);
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.36);
  color: rgba(89, 36, 42, 0.9);
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
}
.${l}-ritual-roll-config__hint,
.${l}-ritual-roll-config__status {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.35;
  opacity: 0.8;
}
.${l}-ritual-roll-config__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.${l}-ritual-roll-config__forms-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.${l}-ritual-roll-config__forms-title {
  color: rgba(24, 19, 18, 0.9);
  font-size: 0.8rem;
  font-weight: 900;
}
.${l}-ritual-roll-config__forms-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.${l}-ritual-roll-config__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: left;
}
.${l}-ritual-roll-config__field input,
.${l}-ritual-roll-config__field select,
.${l}-ritual-roll-config__field textarea {
  width: 100%;
  min-width: 0;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
}
.${l}-ritual-roll-config__field textarea {
  resize: vertical;
}
.${l}-ritual-roll-config__field small {
  color: rgba(89, 36, 42, 0.78);
  font-size: 0.72rem;
  font-weight: 700;
}
.${l}-ritual-roll-config__form-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 7px;
  padding: 7px;
  background: rgba(255, 255, 255, 0.28);
}
.${l}-ritual-roll-config__form-card:has(input:disabled) {
  opacity: 0.72;
}
.${l}-ritual-roll-config__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.${l}-ritual-roll-config__actions button {
  width: auto;
  margin: 0;
}
.${l}-ritual-roll-config [hidden] {
  display: none !important;
}
@media (max-width: 620px) {
  .${l}-ritual-roll-config__fields,
  .${l}-ritual-roll-config__forms-grid {
    grid-template-columns: 1fr;
  }
}
`, document.head.append(t);
}
function Yy(e, t) {
  const n = l_(e);
  if (!n || n.type !== "ritual") return;
  const r = m_(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  Zy(o);
  const i = zi(n), s = Ja(n), c = u_(n), u = Xy(n, s, i, c);
  o_(u, n, i, c), Qy(o, u), jn(u);
}
function Qy(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function Zy(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Ui}]`)))
    t.remove();
}
function Xy(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${l}-ritual-roll-config`), o.setAttribute(Ui, e.uuid ?? e.id ?? "ritual");
  const i = document.createElement("header");
  i.classList.add(`${l}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${l}-ritual-roll-config__title`), s.append(wo("strong", "Paranormal Toolkit")), s.append(wo("span", "Fórmula de rolagem"));
  const c = document.createElement("span");
  c.classList.add(`${l}-ritual-roll-config__badge`), c.textContent = Vi(t) ? "Configurada" : "Rascunho", i.append(s, c), o.append(i);
  const u = document.createElement("p");
  u.classList.add(`${l}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const m = document.createElement("div");
  m.classList.add(`${l}-ritual-roll-config__fields`), m.append(Jy(t, r)), m.append(e_(t, r)), m.append(t_(t, r)), o.append(m), o.append(n_(t, n, r)), o.append(r_(r));
  const f = document.createElement("p");
  return f.classList.add(`${l}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function Jy(e, t) {
  const n = Tt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Me, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const i = document.createElement("option");
    i.value = o, i.textContent = Bp(o), i.selected = e.intent === o, r.append(i);
  }
  return n.append(r), n;
}
function e_(e, t) {
  const n = Tt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Me, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const i of Gy) {
    const s = document.createElement("option");
    s.value = i.value, s.textContent = i.label, s.selected = e.damageType === i.value, r.append(s);
  }
  return n.append(r), n;
}
function t_(e, t) {
  const n = Tt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Me, "utilityLabel"), n.append(r), n;
}
function n_(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${l}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${l}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const i = document.createElement("div");
  return i.classList.add(`${l}-ritual-roll-config__forms-grid`), i.append(qt("base", "Padrão", e.forms.base.formula, !0, n)), i.append(qt("discente", "Discente", e.forms.discente.formula, t.discente, n)), i.append(qt("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(i), r;
}
function qt(e, t, n, r, o) {
  const i = Tt(t);
  i.classList.add(`${l}-ritual-roll-config__form-card`), i.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !o || !r, s.setAttribute(Me, `formula.${e}`), i.append(s), !r) {
    const c = document.createElement("small");
    c.textContent = "Indisponível neste ritual.", i.append(c);
  }
  return i;
}
function r_(e) {
  const t = document.createElement("div");
  t.classList.add(`${l}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(te, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(te, "clear"), t.append(n, r), t;
}
function Tt(e) {
  const t = document.createElement("label");
  t.classList.add(`${l}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function wo(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function o_(e, t, n, r) {
  ye(e, "intent")?.addEventListener("change", () => jn(e)), Eo(e, "system.studentForm")?.addEventListener("change", () => Ro(e, t)), Eo(e, "system.trueForm")?.addEventListener("change", () => Ro(e, t)), e.querySelector(`[${te}="save"]`)?.addEventListener("click", () => {
    r && a_(e, t, n);
  }), e.querySelector(`[${te}="clear"]`)?.addEventListener("click", () => {
    r && i_(e, t);
  });
}
async function a_(e, t, n) {
  const r = e.querySelector(`[${te}="save"]`);
  r?.setAttribute("disabled", "true"), de(e, "Salvando configuração...");
  try {
    const o = s_(e, n);
    await Fp(t, o), qi(e, o), de(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), de(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function i_(e, t) {
  const n = e.querySelector(`[${te}="clear"]`);
  n?.setAttribute("disabled", "true"), de(e, "Limpando configuração...");
  try {
    await Mp(t);
    const r = Ja(t);
    c_(e, r), qi(e, r), de(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), de(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function qi(e, t) {
  const n = e.querySelector(`.${l}-ritual-roll-config__badge`);
  n && (n.textContent = Vi(t) ? "Configurada" : "Rascunho");
}
function s_(e, t) {
  return {
    schemaVersion: 1,
    intent: ji(ye(e, "intent")?.value),
    damageType: Co(e, "damageType"),
    utilityLabel: Co(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Ze(e, "formula.base") },
      discente: { formula: Ze(e, "formula.discente") },
      verdadeiro: { formula: Ze(e, "formula.verdadeiro") }
    }
  };
}
function c_(e, t) {
  oe(e, "intent", t.intent), oe(e, "damageType", t.damageType ?? ""), oe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), oe(e, "formula.base", t.forms.base.formula), oe(e, "formula.discente", t.forms.discente.formula), oe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), jn(e);
}
function jn(e) {
  const t = ji(ye(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function Ro(e, t) {
  const n = zi(t);
  ko(e, "discente", n.discente), ko(e, "verdadeiro", n.verdadeiro);
}
function ko(e, t, n) {
  const r = ye(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${te}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const i = r.closest(`.${l}-ritual-roll-config__field`), s = i?.querySelector("small");
  if (i) {
    if (n) {
      s?.remove();
      return;
    }
    if (!s) {
      const c = document.createElement("small");
      c.textContent = "Indisponível neste ritual.", i.append(c);
    }
  }
}
function de(e, t) {
  const n = e.querySelector(`.${l}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function zi(e) {
  const t = d_(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function l_(e) {
  return Io(e.item) ? e.item : Io(e.document) ? e.document : null;
}
function u_(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function d_(e) {
  const t = e.system;
  return f_(t) ? t : {};
}
function Eo(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ye(e, t) {
  return e.querySelector(`[${Me}="${p_(t)}"]`);
}
function Ze(e, t) {
  return ye(e, t)?.value.trim() ?? "";
}
function Co(e, t) {
  const n = Ze(e, t);
  return n.length > 0 ? n : null;
}
function oe(e, t, n) {
  const r = ye(e, t);
  r && (r.value = n);
}
function ji(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Vi(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function m_(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Io(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function f_(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function p_(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let J = null;
Hooks.once("init", () => {
  $s(), Hs(), kc(), Rd(), d.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!er.isSupportedSystem()) {
    d.warn(
      `Sistema não suportado: ${er.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  J = xy(), J.itemUseIntegration.registerStrategies(), $c(J.conditions), oc(J), gc(), dc(), Ld(), qy(J), Wy(), d.info("Inicializado para o sistema Ordem Paranormal."), d.info(
    `API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${ln} inicializado.`);
});
function g_() {
  if (!J)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return J;
}
export {
  g_ as getToolkitServices
};
//# sourceMappingURL=main.js.map
