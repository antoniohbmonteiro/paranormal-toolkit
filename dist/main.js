const u = "paranormal-toolkit", Hn = "Paranormal Toolkit", Qs = "ordemparanormal";
class Ut {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function ye(t) {
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
function Ae(t) {
  const e = t.getFlag(u, "automation");
  return e == null ? p({
    reason: "missing-automation",
    message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
  }) : Wn(e) ? _(e.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${t.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: e
  });
}
function Zs(t) {
  return Wn(t.getFlag(u, "automation"));
}
function Wn(t) {
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
  return e.type === "spendResource" && e.actor === "self" && (e.resource === "PE" || e.resource === "PD") && _a(e);
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
  return e.type === "modifyResource" && ba(e.actor) && ul(e.resource) && dl(e.operation) && _a(e) && (e.damageType === void 0 || e.damageType === null || R(e.damageType)) && (e.ignoreResistance === void 0 || typeof e.ignoreResistance == "boolean");
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
  return R(e.id) && ba(e.actor) && R(e.conditionId) && (e.label === void 0 || R(e.label)) && (e.duration === void 0 || e.duration === null || ll(e.duration)) && (e.source === void 0 || R(e.source)) && (e.actionSectionId === void 0 || R(e.actionSectionId)) && (e.actionSectionTitle === void 0 || R(e.actionSectionTitle)) && (e.executedLabel === void 0 || R(e.executedLabel));
}
function ll(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return (e.rounds === void 0 || e.rounds === null || fl(e.rounds)) && (e.expiry === void 0 || e.expiry === null || cl(e.expiry));
}
function cl(t) {
  return t === "turnStart" || t === "turnEnd";
}
function _a(t) {
  return typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0 || R(t.amountFrom);
}
function ba(t) {
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
function Kn(t) {
  const e = t.items;
  if (Array.isArray(e))
    return e;
  if (e && typeof e == "object") {
    const n = e;
    if (Array.isArray(n.contents))
      return n.contents.filter(Pr);
    if (hl(e))
      return Array.from(e).filter(Pr);
  }
  return [];
}
function pl(t) {
  return Kn(t)[0] ?? null;
}
function gl(t) {
  return Kn(t).find(Zs) ?? null;
}
function hl(t) {
  return !!(t && typeof t == "object" && Symbol.iterator in t);
}
function Pr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function qt(t) {
  return Kn(t).filter((e) => e.type === "ritual");
}
function ya(t) {
  return qt(t)[0] ?? null;
}
function _l(t) {
  return {
    listPresets() {
      const e = t.automationRegistry.list().map(ye);
      return m.info("Presets de automação registrados.", e), e;
    },
    findPresetsForFirstRitual() {
      const e = St("Nenhum ator encontrado para buscar presets de ritual.");
      if (!e) return [];
      const n = Wt(e);
      if (!n) return [];
      const r = t.automationRegistry.findForItem(n).map(xr);
      return m.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(e) {
      const n = St("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Wt(n);
      if (!r) return;
      const o = t.automationRegistry.require(e);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await sn(t, r, o.value);
      m.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const e = St("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!e) return;
      const n = Wt(e);
      if (!n) return;
      const r = t.automationRegistry.findForItem(n)[0];
      if (!r) {
        m.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await sn(t, n, r.preset);
      m.info(`Melhor preset aplicado em ${n.name}.`, { match: xr(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return vr(t);
    },
    async applyBestPresetsToActorRituals() {
      return vr(t);
    },
    async clearAutomationFromFirstRitual() {
      const e = St("Nenhum ator encontrado para limpar automação de ritual.");
      if (!e) return;
      const n = Wt(e);
      n && (await t.automationBinder.clear(n), m.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function vr(t) {
  const e = St("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!e) return null;
  const n = qt(e);
  if (n.length === 0)
    return m.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Nr(e);
  const r = Nr(e, n.length);
  for (const o of n) {
    const a = t.automationRegistry.findForItem(o)[0];
    if (!a) {
      r.skipped.push({
        itemId: o.id ?? null,
        itemName: o.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await sn(t, o, a.preset);
    r.applied.push(bl(o, a, s));
  }
  return m.info(`Presets aplicados em rituais de ${e.name ?? "ator sem nome"}.`, r), yl(r), r;
}
async function sn(t, e, n) {
  return await t.automationBinder.applyPreset(e, n), t.itemPatches.applyPresetItemPatch(e, n);
}
function bl(t, e, n) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Ritual sem nome",
    preset: ye(e.preset),
    score: e.score,
    reasons: [...e.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Nr(t, e = 0) {
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
function xr(t) {
  return {
    preset: ye(t.preset),
    score: t.score,
    reasons: [...t.reasons]
  };
}
function St(t) {
  const e = Ut.getSelectedActor();
  return e || (m.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Wt(t) {
  const e = ya(t);
  return e || (m.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function at(t) {
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
    rollRequests: Or(t.rollRequests, Aa),
    rolls: Or(t.rolls, Rl),
    ritualCosts: t.ritualCosts.map((e) => ({ ...e })),
    damageInstances: t.damageInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    healingInstances: t.healingInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    resourceTransactions: t.resourceTransactions.map(Yn),
    flagKeys: Object.keys(t.flags)
  } : null;
}
function Yn(t) {
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
function Aa(t) {
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
    ...Aa(t),
    total: t.total
  };
}
function Or(t, e) {
  return Object.fromEntries(Object.entries(t).map(([n, r]) => [n, e(r)]));
}
function wl(t) {
  return {
    getSelected() {
      return Ut.getSelectedActor();
    },
    logResources() {
      const e = X(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!e) return;
      const n = t.ordem.getActorSnapshot(e);
      m.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && m.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(e) {
      await lt(
        t,
        "Gasto de PE",
        X("Nenhum ator encontrado para gastar PE."),
        (n) => t.resources.spend(n, "PE", e)
      );
    },
    async spendPD(e) {
      await lt(
        t,
        "Gasto de PD",
        X("Nenhum ator encontrado para gastar PD."),
        (n) => t.resources.spend(n, "PD", e)
      );
    },
    async damagePV(e) {
      await lt(
        t,
        "Dano em PV",
        X("Nenhum ator encontrado para causar dano em PV."),
        (n) => t.resources.damage(n, "PV", e)
      );
    },
    async healPV(e) {
      await lt(
        t,
        "Cura de PV",
        X("Nenhum ator encontrado para curar PV."),
        (n) => t.resources.heal(n, "PV", e)
      );
    },
    async damageSAN(e) {
      await lt(
        t,
        "Dano em SAN",
        X("Nenhum ator encontrado para causar dano em SAN."),
        (n) => t.resources.damage(n, "SAN", e)
      );
    },
    async recoverSAN(e) {
      await lt(
        t,
        "Recuperação de SAN",
        X("Nenhum ator encontrado para recuperar SAN."),
        (n) => t.resources.recover(n, "SAN", e)
      );
    }
  };
}
async function lt(t, e, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    kl(o.error);
    return;
  }
  const a = o.value;
  try {
    await t.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    m.error(`${e} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  m.info(`${e} realizado:`, Yn(a));
}
function X(t) {
  const e = Ut.getSelectedActor();
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
  Kt(F.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Kt(F.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Kt(F.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Kt(F.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function ln() {
  return {
    enabled: Yt(F.enabled),
    console: Yt(F.console),
    ui: Yt(F.ui),
    chat: Yt(F.chat)
  };
}
async function V(t, e) {
  await game.settings.set(u, F[t], e);
}
function Kt(t, e) {
  game.settings.register(u, t, {
    name: e.name,
    hint: e.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: e.default
  });
}
function Yt(t) {
  return game.settings.get(u, t) === !0;
}
function Il() {
  return {
    status() {
      return ln();
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
const Ta = "ritual.costOnly", $a = "ritual.simpleHealing", Cl = "ritual.eletrocussao", Ra = "ritual.simpleDamage", wa = "generic.simpleHealing", ka = `
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
    id: Ta,
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
    id: $a,
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
    automation: Ea(),
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
    id: Ra,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Qn()
  };
}
function Nl() {
  return {
    id: wa,
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
function Ea(t = "2d8+2") {
  return Ia(
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
    ...Qn("3d6", {
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
function Qn(t = "1d8", e = {}) {
  const n = e.label ?? "Ritual de dano simples", r = e.title ?? "Ritual de dano simples", o = e.damageType ?? "generic", a = e.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Ia(
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
          message: a
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
    descriptionHtml: ka,
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
    descriptionHtml: ka,
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
function Ia(t, e, n) {
  return {
    ...t,
    steps: t.steps.map((r) => r.type !== "rollFormula" || r.id !== e ? r : {
      ...r,
      formula: n
    })
  };
}
function Zn() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: ut(e.id),
    actorId: ut(e.actor?.id),
    sceneId: ut(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  }));
}
function Ca() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null;
  return {
    tokenId: ut(t.id),
    actorId: ut(e?.id),
    sceneId: ut(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function ut(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function Fl(t) {
  return {
    logFirstRitualCost() {
      const e = J("Nenhum ator encontrado para consultar custo de ritual.");
      if (!e) return;
      const n = tt(e);
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
      const r = J("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = tt(r);
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
      const e = J("Nenhum ator encontrado para limpar custo customizado.");
      if (!e) return;
      const n = tt(e);
      n && (await n.unsetFlag(u, "ritual.cost"), m.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const e = J("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!e) return;
      const n = tt(e);
      if (!n) return;
      const r = t.automationRegistry.require(Ta);
      if (!r.ok) {
        m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(n, r.value), m.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(e = "2d8+2") {
      const n = J("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = tt(n);
      if (!r) return;
      if (!Mr(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = t.automationRegistry.require($a);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(r, o.value, {
        definition: Ea(e)
      }), m.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(e = "1d8") {
      const n = J("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = tt(n);
      if (!r) return;
      if (!Mr(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = t.automationRegistry.require(Ra);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(r, o.value, {
        definition: Qn(e)
      }), m.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const e = J("Nenhum ator encontrado para executar automação de ritual.");
      if (!e) return;
      const n = tt(e);
      n && await Bl(t, e, n);
    }
  };
}
async function Bl(t, e, n) {
  const r = Ae(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(r.value, {
    sourceActor: e,
    sourceToken: Ca(),
    item: n,
    targets: Zn()
  });
  if (!o.ok) {
    Ul(o.error);
    return;
  }
  m.info("Automação de ritual executada com sucesso.", at(o.value.context));
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
function J(t) {
  const e = Ut.getSelectedActor();
  return e || (m.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function tt(t) {
  const e = ya(t);
  return e || (m.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ql(t, e) {
  return Number.isInteger(t) && t > 0 && (e === "PE" || e === "PD");
}
function Mr(t) {
  return typeof t == "string" && t.trim().length > 0;
}
const zl = ["disabled", "ask", "automatic"], jl = ["buttons", "confirm"], Sa = "ask";
function Gl(t) {
  return typeof t == "string" && zl.includes(t);
}
function Vl(t) {
  return typeof t == "string" && jl.includes(t);
}
function Hl(t) {
  return Gl(t) ? t : Vl(t) ? "ask" : Sa;
}
const Wl = ["keep", "replace"], Kl = ["manual", "assisted"], La = "keep", Da = "assisted", Yl = !0, C = {
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
    default: Sa
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
    default: La
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
    default: Da
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
function Fr() {
  const t = Hl(game.settings.get(u, C.executionMode)), e = va(game.settings.get(u, C.systemCardMode)), n = Na(game.settings.get(u, C.damageResolutionMode));
  return {
    executionMode: t,
    systemCardMode: e,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: Pa()
  };
}
function Zl() {
  return va(game.settings.get(u, C.systemCardMode));
}
function Xl() {
  return Na(game.settings.get(u, C.damageResolutionMode));
}
function Pa() {
  return game.settings.get(u, C.ritualCastingCheckEnabled) === !0;
}
async function et(t) {
  await game.settings.set(u, C.executionMode, t);
}
function va(t) {
  return Wl.includes(t) ? t : La;
}
function Na(t) {
  return Kl.includes(t) ? t : Da;
}
function Jl(t) {
  return {
    status() {
      return t.itemUseIntegration.status();
    },
    async enable() {
      await et("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await et("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(e) {
      await et(e), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${e}.`);
    },
    async ask() {
      await et("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await et("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await et("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await et("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
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
      const e = Ue("Nenhum ator encontrado para executar automação.");
      if (!e) return;
      const n = gl(e);
      if (!n) {
        m.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Br(t, e, n);
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
      const r = rc(n) ?? Ue("Nenhum ator encontrado para executar automação do item.");
      r && await Br(t, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const e = Ue("Nenhum ator encontrado para configurar automação de teste.");
      if (!e) return;
      const n = pl(e);
      if (!n) {
        m.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = t.automationRegistry.require(wa);
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
async function Br(t, e, n) {
  const r = Ae(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(r.value, {
    sourceActor: e,
    sourceToken: Ca(),
    item: n,
    targets: Zn()
  });
  if (!o.ok) {
    nc(o.error);
    return;
  }
  m.info("Automação executada com sucesso.", at(o.value.context));
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
function Ue(t) {
  const e = Ut.getSelectedActor();
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
  const e = wl(t), n = _l(t), r = Fl(t), o = ec(t), a = Il(), s = Jl(t);
  return {
    actor: e,
    automation: n,
    ritual: r,
    workflow: o,
    output: a,
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
      const r = Ur();
      if (r.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const o = await Promise.all(
        r.map(
          (a) => t.applyCondition({
            actor: a,
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
      const n = Ur();
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
function Ur() {
  const t = canvas.tokens?.controlled ?? [], e = /* @__PURE__ */ new Map();
  for (const n of t) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${e.size}`;
    e.set(a, r);
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
class qr {
  static isSupportedSystem() {
    return game.system.id === Qs;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function uc() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: dt(e.id),
    actorId: dt(e.actor?.id),
    sceneId: dt(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome"
  }));
}
function xa() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null, n = t.name ?? e?.name ?? "Origem sem nome";
  return {
    tokenId: dt(t.id),
    actorId: dt(e?.id),
    sceneId: dt(t.scene?.id),
    name: n
  };
}
function dc(t, e = xa()) {
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
function zr(t) {
  if (!t || typeof t != "object") return !1;
  const e = foundry.utils.getProperty(t, `flags.${u}`), n = foundry.utils.getProperty(t, `_source.flags.${u}`);
  return e !== void 0 || n !== void 0;
}
function jr(t) {
  const e = foundry.utils.getProperty(t, "speaker.actor"), n = foundry.utils.getProperty(t, "_source.speaker.actor");
  return cn(e) || cn(n);
}
function pc(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && e.kind === "chat-targets" && (e.source === null || typeof e.source == "object") && Array.isArray(e.targets);
}
function gc(t) {
  return !!(t && typeof t == "object" && "getFlag" in t);
}
function dt(t) {
  return cn(t) ? t : null;
}
function cn(t) {
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
  return n.textContent = "Paranormal Toolkit", e.append(n), t.source && e.append(Gr("Origem", t.source.name)), e.append(Gr("Alvo", t.targets.map((r) => r.name).join(", "))), e;
}
function Gr(t, e) {
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
    if (!Tc(r) || !$c(t) || zr(t) || zr(e)) return;
    const o = uc();
    if (o.length === 0 || !jr(t) && !jr(e)) return;
    const a = xa();
    t.updateSource({
      [fc()]: dc(o, a)
    }), m.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Tc(t) {
  const e = game.user?.id;
  return !e || typeof t != "string" ? !0 : t === e;
}
function $c(t) {
  return !!(t && typeof t == "object" && "updateSource" in t);
}
let Vr = !1, qe = !1, ze = !1, Qt = null;
const Rc = 1e3, wc = 750, kc = 1e3;
function Ec(t) {
  Vr || (Hooks.on("combatTurnChange", (e) => {
    Cc(t, Hr(e));
  }), Hooks.on("deleteCombat", (e) => {
    Sc(t, Hr(e));
  }), Vr = !0, Ic(t));
}
function Ic(t) {
  Te() && (qe || (qe = !0, globalThis.setTimeout(() => {
    qe = !1, Xn(t, "ready");
  }, Rc)));
}
function Cc(t, e) {
  Te() && e && (Qt && globalThis.clearTimeout(Qt), Qt = globalThis.setTimeout(() => {
    Qt = null, Xn(t, "combat-turn-change", e);
  }, wc));
}
function Sc(t, e) {
  Te() && e && (ze || (ze = !0, globalThis.setTimeout(() => {
    ze = !1, Xn(t, "combat-deleted", e);
  }, kc)));
}
async function Xn(t, e, n) {
  if (Te())
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
function Te() {
  return game.user?.isGM === !0;
}
function Hr(t) {
  if (!t || typeof t != "object") return null;
  const e = t.id;
  return typeof e == "string" && e.length > 0 ? e : null;
}
const Oa = {
  enabled: "dice.animations.enabled"
};
function Lc() {
  game.settings.register(u, Oa.enabled, {
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
    enabled: game.settings.get(u, Oa.enabled) === !0
  };
}
const $e = "chatCard", Wr = "data-paranormal-toolkit-prompt-id", i = `${u}-item-use-prompt`, Pc = `.${i}__title`, Ma = `.${i}__header`, vc = `.${i}__roll-card`, Nc = `.${i}__roll-meta`, xc = `.${i}__roll-meta-pill`, Jn = `.${i}__resistance`, Oc = `.${i}__resistance-header`, Fa = `.${i}__resistance-description`, Re = `.${i}__resistance-roll-button`, Ba = `.${i}__resistance-roll-result`, Kr = `${i}__resistance-content`, Ua = `.${i}__workflow-section`, qa = `.${i}__workflow-roll`, tr = `${i}__workflow-roll--dice-open`, er = `.${i}__workflow-roll-formula`, nr = `${i}__workflow-roll-formula--toggle`, we = `.${i}__workflow-dice-tray`, Mc = `.${i}__roll-detail-toggle`, Fc = `.${i}__roll-detail-list`, Bc = `.${i}__ritual-element-badge`, Uc = `.${i}__ritual-metadata`, qc = "casting-backlash", zc = "data-paranormal-toolkit-action-section", jc = "data-paranormal-toolkit-prompt-id", Gc = "data-paranormal-toolkit-pending-id", Yr = "data-paranormal-toolkit-casting-backlash-enhanced", Qr = `.${i}`, Vc = `.${i}__workflow-section--casting`, Hc = `.${i}__workflow-section-header`, Wc = `.${i}__workflow-notes`, Kc = `[${zc}="${qc}"]`, Zr = `${i}__workflow-section-title-row`, Yc = `${i}__workflow-section-header--casting-backlash`, za = `${i}__casting-backlash-button`;
function Qc(t) {
  for (const e of Zc(t))
    Xc(e), ru(e);
}
function Zc(t) {
  const e = /* @__PURE__ */ new Set();
  t instanceof HTMLElement && t.matches(Qr) && e.add(t);
  for (const n of t.querySelectorAll(Qr))
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
  const e = t.querySelector(`:scope > .${Zr}`);
  if (e) return e;
  const n = document.createElement("div");
  n.classList.add(Zr);
  const r = Array.from(t.childNodes);
  t.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(za) || n.append(o));
  return n;
}
function eu(t) {
  if (t.getAttribute(Yr) === "true") return;
  const e = t.textContent?.trim() || "Aplicar dano na SAN", n = nu(e, t.disabled);
  t.classList.add(za), t.setAttribute(Yr, "true"), t.setAttribute("title", n), t.setAttribute("aria-label", n);
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
  for (const e of Array.from(t.querySelectorAll(Ua)))
    for (const n of Array.from(e.querySelectorAll(`${Mc}, ${Fc}`)))
      n.remove();
}
const Lt = "data-paranormal-toolkit-prompt-id", au = "data-paranormal-toolkit-resistance-roll-result", iu = "Conjuração DT";
function ja(t) {
  const e = t.querySelector(Re)?.getAttribute(au), n = Ot(e);
  if (n !== null) return n;
  const r = t.querySelector(Ba)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Ot(o?.[1] ?? null);
}
function rr(t) {
  const e = du(t), n = lu(e);
  if (n !== null) return n;
  const r = cu(e);
  return r !== null ? r : uu(t);
}
function su(t) {
  const e = t.getAttribute(Lt);
  if (!e) return null;
  const n = Va(t), r = Ha(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => ke(l) ? l.pendingId === e : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function K(t) {
  return t?.trim().toLocaleLowerCase() ?? "";
}
function Ga(t) {
  return K(t).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function lu(t) {
  const e = fu(t);
  return e.length === 0 ? null : Ot(pu(e, iu));
}
function cu(t) {
  const e = typeof t?.actorId == "string" ? t.actorId : null;
  if (!e) return null;
  const r = game.actors?.get?.(e);
  return !r || typeof r != "object" ? null : Xr(r, ["system", "ritual", "DT"]) ?? Xr(r, ["system", "ritual", "dt"]);
}
function uu(t) {
  const e = Array.from(t.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!e) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(e);
  return Ot(n?.[1] ?? null);
}
function du(t) {
  const e = mu(t);
  if (!e) return null;
  const n = Va(t), r = Ha(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => ke(a) ? a.pendingId === e : !1) ?? null;
}
function mu(t) {
  return (t.closest(`[${Lt}]`) ?? t.querySelector(`[${Lt}]`) ?? t.parentElement?.querySelector(`[${Lt}]`) ?? null)?.getAttribute(Lt) ?? null;
}
function Va(t) {
  const n = t.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return gu(o) ? o : null;
}
function Ha(t) {
  const e = t?.getFlag?.(u, $e);
  return ke(e) ? e : null;
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
function Xr(t, e) {
  let n = t;
  for (const r of e) {
    if (!ke(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Ot(typeof n == "string" ? n : null);
}
function Ot(t) {
  if (!t) return null;
  const e = Number(t);
  return Number.isFinite(e) ? Math.trunc(e) : null;
}
function gu(t) {
  return !!(t && typeof t == "object" && typeof t.getFlag == "function");
}
function ke(t) {
  return !!(t && typeof t == "object");
}
const hu = `.${i}__actions`, or = `.${i}__actions-title`, ce = `.${i}__button`, _u = "data-paranormal-toolkit-action-section", bu = `${i}__button--executed`, yu = "data-paranormal-toolkit-executed-label";
function Wa(t) {
  return K(t.querySelector(or)?.textContent);
}
function Au(t, e) {
  const n = t.querySelector(or);
  n && (n.textContent = e);
}
function Ee(t, e) {
  const n = K(e);
  return Array.from(t.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const o = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return K(o) === n;
  }) ?? null;
}
function ar(t, e) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, e), n.setAttribute("aria-hidden", "true"), n.textContent = t, n;
}
function zt(t) {
  const e = document.createElement("span");
  return e.classList.add(`${i}__button-label`), e.textContent = t, e;
}
const Tu = "data-paranormal-toolkit-damage-resolution-state", Jr = "data-paranormal-toolkit-damage-icon-enhanced", $u = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function Ru(t, e) {
  e.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Au(e, "Aplicar dano"), wu(t, e);
}
function wu(t, e) {
  const n = Array.from(e.querySelectorAll(ce)), r = to(n, "normal"), o = to(n, "half");
  if (!r || !o) {
    e.classList.add(`${i}__actions--compact`);
    return;
  }
  eo(r, "normal"), eo(o, "half");
  const a = ku();
  if (e.classList.toggle(`${i}__actions--assisted`, a === "assisted"), e.classList.toggle(`${i}__actions--manual`, a !== "assisted"), a !== "assisted") {
    H(r, !0), H(o, !0), Zt(e, "manual", null);
    return;
  }
  const s = ja(t), l = rr(t);
  if (l === null) {
    H(r, !0), H(o, !0), Zt(e, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (s === null) {
    H(r, !0), H(o, !1), Zt(e, "pending", null);
    return;
  }
  const c = s >= l;
  H(r, !c), H(o, c), Zt(
    e,
    c ? "resisted" : "failed",
    c ? `Resistiu: ${s} vs DT ${l}.` : `Falhou: ${s} vs DT ${l}.`
  );
}
function to(t, e) {
  const n = $u[e];
  return t.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function eo(t, e) {
  if (t.getAttribute(Jr) === "true") return;
  const n = t.textContent?.trim() ?? "";
  if (!n || n.startsWith("✓")) return;
  const r = document.createElement("i");
  r.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), r.setAttribute("aria-hidden", "true"), t.classList.add(
    `${i}__button--damage-resolution-action`,
    `${i}__button--damage-resolution-${e}`
  ), t.setAttribute(Jr, "true"), t.setAttribute("aria-label", n), t.replaceChildren(r, zt(n));
}
function H(t, e) {
  t.hidden = !e, t.classList.toggle(`${i}__button--damage-resolution-selected`, e);
}
function Zt(t, e, n) {
  t.setAttribute(Tu, e);
  const r = t.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${i}__damage-resolution-summary`), o.textContent = n, r || t.querySelector(or)?.after(o);
}
function ku() {
  try {
    return Xl();
  } catch {
    return "assisted";
  }
}
const Mt = "data-paranormal-toolkit-effect-icon-enhanced", _t = "data-paranormal-toolkit-effect-action-compacted", Ie = "data-paranormal-toolkit-effect-resistance-gate", ir = "data-paranormal-toolkit-effect-section", sr = "data-paranormal-toolkit-effect-label";
function Eu(t) {
  return t.querySelector(`[${ir}="true"]`);
}
function Iu(t) {
  const e = Su(t);
  if (!e) return t.existingSection;
  const n = t.existingSection ?? Lu(), r = Bu(n, t.sourceActions, e);
  return r && n.setAttribute(sr, r), Du(n, e, r), Mu(t.rollCard, n, t.after ?? t.fallbackAfter), Fu(t.sourceActions, n), n;
}
function Cu(t, e) {
  const n = e.querySelector(ce);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (Ya(n, r)) {
    qu(n);
    return;
  }
  const o = Za(e, n, r);
  if (!zu(t, o)) {
    Xa(n);
    return;
  }
  const a = rr(t), s = ja(t);
  if (a === null || s === null) {
    ju(n);
    return;
  }
  if (s >= a) {
    Gu(n);
    return;
  }
  Vu(n, o);
}
function Su(t) {
  return t.sourceActions?.querySelector(ce) ?? t.existingSection?.querySelector(ce) ?? null;
}
function Lu() {
  const t = document.createElement("section");
  return t.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), t.setAttribute(ir, "true"), t;
}
function Du(t, e, n) {
  t.setAttribute(ir, "true"), t.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), t.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = Pu(t), o = vu(r);
  o.textContent = "Efeito";
  const a = Nu(t, r), s = xu(a);
  s.textContent = Hu(n ?? Za(t, e, e.textContent?.trim() ?? ""));
  const l = Ou(a);
  e.parentElement !== l && l.append(e);
  const c = e.textContent?.trim() ?? "";
  !Ya(e, c) && !Uu(e, c) && Qa(e, n ?? c);
}
function Pu(t) {
  const e = t.querySelector(`:scope > .${i}__workflow-section-header`);
  if (e) return e;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), t.prepend(n), n;
}
function vu(t) {
  const e = t.querySelector("strong");
  if (e) return e;
  const n = document.createElement("strong");
  return t.append(n), n;
}
function Nu(t, e) {
  const n = t.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), e.after(r), r;
}
function xu(t) {
  const e = t.querySelector(`:scope > .${i}__effect-section-label`);
  if (e) return e;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), t.prepend(n), n;
}
function Ou(t) {
  const e = t.querySelector(`:scope > .${i}__effect-section-action`);
  if (e) return e;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), t.append(n), n;
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
  const r = t.getAttribute(sr);
  if (r && r.trim().length > 0) return r.trim();
  const o = e?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return o || Ka(n, n.textContent?.trim() ?? "");
}
function Ka(t, e) {
  const n = t.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && K(n) !== "efeito aplicado") return n;
  const r = su(t);
  if (r) return r;
  const o = e.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && K(o) !== "aplicado" ? o : null;
}
function Ya(t, e) {
  return t.classList.contains(bu) || K(e).includes("aplicado");
}
function Uu(t, e) {
  const n = t.getAttribute(Ie);
  if (n === "pending" || n === "resisted") return !0;
  const r = Ga(e);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function Qa(t, e) {
  t.getAttribute(_t) === "true" && t.getAttribute(Mt) === "true" || (t.disabled = !1, t.classList.add(`${i}__button--effect-resolution-action`), t.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), t.setAttribute(_t, "true"), t.setAttribute(Mt, "true"), t.setAttribute(yu, "✓ Aplicado"), t.setAttribute("aria-label", `Aplicar ${e}`), t.replaceChildren(
    ar("✦", `${i}__button-icon--effect`),
    zt("Aplicar")
  ));
}
function qu(t) {
  t.getAttribute(_t) === "true" && K(t.textContent) === "✓ aplicado" || (t.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), t.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), t.setAttribute(_t, "true"), t.setAttribute(Mt, "true"), t.setAttribute("aria-label", "Efeito aplicado"), t.replaceChildren(
    ar("✓", `${i}__button-icon--effect-applied`),
    zt("Aplicado")
  ));
}
function Za(t, e, n) {
  const r = t.getAttribute(sr) ?? t.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Ka(e, n) ?? n;
}
function zu(t, e) {
  if (!t.querySelector(Jn)) return !1;
  const n = Ga(e);
  return n.includes("vulneravel") || n.includes("vulnerable");
}
function ju(t) {
  t.disabled = !0, t.removeAttribute(_t), t.removeAttribute(Mt), t.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), t.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), t.setAttribute(Ie, "pending"), t.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), t.replaceChildren(zt("Role resistência"));
}
function Gu(t) {
  t.disabled = !0, t.removeAttribute(_t), t.removeAttribute(Mt), t.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), t.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), t.setAttribute(Ie, "resisted"), t.setAttribute("aria-label", "O alvo resistiu ao efeito"), t.replaceChildren(
    ar("✓", `${i}__button-icon--effect-resisted`),
    zt("Resistiu")
  );
}
function Vu(t, e) {
  Xa(t), Qa(t, e);
}
function Xa(t) {
  t.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), t.removeAttribute(Ie);
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
function Ja(t) {
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
class ti {
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
          a.call(n, y.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: f.ignoreResistance === !0,
            nonLethal: f.nonLethal === !0
          })
        );
        for (const x of ed($.conditions))
          l.add(x);
        const g = td($.newPV);
        g !== null && (c = g), s.push({
          id: y.id,
          label: f.label ?? Ja(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: no($.finalDamage, y.amount),
          blocked: no($.blocked, 0),
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
    label: e.label ?? Ja(n),
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
function no(t, e) {
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
async function ei(t, e) {
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
function jt(t) {
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
  return ro(t) ? t : Array.isArray(t) ? t.find(ro) ?? null : null;
}
function ro(t) {
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
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
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
    return oo(null);
  const r = t?.anchor ?? ni(e);
  if (!r)
    return {
      ...oo(n),
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
function ni(t) {
  const e = hd();
  if (!e?.id || !ri(e.round)) return null;
  const n = fd(e), r = ud(t, n) ?? md(e), o = W(r?.id), a = bd(r?.initiative), s = dd(e, r, n);
  return {
    mode: "combatantTurn",
    combatId: e.id,
    combatantId: o,
    round: e.round,
    turn: s,
    initiative: a,
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
function oo(t) {
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
  const r = W(e?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return yd(t.turn) ? t.turn : null;
}
function md(t) {
  return ne(t.combatant) ? t.combatant : null;
}
function fd(t) {
  const e = t.combatants;
  if (Array.isArray(e)) return e.filter(ne);
  if (e && typeof e == "object") {
    const n = e.contents;
    if (Array.isArray(n)) return n.filter(ne);
    const r = e.values;
    if (typeof r == "function")
      return Array.from(r.call(e)).filter(ne);
  }
  return [];
}
function pd(t) {
  return W(t.actor?.id) ?? W(t.actorId) ?? W(t.token?.actor?.id) ?? W(t.token?.actorId) ?? W(t.document?.actor?.id) ?? W(t.document?.actorId);
}
function gd(t) {
  return ri(t) ? Math.trunc(t) : null;
}
function hd() {
  return game.combat ?? null;
}
function _d() {
  const t = game.time?.worldTime;
  return typeof t == "number" && Number.isFinite(t) ? t : 0;
}
function ne(t) {
  return !!(t && typeof t == "object");
}
function W(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function bd(t) {
  return typeof t == "number" && Number.isFinite(t) ? t : null;
}
function ri(t) {
  return typeof t == "number" && Number.isInteger(t) && t > 0;
}
function yd(t) {
  return typeof t == "number" && Number.isInteger(t) && t >= 0;
}
class oi {
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
    const o = n.value, a = ld(e.duration, r), s = Ad(o, e, a), c = e.refreshExisting ?? !0 ? Ld(r, o.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), _(ao(r, o, c.id ?? null, !1, !0, a));
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
      return _(ao(r, o, f, !0, !1, a));
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
    const r = this.resolveCanonicalConditionId(e.conditionId), o = ii(n, r);
    let a = 0;
    try {
      for (const s of o)
        await io(n, s) === "deleted" && (a += 1);
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
      removed: a
    });
  }
  resolveCanonicalConditionId(e) {
    const n = this.registry.get(e);
    return n.ok ? n.value.id : e;
  }
  async cleanupExpiredConditions(e = {}) {
    const n = vd(), r = [];
    let o = 0, a = 0;
    for (const s of n) {
      const l = lr(s);
      o += l.length;
      for (const c of l) {
        if (!Rd(c, e)) continue;
        const d = ai(c);
        try {
          await io(s, c) === "deleted" && (a += 1);
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
      removedEffects: a,
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
function ao(t, e, n, r, o, a) {
  return {
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    conditionId: e.id,
    conditionLabel: e.label,
    effectId: n,
    created: r,
    refreshed: o,
    requestedRounds: a.requestedRounds,
    combatDurationApplied: a.combatDurationApplied,
    warning: a.warning
  };
}
function Rd(t, e) {
  const n = ai(t);
  if (!n.conditionId || !wd(n)) return !1;
  if (e.removeAllForCombat === !0)
    return !!(e.combatId && n.combatId === e.combatId);
  const r = qd();
  return n.durationMode === "combatantTurn" || kd(n) ? Id(n, r) : Ed(t) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !D(n.startRound) || !D(n.requestedRounds) || !D(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function wd(t) {
  return t.deleteOnExpire || t.expiresWithCombat ? !0 : t.combatDurationApplied && D(t.requestedRounds);
}
function kd(t) {
  return !!(t.combatDurationApplied && D(t.requestedRounds) && D(t.startRound) && (t.startCombatantId || ue(t.startTurn)));
}
function Ed(t) {
  const e = t.duration;
  if (!e || typeof e != "object") return !1;
  if (e.expired === !0) return !0;
  const n = e.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Id(t, e) {
  if (!e?.id || t.combatId && t.combatId !== e.id || !D(t.startRound) || !D(t.requestedRounds) || !D(e.round)) return !1;
  const n = t.startRound + t.requestedRounds;
  if (e.round < n) return !1;
  if (e.round > n) return !0;
  const r = Cd(e);
  return t.startCombatantId ? r === t.startCombatantId : ue(t.startTurn) && ue(e.turn) ? e.turn === t.startTurn : !1;
}
function Cd(t) {
  return mt(t.combatant?.id);
}
function ai(t) {
  const e = t.duration && typeof t.duration == "object" ? t.duration : {}, n = t.start && typeof t.start == "object" ? t.start : {};
  return {
    conditionId: re(t, "conditionId"),
    requestedRounds: so(t, "requestedRounds") ?? Dt(e.value) ?? Dt(e.rounds),
    combatDurationApplied: je(t, "combatDurationApplied"),
    combatId: re(t, "combatId") ?? mt(n.combat) ?? mt(e.combat),
    startCombatantId: re(t, "startCombatantId") ?? mt(n.combatant),
    startInitiative: Md(t, "startInitiative") ?? si(n.initiative),
    startRound: so(t, "startRound") ?? Dt(n.round) ?? Dt(e.startRound),
    startTurn: Od(t, "startTurn") ?? un(n.turn) ?? un(e.startTurn),
    expiryEvent: Fd(t, "expiryEvent") ?? li(e.expiry),
    durationMode: Bd(t, "durationMode"),
    deleteOnExpire: je(t, "deleteOnExpire"),
    expiresWithCombat: je(t, "expiresWithCombat")
  };
}
function Sd(t) {
  return !!(t && typeof t.createEmbeddedDocuments == "function");
}
function Ld(t, e) {
  return ii(t, e)[0] ?? null;
}
function ii(t, e) {
  return lr(t).filter((n) => xd(n) === e);
}
async function io(t, e) {
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
  return lr(t).find((n) => n.id === e) ?? null;
}
function Pd(t) {
  const e = t instanceof Error ? t.message : String(t);
  return e.includes("does not exist in the EmbeddedCollectionDelta collection") || e.includes("does not exist in the EmbeddedCollection collection");
}
function vd() {
  const t = /* @__PURE__ */ new Map(), e = game.actors;
  if (Array.isArray(e?.contents))
    for (const n of e.contents)
      Xt(t, n);
  typeof e?.forEach == "function" && e.forEach((n) => {
    Xt(t, n);
  });
  for (const n of Nd())
    Xt(t, n.actor), Xt(t, n.document?.actor);
  return Array.from(t.values());
}
function Xt(t, e) {
  if (!Ud(e)) return;
  const r = mt(e.uuid) ?? e.id ?? e.name ?? `actor-${t.size}`;
  t.set(r, e);
}
function Nd() {
  const t = canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function lr(t) {
  const e = t.effects;
  return e ? Array.isArray(e) ? e : Array.isArray(e.contents) ? e.contents : typeof e.filter == "function" ? e.filter(() => !0) : [] : [];
}
function xd(t) {
  return re(t, "conditionId");
}
function re(t, e) {
  return mt(st(t, e));
}
function so(t, e) {
  return Dt(st(t, e));
}
function Od(t, e) {
  return un(st(t, e));
}
function Md(t, e) {
  return si(st(t, e));
}
function Fd(t, e) {
  return li(st(t, e));
}
function Bd(t, e) {
  const n = st(t, e);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function je(t, e) {
  return st(t, e) === !0;
}
function st(t, e) {
  const n = t.getFlag?.(u, e);
  if (n !== void 0) return n;
  const r = t.flags;
  if (!r || typeof r != "object") return;
  const o = r[u];
  if (!(!o || typeof o != "object"))
    return o[e];
}
function mt(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function Dt(t) {
  return D(t) ? Math.trunc(t) : null;
}
function un(t) {
  return ue(t) ? Math.trunc(t) : null;
}
function si(t) {
  return typeof t == "number" && Number.isFinite(t) ? t : null;
}
function li(t) {
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
function D(t) {
  return typeof t == "number" && Number.isInteger(t) && t > 0;
}
function ue(t) {
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
    return Array.from(this.definitions.values()).map(lo);
  }
  get(e) {
    const n = this.lookup.get(co(e)), r = n ? this.definitions.get(n) : null;
    return r ? _(lo(r)) : p({
      reason: "condition-not-found",
      conditionId: e,
      message: `Condição não registrada no Paranormal Toolkit: ${e}.`
    });
  }
  registerLookup(e, n) {
    const r = co(e);
    r && this.lookup.set(r, n);
  }
}
function ci() {
  return new Im(Em);
}
function lo(t) {
  return {
    ...t,
    aliases: t.aliases ? [...t.aliases] : void 0,
    changes: t.changes.map((e) => ({ ...e }))
  };
}
function co(t) {
  return t.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Cm(t) {
  const e = document.createElement("div");
  e.classList.add(`${i}__workflow-roll`, ...t.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = t.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = t.total === null ? "—" : String(t.total), e.append(n, r);
  const o = Lm(t.formula, t.diceBreakdown ?? null);
  return o && e.append(o), e;
}
function Sm(t) {
  const e = Array.from(t?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return e.length > 0 ? `(${e.join(", ")})` : null;
}
function Lm(t, e) {
  const n = Dm(e);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const o of Pm(n, t)) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-die`), o.active || a.classList.add(`${i}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function Dm(t) {
  return t ? (/\(([^)]+)\)/u.exec(t)?.[1] ?? t).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Pm(t, e) {
  if (t.length <= 1) return t.map((r) => ({ value: r, active: !0 }));
  const n = e.toLowerCase();
  return n.includes("kh") ? uo(t, "highest") : n.includes("kl") ? uo(t, "lowest") : t.map((r) => ({ value: r, active: !0 }));
}
function uo(t, e) {
  const n = e === "highest" ? Math.max(...t) : Math.min(...t);
  let r = !1;
  return t.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
const Jt = "data-paranormal-toolkit-prompt-id", di = "multiTargetResistanceResults", mi = "multiTargetDamageApplications", fi = "multiTargetEffectApplications";
function vm(t) {
  const e = /* @__PURE__ */ new Map(), r = Ce(t)?.[di];
  if (!v(r)) return e;
  for (const [o, a] of Object.entries(r))
    Um(a) && a.targetId === o && e.set(o, a);
  return e;
}
async function Nm(t, e) {
  await cr(t, di, e.targetId, e);
}
function xm(t) {
  const e = /* @__PURE__ */ new Map(), r = Ce(t)?.[mi];
  if (!v(r)) return e;
  for (const [o, a] of Object.entries(r))
    qm(a) && a.targetId === o && e.set(o, a);
  return e;
}
async function Om(t, e) {
  await cr(
    t,
    mi,
    e.targetId,
    e
  );
}
function Mm(t) {
  const e = /* @__PURE__ */ new Map(), r = Ce(t)?.[fi];
  if (!v(r)) return e;
  for (const [o, a] of Object.entries(r))
    jm(a) && a.targetId === o && e.set(o, a);
  return e;
}
async function Fm(t, e) {
  await cr(
    t,
    fi,
    e.targetId,
    e
  );
}
function Bm(t) {
  const e = Ce(t);
  return e ? {
    actorId: Ge(e.actorId),
    itemId: Ge(e.itemId),
    itemName: Ge(e.itemName)
  } : null;
}
async function cr(t, e, n, r) {
  const o = pi(t);
  if (!o) return;
  const a = gi(t), s = hi(a);
  if (!a || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((d) => {
    if (!v(d) || d.pendingId !== o) return d;
    const f = v(d[e]) ? d[e] : {};
    return l = !0, {
      ...d,
      [e]: {
        ...f,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(a.setFlag?.(u, $e, {
    ...s,
    prompts: c
  }));
}
function Ce(t) {
  const e = pi(t);
  if (!e) return null;
  const n = gi(t), r = hi(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => v(a) ? a.pendingId === e : !1) ?? null;
}
function pi(t) {
  return (t.closest(`[${Jt}]`) ?? t.querySelector(`[${Jt}]`) ?? t.parentElement?.querySelector(`[${Jt}]`) ?? null)?.getAttribute(Jt) ?? null;
}
function gi(t) {
  const n = t.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return Gm(o) ? o : null;
}
function hi(t) {
  const e = t?.getFlag?.(u, $e);
  return v(e) ? e : null;
}
function Um(t) {
  return v(t) ? typeof t.targetId == "string" && typeof t.targetName == "string" && typeof t.skill == "string" && typeof t.skillLabel == "string" && typeof t.formula == "string" && typeof t.total == "number" && Number.isFinite(t.total) && (typeof t.diceBreakdown == "string" || t.diceBreakdown === null) && typeof t.rolledAt == "string" : !1;
}
function qm(t) {
  return v(t) ? typeof t.targetId == "string" && typeof t.targetName == "string" && zm(t.mode) && typeof t.inputAmount == "number" && Number.isFinite(t.inputAmount) && typeof t.finalDamage == "number" && Number.isFinite(t.finalDamage) && typeof t.blocked == "number" && Number.isFinite(t.blocked) && typeof t.appliedAt == "string" : !1;
}
function zm(t) {
  return t === "normal" || t === "half";
}
function jm(t) {
  return v(t) ? typeof t.targetId == "string" && typeof t.targetName == "string" && typeof t.conditionId == "string" && typeof t.conditionLabel == "string" && (typeof t.effectId == "string" || t.effectId === null) && typeof t.created == "boolean" && typeof t.refreshed == "boolean" && typeof t.appliedAt == "string" : !1;
}
function Ge(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function Gm(t) {
  return !!(t && typeof t == "object" && typeof t.getFlag == "function");
}
function v(t) {
  return !!(t && typeof t == "object");
}
const _i = "data-paranormal-toolkit-resistance-skill", bi = "data-paranormal-toolkit-resistance-skill-label", dn = "data-paranormal-toolkit-multi-target-section", ur = "data-paranormal-toolkit-multi-target-damage-info", yi = "data-paranormal-toolkit-multi-target-effect-info", Ai = "data-paranormal-toolkit-multi-target-toggle", Ti = "data-paranormal-toolkit-multi-target-details", L = "data-paranormal-toolkit-multi-target-target", Vm = "data-paranormal-toolkit-multi-target-state", mn = "data-paranormal-toolkit-multi-target-roll-total", fn = "data-paranormal-toolkit-multi-target-roll-formula", oe = "data-paranormal-toolkit-multi-target-roll-dice", pn = "data-paranormal-toolkit-multi-target-roll-skill", gn = "data-paranormal-toolkit-multi-target-roll-skill-label", hn = "data-paranormal-toolkit-multi-target-roll-target-name", _n = "data-paranormal-toolkit-multi-target-roll-rolled-at", bn = "data-paranormal-toolkit-multi-target-damage-mode", yn = "data-paranormal-toolkit-multi-target-damage-input-amount", An = "data-paranormal-toolkit-multi-target-damage-final-amount", Tn = "data-paranormal-toolkit-multi-target-damage-blocked", $n = "data-paranormal-toolkit-multi-target-damage-target-name", Rn = "data-paranormal-toolkit-multi-target-damage-applied-at", wn = "data-paranormal-toolkit-multi-target-effect-condition-id", kn = "data-paranormal-toolkit-multi-target-effect-condition-label", En = "data-paranormal-toolkit-multi-target-effect-effect-id", In = "data-paranormal-toolkit-multi-target-effect-created", Cn = "data-paranormal-toolkit-multi-target-effect-refreshed", Sn = "data-paranormal-toolkit-multi-target-effect-target-name", Ln = "data-paranormal-toolkit-multi-target-effect-applied-at", Hm = new oi(ci()), Wm = new ti(), At = "pending", Q = "success", Se = "failure", $i = "rolled";
function Km(t) {
  const e = Ri(t);
  if (!e) return !1;
  t.rollCard.classList.add(`${i}__roll-card--multi-target`), hf(t);
  const n = _f(t.rollCard);
  yf(n, e.damage), Tf(t.rollCard, n);
  const r = $f(t.rollCard);
  if (ki(r, e), Gf(t.rollCard, r, n), e.effect) {
    const o = Vf(t.rollCard);
    Hf(o, e.effect), Wf(t.rollCard, o, r);
  } else
    Ni(t.rollCard)?.remove();
  return !0;
}
function Ri(t) {
  const e = of(t.rollCard, t.damageSection), n = af(t.rollCard), r = sf(t.rollCard), o = lf(t.rollCard), a = Ym(t.rollCard).map((s, l) => {
    const c = Zf(s, l), d = n.get(c) ?? null;
    return {
      id: c,
      name: s,
      state: mf(d, e?.difficulty ?? null),
      resistanceResult: d,
      damageApplication: r.get(c) ?? null,
      effectApplication: o.get(c) ?? null
    };
  });
  return a.length <= 1 || !t.damageSection ? null : {
    rollCard: t.rollCard,
    targets: a,
    damage: Qm(t.damageSection),
    effect: Zm(t.rollCard, t.effectSection),
    resistance: e
  };
}
function Ym(t) {
  const n = t.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((o) => o.trim()).filter((o) => o.length > 0 && Oi(o) !== "nenhum alvo") : [];
}
function Qm(t) {
  const e = ff(t), n = e !== null ? Math.floor(e / 2) : null;
  return {
    typeLabel: gf(t),
    formula: pf(t) ?? "—",
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
function Zm(t, e) {
  const n = e?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), r = Xm(t, n ?? null);
  return r ? {
    label: n && n.length > 0 ? n : r.conditionLabel,
    conditionId: r.conditionId,
    conditionLabel: r.conditionLabel,
    duration: tf(r.duration),
    source: r.source,
    originUuid: r.originUuid
  } : null;
}
function Xm(t, e) {
  const n = Bm(t), r = ef(n);
  if (!r) return null;
  const o = Ae(r);
  if (!o.ok) return null;
  const a = (o.value.conditionApplications ?? []).filter((l) => l.actor === "target");
  if (a.length === 0) return null;
  const s = Jm(a, e);
  return s ? {
    conditionId: s.conditionId,
    conditionLabel: s.label ?? s.conditionId,
    duration: s.duration ?? null,
    source: s.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null
  } : null;
}
function Jm(t, e) {
  if (t.length === 1) return t[0] ?? null;
  if (!e) return null;
  const n = B(e);
  return n ? t.find((r) => [
    r.label,
    r.conditionId
  ].some((o) => B(o) === n)) ?? null : null;
}
function tf(t) {
  return t ? {
    rounds: t.rounds ?? null,
    expiry: t.expiry ?? null
  } : null;
}
function ef(t) {
  if (!t) return null;
  const e = t.actorId ? resolveActorById(t.actorId) : null, n = e ? nf(e, t.itemId, t.itemName) : null;
  return n || rf(t.itemId, t.itemName);
}
function nf(t, e, n) {
  const r = t.items;
  if (e) {
    const a = r?.get?.(e);
    if (isItemLike(a)) return a;
  }
  const o = B(n);
  if (o) {
    const a = r?.find?.((s) => isItemLike(s) && B(s.name) === o);
    if (isItemLike(a)) return a;
  }
  return null;
}
function rf(t, e) {
  const n = game.items;
  if (t) {
    const o = n?.get?.(t);
    if (isItemLike(o)) return o;
  }
  const r = B(e);
  if (r) {
    const o = n?.find?.((a) => isItemLike(a) && B(a.name) === r);
    if (isItemLike(o)) return o;
  }
  return null;
}
function of(t, e) {
  const n = e?.querySelector(`.${i}__resistance-description`)?.textContent?.trim(), r = e?.querySelector(Re) ?? null, o = r?.getAttribute(_i) ?? null, a = r?.getAttribute(bi) ?? (o ? jt(o) : null);
  return !n && !o ? null : {
    description: n ?? "Resistência do alvo.",
    formula: e?.querySelector(`.${i}__resistance .${i}__workflow-roll-formula`)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: a,
    difficulty: rr(t)
  };
}
function af(t) {
  const e = vm(t);
  for (const [n, r] of df(t))
    e.set(n, r);
  return e;
}
function sf(t) {
  const e = xm(t);
  for (const [n, r] of uf(t))
    e.set(n, r);
  return e;
}
function lf(t) {
  const e = Mm(t);
  for (const [n, r] of cf(t))
    e.set(n, r);
  return e;
}
function cf(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = n.getAttribute(wn), a = n.getAttribute(kn), s = n.getAttribute(En), l = po(n.getAttribute(In)), c = po(n.getAttribute(Cn)), d = n.getAttribute(Sn), f = n.getAttribute(Ln);
    !r || !o || !a || l === null || c === null || !d || !f || e.set(r, {
      targetId: r,
      targetName: d,
      conditionId: o,
      conditionLabel: a,
      effectId: s && s.length > 0 ? s : null,
      created: l,
      refreshed: c,
      appliedAt: f
    });
  }
  return e;
}
function uf(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = n.getAttribute(bn), a = ae(n.getAttribute(yn)), s = ae(n.getAttribute(An)), l = ae(n.getAttribute(Tn)), c = n.getAttribute($n), d = n.getAttribute(Rn);
    !r || !Jf(o) || a === null || s === null || l === null || !c || !d || e.set(r, {
      targetId: r,
      targetName: c,
      mode: o,
      inputAmount: a,
      finalDamage: s,
      blocked: l,
      appliedAt: d
    });
  }
  return e;
}
function df(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = ae(n.getAttribute(mn)), a = n.getAttribute(fn), s = n.getAttribute(pn), l = n.getAttribute(gn), c = n.getAttribute(hn), d = n.getAttribute(_n);
    !r || o === null || !a || !s || !l || !c || !d || e.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: a,
      total: o,
      diceBreakdown: n.getAttribute(oe),
      rolledAt: d
    });
  }
  return e;
}
function mf(t, e) {
  return t ? e === null ? $i : t.total >= e ? Q : Se : At;
}
function ff(t) {
  const e = t?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!e) return null;
  const n = Number(e.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function pf(t) {
  const e = t?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return e && e.length > 0 ? e : null;
}
function gf(t) {
  const e = t?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return e && e.length > 0 ? e : null;
}
function hf(t) {
  t.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), t.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function _f(t) {
  const e = bf(t);
  if (e) return e;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(ur, "true"), n;
}
function bf(t) {
  return t.querySelector(`[${ur}="true"]`);
}
function yf(t, e) {
  t.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), t.append(n), e.typeLabel) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-section-description`), o.textContent = e.typeLabel, t.append(o);
  }
  t.append(wi(e.formula, e.total, e.diceBreakdown));
}
function wi(t, e, n, r = !1) {
  const o = Cm({
    formula: t,
    total: e,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Af(o, r), o;
}
function Af(t, e) {
  const n = t.querySelector(we), r = t.querySelector(er);
  if (!n || !r) return;
  t.classList.toggle(tr, e), n.hidden = !e, r.classList.add(nr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", e ? "true" : "false"), r.title = e ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const o = r.querySelector("i") ?? document.createElement("i");
  o.classList.add("fa-solid"), o.classList.toggle("fa-chevron-down", !e), o.classList.toggle("fa-chevron-up", e), o.setAttribute("aria-hidden", "true"), o.parentElement || r.append(o);
}
function Tf(t, e) {
  const n = Ee(t, "Conjuração");
  if (!n) {
    t.prepend(e);
    return;
  }
  e.parentElement === t && e.previousElementSibling === n || t.insertBefore(e, n.nextElementSibling);
}
function $f(t) {
  const e = t.querySelector(`[${dn}="true"]`);
  if (e) return e;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(dn, "true"), n;
}
function ki(t, e) {
  const n = Rf(t);
  t.replaceChildren(wf(e), Ef(e, n));
}
function Rf(t) {
  return new Set(
    Array.from(t.querySelectorAll(`[${L}]`)).filter((e) => e.getAttribute("aria-expanded") === "true").map((e) => e.getAttribute(L)).filter(Xf)
  );
}
function wf(t) {
  const e = document.createElement("div");
  e.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = kf(t.targets), e.append(n, r), e;
}
function kf(t) {
  const e = t.length, n = t.filter((l) => l.state === Se).length, r = t.filter((l) => l.state === Q).length, o = t.filter((l) => l.state === At).length, a = t.filter((l) => l.state === $i).length, s = [`${e} ${e === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), o > 0 && s.push(`${o} ${o === 1 ? "pendente" : "pendentes"}`), a > 0 && s.push(`${a} ${a === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Ef(t, e) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of t.targets)
    n.append(If(r, t, e.has(r.id)));
  return n;
}
function If(t, e, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${t.state}`), t.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), t.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(L, t.id), r.setAttribute(Vm, t.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${t.name}`), Ei(r, t.resistanceResult), Ii(r, t.damageApplication), Ci(r, t.effectApplication);
  const o = Cf(t, e, r), a = Uf(t, e);
  return a.hidden = !n, r.addEventListener("click", (s) => {
    fo(s.target) || mo(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || fo(s.target) || (s.preventDefault(), mo(r));
  }), r.append(o, a), r;
}
function Ei(t, e) {
  if (!e) {
    t.removeAttribute(mn), t.removeAttribute(fn), t.removeAttribute(oe), t.removeAttribute(pn), t.removeAttribute(gn), t.removeAttribute(hn), t.removeAttribute(_n);
    return;
  }
  t.setAttribute(mn, String(e.total)), t.setAttribute(fn, e.formula), t.setAttribute(pn, e.skill), t.setAttribute(gn, e.skillLabel), t.setAttribute(hn, e.targetName), t.setAttribute(_n, e.rolledAt), e.diceBreakdown ? t.setAttribute(oe, e.diceBreakdown) : t.removeAttribute(oe);
}
function Ii(t, e) {
  if (!e) {
    t.removeAttribute(bn), t.removeAttribute(yn), t.removeAttribute(An), t.removeAttribute(Tn), t.removeAttribute($n), t.removeAttribute(Rn);
    return;
  }
  t.setAttribute(bn, e.mode), t.setAttribute(yn, String(e.inputAmount)), t.setAttribute(An, String(e.finalDamage)), t.setAttribute(Tn, String(e.blocked)), t.setAttribute($n, e.targetName), t.setAttribute(Rn, e.appliedAt);
}
function Ci(t, e) {
  if (!e) {
    t.removeAttribute(wn), t.removeAttribute(kn), t.removeAttribute(En), t.removeAttribute(In), t.removeAttribute(Cn), t.removeAttribute(Sn), t.removeAttribute(Ln);
    return;
  }
  t.setAttribute(wn, e.conditionId), t.setAttribute(kn, e.conditionLabel), t.setAttribute(En, e.effectId ?? ""), t.setAttribute(In, String(e.created)), t.setAttribute(Cn, String(e.refreshed)), t.setAttribute(Sn, e.targetName), t.setAttribute(Ln, e.appliedAt);
}
function Cf(t, e, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const o = document.createElement("div");
  o.classList.add(`${i}__target-summary-main`);
  const a = Sf(t), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = t.name;
  const l = Lf(t, e.resistance);
  Pf(l, n, t, e);
  const c = Bf(n);
  o.append(a, s, l, c);
  const d = document.createElement("div");
  return d.classList.add(`${i}__target-summary-actions`), d.append(
    Si(t, e, "compact"),
    Pi(t, e, "compact")
  ), r.append(o, d), r;
}
function Sf(t) {
  const e = document.createElement("span");
  return e.classList.add(`${i}__target-avatar`), e.setAttribute("aria-hidden", "true"), e.textContent = t.name.trim().charAt(0).toLocaleUpperCase() || "?", e;
}
function Lf(t, e) {
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${t.state}`), n.setAttribute("aria-label", Df(t, e)), e?.skill && (n.setAttribute(_i, e.skill), n.setAttribute(bi, e.skillLabel ?? jt(e.skill))), !e?.skill)
    return n.disabled = !0, n.title = "Resistência não configurada", n.textContent = "—", n;
  if (n.title = t.resistanceResult ? `Rolar ${e.skillLabel ?? e.skill} novamente` : `Rolar ${e.skillLabel ?? e.skill} de ${t.name}`, !t.resistanceResult) {
    const a = document.createElement("i");
    a.classList.add("fa-solid", "fa-dice-d20"), a.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    return s.classList.add(`${i}__target-resistance-fallback`), s.textContent = "d20", n.append(a, s), n;
  }
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(t.resistanceResult.total);
  const o = document.createElement("span");
  return o.classList.add(`${i}__target-resistance-mark`), o.setAttribute("aria-hidden", "true"), o.textContent = t.state === Q ? "✓" : t.state === Se ? "✕" : "", n.append(r, o), n;
}
function Df(t, e) {
  const n = e?.skillLabel ?? e?.skill ?? "resistência";
  if (!t.resistanceResult) return `Rolar ${n} de ${t.name}`;
  const r = t.state === Q ? "sucesso" : t.state === Se ? "falha" : "resultado";
  return `${n} de ${t.name}: ${t.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Pf(t, e, n, r) {
  t.addEventListener("click", (o) => {
    o.stopPropagation(), vf(e, t, n, r);
  });
}
async function vf(t, e, n, r) {
  const o = r.resistance, a = o?.skill, s = o?.skillLabel ?? (a ? jt(a) : "Resistência");
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = mr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  e.disabled = !0, e.classList.add(`${i}__target-resistance-button--rolling`);
  const c = e.innerHTML;
  e.textContent = "...";
  try {
    const d = await ei(l, a);
    await Qf(d.roll);
    const f = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      skill: a,
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
    dr(t);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), e.innerHTML = c;
  } finally {
    e.disabled = !1, e.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function dr(t) {
  const e = t.closest(`[${dn}="true"]`), n = t.closest(`.${i}__roll-card`);
  if (!e || !n) return;
  const r = Ri({
    rollCard: n,
    damageSection: Nf(n) ?? Ee(n, "Dano"),
    effectSection: xf(n)
  });
  r && ki(e, r);
}
function Nf(t) {
  return Array.from(t.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((e) => e.getAttribute(ur) !== "true") ?? null;
}
function xf(t) {
  return t.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Si(t, e, n) {
  if (t.damageApplication)
    return O(
      "✓",
      Of(t.damageApplication, n),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  if (t.state === At)
    return O(
      "◇",
      n === "full" ? "Role resistência primeiro" : "Role res.",
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const r = Li(t), o = Di(r, e.damage);
  if (o === null)
    return O(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const a = r === "half" ? n === "full" ? e.damage.halfLabel ?? `Metade: ${o} PV` : e.damage.halfCompactLabel ?? `½ ${o} PV` : n === "full" ? e.damage.normalLabel : e.damage.normalCompactLabel, s = r === "half" ? "🛡️" : "⚡", l = r === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, c = O(
    s,
    a,
    [`${i}__target-action--damage`, l],
    !1
  );
  return c.title = `Aplicar ${a} em ${t.name}`, c.setAttribute("aria-label", c.title), c.addEventListener("click", (d) => {
    d.stopPropagation();
    const f = c.closest(`[${L}]`);
    f && Mf(f, c, t, e);
  }), c;
}
function Of(t, e) {
  const n = t.blocked > 0 ? ` (RD ${t.blocked})` : "";
  return e === "compact" ? `${t.finalDamage} PV` : `Dano aplicado: ${t.finalDamage} PV${n}`;
}
function Li(t) {
  return t.state === Q ? "half" : "normal";
}
function Di(t, e) {
  return t === "half" ? e.halfAmount : e.normalAmount;
}
async function Mf(t, e, n, r) {
  if (n.damageApplication) return;
  if (n.state === At) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const o = Li(n), a = Di(o, r.damage);
  if (a === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const s = mr(n.name);
  if (!s) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  e.disabled = !0, e.classList.add(`${i}__target-action--applying`);
  const l = e.innerHTML;
  e.textContent = "Aplicando...";
  try {
    const c = await Wm.applyDamage({
      actor: s,
      instances: [
        {
          id: `multi-target:${n.id}:${o}`,
          amount: a,
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
      inputAmount: a,
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
    ui.notifications?.info?.(`Paranormal Toolkit: ${d.finalDamage} PV aplicado em ${d.targetName}.`), dr(t);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", c), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), e.innerHTML = l;
  } finally {
    e.disabled = !1, e.classList.remove(`${i}__target-action--applying`);
  }
}
function Pi(t, e, n) {
  if (!e.effect)
    return O(
      "✦",
      "Sem efeito",
      [`${i}__target-action--effect`, `${i}__target-action--disabled`],
      !0
    );
  if (t.effectApplication)
    return O(
      "✓",
      n === "full" ? `${t.effectApplication.conditionLabel} aplicado` : "Aplicado",
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (t.state === At)
    return O(
      "◇",
      n === "full" ? "Role resistência primeiro" : "Role res.",
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (t.state === Q)
    return O(
      "✓",
      n === "full" ? "Resistiu ao efeito" : "Resistiu",
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  const r = O(
    "✦",
    n === "full" ? `Aplicar ${e.effect.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return r.title = `Aplicar ${e.effect.conditionLabel} em ${t.name}`, r.setAttribute("aria-label", r.title), r.addEventListener("click", (o) => {
    o.stopPropagation();
    const a = r.closest(`[${L}]`);
    a && Ff(a, r, t, e);
  }), r;
}
async function Ff(t, e, n, r) {
  if (n.effectApplication) return;
  if (n.state === At) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar efeito.");
    return;
  }
  if (n.state === Q) {
    ui.notifications?.warn?.("Paranormal Toolkit: este alvo resistiu ao efeito.");
    return;
  }
  const o = r.effect;
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui efeito estruturado para aplicar.");
    return;
  }
  const a = mr(n.name);
  if (!a) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  e.disabled = !0, e.classList.add(`${i}__target-action--applying`);
  const s = e.innerHTML;
  e.textContent = "Aplicando...";
  try {
    const l = await Hm.applyCondition({
      actor: a,
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
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), ui.notifications?.info?.(`Paranormal Toolkit: ${c.conditionLabel} aplicado em ${c.targetName}.`), dr(t);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), e.innerHTML = s;
  } finally {
    e.disabled = !1, e.classList.remove(`${i}__target-action--applying`);
  }
}
function O(t, e, n, r) {
  const o = document.createElement("button");
  o.type = "button", o.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), o.disabled = r;
  const a = document.createElement("span");
  a.classList.add(`${i}__target-action-icon`), a.setAttribute("aria-hidden", "true"), a.textContent = t;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = e, o.append(a, s), o;
}
function Bf(t) {
  const e = document.createElement("span");
  return e.classList.add(`${i}__target-toggle`), e.setAttribute(Ai, "true"), e.setAttribute("aria-hidden", "true"), vi(t, e), e;
}
function mo(t) {
  const e = t.querySelector(`[${Ti}="true"]`);
  if (!e) return;
  const n = e.hidden;
  e.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = t.querySelector(`[${Ai}="true"]`);
  r && vi(t, r);
}
function vi(t, e) {
  const n = t.getAttribute("aria-expanded") === "true";
  e.textContent = n ? "⌃" : "⌄";
}
function fo(t) {
  return t instanceof HTMLElement ? !!t.closest([
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
function Uf(t, e) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Ti, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const a = document.createElement("span");
  a.textContent = e.resistance?.description ?? "Resistência pendente.", r.append(o, a);
  const s = qf(t, e.resistance);
  s && r.append(s);
  const l = zf(t, e.resistance), c = jf(t, e);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${t.name}`), n;
}
function qf(t, e) {
  if (!t.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), e?.difficulty === null || e?.difficulty === void 0)
    return n.textContent = `${t.resistanceResult.skillLabel}: ${t.resistanceResult.total}`, n;
  const r = t.state === Q ? "sucesso" : "falha";
  return n.textContent = `${t.resistanceResult.skillLabel}: ${t.resistanceResult.total} vs DT ${e.difficulty} — ${r}`, n;
}
function zf(t, e) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = t.resistanceResult?.formula ?? e?.formula ?? "—", o = t.resistanceResult?.total ?? null, a = wi(
    r,
    o,
    t.resistanceResult?.diceBreakdown ?? null,
    t.resistanceResult !== null
  );
  return n.append(a), n;
}
function jf(t, e) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), n.append(
    Si(t, e, "full"),
    Pi(t, e, "full")
  ), n;
}
function Gf(t, e, n) {
  const r = n.parentElement === t ? n : Ee(t, "Conjuração");
  if (!r) {
    t.prepend(e);
    return;
  }
  e.parentElement === t && e.previousElementSibling === r || t.insertBefore(e, r.nextElementSibling);
}
function Vf(t) {
  const e = Ni(t);
  if (e) return e;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(yi, "true"), n;
}
function Ni(t) {
  return t.querySelector(`[${yi}="true"]`);
}
function Hf(t, e) {
  t.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  r.textContent = "Efeito", n.append(r);
  const o = document.createElement("div");
  o.classList.add(`${i}__effect-info-body`);
  const a = document.createElement("span");
  a.classList.add(`${i}__effect-info-label`), a.textContent = e.label;
  const s = document.createElement("span");
  s.classList.add(`${i}__effect-info-hint`), s.textContent = "Aplicação por alvo", o.append(a, s), t.append(n, o);
}
function Wf(t, e, n) {
  e.parentElement === t && e.previousElementSibling === n || t.insertBefore(e, n.nextElementSibling);
}
function mr(t) {
  const e = B(t);
  if (!e) return null;
  const n = Kf().filter((a) => B(Yf(a)) === e).map((a) => xi(a)).find(Nt) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => Nt(a) && B(a.name) === e);
  return Nt(o) ? o : null;
}
function Kf() {
  const e = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Yf(t) {
  if (!t || typeof t != "object") return null;
  const e = t.name;
  if (typeof e == "string") return e;
  const n = t.document?.name;
  return typeof n == "string" ? n : xi(t)?.name ?? null;
}
function xi(t) {
  if (!t || typeof t != "object") return null;
  const e = t.actor;
  if (Nt(e)) return e;
  const n = t.document?.actor;
  return Nt(n) ? n : null;
}
function Nt(t) {
  return !!(t && typeof t == "object" && "system" in t);
}
function B(t) {
  const e = t?.trim().toLocaleLowerCase();
  return e && e.length > 0 ? e : null;
}
async function Qf(t) {
  const e = game.dice3d;
  typeof e?.showForRoll == "function" && await Promise.resolve(e.showForRoll(t, game.user, !0));
}
function Zf(t, e) {
  return `${e}-${Oi(t).replace(/[^a-z0-9]+/gu, "-")}`;
}
function Oi(t) {
  return t?.trim().toLocaleLowerCase() ?? "";
}
function Xf(t) {
  return typeof t == "string" && t.length > 0;
}
function Jf(t) {
  return t === "normal" || t === "half";
}
function po(t) {
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
function ae(t) {
  if (!t) return null;
  const e = Number(t);
  return Number.isFinite(e) ? Math.trunc(e) : null;
}
const ft = "data-paranormal-toolkit-prompt-id", tp = "data-paranormal-toolkit-card-layout-normalized", go = "data-paranormal-toolkit-card-layout-refresh-bound", ep = "apply-damage", np = "data-paranormal-toolkit-multi-target-damage-info", Mi = [0, 80, 180, 400, 900, 1600, 3e3], ho = /* @__PURE__ */ new WeakSet();
function rp(t) {
  Fi(t), op(t);
}
function Fi(t) {
  for (const e of Array.from(t.querySelectorAll(`.${i}__roll-card`)))
    Ui(Bi(e));
}
function op(t) {
  if (!ho.has(t)) {
    ho.add(t);
    for (const e of Mi)
      globalThis.setTimeout(() => {
        Fi(t);
      }, e);
  }
}
function Bi(t) {
  return {
    rollCard: t,
    damageSection: ap(t),
    resistance: t.querySelector(Jn),
    damageActions: ip(t),
    effectActionSource: sp(t),
    effectSection: Eu(t)
  };
}
function Ui(t) {
  const {
    rollCard: e,
    damageSection: n,
    resistance: r,
    damageActions: o,
    effectActionSource: a,
    effectSection: s
  } = t;
  e.setAttribute(tp, "true"), e.classList.add(`${i}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), Ru(e, o));
  const l = Iu({
    rollCard: e,
    existingSection: s,
    sourceActions: a,
    after: n,
    fallbackAfter: Ee(e, "Conjuração")
  });
  l && Cu(e, l), Km({
    rollCard: e,
    damageSection: n,
    effectSection: l ?? s
  }), pp(e);
}
function ap(t) {
  return Array.from(t.querySelectorAll(`.${i}__workflow-section`)).find((e) => e.getAttribute(np) === "true" ? !1 : e.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function ip(t) {
  const e = lp(t);
  return e.find((n) => n.getAttribute(_u) === ep) ?? e.find((n) => Wa(n) === "aplicar danos") ?? null;
}
function sp(t) {
  const e = qi(t), n = _o(e);
  return n || _o(cp(t));
}
function _o(t) {
  return t.find((e) => {
    const n = Wa(e);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function lp(t) {
  const e = qi(t);
  return e.length > 0 ? e : fr(t);
}
function qi(t) {
  const e = mp(t);
  return e ? fr(t).filter((n) => dp(n, e)) : [];
}
function cp(t) {
  const e = zi(t);
  if (!e) return [];
  const n = up(t, e);
  return fr(t).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => ji(t, r)).filter((r) => !n || fp(r, n));
}
function fr(t) {
  const e = zi(t);
  return e ? Array.from(e.querySelectorAll(hu)) : [];
}
function zi(t) {
  return t.closest(`.${i}`) ?? t.parentElement;
}
function up(t, e) {
  return Array.from(e.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== t && ji(t, n)) ?? null;
}
function dp(t, e) {
  return t.getAttribute(ft) === e ? !0 : Array.from(t.querySelectorAll(`[${ft}]`)).some((n) => n.getAttribute(ft) === e);
}
function mp(t) {
  return t.getAttribute(ft) ?? t.querySelector(`[${ft}]`)?.getAttribute(ft) ?? null;
}
function ji(t, e) {
  return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function fp(t, e) {
  return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function pp(t) {
  const e = t.querySelector(Re);
  e && e.getAttribute(go) !== "true" && (e.setAttribute(go, "true"), e.addEventListener("click", () => {
    for (const n of Mi)
      globalThis.setTimeout(() => {
        Ui(Bi(t));
      }, n);
  }));
}
const gp = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function hp(t) {
  for (const e of Array.from(t.querySelectorAll(Jn)))
    _p(e);
  rp(t);
}
function _p(t) {
  const e = t.querySelector(Oc), n = t.querySelector(Fa), r = t.querySelector(Re), o = t.querySelector(Ba);
  if (!r || !e && !n && !o) return;
  const a = bp(t, r);
  e && e.parentElement !== a && a.append(e), n && n.parentElement !== a && a.append(n), o && (o.parentElement !== t && !r.contains(o) && t.append(o), yp(o)), r.parentElement !== t && t.append(r);
}
function bp(t, e) {
  const n = t.querySelector(`.${Kr}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Kr), t.insertBefore(r, e.parentElement === t ? e : t.firstChild), r;
}
function yp(t) {
  const e = Ap(t.textContent ?? "");
  e && (t.setAttribute(gp, "true"), t.replaceChildren(Rp(e)));
}
function Ap(t) {
  const e = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(t);
  if (!e) return null;
  const [, n, r, o] = e, a = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = Tp(r ?? "");
  return l ? {
    skillLabel: a,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function Tp(t) {
  const e = t.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(e);
  return n ? {
    formula: n[1]?.trim() ?? e,
    diceValues: $p(n[2] ?? "")
  } : { formula: e, diceValues: [] };
}
function $p(t) {
  return t.split(",").map((e) => Number(e.trim())).filter((e) => Number.isFinite(e)).map((e) => Math.trunc(e));
}
function Rp(t) {
  const e = document.createElement("div");
  e.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), e.setAttribute("data-paranormal-toolkit-resistance-total", String(t.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = t.formula, n.title = `${t.skillLabel}: ${t.formula}`, e.append(n);
  const r = wp(t);
  return r && e.append(r), e;
}
function wp(t) {
  if (t.diceValues.length === 0) return null;
  const e = document.createElement("div");
  e.classList.add(`${i}__workflow-dice-tray`);
  for (const n of kp(t.diceValues, t.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), e.append(r);
  }
  return e;
}
function kp(t, e) {
  if (t.length <= 1) return t.map((r) => ({ value: r, active: !0 }));
  const n = e.toLowerCase();
  return n.includes("kh") ? bo(t, "highest") : n.includes("kl") ? bo(t, "lowest") : t.map((r) => ({ value: r, active: !0 }));
}
function bo(t, e) {
  const n = e === "highest" ? Math.max(...t) : Math.min(...t);
  let r = !1;
  return t.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function yo(t) {
  if (t instanceof Document || t instanceof HTMLElement || t instanceof DocumentFragment)
    return t;
  if (!t || typeof t != "object") return null;
  const e = t;
  return e[0] instanceof HTMLElement ? e[0] : null;
}
function pr() {
  const t = globalThis.game;
  return Le(t) ? t : null;
}
function P(t, e) {
  const n = Ep(t, e);
  return ie(n);
}
function Ep(t, e) {
  return e.split(".").reduce((n, r) => Le(n) ? n[r] : null, t);
}
function Ip(t, e) {
  const n = t.indexOf(":");
  return n < 0 || Ft(t.slice(0, n)) !== Ft(e) ? null : Tt(t.slice(n + 1));
}
function ie(t) {
  return typeof t == "string" ? Tt(t) : typeof t == "number" && Number.isFinite(t) ? String(t) : null;
}
function Le(t) {
  return !!t && typeof t == "object";
}
function Cp(t) {
  return typeof t == "string";
}
function De(t) {
  return typeof t == "string" && t.trim().length > 0;
}
function Tt(t) {
  if (!t) return null;
  const e = t.replace(/\s+/gu, " ").trim();
  return e.length > 0 ? e : null;
}
function Ft(t) {
  return (t ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Dn(t) {
  return t.length === 0 ? t : t[0].toLocaleLowerCase("pt-BR") + t.slice(1);
}
function Y(t) {
  return t.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (e) => e[0].toLocaleUpperCase("pt-BR") + e.slice(1).toLocaleLowerCase("pt-BR"));
}
function Gi(t) {
  return t.replace(/[.。]+$/u, "").trim();
}
function Sp(t) {
  for (const e of Array.from(t.querySelectorAll(vc))) {
    const n = Op(e);
    Lp(e), n && (Dp(e, n), Pp(e, n));
  }
}
function Lp(t) {
  for (const e of Array.from(t.querySelectorAll(Nc)))
    e.remove();
}
function Dp(t, e) {
  const r = t.closest(`.${i}`)?.querySelector(Ma) ?? null, o = r?.querySelector(Pc) ?? null, a = r ?? t, s = a.querySelector(Bc);
  if (!e.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = Jp(e.elementTone), l.textContent = Xp(e), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", l);
      return;
    }
    a.prepend(l);
  }
}
function Pp(t, e) {
  const n = vp(t);
  Np(t, n);
  const r = xp(e);
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
  const a = t.querySelector(Ua);
  if (a) {
    t.insertBefore(o, a);
    return;
  }
  t.prepend(o);
}
function vp(t) {
  return t.closest(`.${i}`)?.querySelector(Ma) ?? null;
}
function Np(t, e) {
  const n = [t, e].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(Uc)))
      o.remove();
}
function xp(t) {
  return [
    t.cost,
    t.target ? `Alvo: ${Dn(t.target)}` : null,
    t.duration ? `Duração: ${Dn(t.duration)}` : null,
    t.resistance ? `Resistência: ${Gi(t.resistance)}` : null
  ].filter(De);
}
function Op(t) {
  const e = Mp(t), n = jp(t), o = (e ? zp(e) : null)?.system ?? null, a = e?.summaryLines ?? [], s = gr(P(o, "element")), l = q("op.elementChoices", s) ?? Ao(rt(a, "Elemento")) ?? Ao(n.damageType), c = s ?? tg(l), d = P(o, "circle") ?? rt(a, "Círculo"), f = Hp(o) ?? rt(a, "Alvo"), y = Qp(o, "duration", "op.durationChoices") ?? rt(a, "Duração"), T = Gp(t) ?? Kp(o) ?? rt(a, "Resistência"), $ = Vp(a) ?? n.cost, g = {
    elementLabel: l,
    elementTone: c,
    circle: d,
    cost: $,
    target: f,
    duration: y,
    resistance: T
  };
  return Zp(g) ? g : null;
}
function Mp(t) {
  const e = Fp(t);
  if (!e) return null;
  const n = e.getFlag?.(u, $e), r = Up(n);
  if (r.length === 0) return null;
  const o = Bp(t);
  if (o.size > 0) {
    const a = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function Fp(t) {
  const n = t.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? pr()?.messages?.get?.(n) ?? null : null;
}
function Bp(t) {
  const e = t.closest(`.${i}`) ?? t, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(e.querySelectorAll(`[${Wr}]`))) {
    const o = r.getAttribute(Wr)?.trim();
    o && n.add(o);
  }
  return n;
}
function Up(t) {
  if (!Le(t)) return [];
  const e = t.prompts;
  return Array.isArray(e) ? e.map(qp).filter((n) => n !== null) : [];
}
function qp(t) {
  return Le(t) ? {
    pendingId: ie(t.pendingId),
    actorId: ie(t.actorId),
    itemId: ie(t.itemId),
    summaryLines: Array.isArray(t.summaryLines) ? t.summaryLines.filter(Cp) : []
  } : null;
}
function zp(t) {
  if (!t.itemId) return null;
  const e = pr(), r = (t.actorId ? e?.actors?.get?.(t.actorId) : null)?.items?.get?.(t.itemId);
  return r || (e?.items?.get?.(t.itemId) ?? null);
}
function jp(t) {
  let e = null, n = null;
  for (const r of Array.from(t.querySelectorAll(xc))) {
    const o = Tt(r.textContent);
    if (!o) continue;
    const a = Ip(o, "Tipo");
    a && (n = a), !e && /\b(P[ED]|PE|PD)\b/iu.test(o) && (e = o);
  }
  return { cost: e, damageType: n };
}
function Gp(t) {
  const e = Tt(t.querySelector(Fa)?.textContent);
  return e ? Gi(e) : null;
}
function rt(t, e) {
  const n = Ft(e);
  for (const r of t) {
    const o = r.indexOf(":");
    if (!(o < 0 || Ft(r.slice(0, o)) !== n))
      return Tt(r.slice(o + 1));
  }
  return null;
}
function Vp(t) {
  const e = rt(t, "Custo") ?? rt(t, "PE");
  return e || (t.map(Tt).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Hp(t) {
  const e = P(t, "target");
  if (!e) return null;
  if (e === "area")
    return Wp(t) ?? q("op.targetChoices", e) ?? "Área";
  const n = q("op.targetChoices", e) ?? Y(e);
  return [e === "people" || e === "creatures" ? P(t, "targetQtd") : null, n].filter(De).join(" ");
}
function Wp(t) {
  const e = P(t, "area.name"), n = P(t, "area.size"), r = P(t, "area.type"), o = e ? q("op.areaChoices", e) ?? Y(e) : null, a = r ? q("op.areaTypeChoices", r) ?? Y(r) : null;
  return o ? n ? a ? `${o} ${n}m ${Dn(a)}` : `${o} ${n}m` : o : null;
}
function Kp(t) {
  const e = P(t, "skillResis"), n = P(t, "resistance");
  if (!e || !n) return null;
  const r = q("op.skill", e) ?? Y(e), o = Yp(n);
  return [r, o].filter(De).join(" ");
}
function Yp(t) {
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
      return q("op.resistanceChoices", t) ?? Y(t);
  }
}
function Qp(t, e, n) {
  const r = P(t, e);
  return r ? q(n, r) ?? Y(r) : null;
}
function Zp(t) {
  return !!(t.elementLabel || t.cost || t.target || t.duration || t.resistance);
}
function Xp(t) {
  const e = t.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return t.circle ? `${e} ${t.circle}` : e;
}
function Jp(t) {
  return [
    `${i}__ritual-element-badge`,
    t ? `${i}__ritual-element-badge--${t}` : null
  ].filter(De).join(" ");
}
function gr(t) {
  const e = Ft(t);
  return e === "sangue" || e === "blood" || e === "blooddamage" ? "blood" : e === "morte" || e === "death" || e === "deathdamage" ? "death" : e === "conhecimento" || e === "knowledge" || e === "knowledgedamage" ? "knowledge" : e === "energia" || e === "energy" || e === "energydamage" ? "energy" : e === "medo" || e === "fear" || e === "feardamage" ? "fear" : null;
}
function Ao(t) {
  const e = gr(t);
  return e ? q("op.elementChoices", e) ?? Y(e) : t ? Y(t) : null;
}
function tg(t) {
  return gr(t);
}
function q(t, e) {
  if (!e) return null;
  const n = `${t}.${e}`, r = pr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const To = "data-paranormal-toolkit-dice-toggle-enhanced";
function eg(t) {
  for (const e of Array.from(t.querySelectorAll(qa)))
    Vi(e);
}
function ng(t) {
  const e = Wi(t.target);
  if (!e) return;
  const n = hr(e);
  n && (t.preventDefault(), Hi(n, e));
}
function rg(t) {
  if (t.key !== "Enter" && t.key !== " ") return;
  const e = Wi(t.target);
  if (!e) return;
  const n = hr(e);
  n && (t.preventDefault(), Hi(n, e));
}
function Vi(t) {
  const e = t.querySelector(we);
  if (!e) return;
  const n = t.querySelector(er);
  if (n && n.getAttribute(To) !== "true" && (n.setAttribute(To, "true"), n.classList.add(nr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), e.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Hi(t, e) {
  const n = t.querySelector(we);
  if (!n) return;
  const r = !t.classList.contains(tr);
  og(t, e, n, r);
}
function og(t, e, n, r) {
  t.classList.toggle(tr, r), n.hidden = !r, e.setAttribute("aria-expanded", r ? "true" : "false"), e.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", e.setAttribute("aria-label", e.title);
  const o = e.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Wi(t) {
  if (!(t instanceof Element)) return null;
  const e = t.closest(er);
  if (!e) return null;
  const n = hr(e);
  return n ? (Vi(n), e.classList.contains(nr) ? e : null) : null;
}
function hr(t) {
  const e = t.closest(qa);
  return e && e.querySelector(we) ? e : null;
}
const $o = `${u}-workflow-dice-toggle-styles`;
function ag() {
  if (document.getElementById($o)) return;
  const t = document.createElement("style");
  t.id = $o, t.textContent = `
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

`, document.head.append(t);
}
const ig = [0, 100, 500, 1500, 3e3];
let Ro = !1, Ve = null;
function sg() {
  if (!Ro) {
    Ro = !0, ag(), Hooks.on("renderChatMessageHTML", (t, e) => {
      Pt(yo(e));
    }), Hooks.on("renderChatMessage", (t, e) => {
      Pt(yo(e));
    }), Hooks.once("ready", () => {
      Pt(document), lg();
    }), document.addEventListener("click", ng), document.addEventListener("keydown", rg);
    for (const t of ig)
      globalThis.setTimeout(() => Pt(document), t);
  }
}
function lg() {
  Ve || !document.body || (Ve = new MutationObserver((t) => {
    for (const e of t)
      for (const n of Array.from(e.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Pt(n);
  }), Ve.observe(document.body, { childList: !0, subtree: !0 }));
}
function Pt(t) {
  t && (ou(t), Sp(t), hp(t), eg(t), Qc(t));
}
function cg() {
  sg();
}
const ug = "data-paranormal-toolkit-action-section", dg = "ritual-log", mg = ".paranormal-toolkit-item-use-prompt__actions", fg = ".paranormal-toolkit-item-use-prompt__actions-title", pg = [0, 100, 500, 1500];
let wo = !1;
function gg() {
  if (wo) return;
  const t = (e, n) => {
    ko(yg(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), ko(document), wo = !0;
}
function ko(t) {
  for (const e of pg)
    globalThis.setTimeout(() => hg(t), e);
}
function hg(t) {
  _g(t), bg(t);
}
function _g(t) {
  for (const e of t.querySelectorAll(
    `[${ug}="${dg}"]`
  ))
    e.remove();
}
function bg(t) {
  for (const e of t.querySelectorAll(mg)) {
    if (Eo(e.querySelector(fg)?.textContent ?? "") !== "registro") continue;
    Array.from(
      e.querySelectorAll("button"),
      (a) => Eo(a.textContent ?? "")
    ).some((a) => a.includes("ritual conjurado")) && e.remove();
  }
}
function yg(t) {
  if (t instanceof HTMLElement || Ag(t))
    return t;
  if (Tg(t)) {
    const e = t[0];
    return e instanceof HTMLElement ? e : null;
  }
  return null;
}
function Ag(t) {
  return t instanceof HTMLElement;
}
function Tg(t) {
  return typeof t == "object" && t !== null && 0 in t;
}
function Eo(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const vt = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Ki = {
  PV: "system.attributes.hp"
}, Pn = {
  PV: [vt.PV, Ki.PV],
  SAN: [vt.SAN],
  PE: [vt.PE],
  PD: [vt.PD]
}, vn = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class $g {
  getResource(e, n) {
    const r = Io(e, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, s = `${o}.max`, l = foundry.utils.getProperty(e, a), c = foundry.utils.getProperty(e, s), d = So(e, n, a, l, "valor atual");
    if (d) return p(d);
    const f = So(e, n, s, c, "valor máximo");
    return f ? p(f) : _({
      value: l,
      max: c
    });
  }
  async updateResourceValue(e, n, r) {
    const o = Io(e, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await e.update({ [`${o.value}.value`]: r });
  }
}
function Io(t, e) {
  const n = Rg(t.type, e);
  if (n && Co(t, n))
    return _(n);
  const r = Pn[e].find(
    (o) => Co(t, o)
  );
  return r ? _(r) : p({
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "resource-path-not-found",
    message: wg(t, e),
    path: Pn[e].join(" | ")
  });
}
function Rg(t, e) {
  return t === "threat" ? Ki[e] ?? null : t === "agent" ? vt[e] : null;
}
function Co(t, e) {
  const n = foundry.utils.getProperty(t, `${e}.value`), r = foundry.utils.getProperty(t, `${e}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function wg(t, e) {
  const n = t.type ?? "unknown", r = Pn[e].join(", ");
  return `${e} não encontrado no ator ${t.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function So(t, e, n, r, o) {
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
class kg {
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
      const s = vn.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: e,
        paths: [...s]
      });
    }
    const { path: r, value: o } = n, a = Eg(o);
    return a ? _(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: e,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(e) {
    for (const n of vn.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(e, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Eg(t) {
  if (Lo(t))
    return t;
  if (typeof t == "string") {
    const e = t.trim();
    if (!/^\d+$/.test(e))
      return null;
    const n = Number(e);
    if (Lo(n))
      return n;
  }
  return null;
}
function Lo(t) {
  return t === 1 || t === 2 || t === 3 || t === 4;
}
const Ig = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Cg {
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
    const r = n.value, o = Sg(e.ritual, r);
    return o.ok ? o.value ? _(o.value) : _({
      resource: "PE",
      amount: Ig[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Sg(t, e) {
  const n = t.getFlag(u, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Lg(n) ? {
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
function Lg(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return (e.resource === "PE" || e.resource === "PD") && typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0;
}
const He = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Dg(t) {
  if (!Mg(t.item)) return null;
  const e = Nn(t.actor) ? t.actor : Pg(t.item);
  return {
    source: "ordem-item-used-hook",
    actor: e,
    item: t.item,
    token: Ng(t.token) ?? vg(e),
    targets: Zn(),
    message: t.message,
    chatMessageData: t.chatMessageData
  };
}
function Pg(t) {
  const e = t;
  return Nn(e.actor) ? e.actor : Nn(t.parent) ? t.parent : null;
}
function vg(t) {
  const e = xg(t) ?? Og(t);
  return e ? Yi(e) : null;
}
function Ng(t) {
  return xn(t) ? Yi(t) : null;
}
function xg(t) {
  if (!t) return null;
  const e = t, n = e.token;
  return xn(n) ? n : (e.getActiveTokens?.() ?? []).find(xn) ?? null;
}
function Og(t) {
  return t ? canvas?.tokens?.controlled?.find((e) => e.actor?.id === t.id) ?? null : null;
}
function Yi(t) {
  const e = t.actor ?? null;
  return {
    tokenId: We(t.id),
    actorId: We(e?.id),
    sceneId: We(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function Mg(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function Nn(t) {
  return !!(t && typeof t == "object" && "update" in t && "items" in t);
}
function xn(t) {
  return !!(t && typeof t == "object" && ("actor" in t || "id" in t || "name" in t));
}
function We(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
class Fg {
  constructor(e) {
    this.onItemUsed = e;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(He.ITEM_USED, (e) => {
      this.handleHook(e);
    }), this.registered = !0, m.info(`${He.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(e) {
    const n = Dg(Bg(e));
    if (!n) {
      m.warn(`${He.ITEM_USED} disparou sem payload de item válido.`, e);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Bg(t) {
  return t && typeof t == "object" ? t : {};
}
class Ug {
  async applyPresetItemPatch(e, n) {
    const r = n.itemPatch;
    if (!r) return Ke("missing-item-patch");
    if (e.type !== "ritual") return Ke("unsupported-item-type");
    const o = qg(r);
    return Object.keys(o).length === 0 ? Ke("empty-update") : (await e.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function qg(t) {
  const e = {};
  k(e, "name", t.name), k(e, "system.description", t.descriptionHtml);
  const n = t.ritual;
  return n && (k(e, "system.circle", n.circle), k(e, "system.element", n.element), k(e, "system.target", n.target), k(e, "system.targetQtd", n.targetQuantity), k(e, "system.execution", n.execution), k(e, "system.range", n.range), k(e, "system.duration", n.duration), k(e, "system.skillResis", n.resistanceSkill), k(e, "system.resistance", n.resistance), k(e, "system.studentForm", n.studentForm), k(e, "system.trueForm", n.trueForm)), e;
}
function k(t, e, n) {
  n !== void 0 && (t[e] = n);
}
function Ke(t) {
  return {
    applied: !1,
    reason: t,
    updateData: {}
  };
}
class zg {
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
    return this.getNumber(e, vn.ritual.dt, 0);
  }
  getResources(e) {
    const n = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, r = [];
    for (const o of ["PV", "SAN", "PE", "PD"]) {
      const a = this.resourceAdapter.getResource(e, o);
      a.ok ? n[o] = a.value : r.push(a.error);
    }
    return { values: n, errors: r };
  }
  getNumber(e, n, r) {
    const o = foundry.utils.getProperty(e, n);
    return typeof o == "number" && Number.isFinite(o) ? o : r;
  }
}
class jg {
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
class Gg {
  presets = /* @__PURE__ */ new Map();
  register(e) {
    const n = Vg(e);
    return n.ok ? this.presets.has(e.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${e.id}.`,
      presetId: e.id
    }) : (this.presets.set(e.id, Ye(e)), _(e)) : n;
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
    return n ? Ye(n) : null;
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
    return Array.from(this.presets.values()).map(Ye);
  }
  findForItem(e) {
    return this.list().map((n) => Hg(n, e)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Vg(t) {
  return !Qe(t.id) || !Qe(t.version) || !Qe(t.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: t.id
  }) : !t.automation || t.automation.version !== 1 || !Array.isArray(t.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${t.id} possui definição de automação inválida.`,
    presetId: t.id
  }) : _(t);
}
function Hg(t, e) {
  if (t.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (t.itemTypes.length > 0) {
    if (!t.itemTypes.includes(e.type)) return null;
    r += 10, n.push(`itemType:${e.type}`);
  }
  for (const o of t.matchers) {
    const a = Wg(o, e);
    if (!a.matches)
      return null;
    r += a.score, n.push(a.reason);
  }
  return {
    preset: t,
    score: r,
    reasons: n
  };
}
function Wg(t, e) {
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
      const n = Do(e.name), r = t.names.map(Do).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Kg(e), r = n !== null && t.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Do(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Kg(t) {
  const e = foundry.utils.getProperty(t, "system.circle"), n = typeof e == "string" ? Number(e) : e;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Ye(t) {
  return structuredClone(t);
}
function Qe(t) {
  return typeof t == "string" && t.length > 0;
}
function de(t, e) {
  if (typeof t.amount == "number")
    return !Number.isInteger(t.amount) || t.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : _(t.amount);
  if (typeof t.amountFrom == "string") {
    const n = Pe(t.amountFrom);
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
function Pe(t) {
  return t ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(t)?.groups?.rollId ?? null : null;
}
const Yg = "dice-so-nice";
async function Qi(t) {
  if (!Qg() || !Zg()) return;
  const e = Xg();
  if (e?.showForRoll)
    try {
      await Promise.resolve(e.showForRoll(t, game.user, !0));
    } catch (n) {
      m.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Qg() {
  try {
    return Dc().enabled;
  } catch {
    return !1;
  }
}
function Zg() {
  return game.modules?.get?.(Yg)?.active === !0;
}
function Xg() {
  const e = game.dice3d;
  return !e || typeof e != "object" ? null : e;
}
async function Jg(t, e, n) {
  if (!Po(t.id) || !Po(t.formula))
    return p({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(t.formula), o = await Promise.resolve(r.evaluate()), a = o.total;
    if (typeof a != "number" || !Number.isFinite(a))
      return p({
        reason: "roll-failed",
        message: `A rolagem ${t.id} não retornou um total numérico válido.`
      });
    await Qi(o);
    const l = {
      ...n.rollRequests[t.id] ?? Zi(t, e),
      total: a,
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
  const n = t.intent ?? th(t.id);
  return {
    id: t.id,
    formula: t.formula,
    intent: n,
    damageType: t.damageType ?? void 0,
    sourceStepIndex: e
  };
}
function th(t) {
  const e = t.toLowerCase();
  return e.includes("damage") || e.includes("dano") ? "damage" : e.includes("healing") || e.includes("heal") || e.includes("cura") ? "healing" : e.includes("attack") || e.includes("ataque") ? "attack" : e.includes("resistance") || e.includes("resistencia") || e.includes("resistência") ? "resistance" : "generic";
}
function Po(t) {
  return typeof t == "string" && t.length > 0;
}
async function me(t, e, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? te(e, n, r, o) : t.spend(e, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? te(e, n, r, o) : t.damage(e, n, o);
    case "heal":
      return n !== "PV" ? te(e, n, r, o) : t.heal(e, n, o);
    case "recover":
      return n !== "SAN" ? te(e, n, r, o) : t.recover(e, n, o);
  }
}
function te(t, e, n, r) {
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
function eh(t) {
  const { step: e, context: n, transaction: r, stepIndex: o, lifecycle: a } = t;
  if (e.operation === "damage") {
    const s = nh(e, n, r, o);
    n.damageInstances.push(s), a.emit("afterDamageResolution", n, {
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
    }), a.emit("afterApplyDamage", n, {
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
    const s = rh(e, n, r, o);
    n.healingInstances.push(s), a.emit("afterApplyHealing", n, {
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
function nh(t, e, n, r) {
  const o = Pe(t.amountFrom), a = o ? e.rolls[o] : void 0;
  return {
    id: Xi(e.id, "damage", r, e.damageInstances.length),
    source: e.item.type === "ritual" ? "ritual" : "automation",
    sourceId: e.item.id ?? null,
    sourceName: e.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    damageType: a?.damageType,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", t.resource]
  };
}
function rh(t, e, n, r) {
  const o = Pe(t.amountFrom);
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
function oh(t, e, n) {
  const r = Pe(t.amountFrom), o = r ? e.rolls[r] : void 0;
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
function ah(t) {
  const { step: e, context: n, stepIndex: r, metadata: o, lifecycle: a } = t;
  a.emit("beforeApply", n, { stepIndex: r, step: e, metadata: o }), Ji("before", t), vo("before", t), vo("resolve", t);
}
function ih(t) {
  const { step: e, context: n, stepIndex: r, metadata: o, lifecycle: a } = t;
  a.emit("apply", n, { stepIndex: r, step: e, metadata: o }), Ji("apply", t);
}
function sh(t) {
  const { step: e, context: n, stepIndex: r, metadata: o, lifecycle: a } = t;
  a.emit("afterApply", n, { stepIndex: r, step: e, metadata: o });
}
function Ji(t, e) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = e, l = lh(t, n.operation);
  l && s.emit(l, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function vo(t, e) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = e;
  n.operation === "damage" && s.emit(t === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function lh(t, e) {
  return e === "damage" ? t === "before" ? "beforeApplyDamage" : t === "apply" ? "applyDamage" : "afterApplyDamage" : e === "heal" ? t === "before" ? "beforeApplyHealing" : t === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function ch(t, e, n) {
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
async function uh(t) {
  const { step: e } = t;
  switch (e.type) {
    case "spendResource":
      return dh(t, e);
    case "spendRitualCost":
      return mh(t, e);
  }
}
async function dh(t, e) {
  const { context: n, resources: r } = t, o = de(e, n);
  return o.ok ? ts(await r.spend(n.sourceActor, e.resource, o.value), n) : p(o.error);
}
async function mh(t, e) {
  const { context: n, resources: r, ritualCosts: o } = t, a = o.getCost({
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
  }), ts(await r.spend(n.sourceActor, s.resource, s.amount), n, e);
}
function ts(t, e, n) {
  return t.ok ? (e.resourceTransactions.push(t.value), _(void 0)) : (n?.type === "spendRitualCost" && e.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: t.error.message,
    cause: t.error
  }));
}
async function fh(t) {
  const { step: e, context: n, stepIndex: r, lifecycle: o, execute: a } = t, s = ph(e);
  for (const c of s.before)
    o.emit(c, n, { stepIndex: r, step: e });
  const l = await a();
  if (!l.ok)
    return l;
  for (const c of s.after)
    o.emit(c, n, { stepIndex: r, step: e });
  return l;
}
function ph(t) {
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
class gh {
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
      const a = await this.runStep(o, n, r);
      if (!a.ok)
        return a;
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
        return fh({
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
    const o = await uh({
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
    const a = await this.runRollFormulaStep(e, n, r);
    if (!a.ok)
      return a;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, e, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: e, rollRequest: o, rollResult: s }), _(void 0);
  }
  async runRollFormulaStep(e, n, r) {
    const o = await Jg(e, r, n);
    return o.ok ? _(void 0) : p({ ...o.error, stepIndex: r, step: e, context: n });
  }
  async runModifyResourceStepWithLifecycle(e, n, r) {
    const o = de(e, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: e, context: n });
    const a = oh(e, n, o.value);
    ah({
      step: e,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), ih({
      step: e,
      context: n,
      stepIndex: r,
      metadata: a,
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
      const c = await me(this.resources, l, e.resource, e.operation, o.value), d = this.handleResourceOperationResult(c, n, r, e);
      if (!d.ok)
        return d;
      eh({
        step: e,
        context: n,
        transaction: d.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return sh({
      step: e,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), _(void 0);
  }
  async runModifyResourceStep(e, n, r) {
    const o = de(e, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: e, context: n });
    const a = this.resolveActors(e.actor, n);
    if (a.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: e,
        context: n
      });
    for (const s of a) {
      const l = await me(this.resources, s, e.resource, e.operation, o.value), c = this.handleResourceOperationResult(l, n, r, e);
      if (!c.ok)
        return c;
    }
    return _(void 0);
  }
  async runChatCardStep(e, n, r) {
    const o = await ch(this.messages, e, n);
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
  emitSpecificRollPhase(e, n, r, o, a, s) {
    const l = hh(e, n.intent);
    l && this.lifecycle.emit(l, r, {
      stepIndex: o,
      step: a,
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
function hh(t, e) {
  return e === "damage" ? t === "before" ? "beforeDamageRoll" : t === "roll" ? "damageRoll" : "afterDamageRoll" : e === "healing" ? t === "before" ? "beforeHealingRoll" : t === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class _h {
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
    const a = this.adapter.getResource(e, n);
    if (!a.ok)
      return p({
        actor: e,
        actorId: e.id ?? null,
        actorName: e.name ?? "Ator sem nome",
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
    id: bh(),
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
function bh() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class yh {
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
    return at(this.lastContext);
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
class Ah {
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
class Th {
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
    const n = ln();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: e.speaker,
      content: e.content,
      whisper: $h(),
      flags: {
        ...e.flags,
        [u]: {
          ...Rh(e.flags),
          debugOutput: !0
        }
      }
    }), n.console && e.data !== void 0 && m.info("Debug chat criado.", e.data), !0);
  }
  emit(e, n) {
    const r = ln();
    if (!r.enabled)
      return;
    const o = n.notification ?? No(n);
    r.console && this.emitConsole(e, n), r.ui && this.emitUi(e, o);
  }
  emitConsole(e, n) {
    const r = No(n);
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
function No(t) {
  return t.message ? `${t.title}: ${t.message}` : t.title;
}
function $h() {
  const t = game.users?.filter((e) => e.isGM === !0 && e.id).map((e) => e.id) ?? [];
  return t.length > 0 ? t : game.user?.id ? [game.user.id] : [];
}
function Rh(t) {
  const e = t?.[u];
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const wh = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", ns = `${u}-inline-roll-neutralized`, kh = `${u}-inline-roll-notice`, _r = `data-${u}-inline-roll-neutralized`, xo = `data-${u}-inline-roll-notice`, Eh = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Oo(t) {
  const e = Uh(t.message), n = await Ih(t.message), r = Ch(e);
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
async function Ih(t) {
  const e = Mh(t);
  if (!e || typeof e.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = Sh(e.content);
  return n.replacementCount === 0 || n.content === e.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Fh(e, n.content), replacementCount: n.replacementCount };
}
function Ch(t) {
  const e = t ? Bh(t) : null;
  if (!e)
    return { replacementCount: 0 };
  const n = rs(e);
  return n > 0 && os(Nh(e)), { replacementCount: n };
}
function Sh(t) {
  const e = Lh(t), n = document.createElement("template");
  n.innerHTML = e.content;
  const r = rs(n.content), o = e.replacementCount + r;
  return o === 0 ? { content: t, replacementCount: 0 } : (os(n.content), { content: n.innerHTML, replacementCount: o });
}
function Lh(t) {
  let e = 0;
  return { content: t.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (e += 1, Ph(o.trim()))), replacementCount: e };
}
function rs(t) {
  const e = Dh(t);
  for (const n of e)
    n.replaceWith(vh(xh(n)));
  return e.length;
}
function Dh(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.querySelectorAll(wh))
    n.getAttribute(_r) !== "true" && e.add(n);
  return Array.from(e);
}
function Ph(t) {
  return `<span class="${ns}" ${_r}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${qh(t)}</span>`;
}
function vh(t) {
  const e = document.createElement("span");
  return e.classList.add(ns), e.setAttribute(_r, "true"), e.title = "Rolagem inline ignorada pelo Paranormal Toolkit", e.textContent = t, e;
}
function os(t) {
  if (t.querySelector?.(`[${xo}="true"]`)) return;
  const e = document.createElement("p");
  e.classList.add(kh), e.setAttribute(xo, "true"), e.textContent = Eh, t.append(e);
}
function Nh(t) {
  return t.querySelector(".message-content") ?? t;
}
function xh(t) {
  const n = t.getAttribute("data-formula") ?? Oh(t.getAttribute("data-roll")) ?? t.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Oh(t) {
  if (!t) return null;
  try {
    const e = JSON.parse(t);
    return typeof e.formula == "string" && e.formula.length > 0 ? e.formula : null;
  } catch {
    return null;
  }
}
function Mh(t) {
  return t && typeof t == "object" ? t : null;
}
async function Fh(t, e) {
  if (typeof t.update != "function")
    return !1;
  try {
    return await Promise.resolve(t.update({ content: e })), !0;
  } catch (n) {
    return m.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Bh(t) {
  const e = zh(t);
  return document.querySelector(
    `.chat-message[data-message-id="${e}"], [data-message-id="${e}"]`
  );
}
function Uh(t) {
  if (!t || typeof t != "object") return null;
  const e = t;
  return typeof e.id == "string" && e.id.length > 0 ? e.id : null;
}
function qh(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function zh(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const fe = "ritualRollConfig", pt = "ritual-roll";
function ve() {
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
  const e = t.getFlag(u, fe);
  return On(e);
}
function is(t) {
  return as(t) ?? ve();
}
async function jh(t, e) {
  const n = On(e) ?? On({
    ...ve(),
    ...e
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await t.setFlag(u, fe, n), n;
}
async function Gh(t) {
  const e = t.unsetFlag;
  if (typeof e == "function") {
    await Promise.resolve(e.call(t, u, fe));
    return;
  }
  await t.setFlag(u, fe, null);
}
function On(t) {
  if (!Ne(t)) return null;
  const e = Jh(t.intent);
  if (!e) return null;
  const n = ve();
  return {
    schemaVersion: 1,
    intent: e,
    damageType: pe(t.damageType),
    utilityLabel: pe(t.utilityLabel) ?? n.utilityLabel,
    note: br(t.note),
    forms: t_(t.forms)
  };
}
function Vh(t) {
  switch (t) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function Hh(t) {
  const e = as(t);
  if (!e) return null;
  const n = e.forms.base.formula.trim();
  if (!n) return null;
  const r = Wh(e, n), o = [
    { type: "spendRitualCost" },
    r,
    ...Kh(e)
  ];
  return {
    version: 1,
    label: `Fórmula de ${t.name ?? "ritual"}`,
    steps: o,
    ritualForms: Qh(t, e),
    resistance: e.intent === "damage" ? Zh(t) : void 0
  };
}
function Wh(t, e) {
  const n = {
    type: "rollFormula",
    id: pt,
    formula: e,
    intent: Xh(t.intent)
  };
  return t.intent === "damage" && t.damageType && (n.damageType = t.damageType), n;
}
function Kh(t) {
  switch (t.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${pt}.total`,
          ...Yh(t.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${pt}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function Yh(t) {
  return t ? { damageType: t } : {};
}
function Qh(t, e) {
  const n = e.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [pt]: n
      }
    }
  };
  return Mo(t, "discente") && e.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [pt]: e.forms.discente.formula.trim()
    }
  }), Mo(t, "verdadeiro") && e.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [pt]: e.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Zh(t) {
  const e = ss(t), n = pe(e.skillResis), r = pe(e.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = e_(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function Xh(t) {
  switch (t) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function Jh(t) {
  return t === "damage" || t === "healing" || t === "utility" ? t : null;
}
function t_(t) {
  const e = ve();
  return Ne(t) ? {
    base: Ze(t.base),
    discente: Ze(t.discente),
    verdadeiro: Ze(t.verdadeiro)
  } : e.forms;
}
function Ze(t) {
  return Ne(t) ? { formula: br(t.formula) } : { formula: "" };
}
function Mo(t, e) {
  const n = ss(t), r = e === "discente" ? n.studentForm : n.trueForm;
  return n_(r);
}
function ss(t) {
  const e = t.system;
  return Ne(e) ? e : {};
}
function e_(t) {
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
function n_(t) {
  return t === !0 || t === "true" || t === 1 || t === "1";
}
function br(t) {
  return typeof t == "string" ? t.trim() : "";
}
function pe(t) {
  const e = br(t);
  return e.length > 0 ? e : null;
}
function Ne(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
const Fo = "occultism";
function r_(t) {
  const e = t.system?.ritual?.DT;
  return typeof e == "number" && Number.isFinite(e) ? Math.trunc(e) : null;
}
async function o_(t) {
  const e = r_(t);
  if (e === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await a_(t, Fo);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Qi(n);
  const r = l_(n);
  return {
    skill: Fo,
    skillLabel: "Ocultismo",
    roll: n,
    formula: s_(n),
    total: r,
    difficulty: e,
    success: r >= e,
    diceBreakdown: c_(n)
  };
}
async function a_(t, e) {
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
  return i_(r);
}
function i_(t) {
  return Bo(t) ? t : Array.isArray(t) ? t.find(Bo) ?? null : null;
}
function Bo(t) {
  return !!(t && typeof t == "object" && "evaluate" in t && "total" in t);
}
function s_(t) {
  const e = t.formula;
  return typeof e == "string" && e.trim().length > 0 ? e : "rolagem";
}
function l_(t) {
  const e = t.total;
  return typeof e == "number" && Number.isFinite(e) ? Math.trunc(e) : 0;
}
function c_(t) {
  const e = t.dice;
  if (!Array.isArray(e)) return null;
  const n = e.find(u_);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function u_(t) {
  return !!(t && typeof t == "object" && t.faces === 20);
}
function d_(t) {
  switch (m_(t)) {
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
      return f_(String(t ?? ""));
  }
}
function m_(t) {
  if (t == null) return null;
  const e = String(t).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return e.length > 0 ? e : null;
}
function f_(t) {
  const e = t.trim();
  return e ? `${e.charAt(0).toLocaleUpperCase()}${e.slice(1)}` : "Sem tipo";
}
function p_(t) {
  return {
    header: {
      eyebrow: Hn,
      title: t.ritual.name ?? "Ritual sem nome",
      subtitle: y_(t.ritual)
    },
    forms: t.variantOptions.map((e) => g_(e, t.cost)),
    cost: {
      spendResourceChecked: t.defaultSpendResource,
      baseCostText: t.cost ? `${t.cost.amount} ${t.cost.resource}` : "não resolvido",
      casterName: t.actor.name ?? "Ator sem nome",
      targetText: t.targetNames.length > 0 ? t.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: b_(t.automationStatus ?? "assisted")
  };
}
function g_(t, e) {
  const n = h_(t);
  return {
    variant: t.variant,
    label: t.label,
    enabled: t.enabled,
    checked: t.variant === "base",
    costText: t.enabled ? t.finalCostText ?? __(e) : "—",
    details: n
  };
}
function h_(t) {
  return t.enabled ? t.details.map((e) => e.trim()).filter((e) => e.length > 0).filter((e) => !e.toLocaleLowerCase().startsWith("custo final")) : [t.unavailableReason ?? "não disponível neste ritual"];
}
function __(t) {
  return t ? `${t.amount} ${t.resource}` : "custo não resolvido";
}
function b_(t) {
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
function y_(t) {
  const e = t.system, n = [T_(e?.element), A_(e?.circle)].filter(w_);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function A_(t) {
  const e = typeof t == "string" ? Number(t) : t;
  return typeof e != "number" || !Number.isFinite(e) ? null : `${e}º Círculo`;
}
function T_(t) {
  if (typeof t != "string" || t.trim().length === 0) return null;
  switch ($_(t)) {
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
      return R_(t);
  }
}
function $_(t) {
  return t.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function R_(t) {
  const e = t.trim();
  return e ? `${e.charAt(0).toLocaleUpperCase()}${e.slice(1)}` : null;
}
function w_(t) {
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
function ge(t) {
  return typeof t == "string" && ls.includes(t);
}
const { ApplicationV2: k_ } = foundry.applications.api;
class xt extends k_ {
  constructor(e, n) {
    super({
      id: `${u}-ritual-cast-${e.actor.id ?? foundry.utils.randomID()}-${e.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${e.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = p_(e), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: xt.onCast,
      cancel: xt.onCancel
    }
  };
  static async request(e) {
    return new Promise((n) => {
      new xt(e, n).render({ force: !0 });
    });
  }
  async _renderHTML(e, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(e, n, r) {
    n.replaceChildren(e);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    I_(o, (a) => {
      this.selectedVariant = a;
    }), C_(o, (a) => {
      this.spendResource = a;
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
          ${this.model.forms.map(E_).join("")}
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
    const n = D_(e), r = S_(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(e) {
    e.preventDefault(), this.settle(null), await this.close();
  }
  settle(e) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(e));
  }
}
function E_(t) {
  const e = t.checked ? "checked" : "", n = t.enabled ? "" : "disabled", r = t.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = t.details.map((a) => `<span>${E(a)}</span>`).join("");
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
function I_(t, e) {
  const n = Array.from(t.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Uo(t, o, e)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Uo(t, o, e));
    });
  const r = us(t);
  r && e(r);
}
function Uo(t, e, n) {
  const r = e.querySelector('input[name="variant"]');
  !r || r.disabled || !ge(r.value) || (r.checked = !0, t.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), us(t));
}
function us(t) {
  const e = t.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of e) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && ge(o.value) && (n = o.value);
  }
  return n && (t.dataset.paranormalToolkitSelectedVariant = n), n;
}
function C_(t, e) {
  const n = t.querySelector('input[name="spendResource"]');
  n && (e(n.checked), n.addEventListener("change", () => {
    e(n.checked);
  }));
}
function S_(t, e, n) {
  const r = L_(t) ?? n, o = t?.querySelector('input[name="spendResource"]')?.checked ?? e;
  return {
    variant: r,
    spendResource: o
  };
}
function L_(t) {
  const e = t?.querySelector('input[name="variant"]:checked')?.value;
  if (ge(e)) return e;
  const n = t?.dataset.paranormalToolkitSelectedVariant;
  return ge(n) ? n : null;
}
function D_(t) {
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
async function P_(t) {
  return xt.request(t);
}
const yr = {
  label: "Padrão"
}, v_ = {
  label: "Discente",
  extraCost: 2
}, N_ = {
  label: "Verdadeiro",
  extraCost: 5
};
class x_ {
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
    const r = this.resolveCostPreview(e), o = kb(n), a = $b(
      n,
      e.item,
      r,
      o
    ), s = await P_({
      actor: e.actor,
      ritual: e.item,
      targetNames: e.targets.map((w) => w.name),
      cost: r,
      defaultSpendResource: Db(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = O_(s), c = Ib(
      n,
      e.item,
      l.variant,
      o
    ), d = Pa();
    let f = null;
    if (d) {
      const w = await F_(
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
        f = await o_(
          e.actor
        );
      } catch (G) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: G instanceof Error ? G.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: G
        };
      }
    }
    const y = M_(
      n,
      l,
      c,
      r,
      {
        includeCostSteps: !d
      }
    );
    if (y.steps.length === 0) {
      const w = Eb(
        e,
        l
      ), G = qo(
        e.actor,
        f,
        c,
        r
      ), Dr = zo(
        n,
        l,
        c,
        r,
        w,
        e,
        f
      );
      return G.length > 0 ? {
        status: "ready",
        workflowContext: w,
        actions: G,
        summaryLines: Dr
      } : {
        status: "completed-without-actions",
        workflowContext: w,
        summaryLines: Dr
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
    const $ = T.value.context, g = V_(
      n,
      e,
      $
    ), x = U_(
      n,
      e
    ), kt = qo(
      e.actor,
      f,
      c,
      r
    ), Et = zo(
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
    if (!x.ok)
      return {
        status: "failed",
        reason: x.reason,
        message: x.message
      };
    const It = [
      ...kt,
      ...g.actions,
      ...x.actions
    ];
    return It.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: $,
      summaryLines: Et
    } : {
      status: "ready",
      workflowContext: $,
      actions: It,
      summaryLines: Et
    };
  }
  async applyAction(e) {
    return me(
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
function O_(t) {
  return {
    variant: t.variant,
    spendResource: t.spendResource === !0
  };
}
function M_(t, e, n, r, o) {
  const a = [], s = e.spendResource === !0;
  for (const l of t.steps)
    l.type === "modifyResource" || l.type === "chatCard" || Tr(l) && (!o.includeCostSteps || !s) || a.push(B_(l, n));
  return o.includeCostSteps && s && r && Pb(n.extraCost) && a.push({
    type: "spendResource",
    actor: "self",
    resource: r.resource,
    amount: n.extraCost
  }), {
    ...t,
    label: `${t.label} · Conjuração assistida`,
    steps: a
  };
}
async function F_(t, e, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Gt(o, r);
  if (!a)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (a.amount <= 0) return { ok: !0 };
  const s = await t.spend(
    e,
    a.resource,
    a.amount
  );
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function B_(t, e) {
  if (t.type !== "rollFormula") return t;
  const n = e.rollFormulaOverrides?.[t.id];
  return n ? {
    ...t,
    formula: n
  } : t;
}
function qo(t, e, n, r) {
  if (!e || e.success) return [];
  const o = Gt(r, n);
  if (!o || o.amount <= 0) return [];
  const a = t.name ?? "Ator sem nome";
  return [
    {
      kind: "resource-operation",
      actor: t,
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
function U_(t, e) {
  const n = [];
  for (const r of t.conditionApplications ?? []) {
    const o = Ar(r.actor, e);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const a of o) {
      const s = ni(a);
      n.push(
        q_(
          r,
          a,
          e.item,
          s
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function q_(t, e, n, r) {
  const o = e.name ?? "Ator sem nome", a = t.label ?? G_(t.conditionId);
  return {
    kind: "condition-application",
    actor: e,
    actorName: o,
    conditionId: t.conditionId,
    conditionLabel: a,
    duration: z_(
      t.duration ?? null,
      r
    ),
    source: t.source ?? null,
    originUuid: n.uuid ?? null,
    label: j_(a, t.duration),
    executedLabel: t.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: t.actionSectionId ?? "apply-effects",
    actionSectionTitle: t.actionSectionTitle ?? "Aplicar efeito"
  };
}
function z_(t, e) {
  return t ? {
    ...t,
    expiry: t.expiry ?? "turnStart",
    anchor: e
  } : null;
}
function j_(t, e) {
  const n = e?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${t}: ${r}`;
  }
  return t;
}
function G_(t) {
  const e = t.trim();
  return e.length === 0 ? "Condição" : e.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function V_(t, e, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of t.steps) {
    if (a.type !== "modifyResource") continue;
    const s = de(a, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = Ar(a.actor, e);
    if (l.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const c of l) {
      if (H_(a)) {
        W_(
          o,
          c,
          K_(a, n, s.value)
        );
        continue;
      }
      r.push(Q_(a, c, s.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...Y_(
        t,
        e.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function H_(t) {
  return t.operation === "damage" && t.resource === "PV";
}
function W_(t, e, n) {
  const r = tb(e), o = t.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  t.set(r, {
    actor: e,
    entries: [n]
  });
}
function K_(t, e, n) {
  const r = eb(t.amountFrom), o = r ? e.rolls[r]?.damageType : void 0;
  return {
    step: t,
    amount: n,
    damageType: t.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function Y_(t, e, n, r) {
  const o = ab(t), a = o.length > 1 ? lb() : void 0;
  return o.map((s) => {
    const l = r.map(
      (d, f) => {
        const y = ib(d.amount, s);
        return {
          id: Z_(d, s, f),
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
      label: X_(c, s, o.length > 1),
      executedLabel: J_(
        n.name ?? "Ator sem nome",
        s,
        o.length > 1
      ),
      choiceGroupId: a,
      choiceGroupResolvedLabel: a ? "✓ Outra opção escolhida" : void 0,
      actionSectionId: "apply-damage",
      actionSectionTitle: "Aplicar danos",
      source: "item-use.damage-action",
      originUuid: e.uuid ?? null
    };
  });
}
function Q_(t, e, n) {
  const r = e.name ?? "Ator sem nome", o = ob(t);
  return {
    kind: "resource-operation",
    actor: e,
    actorName: r,
    resource: t.resource,
    operation: t.operation,
    amount: n,
    label: nb(t, r, n),
    executedLabel: rb(t, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function Z_(t, e, n) {
  return `${t.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${e.id}`;
}
function X_(t, e, n) {
  return n ? `${e.id === "normal" ? "Normal" : e.label}: ${t} PV` : `Dano: ${t} PV`;
}
function J_(t, e, n) {
  return n ? `✓ ${e.id === "normal" ? "dano normal" : e.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}`;
}
function tb(t) {
  return t.uuid ?? t.id ?? t.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function eb(t) {
  const e = t?.trim();
  if (!e) return null;
  if (e.endsWith(".total"))
    return e.slice(0, -6);
  const [n] = e.split(".");
  return n && n.length > 0 ? n : null;
}
function nb(t, e, n) {
  return t.operation === "heal" && t.resource === "PV" ? `Curar ${n} PV` : t.operation === "damage" ? `Dano: ${n} ${t.resource}` : t.operation === "recover" ? `Recuperar ${n} ${t.resource}` : t.operation === "spend" ? `Gastar ${n} ${t.resource}` : `Aplicar ${n} ${t.resource}`;
}
function rb(t, e) {
  return t.operation === "heal" && t.resource === "PV" ? `✓ ${e} curado` : t.operation === "damage" ? `✓ Dano aplicado em ${e}` : t.operation === "recover" ? `✓ ${e} recuperado` : t.operation === "spend" ? `✓ Recurso gasto de ${e}` : "✓ Ação aplicada";
}
function ob(t) {
  return t.operation === "damage" && t.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : t.operation === "heal" && t.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : t.operation === "recover" || t.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function ab(t) {
  const e = t.resistance?.damageApplications;
  return e && e.length > 0 ? e : t.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function ib(t, e) {
  const n = t * e.multiplier, r = sb(
    n,
    e.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function sb(t, e) {
  switch (e) {
    case "ceil":
      return Math.ceil(t);
    case "round":
      return Math.round(t);
    case "floor":
      return Math.floor(t);
  }
}
function lb() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Ar(t, e) {
  switch (t) {
    case "self":
      return e.actor ? [e.actor] : [];
    case "target":
      return e.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function zo(t, e, n, r, o, a, s = null) {
  return [
    `Forma: ${cs(e.variant)}`,
    mb(e, n, r),
    ...db(s),
    ...Object.values(o.rolls).flatMap(fb),
    ...cb(t, a),
    ...pb(t.resistance),
    ...Ab(n)
  ];
}
function cb(t, e) {
  return ub(t) ? Ar("target", e).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function ub(t) {
  return t.steps.some(
    (e) => e.type === "modifyResource" && e.actor === "target"
  ) || (t.conditionApplications ?? []).some(
    (e) => e.actor === "target"
  );
}
function db(t) {
  return t ? [
    `Conjuração: ${t.skillLabel} = ${Math.trunc(t.total)}`,
    `Conjuração Fórmula: ${t.formula}`,
    `Conjuração DT: ${t.difficulty}`,
    `Conjuração Resultado: ${t.success ? "Sucesso" : "Falha"}`,
    ...t.diceBreakdown ? [`Dados (Conjuração): ${t.diceBreakdown}`] : []
  ] : [];
}
function mb(t, e, n) {
  const r = Gt(n, e);
  return r ? t.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : t.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function fb(t) {
  const n = [`${Tb(t)}: ${t.formula} = ${Math.trunc(t.total)}`], r = gb(t.roll);
  return r && n.push(`Dados: ${r}`), t.damageType && n.push(`Tipo: ${d_(t.damageType)}`), n;
}
function pb(t) {
  return t ? [
    `Resistência: ${t.summary}`,
    `Resistência Perícia: ${t.skill}`,
    `Resistência Rótulo: ${t.label}`
  ] : [];
}
function gb(t) {
  if (!t || typeof t != "object") return null;
  const e = t.terms;
  if (!Array.isArray(e)) return null;
  const n = [];
  let r = "+";
  for (const o of e) {
    if (!o || typeof o != "object") continue;
    const a = o;
    if (a.operator === "+" || a.operator === "-") {
      r = a.operator;
      continue;
    }
    const s = hb(a);
    s && (yb(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function hb(t) {
  const e = _b(t);
  return e.length > 0 ? { value: `(${e.join(", ")})` } : bb(t);
}
function _b(t) {
  return Array.isArray(t.results) ? t.results.flatMap((e) => {
    if (!e || typeof e != "object") return [];
    const n = e;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function bb(t) {
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
function yb(t, e, n) {
  if (t.length === 0) {
    t.push(e === "-" ? `- ${n}` : n);
    return;
  }
  t.push(`${e} ${n}`);
}
function Ab(t) {
  return (t.notes ?? []).map((e) => `Observação: ${e}`);
}
function Tb(t) {
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
function $b(t, e, n, r) {
  return ls.map((o) => {
    const a = ds(
      t,
      e,
      o,
      r
    ), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? cs(o),
      enabled: s,
      details: a ? Rb(a, n, r) : [],
      finalCostText: a ? wb(n, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function Rb(t, e, n) {
  const r = [], o = Object.values(t.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = Gt(e, t);
  return r.push(
    a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"
  ), r;
}
function Gt(t, e) {
  return t ? {
    resource: t.resource,
    amount: t.amount + (e.extraCost ?? 0)
  } : null;
}
function wb(t, e) {
  const n = Gt(t, e);
  return n ? `${n.amount} ${n.resource}` : null;
}
function kb(t) {
  return !t.resistance && t.steps.length > 0 && t.steps.every(Tr);
}
function Eb(t, e) {
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
function Ib(t, e, n, r) {
  return ds(t, e, n, r) ?? yr;
}
function ds(t, e, n, r) {
  const o = t.ritualForms?.[n] ?? null;
  return o || (r ? Sb(e, n) ? Cb(n) : null : n === "base" ? yr : null);
}
function Cb(t) {
  switch (t) {
    case "base":
      return yr;
    case "discente":
      return v_;
    case "verdadeiro":
      return N_;
  }
}
function Sb(t, e) {
  if (e === "base") return !0;
  const n = e === "discente" ? "system.studentForm" : "system.trueForm";
  return Lb(foundry.utils.getProperty(t, n));
}
function Lb(t) {
  return t === !0 || t === "true" || t === 1 || t === "1";
}
function Db(t) {
  return t.steps.some(Tr);
}
function Tr(t) {
  return t.type === "spendResource" || t.type === "spendRitualCost";
}
function Pb(t) {
  return typeof t == "number" && Number.isFinite(t) && t > 0;
}
const ms = "itemUsePrompts", fs = "chatCard", xe = "data-paranormal-toolkit-prompt-id", Oe = "data-paranormal-toolkit-pending-id", $r = "data-paranormal-toolkit-executed-label", Mn = "data-paranormal-toolkit-choice-group", ps = "data-paranormal-toolkit-skipped-label", jo = "data-paranormal-toolkit-action-section", Go = "data-paranormal-toolkit-detail-key", Vo = "data-paranormal-toolkit-roll-card", Rr = "data-paranormal-toolkit-roll-detail-toggle", gs = "data-paranormal-toolkit-roll-detail-id", hs = "data-paranormal-toolkit-resistance-roll-button", _s = "data-paranormal-toolkit-resistance-skill", bs = "data-paranormal-toolkit-resistance-skill-label", ys = "data-paranormal-toolkit-resistance-target-actor-id", As = "data-paranormal-toolkit-resistance-target-name", Ts = "data-paranormal-toolkit-resistance-roll-result", Ho = "data-paranormal-toolkit-system-card-replaced", vb = `[${Oe}]`, Nb = `[${Rr}]`, xb = `[${hs}]`, Fn = `${u}-chat-enrichment`, h = `${u}-item-use-prompt`, Ob = `${h}__actions`, Wo = `${h}__details`, $s = `${h}__summary`, Mb = `${h}__title`, Rs = `${h}__button--executed`, Ko = `${h}__roll-card`;
let Yo = !1, Bn = null;
const N = /* @__PURE__ */ new Map(), Fb = [0, 100, 500, 1500, 3e3], Bb = 3e4, Ub = [0, 100, 500, 1500, 3e3];
function qb(t) {
  if (Bn = t, Yo) {
    Zo(t);
    return;
  }
  const e = (n, r) => {
    ks(n, r, t);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Yo = !0, Zo(t);
}
async function Qo(t) {
  const e = ws(t);
  N.set(t.pendingId, e), await Er(e) || xs(e), Es(t.pendingId);
}
async function zb(t) {
  const e = ws({
    ...t,
    actionPayload: null
  });
  e.executed = !0, e.executedLabel = t.executedLabel ?? "✓ Ritual conjurado", N.set(t.pendingId, e), await Er(e) || xs(e), Es(t.pendingId);
}
async function Xe(t, e) {
  const n = N.get(t);
  N.delete(t), n && await qy(n, e);
}
function wr(t) {
  const e = qs();
  for (const n of e) {
    const r = j(n)[t];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function jb(t, e) {
  const n = wr(t);
  if (!n) return;
  const r = j(n.message), o = r[t];
  o && (r[t] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await $t(n.message, r));
}
async function Gb(t, e, n) {
  if (!e) return;
  const r = wr(t);
  if (!r) return;
  const o = j(r.message);
  let a = !1;
  for (const [s, l] of Object.entries(o))
    s !== t && l.choiceGroupId === e && (o[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await $t(r.message, o);
}
function ws(t) {
  const e = Z(t.context.message), n = t.context.targets.find((s) => jn(s)), r = n ? jn(n) : null, o = t.resistanceTargetActor ?? r, a = t.resistanceTargetName ?? n?.name ?? o?.name ?? t.context.targets[0]?.name ?? null;
  return {
    ...t,
    createdAt: Date.now(),
    messageId: e,
    itemId: t.context.item.id ?? null,
    actorId: t.context.actor?.id ?? null,
    itemName: t.context.item.name ?? null,
    resistanceTargetActorId: t.resistanceTargetActorId ?? o?.id ?? null,
    resistanceTargetName: a,
    resistanceRollResult: null,
    actionPayload: t.actionPayload ?? null,
    choiceGroupId: t.choiceGroupId ?? null,
    skippedLabel: t.skippedLabel ?? null,
    actionSectionId: t.actionSectionId ?? null,
    actionSectionTitle: t.actionSectionTitle ?? null,
    summary: hy(t.context),
    executed: !1
  };
}
function ks(t, e, n) {
  Uy();
  const r = Fe(e);
  if (!r) return;
  const o = My(t, r);
  o.length > 0 && he(r);
  for (const a of o)
    Un(r, a);
  Ss(r, n), qn(r), zn(r);
}
function Zo(t) {
  for (const e of Ub)
    globalThis.setTimeout(() => {
      Vb(t);
    }, e);
}
function Vb(t) {
  for (const e of Hb()) {
    const n = Me(e);
    Wb(n) && ks(n, e, t);
  }
}
function Hb() {
  const t = /* @__PURE__ */ new Set();
  for (const e of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = e.classList.contains("chat-message") ? e : e.closest(".chat-message") ?? e;
    n.dataset.messageId && t.add(n);
  }
  return Array.from(t);
}
function Wb(t) {
  return t ? Ir(t) ? !0 : jy(t).length > 0 : !1;
}
function Es(t) {
  const e = N.get(t);
  if (!e) return;
  const n = e.messageId ? Fy(e.messageId) : null;
  if (n) {
    na(n, e), he(n), Un(n, e), Xo(n), qn(n), zn(n);
    return;
  }
  if (e.messageId) {
    Vn(e);
    return;
  }
  const r = By(e);
  if (r) {
    na(r, e), he(r), Un(r, e), Xo(r), qn(r), zn(r);
    return;
  }
  Vn(e);
}
function Xo(t) {
  Bn && Ss(t, Bn);
}
function he(t) {
  const e = Kb();
  t.classList.toggle(`${h}--system-card-replaced`, e);
  const n = Cs(t);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, e), !e) || n.getAttribute(Ho) === "true") return;
  const r = n.querySelector(`.${Fn}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Ho, "true");
}
function Kb() {
  try {
    return Zl() === "replace";
  } catch {
    return !1;
  }
}
function Un(t, e) {
  if (he(t), t.querySelector(`[${xe}="${Rt(e.pendingId)}"]`)) return;
  const n = Yb(t, e);
  Zb(n, e), dy(n, my(e)).append(gy(e));
}
function Yb(t, e) {
  const n = t.querySelector(`.${Fn}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Fn, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Mb), s.textContent = Qb(e);
  const l = document.createElement("span");
  return l.classList.add($s), l.textContent = e.summary, o.append(a, s, l), r.append(o), by(t).append(r), r;
}
function Qb(t) {
  const e = I(t.summaryLines ?? [], "Forma"), n = t.itemName ?? t.title ?? "Automação assistida";
  return e ? `${n} • ${e}` : n;
}
function Zb(t, e) {
  const n = e.summaryLines ?? [], r = vs(n, e);
  if (r) {
    Xb(t, r, e);
    return;
  }
  fy(t, n);
}
function Xb(t, e, n) {
  if (t.querySelector(`[${Vo}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Ko, `${Ko}--${e.intent}`), r.setAttribute(Vo, "true"), e.castingCheck && Jo(r, ty(e.castingCheck), n.pendingId, "casting"), Jb(e) && Jo(r, ey(e), n.pendingId, "effect"), iy(r, e), sy(r, e, n), uy(r, e), t.append(r);
}
function Jb(t) {
  return t.intent !== "casting";
}
function ty(t) {
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
function ey(t) {
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
function Jo(t, e, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${e.kind}`
  ), e.status && o.classList.add(`${h}__workflow-section--${e.status}`);
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = e.title, a.append(s), e.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = e.statusLabel, a.append(l);
  }
  if (o.append(a), e.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = e.description, o.append(l);
  }
  ny(o, e), cy(o, e.detailRows, n, r, `▸ Detalhes de ${e.title.toLowerCase()}`), t.append(o);
}
function ny(t, e) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = e.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(e.total), n.append(r, o);
  const a = ry(e.formula, e.diceBreakdown);
  a && n.append(a), t.append(n);
}
function ry(t, e) {
  const n = oy(e);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of ay(n, t)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function oy(t) {
  return t ? (/\(([^)]+)\)/u.exec(t)?.[1] ?? t).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function ay(t, e) {
  if (t.length <= 1) return t.map((r) => ({ value: r, active: !0 }));
  const n = e.toLowerCase();
  return n.includes("kh") ? ta(t, "highest") : n.includes("kl") ? ta(t, "lowest") : t.map((r) => ({ value: r, active: !0 }));
}
function ta(t, e) {
  const n = e === "highest" ? Math.max(...t) : Math.min(...t);
  let r = !1;
  return t.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function iy(t, e) {
  const n = [
    e.form ? `Forma: ${e.form}` : null,
    e.cost,
    e.damageType ? `Tipo: ${e.damageType}` : null
  ].filter(sA);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  t.append(r);
}
function sy(t, e, n) {
  if (!e.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = ly(e, n);
  o.append(a), s && o.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = e.resistance, r.append(o, l), e.resistanceRollResult && r.append(Is(e.resistanceRollResult)), t.append(r);
}
function ly(t, e) {
  if (!t.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(xe, e.pendingId), n.setAttribute(hs, "true"), n.setAttribute(_s, t.resistanceSkill), n.setAttribute(bs, t.resistanceSkillLabel ?? t.resistanceSkill), e.resistanceTargetActorId && n.setAttribute(ys, e.resistanceTargetActorId), e.resistanceTargetName && n.setAttribute(As, e.resistanceTargetName), t.resistanceRollResult)
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
function cy(t, e, n, r, o) {
  const a = e.filter((d) => d.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Rr, s), l.setAttribute("aria-expanded", "false"), l.textContent = o;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(gs, s), c.hidden = !0;
  for (const d of a) {
    const f = document.createElement("dt");
    f.textContent = d.label;
    const y = document.createElement("dd");
    y.textContent = d.value, c.append(f, y);
  }
  t.append(l, c);
}
function uy(t, e) {
  if (e.notes.length === 0 && e.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...e.notes, ...e.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  t.append(n);
}
function dy(t, e) {
  const n = `[${jo}="${Rt(e.id)}"]`, r = t.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Ob), o.setAttribute(jo, e.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = e.title, o.append(a), t.append(o), o;
}
function my(t) {
  const e = t.actionSectionId?.trim(), n = t.actionSectionTitle?.trim();
  if (e && n)
    return { id: e, title: n };
  const r = vs(t.summaryLines ?? [], t);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function fy(t, e) {
  if (e.length === 0) return;
  const n = py(t);
  for (const r of e) {
    const o = lA(r);
    if (n.querySelector(`[${Go}="${Rt(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(Go, o), n.append(a);
  }
}
function py(t) {
  const e = t.querySelector(`.${Wo}`);
  if (e)
    return e;
  const n = document.createElement("ul");
  return n.classList.add(Wo), t.append(n), n;
}
function gy(t) {
  const e = document.createElement("button");
  return e.type = "button", e.classList.add(`${h}__button`), e.setAttribute(xe, t.pendingId), t.executed ? (e.disabled = !0, e.textContent = t.executedLabel ?? "✓ Automação aplicada", e.classList.add(Rs), e) : (e.textContent = t.buttonLabel ?? "Aplicar automação", e.setAttribute(Oe, t.pendingId), e.setAttribute($r, t.executedLabel ?? "✓ Automação aplicada"), t.choiceGroupId && (e.setAttribute(Mn, t.choiceGroupId), e.setAttribute(ps, t.skippedLabel ?? "✓ Outra opção escolhida")), e);
}
function hy(t) {
  const e = t.actor?.name ?? t.token?.name ?? "Origem não resolvida", n = _y(t);
  return `${e} → ${n}`;
}
function _y(t) {
  return t.targets.length > 0 ? t.targets.map((e) => e.name).join(", ") : "nenhum alvo";
}
function by(t) {
  return Cs(t) ?? t;
}
function Cs(t) {
  return t.classList.contains("message-content") ? t : t.querySelector(".message-content");
}
function Ss(t, e) {
  const n = Fe(t);
  if (!n) return;
  const r = n.querySelectorAll(vb);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Py(o, e);
    }));
}
function qn(t) {
  const e = Fe(t);
  if (!e) return;
  const n = e.querySelectorAll(Nb);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      yy(e, r);
    }));
}
function zn(t) {
  const e = Fe(t);
  if (!e) return;
  const n = e.querySelectorAll(xb);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Ay(e, r);
    }));
}
function yy(t, e) {
  const n = e.getAttribute(Rr);
  if (!n) return;
  const r = t.querySelector(`[${gs}="${Rt(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, e.setAttribute("aria-expanded", o ? "true" : "false"), e.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Ay(t, e) {
  const n = e.getAttribute(xe), r = e.getAttribute(_s), o = e.getAttribute(bs) ?? (r ? jt(r) : "Resistência");
  if (!n || !r) return;
  const a = Ry(t, n), s = wy(a, e);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  e.disabled = !0;
  const l = e.innerHTML;
  e.textContent = "...";
  try {
    const c = await ei(s, r);
    await Sy(c.roll);
    const d = {
      skill: r,
      skillLabel: o,
      formula: c.formula,
      total: c.total,
      targetName: s.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: c.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Ty(e, d), $y(e, d), Ly(n, d), await Dy(t, n, d);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), e.innerHTML = l;
  } finally {
    e.disabled = !1;
  }
}
function Ty(t, e) {
  t.classList.add(`${h}__resistance-roll-button--rolled`), t.setAttribute(Ts, String(e.total)), t.textContent = String(e.total), t.title = `Rolar ${e.skillLabel} novamente`, t.setAttribute("aria-label", t.title);
}
function $y(t, e) {
  const n = t.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Is(e);
  if (r) {
    r.textContent = Ds(e);
    return;
  }
  n.append(o);
}
function Ry(t, e) {
  const n = N.get(e);
  if (n) return n;
  const r = Me(t);
  return j(r)[e] ?? null;
}
function wy(t, e) {
  const n = t?.resistanceTargetActor;
  if (U(n)) return n;
  const o = t?.context?.targets.map(jn).find(U) ?? null;
  if (o) return o;
  const a = e.getAttribute(ys) ?? t?.resistanceTargetActorId ?? null, s = a ? Ey(a) : null;
  return s || Iy(
    e.getAttribute(As) ?? t?.resistanceTargetName ?? ky(e)
  );
}
function ky(t) {
  const n = t.closest(`.${h}`)?.querySelector(`.${$s}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function jn(t) {
  const e = t.actor;
  if (U(e)) return e;
  const n = t.token, r = Bt(n);
  if (r) return r;
  const o = t.document;
  return Bt(o);
}
function Bt(t) {
  if (!t || typeof t != "object") return null;
  const e = t.actor;
  if (U(e)) return e;
  const n = t.document?.actor;
  return U(n) ? n : null;
}
function Ey(t) {
  const n = game.actors?.get?.(t);
  return U(n) ? n : Ls().map((a) => Bt(a)).find((a) => a?.id === t) ?? null;
}
function Iy(t) {
  const e = gt(t);
  if (!e) return null;
  const n = Ls().filter((a) => gt(Cy(a)) === e).map((a) => Bt(a)).find(U) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => U(a) && gt(a.name) === e);
  return U(o) ? o : null;
}
function Ls() {
  const t = canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function Cy(t) {
  if (!t || typeof t != "object") return null;
  const e = t.name;
  if (typeof e == "string") return e;
  const n = t.document?.name;
  return typeof n == "string" ? n : Bt(t)?.name ?? null;
}
function gt(t) {
  const e = t?.trim().toLocaleLowerCase();
  return e && e.length > 0 ? e : null;
}
function U(t) {
  return !!(t && typeof t == "object" && "system" in t);
}
function Ds(t) {
  const e = t.diceBreakdown ? ` ${t.diceBreakdown}` : "";
  return `${t.skillLabel}: ${t.formula}${e} = ${t.total}`;
}
async function Sy(t) {
  const e = game.dice3d;
  typeof e?.showForRoll == "function" && await Promise.resolve(e.showForRoll(t, game.user, !0));
}
function Ly(t, e) {
  const n = N.get(t);
  n && (n.resistanceRollResult = e);
}
async function Dy(t, e, n) {
  const r = Me(t);
  if (r)
    try {
      const o = j(r), a = o[e];
      if (!a) return;
      o[e] = {
        ...a,
        resistanceRollResult: n
      }, await $t(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Me(t) {
  const n = (t.closest("[data-message-id]") ?? t).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return z(r?.get?.(n));
}
async function Py(t, e) {
  const n = t.getAttribute(Oe);
  if (!n) return;
  t.disabled = !0;
  const r = t.textContent;
  if (t.textContent = "Aplicando...", await e(n)) {
    Ps(t, t.getAttribute($r) ?? "✓ Automação aplicada"), vy(t);
    return;
  }
  t.disabled = !1, t.textContent = r;
}
function Ps(t, e) {
  t.disabled = !0, t.textContent = e, t.classList.add(Rs), t.removeAttribute(Oe), t.removeAttribute($r);
}
function vy(t) {
  const e = t.getAttribute(Mn);
  if (!e) return;
  const n = t.closest(`.${h}`) ?? t.parentElement;
  if (!n) return;
  const r = `[${Mn}="${Rt(e)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === t) continue;
    const a = o.getAttribute(ps) ?? "✓ Outra opção escolhida";
    Ps(o, a);
  }
}
function vs(t, e) {
  const n = t.map(kr).filter(aA), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = I(t, "Forma"), a = I(t, "Custo"), s = I(t, "Dados") ?? I(t, `Dados (${r.label})`), l = I(t, "Tipo"), c = I(t, "Resistência"), d = I(t, "Resistência Perícia"), f = I(t, "Resistência Rótulo") ?? (d ? jt(d) : null), y = Ns(t, "Observação"), T = t.filter((g) => Oy(g, r)), $ = Ny(t);
  return {
    ...r,
    itemName: e.itemName ?? e.title ?? "Automação assistida",
    form: o,
    cost: a,
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
function Ny(t) {
  const e = t.map(kr).find((a) => a?.intent === "casting") ?? null, n = I(t, "Conjuração DT"), r = I(t, "Conjuração Resultado");
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
function kr(t) {
  const e = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(t.trim());
  if (!e) return null;
  const [, n, r, o] = e, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: xy(n)
  } : null;
}
function xy(t) {
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
function Oy(t, e) {
  return t.startsWith("Forma:") || t.startsWith("Custo:") || t.startsWith("Dados:") || t.startsWith(`Dados (${e.label}):`) || t.startsWith("Tipo:") || t.startsWith("Resistência:") || t.startsWith("Resistência Perícia:") || t.startsWith("Resistência Rótulo:") || t.startsWith("Observação:") || t.startsWith("Conjuração Fórmula:") || t.startsWith("Conjuração DT:") || t.startsWith("Conjuração Resultado:") || t.startsWith("Dados (Conjuração):") || kr(t) ? !1 : t.trim().length > 0;
}
function My(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const r of N.values())
    Gn(r, t, e) && n.set(r.pendingId, r);
  for (const r of zy(t))
    Gn(r, t, e) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Gn(t, e, n) {
  const r = Z(e) ?? n.dataset.messageId ?? null;
  return t.messageId ? t.messageId === r : !t.itemId || !ea(n, "itemId", t.itemId) ? !1 : !t.actorId || ea(n, "actorId", t.actorId);
}
function ea(t, e, n) {
  if (t.dataset[e] === n)
    return !0;
  const r = `data-${cA(e)}`;
  for (const o of t.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Fy(t) {
  const e = Rt(t);
  return document.querySelector(
    `.chat-message[data-message-id="${e}"], [data-message-id="${e}"]`
  );
}
function By(t) {
  for (const e of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Gn(t, null, e))
      return e;
  return null;
}
function Uy() {
  const t = Date.now(), e = 300 * 1e3;
  for (const [n, r] of N.entries())
    t - r.createdAt > e && N.delete(n);
}
async function na(t, e) {
  const n = Me(t);
  if (!n) return !1;
  try {
    const r = j(n);
    return r[e.pendingId] = Cr(e, Z(n)), await $t(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Er(t) {
  const e = Fs(t);
  if (!e) return !1;
  try {
    const n = j(e);
    return n[t.pendingId] = Cr(t, Z(e)), await $t(e, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function xs(t) {
  for (const e of Fb)
    globalThis.setTimeout(() => {
      Vn(t);
    }, e);
}
async function Vn(t) {
  const e = Fs(t);
  if (Ir(e)?.prompts.some((o) => o.pendingId === t.pendingId))
    return !0;
  const r = await Er(t);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: t.pendingId,
    itemId: t.itemId,
    itemName: t.itemName,
    actorId: t.actorId,
    messageId: t.messageId
  }), r;
}
async function qy(t, e) {
  const n = Ms(t.context.message);
  if (n)
    try {
      const r = j(n), o = r[t.pendingId] ?? Cr(t, Z(n));
      r[t.pendingId] = {
        ...o,
        executedLabel: e ?? o.executedLabel,
        executed: !0
      }, await $t(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function zy(t) {
  return Object.values(j(z(t))).filter(Vt);
}
function j(t) {
  if (!t) return {};
  const e = {}, n = Ir(t);
  for (const r of n?.prompts ?? [])
    e[r.pendingId] = r;
  for (const [r, o] of Object.entries(Os(t)))
    e[r] ??= o;
  return e;
}
function jy(t) {
  return Object.values(Os(z(t))).filter(Vt);
}
function Os(t) {
  if (!t) return {};
  const e = t.getFlag?.(u, ms);
  if (!bt(e))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(e))
    Vt(o) && (n[r] = o);
  return n;
}
async function $t(t, e) {
  typeof t.setFlag == "function" && (await Vy(t, e), await Gy(t, e));
}
async function Gy(t, e) {
  await Promise.resolve(t.setFlag?.(u, ms, e));
}
function Ir(t) {
  if (!t) return null;
  const e = t.getFlag?.(u, fs);
  return rA(e) ? e : null;
}
async function Vy(t, e) {
  if (typeof t.setFlag != "function") return;
  const n = Object.values(e).filter(Vt).sort((a, s) => a.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((a) => a.createdAt)),
    messageId: r.messageId ?? Z(t) ?? null,
    source: {
      actorId: r.actorId,
      actorName: Hy(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(t.setFlag(u, fs, o));
}
function Hy(t) {
  if (!t.includes("→")) return t.trim() || null;
  const n = t.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Cr(t, e) {
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
  const e = z(t);
  if (e?.setFlag)
    return e;
  const n = Wy(t);
  if (n?.setFlag)
    return n;
  const r = Z(t);
  if (!r) return null;
  const o = game.messages;
  return z(o?.get?.(r));
}
function Wy(t) {
  return !t || typeof t != "object" ? null : [
    t.document,
    t.message,
    t.chatMessage
  ].map(z).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Fs(t) {
  const e = Ms(t.context.message);
  if (e) return e;
  const n = t.messageId ? Ky(t.messageId) : null;
  if (n) return n;
  const r = qs().slice().reverse();
  return r.find((o) => Yy(o, t)) ?? r.find((o) => Qy(o, t)) ?? null;
}
function Ky(t) {
  const e = game.messages;
  return z(e?.get?.(t));
}
function Yy(t, e) {
  const n = Z(t);
  if (e.messageId && n === e.messageId) return !0;
  if (!Bs(t, e)) return !1;
  const o = Us(t);
  return !e.actorId || !o || o === e.actorId;
}
function Qy(t, e) {
  if (!Xy(t, e)) return !1;
  const n = Us(t);
  return e.actorId && n === e.actorId ? !0 : Bs(t, e);
}
function Bs(t, e) {
  const n = gt(Zy(t));
  if (!n) return !1;
  const r = gt(e.itemName);
  if (r && n.includes(r)) return !0;
  const o = gt(e.itemId);
  return !!(o && n.includes(o));
}
function Zy(t) {
  const e = t.content;
  return typeof e == "string" ? e : null;
}
function Us(t) {
  const e = t.speaker;
  return typeof e?.actor == "string" && e.actor.length > 0 ? e.actor : null;
}
function Xy(t, e) {
  const n = Jy(t);
  return n === null ? !1 : Math.abs(n - e.createdAt) <= Bb;
}
function Jy(t) {
  const e = t.timestamp;
  if (typeof e == "number" && Number.isFinite(e)) return e;
  const n = t._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function z(t) {
  return t && typeof t == "object" ? t : null;
}
function Vt(t) {
  return bt(t) ? t.schemaVersion === 1 && typeof t.pendingId == "string" && t.mode === "ask" && typeof t.createdAt == "number" && typeof t.summary == "string" && typeof t.executed == "boolean" && S(t.messageId) && S(t.itemId) && S(t.actorId) && S(t.itemName) && nt(t.resistanceTargetActorId) && nt(t.resistanceTargetName) && oA(t.resistanceRollResult) && tA(t.actionPayload) && Je(t.title) && Je(t.buttonLabel) && Je(t.executedLabel) && nt(t.choiceGroupId) && nt(t.skippedLabel) && nt(t.actionSectionId) && nt(t.actionSectionTitle) && iA(t.summaryLines) : !1;
}
function tA(t) {
  return t == null ? !0 : bt(t) ? t.kind === "resource-operation" && S(t.actorId) && S(t.actorUuid) && typeof t.actorName == "string" && eA(t.resource) && nA(t.operation) && typeof t.amount == "number" && Number.isFinite(t.amount) : !1;
}
function eA(t) {
  return t === "PV" || t === "SAN" || t === "PE" || t === "PD";
}
function nA(t) {
  return t === "damage" || t === "heal" || t === "recover" || t === "spend";
}
function rA(t) {
  return bt(t) ? t.schemaVersion === 1 && t.kind === "item-use" && typeof t.createdAt == "number" && S(t.messageId) && bt(t.source) && S(t.source.actorId) && S(t.source.actorName) && S(t.source.itemId) && S(t.source.itemName) && Array.isArray(t.prompts) && t.prompts.every(Vt) : !1;
}
function oA(t) {
  return t == null ? !0 : bt(t) ? typeof t.skill == "string" && typeof t.skillLabel == "string" && typeof t.formula == "string" && typeof t.total == "number" && Number.isFinite(t.total) && typeof t.targetName == "string" && nt(t.diceBreakdown) && (t.usedFallbackBonus === void 0 || typeof t.usedFallbackBonus == "boolean") && typeof t.rolledAt == "string" : !1;
}
function aA(t) {
  return t !== null;
}
function bt(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function S(t) {
  return t === null || typeof t == "string";
}
function Je(t) {
  return t === void 0 || typeof t == "string";
}
function nt(t) {
  return t == null || typeof t == "string";
}
function iA(t) {
  return t === void 0 || Array.isArray(t) && t.every((e) => typeof e == "string");
}
function sA(t) {
  return typeof t == "string" && t.length > 0;
}
function qs() {
  const t = game.messages;
  if (!t || typeof t != "object") return [];
  const e = t.contents;
  if (Array.isArray(e))
    return e.map(z).filter((r) => r !== null);
  const n = t.values;
  return typeof n == "function" ? Array.from(n.call(t)).map(z).filter((r) => r !== null) : [];
}
function Fe(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function Z(t) {
  if (!t || typeof t != "object") return null;
  const e = t;
  return typeof e.id == "string" && e.id.length > 0 ? e.id : typeof e._id == "string" && e._id.length > 0 ? e._id : null;
}
function lA(t) {
  return t.trim().toLowerCase();
}
function cA(t) {
  return t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
}
function Rt(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const ra = 1e3;
class uA {
  constructor(e, n, r, o, a, s) {
    this.workflow = e, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = s, this.ritualAssistant = new x_(
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
      settings: Fr(),
      strategies: this.strategies.map((e) => e.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(e) {
    const n = Fr();
    if (n.executionMode === "disabled") {
      this.setAttempt(e, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Ae(e.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && bA(e.item) && n.executionMode === "ask") {
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
    if (await Oo(e), !e.actor) {
      this.setAttempt(e, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${e.item.name}.`,
        data: nn(e, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(e), await Xe(e), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(e), await Xe(
      e,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(e) {
    const n = wr(e);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = TA(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await me(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await jb(e), await Gb(
      e,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (qb(
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
    if (await Oo(e), !e.actor) {
      this.setAttempt(e, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${e.item.name}.`,
        data: nn(e, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(e)) {
      this.setAttempt(e, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(e), await this.handleAssistedRitual(
      e,
      yA(e.item)
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
          at(r.workflowContext)
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
      return o.ok ? (_A(n, o.value), await dA(o.value), {
        ok: !0,
        executedLabel: mA(o.value)
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
    const n = tn(e.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && tn(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== e.id && (this.pendingExecutions.delete(o), await Xe(
        o,
        aa(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(e, n) {
    const r = rn();
    await zb({
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
    let a;
    for (const s of r) {
      const l = rn();
      a ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: e,
        workflowContext: n,
        createdAt: Date.now()
      }), await Qo({
        pendingId: l,
        context: e,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: tn(s),
        skippedLabel: aa(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: AA(s)
      });
    }
    this.setAttempt(
      e,
      "pending",
      "ritual-assisted-actions",
      a
    ), m.info(
      "Ritual assistido preparado com ações pendentes.",
      at(n)
    );
  }
  async createPendingWorkflowPrompt(e, n) {
    const r = rn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: e,
      mode: "ask",
      createdAt: Date.now()
    }), await Qo({
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
      at(o.value.context)
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
    const n = Date.now(), r = ia(e);
    for (const [a, s] of this.recentExecutionKeys.entries())
      n - s > ra && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= ra;
  }
  markExecution(e) {
    this.recentExecutionKeys.set(ia(e), Date.now());
  }
  setAttempt(e, n, r, o) {
    this.lastAttempt = nn(
      e,
      n,
      r,
      o
    );
  }
}
async function dA(t) {
  const e = hA();
  if (e.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: t.actor }),
        whisper: e,
        content: fA(t)
      });
    } catch (n) {
      m.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function mA(t) {
  const e = t.totalBlocked > 0 ? ` (RD ${t.totalBlocked})` : "";
  return `✓ ${t.totalFinalDamage} PV aplicado${e}`;
}
function fA(t) {
  const e = t.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${se(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = t.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${t.totalFinalDamage} PV</li>` : "", r = t.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${t.totalBlocked}</li>` : "", o = pA(t), a = t.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${se(t.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${se(t.actorName)}</strong></p>
      <ul>
        ${e}
        ${n}
        ${r}
        ${o}
        ${a}
      </ul>
    </div>
  `;
}
function pA(t) {
  const e = gA(t.actor), n = t.newPV ?? e?.value ?? null, r = e?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${se(o)}</li>`;
}
function gA(t) {
  const e = t.system, n = t.type === "threat" ? e.attributes?.hp : e.PV, r = oa(n?.value);
  return r === null ? null : {
    value: r,
    max: oa(n?.max)
  };
}
function oa(t) {
  return typeof t == "number" && Number.isFinite(t) ? t : null;
}
function hA() {
  return game.users.filter((t) => t.isGM).map((t) => t.id).filter((t) => typeof t == "string" && t.length > 0);
}
function se(t) {
  const e = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return t.replace(/[&<>"']/gu, (n) => e[n] ?? n);
}
function tn(t) {
  return t.kind !== "resource-operation" && t.kind !== "damage-application" ? null : t.choiceGroupId ?? null;
}
function aa(t) {
  return t.kind !== "resource-operation" && t.kind !== "damage-application" ? null : t.choiceGroupResolvedLabel ?? null;
}
function _A(t, e) {
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
function bA(t) {
  return t.type === "ritual";
}
function yA(t) {
  return Hh(t) ?? {
    version: 1,
    label: `Conjuração de ${t.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function AA(t) {
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
function TA(t) {
  const e = t.actorUuid ? $A(t.actorUuid) : null;
  if (yt(e)) return e;
  const n = t.actorId ? RA(t.actorId) : null;
  return n || wA(t.actorName);
}
function $A(t) {
  const e = globalThis.fromUuidSync;
  if (typeof e != "function") return null;
  try {
    return e(t);
  } catch {
    return null;
  }
}
function RA(t) {
  const n = game.actors?.get?.(t);
  if (yt(n)) return n;
  for (const r of zs()) {
    const o = Sr(r);
    if (o?.id === t) return o;
  }
  return null;
}
function wA(t) {
  const e = en(t);
  if (!e) return null;
  for (const o of zs()) {
    const a = kA(o);
    if (en(a) === e) {
      const s = Sr(o);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (o) => yt(o) && en(o.name) === e
  );
  return yt(r) ? r : null;
}
function zs() {
  const t = canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function kA(t) {
  if (!t || typeof t != "object") return null;
  const e = t.name;
  if (typeof e == "string") return e;
  const n = t.document?.name;
  return typeof n == "string" ? n : Sr(t)?.name ?? null;
}
function Sr(t) {
  if (!t || typeof t != "object") return null;
  const e = t.actor;
  if (yt(e)) return e;
  const n = t.document?.actor;
  return yt(n) ? n : null;
}
function en(t) {
  const e = t?.trim().toLocaleLowerCase();
  return e && e.length > 0 ? e : null;
}
function yt(t) {
  return !!(t && typeof t == "object" && "system" in t);
}
function nn(t, e, n, r) {
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
function ia(t) {
  const e = t.actor?.id ?? "no-actor", n = t.item.uuid ?? t.item.id ?? t.item.name ?? "unknown-item";
  return `${e}:${n}`;
}
function rn() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class EA {
  constructor(e, n, r) {
    this.diagnostic = e, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(e) {
    const n = this.diagnostic.getApplicableEntries(e), r = [], o = [], a = qt(e);
    for (const s of n) {
      const l = s.itemId ? a.find((f) => f.id === s.itemId) ?? null : null, c = s.match?.preset ?? null;
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
class IA {
  constructor(e) {
    this.automationRegistry = e;
  }
  automationRegistry;
  analyzeActor(e) {
    const n = qt(e).map((l) => this.analyzeRitual(l)), r = n.filter(ee("upToDate")), o = n.filter(ee("available")), a = n.filter(ee("outdated")), s = n.filter(ee("unsupported"));
    return {
      actorId: e.id ?? null,
      actorName: e.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: o,
      outdated: a,
      unsupported: s,
      canApply: o.length > 0 || a.length > 0
    };
  }
  getApplicableEntries(e) {
    const n = this.analyzeActor(e);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(e) {
    const n = this.automationRegistry.findForItem(e)[0] ?? null, r = CA(e);
    return n ? r ? r.source.type !== "preset" ? Ct({
      ritual: e,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? Ct({
      ritual: e,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : Ct({
      ritual: e,
      status: "outdated",
      match: n,
      flag: r,
      reason: SA(r, n.preset)
    }) : Ct({
      ritual: e,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : Ct({
      ritual: e,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Ct(t) {
  const e = t.flag?.source, n = e?.type === "preset" ? e : null;
  return {
    itemId: t.ritual.id ?? null,
    itemName: t.ritual.name ?? "Ritual sem nome",
    status: t.status,
    match: t.match,
    preset: t.match ? ye(t.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: t.reason
  };
}
function CA(t) {
  const e = t.getFlag(u, "automation");
  return Wn(e) ? e : null;
}
function SA(t, e) {
  return t.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${e.label}.` : t.source.presetId !== e.id ? `Preset aplicado (${t.source.presetId}) difere do preset atual sugerido (${e.id}).` : `Preset ${e.label} aplicado em v${t.source.presetVersion}; versão atual é v${e.version}.`;
}
function ee(t) {
  return (e) => e.status === t;
}
class LA {
  constructor(e) {
    this.debugOutput = e;
  }
  debugOutput;
  async createResourceOperationMessage(e) {
    const n = this.createResourceOperationContent(e.transaction), r = Yn(e.transaction);
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
    const r = this.createWorkflowSummaryContent(e, n), o = at(e);
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
    const n = A(e.actorName), r = A(e.resource), o = A(sa(e)), a = A(PA(e));
    return `
      <section class="${u}-card ${u}-resource-card">
        <header class="${u}-card__header">
          <strong>${o}</strong>
          <span>${n}</span>
        </header>
        <div class="${u}-card__body">
          <p><strong>${a}:</strong> ${e.appliedAmount}</p>
          <p><strong>${r}:</strong> ${e.before.value}/${e.before.max} &rarr; ${e.after.value}/${e.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(e, n) {
    const r = A(n.title ?? "Automação"), o = n.message ? `<p>${A(n.message)}</p>` : "", a = A(e.sourceToken?.name ?? e.sourceActor.name ?? "Origem sem nome"), s = A(e.item.name ?? "Item sem nome"), l = e.targets.length > 0 ? e.targets.map((g) => A(g.name)).join(", ") : "Nenhum", c = Object.values(e.rolls).map(
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(DA(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), d = e.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(vA(g.source))})</li>`
    ), f = e.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), y = e.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = e.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(sa(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), $ = e.phases.map((g) => A(g)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${u}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
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
function DA(t) {
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
function sa(t) {
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
function PA(t) {
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
function vA(t) {
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
function NA() {
  const t = new $g(), e = new _h(t), n = new ti(), r = new kg(), o = new Cg(r), a = new zg(t), s = new Gg(), l = s.registerMany(
    Sl()
  );
  if (!l.ok)
    throw new Error(l.error.message);
  const c = new jg(), d = new Ug(), f = ci(), y = new oi(f), T = new IA(
    s
  ), $ = new EA(
    T,
    c,
    d
  ), g = new Th(), x = new LA(g), kt = new Ah(), Et = new gh(
    e,
    o,
    x,
    kt
  ), It = new yh(Et, kt), w = new uA(
    It,
    e,
    o,
    n,
    y,
    g
  );
  return w.addStrategy(
    new Fg(
      (G) => w.handleItemUsed(G)
    )
  ), {
    ordem: a,
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
    chatMessages: x,
    workflowHooks: kt,
    automation: Et,
    workflow: It,
    itemUseIntegration: w,
    ritualPresetDiagnostic: T,
    ritualPresetApplications: $
  };
}
const { ApplicationV2: xA } = foundry.applications.api;
class _e extends xA {
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
      apply: _e.onApply,
      cancel: _e.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${M(Hn)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${M(e.actorName)}</strong></p>
        </div>
        ${this.renderSummary(e)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${on("Prontos para aplicar", "available", e.available, "fa-solid fa-plus")}
        ${on("Desatualizados", "outdated", e.outdated, "fa-solid fa-rotate")}
        ${on("Automatizados", "upToDate", e.upToDate, "fa-solid fa-check")}
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
function on(t, e, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${e}">
      <h3>
        <i class="${r}"></i>
        <span>${M(t)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? OA(n) : FA(e)}
    </section>
  `;
}
function OA(t) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${t.map(MA).join("")}</ol>`;
}
function MA(t) {
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
function FA(t) {
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
const be = `${u}.manageRitualPresets`, la = `__${u}_ritualPresetHeaderControlRegistered`, BA = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function UA(t) {
  const e = globalThis;
  if (!e[la]) {
    for (const n of BA)
      Hooks.on(n, (r, o) => {
        qA(r, o, t);
      });
    e[la] = !0, m.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function qA(t, e, n) {
  Array.isArray(e) && jA(t) && (zA(t, n), !e.some((r) => r.action === be) && e.push({
    action: be,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), js(t, n);
    }
  }));
}
function zA(t, e) {
  t.options && (t.options.actions ??= {}, !t.options.actions[be] && (t.options.actions[be] = (n) => {
    n.preventDefault(), n.stopPropagation(), js(t, e);
  }));
}
function jA(t) {
  if (!game.user?.isGM) return !1;
  const e = Gs(t);
  return e ? e.type === "agent" && qt(e).length > 0 : !1;
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
  new _e(n, e).render({ force: !0 });
}
function Gs(t) {
  return ca(t.actor) ? t.actor : ca(t.document) ? t.document : null;
}
function ca(t) {
  return !!(t && typeof t == "object" && "items" in t && "type" in t);
}
const Vs = "data-paranormal-toolkit-ritual-roll-config", Ht = "data-paranormal-toolkit-ritual-roll-field", it = "data-paranormal-toolkit-ritual-roll-action", ua = `__${u}_ritualRollConfigBlockRegistered`, GA = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], VA = [
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
function HA() {
  const t = globalThis;
  if (!t[ua]) {
    WA();
    for (const e of GA)
      Hooks.on(e, (...n) => {
        KA(n[0], n[1]);
      });
    t[ua] = !0, m.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function WA() {
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
function KA(t, e) {
  const n = lT(t);
  if (!n || n.type !== "ritual") return;
  const r = dT(e);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  QA(o);
  const a = Ws(n), s = is(n), l = cT(n), c = ZA(n, s, a, l);
  rT(c, n, a, l), YA(o, c), Lr(c);
}
function YA(t, e) {
  const n = t.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", e);
    return;
  }
  (t.querySelector(".content-item.scrollable") ?? t).append(e);
}
function QA(t) {
  for (const e of Array.from(t.querySelectorAll(`[${Vs}]`)))
    e.remove();
}
function ZA(t, e, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${u}-ritual-roll-config`), o.setAttribute(Vs, t.uuid ?? t.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${u}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${u}-ritual-roll-config__title`), s.append(da("strong", "Paranormal Toolkit")), s.append(da("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${u}-ritual-roll-config__badge`), l.textContent = Ys(e) ? "Configurada" : "Rascunho", a.append(s, l), o.append(a);
  const c = document.createElement("p");
  c.classList.add(`${u}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(c);
  const d = document.createElement("div");
  d.classList.add(`${u}-ritual-roll-config__fields`), d.append(XA(e, r)), d.append(JA(e, r)), d.append(tT(e, r)), o.append(d), o.append(eT(e, n, r)), o.append(nT(r));
  const f = document.createElement("p");
  return f.classList.add(`${u}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function XA(t, e) {
  const n = Be("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Ht, "intent"), r.disabled = !e;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = Vh(o), a.selected = t.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function JA(t, e) {
  const n = Be("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Ht, "damageType"), r.disabled = !e;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !t.damageType, r.append(o);
  for (const a of VA) {
    const s = document.createElement("option");
    s.value = a.value, s.textContent = a.label, s.selected = t.damageType === a.value, r.append(s);
  }
  return n.append(r), n;
}
function tT(t, e) {
  const n = Be("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = t.utilityLabel ?? "Resultado", r.disabled = !e, r.setAttribute(Ht, "utilityLabel"), n.append(r), n;
}
function eT(t, e, n) {
  const r = document.createElement("section");
  r.classList.add(`${u}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${u}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const a = document.createElement("div");
  return a.classList.add(`${u}-ritual-roll-config__forms-grid`), a.append(an("base", "Padrão", t.forms.base.formula, !0, n)), a.append(an("discente", "Discente", t.forms.discente.formula, e.discente, n)), a.append(an("verdadeiro", "Verdadeiro", t.forms.verdadeiro.formula, e.verdadeiro, n)), r.append(a), r;
}
function an(t, e, n, r, o) {
  const a = Be(e);
  a.classList.add(`${u}-ritual-roll-config__form-card`), a.dataset.ritualRollForm = t;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = t === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !o || !r, s.setAttribute(Ht, `formula.${t}`), a.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", a.append(l);
  }
  return a;
}
function nT(t) {
  const e = document.createElement("div");
  e.classList.add(`${u}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !t, n.setAttribute(it, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !t, r.setAttribute(it, "clear"), e.append(n, r), e;
}
function Be(t) {
  const e = document.createElement("label");
  e.classList.add(`${u}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = t, e.append(n), e;
}
function da(t, e) {
  const n = document.createElement(t);
  return n.textContent = e, n;
}
function rT(t, e, n, r) {
  wt(t, "intent")?.addEventListener("change", () => Lr(t)), pa(t, "system.studentForm")?.addEventListener("change", () => ma(t, e)), pa(t, "system.trueForm")?.addEventListener("change", () => ma(t, e)), t.querySelector(`[${it}="save"]`)?.addEventListener("click", () => {
    r && oT(t, e, n);
  }), t.querySelector(`[${it}="clear"]`)?.addEventListener("click", () => {
    r && aT(t, e);
  });
}
async function oT(t, e, n) {
  const r = t.querySelector(`[${it}="save"]`);
  r?.setAttribute("disabled", "true"), ht(t, "Salvando configuração...");
  try {
    const o = iT(t, n);
    await jh(e, o), Hs(t, o), ht(t, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), ht(t, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function aT(t, e) {
  const n = t.querySelector(`[${it}="clear"]`);
  n?.setAttribute("disabled", "true"), ht(t, "Limpando configuração...");
  try {
    await Gh(e);
    const r = is(e);
    sT(t, r), Hs(t, r), ht(t, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), ht(t, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Hs(t, e) {
  const n = t.querySelector(`.${u}-ritual-roll-config__badge`);
  n && (n.textContent = Ys(e) ? "Configurada" : "Rascunho");
}
function iT(t, e) {
  return {
    schemaVersion: 1,
    intent: Ks(wt(t, "intent")?.value),
    damageType: ga(t, "damageType"),
    utilityLabel: ga(t, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: le(t, "formula.base") },
      discente: { formula: le(t, "formula.discente") },
      verdadeiro: { formula: le(t, "formula.verdadeiro") }
    }
  };
}
function sT(t, e) {
  ct(t, "intent", e.intent), ct(t, "damageType", e.damageType ?? ""), ct(t, "utilityLabel", e.utilityLabel ?? "Resultado"), ct(t, "formula.base", e.forms.base.formula), ct(t, "formula.discente", e.forms.discente.formula), ct(t, "formula.verdadeiro", e.forms.verdadeiro.formula), Lr(t);
}
function Lr(t) {
  const e = Ks(wt(t, "intent")?.value), n = t.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = t.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = e !== "damage";
  for (const o of Array.from(r))
    o.hidden = e !== "utility";
}
function ma(t, e) {
  const n = Ws(e);
  fa(t, "discente", n.discente), fa(t, "verdadeiro", n.verdadeiro);
}
function fa(t, e, n) {
  const r = wt(t, `formula.${e}`);
  if (!r) return;
  const o = !t.querySelector(`[${it}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const a = r.closest(`.${u}-ritual-roll-config__field`), s = a?.querySelector("small");
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
function ht(t, e) {
  const n = t.querySelector(`.${u}-ritual-roll-config__status`);
  n && (n.textContent = e);
}
function Ws(t) {
  const e = uT(t);
  return {
    base: !0,
    discente: e.studentForm === !0,
    verdadeiro: e.trueForm === !0
  };
}
function lT(t) {
  return ha(t.item) ? t.item : ha(t.document) ? t.document : null;
}
function cT(t) {
  return !!(game.user?.isGM || t.isOwner === !0);
}
function uT(t) {
  const e = t.system;
  return mT(e) ? e : {};
}
function pa(t, e) {
  return t.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${e}"]`) ?? null;
}
function wt(t, e) {
  return t.querySelector(`[${Ht}="${fT(e)}"]`);
}
function le(t, e) {
  return wt(t, e)?.value.trim() ?? "";
}
function ga(t, e) {
  const n = le(t, e);
  return n.length > 0 ? n : null;
}
function ct(t, e, n) {
  const r = wt(t, e);
  r && (r.value = n);
}
function Ks(t) {
  return t === "healing" || t === "utility" ? t : "damage";
}
function Ys(t) {
  return Object.values(t.forms).some((e) => e.formula.trim().length > 0);
}
function dT(t) {
  if (t instanceof HTMLElement) return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement) return e[0];
    if (e.element instanceof HTMLElement) return e.element;
  }
  return null;
}
function ha(t) {
  return !!(t && typeof t == "object" && "type" in t && "system" in t && "getFlag" in t && "setFlag" in t);
}
function mT(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function fT(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let ot = null;
Hooks.once("init", () => {
  El(), Ql(), Lc(), cg(), m.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!qr.isSupportedSystem()) {
    m.warn(
      `Sistema não suportado: ${qr.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  ot = NA(), ot.itemUseIntegration.registerStrategies(), Ec(ot.conditions), cc(ot), Ac(), hc(), gg(), UA(ot), HA(), m.info("Inicializado para o sistema Ordem Paranormal."), m.info(
    `API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Hn} inicializado.`);
});
function pT() {
  if (!ot)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return ot;
}
export {
  pT as getToolkitServices
};
//# sourceMappingURL=main.js.map
