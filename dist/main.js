const c = "paranormal-toolkit", Jn = "Paranormal Toolkit", El = "ordemparanormal";
class He {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Et(e) {
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
class f {
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
function _(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function Ct(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : er(t) ? _(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Cl(e) {
  return er(e.getFlag(c, "automation"));
}
function er(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Sl(t.source) && Il(t.definition);
}
function Il(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(Ll) && (t.conditionApplications === void 0 || Ol(t.conditionApplications));
}
function Sl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function Ll(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Dl(t);
    case "spendRitualCost":
      return vl(t);
    case "rollFormula":
      return Pl(t);
    case "modifyResource":
      return Nl(t);
    case "chatCard":
      return xl(t);
    default:
      return !1;
  }
}
function Dl(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && xo(t);
}
function vl(e) {
  return e.type === "spendRitualCost";
}
function Pl(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || ql(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function Nl(e) {
  const t = e;
  return t.type === "modifyResource" && Oo(t.actor) && Ul(t.resource) && Gl(t.operation) && xo(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function xl(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Ol(e) {
  return Array.isArray(e) && e.every(Ml);
}
function Ml(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && Oo(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || Fl(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel));
}
function Fl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || zl(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Bl(t.expiry));
}
function Bl(e) {
  return e === "turnStart" || e === "turnEnd";
}
function xo(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function Oo(e) {
  return e === "self" || e === "target";
}
function Ul(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Gl(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function ql(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function zl(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function tr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Vr);
    if (Hl(t))
      return Array.from(t).filter(Vr);
  }
  return [];
}
function jl(e) {
  return tr(e)[0] ?? null;
}
function Vl(e) {
  return tr(e).find(Cl) ?? null;
}
function Hl(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Vr(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function We(e) {
  return tr(e).filter((t) => t.type === "ritual");
}
function Mo(e) {
  return We(e)[0] ?? null;
}
function Wl(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Et);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = xe("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Je(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Kr);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = xe("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Je(n);
      if (!r) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await gn(e, r, a.value);
      f.info(`Preset ${a.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = xe("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Je(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await gn(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: Kr(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Hr(e);
    },
    async applyBestPresetsToActorRituals() {
      return Hr(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = xe("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Je(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Hr(e) {
  const t = xe("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = We(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Wr(t);
  const r = Wr(t, n.length);
  for (const a of n) {
    const o = e.automationRegistry.findForItem(a)[0];
    if (!o) {
      r.skipped.push({
        itemId: a.id ?? null,
        itemName: a.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await gn(e, a, o.preset);
    r.applied.push(Kl(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Yl(r), r;
}
async function gn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Kl(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Et(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Wr(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Yl(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Kr(e) {
  return {
    preset: Et(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function xe(e) {
  const t = He.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Je(e) {
  const t = Mo(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function re(e) {
  return e ? {
    id: e.id,
    source: {
      ...Ql(e.sourceActor),
      token: e.sourceToken
    },
    item: Zl(e.item),
    targets: e.targets.map(Xl),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Yr(e.rollRequests, Fo),
    rolls: Yr(e.rolls, Jl),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(nr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function nr(e) {
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
function Ql(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Zl(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Xl(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Fo(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Jl(e) {
  return {
    ...Fo(e),
    total: e.total
  };
}
function Yr(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function ec(e) {
  return {
    getSelected() {
      return He.getSelectedActor();
    },
    logResources() {
      const t = Q(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await me(
        e,
        "Gasto de PE",
        Q("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await me(
        e,
        "Gasto de PD",
        Q("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await me(
        e,
        "Dano em PV",
        Q("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await me(
        e,
        "Cura de PV",
        Q("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await me(
        e,
        "Dano em SAN",
        Q("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await me(
        e,
        "Recuperação de SAN",
        Q("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function me(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    tc(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, nr(o));
}
function Q(e) {
  const t = He.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function tc(e) {
  if (e.reason === "update-failed") {
    f.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    f.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  f.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const B = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function nc() {
  et(B.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), et(B.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), et(B.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), et(B.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function hn() {
  return {
    enabled: tt(B.enabled),
    console: tt(B.console),
    ui: tt(B.ui),
    chat: tt(B.chat)
  };
}
async function V(e, t) {
  await game.settings.set(c, B[e], t);
}
function et(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function tt(e) {
  return game.settings.get(c, e) === !0;
}
function rc() {
  return {
    status() {
      return hn();
    },
    async enable() {
      await V("enabled", !0);
    },
    async disable() {
      await V("enabled", !1);
    },
    async enableConsole() {
      await V("console", !0);
    },
    async disableConsole() {
      await V("console", !1);
    },
    async enableUi() {
      await V("ui", !0);
    },
    async disableUi() {
      await V("ui", !1);
    },
    async enableChat() {
      await V("chat", !0);
    },
    async disableChat() {
      await V("chat", !1);
    }
  };
}
const Bo = "ritual.costOnly", Uo = "ritual.simpleHealing", ac = "ritual.eletrocussao", Go = "ritual.simpleDamage", qo = "generic.simpleHealing", zo = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function oc() {
  return [
    ic(),
    sc(),
    lc(),
    cc(),
    uc()
  ];
}
function ic() {
  return {
    id: Bo,
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
function sc() {
  return {
    id: Uo,
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
    automation: jo(),
    itemPatch: mc()
  };
}
function lc() {
  return {
    id: ac,
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
    automation: dc(),
    itemPatch: fc()
  };
}
function cc() {
  return {
    id: Go,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: rr()
  };
}
function uc() {
  return {
    id: qo,
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
function jo(e = "2d8+2") {
  return Vo(
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
function dc() {
  return {
    ...rr("3d6", {
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
function rr(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Vo(
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
          damageType: a
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
          message: o
        }
      ]
    },
    "damage",
    e
  );
}
function mc() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: zo,
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
function fc() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: zo,
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
function Vo(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function ar() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: pe(t.id),
    actorId: pe(t.actor?.id),
    sceneId: pe(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Ho() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: pe(e.id),
    actorId: pe(t?.id),
    sceneId: pe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function pe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function pc(e) {
  return {
    logFirstRitualCost() {
      const t = Z("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = X(t);
      if (!n) return;
      const r = e.ritualCosts.getCost({ actor: t, ritual: n });
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      f.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: n.name,
        cost: r.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${n.name} custa ${r.value.amount} ${r.value.resource} (${r.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, n = "PE") {
      const r = Z("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const a = X(r);
      if (a) {
        if (!bc(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await a.setFlag(c, "ritual.cost", {
          resource: n,
          amount: t
        }), f.info(`Custo customizado aplicado em ${a.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${a.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = Z("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = X(t);
      n && (await n.unsetFlag(c, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = Z("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = X(t);
      if (!n) return;
      const r = e.automationRegistry.require(Bo);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = Z("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = X(n);
      if (!r) return;
      if (!Qr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(Uo);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: jo(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = Z("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = X(n);
      if (!r) return;
      if (!Qr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(Go);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: rr(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = Z("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = X(t);
      n && await gc(e, t, n);
    }
  };
}
async function gc(e, t, n) {
  const r = Ct(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ho(),
    item: n,
    targets: ar()
  });
  if (!a.ok) {
    hc(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", re(a.value.context));
}
function hc(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    f.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    f.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  f.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Z(e) {
  const t = He.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function X(e) {
  const t = Mo(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function bc(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Qr(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const _c = ["strict", "open"], Wo = "strict";
function yc(e) {
  return _c.includes(e) ? e : Wo;
}
function Ac(e) {
  return !e.hasResistance || e.difficulty === null ? { kind: "none" } : e.resistanceTotal === null ? {
    kind: "pending",
    difficulty: e.difficulty
  } : e.resistanceTotal >= e.difficulty ? {
    kind: "succeeded",
    difficulty: e.difficulty,
    total: e.resistanceTotal
  } : {
    kind: "failed",
    difficulty: e.difficulty,
    total: e.resistanceTotal
  };
}
function It(e, t) {
  return e === "strict" && t.kind === "pending";
}
const Tc = ["disabled", "ask", "automatic"], $c = ["buttons", "confirm"], Ko = "ask";
function Rc(e) {
  return typeof e == "string" && Tc.includes(e);
}
function wc(e) {
  return typeof e == "string" && $c.includes(e);
}
function kc(e) {
  return Rc(e) ? e : wc(e) ? "ask" : Ko;
}
const Ec = ["keep", "replace"], Cc = ["manual", "assisted"], Yo = "keep", Qo = "assisted", Ic = !0, k = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Sc() {
  game.settings.register(c, k.executionMode, {
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
    default: Ko
  }), game.settings.register(c, k.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Yo
  }), game.settings.register(c, k.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: Qo
  }), game.settings.register(c, k.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: Wo
  }), game.settings.register(c, k.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Ic
  }), game.settings.register(c, k.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Zr() {
  const e = kc(game.settings.get(c, k.executionMode)), t = Xo(game.settings.get(c, k.systemCardMode)), n = Jo(game.settings.get(c, k.damageResolutionMode)), r = or();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Zo()
  };
}
function Lc() {
  return Xo(game.settings.get(c, k.systemCardMode));
}
function Dc() {
  return Jo(game.settings.get(c, k.damageResolutionMode));
}
function or() {
  return yc(game.settings.get(c, k.resistanceGateMode));
}
function Zo() {
  return game.settings.get(c, k.ritualCastingCheckEnabled) === !0;
}
async function J(e) {
  await game.settings.set(c, k.executionMode, e);
}
function Xo(e) {
  return Ec.includes(e) ? e : Yo;
}
function Jo(e) {
  return Cc.includes(e) ? e : Qo;
}
function vc(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await J("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await J("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await J(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await J("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await J("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await J("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await J("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Pc = [
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
function Nc(e) {
  return {
    phases() {
      return Pc;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Wt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Vl(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Xr(e, t, n);
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
      if (!Mc(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Oc(n) ?? Wt("Nenhum ator encontrado para executar automação do item.");
      r && await Xr(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Wt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = jl(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(qo);
        if (!r.ok) {
          f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (r) {
        f.error("Falha ao configurar automação de teste no item.", r), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function Xr(e, t, n) {
  const r = Ct(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ho(),
    item: n,
    targets: ar()
  });
  if (!a.ok) {
    xc(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", re(a.value.context));
}
function xc(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    f.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    f.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  f.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Wt(e) {
  const t = He.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Oc(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Mc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Fc(e) {
  const t = ec(e), n = Wl(e), r = pc(e), a = Nc(e), o = rc(), s = vc(e);
  return {
    actor: t,
    automation: n,
    ritual: r,
    workflow: a,
    output: o,
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
function Bc(e) {
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
      const r = Jr();
      if (r.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const a = await Promise.all(
        r.map(
          (o) => e.applyCondition({
            actor: o,
            conditionId: t,
            duration: n.duration,
            originUuid: n.originUuid,
            source: n.source ?? "api.applyToSelectedTokens",
            refreshExisting: n.refreshExisting
          })
        )
      );
      return Uc(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Jr();
      if (n.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para remover a condição."), [];
      const r = await Promise.all(
        n.map(
          (a) => e.removeCondition({
            actor: a,
            conditionId: t
          })
        )
      );
      return Gc(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Jr() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function Uc(e) {
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
function Gc(e) {
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
function qc(e) {
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
    conditions: Bc(e.conditions),
    debug: Fc(e)
  }, n = globalThis;
  return n[c] = t, n.ParanormalToolkit = t, t;
}
class ea {
  static isSupportedSystem() {
    return game.system.id === El;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function zc() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ge(t.id),
    actorId: ge(t.actor?.id),
    sceneId: ge(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function ei() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: ge(e.id),
    actorId: ge(t?.id),
    sceneId: ge(e.scene?.id),
    name: n
  };
}
function jc(e, t = ei()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Vc(e) {
  if (!Kc(e)) return null;
  const t = e.getFlag(c, "workflow");
  return Wc(t) ? t : null;
}
function Hc() {
  return `flags.${c}.workflow`;
}
function ta(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), n = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || n !== void 0;
}
function na(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return bn(t) || bn(n);
}
function Wc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Kc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ge(e) {
  return bn(e) ? e : null;
}
function bn(e) {
  return typeof e == "string" && e.length > 0;
}
function Yc() {
  const e = (t, n) => {
    Qc(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Qc(e, t) {
  const n = Vc(e);
  if (!n || n.targets.length === 0) return;
  const r = Xc(t);
  if (!r || r.querySelector(`.${c}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Zc(n));
}
function Zc(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(ra("Origem", e.source.name)), t.append(ra("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function ra(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${c}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const a = document.createElement("span");
  return a.textContent = t, n.append(r, a), n;
}
function Xc(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Jc() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!eu(r) || !tu(e) || ta(e) || ta(t)) return;
    const a = zc();
    if (a.length === 0 || !na(e) && !na(t)) return;
    const o = ei();
    e.updateSource({
      [Hc()]: jc(a, o)
    }), f.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function eu(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function tu(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let aa = !1, Kt = !1, Yt = !1, nt = null;
const nu = 1e3, ru = 750, au = 1e3;
function ou(e) {
  aa || (Hooks.on("combatTurnChange", (t) => {
    su(e, oa(t));
  }), Hooks.on("deleteCombat", (t) => {
    lu(e, oa(t));
  }), aa = !0, iu(e));
}
function iu(e) {
  St() && (Kt || (Kt = !0, globalThis.setTimeout(() => {
    Kt = !1, ir(e, "ready");
  }, nu)));
}
function su(e, t) {
  St() && t && (nt && globalThis.clearTimeout(nt), nt = globalThis.setTimeout(() => {
    nt = null, ir(e, "combat-turn-change", t);
  }, ru));
}
function lu(e, t) {
  St() && t && (Yt || (Yt = !0, globalThis.setTimeout(() => {
    Yt = !1, ir(e, "combat-deleted", t);
  }, au)));
}
async function ir(e, t, n) {
  if (St())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && f.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const a of r.failures)
        f.warn(a.message);
    } catch (r) {
      f.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function St() {
  return game.user?.isGM === !0;
}
function oa(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const ti = {
  enabled: "dice.animations.enabled"
};
function cu() {
  game.settings.register(c, ti.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function uu() {
  return {
    enabled: game.settings.get(c, ti.enabled) === !0
  };
}
const Lt = "chatCard", ia = "data-paranormal-toolkit-prompt-id", i = `${c}-item-use-prompt`, du = `.${i}__title`, ni = `.${i}__header`, mu = `.${i}__roll-card`, fu = `.${i}__roll-meta`, pu = `.${i}__roll-meta-pill`, sr = `.${i}__resistance`, gu = `.${i}__resistance-header`, ri = `.${i}__resistance-description`, Dt = `.${i}__resistance-roll-button`, ai = `.${i}__resistance-roll-result`, sa = `${i}__resistance-content`, oi = `.${i}__workflow-section`, ii = `.${i}__workflow-roll`, lr = `${i}__workflow-roll--dice-open`, cr = `.${i}__workflow-roll-formula`, ur = `${i}__workflow-roll-formula--toggle`, vt = `.${i}__workflow-dice-tray`, hu = `.${i}__roll-detail-toggle`, bu = `.${i}__roll-detail-list`, _u = `.${i}__ritual-element-badge`, yu = `.${i}__ritual-metadata`, Au = "casting-backlash", Tu = "data-paranormal-toolkit-action-section", $u = "data-paranormal-toolkit-prompt-id", Ru = "data-paranormal-toolkit-pending-id", la = "data-paranormal-toolkit-casting-backlash-enhanced", ca = `.${i}`, wu = `.${i}__workflow-section--casting`, ku = `.${i}__workflow-section-header`, Eu = `.${i}__workflow-notes`, Cu = `[${Tu}="${Au}"]`, ua = `${i}__workflow-section-title-row`, Iu = `${i}__workflow-section-header--casting-backlash`, si = `${i}__casting-backlash-button`;
function Su(e) {
  for (const t of Lu(e))
    Du(t), Ou(t);
}
function Lu(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(ca) && t.add(e);
  for (const n of e.querySelectorAll(ca))
    t.add(n);
  return Array.from(t);
}
function Du(e) {
  const t = e.querySelector(Cu);
  if (!t) return;
  const n = vu(t);
  if (!n) return;
  const r = e.querySelector(`${wu} ${ku}`);
  r && (r.classList.add(Iu), Pu(r), Nu(n), r.append(n), t.remove());
}
function vu(e) {
  return e.querySelector(
    `button[${Ru}], button[${$u}]`
  );
}
function Pu(e) {
  const t = e.querySelector(`:scope > .${ua}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(ua);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(si) || n.append(a));
  return n;
}
function Nu(e) {
  if (e.getAttribute(la) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = xu(t, e.disabled);
  e.classList.add(si), e.setAttribute(la, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function xu(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Ou(e) {
  for (const t of e.querySelectorAll(Eu)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Mu(e) {
  for (const t of Array.from(e.querySelectorAll(oi)))
    for (const n of Array.from(t.querySelectorAll(`${hu}, ${bu}`)))
      n.remove();
}
const Fu = {
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
}, Bu = new Set(
  Object.values(Fu)
), Uu = {
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
function Gu(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = qu(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Uu[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Bu.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
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
function qu(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class ci {
  async applyDamage(t) {
    const n = t.actor, r = n.name ?? "Ator sem nome", a = n.id ?? null;
    if (!Array.isArray(t.instances) || t.instances.length === 0)
      return p({
        actor: n,
        actorId: a,
        actorName: r,
        reason: "empty-damage",
        message: "Nenhuma instância de dano foi informada."
      });
    const o = n.applyDamage;
    if (typeof o != "function")
      return p({
        actor: n,
        actorId: a,
        actorName: r,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const s = [], l = /* @__PURE__ */ new Set();
    let u = null;
    for (const [d, m] of t.instances.entries()) {
      const b = zu(m, d);
      if (!b.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const T = Gu(m.damageType);
      if (!T.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(m.damageType)}.`,
          instance: m,
          damageType: m.damageType
        });
      if (b.amount === 0) {
        s.push(
          ju(b.id, m, T.value)
        );
        continue;
      }
      try {
        const $ = await Promise.resolve(
          o.call(n, b.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const j of Hu($.conditions))
          l.add(j);
        const g = Vu($.newPV);
        g !== null && (u = g), s.push({
          id: b.id,
          label: m.label ?? li(T.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: b.amount,
          finalDamage: da($.finalDamage, b.amount),
          blocked: da($.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: T.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch ($) {
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: m,
          cause: $
        });
      }
    }
    return _({
      actor: n,
      actorId: a,
      actorName: r,
      totalRawDamage: s.reduce(
        (d, m) => d + m.inputAmount,
        0
      ),
      totalFinalDamage: s.reduce(
        (d, m) => d + m.finalDamage,
        0
      ),
      totalBlocked: s.reduce(
        (d, m) => d + m.blocked,
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
function zu(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function ju(e, t, n) {
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
function da(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Vu(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Hu(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class dr {
  async rollResistance(t) {
    const n = await Ku(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? ae(t.skill),
      roll: n,
      formula: Qu(n),
      total: Zu(n),
      diceBreakdown: Xu(n)
    };
  }
  getSkillLabel(t) {
    return ae(t);
  }
}
async function Wu(e, t) {
  return new dr().rollResistance({ actor: e, skill: t });
}
function ae(e) {
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
async function Ku(e, t) {
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
  return Yu(r);
}
function Yu(e) {
  return ma(e) ? e : Array.isArray(e) ? e.find(ma) ?? null : null;
}
function ma(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Qu(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Zu(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Xu(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Ju);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Ju(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class di {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class mi {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async rollResistance(t) {
    const n = t.skillLabel ?? this.adapter.getSkillLabel?.(t.skill) ?? t.skill, r = await this.adapter.rollResistance({ ...t, skillLabel: n });
    return {
      ...r,
      skill: r.skill || t.skill,
      skillLabel: r.skillLabel || n
    };
  }
  getSkillLabel(t) {
    return this.adapter.getSkillLabel?.(t) ?? t;
  }
}
function ed(e, t) {
  const n = sd(e?.rounds);
  if (!n)
    return fa(null);
  const r = e?.anchor ?? fi(t);
  if (!r)
    return {
      ...fa(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: td(),
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
    expiryEvent: a,
    durationMode: "combatantTurn",
    warning: null
  };
}
function fi(e) {
  const t = ld();
  if (!t?.id || !pi(t.round)) return null;
  const n = od(t), r = nd(e, n) ?? ad(t), a = H(r?.id), o = ud(r?.initiative), s = rd(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: cd()
  };
}
function td() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function fa(e) {
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
function nd(e, t) {
  return e?.id ? t.find((n) => id(n) === e.id) ?? null : null;
}
function rd(e, t, n) {
  const r = H(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return dd(e.turn) ? e.turn : null;
}
function ad(e) {
  return st(e.combatant) ? e.combatant : null;
}
function od(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(st);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(st);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(st);
  }
  return [];
}
function id(e) {
  return H(e.actor?.id) ?? H(e.actorId) ?? H(e.token?.actor?.id) ?? H(e.token?.actorId) ?? H(e.document?.actor?.id) ?? H(e.document?.actorId);
}
function sd(e) {
  return pi(e) ? Math.trunc(e) : null;
}
function ld() {
  return game.combat ?? null;
}
function cd() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function st(e) {
  return !!(e && typeof e == "object");
}
function H(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ud(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function pi(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function dd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class gi {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? _(n.value) : p({
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
    if (!Td(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = ed(t.duration, r), s = md(a, t, o), u = t.refreshExisting ?? !0 ? $d(r, a.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(s)), _(pa(r, a, u.id ?? null, !1, !0, o));
      } catch (d) {
        return p({
          actor: r,
          actorId: r.id ?? null,
          actorName: r.name ?? "Ator sem nome",
          conditionId: a.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${a.label} em ${r.name ?? "ator sem nome"}.`,
          cause: d
        });
      }
    try {
      const m = (await r.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return _(pa(r, a, m, !0, !1, o));
    } catch (d) {
      return p({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: a.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${a.label} em ${r.name ?? "ator sem nome"}.`,
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = bi(n, r);
    let o = 0;
    try {
      for (const s of a)
        await ga(n, s) === "deleted" && (o += 1);
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
    return _({
      actor: n,
      actorId: n.id ?? null,
      actorName: n.name ?? "Ator sem nome",
      conditionId: r,
      removed: o
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = kd(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = mr(s);
      a += l.length;
      for (const u of l) {
        if (!gd(u, t)) continue;
        const d = hi(u);
        try {
          await ga(s, u) === "deleted" && (o += 1);
        } catch (m) {
          r.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: u.id ?? null,
            conditionId: d.conditionId,
            message: `Falha ao remover condição expirada ${d.conditionId ?? u.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
            cause: m
          });
        }
      }
    }
    return {
      reason: t.reason ?? "manual",
      scannedActors: n.length,
      scannedEffects: a,
      removedEffects: o,
      failures: r
    };
  }
}
function md(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: xd(),
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
    changes: e.changes.map((a) => ({ ...a })),
    duration: fd(n.duration),
    start: pd(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [c]: r
    }
  };
}
function fd(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function pd(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Nd(),
    ...e
  };
}
function pa(e, t, n, r, a, o) {
  return {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    conditionId: t.id,
    conditionLabel: t.label,
    effectId: n,
    created: r,
    refreshed: a,
    requestedRounds: o.requestedRounds,
    combatDurationApplied: o.combatDurationApplied,
    warning: o.warning
  };
}
function gd(e, t) {
  const n = hi(e);
  if (!n.conditionId || !hd(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Pd();
  return n.durationMode === "combatantTurn" || bd(n) ? yd(n, r) : _d(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !v(n.startRound) || !v(n.requestedRounds) || !v(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function hd(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && v(e.requestedRounds);
}
function bd(e) {
  return !!(e.combatDurationApplied && v(e.requestedRounds) && v(e.startRound) && (e.startCombatantId || ft(e.startTurn)));
}
function _d(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function yd(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !v(e.startRound) || !v(e.requestedRounds) || !v(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Ad(t);
  return e.startCombatantId ? r === e.startCombatantId : ft(e.startTurn) && ft(t.turn) ? t.turn === e.startTurn : !1;
}
function Ad(e) {
  return he(e.combatant?.id);
}
function hi(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: lt(e, "conditionId"),
    requestedRounds: ha(e, "requestedRounds") ?? Oe(t.value) ?? Oe(t.rounds),
    combatDurationApplied: Qt(e, "combatDurationApplied"),
    combatId: lt(e, "combatId") ?? he(n.combat) ?? he(t.combat),
    startCombatantId: lt(e, "startCombatantId") ?? he(n.combatant),
    startInitiative: Sd(e, "startInitiative") ?? _i(n.initiative),
    startRound: ha(e, "startRound") ?? Oe(n.round) ?? Oe(t.startRound),
    startTurn: Id(e, "startTurn") ?? _n(n.turn) ?? _n(t.startTurn),
    expiryEvent: Ld(e, "expiryEvent") ?? yi(t.expiry),
    durationMode: Dd(e, "durationMode"),
    deleteOnExpire: Qt(e, "deleteOnExpire"),
    expiresWithCombat: Qt(e, "expiresWithCombat")
  };
}
function Td(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function $d(e, t) {
  return bi(e, t)[0] ?? null;
}
function bi(e, t) {
  return mr(e).filter((n) => Cd(n) === t);
}
async function ga(e, t) {
  const n = t.id ?? null, r = n ? Rd(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (wd(a)) return "missing";
    throw a;
  }
}
function Rd(e, t) {
  return mr(e).find((n) => n.id === t) ?? null;
}
function wd(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function kd() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      rt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    rt(e, n);
  });
  for (const n of Ed())
    rt(e, n.actor), rt(e, n.document?.actor);
  return Array.from(e.values());
}
function rt(e, t) {
  if (!vd(t)) return;
  const r = he(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Ed() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function mr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Cd(e) {
  return lt(e, "conditionId");
}
function lt(e, t) {
  return he(se(e, t));
}
function ha(e, t) {
  return Oe(se(e, t));
}
function Id(e, t) {
  return _n(se(e, t));
}
function Sd(e, t) {
  return _i(se(e, t));
}
function Ld(e, t) {
  return yi(se(e, t));
}
function Dd(e, t) {
  const n = se(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Qt(e, t) {
  return se(e, t) === !0;
}
function se(e, t) {
  const n = e.getFlag?.(c, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const a = r[c];
  if (!(!a || typeof a != "object"))
    return a[t];
}
function he(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Oe(e) {
  return v(e) ? Math.trunc(e) : null;
}
function _n(e) {
  return ft(e) ? Math.trunc(e) : null;
}
function _i(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function yi(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function vd(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Pd() {
  return game.combat ?? null;
}
function Nd() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function v(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function ft(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function xd() {
  return game.user?.id ?? null;
}
const Od = "icons/svg/downgrade.svg", Md = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function y(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Od,
    description: Md,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Fd = y({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Bd = y({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Ud = y({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Gd = y({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), qd = y({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), zd = y({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), jd = y({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Vd = y({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Hd = y({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Wd = y({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Kd = y({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Yd = y({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Qd = y({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Zd = y({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Xd = y({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Jd = y({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), em = y({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), tm = y({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), nm = y({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), rm = y({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), am = y({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), om = y({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), im = y({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), sm = y({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), lm = y({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), cm = y({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), um = y({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), dm = y({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), mm = y({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), fm = y({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), pm = y({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), gm = y({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), hm = y({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), bm = y({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), _m = [
  Fd,
  Bd,
  Ud,
  Gd,
  qd,
  zd,
  jd,
  Vd,
  Hd,
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
  am,
  om,
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
  bm
];
class ym {
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
    return Array.from(this.definitions.values()).map(ba);
  }
  get(t) {
    const n = this.lookup.get(_a(t)), r = n ? this.definitions.get(n) : null;
    return r ? _(ba(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = _a(t);
    r && this.lookup.set(r, n);
  }
}
function Ai() {
  return new ym(_m);
}
function ba(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function _a(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const Am = {
  available: "Aplicar dano",
  availableCompact: "Dano",
  waitingResistance: "Role resistência",
  waitingResistanceCompact: "Role res.",
  resisted: "Aplicar metade",
  resistedCompact: "½ dano",
  applied: "Dano aplicado",
  appliedCompact: "Aplicado",
  unavailable: "Dano indisponível",
  unavailableCompact: "Sem dano"
}, Tm = {
  available: "Aplicar efeito",
  availableCompact: "Efeito",
  waitingResistance: "Role resistência",
  waitingResistanceCompact: "Role res.",
  resisted: "Resistiu ao efeito",
  resistedCompact: "Resistiu",
  applied: "Efeito aplicado",
  appliedCompact: "Aplicado",
  unavailable: "Efeito indisponível",
  unavailableCompact: "Sem efeito"
};
function $m(e) {
  return $i(e, Am, !1);
}
function Rm(e) {
  return $i(e, Tm, !0);
}
function Ke(e) {
  return e.kind === "waiting-resistance";
}
function Ti(e) {
  return e.kind === "resisted";
}
function $i(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? ve("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? ve("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : It(e.resistanceGateMode, e.resistanceState) ? ve(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? ve("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : ve("available", !0, r.available, r.availableCompact, null);
}
function ve(e, t, n, r, a) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: a
  };
}
const Me = "data-paranormal-toolkit-prompt-id", wm = "data-paranormal-toolkit-resistance-roll-result", km = "Conjuração DT";
function Em(e) {
  const t = e.querySelector(Dt)?.getAttribute(wm), n = qe(t);
  if (n !== null) return n;
  const r = e.querySelector(ai)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return qe(a?.[1] ?? null);
}
function Ri(e) {
  const t = vm(e), n = Sm(t);
  if (n !== null) return n;
  const r = Lm(t);
  return r !== null ? r : Dm(e);
}
function Cm(e) {
  const t = e.getAttribute(Me);
  if (!t) return null;
  const n = wi(e), r = ki(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Pt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function W(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Im(e) {
  return W(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Sm(e) {
  const t = Nm(e);
  return t.length === 0 ? null : qe(xm(t, km));
}
function Lm(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : ya(r, ["system", "ritual", "DT"]) ?? ya(r, ["system", "ritual", "dt"]);
}
function Dm(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return qe(n?.[1] ?? null);
}
function vm(e) {
  const t = Pm(e);
  if (!t) return null;
  const n = wi(e), r = ki(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Pt(o) ? o.pendingId === t : !1) ?? null;
}
function Pm(e) {
  return (e.closest(`[${Me}]`) ?? e.querySelector(`[${Me}]`) ?? e.parentElement?.querySelector(`[${Me}]`) ?? null)?.getAttribute(Me) ?? null;
}
function wi(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Om(a) ? a : null;
}
function ki(e) {
  const t = e?.getFlag?.(c, Lt);
  return Pt(t) ? t : null;
}
function Nm(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function xm(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function ya(e, t) {
  let n = e;
  for (const r of t) {
    if (!Pt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : qe(typeof n == "string" ? n : null);
}
function qe(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Om(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Pt(e) {
  return !!(e && typeof e == "object");
}
function Ei(e) {
  return Ci({
    hasResistance: !!e.querySelector(sr),
    difficulty: Ri(e),
    resistanceTotal: Em(e)
  });
}
function Mm(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Ci({
      hasResistance: e.hasResistance,
      difficulty: e.difficulty,
      resistanceTotal: null
    });
  if (e.status === "pending")
    return {
      hasResistance: !0,
      difficulty: e.difficulty,
      total: null,
      state: {
        kind: "pending",
        difficulty: e.difficulty
      }
    };
  const t = e.total ?? 0;
  return {
    hasResistance: !0,
    difficulty: e.difficulty,
    total: t,
    state: {
      kind: e.status === "succeeded" ? "succeeded" : "failed",
      difficulty: e.difficulty,
      total: t
    }
  };
}
function Ci(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Ac(e)
  };
}
function le() {
  return game.user?.isGM === !0;
}
function oe() {
  return le();
}
function Fm(e) {
  const t = It(e.resistanceGateMode, e.resistanceState), n = Bm(e.resistanceState, e.hasDamage), r = Um(e.resistanceState, e.hasEffect), a = $m({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = Rm({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.effectAlreadyApplied,
    unavailable: !e.hasEffect
  });
  return {
    canShowApplyDamage: e.isGM && e.hasDamage,
    canShowApplyEffect: e.isGM && e.hasEffect,
    damageActionState: a,
    effectActionState: o,
    damageMode: n,
    effectMode: r,
    blocksPendingResistance: t
  };
}
function Bm(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function Um(e, t) {
  return t ? e.kind === "succeeded" ? "resisted" : "applicable" : "unavailable";
}
function fr(e) {
  const t = e.isGM ?? oe();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: Fm({
      isGM: t,
      resistanceGateMode: e.resistanceGateMode,
      resistanceState: e.resistanceState,
      hasDamage: e.damage !== null,
      hasEffect: e.effect !== null,
      damageAlreadyApplied: e.damageAlreadyApplied,
      effectAlreadyApplied: e.effectAlreadyApplied
    })
  };
}
function Gm(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = zm(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function qm(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function zm(e, t) {
  const n = jm(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of Vm(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function jm(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Vm(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Aa(e, "highest") : n.includes("kl") ? Aa(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Aa(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const Hm = "data-paranormal-toolkit-resistance-skill", Wm = "data-paranormal-toolkit-resistance-skill-label", Ii = "pending", pr = "success", gr = "failure", Si = "rolled";
function Km(e) {
  const t = ef(e.rollCard, e.damageSection), n = Zm(e.damageSection), r = Xm(e.rollCard, e.effectSection, e.resolveTargetConditionApplication), a = Ym(e.rollCard).map((o, s) => {
    const l = Qm(o, s), u = e.resistanceResults.get(l) ?? null, d = tf(u, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, b = e.effectApplications.get(l) ?? null;
    return {
      id: l,
      name: o,
      state: d,
      resistanceResult: u,
      damageApplication: m,
      effectApplication: b,
      assistedActions: fr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: Mm({
          hasResistance: !!t,
          difficulty: t?.difficulty ?? null,
          total: u?.total ?? null,
          status: of(d)
        }).state,
        damage: n,
        effect: r,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!b
      })
    };
  });
  return a.length <= 1 || !e.damageSection ? null : {
    rollCard: e.rollCard,
    targets: a,
    damage: n,
    effect: r,
    resistance: t
  };
}
function Ym(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((a) => a.trim()).filter((a) => a.length > 0 && Li(a) !== "nenhum alvo") : [];
}
function Qm(e, t) {
  return `${Li(e)}:${t}`;
}
function Zm(e) {
  const t = nf(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: af(e),
    formula: rf(e) ?? "—",
    total: t,
    diceBreakdown: qm(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Xm(e, t, n) {
  const r = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), a = n(e, r ?? null);
  return a ? {
    label: r && r.length > 0 ? r : a.conditionLabel,
    conditionId: a.conditionId,
    conditionLabel: a.conditionLabel,
    duration: Jm(a.duration),
    source: a.source,
    originUuid: a.originUuid
  } : null;
}
function Jm(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function ef(e, t) {
  const n = t?.querySelector(`.${i}__resistance-description`)?.textContent?.trim(), r = t?.querySelector(Dt) ?? null, a = r?.getAttribute(Hm) ?? null, o = r?.getAttribute(Wm) ?? (a ? ae(a) : null);
  return !n && !a ? null : {
    description: n ?? "Resistência do alvo.",
    formula: t?.querySelector(`.${i}__resistance .${i}__workflow-roll-formula`)?.textContent?.trim() ?? null,
    skill: a,
    skillLabel: o,
    difficulty: Ri(e)
  };
}
function tf(e, t) {
  return e ? t === null ? Si : e.total >= t ? pr : gr : Ii;
}
function nf(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function rf(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function af(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Li(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function of(e) {
  return e === pr ? "succeeded" : e === gr ? "failed" : "pending";
}
function sf(e) {
  if (!e) return null;
  const t = e.actorId ? uf(e.actorId) : null, n = t ? lf(t, e.itemId, e.itemName) : null;
  return n || cf(e.itemId, e.itemName);
}
function lf(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (be(o)) return o;
  }
  const a = pt(n);
  if (a) {
    const o = r?.find?.((s) => be(s) ? pt(s.name) === a : !1);
    if (be(o)) return o;
  }
  return null;
}
function cf(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (be(a)) return a;
  }
  const r = pt(t);
  if (r) {
    const a = n?.find?.((o) => be(o) ? pt(o.name) === r : !1);
    if (be(a)) return a;
  }
  return null;
}
function uf(e) {
  const n = game.actors?.get?.(e);
  return df(n) ? n : null;
}
function df(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function be(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function pt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function hr(e) {
  const t = Zt(e);
  if (!t) return null;
  const n = mf().filter((o) => Zt(ff(o)) === t).map((o) => Di(o)).find(Ue) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => Ue(o) && Zt(o.name) === t);
  return Ue(a) ? a : null;
}
function mf() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function ff(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Di(e)?.name ?? null;
}
function Di(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ue(t)) return t;
  const n = e.document?.actor;
  return Ue(n) ? n : null;
}
function Ue(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Zt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function vi(e) {
  const t = bf();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: pf(e)
  });
}
function pf(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${ct(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = gf(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${ct(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${ct(e.actorName)}</strong></p>
      <ul>
        ${t}
        ${n}
        ${r}
        ${a}
        ${o}
      </ul>
    </div>
  `;
}
function gf(e) {
  const t = hf(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${ct(a)}</li>`;
}
function hf(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = Ta(n?.value);
  return r === null ? null : {
    value: r,
    max: Ta(n?.max)
  };
}
function Ta(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function bf() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function ct(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function _f(e) {
  await vi(yf(e));
}
function yf(e) {
  if (Af(e)) return e;
  const t = e.finalDamage + e.blocked;
  return {
    actor: e.actor,
    actorId: e.actor.id ?? null,
    actorName: e.targetName,
    totalRawDamage: t,
    totalFinalDamage: e.finalDamage,
    totalBlocked: e.blocked,
    newPV: null,
    conditions: [],
    instances: [
      {
        id: "multi-target-damage",
        label: "Dano",
        sourceRollId: null,
        inputAmount: t,
        finalDamage: e.finalDamage,
        blocked: e.blocked,
        damageType: null,
        systemDamageType: null,
        ignoreResistance: !1,
        nonLethal: !1
      }
    ],
    source: "item-use.multi-target-damage",
    originUuid: null
  };
}
function Af(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Pi(e) {
  return e.mode, `✓ ${Ni(e.inputAmount)} PV`;
}
function Tf(e) {
  const t = Ni(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Ni(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class $f {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? oe()) !== !0 ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "permission-denied",
        message: "Apenas o Mestre pode aplicar dano assistido."
      }
    } : It(t.resistanceGateMode, t.resistanceState) ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "resistance-pending",
        message: "Role a resistência do alvo antes de aplicar dano."
      }
    } : this.damage.applyDamage({
      actor: t.actor,
      instances: [
        {
          amount: t.amount,
          damageType: t.damageType,
          label: t.label,
          sourceRollId: t.sourceRollId ?? null,
          ignoreResistance: !1
        }
      ],
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
class Rf {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? oe()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : It(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.resistanceState.kind === "succeeded" ? this.block(t, "resistance-succeeded", "Este alvo resistiu ao efeito.") : this.conditions.applyCondition({
      actor: t.actor,
      conditionId: t.conditionId,
      duration: t.duration ?? null,
      originUuid: t.originUuid ?? null,
      source: t.source ?? null
    });
  }
  block(t, n, r) {
    return {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: n,
        message: r
      }
    };
  }
}
class wf {
  constructor(t) {
    this.resistance = t;
  }
  resistance;
  async execute(t) {
    return this.resistance.rollResistance({
      actor: t.actor,
      skill: t.skill,
      skillLabel: t.skillLabel
    });
  }
}
const kf = `.${i}__actions`, br = `.${i}__actions-title`, gt = `.${i}__button`, Ef = "data-paranormal-toolkit-action-section", Cf = `${i}__button--executed`, If = "data-paranormal-toolkit-executed-label";
function xi(e) {
  return W(e.querySelector(br)?.textContent);
}
function Sf(e, t) {
  const n = e.querySelector(br);
  n && (n.textContent = t);
}
function Nt(e, t) {
  const n = W(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return W(a) === n;
  }) ?? null;
}
function _r(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function ce(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const at = "data-paranormal-toolkit-prompt-id", Oi = "multiTargetResistanceResults", Mi = "multiTargetDamageApplications", Fi = "multiTargetEffectApplications";
function Lf(e) {
  const t = /* @__PURE__ */ new Map(), r = xt(e)?.[Oi];
  if (!N(r)) return t;
  for (const [a, o] of Object.entries(r))
    Mf(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Df(e, t) {
  await yr(e, Oi, t.targetId, t);
}
function vf(e) {
  const t = /* @__PURE__ */ new Map(), r = xt(e)?.[Mi];
  if (!N(r)) return t;
  for (const [a, o] of Object.entries(r))
    Ff(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Pf(e, t) {
  await yr(
    e,
    Mi,
    t.targetId,
    t
  );
}
function Nf(e) {
  const t = /* @__PURE__ */ new Map(), r = xt(e)?.[Fi];
  if (!N(r)) return t;
  for (const [a, o] of Object.entries(r))
    Uf(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function xf(e, t) {
  await yr(
    e,
    Fi,
    t.targetId,
    t
  );
}
function Of(e) {
  const t = xt(e);
  return t ? {
    actorId: Xt(t.actorId),
    itemId: Xt(t.itemId),
    itemName: Xt(t.itemName)
  } : null;
}
async function yr(e, t, n, r) {
  const a = Bi(e);
  if (!a) return;
  const o = Ui(e), s = Gi(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const u = s.prompts.map((d) => {
    if (!N(d) || d.pendingId !== a) return d;
    const m = N(d[t]) ? d[t] : {};
    return l = !0, {
      ...d,
      [t]: {
        ...m,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(o.setFlag?.(c, Lt, {
    ...s,
    prompts: u
  }));
}
function xt(e) {
  const t = Bi(e);
  if (!t) return null;
  const n = Ui(e), r = Gi(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => N(o) ? o.pendingId === t : !1) ?? null;
}
function Bi(e) {
  return (e.closest(`[${at}]`) ?? e.querySelector(`[${at}]`) ?? e.parentElement?.querySelector(`[${at}]`) ?? null)?.getAttribute(at) ?? null;
}
function Ui(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Gf(a) ? a : null;
}
function Gi(e) {
  const t = e?.getFlag?.(c, Lt);
  return N(t) ? t : null;
}
function Mf(e) {
  return N(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function Ff(e) {
  return N(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && Bf(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function Bf(e) {
  return e === "normal" || e === "half";
}
function Uf(e) {
  return N(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function Xt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Gf(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function N(e) {
  return !!(e && typeof e == "object");
}
const qf = "data-paranormal-toolkit-resistance-skill", zf = "data-paranormal-toolkit-resistance-skill-label", yn = "data-paranormal-toolkit-multi-target-section", Ar = "data-paranormal-toolkit-multi-target-damage-info", qi = "data-paranormal-toolkit-multi-target-effect-info", zi = "data-paranormal-toolkit-multi-target-toggle", ji = "data-paranormal-toolkit-multi-target-details", D = "data-paranormal-toolkit-multi-target-target", jf = "data-paranormal-toolkit-multi-target-state", An = "data-paranormal-toolkit-multi-target-roll-total", Tn = "data-paranormal-toolkit-multi-target-roll-formula", ut = "data-paranormal-toolkit-multi-target-roll-dice", $n = "data-paranormal-toolkit-multi-target-roll-skill", Rn = "data-paranormal-toolkit-multi-target-roll-skill-label", wn = "data-paranormal-toolkit-multi-target-roll-target-name", kn = "data-paranormal-toolkit-multi-target-roll-rolled-at", En = "data-paranormal-toolkit-multi-target-damage-mode", Cn = "data-paranormal-toolkit-multi-target-damage-input-amount", $a = "data-paranormal-toolkit-multi-target-damage-final-amount", Ra = "data-paranormal-toolkit-multi-target-damage-blocked", In = "data-paranormal-toolkit-multi-target-damage-target-name", Sn = "data-paranormal-toolkit-multi-target-damage-applied-at", Ln = "data-paranormal-toolkit-multi-target-effect-condition-id", Dn = "data-paranormal-toolkit-multi-target-effect-condition-label", vn = "data-paranormal-toolkit-multi-target-effect-effect-id", Pn = "data-paranormal-toolkit-multi-target-effect-created", Nn = "data-paranormal-toolkit-multi-target-effect-refreshed", xn = "data-paranormal-toolkit-multi-target-effect-target-name", On = "data-paranormal-toolkit-multi-target-effect-applied-at", Vf = new gi(Ai()), Hf = new di(new ci()), Wf = new mi(new dr()), Kf = new wf(Wf), Yf = new $f(Hf), Qf = new Rf(Vf), Zf = Ii, ke = pr, Ye = gr, Xf = Si;
function Jf(e) {
  const t = Vi(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), lp(e);
  const n = cp(e.rollCard);
  dp(n, t.damage), fp(e.rollCard, n);
  const r = pp(e.rollCard);
  if (Wi(r, t), Mp(e.rollCard, r, n), t.effect) {
    const a = Fp(e.rollCard);
    Bp(a, t.effect), Up(e.rollCard, a, r);
  } else
    rs(e.rollCard)?.remove();
  return !0;
}
function Vi(e) {
  return Km({
    ...e,
    resistanceResults: np(e.rollCard),
    damageApplications: rp(e.rollCard),
    effectApplications: ap(e.rollCard),
    resolveTargetConditionApplication: ep,
    resistanceGateMode: $r()
  });
}
function ep(e, t) {
  const n = Of(e), r = sf(n);
  if (!r) return null;
  const a = Ct(r);
  if (!a.ok) return null;
  const o = (a.value.conditionApplications ?? []).filter((l) => l.actor === "target");
  if (o.length === 0) return null;
  const s = tp(o, t);
  return s ? {
    conditionId: s.conditionId,
    conditionLabel: s.label ?? s.conditionId,
    duration: s.duration ?? null,
    source: s.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null
  } : null;
}
function tp(e, t) {
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const n = Ea(t);
  return n ? e.find((r) => [
    r.label,
    r.conditionId
  ].some((a) => Ea(a) === n)) ?? null : null;
}
function np(e) {
  const t = Lf(e);
  for (const [n, r] of sp(e))
    t.set(n, r);
  return t;
}
function rp(e) {
  const t = vf(e);
  for (const [n, r] of ip(e))
    t.set(n, r);
  return t;
}
function ap(e) {
  const t = Nf(e);
  for (const [n, r] of op(e))
    t.set(n, r);
  return t;
}
function op(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${D}]`)) {
    const r = n.getAttribute(D), a = n.getAttribute(Ln), o = n.getAttribute(Dn), s = n.getAttribute(vn), l = Ca(n.getAttribute(Pn)), u = Ca(n.getAttribute(Nn)), d = n.getAttribute(xn), m = n.getAttribute(On);
    !r || !a || !o || l === null || u === null || !d || !m || t.set(r, {
      targetId: r,
      targetName: d,
      conditionId: a,
      conditionLabel: o,
      effectId: s && s.length > 0 ? s : null,
      created: l,
      refreshed: u,
      appliedAt: m
    });
  }
  return t;
}
function ip(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${D}]`)) {
    const r = n.getAttribute(D), a = n.getAttribute(En), o = as(n.getAttribute(Cn)), s = n.getAttribute(In), l = n.getAttribute(Sn);
    !r || !zp(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function sp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${D}]`)) {
    const r = n.getAttribute(D), a = as(n.getAttribute(An)), o = n.getAttribute(Tn), s = n.getAttribute($n), l = n.getAttribute(Rn), u = n.getAttribute(wn), d = n.getAttribute(kn);
    !r || a === null || !o || !s || !l || !u || !d || t.set(r, {
      targetId: r,
      targetName: u,
      skill: s,
      skillLabel: l,
      formula: o,
      total: a,
      diceBreakdown: n.getAttribute(ut),
      rolledAt: d
    });
  }
  return t;
}
function lp(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function cp(e) {
  const t = up(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Ar, "true"), n;
}
function up(e) {
  return e.querySelector(`[${Ar}="true"]`);
}
function dp(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(Hi(t.formula, t.total, t.diceBreakdown));
}
function Hi(e, t, n, r = !1) {
  const a = Gm({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return mp(a, r), a;
}
function mp(e, t) {
  const n = e.querySelector(vt), r = e.querySelector(cr);
  if (!n || !r) return;
  e.classList.toggle(lr, t), n.hidden = !t, r.classList.add(ur), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function fp(e, t) {
  const n = Nt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function pp(e) {
  const t = e.querySelector(`[${yn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(yn, "true"), n;
}
function Wi(e, t) {
  const n = gp(e);
  e.replaceChildren(hp(t), _p(t, n));
}
function gp(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${D}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(D)).filter(qp)
  );
}
function hp(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = bp(e.targets), t.append(n, r), t;
}
function bp(e) {
  const t = e.length, n = e.filter((l) => l.state === Ye).length, r = e.filter((l) => l.state === ke).length, a = e.filter((l) => l.state === Zf).length, o = e.filter((l) => l.state === Xf).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function _p(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(yp(r, e, t.has(r.id)));
  return n;
}
function yp(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(D, e.id), r.setAttribute(jf, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Ki(r, e.resistanceResult), Yi(r, e.damageApplication), Qi(r, e.effectApplication);
  const a = Ap(e, t, r), o = Pp(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    ka(s.target) || wa(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || ka(s.target) || (s.preventDefault(), wa(r));
  }), r.append(a, o), r;
}
function Ki(e, t) {
  if (!t) {
    e.removeAttribute(An), e.removeAttribute(Tn), e.removeAttribute(ut), e.removeAttribute($n), e.removeAttribute(Rn), e.removeAttribute(wn), e.removeAttribute(kn);
    return;
  }
  e.setAttribute(An, String(t.total)), e.setAttribute(Tn, t.formula), e.setAttribute($n, t.skill), e.setAttribute(Rn, t.skillLabel), e.setAttribute(wn, t.targetName), e.setAttribute(kn, t.rolledAt), t.diceBreakdown ? e.setAttribute(ut, t.diceBreakdown) : e.removeAttribute(ut);
}
function Yi(e, t) {
  if (!t) {
    e.removeAttribute(En), e.removeAttribute(Cn), e.removeAttribute($a), e.removeAttribute(Ra), e.removeAttribute(In), e.removeAttribute(Sn);
    return;
  }
  e.setAttribute(En, t.mode), e.setAttribute(Cn, String(t.inputAmount)), e.removeAttribute($a), e.removeAttribute(Ra), e.setAttribute(In, t.targetName), e.setAttribute(Sn, t.appliedAt);
}
function Qi(e, t) {
  if (!t) {
    e.removeAttribute(Ln), e.removeAttribute(Dn), e.removeAttribute(vn), e.removeAttribute(Pn), e.removeAttribute(Nn), e.removeAttribute(xn), e.removeAttribute(On);
    return;
  }
  e.setAttribute(Ln, t.conditionId), e.setAttribute(Dn, t.conditionLabel), e.setAttribute(vn, t.effectId ?? ""), e.setAttribute(Pn, String(t.created)), e.setAttribute(Nn, String(t.refreshed)), e.setAttribute(xn, t.targetName), e.setAttribute(On, t.appliedAt);
}
function Ap(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = Tp(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = $p(e, t.resistance);
  Ep(l, n, e, t);
  const u = vp(n);
  a.append(o, s, l, u);
  const d = document.createElement("div");
  return d.classList.add(`${i}__target-summary-actions`), ts(d, [
    Xi(e, t, "compact"),
    es(e, t, "compact")
  ]), r.append(a, d), r;
}
function Tp(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function $p(e, t) {
  if (!le())
    return Rp(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", kp(e, t)), t?.skill && (n.setAttribute(qf, t.skill), n.setAttribute(zf, t.skillLabel ?? ae(t.skill))), !t?.skill)
    return n.disabled = !0, n.title = "Resistência não configurada", n.textContent = "—", n;
  if (n.title = e.resistanceResult ? `Rolar ${t.skillLabel ?? t.skill} novamente` : `Rolar ${t.skillLabel ?? t.skill} de ${e.name}`, !e.resistanceResult) {
    const o = document.createElement("i");
    o.classList.add("fa-solid", "fa-dice-d20"), o.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    return s.classList.add(`${i}__target-resistance-fallback`), s.textContent = "d20", n.append(o, s), n;
  }
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === ke ? "✓" : e.state === Ye ? "✕" : "", n.append(r, a), n;
}
function Rp(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", wp(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === ke ? "✓" : e.state === Ye ? "✕" : "", n.append(r, a), n;
}
function wp(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === ke ? "sucesso" : e.state === Ye ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function kp(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === ke ? "sucesso" : e.state === Ye ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Ep(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !le() || e.addEventListener("click", (a) => {
    a.stopPropagation(), Cp(t, e, n, r);
  });
}
async function Cp(e, t, n, r) {
  if (!le()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? ae(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = hr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const u = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Kf.execute({ actor: l, skill: o, skillLabel: s });
    await Gp(d.roll);
    const m = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      skill: o,
      skillLabel: s,
      formula: d.formula,
      total: d.total,
      diceBreakdown: d.diceBreakdown,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Ki(e, m);
    try {
      await Df(r.rollCard, m);
    } catch (b) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", b);
    }
    Tr(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = u;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Tr(e) {
  const t = e.closest(`[${yn}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Vi({
    rollCard: n,
    damageSection: Ip(n) ?? Nt(n, "Dano"),
    effectSection: Sp(n)
  });
  r && Wi(t, r);
}
function Ip(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Ar) !== "true") ?? null;
}
function Sp(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Zi(e, t) {
  return Ke(e.assistedActions.policy.damageActionState);
}
function $r() {
  try {
    return or();
  } catch {
    return "strict";
  }
}
function Xi(e, t, n) {
  if (e.damageApplication)
    return M(
      "✓",
      Pi({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Ke(r))
    return M(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal", o = Ji(a, t.damage);
  if (o === null)
    return M(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = Tf({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", u = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, d = M(
    l,
    s,
    [`${i}__target-action--damage`, u],
    !1
  );
  return d.title = `Aplicar ${s} em ${e.name}`, d.setAttribute("aria-label", d.title), d.addEventListener("click", (m) => {
    m.stopPropagation();
    const b = d.closest(`[${D}]`);
    b && Lp(b, d, e, t);
  }), d;
}
function Ji(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Lp(e, t, n, r) {
  if (n.damageApplication) return;
  if (Zi(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = n.assistedActions.policy.damageMode ?? "normal", o = Ji(a, r.damage);
  if (o === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const s = hr(n.name);
  if (!s) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const l = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await Yf.execute({
      actor: s,
      amount: o,
      damageType: r.damage.typeLabel,
      label: a === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: $r(),
      resistanceState: n.assistedActions.resistanceState
    });
    if (!u.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${u.error.message}`), t.innerHTML = l;
      return;
    }
    const d = {
      targetId: n.id,
      targetName: s.name ?? n.name,
      mode: a,
      inputAmount: o,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Yi(e, d);
    try {
      await Pf(r.rollCard, d);
    } catch (m) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", m);
    }
    try {
      await _f(u.value);
    } catch (m) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", m);
    }
    Tr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function es(e, t, n) {
  const r = e.assistedActions.policy.effectActionState;
  if (!t.effect)
    return M(
      "✦",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--disabled`],
      !0
    );
  if (e.effectApplication)
    return M(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (Ke(r))
    return M(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (Ti(r))
    return M(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const a = M(
    "✦",
    n === "full" ? `Aplicar ${t.effect.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return a.title = `Aplicar ${t.effect.conditionLabel} em ${e.name}`, a.setAttribute("aria-label", a.title), a.addEventListener("click", (o) => {
    o.stopPropagation();
    const s = a.closest(`[${D}]`);
    s && Dp(s, a, e, t);
  }), a;
}
async function Dp(e, t, n, r) {
  if (n.effectApplication) return;
  if (Zi(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar efeito.");
    return;
  }
  if (n.assistedActions.policy.effectMode === "resisted") {
    ui.notifications?.warn?.("Paranormal Toolkit: este alvo resistiu ao efeito.");
    return;
  }
  const a = r.effect;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui efeito estruturado para aplicar.");
    return;
  }
  const o = hr(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await Qf.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: $r(),
      resistanceState: n.assistedActions.resistanceState
    });
    if (!l.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${l.error.message}`), t.innerHTML = s;
      return;
    }
    const u = {
      targetId: n.id,
      targetName: l.value.actorName,
      conditionId: l.value.conditionId,
      conditionLabel: l.value.conditionLabel,
      effectId: l.value.effectId,
      created: l.value.created,
      refreshed: l.value.refreshed,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Qi(e, u);
    try {
      await xf(r.rollCard, u);
    } catch (d) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", d);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Tr(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function ts(e, t) {
  for (const n of t)
    n && e.append(n);
}
function M(e, t, n, r) {
  const a = document.createElement("button");
  a.type = "button", a.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), a.disabled = r;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, a.append(o, s), a;
}
function vp(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(zi, "true"), t.setAttribute("aria-hidden", "true"), ns(e, t), t;
}
function wa(e) {
  const t = e.querySelector(`[${ji}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${zi}="true"]`);
  r && ns(e, r);
}
function ns(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function ka(e) {
  return e instanceof HTMLElement ? !!e.closest([
    "button",
    "a",
    "input",
    "select",
    "textarea",
    `.${i}__workflow-roll`,
    `.${i}__workflow-roll-formula`,
    `.${i}__workflow-dice-tray`
  ].join(", ")) : !1;
}
function Pp(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(ji, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = Np(e, t.resistance);
  s && r.append(s);
  const l = xp(e, t.resistance), u = Op(e, t);
  return n.append(r, l, u), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Np(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === ke ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function xp(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = Hi(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function Op(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), ts(n, [
    Xi(e, t, "full"),
    es(e, t, "full")
  ]), n;
}
function Mp(e, t, n) {
  const r = n.parentElement === e ? n : Nt(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function Fp(e) {
  const t = rs(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(qi, "true"), n;
}
function rs(e) {
  return e.querySelector(`[${qi}="true"]`);
}
function Bp(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  r.textContent = "Efeito", n.append(r);
  const a = document.createElement("div");
  a.classList.add(`${i}__effect-info-body`);
  const o = document.createElement("span");
  o.classList.add(`${i}__effect-info-label`), o.textContent = t.label;
  const s = document.createElement("span");
  s.classList.add(`${i}__effect-info-hint`), s.textContent = "Aplicação por alvo", a.append(o, s), e.append(n, a);
}
function Up(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Ea(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Gp(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function qp(e) {
  return typeof e == "string" && e.length > 0;
}
function zp(e) {
  return e === "normal" || e === "half";
}
function Ca(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function as(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Ia = "data-paranormal-toolkit-card-layout-refresh-bound";
function jp(e) {
  const t = e.rollCard.querySelector(Dt);
  t && t.getAttribute(Ia) !== "true" && (t.setAttribute(Ia, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const _e = "data-paranormal-toolkit-prompt-id", Vp = "apply-damage", Hp = "data-paranormal-toolkit-multi-target-damage-info";
function Wp(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(Hp) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function Kp(e) {
  const t = Qp(e);
  return t.find((n) => n.getAttribute(Ef) === Vp) ?? t.find((n) => xi(n) === "aplicar danos") ?? null;
}
function Yp(e) {
  const t = os(e), n = Sa(t);
  return n || Sa(Zp(e));
}
function Sa(e) {
  return e.find((t) => {
    const n = xi(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function Qp(e) {
  const t = os(e);
  return t.length > 0 ? t : Rr(e);
}
function os(e) {
  const t = eg(e);
  return t ? Rr(e).filter((n) => Jp(n, t)) : [];
}
function Zp(e) {
  const t = is(e);
  if (!t) return [];
  const n = Xp(e, t);
  return Rr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => ss(e, r)).filter((r) => !n || tg(r, n));
}
function Rr(e) {
  const t = is(e);
  return t ? Array.from(t.querySelectorAll(kf)) : [];
}
function is(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function Xp(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && ss(e, n)) ?? null;
}
function Jp(e, t) {
  return e.getAttribute(_e) === t ? !0 : Array.from(e.querySelectorAll(`[${_e}]`)).some((n) => n.getAttribute(_e) === t);
}
function eg(e) {
  return e.getAttribute(_e) ?? e.querySelector(`[${_e}]`)?.getAttribute(_e) ?? null;
}
function ss(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function tg(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function ng(e) {
  const t = ls(), n = Ei(e.rollCard).state, r = fr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel }
  }), a = r.policy.effectActionState, o = Ke(a), s = Ti(a);
  return e.applied ? Pe({
    kind: "applied",
    visible: !0,
    enabled: !1,
    applied: !0,
    waitingForResistance: o,
    resisted: s,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: a,
    resistanceState: n
  }) : r.policy.canShowApplyEffect ? Pe(o ? {
    kind: "waiting-resistance",
    visible: !0,
    enabled: !1,
    applied: !1,
    waitingForResistance: !0,
    resisted: !1,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: a,
    resistanceState: n
  } : s ? {
    kind: "resisted",
    visible: !0,
    enabled: !1,
    applied: !1,
    waitingForResistance: !1,
    resisted: !0,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: a,
    resistanceState: n
  } : {
    kind: "applicable",
    visible: !0,
    enabled: !0,
    applied: !1,
    waitingForResistance: !1,
    resisted: !1,
    applicable: !0,
    effectLabel: e.effectLabel,
    actionState: a,
    resistanceState: n
  }) : Pe({
    kind: "hidden",
    visible: !1,
    enabled: !1,
    applied: !1,
    waitingForResistance: o,
    resisted: s,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: a,
    resistanceState: n
  });
}
function Pe(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function rg(e) {
  const { rollCard: t } = e, n = ig(), r = ls(), a = Ei(t).state, o = fr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Ke(s), u = og(e);
  if (u)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: w(
        "normal",
        u === "normal",
        !1,
        u === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: w(
        "half",
        u === "half",
        !1,
        u === "half",
        !!e.halfButtonSkipped
      ),
      summary: ag(a)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: w("normal", !1, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: w("half", !1, !1, !1, !!e.halfButtonSkipped, s.label),
      summary: {
        state: l ? "pending" : "manual",
        message: l ? s.reason : null
      }
    };
  if (l)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: w("normal", !0, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: w("half", !1, !1, !1, !!e.halfButtonSkipped),
      summary: {
        state: "pending",
        message: s.reason ?? "Role resistência para aplicar dano."
      }
    };
  if (n !== "assisted")
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: w("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: w("half", !0, !0, !1, !!e.halfButtonSkipped, s.label),
      summary: {
        state: l ? "pending" : "manual",
        message: l ? s.reason ?? "Role resistência para aplicar dano." : null
      }
    };
  if (a.kind === "none")
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: w("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: w("half", !0, !0, !1, !!e.halfButtonSkipped),
      summary: {
        state: "manual",
        message: "Sem DT confiável: escolha manualmente."
      }
    };
  if (a.kind === "pending")
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: w("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: w("half", !1, !1, !1, !!e.halfButtonSkipped),
      summary: {
        state: "pending",
        message: l ? s.reason ?? "Role resistência para aplicar dano." : null
      }
    };
  const d = a.kind === "succeeded";
  return {
    mode: n,
    canShowApplyDamage: !0,
    waitingForResistance: l,
    resistanceState: a,
    actionState: s,
    normalButton: w("normal", !d, !d, !1, !!e.normalButtonSkipped),
    halfButton: w("half", d, d, !1, !!e.halfButtonSkipped),
    summary: {
      state: d ? "resisted" : "failed",
      message: d ? `Resistiu: ${a.total} vs DT ${a.difficulty}.` : `Falhou: ${a.total} vs DT ${a.difficulty}.`
    }
  };
}
function ag(e) {
  return e.kind === "succeeded" ? {
    state: "resisted",
    message: `Resistiu: ${e.total} vs DT ${e.difficulty}.`
  } : e.kind === "failed" ? {
    state: "failed",
    message: `Falhou: ${e.total} vs DT ${e.difficulty}.`
  } : {
    state: "manual",
    message: null
  };
}
function w(e, t, n, r, a, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: r,
    skipped: a,
    waitingLabel: o
  };
}
function og(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function ig() {
  try {
    return Dc();
  } catch {
    return "assisted";
  }
}
function ls() {
  try {
    return or();
  } catch {
    return "strict";
  }
}
const sg = "data-paranormal-toolkit-damage-resolution-state", La = "data-paranormal-toolkit-damage-icon-enhanced", wr = "data-paranormal-toolkit-damage-original-label", lg = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, cs = "Outra opção escolhida";
function cg(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Sf(t, "Aplicar dano"), ug(e, t);
}
function ug(e, t) {
  const n = Array.from(t.querySelectorAll(gt)), r = va(n, "normal"), a = va(n, "half");
  if (!r || !a) {
    dg(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  Pa(r, "normal"), Pa(a, "half");
  const o = rg({
    rollCard: e,
    normalButtonApplied: ht(r),
    halfButtonApplied: ht(a),
    normalButtonSkipped: Mn(r),
    halfButtonSkipped: Mn(a)
  });
  if (!o.canShowApplyDamage) {
    Na(r), Na(a), xa(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), Da(r, o.normalButton), Da(a, o.halfButton), xa(t, o.summary.state, o.summary.message);
}
function Da(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    fg(e, t.visible), pg(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function dg(e) {
  for (const t of e)
    Mn(t) && t.remove();
}
function ht(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(cs);
}
function Mn(e) {
  return e.textContent?.includes(cs) ?? !1;
}
function va(e, t) {
  const n = lg[t];
  return e.find((r) => n.test(mg(r))) ?? null;
}
function mg(e) {
  return [
    e.getAttribute(wr),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function Pa(e, t) {
  if (e.getAttribute(La) === "true") return;
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
  ), e.setAttribute(La, "true"), e.setAttribute(wr, n), e.setAttribute("aria-label", n), e.replaceChildren(r, ce(n));
}
function Na(e) {
  ht(e) || e.remove();
}
function fg(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function pg(e, t, n, r = "Role resistência") {
  if (!ht(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(ce(r));
      return;
    }
    e.removeAttribute("aria-disabled"), gg(e, n);
  }
}
function gg(e, t) {
  const n = e.getAttribute(wr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(hg(t), ce(n)));
}
function hg(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function xa(e, t, n) {
  e.setAttribute(sg, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(br)?.after(a);
}
const ze = "data-paranormal-toolkit-effect-icon-enhanced", $e = "data-paranormal-toolkit-effect-action-compacted", Ot = "data-paranormal-toolkit-effect-resistance-gate", kr = "data-paranormal-toolkit-effect-section", Er = "data-paranormal-toolkit-effect-label";
function bg(e) {
  return e.querySelector(`[${kr}="true"]`);
}
function _g(e) {
  const t = Ag(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? Tg(), r = Lg(n, e.sourceActions, t);
  return r && n.setAttribute(Er, r), $g(n, t, r), Ig(e.rollCard, n, e.after ?? e.fallbackAfter), Sg(e.sourceActions, n), n;
}
function yg(e, t) {
  const n = t.querySelector(gt);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = ms(t, n, r), o = ng({
    rollCard: e,
    effectLabel: a,
    applied: Cr(n, r)
  });
  if (o.applied) {
    vg(n);
    return;
  }
  if (!o.visible) {
    Pg(n);
    return;
  }
  if (o.waitingForResistance) {
    Ng(n, o.actionLabel);
    return;
  }
  if (o.resisted) {
    xg(n, o.compactLabel);
    return;
  }
  Og(n), ds(n, o.displayLabel);
}
function Ag(e) {
  return e.sourceActions?.querySelector(gt) ?? e.existingSection?.querySelector(gt) ?? null;
}
function Tg() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(kr, "true"), e;
}
function $g(e, t, n) {
  e.setAttribute(kr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = Rg(e), a = wg(r);
  a.textContent = "Efeito";
  const o = kg(e, r), s = Eg(o);
  s.textContent = Mg(n ?? ms(e, t, t.textContent?.trim() ?? ""));
  const l = Cg(o);
  t.parentElement !== l && l.append(t);
  const u = t.textContent?.trim() ?? "";
  !Cr(t, u) && !Dg(t, u) && ds(t, n ?? u);
}
function Rg(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function wg(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function kg(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function Eg(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function Cg(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function Ig(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Sg(e, t) {
  !e || e === t || e.remove();
}
function Lg(e, t, n) {
  const r = e.getAttribute(Er);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || us(n, n.textContent?.trim() ?? "");
}
function us(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && W(n) !== "efeito aplicado") return n;
  const r = Cm(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && W(a) !== "aplicado" ? a : null;
}
function Cr(e, t) {
  return e.classList.contains(Cf) || W(t).includes("aplicado");
}
function Dg(e, t) {
  const n = e.getAttribute(Ot);
  if (n === "pending" || n === "resisted") return !0;
  const r = Im(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function ds(e, t) {
  e.getAttribute($e) === "true" && e.getAttribute(ze) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute($e, "true"), e.setAttribute(ze, "true"), e.setAttribute(If, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    _r("✦", `${i}__button-icon--effect`),
    ce("Aplicar")
  ));
}
function vg(e) {
  e.getAttribute($e) === "true" && W(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute($e, "true"), e.setAttribute(ze, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    _r("✓", `${i}__button-icon--effect-applied`),
    ce("Aplicado")
  ));
}
function ms(e, t, n) {
  const r = e.getAttribute(Er) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : us(t, n) ?? n;
}
function Pg(e) {
  Cr(e, e.textContent?.trim() ?? "") || e.remove();
}
function Ng(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute($e), e.removeAttribute(ze), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Ot, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(ce(t));
}
function xg(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute($e), e.removeAttribute(ze), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Ot, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    _r("✓", `${i}__button-icon--effect-resisted`),
    ce(t)
  );
}
function Og(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Ot), e.removeAttribute("aria-disabled");
}
function Mg(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const Fg = "data-paranormal-toolkit-card-layout-normalized";
function Bg(e) {
  const t = Ug(e.rollCard), n = Gg(t);
  return jp({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function Ug(e) {
  return {
    rollCard: e,
    damageSection: Wp(e),
    resistance: e.querySelector(sr),
    damageActions: Kp(e),
    effectActionSource: Yp(e),
    effectSection: bg(e)
  };
}
function Gg(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(Fg, "true"), t.classList.add(`${i}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && a && (a.parentElement !== n && n.append(a), cg(t, a));
  const l = _g({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: n,
    fallbackAfter: Nt(t, "Conjuração")
  });
  return l && yg(t, l), l;
}
const fs = [0, 80, 180, 400, 900, 1600, 3e3], Oa = /* @__PURE__ */ new WeakSet();
function qg(e) {
  ps(e), zg(e);
}
function ps(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    gs(t);
}
function zg(e) {
  if (!Oa.has(e)) {
    Oa.add(e);
    for (const t of fs)
      globalThis.setTimeout(() => {
        ps(e);
      }, t);
  }
}
function gs(e) {
  const t = Bg({
    rollCard: e,
    refreshDelaysMs: fs,
    onRefresh: () => gs(e)
  });
  Jf({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const jg = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function Vg(e) {
  for (const t of Array.from(e.querySelectorAll(sr)))
    Hg(t);
  qg(e);
}
function Hg(e) {
  const t = e.querySelector(gu), n = e.querySelector(ri), r = e.querySelector(Dt), a = e.querySelector(ai);
  if (!r || !t && !n && !a) return;
  const o = Wg(e, r);
  t && t.parentElement !== o && o.append(t), n && n.parentElement !== o && o.append(n), a && (a.parentElement !== e && !r.contains(a) && e.append(a), Kg(a)), r.parentElement !== e && e.append(r);
}
function Wg(e, t) {
  const n = e.querySelector(`.${sa}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(sa), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function Kg(e) {
  const t = Yg(e.textContent ?? "");
  t && (e.setAttribute(jg, "true"), e.replaceChildren(Xg(t)));
}
function Yg(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: u } = Qg(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: u
  } : null;
}
function Qg(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Zg(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Zg(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Xg(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Jg(e);
  return r && t.append(r), t;
}
function Jg(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of eh(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function eh(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ma(e, "highest") : n.includes("kl") ? Ma(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ma(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function Fa(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Ir() {
  const e = globalThis.game;
  return Mt(e) ? e : null;
}
function P(e, t) {
  const n = th(e, t);
  return dt(n);
}
function th(e, t) {
  return t.split(".").reduce((n, r) => Mt(n) ? n[r] : null, e);
}
function nh(e, t) {
  const n = e.indexOf(":");
  return n < 0 || je(e.slice(0, n)) !== je(t) ? null : Ee(e.slice(n + 1));
}
function dt(e) {
  return typeof e == "string" ? Ee(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Mt(e) {
  return !!e && typeof e == "object";
}
function rh(e) {
  return typeof e == "string";
}
function Ft(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Ee(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function je(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Fn(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function K(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function hs(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function ah(e) {
  for (const t of Array.from(e.querySelectorAll(mu))) {
    const n = dh(t);
    oh(t), n && (ih(t, n), sh(t, n));
  }
}
function oh(e) {
  for (const t of Array.from(e.querySelectorAll(fu)))
    t.remove();
}
function ih(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(ni) ?? null, a = r?.querySelector(du) ?? null, o = r ?? e, s = o.querySelector(_u);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = Ih(t.elementTone), l.textContent = Ch(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function sh(e, t) {
  const n = lh(e);
  ch(e, n);
  const r = uh(t);
  if (r.length === 0) return;
  const a = document.createElement("div");
  a.classList.add(`${i}__ritual-metadata`);
  for (const s of r) {
    const l = document.createElement("span");
    l.classList.add(`${i}__ritual-metadata-chip`), l.textContent = s, a.append(l);
  }
  if (n) {
    const s = n.querySelector(`.${i}__summary`);
    if (s?.parentElement === n) {
      s.insertAdjacentElement("afterend", a);
      return;
    }
    n.append(a);
    return;
  }
  const o = e.querySelector(oi);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function lh(e) {
  return e.closest(`.${i}`)?.querySelector(ni) ?? null;
}
function ch(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(yu)))
      a.remove();
}
function uh(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Fn(e.target)}` : null,
    e.duration ? `Duração: ${Fn(e.duration)}` : null,
    e.resistance ? `Resistência: ${hs(e.resistance)}` : null
  ].filter(Ft);
}
function dh(e) {
  const t = mh(e), n = _h(e), a = (t ? bh(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = Sr(P(a, "element")), l = G("op.elementChoices", s) ?? Ba(te(o, "Elemento")) ?? Ba(n.damageType), u = s ?? Sh(l), d = P(a, "circle") ?? te(o, "Círculo"), m = Th(a) ?? te(o, "Alvo"), b = kh(a, "duration", "op.durationChoices") ?? te(o, "Duração"), T = yh(e) ?? Rh(a) ?? te(o, "Resistência"), $ = Ah(o) ?? n.cost, g = {
    elementLabel: l,
    elementTone: u,
    circle: d,
    cost: $,
    target: m,
    duration: b,
    resistance: T
  };
  return Eh(g) ? g : null;
}
function mh(e) {
  const t = fh(e);
  if (!t) return null;
  const n = t.getFlag?.(c, Lt), r = gh(n);
  if (r.length === 0) return null;
  const a = ph(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function fh(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Ir()?.messages?.get?.(n) ?? null : null;
}
function ph(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${ia}]`))) {
    const a = r.getAttribute(ia)?.trim();
    a && n.add(a);
  }
  return n;
}
function gh(e) {
  if (!Mt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(hh).filter((n) => n !== null) : [];
}
function hh(e) {
  return Mt(e) ? {
    pendingId: dt(e.pendingId),
    actorId: dt(e.actorId),
    itemId: dt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(rh) : []
  } : null;
}
function bh(e) {
  if (!e.itemId) return null;
  const t = Ir(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function _h(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(pu))) {
    const a = Ee(r.textContent);
    if (!a) continue;
    const o = nh(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function yh(e) {
  const t = Ee(e.querySelector(ri)?.textContent);
  return t ? hs(t) : null;
}
function te(e, t) {
  const n = je(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || je(r.slice(0, a)) !== n))
      return Ee(r.slice(a + 1));
  }
  return null;
}
function Ah(e) {
  const t = te(e, "Custo") ?? te(e, "PE");
  return t || (e.map(Ee).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Th(e) {
  const t = P(e, "target");
  if (!t) return null;
  if (t === "area")
    return $h(e) ?? G("op.targetChoices", t) ?? "Área";
  const n = G("op.targetChoices", t) ?? K(t);
  return [t === "people" || t === "creatures" ? P(e, "targetQtd") : null, n].filter(Ft).join(" ");
}
function $h(e) {
  const t = P(e, "area.name"), n = P(e, "area.size"), r = P(e, "area.type"), a = t ? G("op.areaChoices", t) ?? K(t) : null, o = r ? G("op.areaTypeChoices", r) ?? K(r) : null;
  return a ? n ? o ? `${a} ${n}m ${Fn(o)}` : `${a} ${n}m` : a : null;
}
function Rh(e) {
  const t = P(e, "skillResis"), n = P(e, "resistance");
  if (!t || !n) return null;
  const r = G("op.skill", t) ?? K(t), a = wh(n);
  return [r, a].filter(Ft).join(" ");
}
function wh(e) {
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
      return G("op.resistanceChoices", e) ?? K(e);
  }
}
function kh(e, t, n) {
  const r = P(e, t);
  return r ? G(n, r) ?? K(r) : null;
}
function Eh(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Ch(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Ih(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Ft).join(" ");
}
function Sr(e) {
  const t = je(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Ba(e) {
  const t = Sr(e);
  return t ? G("op.elementChoices", t) ?? K(t) : e ? K(e) : null;
}
function Sh(e) {
  return Sr(e);
}
function G(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Ir()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Ua = "data-paranormal-toolkit-dice-toggle-enhanced";
function Lh(e) {
  for (const t of Array.from(e.querySelectorAll(ii)))
    bs(t);
}
function Dh(e) {
  const t = ys(e.target);
  if (!t) return;
  const n = Lr(t);
  n && (e.preventDefault(), _s(n, t));
}
function vh(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = ys(e.target);
  if (!t) return;
  const n = Lr(t);
  n && (e.preventDefault(), _s(n, t));
}
function bs(e) {
  const t = e.querySelector(vt);
  if (!t) return;
  const n = e.querySelector(cr);
  if (n && n.getAttribute(Ua) !== "true" && (n.setAttribute(Ua, "true"), n.classList.add(ur), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function _s(e, t) {
  const n = e.querySelector(vt);
  if (!n) return;
  const r = !e.classList.contains(lr);
  Ph(e, t, n, r);
}
function Ph(e, t, n, r) {
  e.classList.toggle(lr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function ys(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(cr);
  if (!t) return null;
  const n = Lr(t);
  return n ? (bs(n), t.classList.contains(ur) ? t : null) : null;
}
function Lr(e) {
  const t = e.closest(ii);
  return t && t.querySelector(vt) ? t : null;
}
const Ga = `${c}-workflow-dice-toggle-styles`;
function Nh() {
  if (document.getElementById(Ga)) return;
  const e = document.createElement("style");
  e.id = Ga, e.textContent = `
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

/* 0.23.0 — Multi-target ritual card visual model */
.${i}__roll-card--multi-target
  > .${i}__workflow-section--multi-target-source,
.${i}__roll-card--multi-target
  > .${i}__workflow-section--multi-target-effect-source {
  display: none !important;
}

.${i}__workflow-section--targets {
  border-color: rgba(143, 54, 62, 0.24) !important;
  border-left: 3px solid rgba(133, 49, 59, 0.68) !important;
  background: linear-gradient(180deg, rgba(255, 248, 245, 0.84), rgba(250, 239, 235, 0.52)) !important;
}

.${i}__targets-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 0.5rem !important;
}

.${i}__workflow-section--targets
  .${i}__workflow-section-header strong {
  color: rgba(117, 48, 58, 0.94) !important;
}

.${i}__targets-status {
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

.${i}__targets-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.3rem !important;
  margin-top: 0.42rem !important;
}

.${i}__target-row {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.34rem !important;
  border: 1px solid rgba(143, 54, 62, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.38rem !important;
  background: rgba(255, 255, 255, 0.34) !important;
  cursor: pointer !important;
}

.${i}__target-row:focus-visible {
  outline: 2px solid rgba(143, 54, 62, 0.34) !important;
  outline-offset: 2px !important;
}

.${i}__target-summary {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.32rem !important;
  min-width: 0 !important;
}

.${i}__target-summary-main {
  display: grid !important;
  grid-template-columns: auto minmax(0, 1fr) auto auto !important;
  align-items: center !important;
  gap: 0.34rem !important;
  min-width: 0 !important;
}

.${i}__target-summary-actions {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
  align-items: center !important;
  gap: 0.34rem !important;
  min-width: 0 !important;
}

.${i}__target-row[aria-expanded="true"] .${i}__target-summary-actions {
  display: none !important;
}

.${i}__target-avatar {
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

.${i}__target-name {
  min-width: 0 !important;
  color: rgba(36, 27, 24, 0.94) !important;
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1.12 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${i}__target-resistance-button,
.${i}__target-action {
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

.${i}__target-resistance-button {
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

.${i}__target-resistance-button i {
  font-size: 0.88rem !important;
}

.${i}__target-resistance-fallback {
  display: none !important;
}

.${i}__target-action {
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

.${i}__target-action:disabled {
  opacity: 0.74 !important;
}

.${i}__target-summary-actions .${i}__target-action {
  width: 100% !important;
}

.${i}__target-action-icon {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

.${i}__target-action-label {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${i}__target-toggle {
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

.${i}__target-details {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  gap: 0.36rem !important;
  border: 1px solid rgba(151, 111, 45, 0.22) !important;
  border-radius: 8px !important;
  padding: 0.48rem !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.76), rgba(255, 245, 219, 0.42)) !important;
}

.${i}__target-details[hidden] {
  display: none !important;
}

.${i}__target-resistance-details {
  grid-column: 1 / -1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0.12rem !important;
  min-width: 0 !important;
}

.${i}__target-resistance-details strong {
  color: rgba(107, 78, 35, 0.96) !important;
  font-size: 0.74rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.075em !important;
  line-height: 1.08 !important;
  text-transform: uppercase !important;
}

.${i}__target-resistance-details span {
  color: rgba(36, 27, 24, 0.84) !important;
  font-size: 0.78rem !important;
  font-weight: 700 !important;
  line-height: 1.22 !important;
}

.${i}__target-formula {
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

.${i}__target-formula span {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${i}__target-formula i {
  flex: 0 0 auto !important;
  font-size: 0.62rem !important;
  opacity: 0.68 !important;
}

.${i}__target-details-actions {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 0.32rem !important;
  grid-column: 1 / -1 !important;
}

.${i}__target-details-actions .${i}__target-action {
  justify-content: center !important;
  width: 100% !important;
  min-height: 2rem !important;
  padding-inline: 0.5rem !important;
}

.${i}__target-details-actions .${i}__target-action-label {
  overflow: visible !important;
  text-overflow: clip !important;
}

.${i}__workflow-section--effect-info {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  align-items: center !important;
  gap: 0.14rem 0.5rem !important;
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${i}__workflow-section--effect-info
  > .${i}__workflow-section-header strong {
  color: rgba(107, 78, 35, 0.95) !important;
}

.${i}__effect-info-body {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.12rem !important;
  min-width: 0 !important;
}

.${i}__effect-info-label {
  color: rgba(36, 27, 24, 0.9) !important;
  font-size: 0.81rem !important;
  font-weight: 850 !important;
  line-height: 1.18 !important;
  overflow-wrap: anywhere !important;
}

.${i}__effect-info-hint {
  color: rgba(36, 27, 24, 0.68) !important;
  font-size: 0.74rem !important;
  font-weight: 700 !important;
  line-height: 1.1 !important;
}

`, document.head.append(e);
}
const xh = [0, 100, 500, 1500, 3e3];
let qa = !1, Jt = null;
function Oh() {
  if (!qa) {
    qa = !0, Nh(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Fe(Fa(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Fe(Fa(t));
    }), Hooks.once("ready", () => {
      Fe(document), Mh();
    }), document.addEventListener("click", Dh), document.addEventListener("keydown", vh);
    for (const e of xh)
      globalThis.setTimeout(() => Fe(document), e);
  }
}
function Mh() {
  Jt || !document.body || (Jt = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Fe(n);
  }), Jt.observe(document.body, { childList: !0, subtree: !0 }));
}
function Fe(e) {
  e && (Mu(e), ah(e), Vg(e), Lh(e), Su(e));
}
function Fh() {
  Oh();
}
const Bh = "data-paranormal-toolkit-action-section", Uh = "ritual-log", Gh = ".paranormal-toolkit-item-use-prompt__actions", qh = ".paranormal-toolkit-item-use-prompt__actions-title", zh = [0, 100, 500, 1500];
let za = !1;
function jh() {
  if (za) return;
  const e = (t, n) => {
    ja(Kh(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), ja(document), za = !0;
}
function ja(e) {
  for (const t of zh)
    globalThis.setTimeout(() => Vh(e), t);
}
function Vh(e) {
  Hh(e), Wh(e);
}
function Hh(e) {
  for (const t of e.querySelectorAll(
    `[${Bh}="${Uh}"]`
  ))
    t.remove();
}
function Wh(e) {
  for (const t of e.querySelectorAll(Gh)) {
    if (Va(t.querySelector(qh)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => Va(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function Kh(e) {
  if (e instanceof HTMLElement || Yh(e))
    return e;
  if (Qh(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Yh(e) {
  return e instanceof HTMLElement;
}
function Qh(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Va(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Be = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, As = {
  PV: "system.attributes.hp"
}, Bn = {
  PV: [Be.PV, As.PV],
  SAN: [Be.SAN],
  PE: [Be.PE],
  PD: [Be.PD]
}, Un = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Zh {
  getResource(t, n) {
    const r = Ha(t, n);
    if (!r.ok)
      return p(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), u = foundry.utils.getProperty(t, s), d = Ka(t, n, o, l, "valor atual");
    if (d) return p(d);
    const m = Ka(t, n, s, u, "valor máximo");
    return m ? p(m) : _({
      value: l,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const a = Ha(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function Ha(e, t) {
  const n = Xh(e.type, t);
  if (n && Wa(e, n))
    return _(n);
  const r = Bn[t].find(
    (a) => Wa(e, a)
  );
  return r ? _(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Jh(e, t),
    path: Bn[t].join(" | ")
  });
}
function Xh(e, t) {
  return e === "threat" ? As[t] ?? null : e === "agent" ? Be[t] : null;
}
function Wa(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Jh(e, t) {
  const n = e.type ?? "unknown", r = Bn[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Ka(e, t, n, r, a) {
  return r == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${a} de ${t} não encontrado: ${n}.`,
    path: n,
    value: r
  } : typeof r != "number" || !Number.isFinite(r) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${a} de ${t} em ${n}.`,
    path: n,
    value: r
  } : null;
}
class eb {
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
      const s = Un.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = tb(a);
    return o ? _(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Un.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function tb(e) {
  if (Ya(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Ya(n))
      return n;
  }
  return null;
}
function Ya(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const nb = "dice-so-nice";
async function Ts(e) {
  if (!rb() || !ab()) return;
  const t = ob();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function rb() {
  try {
    return uu().enabled;
  } catch {
    return !1;
  }
}
function ab() {
  return game.modules?.get?.(nb)?.active === !0;
}
function ob() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Qa = "occultism";
class $s {
  getDifficulty(t) {
    return ib(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await lb(t, Qa);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await Ts(r);
    const a = db(r);
    return {
      skill: Qa,
      skillLabel: "Ocultismo",
      roll: r,
      formula: ub(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: mb(r)
    };
  }
}
function ib(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function sb(e) {
  return new $s().rollCastingCheck(e);
}
async function lb(e, t) {
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
  return cb(r);
}
function cb(e) {
  return Za(e) ? e : Array.isArray(e) ? e.find(Za) ?? null : null;
}
function Za(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function ub(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function db(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function mb(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(fb);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function fb(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const pb = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class gb {
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
    const r = n.value, a = hb(t.ritual, r);
    return a.ok ? a.value ? _(a.value) : _({
      resource: "PE",
      amount: pb[r],
      source: "default-by-circle",
      circle: r
    }) : p(a.error);
  }
}
function hb(e, t) {
  const n = e.getFlag(c, "ritual.cost");
  return n == null ? { ok: !0, value: null } : bb(n) ? {
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
function bb(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const en = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function _b(e) {
  if (!wb(e.item)) return null;
  const t = Gn(e.actor) ? e.actor : yb(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Tb(e.token) ?? Ab(t),
    targets: ar(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function yb(e) {
  const t = e;
  return Gn(t.actor) ? t.actor : Gn(e.parent) ? e.parent : null;
}
function Ab(e) {
  const t = $b(e) ?? Rb(e);
  return t ? Rs(t) : null;
}
function Tb(e) {
  return qn(e) ? Rs(e) : null;
}
function $b(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return qn(n) ? n : (t.getActiveTokens?.() ?? []).find(qn) ?? null;
}
function Rb(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Rs(e) {
  const t = e.actor ?? null;
  return {
    tokenId: tn(e.id),
    actorId: tn(t?.id),
    sceneId: tn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function wb(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Gn(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function qn(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function tn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class kb {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(en.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${en.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = _b(Eb(t));
    if (!n) {
      f.warn(`${en.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Eb(e) {
  return e && typeof e == "object" ? e : {};
}
class Cb {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return nn("missing-item-patch");
    if (t.type !== "ritual") return nn("unsupported-item-type");
    const a = Ib(r);
    return Object.keys(a).length === 0 ? nn("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function Ib(e) {
  const t = {};
  E(t, "name", e.name), E(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (E(t, "system.circle", n.circle), E(t, "system.element", n.element), E(t, "system.target", n.target), E(t, "system.targetQtd", n.targetQuantity), E(t, "system.execution", n.execution), E(t, "system.range", n.range), E(t, "system.duration", n.duration), E(t, "system.skillResis", n.resistanceSkill), E(t, "system.resistance", n.resistance), E(t, "system.studentForm", n.studentForm), E(t, "system.trueForm", n.trueForm)), t;
}
function E(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function nn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Sb {
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
    return this.getNumber(t, Un.ritual.dt, 0);
  }
  getResources(t) {
    const n = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, r = [];
    for (const a of ["PV", "SAN", "PE", "PD"]) {
      const o = this.resourceAdapter.getResource(t, a);
      o.ok ? n[a] = o.value : r.push(o.error);
    }
    return { values: n, errors: r };
  }
  getNumber(t, n, r) {
    const a = foundry.utils.getProperty(t, n);
    return typeof a == "number" && Number.isFinite(a) ? a : r;
  }
}
class Lb {
  async applyPreset(t, n, r = {}) {
    const a = {
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
    return await this.writeAutomationFlag(t, a), a;
  }
  async applyManualDefinition(t, n, r = n.label) {
    const a = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: r,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: n
    };
    return await this.writeAutomationFlag(t, a), a;
  }
  async clear(t) {
    await t.unsetFlag(c, "automation");
  }
  async writeAutomationFlag(t, n) {
    await this.clear(t), await t.setFlag(c, "automation", n);
  }
}
class Db {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = vb(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, rn(t)), _(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const a = this.register(r);
      if (!a.ok)
        return a;
      n.push(a.value);
    }
    return _(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? rn(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? _(n) : p({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(rn);
  }
  findForItem(t) {
    return this.list().map((n) => Pb(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function vb(e) {
  return !an(e.id) || !an(e.version) || !an(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : _(e);
}
function Pb(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = Nb(a, t);
    if (!o.matches)
      return null;
    r += o.score, n.push(o.reason);
  }
  return {
    preset: e,
    score: r,
    reasons: n
  };
}
function Nb(e, t) {
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
      const n = Xa(t.name), r = e.names.map(Xa).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = xb(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Xa(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function xb(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function rn(e) {
  return structuredClone(e);
}
function an(e) {
  return typeof e == "string" && e.length > 0;
}
function bt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : _(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = Bt(e.amountFrom);
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
    const a = Math.trunc(r.total);
    return !Number.isInteger(a) || a <= 0 ? p({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : _(a);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Bt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function Ob(e, t, n) {
  if (!Ja(e.id) || !Ja(e.formula))
    return p({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(e.formula), a = await Promise.resolve(r.evaluate()), o = a.total;
    if (typeof o != "number" || !Number.isFinite(o))
      return p({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await Ts(a);
    const l = {
      ...n.rollRequests[e.id] ?? ws(e, t),
      total: o,
      roll: a
    };
    return n.rolls[e.id] = l, _(l);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function ws(e, t) {
  const n = e.intent ?? Mb(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function Mb(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Ja(e) {
  return typeof e == "string" && e.length > 0;
}
async function _t(e, t, n, r, a) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? ot(t, n, r, a) : e.spend(t, n, a);
    case "damage":
      return n !== "PV" && n !== "SAN" ? ot(t, n, r, a) : e.damage(t, n, a);
    case "heal":
      return n !== "PV" ? ot(t, n, r, a) : e.heal(t, n, a);
    case "recover":
      return n !== "SAN" ? ot(t, n, r, a) : e.recover(t, n, a);
  }
}
function ot(e, t, n, r) {
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
function Fb(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = Bb(t, n, r, a);
    n.damageInstances.push(s), o.emit("afterDamageResolution", n, {
      stepIndex: a,
      step: t,
      damage: s,
      resourceTransaction: r,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), o.emit("afterApplyDamage", n, {
      stepIndex: a,
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
    const s = Ub(t, n, r, a);
    n.healingInstances.push(s), o.emit("afterApplyHealing", n, {
      stepIndex: a,
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
function Bb(e, t, n, r) {
  const a = Bt(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: ks(t.id, "damage", r, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: a ?? void 0,
    damageType: o?.damageType,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Ub(e, t, n, r) {
  const a = Bt(e.amountFrom);
  return {
    id: ks(t.id, "healing", r, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: a ?? void 0,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function ks(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Gb(e, t, n) {
  const r = Bt(e.amountFrom), a = r ? t.rolls[r] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    amountFrom: e.amountFrom,
    rollId: r,
    rollIntent: a?.intent,
    damageType: a?.damageType
  };
}
function qb(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), Es("before", e), eo("before", e), eo("resolve", e);
}
function zb(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), Es("apply", e);
}
function jb(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function Es(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = Vb(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function eo(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function Vb(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Hb(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), _(void 0);
  } catch (r) {
    return p({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function Wb(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Kb(e, t);
    case "spendRitualCost":
      return Yb(e, t);
  }
}
async function Kb(e, t) {
  const { context: n, resources: r } = e, a = bt(t, n);
  return a.ok ? Cs(await r.spend(n.sourceActor, t.resource, a.value), n) : p(a.error);
}
async function Yb(e, t) {
  const { context: n, resources: r, ritualCosts: a } = e, o = a.getCost({
    actor: n.sourceActor,
    ritual: n.item
  });
  if (!o.ok)
    return p({
      reason: "ritual-cost-failed",
      message: o.error.message,
      cause: o.error
    });
  const s = o.value;
  return n.ritualCosts.push({
    ...s,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), Cs(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Cs(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), _(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Qb(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = Zb(t);
  for (const u of s.before)
    a.emit(u, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const u of s.after)
    a.emit(u, n, { stepIndex: r, step: t });
  return l;
}
function Zb(e) {
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
class Xb {
  constructor(t, n, r, a) {
    this.resources = t, this.ritualCosts = n, this.messages = r, this.lifecycle = a;
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
    for (const [r, a] of t.steps.entries()) {
      const o = await this.runStep(a, n, r);
      if (!o.ok)
        return o;
    }
    return _({ definition: t, context: n });
  }
  async runStep(t, n, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, r);
      default:
        return Qb({
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
    const a = await Wb({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? _(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = ws(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), _(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await Ob(t, r, n);
    return a.ok ? _(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = bt(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = Gb(t, n, a.value);
    qb({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), zb({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
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
      const u = await _t(this.resources, l, t.resource, t.operation, a.value), d = this.handleResourceOperationResult(u, n, r, t);
      if (!d.ok)
        return d;
      Fb({
        step: t,
        context: n,
        transaction: d.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return jb({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), _(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = bt(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = this.resolveActors(t.actor, n);
    if (o.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const s of o) {
      const l = await _t(this.resources, s, t.resource, t.operation, a.value), u = this.handleResourceOperationResult(l, n, r, t);
      if (!u.ok)
        return u;
    }
    return _(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await Hb(this.messages, t, n);
    return a.ok ? _(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, a) {
    return t.ok ? (n.resourceTransactions.push(t.value), _(t.value)) : p({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: a,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, a, o, s) {
    const l = Jb(t, n.intent);
    l && this.lifecycle.emit(l, r, {
      stepIndex: a,
      step: o,
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
function Jb(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class e_ {
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
  async execute(t, n, r, a) {
    if (!Number.isInteger(a) || a <= 0)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: a
      });
    const o = this.adapter.getResource(t, n);
    if (!o.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: o.error.reason,
        message: o.error.message,
        requestedAmount: a,
        path: o.error.path,
        value: o.error.value
      });
    const s = o.value, l = this.calculate(r, s, a);
    if (!l.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: l.error.reason,
        message: l.error.message,
        requestedAmount: a,
        current: s.value,
        required: a
      });
    const { afterValue: u, appliedAmount: d } = l.value, m = {
      value: u,
      max: s.max
    };
    try {
      u !== s.value && await this.adapter.updateResourceValue(t, n, u);
    } catch (b) {
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "update-failed",
        message: `Falha ao atualizar ${n} no ator.`,
        requestedAmount: a,
        current: s.value,
        required: a,
        cause: b
      });
    }
    return _({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: a,
      appliedAmount: d,
      before: s,
      after: m
    });
  }
  calculate(t, n, r) {
    switch (t) {
      case "spend":
        return n.value < r ? p({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${n.value}; custo: ${r}.`
        }) : _({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const a = Math.max(0, n.value - r);
        return _({
          afterValue: a,
          appliedAmount: n.value - a
        });
      }
      case "heal":
      case "recover": {
        const a = Math.min(n.max, n.value + r);
        return _({
          afterValue: a,
          appliedAmount: a - n.value
        });
      }
    }
  }
}
class t_ {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async rollCastingCheck(t) {
    return this.adapter.rollCastingCheck(t);
  }
  getDifficulty(t) {
    return this.adapter.getDifficulty?.(t) ?? null;
  }
}
function Is(e) {
  return {
    id: n_(),
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
function n_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class r_ {
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
    return re(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = Is(n);
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
    const a = await this.automation.run(t, r);
    return a.ok ? (this.hooks.emit("completed", r), a) : (this.emitFailed(r, a.error), a);
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
class a_ {
  emit(t, n, r = {}) {
    const a = {
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
    }), Hooks.callAll(`${c}.workflow.${t}`, a), Hooks.callAll(`${c}.workflow.phase`, a), a;
  }
}
class o_ {
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
    const n = hn();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: i_(),
      flags: {
        ...t.flags,
        [c]: {
          ...s_(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = hn();
    if (!r.enabled)
      return;
    const a = n.notification ?? to(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = to(n);
    switch (t) {
      case "info":
        f.info(r, n.data ?? "");
        return;
      case "warn":
        f.warn(r, n.data ?? "");
        return;
      case "error":
        f.error(r, n.data ?? "");
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
function to(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function i_() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function s_(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const l_ = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Ss = `${c}-inline-roll-neutralized`, c_ = `${c}-inline-roll-notice`, Dr = `data-${c}-inline-roll-neutralized`, no = `data-${c}-inline-roll-notice`, u_ = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function ro(e) {
  const t = w_(e.message), n = await d_(e.message), r = m_(t);
  return n.replacementCount + r.replacementCount > 0 && f.info("Rolagens inline neutralizadas para item automatizado.", {
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
async function d_(e) {
  const t = T_(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = f_(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await $_(t, n.content), replacementCount: n.replacementCount };
}
function m_(e) {
  const t = e ? R_(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Ls(t);
  return n > 0 && Ds(__(t)), { replacementCount: n };
}
function f_(e) {
  const t = p_(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Ls(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (Ds(n.content), { content: n.innerHTML, replacementCount: a });
}
function p_(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, h_(a.trim()))), replacementCount: t };
}
function Ls(e) {
  const t = g_(e);
  for (const n of t)
    n.replaceWith(b_(y_(n)));
  return t.length;
}
function g_(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(l_))
    n.getAttribute(Dr) !== "true" && t.add(n);
  return Array.from(t);
}
function h_(e) {
  return `<span class="${Ss}" ${Dr}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${k_(e)}</span>`;
}
function b_(e) {
  const t = document.createElement("span");
  return t.classList.add(Ss), t.setAttribute(Dr, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Ds(e) {
  if (e.querySelector?.(`[${no}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(c_), t.setAttribute(no, "true"), t.textContent = u_, e.append(t);
}
function __(e) {
  return e.querySelector(".message-content") ?? e;
}
function y_(e) {
  const n = e.getAttribute("data-formula") ?? A_(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function A_(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function T_(e) {
  return e && typeof e == "object" ? e : null;
}
async function $_(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function R_(e) {
  const t = E_(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function w_(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function k_(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function E_(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const yt = "ritualRollConfig", ye = "ritual-roll";
function Ut() {
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
function vs(e) {
  const t = e.getFlag(c, yt);
  return zn(t);
}
function Ps(e) {
  return vs(e) ?? Ut();
}
async function C_(e, t) {
  const n = zn(t) ?? zn({
    ...Ut(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(c, yt, n), n;
}
async function I_(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, c, yt));
    return;
  }
  await e.setFlag(c, yt, null);
}
function zn(e) {
  if (!Gt(e)) return null;
  const t = M_(e.intent);
  if (!t) return null;
  const n = Ut();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: At(e.damageType),
    utilityLabel: At(e.utilityLabel) ?? n.utilityLabel,
    note: vr(e.note),
    forms: F_(e.forms)
  };
}
function S_(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function L_(e) {
  const t = vs(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = D_(t, n), a = [
    { type: "spendRitualCost" },
    r,
    ...v_(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: a,
    ritualForms: N_(e, t),
    resistance: t.intent === "damage" ? x_(e) : void 0
  };
}
function D_(e, t) {
  const n = {
    type: "rollFormula",
    id: ye,
    formula: t,
    intent: O_(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function v_(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${ye}.total`,
          ...P_(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${ye}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function P_(e) {
  return e ? { damageType: e } : {};
}
function N_(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [ye]: n
      }
    }
  };
  return ao(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [ye]: t.forms.discente.formula.trim()
    }
  }), ao(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [ye]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function x_(e) {
  const t = Ns(e), n = At(t.skillResis), r = At(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const a = B_(n);
  return {
    skill: n,
    label: a,
    effect: "reducesByHalf",
    summary: `${a} reduz à metade`
  };
}
function O_(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function M_(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function F_(e) {
  const t = Ut();
  return Gt(e) ? {
    base: on(e.base),
    discente: on(e.discente),
    verdadeiro: on(e.verdadeiro)
  } : t.forms;
}
function on(e) {
  return Gt(e) ? { formula: vr(e.formula) } : { formula: "" };
}
function ao(e, t) {
  const n = Ns(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return U_(r);
}
function Ns(e) {
  const t = e.system;
  return Gt(t) ? t : {};
}
function B_(e) {
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
function U_(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function vr(e) {
  return typeof e == "string" ? e.trim() : "";
}
function At(e) {
  const t = vr(e);
  return t.length > 0 ? t : null;
}
function Gt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function G_(e) {
  switch (q_(e)) {
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
      return z_(String(e ?? ""));
  }
}
function q_(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function z_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function j_(e) {
  return {
    header: {
      eyebrow: Jn,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Y_(e.ritual)
    },
    forms: e.variantOptions.map((t) => V_(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: K_(e.automationStatus ?? "assisted")
  };
}
function V_(e, t) {
  const n = H_(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? W_(t) : "—",
    details: n
  };
}
function H_(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function W_(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function K_(e) {
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
function Y_(e) {
  const t = e.system, n = [Z_(t?.element), Q_(t?.circle)].filter(ey);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function Q_(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Z_(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (X_(e)) {
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
      return J_(e);
  }
}
function X_(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function J_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function ey(e) {
  return typeof e == "string" && e.length > 0;
}
const xs = ["base", "discente", "verdadeiro"];
function Os(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Tt(e) {
  return typeof e == "string" && xs.includes(e);
}
const { ApplicationV2: ty } = foundry.applications.api;
class Ge extends ty {
  constructor(t, n) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = j_(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: Ge.onCast,
      cancel: Ge.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new Ge(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    ry(a, (o) => {
      this.selectedVariant = o;
    }), ay(a, (o) => {
      this.spendResource = o;
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
          ${this.model.forms.map(ny).join("")}
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
    const n = sy(t), r = oy(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function ny(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", a = e.details.map((o) => `<span>${C(o)}</span>`).join("");
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
      <span class="paranormal-toolkit-ritual-cast__form-details">${a}</span>
    </label>
  `;
}
function ry(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => oo(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), oo(e, a, t));
    });
  const r = Ms(e);
  r && t(r);
}
function oo(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Tt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Ms(e));
}
function Ms(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && Tt(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function ay(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function oy(e, t, n) {
  const r = iy(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: a
  };
}
function iy(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Tt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Tt(n) ? n : null;
}
function sy(e) {
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
async function ly(e) {
  return Ge.request(e);
}
const Pr = {
  label: "Padrão"
}, cy = {
  label: "Discente",
  extraCost: 2
}, uy = {
  label: "Verdadeiro",
  extraCost: 5
};
class dy {
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
    const r = this.resolveCostPreview(t), a = tA(n), o = Xy(
      n,
      t.item,
      r,
      a
    ), s = await ly({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((S) => S.name),
      cost: r,
      defaultSpendResource: sA(n),
      variantOptions: o,
      automationStatus: a ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = my(s), u = rA(
      n,
      t.item,
      l.variant,
      a
    ), d = Zo();
    let m = null;
    if (d) {
      const S = await py(
        this.resources,
        t.actor,
        l,
        u,
        r
      );
      if (!S.ok)
        return {
          status: "failed",
          reason: S.reason,
          message: S.message
        };
      try {
        m = await sb(
          t.actor
        );
      } catch (O) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: O instanceof Error ? O.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: O
        };
      }
    }
    const b = fy(
      n,
      l,
      u,
      r,
      {
        includeCostSteps: !d
      }
    );
    if (b.steps.length === 0) {
      const S = nA(
        t,
        l
      ), O = io(
        t.actor,
        m,
        u,
        r
      ), de = so(
        n,
        l,
        u,
        r,
        S,
        t,
        m
      );
      return O.length > 0 ? {
        status: "ready",
        workflowContext: S,
        actions: O,
        summaryLines: de
      } : {
        status: "completed-without-actions",
        workflowContext: S,
        summaryLines: de
      };
    }
    const T = await this.workflow.runAutomation(b, {
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
    const $ = T.value.context, g = Ty(
      n,
      t,
      $
    ), j = hy(
      n,
      t
    ), Le = io(
      t.actor,
      m,
      u,
      r
    ), De = so(
      n,
      l,
      u,
      r,
      $,
      t,
      m
    );
    if (!g.ok)
      return {
        status: "failed",
        reason: g.reason,
        message: g.message
      };
    if (!j.ok)
      return {
        status: "failed",
        reason: j.reason,
        message: j.message
      };
    const ue = [
      ...Le,
      ...g.actions,
      ...j.actions
    ];
    return ue.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: $,
      summaryLines: De
    } : {
      status: "ready",
      workflowContext: $,
      actions: ue,
      summaryLines: De
    };
  }
  async applyAction(t) {
    return _t(
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
function my(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function fy(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || xr(l) && (!a.includeCostSteps || !s) || o.push(gy(l, n));
  return a.includeCostSteps && s && r && lA(n.extraCost) && o.push({
    type: "spendResource",
    actor: "self",
    resource: r.resource,
    amount: n.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: o
  };
}
async function py(e, t, n, r, a) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = Qe(a, r);
  if (!o)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (o.amount <= 0) return { ok: !0 };
  const s = await e.spend(
    t,
    o.resource,
    o.amount
  );
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function gy(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function io(e, t, n, r) {
  if (!t || t.success) return [];
  const a = Qe(r, n);
  if (!a || a.amount <= 0) return [];
  const o = e.name ?? "Ator sem nome";
  return [
    {
      kind: "resource-operation",
      actor: e,
      actorName: o,
      resource: "SAN",
      operation: "damage",
      amount: a.amount,
      label: `Aplicar ${a.amount} SAN`,
      executedLabel: "✓ Dano na SAN aplicado",
      actionSectionId: "casting-backlash",
      actionSectionTitle: "Dano na sanidade"
    }
  ];
}
function hy(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = Nr(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = fi(o);
      n.push(
        by(
          r,
          o,
          t.item,
          s
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function by(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? Ay(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: _y(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: yy(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function _y(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function yy(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Ay(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Ty(e, t, n) {
  const r = [], a = /* @__PURE__ */ new Map();
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const s = bt(o, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = Nr(o.actor, t);
    if (l.length === 0) {
      if (o.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of l) {
      if ($y(o)) {
        Ry(
          a,
          u,
          wy(o, n, s.value)
        );
        continue;
      }
      r.push(Ey(o, u, s.value));
    }
  }
  for (const o of a.values())
    r.push(
      ...ky(
        e,
        t.item,
        o.actor,
        o.entries
      )
    );
  return { ok: !0, actions: r };
}
function $y(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Ry(e, t, n) {
  const r = Ly(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function wy(e, t, n) {
  const r = Dy(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function ky(e, t, n, r) {
  const a = xy(e), o = a.length > 1 ? Fy() : void 0;
  return a.map((s) => {
    const l = r.map(
      (d, m) => {
        const b = Oy(d.amount, s);
        return {
          id: Cy(d, s, m),
          amount: b,
          damageType: d.damageType,
          sourceRollId: d.sourceRollId,
          ignoreResistance: d.step.ignoreResistance === !0
        };
      }
    ), u = l.reduce(
      (d, m) => d + m.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: l,
      label: Iy(u, s, a.length > 1),
      executedLabel: Sy(
        n.name ?? "Ator sem nome",
        s,
        a.length > 1
      ),
      choiceGroupId: o,
      choiceGroupResolvedLabel: o ? "✓ Outra opção escolhida" : void 0,
      actionSectionId: "apply-damage",
      actionSectionTitle: "Aplicar danos",
      source: "item-use.damage-action",
      originUuid: t.uuid ?? null
    };
  });
}
function Ey(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = Ny(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: vy(e, r, n),
    executedLabel: Py(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function Cy(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Iy(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Sy(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Ly(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Dy(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function vy(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Py(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Ny(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function xy(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Oy(e, t) {
  const n = e * t.multiplier, r = My(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function My(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Fy() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Nr(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function so(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${Os(t.variant)}`,
    qy(t, n, r),
    ...Gy(s),
    ...Object.values(a.rolls).flatMap(zy),
    ...By(e, o),
    ...jy(e.resistance),
    ...Qy(n)
  ];
}
function By(e, t) {
  return Uy(e) ? Nr("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Uy(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Gy(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function qy(e, t, n) {
  const r = Qe(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function zy(e) {
  const n = [`${Zy(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = Vy(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${G_(e.damageType)}`), n;
}
function jy(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function Vy(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const n = [];
  let r = "+";
  for (const a of t) {
    if (!a || typeof a != "object") continue;
    const o = a;
    if (o.operator === "+" || o.operator === "-") {
      r = o.operator;
      continue;
    }
    const s = Hy(o);
    s && (Yy(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Hy(e) {
  const t = Wy(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Ky(e);
}
function Wy(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Ky(e) {
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
function Yy(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function Qy(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Zy(e) {
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
function Xy(e, t, n, r) {
  return xs.map((a) => {
    const o = Fs(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? Os(a),
      enabled: s,
      details: o ? Jy(o, n, r) : [],
      finalCostText: o ? eA(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function Jy(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {});
  a.length > 0 ? r.push(a.join(", ")) : n && r.push("efeito manual");
  const o = Qe(t, e);
  return r.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), r;
}
function Qe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function eA(e, t) {
  const n = Qe(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function tA(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(xr);
}
function nA(e, t) {
  return Is({
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
function rA(e, t, n, r) {
  return Fs(e, t, n, r) ?? Pr;
}
function Fs(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? oA(t, n) ? aA(n) : null : n === "base" ? Pr : null);
}
function aA(e) {
  switch (e) {
    case "base":
      return Pr;
    case "discente":
      return cy;
    case "verdadeiro":
      return uy;
  }
}
function oA(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return iA(foundry.utils.getProperty(e, n));
}
function iA(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function sA(e) {
  return e.steps.some(xr);
}
function xr(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function lA(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Bs = "itemUsePrompts", Us = "chatCard", qt = "data-paranormal-toolkit-prompt-id", zt = "data-paranormal-toolkit-pending-id", Or = "data-paranormal-toolkit-executed-label", jn = "data-paranormal-toolkit-choice-group", Gs = "data-paranormal-toolkit-skipped-label", $t = "data-paranormal-toolkit-action-section", lo = "data-paranormal-toolkit-detail-key", co = "data-paranormal-toolkit-roll-card", Mr = "data-paranormal-toolkit-roll-detail-toggle", qs = "data-paranormal-toolkit-roll-detail-id", zs = "data-paranormal-toolkit-resistance-roll-button", js = "data-paranormal-toolkit-resistance-skill", Vs = "data-paranormal-toolkit-resistance-skill-label", Hs = "data-paranormal-toolkit-resistance-target-actor-id", Ws = "data-paranormal-toolkit-resistance-target-name", Ks = "data-paranormal-toolkit-resistance-roll-result", uo = "data-paranormal-toolkit-system-card-replaced", cA = `[${zt}]`, uA = `[${Mr}]`, dA = `[${zs}]`, Vn = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, mA = `${h}__actions`, mo = `${h}__details`, Ys = `${h}__summary`, fA = `${h}__title`, Qs = `${h}__button--executed`, fo = `${h}__roll-card`;
let po = !1, Hn = null;
const x = /* @__PURE__ */ new Map(), pA = [0, 100, 500, 1500, 3e3], gA = 3e4, hA = [0, 100, 500, 1500, 3e3];
function bA(e) {
  if (Hn = e, po) {
    ho(e);
    return;
  }
  const t = (n, r) => {
    Xs(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), po = !0, ho(e);
}
async function go(e) {
  const t = Zs(e);
  x.set(e.pendingId, t), await Ur(t) || ul(t), Js(e.pendingId);
}
async function _A(e) {
  const t = Zs({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", x.set(e.pendingId, t), await Ur(t) || ul(t), Js(e.pendingId);
}
async function sn(e, t) {
  const n = x.get(e);
  x.delete(e), n && await _T(n, t);
}
function Fr(e) {
  const t = hl();
  for (const n of t) {
    const r = z(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function yA(e, t) {
  const n = Fr(e);
  if (!n) return;
  const r = z(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Ce(n.message, r));
}
async function AA(e, t, n) {
  if (!t) return;
  const r = Fr(e);
  if (!r) return;
  const a = z(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Ce(r.message, a);
}
function Zs(e) {
  const t = Y(e.context.message), n = e.context.targets.find((s) => Qn(s)), r = n ? Qn(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    resistanceTargetActorId: e.resistanceTargetActorId ?? a?.id ?? null,
    resistanceTargetName: o,
    resistanceRollResult: null,
    actionPayload: e.actionPayload ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: WA(e.context),
    executed: !1
  };
}
function Xs(e, t, n) {
  bT();
  const r = Vt(t);
  if (!r) return;
  const a = pT(e, r);
  a.length > 0 && Rt(r);
  for (const o of a)
    Wn(r, o);
  al(r, n), Kn(r), Yn(r);
}
function ho(e) {
  for (const t of hA)
    globalThis.setTimeout(() => {
      TA(e);
    }, t);
}
function TA(e) {
  for (const t of $A()) {
    const n = jt(t);
    RA(n) && Xs(n, t, e);
  }
}
function $A() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function RA(e) {
  return e ? Gr(e) ? !0 : AT(e).length > 0 : !1;
}
function Js(e) {
  const t = x.get(e);
  if (!t) return;
  const n = t.messageId ? gT(t.messageId) : null;
  if (n) {
    To(n, t), Rt(n), Wn(n, t), bo(n), Kn(n), Yn(n);
    return;
  }
  if (t.messageId) {
    Xn(t);
    return;
  }
  const r = hT(t);
  if (r) {
    To(r, t), Rt(r), Wn(r, t), bo(r), Kn(r), Yn(r);
    return;
  }
  Xn(t);
}
function bo(e) {
  Hn && al(e, Hn);
}
function Rt(e) {
  const t = wA();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = rl(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(uo) === "true") return;
  const r = n.querySelector(`.${Vn}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(uo, "true");
}
function wA() {
  try {
    return Lc() === "replace";
  } catch {
    return !1;
  }
}
function Wn(e, t) {
  if (Rt(e), e.querySelector(`[${qt}="${Ie(t.pendingId)}"]`)) return;
  const n = EA(e, t);
  IA(n, t);
  const r = zA(t);
  if (kA(r)) return;
  qA(n, r).append(HA(t));
}
function kA(e) {
  return tl(e.id) && !oe();
}
function el(e) {
  const n = e.closest(`[${$t}]`)?.getAttribute($t) ?? null;
  return tl(n) && !oe();
}
function tl(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function EA(e, t) {
  const n = e.querySelector(`.${Vn}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Vn, h);
  const a = document.createElement("header");
  a.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(fA), s.textContent = CA(t);
  const l = document.createElement("span");
  return l.classList.add(Ys), l.textContent = t.summary, a.append(o, s, l), r.append(a), YA(e).append(r), r;
}
function CA(e) {
  const t = I(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function IA(e, t) {
  const n = t.summaryLines ?? [], r = ll(n, t);
  if (r) {
    SA(e, r, t);
    return;
  }
  jA(e, n);
}
function SA(e, t, n) {
  if (e.querySelector(`[${co}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(fo, `${fo}--${t.intent}`), r.setAttribute(co, "true"), t.castingCheck && _o(r, DA(t.castingCheck), n.pendingId, "casting"), LA(t) && _o(r, vA(t), n.pendingId, "effect"), MA(r, t), FA(r, t, n), GA(r, t), e.append(r);
}
function LA(e) {
  return e.intent !== "casting";
}
function DA(e) {
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
function vA(e) {
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
function _o(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && a.classList.add(`${h}__workflow-section--${t.status}`);
  const o = document.createElement("div");
  o.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, o.append(s), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, o.append(l);
  }
  if (a.append(o), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, a.append(l);
  }
  PA(a, t), UA(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function PA(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = NA(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function NA(e, t) {
  const n = xA(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of OA(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function xA(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function OA(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? yo(e, "highest") : n.includes("kl") ? yo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function yo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function MA(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(FT);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function FA(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = BA(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(nl(t.resistanceRollResult)), e.append(r);
}
function BA(e, t) {
  if (!e.resistanceSkill || !le()) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(qt, t.pendingId), n.setAttribute(zs, "true"), n.setAttribute(js, e.resistanceSkill), n.setAttribute(Vs, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Hs, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Ws, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Ks, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function nl(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = il(e), t;
}
function UA(e, t, n, r, a) {
  const o = t.filter((d) => d.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Mr, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(qs, s), u.hidden = !0;
  for (const d of o) {
    const m = document.createElement("dt");
    m.textContent = d.label;
    const b = document.createElement("dd");
    b.textContent = d.value, u.append(m, b);
  }
  e.append(l, u);
}
function GA(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function qA(e, t) {
  const n = `[${$t}="${Ie(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(mA), a.setAttribute($t, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function zA(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = ll(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function jA(e, t) {
  if (t.length === 0) return;
  const n = VA(e);
  for (const r of t) {
    const a = BT(r);
    if (n.querySelector(`[${lo}="${Ie(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(lo, a), n.append(o);
  }
}
function VA(e) {
  const t = e.querySelector(`.${mo}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(mo), e.append(n), n;
}
function HA(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(qt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Qs), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(zt, e.pendingId), t.setAttribute(Or, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(jn, e.choiceGroupId), t.setAttribute(Gs, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function WA(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = KA(e);
  return `${t} → ${n}`;
}
function KA(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function YA(e) {
  return rl(e) ?? e;
}
function rl(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function al(e, t) {
  const n = Vt(e);
  if (!n) return;
  const r = n.querySelectorAll(cA);
  for (const a of r) {
    if (el(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      cT(a, t);
    }));
  }
}
function Kn(e) {
  const t = Vt(e);
  if (!t) return;
  const n = t.querySelectorAll(uA);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      QA(t, r);
    }));
}
function Yn(e) {
  const t = Vt(e);
  if (!t) return;
  const n = t.querySelectorAll(dA);
  for (const r of n) {
    if (!le()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      ZA(t, r);
    }));
  }
}
function QA(e, t) {
  const n = t.getAttribute(Mr);
  if (!n) return;
  const r = e.querySelector(`[${qs}="${Ie(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function ZA(e, t) {
  if (!le()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(qt), r = t.getAttribute(js), a = t.getAttribute(Vs) ?? (r ? ae(r) : "Resistência");
  if (!n || !r) return;
  const o = eT(e, n), s = tT(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Wu(s, r);
    await iT(u.roll);
    const d = {
      skill: r,
      skillLabel: a,
      formula: u.formula,
      total: u.total,
      targetName: s.name ?? o?.resistanceTargetName ?? "alvo",
      diceBreakdown: u.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    XA(t, d), JA(t, d), sT(n, d), await lT(e, n, d);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function XA(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Ks, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function JA(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? nl(t);
  if (r) {
    r.textContent = il(t);
    return;
  }
  n.append(a);
}
function eT(e, t) {
  const n = x.get(t);
  if (n) return n;
  const r = jt(e);
  return z(r)[t] ?? null;
}
function tT(e, t) {
  const n = e?.resistanceTargetActor;
  if (U(n)) return n;
  const a = e?.context?.targets.map(Qn).find(U) ?? null;
  if (a) return a;
  const o = t.getAttribute(Hs) ?? e?.resistanceTargetActorId ?? null, s = o ? rT(o) : null;
  return s || aT(
    t.getAttribute(Ws) ?? e?.resistanceTargetName ?? nT(t)
  );
}
function nT(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Ys}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Qn(e) {
  const t = e.actor;
  if (U(t)) return t;
  const n = e.token, r = Ve(n);
  if (r) return r;
  const a = e.document;
  return Ve(a);
}
function Ve(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (U(t)) return t;
  const n = e.document?.actor;
  return U(n) ? n : null;
}
function rT(e) {
  const n = game.actors?.get?.(e);
  return U(n) ? n : ol().map((o) => Ve(o)).find((o) => o?.id === e) ?? null;
}
function aT(e) {
  const t = Ae(e);
  if (!t) return null;
  const n = ol().filter((o) => Ae(oT(o)) === t).map((o) => Ve(o)).find(U) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => U(o) && Ae(o.name) === t);
  return U(a) ? a : null;
}
function ol() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function oT(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ve(e)?.name ?? null;
}
function Ae(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function U(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function il(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function iT(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function sT(e, t) {
  const n = x.get(e);
  n && (n.resistanceRollResult = t);
}
async function lT(e, t, n) {
  const r = jt(e);
  if (r)
    try {
      const a = z(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await Ce(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function jt(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return q(r?.get?.(n));
}
async function cT(e, t) {
  if (el(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(zt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    sl(e, e.getAttribute(Or) ?? "✓ Automação aplicada"), uT(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function sl(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Qs), e.removeAttribute(zt), e.removeAttribute(Or);
}
function uT(e) {
  const t = e.getAttribute(jn);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${jn}="${Ie(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(Gs) ?? "✓ Outra opção escolhida";
    sl(a, o);
  }
}
function ll(e, t) {
  const n = e.map(Br).filter(OT), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = I(e, "Forma"), o = I(e, "Custo"), s = I(e, "Dados") ?? I(e, `Dados (${r.label})`), l = I(e, "Tipo"), u = I(e, "Resistência"), d = I(e, "Resistência Perícia"), m = I(e, "Resistência Rótulo") ?? (d ? ae(d) : null), b = cl(e, "Observação"), T = e.filter((g) => fT(g, r)), $ = dT(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: a,
    cost: o,
    diceBreakdown: s,
    damageType: l,
    resistance: u,
    resistanceSkill: d,
    resistanceSkillLabel: m,
    notes: b,
    details: T,
    castingCheck: $,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function dT(e) {
  const t = e.map(Br).find((o) => o?.intent === "casting") ?? null, n = I(e, "Conjuração DT"), r = I(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const a = Number(n);
  return Number.isFinite(a) ? {
    label: t.formula,
    formula: I(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: I(e, "Dados (Conjuração)")
  } : null;
}
function Br(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: mT(n)
  } : null;
}
function mT(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function I(e, t) {
  return cl(e, t)[0] ?? null;
}
function cl(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function fT(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Br(e) ? !1 : e.trim().length > 0;
}
function pT(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of x.values())
    Zn(r, e, t) && n.set(r.pendingId, r);
  for (const r of yT(e))
    Zn(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function Zn(e, t, n) {
  const r = Y(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !Ao(n, "itemId", e.itemId) ? !1 : !e.actorId || Ao(n, "actorId", e.actorId);
}
function Ao(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${UT(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function gT(e) {
  const t = Ie(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function hT(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Zn(e, null, t))
      return t;
  return null;
}
function bT() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of x.entries())
    e - r.createdAt > t && x.delete(n);
}
async function To(e, t) {
  const n = jt(e);
  if (!n) return !1;
  try {
    const r = z(n);
    return r[t.pendingId] = qr(t, Y(n)), await Ce(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Ur(e) {
  const t = fl(e);
  if (!t) return !1;
  try {
    const n = z(t);
    return n[e.pendingId] = qr(e, Y(t)), await Ce(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function ul(e) {
  for (const t of pA)
    globalThis.setTimeout(() => {
      Xn(e);
    }, t);
}
async function Xn(e) {
  const t = fl(e);
  if (Gr(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await Ur(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function _T(e, t) {
  const n = ml(e.context.message);
  if (n)
    try {
      const r = z(n), a = r[e.pendingId] ?? qr(e, Y(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Ce(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function yT(e) {
  return Object.values(z(q(e))).filter(Ze);
}
function z(e) {
  if (!e) return {};
  const t = {}, n = Gr(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(dl(e)))
    t[r] ??= a;
  return t;
}
function AT(e) {
  return Object.values(dl(q(e))).filter(Ze);
}
function dl(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, Bs);
  if (!Re(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    Ze(a) && (n[r] = a);
  return n;
}
async function Ce(e, t) {
  typeof e.setFlag == "function" && (await $T(e, t), await TT(e, t));
}
async function TT(e, t) {
  await Promise.resolve(e.setFlag?.(c, Bs, t));
}
function Gr(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, Us);
  return NT(t) ? t : null;
}
async function $T(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Ze).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: r.messageId ?? Y(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: RT(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(c, Us, a));
}
function RT(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function qr(e, t) {
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
function ml(e) {
  const t = q(e);
  if (t?.setFlag)
    return t;
  const n = wT(e);
  if (n?.setFlag)
    return n;
  const r = Y(e);
  if (!r) return null;
  const a = game.messages;
  return q(a?.get?.(r));
}
function wT(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(q).find((n) => typeof n?.setFlag == "function") ?? null;
}
function fl(e) {
  const t = ml(e.context.message);
  if (t) return t;
  const n = e.messageId ? kT(e.messageId) : null;
  if (n) return n;
  const r = hl().slice().reverse();
  return r.find((a) => ET(a, e)) ?? r.find((a) => CT(a, e)) ?? null;
}
function kT(e) {
  const t = game.messages;
  return q(t?.get?.(e));
}
function ET(e, t) {
  const n = Y(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!pl(e, t)) return !1;
  const a = gl(e);
  return !t.actorId || !a || a === t.actorId;
}
function CT(e, t) {
  if (!ST(e, t)) return !1;
  const n = gl(e);
  return t.actorId && n === t.actorId ? !0 : pl(e, t);
}
function pl(e, t) {
  const n = Ae(IT(e));
  if (!n) return !1;
  const r = Ae(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Ae(t.itemId);
  return !!(a && n.includes(a));
}
function IT(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function gl(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function ST(e, t) {
  const n = LT(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= gA;
}
function LT(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function q(e) {
  return e && typeof e == "object" ? e : null;
}
function Ze(e) {
  return Re(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && L(e.messageId) && L(e.itemId) && L(e.actorId) && L(e.itemName) && ee(e.resistanceTargetActorId) && ee(e.resistanceTargetName) && xT(e.resistanceRollResult) && DT(e.actionPayload) && ln(e.title) && ln(e.buttonLabel) && ln(e.executedLabel) && ee(e.choiceGroupId) && ee(e.skippedLabel) && ee(e.actionSectionId) && ee(e.actionSectionTitle) && MT(e.summaryLines) : !1;
}
function DT(e) {
  return e == null ? !0 : Re(e) ? e.kind === "resource-operation" && L(e.actorId) && L(e.actorUuid) && typeof e.actorName == "string" && vT(e.resource) && PT(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function vT(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function PT(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function NT(e) {
  return Re(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && L(e.messageId) && Re(e.source) && L(e.source.actorId) && L(e.source.actorName) && L(e.source.itemId) && L(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Ze) : !1;
}
function xT(e) {
  return e == null ? !0 : Re(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && ee(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function OT(e) {
  return e !== null;
}
function Re(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function L(e) {
  return e === null || typeof e == "string";
}
function ln(e) {
  return e === void 0 || typeof e == "string";
}
function ee(e) {
  return e == null || typeof e == "string";
}
function MT(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function FT(e) {
  return typeof e == "string" && e.length > 0;
}
function hl() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(q).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(q).filter((r) => r !== null) : [];
}
function Vt(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Y(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function BT(e) {
  return e.trim().toLowerCase();
}
function UT(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Ie(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const $o = 1e3;
class GT {
  constructor(t, n, r, a, o, s) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new dy(
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
      settings: Zr(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Zr();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Ct(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && jT(t.item) && n.executionMode === "ask") {
        await this.handleGenericRitual(t);
        return;
      }
      const a = r.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, a, r.error.reason), r.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: r.error.message,
        data: r.error
      });
      return;
    }
    if (await ro(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: dn(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await sn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await sn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Fr(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = WT(r);
    if (!a)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await _t(
      this.resources,
      a,
      r.resource,
      r.operation,
      r.amount
    );
    return o.ok ? (await yA(t), await AA(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (bA(
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
    if (await ro(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: dn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      VT(t.item)
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
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), f.info(
          "Ritual assistido concluído sem ações pendentes.",
          re(r.workflowContext)
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
      const a = await this.ritualAssistant.applyAction(t);
      return a.ok ? (n.resourceTransactions.push(a.value), { ok: !0 }) : (this.handleResourceActionFailure(a), { ok: !1 });
    }
    if (t.kind === "damage-application") {
      if (!oe())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const a = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return a.ok ? (zT(n, a.value), await vi(a.value), {
        ok: !0,
        executedLabel: qT(a.value)
      }) : (this.handleDamageActionFailure(a.error), { ok: !1 });
    }
    if (!oe())
      return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar efeito assistido."), { ok: !1 };
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
    const n = cn(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && cn(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await sn(
        a,
        Ro(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = mn();
    await _A({
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
  async registerAssistedActions(t, n, r, a) {
    let o;
    for (const s of r) {
      const l = mn();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await go({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: cn(s),
        skippedLabel: Ro(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: HT(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      re(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = mn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await go({
      pendingId: r,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", r);
  }
  async executeAutomation(t, n, r) {
    this.setAttempt(t, "running");
    const a = await this.workflow.runAutomation(n, {
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
    if (!a.ok) {
      this.setAttempt(t, "failed", a.error.reason), this.handleAutomationFailure(a.error);
      return;
    }
    this.setAttempt(t, "completed"), f.info(
      "Automação executada por uso normal de item.",
      re(a.value.context)
    );
  }
  handleAutomationFailure(t) {
    const n = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      f.warn(n, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      f.error(n, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    f.warn(n, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    f.warn(
      `Ação assistida falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  handleDamageActionFailure(t) {
    f.warn(`Ação assistida de dano falhou: ${t.message}`, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleConditionActionFailure(t) {
    f.warn(
      `Ação assistida de condição falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const n = Date.now(), r = wo(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > $o && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= $o;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(wo(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = dn(
      t,
      n,
      r,
      a
    );
  }
}
function qT(e) {
  return Pi({ inputAmount: e.totalRawDamage });
}
function cn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function Ro(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function zT(e, t) {
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
function jT(e) {
  return e.type === "ritual";
}
function VT(e) {
  return L_(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function HT(e) {
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
function WT(e) {
  const t = e.actorUuid ? KT(e.actorUuid) : null;
  if (we(t)) return t;
  const n = e.actorId ? YT(e.actorId) : null;
  return n || QT(e.actorName);
}
function KT(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function YT(e) {
  const n = game.actors?.get?.(e);
  if (we(n)) return n;
  for (const r of bl()) {
    const a = zr(r);
    if (a?.id === e) return a;
  }
  return null;
}
function QT(e) {
  const t = un(e);
  if (!t) return null;
  for (const a of bl()) {
    const o = ZT(a);
    if (un(o) === t) {
      const s = zr(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => we(a) && un(a.name) === t
  );
  return we(r) ? r : null;
}
function bl() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function ZT(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : zr(e)?.name ?? null;
}
function zr(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (we(t)) return t;
  const n = e.document?.actor;
  return we(n) ? n : null;
}
function un(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function we(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function dn(e, t, n, r) {
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
function wo(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function mn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class XT {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], a = [], o = We(t);
    for (const s of n) {
      const l = s.itemId ? o.find((m) => m.id === s.itemId) ?? null : null, u = s.match?.preset ?? null;
      if (!l || !u) {
        a.push(s);
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
      skipped: a
    };
  }
}
class JT {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = We(t).map((l) => this.analyzeRitual(l)), r = n.filter(it("upToDate")), a = n.filter(it("available")), o = n.filter(it("outdated")), s = n.filter(it("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: a,
      outdated: o,
      unsupported: s,
      canApply: a.length > 0 || o.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = e$(t);
    return n ? r ? r.source.type !== "preset" ? Ne({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? Ne({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : Ne({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: t$(r, n.preset)
    }) : Ne({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : Ne({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Ne(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? Et(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function e$(e) {
  const t = e.getFlag(c, "automation");
  return er(t) ? t : null;
}
function t$(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function it(e) {
  return (t) => t.status === e;
}
class n$ {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = nr(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), a = re(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: r,
      data: a,
      flags: {
        [c]: {
          workflowSummary: a
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const n = A(t.actorName), r = A(t.resource), a = A(ko(t)), o = A(a$(t));
    return `
      <section class="${c}-card ${c}-resource-card">
        <header class="${c}-card__header">
          <strong>${a}</strong>
          <span>${n}</span>
        </header>
        <div class="${c}-card__body">
          <p><strong>${o}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, n) {
    const r = A(n.title ?? "Automação"), a = n.message ? `<p>${A(n.message)}</p>` : "", o = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = A(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((g) => A(g.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map(
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(r$(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), d = t.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(o$(g.source))})</li>`
    ), m = t.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), b = t.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(ko(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), $ = t.phases.map((g) => A(g)).join(" &rarr; ");
    return `
      <section class="${c}-card ${c}-workflow-card">
        <header class="${c}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${c}-card__body">
          ${a}
          <p><strong>Origem:</strong> ${o}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${d.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${u.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${m.length > 0 ? `<p><strong>Dano:</strong></p><ul>${m.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p><strong>Cura:</strong></p><ul>${b.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${$.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${$}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function r$(e) {
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
function ko(e) {
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
function a$(e) {
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
function o$(e) {
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
function i$() {
  const e = new Zh(), t = new e_(e), n = new di(new ci()), r = new mi(new dr()), a = new t_(new $s()), o = new eb(), s = new gb(o), l = new Sb(e), u = new Db(), d = u.registerMany(
    oc()
  );
  if (!d.ok)
    throw new Error(d.error.message);
  const m = new Lb(), b = new Cb(), T = Ai(), $ = new gi(T), g = new JT(
    u
  ), j = new XT(
    g,
    m,
    b
  ), Le = new o_(), De = new n$(Le), ue = new a_(), S = new Xb(
    t,
    s,
    De,
    ue
  ), O = new r_(S, ue), de = new GT(
    O,
    t,
    s,
    n,
    $,
    Le
  );
  return de.addStrategy(
    new kb(
      (kl) => de.handleItemUsed(kl)
    )
  ), {
    ordem: l,
    resourceAdapter: e,
    ritualAdapter: o,
    ritualCosts: s,
    resources: t,
    damage: n,
    resistance: r,
    ritualCasting: a,
    automationRegistry: u,
    automationBinder: m,
    itemPatches: b,
    conditionRegistry: T,
    conditions: $,
    debugOutput: Le,
    chatMessages: De,
    workflowHooks: ue,
    automation: S,
    workflow: O,
    itemUseIntegration: de,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: j
  };
}
const { ApplicationV2: s$ } = foundry.applications.api;
class wt extends s$ {
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
      apply: wt.onApply,
      cancel: wt.onCancel
    }
  };
  async _renderHTML(t, n) {
    const r = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), a = document.createElement("div");
    return a.className = "paranormal-toolkit-preset-manager", a.innerHTML = this.renderContent(r), a;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${F(Jn)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${F(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${fn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${fn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${fn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function fn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${F(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? l$(n) : u$(t)}
    </section>
  `;
}
function l$(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(c$).join("")}</ol>`;
}
function c$(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${F(e.appliedPresetId)} v${F(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${F(e.itemName)}</strong>
        <span>${F(e.reason)}</span>
        ${r}
      </div>
      <em>${F(n)}</em>
    </li>
  `;
}
function u$(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${F({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function F(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const kt = `${c}.manageRitualPresets`, Eo = `__${c}_ritualPresetHeaderControlRegistered`, d$ = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function m$(e) {
  const t = globalThis;
  if (!t[Eo]) {
    for (const n of d$)
      Hooks.on(n, (r, a) => {
        f$(r, a, e);
      });
    t[Eo] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function f$(e, t, n) {
  Array.isArray(t) && g$(e) && (p$(e, n), !t.some((r) => r.action === kt) && t.push({
    action: kt,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), _l(e, n);
    }
  }));
}
function p$(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[kt] && (e.options.actions[kt] = (n) => {
    n.preventDefault(), n.stopPropagation(), _l(e, t);
  }));
}
function g$(e) {
  if (!game.user?.isGM) return !1;
  const t = yl(e);
  return t ? t.type === "agent" && We(t).length > 0 : !1;
}
function _l(e, t) {
  const n = yl(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new wt(n, t).render({ force: !0 });
}
function yl(e) {
  return Co(e.actor) ? e.actor : Co(e.document) ? e.document : null;
}
function Co(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const Al = "data-paranormal-toolkit-ritual-roll-config", Xe = "data-paranormal-toolkit-ritual-roll-field", ie = "data-paranormal-toolkit-ritual-roll-action", Io = `__${c}_ritualRollConfigBlockRegistered`, h$ = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], b$ = [
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
function _$() {
  const e = globalThis;
  if (!e[Io]) {
    y$();
    for (const t of h$)
      Hooks.on(t, (...n) => {
        A$(n[0], n[1]);
      });
    e[Io] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function y$() {
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
function A$(e, t) {
  const n = N$(e);
  if (!n || n.type !== "ritual") return;
  const r = M$(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  $$(a);
  const o = $l(n), s = Ps(n), l = x$(n), u = R$(n, s, o, l);
  S$(u, n, o, l), T$(a, u), jr(u);
}
function T$(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function $$(e) {
  for (const t of Array.from(e.querySelectorAll(`[${Al}]`)))
    t.remove();
}
function R$(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${c}-ritual-roll-config`), a.setAttribute(Al, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${c}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${c}-ritual-roll-config__title`), s.append(So("strong", "Paranormal Toolkit")), s.append(So("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${c}-ritual-roll-config__badge`), l.textContent = wl(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const u = document.createElement("p");
  u.classList.add(`${c}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(u);
  const d = document.createElement("div");
  d.classList.add(`${c}-ritual-roll-config__fields`), d.append(w$(t, r)), d.append(k$(t, r)), d.append(E$(t, r)), a.append(d), a.append(C$(t, n, r)), a.append(I$(r));
  const m = document.createElement("p");
  return m.classList.add(`${c}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function w$(e, t) {
  const n = Ht("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Xe, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = S_(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function k$(e, t) {
  const n = Ht("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Xe, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of b$) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function E$(e, t) {
  const n = Ht("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Xe, "utilityLabel"), n.append(r), n;
}
function C$(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${c}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${c}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${c}-ritual-roll-config__forms-grid`), o.append(pn("base", "Padrão", e.forms.base.formula, !0, n)), o.append(pn("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(pn("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function pn(e, t, n, r, a) {
  const o = Ht(t);
  o.classList.add(`${c}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(Xe, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function I$(e) {
  const t = document.createElement("div");
  t.classList.add(`${c}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(ie, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(ie, "clear"), t.append(n, r), t;
}
function Ht(e) {
  const t = document.createElement("label");
  t.classList.add(`${c}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function So(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function S$(e, t, n, r) {
  Se(e, "intent")?.addEventListener("change", () => jr(e)), vo(e, "system.studentForm")?.addEventListener("change", () => Lo(e, t)), vo(e, "system.trueForm")?.addEventListener("change", () => Lo(e, t)), e.querySelector(`[${ie}="save"]`)?.addEventListener("click", () => {
    r && L$(e, t, n);
  }), e.querySelector(`[${ie}="clear"]`)?.addEventListener("click", () => {
    r && D$(e, t);
  });
}
async function L$(e, t, n) {
  const r = e.querySelector(`[${ie}="save"]`);
  r?.setAttribute("disabled", "true"), Te(e, "Salvando configuração...");
  try {
    const a = v$(e, n);
    await C_(t, a), Tl(e, a), Te(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), Te(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function D$(e, t) {
  const n = e.querySelector(`[${ie}="clear"]`);
  n?.setAttribute("disabled", "true"), Te(e, "Limpando configuração...");
  try {
    await I_(t);
    const r = Ps(t);
    P$(e, r), Tl(e, r), Te(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Te(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Tl(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__badge`);
  n && (n.textContent = wl(t) ? "Configurada" : "Rascunho");
}
function v$(e, t) {
  return {
    schemaVersion: 1,
    intent: Rl(Se(e, "intent")?.value),
    damageType: Po(e, "damageType"),
    utilityLabel: Po(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: mt(e, "formula.base") },
      discente: { formula: mt(e, "formula.discente") },
      verdadeiro: { formula: mt(e, "formula.verdadeiro") }
    }
  };
}
function P$(e, t) {
  fe(e, "intent", t.intent), fe(e, "damageType", t.damageType ?? ""), fe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), fe(e, "formula.base", t.forms.base.formula), fe(e, "formula.discente", t.forms.discente.formula), fe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), jr(e);
}
function jr(e) {
  const t = Rl(Se(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function Lo(e, t) {
  const n = $l(t);
  Do(e, "discente", n.discente), Do(e, "verdadeiro", n.verdadeiro);
}
function Do(e, t, n) {
  const r = Se(e, `formula.${t}`);
  if (!r) return;
  const a = !e.querySelector(`[${ie}="save"]`)?.disabled;
  r.disabled = !a || !n;
  const o = r.closest(`.${c}-ritual-roll-config__field`), s = o?.querySelector("small");
  if (o) {
    if (n) {
      s?.remove();
      return;
    }
    if (!s) {
      const l = document.createElement("small");
      l.textContent = "Indisponível neste ritual.", o.append(l);
    }
  }
}
function Te(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function $l(e) {
  const t = O$(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function N$(e) {
  return No(e.item) ? e.item : No(e.document) ? e.document : null;
}
function x$(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function O$(e) {
  const t = e.system;
  return F$(t) ? t : {};
}
function vo(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Se(e, t) {
  return e.querySelector(`[${Xe}="${B$(t)}"]`);
}
function mt(e, t) {
  return Se(e, t)?.value.trim() ?? "";
}
function Po(e, t) {
  const n = mt(e, t);
  return n.length > 0 ? n : null;
}
function fe(e, t, n) {
  const r = Se(e, t);
  r && (r.value = n);
}
function Rl(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function wl(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function M$(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function No(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function F$(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function B$(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let ne = null;
Hooks.once("init", () => {
  nc(), Sc(), cu(), Fh(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!ea.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${ea.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  ne = i$(), ne.itemUseIntegration.registerStrategies(), ou(ne.conditions), qc(ne), Jc(), Yc(), jh(), m$(ne), _$(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Jn} inicializado.`);
});
function U$() {
  if (!ne)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return ne;
}
export {
  U$ as getToolkitServices
};
//# sourceMappingURL=main.js.map
