const l = "paranormal-toolkit", cn = "Paranormal Toolkit", Ii = "ordemparanormal";
class Pe {
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
function ln(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : un(t) ? y(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Si(e) {
  return un(e.getFlag(l, "automation"));
}
function un(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Li(t.source) && Di(t.definition);
}
function Di(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(Pi) && (t.conditionApplications === void 0 || Mi(t.conditionApplications));
}
function Li(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function Pi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return vi(t);
    case "spendRitualCost":
      return Ni(t);
    case "rollFormula":
      return Oi(t);
    case "modifyResource":
      return xi(t);
    case "chatCard":
      return Fi(t);
    default:
      return !1;
  }
}
function vi(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && $o(t);
}
function Ni(e) {
  return e.type === "spendRitualCost";
}
function Oi(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || Hi(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function xi(e) {
  const t = e;
  return t.type === "modifyResource" && Ro(t.actor) && zi(t.resource) && ji(t.operation) && $o(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Fi(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Mi(e) {
  return Array.isArray(e) && e.every(Bi);
}
function Bi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && Ro(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || Ui(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel));
}
function Ui(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Vi(t.rounds)) && (t.expiry === void 0 || t.expiry === null || qi(t.expiry));
}
function qi(e) {
  return e === "turnStart" || e === "turnEnd";
}
function $o(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function Ro(e) {
  return e === "self" || e === "target";
}
function zi(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function ji(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Hi(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Vi(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function dn(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(zn);
    if (Ki(t))
      return Array.from(t).filter(zn);
  }
  return [];
}
function Gi(e) {
  return dn(e)[0] ?? null;
}
function Wi(e) {
  return dn(e).find(Si) ?? null;
}
function Ki(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function zn(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ve(e) {
  return dn(e).filter((t) => t.type === "ritual");
}
function wo(e) {
  return ve(e)[0] ?? null;
}
function Yi(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(ct);
      return d.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = $e("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Me(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Vn);
      return d.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = $e("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Me(n);
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
      const t = $e("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Me(t);
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
      const t = $e("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Me(t);
      n && (await e.automationBinder.clear(n), d.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function jn(e) {
  const t = $e("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = ve(t);
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
    r.applied.push(Qi(o, a, s));
  }
  return d.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Zi(r), r;
}
async function qt(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Qi(e, t, n) {
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
function Zi(e) {
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
function $e(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Me(e) {
  const t = wo(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ee(e) {
  return e ? {
    id: e.id,
    source: {
      ...Xi(e.sourceActor),
      token: e.sourceToken
    },
    item: Ji(e.item),
    targets: e.targets.map(es),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Gn(e.rollRequests, ko),
    rolls: Gn(e.rolls, ts),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(mn),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function mn(e) {
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
function Xi(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Ji(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function es(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function ko(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ts(e) {
  return {
    ...ko(e),
    total: e.total
  };
}
function Gn(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function ns(e) {
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
    rs(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    d.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  d.info(`${t} realizado:`, mn(a));
}
function W(e) {
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function rs(e) {
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
function os() {
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
function zt() {
  return {
    enabled: Ue(O.enabled),
    console: Ue(O.console),
    ui: Ue(O.ui),
    chat: Ue(O.chat)
  };
}
async function q(e, t) {
  await game.settings.set(l, O[e], t);
}
function Be(e, t) {
  game.settings.register(l, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Ue(e) {
  return game.settings.get(l, e) === !0;
}
function as() {
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
const Co = "ritual.costOnly", Eo = "ritual.simpleHealing", is = "ritual.eletrocussao", Io = "ritual.simpleDamage", So = "generic.simpleHealing", Do = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function ss() {
  return [
    cs(),
    ls(),
    us(),
    ds(),
    ms()
  ];
}
function cs() {
  return {
    id: Co,
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
function ls() {
  return {
    id: Eo,
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
    automation: Lo(),
    itemPatch: ps()
  };
}
function us() {
  return {
    id: is,
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
    automation: fs(),
    itemPatch: gs()
  };
}
function ds() {
  return {
    id: Io,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: fn()
  };
}
function ms() {
  return {
    id: So,
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
function Lo(e = "2d8+2") {
  return Po(
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
function fs() {
  return {
    ...fn("3d6", {
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
function fn(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Po(
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
function ps() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Do,
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
function gs() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Do,
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
function Po(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function pn() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ae(t.id),
    actorId: ae(t.actor?.id),
    sceneId: ae(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function vo() {
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
function hs(e) {
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
        if (!_s(t, n)) {
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
      const r = e.automationRegistry.require(Co);
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
      const o = e.automationRegistry.require(Eo);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Lo(t)
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
      const o = e.automationRegistry.require(Io);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: fn(t)
      }), d.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = K("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = Y(t);
      n && await ys(e, t, n);
    }
  };
}
async function ys(e, t, n) {
  const r = ln(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: vo(),
    item: n,
    targets: pn()
  });
  if (!o.ok) {
    bs(o.error);
    return;
  }
  d.info("Automação de ritual executada com sucesso.", ee(o.value.context));
}
function bs(e) {
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
  const t = wo(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function _s(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Wn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const As = ["disabled", "ask", "automatic"], Ts = ["buttons", "confirm"], No = "ask";
function $s(e) {
  return typeof e == "string" && As.includes(e);
}
function Rs(e) {
  return typeof e == "string" && Ts.includes(e);
}
function ws(e) {
  return $s(e) ? e : Rs(e) ? "ask" : No;
}
const ks = ["keep", "replace"], Cs = ["manual", "assisted"], Oo = "keep", xo = "assisted", Es = !0, I = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Is() {
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
    default: No
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
    default: Oo
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
    default: xo
  }), game.settings.register(l, I.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Es
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
  const e = ws(game.settings.get(l, I.executionMode)), t = Mo(game.settings.get(l, I.systemCardMode)), n = Bo(game.settings.get(l, I.damageResolutionMode));
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: Fo()
  };
}
function Ss() {
  return Mo(game.settings.get(l, I.systemCardMode));
}
function Ds() {
  return Bo(game.settings.get(l, I.damageResolutionMode));
}
function Fo() {
  return game.settings.get(l, I.ritualCastingCheckEnabled) === !0;
}
async function Q(e) {
  await game.settings.set(l, I.executionMode, e);
}
function Mo(e) {
  return ks.includes(e) ? e : Oo;
}
function Bo(e) {
  return Cs.includes(e) ? e : xo;
}
function Ls(e) {
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
const Ps = [
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
function vs(e) {
  return {
    phases() {
      return Ps;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = $t("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Wi(t);
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
      if (!xs(n)) {
        d.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Os(n) ?? $t("Nenhum ator encontrado para executar automação do item.");
      r && await Yn(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = $t("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Gi(t);
      if (!n) {
        d.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(So);
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
  const r = ln(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: vo(),
    item: n,
    targets: pn()
  });
  if (!o.ok) {
    Ns(o.error);
    return;
  }
  d.info("Automação executada com sucesso.", ee(o.value.context));
}
function Ns(e) {
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
  const t = Pe.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Os(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function xs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Fs(e) {
  const t = ns(e), n = Yi(e), r = hs(e), o = vs(e), a = as(), s = Ls(e);
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
function Ms(e) {
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
      return Bs(o), o;
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
      return Us(r), r;
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
function Bs(e) {
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
function Us(e) {
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
function qs(e) {
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
    conditions: Ms(e.conditions),
    debug: Fs(e)
  }, n = globalThis;
  return n[l] = t, n.ParanormalToolkit = t, t;
}
class Zn {
  static isSupportedSystem() {
    return game.system.id === Ii;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function zs() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ie(t.id),
    actorId: ie(t.actor?.id),
    sceneId: ie(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Uo() {
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
function js(e, t = Uo()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Hs(e) {
  if (!Ws(e)) return null;
  const t = e.getFlag(l, "workflow");
  return Gs(t) ? t : null;
}
function Vs() {
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
function Gs(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Ws(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ie(e) {
  return jt(e) ? e : null;
}
function jt(e) {
  return typeof e == "string" && e.length > 0;
}
function Ks() {
  const e = (t, n) => {
    Ys(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Ys(e, t) {
  const n = Hs(e);
  if (!n || n.targets.length === 0) return;
  const r = Zs(t);
  if (!r || r.querySelector(`.${l}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Qs(n));
}
function Qs(e) {
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
function Zs(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Xs() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!Js(r) || !ec(e) || Xn(e) || Xn(t)) return;
    const o = zs();
    if (o.length === 0 || !Jn(e) && !Jn(t)) return;
    const a = Uo();
    e.updateSource({
      [Vs()]: js(o, a)
    }), d.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Js(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function ec(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let tr = !1, Rt = !1, wt = !1, qe = null;
const tc = 1e3, nc = 750, rc = 1e3;
function oc(e) {
  tr || (Hooks.on("combatTurnChange", (t) => {
    ic(e, nr(t));
  }), Hooks.on("deleteCombat", (t) => {
    sc(e, nr(t));
  }), tr = !0, ac(e));
}
function ac(e) {
  lt() && (Rt || (Rt = !0, globalThis.setTimeout(() => {
    Rt = !1, gn(e, "ready");
  }, tc)));
}
function ic(e, t) {
  lt() && t && (qe && globalThis.clearTimeout(qe), qe = globalThis.setTimeout(() => {
    qe = null, gn(e, "combat-turn-change", t);
  }, nc));
}
function sc(e, t) {
  lt() && t && (wt || (wt = !0, globalThis.setTimeout(() => {
    wt = !1, gn(e, "combat-deleted", t);
  }, rc)));
}
async function gn(e, t, n) {
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
const qo = {
  enabled: "dice.animations.enabled"
};
function cc() {
  game.settings.register(l, qo.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function lc() {
  return {
    enabled: game.settings.get(l, qo.enabled) === !0
  };
}
const zo = "chatCard", rr = "data-paranormal-toolkit-prompt-id", i = `${l}-item-use-prompt`, uc = `.${i}__title`, jo = `.${i}__header`, dc = `.${i}__roll-card`, mc = `.${i}__roll-meta`, fc = `.${i}__roll-meta-pill`, hn = `.${i}__resistance`, pc = `.${i}__resistance-header`, Ho = `.${i}__resistance-description`, yn = `.${i}__resistance-roll-button`, Vo = `.${i}__resistance-roll-result`, or = `${i}__resistance-content`, Go = `.${i}__workflow-section`, Wo = `.${i}__workflow-roll`, Ko = `${i}__workflow-roll--dice-open`, Yo = `.${i}__workflow-roll-formula`, Qo = `${i}__workflow-roll-formula--toggle`, bn = `.${i}__workflow-dice-tray`, gc = `.${i}__roll-detail-toggle`, hc = `.${i}__roll-detail-list`, yc = `.${i}__ritual-element-badge`, bc = `.${i}__ritual-metadata`, _c = "casting-backlash", Ac = "data-paranormal-toolkit-action-section", Tc = "data-paranormal-toolkit-prompt-id", $c = "data-paranormal-toolkit-pending-id", ar = "data-paranormal-toolkit-casting-backlash-enhanced", ir = `.${i}`, Rc = `.${i}__workflow-section--casting`, wc = `.${i}__workflow-section-header`, kc = `.${i}__workflow-notes`, Cc = `[${Ac}="${_c}"]`, sr = `${i}__workflow-section-title-row`, Ec = `${i}__workflow-section-header--casting-backlash`, Zo = `${i}__casting-backlash-button`;
function Ic(e) {
  for (const t of Sc(e))
    Dc(t), Oc(t);
}
function Sc(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(ir) && t.add(e);
  for (const n of e.querySelectorAll(ir))
    t.add(n);
  return Array.from(t);
}
function Dc(e) {
  const t = e.querySelector(Cc);
  if (!t) return;
  const n = Lc(t);
  if (!n) return;
  const r = e.querySelector(`${Rc} ${wc}`);
  r && (r.classList.add(Ec), Pc(r), vc(n), r.append(n), t.remove());
}
function Lc(e) {
  return e.querySelector(
    `button[${$c}], button[${Tc}]`
  );
}
function Pc(e) {
  const t = e.querySelector(`:scope > .${sr}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(sr);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(Zo) || n.append(o));
  return n;
}
function vc(e) {
  if (e.getAttribute(ar) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Nc(t, e.disabled);
  e.classList.add(Zo), e.setAttribute(ar, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Nc(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Oc(e) {
  for (const t of e.querySelectorAll(kc)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function xc(e) {
  for (const t of Array.from(e.querySelectorAll(Go)))
    for (const n of Array.from(t.querySelectorAll(`${gc}, ${hc}`)))
      n.remove();
}
const Re = "data-paranormal-toolkit-prompt-id", Fc = "data-paranormal-toolkit-resistance-roll-result", Mc = "Conjuração DT";
function Xo(e) {
  const t = e.querySelector(yn)?.getAttribute(Fc), n = Ie(t);
  if (n !== null) return n;
  const r = e.querySelector(Vo)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Ie(o?.[1] ?? null);
}
function Jo(e) {
  const t = jc(e), n = Uc(t);
  if (n !== null) return n;
  const r = qc(t);
  return r !== null ? r : zc(e);
}
function Bc(e) {
  const t = e.getAttribute(Re);
  if (!t) return null;
  const n = ta(e), r = na(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((c) => ut(c) ? c.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function H(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function ea(e) {
  return H(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Uc(e) {
  const t = Vc(e);
  return t.length === 0 ? null : Ie(Gc(t, Mc));
}
function qc(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : cr(r, ["system", "ritual", "DT"]) ?? cr(r, ["system", "ritual", "dt"]);
}
function zc(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Ie(n?.[1] ?? null);
}
function jc(e) {
  const t = Hc(e);
  if (!t) return null;
  const n = ta(e), r = na(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => ut(a) ? a.pendingId === t : !1) ?? null;
}
function Hc(e) {
  return (e.closest(`[${Re}]`) ?? e.querySelector(`[${Re}]`) ?? e.parentElement?.querySelector(`[${Re}]`) ?? null)?.getAttribute(Re) ?? null;
}
function ta(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return Wc(o) ? o : null;
}
function na(e) {
  const t = e?.getFlag?.(l, zo);
  return ut(t) ? t : null;
}
function Vc(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Gc(e, t) {
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
  return typeof n == "number" ? Math.trunc(n) : Ie(typeof n == "string" ? n : null);
}
function Ie(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Wc(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function ut(e) {
  return !!(e && typeof e == "object");
}
const Kc = `.${i}__actions`, _n = `.${i}__actions-title`, Ze = `.${i}__button`, Yc = "data-paranormal-toolkit-action-section", Qc = `${i}__button--executed`, Zc = "data-paranormal-toolkit-executed-label";
function ra(e) {
  return H(e.querySelector(_n)?.textContent);
}
function Xc(e, t) {
  const n = e.querySelector(_n);
  n && (n.textContent = t);
}
function Jc(e, t) {
  const n = H(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const o = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return H(o) === n;
  }) ?? null;
}
function An(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function Ne(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const el = "data-paranormal-toolkit-damage-resolution-state", lr = "data-paranormal-toolkit-damage-icon-enhanced", tl = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function nl(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Xc(t, "Aplicar dano"), rl(e, t);
}
function rl(e, t) {
  const n = Array.from(t.querySelectorAll(Ze)), r = ur(n, "normal"), o = ur(n, "half");
  if (!r || !o) {
    t.classList.add(`${i}__actions--compact`);
    return;
  }
  dr(r, "normal"), dr(o, "half");
  const a = ol();
  if (t.classList.toggle(`${i}__actions--assisted`, a === "assisted"), t.classList.toggle(`${i}__actions--manual`, a !== "assisted"), a !== "assisted") {
    z(r, !0), z(o, !0), ze(t, "manual", null);
    return;
  }
  const s = Xo(e), c = Jo(e);
  if (c === null) {
    z(r, !0), z(o, !0), ze(t, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (s === null) {
    z(r, !0), z(o, !1), ze(t, "pending", null);
    return;
  }
  const u = s >= c;
  z(r, !u), z(o, u), ze(
    t,
    u ? "resisted" : "failed",
    u ? `Resistiu: ${s} vs DT ${c}.` : `Falhou: ${s} vs DT ${c}.`
  );
}
function ur(e, t) {
  const n = tl[t];
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
  ), e.setAttribute(lr, "true"), e.setAttribute("aria-label", n), e.replaceChildren(r, Ne(n));
}
function z(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function ze(e, t, n) {
  e.setAttribute(el, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${i}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(_n)?.after(o);
}
function ol() {
  try {
    return Ds();
  } catch {
    return "assisted";
  }
}
const Se = "data-paranormal-toolkit-effect-icon-enhanced", de = "data-paranormal-toolkit-effect-action-compacted", dt = "data-paranormal-toolkit-effect-resistance-gate", Tn = "data-paranormal-toolkit-effect-section", $n = "data-paranormal-toolkit-effect-label";
function al(e) {
  return e.querySelector(`[${Tn}="true"]`);
}
function il(e) {
  const t = cl(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? ll(), r = bl(n, e.sourceActions, t);
  return r && n.setAttribute($n, r), ul(n, t, r), hl(e.rollCard, n, e.after), yl(e.sourceActions, n), n;
}
function sl(e, t) {
  const n = t.querySelector(Ze);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (aa(n, r)) {
    Al(n);
    return;
  }
  const o = sa(t, n, r);
  if (!Tl(e, o)) {
    ca(n);
    return;
  }
  const a = Jo(e), s = Xo(e);
  if (a === null || s === null) {
    $l(n);
    return;
  }
  if (s >= a) {
    Rl(n);
    return;
  }
  wl(n, o);
}
function cl(e) {
  return e.sourceActions?.querySelector(Ze) ?? e.existingSection?.querySelector(Ze) ?? null;
}
function ll() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Tn, "true"), e;
}
function ul(e, t, n) {
  e.setAttribute(Tn, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = dl(e), o = ml(r);
  o.textContent = "Efeito";
  const a = fl(e, r), s = pl(a);
  s.textContent = kl(n ?? sa(e, t, t.textContent?.trim() ?? ""));
  const c = gl(a);
  t.parentElement !== c && c.append(t);
  const u = t.textContent?.trim() ?? "";
  !aa(t, u) && !_l(t, u) && ia(t, n ?? u);
}
function dl(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function ml(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function fl(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function pl(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function gl(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function hl(e, t, n) {
  const r = n ?? null;
  if (t.parentElement === e && t.previousElementSibling === r) return;
  const o = n?.nextElementSibling ?? e.firstElementChild;
  e.insertBefore(t, o);
}
function yl(e, t) {
  !e || e === t || e.remove();
}
function bl(e, t, n) {
  const r = e.getAttribute($n);
  if (r && r.trim().length > 0) return r.trim();
  const o = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return o || oa(n, n.textContent?.trim() ?? "");
}
function oa(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && H(n) !== "efeito aplicado") return n;
  const r = Bc(e);
  if (r) return r;
  const o = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && H(o) !== "aplicado" ? o : null;
}
function aa(e, t) {
  return e.classList.contains(Qc) || H(t).includes("aplicado");
}
function _l(e, t) {
  const n = e.getAttribute(dt);
  if (n === "pending" || n === "resisted") return !0;
  const r = ea(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function ia(e, t) {
  e.getAttribute(de) === "true" && e.getAttribute(Se) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(de, "true"), e.setAttribute(Se, "true"), e.setAttribute(Zc, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    An("✦", `${i}__button-icon--effect`),
    Ne("Aplicar")
  ));
}
function Al(e) {
  e.getAttribute(de) === "true" && H(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(de, "true"), e.setAttribute(Se, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    An("✓", `${i}__button-icon--effect-applied`),
    Ne("Aplicado")
  ));
}
function sa(e, t, n) {
  const r = e.getAttribute($n) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : oa(t, n) ?? n;
}
function Tl(e, t) {
  if (!e.querySelector(hn)) return !1;
  const n = ea(t);
  return n.includes("vulneravel") || n.includes("vulnerable");
}
function $l(e) {
  e.disabled = !0, e.removeAttribute(de), e.removeAttribute(Se), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(dt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(Ne("Role resistência"));
}
function Rl(e) {
  e.disabled = !0, e.removeAttribute(de), e.removeAttribute(Se), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(dt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    An("✓", `${i}__button-icon--effect-resisted`),
    Ne("Resistiu")
  );
}
function wl(e, t) {
  ca(e), ia(e, t);
}
function ca(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(dt);
}
function kl(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const Xe = "data-paranormal-toolkit-prompt-id", Cl = "data-paranormal-toolkit-card-layout-normalized", mr = "data-paranormal-toolkit-card-layout-refresh-bound", El = "apply-damage", la = [0, 80, 180, 400, 900, 1600, 3e3], fr = /* @__PURE__ */ new WeakSet();
function Il(e) {
  ua(e), Sl(e);
}
function ua(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    ma(da(t));
}
function Sl(e) {
  if (!fr.has(e)) {
    fr.add(e);
    for (const t of la)
      globalThis.setTimeout(() => {
        ua(e);
      }, t);
  }
}
function da(e) {
  return {
    rollCard: e,
    damageSection: Jc(e, "Dano"),
    resistance: e.querySelector(hn),
    damageActions: Dl(e),
    effectActionSource: Ll(e),
    effectSection: al(e)
  };
}
function ma(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: o,
    effectActionSource: a,
    effectSection: s
  } = e;
  t.setAttribute(Cl, "true"), t.classList.add(`${i}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), nl(t, o));
  const c = il({
    rollCard: t,
    existingSection: s,
    sourceActions: a,
    after: n
  });
  c && sl(t, c), Nl(t);
}
function Dl(e) {
  return Ht(e).find((t) => t.getAttribute(Yc) === El) ?? Ht(e).find((t) => ra(t) === "aplicar danos") ?? null;
}
function Ll(e) {
  return Ht(e).find((t) => {
    const n = ra(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function Ht(e) {
  const t = e.closest(`.${i}`) ?? e.parentElement;
  if (!t) return [];
  const n = vl(e), r = Array.from(t.querySelectorAll(Kc));
  if (!n) return r;
  const o = r.filter((a) => Pl(a, n));
  return o.length > 0 ? o : r;
}
function Pl(e, t) {
  return Array.from(e.querySelectorAll(`[${Xe}]`)).some((n) => n.getAttribute(Xe) === t);
}
function vl(e) {
  return e.querySelector(`[${Xe}]`)?.getAttribute(Xe) ?? null;
}
function Nl(e) {
  const t = e.querySelector(yn);
  t && t.getAttribute(mr) !== "true" && (t.setAttribute(mr, "true"), t.addEventListener("click", () => {
    for (const n of la)
      globalThis.setTimeout(() => {
        ma(da(e));
      }, n);
  }));
}
const Ol = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function xl(e) {
  for (const t of Array.from(e.querySelectorAll(hn)))
    Fl(t);
  Il(e);
}
function Fl(e) {
  const t = e.querySelector(pc), n = e.querySelector(Ho), r = e.querySelector(yn), o = e.querySelector(Vo);
  if (!r || !t && !n && !o) return;
  const a = Ml(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && (o.parentElement !== e && !r.contains(o) && e.append(o), Bl(o)), r.parentElement !== e && e.append(r);
}
function Ml(e, t) {
  const n = e.querySelector(`.${or}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(or), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function Bl(e) {
  const t = Ul(e.textContent ?? "");
  t && (e.setAttribute(Ol, "true"), e.replaceChildren(jl(t)));
}
function Ul(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, a = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: c, diceValues: u } = ql(r ?? "");
  return c ? {
    skillLabel: a,
    formula: c,
    total: Math.trunc(s),
    diceValues: u
  } : null;
}
function ql(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: zl(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function zl(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function jl(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Hl(e);
  return r && t.append(r), t;
}
function Hl(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of Vl(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Vl(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? pr(e, "highest") : n.includes("kl") ? pr(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function pr(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function gr(e) {
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
  const n = Gl(e, t);
  return Ge(n);
}
function Gl(e, t) {
  return t.split(".").reduce((n, r) => mt(n) ? n[r] : null, e);
}
function Wl(e, t) {
  const n = e.indexOf(":");
  return n < 0 || De(e.slice(0, n)) !== De(t) ? null : pe(e.slice(n + 1));
}
function Ge(e) {
  return typeof e == "string" ? pe(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function mt(e) {
  return !!e && typeof e == "object";
}
function Kl(e) {
  return typeof e == "string";
}
function ft(e) {
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
function Vt(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function V(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function fa(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Yl(e) {
  for (const t of Array.from(e.querySelectorAll(dc))) {
    const n = nu(t);
    Ql(t), n && (Zl(t, n), Xl(t, n));
  }
}
function Ql(e) {
  for (const t of Array.from(e.querySelectorAll(mc)))
    t.remove();
}
function Zl(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(jo) ?? null, o = r?.querySelector(uc) ?? null, a = r ?? e, s = a.querySelector(yc);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const c = s ?? document.createElement("span");
  if (c.className = _u(t.elementTone), c.textContent = bu(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", c);
      return;
    }
    a.prepend(c);
  }
}
function Xl(e, t) {
  const n = Jl(e);
  eu(e, n);
  const r = tu(t);
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
  const a = e.querySelector(Go);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function Jl(e) {
  return e.closest(`.${i}`)?.querySelector(jo) ?? null;
}
function eu(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(bc)))
      o.remove();
}
function tu(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Vt(e.target)}` : null,
    e.duration ? `Duração: ${Vt(e.duration)}` : null,
    e.resistance ? `Resistência: ${fa(e.resistance)}` : null
  ].filter(ft);
}
function nu(e) {
  const t = ru(e), n = lu(e), o = (t ? cu(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = wn(D(o, "element")), c = F("op.elementChoices", s) ?? hr(X(a, "Elemento")) ?? hr(n.damageType), u = s ?? Au(c), m = D(o, "circle") ?? X(a, "Círculo"), f = mu(o) ?? X(a, "Alvo"), _ = hu(o, "duration", "op.durationChoices") ?? X(a, "Duração"), T = uu(e) ?? pu(o) ?? X(a, "Resistência"), $ = du(a) ?? n.cost, g = {
    elementLabel: c,
    elementTone: u,
    circle: m,
    cost: $,
    target: f,
    duration: _,
    resistance: T
  };
  return yu(g) ? g : null;
}
function ru(e) {
  const t = ou(e);
  if (!t) return null;
  const n = t.getFlag?.(l, zo), r = iu(n);
  if (r.length === 0) return null;
  const o = au(e);
  if (o.size > 0) {
    const a = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function ou(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Rn()?.messages?.get?.(n) ?? null : null;
}
function au(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${rr}]`))) {
    const o = r.getAttribute(rr)?.trim();
    o && n.add(o);
  }
  return n;
}
function iu(e) {
  if (!mt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(su).filter((n) => n !== null) : [];
}
function su(e) {
  return mt(e) ? {
    pendingId: Ge(e.pendingId),
    actorId: Ge(e.actorId),
    itemId: Ge(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Kl) : []
  } : null;
}
function cu(e) {
  if (!e.itemId) return null;
  const t = Rn(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function lu(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(fc))) {
    const o = pe(r.textContent);
    if (!o) continue;
    const a = Wl(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function uu(e) {
  const t = pe(e.querySelector(Ho)?.textContent);
  return t ? fa(t) : null;
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
function du(e) {
  const t = X(e, "Custo") ?? X(e, "PE");
  return t || (e.map(pe).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function mu(e) {
  const t = D(e, "target");
  if (!t) return null;
  if (t === "area")
    return fu(e) ?? F("op.targetChoices", t) ?? "Área";
  const n = F("op.targetChoices", t) ?? V(t);
  return [t === "people" || t === "creatures" ? D(e, "targetQtd") : null, n].filter(ft).join(" ");
}
function fu(e) {
  const t = D(e, "area.name"), n = D(e, "area.size"), r = D(e, "area.type"), o = t ? F("op.areaChoices", t) ?? V(t) : null, a = r ? F("op.areaTypeChoices", r) ?? V(r) : null;
  return o ? n ? a ? `${o} ${n}m ${Vt(a)}` : `${o} ${n}m` : o : null;
}
function pu(e) {
  const t = D(e, "skillResis"), n = D(e, "resistance");
  if (!t || !n) return null;
  const r = F("op.skill", t) ?? V(t), o = gu(n);
  return [r, o].filter(ft).join(" ");
}
function gu(e) {
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
function hu(e, t, n) {
  const r = D(e, t);
  return r ? F(n, r) ?? V(r) : null;
}
function yu(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function bu(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function _u(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(ft).join(" ");
}
function wn(e) {
  const t = De(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function hr(e) {
  const t = wn(e);
  return t ? F("op.elementChoices", t) ?? V(t) : e ? V(e) : null;
}
function Au(e) {
  return wn(e);
}
function F(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Rn()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const yr = "data-paranormal-toolkit-dice-toggle-enhanced";
function Tu(e) {
  for (const t of Array.from(e.querySelectorAll(Wo)))
    pa(t);
}
function $u(e) {
  const t = ha(e.target);
  if (!t) return;
  const n = kn(t);
  n && (e.preventDefault(), ga(n, t));
}
function Ru(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = ha(e.target);
  if (!t) return;
  const n = kn(t);
  n && (e.preventDefault(), ga(n, t));
}
function pa(e) {
  const t = e.querySelector(bn);
  if (!t) return;
  const n = e.querySelector(Yo);
  if (n && n.getAttribute(yr) !== "true" && (n.setAttribute(yr, "true"), n.classList.add(Qo), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function ga(e, t) {
  const n = e.querySelector(bn);
  if (!n) return;
  const r = !e.classList.contains(Ko);
  wu(e, t, n, r);
}
function wu(e, t, n, r) {
  e.classList.toggle(Ko, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function ha(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Yo);
  if (!t) return null;
  const n = kn(t);
  return n ? (pa(n), t.classList.contains(Qo) ? t : null) : null;
}
function kn(e) {
  const t = e.closest(Wo);
  return t && t.querySelector(bn) ? t : null;
}
const br = `${l}-workflow-dice-toggle-styles`;
function ku() {
  if (document.getElementById(br)) return;
  const e = document.createElement("style");
  e.id = br, e.textContent = `
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
const Cu = [0, 100, 500, 1500, 3e3];
let _r = !1, kt = null;
function Eu() {
  if (!_r) {
    _r = !0, ku(), Hooks.on("renderChatMessageHTML", (e, t) => {
      we(gr(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      we(gr(t));
    }), Hooks.once("ready", () => {
      we(document), Iu();
    }), document.addEventListener("click", $u), document.addEventListener("keydown", Ru);
    for (const e of Cu)
      globalThis.setTimeout(() => we(document), e);
  }
}
function Iu() {
  kt || !document.body || (kt = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && we(n);
  }), kt.observe(document.body, { childList: !0, subtree: !0 }));
}
function we(e) {
  e && (xc(e), Yl(e), xl(e), Tu(e), Ic(e));
}
function Su() {
  Eu();
}
const Du = "data-paranormal-toolkit-action-section", Lu = "ritual-log", Pu = ".paranormal-toolkit-item-use-prompt__actions", vu = ".paranormal-toolkit-item-use-prompt__actions-title", Nu = [0, 100, 500, 1500];
let Ar = !1;
function Ou() {
  if (Ar) return;
  const e = (t, n) => {
    Tr(Bu(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Tr(document), Ar = !0;
}
function Tr(e) {
  for (const t of Nu)
    globalThis.setTimeout(() => xu(e), t);
}
function xu(e) {
  Fu(e), Mu(e);
}
function Fu(e) {
  for (const t of e.querySelectorAll(
    `[${Du}="${Lu}"]`
  ))
    t.remove();
}
function Mu(e) {
  for (const t of e.querySelectorAll(Pu)) {
    if ($r(t.querySelector(vu)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (a) => $r(a.textContent ?? "")
    ).some((a) => a.includes("ritual conjurado")) && t.remove();
  }
}
function Bu(e) {
  if (e instanceof HTMLElement || Uu(e))
    return e;
  if (qu(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Uu(e) {
  return e instanceof HTMLElement;
}
function qu(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function $r(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const zu = {
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
}, ju = new Set(
  Object.values(zu)
), Hu = {
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
function Vu(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Gu(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Hu[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : ju.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function ya(e) {
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
function Gu(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Wu {
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
      const _ = Ku(f, m);
      if (!_.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const T = Vu(f.damageType);
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
          Yu(_.id, f, T.value)
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
        for (const v of Zu($.conditions))
          c.add(v);
        const g = Qu($.newPV);
        g !== null && (u = g), s.push({
          id: _.id,
          label: f.label ?? ya(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: _.amount,
          finalDamage: Rr($.finalDamage, _.amount),
          blocked: Rr($.blocked, 0),
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
function Ku(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Yu(e, t, n) {
  return {
    id: e,
    label: t.label ?? ya(n),
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
function Rr(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Qu(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Zu(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const ke = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, ba = {
  PV: "system.attributes.hp"
}, Gt = {
  PV: [ke.PV, ba.PV],
  SAN: [ke.SAN],
  PE: [ke.PE],
  PD: [ke.PD]
}, Wt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Xu {
  getResource(t, n) {
    const r = wr(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, s = `${o}.max`, c = foundry.utils.getProperty(t, a), u = foundry.utils.getProperty(t, s), m = Cr(t, n, a, c, "valor atual");
    if (m) return p(m);
    const f = Cr(t, n, s, u, "valor máximo");
    return f ? p(f) : y({
      value: c,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = wr(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function wr(e, t) {
  const n = Ju(e.type, t);
  if (n && kr(e, n))
    return y(n);
  const r = Gt[t].find(
    (o) => kr(e, o)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: ed(e, t),
    path: Gt[t].join(" | ")
  });
}
function Ju(e, t) {
  return e === "threat" ? ba[t] ?? null : e === "agent" ? ke[t] : null;
}
function kr(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function ed(e, t) {
  const n = e.type ?? "unknown", r = Gt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Cr(e, t, n, r, o) {
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
class td {
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
      const s = Wt.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: o } = n, a = nd(o);
    return a ? y(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Wt.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function nd(e) {
  if (Er(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Er(n))
      return n;
  }
  return null;
}
function Er(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const rd = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class od {
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
    const r = n.value, o = ad(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: rd[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function ad(e, t) {
  const n = e.getFlag(l, "ritual.cost");
  return n == null ? { ok: !0, value: null } : id(n) ? {
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
function id(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Ct = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function sd(e) {
  if (!fd(e.item)) return null;
  const t = Kt(e.actor) ? e.actor : cd(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: ud(e.token) ?? ld(t),
    targets: pn(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function cd(e) {
  const t = e;
  return Kt(t.actor) ? t.actor : Kt(e.parent) ? e.parent : null;
}
function ld(e) {
  const t = dd(e) ?? md(e);
  return t ? _a(t) : null;
}
function ud(e) {
  return Yt(e) ? _a(e) : null;
}
function dd(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Yt(n) ? n : (t.getActiveTokens?.() ?? []).find(Yt) ?? null;
}
function md(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function _a(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Et(e.id),
    actorId: Et(t?.id),
    sceneId: Et(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function fd(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Kt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Yt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Et(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class pd {
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
    const n = sd(gd(t));
    if (!n) {
      d.warn(`${Ct.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function gd(e) {
  return e && typeof e == "object" ? e : {};
}
class hd {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return It("missing-item-patch");
    if (t.type !== "ritual") return It("unsupported-item-type");
    const o = yd(r);
    return Object.keys(o).length === 0 ? It("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function yd(e) {
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
class bd {
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
    return this.getNumber(t, Wt.ritual.dt, 0);
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
class _d {
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
class Ad {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Td(t);
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
    return this.list().map((n) => $d(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Td(e) {
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
function $d(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = Rd(o, t);
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
function Rd(e, t) {
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
      const n = Ir(t.name), r = e.names.map(Ir).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = wd(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Ir(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function wd(e) {
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
const kd = "dice-so-nice";
async function Aa(e) {
  if (!Cd() || !Ed()) return;
  const t = Id();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      d.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Cd() {
  try {
    return lc().enabled;
  } catch {
    return !1;
  }
}
function Ed() {
  return game.modules?.get?.(kd)?.active === !0;
}
function Id() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Sd(e, t, n) {
  if (!Sr(e.id) || !Sr(e.formula))
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
    await Aa(o);
    const c = {
      ...n.rollRequests[e.id] ?? Ta(e, t),
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
function Ta(e, t) {
  const n = e.intent ?? Dd(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function Dd(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Sr(e) {
  return typeof e == "string" && e.length > 0;
}
async function et(e, t, n, r, o) {
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
function Ld(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = Pd(t, n, r, o);
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
    const s = vd(t, n, r, o);
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
function Pd(e, t, n, r) {
  const o = pt(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: $a(t.id, "damage", r, t.damageInstances.length),
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
function vd(e, t, n, r) {
  const o = pt(e.amountFrom);
  return {
    id: $a(t.id, "healing", r, t.healingInstances.length),
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
function $a(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Nd(e, t, n) {
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
function Od(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Ra("before", e), Dr("before", e), Dr("resolve", e);
}
function xd(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Ra("apply", e);
}
function Fd(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Ra(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = t, c = Md(e, n.operation);
  c && s.emit(c, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Dr(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Md(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Bd(e, t, n) {
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
async function Ud(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return qd(e, t);
    case "spendRitualCost":
      return zd(e, t);
  }
}
async function qd(e, t) {
  const { context: n, resources: r } = e, o = Je(t, n);
  return o.ok ? wa(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function zd(e, t) {
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
  }), wa(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function wa(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function jd(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, s = Hd(t);
  for (const u of s.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const c = await a();
  if (!c.ok)
    return c;
  for (const u of s.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return c;
}
function Hd(e) {
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
class Vd {
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
        return jd({
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
    const o = await Ud({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = Ta(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await Sd(t, r, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = Je(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = Nd(t, n, o.value);
    Od({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), xd({
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
      Ld({
        step: t,
        context: n,
        transaction: m.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Fd({
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
    const o = await Bd(this.messages, t, n);
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
    const c = Gd(t, n.intent);
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
function Gd(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Wd {
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
function ka(e) {
  return {
    id: Kd(),
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
function Kd() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Yd {
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
    const r = ka(n);
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
class Qd {
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
class Zd {
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
      whisper: Xd(),
      flags: {
        ...t.flags,
        [l]: {
          ...Jd(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && d.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = zt();
    if (!r.enabled)
      return;
    const o = n.notification ?? Lr(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = Lr(n);
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
function Lr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Xd() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Jd(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function em(e, t) {
  const n = sm(e?.rounds);
  if (!n)
    return Pr(null);
  const r = e?.anchor ?? Ca(t);
  if (!r)
    return {
      ...Pr(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: tm(),
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
function Ca(e) {
  const t = cm();
  if (!t?.id || !Ea(t.round)) return null;
  const n = am(t), r = nm(e, n) ?? om(t), o = j(r?.id), a = um(r?.initiative), s = rm(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: s,
    initiative: a,
    time: lm()
  };
}
function tm() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Pr(e) {
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
function nm(e, t) {
  return e?.id ? t.find((n) => im(n) === e.id) ?? null : null;
}
function rm(e, t, n) {
  const r = j(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return dm(e.turn) ? e.turn : null;
}
function om(e) {
  return We(e.combatant) ? e.combatant : null;
}
function am(e) {
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
function im(e) {
  return j(e.actor?.id) ?? j(e.actorId) ?? j(e.token?.actor?.id) ?? j(e.token?.actorId) ?? j(e.document?.actor?.id) ?? j(e.document?.actorId);
}
function sm(e) {
  return Ea(e) ? Math.trunc(e) : null;
}
function cm() {
  return game.combat ?? null;
}
function lm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function We(e) {
  return !!(e && typeof e == "object");
}
function j(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function um(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ea(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function dm(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class mm {
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
    if (!$m(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = em(t.duration, r), s = fm(o, t, a), u = t.refreshExisting ?? !0 ? Rm(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(s)), y(vr(r, o, u.id ?? null, !1, !0, a));
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
      return y(vr(r, o, f, !0, !1, a));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = Sa(n, r);
    let a = 0;
    try {
      for (const s of o)
        await Nr(n, s) === "deleted" && (a += 1);
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
    const n = Cm(), r = [];
    let o = 0, a = 0;
    for (const s of n) {
      const c = Cn(s);
      o += c.length;
      for (const u of c) {
        if (!hm(u, t)) continue;
        const m = Ia(u);
        try {
          await Nr(s, u) === "deleted" && (a += 1);
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
function fm(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: xm(),
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
    duration: pm(n.duration),
    start: gm(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [l]: r
    }
  };
}
function pm(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function gm(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Om(),
    ...e
  };
}
function vr(e, t, n, r, o, a) {
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
function hm(e, t) {
  const n = Ia(e);
  if (!n.conditionId || !ym(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Nm();
  return n.durationMode === "combatantTurn" || bm(n) ? Am(n, r) : _m(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !L(n.startRound) || !L(n.requestedRounds) || !L(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function ym(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && L(e.requestedRounds);
}
function bm(e) {
  return !!(e.combatDurationApplied && L(e.requestedRounds) && L(e.startRound) && (e.startCombatantId || tt(e.startTurn)));
}
function _m(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Am(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !L(e.startRound) || !L(e.requestedRounds) || !L(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Tm(t);
  return e.startCombatantId ? r === e.startCombatantId : tt(e.startTurn) && tt(t.turn) ? t.turn === e.startTurn : !1;
}
function Tm(e) {
  return se(e.combatant?.id);
}
function Ia(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ke(e, "conditionId"),
    requestedRounds: Or(e, "requestedRounds") ?? Ce(t.value) ?? Ce(t.rounds),
    combatDurationApplied: Lt(e, "combatDurationApplied"),
    combatId: Ke(e, "combatId") ?? se(n.combat) ?? se(t.combat),
    startCombatantId: Ke(e, "startCombatantId") ?? se(n.combatant),
    startInitiative: Dm(e, "startInitiative") ?? Da(n.initiative),
    startRound: Or(e, "startRound") ?? Ce(n.round) ?? Ce(t.startRound),
    startTurn: Sm(e, "startTurn") ?? Qt(n.turn) ?? Qt(t.startTurn),
    expiryEvent: Lm(e, "expiryEvent") ?? La(t.expiry),
    durationMode: Pm(e, "durationMode"),
    deleteOnExpire: Lt(e, "deleteOnExpire"),
    expiresWithCombat: Lt(e, "expiresWithCombat")
  };
}
function $m(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Rm(e, t) {
  return Sa(e, t)[0] ?? null;
}
function Sa(e, t) {
  return Cn(e).filter((n) => Im(n) === t);
}
async function Nr(e, t) {
  const n = t.id ?? null, r = n ? wm(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (km(o)) return "missing";
    throw o;
  }
}
function wm(e, t) {
  return Cn(e).find((n) => n.id === t) ?? null;
}
function km(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Cm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      He(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    He(e, n);
  });
  for (const n of Em())
    He(e, n.actor), He(e, n.document?.actor);
  return Array.from(e.values());
}
function He(e, t) {
  if (!vm(t)) return;
  const r = se(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Em() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Cn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Im(e) {
  return Ke(e, "conditionId");
}
function Ke(e, t) {
  return se(ne(e, t));
}
function Or(e, t) {
  return Ce(ne(e, t));
}
function Sm(e, t) {
  return Qt(ne(e, t));
}
function Dm(e, t) {
  return Da(ne(e, t));
}
function Lm(e, t) {
  return La(ne(e, t));
}
function Pm(e, t) {
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
function se(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ce(e) {
  return L(e) ? Math.trunc(e) : null;
}
function Qt(e) {
  return tt(e) ? Math.trunc(e) : null;
}
function Da(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function La(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function vm(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Nm() {
  return game.combat ?? null;
}
function Om() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function L(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function tt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function xm() {
  return game.user?.id ?? null;
}
const Fm = "icons/svg/downgrade.svg", Mm = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Fm,
    description: Mm,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Bm = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Um = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), qm = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), zm = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), jm = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Hm = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Vm = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Gm = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Wm = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Km = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Ym = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Qm = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Zm = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Xm = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Jm = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), ef = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), tf = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), nf = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), rf = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), of = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), af = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), sf = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), cf = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), lf = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), uf = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), df = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), mf = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), ff = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), pf = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), gf = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), hf = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), yf = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), bf = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), _f = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Af = [
  Bm,
  Um,
  qm,
  zm,
  jm,
  Hm,
  Vm,
  Gm,
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
  _f
];
class Tf {
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
    return Array.from(this.definitions.values()).map(xr);
  }
  get(t) {
    const n = this.lookup.get(Fr(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(xr(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Fr(t);
    r && this.lookup.set(r, n);
  }
}
function $f() {
  return new Tf(Af);
}
function xr(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Fr(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const Rf = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Pa = `${l}-inline-roll-neutralized`, wf = `${l}-inline-roll-notice`, En = `data-${l}-inline-roll-neutralized`, Mr = `data-${l}-inline-roll-notice`, kf = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Br(e) {
  const t = Bf(e.message), n = await Cf(e.message), r = Ef(t);
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
async function Cf(e) {
  const t = xf(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = If(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Ff(t, n.content), replacementCount: n.replacementCount };
}
function Ef(e) {
  const t = e ? Mf(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = va(t);
  return n > 0 && Na(vf(t)), { replacementCount: n };
}
function If(e) {
  const t = Sf(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = va(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (Na(n.content), { content: n.innerHTML, replacementCount: o });
}
function Sf(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, Lf(o.trim()))), replacementCount: t };
}
function va(e) {
  const t = Df(e);
  for (const n of t)
    n.replaceWith(Pf(Nf(n)));
  return t.length;
}
function Df(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(Rf))
    n.getAttribute(En) !== "true" && t.add(n);
  return Array.from(t);
}
function Lf(e) {
  return `<span class="${Pa}" ${En}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Uf(e)}</span>`;
}
function Pf(e) {
  const t = document.createElement("span");
  return t.classList.add(Pa), t.setAttribute(En, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Na(e) {
  if (e.querySelector?.(`[${Mr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(wf), t.setAttribute(Mr, "true"), t.textContent = kf, e.append(t);
}
function vf(e) {
  return e.querySelector(".message-content") ?? e;
}
function Nf(e) {
  const n = e.getAttribute("data-formula") ?? Of(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Of(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function xf(e) {
  return e && typeof e == "object" ? e : null;
}
async function Ff(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return d.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Mf(e) {
  const t = qf(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Bf(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Uf(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function qf(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const nt = "ritualRollConfig", ce = "ritual-roll";
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
function Oa(e) {
  const t = e.getFlag(l, nt);
  return Zt(t);
}
function xa(e) {
  return Oa(e) ?? gt();
}
async function zf(e, t) {
  const n = Zt(t) ?? Zt({
    ...gt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(l, nt, n), n;
}
async function jf(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, l, nt));
    return;
  }
  await e.setFlag(l, nt, null);
}
function Zt(e) {
  if (!ht(e)) return null;
  const t = Xf(e.intent);
  if (!t) return null;
  const n = gt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: rt(e.damageType),
    utilityLabel: rt(e.utilityLabel) ?? n.utilityLabel,
    note: In(e.note),
    forms: Jf(e.forms)
  };
}
function Hf(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Vf(e) {
  const t = Oa(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = Gf(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...Wf(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: Yf(e, t),
    resistance: t.intent === "damage" ? Qf(e) : void 0
  };
}
function Gf(e, t) {
  const n = {
    type: "rollFormula",
    id: ce,
    formula: t,
    intent: Zf(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function Wf(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${ce}.total`,
          ...Kf(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${ce}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function Kf(e) {
  return e ? { damageType: e } : {};
}
function Yf(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [ce]: n
      }
    }
  };
  return Ur(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [ce]: t.forms.discente.formula.trim()
    }
  }), Ur(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [ce]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Qf(e) {
  const t = Fa(e), n = rt(t.skillResis), r = rt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = ep(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function Zf(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Xf(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function Jf(e) {
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
function Ur(e, t) {
  const n = Fa(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return tp(r);
}
function Fa(e) {
  const t = e.system;
  return ht(t) ? t : {};
}
function ep(e) {
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
function tp(e) {
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
const qr = "occultism";
function np(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function rp(e) {
  const t = np(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await op(e, qr);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Aa(n);
  const r = sp(n);
  return {
    skill: qr,
    skillLabel: "Ocultismo",
    roll: n,
    formula: ip(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: cp(n)
  };
}
async function op(e, t) {
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
  return ap(r);
}
function ap(e) {
  return zr(e) ? e : Array.isArray(e) ? e.find(zr) ?? null : null;
}
function zr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function ip(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function sp(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function cp(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(lp);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function lp(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function up(e) {
  switch (dp(e)) {
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
      return mp(String(e ?? ""));
  }
}
function dp(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function mp(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function fp(e) {
  return {
    header: {
      eyebrow: cn,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: bp(e.ritual)
    },
    forms: e.variantOptions.map((t) => pp(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: yp(e.automationStatus ?? "assisted")
  };
}
function pp(e, t) {
  const n = gp(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? hp(t) : "—",
    details: n
  };
}
function gp(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function hp(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function yp(e) {
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
function bp(e) {
  const t = e.system, n = [Ap(t?.element), _p(t?.circle)].filter(Rp);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function _p(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Ap(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (Tp(e)) {
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
      return $p(e);
  }
}
function Tp(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function $p(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function Rp(e) {
  return typeof e == "string" && e.length > 0;
}
const Ma = ["base", "discente", "verdadeiro"];
function Ba(e) {
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
  return typeof e == "string" && Ma.includes(e);
}
const { ApplicationV2: wp } = foundry.applications.api;
class Ee extends wp {
  constructor(t, n) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = fp(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    Cp(o, (a) => {
      this.selectedVariant = a;
    }), Ep(o, (a) => {
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
          ${this.model.forms.map(kp).join("")}
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
    const n = Dp(t), r = Ip(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function kp(e) {
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
function Cp(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => jr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), jr(e, o, t));
    });
  const r = Ua(e);
  r && t(r);
}
function jr(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !ot(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Ua(e));
}
function Ua(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && ot(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Ep(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function Ip(e, t, n) {
  const r = Sp(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function Sp(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (ot(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return ot(n) ? n : null;
}
function Dp(e) {
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
async function Lp(e) {
  return Ee.request(e);
}
const Sn = {
  label: "Padrão"
}, Pp = {
  label: "Discente",
  extraCost: 2
}, vp = {
  label: "Verdadeiro",
  extraCost: 5
};
class Np {
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
    const r = this.resolveCostPreview(t), o = wg(n), a = Tg(
      n,
      t.item,
      r,
      o
    ), s = await Lp({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((w) => w.name),
      cost: r,
      defaultSpendResource: Dg(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const c = Op(s), u = Cg(
      n,
      t.item,
      c.variant,
      o
    ), m = Fo();
    let f = null;
    if (m) {
      const w = await Fp(
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
        f = await rp(
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
    const _ = xp(
      n,
      c,
      u,
      r,
      {
        includeCostSteps: !m
      }
    );
    if (_.steps.length === 0) {
      const w = kg(
        t,
        c
      ), U = Hr(
        t.actor,
        f,
        u,
        r
      ), qn = Vr(
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
    const $ = T.value.context, g = Hp(
      n,
      t,
      $
    ), v = Bp(
      n,
      t
    ), be = Hr(
      t.actor,
      f,
      u,
      r
    ), _e = Vr(
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
    const Ae = [
      ...be,
      ...g.actions,
      ...v.actions
    ];
    return Ae.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: $,
      summaryLines: _e
    } : {
      status: "ready",
      workflowContext: $,
      actions: Ae,
      summaryLines: _e
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
function Op(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function xp(e, t, n, r, o) {
  const a = [], s = t.spendResource === !0;
  for (const c of e.steps)
    c.type === "modifyResource" || c.type === "chatCard" || Ln(c) && (!o.includeCostSteps || !s) || a.push(Mp(c, n));
  return o.includeCostSteps && s && r && Lg(n.extraCost) && a.push({
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
async function Fp(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Oe(o, r);
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
function Mp(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Hr(e, t, n, r) {
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
function Bp(e, t) {
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
      const s = Ca(a);
      n.push(
        Up(
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
function Up(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? jp(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: qp(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: zp(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function qp(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function zp(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function jp(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Hp(e, t, n) {
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
      if (Vp(a)) {
        Gp(
          o,
          u,
          Wp(a, n, s.value)
        );
        continue;
      }
      r.push(Yp(a, u, s.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...Kp(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function Vp(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Gp(e, t, n) {
  const r = Jp(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Wp(e, t, n) {
  const r = eg(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function Kp(e, t, n, r) {
  const o = og(e), a = o.length > 1 ? sg() : void 0;
  return o.map((s) => {
    const c = r.map(
      (m, f) => {
        const _ = ag(m.amount, s);
        return {
          id: Qp(m, s, f),
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
      label: Zp(u, s, o.length > 1),
      executedLabel: Xp(
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
function Yp(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = rg(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: tg(e, r, n),
    executedLabel: ng(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function Qp(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Zp(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Xp(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Jp(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function eg(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function tg(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function ng(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function rg(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function og(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function ag(e, t) {
  const n = e * t.multiplier, r = ig(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function ig(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function sg() {
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
function Vr(e, t, n, r, o, a, s = null) {
  return [
    `Forma: ${Ba(t.variant)}`,
    dg(t, n, r),
    ...ug(s),
    ...Object.values(o.rolls).flatMap(mg),
    ...cg(e, a),
    ...fg(e.resistance),
    ..._g(n)
  ];
}
function cg(e, t) {
  return lg(e) ? Dn("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function lg(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function ug(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function dg(e, t, n) {
  const r = Oe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function mg(e) {
  const n = [`${Ag(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = pg(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${up(e.damageType)}`), n;
}
function fg(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function pg(e) {
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
    const s = gg(a);
    s && (bg(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function gg(e) {
  const t = hg(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : yg(e);
}
function hg(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function yg(e) {
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
function bg(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function _g(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Ag(e) {
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
function Tg(e, t, n, r) {
  return Ma.map((o) => {
    const a = qa(
      e,
      t,
      o,
      r
    ), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? Ba(o),
      enabled: s,
      details: a ? $g(a, n, r) : [],
      finalCostText: a ? Rg(n, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function $g(e, t, n) {
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
function Rg(e, t) {
  const n = Oe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function wg(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Ln);
}
function kg(e, t) {
  return ka({
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
function Cg(e, t, n, r) {
  return qa(e, t, n, r) ?? Sn;
}
function qa(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? Ig(t, n) ? Eg(n) : null : n === "base" ? Sn : null);
}
function Eg(e) {
  switch (e) {
    case "base":
      return Sn;
    case "discente":
      return Pp;
    case "verdadeiro":
      return vp;
  }
}
function Ig(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Sg(foundry.utils.getProperty(e, n));
}
function Sg(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Dg(e) {
  return e.steps.some(Ln);
}
function Ln(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Lg(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Pg(e, t) {
  const n = await vg(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: Og(n),
    total: xg(n),
    diceBreakdown: Fg(n)
  };
}
function za(e) {
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
async function vg(e, t) {
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
  return Ng(r);
}
function Ng(e) {
  return Gr(e) ? e : Array.isArray(e) ? e.find(Gr) ?? null : null;
}
function Gr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Og(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function xg(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Fg(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Mg);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Mg(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const ja = "itemUsePrompts", Ha = "chatCard", yt = "data-paranormal-toolkit-prompt-id", bt = "data-paranormal-toolkit-pending-id", Pn = "data-paranormal-toolkit-executed-label", Xt = "data-paranormal-toolkit-choice-group", Va = "data-paranormal-toolkit-skipped-label", Wr = "data-paranormal-toolkit-action-section", Kr = "data-paranormal-toolkit-detail-key", Yr = "data-paranormal-toolkit-roll-card", vn = "data-paranormal-toolkit-roll-detail-toggle", Ga = "data-paranormal-toolkit-roll-detail-id", Wa = "data-paranormal-toolkit-resistance-roll-button", Ka = "data-paranormal-toolkit-resistance-skill", Ya = "data-paranormal-toolkit-resistance-skill-label", Qa = "data-paranormal-toolkit-resistance-target-actor-id", Za = "data-paranormal-toolkit-resistance-target-name", Xa = "data-paranormal-toolkit-resistance-roll-result", Qr = "data-paranormal-toolkit-system-card-replaced", Bg = `[${bt}]`, Ug = `[${vn}]`, qg = `[${Wa}]`, Jt = `${l}-chat-enrichment`, h = `${l}-item-use-prompt`, zg = `${h}__actions`, Zr = `${h}__details`, Ja = `${h}__summary`, jg = `${h}__title`, ei = `${h}__button--executed`, Xr = `${h}__roll-card`;
let Jr = !1, en = null;
const P = /* @__PURE__ */ new Map(), Hg = [0, 100, 500, 1500, 3e3], Vg = 3e4, Gg = [0, 100, 500, 1500, 3e3];
function Wg(e) {
  if (en = e, Jr) {
    to(e);
    return;
  }
  const t = (n, r) => {
    ni(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Jr = !0, to(e);
}
async function eo(e) {
  const t = ti(e);
  P.set(e.pendingId, t), await xn(t) || fi(t), ri(e.pendingId);
}
async function Kg(e) {
  const t = ti({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await xn(t) || fi(t), ri(e.pendingId);
}
async function vt(e, t) {
  const n = P.get(e);
  P.delete(e), n && await Wh(n, t);
}
function Nn(e) {
  const t = _i();
  for (const n of t) {
    const r = B(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Yg(e, t) {
  const n = Nn(e);
  if (!n) return;
  const r = B(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await ge(n.message, r));
}
async function Qg(e, t, n) {
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
  a && await ge(r.message, o);
}
function ti(e) {
  const t = G(e.context.message), n = e.context.targets.find((s) => on(s)), r = n ? on(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: $h(e.context),
    executed: !1
  };
}
function ni(e, t, n) {
  Gh();
  const r = At(t);
  if (!r) return;
  const o = jh(e, r);
  o.length > 0 && at(r);
  for (const a of o)
    tn(r, a);
  ii(r, n), nn(r), rn(r);
}
function to(e) {
  for (const t of Gg)
    globalThis.setTimeout(() => {
      Zg(e);
    }, t);
}
function Zg(e) {
  for (const t of Xg()) {
    const n = _t(t);
    Jg(n) && ni(n, t, e);
  }
}
function Xg() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Jg(e) {
  return e ? Fn(e) ? !0 : Yh(e).length > 0 : !1;
}
function ri(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? Hh(t.messageId) : null;
  if (n) {
    io(n, t), at(n), tn(n, t), no(n), nn(n), rn(n);
    return;
  }
  if (t.messageId) {
    sn(t);
    return;
  }
  const r = Vh(t);
  if (r) {
    io(r, t), at(r), tn(r, t), no(r), nn(r), rn(r);
    return;
  }
  sn(t);
}
function no(e) {
  en && ii(e, en);
}
function at(e) {
  const t = eh();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = ai(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Qr) === "true") return;
  const r = n.querySelector(`.${Jt}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Qr, "true");
}
function eh() {
  try {
    return Ss() === "replace";
  } catch {
    return !1;
  }
}
function tn(e, t) {
  if (at(e), e.querySelector(`[${yt}="${he(t.pendingId)}"]`)) return;
  const n = th(e, t);
  rh(n, t), yh(n, bh(t)).append(Th(t));
}
function th(e, t) {
  const n = e.querySelector(`.${Jt}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Jt, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(jg), s.textContent = nh(t);
  const c = document.createElement("span");
  return c.classList.add(Ja), c.textContent = t.summary, o.append(a, s, c), r.append(o), wh(e).append(r), r;
}
function nh(e) {
  const t = E(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function rh(e, t) {
  const n = t.summaryLines ?? [], r = di(n, t);
  if (r) {
    oh(e, r, t);
    return;
  }
  _h(e, n);
}
function oh(e, t, n) {
  if (e.querySelector(`[${Yr}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Xr, `${Xr}--${t.intent}`), r.setAttribute(Yr, "true"), t.castingCheck && ro(r, ih(t.castingCheck), n.pendingId, "casting"), ah(t) && ro(r, sh(t), n.pendingId, "effect"), mh(r, t), fh(r, t, n), hh(r, t), e.append(r);
}
function ah(e) {
  return e.intent !== "casting";
}
function ih(e) {
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
function sh(e) {
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
function ro(e, t, n, r) {
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
  ch(o, t), gh(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function ch(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = lh(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function lh(e, t) {
  const n = uh(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of dh(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function uh(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function dh(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? oo(e, "highest") : n.includes("kl") ? oo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function oo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function mh(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(fy);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function fh(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = ph(t, n);
  o.append(a), s && o.append(s);
  const c = document.createElement("span");
  c.classList.add(`${h}__resistance-description`), c.textContent = t.resistance, r.append(o, c), t.resistanceRollResult && r.append(oi(t.resistanceRollResult)), e.append(r);
}
function ph(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(yt, t.pendingId), n.setAttribute(Wa, "true"), n.setAttribute(Ka, e.resistanceSkill), n.setAttribute(Ya, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Qa, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Za, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Xa, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function oi(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = ci(e), t;
}
function gh(e, t, n, r, o) {
  const a = t.filter((m) => m.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${n}-roll-details-${r}`, c = document.createElement("button");
  c.type = "button", c.classList.add(`${h}__roll-detail-toggle`), c.setAttribute(vn, s), c.setAttribute("aria-expanded", "false"), c.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(Ga, s), u.hidden = !0;
  for (const m of a) {
    const f = document.createElement("dt");
    f.textContent = m.label;
    const _ = document.createElement("dd");
    _.textContent = m.value, u.append(f, _);
  }
  e.append(c, u);
}
function hh(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function yh(e, t) {
  const n = `[${Wr}="${he(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(zg), o.setAttribute(Wr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function bh(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = di(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function _h(e, t) {
  if (t.length === 0) return;
  const n = Ah(e);
  for (const r of t) {
    const o = py(r);
    if (n.querySelector(`[${Kr}="${he(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(Kr, o), n.append(a);
  }
}
function Ah(e) {
  const t = e.querySelector(`.${Zr}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Zr), e.append(n), n;
}
function Th(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(yt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(ei), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(bt, e.pendingId), t.setAttribute(Pn, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Xt, e.choiceGroupId), t.setAttribute(Va, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function $h(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Rh(e);
  return `${t} → ${n}`;
}
function Rh(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function wh(e) {
  return ai(e) ?? e;
}
function ai(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function ii(e, t) {
  const n = At(e);
  if (!n) return;
  const r = n.querySelectorAll(Bg);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Mh(o, t);
    }));
}
function nn(e) {
  const t = At(e);
  if (!t) return;
  const n = t.querySelectorAll(Ug);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      kh(t, r);
    }));
}
function rn(e) {
  const t = At(e);
  if (!t) return;
  const n = t.querySelectorAll(qg);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Ch(t, r);
    }));
}
function kh(e, t) {
  const n = t.getAttribute(vn);
  if (!n) return;
  const r = e.querySelector(`[${Ga}="${he(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Ch(e, t) {
  const n = t.getAttribute(yt), r = t.getAttribute(Ka), o = t.getAttribute(Ya) ?? (r ? za(r) : "Resistência");
  if (!n || !r) return;
  const a = Sh(e, n), s = Dh(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Pg(s, r);
    await Oh(u.roll);
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
    Eh(t, m), Ih(t, m), xh(n, m), await Fh(e, n, m);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1;
  }
}
function Eh(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Xa, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Ih(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? oi(t);
  if (r) {
    r.textContent = ci(t);
    return;
  }
  n.append(o);
}
function Sh(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = _t(e);
  return B(r)[t] ?? null;
}
function Dh(e, t) {
  const n = e?.resistanceTargetActor;
  if (x(n)) return n;
  const o = e?.context?.targets.map(on).find(x) ?? null;
  if (o) return o;
  const a = t.getAttribute(Qa) ?? e?.resistanceTargetActorId ?? null, s = a ? Ph(a) : null;
  return s || vh(
    t.getAttribute(Za) ?? e?.resistanceTargetName ?? Lh(t)
  );
}
function Lh(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Ja}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function on(e) {
  const t = e.actor;
  if (x(t)) return t;
  const n = e.token, r = Le(n);
  if (r) return r;
  const o = e.document;
  return Le(o);
}
function Le(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (x(t)) return t;
  const n = e.document?.actor;
  return x(n) ? n : null;
}
function Ph(e) {
  const n = game.actors?.get?.(e);
  return x(n) ? n : si().map((a) => Le(a)).find((a) => a?.id === e) ?? null;
}
function vh(e) {
  const t = le(e);
  if (!t) return null;
  const n = si().filter((a) => le(Nh(a)) === t).map((a) => Le(a)).find(x) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => x(a) && le(a.name) === t);
  return x(o) ? o : null;
}
function si() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Nh(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Le(e)?.name ?? null;
}
function le(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function x(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ci(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Oh(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function xh(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function Fh(e, t, n) {
  const r = _t(e);
  if (r)
    try {
      const o = B(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await ge(r, o);
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
async function Mh(e, t) {
  const n = e.getAttribute(bt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    li(e, e.getAttribute(Pn) ?? "✓ Automação aplicada"), Bh(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function li(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(ei), e.removeAttribute(bt), e.removeAttribute(Pn);
}
function Bh(e) {
  const t = e.getAttribute(Xt);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Xt}="${he(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(Va) ?? "✓ Outra opção escolhida";
    li(o, a);
  }
}
function di(e, t) {
  const n = e.map(On).filter(dy), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = E(e, "Forma"), a = E(e, "Custo"), s = E(e, "Dados") ?? E(e, `Dados (${r.label})`), c = E(e, "Tipo"), u = E(e, "Resistência"), m = E(e, "Resistência Perícia"), f = E(e, "Resistência Rótulo") ?? (m ? za(m) : null), _ = mi(e, "Observação"), T = e.filter((g) => zh(g, r)), $ = Uh(e);
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
function Uh(e) {
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
    intent: qh(n)
  } : null;
}
function qh(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function E(e, t) {
  return mi(e, t)[0] ?? null;
}
function mi(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function zh(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || On(e) ? !1 : e.trim().length > 0;
}
function jh(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    an(r, e, t) && n.set(r.pendingId, r);
  for (const r of Kh(e))
    an(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function an(e, t, n) {
  const r = G(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !ao(n, "itemId", e.itemId) ? !1 : !e.actorId || ao(n, "actorId", e.actorId);
}
function ao(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${gy(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Hh(e) {
  const t = he(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Vh(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (an(e, null, t))
      return t;
  return null;
}
function Gh() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function io(e, t) {
  const n = _t(e);
  if (!n) return !1;
  try {
    const r = B(n);
    return r[t.pendingId] = Mn(t, G(n)), await ge(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function xn(e) {
  const t = hi(e);
  if (!t) return !1;
  try {
    const n = B(t);
    return n[e.pendingId] = Mn(e, G(t)), await ge(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function fi(e) {
  for (const t of Hg)
    globalThis.setTimeout(() => {
      sn(e);
    }, t);
}
async function sn(e) {
  const t = hi(e);
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
async function Wh(e, t) {
  const n = gi(e.context.message);
  if (n)
    try {
      const r = B(n), o = r[e.pendingId] ?? Mn(e, G(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await ge(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function Kh(e) {
  return Object.values(B(M(e))).filter(xe);
}
function B(e) {
  if (!e) return {};
  const t = {}, n = Fn(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(pi(e)))
    t[r] ??= o;
  return t;
}
function Yh(e) {
  return Object.values(pi(M(e))).filter(xe);
}
function pi(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, ja);
  if (!me(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    xe(o) && (n[r] = o);
  return n;
}
async function ge(e, t) {
  typeof e.setFlag == "function" && (await Zh(e, t), await Qh(e, t));
}
async function Qh(e, t) {
  await Promise.resolve(e.setFlag?.(l, ja, t));
}
function Fn(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, Ha);
  return ly(t) ? t : null;
}
async function Zh(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(xe).sort((a, s) => a.createdAt - s.createdAt);
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
      actorName: Xh(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(l, Ha, o));
}
function Xh(e) {
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
function gi(e) {
  const t = M(e);
  if (t?.setFlag)
    return t;
  const n = Jh(e);
  if (n?.setFlag)
    return n;
  const r = G(e);
  if (!r) return null;
  const o = game.messages;
  return M(o?.get?.(r));
}
function Jh(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(M).find((n) => typeof n?.setFlag == "function") ?? null;
}
function hi(e) {
  const t = gi(e.context.message);
  if (t) return t;
  const n = e.messageId ? ey(e.messageId) : null;
  if (n) return n;
  const r = _i().slice().reverse();
  return r.find((o) => ty(o, e)) ?? r.find((o) => ny(o, e)) ?? null;
}
function ey(e) {
  const t = game.messages;
  return M(t?.get?.(e));
}
function ty(e, t) {
  const n = G(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!yi(e, t)) return !1;
  const o = bi(e);
  return !t.actorId || !o || o === t.actorId;
}
function ny(e, t) {
  if (!oy(e, t)) return !1;
  const n = bi(e);
  return t.actorId && n === t.actorId ? !0 : yi(e, t);
}
function yi(e, t) {
  const n = le(ry(e));
  if (!n) return !1;
  const r = le(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = le(t.itemId);
  return !!(o && n.includes(o));
}
function ry(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function bi(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function oy(e, t) {
  const n = ay(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Vg;
}
function ay(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function M(e) {
  return e && typeof e == "object" ? e : null;
}
function xe(e) {
  return me(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && Z(e.resistanceTargetActorId) && Z(e.resistanceTargetName) && uy(e.resistanceRollResult) && iy(e.actionPayload) && Nt(e.title) && Nt(e.buttonLabel) && Nt(e.executedLabel) && Z(e.choiceGroupId) && Z(e.skippedLabel) && Z(e.actionSectionId) && Z(e.actionSectionTitle) && my(e.summaryLines) : !1;
}
function iy(e) {
  return e == null ? !0 : me(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && sy(e.resource) && cy(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function sy(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function cy(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function ly(e) {
  return me(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && me(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(xe) : !1;
}
function uy(e) {
  return e == null ? !0 : me(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function dy(e) {
  return e !== null;
}
function me(e) {
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
function my(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function fy(e) {
  return typeof e == "string" && e.length > 0;
}
function _i() {
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
function py(e) {
  return e.trim().toLowerCase();
}
function gy(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function he(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const so = 1e3;
class hy {
  constructor(t, n, r, o, a, s) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = s, this.ritualAssistant = new Np(
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
    const r = ln(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && wy(t.item) && n.executionMode === "ask") {
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
    if (await Br(t), !t.actor) {
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
    const r = n.prompt.actionPayload, o = Ey(r);
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
    return a.ok ? (await Yg(t), await Qg(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Wg(
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
    if (await Br(t), !t.actor) {
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
      ky(t.item)
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
      return o.ok ? (Ry(n, o.value), await yy(o.value), {
        ok: !0,
        executedLabel: by(o.value)
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
        lo(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Mt();
    await Kg({
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
      }), await eo({
        pendingId: c,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Ot(s),
        skippedLabel: lo(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: Cy(s)
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
    }), await eo({
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
    const n = Date.now(), r = uo(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      n - s > so && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= so;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(uo(t), Date.now());
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
async function yy(e) {
  const t = $y();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: _y(e)
      });
    } catch (n) {
      d.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function by(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function _y(e) {
  const t = e.instances.map((s) => {
    const c = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Ye(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${c}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = Ay(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Ye(e.conditions.join(", "))}</li>` : "";
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
function Ay(e) {
  const t = Ty(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Ye(o)}</li>`;
}
function Ty(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = co(n?.value);
  return r === null ? null : {
    value: r,
    max: co(n?.max)
  };
}
function co(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function $y() {
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
function Ot(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function lo(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function Ry(e, t) {
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
function wy(e) {
  return e.type === "ritual";
}
function ky(e) {
  return Vf(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Cy(e) {
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
function Ey(e) {
  const t = e.actorUuid ? Iy(e.actorUuid) : null;
  if (fe(t)) return t;
  const n = e.actorId ? Sy(e.actorId) : null;
  return n || Dy(e.actorName);
}
function Iy(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Sy(e) {
  const n = game.actors?.get?.(e);
  if (fe(n)) return n;
  for (const r of Ai()) {
    const o = Bn(r);
    if (o?.id === e) return o;
  }
  return null;
}
function Dy(e) {
  const t = xt(e);
  if (!t) return null;
  for (const o of Ai()) {
    const a = Ly(o);
    if (xt(a) === t) {
      const s = Bn(o);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (o) => fe(o) && xt(o.name) === t
  );
  return fe(r) ? r : null;
}
function Ai() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ly(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Bn(e)?.name ?? null;
}
function Bn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (fe(t)) return t;
  const n = e.document?.actor;
  return fe(n) ? n : null;
}
function xt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function fe(e) {
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
function uo(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Mt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Py {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = ve(t);
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
class vy {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = ve(t).map((c) => this.analyzeRitual(c)), r = n.filter(Ve("upToDate")), o = n.filter(Ve("available")), a = n.filter(Ve("outdated")), s = n.filter(Ve("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = Ny(t);
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
      reason: Oy(r, n.preset)
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
    preset: e.match ? ct(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function Ny(e) {
  const t = e.getFlag(l, "automation");
  return un(t) ? t : null;
}
function Oy(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Ve(e) {
  return (t) => t.status === e;
}
class xy {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = mn(t.transaction);
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
    const n = A(t.actorName), r = A(t.resource), o = A(mo(t)), a = A(My(t));
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
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(Fy(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), m = t.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(By(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), _ = t.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(mo(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
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
function Fy(e) {
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
function mo(e) {
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
function My(e) {
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
function By(e) {
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
function Uy() {
  const e = new Xu(), t = new Wd(e), n = new Wu(), r = new td(), o = new od(r), a = new bd(e), s = new Ad(), c = s.registerMany(
    ss()
  );
  if (!c.ok)
    throw new Error(c.error.message);
  const u = new _d(), m = new hd(), f = $f(), _ = new mm(f), T = new vy(
    s
  ), $ = new Py(
    T,
    u,
    m
  ), g = new Zd(), v = new xy(g), be = new Qd(), _e = new Vd(
    t,
    o,
    v,
    be
  ), Ae = new Yd(_e, be), w = new hy(
    Ae,
    t,
    o,
    n,
    _,
    g
  );
  return w.addStrategy(
    new pd(
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
    workflowHooks: be,
    automation: _e,
    workflow: Ae,
    itemUseIntegration: w,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: $
  };
}
const { ApplicationV2: qy } = foundry.applications.api;
class it extends qy {
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${N(cn)}</p>
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
      ${n.length > 0 ? zy(n) : Hy(t)}
    </section>
  `;
}
function zy(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(jy).join("")}</ol>`;
}
function jy(e) {
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
function Hy(e) {
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
const st = `${l}.manageRitualPresets`, fo = `__${l}_ritualPresetHeaderControlRegistered`, Vy = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Gy(e) {
  const t = globalThis;
  if (!t[fo]) {
    for (const n of Vy)
      Hooks.on(n, (r, o) => {
        Wy(r, o, e);
      });
    t[fo] = !0, d.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Wy(e, t, n) {
  Array.isArray(t) && Yy(e) && (Ky(e, n), !t.some((r) => r.action === st) && t.push({
    action: st,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Ti(e, n);
    }
  }));
}
function Ky(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[st] && (e.options.actions[st] = (n) => {
    n.preventDefault(), n.stopPropagation(), Ti(e, t);
  }));
}
function Yy(e) {
  if (!game.user?.isGM) return !1;
  const t = $i(e);
  return t ? t.type === "agent" && ve(t).length > 0 : !1;
}
function Ti(e, t) {
  const n = $i(e);
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
function $i(e) {
  return po(e.actor) ? e.actor : po(e.document) ? e.document : null;
}
function po(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Ri = "data-paranormal-toolkit-ritual-roll-config", Fe = "data-paranormal-toolkit-ritual-roll-field", te = "data-paranormal-toolkit-ritual-roll-action", go = `__${l}_ritualRollConfigBlockRegistered`, Qy = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], Zy = [
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
function Xy() {
  const e = globalThis;
  if (!e[go]) {
    Jy();
    for (const t of Qy)
      Hooks.on(t, (...n) => {
        eb(n[0], n[1]);
      });
    e[go] = !0, d.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function Jy() {
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
function eb(e, t) {
  const n = pb(e);
  if (!n || n.type !== "ritual") return;
  const r = yb(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  nb(o);
  const a = ki(n), s = xa(n), c = gb(n), u = rb(n, s, a, c);
  lb(u, n, a, c), tb(o, u), Un(u);
}
function tb(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function nb(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Ri}]`)))
    t.remove();
}
function rb(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${l}-ritual-roll-config`), o.setAttribute(Ri, e.uuid ?? e.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${l}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${l}-ritual-roll-config__title`), s.append(ho("strong", "Paranormal Toolkit")), s.append(ho("span", "Fórmula de rolagem"));
  const c = document.createElement("span");
  c.classList.add(`${l}-ritual-roll-config__badge`), c.textContent = Ei(t) ? "Configurada" : "Rascunho", a.append(s, c), o.append(a);
  const u = document.createElement("p");
  u.classList.add(`${l}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const m = document.createElement("div");
  m.classList.add(`${l}-ritual-roll-config__fields`), m.append(ob(t, r)), m.append(ab(t, r)), m.append(ib(t, r)), o.append(m), o.append(sb(t, n, r)), o.append(cb(r));
  const f = document.createElement("p");
  return f.classList.add(`${l}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function ob(e, t) {
  const n = Tt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Fe, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = Hf(o), a.selected = e.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function ab(e, t) {
  const n = Tt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Fe, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const a of Zy) {
    const s = document.createElement("option");
    s.value = a.value, s.textContent = a.label, s.selected = e.damageType === a.value, r.append(s);
  }
  return n.append(r), n;
}
function ib(e, t) {
  const n = Tt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Fe, "utilityLabel"), n.append(r), n;
}
function sb(e, t, n) {
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
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !o || !r, s.setAttribute(Fe, `formula.${e}`), a.append(s), !r) {
    const c = document.createElement("small");
    c.textContent = "Indisponível neste ritual.", a.append(c);
  }
  return a;
}
function cb(e) {
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
function ho(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function lb(e, t, n, r) {
  ye(e, "intent")?.addEventListener("change", () => Un(e)), _o(e, "system.studentForm")?.addEventListener("change", () => yo(e, t)), _o(e, "system.trueForm")?.addEventListener("change", () => yo(e, t)), e.querySelector(`[${te}="save"]`)?.addEventListener("click", () => {
    r && ub(e, t, n);
  }), e.querySelector(`[${te}="clear"]`)?.addEventListener("click", () => {
    r && db(e, t);
  });
}
async function ub(e, t, n) {
  const r = e.querySelector(`[${te}="save"]`);
  r?.setAttribute("disabled", "true"), ue(e, "Salvando configuração...");
  try {
    const o = mb(e, n);
    await zf(t, o), wi(e, o), ue(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), ue(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function db(e, t) {
  const n = e.querySelector(`[${te}="clear"]`);
  n?.setAttribute("disabled", "true"), ue(e, "Limpando configuração...");
  try {
    await jf(t);
    const r = xa(t);
    fb(e, r), wi(e, r), ue(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), ue(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function wi(e, t) {
  const n = e.querySelector(`.${l}-ritual-roll-config__badge`);
  n && (n.textContent = Ei(t) ? "Configurada" : "Rascunho");
}
function mb(e, t) {
  return {
    schemaVersion: 1,
    intent: Ci(ye(e, "intent")?.value),
    damageType: Ao(e, "damageType"),
    utilityLabel: Ao(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: Qe(e, "formula.base") },
      discente: { formula: Qe(e, "formula.discente") },
      verdadeiro: { formula: Qe(e, "formula.verdadeiro") }
    }
  };
}
function fb(e, t) {
  oe(e, "intent", t.intent), oe(e, "damageType", t.damageType ?? ""), oe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), oe(e, "formula.base", t.forms.base.formula), oe(e, "formula.discente", t.forms.discente.formula), oe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Un(e);
}
function Un(e) {
  const t = Ci(ye(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function yo(e, t) {
  const n = ki(t);
  bo(e, "discente", n.discente), bo(e, "verdadeiro", n.verdadeiro);
}
function bo(e, t, n) {
  const r = ye(e, `formula.${t}`);
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
function ue(e, t) {
  const n = e.querySelector(`.${l}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function ki(e) {
  const t = hb(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function pb(e) {
  return To(e.item) ? e.item : To(e.document) ? e.document : null;
}
function gb(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function hb(e) {
  const t = e.system;
  return bb(t) ? t : {};
}
function _o(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ye(e, t) {
  return e.querySelector(`[${Fe}="${_b(t)}"]`);
}
function Qe(e, t) {
  return ye(e, t)?.value.trim() ?? "";
}
function Ao(e, t) {
  const n = Qe(e, t);
  return n.length > 0 ? n : null;
}
function oe(e, t, n) {
  const r = ye(e, t);
  r && (r.value = n);
}
function Ci(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Ei(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function yb(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function To(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function bb(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function _b(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let J = null;
Hooks.once("init", () => {
  os(), Is(), cc(), Su(), d.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Zn.isSupportedSystem()) {
    d.warn(
      `Sistema não suportado: ${Zn.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  J = Uy(), J.itemUseIntegration.registerStrategies(), oc(J.conditions), qs(J), Xs(), Ks(), Ou(), Gy(J), Xy(), d.info("Inicializado para o sistema Ordem Paranormal."), d.info(
    `API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${cn} inicializado.`);
});
function Ab() {
  if (!J)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return J;
}
export {
  Ab as getToolkitServices
};
//# sourceMappingURL=main.js.map
