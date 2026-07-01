const l = "paranormal-toolkit", sn = "Paranormal Toolkit", vi = "ordemparanormal";
class ve {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function ct(e) {
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
function y(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function cn(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : ln(t) ? y(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Ni(e) {
  return ln(e.getFlag(l, "automation"));
}
function ln(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && xi(t.source) && Oi(t.definition);
}
function Oi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(Fi) && (t.conditionApplications === void 0 || ji(t.conditionApplications));
}
function xi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function Fi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Mi(t);
    case "spendRitualCost":
      return Bi(t);
    case "rollFormula":
      return Ui(t);
    case "modifyResource":
      return qi(t);
    case "chatCard":
      return zi(t);
    default:
      return !1;
  }
}
function Mi(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ro(t);
}
function Bi(e) {
  return e.type === "spendRitualCost";
}
function Ui(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || Yi(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function qi(e) {
  const t = e;
  return t.type === "modifyResource" && wo(t.actor) && Wi(t.resource) && Ki(t.operation) && Ro(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function zi(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function ji(e) {
  return Array.isArray(e) && e.every(Hi);
}
function Hi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && wo(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || Vi(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel));
}
function Vi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Qi(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Gi(t.expiry));
}
function Gi(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Ro(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function wo(e) {
  return e === "self" || e === "target";
}
function Wi(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ki(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Yi(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Qi(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function un(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(zn);
    if (Ji(t))
      return Array.from(t).filter(zn);
  }
  return [];
}
function Zi(e) {
  return un(e)[0] ?? null;
}
function Xi(e) {
  return un(e).find(Ni) ?? null;
}
function Ji(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function zn(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ne(e) {
  return un(e).filter((t) => t.type === "ritual");
}
function ko(e) {
  return Ne(e)[0] ?? null;
}
function es(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(ct);
      return d.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Re("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Be(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Vn);
      return d.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Re("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Be(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await qt(e, r, o.value);
      d.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Re("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Be(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        d.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await qt(e, n, r.preset);
      d.info(`Melhor preset aplicado em ${n.name}.`, { match: Vn(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return jn(e);
    },
    async applyBestPresetsToActorRituals() {
      return jn(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Re("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Be(t);
      n && (await e.automationBinder.clear(n), d.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function jn(e) {
  const t = Re("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Ne(t);
  if (n.length === 0)
    return d.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Hn(t);
  const r = Hn(t, n.length);
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
    const s = await qt(e, o, a.preset);
    r.applied.push(ts(o, a, s));
  }
  return d.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), ns(r), r;
}
async function qt(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function ts(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: ct(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Hn(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function ns(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Vn(e) {
  return {
    preset: ct(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Re(e) {
  const t = ve.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Be(e) {
  const t = ko(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ee(e) {
  return e ? {
    id: e.id,
    source: {
      ...rs(e.sourceActor),
      token: e.sourceToken
    },
    item: os(e.item),
    targets: e.targets.map(as),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Gn(e.rollRequests, Co),
    rolls: Gn(e.rolls, is),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(dn),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function dn(e) {
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
function rs(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function os(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function as(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Co(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function is(e) {
  return {
    ...Co(e),
    total: e.total
  };
}
function Gn(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function ss(e) {
  return {
    getSelected() {
      return ve.getSelectedActor();
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
    cs(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    d.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  d.info(`${t} realizado:`, dn(a));
}
function W(e) {
  const t = ve.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function cs(e) {
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
function ls() {
  Ue(O.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Ue(O.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Ue(O.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Ue(O.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function zt() {
  return {
    enabled: qe(O.enabled),
    console: qe(O.console),
    ui: qe(O.ui),
    chat: qe(O.chat)
  };
}
async function q(e, t) {
  await game.settings.set(l, O[e], t);
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
function us() {
  return {
    status() {
      return zt();
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
const Eo = "ritual.costOnly", Io = "ritual.simpleHealing", ds = "ritual.eletrocussao", So = "ritual.simpleDamage", Do = "generic.simpleHealing", Lo = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function ms() {
  return [
    fs(),
    ps(),
    gs(),
    hs(),
    ys()
  ];
}
function fs() {
  return {
    id: Eo,
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
function ps() {
  return {
    id: Io,
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
    automation: Po(),
    itemPatch: _s()
  };
}
function gs() {
  return {
    id: ds,
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
    automation: bs(),
    itemPatch: As()
  };
}
function hs() {
  return {
    id: So,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: mn()
  };
}
function ys() {
  return {
    id: Do,
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
function Po(e = "2d8+2") {
  return vo(
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
function bs() {
  return {
    ...mn("3d6", {
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
function mn(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return vo(
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
function _s() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Lo,
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
function As() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Lo,
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
function vo(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function fn() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ae(t.id),
    actorId: ae(t.actor?.id),
    sceneId: ae(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function No() {
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
function Ts(e) {
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
        if (!ws(t, n)) {
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
      const r = e.automationRegistry.require(Eo);
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
      if (!Wn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Io);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Po(t)
      }), d.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = K("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = Y(n);
      if (!r) return;
      if (!Wn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(So);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: mn(t)
      }), d.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = K("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = Y(t);
      n && await $s(e, t, n);
    }
  };
}
async function $s(e, t, n) {
  const r = cn(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: No(),
    item: n,
    targets: fn()
  });
  if (!o.ok) {
    Rs(o.error);
    return;
  }
  d.info("Automação de ritual executada com sucesso.", ee(o.value.context));
}
function Rs(e) {
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
  const t = ve.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Y(e) {
  const t = ko(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ws(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Wn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const ks = ["disabled", "ask", "automatic"], Cs = ["buttons", "confirm"], Oo = "ask";
function Es(e) {
  return typeof e == "string" && ks.includes(e);
}
function Is(e) {
  return typeof e == "string" && Cs.includes(e);
}
function Ss(e) {
  return Es(e) ? e : Is(e) ? "ask" : Oo;
}
const Ds = ["keep", "replace"], Ls = ["manual", "assisted"], xo = "keep", Fo = "assisted", Ps = !0, I = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function vs() {
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
    default: Oo
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
    default: xo
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
    default: Fo
  }), game.settings.register(l, I.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Ps
  }), game.settings.register(l, I.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Kn() {
  const e = Ss(game.settings.get(l, I.executionMode)), t = Bo(game.settings.get(l, I.systemCardMode)), n = Uo(game.settings.get(l, I.damageResolutionMode));
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: Mo()
  };
}
function Ns() {
  return Bo(game.settings.get(l, I.systemCardMode));
}
function Os() {
  return Uo(game.settings.get(l, I.damageResolutionMode));
}
function Mo() {
  return game.settings.get(l, I.ritualCastingCheckEnabled) === !0;
}
async function Q(e) {
  await game.settings.set(l, I.executionMode, e);
}
function Bo(e) {
  return Ds.includes(e) ? e : xo;
}
function Uo(e) {
  return Ls.includes(e) ? e : Fo;
}
function xs(e) {
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
const Fs = [
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
function Ms(e) {
  return {
    phases() {
      return Fs;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = $t("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Xi(t);
      if (!n) {
        d.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Yn(e, t, n);
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
      if (!qs(n)) {
        d.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Us(n) ?? $t("Nenhum ator encontrado para executar automação do item.");
      r && await Yn(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = $t("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Zi(t);
      if (!n) {
        d.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Do);
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
async function Yn(e, t, n) {
  const r = cn(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: No(),
    item: n,
    targets: fn()
  });
  if (!o.ok) {
    Bs(o.error);
    return;
  }
  d.info("Automação executada com sucesso.", ee(o.value.context));
}
function Bs(e) {
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
function $t(e) {
  const t = ve.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Us(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function qs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function zs(e) {
  const t = ss(e), n = es(e), r = Ts(e), o = Ms(e), a = us(), s = xs(e);
  return {
    actor: t,
    automation: n,
    ritual: r,
    workflow: o,
    output: a,
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
function js(e) {
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
      const r = Qn();
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
      return Hs(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Qn();
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
      return Vs(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Qn() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function Hs(e) {
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
function Vs(e) {
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
function Gs(e) {
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
    conditions: js(e.conditions),
    debug: zs(e)
  }, n = globalThis;
  return n[l] = t, n.ParanormalToolkit = t, t;
}
class Zn {
  static isSupportedSystem() {
    return game.system.id === vi;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Ws() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ie(t.id),
    actorId: ie(t.actor?.id),
    sceneId: ie(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function qo() {
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
function Ks(e, t = qo()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Ys(e) {
  if (!Xs(e)) return null;
  const t = e.getFlag(l, "workflow");
  return Zs(t) ? t : null;
}
function Qs() {
  return `flags.${l}.workflow`;
}
function Xn(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${l}`), n = foundry.utils.getProperty(e, `_source.flags.${l}`);
  return t !== void 0 || n !== void 0;
}
function Jn(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return jt(t) || jt(n);
}
function Zs(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Xs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ie(e) {
  return jt(e) ? e : null;
}
function jt(e) {
  return typeof e == "string" && e.length > 0;
}
function Js() {
  const e = (t, n) => {
    ec(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function ec(e, t) {
  const n = Ys(e);
  if (!n || n.targets.length === 0) return;
  const r = nc(t);
  if (!r || r.querySelector(`.${l}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(tc(n));
}
function tc(e) {
  const t = document.createElement("section");
  t.classList.add(`${l}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(er("Origem", e.source.name)), t.append(er("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function er(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${l}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function nc(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function rc() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!oc(r) || !ac(e) || Xn(e) || Xn(t)) return;
    const o = Ws();
    if (o.length === 0 || !Jn(e) && !Jn(t)) return;
    const a = qo();
    e.updateSource({
      [Qs()]: Ks(o, a)
    }), d.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function oc(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function ac(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let tr = !1, Rt = !1, wt = !1, ze = null;
const ic = 1e3, sc = 750, cc = 1e3;
function lc(e) {
  tr || (Hooks.on("combatTurnChange", (t) => {
    dc(e, nr(t));
  }), Hooks.on("deleteCombat", (t) => {
    mc(e, nr(t));
  }), tr = !0, uc(e));
}
function uc(e) {
  lt() && (Rt || (Rt = !0, globalThis.setTimeout(() => {
    Rt = !1, pn(e, "ready");
  }, ic)));
}
function dc(e, t) {
  lt() && t && (ze && globalThis.clearTimeout(ze), ze = globalThis.setTimeout(() => {
    ze = null, pn(e, "combat-turn-change", t);
  }, sc));
}
function mc(e, t) {
  lt() && t && (wt || (wt = !0, globalThis.setTimeout(() => {
    wt = !1, pn(e, "combat-deleted", t);
  }, cc)));
}
async function pn(e, t, n) {
  if (lt())
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
function lt() {
  return game.user?.isGM === !0;
}
function nr(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const zo = {
  enabled: "dice.animations.enabled"
};
function fc() {
  game.settings.register(l, zo.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function pc() {
  return {
    enabled: game.settings.get(l, zo.enabled) === !0
  };
}
const jo = "chatCard", rr = "data-paranormal-toolkit-prompt-id", i = `${l}-item-use-prompt`, gc = `.${i}__title`, Ho = `.${i}__header`, hc = `.${i}__roll-card`, yc = `.${i}__roll-meta`, bc = `.${i}__roll-meta-pill`, gn = `.${i}__resistance`, _c = `.${i}__resistance-header`, Vo = `.${i}__resistance-description`, hn = `.${i}__resistance-roll-button`, Go = `.${i}__resistance-roll-result`, or = `${i}__resistance-content`, Wo = `.${i}__workflow-section`, Ko = `.${i}__workflow-roll`, Yo = `${i}__workflow-roll--dice-open`, Qo = `.${i}__workflow-roll-formula`, Zo = `${i}__workflow-roll-formula--toggle`, yn = `.${i}__workflow-dice-tray`, Ac = `.${i}__roll-detail-toggle`, Tc = `.${i}__roll-detail-list`, $c = `.${i}__ritual-element-badge`, Rc = `.${i}__ritual-metadata`, wc = "casting-backlash", kc = "data-paranormal-toolkit-action-section", Cc = "data-paranormal-toolkit-prompt-id", Ec = "data-paranormal-toolkit-pending-id", ar = "data-paranormal-toolkit-casting-backlash-enhanced", ir = `.${i}`, Ic = `.${i}__workflow-section--casting`, Sc = `.${i}__workflow-section-header`, Dc = `.${i}__workflow-notes`, Lc = `[${kc}="${wc}"]`, sr = `${i}__workflow-section-title-row`, Pc = `${i}__workflow-section-header--casting-backlash`, Xo = `${i}__casting-backlash-button`;
function vc(e) {
  for (const t of Nc(e))
    Oc(t), Uc(t);
}
function Nc(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(ir) && t.add(e);
  for (const n of e.querySelectorAll(ir))
    t.add(n);
  return Array.from(t);
}
function Oc(e) {
  const t = e.querySelector(Lc);
  if (!t) return;
  const n = xc(t);
  if (!n) return;
  const r = e.querySelector(`${Ic} ${Sc}`);
  r && (r.classList.add(Pc), Fc(r), Mc(n), r.append(n), t.remove());
}
function xc(e) {
  return e.querySelector(
    `button[${Ec}], button[${Cc}]`
  );
}
function Fc(e) {
  const t = e.querySelector(`:scope > .${sr}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(sr);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(Xo) || n.append(o));
  return n;
}
function Mc(e) {
  if (e.getAttribute(ar) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Bc(t, e.disabled);
  e.classList.add(Xo), e.setAttribute(ar, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Bc(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Uc(e) {
  for (const t of e.querySelectorAll(Dc)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function qc(e) {
  for (const t of Array.from(e.querySelectorAll(Wo)))
    for (const n of Array.from(t.querySelectorAll(`${Ac}, ${Tc}`)))
      n.remove();
}
const we = "data-paranormal-toolkit-prompt-id", zc = "data-paranormal-toolkit-resistance-roll-result", jc = "Conjuração DT";
function Jo(e) {
  const t = e.querySelector(hn)?.getAttribute(zc), n = Se(t);
  if (n !== null) return n;
  const r = e.querySelector(Go)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Se(o?.[1] ?? null);
}
function ea(e) {
  const t = Kc(e), n = Vc(t);
  if (n !== null) return n;
  const r = Gc(t);
  return r !== null ? r : Wc(e);
}
function Hc(e) {
  const t = e.getAttribute(we);
  if (!t) return null;
  const n = na(e), r = ra(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((c) => ut(c) ? c.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function H(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function ta(e) {
  return H(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Vc(e) {
  const t = Qc(e);
  return t.length === 0 ? null : Se(Zc(t, jc));
}
function Gc(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : cr(r, ["system", "ritual", "DT"]) ?? cr(r, ["system", "ritual", "dt"]);
}
function Wc(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Se(n?.[1] ?? null);
}
function Kc(e) {
  const t = Yc(e);
  if (!t) return null;
  const n = na(e), r = ra(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => ut(a) ? a.pendingId === t : !1) ?? null;
}
function Yc(e) {
  return (e.closest(`[${we}]`) ?? e.querySelector(`[${we}]`) ?? e.parentElement?.querySelector(`[${we}]`) ?? null)?.getAttribute(we) ?? null;
}
function na(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return Xc(o) ? o : null;
}
function ra(e) {
  const t = e?.getFlag?.(l, jo);
  return ut(t) ? t : null;
}
function Qc(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Zc(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function cr(e, t) {
  let n = e;
  for (const r of t) {
    if (!ut(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Se(typeof n == "string" ? n : null);
}
function Se(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Xc(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function ut(e) {
  return !!(e && typeof e == "object");
}
const Jc = `.${i}__actions`, bn = `.${i}__actions-title`, Xe = `.${i}__button`, el = "data-paranormal-toolkit-action-section", tl = `${i}__button--executed`, nl = "data-paranormal-toolkit-executed-label";
function oa(e) {
  return H(e.querySelector(bn)?.textContent);
}
function rl(e, t) {
  const n = e.querySelector(bn);
  n && (n.textContent = t);
}
function aa(e, t) {
  const n = H(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const o = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return H(o) === n;
  }) ?? null;
}
function _n(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Oe(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const ol = "data-paranormal-toolkit-damage-resolution-state", lr = "data-paranormal-toolkit-damage-icon-enhanced", al = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function il(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), rl(t, "Aplicar dano"), sl(e, t);
}
function sl(e, t) {
  const n = Array.from(t.querySelectorAll(Xe)), r = ur(n, "normal"), o = ur(n, "half");
  if (!r || !o) {
    t.classList.add(`${i}__actions--compact`);
    return;
  }
  dr(r, "normal"), dr(o, "half");
  const a = cl();
  if (t.classList.toggle(`${i}__actions--assisted`, a === "assisted"), t.classList.toggle(`${i}__actions--manual`, a !== "assisted"), a !== "assisted") {
    z(r, !0), z(o, !0), je(t, "manual", null);
    return;
  }
  const s = Jo(e), c = ea(e);
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
function ur(e, t) {
  const n = al[t];
  return e.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function dr(e, t) {
  if (e.getAttribute(lr) === "true") return;
  const n = e.textContent?.trim() ?? "";
  if (!n || n.startsWith("✓")) return;
  const r = document.createElement("i");
  r.classList.add(
    "fa-solid",
    t === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), r.setAttribute("aria-hidden", "true"), e.classList.add(
    `${i}__button--damage-resolution-action`,
    `${i}__button--damage-resolution-${t}`
  ), e.setAttribute(lr, "true"), e.setAttribute("aria-label", n), e.replaceChildren(r, Oe(n));
}
function z(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function je(e, t, n) {
  e.setAttribute(ol, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${i}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(bn)?.after(o);
}
function cl() {
  try {
    return Os();
  } catch {
    return "assisted";
  }
}
const De = "data-paranormal-toolkit-effect-icon-enhanced", me = "data-paranormal-toolkit-effect-action-compacted", dt = "data-paranormal-toolkit-effect-resistance-gate", An = "data-paranormal-toolkit-effect-section", Tn = "data-paranormal-toolkit-effect-label";
function ll(e) {
  return e.querySelector(`[${An}="true"]`);
}
function ul(e) {
  const t = ml(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? fl(), r = $l(n, e.sourceActions, t);
  return r && n.setAttribute(Tn, r), pl(n, t, r), Al(e.rollCard, n, e.after ?? e.fallbackAfter), Tl(e.sourceActions, n), n;
}
function dl(e, t) {
  const n = t.querySelector(Xe);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (sa(n, r)) {
    wl(n);
    return;
  }
  const o = la(t, n, r);
  if (!kl(e, o)) {
    ua(n);
    return;
  }
  const a = ea(e), s = Jo(e);
  if (a === null || s === null) {
    Cl(n);
    return;
  }
  if (s >= a) {
    El(n);
    return;
  }
  Il(n, o);
}
function ml(e) {
  return e.sourceActions?.querySelector(Xe) ?? e.existingSection?.querySelector(Xe) ?? null;
}
function fl() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(An, "true"), e;
}
function pl(e, t, n) {
  e.setAttribute(An, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = gl(e), o = hl(r);
  o.textContent = "Efeito";
  const a = yl(e, r), s = bl(a);
  s.textContent = Sl(n ?? la(e, t, t.textContent?.trim() ?? ""));
  const c = _l(a);
  t.parentElement !== c && c.append(t);
  const u = t.textContent?.trim() ?? "";
  !sa(t, u) && !Rl(t, u) && ca(t, n ?? u);
}
function gl(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function hl(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function yl(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function bl(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function _l(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function Al(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Tl(e, t) {
  !e || e === t || e.remove();
}
function $l(e, t, n) {
  const r = e.getAttribute(Tn);
  if (r && r.trim().length > 0) return r.trim();
  const o = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return o || ia(n, n.textContent?.trim() ?? "");
}
function ia(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && H(n) !== "efeito aplicado") return n;
  const r = Hc(e);
  if (r) return r;
  const o = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && H(o) !== "aplicado" ? o : null;
}
function sa(e, t) {
  return e.classList.contains(tl) || H(t).includes("aplicado");
}
function Rl(e, t) {
  const n = e.getAttribute(dt);
  if (n === "pending" || n === "resisted") return !0;
  const r = ta(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function ca(e, t) {
  e.getAttribute(me) === "true" && e.getAttribute(De) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(me, "true"), e.setAttribute(De, "true"), e.setAttribute(nl, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    _n("✦", `${i}__button-icon--effect`),
    Oe("Aplicar")
  ));
}
function wl(e) {
  e.getAttribute(me) === "true" && H(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(me, "true"), e.setAttribute(De, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    _n("✓", `${i}__button-icon--effect-applied`),
    Oe("Aplicado")
  ));
}
function la(e, t, n) {
  const r = e.getAttribute(Tn) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : ia(t, n) ?? n;
}
function kl(e, t) {
  if (!e.querySelector(gn)) return !1;
  const n = ta(t);
  return n.includes("vulneravel") || n.includes("vulnerable");
}
function Cl(e) {
  e.disabled = !0, e.removeAttribute(me), e.removeAttribute(De), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(dt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Oe("Role resistência"));
}
function El(e) {
  e.disabled = !0, e.removeAttribute(me), e.removeAttribute(De), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(dt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    _n("✓", `${i}__button-icon--effect-resisted`),
    Oe("Resistiu")
  );
}
function Il(e, t) {
  ua(e), ca(e, t);
}
function ua(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(dt);
}
function Sl(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const se = "data-paranormal-toolkit-prompt-id", Dl = "data-paranormal-toolkit-card-layout-normalized", mr = "data-paranormal-toolkit-card-layout-refresh-bound", Ll = "apply-damage", da = [0, 80, 180, 400, 900, 1600, 3e3], fr = /* @__PURE__ */ new WeakSet();
function Pl(e) {
  ma(e), vl(e);
}
function ma(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    pa(fa(t));
}
function vl(e) {
  if (!fr.has(e)) {
    fr.add(e);
    for (const t of da)
      globalThis.setTimeout(() => {
        ma(e);
      }, t);
  }
}
function fa(e) {
  return {
    rollCard: e,
    damageSection: aa(e, "Dano"),
    resistance: e.querySelector(gn),
    damageActions: Nl(e),
    effectActionSource: Ol(e),
    effectSection: ll(e)
  };
}
function pa(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: o,
    effectActionSource: a,
    effectSection: s
  } = e;
  t.setAttribute(Dl, "true"), t.classList.add(`${i}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), il(t, o));
  const c = ul({
    rollCard: t,
    existingSection: s,
    sourceActions: a,
    after: n,
    fallbackAfter: aa(t, "Conjuração")
  });
  c && dl(t, c), zl(t);
}
function Nl(e) {
  const t = xl(e);
  return t.find((n) => n.getAttribute(el) === Ll) ?? t.find((n) => oa(n) === "aplicar danos") ?? null;
}
function Ol(e) {
  const t = ga(e), n = pr(t);
  return n || pr(Fl(e));
}
function pr(e) {
  return e.find((t) => {
    const n = oa(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function xl(e) {
  const t = ga(e);
  return t.length > 0 ? t : $n(e);
}
function ga(e) {
  const t = Ul(e);
  return t ? $n(e).filter((n) => Bl(n, t)) : [];
}
function Fl(e) {
  const t = ha(e);
  if (!t) return [];
  const n = Ml(e, t);
  return $n(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => ya(e, r)).filter((r) => !n || ql(r, n));
}
function $n(e) {
  const t = ha(e);
  return t ? Array.from(t.querySelectorAll(Jc)) : [];
}
function ha(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function Ml(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && ya(e, n)) ?? null;
}
function Bl(e, t) {
  return e.getAttribute(se) === t ? !0 : Array.from(e.querySelectorAll(`[${se}]`)).some((n) => n.getAttribute(se) === t);
}
function Ul(e) {
  return e.getAttribute(se) ?? e.querySelector(`[${se}]`)?.getAttribute(se) ?? null;
}
function ya(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function ql(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function zl(e) {
  const t = e.querySelector(hn);
  t && t.getAttribute(mr) !== "true" && (t.setAttribute(mr, "true"), t.addEventListener("click", () => {
    for (const n of da)
      globalThis.setTimeout(() => {
        pa(fa(e));
      }, n);
  }));
}
const jl = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function Hl(e) {
  for (const t of Array.from(e.querySelectorAll(gn)))
    Vl(t);
  Pl(e);
}
function Vl(e) {
  const t = e.querySelector(_c), n = e.querySelector(Vo), r = e.querySelector(hn), o = e.querySelector(Go);
  if (!r || !t && !n && !o) return;
  const a = Gl(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && (o.parentElement !== e && !r.contains(o) && e.append(o), Wl(o)), r.parentElement !== e && e.append(r);
}
function Gl(e, t) {
  const n = e.querySelector(`.${or}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(or), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function Wl(e) {
  const t = Kl(e.textContent ?? "");
  t && (e.setAttribute(jl, "true"), e.replaceChildren(Zl(t)));
}
function Kl(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, a = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: c, diceValues: u } = Yl(r ?? "");
  return c ? {
    skillLabel: a,
    formula: c,
    total: Math.trunc(s),
    diceValues: u
  } : null;
}
function Yl(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Ql(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Ql(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Zl(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Xl(e);
  return r && t.append(r), t;
}
function Xl(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of Jl(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Jl(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? gr(e, "highest") : n.includes("kl") ? gr(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function gr(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function hr(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Rn() {
  const e = globalThis.game;
  return mt(e) ? e : null;
}
function D(e, t) {
  const n = eu(e, t);
  return We(n);
}
function eu(e, t) {
  return t.split(".").reduce((n, r) => mt(n) ? n[r] : null, e);
}
function tu(e, t) {
  const n = e.indexOf(":");
  return n < 0 || Le(e.slice(0, n)) !== Le(t) ? null : ge(e.slice(n + 1));
}
function We(e) {
  return typeof e == "string" ? ge(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function mt(e) {
  return !!e && typeof e == "object";
}
function nu(e) {
  return typeof e == "string";
}
function ft(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function ge(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function Le(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Ht(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function V(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function ba(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function ru(e) {
  for (const t of Array.from(e.querySelectorAll(hc))) {
    const n = uu(t);
    ou(t), n && (au(t, n), iu(t, n));
  }
}
function ou(e) {
  for (const t of Array.from(e.querySelectorAll(yc)))
    t.remove();
}
function au(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(Ho) ?? null, o = r?.querySelector(gc) ?? null, a = r ?? e, s = a.querySelector($c);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const c = s ?? document.createElement("span");
  if (c.className = Eu(t.elementTone), c.textContent = Cu(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", c);
      return;
    }
    a.prepend(c);
  }
}
function iu(e, t) {
  const n = su(e);
  cu(e, n);
  const r = lu(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${i}__ritual-metadata`);
  for (const s of r) {
    const c = document.createElement("span");
    c.classList.add(`${i}__ritual-metadata-chip`), c.textContent = s, o.append(c);
  }
  if (n) {
    const s = n.querySelector(`.${i}__summary`);
    if (s?.parentElement === n) {
      s.insertAdjacentElement("afterend", o);
      return;
    }
    n.append(o);
    return;
  }
  const a = e.querySelector(Wo);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function su(e) {
  return e.closest(`.${i}`)?.querySelector(Ho) ?? null;
}
function cu(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(Rc)))
      o.remove();
}
function lu(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Ht(e.target)}` : null,
    e.duration ? `Duração: ${Ht(e.duration)}` : null,
    e.resistance ? `Resistência: ${ba(e.resistance)}` : null
  ].filter(ft);
}
function uu(e) {
  const t = du(e), n = yu(e), o = (t ? hu(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = wn(D(o, "element")), c = F("op.elementChoices", s) ?? yr(X(a, "Elemento")) ?? yr(n.damageType), u = s ?? Iu(c), m = D(o, "circle") ?? X(a, "Círculo"), f = Au(o) ?? X(a, "Alvo"), _ = wu(o, "duration", "op.durationChoices") ?? X(a, "Duração"), T = bu(e) ?? $u(o) ?? X(a, "Resistência"), $ = _u(a) ?? n.cost, g = {
    elementLabel: c,
    elementTone: u,
    circle: m,
    cost: $,
    target: f,
    duration: _,
    resistance: T
  };
  return ku(g) ? g : null;
}
function du(e) {
  const t = mu(e);
  if (!t) return null;
  const n = t.getFlag?.(l, jo), r = pu(n);
  if (r.length === 0) return null;
  const o = fu(e);
  if (o.size > 0) {
    const a = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function mu(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Rn()?.messages?.get?.(n) ?? null : null;
}
function fu(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${rr}]`))) {
    const o = r.getAttribute(rr)?.trim();
    o && n.add(o);
  }
  return n;
}
function pu(e) {
  if (!mt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(gu).filter((n) => n !== null) : [];
}
function gu(e) {
  return mt(e) ? {
    pendingId: We(e.pendingId),
    actorId: We(e.actorId),
    itemId: We(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(nu) : []
  } : null;
}
function hu(e) {
  if (!e.itemId) return null;
  const t = Rn(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function yu(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(bc))) {
    const o = ge(r.textContent);
    if (!o) continue;
    const a = tu(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function bu(e) {
  const t = ge(e.querySelector(Vo)?.textContent);
  return t ? ba(t) : null;
}
function X(e, t) {
  const n = Le(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || Le(r.slice(0, o)) !== n))
      return ge(r.slice(o + 1));
  }
  return null;
}
function _u(e) {
  const t = X(e, "Custo") ?? X(e, "PE");
  return t || (e.map(ge).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Au(e) {
  const t = D(e, "target");
  if (!t) return null;
  if (t === "area")
    return Tu(e) ?? F("op.targetChoices", t) ?? "Área";
  const n = F("op.targetChoices", t) ?? V(t);
  return [t === "people" || t === "creatures" ? D(e, "targetQtd") : null, n].filter(ft).join(" ");
}
function Tu(e) {
  const t = D(e, "area.name"), n = D(e, "area.size"), r = D(e, "area.type"), o = t ? F("op.areaChoices", t) ?? V(t) : null, a = r ? F("op.areaTypeChoices", r) ?? V(r) : null;
  return o ? n ? a ? `${o} ${n}m ${Ht(a)}` : `${o} ${n}m` : o : null;
}
function $u(e) {
  const t = D(e, "skillResis"), n = D(e, "resistance");
  if (!t || !n) return null;
  const r = F("op.skill", t) ?? V(t), o = Ru(n);
  return [r, o].filter(ft).join(" ");
}
function Ru(e) {
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
function wu(e, t, n) {
  const r = D(e, t);
  return r ? F(n, r) ?? V(r) : null;
}
function ku(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Cu(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Eu(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(ft).join(" ");
}
function wn(e) {
  const t = Le(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function yr(e) {
  const t = wn(e);
  return t ? F("op.elementChoices", t) ?? V(t) : e ? V(e) : null;
}
function Iu(e) {
  return wn(e);
}
function F(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Rn()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const br = "data-paranormal-toolkit-dice-toggle-enhanced";
function Su(e) {
  for (const t of Array.from(e.querySelectorAll(Ko)))
    _a(t);
}
function Du(e) {
  const t = Ta(e.target);
  if (!t) return;
  const n = kn(t);
  n && (e.preventDefault(), Aa(n, t));
}
function Lu(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Ta(e.target);
  if (!t) return;
  const n = kn(t);
  n && (e.preventDefault(), Aa(n, t));
}
function _a(e) {
  const t = e.querySelector(yn);
  if (!t) return;
  const n = e.querySelector(Qo);
  if (n && n.getAttribute(br) !== "true" && (n.setAttribute(br, "true"), n.classList.add(Zo), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Aa(e, t) {
  const n = e.querySelector(yn);
  if (!n) return;
  const r = !e.classList.contains(Yo);
  Pu(e, t, n, r);
}
function Pu(e, t, n, r) {
  e.classList.toggle(Yo, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Ta(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Qo);
  if (!t) return null;
  const n = kn(t);
  return n ? (_a(n), t.classList.contains(Zo) ? t : null) : null;
}
function kn(e) {
  const t = e.closest(Ko);
  return t && t.querySelector(yn) ? t : null;
}
const _r = `${l}-workflow-dice-toggle-styles`;
function vu() {
  if (document.getElementById(_r)) return;
  const e = document.createElement("style");
  e.id = _r, e.textContent = `
.${i}__workflow-section .${i}__roll-detail-toggle,
.${i}__workflow-section .${i}__roll-detail-list {
  display: none !important;
}

.${i}__workflow-roll:not(.${i}__workflow-roll--dice-open) .${i}__workflow-dice-tray,
.${i}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${i}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${i}__workflow-roll-formula--toggle:hover,
.${i}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${i}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${i}__header .${i}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${i}__ritual-element-badge {
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

.${i}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${i}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${i}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${i}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${i}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${i}__header .${i}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${i}__roll-card > .${i}__ritual-metadata {
  display: none !important;
}

.${i}__ritual-metadata-chip {
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

.${i}__resistance {
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

.${i}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${i}__resistance-content .${i}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${i}__resistance-content .${i}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${i}__resistance-content .${i}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${i}__resistance > .${i}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: start;
}

.${i}__resistance > .${i}__resistance-roll-result,
.${i}__resistance-content .${i}__resistance-roll-result {
  grid-area: result;
  display: block;
  min-width: 0;
  width: 100%;
  margin-top: 0;
}

.${i}__resistance-workflow-roll {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 0.34rem;
}

.${i}__resistance-workflow-roll .${i}__workflow-roll-formula {
  display: inline-flex;
  width: 100%;
  max-width: 100%;
  min-height: 1.78rem;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

.${i}__resistance-workflow-roll .${i}__workflow-roll-formula i {
  margin-left: auto;
}

.${i}__resistance-workflow-roll .${i}__workflow-dice-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
  border-top: 1px solid rgba(79, 55, 42, 0.12);
  padding-top: 0.34rem;
}

.${i}__resistance-workflow-roll .${i}__workflow-die {
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

.${i}__resistance-workflow-roll .${i}__workflow-die--inactive {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(36, 27, 24, 0.46);
  opacity: 0.58;
}
.${i}__workflow-section--casting .${i}__workflow-section-header--casting-backlash {
  grid-template-columns: minmax(0, 1fr) 34px;
}

.${i}__workflow-section-title-row {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.38rem;
}

.${i}__workflow-section-title-row .${i}__workflow-section-status {
  flex: 0 0 auto;
}

.${i}__casting-backlash-button {
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

.${i}__casting-backlash-button::before {
  content: "↪";
  font-size: 1rem;
  font-weight: 950;
  line-height: 1;
}

.${i}__casting-backlash-button:hover,
.${i}__casting-backlash-button:focus {
  border-color: rgba(125, 39, 43, 0.66) !important;
  background: rgba(143, 62, 67, 0.94) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 0 0 2px rgba(125, 39, 43, 0.16) !important;
  outline: none !important;
}

.${i}__casting-backlash-button:disabled {
  cursor: default !important;
  opacity: 0.78 !important;
}

.${i}__casting-backlash-button.${i}__button--executed::before {
  content: "✓";
}

/* 0.21.2 — Resolução de dano integrada no bloco de Dano */
.${i}__workflow-section--effect .${i}__resistance {
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.48rem 0.52rem !important;
  background: rgba(255, 246, 229, 0.52) !important;
  box-shadow: none !important;
}

.${i}__workflow-section--effect .${i}__resistance-content {
  gap: 0.22rem !important;
}

.${i}__workflow-section--effect .${i}__resistance-header strong {
  display: inline !important;
  margin: 0 !important;
}

.${i}__workflow-section--effect .${i}__resistance-description {
  font-size: 0.75rem !important;
  line-height: 1.25 !important;
}

.${i}__actions--embedded {
  margin-top: 0.46rem !important;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${i}__actions--compact,
.${i}__actions--damage-resolution {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center !important;
  gap: 0.34rem !important;
}

.${i}__actions--damage-resolution .${i}__actions-title {
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

.${i}__actions--damage-resolution .${i}__actions-title::before,
.${i}__actions--damage-resolution .${i}__actions-title::after {
  content: "";
  display: block;
  border-top: 1px solid rgba(79, 55, 42, 0.16);
}

.${i}__damage-resolution-summary {
  grid-column: 1 / -1;
  margin: -0.04rem 0 0.02rem;
  color: rgba(54, 39, 31, 0.64);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.24;
  text-align: center;
}

.${i}__actions--damage-resolution .${i}__button {
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

.${i}__actions--damage-resolution .${i}__button-icon {
  flex: 0 0 auto;
  font-size: 0.78rem;
  line-height: 1;
  opacity: 0.88;
}

.${i}__actions--damage-resolution .${i}__button-label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="pending"] .${i}__button,
.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${i}__button,
.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${i}__button {
  grid-column: 1 / -1;
}

.${i}__actions--damage-resolution .${i}__button[hidden] {
  display: none !important;
}

.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${i}__damage-resolution-summary {
  color: rgba(34, 93, 55, 0.84);
}

.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${i}__damage-resolution-summary {
  color: rgba(112, 44, 44, 0.82);
}

.${i}__actions--effect-resolution {
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

.${i}__actions--effect-resolution .${i}__actions-title {
  grid-area: title;
  margin: 0 !important;
  color: rgba(107, 78, 35, 0.95) !important;
  font-size: 0.78rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.055em !important;
  line-height: 1 !important;
  text-transform: uppercase !important;
}

.${i}__effect-resolution-label {
  grid-area: label;
  min-width: 0;
  color: rgba(36, 27, 24, 0.9);
  font-size: 0.82rem;
  font-weight: 850;
  line-height: 1.22;
  overflow-wrap: anywhere;
}

.${i}__actions--effect-resolution .${i}__button {
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
.${i}__actions--effect-resolution {
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${i}__actions--effect-resolution .${i}__button {
  gap: 0.34rem !important;
  border-color: rgba(123, 72, 73, 0.42) !important;
  background: rgba(228, 214, 209, 0.74) !important;
  color: rgba(42, 30, 27, 0.94) !important;
}

.${i}__actions--effect-resolution .${i}__button:hover,
.${i}__actions--effect-resolution .${i}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${i}__button-icon--effect {
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
  transform: translateY(-0.02rem);
}

.${i}__button--effect-resolution-action .${i}__button-label {
  line-height: 1;
}

/* 0.21.5 — Efeito dentro do card principal e estado aplicado compacto */
/* 0.21.6 — Aproxima o Efeito do bloco de Dano para manter o ritmo visual do card */
/* 0.21.7 — Normaliza Efeito como seção irmã de Dano, sem margem herdada de actions */
.${i}__roll-card > .${i}__actions--effect-resolution {
  margin: 0 !important;
}

.${i}__roll-card > .${i}__workflow-section--effect + .${i}__actions--effect-resolution {
  margin-top: 0 !important;
}

.${i}__actions--effect-resolution.${i}__workflow-section {
  align-items: center !important;
}

.${i}__actions--effect-resolution .${i}__button--executed,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${i}__button-icon--effect-applied {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.8 — Efeito condicionado ao resultado da resistência */
.${i}__actions--effect-resolution .${i}__button--effect-resolution-waiting,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted {
  color: rgba(34, 93, 55, 0.84) !important;
}

.${i}__button-icon--effect-resisted {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.9 — Estados bloqueados de efeito não devem parecer clicáveis */
.${i}__actions--effect-resolution .${i}__button--effect-resolution-waiting:hover,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-waiting:focus,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:hover,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:focus,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-waiting:disabled,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:disabled {
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  cursor: default !important;
}

.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:hover,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:focus,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:disabled {
  color: rgba(34, 93, 55, 0.84) !important;
}

/* 0.22.0 — Card estruturado: remove moldura externa e mantém cards internos */
.${i}__roll-card--structured {
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${i}__roll-card--structured > .${i}__workflow-section,
.${i}__roll-card--structured > .${i}__actions--effect-resolution {
  margin-inline: 0 !important;
}

.${i}__roll-card--structured > .${i}__workflow-section + .${i}__workflow-section,
.${i}__roll-card--structured > .${i}__workflow-section + .${i}__actions--effect-resolution,
.${i}__roll-card--structured > .${i}__actions--effect-resolution + .${i}__workflow-section {
  margin-top: 0.28rem !important;
}

.${i}__roll-card--structured > .${i}__roll-meta,
.${i}__roll-card--structured > .${i}__workflow-notes {
  margin-inline: 0.08rem !important;
}

/* 0.22.2 — Unifica ritmo e tipografia do card de Efeito com Conjuração/Dano */
.${i}__roll-card--structured {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.18rem !important;
}

.${i}__roll-card--structured > .${i}__workflow-section,
.${i}__roll-card--structured > .${i}__actions--effect-resolution {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.${i}__roll-card--structured > .${i}__actions--effect-resolution {
  gap: 0.14rem 0.5rem !important;
  padding: 0.54rem 0.58rem !important;
}

.${i}__roll-card--structured > .${i}__actions--effect-resolution .${i}__actions-title {
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

.${i}__roll-card--structured > .${i}__actions--effect-resolution .${i}__effect-resolution-label {
  font-family: inherit !important;
  font-size: 0.81rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 800 !important;
  line-height: 1.18 !important;
}

.${i}__roll-card--structured > .${i}__actions--effect-resolution .${i}__button {
  align-self: center !important;
}

/* 0.22.3 — Efeito como workflow-section real, sem card legado de actions */
.${i}__roll-card--structured {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.18rem !important;
}

.${i}__roll-card--structured > .${i}__workflow-section,
.${i}__roll-card--structured > .${i}__workflow-section--effect-action {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.${i}__workflow-section--effect-action {
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

.${i}__workflow-section--effect-action > .${i}__workflow-section-header {
  grid-area: header;
  min-width: 0;
  margin: 0 !important;
}

.${i}__workflow-section--effect-action > .${i}__workflow-section-header strong {
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

.${i}__effect-section-body {
  display: contents !important;
}

.${i}__effect-section-label {
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

.${i}__effect-section-action {
  grid-area: button;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  justify-self: end !important;
  align-self: center !important;
  min-width: 0;
}

.${i}__workflow-section--effect-action .${i}__button {
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

.${i}__workflow-section--effect-action .${i}__button:hover,
.${i}__workflow-section--effect-action .${i}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${i}__workflow-section--effect-action .${i}__button--executed,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${i}__workflow-section--effect-action .${i}__button--effect-resolution-waiting,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${i}__workflow-section--effect-action .${i}__button--effect-resolution-waiting:hover,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-waiting:focus,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-waiting:disabled,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted:hover,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted:focus,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted:disabled {
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  cursor: default !important;
}

.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted:hover,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted:focus,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted:disabled {
  color: rgba(34, 93, 55, 0.84) !important;
}

`, document.head.append(e);
}
const Nu = [0, 100, 500, 1500, 3e3];
let Ar = !1, kt = null;
function Ou() {
  if (!Ar) {
    Ar = !0, vu(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ke(hr(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ke(hr(t));
    }), Hooks.once("ready", () => {
      ke(document), xu();
    }), document.addEventListener("click", Du), document.addEventListener("keydown", Lu);
    for (const e of Nu)
      globalThis.setTimeout(() => ke(document), e);
  }
}
function xu() {
  kt || !document.body || (kt = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ke(n);
  }), kt.observe(document.body, { childList: !0, subtree: !0 }));
}
function ke(e) {
  e && (qc(e), ru(e), Hl(e), Su(e), vc(e));
}
function Fu() {
  Ou();
}
const Mu = "data-paranormal-toolkit-action-section", Bu = "ritual-log", Uu = ".paranormal-toolkit-item-use-prompt__actions", qu = ".paranormal-toolkit-item-use-prompt__actions-title", zu = [0, 100, 500, 1500];
let Tr = !1;
function ju() {
  if (Tr) return;
  const e = (t, n) => {
    $r(Wu(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), $r(document), Tr = !0;
}
function $r(e) {
  for (const t of zu)
    globalThis.setTimeout(() => Hu(e), t);
}
function Hu(e) {
  Vu(e), Gu(e);
}
function Vu(e) {
  for (const t of e.querySelectorAll(
    `[${Mu}="${Bu}"]`
  ))
    t.remove();
}
function Gu(e) {
  for (const t of e.querySelectorAll(Uu)) {
    if (Rr(t.querySelector(qu)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (a) => Rr(a.textContent ?? "")
    ).some((a) => a.includes("ritual conjurado")) && t.remove();
  }
}
function Wu(e) {
  if (e instanceof HTMLElement || Ku(e))
    return e;
  if (Yu(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Ku(e) {
  return e instanceof HTMLElement;
}
function Yu(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Rr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Qu = {
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
}, Zu = new Set(
  Object.values(Qu)
), Xu = {
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
function Ju(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = ed(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Xu[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Zu.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function $a(e) {
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
function ed(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class td {
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
    const s = [], c = /* @__PURE__ */ new Set();
    let u = null;
    for (const [m, f] of t.instances.entries()) {
      const _ = nd(f, m);
      if (!_.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const T = Ju(f.damageType);
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
      if (_.amount === 0) {
        s.push(
          rd(_.id, f, T.value)
        );
        continue;
      }
      try {
        const $ = await Promise.resolve(
          a.call(n, _.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: f.ignoreResistance === !0,
            nonLethal: f.nonLethal === !0
          })
        );
        for (const v of ad($.conditions))
          c.add(v);
        const g = od($.newPV);
        g !== null && (u = g), s.push({
          id: _.id,
          label: f.label ?? $a(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: _.amount,
          finalDamage: wr($.finalDamage, _.amount),
          blocked: wr($.blocked, 0),
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
    return y({
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
function nd(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function rd(e, t, n) {
  return {
    id: e,
    label: t.label ?? $a(n),
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
function wr(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function od(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ad(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const Ce = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Ra = {
  PV: "system.attributes.hp"
}, Vt = {
  PV: [Ce.PV, Ra.PV],
  SAN: [Ce.SAN],
  PE: [Ce.PE],
  PD: [Ce.PD]
}, Gt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class id {
  getResource(t, n) {
    const r = kr(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, s = `${o}.max`, c = foundry.utils.getProperty(t, a), u = foundry.utils.getProperty(t, s), m = Er(t, n, a, c, "valor atual");
    if (m) return p(m);
    const f = Er(t, n, s, u, "valor máximo");
    return f ? p(f) : y({
      value: c,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = kr(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function kr(e, t) {
  const n = sd(e.type, t);
  if (n && Cr(e, n))
    return y(n);
  const r = Vt[t].find(
    (o) => Cr(e, o)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: cd(e, t),
    path: Vt[t].join(" | ")
  });
}
function sd(e, t) {
  return e === "threat" ? Ra[t] ?? null : e === "agent" ? Ce[t] : null;
}
function Cr(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function cd(e, t) {
  const n = e.type ?? "unknown", r = Vt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Er(e, t, n, r, o) {
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
class ld {
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
      const s = Gt.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: o } = n, a = ud(o);
    return a ? y(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Gt.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function ud(e) {
  if (Ir(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Ir(n))
      return n;
  }
  return null;
}
function Ir(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const dd = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class md {
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
    const r = n.value, o = fd(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: dd[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function fd(e, t) {
  const n = e.getFlag(l, "ritual.cost");
  return n == null ? { ok: !0, value: null } : pd(n) ? {
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
function pd(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Ct = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function gd(e) {
  if (!Td(e.item)) return null;
  const t = Wt(e.actor) ? e.actor : hd(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: bd(e.token) ?? yd(t),
    targets: fn(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function hd(e) {
  const t = e;
  return Wt(t.actor) ? t.actor : Wt(e.parent) ? e.parent : null;
}
function yd(e) {
  const t = _d(e) ?? Ad(e);
  return t ? wa(t) : null;
}
function bd(e) {
  return Kt(e) ? wa(e) : null;
}
function _d(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Kt(n) ? n : (t.getActiveTokens?.() ?? []).find(Kt) ?? null;
}
function Ad(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function wa(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Et(e.id),
    actorId: Et(t?.id),
    sceneId: Et(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Td(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Wt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Kt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Et(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class $d {
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
    const n = gd(Rd(t));
    if (!n) {
      d.warn(`${Ct.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Rd(e) {
  return e && typeof e == "object" ? e : {};
}
class wd {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return It("missing-item-patch");
    if (t.type !== "ritual") return It("unsupported-item-type");
    const o = kd(r);
    return Object.keys(o).length === 0 ? It("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function kd(e) {
  const t = {};
  k(t, "name", e.name), k(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (k(t, "system.circle", n.circle), k(t, "system.element", n.element), k(t, "system.target", n.target), k(t, "system.targetQtd", n.targetQuantity), k(t, "system.execution", n.execution), k(t, "system.range", n.range), k(t, "system.duration", n.duration), k(t, "system.skillResis", n.resistanceSkill), k(t, "system.resistance", n.resistance), k(t, "system.studentForm", n.studentForm), k(t, "system.trueForm", n.trueForm)), t;
}
function k(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function It(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Cd {
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
    return this.getNumber(t, Gt.ritual.dt, 0);
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
class Ed {
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
class Id {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Sd(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, St(t)), y(t)) : n;
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
    return n ? St(n) : null;
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
    return Array.from(this.presets.values()).map(St);
  }
  findForItem(t) {
    return this.list().map((n) => Dd(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Sd(e) {
  return !Dt(e.id) || !Dt(e.version) || !Dt(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function Dd(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = Ld(o, t);
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
function Ld(e, t) {
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
      const n = Sr(t.name), r = e.names.map(Sr).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Pd(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Sr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Pd(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function St(e) {
  return structuredClone(e);
}
function Dt(e) {
  return typeof e == "string" && e.length > 0;
}
function Je(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = pt(e.amountFrom);
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
function pt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const vd = "dice-so-nice";
async function ka(e) {
  if (!Nd() || !Od()) return;
  const t = xd();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      d.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Nd() {
  try {
    return pc().enabled;
  } catch {
    return !1;
  }
}
function Od() {
  return game.modules?.get?.(vd)?.active === !0;
}
function xd() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Fd(e, t, n) {
  if (!Dr(e.id) || !Dr(e.formula))
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
    await ka(o);
    const c = {
      ...n.rollRequests[e.id] ?? Ca(e, t),
      total: a,
      roll: o
    };
    return n.rolls[e.id] = c, y(c);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function Ca(e, t) {
  const n = e.intent ?? Md(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function Md(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Dr(e) {
  return typeof e == "string" && e.length > 0;
}
async function et(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? He(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? He(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? He(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? He(t, n, r, o) : e.recover(t, n, o);
  }
}
function He(e, t, n, r) {
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
function Bd(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = Ud(t, n, r, o);
    n.damageInstances.push(s), a.emit("afterDamageResolution", n, {
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
    }), a.emit("afterApplyDamage", n, {
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
    const s = qd(t, n, r, o);
    n.healingInstances.push(s), a.emit("afterApplyHealing", n, {
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
function Ud(e, t, n, r) {
  const o = pt(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: Ea(t.id, "damage", r, t.damageInstances.length),
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
function qd(e, t, n, r) {
  const o = pt(e.amountFrom);
  return {
    id: Ea(t.id, "healing", r, t.healingInstances.length),
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
function Ea(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function zd(e, t, n) {
  const r = pt(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function jd(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Ia("before", e), Lr("before", e), Lr("resolve", e);
}
function Hd(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Ia("apply", e);
}
function Vd(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Ia(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = t, c = Gd(e, n.operation);
  c && s.emit(c, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Lr(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Gd(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Wd(e, t, n) {
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
async function Kd(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Yd(e, t);
    case "spendRitualCost":
      return Qd(e, t);
  }
}
async function Yd(e, t) {
  const { context: n, resources: r } = e, o = Je(t, n);
  return o.ok ? Sa(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function Qd(e, t) {
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
  const s = a.value;
  return n.ritualCosts.push({
    ...s,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), Sa(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Sa(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Zd(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, s = Xd(t);
  for (const u of s.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const c = await a();
  if (!c.ok)
    return c;
  for (const u of s.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return c;
}
function Xd(e) {
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
class Jd {
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
        return Zd({
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
    const o = await Kd({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = Ca(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await Fd(t, r, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = Je(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = zd(t, n, o.value);
    jd({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), Hd({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
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
      const u = await et(this.resources, c, t.resource, t.operation, o.value), m = this.handleResourceOperationResult(u, n, r, t);
      if (!m.ok)
        return m;
      Bd({
        step: t,
        context: n,
        transaction: m.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Vd({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = Je(t, n);
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
    for (const s of a) {
      const c = await et(this.resources, s, t.resource, t.operation, o.value), u = this.handleResourceOperationResult(c, n, r, t);
      if (!u.ok)
        return u;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await Wd(this.messages, t, n);
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
  emitSpecificRollPhase(t, n, r, o, a, s) {
    const c = em(t, n.intent);
    c && this.lifecycle.emit(c, r, {
      stepIndex: o,
      step: a,
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
function em(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class tm {
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
    const s = a.value, c = this.calculate(r, s, o);
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
    return y({
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
function Da(e) {
  return {
    id: nm(),
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
function nm() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class rm {
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
    const r = Da(n);
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
class om {
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
class am {
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
    const n = zt();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: im(),
      flags: {
        ...t.flags,
        [l]: {
          ...sm(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && d.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = zt();
    if (!r.enabled)
      return;
    const o = n.notification ?? Pr(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = Pr(n);
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
function Pr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function im() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function sm(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function cm(e, t) {
  const n = gm(e?.rounds);
  if (!n)
    return vr(null);
  const r = e?.anchor ?? La(t);
  if (!r)
    return {
      ...vr(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: lm(),
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
function La(e) {
  const t = hm();
  if (!t?.id || !Pa(t.round)) return null;
  const n = fm(t), r = um(e, n) ?? mm(t), o = j(r?.id), a = bm(r?.initiative), s = dm(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: s,
    initiative: a,
    time: ym()
  };
}
function lm() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function vr(e) {
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
function um(e, t) {
  return e?.id ? t.find((n) => pm(n) === e.id) ?? null : null;
}
function dm(e, t, n) {
  const r = j(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return _m(e.turn) ? e.turn : null;
}
function mm(e) {
  return Ke(e.combatant) ? e.combatant : null;
}
function fm(e) {
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
function pm(e) {
  return j(e.actor?.id) ?? j(e.actorId) ?? j(e.token?.actor?.id) ?? j(e.token?.actorId) ?? j(e.document?.actor?.id) ?? j(e.document?.actorId);
}
function gm(e) {
  return Pa(e) ? Math.trunc(e) : null;
}
function hm() {
  return game.combat ?? null;
}
function ym() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Ke(e) {
  return !!(e && typeof e == "object");
}
function j(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function bm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Pa(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function _m(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class Am {
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
    if (!Dm(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = cm(t.duration, r), s = Tm(o, t, a), u = t.refreshExisting ?? !0 ? Lm(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(s)), y(Nr(r, o, u.id ?? null, !1, !0, a));
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
      return y(Nr(r, o, f, !0, !1, a));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = Na(n, r);
    let a = 0;
    try {
      for (const s of o)
        await Or(n, s) === "deleted" && (a += 1);
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
    const n = Nm(), r = [];
    let o = 0, a = 0;
    for (const s of n) {
      const c = Cn(s);
      o += c.length;
      for (const u of c) {
        if (!wm(u, t)) continue;
        const m = va(u);
        try {
          await Or(s, u) === "deleted" && (a += 1);
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
      removedEffects: a,
      failures: r
    };
  }
}
function Tm(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Hm(),
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
    duration: $m(n.duration),
    start: Rm(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [l]: r
    }
  };
}
function $m(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Rm(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: jm(),
    ...e
  };
}
function Nr(e, t, n, r, o, a) {
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
function wm(e, t) {
  const n = va(e);
  if (!n.conditionId || !km(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = zm();
  return n.durationMode === "combatantTurn" || Cm(n) ? Im(n, r) : Em(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !L(n.startRound) || !L(n.requestedRounds) || !L(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function km(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && L(e.requestedRounds);
}
function Cm(e) {
  return !!(e.combatDurationApplied && L(e.requestedRounds) && L(e.startRound) && (e.startCombatantId || tt(e.startTurn)));
}
function Em(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Im(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !L(e.startRound) || !L(e.requestedRounds) || !L(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Sm(t);
  return e.startCombatantId ? r === e.startCombatantId : tt(e.startTurn) && tt(t.turn) ? t.turn === e.startTurn : !1;
}
function Sm(e) {
  return ce(e.combatant?.id);
}
function va(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ye(e, "conditionId"),
    requestedRounds: xr(e, "requestedRounds") ?? Ee(t.value) ?? Ee(t.rounds),
    combatDurationApplied: Lt(e, "combatDurationApplied"),
    combatId: Ye(e, "combatId") ?? ce(n.combat) ?? ce(t.combat),
    startCombatantId: Ye(e, "startCombatantId") ?? ce(n.combatant),
    startInitiative: Mm(e, "startInitiative") ?? Oa(n.initiative),
    startRound: xr(e, "startRound") ?? Ee(n.round) ?? Ee(t.startRound),
    startTurn: Fm(e, "startTurn") ?? Yt(n.turn) ?? Yt(t.startTurn),
    expiryEvent: Bm(e, "expiryEvent") ?? xa(t.expiry),
    durationMode: Um(e, "durationMode"),
    deleteOnExpire: Lt(e, "deleteOnExpire"),
    expiresWithCombat: Lt(e, "expiresWithCombat")
  };
}
function Dm(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Lm(e, t) {
  return Na(e, t)[0] ?? null;
}
function Na(e, t) {
  return Cn(e).filter((n) => xm(n) === t);
}
async function Or(e, t) {
  const n = t.id ?? null, r = n ? Pm(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (vm(o)) return "missing";
    throw o;
  }
}
function Pm(e, t) {
  return Cn(e).find((n) => n.id === t) ?? null;
}
function vm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Nm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Ve(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Ve(e, n);
  });
  for (const n of Om())
    Ve(e, n.actor), Ve(e, n.document?.actor);
  return Array.from(e.values());
}
function Ve(e, t) {
  if (!qm(t)) return;
  const r = ce(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Om() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Cn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function xm(e) {
  return Ye(e, "conditionId");
}
function Ye(e, t) {
  return ce(ne(e, t));
}
function xr(e, t) {
  return Ee(ne(e, t));
}
function Fm(e, t) {
  return Yt(ne(e, t));
}
function Mm(e, t) {
  return Oa(ne(e, t));
}
function Bm(e, t) {
  return xa(ne(e, t));
}
function Um(e, t) {
  const n = ne(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Lt(e, t) {
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
function Ee(e) {
  return L(e) ? Math.trunc(e) : null;
}
function Yt(e) {
  return tt(e) ? Math.trunc(e) : null;
}
function Oa(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function xa(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function qm(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function zm() {
  return game.combat ?? null;
}
function jm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function L(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function tt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Hm() {
  return game.user?.id ?? null;
}
const Vm = "icons/svg/downgrade.svg", Gm = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Vm,
    description: Gm,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Wm = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Km = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Ym = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Qm = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Zm = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Xm = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Jm = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), ef = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), tf = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), nf = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), rf = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), of = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), af = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), sf = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), cf = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), lf = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), uf = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), df = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), mf = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), ff = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), pf = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), gf = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), hf = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), yf = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), bf = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), _f = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Af = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Tf = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), $f = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Rf = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), wf = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), kf = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Cf = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Ef = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), If = [
  Wm,
  Km,
  Ym,
  Qm,
  Zm,
  Xm,
  Jm,
  ef,
  tf,
  nf,
  rf,
  of,
  af,
  sf,
  cf,
  lf,
  uf,
  df,
  mf,
  ff,
  pf,
  gf,
  hf,
  yf,
  bf,
  _f,
  Af,
  Tf,
  $f,
  Rf,
  wf,
  kf,
  Cf,
  Ef
];
class Sf {
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
    return Array.from(this.definitions.values()).map(Fr);
  }
  get(t) {
    const n = this.lookup.get(Mr(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(Fr(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Mr(t);
    r && this.lookup.set(r, n);
  }
}
function Df() {
  return new Sf(If);
}
function Fr(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Mr(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const Lf = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Fa = `${l}-inline-roll-neutralized`, Pf = `${l}-inline-roll-notice`, En = `data-${l}-inline-roll-neutralized`, Br = `data-${l}-inline-roll-notice`, vf = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Ur(e) {
  const t = Wf(e.message), n = await Nf(e.message), r = Of(t);
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
async function Nf(e) {
  const t = Hf(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = xf(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Vf(t, n.content), replacementCount: n.replacementCount };
}
function Of(e) {
  const t = e ? Gf(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Ma(t);
  return n > 0 && Ba(qf(t)), { replacementCount: n };
}
function xf(e) {
  const t = Ff(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Ma(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (Ba(n.content), { content: n.innerHTML, replacementCount: o });
}
function Ff(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, Bf(o.trim()))), replacementCount: t };
}
function Ma(e) {
  const t = Mf(e);
  for (const n of t)
    n.replaceWith(Uf(zf(n)));
  return t.length;
}
function Mf(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(Lf))
    n.getAttribute(En) !== "true" && t.add(n);
  return Array.from(t);
}
function Bf(e) {
  return `<span class="${Fa}" ${En}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Kf(e)}</span>`;
}
function Uf(e) {
  const t = document.createElement("span");
  return t.classList.add(Fa), t.setAttribute(En, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Ba(e) {
  if (e.querySelector?.(`[${Br}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Pf), t.setAttribute(Br, "true"), t.textContent = vf, e.append(t);
}
function qf(e) {
  return e.querySelector(".message-content") ?? e;
}
function zf(e) {
  const n = e.getAttribute("data-formula") ?? jf(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function jf(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Hf(e) {
  return e && typeof e == "object" ? e : null;
}
async function Vf(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return d.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Gf(e) {
  const t = Yf(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Wf(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Kf(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Yf(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const nt = "ritualRollConfig", le = "ritual-roll";
function gt() {
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
function Ua(e) {
  const t = e.getFlag(l, nt);
  return Qt(t);
}
function qa(e) {
  return Ua(e) ?? gt();
}
async function Qf(e, t) {
  const n = Qt(t) ?? Qt({
    ...gt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(l, nt, n), n;
}
async function Zf(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, l, nt));
    return;
  }
  await e.setFlag(l, nt, null);
}
function Qt(e) {
  if (!ht(e)) return null;
  const t = ip(e.intent);
  if (!t) return null;
  const n = gt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: rt(e.damageType),
    utilityLabel: rt(e.utilityLabel) ?? n.utilityLabel,
    note: In(e.note),
    forms: sp(e.forms)
  };
}
function Xf(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Jf(e) {
  const t = Ua(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = ep(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...tp(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: rp(e, t),
    resistance: t.intent === "damage" ? op(e) : void 0
  };
}
function ep(e, t) {
  const n = {
    type: "rollFormula",
    id: le,
    formula: t,
    intent: ap(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function tp(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${le}.total`,
          ...np(e.damageType)
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
function np(e) {
  return e ? { damageType: e } : {};
}
function rp(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [le]: n
      }
    }
  };
  return qr(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [le]: t.forms.discente.formula.trim()
    }
  }), qr(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [le]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function op(e) {
  const t = za(e), n = rt(t.skillResis), r = rt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = cp(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function ap(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function ip(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function sp(e) {
  const t = gt();
  return ht(e) ? {
    base: Pt(e.base),
    discente: Pt(e.discente),
    verdadeiro: Pt(e.verdadeiro)
  } : t.forms;
}
function Pt(e) {
  return ht(e) ? { formula: In(e.formula) } : { formula: "" };
}
function qr(e, t) {
  const n = za(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return lp(r);
}
function za(e) {
  const t = e.system;
  return ht(t) ? t : {};
}
function cp(e) {
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
function lp(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function In(e) {
  return typeof e == "string" ? e.trim() : "";
}
function rt(e) {
  const t = In(e);
  return t.length > 0 ? t : null;
}
function ht(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const zr = "occultism";
function up(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function dp(e) {
  const t = up(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await mp(e, zr);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await ka(n);
  const r = gp(n);
  return {
    skill: zr,
    skillLabel: "Ocultismo",
    roll: n,
    formula: pp(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: hp(n)
  };
}
async function mp(e, t) {
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
  return fp(r);
}
function fp(e) {
  return jr(e) ? e : Array.isArray(e) ? e.find(jr) ?? null : null;
}
function jr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function pp(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function gp(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function hp(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(yp);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function yp(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function bp(e) {
  switch (_p(e)) {
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
      return Ap(String(e ?? ""));
  }
}
function _p(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function Ap(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function Tp(e) {
  return {
    header: {
      eyebrow: sn,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Cp(e.ritual)
    },
    forms: e.variantOptions.map((t) => $p(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: kp(e.automationStatus ?? "assisted")
  };
}
function $p(e, t) {
  const n = Rp(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? wp(t) : "—",
    details: n
  };
}
function Rp(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function wp(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function kp(e) {
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
function Cp(e) {
  const t = e.system, n = [Ip(t?.element), Ep(t?.circle)].filter(Lp);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function Ep(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Ip(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (Sp(e)) {
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
      return Dp(e);
  }
}
function Sp(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function Dp(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function Lp(e) {
  return typeof e == "string" && e.length > 0;
}
const ja = ["base", "discente", "verdadeiro"];
function Ha(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function ot(e) {
  return typeof e == "string" && ja.includes(e);
}
const { ApplicationV2: Pp } = foundry.applications.api;
class Ie extends Pp {
  constructor(t, n) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = Tp(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    Np(o, (a) => {
      this.selectedVariant = a;
    }), Op(o, (a) => {
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
          ${this.model.forms.map(vp).join("")}
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
    const n = Mp(t), r = xp(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function vp(e) {
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
function Np(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Hr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Hr(e, o, t));
    });
  const r = Va(e);
  r && t(r);
}
function Hr(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !ot(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Va(e));
}
function Va(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && ot(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Op(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function xp(e, t, n) {
  const r = Fp(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function Fp(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (ot(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return ot(n) ? n : null;
}
function Mp(e) {
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
async function Bp(e) {
  return Ie.request(e);
}
const Sn = {
  label: "Padrão"
}, Up = {
  label: "Discente",
  extraCost: 2
}, qp = {
  label: "Verdadeiro",
  extraCost: 5
};
class zp {
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
    const r = this.resolveCostPreview(t), o = Pg(n), a = Sg(
      n,
      t.item,
      r,
      o
    ), s = await Bp({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((w) => w.name),
      cost: r,
      defaultSpendResource: Mg(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const c = jp(s), u = Ng(
      n,
      t.item,
      c.variant,
      o
    ), m = Mo();
    let f = null;
    if (m) {
      const w = await Vp(
        this.resources,
        t.actor,
        c,
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
        f = await dp(
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
    const _ = Hp(
      n,
      c,
      u,
      r,
      {
        includeCostSteps: !m
      }
    );
    if (_.steps.length === 0) {
      const w = vg(
        t,
        c
      ), U = Vr(
        t.actor,
        f,
        u,
        r
      ), qn = Gr(
        n,
        c,
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
        summaryLines: qn
      } : {
        status: "completed-without-actions",
        workflowContext: w,
        summaryLines: qn
      };
    }
    const T = await this.workflow.runAutomation(_, {
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
    if (!T.ok)
      return {
        status: "failed",
        reason: T.error.reason,
        message: T.error.message,
        cause: T.error
      };
    const $ = T.value.context, g = Xp(
      n,
      t,
      $
    ), v = Wp(
      n,
      t
    ), _e = Vr(
      t.actor,
      f,
      u,
      r
    ), Ae = Gr(
      n,
      c,
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
    if (!v.ok)
      return {
        status: "failed",
        reason: v.reason,
        message: v.message
      };
    const Te = [
      ..._e,
      ...g.actions,
      ...v.actions
    ];
    return Te.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: $,
      summaryLines: Ae
    } : {
      status: "ready",
      workflowContext: $,
      actions: Te,
      summaryLines: Ae
    };
  }
  async applyAction(t) {
    return et(
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
function jp(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function Hp(e, t, n, r, o) {
  const a = [], s = t.spendResource === !0;
  for (const c of e.steps)
    c.type === "modifyResource" || c.type === "chatCard" || Ln(c) && (!o.includeCostSteps || !s) || a.push(Gp(c, n));
  return o.includeCostSteps && s && r && Bg(n.extraCost) && a.push({
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
async function Vp(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = xe(o, r);
  if (!a)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (a.amount <= 0) return { ok: !0 };
  const s = await e.spend(
    t,
    a.resource,
    a.amount
  );
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function Gp(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Vr(e, t, n, r) {
  if (!t || t.success) return [];
  const o = xe(r, n);
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
function Wp(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = Dn(r.actor, t);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const a of o) {
      const s = La(a);
      n.push(
        Kp(
          r,
          a,
          t.item,
          s
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function Kp(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? Zp(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: Yp(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Qp(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Yp(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Qp(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Zp(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Xp(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const s = Je(a, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const c = Dn(a.actor, t);
    if (c.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of c) {
      if (Jp(a)) {
        eg(
          o,
          u,
          tg(a, n, s.value)
        );
        continue;
      }
      r.push(rg(a, u, s.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...ng(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function Jp(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function eg(e, t, n) {
  const r = sg(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function tg(e, t, n) {
  const r = cg(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function ng(e, t, n, r) {
  const o = mg(e), a = o.length > 1 ? gg() : void 0;
  return o.map((s) => {
    const c = r.map(
      (m, f) => {
        const _ = fg(m.amount, s);
        return {
          id: og(m, s, f),
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
      label: ag(u, s, o.length > 1),
      executedLabel: ig(
        n.name ?? "Ator sem nome",
        s,
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
function rg(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = dg(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: lg(e, r, n),
    executedLabel: ug(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function og(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function ag(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function ig(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function sg(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function cg(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function lg(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function ug(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function dg(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function mg(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function fg(e, t) {
  const n = e * t.multiplier, r = pg(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function pg(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function gg() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Dn(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Gr(e, t, n, r, o, a, s = null) {
  return [
    `Forma: ${Ha(t.variant)}`,
    _g(t, n, r),
    ...bg(s),
    ...Object.values(o.rolls).flatMap(Ag),
    ...hg(e, a),
    ...Tg(e.resistance),
    ...Eg(n)
  ];
}
function hg(e, t) {
  return yg(e) ? Dn("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function yg(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function bg(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function _g(e, t, n) {
  const r = xe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Ag(e) {
  const n = [`${Ig(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = $g(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${bp(e.damageType)}`), n;
}
function Tg(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function $g(e) {
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
    const s = Rg(a);
    s && (Cg(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Rg(e) {
  const t = wg(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : kg(e);
}
function wg(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function kg(e) {
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
function Cg(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function Eg(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Ig(e) {
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
function Sg(e, t, n, r) {
  return ja.map((o) => {
    const a = Ga(
      e,
      t,
      o,
      r
    ), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? Ha(o),
      enabled: s,
      details: a ? Dg(a, n, r) : [],
      finalCostText: a ? Lg(n, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function Dg(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = xe(t, e);
  return r.push(
    a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"
  ), r;
}
function xe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function Lg(e, t) {
  const n = xe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function Pg(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Ln);
}
function vg(e, t) {
  return Da({
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
function Ng(e, t, n, r) {
  return Ga(e, t, n, r) ?? Sn;
}
function Ga(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? xg(t, n) ? Og(n) : null : n === "base" ? Sn : null);
}
function Og(e) {
  switch (e) {
    case "base":
      return Sn;
    case "discente":
      return Up;
    case "verdadeiro":
      return qp;
  }
}
function xg(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Fg(foundry.utils.getProperty(e, n));
}
function Fg(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Mg(e) {
  return e.steps.some(Ln);
}
function Ln(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Bg(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Ug(e, t) {
  const n = await qg(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: jg(n),
    total: Hg(n),
    diceBreakdown: Vg(n)
  };
}
function Wa(e) {
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
async function qg(e, t) {
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
  return zg(r);
}
function zg(e) {
  return Wr(e) ? e : Array.isArray(e) ? e.find(Wr) ?? null : null;
}
function Wr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function jg(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Hg(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Vg(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Gg);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Gg(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Ka = "itemUsePrompts", Ya = "chatCard", yt = "data-paranormal-toolkit-prompt-id", bt = "data-paranormal-toolkit-pending-id", Pn = "data-paranormal-toolkit-executed-label", Zt = "data-paranormal-toolkit-choice-group", Qa = "data-paranormal-toolkit-skipped-label", Kr = "data-paranormal-toolkit-action-section", Yr = "data-paranormal-toolkit-detail-key", Qr = "data-paranormal-toolkit-roll-card", vn = "data-paranormal-toolkit-roll-detail-toggle", Za = "data-paranormal-toolkit-roll-detail-id", Xa = "data-paranormal-toolkit-resistance-roll-button", Ja = "data-paranormal-toolkit-resistance-skill", ei = "data-paranormal-toolkit-resistance-skill-label", ti = "data-paranormal-toolkit-resistance-target-actor-id", ni = "data-paranormal-toolkit-resistance-target-name", ri = "data-paranormal-toolkit-resistance-roll-result", Zr = "data-paranormal-toolkit-system-card-replaced", Wg = `[${bt}]`, Kg = `[${vn}]`, Yg = `[${Xa}]`, Xt = `${l}-chat-enrichment`, h = `${l}-item-use-prompt`, Qg = `${h}__actions`, Xr = `${h}__details`, oi = `${h}__summary`, Zg = `${h}__title`, ai = `${h}__button--executed`, Jr = `${h}__roll-card`;
let eo = !1, Jt = null;
const P = /* @__PURE__ */ new Map(), Xg = [0, 100, 500, 1500, 3e3], Jg = 3e4, eh = [0, 100, 500, 1500, 3e3];
function th(e) {
  if (Jt = e, eo) {
    no(e);
    return;
  }
  const t = (n, r) => {
    si(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), eo = !0, no(e);
}
async function to(e) {
  const t = ii(e);
  P.set(e.pendingId, t), await xn(t) || bi(t), ci(e.pendingId);
}
async function nh(e) {
  const t = ii({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await xn(t) || bi(t), ci(e.pendingId);
}
async function vt(e, t) {
  const n = P.get(e);
  P.delete(e), n && await ty(n, t);
}
function Nn(e) {
  const t = wi();
  for (const n of t) {
    const r = B(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function rh(e, t) {
  const n = Nn(e);
  if (!n) return;
  const r = B(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await he(n.message, r));
}
async function oh(e, t, n) {
  if (!t) return;
  const r = Nn(e);
  if (!r) return;
  const o = B(r.message);
  let a = !1;
  for (const [s, c] of Object.entries(o))
    s !== e && c.choiceGroupId === t && (o[s] = {
      ...c,
      executedLabel: n ?? c.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await he(r.message, o);
}
function ii(e) {
  const t = G(e.context.message), n = e.context.targets.find((s) => rn(s)), r = n ? rn(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Dh(e.context),
    executed: !1
  };
}
function si(e, t, n) {
  ey();
  const r = At(t);
  if (!r) return;
  const o = Zh(e, r);
  o.length > 0 && at(r);
  for (const a of o)
    en(r, a);
  mi(r, n), tn(r), nn(r);
}
function no(e) {
  for (const t of eh)
    globalThis.setTimeout(() => {
      ah(e);
    }, t);
}
function ah(e) {
  for (const t of ih()) {
    const n = _t(t);
    sh(n) && si(n, t, e);
  }
}
function ih() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function sh(e) {
  return e ? Fn(e) ? !0 : ry(e).length > 0 : !1;
}
function ci(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? Xh(t.messageId) : null;
  if (n) {
    so(n, t), at(n), en(n, t), ro(n), tn(n), nn(n);
    return;
  }
  if (t.messageId) {
    an(t);
    return;
  }
  const r = Jh(t);
  if (r) {
    so(r, t), at(r), en(r, t), ro(r), tn(r), nn(r);
    return;
  }
  an(t);
}
function ro(e) {
  Jt && mi(e, Jt);
}
function at(e) {
  const t = ch();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = di(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Zr) === "true") return;
  const r = n.querySelector(`.${Xt}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Zr, "true");
}
function ch() {
  try {
    return Ns() === "replace";
  } catch {
    return !1;
  }
}
function en(e, t) {
  if (at(e), e.querySelector(`[${yt}="${ye(t.pendingId)}"]`)) return;
  const n = lh(e, t);
  dh(n, t), kh(n, Ch(t)).append(Sh(t));
}
function lh(e, t) {
  const n = e.querySelector(`.${Xt}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Xt, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Zg), s.textContent = uh(t);
  const c = document.createElement("span");
  return c.classList.add(oi), c.textContent = t.summary, o.append(a, s, c), r.append(o), Ph(e).append(r), r;
}
function uh(e) {
  const t = E(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function dh(e, t) {
  const n = t.summaryLines ?? [], r = hi(n, t);
  if (r) {
    mh(e, r, t);
    return;
  }
  Eh(e, n);
}
function mh(e, t, n) {
  if (e.querySelector(`[${Qr}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Jr, `${Jr}--${t.intent}`), r.setAttribute(Qr, "true"), t.castingCheck && oo(r, ph(t.castingCheck), n.pendingId, "casting"), fh(t) && oo(r, gh(t), n.pendingId, "effect"), Ah(r, t), Th(r, t, n), wh(r, t), e.append(r);
}
function fh(e) {
  return e.intent !== "casting";
}
function ph(e) {
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
function gh(e) {
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
function oo(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${h}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, a.append(s), t.statusLabel) {
    const c = document.createElement("span");
    c.classList.add(`${h}__workflow-section-status`), c.textContent = t.statusLabel, a.append(c);
  }
  if (o.append(a), t.description) {
    const c = document.createElement("span");
    c.classList.add(`${h}__workflow-section-description`), c.textContent = t.description, o.append(c);
  }
  hh(o, t), Rh(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function hh(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = yh(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function yh(e, t) {
  const n = bh(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of _h(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function bh(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function _h(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ao(e, "highest") : n.includes("kl") ? ao(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ao(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Ah(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Ty);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function Th(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = $h(t, n);
  o.append(a), s && o.append(s);
  const c = document.createElement("span");
  c.classList.add(`${h}__resistance-description`), c.textContent = t.resistance, r.append(o, c), t.resistanceRollResult && r.append(li(t.resistanceRollResult)), e.append(r);
}
function $h(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(yt, t.pendingId), n.setAttribute(Xa, "true"), n.setAttribute(Ja, e.resistanceSkill), n.setAttribute(ei, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(ti, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(ni, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(ri, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function li(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = pi(e), t;
}
function Rh(e, t, n, r, o) {
  const a = t.filter((m) => m.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${n}-roll-details-${r}`, c = document.createElement("button");
  c.type = "button", c.classList.add(`${h}__roll-detail-toggle`), c.setAttribute(vn, s), c.setAttribute("aria-expanded", "false"), c.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(Za, s), u.hidden = !0;
  for (const m of a) {
    const f = document.createElement("dt");
    f.textContent = m.label;
    const _ = document.createElement("dd");
    _.textContent = m.value, u.append(f, _);
  }
  e.append(c, u);
}
function wh(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function kh(e, t) {
  const n = `[${Kr}="${ye(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Qg), o.setAttribute(Kr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function Ch(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = hi(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Eh(e, t) {
  if (t.length === 0) return;
  const n = Ih(e);
  for (const r of t) {
    const o = $y(r);
    if (n.querySelector(`[${Yr}="${ye(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(Yr, o), n.append(a);
  }
}
function Ih(e) {
  const t = e.querySelector(`.${Xr}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Xr), e.append(n), n;
}
function Sh(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(yt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(ai), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(bt, e.pendingId), t.setAttribute(Pn, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Zt, e.choiceGroupId), t.setAttribute(Qa, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Dh(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Lh(e);
  return `${t} → ${n}`;
}
function Lh(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Ph(e) {
  return di(e) ?? e;
}
function di(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function mi(e, t) {
  const n = At(e);
  if (!n) return;
  const r = n.querySelectorAll(Wg);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Gh(o, t);
    }));
}
function tn(e) {
  const t = At(e);
  if (!t) return;
  const n = t.querySelectorAll(Kg);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      vh(t, r);
    }));
}
function nn(e) {
  const t = At(e);
  if (!t) return;
  const n = t.querySelectorAll(Yg);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Nh(t, r);
    }));
}
function vh(e, t) {
  const n = t.getAttribute(vn);
  if (!n) return;
  const r = e.querySelector(`[${Za}="${ye(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Nh(e, t) {
  const n = t.getAttribute(yt), r = t.getAttribute(Ja), o = t.getAttribute(ei) ?? (r ? Wa(r) : "Resistência");
  if (!n || !r) return;
  const a = Fh(e, n), s = Mh(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Ug(s, r);
    await jh(u.roll);
    const m = {
      skill: r,
      skillLabel: o,
      formula: u.formula,
      total: u.total,
      targetName: s.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: u.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Oh(t, m), xh(t, m), Hh(n, m), await Vh(e, n, m);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1;
  }
}
function Oh(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(ri, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function xh(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? li(t);
  if (r) {
    r.textContent = pi(t);
    return;
  }
  n.append(o);
}
function Fh(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = _t(e);
  return B(r)[t] ?? null;
}
function Mh(e, t) {
  const n = e?.resistanceTargetActor;
  if (x(n)) return n;
  const o = e?.context?.targets.map(rn).find(x) ?? null;
  if (o) return o;
  const a = t.getAttribute(ti) ?? e?.resistanceTargetActorId ?? null, s = a ? Uh(a) : null;
  return s || qh(
    t.getAttribute(ni) ?? e?.resistanceTargetName ?? Bh(t)
  );
}
function Bh(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${oi}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function rn(e) {
  const t = e.actor;
  if (x(t)) return t;
  const n = e.token, r = Pe(n);
  if (r) return r;
  const o = e.document;
  return Pe(o);
}
function Pe(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (x(t)) return t;
  const n = e.document?.actor;
  return x(n) ? n : null;
}
function Uh(e) {
  const n = game.actors?.get?.(e);
  return x(n) ? n : fi().map((a) => Pe(a)).find((a) => a?.id === e) ?? null;
}
function qh(e) {
  const t = ue(e);
  if (!t) return null;
  const n = fi().filter((a) => ue(zh(a)) === t).map((a) => Pe(a)).find(x) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => x(a) && ue(a.name) === t);
  return x(o) ? o : null;
}
function fi() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function zh(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Pe(e)?.name ?? null;
}
function ue(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function x(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function pi(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function jh(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Hh(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function Vh(e, t, n) {
  const r = _t(e);
  if (r)
    try {
      const o = B(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await he(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function _t(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return M(r?.get?.(n));
}
async function Gh(e, t) {
  const n = e.getAttribute(bt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    gi(e, e.getAttribute(Pn) ?? "✓ Automação aplicada"), Wh(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function gi(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(ai), e.removeAttribute(bt), e.removeAttribute(Pn);
}
function Wh(e) {
  const t = e.getAttribute(Zt);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Zt}="${ye(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(Qa) ?? "✓ Outra opção escolhida";
    gi(o, a);
  }
}
function hi(e, t) {
  const n = e.map(On).filter(_y), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = E(e, "Forma"), a = E(e, "Custo"), s = E(e, "Dados") ?? E(e, `Dados (${r.label})`), c = E(e, "Tipo"), u = E(e, "Resistência"), m = E(e, "Resistência Perícia"), f = E(e, "Resistência Rótulo") ?? (m ? Wa(m) : null), _ = yi(e, "Observação"), T = e.filter((g) => Qh(g, r)), $ = Kh(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: s,
    damageType: c,
    resistance: u,
    resistanceSkill: m,
    resistanceSkillLabel: f,
    notes: _,
    details: T,
    castingCheck: $,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function Kh(e) {
  const t = e.map(On).find((a) => a?.intent === "casting") ?? null, n = E(e, "Conjuração DT"), r = E(e, "Conjuração Resultado");
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
function On(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: Yh(n)
  } : null;
}
function Yh(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function E(e, t) {
  return yi(e, t)[0] ?? null;
}
function yi(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Qh(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || On(e) ? !1 : e.trim().length > 0;
}
function Zh(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    on(r, e, t) && n.set(r.pendingId, r);
  for (const r of ny(e))
    on(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function on(e, t, n) {
  const r = G(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !io(n, "itemId", e.itemId) ? !1 : !e.actorId || io(n, "actorId", e.actorId);
}
function io(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${Ry(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Xh(e) {
  const t = ye(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Jh(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (on(e, null, t))
      return t;
  return null;
}
function ey() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function so(e, t) {
  const n = _t(e);
  if (!n) return !1;
  try {
    const r = B(n);
    return r[t.pendingId] = Mn(t, G(n)), await he(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function xn(e) {
  const t = Ti(e);
  if (!t) return !1;
  try {
    const n = B(t);
    return n[e.pendingId] = Mn(e, G(t)), await he(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function bi(e) {
  for (const t of Xg)
    globalThis.setTimeout(() => {
      an(e);
    }, t);
}
async function an(e) {
  const t = Ti(e);
  if (Fn(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await xn(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function ty(e, t) {
  const n = Ai(e.context.message);
  if (n)
    try {
      const r = B(n), o = r[e.pendingId] ?? Mn(e, G(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await he(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function ny(e) {
  return Object.values(B(M(e))).filter(Fe);
}
function B(e) {
  if (!e) return {};
  const t = {}, n = Fn(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(_i(e)))
    t[r] ??= o;
  return t;
}
function ry(e) {
  return Object.values(_i(M(e))).filter(Fe);
}
function _i(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, Ka);
  if (!fe(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Fe(o) && (n[r] = o);
  return n;
}
async function he(e, t) {
  typeof e.setFlag == "function" && (await ay(e, t), await oy(e, t));
}
async function oy(e, t) {
  await Promise.resolve(e.setFlag?.(l, Ka, t));
}
function Fn(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, Ya);
  return yy(t) ? t : null;
}
async function ay(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Fe).sort((a, s) => a.createdAt - s.createdAt);
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
      actorName: iy(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(l, Ya, o));
}
function iy(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Mn(e, t) {
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
function Ai(e) {
  const t = M(e);
  if (t?.setFlag)
    return t;
  const n = sy(e);
  if (n?.setFlag)
    return n;
  const r = G(e);
  if (!r) return null;
  const o = game.messages;
  return M(o?.get?.(r));
}
function sy(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(M).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Ti(e) {
  const t = Ai(e.context.message);
  if (t) return t;
  const n = e.messageId ? cy(e.messageId) : null;
  if (n) return n;
  const r = wi().slice().reverse();
  return r.find((o) => ly(o, e)) ?? r.find((o) => uy(o, e)) ?? null;
}
function cy(e) {
  const t = game.messages;
  return M(t?.get?.(e));
}
function ly(e, t) {
  const n = G(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!$i(e, t)) return !1;
  const o = Ri(e);
  return !t.actorId || !o || o === t.actorId;
}
function uy(e, t) {
  if (!my(e, t)) return !1;
  const n = Ri(e);
  return t.actorId && n === t.actorId ? !0 : $i(e, t);
}
function $i(e, t) {
  const n = ue(dy(e));
  if (!n) return !1;
  const r = ue(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = ue(t.itemId);
  return !!(o && n.includes(o));
}
function dy(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Ri(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function my(e, t) {
  const n = fy(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Jg;
}
function fy(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function M(e) {
  return e && typeof e == "object" ? e : null;
}
function Fe(e) {
  return fe(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && Z(e.resistanceTargetActorId) && Z(e.resistanceTargetName) && by(e.resistanceRollResult) && py(e.actionPayload) && Nt(e.title) && Nt(e.buttonLabel) && Nt(e.executedLabel) && Z(e.choiceGroupId) && Z(e.skippedLabel) && Z(e.actionSectionId) && Z(e.actionSectionTitle) && Ay(e.summaryLines) : !1;
}
function py(e) {
  return e == null ? !0 : fe(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && gy(e.resource) && hy(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function gy(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function hy(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function yy(e) {
  return fe(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && fe(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Fe) : !1;
}
function by(e) {
  return e == null ? !0 : fe(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function _y(e) {
  return e !== null;
}
function fe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function S(e) {
  return e === null || typeof e == "string";
}
function Nt(e) {
  return e === void 0 || typeof e == "string";
}
function Z(e) {
  return e == null || typeof e == "string";
}
function Ay(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Ty(e) {
  return typeof e == "string" && e.length > 0;
}
function wi() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(M).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(M).filter((r) => r !== null) : [];
}
function At(e) {
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
function $y(e) {
  return e.trim().toLowerCase();
}
function Ry(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ye(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const co = 1e3;
class wy {
  constructor(t, n, r, o, a, s) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = s, this.ritualAssistant = new zp(
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
      settings: Kn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Kn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = cn(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && Py(t.item) && n.executionMode === "ask") {
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
    if (await Ur(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ft(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await vt(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await vt(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Nn(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = Oy(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await et(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await rh(t), await oh(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (th(
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
    if (await Ur(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ft(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      vy(t.item)
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
      return o.ok ? (Ly(n, o.value), await ky(o.value), {
        ok: !0,
        executedLabel: Cy(o.value)
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
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== t.id && (this.pendingExecutions.delete(o), await vt(
        o,
        uo(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Mt();
    await nh({
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
    for (const s of r) {
      const c = Mt();
      a ??= c, this.pendingExecutions.set(c, {
        kind: "assisted-action",
        id: c,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await to({
        pendingId: c,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Ot(s),
        skippedLabel: uo(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: Ny(s)
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
    const r = Mt();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await to({
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
    const n = Date.now(), r = mo(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      n - s > co && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= co;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(mo(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = Ft(
      t,
      n,
      r,
      o
    );
  }
}
async function ky(e) {
  const t = Dy();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: Ey(e)
      });
    } catch (n) {
      d.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function Cy(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function Ey(e) {
  const t = e.instances.map((s) => {
    const c = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Qe(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${c}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = Iy(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Qe(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${Qe(e.actorName)}</strong></p>
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
function Iy(e) {
  const t = Sy(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Qe(o)}</li>`;
}
function Sy(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = lo(n?.value);
  return r === null ? null : {
    value: r,
    max: lo(n?.max)
  };
}
function lo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Dy() {
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
function uo(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function Ly(e, t) {
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
function Py(e) {
  return e.type === "ritual";
}
function vy(e) {
  return Jf(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Ny(e) {
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
function Oy(e) {
  const t = e.actorUuid ? xy(e.actorUuid) : null;
  if (pe(t)) return t;
  const n = e.actorId ? Fy(e.actorId) : null;
  return n || My(e.actorName);
}
function xy(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Fy(e) {
  const n = game.actors?.get?.(e);
  if (pe(n)) return n;
  for (const r of ki()) {
    const o = Bn(r);
    if (o?.id === e) return o;
  }
  return null;
}
function My(e) {
  const t = xt(e);
  if (!t) return null;
  for (const o of ki()) {
    const a = By(o);
    if (xt(a) === t) {
      const s = Bn(o);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (o) => pe(o) && xt(o.name) === t
  );
  return pe(r) ? r : null;
}
function ki() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function By(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Bn(e)?.name ?? null;
}
function Bn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (pe(t)) return t;
  const n = e.document?.actor;
  return pe(n) ? n : null;
}
function xt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function pe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ft(e, t, n, r) {
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
function mo(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Mt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Uy {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = Ne(t);
    for (const s of n) {
      const c = s.itemId ? a.find((f) => f.id === s.itemId) ?? null : null, u = s.match?.preset ?? null;
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
class qy {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Ne(t).map((c) => this.analyzeRitual(c)), r = n.filter(Ge("upToDate")), o = n.filter(Ge("available")), a = n.filter(Ge("outdated")), s = n.filter(Ge("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: o,
      outdated: a,
      unsupported: s,
      canApply: o.length > 0 || a.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = zy(t);
    return n ? r ? r.source.type !== "preset" ? $e({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? $e({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : $e({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: jy(r, n.preset)
    }) : $e({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : $e({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function $e(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? ct(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function zy(e) {
  const t = e.getFlag(l, "automation");
  return ln(t) ? t : null;
}
function jy(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Ge(e) {
  return (t) => t.status === e;
}
class Hy {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = dn(t.transaction);
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
    const n = A(t.actorName), r = A(t.resource), o = A(fo(t)), a = A(Gy(t));
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
    const r = A(n.title ?? "Automação"), o = n.message ? `<p>${A(n.message)}</p>` : "", a = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = A(t.item.name ?? "Item sem nome"), c = t.targets.length > 0 ? t.targets.map((g) => A(g.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map(
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(Vy(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), m = t.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(Wy(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), _ = t.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(fo(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), $ = t.phases.map((g) => A(g)).join(" &rarr; ");
    return `
      <section class="${l}-card ${l}-workflow-card">
        <header class="${l}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${l}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${c}</p>
          ${m.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${m.join("")}</ul>` : ""}
          ${u.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Dano:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${_.length > 0 ? `<p><strong>Cura:</strong></p><ul>${_.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${$.length > 0 ? `<p class="${l}-workflow-card__phases"><strong>Fases:</strong> ${$}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Vy(e) {
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
function fo(e) {
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
function Gy(e) {
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
function Wy(e) {
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
function Ky() {
  const e = new id(), t = new tm(e), n = new td(), r = new ld(), o = new md(r), a = new Cd(e), s = new Id(), c = s.registerMany(
    ms()
  );
  if (!c.ok)
    throw new Error(c.error.message);
  const u = new Ed(), m = new wd(), f = Df(), _ = new Am(f), T = new qy(
    s
  ), $ = new Uy(
    T,
    u,
    m
  ), g = new am(), v = new Hy(g), _e = new om(), Ae = new Jd(
    t,
    o,
    v,
    _e
  ), Te = new rm(Ae, _e), w = new wy(
    Te,
    t,
    o,
    n,
    _,
    g
  );
  return w.addStrategy(
    new $d(
      (U) => w.handleItemUsed(U)
    )
  ), {
    ordem: a,
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
    chatMessages: v,
    workflowHooks: _e,
    automation: Ae,
    workflow: Te,
    itemUseIntegration: w,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: $
  };
}
const { ApplicationV2: Yy } = foundry.applications.api;
class it extends Yy {
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
      apply: it.onApply,
      cancel: it.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${N(sn)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${N(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Bt("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Bt("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Bt("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Bt(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${N(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Qy(n) : Xy(t)}
    </section>
  `;
}
function Qy(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Zy).join("")}</ol>`;
}
function Zy(e) {
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
function Xy(e) {
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
const st = `${l}.manageRitualPresets`, po = `__${l}_ritualPresetHeaderControlRegistered`, Jy = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function eb(e) {
  const t = globalThis;
  if (!t[po]) {
    for (const n of Jy)
      Hooks.on(n, (r, o) => {
        tb(r, o, e);
      });
    t[po] = !0, d.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function tb(e, t, n) {
  Array.isArray(t) && rb(e) && (nb(e, n), !t.some((r) => r.action === st) && t.push({
    action: st,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Ci(e, n);
    }
  }));
}
function nb(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[st] && (e.options.actions[st] = (n) => {
    n.preventDefault(), n.stopPropagation(), Ci(e, t);
  }));
}
function rb(e) {
  if (!game.user?.isGM) return !1;
  const t = Ei(e);
  return t ? t.type === "agent" && Ne(t).length > 0 : !1;
}
function Ci(e, t) {
  const n = Ei(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new it(n, t).render({ force: !0 });
}
function Ei(e) {
  return go(e.actor) ? e.actor : go(e.document) ? e.document : null;
}
function go(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Ii = "data-paranormal-toolkit-ritual-roll-config", Me = "data-paranormal-toolkit-ritual-roll-field", te = "data-paranormal-toolkit-ritual-roll-action", ho = `__${l}_ritualRollConfigBlockRegistered`, ob = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], ab = [
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
function ib() {
  const e = globalThis;
  if (!e[ho]) {
    sb();
    for (const t of ob)
      Hooks.on(t, (...n) => {
        cb(n[0], n[1]);
      });
    e[ho] = !0, d.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function sb() {
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
function cb(e, t) {
  const n = $b(e);
  if (!n || n.type !== "ritual") return;
  const r = kb(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  ub(o);
  const a = Di(n), s = qa(n), c = Rb(n), u = db(n, s, a, c);
  yb(u, n, a, c), lb(o, u), Un(u);
}
function lb(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function ub(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Ii}]`)))
    t.remove();
}
function db(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${l}-ritual-roll-config`), o.setAttribute(Ii, e.uuid ?? e.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${l}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${l}-ritual-roll-config__title`), s.append(yo("strong", "Paranormal Toolkit")), s.append(yo("span", "Fórmula de rolagem"));
  const c = document.createElement("span");
  c.classList.add(`${l}-ritual-roll-config__badge`), c.textContent = Pi(t) ? "Configurada" : "Rascunho", a.append(s, c), o.append(a);
  const u = document.createElement("p");
  u.classList.add(`${l}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const m = document.createElement("div");
  m.classList.add(`${l}-ritual-roll-config__fields`), m.append(mb(t, r)), m.append(fb(t, r)), m.append(pb(t, r)), o.append(m), o.append(gb(t, n, r)), o.append(hb(r));
  const f = document.createElement("p");
  return f.classList.add(`${l}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function mb(e, t) {
  const n = Tt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Me, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = Xf(o), a.selected = e.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function fb(e, t) {
  const n = Tt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Me, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const a of ab) {
    const s = document.createElement("option");
    s.value = a.value, s.textContent = a.label, s.selected = e.damageType === a.value, r.append(s);
  }
  return n.append(r), n;
}
function pb(e, t) {
  const n = Tt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Me, "utilityLabel"), n.append(r), n;
}
function gb(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${l}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${l}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const a = document.createElement("div");
  return a.classList.add(`${l}-ritual-roll-config__forms-grid`), a.append(Ut("base", "Padrão", e.forms.base.formula, !0, n)), a.append(Ut("discente", "Discente", e.forms.discente.formula, t.discente, n)), a.append(Ut("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(a), r;
}
function Ut(e, t, n, r, o) {
  const a = Tt(t);
  a.classList.add(`${l}-ritual-roll-config__form-card`), a.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !o || !r, s.setAttribute(Me, `formula.${e}`), a.append(s), !r) {
    const c = document.createElement("small");
    c.textContent = "Indisponível neste ritual.", a.append(c);
  }
  return a;
}
function hb(e) {
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
function yo(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function yb(e, t, n, r) {
  be(e, "intent")?.addEventListener("change", () => Un(e)), Ao(e, "system.studentForm")?.addEventListener("change", () => bo(e, t)), Ao(e, "system.trueForm")?.addEventListener("change", () => bo(e, t)), e.querySelector(`[${te}="save"]`)?.addEventListener("click", () => {
    r && bb(e, t, n);
  }), e.querySelector(`[${te}="clear"]`)?.addEventListener("click", () => {
    r && _b(e, t);
  });
}
async function bb(e, t, n) {
  const r = e.querySelector(`[${te}="save"]`);
  r?.setAttribute("disabled", "true"), de(e, "Salvando configuração...");
  try {
    const o = Ab(e, n);
    await Qf(t, o), Si(e, o), de(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), de(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function _b(e, t) {
  const n = e.querySelector(`[${te}="clear"]`);
  n?.setAttribute("disabled", "true"), de(e, "Limpando configuração...");
  try {
    await Zf(t);
    const r = qa(t);
    Tb(e, r), Si(e, r), de(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), de(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Si(e, t) {
  const n = e.querySelector(`.${l}-ritual-roll-config__badge`);
  n && (n.textContent = Pi(t) ? "Configurada" : "Rascunho");
}
function Ab(e, t) {
  return {
    schemaVersion: 1,
    intent: Li(be(e, "intent")?.value),
    damageType: To(e, "damageType"),
    utilityLabel: To(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Ze(e, "formula.base") },
      discente: { formula: Ze(e, "formula.discente") },
      verdadeiro: { formula: Ze(e, "formula.verdadeiro") }
    }
  };
}
function Tb(e, t) {
  oe(e, "intent", t.intent), oe(e, "damageType", t.damageType ?? ""), oe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), oe(e, "formula.base", t.forms.base.formula), oe(e, "formula.discente", t.forms.discente.formula), oe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Un(e);
}
function Un(e) {
  const t = Li(be(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function bo(e, t) {
  const n = Di(t);
  _o(e, "discente", n.discente), _o(e, "verdadeiro", n.verdadeiro);
}
function _o(e, t, n) {
  const r = be(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${te}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const a = r.closest(`.${l}-ritual-roll-config__field`), s = a?.querySelector("small");
  if (a) {
    if (n) {
      s?.remove();
      return;
    }
    if (!s) {
      const c = document.createElement("small");
      c.textContent = "Indisponível neste ritual.", a.append(c);
    }
  }
}
function de(e, t) {
  const n = e.querySelector(`.${l}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Di(e) {
  const t = wb(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function $b(e) {
  return $o(e.item) ? e.item : $o(e.document) ? e.document : null;
}
function Rb(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function wb(e) {
  const t = e.system;
  return Cb(t) ? t : {};
}
function Ao(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function be(e, t) {
  return e.querySelector(`[${Me}="${Eb(t)}"]`);
}
function Ze(e, t) {
  return be(e, t)?.value.trim() ?? "";
}
function To(e, t) {
  const n = Ze(e, t);
  return n.length > 0 ? n : null;
}
function oe(e, t, n) {
  const r = be(e, t);
  r && (r.value = n);
}
function Li(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Pi(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function kb(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function $o(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function Cb(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function Eb(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let J = null;
Hooks.once("init", () => {
  ls(), vs(), fc(), Fu(), d.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Zn.isSupportedSystem()) {
    d.warn(
      `Sistema não suportado: ${Zn.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  J = Ky(), J.itemUseIntegration.registerStrategies(), lc(J.conditions), Gs(J), rc(), Js(), ju(), eb(J), ib(), d.info("Inicializado para o sistema Ordem Paranormal."), d.info(
    `API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${sn} inicializado.`);
});
function Ib() {
  if (!J)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return J;
}
export {
  Ib as getToolkitServices
};
//# sourceMappingURL=main.js.map
