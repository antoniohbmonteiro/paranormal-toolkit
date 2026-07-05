const c = "paranormal-toolkit", Jn = "Paranormal Toolkit", Cl = "ordemparanormal";
class We {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function It(e) {
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
function Sl(e) {
  return er(e.getFlag(c, "automation"));
}
function er(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Dl(t.source) && Ll(t.definition);
}
function Ll(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(vl) && (t.conditionApplications === void 0 || Fl(t.conditionApplications));
}
function Dl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function vl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Pl(t);
    case "spendRitualCost":
      return Nl(t);
    case "rollFormula":
      return xl(t);
    case "modifyResource":
      return Ol(t);
    case "chatCard":
      return Ml(t);
    default:
      return !1;
  }
}
function Pl(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Oo(t);
}
function Nl(e) {
  return e.type === "spendRitualCost";
}
function xl(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || jl(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function Ol(e) {
  const t = e;
  return t.type === "modifyResource" && Mo(t.actor) && ql(t.resource) && zl(t.operation) && Oo(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Ml(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Fl(e) {
  return Array.isArray(e) && e.every(Bl);
}
function Bl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && Mo(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || Ul(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel));
}
function Ul(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Vl(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Gl(t.expiry));
}
function Gl(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Oo(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function Mo(e) {
  return e === "self" || e === "target";
}
function ql(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function zl(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function jl(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Vl(e) {
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
      return n.contents.filter(Hr);
    if (Kl(t))
      return Array.from(t).filter(Hr);
  }
  return [];
}
function Hl(e) {
  return tr(e)[0] ?? null;
}
function Wl(e) {
  return tr(e).find(Sl) ?? null;
}
function Kl(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Hr(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ke(e) {
  return tr(e).filter((t) => t.type === "ritual");
}
function Fo(e) {
  return Ke(e)[0] ?? null;
}
function Yl(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(It);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Oe("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = et(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(Yr);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Oe("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = et(n);
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
      const t = Oe("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = et(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await gn(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: Yr(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Wr(e);
    },
    async applyBestPresetsToActorRituals() {
      return Wr(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Oe("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = et(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Wr(e) {
  const t = Oe("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Ke(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Kr(t);
  const r = Kr(t, n.length);
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
    r.applied.push(Ql(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Zl(r), r;
}
async function gn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Ql(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: It(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Kr(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Zl(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function Yr(e) {
  return {
    preset: It(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Oe(e) {
  const t = We.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function et(e) {
  const t = Fo(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function re(e) {
  return e ? {
    id: e.id,
    source: {
      ...Xl(e.sourceActor),
      token: e.sourceToken
    },
    item: Jl(e.item),
    targets: e.targets.map(ec),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Qr(e.rollRequests, Bo),
    rolls: Qr(e.rolls, tc),
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
function Xl(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Jl(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function ec(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Bo(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function tc(e) {
  return {
    ...Bo(e),
    total: e.total
  };
}
function Qr(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function nc(e) {
  return {
    getSelected() {
      return We.getSelectedActor();
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
    rc(a.error);
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
  const t = We.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function rc(e) {
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
function ac() {
  tt(B.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), tt(B.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), tt(B.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), tt(B.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function hn() {
  return {
    enabled: nt(B.enabled),
    console: nt(B.console),
    ui: nt(B.ui),
    chat: nt(B.chat)
  };
}
async function V(e, t) {
  await game.settings.set(c, B[e], t);
}
function tt(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function nt(e) {
  return game.settings.get(c, e) === !0;
}
function oc() {
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
const Uo = "ritual.costOnly", Go = "ritual.simpleHealing", ic = "ritual.eletrocussao", qo = "ritual.simpleDamage", zo = "generic.simpleHealing", jo = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function sc() {
  return [
    lc(),
    cc(),
    uc(),
    dc(),
    mc()
  ];
}
function lc() {
  return {
    id: Uo,
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
function cc() {
  return {
    id: Go,
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
    automation: Vo(),
    itemPatch: pc()
  };
}
function uc() {
  return {
    id: ic,
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
    automation: fc(),
    itemPatch: gc()
  };
}
function dc() {
  return {
    id: qo,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: rr()
  };
}
function mc() {
  return {
    id: zo,
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
function Vo(e = "2d8+2") {
  return Ho(
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
function fc() {
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
  return Ho(
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
function pc() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: jo,
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
function gc() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: jo,
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
function Ho(e, t, n) {
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
function Wo() {
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
function hc(e) {
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
        if (!yc(t, n)) {
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
      const r = e.automationRegistry.require(Uo);
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
      if (!Zr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(Go);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Vo(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = Z("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = X(n);
      if (!r) return;
      if (!Zr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(qo);
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
      n && await bc(e, t, n);
    }
  };
}
async function bc(e, t, n) {
  const r = Ct(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Wo(),
    item: n,
    targets: ar()
  });
  if (!a.ok) {
    _c(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", re(a.value.context));
}
function _c(e) {
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
  const t = We.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function X(e) {
  const t = Fo(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function yc(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Zr(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Ac = ["strict", "open"], Ko = "strict";
function Tc(e) {
  return Ac.includes(e) ? e : Ko;
}
function $c(e) {
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
function St(e, t) {
  return e === "strict" && t.kind === "pending";
}
const Rc = ["disabled", "ask", "automatic"], wc = ["buttons", "confirm"], Yo = "ask";
function kc(e) {
  return typeof e == "string" && Rc.includes(e);
}
function Ec(e) {
  return typeof e == "string" && wc.includes(e);
}
function Ic(e) {
  return kc(e) ? e : Ec(e) ? "ask" : Yo;
}
const Cc = ["keep", "replace"], Sc = ["manual", "assisted"], Qo = "keep", Zo = "assisted", Lc = !0, k = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Dc() {
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
    default: Yo
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
    default: Qo
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
    default: Zo
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
    default: Ko
  }), game.settings.register(c, k.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Lc
  }), game.settings.register(c, k.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Xr() {
  const e = Ic(game.settings.get(c, k.executionMode)), t = Jo(game.settings.get(c, k.systemCardMode)), n = ei(game.settings.get(c, k.damageResolutionMode)), r = or();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: Xo()
  };
}
function vc() {
  return Jo(game.settings.get(c, k.systemCardMode));
}
function Pc() {
  return ei(game.settings.get(c, k.damageResolutionMode));
}
function or() {
  return Tc(game.settings.get(c, k.resistanceGateMode));
}
function Xo() {
  return game.settings.get(c, k.ritualCastingCheckEnabled) === !0;
}
async function J(e) {
  await game.settings.set(c, k.executionMode, e);
}
function Jo(e) {
  return Cc.includes(e) ? e : Qo;
}
function ei(e) {
  return Sc.includes(e) ? e : Zo;
}
function Nc(e) {
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
const xc = [
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
function Oc(e) {
  return {
    phases() {
      return xc;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Wt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Wl(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Jr(e, t, n);
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
      if (!Bc(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Fc(n) ?? Wt("Nenhum ator encontrado para executar automação do item.");
      r && await Jr(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Wt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Hl(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(zo);
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
async function Jr(e, t, n) {
  const r = Ct(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Wo(),
    item: n,
    targets: ar()
  });
  if (!a.ok) {
    Mc(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", re(a.value.context));
}
function Mc(e) {
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
  const t = We.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Fc(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Bc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Uc(e) {
  const t = nc(e), n = Yl(e), r = hc(e), a = Oc(e), o = oc(), s = Nc(e);
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
function Gc(e) {
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
      const r = ea();
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
      return qc(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = ea();
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
      return zc(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function ea() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function qc(e) {
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
function zc(e) {
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
function jc(e) {
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
    conditions: Gc(e.conditions),
    debug: Uc(e)
  }, n = globalThis;
  return n[c] = t, n.ParanormalToolkit = t, t;
}
class ta {
  static isSupportedSystem() {
    return game.system.id === Cl;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Vc() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ge(t.id),
    actorId: ge(t.actor?.id),
    sceneId: ge(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function ti() {
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
function Hc(e, t = ti()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Wc(e) {
  if (!Qc(e)) return null;
  const t = e.getFlag(c, "workflow");
  return Yc(t) ? t : null;
}
function Kc() {
  return `flags.${c}.workflow`;
}
function na(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), n = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || n !== void 0;
}
function ra(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return bn(t) || bn(n);
}
function Yc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Qc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ge(e) {
  return bn(e) ? e : null;
}
function bn(e) {
  return typeof e == "string" && e.length > 0;
}
function Zc() {
  const e = (t, n) => {
    Xc(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Xc(e, t) {
  const n = Wc(e);
  if (!n || n.targets.length === 0) return;
  const r = eu(t);
  if (!r || r.querySelector(`.${c}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Jc(n));
}
function Jc(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(aa("Origem", e.source.name)), t.append(aa("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function aa(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${c}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const a = document.createElement("span");
  return a.textContent = t, n.append(r, a), n;
}
function eu(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function tu() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!nu(r) || !ru(e) || na(e) || na(t)) return;
    const a = Vc();
    if (a.length === 0 || !ra(e) && !ra(t)) return;
    const o = ti();
    e.updateSource({
      [Kc()]: Hc(a, o)
    }), f.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function nu(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function ru(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let oa = !1, Kt = !1, Yt = !1, rt = null;
const au = 1e3, ou = 750, iu = 1e3;
function su(e) {
  oa || (Hooks.on("combatTurnChange", (t) => {
    cu(e, ia(t));
  }), Hooks.on("deleteCombat", (t) => {
    uu(e, ia(t));
  }), oa = !0, lu(e));
}
function lu(e) {
  Lt() && (Kt || (Kt = !0, globalThis.setTimeout(() => {
    Kt = !1, ir(e, "ready");
  }, au)));
}
function cu(e, t) {
  Lt() && t && (rt && globalThis.clearTimeout(rt), rt = globalThis.setTimeout(() => {
    rt = null, ir(e, "combat-turn-change", t);
  }, ou));
}
function uu(e, t) {
  Lt() && t && (Yt || (Yt = !0, globalThis.setTimeout(() => {
    Yt = !1, ir(e, "combat-deleted", t);
  }, iu)));
}
async function ir(e, t, n) {
  if (Lt())
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
function Lt() {
  return game.user?.isGM === !0;
}
function ia(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const ni = {
  enabled: "dice.animations.enabled"
};
function du() {
  game.settings.register(c, ni.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function mu() {
  return {
    enabled: game.settings.get(c, ni.enabled) === !0
  };
}
const Dt = "chatCard", sa = "data-paranormal-toolkit-prompt-id", i = `${c}-item-use-prompt`, fu = `.${i}__title`, ri = `.${i}__header`, pu = `.${i}__roll-card`, gu = `.${i}__roll-meta`, hu = `.${i}__roll-meta-pill`, sr = `.${i}__resistance`, bu = `.${i}__resistance-header`, ai = `.${i}__resistance-description`, vt = `.${i}__resistance-roll-button`, oi = `.${i}__resistance-roll-result`, la = `${i}__resistance-content`, ii = `.${i}__workflow-section`, si = `.${i}__workflow-roll`, lr = `${i}__workflow-roll--dice-open`, cr = `.${i}__workflow-roll-formula`, ur = `${i}__workflow-roll-formula--toggle`, Pt = `.${i}__workflow-dice-tray`, _u = `.${i}__roll-detail-toggle`, yu = `.${i}__roll-detail-list`, Au = `.${i}__ritual-element-badge`, Tu = `.${i}__ritual-metadata`, $u = "casting-backlash", Ru = "data-paranormal-toolkit-action-section", wu = "data-paranormal-toolkit-prompt-id", ku = "data-paranormal-toolkit-pending-id", ca = "data-paranormal-toolkit-casting-backlash-enhanced", ua = `.${i}`, Eu = `.${i}__workflow-section--casting`, Iu = `.${i}__workflow-section-header`, Cu = `.${i}__workflow-notes`, Su = `[${Ru}="${$u}"]`, da = `${i}__workflow-section-title-row`, Lu = `${i}__workflow-section-header--casting-backlash`, li = `${i}__casting-backlash-button`;
function Du(e) {
  for (const t of vu(e))
    Pu(t), Fu(t);
}
function vu(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(ua) && t.add(e);
  for (const n of e.querySelectorAll(ua))
    t.add(n);
  return Array.from(t);
}
function Pu(e) {
  const t = e.querySelector(Su);
  if (!t) return;
  const n = Nu(t);
  if (!n) return;
  const r = e.querySelector(`${Eu} ${Iu}`);
  r && (r.classList.add(Lu), xu(r), Ou(n), r.append(n), t.remove());
}
function Nu(e) {
  return e.querySelector(
    `button[${ku}], button[${wu}]`
  );
}
function xu(e) {
  const t = e.querySelector(`:scope > .${da}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(da);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(li) || n.append(a));
  return n;
}
function Ou(e) {
  if (e.getAttribute(ca) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Mu(t, e.disabled);
  e.classList.add(li), e.setAttribute(ca, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Mu(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Fu(e) {
  for (const t of e.querySelectorAll(Cu)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Bu(e) {
  for (const t of Array.from(e.querySelectorAll(ii)))
    for (const n of Array.from(t.querySelectorAll(`${_u}, ${yu}`)))
      n.remove();
}
const Uu = {
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
}, Gu = new Set(
  Object.values(Uu)
), qu = {
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
function zu(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = ju(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = qu[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : Gu.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function ci(e) {
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
function ju(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class di {
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
      const b = Vu(m, d);
      if (!b.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const T = zu(m.damageType);
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
          Hu(b.id, m, T.value)
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
        for (const j of Ku($.conditions))
          l.add(j);
        const g = Wu($.newPV);
        g !== null && (u = g), s.push({
          id: b.id,
          label: m.label ?? ci(T.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: b.amount,
          finalDamage: ma($.finalDamage, b.amount),
          blocked: ma($.blocked, 0),
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
function Vu(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Hu(e, t, n) {
  return {
    id: e,
    label: t.label ?? ci(n),
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
function ma(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Wu(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ku(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class dr {
  async rollResistance(t) {
    const n = await Qu(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? ae(t.skill),
      roll: n,
      formula: Xu(n),
      total: Ju(n),
      diceBreakdown: ed(n)
    };
  }
  getSkillLabel(t) {
    return ae(t);
  }
}
async function Yu(e, t) {
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
async function Qu(e, t) {
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
  return Zu(r);
}
function Zu(e) {
  return fa(e) ? e : Array.isArray(e) ? e.find(fa) ?? null : null;
}
function fa(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Xu(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Ju(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function ed(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(td);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function td(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class mi {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class fi {
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
function nd(e, t) {
  const n = cd(e?.rounds);
  if (!n)
    return pa(null);
  const r = e?.anchor ?? pi(t);
  if (!r)
    return {
      ...pa(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: rd(),
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
function pi(e) {
  const t = ud();
  if (!t?.id || !gi(t.round)) return null;
  const n = sd(t), r = ad(e, n) ?? id(t), a = H(r?.id), o = md(r?.initiative), s = od(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: dd()
  };
}
function rd() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function pa(e) {
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
function ad(e, t) {
  return e?.id ? t.find((n) => ld(n) === e.id) ?? null : null;
}
function od(e, t, n) {
  const r = H(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return fd(e.turn) ? e.turn : null;
}
function id(e) {
  return lt(e.combatant) ? e.combatant : null;
}
function sd(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(lt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(lt);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(lt);
  }
  return [];
}
function ld(e) {
  return H(e.actor?.id) ?? H(e.actorId) ?? H(e.token?.actor?.id) ?? H(e.token?.actorId) ?? H(e.document?.actor?.id) ?? H(e.document?.actorId);
}
function cd(e) {
  return gi(e) ? Math.trunc(e) : null;
}
function ud() {
  return game.combat ?? null;
}
function dd() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function lt(e) {
  return !!(e && typeof e == "object");
}
function H(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function md(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function gi(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function fd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class hi {
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
    if (!Rd(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = nd(t.duration, r), s = pd(a, t, o), u = t.refreshExisting ?? !0 ? wd(r, a.id) : null;
    if (u)
      try {
        return await Promise.resolve(u.update?.(s)), _(ga(r, a, u.id ?? null, !1, !0, o));
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
      return _(ga(r, a, m, !0, !1, o));
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = _i(n, r);
    let o = 0;
    try {
      for (const s of a)
        await ha(n, s) === "deleted" && (o += 1);
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
    const n = Id(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = mr(s);
      a += l.length;
      for (const u of l) {
        if (!bd(u, t)) continue;
        const d = bi(u);
        try {
          await ha(s, u) === "deleted" && (o += 1);
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
function pd(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Md(),
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
    duration: gd(n.duration),
    start: hd(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [c]: r
    }
  };
}
function gd(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function hd(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Od(),
    ...e
  };
}
function ga(e, t, n, r, a, o) {
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
function bd(e, t) {
  const n = bi(e);
  if (!n.conditionId || !_d(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = xd();
  return n.durationMode === "combatantTurn" || yd(n) ? Td(n, r) : Ad(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !v(n.startRound) || !v(n.requestedRounds) || !v(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function _d(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && v(e.requestedRounds);
}
function yd(e) {
  return !!(e.combatDurationApplied && v(e.requestedRounds) && v(e.startRound) && (e.startCombatantId || pt(e.startTurn)));
}
function Ad(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Td(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !v(e.startRound) || !v(e.requestedRounds) || !v(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = $d(t);
  return e.startCombatantId ? r === e.startCombatantId : pt(e.startTurn) && pt(t.turn) ? t.turn === e.startTurn : !1;
}
function $d(e) {
  return he(e.combatant?.id);
}
function bi(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: ct(e, "conditionId"),
    requestedRounds: ba(e, "requestedRounds") ?? Me(t.value) ?? Me(t.rounds),
    combatDurationApplied: Qt(e, "combatDurationApplied"),
    combatId: ct(e, "combatId") ?? he(n.combat) ?? he(t.combat),
    startCombatantId: ct(e, "startCombatantId") ?? he(n.combatant),
    startInitiative: Dd(e, "startInitiative") ?? yi(n.initiative),
    startRound: ba(e, "startRound") ?? Me(n.round) ?? Me(t.startRound),
    startTurn: Ld(e, "startTurn") ?? _n(n.turn) ?? _n(t.startTurn),
    expiryEvent: vd(e, "expiryEvent") ?? Ai(t.expiry),
    durationMode: Pd(e, "durationMode"),
    deleteOnExpire: Qt(e, "deleteOnExpire"),
    expiresWithCombat: Qt(e, "expiresWithCombat")
  };
}
function Rd(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function wd(e, t) {
  return _i(e, t)[0] ?? null;
}
function _i(e, t) {
  return mr(e).filter((n) => Sd(n) === t);
}
async function ha(e, t) {
  const n = t.id ?? null, r = n ? kd(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (Ed(a)) return "missing";
    throw a;
  }
}
function kd(e, t) {
  return mr(e).find((n) => n.id === t) ?? null;
}
function Ed(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Id() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      at(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    at(e, n);
  });
  for (const n of Cd())
    at(e, n.actor), at(e, n.document?.actor);
  return Array.from(e.values());
}
function at(e, t) {
  if (!Nd(t)) return;
  const r = he(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Cd() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function mr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Sd(e) {
  return ct(e, "conditionId");
}
function ct(e, t) {
  return he(se(e, t));
}
function ba(e, t) {
  return Me(se(e, t));
}
function Ld(e, t) {
  return _n(se(e, t));
}
function Dd(e, t) {
  return yi(se(e, t));
}
function vd(e, t) {
  return Ai(se(e, t));
}
function Pd(e, t) {
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
function Me(e) {
  return v(e) ? Math.trunc(e) : null;
}
function _n(e) {
  return pt(e) ? Math.trunc(e) : null;
}
function yi(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ai(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Nd(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function xd() {
  return game.combat ?? null;
}
function Od() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function v(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function pt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Md() {
  return game.user?.id ?? null;
}
const Fd = "icons/svg/downgrade.svg", Bd = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function y(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Fd,
    description: Bd,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Ud = y({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Gd = y({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), qd = y({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), zd = y({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), jd = y({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Vd = y({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Hd = y({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Wd = y({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Kd = y({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Yd = y({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Qd = y({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Zd = y({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Xd = y({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Jd = y({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), em = y({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), tm = y({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), nm = y({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), rm = y({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), am = y({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), om = y({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), im = y({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), sm = y({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), lm = y({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), cm = y({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), um = y({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), dm = y({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), mm = y({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), fm = y({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), pm = y({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), gm = y({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), hm = y({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), bm = y({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), _m = y({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), ym = y({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Am = [
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
  bm,
  _m,
  ym
];
class Tm {
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
    return Array.from(this.definitions.values()).map(_a);
  }
  get(t) {
    const n = this.lookup.get(ya(t)), r = n ? this.definitions.get(n) : null;
    return r ? _(_a(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = ya(t);
    r && this.lookup.set(r, n);
  }
}
function Ti() {
  return new Tm(Am);
}
function _a(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function ya(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const $m = {
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
}, Rm = {
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
function wm(e) {
  return Ri(e, $m, !1);
}
function km(e) {
  return Ri(e, Rm, !0);
}
function ke(e) {
  return e.kind === "waiting-resistance";
}
function $i(e) {
  return e.kind === "resisted";
}
function Ri(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? Pe("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? Pe("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : St(e.resistanceGateMode, e.resistanceState) ? Pe(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? Pe("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : Pe("available", !0, r.available, r.availableCompact, null);
}
function Pe(e, t, n, r, a) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: a
  };
}
const Fe = "data-paranormal-toolkit-prompt-id", Em = "data-paranormal-toolkit-resistance-roll-result", Im = "Conjuração DT";
function Cm(e) {
  const t = e.querySelector(vt)?.getAttribute(Em), n = ze(t);
  if (n !== null) return n;
  const r = e.querySelector(oi)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return ze(a?.[1] ?? null);
}
function wi(e) {
  const t = Nm(e), n = Dm(t);
  if (n !== null) return n;
  const r = vm(t);
  return r !== null ? r : Pm(e);
}
function Sm(e) {
  const t = e.getAttribute(Fe);
  if (!t) return null;
  const n = ki(e), r = Ei(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Nt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function W(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Lm(e) {
  return W(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Dm(e) {
  const t = Om(e);
  return t.length === 0 ? null : ze(Mm(t, Im));
}
function vm(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : Aa(r, ["system", "ritual", "DT"]) ?? Aa(r, ["system", "ritual", "dt"]);
}
function Pm(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return ze(n?.[1] ?? null);
}
function Nm(e) {
  const t = xm(e);
  if (!t) return null;
  const n = ki(e), r = Ei(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => Nt(o) ? o.pendingId === t : !1) ?? null;
}
function xm(e) {
  return (e.closest(`[${Fe}]`) ?? e.querySelector(`[${Fe}]`) ?? e.parentElement?.querySelector(`[${Fe}]`) ?? null)?.getAttribute(Fe) ?? null;
}
function ki(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Fm(a) ? a : null;
}
function Ei(e) {
  const t = e?.getFlag?.(c, Dt);
  return Nt(t) ? t : null;
}
function Om(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Mm(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function Aa(e, t) {
  let n = e;
  for (const r of t) {
    if (!Nt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : ze(typeof n == "string" ? n : null);
}
function ze(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Fm(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Nt(e) {
  return !!(e && typeof e == "object");
}
function Ii(e) {
  return Ci({
    hasResistance: !!e.querySelector(sr),
    difficulty: wi(e),
    resistanceTotal: Cm(e)
  });
}
function Bm(e) {
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
    state: $c(e)
  };
}
function le() {
  return game.user?.isGM === !0;
}
function oe() {
  return le();
}
function Um(e) {
  const t = St(e.resistanceGateMode, e.resistanceState), n = Gm(e.resistanceState, e.hasDamage), r = qm(e.resistanceState, e.hasEffect), a = wm({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = km({
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
function Gm(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function qm(e, t) {
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
    policy: Um({
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
function zm(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = Vm(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function jm(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function Vm(e, t) {
  const n = Hm(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of Wm(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function Hm(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Wm(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ta(e, "highest") : n.includes("kl") ? Ta(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ta(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const Km = "data-paranormal-toolkit-resistance-skill", Ym = "data-paranormal-toolkit-resistance-skill-label", Si = "pending", pr = "success", gr = "failure", Li = "rolled";
function Qm(e) {
  const t = nf(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? Jm(e.damageSection) : null, r = ef(e.rollCard, e.effectSection, e.resolveTargetConditionApplication), a = Zm(e.rollCard).map((o, s) => {
    const l = Xm(o, s), u = e.resistanceResults.get(l) ?? null, d = lf(u, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, b = e.effectApplications.get(l) ?? null;
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
        resistanceState: Bm({
          hasResistance: !!t,
          difficulty: t?.difficulty ?? null,
          total: u?.total ?? null,
          status: mf(d)
        }).state,
        damage: n,
        effect: r,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!b
      })
    };
  });
  return a.length <= 1 || !n && !r ? null : {
    rollCard: e.rollCard,
    targets: a,
    damage: n,
    effect: r,
    resistance: t
  };
}
function Zm(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((a) => a.trim()).filter((a) => a.length > 0 && Di(a) !== "nenhum alvo") : [];
}
function Xm(e, t) {
  return `${Di(e)}:${t}`;
}
function Jm(e) {
  const t = cf(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: df(e),
    formula: uf(e) ?? "—",
    total: t,
    diceBreakdown: jm(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function ef(e, t, n) {
  const r = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), a = n(e, r ?? null);
  return a ? {
    label: r && r.length > 0 ? r : a.conditionLabel,
    conditionId: a.conditionId,
    conditionLabel: a.conditionLabel,
    duration: tf(a.duration),
    source: a.source,
    originUuid: a.originUuid
  } : null;
}
function tf(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function nf(e, t) {
  const n = rf(t), r = af(n)?.textContent?.trim(), a = of(n), o = a?.getAttribute(Km) ?? null, s = a?.getAttribute(Ym) ?? (o ? ae(o) : null);
  return !r && !o ? null : {
    description: r ?? "Resistência do alvo.",
    formula: sf(n)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: s,
    difficulty: wi(e)
  };
}
function rf(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function af(e) {
  return hr(e, `.${i}__resistance-description`);
}
function of(e) {
  return hr(e, vt);
}
function sf(e) {
  return hr(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function hr(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function lf(e, t) {
  return e ? t === null ? Li : e.total >= t ? pr : gr : Si;
}
function cf(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function uf(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function df(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Di(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function mf(e) {
  return e === pr ? "succeeded" : e === gr ? "failed" : "pending";
}
function ff(e) {
  if (!e) return null;
  const t = e.actorId ? hf(e.actorId) : null, n = t ? pf(t, e.itemId, e.itemName) : null;
  return n || gf(e.itemId, e.itemName);
}
function pf(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (be(o)) return o;
  }
  const a = gt(n);
  if (a) {
    const o = r?.find?.((s) => be(s) ? gt(s.name) === a : !1);
    if (be(o)) return o;
  }
  return null;
}
function gf(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (be(a)) return a;
  }
  const r = gt(t);
  if (r) {
    const a = n?.find?.((o) => be(o) ? gt(o.name) === r : !1);
    if (be(a)) return a;
  }
  return null;
}
function hf(e) {
  const n = game.actors?.get?.(e);
  return bf(n) ? n : null;
}
function bf(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function be(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function gt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function br(e) {
  const t = Zt(e);
  if (!t) return null;
  const n = _f().filter((o) => Zt(yf(o)) === t).map((o) => vi(o)).find(Ge) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => Ge(o) && Zt(o.name) === t);
  return Ge(a) ? a : null;
}
function _f() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function yf(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : vi(e)?.name ?? null;
}
function vi(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ge(t)) return t;
  const n = e.document?.actor;
  return Ge(n) ? n : null;
}
function Ge(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Zt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Pi(e) {
  const t = Rf();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: Af(e)
  });
}
function Af(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${ut(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = Tf(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${ut(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${ut(e.actorName)}</strong></p>
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
function Tf(e) {
  const t = $f(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${ut(a)}</li>`;
}
function $f(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = $a(n?.value);
  return r === null ? null : {
    value: r,
    max: $a(n?.max)
  };
}
function $a(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Rf() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function ut(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function wf(e) {
  await Pi(kf(e));
}
function kf(e) {
  if (Ef(e)) return e;
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
function Ef(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Ni(e) {
  return e.mode, `✓ ${xi(e.inputAmount)} PV`;
}
function If(e) {
  const t = xi(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function xi(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class Cf {
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
    } : St(t.resistanceGateMode, t.resistanceState) ? {
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
class Sf {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? oe()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : St(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.resistanceState.kind === "succeeded" ? this.block(t, "resistance-succeeded", "Este alvo resistiu ao efeito.") : this.conditions.applyCondition({
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
class Lf {
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
const Df = `.${i}__actions`, _r = `.${i}__actions-title`, ht = `.${i}__button`, vf = "data-paranormal-toolkit-action-section", Pf = `${i}__button--executed`, Nf = "data-paranormal-toolkit-executed-label";
function Oi(e) {
  return W(e.querySelector(_r)?.textContent);
}
function xf(e, t) {
  const n = e.querySelector(_r);
  n && (n.textContent = t);
}
function Ye(e, t) {
  const n = W(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return W(a) === n;
  }) ?? null;
}
function yr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function ce(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const ot = "data-paranormal-toolkit-prompt-id", Mi = "multiTargetResistanceResults", Fi = "multiTargetDamageApplications", Bi = "multiTargetEffectApplications";
function Of(e) {
  const t = /* @__PURE__ */ new Map(), r = xt(e)?.[Mi];
  if (!N(r)) return t;
  for (const [a, o] of Object.entries(r))
    zf(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Mf(e, t) {
  await Ar(e, Mi, t.targetId, t);
}
function Ff(e) {
  const t = /* @__PURE__ */ new Map(), r = xt(e)?.[Fi];
  if (!N(r)) return t;
  for (const [a, o] of Object.entries(r))
    jf(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Bf(e, t) {
  await Ar(
    e,
    Fi,
    t.targetId,
    t
  );
}
function Uf(e) {
  const t = /* @__PURE__ */ new Map(), r = xt(e)?.[Bi];
  if (!N(r)) return t;
  for (const [a, o] of Object.entries(r))
    Hf(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Gf(e, t) {
  await Ar(
    e,
    Bi,
    t.targetId,
    t
  );
}
function qf(e) {
  const t = xt(e);
  return t ? {
    actorId: Xt(t.actorId),
    itemId: Xt(t.itemId),
    itemName: Xt(t.itemName)
  } : null;
}
async function Ar(e, t, n, r) {
  const a = Ui(e);
  if (!a) return;
  const o = Gi(e), s = qi(o);
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
  l && await Promise.resolve(o.setFlag?.(c, Dt, {
    ...s,
    prompts: u
  }));
}
function xt(e) {
  const t = Ui(e);
  if (!t) return null;
  const n = Gi(e), r = qi(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => N(o) ? o.pendingId === t : !1) ?? null;
}
function Ui(e) {
  return (e.closest(`[${ot}]`) ?? e.querySelector(`[${ot}]`) ?? e.parentElement?.querySelector(`[${ot}]`) ?? null)?.getAttribute(ot) ?? null;
}
function Gi(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Wf(a) ? a : null;
}
function qi(e) {
  const t = e?.getFlag?.(c, Dt);
  return N(t) ? t : null;
}
function zf(e) {
  return N(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function jf(e) {
  return N(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && Vf(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function Vf(e) {
  return e === "normal" || e === "half";
}
function Hf(e) {
  return N(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function Xt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Wf(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function N(e) {
  return !!(e && typeof e == "object");
}
const Kf = "data-paranormal-toolkit-resistance-skill", Yf = "data-paranormal-toolkit-resistance-skill-label", yn = "data-paranormal-toolkit-multi-target-section", Tr = "data-paranormal-toolkit-multi-target-damage-info", zi = "data-paranormal-toolkit-multi-target-effect-info", ji = "data-paranormal-toolkit-multi-target-toggle", Vi = "data-paranormal-toolkit-multi-target-details", D = "data-paranormal-toolkit-multi-target-target", Qf = "data-paranormal-toolkit-multi-target-state", An = "data-paranormal-toolkit-multi-target-roll-total", Tn = "data-paranormal-toolkit-multi-target-roll-formula", dt = "data-paranormal-toolkit-multi-target-roll-dice", $n = "data-paranormal-toolkit-multi-target-roll-skill", Rn = "data-paranormal-toolkit-multi-target-roll-skill-label", wn = "data-paranormal-toolkit-multi-target-roll-target-name", kn = "data-paranormal-toolkit-multi-target-roll-rolled-at", En = "data-paranormal-toolkit-multi-target-damage-mode", In = "data-paranormal-toolkit-multi-target-damage-input-amount", Ra = "data-paranormal-toolkit-multi-target-damage-final-amount", wa = "data-paranormal-toolkit-multi-target-damage-blocked", Cn = "data-paranormal-toolkit-multi-target-damage-target-name", Sn = "data-paranormal-toolkit-multi-target-damage-applied-at", Ln = "data-paranormal-toolkit-multi-target-effect-condition-id", Dn = "data-paranormal-toolkit-multi-target-effect-condition-label", vn = "data-paranormal-toolkit-multi-target-effect-effect-id", Pn = "data-paranormal-toolkit-multi-target-effect-created", Nn = "data-paranormal-toolkit-multi-target-effect-refreshed", xn = "data-paranormal-toolkit-multi-target-effect-target-name", On = "data-paranormal-toolkit-multi-target-effect-applied-at", Zf = new hi(Ti()), Xf = new mi(new di()), Jf = new fi(new dr()), ep = new Lf(Jf), tp = new Cf(Xf), np = new Sf(Zf), rp = Si, Ee = pr, Qe = gr, ap = Li;
function op(e) {
  const t = Hi(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), pp(e);
  const n = gp(e.rollCard, t), r = hp(e.rollCard, t);
  !n && r && Qp(e.rollCard, r, e.effectSection);
  const a = $p(e.rollCard);
  return Yi(a, t), Wp(
    e.rollCard,
    a,
    bp(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && Zp(e.rollCard, r, a), !0;
}
function Hi(e) {
  return Qm({
    ...e,
    resistanceResults: lp(e.rollCard),
    damageApplications: cp(e.rollCard),
    effectApplications: up(e.rollCard),
    resolveTargetConditionApplication: ip,
    resistanceGateMode: Rr()
  });
}
function ip(e, t) {
  const n = qf(e), r = ff(n);
  if (!r) return null;
  const a = Ct(r);
  if (!a.ok) return null;
  const o = (a.value.conditionApplications ?? []).filter((l) => l.actor === "target");
  if (o.length === 0) return null;
  const s = sp(o, t);
  return s ? {
    conditionId: s.conditionId,
    conditionLabel: s.label ?? s.conditionId,
    duration: s.duration ?? null,
    source: s.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null
  } : null;
}
function sp(e, t) {
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const n = Ia(t);
  return n ? e.find((r) => [
    r.label,
    r.conditionId
  ].some((a) => Ia(a) === n)) ?? null : null;
}
function lp(e) {
  const t = Of(e);
  for (const [n, r] of fp(e))
    t.set(n, r);
  return t;
}
function cp(e) {
  const t = Ff(e);
  for (const [n, r] of mp(e))
    t.set(n, r);
  return t;
}
function up(e) {
  const t = Uf(e);
  for (const [n, r] of dp(e))
    t.set(n, r);
  return t;
}
function dp(e) {
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
function mp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${D}]`)) {
    const r = n.getAttribute(D), a = n.getAttribute(En), o = os(n.getAttribute(In)), s = n.getAttribute(Cn), l = n.getAttribute(Sn);
    !r || !eg(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function fp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${D}]`)) {
    const r = n.getAttribute(D), a = os(n.getAttribute(An)), o = n.getAttribute(Tn), s = n.getAttribute($n), l = n.getAttribute(Rn), u = n.getAttribute(wn), d = n.getAttribute(kn);
    !r || a === null || !o || !s || !l || !u || !d || t.set(r, {
      targetId: r,
      targetName: u,
      skill: s,
      skillLabel: l,
      formula: o,
      total: a,
      diceBreakdown: n.getAttribute(dt),
      rolledAt: d
    });
  }
  return t;
}
function pp(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function gp(e, t) {
  if (!t.damage)
    return Wi(e)?.remove(), null;
  const n = _p(e);
  return yp(n, t.damage), Tp(e, n), n;
}
function hp(e, t) {
  if (!t.effect)
    return as(e)?.remove(), null;
  const n = Kp(e);
  return Yp(n, t.effect), n;
}
function bp(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : Ye(e, "Conjuração");
}
function _p(e) {
  const t = Wi(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Tr, "true"), n;
}
function Wi(e) {
  return e.querySelector(`[${Tr}="true"]`);
}
function yp(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(Ki(t.formula, t.total, t.diceBreakdown));
}
function Ki(e, t, n, r = !1) {
  const a = zm({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Ap(a, r), a;
}
function Ap(e, t) {
  const n = e.querySelector(Pt), r = e.querySelector(cr);
  if (!n || !r) return;
  e.classList.toggle(lr, t), n.hidden = !t, r.classList.add(ur), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function Tp(e, t) {
  const n = Ye(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function $p(e) {
  const t = e.querySelector(`[${yn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(yn, "true"), n;
}
function Yi(e, t) {
  const n = Rp(e);
  e.replaceChildren(wp(t), Ep(t, n));
}
function Rp(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${D}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(D)).filter(Jp)
  );
}
function wp(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = kp(e.targets), t.append(n, r), t;
}
function kp(e) {
  const t = e.length, n = e.filter((l) => l.state === Qe).length, r = e.filter((l) => l.state === Ee).length, a = e.filter((l) => l.state === rp).length, o = e.filter((l) => l.state === ap).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Ep(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(Ip(r, e, t.has(r.id)));
  return n;
}
function Ip(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(D, e.id), r.setAttribute(Qf, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Qi(r, e.resistanceResult), Zi(r, e.damageApplication), Xi(r, e.effectApplication);
  const a = Cp(e, t, r), o = zp(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    Ea(s.target) || ka(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || Ea(s.target) || (s.preventDefault(), ka(r));
  }), r.append(a, o), r;
}
function Qi(e, t) {
  if (!t) {
    e.removeAttribute(An), e.removeAttribute(Tn), e.removeAttribute(dt), e.removeAttribute($n), e.removeAttribute(Rn), e.removeAttribute(wn), e.removeAttribute(kn);
    return;
  }
  e.setAttribute(An, String(t.total)), e.setAttribute(Tn, t.formula), e.setAttribute($n, t.skill), e.setAttribute(Rn, t.skillLabel), e.setAttribute(wn, t.targetName), e.setAttribute(kn, t.rolledAt), t.diceBreakdown ? e.setAttribute(dt, t.diceBreakdown) : e.removeAttribute(dt);
}
function Zi(e, t) {
  if (!t) {
    e.removeAttribute(En), e.removeAttribute(In), e.removeAttribute(Ra), e.removeAttribute(wa), e.removeAttribute(Cn), e.removeAttribute(Sn);
    return;
  }
  e.setAttribute(En, t.mode), e.setAttribute(In, String(t.inputAmount)), e.removeAttribute(Ra), e.removeAttribute(wa), e.setAttribute(Cn, t.targetName), e.setAttribute(Sn, t.appliedAt);
}
function Xi(e, t) {
  if (!t) {
    e.removeAttribute(Ln), e.removeAttribute(Dn), e.removeAttribute(vn), e.removeAttribute(Pn), e.removeAttribute(Nn), e.removeAttribute(xn), e.removeAttribute(On);
    return;
  }
  e.setAttribute(Ln, t.conditionId), e.setAttribute(Dn, t.conditionLabel), e.setAttribute(vn, t.effectId ?? ""), e.setAttribute(Pn, String(t.created)), e.setAttribute(Nn, String(t.refreshed)), e.setAttribute(xn, t.targetName), e.setAttribute(On, t.appliedAt);
}
function Cp(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = Sp(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Lp(e, t.resistance);
  Np(l, n, e, t);
  const u = qp(n);
  a.append(o, s, l, u);
  const d = document.createElement("div");
  return d.classList.add(`${i}__target-summary-actions`), ns(d, [
    Ji(e, t, "compact"),
    ts(e, t, "compact")
  ]), r.append(a, d), r;
}
function Sp(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Lp(e, t) {
  if (!le())
    return Dp(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Pp(e, t)), t?.skill && (n.setAttribute(Kf, t.skill), n.setAttribute(Yf, t.skillLabel ?? ae(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Ee ? "✓" : e.state === Qe ? "✕" : "", n.append(r, a), n;
}
function Dp(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", vp(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Ee ? "✓" : e.state === Qe ? "✕" : "", n.append(r, a), n;
}
function vp(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Ee ? "sucesso" : e.state === Qe ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function Pp(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Ee ? "sucesso" : e.state === Qe ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Np(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !le() || e.addEventListener("click", (a) => {
    a.stopPropagation(), xp(t, e, n, r);
  });
}
async function xp(e, t, n, r) {
  if (!le()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? ae(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = br(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const u = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await ep.execute({ actor: l, skill: o, skillLabel: s });
    await Xp(d.roll);
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
    Qi(e, m);
    try {
      await Mf(r.rollCard, m);
    } catch (b) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", b);
    }
    $r(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = u;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function $r(e) {
  const t = e.closest(`[${yn}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Hi({
    rollCard: n,
    damageSection: Op(n) ?? Ye(n, "Dano"),
    effectSection: Mp(n)
  });
  r && Yi(t, r);
}
function Op(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Tr) !== "true") ?? null;
}
function Mp(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Fp(e) {
  return ke(e.assistedActions.policy.damageActionState);
}
function Bp(e) {
  return ke(e.assistedActions.policy.effectActionState);
}
function Rr() {
  try {
    return or();
  } catch {
    return "strict";
  }
}
function Ji(e, t, n) {
  if (e.damageApplication)
    return M(
      "✓",
      Ni({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (ke(r))
    return M(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = es(a, t.damage);
  if (o === null)
    return M(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = If({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", u = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, d = M(
    l,
    s,
    [`${i}__target-action--damage`, u],
    !1
  );
  return d.title = `Aplicar ${s} em ${e.name}`, d.setAttribute("aria-label", d.title), d.addEventListener("click", (m) => {
    m.stopPropagation();
    const b = d.closest(`[${D}]`);
    b && Up(b, d, e, t);
  }), d;
}
function es(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Up(e, t, n, r) {
  if (n.damageApplication) return;
  if (Fp(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = es(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = br(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const u = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const d = await tp.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Rr(),
      resistanceState: n.assistedActions.resistanceState
    });
    if (!d.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${d.error.message}`), t.innerHTML = u;
      return;
    }
    const m = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      mode: o,
      inputAmount: s,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Zi(e, m);
    try {
      await Bf(r.rollCard, m);
    } catch (b) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", b);
    }
    try {
      await wf(d.value);
    } catch (b) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", b);
    }
    $r(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = u;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function ts(e, t, n) {
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
  if (ke(r))
    return M(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if ($i(r))
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
    s && Gp(s, a, e, t);
  }), a;
}
async function Gp(e, t, n, r) {
  if (n.effectApplication) return;
  if (Bp(n)) {
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
  const o = br(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await np.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: Rr(),
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
    Xi(e, u);
    try {
      await Gf(r.rollCard, u);
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
function ns(e, t) {
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
function qp(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(ji, "true"), t.setAttribute("aria-hidden", "true"), rs(e, t), t;
}
function ka(e) {
  const t = e.querySelector(`[${Vi}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${ji}="true"]`);
  r && rs(e, r);
}
function rs(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function Ea(e) {
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
function zp(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Vi, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = jp(e, t.resistance);
  s && r.append(s);
  const l = Vp(e, t.resistance), u = Hp(e, t);
  return n.append(r, l, u), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function jp(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Ee ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function Vp(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = Ki(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function Hp(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), ns(n, [
    Ji(e, t, "full"),
    ts(e, t, "full")
  ]), n;
}
function Wp(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Kp(e) {
  const t = as(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(zi, "true"), n;
}
function as(e) {
  return e.querySelector(`[${zi}="true"]`);
}
function Yp(e, t) {
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
function Qp(e, t, n) {
  const r = n?.parentElement === e ? n : Ye(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function Zp(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Ia(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Xp(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Jp(e) {
  return typeof e == "string" && e.length > 0;
}
function eg(e) {
  return e === "normal" || e === "half";
}
function Ca(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function os(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Sa = "data-paranormal-toolkit-card-layout-refresh-bound";
function tg(e) {
  const t = e.rollCard.querySelector(vt);
  t && t.getAttribute(Sa) !== "true" && (t.setAttribute(Sa, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const _e = "data-paranormal-toolkit-prompt-id", ng = "apply-damage", rg = "data-paranormal-toolkit-multi-target-damage-info";
function ag(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(rg) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function og(e) {
  const t = sg(e);
  return t.find((n) => n.getAttribute(vf) === ng) ?? t.find((n) => Oi(n) === "aplicar danos") ?? null;
}
function ig(e) {
  const t = is(e), n = La(t);
  return n || La(lg(e));
}
function La(e) {
  return e.find((t) => {
    const n = Oi(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function sg(e) {
  const t = is(e);
  return t.length > 0 ? t : wr(e);
}
function is(e) {
  const t = dg(e);
  return t ? wr(e).filter((n) => ug(n, t)) : [];
}
function lg(e) {
  const t = ss(e);
  if (!t) return [];
  const n = cg(e, t);
  return wr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => ls(e, r)).filter((r) => !n || mg(r, n));
}
function wr(e) {
  const t = ss(e);
  return t ? Array.from(t.querySelectorAll(Df)) : [];
}
function ss(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function cg(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && ls(e, n)) ?? null;
}
function ug(e, t) {
  return e.getAttribute(_e) === t ? !0 : Array.from(e.querySelectorAll(`[${_e}]`)).some((n) => n.getAttribute(_e) === t);
}
function dg(e) {
  return e.getAttribute(_e) ?? e.querySelector(`[${_e}]`)?.getAttribute(_e) ?? null;
}
function ls(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function mg(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function fg(e) {
  const t = cs(), n = Ii(e.rollCard).state, r = fr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel }
  }), a = r.policy.effectActionState, o = ke(a), s = $i(a);
  return e.applied ? Ne({
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
  }) : r.policy.canShowApplyEffect ? Ne(o ? {
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
  }) : Ne({
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
function Ne(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function pg(e) {
  const { rollCard: t } = e, n = bg(), r = cs(), a = Ii(t).state, o = fr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = ke(s), u = hg(e);
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
      summary: gg(a)
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
function gg(e) {
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
function hg(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function bg() {
  try {
    return Pc();
  } catch {
    return "assisted";
  }
}
function cs() {
  try {
    return or();
  } catch {
    return "strict";
  }
}
const _g = "data-paranormal-toolkit-damage-resolution-state", Da = "data-paranormal-toolkit-damage-icon-enhanced", kr = "data-paranormal-toolkit-damage-original-label", yg = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, us = "Outra opção escolhida";
function Ag(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), xf(t, "Aplicar dano"), Tg(e, t);
}
function Tg(e, t) {
  const n = Array.from(t.querySelectorAll(ht)), r = Pa(n, "normal"), a = Pa(n, "half");
  if (!r || !a) {
    $g(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  Na(r, "normal"), Na(a, "half");
  const o = pg({
    rollCard: e,
    normalButtonApplied: bt(r),
    halfButtonApplied: bt(a),
    normalButtonSkipped: Mn(r),
    halfButtonSkipped: Mn(a)
  });
  if (!o.canShowApplyDamage) {
    xa(r), xa(a), Oa(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), va(r, o.normalButton), va(a, o.halfButton), Oa(t, o.summary.state, o.summary.message);
}
function va(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    wg(e, t.visible), kg(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function $g(e) {
  for (const t of e)
    Mn(t) && t.remove();
}
function bt(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(us);
}
function Mn(e) {
  return e.textContent?.includes(us) ?? !1;
}
function Pa(e, t) {
  const n = yg[t];
  return e.find((r) => n.test(Rg(r))) ?? null;
}
function Rg(e) {
  return [
    e.getAttribute(kr),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function Na(e, t) {
  if (e.getAttribute(Da) === "true") return;
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
  ), e.setAttribute(Da, "true"), e.setAttribute(kr, n), e.setAttribute("aria-label", n), e.replaceChildren(r, ce(n));
}
function xa(e) {
  bt(e) || e.remove();
}
function wg(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function kg(e, t, n, r = "Role resistência") {
  if (!bt(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(ce(r));
      return;
    }
    e.removeAttribute("aria-disabled"), Eg(e, n);
  }
}
function Eg(e, t) {
  const n = e.getAttribute(kr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(Ig(t), ce(n)));
}
function Ig(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function Oa(e, t, n) {
  e.setAttribute(_g, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(_r)?.after(a);
}
const je = "data-paranormal-toolkit-effect-icon-enhanced", $e = "data-paranormal-toolkit-effect-action-compacted", Ot = "data-paranormal-toolkit-effect-resistance-gate", Er = "data-paranormal-toolkit-effect-section", Ir = "data-paranormal-toolkit-effect-label";
function Cg(e) {
  return e.querySelector(`[${Er}="true"]`);
}
function Sg(e) {
  const t = Dg(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? vg(), r = Gg(n, e.sourceActions, t);
  return r && n.setAttribute(Ir, r), Pg(n, t, r), Bg(e.rollCard, n, e.after ?? e.fallbackAfter), Ug(e.sourceActions, n), n;
}
function Lg(e, t) {
  const n = t.querySelector(ht);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = fs(t, n, r), o = fg({
    rollCard: e,
    effectLabel: a,
    applied: Cr(n, r)
  });
  if (o.applied) {
    zg(n);
    return;
  }
  if (!o.visible) {
    jg(n);
    return;
  }
  if (o.waitingForResistance) {
    Vg(n, o.actionLabel);
    return;
  }
  if (o.resisted) {
    Hg(n, o.compactLabel);
    return;
  }
  Wg(n), ms(n, o.displayLabel);
}
function Dg(e) {
  return e.sourceActions?.querySelector(ht) ?? e.existingSection?.querySelector(ht) ?? null;
}
function vg() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Er, "true"), e;
}
function Pg(e, t, n) {
  e.setAttribute(Er, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = Ng(e), a = xg(r);
  a.textContent = "Efeito";
  const o = Og(e, r), s = Mg(o);
  s.textContent = Kg(n ?? fs(e, t, t.textContent?.trim() ?? ""));
  const l = Fg(o);
  t.parentElement !== l && l.append(t);
  const u = t.textContent?.trim() ?? "";
  !Cr(t, u) && !qg(t, u) && ms(t, n ?? u);
}
function Ng(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function xg(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function Og(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function Mg(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function Fg(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function Bg(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Ug(e, t) {
  !e || e === t || e.remove();
}
function Gg(e, t, n) {
  const r = e.getAttribute(Ir);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || ds(n, n.textContent?.trim() ?? "");
}
function ds(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && W(n) !== "efeito aplicado") return n;
  const r = Sm(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && W(a) !== "aplicado" ? a : null;
}
function Cr(e, t) {
  return e.classList.contains(Pf) || W(t).includes("aplicado");
}
function qg(e, t) {
  const n = e.getAttribute(Ot);
  if (n === "pending" || n === "resisted") return !0;
  const r = Lm(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function ms(e, t) {
  e.getAttribute($e) === "true" && e.getAttribute(je) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute($e, "true"), e.setAttribute(je, "true"), e.setAttribute(Nf, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    yr("✦", `${i}__button-icon--effect`),
    ce("Aplicar")
  ));
}
function zg(e) {
  e.getAttribute($e) === "true" && W(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute($e, "true"), e.setAttribute(je, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    yr("✓", `${i}__button-icon--effect-applied`),
    ce("Aplicado")
  ));
}
function fs(e, t, n) {
  const r = e.getAttribute(Ir) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : ds(t, n) ?? n;
}
function jg(e) {
  Cr(e, e.textContent?.trim() ?? "") || e.remove();
}
function Vg(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute($e), e.removeAttribute(je), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Ot, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(ce(t));
}
function Hg(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute($e), e.removeAttribute(je), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Ot, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    yr("✓", `${i}__button-icon--effect-resisted`),
    ce(t)
  );
}
function Wg(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Ot), e.removeAttribute("aria-disabled");
}
function Kg(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const Yg = "data-paranormal-toolkit-card-layout-normalized";
function Qg(e) {
  const t = Zg(e.rollCard), n = Xg(t);
  return tg({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function Zg(e) {
  return {
    rollCard: e,
    damageSection: ag(e),
    resistance: e.querySelector(sr),
    damageActions: og(e),
    effectActionSource: ig(e),
    effectSection: Cg(e)
  };
}
function Xg(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(Yg, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = Ye(t, "Conjuração"), u = Jg({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), Ag(t, a));
  const d = Sg({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: eh(n, u),
    fallbackAfter: l
  });
  return d && Lg(t, d), d;
}
function Jg(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function eh(e, t) {
  return e ?? t;
}
const ps = [0, 80, 180, 400, 900, 1600, 3e3], Ma = /* @__PURE__ */ new WeakSet();
function th(e) {
  gs(e), nh(e);
}
function gs(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    hs(t);
}
function nh(e) {
  if (!Ma.has(e)) {
    Ma.add(e);
    for (const t of ps)
      globalThis.setTimeout(() => {
        gs(e);
      }, t);
  }
}
function hs(e) {
  const t = Qg({
    rollCard: e,
    refreshDelaysMs: ps,
    onRefresh: () => hs(e)
  });
  op({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const rh = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function ah(e) {
  for (const t of Array.from(e.querySelectorAll(sr)))
    oh(t);
  th(e);
}
function oh(e) {
  const t = e.querySelector(bu), n = e.querySelector(ai), r = e.querySelector(vt), a = e.querySelector(oi);
  if (!r || !t && !n && !a) return;
  const o = ih(e, r);
  t && t.parentElement !== o && o.append(t), n && n.parentElement !== o && o.append(n), a && (a.parentElement !== e && !r.contains(a) && e.append(a), sh(a)), r.parentElement !== e && e.append(r);
}
function ih(e, t) {
  const n = e.querySelector(`.${la}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(la), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function sh(e) {
  const t = lh(e.textContent ?? "");
  t && (e.setAttribute(rh, "true"), e.replaceChildren(dh(t)));
}
function lh(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: u } = ch(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: u
  } : null;
}
function ch(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: uh(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function uh(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function dh(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = mh(e);
  return r && t.append(r), t;
}
function mh(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of fh(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function fh(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Fa(e, "highest") : n.includes("kl") ? Fa(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Fa(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function Ba(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Sr() {
  const e = globalThis.game;
  return Mt(e) ? e : null;
}
function P(e, t) {
  const n = ph(e, t);
  return mt(n);
}
function ph(e, t) {
  return t.split(".").reduce((n, r) => Mt(n) ? n[r] : null, e);
}
function gh(e, t) {
  const n = e.indexOf(":");
  return n < 0 || Ve(e.slice(0, n)) !== Ve(t) ? null : Ie(e.slice(n + 1));
}
function mt(e) {
  return typeof e == "string" ? Ie(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Mt(e) {
  return !!e && typeof e == "object";
}
function hh(e) {
  return typeof e == "string";
}
function Ft(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Ie(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function Ve(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Fn(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function K(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function bs(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function bh(e) {
  for (const t of Array.from(e.querySelectorAll(pu))) {
    const n = wh(t);
    _h(t), n && (yh(t, n), Ah(t, n));
  }
}
function _h(e) {
  for (const t of Array.from(e.querySelectorAll(gu)))
    t.remove();
}
function yh(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(ri) ?? null, a = r?.querySelector(fu) ?? null, o = r ?? e, s = o.querySelector(Au);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = Gh(t.elementTone), l.textContent = Uh(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function Ah(e, t) {
  const n = Th(e);
  $h(e, n);
  const r = Rh(t);
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
  const o = e.querySelector(ii);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function Th(e) {
  return e.closest(`.${i}`)?.querySelector(ri) ?? null;
}
function $h(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(Tu)))
      a.remove();
}
function Rh(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Fn(e.target)}` : null,
    e.duration ? `Duração: ${Fn(e.duration)}` : null,
    e.resistance ? `Resistência: ${bs(e.resistance)}` : null
  ].filter(Ft);
}
function wh(e) {
  const t = kh(e), n = Dh(e), a = (t ? Lh(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = Lr(P(a, "element")), l = G("op.elementChoices", s) ?? Ua(te(o, "Elemento")) ?? Ua(n.damageType), u = s ?? qh(l), d = P(a, "circle") ?? te(o, "Círculo"), m = Nh(a) ?? te(o, "Alvo"), b = Fh(a, "duration", "op.durationChoices") ?? te(o, "Duração"), T = vh(e) ?? Oh(a) ?? te(o, "Resistência"), $ = Ph(o) ?? n.cost, g = {
    elementLabel: l,
    elementTone: u,
    circle: d,
    cost: $,
    target: m,
    duration: b,
    resistance: T
  };
  return Bh(g) ? g : null;
}
function kh(e) {
  const t = Eh(e);
  if (!t) return null;
  const n = t.getFlag?.(c, Dt), r = Ch(n);
  if (r.length === 0) return null;
  const a = Ih(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function Eh(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Sr()?.messages?.get?.(n) ?? null : null;
}
function Ih(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${sa}]`))) {
    const a = r.getAttribute(sa)?.trim();
    a && n.add(a);
  }
  return n;
}
function Ch(e) {
  if (!Mt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Sh).filter((n) => n !== null) : [];
}
function Sh(e) {
  return Mt(e) ? {
    pendingId: mt(e.pendingId),
    actorId: mt(e.actorId),
    itemId: mt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(hh) : []
  } : null;
}
function Lh(e) {
  if (!e.itemId) return null;
  const t = Sr(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Dh(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(hu))) {
    const a = Ie(r.textContent);
    if (!a) continue;
    const o = gh(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function vh(e) {
  const t = Ie(e.querySelector(ai)?.textContent);
  return t ? bs(t) : null;
}
function te(e, t) {
  const n = Ve(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || Ve(r.slice(0, a)) !== n))
      return Ie(r.slice(a + 1));
  }
  return null;
}
function Ph(e) {
  const t = te(e, "Custo") ?? te(e, "PE");
  return t || (e.map(Ie).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Nh(e) {
  const t = P(e, "target");
  if (!t) return null;
  if (t === "area")
    return xh(e) ?? G("op.targetChoices", t) ?? "Área";
  const n = G("op.targetChoices", t) ?? K(t);
  return [t === "people" || t === "creatures" ? P(e, "targetQtd") : null, n].filter(Ft).join(" ");
}
function xh(e) {
  const t = P(e, "area.name"), n = P(e, "area.size"), r = P(e, "area.type"), a = t ? G("op.areaChoices", t) ?? K(t) : null, o = r ? G("op.areaTypeChoices", r) ?? K(r) : null;
  return a ? n ? o ? `${a} ${n}m ${Fn(o)}` : `${a} ${n}m` : a : null;
}
function Oh(e) {
  const t = P(e, "skillResis"), n = P(e, "resistance");
  if (!t || !n) return null;
  const r = G("op.skill", t) ?? K(t), a = Mh(n);
  return [r, a].filter(Ft).join(" ");
}
function Mh(e) {
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
function Fh(e, t, n) {
  const r = P(e, t);
  return r ? G(n, r) ?? K(r) : null;
}
function Bh(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Uh(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Gh(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Ft).join(" ");
}
function Lr(e) {
  const t = Ve(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Ua(e) {
  const t = Lr(e);
  return t ? G("op.elementChoices", t) ?? K(t) : e ? K(e) : null;
}
function qh(e) {
  return Lr(e);
}
function G(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Sr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Ga = "data-paranormal-toolkit-dice-toggle-enhanced";
function zh(e) {
  for (const t of Array.from(e.querySelectorAll(si)))
    _s(t);
}
function jh(e) {
  const t = As(e.target);
  if (!t) return;
  const n = Dr(t);
  n && (e.preventDefault(), ys(n, t));
}
function Vh(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = As(e.target);
  if (!t) return;
  const n = Dr(t);
  n && (e.preventDefault(), ys(n, t));
}
function _s(e) {
  const t = e.querySelector(Pt);
  if (!t) return;
  const n = e.querySelector(cr);
  if (n && n.getAttribute(Ga) !== "true" && (n.setAttribute(Ga, "true"), n.classList.add(ur), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function ys(e, t) {
  const n = e.querySelector(Pt);
  if (!n) return;
  const r = !e.classList.contains(lr);
  Hh(e, t, n, r);
}
function Hh(e, t, n, r) {
  e.classList.toggle(lr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function As(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(cr);
  if (!t) return null;
  const n = Dr(t);
  return n ? (_s(n), t.classList.contains(ur) ? t : null) : null;
}
function Dr(e) {
  const t = e.closest(si);
  return t && t.querySelector(Pt) ? t : null;
}
const qa = `${c}-workflow-dice-toggle-styles`;
function Wh() {
  if (document.getElementById(qa)) return;
  const e = document.createElement("style");
  e.id = qa, e.textContent = `
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
const Kh = [0, 100, 500, 1500, 3e3];
let za = !1, Jt = null;
function Yh() {
  if (!za) {
    za = !0, Wh(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Be(Ba(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Be(Ba(t));
    }), Hooks.once("ready", () => {
      Be(document), Qh();
    }), document.addEventListener("click", jh), document.addEventListener("keydown", Vh);
    for (const e of Kh)
      globalThis.setTimeout(() => Be(document), e);
  }
}
function Qh() {
  Jt || !document.body || (Jt = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Be(n);
  }), Jt.observe(document.body, { childList: !0, subtree: !0 }));
}
function Be(e) {
  e && (Bu(e), bh(e), ah(e), zh(e), Du(e));
}
function Zh() {
  Yh();
}
const Xh = "data-paranormal-toolkit-action-section", Jh = "ritual-log", eb = ".paranormal-toolkit-item-use-prompt__actions", tb = ".paranormal-toolkit-item-use-prompt__actions-title", nb = [0, 100, 500, 1500];
let ja = !1;
function rb() {
  if (ja) return;
  const e = (t, n) => {
    Va(sb(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Va(document), ja = !0;
}
function Va(e) {
  for (const t of nb)
    globalThis.setTimeout(() => ab(e), t);
}
function ab(e) {
  ob(e), ib(e);
}
function ob(e) {
  for (const t of e.querySelectorAll(
    `[${Xh}="${Jh}"]`
  ))
    t.remove();
}
function ib(e) {
  for (const t of e.querySelectorAll(eb)) {
    if (Ha(t.querySelector(tb)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => Ha(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function sb(e) {
  if (e instanceof HTMLElement || lb(e))
    return e;
  if (cb(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function lb(e) {
  return e instanceof HTMLElement;
}
function cb(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Ha(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Ue = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Ts = {
  PV: "system.attributes.hp"
}, Bn = {
  PV: [Ue.PV, Ts.PV],
  SAN: [Ue.SAN],
  PE: [Ue.PE],
  PD: [Ue.PD]
}, Un = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class ub {
  getResource(t, n) {
    const r = Wa(t, n);
    if (!r.ok)
      return p(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), u = foundry.utils.getProperty(t, s), d = Ya(t, n, o, l, "valor atual");
    if (d) return p(d);
    const m = Ya(t, n, s, u, "valor máximo");
    return m ? p(m) : _({
      value: l,
      max: u
    });
  }
  async updateResourceValue(t, n, r) {
    const a = Wa(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function Wa(e, t) {
  const n = db(e.type, t);
  if (n && Ka(e, n))
    return _(n);
  const r = Bn[t].find(
    (a) => Ka(e, a)
  );
  return r ? _(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: mb(e, t),
    path: Bn[t].join(" | ")
  });
}
function db(e, t) {
  return e === "threat" ? Ts[t] ?? null : e === "agent" ? Ue[t] : null;
}
function Ka(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function mb(e, t) {
  const n = e.type ?? "unknown", r = Bn[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Ya(e, t, n, r, a) {
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
class fb {
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
    const { path: r, value: a } = n, o = pb(a);
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
function pb(e) {
  if (Qa(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Qa(n))
      return n;
  }
  return null;
}
function Qa(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const gb = "dice-so-nice";
async function $s(e) {
  if (!hb() || !bb()) return;
  const t = _b();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function hb() {
  try {
    return mu().enabled;
  } catch {
    return !1;
  }
}
function bb() {
  return game.modules?.get?.(gb)?.active === !0;
}
function _b() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Za = "occultism";
class Rs {
  getDifficulty(t) {
    return yb(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await Tb(t, Za);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await $s(r);
    const a = wb(r);
    return {
      skill: Za,
      skillLabel: "Ocultismo",
      roll: r,
      formula: Rb(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: kb(r)
    };
  }
}
function yb(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Ab(e) {
  return new Rs().rollCastingCheck(e);
}
async function Tb(e, t) {
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
  return $b(r);
}
function $b(e) {
  return Xa(e) ? e : Array.isArray(e) ? e.find(Xa) ?? null : null;
}
function Xa(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Rb(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function wb(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function kb(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Eb);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Eb(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Ib = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Cb {
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
    const r = n.value, a = Sb(t.ritual, r);
    return a.ok ? a.value ? _(a.value) : _({
      resource: "PE",
      amount: Ib[r],
      source: "default-by-circle",
      circle: r
    }) : p(a.error);
  }
}
function Sb(e, t) {
  const n = e.getFlag(c, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Lb(n) ? {
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
function Lb(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const en = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Db(e) {
  if (!Mb(e.item)) return null;
  const t = Gn(e.actor) ? e.actor : vb(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Nb(e.token) ?? Pb(t),
    targets: ar(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function vb(e) {
  const t = e;
  return Gn(t.actor) ? t.actor : Gn(e.parent) ? e.parent : null;
}
function Pb(e) {
  const t = xb(e) ?? Ob(e);
  return t ? ws(t) : null;
}
function Nb(e) {
  return qn(e) ? ws(e) : null;
}
function xb(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return qn(n) ? n : (t.getActiveTokens?.() ?? []).find(qn) ?? null;
}
function Ob(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function ws(e) {
  const t = e.actor ?? null;
  return {
    tokenId: tn(e.id),
    actorId: tn(t?.id),
    sceneId: tn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Mb(e) {
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
class Fb {
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
    const n = Db(Bb(t));
    if (!n) {
      f.warn(`${en.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Bb(e) {
  return e && typeof e == "object" ? e : {};
}
class Ub {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return nn("missing-item-patch");
    if (t.type !== "ritual") return nn("unsupported-item-type");
    const a = Gb(r);
    return Object.keys(a).length === 0 ? nn("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function Gb(e) {
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
class qb {
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
class zb {
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
class jb {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Vb(t);
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
    return this.list().map((n) => Hb(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Vb(e) {
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
function Hb(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = Wb(a, t);
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
function Wb(e, t) {
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
      const n = Ja(t.name), r = e.names.map(Ja).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Kb(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Ja(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Kb(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function rn(e) {
  return structuredClone(e);
}
function an(e) {
  return typeof e == "string" && e.length > 0;
}
function _t(e, t) {
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
async function Yb(e, t, n) {
  if (!eo(e.id) || !eo(e.formula))
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
    await $s(a);
    const l = {
      ...n.rollRequests[e.id] ?? ks(e, t),
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
function ks(e, t) {
  const n = e.intent ?? Qb(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function Qb(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function eo(e) {
  return typeof e == "string" && e.length > 0;
}
async function yt(e, t, n, r, a) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? it(t, n, r, a) : e.spend(t, n, a);
    case "damage":
      return n !== "PV" && n !== "SAN" ? it(t, n, r, a) : e.damage(t, n, a);
    case "heal":
      return n !== "PV" ? it(t, n, r, a) : e.heal(t, n, a);
    case "recover":
      return n !== "SAN" ? it(t, n, r, a) : e.recover(t, n, a);
  }
}
function it(e, t, n, r) {
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
function Zb(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = Xb(t, n, r, a);
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
    const s = Jb(t, n, r, a);
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
function Xb(e, t, n, r) {
  const a = Bt(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Es(t.id, "damage", r, t.damageInstances.length),
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
function Jb(e, t, n, r) {
  const a = Bt(e.amountFrom);
  return {
    id: Es(t.id, "healing", r, t.healingInstances.length),
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
function Es(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function e_(e, t, n) {
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
function t_(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), Is("before", e), to("before", e), to("resolve", e);
}
function n_(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), Is("apply", e);
}
function r_(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function Is(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = a_(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function to(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function a_(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function o_(e, t, n) {
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
async function i_(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return s_(e, t);
    case "spendRitualCost":
      return l_(e, t);
  }
}
async function s_(e, t) {
  const { context: n, resources: r } = e, a = _t(t, n);
  return a.ok ? Cs(await r.spend(n.sourceActor, t.resource, a.value), n) : p(a.error);
}
async function l_(e, t) {
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
async function c_(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = u_(t);
  for (const u of s.before)
    a.emit(u, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const u of s.after)
    a.emit(u, n, { stepIndex: r, step: t });
  return l;
}
function u_(e) {
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
class d_ {
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
        return c_({
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
    const a = await i_({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? _(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = ks(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), _(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await Yb(t, r, n);
    return a.ok ? _(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = _t(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = e_(t, n, a.value);
    t_({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), n_({
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
      const u = await yt(this.resources, l, t.resource, t.operation, a.value), d = this.handleResourceOperationResult(u, n, r, t);
      if (!d.ok)
        return d;
      Zb({
        step: t,
        context: n,
        transaction: d.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return r_({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), _(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = _t(t, n);
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
      const l = await yt(this.resources, s, t.resource, t.operation, a.value), u = this.handleResourceOperationResult(l, n, r, t);
      if (!u.ok)
        return u;
    }
    return _(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await o_(this.messages, t, n);
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
    const l = m_(t, n.intent);
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
function m_(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class f_ {
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
class p_ {
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
function Ss(e) {
  return {
    id: g_(),
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
function g_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class h_ {
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
    const r = Ss(n);
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
class b_ {
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
class __ {
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
      whisper: y_(),
      flags: {
        ...t.flags,
        [c]: {
          ...A_(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = hn();
    if (!r.enabled)
      return;
    const a = n.notification ?? no(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = no(n);
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
function no(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function y_() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function A_(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const T_ = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Ls = `${c}-inline-roll-neutralized`, $_ = `${c}-inline-roll-notice`, vr = `data-${c}-inline-roll-neutralized`, ro = `data-${c}-inline-roll-notice`, R_ = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function ao(e) {
  const t = M_(e.message), n = await w_(e.message), r = k_(t);
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
async function w_(e) {
  const t = N_(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = E_(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await x_(t, n.content), replacementCount: n.replacementCount };
}
function k_(e) {
  const t = e ? O_(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Ds(t);
  return n > 0 && vs(D_(t)), { replacementCount: n };
}
function E_(e) {
  const t = I_(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Ds(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (vs(n.content), { content: n.innerHTML, replacementCount: a });
}
function I_(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, S_(a.trim()))), replacementCount: t };
}
function Ds(e) {
  const t = C_(e);
  for (const n of t)
    n.replaceWith(L_(v_(n)));
  return t.length;
}
function C_(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(T_))
    n.getAttribute(vr) !== "true" && t.add(n);
  return Array.from(t);
}
function S_(e) {
  return `<span class="${Ls}" ${vr}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${F_(e)}</span>`;
}
function L_(e) {
  const t = document.createElement("span");
  return t.classList.add(Ls), t.setAttribute(vr, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function vs(e) {
  if (e.querySelector?.(`[${ro}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add($_), t.setAttribute(ro, "true"), t.textContent = R_, e.append(t);
}
function D_(e) {
  return e.querySelector(".message-content") ?? e;
}
function v_(e) {
  const n = e.getAttribute("data-formula") ?? P_(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function P_(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function N_(e) {
  return e && typeof e == "object" ? e : null;
}
async function x_(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function O_(e) {
  const t = B_(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function M_(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function F_(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function B_(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const At = "ritualRollConfig", ye = "ritual-roll";
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
function Ps(e) {
  const t = e.getFlag(c, At);
  return zn(t);
}
function Ns(e) {
  return Ps(e) ?? Ut();
}
async function U_(e, t) {
  const n = zn(t) ?? zn({
    ...Ut(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(c, At, n), n;
}
async function G_(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, c, At));
    return;
  }
  await e.setFlag(c, At, null);
}
function zn(e) {
  if (!Gt(e)) return null;
  const t = Y_(e.intent);
  if (!t) return null;
  const n = Ut();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Tt(e.damageType),
    utilityLabel: Tt(e.utilityLabel) ?? n.utilityLabel,
    note: Pr(e.note),
    forms: Q_(e.forms)
  };
}
function q_(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function z_(e) {
  const t = Ps(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = j_(t, n), a = [
    { type: "spendRitualCost" },
    r,
    ...V_(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: a,
    ritualForms: W_(e, t),
    resistance: t.intent === "damage" ? xs(e) : void 0
  };
}
function j_(e, t) {
  const n = {
    type: "rollFormula",
    id: ye,
    formula: t,
    intent: K_(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function V_(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${ye}.total`,
          ...H_(e.damageType)
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
function H_(e) {
  return e ? { damageType: e } : {};
}
function W_(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [ye]: n
      }
    }
  };
  return oo(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [ye]: t.forms.discente.formula.trim()
    }
  }), oo(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [ye]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function xs(e) {
  const t = Os(e), n = Tt(t.skillResis), r = Tt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const a = Z_(n);
  return {
    skill: n,
    label: a,
    effect: "reducesByHalf",
    summary: `${a} reduz à metade`
  };
}
function K_(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Y_(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function Q_(e) {
  const t = Ut();
  return Gt(e) ? {
    base: on(e.base),
    discente: on(e.discente),
    verdadeiro: on(e.verdadeiro)
  } : t.forms;
}
function on(e) {
  return Gt(e) ? { formula: Pr(e.formula) } : { formula: "" };
}
function oo(e, t) {
  const n = Os(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return X_(r);
}
function Os(e) {
  const t = e.system;
  return Gt(t) ? t : {};
}
function Z_(e) {
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
function X_(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Pr(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Tt(e) {
  const t = Pr(e);
  return t.length > 0 ? t : null;
}
function Gt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function J_(e) {
  switch (ey(e)) {
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
      return ty(String(e ?? ""));
  }
}
function ey(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function ty(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function ny(e) {
  return {
    header: {
      eyebrow: Jn,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: sy(e.ritual)
    },
    forms: e.variantOptions.map((t) => ry(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: iy(e.automationStatus ?? "assisted")
  };
}
function ry(e, t) {
  const n = ay(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? oy(t) : "—",
    details: n
  };
}
function ay(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function oy(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function iy(e) {
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
function sy(e) {
  const t = e.system, n = [cy(t?.element), ly(t?.circle)].filter(my);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function ly(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function cy(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (uy(e)) {
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
      return dy(e);
  }
}
function uy(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function dy(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function my(e) {
  return typeof e == "string" && e.length > 0;
}
const Ms = ["base", "discente", "verdadeiro"];
function Fs(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function $t(e) {
  return typeof e == "string" && Ms.includes(e);
}
const { ApplicationV2: fy } = foundry.applications.api;
class qe extends fy {
  constructor(t, n) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = ny(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: qe.onCast,
      cancel: qe.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new qe(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    gy(a, (o) => {
      this.selectedVariant = o;
    }), hy(a, (o) => {
      this.spendResource = o;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${I(this.model.header.eyebrow)}</p>
        <div>
          <h2>${I(this.model.header.title)}</h2>
          <p>${I(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(py).join("")}
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
          <div><dt>Custo base</dt><dd>${I(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${I(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${I(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${I(this.model.automation.title)}</strong></p>
        <p>${I(this.model.automation.description)}</p>
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
    const n = yy(t), r = by(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function py(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", a = e.details.map((o) => `<span>${I(o)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${I(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${I(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${I(e.label)}</strong>
        <em>${I(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${a}</span>
    </label>
  `;
}
function gy(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => io(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), io(e, a, t));
    });
  const r = Bs(e);
  r && t(r);
}
function io(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !$t(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Bs(e));
}
function Bs(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && $t(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function hy(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function by(e, t, n) {
  const r = _y(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: a
  };
}
function _y(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if ($t(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return $t(n) ? n : null;
}
function yy(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function I(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function Ay(e) {
  return qe.request(e);
}
const Nr = {
  label: "Padrão"
}, Ty = {
  label: "Discente",
  extraCost: 2
}, $y = {
  label: "Verdadeiro",
  extraCost: 5
};
class Ry {
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
    const r = this.resolveCostPreview(t), a = fA(n), o = uA(
      n,
      t.item,
      r,
      a
    ), s = await Ay({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((S) => S.name),
      cost: r,
      defaultSpendResource: yA(n),
      variantOptions: o,
      automationStatus: a ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = wy(s), u = gA(
      n,
      t.item,
      l.variant,
      a
    ), d = Xo();
    let m = null;
    if (d) {
      const S = await Ey(
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
        m = await Ab(
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
    const b = ky(
      n,
      l,
      u,
      r,
      {
        includeCostSteps: !d
      }
    );
    if (b.steps.length === 0) {
      const S = pA(
        t,
        l
      ), O = so(
        t.actor,
        m,
        u,
        r
      ), de = lo(
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
    const $ = T.value.context, g = Py(
      n,
      t,
      $
    ), j = Cy(
      n,
      t
    ), De = so(
      t.actor,
      m,
      u,
      r
    ), ve = lo(
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
      ...De,
      ...g.actions,
      ...j.actions
    ];
    return ue.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: $,
      summaryLines: ve
    } : {
      status: "ready",
      workflowContext: $,
      actions: ue,
      summaryLines: ve
    };
  }
  async applyAction(t) {
    return yt(
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
function wy(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function ky(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || Or(l) && (!a.includeCostSteps || !s) || o.push(Iy(l, n));
  return a.includeCostSteps && s && r && AA(n.extraCost) && o.push({
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
async function Ey(e, t, n, r, a) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = Ze(a, r);
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
function Iy(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function so(e, t, n, r) {
  if (!t || t.success) return [];
  const a = Ze(r, n);
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
function Cy(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = xr(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = pi(o);
      n.push(
        Sy(
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
function Sy(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? vy(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: Ly(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Dy(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Ly(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Dy(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function vy(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Py(e, t, n) {
  const r = [], a = /* @__PURE__ */ new Map();
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const s = _t(o, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = xr(o.actor, t);
    if (l.length === 0) {
      if (o.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const u of l) {
      if (Ny(o)) {
        xy(
          a,
          u,
          Oy(o, n, s.value)
        );
        continue;
      }
      r.push(Fy(o, u, s.value));
    }
  }
  for (const o of a.values())
    r.push(
      ...My(
        e,
        t.item,
        o.actor,
        o.entries
      )
    );
  return { ok: !0, actions: r };
}
function Ny(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function xy(e, t, n) {
  const r = qy(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Oy(e, t, n) {
  const r = zy(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function My(e, t, n, r) {
  const a = Wy(e), o = a.length > 1 ? Qy() : void 0;
  return a.map((s) => {
    const l = r.map(
      (d, m) => {
        const b = Ky(d.amount, s);
        return {
          id: By(d, s, m),
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
      label: Uy(u, s, a.length > 1),
      executedLabel: Gy(
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
function Fy(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = Hy(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: jy(e, r, n),
    executedLabel: Vy(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function By(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Uy(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Gy(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function qy(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function zy(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function jy(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Vy(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Hy(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Wy(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Ky(e, t) {
  const n = e * t.multiplier, r = Yy(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function Yy(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Qy() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function xr(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function lo(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${Fs(t.variant)}`,
    eA(t, n, r),
    ...Jy(s),
    ...Object.values(a.rolls).flatMap(tA),
    ...Zy(e, o),
    ...nA(e.resistance),
    ...lA(n)
  ];
}
function Zy(e, t) {
  return Xy(e) ? xr("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Xy(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function Jy(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function eA(e, t, n) {
  const r = Ze(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function tA(e) {
  const n = [`${cA(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = rA(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${J_(e.damageType)}`), n;
}
function nA(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function rA(e) {
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
    const s = aA(o);
    s && (sA(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function aA(e) {
  const t = oA(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : iA(e);
}
function oA(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function iA(e) {
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
function sA(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function lA(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function cA(e) {
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
function uA(e, t, n, r) {
  return Ms.map((a) => {
    const o = Us(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? Fs(a),
      enabled: s,
      details: o ? dA(o, n, r) : [],
      finalCostText: o ? mA(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function dA(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {});
  a.length > 0 ? r.push(a.join(", ")) : n && r.push("efeito manual");
  const o = Ze(t, e);
  return r.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), r;
}
function Ze(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function mA(e, t) {
  const n = Ze(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function fA(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Or);
}
function pA(e, t) {
  return Ss({
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
function gA(e, t, n, r) {
  return Us(e, t, n, r) ?? Nr;
}
function Us(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? bA(t, n) ? hA(n) : null : n === "base" ? Nr : null);
}
function hA(e) {
  switch (e) {
    case "base":
      return Nr;
    case "discente":
      return Ty;
    case "verdadeiro":
      return $y;
  }
}
function bA(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return _A(foundry.utils.getProperty(e, n));
}
function _A(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function yA(e) {
  return e.steps.some(Or);
}
function Or(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function AA(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Gs = "itemUsePrompts", qs = "chatCard", qt = "data-paranormal-toolkit-prompt-id", zt = "data-paranormal-toolkit-pending-id", Mr = "data-paranormal-toolkit-executed-label", jn = "data-paranormal-toolkit-choice-group", zs = "data-paranormal-toolkit-skipped-label", Rt = "data-paranormal-toolkit-action-section", co = "data-paranormal-toolkit-detail-key", uo = "data-paranormal-toolkit-roll-card", Fr = "data-paranormal-toolkit-roll-detail-toggle", js = "data-paranormal-toolkit-roll-detail-id", Vs = "data-paranormal-toolkit-resistance-roll-button", Hs = "data-paranormal-toolkit-resistance-skill", Ws = "data-paranormal-toolkit-resistance-skill-label", Ks = "data-paranormal-toolkit-resistance-target-actor-id", Ys = "data-paranormal-toolkit-resistance-target-name", Qs = "data-paranormal-toolkit-resistance-roll-result", mo = "data-paranormal-toolkit-system-card-replaced", TA = `[${zt}]`, $A = `[${Fr}]`, RA = `[${Vs}]`, Vn = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, wA = `${h}__actions`, fo = `${h}__details`, Zs = `${h}__summary`, kA = `${h}__title`, Xs = `${h}__button--executed`, po = `${h}__roll-card`;
let go = !1, Hn = null;
const x = /* @__PURE__ */ new Map(), EA = [0, 100, 500, 1500, 3e3], IA = 3e4, CA = [0, 100, 500, 1500, 3e3];
function SA(e) {
  if (Hn = e, go) {
    bo(e);
    return;
  }
  const t = (n, r) => {
    el(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), go = !0, bo(e);
}
async function ho(e) {
  const t = Js(e);
  x.set(e.pendingId, t), await Gr(t) || ml(t), tl(e.pendingId);
}
async function LA(e) {
  const t = Js({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", x.set(e.pendingId, t), await Gr(t) || ml(t), tl(e.pendingId);
}
async function sn(e, t) {
  const n = x.get(e);
  x.delete(e), n && await LT(n, t);
}
function Br(e) {
  const t = _l();
  for (const n of t) {
    const r = z(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function DA(e, t) {
  const n = Br(e);
  if (!n) return;
  const r = z(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Ce(n.message, r));
}
async function vA(e, t, n) {
  if (!t) return;
  const r = Br(e);
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
function Js(e) {
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
    summary: oT(e.context),
    executed: !1
  };
}
function el(e, t, n) {
  ST();
  const r = Vt(t);
  if (!r) return;
  const a = ET(e, r);
  a.length > 0 && wt(r);
  for (const o of a)
    Wn(r, o);
  il(r, n), Kn(r), Yn(r);
}
function bo(e) {
  for (const t of CA)
    globalThis.setTimeout(() => {
      PA(e);
    }, t);
}
function PA(e) {
  for (const t of NA()) {
    const n = jt(t);
    xA(n) && el(n, t, e);
  }
}
function NA() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function xA(e) {
  return e ? qr(e) ? !0 : vT(e).length > 0 : !1;
}
function tl(e) {
  const t = x.get(e);
  if (!t) return;
  const n = t.messageId ? IT(t.messageId) : null;
  if (n) {
    $o(n, t), wt(n), Wn(n, t), _o(n), Kn(n), Yn(n);
    return;
  }
  if (t.messageId) {
    Xn(t);
    return;
  }
  const r = CT(t);
  if (r) {
    $o(r, t), wt(r), Wn(r, t), _o(r), Kn(r), Yn(r);
    return;
  }
  Xn(t);
}
function _o(e) {
  Hn && il(e, Hn);
}
function wt(e) {
  const t = OA();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = ol(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(mo) === "true") return;
  const r = n.querySelector(`.${Vn}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(mo, "true");
}
function OA() {
  try {
    return vc() === "replace";
  } catch {
    return !1;
  }
}
function Wn(e, t) {
  if (wt(e), e.querySelector(`[${qt}="${Se(t.pendingId)}"]`)) return;
  const n = FA(e, t);
  UA(n, t);
  const r = tT(t);
  if (MA(r)) return;
  eT(n, r).append(aT(t));
}
function MA(e) {
  return rl(e.id) && !oe();
}
function nl(e) {
  const n = e.closest(`[${Rt}]`)?.getAttribute(Rt) ?? null;
  return rl(n) && !oe();
}
function rl(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function FA(e, t) {
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
  s.classList.add(kA), s.textContent = BA(t);
  const l = document.createElement("span");
  return l.classList.add(Zs), l.textContent = t.summary, a.append(o, s, l), r.append(a), sT(e).append(r), r;
}
function BA(e) {
  const t = C(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function UA(e, t) {
  const n = t.summaryLines ?? [], r = ul(n, t);
  if (r) {
    GA(e, r, t);
    return;
  }
  nT(e, n);
}
function GA(e, t, n) {
  if (e.querySelector(`[${uo}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(po, `${po}--${t.intent}`), r.setAttribute(uo, "true"), t.castingCheck && yo(r, zA(t.castingCheck), n.pendingId, "casting"), qA(t) && yo(r, jA(t), n.pendingId, "effect"), YA(r, t), QA(r, t, n), JA(r, t), e.append(r);
}
function qA(e) {
  return e.intent !== "casting";
}
function zA(e) {
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
function jA(e) {
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
function yo(e, t, n, r) {
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
  VA(a, t), XA(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function VA(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = HA(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function HA(e, t) {
  const n = WA(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of KA(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function WA(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function KA(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ao(e, "highest") : n.includes("kl") ? Ao(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ao(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function YA(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(QT);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function QA(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = ZA(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(al(t.resistanceRollResult)), e.append(r);
}
function ZA(e, t) {
  if (!e.resistanceSkill || !le()) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(qt, t.pendingId), n.setAttribute(Vs, "true"), n.setAttribute(Hs, e.resistanceSkill), n.setAttribute(Ws, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Ks, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Ys, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Qs, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function al(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = ll(e), t;
}
function XA(e, t, n, r, a) {
  const o = t.filter((d) => d.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Fr, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const u = document.createElement("dl");
  u.classList.add(`${h}__roll-detail-list`), u.setAttribute(js, s), u.hidden = !0;
  for (const d of o) {
    const m = document.createElement("dt");
    m.textContent = d.label;
    const b = document.createElement("dd");
    b.textContent = d.value, u.append(m, b);
  }
  e.append(l, u);
}
function JA(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function eT(e, t) {
  const n = `[${Rt}="${Se(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(wA), a.setAttribute(Rt, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function tT(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = ul(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function nT(e, t) {
  if (t.length === 0) return;
  const n = rT(e);
  for (const r of t) {
    const a = ZT(r);
    if (n.querySelector(`[${co}="${Se(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(co, a), n.append(o);
  }
}
function rT(e) {
  const t = e.querySelector(`.${fo}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(fo), e.append(n), n;
}
function aT(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(qt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Xs), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(zt, e.pendingId), t.setAttribute(Mr, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(jn, e.choiceGroupId), t.setAttribute(zs, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function oT(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = iT(e);
  return `${t} → ${n}`;
}
function iT(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function sT(e) {
  return ol(e) ?? e;
}
function ol(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function il(e, t) {
  const n = Vt(e);
  if (!n) return;
  const r = n.querySelectorAll(TA);
  for (const a of r) {
    if (nl(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      TT(a, t);
    }));
  }
}
function Kn(e) {
  const t = Vt(e);
  if (!t) return;
  const n = t.querySelectorAll($A);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      lT(t, r);
    }));
}
function Yn(e) {
  const t = Vt(e);
  if (!t) return;
  const n = t.querySelectorAll(RA);
  for (const r of n) {
    if (!le()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      cT(t, r);
    }));
  }
}
function lT(e, t) {
  const n = t.getAttribute(Fr);
  if (!n) return;
  const r = e.querySelector(`[${js}="${Se(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function cT(e, t) {
  if (!le()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(qt), r = t.getAttribute(Hs), a = t.getAttribute(Ws) ?? (r ? ae(r) : "Resistência");
  if (!n || !r) return;
  const o = mT(e, n), s = fT(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Yu(s, r);
    await _T(u.roll);
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
    uT(t, d), dT(t, d), yT(n, d), await AT(e, n, d);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", u), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function uT(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Qs, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function dT(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? al(t);
  if (r) {
    r.textContent = ll(t);
    return;
  }
  n.append(a);
}
function mT(e, t) {
  const n = x.get(t);
  if (n) return n;
  const r = jt(e);
  return z(r)[t] ?? null;
}
function fT(e, t) {
  const n = e?.resistanceTargetActor;
  if (U(n)) return n;
  const a = e?.context?.targets.map(Qn).find(U) ?? null;
  if (a) return a;
  const o = t.getAttribute(Ks) ?? e?.resistanceTargetActorId ?? null, s = o ? gT(o) : null;
  return s || hT(
    t.getAttribute(Ys) ?? e?.resistanceTargetName ?? pT(t)
  );
}
function pT(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Zs}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function Qn(e) {
  const t = e.actor;
  if (U(t)) return t;
  const n = e.token, r = He(n);
  if (r) return r;
  const a = e.document;
  return He(a);
}
function He(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (U(t)) return t;
  const n = e.document?.actor;
  return U(n) ? n : null;
}
function gT(e) {
  const n = game.actors?.get?.(e);
  return U(n) ? n : sl().map((o) => He(o)).find((o) => o?.id === e) ?? null;
}
function hT(e) {
  const t = Ae(e);
  if (!t) return null;
  const n = sl().filter((o) => Ae(bT(o)) === t).map((o) => He(o)).find(U) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => U(o) && Ae(o.name) === t);
  return U(a) ? a : null;
}
function sl() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function bT(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : He(e)?.name ?? null;
}
function Ae(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function U(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ll(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function _T(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function yT(e, t) {
  const n = x.get(e);
  n && (n.resistanceRollResult = t);
}
async function AT(e, t, n) {
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
async function TT(e, t) {
  if (nl(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(zt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    cl(e, e.getAttribute(Mr) ?? "✓ Automação aplicada"), $T(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function cl(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Xs), e.removeAttribute(zt), e.removeAttribute(Mr);
}
function $T(e) {
  const t = e.getAttribute(jn);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${jn}="${Se(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(zs) ?? "✓ Outra opção escolhida";
    cl(a, o);
  }
}
function ul(e, t) {
  const n = e.map(Ur).filter(KT), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = C(e, "Forma"), o = C(e, "Custo"), s = C(e, "Dados") ?? C(e, `Dados (${r.label})`), l = C(e, "Tipo"), u = C(e, "Resistência"), d = C(e, "Resistência Perícia"), m = C(e, "Resistência Rótulo") ?? (d ? ae(d) : null), b = dl(e, "Observação"), T = e.filter((g) => kT(g, r)), $ = RT(e);
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
function RT(e) {
  const t = e.map(Ur).find((o) => o?.intent === "casting") ?? null, n = C(e, "Conjuração DT"), r = C(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const a = Number(n);
  return Number.isFinite(a) ? {
    label: t.formula,
    formula: C(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: C(e, "Dados (Conjuração)")
  } : null;
}
function Ur(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: wT(n)
  } : null;
}
function wT(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function C(e, t) {
  return dl(e, t)[0] ?? null;
}
function dl(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function kT(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Ur(e) ? !1 : e.trim().length > 0;
}
function ET(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of x.values())
    Zn(r, e, t) && n.set(r.pendingId, r);
  for (const r of DT(e))
    Zn(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function Zn(e, t, n) {
  const r = Y(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !To(n, "itemId", e.itemId) ? !1 : !e.actorId || To(n, "actorId", e.actorId);
}
function To(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${XT(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function IT(e) {
  const t = Se(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function CT(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Zn(e, null, t))
      return t;
  return null;
}
function ST() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of x.entries())
    e - r.createdAt > t && x.delete(n);
}
async function $o(e, t) {
  const n = jt(e);
  if (!n) return !1;
  try {
    const r = z(n);
    return r[t.pendingId] = zr(t, Y(n)), await Ce(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Gr(e) {
  const t = gl(e);
  if (!t) return !1;
  try {
    const n = z(t);
    return n[e.pendingId] = zr(e, Y(t)), await Ce(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function ml(e) {
  for (const t of EA)
    globalThis.setTimeout(() => {
      Xn(e);
    }, t);
}
async function Xn(e) {
  const t = gl(e);
  if (qr(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await Gr(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function LT(e, t) {
  const n = pl(e.context.message);
  if (n)
    try {
      const r = z(n), a = r[e.pendingId] ?? zr(e, Y(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Ce(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function DT(e) {
  return Object.values(z(q(e))).filter(Xe);
}
function z(e) {
  if (!e) return {};
  const t = {}, n = qr(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(fl(e)))
    t[r] ??= a;
  return t;
}
function vT(e) {
  return Object.values(fl(q(e))).filter(Xe);
}
function fl(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, Gs);
  if (!Re(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    Xe(a) && (n[r] = a);
  return n;
}
async function Ce(e, t) {
  typeof e.setFlag == "function" && (await NT(e, t), await PT(e, t));
}
async function PT(e, t) {
  await Promise.resolve(e.setFlag?.(c, Gs, t));
}
function qr(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, qs);
  return HT(t) ? t : null;
}
async function NT(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Xe).sort((o, s) => o.createdAt - s.createdAt);
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
      actorName: xT(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(c, qs, a));
}
function xT(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function zr(e, t) {
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
function pl(e) {
  const t = q(e);
  if (t?.setFlag)
    return t;
  const n = OT(e);
  if (n?.setFlag)
    return n;
  const r = Y(e);
  if (!r) return null;
  const a = game.messages;
  return q(a?.get?.(r));
}
function OT(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(q).find((n) => typeof n?.setFlag == "function") ?? null;
}
function gl(e) {
  const t = pl(e.context.message);
  if (t) return t;
  const n = e.messageId ? MT(e.messageId) : null;
  if (n) return n;
  const r = _l().slice().reverse();
  return r.find((a) => FT(a, e)) ?? r.find((a) => BT(a, e)) ?? null;
}
function MT(e) {
  const t = game.messages;
  return q(t?.get?.(e));
}
function FT(e, t) {
  const n = Y(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!hl(e, t)) return !1;
  const a = bl(e);
  return !t.actorId || !a || a === t.actorId;
}
function BT(e, t) {
  if (!GT(e, t)) return !1;
  const n = bl(e);
  return t.actorId && n === t.actorId ? !0 : hl(e, t);
}
function hl(e, t) {
  const n = Ae(UT(e));
  if (!n) return !1;
  const r = Ae(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Ae(t.itemId);
  return !!(a && n.includes(a));
}
function UT(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function bl(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function GT(e, t) {
  const n = qT(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= IA;
}
function qT(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function q(e) {
  return e && typeof e == "object" ? e : null;
}
function Xe(e) {
  return Re(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && L(e.messageId) && L(e.itemId) && L(e.actorId) && L(e.itemName) && ee(e.resistanceTargetActorId) && ee(e.resistanceTargetName) && WT(e.resistanceRollResult) && zT(e.actionPayload) && ln(e.title) && ln(e.buttonLabel) && ln(e.executedLabel) && ee(e.choiceGroupId) && ee(e.skippedLabel) && ee(e.actionSectionId) && ee(e.actionSectionTitle) && YT(e.summaryLines) : !1;
}
function zT(e) {
  return e == null ? !0 : Re(e) ? e.kind === "resource-operation" && L(e.actorId) && L(e.actorUuid) && typeof e.actorName == "string" && jT(e.resource) && VT(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function jT(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function VT(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function HT(e) {
  return Re(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && L(e.messageId) && Re(e.source) && L(e.source.actorId) && L(e.source.actorName) && L(e.source.itemId) && L(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Xe) : !1;
}
function WT(e) {
  return e == null ? !0 : Re(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && ee(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function KT(e) {
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
function YT(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function QT(e) {
  return typeof e == "string" && e.length > 0;
}
function _l() {
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
function ZT(e) {
  return e.trim().toLowerCase();
}
function XT(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Se(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ro = 1e3;
class JT {
  constructor(t, n, r, a, o, s) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new Ry(
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
      settings: Xr(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Xr();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Ct(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && i$(t.item) && n.executionMode === "ask") {
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
    if (await ao(t), !t.actor) {
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
    this.markExecution(t);
    const a = t$(
      t.item,
      r.value
    );
    switch (n.executionMode) {
      case "ask":
        await this.handleAskMode(t, a);
        return;
      case "automatic":
        await this.executeAutomation(t, a, "automatic");
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
    const n = Br(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = c$(r);
    if (!a)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await yt(
      this.resources,
      a,
      r.resource,
      r.operation,
      r.amount
    );
    return o.ok ? (await DA(t), await vA(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (SA(
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
    if (await ao(t), !t.actor) {
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
      s$(t.item)
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
      return a.ok ? (o$(n, a.value), await Pi(a.value), {
        ok: !0,
        executedLabel: e$(a.value)
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
        wo(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = mn();
    await LA({
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
      }), await ho({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: cn(s),
        skippedLabel: wo(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: l$(s)
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
    }), await ho({
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
    const n = Date.now(), r = ko(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > Ro && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= Ro;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(ko(t), Date.now());
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
function e$(e) {
  return Ni({ inputAmount: e.totalRawDamage });
}
function t$(e, t) {
  if (t.resistance || !n$(t))
    return t;
  const n = xs(e);
  return n ? { ...t, resistance: n } : t;
}
function n$(e) {
  return r$(e) && !a$(e);
}
function r$(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function a$(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function cn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function wo(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function o$(e, t) {
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
function i$(e) {
  return e.type === "ritual";
}
function s$(e) {
  return z_(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function l$(e) {
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
function c$(e) {
  const t = e.actorUuid ? u$(e.actorUuid) : null;
  if (we(t)) return t;
  const n = e.actorId ? d$(e.actorId) : null;
  return n || m$(e.actorName);
}
function u$(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function d$(e) {
  const n = game.actors?.get?.(e);
  if (we(n)) return n;
  for (const r of yl()) {
    const a = jr(r);
    if (a?.id === e) return a;
  }
  return null;
}
function m$(e) {
  const t = un(e);
  if (!t) return null;
  for (const a of yl()) {
    const o = f$(a);
    if (un(o) === t) {
      const s = jr(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => we(a) && un(a.name) === t
  );
  return we(r) ? r : null;
}
function yl() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function f$(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : jr(e)?.name ?? null;
}
function jr(e) {
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
function ko(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function mn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class p$ {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], a = [], o = Ke(t);
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
class g$ {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Ke(t).map((l) => this.analyzeRitual(l)), r = n.filter(st("upToDate")), a = n.filter(st("available")), o = n.filter(st("outdated")), s = n.filter(st("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = h$(t);
    return n ? r ? r.source.type !== "preset" ? xe({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? xe({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : xe({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: b$(r, n.preset)
    }) : xe({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : xe({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function xe(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? It(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function h$(e) {
  const t = e.getFlag(c, "automation");
  return er(t) ? t : null;
}
function b$(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function st(e) {
  return (t) => t.status === e;
}
class _$ {
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
    const n = A(t.actorName), r = A(t.resource), a = A(Eo(t)), o = A(A$(t));
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
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(y$(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), d = t.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(T$(g.source))})</li>`
    ), m = t.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), b = t.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(Eo(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
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
function y$(e) {
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
function Eo(e) {
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
function A$(e) {
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
function T$(e) {
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
function $$() {
  const e = new ub(), t = new f_(e), n = new mi(new di()), r = new fi(new dr()), a = new p_(new Rs()), o = new fb(), s = new Cb(o), l = new qb(e), u = new jb(), d = u.registerMany(
    sc()
  );
  if (!d.ok)
    throw new Error(d.error.message);
  const m = new zb(), b = new Ub(), T = Ti(), $ = new hi(T), g = new g$(
    u
  ), j = new p$(
    g,
    m,
    b
  ), De = new __(), ve = new _$(De), ue = new b_(), S = new d_(
    t,
    s,
    ve,
    ue
  ), O = new h_(S, ue), de = new JT(
    O,
    t,
    s,
    n,
    $,
    De
  );
  return de.addStrategy(
    new Fb(
      (Il) => de.handleItemUsed(Il)
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
    debugOutput: De,
    chatMessages: ve,
    workflowHooks: ue,
    automation: S,
    workflow: O,
    itemUseIntegration: de,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: j
  };
}
const { ApplicationV2: R$ } = foundry.applications.api;
class kt extends R$ {
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
      apply: kt.onApply,
      cancel: kt.onCancel
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
      ${n.length > 0 ? w$(n) : E$(t)}
    </section>
  `;
}
function w$(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(k$).join("")}</ol>`;
}
function k$(e) {
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
function E$(e) {
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
const Et = `${c}.manageRitualPresets`, Io = `__${c}_ritualPresetHeaderControlRegistered`, I$ = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function C$(e) {
  const t = globalThis;
  if (!t[Io]) {
    for (const n of I$)
      Hooks.on(n, (r, a) => {
        S$(r, a, e);
      });
    t[Io] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function S$(e, t, n) {
  Array.isArray(t) && D$(e) && (L$(e, n), !t.some((r) => r.action === Et) && t.push({
    action: Et,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Al(e, n);
    }
  }));
}
function L$(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Et] && (e.options.actions[Et] = (n) => {
    n.preventDefault(), n.stopPropagation(), Al(e, t);
  }));
}
function D$(e) {
  if (!game.user?.isGM) return !1;
  const t = Tl(e);
  return t ? t.type === "agent" && Ke(t).length > 0 : !1;
}
function Al(e, t) {
  const n = Tl(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new kt(n, t).render({ force: !0 });
}
function Tl(e) {
  return Co(e.actor) ? e.actor : Co(e.document) ? e.document : null;
}
function Co(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const $l = "data-paranormal-toolkit-ritual-roll-config", Je = "data-paranormal-toolkit-ritual-roll-field", ie = "data-paranormal-toolkit-ritual-roll-action", So = `__${c}_ritualRollConfigBlockRegistered`, v$ = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], P$ = [
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
function N$() {
  const e = globalThis;
  if (!e[So]) {
    x$();
    for (const t of v$)
      Hooks.on(t, (...n) => {
        O$(n[0], n[1]);
      });
    e[So] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function x$() {
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
function O$(e, t) {
  const n = Q$(e);
  if (!n || n.type !== "ritual") return;
  const r = J$(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  F$(a);
  const o = wl(n), s = Ns(n), l = Z$(n), u = B$(n, s, o, l);
  V$(u, n, o, l), M$(a, u), Vr(u);
}
function M$(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function F$(e) {
  for (const t of Array.from(e.querySelectorAll(`[${$l}]`)))
    t.remove();
}
function B$(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${c}-ritual-roll-config`), a.setAttribute($l, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${c}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${c}-ritual-roll-config__title`), s.append(Lo("strong", "Paranormal Toolkit")), s.append(Lo("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${c}-ritual-roll-config__badge`), l.textContent = El(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const u = document.createElement("p");
  u.classList.add(`${c}-ritual-roll-config__hint`), u.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(u);
  const d = document.createElement("div");
  d.classList.add(`${c}-ritual-roll-config__fields`), d.append(U$(t, r)), d.append(G$(t, r)), d.append(q$(t, r)), a.append(d), a.append(z$(t, n, r)), a.append(j$(r));
  const m = document.createElement("p");
  return m.classList.add(`${c}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function U$(e, t) {
  const n = Ht("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Je, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = q_(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function G$(e, t) {
  const n = Ht("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Je, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of P$) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function q$(e, t) {
  const n = Ht("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Je, "utilityLabel"), n.append(r), n;
}
function z$(e, t, n) {
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
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(Je, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function j$(e) {
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
function Lo(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function V$(e, t, n, r) {
  Le(e, "intent")?.addEventListener("change", () => Vr(e)), Po(e, "system.studentForm")?.addEventListener("change", () => Do(e, t)), Po(e, "system.trueForm")?.addEventListener("change", () => Do(e, t)), e.querySelector(`[${ie}="save"]`)?.addEventListener("click", () => {
    r && H$(e, t, n);
  }), e.querySelector(`[${ie}="clear"]`)?.addEventListener("click", () => {
    r && W$(e, t);
  });
}
async function H$(e, t, n) {
  const r = e.querySelector(`[${ie}="save"]`);
  r?.setAttribute("disabled", "true"), Te(e, "Salvando configuração...");
  try {
    const a = K$(e, n);
    await U_(t, a), Rl(e, a), Te(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), Te(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function W$(e, t) {
  const n = e.querySelector(`[${ie}="clear"]`);
  n?.setAttribute("disabled", "true"), Te(e, "Limpando configuração...");
  try {
    await G_(t);
    const r = Ns(t);
    Y$(e, r), Rl(e, r), Te(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Te(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Rl(e, t) {
  const n = e.querySelector(`.${c}-ritual-roll-config__badge`);
  n && (n.textContent = El(t) ? "Configurada" : "Rascunho");
}
function K$(e, t) {
  return {
    schemaVersion: 1,
    intent: kl(Le(e, "intent")?.value),
    damageType: No(e, "damageType"),
    utilityLabel: No(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: ft(e, "formula.base") },
      discente: { formula: ft(e, "formula.discente") },
      verdadeiro: { formula: ft(e, "formula.verdadeiro") }
    }
  };
}
function Y$(e, t) {
  fe(e, "intent", t.intent), fe(e, "damageType", t.damageType ?? ""), fe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), fe(e, "formula.base", t.forms.base.formula), fe(e, "formula.discente", t.forms.discente.formula), fe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Vr(e);
}
function Vr(e) {
  const t = kl(Le(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function Do(e, t) {
  const n = wl(t);
  vo(e, "discente", n.discente), vo(e, "verdadeiro", n.verdadeiro);
}
function vo(e, t, n) {
  const r = Le(e, `formula.${t}`);
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
function wl(e) {
  const t = X$(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function Q$(e) {
  return xo(e.item) ? e.item : xo(e.document) ? e.document : null;
}
function Z$(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function X$(e) {
  const t = e.system;
  return eR(t) ? t : {};
}
function Po(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Le(e, t) {
  return e.querySelector(`[${Je}="${tR(t)}"]`);
}
function ft(e, t) {
  return Le(e, t)?.value.trim() ?? "";
}
function No(e, t) {
  const n = ft(e, t);
  return n.length > 0 ? n : null;
}
function fe(e, t, n) {
  const r = Le(e, t);
  r && (r.value = n);
}
function kl(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function El(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function J$(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function xo(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function eR(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function tR(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let ne = null;
Hooks.once("init", () => {
  ac(), Dc(), du(), Zh(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!ta.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${ta.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  ne = $$(), ne.itemUseIntegration.registerStrategies(), su(ne.conditions), jc(ne), tu(), Zc(), rb(), C$(ne), N$(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Jn} inicializado.`);
});
function nR() {
  if (!ne)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return ne;
}
export {
  nR as getToolkitServices
};
//# sourceMappingURL=main.js.map
