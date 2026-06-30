const l = "paranormal-toolkit", Vt = "Paranormal Toolkit", La = "ordemparanormal";
class _e {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Ze(e) {
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
function Gt(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Wt(t) ? y(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Na(e) {
  return Wt(e.getFlag(l, "automation"));
}
function Wt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Oa(t.source) && va(t.definition);
}
function va(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && k(t.label) && Array.isArray(t.steps) && t.steps.every(Fa) && (t.conditionApplications === void 0 || ja(t.conditionApplications));
}
function Oa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? k(t.presetId) && k(t.presetVersion) && k(t.appliedAt) : t.type === "manual" ? k(t.label) && k(t.appliedAt) : !1;
}
function Fa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Ma(t);
    case "spendRitualCost":
      return xa(t);
    case "rollFormula":
      return Ba(t);
    case "modifyResource":
      return Ua(t);
    case "chatCard":
      return qa(t);
    default:
      return !1;
  }
}
function Ma(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Hr(t);
}
function xa(e) {
  return e.type === "spendRitualCost";
}
function Ba(e) {
  const t = e;
  return t.type === "rollFormula" && k(t.id) && k(t.formula) && (t.intent === void 0 || Ka(t.intent)) && (t.damageType === void 0 || k(t.damageType));
}
function Ua(e) {
  const t = e;
  return t.type === "modifyResource" && Vr(t.actor) && Ga(t.resource) && Wa(t.operation) && Hr(t) && (t.damageType === void 0 || t.damageType === null || k(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function qa(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function ja(e) {
  return Array.isArray(e) && e.every(za);
}
function za(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return k(t.id) && Vr(t.actor) && k(t.conditionId) && (t.label === void 0 || k(t.label)) && (t.duration === void 0 || t.duration === null || Ha(t.duration)) && (t.source === void 0 || k(t.source)) && (t.actionSectionId === void 0 || k(t.actionSectionId)) && (t.actionSectionTitle === void 0 || k(t.actionSectionTitle)) && (t.executedLabel === void 0 || k(t.executedLabel));
}
function Ha(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Ya(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Va(t.expiry));
}
function Va(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Hr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || k(e.amountFrom);
}
function Vr(e) {
  return e === "self" || e === "target";
}
function Ga(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Wa(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Ka(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Ya(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function k(e) {
  return typeof e == "string" && e.length > 0;
}
function Kt(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Rn);
    if (Xa(t))
      return Array.from(t).filter(Rn);
  }
  return [];
}
function Qa(e) {
  return Kt(e)[0] ?? null;
}
function Za(e) {
  return Kt(e).find(Na) ?? null;
}
function Xa(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Rn(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ee(e) {
  return Kt(e).filter((t) => t.type === "ritual");
}
function Gr(e) {
  return Ee(e)[0] ?? null;
}
function Ja(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Ze);
      return d.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Ae("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Le(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(kn);
      return d.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Ae("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Le(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await $t(e, r, o.value);
      d.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Ae("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Le(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        d.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await $t(e, n, r.preset);
      d.info(`Melhor preset aplicado em ${n.name}.`, { match: kn(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Tn(e);
    },
    async applyBestPresetsToActorRituals() {
      return Tn(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Ae("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Le(t);
      n && (await e.automationBinder.clear(n), d.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Tn(e) {
  const t = Ae("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Ee(t);
  if (n.length === 0)
    return d.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Cn(t);
  const r = Cn(t, n.length);
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
    const i = await $t(e, o, a.preset);
    r.applied.push(ei(o, a, i));
  }
  return d.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), ti(r), r;
}
async function $t(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function ei(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Ze(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Cn(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function ti(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function kn(e) {
  return {
    preset: Ze(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Ae(e) {
  const t = _e.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Le(e) {
  const t = Gr(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function J(e) {
  return e ? {
    id: e.id,
    source: {
      ...ni(e.sourceActor),
      token: e.sourceToken
    },
    item: ri(e.item),
    targets: e.targets.map(oi),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: In(e.rollRequests, Wr),
    rolls: In(e.rolls, ai),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Yt),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Yt(e) {
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
function ni(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function ri(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function oi(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Wr(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ai(e) {
  return {
    ...Wr(e),
    total: e.total
  };
}
function In(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function ii(e) {
  return {
    getSelected() {
      return _e.getSelectedActor();
    },
    logResources() {
      const t = V(
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
        V("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await ne(
        e,
        "Gasto de PD",
        V("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await ne(
        e,
        "Dano em PV",
        V("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await ne(
        e,
        "Cura de PV",
        V("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await ne(
        e,
        "Dano em SAN",
        V("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await ne(
        e,
        "Recuperação de SAN",
        V("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function ne(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    si(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (i) {
    d.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  d.info(`${t} realizado:`, Yt(a));
}
function V(e) {
  const t = _e.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function si(e) {
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
const v = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function li() {
  Ne(v.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Ne(v.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Ne(v.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Ne(v.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function _t() {
  return {
    enabled: ve(v.enabled),
    console: ve(v.console),
    ui: ve(v.ui),
    chat: ve(v.chat)
  };
}
async function q(e, t) {
  await game.settings.set(l, v[e], t);
}
function Ne(e, t) {
  game.settings.register(l, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function ve(e) {
  return game.settings.get(l, e) === !0;
}
function ci() {
  return {
    status() {
      return _t();
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
const Kr = "ritual.costOnly", Yr = "ritual.simpleHealing", di = "ritual.eletrocussao", Qr = "ritual.simpleDamage", Zr = "generic.simpleHealing", Xr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function mi() {
  return [
    fi(),
    pi(),
    gi(),
    hi(),
    yi()
  ];
}
function fi() {
  return {
    id: Kr,
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
function pi() {
  return {
    id: Yr,
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
    automation: Jr(),
    itemPatch: Ai()
  };
}
function gi() {
  return {
    id: di,
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
    automation: bi(),
    itemPatch: Ri()
  };
}
function hi() {
  return {
    id: Qr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Qt()
  };
}
function yi() {
  return {
    id: Zr,
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
function Jr(e = "2d8+2") {
  return eo(
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
function bi() {
  return {
    ...Qt("3d6", {
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
function Qt(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return eo(
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
function Ai() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Xr,
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
function Ri() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Xr,
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
function eo(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Zt() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: re(t.id),
    actorId: re(t.actor?.id),
    sceneId: re(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function to() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: re(e.id),
    actorId: re(t?.id),
    sceneId: re(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function re(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ti(e) {
  return {
    logFirstRitualCost() {
      const t = G("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = W(t);
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
      const r = G("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = W(r);
      if (o) {
        if (!Ii(t, n)) {
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
      const t = G("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = W(t);
      n && (await n.unsetFlag(l, "ritual.cost"), d.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = G("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = W(t);
      if (!n) return;
      const r = e.automationRegistry.require(Kr);
      if (!r.ok) {
        d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), d.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = G("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = W(n);
      if (!r) return;
      if (!wn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Yr);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Jr(t)
      }), d.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = G("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = W(n);
      if (!r) return;
      if (!wn(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Qr);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Qt(t)
      }), d.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = G("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = W(t);
      n && await Ci(e, t, n);
    }
  };
}
async function Ci(e, t, n) {
  const r = Gt(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: to(),
    item: n,
    targets: Zt()
  });
  if (!o.ok) {
    ki(o.error);
    return;
  }
  d.info("Automação de ritual executada com sucesso.", J(o.value.context));
}
function ki(e) {
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
function G(e) {
  const t = _e.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function W(e) {
  const t = Gr(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ii(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function wn(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const wi = ["disabled", "ask", "automatic"], $i = ["buttons", "confirm"], no = "ask";
function _i(e) {
  return typeof e == "string" && wi.includes(e);
}
function Ei(e) {
  return typeof e == "string" && $i.includes(e);
}
function Si(e) {
  return _i(e) ? e : Ei(e) ? "ask" : no;
}
const Di = ["keep", "replace"], ro = "keep", Pi = !0, O = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Li() {
  game.settings.register(l, O.executionMode, {
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
    default: no
  }), game.settings.register(l, O.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: ro
  }), game.settings.register(l, O.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Pi
  }), game.settings.register(l, O.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function $n() {
  const e = Si(game.settings.get(l, O.executionMode)), t = ao(game.settings.get(l, O.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: oo()
  };
}
function Ni() {
  return ao(game.settings.get(l, O.systemCardMode));
}
function oo() {
  return game.settings.get(l, O.ritualCastingCheckEnabled) === !0;
}
async function K(e) {
  await game.settings.set(l, O.executionMode, e);
}
function ao(e) {
  return Di.includes(e) ? e : ro;
}
function vi(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await K("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await K("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await K(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await K("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await K("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await K("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await K("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Oi = [
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
function Fi(e) {
  return {
    phases() {
      return Oi;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = st("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Za(t);
      if (!n) {
        d.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await _n(e, t, n);
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
      if (!Bi(n)) {
        d.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = xi(n) ?? st("Nenhum ator encontrado para executar automação do item.");
      r && await _n(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = st("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Qa(t);
      if (!n) {
        d.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Zr);
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
async function _n(e, t, n) {
  const r = Gt(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: to(),
    item: n,
    targets: Zt()
  });
  if (!o.ok) {
    Mi(o.error);
    return;
  }
  d.info("Automação executada com sucesso.", J(o.value.context));
}
function Mi(e) {
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
function st(e) {
  const t = _e.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function xi(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Bi(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ui(e) {
  const t = ii(e), n = Ja(e), r = Ti(e), o = Fi(e), a = ci(), i = vi(e);
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
function qi(e) {
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
      const r = En();
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
      return ji(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = En();
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
      return zi(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function En() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function ji(e) {
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
function zi(e) {
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
function Hi(e) {
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
    conditions: qi(e.conditions),
    debug: Ui(e)
  }, n = globalThis;
  return n[l] = t, n.ParanormalToolkit = t, t;
}
class Sn {
  static isSupportedSystem() {
    return game.system.id === La;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Vi() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: oe(t.id),
    actorId: oe(t.actor?.id),
    sceneId: oe(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function io() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: oe(e.id),
    actorId: oe(t?.id),
    sceneId: oe(e.scene?.id),
    name: n
  };
}
function Gi(e, t = io()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Wi(e) {
  if (!Qi(e)) return null;
  const t = e.getFlag(l, "workflow");
  return Yi(t) ? t : null;
}
function Ki() {
  return `flags.${l}.workflow`;
}
function Dn(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${l}`), n = foundry.utils.getProperty(e, `_source.flags.${l}`);
  return t !== void 0 || n !== void 0;
}
function Pn(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Et(t) || Et(n);
}
function Yi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Qi(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function oe(e) {
  return Et(e) ? e : null;
}
function Et(e) {
  return typeof e == "string" && e.length > 0;
}
function Zi() {
  const e = (t, n) => {
    Xi(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Xi(e, t) {
  const n = Wi(e);
  if (!n || n.targets.length === 0) return;
  const r = es(t);
  if (!r || r.querySelector(`.${l}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Ji(n));
}
function Ji(e) {
  const t = document.createElement("section");
  t.classList.add(`${l}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Ln("Origem", e.source.name)), t.append(Ln("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Ln(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${l}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function es(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function ts() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!ns(r) || !rs(e) || Dn(e) || Dn(t)) return;
    const o = Vi();
    if (o.length === 0 || !Pn(e) && !Pn(t)) return;
    const a = io();
    e.updateSource({
      [Ki()]: Gi(o, a)
    }), d.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function ns(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function rs(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let Nn = !1, lt = !1, ct = !1, Oe = null;
const os = 1e3, as = 750, is = 1e3;
function ss(e) {
  Nn || (Hooks.on("combatTurnChange", (t) => {
    cs(e, vn(t));
  }), Hooks.on("deleteCombat", (t) => {
    us(e, vn(t));
  }), Nn = !0, ls(e));
}
function ls(e) {
  Xe() && (lt || (lt = !0, globalThis.setTimeout(() => {
    lt = !1, Xt(e, "ready");
  }, os)));
}
function cs(e, t) {
  Xe() && t && (Oe && globalThis.clearTimeout(Oe), Oe = globalThis.setTimeout(() => {
    Oe = null, Xt(e, "combat-turn-change", t);
  }, as));
}
function us(e, t) {
  Xe() && t && (ct || (ct = !0, globalThis.setTimeout(() => {
    ct = !1, Xt(e, "combat-deleted", t);
  }, is)));
}
async function Xt(e, t, n) {
  if (Xe())
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
function Xe() {
  return game.user?.isGM === !0;
}
function vn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const so = {
  enabled: "dice.animations.enabled"
};
function ds() {
  game.settings.register(l, so.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function ms() {
  return {
    enabled: game.settings.get(l, so.enabled) === !0
  };
}
const fs = "chatCard", On = "data-paranormal-toolkit-prompt-id", c = `${l}-item-use-prompt`, ps = `.${c}__title`, lo = `.${c}__header`, gs = `.${c}__roll-card`, hs = `.${c}__roll-meta`, ys = `.${c}__roll-meta-pill`, bs = `.${c}__resistance`, As = `.${c}__resistance-header`, co = `.${c}__resistance-description`, Rs = `.${c}__resistance-roll-button`, Ts = `.${c}__resistance-roll-result`, Fn = `${c}__resistance-content`, uo = `.${c}__workflow-section`, mo = `.${c}__workflow-roll`, fo = `${c}__workflow-roll--dice-open`, po = `.${c}__workflow-roll-formula`, go = `${c}__workflow-roll-formula--toggle`, Jt = `.${c}__workflow-dice-tray`, Cs = `.${c}__roll-detail-toggle`, ks = `.${c}__roll-detail-list`, Is = `.${c}__ritual-element-badge`, ws = `.${c}__ritual-metadata`, $s = "casting-backlash", _s = "data-paranormal-toolkit-action-section", Es = "data-paranormal-toolkit-prompt-id", Ss = "data-paranormal-toolkit-pending-id", Mn = "data-paranormal-toolkit-casting-backlash-enhanced", xn = `.${c}`, Ds = `.${c}__workflow-section--casting`, Ps = `.${c}__workflow-section-header`, Ls = `.${c}__workflow-notes`, Ns = `[${_s}="${$s}"]`, Bn = `${c}__workflow-section-title-row`, vs = `${c}__workflow-section-header--casting-backlash`, ho = `${c}__casting-backlash-button`;
function Os(e) {
  for (const t of Fs(e))
    Ms(t), js(t);
}
function Fs(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(xn) && t.add(e);
  for (const n of e.querySelectorAll(xn))
    t.add(n);
  return Array.from(t);
}
function Ms(e) {
  const t = e.querySelector(Ns);
  if (!t) return;
  const n = xs(t);
  if (!n) return;
  const r = e.querySelector(`${Ds} ${Ps}`);
  r && (r.classList.add(vs), Bs(r), Us(n), r.append(n), t.remove());
}
function xs(e) {
  return e.querySelector(
    `button[${Ss}], button[${Es}]`
  );
}
function Bs(e) {
  const t = e.querySelector(`:scope > .${Bn}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Bn);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(ho) || n.append(o));
  return n;
}
function Us(e) {
  if (e.getAttribute(Mn) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = qs(t, e.disabled);
  e.classList.add(ho), e.setAttribute(Mn, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function qs(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function js(e) {
  for (const t of e.querySelectorAll(Ls)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function zs(e) {
  for (const t of Array.from(e.querySelectorAll(uo)))
    for (const n of Array.from(t.querySelectorAll(`${Cs}, ${ks}`)))
      n.remove();
}
function Hs(e) {
  for (const t of Array.from(e.querySelectorAll(bs)))
    Vs(t);
}
function Vs(e) {
  const t = e.querySelector(As), n = e.querySelector(co), r = e.querySelector(Rs), o = e.querySelector(Ts);
  if (!r || !t && !n && !o) return;
  const a = Gs(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && o.parentElement !== a && !r.contains(o) && a.append(o), r.parentElement !== e && e.append(r);
}
function Gs(e, t) {
  const n = e.querySelector(`.${Fn}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Fn), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function Un(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function en() {
  const e = globalThis.game;
  return Je(e) ? e : null;
}
function S(e, t) {
  const n = Ws(e, t);
  return Be(n);
}
function Ws(e, t) {
  return t.split(".").reduce((n, r) => Je(n) ? n[r] : null, e);
}
function Ks(e, t) {
  const n = e.indexOf(":");
  return n < 0 || we(e.slice(0, n)) !== we(t) ? null : ue(e.slice(n + 1));
}
function Be(e) {
  return typeof e == "string" ? ue(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Je(e) {
  return !!e && typeof e == "object";
}
function Ys(e) {
  return typeof e == "string";
}
function et(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function ue(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function we(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function St(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function z(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function yo(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Qs(e) {
  for (const t of Array.from(e.querySelectorAll(gs))) {
    const n = rl(t);
    Zs(t), n && (Xs(t, n), Js(t, n));
  }
}
function Zs(e) {
  for (const t of Array.from(e.querySelectorAll(hs)))
    t.remove();
}
function Xs(e, t) {
  const r = e.closest(`.${c}`)?.querySelector(lo) ?? null, o = r?.querySelector(ps) ?? null, a = r ?? e, i = a.querySelector(Is);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const s = i ?? document.createElement("span");
  if (s.className = Rl(t.elementTone), s.textContent = Al(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", s);
      return;
    }
    a.prepend(s);
  }
}
function Js(e, t) {
  const n = el(e);
  tl(e, n);
  const r = nl(t);
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
  const a = e.querySelector(uo);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function el(e) {
  return e.closest(`.${c}`)?.querySelector(lo) ?? null;
}
function tl(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(ws)))
      o.remove();
}
function nl(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${St(e.target)}` : null,
    e.duration ? `Duração: ${St(e.duration)}` : null,
    e.resistance ? `Resistência: ${yo(e.resistance)}` : null
  ].filter(et);
}
function rl(e) {
  const t = ol(e), n = ul(e), o = (t ? cl(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = tn(S(o, "element")), s = M("op.elementChoices", i) ?? qn(Z(a, "Elemento")) ?? qn(n.damageType), u = i ?? Tl(s), m = S(o, "circle") ?? Z(a, "Círculo"), f = fl(o) ?? Z(a, "Alvo"), A = yl(o, "duration", "op.durationChoices") ?? Z(a, "Duração"), T = dl(e) ?? gl(o) ?? Z(a, "Resistência"), C = ml(a) ?? n.cost, g = {
    elementLabel: s,
    elementTone: u,
    circle: m,
    cost: C,
    target: f,
    duration: A,
    resistance: T
  };
  return bl(g) ? g : null;
}
function ol(e) {
  const t = al(e);
  if (!t) return null;
  const n = t.getFlag?.(l, fs), r = sl(n);
  if (r.length === 0) return null;
  const o = il(e);
  if (o.size > 0) {
    const a = r.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function al(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? en()?.messages?.get?.(n) ?? null : null;
}
function il(e) {
  const t = e.closest(`.${c}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${On}]`))) {
    const o = r.getAttribute(On)?.trim();
    o && n.add(o);
  }
  return n;
}
function sl(e) {
  if (!Je(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(ll).filter((n) => n !== null) : [];
}
function ll(e) {
  return Je(e) ? {
    pendingId: Be(e.pendingId),
    actorId: Be(e.actorId),
    itemId: Be(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Ys) : []
  } : null;
}
function cl(e) {
  if (!e.itemId) return null;
  const t = en(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function ul(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(ys))) {
    const o = ue(r.textContent);
    if (!o) continue;
    const a = Ks(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function dl(e) {
  const t = ue(e.querySelector(co)?.textContent);
  return t ? yo(t) : null;
}
function Z(e, t) {
  const n = we(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || we(r.slice(0, o)) !== n))
      return ue(r.slice(o + 1));
  }
  return null;
}
function ml(e) {
  const t = Z(e, "Custo") ?? Z(e, "PE");
  return t || (e.map(ue).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function fl(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return pl(e) ?? M("op.targetChoices", t) ?? "Área";
  const n = M("op.targetChoices", t) ?? z(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, n].filter(et).join(" ");
}
function pl(e) {
  const t = S(e, "area.name"), n = S(e, "area.size"), r = S(e, "area.type"), o = t ? M("op.areaChoices", t) ?? z(t) : null, a = r ? M("op.areaTypeChoices", r) ?? z(r) : null;
  return o ? n ? a ? `${o} ${n}m ${St(a)}` : `${o} ${n}m` : o : null;
}
function gl(e) {
  const t = S(e, "skillResis"), n = S(e, "resistance");
  if (!t || !n) return null;
  const r = M("op.skill", t) ?? z(t), o = hl(n);
  return [r, o].filter(et).join(" ");
}
function hl(e) {
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
      return M("op.resistanceChoices", e) ?? z(e);
  }
}
function yl(e, t, n) {
  const r = S(e, t);
  return r ? M(n, r) ?? z(r) : null;
}
function bl(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Al(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Rl(e) {
  return [
    `${c}__ritual-element-badge`,
    e ? `${c}__ritual-element-badge--${e}` : null
  ].filter(et).join(" ");
}
function tn(e) {
  const t = we(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function qn(e) {
  const t = tn(e);
  return t ? M("op.elementChoices", t) ?? z(t) : e ? z(e) : null;
}
function Tl(e) {
  return tn(e);
}
function M(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = en()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const jn = "data-paranormal-toolkit-dice-toggle-enhanced";
function Cl(e) {
  for (const t of Array.from(e.querySelectorAll(mo)))
    bo(t);
}
function kl(e) {
  const t = Ro(e.target);
  if (!t) return;
  const n = nn(t);
  n && (e.preventDefault(), Ao(n, t));
}
function Il(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Ro(e.target);
  if (!t) return;
  const n = nn(t);
  n && (e.preventDefault(), Ao(n, t));
}
function bo(e) {
  const t = e.querySelector(Jt);
  if (!t) return;
  const n = e.querySelector(po);
  if (n && n.getAttribute(jn) !== "true" && (n.setAttribute(jn, "true"), n.classList.add(go), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Ao(e, t) {
  const n = e.querySelector(Jt);
  if (!n) return;
  const r = !e.classList.contains(fo);
  wl(e, t, n, r);
}
function wl(e, t, n, r) {
  e.classList.toggle(fo, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Ro(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(po);
  if (!t) return null;
  const n = nn(t);
  return n ? (bo(n), t.classList.contains(go) ? t : null) : null;
}
function nn(e) {
  const t = e.closest(mo);
  return t && t.querySelector(Jt) ? t : null;
}
const zn = `${l}-workflow-dice-toggle-styles`;
function $l() {
  if (document.getElementById(zn)) return;
  const e = document.createElement("style");
  e.id = zn, e.textContent = `
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
const _l = [0, 100, 500, 1500, 3e3];
let Hn = !1, ut = null;
function El() {
  if (!Hn) {
    Hn = !0, $l(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Re(Un(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Re(Un(t));
    }), Hooks.once("ready", () => {
      Re(document), Sl();
    }), document.addEventListener("click", kl), document.addEventListener("keydown", Il);
    for (const e of _l)
      globalThis.setTimeout(() => Re(document), e);
  }
}
function Sl() {
  ut || !document.body || (ut = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Re(n);
  }), ut.observe(document.body, { childList: !0, subtree: !0 }));
}
function Re(e) {
  e && (zs(e), Qs(e), Hs(e), Cl(e), Os(e));
}
function Dl() {
  El();
}
const Pl = {
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
}, Ll = new Set(
  Object.values(Pl)
), Nl = {
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
function vl(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Ol(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Nl[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Ll.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function To(e) {
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
function Ol(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Fl {
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
      const A = Ml(f, m);
      if (!A.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const T = vl(f.damageType);
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
          xl(A.id, f, T.value)
        );
        continue;
      }
      try {
        const C = await Promise.resolve(
          a.call(n, A.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: f.ignoreResistance === !0,
            nonLethal: f.nonLethal === !0
          })
        );
        for (const L of Ul(C.conditions))
          s.add(L);
        const g = Bl(C.newPV);
        g !== null && (u = g), i.push({
          id: A.id,
          label: f.label ?? To(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: A.amount,
          finalDamage: Vn(C.finalDamage, A.amount),
          blocked: Vn(C.blocked, 0),
          damageType: f.damageType ? String(f.damageType) : null,
          systemDamageType: T.value,
          ignoreResistance: f.ignoreResistance === !0,
          nonLethal: f.nonLethal === !0
        });
      } catch (C) {
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: f,
          cause: C
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
function Ml(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function xl(e, t, n) {
  return {
    id: e,
    label: t.label ?? To(n),
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
function Vn(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Bl(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ul(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const Te = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Co = {
  PV: "system.attributes.hp"
}, Dt = {
  PV: [Te.PV, Co.PV],
  SAN: [Te.SAN],
  PE: [Te.PE],
  PD: [Te.PD]
}, Pt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class ql {
  getResource(t, n) {
    const r = Gn(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, i = `${o}.max`, s = foundry.utils.getProperty(t, a), u = foundry.utils.getProperty(t, i), m = Kn(t, n, a, s, "valor atual");
    if (m) return p(m);
    const f = Kn(t, n, i, u, "valor máximo");
    return f ? p(f) : y({
      value: s,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = Gn(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function Gn(e, t) {
  const n = jl(e.type, t);
  if (n && Wn(e, n))
    return y(n);
  const r = Dt[t].find(
    (o) => Wn(e, o)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: zl(e, t),
    path: Dt[t].join(" | ")
  });
}
function jl(e, t) {
  return e === "threat" ? Co[t] ?? null : e === "agent" ? Te[t] : null;
}
function Wn(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function zl(e, t) {
  const n = e.type ?? "unknown", r = Dt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Kn(e, t, n, r, o) {
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
class Hl {
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
      const i = Pt.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: r, value: o } = n, a = Vl(o);
    return a ? y(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Pt.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Vl(e) {
  if (Yn(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Yn(n))
      return n;
  }
  return null;
}
function Yn(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Gl = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Wl {
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
    const r = n.value, o = Kl(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: Gl[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Kl(e, t) {
  const n = e.getFlag(l, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Yl(n) ? {
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
function Yl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const dt = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ql(e) {
  if (!nc(e.item)) return null;
  const t = Lt(e.actor) ? e.actor : Zl(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Jl(e.token) ?? Xl(t),
    targets: Zt(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Zl(e) {
  const t = e;
  return Lt(t.actor) ? t.actor : Lt(e.parent) ? e.parent : null;
}
function Xl(e) {
  const t = ec(e) ?? tc(e);
  return t ? ko(t) : null;
}
function Jl(e) {
  return Nt(e) ? ko(e) : null;
}
function ec(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Nt(n) ? n : (t.getActiveTokens?.() ?? []).find(Nt) ?? null;
}
function tc(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function ko(e) {
  const t = e.actor ?? null;
  return {
    tokenId: mt(e.id),
    actorId: mt(t?.id),
    sceneId: mt(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function nc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Lt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Nt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function mt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class rc {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(dt.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, d.info(`${dt.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Ql(oc(t));
    if (!n) {
      d.warn(`${dt.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function oc(e) {
  return e && typeof e == "object" ? e : {};
}
class ac {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return ft("missing-item-patch");
    if (t.type !== "ritual") return ft("unsupported-item-type");
    const o = ic(r);
    return Object.keys(o).length === 0 ? ft("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function ic(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (w(t, "system.circle", n.circle), w(t, "system.element", n.element), w(t, "system.target", n.target), w(t, "system.targetQtd", n.targetQuantity), w(t, "system.execution", n.execution), w(t, "system.range", n.range), w(t, "system.duration", n.duration), w(t, "system.skillResis", n.resistanceSkill), w(t, "system.resistance", n.resistance), w(t, "system.studentForm", n.studentForm), w(t, "system.trueForm", n.trueForm)), t;
}
function w(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function ft(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class sc {
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
    return this.getNumber(t, Pt.ritual.dt, 0);
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
class lc {
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
class cc {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = uc(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, pt(t)), y(t)) : n;
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
    return n ? pt(n) : null;
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
    return Array.from(this.presets.values()).map(pt);
  }
  findForItem(t) {
    return this.list().map((n) => dc(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function uc(e) {
  return !gt(e.id) || !gt(e.version) || !gt(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function dc(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = mc(o, t);
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
function mc(e, t) {
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
      const n = Qn(t.name), r = e.names.map(Qn).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = fc(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Qn(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function fc(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function pt(e) {
  return structuredClone(e);
}
function gt(e) {
  return typeof e == "string" && e.length > 0;
}
function ze(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = tt(e.amountFrom);
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
function tt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const pc = "dice-so-nice";
async function Io(e) {
  if (!ms().enabled || !gc()) return;
  const t = hc();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      d.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function gc() {
  return game.modules.get(pc)?.active === !0;
}
function hc() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function yc(e, t, n) {
  if (!Zn(e.id) || !Zn(e.formula))
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
    await Io(o);
    const s = {
      ...n.rollRequests[e.id] ?? wo(e, t),
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
function wo(e, t) {
  const n = e.intent ?? bc(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function bc(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Zn(e) {
  return typeof e == "string" && e.length > 0;
}
async function He(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Fe(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Fe(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? Fe(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? Fe(t, n, r, o) : e.recover(t, n, o);
  }
}
function Fe(e, t, n, r) {
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
function Ac(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = Rc(t, n, r, o);
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
    const i = Tc(t, n, r, o);
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
function Rc(e, t, n, r) {
  const o = tt(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: $o(t.id, "damage", r, t.damageInstances.length),
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
function Tc(e, t, n, r) {
  const o = tt(e.amountFrom);
  return {
    id: $o(t.id, "healing", r, t.healingInstances.length),
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
function $o(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Cc(e, t, n) {
  const r = tt(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function kc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), _o("before", e), Xn("before", e), Xn("resolve", e);
}
function Ic(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), _o("apply", e);
}
function wc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function _o(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t, s = $c(e, n.operation);
  s && i.emit(s, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Xn(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t;
  n.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function $c(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function _c(e, t, n) {
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
async function Ec(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Sc(e, t);
    case "spendRitualCost":
      return Dc(e, t);
  }
}
async function Sc(e, t) {
  const { context: n, resources: r } = e, o = ze(t, n);
  return o.ok ? Eo(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function Dc(e, t) {
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
  }), Eo(await r.spend(n.sourceActor, i.resource, i.amount), n, t);
}
function Eo(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Pc(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, i = Lc(t);
  for (const u of i.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const s = await a();
  if (!s.ok)
    return s;
  for (const u of i.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return s;
}
function Lc(e) {
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
class Nc {
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
        return Pc({
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
    const o = await Ec({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = wo(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const i = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, i), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: i }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await yc(t, r, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = ze(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = Cc(t, n, o.value);
    kc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), Ic({
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
      const u = await He(this.resources, s, t.resource, t.operation, o.value), m = this.handleResourceOperationResult(u, n, r, t);
      if (!m.ok)
        return m;
      Ac({
        step: t,
        context: n,
        transaction: m.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return wc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = ze(t, n);
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
      const s = await He(this.resources, i, t.resource, t.operation, o.value), u = this.handleResourceOperationResult(s, n, r, t);
      if (!u.ok)
        return u;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await _c(this.messages, t, n);
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
    const s = vc(t, n.intent);
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
function vc(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Oc {
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
function So(e) {
  return {
    id: Fc(),
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
function Fc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Mc {
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
    const r = So(n);
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
class xc {
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
class Bc {
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
    const n = _t();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Uc(),
      flags: {
        ...t.flags,
        [l]: {
          ...qc(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && d.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = _t();
    if (!r.enabled)
      return;
    const o = n.notification ?? Jn(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = Jn(n);
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
function Jn(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Uc() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function qc(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function jc(e, t) {
  const n = Yc(e?.rounds);
  if (!n)
    return er(null);
  const r = e?.anchor ?? Do(t);
  if (!r)
    return {
      ...er(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: zc(),
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
function Do(e) {
  const t = Qc();
  if (!t?.id || !Po(t.round)) return null;
  const n = Wc(t), r = Hc(e, n) ?? Gc(t), o = j(r?.id), a = Xc(r?.initiative), i = Vc(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: i,
    initiative: a,
    time: Zc()
  };
}
function zc() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function er(e) {
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
function Hc(e, t) {
  return e?.id ? t.find((n) => Kc(n) === e.id) ?? null : null;
}
function Vc(e, t, n) {
  const r = j(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return Jc(e.turn) ? e.turn : null;
}
function Gc(e) {
  return Ue(e.combatant) ? e.combatant : null;
}
function Wc(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Ue);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Ue);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(Ue);
  }
  return [];
}
function Kc(e) {
  return j(e.actor?.id) ?? j(e.actorId) ?? j(e.token?.actor?.id) ?? j(e.token?.actorId) ?? j(e.document?.actor?.id) ?? j(e.document?.actorId);
}
function Yc(e) {
  return Po(e) ? Math.trunc(e) : null;
}
function Qc() {
  return game.combat ?? null;
}
function Zc() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Ue(e) {
  return !!(e && typeof e == "object");
}
function j(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Xc(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Po(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Jc(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class eu {
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
    if (!uu(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = jc(t.duration, r), i = tu(o, t, a), u = t.refreshExisting ?? !0 ? du(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(i)), y(tr(r, o, u.id ?? null, !1, !0, a));
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
      return y(tr(r, o, f, !0, !1, a));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = No(n, r);
    let a = 0;
    try {
      for (const i of o)
        await nr(n, i) === "deleted" && (a += 1);
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
    const n = pu(), r = [];
    let o = 0, a = 0;
    for (const i of n) {
      const s = rn(i);
      o += s.length;
      for (const u of s) {
        if (!ou(u, t)) continue;
        const m = Lo(u);
        try {
          await nr(i, u) === "deleted" && (a += 1);
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
function tu(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Iu(),
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
    duration: nu(n.duration),
    start: ru(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [l]: r
    }
  };
}
function nu(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function ru(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: ku(),
    ...e
  };
}
function tr(e, t, n, r, o, a) {
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
function ou(e, t) {
  const n = Lo(e);
  if (!n.conditionId || !au(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Cu();
  return n.durationMode === "combatantTurn" || iu(n) ? lu(n, r) : su(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !D(n.startRound) || !D(n.requestedRounds) || !D(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function au(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && D(e.requestedRounds);
}
function iu(e) {
  return !!(e.combatDurationApplied && D(e.requestedRounds) && D(e.startRound) && (e.startCombatantId || Ve(e.startTurn)));
}
function su(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function lu(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !D(e.startRound) || !D(e.requestedRounds) || !D(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = cu(t);
  return e.startCombatantId ? r === e.startCombatantId : Ve(e.startTurn) && Ve(t.turn) ? t.turn === e.startTurn : !1;
}
function cu(e) {
  return ae(e.combatant?.id);
}
function Lo(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: qe(e, "conditionId"),
    requestedRounds: rr(e, "requestedRounds") ?? Ce(t.value) ?? Ce(t.rounds),
    combatDurationApplied: ht(e, "combatDurationApplied"),
    combatId: qe(e, "combatId") ?? ae(n.combat) ?? ae(t.combat),
    startCombatantId: qe(e, "startCombatantId") ?? ae(n.combatant),
    startInitiative: bu(e, "startInitiative") ?? vo(n.initiative),
    startRound: rr(e, "startRound") ?? Ce(n.round) ?? Ce(t.startRound),
    startTurn: yu(e, "startTurn") ?? vt(n.turn) ?? vt(t.startTurn),
    expiryEvent: Au(e, "expiryEvent") ?? Oo(t.expiry),
    durationMode: Ru(e, "durationMode"),
    deleteOnExpire: ht(e, "deleteOnExpire"),
    expiresWithCombat: ht(e, "expiresWithCombat")
  };
}
function uu(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function du(e, t) {
  return No(e, t)[0] ?? null;
}
function No(e, t) {
  return rn(e).filter((n) => hu(n) === t);
}
async function nr(e, t) {
  const n = t.id ?? null, r = n ? mu(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (fu(o)) return "missing";
    throw o;
  }
}
function mu(e, t) {
  return rn(e).find((n) => n.id === t) ?? null;
}
function fu(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function pu() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Me(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Me(e, n);
  });
  for (const n of gu())
    Me(e, n.actor), Me(e, n.document?.actor);
  return Array.from(e.values());
}
function Me(e, t) {
  if (!Tu(t)) return;
  const r = ae(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function gu() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function rn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function hu(e) {
  return qe(e, "conditionId");
}
function qe(e, t) {
  return ae(te(e, t));
}
function rr(e, t) {
  return Ce(te(e, t));
}
function yu(e, t) {
  return vt(te(e, t));
}
function bu(e, t) {
  return vo(te(e, t));
}
function Au(e, t) {
  return Oo(te(e, t));
}
function Ru(e, t) {
  const n = te(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function ht(e, t) {
  return te(e, t) === !0;
}
function te(e, t) {
  const n = e.getFlag?.(l, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const o = r[l];
  if (!(!o || typeof o != "object"))
    return o[t];
}
function ae(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ce(e) {
  return D(e) ? Math.trunc(e) : null;
}
function vt(e) {
  return Ve(e) ? Math.trunc(e) : null;
}
function vo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Oo(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Tu(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Cu() {
  return game.combat ?? null;
}
function ku() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function D(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Ve(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Iu() {
  return game.user?.id ?? null;
}
const wu = "icons/svg/downgrade.svg", $u = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? wu,
    description: $u,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const _u = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Eu = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Su = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Du = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Pu = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Lu = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Nu = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), vu = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Ou = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Fu = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Mu = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), xu = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Bu = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Uu = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), qu = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), ju = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), zu = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Hu = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Vu = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Gu = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Wu = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Ku = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Yu = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Qu = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Zu = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Xu = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Ju = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), ed = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), td = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), nd = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), rd = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), od = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), ad = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), id = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), sd = [
  _u,
  Eu,
  Su,
  Du,
  Pu,
  Lu,
  Nu,
  vu,
  Ou,
  Fu,
  Mu,
  xu,
  Bu,
  Uu,
  qu,
  ju,
  zu,
  Hu,
  Vu,
  Gu,
  Wu,
  Ku,
  Yu,
  Qu,
  Zu,
  Xu,
  Ju,
  ed,
  td,
  nd,
  rd,
  od,
  ad,
  id
];
class ld {
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
    return Array.from(this.definitions.values()).map(or);
  }
  get(t) {
    const n = this.lookup.get(ar(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(or(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = ar(t);
    r && this.lookup.set(r, n);
  }
}
function cd() {
  return new ld(sd);
}
function or(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function ar(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const ud = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Fo = `${l}-inline-roll-neutralized`, dd = `${l}-inline-roll-notice`, on = `data-${l}-inline-roll-neutralized`, ir = `data-${l}-inline-roll-notice`, md = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function sr(e) {
  const t = $d(e.message), n = await fd(e.message), r = pd(t);
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
async function fd(e) {
  const t = kd(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = gd(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Id(t, n.content), replacementCount: n.replacementCount };
}
function pd(e) {
  const t = e ? wd(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Mo(t);
  return n > 0 && xo(Rd(t)), { replacementCount: n };
}
function gd(e) {
  const t = hd(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Mo(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (xo(n.content), { content: n.innerHTML, replacementCount: o });
}
function hd(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, bd(o.trim()))), replacementCount: t };
}
function Mo(e) {
  const t = yd(e);
  for (const n of t)
    n.replaceWith(Ad(Td(n)));
  return t.length;
}
function yd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(ud))
    n.getAttribute(on) !== "true" && t.add(n);
  return Array.from(t);
}
function bd(e) {
  return `<span class="${Fo}" ${on}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${_d(e)}</span>`;
}
function Ad(e) {
  const t = document.createElement("span");
  return t.classList.add(Fo), t.setAttribute(on, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function xo(e) {
  if (e.querySelector?.(`[${ir}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(dd), t.setAttribute(ir, "true"), t.textContent = md, e.append(t);
}
function Rd(e) {
  return e.querySelector(".message-content") ?? e;
}
function Td(e) {
  const n = e.getAttribute("data-formula") ?? Cd(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Cd(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function kd(e) {
  return e && typeof e == "object" ? e : null;
}
async function Id(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return d.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function wd(e) {
  const t = Ed(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function $d(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function _d(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Ed(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const lr = "occultism";
function Sd(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Dd(e) {
  const t = Sd(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await Pd(e, lr);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Io(n);
  const r = vd(n);
  return {
    skill: lr,
    skillLabel: "Ocultismo",
    roll: n,
    formula: Nd(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: Od(n)
  };
}
async function Pd(e, t) {
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
  return Ld(r);
}
function Ld(e) {
  return cr(e) ? e : Array.isArray(e) ? e.find(cr) ?? null : null;
}
function cr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Nd(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function vd(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Od(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Fd);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Fd(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function Md(e) {
  return {
    header: {
      eyebrow: Vt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: jd(e.ritual)
    },
    forms: e.variantOptions.map((t) => xd(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: qd(e.automationStatus ?? "assisted")
  };
}
function xd(e, t) {
  const n = Bd(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Ud(t) : "—",
    details: n
  };
}
function Bd(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Ud(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function qd(e) {
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
function jd(e) {
  const t = e.system, n = [Hd(t?.element), zd(t?.circle)].filter(Vd);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function zd(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Hd(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function Vd(e) {
  return typeof e == "string" && e.length > 0;
}
const Bo = ["base", "discente", "verdadeiro"];
function Uo(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Ge(e) {
  return typeof e == "string" && Bo.includes(e);
}
const { ApplicationV2: Gd } = foundry.applications.api;
class Ie extends Gd {
  constructor(t, n) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = n, this.model = Md(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    Kd(o, (a) => {
      this.selectedVariant = a;
    }), Yd(o, (a) => {
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
          ${this.model.forms.map(Wd).join("")}
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
    const n = Xd(t), r = Qd(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function Wd(e) {
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
function Kd(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => ur(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), ur(e, o, t));
    });
  const r = qo(e);
  r && t(r);
}
function ur(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Ge(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), qo(e));
}
function qo(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && Ge(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function Yd(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function Qd(e, t, n) {
  const r = Zd(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function Zd(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Ge(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Ge(n) ? n : null;
}
function Xd(e) {
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
async function Jd(e) {
  return Ie.request(e);
}
const an = {
  label: "Padrão"
}, em = {
  label: "Discente",
  extraCost: 2
}, tm = {
  label: "Verdadeiro",
  extraCost: 5
};
class nm {
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
    const r = this.resolveCostPreview(t), o = Vm(n), a = jm(
      n,
      t.item,
      r,
      o
    ), i = await Jd({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((I) => I.name),
      cost: r,
      defaultSpendResource: Zm(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const s = rm(i), u = Wm(
      n,
      t.item,
      s.variant,
      o
    ), m = oo();
    let f = null;
    if (m) {
      const I = await am(
        this.resources,
        t.actor,
        s,
        u,
        r
      );
      if (!I.ok)
        return {
          status: "failed",
          reason: I.reason,
          message: I.message
        };
      try {
        f = await Dd(
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
    const A = om(
      n,
      s,
      u,
      r,
      {
        includeCostSteps: !m
      }
    );
    if (A.steps.length === 0) {
      const I = Gm(
        t,
        s
      ), U = dr(
        t.actor,
        f,
        u,
        r
      ), An = mr(
        n,
        s,
        u,
        r,
        I,
        f
      );
      return U.length > 0 ? {
        status: "ready",
        workflowContext: I,
        actions: U,
        summaryLines: An
      } : {
        status: "completed-without-actions",
        workflowContext: I,
        summaryLines: An
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
          variant: s.variant,
          spendResource: s.spendResource
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
    const C = T.value.context, g = mm(
      n,
      t,
      C
    ), L = sm(
      n,
      t
    ), ge = dr(
      t.actor,
      f,
      u,
      r
    ), he = mr(
      n,
      s,
      u,
      r,
      C,
      f
    );
    if (!g.ok)
      return {
        status: "failed",
        reason: g.reason,
        message: g.message
      };
    if (!L.ok)
      return {
        status: "failed",
        reason: L.reason,
        message: L.message
      };
    const ye = [
      ...ge,
      ...g.actions,
      ...L.actions
    ];
    return ye.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: C,
      summaryLines: he
    } : {
      status: "ready",
      workflowContext: C,
      actions: ye,
      summaryLines: he
    };
  }
  async applyAction(t) {
    return He(
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
function rm(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function om(e, t, n, r, o) {
  const a = [], i = t.spendResource === !0;
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || sn(s) && (!o.includeCostSteps || !i) || a.push(im(s, n));
  return o.includeCostSteps && i && r && Xm(n.extraCost) && a.push({
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
async function am(e, t, n, r, o) {
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
function im(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function dr(e, t, n, r) {
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
function sm(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = jo(r.actor, t);
    if (o.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    for (const a of o) {
      const i = Do(a);
      n.push(
        lm(
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
function lm(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? dm(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: cm(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: um(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function cm(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function um(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function dm(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function mm(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const i = ze(a, n);
    if (!i.ok)
      return {
        ok: !1,
        reason: i.error.reason,
        message: i.error.message
      };
    const s = jo(a.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const u of s) {
      if (fm(a)) {
        pm(
          o,
          u,
          gm(a, n, i.value)
        );
        continue;
      }
      r.push(ym(a, u, i.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...hm(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function fm(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function pm(e, t, n) {
  const r = Tm(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function gm(e, t, n) {
  const r = Cm(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function hm(e, t, n, r) {
  const o = $m(e), a = o.length > 1 ? Sm() : void 0;
  return o.map((i) => {
    const s = r.map(
      (m, f) => {
        const A = _m(m.amount, i);
        return {
          id: bm(m, i, f),
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
      label: Am(u, i, o.length > 1),
      executedLabel: Rm(
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
function ym(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = wm(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: km(e, r, n),
    executedLabel: Im(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function bm(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Am(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Rm(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Tm(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Cm(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function km(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Im(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function wm(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function $m(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function _m(e, t) {
  const n = e * t.multiplier, r = Em(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function Em(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Sm() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function jo(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function mr(e, t, n, r, o, a = null) {
  return [
    `Forma: ${Uo(t.variant)}`,
    Pm(t, n, r),
    ...Dm(a),
    ...Object.values(o.rolls).flatMap(Lm),
    ...Nm(e.resistance),
    ...Um(n)
  ];
}
function Dm(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Pm(e, t, n) {
  const r = Se(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Lm(e) {
  const n = [`${qm(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = vm(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${Bm(e.damageType)}`), n;
}
function Nm(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function vm(e) {
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
    const i = Om(a);
    i && (xm(
      n,
      i.operator ?? r,
      i.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Om(e) {
  const t = Fm(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Mm(e);
}
function Fm(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Mm(e) {
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
function xm(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function Bm(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Um(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function qm(e) {
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
function jm(e, t, n, r) {
  return Bo.map((o) => {
    const a = zo(
      e,
      t,
      o,
      r
    ), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? Uo(o),
      enabled: i,
      details: a ? zm(a, n, r) : [],
      finalCostText: a ? Hm(n, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function zm(e, t, n) {
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
function Hm(e, t) {
  const n = Se(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function Vm(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(sn);
}
function Gm(e, t) {
  return So({
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
function Wm(e, t, n, r) {
  return zo(e, t, n, r) ?? an;
}
function zo(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? Ym(t, n) ? Km(n) : null : n === "base" ? an : null);
}
function Km(e) {
  switch (e) {
    case "base":
      return an;
    case "discente":
      return em;
    case "verdadeiro":
      return tm;
  }
}
function Ym(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Qm(foundry.utils.getProperty(e, n));
}
function Qm(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Zm(e) {
  return e.steps.some(sn);
}
function sn(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Xm(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Jm(e, t) {
  const n = await ef(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: nf(n),
    total: rf(n),
    diceBreakdown: of(n)
  };
}
function Ho(e) {
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
async function ef(e, t) {
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
  return tf(r);
}
function tf(e) {
  return fr(e) ? e : Array.isArray(e) ? e.find(fr) ?? null : null;
}
function fr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function nf(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function rf(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function of(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(af);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function af(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Vo = "itemUsePrompts", Go = "chatCard", nt = "data-paranormal-toolkit-prompt-id", rt = "data-paranormal-toolkit-pending-id", ln = "data-paranormal-toolkit-executed-label", Ot = "data-paranormal-toolkit-choice-group", Wo = "data-paranormal-toolkit-skipped-label", pr = "data-paranormal-toolkit-action-section", gr = "data-paranormal-toolkit-detail-key", hr = "data-paranormal-toolkit-roll-card", cn = "data-paranormal-toolkit-roll-detail-toggle", Ko = "data-paranormal-toolkit-roll-detail-id", Yo = "data-paranormal-toolkit-resistance-roll-button", Qo = "data-paranormal-toolkit-resistance-skill", Zo = "data-paranormal-toolkit-resistance-skill-label", Xo = "data-paranormal-toolkit-resistance-target-actor-id", Jo = "data-paranormal-toolkit-resistance-target-name", ea = "data-paranormal-toolkit-resistance-roll-result", yr = "data-paranormal-toolkit-system-card-replaced", sf = `[${rt}]`, lf = `[${cn}]`, cf = `[${Yo}]`, Ft = `${l}-chat-enrichment`, h = `${l}-item-use-prompt`, uf = `${h}__actions`, br = `${h}__details`, ta = `${h}__summary`, df = `${h}__title`, na = `${h}__button--executed`, Ar = `${h}__roll-card`;
let Rr = !1, Mt = null;
const P = /* @__PURE__ */ new Map(), mf = [0, 100, 500, 1500, 3e3], ff = 3e4, pf = [0, 100, 500, 1500, 3e3];
function gf(e) {
  if (Mt = e, Rr) {
    Cr(e);
    return;
  }
  const t = (n, r) => {
    oa(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Rr = !0, Cr(e);
}
async function Tr(e) {
  const t = ra(e);
  P.set(e.pendingId, t), await mn(t) || pa(t), aa(e.pendingId);
}
async function hf(e) {
  const t = ra({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await mn(t) || pa(t), aa(e.pendingId);
}
async function yt(e, t) {
  const n = P.get(e);
  P.delete(e), n && await gp(n, t);
}
function un(e) {
  const t = Ra();
  for (const n of t) {
    const r = B(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function yf(e, t) {
  const n = un(e);
  if (!n) return;
  const r = B(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await de(n.message, r));
}
async function bf(e, t, n) {
  if (!t) return;
  const r = un(e);
  if (!r) return;
  const o = B(r.message);
  let a = !1;
  for (const [i, s] of Object.entries(o))
    i !== e && s.choiceGroupId === t && (o[i] = {
      ...s,
      executedLabel: n ?? s.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await de(r.message, o);
}
function ra(e) {
  const t = H(e.context.message), n = e.context.targets.find((i) => qt(i)), r = n ? qt(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Hf(e.context),
    executed: !1
  };
}
function oa(e, t, n) {
  pp();
  const r = at(t);
  if (!r) return;
  const o = dp(e, r);
  o.length > 0 && We(r);
  for (const a of o)
    xt(r, a);
  la(r, n), Bt(r), Ut(r);
}
function Cr(e) {
  for (const t of pf)
    globalThis.setTimeout(() => {
      Af(e);
    }, t);
}
function Af(e) {
  for (const t of Rf()) {
    const n = ot(t);
    Tf(n) && oa(n, t, e);
  }
}
function Rf() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Tf(e) {
  return e ? fn(e) ? !0 : yp(e).length > 0 : !1;
}
function aa(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? mp(t.messageId) : null;
  if (n) {
    _r(n, t), We(n), xt(n, t), kr(n), Bt(n), Ut(n);
    return;
  }
  if (t.messageId) {
    zt(t);
    return;
  }
  const r = fp(t);
  if (r) {
    _r(r, t), We(r), xt(r, t), kr(r), Bt(r), Ut(r);
    return;
  }
  zt(t);
}
function kr(e) {
  Mt && la(e, Mt);
}
function We(e) {
  const t = Cf();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = sa(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(yr) === "true") return;
  const r = n.querySelector(`.${Ft}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(yr, "true");
}
function Cf() {
  try {
    return Ni() === "replace";
  } catch {
    return !1;
  }
}
function xt(e, t) {
  if (We(e), e.querySelector(`[${nt}="${me(t.pendingId)}"]`)) return;
  const n = kf(e, t);
  wf(n, t), Bf(n, Uf(t)).append(zf(t));
}
function kf(e, t) {
  const n = e.querySelector(`.${Ft}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Ft, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(df), i.textContent = If(t);
  const s = document.createElement("span");
  return s.classList.add(ta), s.textContent = t.summary, o.append(a, i, s), r.append(o), Gf(e).append(r), r;
}
function If(e) {
  const t = _(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function wf(e, t) {
  const n = t.summaryLines ?? [], r = ma(n, t);
  if (r) {
    $f(e, r, t);
    return;
  }
  qf(e, n);
}
function $f(e, t, n) {
  if (e.querySelector(`[${hr}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Ar, `${Ar}--${t.intent}`), r.setAttribute(hr, "true"), t.castingCheck && Ir(r, Ef(t.castingCheck), n.pendingId, "casting"), _f(t) && Ir(r, Sf(t), n.pendingId, "effect"), vf(r, t), Of(r, t, n), xf(r, t), e.append(r);
}
function _f(e) {
  return e.intent !== "casting";
}
function Ef(e) {
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
function Sf(e) {
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
function Ir(e, t, n, r) {
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
  Df(o, t), Mf(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Df(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = Pf(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function Pf(e, t) {
  const n = Lf(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of Nf(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function Lf(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Nf(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? wr(e, "highest") : n.includes("kl") ? wr(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function wr(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function vf(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Op);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function Of(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = Ff(t, n);
  o.append(a), i && o.append(i);
  const s = document.createElement("span");
  s.classList.add(`${h}__resistance-description`), s.textContent = t.resistance, r.append(o, s), t.resistanceRollResult && r.append(ia(t.resistanceRollResult)), e.append(r);
}
function Ff(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(nt, t.pendingId), n.setAttribute(Yo, "true"), n.setAttribute(Qo, e.resistanceSkill), n.setAttribute(Zo, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Xo, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Jo, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(ea, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function ia(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = ua(e), t;
}
function Mf(e, t, n, r, o) {
  const a = t.filter((m) => m.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${n}-roll-details-${r}`, s = document.createElement("button");
  s.type = "button", s.classList.add(`${h}__roll-detail-toggle`), s.setAttribute(cn, i), s.setAttribute("aria-expanded", "false"), s.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(Ko, i), u.hidden = !0;
  for (const m of a) {
    const f = document.createElement("dt");
    f.textContent = m.label;
    const A = document.createElement("dd");
    A.textContent = m.value, u.append(f, A);
  }
  e.append(s, u);
}
function xf(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function Bf(e, t) {
  const n = `[${pr}="${me(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(uf), o.setAttribute(pr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function Uf(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = ma(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function qf(e, t) {
  if (t.length === 0) return;
  const n = jf(e);
  for (const r of t) {
    const o = Fp(r);
    if (n.querySelector(`[${gr}="${me(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(gr, o), n.append(a);
  }
}
function jf(e) {
  const t = e.querySelector(`.${br}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(br), e.append(n), n;
}
function zf(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(nt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(na), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(rt, e.pendingId), t.setAttribute(ln, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Ot, e.choiceGroupId), t.setAttribute(Wo, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Hf(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Vf(e);
  return `${t} → ${n}`;
}
function Vf(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Gf(e) {
  return sa(e) ?? e;
}
function sa(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function la(e, t) {
  const n = at(e);
  if (!n) return;
  const r = n.querySelectorAll(sf);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      ip(o, t);
    }));
}
function Bt(e) {
  const t = at(e);
  if (!t) return;
  const n = t.querySelectorAll(lf);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Wf(t, r);
    }));
}
function Ut(e) {
  const t = at(e);
  if (!t) return;
  const n = t.querySelectorAll(cf);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Kf(t, r);
    }));
}
function Wf(e, t) {
  const n = t.getAttribute(cn);
  if (!n) return;
  const r = e.querySelector(`[${Ko}="${me(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Kf(e, t) {
  const n = t.getAttribute(nt), r = t.getAttribute(Qo), o = t.getAttribute(Zo) ?? (r ? Ho(r) : "Resistência");
  if (!n || !r) return;
  const a = Zf(e, n), i = Xf(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const s = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Jm(i, r);
    await rp(u.roll);
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
    Yf(t, m), Qf(t, m), op(n, m), await ap(e, n, m);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1;
  }
}
function Yf(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(ea, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Qf(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? ia(t);
  if (r) {
    r.textContent = ua(t);
    return;
  }
  n.append(o);
}
function Zf(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = ot(e);
  return B(r)[t] ?? null;
}
function Xf(e, t) {
  const n = e?.resistanceTargetActor;
  if (F(n)) return n;
  const o = e?.context?.targets.map(qt).find(F) ?? null;
  if (o) return o;
  const a = t.getAttribute(Xo) ?? e?.resistanceTargetActorId ?? null, i = a ? ep(a) : null;
  return i || tp(
    t.getAttribute(Jo) ?? e?.resistanceTargetName ?? Jf(t)
  );
}
function Jf(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${ta}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function qt(e) {
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
function ep(e) {
  const n = game.actors?.get?.(e);
  return F(n) ? n : ca().map((a) => $e(a)).find((a) => a?.id === e) ?? null;
}
function tp(e) {
  const t = ie(e);
  if (!t) return null;
  const n = ca().filter((a) => ie(np(a)) === t).map((a) => $e(a)).find(F) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => F(a) && ie(a.name) === t);
  return F(o) ? o : null;
}
function ca() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function np(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : $e(e)?.name ?? null;
}
function ie(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function F(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ua(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function rp(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function op(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function ap(e, t, n) {
  const r = ot(e);
  if (r)
    try {
      const o = B(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await de(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function ot(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return x(r?.get?.(n));
}
async function ip(e, t) {
  const n = e.getAttribute(rt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    da(e, e.getAttribute(ln) ?? "✓ Automação aplicada"), sp(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function da(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(na), e.removeAttribute(rt), e.removeAttribute(ln);
}
function sp(e) {
  const t = e.getAttribute(Ot);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Ot}="${me(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(Wo) ?? "✓ Outra opção escolhida";
    da(o, a);
  }
}
function ma(e, t) {
  const n = e.map(dn).filter(Np), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = _(e, "Forma"), a = _(e, "Custo"), i = _(e, "Dados") ?? _(e, `Dados (${r.label})`), s = _(e, "Tipo"), u = _(e, "Resistência"), m = _(e, "Resistência Perícia"), f = _(e, "Resistência Rótulo") ?? (m ? Ho(m) : null), A = fa(e, "Observação"), T = e.filter((g) => up(g, r)), C = lp(e);
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
    details: T,
    castingCheck: C,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function lp(e) {
  const t = e.map(dn).find((a) => a?.intent === "casting") ?? null, n = _(e, "Conjuração DT"), r = _(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: _(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: _(e, "Dados (Conjuração)")
  } : null;
}
function dn(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: cp(n)
  } : null;
}
function cp(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function _(e, t) {
  return fa(e, t)[0] ?? null;
}
function fa(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function up(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || dn(e) ? !1 : e.trim().length > 0;
}
function dp(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    jt(r, e, t) && n.set(r.pendingId, r);
  for (const r of hp(e))
    jt(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function jt(e, t, n) {
  const r = H(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !$r(n, "itemId", e.itemId) ? !1 : !e.actorId || $r(n, "actorId", e.actorId);
}
function $r(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${Mp(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function mp(e) {
  const t = me(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function fp(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (jt(e, null, t))
      return t;
  return null;
}
function pp() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function _r(e, t) {
  const n = ot(e);
  if (!n) return !1;
  try {
    const r = B(n);
    return r[t.pendingId] = pn(t, H(n)), await de(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function mn(e) {
  const t = ya(e);
  if (!t) return !1;
  try {
    const n = B(t);
    return n[e.pendingId] = pn(e, H(t)), await de(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function pa(e) {
  for (const t of mf)
    globalThis.setTimeout(() => {
      zt(e);
    }, t);
}
async function zt(e) {
  const t = ya(e);
  if (fn(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await mn(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function gp(e, t) {
  const n = ha(e.context.message);
  if (n)
    try {
      const r = B(n), o = r[e.pendingId] ?? pn(e, H(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await de(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function hp(e) {
  return Object.values(B(x(e))).filter(De);
}
function B(e) {
  if (!e) return {};
  const t = {}, n = fn(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(ga(e)))
    t[r] ??= o;
  return t;
}
function yp(e) {
  return Object.values(ga(x(e))).filter(De);
}
function ga(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, Vo);
  if (!le(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    De(o) && (n[r] = o);
  return n;
}
async function de(e, t) {
  typeof e.setFlag == "function" && (await Ap(e, t), await bp(e, t));
}
async function bp(e, t) {
  await Promise.resolve(e.setFlag?.(l, Vo, t));
}
function fn(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, Go);
  return Pp(t) ? t : null;
}
async function Ap(e, t) {
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
      actorName: Rp(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(l, Go, o));
}
function Rp(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function pn(e, t) {
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
function ha(e) {
  const t = x(e);
  if (t?.setFlag)
    return t;
  const n = Tp(e);
  if (n?.setFlag)
    return n;
  const r = H(e);
  if (!r) return null;
  const o = game.messages;
  return x(o?.get?.(r));
}
function Tp(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(x).find((n) => typeof n?.setFlag == "function") ?? null;
}
function ya(e) {
  const t = ha(e.context.message);
  if (t) return t;
  const n = e.messageId ? Cp(e.messageId) : null;
  if (n) return n;
  const r = Ra().slice().reverse();
  return r.find((o) => kp(o, e)) ?? r.find((o) => Ip(o, e)) ?? null;
}
function Cp(e) {
  const t = game.messages;
  return x(t?.get?.(e));
}
function kp(e, t) {
  const n = H(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!ba(e, t)) return !1;
  const o = Aa(e);
  return !t.actorId || !o || o === t.actorId;
}
function Ip(e, t) {
  if (!$p(e, t)) return !1;
  const n = Aa(e);
  return t.actorId && n === t.actorId ? !0 : ba(e, t);
}
function ba(e, t) {
  const n = ie(wp(e));
  if (!n) return !1;
  const r = ie(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = ie(t.itemId);
  return !!(o && n.includes(o));
}
function wp(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Aa(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function $p(e, t) {
  const n = _p(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= ff;
}
function _p(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function x(e) {
  return e && typeof e == "object" ? e : null;
}
function De(e) {
  return le(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && E(e.messageId) && E(e.itemId) && E(e.actorId) && E(e.itemName) && Q(e.resistanceTargetActorId) && Q(e.resistanceTargetName) && Lp(e.resistanceRollResult) && Ep(e.actionPayload) && bt(e.title) && bt(e.buttonLabel) && bt(e.executedLabel) && Q(e.choiceGroupId) && Q(e.skippedLabel) && Q(e.actionSectionId) && Q(e.actionSectionTitle) && vp(e.summaryLines) : !1;
}
function Ep(e) {
  return e == null ? !0 : le(e) ? e.kind === "resource-operation" && E(e.actorId) && E(e.actorUuid) && typeof e.actorName == "string" && Sp(e.resource) && Dp(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Sp(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Dp(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Pp(e) {
  return le(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && E(e.messageId) && le(e.source) && E(e.source.actorId) && E(e.source.actorName) && E(e.source.itemId) && E(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(De) : !1;
}
function Lp(e) {
  return e == null ? !0 : le(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Q(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Np(e) {
  return e !== null;
}
function le(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function E(e) {
  return e === null || typeof e == "string";
}
function bt(e) {
  return e === void 0 || typeof e == "string";
}
function Q(e) {
  return e == null || typeof e == "string";
}
function vp(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Op(e) {
  return typeof e == "string" && e.length > 0;
}
function Ra() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(x).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(x).filter((r) => r !== null) : [];
}
function at(e) {
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
function Fp(e) {
  return e.trim().toLowerCase();
}
function Mp(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function me(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Er = 1e3;
class xp {
  constructor(t, n, r, o, a, i) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = i, this.ritualAssistant = new nm(
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
      settings: $n(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = $n();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Gt(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && Gp(t.item) && n.executionMode === "ask") {
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
    if (await sr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Tt(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await yt(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await yt(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = un(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = Yp(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await He(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await yf(t), await bf(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (gf(
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
    if (await sr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Tt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      Wp(t.item)
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
      return o.ok ? (Vp(n, o.value), await Bp(o.value), {
        ok: !0,
        executedLabel: Up(o.value)
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
    const n = At(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && At(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== t.id && (this.pendingExecutions.delete(o), await yt(
        o,
        Dr(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Ct();
    await hf({
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
      const s = Ct();
      a ??= s, this.pendingExecutions.set(s, {
        kind: "assisted-action",
        id: s,
        action: i,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Tr({
        pendingId: s,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: i.label,
        executedLabel: i.executedLabel,
        choiceGroupId: At(i),
        skippedLabel: Dr(i),
        actionSectionId: i.actionSectionId,
        actionSectionTitle: i.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: i.actor,
        resistanceTargetActorId: i.actor.id ?? null,
        resistanceTargetName: i.actorName,
        actionPayload: Kp(i)
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
    const r = Ct();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Tr({
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
    const n = Date.now(), r = Pr(t);
    for (const [a, i] of this.recentExecutionKeys.entries())
      n - i > Er && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= Er;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Pr(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = Tt(
      t,
      n,
      r,
      o
    );
  }
}
async function Bp(e) {
  const t = Hp();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: qp(e)
      });
    } catch (n) {
      d.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function Up(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function qp(e) {
  const t = e.instances.map((i) => {
    const s = i.blocked > 0 ? ` <span class="muted">(RD ${i.blocked})</span>` : "";
    return `<li><strong>${je(i.label ?? "Dano")}</strong>: ${i.inputAmount} → ${i.finalDamage} PV${s}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = jp(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${je(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${je(e.actorName)}</strong></p>
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
function jp(e) {
  const t = zp(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${je(o)}</li>`;
}
function zp(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = Sr(n?.value);
  return r === null ? null : {
    value: r,
    max: Sr(n?.max)
  };
}
function Sr(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Hp() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function je(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function At(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function Dr(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function Vp(e, t) {
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
function Gp(e) {
  return e.type === "ritual";
}
function Wp(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Kp(e) {
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
function Yp(e) {
  const t = e.actorUuid ? Qp(e.actorUuid) : null;
  if (ce(t)) return t;
  const n = e.actorId ? Zp(e.actorId) : null;
  return n || Xp(e.actorName);
}
function Qp(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Zp(e) {
  const n = game.actors?.get?.(e);
  if (ce(n)) return n;
  for (const r of Ta()) {
    const o = gn(r);
    if (o?.id === e) return o;
  }
  return null;
}
function Xp(e) {
  const t = Rt(e);
  if (!t) return null;
  for (const o of Ta()) {
    const a = Jp(o);
    if (Rt(a) === t) {
      const i = gn(o);
      if (i) return i;
    }
  }
  const r = game.actors?.find?.(
    (o) => ce(o) && Rt(o.name) === t
  );
  return ce(r) ? r : null;
}
function Ta() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Jp(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : gn(e)?.name ?? null;
}
function gn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ce(t)) return t;
  const n = e.document?.actor;
  return ce(n) ? n : null;
}
function Rt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ce(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Tt(e, t, n, r) {
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
function Pr(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Ct() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class eg {
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
class tg {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Ee(t).map((s) => this.analyzeRitual(s)), r = n.filter(xe("upToDate")), o = n.filter(xe("available")), a = n.filter(xe("outdated")), i = n.filter(xe("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = ng(t);
    return n ? r ? r.source.type !== "preset" ? be({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? be({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : be({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: rg(r, n.preset)
    }) : be({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : be({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function be(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? Ze(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function ng(e) {
  const t = e.getFlag(l, "automation");
  return Wt(t) ? t : null;
}
function rg(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function xe(e) {
  return (t) => t.status === e;
}
class og {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = Yt(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), o = J(t);
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
    const n = R(t.actorName), r = R(t.resource), o = R(Lr(t)), a = R(ig(t));
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
    const r = R(n.title ?? "Automação"), o = n.message ? `<p>${R(n.message)}</p>` : "", a = R(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), i = R(t.item.name ?? "Item sem nome"), s = t.targets.length > 0 ? t.targets.map((g) => R(g.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map(
      (g) => `<li><strong>${R(g.id)}:</strong> ${R(g.formula)} = ${g.total} <em>(${R(ag(g.intent))})</em>${g.damageType ? ` — ${R(g.damageType)}` : ""}</li>`
    ), m = t.ritualCosts.map(
      (g) => `<li><strong>${R(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${R(g.resource)} (${R(sg(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${R(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${R(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (g) => `<li><strong>${R(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${R(g.actorName)}:</strong> ${R(Lr(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), C = t.phases.map((g) => R(g)).join(" &rarr; ");
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
          ${m.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${m.join("")}</ul>` : ""}
          ${u.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Dano:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Cura:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${C.length > 0 ? `<p class="${l}-workflow-card__phases"><strong>Fases:</strong> ${C}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function ag(e) {
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
function Lr(e) {
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
function ig(e) {
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
function sg(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function R(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function lg() {
  const e = new ql(), t = new Oc(e), n = new Fl(), r = new Hl(), o = new Wl(r), a = new sc(e), i = new cc(), s = i.registerMany(
    mi()
  );
  if (!s.ok)
    throw new Error(s.error.message);
  const u = new lc(), m = new ac(), f = cd(), A = new eu(f), T = new tg(
    i
  ), C = new eg(
    T,
    u,
    m
  ), g = new Bc(), L = new og(g), ge = new xc(), he = new Nc(
    t,
    o,
    L,
    ge
  ), ye = new Mc(he, ge), I = new xp(
    ye,
    t,
    o,
    n,
    A,
    g
  );
  return I.addStrategy(
    new rc(
      (U) => I.handleItemUsed(U)
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
    chatMessages: L,
    workflowHooks: ge,
    automation: he,
    workflow: ye,
    itemUseIntegration: I,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: C
  };
}
const { ApplicationV2: cg } = foundry.applications.api;
class Ke extends cg {
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
      apply: Ke.onApply,
      cancel: Ke.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${N(Vt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${N(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${kt("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${kt("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${kt("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function kt(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${N(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? ug(n) : mg(t)}
    </section>
  `;
}
function ug(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(dg).join("")}</ol>`;
}
function dg(e) {
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
function mg(e) {
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
const Ye = `${l}.manageRitualPresets`, Nr = `__${l}_ritualPresetHeaderControlRegistered`, fg = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function pg(e) {
  const t = globalThis;
  if (!t[Nr]) {
    for (const n of fg)
      Hooks.on(n, (r, o) => {
        gg(r, o, e);
      });
    t[Nr] = !0, d.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function gg(e, t, n) {
  Array.isArray(t) && yg(e) && (hg(e, n), !t.some((r) => r.action === Ye) && t.push({
    action: Ye,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Ca(e, n);
    }
  }));
}
function hg(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Ye] && (e.options.actions[Ye] = (n) => {
    n.preventDefault(), n.stopPropagation(), Ca(e, t);
  }));
}
function yg(e) {
  if (!game.user?.isGM) return !1;
  const t = ka(e);
  return t ? t.type === "agent" && Ee(t).length > 0 : !1;
}
function Ca(e, t) {
  const n = ka(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Ke(n, t).render({ force: !0 });
}
function ka(e) {
  return vr(e.actor) ? e.actor : vr(e.document) ? e.document : null;
}
function vr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Qe = "ritualRollConfig";
function it() {
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
function bg(e) {
  const t = e.getFlag(l, Qe);
  return Ht(t);
}
function Ia(e) {
  return bg(e) ?? it();
}
async function Ag(e, t) {
  const n = Ht(t) ?? Ht({
    ...it(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(l, Qe, n), n;
}
async function Rg(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, l, Qe));
    return;
  }
  await e.setFlag(l, Qe, null);
}
function Ht(e) {
  if (!yn(e)) return null;
  const t = Cg(e.intent);
  if (!t) return null;
  const n = it();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Or(e.damageType),
    utilityLabel: Or(e.utilityLabel) ?? n.utilityLabel,
    note: hn(e.note),
    forms: kg(e.forms)
  };
}
function Tg(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Cg(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function kg(e) {
  const t = it();
  return yn(e) ? {
    base: It(e.base),
    discente: It(e.discente),
    verdadeiro: It(e.verdadeiro)
  } : t.forms;
}
function It(e) {
  return yn(e) ? { formula: hn(e.formula) } : { formula: "" };
}
function hn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Or(e) {
  const t = hn(e);
  return t.length > 0 ? t : null;
}
function yn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const wa = "data-paranormal-toolkit-ritual-roll-config", fe = "data-paranormal-toolkit-ritual-roll-field", ee = "data-paranormal-toolkit-ritual-roll-action", Fr = `__${l}_ritualRollConfigBlockRegistered`, Ig = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], wg = [
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
function $g() {
  const e = globalThis;
  if (!e[Fr]) {
    _g();
    for (const t of Ig)
      Hooks.on(t, (...n) => {
        Eg(n[0], n[1]);
      });
    e[Fr] = !0, d.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function _g() {
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
.${l}-ritual-roll-config__summary-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.28);
  font-size: 0.78rem;
  text-align: left;
}
.${l}-ritual-roll-config__summary-row span {
  font-weight: 700;
  opacity: 0.78;
}
.${l}-ritual-roll-config__summary-row strong {
  font-size: 0.84rem;
}
.${l}-ritual-roll-config__note-field {
  grid-column: 1 / -1;
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
  .${l}-ritual-roll-config__fields {
    grid-template-columns: 1fr;
  }
}
`, document.head.append(t);
}
function Eg(e, t) {
  const n = Gg(e);
  if (!n || n.type !== "ritual") return;
  const r = Kg(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  Dg(o);
  const a = _a(n), i = Ia(n), s = Wg(n), u = Pg(n, i, a, s);
  xg(u, n, a, s), Sg(o, u), bn(u);
}
function Sg(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function Dg(e) {
  for (const t of Array.from(e.querySelectorAll(`[${wa}]`)))
    t.remove();
}
function Pg(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${l}-ritual-roll-config`), o.setAttribute(wa, e.uuid ?? e.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${l}-ritual-roll-config__header`);
  const i = document.createElement("div");
  i.classList.add(`${l}-ritual-roll-config__title`), i.append(Mr("strong", "Paranormal Toolkit")), i.append(Mr("span", "Automação do ritual"));
  const s = document.createElement("span");
  s.classList.add(`${l}-ritual-roll-config__badge`), s.textContent = Da(t) ? "Configurada" : "Rascunho", a.append(i, s), o.append(a);
  const u = document.createElement("p");
  u.classList.add(`${l}-ritual-roll-config__hint`), u.textContent = "Configure uma rolagem principal por forma. Resistência, formas, círculo, alvo e duração continuam vindo da ficha original.", o.append(u);
  const m = document.createElement("div");
  m.classList.add(`${l}-ritual-roll-config__fields`), m.append(Lg(t, r)), m.append(Ng(t, r)), m.append(vg(t, r)), m.append(Og(e)), m.append(wt("base", "Padrão", t.forms.base.formula, !0, r)), m.append(wt("discente", "Discente", t.forms.discente.formula, n.discente, r)), m.append(wt("verdadeiro", "Verdadeiro", t.forms.verdadeiro.formula, n.verdadeiro, r)), m.append(Fg(t, r)), o.append(m), o.append(Mg(r));
  const f = document.createElement("p");
  return f.classList.add(`${l}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function Lg(e, t) {
  const n = Pe("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(fe, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = Tg(o), a.selected = e.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function Ng(e, t) {
  const n = Pe("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(fe, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const a of wg) {
    const i = document.createElement("option");
    i.value = a.value, i.textContent = a.label, i.selected = e.damageType === a.value, r.append(i);
  }
  return n.append(r), n;
}
function vg(e, t) {
  const n = Pe("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(fe, "utilityLabel"), n.append(r), n;
}
function Og(e) {
  const t = document.createElement("div");
  t.classList.add(`${l}-ritual-roll-config__summary-row`);
  const n = document.createElement("span");
  n.textContent = "Resistência da ficha";
  const r = document.createElement("strong");
  return r.textContent = zg(e), t.append(n, r), t;
}
function wt(e, t, n, r, o) {
  const a = Pe(t);
  a.classList.add(`${l}-ritual-roll-config__form-field`), a.dataset.ritualRollForm = e;
  const i = document.createElement("input");
  if (i.type = "text", i.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", i.value = n, i.disabled = !o || !r, i.setAttribute(fe, `formula.${e}`), a.append(i), !r) {
    const s = document.createElement("small");
    s.textContent = "Indisponível neste ritual.", a.append(s);
  }
  return a;
}
function Fg(e, t) {
  const n = Pe("Nota");
  n.classList.add(`${l}-ritual-roll-config__note-field`);
  const r = document.createElement("textarea");
  return r.rows = 2, r.placeholder = "Ex.: O conjurador pode recuperar PV conforme o dano causado.", r.value = e.note, r.disabled = !t, r.setAttribute(fe, "note"), n.append(r), n;
}
function Mg(e) {
  const t = document.createElement("div");
  t.classList.add(`${l}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar automação", n.disabled = !e, n.setAttribute(ee, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(ee, "clear"), t.append(n, r), t;
}
function Pe(e) {
  const t = document.createElement("label");
  t.classList.add(`${l}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Mr(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function xg(e, t, n, r) {
  pe(e, "intent")?.addEventListener("change", () => bn(e)), qr(e, "system.studentForm")?.addEventListener("change", () => xr(e, t)), qr(e, "system.trueForm")?.addEventListener("change", () => xr(e, t)), e.querySelector(`[${ee}="save"]`)?.addEventListener("click", () => {
    r && Bg(e, t, n);
  }), e.querySelector(`[${ee}="clear"]`)?.addEventListener("click", () => {
    r && Ug(e, t);
  });
}
async function Bg(e, t, n) {
  const r = e.querySelector(`[${ee}="save"]`);
  r?.setAttribute("disabled", "true"), se(e, "Salvando configuração...");
  try {
    const o = qg(e, n);
    await Ag(t, o), $a(e, o), se(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), se(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function Ug(e, t) {
  const n = e.querySelector(`[${ee}="clear"]`);
  n?.setAttribute("disabled", "true"), se(e, "Limpando configuração...");
  try {
    await Rg(t);
    const r = Ia(t);
    jg(e, r), $a(e, r), se(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), se(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function $a(e, t) {
  const n = e.querySelector(`.${l}-ritual-roll-config__badge`);
  n && (n.textContent = Da(t) ? "Configurada" : "Rascunho");
}
function qg(e, t) {
  return {
    schemaVersion: 1,
    intent: Sa(pe(e, "intent")?.value),
    damageType: jr(e, "damageType"),
    utilityLabel: jr(e, "utilityLabel") ?? "Resultado",
    note: ke(e, "note"),
    forms: {
      base: { formula: ke(e, "formula.base") },
      discente: { formula: ke(e, "formula.discente") },
      verdadeiro: { formula: ke(e, "formula.verdadeiro") }
    }
  };
}
function jg(e, t) {
  Y(e, "intent", t.intent), Y(e, "damageType", t.damageType ?? ""), Y(e, "utilityLabel", t.utilityLabel ?? "Resultado"), Y(e, "note", t.note), Y(e, "formula.base", t.forms.base.formula), Y(e, "formula.discente", t.forms.discente.formula), Y(e, "formula.verdadeiro", t.forms.verdadeiro.formula), bn(e);
}
function bn(e) {
  const t = Sa(pe(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function xr(e, t) {
  const n = _a(t);
  Br(e, "discente", n.discente), Br(e, "verdadeiro", n.verdadeiro);
}
function Br(e, t, n) {
  const r = pe(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${ee}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const a = r.closest(`.${l}-ritual-roll-config__field`), i = a?.querySelector("small");
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
function se(e, t) {
  const n = e.querySelector(`.${l}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function _a(e) {
  const t = Ea(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function zg(e) {
  const t = Ea(e), n = typeof t.skillResis == "string" ? t.skillResis : "", r = typeof t.resistance == "string" ? t.resistance : "";
  if (!n) return "Nenhuma";
  const o = Ur("dropdownSkillResis", n) ?? Hg(n), a = r ? Ur("dropdownResistance", r) ?? Vg(r) : null;
  return a ? `${o} / ${a}` : o;
}
function Ur(e, t) {
  const r = CONFIG.op?.[e];
  if (!Pa(r)) return null;
  const o = r[t];
  return typeof o != "string" ? null : game.i18n.localize(o);
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
function Vg(e) {
  switch (e) {
    case "reducesByHalf":
      return "Reduz à metade";
    case "nullifies":
      return "Anula";
    case "partial":
      return "Parcial";
    case "discredits":
      return "Desacredita";
    default:
      return e;
  }
}
function Gg(e) {
  return zr(e.item) ? e.item : zr(e.document) ? e.document : null;
}
function Wg(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function Ea(e) {
  const t = e.system;
  return Pa(t) ? t : {};
}
function qr(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function pe(e, t) {
  return e.querySelector(`[${fe}="${Yg(t)}"]`);
}
function ke(e, t) {
  return pe(e, t)?.value.trim() ?? "";
}
function jr(e, t) {
  const n = ke(e, t);
  return n.length > 0 ? n : null;
}
function Y(e, t, n) {
  const r = pe(e, t);
  r && (r.value = n);
}
function Sa(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Da(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function Kg(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function zr(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function Pa(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function Yg(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let X = null;
Hooks.once("init", () => {
  li(), Li(), ds(), Dl(), d.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Sn.isSupportedSystem()) {
    d.warn(
      `Sistema não suportado: ${Sn.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  X = lg(), X.itemUseIntegration.registerStrategies(), ss(X.conditions), Hi(X), ts(), Zi(), pg(X), $g(), d.info("Inicializado para o sistema Ordem Paranormal."), d.info(
    `API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Vt} inicializado.`);
});
function Qg() {
  if (!X)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return X;
}
export {
  Qg as getToolkitServices
};
//# sourceMappingURL=main.js.map
