const l = "paranormal-toolkit", ln = "Paranormal Toolkit", zi = "ordemparanormal";
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
function ji(e) {
  return dn(e.getFlag(l, "automation"));
}
function dn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Hi(t.source) && Vi(t.definition);
}
function Vi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && w(t.label) && Array.isArray(t.steps) && t.steps.every(Gi) && (t.conditionApplications === void 0 || Xi(t.conditionApplications));
}
function Hi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? w(t.presetId) && w(t.presetVersion) && w(t.appliedAt) : t.type === "manual" ? w(t.label) && w(t.appliedAt) : !1;
}
function Gi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Wi(t);
    case "spendRitualCost":
      return Ki(t);
    case "rollFormula":
      return Yi(t);
    case "modifyResource":
      return Qi(t);
    case "chatCard":
      return Zi(t);
    default:
      return !1;
  }
}
function Wi(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Io(t);
}
function Ki(e) {
  return e.type === "spendRitualCost";
}
function Yi(e) {
  const t = e;
  return t.type === "rollFormula" && w(t.id) && w(t.formula) && (t.intent === void 0 || os(t.intent)) && (t.damageType === void 0 || w(t.damageType));
}
function Qi(e) {
  const t = e;
  return t.type === "modifyResource" && So(t.actor) && ns(t.resource) && rs(t.operation) && Io(t) && (t.damageType === void 0 || t.damageType === null || w(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Zi(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Xi(e) {
  return Array.isArray(e) && e.every(Ji);
}
function Ji(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return w(t.id) && So(t.actor) && w(t.conditionId) && (t.label === void 0 || w(t.label)) && (t.duration === void 0 || t.duration === null || es(t.duration)) && (t.source === void 0 || w(t.source)) && (t.actionSectionId === void 0 || w(t.actionSectionId)) && (t.actionSectionTitle === void 0 || w(t.actionSectionTitle)) && (t.executedLabel === void 0 || w(t.executedLabel));
}
function es(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || as(t.rounds)) && (t.expiry === void 0 || t.expiry === null || ts(t.expiry));
}
function ts(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Io(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || w(e.amountFrom);
}
function So(e) {
  return e === "self" || e === "target";
}
function ns(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function rs(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function os(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function as(e) {
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
    if (cs(t))
      return Array.from(t).filter(Hn);
  }
  return [];
}
function is(e) {
  return mn(e)[0] ?? null;
}
function ss(e) {
  return mn(e).find(ji) ?? null;
}
function cs(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Hn(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ne(e) {
  return mn(e).filter((t) => t.type === "ritual");
}
function Lo(e) {
  return Ne(e)[0] ?? null;
}
function ls(e) {
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
    r.applied.push(us(o, i, s));
  }
  return d.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), ds(r), r;
}
async function zt(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function us(e, t, n) {
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
function ds(e) {
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
  const t = Lo(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ee(e) {
  return e ? {
    id: e.id,
    source: {
      ...ms(e.sourceActor),
      token: e.sourceToken
    },
    item: fs(e.item),
    targets: e.targets.map(ps),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Yn(e.rollRequests, Do),
    rolls: Yn(e.rolls, gs),
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
function ms(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function fs(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function ps(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Do(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function gs(e) {
  return {
    ...Do(e),
    total: e.total
  };
}
function Yn(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function hs(e) {
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
    bs(o.error);
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
function bs(e) {
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
function ys() {
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
function _s() {
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
const vo = "ritual.costOnly", Po = "ritual.simpleHealing", As = "ritual.eletrocussao", No = "ritual.simpleDamage", xo = "generic.simpleHealing", Oo = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function $s() {
  return [
    Ts(),
    ws(),
    Rs(),
    ks(),
    Es()
  ];
}
function Ts() {
  return {
    id: vo,
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
function ws() {
  return {
    id: Po,
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
    automation: Fo(),
    itemPatch: Is()
  };
}
function Rs() {
  return {
    id: As,
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
    automation: Cs(),
    itemPatch: Ss()
  };
}
function ks() {
  return {
    id: No,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: pn()
  };
}
function Es() {
  return {
    id: xo,
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
function Fo(e = "2d8+2") {
  return Mo(
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
function Cs() {
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
  return Mo(
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
function Is() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Oo,
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
function Ss() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Oo,
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
function Mo(e, t, n) {
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
function Bo() {
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
function Ls(e) {
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
        if (!Ps(t, n)) {
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
      const r = e.automationRegistry.require(vo);
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
      const o = e.automationRegistry.require(Po);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Fo(t)
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
      const o = e.automationRegistry.require(No);
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
      n && await Ds(e, t, n);
    }
  };
}
async function Ds(e, t, n) {
  const r = un(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Bo(),
    item: n,
    targets: gn()
  });
  if (!o.ok) {
    vs(o.error);
    return;
  }
  d.info("Automação de ritual executada com sucesso.", ee(o.value.context));
}
function vs(e) {
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
  const t = Lo(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ps(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Qn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Ns = ["disabled", "ask", "automatic"], xs = ["buttons", "confirm"], Uo = "ask";
function Os(e) {
  return typeof e == "string" && Ns.includes(e);
}
function Fs(e) {
  return typeof e == "string" && xs.includes(e);
}
function Ms(e) {
  return Os(e) ? e : Fs(e) ? "ask" : Uo;
}
const Bs = ["keep", "replace"], Us = ["manual", "assisted"], qo = "keep", zo = "assisted", qs = !0, I = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function zs() {
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
    default: Uo
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
    default: qo
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
    default: zo
  }), game.settings.register(l, I.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: qs
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
  const e = Ms(game.settings.get(l, I.executionMode)), t = Vo(game.settings.get(l, I.systemCardMode)), n = Ho(game.settings.get(l, I.damageResolutionMode));
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: jo()
  };
}
function js() {
  return Vo(game.settings.get(l, I.systemCardMode));
}
function Vs() {
  return Ho(game.settings.get(l, I.damageResolutionMode));
}
function jo() {
  return game.settings.get(l, I.ritualCastingCheckEnabled) === !0;
}
async function Q(e) {
  await game.settings.set(l, I.executionMode, e);
}
function Vo(e) {
  return Bs.includes(e) ? e : qo;
}
function Ho(e) {
  return Us.includes(e) ? e : zo;
}
function Hs(e) {
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
const Gs = [
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
function Ws(e) {
  return {
    phases() {
      return Gs;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = wt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = ss(t);
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
      if (!Qs(n)) {
        d.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Ys(n) ?? wt("Nenhum ator encontrado para executar automação do item.");
      r && await Xn(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = wt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = is(t);
      if (!n) {
        d.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(xo);
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
    sourceToken: Bo(),
    item: n,
    targets: gn()
  });
  if (!o.ok) {
    Ks(o.error);
    return;
  }
  d.info("Automação executada com sucesso.", ee(o.value.context));
}
function Ks(e) {
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
function Ys(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Qs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Zs(e) {
  const t = hs(e), n = ls(e), r = Ls(e), o = Ws(e), i = _s(), s = Hs(e);
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
function Xs(e) {
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
      return Js(o), o;
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
      return ec(r), r;
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
function Js(e) {
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
function ec(e) {
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
function tc(e) {
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
    conditions: Xs(e.conditions),
    debug: Zs(e)
  }, n = globalThis;
  return n[l] = t, n.ParanormalToolkit = t, t;
}
class er {
  static isSupportedSystem() {
    return game.system.id === zi;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function nc() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ie(t.id),
    actorId: ie(t.actor?.id),
    sceneId: ie(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Go() {
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
function rc(e, t = Go()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function oc(e) {
  if (!sc(e)) return null;
  const t = e.getFlag(l, "workflow");
  return ic(t) ? t : null;
}
function ac() {
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
function ic(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function sc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ie(e) {
  return Vt(e) ? e : null;
}
function Vt(e) {
  return typeof e == "string" && e.length > 0;
}
function cc() {
  const e = (t, n) => {
    lc(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function lc(e, t) {
  const n = oc(e);
  if (!n || n.targets.length === 0) return;
  const r = dc(t);
  if (!r || r.querySelector(`.${l}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(uc(n));
}
function uc(e) {
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
function dc(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function mc() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!fc(r) || !pc(e) || tr(e) || tr(t)) return;
    const o = nc();
    if (o.length === 0 || !nr(e) && !nr(t)) return;
    const i = Go();
    e.updateSource({
      [ac()]: rc(o, i)
    }), d.info("Targets capturados para ChatMessage.", { source: i, targets: o });
  });
}
function fc(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function pc(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let or = !1, Rt = !1, kt = !1, ze = null;
const gc = 1e3, hc = 750, bc = 1e3;
function yc(e) {
  or || (Hooks.on("combatTurnChange", (t) => {
    Ac(e, ar(t));
  }), Hooks.on("deleteCombat", (t) => {
    $c(e, ar(t));
  }), or = !0, _c(e));
}
function _c(e) {
  ut() && (Rt || (Rt = !0, globalThis.setTimeout(() => {
    Rt = !1, hn(e, "ready");
  }, gc)));
}
function Ac(e, t) {
  ut() && t && (ze && globalThis.clearTimeout(ze), ze = globalThis.setTimeout(() => {
    ze = null, hn(e, "combat-turn-change", t);
  }, hc));
}
function $c(e, t) {
  ut() && t && (kt || (kt = !0, globalThis.setTimeout(() => {
    kt = !1, hn(e, "combat-deleted", t);
  }, bc)));
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
const Wo = {
  enabled: "dice.animations.enabled"
};
function Tc() {
  game.settings.register(l, Wo.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function wc() {
  return {
    enabled: game.settings.get(l, Wo.enabled) === !0
  };
}
const Ko = "chatCard", ir = "data-paranormal-toolkit-prompt-id", a = `${l}-item-use-prompt`, Rc = `.${a}__title`, Yo = `.${a}__header`, kc = `.${a}__roll-card`, Ec = `.${a}__roll-meta`, Cc = `.${a}__roll-meta-pill`, bn = `.${a}__resistance`, Ic = `.${a}__resistance-header`, Qo = `.${a}__resistance-description`, yn = `.${a}__resistance-roll-button`, Zo = `.${a}__resistance-roll-result`, sr = `${a}__resistance-content`, Xo = `.${a}__workflow-section`, Jo = `.${a}__workflow-roll`, ea = `${a}__workflow-roll--dice-open`, ta = `.${a}__workflow-roll-formula`, na = `${a}__workflow-roll-formula--toggle`, _n = `.${a}__workflow-dice-tray`, Sc = `.${a}__roll-detail-toggle`, Lc = `.${a}__roll-detail-list`, Dc = `.${a}__ritual-element-badge`, vc = `.${a}__ritual-metadata`, Pc = "casting-backlash", Nc = "data-paranormal-toolkit-action-section", xc = "data-paranormal-toolkit-prompt-id", Oc = "data-paranormal-toolkit-pending-id", cr = "data-paranormal-toolkit-casting-backlash-enhanced", lr = `.${a}`, Fc = `.${a}__workflow-section--casting`, Mc = `.${a}__workflow-section-header`, Bc = `.${a}__workflow-notes`, Uc = `[${Nc}="${Pc}"]`, ur = `${a}__workflow-section-title-row`, qc = `${a}__workflow-section-header--casting-backlash`, ra = `${a}__casting-backlash-button`;
function zc(e) {
  for (const t of jc(e))
    Vc(t), Yc(t);
}
function jc(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(lr) && t.add(e);
  for (const n of e.querySelectorAll(lr))
    t.add(n);
  return Array.from(t);
}
function Vc(e) {
  const t = e.querySelector(Uc);
  if (!t) return;
  const n = Hc(t);
  if (!n) return;
  const r = e.querySelector(`${Fc} ${Mc}`);
  r && (r.classList.add(qc), Gc(r), Wc(n), r.append(n), t.remove());
}
function Hc(e) {
  return e.querySelector(
    `button[${Oc}], button[${xc}]`
  );
}
function Gc(e) {
  const t = e.querySelector(`:scope > .${ur}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(ur);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(ra) || n.append(o));
  return n;
}
function Wc(e) {
  if (e.getAttribute(cr) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Kc(t, e.disabled);
  e.classList.add(ra), e.setAttribute(cr, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Kc(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Yc(e) {
  for (const t of e.querySelectorAll(Bc)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Qc(e) {
  for (const t of Array.from(e.querySelectorAll(Xo)))
    for (const n of Array.from(t.querySelectorAll(`${Sc}, ${Lc}`)))
      n.remove();
}
const Re = "data-paranormal-toolkit-prompt-id", Zc = "data-paranormal-toolkit-resistance-roll-result", Xc = "Conjuração DT";
function oa(e) {
  const t = e.querySelector(yn)?.getAttribute(Zc), n = Se(t);
  if (n !== null) return n;
  const r = e.querySelector(Zo)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Se(o?.[1] ?? null);
}
function aa(e) {
  const t = rl(e), n = el(t);
  if (n !== null) return n;
  const r = tl(t);
  return r !== null ? r : nl(e);
}
function Jc(e) {
  const t = e.getAttribute(Re);
  if (!t) return null;
  const n = sa(e), r = ca(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((c) => dt(c) ? c.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function V(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function ia(e) {
  return V(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function el(e) {
  const t = al(e);
  return t.length === 0 ? null : Se(il(t, Xc));
}
function tl(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : dr(r, ["system", "ritual", "DT"]) ?? dr(r, ["system", "ritual", "dt"]);
}
function nl(e) {
  const t = Array.from(e.querySelectorAll(`.${a}__workflow-section--casting .${a}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Se(n?.[1] ?? null);
}
function rl(e) {
  const t = ol(e);
  if (!t) return null;
  const n = sa(e), r = ca(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((i) => dt(i) ? i.pendingId === t : !1) ?? null;
}
function ol(e) {
  return (e.closest(`[${Re}]`) ?? e.querySelector(`[${Re}]`) ?? e.parentElement?.querySelector(`[${Re}]`) ?? null)?.getAttribute(Re) ?? null;
}
function sa(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return sl(o) ? o : null;
}
function ca(e) {
  const t = e?.getFlag?.(l, Ko);
  return dt(t) ? t : null;
}
function al(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function il(e, t) {
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
function sl(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function dt(e) {
  return !!(e && typeof e == "object");
}
const cl = `.${a}__actions`, An = `.${a}__actions-title`, Xe = `.${a}__button`, ll = "data-paranormal-toolkit-action-section", ul = `${a}__button--executed`, dl = "data-paranormal-toolkit-executed-label";
function la(e) {
  return V(e.querySelector(An)?.textContent);
}
function ml(e, t) {
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
const fl = "data-paranormal-toolkit-damage-resolution-state", mr = "data-paranormal-toolkit-damage-icon-enhanced", pl = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function gl(e, t) {
  t.classList.add(`${a}__actions--embedded`, `${a}__actions--damage-resolution`), ml(t, "Aplicar dano"), hl(e, t);
}
function hl(e, t) {
  const n = Array.from(t.querySelectorAll(Xe)), r = fr(n, "normal"), o = fr(n, "half");
  if (!r || !o) {
    t.classList.add(`${a}__actions--compact`);
    return;
  }
  pr(r, "normal"), pr(o, "half");
  const i = bl();
  if (t.classList.toggle(`${a}__actions--assisted`, i === "assisted"), t.classList.toggle(`${a}__actions--manual`, i !== "assisted"), i !== "assisted") {
    z(r, !0), z(o, !0), je(t, "manual", null);
    return;
  }
  const s = oa(e), c = aa(e);
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
  const n = pl[t];
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
  e.setAttribute(fl, t);
  const r = e.querySelector(`.${a}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${a}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(An)?.after(o);
}
function bl() {
  try {
    return Vs();
  } catch {
    return "assisted";
  }
}
const Le = "data-paranormal-toolkit-effect-icon-enhanced", me = "data-paranormal-toolkit-effect-action-compacted", mt = "data-paranormal-toolkit-effect-resistance-gate", wn = "data-paranormal-toolkit-effect-section", Rn = "data-paranormal-toolkit-effect-label";
function yl(e) {
  return e.querySelector(`[${wn}="true"]`);
}
function _l(e) {
  const t = $l(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? Tl(), r = Dl(n, e.sourceActions, t);
  return r && n.setAttribute(Rn, r), wl(n, t, r), Sl(e.rollCard, n, e.after ?? e.fallbackAfter), Ll(e.sourceActions, n), n;
}
function Al(e, t) {
  const n = t.querySelector(Xe);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (da(n, r)) {
    Pl(n);
    return;
  }
  const o = fa(t, n, r);
  if (!Nl(e, o)) {
    pa(n);
    return;
  }
  const i = aa(e), s = oa(e);
  if (i === null || s === null) {
    xl(n);
    return;
  }
  if (s >= i) {
    Ol(n);
    return;
  }
  Fl(n, o);
}
function $l(e) {
  return e.sourceActions?.querySelector(Xe) ?? e.existingSection?.querySelector(Xe) ?? null;
}
function Tl() {
  const e = document.createElement("section");
  return e.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-action`
  ), e.setAttribute(wn, "true"), e;
}
function wl(e, t, n) {
  e.setAttribute(wn, "true"), e.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-action`
  ), e.classList.remove(`${a}__actions`, `${a}__actions--effect-resolution`);
  const r = Rl(e), o = kl(r);
  o.textContent = "Efeito";
  const i = El(e, r), s = Cl(i);
  s.textContent = Ml(n ?? fa(e, t, t.textContent?.trim() ?? ""));
  const c = Il(i);
  t.parentElement !== c && c.append(t);
  const u = t.textContent?.trim() ?? "";
  !da(t, u) && !vl(t, u) && ma(t, n ?? u);
}
function Rl(e) {
  const t = e.querySelector(`:scope > .${a}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${a}__workflow-section-header`), e.prepend(n), n;
}
function kl(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function El(e, t) {
  const n = e.querySelector(`:scope > .${a}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${a}__effect-section-body`), t.after(r), r;
}
function Cl(e) {
  const t = e.querySelector(`:scope > .${a}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${a}__effect-section-label`), e.prepend(n), n;
}
function Il(e) {
  const t = e.querySelector(`:scope > .${a}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${a}__effect-section-action`), e.append(n), n;
}
function Sl(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Ll(e, t) {
  !e || e === t || e.remove();
}
function Dl(e, t, n) {
  const r = e.getAttribute(Rn);
  if (r && r.trim().length > 0) return r.trim();
  const o = t?.querySelector(`.${a}__effect-resolution-label`)?.textContent?.trim();
  return o || ua(n, n.textContent?.trim() ?? "");
}
function ua(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && V(n) !== "efeito aplicado") return n;
  const r = Jc(e);
  if (r) return r;
  const o = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && V(o) !== "aplicado" ? o : null;
}
function da(e, t) {
  return e.classList.contains(ul) || V(t).includes("aplicado");
}
function vl(e, t) {
  const n = e.getAttribute(mt);
  if (n === "pending" || n === "resisted") return !0;
  const r = ia(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function ma(e, t) {
  e.getAttribute(me) === "true" && e.getAttribute(Le) === "true" || (e.disabled = !1, e.classList.add(`${a}__button--effect-resolution-action`), e.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), e.setAttribute(me, "true"), e.setAttribute(Le, "true"), e.setAttribute(dl, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Tn("✦", `${a}__button-icon--effect`),
    xe("Aplicar")
  ));
}
function Pl(e) {
  e.getAttribute(me) === "true" && V(e.textContent) === "✓ aplicado" || (e.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-applied`), e.classList.remove(
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), e.setAttribute(me, "true"), e.setAttribute(Le, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Tn("✓", `${a}__button-icon--effect-applied`),
    xe("Aplicado")
  ));
}
function fa(e, t, n) {
  const r = e.getAttribute(Rn) ?? e.querySelector(`.${a}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : ua(t, n) ?? n;
}
function Nl(e, t) {
  if (!e.querySelector(bn)) return !1;
  const n = ia(t);
  return n.includes("vulneravel") || n.includes("vulnerable");
}
function xl(e) {
  e.disabled = !0, e.removeAttribute(me), e.removeAttribute(Le), e.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-resisted`
  ), e.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-waiting`), e.setAttribute(mt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(xe("Role resistência"));
}
function Ol(e) {
  e.disabled = !0, e.removeAttribute(me), e.removeAttribute(Le), e.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-waiting`
  ), e.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-resisted`), e.setAttribute(mt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Tn("✓", `${a}__button-icon--effect-resisted`),
    xe("Resistiu")
  );
}
function Fl(e, t) {
  pa(e), ma(e, t);
}
function pa(e) {
  e.classList.remove(
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), e.removeAttribute(mt);
}
function Ml(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const gr = "data-paranormal-toolkit-multi-target-section", ga = "data-paranormal-toolkit-multi-target-effect-info", Bl = "data-paranormal-toolkit-multi-target-toggle", ha = "data-paranormal-toolkit-multi-target-details", Ht = "data-paranormal-toolkit-multi-target-target", Ul = "data-paranormal-toolkit-multi-target-state", ba = "pending";
function ql(e) {
  const t = zl(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${a}__roll-card--multi-target`), Kl(e);
  const n = Yl(e.rollCard);
  Ql(n, t), lu(e.rollCard, n);
  const r = t.effect ? uu(e.rollCard) : ya(e.rollCard);
  return t.effect ? (du(r, t.effect), mu(e.rollCard, r, n)) : r?.remove(), !0;
}
function zl(e) {
  const t = jl(e.rollCard).map((n, r) => ({
    id: fu(n, r),
    name: n,
    state: ba
  }));
  return t.length <= 1 || !e.damageSection ? null : {
    targets: t,
    damage: Vl(e.damageSection),
    effect: Hl(e.effectSection),
    resistance: Gl(e.damageSection)
  };
}
function jl(e) {
  const n = e.closest(`.${a}`)?.querySelector(`.${a}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((o) => o.trim()).filter((o) => o.length > 0 && _a(o) !== "nenhum alvo") : [];
}
function Vl(e) {
  const t = Wl(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    halfLabel: n !== null ? `Metade: ${n} PV` : null
  };
}
function Hl(e) {
  const t = e?.querySelector(`.${a}__effect-section-label`)?.textContent?.trim();
  return t && t.length > 0 ? { label: t } : null;
}
function Gl(e) {
  const t = e?.querySelector(`.${a}__resistance-description`)?.textContent?.trim();
  return t ? {
    description: t,
    formula: e?.querySelector(`.${a}__resistance .${a}__workflow-roll-formula`)?.textContent?.trim() ?? null
  } : null;
}
function Wl(e) {
  const t = e?.querySelector(`.${a}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Kl(e) {
  e.damageSection?.classList.add(`${a}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${a}__workflow-section--multi-target-effect-source`);
}
function Yl(e) {
  const t = e.querySelector(`[${gr}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--targets`
  ), n.setAttribute(gr, "true"), n;
}
function Ql(e, t) {
  const n = Zl(e);
  e.replaceChildren(Xl(t), eu(t, n));
}
function Zl(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${Ht}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(Ht)).filter(pu)
  );
}
function Xl(e) {
  const t = document.createElement("div");
  t.classList.add(`${a}__workflow-section-header`, `${a}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${a}__targets-status`), r.textContent = Jl(e.targets), t.append(n, r), t;
}
function Jl(e) {
  const t = e.length, n = e.filter((o) => o.state === ba).length, r = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && r.push(`${n} ${n === 1 ? "pendente" : "pendentes"}`), r.join(" • ");
}
function eu(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${a}__targets-list`);
  for (const r of e.targets)
    n.append(tu(r, e, t.has(r.id)));
  return n;
}
function tu(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${a}__target-row`, `${a}__target-row--pending`), r.setAttribute(Ht, e.id), r.setAttribute(Ul, e.state), r.setAttribute("aria-expanded", n ? "true" : "false");
  const o = nu(e, t, r), i = iu(e, t);
  return i.hidden = !n, r.append(o, i), r;
}
function nu(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${a}__target-summary`);
  const o = document.createElement("div");
  o.classList.add(`${a}__target-summary-main`);
  const i = ru(e), s = document.createElement("strong");
  s.classList.add(`${a}__target-name`), s.textContent = e.name;
  const c = ou(), u = au(n);
  o.append(i, s, c, u);
  const m = document.createElement("div");
  return m.classList.add(`${a}__target-summary-actions`), m.append(
    Je("⚡", t.damage.normalLabel, `${a}__target-action--damage`),
    Je("✦", "Efeito", `${a}__target-action--effect`)
  ), r.append(o, m), r;
}
function ru(e) {
  const t = document.createElement("span");
  return t.classList.add(`${a}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function ou() {
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
function au(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${a}__target-toggle`), t.setAttribute(Bl, "true"), t.setAttribute("aria-label", "Abrir detalhes do alvo"), t.setAttribute("aria-expanded", e.getAttribute("aria-expanded") ?? "false"), hr(t), t.addEventListener("click", () => {
    const n = e.querySelector(`[${ha}="true"]`);
    if (!n) return;
    const r = n.hidden;
    n.hidden = !r, e.setAttribute("aria-expanded", r ? "true" : "false"), t.setAttribute("aria-expanded", r ? "true" : "false"), t.setAttribute("aria-label", r ? "Fechar detalhes do alvo" : "Abrir detalhes do alvo"), hr(t);
  }), t;
}
function hr(e) {
  const t = e.getAttribute("aria-expanded") === "true";
  e.textContent = t ? "⌃" : "⌄";
}
function iu(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${a}__target-details`), n.setAttribute(ha, "true");
  const r = document.createElement("div");
  r.classList.add(`${a}__target-resistance-details`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const i = document.createElement("span");
  i.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(o, i);
  const s = su(t.resistance?.formula ?? "—"), c = cu(t);
  return n.append(r, s, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function su(e) {
  const t = document.createElement("div");
  t.classList.add(`${a}__target-formula`);
  const n = document.createElement("span");
  n.textContent = e;
  const r = document.createElement("i");
  return r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), t.append(n, r), t;
}
function cu(e) {
  const t = document.createElement("div");
  return t.classList.add(`${a}__target-details-actions`), t.append(
    Je("⚡", e.damage.normalLabel, `${a}__target-action--damage`),
    Je("✦", "Aplicar efeito", `${a}__target-action--effect`)
  ), t;
}
function lu(e, t) {
  const n = $n(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function uu(e) {
  const t = ya(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-info`
  ), n.setAttribute(ga, "true"), n;
}
function ya(e) {
  return e.querySelector(`[${ga}="true"]`);
}
function du(e, t) {
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
function mu(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function fu(e, t) {
  return `${t}-${_a(e).replace(/[^a-z0-9]+/gu, "-")}`;
}
function _a(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function pu(e) {
  return typeof e == "string" && e.length > 0;
}
const se = "data-paranormal-toolkit-prompt-id", gu = "data-paranormal-toolkit-card-layout-normalized", br = "data-paranormal-toolkit-card-layout-refresh-bound", hu = "apply-damage", Aa = [0, 80, 180, 400, 900, 1600, 3e3], yr = /* @__PURE__ */ new WeakSet();
function bu(e) {
  $a(e), yu(e);
}
function $a(e) {
  for (const t of Array.from(e.querySelectorAll(`.${a}__roll-card`)))
    wa(Ta(t));
}
function yu(e) {
  if (!yr.has(e)) {
    yr.add(e);
    for (const t of Aa)
      globalThis.setTimeout(() => {
        $a(e);
      }, t);
  }
}
function Ta(e) {
  return {
    rollCard: e,
    damageSection: $n(e, "Dano"),
    resistance: e.querySelector(bn),
    damageActions: _u(e),
    effectActionSource: Au(e),
    effectSection: yl(e)
  };
}
function wa(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: o,
    effectActionSource: i,
    effectSection: s
  } = e;
  t.setAttribute(gu, "true"), t.classList.add(`${a}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), gl(t, o));
  const c = _l({
    rollCard: t,
    existingSection: s,
    sourceActions: i,
    after: n,
    fallbackAfter: $n(t, "Conjuração")
  });
  c && Al(t, c), ql({
    rollCard: t,
    damageSection: n,
    effectSection: c ?? s
  }), Cu(t);
}
function _u(e) {
  const t = $u(e);
  return t.find((n) => n.getAttribute(ll) === hu) ?? t.find((n) => la(n) === "aplicar danos") ?? null;
}
function Au(e) {
  const t = Ra(e), n = _r(t);
  return n || _r(Tu(e));
}
function _r(e) {
  return e.find((t) => {
    const n = la(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function $u(e) {
  const t = Ra(e);
  return t.length > 0 ? t : kn(e);
}
function Ra(e) {
  const t = ku(e);
  return t ? kn(e).filter((n) => Ru(n, t)) : [];
}
function Tu(e) {
  const t = ka(e);
  if (!t) return [];
  const n = wu(e, t);
  return kn(e).filter((r) => !r.closest(`.${a}__roll-card`)).filter((r) => Ea(e, r)).filter((r) => !n || Eu(r, n));
}
function kn(e) {
  const t = ka(e);
  return t ? Array.from(t.querySelectorAll(cl)) : [];
}
function ka(e) {
  return e.closest(`.${a}`) ?? e.parentElement;
}
function wu(e, t) {
  return Array.from(t.querySelectorAll(`.${a}__roll-card`)).find((n) => n !== e && Ea(e, n)) ?? null;
}
function Ru(e, t) {
  return e.getAttribute(se) === t ? !0 : Array.from(e.querySelectorAll(`[${se}]`)).some((n) => n.getAttribute(se) === t);
}
function ku(e) {
  return e.getAttribute(se) ?? e.querySelector(`[${se}]`)?.getAttribute(se) ?? null;
}
function Ea(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Eu(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Cu(e) {
  const t = e.querySelector(yn);
  t && t.getAttribute(br) !== "true" && (t.setAttribute(br, "true"), t.addEventListener("click", () => {
    for (const n of Aa)
      globalThis.setTimeout(() => {
        wa(Ta(e));
      }, n);
  }));
}
const Iu = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function Su(e) {
  for (const t of Array.from(e.querySelectorAll(bn)))
    Lu(t);
  bu(e);
}
function Lu(e) {
  const t = e.querySelector(Ic), n = e.querySelector(Qo), r = e.querySelector(yn), o = e.querySelector(Zo);
  if (!r || !t && !n && !o) return;
  const i = Du(e, r);
  t && t.parentElement !== i && i.append(t), n && n.parentElement !== i && i.append(n), o && (o.parentElement !== e && !r.contains(o) && e.append(o), vu(o)), r.parentElement !== e && e.append(r);
}
function Du(e, t) {
  const n = e.querySelector(`.${sr}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(sr), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function vu(e) {
  const t = Pu(e.textContent ?? "");
  t && (e.setAttribute(Iu, "true"), e.replaceChildren(Ou(t)));
}
function Pu(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, i = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: c, diceValues: u } = Nu(r ?? "");
  return c ? {
    skillLabel: i,
    formula: c,
    total: Math.trunc(s),
    diceValues: u
  } : null;
}
function Nu(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: xu(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function xu(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Ou(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${a}__workflow-roll`,
    `${a}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${a}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Fu(e);
  return r && t.append(r), t;
}
function Fu(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${a}__workflow-dice-tray`);
  for (const n of Mu(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${a}__workflow-die`), n.active || r.classList.add(`${a}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Mu(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ar(e, "highest") : n.includes("kl") ? Ar(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ar(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const i = !r && o === n;
    return i && (r = !0), { value: o, active: i };
  });
}
function $r(e) {
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
  const n = Bu(e, t);
  return We(n);
}
function Bu(e, t) {
  return t.split(".").reduce((n, r) => ft(n) ? n[r] : null, e);
}
function Uu(e, t) {
  const n = e.indexOf(":");
  return n < 0 || De(e.slice(0, n)) !== De(t) ? null : ge(e.slice(n + 1));
}
function We(e) {
  return typeof e == "string" ? ge(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function ft(e) {
  return !!e && typeof e == "object";
}
function qu(e) {
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
function Ca(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function zu(e) {
  for (const t of Array.from(e.querySelectorAll(kc))) {
    const n = Yu(t);
    ju(t), n && (Vu(t, n), Hu(t, n));
  }
}
function ju(e) {
  for (const t of Array.from(e.querySelectorAll(Ec)))
    t.remove();
}
function Vu(e, t) {
  const r = e.closest(`.${a}`)?.querySelector(Yo) ?? null, o = r?.querySelector(Rc) ?? null, i = r ?? e, s = i.querySelector(Dc);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const c = s ?? document.createElement("span");
  if (c.className = md(t.elementTone), c.textContent = dd(t), !s) {
    if (o?.parentElement === i) {
      o.insertAdjacentElement("afterend", c);
      return;
    }
    i.prepend(c);
  }
}
function Hu(e, t) {
  const n = Gu(e);
  Wu(e, n);
  const r = Ku(t);
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
  const i = e.querySelector(Xo);
  if (i) {
    e.insertBefore(o, i);
    return;
  }
  e.prepend(o);
}
function Gu(e) {
  return e.closest(`.${a}`)?.querySelector(Yo) ?? null;
}
function Wu(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(vc)))
      o.remove();
}
function Ku(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Gt(e.target)}` : null,
    e.duration ? `Duração: ${Gt(e.duration)}` : null,
    e.resistance ? `Resistência: ${Ca(e.resistance)}` : null
  ].filter(pt);
}
function Yu(e) {
  const t = Qu(e), n = nd(e), o = (t ? td(t) : null)?.system ?? null, i = t?.summaryLines ?? [], s = Cn(L(o, "element")), c = F("op.elementChoices", s) ?? Tr(X(i, "Elemento")) ?? Tr(n.damageType), u = s ?? fd(c), m = L(o, "circle") ?? X(i, "Círculo"), f = ad(o) ?? X(i, "Alvo"), _ = ld(o, "duration", "op.durationChoices") ?? X(i, "Duração"), $ = rd(e) ?? sd(o) ?? X(i, "Resistência"), T = od(i) ?? n.cost, g = {
    elementLabel: c,
    elementTone: u,
    circle: m,
    cost: T,
    target: f,
    duration: _,
    resistance: $
  };
  return ud(g) ? g : null;
}
function Qu(e) {
  const t = Zu(e);
  if (!t) return null;
  const n = t.getFlag?.(l, Ko), r = Ju(n);
  if (r.length === 0) return null;
  const o = Xu(e);
  if (o.size > 0) {
    const i = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (i) return i;
  }
  return r.find((i) => i.itemId || i.summaryLines.length > 0) ?? null;
}
function Zu(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? En()?.messages?.get?.(n) ?? null : null;
}
function Xu(e) {
  const t = e.closest(`.${a}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${ir}]`))) {
    const o = r.getAttribute(ir)?.trim();
    o && n.add(o);
  }
  return n;
}
function Ju(e) {
  if (!ft(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(ed).filter((n) => n !== null) : [];
}
function ed(e) {
  return ft(e) ? {
    pendingId: We(e.pendingId),
    actorId: We(e.actorId),
    itemId: We(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(qu) : []
  } : null;
}
function td(e) {
  if (!e.itemId) return null;
  const t = En(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function nd(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(Cc))) {
    const o = ge(r.textContent);
    if (!o) continue;
    const i = Uu(o, "Tipo");
    i && (n = i), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function rd(e) {
  const t = ge(e.querySelector(Qo)?.textContent);
  return t ? Ca(t) : null;
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
function od(e) {
  const t = X(e, "Custo") ?? X(e, "PE");
  return t || (e.map(ge).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function ad(e) {
  const t = L(e, "target");
  if (!t) return null;
  if (t === "area")
    return id(e) ?? F("op.targetChoices", t) ?? "Área";
  const n = F("op.targetChoices", t) ?? H(t);
  return [t === "people" || t === "creatures" ? L(e, "targetQtd") : null, n].filter(pt).join(" ");
}
function id(e) {
  const t = L(e, "area.name"), n = L(e, "area.size"), r = L(e, "area.type"), o = t ? F("op.areaChoices", t) ?? H(t) : null, i = r ? F("op.areaTypeChoices", r) ?? H(r) : null;
  return o ? n ? i ? `${o} ${n}m ${Gt(i)}` : `${o} ${n}m` : o : null;
}
function sd(e) {
  const t = L(e, "skillResis"), n = L(e, "resistance");
  if (!t || !n) return null;
  const r = F("op.skill", t) ?? H(t), o = cd(n);
  return [r, o].filter(pt).join(" ");
}
function cd(e) {
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
function ld(e, t, n) {
  const r = L(e, t);
  return r ? F(n, r) ?? H(r) : null;
}
function ud(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function dd(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function md(e) {
  return [
    `${a}__ritual-element-badge`,
    e ? `${a}__ritual-element-badge--${e}` : null
  ].filter(pt).join(" ");
}
function Cn(e) {
  const t = De(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Tr(e) {
  const t = Cn(e);
  return t ? F("op.elementChoices", t) ?? H(t) : e ? H(e) : null;
}
function fd(e) {
  return Cn(e);
}
function F(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = En()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const wr = "data-paranormal-toolkit-dice-toggle-enhanced";
function pd(e) {
  for (const t of Array.from(e.querySelectorAll(Jo)))
    Ia(t);
}
function gd(e) {
  const t = La(e.target);
  if (!t) return;
  const n = In(t);
  n && (e.preventDefault(), Sa(n, t));
}
function hd(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = La(e.target);
  if (!t) return;
  const n = In(t);
  n && (e.preventDefault(), Sa(n, t));
}
function Ia(e) {
  const t = e.querySelector(_n);
  if (!t) return;
  const n = e.querySelector(ta);
  if (n && n.getAttribute(wr) !== "true" && (n.setAttribute(wr, "true"), n.classList.add(na), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Sa(e, t) {
  const n = e.querySelector(_n);
  if (!n) return;
  const r = !e.classList.contains(ea);
  bd(e, t, n, r);
}
function bd(e, t, n, r) {
  e.classList.toggle(ea, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function La(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(ta);
  if (!t) return null;
  const n = In(t);
  return n ? (Ia(n), t.classList.contains(na) ? t : null) : null;
}
function In(e) {
  const t = e.closest(Jo);
  return t && t.querySelector(_n) ? t : null;
}
const Rr = `${l}-workflow-dice-toggle-styles`;
function yd() {
  if (document.getElementById(Rr)) return;
  const e = document.createElement("style");
  e.id = Rr, e.textContent = `
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
.${a}__target-toggle,
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
  padding: 0.28rem 0.42rem !important;
  background: rgba(228, 214, 209, 0.64) !important;
  color: rgba(42, 30, 27, 0.82) !important;
  font-size: 0.72rem !important;
  font-weight: 900 !important;
  gap: 0.26rem !important;
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
}

.${a}__target-toggle {
  width: 1.58rem !important;
  height: 1.58rem !important;
  border-color: transparent !important;
  border-radius: 999px !important;
  background: transparent !important;
  color: rgba(36, 27, 24, 0.88) !important;
  font-size: 1.05rem !important;
  font-weight: 950 !important;
  cursor: pointer !important;
}

.${a}__target-toggle:hover,
.${a}__target-toggle:focus {
  border-color: rgba(123, 72, 73, 0.2) !important;
  background: rgba(255, 255, 255, 0.54) !important;
  outline: none !important;
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
  align-items: center !important;
  gap: 0.34rem !important;
  grid-column: 1 / -1 !important;
}

.${a}__target-details-actions .${a}__target-action {
  flex: 1 1 0 !important;
  min-height: 1.9rem !important;
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
const _d = [0, 100, 500, 1500, 3e3];
let kr = !1, Et = null;
function Ad() {
  if (!kr) {
    kr = !0, yd(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ke($r(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ke($r(t));
    }), Hooks.once("ready", () => {
      ke(document), $d();
    }), document.addEventListener("click", gd), document.addEventListener("keydown", hd);
    for (const e of _d)
      globalThis.setTimeout(() => ke(document), e);
  }
}
function $d() {
  Et || !document.body || (Et = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ke(n);
  }), Et.observe(document.body, { childList: !0, subtree: !0 }));
}
function ke(e) {
  e && (Qc(e), zu(e), Su(e), pd(e), zc(e));
}
function Td() {
  Ad();
}
const wd = "data-paranormal-toolkit-action-section", Rd = "ritual-log", kd = ".paranormal-toolkit-item-use-prompt__actions", Ed = ".paranormal-toolkit-item-use-prompt__actions-title", Cd = [0, 100, 500, 1500];
let Er = !1;
function Id() {
  if (Er) return;
  const e = (t, n) => {
    Cr(vd(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Cr(document), Er = !0;
}
function Cr(e) {
  for (const t of Cd)
    globalThis.setTimeout(() => Sd(e), t);
}
function Sd(e) {
  Ld(e), Dd(e);
}
function Ld(e) {
  for (const t of e.querySelectorAll(
    `[${wd}="${Rd}"]`
  ))
    t.remove();
}
function Dd(e) {
  for (const t of e.querySelectorAll(kd)) {
    if (Ir(t.querySelector(Ed)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (i) => Ir(i.textContent ?? "")
    ).some((i) => i.includes("ritual conjurado")) && t.remove();
  }
}
function vd(e) {
  if (e instanceof HTMLElement || Pd(e))
    return e;
  if (Nd(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Pd(e) {
  return e instanceof HTMLElement;
}
function Nd(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Ir(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const xd = {
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
}, Od = new Set(
  Object.values(xd)
), Fd = {
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
function Md(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Bd(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Fd[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Od.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function Da(e) {
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
function Bd(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Ud {
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
      const _ = qd(f, m);
      if (!_.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const $ = Md(f.damageType);
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
          zd(_.id, f, $.value)
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
        for (const P of Vd(T.conditions))
          c.add(P);
        const g = jd(T.newPV);
        g !== null && (u = g), s.push({
          id: _.id,
          label: f.label ?? Da($.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: _.amount,
          finalDamage: Sr(T.finalDamage, _.amount),
          blocked: Sr(T.blocked, 0),
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
function qd(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function zd(e, t, n) {
  return {
    id: e,
    label: t.label ?? Da(n),
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
function Sr(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function jd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Vd(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const Ee = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, va = {
  PV: "system.attributes.hp"
}, Wt = {
  PV: [Ee.PV, va.PV],
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
class Hd {
  getResource(t, n) {
    const r = Lr(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, i = `${o}.value`, s = `${o}.max`, c = foundry.utils.getProperty(t, i), u = foundry.utils.getProperty(t, s), m = vr(t, n, i, c, "valor atual");
    if (m) return p(m);
    const f = vr(t, n, s, u, "valor máximo");
    return f ? p(f) : b({
      value: c,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = Lr(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function Lr(e, t) {
  const n = Gd(e.type, t);
  if (n && Dr(e, n))
    return b(n);
  const r = Wt[t].find(
    (o) => Dr(e, o)
  );
  return r ? b(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Wd(e, t),
    path: Wt[t].join(" | ")
  });
}
function Gd(e, t) {
  return e === "threat" ? va[t] ?? null : e === "agent" ? Ee[t] : null;
}
function Dr(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Wd(e, t) {
  const n = e.type ?? "unknown", r = Wt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function vr(e, t, n, r, o) {
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
class Kd {
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
    const { path: r, value: o } = n, i = Yd(o);
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
function Yd(e) {
  if (Pr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Pr(n))
      return n;
  }
  return null;
}
function Pr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Qd = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Zd {
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
    const r = n.value, o = Xd(t.ritual, r);
    return o.ok ? o.value ? b(o.value) : b({
      resource: "PE",
      amount: Qd[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Xd(e, t) {
  const n = e.getFlag(l, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Jd(n) ? {
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
function Jd(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Ct = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function em(e) {
  if (!im(e.item)) return null;
  const t = Yt(e.actor) ? e.actor : tm(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: rm(e.token) ?? nm(t),
    targets: gn(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function tm(e) {
  const t = e;
  return Yt(t.actor) ? t.actor : Yt(e.parent) ? e.parent : null;
}
function nm(e) {
  const t = om(e) ?? am(e);
  return t ? Pa(t) : null;
}
function rm(e) {
  return Qt(e) ? Pa(e) : null;
}
function om(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Qt(n) ? n : (t.getActiveTokens?.() ?? []).find(Qt) ?? null;
}
function am(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Pa(e) {
  const t = e.actor ?? null;
  return {
    tokenId: It(e.id),
    actorId: It(t?.id),
    sceneId: It(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function im(e) {
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
class sm {
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
    const n = em(cm(t));
    if (!n) {
      d.warn(`${Ct.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function cm(e) {
  return e && typeof e == "object" ? e : {};
}
class lm {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return St("missing-item-patch");
    if (t.type !== "ritual") return St("unsupported-item-type");
    const o = um(r);
    return Object.keys(o).length === 0 ? St("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function um(e) {
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
class dm {
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
class mm {
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
class fm {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = pm(t);
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
    return this.list().map((n) => gm(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function pm(e) {
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
function gm(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const i = hm(o, t);
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
function hm(e, t) {
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
      const n = Nr(t.name), r = e.names.map(Nr).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = bm(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Nr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function bm(e) {
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
const ym = "dice-so-nice";
async function Na(e) {
  if (!_m() || !Am()) return;
  const t = $m();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      d.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function _m() {
  try {
    return wc().enabled;
  } catch {
    return !1;
  }
}
function Am() {
  return game.modules?.get?.(ym)?.active === !0;
}
function $m() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Tm(e, t, n) {
  if (!xr(e.id) || !xr(e.formula))
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
    await Na(o);
    const c = {
      ...n.rollRequests[e.id] ?? xa(e, t),
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
function xa(e, t) {
  const n = e.intent ?? wm(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function wm(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function xr(e) {
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
function Rm(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: i } = e;
  if (t.operation === "damage") {
    const s = km(t, n, r, o);
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
    const s = Em(t, n, r, o);
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
function km(e, t, n, r) {
  const o = gt(e.amountFrom), i = o ? t.rolls[o] : void 0;
  return {
    id: Oa(t.id, "damage", r, t.damageInstances.length),
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
function Em(e, t, n, r) {
  const o = gt(e.amountFrom);
  return {
    id: Oa(t.id, "healing", r, t.healingInstances.length),
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
function Oa(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Cm(e, t, n) {
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
function Im(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: i } = e;
  i.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Fa("before", e), Or("before", e), Or("resolve", e);
}
function Sm(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: i } = e;
  i.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Fa("apply", e);
}
function Lm(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: i } = e;
  i.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Fa(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: i, lifecycle: s } = t, c = Dm(e, n.operation);
  c && s.emit(c, r, {
    stepIndex: o,
    step: n,
    metadata: i
  });
}
function Or(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: i, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: i
  });
}
function Dm(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function vm(e, t, n) {
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
async function Pm(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Nm(e, t);
    case "spendRitualCost":
      return xm(e, t);
  }
}
async function Nm(e, t) {
  const { context: n, resources: r } = e, o = et(t, n);
  return o.ok ? Ma(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function xm(e, t) {
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
  }), Ma(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Ma(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), b(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Om(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: i } = e, s = Fm(t);
  for (const u of s.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const c = await i();
  if (!c.ok)
    return c;
  for (const u of s.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return c;
}
function Fm(e) {
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
class Mm {
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
        return Om({
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
    const o = await Pm({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? b(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = xa(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const i = await this.runRollFormulaStep(t, n, r);
    if (!i.ok)
      return i;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: s }), b(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await Tm(t, r, n);
    return o.ok ? b(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = et(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const i = Cm(t, n, o.value);
    Im({
      step: t,
      context: n,
      stepIndex: r,
      metadata: i,
      lifecycle: this.lifecycle
    }), Sm({
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
      Rm({
        step: t,
        context: n,
        transaction: m.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Lm({
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
    const o = await vm(this.messages, t, n);
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
    const c = Bm(t, n.intent);
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
function Bm(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Um {
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
function Ba(e) {
  return {
    id: qm(),
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
function qm() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class zm {
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
    const r = Ba(n);
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
class jm {
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
class Vm {
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
      whisper: Hm(),
      flags: {
        ...t.flags,
        [l]: {
          ...Gm(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && d.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = jt();
    if (!r.enabled)
      return;
    const o = n.notification ?? Fr(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = Fr(n);
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
function Fr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Hm() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Gm(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function Wm(e, t) {
  const n = ef(e?.rounds);
  if (!n)
    return Mr(null);
  const r = e?.anchor ?? Ua(t);
  if (!r)
    return {
      ...Mr(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Km(),
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
function Ua(e) {
  const t = tf();
  if (!t?.id || !qa(t.round)) return null;
  const n = Xm(t), r = Ym(e, n) ?? Zm(t), o = j(r?.id), i = rf(r?.initiative), s = Qm(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: s,
    initiative: i,
    time: nf()
  };
}
function Km() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Mr(e) {
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
function Ym(e, t) {
  return e?.id ? t.find((n) => Jm(n) === e.id) ?? null : null;
}
function Qm(e, t, n) {
  const r = j(t?.id);
  if (r) {
    const o = n.findIndex((i) => i.id === r);
    if (o >= 0) return o;
  }
  return of(e.turn) ? e.turn : null;
}
function Zm(e) {
  return Ke(e.combatant) ? e.combatant : null;
}
function Xm(e) {
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
function Jm(e) {
  return j(e.actor?.id) ?? j(e.actorId) ?? j(e.token?.actor?.id) ?? j(e.token?.actorId) ?? j(e.document?.actor?.id) ?? j(e.document?.actorId);
}
function ef(e) {
  return qa(e) ? Math.trunc(e) : null;
}
function tf() {
  return game.combat ?? null;
}
function nf() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Ke(e) {
  return !!(e && typeof e == "object");
}
function j(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function rf(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function qa(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function of(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class af {
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
    if (!hf(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, i = Wm(t.duration, r), s = sf(o, t, i), u = t.refreshExisting ?? !0 ? bf(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(s)), b(Br(r, o, u.id ?? null, !1, !0, i));
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
      return b(Br(r, o, f, !0, !1, i));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = ja(n, r);
    let i = 0;
    try {
      for (const s of o)
        await Ur(n, s) === "deleted" && (i += 1);
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
    const n = Af(), r = [];
    let o = 0, i = 0;
    for (const s of n) {
      const c = Sn(s);
      o += c.length;
      for (const u of c) {
        if (!uf(u, t)) continue;
        const m = za(u);
        try {
          await Ur(s, u) === "deleted" && (i += 1);
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
function sf(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Lf(),
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
    duration: cf(n.duration),
    start: lf(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [l]: r
    }
  };
}
function cf(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function lf(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Sf(),
    ...e
  };
}
function Br(e, t, n, r, o, i) {
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
function uf(e, t) {
  const n = za(e);
  if (!n.conditionId || !df(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = If();
  return n.durationMode === "combatantTurn" || mf(n) ? pf(n, r) : ff(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !D(n.startRound) || !D(n.requestedRounds) || !D(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function df(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && D(e.requestedRounds);
}
function mf(e) {
  return !!(e.combatDurationApplied && D(e.requestedRounds) && D(e.startRound) && (e.startCombatantId || nt(e.startTurn)));
}
function ff(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function pf(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !D(e.startRound) || !D(e.requestedRounds) || !D(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = gf(t);
  return e.startCombatantId ? r === e.startCombatantId : nt(e.startTurn) && nt(t.turn) ? t.turn === e.startTurn : !1;
}
function gf(e) {
  return ce(e.combatant?.id);
}
function za(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ye(e, "conditionId"),
    requestedRounds: qr(e, "requestedRounds") ?? Ce(t.value) ?? Ce(t.rounds),
    combatDurationApplied: vt(e, "combatDurationApplied"),
    combatId: Ye(e, "combatId") ?? ce(n.combat) ?? ce(t.combat),
    startCombatantId: Ye(e, "startCombatantId") ?? ce(n.combatant),
    startInitiative: Rf(e, "startInitiative") ?? Va(n.initiative),
    startRound: qr(e, "startRound") ?? Ce(n.round) ?? Ce(t.startRound),
    startTurn: wf(e, "startTurn") ?? Zt(n.turn) ?? Zt(t.startTurn),
    expiryEvent: kf(e, "expiryEvent") ?? Ha(t.expiry),
    durationMode: Ef(e, "durationMode"),
    deleteOnExpire: vt(e, "deleteOnExpire"),
    expiresWithCombat: vt(e, "expiresWithCombat")
  };
}
function hf(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function bf(e, t) {
  return ja(e, t)[0] ?? null;
}
function ja(e, t) {
  return Sn(e).filter((n) => Tf(n) === t);
}
async function Ur(e, t) {
  const n = t.id ?? null, r = n ? yf(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (_f(o)) return "missing";
    throw o;
  }
}
function yf(e, t) {
  return Sn(e).find((n) => n.id === t) ?? null;
}
function _f(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Af() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      He(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    He(e, n);
  });
  for (const n of $f())
    He(e, n.actor), He(e, n.document?.actor);
  return Array.from(e.values());
}
function He(e, t) {
  if (!Cf(t)) return;
  const r = ce(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function $f() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Sn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Tf(e) {
  return Ye(e, "conditionId");
}
function Ye(e, t) {
  return ce(ne(e, t));
}
function qr(e, t) {
  return Ce(ne(e, t));
}
function wf(e, t) {
  return Zt(ne(e, t));
}
function Rf(e, t) {
  return Va(ne(e, t));
}
function kf(e, t) {
  return Ha(ne(e, t));
}
function Ef(e, t) {
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
function Va(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ha(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Cf(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function If() {
  return game.combat ?? null;
}
function Sf() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function D(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function nt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Lf() {
  return game.user?.id ?? null;
}
const Df = "icons/svg/downgrade.svg", vf = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function y(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Df,
    description: vf,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Pf = y({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Nf = y({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), xf = y({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Of = y({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Ff = y({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Mf = y({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Bf = y({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Uf = y({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), qf = y({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), zf = y({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), jf = y({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Vf = y({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Hf = y({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Gf = y({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Wf = y({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Kf = y({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Yf = y({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Qf = y({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Zf = y({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Xf = y({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Jf = y({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), ep = y({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), tp = y({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), np = y({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), rp = y({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), op = y({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), ap = y({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), ip = y({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), sp = y({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), cp = y({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), lp = y({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), up = y({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), dp = y({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), mp = y({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), fp = [
  Pf,
  Nf,
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
  mp
];
class pp {
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
    return Array.from(this.definitions.values()).map(zr);
  }
  get(t) {
    const n = this.lookup.get(jr(t)), r = n ? this.definitions.get(n) : null;
    return r ? b(zr(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = jr(t);
    r && this.lookup.set(r, n);
  }
}
function gp() {
  return new pp(fp);
}
function zr(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function jr(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const hp = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Ga = `${l}-inline-roll-neutralized`, bp = `${l}-inline-roll-notice`, Ln = `data-${l}-inline-roll-neutralized`, Vr = `data-${l}-inline-roll-notice`, yp = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Hr(e) {
  const t = vp(e.message), n = await _p(e.message), r = Ap(t);
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
async function _p(e) {
  const t = Sp(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = $p(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Lp(t, n.content), replacementCount: n.replacementCount };
}
function Ap(e) {
  const t = e ? Dp(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Wa(t);
  return n > 0 && Ka(Ep(t)), { replacementCount: n };
}
function $p(e) {
  const t = Tp(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Wa(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (Ka(n.content), { content: n.innerHTML, replacementCount: o });
}
function Tp(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, Rp(o.trim()))), replacementCount: t };
}
function Wa(e) {
  const t = wp(e);
  for (const n of t)
    n.replaceWith(kp(Cp(n)));
  return t.length;
}
function wp(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(hp))
    n.getAttribute(Ln) !== "true" && t.add(n);
  return Array.from(t);
}
function Rp(e) {
  return `<span class="${Ga}" ${Ln}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Pp(e)}</span>`;
}
function kp(e) {
  const t = document.createElement("span");
  return t.classList.add(Ga), t.setAttribute(Ln, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Ka(e) {
  if (e.querySelector?.(`[${Vr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(bp), t.setAttribute(Vr, "true"), t.textContent = yp, e.append(t);
}
function Ep(e) {
  return e.querySelector(".message-content") ?? e;
}
function Cp(e) {
  const n = e.getAttribute("data-formula") ?? Ip(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Ip(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Sp(e) {
  return e && typeof e == "object" ? e : null;
}
async function Lp(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return d.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Dp(e) {
  const t = Np(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function vp(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Pp(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Np(e) {
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
function Ya(e) {
  const t = e.getFlag(l, rt);
  return Xt(t);
}
function Qa(e) {
  return Ya(e) ?? ht();
}
async function xp(e, t) {
  const n = Xt(t) ?? Xt({
    ...ht(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(l, rt, n), n;
}
async function Op(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, l, rt));
    return;
  }
  await e.setFlag(l, rt, null);
}
function Xt(e) {
  if (!bt(e)) return null;
  const t = Hp(e.intent);
  if (!t) return null;
  const n = ht();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: ot(e.damageType),
    utilityLabel: ot(e.utilityLabel) ?? n.utilityLabel,
    note: Dn(e.note),
    forms: Gp(e.forms)
  };
}
function Fp(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Mp(e) {
  const t = Ya(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = Bp(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...Up(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: zp(e, t),
    resistance: t.intent === "damage" ? jp(e) : void 0
  };
}
function Bp(e, t) {
  const n = {
    type: "rollFormula",
    id: le,
    formula: t,
    intent: Vp(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function Up(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${le}.total`,
          ...qp(e.damageType)
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
function qp(e) {
  return e ? { damageType: e } : {};
}
function zp(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [le]: n
      }
    }
  };
  return Gr(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [le]: t.forms.discente.formula.trim()
    }
  }), Gr(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [le]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function jp(e) {
  const t = Za(e), n = ot(t.skillResis), r = ot(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = Wp(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function Vp(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Hp(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function Gp(e) {
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
function Gr(e, t) {
  const n = Za(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return Kp(r);
}
function Za(e) {
  const t = e.system;
  return bt(t) ? t : {};
}
function Wp(e) {
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
function Kp(e) {
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
const Wr = "occultism";
function Yp(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Qp(e) {
  const t = Yp(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await Zp(e, Wr);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Na(n);
  const r = eg(n);
  return {
    skill: Wr,
    skillLabel: "Ocultismo",
    roll: n,
    formula: Jp(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: tg(n)
  };
}
async function Zp(e, t) {
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
  return Xp(r);
}
function Xp(e) {
  return Kr(e) ? e : Array.isArray(e) ? e.find(Kr) ?? null : null;
}
function Kr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Jp(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function eg(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function tg(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(ng);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((i) => {
    if (!i || typeof i != "object") return [];
    const s = i.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function ng(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function rg(e) {
  switch (og(e)) {
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
      return ag(String(e ?? ""));
  }
}
function og(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function ag(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function ig(e) {
  return {
    header: {
      eyebrow: ln,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: dg(e.ritual)
    },
    forms: e.variantOptions.map((t) => sg(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: ug(e.automationStatus ?? "assisted")
  };
}
function sg(e, t) {
  const n = cg(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? lg(t) : "—",
    details: n
  };
}
function cg(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function lg(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function ug(e) {
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
function dg(e) {
  const t = e.system, n = [fg(t?.element), mg(t?.circle)].filter(hg);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function mg(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function fg(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (pg(e)) {
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
      return gg(e);
  }
}
function pg(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function gg(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function hg(e) {
  return typeof e == "string" && e.length > 0;
}
const Xa = ["base", "discente", "verdadeiro"];
function Ja(e) {
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
  return typeof e == "string" && Xa.includes(e);
}
const { ApplicationV2: bg } = foundry.applications.api;
class Ie extends bg {
  constructor(t, n) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = ig(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    _g(o, (i) => {
      this.selectedVariant = i;
    }), Ag(o, (i) => {
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
          ${this.model.forms.map(yg).join("")}
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
    const n = wg(t), r = $g(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function yg(e) {
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
function _g(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Yr(e, o, t)), o.addEventListener("keydown", (i) => {
      i.key !== "Enter" && i.key !== " " || (i.preventDefault(), Yr(e, o, t));
    });
  const r = ei(e);
  r && t(r);
}
function Yr(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !at(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), ei(e));
}
function ei(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), i = o?.checked === !0;
    r.setAttribute("aria-checked", i ? "true" : "false"), i && at(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Ag(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function $g(e, t, n) {
  const r = Tg(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function Tg(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (at(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return at(n) ? n : null;
}
function wg(e) {
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
async function Rg(e) {
  return Ie.request(e);
}
const vn = {
  label: "Padrão"
}, kg = {
  label: "Discente",
  extraCost: 2
}, Eg = {
  label: "Verdadeiro",
  extraCost: 5
};
class Cg {
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
    const r = this.resolveCostPreview(t), o = bh(n), i = ph(
      n,
      t.item,
      r,
      o
    ), s = await Rg({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((R) => R.name),
      cost: r,
      defaultSpendResource: wh(n),
      variantOptions: i,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const c = Ig(s), u = _h(
      n,
      t.item,
      c.variant,
      o
    ), m = jo();
    let f = null;
    if (m) {
      const R = await Lg(
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
        f = await Qp(
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
    const _ = Sg(
      n,
      c,
      u,
      r,
      {
        includeCostSteps: !m
      }
    );
    if (_.steps.length === 0) {
      const R = yh(
        t,
        c
      ), U = Qr(
        t.actor,
        f,
        u,
        r
      ), Vn = Zr(
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
    const T = $.value.context, g = Fg(
      n,
      t,
      T
    ), P = vg(
      n,
      t
    ), _e = Qr(
      t.actor,
      f,
      u,
      r
    ), Ae = Zr(
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
function Ig(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function Sg(e, t, n, r, o) {
  const i = [], s = t.spendResource === !0;
  for (const c of e.steps)
    c.type === "modifyResource" || c.type === "chatCard" || Nn(c) && (!o.includeCostSteps || !s) || i.push(Dg(c, n));
  return o.includeCostSteps && s && r && Rh(n.extraCost) && i.push({
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
async function Lg(e, t, n, r, o) {
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
function Dg(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Qr(e, t, n, r) {
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
function vg(e, t) {
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
      const s = Ua(i);
      n.push(
        Pg(
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
function Pg(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", i = e.label ?? Og(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: i,
    duration: Ng(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: xg(i, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${i} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Ng(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function xg(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Og(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Fg(e, t, n) {
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
      if (Mg(i)) {
        Bg(
          o,
          u,
          Ug(i, n, s.value)
        );
        continue;
      }
      r.push(zg(i, u, s.value));
    }
  }
  for (const i of o.values())
    r.push(
      ...qg(
        e,
        t.item,
        i.actor,
        i.entries
      )
    );
  return { ok: !0, actions: r };
}
function Mg(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Bg(e, t, n) {
  const r = Gg(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Ug(e, t, n) {
  const r = Wg(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function qg(e, t, n, r) {
  const o = Zg(e), i = o.length > 1 ? eh() : void 0;
  return o.map((s) => {
    const c = r.map(
      (m, f) => {
        const _ = Xg(m.amount, s);
        return {
          id: jg(m, s, f),
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
      label: Vg(u, s, o.length > 1),
      executedLabel: Hg(
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
function zg(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = Qg(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: Kg(e, r, n),
    executedLabel: Yg(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function jg(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Vg(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Hg(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Gg(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Wg(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function Kg(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Yg(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Qg(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Zg(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Xg(e, t) {
  const n = e * t.multiplier, r = Jg(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function Jg(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function eh() {
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
function Zr(e, t, n, r, o, i, s = null) {
  return [
    `Forma: ${Ja(t.variant)}`,
    oh(t, n, r),
    ...rh(s),
    ...Object.values(o.rolls).flatMap(ah),
    ...th(e, i),
    ...ih(e.resistance),
    ...mh(n)
  ];
}
function th(e, t) {
  return nh(e) ? Pn("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function nh(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function rh(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function oh(e, t, n) {
  const r = Oe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function ah(e) {
  const n = [`${fh(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = sh(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${rg(e.damageType)}`), n;
}
function ih(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function sh(e) {
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
    const s = ch(i);
    s && (dh(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function ch(e) {
  const t = lh(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : uh(e);
}
function lh(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function uh(e) {
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
function dh(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function mh(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function fh(e) {
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
function ph(e, t, n, r) {
  return Xa.map((o) => {
    const i = ti(
      e,
      t,
      o,
      r
    ), s = i !== null;
    return {
      variant: o,
      label: i?.label ?? Ja(o),
      enabled: s,
      details: i ? gh(i, n, r) : [],
      finalCostText: i ? hh(n, i) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function gh(e, t, n) {
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
function hh(e, t) {
  const n = Oe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function bh(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Nn);
}
function yh(e, t) {
  return Ba({
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
function _h(e, t, n, r) {
  return ti(e, t, n, r) ?? vn;
}
function ti(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? $h(t, n) ? Ah(n) : null : n === "base" ? vn : null);
}
function Ah(e) {
  switch (e) {
    case "base":
      return vn;
    case "discente":
      return kg;
    case "verdadeiro":
      return Eg;
  }
}
function $h(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Th(foundry.utils.getProperty(e, n));
}
function Th(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function wh(e) {
  return e.steps.some(Nn);
}
function Nn(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Rh(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function kh(e, t) {
  const n = await Eh(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: Ih(n),
    total: Sh(n),
    diceBreakdown: Lh(n)
  };
}
function ni(e) {
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
async function Eh(e, t) {
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
  return Ch(r);
}
function Ch(e) {
  return Xr(e) ? e : Array.isArray(e) ? e.find(Xr) ?? null : null;
}
function Xr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Ih(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Sh(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Lh(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Dh);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((i) => {
    if (!i || typeof i != "object") return [];
    const s = i.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Dh(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const ri = "itemUsePrompts", oi = "chatCard", yt = "data-paranormal-toolkit-prompt-id", _t = "data-paranormal-toolkit-pending-id", xn = "data-paranormal-toolkit-executed-label", Jt = "data-paranormal-toolkit-choice-group", ai = "data-paranormal-toolkit-skipped-label", Jr = "data-paranormal-toolkit-action-section", eo = "data-paranormal-toolkit-detail-key", to = "data-paranormal-toolkit-roll-card", On = "data-paranormal-toolkit-roll-detail-toggle", ii = "data-paranormal-toolkit-roll-detail-id", si = "data-paranormal-toolkit-resistance-roll-button", ci = "data-paranormal-toolkit-resistance-skill", li = "data-paranormal-toolkit-resistance-skill-label", di = "data-paranormal-toolkit-resistance-target-actor-id", mi = "data-paranormal-toolkit-resistance-target-name", fi = "data-paranormal-toolkit-resistance-roll-result", no = "data-paranormal-toolkit-system-card-replaced", vh = `[${_t}]`, Ph = `[${On}]`, Nh = `[${si}]`, en = `${l}-chat-enrichment`, h = `${l}-item-use-prompt`, xh = `${h}__actions`, ro = `${h}__details`, pi = `${h}__summary`, Oh = `${h}__title`, gi = `${h}__button--executed`, oo = `${h}__roll-card`;
let ao = !1, tn = null;
const v = /* @__PURE__ */ new Map(), Fh = [0, 100, 500, 1500, 3e3], Mh = 3e4, Bh = [0, 100, 500, 1500, 3e3];
function Uh(e) {
  if (tn = e, ao) {
    so(e);
    return;
  }
  const t = (n, r) => {
    bi(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), ao = !0, so(e);
}
async function io(e) {
  const t = hi(e);
  v.set(e.pendingId, t), await Bn(t) || Ci(t), yi(e.pendingId);
}
async function qh(e) {
  const t = hi({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", v.set(e.pendingId, t), await Bn(t) || Ci(t), yi(e.pendingId);
}
async function Nt(e, t) {
  const n = v.get(e);
  v.delete(e), n && await Ub(n, t);
}
function Fn(e) {
  const t = Pi();
  for (const n of t) {
    const r = B(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function zh(e, t) {
  const n = Fn(e);
  if (!n) return;
  const r = B(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await he(n.message, r));
}
async function jh(e, t, n) {
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
function hi(e) {
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
    summary: gb(e.context),
    executed: !1
  };
}
function bi(e, t, n) {
  Bb();
  const r = $t(t);
  if (!r) return;
  const o = Ob(e, r);
  o.length > 0 && it(r);
  for (const i of o)
    nn(r, i);
  $i(r, n), rn(r), on(r);
}
function so(e) {
  for (const t of Bh)
    globalThis.setTimeout(() => {
      Vh(e);
    }, t);
}
function Vh(e) {
  for (const t of Hh()) {
    const n = At(t);
    Gh(n) && bi(n, t, e);
  }
}
function Hh() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Gh(e) {
  return e ? Un(e) ? !0 : zb(e).length > 0 : !1;
}
function yi(e) {
  const t = v.get(e);
  if (!t) return;
  const n = t.messageId ? Fb(t.messageId) : null;
  if (n) {
    fo(n, t), it(n), nn(n, t), co(n), rn(n), on(n);
    return;
  }
  if (t.messageId) {
    cn(t);
    return;
  }
  const r = Mb(t);
  if (r) {
    fo(r, t), it(r), nn(r, t), co(r), rn(r), on(r);
    return;
  }
  cn(t);
}
function co(e) {
  tn && $i(e, tn);
}
function it(e) {
  const t = Wh();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Ai(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(no) === "true") return;
  const r = n.querySelector(`.${en}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(no, "true");
}
function Wh() {
  try {
    return js() === "replace";
  } catch {
    return !1;
  }
}
function nn(e, t) {
  if (it(e), e.querySelector(`[${yt}="${be(t.pendingId)}"]`)) return;
  const n = Kh(e, t);
  Qh(n, t), ub(n, db(t)).append(pb(t));
}
function Kh(e, t) {
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
  s.classList.add(Oh), s.textContent = Yh(t);
  const c = document.createElement("span");
  return c.classList.add(pi), c.textContent = t.summary, o.append(i, s, c), r.append(o), bb(e).append(r), r;
}
function Yh(e) {
  const t = C(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Qh(e, t) {
  const n = t.summaryLines ?? [], r = ki(n, t);
  if (r) {
    Zh(e, r, t);
    return;
  }
  mb(e, n);
}
function Zh(e, t, n) {
  if (e.querySelector(`[${to}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(oo, `${oo}--${t.intent}`), r.setAttribute(to, "true"), t.castingCheck && lo(r, Jh(t.castingCheck), n.pendingId, "casting"), Xh(t) && lo(r, eb(t), n.pendingId, "effect"), ab(r, t), ib(r, t, n), lb(r, t), e.append(r);
}
function Xh(e) {
  return e.intent !== "casting";
}
function Jh(e) {
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
function eb(e) {
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
function lo(e, t, n, r) {
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
  tb(o, t), cb(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function tb(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const i = nb(t.formula, t.diceBreakdown);
  i && n.append(i), e.append(n);
}
function nb(e, t) {
  const n = rb(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of ob(n, e)) {
    const i = document.createElement("span");
    i.classList.add(`${h}__workflow-die`), o.active || i.classList.add(`${h}__workflow-die--inactive`), i.textContent = String(o.value), r.append(i);
  }
  return r;
}
function rb(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function ob(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? uo(e, "highest") : n.includes("kl") ? uo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function uo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const i = !r && o === n;
    return i && (r = !0), { value: o, active: i };
  });
}
function ab(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(iy);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const i = document.createElement("span");
    i.classList.add(`${h}__roll-meta-pill`), i.textContent = o, r.append(i);
  }
  e.append(r);
}
function ib(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const i = document.createElement("strong");
  i.textContent = "Resistência";
  const s = sb(t, n);
  o.append(i), s && o.append(s);
  const c = document.createElement("span");
  c.classList.add(`${h}__resistance-description`), c.textContent = t.resistance, r.append(o, c), t.resistanceRollResult && r.append(_i(t.resistanceRollResult)), e.append(r);
}
function sb(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(yt, t.pendingId), n.setAttribute(si, "true"), n.setAttribute(ci, e.resistanceSkill), n.setAttribute(li, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(di, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(mi, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(fi, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function _i(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = wi(e), t;
}
function cb(e, t, n, r, o) {
  const i = t.filter((m) => m.value.trim().length > 0);
  if (i.length === 0) return;
  const s = `${n}-roll-details-${r}`, c = document.createElement("button");
  c.type = "button", c.classList.add(`${h}__roll-detail-toggle`), c.setAttribute(On, s), c.setAttribute("aria-expanded", "false"), c.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(ii, s), u.hidden = !0;
  for (const m of i) {
    const f = document.createElement("dt");
    f.textContent = m.label;
    const _ = document.createElement("dd");
    _.textContent = m.value, u.append(f, _);
  }
  e.append(c, u);
}
function lb(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function ub(e, t) {
  const n = `[${Jr}="${be(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(xh), o.setAttribute(Jr, t.id);
  const i = document.createElement("strong");
  return i.classList.add(`${h}__actions-title`), i.textContent = t.title, o.append(i), e.append(o), o;
}
function db(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = ki(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function mb(e, t) {
  if (t.length === 0) return;
  const n = fb(e);
  for (const r of t) {
    const o = sy(r);
    if (n.querySelector(`[${eo}="${be(o)}"]`)) continue;
    const i = document.createElement("li");
    i.textContent = r, i.setAttribute(eo, o), n.append(i);
  }
}
function fb(e) {
  const t = e.querySelector(`.${ro}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(ro), e.append(n), n;
}
function pb(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(yt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(gi), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(_t, e.pendingId), t.setAttribute(xn, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Jt, e.choiceGroupId), t.setAttribute(ai, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function gb(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = hb(e);
  return `${t} → ${n}`;
}
function hb(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function bb(e) {
  return Ai(e) ?? e;
}
function Ai(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function $i(e, t) {
  const n = $t(e);
  if (!n) return;
  const r = n.querySelectorAll(vh);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Db(o, t);
    }));
}
function rn(e) {
  const t = $t(e);
  if (!t) return;
  const n = t.querySelectorAll(Ph);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      yb(t, r);
    }));
}
function on(e) {
  const t = $t(e);
  if (!t) return;
  const n = t.querySelectorAll(Nh);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      _b(t, r);
    }));
}
function yb(e, t) {
  const n = t.getAttribute(On);
  if (!n) return;
  const r = e.querySelector(`[${ii}="${be(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function _b(e, t) {
  const n = t.getAttribute(yt), r = t.getAttribute(ci), o = t.getAttribute(li) ?? (r ? ni(r) : "Resistência");
  if (!n || !r) return;
  const i = Tb(e, n), s = wb(i, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await kh(s, r);
    await Ib(u.roll);
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
    Ab(t, m), $b(t, m), Sb(n, m), await Lb(e, n, m);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1;
  }
}
function Ab(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(fi, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function $b(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? _i(t);
  if (r) {
    r.textContent = wi(t);
    return;
  }
  n.append(o);
}
function Tb(e, t) {
  const n = v.get(t);
  if (n) return n;
  const r = At(e);
  return B(r)[t] ?? null;
}
function wb(e, t) {
  const n = e?.resistanceTargetActor;
  if (O(n)) return n;
  const o = e?.context?.targets.map(an).find(O) ?? null;
  if (o) return o;
  const i = t.getAttribute(di) ?? e?.resistanceTargetActorId ?? null, s = i ? kb(i) : null;
  return s || Eb(
    t.getAttribute(mi) ?? e?.resistanceTargetName ?? Rb(t)
  );
}
function Rb(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${pi}`)?.textContent ?? null;
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
function kb(e) {
  const n = game.actors?.get?.(e);
  return O(n) ? n : Ti().map((i) => ve(i)).find((i) => i?.id === e) ?? null;
}
function Eb(e) {
  const t = ue(e);
  if (!t) return null;
  const n = Ti().filter((i) => ue(Cb(i)) === t).map((i) => ve(i)).find(O) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((i) => O(i) && ue(i.name) === t);
  return O(o) ? o : null;
}
function Ti() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Cb(e) {
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
function wi(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Ib(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Sb(e, t) {
  const n = v.get(e);
  n && (n.resistanceRollResult = t);
}
async function Lb(e, t, n) {
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
async function Db(e, t) {
  const n = e.getAttribute(_t);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    Ri(e, e.getAttribute(xn) ?? "✓ Automação aplicada"), vb(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function Ri(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(gi), e.removeAttribute(_t), e.removeAttribute(xn);
}
function vb(e) {
  const t = e.getAttribute(Jt);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Jt}="${be(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const i = o.getAttribute(ai) ?? "✓ Outra opção escolhida";
    Ri(o, i);
  }
}
function ki(e, t) {
  const n = e.map(Mn).filter(oy), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = C(e, "Forma"), i = C(e, "Custo"), s = C(e, "Dados") ?? C(e, `Dados (${r.label})`), c = C(e, "Tipo"), u = C(e, "Resistência"), m = C(e, "Resistência Perícia"), f = C(e, "Resistência Rótulo") ?? (m ? ni(m) : null), _ = Ei(e, "Observação"), $ = e.filter((g) => xb(g, r)), T = Pb(e);
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
function Pb(e) {
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
    intent: Nb(n)
  } : null;
}
function Nb(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function C(e, t) {
  return Ei(e, t)[0] ?? null;
}
function Ei(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function xb(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Mn(e) ? !1 : e.trim().length > 0;
}
function Ob(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of v.values())
    sn(r, e, t) && n.set(r.pendingId, r);
  for (const r of qb(e))
    sn(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function sn(e, t, n) {
  const r = G(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !mo(n, "itemId", e.itemId) ? !1 : !e.actorId || mo(n, "actorId", e.actorId);
}
function mo(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${cy(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Fb(e) {
  const t = be(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Mb(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (sn(e, null, t))
      return t;
  return null;
}
function Bb() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of v.entries())
    e - r.createdAt > t && v.delete(n);
}
async function fo(e, t) {
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
  const t = Li(e);
  if (!t) return !1;
  try {
    const n = B(t);
    return n[e.pendingId] = qn(e, G(t)), await he(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Ci(e) {
  for (const t of Fh)
    globalThis.setTimeout(() => {
      cn(e);
    }, t);
}
async function cn(e) {
  const t = Li(e);
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
async function Ub(e, t) {
  const n = Si(e.context.message);
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
function qb(e) {
  return Object.values(B(M(e))).filter(Fe);
}
function B(e) {
  if (!e) return {};
  const t = {}, n = Un(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(Ii(e)))
    t[r] ??= o;
  return t;
}
function zb(e) {
  return Object.values(Ii(M(e))).filter(Fe);
}
function Ii(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, ri);
  if (!fe(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Fe(o) && (n[r] = o);
  return n;
}
async function he(e, t) {
  typeof e.setFlag == "function" && (await Vb(e, t), await jb(e, t));
}
async function jb(e, t) {
  await Promise.resolve(e.setFlag?.(l, ri, t));
}
function Un(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, oi);
  return ny(t) ? t : null;
}
async function Vb(e, t) {
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
      actorName: Hb(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(l, oi, o));
}
function Hb(e) {
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
function Si(e) {
  const t = M(e);
  if (t?.setFlag)
    return t;
  const n = Gb(e);
  if (n?.setFlag)
    return n;
  const r = G(e);
  if (!r) return null;
  const o = game.messages;
  return M(o?.get?.(r));
}
function Gb(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(M).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Li(e) {
  const t = Si(e.context.message);
  if (t) return t;
  const n = e.messageId ? Wb(e.messageId) : null;
  if (n) return n;
  const r = Pi().slice().reverse();
  return r.find((o) => Kb(o, e)) ?? r.find((o) => Yb(o, e)) ?? null;
}
function Wb(e) {
  const t = game.messages;
  return M(t?.get?.(e));
}
function Kb(e, t) {
  const n = G(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Di(e, t)) return !1;
  const o = vi(e);
  return !t.actorId || !o || o === t.actorId;
}
function Yb(e, t) {
  if (!Zb(e, t)) return !1;
  const n = vi(e);
  return t.actorId && n === t.actorId ? !0 : Di(e, t);
}
function Di(e, t) {
  const n = ue(Qb(e));
  if (!n) return !1;
  const r = ue(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = ue(t.itemId);
  return !!(o && n.includes(o));
}
function Qb(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function vi(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Zb(e, t) {
  const n = Xb(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Mh;
}
function Xb(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function M(e) {
  return e && typeof e == "object" ? e : null;
}
function Fe(e) {
  return fe(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && Z(e.resistanceTargetActorId) && Z(e.resistanceTargetName) && ry(e.resistanceRollResult) && Jb(e.actionPayload) && xt(e.title) && xt(e.buttonLabel) && xt(e.executedLabel) && Z(e.choiceGroupId) && Z(e.skippedLabel) && Z(e.actionSectionId) && Z(e.actionSectionTitle) && ay(e.summaryLines) : !1;
}
function Jb(e) {
  return e == null ? !0 : fe(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && ey(e.resource) && ty(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function ey(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function ty(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function ny(e) {
  return fe(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && fe(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Fe) : !1;
}
function ry(e) {
  return e == null ? !0 : fe(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function oy(e) {
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
function ay(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function iy(e) {
  return typeof e == "string" && e.length > 0;
}
function Pi() {
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
function sy(e) {
  return e.trim().toLowerCase();
}
function cy(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function be(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const po = 1e3;
class ly {
  constructor(t, n, r, o, i, s) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = i, this.debugOutput = s, this.ritualAssistant = new Cg(
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
      if (r.error.reason === "missing-automation" && by(t.item) && n.executionMode === "ask") {
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
    if (await Hr(t), !t.actor) {
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
    const r = n.prompt.actionPayload, o = Ay(r);
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
    return i.ok ? (await zh(t), await jh(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(i), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Uh(
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
    if (await Hr(t), !t.actor) {
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
      yy(t.item)
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
      return o.ok ? (hy(n, o.value), await uy(o.value), {
        ok: !0,
        executedLabel: dy(o.value)
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
        ho(i.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Bt();
    await qh({
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
      }), await io({
        pendingId: c,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Ot(s),
        skippedLabel: ho(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: _y(s)
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
    }), await io({
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
    const n = Date.now(), r = bo(t);
    for (const [i, s] of this.recentExecutionKeys.entries())
      n - s > po && this.recentExecutionKeys.delete(i);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= po;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(bo(t), Date.now());
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
async function uy(e) {
  const t = gy();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: my(e)
      });
    } catch (n) {
      d.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function dy(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function my(e) {
  const t = e.instances.map((s) => {
    const c = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Qe(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${c}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = fy(e), i = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Qe(e.conditions.join(", "))}</li>` : "";
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
function fy(e) {
  const t = py(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Qe(o)}</li>`;
}
function py(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = go(n?.value);
  return r === null ? null : {
    value: r,
    max: go(n?.max)
  };
}
function go(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function gy() {
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
function ho(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function hy(e, t) {
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
function by(e) {
  return e.type === "ritual";
}
function yy(e) {
  return Mp(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function _y(e) {
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
function Ay(e) {
  const t = e.actorUuid ? $y(e.actorUuid) : null;
  if (pe(t)) return t;
  const n = e.actorId ? Ty(e.actorId) : null;
  return n || wy(e.actorName);
}
function $y(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Ty(e) {
  const n = game.actors?.get?.(e);
  if (pe(n)) return n;
  for (const r of Ni()) {
    const o = zn(r);
    if (o?.id === e) return o;
  }
  return null;
}
function wy(e) {
  const t = Ft(e);
  if (!t) return null;
  for (const o of Ni()) {
    const i = Ry(o);
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
function Ni() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ry(e) {
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
function bo(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Bt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class ky {
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
class Ey {
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = Cy(t);
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
      reason: Iy(r, n.preset)
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
function Cy(e) {
  const t = e.getFlag(l, "automation");
  return dn(t) ? t : null;
}
function Iy(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Ge(e) {
  return (t) => t.status === e;
}
class Sy {
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
    const n = A(t.actorName), r = A(t.resource), o = A(yo(t)), i = A(Dy(t));
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
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(Ly(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), m = t.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(vy(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), _ = t.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), $ = t.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(yo(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
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
function Ly(e) {
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
function yo(e) {
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
function Dy(e) {
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
function vy(e) {
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
function Py() {
  const e = new Hd(), t = new Um(e), n = new Ud(), r = new Kd(), o = new Zd(r), i = new dm(e), s = new fm(), c = s.registerMany(
    $s()
  );
  if (!c.ok)
    throw new Error(c.error.message);
  const u = new mm(), m = new lm(), f = gp(), _ = new af(f), $ = new Ey(
    s
  ), T = new ky(
    $,
    u,
    m
  ), g = new Vm(), P = new Sy(g), _e = new jm(), Ae = new Mm(
    t,
    o,
    P,
    _e
  ), $e = new zm(Ae, _e), R = new ly(
    $e,
    t,
    o,
    n,
    _,
    g
  );
  return R.addStrategy(
    new sm(
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
const { ApplicationV2: Ny } = foundry.applications.api;
class st extends Ny {
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
      ${n.length > 0 ? xy(n) : Fy(t)}
    </section>
  `;
}
function xy(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Oy).join("")}</ol>`;
}
function Oy(e) {
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
function Fy(e) {
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
const ct = `${l}.manageRitualPresets`, _o = `__${l}_ritualPresetHeaderControlRegistered`, My = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function By(e) {
  const t = globalThis;
  if (!t[_o]) {
    for (const n of My)
      Hooks.on(n, (r, o) => {
        Uy(r, o, e);
      });
    t[_o] = !0, d.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Uy(e, t, n) {
  Array.isArray(t) && zy(e) && (qy(e, n), !t.some((r) => r.action === ct) && t.push({
    action: ct,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), xi(e, n);
    }
  }));
}
function qy(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[ct] && (e.options.actions[ct] = (n) => {
    n.preventDefault(), n.stopPropagation(), xi(e, t);
  }));
}
function zy(e) {
  if (!game.user?.isGM) return !1;
  const t = Oi(e);
  return t ? t.type === "agent" && Ne(t).length > 0 : !1;
}
function xi(e, t) {
  const n = Oi(e);
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
function Oi(e) {
  return Ao(e.actor) ? e.actor : Ao(e.document) ? e.document : null;
}
function Ao(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Fi = "data-paranormal-toolkit-ritual-roll-config", Me = "data-paranormal-toolkit-ritual-roll-field", te = "data-paranormal-toolkit-ritual-roll-action", $o = `__${l}_ritualRollConfigBlockRegistered`, jy = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], Vy = [
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
function Hy() {
  const e = globalThis;
  if (!e[$o]) {
    Gy();
    for (const t of jy)
      Hooks.on(t, (...n) => {
        Wy(n[0], n[1]);
      });
    e[$o] = !0, d.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function Gy() {
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
function Wy(e, t) {
  const n = s_(e);
  if (!n || n.type !== "ritual") return;
  const r = u_(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  Yy(o);
  const i = Bi(n), s = Qa(n), c = c_(n), u = Qy(n, s, i, c);
  n_(u, n, i, c), Ky(o, u), jn(u);
}
function Ky(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function Yy(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Fi}]`)))
    t.remove();
}
function Qy(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${l}-ritual-roll-config`), o.setAttribute(Fi, e.uuid ?? e.id ?? "ritual");
  const i = document.createElement("header");
  i.classList.add(`${l}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${l}-ritual-roll-config__title`), s.append(To("strong", "Paranormal Toolkit")), s.append(To("span", "Fórmula de rolagem"));
  const c = document.createElement("span");
  c.classList.add(`${l}-ritual-roll-config__badge`), c.textContent = qi(t) ? "Configurada" : "Rascunho", i.append(s, c), o.append(i);
  const u = document.createElement("p");
  u.classList.add(`${l}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const m = document.createElement("div");
  m.classList.add(`${l}-ritual-roll-config__fields`), m.append(Zy(t, r)), m.append(Xy(t, r)), m.append(Jy(t, r)), o.append(m), o.append(e_(t, n, r)), o.append(t_(r));
  const f = document.createElement("p");
  return f.classList.add(`${l}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function Zy(e, t) {
  const n = Tt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Me, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const i = document.createElement("option");
    i.value = o, i.textContent = Fp(o), i.selected = e.intent === o, r.append(i);
  }
  return n.append(r), n;
}
function Xy(e, t) {
  const n = Tt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Me, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const i of Vy) {
    const s = document.createElement("option");
    s.value = i.value, s.textContent = i.label, s.selected = e.damageType === i.value, r.append(s);
  }
  return n.append(r), n;
}
function Jy(e, t) {
  const n = Tt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Me, "utilityLabel"), n.append(r), n;
}
function e_(e, t, n) {
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
function t_(e) {
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
function To(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function n_(e, t, n, r) {
  ye(e, "intent")?.addEventListener("change", () => jn(e)), ko(e, "system.studentForm")?.addEventListener("change", () => wo(e, t)), ko(e, "system.trueForm")?.addEventListener("change", () => wo(e, t)), e.querySelector(`[${te}="save"]`)?.addEventListener("click", () => {
    r && r_(e, t, n);
  }), e.querySelector(`[${te}="clear"]`)?.addEventListener("click", () => {
    r && o_(e, t);
  });
}
async function r_(e, t, n) {
  const r = e.querySelector(`[${te}="save"]`);
  r?.setAttribute("disabled", "true"), de(e, "Salvando configuração...");
  try {
    const o = a_(e, n);
    await xp(t, o), Mi(e, o), de(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), de(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function o_(e, t) {
  const n = e.querySelector(`[${te}="clear"]`);
  n?.setAttribute("disabled", "true"), de(e, "Limpando configuração...");
  try {
    await Op(t);
    const r = Qa(t);
    i_(e, r), Mi(e, r), de(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), de(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Mi(e, t) {
  const n = e.querySelector(`.${l}-ritual-roll-config__badge`);
  n && (n.textContent = qi(t) ? "Configurada" : "Rascunho");
}
function a_(e, t) {
  return {
    schemaVersion: 1,
    intent: Ui(ye(e, "intent")?.value),
    damageType: Eo(e, "damageType"),
    utilityLabel: Eo(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Ze(e, "formula.base") },
      discente: { formula: Ze(e, "formula.discente") },
      verdadeiro: { formula: Ze(e, "formula.verdadeiro") }
    }
  };
}
function i_(e, t) {
  oe(e, "intent", t.intent), oe(e, "damageType", t.damageType ?? ""), oe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), oe(e, "formula.base", t.forms.base.formula), oe(e, "formula.discente", t.forms.discente.formula), oe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), jn(e);
}
function jn(e) {
  const t = Ui(ye(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function wo(e, t) {
  const n = Bi(t);
  Ro(e, "discente", n.discente), Ro(e, "verdadeiro", n.verdadeiro);
}
function Ro(e, t, n) {
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
function Bi(e) {
  const t = l_(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function s_(e) {
  return Co(e.item) ? e.item : Co(e.document) ? e.document : null;
}
function c_(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function l_(e) {
  const t = e.system;
  return d_(t) ? t : {};
}
function ko(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ye(e, t) {
  return e.querySelector(`[${Me}="${m_(t)}"]`);
}
function Ze(e, t) {
  return ye(e, t)?.value.trim() ?? "";
}
function Eo(e, t) {
  const n = Ze(e, t);
  return n.length > 0 ? n : null;
}
function oe(e, t, n) {
  const r = ye(e, t);
  r && (r.value = n);
}
function Ui(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function qi(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function u_(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Co(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function d_(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function m_(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let J = null;
Hooks.once("init", () => {
  ys(), zs(), Tc(), Td(), d.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!er.isSupportedSystem()) {
    d.warn(
      `Sistema não suportado: ${er.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  J = Py(), J.itemUseIntegration.registerStrategies(), yc(J.conditions), tc(J), mc(), cc(), Id(), By(J), Hy(), d.info("Inicializado para o sistema Ordem Paranormal."), d.info(
    `API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${ln} inicializado.`);
});
function f_() {
  if (!J)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return J;
}
export {
  f_ as getToolkitServices
};
//# sourceMappingURL=main.js.map
