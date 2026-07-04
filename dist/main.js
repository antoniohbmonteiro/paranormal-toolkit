const c = "paranormal-toolkit", tr = "Paranormal Toolkit", yl = "ordemparanormal";
class je {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function kt(e) {
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
function b(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function wt(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : nr(t) ? b(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Al(e) {
  return nr(e.getFlag(c, "automation"));
}
function nr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && $l(t.source) && Tl(t.definition);
}
function Tl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(Rl) && (t.conditionApplications === void 0 || Sl(t.conditionApplications));
}
function $l(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function Rl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return kl(t);
    case "spendRitualCost":
      return wl(t);
    case "rollFormula":
      return El(t);
    case "modifyResource":
      return Cl(t);
    case "chatCard":
      return Il(t);
    default:
      return !1;
  }
}
function kl(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ia(t);
}
function wl(e) {
  return e.type === "spendRitualCost";
}
function El(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || xl(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function Cl(e) {
  const t = e;
  return t.type === "modifyResource" && Sa(t.actor) && Pl(t.resource) && Nl(t.operation) && Ia(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Il(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Sl(e) {
  return Array.isArray(e) && e.every(Ll);
}
function Ll(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && Sa(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || Dl(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel));
}
function Dl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Ol(t.rounds)) && (t.expiry === void 0 || t.expiry === null || vl(t.expiry));
}
function vl(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Ia(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function Sa(e) {
  return e === "self" || e === "target";
}
function Pl(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Nl(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function xl(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Ol(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function rr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(qr);
    if (Ul(t))
      return Array.from(t).filter(qr);
  }
  return [];
}
function Ml(e) {
  return rr(e)[0] ?? null;
}
function Fl(e) {
  return rr(e).find(Al) ?? null;
}
function Ul(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function qr(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ve(e) {
  return rr(e).filter((t) => t.type === "ritual");
}
function La(e) {
  return Ve(e)[0] ?? null;
}
function Bl(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(kt);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Pe("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Qe(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(jr);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Pe("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Qe(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        f.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await hn(e, r, o.value);
      f.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Pe("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Qe(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await hn(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: jr(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Gr(e);
    },
    async applyBestPresetsToActorRituals() {
      return Gr(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Pe("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Qe(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Gr(e) {
  const t = Pe("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Ve(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), zr(t);
  const r = zr(t, n.length);
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
    const s = await hn(e, o, a.preset);
    r.applied.push(ql(o, a, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Gl(r), r;
}
async function hn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function ql(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: kt(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function zr(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Gl(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function jr(e) {
  return {
    preset: kt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Pe(e) {
  const t = je.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Qe(e) {
  const t = La(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function oe(e) {
  return e ? {
    id: e.id,
    source: {
      ...zl(e.sourceActor),
      token: e.sourceToken
    },
    item: jl(e.item),
    targets: e.targets.map(Vl),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Vr(e.rollRequests, Da),
    rolls: Vr(e.rolls, Hl),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(or),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function or(e) {
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
function zl(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function jl(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Vl(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Da(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Hl(e) {
  return {
    ...Da(e),
    total: e.total
  };
}
function Vr(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function Wl(e) {
  return {
    getSelected() {
      return je.getSelectedActor();
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
  const o = await r(n);
  if (!o.ok) {
    Kl(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, or(a));
}
function Q(e) {
  const t = je.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Kl(e) {
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
const F = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Yl() {
  Ze(F.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Ze(F.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Ze(F.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Ze(F.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function bn() {
  return {
    enabled: Xe(F.enabled),
    console: Xe(F.console),
    ui: Xe(F.ui),
    chat: Xe(F.chat)
  };
}
async function j(e, t) {
  await game.settings.set(c, F[e], t);
}
function Ze(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Xe(e) {
  return game.settings.get(c, e) === !0;
}
function Ql() {
  return {
    status() {
      return bn();
    },
    async enable() {
      await j("enabled", !0);
    },
    async disable() {
      await j("enabled", !1);
    },
    async enableConsole() {
      await j("console", !0);
    },
    async disableConsole() {
      await j("console", !1);
    },
    async enableUi() {
      await j("ui", !0);
    },
    async disableUi() {
      await j("ui", !1);
    },
    async enableChat() {
      await j("chat", !0);
    },
    async disableChat() {
      await j("chat", !1);
    }
  };
}
const va = "ritual.costOnly", Pa = "ritual.simpleHealing", Zl = "ritual.eletrocussao", Na = "ritual.simpleDamage", xa = "generic.simpleHealing", Oa = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Xl() {
  return [
    Jl(),
    ec(),
    tc(),
    nc(),
    rc()
  ];
}
function Jl() {
  return {
    id: va,
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
function ec() {
  return {
    id: Pa,
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
    automation: Ma(),
    itemPatch: ac()
  };
}
function tc() {
  return {
    id: Zl,
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
    automation: oc(),
    itemPatch: ic()
  };
}
function nc() {
  return {
    id: Na,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: ar()
  };
}
function rc() {
  return {
    id: xa,
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
function Ma(e = "2d8+2") {
  return Fa(
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
function oc() {
  return {
    ...ar("3d6", {
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
function ar(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Fa(
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
function ac() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Oa,
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
function ic() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Oa,
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
function Fa(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function ir() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: pe(t.id),
    actorId: pe(t.actor?.id),
    sceneId: pe(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Ua() {
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
function sc(e) {
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
      const o = X(r);
      if (o) {
        if (!uc(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(c, "ritual.cost", {
          resource: n,
          amount: t
        }), f.info(`Custo customizado aplicado em ${o.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${n}.`);
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
      const r = e.automationRegistry.require(va);
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
      if (!Hr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Pa);
      if (!o.ok) {
        f.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Ma(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = Z("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = X(n);
      if (!r) return;
      if (!Hr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Na);
      if (!o.ok) {
        f.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: ar(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = Z("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = X(t);
      n && await lc(e, t, n);
    }
  };
}
async function lc(e, t, n) {
  const r = wt(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ua(),
    item: n,
    targets: ir()
  });
  if (!o.ok) {
    cc(o.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", oe(o.value.context));
}
function cc(e) {
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
  const t = je.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function X(e) {
  const t = La(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function uc(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Hr(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const dc = ["strict", "open"], Ba = "strict";
function mc(e) {
  return dc.includes(e) ? e : Ba;
}
function fc(e) {
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
function sr(e, t) {
  return e === "strict" && t.kind === "pending";
}
const pc = ["disabled", "ask", "automatic"], gc = ["buttons", "confirm"], qa = "ask";
function hc(e) {
  return typeof e == "string" && pc.includes(e);
}
function bc(e) {
  return typeof e == "string" && gc.includes(e);
}
function _c(e) {
  return hc(e) ? e : bc(e) ? "ask" : qa;
}
const yc = ["keep", "replace"], Ac = ["manual", "assisted"], Ga = "keep", za = "assisted", Tc = !0, k = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function $c() {
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
    default: qa
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
    default: Ga
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
    default: za
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
    default: Ba
  }), game.settings.register(c, k.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Tc
  }), game.settings.register(c, k.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Wr() {
  const e = _c(game.settings.get(c, k.executionMode)), t = Va(game.settings.get(c, k.systemCardMode)), n = Ha(game.settings.get(c, k.damageResolutionMode)), r = Et();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: ja()
  };
}
function Rc() {
  return Va(game.settings.get(c, k.systemCardMode));
}
function kc() {
  return Ha(game.settings.get(c, k.damageResolutionMode));
}
function Et() {
  return mc(game.settings.get(c, k.resistanceGateMode));
}
function ja() {
  return game.settings.get(c, k.ritualCastingCheckEnabled) === !0;
}
async function J(e) {
  await game.settings.set(c, k.executionMode, e);
}
function Va(e) {
  return yc.includes(e) ? e : Ga;
}
function Ha(e) {
  return Ac.includes(e) ? e : za;
}
function wc(e) {
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
const Ec = [
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
function Cc(e) {
  return {
    phases() {
      return Ec;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Kt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Fl(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Kr(e, t, n);
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
      if (!Lc(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Sc(n) ?? Kt("Nenhum ator encontrado para executar automação do item.");
      r && await Kr(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Kt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Ml(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(xa);
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
async function Kr(e, t, n) {
  const r = wt(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ua(),
    item: n,
    targets: ir()
  });
  if (!o.ok) {
    Ic(o.error);
    return;
  }
  f.info("Automação executada com sucesso.", oe(o.value.context));
}
function Ic(e) {
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
function Kt(e) {
  const t = je.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Sc(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Lc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Dc(e) {
  const t = Wl(e), n = Bl(e), r = sc(e), o = Cc(e), a = Ql(), s = wc(e);
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
    async spendSelectedActorPE(l) {
      await t.spendPE(l);
    }
  };
}
function vc(e) {
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
      const r = Yr();
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
      return Pc(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Yr();
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
      return Nc(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Yr() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function Pc(e) {
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
function Nc(e) {
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
function xc(e) {
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
    conditions: vc(e.conditions),
    debug: Dc(e)
  }, n = globalThis;
  return n[c] = t, n.ParanormalToolkit = t, t;
}
class Qr {
  static isSupportedSystem() {
    return game.system.id === yl;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Oc() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ge(t.id),
    actorId: ge(t.actor?.id),
    sceneId: ge(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Wa() {
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
function Mc(e, t = Wa()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Fc(e) {
  if (!qc(e)) return null;
  const t = e.getFlag(c, "workflow");
  return Bc(t) ? t : null;
}
function Uc() {
  return `flags.${c}.workflow`;
}
function Zr(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), n = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || n !== void 0;
}
function Xr(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return _n(t) || _n(n);
}
function Bc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function qc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ge(e) {
  return _n(e) ? e : null;
}
function _n(e) {
  return typeof e == "string" && e.length > 0;
}
function Gc() {
  const e = (t, n) => {
    zc(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function zc(e, t) {
  const n = Fc(e);
  if (!n || n.targets.length === 0) return;
  const r = Vc(t);
  if (!r || r.querySelector(`.${c}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(jc(n));
}
function jc(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Jr("Origem", e.source.name)), t.append(Jr("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Jr(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${c}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function Vc(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Hc() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!Wc(r) || !Kc(e) || Zr(e) || Zr(t)) return;
    const o = Oc();
    if (o.length === 0 || !Xr(e) && !Xr(t)) return;
    const a = Wa();
    e.updateSource({
      [Uc()]: Mc(o, a)
    }), f.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Wc(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Kc(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let eo = !1, Yt = !1, Qt = !1, Je = null;
const Yc = 1e3, Qc = 750, Zc = 1e3;
function Xc(e) {
  eo || (Hooks.on("combatTurnChange", (t) => {
    eu(e, to(t));
  }), Hooks.on("deleteCombat", (t) => {
    tu(e, to(t));
  }), eo = !0, Jc(e));
}
function Jc(e) {
  Ct() && (Yt || (Yt = !0, globalThis.setTimeout(() => {
    Yt = !1, lr(e, "ready");
  }, Yc)));
}
function eu(e, t) {
  Ct() && t && (Je && globalThis.clearTimeout(Je), Je = globalThis.setTimeout(() => {
    Je = null, lr(e, "combat-turn-change", t);
  }, Qc));
}
function tu(e, t) {
  Ct() && t && (Qt || (Qt = !0, globalThis.setTimeout(() => {
    Qt = !1, lr(e, "combat-deleted", t);
  }, Zc)));
}
async function lr(e, t, n) {
  if (Ct())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && f.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const o of r.failures)
        f.warn(o.message);
    } catch (r) {
      f.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function Ct() {
  return game.user?.isGM === !0;
}
function to(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Ka = {
  enabled: "dice.animations.enabled"
};
function nu() {
  game.settings.register(c, Ka.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function ru() {
  return {
    enabled: game.settings.get(c, Ka.enabled) === !0
  };
}
const It = "chatCard", no = "data-paranormal-toolkit-prompt-id", i = `${c}-item-use-prompt`, ou = `.${i}__title`, Ya = `.${i}__header`, au = `.${i}__roll-card`, iu = `.${i}__roll-meta`, su = `.${i}__roll-meta-pill`, cr = `.${i}__resistance`, lu = `.${i}__resistance-header`, Qa = `.${i}__resistance-description`, St = `.${i}__resistance-roll-button`, Za = `.${i}__resistance-roll-result`, ro = `${i}__resistance-content`, Xa = `.${i}__workflow-section`, Ja = `.${i}__workflow-roll`, ur = `${i}__workflow-roll--dice-open`, dr = `.${i}__workflow-roll-formula`, mr = `${i}__workflow-roll-formula--toggle`, Lt = `.${i}__workflow-dice-tray`, cu = `.${i}__roll-detail-toggle`, uu = `.${i}__roll-detail-list`, du = `.${i}__ritual-element-badge`, mu = `.${i}__ritual-metadata`, fu = "casting-backlash", pu = "data-paranormal-toolkit-action-section", gu = "data-paranormal-toolkit-prompt-id", hu = "data-paranormal-toolkit-pending-id", oo = "data-paranormal-toolkit-casting-backlash-enhanced", ao = `.${i}`, bu = `.${i}__workflow-section--casting`, _u = `.${i}__workflow-section-header`, yu = `.${i}__workflow-notes`, Au = `[${pu}="${fu}"]`, io = `${i}__workflow-section-title-row`, Tu = `${i}__workflow-section-header--casting-backlash`, ei = `${i}__casting-backlash-button`;
function $u(e) {
  for (const t of Ru(e))
    ku(t), Su(t);
}
function Ru(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(ao) && t.add(e);
  for (const n of e.querySelectorAll(ao))
    t.add(n);
  return Array.from(t);
}
function ku(e) {
  const t = e.querySelector(Au);
  if (!t) return;
  const n = wu(t);
  if (!n) return;
  const r = e.querySelector(`${bu} ${_u}`);
  r && (r.classList.add(Tu), Eu(r), Cu(n), r.append(n), t.remove());
}
function wu(e) {
  return e.querySelector(
    `button[${hu}], button[${gu}]`
  );
}
function Eu(e) {
  const t = e.querySelector(`:scope > .${io}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(io);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(ei) || n.append(o));
  return n;
}
function Cu(e) {
  if (e.getAttribute(oo) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Iu(t, e.disabled);
  e.classList.add(ei), e.setAttribute(oo, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Iu(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Su(e) {
  for (const t of e.querySelectorAll(yu)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Lu(e) {
  for (const t of Array.from(e.querySelectorAll(Xa)))
    for (const n of Array.from(t.querySelectorAll(`${cu}, ${uu}`)))
      n.remove();
}
const Ne = "data-paranormal-toolkit-prompt-id", Du = "data-paranormal-toolkit-resistance-roll-result", vu = "Conjuração DT";
function Pu(e) {
  const t = e.querySelector(St)?.getAttribute(Du), n = Be(t);
  if (n !== null) return n;
  const r = e.querySelector(Za)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Be(o?.[1] ?? null);
}
function ti(e) {
  const t = Uu(e), n = Ou(t);
  if (n !== null) return n;
  const r = Mu(t);
  return r !== null ? r : Fu(e);
}
function Nu(e) {
  const t = e.getAttribute(Ne);
  if (!t) return null;
  const n = ni(e), r = ri(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Dt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function W(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function xu(e) {
  return W(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Ou(e) {
  const t = qu(e);
  return t.length === 0 ? null : Be(Gu(t, vu));
}
function Mu(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : so(r, ["system", "ritual", "DT"]) ?? so(r, ["system", "ritual", "dt"]);
}
function Fu(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Be(n?.[1] ?? null);
}
function Uu(e) {
  const t = Bu(e);
  if (!t) return null;
  const n = ni(e), r = ri(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => Dt(a) ? a.pendingId === t : !1) ?? null;
}
function Bu(e) {
  return (e.closest(`[${Ne}]`) ?? e.querySelector(`[${Ne}]`) ?? e.parentElement?.querySelector(`[${Ne}]`) ?? null)?.getAttribute(Ne) ?? null;
}
function ni(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return zu(o) ? o : null;
}
function ri(e) {
  const t = e?.getFlag?.(c, It);
  return Dt(t) ? t : null;
}
function qu(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Gu(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function so(e, t) {
  let n = e;
  for (const r of t) {
    if (!Dt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Be(typeof n == "string" ? n : null);
}
function Be(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function zu(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Dt(e) {
  return !!(e && typeof e == "object");
}
const ju = `.${i}__actions`, fr = `.${i}__actions-title`, ft = `.${i}__button`, Vu = "data-paranormal-toolkit-action-section", Hu = `${i}__button--executed`, Wu = "data-paranormal-toolkit-executed-label";
function oi(e) {
  return W(e.querySelector(fr)?.textContent);
}
function Ku(e, t) {
  const n = e.querySelector(fr);
  n && (n.textContent = t);
}
function vt(e, t) {
  const n = W(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const o = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return W(o) === n;
  }) ?? null;
}
function pr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function se(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const Yu = {
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
}, Qu = {
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
function ai(e) {
  return li(e, Yu, !1);
}
function ii(e) {
  return li(e, Qu, !0);
}
function He(e) {
  return e.kind === "waiting-resistance";
}
function si(e) {
  return e.kind === "resisted";
}
function li(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? De("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? De("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : sr(e.resistanceGateMode, e.resistanceState) ? De(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? De("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : De("available", !0, r.available, r.availableCompact, null);
}
function De(e, t, n, r, o) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: o
  };
}
function ci(e) {
  return di({
    hasResistance: !!e.querySelector(cr),
    difficulty: ti(e),
    resistanceTotal: Pu(e)
  });
}
function Zu(e) {
  if (!e.hasResistance || e.difficulty === null)
    return di({
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
function di(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: fc(e)
  };
}
const Xu = "data-paranormal-toolkit-damage-resolution-state", lo = "data-paranormal-toolkit-damage-icon-enhanced", mi = "data-paranormal-toolkit-damage-original-label", Ju = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function ed(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Ku(t, "Aplicar dano"), td(e, t);
}
function td(e, t) {
  const n = Array.from(t.querySelectorAll(ft)), r = co(n, "normal"), o = co(n, "half");
  if (!r || !o) {
    t.classList.add(`${i}__actions--compact`);
    return;
  }
  uo(r, "normal"), uo(o, "half");
  const a = ad(), s = id(), l = nd(e), u = ai({
    resistanceGateMode: s,
    resistanceState: l
  }), d = He(u);
  if (t.classList.toggle(`${i}__actions--assisted`, a === "assisted"), t.classList.toggle(`${i}__actions--manual`, a !== "assisted"), a !== "assisted") {
    V(r, !0), V(o, !0), ee(r, !d, "normal", u.label), ee(o, !d, "half", u.label), et(
      t,
      d ? "pending" : "manual",
      d ? u.reason ?? "Role resistência para aplicar dano." : null
    );
    return;
  }
  if (l.kind === "none") {
    V(r, !0), V(o, !0), ee(r, !0, "normal"), ee(o, !0, "half"), et(t, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (l.kind === "pending") {
    V(r, !0), V(o, !1), ee(r, !d, "normal", u.label), et(
      t,
      "pending",
      d ? u.reason ?? "Role resistência para aplicar dano." : null
    );
    return;
  }
  const m = l.kind === "succeeded";
  V(r, !m), V(o, m), ee(r, !m, "normal"), ee(o, m, "half"), et(
    t,
    m ? "resisted" : "failed",
    m ? `Resistiu: ${l.total} vs DT ${l.difficulty}.` : `Falhou: ${l.total} vs DT ${l.difficulty}.`
  );
}
function nd(e) {
  return ci(e).state;
}
function co(e, t) {
  const n = Ju[t];
  return e.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function uo(e, t) {
  if (e.getAttribute(lo) === "true") return;
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
  ), e.setAttribute(lo, "true"), e.setAttribute(mi, n), e.setAttribute("aria-label", n), e.replaceChildren(r, se(n));
}
function V(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function ee(e, t, n, r = "Role resistência") {
  if (!e.textContent?.trim().startsWith("✓")) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(se(r));
      return;
    }
    e.removeAttribute("aria-disabled"), rd(e, n);
  }
}
function rd(e, t) {
  const n = e.getAttribute(mi) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(od(t), se(n)));
}
function od(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function et(e, t, n) {
  e.setAttribute(Xu, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${i}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(fr)?.after(o);
}
function ad() {
  try {
    return kc();
  } catch {
    return "assisted";
  }
}
function id() {
  try {
    return Et();
  } catch {
    return "strict";
  }
}
const qe = "data-paranormal-toolkit-effect-icon-enhanced", $e = "data-paranormal-toolkit-effect-action-compacted", Pt = "data-paranormal-toolkit-effect-resistance-gate", gr = "data-paranormal-toolkit-effect-section", hr = "data-paranormal-toolkit-effect-label";
function sd(e) {
  return e.querySelector(`[${gr}="true"]`);
}
function ld(e) {
  const t = ud(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? dd(), r = Ad(n, e.sourceActions, t);
  return r && n.setAttribute(hr, r), md(n, t, r), _d(e.rollCard, n, e.after ?? e.fallbackAfter), yd(e.sourceActions, n), n;
}
function cd(e, t) {
  const n = t.querySelector(ft);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (pi(n, r)) {
    $d(n);
    return;
  }
  const o = hi(t, n, r), a = Rd(e), s = ii({
    resistanceGateMode: Cd(),
    resistanceState: a
  });
  if (He(s)) {
    kd(n, s.label);
    return;
  }
  if (si(s)) {
    wd(n, s.compactLabel);
    return;
  }
  Ed(n), gi(n, o);
}
function ud(e) {
  return e.sourceActions?.querySelector(ft) ?? e.existingSection?.querySelector(ft) ?? null;
}
function dd() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(gr, "true"), e;
}
function md(e, t, n) {
  e.setAttribute(gr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = fd(e), o = pd(r);
  o.textContent = "Efeito";
  const a = gd(e, r), s = hd(a);
  s.textContent = Id(n ?? hi(e, t, t.textContent?.trim() ?? ""));
  const l = bd(a);
  t.parentElement !== l && l.append(t);
  const u = t.textContent?.trim() ?? "";
  !pi(t, u) && !Td(t, u) && gi(t, n ?? u);
}
function fd(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function pd(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function gd(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function hd(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function bd(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function _d(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function yd(e, t) {
  !e || e === t || e.remove();
}
function Ad(e, t, n) {
  const r = e.getAttribute(hr);
  if (r && r.trim().length > 0) return r.trim();
  const o = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return o || fi(n, n.textContent?.trim() ?? "");
}
function fi(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && W(n) !== "efeito aplicado") return n;
  const r = Nu(e);
  if (r) return r;
  const o = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && W(o) !== "aplicado" ? o : null;
}
function pi(e, t) {
  return e.classList.contains(Hu) || W(t).includes("aplicado");
}
function Td(e, t) {
  const n = e.getAttribute(Pt);
  if (n === "pending" || n === "resisted") return !0;
  const r = xu(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function gi(e, t) {
  e.getAttribute($e) === "true" && e.getAttribute(qe) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute($e, "true"), e.setAttribute(qe, "true"), e.setAttribute(Wu, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    pr("✦", `${i}__button-icon--effect`),
    se("Aplicar")
  ));
}
function $d(e) {
  e.getAttribute($e) === "true" && W(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute($e, "true"), e.setAttribute(qe, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    pr("✓", `${i}__button-icon--effect-applied`),
    se("Aplicado")
  ));
}
function hi(e, t, n) {
  const r = e.getAttribute(hr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : fi(t, n) ?? n;
}
function Rd(e) {
  return ci(e).state;
}
function kd(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute($e), e.removeAttribute(qe), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Pt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(se(t));
}
function wd(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute($e), e.removeAttribute(qe), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Pt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    pr("✓", `${i}__button-icon--effect-resisted`),
    se(t)
  );
}
function Ed(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Pt), e.removeAttribute("aria-disabled");
}
function Cd() {
  try {
    return Et();
  } catch {
    return "strict";
  }
}
function Id(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const Sd = {
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
}, Ld = new Set(
  Object.values(Sd)
), Dd = {
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
function vd(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = Pd(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Dd[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Ld.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function bi(e) {
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
function Pd(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class _i {
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
    const s = [], l = /* @__PURE__ */ new Set();
    let u = null;
    for (const [d, m] of t.instances.entries()) {
      const y = Nd(m, d);
      if (!y.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const T = vd(m.damageType);
      if (!T.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(m.damageType)}.`,
          instance: m,
          damageType: m.damageType
        });
      if (y.amount === 0) {
        s.push(
          xd(y.id, m, T.value)
        );
        continue;
      }
      try {
        const $ = await Promise.resolve(
          a.call(n, y.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const z of Md($.conditions))
          l.add(z);
        const g = Od($.newPV);
        g !== null && (u = g), s.push({
          id: y.id,
          label: m.label ?? bi(T.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: mo($.finalDamage, y.amount),
          blocked: mo($.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: T.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch ($) {
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: m,
          cause: $
        });
      }
    }
    return b({
      actor: n,
      actorId: o,
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
function Nd(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function xd(e, t, n) {
  return {
    id: e,
    label: t.label ?? bi(n),
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
function mo(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Od(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Md(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class br {
  async rollResistance(t) {
    const n = await Ud(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? ae(t.skill),
      roll: n,
      formula: qd(n),
      total: Gd(n),
      diceBreakdown: zd(n)
    };
  }
  getSkillLabel(t) {
    return ae(t);
  }
}
async function Fd(e, t) {
  return new br().rollResistance({ actor: e, skill: t });
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
async function Ud(e, t) {
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
  return Bd(r);
}
function Bd(e) {
  return fo(e) ? e : Array.isArray(e) ? e.find(fo) ?? null : null;
}
function fo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function qd(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Gd(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function zd(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(jd);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function jd(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class yi {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class Ai {
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
function Vd(e, t) {
  const n = Xd(e?.rounds);
  if (!n)
    return po(null);
  const r = e?.anchor ?? Ti(t);
  if (!r)
    return {
      ...po(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Hd(),
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
function Ti(e) {
  const t = Jd();
  if (!t?.id || !$i(t.round)) return null;
  const n = Qd(t), r = Wd(e, n) ?? Yd(t), o = H(r?.id), a = tm(r?.initiative), s = Kd(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: s,
    initiative: a,
    time: em()
  };
}
function Hd() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function po(e) {
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
function Wd(e, t) {
  return e?.id ? t.find((n) => Zd(n) === e.id) ?? null : null;
}
function Kd(e, t, n) {
  const r = H(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return nm(e.turn) ? e.turn : null;
}
function Yd(e) {
  return at(e.combatant) ? e.combatant : null;
}
function Qd(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(at);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(at);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(at);
  }
  return [];
}
function Zd(e) {
  return H(e.actor?.id) ?? H(e.actorId) ?? H(e.token?.actor?.id) ?? H(e.token?.actorId) ?? H(e.document?.actor?.id) ?? H(e.document?.actorId);
}
function Xd(e) {
  return $i(e) ? Math.trunc(e) : null;
}
function Jd() {
  return game.combat ?? null;
}
function em() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function at(e) {
  return !!(e && typeof e == "object");
}
function H(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function tm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function $i(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function nm(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class Ri {
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
    if (!mm(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = Vd(t.duration, r), s = rm(o, t, a), u = t.refreshExisting ?? !0 ? fm(r, o.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(s)), b(go(r, o, u.id ?? null, !1, !0, a));
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
      const m = (await r.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return b(go(r, o, m, !0, !1, a));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = wi(n, r);
    let a = 0;
    try {
      for (const s of o)
        await ho(n, s) === "deleted" && (a += 1);
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
      removed: a
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = hm(), r = [];
    let o = 0, a = 0;
    for (const s of n) {
      const l = _r(s);
      o += l.length;
      for (const u of l) {
        if (!im(u, t)) continue;
        const d = ki(u);
        try {
          await ho(s, u) === "deleted" && (a += 1);
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
      scannedEffects: o,
      removedEffects: a,
      failures: r
    };
  }
}
function rm(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Em(),
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
    duration: om(n.duration),
    start: am(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [c]: r
    }
  };
}
function om(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function am(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: wm(),
    ...e
  };
}
function go(e, t, n, r, o, a) {
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
function im(e, t) {
  const n = ki(e);
  if (!n.conditionId || !sm(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = km();
  return n.durationMode === "combatantTurn" || lm(n) ? um(n, r) : cm(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !D(n.startRound) || !D(n.requestedRounds) || !D(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function sm(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && D(e.requestedRounds);
}
function lm(e) {
  return !!(e.combatDurationApplied && D(e.requestedRounds) && D(e.startRound) && (e.startCombatantId || pt(e.startTurn)));
}
function cm(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function um(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !D(e.startRound) || !D(e.requestedRounds) || !D(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = dm(t);
  return e.startCombatantId ? r === e.startCombatantId : pt(e.startTurn) && pt(t.turn) ? t.turn === e.startTurn : !1;
}
function dm(e) {
  return he(e.combatant?.id);
}
function ki(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: it(e, "conditionId"),
    requestedRounds: bo(e, "requestedRounds") ?? xe(t.value) ?? xe(t.rounds),
    combatDurationApplied: Zt(e, "combatDurationApplied"),
    combatId: it(e, "combatId") ?? he(n.combat) ?? he(t.combat),
    startCombatantId: it(e, "startCombatantId") ?? he(n.combatant),
    startInitiative: Am(e, "startInitiative") ?? Ei(n.initiative),
    startRound: bo(e, "startRound") ?? xe(n.round) ?? xe(t.startRound),
    startTurn: ym(e, "startTurn") ?? yn(n.turn) ?? yn(t.startTurn),
    expiryEvent: Tm(e, "expiryEvent") ?? Ci(t.expiry),
    durationMode: $m(e, "durationMode"),
    deleteOnExpire: Zt(e, "deleteOnExpire"),
    expiresWithCombat: Zt(e, "expiresWithCombat")
  };
}
function mm(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function fm(e, t) {
  return wi(e, t)[0] ?? null;
}
function wi(e, t) {
  return _r(e).filter((n) => _m(n) === t);
}
async function ho(e, t) {
  const n = t.id ?? null, r = n ? pm(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (gm(o)) return "missing";
    throw o;
  }
}
function pm(e, t) {
  return _r(e).find((n) => n.id === t) ?? null;
}
function gm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function hm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      tt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    tt(e, n);
  });
  for (const n of bm())
    tt(e, n.actor), tt(e, n.document?.actor);
  return Array.from(e.values());
}
function tt(e, t) {
  if (!Rm(t)) return;
  const r = he(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function bm() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function _r(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function _m(e) {
  return it(e, "conditionId");
}
function it(e, t) {
  return he(le(e, t));
}
function bo(e, t) {
  return xe(le(e, t));
}
function ym(e, t) {
  return yn(le(e, t));
}
function Am(e, t) {
  return Ei(le(e, t));
}
function Tm(e, t) {
  return Ci(le(e, t));
}
function $m(e, t) {
  const n = le(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Zt(e, t) {
  return le(e, t) === !0;
}
function le(e, t) {
  const n = e.getFlag?.(c, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const o = r[c];
  if (!(!o || typeof o != "object"))
    return o[t];
}
function he(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function xe(e) {
  return D(e) ? Math.trunc(e) : null;
}
function yn(e) {
  return pt(e) ? Math.trunc(e) : null;
}
function Ei(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ci(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Rm(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function km() {
  return game.combat ?? null;
}
function wm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function D(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function pt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Em() {
  return game.user?.id ?? null;
}
const Cm = "icons/svg/downgrade.svg", Im = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function _(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Cm,
    description: Im,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Sm = _({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Lm = _({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Dm = _({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), vm = _({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Pm = _({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Nm = _({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), xm = _({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Om = _({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Mm = _({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Fm = _({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Um = _({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Bm = _({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), qm = _({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Gm = _({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), zm = _({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), jm = _({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Vm = _({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Hm = _({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Wm = _({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Km = _({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), Ym = _({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Qm = _({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Zm = _({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Xm = _({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Jm = _({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), ef = _({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), tf = _({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), nf = _({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), rf = _({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), of = _({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), af = _({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), sf = _({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), lf = _({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), cf = _({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), uf = [
  Sm,
  Lm,
  Dm,
  vm,
  Pm,
  Nm,
  xm,
  Om,
  Mm,
  Fm,
  Um,
  Bm,
  qm,
  Gm,
  zm,
  jm,
  Vm,
  Hm,
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
  lf,
  cf
];
class df {
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
    return Array.from(this.definitions.values()).map(_o);
  }
  get(t) {
    const n = this.lookup.get(yo(t)), r = n ? this.definitions.get(n) : null;
    return r ? b(_o(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = yo(t);
    r && this.lookup.set(r, n);
  }
}
function Ii() {
  return new df(uf);
}
function _o(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function yo(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function mf(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const o = pf(e.formula, e.diceBreakdown ?? null);
  return o && t.append(o), t;
}
function ff(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function pf(e, t) {
  const n = gf(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const o of hf(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-die`), o.active || a.classList.add(`${i}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function gf(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function hf(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ao(e, "highest") : n.includes("kl") ? Ao(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ao(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
const bf = "data-paranormal-toolkit-resistance-skill", _f = "data-paranormal-toolkit-resistance-skill-label", Si = "pending", Li = "success", Di = "failure", vi = "rolled";
function yf(e) {
  const t = wf(e.rollCard, e.damageSection), n = Af(e.rollCard).map((r, o) => {
    const a = Tf(r, o), s = e.resistanceResults.get(a) ?? null;
    return {
      id: a,
      name: r,
      state: Ef(s, t?.difficulty ?? null),
      resistanceResult: s,
      damageApplication: e.damageApplications.get(a) ?? null,
      effectApplication: e.effectApplications.get(a) ?? null
    };
  });
  return n.length <= 1 || !e.damageSection ? null : {
    rollCard: e.rollCard,
    targets: n,
    damage: $f(e.damageSection),
    effect: Rf(e.rollCard, e.effectSection, e.resolveTargetConditionApplication),
    resistance: t
  };
}
function Af(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((o) => o.trim()).filter((o) => o.length > 0 && Pi(o) !== "nenhum alvo") : [];
}
function Tf(e, t) {
  return `${Pi(e)}:${t}`;
}
function $f(e) {
  const t = Cf(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: Sf(e),
    formula: If(e) ?? "—",
    total: t,
    diceBreakdown: ff(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Rf(e, t, n) {
  const r = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, r ?? null);
  return o ? {
    label: r && r.length > 0 ? r : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: kf(o.duration),
    source: o.source,
    originUuid: o.originUuid
  } : null;
}
function kf(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function wf(e, t) {
  const n = t?.querySelector(`.${i}__resistance-description`)?.textContent?.trim(), r = t?.querySelector(St) ?? null, o = r?.getAttribute(bf) ?? null, a = r?.getAttribute(_f) ?? (o ? ae(o) : null);
  return !n && !o ? null : {
    description: n ?? "Resistência do alvo.",
    formula: t?.querySelector(`.${i}__resistance .${i}__workflow-roll-formula`)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: a,
    difficulty: ti(e)
  };
}
function Ef(e, t) {
  return e ? t === null ? vi : e.total >= t ? Li : Di : Si;
}
function Cf(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function If(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Sf(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Pi(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function Lf(e) {
  if (!e) return null;
  const t = e.actorId ? Pf(e.actorId) : null, n = t ? Df(t, e.itemId, e.itemName) : null;
  return n || vf(e.itemId, e.itemName);
}
function Df(e, t, n) {
  const r = e.items;
  if (t) {
    const a = r?.get?.(t);
    if (be(a)) return a;
  }
  const o = gt(n);
  if (o) {
    const a = r?.find?.((s) => be(s) ? gt(s.name) === o : !1);
    if (be(a)) return a;
  }
  return null;
}
function vf(e, t) {
  const n = game.items;
  if (e) {
    const o = n?.get?.(e);
    if (be(o)) return o;
  }
  const r = gt(t);
  if (r) {
    const o = n?.find?.((a) => be(a) ? gt(a.name) === r : !1);
    if (be(o)) return o;
  }
  return null;
}
function Pf(e) {
  const n = game.actors?.get?.(e);
  return Nf(n) ? n : null;
}
function Nf(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function be(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function gt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function yr(e) {
  const t = Xt(e);
  if (!t) return null;
  const n = xf().filter((a) => Xt(Of(a)) === t).map((a) => Ni(a)).find(Fe) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => Fe(a) && Xt(a.name) === t);
  return Fe(o) ? o : null;
}
function xf() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function Of(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ni(e)?.name ?? null;
}
function Ni(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Fe(t)) return t;
  const n = e.document?.actor;
  return Fe(n) ? n : null;
}
function Fe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Xt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Mf(e) {
  const t = qf();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: Ff(e)
  });
}
function Ff(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${st(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = Uf(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${st(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${st(e.actorName)}</strong></p>
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
function Uf(e) {
  const t = Bf(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${st(o)}</li>`;
}
function Bf(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = To(n?.value);
  return r === null ? null : {
    value: r,
    max: To(n?.max)
  };
}
function To(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function qf() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function st(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function Gf(e) {
  await Mf(zf(e));
}
function zf(e) {
  if (jf(e)) return e;
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
function jf(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
class Vf {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return sr(t.resistanceGateMode, t.resistanceState) ? {
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
class Hf {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return sr(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.resistanceState.kind === "succeeded" ? this.block(t, "resistance-succeeded", "Este alvo resistiu ao efeito.") : this.conditions.applyCondition({
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
class Wf {
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
const nt = "data-paranormal-toolkit-prompt-id", xi = "multiTargetResistanceResults", Oi = "multiTargetDamageApplications", Mi = "multiTargetEffectApplications";
function Kf(e) {
  const t = /* @__PURE__ */ new Map(), r = Nt(e)?.[xi];
  if (!P(r)) return t;
  for (const [o, a] of Object.entries(r))
    tp(a) && a.targetId === o && t.set(o, a);
  return t;
}
async function Yf(e, t) {
  await Ar(e, xi, t.targetId, t);
}
function Qf(e) {
  const t = /* @__PURE__ */ new Map(), r = Nt(e)?.[Oi];
  if (!P(r)) return t;
  for (const [o, a] of Object.entries(r))
    np(a) && a.targetId === o && t.set(o, a);
  return t;
}
async function Zf(e, t) {
  await Ar(
    e,
    Oi,
    t.targetId,
    t
  );
}
function Xf(e) {
  const t = /* @__PURE__ */ new Map(), r = Nt(e)?.[Mi];
  if (!P(r)) return t;
  for (const [o, a] of Object.entries(r))
    op(a) && a.targetId === o && t.set(o, a);
  return t;
}
async function Jf(e, t) {
  await Ar(
    e,
    Mi,
    t.targetId,
    t
  );
}
function ep(e) {
  const t = Nt(e);
  return t ? {
    actorId: Jt(t.actorId),
    itemId: Jt(t.itemId),
    itemName: Jt(t.itemName)
  } : null;
}
async function Ar(e, t, n, r) {
  const o = Fi(e);
  if (!o) return;
  const a = Ui(e), s = Bi(a);
  if (!a || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const u = s.prompts.map((d) => {
    if (!P(d) || d.pendingId !== o) return d;
    const m = P(d[t]) ? d[t] : {};
    return l = !0, {
      ...d,
      [t]: {
        ...m,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(a.setFlag?.(c, It, {
    ...s,
    prompts: u
  }));
}
function Nt(e) {
  const t = Fi(e);
  if (!t) return null;
  const n = Ui(e), r = Bi(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => P(a) ? a.pendingId === t : !1) ?? null;
}
function Fi(e) {
  return (e.closest(`[${nt}]`) ?? e.querySelector(`[${nt}]`) ?? e.parentElement?.querySelector(`[${nt}]`) ?? null)?.getAttribute(nt) ?? null;
}
function Ui(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return ap(o) ? o : null;
}
function Bi(e) {
  const t = e?.getFlag?.(c, It);
  return P(t) ? t : null;
}
function tp(e) {
  return P(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function np(e) {
  return P(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && rp(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.finalDamage == "number" && Number.isFinite(e.finalDamage) && typeof e.blocked == "number" && Number.isFinite(e.blocked) && typeof e.appliedAt == "string" : !1;
}
function rp(e) {
  return e === "normal" || e === "half";
}
function op(e) {
  return P(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function Jt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ap(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function P(e) {
  return !!(e && typeof e == "object");
}
const ip = "data-paranormal-toolkit-resistance-skill", sp = "data-paranormal-toolkit-resistance-skill-label", An = "data-paranormal-toolkit-multi-target-section", Tr = "data-paranormal-toolkit-multi-target-damage-info", qi = "data-paranormal-toolkit-multi-target-effect-info", Gi = "data-paranormal-toolkit-multi-target-toggle", zi = "data-paranormal-toolkit-multi-target-details", L = "data-paranormal-toolkit-multi-target-target", lp = "data-paranormal-toolkit-multi-target-state", Tn = "data-paranormal-toolkit-multi-target-roll-total", $n = "data-paranormal-toolkit-multi-target-roll-formula", lt = "data-paranormal-toolkit-multi-target-roll-dice", Rn = "data-paranormal-toolkit-multi-target-roll-skill", kn = "data-paranormal-toolkit-multi-target-roll-skill-label", wn = "data-paranormal-toolkit-multi-target-roll-target-name", En = "data-paranormal-toolkit-multi-target-roll-rolled-at", Cn = "data-paranormal-toolkit-multi-target-damage-mode", In = "data-paranormal-toolkit-multi-target-damage-input-amount", Sn = "data-paranormal-toolkit-multi-target-damage-final-amount", Ln = "data-paranormal-toolkit-multi-target-damage-blocked", Dn = "data-paranormal-toolkit-multi-target-damage-target-name", vn = "data-paranormal-toolkit-multi-target-damage-applied-at", Pn = "data-paranormal-toolkit-multi-target-effect-condition-id", Nn = "data-paranormal-toolkit-multi-target-effect-condition-label", xn = "data-paranormal-toolkit-multi-target-effect-effect-id", On = "data-paranormal-toolkit-multi-target-effect-created", Mn = "data-paranormal-toolkit-multi-target-effect-refreshed", Fn = "data-paranormal-toolkit-multi-target-effect-target-name", Un = "data-paranormal-toolkit-multi-target-effect-applied-at", cp = new Ri(Ii()), up = new yi(new _i()), dp = new Ai(new br()), mp = new Wf(dp), fp = new Vf(up), pp = new Hf(cp), gp = Si, ce = Li, xt = Di, hp = vi;
function bp(e) {
  const t = ji(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), Ep(e);
  const n = Cp(e.rollCard);
  Sp(n, t.damage), Dp(e.rollCard, n);
  const r = vp(e.rollCard);
  if (Hi(r, t), ng(e.rollCard, r, n), t.effect) {
    const o = rg(e.rollCard);
    og(o, t.effect), ag(e.rollCard, o, r);
  } else
    rs(e.rollCard)?.remove();
  return !0;
}
function ji(e) {
  return yf({
    ...e,
    resistanceResults: Ap(e.rollCard),
    damageApplications: Tp(e.rollCard),
    effectApplications: $p(e.rollCard),
    resolveTargetConditionApplication: _p
  });
}
function _p(e, t) {
  const n = ep(e), r = Lf(n);
  if (!r) return null;
  const o = wt(r);
  if (!o.ok) return null;
  const a = (o.value.conditionApplications ?? []).filter((l) => l.actor === "target");
  if (a.length === 0) return null;
  const s = yp(a, t);
  return s ? {
    conditionId: s.conditionId,
    conditionLabel: s.label ?? s.conditionId,
    duration: s.duration ?? null,
    source: s.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null
  } : null;
}
function yp(e, t) {
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const n = ko(t);
  return n ? e.find((r) => [
    r.label,
    r.conditionId
  ].some((o) => ko(o) === n)) ?? null : null;
}
function Ap(e) {
  const t = Kf(e);
  for (const [n, r] of wp(e))
    t.set(n, r);
  return t;
}
function Tp(e) {
  const t = Qf(e);
  for (const [n, r] of kp(e))
    t.set(n, r);
  return t;
}
function $p(e) {
  const t = Xf(e);
  for (const [n, r] of Rp(e))
    t.set(n, r);
  return t;
}
function Rp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = n.getAttribute(Pn), a = n.getAttribute(Nn), s = n.getAttribute(xn), l = wo(n.getAttribute(On)), u = wo(n.getAttribute(Mn)), d = n.getAttribute(Fn), m = n.getAttribute(Un);
    !r || !o || !a || l === null || u === null || !d || !m || t.set(r, {
      targetId: r,
      targetName: d,
      conditionId: o,
      conditionLabel: a,
      effectId: s && s.length > 0 ? s : null,
      created: l,
      refreshed: u,
      appliedAt: m
    });
  }
  return t;
}
function kp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = n.getAttribute(Cn), a = ct(n.getAttribute(In)), s = ct(n.getAttribute(Sn)), l = ct(n.getAttribute(Ln)), u = n.getAttribute(Dn), d = n.getAttribute(vn);
    !r || !lg(o) || a === null || s === null || l === null || !u || !d || t.set(r, {
      targetId: r,
      targetName: u,
      mode: o,
      inputAmount: a,
      finalDamage: s,
      blocked: l,
      appliedAt: d
    });
  }
  return t;
}
function wp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = ct(n.getAttribute(Tn)), a = n.getAttribute($n), s = n.getAttribute(Rn), l = n.getAttribute(kn), u = n.getAttribute(wn), d = n.getAttribute(En);
    !r || o === null || !a || !s || !l || !u || !d || t.set(r, {
      targetId: r,
      targetName: u,
      skill: s,
      skillLabel: l,
      formula: a,
      total: o,
      diceBreakdown: n.getAttribute(lt),
      rolledAt: d
    });
  }
  return t;
}
function Ep(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Cp(e) {
  const t = Ip(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Tr, "true"), n;
}
function Ip(e) {
  return e.querySelector(`[${Tr}="true"]`);
}
function Sp(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-section-description`), o.textContent = t.typeLabel, e.append(o);
  }
  e.append(Vi(t.formula, t.total, t.diceBreakdown));
}
function Vi(e, t, n, r = !1) {
  const o = mf({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Lp(o, r), o;
}
function Lp(e, t) {
  const n = e.querySelector(Lt), r = e.querySelector(dr);
  if (!n || !r) return;
  e.classList.toggle(ur, t), n.hidden = !t, r.classList.add(mr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const o = r.querySelector("i") ?? document.createElement("i");
  o.classList.add("fa-solid"), o.classList.toggle("fa-chevron-down", !t), o.classList.toggle("fa-chevron-up", t), o.setAttribute("aria-hidden", "true"), o.parentElement || r.append(o);
}
function Dp(e, t) {
  const n = vt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function vp(e) {
  const t = e.querySelector(`[${An}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(An, "true"), n;
}
function Hi(e, t) {
  const n = Pp(e);
  e.replaceChildren(Np(t), Op(t, n));
}
function Pp(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${L}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(L)).filter(sg)
  );
}
function Np(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = xp(e.targets), t.append(n, r), t;
}
function xp(e) {
  const t = e.length, n = e.filter((l) => l.state === xt).length, r = e.filter((l) => l.state === ce).length, o = e.filter((l) => l.state === gp).length, a = e.filter((l) => l.state === hp).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), o > 0 && s.push(`${o} ${o === 1 ? "pendente" : "pendentes"}`), a > 0 && s.push(`${a} ${a === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Op(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(Mp(r, e, t.has(r.id)));
  return n;
}
function Mp(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(L, e.id), r.setAttribute(lp, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Wi(r, e.resistanceResult), Ki(r, e.damageApplication), Yi(r, e.effectApplication);
  const o = Fp(e, t, r), a = Xp(e, t);
  return a.hidden = !n, r.addEventListener("click", (s) => {
    Ro(s.target) || $o(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || Ro(s.target) || (s.preventDefault(), $o(r));
  }), r.append(o, a), r;
}
function Wi(e, t) {
  if (!t) {
    e.removeAttribute(Tn), e.removeAttribute($n), e.removeAttribute(lt), e.removeAttribute(Rn), e.removeAttribute(kn), e.removeAttribute(wn), e.removeAttribute(En);
    return;
  }
  e.setAttribute(Tn, String(t.total)), e.setAttribute($n, t.formula), e.setAttribute(Rn, t.skill), e.setAttribute(kn, t.skillLabel), e.setAttribute(wn, t.targetName), e.setAttribute(En, t.rolledAt), t.diceBreakdown ? e.setAttribute(lt, t.diceBreakdown) : e.removeAttribute(lt);
}
function Ki(e, t) {
  if (!t) {
    e.removeAttribute(Cn), e.removeAttribute(In), e.removeAttribute(Sn), e.removeAttribute(Ln), e.removeAttribute(Dn), e.removeAttribute(vn);
    return;
  }
  e.setAttribute(Cn, t.mode), e.setAttribute(In, String(t.inputAmount)), e.setAttribute(Sn, String(t.finalDamage)), e.setAttribute(Ln, String(t.blocked)), e.setAttribute(Dn, t.targetName), e.setAttribute(vn, t.appliedAt);
}
function Yi(e, t) {
  if (!t) {
    e.removeAttribute(Pn), e.removeAttribute(Nn), e.removeAttribute(xn), e.removeAttribute(On), e.removeAttribute(Mn), e.removeAttribute(Fn), e.removeAttribute(Un);
    return;
  }
  e.setAttribute(Pn, t.conditionId), e.setAttribute(Nn, t.conditionLabel), e.setAttribute(xn, t.effectId ?? ""), e.setAttribute(On, String(t.created)), e.setAttribute(Mn, String(t.refreshed)), e.setAttribute(Fn, t.targetName), e.setAttribute(Un, t.appliedAt);
}
function Fp(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const o = document.createElement("div");
  o.classList.add(`${i}__target-summary-main`);
  const a = Up(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Bp(e, t.resistance);
  Gp(l, n, e, t);
  const u = Zp(n);
  o.append(a, s, l, u);
  const d = document.createElement("div");
  return d.classList.add(`${i}__target-summary-actions`), d.append(
    Xi(e, t, "compact"),
    ts(e, t, "compact")
  ), r.append(o, d), r;
}
function Up(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Bp(e, t) {
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", qp(e, t)), t?.skill && (n.setAttribute(ip, t.skill), n.setAttribute(sp, t.skillLabel ?? ae(t.skill))), !t?.skill)
    return n.disabled = !0, n.title = "Resistência não configurada", n.textContent = "—", n;
  if (n.title = e.resistanceResult ? `Rolar ${t.skillLabel ?? t.skill} novamente` : `Rolar ${t.skillLabel ?? t.skill} de ${e.name}`, !e.resistanceResult) {
    const a = document.createElement("i");
    a.classList.add("fa-solid", "fa-dice-d20"), a.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    return s.classList.add(`${i}__target-resistance-fallback`), s.textContent = "d20", n.append(a, s), n;
  }
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const o = document.createElement("span");
  return o.classList.add(`${i}__target-resistance-mark`), o.setAttribute("aria-hidden", "true"), o.textContent = e.state === ce ? "✓" : e.state === xt ? "✕" : "", n.append(r, o), n;
}
function qp(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === ce ? "sucesso" : e.state === xt ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Gp(e, t, n, r) {
  e.addEventListener("click", (o) => {
    o.stopPropagation(), zp(t, e, n, r);
  });
}
async function zp(e, t, n, r) {
  const o = r.resistance, a = o?.skill, s = o?.skillLabel ?? (a ? ae(a) : "Resistência");
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = yr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const u = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await mp.execute({ actor: l, skill: a, skillLabel: s });
    await ig(d.roll);
    const m = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      skill: a,
      skillLabel: s,
      formula: d.formula,
      total: d.total,
      diceBreakdown: d.diceBreakdown,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Wi(e, m);
    try {
      await Yf(r.rollCard, m);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", y);
    }
    $r(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = u;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function $r(e) {
  const t = e.closest(`[${An}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = ji({
    rollCard: n,
    damageSection: jp(n) ?? vt(n, "Dano"),
    effectSection: Vp(n)
  });
  r && Hi(t, r);
}
function jp(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Tr) !== "true") ?? null;
}
function Vp(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Qi(e, t) {
  return He(Zi(e, t));
}
function Zi(e, t) {
  return ai({
    resistanceGateMode: Mt(),
    resistanceState: Ot(e, t),
    alreadyApplied: !!e.damageApplication,
    unavailable: !t.damage
  });
}
function Hp(e, t) {
  return ii({
    resistanceGateMode: Mt(),
    resistanceState: Ot(e, t),
    alreadyApplied: !!e.effectApplication,
    unavailable: !t.effect
  });
}
function Ot(e, t) {
  return Zu({
    hasResistance: !!t.resistance,
    difficulty: t.resistance?.difficulty ?? null,
    total: e.resistanceResult?.total ?? null,
    status: Wp(e)
  }).state;
}
function Wp(e) {
  return e.state === ce ? "succeeded" : e.state === xt ? "failed" : "pending";
}
function Mt() {
  try {
    return Et();
  } catch {
    return "strict";
  }
}
function Xi(e, t, n) {
  if (e.damageApplication)
    return O(
      "✓",
      Kp(e.damageApplication, n),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = Zi(e, t);
  if (He(r))
    return O(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const o = Ji(e), a = es(o, t.damage);
  if (a === null)
    return O(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = o === "half" ? n === "full" ? t.damage.halfLabel ?? `Metade: ${a} PV` : t.damage.halfCompactLabel ?? `½ ${a} PV` : n === "full" ? t.damage.normalLabel : t.damage.normalCompactLabel, l = o === "half" ? "🛡️" : "⚡", u = o === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, d = O(
    l,
    s,
    [`${i}__target-action--damage`, u],
    !1
  );
  return d.title = `Aplicar ${s} em ${e.name}`, d.setAttribute("aria-label", d.title), d.addEventListener("click", (m) => {
    m.stopPropagation();
    const y = d.closest(`[${L}]`);
    y && Yp(y, d, e, t);
  }), d;
}
function Kp(e, t) {
  const n = e.blocked > 0 ? ` (RD ${e.blocked})` : "";
  return t === "compact" ? `${e.finalDamage} PV` : `Dano aplicado: ${e.finalDamage} PV${n}`;
}
function Ji(e) {
  return e.state === ce ? "half" : "normal";
}
function es(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Yp(e, t, n, r) {
  if (n.damageApplication) return;
  if (Qi(n, r)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const o = Ji(n), a = es(o, r.damage);
  if (a === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const s = yr(n.name);
  if (!s) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const l = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await fp.execute({
      actor: s,
      amount: a,
      damageType: r.damage.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Mt(),
      resistanceState: Ot(n, r)
    });
    if (!u.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${u.error.message}`), t.innerHTML = l;
      return;
    }
    const d = {
      targetId: n.id,
      targetName: s.name ?? n.name,
      mode: o,
      inputAmount: a,
      finalDamage: u.value.totalFinalDamage,
      blocked: u.value.totalBlocked,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Ki(e, d);
    try {
      await Zf(r.rollCard, d);
    } catch (m) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", m);
    }
    try {
      await Gf({
        actor: u.value.actor,
        finalDamage: u.value.totalFinalDamage,
        blocked: u.value.totalBlocked,
        targetName: d.targetName
      });
    } catch (m) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", m);
    }
    $r(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function ts(e, t, n) {
  const r = Hp(e, t);
  if (!t.effect)
    return O(
      "✦",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--disabled`],
      !0
    );
  if (e.effectApplication)
    return O(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (He(r))
    return O(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (si(r))
    return O(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  const o = O(
    "✦",
    n === "full" ? `Aplicar ${t.effect.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${t.effect.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (a) => {
    a.stopPropagation();
    const s = o.closest(`[${L}]`);
    s && Qp(s, o, e, t);
  }), o;
}
async function Qp(e, t, n, r) {
  if (n.effectApplication) return;
  if (Qi(n, r)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar efeito.");
    return;
  }
  if (n.state === ce) {
    ui.notifications?.warn?.("Paranormal Toolkit: este alvo resistiu ao efeito.");
    return;
  }
  const o = r.effect;
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui efeito estruturado para aplicar.");
    return;
  }
  const a = yr(n.name);
  if (!a) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await pp.execute({
      actor: a,
      conditionId: o.conditionId,
      duration: o.duration,
      originUuid: o.originUuid,
      source: o.source,
      resistanceGateMode: Mt(),
      resistanceState: Ot(n, r)
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
    Yi(e, u);
    try {
      await Jf(r.rollCard, u);
    } catch (d) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", d);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), $r(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function O(e, t, n, r) {
  const o = document.createElement("button");
  o.type = "button", o.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), o.disabled = r;
  const a = document.createElement("span");
  a.classList.add(`${i}__target-action-icon`), a.setAttribute("aria-hidden", "true"), a.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, o.append(a, s), o;
}
function Zp(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Gi, "true"), t.setAttribute("aria-hidden", "true"), ns(e, t), t;
}
function $o(e) {
  const t = e.querySelector(`[${zi}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Gi}="true"]`);
  r && ns(e, r);
}
function ns(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function Ro(e) {
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
function Xp(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(zi, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const a = document.createElement("span");
  a.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(o, a);
  const s = Jp(e, t.resistance);
  s && r.append(s);
  const l = eg(e, t.resistance), u = tg(e, t);
  return n.append(r, l, u), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Jp(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === ce ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function eg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", o = e.resistanceResult?.total ?? null, a = Vi(
    r,
    o,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(a), n;
}
function tg(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), n.append(
    Xi(e, t, "full"),
    ts(e, t, "full")
  ), n;
}
function ng(e, t, n) {
  const r = n.parentElement === e ? n : vt(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function rg(e) {
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
function og(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  r.textContent = "Efeito", n.append(r);
  const o = document.createElement("div");
  o.classList.add(`${i}__effect-info-body`);
  const a = document.createElement("span");
  a.classList.add(`${i}__effect-info-label`), a.textContent = t.label;
  const s = document.createElement("span");
  s.classList.add(`${i}__effect-info-hint`), s.textContent = "Aplicação por alvo", o.append(a, s), e.append(n, o);
}
function ag(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function ko(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function ig(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function sg(e) {
  return typeof e == "string" && e.length > 0;
}
function lg(e) {
  return e === "normal" || e === "half";
}
function wo(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function ct(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const _e = "data-paranormal-toolkit-prompt-id", cg = "data-paranormal-toolkit-card-layout-normalized", Eo = "data-paranormal-toolkit-card-layout-refresh-bound", ug = "apply-damage", dg = "data-paranormal-toolkit-multi-target-damage-info", os = [0, 80, 180, 400, 900, 1600, 3e3], Co = /* @__PURE__ */ new WeakSet();
function mg(e) {
  as(e), fg(e);
}
function as(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    ss(is(t));
}
function fg(e) {
  if (!Co.has(e)) {
    Co.add(e);
    for (const t of os)
      globalThis.setTimeout(() => {
        as(e);
      }, t);
  }
}
function is(e) {
  return {
    rollCard: e,
    damageSection: pg(e),
    resistance: e.querySelector(cr),
    damageActions: gg(e),
    effectActionSource: hg(e),
    effectSection: sd(e)
  };
}
function ss(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: o,
    effectActionSource: a,
    effectSection: s
  } = e;
  t.setAttribute(cg, "true"), t.classList.add(`${i}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), ed(t, o));
  const l = ld({
    rollCard: t,
    existingSection: s,
    sourceActions: a,
    after: n,
    fallbackAfter: vt(t, "Conjuração")
  });
  l && cd(t, l), bp({
    rollCard: t,
    damageSection: n,
    effectSection: l ?? s
  }), Rg(t);
}
function pg(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(dg) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function gg(e) {
  const t = bg(e);
  return t.find((n) => n.getAttribute(Vu) === ug) ?? t.find((n) => oi(n) === "aplicar danos") ?? null;
}
function hg(e) {
  const t = ls(e), n = Io(t);
  return n || Io(_g(e));
}
function Io(e) {
  return e.find((t) => {
    const n = oi(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function bg(e) {
  const t = ls(e);
  return t.length > 0 ? t : Rr(e);
}
function ls(e) {
  const t = Tg(e);
  return t ? Rr(e).filter((n) => Ag(n, t)) : [];
}
function _g(e) {
  const t = cs(e);
  if (!t) return [];
  const n = yg(e, t);
  return Rr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => us(e, r)).filter((r) => !n || $g(r, n));
}
function Rr(e) {
  const t = cs(e);
  return t ? Array.from(t.querySelectorAll(ju)) : [];
}
function cs(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function yg(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && us(e, n)) ?? null;
}
function Ag(e, t) {
  return e.getAttribute(_e) === t ? !0 : Array.from(e.querySelectorAll(`[${_e}]`)).some((n) => n.getAttribute(_e) === t);
}
function Tg(e) {
  return e.getAttribute(_e) ?? e.querySelector(`[${_e}]`)?.getAttribute(_e) ?? null;
}
function us(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function $g(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Rg(e) {
  const t = e.querySelector(St);
  t && t.getAttribute(Eo) !== "true" && (t.setAttribute(Eo, "true"), t.addEventListener("click", () => {
    for (const n of os)
      globalThis.setTimeout(() => {
        ss(is(e));
      }, n);
  }));
}
const kg = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function wg(e) {
  for (const t of Array.from(e.querySelectorAll(cr)))
    Eg(t);
  mg(e);
}
function Eg(e) {
  const t = e.querySelector(lu), n = e.querySelector(Qa), r = e.querySelector(St), o = e.querySelector(Za);
  if (!r || !t && !n && !o) return;
  const a = Cg(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && (o.parentElement !== e && !r.contains(o) && e.append(o), Ig(o)), r.parentElement !== e && e.append(r);
}
function Cg(e, t) {
  const n = e.querySelector(`.${ro}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(ro), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function Ig(e) {
  const t = Sg(e.textContent ?? "");
  t && (e.setAttribute(kg, "true"), e.replaceChildren(vg(t)));
}
function Sg(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, a = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: u } = Lg(r ?? "");
  return l ? {
    skillLabel: a,
    formula: l,
    total: Math.trunc(s),
    diceValues: u
  } : null;
}
function Lg(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Dg(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Dg(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function vg(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Pg(e);
  return r && t.append(r), t;
}
function Pg(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of Ng(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Ng(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? So(e, "highest") : n.includes("kl") ? So(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function So(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Lo(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function kr() {
  const e = globalThis.game;
  return Ft(e) ? e : null;
}
function v(e, t) {
  const n = xg(e, t);
  return ut(n);
}
function xg(e, t) {
  return t.split(".").reduce((n, r) => Ft(n) ? n[r] : null, e);
}
function Og(e, t) {
  const n = e.indexOf(":");
  return n < 0 || Ge(e.slice(0, n)) !== Ge(t) ? null : we(e.slice(n + 1));
}
function ut(e) {
  return typeof e == "string" ? we(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Ft(e) {
  return !!e && typeof e == "object";
}
function Mg(e) {
  return typeof e == "string";
}
function Ut(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function we(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function Ge(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Bn(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function K(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function ds(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Fg(e) {
  for (const t of Array.from(e.querySelectorAll(au))) {
    const n = Vg(t);
    Ug(t), n && (Bg(t, n), qg(t, n));
  }
}
function Ug(e) {
  for (const t of Array.from(e.querySelectorAll(iu)))
    t.remove();
}
function Bg(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(Ya) ?? null, o = r?.querySelector(ou) ?? null, a = r ?? e, s = a.querySelector(du);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = lh(t.elementTone), l.textContent = sh(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", l);
      return;
    }
    a.prepend(l);
  }
}
function qg(e, t) {
  const n = Gg(e);
  zg(e, n);
  const r = jg(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${i}__ritual-metadata`);
  for (const s of r) {
    const l = document.createElement("span");
    l.classList.add(`${i}__ritual-metadata-chip`), l.textContent = s, o.append(l);
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
  const a = e.querySelector(Xa);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function Gg(e) {
  return e.closest(`.${i}`)?.querySelector(Ya) ?? null;
}
function zg(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(mu)))
      o.remove();
}
function jg(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Bn(e.target)}` : null,
    e.duration ? `Duração: ${Bn(e.duration)}` : null,
    e.resistance ? `Resistência: ${ds(e.resistance)}` : null
  ].filter(Ut);
}
function Vg(e) {
  const t = Hg(e), n = Xg(e), o = (t ? Zg(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = wr(v(o, "element")), l = B("op.elementChoices", s) ?? Do(ne(a, "Elemento")) ?? Do(n.damageType), u = s ?? ch(l), d = v(o, "circle") ?? ne(a, "Círculo"), m = th(o) ?? ne(a, "Alvo"), y = ah(o, "duration", "op.durationChoices") ?? ne(a, "Duração"), T = Jg(e) ?? rh(o) ?? ne(a, "Resistência"), $ = eh(a) ?? n.cost, g = {
    elementLabel: l,
    elementTone: u,
    circle: d,
    cost: $,
    target: m,
    duration: y,
    resistance: T
  };
  return ih(g) ? g : null;
}
function Hg(e) {
  const t = Wg(e);
  if (!t) return null;
  const n = t.getFlag?.(c, It), r = Yg(n);
  if (r.length === 0) return null;
  const o = Kg(e);
  if (o.size > 0) {
    const a = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function Wg(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? kr()?.messages?.get?.(n) ?? null : null;
}
function Kg(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${no}]`))) {
    const o = r.getAttribute(no)?.trim();
    o && n.add(o);
  }
  return n;
}
function Yg(e) {
  if (!Ft(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Qg).filter((n) => n !== null) : [];
}
function Qg(e) {
  return Ft(e) ? {
    pendingId: ut(e.pendingId),
    actorId: ut(e.actorId),
    itemId: ut(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Mg) : []
  } : null;
}
function Zg(e) {
  if (!e.itemId) return null;
  const t = kr(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Xg(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(su))) {
    const o = we(r.textContent);
    if (!o) continue;
    const a = Og(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function Jg(e) {
  const t = we(e.querySelector(Qa)?.textContent);
  return t ? ds(t) : null;
}
function ne(e, t) {
  const n = Ge(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || Ge(r.slice(0, o)) !== n))
      return we(r.slice(o + 1));
  }
  return null;
}
function eh(e) {
  const t = ne(e, "Custo") ?? ne(e, "PE");
  return t || (e.map(we).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function th(e) {
  const t = v(e, "target");
  if (!t) return null;
  if (t === "area")
    return nh(e) ?? B("op.targetChoices", t) ?? "Área";
  const n = B("op.targetChoices", t) ?? K(t);
  return [t === "people" || t === "creatures" ? v(e, "targetQtd") : null, n].filter(Ut).join(" ");
}
function nh(e) {
  const t = v(e, "area.name"), n = v(e, "area.size"), r = v(e, "area.type"), o = t ? B("op.areaChoices", t) ?? K(t) : null, a = r ? B("op.areaTypeChoices", r) ?? K(r) : null;
  return o ? n ? a ? `${o} ${n}m ${Bn(a)}` : `${o} ${n}m` : o : null;
}
function rh(e) {
  const t = v(e, "skillResis"), n = v(e, "resistance");
  if (!t || !n) return null;
  const r = B("op.skill", t) ?? K(t), o = oh(n);
  return [r, o].filter(Ut).join(" ");
}
function oh(e) {
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
      return B("op.resistanceChoices", e) ?? K(e);
  }
}
function ah(e, t, n) {
  const r = v(e, t);
  return r ? B(n, r) ?? K(r) : null;
}
function ih(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function sh(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function lh(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Ut).join(" ");
}
function wr(e) {
  const t = Ge(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Do(e) {
  const t = wr(e);
  return t ? B("op.elementChoices", t) ?? K(t) : e ? K(e) : null;
}
function ch(e) {
  return wr(e);
}
function B(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = kr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const vo = "data-paranormal-toolkit-dice-toggle-enhanced";
function uh(e) {
  for (const t of Array.from(e.querySelectorAll(Ja)))
    ms(t);
}
function dh(e) {
  const t = ps(e.target);
  if (!t) return;
  const n = Er(t);
  n && (e.preventDefault(), fs(n, t));
}
function mh(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = ps(e.target);
  if (!t) return;
  const n = Er(t);
  n && (e.preventDefault(), fs(n, t));
}
function ms(e) {
  const t = e.querySelector(Lt);
  if (!t) return;
  const n = e.querySelector(dr);
  if (n && n.getAttribute(vo) !== "true" && (n.setAttribute(vo, "true"), n.classList.add(mr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function fs(e, t) {
  const n = e.querySelector(Lt);
  if (!n) return;
  const r = !e.classList.contains(ur);
  fh(e, t, n, r);
}
function fh(e, t, n, r) {
  e.classList.toggle(ur, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function ps(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(dr);
  if (!t) return null;
  const n = Er(t);
  return n ? (ms(n), t.classList.contains(mr) ? t : null) : null;
}
function Er(e) {
  const t = e.closest(Ja);
  return t && t.querySelector(Lt) ? t : null;
}
const Po = `${c}-workflow-dice-toggle-styles`;
function ph() {
  if (document.getElementById(Po)) return;
  const e = document.createElement("style");
  e.id = Po, e.textContent = `
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
const gh = [0, 100, 500, 1500, 3e3];
let No = !1, en = null;
function hh() {
  if (!No) {
    No = !0, ph(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Oe(Lo(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Oe(Lo(t));
    }), Hooks.once("ready", () => {
      Oe(document), bh();
    }), document.addEventListener("click", dh), document.addEventListener("keydown", mh);
    for (const e of gh)
      globalThis.setTimeout(() => Oe(document), e);
  }
}
function bh() {
  en || !document.body || (en = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Oe(n);
  }), en.observe(document.body, { childList: !0, subtree: !0 }));
}
function Oe(e) {
  e && (Lu(e), Fg(e), wg(e), uh(e), $u(e));
}
function _h() {
  hh();
}
const yh = "data-paranormal-toolkit-action-section", Ah = "ritual-log", Th = ".paranormal-toolkit-item-use-prompt__actions", $h = ".paranormal-toolkit-item-use-prompt__actions-title", Rh = [0, 100, 500, 1500];
let xo = !1;
function kh() {
  if (xo) return;
  const e = (t, n) => {
    Oo(Ih(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Oo(document), xo = !0;
}
function Oo(e) {
  for (const t of Rh)
    globalThis.setTimeout(() => wh(e), t);
}
function wh(e) {
  Eh(e), Ch(e);
}
function Eh(e) {
  for (const t of e.querySelectorAll(
    `[${yh}="${Ah}"]`
  ))
    t.remove();
}
function Ch(e) {
  for (const t of e.querySelectorAll(Th)) {
    if (Mo(t.querySelector($h)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (a) => Mo(a.textContent ?? "")
    ).some((a) => a.includes("ritual conjurado")) && t.remove();
  }
}
function Ih(e) {
  if (e instanceof HTMLElement || Sh(e))
    return e;
  if (Lh(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Sh(e) {
  return e instanceof HTMLElement;
}
function Lh(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Mo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Me = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, gs = {
  PV: "system.attributes.hp"
}, qn = {
  PV: [Me.PV, gs.PV],
  SAN: [Me.SAN],
  PE: [Me.PE],
  PD: [Me.PD]
}, Gn = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Dh {
  getResource(t, n) {
    const r = Fo(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, s = `${o}.max`, l = foundry.utils.getProperty(t, a), u = foundry.utils.getProperty(t, s), d = Bo(t, n, a, l, "valor atual");
    if (d) return p(d);
    const m = Bo(t, n, s, u, "valor máximo");
    return m ? p(m) : b({
      value: l,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const o = Fo(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function Fo(e, t) {
  const n = vh(e.type, t);
  if (n && Uo(e, n))
    return b(n);
  const r = qn[t].find(
    (o) => Uo(e, o)
  );
  return r ? b(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Ph(e, t),
    path: qn[t].join(" | ")
  });
}
function vh(e, t) {
  return e === "threat" ? gs[t] ?? null : e === "agent" ? Me[t] : null;
}
function Uo(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Ph(e, t) {
  const n = e.type ?? "unknown", r = qn[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Bo(e, t, n, r, o) {
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
class Nh {
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
      const s = Gn.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: o } = n, a = xh(o);
    return a ? b(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Gn.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function xh(e) {
  if (qo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (qo(n))
      return n;
  }
  return null;
}
function qo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Oh = "dice-so-nice";
async function hs(e) {
  if (!Mh() || !Fh()) return;
  const t = Uh();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Mh() {
  try {
    return ru().enabled;
  } catch {
    return !1;
  }
}
function Fh() {
  return game.modules?.get?.(Oh)?.active === !0;
}
function Uh() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Go = "occultism";
class bs {
  getDifficulty(t) {
    return Bh(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await Gh(t, Go);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await hs(r);
    const o = Vh(r);
    return {
      skill: Go,
      skillLabel: "Ocultismo",
      roll: r,
      formula: jh(r),
      total: o,
      difficulty: n,
      success: o >= n,
      diceBreakdown: Hh(r)
    };
  }
}
function Bh(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function qh(e) {
  return new bs().rollCastingCheck(e);
}
async function Gh(e, t) {
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
  return zh(r);
}
function zh(e) {
  return zo(e) ? e : Array.isArray(e) ? e.find(zo) ?? null : null;
}
function zo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function jh(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Vh(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Hh(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Wh);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Wh(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Kh = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Yh {
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
    const r = n.value, o = Qh(t.ritual, r);
    return o.ok ? o.value ? b(o.value) : b({
      resource: "PE",
      amount: Kh[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Qh(e, t) {
  const n = e.getFlag(c, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Zh(n) ? {
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
function Zh(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const tn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Xh(e) {
  if (!ob(e.item)) return null;
  const t = zn(e.actor) ? e.actor : Jh(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: tb(e.token) ?? eb(t),
    targets: ir(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Jh(e) {
  const t = e;
  return zn(t.actor) ? t.actor : zn(e.parent) ? e.parent : null;
}
function eb(e) {
  const t = nb(e) ?? rb(e);
  return t ? _s(t) : null;
}
function tb(e) {
  return jn(e) ? _s(e) : null;
}
function nb(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return jn(n) ? n : (t.getActiveTokens?.() ?? []).find(jn) ?? null;
}
function rb(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function _s(e) {
  const t = e.actor ?? null;
  return {
    tokenId: nn(e.id),
    actorId: nn(t?.id),
    sceneId: nn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ob(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function zn(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function jn(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function nn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class ab {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(tn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${tn.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Xh(ib(t));
    if (!n) {
      f.warn(`${tn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function ib(e) {
  return e && typeof e == "object" ? e : {};
}
class sb {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return rn("missing-item-patch");
    if (t.type !== "ritual") return rn("unsupported-item-type");
    const o = lb(r);
    return Object.keys(o).length === 0 ? rn("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function lb(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (w(t, "system.circle", n.circle), w(t, "system.element", n.element), w(t, "system.target", n.target), w(t, "system.targetQtd", n.targetQuantity), w(t, "system.execution", n.execution), w(t, "system.range", n.range), w(t, "system.duration", n.duration), w(t, "system.skillResis", n.resistanceSkill), w(t, "system.resistance", n.resistance), w(t, "system.studentForm", n.studentForm), w(t, "system.trueForm", n.trueForm)), t;
}
function w(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function rn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class cb {
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
    return this.getNumber(t, Gn.ritual.dt, 0);
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
class ub {
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
class db {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = mb(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, on(t)), b(t)) : n;
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
    return n ? on(n) : null;
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
    return Array.from(this.presets.values()).map(on);
  }
  findForItem(t) {
    return this.list().map((n) => fb(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function mb(e) {
  return !an(e.id) || !an(e.version) || !an(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : b(e);
}
function fb(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = pb(o, t);
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
function pb(e, t) {
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
      const n = jo(t.name), r = e.names.map(jo).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = gb(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function jo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function gb(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function on(e) {
  return structuredClone(e);
}
function an(e) {
  return typeof e == "string" && e.length > 0;
}
function ht(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : b(e.amount);
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
function Bt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function hb(e, t, n) {
  if (!Vo(e.id) || !Vo(e.formula))
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
    await hs(o);
    const l = {
      ...n.rollRequests[e.id] ?? ys(e, t),
      total: a,
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
function ys(e, t) {
  const n = e.intent ?? bb(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function bb(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Vo(e) {
  return typeof e == "string" && e.length > 0;
}
async function bt(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? rt(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? rt(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? rt(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? rt(t, n, r, o) : e.recover(t, n, o);
  }
}
function rt(e, t, n, r) {
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
function _b(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = yb(t, n, r, o);
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
    const s = Ab(t, n, r, o);
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
function yb(e, t, n, r) {
  const o = Bt(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: As(t.id, "damage", r, t.damageInstances.length),
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
function Ab(e, t, n, r) {
  const o = Bt(e.amountFrom);
  return {
    id: As(t.id, "healing", r, t.healingInstances.length),
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
function As(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Tb(e, t, n) {
  const r = Bt(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function $b(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), Ts("before", e), Ho("before", e), Ho("resolve", e);
}
function Rb(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), Ts("apply", e);
}
function kb(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function Ts(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = t, l = wb(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Ho(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function wb(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Eb(e, t, n) {
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
async function Cb(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Ib(e, t);
    case "spendRitualCost":
      return Sb(e, t);
  }
}
async function Ib(e, t) {
  const { context: n, resources: r } = e, o = ht(t, n);
  return o.ok ? $s(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function Sb(e, t) {
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
  }), $s(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function $s(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), b(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Lb(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, s = Db(t);
  for (const u of s.before)
    o.emit(u, n, { stepIndex: r, step: t });
  const l = await a();
  if (!l.ok)
    return l;
  for (const u of s.after)
    o.emit(u, n, { stepIndex: r, step: t });
  return l;
}
function Db(e) {
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
class vb {
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
    return b({ definition: t, context: n });
  }
  async runStep(t, n, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, r);
      default:
        return Lb({
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
    const o = await Cb({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? b(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = ys(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: s }), b(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await hb(t, r, n);
    return o.ok ? b(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = ht(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = Tb(t, n, o.value);
    $b({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), Rb({
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
    for (const l of s) {
      const u = await bt(this.resources, l, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(u, n, r, t);
      if (!d.ok)
        return d;
      _b({
        step: t,
        context: n,
        transaction: d.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return kb({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), b(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = ht(t, n);
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
      const l = await bt(this.resources, s, t.resource, t.operation, o.value), u = this.handleResourceOperationResult(l, n, r, t);
      if (!u.ok)
        return u;
    }
    return b(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await Eb(this.messages, t, n);
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
  emitSpecificRollPhase(t, n, r, o, a, s) {
    const l = Pb(t, n.intent);
    l && this.lifecycle.emit(l, r, {
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
function Pb(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Nb {
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
    const s = a.value, l = this.calculate(r, s, o);
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
    const { afterValue: u, appliedAmount: d } = l.value, m = {
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
      after: m
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
class xb {
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
function Rs(e) {
  return {
    id: Ob(),
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
function Ob() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Mb {
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
    return oe(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = Rs(n);
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
class Fb {
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
class Ub {
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
    const n = bn();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Bb(),
      flags: {
        ...t.flags,
        [c]: {
          ...qb(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = bn();
    if (!r.enabled)
      return;
    const o = n.notification ?? Wo(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = Wo(n);
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
function Wo(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Bb() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function qb(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const Gb = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", ks = `${c}-inline-roll-neutralized`, zb = `${c}-inline-roll-notice`, Cr = `data-${c}-inline-roll-neutralized`, Ko = `data-${c}-inline-roll-notice`, jb = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Yo(e) {
  const t = o_(e.message), n = await Vb(e.message), r = Hb(t);
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
async function Vb(e) {
  const t = t_(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = Wb(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await n_(t, n.content), replacementCount: n.replacementCount };
}
function Hb(e) {
  const t = e ? r_(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = ws(t);
  return n > 0 && Es(Xb(t)), { replacementCount: n };
}
function Wb(e) {
  const t = Kb(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = ws(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (Es(n.content), { content: n.innerHTML, replacementCount: o });
}
function Kb(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, Qb(o.trim()))), replacementCount: t };
}
function ws(e) {
  const t = Yb(e);
  for (const n of t)
    n.replaceWith(Zb(Jb(n)));
  return t.length;
}
function Yb(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(Gb))
    n.getAttribute(Cr) !== "true" && t.add(n);
  return Array.from(t);
}
function Qb(e) {
  return `<span class="${ks}" ${Cr}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${a_(e)}</span>`;
}
function Zb(e) {
  const t = document.createElement("span");
  return t.classList.add(ks), t.setAttribute(Cr, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Es(e) {
  if (e.querySelector?.(`[${Ko}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(zb), t.setAttribute(Ko, "true"), t.textContent = jb, e.append(t);
}
function Xb(e) {
  return e.querySelector(".message-content") ?? e;
}
function Jb(e) {
  const n = e.getAttribute("data-formula") ?? e_(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function e_(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function t_(e) {
  return e && typeof e == "object" ? e : null;
}
async function n_(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function r_(e) {
  const t = i_(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function o_(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function a_(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function i_(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const _t = "ritualRollConfig", ye = "ritual-roll";
function qt() {
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
function Cs(e) {
  const t = e.getFlag(c, _t);
  return Vn(t);
}
function Is(e) {
  return Cs(e) ?? qt();
}
async function s_(e, t) {
  const n = Vn(t) ?? Vn({
    ...qt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(c, _t, n), n;
}
async function l_(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, c, _t));
    return;
  }
  await e.setFlag(c, _t, null);
}
function Vn(e) {
  if (!Gt(e)) return null;
  const t = b_(e.intent);
  if (!t) return null;
  const n = qt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: yt(e.damageType),
    utilityLabel: yt(e.utilityLabel) ?? n.utilityLabel,
    note: Ir(e.note),
    forms: __(e.forms)
  };
}
function c_(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function u_(e) {
  const t = Cs(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = d_(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...m_(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: p_(e, t),
    resistance: t.intent === "damage" ? g_(e) : void 0
  };
}
function d_(e, t) {
  const n = {
    type: "rollFormula",
    id: ye,
    formula: t,
    intent: h_(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function m_(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${ye}.total`,
          ...f_(e.damageType)
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
function f_(e) {
  return e ? { damageType: e } : {};
}
function p_(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [ye]: n
      }
    }
  };
  return Qo(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [ye]: t.forms.discente.formula.trim()
    }
  }), Qo(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [ye]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function g_(e) {
  const t = Ss(e), n = yt(t.skillResis), r = yt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = y_(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function h_(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function b_(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function __(e) {
  const t = qt();
  return Gt(e) ? {
    base: sn(e.base),
    discente: sn(e.discente),
    verdadeiro: sn(e.verdadeiro)
  } : t.forms;
}
function sn(e) {
  return Gt(e) ? { formula: Ir(e.formula) } : { formula: "" };
}
function Qo(e, t) {
  const n = Ss(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return A_(r);
}
function Ss(e) {
  const t = e.system;
  return Gt(t) ? t : {};
}
function y_(e) {
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
function A_(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Ir(e) {
  return typeof e == "string" ? e.trim() : "";
}
function yt(e) {
  const t = Ir(e);
  return t.length > 0 ? t : null;
}
function Gt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function T_(e) {
  switch ($_(e)) {
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
      return R_(String(e ?? ""));
  }
}
function $_(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function R_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function k_(e) {
  return {
    header: {
      eyebrow: tr,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: S_(e.ritual)
    },
    forms: e.variantOptions.map((t) => w_(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: I_(e.automationStatus ?? "assisted")
  };
}
function w_(e, t) {
  const n = E_(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? C_(t) : "—",
    details: n
  };
}
function E_(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function C_(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function I_(e) {
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
function S_(e) {
  const t = e.system, n = [D_(t?.element), L_(t?.circle)].filter(N_);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function L_(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function D_(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (v_(e)) {
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
      return P_(e);
  }
}
function v_(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function P_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function N_(e) {
  return typeof e == "string" && e.length > 0;
}
const Ls = ["base", "discente", "verdadeiro"];
function Ds(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function At(e) {
  return typeof e == "string" && Ls.includes(e);
}
const { ApplicationV2: x_ } = foundry.applications.api;
class Ue extends x_ {
  constructor(t, n) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = k_(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: Ue.onCast,
      cancel: Ue.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new Ue(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    M_(o, (a) => {
      this.selectedVariant = a;
    }), F_(o, (a) => {
      this.spendResource = a;
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
          ${this.model.forms.map(O_).join("")}
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
    const n = q_(t), r = U_(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function O_(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((a) => `<span>${E(a)}</span>`).join("");
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
function M_(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Zo(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Zo(e, o, t));
    });
  const r = vs(e);
  r && t(r);
}
function Zo(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !At(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), vs(e));
}
function vs(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && At(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function F_(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function U_(e, t, n) {
  const r = B_(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function B_(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (At(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return At(n) ? n : null;
}
function q_(e) {
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
async function G_(e) {
  return Ue.request(e);
}
const Sr = {
  label: "Padrão"
}, z_ = {
  label: "Discente",
  extraCost: 2
}, j_ = {
  label: "Verdadeiro",
  extraCost: 5
};
class V_ {
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
    const r = this.resolveCostPreview(t), o = xy(n), a = vy(
      n,
      t.item,
      r,
      o
    ), s = await G_({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((I) => I.name),
      cost: r,
      defaultSpendResource: qy(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = H_(s), u = My(
      n,
      t.item,
      l.variant,
      o
    ), d = ja();
    let m = null;
    if (d) {
      const I = await K_(
        this.resources,
        t.actor,
        l,
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
        m = await qh(
          t.actor
        );
      } catch (x) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: x instanceof Error ? x.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: x
        };
      }
    }
    const y = W_(
      n,
      l,
      u,
      r,
      {
        includeCostSteps: !d
      }
    );
    if (y.steps.length === 0) {
      const I = Oy(
        t,
        l
      ), x = Xo(
        t.actor,
        m,
        u,
        r
      ), de = Jo(
        n,
        l,
        u,
        r,
        I,
        t,
        m
      );
      return x.length > 0 ? {
        status: "ready",
        workflowContext: I,
        actions: x,
        summaryLines: de
      } : {
        status: "completed-without-actions",
        workflowContext: I,
        summaryLines: de
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
    const $ = T.value.context, g = ty(
      n,
      t,
      $
    ), z = Q_(
      n,
      t
    ), Se = Xo(
      t.actor,
      m,
      u,
      r
    ), Le = Jo(
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
    if (!z.ok)
      return {
        status: "failed",
        reason: z.reason,
        message: z.message
      };
    const ue = [
      ...Se,
      ...g.actions,
      ...z.actions
    ];
    return ue.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: $,
      summaryLines: Le
    } : {
      status: "ready",
      workflowContext: $,
      actions: ue,
      summaryLines: Le
    };
  }
  async applyAction(t) {
    return bt(
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
function H_(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function W_(e, t, n, r, o) {
  const a = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || Dr(l) && (!o.includeCostSteps || !s) || a.push(Y_(l, n));
  return o.includeCostSteps && s && r && Gy(n.extraCost) && a.push({
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
async function K_(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = We(o, r);
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
function Y_(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Xo(e, t, n, r) {
  if (!t || t.success) return [];
  const o = We(r, n);
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
function Q_(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = Lr(r.actor, t);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const a of o) {
      const s = Ti(a);
      n.push(
        Z_(
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
function Z_(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? ey(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: X_(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: J_(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function X_(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function J_(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function ey(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function ty(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const s = ht(a, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = Lr(a.actor, t);
    if (l.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of l) {
      if (ny(a)) {
        ry(
          o,
          u,
          oy(a, n, s.value)
        );
        continue;
      }
      r.push(iy(a, u, s.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...ay(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function ny(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function ry(e, t, n) {
  const r = uy(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function oy(e, t, n) {
  const r = dy(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function ay(e, t, n, r) {
  const o = gy(e), a = o.length > 1 ? _y() : void 0;
  return o.map((s) => {
    const l = r.map(
      (d, m) => {
        const y = hy(d.amount, s);
        return {
          id: sy(d, s, m),
          amount: y,
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
      label: ly(u, s, o.length > 1),
      executedLabel: cy(
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
function iy(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = py(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: my(e, r, n),
    executedLabel: fy(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function sy(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function ly(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function cy(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function uy(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function dy(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function my(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function fy(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function py(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function gy(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function hy(e, t) {
  const n = e * t.multiplier, r = by(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function by(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function _y() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Lr(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Jo(e, t, n, r, o, a, s = null) {
  return [
    `Forma: ${Ds(t.variant)}`,
    $y(t, n, r),
    ...Ty(s),
    ...Object.values(o.rolls).flatMap(Ry),
    ...yy(e, a),
    ...ky(e.resistance),
    ...Ly(n)
  ];
}
function yy(e, t) {
  return Ay(e) ? Lr("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Ay(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Ty(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function $y(e, t, n) {
  const r = We(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Ry(e) {
  const n = [`${Dy(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = wy(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${T_(e.damageType)}`), n;
}
function ky(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function wy(e) {
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
    const s = Ey(a);
    s && (Sy(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Ey(e) {
  const t = Cy(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Iy(e);
}
function Cy(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Iy(e) {
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
function Sy(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function Ly(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Dy(e) {
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
function vy(e, t, n, r) {
  return Ls.map((o) => {
    const a = Ps(
      e,
      t,
      o,
      r
    ), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? Ds(o),
      enabled: s,
      details: a ? Py(a, n, r) : [],
      finalCostText: a ? Ny(n, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function Py(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = We(t, e);
  return r.push(
    a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"
  ), r;
}
function We(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function Ny(e, t) {
  const n = We(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function xy(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Dr);
}
function Oy(e, t) {
  return Rs({
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
function My(e, t, n, r) {
  return Ps(e, t, n, r) ?? Sr;
}
function Ps(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? Uy(t, n) ? Fy(n) : null : n === "base" ? Sr : null);
}
function Fy(e) {
  switch (e) {
    case "base":
      return Sr;
    case "discente":
      return z_;
    case "verdadeiro":
      return j_;
  }
}
function Uy(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return By(foundry.utils.getProperty(e, n));
}
function By(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function qy(e) {
  return e.steps.some(Dr);
}
function Dr(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Gy(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Ns = "itemUsePrompts", xs = "chatCard", zt = "data-paranormal-toolkit-prompt-id", jt = "data-paranormal-toolkit-pending-id", vr = "data-paranormal-toolkit-executed-label", Hn = "data-paranormal-toolkit-choice-group", Os = "data-paranormal-toolkit-skipped-label", ea = "data-paranormal-toolkit-action-section", ta = "data-paranormal-toolkit-detail-key", na = "data-paranormal-toolkit-roll-card", Pr = "data-paranormal-toolkit-roll-detail-toggle", Ms = "data-paranormal-toolkit-roll-detail-id", Fs = "data-paranormal-toolkit-resistance-roll-button", Us = "data-paranormal-toolkit-resistance-skill", Bs = "data-paranormal-toolkit-resistance-skill-label", qs = "data-paranormal-toolkit-resistance-target-actor-id", Gs = "data-paranormal-toolkit-resistance-target-name", zs = "data-paranormal-toolkit-resistance-roll-result", ra = "data-paranormal-toolkit-system-card-replaced", zy = `[${jt}]`, jy = `[${Pr}]`, Vy = `[${Fs}]`, Wn = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, Hy = `${h}__actions`, oa = `${h}__details`, js = `${h}__summary`, Wy = `${h}__title`, Vs = `${h}__button--executed`, aa = `${h}__roll-card`;
let ia = !1, Kn = null;
const N = /* @__PURE__ */ new Map(), Ky = [0, 100, 500, 1500, 3e3], Yy = 3e4, Qy = [0, 100, 500, 1500, 3e3];
function Zy(e) {
  if (Kn = e, ia) {
    la(e);
    return;
  }
  const t = (n, r) => {
    Ws(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), ia = !0, la(e);
}
async function sa(e) {
  const t = Hs(e);
  N.set(e.pendingId, t), await Or(t) || rl(t), Ks(e.pendingId);
}
async function Xy(e) {
  const t = Hs({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", N.set(e.pendingId, t), await Or(t) || rl(t), Ks(e.pendingId);
}
async function ln(e, t) {
  const n = N.get(e);
  N.delete(e), n && await ZA(n, t);
}
function Nr(e) {
  const t = cl();
  for (const n of t) {
    const r = G(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Jy(e, t) {
  const n = Nr(e);
  if (!n) return;
  const r = G(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await Ee(n.message, r));
}
async function eA(e, t, n) {
  if (!t) return;
  const r = Nr(e);
  if (!r) return;
  const o = G(r.message);
  let a = !1;
  for (const [s, l] of Object.entries(o))
    s !== e && l.choiceGroupId === t && (o[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await Ee(r.message, o);
}
function Hs(e) {
  const t = Y(e.context.message), n = e.context.targets.find((s) => Xn(s)), r = n ? Xn(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: EA(e.context),
    executed: !1
  };
}
function Ws(e, t, n) {
  QA();
  const r = Ht(t);
  if (!r) return;
  const o = WA(e, r);
  o.length > 0 && Tt(r);
  for (const a of o)
    Yn(r, a);
  Zs(r, n), Qn(r), Zn(r);
}
function la(e) {
  for (const t of Qy)
    globalThis.setTimeout(() => {
      tA(e);
    }, t);
}
function tA(e) {
  for (const t of nA()) {
    const n = Vt(t);
    rA(n) && Ws(n, t, e);
  }
}
function nA() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function rA(e) {
  return e ? Mr(e) ? !0 : JA(e).length > 0 : !1;
}
function Ks(e) {
  const t = N.get(e);
  if (!t) return;
  const n = t.messageId ? KA(t.messageId) : null;
  if (n) {
    fa(n, t), Tt(n), Yn(n, t), ca(n), Qn(n), Zn(n);
    return;
  }
  if (t.messageId) {
    er(t);
    return;
  }
  const r = YA(t);
  if (r) {
    fa(r, t), Tt(r), Yn(r, t), ca(r), Qn(r), Zn(r);
    return;
  }
  er(t);
}
function ca(e) {
  Kn && Zs(e, Kn);
}
function Tt(e) {
  const t = oA();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Qs(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(ra) === "true") return;
  const r = n.querySelector(`.${Wn}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(ra, "true");
}
function oA() {
  try {
    return Rc() === "replace";
  } catch {
    return !1;
  }
}
function Yn(e, t) {
  if (Tt(e), e.querySelector(`[${zt}="${Ce(t.pendingId)}"]`)) return;
  const n = aA(e, t);
  sA(n, t), TA(n, $A(t)).append(wA(t));
}
function aA(e, t) {
  const n = e.querySelector(`.${Wn}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Wn, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Wy), s.textContent = iA(t);
  const l = document.createElement("span");
  return l.classList.add(js), l.textContent = t.summary, o.append(a, s, l), r.append(o), IA(e).append(r), r;
}
function iA(e) {
  const t = C(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function sA(e, t) {
  const n = t.summaryLines ?? [], r = tl(n, t);
  if (r) {
    lA(e, r, t);
    return;
  }
  RA(e, n);
}
function lA(e, t, n) {
  if (e.querySelector(`[${na}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(aa, `${aa}--${t.intent}`), r.setAttribute(na, "true"), t.castingCheck && ua(r, uA(t.castingCheck), n.pendingId, "casting"), cA(t) && ua(r, dA(t), n.pendingId, "effect"), hA(r, t), bA(r, t, n), AA(r, t), e.append(r);
}
function cA(e) {
  return e.intent !== "casting";
}
function uA(e) {
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
function dA(e) {
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
function ua(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${h}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, a.append(s), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, a.append(l);
  }
  if (o.append(a), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, o.append(l);
  }
  mA(o, t), yA(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function mA(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = fA(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function fA(e, t) {
  const n = pA(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of gA(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function pA(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function gA(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? da(e, "highest") : n.includes("kl") ? da(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function da(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function hA(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(bT);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function bA(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = _A(t, n);
  o.append(a), s && o.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(o, l), t.resistanceRollResult && r.append(Ys(t.resistanceRollResult)), e.append(r);
}
function _A(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(zt, t.pendingId), n.setAttribute(Fs, "true"), n.setAttribute(Us, e.resistanceSkill), n.setAttribute(Bs, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(qs, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Gs, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(zs, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Ys(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = Js(e), t;
}
function yA(e, t, n, r, o) {
  const a = t.filter((d) => d.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Pr, s), l.setAttribute("aria-expanded", "false"), l.textContent = o;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(Ms, s), u.hidden = !0;
  for (const d of a) {
    const m = document.createElement("dt");
    m.textContent = d.label;
    const y = document.createElement("dd");
    y.textContent = d.value, u.append(m, y);
  }
  e.append(l, u);
}
function AA(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function TA(e, t) {
  const n = `[${ea}="${Ce(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Hy), o.setAttribute(ea, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function $A(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = tl(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function RA(e, t) {
  if (t.length === 0) return;
  const n = kA(e);
  for (const r of t) {
    const o = _T(r);
    if (n.querySelector(`[${ta}="${Ce(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(ta, o), n.append(a);
  }
}
function kA(e) {
  const t = e.querySelector(`.${oa}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(oa), e.append(n), n;
}
function wA(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(zt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Vs), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(jt, e.pendingId), t.setAttribute(vr, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Hn, e.choiceGroupId), t.setAttribute(Os, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function EA(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = CA(e);
  return `${t} → ${n}`;
}
function CA(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function IA(e) {
  return Qs(e) ?? e;
}
function Qs(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Zs(e, t) {
  const n = Ht(e);
  if (!n) return;
  const r = n.querySelectorAll(zy);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      GA(o, t);
    }));
}
function Qn(e) {
  const t = Ht(e);
  if (!t) return;
  const n = t.querySelectorAll(jy);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      SA(t, r);
    }));
}
function Zn(e) {
  const t = Ht(e);
  if (!t) return;
  const n = t.querySelectorAll(Vy);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      LA(t, r);
    }));
}
function SA(e, t) {
  const n = t.getAttribute(Pr);
  if (!n) return;
  const r = e.querySelector(`[${Ms}="${Ce(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function LA(e, t) {
  const n = t.getAttribute(zt), r = t.getAttribute(Us), o = t.getAttribute(Bs) ?? (r ? ae(r) : "Resistência");
  if (!n || !r) return;
  const a = PA(e, n), s = NA(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Fd(s, r);
    await UA(u.roll);
    const d = {
      skill: r,
      skillLabel: o,
      formula: u.formula,
      total: u.total,
      targetName: s.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: u.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    DA(t, d), vA(t, d), BA(n, d), await qA(e, n, d);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function DA(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(zs, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function vA(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Ys(t);
  if (r) {
    r.textContent = Js(t);
    return;
  }
  n.append(o);
}
function PA(e, t) {
  const n = N.get(t);
  if (n) return n;
  const r = Vt(e);
  return G(r)[t] ?? null;
}
function NA(e, t) {
  const n = e?.resistanceTargetActor;
  if (U(n)) return n;
  const o = e?.context?.targets.map(Xn).find(U) ?? null;
  if (o) return o;
  const a = t.getAttribute(qs) ?? e?.resistanceTargetActorId ?? null, s = a ? OA(a) : null;
  return s || MA(
    t.getAttribute(Gs) ?? e?.resistanceTargetName ?? xA(t)
  );
}
function xA(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${js}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function Xn(e) {
  const t = e.actor;
  if (U(t)) return t;
  const n = e.token, r = ze(n);
  if (r) return r;
  const o = e.document;
  return ze(o);
}
function ze(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (U(t)) return t;
  const n = e.document?.actor;
  return U(n) ? n : null;
}
function OA(e) {
  const n = game.actors?.get?.(e);
  return U(n) ? n : Xs().map((a) => ze(a)).find((a) => a?.id === e) ?? null;
}
function MA(e) {
  const t = Ae(e);
  if (!t) return null;
  const n = Xs().filter((a) => Ae(FA(a)) === t).map((a) => ze(a)).find(U) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => U(a) && Ae(a.name) === t);
  return U(o) ? o : null;
}
function Xs() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function FA(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : ze(e)?.name ?? null;
}
function Ae(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function U(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Js(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function UA(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function BA(e, t) {
  const n = N.get(e);
  n && (n.resistanceRollResult = t);
}
async function qA(e, t, n) {
  const r = Vt(e);
  if (r)
    try {
      const o = G(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await Ee(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Vt(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return q(r?.get?.(n));
}
async function GA(e, t) {
  const n = e.getAttribute(jt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    el(e, e.getAttribute(vr) ?? "✓ Automação aplicada"), zA(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function el(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Vs), e.removeAttribute(jt), e.removeAttribute(vr);
}
function zA(e) {
  const t = e.getAttribute(Hn);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Hn}="${Ce(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(Os) ?? "✓ Outra opção escolhida";
    el(o, a);
  }
}
function tl(e, t) {
  const n = e.map(xr).filter(gT), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = C(e, "Forma"), a = C(e, "Custo"), s = C(e, "Dados") ?? C(e, `Dados (${r.label})`), l = C(e, "Tipo"), u = C(e, "Resistência"), d = C(e, "Resistência Perícia"), m = C(e, "Resistência Rótulo") ?? (d ? ae(d) : null), y = nl(e, "Observação"), T = e.filter((g) => HA(g, r)), $ = jA(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: s,
    damageType: l,
    resistance: u,
    resistanceSkill: d,
    resistanceSkillLabel: m,
    notes: y,
    details: T,
    castingCheck: $,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function jA(e) {
  const t = e.map(xr).find((a) => a?.intent === "casting") ?? null, n = C(e, "Conjuração DT"), r = C(e, "Conjuração Resultado");
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
function xr(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: VA(n)
  } : null;
}
function VA(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function C(e, t) {
  return nl(e, t)[0] ?? null;
}
function nl(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function HA(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || xr(e) ? !1 : e.trim().length > 0;
}
function WA(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of N.values())
    Jn(r, e, t) && n.set(r.pendingId, r);
  for (const r of XA(e))
    Jn(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Jn(e, t, n) {
  const r = Y(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !ma(n, "itemId", e.itemId) ? !1 : !e.actorId || ma(n, "actorId", e.actorId);
}
function ma(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${yT(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function KA(e) {
  const t = Ce(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function YA(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Jn(e, null, t))
      return t;
  return null;
}
function QA() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of N.entries())
    e - r.createdAt > t && N.delete(n);
}
async function fa(e, t) {
  const n = Vt(e);
  if (!n) return !1;
  try {
    const r = G(n);
    return r[t.pendingId] = Fr(t, Y(n)), await Ee(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Or(e) {
  const t = il(e);
  if (!t) return !1;
  try {
    const n = G(t);
    return n[e.pendingId] = Fr(e, Y(t)), await Ee(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function rl(e) {
  for (const t of Ky)
    globalThis.setTimeout(() => {
      er(e);
    }, t);
}
async function er(e) {
  const t = il(e);
  if (Mr(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await Or(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function ZA(e, t) {
  const n = al(e.context.message);
  if (n)
    try {
      const r = G(n), o = r[e.pendingId] ?? Fr(e, Y(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await Ee(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function XA(e) {
  return Object.values(G(q(e))).filter(Ke);
}
function G(e) {
  if (!e) return {};
  const t = {}, n = Mr(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(ol(e)))
    t[r] ??= o;
  return t;
}
function JA(e) {
  return Object.values(ol(q(e))).filter(Ke);
}
function ol(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, Ns);
  if (!Re(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Ke(o) && (n[r] = o);
  return n;
}
async function Ee(e, t) {
  typeof e.setFlag == "function" && (await tT(e, t), await eT(e, t));
}
async function eT(e, t) {
  await Promise.resolve(e.setFlag?.(c, Ns, t));
}
function Mr(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, xs);
  return fT(t) ? t : null;
}
async function tT(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Ke).sort((a, s) => a.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((a) => a.createdAt)),
    messageId: r.messageId ?? Y(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: nT(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(c, xs, o));
}
function nT(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Fr(e, t) {
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
function al(e) {
  const t = q(e);
  if (t?.setFlag)
    return t;
  const n = rT(e);
  if (n?.setFlag)
    return n;
  const r = Y(e);
  if (!r) return null;
  const o = game.messages;
  return q(o?.get?.(r));
}
function rT(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(q).find((n) => typeof n?.setFlag == "function") ?? null;
}
function il(e) {
  const t = al(e.context.message);
  if (t) return t;
  const n = e.messageId ? oT(e.messageId) : null;
  if (n) return n;
  const r = cl().slice().reverse();
  return r.find((o) => aT(o, e)) ?? r.find((o) => iT(o, e)) ?? null;
}
function oT(e) {
  const t = game.messages;
  return q(t?.get?.(e));
}
function aT(e, t) {
  const n = Y(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!sl(e, t)) return !1;
  const o = ll(e);
  return !t.actorId || !o || o === t.actorId;
}
function iT(e, t) {
  if (!lT(e, t)) return !1;
  const n = ll(e);
  return t.actorId && n === t.actorId ? !0 : sl(e, t);
}
function sl(e, t) {
  const n = Ae(sT(e));
  if (!n) return !1;
  const r = Ae(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = Ae(t.itemId);
  return !!(o && n.includes(o));
}
function sT(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function ll(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function lT(e, t) {
  const n = cT(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= Yy;
}
function cT(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function q(e) {
  return e && typeof e == "object" ? e : null;
}
function Ke(e) {
  return Re(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && te(e.resistanceTargetActorId) && te(e.resistanceTargetName) && pT(e.resistanceRollResult) && uT(e.actionPayload) && cn(e.title) && cn(e.buttonLabel) && cn(e.executedLabel) && te(e.choiceGroupId) && te(e.skippedLabel) && te(e.actionSectionId) && te(e.actionSectionTitle) && hT(e.summaryLines) : !1;
}
function uT(e) {
  return e == null ? !0 : Re(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && dT(e.resource) && mT(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function dT(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function mT(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function fT(e) {
  return Re(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && Re(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Ke) : !1;
}
function pT(e) {
  return e == null ? !0 : Re(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && te(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function gT(e) {
  return e !== null;
}
function Re(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function S(e) {
  return e === null || typeof e == "string";
}
function cn(e) {
  return e === void 0 || typeof e == "string";
}
function te(e) {
  return e == null || typeof e == "string";
}
function hT(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function bT(e) {
  return typeof e == "string" && e.length > 0;
}
function cl() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(q).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(q).filter((r) => r !== null) : [];
}
function Ht(e) {
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
function _T(e) {
  return e.trim().toLowerCase();
}
function yT(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Ce(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const pa = 1e3;
class AT {
  constructor(t, n, r, o, a, s) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = s, this.ritualAssistant = new V_(
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
      settings: Wr(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Wr();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = wt(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && IT(t.item) && n.executionMode === "ask") {
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
    if (await Yo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: mn(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await ln(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await ln(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Nr(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = DT(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await bt(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await Jy(t), await eA(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Zy(
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
    if (await Yo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: mn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      ST(t.item)
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
          oe(r.workflowContext)
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
      return o.ok ? (CT(n, o.value), await TT(o.value), {
        ok: !0,
        executedLabel: $T(o.value)
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
    const n = un(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && un(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== t.id && (this.pendingExecutions.delete(o), await ln(
        o,
        ha(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = fn();
    await Xy({
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
      const l = fn();
      a ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await sa({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: un(s),
        skippedLabel: ha(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: LT(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      a
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      oe(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = fn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await sa({
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
    this.setAttempt(t, "completed"), f.info(
      "Automação executada por uso normal de item.",
      oe(o.value.context)
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
    const n = Date.now(), r = ba(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      n - s > pa && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= pa;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(ba(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = mn(
      t,
      n,
      r,
      o
    );
  }
}
async function TT(e) {
  const t = ET();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: RT(e)
      });
    } catch (n) {
      f.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function $T(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function RT(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${dt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = kT(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${dt(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${dt(e.actorName)}</strong></p>
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
function kT(e) {
  const t = wT(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${dt(o)}</li>`;
}
function wT(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = ga(n?.value);
  return r === null ? null : {
    value: r,
    max: ga(n?.max)
  };
}
function ga(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ET() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function dt(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function un(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function ha(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function CT(e, t) {
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
function IT(e) {
  return e.type === "ritual";
}
function ST(e) {
  return u_(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function LT(e) {
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
function DT(e) {
  const t = e.actorUuid ? vT(e.actorUuid) : null;
  if (ke(t)) return t;
  const n = e.actorId ? PT(e.actorId) : null;
  return n || NT(e.actorName);
}
function vT(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function PT(e) {
  const n = game.actors?.get?.(e);
  if (ke(n)) return n;
  for (const r of ul()) {
    const o = Ur(r);
    if (o?.id === e) return o;
  }
  return null;
}
function NT(e) {
  const t = dn(e);
  if (!t) return null;
  for (const o of ul()) {
    const a = xT(o);
    if (dn(a) === t) {
      const s = Ur(o);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (o) => ke(o) && dn(o.name) === t
  );
  return ke(r) ? r : null;
}
function ul() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function xT(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ur(e)?.name ?? null;
}
function Ur(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ke(t)) return t;
  const n = e.document?.actor;
  return ke(n) ? n : null;
}
function dn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ke(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function mn(e, t, n, r) {
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
function ba(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function fn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class OT {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = Ve(t);
    for (const s of n) {
      const l = s.itemId ? a.find((m) => m.id === s.itemId) ?? null : null, u = s.match?.preset ?? null;
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
class MT {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Ve(t).map((l) => this.analyzeRitual(l)), r = n.filter(ot("upToDate")), o = n.filter(ot("available")), a = n.filter(ot("outdated")), s = n.filter(ot("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = FT(t);
    return n ? r ? r.source.type !== "preset" ? ve({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? ve({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : ve({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: UT(r, n.preset)
    }) : ve({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : ve({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function ve(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? kt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function FT(e) {
  const t = e.getFlag(c, "automation");
  return nr(t) ? t : null;
}
function UT(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function ot(e) {
  return (t) => t.status === e;
}
class BT {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = or(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), o = oe(t);
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
    const n = A(t.actorName), r = A(t.resource), o = A(_a(t)), a = A(GT(t));
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
    const r = A(n.title ?? "Automação"), o = n.message ? `<p>${A(n.message)}</p>` : "", a = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = A(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((g) => A(g.name)).join(", ") : "Nenhum", u = Object.values(t.rolls).map(
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(qT(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), d = t.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(zT(g.source))})</li>`
    ), m = t.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), y = t.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(_a(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), $ = t.phases.map((g) => A(g)).join(" &rarr; ");
    return `
      <section class="${c}-card ${c}-workflow-card">
        <header class="${c}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${c}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${d.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${u.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${m.length > 0 ? `<p><strong>Dano:</strong></p><ul>${m.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Cura:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${$.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${$}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function qT(e) {
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
function _a(e) {
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
function GT(e) {
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
function zT(e) {
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
function jT() {
  const e = new Dh(), t = new Nb(e), n = new yi(new _i()), r = new Ai(new br()), o = new xb(new bs()), a = new Nh(), s = new Yh(a), l = new cb(e), u = new db(), d = u.registerMany(
    Xl()
  );
  if (!d.ok)
    throw new Error(d.error.message);
  const m = new ub(), y = new sb(), T = Ii(), $ = new Ri(T), g = new MT(
    u
  ), z = new OT(
    g,
    m,
    y
  ), Se = new Ub(), Le = new BT(Se), ue = new Fb(), I = new vb(
    t,
    s,
    Le,
    ue
  ), x = new Mb(I, ue), de = new AT(
    x,
    t,
    s,
    n,
    $,
    Se
  );
  return de.addStrategy(
    new ab(
      (_l) => de.handleItemUsed(_l)
    )
  ), {
    ordem: l,
    resourceAdapter: e,
    ritualAdapter: a,
    ritualCosts: s,
    resources: t,
    damage: n,
    resistance: r,
    ritualCasting: o,
    automationRegistry: u,
    automationBinder: m,
    itemPatches: y,
    conditionRegistry: T,
    conditions: $,
    debugOutput: Se,
    chatMessages: Le,
    workflowHooks: ue,
    automation: I,
    workflow: x,
    itemUseIntegration: de,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: z
  };
}
const { ApplicationV2: VT } = foundry.applications.api;
class $t extends VT {
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
      apply: $t.onApply,
      cancel: $t.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${M(tr)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${M(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${pn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${pn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${pn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function pn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${M(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? HT(n) : KT(t)}
    </section>
  `;
}
function HT(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(WT).join("")}</ol>`;
}
function WT(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${M(e.appliedPresetId)} v${M(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${M(e.itemName)}</strong>
        <span>${M(e.reason)}</span>
        ${r}
      </div>
      <em>${M(n)}</em>
    </li>
  `;
}
function KT(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${M({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function M(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const Rt = `${c}.manageRitualPresets`, ya = `__${c}_ritualPresetHeaderControlRegistered`, YT = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function QT(e) {
  const t = globalThis;
  if (!t[ya]) {
    for (const n of YT)
      Hooks.on(n, (r, o) => {
        ZT(r, o, e);
      });
    t[ya] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function ZT(e, t, n) {
  Array.isArray(t) && JT(e) && (XT(e, n), !t.some((r) => r.action === Rt) && t.push({
    action: Rt,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), dl(e, n);
    }
  }));
}
function XT(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Rt] && (e.options.actions[Rt] = (n) => {
    n.preventDefault(), n.stopPropagation(), dl(e, t);
  }));
}
function JT(e) {
  if (!game.user?.isGM) return !1;
  const t = ml(e);
  return t ? t.type === "agent" && Ve(t).length > 0 : !1;
}
function dl(e, t) {
  const n = ml(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new $t(n, t).render({ force: !0 });
}
function ml(e) {
  return Aa(e.actor) ? e.actor : Aa(e.document) ? e.document : null;
}
function Aa(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const fl = "data-paranormal-toolkit-ritual-roll-config", Ye = "data-paranormal-toolkit-ritual-roll-field", ie = "data-paranormal-toolkit-ritual-roll-action", Ta = `__${c}_ritualRollConfigBlockRegistered`, e$ = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], t$ = [
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
function n$() {
  const e = globalThis;
  if (!e[Ta]) {
    r$();
    for (const t of e$)
      Hooks.on(t, (...n) => {
        o$(n[0], n[1]);
      });
    e[Ta] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function r$() {
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
function o$(e, t) {
  const n = _$(e);
  if (!n || n.type !== "ritual") return;
  const r = T$(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  i$(o);
  const a = gl(n), s = Is(n), l = y$(n), u = s$(n, s, a, l);
  f$(u, n, a, l), a$(o, u), Br(u);
}
function a$(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function i$(e) {
  for (const t of Array.from(e.querySelectorAll(`[${fl}]`)))
    t.remove();
}
function s$(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${c}-ritual-roll-config`), o.setAttribute(fl, e.uuid ?? e.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${c}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${c}-ritual-roll-config__title`), s.append($a("strong", "Paranormal Toolkit")), s.append($a("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${c}-ritual-roll-config__badge`), l.textContent = bl(t) ? "Configurada" : "Rascunho", a.append(s, l), o.append(a);
  const u = document.createElement("p");
  u.classList.add(`${c}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(u);
  const d = document.createElement("div");
  d.classList.add(`${c}-ritual-roll-config__fields`), d.append(l$(t, r)), d.append(c$(t, r)), d.append(u$(t, r)), o.append(d), o.append(d$(t, n, r)), o.append(m$(r));
  const m = document.createElement("p");
  return m.classList.add(`${c}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(m), o;
}
function l$(e, t) {
  const n = Wt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Ye, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = c_(o), a.selected = e.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function c$(e, t) {
  const n = Wt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Ye, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const a of t$) {
    const s = document.createElement("option");
    s.value = a.value, s.textContent = a.label, s.selected = e.damageType === a.value, r.append(s);
  }
  return n.append(r), n;
}
function u$(e, t) {
  const n = Wt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Ye, "utilityLabel"), n.append(r), n;
}
function d$(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${c}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${c}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const a = document.createElement("div");
  return a.classList.add(`${c}-ritual-roll-config__forms-grid`), a.append(gn("base", "Padrão", e.forms.base.formula, !0, n)), a.append(gn("discente", "Discente", e.forms.discente.formula, t.discente, n)), a.append(gn("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(a), r;
}
function gn(e, t, n, r, o) {
  const a = Wt(t);
  a.classList.add(`${c}-ritual-roll-config__form-card`), a.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !o || !r, s.setAttribute(Ye, `formula.${e}`), a.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", a.append(l);
  }
  return a;
}
function m$(e) {
  const t = document.createElement("div");
  t.classList.add(`${c}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(ie, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(ie, "clear"), t.append(n, r), t;
}
function Wt(e) {
  const t = document.createElement("label");
  t.classList.add(`${c}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function $a(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function f$(e, t, n, r) {
  Ie(e, "intent")?.addEventListener("change", () => Br(e)), wa(e, "system.studentForm")?.addEventListener("change", () => Ra(e, t)), wa(e, "system.trueForm")?.addEventListener("change", () => Ra(e, t)), e.querySelector(`[${ie}="save"]`)?.addEventListener("click", () => {
    r && p$(e, t, n);
  }), e.querySelector(`[${ie}="clear"]`)?.addEventListener("click", () => {
    r && g$(e, t);
  });
}
async function p$(e, t, n) {
  const r = e.querySelector(`[${ie}="save"]`);
  r?.setAttribute("disabled", "true"), Te(e, "Salvando configuração...");
  try {
    const o = h$(e, n);
    await s_(t, o), pl(e, o), Te(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), Te(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function g$(e, t) {
  const n = e.querySelector(`[${ie}="clear"]`);
  n?.setAttribute("disabled", "true"), Te(e, "Limpando configuração...");
  try {
    await l_(t);
    const r = Is(t);
    b$(e, r), pl(e, r), Te(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Te(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function pl(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__badge`);
  n && (n.textContent = bl(t) ? "Configurada" : "Rascunho");
}
function h$(e, t) {
  return {
    schemaVersion: 1,
    intent: hl(Ie(e, "intent")?.value),
    damageType: Ea(e, "damageType"),
    utilityLabel: Ea(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: mt(e, "formula.base") },
      discente: { formula: mt(e, "formula.discente") },
      verdadeiro: { formula: mt(e, "formula.verdadeiro") }
    }
  };
}
function b$(e, t) {
  fe(e, "intent", t.intent), fe(e, "damageType", t.damageType ?? ""), fe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), fe(e, "formula.base", t.forms.base.formula), fe(e, "formula.discente", t.forms.discente.formula), fe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Br(e);
}
function Br(e) {
  const t = hl(Ie(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function Ra(e, t) {
  const n = gl(t);
  ka(e, "discente", n.discente), ka(e, "verdadeiro", n.verdadeiro);
}
function ka(e, t, n) {
  const r = Ie(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${ie}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const a = r.closest(`.${c}-ritual-roll-config__field`), s = a?.querySelector("small");
  if (a) {
    if (n) {
      s?.remove();
      return;
    }
    if (!s) {
      const l = document.createElement("small");
      l.textContent = "Indisponível neste ritual.", a.append(l);
    }
  }
}
function Te(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function gl(e) {
  const t = A$(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function _$(e) {
  return Ca(e.item) ? e.item : Ca(e.document) ? e.document : null;
}
function y$(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function A$(e) {
  const t = e.system;
  return $$(t) ? t : {};
}
function wa(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Ie(e, t) {
  return e.querySelector(`[${Ye}="${R$(t)}"]`);
}
function mt(e, t) {
  return Ie(e, t)?.value.trim() ?? "";
}
function Ea(e, t) {
  const n = mt(e, t);
  return n.length > 0 ? n : null;
}
function fe(e, t, n) {
  const r = Ie(e, t);
  r && (r.value = n);
}
function hl(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function bl(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function T$(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Ca(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function $$(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function R$(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let re = null;
Hooks.once("init", () => {
  Yl(), $c(), nu(), _h(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Qr.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${Qr.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  re = jT(), re.itemUseIntegration.registerStrategies(), Xc(re.conditions), xc(re), Hc(), Gc(), kh(), QT(re), n$(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${tr} inicializado.`);
});
function k$() {
  if (!re)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return re;
}
export {
  k$ as getToolkitServices
};
//# sourceMappingURL=main.js.map
