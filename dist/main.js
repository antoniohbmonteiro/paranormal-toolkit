const u = "paranormal-toolkit", jn = "Paranormal Toolkit", Qs = "ordemparanormal";
class Bt {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function be(t) {
  return {
    id: t.id,
    version: t.version,
    label: t.label,
    description: t.description,
    category: t.category,
    itemTypes: [...t.itemTypes],
    matchers: t.matchers.map((e) => ({ ...e })),
    hasItemPatch: t.itemPatch !== void 0
  };
}
class m {
  static info(e, ...n) {
    console.log(`${u} | ${e}`, ...n);
  }
  static warn(e, ...n) {
    console.warn(`${u} | ${e}`, ...n);
  }
  static error(e, ...n) {
    console.error(`${u} | ${e}`, ...n);
  }
}
function _(t) {
  return { ok: !0, value: t };
}
function p(t) {
  return { ok: !1, error: t };
}
function Gn(t) {
  const e = t.getFlag(u, "automation");
  return e == null ? p({
    reason: "missing-automation",
    message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
  }) : Vn(e) ? _(e.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${t.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: e
  });
}
function Zs(t) {
  return Vn(t.getFlag(u, "automation"));
}
function Vn(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.schemaVersion === 1 && Js(e.source) && Xs(e.definition);
}
function Xs(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && R(e.label) && Array.isArray(e.steps) && e.steps.every(tl) && (e.conditionApplications === void 0 || il(e.conditionApplications));
}
function Js(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.type === "preset" ? R(e.presetId) && R(e.presetVersion) && R(e.appliedAt) : e.type === "manual" ? R(e.label) && R(e.appliedAt) : !1;
}
function tl(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  switch (e.type) {
    case "spendResource":
      return el(e);
    case "spendRitualCost":
      return nl(e);
    case "rollFormula":
      return rl(e);
    case "modifyResource":
      return ol(e);
    case "chatCard":
      return al(e);
    default:
      return !1;
  }
}
function el(t) {
  const e = t;
  return e.type === "spendResource" && e.actor === "self" && (e.resource === "PE" || e.resource === "PD") && ha(e);
}
function nl(t) {
  return t.type === "spendRitualCost";
}
function rl(t) {
  const e = t;
  return e.type === "rollFormula" && R(e.id) && R(e.formula) && (e.intent === void 0 || ml(e.intent)) && (e.damageType === void 0 || R(e.damageType));
}
function ol(t) {
  const e = t;
  return e.type === "modifyResource" && _a(e.actor) && ul(e.resource) && dl(e.operation) && ha(e) && (e.damageType === void 0 || e.damageType === null || R(e.damageType)) && (e.ignoreResistance === void 0 || typeof e.ignoreResistance == "boolean");
}
function al(t) {
  const e = t;
  return e.type === "chatCard" && (e.title === void 0 || typeof e.title == "string") && (e.message === void 0 || typeof e.message == "string");
}
function il(t) {
  return Array.isArray(t) && t.every(sl);
}
function sl(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return R(e.id) && _a(e.actor) && R(e.conditionId) && (e.label === void 0 || R(e.label)) && (e.duration === void 0 || e.duration === null || ll(e.duration)) && (e.source === void 0 || R(e.source)) && (e.actionSectionId === void 0 || R(e.actionSectionId)) && (e.actionSectionTitle === void 0 || R(e.actionSectionTitle)) && (e.executedLabel === void 0 || R(e.executedLabel));
}
function ll(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return (e.rounds === void 0 || e.rounds === null || fl(e.rounds)) && (e.expiry === void 0 || e.expiry === null || cl(e.expiry));
}
function cl(t) {
  return t === "turnStart" || t === "turnEnd";
}
function ha(t) {
  return typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0 || R(t.amountFrom);
}
function _a(t) {
  return t === "self" || t === "target";
}
function ul(t) {
  return t === "PV" || t === "SAN" || t === "PE" || t === "PD";
}
function dl(t) {
  return t === "spend" || t === "damage" || t === "heal" || t === "recover";
}
function ml(t) {
  return t === "attack" || t === "damage" || t === "healing" || t === "resistance" || t === "skill" || t === "ritual" || t === "generic";
}
function fl(t) {
  return typeof t == "number" && Number.isInteger(t) && t > 0;
}
function R(t) {
  return typeof t == "string" && t.length > 0;
}
function Hn(t) {
  const e = t.items;
  if (Array.isArray(e))
    return e;
  if (e && typeof e == "object") {
    const n = e;
    if (Array.isArray(n.contents))
      return n.contents.filter(Dr);
    if (hl(e))
      return Array.from(e).filter(Dr);
  }
  return [];
}
function pl(t) {
  return Hn(t)[0] ?? null;
}
function gl(t) {
  return Hn(t).find(Zs) ?? null;
}
function hl(t) {
  return !!(t && typeof t == "object" && Symbol.iterator in t);
}
function Dr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function Ut(t) {
  return Hn(t).filter((e) => e.type === "ritual");
}
function ba(t) {
  return Ut(t)[0] ?? null;
}
function _l(t) {
  return {
    listPresets() {
      const e = t.automationRegistry.list().map(be);
      return m.info("Presets de automação registrados.", e), e;
    },
    findPresetsForFirstRitual() {
      const e = Ct("Nenhum ator encontrado para buscar presets de ritual.");
      if (!e) return [];
      const n = Ht(e);
      if (!n) return [];
      const r = t.automationRegistry.findForItem(n).map(Nr);
      return m.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(e) {
      const n = Ct("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Ht(n);
      if (!r) return;
      const o = t.automationRegistry.require(e);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const i = await rn(t, r, o.value);
      m.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: i }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const e = Ct("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!e) return;
      const n = Ht(e);
      if (!n) return;
      const r = t.automationRegistry.findForItem(n)[0];
      if (!r) {
        m.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await rn(t, n, r.preset);
      m.info(`Melhor preset aplicado em ${n.name}.`, { match: Nr(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Pr(t);
    },
    async applyBestPresetsToActorRituals() {
      return Pr(t);
    },
    async clearAutomationFromFirstRitual() {
      const e = Ct("Nenhum ator encontrado para limpar automação de ritual.");
      if (!e) return;
      const n = Ht(e);
      n && (await t.automationBinder.clear(n), m.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Pr(t) {
  const e = Ct("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!e) return null;
  const n = Ut(e);
  if (n.length === 0)
    return m.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), vr(e);
  const r = vr(e, n.length);
  for (const o of n) {
    const i = t.automationRegistry.findForItem(o)[0];
    if (!i) {
      r.skipped.push({
        itemId: o.id ?? null,
        itemName: o.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await rn(t, o, i.preset);
    r.applied.push(bl(o, i, s));
  }
  return m.info(`Presets aplicados em rituais de ${e.name ?? "ator sem nome"}.`, r), yl(r), r;
}
async function rn(t, e, n) {
  return await t.automationBinder.applyPreset(e, n), t.itemPatches.applyPresetItemPatch(e, n);
}
function bl(t, e, n) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Ritual sem nome",
    preset: be(e.preset),
    score: e.score,
    reasons: [...e.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function vr(t, e = 0) {
  return {
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    total: e,
    applied: [],
    skipped: []
  };
}
function yl(t) {
  const e = t.skipped.length > 0 ? `, ${t.skipped.length} sem preset compatível` : "", n = t.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${t.applied.length}/${t.total} presets aplicados em rituais${n}${e}.`
  );
}
function Nr(t) {
  return {
    preset: be(t.preset),
    score: t.score,
    reasons: [...t.reasons]
  };
}
function Ct(t) {
  const e = Bt.getSelectedActor();
  return e || (m.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ht(t) {
  const e = ba(t);
  return e || (m.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ot(t) {
  return t ? {
    id: t.id,
    source: {
      ...Al(t.sourceActor),
      token: t.sourceToken
    },
    item: Tl(t.item),
    targets: t.targets.map($l),
    phases: [...t.phases],
    lifecycleEvents: t.lifecycleEvents.map((e) => ({ ...e })),
    rollRequests: xr(t.rollRequests, ya),
    rolls: xr(t.rolls, Rl),
    ritualCosts: t.ritualCosts.map((e) => ({ ...e })),
    damageInstances: t.damageInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    healingInstances: t.healingInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    resourceTransactions: t.resourceTransactions.map(Wn),
    flagKeys: Object.keys(t.flags)
  } : null;
}
function Wn(t) {
  return {
    actorId: t.actorId,
    actorName: t.actorName,
    resource: t.resource,
    operation: t.operation,
    requestedAmount: t.requestedAmount,
    appliedAmount: t.appliedAmount,
    before: {
      value: t.before.value,
      max: t.before.max
    },
    after: {
      value: t.after.value,
      max: t.after.max
    }
  };
}
function Al(t) {
  return {
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown"
  };
}
function Tl(t) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Item sem nome",
    itemType: t.type ?? "unknown",
    itemUuid: t.uuid ?? null
  };
}
function $l(t) {
  return {
    tokenId: t.tokenId,
    actorId: t.actorId,
    sceneId: t.sceneId,
    name: t.name,
    actorName: t.actor?.name,
    actorType: t.actor?.type
  };
}
function ya(t) {
  return {
    id: t.id,
    formula: t.formula,
    intent: t.intent,
    damageType: t.damageType,
    sourceStepIndex: t.sourceStepIndex
  };
}
function Rl(t) {
  return {
    ...ya(t),
    total: t.total
  };
}
function xr(t, e) {
  return Object.fromEntries(Object.entries(t).map(([n, r]) => [n, e(r)]));
}
function wl(t) {
  return {
    getSelected() {
      return Bt.getSelectedActor();
    },
    logResources() {
      const e = Z(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!e) return;
      const n = t.ordem.getActorSnapshot(e);
      m.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && m.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(e) {
      await st(
        t,
        "Gasto de PE",
        Z("Nenhum ator encontrado para gastar PE."),
        (n) => t.resources.spend(n, "PE", e)
      );
    },
    async spendPD(e) {
      await st(
        t,
        "Gasto de PD",
        Z("Nenhum ator encontrado para gastar PD."),
        (n) => t.resources.spend(n, "PD", e)
      );
    },
    async damagePV(e) {
      await st(
        t,
        "Dano em PV",
        Z("Nenhum ator encontrado para causar dano em PV."),
        (n) => t.resources.damage(n, "PV", e)
      );
    },
    async healPV(e) {
      await st(
        t,
        "Cura de PV",
        Z("Nenhum ator encontrado para curar PV."),
        (n) => t.resources.heal(n, "PV", e)
      );
    },
    async damageSAN(e) {
      await st(
        t,
        "Dano em SAN",
        Z("Nenhum ator encontrado para causar dano em SAN."),
        (n) => t.resources.damage(n, "SAN", e)
      );
    },
    async recoverSAN(e) {
      await st(
        t,
        "Recuperação de SAN",
        Z("Nenhum ator encontrado para recuperar SAN."),
        (n) => t.resources.recover(n, "SAN", e)
      );
    }
  };
}
async function st(t, e, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    kl(o.error);
    return;
  }
  const i = o.value;
  try {
    await t.chatMessages.createResourceOperationMessage({ transaction: i });
  } catch (s) {
    m.error(`${e} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  m.info(`${e} realizado:`, Wn(i));
}
function Z(t) {
  const e = Bt.getSelectedActor();
  return e || (m.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function kl(t) {
  if (t.reason === "update-failed") {
    m.error(t.message, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  if (t.reason === "resource-path-not-found" || t.reason === "invalid-resource-value") {
    m.error("Falha de adapter ao ler recurso.", t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  m.warn(`Operação de recurso não realizada: ${t.message}`, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
}
const F = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function El() {
  Wt(F.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Wt(F.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Wt(F.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Wt(F.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function on() {
  return {
    enabled: Kt(F.enabled),
    console: Kt(F.console),
    ui: Kt(F.ui),
    chat: Kt(F.chat)
  };
}
async function G(t, e) {
  await game.settings.set(u, F[t], e);
}
function Wt(t, e) {
  game.settings.register(u, t, {
    name: e.name,
    hint: e.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: e.default
  });
}
function Kt(t) {
  return game.settings.get(u, t) === !0;
}
function Il() {
  return {
    status() {
      return on();
    },
    async enable() {
      await G("enabled", !0);
    },
    async disable() {
      await G("enabled", !1);
    },
    async enableConsole() {
      await G("console", !0);
    },
    async disableConsole() {
      await G("console", !1);
    },
    async enableUi() {
      await G("ui", !0);
    },
    async disableUi() {
      await G("ui", !1);
    },
    async enableChat() {
      await G("chat", !0);
    },
    async disableChat() {
      await G("chat", !1);
    }
  };
}
const Aa = "ritual.costOnly", Ta = "ritual.simpleHealing", Cl = "ritual.eletrocussao", $a = "ritual.simpleDamage", Ra = "generic.simpleHealing", wa = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Sl() {
  return [
    Ll(),
    Dl(),
    Pl(),
    vl(),
    Nl()
  ];
}
function Ll() {
  return {
    id: Aa,
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
function Dl() {
  return {
    id: Ta,
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
    automation: ka(),
    itemPatch: Ol()
  };
}
function Pl() {
  return {
    id: Cl,
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
    automation: xl(),
    itemPatch: Ml()
  };
}
function vl() {
  return {
    id: $a,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Kn()
  };
}
function Nl() {
  return {
    id: Ra,
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
function ka(t = "2d8+2") {
  return Ea(
    {
      version: 1,
      label: "Cicatrização",
      ritualForms: {
        base: {
          label: "Padrão",
          rollFormulaOverrides: {
            healing: t
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
    t
  );
}
function xl() {
  return {
    ...Kn("3d6", {
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
function Kn(t = "1d8", e = {}) {
  const n = e.label ?? "Ritual de dano simples", r = e.title ?? "Ritual de dano simples", o = e.damageType ?? "generic", i = e.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Ea(
    {
      version: 1,
      label: n,
      ritualForms: {
        base: {
          label: "Padrão",
          rollFormulaOverrides: {
            damage: t
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
    t
  );
}
function Ol() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: wa,
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
function Ml() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: wa,
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
function Ea(t, e, n) {
  return {
    ...t,
    steps: t.steps.map((r) => r.type !== "rollFormula" || r.id !== e ? r : {
      ...r,
      formula: n
    })
  };
}
function Yn() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: ct(e.id),
    actorId: ct(e.actor?.id),
    sceneId: ct(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  }));
}
function Ia() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null;
  return {
    tokenId: ct(t.id),
    actorId: ct(e?.id),
    sceneId: ct(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function ct(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function Fl(t) {
  return {
    logFirstRitualCost() {
      const e = X("Nenhum ator encontrado para consultar custo de ritual.");
      if (!e) return;
      const n = J(e);
      if (!n) return;
      const r = t.ritualCosts.getCost({ actor: e, ritual: n });
      if (!r.ok) {
        m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      m.info("Custo do primeiro ritual:", {
        actor: e.name,
        ritual: n.name,
        cost: r.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${n.name} custa ${r.value.amount} ${r.value.resource} (${r.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(e, n = "PE") {
      const r = X("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = J(r);
      if (o) {
        if (!ql(e, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(u, "ritual.cost", {
          resource: n,
          amount: e
        }), m.info(`Custo customizado aplicado em ${o.name}.`, { resource: n, amount: e }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${e} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const e = X("Nenhum ator encontrado para limpar custo customizado.");
      if (!e) return;
      const n = J(e);
      n && (await n.unsetFlag(u, "ritual.cost"), m.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const e = X("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!e) return;
      const n = J(e);
      if (!n) return;
      const r = t.automationRegistry.require(Aa);
      if (!r.ok) {
        m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(n, r.value), m.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(e = "2d8+2") {
      const n = X("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = J(n);
      if (!r) return;
      if (!Or(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = t.automationRegistry.require(Ta);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(r, o.value, {
        definition: ka(e)
      }), m.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(e = "1d8") {
      const n = X("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = J(n);
      if (!r) return;
      if (!Or(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = t.automationRegistry.require($a);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(r, o.value, {
        definition: Kn(e)
      }), m.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const e = X("Nenhum ator encontrado para executar automação de ritual.");
      if (!e) return;
      const n = J(e);
      n && await Bl(t, e, n);
    }
  };
}
async function Bl(t, e, n) {
  const r = Gn(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(r.value, {
    sourceActor: e,
    sourceToken: Ia(),
    item: n,
    targets: Yn()
  });
  if (!o.ok) {
    Ul(o.error);
    return;
  }
  m.info("Automação de ritual executada com sucesso.", ot(o.value.context));
}
function Ul(t) {
  const e = `Automação de ritual falhou: ${t.message}`;
  if (t.reason === "resource-operation-failed") {
    m.warn(e, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  if (t.reason === "chat-card-failed") {
    m.error(e, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  m.warn(e, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
}
function X(t) {
  const e = Bt.getSelectedActor();
  return e || (m.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function J(t) {
  const e = ba(t);
  return e || (m.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ql(t, e) {
  return Number.isInteger(t) && t > 0 && (e === "PE" || e === "PD");
}
function Or(t) {
  return typeof t == "string" && t.trim().length > 0;
}
const zl = ["disabled", "ask", "automatic"], jl = ["buttons", "confirm"], Ca = "ask";
function Gl(t) {
  return typeof t == "string" && zl.includes(t);
}
function Vl(t) {
  return typeof t == "string" && jl.includes(t);
}
function Hl(t) {
  return Gl(t) ? t : Vl(t) ? "ask" : Ca;
}
const Wl = ["keep", "replace"], Kl = ["manual", "assisted"], Sa = "keep", La = "assisted", Yl = !0, C = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Ql() {
  game.settings.register(u, C.executionMode, {
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
    default: Ca
  }), game.settings.register(u, C.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Sa
  }), game.settings.register(u, C.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: La
  }), game.settings.register(u, C.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Yl
  }), game.settings.register(u, C.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Mr() {
  const t = Hl(game.settings.get(u, C.executionMode)), e = Pa(game.settings.get(u, C.systemCardMode)), n = va(game.settings.get(u, C.damageResolutionMode));
  return {
    executionMode: t,
    systemCardMode: e,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: Da()
  };
}
function Zl() {
  return Pa(game.settings.get(u, C.systemCardMode));
}
function Xl() {
  return va(game.settings.get(u, C.damageResolutionMode));
}
function Da() {
  return game.settings.get(u, C.ritualCastingCheckEnabled) === !0;
}
async function tt(t) {
  await game.settings.set(u, C.executionMode, t);
}
function Pa(t) {
  return Wl.includes(t) ? t : Sa;
}
function va(t) {
  return Kl.includes(t) ? t : La;
}
function Jl(t) {
  return {
    status() {
      return t.itemUseIntegration.status();
    },
    async enable() {
      await tt("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await tt("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(e) {
      await tt(e), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${e}.`);
    },
    async ask() {
      await tt("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await tt("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await tt("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await tt("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const tc = [
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
function ec(t) {
  return {
    phases() {
      return tc;
    },
    lastContext() {
      return t.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const e = Me("Nenhum ator encontrado para executar automação.");
      if (!e) return;
      const n = gl(e);
      if (!n) {
        m.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Fr(t, e, n);
    },
    async runSelectedItemAutomation() {
      await this.runFirstAutomation();
    },
    async runItemAutomationByUuid(e) {
      if (!e || typeof e != "string") {
        ui.notifications?.warn("Paranormal Toolkit: UUID inválido.");
        return;
      }
      const n = await fromUuid(e);
      if (!oc(n)) {
        m.warn(`UUID não resolveu para um Item: ${e}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = rc(n) ?? Me("Nenhum ator encontrado para executar automação do item.");
      r && await Fr(t, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const e = Me("Nenhum ator encontrado para configurar automação de teste.");
      if (!e) return;
      const n = pl(e);
      if (!n) {
        m.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = t.automationRegistry.require(Ra);
        if (!r.ok) {
          m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
          return;
        }
        await t.automationBinder.applyPreset(n, r.value), m.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (r) {
        m.error("Falha ao configurar automação de teste no item.", r), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function Fr(t, e, n) {
  const r = Gn(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(r.value, {
    sourceActor: e,
    sourceToken: Ia(),
    item: n,
    targets: Yn()
  });
  if (!o.ok) {
    nc(o.error);
    return;
  }
  m.info("Automação executada com sucesso.", ot(o.value.context));
}
function nc(t) {
  const e = `Automação falhou: ${t.message}`;
  if (t.reason === "resource-operation-failed") {
    m.warn(e, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  if (t.reason === "chat-card-failed") {
    m.error(e, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
    return;
  }
  m.warn(e, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
}
function Me(t) {
  const e = Bt.getSelectedActor();
  return e || (m.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function rc(t) {
  const e = t.parent;
  return e instanceof Actor ? e : null;
}
function oc(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function ac(t) {
  const e = wl(t), n = _l(t), r = Fl(t), o = ec(t), i = Il(), s = Jl(t);
  return {
    actor: e,
    automation: n,
    ritual: r,
    workflow: o,
    output: i,
    itemUseIntegration: s,
    getSelectedActor() {
      return e.getSelected();
    },
    logSelectedActorResources() {
      e.logResources();
    },
    async spendSelectedActorPE(l) {
      await e.spendPE(l);
    }
  };
}
function ic(t) {
  return {
    list: () => t.listConditions(),
    get: (e) => {
      const n = t.getCondition(e);
      return n.ok ? n.value : null;
    },
    applyToActor: (e, n, r = {}) => t.applyCondition({
      actor: e,
      conditionId: n,
      duration: r.duration,
      originUuid: r.originUuid,
      source: r.source ?? "api.applyToActor",
      refreshExisting: r.refreshExisting
    }),
    removeFromActor: (e, n) => t.removeCondition({
      actor: e,
      conditionId: n
    }),
    applyToSelectedTokens: async (e, n = {}) => {
      const r = Br();
      if (r.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const o = await Promise.all(
        r.map(
          (i) => t.applyCondition({
            actor: i,
            conditionId: e,
            duration: n.duration,
            originUuid: n.originUuid,
            source: n.source ?? "api.applyToSelectedTokens",
            refreshExisting: n.refreshExisting
          })
        )
      );
      return sc(o), o;
    },
    removeFromSelectedTokens: async (e) => {
      const n = Br();
      if (n.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para remover a condição."), [];
      const r = await Promise.all(
        n.map(
          (o) => t.removeCondition({
            actor: o,
            conditionId: e
          })
        )
      );
      return lc(r), r;
    },
    cleanupExpired: (e = {}) => t.cleanupExpiredConditions({
      ...e,
      reason: e.reason ?? "manual"
    })
  };
}
function Br() {
  const t = canvas.tokens?.controlled ?? [], e = /* @__PURE__ */ new Map();
  for (const n of t) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const i = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${e.size}`;
    e.set(i, r);
  }
  return Array.from(e.values());
}
function sc(t) {
  let e = 0;
  for (const n of t) {
    if (n.ok) {
      e += 1, n.value.warning && ui.notifications?.warn(`Paranormal Toolkit: ${n.value.warning}`);
      continue;
    }
    ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
  }
  e > 0 && ui.notifications?.info(`Paranormal Toolkit: condição aplicada em ${e} ator(es).`);
}
function lc(t) {
  let e = 0;
  for (const n of t) {
    if (n.ok) {
      e += n.value.removed;
      continue;
    }
    ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
  }
  ui.notifications?.info(`Paranormal Toolkit: ${e} efeito(s) removido(s).`);
}
function cc(t) {
  const e = {
    services: t,
    ordem: t.ordem,
    resources: t.resources,
    damage: t.damage,
    ritualCosts: t.ritualCosts,
    automation: t.automation,
    automationRegistry: t.automationRegistry,
    automationBinder: t.automationBinder,
    workflow: t.workflow,
    itemUseIntegration: t.itemUseIntegration,
    conditions: ic(t.conditions),
    debug: ac(t)
  }, n = globalThis;
  return n[u] = e, n.ParanormalToolkit = e, e;
}
class Ur {
  static isSupportedSystem() {
    return game.system.id === Qs;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function uc() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: ut(e.id),
    actorId: ut(e.actor?.id),
    sceneId: ut(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome"
  }));
}
function Na() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null, n = t.name ?? e?.name ?? "Origem sem nome";
  return {
    tokenId: ut(t.id),
    actorId: ut(e?.id),
    sceneId: ut(t.scene?.id),
    name: n
  };
}
function dc(t, e = Na()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: e,
    targets: t
  };
}
function mc(t) {
  if (!gc(t)) return null;
  const e = t.getFlag(u, "workflow");
  return pc(e) ? e : null;
}
function fc() {
  return `flags.${u}.workflow`;
}
function qr(t) {
  if (!t || typeof t != "object") return !1;
  const e = foundry.utils.getProperty(t, `flags.${u}`), n = foundry.utils.getProperty(t, `_source.flags.${u}`);
  return e !== void 0 || n !== void 0;
}
function zr(t) {
  const e = foundry.utils.getProperty(t, "speaker.actor"), n = foundry.utils.getProperty(t, "_source.speaker.actor");
  return an(e) || an(n);
}
function pc(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && e.kind === "chat-targets" && (e.source === null || typeof e.source == "object") && Array.isArray(e.targets);
}
function gc(t) {
  return !!(t && typeof t == "object" && "getFlag" in t);
}
function ut(t) {
  return an(t) ? t : null;
}
function an(t) {
  return typeof t == "string" && t.length > 0;
}
function hc() {
  const t = (e, n) => {
    _c(e, n);
  };
  Hooks.on("renderChatMessageHTML", t);
}
function _c(t, e) {
  const n = mc(t);
  if (!n || n.targets.length === 0) return;
  const r = yc(e);
  if (!r || r.querySelector(`.${u}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(bc(n));
}
function bc(t) {
  const e = document.createElement("section");
  e.classList.add(`${u}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", e.append(n), t.source && e.append(jr("Origem", t.source.name)), e.append(jr("Alvo", t.targets.map((r) => r.name).join(", "))), e;
}
function jr(t, e) {
  const n = document.createElement("p");
  n.classList.add(`${u}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${t}: `;
  const o = document.createElement("span");
  return o.textContent = e, n.append(r, o), n;
}
function yc(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function Ac() {
  Hooks.on("preCreateChatMessage", (t, e, n, r) => {
    if (!Tc(r) || !$c(t) || qr(t) || qr(e)) return;
    const o = uc();
    if (o.length === 0 || !zr(t) && !zr(e)) return;
    const i = Na();
    t.updateSource({
      [fc()]: dc(o, i)
    }), m.info("Targets capturados para ChatMessage.", { source: i, targets: o });
  });
}
function Tc(t) {
  const e = game.user?.id;
  return !e || typeof t != "string" ? !0 : t === e;
}
function $c(t) {
  return !!(t && typeof t == "object" && "updateSource" in t);
}
let Gr = !1, Fe = !1, Be = !1, Yt = null;
const Rc = 1e3, wc = 750, kc = 1e3;
function Ec(t) {
  Gr || (Hooks.on("combatTurnChange", (e) => {
    Cc(t, Vr(e));
  }), Hooks.on("deleteCombat", (e) => {
    Sc(t, Vr(e));
  }), Gr = !0, Ic(t));
}
function Ic(t) {
  ye() && (Fe || (Fe = !0, globalThis.setTimeout(() => {
    Fe = !1, Qn(t, "ready");
  }, Rc)));
}
function Cc(t, e) {
  ye() && e && (Yt && globalThis.clearTimeout(Yt), Yt = globalThis.setTimeout(() => {
    Yt = null, Qn(t, "combat-turn-change", e);
  }, wc));
}
function Sc(t, e) {
  ye() && e && (Be || (Be = !0, globalThis.setTimeout(() => {
    Be = !1, Qn(t, "combat-deleted", e);
  }, kc)));
}
async function Qn(t, e, n) {
  if (ye())
    try {
      const r = await t.cleanupExpiredConditions({
        reason: e,
        combatId: n ?? null,
        removeAllForCombat: e === "combat-deleted"
      });
      r.removedEffects > 0 && m.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${e}.`
      );
      for (const o of r.failures)
        m.warn(o.message);
    } catch (r) {
      m.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function ye() {
  return game.user?.isGM === !0;
}
function Vr(t) {
  if (!t || typeof t != "object") return null;
  const e = t.id;
  return typeof e == "string" && e.length > 0 ? e : null;
}
const xa = {
  enabled: "dice.animations.enabled"
};
function Lc() {
  game.settings.register(u, xa.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Dc() {
  return {
    enabled: game.settings.get(u, xa.enabled) === !0
  };
}
const Ae = "chatCard", Hr = "data-paranormal-toolkit-prompt-id", a = `${u}-item-use-prompt`, Pc = `.${a}__title`, Oa = `.${a}__header`, vc = `.${a}__roll-card`, Nc = `.${a}__roll-meta`, xc = `.${a}__roll-meta-pill`, Zn = `.${a}__resistance`, Oc = `.${a}__resistance-header`, Ma = `.${a}__resistance-description`, Te = `.${a}__resistance-roll-button`, Fa = `.${a}__resistance-roll-result`, Wr = `${a}__resistance-content`, Ba = `.${a}__workflow-section`, Ua = `.${a}__workflow-roll`, Xn = `${a}__workflow-roll--dice-open`, Jn = `.${a}__workflow-roll-formula`, tr = `${a}__workflow-roll-formula--toggle`, $e = `.${a}__workflow-dice-tray`, Mc = `.${a}__roll-detail-toggle`, Fc = `.${a}__roll-detail-list`, Bc = `.${a}__ritual-element-badge`, Uc = `.${a}__ritual-metadata`, qc = "casting-backlash", zc = "data-paranormal-toolkit-action-section", jc = "data-paranormal-toolkit-prompt-id", Gc = "data-paranormal-toolkit-pending-id", Kr = "data-paranormal-toolkit-casting-backlash-enhanced", Yr = `.${a}`, Vc = `.${a}__workflow-section--casting`, Hc = `.${a}__workflow-section-header`, Wc = `.${a}__workflow-notes`, Kc = `[${zc}="${qc}"]`, Qr = `${a}__workflow-section-title-row`, Yc = `${a}__workflow-section-header--casting-backlash`, qa = `${a}__casting-backlash-button`;
function Qc(t) {
  for (const e of Zc(t))
    Xc(e), ru(e);
}
function Zc(t) {
  const e = /* @__PURE__ */ new Set();
  t instanceof HTMLElement && t.matches(Yr) && e.add(t);
  for (const n of t.querySelectorAll(Yr))
    e.add(n);
  return Array.from(e);
}
function Xc(t) {
  const e = t.querySelector(Kc);
  if (!e) return;
  const n = Jc(e);
  if (!n) return;
  const r = t.querySelector(`${Vc} ${Hc}`);
  r && (r.classList.add(Yc), tu(r), eu(n), r.append(n), e.remove());
}
function Jc(t) {
  return t.querySelector(
    `button[${Gc}], button[${jc}]`
  );
}
function tu(t) {
  const e = t.querySelector(`:scope > .${Qr}`);
  if (e) return e;
  const n = document.createElement("div");
  n.classList.add(Qr);
  const r = Array.from(t.childNodes);
  t.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(qa) || n.append(o));
  return n;
}
function eu(t) {
  if (t.getAttribute(Kr) === "true") return;
  const e = t.textContent?.trim() || "Aplicar dano na SAN", n = nu(e, t.disabled);
  t.classList.add(qa), t.setAttribute(Kr, "true"), t.setAttribute("title", n), t.setAttribute("aria-label", n);
}
function nu(t, e) {
  return e ? "Dano na SAN já aplicado" : `${t.toLocaleLowerCase().includes("san") ? t : `${t} na SAN`} no conjurador`;
}
function ru(t) {
  for (const e of t.querySelectorAll(Wc)) {
    for (const n of Array.from(e.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    e.children.length === 0 && e.remove();
  }
}
function ou(t) {
  for (const e of Array.from(t.querySelectorAll(Ba)))
    for (const n of Array.from(e.querySelectorAll(`${Mc}, ${Fc}`)))
      n.remove();
}
const St = "data-paranormal-toolkit-prompt-id", au = "data-paranormal-toolkit-resistance-roll-result", iu = "Conjuração DT";
function za(t) {
  const e = t.querySelector(Te)?.getAttribute(au), n = xt(e);
  if (n !== null) return n;
  const r = t.querySelector(Fa)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return xt(o?.[1] ?? null);
}
function er(t) {
  const e = du(t), n = lu(e);
  if (n !== null) return n;
  const r = cu(e);
  return r !== null ? r : uu(t);
}
function su(t) {
  const e = t.getAttribute(St);
  if (!e) return null;
  const n = Ga(t), r = Va(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Re(l) ? l.pendingId === e : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function W(t) {
  return t?.trim().toLocaleLowerCase() ?? "";
}
function ja(t) {
  return W(t).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function lu(t) {
  const e = fu(t);
  return e.length === 0 ? null : xt(pu(e, iu));
}
function cu(t) {
  const e = typeof t?.actorId == "string" ? t.actorId : null;
  if (!e) return null;
  const r = game.actors?.get?.(e);
  return !r || typeof r != "object" ? null : Zr(r, ["system", "ritual", "DT"]) ?? Zr(r, ["system", "ritual", "dt"]);
}
function uu(t) {
  const e = Array.from(t.querySelectorAll(`.${a}__workflow-section--casting .${a}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!e) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(e);
  return xt(n?.[1] ?? null);
}
function du(t) {
  const e = mu(t);
  if (!e) return null;
  const n = Ga(t), r = Va(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((i) => Re(i) ? i.pendingId === e : !1) ?? null;
}
function mu(t) {
  return (t.closest(`[${St}]`) ?? t.querySelector(`[${St}]`) ?? t.parentElement?.querySelector(`[${St}]`) ?? null)?.getAttribute(St) ?? null;
}
function Ga(t) {
  const n = t.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return gu(o) ? o : null;
}
function Va(t) {
  const e = t?.getFlag?.(u, Ae);
  return Re(e) ? e : null;
}
function fu(t) {
  return Array.isArray(t?.summaryLines) ? t.summaryLines.filter((e) => typeof e == "string") : [];
}
function pu(t, e) {
  const n = `${e}:`;
  for (const r of t) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function Zr(t, e) {
  let n = t;
  for (const r of e) {
    if (!Re(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : xt(typeof n == "string" ? n : null);
}
function xt(t) {
  if (!t) return null;
  const e = Number(t);
  return Number.isFinite(e) ? Math.trunc(e) : null;
}
function gu(t) {
  return !!(t && typeof t == "object" && typeof t.getFlag == "function");
}
function Re(t) {
  return !!(t && typeof t == "object");
}
const hu = `.${a}__actions`, nr = `.${a}__actions-title`, le = `.${a}__button`, _u = "data-paranormal-toolkit-action-section", bu = `${a}__button--executed`, yu = "data-paranormal-toolkit-executed-label";
function Ha(t) {
  return W(t.querySelector(nr)?.textContent);
}
function Au(t, e) {
  const n = t.querySelector(nr);
  n && (n.textContent = e);
}
function we(t, e) {
  const n = W(e);
  return Array.from(t.querySelectorAll(`.${a}__workflow-section`)).find((r) => {
    const o = r.querySelector(`.${a}__workflow-section-header strong`)?.textContent;
    return W(o) === n;
  }) ?? null;
}
function rr(t, e) {
  const n = document.createElement("span");
  return n.classList.add(`${a}__button-icon`, e), n.setAttribute("aria-hidden", "true"), n.textContent = t, n;
}
function qt(t) {
  const e = document.createElement("span");
  return e.classList.add(`${a}__button-label`), e.textContent = t, e;
}
const Tu = "data-paranormal-toolkit-damage-resolution-state", Xr = "data-paranormal-toolkit-damage-icon-enhanced", $u = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function Ru(t, e) {
  e.classList.add(`${a}__actions--embedded`, `${a}__actions--damage-resolution`), Au(e, "Aplicar dano"), wu(t, e);
}
function wu(t, e) {
  const n = Array.from(e.querySelectorAll(le)), r = Jr(n, "normal"), o = Jr(n, "half");
  if (!r || !o) {
    e.classList.add(`${a}__actions--compact`);
    return;
  }
  to(r, "normal"), to(o, "half");
  const i = ku();
  if (e.classList.toggle(`${a}__actions--assisted`, i === "assisted"), e.classList.toggle(`${a}__actions--manual`, i !== "assisted"), i !== "assisted") {
    V(r, !0), V(o, !0), Qt(e, "manual", null);
    return;
  }
  const s = za(t), l = er(t);
  if (l === null) {
    V(r, !0), V(o, !0), Qt(e, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (s === null) {
    V(r, !0), V(o, !1), Qt(e, "pending", null);
    return;
  }
  const c = s >= l;
  V(r, !c), V(o, c), Qt(
    e,
    c ? "resisted" : "failed",
    c ? `Resistiu: ${s} vs DT ${l}.` : `Falhou: ${s} vs DT ${l}.`
  );
}
function Jr(t, e) {
  const n = $u[e];
  return t.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function to(t, e) {
  if (t.getAttribute(Xr) === "true") return;
  const n = t.textContent?.trim() ?? "";
  if (!n || n.startsWith("✓")) return;
  const r = document.createElement("i");
  r.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${a}__button-icon`
  ), r.setAttribute("aria-hidden", "true"), t.classList.add(
    `${a}__button--damage-resolution-action`,
    `${a}__button--damage-resolution-${e}`
  ), t.setAttribute(Xr, "true"), t.setAttribute("aria-label", n), t.replaceChildren(r, qt(n));
}
function V(t, e) {
  t.hidden = !e, t.classList.toggle(`${a}__button--damage-resolution-selected`, e);
}
function Qt(t, e, n) {
  t.setAttribute(Tu, e);
  const r = t.querySelector(`.${a}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${a}__damage-resolution-summary`), o.textContent = n, r || t.querySelector(nr)?.after(o);
}
function ku() {
  try {
    return Xl();
  } catch {
    return "assisted";
  }
}
const Ot = "data-paranormal-toolkit-effect-icon-enhanced", ht = "data-paranormal-toolkit-effect-action-compacted", ke = "data-paranormal-toolkit-effect-resistance-gate", or = "data-paranormal-toolkit-effect-section", ar = "data-paranormal-toolkit-effect-label";
function Eu(t) {
  return t.querySelector(`[${or}="true"]`);
}
function Iu(t) {
  const e = Su(t);
  if (!e) return t.existingSection;
  const n = t.existingSection ?? Lu(), r = Bu(n, t.sourceActions, e);
  return r && n.setAttribute(ar, r), Du(n, e, r), Mu(t.rollCard, n, t.after ?? t.fallbackAfter), Fu(t.sourceActions, n), n;
}
function Cu(t, e) {
  const n = e.querySelector(le);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (Ka(n, r)) {
    qu(n);
    return;
  }
  const o = Qa(e, n, r);
  if (!zu(t, o)) {
    Za(n);
    return;
  }
  const i = er(t), s = za(t);
  if (i === null || s === null) {
    ju(n);
    return;
  }
  if (s >= i) {
    Gu(n);
    return;
  }
  Vu(n, o);
}
function Su(t) {
  return t.sourceActions?.querySelector(le) ?? t.existingSection?.querySelector(le) ?? null;
}
function Lu() {
  const t = document.createElement("section");
  return t.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-action`
  ), t.setAttribute(or, "true"), t;
}
function Du(t, e, n) {
  t.setAttribute(or, "true"), t.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-action`
  ), t.classList.remove(`${a}__actions`, `${a}__actions--effect-resolution`);
  const r = Pu(t), o = vu(r);
  o.textContent = "Efeito";
  const i = Nu(t, r), s = xu(i);
  s.textContent = Hu(n ?? Qa(t, e, e.textContent?.trim() ?? ""));
  const l = Ou(i);
  e.parentElement !== l && l.append(e);
  const c = e.textContent?.trim() ?? "";
  !Ka(e, c) && !Uu(e, c) && Ya(e, n ?? c);
}
function Pu(t) {
  const e = t.querySelector(`:scope > .${a}__workflow-section-header`);
  if (e) return e;
  const n = document.createElement("div");
  return n.classList.add(`${a}__workflow-section-header`), t.prepend(n), n;
}
function vu(t) {
  const e = t.querySelector("strong");
  if (e) return e;
  const n = document.createElement("strong");
  return t.append(n), n;
}
function Nu(t, e) {
  const n = t.querySelector(`:scope > .${a}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${a}__effect-section-body`), e.after(r), r;
}
function xu(t) {
  const e = t.querySelector(`:scope > .${a}__effect-section-label`);
  if (e) return e;
  const n = document.createElement("span");
  return n.classList.add(`${a}__effect-section-label`), t.prepend(n), n;
}
function Ou(t) {
  const e = t.querySelector(`:scope > .${a}__effect-section-action`);
  if (e) return e;
  const n = document.createElement("div");
  return n.classList.add(`${a}__effect-section-action`), t.append(n), n;
}
function Mu(t, e, n) {
  if (!n) {
    if (e.parentElement === t && e.nextElementSibling === null) return;
    t.append(e);
    return;
  }
  e.parentElement === t && e.previousElementSibling === n || t.insertBefore(e, n.nextElementSibling);
}
function Fu(t, e) {
  !t || t === e || t.remove();
}
function Bu(t, e, n) {
  const r = t.getAttribute(ar);
  if (r && r.trim().length > 0) return r.trim();
  const o = e?.querySelector(`.${a}__effect-resolution-label`)?.textContent?.trim();
  return o || Wa(n, n.textContent?.trim() ?? "");
}
function Wa(t, e) {
  const n = t.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && W(n) !== "efeito aplicado") return n;
  const r = su(t);
  if (r) return r;
  const o = e.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && W(o) !== "aplicado" ? o : null;
}
function Ka(t, e) {
  return t.classList.contains(bu) || W(e).includes("aplicado");
}
function Uu(t, e) {
  const n = t.getAttribute(ke);
  if (n === "pending" || n === "resisted") return !0;
  const r = ja(e);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function Ya(t, e) {
  t.getAttribute(ht) === "true" && t.getAttribute(Ot) === "true" || (t.disabled = !1, t.classList.add(`${a}__button--effect-resolution-action`), t.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), t.setAttribute(ht, "true"), t.setAttribute(Ot, "true"), t.setAttribute(yu, "✓ Aplicado"), t.setAttribute("aria-label", `Aplicar ${e}`), t.replaceChildren(
    rr("✦", `${a}__button-icon--effect`),
    qt("Aplicar")
  ));
}
function qu(t) {
  t.getAttribute(ht) === "true" && W(t.textContent) === "✓ aplicado" || (t.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-applied`), t.classList.remove(
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), t.setAttribute(ht, "true"), t.setAttribute(Ot, "true"), t.setAttribute("aria-label", "Efeito aplicado"), t.replaceChildren(
    rr("✓", `${a}__button-icon--effect-applied`),
    qt("Aplicado")
  ));
}
function Qa(t, e, n) {
  const r = t.getAttribute(ar) ?? t.querySelector(`.${a}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Wa(e, n) ?? n;
}
function zu(t, e) {
  if (!t.querySelector(Zn)) return !1;
  const n = ja(e);
  return n.includes("vulneravel") || n.includes("vulnerable");
}
function ju(t) {
  t.disabled = !0, t.removeAttribute(ht), t.removeAttribute(Ot), t.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-resisted`
  ), t.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-waiting`), t.setAttribute(ke, "pending"), t.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), t.replaceChildren(qt("Role resistência"));
}
function Gu(t) {
  t.disabled = !0, t.removeAttribute(ht), t.removeAttribute(Ot), t.classList.remove(
    `${a}__button--effect-resolution-applied`,
    `${a}__button--effect-resolution-waiting`
  ), t.classList.add(`${a}__button--effect-resolution-action`, `${a}__button--effect-resolution-resisted`), t.setAttribute(ke, "resisted"), t.setAttribute("aria-label", "O alvo resistiu ao efeito"), t.replaceChildren(
    rr("✓", `${a}__button-icon--effect-resisted`),
    qt("Resistiu")
  );
}
function Vu(t, e) {
  Za(t), Ya(t, e);
}
function Za(t) {
  t.classList.remove(
    `${a}__button--effect-resolution-waiting`,
    `${a}__button--effect-resolution-resisted`
  ), t.removeAttribute(ke);
}
function Hu(t) {
  return t.replace(/\s*:\s*/u, " · ");
}
const Wu = {
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
}, Ku = new Set(
  Object.values(Wu)
), Yu = {
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
function Qu(t) {
  if (t == null)
    return { ok: !0, value: null, normalized: null };
  const e = Zu(t);
  if (!e)
    return { ok: !0, value: null, normalized: null };
  const n = Yu[e];
  return n !== void 0 ? { ok: !0, value: n, normalized: e } : Ku.has(t) ? { ok: !0, value: t, normalized: e } : { ok: !1, input: t, normalized: e };
}
function Xa(t) {
  switch (t) {
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
function Zu(t) {
  const e = t.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return e.length > 0 ? e : null;
}
class Ja {
  async applyDamage(e) {
    const n = e.actor, r = n.name ?? "Ator sem nome", o = n.id ?? null;
    if (!Array.isArray(e.instances) || e.instances.length === 0)
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
    let c = null;
    for (const [d, f] of e.instances.entries()) {
      const y = Xu(f, d);
      if (!y.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const T = Qu(f.damageType);
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
          Ju(y.id, f, T.value)
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
        for (const O of ed($.conditions))
          l.add(O);
        const g = td($.newPV);
        g !== null && (c = g), s.push({
          id: y.id,
          label: f.label ?? Xa(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: eo($.finalDamage, y.amount),
          blocked: eo($.blocked, 0),
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
    return _({
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
      newPV: c,
      conditions: Array.from(l),
      instances: s,
      source: e.source ?? null,
      originUuid: e.originUuid ?? null
    });
  }
}
function Xu(t, e) {
  if (!Number.isFinite(t.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(t.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: t.id ?? `damage-${e + 1}`,
    amount: n
  };
}
function Ju(t, e, n) {
  return {
    id: t,
    label: e.label ?? Xa(n),
    sourceRollId: e.sourceRollId ?? null,
    inputAmount: 0,
    finalDamage: 0,
    blocked: 0,
    damageType: e.damageType ? String(e.damageType) : null,
    systemDamageType: n,
    ignoreResistance: e.ignoreResistance === !0,
    nonLethal: e.nonLethal === !0
  };
}
function eo(t, e) {
  return typeof t == "number" && Number.isFinite(t) ? t : e;
}
function td(t) {
  return typeof t == "number" && Number.isFinite(t) ? t : null;
}
function ed(t) {
  return Array.isArray(t) ? t.filter(
    (e) => typeof e == "string" && e.length > 0
  ) : [];
}
async function ti(t, e) {
  const n = await nd(t, e);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${e} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: od(n),
    total: ad(n),
    diceBreakdown: id(n)
  };
}
function zt(t) {
  switch (t) {
    case "resilience":
      return "Fortitude";
    case "reflexes":
      return "Reflexos";
    case "will":
      return "Vontade";
    default:
      return t;
  }
}
async function nd(t, e) {
  const n = t;
  if (typeof n.rollSkill != "function")
    return null;
  const r = await Promise.resolve(
    n.rollSkill(
      { skill: e },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return rd(r);
}
function rd(t) {
  return no(t) ? t : Array.isArray(t) ? t.find(no) ?? null : null;
}
function no(t) {
  return !!(t && typeof t == "object" && "evaluate" in t && "total" in t);
}
function od(t) {
  const e = t.formula;
  return typeof e == "string" && e.trim().length > 0 ? e : "rolagem";
}
function ad(t) {
  const e = t.total;
  return typeof e == "number" && Number.isFinite(e) ? Math.trunc(e) : 0;
}
function id(t) {
  const e = t.dice;
  if (!Array.isArray(e)) return null;
  const n = e.find(sd);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((i) => {
    if (!i || typeof i != "object") return [];
    const s = i.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function sd(t) {
  return !!(t && typeof t == "object" && t.faces === 20);
}
function ld(t, e) {
  const n = gd(t?.rounds);
  if (!n)
    return ro(null);
  const r = t?.anchor ?? ei(e);
  if (!r)
    return {
      ...ro(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = t?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: cd(),
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
function ei(t) {
  const e = hd();
  if (!e?.id || !ni(e.round)) return null;
  const n = fd(e), r = ud(t, n) ?? md(e), o = H(r?.id), i = bd(r?.initiative), s = dd(e, r, n);
  return {
    mode: "combatantTurn",
    combatId: e.id,
    combatantId: o,
    round: e.round,
    turn: s,
    initiative: i,
    time: _d()
  };
}
function cd() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function ro(t) {
  return {
    duration: {},
    start: {},
    requestedRounds: t,
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
function ud(t, e) {
  return t?.id ? e.find((n) => pd(n) === t.id) ?? null : null;
}
function dd(t, e, n) {
  const r = H(e?.id);
  if (r) {
    const o = n.findIndex((i) => i.id === r);
    if (o >= 0) return o;
  }
  return yd(t.turn) ? t.turn : null;
}
function md(t) {
  return ee(t.combatant) ? t.combatant : null;
}
function fd(t) {
  const e = t.combatants;
  if (Array.isArray(e)) return e.filter(ee);
  if (e && typeof e == "object") {
    const n = e.contents;
    if (Array.isArray(n)) return n.filter(ee);
    const r = e.values;
    if (typeof r == "function")
      return Array.from(r.call(e)).filter(ee);
  }
  return [];
}
function pd(t) {
  return H(t.actor?.id) ?? H(t.actorId) ?? H(t.token?.actor?.id) ?? H(t.token?.actorId) ?? H(t.document?.actor?.id) ?? H(t.document?.actorId);
}
function gd(t) {
  return ni(t) ? Math.trunc(t) : null;
}
function hd() {
  return game.combat ?? null;
}
function _d() {
  const t = game.time?.worldTime;
  return typeof t == "number" && Number.isFinite(t) ? t : 0;
}
function ee(t) {
  return !!(t && typeof t == "object");
}
function H(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function bd(t) {
  return typeof t == "number" && Number.isFinite(t) ? t : null;
}
function ni(t) {
  return typeof t == "number" && Number.isInteger(t) && t > 0;
}
function yd(t) {
  return typeof t == "number" && Number.isInteger(t) && t >= 0;
}
class ri {
  constructor(e) {
    this.registry = e;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(e) {
    const n = this.registry.get(e);
    return n.ok ? _(n.value) : p({
      conditionId: e,
      reason: "condition-not-found",
      message: n.error.message
    });
  }
  async applyCondition(e) {
    const n = this.registry.get(e.conditionId);
    if (!n.ok)
      return p({
        actor: e.actor,
        actorId: e.actor?.id ?? null,
        actorName: e.actor?.name ?? "Ator sem nome",
        conditionId: e.conditionId,
        reason: "condition-not-found",
        message: n.error.message
      });
    const r = e.actor;
    if (!Sd(r))
      return p({
        actor: e.actor,
        actorId: e.actor?.id ?? null,
        actorName: e.actor?.name ?? "Ator sem nome",
        conditionId: e.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${e.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, i = ld(e.duration, r), s = Ad(o, e, i), c = e.refreshExisting ?? !0 ? Ld(r, o.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), _(oo(r, o, c.id ?? null, !1, !0, i));
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
      return _(oo(r, o, f, !0, !1, i));
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
  async removeCondition(e) {
    const n = e.actor;
    if (!n || typeof n != "object")
      return p({
        actor: e.actor,
        actorId: e.actor?.id ?? null,
        actorName: e.actor?.name ?? "Ator sem nome",
        conditionId: e.conditionId,
        reason: "invalid-actor",
        message: "Ator inválido para remover condição."
      });
    const r = this.resolveCanonicalConditionId(e.conditionId), o = ai(n, r);
    let i = 0;
    try {
      for (const s of o)
        await ao(n, s) === "deleted" && (i += 1);
    } catch (s) {
      return p({
        actor: n,
        actorId: n.id ?? null,
        actorName: n.name ?? "Ator sem nome",
        conditionId: e.conditionId,
        reason: "delete-failed",
        message: `Falha ao remover condição ${e.conditionId} de ${n.name ?? "ator sem nome"}.`,
        cause: s
      });
    }
    return _({
      actor: n,
      actorId: n.id ?? null,
      actorName: n.name ?? "Ator sem nome",
      conditionId: r,
      removed: i
    });
  }
  resolveCanonicalConditionId(e) {
    const n = this.registry.get(e);
    return n.ok ? n.value.id : e;
  }
  async cleanupExpiredConditions(e = {}) {
    const n = vd(), r = [];
    let o = 0, i = 0;
    for (const s of n) {
      const l = ir(s);
      o += l.length;
      for (const c of l) {
        if (!Rd(c, e)) continue;
        const d = oi(c);
        try {
          await ao(s, c) === "deleted" && (i += 1);
        } catch (f) {
          r.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: c.id ?? null,
            conditionId: d.conditionId,
            message: `Falha ao remover condição expirada ${d.conditionId ?? c.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
            cause: f
          });
        }
      }
    }
    return {
      reason: e.reason ?? "manual",
      scannedActors: n.length,
      scannedEffects: o,
      removedEffects: i,
      failures: r
    };
  }
}
function Ad(t, e, n) {
  const r = {
    schemaVersion: 1,
    conditionId: t.id,
    conditionLabel: t.label,
    definitionVersion: t.definitionVersion,
    source: e.source ?? null,
    originUuid: e.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: jd(),
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
    name: t.label,
    icon: t.icon,
    img: t.icon,
    description: t.description,
    origin: e.originUuid ?? void 0,
    disabled: !1,
    transfer: !1,
    changes: t.changes.map((o) => ({ ...o })),
    duration: Td(n.duration),
    start: $d(n.start),
    showIcon: 2,
    statuses: [t.id],
    flags: {
      [u]: r
    }
  };
}
function Td(t) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...t
  };
}
function $d(t) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: zd(),
    ...t
  };
}
function oo(t, e, n, r, o, i) {
  return {
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    conditionId: e.id,
    conditionLabel: e.label,
    effectId: n,
    created: r,
    refreshed: o,
    requestedRounds: i.requestedRounds,
    combatDurationApplied: i.combatDurationApplied,
    warning: i.warning
  };
}
function Rd(t, e) {
  const n = oi(t);
  if (!n.conditionId || !wd(n)) return !1;
  if (e.removeAllForCombat === !0)
    return !!(e.combatId && n.combatId === e.combatId);
  const r = qd();
  return n.durationMode === "combatantTurn" || kd(n) ? Id(n, r) : Ed(t) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !P(n.startRound) || !P(n.requestedRounds) || !P(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function wd(t) {
  return t.deleteOnExpire || t.expiresWithCombat ? !0 : t.combatDurationApplied && P(t.requestedRounds);
}
function kd(t) {
  return !!(t.combatDurationApplied && P(t.requestedRounds) && P(t.startRound) && (t.startCombatantId || ce(t.startTurn)));
}
function Ed(t) {
  const e = t.duration;
  if (!e || typeof e != "object") return !1;
  if (e.expired === !0) return !0;
  const n = e.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Id(t, e) {
  if (!e?.id || t.combatId && t.combatId !== e.id || !P(t.startRound) || !P(t.requestedRounds) || !P(e.round)) return !1;
  const n = t.startRound + t.requestedRounds;
  if (e.round < n) return !1;
  if (e.round > n) return !0;
  const r = Cd(e);
  return t.startCombatantId ? r === t.startCombatantId : ce(t.startTurn) && ce(e.turn) ? e.turn === t.startTurn : !1;
}
function Cd(t) {
  return dt(t.combatant?.id);
}
function oi(t) {
  const e = t.duration && typeof t.duration == "object" ? t.duration : {}, n = t.start && typeof t.start == "object" ? t.start : {};
  return {
    conditionId: ne(t, "conditionId"),
    requestedRounds: io(t, "requestedRounds") ?? Lt(e.value) ?? Lt(e.rounds),
    combatDurationApplied: Ue(t, "combatDurationApplied"),
    combatId: ne(t, "combatId") ?? dt(n.combat) ?? dt(e.combat),
    startCombatantId: ne(t, "startCombatantId") ?? dt(n.combatant),
    startInitiative: Md(t, "startInitiative") ?? ii(n.initiative),
    startRound: io(t, "startRound") ?? Lt(n.round) ?? Lt(e.startRound),
    startTurn: Od(t, "startTurn") ?? sn(n.turn) ?? sn(e.startTurn),
    expiryEvent: Fd(t, "expiryEvent") ?? si(e.expiry),
    durationMode: Bd(t, "durationMode"),
    deleteOnExpire: Ue(t, "deleteOnExpire"),
    expiresWithCombat: Ue(t, "expiresWithCombat")
  };
}
function Sd(t) {
  return !!(t && typeof t.createEmbeddedDocuments == "function");
}
function Ld(t, e) {
  return ai(t, e)[0] ?? null;
}
function ai(t, e) {
  return ir(t).filter((n) => xd(n) === e);
}
async function ao(t, e) {
  const n = e.id ?? null, r = n ? Dd(t, n) : e;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (Pd(o)) return "missing";
    throw o;
  }
}
function Dd(t, e) {
  return ir(t).find((n) => n.id === e) ?? null;
}
function Pd(t) {
  const e = t instanceof Error ? t.message : String(t);
  return e.includes("does not exist in the EmbeddedCollectionDelta collection") || e.includes("does not exist in the EmbeddedCollection collection");
}
function vd() {
  const t = /* @__PURE__ */ new Map(), e = game.actors;
  if (Array.isArray(e?.contents))
    for (const n of e.contents)
      Zt(t, n);
  typeof e?.forEach == "function" && e.forEach((n) => {
    Zt(t, n);
  });
  for (const n of Nd())
    Zt(t, n.actor), Zt(t, n.document?.actor);
  return Array.from(t.values());
}
function Zt(t, e) {
  if (!Ud(e)) return;
  const r = dt(e.uuid) ?? e.id ?? e.name ?? `actor-${t.size}`;
  t.set(r, e);
}
function Nd() {
  const t = canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function ir(t) {
  const e = t.effects;
  return e ? Array.isArray(e) ? e : Array.isArray(e.contents) ? e.contents : typeof e.filter == "function" ? e.filter(() => !0) : [] : [];
}
function xd(t) {
  return ne(t, "conditionId");
}
function ne(t, e) {
  return dt(it(t, e));
}
function io(t, e) {
  return Lt(it(t, e));
}
function Od(t, e) {
  return sn(it(t, e));
}
function Md(t, e) {
  return ii(it(t, e));
}
function Fd(t, e) {
  return si(it(t, e));
}
function Bd(t, e) {
  const n = it(t, e);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Ue(t, e) {
  return it(t, e) === !0;
}
function it(t, e) {
  const n = t.getFlag?.(u, e);
  if (n !== void 0) return n;
  const r = t.flags;
  if (!r || typeof r != "object") return;
  const o = r[u];
  if (!(!o || typeof o != "object"))
    return o[e];
}
function dt(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function Lt(t) {
  return P(t) ? Math.trunc(t) : null;
}
function sn(t) {
  return ce(t) ? Math.trunc(t) : null;
}
function ii(t) {
  return typeof t == "number" && Number.isFinite(t) ? t : null;
}
function si(t) {
  return t === "turnStart" || t === "turnEnd" ? t : null;
}
function Ud(t) {
  return !!(t && typeof t == "object" && "effects" in t);
}
function qd() {
  return game.combat ?? null;
}
function zd() {
  const t = game.time?.worldTime;
  return typeof t == "number" && Number.isFinite(t) ? t : 0;
}
function P(t) {
  return typeof t == "number" && Number.isInteger(t) && t > 0;
}
function ce(t) {
  return typeof t == "number" && Number.isInteger(t) && t >= 0;
}
function jd() {
  return game.user?.id ?? null;
}
const Gd = "icons/svg/downgrade.svg", Vd = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(t) {
  return {
    id: t.id,
    aliases: t.aliases ?? [],
    label: t.label,
    icon: t.icon ?? Gd,
    description: Vd,
    definitionVersion: t.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Hd = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Wd = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Kd = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Yd = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Qd = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Zd = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Xd = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Jd = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), tm = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), em = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), nm = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), rm = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), om = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), am = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), im = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), sm = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), lm = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), cm = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), um = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), dm = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), mm = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), fm = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), pm = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), gm = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), hm = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), _m = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), bm = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), ym = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Am = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Tm = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), $m = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Rm = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), wm = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), km = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Em = [
  Hd,
  Wd,
  Kd,
  Yd,
  Qd,
  Zd,
  Xd,
  Jd,
  tm,
  em,
  nm,
  rm,
  om,
  am,
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
  _m,
  bm,
  ym,
  Am,
  Tm,
  $m,
  Rm,
  wm,
  km
];
class Im {
  definitions = /* @__PURE__ */ new Map();
  lookup = /* @__PURE__ */ new Map();
  constructor(e) {
    for (const n of e) {
      this.definitions.set(n.id, n), this.registerLookup(n.id, n.id), this.registerLookup(n.label, n.id);
      for (const r of n.aliases ?? [])
        this.registerLookup(r, n.id);
    }
  }
  list() {
    return Array.from(this.definitions.values()).map(so);
  }
  get(e) {
    const n = this.lookup.get(lo(e)), r = n ? this.definitions.get(n) : null;
    return r ? _(so(r)) : p({
      reason: "condition-not-found",
      conditionId: e,
      message: `Condição não registrada no Paranormal Toolkit: ${e}.`
    });
  }
  registerLookup(e, n) {
    const r = lo(e);
    r && this.lookup.set(r, n);
  }
}
function li() {
  return new Im(Em);
}
function so(t) {
  return {
    ...t,
    aliases: t.aliases ? [...t.aliases] : void 0,
    changes: t.changes.map((e) => ({ ...e }))
  };
}
function lo(t) {
  return t.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Cm(t) {
  const e = document.createElement("div");
  e.classList.add(`${a}__workflow-roll`, ...t.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${a}__workflow-roll-formula`), n.textContent = t.formula;
  const r = document.createElement("strong");
  r.classList.add(`${a}__workflow-roll-total`), r.textContent = t.total === null ? "—" : String(t.total), e.append(n, r);
  const o = Lm(t.formula, t.diceBreakdown ?? null);
  return o && e.append(o), e;
}
function Sm(t) {
  const e = Array.from(t?.querySelectorAll(`.${a}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return e.length > 0 ? `(${e.join(", ")})` : null;
}
function Lm(t, e) {
  const n = Dm(e);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${a}__workflow-dice-tray`);
  for (const o of Pm(n, t)) {
    const i = document.createElement("span");
    i.classList.add(`${a}__workflow-die`), o.active || i.classList.add(`${a}__workflow-die--inactive`), i.textContent = String(o.value), r.append(i);
  }
  return r;
}
function Dm(t) {
  return t ? (/\(([^)]+)\)/u.exec(t)?.[1] ?? t).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Pm(t, e) {
  if (t.length <= 1) return t.map((r) => ({ value: r, active: !0 }));
  const n = e.toLowerCase();
  return n.includes("kh") ? co(t, "highest") : n.includes("kl") ? co(t, "lowest") : t.map((r) => ({ value: r, active: !0 }));
}
function co(t, e) {
  const n = e === "highest" ? Math.max(...t) : Math.min(...t);
  let r = !1;
  return t.map((o) => {
    const i = !r && o === n;
    return i && (r = !0), { value: o, active: i };
  });
}
const Xt = "data-paranormal-toolkit-prompt-id", ci = "multiTargetResistanceResults", di = "multiTargetDamageApplications", mi = "multiTargetEffectApplications";
function vm(t) {
  const e = /* @__PURE__ */ new Map(), r = lr(t)?.[ci];
  if (!N(r)) return e;
  for (const [o, i] of Object.entries(r))
    Bm(i) && i.targetId === o && e.set(o, i);
  return e;
}
async function Nm(t, e) {
  await sr(t, ci, e.targetId, e);
}
function xm(t) {
  const e = /* @__PURE__ */ new Map(), r = lr(t)?.[di];
  if (!N(r)) return e;
  for (const [o, i] of Object.entries(r))
    Um(i) && i.targetId === o && e.set(o, i);
  return e;
}
async function Om(t, e) {
  await sr(
    t,
    di,
    e.targetId,
    e
  );
}
function Mm(t) {
  const e = /* @__PURE__ */ new Map(), r = lr(t)?.[mi];
  if (!N(r)) return e;
  for (const [o, i] of Object.entries(r))
    zm(i) && i.targetId === o && e.set(o, i);
  return e;
}
async function Fm(t, e) {
  await sr(
    t,
    mi,
    e.targetId,
    e
  );
}
async function sr(t, e, n, r) {
  const o = fi(t);
  if (!o) return;
  const i = pi(t), s = gi(i);
  if (!i || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((d) => {
    if (!N(d) || d.pendingId !== o) return d;
    const f = N(d[e]) ? d[e] : {};
    return l = !0, {
      ...d,
      [e]: {
        ...f,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(i.setFlag?.(u, Ae, {
    ...s,
    prompts: c
  }));
}
function lr(t) {
  const e = fi(t);
  if (!e) return null;
  const n = pi(t), r = gi(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((i) => N(i) ? i.pendingId === e : !1) ?? null;
}
function fi(t) {
  return (t.closest(`[${Xt}]`) ?? t.querySelector(`[${Xt}]`) ?? t.parentElement?.querySelector(`[${Xt}]`) ?? null)?.getAttribute(Xt) ?? null;
}
function pi(t) {
  const n = t.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return jm(o) ? o : null;
}
function gi(t) {
  const e = t?.getFlag?.(u, Ae);
  return N(e) ? e : null;
}
function Bm(t) {
  return N(t) ? typeof t.targetId == "string" && typeof t.targetName == "string" && typeof t.skill == "string" && typeof t.skillLabel == "string" && typeof t.formula == "string" && typeof t.total == "number" && Number.isFinite(t.total) && (typeof t.diceBreakdown == "string" || t.diceBreakdown === null) && typeof t.rolledAt == "string" : !1;
}
function Um(t) {
  return N(t) ? typeof t.targetId == "string" && typeof t.targetName == "string" && qm(t.mode) && typeof t.inputAmount == "number" && Number.isFinite(t.inputAmount) && typeof t.finalDamage == "number" && Number.isFinite(t.finalDamage) && typeof t.blocked == "number" && Number.isFinite(t.blocked) && typeof t.appliedAt == "string" : !1;
}
function qm(t) {
  return t === "normal" || t === "half";
}
function zm(t) {
  return N(t) ? typeof t.targetId == "string" && typeof t.targetName == "string" && typeof t.conditionId == "string" && typeof t.conditionLabel == "string" && (typeof t.effectId == "string" || t.effectId === null) && typeof t.created == "boolean" && typeof t.refreshed == "boolean" && typeof t.appliedAt == "string" : !1;
}
function jm(t) {
  return !!(t && typeof t == "object" && typeof t.getFlag == "function");
}
function N(t) {
  return !!(t && typeof t == "object");
}
const hi = "data-paranormal-toolkit-resistance-skill", _i = "data-paranormal-toolkit-resistance-skill-label", ln = "data-paranormal-toolkit-multi-target-section", cr = "data-paranormal-toolkit-multi-target-damage-info", bi = "data-paranormal-toolkit-multi-target-effect-info", yi = "data-paranormal-toolkit-multi-target-toggle", Ai = "data-paranormal-toolkit-multi-target-details", L = "data-paranormal-toolkit-multi-target-target", Gm = "data-paranormal-toolkit-multi-target-state", cn = "data-paranormal-toolkit-multi-target-roll-total", un = "data-paranormal-toolkit-multi-target-roll-formula", re = "data-paranormal-toolkit-multi-target-roll-dice", dn = "data-paranormal-toolkit-multi-target-roll-skill", mn = "data-paranormal-toolkit-multi-target-roll-skill-label", fn = "data-paranormal-toolkit-multi-target-roll-target-name", pn = "data-paranormal-toolkit-multi-target-roll-rolled-at", gn = "data-paranormal-toolkit-multi-target-damage-mode", hn = "data-paranormal-toolkit-multi-target-damage-input-amount", _n = "data-paranormal-toolkit-multi-target-damage-final-amount", bn = "data-paranormal-toolkit-multi-target-damage-blocked", yn = "data-paranormal-toolkit-multi-target-damage-target-name", An = "data-paranormal-toolkit-multi-target-damage-applied-at", Tn = "data-paranormal-toolkit-multi-target-effect-condition-id", $n = "data-paranormal-toolkit-multi-target-effect-condition-label", Rn = "data-paranormal-toolkit-multi-target-effect-effect-id", wn = "data-paranormal-toolkit-multi-target-effect-created", kn = "data-paranormal-toolkit-multi-target-effect-refreshed", En = "data-paranormal-toolkit-multi-target-effect-target-name", In = "data-paranormal-toolkit-multi-target-effect-applied-at", Ti = li(), Vm = new ri(Ti), Hm = new Ja(), yt = "pending", Y = "success", Ee = "failure", $i = "rolled";
function Wm(t) {
  const e = Ri(t);
  if (!e) return !1;
  t.rollCard.classList.add(`${a}__roll-card--multi-target`), mf(t);
  const n = ff(t.rollCard);
  gf(n, e.damage), _f(t.rollCard, n);
  const r = bf(t.rollCard);
  if (ki(r, e), Uf(t.rollCard, r, n), e.effect) {
    const o = qf(t.rollCard);
    zf(o, e.effect), jf(t.rollCard, o, r);
  } else
    Ni(t.rollCard)?.remove();
  return !0;
}
function Ri(t) {
  const e = tf(t.rollCard, t.damageSection), n = ef(t.rollCard), r = nf(t.rollCard), o = rf(t.rollCard), i = Km(t.rollCard).map((s, l) => {
    const c = Wf(s, l), d = n.get(c) ?? null;
    return {
      id: c,
      name: s,
      state: lf(d, e?.difficulty ?? null),
      resistanceResult: d,
      damageApplication: r.get(c) ?? null,
      effectApplication: o.get(c) ?? null
    };
  });
  return i.length <= 1 || !t.damageSection ? null : {
    rollCard: t.rollCard,
    targets: i,
    damage: Ym(t.damageSection),
    effect: Qm(t.effectSection),
    resistance: e
  };
}
function Km(t) {
  const n = t.closest(`.${a}`)?.querySelector(`.${a}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((o) => o.trim()).filter((o) => o.length > 0 && Oi(o) !== "nenhum alvo") : [];
}
function Ym(t) {
  const e = cf(t), n = e !== null ? Math.floor(e / 2) : null;
  return {
    typeLabel: df(t),
    formula: uf(t) ?? "—",
    total: e,
    diceBreakdown: Sm(t),
    normalAmount: e,
    halfAmount: n,
    normalLabel: e !== null ? `Normal: ${e} PV` : "Normal: —",
    normalCompactLabel: e !== null ? `${e} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Qm(t) {
  const e = t?.querySelector(`.${a}__effect-section-label`)?.textContent?.trim();
  if (!e || e.length === 0) return null;
  const n = Zm(e);
  return {
    label: e,
    conditionId: n?.id ?? null,
    conditionLabel: n?.label ?? null,
    duration: Jm(e),
    source: "item-use.multi-target-effect",
    originUuid: null
  };
}
function Zm(t) {
  for (const e of Xm(t)) {
    const n = Ti.get(e);
    if (n.ok)
      return {
        id: n.value.id,
        label: n.value.label
      };
  }
  return null;
}
function Xm(t) {
  const e = t.trim(), n = [
    e,
    e.replace(/^aplicar\s+/iu, "").trim(),
    e.split(/[:•·|–—-]/u)[0]?.trim() ?? "",
    e.replace(/\b\d+\s+rodadas?\b/iu, "").replace(/[:•·|–—-]/gu, " ").trim()
  ];
  return Array.from(new Set(n.filter((r) => r.length > 0)));
}
function Jm(t) {
  const e = t.match(/\b(\d+)\s+rodadas?\b/iu);
  if (!e) return null;
  const n = Number.parseInt(e[1] ?? "", 10);
  return !Number.isInteger(n) || n <= 0 ? null : {
    rounds: n,
    expiry: "turnStart"
  };
}
function tf(t, e) {
  const n = e?.querySelector(`.${a}__resistance-description`)?.textContent?.trim(), r = e?.querySelector(Te) ?? null, o = r?.getAttribute(hi) ?? null, i = r?.getAttribute(_i) ?? (o ? zt(o) : null);
  return !n && !o ? null : {
    description: n ?? "Resistência do alvo.",
    formula: e?.querySelector(`.${a}__resistance .${a}__workflow-roll-formula`)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: i,
    difficulty: er(t)
  };
}
function ef(t) {
  const e = vm(t);
  for (const [n, r] of sf(t))
    e.set(n, r);
  return e;
}
function nf(t) {
  const e = xm(t);
  for (const [n, r] of af(t))
    e.set(n, r);
  return e;
}
function rf(t) {
  const e = Mm(t);
  for (const [n, r] of of(t))
    e.set(n, r);
  return e;
}
function of(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = n.getAttribute(Tn), i = n.getAttribute($n), s = n.getAttribute(Rn), l = fo(n.getAttribute(wn)), c = fo(n.getAttribute(kn)), d = n.getAttribute(En), f = n.getAttribute(In);
    !r || !o || !i || l === null || c === null || !d || !f || e.set(r, {
      targetId: r,
      targetName: d,
      conditionId: o,
      conditionLabel: i,
      effectId: s && s.length > 0 ? s : null,
      created: l,
      refreshed: c,
      appliedAt: f
    });
  }
  return e;
}
function af(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = n.getAttribute(gn), i = oe(n.getAttribute(hn)), s = oe(n.getAttribute(_n)), l = oe(n.getAttribute(bn)), c = n.getAttribute(yn), d = n.getAttribute(An);
    !r || !Yf(o) || i === null || s === null || l === null || !c || !d || e.set(r, {
      targetId: r,
      targetName: c,
      mode: o,
      inputAmount: i,
      finalDamage: s,
      blocked: l,
      appliedAt: d
    });
  }
  return e;
}
function sf(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = oe(n.getAttribute(cn)), i = n.getAttribute(un), s = n.getAttribute(dn), l = n.getAttribute(mn), c = n.getAttribute(fn), d = n.getAttribute(pn);
    !r || o === null || !i || !s || !l || !c || !d || e.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: i,
      total: o,
      diceBreakdown: n.getAttribute(re),
      rolledAt: d
    });
  }
  return e;
}
function lf(t, e) {
  return t ? e === null ? $i : t.total >= e ? Y : Ee : yt;
}
function cf(t) {
  const e = t?.querySelector(`.${a}__workflow-roll-total`)?.textContent?.trim();
  if (!e) return null;
  const n = Number(e.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function uf(t) {
  const e = t?.querySelector(`.${a}__workflow-roll-formula`)?.textContent?.trim();
  return e && e.length > 0 ? e : null;
}
function df(t) {
  const e = t?.querySelector(`.${a}__workflow-section-description`)?.textContent?.trim();
  return e && e.length > 0 ? e : null;
}
function mf(t) {
  t.damageSection?.classList.add(`${a}__workflow-section--multi-target-source`), t.effectSection?.classList.add(`${a}__workflow-section--multi-target-effect-source`);
}
function ff(t) {
  const e = pf(t);
  if (e) return e;
  const n = document.createElement("section");
  return n.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect`,
    `${a}__workflow-section--damage-info`
  ), n.setAttribute(cr, "true"), n;
}
function pf(t) {
  return t.querySelector(`[${cr}="true"]`);
}
function gf(t, e) {
  t.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${a}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), t.append(n), e.typeLabel) {
    const o = document.createElement("span");
    o.classList.add(`${a}__workflow-section-description`), o.textContent = e.typeLabel, t.append(o);
  }
  t.append(wi(e.formula, e.total, e.diceBreakdown));
}
function wi(t, e, n, r = !1) {
  const o = Cm({
    formula: t,
    total: e,
    diceBreakdown: n,
    classNames: [`${a}__workflow-roll--compact-info`]
  });
  return hf(o, r), o;
}
function hf(t, e) {
  const n = t.querySelector($e), r = t.querySelector(Jn);
  if (!n || !r) return;
  t.classList.toggle(Xn, e), n.hidden = !e, r.classList.add(tr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", e ? "true" : "false"), r.title = e ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const o = r.querySelector("i") ?? document.createElement("i");
  o.classList.add("fa-solid"), o.classList.toggle("fa-chevron-down", !e), o.classList.toggle("fa-chevron-up", e), o.setAttribute("aria-hidden", "true"), o.parentElement || r.append(o);
}
function _f(t, e) {
  const n = we(t, "Conjuração");
  if (!n) {
    t.prepend(e);
    return;
  }
  e.parentElement === t && e.previousElementSibling === n || t.insertBefore(e, n.nextElementSibling);
}
function bf(t) {
  const e = t.querySelector(`[${ln}="true"]`);
  if (e) return e;
  const n = document.createElement("section");
  return n.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--targets`
  ), n.setAttribute(ln, "true"), n;
}
function ki(t, e) {
  const n = yf(t);
  t.replaceChildren(Af(e), $f(e, n));
}
function yf(t) {
  return new Set(
    Array.from(t.querySelectorAll(`[${L}]`)).filter((e) => e.getAttribute("aria-expanded") === "true").map((e) => e.getAttribute(L)).filter(Kf)
  );
}
function Af(t) {
  const e = document.createElement("div");
  e.classList.add(`${a}__workflow-section-header`, `${a}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${a}__targets-status`), r.textContent = Tf(t.targets), e.append(n, r), e;
}
function Tf(t) {
  const e = t.length, n = t.filter((l) => l.state === Ee).length, r = t.filter((l) => l.state === Y).length, o = t.filter((l) => l.state === yt).length, i = t.filter((l) => l.state === $i).length, s = [`${e} ${e === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), o > 0 && s.push(`${o} ${o === 1 ? "pendente" : "pendentes"}`), i > 0 && s.push(`${i} ${i === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function $f(t, e) {
  const n = document.createElement("div");
  n.classList.add(`${a}__targets-list`);
  for (const r of t.targets)
    n.append(Rf(r, t, e.has(r.id)));
  return n;
}
function Rf(t, e, n) {
  const r = document.createElement("article");
  r.classList.add(`${a}__target-row`, `${a}__target-row--${t.state}`), t.damageApplication && r.classList.add(`${a}__target-row--damage-applied`), t.effectApplication && r.classList.add(`${a}__target-row--effect-applied`), r.setAttribute(L, t.id), r.setAttribute(Gm, t.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${t.name}`), Ei(r, t.resistanceResult), Ii(r, t.damageApplication), Ci(r, t.effectApplication);
  const o = wf(t, e, r), i = Of(t, e);
  return i.hidden = !n, r.addEventListener("click", (s) => {
    mo(s.target) || uo(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || mo(s.target) || (s.preventDefault(), uo(r));
  }), r.append(o, i), r;
}
function Ei(t, e) {
  if (!e) {
    t.removeAttribute(cn), t.removeAttribute(un), t.removeAttribute(re), t.removeAttribute(dn), t.removeAttribute(mn), t.removeAttribute(fn), t.removeAttribute(pn);
    return;
  }
  t.setAttribute(cn, String(e.total)), t.setAttribute(un, e.formula), t.setAttribute(dn, e.skill), t.setAttribute(mn, e.skillLabel), t.setAttribute(fn, e.targetName), t.setAttribute(pn, e.rolledAt), e.diceBreakdown ? t.setAttribute(re, e.diceBreakdown) : t.removeAttribute(re);
}
function Ii(t, e) {
  if (!e) {
    t.removeAttribute(gn), t.removeAttribute(hn), t.removeAttribute(_n), t.removeAttribute(bn), t.removeAttribute(yn), t.removeAttribute(An);
    return;
  }
  t.setAttribute(gn, e.mode), t.setAttribute(hn, String(e.inputAmount)), t.setAttribute(_n, String(e.finalDamage)), t.setAttribute(bn, String(e.blocked)), t.setAttribute(yn, e.targetName), t.setAttribute(An, e.appliedAt);
}
function Ci(t, e) {
  if (!e) {
    t.removeAttribute(Tn), t.removeAttribute($n), t.removeAttribute(Rn), t.removeAttribute(wn), t.removeAttribute(kn), t.removeAttribute(En), t.removeAttribute(In);
    return;
  }
  t.setAttribute(Tn, e.conditionId), t.setAttribute($n, e.conditionLabel), t.setAttribute(Rn, e.effectId ?? ""), t.setAttribute(wn, String(e.created)), t.setAttribute(kn, String(e.refreshed)), t.setAttribute(En, e.targetName), t.setAttribute(In, e.appliedAt);
}
function wf(t, e, n) {
  const r = document.createElement("div");
  r.classList.add(`${a}__target-summary`);
  const o = document.createElement("div");
  o.classList.add(`${a}__target-summary-main`);
  const i = kf(t), s = document.createElement("strong");
  s.classList.add(`${a}__target-name`), s.textContent = t.name;
  const l = Ef(t, e.resistance);
  Cf(l, n, t, e);
  const c = xf(n);
  o.append(i, s, l, c);
  const d = document.createElement("div");
  return d.classList.add(`${a}__target-summary-actions`), d.append(
    Si(t, e, "compact"),
    Pi(t, e, "compact")
  ), r.append(o, d), r;
}
function kf(t) {
  const e = document.createElement("span");
  return e.classList.add(`${a}__target-avatar`), e.setAttribute("aria-hidden", "true"), e.textContent = t.name.trim().charAt(0).toLocaleUpperCase() || "?", e;
}
function Ef(t, e) {
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${a}__target-resistance-button`, `${a}__target-resistance-button--${t.state}`), n.setAttribute("aria-label", If(t, e)), e?.skill && (n.setAttribute(hi, e.skill), n.setAttribute(_i, e.skillLabel ?? zt(e.skill))), !e?.skill)
    return n.disabled = !0, n.title = "Resistência não configurada", n.textContent = "—", n;
  if (n.title = t.resistanceResult ? `Rolar ${e.skillLabel ?? e.skill} novamente` : `Rolar ${e.skillLabel ?? e.skill} de ${t.name}`, !t.resistanceResult) {
    const i = document.createElement("i");
    i.classList.add("fa-solid", "fa-dice-d20"), i.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    return s.classList.add(`${a}__target-resistance-fallback`), s.textContent = "d20", n.append(i, s), n;
  }
  const r = document.createElement("span");
  r.classList.add(`${a}__target-resistance-total`), r.textContent = String(t.resistanceResult.total);
  const o = document.createElement("span");
  return o.classList.add(`${a}__target-resistance-mark`), o.setAttribute("aria-hidden", "true"), o.textContent = t.state === Y ? "✓" : t.state === Ee ? "✕" : "", n.append(r, o), n;
}
function If(t, e) {
  const n = e?.skillLabel ?? e?.skill ?? "resistência";
  if (!t.resistanceResult) return `Rolar ${n} de ${t.name}`;
  const r = t.state === Y ? "sucesso" : t.state === Ee ? "falha" : "resultado";
  return `${n} de ${t.name}: ${t.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Cf(t, e, n, r) {
  t.addEventListener("click", (o) => {
    o.stopPropagation(), Sf(e, t, n, r);
  });
}
async function Sf(t, e, n, r) {
  const o = r.resistance, i = o?.skill, s = o?.skillLabel ?? (i ? zt(i) : "Resistência");
  if (!i) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = dr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  e.disabled = !0, e.classList.add(`${a}__target-resistance-button--rolling`);
  const c = e.innerHTML;
  e.textContent = "...";
  try {
    const d = await ti(l, i);
    await Hf(d.roll);
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
    Ei(t, f);
    try {
      await Nm(r.rollCard, f);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", y);
    }
    ur(t);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), e.innerHTML = c;
  } finally {
    e.disabled = !1, e.classList.remove(`${a}__target-resistance-button--rolling`);
  }
}
function ur(t) {
  const e = t.closest(`[${ln}="true"]`), n = t.closest(`.${a}__roll-card`);
  if (!e || !n) return;
  const r = Ri({
    rollCard: n,
    damageSection: Lf(n) ?? we(n, "Dano"),
    effectSection: Df(n)
  });
  r && ki(e, r);
}
function Lf(t) {
  return Array.from(t.querySelectorAll(`.${a}__workflow-section--multi-target-source`)).find((e) => e.getAttribute(cr) !== "true") ?? null;
}
function Df(t) {
  return t.querySelector(`.${a}__workflow-section--multi-target-effect-source`);
}
function Si(t, e, n) {
  if (t.damageApplication)
    return D(
      "✓",
      Pf(t.damageApplication, n),
      [`${a}__target-action--damage`, `${a}__target-action--applied`],
      !0
    );
  if (t.state === yt)
    return D(
      "◇",
      n === "full" ? "Role resistência primeiro" : "Role res.",
      [`${a}__target-action--damage`, `${a}__target-action--waiting-damage`],
      !0
    );
  const r = Li(t), o = Di(r, e.damage);
  if (o === null)
    return D(
      "⚡",
      "Dano indisponível",
      [`${a}__target-action--damage`, `${a}__target-action--disabled`],
      !0
    );
  const i = r === "half" ? n === "full" ? e.damage.halfLabel ?? `Metade: ${o} PV` : e.damage.halfCompactLabel ?? `½ ${o} PV` : n === "full" ? e.damage.normalLabel : e.damage.normalCompactLabel, s = r === "half" ? "🛡️" : "⚡", l = r === "half" ? `${a}__target-action--half-damage` : `${a}__target-action--normal-damage`, c = D(
    s,
    i,
    [`${a}__target-action--damage`, l],
    !1
  );
  return c.title = `Aplicar ${i} em ${t.name}`, c.setAttribute("aria-label", c.title), c.addEventListener("click", (d) => {
    d.stopPropagation();
    const f = c.closest(`[${L}]`);
    f && vf(f, c, t, e);
  }), c;
}
function Pf(t, e) {
  const n = t.blocked > 0 ? ` (RD ${t.blocked})` : "";
  return e === "compact" ? `${t.finalDamage} PV` : `Dano aplicado: ${t.finalDamage} PV${n}`;
}
function Li(t) {
  return t.state === Y ? "half" : "normal";
}
function Di(t, e) {
  return t === "half" ? e.halfAmount : e.normalAmount;
}
async function vf(t, e, n, r) {
  if (n.damageApplication) return;
  if (n.state === yt) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const o = Li(n), i = Di(o, r.damage);
  if (i === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const s = dr(n.name);
  if (!s) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  e.disabled = !0, e.classList.add(`${a}__target-action--applying`);
  const l = e.innerHTML;
  e.textContent = "Aplicando...";
  try {
    const c = await Hm.applyDamage({
      actor: s,
      instances: [
        {
          id: `multi-target:${n.id}:${o}`,
          amount: i,
          damageType: r.damage.typeLabel,
          label: o === "half" ? "Metade" : "Dano normal",
          sourceRollId: "damage",
          ignoreResistance: !1
        }
      ],
      source: "item-use.multi-target-damage",
      originUuid: null
    });
    if (!c.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${c.error.message}`), e.innerHTML = l;
      return;
    }
    const d = {
      targetId: n.id,
      targetName: s.name ?? n.name,
      mode: o,
      inputAmount: i,
      finalDamage: c.value.totalFinalDamage,
      blocked: c.value.totalBlocked,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Ii(t, d);
    try {
      await Om(r.rollCard, d);
    } catch (f) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", f);
    }
    ui.notifications?.info?.(`Paranormal Toolkit: ${d.finalDamage} PV aplicado em ${d.targetName}.`), ur(t);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", c), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), e.innerHTML = l;
  } finally {
    e.disabled = !1, e.classList.remove(`${a}__target-action--applying`);
  }
}
function Pi(t, e, n) {
  if (!e.effect)
    return D(
      "✦",
      "Sem efeito",
      [`${a}__target-action--effect`, `${a}__target-action--disabled`],
      !0
    );
  if (t.effectApplication)
    return D(
      "✓",
      n === "full" ? `${t.effectApplication.conditionLabel} aplicado` : "Aplicado",
      [`${a}__target-action--effect`, `${a}__target-action--effect-applied`],
      !0
    );
  if (t.state === yt)
    return D(
      "◇",
      n === "full" ? "Role resistência primeiro" : "Role res.",
      [`${a}__target-action--effect`, `${a}__target-action--waiting-effect`],
      !0
    );
  if (t.state === Y)
    return D(
      "✓",
      n === "full" ? "Resistiu ao efeito" : "Resistiu",
      [`${a}__target-action--effect`, `${a}__target-action--resisted`],
      !0
    );
  if (!e.effect.conditionId)
    return D(
      "✦",
      n === "full" ? "Efeito não resolvido" : "Efeito —",
      [`${a}__target-action--effect`, `${a}__target-action--disabled`],
      !0
    );
  const r = D(
    "✦",
    n === "full" ? `Aplicar ${e.effect.conditionLabel ?? "efeito"}` : "Efeito",
    [`${a}__target-action--effect`, `${a}__target-action--pending-effect`],
    !1
  );
  return r.title = `Aplicar ${e.effect.conditionLabel ?? e.effect.label} em ${t.name}`, r.setAttribute("aria-label", r.title), r.addEventListener("click", (o) => {
    o.stopPropagation();
    const i = r.closest(`[${L}]`);
    i && Nf(i, r, t, e);
  }), r;
}
async function Nf(t, e, n, r) {
  if (n.effectApplication) return;
  if (n.state === yt) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar efeito.");
    return;
  }
  if (n.state === Y) {
    ui.notifications?.warn?.("Paranormal Toolkit: este alvo resistiu ao efeito.");
    return;
  }
  const o = r.effect;
  if (!o?.conditionId) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver a condição deste efeito.");
    return;
  }
  const i = dr(n.name);
  if (!i) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  e.disabled = !0, e.classList.add(`${a}__target-action--applying`);
  const s = e.innerHTML;
  e.textContent = "Aplicando...";
  try {
    const l = await Vm.applyCondition({
      actor: i,
      conditionId: o.conditionId,
      duration: o.duration,
      originUuid: o.originUuid,
      source: o.source
    });
    if (!l.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${l.error.message}`), e.innerHTML = s;
      return;
    }
    const c = {
      targetId: n.id,
      targetName: l.value.actorName,
      conditionId: l.value.conditionId,
      conditionLabel: l.value.conditionLabel,
      effectId: l.value.effectId,
      created: l.value.created,
      refreshed: l.value.refreshed,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Ci(t, c);
    try {
      await Fm(r.rollCard, c);
    } catch (d) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", d);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), ui.notifications?.info?.(`Paranormal Toolkit: ${c.conditionLabel} aplicado em ${c.targetName}.`), ur(t);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), e.innerHTML = s;
  } finally {
    e.disabled = !1, e.classList.remove(`${a}__target-action--applying`);
  }
}
function D(t, e, n, r) {
  const o = document.createElement("button");
  o.type = "button", o.classList.add(`${a}__target-action`, `${a}__target-action--pending`, ...n), o.disabled = r;
  const i = document.createElement("span");
  i.classList.add(`${a}__target-action-icon`), i.setAttribute("aria-hidden", "true"), i.textContent = t;
  const s = document.createElement("span");
  return s.classList.add(`${a}__target-action-label`), s.textContent = e, o.append(i, s), o;
}
function xf(t) {
  const e = document.createElement("span");
  return e.classList.add(`${a}__target-toggle`), e.setAttribute(yi, "true"), e.setAttribute("aria-hidden", "true"), vi(t, e), e;
}
function uo(t) {
  const e = t.querySelector(`[${Ai}="true"]`);
  if (!e) return;
  const n = e.hidden;
  e.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = t.querySelector(`[${yi}="true"]`);
  r && vi(t, r);
}
function vi(t, e) {
  const n = t.getAttribute("aria-expanded") === "true";
  e.textContent = n ? "⌃" : "⌄";
}
function mo(t) {
  return t instanceof HTMLElement ? !!t.closest([
    "button",
    "a",
    "input",
    "select",
    "textarea",
    `.${a}__workflow-roll`,
    `.${a}__workflow-roll-formula`,
    `.${a}__workflow-dice-tray`
  ].join(", ")) : !1;
}
function Of(t, e) {
  const n = document.createElement("div");
  n.classList.add(`${a}__target-details`), n.setAttribute(Ai, "true");
  const r = document.createElement("div");
  r.classList.add(`${a}__target-resistance-details`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const i = document.createElement("span");
  i.textContent = e.resistance?.description ?? "Resistência pendente.", r.append(o, i);
  const s = Mf(t, e.resistance);
  s && r.append(s);
  const l = Ff(t, e.resistance), c = Bf(t, e);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${t.name}`), n;
}
function Mf(t, e) {
  if (!t.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${a}__target-resistance-outcome`), e?.difficulty === null || e?.difficulty === void 0)
    return n.textContent = `${t.resistanceResult.skillLabel}: ${t.resistanceResult.total}`, n;
  const r = t.state === Y ? "sucesso" : "falha";
  return n.textContent = `${t.resistanceResult.skillLabel}: ${t.resistanceResult.total} vs DT ${e.difficulty} — ${r}`, n;
}
function Ff(t, e) {
  const n = document.createElement("div");
  n.classList.add(`${a}__target-resistance-roll`);
  const r = t.resistanceResult?.formula ?? e?.formula ?? "—", o = t.resistanceResult?.total ?? null, i = wi(
    r,
    o,
    t.resistanceResult?.diceBreakdown ?? null,
    t.resistanceResult !== null
  );
  return n.append(i), n;
}
function Bf(t, e) {
  const n = document.createElement("div");
  return n.classList.add(`${a}__target-details-actions`), n.append(
    Si(t, e, "full"),
    Pi(t, e, "full")
  ), n;
}
function Uf(t, e, n) {
  const r = n.parentElement === t ? n : we(t, "Conjuração");
  if (!r) {
    t.prepend(e);
    return;
  }
  e.parentElement === t && e.previousElementSibling === r || t.insertBefore(e, r.nextElementSibling);
}
function qf(t) {
  const e = Ni(t);
  if (e) return e;
  const n = document.createElement("section");
  return n.classList.add(
    `${a}__workflow-section`,
    `${a}__workflow-section--effect-info`
  ), n.setAttribute(bi, "true"), n;
}
function Ni(t) {
  return t.querySelector(`[${bi}="true"]`);
}
function zf(t, e) {
  t.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${a}__workflow-section-header`);
  const r = document.createElement("strong");
  r.textContent = "Efeito", n.append(r);
  const o = document.createElement("div");
  o.classList.add(`${a}__effect-info-body`);
  const i = document.createElement("span");
  i.classList.add(`${a}__effect-info-label`), i.textContent = e.label;
  const s = document.createElement("span");
  s.classList.add(`${a}__effect-info-hint`), s.textContent = "Aplicação por alvo", o.append(i, s), t.append(n, o);
}
function jf(t, e, n) {
  e.parentElement === t && e.previousElementSibling === n || t.insertBefore(e, n.nextElementSibling);
}
function dr(t) {
  const e = qe(t);
  if (!e) return null;
  const n = Gf().filter((i) => qe(Vf(i)) === e).map((i) => xi(i)).find(vt) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((i) => vt(i) && qe(i.name) === e);
  return vt(o) ? o : null;
}
function Gf() {
  const e = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Vf(t) {
  if (!t || typeof t != "object") return null;
  const e = t.name;
  if (typeof e == "string") return e;
  const n = t.document?.name;
  return typeof n == "string" ? n : xi(t)?.name ?? null;
}
function xi(t) {
  if (!t || typeof t != "object") return null;
  const e = t.actor;
  if (vt(e)) return e;
  const n = t.document?.actor;
  return vt(n) ? n : null;
}
function vt(t) {
  return !!(t && typeof t == "object" && "system" in t);
}
function qe(t) {
  const e = t?.trim().toLocaleLowerCase();
  return e && e.length > 0 ? e : null;
}
async function Hf(t) {
  const e = game.dice3d;
  typeof e?.showForRoll == "function" && await Promise.resolve(e.showForRoll(t, game.user, !0));
}
function Wf(t, e) {
  return `${e}-${Oi(t).replace(/[^a-z0-9]+/gu, "-")}`;
}
function Oi(t) {
  return t?.trim().toLocaleLowerCase() ?? "";
}
function Kf(t) {
  return typeof t == "string" && t.length > 0;
}
function Yf(t) {
  return t === "normal" || t === "half";
}
function fo(t) {
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
function oe(t) {
  if (!t) return null;
  const e = Number(t);
  return Number.isFinite(e) ? Math.trunc(e) : null;
}
const mt = "data-paranormal-toolkit-prompt-id", Qf = "data-paranormal-toolkit-card-layout-normalized", po = "data-paranormal-toolkit-card-layout-refresh-bound", Zf = "apply-damage", Xf = "data-paranormal-toolkit-multi-target-damage-info", Mi = [0, 80, 180, 400, 900, 1600, 3e3], go = /* @__PURE__ */ new WeakSet();
function Jf(t) {
  Fi(t), tp(t);
}
function Fi(t) {
  for (const e of Array.from(t.querySelectorAll(`.${a}__roll-card`)))
    Ui(Bi(e));
}
function tp(t) {
  if (!go.has(t)) {
    go.add(t);
    for (const e of Mi)
      globalThis.setTimeout(() => {
        Fi(t);
      }, e);
  }
}
function Bi(t) {
  return {
    rollCard: t,
    damageSection: ep(t),
    resistance: t.querySelector(Zn),
    damageActions: np(t),
    effectActionSource: rp(t),
    effectSection: Eu(t)
  };
}
function Ui(t) {
  const {
    rollCard: e,
    damageSection: n,
    resistance: r,
    damageActions: o,
    effectActionSource: i,
    effectSection: s
  } = t;
  e.setAttribute(Qf, "true"), e.classList.add(`${a}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), Ru(e, o));
  const l = Iu({
    rollCard: e,
    existingSection: s,
    sourceActions: i,
    after: n,
    fallbackAfter: we(e, "Conjuração")
  });
  l && Cu(e, l), Wm({
    rollCard: e,
    damageSection: n,
    effectSection: l ?? s
  }), up(e);
}
function ep(t) {
  return Array.from(t.querySelectorAll(`.${a}__workflow-section`)).find((e) => e.getAttribute(Xf) === "true" ? !1 : e.querySelector(`.${a}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function np(t) {
  const e = op(t);
  return e.find((n) => n.getAttribute(_u) === Zf) ?? e.find((n) => Ha(n) === "aplicar danos") ?? null;
}
function rp(t) {
  const e = qi(t), n = ho(e);
  return n || ho(ap(t));
}
function ho(t) {
  return t.find((e) => {
    const n = Ha(e);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function op(t) {
  const e = qi(t);
  return e.length > 0 ? e : mr(t);
}
function qi(t) {
  const e = lp(t);
  return e ? mr(t).filter((n) => sp(n, e)) : [];
}
function ap(t) {
  const e = zi(t);
  if (!e) return [];
  const n = ip(t, e);
  return mr(t).filter((r) => !r.closest(`.${a}__roll-card`)).filter((r) => ji(t, r)).filter((r) => !n || cp(r, n));
}
function mr(t) {
  const e = zi(t);
  return e ? Array.from(e.querySelectorAll(hu)) : [];
}
function zi(t) {
  return t.closest(`.${a}`) ?? t.parentElement;
}
function ip(t, e) {
  return Array.from(e.querySelectorAll(`.${a}__roll-card`)).find((n) => n !== t && ji(t, n)) ?? null;
}
function sp(t, e) {
  return t.getAttribute(mt) === e ? !0 : Array.from(t.querySelectorAll(`[${mt}]`)).some((n) => n.getAttribute(mt) === e);
}
function lp(t) {
  return t.getAttribute(mt) ?? t.querySelector(`[${mt}]`)?.getAttribute(mt) ?? null;
}
function ji(t, e) {
  return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function cp(t, e) {
  return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function up(t) {
  const e = t.querySelector(Te);
  e && e.getAttribute(po) !== "true" && (e.setAttribute(po, "true"), e.addEventListener("click", () => {
    for (const n of Mi)
      globalThis.setTimeout(() => {
        Ui(Bi(t));
      }, n);
  }));
}
const dp = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function mp(t) {
  for (const e of Array.from(t.querySelectorAll(Zn)))
    fp(e);
  Jf(t);
}
function fp(t) {
  const e = t.querySelector(Oc), n = t.querySelector(Ma), r = t.querySelector(Te), o = t.querySelector(Fa);
  if (!r || !e && !n && !o) return;
  const i = pp(t, r);
  e && e.parentElement !== i && i.append(e), n && n.parentElement !== i && i.append(n), o && (o.parentElement !== t && !r.contains(o) && t.append(o), gp(o)), r.parentElement !== t && t.append(r);
}
function pp(t, e) {
  const n = t.querySelector(`.${Wr}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Wr), t.insertBefore(r, e.parentElement === t ? e : t.firstChild), r;
}
function gp(t) {
  const e = hp(t.textContent ?? "");
  e && (t.setAttribute(dp, "true"), t.replaceChildren(yp(e)));
}
function hp(t) {
  const e = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(t);
  if (!e) return null;
  const [, n, r, o] = e, i = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = _p(r ?? "");
  return l ? {
    skillLabel: i,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function _p(t) {
  const e = t.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(e);
  return n ? {
    formula: n[1]?.trim() ?? e,
    diceValues: bp(n[2] ?? "")
  } : { formula: e, diceValues: [] };
}
function bp(t) {
  return t.split(",").map((e) => Number(e.trim())).filter((e) => Number.isFinite(e)).map((e) => Math.trunc(e));
}
function yp(t) {
  const e = document.createElement("div");
  e.classList.add(
    `${a}__workflow-roll`,
    `${a}__resistance-workflow-roll`
  ), e.setAttribute("data-paranormal-toolkit-resistance-total", String(t.total));
  const n = document.createElement("span");
  n.classList.add(`${a}__workflow-roll-formula`), n.textContent = t.formula, n.title = `${t.skillLabel}: ${t.formula}`, e.append(n);
  const r = Ap(t);
  return r && e.append(r), e;
}
function Ap(t) {
  if (t.diceValues.length === 0) return null;
  const e = document.createElement("div");
  e.classList.add(`${a}__workflow-dice-tray`);
  for (const n of Tp(t.diceValues, t.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${a}__workflow-die`), n.active || r.classList.add(`${a}__workflow-die--inactive`), r.textContent = String(n.value), e.append(r);
  }
  return e;
}
function Tp(t, e) {
  if (t.length <= 1) return t.map((r) => ({ value: r, active: !0 }));
  const n = e.toLowerCase();
  return n.includes("kh") ? _o(t, "highest") : n.includes("kl") ? _o(t, "lowest") : t.map((r) => ({ value: r, active: !0 }));
}
function _o(t, e) {
  const n = e === "highest" ? Math.max(...t) : Math.min(...t);
  let r = !1;
  return t.map((o) => {
    const i = !r && o === n;
    return i && (r = !0), { value: o, active: i };
  });
}
function bo(t) {
  if (t instanceof Document || t instanceof HTMLElement || t instanceof DocumentFragment)
    return t;
  if (!t || typeof t != "object") return null;
  const e = t;
  return e[0] instanceof HTMLElement ? e[0] : null;
}
function fr() {
  const t = globalThis.game;
  return Ie(t) ? t : null;
}
function v(t, e) {
  const n = $p(t, e);
  return ae(n);
}
function $p(t, e) {
  return e.split(".").reduce((n, r) => Ie(n) ? n[r] : null, t);
}
function Rp(t, e) {
  const n = t.indexOf(":");
  return n < 0 || Mt(t.slice(0, n)) !== Mt(e) ? null : At(t.slice(n + 1));
}
function ae(t) {
  return typeof t == "string" ? At(t) : typeof t == "number" && Number.isFinite(t) ? String(t) : null;
}
function Ie(t) {
  return !!t && typeof t == "object";
}
function wp(t) {
  return typeof t == "string";
}
function Ce(t) {
  return typeof t == "string" && t.trim().length > 0;
}
function At(t) {
  if (!t) return null;
  const e = t.replace(/\s+/gu, " ").trim();
  return e.length > 0 ? e : null;
}
function Mt(t) {
  return (t ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Cn(t) {
  return t.length === 0 ? t : t[0].toLocaleLowerCase("pt-BR") + t.slice(1);
}
function K(t) {
  return t.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (e) => e[0].toLocaleUpperCase("pt-BR") + e.slice(1).toLocaleLowerCase("pt-BR"));
}
function Gi(t) {
  return t.replace(/[.。]+$/u, "").trim();
}
function kp(t) {
  for (const e of Array.from(t.querySelectorAll(vc))) {
    const n = Pp(e);
    Ep(e), n && (Ip(e, n), Cp(e, n));
  }
}
function Ep(t) {
  for (const e of Array.from(t.querySelectorAll(Nc)))
    e.remove();
}
function Ip(t, e) {
  const r = t.closest(`.${a}`)?.querySelector(Oa) ?? null, o = r?.querySelector(Pc) ?? null, i = r ?? t, s = i.querySelector(Bc);
  if (!e.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = Yp(e.elementTone), l.textContent = Kp(e), !s) {
    if (o?.parentElement === i) {
      o.insertAdjacentElement("afterend", l);
      return;
    }
    i.prepend(l);
  }
}
function Cp(t, e) {
  const n = Sp(t);
  Lp(t, n);
  const r = Dp(e);
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
  const i = t.querySelector(Ba);
  if (i) {
    t.insertBefore(o, i);
    return;
  }
  t.prepend(o);
}
function Sp(t) {
  return t.closest(`.${a}`)?.querySelector(Oa) ?? null;
}
function Lp(t, e) {
  const n = [t, e].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(Uc)))
      o.remove();
}
function Dp(t) {
  return [
    t.cost,
    t.target ? `Alvo: ${Cn(t.target)}` : null,
    t.duration ? `Duração: ${Cn(t.duration)}` : null,
    t.resistance ? `Resistência: ${Gi(t.resistance)}` : null
  ].filter(Ce);
}
function Pp(t) {
  const e = vp(t), n = Bp(t), o = (e ? Fp(e) : null)?.system ?? null, i = e?.summaryLines ?? [], s = pr(v(o, "element")), l = U("op.elementChoices", s) ?? yo(nt(i, "Elemento")) ?? yo(n.damageType), c = s ?? Qp(l), d = v(o, "circle") ?? nt(i, "Círculo"), f = zp(o) ?? nt(i, "Alvo"), y = Hp(o, "duration", "op.durationChoices") ?? nt(i, "Duração"), T = Up(t) ?? Gp(o) ?? nt(i, "Resistência"), $ = qp(i) ?? n.cost, g = {
    elementLabel: l,
    elementTone: c,
    circle: d,
    cost: $,
    target: f,
    duration: y,
    resistance: T
  };
  return Wp(g) ? g : null;
}
function vp(t) {
  const e = Np(t);
  if (!e) return null;
  const n = e.getFlag?.(u, Ae), r = Op(n);
  if (r.length === 0) return null;
  const o = xp(t);
  if (o.size > 0) {
    const i = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (i) return i;
  }
  return r.find((i) => i.itemId || i.summaryLines.length > 0) ?? null;
}
function Np(t) {
  const n = t.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? fr()?.messages?.get?.(n) ?? null : null;
}
function xp(t) {
  const e = t.closest(`.${a}`) ?? t, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(e.querySelectorAll(`[${Hr}]`))) {
    const o = r.getAttribute(Hr)?.trim();
    o && n.add(o);
  }
  return n;
}
function Op(t) {
  if (!Ie(t)) return [];
  const e = t.prompts;
  return Array.isArray(e) ? e.map(Mp).filter((n) => n !== null) : [];
}
function Mp(t) {
  return Ie(t) ? {
    pendingId: ae(t.pendingId),
    actorId: ae(t.actorId),
    itemId: ae(t.itemId),
    summaryLines: Array.isArray(t.summaryLines) ? t.summaryLines.filter(wp) : []
  } : null;
}
function Fp(t) {
  if (!t.itemId) return null;
  const e = fr(), r = (t.actorId ? e?.actors?.get?.(t.actorId) : null)?.items?.get?.(t.itemId);
  return r || (e?.items?.get?.(t.itemId) ?? null);
}
function Bp(t) {
  let e = null, n = null;
  for (const r of Array.from(t.querySelectorAll(xc))) {
    const o = At(r.textContent);
    if (!o) continue;
    const i = Rp(o, "Tipo");
    i && (n = i), !e && /\b(P[ED]|PE|PD)\b/iu.test(o) && (e = o);
  }
  return { cost: e, damageType: n };
}
function Up(t) {
  const e = At(t.querySelector(Ma)?.textContent);
  return e ? Gi(e) : null;
}
function nt(t, e) {
  const n = Mt(e);
  for (const r of t) {
    const o = r.indexOf(":");
    if (!(o < 0 || Mt(r.slice(0, o)) !== n))
      return At(r.slice(o + 1));
  }
  return null;
}
function qp(t) {
  const e = nt(t, "Custo") ?? nt(t, "PE");
  return e || (t.map(At).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function zp(t) {
  const e = v(t, "target");
  if (!e) return null;
  if (e === "area")
    return jp(t) ?? U("op.targetChoices", e) ?? "Área";
  const n = U("op.targetChoices", e) ?? K(e);
  return [e === "people" || e === "creatures" ? v(t, "targetQtd") : null, n].filter(Ce).join(" ");
}
function jp(t) {
  const e = v(t, "area.name"), n = v(t, "area.size"), r = v(t, "area.type"), o = e ? U("op.areaChoices", e) ?? K(e) : null, i = r ? U("op.areaTypeChoices", r) ?? K(r) : null;
  return o ? n ? i ? `${o} ${n}m ${Cn(i)}` : `${o} ${n}m` : o : null;
}
function Gp(t) {
  const e = v(t, "skillResis"), n = v(t, "resistance");
  if (!e || !n) return null;
  const r = U("op.skill", e) ?? K(e), o = Vp(n);
  return [r, o].filter(Ce).join(" ");
}
function Vp(t) {
  switch (t) {
    case "reducesByHalf":
      return "reduz à metade";
    case "nullifies":
      return "anula";
    case "discredits":
      return "desacredita";
    case "partial":
      return "parcial";
    default:
      return U("op.resistanceChoices", t) ?? K(t);
  }
}
function Hp(t, e, n) {
  const r = v(t, e);
  return r ? U(n, r) ?? K(r) : null;
}
function Wp(t) {
  return !!(t.elementLabel || t.cost || t.target || t.duration || t.resistance);
}
function Kp(t) {
  const e = t.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return t.circle ? `${e} ${t.circle}` : e;
}
function Yp(t) {
  return [
    `${a}__ritual-element-badge`,
    t ? `${a}__ritual-element-badge--${t}` : null
  ].filter(Ce).join(" ");
}
function pr(t) {
  const e = Mt(t);
  return e === "sangue" || e === "blood" || e === "blooddamage" ? "blood" : e === "morte" || e === "death" || e === "deathdamage" ? "death" : e === "conhecimento" || e === "knowledge" || e === "knowledgedamage" ? "knowledge" : e === "energia" || e === "energy" || e === "energydamage" ? "energy" : e === "medo" || e === "fear" || e === "feardamage" ? "fear" : null;
}
function yo(t) {
  const e = pr(t);
  return e ? U("op.elementChoices", e) ?? K(e) : t ? K(t) : null;
}
function Qp(t) {
  return pr(t);
}
function U(t, e) {
  if (!e) return null;
  const n = `${t}.${e}`, r = fr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Ao = "data-paranormal-toolkit-dice-toggle-enhanced";
function Zp(t) {
  for (const e of Array.from(t.querySelectorAll(Ua)))
    Vi(e);
}
function Xp(t) {
  const e = Wi(t.target);
  if (!e) return;
  const n = gr(e);
  n && (t.preventDefault(), Hi(n, e));
}
function Jp(t) {
  if (t.key !== "Enter" && t.key !== " ") return;
  const e = Wi(t.target);
  if (!e) return;
  const n = gr(e);
  n && (t.preventDefault(), Hi(n, e));
}
function Vi(t) {
  const e = t.querySelector($e);
  if (!e) return;
  const n = t.querySelector(Jn);
  if (n && n.getAttribute(Ao) !== "true" && (n.setAttribute(Ao, "true"), n.classList.add(tr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), e.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Hi(t, e) {
  const n = t.querySelector($e);
  if (!n) return;
  const r = !t.classList.contains(Xn);
  tg(t, e, n, r);
}
function tg(t, e, n, r) {
  t.classList.toggle(Xn, r), n.hidden = !r, e.setAttribute("aria-expanded", r ? "true" : "false"), e.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", e.setAttribute("aria-label", e.title);
  const o = e.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Wi(t) {
  if (!(t instanceof Element)) return null;
  const e = t.closest(Jn);
  if (!e) return null;
  const n = gr(e);
  return n ? (Vi(n), e.classList.contains(tr) ? e : null) : null;
}
function gr(t) {
  const e = t.closest(Ua);
  return e && e.querySelector($e) ? e : null;
}
const To = `${u}-workflow-dice-toggle-styles`;
function eg() {
  if (document.getElementById(To)) return;
  const t = document.createElement("style");
  t.id = To, t.textContent = `
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

`, document.head.append(t);
}
const ng = [0, 100, 500, 1500, 3e3];
let $o = !1, ze = null;
function rg() {
  if (!$o) {
    $o = !0, eg(), Hooks.on("renderChatMessageHTML", (t, e) => {
      Dt(bo(e));
    }), Hooks.on("renderChatMessage", (t, e) => {
      Dt(bo(e));
    }), Hooks.once("ready", () => {
      Dt(document), og();
    }), document.addEventListener("click", Xp), document.addEventListener("keydown", Jp);
    for (const t of ng)
      globalThis.setTimeout(() => Dt(document), t);
  }
}
function og() {
  ze || !document.body || (ze = new MutationObserver((t) => {
    for (const e of t)
      for (const n of Array.from(e.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Dt(n);
  }), ze.observe(document.body, { childList: !0, subtree: !0 }));
}
function Dt(t) {
  t && (ou(t), kp(t), mp(t), Zp(t), Qc(t));
}
function ag() {
  rg();
}
const ig = "data-paranormal-toolkit-action-section", sg = "ritual-log", lg = ".paranormal-toolkit-item-use-prompt__actions", cg = ".paranormal-toolkit-item-use-prompt__actions-title", ug = [0, 100, 500, 1500];
let Ro = !1;
function dg() {
  if (Ro) return;
  const t = (e, n) => {
    wo(gg(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), wo(document), Ro = !0;
}
function wo(t) {
  for (const e of ug)
    globalThis.setTimeout(() => mg(t), e);
}
function mg(t) {
  fg(t), pg(t);
}
function fg(t) {
  for (const e of t.querySelectorAll(
    `[${ig}="${sg}"]`
  ))
    e.remove();
}
function pg(t) {
  for (const e of t.querySelectorAll(lg)) {
    if (ko(e.querySelector(cg)?.textContent ?? "") !== "registro") continue;
    Array.from(
      e.querySelectorAll("button"),
      (i) => ko(i.textContent ?? "")
    ).some((i) => i.includes("ritual conjurado")) && e.remove();
  }
}
function gg(t) {
  if (t instanceof HTMLElement || hg(t))
    return t;
  if (_g(t)) {
    const e = t[0];
    return e instanceof HTMLElement ? e : null;
  }
  return null;
}
function hg(t) {
  return t instanceof HTMLElement;
}
function _g(t) {
  return typeof t == "object" && t !== null && 0 in t;
}
function ko(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Pt = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Ki = {
  PV: "system.attributes.hp"
}, Sn = {
  PV: [Pt.PV, Ki.PV],
  SAN: [Pt.SAN],
  PE: [Pt.PE],
  PD: [Pt.PD]
}, Ln = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class bg {
  getResource(e, n) {
    const r = Eo(e, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, i = `${o}.value`, s = `${o}.max`, l = foundry.utils.getProperty(e, i), c = foundry.utils.getProperty(e, s), d = Co(e, n, i, l, "valor atual");
    if (d) return p(d);
    const f = Co(e, n, s, c, "valor máximo");
    return f ? p(f) : _({
      value: l,
      max: c
    });
  }
  async updateResourceValue(e, n, r) {
    const o = Eo(e, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await e.update({ [`${o.value}.value`]: r });
  }
}
function Eo(t, e) {
  const n = yg(t.type, e);
  if (n && Io(t, n))
    return _(n);
  const r = Sn[e].find(
    (o) => Io(t, o)
  );
  return r ? _(r) : p({
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "resource-path-not-found",
    message: Ag(t, e),
    path: Sn[e].join(" | ")
  });
}
function yg(t, e) {
  return t === "threat" ? Ki[e] ?? null : t === "agent" ? Pt[e] : null;
}
function Io(t, e) {
  const n = foundry.utils.getProperty(t, `${e}.value`), r = foundry.utils.getProperty(t, `${e}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Ag(t, e) {
  const n = t.type ?? "unknown", r = Sn[e].join(", ");
  return `${e} não encontrado no ator ${t.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Co(t, e, n, r, o) {
  return r == null ? {
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "resource-path-not-found",
    message: `Path de ${o} de ${e} não encontrado: ${n}.`,
    path: n,
    value: r
  } : typeof r != "number" || !Number.isFinite(r) ? {
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${o} de ${e} em ${n}.`,
    path: n,
    value: r
  } : null;
}
class Tg {
  isRitual(e) {
    return e.type === "ritual";
  }
  getCircle(e) {
    if (!this.isRitual(e))
      return p({
        reason: "not-a-ritual",
        message: `Item ${e.name ?? "sem nome"} não é um ritual.`,
        ritual: e
      });
    const n = this.readCircleFromKnownPaths(e);
    if (!n) {
      const s = Ln.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: e,
        paths: [...s]
      });
    }
    const { path: r, value: o } = n, i = $g(o);
    return i ? _(i) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: e,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(e) {
    for (const n of Ln.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(e, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function $g(t) {
  if (So(t))
    return t;
  if (typeof t == "string") {
    const e = t.trim();
    if (!/^\d+$/.test(e))
      return null;
    const n = Number(e);
    if (So(n))
      return n;
  }
  return null;
}
function So(t) {
  return t === 1 || t === 2 || t === 3 || t === 4;
}
const Rg = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class wg {
  constructor(e) {
    this.ritualAdapter = e;
  }
  ritualAdapter;
  getCost(e) {
    const n = this.ritualAdapter.getCircle(e.ritual);
    if (!n.ok)
      return p({
        ...n.error,
        actor: e.actor
      });
    const r = n.value, o = kg(e.ritual, r);
    return o.ok ? o.value ? _(o.value) : _({
      resource: "PE",
      amount: Rg[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function kg(t, e) {
  const n = t.getFlag(u, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Eg(n) ? {
    ok: !0,
    value: {
      resource: n.resource,
      amount: n.amount,
      source: "custom-flag",
      circle: e
    }
  } : {
    ok: !1,
    error: {
      reason: "invalid-custom-cost",
      message: `Custo customizado do ritual ${t.name ?? "sem nome"} é inválido.`,
      ritual: t,
      value: n
    }
  };
}
function Eg(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return (e.resource === "PE" || e.resource === "PD") && typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0;
}
const je = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ig(t) {
  if (!vg(t.item)) return null;
  const e = Dn(t.actor) ? t.actor : Cg(t.item);
  return {
    source: "ordem-item-used-hook",
    actor: e,
    item: t.item,
    token: Lg(t.token) ?? Sg(e),
    targets: Yn(),
    message: t.message,
    chatMessageData: t.chatMessageData
  };
}
function Cg(t) {
  const e = t;
  return Dn(e.actor) ? e.actor : Dn(t.parent) ? t.parent : null;
}
function Sg(t) {
  const e = Dg(t) ?? Pg(t);
  return e ? Yi(e) : null;
}
function Lg(t) {
  return Pn(t) ? Yi(t) : null;
}
function Dg(t) {
  if (!t) return null;
  const e = t, n = e.token;
  return Pn(n) ? n : (e.getActiveTokens?.() ?? []).find(Pn) ?? null;
}
function Pg(t) {
  return t ? canvas?.tokens?.controlled?.find((e) => e.actor?.id === t.id) ?? null : null;
}
function Yi(t) {
  const e = t.actor ?? null;
  return {
    tokenId: Ge(t.id),
    actorId: Ge(e?.id),
    sceneId: Ge(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function vg(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function Dn(t) {
  return !!(t && typeof t == "object" && "update" in t && "items" in t);
}
function Pn(t) {
  return !!(t && typeof t == "object" && ("actor" in t || "id" in t || "name" in t));
}
function Ge(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
class Ng {
  constructor(e) {
    this.onItemUsed = e;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(je.ITEM_USED, (e) => {
      this.handleHook(e);
    }), this.registered = !0, m.info(`${je.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(e) {
    const n = Ig(xg(e));
    if (!n) {
      m.warn(`${je.ITEM_USED} disparou sem payload de item válido.`, e);
      return;
    }
    await this.onItemUsed(n);
  }
}
function xg(t) {
  return t && typeof t == "object" ? t : {};
}
class Og {
  async applyPresetItemPatch(e, n) {
    const r = n.itemPatch;
    if (!r) return Ve("missing-item-patch");
    if (e.type !== "ritual") return Ve("unsupported-item-type");
    const o = Mg(r);
    return Object.keys(o).length === 0 ? Ve("empty-update") : (await e.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Mg(t) {
  const e = {};
  k(e, "name", t.name), k(e, "system.description", t.descriptionHtml);
  const n = t.ritual;
  return n && (k(e, "system.circle", n.circle), k(e, "system.element", n.element), k(e, "system.target", n.target), k(e, "system.targetQtd", n.targetQuantity), k(e, "system.execution", n.execution), k(e, "system.range", n.range), k(e, "system.duration", n.duration), k(e, "system.skillResis", n.resistanceSkill), k(e, "system.resistance", n.resistance), k(e, "system.studentForm", n.studentForm), k(e, "system.trueForm", n.trueForm)), e;
}
function k(t, e, n) {
  n !== void 0 && (t[e] = n);
}
function Ve(t) {
  return {
    applied: !1,
    reason: t,
    updateData: {}
  };
}
class Fg {
  constructor(e) {
    this.resourceAdapter = e;
  }
  resourceAdapter;
  getActorSnapshot(e) {
    const n = this.getResources(e);
    return {
      id: e.id ?? null,
      name: e.name ?? "Ator sem nome",
      type: e.type ?? "unknown",
      resources: n.values,
      resourceErrors: n.errors,
      ritualDT: this.getRitualDT(e)
    };
  }
  getRitualDT(e) {
    return this.getNumber(e, Ln.ritual.dt, 0);
  }
  getResources(e) {
    const n = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, r = [];
    for (const o of ["PV", "SAN", "PE", "PD"]) {
      const i = this.resourceAdapter.getResource(e, o);
      i.ok ? n[o] = i.value : r.push(i.error);
    }
    return { values: n, errors: r };
  }
  getNumber(e, n, r) {
    const o = foundry.utils.getProperty(e, n);
    return typeof o == "number" && Number.isFinite(o) ? o : r;
  }
}
class Bg {
  async applyPreset(e, n, r = {}) {
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
    return await this.writeAutomationFlag(e, o), o;
  }
  async applyManualDefinition(e, n, r = n.label) {
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
    return await this.writeAutomationFlag(e, o), o;
  }
  async clear(e) {
    await e.unsetFlag(u, "automation");
  }
  async writeAutomationFlag(e, n) {
    await this.clear(e), await e.setFlag(u, "automation", n);
  }
}
class Ug {
  presets = /* @__PURE__ */ new Map();
  register(e) {
    const n = qg(e);
    return n.ok ? this.presets.has(e.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${e.id}.`,
      presetId: e.id
    }) : (this.presets.set(e.id, He(e)), _(e)) : n;
  }
  registerMany(e) {
    const n = [];
    for (const r of e) {
      const o = this.register(r);
      if (!o.ok)
        return o;
      n.push(o.value);
    }
    return _(n);
  }
  get(e) {
    const n = this.presets.get(e);
    return n ? He(n) : null;
  }
  require(e) {
    const n = this.get(e);
    return n ? _(n) : p({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${e}.`,
      presetId: e
    });
  }
  list() {
    return Array.from(this.presets.values()).map(He);
  }
  findForItem(e) {
    return this.list().map((n) => zg(n, e)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function qg(t) {
  return !We(t.id) || !We(t.version) || !We(t.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: t.id
  }) : !t.automation || t.automation.version !== 1 || !Array.isArray(t.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${t.id} possui definição de automação inválida.`,
    presetId: t.id
  }) : _(t);
}
function zg(t, e) {
  if (t.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (t.itemTypes.length > 0) {
    if (!t.itemTypes.includes(e.type)) return null;
    r += 10, n.push(`itemType:${e.type}`);
  }
  for (const o of t.matchers) {
    const i = jg(o, e);
    if (!i.matches)
      return null;
    r += i.score, n.push(i.reason);
  }
  return {
    preset: t,
    score: r,
    reasons: n
  };
}
function jg(t, e) {
  switch (t.type) {
    case "itemType": {
      const n = t.itemTypes.includes(e.type);
      return {
        matches: n,
        score: n ? 10 : 0,
        reason: `itemType:${e.type}`
      };
    }
    case "normalizedName": {
      const n = Lo(e.name), r = t.names.map(Lo).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Gg(e), r = n !== null && t.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Lo(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Gg(t) {
  const e = foundry.utils.getProperty(t, "system.circle"), n = typeof e == "string" ? Number(e) : e;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function He(t) {
  return structuredClone(t);
}
function We(t) {
  return typeof t == "string" && t.length > 0;
}
function ue(t, e) {
  if (typeof t.amount == "number")
    return !Number.isInteger(t.amount) || t.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : _(t.amount);
  if (typeof t.amountFrom == "string") {
    const n = Se(t.amountFrom);
    if (!n)
      return p({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${t.amountFrom}. Use o formato rollId.total.`
      });
    const r = e.rolls[n];
    if (!r)
      return p({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${n}.`
      });
    const o = Math.trunc(r.total);
    return !Number.isInteger(o) || o <= 0 ? p({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : _(o);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Se(t) {
  return t ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(t)?.groups?.rollId ?? null : null;
}
const Vg = "dice-so-nice";
async function Qi(t) {
  if (!Hg() || !Wg()) return;
  const e = Kg();
  if (e?.showForRoll)
    try {
      await Promise.resolve(e.showForRoll(t, game.user, !0));
    } catch (n) {
      m.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Hg() {
  try {
    return Dc().enabled;
  } catch {
    return !1;
  }
}
function Wg() {
  return game.modules?.get?.(Vg)?.active === !0;
}
function Kg() {
  const e = game.dice3d;
  return !e || typeof e != "object" ? null : e;
}
async function Yg(t, e, n) {
  if (!Do(t.id) || !Do(t.formula))
    return p({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(t.formula), o = await Promise.resolve(r.evaluate()), i = o.total;
    if (typeof i != "number" || !Number.isFinite(i))
      return p({
        reason: "roll-failed",
        message: `A rolagem ${t.id} não retornou um total numérico válido.`
      });
    await Qi(o);
    const l = {
      ...n.rollRequests[t.id] ?? Zi(t, e),
      total: i,
      roll: o
    };
    return n.rolls[t.id] = l, _(l);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${t.formula}.`,
      cause: r
    });
  }
}
function Zi(t, e) {
  const n = t.intent ?? Qg(t.id);
  return {
    id: t.id,
    formula: t.formula,
    intent: n,
    damageType: t.damageType ?? void 0,
    sourceStepIndex: e
  };
}
function Qg(t) {
  const e = t.toLowerCase();
  return e.includes("damage") || e.includes("dano") ? "damage" : e.includes("healing") || e.includes("heal") || e.includes("cura") ? "healing" : e.includes("attack") || e.includes("ataque") ? "attack" : e.includes("resistance") || e.includes("resistencia") || e.includes("resistência") ? "resistance" : "generic";
}
function Do(t) {
  return typeof t == "string" && t.length > 0;
}
async function de(t, e, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Jt(e, n, r, o) : t.spend(e, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Jt(e, n, r, o) : t.damage(e, n, o);
    case "heal":
      return n !== "PV" ? Jt(e, n, r, o) : t.heal(e, n, o);
    case "recover":
      return n !== "SAN" ? Jt(e, n, r, o) : t.recover(e, n, o);
  }
}
function Jt(t, e, n, r) {
  return p({
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    resource: e,
    operation: n,
    reason: "invalid-resource-operation",
    message: `Operação ${n} não é válida para ${e}.`,
    requestedAmount: r
  });
}
function Zg(t) {
  const { step: e, context: n, transaction: r, stepIndex: o, lifecycle: i } = t;
  if (e.operation === "damage") {
    const s = Xg(e, n, r, o);
    n.damageInstances.push(s), i.emit("afterDamageResolution", n, {
      stepIndex: o,
      step: e,
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
      step: e,
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
  if (e.operation === "heal") {
    const s = Jg(e, n, r, o);
    n.healingInstances.push(s), i.emit("afterApplyHealing", n, {
      stepIndex: o,
      step: e,
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
function Xg(t, e, n, r) {
  const o = Se(t.amountFrom), i = o ? e.rolls[o] : void 0;
  return {
    id: Xi(e.id, "damage", r, e.damageInstances.length),
    source: e.item.type === "ritual" ? "ritual" : "automation",
    sourceId: e.item.id ?? null,
    sourceName: e.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    damageType: i?.damageType,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", t.resource]
  };
}
function Jg(t, e, n, r) {
  const o = Se(t.amountFrom);
  return {
    id: Xi(e.id, "healing", r, e.healingInstances.length),
    source: e.item.type === "ritual" ? "ritual" : "automation",
    sourceId: e.item.id ?? null,
    sourceName: e.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", t.resource]
  };
}
function Xi(t, e, n, r) {
  return `${t}.${e}.${n}.${r}`;
}
function th(t, e, n) {
  const r = Se(t.amountFrom), o = r ? e.rolls[r] : void 0;
  return {
    actorSelector: t.actor,
    resource: t.resource,
    operation: t.operation,
    amount: n,
    amountFrom: t.amountFrom,
    rollId: r,
    rollIntent: o?.intent,
    damageType: o?.damageType
  };
}
function eh(t) {
  const { step: e, context: n, stepIndex: r, metadata: o, lifecycle: i } = t;
  i.emit("beforeApply", n, { stepIndex: r, step: e, metadata: o }), Ji("before", t), Po("before", t), Po("resolve", t);
}
function nh(t) {
  const { step: e, context: n, stepIndex: r, metadata: o, lifecycle: i } = t;
  i.emit("apply", n, { stepIndex: r, step: e, metadata: o }), Ji("apply", t);
}
function rh(t) {
  const { step: e, context: n, stepIndex: r, metadata: o, lifecycle: i } = t;
  i.emit("afterApply", n, { stepIndex: r, step: e, metadata: o });
}
function Ji(t, e) {
  const { step: n, context: r, stepIndex: o, metadata: i, lifecycle: s } = e, l = oh(t, n.operation);
  l && s.emit(l, r, {
    stepIndex: o,
    step: n,
    metadata: i
  });
}
function Po(t, e) {
  const { step: n, context: r, stepIndex: o, metadata: i, lifecycle: s } = e;
  n.operation === "damage" && s.emit(t === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: i
  });
}
function oh(t, e) {
  return e === "damage" ? t === "before" ? "beforeApplyDamage" : t === "apply" ? "applyDamage" : "afterApplyDamage" : e === "heal" ? t === "before" ? "beforeApplyHealing" : t === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function ah(t, e, n) {
  try {
    return await t.createWorkflowSummaryMessage(n, e), _(void 0);
  } catch (r) {
    return p({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function ih(t) {
  const { step: e } = t;
  switch (e.type) {
    case "spendResource":
      return sh(t, e);
    case "spendRitualCost":
      return lh(t, e);
  }
}
async function sh(t, e) {
  const { context: n, resources: r } = t, o = ue(e, n);
  return o.ok ? ts(await r.spend(n.sourceActor, e.resource, o.value), n) : p(o.error);
}
async function lh(t, e) {
  const { context: n, resources: r, ritualCosts: o } = t, i = o.getCost({
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
  }), ts(await r.spend(n.sourceActor, s.resource, s.amount), n, e);
}
function ts(t, e, n) {
  return t.ok ? (e.resourceTransactions.push(t.value), _(void 0)) : (n?.type === "spendRitualCost" && e.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: t.error.message,
    cause: t.error
  }));
}
async function ch(t) {
  const { step: e, context: n, stepIndex: r, lifecycle: o, execute: i } = t, s = uh(e);
  for (const c of s.before)
    o.emit(c, n, { stepIndex: r, step: e });
  const l = await i();
  if (!l.ok)
    return l;
  for (const c of s.after)
    o.emit(c, n, { stepIndex: r, step: e });
  return l;
}
function uh(t) {
  switch (t.type) {
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
class dh {
  constructor(e, n, r, o) {
    this.resources = e, this.ritualCosts = n, this.messages = r, this.lifecycle = o;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(e, n) {
    if (e.steps.length === 0)
      return p({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: n
      });
    for (const [r, o] of e.steps.entries()) {
      const i = await this.runStep(o, n, r);
      if (!i.ok)
        return i;
    }
    return _({ definition: e, context: n });
  }
  async runStep(e, n, r) {
    switch (e.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(e, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(e, n, r);
      default:
        return ch({
          step: e,
          context: n,
          stepIndex: r,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(e, n, r)
        });
    }
  }
  async executeStep(e, n, r) {
    switch (e.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(e, n, r);
      case "rollFormula":
        return this.runRollFormulaStep(e, n, r);
      case "modifyResource":
        return this.runModifyResourceStep(e, n, r);
      case "chatCard":
        return this.runChatCardStep(e, n, r);
      default:
        return p({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: r,
          step: e,
          context: n
        });
    }
  }
  async runCostStep(e, n, r) {
    const o = await ih({
      step: e,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? _(void 0) : p({ ...o.error, stepIndex: r, step: e, context: n });
  }
  async runRollFormulaStepWithLifecycle(e, n, r) {
    const o = Zi(e, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: e, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, e), this.lifecycle.emit("roll", n, { stepIndex: r, step: e, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, e);
    const i = await this.runRollFormulaStep(e, n, r);
    if (!i.ok)
      return i;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, e, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: e, rollRequest: o, rollResult: s }), _(void 0);
  }
  async runRollFormulaStep(e, n, r) {
    const o = await Yg(e, r, n);
    return o.ok ? _(void 0) : p({ ...o.error, stepIndex: r, step: e, context: n });
  }
  async runModifyResourceStepWithLifecycle(e, n, r) {
    const o = ue(e, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: e, context: n });
    const i = th(e, n, o.value);
    eh({
      step: e,
      context: n,
      stepIndex: r,
      metadata: i,
      lifecycle: this.lifecycle
    }), nh({
      step: e,
      context: n,
      stepIndex: r,
      metadata: i,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(e.actor, n);
    if (s.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: e,
        context: n
      });
    for (const l of s) {
      const c = await de(this.resources, l, e.resource, e.operation, o.value), d = this.handleResourceOperationResult(c, n, r, e);
      if (!d.ok)
        return d;
      Zg({
        step: e,
        context: n,
        transaction: d.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return rh({
      step: e,
      context: n,
      stepIndex: r,
      metadata: i,
      lifecycle: this.lifecycle
    }), _(void 0);
  }
  async runModifyResourceStep(e, n, r) {
    const o = ue(e, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: e, context: n });
    const i = this.resolveActors(e.actor, n);
    if (i.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: e,
        context: n
      });
    for (const s of i) {
      const l = await de(this.resources, s, e.resource, e.operation, o.value), c = this.handleResourceOperationResult(l, n, r, e);
      if (!c.ok)
        return c;
    }
    return _(void 0);
  }
  async runChatCardStep(e, n, r) {
    const o = await ah(this.messages, e, n);
    return o.ok ? _(void 0) : p({ ...o.error, stepIndex: r, step: e, context: n });
  }
  handleResourceOperationResult(e, n, r, o) {
    return e.ok ? (n.resourceTransactions.push(e.value), _(e.value)) : p({
      reason: "resource-operation-failed",
      message: e.error.message,
      stepIndex: r,
      step: o,
      context: n,
      cause: e.error
    });
  }
  emitSpecificRollPhase(e, n, r, o, i, s) {
    const l = mh(e, n.intent);
    l && this.lifecycle.emit(l, r, {
      stepIndex: o,
      step: i,
      rollRequest: n,
      rollResult: s
    });
  }
  resolveActors(e, n) {
    switch (e) {
      case "self":
        return [n.sourceActor];
      case "target":
        return n.targets.flatMap((r) => r.actor ? [r.actor] : []);
    }
  }
}
function mh(t, e) {
  return e === "damage" ? t === "before" ? "beforeDamageRoll" : t === "roll" ? "damageRoll" : "afterDamageRoll" : e === "healing" ? t === "before" ? "beforeHealingRoll" : t === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class fh {
  constructor(e) {
    this.adapter = e;
  }
  adapter;
  async spend(e, n, r) {
    return this.execute(e, n, "spend", r);
  }
  async damage(e, n, r) {
    return this.execute(e, n, "damage", r);
  }
  async heal(e, n, r) {
    return this.execute(e, n, "heal", r);
  }
  async recover(e, n, r) {
    return this.execute(e, n, "recover", r);
  }
  async execute(e, n, r, o) {
    if (!Number.isInteger(o) || o <= 0)
      return p({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: o
      });
    const i = this.adapter.getResource(e, n);
    if (!i.ok)
      return p({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
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
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: l.error.reason,
        message: l.error.message,
        requestedAmount: o,
        current: s.value,
        required: o
      });
    const { afterValue: c, appliedAmount: d } = l.value, f = {
      value: c,
      max: s.max
    };
    try {
      c !== s.value && await this.adapter.updateResourceValue(e, n, c);
    } catch (y) {
      return p({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
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
    return _({
      actor: e,
      actorId: e.id ?? null,
      actorName: e.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: o,
      appliedAmount: d,
      before: s,
      after: f
    });
  }
  calculate(e, n, r) {
    switch (e) {
      case "spend":
        return n.value < r ? p({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${n.value}; custo: ${r}.`
        }) : _({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const o = Math.max(0, n.value - r);
        return _({
          afterValue: o,
          appliedAmount: n.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(n.max, n.value + r);
        return _({
          afterValue: o,
          appliedAmount: o - n.value
        });
      }
    }
  }
}
function es(t) {
  return {
    id: ph(),
    sourceActor: t.sourceActor,
    sourceToken: t.sourceToken ?? null,
    item: t.item,
    targets: t.targets ?? [],
    phases: [],
    lifecycleEvents: [],
    rollRequests: {},
    rolls: {},
    ritualCosts: [],
    damageInstances: [],
    healingInstances: [],
    resourceTransactions: [],
    flags: t.flags ?? {}
  };
}
function ph() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class gh {
  constructor(e, n) {
    this.automation = e, this.hooks = n;
  }
  automation;
  hooks;
  lastContext = null;
  getLastContext() {
    return this.lastContext;
  }
  getLastDebugSnapshot() {
    return ot(this.lastContext);
  }
  async runAutomation(e, n) {
    const r = es(n);
    this.lastContext = r, this.hooks.emit("created", r, {
      metadata: {
        definitionLabel: e.label,
        itemId: r.item.id ?? null,
        itemName: r.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", r), this.hooks.emit("resolveTargets", r, {
      metadata: {
        targetCount: r.targets.length
      }
    });
    const o = await this.automation.run(e, r);
    return o.ok ? (this.hooks.emit("completed", r), o) : (this.emitFailed(r, o.error), o);
  }
  emitFailed(e, n) {
    this.hooks.emit("failed", e, {
      stepIndex: n.stepIndex,
      step: n.step,
      metadata: {
        reason: n.reason,
        message: n.message
      }
    });
  }
}
class hh {
  emit(e, n, r = {}) {
    const o = {
      phase: e,
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
    return n.phases.push(e), n.lifecycleEvents.push({
      phase: e,
      stepIndex: r.stepIndex,
      stepType: r.step?.type,
      rollId: r.rollRequest?.id ?? r.rollResult?.id,
      rollIntent: r.rollRequest?.intent ?? r.rollResult?.intent,
      damageId: r.damage?.id,
      healingId: r.healing?.id,
      resourceOperation: r.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${u}.workflow.${e}`, o), Hooks.callAll(`${u}.workflow.phase`, o), o;
  }
}
class _h {
  info(e) {
    this.emit("info", e);
  }
  warn(e) {
    this.emit("warn", e);
  }
  error(e) {
    this.emit("error", e);
  }
  async chat(e) {
    const n = on();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: e.speaker,
      content: e.content,
      whisper: bh(),
      flags: {
        ...e.flags,
        [u]: {
          ...yh(e.flags),
          debugOutput: !0
        }
      }
    }), n.console && e.data !== void 0 && m.info("Debug chat criado.", e.data), !0);
  }
  emit(e, n) {
    const r = on();
    if (!r.enabled)
      return;
    const o = n.notification ?? vo(n);
    r.console && this.emitConsole(e, n), r.ui && this.emitUi(e, o);
  }
  emitConsole(e, n) {
    const r = vo(n);
    switch (e) {
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
  emitUi(e, n) {
    switch (e) {
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
function vo(t) {
  return t.message ? `${t.title}: ${t.message}` : t.title;
}
function bh() {
  const t = game.users?.filter((e) => e.isGM === !0 && e.id).map((e) => e.id) ?? [];
  return t.length > 0 ? t : game.user?.id ? [game.user.id] : [];
}
function yh(t) {
  const e = t?.[u];
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const Ah = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", ns = `${u}-inline-roll-neutralized`, Th = `${u}-inline-roll-notice`, hr = `data-${u}-inline-roll-neutralized`, No = `data-${u}-inline-roll-notice`, $h = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function xo(t) {
  const e = Oh(t.message), n = await Rh(t.message), r = wh(e);
  return n.replacementCount + r.replacementCount > 0 && m.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: t.item.id ?? null,
    itemName: t.item.name ?? "Item sem nome",
    messageId: e,
    contentReplacementCount: n.replacementCount,
    renderedReplacementCount: r.replacementCount
  }), {
    messageId: e,
    contentUpdated: n.updated,
    contentReplacementCount: n.replacementCount,
    renderedReplacementCount: r.replacementCount
  };
}
async function Rh(t) {
  const e = vh(t);
  if (!e || typeof e.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = kh(e.content);
  return n.replacementCount === 0 || n.content === e.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Nh(e, n.content), replacementCount: n.replacementCount };
}
function wh(t) {
  const e = t ? xh(t) : null;
  if (!e)
    return { replacementCount: 0 };
  const n = rs(e);
  return n > 0 && os(Lh(e)), { replacementCount: n };
}
function kh(t) {
  const e = Eh(t), n = document.createElement("template");
  n.innerHTML = e.content;
  const r = rs(n.content), o = e.replacementCount + r;
  return o === 0 ? { content: t, replacementCount: 0 } : (os(n.content), { content: n.innerHTML, replacementCount: o });
}
function Eh(t) {
  let e = 0;
  return { content: t.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (e += 1, Ch(o.trim()))), replacementCount: e };
}
function rs(t) {
  const e = Ih(t);
  for (const n of e)
    n.replaceWith(Sh(Dh(n)));
  return e.length;
}
function Ih(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.querySelectorAll(Ah))
    n.getAttribute(hr) !== "true" && e.add(n);
  return Array.from(e);
}
function Ch(t) {
  return `<span class="${ns}" ${hr}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Mh(t)}</span>`;
}
function Sh(t) {
  const e = document.createElement("span");
  return e.classList.add(ns), e.setAttribute(hr, "true"), e.title = "Rolagem inline ignorada pelo Paranormal Toolkit", e.textContent = t, e;
}
function os(t) {
  if (t.querySelector?.(`[${No}="true"]`)) return;
  const e = document.createElement("p");
  e.classList.add(Th), e.setAttribute(No, "true"), e.textContent = $h, t.append(e);
}
function Lh(t) {
  return t.querySelector(".message-content") ?? t;
}
function Dh(t) {
  const n = t.getAttribute("data-formula") ?? Ph(t.getAttribute("data-roll")) ?? t.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Ph(t) {
  if (!t) return null;
  try {
    const e = JSON.parse(t);
    return typeof e.formula == "string" && e.formula.length > 0 ? e.formula : null;
  } catch {
    return null;
  }
}
function vh(t) {
  return t && typeof t == "object" ? t : null;
}
async function Nh(t, e) {
  if (typeof t.update != "function")
    return !1;
  try {
    return await Promise.resolve(t.update({ content: e })), !0;
  } catch (n) {
    return m.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function xh(t) {
  const e = Fh(t);
  return document.querySelector(
    `.chat-message[data-message-id="${e}"], [data-message-id="${e}"]`
  );
}
function Oh(t) {
  if (!t || typeof t != "object") return null;
  const e = t;
  return typeof e.id == "string" && e.id.length > 0 ? e.id : null;
}
function Mh(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Fh(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const me = "ritualRollConfig", ft = "ritual-roll";
function Le() {
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
function as(t) {
  const e = t.getFlag(u, me);
  return vn(e);
}
function is(t) {
  return as(t) ?? Le();
}
async function Bh(t, e) {
  const n = vn(e) ?? vn({
    ...Le(),
    ...e
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await t.setFlag(u, me, n), n;
}
async function Uh(t) {
  const e = t.unsetFlag;
  if (typeof e == "function") {
    await Promise.resolve(e.call(t, u, me));
    return;
  }
  await t.setFlag(u, me, null);
}
function vn(t) {
  if (!De(t)) return null;
  const e = Yh(t.intent);
  if (!e) return null;
  const n = Le();
  return {
    schemaVersion: 1,
    intent: e,
    damageType: fe(t.damageType),
    utilityLabel: fe(t.utilityLabel) ?? n.utilityLabel,
    note: _r(t.note),
    forms: Qh(t.forms)
  };
}
function qh(t) {
  switch (t) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function zh(t) {
  const e = as(t);
  if (!e) return null;
  const n = e.forms.base.formula.trim();
  if (!n) return null;
  const r = jh(e, n), o = [
    { type: "spendRitualCost" },
    r,
    ...Gh(e)
  ];
  return {
    version: 1,
    label: `Fórmula de ${t.name ?? "ritual"}`,
    steps: o,
    ritualForms: Hh(t, e),
    resistance: e.intent === "damage" ? Wh(t) : void 0
  };
}
function jh(t, e) {
  const n = {
    type: "rollFormula",
    id: ft,
    formula: e,
    intent: Kh(t.intent)
  };
  return t.intent === "damage" && t.damageType && (n.damageType = t.damageType), n;
}
function Gh(t) {
  switch (t.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${ft}.total`,
          ...Vh(t.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${ft}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function Vh(t) {
  return t ? { damageType: t } : {};
}
function Hh(t, e) {
  const n = e.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [ft]: n
      }
    }
  };
  return Oo(t, "discente") && e.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [ft]: e.forms.discente.formula.trim()
    }
  }), Oo(t, "verdadeiro") && e.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [ft]: e.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Wh(t) {
  const e = ss(t), n = fe(e.skillResis), r = fe(e.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = Zh(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function Kh(t) {
  switch (t) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Yh(t) {
  return t === "damage" || t === "healing" || t === "utility" ? t : null;
}
function Qh(t) {
  const e = Le();
  return De(t) ? {
    base: Ke(t.base),
    discente: Ke(t.discente),
    verdadeiro: Ke(t.verdadeiro)
  } : e.forms;
}
function Ke(t) {
  return De(t) ? { formula: _r(t.formula) } : { formula: "" };
}
function Oo(t, e) {
  const n = ss(t), r = e === "discente" ? n.studentForm : n.trueForm;
  return Xh(r);
}
function ss(t) {
  const e = t.system;
  return De(e) ? e : {};
}
function Zh(t) {
  switch (t) {
    case "resilience":
      return "Fortitude";
    case "reflexes":
      return "Reflexos";
    case "will":
      return "Vontade";
    default:
      return t;
  }
}
function Xh(t) {
  return t === !0 || t === "true" || t === 1 || t === "1";
}
function _r(t) {
  return typeof t == "string" ? t.trim() : "";
}
function fe(t) {
  const e = _r(t);
  return e.length > 0 ? e : null;
}
function De(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
const Mo = "occultism";
function Jh(t) {
  const e = t.system?.ritual?.DT;
  return typeof e == "number" && Number.isFinite(e) ? Math.trunc(e) : null;
}
async function t_(t) {
  const e = Jh(t);
  if (e === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await e_(t, Mo);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Qi(n);
  const r = o_(n);
  return {
    skill: Mo,
    skillLabel: "Ocultismo",
    roll: n,
    formula: r_(n),
    total: r,
    difficulty: e,
    success: r >= e,
    diceBreakdown: a_(n)
  };
}
async function e_(t, e) {
  const n = t;
  if (typeof n.rollSkill != "function")
    return null;
  const r = await Promise.resolve(
    n.rollSkill(
      { skill: e },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return n_(r);
}
function n_(t) {
  return Fo(t) ? t : Array.isArray(t) ? t.find(Fo) ?? null : null;
}
function Fo(t) {
  return !!(t && typeof t == "object" && "evaluate" in t && "total" in t);
}
function r_(t) {
  const e = t.formula;
  return typeof e == "string" && e.trim().length > 0 ? e : "rolagem";
}
function o_(t) {
  const e = t.total;
  return typeof e == "number" && Number.isFinite(e) ? Math.trunc(e) : 0;
}
function a_(t) {
  const e = t.dice;
  if (!Array.isArray(e)) return null;
  const n = e.find(i_);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((i) => {
    if (!i || typeof i != "object") return [];
    const s = i.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function i_(t) {
  return !!(t && typeof t == "object" && t.faces === 20);
}
function s_(t) {
  switch (l_(t)) {
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
      return c_(String(t ?? ""));
  }
}
function l_(t) {
  if (t == null) return null;
  const e = String(t).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return e.length > 0 ? e : null;
}
function c_(t) {
  const e = t.trim();
  return e ? `${e.charAt(0).toLocaleUpperCase()}${e.slice(1)}` : "Sem tipo";
}
function u_(t) {
  return {
    header: {
      eyebrow: jn,
      title: t.ritual.name ?? "Ritual sem nome",
      subtitle: g_(t.ritual)
    },
    forms: t.variantOptions.map((e) => d_(e, t.cost)),
    cost: {
      spendResourceChecked: t.defaultSpendResource,
      baseCostText: t.cost ? `${t.cost.amount} ${t.cost.resource}` : "não resolvido",
      casterName: t.actor.name ?? "Ator sem nome",
      targetText: t.targetNames.length > 0 ? t.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: p_(t.automationStatus ?? "assisted")
  };
}
function d_(t, e) {
  const n = m_(t);
  return {
    variant: t.variant,
    label: t.label,
    enabled: t.enabled,
    checked: t.variant === "base",
    costText: t.enabled ? t.finalCostText ?? f_(e) : "—",
    details: n
  };
}
function m_(t) {
  return t.enabled ? t.details.map((e) => e.trim()).filter((e) => e.length > 0).filter((e) => !e.toLocaleLowerCase().startsWith("custo final")) : [t.unavailableReason ?? "não disponível neste ritual"];
}
function f_(t) {
  return t ? `${t.amount} ${t.resource}` : "custo não resolvido";
}
function p_(t) {
  return t === "generic" ? {
    status: t,
    title: "Sem automação configurada.",
    description: "O Toolkit vai registrar a conjuração e gastar o recurso escolhido. Rolagens, dano, resistência e efeitos continuam manuais."
  } : {
    status: t,
    title: "Automação assistida disponível.",
    description: "O Toolkit vai preparar custo, rolagens e ações assistidas no card persistente do chat."
  };
}
function g_(t) {
  const e = t.system, n = [__(e?.element), h_(e?.circle)].filter(A_);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function h_(t) {
  const e = typeof t == "string" ? Number(t) : t;
  return typeof e != "number" || !Number.isFinite(e) ? null : `${e}º Círculo`;
}
function __(t) {
  if (typeof t != "string" || t.trim().length === 0) return null;
  switch (b_(t)) {
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
      return y_(t);
  }
}
function b_(t) {
  return t.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function y_(t) {
  const e = t.trim();
  return e ? `${e.charAt(0).toLocaleUpperCase()}${e.slice(1)}` : null;
}
function A_(t) {
  return typeof t == "string" && t.length > 0;
}
const ls = ["base", "discente", "verdadeiro"];
function cs(t) {
  switch (t) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function pe(t) {
  return typeof t == "string" && ls.includes(t);
}
const { ApplicationV2: T_ } = foundry.applications.api;
class Nt extends T_ {
  constructor(e, n) {
    super({
      id: `${u}-ritual-cast-${e.actor.id ?? foundry.utils.randomID()}-${e.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${e.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = u_(e), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
  }
  resolveRequest;
  model;
  selectedVariant = "base";
  spendResource = !0;
  isResolved = !1;
  static DEFAULT_OPTIONS = {
    id: `${u}-ritual-cast`,
    classes: [u, "paranormal-toolkit-ritual-cast-app"],
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
      cast: Nt.onCast,
      cancel: Nt.onCancel
    }
  };
  static async request(e) {
    return new Promise((n) => {
      new Nt(e, n).render({ force: !0 });
    });
  }
  async _renderHTML(e, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(e, n, r) {
    n.replaceChildren(e);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    R_(o, (i) => {
      this.selectedVariant = i;
    }), w_(o, (i) => {
      this.spendResource = i;
    });
  }
  async close(e) {
    return this.settle(null), super.close(e);
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
          ${this.model.forms.map($_).join("")}
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
  static async onCast(e) {
    e.preventDefault();
    const n = I_(e), r = k_(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(e) {
    e.preventDefault(), this.settle(null), await this.close();
  }
  settle(e) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(e));
  }
}
function $_(t) {
  const e = t.checked ? "checked" : "", n = t.enabled ? "" : "disabled", r = t.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = t.details.map((i) => `<span>${E(i)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${E(t.variant)}"
      role="radio"
      aria-checked="${t.checked ? "true" : "false"}"
      aria-disabled="${t.enabled ? "false" : "true"}"
      tabindex="${t.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${E(t.variant)}" ${e} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${E(t.label)}</strong>
        <em>${E(t.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function R_(t, e) {
  const n = Array.from(t.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Bo(t, o, e)), o.addEventListener("keydown", (i) => {
      i.key !== "Enter" && i.key !== " " || (i.preventDefault(), Bo(t, o, e));
    });
  const r = us(t);
  r && e(r);
}
function Bo(t, e, n) {
  const r = e.querySelector('input[name="variant"]');
  !r || r.disabled || !pe(r.value) || (r.checked = !0, t.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), us(t));
}
function us(t) {
  const e = t.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of e) {
    const o = r.querySelector('input[name="variant"]'), i = o?.checked === !0;
    r.setAttribute("aria-checked", i ? "true" : "false"), i && pe(o.value) && (n = o.value);
  }
  return n && (t.dataset.paranormalToolkitSelectedVariant = n), n;
}
function w_(t, e) {
  const n = t.querySelector('input[name="spendResource"]');
  n && (e(n.checked), n.addEventListener("change", () => {
    e(n.checked);
  }));
}
function k_(t, e, n) {
  const r = E_(t) ?? n, o = t?.querySelector('input[name="spendResource"]')?.checked ?? e;
  return {
    variant: r,
    spendResource: o
  };
}
function E_(t) {
  const e = t?.querySelector('input[name="variant"]:checked')?.value;
  if (pe(e)) return e;
  const n = t?.dataset.paranormalToolkitSelectedVariant;
  return pe(n) ? n : null;
}
function I_(t) {
  for (const e of [t.currentTarget, t.target, ...t.composedPath()]) {
    if (!(e instanceof HTMLElement)) continue;
    const n = e.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function E(t) {
  const e = document.createElement("div");
  return e.textContent = t, e.innerHTML;
}
async function C_(t) {
  return Nt.request(t);
}
const br = {
  label: "Padrão"
}, S_ = {
  label: "Discente",
  extraCost: 2
}, L_ = {
  label: "Verdadeiro",
  extraCost: 5
};
class D_ {
  constructor(e, n, r) {
    this.workflow = e, this.resources = n, this.ritualCosts = r;
  }
  workflow;
  resources;
  ritualCosts;
  canHandle(e, n) {
    return e.item.type === "ritual" || n.steps.some((r) => r.type === "spendRitualCost");
  }
  async run(e, n) {
    if (!e.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const r = this.resolveCostPreview(e), o = Tb(n), i = bb(
      n,
      e.item,
      r,
      o
    ), s = await C_({
      actor: e.actor,
      ritual: e.item,
      targetNames: e.targets.map((w) => w.name),
      cost: r,
      defaultSpendResource: Ib(n),
      variantOptions: i,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = P_(s), c = Rb(
      n,
      e.item,
      l.variant,
      o
    ), d = Da();
    let f = null;
    if (d) {
      const w = await N_(
        this.resources,
        e.actor,
        l,
        c,
        r
      );
      if (!w.ok)
        return {
          status: "failed",
          reason: w.reason,
          message: w.message
        };
      try {
        f = await t_(
          e.actor
        );
      } catch (j) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: j instanceof Error ? j.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: j
        };
      }
    }
    const y = v_(
      n,
      l,
      c,
      r,
      {
        includeCostSteps: !d
      }
    );
    if (y.steps.length === 0) {
      const w = $b(
        e,
        l
      ), j = Uo(
        e.actor,
        f,
        c,
        r
      ), Lr = qo(
        n,
        l,
        c,
        r,
        w,
        e,
        f
      );
      return j.length > 0 ? {
        status: "ready",
        workflowContext: w,
        actions: j,
        summaryLines: Lr
      } : {
        status: "completed-without-actions",
        workflowContext: w,
        summaryLines: Lr
      };
    }
    const T = await this.workflow.runAutomation(y, {
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
    const $ = T.value.context, g = q_(
      n,
      e,
      $
    ), O = O_(
      n,
      e
    ), wt = Uo(
      e.actor,
      f,
      c,
      r
    ), kt = qo(
      n,
      l,
      c,
      r,
      $,
      e,
      f
    );
    if (!g.ok)
      return {
        status: "failed",
        reason: g.reason,
        message: g.message
      };
    if (!O.ok)
      return {
        status: "failed",
        reason: O.reason,
        message: O.message
      };
    const Et = [
      ...wt,
      ...g.actions,
      ...O.actions
    ];
    return Et.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: $,
      summaryLines: kt
    } : {
      status: "ready",
      workflowContext: $,
      actions: Et,
      summaryLines: kt
    };
  }
  async applyAction(e) {
    return de(
      this.resources,
      e.actor,
      e.resource,
      e.operation,
      e.amount
    );
  }
  resolveCostPreview(e) {
    if (!e.actor) return null;
    const n = this.ritualCosts.getCost({
      actor: e.actor,
      ritual: e.item
    });
    return n.ok ? n.value : null;
  }
}
function P_(t) {
  return {
    variant: t.variant,
    spendResource: t.spendResource === !0
  };
}
function v_(t, e, n, r, o) {
  const i = [], s = e.spendResource === !0;
  for (const l of t.steps)
    l.type === "modifyResource" || l.type === "chatCard" || Ar(l) && (!o.includeCostSteps || !s) || i.push(x_(l, n));
  return o.includeCostSteps && s && r && Cb(n.extraCost) && i.push({
    type: "spendResource",
    actor: "self",
    resource: r.resource,
    amount: n.extraCost
  }), {
    ...t,
    label: `${t.label} · Conjuração assistida`,
    steps: i
  };
}
async function N_(t, e, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const i = jt(o, r);
  if (!i)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (i.amount <= 0) return { ok: !0 };
  const s = await t.spend(
    e,
    i.resource,
    i.amount
  );
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function x_(t, e) {
  if (t.type !== "rollFormula") return t;
  const n = e.rollFormulaOverrides?.[t.id];
  return n ? {
    ...t,
    formula: n
  } : t;
}
function Uo(t, e, n, r) {
  if (!e || e.success) return [];
  const o = jt(r, n);
  if (!o || o.amount <= 0) return [];
  const i = t.name ?? "Ator sem nome";
  return [
    {
      kind: "resource-operation",
      actor: t,
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
function O_(t, e) {
  const n = [];
  for (const r of t.conditionApplications ?? []) {
    const o = yr(r.actor, e);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const i of o) {
      const s = ei(i);
      n.push(
        M_(
          r,
          i,
          e.item,
          s
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function M_(t, e, n, r) {
  const o = e.name ?? "Ator sem nome", i = t.label ?? U_(t.conditionId);
  return {
    kind: "condition-application",
    actor: e,
    actorName: o,
    conditionId: t.conditionId,
    conditionLabel: i,
    duration: F_(
      t.duration ?? null,
      r
    ),
    source: t.source ?? null,
    originUuid: n.uuid ?? null,
    label: B_(i, t.duration),
    executedLabel: t.executedLabel ?? `✓ ${i} aplicado`,
    actionSectionId: t.actionSectionId ?? "apply-effects",
    actionSectionTitle: t.actionSectionTitle ?? "Aplicar efeito"
  };
}
function F_(t, e) {
  return t ? {
    ...t,
    expiry: t.expiry ?? "turnStart",
    anchor: e
  } : null;
}
function B_(t, e) {
  const n = e?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${t}: ${r}`;
  }
  return t;
}
function U_(t) {
  const e = t.trim();
  return e.length === 0 ? "Condição" : e.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function q_(t, e, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const i of t.steps) {
    if (i.type !== "modifyResource") continue;
    const s = ue(i, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = yr(i.actor, e);
    if (l.length === 0) {
      if (i.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const c of l) {
      if (z_(i)) {
        j_(
          o,
          c,
          G_(i, n, s.value)
        );
        continue;
      }
      r.push(H_(i, c, s.value));
    }
  }
  for (const i of o.values())
    r.push(
      ...V_(
        t,
        e.item,
        i.actor,
        i.entries
      )
    );
  return { ok: !0, actions: r };
}
function z_(t) {
  return t.operation === "damage" && t.resource === "PV";
}
function j_(t, e, n) {
  const r = Q_(e), o = t.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  t.set(r, {
    actor: e,
    entries: [n]
  });
}
function G_(t, e, n) {
  const r = Z_(t.amountFrom), o = r ? e.rolls[r]?.damageType : void 0;
  return {
    step: t,
    amount: n,
    damageType: t.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function V_(t, e, n, r) {
  const o = eb(t), i = o.length > 1 ? ob() : void 0;
  return o.map((s) => {
    const l = r.map(
      (d, f) => {
        const y = nb(d.amount, s);
        return {
          id: W_(d, s, f),
          amount: y,
          damageType: d.damageType,
          sourceRollId: d.sourceRollId,
          ignoreResistance: d.step.ignoreResistance === !0
        };
      }
    ), c = l.reduce(
      (d, f) => d + f.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: l,
      label: K_(c, s, o.length > 1),
      executedLabel: Y_(
        n.name ?? "Ator sem nome",
        s,
        o.length > 1
      ),
      choiceGroupId: i,
      choiceGroupResolvedLabel: i ? "✓ Outra opção escolhida" : void 0,
      actionSectionId: "apply-damage",
      actionSectionTitle: "Aplicar danos",
      source: "item-use.damage-action",
      originUuid: e.uuid ?? null
    };
  });
}
function H_(t, e, n) {
  const r = e.name ?? "Ator sem nome", o = tb(t);
  return {
    kind: "resource-operation",
    actor: e,
    actorName: r,
    resource: t.resource,
    operation: t.operation,
    amount: n,
    label: X_(t, r, n),
    executedLabel: J_(t, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function W_(t, e, n) {
  return `${t.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${e.id}`;
}
function K_(t, e, n) {
  return n ? `${e.id === "normal" ? "Normal" : e.label}: ${t} PV` : `Dano: ${t} PV`;
}
function Y_(t, e, n) {
  return n ? `✓ ${e.id === "normal" ? "dano normal" : e.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}`;
}
function Q_(t) {
  return t.uuid ?? t.id ?? t.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Z_(t) {
  const e = t?.trim();
  if (!e) return null;
  if (e.endsWith(".total"))
    return e.slice(0, -6);
  const [n] = e.split(".");
  return n && n.length > 0 ? n : null;
}
function X_(t, e, n) {
  return t.operation === "heal" && t.resource === "PV" ? `Curar ${n} PV` : t.operation === "damage" ? `Dano: ${n} ${t.resource}` : t.operation === "recover" ? `Recuperar ${n} ${t.resource}` : t.operation === "spend" ? `Gastar ${n} ${t.resource}` : `Aplicar ${n} ${t.resource}`;
}
function J_(t, e) {
  return t.operation === "heal" && t.resource === "PV" ? `✓ ${e} curado` : t.operation === "damage" ? `✓ Dano aplicado em ${e}` : t.operation === "recover" ? `✓ ${e} recuperado` : t.operation === "spend" ? `✓ Recurso gasto de ${e}` : "✓ Ação aplicada";
}
function tb(t) {
  return t.operation === "damage" && t.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : t.operation === "heal" && t.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : t.operation === "recover" || t.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function eb(t) {
  const e = t.resistance?.damageApplications;
  return e && e.length > 0 ? e : t.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function nb(t, e) {
  const n = t * e.multiplier, r = rb(
    n,
    e.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function rb(t, e) {
  switch (e) {
    case "ceil":
      return Math.ceil(t);
    case "round":
      return Math.round(t);
    case "floor":
      return Math.floor(t);
  }
}
function ob() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function yr(t, e) {
  switch (t) {
    case "self":
      return e.actor ? [e.actor] : [];
    case "target":
      return e.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function qo(t, e, n, r, o, i, s = null) {
  return [
    `Forma: ${cs(e.variant)}`,
    lb(e, n, r),
    ...sb(s),
    ...Object.values(o.rolls).flatMap(cb),
    ...ab(t, i),
    ...ub(t.resistance),
    ...hb(n)
  ];
}
function ab(t, e) {
  return ib(t) ? yr("target", e).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function ib(t) {
  return t.steps.some(
    (e) => e.type === "modifyResource" && e.actor === "target"
  ) || (t.conditionApplications ?? []).some(
    (e) => e.actor === "target"
  );
}
function sb(t) {
  return t ? [
    `Conjuração: ${t.skillLabel} = ${Math.trunc(t.total)}`,
    `Conjuração Fórmula: ${t.formula}`,
    `Conjuração DT: ${t.difficulty}`,
    `Conjuração Resultado: ${t.success ? "Sucesso" : "Falha"}`,
    ...t.diceBreakdown ? [`Dados (Conjuração): ${t.diceBreakdown}`] : []
  ] : [];
}
function lb(t, e, n) {
  const r = jt(n, e);
  return r ? t.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : t.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function cb(t) {
  const n = [`${_b(t)}: ${t.formula} = ${Math.trunc(t.total)}`], r = db(t.roll);
  return r && n.push(`Dados: ${r}`), t.damageType && n.push(`Tipo: ${s_(t.damageType)}`), n;
}
function ub(t) {
  return t ? [
    `Resistência: ${t.summary}`,
    `Resistência Perícia: ${t.skill}`,
    `Resistência Rótulo: ${t.label}`
  ] : [];
}
function db(t) {
  if (!t || typeof t != "object") return null;
  const e = t.terms;
  if (!Array.isArray(e)) return null;
  const n = [];
  let r = "+";
  for (const o of e) {
    if (!o || typeof o != "object") continue;
    const i = o;
    if (i.operator === "+" || i.operator === "-") {
      r = i.operator;
      continue;
    }
    const s = mb(i);
    s && (gb(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function mb(t) {
  const e = fb(t);
  return e.length > 0 ? { value: `(${e.join(", ")})` } : pb(t);
}
function fb(t) {
  return Array.isArray(t.results) ? t.results.flatMap((e) => {
    if (!e || typeof e != "object") return [];
    const n = e;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function pb(t) {
  if (typeof t.faces == "number") return null;
  if (typeof t.number == "number" && Number.isFinite(t.number)) {
    const e = Math.abs(t.number);
    return {
      value: String(e),
      operator: t.number < 0 ? "-" : void 0
    };
  }
  return null;
}
function gb(t, e, n) {
  if (t.length === 0) {
    t.push(e === "-" ? `- ${n}` : n);
    return;
  }
  t.push(`${e} ${n}`);
}
function hb(t) {
  return (t.notes ?? []).map((e) => `Observação: ${e}`);
}
function _b(t) {
  switch (t.intent) {
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
function bb(t, e, n, r) {
  return ls.map((o) => {
    const i = ds(
      t,
      e,
      o,
      r
    ), s = i !== null;
    return {
      variant: o,
      label: i?.label ?? cs(o),
      enabled: s,
      details: i ? yb(i, n, r) : [],
      finalCostText: i ? Ab(n, i) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function yb(t, e, n) {
  const r = [], o = Object.values(t.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const i = jt(e, t);
  return r.push(
    i ? `Custo final: ${i.amount} ${i.resource}` : "Custo final não resolvido"
  ), r;
}
function jt(t, e) {
  return t ? {
    resource: t.resource,
    amount: t.amount + (e.extraCost ?? 0)
  } : null;
}
function Ab(t, e) {
  const n = jt(t, e);
  return n ? `${n.amount} ${n.resource}` : null;
}
function Tb(t) {
  return !t.resistance && t.steps.length > 0 && t.steps.every(Ar);
}
function $b(t, e) {
  return es({
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
        variant: e.variant,
        spendResource: e.spendResource
      }
    }
  });
}
function Rb(t, e, n, r) {
  return ds(t, e, n, r) ?? br;
}
function ds(t, e, n, r) {
  const o = t.ritualForms?.[n] ?? null;
  return o || (r ? kb(e, n) ? wb(n) : null : n === "base" ? br : null);
}
function wb(t) {
  switch (t) {
    case "base":
      return br;
    case "discente":
      return S_;
    case "verdadeiro":
      return L_;
  }
}
function kb(t, e) {
  if (e === "base") return !0;
  const n = e === "discente" ? "system.studentForm" : "system.trueForm";
  return Eb(foundry.utils.getProperty(t, n));
}
function Eb(t) {
  return t === !0 || t === "true" || t === 1 || t === "1";
}
function Ib(t) {
  return t.steps.some(Ar);
}
function Ar(t) {
  return t.type === "spendResource" || t.type === "spendRitualCost";
}
function Cb(t) {
  return typeof t == "number" && Number.isFinite(t) && t > 0;
}
const ms = "itemUsePrompts", fs = "chatCard", Pe = "data-paranormal-toolkit-prompt-id", ve = "data-paranormal-toolkit-pending-id", Tr = "data-paranormal-toolkit-executed-label", Nn = "data-paranormal-toolkit-choice-group", ps = "data-paranormal-toolkit-skipped-label", zo = "data-paranormal-toolkit-action-section", jo = "data-paranormal-toolkit-detail-key", Go = "data-paranormal-toolkit-roll-card", $r = "data-paranormal-toolkit-roll-detail-toggle", gs = "data-paranormal-toolkit-roll-detail-id", hs = "data-paranormal-toolkit-resistance-roll-button", _s = "data-paranormal-toolkit-resistance-skill", bs = "data-paranormal-toolkit-resistance-skill-label", ys = "data-paranormal-toolkit-resistance-target-actor-id", As = "data-paranormal-toolkit-resistance-target-name", Ts = "data-paranormal-toolkit-resistance-roll-result", Vo = "data-paranormal-toolkit-system-card-replaced", Sb = `[${ve}]`, Lb = `[${$r}]`, Db = `[${hs}]`, xn = `${u}-chat-enrichment`, h = `${u}-item-use-prompt`, Pb = `${h}__actions`, Ho = `${h}__details`, $s = `${h}__summary`, vb = `${h}__title`, Rs = `${h}__button--executed`, Wo = `${h}__roll-card`;
let Ko = !1, On = null;
const x = /* @__PURE__ */ new Map(), Nb = [0, 100, 500, 1500, 3e3], xb = 3e4, Ob = [0, 100, 500, 1500, 3e3];
function Mb(t) {
  if (On = t, Ko) {
    Qo(t);
    return;
  }
  const e = (n, r) => {
    ks(n, r, t);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Ko = !0, Qo(t);
}
async function Yo(t) {
  const e = ws(t);
  x.set(t.pendingId, e), await kr(e) || xs(e), Es(t.pendingId);
}
async function Fb(t) {
  const e = ws({
    ...t,
    actionPayload: null
  });
  e.executed = !0, e.executedLabel = t.executedLabel ?? "✓ Ritual conjurado", x.set(t.pendingId, e), await kr(e) || xs(e), Es(t.pendingId);
}
async function Ye(t, e) {
  const n = x.get(t);
  x.delete(t), n && await My(n, e);
}
function Rr(t) {
  const e = qs();
  for (const n of e) {
    const r = z(n)[t];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Bb(t, e) {
  const n = Rr(t);
  if (!n) return;
  const r = z(n.message), o = r[t];
  o && (r[t] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await Tt(n.message, r));
}
async function Ub(t, e, n) {
  if (!e) return;
  const r = Rr(t);
  if (!r) return;
  const o = z(r.message);
  let i = !1;
  for (const [s, l] of Object.entries(o))
    s !== t && l.choiceGroupId === e && (o[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, i = !0);
  i && await Tt(r.message, o);
}
function ws(t) {
  const e = Q(t.context.message), n = t.context.targets.find((s) => Un(s)), r = n ? Un(n) : null, o = t.resistanceTargetActor ?? r, i = t.resistanceTargetName ?? n?.name ?? o?.name ?? t.context.targets[0]?.name ?? null;
  return {
    ...t,
    createdAt: Date.now(),
    messageId: e,
    itemId: t.context.item.id ?? null,
    actorId: t.context.actor?.id ?? null,
    itemName: t.context.item.name ?? null,
    resistanceTargetActorId: t.resistanceTargetActorId ?? o?.id ?? null,
    resistanceTargetName: i,
    resistanceRollResult: null,
    actionPayload: t.actionPayload ?? null,
    choiceGroupId: t.choiceGroupId ?? null,
    skippedLabel: t.skippedLabel ?? null,
    actionSectionId: t.actionSectionId ?? null,
    actionSectionTitle: t.actionSectionTitle ?? null,
    summary: my(t.context),
    executed: !1
  };
}
function ks(t, e, n) {
  Oy();
  const r = xe(e);
  if (!r) return;
  const o = vy(t, r);
  o.length > 0 && ge(r);
  for (const i of o)
    Mn(r, i);
  Ss(r, n), Fn(r), Bn(r);
}
function Qo(t) {
  for (const e of Ob)
    globalThis.setTimeout(() => {
      qb(t);
    }, e);
}
function qb(t) {
  for (const e of zb()) {
    const n = Ne(e);
    jb(n) && ks(n, e, t);
  }
}
function zb() {
  const t = /* @__PURE__ */ new Set();
  for (const e of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = e.classList.contains("chat-message") ? e : e.closest(".chat-message") ?? e;
    n.dataset.messageId && t.add(n);
  }
  return Array.from(t);
}
function jb(t) {
  return t ? Er(t) ? !0 : By(t).length > 0 : !1;
}
function Es(t) {
  const e = x.get(t);
  if (!e) return;
  const n = e.messageId ? Ny(e.messageId) : null;
  if (n) {
    ea(n, e), ge(n), Mn(n, e), Zo(n), Fn(n), Bn(n);
    return;
  }
  if (e.messageId) {
    zn(e);
    return;
  }
  const r = xy(e);
  if (r) {
    ea(r, e), ge(r), Mn(r, e), Zo(r), Fn(r), Bn(r);
    return;
  }
  zn(e);
}
function Zo(t) {
  On && Ss(t, On);
}
function ge(t) {
  const e = Gb();
  t.classList.toggle(`${h}--system-card-replaced`, e);
  const n = Cs(t);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, e), !e) || n.getAttribute(Vo) === "true") return;
  const r = n.querySelector(`.${xn}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Vo, "true");
}
function Gb() {
  try {
    return Zl() === "replace";
  } catch {
    return !1;
  }
}
function Mn(t, e) {
  if (ge(t), t.querySelector(`[${Pe}="${$t(e.pendingId)}"]`)) return;
  const n = Vb(t, e);
  Wb(n, e), sy(n, ly(e)).append(dy(e));
}
function Vb(t, e) {
  const n = t.querySelector(`.${xn}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(xn, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const i = document.createElement("span");
  i.classList.add(`${h}__kicker`), i.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(vb), s.textContent = Hb(e);
  const l = document.createElement("span");
  return l.classList.add($s), l.textContent = e.summary, o.append(i, s, l), r.append(o), py(t).append(r), r;
}
function Hb(t) {
  const e = I(t.summaryLines ?? [], "Forma"), n = t.itemName ?? t.title ?? "Automação assistida";
  return e ? `${n} • ${e}` : n;
}
function Wb(t, e) {
  const n = e.summaryLines ?? [], r = vs(n, e);
  if (r) {
    Kb(t, r, e);
    return;
  }
  cy(t, n);
}
function Kb(t, e, n) {
  if (t.querySelector(`[${Go}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Wo, `${Wo}--${e.intent}`), r.setAttribute(Go, "true"), e.castingCheck && Xo(r, Qb(e.castingCheck), n.pendingId, "casting"), Yb(e) && Xo(r, Zb(e), n.pendingId, "effect"), ny(r, e), ry(r, e, n), iy(r, e), t.append(r);
}
function Yb(t) {
  return t.intent !== "casting";
}
function Qb(t) {
  const e = t.success ? "Sucesso" : "Falha";
  return {
    kind: "casting",
    title: "Conjuração",
    label: t.label,
    formula: t.formula,
    total: t.total,
    diceBreakdown: t.diceBreakdown,
    status: t.success ? "success" : "failure",
    statusLabel: e,
    description: `${t.label}: ${t.total} vs DT ${t.difficulty}`,
    detailRows: [
      { label: "Perícia", value: t.label },
      { label: "DT", value: String(t.difficulty) },
      { label: "Resultado", value: e },
      { label: "Fórmula", value: t.formula },
      ...t.diceBreakdown ? [{ label: "Dados", value: t.diceBreakdown }] : []
    ]
  };
}
function Zb(t) {
  const e = t.intent === "healing" ? "Cura" : t.intent === "damage" ? "Dano" : t.label, n = t.damageType ? `${t.damageType}` : null;
  return {
    kind: "effect",
    title: e,
    label: t.label,
    formula: t.formula,
    total: t.total,
    diceBreakdown: t.diceBreakdown,
    description: n,
    detailRows: [
      { label: "Fórmula", value: t.formula },
      ...t.diceBreakdown ? [{ label: "Dados", value: t.diceBreakdown }] : [],
      ...t.damageType ? [{ label: "Tipo", value: t.damageType }] : []
    ]
  };
}
function Xo(t, e, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${e.kind}`
  ), e.status && o.classList.add(`${h}__workflow-section--${e.status}`);
  const i = document.createElement("div");
  i.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = e.title, i.append(s), e.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = e.statusLabel, i.append(l);
  }
  if (o.append(i), e.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = e.description, o.append(l);
  }
  Xb(o, e), ay(o, e.detailRows, n, r, `▸ Detalhes de ${e.title.toLowerCase()}`), t.append(o);
}
function Xb(t, e) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = e.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(e.total), n.append(r, o);
  const i = Jb(e.formula, e.diceBreakdown);
  i && n.append(i), t.append(n);
}
function Jb(t, e) {
  const n = ty(e);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of ey(n, t)) {
    const i = document.createElement("span");
    i.classList.add(`${h}__workflow-die`), o.active || i.classList.add(`${h}__workflow-die--inactive`), i.textContent = String(o.value), r.append(i);
  }
  return r;
}
function ty(t) {
  return t ? (/\(([^)]+)\)/u.exec(t)?.[1] ?? t).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function ey(t, e) {
  if (t.length <= 1) return t.map((r) => ({ value: r, active: !0 }));
  const n = e.toLowerCase();
  return n.includes("kh") ? Jo(t, "highest") : n.includes("kl") ? Jo(t, "lowest") : t.map((r) => ({ value: r, active: !0 }));
}
function Jo(t, e) {
  const n = e === "highest" ? Math.max(...t) : Math.min(...t);
  let r = !1;
  return t.map((o) => {
    const i = !r && o === n;
    return i && (r = !0), { value: o, active: i };
  });
}
function ny(t, e) {
  const n = [
    e.form ? `Forma: ${e.form}` : null,
    e.cost,
    e.damageType ? `Tipo: ${e.damageType}` : null
  ].filter(rA);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const i = document.createElement("span");
    i.classList.add(`${h}__roll-meta-pill`), i.textContent = o, r.append(i);
  }
  t.append(r);
}
function ry(t, e, n) {
  if (!e.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const i = document.createElement("strong");
  i.textContent = "Resistência";
  const s = oy(e, n);
  o.append(i), s && o.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = e.resistance, r.append(o, l), e.resistanceRollResult && r.append(Is(e.resistanceRollResult)), t.append(r);
}
function oy(t, e) {
  if (!t.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Pe, e.pendingId), n.setAttribute(hs, "true"), n.setAttribute(_s, t.resistanceSkill), n.setAttribute(bs, t.resistanceSkillLabel ?? t.resistanceSkill), e.resistanceTargetActorId && n.setAttribute(ys, e.resistanceTargetActorId), e.resistanceTargetName && n.setAttribute(As, e.resistanceTargetName), t.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Ts, String(t.resistanceRollResult.total)), n.textContent = String(t.resistanceRollResult.total), n.title = `Rolar ${t.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${t.resistanceSkillLabel ?? t.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Is(t) {
  const e = document.createElement("span");
  return e.classList.add(`${h}__resistance-roll-result`), e.textContent = Ds(t), e;
}
function ay(t, e, n, r, o) {
  const i = e.filter((d) => d.value.trim().length > 0);
  if (i.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute($r, s), l.setAttribute("aria-expanded", "false"), l.textContent = o;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(gs, s), c.hidden = !0;
  for (const d of i) {
    const f = document.createElement("dt");
    f.textContent = d.label;
    const y = document.createElement("dd");
    y.textContent = d.value, c.append(f, y);
  }
  t.append(l, c);
}
function iy(t, e) {
  if (e.notes.length === 0 && e.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...e.notes, ...e.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  t.append(n);
}
function sy(t, e) {
  const n = `[${zo}="${$t(e.id)}"]`, r = t.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Pb), o.setAttribute(zo, e.id);
  const i = document.createElement("strong");
  return i.classList.add(`${h}__actions-title`), i.textContent = e.title, o.append(i), t.append(o), o;
}
function ly(t) {
  const e = t.actionSectionId?.trim(), n = t.actionSectionTitle?.trim();
  if (e && n)
    return { id: e, title: n };
  const r = vs(t.summaryLines ?? [], t);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function cy(t, e) {
  if (e.length === 0) return;
  const n = uy(t);
  for (const r of e) {
    const o = oA(r);
    if (n.querySelector(`[${jo}="${$t(o)}"]`)) continue;
    const i = document.createElement("li");
    i.textContent = r, i.setAttribute(jo, o), n.append(i);
  }
}
function uy(t) {
  const e = t.querySelector(`.${Ho}`);
  if (e)
    return e;
  const n = document.createElement("ul");
  return n.classList.add(Ho), t.append(n), n;
}
function dy(t) {
  const e = document.createElement("button");
  return e.type = "button", e.classList.add(`${h}__button`), e.setAttribute(Pe, t.pendingId), t.executed ? (e.disabled = !0, e.textContent = t.executedLabel ?? "✓ Automação aplicada", e.classList.add(Rs), e) : (e.textContent = t.buttonLabel ?? "Aplicar automação", e.setAttribute(ve, t.pendingId), e.setAttribute(Tr, t.executedLabel ?? "✓ Automação aplicada"), t.choiceGroupId && (e.setAttribute(Nn, t.choiceGroupId), e.setAttribute(ps, t.skippedLabel ?? "✓ Outra opção escolhida")), e);
}
function my(t) {
  const e = t.actor?.name ?? t.token?.name ?? "Origem não resolvida", n = fy(t);
  return `${e} → ${n}`;
}
function fy(t) {
  return t.targets.length > 0 ? t.targets.map((e) => e.name).join(", ") : "nenhum alvo";
}
function py(t) {
  return Cs(t) ?? t;
}
function Cs(t) {
  return t.classList.contains("message-content") ? t : t.querySelector(".message-content");
}
function Ss(t, e) {
  const n = xe(t);
  if (!n) return;
  const r = n.querySelectorAll(Sb);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Cy(o, e);
    }));
}
function Fn(t) {
  const e = xe(t);
  if (!e) return;
  const n = e.querySelectorAll(Lb);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      gy(e, r);
    }));
}
function Bn(t) {
  const e = xe(t);
  if (!e) return;
  const n = e.querySelectorAll(Db);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      hy(e, r);
    }));
}
function gy(t, e) {
  const n = e.getAttribute($r);
  if (!n) return;
  const r = t.querySelector(`[${gs}="${$t(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, e.setAttribute("aria-expanded", o ? "true" : "false"), e.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function hy(t, e) {
  const n = e.getAttribute(Pe), r = e.getAttribute(_s), o = e.getAttribute(bs) ?? (r ? zt(r) : "Resistência");
  if (!n || !r) return;
  const i = yy(t, n), s = Ay(i, e);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  e.disabled = !0;
  const l = e.innerHTML;
  e.textContent = "...";
  try {
    const c = await ti(s, r);
    await ky(c.roll);
    const d = {
      skill: r,
      skillLabel: o,
      formula: c.formula,
      total: c.total,
      targetName: s.name ?? i?.resistanceTargetName ?? "alvo",
      diceBreakdown: c.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    _y(e, d), by(e, d), Ey(n, d), await Iy(t, n, d);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), e.innerHTML = l;
  } finally {
    e.disabled = !1;
  }
}
function _y(t, e) {
  t.classList.add(`${h}__resistance-roll-button--rolled`), t.setAttribute(Ts, String(e.total)), t.textContent = String(e.total), t.title = `Rolar ${e.skillLabel} novamente`, t.setAttribute("aria-label", t.title);
}
function by(t, e) {
  const n = t.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Is(e);
  if (r) {
    r.textContent = Ds(e);
    return;
  }
  n.append(o);
}
function yy(t, e) {
  const n = x.get(e);
  if (n) return n;
  const r = Ne(t);
  return z(r)[e] ?? null;
}
function Ay(t, e) {
  const n = t?.resistanceTargetActor;
  if (B(n)) return n;
  const o = t?.context?.targets.map(Un).find(B) ?? null;
  if (o) return o;
  const i = e.getAttribute(ys) ?? t?.resistanceTargetActorId ?? null, s = i ? $y(i) : null;
  return s || Ry(
    e.getAttribute(As) ?? t?.resistanceTargetName ?? Ty(e)
  );
}
function Ty(t) {
  const n = t.closest(`.${h}`)?.querySelector(`.${$s}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), i = o[o.length - 1]?.trim();
  return i && i.length > 0 ? i : null;
}
function Un(t) {
  const e = t.actor;
  if (B(e)) return e;
  const n = t.token, r = Ft(n);
  if (r) return r;
  const o = t.document;
  return Ft(o);
}
function Ft(t) {
  if (!t || typeof t != "object") return null;
  const e = t.actor;
  if (B(e)) return e;
  const n = t.document?.actor;
  return B(n) ? n : null;
}
function $y(t) {
  const n = game.actors?.get?.(t);
  return B(n) ? n : Ls().map((i) => Ft(i)).find((i) => i?.id === t) ?? null;
}
function Ry(t) {
  const e = pt(t);
  if (!e) return null;
  const n = Ls().filter((i) => pt(wy(i)) === e).map((i) => Ft(i)).find(B) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((i) => B(i) && pt(i.name) === e);
  return B(o) ? o : null;
}
function Ls() {
  const t = canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function wy(t) {
  if (!t || typeof t != "object") return null;
  const e = t.name;
  if (typeof e == "string") return e;
  const n = t.document?.name;
  return typeof n == "string" ? n : Ft(t)?.name ?? null;
}
function pt(t) {
  const e = t?.trim().toLocaleLowerCase();
  return e && e.length > 0 ? e : null;
}
function B(t) {
  return !!(t && typeof t == "object" && "system" in t);
}
function Ds(t) {
  const e = t.diceBreakdown ? ` ${t.diceBreakdown}` : "";
  return `${t.skillLabel}: ${t.formula}${e} = ${t.total}`;
}
async function ky(t) {
  const e = game.dice3d;
  typeof e?.showForRoll == "function" && await Promise.resolve(e.showForRoll(t, game.user, !0));
}
function Ey(t, e) {
  const n = x.get(t);
  n && (n.resistanceRollResult = e);
}
async function Iy(t, e, n) {
  const r = Ne(t);
  if (r)
    try {
      const o = z(r), i = o[e];
      if (!i) return;
      o[e] = {
        ...i,
        resistanceRollResult: n
      }, await Tt(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Ne(t) {
  const n = (t.closest("[data-message-id]") ?? t).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return q(r?.get?.(n));
}
async function Cy(t, e) {
  const n = t.getAttribute(ve);
  if (!n) return;
  t.disabled = !0;
  const r = t.textContent;
  if (t.textContent = "Aplicando...", await e(n)) {
    Ps(t, t.getAttribute(Tr) ?? "✓ Automação aplicada"), Sy(t);
    return;
  }
  t.disabled = !1, t.textContent = r;
}
function Ps(t, e) {
  t.disabled = !0, t.textContent = e, t.classList.add(Rs), t.removeAttribute(ve), t.removeAttribute(Tr);
}
function Sy(t) {
  const e = t.getAttribute(Nn);
  if (!e) return;
  const n = t.closest(`.${h}`) ?? t.parentElement;
  if (!n) return;
  const r = `[${Nn}="${$t(e)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === t) continue;
    const i = o.getAttribute(ps) ?? "✓ Outra opção escolhida";
    Ps(o, i);
  }
}
function vs(t, e) {
  const n = t.map(wr).filter(eA), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = I(t, "Forma"), i = I(t, "Custo"), s = I(t, "Dados") ?? I(t, `Dados (${r.label})`), l = I(t, "Tipo"), c = I(t, "Resistência"), d = I(t, "Resistência Perícia"), f = I(t, "Resistência Rótulo") ?? (d ? zt(d) : null), y = Ns(t, "Observação"), T = t.filter((g) => Py(g, r)), $ = Ly(t);
  return {
    ...r,
    itemName: e.itemName ?? e.title ?? "Automação assistida",
    form: o,
    cost: i,
    diceBreakdown: s,
    damageType: l,
    resistance: c,
    resistanceSkill: d,
    resistanceSkillLabel: f,
    notes: y,
    details: T,
    castingCheck: $,
    resistanceRollResult: e.resistanceRollResult ?? null
  };
}
function Ly(t) {
  const e = t.map(wr).find((i) => i?.intent === "casting") ?? null, n = I(t, "Conjuração DT"), r = I(t, "Conjuração Resultado");
  if (!e || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: e.formula,
    formula: I(t, "Conjuração Fórmula") ?? e.formula,
    total: e.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: I(t, "Dados (Conjuração)")
  } : null;
}
function wr(t) {
  const e = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(t.trim());
  if (!e) return null;
  const [, n, r, o] = e, i = Number(o);
  return Number.isFinite(i) ? {
    label: n,
    formula: r,
    total: i,
    intent: Dy(n)
  } : null;
}
function Dy(t) {
  return t === "Cura" ? "healing" : t === "Dano" ? "damage" : t === "Conjuração" ? "casting" : "generic";
}
function I(t, e) {
  return Ns(t, e)[0] ?? null;
}
function Ns(t, e) {
  const n = `${e}:`;
  return t.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Py(t, e) {
  return t.startsWith("Forma:") || t.startsWith("Custo:") || t.startsWith("Dados:") || t.startsWith(`Dados (${e.label}):`) || t.startsWith("Tipo:") || t.startsWith("Resistência:") || t.startsWith("Resistência Perícia:") || t.startsWith("Resistência Rótulo:") || t.startsWith("Observação:") || t.startsWith("Conjuração Fórmula:") || t.startsWith("Conjuração DT:") || t.startsWith("Conjuração Resultado:") || t.startsWith("Dados (Conjuração):") || wr(t) ? !1 : t.trim().length > 0;
}
function vy(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const r of x.values())
    qn(r, t, e) && n.set(r.pendingId, r);
  for (const r of Fy(t))
    qn(r, t, e) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function qn(t, e, n) {
  const r = Q(e) ?? n.dataset.messageId ?? null;
  return t.messageId ? t.messageId === r : !t.itemId || !ta(n, "itemId", t.itemId) ? !1 : !t.actorId || ta(n, "actorId", t.actorId);
}
function ta(t, e, n) {
  if (t.dataset[e] === n)
    return !0;
  const r = `data-${aA(e)}`;
  for (const o of t.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Ny(t) {
  const e = $t(t);
  return document.querySelector(
    `.chat-message[data-message-id="${e}"], [data-message-id="${e}"]`
  );
}
function xy(t) {
  for (const e of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (qn(t, null, e))
      return e;
  return null;
}
function Oy() {
  const t = Date.now(), e = 300 * 1e3;
  for (const [n, r] of x.entries())
    t - r.createdAt > e && x.delete(n);
}
async function ea(t, e) {
  const n = Ne(t);
  if (!n) return !1;
  try {
    const r = z(n);
    return r[e.pendingId] = Ir(e, Q(n)), await Tt(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function kr(t) {
  const e = Fs(t);
  if (!e) return !1;
  try {
    const n = z(e);
    return n[t.pendingId] = Ir(t, Q(e)), await Tt(e, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function xs(t) {
  for (const e of Nb)
    globalThis.setTimeout(() => {
      zn(t);
    }, e);
}
async function zn(t) {
  const e = Fs(t);
  if (Er(e)?.prompts.some((o) => o.pendingId === t.pendingId))
    return !0;
  const r = await kr(t);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: t.pendingId,
    itemId: t.itemId,
    itemName: t.itemName,
    actorId: t.actorId,
    messageId: t.messageId
  }), r;
}
async function My(t, e) {
  const n = Ms(t.context.message);
  if (n)
    try {
      const r = z(n), o = r[t.pendingId] ?? Ir(t, Q(n));
      r[t.pendingId] = {
        ...o,
        executedLabel: e ?? o.executedLabel,
        executed: !0
      }, await Tt(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function Fy(t) {
  return Object.values(z(q(t))).filter(Gt);
}
function z(t) {
  if (!t) return {};
  const e = {}, n = Er(t);
  for (const r of n?.prompts ?? [])
    e[r.pendingId] = r;
  for (const [r, o] of Object.entries(Os(t)))
    e[r] ??= o;
  return e;
}
function By(t) {
  return Object.values(Os(q(t))).filter(Gt);
}
function Os(t) {
  if (!t) return {};
  const e = t.getFlag?.(u, ms);
  if (!_t(e))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(e))
    Gt(o) && (n[r] = o);
  return n;
}
async function Tt(t, e) {
  typeof t.setFlag == "function" && (await qy(t, e), await Uy(t, e));
}
async function Uy(t, e) {
  await Promise.resolve(t.setFlag?.(u, ms, e));
}
function Er(t) {
  if (!t) return null;
  const e = t.getFlag?.(u, fs);
  return Jy(e) ? e : null;
}
async function qy(t, e) {
  if (typeof t.setFlag != "function") return;
  const n = Object.values(e).filter(Gt).sort((i, s) => i.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((i) => i.createdAt)),
    messageId: r.messageId ?? Q(t) ?? null,
    source: {
      actorId: r.actorId,
      actorName: zy(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(t.setFlag(u, fs, o));
}
function zy(t) {
  if (!t.includes("→")) return t.trim() || null;
  const n = t.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Ir(t, e) {
  return {
    schemaVersion: 1,
    pendingId: t.pendingId,
    mode: t.mode,
    title: t.title,
    buttonLabel: t.buttonLabel,
    executedLabel: t.executedLabel,
    summaryLines: t.summaryLines ? [...t.summaryLines] : void 0,
    createdAt: t.createdAt,
    messageId: e ?? t.messageId,
    itemId: t.itemId,
    actorId: t.actorId,
    itemName: t.itemName,
    resistanceTargetActorId: t.resistanceTargetActorId,
    resistanceTargetName: t.resistanceTargetName,
    resistanceRollResult: t.resistanceRollResult ?? null,
    actionPayload: t.actionPayload ?? null,
    choiceGroupId: t.choiceGroupId ?? null,
    skippedLabel: t.skippedLabel ?? null,
    actionSectionId: t.actionSectionId ?? null,
    actionSectionTitle: t.actionSectionTitle ?? null,
    summary: t.summary,
    executed: t.executed
  };
}
function Ms(t) {
  const e = q(t);
  if (e?.setFlag)
    return e;
  const n = jy(t);
  if (n?.setFlag)
    return n;
  const r = Q(t);
  if (!r) return null;
  const o = game.messages;
  return q(o?.get?.(r));
}
function jy(t) {
  return !t || typeof t != "object" ? null : [
    t.document,
    t.message,
    t.chatMessage
  ].map(q).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Fs(t) {
  const e = Ms(t.context.message);
  if (e) return e;
  const n = t.messageId ? Gy(t.messageId) : null;
  if (n) return n;
  const r = qs().slice().reverse();
  return r.find((o) => Vy(o, t)) ?? r.find((o) => Hy(o, t)) ?? null;
}
function Gy(t) {
  const e = game.messages;
  return q(e?.get?.(t));
}
function Vy(t, e) {
  const n = Q(t);
  if (e.messageId && n === e.messageId) return !0;
  if (!Bs(t, e)) return !1;
  const o = Us(t);
  return !e.actorId || !o || o === e.actorId;
}
function Hy(t, e) {
  if (!Ky(t, e)) return !1;
  const n = Us(t);
  return e.actorId && n === e.actorId ? !0 : Bs(t, e);
}
function Bs(t, e) {
  const n = pt(Wy(t));
  if (!n) return !1;
  const r = pt(e.itemName);
  if (r && n.includes(r)) return !0;
  const o = pt(e.itemId);
  return !!(o && n.includes(o));
}
function Wy(t) {
  const e = t.content;
  return typeof e == "string" ? e : null;
}
function Us(t) {
  const e = t.speaker;
  return typeof e?.actor == "string" && e.actor.length > 0 ? e.actor : null;
}
function Ky(t, e) {
  const n = Yy(t);
  return n === null ? !1 : Math.abs(n - e.createdAt) <= xb;
}
function Yy(t) {
  const e = t.timestamp;
  if (typeof e == "number" && Number.isFinite(e)) return e;
  const n = t._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function q(t) {
  return t && typeof t == "object" ? t : null;
}
function Gt(t) {
  return _t(t) ? t.schemaVersion === 1 && typeof t.pendingId == "string" && t.mode === "ask" && typeof t.createdAt == "number" && typeof t.summary == "string" && typeof t.executed == "boolean" && S(t.messageId) && S(t.itemId) && S(t.actorId) && S(t.itemName) && et(t.resistanceTargetActorId) && et(t.resistanceTargetName) && tA(t.resistanceRollResult) && Qy(t.actionPayload) && Qe(t.title) && Qe(t.buttonLabel) && Qe(t.executedLabel) && et(t.choiceGroupId) && et(t.skippedLabel) && et(t.actionSectionId) && et(t.actionSectionTitle) && nA(t.summaryLines) : !1;
}
function Qy(t) {
  return t == null ? !0 : _t(t) ? t.kind === "resource-operation" && S(t.actorId) && S(t.actorUuid) && typeof t.actorName == "string" && Zy(t.resource) && Xy(t.operation) && typeof t.amount == "number" && Number.isFinite(t.amount) : !1;
}
function Zy(t) {
  return t === "PV" || t === "SAN" || t === "PE" || t === "PD";
}
function Xy(t) {
  return t === "damage" || t === "heal" || t === "recover" || t === "spend";
}
function Jy(t) {
  return _t(t) ? t.schemaVersion === 1 && t.kind === "item-use" && typeof t.createdAt == "number" && S(t.messageId) && _t(t.source) && S(t.source.actorId) && S(t.source.actorName) && S(t.source.itemId) && S(t.source.itemName) && Array.isArray(t.prompts) && t.prompts.every(Gt) : !1;
}
function tA(t) {
  return t == null ? !0 : _t(t) ? typeof t.skill == "string" && typeof t.skillLabel == "string" && typeof t.formula == "string" && typeof t.total == "number" && Number.isFinite(t.total) && typeof t.targetName == "string" && et(t.diceBreakdown) && (t.usedFallbackBonus === void 0 || typeof t.usedFallbackBonus == "boolean") && typeof t.rolledAt == "string" : !1;
}
function eA(t) {
  return t !== null;
}
function _t(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function S(t) {
  return t === null || typeof t == "string";
}
function Qe(t) {
  return t === void 0 || typeof t == "string";
}
function et(t) {
  return t == null || typeof t == "string";
}
function nA(t) {
  return t === void 0 || Array.isArray(t) && t.every((e) => typeof e == "string");
}
function rA(t) {
  return typeof t == "string" && t.length > 0;
}
function qs() {
  const t = game.messages;
  if (!t || typeof t != "object") return [];
  const e = t.contents;
  if (Array.isArray(e))
    return e.map(q).filter((r) => r !== null);
  const n = t.values;
  return typeof n == "function" ? Array.from(n.call(t)).map(q).filter((r) => r !== null) : [];
}
function xe(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function Q(t) {
  if (!t || typeof t != "object") return null;
  const e = t;
  return typeof e.id == "string" && e.id.length > 0 ? e.id : typeof e._id == "string" && e._id.length > 0 ? e._id : null;
}
function oA(t) {
  return t.trim().toLowerCase();
}
function aA(t) {
  return t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
}
function $t(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const na = 1e3;
class iA {
  constructor(e, n, r, o, i, s) {
    this.workflow = e, this.resources = n, this.damage = o, this.conditions = i, this.debugOutput = s, this.ritualAssistant = new D_(
      e,
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
  addStrategy(e) {
    this.strategies.push(e);
  }
  registerStrategies() {
    for (const e of this.strategies)
      e.register();
    this.registerPromptRenderer();
  }
  status() {
    return {
      settings: Mr(),
      strategies: this.strategies.map((e) => e.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(e) {
    const n = Mr();
    if (n.executionMode === "disabled") {
      this.setAttempt(e, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Gn(e.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && pA(e.item) && n.executionMode === "ask") {
        await this.handleGenericRitual(e);
        return;
      }
      const o = r.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(e, o, r.error.reason), r.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: r.error.message,
        data: r.error
      });
      return;
    }
    if (await xo(e), !e.actor) {
      this.setAttempt(e, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${e.item.name}.`,
        data: Je(e, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(e)) {
      this.setAttempt(e, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(e), n.executionMode) {
      case "ask":
        await this.handleAskMode(e, r.value);
        return;
      case "automatic":
        await this.executeAutomation(e, r.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(e) {
    const n = this.pendingExecutions.get(e);
    if (!n)
      return this.executePersistedPendingAutomation(e);
    if (n.kind === "workflow")
      return this.pendingExecutions.delete(e), await Ye(e), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(e), await Ye(
      e,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(e) {
    const n = Rr(e);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = _A(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const i = await de(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return i.ok ? (await Bb(e), await Ub(
      e,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(i), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Mb(
      (e) => this.executePendingAutomation(e)
    ), this.promptRendererRegistered = !0);
  }
  async handleAskMode(e, n) {
    if (this.ritualAssistant.canHandle(e, n)) {
      await this.handleAssistedRitual(e, n);
      return;
    }
    await this.createPendingWorkflowPrompt(e, n);
  }
  async handleGenericRitual(e) {
    if (await xo(e), !e.actor) {
      this.setAttempt(e, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${e.item.name}.`,
        data: Je(e, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(e)) {
      this.setAttempt(e, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(e), await this.handleAssistedRitual(
      e,
      gA(e.item)
    );
  }
  async handleAssistedRitual(e, n) {
    this.setAttempt(e, "running", "ritual-assisted-cast");
    const r = await this.ritualAssistant.run(e, n);
    switch (r.status) {
      case "cancelled":
        this.setAttempt(e, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(e, "failed", r.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: r.message,
          data: r.cause ?? r
        }), ui.notifications?.warn(`Paranormal Toolkit: ${r.message}`);
        return;
      case "completed-without-actions":
        await this.registerCompletedRitualCard(e, r.summaryLines), this.setAttempt(e, "completed", "ritual-assisted-no-actions"), m.info(
          "Ritual assistido concluído sem ações pendentes.",
          ot(r.workflowContext)
        );
        return;
      case "ready":
        await this.registerAssistedActions(
          e,
          r.workflowContext,
          r.actions,
          r.summaryLines
        );
        return;
    }
  }
  async executeAssistedAction(e, n) {
    if (e.kind === "resource-operation") {
      const o = await this.ritualAssistant.applyAction(e);
      return o.ok ? (n.resourceTransactions.push(o.value), { ok: !0 }) : (this.handleResourceActionFailure(o), { ok: !1 });
    }
    if (e.kind === "damage-application") {
      const o = await this.damage.applyDamage({
        actor: e.actor,
        instances: e.instances,
        source: e.source,
        originUuid: e.originUuid
      });
      return o.ok ? (fA(n, o.value), await sA(o.value), {
        ok: !0,
        executedLabel: lA(o.value)
      }) : (this.handleDamageActionFailure(o.error), { ok: !1 });
    }
    const r = await this.conditions.applyCondition({
      actor: e.actor,
      conditionId: e.conditionId,
      duration: e.duration,
      originUuid: e.originUuid,
      source: e.source ?? "item-use.condition-action"
    });
    return r.ok ? (r.value.warning && ui.notifications?.warn(`Paranormal Toolkit: ${r.value.warning}`), { ok: !0 }) : (this.handleConditionActionFailure(r), { ok: !1 });
  }
  async resolveAlternativeActions(e) {
    const n = Ze(e.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && Ze(o.action) === n);
    for (const [o, i] of r)
      i.kind === "assisted-action" && i.id !== e.id && (this.pendingExecutions.delete(o), await Ye(
        o,
        oa(i.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(e, n) {
    const r = tn();
    await Fb({
      pendingId: r,
      context: e,
      mode: "ask",
      title: "Paranormal Toolkit · Ritual",
      buttonLabel: "Ritual conjurado",
      executedLabel: "✓ Ritual conjurado",
      actionSectionId: "ritual-log",
      actionSectionTitle: "Registro",
      summaryLines: n
    });
  }
  async registerAssistedActions(e, n, r, o) {
    let i;
    for (const s of r) {
      const l = tn();
      i ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: e,
        workflowContext: n,
        createdAt: Date.now()
      }), await Yo({
        pendingId: l,
        context: e,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: Ze(s),
        skippedLabel: oa(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: hA(s)
      });
    }
    this.setAttempt(
      e,
      "pending",
      "ritual-assisted-actions",
      i
    ), m.info(
      "Ritual assistido preparado com ações pendentes.",
      ot(n)
    );
  }
  async createPendingWorkflowPrompt(e, n) {
    const r = tn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: e,
      mode: "ask",
      createdAt: Date.now()
    }), await Yo({
      pendingId: r,
      context: e,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(e, "pending", "execution-mode-ask", r);
  }
  async executeAutomation(e, n, r) {
    this.setAttempt(e, "running");
    const o = await this.workflow.runAutomation(n, {
      sourceActor: e.actor,
      sourceToken: e.token,
      item: e.item,
      targets: e.targets,
      flags: {
        itemUse: {
          source: e.source,
          executionMode: r
        }
      }
    });
    if (!o.ok) {
      this.setAttempt(e, "failed", o.error.reason), this.handleAutomationFailure(o.error);
      return;
    }
    this.setAttempt(e, "completed"), m.info(
      "Automação executada por uso normal de item.",
      ot(o.value.context)
    );
  }
  handleAutomationFailure(e) {
    const n = `Automação por uso de item falhou: ${e.message}`;
    if (e.reason === "resource-operation-failed") {
      m.warn(n, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
      return;
    }
    if (e.reason === "chat-card-failed") {
      m.error(n, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
      return;
    }
    m.warn(n, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
  }
  handleResourceActionFailure(e) {
    m.warn(
      `Ação assistida falhou: ${e.error.message}`,
      e.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${e.error.message}`);
  }
  handleDamageActionFailure(e) {
    m.warn(`Ação assistida de dano falhou: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
  }
  handleConditionActionFailure(e) {
    m.warn(
      `Ação assistida de condição falhou: ${e.error.message}`,
      e.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${e.error.message}`);
  }
  isDuplicate(e) {
    const n = Date.now(), r = aa(e);
    for (const [i, s] of this.recentExecutionKeys.entries())
      n - s > na && this.recentExecutionKeys.delete(i);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= na;
  }
  markExecution(e) {
    this.recentExecutionKeys.set(aa(e), Date.now());
  }
  setAttempt(e, n, r, o) {
    this.lastAttempt = Je(
      e,
      n,
      r,
      o
    );
  }
}
async function sA(t) {
  const e = mA();
  if (e.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: t.actor }),
        whisper: e,
        content: cA(t)
      });
    } catch (n) {
      m.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function lA(t) {
  const e = t.totalBlocked > 0 ? ` (RD ${t.totalBlocked})` : "";
  return `✓ ${t.totalFinalDamage} PV aplicado${e}`;
}
function cA(t) {
  const e = t.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${ie(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = t.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${t.totalFinalDamage} PV</li>` : "", r = t.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${t.totalBlocked}</li>` : "", o = uA(t), i = t.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${ie(t.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${ie(t.actorName)}</strong></p>
      <ul>
        ${e}
        ${n}
        ${r}
        ${o}
        ${i}
      </ul>
    </div>
  `;
}
function uA(t) {
  const e = dA(t.actor), n = t.newPV ?? e?.value ?? null, r = e?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${ie(o)}</li>`;
}
function dA(t) {
  const e = t.system, n = t.type === "threat" ? e.attributes?.hp : e.PV, r = ra(n?.value);
  return r === null ? null : {
    value: r,
    max: ra(n?.max)
  };
}
function ra(t) {
  return typeof t == "number" && Number.isFinite(t) ? t : null;
}
function mA() {
  return game.users.filter((t) => t.isGM).map((t) => t.id).filter((t) => typeof t == "string" && t.length > 0);
}
function ie(t) {
  const e = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return t.replace(/[&<>"']/gu, (n) => e[n] ?? n);
}
function Ze(t) {
  return t.kind !== "resource-operation" && t.kind !== "damage-application" ? null : t.choiceGroupId ?? null;
}
function oa(t) {
  return t.kind !== "resource-operation" && t.kind !== "damage-application" ? null : t.choiceGroupResolvedLabel ?? null;
}
function fA(t, e) {
  for (const n of e.instances)
    t.damageInstances.push({
      id: n.id,
      source: "ritual",
      sourceId: e.originUuid,
      sourceName: e.source ?? "Dano assistido",
      targetActorId: e.actorId,
      targetActorName: e.actorName,
      rollId: n.sourceRollId ?? void 0,
      damageType: n.damageType ?? n.systemDamageType ?? void 0,
      rawAmount: n.inputAmount,
      resistance: n.blocked > 0 ? n.blocked : void 0,
      finalAmount: n.finalDamage,
      appliedAmount: n.finalDamage,
      tags: ["ordem-apply-damage"]
    });
}
function pA(t) {
  return t.type === "ritual";
}
function gA(t) {
  return zh(t) ?? {
    version: 1,
    label: `Conjuração de ${t.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function hA(t) {
  return t.kind === "damage-application" || t.kind !== "resource-operation" ? null : {
    kind: "resource-operation",
    actorId: t.actor.id ?? null,
    actorUuid: t.actor.uuid ?? null,
    actorName: t.actorName,
    resource: t.resource,
    operation: t.operation,
    amount: t.amount
  };
}
function _A(t) {
  const e = t.actorUuid ? bA(t.actorUuid) : null;
  if (bt(e)) return e;
  const n = t.actorId ? yA(t.actorId) : null;
  return n || AA(t.actorName);
}
function bA(t) {
  const e = globalThis.fromUuidSync;
  if (typeof e != "function") return null;
  try {
    return e(t);
  } catch {
    return null;
  }
}
function yA(t) {
  const n = game.actors?.get?.(t);
  if (bt(n)) return n;
  for (const r of zs()) {
    const o = Cr(r);
    if (o?.id === t) return o;
  }
  return null;
}
function AA(t) {
  const e = Xe(t);
  if (!e) return null;
  for (const o of zs()) {
    const i = TA(o);
    if (Xe(i) === e) {
      const s = Cr(o);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (o) => bt(o) && Xe(o.name) === e
  );
  return bt(r) ? r : null;
}
function zs() {
  const t = canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function TA(t) {
  if (!t || typeof t != "object") return null;
  const e = t.name;
  if (typeof e == "string") return e;
  const n = t.document?.name;
  return typeof n == "string" ? n : Cr(t)?.name ?? null;
}
function Cr(t) {
  if (!t || typeof t != "object") return null;
  const e = t.actor;
  if (bt(e)) return e;
  const n = t.document?.actor;
  return bt(n) ? n : null;
}
function Xe(t) {
  const e = t?.trim().toLocaleLowerCase();
  return e && e.length > 0 ? e : null;
}
function bt(t) {
  return !!(t && typeof t == "object" && "system" in t);
}
function Je(t, e, n, r) {
  return {
    source: t.source,
    status: e,
    reason: n,
    pendingId: r,
    itemId: t.item.id ?? null,
    itemName: t.item.name ?? "Item sem nome",
    itemType: t.item.type ?? "unknown",
    itemUuid: t.item.uuid ?? null,
    actorId: t.actor?.id ?? null,
    actorName: t.actor?.name ?? null,
    targetCount: t.targets.length,
    timestamp: Date.now()
  };
}
function aa(t) {
  const e = t.actor?.id ?? "no-actor", n = t.item.uuid ?? t.item.id ?? t.item.name ?? "unknown-item";
  return `${e}:${n}`;
}
function tn() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class $A {
  constructor(e, n, r) {
    this.diagnostic = e, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(e) {
    const n = this.diagnostic.getApplicableEntries(e), r = [], o = [], i = Ut(e);
    for (const s of n) {
      const l = s.itemId ? i.find((f) => f.id === s.itemId) ?? null : null, c = s.match?.preset ?? null;
      if (!l || !c) {
        o.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(l, c);
      const d = await this.itemPatches.applyPresetItemPatch(l, c);
      r.push({
        itemId: l.id ?? null,
        itemName: l.name ?? "Ritual sem nome",
        presetId: c.id,
        presetLabel: c.label,
        previousStatus: s.status,
        itemPatch: d
      });
    }
    return {
      actorId: e.id ?? null,
      actorName: e.name ?? "Ator sem nome",
      applied: r,
      skipped: o
    };
  }
}
class RA {
  constructor(e) {
    this.automationRegistry = e;
  }
  automationRegistry;
  analyzeActor(e) {
    const n = Ut(e).map((l) => this.analyzeRitual(l)), r = n.filter(te("upToDate")), o = n.filter(te("available")), i = n.filter(te("outdated")), s = n.filter(te("unsupported"));
    return {
      actorId: e.id ?? null,
      actorName: e.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: o,
      outdated: i,
      unsupported: s,
      canApply: o.length > 0 || i.length > 0
    };
  }
  getApplicableEntries(e) {
    const n = this.analyzeActor(e);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(e) {
    const n = this.automationRegistry.findForItem(e)[0] ?? null, r = wA(e);
    return n ? r ? r.source.type !== "preset" ? It({
      ritual: e,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? It({
      ritual: e,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : It({
      ritual: e,
      status: "outdated",
      match: n,
      flag: r,
      reason: kA(r, n.preset)
    }) : It({
      ritual: e,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : It({
      ritual: e,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function It(t) {
  const e = t.flag?.source, n = e?.type === "preset" ? e : null;
  return {
    itemId: t.ritual.id ?? null,
    itemName: t.ritual.name ?? "Ritual sem nome",
    status: t.status,
    match: t.match,
    preset: t.match ? be(t.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: t.reason
  };
}
function wA(t) {
  const e = t.getFlag(u, "automation");
  return Vn(e) ? e : null;
}
function kA(t, e) {
  return t.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${e.label}.` : t.source.presetId !== e.id ? `Preset aplicado (${t.source.presetId}) difere do preset atual sugerido (${e.id}).` : `Preset ${e.label} aplicado em v${t.source.presetVersion}; versão atual é v${e.version}.`;
}
function te(t) {
  return (e) => e.status === t;
}
class EA {
  constructor(e) {
    this.debugOutput = e;
  }
  debugOutput;
  async createResourceOperationMessage(e) {
    const n = this.createResourceOperationContent(e.transaction), r = Wn(e.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: e.transaction.actor }),
      content: n,
      data: r,
      flags: {
        [u]: {
          resourceTransaction: r
        }
      }
    });
  }
  async createWorkflowSummaryMessage(e, n) {
    const r = this.createWorkflowSummaryContent(e, n), o = ot(e);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: e.sourceActor }),
      content: r,
      data: o,
      flags: {
        [u]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(e) {
    const n = A(e.actorName), r = A(e.resource), o = A(ia(e)), i = A(CA(e));
    return `
      <section class="${u}-card ${u}-resource-card">
        <header class="${u}-card__header">
          <strong>${o}</strong>
          <span>${n}</span>
        </header>
        <div class="${u}-card__body">
          <p><strong>${i}:</strong> ${e.appliedAmount}</p>
          <p><strong>${r}:</strong> ${e.before.value}/${e.before.max} &rarr; ${e.after.value}/${e.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(e, n) {
    const r = A(n.title ?? "Automação"), o = n.message ? `<p>${A(n.message)}</p>` : "", i = A(e.sourceToken?.name ?? e.sourceActor.name ?? "Origem sem nome"), s = A(e.item.name ?? "Item sem nome"), l = e.targets.length > 0 ? e.targets.map((g) => A(g.name)).join(", ") : "Nenhum", c = Object.values(e.rolls).map(
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(IA(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), d = e.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(SA(g.source))})</li>`
    ), f = e.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), y = e.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = e.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(ia(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), $ = e.phases.map((g) => A(g)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${u}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${i}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${d.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${c.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${c.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Dano:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Cura:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${$.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${$}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function IA(t) {
  switch (t) {
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
function ia(t) {
  switch (t.operation) {
    case "spend":
      return `Gasto de ${t.resource}`;
    case "damage":
      return `Dano em ${t.resource}`;
    case "heal":
      return `Cura de ${t.resource}`;
    case "recover":
      return `Recuperação de ${t.resource}`;
  }
}
function CA(t) {
  switch (t.operation) {
    case "spend":
      return `${t.resource} gasto`;
    case "damage":
      return "Dano aplicado";
    case "heal":
      return "Cura aplicada";
    case "recover":
      return "Recuperação aplicada";
  }
}
function SA(t) {
  switch (t) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return t;
  }
}
function A(t) {
  return t.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function LA() {
  const t = new bg(), e = new fh(t), n = new Ja(), r = new Tg(), o = new wg(r), i = new Fg(t), s = new Ug(), l = s.registerMany(
    Sl()
  );
  if (!l.ok)
    throw new Error(l.error.message);
  const c = new Bg(), d = new Og(), f = li(), y = new ri(f), T = new RA(
    s
  ), $ = new $A(
    T,
    c,
    d
  ), g = new _h(), O = new EA(g), wt = new hh(), kt = new dh(
    e,
    o,
    O,
    wt
  ), Et = new gh(kt, wt), w = new iA(
    Et,
    e,
    o,
    n,
    y,
    g
  );
  return w.addStrategy(
    new Ng(
      (j) => w.handleItemUsed(j)
    )
  ), {
    ordem: i,
    resourceAdapter: t,
    ritualAdapter: r,
    ritualCosts: o,
    resources: e,
    damage: n,
    automationRegistry: s,
    automationBinder: c,
    itemPatches: d,
    conditionRegistry: f,
    conditions: y,
    debugOutput: g,
    chatMessages: O,
    workflowHooks: wt,
    automation: kt,
    workflow: Et,
    itemUseIntegration: w,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: $
  };
}
const { ApplicationV2: DA } = foundry.applications.api;
class he extends DA {
  constructor(e, n) {
    super({
      id: `${u}-ritual-preset-manager-${e.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Presets de rituais: ${e.name ?? "Ator"}`
      }
    }), this.actor = e, this.services = n;
  }
  actor;
  services;
  isApplying = !1;
  lastApplicationResult = null;
  static DEFAULT_OPTIONS = {
    id: `${u}-ritual-preset-manager`,
    classes: [u, "paranormal-toolkit-ritual-preset-manager"],
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
      apply: he.onApply,
      cancel: he.onCancel
    }
  };
  async _renderHTML(e, n) {
    const r = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), o = document.createElement("div");
    return o.className = "paranormal-toolkit-preset-manager", o.innerHTML = this.renderContent(r), o;
  }
  _replaceHTML(e, n, r) {
    n.replaceChildren(e);
  }
  renderContent(e) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${M(jn)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${M(e.actorName)}</strong></p>
        </div>
        ${this.renderSummary(e)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${en("Prontos para aplicar", "available", e.available, "fa-solid fa-plus")}
        ${en("Desatualizados", "outdated", e.outdated, "fa-solid fa-rotate")}
        ${en("Automatizados", "upToDate", e.upToDate, "fa-solid fa-check")}
      </div>

      <footer class="paranormal-toolkit-preset-manager__footer">
        <button type="button" data-action="cancel">Cancelar</button>
        <button type="button" data-action="apply" ${e.canApply && !this.isApplying ? "" : "disabled"}>
          ${this.isApplying ? "Aplicando..." : "Aplicar"}
        </button>
      </footer>
    `;
  }
  renderSummary(e) {
    return `
      <div class="paranormal-toolkit-preset-manager__summary" aria-label="Resumo dos presets">
        <span><strong>${e.available.length}</strong> prontos</span>
        <span><strong>${e.outdated.length}</strong> desatualizados</span>
        <span><strong>${e.upToDate.length}</strong> automatizados</span>
      </div>
    `;
  }
  renderLastResult() {
    if (!this.lastApplicationResult) return "";
    const e = this.lastApplicationResult.applied.length, n = this.lastApplicationResult.skipped.length, r = n > 0 ? ` ${n} pendente(s) não puderam ser aplicados.` : "";
    return `
      <div class="paranormal-toolkit-preset-manager__result">
        <strong>Aplicação concluída.</strong>
        <span>${e} preset(s) aplicado(s).${r}</span>
      </div>
    `;
  }
  static async onApply(e) {
    if (e.preventDefault(), !game.user?.isGM) {
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
  static async onCancel(e) {
    e.preventDefault(), await this.close();
  }
}
function en(t, e, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${e}">
      <h3>
        <i class="${r}"></i>
        <span>${M(t)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? PA(n) : NA(e)}
    </section>
  `;
}
function PA(t) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${t.map(vA).join("")}</ol>`;
}
function vA(t) {
  const e = t.preset, n = e ? `${e.label} v${e.version}` : "Sem preset", r = t.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${M(t.appliedPresetId)} v${M(t.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${M(t.itemName)}</strong>
        <span>${M(t.reason)}</span>
        ${r}
      </div>
      <em>${M(n)}</em>
    </li>
  `;
}
function NA(t) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${M({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[t])}</p>`;
}
function M(t) {
  const e = document.createElement("div");
  return e.textContent = t, e.innerHTML;
}
const _e = `${u}.manageRitualPresets`, sa = `__${u}_ritualPresetHeaderControlRegistered`, xA = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function OA(t) {
  const e = globalThis;
  if (!e[sa]) {
    for (const n of xA)
      Hooks.on(n, (r, o) => {
        MA(r, o, t);
      });
    e[sa] = !0, m.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function MA(t, e, n) {
  Array.isArray(e) && BA(t) && (FA(t, n), !e.some((r) => r.action === _e) && e.push({
    action: _e,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), js(t, n);
    }
  }));
}
function FA(t, e) {
  t.options && (t.options.actions ??= {}, !t.options.actions[_e] && (t.options.actions[_e] = (n) => {
    n.preventDefault(), n.stopPropagation(), js(t, e);
  }));
}
function BA(t) {
  if (!game.user?.isGM) return !1;
  const e = Gs(t);
  return e ? e.type === "agent" && Ut(e).length > 0 : !1;
}
function js(t, e) {
  const n = Gs(t);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new he(n, e).render({ force: !0 });
}
function Gs(t) {
  return la(t.actor) ? t.actor : la(t.document) ? t.document : null;
}
function la(t) {
  return !!(t && typeof t == "object" && "items" in t && "type" in t);
}
const Vs = "data-paranormal-toolkit-ritual-roll-config", Vt = "data-paranormal-toolkit-ritual-roll-field", at = "data-paranormal-toolkit-ritual-roll-action", ca = `__${u}_ritualRollConfigBlockRegistered`, UA = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], qA = [
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
function zA() {
  const t = globalThis;
  if (!t[ca]) {
    jA();
    for (const e of UA)
      Hooks.on(e, (...n) => {
        GA(n[0], n[1]);
      });
    t[ca] = !0, m.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function jA() {
  const t = `${u}-ritual-roll-config-inline-style`;
  if (document.getElementById(t)) return;
  const e = document.createElement("style");
  e.id = t, e.textContent = `
.${u}-ritual-roll-config {
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
.${u}-ritual-roll-config__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.${u}-ritual-roll-config__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.${u}-ritual-roll-config__title strong {
  color: rgba(89, 36, 42, 0.96);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}
.${u}-ritual-roll-config__title span {
  font-size: 0.9rem;
  font-weight: 800;
}
.${u}-ritual-roll-config__badge {
  border: 1px solid rgba(89, 36, 42, 0.25);
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.36);
  color: rgba(89, 36, 42, 0.9);
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
}
.${u}-ritual-roll-config__hint,
.${u}-ritual-roll-config__status {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.35;
  opacity: 0.8;
}
.${u}-ritual-roll-config__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.${u}-ritual-roll-config__forms-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.${u}-ritual-roll-config__forms-title {
  color: rgba(24, 19, 18, 0.9);
  font-size: 0.8rem;
  font-weight: 900;
}
.${u}-ritual-roll-config__forms-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.${u}-ritual-roll-config__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: left;
}
.${u}-ritual-roll-config__field input,
.${u}-ritual-roll-config__field select,
.${u}-ritual-roll-config__field textarea {
  width: 100%;
  min-width: 0;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
}
.${u}-ritual-roll-config__field textarea {
  resize: vertical;
}
.${u}-ritual-roll-config__field small {
  color: rgba(89, 36, 42, 0.78);
  font-size: 0.72rem;
  font-weight: 700;
}
.${u}-ritual-roll-config__form-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 7px;
  padding: 7px;
  background: rgba(255, 255, 255, 0.28);
}
.${u}-ritual-roll-config__form-card:has(input:disabled) {
  opacity: 0.72;
}
.${u}-ritual-roll-config__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.${u}-ritual-roll-config__actions button {
  width: auto;
  margin: 0;
}
.${u}-ritual-roll-config [hidden] {
  display: none !important;
}
@media (max-width: 620px) {
  .${u}-ritual-roll-config__fields,
  .${u}-ritual-roll-config__forms-grid {
    grid-template-columns: 1fr;
  }
}
`, document.head.append(e);
}
function GA(t, e) {
  const n = oT(t);
  if (!n || n.type !== "ritual") return;
  const r = sT(e);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  HA(o);
  const i = Ws(n), s = is(n), l = aT(n), c = WA(n, s, i, l);
  JA(c, n, i, l), VA(o, c), Sr(c);
}
function VA(t, e) {
  const n = t.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", e);
    return;
  }
  (t.querySelector(".content-item.scrollable") ?? t).append(e);
}
function HA(t) {
  for (const e of Array.from(t.querySelectorAll(`[${Vs}]`)))
    e.remove();
}
function WA(t, e, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${u}-ritual-roll-config`), o.setAttribute(Vs, t.uuid ?? t.id ?? "ritual");
  const i = document.createElement("header");
  i.classList.add(`${u}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${u}-ritual-roll-config__title`), s.append(ua("strong", "Paranormal Toolkit")), s.append(ua("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${u}-ritual-roll-config__badge`), l.textContent = Ys(e) ? "Configurada" : "Rascunho", i.append(s, l), o.append(i);
  const c = document.createElement("p");
  c.classList.add(`${u}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(c);
  const d = document.createElement("div");
  d.classList.add(`${u}-ritual-roll-config__fields`), d.append(KA(e, r)), d.append(YA(e, r)), d.append(QA(e, r)), o.append(d), o.append(ZA(e, n, r)), o.append(XA(r));
  const f = document.createElement("p");
  return f.classList.add(`${u}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function KA(t, e) {
  const n = Oe("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Vt, "intent"), r.disabled = !e;
  for (const o of ["damage", "healing", "utility"]) {
    const i = document.createElement("option");
    i.value = o, i.textContent = qh(o), i.selected = t.intent === o, r.append(i);
  }
  return n.append(r), n;
}
function YA(t, e) {
  const n = Oe("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Vt, "damageType"), r.disabled = !e;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !t.damageType, r.append(o);
  for (const i of qA) {
    const s = document.createElement("option");
    s.value = i.value, s.textContent = i.label, s.selected = t.damageType === i.value, r.append(s);
  }
  return n.append(r), n;
}
function QA(t, e) {
  const n = Oe("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = t.utilityLabel ?? "Resultado", r.disabled = !e, r.setAttribute(Vt, "utilityLabel"), n.append(r), n;
}
function ZA(t, e, n) {
  const r = document.createElement("section");
  r.classList.add(`${u}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${u}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const i = document.createElement("div");
  return i.classList.add(`${u}-ritual-roll-config__forms-grid`), i.append(nn("base", "Padrão", t.forms.base.formula, !0, n)), i.append(nn("discente", "Discente", t.forms.discente.formula, e.discente, n)), i.append(nn("verdadeiro", "Verdadeiro", t.forms.verdadeiro.formula, e.verdadeiro, n)), r.append(i), r;
}
function nn(t, e, n, r, o) {
  const i = Oe(e);
  i.classList.add(`${u}-ritual-roll-config__form-card`), i.dataset.ritualRollForm = t;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = t === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !o || !r, s.setAttribute(Vt, `formula.${t}`), i.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", i.append(l);
  }
  return i;
}
function XA(t) {
  const e = document.createElement("div");
  e.classList.add(`${u}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !t, n.setAttribute(at, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !t, r.setAttribute(at, "clear"), e.append(n, r), e;
}
function Oe(t) {
  const e = document.createElement("label");
  e.classList.add(`${u}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = t, e.append(n), e;
}
function ua(t, e) {
  const n = document.createElement(t);
  return n.textContent = e, n;
}
function JA(t, e, n, r) {
  Rt(t, "intent")?.addEventListener("change", () => Sr(t)), fa(t, "system.studentForm")?.addEventListener("change", () => da(t, e)), fa(t, "system.trueForm")?.addEventListener("change", () => da(t, e)), t.querySelector(`[${at}="save"]`)?.addEventListener("click", () => {
    r && tT(t, e, n);
  }), t.querySelector(`[${at}="clear"]`)?.addEventListener("click", () => {
    r && eT(t, e);
  });
}
async function tT(t, e, n) {
  const r = t.querySelector(`[${at}="save"]`);
  r?.setAttribute("disabled", "true"), gt(t, "Salvando configuração...");
  try {
    const o = nT(t, n);
    await Bh(e, o), Hs(t, o), gt(t, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), gt(t, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function eT(t, e) {
  const n = t.querySelector(`[${at}="clear"]`);
  n?.setAttribute("disabled", "true"), gt(t, "Limpando configuração...");
  try {
    await Uh(e);
    const r = is(e);
    rT(t, r), Hs(t, r), gt(t, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), gt(t, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Hs(t, e) {
  const n = t.querySelector(`.${u}-ritual-roll-config__badge`);
  n && (n.textContent = Ys(e) ? "Configurada" : "Rascunho");
}
function nT(t, e) {
  return {
    schemaVersion: 1,
    intent: Ks(Rt(t, "intent")?.value),
    damageType: pa(t, "damageType"),
    utilityLabel: pa(t, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: se(t, "formula.base") },
      discente: { formula: se(t, "formula.discente") },
      verdadeiro: { formula: se(t, "formula.verdadeiro") }
    }
  };
}
function rT(t, e) {
  lt(t, "intent", e.intent), lt(t, "damageType", e.damageType ?? ""), lt(t, "utilityLabel", e.utilityLabel ?? "Resultado"), lt(t, "formula.base", e.forms.base.formula), lt(t, "formula.discente", e.forms.discente.formula), lt(t, "formula.verdadeiro", e.forms.verdadeiro.formula), Sr(t);
}
function Sr(t) {
  const e = Ks(Rt(t, "intent")?.value), n = t.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = t.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = e !== "damage";
  for (const o of Array.from(r))
    o.hidden = e !== "utility";
}
function da(t, e) {
  const n = Ws(e);
  ma(t, "discente", n.discente), ma(t, "verdadeiro", n.verdadeiro);
}
function ma(t, e, n) {
  const r = Rt(t, `formula.${e}`);
  if (!r) return;
  const o = !t.querySelector(`[${at}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const i = r.closest(`.${u}-ritual-roll-config__field`), s = i?.querySelector("small");
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
function gt(t, e) {
  const n = t.querySelector(`.${u}-ritual-roll-config__status`);
  n && (n.textContent = e);
}
function Ws(t) {
  const e = iT(t);
  return {
    base: !0,
    discente: e.studentForm === !0,
    verdadeiro: e.trueForm === !0
  };
}
function oT(t) {
  return ga(t.item) ? t.item : ga(t.document) ? t.document : null;
}
function aT(t) {
  return !!(game.user?.isGM || t.isOwner === !0);
}
function iT(t) {
  const e = t.system;
  return lT(e) ? e : {};
}
function fa(t, e) {
  return t.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${e}"]`) ?? null;
}
function Rt(t, e) {
  return t.querySelector(`[${Vt}="${cT(e)}"]`);
}
function se(t, e) {
  return Rt(t, e)?.value.trim() ?? "";
}
function pa(t, e) {
  const n = se(t, e);
  return n.length > 0 ? n : null;
}
function lt(t, e, n) {
  const r = Rt(t, e);
  r && (r.value = n);
}
function Ks(t) {
  return t === "healing" || t === "utility" ? t : "damage";
}
function Ys(t) {
  return Object.values(t.forms).some((e) => e.formula.trim().length > 0);
}
function sT(t) {
  if (t instanceof HTMLElement) return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement) return e[0];
    if (e.element instanceof HTMLElement) return e.element;
  }
  return null;
}
function ga(t) {
  return !!(t && typeof t == "object" && "type" in t && "system" in t && "getFlag" in t && "setFlag" in t);
}
function lT(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function cT(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let rt = null;
Hooks.once("init", () => {
  El(), Ql(), Lc(), ag(), m.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Ur.isSupportedSystem()) {
    m.warn(
      `Sistema não suportado: ${Ur.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  rt = LA(), rt.itemUseIntegration.registerStrategies(), Ec(rt.conditions), cc(rt), Ac(), hc(), dg(), OA(rt), zA(), m.info("Inicializado para o sistema Ordem Paranormal."), m.info(
    `API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${jn} inicializado.`);
});
function uT() {
  if (!rt)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return rt;
}
export {
  uT as getToolkitServices
};
//# sourceMappingURL=main.js.map
