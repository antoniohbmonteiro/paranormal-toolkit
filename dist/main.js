const l = "paranormal-toolkit", Kt = "Paranormal Toolkit", va = "ordemparanormal";
class $e {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Xe(e) {
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
function Yt(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Qt(t) ? y(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Na(e) {
  return Qt(e.getFlag(l, "automation"));
}
function Qt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Fa(t.source) && Oa(t.definition);
}
function Oa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && k(t.label) && Array.isArray(t.steps) && t.steps.every(Ma) && (t.conditionApplications === void 0 || za(t.conditionApplications));
}
function Fa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? k(t.presetId) && k(t.presetVersion) && k(t.appliedAt) : t.type === "manual" ? k(t.label) && k(t.appliedAt) : !1;
}
function Ma(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return xa(t);
    case "spendRitualCost":
      return Ba(t);
    case "rollFormula":
      return Ua(t);
    case "modifyResource":
      return qa(t);
    case "chatCard":
      return ja(t);
    default:
      return !1;
  }
}
function xa(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Hr(t);
}
function Ba(e) {
  return e.type === "spendRitualCost";
}
function Ua(e) {
  const t = e;
  return t.type === "rollFormula" && k(t.id) && k(t.formula) && (t.intent === void 0 || Ya(t.intent)) && (t.damageType === void 0 || k(t.damageType));
}
function qa(e) {
  const t = e;
  return t.type === "modifyResource" && Gr(t.actor) && Wa(t.resource) && Ka(t.operation) && Hr(t) && (t.damageType === void 0 || t.damageType === null || k(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function ja(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function za(e) {
  return Array.isArray(e) && e.every(Va);
}
function Va(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return k(t.id) && Gr(t.actor) && k(t.conditionId) && (t.label === void 0 || k(t.label)) && (t.duration === void 0 || t.duration === null || Ha(t.duration)) && (t.source === void 0 || k(t.source)) && (t.actionSectionId === void 0 || k(t.actionSectionId)) && (t.actionSectionTitle === void 0 || k(t.actionSectionTitle)) && (t.executedLabel === void 0 || k(t.executedLabel));
}
function Ha(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Qa(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Ga(t.expiry));
}
function Ga(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Hr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || k(e.amountFrom);
}
function Gr(e) {
  return e === "self" || e === "target";
}
function Wa(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ka(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Ya(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Qa(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function k(e) {
  return typeof e == "string" && e.length > 0;
}
function Zt(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Cn);
    if (Ja(t))
      return Array.from(t).filter(Cn);
  }
  return [];
}
function Za(e) {
  return Zt(e)[0] ?? null;
}
function Xa(e) {
  return Zt(e).find(Na) ?? null;
}
function Ja(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Cn(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function _e(e) {
  return Zt(e).filter((t) => t.type === "ritual");
}
function Wr(e) {
  return _e(e)[0] ?? null;
}
function ei(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Xe);
      return d.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Ae("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Pe(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(wn);
      return d.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Ae("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Pe(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await St(e, r, o.value);
      d.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Ae("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Pe(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        d.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await St(e, n, r.preset);
      d.info(`Melhor preset aplicado em ${n.name}.`, { match: wn(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return kn(e);
    },
    async applyBestPresetsToActorRituals() {
      return kn(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Ae("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Pe(t);
      n && (await e.automationBinder.clear(n), d.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function kn(e) {
  const t = Ae("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = _e(t);
  if (n.length === 0)
    return d.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), In(t);
  const r = In(t, n.length);
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
    const i = await St(e, o, a.preset);
    r.applied.push(ti(o, a, i));
  }
  return d.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), ni(r), r;
}
async function St(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function ti(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Xe(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function In(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function ni(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function wn(e) {
  return {
    preset: Xe(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Ae(e) {
  const t = $e.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Pe(e) {
  const t = Wr(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function X(e) {
  return e ? {
    id: e.id,
    source: {
      ...ri(e.sourceActor),
      token: e.sourceToken
    },
    item: oi(e.item),
    targets: e.targets.map(ai),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: $n(e.rollRequests, Kr),
    rolls: $n(e.rolls, ii),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Xt),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Xt(e) {
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
function ri(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function oi(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function ai(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Kr(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ii(e) {
  return {
    ...Kr(e),
    total: e.total
  };
}
function $n(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function si(e) {
  return {
    getSelected() {
      return $e.getSelectedActor();
    },
    logResources() {
      const t = H(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      d.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && d.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await te(
        e,
        "Gasto de PE",
        H("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await te(
        e,
        "Gasto de PD",
        H("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await te(
        e,
        "Dano em PV",
        H("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await te(
        e,
        "Cura de PV",
        H("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await te(
        e,
        "Dano em SAN",
        H("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await te(
        e,
        "Recuperação de SAN",
        H("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function te(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    li(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (i) {
    d.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  d.info(`${t} realizado:`, Xt(a));
}
function H(e) {
  const t = $e.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function li(e) {
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
const N = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function ci() {
  Le(N.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Le(N.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Le(N.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Le(N.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Dt() {
  return {
    enabled: ve(N.enabled),
    console: ve(N.console),
    ui: ve(N.ui),
    chat: ve(N.chat)
  };
}
async function q(e, t) {
  await game.settings.set(l, N[e], t);
}
function Le(e, t) {
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
function di() {
  return {
    status() {
      return Dt();
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
const Yr = "ritual.costOnly", Qr = "ritual.simpleHealing", mi = "ritual.eletrocussao", Zr = "ritual.simpleDamage", Xr = "generic.simpleHealing", Jr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function fi() {
  return [
    pi(),
    gi(),
    hi(),
    yi(),
    bi()
  ];
}
function pi() {
  return {
    id: Yr,
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
function gi() {
  return {
    id: Qr,
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
    automation: eo(),
    itemPatch: Ri()
  };
}
function hi() {
  return {
    id: mi,
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
    automation: Ai(),
    itemPatch: Ti()
  };
}
function yi() {
  return {
    id: Zr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Jt()
  };
}
function bi() {
  return {
    id: Xr,
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
function eo(e = "2d8+2") {
  return to(
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
function Ai() {
  return {
    ...Jt("3d6", {
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
function Jt(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return to(
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
function Ri() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Jr,
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
function Ti() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Jr,
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
function to(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function en() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: re(t.id),
    actorId: re(t.actor?.id),
    sceneId: re(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function no() {
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
function Ci(e) {
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
        if (!wi(t, n)) {
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
      const r = e.automationRegistry.require(Yr);
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
      if (!_n(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Qr);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: eo(t)
      }), d.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = G("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = W(n);
      if (!r) return;
      if (!_n(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Zr);
      if (!o.ok) {
        d.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Jt(t)
      }), d.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = G("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = W(t);
      n && await ki(e, t, n);
    }
  };
}
async function ki(e, t, n) {
  const r = Yt(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: no(),
    item: n,
    targets: en()
  });
  if (!o.ok) {
    Ii(o.error);
    return;
  }
  d.info("Automação de ritual executada com sucesso.", X(o.value.context));
}
function Ii(e) {
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
  const t = $e.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function W(e) {
  const t = Wr(e);
  return t || (d.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function wi(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function _n(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const $i = ["disabled", "ask", "automatic"], _i = ["buttons", "confirm"], ro = "ask";
function Ei(e) {
  return typeof e == "string" && $i.includes(e);
}
function Si(e) {
  return typeof e == "string" && _i.includes(e);
}
function Di(e) {
  return Ei(e) ? e : Si(e) ? "ask" : ro;
}
const Pi = ["keep", "replace"], oo = "keep", Li = !0, O = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function vi() {
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
    default: ro
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
    default: oo
  }), game.settings.register(l, O.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Li
  }), game.settings.register(l, O.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function En() {
  const e = Di(game.settings.get(l, O.executionMode)), t = io(game.settings.get(l, O.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: ao()
  };
}
function Ni() {
  return io(game.settings.get(l, O.systemCardMode));
}
function ao() {
  return game.settings.get(l, O.ritualCastingCheckEnabled) === !0;
}
async function K(e) {
  await game.settings.set(l, O.executionMode, e);
}
function io(e) {
  return Pi.includes(e) ? e : oo;
}
function Oi(e) {
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
const Fi = [
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
function Mi(e) {
  return {
    phases() {
      return Fi;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = ut("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Xa(t);
      if (!n) {
        d.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Sn(e, t, n);
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
      if (!Ui(n)) {
        d.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Bi(n) ?? ut("Nenhum ator encontrado para executar automação do item.");
      r && await Sn(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = ut("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Za(t);
      if (!n) {
        d.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Xr);
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
async function Sn(e, t, n) {
  const r = Yt(n);
  if (!r.ok) {
    d.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: no(),
    item: n,
    targets: en()
  });
  if (!o.ok) {
    xi(o.error);
    return;
  }
  d.info("Automação executada com sucesso.", X(o.value.context));
}
function xi(e) {
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
function ut(e) {
  const t = $e.getSelectedActor();
  return t || (d.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Bi(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Ui(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function qi(e) {
  const t = si(e), n = ei(e), r = Ci(e), o = Mi(e), a = di(), i = Oi(e);
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
function ji(e) {
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
      const r = Dn();
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
      return zi(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Dn();
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
      return Vi(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Dn() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function zi(e) {
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
function Vi(e) {
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
    conditions: ji(e.conditions),
    debug: qi(e)
  }, n = globalThis;
  return n[l] = t, n.ParanormalToolkit = t, t;
}
class Pn {
  static isSupportedSystem() {
    return game.system.id === va;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Gi() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: oe(t.id),
    actorId: oe(t.actor?.id),
    sceneId: oe(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function so() {
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
function Wi(e, t = so()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Ki(e) {
  if (!Zi(e)) return null;
  const t = e.getFlag(l, "workflow");
  return Qi(t) ? t : null;
}
function Yi() {
  return `flags.${l}.workflow`;
}
function Ln(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${l}`), n = foundry.utils.getProperty(e, `_source.flags.${l}`);
  return t !== void 0 || n !== void 0;
}
function vn(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Pt(t) || Pt(n);
}
function Qi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Zi(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function oe(e) {
  return Pt(e) ? e : null;
}
function Pt(e) {
  return typeof e == "string" && e.length > 0;
}
function Xi() {
  const e = (t, n) => {
    Ji(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Ji(e, t) {
  const n = Ki(e);
  if (!n || n.targets.length === 0) return;
  const r = ts(t);
  if (!r || r.querySelector(`.${l}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(es(n));
}
function es(e) {
  const t = document.createElement("section");
  t.classList.add(`${l}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Nn("Origem", e.source.name)), t.append(Nn("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Nn(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${l}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function ts(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function ns() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!rs(r) || !os(e) || Ln(e) || Ln(t)) return;
    const o = Gi();
    if (o.length === 0 || !vn(e) && !vn(t)) return;
    const a = so();
    e.updateSource({
      [Yi()]: Wi(o, a)
    }), d.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function rs(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function os(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let On = !1, dt = !1, mt = !1, Ne = null;
const as = 1e3, is = 750, ss = 1e3;
function ls(e) {
  On || (Hooks.on("combatTurnChange", (t) => {
    us(e, Fn(t));
  }), Hooks.on("deleteCombat", (t) => {
    ds(e, Fn(t));
  }), On = !0, cs(e));
}
function cs(e) {
  Je() && (dt || (dt = !0, globalThis.setTimeout(() => {
    dt = !1, tn(e, "ready");
  }, as)));
}
function us(e, t) {
  Je() && t && (Ne && globalThis.clearTimeout(Ne), Ne = globalThis.setTimeout(() => {
    Ne = null, tn(e, "combat-turn-change", t);
  }, is));
}
function ds(e, t) {
  Je() && t && (mt || (mt = !0, globalThis.setTimeout(() => {
    mt = !1, tn(e, "combat-deleted", t);
  }, ss)));
}
async function tn(e, t, n) {
  if (Je())
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
function Je() {
  return game.user?.isGM === !0;
}
function Fn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const lo = {
  enabled: "dice.animations.enabled"
};
function ms() {
  game.settings.register(l, lo.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function fs() {
  return {
    enabled: game.settings.get(l, lo.enabled) === !0
  };
}
const ps = "chatCard", Mn = "data-paranormal-toolkit-prompt-id", c = `${l}-item-use-prompt`, gs = `.${c}__title`, co = `.${c}__header`, hs = `.${c}__roll-card`, ys = `.${c}__roll-meta`, bs = `.${c}__roll-meta-pill`, As = `.${c}__resistance`, Rs = `.${c}__resistance-header`, uo = `.${c}__resistance-description`, Ts = `.${c}__resistance-roll-button`, Cs = `.${c}__resistance-roll-result`, xn = `${c}__resistance-content`, mo = `.${c}__workflow-section`, fo = `.${c}__workflow-roll`, po = `${c}__workflow-roll--dice-open`, go = `.${c}__workflow-roll-formula`, ho = `${c}__workflow-roll-formula--toggle`, nn = `.${c}__workflow-dice-tray`, ks = `.${c}__roll-detail-toggle`, Is = `.${c}__roll-detail-list`, ws = `.${c}__ritual-element-badge`, $s = `.${c}__ritual-metadata`, _s = "casting-backlash", Es = "data-paranormal-toolkit-action-section", Ss = "data-paranormal-toolkit-prompt-id", Ds = "data-paranormal-toolkit-pending-id", Bn = "data-paranormal-toolkit-casting-backlash-enhanced", Un = `.${c}`, Ps = `.${c}__workflow-section--casting`, Ls = `.${c}__workflow-section-header`, vs = `.${c}__workflow-notes`, Ns = `[${Es}="${_s}"]`, qn = `${c}__workflow-section-title-row`, Os = `${c}__workflow-section-header--casting-backlash`, yo = `${c}__casting-backlash-button`;
function Fs(e) {
  for (const t of Ms(e))
    xs(t), zs(t);
}
function Ms(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Un) && t.add(e);
  for (const n of e.querySelectorAll(Un))
    t.add(n);
  return Array.from(t);
}
function xs(e) {
  const t = e.querySelector(Ns);
  if (!t) return;
  const n = Bs(t);
  if (!n) return;
  const r = e.querySelector(`${Ps} ${Ls}`);
  r && (r.classList.add(Os), Us(r), qs(n), r.append(n), t.remove());
}
function Bs(e) {
  return e.querySelector(
    `button[${Ds}], button[${Ss}]`
  );
}
function Us(e) {
  const t = e.querySelector(`:scope > .${qn}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(qn);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(yo) || n.append(o));
  return n;
}
function qs(e) {
  if (e.getAttribute(Bn) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = js(t, e.disabled);
  e.classList.add(yo), e.setAttribute(Bn, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function js(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function zs(e) {
  for (const t of e.querySelectorAll(vs)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Vs(e) {
  for (const t of Array.from(e.querySelectorAll(mo)))
    for (const n of Array.from(t.querySelectorAll(`${ks}, ${Is}`)))
      n.remove();
}
function Hs(e) {
  for (const t of Array.from(e.querySelectorAll(As)))
    Gs(t);
}
function Gs(e) {
  const t = e.querySelector(Rs), n = e.querySelector(uo), r = e.querySelector(Ts), o = e.querySelector(Cs);
  if (!r || !t && !n && !o) return;
  const a = Ws(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && o.parentElement !== a && !r.contains(o) && a.append(o), r.parentElement !== e && e.append(r);
}
function Ws(e, t) {
  const n = e.querySelector(`.${xn}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(xn), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function jn(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function rn() {
  const e = globalThis.game;
  return et(e) ? e : null;
}
function S(e, t) {
  const n = Ks(e, t);
  return xe(n);
}
function Ks(e, t) {
  return t.split(".").reduce((n, r) => et(n) ? n[r] : null, e);
}
function Ys(e, t) {
  const n = e.indexOf(":");
  return n < 0 || Ie(e.slice(0, n)) !== Ie(t) ? null : de(e.slice(n + 1));
}
function xe(e) {
  return typeof e == "string" ? de(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function et(e) {
  return !!e && typeof e == "object";
}
function Qs(e) {
  return typeof e == "string";
}
function tt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function de(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function Ie(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Lt(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function z(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function bo(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Zs(e) {
  for (const t of Array.from(e.querySelectorAll(hs))) {
    const n = ol(t);
    Xs(t), n && (Js(t, n), el(t, n));
  }
}
function Xs(e) {
  for (const t of Array.from(e.querySelectorAll(ys)))
    t.remove();
}
function Js(e, t) {
  const r = e.closest(`.${c}`)?.querySelector(co) ?? null, o = r?.querySelector(gs) ?? null, a = r ?? e, i = a.querySelector(ws);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const s = i ?? document.createElement("span");
  if (s.className = Tl(t.elementTone), s.textContent = Rl(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", s);
      return;
    }
    a.prepend(s);
  }
}
function el(e, t) {
  const n = tl(e);
  nl(e, n);
  const r = rl(t);
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
  const a = e.querySelector(mo);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function tl(e) {
  return e.closest(`.${c}`)?.querySelector(co) ?? null;
}
function nl(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll($s)))
      o.remove();
}
function rl(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Lt(e.target)}` : null,
    e.duration ? `Duração: ${Lt(e.duration)}` : null,
    e.resistance ? `Resistência: ${bo(e.resistance)}` : null
  ].filter(tt);
}
function ol(e) {
  const t = al(e), n = dl(e), o = (t ? ul(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = on(S(o, "element")), s = M("op.elementChoices", i) ?? zn(Q(a, "Elemento")) ?? zn(n.damageType), u = i ?? Cl(s), m = S(o, "circle") ?? Q(a, "Círculo"), f = pl(o) ?? Q(a, "Alvo"), A = bl(o, "duration", "op.durationChoices") ?? Q(a, "Duração"), T = ml(e) ?? hl(o) ?? Q(a, "Resistência"), C = fl(a) ?? n.cost, g = {
    elementLabel: s,
    elementTone: u,
    circle: m,
    cost: C,
    target: f,
    duration: A,
    resistance: T
  };
  return Al(g) ? g : null;
}
function al(e) {
  const t = il(e);
  if (!t) return null;
  const n = t.getFlag?.(l, ps), r = ll(n);
  if (r.length === 0) return null;
  const o = sl(e);
  if (o.size > 0) {
    const a = r.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function il(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? rn()?.messages?.get?.(n) ?? null : null;
}
function sl(e) {
  const t = e.closest(`.${c}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${Mn}]`))) {
    const o = r.getAttribute(Mn)?.trim();
    o && n.add(o);
  }
  return n;
}
function ll(e) {
  if (!et(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(cl).filter((n) => n !== null) : [];
}
function cl(e) {
  return et(e) ? {
    pendingId: xe(e.pendingId),
    actorId: xe(e.actorId),
    itemId: xe(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Qs) : []
  } : null;
}
function ul(e) {
  if (!e.itemId) return null;
  const t = rn(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function dl(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(bs))) {
    const o = de(r.textContent);
    if (!o) continue;
    const a = Ys(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function ml(e) {
  const t = de(e.querySelector(uo)?.textContent);
  return t ? bo(t) : null;
}
function Q(e, t) {
  const n = Ie(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || Ie(r.slice(0, o)) !== n))
      return de(r.slice(o + 1));
  }
  return null;
}
function fl(e) {
  const t = Q(e, "Custo") ?? Q(e, "PE");
  return t || (e.map(de).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function pl(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return gl(e) ?? M("op.targetChoices", t) ?? "Área";
  const n = M("op.targetChoices", t) ?? z(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, n].filter(tt).join(" ");
}
function gl(e) {
  const t = S(e, "area.name"), n = S(e, "area.size"), r = S(e, "area.type"), o = t ? M("op.areaChoices", t) ?? z(t) : null, a = r ? M("op.areaTypeChoices", r) ?? z(r) : null;
  return o ? n ? a ? `${o} ${n}m ${Lt(a)}` : `${o} ${n}m` : o : null;
}
function hl(e) {
  const t = S(e, "skillResis"), n = S(e, "resistance");
  if (!t || !n) return null;
  const r = M("op.skill", t) ?? z(t), o = yl(n);
  return [r, o].filter(tt).join(" ");
}
function yl(e) {
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
function bl(e, t, n) {
  const r = S(e, t);
  return r ? M(n, r) ?? z(r) : null;
}
function Al(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Rl(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Tl(e) {
  return [
    `${c}__ritual-element-badge`,
    e ? `${c}__ritual-element-badge--${e}` : null
  ].filter(tt).join(" ");
}
function on(e) {
  const t = Ie(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function zn(e) {
  const t = on(e);
  return t ? M("op.elementChoices", t) ?? z(t) : e ? z(e) : null;
}
function Cl(e) {
  return on(e);
}
function M(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = rn()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Vn = "data-paranormal-toolkit-dice-toggle-enhanced";
function kl(e) {
  for (const t of Array.from(e.querySelectorAll(fo)))
    Ao(t);
}
function Il(e) {
  const t = To(e.target);
  if (!t) return;
  const n = an(t);
  n && (e.preventDefault(), Ro(n, t));
}
function wl(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = To(e.target);
  if (!t) return;
  const n = an(t);
  n && (e.preventDefault(), Ro(n, t));
}
function Ao(e) {
  const t = e.querySelector(nn);
  if (!t) return;
  const n = e.querySelector(go);
  if (n && n.getAttribute(Vn) !== "true" && (n.setAttribute(Vn, "true"), n.classList.add(ho), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Ro(e, t) {
  const n = e.querySelector(nn);
  if (!n) return;
  const r = !e.classList.contains(po);
  $l(e, t, n, r);
}
function $l(e, t, n, r) {
  e.classList.toggle(po, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function To(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(go);
  if (!t) return null;
  const n = an(t);
  return n ? (Ao(n), t.classList.contains(ho) ? t : null) : null;
}
function an(e) {
  const t = e.closest(fo);
  return t && t.querySelector(nn) ? t : null;
}
const Hn = `${l}-workflow-dice-toggle-styles`;
function _l() {
  if (document.getElementById(Hn)) return;
  const e = document.createElement("style");
  e.id = Hn, e.textContent = `
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
const El = [0, 100, 500, 1500, 3e3];
let Gn = !1, ft = null;
function Sl() {
  if (!Gn) {
    Gn = !0, _l(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Re(jn(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Re(jn(t));
    }), Hooks.once("ready", () => {
      Re(document), Dl();
    }), document.addEventListener("click", Il), document.addEventListener("keydown", wl);
    for (const e of El)
      globalThis.setTimeout(() => Re(document), e);
  }
}
function Dl() {
  ft || !document.body || (ft = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Re(n);
  }), ft.observe(document.body, { childList: !0, subtree: !0 }));
}
function Re(e) {
  e && (Vs(e), Zs(e), Hs(e), kl(e), Fs(e));
}
function Pl() {
  Sl();
}
const Ll = {
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
}, vl = new Set(
  Object.values(Ll)
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
function Ol(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Fl(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Nl[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : vl.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function Co(e) {
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
function Fl(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Ml {
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
      const A = xl(f, m);
      if (!A.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const T = Ol(f.damageType);
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
          Bl(A.id, f, T.value)
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
        for (const L of ql(C.conditions))
          s.add(L);
        const g = Ul(C.newPV);
        g !== null && (u = g), i.push({
          id: A.id,
          label: f.label ?? Co(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: A.amount,
          finalDamage: Wn(C.finalDamage, A.amount),
          blocked: Wn(C.blocked, 0),
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
function xl(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Bl(e, t, n) {
  return {
    id: e,
    label: t.label ?? Co(n),
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
function Wn(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Ul(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ql(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const Te = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, ko = {
  PV: "system.attributes.hp"
}, vt = {
  PV: [Te.PV, ko.PV],
  SAN: [Te.SAN],
  PE: [Te.PE],
  PD: [Te.PD]
}, Nt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class jl {
  getResource(t, n) {
    const r = Kn(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, i = `${o}.max`, s = foundry.utils.getProperty(t, a), u = foundry.utils.getProperty(t, i), m = Qn(t, n, a, s, "valor atual");
    if (m) return p(m);
    const f = Qn(t, n, i, u, "valor máximo");
    return f ? p(f) : y({
      value: s,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = Kn(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function Kn(e, t) {
  const n = zl(e.type, t);
  if (n && Yn(e, n))
    return y(n);
  const r = vt[t].find(
    (o) => Yn(e, o)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Vl(e, t),
    path: vt[t].join(" | ")
  });
}
function zl(e, t) {
  return e === "threat" ? ko[t] ?? null : e === "agent" ? Te[t] : null;
}
function Yn(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Vl(e, t) {
  const n = e.type ?? "unknown", r = vt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Qn(e, t, n, r, o) {
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
      const i = Nt.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: r, value: o } = n, a = Gl(o);
    return a ? y(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Nt.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Gl(e) {
  if (Zn(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Zn(n))
      return n;
  }
  return null;
}
function Zn(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Wl = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Kl {
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
    const r = n.value, o = Yl(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: Wl[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Yl(e, t) {
  const n = e.getFlag(l, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Ql(n) ? {
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
function Ql(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const pt = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Zl(e) {
  if (!rc(e.item)) return null;
  const t = Ot(e.actor) ? e.actor : Xl(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: ec(e.token) ?? Jl(t),
    targets: en(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Xl(e) {
  const t = e;
  return Ot(t.actor) ? t.actor : Ot(e.parent) ? e.parent : null;
}
function Jl(e) {
  const t = tc(e) ?? nc(e);
  return t ? Io(t) : null;
}
function ec(e) {
  return Ft(e) ? Io(e) : null;
}
function tc(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Ft(n) ? n : (t.getActiveTokens?.() ?? []).find(Ft) ?? null;
}
function nc(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Io(e) {
  const t = e.actor ?? null;
  return {
    tokenId: gt(e.id),
    actorId: gt(t?.id),
    sceneId: gt(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function rc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ot(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Ft(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function gt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class oc {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(pt.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, d.info(`${pt.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Zl(ac(t));
    if (!n) {
      d.warn(`${pt.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function ac(e) {
  return e && typeof e == "object" ? e : {};
}
class ic {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return ht("missing-item-patch");
    if (t.type !== "ritual") return ht("unsupported-item-type");
    const o = sc(r);
    return Object.keys(o).length === 0 ? ht("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function sc(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (w(t, "system.circle", n.circle), w(t, "system.element", n.element), w(t, "system.target", n.target), w(t, "system.targetQtd", n.targetQuantity), w(t, "system.execution", n.execution), w(t, "system.range", n.range), w(t, "system.duration", n.duration), w(t, "system.skillResis", n.resistanceSkill), w(t, "system.resistance", n.resistance), w(t, "system.studentForm", n.studentForm), w(t, "system.trueForm", n.trueForm)), t;
}
function w(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function ht(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class lc {
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
    return this.getNumber(t, Nt.ritual.dt, 0);
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
class cc {
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
class uc {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = dc(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, yt(t)), y(t)) : n;
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
    return n ? yt(n) : null;
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
    return Array.from(this.presets.values()).map(yt);
  }
  findForItem(t) {
    return this.list().map((n) => mc(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function dc(e) {
  return !bt(e.id) || !bt(e.version) || !bt(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function mc(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = fc(o, t);
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
function fc(e, t) {
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
      const n = Xn(t.name), r = e.names.map(Xn).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = pc(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Xn(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function pc(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function yt(e) {
  return structuredClone(e);
}
function bt(e) {
  return typeof e == "string" && e.length > 0;
}
function ze(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = nt(e.amountFrom);
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
function nt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const gc = "dice-so-nice";
async function wo(e) {
  if (!fs().enabled || !hc()) return;
  const t = yc();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      d.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function hc() {
  return game.modules.get(gc)?.active === !0;
}
function yc() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function bc(e, t, n) {
  if (!Jn(e.id) || !Jn(e.formula))
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
    await wo(o);
    const s = {
      ...n.rollRequests[e.id] ?? $o(e, t),
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
function $o(e, t) {
  const n = e.intent ?? Ac(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function Ac(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Jn(e) {
  return typeof e == "string" && e.length > 0;
}
async function Ve(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Oe(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Oe(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? Oe(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? Oe(t, n, r, o) : e.recover(t, n, o);
  }
}
function Oe(e, t, n, r) {
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
function Rc(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = Tc(t, n, r, o);
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
    const i = Cc(t, n, r, o);
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
function Tc(e, t, n, r) {
  const o = nt(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: _o(t.id, "damage", r, t.damageInstances.length),
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
function Cc(e, t, n, r) {
  const o = nt(e.amountFrom);
  return {
    id: _o(t.id, "healing", r, t.healingInstances.length),
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
function _o(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function kc(e, t, n) {
  const r = nt(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function Ic(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Eo("before", e), er("before", e), er("resolve", e);
}
function wc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Eo("apply", e);
}
function $c(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Eo(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t, s = _c(e, n.operation);
  s && i.emit(s, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function er(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t;
  n.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function _c(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Ec(e, t, n) {
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
async function Sc(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Dc(e, t);
    case "spendRitualCost":
      return Pc(e, t);
  }
}
async function Dc(e, t) {
  const { context: n, resources: r } = e, o = ze(t, n);
  return o.ok ? So(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function Pc(e, t) {
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
  }), So(await r.spend(n.sourceActor, i.resource, i.amount), n, t);
}
function So(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Lc(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, i = vc(t);
  for (const u of i.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const s = await a();
  if (!s.ok)
    return s;
  for (const u of i.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return s;
}
function vc(e) {
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
        return Lc({
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
    const o = await Sc({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = $o(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const i = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, i), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: i }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await bc(t, r, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = ze(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = kc(t, n, o.value);
    Ic({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), wc({
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
      const u = await Ve(this.resources, s, t.resource, t.operation, o.value), m = this.handleResourceOperationResult(u, n, r, t);
      if (!m.ok)
        return m;
      Rc({
        step: t,
        context: n,
        transaction: m.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return $c({
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
      const s = await Ve(this.resources, i, t.resource, t.operation, o.value), u = this.handleResourceOperationResult(s, n, r, t);
      if (!u.ok)
        return u;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await Ec(this.messages, t, n);
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
    const s = Oc(t, n.intent);
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
function Oc(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Fc {
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
function Do(e) {
  return {
    id: Mc(),
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
function Mc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class xc {
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
    return X(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = Do(n);
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
class Bc {
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
class Uc {
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
    const n = Dt();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: qc(),
      flags: {
        ...t.flags,
        [l]: {
          ...jc(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && d.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = Dt();
    if (!r.enabled)
      return;
    const o = n.notification ?? tr(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = tr(n);
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
function tr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function qc() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function jc(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function zc(e, t) {
  const n = Qc(e?.rounds);
  if (!n)
    return nr(null);
  const r = e?.anchor ?? Po(t);
  if (!r)
    return {
      ...nr(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Vc(),
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
function Po(e) {
  const t = Zc();
  if (!t?.id || !Lo(t.round)) return null;
  const n = Kc(t), r = Hc(e, n) ?? Wc(t), o = j(r?.id), a = Jc(r?.initiative), i = Gc(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: i,
    initiative: a,
    time: Xc()
  };
}
function Vc() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function nr(e) {
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
  return e?.id ? t.find((n) => Yc(n) === e.id) ?? null : null;
}
function Gc(e, t, n) {
  const r = j(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return eu(e.turn) ? e.turn : null;
}
function Wc(e) {
  return Be(e.combatant) ? e.combatant : null;
}
function Kc(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Be);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Be);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(Be);
  }
  return [];
}
function Yc(e) {
  return j(e.actor?.id) ?? j(e.actorId) ?? j(e.token?.actor?.id) ?? j(e.token?.actorId) ?? j(e.document?.actor?.id) ?? j(e.document?.actorId);
}
function Qc(e) {
  return Lo(e) ? Math.trunc(e) : null;
}
function Zc() {
  return game.combat ?? null;
}
function Xc() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Be(e) {
  return !!(e && typeof e == "object");
}
function j(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Jc(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Lo(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function eu(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class tu {
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
    if (!du(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = zc(t.duration, r), i = nu(o, t, a), u = t.refreshExisting ?? !0 ? mu(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(i)), y(rr(r, o, u.id ?? null, !1, !0, a));
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
      return y(rr(r, o, f, !0, !1, a));
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
        await or(n, i) === "deleted" && (a += 1);
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
    const n = gu(), r = [];
    let o = 0, a = 0;
    for (const i of n) {
      const s = sn(i);
      o += s.length;
      for (const u of s) {
        if (!au(u, t)) continue;
        const m = vo(u);
        try {
          await or(i, u) === "deleted" && (a += 1);
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
function nu(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: wu(),
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
    duration: ru(n.duration),
    start: ou(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [l]: r
    }
  };
}
function ru(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function ou(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Iu(),
    ...e
  };
}
function rr(e, t, n, r, o, a) {
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
function au(e, t) {
  const n = vo(e);
  if (!n.conditionId || !iu(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = ku();
  return n.durationMode === "combatantTurn" || su(n) ? cu(n, r) : lu(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !D(n.startRound) || !D(n.requestedRounds) || !D(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function iu(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && D(e.requestedRounds);
}
function su(e) {
  return !!(e.combatDurationApplied && D(e.requestedRounds) && D(e.startRound) && (e.startCombatantId || He(e.startTurn)));
}
function lu(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function cu(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !D(e.startRound) || !D(e.requestedRounds) || !D(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = uu(t);
  return e.startCombatantId ? r === e.startCombatantId : He(e.startTurn) && He(t.turn) ? t.turn === e.startTurn : !1;
}
function uu(e) {
  return ae(e.combatant?.id);
}
function vo(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Ue(e, "conditionId"),
    requestedRounds: ar(e, "requestedRounds") ?? Ce(t.value) ?? Ce(t.rounds),
    combatDurationApplied: At(e, "combatDurationApplied"),
    combatId: Ue(e, "combatId") ?? ae(n.combat) ?? ae(t.combat),
    startCombatantId: Ue(e, "startCombatantId") ?? ae(n.combatant),
    startInitiative: Au(e, "startInitiative") ?? Oo(n.initiative),
    startRound: ar(e, "startRound") ?? Ce(n.round) ?? Ce(t.startRound),
    startTurn: bu(e, "startTurn") ?? Mt(n.turn) ?? Mt(t.startTurn),
    expiryEvent: Ru(e, "expiryEvent") ?? Fo(t.expiry),
    durationMode: Tu(e, "durationMode"),
    deleteOnExpire: At(e, "deleteOnExpire"),
    expiresWithCombat: At(e, "expiresWithCombat")
  };
}
function du(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function mu(e, t) {
  return No(e, t)[0] ?? null;
}
function No(e, t) {
  return sn(e).filter((n) => yu(n) === t);
}
async function or(e, t) {
  const n = t.id ?? null, r = n ? fu(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (pu(o)) return "missing";
    throw o;
  }
}
function fu(e, t) {
  return sn(e).find((n) => n.id === t) ?? null;
}
function pu(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function gu() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      Fe(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    Fe(e, n);
  });
  for (const n of hu())
    Fe(e, n.actor), Fe(e, n.document?.actor);
  return Array.from(e.values());
}
function Fe(e, t) {
  if (!Cu(t)) return;
  const r = ae(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function hu() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function sn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function yu(e) {
  return Ue(e, "conditionId");
}
function Ue(e, t) {
  return ae(ee(e, t));
}
function ar(e, t) {
  return Ce(ee(e, t));
}
function bu(e, t) {
  return Mt(ee(e, t));
}
function Au(e, t) {
  return Oo(ee(e, t));
}
function Ru(e, t) {
  return Fo(ee(e, t));
}
function Tu(e, t) {
  const n = ee(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function At(e, t) {
  return ee(e, t) === !0;
}
function ee(e, t) {
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
function Mt(e) {
  return He(e) ? Math.trunc(e) : null;
}
function Oo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Fo(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Cu(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function ku() {
  return game.combat ?? null;
}
function Iu() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function D(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function He(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function wu() {
  return game.user?.id ?? null;
}
const $u = "icons/svg/downgrade.svg", _u = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? $u,
    description: _u,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Eu = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Su = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Du = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Pu = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Lu = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), vu = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Nu = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Ou = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Fu = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Mu = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), xu = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Bu = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Uu = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), qu = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), ju = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), zu = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Vu = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Hu = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Gu = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Wu = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Ku = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Yu = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Qu = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Zu = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Xu = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Ju = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), ed = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), td = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), nd = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), rd = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), od = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), ad = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), id = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), sd = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), ld = [
  Eu,
  Su,
  Du,
  Pu,
  Lu,
  vu,
  Nu,
  Ou,
  Fu,
  Mu,
  xu,
  Bu,
  Uu,
  qu,
  ju,
  zu,
  Vu,
  Hu,
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
  id,
  sd
];
class cd {
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
    return Array.from(this.definitions.values()).map(ir);
  }
  get(t) {
    const n = this.lookup.get(sr(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(ir(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = sr(t);
    r && this.lookup.set(r, n);
  }
}
function ud() {
  return new cd(ld);
}
function ir(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function sr(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const dd = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Mo = `${l}-inline-roll-neutralized`, md = `${l}-inline-roll-notice`, ln = `data-${l}-inline-roll-neutralized`, lr = `data-${l}-inline-roll-notice`, fd = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function cr(e) {
  const t = _d(e.message), n = await pd(e.message), r = gd(t);
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
async function pd(e) {
  const t = Id(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = hd(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await wd(t, n.content), replacementCount: n.replacementCount };
}
function gd(e) {
  const t = e ? $d(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = xo(t);
  return n > 0 && Bo(Td(t)), { replacementCount: n };
}
function hd(e) {
  const t = yd(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = xo(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (Bo(n.content), { content: n.innerHTML, replacementCount: o });
}
function yd(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, Ad(o.trim()))), replacementCount: t };
}
function xo(e) {
  const t = bd(e);
  for (const n of t)
    n.replaceWith(Rd(Cd(n)));
  return t.length;
}
function bd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(dd))
    n.getAttribute(ln) !== "true" && t.add(n);
  return Array.from(t);
}
function Ad(e) {
  return `<span class="${Mo}" ${ln}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Ed(e)}</span>`;
}
function Rd(e) {
  const t = document.createElement("span");
  return t.classList.add(Mo), t.setAttribute(ln, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Bo(e) {
  if (e.querySelector?.(`[${lr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(md), t.setAttribute(lr, "true"), t.textContent = fd, e.append(t);
}
function Td(e) {
  return e.querySelector(".message-content") ?? e;
}
function Cd(e) {
  const n = e.getAttribute("data-formula") ?? kd(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function kd(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Id(e) {
  return e && typeof e == "object" ? e : null;
}
async function wd(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return d.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function $d(e) {
  const t = Sd(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function _d(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Ed(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Sd(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ge = "ritualRollConfig", ie = "ritual-roll";
function rt() {
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
function Uo(e) {
  const t = e.getFlag(l, Ge);
  return xt(t);
}
function qo(e) {
  return Uo(e) ?? rt();
}
async function Dd(e, t) {
  const n = xt(t) ?? xt({
    ...rt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(l, Ge, n), n;
}
async function Pd(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, l, Ge));
    return;
  }
  await e.setFlag(l, Ge, null);
}
function xt(e) {
  if (!ot(e)) return null;
  const t = Ud(e.intent);
  if (!t) return null;
  const n = rt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: We(e.damageType),
    utilityLabel: We(e.utilityLabel) ?? n.utilityLabel,
    note: cn(e.note),
    forms: qd(e.forms)
  };
}
function Ld(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function vd(e) {
  const t = Uo(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = Nd(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...Od(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: Md(e, t),
    resistance: t.intent === "damage" ? xd(e) : void 0
  };
}
function Nd(e, t) {
  const n = {
    type: "rollFormula",
    id: ie,
    formula: t,
    intent: Bd(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function Od(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${ie}.total`,
          ...Fd(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${ie}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function Fd(e) {
  return e ? { damageType: e } : {};
}
function Md(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [ie]: n
      }
    }
  };
  return ur(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [ie]: t.forms.discente.formula.trim()
    }
  }), ur(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [ie]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function xd(e) {
  const t = jo(e), n = We(t.skillResis), r = We(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = jd(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function Bd(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Ud(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function qd(e) {
  const t = rt();
  return ot(e) ? {
    base: Rt(e.base),
    discente: Rt(e.discente),
    verdadeiro: Rt(e.verdadeiro)
  } : t.forms;
}
function Rt(e) {
  return ot(e) ? { formula: cn(e.formula) } : { formula: "" };
}
function ur(e, t) {
  const n = jo(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return zd(r);
}
function jo(e) {
  const t = e.system;
  return ot(t) ? t : {};
}
function jd(e) {
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
function zd(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function cn(e) {
  return typeof e == "string" ? e.trim() : "";
}
function We(e) {
  const t = cn(e);
  return t.length > 0 ? t : null;
}
function ot(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
const dr = "occultism";
function Vd(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Hd(e) {
  const t = Vd(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await Gd(e, dr);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await wo(n);
  const r = Yd(n);
  return {
    skill: dr,
    skillLabel: "Ocultismo",
    roll: n,
    formula: Kd(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: Qd(n)
  };
}
async function Gd(e, t) {
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
  return Wd(r);
}
function Wd(e) {
  return mr(e) ? e : Array.isArray(e) ? e.find(mr) ?? null : null;
}
function mr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Kd(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Yd(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Qd(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Zd);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Zd(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function Xd(e) {
  switch (Jd(e)) {
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
      return em(String(e ?? ""));
  }
}
function Jd(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function em(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function tm(e) {
  return {
    header: {
      eyebrow: Kt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: im(e.ritual)
    },
    forms: e.variantOptions.map((t) => nm(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: am(e.automationStatus ?? "assisted")
  };
}
function nm(e, t) {
  const n = rm(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? om(t) : "—",
    details: n
  };
}
function rm(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function om(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function am(e) {
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
function im(e) {
  const t = e.system, n = [lm(t?.element), sm(t?.circle)].filter(dm);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function sm(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function lm(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (cm(e)) {
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
      return um(e);
  }
}
function cm(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function um(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function dm(e) {
  return typeof e == "string" && e.length > 0;
}
const zo = ["base", "discente", "verdadeiro"];
function Vo(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Ke(e) {
  return typeof e == "string" && zo.includes(e);
}
const { ApplicationV2: mm } = foundry.applications.api;
class ke extends mm {
  constructor(t, n) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = n, this.model = tm(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    pm(o, (a) => {
      this.selectedVariant = a;
    }), gm(o, (a) => {
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
          ${this.model.forms.map(fm).join("")}
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
    const n = bm(t), r = hm(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function fm(e) {
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
function pm(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => fr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), fr(e, o, t));
    });
  const r = Ho(e);
  r && t(r);
}
function fr(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Ke(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Ho(e));
}
function Ho(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && Ke(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function gm(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function hm(e, t, n) {
  const r = ym(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function ym(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Ke(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Ke(n) ? n : null;
}
function bm(e) {
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
async function Am(e) {
  return ke.request(e);
}
const un = {
  label: "Padrão"
}, Rm = {
  label: "Discente",
  extraCost: 2
}, Tm = {
  label: "Verdadeiro",
  extraCost: 5
};
class Cm {
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
    const r = this.resolveCostPreview(t), o = df(n), a = lf(
      n,
      t.item,
      r,
      o
    ), i = await Am({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((I) => I.name),
      cost: r,
      defaultSpendResource: yf(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const s = km(i), u = ff(
      n,
      t.item,
      s.variant,
      o
    ), m = ao();
    let f = null;
    if (m) {
      const I = await wm(
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
        f = await Hd(
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
    const A = Im(
      n,
      s,
      u,
      r,
      {
        includeCostSteps: !m
      }
    );
    if (A.steps.length === 0) {
      const I = mf(
        t,
        s
      ), U = pr(
        t.actor,
        f,
        u,
        r
      ), Tn = gr(
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
        summaryLines: Tn
      } : {
        status: "completed-without-actions",
        workflowContext: I,
        summaryLines: Tn
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
    const C = T.value.context, g = Lm(
      n,
      t,
      C
    ), L = _m(
      n,
      t
    ), ge = pr(
      t.actor,
      f,
      u,
      r
    ), he = gr(
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
    return Ve(
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
function km(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function Im(e, t, n, r, o) {
  const a = [], i = t.spendResource === !0;
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || dn(s) && (!o.includeCostSteps || !i) || a.push($m(s, n));
  return o.includeCostSteps && i && r && bf(n.extraCost) && a.push({
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
async function wm(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Ee(o, r);
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
function $m(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function pr(e, t, n, r) {
  if (!t || t.success) return [];
  const o = Ee(r, n);
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
function _m(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = Go(r.actor, t);
    if (o.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    for (const a of o) {
      const i = Po(a);
      n.push(
        Em(
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
function Em(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? Pm(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: Sm(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Dm(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Sm(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Dm(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Pm(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Lm(e, t, n) {
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
    const s = Go(a.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const u of s) {
      if (vm(a)) {
        Nm(
          o,
          u,
          Om(a, n, i.value)
        );
        continue;
      }
      r.push(Mm(a, u, i.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...Fm(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function vm(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Nm(e, t, n) {
  const r = qm(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Om(e, t, n) {
  const r = jm(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function Fm(e, t, n, r) {
  const o = Gm(e), a = o.length > 1 ? Ym() : void 0;
  return o.map((i) => {
    const s = r.map(
      (m, f) => {
        const A = Wm(m.amount, i);
        return {
          id: xm(m, i, f),
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
      label: Bm(u, i, o.length > 1),
      executedLabel: Um(
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
function Mm(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = Hm(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: zm(e, r, n),
    executedLabel: Vm(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function xm(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Bm(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Um(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function qm(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function jm(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function zm(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Vm(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Hm(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Gm(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Wm(e, t) {
  const n = e * t.multiplier, r = Km(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function Km(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Ym() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Go(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function gr(e, t, n, r, o, a = null) {
  return [
    `Forma: ${Vo(t.variant)}`,
    Zm(t, n, r),
    ...Qm(a),
    ...Object.values(o.rolls).flatMap(Xm),
    ...Jm(e.resistance),
    ...af(n)
  ];
}
function Qm(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Zm(e, t, n) {
  const r = Ee(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Xm(e) {
  const n = [`${sf(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = ef(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${Xd(e.damageType)}`), n;
}
function Jm(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function ef(e) {
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
    const i = tf(a);
    i && (of(
      n,
      i.operator ?? r,
      i.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function tf(e) {
  const t = nf(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : rf(e);
}
function nf(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function rf(e) {
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
function of(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function af(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function sf(e) {
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
function lf(e, t, n, r) {
  return zo.map((o) => {
    const a = Wo(
      e,
      t,
      o,
      r
    ), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? Vo(o),
      enabled: i,
      details: a ? cf(a, n, r) : [],
      finalCostText: a ? uf(n, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function cf(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = Ee(t, e);
  return r.push(
    a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"
  ), r;
}
function Ee(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function uf(e, t) {
  const n = Ee(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function df(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(dn);
}
function mf(e, t) {
  return Do({
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
function ff(e, t, n, r) {
  return Wo(e, t, n, r) ?? un;
}
function Wo(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? gf(t, n) ? pf(n) : null : n === "base" ? un : null);
}
function pf(e) {
  switch (e) {
    case "base":
      return un;
    case "discente":
      return Rm;
    case "verdadeiro":
      return Tm;
  }
}
function gf(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return hf(foundry.utils.getProperty(e, n));
}
function hf(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function yf(e) {
  return e.steps.some(dn);
}
function dn(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function bf(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Af(e, t) {
  const n = await Rf(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: Cf(n),
    total: kf(n),
    diceBreakdown: If(n)
  };
}
function Ko(e) {
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
async function Rf(e, t) {
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
  return Tf(r);
}
function Tf(e) {
  return hr(e) ? e : Array.isArray(e) ? e.find(hr) ?? null : null;
}
function hr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Cf(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function kf(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function If(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(wf);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function wf(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Yo = "itemUsePrompts", Qo = "chatCard", at = "data-paranormal-toolkit-prompt-id", it = "data-paranormal-toolkit-pending-id", mn = "data-paranormal-toolkit-executed-label", Bt = "data-paranormal-toolkit-choice-group", Zo = "data-paranormal-toolkit-skipped-label", yr = "data-paranormal-toolkit-action-section", br = "data-paranormal-toolkit-detail-key", Ar = "data-paranormal-toolkit-roll-card", fn = "data-paranormal-toolkit-roll-detail-toggle", Xo = "data-paranormal-toolkit-roll-detail-id", Jo = "data-paranormal-toolkit-resistance-roll-button", ea = "data-paranormal-toolkit-resistance-skill", ta = "data-paranormal-toolkit-resistance-skill-label", na = "data-paranormal-toolkit-resistance-target-actor-id", ra = "data-paranormal-toolkit-resistance-target-name", oa = "data-paranormal-toolkit-resistance-roll-result", Rr = "data-paranormal-toolkit-system-card-replaced", $f = `[${it}]`, _f = `[${fn}]`, Ef = `[${Jo}]`, Ut = `${l}-chat-enrichment`, h = `${l}-item-use-prompt`, Sf = `${h}__actions`, Tr = `${h}__details`, aa = `${h}__summary`, Df = `${h}__title`, ia = `${h}__button--executed`, Cr = `${h}__roll-card`;
let kr = !1, qt = null;
const P = /* @__PURE__ */ new Map(), Pf = [0, 100, 500, 1500, 3e3], Lf = 3e4, vf = [0, 100, 500, 1500, 3e3];
function Nf(e) {
  if (qt = e, kr) {
    wr(e);
    return;
  }
  const t = (n, r) => {
    la(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), kr = !0, wr(e);
}
async function Ir(e) {
  const t = sa(e);
  P.set(e.pendingId, t), await hn(t) || ba(t), ca(e.pendingId);
}
async function Of(e) {
  const t = sa({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await hn(t) || ba(t), ca(e.pendingId);
}
async function Tt(e, t) {
  const n = P.get(e);
  P.delete(e), n && await Np(n, t);
}
function pn(e) {
  const t = Ia();
  for (const n of t) {
    const r = B(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Ff(e, t) {
  const n = pn(e);
  if (!n) return;
  const r = B(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await me(n.message, r));
}
async function Mf(e, t, n) {
  if (!t) return;
  const r = pn(e);
  if (!r) return;
  const o = B(r.message);
  let a = !1;
  for (const [i, s] of Object.entries(o))
    i !== e && s.choiceGroupId === t && (o[i] = {
      ...s,
      executedLabel: n ?? s.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await me(r.message, o);
}
function sa(e) {
  const t = V(e.context.message), n = e.context.targets.find((i) => Ht(i)), r = n ? Ht(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: cp(e.context),
    executed: !1
  };
}
function la(e, t, n) {
  vp();
  const r = lt(t);
  if (!r) return;
  const o = Dp(e, r);
  o.length > 0 && Ye(r);
  for (const a of o)
    jt(r, a);
  ma(r, n), zt(r), Vt(r);
}
function wr(e) {
  for (const t of vf)
    globalThis.setTimeout(() => {
      xf(e);
    }, t);
}
function xf(e) {
  for (const t of Bf()) {
    const n = st(t);
    Uf(n) && la(n, t, e);
  }
}
function Bf() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function Uf(e) {
  return e ? yn(e) ? !0 : Fp(e).length > 0 : !1;
}
function ca(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? Pp(t.messageId) : null;
  if (n) {
    Dr(n, t), Ye(n), jt(n, t), $r(n), zt(n), Vt(n);
    return;
  }
  if (t.messageId) {
    Wt(t);
    return;
  }
  const r = Lp(t);
  if (r) {
    Dr(r, t), Ye(r), jt(r, t), $r(r), zt(r), Vt(r);
    return;
  }
  Wt(t);
}
function $r(e) {
  qt && ma(e, qt);
}
function Ye(e) {
  const t = qf();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = da(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Rr) === "true") return;
  const r = n.querySelector(`.${Ut}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Rr, "true");
}
function qf() {
  try {
    return Ni() === "replace";
  } catch {
    return !1;
  }
}
function jt(e, t) {
  if (Ye(e), e.querySelector(`[${at}="${fe(t.pendingId)}"]`)) return;
  const n = jf(e, t);
  Vf(n, t), op(n, ap(t)).append(lp(t));
}
function jf(e, t) {
  const n = e.querySelector(`.${Ut}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Ut, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(Df), i.textContent = zf(t);
  const s = document.createElement("span");
  return s.classList.add(aa), s.textContent = t.summary, o.append(a, i, s), r.append(o), dp(e).append(r), r;
}
function zf(e) {
  const t = _(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Vf(e, t) {
  const n = t.summaryLines ?? [], r = ha(n, t);
  if (r) {
    Hf(e, r, t);
    return;
  }
  ip(e, n);
}
function Hf(e, t, n) {
  if (e.querySelector(`[${Ar}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Cr, `${Cr}--${t.intent}`), r.setAttribute(Ar, "true"), t.castingCheck && _r(r, Wf(t.castingCheck), n.pendingId, "casting"), Gf(t) && _r(r, Kf(t), n.pendingId, "effect"), Jf(r, t), ep(r, t, n), rp(r, t), e.append(r);
}
function Gf(e) {
  return e.intent !== "casting";
}
function Wf(e) {
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
function Kf(e) {
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
function _r(e, t, n, r) {
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
  Yf(o, t), np(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Yf(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = Qf(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function Qf(e, t) {
  const n = Zf(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of Xf(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function Zf(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Xf(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Er(e, "highest") : n.includes("kl") ? Er(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Er(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Jf(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(eg);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function ep(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = tp(t, n);
  o.append(a), i && o.append(i);
  const s = document.createElement("span");
  s.classList.add(`${h}__resistance-description`), s.textContent = t.resistance, r.append(o, s), t.resistanceRollResult && r.append(ua(t.resistanceRollResult)), e.append(r);
}
function tp(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(at, t.pendingId), n.setAttribute(Jo, "true"), n.setAttribute(ea, e.resistanceSkill), n.setAttribute(ta, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(na, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(ra, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(oa, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function ua(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = pa(e), t;
}
function np(e, t, n, r, o) {
  const a = t.filter((m) => m.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${n}-roll-details-${r}`, s = document.createElement("button");
  s.type = "button", s.classList.add(`${h}__roll-detail-toggle`), s.setAttribute(fn, i), s.setAttribute("aria-expanded", "false"), s.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(Xo, i), u.hidden = !0;
  for (const m of a) {
    const f = document.createElement("dt");
    f.textContent = m.label;
    const A = document.createElement("dd");
    A.textContent = m.value, u.append(f, A);
  }
  e.append(s, u);
}
function rp(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function op(e, t) {
  const n = `[${yr}="${fe(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Sf), o.setAttribute(yr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function ap(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = ha(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function ip(e, t) {
  if (t.length === 0) return;
  const n = sp(e);
  for (const r of t) {
    const o = tg(r);
    if (n.querySelector(`[${br}="${fe(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(br, o), n.append(a);
  }
}
function sp(e) {
  const t = e.querySelector(`.${Tr}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Tr), e.append(n), n;
}
function lp(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(at, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(ia), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(it, e.pendingId), t.setAttribute(mn, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Bt, e.choiceGroupId), t.setAttribute(Zo, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function cp(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = up(e);
  return `${t} → ${n}`;
}
function up(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function dp(e) {
  return da(e) ?? e;
}
function da(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function ma(e, t) {
  const n = lt(e);
  if (!n) return;
  const r = n.querySelectorAll($f);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      wp(o, t);
    }));
}
function zt(e) {
  const t = lt(e);
  if (!t) return;
  const n = t.querySelectorAll(_f);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      mp(t, r);
    }));
}
function Vt(e) {
  const t = lt(e);
  if (!t) return;
  const n = t.querySelectorAll(Ef);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      fp(t, r);
    }));
}
function mp(e, t) {
  const n = t.getAttribute(fn);
  if (!n) return;
  const r = e.querySelector(`[${Xo}="${fe(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function fp(e, t) {
  const n = t.getAttribute(at), r = t.getAttribute(ea), o = t.getAttribute(ta) ?? (r ? Ko(r) : "Resistência");
  if (!n || !r) return;
  const a = hp(e, n), i = yp(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const s = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Af(i, r);
    await Cp(u.roll);
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
    pp(t, m), gp(t, m), kp(n, m), await Ip(e, n, m);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1;
  }
}
function pp(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(oa, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function gp(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? ua(t);
  if (r) {
    r.textContent = pa(t);
    return;
  }
  n.append(o);
}
function hp(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = st(e);
  return B(r)[t] ?? null;
}
function yp(e, t) {
  const n = e?.resistanceTargetActor;
  if (F(n)) return n;
  const o = e?.context?.targets.map(Ht).find(F) ?? null;
  if (o) return o;
  const a = t.getAttribute(na) ?? e?.resistanceTargetActorId ?? null, i = a ? Ap(a) : null;
  return i || Rp(
    t.getAttribute(ra) ?? e?.resistanceTargetName ?? bp(t)
  );
}
function bp(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${aa}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function Ht(e) {
  const t = e.actor;
  if (F(t)) return t;
  const n = e.token, r = we(n);
  if (r) return r;
  const o = e.document;
  return we(o);
}
function we(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (F(t)) return t;
  const n = e.document?.actor;
  return F(n) ? n : null;
}
function Ap(e) {
  const n = game.actors?.get?.(e);
  return F(n) ? n : fa().map((a) => we(a)).find((a) => a?.id === e) ?? null;
}
function Rp(e) {
  const t = se(e);
  if (!t) return null;
  const n = fa().filter((a) => se(Tp(a)) === t).map((a) => we(a)).find(F) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => F(a) && se(a.name) === t);
  return F(o) ? o : null;
}
function fa() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Tp(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : we(e)?.name ?? null;
}
function se(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function F(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function pa(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Cp(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function kp(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function Ip(e, t, n) {
  const r = st(e);
  if (r)
    try {
      const o = B(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await me(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function st(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return x(r?.get?.(n));
}
async function wp(e, t) {
  const n = e.getAttribute(it);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    ga(e, e.getAttribute(mn) ?? "✓ Automação aplicada"), $p(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function ga(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(ia), e.removeAttribute(it), e.removeAttribute(mn);
}
function $p(e) {
  const t = e.getAttribute(Bt);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Bt}="${fe(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(Zo) ?? "✓ Outra opção escolhida";
    ga(o, a);
  }
}
function ha(e, t) {
  const n = e.map(gn).filter(Xp), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = _(e, "Forma"), a = _(e, "Custo"), i = _(e, "Dados") ?? _(e, `Dados (${r.label})`), s = _(e, "Tipo"), u = _(e, "Resistência"), m = _(e, "Resistência Perícia"), f = _(e, "Resistência Rótulo") ?? (m ? Ko(m) : null), A = ya(e, "Observação"), T = e.filter((g) => Sp(g, r)), C = _p(e);
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
function _p(e) {
  const t = e.map(gn).find((a) => a?.intent === "casting") ?? null, n = _(e, "Conjuração DT"), r = _(e, "Conjuração Resultado");
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
function gn(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: Ep(n)
  } : null;
}
function Ep(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function _(e, t) {
  return ya(e, t)[0] ?? null;
}
function ya(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Sp(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || gn(e) ? !1 : e.trim().length > 0;
}
function Dp(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    Gt(r, e, t) && n.set(r.pendingId, r);
  for (const r of Op(e))
    Gt(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Gt(e, t, n) {
  const r = V(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !Sr(n, "itemId", e.itemId) ? !1 : !e.actorId || Sr(n, "actorId", e.actorId);
}
function Sr(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${ng(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Pp(e) {
  const t = fe(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Lp(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Gt(e, null, t))
      return t;
  return null;
}
function vp() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function Dr(e, t) {
  const n = st(e);
  if (!n) return !1;
  try {
    const r = B(n);
    return r[t.pendingId] = bn(t, V(n)), await me(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function hn(e) {
  const t = Ta(e);
  if (!t) return !1;
  try {
    const n = B(t);
    return n[e.pendingId] = bn(e, V(t)), await me(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function ba(e) {
  for (const t of Pf)
    globalThis.setTimeout(() => {
      Wt(e);
    }, t);
}
async function Wt(e) {
  const t = Ta(e);
  if (yn(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await hn(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function Np(e, t) {
  const n = Ra(e.context.message);
  if (n)
    try {
      const r = B(n), o = r[e.pendingId] ?? bn(e, V(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await me(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function Op(e) {
  return Object.values(B(x(e))).filter(Se);
}
function B(e) {
  if (!e) return {};
  const t = {}, n = yn(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(Aa(e)))
    t[r] ??= o;
  return t;
}
function Fp(e) {
  return Object.values(Aa(x(e))).filter(Se);
}
function Aa(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, Yo);
  if (!ce(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Se(o) && (n[r] = o);
  return n;
}
async function me(e, t) {
  typeof e.setFlag == "function" && (await xp(e, t), await Mp(e, t));
}
async function Mp(e, t) {
  await Promise.resolve(e.setFlag?.(l, Yo, t));
}
function yn(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, Qo);
  return Qp(t) ? t : null;
}
async function xp(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Se).sort((a, i) => a.createdAt - i.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((a) => a.createdAt)),
    messageId: r.messageId ?? V(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: Bp(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(l, Qo, o));
}
function Bp(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function bn(e, t) {
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
function Ra(e) {
  const t = x(e);
  if (t?.setFlag)
    return t;
  const n = Up(e);
  if (n?.setFlag)
    return n;
  const r = V(e);
  if (!r) return null;
  const o = game.messages;
  return x(o?.get?.(r));
}
function Up(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(x).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Ta(e) {
  const t = Ra(e.context.message);
  if (t) return t;
  const n = e.messageId ? qp(e.messageId) : null;
  if (n) return n;
  const r = Ia().slice().reverse();
  return r.find((o) => jp(o, e)) ?? r.find((o) => zp(o, e)) ?? null;
}
function qp(e) {
  const t = game.messages;
  return x(t?.get?.(e));
}
function jp(e, t) {
  const n = V(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Ca(e, t)) return !1;
  const o = ka(e);
  return !t.actorId || !o || o === t.actorId;
}
function zp(e, t) {
  if (!Hp(e, t)) return !1;
  const n = ka(e);
  return t.actorId && n === t.actorId ? !0 : Ca(e, t);
}
function Ca(e, t) {
  const n = se(Vp(e));
  if (!n) return !1;
  const r = se(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = se(t.itemId);
  return !!(o && n.includes(o));
}
function Vp(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function ka(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Hp(e, t) {
  const n = Gp(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Lf;
}
function Gp(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function x(e) {
  return e && typeof e == "object" ? e : null;
}
function Se(e) {
  return ce(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && E(e.messageId) && E(e.itemId) && E(e.actorId) && E(e.itemName) && Y(e.resistanceTargetActorId) && Y(e.resistanceTargetName) && Zp(e.resistanceRollResult) && Wp(e.actionPayload) && Ct(e.title) && Ct(e.buttonLabel) && Ct(e.executedLabel) && Y(e.choiceGroupId) && Y(e.skippedLabel) && Y(e.actionSectionId) && Y(e.actionSectionTitle) && Jp(e.summaryLines) : !1;
}
function Wp(e) {
  return e == null ? !0 : ce(e) ? e.kind === "resource-operation" && E(e.actorId) && E(e.actorUuid) && typeof e.actorName == "string" && Kp(e.resource) && Yp(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Kp(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Yp(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Qp(e) {
  return ce(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && E(e.messageId) && ce(e.source) && E(e.source.actorId) && E(e.source.actorName) && E(e.source.itemId) && E(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Se) : !1;
}
function Zp(e) {
  return e == null ? !0 : ce(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Y(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Xp(e) {
  return e !== null;
}
function ce(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function E(e) {
  return e === null || typeof e == "string";
}
function Ct(e) {
  return e === void 0 || typeof e == "string";
}
function Y(e) {
  return e == null || typeof e == "string";
}
function Jp(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function eg(e) {
  return typeof e == "string" && e.length > 0;
}
function Ia() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(x).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(x).filter((r) => r !== null) : [];
}
function lt(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function V(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function tg(e) {
  return e.trim().toLowerCase();
}
function ng(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function fe(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Pr = 1e3;
class rg {
  constructor(t, n, r, o, a, i) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = i, this.ritualAssistant = new Cm(
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
      settings: En(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = En();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Yt(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && dg(t.item) && n.executionMode === "ask") {
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
    if (await cr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: wt(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await Tt(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await Tt(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = pn(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = pg(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await Ve(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await Ff(t), await Mf(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Nf(
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
    if (await cr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: wt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      mg(t.item)
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
          X(r.workflowContext)
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
      return o.ok ? (ug(n, o.value), await og(o.value), {
        ok: !0,
        executedLabel: ag(o.value)
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
    const n = kt(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && kt(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== t.id && (this.pendingExecutions.delete(o), await Tt(
        o,
        vr(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = $t();
    await Of({
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
      const s = $t();
      a ??= s, this.pendingExecutions.set(s, {
        kind: "assisted-action",
        id: s,
        action: i,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Ir({
        pendingId: s,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: i.label,
        executedLabel: i.executedLabel,
        choiceGroupId: kt(i),
        skippedLabel: vr(i),
        actionSectionId: i.actionSectionId,
        actionSectionTitle: i.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: i.actor,
        resistanceTargetActorId: i.actor.id ?? null,
        resistanceTargetName: i.actorName,
        actionPayload: fg(i)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      a
    ), d.info(
      "Ritual assistido preparado com ações pendentes.",
      X(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = $t();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Ir({
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
      X(o.value.context)
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
    const n = Date.now(), r = Nr(t);
    for (const [a, i] of this.recentExecutionKeys.entries())
      n - i > Pr && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= Pr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Nr(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = wt(
      t,
      n,
      r,
      o
    );
  }
}
async function og(e) {
  const t = cg();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: ig(e)
      });
    } catch (n) {
      d.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function ag(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function ig(e) {
  const t = e.instances.map((i) => {
    const s = i.blocked > 0 ? ` <span class="muted">(RD ${i.blocked})</span>` : "";
    return `<li><strong>${qe(i.label ?? "Dano")}</strong>: ${i.inputAmount} → ${i.finalDamage} PV${s}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = sg(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${qe(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${qe(e.actorName)}</strong></p>
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
function sg(e) {
  const t = lg(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${qe(o)}</li>`;
}
function lg(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = Lr(n?.value);
  return r === null ? null : {
    value: r,
    max: Lr(n?.max)
  };
}
function Lr(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function cg() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function qe(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function kt(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function vr(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function ug(e, t) {
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
function dg(e) {
  return e.type === "ritual";
}
function mg(e) {
  return vd(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function fg(e) {
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
function pg(e) {
  const t = e.actorUuid ? gg(e.actorUuid) : null;
  if (ue(t)) return t;
  const n = e.actorId ? hg(e.actorId) : null;
  return n || yg(e.actorName);
}
function gg(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function hg(e) {
  const n = game.actors?.get?.(e);
  if (ue(n)) return n;
  for (const r of wa()) {
    const o = An(r);
    if (o?.id === e) return o;
  }
  return null;
}
function yg(e) {
  const t = It(e);
  if (!t) return null;
  for (const o of wa()) {
    const a = bg(o);
    if (It(a) === t) {
      const i = An(o);
      if (i) return i;
    }
  }
  const r = game.actors?.find?.(
    (o) => ue(o) && It(o.name) === t
  );
  return ue(r) ? r : null;
}
function wa() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function bg(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : An(e)?.name ?? null;
}
function An(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ue(t)) return t;
  const n = e.document?.actor;
  return ue(n) ? n : null;
}
function It(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ue(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function wt(e, t, n, r) {
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
function Nr(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function $t() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ag {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = _e(t);
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
class Rg {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = _e(t).map((s) => this.analyzeRitual(s)), r = n.filter(Me("upToDate")), o = n.filter(Me("available")), a = n.filter(Me("outdated")), i = n.filter(Me("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = Tg(t);
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
      reason: Cg(r, n.preset)
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
    preset: e.match ? Xe(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function Tg(e) {
  const t = e.getFlag(l, "automation");
  return Qt(t) ? t : null;
}
function Cg(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Me(e) {
  return (t) => t.status === e;
}
class kg {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = Xt(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), o = X(t);
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
    const n = R(t.actorName), r = R(t.resource), o = R(Or(t)), a = R(wg(t));
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
      (g) => `<li><strong>${R(g.id)}:</strong> ${R(g.formula)} = ${g.total} <em>(${R(Ig(g.intent))})</em>${g.damageType ? ` — ${R(g.damageType)}` : ""}</li>`
    ), m = t.ritualCosts.map(
      (g) => `<li><strong>${R(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${R(g.resource)} (${R($g(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${R(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${R(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (g) => `<li><strong>${R(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${R(g.actorName)}:</strong> ${R(Or(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
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
function Ig(e) {
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
function Or(e) {
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
function wg(e) {
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
function $g(e) {
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
function _g() {
  const e = new jl(), t = new Fc(e), n = new Ml(), r = new Hl(), o = new Kl(r), a = new lc(e), i = new uc(), s = i.registerMany(
    fi()
  );
  if (!s.ok)
    throw new Error(s.error.message);
  const u = new cc(), m = new ic(), f = ud(), A = new tu(f), T = new Rg(
    i
  ), C = new Ag(
    T,
    u,
    m
  ), g = new Uc(), L = new kg(g), ge = new Bc(), he = new Nc(
    t,
    o,
    L,
    ge
  ), ye = new xc(he, ge), I = new rg(
    ye,
    t,
    o,
    n,
    A,
    g
  );
  return I.addStrategy(
    new oc(
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
const { ApplicationV2: Eg } = foundry.applications.api;
class Qe extends Eg {
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
      apply: Qe.onApply,
      cancel: Qe.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${v(Kt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${v(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${_t("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${_t("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${_t("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function _t(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${v(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Sg(n) : Pg(t)}
    </section>
  `;
}
function Sg(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Dg).join("")}</ol>`;
}
function Dg(e) {
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
function Pg(e) {
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
const Ze = `${l}.manageRitualPresets`, Fr = `__${l}_ritualPresetHeaderControlRegistered`, Lg = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function vg(e) {
  const t = globalThis;
  if (!t[Fr]) {
    for (const n of Lg)
      Hooks.on(n, (r, o) => {
        Ng(r, o, e);
      });
    t[Fr] = !0, d.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Ng(e, t, n) {
  Array.isArray(t) && Fg(e) && (Og(e, n), !t.some((r) => r.action === Ze) && t.push({
    action: Ze,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), $a(e, n);
    }
  }));
}
function Og(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Ze] && (e.options.actions[Ze] = (n) => {
    n.preventDefault(), n.stopPropagation(), $a(e, t);
  }));
}
function Fg(e) {
  if (!game.user?.isGM) return !1;
  const t = _a(e);
  return t ? t.type === "agent" && _e(t).length > 0 : !1;
}
function $a(e, t) {
  const n = _a(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Qe(n, t).render({ force: !0 });
}
function _a(e) {
  return Mr(e.actor) ? e.actor : Mr(e.document) ? e.document : null;
}
function Mr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Ea = "data-paranormal-toolkit-ritual-roll-config", De = "data-paranormal-toolkit-ritual-roll-field", J = "data-paranormal-toolkit-ritual-roll-action", xr = `__${l}_ritualRollConfigBlockRegistered`, Mg = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], xg = [
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
function Bg() {
  const e = globalThis;
  if (!e[xr]) {
    Ug();
    for (const t of Mg)
      Hooks.on(t, (...n) => {
        qg(n[0], n[1]);
      });
    e[xr] = !0, d.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function Ug() {
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
function qg(e, t) {
  const n = th(e);
  if (!n || n.type !== "ritual") return;
  const r = oh(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  zg(o);
  const a = Da(n), i = qo(n), s = nh(n), u = Vg(n, i, a, s);
  Qg(u, n, a, s), jg(o, u), Rn(u);
}
function jg(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function zg(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Ea}]`)))
    t.remove();
}
function Vg(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${l}-ritual-roll-config`), o.setAttribute(Ea, e.uuid ?? e.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${l}-ritual-roll-config__header`);
  const i = document.createElement("div");
  i.classList.add(`${l}-ritual-roll-config__title`), i.append(Br("strong", "Paranormal Toolkit")), i.append(Br("span", "Fórmula de rolagem"));
  const s = document.createElement("span");
  s.classList.add(`${l}-ritual-roll-config__badge`), s.textContent = La(t) ? "Configurada" : "Rascunho", a.append(i, s), o.append(a);
  const u = document.createElement("p");
  u.classList.add(`${l}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const m = document.createElement("div");
  m.classList.add(`${l}-ritual-roll-config__fields`), m.append(Hg(t, r)), m.append(Gg(t, r)), m.append(Wg(t, r)), o.append(m), o.append(Kg(t, n, r)), o.append(Yg(r));
  const f = document.createElement("p");
  return f.classList.add(`${l}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function Hg(e, t) {
  const n = ct("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(De, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = Ld(o), a.selected = e.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function Gg(e, t) {
  const n = ct("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(De, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const a of xg) {
    const i = document.createElement("option");
    i.value = a.value, i.textContent = a.label, i.selected = e.damageType === a.value, r.append(i);
  }
  return n.append(r), n;
}
function Wg(e, t) {
  const n = ct("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(De, "utilityLabel"), n.append(r), n;
}
function Kg(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${l}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${l}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const a = document.createElement("div");
  return a.classList.add(`${l}-ritual-roll-config__forms-grid`), a.append(Et("base", "Padrão", e.forms.base.formula, !0, n)), a.append(Et("discente", "Discente", e.forms.discente.formula, t.discente, n)), a.append(Et("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(a), r;
}
function Et(e, t, n, r, o) {
  const a = ct(t);
  a.classList.add(`${l}-ritual-roll-config__form-card`), a.dataset.ritualRollForm = e;
  const i = document.createElement("input");
  if (i.type = "text", i.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", i.value = n, i.disabled = !o || !r, i.setAttribute(De, `formula.${e}`), a.append(i), !r) {
    const s = document.createElement("small");
    s.textContent = "Indisponível neste ritual.", a.append(s);
  }
  return a;
}
function Yg(e) {
  const t = document.createElement("div");
  t.classList.add(`${l}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(J, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(J, "clear"), t.append(n, r), t;
}
function ct(e) {
  const t = document.createElement("label");
  t.classList.add(`${l}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Br(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function Qg(e, t, n, r) {
  pe(e, "intent")?.addEventListener("change", () => Rn(e)), jr(e, "system.studentForm")?.addEventListener("change", () => Ur(e, t)), jr(e, "system.trueForm")?.addEventListener("change", () => Ur(e, t)), e.querySelector(`[${J}="save"]`)?.addEventListener("click", () => {
    r && Zg(e, t, n);
  }), e.querySelector(`[${J}="clear"]`)?.addEventListener("click", () => {
    r && Xg(e, t);
  });
}
async function Zg(e, t, n) {
  const r = e.querySelector(`[${J}="save"]`);
  r?.setAttribute("disabled", "true"), le(e, "Salvando configuração...");
  try {
    const o = Jg(e, n);
    await Dd(t, o), Sa(e, o), le(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), le(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function Xg(e, t) {
  const n = e.querySelector(`[${J}="clear"]`);
  n?.setAttribute("disabled", "true"), le(e, "Limpando configuração...");
  try {
    await Pd(t);
    const r = qo(t);
    eh(e, r), Sa(e, r), le(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), le(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Sa(e, t) {
  const n = e.querySelector(`.${l}-ritual-roll-config__badge`);
  n && (n.textContent = La(t) ? "Configurada" : "Rascunho");
}
function Jg(e, t) {
  return {
    schemaVersion: 1,
    intent: Pa(pe(e, "intent")?.value),
    damageType: zr(e, "damageType"),
    utilityLabel: zr(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: je(e, "formula.base") },
      discente: { formula: je(e, "formula.discente") },
      verdadeiro: { formula: je(e, "formula.verdadeiro") }
    }
  };
}
function eh(e, t) {
  ne(e, "intent", t.intent), ne(e, "damageType", t.damageType ?? ""), ne(e, "utilityLabel", t.utilityLabel ?? "Resultado"), ne(e, "formula.base", t.forms.base.formula), ne(e, "formula.discente", t.forms.discente.formula), ne(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Rn(e);
}
function Rn(e) {
  const t = Pa(pe(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function Ur(e, t) {
  const n = Da(t);
  qr(e, "discente", n.discente), qr(e, "verdadeiro", n.verdadeiro);
}
function qr(e, t, n) {
  const r = pe(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${J}="save"]`)?.disabled;
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
function le(e, t) {
  const n = e.querySelector(`.${l}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Da(e) {
  const t = rh(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function th(e) {
  return Vr(e.item) ? e.item : Vr(e.document) ? e.document : null;
}
function nh(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function rh(e) {
  const t = e.system;
  return ah(t) ? t : {};
}
function jr(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function pe(e, t) {
  return e.querySelector(`[${De}="${ih(t)}"]`);
}
function je(e, t) {
  return pe(e, t)?.value.trim() ?? "";
}
function zr(e, t) {
  const n = je(e, t);
  return n.length > 0 ? n : null;
}
function ne(e, t, n) {
  const r = pe(e, t);
  r && (r.value = n);
}
function Pa(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function La(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function oh(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Vr(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function ah(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function ih(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let Z = null;
Hooks.once("init", () => {
  ci(), vi(), ms(), Pl(), d.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Pn.isSupportedSystem()) {
    d.warn(
      `Sistema não suportado: ${Pn.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Z = _g(), Z.itemUseIntegration.registerStrategies(), ls(Z.conditions), Hi(Z), ns(), Xi(), vg(Z), Bg(), d.info("Inicializado para o sistema Ordem Paranormal."), d.info(
    `API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Kt} inicializado.`);
});
function sh() {
  if (!Z)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Z;
}
export {
  sh as getToolkitServices
};
//# sourceMappingURL=main.js.map
