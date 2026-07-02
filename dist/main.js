const u = "paranormal-toolkit", Kn = "Paranormal Toolkit", el = "ordemparanormal";
class jt {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Te(t) {
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
function $e(t) {
  const e = t.getFlag(u, "automation");
  return e == null ? p({
    reason: "missing-automation",
    message: `Item ${t.name} não possui automação do Paranormal Toolkit.`
  }) : Yn(e) ? _(e.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${t.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: e
  });
}
function nl(t) {
  return Yn(t.getFlag(u, "automation"));
}
function Yn(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.schemaVersion === 1 && ol(e.source) && rl(e.definition);
}
function rl(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && R(e.label) && Array.isArray(e.steps) && e.steps.every(al) && (e.conditionApplications === void 0 || dl(e.conditionApplications));
}
function ol(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.type === "preset" ? R(e.presetId) && R(e.presetVersion) && R(e.appliedAt) : e.type === "manual" ? R(e.label) && R(e.appliedAt) : !1;
}
function al(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  switch (e.type) {
    case "spendResource":
      return il(e);
    case "spendRitualCost":
      return sl(e);
    case "rollFormula":
      return ll(e);
    case "modifyResource":
      return cl(e);
    case "chatCard":
      return ul(e);
    default:
      return !1;
  }
}
function il(t) {
  const e = t;
  return e.type === "spendResource" && e.actor === "self" && (e.resource === "PE" || e.resource === "PD") && ya(e);
}
function sl(t) {
  return t.type === "spendRitualCost";
}
function ll(t) {
  const e = t;
  return e.type === "rollFormula" && R(e.id) && R(e.formula) && (e.intent === void 0 || _l(e.intent)) && (e.damageType === void 0 || R(e.damageType));
}
function cl(t) {
  const e = t;
  return e.type === "modifyResource" && Aa(e.actor) && gl(e.resource) && hl(e.operation) && ya(e) && (e.damageType === void 0 || e.damageType === null || R(e.damageType)) && (e.ignoreResistance === void 0 || typeof e.ignoreResistance == "boolean");
}
function ul(t) {
  const e = t;
  return e.type === "chatCard" && (e.title === void 0 || typeof e.title == "string") && (e.message === void 0 || typeof e.message == "string");
}
function dl(t) {
  return Array.isArray(t) && t.every(ml);
}
function ml(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return R(e.id) && Aa(e.actor) && R(e.conditionId) && (e.label === void 0 || R(e.label)) && (e.duration === void 0 || e.duration === null || fl(e.duration)) && (e.source === void 0 || R(e.source)) && (e.actionSectionId === void 0 || R(e.actionSectionId)) && (e.actionSectionTitle === void 0 || R(e.actionSectionTitle)) && (e.executedLabel === void 0 || R(e.executedLabel));
}
function fl(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return (e.rounds === void 0 || e.rounds === null || bl(e.rounds)) && (e.expiry === void 0 || e.expiry === null || pl(e.expiry));
}
function pl(t) {
  return t === "turnStart" || t === "turnEnd";
}
function ya(t) {
  return typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0 || R(t.amountFrom);
}
function Aa(t) {
  return t === "self" || t === "target";
}
function gl(t) {
  return t === "PV" || t === "SAN" || t === "PE" || t === "PD";
}
function hl(t) {
  return t === "spend" || t === "damage" || t === "heal" || t === "recover";
}
function _l(t) {
  return t === "attack" || t === "damage" || t === "healing" || t === "resistance" || t === "skill" || t === "ritual" || t === "generic";
}
function bl(t) {
  return typeof t == "number" && Number.isInteger(t) && t > 0;
}
function R(t) {
  return typeof t == "string" && t.length > 0;
}
function Qn(t) {
  const e = t.items;
  if (Array.isArray(e))
    return e;
  if (e && typeof e == "object") {
    const n = e;
    if (Array.isArray(n.contents))
      return n.contents.filter(Nr);
    if (Tl(e))
      return Array.from(e).filter(Nr);
  }
  return [];
}
function yl(t) {
  return Qn(t)[0] ?? null;
}
function Al(t) {
  return Qn(t).find(nl) ?? null;
}
function Tl(t) {
  return !!(t && typeof t == "object" && Symbol.iterator in t);
}
function Nr(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function Gt(t) {
  return Qn(t).filter((e) => e.type === "ritual");
}
function Ta(t) {
  return Gt(t)[0] ?? null;
}
function $l(t) {
  return {
    listPresets() {
      const e = t.automationRegistry.list().map(Te);
      return m.info("Presets de automação registrados.", e), e;
    },
    findPresetsForFirstRitual() {
      const e = vt("Nenhum ator encontrado para buscar presets de ritual.");
      if (!e) return [];
      const n = Yt(e);
      if (!n) return [];
      const r = t.automationRegistry.findForItem(n).map(Mr);
      return m.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(e) {
      const n = vt("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Yt(n);
      if (!r) return;
      const o = t.automationRegistry.require(e);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await cn(t, r, o.value);
      m.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const e = vt("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!e) return;
      const n = Yt(e);
      if (!n) return;
      const r = t.automationRegistry.findForItem(n)[0];
      if (!r) {
        m.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await cn(t, n, r.preset);
      m.info(`Melhor preset aplicado em ${n.name}.`, { match: Mr(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return xr(t);
    },
    async applyBestPresetsToActorRituals() {
      return xr(t);
    },
    async clearAutomationFromFirstRitual() {
      const e = vt("Nenhum ator encontrado para limpar automação de ritual.");
      if (!e) return;
      const n = Yt(e);
      n && (await t.automationBinder.clear(n), m.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function xr(t) {
  const e = vt("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!e) return null;
  const n = Gt(e);
  if (n.length === 0)
    return m.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Or(e);
  const r = Or(e, n.length);
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
    const s = await cn(t, o, a.preset);
    r.applied.push(Rl(o, a, s));
  }
  return m.info(`Presets aplicados em rituais de ${e.name ?? "ator sem nome"}.`, r), wl(r), r;
}
async function cn(t, e, n) {
  return await t.automationBinder.applyPreset(e, n), t.itemPatches.applyPresetItemPatch(e, n);
}
function Rl(t, e, n) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Ritual sem nome",
    preset: Te(e.preset),
    score: e.score,
    reasons: [...e.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function Or(t, e = 0) {
  return {
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    total: e,
    applied: [],
    skipped: []
  };
}
function wl(t) {
  const e = t.skipped.length > 0 ? `, ${t.skipped.length} sem preset compatível` : "", n = t.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${t.applied.length}/${t.total} presets aplicados em rituais${n}${e}.`
  );
}
function Mr(t) {
  return {
    preset: Te(t.preset),
    score: t.score,
    reasons: [...t.reasons]
  };
}
function vt(t) {
  const e = jt.getSelectedActor();
  return e || (m.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Yt(t) {
  const e = Ta(t);
  return e || (m.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function at(t) {
  return t ? {
    id: t.id,
    source: {
      ...kl(t.sourceActor),
      token: t.sourceToken
    },
    item: El(t.item),
    targets: t.targets.map(Il),
    phases: [...t.phases],
    lifecycleEvents: t.lifecycleEvents.map((e) => ({ ...e })),
    rollRequests: Fr(t.rollRequests, $a),
    rolls: Fr(t.rolls, Cl),
    ritualCosts: t.ritualCosts.map((e) => ({ ...e })),
    damageInstances: t.damageInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    healingInstances: t.healingInstances.map((e) => ({ ...e, tags: [...e.tags] })),
    resourceTransactions: t.resourceTransactions.map(Zn),
    flagKeys: Object.keys(t.flags)
  } : null;
}
function Zn(t) {
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
function kl(t) {
  return {
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown"
  };
}
function El(t) {
  return {
    itemId: t.id ?? null,
    itemName: t.name ?? "Item sem nome",
    itemType: t.type ?? "unknown",
    itemUuid: t.uuid ?? null
  };
}
function Il(t) {
  return {
    tokenId: t.tokenId,
    actorId: t.actorId,
    sceneId: t.sceneId,
    name: t.name,
    actorName: t.actor?.name,
    actorType: t.actor?.type
  };
}
function $a(t) {
  return {
    id: t.id,
    formula: t.formula,
    intent: t.intent,
    damageType: t.damageType,
    sourceStepIndex: t.sourceStepIndex
  };
}
function Cl(t) {
  return {
    ...$a(t),
    total: t.total
  };
}
function Fr(t, e) {
  return Object.fromEntries(Object.entries(t).map(([n, r]) => [n, e(r)]));
}
function Sl(t) {
  return {
    getSelected() {
      return jt.getSelectedActor();
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
      await dt(
        t,
        "Gasto de PE",
        X("Nenhum ator encontrado para gastar PE."),
        (n) => t.resources.spend(n, "PE", e)
      );
    },
    async spendPD(e) {
      await dt(
        t,
        "Gasto de PD",
        X("Nenhum ator encontrado para gastar PD."),
        (n) => t.resources.spend(n, "PD", e)
      );
    },
    async damagePV(e) {
      await dt(
        t,
        "Dano em PV",
        X("Nenhum ator encontrado para causar dano em PV."),
        (n) => t.resources.damage(n, "PV", e)
      );
    },
    async healPV(e) {
      await dt(
        t,
        "Cura de PV",
        X("Nenhum ator encontrado para curar PV."),
        (n) => t.resources.heal(n, "PV", e)
      );
    },
    async damageSAN(e) {
      await dt(
        t,
        "Dano em SAN",
        X("Nenhum ator encontrado para causar dano em SAN."),
        (n) => t.resources.damage(n, "SAN", e)
      );
    },
    async recoverSAN(e) {
      await dt(
        t,
        "Recuperação de SAN",
        X("Nenhum ator encontrado para recuperar SAN."),
        (n) => t.resources.recover(n, "SAN", e)
      );
    }
  };
}
async function dt(t, e, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    Ll(o.error);
    return;
  }
  const a = o.value;
  try {
    await t.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    m.error(`${e} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  m.info(`${e} realizado:`, Zn(a));
}
function X(t) {
  const e = jt.getSelectedActor();
  return e || (m.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ll(t) {
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
function Dl() {
  Qt(F.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Qt(F.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Qt(F.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Qt(F.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function un() {
  return {
    enabled: Zt(F.enabled),
    console: Zt(F.console),
    ui: Zt(F.ui),
    chat: Zt(F.chat)
  };
}
async function V(t, e) {
  await game.settings.set(u, F[t], e);
}
function Qt(t, e) {
  game.settings.register(u, t, {
    name: e.name,
    hint: e.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: e.default
  });
}
function Zt(t) {
  return game.settings.get(u, t) === !0;
}
function Pl() {
  return {
    status() {
      return un();
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
const Ra = "ritual.costOnly", wa = "ritual.simpleHealing", vl = "ritual.eletrocussao", ka = "ritual.simpleDamage", Ea = "generic.simpleHealing", Ia = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Nl() {
  return [
    xl(),
    Ol(),
    Ml(),
    Fl(),
    Bl()
  ];
}
function xl() {
  return {
    id: Ra,
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
function Ol() {
  return {
    id: wa,
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
    automation: Ca(),
    itemPatch: ql()
  };
}
function Ml() {
  return {
    id: vl,
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
    automation: Ul(),
    itemPatch: zl()
  };
}
function Fl() {
  return {
    id: ka,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Xn()
  };
}
function Bl() {
  return {
    id: Ea,
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
function Ca(t = "2d8+2") {
  return Sa(
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
function Ul() {
  return {
    ...Xn("3d6", {
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
function Xn(t = "1d8", e = {}) {
  const n = e.label ?? "Ritual de dano simples", r = e.title ?? "Ritual de dano simples", o = e.damageType ?? "generic", a = e.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Sa(
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
function ql() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Ia,
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
function zl() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Ia,
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
function Sa(t, e, n) {
  return {
    ...t,
    steps: t.steps.map((r) => r.type !== "rollFormula" || r.id !== e ? r : {
      ...r,
      formula: n
    })
  };
}
function Jn() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: ft(e.id),
    actorId: ft(e.actor?.id),
    sceneId: ft(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  }));
}
function La() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null;
  return {
    tokenId: ft(t.id),
    actorId: ft(e?.id),
    sceneId: ft(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function ft(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function jl(t) {
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
        if (!Hl(e, n)) {
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
      const r = t.automationRegistry.require(Ra);
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
      if (!Br(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = t.automationRegistry.require(wa);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(r, o.value, {
        definition: Ca(e)
      }), m.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(e = "1d8") {
      const n = J("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = tt(n);
      if (!r) return;
      if (!Br(e)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = t.automationRegistry.require(ka);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await t.automationBinder.applyPreset(r, o.value, {
        definition: Xn(e)
      }), m.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: e }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const e = J("Nenhum ator encontrado para executar automação de ritual.");
      if (!e) return;
      const n = tt(e);
      n && await Gl(t, e, n);
    }
  };
}
async function Gl(t, e, n) {
  const r = $e(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(r.value, {
    sourceActor: e,
    sourceToken: La(),
    item: n,
    targets: Jn()
  });
  if (!o.ok) {
    Vl(o.error);
    return;
  }
  m.info("Automação de ritual executada com sucesso.", at(o.value.context));
}
function Vl(t) {
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
  const e = jt.getSelectedActor();
  return e || (m.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function tt(t) {
  const e = Ta(t);
  return e || (m.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Hl(t, e) {
  return Number.isInteger(t) && t > 0 && (e === "PE" || e === "PD");
}
function Br(t) {
  return typeof t == "string" && t.trim().length > 0;
}
const Wl = ["disabled", "ask", "automatic"], Kl = ["buttons", "confirm"], Da = "ask";
function Yl(t) {
  return typeof t == "string" && Wl.includes(t);
}
function Ql(t) {
  return typeof t == "string" && Kl.includes(t);
}
function Zl(t) {
  return Yl(t) ? t : Ql(t) ? "ask" : Da;
}
const Xl = ["keep", "replace"], Jl = ["manual", "assisted"], Pa = "keep", va = "assisted", tc = !0, C = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function ec() {
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
    default: Da
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
    default: Pa
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
    default: va
  }), game.settings.register(u, C.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: tc
  }), game.settings.register(u, C.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Ur() {
  const t = Zl(game.settings.get(u, C.executionMode)), e = xa(game.settings.get(u, C.systemCardMode)), n = Oa(game.settings.get(u, C.damageResolutionMode));
  return {
    executionMode: t,
    systemCardMode: e,
    damageResolutionMode: n,
    ritualCastingCheckEnabled: Na()
  };
}
function nc() {
  return xa(game.settings.get(u, C.systemCardMode));
}
function rc() {
  return Oa(game.settings.get(u, C.damageResolutionMode));
}
function Na() {
  return game.settings.get(u, C.ritualCastingCheckEnabled) === !0;
}
async function et(t) {
  await game.settings.set(u, C.executionMode, t);
}
function xa(t) {
  return Xl.includes(t) ? t : Pa;
}
function Oa(t) {
  return Jl.includes(t) ? t : va;
}
function oc(t) {
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
const ac = [
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
function ic(t) {
  return {
    phases() {
      return ac;
    },
    lastContext() {
      return t.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const e = ze("Nenhum ator encontrado para executar automação.");
      if (!e) return;
      const n = Al(e);
      if (!n) {
        m.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await qr(t, e, n);
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
      if (!cc(n)) {
        m.warn(`UUID não resolveu para um Item: ${e}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = lc(n) ?? ze("Nenhum ator encontrado para executar automação do item.");
      r && await qr(t, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const e = ze("Nenhum ator encontrado para configurar automação de teste.");
      if (!e) return;
      const n = yl(e);
      if (!n) {
        m.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = t.automationRegistry.require(Ea);
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
async function qr(t, e, n) {
  const r = $e(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await t.workflow.runAutomation(r.value, {
    sourceActor: e,
    sourceToken: La(),
    item: n,
    targets: Jn()
  });
  if (!o.ok) {
    sc(o.error);
    return;
  }
  m.info("Automação executada com sucesso.", at(o.value.context));
}
function sc(t) {
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
function ze(t) {
  const e = jt.getSelectedActor();
  return e || (m.warn(t), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function lc(t) {
  const e = t.parent;
  return e instanceof Actor ? e : null;
}
function cc(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function uc(t) {
  const e = Sl(t), n = $l(t), r = jl(t), o = ic(t), a = Pl(), s = oc(t);
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
function dc(t) {
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
      const r = zr();
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
      return mc(o), o;
    },
    removeFromSelectedTokens: async (e) => {
      const n = zr();
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
      return fc(r), r;
    },
    cleanupExpired: (e = {}) => t.cleanupExpiredConditions({
      ...e,
      reason: e.reason ?? "manual"
    })
  };
}
function zr() {
  const t = canvas.tokens?.controlled ?? [], e = /* @__PURE__ */ new Map();
  for (const n of t) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${e.size}`;
    e.set(a, r);
  }
  return Array.from(e.values());
}
function mc(t) {
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
function fc(t) {
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
function pc(t) {
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
    conditions: dc(t.conditions),
    debug: uc(t)
  }, n = globalThis;
  return n[u] = e, n.ParanormalToolkit = e, e;
}
class jr {
  static isSupportedSystem() {
    return game.system.id === el;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function gc() {
  return Array.from(game.user?.targets ?? []).map((e) => ({
    tokenId: pt(e.id),
    actorId: pt(e.actor?.id),
    sceneId: pt(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome"
  }));
}
function Ma() {
  const t = canvas?.tokens?.controlled?.[0];
  if (!t) return null;
  const e = t.actor ?? null, n = t.name ?? e?.name ?? "Origem sem nome";
  return {
    tokenId: pt(t.id),
    actorId: pt(e?.id),
    sceneId: pt(t.scene?.id),
    name: n
  };
}
function hc(t, e = Ma()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: e,
    targets: t
  };
}
function _c(t) {
  if (!Ac(t)) return null;
  const e = t.getFlag(u, "workflow");
  return yc(e) ? e : null;
}
function bc() {
  return `flags.${u}.workflow`;
}
function Gr(t) {
  if (!t || typeof t != "object") return !1;
  const e = foundry.utils.getProperty(t, `flags.${u}`), n = foundry.utils.getProperty(t, `_source.flags.${u}`);
  return e !== void 0 || n !== void 0;
}
function Vr(t) {
  const e = foundry.utils.getProperty(t, "speaker.actor"), n = foundry.utils.getProperty(t, "_source.speaker.actor");
  return dn(e) || dn(n);
}
function yc(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.version === 1 && e.kind === "chat-targets" && (e.source === null || typeof e.source == "object") && Array.isArray(e.targets);
}
function Ac(t) {
  return !!(t && typeof t == "object" && "getFlag" in t);
}
function pt(t) {
  return dn(t) ? t : null;
}
function dn(t) {
  return typeof t == "string" && t.length > 0;
}
function Tc() {
  const t = (e, n) => {
    $c(e, n);
  };
  Hooks.on("renderChatMessageHTML", t);
}
function $c(t, e) {
  const n = _c(t);
  if (!n || n.targets.length === 0) return;
  const r = wc(e);
  if (!r || r.querySelector(`.${u}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Rc(n));
}
function Rc(t) {
  const e = document.createElement("section");
  e.classList.add(`${u}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", e.append(n), t.source && e.append(Hr("Origem", t.source.name)), e.append(Hr("Alvo", t.targets.map((r) => r.name).join(", "))), e;
}
function Hr(t, e) {
  const n = document.createElement("p");
  n.classList.add(`${u}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${t}: `;
  const o = document.createElement("span");
  return o.textContent = e, n.append(r, o), n;
}
function wc(t) {
  if (t instanceof HTMLElement)
    return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement)
      return e[0];
  }
  return null;
}
function kc() {
  Hooks.on("preCreateChatMessage", (t, e, n, r) => {
    if (!Ec(r) || !Ic(t) || Gr(t) || Gr(e)) return;
    const o = gc();
    if (o.length === 0 || !Vr(t) && !Vr(e)) return;
    const a = Ma();
    t.updateSource({
      [bc()]: hc(o, a)
    }), m.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Ec(t) {
  const e = game.user?.id;
  return !e || typeof t != "string" ? !0 : t === e;
}
function Ic(t) {
  return !!(t && typeof t == "object" && "updateSource" in t);
}
let Wr = !1, je = !1, Ge = !1, Xt = null;
const Cc = 1e3, Sc = 750, Lc = 1e3;
function Dc(t) {
  Wr || (Hooks.on("combatTurnChange", (e) => {
    vc(t, Kr(e));
  }), Hooks.on("deleteCombat", (e) => {
    Nc(t, Kr(e));
  }), Wr = !0, Pc(t));
}
function Pc(t) {
  Re() && (je || (je = !0, globalThis.setTimeout(() => {
    je = !1, tr(t, "ready");
  }, Cc)));
}
function vc(t, e) {
  Re() && e && (Xt && globalThis.clearTimeout(Xt), Xt = globalThis.setTimeout(() => {
    Xt = null, tr(t, "combat-turn-change", e);
  }, Sc));
}
function Nc(t, e) {
  Re() && e && (Ge || (Ge = !0, globalThis.setTimeout(() => {
    Ge = !1, tr(t, "combat-deleted", e);
  }, Lc)));
}
async function tr(t, e, n) {
  if (Re())
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
function Re() {
  return game.user?.isGM === !0;
}
function Kr(t) {
  if (!t || typeof t != "object") return null;
  const e = t.id;
  return typeof e == "string" && e.length > 0 ? e : null;
}
const Fa = {
  enabled: "dice.animations.enabled"
};
function xc() {
  game.settings.register(u, Fa.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Oc() {
  return {
    enabled: game.settings.get(u, Fa.enabled) === !0
  };
}
const we = "chatCard", Yr = "data-paranormal-toolkit-prompt-id", i = `${u}-item-use-prompt`, Mc = `.${i}__title`, Ba = `.${i}__header`, Fc = `.${i}__roll-card`, Bc = `.${i}__roll-meta`, Uc = `.${i}__roll-meta-pill`, er = `.${i}__resistance`, qc = `.${i}__resistance-header`, Ua = `.${i}__resistance-description`, ke = `.${i}__resistance-roll-button`, qa = `.${i}__resistance-roll-result`, Qr = `${i}__resistance-content`, za = `.${i}__workflow-section`, ja = `.${i}__workflow-roll`, nr = `${i}__workflow-roll--dice-open`, rr = `.${i}__workflow-roll-formula`, or = `${i}__workflow-roll-formula--toggle`, Ee = `.${i}__workflow-dice-tray`, zc = `.${i}__roll-detail-toggle`, jc = `.${i}__roll-detail-list`, Gc = `.${i}__ritual-element-badge`, Vc = `.${i}__ritual-metadata`, Hc = "casting-backlash", Wc = "data-paranormal-toolkit-action-section", Kc = "data-paranormal-toolkit-prompt-id", Yc = "data-paranormal-toolkit-pending-id", Zr = "data-paranormal-toolkit-casting-backlash-enhanced", Xr = `.${i}`, Qc = `.${i}__workflow-section--casting`, Zc = `.${i}__workflow-section-header`, Xc = `.${i}__workflow-notes`, Jc = `[${Wc}="${Hc}"]`, Jr = `${i}__workflow-section-title-row`, tu = `${i}__workflow-section-header--casting-backlash`, Ga = `${i}__casting-backlash-button`;
function eu(t) {
  for (const e of nu(t))
    ru(e), lu(e);
}
function nu(t) {
  const e = /* @__PURE__ */ new Set();
  t instanceof HTMLElement && t.matches(Xr) && e.add(t);
  for (const n of t.querySelectorAll(Xr))
    e.add(n);
  return Array.from(e);
}
function ru(t) {
  const e = t.querySelector(Jc);
  if (!e) return;
  const n = ou(e);
  if (!n) return;
  const r = t.querySelector(`${Qc} ${Zc}`);
  r && (r.classList.add(tu), au(r), iu(n), r.append(n), e.remove());
}
function ou(t) {
  return t.querySelector(
    `button[${Yc}], button[${Kc}]`
  );
}
function au(t) {
  const e = t.querySelector(`:scope > .${Jr}`);
  if (e) return e;
  const n = document.createElement("div");
  n.classList.add(Jr);
  const r = Array.from(t.childNodes);
  t.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(Ga) || n.append(o));
  return n;
}
function iu(t) {
  if (t.getAttribute(Zr) === "true") return;
  const e = t.textContent?.trim() || "Aplicar dano na SAN", n = su(e, t.disabled);
  t.classList.add(Ga), t.setAttribute(Zr, "true"), t.setAttribute("title", n), t.setAttribute("aria-label", n);
}
function su(t, e) {
  return e ? "Dano na SAN já aplicado" : `${t.toLocaleLowerCase().includes("san") ? t : `${t} na SAN`} no conjurador`;
}
function lu(t) {
  for (const e of t.querySelectorAll(Xc)) {
    for (const n of Array.from(e.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    e.children.length === 0 && e.remove();
  }
}
function cu(t) {
  for (const e of Array.from(t.querySelectorAll(za)))
    for (const n of Array.from(e.querySelectorAll(`${zc}, ${jc}`)))
      n.remove();
}
const Nt = "data-paranormal-toolkit-prompt-id", uu = "data-paranormal-toolkit-resistance-roll-result", du = "Conjuração DT";
function Va(t) {
  const e = t.querySelector(ke)?.getAttribute(uu), n = Bt(e);
  if (n !== null) return n;
  const r = t.querySelector(qa)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Bt(o?.[1] ?? null);
}
function ar(t) {
  const e = hu(t), n = fu(e);
  if (n !== null) return n;
  const r = pu(e);
  return r !== null ? r : gu(t);
}
function mu(t) {
  const e = t.getAttribute(Nt);
  if (!e) return null;
  const n = Wa(t), r = Ka(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Ie(l) ? l.pendingId === e : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function K(t) {
  return t?.trim().toLocaleLowerCase() ?? "";
}
function Ha(t) {
  return K(t).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function fu(t) {
  const e = bu(t);
  return e.length === 0 ? null : Bt(yu(e, du));
}
function pu(t) {
  const e = typeof t?.actorId == "string" ? t.actorId : null;
  if (!e) return null;
  const r = game.actors?.get?.(e);
  return !r || typeof r != "object" ? null : to(r, ["system", "ritual", "DT"]) ?? to(r, ["system", "ritual", "dt"]);
}
function gu(t) {
  const e = Array.from(t.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!e) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(e);
  return Bt(n?.[1] ?? null);
}
function hu(t) {
  const e = _u(t);
  if (!e) return null;
  const n = Wa(t), r = Ka(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => Ie(a) ? a.pendingId === e : !1) ?? null;
}
function _u(t) {
  return (t.closest(`[${Nt}]`) ?? t.querySelector(`[${Nt}]`) ?? t.parentElement?.querySelector(`[${Nt}]`) ?? null)?.getAttribute(Nt) ?? null;
}
function Wa(t) {
  const n = t.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return Au(o) ? o : null;
}
function Ka(t) {
  const e = t?.getFlag?.(u, we);
  return Ie(e) ? e : null;
}
function bu(t) {
  return Array.isArray(t?.summaryLines) ? t.summaryLines.filter((e) => typeof e == "string") : [];
}
function yu(t, e) {
  const n = `${e}:`;
  for (const r of t) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function to(t, e) {
  let n = t;
  for (const r of e) {
    if (!Ie(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Bt(typeof n == "string" ? n : null);
}
function Bt(t) {
  if (!t) return null;
  const e = Number(t);
  return Number.isFinite(e) ? Math.trunc(e) : null;
}
function Au(t) {
  return !!(t && typeof t == "object" && typeof t.getFlag == "function");
}
function Ie(t) {
  return !!(t && typeof t == "object");
}
const Tu = `.${i}__actions`, ir = `.${i}__actions-title`, de = `.${i}__button`, $u = "data-paranormal-toolkit-action-section", Ru = `${i}__button--executed`, wu = "data-paranormal-toolkit-executed-label";
function Ya(t) {
  return K(t.querySelector(ir)?.textContent);
}
function ku(t, e) {
  const n = t.querySelector(ir);
  n && (n.textContent = e);
}
function Ce(t, e) {
  const n = K(e);
  return Array.from(t.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const o = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return K(o) === n;
  }) ?? null;
}
function sr(t, e) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, e), n.setAttribute("aria-hidden", "true"), n.textContent = t, n;
}
function Vt(t) {
  const e = document.createElement("span");
  return e.classList.add(`${i}__button-label`), e.textContent = t, e;
}
const Eu = "data-paranormal-toolkit-damage-resolution-state", eo = "data-paranormal-toolkit-damage-icon-enhanced", Iu = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function Cu(t, e) {
  e.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), ku(e, "Aplicar dano"), Su(t, e);
}
function Su(t, e) {
  const n = Array.from(e.querySelectorAll(de)), r = no(n, "normal"), o = no(n, "half");
  if (!r || !o) {
    e.classList.add(`${i}__actions--compact`);
    return;
  }
  ro(r, "normal"), ro(o, "half");
  const a = Lu();
  if (e.classList.toggle(`${i}__actions--assisted`, a === "assisted"), e.classList.toggle(`${i}__actions--manual`, a !== "assisted"), a !== "assisted") {
    H(r, !0), H(o, !0), Jt(e, "manual", null);
    return;
  }
  const s = Va(t), l = ar(t);
  if (l === null) {
    H(r, !0), H(o, !0), Jt(e, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (s === null) {
    H(r, !0), H(o, !1), Jt(e, "pending", null);
    return;
  }
  const c = s >= l;
  H(r, !c), H(o, c), Jt(
    e,
    c ? "resisted" : "failed",
    c ? `Resistiu: ${s} vs DT ${l}.` : `Falhou: ${s} vs DT ${l}.`
  );
}
function no(t, e) {
  const n = Iu[e];
  return t.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function ro(t, e) {
  if (t.getAttribute(eo) === "true") return;
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
  ), t.setAttribute(eo, "true"), t.setAttribute("aria-label", n), t.replaceChildren(r, Vt(n));
}
function H(t, e) {
  t.hidden = !e, t.classList.toggle(`${i}__button--damage-resolution-selected`, e);
}
function Jt(t, e, n) {
  t.setAttribute(Eu, e);
  const r = t.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${i}__damage-resolution-summary`), o.textContent = n, r || t.querySelector(ir)?.after(o);
}
function Lu() {
  try {
    return rc();
  } catch {
    return "assisted";
  }
}
const Ut = "data-paranormal-toolkit-effect-icon-enhanced", $t = "data-paranormal-toolkit-effect-action-compacted", Se = "data-paranormal-toolkit-effect-resistance-gate", lr = "data-paranormal-toolkit-effect-section", cr = "data-paranormal-toolkit-effect-label";
function Du(t) {
  return t.querySelector(`[${lr}="true"]`);
}
function Pu(t) {
  const e = Nu(t);
  if (!e) return t.existingSection;
  const n = t.existingSection ?? xu(), r = Gu(n, t.sourceActions, e);
  return r && n.setAttribute(cr, r), Ou(n, e, r), zu(t.rollCard, n, t.after ?? t.fallbackAfter), ju(t.sourceActions, n), n;
}
function vu(t, e) {
  const n = e.querySelector(de);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (Za(n, r)) {
    Hu(n);
    return;
  }
  const o = Ja(e, n, r);
  if (!Wu(t, o)) {
    ti(n);
    return;
  }
  const a = ar(t), s = Va(t);
  if (a === null || s === null) {
    Ku(n);
    return;
  }
  if (s >= a) {
    Yu(n);
    return;
  }
  Qu(n, o);
}
function Nu(t) {
  return t.sourceActions?.querySelector(de) ?? t.existingSection?.querySelector(de) ?? null;
}
function xu() {
  const t = document.createElement("section");
  return t.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), t.setAttribute(lr, "true"), t;
}
function Ou(t, e, n) {
  t.setAttribute(lr, "true"), t.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), t.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = Mu(t), o = Fu(r);
  o.textContent = "Efeito";
  const a = Bu(t, r), s = Uu(a);
  s.textContent = Zu(n ?? Ja(t, e, e.textContent?.trim() ?? ""));
  const l = qu(a);
  e.parentElement !== l && l.append(e);
  const c = e.textContent?.trim() ?? "";
  !Za(e, c) && !Vu(e, c) && Xa(e, n ?? c);
}
function Mu(t) {
  const e = t.querySelector(`:scope > .${i}__workflow-section-header`);
  if (e) return e;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), t.prepend(n), n;
}
function Fu(t) {
  const e = t.querySelector("strong");
  if (e) return e;
  const n = document.createElement("strong");
  return t.append(n), n;
}
function Bu(t, e) {
  const n = t.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), e.after(r), r;
}
function Uu(t) {
  const e = t.querySelector(`:scope > .${i}__effect-section-label`);
  if (e) return e;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), t.prepend(n), n;
}
function qu(t) {
  const e = t.querySelector(`:scope > .${i}__effect-section-action`);
  if (e) return e;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), t.append(n), n;
}
function zu(t, e, n) {
  if (!n) {
    if (e.parentElement === t && e.nextElementSibling === null) return;
    t.append(e);
    return;
  }
  e.parentElement === t && e.previousElementSibling === n || t.insertBefore(e, n.nextElementSibling);
}
function ju(t, e) {
  !t || t === e || t.remove();
}
function Gu(t, e, n) {
  const r = t.getAttribute(cr);
  if (r && r.trim().length > 0) return r.trim();
  const o = e?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return o || Qa(n, n.textContent?.trim() ?? "");
}
function Qa(t, e) {
  const n = t.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && K(n) !== "efeito aplicado") return n;
  const r = mu(t);
  if (r) return r;
  const o = e.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && K(o) !== "aplicado" ? o : null;
}
function Za(t, e) {
  return t.classList.contains(Ru) || K(e).includes("aplicado");
}
function Vu(t, e) {
  const n = t.getAttribute(Se);
  if (n === "pending" || n === "resisted") return !0;
  const r = Ha(e);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function Xa(t, e) {
  t.getAttribute($t) === "true" && t.getAttribute(Ut) === "true" || (t.disabled = !1, t.classList.add(`${i}__button--effect-resolution-action`), t.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), t.setAttribute($t, "true"), t.setAttribute(Ut, "true"), t.setAttribute(wu, "✓ Aplicado"), t.setAttribute("aria-label", `Aplicar ${e}`), t.replaceChildren(
    sr("✦", `${i}__button-icon--effect`),
    Vt("Aplicar")
  ));
}
function Hu(t) {
  t.getAttribute($t) === "true" && K(t.textContent) === "✓ aplicado" || (t.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), t.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), t.setAttribute($t, "true"), t.setAttribute(Ut, "true"), t.setAttribute("aria-label", "Efeito aplicado"), t.replaceChildren(
    sr("✓", `${i}__button-icon--effect-applied`),
    Vt("Aplicado")
  ));
}
function Ja(t, e, n) {
  const r = t.getAttribute(cr) ?? t.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Qa(e, n) ?? n;
}
function Wu(t, e) {
  if (!t.querySelector(er)) return !1;
  const n = Ha(e);
  return n.includes("vulneravel") || n.includes("vulnerable");
}
function Ku(t) {
  t.disabled = !0, t.removeAttribute($t), t.removeAttribute(Ut), t.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), t.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), t.setAttribute(Se, "pending"), t.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), t.replaceChildren(Vt("Role resistência"));
}
function Yu(t) {
  t.disabled = !0, t.removeAttribute($t), t.removeAttribute(Ut), t.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), t.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), t.setAttribute(Se, "resisted"), t.setAttribute("aria-label", "O alvo resistiu ao efeito"), t.replaceChildren(
    sr("✓", `${i}__button-icon--effect-resisted`),
    Vt("Resistiu")
  );
}
function Qu(t, e) {
  ti(t), Xa(t, e);
}
function ti(t) {
  t.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), t.removeAttribute(Se);
}
function Zu(t) {
  return t.replace(/\s*:\s*/u, " · ");
}
const Xu = {
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
}, Ju = new Set(
  Object.values(Xu)
), td = {
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
function ed(t) {
  if (t == null)
    return { ok: !0, value: null, normalized: null };
  const e = nd(t);
  if (!e)
    return { ok: !0, value: null, normalized: null };
  const n = td[e];
  return n !== void 0 ? { ok: !0, value: n, normalized: e } : Ju.has(t) ? { ok: !0, value: t, normalized: e } : { ok: !1, input: t, normalized: e };
}
function ei(t) {
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
function nd(t) {
  const e = t.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return e.length > 0 ? e : null;
}
class ni {
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
      const y = rd(f, d);
      if (!y.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const T = ed(f.damageType);
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
          od(y.id, f, T.value)
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
        for (const G of id($.conditions))
          l.add(G);
        const g = ad($.newPV);
        g !== null && (c = g), s.push({
          id: y.id,
          label: f.label ?? ei(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: oo($.finalDamage, y.amount),
          blocked: oo($.blocked, 0),
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
function rd(t, e) {
  if (!Number.isFinite(t.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(t.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: t.id ?? `damage-${e + 1}`,
    amount: n
  };
}
function od(t, e, n) {
  return {
    id: t,
    label: e.label ?? ei(n),
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
function oo(t, e) {
  return typeof t == "number" && Number.isFinite(t) ? t : e;
}
function ad(t) {
  return typeof t == "number" && Number.isFinite(t) ? t : null;
}
function id(t) {
  return Array.isArray(t) ? t.filter(
    (e) => typeof e == "string" && e.length > 0
  ) : [];
}
class ur {
  async rollResistance(e) {
    const n = await ld(e.actor, e.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${e.skill} pelo sistema Ordem.`);
    return {
      skill: e.skill,
      skillLabel: e.skillLabel ?? it(e.skill),
      roll: n,
      formula: ud(n),
      total: dd(n),
      diceBreakdown: md(n)
    };
  }
  getSkillLabel(e) {
    return it(e);
  }
}
async function sd(t, e) {
  return new ur().rollResistance({ actor: t, skill: e });
}
function it(t) {
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
async function ld(t, e) {
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
  return cd(r);
}
function cd(t) {
  return ao(t) ? t : Array.isArray(t) ? t.find(ao) ?? null : null;
}
function ao(t) {
  return !!(t && typeof t == "object" && "evaluate" in t && "total" in t);
}
function ud(t) {
  const e = t.formula;
  return typeof e == "string" && e.trim().length > 0 ? e : "rolagem";
}
function dd(t) {
  const e = t.total;
  return typeof e == "number" && Number.isFinite(e) ? Math.trunc(e) : 0;
}
function md(t) {
  const e = t.dice;
  if (!Array.isArray(e)) return null;
  const n = e.find(fd);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function fd(t) {
  return !!(t && typeof t == "object" && t.faces === 20);
}
class ri {
  constructor(e) {
    this.adapter = e;
  }
  adapter;
  async applyDamage(e) {
    return this.adapter.applyDamage(e);
  }
}
class oi {
  constructor(e) {
    this.adapter = e;
  }
  adapter;
  async rollResistance(e) {
    const n = e.skillLabel ?? this.adapter.getSkillLabel?.(e.skill) ?? e.skill, r = await this.adapter.rollResistance({ ...e, skillLabel: n });
    return {
      ...r,
      skill: r.skill || e.skill,
      skillLabel: r.skillLabel || n
    };
  }
  getSkillLabel(e) {
    return this.adapter.getSkillLabel?.(e) ?? e;
  }
}
function pd(t, e) {
  const n = Td(t?.rounds);
  if (!n)
    return io(null);
  const r = t?.anchor ?? ai(e);
  if (!r)
    return {
      ...io(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = t?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: gd(),
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
function ai(t) {
  const e = $d();
  if (!e?.id || !ii(e.round)) return null;
  const n = yd(e), r = hd(t, n) ?? bd(e), o = W(r?.id), a = wd(r?.initiative), s = _d(e, r, n);
  return {
    mode: "combatantTurn",
    combatId: e.id,
    combatantId: o,
    round: e.round,
    turn: s,
    initiative: a,
    time: Rd()
  };
}
function gd() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function io(t) {
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
function hd(t, e) {
  return t?.id ? e.find((n) => Ad(n) === t.id) ?? null : null;
}
function _d(t, e, n) {
  const r = W(e?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return kd(t.turn) ? t.turn : null;
}
function bd(t) {
  return oe(t.combatant) ? t.combatant : null;
}
function yd(t) {
  const e = t.combatants;
  if (Array.isArray(e)) return e.filter(oe);
  if (e && typeof e == "object") {
    const n = e.contents;
    if (Array.isArray(n)) return n.filter(oe);
    const r = e.values;
    if (typeof r == "function")
      return Array.from(r.call(e)).filter(oe);
  }
  return [];
}
function Ad(t) {
  return W(t.actor?.id) ?? W(t.actorId) ?? W(t.token?.actor?.id) ?? W(t.token?.actorId) ?? W(t.document?.actor?.id) ?? W(t.document?.actorId);
}
function Td(t) {
  return ii(t) ? Math.trunc(t) : null;
}
function $d() {
  return game.combat ?? null;
}
function Rd() {
  const t = game.time?.worldTime;
  return typeof t == "number" && Number.isFinite(t) ? t : 0;
}
function oe(t) {
  return !!(t && typeof t == "object");
}
function W(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function wd(t) {
  return typeof t == "number" && Number.isFinite(t) ? t : null;
}
function ii(t) {
  return typeof t == "number" && Number.isInteger(t) && t > 0;
}
function kd(t) {
  return typeof t == "number" && Number.isInteger(t) && t >= 0;
}
class si {
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
    if (!xd(r))
      return p({
        actor: e.actor,
        actorId: e.actor?.id ?? null,
        actorName: e.actor?.name ?? "Ator sem nome",
        conditionId: e.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${e.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = pd(e.duration, r), s = Ed(o, e, a), c = e.refreshExisting ?? !0 ? Od(r, o.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), _(so(r, o, c.id ?? null, !1, !0, a));
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
      return _(so(r, o, f, !0, !1, a));
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
    const r = this.resolveCanonicalConditionId(e.conditionId), o = ci(n, r);
    let a = 0;
    try {
      for (const s of o)
        await lo(n, s) === "deleted" && (a += 1);
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
    const n = Bd(), r = [];
    let o = 0, a = 0;
    for (const s of n) {
      const l = dr(s);
      o += l.length;
      for (const c of l) {
        if (!Sd(c, e)) continue;
        const d = li(c);
        try {
          await lo(s, c) === "deleted" && (a += 1);
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
function Ed(t, e, n) {
  const r = {
    schemaVersion: 1,
    conditionId: t.id,
    conditionLabel: t.label,
    definitionVersion: t.definitionVersion,
    source: e.source ?? null,
    originUuid: e.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Yd(),
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
    duration: Id(n.duration),
    start: Cd(n.start),
    showIcon: 2,
    statuses: [t.id],
    flags: {
      [u]: r
    }
  };
}
function Id(t) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...t
  };
}
function Cd(t) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Kd(),
    ...t
  };
}
function so(t, e, n, r, o, a) {
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
function Sd(t, e) {
  const n = li(t);
  if (!n.conditionId || !Ld(n)) return !1;
  if (e.removeAllForCombat === !0)
    return !!(e.combatId && n.combatId === e.combatId);
  const r = Wd();
  return n.durationMode === "combatantTurn" || Dd(n) ? vd(n, r) : Pd(t) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !D(n.startRound) || !D(n.requestedRounds) || !D(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Ld(t) {
  return t.deleteOnExpire || t.expiresWithCombat ? !0 : t.combatDurationApplied && D(t.requestedRounds);
}
function Dd(t) {
  return !!(t.combatDurationApplied && D(t.requestedRounds) && D(t.startRound) && (t.startCombatantId || me(t.startTurn)));
}
function Pd(t) {
  const e = t.duration;
  if (!e || typeof e != "object") return !1;
  if (e.expired === !0) return !0;
  const n = e.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function vd(t, e) {
  if (!e?.id || t.combatId && t.combatId !== e.id || !D(t.startRound) || !D(t.requestedRounds) || !D(e.round)) return !1;
  const n = t.startRound + t.requestedRounds;
  if (e.round < n) return !1;
  if (e.round > n) return !0;
  const r = Nd(e);
  return t.startCombatantId ? r === t.startCombatantId : me(t.startTurn) && me(e.turn) ? e.turn === t.startTurn : !1;
}
function Nd(t) {
  return gt(t.combatant?.id);
}
function li(t) {
  const e = t.duration && typeof t.duration == "object" ? t.duration : {}, n = t.start && typeof t.start == "object" ? t.start : {};
  return {
    conditionId: ae(t, "conditionId"),
    requestedRounds: co(t, "requestedRounds") ?? xt(e.value) ?? xt(e.rounds),
    combatDurationApplied: Ve(t, "combatDurationApplied"),
    combatId: ae(t, "combatId") ?? gt(n.combat) ?? gt(e.combat),
    startCombatantId: ae(t, "startCombatantId") ?? gt(n.combatant),
    startInitiative: jd(t, "startInitiative") ?? di(n.initiative),
    startRound: co(t, "startRound") ?? xt(n.round) ?? xt(e.startRound),
    startTurn: zd(t, "startTurn") ?? mn(n.turn) ?? mn(e.startTurn),
    expiryEvent: Gd(t, "expiryEvent") ?? mi(e.expiry),
    durationMode: Vd(t, "durationMode"),
    deleteOnExpire: Ve(t, "deleteOnExpire"),
    expiresWithCombat: Ve(t, "expiresWithCombat")
  };
}
function xd(t) {
  return !!(t && typeof t.createEmbeddedDocuments == "function");
}
function Od(t, e) {
  return ci(t, e)[0] ?? null;
}
function ci(t, e) {
  return dr(t).filter((n) => qd(n) === e);
}
async function lo(t, e) {
  const n = e.id ?? null, r = n ? Md(t, n) : e;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (Fd(o)) return "missing";
    throw o;
  }
}
function Md(t, e) {
  return dr(t).find((n) => n.id === e) ?? null;
}
function Fd(t) {
  const e = t instanceof Error ? t.message : String(t);
  return e.includes("does not exist in the EmbeddedCollectionDelta collection") || e.includes("does not exist in the EmbeddedCollection collection");
}
function Bd() {
  const t = /* @__PURE__ */ new Map(), e = game.actors;
  if (Array.isArray(e?.contents))
    for (const n of e.contents)
      te(t, n);
  typeof e?.forEach == "function" && e.forEach((n) => {
    te(t, n);
  });
  for (const n of Ud())
    te(t, n.actor), te(t, n.document?.actor);
  return Array.from(t.values());
}
function te(t, e) {
  if (!Hd(e)) return;
  const r = gt(e.uuid) ?? e.id ?? e.name ?? `actor-${t.size}`;
  t.set(r, e);
}
function Ud() {
  const t = canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function dr(t) {
  const e = t.effects;
  return e ? Array.isArray(e) ? e : Array.isArray(e.contents) ? e.contents : typeof e.filter == "function" ? e.filter(() => !0) : [] : [];
}
function qd(t) {
  return ae(t, "conditionId");
}
function ae(t, e) {
  return gt(lt(t, e));
}
function co(t, e) {
  return xt(lt(t, e));
}
function zd(t, e) {
  return mn(lt(t, e));
}
function jd(t, e) {
  return di(lt(t, e));
}
function Gd(t, e) {
  return mi(lt(t, e));
}
function Vd(t, e) {
  const n = lt(t, e);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Ve(t, e) {
  return lt(t, e) === !0;
}
function lt(t, e) {
  const n = t.getFlag?.(u, e);
  if (n !== void 0) return n;
  const r = t.flags;
  if (!r || typeof r != "object") return;
  const o = r[u];
  if (!(!o || typeof o != "object"))
    return o[e];
}
function gt(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function xt(t) {
  return D(t) ? Math.trunc(t) : null;
}
function mn(t) {
  return me(t) ? Math.trunc(t) : null;
}
function di(t) {
  return typeof t == "number" && Number.isFinite(t) ? t : null;
}
function mi(t) {
  return t === "turnStart" || t === "turnEnd" ? t : null;
}
function Hd(t) {
  return !!(t && typeof t == "object" && "effects" in t);
}
function Wd() {
  return game.combat ?? null;
}
function Kd() {
  const t = game.time?.worldTime;
  return typeof t == "number" && Number.isFinite(t) ? t : 0;
}
function D(t) {
  return typeof t == "number" && Number.isInteger(t) && t > 0;
}
function me(t) {
  return typeof t == "number" && Number.isInteger(t) && t >= 0;
}
function Yd() {
  return game.user?.id ?? null;
}
const Qd = "icons/svg/downgrade.svg", Zd = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(t) {
  return {
    id: t.id,
    aliases: t.aliases ?? [],
    label: t.label,
    icon: t.icon ?? Qd,
    description: Zd,
    definitionVersion: t.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Xd = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Jd = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), tm = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), em = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), nm = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), rm = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), om = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), am = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), im = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), sm = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), lm = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), cm = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), um = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), dm = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), mm = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), fm = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), pm = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), gm = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), hm = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), _m = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), bm = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), ym = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Am = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Tm = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), $m = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Rm = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), wm = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), km = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Em = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Im = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), Cm = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Sm = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Lm = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Dm = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Pm = [
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
  km,
  Em,
  Im,
  Cm,
  Sm,
  Lm,
  Dm
];
class vm {
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
    return Array.from(this.definitions.values()).map(uo);
  }
  get(e) {
    const n = this.lookup.get(mo(e)), r = n ? this.definitions.get(n) : null;
    return r ? _(uo(r)) : p({
      reason: "condition-not-found",
      conditionId: e,
      message: `Condição não registrada no Paranormal Toolkit: ${e}.`
    });
  }
  registerLookup(e, n) {
    const r = mo(e);
    r && this.lookup.set(r, n);
  }
}
function fi() {
  return new vm(Pm);
}
function uo(t) {
  return {
    ...t,
    aliases: t.aliases ? [...t.aliases] : void 0,
    changes: t.changes.map((e) => ({ ...e }))
  };
}
function mo(t) {
  return t.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Nm(t) {
  const e = document.createElement("div");
  e.classList.add(`${i}__workflow-roll`, ...t.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = t.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = t.total === null ? "—" : String(t.total), e.append(n, r);
  const o = Om(t.formula, t.diceBreakdown ?? null);
  return o && e.append(o), e;
}
function xm(t) {
  const e = Array.from(t?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return e.length > 0 ? `(${e.join(", ")})` : null;
}
function Om(t, e) {
  const n = Mm(e);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const o of Fm(n, t)) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-die`), o.active || a.classList.add(`${i}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function Mm(t) {
  return t ? (/\(([^)]+)\)/u.exec(t)?.[1] ?? t).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Fm(t, e) {
  if (t.length <= 1) return t.map((r) => ({ value: r, active: !0 }));
  const n = e.toLowerCase();
  return n.includes("kh") ? fo(t, "highest") : n.includes("kl") ? fo(t, "lowest") : t.map((r) => ({ value: r, active: !0 }));
}
function fo(t, e) {
  const n = e === "highest" ? Math.max(...t) : Math.min(...t);
  let r = !1;
  return t.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
const ee = "data-paranormal-toolkit-prompt-id", pi = "multiTargetResistanceResults", gi = "multiTargetDamageApplications", hi = "multiTargetEffectApplications";
function Bm(t) {
  const e = /* @__PURE__ */ new Map(), r = Le(t)?.[pi];
  if (!v(r)) return e;
  for (const [o, a] of Object.entries(r))
    Hm(a) && a.targetId === o && e.set(o, a);
  return e;
}
async function Um(t, e) {
  await mr(t, pi, e.targetId, e);
}
function qm(t) {
  const e = /* @__PURE__ */ new Map(), r = Le(t)?.[gi];
  if (!v(r)) return e;
  for (const [o, a] of Object.entries(r))
    Wm(a) && a.targetId === o && e.set(o, a);
  return e;
}
async function zm(t, e) {
  await mr(
    t,
    gi,
    e.targetId,
    e
  );
}
function jm(t) {
  const e = /* @__PURE__ */ new Map(), r = Le(t)?.[hi];
  if (!v(r)) return e;
  for (const [o, a] of Object.entries(r))
    Ym(a) && a.targetId === o && e.set(o, a);
  return e;
}
async function Gm(t, e) {
  await mr(
    t,
    hi,
    e.targetId,
    e
  );
}
function Vm(t) {
  const e = Le(t);
  return e ? {
    actorId: He(e.actorId),
    itemId: He(e.itemId),
    itemName: He(e.itemName)
  } : null;
}
async function mr(t, e, n, r) {
  const o = _i(t);
  if (!o) return;
  const a = bi(t), s = yi(a);
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
  l && await Promise.resolve(a.setFlag?.(u, we, {
    ...s,
    prompts: c
  }));
}
function Le(t) {
  const e = _i(t);
  if (!e) return null;
  const n = bi(t), r = yi(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => v(a) ? a.pendingId === e : !1) ?? null;
}
function _i(t) {
  return (t.closest(`[${ee}]`) ?? t.querySelector(`[${ee}]`) ?? t.parentElement?.querySelector(`[${ee}]`) ?? null)?.getAttribute(ee) ?? null;
}
function bi(t) {
  const n = t.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return Qm(o) ? o : null;
}
function yi(t) {
  const e = t?.getFlag?.(u, we);
  return v(e) ? e : null;
}
function Hm(t) {
  return v(t) ? typeof t.targetId == "string" && typeof t.targetName == "string" && typeof t.skill == "string" && typeof t.skillLabel == "string" && typeof t.formula == "string" && typeof t.total == "number" && Number.isFinite(t.total) && (typeof t.diceBreakdown == "string" || t.diceBreakdown === null) && typeof t.rolledAt == "string" : !1;
}
function Wm(t) {
  return v(t) ? typeof t.targetId == "string" && typeof t.targetName == "string" && Km(t.mode) && typeof t.inputAmount == "number" && Number.isFinite(t.inputAmount) && typeof t.finalDamage == "number" && Number.isFinite(t.finalDamage) && typeof t.blocked == "number" && Number.isFinite(t.blocked) && typeof t.appliedAt == "string" : !1;
}
function Km(t) {
  return t === "normal" || t === "half";
}
function Ym(t) {
  return v(t) ? typeof t.targetId == "string" && typeof t.targetName == "string" && typeof t.conditionId == "string" && typeof t.conditionLabel == "string" && (typeof t.effectId == "string" || t.effectId === null) && typeof t.created == "boolean" && typeof t.refreshed == "boolean" && typeof t.appliedAt == "string" : !1;
}
function He(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
function Qm(t) {
  return !!(t && typeof t == "object" && typeof t.getFlag == "function");
}
function v(t) {
  return !!(t && typeof t == "object");
}
const Ai = "data-paranormal-toolkit-resistance-skill", Ti = "data-paranormal-toolkit-resistance-skill-label", fn = "data-paranormal-toolkit-multi-target-section", fr = "data-paranormal-toolkit-multi-target-damage-info", $i = "data-paranormal-toolkit-multi-target-effect-info", Ri = "data-paranormal-toolkit-multi-target-toggle", wi = "data-paranormal-toolkit-multi-target-details", L = "data-paranormal-toolkit-multi-target-target", Zm = "data-paranormal-toolkit-multi-target-state", pn = "data-paranormal-toolkit-multi-target-roll-total", gn = "data-paranormal-toolkit-multi-target-roll-formula", ie = "data-paranormal-toolkit-multi-target-roll-dice", hn = "data-paranormal-toolkit-multi-target-roll-skill", _n = "data-paranormal-toolkit-multi-target-roll-skill-label", bn = "data-paranormal-toolkit-multi-target-roll-target-name", yn = "data-paranormal-toolkit-multi-target-roll-rolled-at", An = "data-paranormal-toolkit-multi-target-damage-mode", Tn = "data-paranormal-toolkit-multi-target-damage-input-amount", $n = "data-paranormal-toolkit-multi-target-damage-final-amount", Rn = "data-paranormal-toolkit-multi-target-damage-blocked", wn = "data-paranormal-toolkit-multi-target-damage-target-name", kn = "data-paranormal-toolkit-multi-target-damage-applied-at", En = "data-paranormal-toolkit-multi-target-effect-condition-id", In = "data-paranormal-toolkit-multi-target-effect-condition-label", Cn = "data-paranormal-toolkit-multi-target-effect-effect-id", Sn = "data-paranormal-toolkit-multi-target-effect-created", Ln = "data-paranormal-toolkit-multi-target-effect-refreshed", Dn = "data-paranormal-toolkit-multi-target-effect-target-name", Pn = "data-paranormal-toolkit-multi-target-effect-applied-at", Xm = new si(fi()), Jm = new ri(new ni()), tf = new oi(new ur()), kt = "pending", Q = "success", De = "failure", ki = "rolled";
function ef(t) {
  const e = Ei(t);
  if (!e) return !1;
  t.rollCard.classList.add(`${i}__roll-card--multi-target`), Rf(t);
  const n = wf(t.rollCard);
  Ef(n, e.damage), Cf(t.rollCard, n);
  const r = Sf(t.rollCard);
  if (Ci(r, e), Zf(t.rollCard, r, n), e.effect) {
    const o = Xf(t.rollCard);
    Jf(o, e.effect), tp(t.rollCard, o, r);
  } else
    Mi(t.rollCard)?.remove();
  return !0;
}
function Ei(t) {
  const e = mf(t.rollCard, t.damageSection), n = ff(t.rollCard), r = pf(t.rollCard), o = gf(t.rollCard), a = nf(t.rollCard).map((s, l) => {
    const c = ap(s, l), d = n.get(c) ?? null;
    return {
      id: c,
      name: s,
      state: yf(d, e?.difficulty ?? null),
      resistanceResult: d,
      damageApplication: r.get(c) ?? null,
      effectApplication: o.get(c) ?? null
    };
  });
  return a.length <= 1 || !t.damageSection ? null : {
    rollCard: t.rollCard,
    targets: a,
    damage: rf(t.damageSection),
    effect: of(t.rollCard, t.effectSection),
    resistance: e
  };
}
function nf(t) {
  const n = t.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((o) => o.trim()).filter((o) => o.length > 0 && Bi(o) !== "nenhum alvo") : [];
}
function rf(t) {
  const e = Af(t), n = e !== null ? Math.floor(e / 2) : null;
  return {
    typeLabel: $f(t),
    formula: Tf(t) ?? "—",
    total: e,
    diceBreakdown: xm(t),
    normalAmount: e,
    halfAmount: n,
    normalLabel: e !== null ? `Normal: ${e} PV` : "Normal: —",
    normalCompactLabel: e !== null ? `${e} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function of(t, e) {
  const n = e?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), r = af(t, n ?? null);
  return r ? {
    label: n && n.length > 0 ? n : r.conditionLabel,
    conditionId: r.conditionId,
    conditionLabel: r.conditionLabel,
    duration: lf(r.duration),
    source: r.source,
    originUuid: r.originUuid
  } : null;
}
function af(t, e) {
  const n = Vm(t), r = cf(n);
  if (!r) return null;
  const o = $e(r);
  if (!o.ok) return null;
  const a = (o.value.conditionApplications ?? []).filter((l) => l.actor === "target");
  if (a.length === 0) return null;
  const s = sf(a, e);
  return s ? {
    conditionId: s.conditionId,
    conditionLabel: s.label ?? s.conditionId,
    duration: s.duration ?? null,
    source: s.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null
  } : null;
}
function sf(t, e) {
  if (t.length === 1) return t[0] ?? null;
  if (!e) return null;
  const n = B(e);
  return n ? t.find((r) => [
    r.label,
    r.conditionId
  ].some((o) => B(o) === n)) ?? null : null;
}
function lf(t) {
  return t ? {
    rounds: t.rounds ?? null,
    expiry: t.expiry ?? null
  } : null;
}
function cf(t) {
  if (!t) return null;
  const e = t.actorId ? rp(t.actorId) : null, n = e ? uf(e, t.itemId, t.itemName) : null;
  return n || df(t.itemId, t.itemName);
}
function uf(t, e, n) {
  const r = t.items;
  if (e) {
    const a = r?.get?.(e);
    if (_t(a)) return a;
  }
  const o = B(n);
  if (o) {
    const a = r?.find?.((s) => _t(s) ? B(s.name) === o : !1);
    if (_t(a)) return a;
  }
  return null;
}
function df(t, e) {
  const n = game.items;
  if (t) {
    const o = n?.get?.(t);
    if (_t(o)) return o;
  }
  const r = B(e);
  if (r) {
    const o = n?.find?.((a) => _t(a) ? B(a.name) === r : !1);
    if (_t(o)) return o;
  }
  return null;
}
function mf(t, e) {
  const n = e?.querySelector(`.${i}__resistance-description`)?.textContent?.trim(), r = e?.querySelector(ke) ?? null, o = r?.getAttribute(Ai) ?? null, a = r?.getAttribute(Ti) ?? (o ? it(o) : null);
  return !n && !o ? null : {
    description: n ?? "Resistência do alvo.",
    formula: e?.querySelector(`.${i}__resistance .${i}__workflow-roll-formula`)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: a,
    difficulty: ar(t)
  };
}
function ff(t) {
  const e = Bm(t);
  for (const [n, r] of bf(t))
    e.set(n, r);
  return e;
}
function pf(t) {
  const e = qm(t);
  for (const [n, r] of _f(t))
    e.set(n, r);
  return e;
}
function gf(t) {
  const e = jm(t);
  for (const [n, r] of hf(t))
    e.set(n, r);
  return e;
}
function hf(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = n.getAttribute(En), a = n.getAttribute(In), s = n.getAttribute(Cn), l = ho(n.getAttribute(Sn)), c = ho(n.getAttribute(Ln)), d = n.getAttribute(Dn), f = n.getAttribute(Pn);
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
function _f(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = n.getAttribute(An), a = se(n.getAttribute(Tn)), s = se(n.getAttribute($n)), l = se(n.getAttribute(Rn)), c = n.getAttribute(wn), d = n.getAttribute(kn);
    !r || !sp(o) || a === null || s === null || l === null || !c || !d || e.set(r, {
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
function bf(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = se(n.getAttribute(pn)), a = n.getAttribute(gn), s = n.getAttribute(hn), l = n.getAttribute(_n), c = n.getAttribute(bn), d = n.getAttribute(yn);
    !r || o === null || !a || !s || !l || !c || !d || e.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: a,
      total: o,
      diceBreakdown: n.getAttribute(ie),
      rolledAt: d
    });
  }
  return e;
}
function yf(t, e) {
  return t ? e === null ? ki : t.total >= e ? Q : De : kt;
}
function Af(t) {
  const e = t?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!e) return null;
  const n = Number(e.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function Tf(t) {
  const e = t?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return e && e.length > 0 ? e : null;
}
function $f(t) {
  const e = t?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return e && e.length > 0 ? e : null;
}
function Rf(t) {
  t.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), t.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function wf(t) {
  const e = kf(t);
  if (e) return e;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(fr, "true"), n;
}
function kf(t) {
  return t.querySelector(`[${fr}="true"]`);
}
function Ef(t, e) {
  t.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), t.append(n), e.typeLabel) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-section-description`), o.textContent = e.typeLabel, t.append(o);
  }
  t.append(Ii(e.formula, e.total, e.diceBreakdown));
}
function Ii(t, e, n, r = !1) {
  const o = Nm({
    formula: t,
    total: e,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return If(o, r), o;
}
function If(t, e) {
  const n = t.querySelector(Ee), r = t.querySelector(rr);
  if (!n || !r) return;
  t.classList.toggle(nr, e), n.hidden = !e, r.classList.add(or), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", e ? "true" : "false"), r.title = e ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const o = r.querySelector("i") ?? document.createElement("i");
  o.classList.add("fa-solid"), o.classList.toggle("fa-chevron-down", !e), o.classList.toggle("fa-chevron-up", e), o.setAttribute("aria-hidden", "true"), o.parentElement || r.append(o);
}
function Cf(t, e) {
  const n = Ce(t, "Conjuração");
  if (!n) {
    t.prepend(e);
    return;
  }
  e.parentElement === t && e.previousElementSibling === n || t.insertBefore(e, n.nextElementSibling);
}
function Sf(t) {
  const e = t.querySelector(`[${fn}="true"]`);
  if (e) return e;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(fn, "true"), n;
}
function Ci(t, e) {
  const n = Lf(t);
  t.replaceChildren(Df(e), vf(e, n));
}
function Lf(t) {
  return new Set(
    Array.from(t.querySelectorAll(`[${L}]`)).filter((e) => e.getAttribute("aria-expanded") === "true").map((e) => e.getAttribute(L)).filter(ip)
  );
}
function Df(t) {
  const e = document.createElement("div");
  e.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = Pf(t.targets), e.append(n, r), e;
}
function Pf(t) {
  const e = t.length, n = t.filter((l) => l.state === De).length, r = t.filter((l) => l.state === Q).length, o = t.filter((l) => l.state === kt).length, a = t.filter((l) => l.state === ki).length, s = [`${e} ${e === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), o > 0 && s.push(`${o} ${o === 1 ? "pendente" : "pendentes"}`), a > 0 && s.push(`${a} ${a === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function vf(t, e) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of t.targets)
    n.append(Nf(r, t, e.has(r.id)));
  return n;
}
function Nf(t, e, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${t.state}`), t.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), t.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(L, t.id), r.setAttribute(Zm, t.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${t.name}`), Si(r, t.resistanceResult), Li(r, t.damageApplication), Di(r, t.effectApplication);
  const o = xf(t, e, r), a = Wf(t, e);
  return a.hidden = !n, r.addEventListener("click", (s) => {
    go(s.target) || po(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || go(s.target) || (s.preventDefault(), po(r));
  }), r.append(o, a), r;
}
function Si(t, e) {
  if (!e) {
    t.removeAttribute(pn), t.removeAttribute(gn), t.removeAttribute(ie), t.removeAttribute(hn), t.removeAttribute(_n), t.removeAttribute(bn), t.removeAttribute(yn);
    return;
  }
  t.setAttribute(pn, String(e.total)), t.setAttribute(gn, e.formula), t.setAttribute(hn, e.skill), t.setAttribute(_n, e.skillLabel), t.setAttribute(bn, e.targetName), t.setAttribute(yn, e.rolledAt), e.diceBreakdown ? t.setAttribute(ie, e.diceBreakdown) : t.removeAttribute(ie);
}
function Li(t, e) {
  if (!e) {
    t.removeAttribute(An), t.removeAttribute(Tn), t.removeAttribute($n), t.removeAttribute(Rn), t.removeAttribute(wn), t.removeAttribute(kn);
    return;
  }
  t.setAttribute(An, e.mode), t.setAttribute(Tn, String(e.inputAmount)), t.setAttribute($n, String(e.finalDamage)), t.setAttribute(Rn, String(e.blocked)), t.setAttribute(wn, e.targetName), t.setAttribute(kn, e.appliedAt);
}
function Di(t, e) {
  if (!e) {
    t.removeAttribute(En), t.removeAttribute(In), t.removeAttribute(Cn), t.removeAttribute(Sn), t.removeAttribute(Ln), t.removeAttribute(Dn), t.removeAttribute(Pn);
    return;
  }
  t.setAttribute(En, e.conditionId), t.setAttribute(In, e.conditionLabel), t.setAttribute(Cn, e.effectId ?? ""), t.setAttribute(Sn, String(e.created)), t.setAttribute(Ln, String(e.refreshed)), t.setAttribute(Dn, e.targetName), t.setAttribute(Pn, e.appliedAt);
}
function xf(t, e, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const o = document.createElement("div");
  o.classList.add(`${i}__target-summary-main`);
  const a = Of(t), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = t.name;
  const l = Mf(t, e.resistance);
  Bf(l, n, t, e);
  const c = Hf(n);
  o.append(a, s, l, c);
  const d = document.createElement("div");
  return d.classList.add(`${i}__target-summary-actions`), d.append(
    Pi(t, e, "compact"),
    xi(t, e, "compact")
  ), r.append(o, d), r;
}
function Of(t) {
  const e = document.createElement("span");
  return e.classList.add(`${i}__target-avatar`), e.setAttribute("aria-hidden", "true"), e.textContent = t.name.trim().charAt(0).toLocaleUpperCase() || "?", e;
}
function Mf(t, e) {
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${t.state}`), n.setAttribute("aria-label", Ff(t, e)), e?.skill && (n.setAttribute(Ai, e.skill), n.setAttribute(Ti, e.skillLabel ?? it(e.skill))), !e?.skill)
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
  return o.classList.add(`${i}__target-resistance-mark`), o.setAttribute("aria-hidden", "true"), o.textContent = t.state === Q ? "✓" : t.state === De ? "✕" : "", n.append(r, o), n;
}
function Ff(t, e) {
  const n = e?.skillLabel ?? e?.skill ?? "resistência";
  if (!t.resistanceResult) return `Rolar ${n} de ${t.name}`;
  const r = t.state === Q ? "sucesso" : t.state === De ? "falha" : "resultado";
  return `${n} de ${t.name}: ${t.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Bf(t, e, n, r) {
  t.addEventListener("click", (o) => {
    o.stopPropagation(), Uf(e, t, n, r);
  });
}
async function Uf(t, e, n, r) {
  const o = r.resistance, a = o?.skill, s = o?.skillLabel ?? (a ? it(a) : "Resistência");
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = gr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  e.disabled = !0, e.classList.add(`${i}__target-resistance-button--rolling`);
  const c = e.innerHTML;
  e.textContent = "...";
  try {
    const d = await tf.rollResistance({ actor: l, skill: a, skillLabel: s });
    await op(d.roll);
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
    Si(t, f);
    try {
      await Um(r.rollCard, f);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", y);
    }
    pr(t);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), e.innerHTML = c;
  } finally {
    e.disabled = !1, e.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function pr(t) {
  const e = t.closest(`[${fn}="true"]`), n = t.closest(`.${i}__roll-card`);
  if (!e || !n) return;
  const r = Ei({
    rollCard: n,
    damageSection: qf(n) ?? Ce(n, "Dano"),
    effectSection: zf(n)
  });
  r && Ci(e, r);
}
function qf(t) {
  return Array.from(t.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((e) => e.getAttribute(fr) !== "true") ?? null;
}
function zf(t) {
  return t.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Pi(t, e, n) {
  if (t.damageApplication)
    return O(
      "✓",
      jf(t.damageApplication, n),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  if (t.state === kt)
    return O(
      "◇",
      n === "full" ? "Role resistência primeiro" : "Role res.",
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const r = vi(t), o = Ni(r, e.damage);
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
    f && Gf(f, c, t, e);
  }), c;
}
function jf(t, e) {
  const n = t.blocked > 0 ? ` (RD ${t.blocked})` : "";
  return e === "compact" ? `${t.finalDamage} PV` : `Dano aplicado: ${t.finalDamage} PV${n}`;
}
function vi(t) {
  return t.state === Q ? "half" : "normal";
}
function Ni(t, e) {
  return t === "half" ? e.halfAmount : e.normalAmount;
}
async function Gf(t, e, n, r) {
  if (n.damageApplication) return;
  if (n.state === kt) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const o = vi(n), a = Ni(o, r.damage);
  if (a === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const s = gr(n.name);
  if (!s) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  e.disabled = !0, e.classList.add(`${i}__target-action--applying`);
  const l = e.innerHTML;
  e.textContent = "Aplicando...";
  try {
    const c = await Jm.applyDamage({
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
    Li(t, d);
    try {
      await zm(r.rollCard, d);
    } catch (f) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", f);
    }
    ui.notifications?.info?.(`Paranormal Toolkit: ${d.finalDamage} PV aplicado em ${d.targetName}.`), pr(t);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", c), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), e.innerHTML = l;
  } finally {
    e.disabled = !1, e.classList.remove(`${i}__target-action--applying`);
  }
}
function xi(t, e, n) {
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
  if (t.state === kt)
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
    a && Vf(a, r, t, e);
  }), r;
}
async function Vf(t, e, n, r) {
  if (n.effectApplication) return;
  if (n.state === kt) {
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
  const a = gr(n.name);
  if (!a) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  e.disabled = !0, e.classList.add(`${i}__target-action--applying`);
  const s = e.innerHTML;
  e.textContent = "Aplicando...";
  try {
    const l = await Xm.applyCondition({
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
    Di(t, c);
    try {
      await Gm(r.rollCard, c);
    } catch (d) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", d);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), ui.notifications?.info?.(`Paranormal Toolkit: ${c.conditionLabel} aplicado em ${c.targetName}.`), pr(t);
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
function Hf(t) {
  const e = document.createElement("span");
  return e.classList.add(`${i}__target-toggle`), e.setAttribute(Ri, "true"), e.setAttribute("aria-hidden", "true"), Oi(t, e), e;
}
function po(t) {
  const e = t.querySelector(`[${wi}="true"]`);
  if (!e) return;
  const n = e.hidden;
  e.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = t.querySelector(`[${Ri}="true"]`);
  r && Oi(t, r);
}
function Oi(t, e) {
  const n = t.getAttribute("aria-expanded") === "true";
  e.textContent = n ? "⌃" : "⌄";
}
function go(t) {
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
function Wf(t, e) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(wi, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const a = document.createElement("span");
  a.textContent = e.resistance?.description ?? "Resistência pendente.", r.append(o, a);
  const s = Kf(t, e.resistance);
  s && r.append(s);
  const l = Yf(t, e.resistance), c = Qf(t, e);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${t.name}`), n;
}
function Kf(t, e) {
  if (!t.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), e?.difficulty === null || e?.difficulty === void 0)
    return n.textContent = `${t.resistanceResult.skillLabel}: ${t.resistanceResult.total}`, n;
  const r = t.state === Q ? "sucesso" : "falha";
  return n.textContent = `${t.resistanceResult.skillLabel}: ${t.resistanceResult.total} vs DT ${e.difficulty} — ${r}`, n;
}
function Yf(t, e) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = t.resistanceResult?.formula ?? e?.formula ?? "—", o = t.resistanceResult?.total ?? null, a = Ii(
    r,
    o,
    t.resistanceResult?.diceBreakdown ?? null,
    t.resistanceResult !== null
  );
  return n.append(a), n;
}
function Qf(t, e) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), n.append(
    Pi(t, e, "full"),
    xi(t, e, "full")
  ), n;
}
function Zf(t, e, n) {
  const r = n.parentElement === t ? n : Ce(t, "Conjuração");
  if (!r) {
    t.prepend(e);
    return;
  }
  e.parentElement === t && e.previousElementSibling === r || t.insertBefore(e, r.nextElementSibling);
}
function Xf(t) {
  const e = Mi(t);
  if (e) return e;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute($i, "true"), n;
}
function Mi(t) {
  return t.querySelector(`[${$i}="true"]`);
}
function Jf(t, e) {
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
function tp(t, e, n) {
  e.parentElement === t && e.previousElementSibling === n || t.insertBefore(e, n.nextElementSibling);
}
function gr(t) {
  const e = B(t);
  if (!e) return null;
  const n = ep().filter((a) => B(np(a)) === e).map((a) => Fi(a)).find(ht) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => ht(a) && B(a.name) === e);
  return ht(o) ? o : null;
}
function ep() {
  const e = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function np(t) {
  if (!t || typeof t != "object") return null;
  const e = t.name;
  if (typeof e == "string") return e;
  const n = t.document?.name;
  return typeof n == "string" ? n : Fi(t)?.name ?? null;
}
function Fi(t) {
  if (!t || typeof t != "object") return null;
  const e = t.actor;
  if (ht(e)) return e;
  const n = t.document?.actor;
  return ht(n) ? n : null;
}
function ht(t) {
  return !!(t && typeof t == "object" && "system" in t);
}
function rp(t) {
  const n = game.actors?.get?.(t);
  return ht(n) ? n : null;
}
function _t(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && typeof t.name == "string");
}
function B(t) {
  const e = t?.trim().toLocaleLowerCase();
  return e && e.length > 0 ? e : null;
}
async function op(t) {
  const e = game.dice3d;
  typeof e?.showForRoll == "function" && await Promise.resolve(e.showForRoll(t, game.user, !0));
}
function ap(t, e) {
  return `${e}-${Bi(t).replace(/[^a-z0-9]+/gu, "-")}`;
}
function Bi(t) {
  return t?.trim().toLocaleLowerCase() ?? "";
}
function ip(t) {
  return typeof t == "string" && t.length > 0;
}
function sp(t) {
  return t === "normal" || t === "half";
}
function ho(t) {
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
function se(t) {
  if (!t) return null;
  const e = Number(t);
  return Number.isFinite(e) ? Math.trunc(e) : null;
}
const bt = "data-paranormal-toolkit-prompt-id", lp = "data-paranormal-toolkit-card-layout-normalized", _o = "data-paranormal-toolkit-card-layout-refresh-bound", cp = "apply-damage", up = "data-paranormal-toolkit-multi-target-damage-info", Ui = [0, 80, 180, 400, 900, 1600, 3e3], bo = /* @__PURE__ */ new WeakSet();
function dp(t) {
  qi(t), mp(t);
}
function qi(t) {
  for (const e of Array.from(t.querySelectorAll(`.${i}__roll-card`)))
    ji(zi(e));
}
function mp(t) {
  if (!bo.has(t)) {
    bo.add(t);
    for (const e of Ui)
      globalThis.setTimeout(() => {
        qi(t);
      }, e);
  }
}
function zi(t) {
  return {
    rollCard: t,
    damageSection: fp(t),
    resistance: t.querySelector(er),
    damageActions: pp(t),
    effectActionSource: gp(t),
    effectSection: Du(t)
  };
}
function ji(t) {
  const {
    rollCard: e,
    damageSection: n,
    resistance: r,
    damageActions: o,
    effectActionSource: a,
    effectSection: s
  } = t;
  e.setAttribute(lp, "true"), e.classList.add(`${i}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), Cu(e, o));
  const l = Pu({
    rollCard: e,
    existingSection: s,
    sourceActions: a,
    after: n,
    fallbackAfter: Ce(e, "Conjuração")
  });
  l && vu(e, l), ef({
    rollCard: e,
    damageSection: n,
    effectSection: l ?? s
  }), $p(e);
}
function fp(t) {
  return Array.from(t.querySelectorAll(`.${i}__workflow-section`)).find((e) => e.getAttribute(up) === "true" ? !1 : e.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function pp(t) {
  const e = hp(t);
  return e.find((n) => n.getAttribute($u) === cp) ?? e.find((n) => Ya(n) === "aplicar danos") ?? null;
}
function gp(t) {
  const e = Gi(t), n = yo(e);
  return n || yo(_p(t));
}
function yo(t) {
  return t.find((e) => {
    const n = Ya(e);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function hp(t) {
  const e = Gi(t);
  return e.length > 0 ? e : hr(t);
}
function Gi(t) {
  const e = Ap(t);
  return e ? hr(t).filter((n) => yp(n, e)) : [];
}
function _p(t) {
  const e = Vi(t);
  if (!e) return [];
  const n = bp(t, e);
  return hr(t).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => Hi(t, r)).filter((r) => !n || Tp(r, n));
}
function hr(t) {
  const e = Vi(t);
  return e ? Array.from(e.querySelectorAll(Tu)) : [];
}
function Vi(t) {
  return t.closest(`.${i}`) ?? t.parentElement;
}
function bp(t, e) {
  return Array.from(e.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== t && Hi(t, n)) ?? null;
}
function yp(t, e) {
  return t.getAttribute(bt) === e ? !0 : Array.from(t.querySelectorAll(`[${bt}]`)).some((n) => n.getAttribute(bt) === e);
}
function Ap(t) {
  return t.getAttribute(bt) ?? t.querySelector(`[${bt}]`)?.getAttribute(bt) ?? null;
}
function Hi(t, e) {
  return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Tp(t, e) {
  return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function $p(t) {
  const e = t.querySelector(ke);
  e && e.getAttribute(_o) !== "true" && (e.setAttribute(_o, "true"), e.addEventListener("click", () => {
    for (const n of Ui)
      globalThis.setTimeout(() => {
        ji(zi(t));
      }, n);
  }));
}
const Rp = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function wp(t) {
  for (const e of Array.from(t.querySelectorAll(er)))
    kp(e);
  dp(t);
}
function kp(t) {
  const e = t.querySelector(qc), n = t.querySelector(Ua), r = t.querySelector(ke), o = t.querySelector(qa);
  if (!r || !e && !n && !o) return;
  const a = Ep(t, r);
  e && e.parentElement !== a && a.append(e), n && n.parentElement !== a && a.append(n), o && (o.parentElement !== t && !r.contains(o) && t.append(o), Ip(o)), r.parentElement !== t && t.append(r);
}
function Ep(t, e) {
  const n = t.querySelector(`.${Qr}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Qr), t.insertBefore(r, e.parentElement === t ? e : t.firstChild), r;
}
function Ip(t) {
  const e = Cp(t.textContent ?? "");
  e && (t.setAttribute(Rp, "true"), t.replaceChildren(Dp(e)));
}
function Cp(t) {
  const e = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(t);
  if (!e) return null;
  const [, n, r, o] = e, a = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = Sp(r ?? "");
  return l ? {
    skillLabel: a,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function Sp(t) {
  const e = t.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(e);
  return n ? {
    formula: n[1]?.trim() ?? e,
    diceValues: Lp(n[2] ?? "")
  } : { formula: e, diceValues: [] };
}
function Lp(t) {
  return t.split(",").map((e) => Number(e.trim())).filter((e) => Number.isFinite(e)).map((e) => Math.trunc(e));
}
function Dp(t) {
  const e = document.createElement("div");
  e.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), e.setAttribute("data-paranormal-toolkit-resistance-total", String(t.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = t.formula, n.title = `${t.skillLabel}: ${t.formula}`, e.append(n);
  const r = Pp(t);
  return r && e.append(r), e;
}
function Pp(t) {
  if (t.diceValues.length === 0) return null;
  const e = document.createElement("div");
  e.classList.add(`${i}__workflow-dice-tray`);
  for (const n of vp(t.diceValues, t.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), e.append(r);
  }
  return e;
}
function vp(t, e) {
  if (t.length <= 1) return t.map((r) => ({ value: r, active: !0 }));
  const n = e.toLowerCase();
  return n.includes("kh") ? Ao(t, "highest") : n.includes("kl") ? Ao(t, "lowest") : t.map((r) => ({ value: r, active: !0 }));
}
function Ao(t, e) {
  const n = e === "highest" ? Math.max(...t) : Math.min(...t);
  let r = !1;
  return t.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function To(t) {
  if (t instanceof Document || t instanceof HTMLElement || t instanceof DocumentFragment)
    return t;
  if (!t || typeof t != "object") return null;
  const e = t;
  return e[0] instanceof HTMLElement ? e[0] : null;
}
function _r() {
  const t = globalThis.game;
  return Pe(t) ? t : null;
}
function P(t, e) {
  const n = Np(t, e);
  return le(n);
}
function Np(t, e) {
  return e.split(".").reduce((n, r) => Pe(n) ? n[r] : null, t);
}
function xp(t, e) {
  const n = t.indexOf(":");
  return n < 0 || qt(t.slice(0, n)) !== qt(e) ? null : Et(t.slice(n + 1));
}
function le(t) {
  return typeof t == "string" ? Et(t) : typeof t == "number" && Number.isFinite(t) ? String(t) : null;
}
function Pe(t) {
  return !!t && typeof t == "object";
}
function Op(t) {
  return typeof t == "string";
}
function ve(t) {
  return typeof t == "string" && t.trim().length > 0;
}
function Et(t) {
  if (!t) return null;
  const e = t.replace(/\s+/gu, " ").trim();
  return e.length > 0 ? e : null;
}
function qt(t) {
  return (t ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function vn(t) {
  return t.length === 0 ? t : t[0].toLocaleLowerCase("pt-BR") + t.slice(1);
}
function Y(t) {
  return t.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (e) => e[0].toLocaleUpperCase("pt-BR") + e.slice(1).toLocaleLowerCase("pt-BR"));
}
function Wi(t) {
  return t.replace(/[.。]+$/u, "").trim();
}
function Mp(t) {
  for (const e of Array.from(t.querySelectorAll(Fc))) {
    const n = Gp(e);
    Fp(e), n && (Bp(e, n), Up(e, n));
  }
}
function Fp(t) {
  for (const e of Array.from(t.querySelectorAll(Bc)))
    e.remove();
}
function Bp(t, e) {
  const r = t.closest(`.${i}`)?.querySelector(Ba) ?? null, o = r?.querySelector(Mc) ?? null, a = r ?? t, s = a.querySelector(Gc);
  if (!e.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = sg(e.elementTone), l.textContent = ig(e), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", l);
      return;
    }
    a.prepend(l);
  }
}
function Up(t, e) {
  const n = qp(t);
  zp(t, n);
  const r = jp(e);
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
  const a = t.querySelector(za);
  if (a) {
    t.insertBefore(o, a);
    return;
  }
  t.prepend(o);
}
function qp(t) {
  return t.closest(`.${i}`)?.querySelector(Ba) ?? null;
}
function zp(t, e) {
  const n = [t, e].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(Vc)))
      o.remove();
}
function jp(t) {
  return [
    t.cost,
    t.target ? `Alvo: ${vn(t.target)}` : null,
    t.duration ? `Duração: ${vn(t.duration)}` : null,
    t.resistance ? `Resistência: ${Wi(t.resistance)}` : null
  ].filter(ve);
}
function Gp(t) {
  const e = Vp(t), n = Zp(t), o = (e ? Qp(e) : null)?.system ?? null, a = e?.summaryLines ?? [], s = br(P(o, "element")), l = q("op.elementChoices", s) ?? $o(rt(a, "Elemento")) ?? $o(n.damageType), c = s ?? lg(l), d = P(o, "circle") ?? rt(a, "Círculo"), f = tg(o) ?? rt(a, "Alvo"), y = og(o, "duration", "op.durationChoices") ?? rt(a, "Duração"), T = Xp(t) ?? ng(o) ?? rt(a, "Resistência"), $ = Jp(a) ?? n.cost, g = {
    elementLabel: l,
    elementTone: c,
    circle: d,
    cost: $,
    target: f,
    duration: y,
    resistance: T
  };
  return ag(g) ? g : null;
}
function Vp(t) {
  const e = Hp(t);
  if (!e) return null;
  const n = e.getFlag?.(u, we), r = Kp(n);
  if (r.length === 0) return null;
  const o = Wp(t);
  if (o.size > 0) {
    const a = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function Hp(t) {
  const n = t.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? _r()?.messages?.get?.(n) ?? null : null;
}
function Wp(t) {
  const e = t.closest(`.${i}`) ?? t, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(e.querySelectorAll(`[${Yr}]`))) {
    const o = r.getAttribute(Yr)?.trim();
    o && n.add(o);
  }
  return n;
}
function Kp(t) {
  if (!Pe(t)) return [];
  const e = t.prompts;
  return Array.isArray(e) ? e.map(Yp).filter((n) => n !== null) : [];
}
function Yp(t) {
  return Pe(t) ? {
    pendingId: le(t.pendingId),
    actorId: le(t.actorId),
    itemId: le(t.itemId),
    summaryLines: Array.isArray(t.summaryLines) ? t.summaryLines.filter(Op) : []
  } : null;
}
function Qp(t) {
  if (!t.itemId) return null;
  const e = _r(), r = (t.actorId ? e?.actors?.get?.(t.actorId) : null)?.items?.get?.(t.itemId);
  return r || (e?.items?.get?.(t.itemId) ?? null);
}
function Zp(t) {
  let e = null, n = null;
  for (const r of Array.from(t.querySelectorAll(Uc))) {
    const o = Et(r.textContent);
    if (!o) continue;
    const a = xp(o, "Tipo");
    a && (n = a), !e && /\b(P[ED]|PE|PD)\b/iu.test(o) && (e = o);
  }
  return { cost: e, damageType: n };
}
function Xp(t) {
  const e = Et(t.querySelector(Ua)?.textContent);
  return e ? Wi(e) : null;
}
function rt(t, e) {
  const n = qt(e);
  for (const r of t) {
    const o = r.indexOf(":");
    if (!(o < 0 || qt(r.slice(0, o)) !== n))
      return Et(r.slice(o + 1));
  }
  return null;
}
function Jp(t) {
  const e = rt(t, "Custo") ?? rt(t, "PE");
  return e || (t.map(Et).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function tg(t) {
  const e = P(t, "target");
  if (!e) return null;
  if (e === "area")
    return eg(t) ?? q("op.targetChoices", e) ?? "Área";
  const n = q("op.targetChoices", e) ?? Y(e);
  return [e === "people" || e === "creatures" ? P(t, "targetQtd") : null, n].filter(ve).join(" ");
}
function eg(t) {
  const e = P(t, "area.name"), n = P(t, "area.size"), r = P(t, "area.type"), o = e ? q("op.areaChoices", e) ?? Y(e) : null, a = r ? q("op.areaTypeChoices", r) ?? Y(r) : null;
  return o ? n ? a ? `${o} ${n}m ${vn(a)}` : `${o} ${n}m` : o : null;
}
function ng(t) {
  const e = P(t, "skillResis"), n = P(t, "resistance");
  if (!e || !n) return null;
  const r = q("op.skill", e) ?? Y(e), o = rg(n);
  return [r, o].filter(ve).join(" ");
}
function rg(t) {
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
function og(t, e, n) {
  const r = P(t, e);
  return r ? q(n, r) ?? Y(r) : null;
}
function ag(t) {
  return !!(t.elementLabel || t.cost || t.target || t.duration || t.resistance);
}
function ig(t) {
  const e = t.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return t.circle ? `${e} ${t.circle}` : e;
}
function sg(t) {
  return [
    `${i}__ritual-element-badge`,
    t ? `${i}__ritual-element-badge--${t}` : null
  ].filter(ve).join(" ");
}
function br(t) {
  const e = qt(t);
  return e === "sangue" || e === "blood" || e === "blooddamage" ? "blood" : e === "morte" || e === "death" || e === "deathdamage" ? "death" : e === "conhecimento" || e === "knowledge" || e === "knowledgedamage" ? "knowledge" : e === "energia" || e === "energy" || e === "energydamage" ? "energy" : e === "medo" || e === "fear" || e === "feardamage" ? "fear" : null;
}
function $o(t) {
  const e = br(t);
  return e ? q("op.elementChoices", e) ?? Y(e) : t ? Y(t) : null;
}
function lg(t) {
  return br(t);
}
function q(t, e) {
  if (!e) return null;
  const n = `${t}.${e}`, r = _r()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Ro = "data-paranormal-toolkit-dice-toggle-enhanced";
function cg(t) {
  for (const e of Array.from(t.querySelectorAll(ja)))
    Ki(e);
}
function ug(t) {
  const e = Qi(t.target);
  if (!e) return;
  const n = yr(e);
  n && (t.preventDefault(), Yi(n, e));
}
function dg(t) {
  if (t.key !== "Enter" && t.key !== " ") return;
  const e = Qi(t.target);
  if (!e) return;
  const n = yr(e);
  n && (t.preventDefault(), Yi(n, e));
}
function Ki(t) {
  const e = t.querySelector(Ee);
  if (!e) return;
  const n = t.querySelector(rr);
  if (n && n.getAttribute(Ro) !== "true" && (n.setAttribute(Ro, "true"), n.classList.add(or), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), e.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Yi(t, e) {
  const n = t.querySelector(Ee);
  if (!n) return;
  const r = !t.classList.contains(nr);
  mg(t, e, n, r);
}
function mg(t, e, n, r) {
  t.classList.toggle(nr, r), n.hidden = !r, e.setAttribute("aria-expanded", r ? "true" : "false"), e.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", e.setAttribute("aria-label", e.title);
  const o = e.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Qi(t) {
  if (!(t instanceof Element)) return null;
  const e = t.closest(rr);
  if (!e) return null;
  const n = yr(e);
  return n ? (Ki(n), e.classList.contains(or) ? e : null) : null;
}
function yr(t) {
  const e = t.closest(ja);
  return e && e.querySelector(Ee) ? e : null;
}
const wo = `${u}-workflow-dice-toggle-styles`;
function fg() {
  if (document.getElementById(wo)) return;
  const t = document.createElement("style");
  t.id = wo, t.textContent = `
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
const pg = [0, 100, 500, 1500, 3e3];
let ko = !1, We = null;
function gg() {
  if (!ko) {
    ko = !0, fg(), Hooks.on("renderChatMessageHTML", (t, e) => {
      Ot(To(e));
    }), Hooks.on("renderChatMessage", (t, e) => {
      Ot(To(e));
    }), Hooks.once("ready", () => {
      Ot(document), hg();
    }), document.addEventListener("click", ug), document.addEventListener("keydown", dg);
    for (const t of pg)
      globalThis.setTimeout(() => Ot(document), t);
  }
}
function hg() {
  We || !document.body || (We = new MutationObserver((t) => {
    for (const e of t)
      for (const n of Array.from(e.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Ot(n);
  }), We.observe(document.body, { childList: !0, subtree: !0 }));
}
function Ot(t) {
  t && (cu(t), Mp(t), wp(t), cg(t), eu(t));
}
function _g() {
  gg();
}
const bg = "data-paranormal-toolkit-action-section", yg = "ritual-log", Ag = ".paranormal-toolkit-item-use-prompt__actions", Tg = ".paranormal-toolkit-item-use-prompt__actions-title", $g = [0, 100, 500, 1500];
let Eo = !1;
function Rg() {
  if (Eo) return;
  const t = (e, n) => {
    Io(Ig(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Io(document), Eo = !0;
}
function Io(t) {
  for (const e of $g)
    globalThis.setTimeout(() => wg(t), e);
}
function wg(t) {
  kg(t), Eg(t);
}
function kg(t) {
  for (const e of t.querySelectorAll(
    `[${bg}="${yg}"]`
  ))
    e.remove();
}
function Eg(t) {
  for (const e of t.querySelectorAll(Ag)) {
    if (Co(e.querySelector(Tg)?.textContent ?? "") !== "registro") continue;
    Array.from(
      e.querySelectorAll("button"),
      (a) => Co(a.textContent ?? "")
    ).some((a) => a.includes("ritual conjurado")) && e.remove();
  }
}
function Ig(t) {
  if (t instanceof HTMLElement || Cg(t))
    return t;
  if (Sg(t)) {
    const e = t[0];
    return e instanceof HTMLElement ? e : null;
  }
  return null;
}
function Cg(t) {
  return t instanceof HTMLElement;
}
function Sg(t) {
  return typeof t == "object" && t !== null && 0 in t;
}
function Co(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Mt = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Zi = {
  PV: "system.attributes.hp"
}, Nn = {
  PV: [Mt.PV, Zi.PV],
  SAN: [Mt.SAN],
  PE: [Mt.PE],
  PD: [Mt.PD]
}, xn = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Lg {
  getResource(e, n) {
    const r = So(e, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, s = `${o}.max`, l = foundry.utils.getProperty(e, a), c = foundry.utils.getProperty(e, s), d = Do(e, n, a, l, "valor atual");
    if (d) return p(d);
    const f = Do(e, n, s, c, "valor máximo");
    return f ? p(f) : _({
      value: l,
      max: c
    });
  }
  async updateResourceValue(e, n, r) {
    const o = So(e, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await e.update({ [`${o.value}.value`]: r });
  }
}
function So(t, e) {
  const n = Dg(t.type, e);
  if (n && Lo(t, n))
    return _(n);
  const r = Nn[e].find(
    (o) => Lo(t, o)
  );
  return r ? _(r) : p({
    actor: t,
    actorId: t.id ?? null,
    actorName: t.name ?? "Ator sem nome",
    actorType: t.type ?? "unknown",
    resource: e,
    reason: "resource-path-not-found",
    message: Pg(t, e),
    path: Nn[e].join(" | ")
  });
}
function Dg(t, e) {
  return t === "threat" ? Zi[e] ?? null : t === "agent" ? Mt[e] : null;
}
function Lo(t, e) {
  const n = foundry.utils.getProperty(t, `${e}.value`), r = foundry.utils.getProperty(t, `${e}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Pg(t, e) {
  const n = t.type ?? "unknown", r = Nn[e].join(", ");
  return `${e} não encontrado no ator ${t.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Do(t, e, n, r, o) {
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
class vg {
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
      const s = xn.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: e,
        paths: [...s]
      });
    }
    const { path: r, value: o } = n, a = Ng(o);
    return a ? _(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: e,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(e) {
    for (const n of xn.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(e, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function Ng(t) {
  if (Po(t))
    return t;
  if (typeof t == "string") {
    const e = t.trim();
    if (!/^\d+$/.test(e))
      return null;
    const n = Number(e);
    if (Po(n))
      return n;
  }
  return null;
}
function Po(t) {
  return t === 1 || t === 2 || t === 3 || t === 4;
}
const xg = "dice-so-nice";
async function Xi(t) {
  if (!Og() || !Mg()) return;
  const e = Fg();
  if (e?.showForRoll)
    try {
      await Promise.resolve(e.showForRoll(t, game.user, !0));
    } catch (n) {
      m.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Og() {
  try {
    return Oc().enabled;
  } catch {
    return !1;
  }
}
function Mg() {
  return game.modules?.get?.(xg)?.active === !0;
}
function Fg() {
  const e = game.dice3d;
  return !e || typeof e != "object" ? null : e;
}
const vo = "occultism";
class Ji {
  getDifficulty(e) {
    return Bg(e);
  }
  async rollCastingCheck(e) {
    const n = this.getDifficulty(e);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await qg(e, vo);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await Xi(r);
    const o = Gg(r);
    return {
      skill: vo,
      skillLabel: "Ocultismo",
      roll: r,
      formula: jg(r),
      total: o,
      difficulty: n,
      success: o >= n,
      diceBreakdown: Vg(r)
    };
  }
}
function Bg(t) {
  const e = t.system?.ritual?.DT;
  return typeof e == "number" && Number.isFinite(e) ? Math.trunc(e) : null;
}
async function Ug(t) {
  return new Ji().rollCastingCheck(t);
}
async function qg(t, e) {
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
  return zg(r);
}
function zg(t) {
  return No(t) ? t : Array.isArray(t) ? t.find(No) ?? null : null;
}
function No(t) {
  return !!(t && typeof t == "object" && "evaluate" in t && "total" in t);
}
function jg(t) {
  const e = t.formula;
  return typeof e == "string" && e.trim().length > 0 ? e : "rolagem";
}
function Gg(t) {
  const e = t.total;
  return typeof e == "number" && Number.isFinite(e) ? Math.trunc(e) : 0;
}
function Vg(t) {
  const e = t.dice;
  if (!Array.isArray(e)) return null;
  const n = e.find(Hg);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Hg(t) {
  return !!(t && typeof t == "object" && t.faces === 20);
}
const Wg = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Kg {
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
    const r = n.value, o = Yg(e.ritual, r);
    return o.ok ? o.value ? _(o.value) : _({
      resource: "PE",
      amount: Wg[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function Yg(t, e) {
  const n = t.getFlag(u, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Qg(n) ? {
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
function Qg(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return (e.resource === "PE" || e.resource === "PD") && typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0;
}
const Ke = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Zg(t) {
  if (!rh(t.item)) return null;
  const e = On(t.actor) ? t.actor : Xg(t.item);
  return {
    source: "ordem-item-used-hook",
    actor: e,
    item: t.item,
    token: th(t.token) ?? Jg(e),
    targets: Jn(),
    message: t.message,
    chatMessageData: t.chatMessageData
  };
}
function Xg(t) {
  const e = t;
  return On(e.actor) ? e.actor : On(t.parent) ? t.parent : null;
}
function Jg(t) {
  const e = eh(t) ?? nh(t);
  return e ? ts(e) : null;
}
function th(t) {
  return Mn(t) ? ts(t) : null;
}
function eh(t) {
  if (!t) return null;
  const e = t, n = e.token;
  return Mn(n) ? n : (e.getActiveTokens?.() ?? []).find(Mn) ?? null;
}
function nh(t) {
  return t ? canvas?.tokens?.controlled?.find((e) => e.actor?.id === t.id) ?? null : null;
}
function ts(t) {
  const e = t.actor ?? null;
  return {
    tokenId: Ye(t.id),
    actorId: Ye(e?.id),
    sceneId: Ye(t.scene?.id),
    name: t.name ?? e?.name ?? "Origem sem nome"
  };
}
function rh(t) {
  return !!(t && typeof t == "object" && "getFlag" in t && "setFlag" in t);
}
function On(t) {
  return !!(t && typeof t == "object" && "update" in t && "items" in t);
}
function Mn(t) {
  return !!(t && typeof t == "object" && ("actor" in t || "id" in t || "name" in t));
}
function Ye(t) {
  return typeof t == "string" && t.length > 0 ? t : null;
}
class oh {
  constructor(e) {
    this.onItemUsed = e;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Ke.ITEM_USED, (e) => {
      this.handleHook(e);
    }), this.registered = !0, m.info(`${Ke.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(e) {
    const n = Zg(ah(e));
    if (!n) {
      m.warn(`${Ke.ITEM_USED} disparou sem payload de item válido.`, e);
      return;
    }
    await this.onItemUsed(n);
  }
}
function ah(t) {
  return t && typeof t == "object" ? t : {};
}
class ih {
  async applyPresetItemPatch(e, n) {
    const r = n.itemPatch;
    if (!r) return Qe("missing-item-patch");
    if (e.type !== "ritual") return Qe("unsupported-item-type");
    const o = sh(r);
    return Object.keys(o).length === 0 ? Qe("empty-update") : (await e.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function sh(t) {
  const e = {};
  w(e, "name", t.name), w(e, "system.description", t.descriptionHtml);
  const n = t.ritual;
  return n && (w(e, "system.circle", n.circle), w(e, "system.element", n.element), w(e, "system.target", n.target), w(e, "system.targetQtd", n.targetQuantity), w(e, "system.execution", n.execution), w(e, "system.range", n.range), w(e, "system.duration", n.duration), w(e, "system.skillResis", n.resistanceSkill), w(e, "system.resistance", n.resistance), w(e, "system.studentForm", n.studentForm), w(e, "system.trueForm", n.trueForm)), e;
}
function w(t, e, n) {
  n !== void 0 && (t[e] = n);
}
function Qe(t) {
  return {
    applied: !1,
    reason: t,
    updateData: {}
  };
}
class lh {
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
    return this.getNumber(e, xn.ritual.dt, 0);
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
class ch {
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
class uh {
  presets = /* @__PURE__ */ new Map();
  register(e) {
    const n = dh(e);
    return n.ok ? this.presets.has(e.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${e.id}.`,
      presetId: e.id
    }) : (this.presets.set(e.id, Ze(e)), _(e)) : n;
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
    return n ? Ze(n) : null;
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
    return Array.from(this.presets.values()).map(Ze);
  }
  findForItem(e) {
    return this.list().map((n) => mh(n, e)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function dh(t) {
  return !Xe(t.id) || !Xe(t.version) || !Xe(t.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: t.id
  }) : !t.automation || t.automation.version !== 1 || !Array.isArray(t.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${t.id} possui definição de automação inválida.`,
    presetId: t.id
  }) : _(t);
}
function mh(t, e) {
  if (t.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (t.itemTypes.length > 0) {
    if (!t.itemTypes.includes(e.type)) return null;
    r += 10, n.push(`itemType:${e.type}`);
  }
  for (const o of t.matchers) {
    const a = fh(o, e);
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
function fh(t, e) {
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
      const n = xo(e.name), r = t.names.map(xo).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = ph(e), r = n !== null && t.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function xo(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function ph(t) {
  const e = foundry.utils.getProperty(t, "system.circle"), n = typeof e == "string" ? Number(e) : e;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function Ze(t) {
  return structuredClone(t);
}
function Xe(t) {
  return typeof t == "string" && t.length > 0;
}
function fe(t, e) {
  if (typeof t.amount == "number")
    return !Number.isInteger(t.amount) || t.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : _(t.amount);
  if (typeof t.amountFrom == "string") {
    const n = Ne(t.amountFrom);
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
function Ne(t) {
  return t ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(t)?.groups?.rollId ?? null : null;
}
async function gh(t, e, n) {
  if (!Oo(t.id) || !Oo(t.formula))
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
    await Xi(o);
    const l = {
      ...n.rollRequests[t.id] ?? es(t, e),
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
function es(t, e) {
  const n = t.intent ?? hh(t.id);
  return {
    id: t.id,
    formula: t.formula,
    intent: n,
    damageType: t.damageType ?? void 0,
    sourceStepIndex: e
  };
}
function hh(t) {
  const e = t.toLowerCase();
  return e.includes("damage") || e.includes("dano") ? "damage" : e.includes("healing") || e.includes("heal") || e.includes("cura") ? "healing" : e.includes("attack") || e.includes("ataque") ? "attack" : e.includes("resistance") || e.includes("resistencia") || e.includes("resistência") ? "resistance" : "generic";
}
function Oo(t) {
  return typeof t == "string" && t.length > 0;
}
async function pe(t, e, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? ne(e, n, r, o) : t.spend(e, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? ne(e, n, r, o) : t.damage(e, n, o);
    case "heal":
      return n !== "PV" ? ne(e, n, r, o) : t.heal(e, n, o);
    case "recover":
      return n !== "SAN" ? ne(e, n, r, o) : t.recover(e, n, o);
  }
}
function ne(t, e, n, r) {
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
function _h(t) {
  const { step: e, context: n, transaction: r, stepIndex: o, lifecycle: a } = t;
  if (e.operation === "damage") {
    const s = bh(e, n, r, o);
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
    const s = yh(e, n, r, o);
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
function bh(t, e, n, r) {
  const o = Ne(t.amountFrom), a = o ? e.rolls[o] : void 0;
  return {
    id: ns(e.id, "damage", r, e.damageInstances.length),
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
function yh(t, e, n, r) {
  const o = Ne(t.amountFrom);
  return {
    id: ns(e.id, "healing", r, e.healingInstances.length),
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
function ns(t, e, n, r) {
  return `${t}.${e}.${n}.${r}`;
}
function Ah(t, e, n) {
  const r = Ne(t.amountFrom), o = r ? e.rolls[r] : void 0;
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
function Th(t) {
  const { step: e, context: n, stepIndex: r, metadata: o, lifecycle: a } = t;
  a.emit("beforeApply", n, { stepIndex: r, step: e, metadata: o }), rs("before", t), Mo("before", t), Mo("resolve", t);
}
function $h(t) {
  const { step: e, context: n, stepIndex: r, metadata: o, lifecycle: a } = t;
  a.emit("apply", n, { stepIndex: r, step: e, metadata: o }), rs("apply", t);
}
function Rh(t) {
  const { step: e, context: n, stepIndex: r, metadata: o, lifecycle: a } = t;
  a.emit("afterApply", n, { stepIndex: r, step: e, metadata: o });
}
function rs(t, e) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = e, l = wh(t, n.operation);
  l && s.emit(l, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Mo(t, e) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = e;
  n.operation === "damage" && s.emit(t === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function wh(t, e) {
  return e === "damage" ? t === "before" ? "beforeApplyDamage" : t === "apply" ? "applyDamage" : "afterApplyDamage" : e === "heal" ? t === "before" ? "beforeApplyHealing" : t === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function kh(t, e, n) {
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
async function Eh(t) {
  const { step: e } = t;
  switch (e.type) {
    case "spendResource":
      return Ih(t, e);
    case "spendRitualCost":
      return Ch(t, e);
  }
}
async function Ih(t, e) {
  const { context: n, resources: r } = t, o = fe(e, n);
  return o.ok ? os(await r.spend(n.sourceActor, e.resource, o.value), n) : p(o.error);
}
async function Ch(t, e) {
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
  }), os(await r.spend(n.sourceActor, s.resource, s.amount), n, e);
}
function os(t, e, n) {
  return t.ok ? (e.resourceTransactions.push(t.value), _(void 0)) : (n?.type === "spendRitualCost" && e.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: t.error.message,
    cause: t.error
  }));
}
async function Sh(t) {
  const { step: e, context: n, stepIndex: r, lifecycle: o, execute: a } = t, s = Lh(e);
  for (const c of s.before)
    o.emit(c, n, { stepIndex: r, step: e });
  const l = await a();
  if (!l.ok)
    return l;
  for (const c of s.after)
    o.emit(c, n, { stepIndex: r, step: e });
  return l;
}
function Lh(t) {
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
class Dh {
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
        return Sh({
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
    const o = await Eh({
      step: e,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? _(void 0) : p({ ...o.error, stepIndex: r, step: e, context: n });
  }
  async runRollFormulaStepWithLifecycle(e, n, r) {
    const o = es(e, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: e, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, e), this.lifecycle.emit("roll", n, { stepIndex: r, step: e, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, e);
    const a = await this.runRollFormulaStep(e, n, r);
    if (!a.ok)
      return a;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, e, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: e, rollRequest: o, rollResult: s }), _(void 0);
  }
  async runRollFormulaStep(e, n, r) {
    const o = await gh(e, r, n);
    return o.ok ? _(void 0) : p({ ...o.error, stepIndex: r, step: e, context: n });
  }
  async runModifyResourceStepWithLifecycle(e, n, r) {
    const o = fe(e, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: e, context: n });
    const a = Ah(e, n, o.value);
    Th({
      step: e,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), $h({
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
      const c = await pe(this.resources, l, e.resource, e.operation, o.value), d = this.handleResourceOperationResult(c, n, r, e);
      if (!d.ok)
        return d;
      _h({
        step: e,
        context: n,
        transaction: d.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Rh({
      step: e,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), _(void 0);
  }
  async runModifyResourceStep(e, n, r) {
    const o = fe(e, n);
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
      const l = await pe(this.resources, s, e.resource, e.operation, o.value), c = this.handleResourceOperationResult(l, n, r, e);
      if (!c.ok)
        return c;
    }
    return _(void 0);
  }
  async runChatCardStep(e, n, r) {
    const o = await kh(this.messages, e, n);
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
    const l = Ph(e, n.intent);
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
function Ph(t, e) {
  return e === "damage" ? t === "before" ? "beforeDamageRoll" : t === "roll" ? "damageRoll" : "afterDamageRoll" : e === "healing" ? t === "before" ? "beforeHealingRoll" : t === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class vh {
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
class Nh {
  constructor(e) {
    this.adapter = e;
  }
  adapter;
  async rollCastingCheck(e) {
    return this.adapter.rollCastingCheck(e);
  }
  getDifficulty(e) {
    return this.adapter.getDifficulty?.(e) ?? null;
  }
}
function as(t) {
  return {
    id: xh(),
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
function xh() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Oh {
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
    const r = as(n);
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
class Mh {
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
class Fh {
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
    const n = un();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: e.speaker,
      content: e.content,
      whisper: Bh(),
      flags: {
        ...e.flags,
        [u]: {
          ...Uh(e.flags),
          debugOutput: !0
        }
      }
    }), n.console && e.data !== void 0 && m.info("Debug chat criado.", e.data), !0);
  }
  emit(e, n) {
    const r = un();
    if (!r.enabled)
      return;
    const o = n.notification ?? Fo(n);
    r.console && this.emitConsole(e, n), r.ui && this.emitUi(e, o);
  }
  emitConsole(e, n) {
    const r = Fo(n);
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
function Fo(t) {
  return t.message ? `${t.title}: ${t.message}` : t.title;
}
function Bh() {
  const t = game.users?.filter((e) => e.isGM === !0 && e.id).map((e) => e.id) ?? [];
  return t.length > 0 ? t : game.user?.id ? [game.user.id] : [];
}
function Uh(t) {
  const e = t?.[u];
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const qh = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", is = `${u}-inline-roll-neutralized`, zh = `${u}-inline-roll-notice`, Ar = `data-${u}-inline-roll-neutralized`, Bo = `data-${u}-inline-roll-notice`, jh = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Uo(t) {
  const e = r_(t.message), n = await Gh(t.message), r = Vh(e);
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
async function Gh(t) {
  const e = t_(t);
  if (!e || typeof e.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = Hh(e.content);
  return n.replacementCount === 0 || n.content === e.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await e_(e, n.content), replacementCount: n.replacementCount };
}
function Vh(t) {
  const e = t ? n_(t) : null;
  if (!e)
    return { replacementCount: 0 };
  const n = ss(e);
  return n > 0 && ls(Zh(e)), { replacementCount: n };
}
function Hh(t) {
  const e = Wh(t), n = document.createElement("template");
  n.innerHTML = e.content;
  const r = ss(n.content), o = e.replacementCount + r;
  return o === 0 ? { content: t, replacementCount: 0 } : (ls(n.content), { content: n.innerHTML, replacementCount: o });
}
function Wh(t) {
  let e = 0;
  return { content: t.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (e += 1, Yh(o.trim()))), replacementCount: e };
}
function ss(t) {
  const e = Kh(t);
  for (const n of e)
    n.replaceWith(Qh(Xh(n)));
  return e.length;
}
function Kh(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.querySelectorAll(qh))
    n.getAttribute(Ar) !== "true" && e.add(n);
  return Array.from(e);
}
function Yh(t) {
  return `<span class="${is}" ${Ar}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${o_(t)}</span>`;
}
function Qh(t) {
  const e = document.createElement("span");
  return e.classList.add(is), e.setAttribute(Ar, "true"), e.title = "Rolagem inline ignorada pelo Paranormal Toolkit", e.textContent = t, e;
}
function ls(t) {
  if (t.querySelector?.(`[${Bo}="true"]`)) return;
  const e = document.createElement("p");
  e.classList.add(zh), e.setAttribute(Bo, "true"), e.textContent = jh, t.append(e);
}
function Zh(t) {
  return t.querySelector(".message-content") ?? t;
}
function Xh(t) {
  const n = t.getAttribute("data-formula") ?? Jh(t.getAttribute("data-roll")) ?? t.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Jh(t) {
  if (!t) return null;
  try {
    const e = JSON.parse(t);
    return typeof e.formula == "string" && e.formula.length > 0 ? e.formula : null;
  } catch {
    return null;
  }
}
function t_(t) {
  return t && typeof t == "object" ? t : null;
}
async function e_(t, e) {
  if (typeof t.update != "function")
    return !1;
  try {
    return await Promise.resolve(t.update({ content: e })), !0;
  } catch (n) {
    return m.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function n_(t) {
  const e = a_(t);
  return document.querySelector(
    `.chat-message[data-message-id="${e}"], [data-message-id="${e}"]`
  );
}
function r_(t) {
  if (!t || typeof t != "object") return null;
  const e = t;
  return typeof e.id == "string" && e.id.length > 0 ? e.id : null;
}
function o_(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function a_(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const ge = "ritualRollConfig", yt = "ritual-roll";
function xe() {
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
function cs(t) {
  const e = t.getFlag(u, ge);
  return Fn(e);
}
function us(t) {
  return cs(t) ?? xe();
}
async function i_(t, e) {
  const n = Fn(e) ?? Fn({
    ...xe(),
    ...e
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await t.setFlag(u, ge, n), n;
}
async function s_(t) {
  const e = t.unsetFlag;
  if (typeof e == "function") {
    await Promise.resolve(e.call(t, u, ge));
    return;
  }
  await t.setFlag(u, ge, null);
}
function Fn(t) {
  if (!Oe(t)) return null;
  const e = h_(t.intent);
  if (!e) return null;
  const n = xe();
  return {
    schemaVersion: 1,
    intent: e,
    damageType: he(t.damageType),
    utilityLabel: he(t.utilityLabel) ?? n.utilityLabel,
    note: Tr(t.note),
    forms: __(t.forms)
  };
}
function l_(t) {
  switch (t) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function c_(t) {
  const e = cs(t);
  if (!e) return null;
  const n = e.forms.base.formula.trim();
  if (!n) return null;
  const r = u_(e, n), o = [
    { type: "spendRitualCost" },
    r,
    ...d_(e)
  ];
  return {
    version: 1,
    label: `Fórmula de ${t.name ?? "ritual"}`,
    steps: o,
    ritualForms: f_(t, e),
    resistance: e.intent === "damage" ? p_(t) : void 0
  };
}
function u_(t, e) {
  const n = {
    type: "rollFormula",
    id: yt,
    formula: e,
    intent: g_(t.intent)
  };
  return t.intent === "damage" && t.damageType && (n.damageType = t.damageType), n;
}
function d_(t) {
  switch (t.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${yt}.total`,
          ...m_(t.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${yt}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function m_(t) {
  return t ? { damageType: t } : {};
}
function f_(t, e) {
  const n = e.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [yt]: n
      }
    }
  };
  return qo(t, "discente") && e.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [yt]: e.forms.discente.formula.trim()
    }
  }), qo(t, "verdadeiro") && e.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [yt]: e.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function p_(t) {
  const e = ds(t), n = he(e.skillResis), r = he(e.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = b_(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function g_(t) {
  switch (t) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function h_(t) {
  return t === "damage" || t === "healing" || t === "utility" ? t : null;
}
function __(t) {
  const e = xe();
  return Oe(t) ? {
    base: Je(t.base),
    discente: Je(t.discente),
    verdadeiro: Je(t.verdadeiro)
  } : e.forms;
}
function Je(t) {
  return Oe(t) ? { formula: Tr(t.formula) } : { formula: "" };
}
function qo(t, e) {
  const n = ds(t), r = e === "discente" ? n.studentForm : n.trueForm;
  return y_(r);
}
function ds(t) {
  const e = t.system;
  return Oe(e) ? e : {};
}
function b_(t) {
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
function y_(t) {
  return t === !0 || t === "true" || t === 1 || t === "1";
}
function Tr(t) {
  return typeof t == "string" ? t.trim() : "";
}
function he(t) {
  const e = Tr(t);
  return e.length > 0 ? e : null;
}
function Oe(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function A_(t) {
  switch (T_(t)) {
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
      return $_(String(t ?? ""));
  }
}
function T_(t) {
  if (t == null) return null;
  const e = String(t).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return e.length > 0 ? e : null;
}
function $_(t) {
  const e = t.trim();
  return e ? `${e.charAt(0).toLocaleUpperCase()}${e.slice(1)}` : "Sem tipo";
}
function R_(t) {
  return {
    header: {
      eyebrow: Kn,
      title: t.ritual.name ?? "Ritual sem nome",
      subtitle: C_(t.ritual)
    },
    forms: t.variantOptions.map((e) => w_(e, t.cost)),
    cost: {
      spendResourceChecked: t.defaultSpendResource,
      baseCostText: t.cost ? `${t.cost.amount} ${t.cost.resource}` : "não resolvido",
      casterName: t.actor.name ?? "Ator sem nome",
      targetText: t.targetNames.length > 0 ? t.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: I_(t.automationStatus ?? "assisted")
  };
}
function w_(t, e) {
  const n = k_(t);
  return {
    variant: t.variant,
    label: t.label,
    enabled: t.enabled,
    checked: t.variant === "base",
    costText: t.enabled ? t.finalCostText ?? E_(e) : "—",
    details: n
  };
}
function k_(t) {
  return t.enabled ? t.details.map((e) => e.trim()).filter((e) => e.length > 0).filter((e) => !e.toLocaleLowerCase().startsWith("custo final")) : [t.unavailableReason ?? "não disponível neste ritual"];
}
function E_(t) {
  return t ? `${t.amount} ${t.resource}` : "custo não resolvido";
}
function I_(t) {
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
function C_(t) {
  const e = t.system, n = [L_(e?.element), S_(e?.circle)].filter(v_);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function S_(t) {
  const e = typeof t == "string" ? Number(t) : t;
  return typeof e != "number" || !Number.isFinite(e) ? null : `${e}º Círculo`;
}
function L_(t) {
  if (typeof t != "string" || t.trim().length === 0) return null;
  switch (D_(t)) {
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
      return P_(t);
  }
}
function D_(t) {
  return t.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function P_(t) {
  const e = t.trim();
  return e ? `${e.charAt(0).toLocaleUpperCase()}${e.slice(1)}` : null;
}
function v_(t) {
  return typeof t == "string" && t.length > 0;
}
const ms = ["base", "discente", "verdadeiro"];
function fs(t) {
  switch (t) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function _e(t) {
  return typeof t == "string" && ms.includes(t);
}
const { ApplicationV2: N_ } = foundry.applications.api;
class Ft extends N_ {
  constructor(e, n) {
    super({
      id: `${u}-ritual-cast-${e.actor.id ?? foundry.utils.randomID()}-${e.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${e.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = R_(e), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: Ft.onCast,
      cancel: Ft.onCancel
    }
  };
  static async request(e) {
    return new Promise((n) => {
      new Ft(e, n).render({ force: !0 });
    });
  }
  async _renderHTML(e, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(e, n, r) {
    n.replaceChildren(e);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    O_(o, (a) => {
      this.selectedVariant = a;
    }), M_(o, (a) => {
      this.spendResource = a;
    });
  }
  async close(e) {
    return this.settle(null), super.close(e);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${k(this.model.header.eyebrow)}</p>
        <div>
          <h2>${k(this.model.header.title)}</h2>
          <p>${k(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(x_).join("")}
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
          <div><dt>Custo base</dt><dd>${k(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${k(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${k(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${k(this.model.automation.title)}</strong></p>
        <p>${k(this.model.automation.description)}</p>
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
    const n = U_(e), r = F_(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(e) {
    e.preventDefault(), this.settle(null), await this.close();
  }
  settle(e) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(e));
  }
}
function x_(t) {
  const e = t.checked ? "checked" : "", n = t.enabled ? "" : "disabled", r = t.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = t.details.map((a) => `<span>${k(a)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${k(t.variant)}"
      role="radio"
      aria-checked="${t.checked ? "true" : "false"}"
      aria-disabled="${t.enabled ? "false" : "true"}"
      tabindex="${t.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${k(t.variant)}" ${e} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${k(t.label)}</strong>
        <em>${k(t.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function O_(t, e) {
  const n = Array.from(t.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => zo(t, o, e)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), zo(t, o, e));
    });
  const r = ps(t);
  r && e(r);
}
function zo(t, e, n) {
  const r = e.querySelector('input[name="variant"]');
  !r || r.disabled || !_e(r.value) || (r.checked = !0, t.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), ps(t));
}
function ps(t) {
  const e = t.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of e) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && _e(o.value) && (n = o.value);
  }
  return n && (t.dataset.paranormalToolkitSelectedVariant = n), n;
}
function M_(t, e) {
  const n = t.querySelector('input[name="spendResource"]');
  n && (e(n.checked), n.addEventListener("change", () => {
    e(n.checked);
  }));
}
function F_(t, e, n) {
  const r = B_(t) ?? n, o = t?.querySelector('input[name="spendResource"]')?.checked ?? e;
  return {
    variant: r,
    spendResource: o
  };
}
function B_(t) {
  const e = t?.querySelector('input[name="variant"]:checked')?.value;
  if (_e(e)) return e;
  const n = t?.dataset.paranormalToolkitSelectedVariant;
  return _e(n) ? n : null;
}
function U_(t) {
  for (const e of [t.currentTarget, t.target, ...t.composedPath()]) {
    if (!(e instanceof HTMLElement)) continue;
    const n = e.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function k(t) {
  const e = document.createElement("div");
  return e.textContent = t, e.innerHTML;
}
async function q_(t) {
  return Ft.request(t);
}
const $r = {
  label: "Padrão"
}, z_ = {
  label: "Discente",
  extraCost: 2
}, j_ = {
  label: "Verdadeiro",
  extraCost: 5
};
class G_ {
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
    const r = this.resolveCostPreview(e), o = Nb(n), a = Db(
      n,
      e.item,
      r,
      o
    ), s = await q_({
      actor: e.actor,
      ritual: e.item,
      targetNames: e.targets.map((I) => I.name),
      cost: r,
      defaultSpendResource: Ub(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = V_(s), c = Ob(
      n,
      e.item,
      l.variant,
      o
    ), d = Na();
    let f = null;
    if (d) {
      const I = await W_(
        this.resources,
        e.actor,
        l,
        c,
        r
      );
      if (!I.ok)
        return {
          status: "failed",
          reason: I.reason,
          message: I.message
        };
      try {
        f = await Ug(
          e.actor
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
    const y = H_(
      n,
      l,
      c,
      r,
      {
        includeCostSteps: !d
      }
    );
    if (y.steps.length === 0) {
      const I = xb(
        e,
        l
      ), x = jo(
        e.actor,
        f,
        c,
        r
      ), ut = Go(
        n,
        l,
        c,
        r,
        I,
        e,
        f
      );
      return x.length > 0 ? {
        status: "ready",
        workflowContext: I,
        actions: x,
        summaryLines: ut
      } : {
        status: "completed-without-actions",
        workflowContext: I,
        summaryLines: ut
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
    const $ = T.value.context, g = tb(
      n,
      e,
      $
    ), G = Y_(
      n,
      e
    ), Lt = jo(
      e.actor,
      f,
      c,
      r
    ), Dt = Go(
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
    if (!G.ok)
      return {
        status: "failed",
        reason: G.reason,
        message: G.message
      };
    const ct = [
      ...Lt,
      ...g.actions,
      ...G.actions
    ];
    return ct.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: $,
      summaryLines: Dt
    } : {
      status: "ready",
      workflowContext: $,
      actions: ct,
      summaryLines: Dt
    };
  }
  async applyAction(e) {
    return pe(
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
function V_(t) {
  return {
    variant: t.variant,
    spendResource: t.spendResource === !0
  };
}
function H_(t, e, n, r, o) {
  const a = [], s = e.spendResource === !0;
  for (const l of t.steps)
    l.type === "modifyResource" || l.type === "chatCard" || wr(l) && (!o.includeCostSteps || !s) || a.push(K_(l, n));
  return o.includeCostSteps && s && r && qb(n.extraCost) && a.push({
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
async function W_(t, e, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Ht(o, r);
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
function K_(t, e) {
  if (t.type !== "rollFormula") return t;
  const n = e.rollFormulaOverrides?.[t.id];
  return n ? {
    ...t,
    formula: n
  } : t;
}
function jo(t, e, n, r) {
  if (!e || e.success) return [];
  const o = Ht(r, n);
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
function Y_(t, e) {
  const n = [];
  for (const r of t.conditionApplications ?? []) {
    const o = Rr(r.actor, e);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const a of o) {
      const s = ai(a);
      n.push(
        Q_(
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
function Q_(t, e, n, r) {
  const o = e.name ?? "Ator sem nome", a = t.label ?? J_(t.conditionId);
  return {
    kind: "condition-application",
    actor: e,
    actorName: o,
    conditionId: t.conditionId,
    conditionLabel: a,
    duration: Z_(
      t.duration ?? null,
      r
    ),
    source: t.source ?? null,
    originUuid: n.uuid ?? null,
    label: X_(a, t.duration),
    executedLabel: t.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: t.actionSectionId ?? "apply-effects",
    actionSectionTitle: t.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Z_(t, e) {
  return t ? {
    ...t,
    expiry: t.expiry ?? "turnStart",
    anchor: e
  } : null;
}
function X_(t, e) {
  const n = e?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${t}: ${r}`;
  }
  return t;
}
function J_(t) {
  const e = t.trim();
  return e.length === 0 ? "Condição" : e.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function tb(t, e, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of t.steps) {
    if (a.type !== "modifyResource") continue;
    const s = fe(a, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = Rr(a.actor, e);
    if (l.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const c of l) {
      if (eb(a)) {
        nb(
          o,
          c,
          rb(a, n, s.value)
        );
        continue;
      }
      r.push(ab(a, c, s.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...ob(
        t,
        e.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function eb(t) {
  return t.operation === "damage" && t.resource === "PV";
}
function nb(t, e, n) {
  const r = cb(e), o = t.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  t.set(r, {
    actor: e,
    entries: [n]
  });
}
function rb(t, e, n) {
  const r = ub(t.amountFrom), o = r ? e.rolls[r]?.damageType : void 0;
  return {
    step: t,
    amount: n,
    damageType: t.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function ob(t, e, n, r) {
  const o = pb(t), a = o.length > 1 ? _b() : void 0;
  return o.map((s) => {
    const l = r.map(
      (d, f) => {
        const y = gb(d.amount, s);
        return {
          id: ib(d, s, f),
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
      label: sb(c, s, o.length > 1),
      executedLabel: lb(
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
function ab(t, e, n) {
  const r = e.name ?? "Ator sem nome", o = fb(t);
  return {
    kind: "resource-operation",
    actor: e,
    actorName: r,
    resource: t.resource,
    operation: t.operation,
    amount: n,
    label: db(t, r, n),
    executedLabel: mb(t, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function ib(t, e, n) {
  return `${t.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${e.id}`;
}
function sb(t, e, n) {
  return n ? `${e.id === "normal" ? "Normal" : e.label}: ${t} PV` : `Dano: ${t} PV`;
}
function lb(t, e, n) {
  return n ? `✓ ${e.id === "normal" ? "dano normal" : e.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}`;
}
function cb(t) {
  return t.uuid ?? t.id ?? t.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function ub(t) {
  const e = t?.trim();
  if (!e) return null;
  if (e.endsWith(".total"))
    return e.slice(0, -6);
  const [n] = e.split(".");
  return n && n.length > 0 ? n : null;
}
function db(t, e, n) {
  return t.operation === "heal" && t.resource === "PV" ? `Curar ${n} PV` : t.operation === "damage" ? `Dano: ${n} ${t.resource}` : t.operation === "recover" ? `Recuperar ${n} ${t.resource}` : t.operation === "spend" ? `Gastar ${n} ${t.resource}` : `Aplicar ${n} ${t.resource}`;
}
function mb(t, e) {
  return t.operation === "heal" && t.resource === "PV" ? `✓ ${e} curado` : t.operation === "damage" ? `✓ Dano aplicado em ${e}` : t.operation === "recover" ? `✓ ${e} recuperado` : t.operation === "spend" ? `✓ Recurso gasto de ${e}` : "✓ Ação aplicada";
}
function fb(t) {
  return t.operation === "damage" && t.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : t.operation === "heal" && t.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : t.operation === "recover" || t.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function pb(t) {
  const e = t.resistance?.damageApplications;
  return e && e.length > 0 ? e : t.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function gb(t, e) {
  const n = t * e.multiplier, r = hb(
    n,
    e.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function hb(t, e) {
  switch (e) {
    case "ceil":
      return Math.ceil(t);
    case "round":
      return Math.round(t);
    case "floor":
      return Math.floor(t);
  }
}
function _b() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Rr(t, e) {
  switch (t) {
    case "self":
      return e.actor ? [e.actor] : [];
    case "target":
      return e.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Go(t, e, n, r, o, a, s = null) {
  return [
    `Forma: ${fs(e.variant)}`,
    Tb(e, n, r),
    ...Ab(s),
    ...Object.values(o.rolls).flatMap($b),
    ...bb(t, a),
    ...Rb(t.resistance),
    ...Sb(n)
  ];
}
function bb(t, e) {
  return yb(t) ? Rr("target", e).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function yb(t) {
  return t.steps.some(
    (e) => e.type === "modifyResource" && e.actor === "target"
  ) || (t.conditionApplications ?? []).some(
    (e) => e.actor === "target"
  );
}
function Ab(t) {
  return t ? [
    `Conjuração: ${t.skillLabel} = ${Math.trunc(t.total)}`,
    `Conjuração Fórmula: ${t.formula}`,
    `Conjuração DT: ${t.difficulty}`,
    `Conjuração Resultado: ${t.success ? "Sucesso" : "Falha"}`,
    ...t.diceBreakdown ? [`Dados (Conjuração): ${t.diceBreakdown}`] : []
  ] : [];
}
function Tb(t, e, n) {
  const r = Ht(n, e);
  return r ? t.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : t.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function $b(t) {
  const n = [`${Lb(t)}: ${t.formula} = ${Math.trunc(t.total)}`], r = wb(t.roll);
  return r && n.push(`Dados: ${r}`), t.damageType && n.push(`Tipo: ${A_(t.damageType)}`), n;
}
function Rb(t) {
  return t ? [
    `Resistência: ${t.summary}`,
    `Resistência Perícia: ${t.skill}`,
    `Resistência Rótulo: ${t.label}`
  ] : [];
}
function wb(t) {
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
    const s = kb(a);
    s && (Cb(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function kb(t) {
  const e = Eb(t);
  return e.length > 0 ? { value: `(${e.join(", ")})` } : Ib(t);
}
function Eb(t) {
  return Array.isArray(t.results) ? t.results.flatMap((e) => {
    if (!e || typeof e != "object") return [];
    const n = e;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Ib(t) {
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
function Cb(t, e, n) {
  if (t.length === 0) {
    t.push(e === "-" ? `- ${n}` : n);
    return;
  }
  t.push(`${e} ${n}`);
}
function Sb(t) {
  return (t.notes ?? []).map((e) => `Observação: ${e}`);
}
function Lb(t) {
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
function Db(t, e, n, r) {
  return ms.map((o) => {
    const a = gs(
      t,
      e,
      o,
      r
    ), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? fs(o),
      enabled: s,
      details: a ? Pb(a, n, r) : [],
      finalCostText: a ? vb(n, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function Pb(t, e, n) {
  const r = [], o = Object.values(t.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = Ht(e, t);
  return r.push(
    a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"
  ), r;
}
function Ht(t, e) {
  return t ? {
    resource: t.resource,
    amount: t.amount + (e.extraCost ?? 0)
  } : null;
}
function vb(t, e) {
  const n = Ht(t, e);
  return n ? `${n.amount} ${n.resource}` : null;
}
function Nb(t) {
  return !t.resistance && t.steps.length > 0 && t.steps.every(wr);
}
function xb(t, e) {
  return as({
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
function Ob(t, e, n, r) {
  return gs(t, e, n, r) ?? $r;
}
function gs(t, e, n, r) {
  const o = t.ritualForms?.[n] ?? null;
  return o || (r ? Fb(e, n) ? Mb(n) : null : n === "base" ? $r : null);
}
function Mb(t) {
  switch (t) {
    case "base":
      return $r;
    case "discente":
      return z_;
    case "verdadeiro":
      return j_;
  }
}
function Fb(t, e) {
  if (e === "base") return !0;
  const n = e === "discente" ? "system.studentForm" : "system.trueForm";
  return Bb(foundry.utils.getProperty(t, n));
}
function Bb(t) {
  return t === !0 || t === "true" || t === 1 || t === "1";
}
function Ub(t) {
  return t.steps.some(wr);
}
function wr(t) {
  return t.type === "spendResource" || t.type === "spendRitualCost";
}
function qb(t) {
  return typeof t == "number" && Number.isFinite(t) && t > 0;
}
const hs = "itemUsePrompts", _s = "chatCard", Me = "data-paranormal-toolkit-prompt-id", Fe = "data-paranormal-toolkit-pending-id", kr = "data-paranormal-toolkit-executed-label", Bn = "data-paranormal-toolkit-choice-group", bs = "data-paranormal-toolkit-skipped-label", Vo = "data-paranormal-toolkit-action-section", Ho = "data-paranormal-toolkit-detail-key", Wo = "data-paranormal-toolkit-roll-card", Er = "data-paranormal-toolkit-roll-detail-toggle", ys = "data-paranormal-toolkit-roll-detail-id", As = "data-paranormal-toolkit-resistance-roll-button", Ts = "data-paranormal-toolkit-resistance-skill", $s = "data-paranormal-toolkit-resistance-skill-label", Rs = "data-paranormal-toolkit-resistance-target-actor-id", ws = "data-paranormal-toolkit-resistance-target-name", ks = "data-paranormal-toolkit-resistance-roll-result", Ko = "data-paranormal-toolkit-system-card-replaced", zb = `[${Fe}]`, jb = `[${Er}]`, Gb = `[${As}]`, Un = `${u}-chat-enrichment`, h = `${u}-item-use-prompt`, Vb = `${h}__actions`, Yo = `${h}__details`, Es = `${h}__summary`, Hb = `${h}__title`, Is = `${h}__button--executed`, Qo = `${h}__roll-card`;
let Zo = !1, qn = null;
const N = /* @__PURE__ */ new Map(), Wb = [0, 100, 500, 1500, 3e3], Kb = 3e4, Yb = [0, 100, 500, 1500, 3e3];
function Qb(t) {
  if (qn = t, Zo) {
    Jo(t);
    return;
  }
  const e = (n, r) => {
    Ss(n, r, t);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), Zo = !0, Jo(t);
}
async function Xo(t) {
  const e = Cs(t);
  N.set(t.pendingId, e), await Sr(e) || Bs(e), Ls(t.pendingId);
}
async function Zb(t) {
  const e = Cs({
    ...t,
    actionPayload: null
  });
  e.executed = !0, e.executedLabel = t.executedLabel ?? "✓ Ritual conjurado", N.set(t.pendingId, e), await Sr(e) || Bs(e), Ls(t.pendingId);
}
async function tn(t, e) {
  const n = N.get(t);
  N.delete(t), n && await Qy(n, e);
}
function Ir(t) {
  const e = Vs();
  for (const n of e) {
    const r = j(n)[t];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Xb(t, e) {
  const n = Ir(t);
  if (!n) return;
  const r = j(n.message), o = r[t];
  o && (r[t] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await It(n.message, r));
}
async function Jb(t, e, n) {
  if (!e) return;
  const r = Ir(t);
  if (!r) return;
  const o = j(r.message);
  let a = !1;
  for (const [s, l] of Object.entries(o))
    s !== t && l.choiceGroupId === e && (o[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await It(r.message, o);
}
function Cs(t) {
  const e = Z(t.context.message), n = t.context.targets.find((s) => Vn(s)), r = n ? Vn(n) : null, o = t.resistanceTargetActor ?? r, a = t.resistanceTargetName ?? n?.name ?? o?.name ?? t.context.targets[0]?.name ?? null;
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
    summary: ky(t.context),
    executed: !1
  };
}
function Ss(t, e, n) {
  Yy();
  const r = Ue(e);
  if (!r) return;
  const o = Hy(t, r);
  o.length > 0 && be(r);
  for (const a of o)
    zn(r, a);
  vs(r, n), jn(r), Gn(r);
}
function Jo(t) {
  for (const e of Yb)
    globalThis.setTimeout(() => {
      ty(t);
    }, e);
}
function ty(t) {
  for (const e of ey()) {
    const n = Be(e);
    ny(n) && Ss(n, e, t);
  }
}
function ey() {
  const t = /* @__PURE__ */ new Set();
  for (const e of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = e.classList.contains("chat-message") ? e : e.closest(".chat-message") ?? e;
    n.dataset.messageId && t.add(n);
  }
  return Array.from(t);
}
function ny(t) {
  return t ? Lr(t) ? !0 : Xy(t).length > 0 : !1;
}
function Ls(t) {
  const e = N.get(t);
  if (!e) return;
  const n = e.messageId ? Wy(e.messageId) : null;
  if (n) {
    oa(n, e), be(n), zn(n, e), ta(n), jn(n), Gn(n);
    return;
  }
  if (e.messageId) {
    Wn(e);
    return;
  }
  const r = Ky(e);
  if (r) {
    oa(r, e), be(r), zn(r, e), ta(r), jn(r), Gn(r);
    return;
  }
  Wn(e);
}
function ta(t) {
  qn && vs(t, qn);
}
function be(t) {
  const e = ry();
  t.classList.toggle(`${h}--system-card-replaced`, e);
  const n = Ps(t);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, e), !e) || n.getAttribute(Ko) === "true") return;
  const r = n.querySelector(`.${Un}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Ko, "true");
}
function ry() {
  try {
    return nc() === "replace";
  } catch {
    return !1;
  }
}
function zn(t, e) {
  if (be(t), t.querySelector(`[${Me}="${Ct(e.pendingId)}"]`)) return;
  const n = oy(t, e);
  iy(n, e), Ay(n, Ty(e)).append(wy(e));
}
function oy(t, e) {
  const n = t.querySelector(`.${Un}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Un, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Hb), s.textContent = ay(e);
  const l = document.createElement("span");
  return l.classList.add(Es), l.textContent = e.summary, o.append(a, s, l), r.append(o), Iy(t).append(r), r;
}
function ay(t) {
  const e = E(t.summaryLines ?? [], "Forma"), n = t.itemName ?? t.title ?? "Automação assistida";
  return e ? `${n} • ${e}` : n;
}
function iy(t, e) {
  const n = e.summaryLines ?? [], r = Ms(n, e);
  if (r) {
    sy(t, r, e);
    return;
  }
  $y(t, n);
}
function sy(t, e, n) {
  if (t.querySelector(`[${Wo}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Qo, `${Qo}--${e.intent}`), r.setAttribute(Wo, "true"), e.castingCheck && ea(r, cy(e.castingCheck), n.pendingId, "casting"), ly(e) && ea(r, uy(e), n.pendingId, "effect"), gy(r, e), hy(r, e, n), yy(r, e), t.append(r);
}
function ly(t) {
  return t.intent !== "casting";
}
function cy(t) {
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
function uy(t) {
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
function ea(t, e, n, r) {
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
  dy(o, e), by(o, e.detailRows, n, r, `▸ Detalhes de ${e.title.toLowerCase()}`), t.append(o);
}
function dy(t, e) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = e.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(e.total), n.append(r, o);
  const a = my(e.formula, e.diceBreakdown);
  a && n.append(a), t.append(n);
}
function my(t, e) {
  const n = fy(e);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of py(n, t)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function fy(t) {
  return t ? (/\(([^)]+)\)/u.exec(t)?.[1] ?? t).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function py(t, e) {
  if (t.length <= 1) return t.map((r) => ({ value: r, active: !0 }));
  const n = e.toLowerCase();
  return n.includes("kh") ? na(t, "highest") : n.includes("kl") ? na(t, "lowest") : t.map((r) => ({ value: r, active: !0 }));
}
function na(t, e) {
  const n = e === "highest" ? Math.max(...t) : Math.min(...t);
  let r = !1;
  return t.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function gy(t, e) {
  const n = [
    e.form ? `Forma: ${e.form}` : null,
    e.cost,
    e.damageType ? `Tipo: ${e.damageType}` : null
  ].filter(hA);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  t.append(r);
}
function hy(t, e, n) {
  if (!e.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = _y(e, n);
  o.append(a), s && o.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = e.resistance, r.append(o, l), e.resistanceRollResult && r.append(Ds(e.resistanceRollResult)), t.append(r);
}
function _y(t, e) {
  if (!t.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Me, e.pendingId), n.setAttribute(As, "true"), n.setAttribute(Ts, t.resistanceSkill), n.setAttribute($s, t.resistanceSkillLabel ?? t.resistanceSkill), e.resistanceTargetActorId && n.setAttribute(Rs, e.resistanceTargetActorId), e.resistanceTargetName && n.setAttribute(ws, e.resistanceTargetName), t.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(ks, String(t.resistanceRollResult.total)), n.textContent = String(t.resistanceRollResult.total), n.title = `Rolar ${t.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${t.resistanceSkillLabel ?? t.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Ds(t) {
  const e = document.createElement("span");
  return e.classList.add(`${h}__resistance-roll-result`), e.textContent = xs(t), e;
}
function by(t, e, n, r, o) {
  const a = e.filter((d) => d.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Er, s), l.setAttribute("aria-expanded", "false"), l.textContent = o;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(ys, s), c.hidden = !0;
  for (const d of a) {
    const f = document.createElement("dt");
    f.textContent = d.label;
    const y = document.createElement("dd");
    y.textContent = d.value, c.append(f, y);
  }
  t.append(l, c);
}
function yy(t, e) {
  if (e.notes.length === 0 && e.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...e.notes, ...e.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  t.append(n);
}
function Ay(t, e) {
  const n = `[${Vo}="${Ct(e.id)}"]`, r = t.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Vb), o.setAttribute(Vo, e.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = e.title, o.append(a), t.append(o), o;
}
function Ty(t) {
  const e = t.actionSectionId?.trim(), n = t.actionSectionTitle?.trim();
  if (e && n)
    return { id: e, title: n };
  const r = Ms(t.summaryLines ?? [], t);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function $y(t, e) {
  if (e.length === 0) return;
  const n = Ry(t);
  for (const r of e) {
    const o = _A(r);
    if (n.querySelector(`[${Ho}="${Ct(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(Ho, o), n.append(a);
  }
}
function Ry(t) {
  const e = t.querySelector(`.${Yo}`);
  if (e)
    return e;
  const n = document.createElement("ul");
  return n.classList.add(Yo), t.append(n), n;
}
function wy(t) {
  const e = document.createElement("button");
  return e.type = "button", e.classList.add(`${h}__button`), e.setAttribute(Me, t.pendingId), t.executed ? (e.disabled = !0, e.textContent = t.executedLabel ?? "✓ Automação aplicada", e.classList.add(Is), e) : (e.textContent = t.buttonLabel ?? "Aplicar automação", e.setAttribute(Fe, t.pendingId), e.setAttribute(kr, t.executedLabel ?? "✓ Automação aplicada"), t.choiceGroupId && (e.setAttribute(Bn, t.choiceGroupId), e.setAttribute(bs, t.skippedLabel ?? "✓ Outra opção escolhida")), e);
}
function ky(t) {
  const e = t.actor?.name ?? t.token?.name ?? "Origem não resolvida", n = Ey(t);
  return `${e} → ${n}`;
}
function Ey(t) {
  return t.targets.length > 0 ? t.targets.map((e) => e.name).join(", ") : "nenhum alvo";
}
function Iy(t) {
  return Ps(t) ?? t;
}
function Ps(t) {
  return t.classList.contains("message-content") ? t : t.querySelector(".message-content");
}
function vs(t, e) {
  const n = Ue(t);
  if (!n) return;
  const r = n.querySelectorAll(zb);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      qy(o, e);
    }));
}
function jn(t) {
  const e = Ue(t);
  if (!e) return;
  const n = e.querySelectorAll(jb);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Cy(e, r);
    }));
}
function Gn(t) {
  const e = Ue(t);
  if (!e) return;
  const n = e.querySelectorAll(Gb);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Sy(e, r);
    }));
}
function Cy(t, e) {
  const n = e.getAttribute(Er);
  if (!n) return;
  const r = t.querySelector(`[${ys}="${Ct(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, e.setAttribute("aria-expanded", o ? "true" : "false"), e.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Sy(t, e) {
  const n = e.getAttribute(Me), r = e.getAttribute(Ts), o = e.getAttribute($s) ?? (r ? it(r) : "Resistência");
  if (!n || !r) return;
  const a = Py(t, n), s = vy(a, e);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  e.disabled = !0;
  const l = e.innerHTML;
  e.textContent = "...";
  try {
    const c = await sd(s, r);
    await Fy(c.roll);
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
    Ly(e, d), Dy(e, d), By(n, d), await Uy(t, n, d);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), e.innerHTML = l;
  } finally {
    e.disabled = !1;
  }
}
function Ly(t, e) {
  t.classList.add(`${h}__resistance-roll-button--rolled`), t.setAttribute(ks, String(e.total)), t.textContent = String(e.total), t.title = `Rolar ${e.skillLabel} novamente`, t.setAttribute("aria-label", t.title);
}
function Dy(t, e) {
  const n = t.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Ds(e);
  if (r) {
    r.textContent = xs(e);
    return;
  }
  n.append(o);
}
function Py(t, e) {
  const n = N.get(e);
  if (n) return n;
  const r = Be(t);
  return j(r)[e] ?? null;
}
function vy(t, e) {
  const n = t?.resistanceTargetActor;
  if (U(n)) return n;
  const o = t?.context?.targets.map(Vn).find(U) ?? null;
  if (o) return o;
  const a = e.getAttribute(Rs) ?? t?.resistanceTargetActorId ?? null, s = a ? xy(a) : null;
  return s || Oy(
    e.getAttribute(ws) ?? t?.resistanceTargetName ?? Ny(e)
  );
}
function Ny(t) {
  const n = t.closest(`.${h}`)?.querySelector(`.${Es}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function Vn(t) {
  const e = t.actor;
  if (U(e)) return e;
  const n = t.token, r = zt(n);
  if (r) return r;
  const o = t.document;
  return zt(o);
}
function zt(t) {
  if (!t || typeof t != "object") return null;
  const e = t.actor;
  if (U(e)) return e;
  const n = t.document?.actor;
  return U(n) ? n : null;
}
function xy(t) {
  const n = game.actors?.get?.(t);
  return U(n) ? n : Ns().map((a) => zt(a)).find((a) => a?.id === t) ?? null;
}
function Oy(t) {
  const e = At(t);
  if (!e) return null;
  const n = Ns().filter((a) => At(My(a)) === e).map((a) => zt(a)).find(U) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => U(a) && At(a.name) === e);
  return U(o) ? o : null;
}
function Ns() {
  const t = canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function My(t) {
  if (!t || typeof t != "object") return null;
  const e = t.name;
  if (typeof e == "string") return e;
  const n = t.document?.name;
  return typeof n == "string" ? n : zt(t)?.name ?? null;
}
function At(t) {
  const e = t?.trim().toLocaleLowerCase();
  return e && e.length > 0 ? e : null;
}
function U(t) {
  return !!(t && typeof t == "object" && "system" in t);
}
function xs(t) {
  const e = t.diceBreakdown ? ` ${t.diceBreakdown}` : "";
  return `${t.skillLabel}: ${t.formula}${e} = ${t.total}`;
}
async function Fy(t) {
  const e = game.dice3d;
  typeof e?.showForRoll == "function" && await Promise.resolve(e.showForRoll(t, game.user, !0));
}
function By(t, e) {
  const n = N.get(t);
  n && (n.resistanceRollResult = e);
}
async function Uy(t, e, n) {
  const r = Be(t);
  if (r)
    try {
      const o = j(r), a = o[e];
      if (!a) return;
      o[e] = {
        ...a,
        resistanceRollResult: n
      }, await It(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Be(t) {
  const n = (t.closest("[data-message-id]") ?? t).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return z(r?.get?.(n));
}
async function qy(t, e) {
  const n = t.getAttribute(Fe);
  if (!n) return;
  t.disabled = !0;
  const r = t.textContent;
  if (t.textContent = "Aplicando...", await e(n)) {
    Os(t, t.getAttribute(kr) ?? "✓ Automação aplicada"), zy(t);
    return;
  }
  t.disabled = !1, t.textContent = r;
}
function Os(t, e) {
  t.disabled = !0, t.textContent = e, t.classList.add(Is), t.removeAttribute(Fe), t.removeAttribute(kr);
}
function zy(t) {
  const e = t.getAttribute(Bn);
  if (!e) return;
  const n = t.closest(`.${h}`) ?? t.parentElement;
  if (!n) return;
  const r = `[${Bn}="${Ct(e)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === t) continue;
    const a = o.getAttribute(bs) ?? "✓ Outra opção escolhida";
    Os(o, a);
  }
}
function Ms(t, e) {
  const n = t.map(Cr).filter(pA), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = E(t, "Forma"), a = E(t, "Custo"), s = E(t, "Dados") ?? E(t, `Dados (${r.label})`), l = E(t, "Tipo"), c = E(t, "Resistência"), d = E(t, "Resistência Perícia"), f = E(t, "Resistência Rótulo") ?? (d ? it(d) : null), y = Fs(t, "Observação"), T = t.filter((g) => Vy(g, r)), $ = jy(t);
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
function jy(t) {
  const e = t.map(Cr).find((a) => a?.intent === "casting") ?? null, n = E(t, "Conjuração DT"), r = E(t, "Conjuração Resultado");
  if (!e || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: e.formula,
    formula: E(t, "Conjuração Fórmula") ?? e.formula,
    total: e.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: E(t, "Dados (Conjuração)")
  } : null;
}
function Cr(t) {
  const e = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(t.trim());
  if (!e) return null;
  const [, n, r, o] = e, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: Gy(n)
  } : null;
}
function Gy(t) {
  return t === "Cura" ? "healing" : t === "Dano" ? "damage" : t === "Conjuração" ? "casting" : "generic";
}
function E(t, e) {
  return Fs(t, e)[0] ?? null;
}
function Fs(t, e) {
  const n = `${e}:`;
  return t.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Vy(t, e) {
  return t.startsWith("Forma:") || t.startsWith("Custo:") || t.startsWith("Dados:") || t.startsWith(`Dados (${e.label}):`) || t.startsWith("Tipo:") || t.startsWith("Resistência:") || t.startsWith("Resistência Perícia:") || t.startsWith("Resistência Rótulo:") || t.startsWith("Observação:") || t.startsWith("Conjuração Fórmula:") || t.startsWith("Conjuração DT:") || t.startsWith("Conjuração Resultado:") || t.startsWith("Dados (Conjuração):") || Cr(t) ? !1 : t.trim().length > 0;
}
function Hy(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const r of N.values())
    Hn(r, t, e) && n.set(r.pendingId, r);
  for (const r of Zy(t))
    Hn(r, t, e) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Hn(t, e, n) {
  const r = Z(e) ?? n.dataset.messageId ?? null;
  return t.messageId ? t.messageId === r : !t.itemId || !ra(n, "itemId", t.itemId) ? !1 : !t.actorId || ra(n, "actorId", t.actorId);
}
function ra(t, e, n) {
  if (t.dataset[e] === n)
    return !0;
  const r = `data-${bA(e)}`;
  for (const o of t.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function Wy(t) {
  const e = Ct(t);
  return document.querySelector(
    `.chat-message[data-message-id="${e}"], [data-message-id="${e}"]`
  );
}
function Ky(t) {
  for (const e of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Hn(t, null, e))
      return e;
  return null;
}
function Yy() {
  const t = Date.now(), e = 300 * 1e3;
  for (const [n, r] of N.entries())
    t - r.createdAt > e && N.delete(n);
}
async function oa(t, e) {
  const n = Be(t);
  if (!n) return !1;
  try {
    const r = j(n);
    return r[e.pendingId] = Dr(e, Z(n)), await It(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Sr(t) {
  const e = zs(t);
  if (!e) return !1;
  try {
    const n = j(e);
    return n[t.pendingId] = Dr(t, Z(e)), await It(e, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Bs(t) {
  for (const e of Wb)
    globalThis.setTimeout(() => {
      Wn(t);
    }, e);
}
async function Wn(t) {
  const e = zs(t);
  if (Lr(e)?.prompts.some((o) => o.pendingId === t.pendingId))
    return !0;
  const r = await Sr(t);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: t.pendingId,
    itemId: t.itemId,
    itemName: t.itemName,
    actorId: t.actorId,
    messageId: t.messageId
  }), r;
}
async function Qy(t, e) {
  const n = qs(t.context.message);
  if (n)
    try {
      const r = j(n), o = r[t.pendingId] ?? Dr(t, Z(n));
      r[t.pendingId] = {
        ...o,
        executedLabel: e ?? o.executedLabel,
        executed: !0
      }, await It(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function Zy(t) {
  return Object.values(j(z(t))).filter(Wt);
}
function j(t) {
  if (!t) return {};
  const e = {}, n = Lr(t);
  for (const r of n?.prompts ?? [])
    e[r.pendingId] = r;
  for (const [r, o] of Object.entries(Us(t)))
    e[r] ??= o;
  return e;
}
function Xy(t) {
  return Object.values(Us(z(t))).filter(Wt);
}
function Us(t) {
  if (!t) return {};
  const e = t.getFlag?.(u, hs);
  if (!Rt(e))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(e))
    Wt(o) && (n[r] = o);
  return n;
}
async function It(t, e) {
  typeof t.setFlag == "function" && (await tA(t, e), await Jy(t, e));
}
async function Jy(t, e) {
  await Promise.resolve(t.setFlag?.(u, hs, e));
}
function Lr(t) {
  if (!t) return null;
  const e = t.getFlag?.(u, _s);
  return mA(e) ? e : null;
}
async function tA(t, e) {
  if (typeof t.setFlag != "function") return;
  const n = Object.values(e).filter(Wt).sort((a, s) => a.createdAt - s.createdAt);
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
      actorName: eA(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(t.setFlag(u, _s, o));
}
function eA(t) {
  if (!t.includes("→")) return t.trim() || null;
  const n = t.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Dr(t, e) {
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
function qs(t) {
  const e = z(t);
  if (e?.setFlag)
    return e;
  const n = nA(t);
  if (n?.setFlag)
    return n;
  const r = Z(t);
  if (!r) return null;
  const o = game.messages;
  return z(o?.get?.(r));
}
function nA(t) {
  return !t || typeof t != "object" ? null : [
    t.document,
    t.message,
    t.chatMessage
  ].map(z).find((n) => typeof n?.setFlag == "function") ?? null;
}
function zs(t) {
  const e = qs(t.context.message);
  if (e) return e;
  const n = t.messageId ? rA(t.messageId) : null;
  if (n) return n;
  const r = Vs().slice().reverse();
  return r.find((o) => oA(o, t)) ?? r.find((o) => aA(o, t)) ?? null;
}
function rA(t) {
  const e = game.messages;
  return z(e?.get?.(t));
}
function oA(t, e) {
  const n = Z(t);
  if (e.messageId && n === e.messageId) return !0;
  if (!js(t, e)) return !1;
  const o = Gs(t);
  return !e.actorId || !o || o === e.actorId;
}
function aA(t, e) {
  if (!sA(t, e)) return !1;
  const n = Gs(t);
  return e.actorId && n === e.actorId ? !0 : js(t, e);
}
function js(t, e) {
  const n = At(iA(t));
  if (!n) return !1;
  const r = At(e.itemName);
  if (r && n.includes(r)) return !0;
  const o = At(e.itemId);
  return !!(o && n.includes(o));
}
function iA(t) {
  const e = t.content;
  return typeof e == "string" ? e : null;
}
function Gs(t) {
  const e = t.speaker;
  return typeof e?.actor == "string" && e.actor.length > 0 ? e.actor : null;
}
function sA(t, e) {
  const n = lA(t);
  return n === null ? !1 : Math.abs(n - e.createdAt) <= Kb;
}
function lA(t) {
  const e = t.timestamp;
  if (typeof e == "number" && Number.isFinite(e)) return e;
  const n = t._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function z(t) {
  return t && typeof t == "object" ? t : null;
}
function Wt(t) {
  return Rt(t) ? t.schemaVersion === 1 && typeof t.pendingId == "string" && t.mode === "ask" && typeof t.createdAt == "number" && typeof t.summary == "string" && typeof t.executed == "boolean" && S(t.messageId) && S(t.itemId) && S(t.actorId) && S(t.itemName) && nt(t.resistanceTargetActorId) && nt(t.resistanceTargetName) && fA(t.resistanceRollResult) && cA(t.actionPayload) && en(t.title) && en(t.buttonLabel) && en(t.executedLabel) && nt(t.choiceGroupId) && nt(t.skippedLabel) && nt(t.actionSectionId) && nt(t.actionSectionTitle) && gA(t.summaryLines) : !1;
}
function cA(t) {
  return t == null ? !0 : Rt(t) ? t.kind === "resource-operation" && S(t.actorId) && S(t.actorUuid) && typeof t.actorName == "string" && uA(t.resource) && dA(t.operation) && typeof t.amount == "number" && Number.isFinite(t.amount) : !1;
}
function uA(t) {
  return t === "PV" || t === "SAN" || t === "PE" || t === "PD";
}
function dA(t) {
  return t === "damage" || t === "heal" || t === "recover" || t === "spend";
}
function mA(t) {
  return Rt(t) ? t.schemaVersion === 1 && t.kind === "item-use" && typeof t.createdAt == "number" && S(t.messageId) && Rt(t.source) && S(t.source.actorId) && S(t.source.actorName) && S(t.source.itemId) && S(t.source.itemName) && Array.isArray(t.prompts) && t.prompts.every(Wt) : !1;
}
function fA(t) {
  return t == null ? !0 : Rt(t) ? typeof t.skill == "string" && typeof t.skillLabel == "string" && typeof t.formula == "string" && typeof t.total == "number" && Number.isFinite(t.total) && typeof t.targetName == "string" && nt(t.diceBreakdown) && (t.usedFallbackBonus === void 0 || typeof t.usedFallbackBonus == "boolean") && typeof t.rolledAt == "string" : !1;
}
function pA(t) {
  return t !== null;
}
function Rt(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function S(t) {
  return t === null || typeof t == "string";
}
function en(t) {
  return t === void 0 || typeof t == "string";
}
function nt(t) {
  return t == null || typeof t == "string";
}
function gA(t) {
  return t === void 0 || Array.isArray(t) && t.every((e) => typeof e == "string");
}
function hA(t) {
  return typeof t == "string" && t.length > 0;
}
function Vs() {
  const t = game.messages;
  if (!t || typeof t != "object") return [];
  const e = t.contents;
  if (Array.isArray(e))
    return e.map(z).filter((r) => r !== null);
  const n = t.values;
  return typeof n == "function" ? Array.from(n.call(t)).map(z).filter((r) => r !== null) : [];
}
function Ue(t) {
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
function _A(t) {
  return t.trim().toLowerCase();
}
function bA(t) {
  return t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
}
function Ct(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const aa = 1e3;
class yA {
  constructor(e, n, r, o, a, s) {
    this.workflow = e, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = s, this.ritualAssistant = new G_(
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
      settings: Ur(),
      strategies: this.strategies.map((e) => e.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(e) {
    const n = Ur();
    if (n.executionMode === "disabled") {
      this.setAttempt(e, "skipped", "execution-mode-disabled");
      return;
    }
    const r = $e(e.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && IA(e.item) && n.executionMode === "ask") {
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
    if (await Uo(e), !e.actor) {
      this.setAttempt(e, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${e.item.name}.`,
        data: on(e, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(e), await tn(e), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(e), await tn(
      e,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(e) {
    const n = Ir(e);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = LA(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await pe(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await Xb(e), await Jb(
      e,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Qb(
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
    if (await Uo(e), !e.actor) {
      this.setAttempt(e, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${e.item.name}.`,
        data: on(e, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(e)) {
      this.setAttempt(e, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(e), await this.handleAssistedRitual(
      e,
      CA(e.item)
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
      return o.ok ? (EA(n, o.value), await AA(o.value), {
        ok: !0,
        executedLabel: TA(o.value)
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
    const n = nn(e.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && nn(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== e.id && (this.pendingExecutions.delete(o), await tn(
        o,
        sa(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(e, n) {
    const r = an();
    await Zb({
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
      const l = an();
      a ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: e,
        workflowContext: n,
        createdAt: Date.now()
      }), await Xo({
        pendingId: l,
        context: e,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: nn(s),
        skippedLabel: sa(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: SA(s)
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
    const r = an();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: e,
      mode: "ask",
      createdAt: Date.now()
    }), await Xo({
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
    const n = Date.now(), r = la(e);
    for (const [a, s] of this.recentExecutionKeys.entries())
      n - s > aa && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= aa;
  }
  markExecution(e) {
    this.recentExecutionKeys.set(la(e), Date.now());
  }
  setAttempt(e, n, r, o) {
    this.lastAttempt = on(
      e,
      n,
      r,
      o
    );
  }
}
async function AA(t) {
  const e = kA();
  if (e.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: t.actor }),
        whisper: e,
        content: $A(t)
      });
    } catch (n) {
      m.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function TA(t) {
  const e = t.totalBlocked > 0 ? ` (RD ${t.totalBlocked})` : "";
  return `✓ ${t.totalFinalDamage} PV aplicado${e}`;
}
function $A(t) {
  const e = t.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${ce(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = t.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${t.totalFinalDamage} PV</li>` : "", r = t.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${t.totalBlocked}</li>` : "", o = RA(t), a = t.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${ce(t.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${ce(t.actorName)}</strong></p>
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
function RA(t) {
  const e = wA(t.actor), n = t.newPV ?? e?.value ?? null, r = e?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${ce(o)}</li>`;
}
function wA(t) {
  const e = t.system, n = t.type === "threat" ? e.attributes?.hp : e.PV, r = ia(n?.value);
  return r === null ? null : {
    value: r,
    max: ia(n?.max)
  };
}
function ia(t) {
  return typeof t == "number" && Number.isFinite(t) ? t : null;
}
function kA() {
  return game.users.filter((t) => t.isGM).map((t) => t.id).filter((t) => typeof t == "string" && t.length > 0);
}
function ce(t) {
  const e = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return t.replace(/[&<>"']/gu, (n) => e[n] ?? n);
}
function nn(t) {
  return t.kind !== "resource-operation" && t.kind !== "damage-application" ? null : t.choiceGroupId ?? null;
}
function sa(t) {
  return t.kind !== "resource-operation" && t.kind !== "damage-application" ? null : t.choiceGroupResolvedLabel ?? null;
}
function EA(t, e) {
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
function IA(t) {
  return t.type === "ritual";
}
function CA(t) {
  return c_(t) ?? {
    version: 1,
    label: `Conjuração de ${t.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function SA(t) {
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
function LA(t) {
  const e = t.actorUuid ? DA(t.actorUuid) : null;
  if (wt(e)) return e;
  const n = t.actorId ? PA(t.actorId) : null;
  return n || vA(t.actorName);
}
function DA(t) {
  const e = globalThis.fromUuidSync;
  if (typeof e != "function") return null;
  try {
    return e(t);
  } catch {
    return null;
  }
}
function PA(t) {
  const n = game.actors?.get?.(t);
  if (wt(n)) return n;
  for (const r of Hs()) {
    const o = Pr(r);
    if (o?.id === t) return o;
  }
  return null;
}
function vA(t) {
  const e = rn(t);
  if (!e) return null;
  for (const o of Hs()) {
    const a = NA(o);
    if (rn(a) === e) {
      const s = Pr(o);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (o) => wt(o) && rn(o.name) === e
  );
  return wt(r) ? r : null;
}
function Hs() {
  const t = canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function NA(t) {
  if (!t || typeof t != "object") return null;
  const e = t.name;
  if (typeof e == "string") return e;
  const n = t.document?.name;
  return typeof n == "string" ? n : Pr(t)?.name ?? null;
}
function Pr(t) {
  if (!t || typeof t != "object") return null;
  const e = t.actor;
  if (wt(e)) return e;
  const n = t.document?.actor;
  return wt(n) ? n : null;
}
function rn(t) {
  const e = t?.trim().toLocaleLowerCase();
  return e && e.length > 0 ? e : null;
}
function wt(t) {
  return !!(t && typeof t == "object" && "system" in t);
}
function on(t, e, n, r) {
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
function la(t) {
  const e = t.actor?.id ?? "no-actor", n = t.item.uuid ?? t.item.id ?? t.item.name ?? "unknown-item";
  return `${e}:${n}`;
}
function an() {
  const t = globalThis.crypto;
  return t?.randomUUID ? t.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class xA {
  constructor(e, n, r) {
    this.diagnostic = e, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(e) {
    const n = this.diagnostic.getApplicableEntries(e), r = [], o = [], a = Gt(e);
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
class OA {
  constructor(e) {
    this.automationRegistry = e;
  }
  automationRegistry;
  analyzeActor(e) {
    const n = Gt(e).map((l) => this.analyzeRitual(l)), r = n.filter(re("upToDate")), o = n.filter(re("available")), a = n.filter(re("outdated")), s = n.filter(re("unsupported"));
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
    const n = this.automationRegistry.findForItem(e)[0] ?? null, r = MA(e);
    return n ? r ? r.source.type !== "preset" ? Pt({
      ritual: e,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? Pt({
      ritual: e,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : Pt({
      ritual: e,
      status: "outdated",
      match: n,
      flag: r,
      reason: FA(r, n.preset)
    }) : Pt({
      ritual: e,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : Pt({
      ritual: e,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Pt(t) {
  const e = t.flag?.source, n = e?.type === "preset" ? e : null;
  return {
    itemId: t.ritual.id ?? null,
    itemName: t.ritual.name ?? "Ritual sem nome",
    status: t.status,
    match: t.match,
    preset: t.match ? Te(t.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: t.reason
  };
}
function MA(t) {
  const e = t.getFlag(u, "automation");
  return Yn(e) ? e : null;
}
function FA(t, e) {
  return t.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${e.label}.` : t.source.presetId !== e.id ? `Preset aplicado (${t.source.presetId}) difere do preset atual sugerido (${e.id}).` : `Preset ${e.label} aplicado em v${t.source.presetVersion}; versão atual é v${e.version}.`;
}
function re(t) {
  return (e) => e.status === t;
}
class BA {
  constructor(e) {
    this.debugOutput = e;
  }
  debugOutput;
  async createResourceOperationMessage(e) {
    const n = this.createResourceOperationContent(e.transaction), r = Zn(e.transaction);
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
    const n = A(e.actorName), r = A(e.resource), o = A(ca(e)), a = A(qA(e));
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
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(UA(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), d = e.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(zA(g.source))})</li>`
    ), f = e.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), y = e.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = e.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(ca(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
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
function UA(t) {
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
function ca(t) {
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
function qA(t) {
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
function zA(t) {
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
function jA() {
  const t = new Lg(), e = new vh(t), n = new ri(new ni()), r = new oi(new ur()), o = new Nh(new Ji()), a = new vg(), s = new Kg(a), l = new lh(t), c = new uh(), d = c.registerMany(
    Nl()
  );
  if (!d.ok)
    throw new Error(d.error.message);
  const f = new ch(), y = new ih(), T = fi(), $ = new si(T), g = new OA(
    c
  ), G = new xA(
    g,
    f,
    y
  ), Lt = new Fh(), Dt = new BA(Lt), ct = new Mh(), I = new Dh(
    e,
    s,
    Dt,
    ct
  ), x = new Oh(I, ct), ut = new yA(
    x,
    e,
    s,
    n,
    $,
    Lt
  );
  return ut.addStrategy(
    new oh(
      (tl) => ut.handleItemUsed(tl)
    )
  ), {
    ordem: l,
    resourceAdapter: t,
    ritualAdapter: a,
    ritualCosts: s,
    resources: e,
    damage: n,
    resistance: r,
    ritualCasting: o,
    automationRegistry: c,
    automationBinder: f,
    itemPatches: y,
    conditionRegistry: T,
    conditions: $,
    debugOutput: Lt,
    chatMessages: Dt,
    workflowHooks: ct,
    automation: I,
    workflow: x,
    itemUseIntegration: ut,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: G
  };
}
const { ApplicationV2: GA } = foundry.applications.api;
class ye extends GA {
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
      apply: ye.onApply,
      cancel: ye.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${M(Kn)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${M(e.actorName)}</strong></p>
        </div>
        ${this.renderSummary(e)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${sn("Prontos para aplicar", "available", e.available, "fa-solid fa-plus")}
        ${sn("Desatualizados", "outdated", e.outdated, "fa-solid fa-rotate")}
        ${sn("Automatizados", "upToDate", e.upToDate, "fa-solid fa-check")}
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
function sn(t, e, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${e}">
      <h3>
        <i class="${r}"></i>
        <span>${M(t)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? VA(n) : WA(e)}
    </section>
  `;
}
function VA(t) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${t.map(HA).join("")}</ol>`;
}
function HA(t) {
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
function WA(t) {
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
const Ae = `${u}.manageRitualPresets`, ua = `__${u}_ritualPresetHeaderControlRegistered`, KA = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function YA(t) {
  const e = globalThis;
  if (!e[ua]) {
    for (const n of KA)
      Hooks.on(n, (r, o) => {
        QA(r, o, t);
      });
    e[ua] = !0, m.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function QA(t, e, n) {
  Array.isArray(e) && XA(t) && (ZA(t, n), !e.some((r) => r.action === Ae) && e.push({
    action: Ae,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Ws(t, n);
    }
  }));
}
function ZA(t, e) {
  t.options && (t.options.actions ??= {}, !t.options.actions[Ae] && (t.options.actions[Ae] = (n) => {
    n.preventDefault(), n.stopPropagation(), Ws(t, e);
  }));
}
function XA(t) {
  if (!game.user?.isGM) return !1;
  const e = Ks(t);
  return e ? e.type === "agent" && Gt(e).length > 0 : !1;
}
function Ws(t, e) {
  const n = Ks(t);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new ye(n, e).render({ force: !0 });
}
function Ks(t) {
  return da(t.actor) ? t.actor : da(t.document) ? t.document : null;
}
function da(t) {
  return !!(t && typeof t == "object" && "items" in t && "type" in t);
}
const Ys = "data-paranormal-toolkit-ritual-roll-config", Kt = "data-paranormal-toolkit-ritual-roll-field", st = "data-paranormal-toolkit-ritual-roll-action", ma = `__${u}_ritualRollConfigBlockRegistered`, JA = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], tT = [
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
function eT() {
  const t = globalThis;
  if (!t[ma]) {
    nT();
    for (const e of JA)
      Hooks.on(e, (...n) => {
        rT(n[0], n[1]);
      });
    t[ma] = !0, m.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function nT() {
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
function rT(t, e) {
  const n = _T(t);
  if (!n || n.type !== "ritual") return;
  const r = AT(e);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  aT(o);
  const a = Zs(n), s = us(n), l = bT(n), c = iT(n, s, a, l);
  mT(c, n, a, l), oT(o, c), vr(c);
}
function oT(t, e) {
  const n = t.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", e);
    return;
  }
  (t.querySelector(".content-item.scrollable") ?? t).append(e);
}
function aT(t) {
  for (const e of Array.from(t.querySelectorAll(`[${Ys}]`)))
    e.remove();
}
function iT(t, e, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${u}-ritual-roll-config`), o.setAttribute(Ys, t.uuid ?? t.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${u}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${u}-ritual-roll-config__title`), s.append(fa("strong", "Paranormal Toolkit")), s.append(fa("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${u}-ritual-roll-config__badge`), l.textContent = Js(e) ? "Configurada" : "Rascunho", a.append(s, l), o.append(a);
  const c = document.createElement("p");
  c.classList.add(`${u}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(c);
  const d = document.createElement("div");
  d.classList.add(`${u}-ritual-roll-config__fields`), d.append(sT(e, r)), d.append(lT(e, r)), d.append(cT(e, r)), o.append(d), o.append(uT(e, n, r)), o.append(dT(r));
  const f = document.createElement("p");
  return f.classList.add(`${u}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function sT(t, e) {
  const n = qe("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Kt, "intent"), r.disabled = !e;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = l_(o), a.selected = t.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function lT(t, e) {
  const n = qe("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Kt, "damageType"), r.disabled = !e;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !t.damageType, r.append(o);
  for (const a of tT) {
    const s = document.createElement("option");
    s.value = a.value, s.textContent = a.label, s.selected = t.damageType === a.value, r.append(s);
  }
  return n.append(r), n;
}
function cT(t, e) {
  const n = qe("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = t.utilityLabel ?? "Resultado", r.disabled = !e, r.setAttribute(Kt, "utilityLabel"), n.append(r), n;
}
function uT(t, e, n) {
  const r = document.createElement("section");
  r.classList.add(`${u}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${u}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const a = document.createElement("div");
  return a.classList.add(`${u}-ritual-roll-config__forms-grid`), a.append(ln("base", "Padrão", t.forms.base.formula, !0, n)), a.append(ln("discente", "Discente", t.forms.discente.formula, e.discente, n)), a.append(ln("verdadeiro", "Verdadeiro", t.forms.verdadeiro.formula, e.verdadeiro, n)), r.append(a), r;
}
function ln(t, e, n, r, o) {
  const a = qe(e);
  a.classList.add(`${u}-ritual-roll-config__form-card`), a.dataset.ritualRollForm = t;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = t === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !o || !r, s.setAttribute(Kt, `formula.${t}`), a.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", a.append(l);
  }
  return a;
}
function dT(t) {
  const e = document.createElement("div");
  e.classList.add(`${u}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !t, n.setAttribute(st, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !t, r.setAttribute(st, "clear"), e.append(n, r), e;
}
function qe(t) {
  const e = document.createElement("label");
  e.classList.add(`${u}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = t, e.append(n), e;
}
function fa(t, e) {
  const n = document.createElement(t);
  return n.textContent = e, n;
}
function mT(t, e, n, r) {
  St(t, "intent")?.addEventListener("change", () => vr(t)), ha(t, "system.studentForm")?.addEventListener("change", () => pa(t, e)), ha(t, "system.trueForm")?.addEventListener("change", () => pa(t, e)), t.querySelector(`[${st}="save"]`)?.addEventListener("click", () => {
    r && fT(t, e, n);
  }), t.querySelector(`[${st}="clear"]`)?.addEventListener("click", () => {
    r && pT(t, e);
  });
}
async function fT(t, e, n) {
  const r = t.querySelector(`[${st}="save"]`);
  r?.setAttribute("disabled", "true"), Tt(t, "Salvando configuração...");
  try {
    const o = gT(t, n);
    await i_(e, o), Qs(t, o), Tt(t, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), Tt(t, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function pT(t, e) {
  const n = t.querySelector(`[${st}="clear"]`);
  n?.setAttribute("disabled", "true"), Tt(t, "Limpando configuração...");
  try {
    await s_(e);
    const r = us(e);
    hT(t, r), Qs(t, r), Tt(t, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Tt(t, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Qs(t, e) {
  const n = t.querySelector(`.${u}-ritual-roll-config__badge`);
  n && (n.textContent = Js(e) ? "Configurada" : "Rascunho");
}
function gT(t, e) {
  return {
    schemaVersion: 1,
    intent: Xs(St(t, "intent")?.value),
    damageType: _a(t, "damageType"),
    utilityLabel: _a(t, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: ue(t, "formula.base") },
      discente: { formula: ue(t, "formula.discente") },
      verdadeiro: { formula: ue(t, "formula.verdadeiro") }
    }
  };
}
function hT(t, e) {
  mt(t, "intent", e.intent), mt(t, "damageType", e.damageType ?? ""), mt(t, "utilityLabel", e.utilityLabel ?? "Resultado"), mt(t, "formula.base", e.forms.base.formula), mt(t, "formula.discente", e.forms.discente.formula), mt(t, "formula.verdadeiro", e.forms.verdadeiro.formula), vr(t);
}
function vr(t) {
  const e = Xs(St(t, "intent")?.value), n = t.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = t.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = e !== "damage";
  for (const o of Array.from(r))
    o.hidden = e !== "utility";
}
function pa(t, e) {
  const n = Zs(e);
  ga(t, "discente", n.discente), ga(t, "verdadeiro", n.verdadeiro);
}
function ga(t, e, n) {
  const r = St(t, `formula.${e}`);
  if (!r) return;
  const o = !t.querySelector(`[${st}="save"]`)?.disabled;
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
function Tt(t, e) {
  const n = t.querySelector(`.${u}-ritual-roll-config__status`);
  n && (n.textContent = e);
}
function Zs(t) {
  const e = yT(t);
  return {
    base: !0,
    discente: e.studentForm === !0,
    verdadeiro: e.trueForm === !0
  };
}
function _T(t) {
  return ba(t.item) ? t.item : ba(t.document) ? t.document : null;
}
function bT(t) {
  return !!(game.user?.isGM || t.isOwner === !0);
}
function yT(t) {
  const e = t.system;
  return TT(e) ? e : {};
}
function ha(t, e) {
  return t.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${e}"]`) ?? null;
}
function St(t, e) {
  return t.querySelector(`[${Kt}="${$T(e)}"]`);
}
function ue(t, e) {
  return St(t, e)?.value.trim() ?? "";
}
function _a(t, e) {
  const n = ue(t, e);
  return n.length > 0 ? n : null;
}
function mt(t, e, n) {
  const r = St(t, e);
  r && (r.value = n);
}
function Xs(t) {
  return t === "healing" || t === "utility" ? t : "damage";
}
function Js(t) {
  return Object.values(t.forms).some((e) => e.formula.trim().length > 0);
}
function AT(t) {
  if (t instanceof HTMLElement) return t;
  if (t && typeof t == "object") {
    const e = t;
    if (e[0] instanceof HTMLElement) return e[0];
    if (e.element instanceof HTMLElement) return e.element;
  }
  return null;
}
function ba(t) {
  return !!(t && typeof t == "object" && "type" in t && "system" in t && "getFlag" in t && "setFlag" in t);
}
function TT(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function $T(t) {
  return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let ot = null;
Hooks.once("init", () => {
  Dl(), ec(), xc(), _g(), m.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!jr.isSupportedSystem()) {
    m.warn(
      `Sistema não suportado: ${jr.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  ot = jA(), ot.itemUseIntegration.registerStrategies(), Dc(ot.conditions), pc(ot), kc(), Tc(), Rg(), YA(ot), eT(), m.info("Inicializado para o sistema Ordem Paranormal."), m.info(
    `API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Kn} inicializado.`);
});
function RT() {
  if (!ot)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return ot;
}
export {
  RT as getToolkitServices
};
//# sourceMappingURL=main.js.map
