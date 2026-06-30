const l = "paranormal-toolkit", wt = "Paranormal Toolkit", Mo = "ordemparanormal";
class ge {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function De(e) {
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
class u {
  static info(t, ...r) {
    console.log(`${l} | ${t}`, ...r);
  }
  static warn(t, ...r) {
    console.warn(`${l} | ${t}`, ...r);
  }
  static error(t, ...r) {
    console.error(`${l} | ${t}`, ...r);
  }
}
function h(e) {
  return { ok: !0, value: e };
}
function m(e) {
  return { ok: !1, error: e };
}
function Ct(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? m({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : $t(t) ? h(t.definition) : m({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Fo(e) {
  return $t(e.getFlag(l, "automation"));
}
function $t(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Uo(t.source) && xo(t.definition);
}
function xo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && I(t.label) && Array.isArray(t.steps) && t.steps.every(Bo);
}
function Uo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? I(t.presetId) && I(t.presetVersion) && I(t.appliedAt) : t.type === "manual" ? I(t.label) && I(t.appliedAt) : !1;
}
function Bo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return jo(t);
    case "spendRitualCost":
      return qo(t);
    case "rollFormula":
      return Ho(t);
    case "modifyResource":
      return Vo(t);
    case "chatCard":
      return Go(t);
    default:
      return !1;
  }
}
function jo(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && sn(t);
}
function qo(e) {
  return e.type === "spendRitualCost";
}
function Ho(e) {
  const t = e;
  return t.type === "rollFormula" && I(t.id) && I(t.formula) && (t.intent === void 0 || Yo(t.intent)) && (t.damageType === void 0 || I(t.damageType));
}
function Vo(e) {
  const t = e;
  return t.type === "modifyResource" && zo(t.actor) && Wo(t.resource) && Ko(t.operation) && sn(t);
}
function Go(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function sn(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || I(e.amountFrom);
}
function zo(e) {
  return e === "self" || e === "target";
}
function Wo(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ko(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Yo(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function I(e) {
  return typeof e == "string" && e.length > 0;
}
function _t(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(Yt);
    if (Zo(t))
      return Array.from(t).filter(Yt);
  }
  return [];
}
function Qo(e) {
  return _t(e)[0] ?? null;
}
function Xo(e) {
  return _t(e).find(Fo) ?? null;
}
function Zo(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Yt(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function he(e) {
  return _t(e).filter((t) => t.type === "ritual");
}
function cn(e) {
  return he(e)[0] ?? null;
}
function Jo(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(De);
      return u.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = ce("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = be(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(Zt);
      return u.info(`Presets encontrados para ${r.name}.`, n), n;
    },
    async applyPresetToFirstRitual(t) {
      const r = ce("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const n = be(r);
      if (!n) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await ot(e, n, o.value);
      u.info(`Preset ${o.value.id} aplicado em ${n.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = ce("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = be(t);
      if (!r) return;
      const n = e.automationRegistry.findForItem(r)[0];
      if (!n) {
        u.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const o = await ot(e, r, n.preset);
      u.info(`Melhor preset aplicado em ${r.name}.`, { match: Zt(n), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Qt(e);
    },
    async applyBestPresetsToActorRituals() {
      return Qt(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = ce("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = be(t);
      r && (await e.automationBinder.clear(r), u.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function Qt(e) {
  const t = ce("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = he(t);
  if (r.length === 0)
    return u.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Xt(t);
  const n = Xt(t, r.length);
  for (const o of r) {
    const a = e.automationRegistry.findForItem(o)[0];
    if (!a) {
      n.skipped.push({
        itemId: o.id ?? null,
        itemName: o.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const i = await ot(e, o, a.preset);
    n.applied.push(ea(o, a, i));
  }
  return u.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), ta(n), n;
}
async function ot(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function ea(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: De(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function Xt(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function ta(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((n) => n.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function Zt(e) {
  return {
    preset: De(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function ce(e) {
  const t = ge.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function be(e) {
  const t = cn(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function K(e) {
  return e ? {
    id: e.id,
    source: {
      ...ra(e.sourceActor),
      token: e.sourceToken
    },
    item: na(e.item),
    targets: e.targets.map(oa),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Jt(e.rollRequests, ln),
    rolls: Jt(e.rolls, aa),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(It),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function It(e) {
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
function ra(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function na(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function oa(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function ln(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function aa(e) {
  return {
    ...ln(e),
    total: e.total
  };
}
function Jt(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function ia(e) {
  return {
    getSelected() {
      return ge.getSelectedActor();
    },
    logResources() {
      const t = j(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const r = e.ordem.getActorSnapshot(t);
      u.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && u.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(t) {
      await Y(
        e,
        "Gasto de PE",
        j("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await Y(
        e,
        "Gasto de PD",
        j("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await Y(
        e,
        "Dano em PV",
        j("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await Y(
        e,
        "Cura de PV",
        j("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await Y(
        e,
        "Dano em SAN",
        j("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Y(
        e,
        "Recuperação de SAN",
        j("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function Y(e, t, r, n) {
  if (!r) return;
  const o = await n(r);
  if (!o.ok) {
    sa(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (i) {
    u.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  u.info(`${t} realizado:`, It(a));
}
function j(e) {
  const t = ge.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function sa(e) {
  if (e.reason === "update-failed") {
    u.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    u.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  u.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const L = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function ca() {
  Re(L.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Re(L.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Re(L.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Re(L.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function at() {
  return {
    enabled: Te(L.enabled),
    console: Te(L.console),
    ui: Te(L.ui),
    chat: Te(L.chat)
  };
}
async function x(e, t) {
  await game.settings.set(l, L[e], t);
}
function Re(e, t) {
  game.settings.register(l, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Te(e) {
  return game.settings.get(l, e) === !0;
}
function la() {
  return {
    status() {
      return at();
    },
    async enable() {
      await x("enabled", !0);
    },
    async disable() {
      await x("enabled", !1);
    },
    async enableConsole() {
      await x("console", !0);
    },
    async disableConsole() {
      await x("console", !1);
    },
    async enableUi() {
      await x("ui", !0);
    },
    async disableUi() {
      await x("ui", !1);
    },
    async enableChat() {
      await x("chat", !0);
    },
    async disableChat() {
      await x("chat", !1);
    }
  };
}
const un = "ritual.costOnly", dn = "ritual.simpleHealing", ua = "ritual.eletrocussao", mn = "ritual.simpleDamage", fn = "generic.simpleHealing", pn = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function da() {
  return [
    ma(),
    fa(),
    pa(),
    ga(),
    ha()
  ];
}
function ma() {
  return {
    id: un,
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
function fa() {
  return {
    id: dn,
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
    automation: gn(),
    itemPatch: Aa()
  };
}
function pa() {
  return {
    id: ua,
    version: "1.2.0",
    label: "Eletrocussão",
    description: "Preset inicial de dano de energia. Gasta o custo do ritual, rola 3d6/6d6/8d6 conforme a forma escolhida e prepara ação assistida para aplicar dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["eletrocussao", "eletrocucao"]
      }
    ],
    automation: ya(),
    itemPatch: ba()
  };
}
function ga() {
  return {
    id: mn,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: St()
  };
}
function ha() {
  return {
    id: fn,
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
function gn(e = "2d8+2") {
  return hn(
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
function ya() {
  return {
    ...St("3d6", {
      label: "Eletrocussão",
      title: "Eletrocussão",
      damageType: "energia",
      message: "Gasta o custo do ritual, rola dano de energia e prepara aplicação de dano em PV do alvo. Resistência deve ser resolvida manualmente por enquanto."
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
        notes: ["Se o alvo falhar na Fortitude, aplique Atordoado por 1 rodada manualmente."]
      }
    }
  };
}
function St(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return hn(
    {
      version: 1,
      label: r,
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
          title: n,
          message: a
        }
      ]
    },
    "damage",
    e
  );
}
function Aa() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: pn,
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
function ba() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: pn,
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
function hn(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((n) => n.type !== "rollFormula" || n.id !== t ? n : {
      ...n,
      formula: r
    })
  };
}
function Et() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Q(t.id),
    actorId: Q(t.actor?.id),
    sceneId: Q(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function yn() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: Q(e.id),
    actorId: Q(t?.id),
    sceneId: Q(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Q(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ra(e) {
  return {
    logFirstRitualCost() {
      const t = q("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const r = H(t);
      if (!r) return;
      const n = e.ritualCosts.getCost({ actor: t, ritual: r });
      if (!n.ok) {
        u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      u.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: r.name,
        cost: n.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${r.name} custa ${n.value.amount} ${n.value.resource} (${n.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, r = "PE") {
      const n = q("Nenhum ator encontrado para configurar custo customizado.");
      if (!n) return;
      const o = H(n);
      if (o) {
        if (!wa(t, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(l, "ritual.cost", {
          resource: r,
          amount: t
        }), u.info(`Custo customizado aplicado em ${o.name}.`, { resource: r, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = q("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = H(t);
      r && (await r.unsetFlag(l, "ritual.cost"), u.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = q("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = H(t);
      if (!r) return;
      const n = e.automationRegistry.require(un);
      if (!n.ok) {
        u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value), u.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = q("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const n = H(r);
      if (!n) return;
      if (!er(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(dn);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: gn(t)
      }), u.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = q("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = H(r);
      if (!n) return;
      if (!er(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(mn);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: St(t)
      }), u.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = q("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = H(t);
      r && await Ta(e, t, r);
    }
  };
}
async function Ta(e, t, r) {
  const n = Ct(r);
  if (!n.ok) {
    u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: yn(),
    item: r,
    targets: Et()
  });
  if (!o.ok) {
    ka(o.error);
    return;
  }
  u.info("Automação de ritual executada com sucesso.", K(o.value.context));
}
function ka(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    u.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    u.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  u.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function q(e) {
  const t = ge.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function H(e) {
  const t = cn(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function wa(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function er(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Ca = ["disabled", "ask", "automatic"], $a = ["buttons", "confirm"], An = "ask";
function _a(e) {
  return typeof e == "string" && Ca.includes(e);
}
function Ia(e) {
  return typeof e == "string" && $a.includes(e);
}
function Sa(e) {
  return _a(e) ? e : Ia(e) ? "ask" : An;
}
const Ea = ["keep", "replace"], bn = "keep", Pa = !0, N = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function La() {
  game.settings.register(l, N.executionMode, {
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
    default: An
  }), game.settings.register(l, N.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: bn
  }), game.settings.register(l, N.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Pa
  }), game.settings.register(l, N.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function tr() {
  const e = Sa(game.settings.get(l, N.executionMode)), t = Tn(game.settings.get(l, N.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: Rn()
  };
}
function Na() {
  return Tn(game.settings.get(l, N.systemCardMode));
}
function Rn() {
  return game.settings.get(l, N.ritualCastingCheckEnabled) === !0;
}
async function V(e) {
  await game.settings.set(l, N.executionMode, e);
}
function Tn(e) {
  return Ea.includes(e) ? e : bn;
}
function Da(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await V("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await V("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await V(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await V("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await V("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await V("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await V("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const va = [
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
function Oa(e) {
  return {
    phases() {
      return va;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = qe("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = Xo(t);
      if (!r) {
        u.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await rr(e, t, r);
    },
    async runSelectedItemAutomation() {
      await this.runFirstAutomation();
    },
    async runItemAutomationByUuid(t) {
      if (!t || typeof t != "string") {
        ui.notifications?.warn("Paranormal Toolkit: UUID inválido.");
        return;
      }
      const r = await fromUuid(t);
      if (!xa(r)) {
        u.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = Fa(r) ?? qe("Nenhum ator encontrado para executar automação do item.");
      n && await rr(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = qe("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = Qo(t);
      if (!r) {
        u.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(fn);
        if (!n.ok) {
          u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(r, n.value), u.info(`Preset de teste aplicado ao item: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${r.name}.`);
      } catch (n) {
        u.error("Falha ao configurar automação de teste no item.", n), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function rr(e, t, r) {
  const n = Ct(r);
  if (!n.ok) {
    u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: yn(),
    item: r,
    targets: Et()
  });
  if (!o.ok) {
    Ma(o.error);
    return;
  }
  u.info("Automação executada com sucesso.", K(o.value.context));
}
function Ma(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    u.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    u.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  u.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function qe(e) {
  const t = ge.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Fa(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function xa(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ua(e) {
  const t = ia(e), r = Jo(e), n = Ra(e), o = Oa(e), a = la(), i = Da(e);
  return {
    actor: t,
    automation: r,
    ritual: n,
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
function Ba(e) {
  return {
    list: () => e.listConditions(),
    get: (t) => {
      const r = e.getCondition(t);
      return r.ok ? r.value : null;
    },
    applyToActor: (t, r, n = {}) => e.applyCondition({
      actor: t,
      conditionId: r,
      duration: n.duration,
      originUuid: n.originUuid,
      source: n.source ?? "api.applyToActor",
      refreshExisting: n.refreshExisting
    }),
    removeFromActor: (t, r) => e.removeCondition({
      actor: t,
      conditionId: r
    }),
    applyToSelectedTokens: async (t, r = {}) => {
      const n = nr();
      if (n.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const o = await Promise.all(
        n.map(
          (a) => e.applyCondition({
            actor: a,
            conditionId: t,
            duration: r.duration,
            originUuid: r.originUuid,
            source: r.source ?? "api.applyToSelectedTokens",
            refreshExisting: r.refreshExisting
          })
        )
      );
      return ja(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const r = nr();
      if (r.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para remover a condição."), [];
      const n = await Promise.all(
        r.map(
          (o) => e.removeCondition({
            actor: o,
            conditionId: t
          })
        )
      );
      return qa(n), n;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function nr() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const r of e) {
    const n = r.actor ?? r.document?.actor ?? null;
    if (!n) continue;
    const a = n.uuid ?? null ?? n.id ?? n.name ?? `selected-${t.size}`;
    t.set(a, n);
  }
  return Array.from(t.values());
}
function ja(e) {
  let t = 0;
  for (const r of e) {
    if (r.ok) {
      t += 1, r.value.warning && ui.notifications?.warn(`Paranormal Toolkit: ${r.value.warning}`);
      continue;
    }
    ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
  }
  t > 0 && ui.notifications?.info(`Paranormal Toolkit: condição aplicada em ${t} ator(es).`);
}
function qa(e) {
  let t = 0;
  for (const r of e) {
    if (r.ok) {
      t += r.value.removed;
      continue;
    }
    ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
  }
  ui.notifications?.info(`Paranormal Toolkit: ${t} efeito(s) removido(s).`);
}
function Ha(e) {
  const t = {
    services: e,
    ordem: e.ordem,
    resources: e.resources,
    ritualCosts: e.ritualCosts,
    automation: e.automation,
    automationRegistry: e.automationRegistry,
    automationBinder: e.automationBinder,
    workflow: e.workflow,
    itemUseIntegration: e.itemUseIntegration,
    conditions: Ba(e.conditions),
    debug: Ua(e)
  }, r = globalThis;
  return r[l] = t, r.ParanormalToolkit = t, t;
}
class or {
  static isSupportedSystem() {
    return game.system.id === Mo;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Va() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: X(t.id),
    actorId: X(t.actor?.id),
    sceneId: X(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function kn() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, r = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: X(e.id),
    actorId: X(t?.id),
    sceneId: X(e.scene?.id),
    name: r
  };
}
function Ga(e, t = kn()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function za(e) {
  if (!Ya(e)) return null;
  const t = e.getFlag(l, "workflow");
  return Ka(t) ? t : null;
}
function Wa() {
  return `flags.${l}.workflow`;
}
function ar(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${l}`), r = foundry.utils.getProperty(e, `_source.flags.${l}`);
  return t !== void 0 || r !== void 0;
}
function ir(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return it(t) || it(r);
}
function Ka(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Ya(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function X(e) {
  return it(e) ? e : null;
}
function it(e) {
  return typeof e == "string" && e.length > 0;
}
function Qa() {
  const e = (t, r) => {
    Xa(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Xa(e, t) {
  const r = za(e);
  if (!r || r.targets.length === 0) return;
  const n = Ja(t);
  if (!n || n.querySelector(`.${l}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(Za(r));
}
function Za(e) {
  const t = document.createElement("section");
  t.classList.add(`${l}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(sr("Origem", e.source.name)), t.append(sr("Alvo", e.targets.map((n) => n.name).join(", "))), t;
}
function sr(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${l}-chat-enrichment__row`);
  const n = document.createElement("span");
  n.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, r.append(n, o), r;
}
function Ja(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function ei() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!ti(n) || !ri(e) || ar(e) || ar(t)) return;
    const o = Va();
    if (o.length === 0 || !ir(e) && !ir(t)) return;
    const a = kn();
    e.updateSource({
      [Wa()]: Ga(o, a)
    }), u.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function ti(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function ri(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let cr = !1, He = !1, Ve = !1, ke = null;
const ni = 1e3, oi = 750, ai = 1e3;
function ii(e) {
  cr || (Hooks.on("combatTurnChange", (t) => {
    ci(e, lr(t));
  }), Hooks.on("deleteCombat", (t) => {
    li(e, lr(t));
  }), cr = !0, si(e));
}
function si(e) {
  ve() && (He || (He = !0, globalThis.setTimeout(() => {
    He = !1, Pt(e, "ready");
  }, ni)));
}
function ci(e, t) {
  ve() && t && (ke && globalThis.clearTimeout(ke), ke = globalThis.setTimeout(() => {
    ke = null, Pt(e, "combat-turn-change", t);
  }, oi));
}
function li(e, t) {
  ve() && t && (Ve || (Ve = !0, globalThis.setTimeout(() => {
    Ve = !1, Pt(e, "combat-deleted", t);
  }, ai)));
}
async function Pt(e, t, r) {
  if (ve())
    try {
      const n = await e.cleanupExpiredConditions({
        reason: t,
        combatId: r ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      n.removedEffects > 0 && u.info(
        `Condition Engine removeu ${n.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const o of n.failures)
        u.warn(o.message);
    } catch (n) {
      u.warn("Condition Engine não conseguiu limpar condições expiradas.", n);
    }
}
function ve() {
  return game.user?.isGM === !0;
}
function lr(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const wn = {
  enabled: "dice.animations.enabled"
};
function di() {
  game.settings.register(l, wn.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function mi() {
  return {
    enabled: game.settings.get(l, wn.enabled) === !0
  };
}
const fi = "chatCard", ur = "data-paranormal-toolkit-prompt-id", c = `${l}-item-use-prompt`, pi = `.${c}__title`, Cn = `.${c}__header`, gi = `.${c}__roll-card`, hi = `.${c}__roll-meta`, yi = `.${c}__roll-meta-pill`, Ai = `.${c}__resistance`, bi = `.${c}__resistance-header`, $n = `.${c}__resistance-description`, Ri = `.${c}__resistance-roll-button`, Ti = `.${c}__resistance-roll-result`, dr = `${c}__resistance-content`, _n = `.${c}__workflow-section`, In = `.${c}__workflow-roll`, Sn = `${c}__workflow-roll--dice-open`, En = `.${c}__workflow-roll-formula`, Pn = `${c}__workflow-roll-formula--toggle`, Lt = `.${c}__workflow-dice-tray`, ki = `.${c}__roll-detail-toggle`, wi = `.${c}__roll-detail-list`, Ci = `.${c}__ritual-element-badge`, $i = `.${c}__ritual-metadata`, _i = "casting-backlash", Ii = "data-paranormal-toolkit-action-section", Si = "data-paranormal-toolkit-prompt-id", Ei = "data-paranormal-toolkit-pending-id", mr = "data-paranormal-toolkit-casting-backlash-enhanced", fr = `.${c}`, Pi = `.${c}__workflow-section--casting`, Li = `.${c}__workflow-section-header`, Ni = `.${c}__workflow-notes`, Di = `[${Ii}="${_i}"]`, pr = `${c}__workflow-section-title-row`, vi = `${c}__workflow-section-header--casting-backlash`, Ln = `${c}__casting-backlash-button`;
function Oi(e) {
  for (const t of Mi(e))
    Fi(t), qi(t);
}
function Mi(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(fr) && t.add(e);
  for (const r of e.querySelectorAll(fr))
    t.add(r);
  return Array.from(t);
}
function Fi(e) {
  const t = e.querySelector(Di);
  if (!t) return;
  const r = xi(t);
  if (!r) return;
  const n = e.querySelector(`${Pi} ${Li}`);
  n && (n.classList.add(vi), Ui(n), Bi(r), n.append(r), t.remove());
}
function xi(e) {
  return e.querySelector(
    `button[${Ei}], button[${Si}]`
  );
}
function Ui(e) {
  const t = e.querySelector(`:scope > .${pr}`);
  if (t) return t;
  const r = document.createElement("div");
  r.classList.add(pr);
  const n = Array.from(e.childNodes);
  e.prepend(r);
  for (const o of n)
    o !== r && (o instanceof HTMLButtonElement && o.classList.contains(Ln) || r.append(o));
  return r;
}
function Bi(e) {
  if (e.getAttribute(mr) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", r = ji(t, e.disabled);
  e.classList.add(Ln), e.setAttribute(mr, "true"), e.setAttribute("title", r), e.setAttribute("aria-label", r);
}
function ji(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function qi(e) {
  for (const t of e.querySelectorAll(Ni)) {
    for (const r of Array.from(t.children))
      (r.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && r.remove();
    t.children.length === 0 && t.remove();
  }
}
function Hi(e) {
  for (const t of Array.from(e.querySelectorAll(_n)))
    for (const r of Array.from(t.querySelectorAll(`${ki}, ${wi}`)))
      r.remove();
}
function Vi(e) {
  for (const t of Array.from(e.querySelectorAll(Ai)))
    Gi(t);
}
function Gi(e) {
  const t = e.querySelector(bi), r = e.querySelector($n), n = e.querySelector(Ri), o = e.querySelector(Ti);
  if (!n || !t && !r && !o) return;
  const a = zi(e, n);
  t && t.parentElement !== a && a.append(t), r && r.parentElement !== a && a.append(r), o && o.parentElement !== a && !n.contains(o) && a.append(o), n.parentElement !== e && e.append(n);
}
function zi(e, t) {
  const r = e.querySelector(`.${dr}`);
  if (r) return r;
  const n = document.createElement("div");
  return n.classList.add(dr), e.insertBefore(n, t.parentElement === e ? t : e.firstChild), n;
}
function gr(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Nt() {
  const e = globalThis.game;
  return Oe(e) ? e : null;
}
function S(e, t) {
  const r = Wi(e, t);
  return _e(r);
}
function Wi(e, t) {
  return t.split(".").reduce((r, n) => Oe(r) ? r[n] : null, e);
}
function Ki(e, t) {
  const r = e.indexOf(":");
  return r < 0 || fe(e.slice(0, r)) !== fe(t) ? null : te(e.slice(r + 1));
}
function _e(e) {
  return typeof e == "string" ? te(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Oe(e) {
  return !!e && typeof e == "object";
}
function Yi(e) {
  return typeof e == "string";
}
function Me(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function te(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function fe(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function st(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function U(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Nn(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Qi(e) {
  for (const t of Array.from(e.querySelectorAll(gi))) {
    const r = ns(t);
    Xi(t), r && (Zi(t, r), Ji(t, r));
  }
}
function Xi(e) {
  for (const t of Array.from(e.querySelectorAll(hi)))
    t.remove();
}
function Zi(e, t) {
  const n = e.closest(`.${c}`)?.querySelector(Cn) ?? null, o = n?.querySelector(pi) ?? null, a = n ?? e, i = a.querySelector(Ci);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const s = i ?? document.createElement("span");
  if (s.className = Rs(t.elementTone), s.textContent = bs(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", s);
      return;
    }
    a.prepend(s);
  }
}
function Ji(e, t) {
  const r = es(e);
  ts(e, r);
  const n = rs(t);
  if (n.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${c}__ritual-metadata`);
  for (const i of n) {
    const s = document.createElement("span");
    s.classList.add(`${c}__ritual-metadata-chip`), s.textContent = i, o.append(s);
  }
  if (r) {
    const i = r.querySelector(`.${c}__summary`);
    if (i?.parentElement === r) {
      i.insertAdjacentElement("afterend", o);
      return;
    }
    r.append(o);
    return;
  }
  const a = e.querySelector(_n);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function es(e) {
  return e.closest(`.${c}`)?.querySelector(Cn) ?? null;
}
function ts(e, t) {
  const r = [e, t].filter((n) => n !== null);
  for (const n of r)
    for (const o of Array.from(n.querySelectorAll($i)))
      o.remove();
}
function rs(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${st(e.target)}` : null,
    e.duration ? `Duração: ${st(e.duration)}` : null,
    e.resistance ? `Resistência: ${Nn(e.resistance)}` : null
  ].filter(Me);
}
function ns(e) {
  const t = os(e), r = us(e), o = (t ? ls(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = Dt(S(o, "element")), s = v("op.elementChoices", i) ?? hr(z(a, "Elemento")) ?? hr(r.damageType), d = i ?? Ts(s), p = S(o, "circle") ?? z(a, "Círculo"), y = fs(o) ?? z(a, "Alvo"), b = ys(o, "duration", "op.durationChoices") ?? z(a, "Duração"), T = ds(e) ?? gs(o) ?? z(a, "Resistência"), R = ms(a) ?? r.cost, f = {
    elementLabel: s,
    elementTone: d,
    circle: p,
    cost: R,
    target: y,
    duration: b,
    resistance: T
  };
  return As(f) ? f : null;
}
function os(e) {
  const t = as(e);
  if (!t) return null;
  const r = t.getFlag?.(l, fi), n = ss(r);
  if (n.length === 0) return null;
  const o = is(e);
  if (o.size > 0) {
    const a = n.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return n.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function as(e) {
  const r = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return r ? Nt()?.messages?.get?.(r) ?? null : null;
}
function is(e) {
  const t = e.closest(`.${c}`) ?? e, r = /* @__PURE__ */ new Set();
  for (const n of Array.from(t.querySelectorAll(`[${ur}]`))) {
    const o = n.getAttribute(ur)?.trim();
    o && r.add(o);
  }
  return r;
}
function ss(e) {
  if (!Oe(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(cs).filter((r) => r !== null) : [];
}
function cs(e) {
  return Oe(e) ? {
    pendingId: _e(e.pendingId),
    actorId: _e(e.actorId),
    itemId: _e(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Yi) : []
  } : null;
}
function ls(e) {
  if (!e.itemId) return null;
  const t = Nt(), n = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return n || (t?.items?.get?.(e.itemId) ?? null);
}
function us(e) {
  let t = null, r = null;
  for (const n of Array.from(e.querySelectorAll(yi))) {
    const o = te(n.textContent);
    if (!o) continue;
    const a = Ki(o, "Tipo");
    a && (r = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: r };
}
function ds(e) {
  const t = te(e.querySelector($n)?.textContent);
  return t ? Nn(t) : null;
}
function z(e, t) {
  const r = fe(t);
  for (const n of e) {
    const o = n.indexOf(":");
    if (!(o < 0 || fe(n.slice(0, o)) !== r))
      return te(n.slice(o + 1));
  }
  return null;
}
function ms(e) {
  const t = z(e, "Custo") ?? z(e, "PE");
  return t || (e.map(te).find((r) => typeof r == "string" && /\b(P[ED]|PE|PD)\b/iu.test(r)) ?? null);
}
function fs(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return ps(e) ?? v("op.targetChoices", t) ?? "Área";
  const r = v("op.targetChoices", t) ?? U(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, r].filter(Me).join(" ");
}
function ps(e) {
  const t = S(e, "area.name"), r = S(e, "area.size"), n = S(e, "area.type"), o = t ? v("op.areaChoices", t) ?? U(t) : null, a = n ? v("op.areaTypeChoices", n) ?? U(n) : null;
  return o ? r ? a ? `${o} ${r}m ${st(a)}` : `${o} ${r}m` : o : null;
}
function gs(e) {
  const t = S(e, "skillResis"), r = S(e, "resistance");
  if (!t || !r) return null;
  const n = v("op.skill", t) ?? U(t), o = hs(r);
  return [n, o].filter(Me).join(" ");
}
function hs(e) {
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
      return v("op.resistanceChoices", e) ?? U(e);
  }
}
function ys(e, t, r) {
  const n = S(e, t);
  return n ? v(r, n) ?? U(n) : null;
}
function As(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function bs(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Rs(e) {
  return [
    `${c}__ritual-element-badge`,
    e ? `${c}__ritual-element-badge--${e}` : null
  ].filter(Me).join(" ");
}
function Dt(e) {
  const t = fe(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function hr(e) {
  const t = Dt(e);
  return t ? v("op.elementChoices", t) ?? U(t) : e ? U(e) : null;
}
function Ts(e) {
  return Dt(e);
}
function v(e, t) {
  if (!t) return null;
  const r = `${e}.${t}`, n = Nt()?.i18n?.localize?.(r);
  return !n || n === r ? null : n;
}
const yr = "data-paranormal-toolkit-dice-toggle-enhanced";
function ks(e) {
  for (const t of Array.from(e.querySelectorAll(In)))
    Dn(t);
}
function ws(e) {
  const t = On(e.target);
  if (!t) return;
  const r = vt(t);
  r && (e.preventDefault(), vn(r, t));
}
function Cs(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = On(e.target);
  if (!t) return;
  const r = vt(t);
  r && (e.preventDefault(), vn(r, t));
}
function Dn(e) {
  const t = e.querySelector(Lt);
  if (!t) return;
  const r = e.querySelector(En);
  if (r && r.getAttribute(yr) !== "true" && (r.setAttribute(yr, "true"), r.classList.add(Pn), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", "false"), r.title = "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title), t.hidden = !0, !r.querySelector("i"))) {
    const n = document.createElement("i");
    n.classList.add("fa-solid", "fa-chevron-down"), n.setAttribute("aria-hidden", "true"), r.append(n);
  }
}
function vn(e, t) {
  const r = e.querySelector(Lt);
  if (!r) return;
  const n = !e.classList.contains(Sn);
  $s(e, t, r, n);
}
function $s(e, t, r, n) {
  e.classList.toggle(Sn, n), r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.title = n ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !n), o.classList.toggle("fa-chevron-up", n));
}
function On(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(En);
  if (!t) return null;
  const r = vt(t);
  return r ? (Dn(r), t.classList.contains(Pn) ? t : null) : null;
}
function vt(e) {
  const t = e.closest(In);
  return t && t.querySelector(Lt) ? t : null;
}
const Ar = `${l}-workflow-dice-toggle-styles`;
function _s() {
  if (document.getElementById(Ar)) return;
  const e = document.createElement("style");
  e.id = Ar, e.textContent = `
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
const Is = [0, 100, 500, 1500, 3e3];
let br = !1, Ge = null;
function Ss() {
  if (!br) {
    br = !0, _s(), Hooks.on("renderChatMessageHTML", (e, t) => {
      le(gr(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      le(gr(t));
    }), Hooks.once("ready", () => {
      le(document), Es();
    }), document.addEventListener("click", ws), document.addEventListener("keydown", Cs);
    for (const e of Is)
      globalThis.setTimeout(() => le(document), e);
  }
}
function Es() {
  Ge || !document.body || (Ge = new MutationObserver((e) => {
    for (const t of e)
      for (const r of Array.from(t.addedNodes))
        (r instanceof HTMLElement || r instanceof DocumentFragment) && le(r);
  }), Ge.observe(document.body, { childList: !0, subtree: !0 }));
}
function le(e) {
  e && (Hi(e), Qi(e), Vi(e), ks(e), Oi(e));
}
function Ps() {
  Ss();
}
const ue = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Mn = {
  PV: "system.attributes.hp"
}, ct = {
  PV: [ue.PV, Mn.PV],
  SAN: [ue.SAN],
  PE: [ue.PE],
  PD: [ue.PD]
}, lt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Ls {
  getResource(t, r) {
    const n = Rr(t, r);
    if (!n.ok)
      return m(n.error);
    const o = n.value, a = `${o}.value`, i = `${o}.max`, s = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, i), p = kr(t, r, a, s, "valor atual");
    if (p) return m(p);
    const y = kr(t, r, i, d, "valor máximo");
    return y ? m(y) : h({
      value: s,
      max: d
    });
  }
  async updateResourceValue(t, r, n) {
    const o = Rr(t, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: n });
  }
}
function Rr(e, t) {
  const r = Ns(e.type, t);
  if (r && Tr(e, r))
    return h(r);
  const n = ct[t].find(
    (o) => Tr(e, o)
  );
  return n ? h(n) : m({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Ds(e, t),
    path: ct[t].join(" | ")
  });
}
function Ns(e, t) {
  return e === "threat" ? Mn[t] ?? null : e === "agent" ? ue[t] : null;
}
function Tr(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function Ds(e, t) {
  const r = e.type ?? "unknown", n = ct[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function kr(e, t, r, n, o) {
  return n == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${o} de ${t} não encontrado: ${r}.`,
    path: r,
    value: n
  } : typeof n != "number" || !Number.isFinite(n) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${o} de ${t} em ${r}.`,
    path: r,
    value: n
  } : null;
}
class vs {
  isRitual(t) {
    return t.type === "ritual";
  }
  getCircle(t) {
    if (!this.isRitual(t))
      return m({
        reason: "not-a-ritual",
        message: `Item ${t.name ?? "sem nome"} não é um ritual.`,
        ritual: t
      });
    const r = this.readCircleFromKnownPaths(t);
    if (!r) {
      const i = lt.ritualItem.circleCandidates;
      return m({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: n, value: o } = r, a = Os(o);
    return a ? h(a) : m({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${n}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: n,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of lt.ritualItem.circleCandidates) {
      const n = foundry.utils.getProperty(t, r);
      if (n != null)
        return { path: r, value: n };
    }
    return null;
  }
}
function Os(e) {
  if (wr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (wr(r))
      return r;
  }
  return null;
}
function wr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Ms = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Fs {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const r = this.ritualAdapter.getCircle(t.ritual);
    if (!r.ok)
      return m({
        ...r.error,
        actor: t.actor
      });
    const n = r.value, o = xs(t.ritual, n);
    return o.ok ? o.value ? h(o.value) : h({
      resource: "PE",
      amount: Ms[n],
      source: "default-by-circle",
      circle: n
    }) : m(o.error);
  }
}
function xs(e, t) {
  const r = e.getFlag(l, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Us(r) ? {
    ok: !0,
    value: {
      resource: r.resource,
      amount: r.amount,
      source: "custom-flag",
      circle: t
    }
  } : {
    ok: !1,
    error: {
      reason: "invalid-custom-cost",
      message: `Custo customizado do ritual ${e.name ?? "sem nome"} é inválido.`,
      ritual: e,
      value: r
    }
  };
}
function Us(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const ze = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Bs(e) {
  if (!zs(e.item)) return null;
  const t = ut(e.actor) ? e.actor : js(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Hs(e.token) ?? qs(t),
    targets: Et(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function js(e) {
  const t = e;
  return ut(t.actor) ? t.actor : ut(e.parent) ? e.parent : null;
}
function qs(e) {
  const t = Vs(e) ?? Gs(e);
  return t ? Fn(t) : null;
}
function Hs(e) {
  return dt(e) ? Fn(e) : null;
}
function Vs(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return dt(r) ? r : (t.getActiveTokens?.() ?? []).find(dt) ?? null;
}
function Gs(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Fn(e) {
  const t = e.actor ?? null;
  return {
    tokenId: We(e.id),
    actorId: We(t?.id),
    sceneId: We(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function zs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ut(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function dt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function We(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Ws {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(ze.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, u.info(`${ze.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = Bs(Ks(t));
    if (!r) {
      u.warn(`${ze.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function Ks(e) {
  return e && typeof e == "object" ? e : {};
}
class Ys {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return Ke("missing-item-patch");
    if (t.type !== "ritual") return Ke("unsupported-item-type");
    const o = Qs(n);
    return Object.keys(o).length === 0 ? Ke("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Qs(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (w(t, "system.circle", r.circle), w(t, "system.element", r.element), w(t, "system.target", r.target), w(t, "system.targetQtd", r.targetQuantity), w(t, "system.execution", r.execution), w(t, "system.range", r.range), w(t, "system.duration", r.duration), w(t, "system.skillResis", r.resistanceSkill), w(t, "system.resistance", r.resistance), w(t, "system.studentForm", r.studentForm), w(t, "system.trueForm", r.trueForm)), t;
}
function w(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function Ke(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Xs {
  constructor(t) {
    this.resourceAdapter = t;
  }
  resourceAdapter;
  getActorSnapshot(t) {
    const r = this.getResources(t);
    return {
      id: t.id ?? null,
      name: t.name ?? "Ator sem nome",
      type: t.type ?? "unknown",
      resources: r.values,
      resourceErrors: r.errors,
      ritualDT: this.getRitualDT(t)
    };
  }
  getRitualDT(t) {
    return this.getNumber(t, lt.ritual.dt, 0);
  }
  getResources(t) {
    const r = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, n = [];
    for (const o of ["PV", "SAN", "PE", "PD"]) {
      const a = this.resourceAdapter.getResource(t, o);
      a.ok ? r[o] = a.value : n.push(a.error);
    }
    return { values: r, errors: n };
  }
  getNumber(t, r, n) {
    const o = foundry.utils.getProperty(t, r);
    return typeof o == "number" && Number.isFinite(o) ? o : n;
  }
}
class Zs {
  async applyPreset(t, r, n = {}) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: r.id,
        presetVersion: r.version,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: n.definition ?? r.automation
    };
    return await this.writeAutomationFlag(t, o), o;
  }
  async applyManualDefinition(t, r, n = r.label) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: n,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: r
    };
    return await this.writeAutomationFlag(t, o), o;
  }
  async clear(t) {
    await t.unsetFlag(l, "automation");
  }
  async writeAutomationFlag(t, r) {
    await this.clear(t), await t.setFlag(l, "automation", r);
  }
}
class Js {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = ec(t);
    return r.ok ? this.presets.has(t.id) ? m({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Ye(t)), h(t)) : r;
  }
  registerMany(t) {
    const r = [];
    for (const n of t) {
      const o = this.register(n);
      if (!o.ok)
        return o;
      r.push(o.value);
    }
    return h(r);
  }
  get(t) {
    const r = this.presets.get(t);
    return r ? Ye(r) : null;
  }
  require(t) {
    const r = this.get(t);
    return r ? h(r) : m({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(Ye);
  }
  findForItem(t) {
    return this.list().map((r) => tc(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function ec(e) {
  return !Qe(e.id) || !Qe(e.version) || !Qe(e.label) ? m({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? m({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : h(e);
}
function tc(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = rc(o, t);
    if (!a.matches)
      return null;
    n += a.score, r.push(a.reason);
  }
  return {
    preset: e,
    score: n,
    reasons: r
  };
}
function rc(e, t) {
  switch (e.type) {
    case "itemType": {
      const r = e.itemTypes.includes(t.type);
      return {
        matches: r,
        score: r ? 10 : 0,
        reason: `itemType:${t.type}`
      };
    }
    case "normalizedName": {
      const r = Cr(t.name), n = e.names.map(Cr).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = nc(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function Cr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function nc(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function Ye(e) {
  return structuredClone(e);
}
function Qe(e) {
  return typeof e == "string" && e.length > 0;
}
function Ie(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? m({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : h(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = Fe(e.amountFrom);
    if (!r)
      return m({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const n = t.rolls[r];
    if (!n)
      return m({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${r}.`
      });
    const o = Math.trunc(n.total);
    return !Number.isInteger(o) || o <= 0 ? m({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${r} não gerou um amount positivo.`
    }) : h(o);
  }
  return m({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Fe(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const oc = "dice-so-nice";
async function xn(e) {
  if (!mi().enabled || !ac()) return;
  const t = ic();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      u.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function ac() {
  return game.modules.get(oc)?.active === !0;
}
function ic() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function sc(e, t, r) {
  if (!$r(e.id) || !$r(e.formula))
    return m({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const n = new Roll(e.formula), o = await Promise.resolve(n.evaluate()), a = o.total;
    if (typeof a != "number" || !Number.isFinite(a))
      return m({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await xn(o);
    const s = {
      ...r.rollRequests[e.id] ?? Un(e, t),
      total: a,
      roll: o
    };
    return r.rolls[e.id] = s, h(s);
  } catch (n) {
    return m({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: n
    });
  }
}
function Un(e, t) {
  const r = e.intent ?? cc(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function cc(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function $r(e) {
  return typeof e == "string" && e.length > 0;
}
async function Se(e, t, r, n, o) {
  switch (n) {
    case "spend":
      return r !== "PE" && r !== "PD" ? we(t, r, n, o) : e.spend(t, r, o);
    case "damage":
      return r !== "PV" && r !== "SAN" ? we(t, r, n, o) : e.damage(t, r, o);
    case "heal":
      return r !== "PV" ? we(t, r, n, o) : e.heal(t, r, o);
    case "recover":
      return r !== "SAN" ? we(t, r, n, o) : e.recover(t, r, o);
  }
}
function we(e, t, r, n) {
  return m({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    resource: t,
    operation: r,
    reason: "invalid-resource-operation",
    message: `Operação ${r} não é válida para ${t}.`,
    requestedAmount: n
  });
}
function lc(e) {
  const { step: t, context: r, transaction: n, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = uc(t, r, n, o);
    r.damageInstances.push(i), a.emit("afterDamageResolution", r, {
      stepIndex: o,
      step: t,
      damage: i,
      resourceTransaction: n,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount,
        damageType: i.damageType
      }
    }), a.emit("afterApplyDamage", r, {
      stepIndex: o,
      step: t,
      damage: i,
      resourceTransaction: n,
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
    const i = dc(t, r, n, o);
    r.healingInstances.push(i), a.emit("afterApplyHealing", r, {
      stepIndex: o,
      step: t,
      healing: i,
      resourceTransaction: n,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount
      }
    });
  }
}
function uc(e, t, r, n) {
  const o = Fe(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: Bn(t.id, "damage", n, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: o ?? void 0,
    damageType: a?.damageType,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function dc(e, t, r, n) {
  const o = Fe(e.amountFrom);
  return {
    id: Bn(t.id, "healing", n, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: o ?? void 0,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Bn(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function mc(e, t, r) {
  const n = Fe(e.amountFrom), o = n ? t.rolls[n] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    amountFrom: e.amountFrom,
    rollId: n,
    rollIntent: o?.intent,
    damageType: o?.damageType
  };
}
function fc(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", r, { stepIndex: n, step: t, metadata: o }), jn("before", e), _r("before", e), _r("resolve", e);
}
function pc(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("apply", r, { stepIndex: n, step: t, metadata: o }), jn("apply", e);
}
function gc(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", r, { stepIndex: n, step: t, metadata: o });
}
function jn(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: i } = t, s = hc(e, r.operation);
  s && i.emit(s, n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function _r(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: i } = t;
  r.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function hc(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function yc(e, t, r) {
  try {
    return await e.createWorkflowSummaryMessage(r, t), h(void 0);
  } catch (n) {
    return m({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: n
    });
  }
}
async function Ac(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return bc(e, t);
    case "spendRitualCost":
      return Rc(e, t);
  }
}
async function bc(e, t) {
  const { context: r, resources: n } = e, o = Ie(t, r);
  return o.ok ? qn(await n.spend(r.sourceActor, t.resource, o.value), r) : m(o.error);
}
async function Rc(e, t) {
  const { context: r, resources: n, ritualCosts: o } = e, a = o.getCost({
    actor: r.sourceActor,
    ritual: r.item
  });
  if (!a.ok)
    return m({
      reason: "ritual-cost-failed",
      message: a.error.message,
      cause: a.error
    });
  const i = a.value;
  return r.ritualCosts.push({
    ...i,
    itemId: r.item.id ?? null,
    itemName: r.item.name ?? "Ritual sem nome"
  }), qn(await n.spend(r.sourceActor, i.resource, i.amount), r, t);
}
function qn(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), h(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), m({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Tc(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: o, execute: a } = e, i = kc(t);
  for (const d of i.before)
    o.emit(d, r, { stepIndex: n, step: t });
  const s = await a();
  if (!s.ok)
    return s;
  for (const d of i.after)
    o.emit(d, r, { stepIndex: n, step: t });
  return s;
}
function kc(e) {
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
class wc {
  constructor(t, r, n, o) {
    this.resources = t, this.ritualCosts = r, this.messages = n, this.lifecycle = o;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, r) {
    if (t.steps.length === 0)
      return m({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: r
      });
    for (const [n, o] of t.steps.entries()) {
      const a = await this.runStep(o, r, n);
      if (!a.ok)
        return a;
    }
    return h({ definition: t, context: r });
  }
  async runStep(t, r, n) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, r, n);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, r, n);
      default:
        return Tc({
          step: t,
          context: r,
          stepIndex: n,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(t, r, n)
        });
    }
  }
  async executeStep(t, r, n) {
    switch (t.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(t, r, n);
      case "rollFormula":
        return this.runRollFormulaStep(t, r, n);
      case "modifyResource":
        return this.runModifyResourceStep(t, r, n);
      case "chatCard":
        return this.runChatCardStep(t, r, n);
      default:
        return m({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: n,
          step: t,
          context: r
        });
    }
  }
  async runCostStep(t, r, n) {
    const o = await Ac({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? h(void 0) : m({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const o = Un(t, n);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, n, t);
    const a = await this.runRollFormulaStep(t, r, n);
    if (!a.ok)
      return a;
    const i = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, n, t, i), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: o, rollResult: i }), h(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const o = await sc(t, n, r);
    return o.ok ? h(void 0) : m({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const o = Ie(t, r);
    if (!o.ok)
      return m({ ...o.error, stepIndex: n, step: t, context: r });
    const a = mc(t, r, o.value);
    fc({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), pc({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    });
    const i = this.resolveActors(t.actor, r);
    if (i.length === 0)
      return m({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: n,
        step: t,
        context: r
      });
    for (const s of i) {
      const d = await Se(this.resources, s, t.resource, t.operation, o.value), p = this.handleResourceOperationResult(d, r, n, t);
      if (!p.ok)
        return p;
      lc({
        step: t,
        context: r,
        transaction: p.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return gc({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), h(void 0);
  }
  async runModifyResourceStep(t, r, n) {
    const o = Ie(t, r);
    if (!o.ok)
      return m({ ...o.error, stepIndex: n, step: t, context: r });
    const a = this.resolveActors(t.actor, r);
    if (a.length === 0)
      return m({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: n,
        step: t,
        context: r
      });
    for (const i of a) {
      const s = await Se(this.resources, i, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(s, r, n, t);
      if (!d.ok)
        return d;
    }
    return h(void 0);
  }
  async runChatCardStep(t, r, n) {
    const o = await yc(this.messages, t, r);
    return o.ok ? h(void 0) : m({ ...o.error, stepIndex: n, step: t, context: r });
  }
  handleResourceOperationResult(t, r, n, o) {
    return t.ok ? (r.resourceTransactions.push(t.value), h(t.value)) : m({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: n,
      step: o,
      context: r,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, r, n, o, a, i) {
    const s = Cc(t, r.intent);
    s && this.lifecycle.emit(s, n, {
      stepIndex: o,
      step: a,
      rollRequest: r,
      rollResult: i
    });
  }
  resolveActors(t, r) {
    switch (t) {
      case "self":
        return [r.sourceActor];
      case "target":
        return r.targets.flatMap((n) => n.actor ? [n.actor] : []);
    }
  }
}
function Cc(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class $c {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async spend(t, r, n) {
    return this.execute(t, r, "spend", n);
  }
  async damage(t, r, n) {
    return this.execute(t, r, "damage", n);
  }
  async heal(t, r, n) {
    return this.execute(t, r, "heal", n);
  }
  async recover(t, r, n) {
    return this.execute(t, r, "recover", n);
  }
  async execute(t, r, n, o) {
    if (!Number.isInteger(o) || o <= 0)
      return m({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: n,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: o
      });
    const a = this.adapter.getResource(t, r);
    if (!a.ok)
      return m({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: n,
        reason: a.error.reason,
        message: a.error.message,
        requestedAmount: o,
        path: a.error.path,
        value: a.error.value
      });
    const i = a.value, s = this.calculate(n, i, o);
    if (!s.ok)
      return m({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: n,
        reason: s.error.reason,
        message: s.error.message,
        requestedAmount: o,
        current: i.value,
        required: o
      });
    const { afterValue: d, appliedAmount: p } = s.value, y = {
      value: d,
      max: i.max
    };
    try {
      d !== i.value && await this.adapter.updateResourceValue(t, r, d);
    } catch (b) {
      return m({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: n,
        reason: "update-failed",
        message: `Falha ao atualizar ${r} no ator.`,
        requestedAmount: o,
        current: i.value,
        required: o,
        cause: b
      });
    }
    return h({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: r,
      operation: n,
      requestedAmount: o,
      appliedAmount: p,
      before: i,
      after: y
    });
  }
  calculate(t, r, n) {
    switch (t) {
      case "spend":
        return r.value < n ? m({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${r.value}; custo: ${n}.`
        }) : h({
          afterValue: r.value - n,
          appliedAmount: n
        });
      case "damage": {
        const o = Math.max(0, r.value - n);
        return h({
          afterValue: o,
          appliedAmount: r.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(r.max, r.value + n);
        return h({
          afterValue: o,
          appliedAmount: o - r.value
        });
      }
    }
  }
}
function Hn(e) {
  return {
    id: _c(),
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
function _c() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ic {
  constructor(t, r) {
    this.automation = t, this.hooks = r;
  }
  automation;
  hooks;
  lastContext = null;
  getLastContext() {
    return this.lastContext;
  }
  getLastDebugSnapshot() {
    return K(this.lastContext);
  }
  async runAutomation(t, r) {
    const n = Hn(r);
    this.lastContext = n, this.hooks.emit("created", n, {
      metadata: {
        definitionLabel: t.label,
        itemId: n.item.id ?? null,
        itemName: n.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", n), this.hooks.emit("resolveTargets", n, {
      metadata: {
        targetCount: n.targets.length
      }
    });
    const o = await this.automation.run(t, n);
    return o.ok ? (this.hooks.emit("completed", n), o) : (this.emitFailed(n, o.error), o);
  }
  emitFailed(t, r) {
    this.hooks.emit("failed", t, {
      stepIndex: r.stepIndex,
      step: r.step,
      metadata: {
        reason: r.reason,
        message: r.message
      }
    });
  }
}
class Sc {
  emit(t, r, n = {}) {
    const o = {
      phase: t,
      context: r,
      stepIndex: n.stepIndex,
      step: n.step,
      rollRequest: n.rollRequest,
      rollResult: n.rollResult,
      damage: n.damage,
      healing: n.healing,
      resourceTransaction: n.resourceTransaction,
      metadata: n.metadata
    };
    return r.phases.push(t), r.lifecycleEvents.push({
      phase: t,
      stepIndex: n.stepIndex,
      stepType: n.step?.type,
      rollId: n.rollRequest?.id ?? n.rollResult?.id,
      rollIntent: n.rollRequest?.intent ?? n.rollResult?.intent,
      damageId: n.damage?.id,
      healingId: n.healing?.id,
      resourceOperation: n.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${l}.workflow.${t}`, o), Hooks.callAll(`${l}.workflow.phase`, o), o;
  }
}
class Ec {
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
    const r = at();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Pc(),
      flags: {
        ...t.flags,
        [l]: {
          ...Lc(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && u.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = at();
    if (!n.enabled)
      return;
    const o = r.notification ?? Ir(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, o);
  }
  emitConsole(t, r) {
    const n = Ir(r);
    switch (t) {
      case "info":
        u.info(n, r.data ?? "");
        return;
      case "warn":
        u.warn(n, r.data ?? "");
        return;
      case "error":
        u.error(n, r.data ?? "");
        return;
    }
  }
  emitUi(t, r) {
    switch (t) {
      case "info":
        ui.notifications?.info(`Paranormal Toolkit: ${r}`);
        return;
      case "warn":
        ui.notifications?.warn(`Paranormal Toolkit: ${r}`);
        return;
      case "error":
        ui.notifications?.error(`Paranormal Toolkit: ${r}`);
        return;
    }
  }
}
function Ir(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Pc() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Lc(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function Nc(e) {
  const t = Dc(e?.rounds);
  if (!t)
    return {
      duration: {},
      requestedRounds: null,
      combatDurationApplied: !1,
      combatId: null,
      startRound: null,
      startTurn: null,
      warning: null
    };
  const r = vc();
  if (!r?.id || !Vn(r.round))
    return {
      duration: {},
      requestedRounds: t,
      combatDurationApplied: !1,
      combatId: null,
      startRound: null,
      startTurn: null,
      warning: `Duração de ${t} rodada(s) ignorada porque não há combate ativo.`
    };
  const n = Oc(r.turn) ? r.turn : 0;
  return {
    duration: {
      rounds: t,
      startRound: r.round,
      startTurn: n,
      combat: r.id
    },
    requestedRounds: t,
    combatDurationApplied: !0,
    combatId: r.id,
    startRound: r.round,
    startTurn: n,
    warning: null
  };
}
function Dc(e) {
  return Vn(e) ? Math.trunc(e) : null;
}
function vc() {
  return game.combat ?? null;
}
function Vn(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Oc(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class Mc {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const r = this.registry.get(t);
    return r.ok ? h(r.value) : m({
      conditionId: t,
      reason: "condition-not-found",
      message: r.error.message
    });
  }
  async applyCondition(t) {
    const r = this.registry.get(t.conditionId);
    if (!r.ok)
      return m({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "condition-not-found",
        message: r.error.message
      });
    const n = t.actor;
    if (!qc(n))
      return m({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = r.value, a = Nc(t.duration), i = Fc(o, t, a), d = t.refreshExisting ?? !0 ? Hc(n, o.id) : null;
    if (d)
      try {
        return await Promise.resolve(d.update?.(i)), h(Sr(n, o, d.id ?? null, !1, !0, a));
      } catch (p) {
        return m({
          actor: n,
          actorId: n.id ?? null,
          actorName: n.name ?? "Ator sem nome",
          conditionId: o.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${o.label} em ${n.name ?? "ator sem nome"}.`,
          cause: p
        });
      }
    try {
      const y = (await n.createEmbeddedDocuments("ActiveEffect", [i]))[0]?.id ?? null;
      return h(Sr(n, o, y, !0, !1, a));
    } catch (p) {
      return m({
        actor: n,
        actorId: n.id ?? null,
        actorName: n.name ?? "Ator sem nome",
        conditionId: o.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${o.label} em ${n.name ?? "ator sem nome"}.`,
        cause: p
      });
    }
  }
  async removeCondition(t) {
    const r = t.actor;
    if (!r || typeof r != "object")
      return m({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: "Ator inválido para remover condição."
      });
    const n = zn(r, t.conditionId);
    let o = 0;
    try {
      for (const a of n)
        await Er(r, a) === "deleted" && (o += 1);
    } catch (a) {
      return m({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "delete-failed",
        message: `Falha ao remover condição ${t.conditionId} de ${r.name ?? "ator sem nome"}.`,
        cause: a
      });
    }
    return h({
      actor: r,
      actorId: r.id ?? null,
      actorName: r.name ?? "Ator sem nome",
      conditionId: t.conditionId,
      removed: o
    });
  }
  async cleanupExpiredConditions(t = {}) {
    const r = zc(), n = [];
    let o = 0, a = 0;
    for (const i of r) {
      const s = Ot(i);
      o += s.length;
      for (const d of s) {
        if (!Uc(d, t)) continue;
        const p = Gn(d);
        try {
          await Er(i, d) === "deleted" && (a += 1);
        } catch (y) {
          n.push({
            actorId: i.id ?? null,
            actorName: i.name ?? "Ator sem nome",
            effectId: d.id ?? null,
            conditionId: p.conditionId,
            message: `Falha ao remover condição expirada ${p.conditionId ?? d.name ?? "desconhecida"} de ${i.name ?? "ator sem nome"}.`,
            cause: y
          });
        }
      }
    }
    return {
      reason: t.reason ?? "manual",
      scannedActors: r.length,
      scannedEffects: o,
      removedEffects: a,
      failures: n
    };
  }
}
function Fc(e, t, r) {
  const n = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Xc(),
    requestedRounds: r.requestedRounds,
    combatDurationApplied: r.combatDurationApplied,
    combatId: r.combatId,
    startRound: r.startRound,
    startTurn: r.startTurn,
    deleteOnExpire: r.combatDurationApplied,
    expiresWithCombat: r.combatDurationApplied
  };
  return {
    name: e.label,
    icon: e.icon,
    description: e.description,
    origin: t.originUuid ?? void 0,
    disabled: !1,
    transfer: !1,
    changes: e.changes.map((o) => ({ ...o })),
    duration: xc(r.duration),
    flags: {
      [l]: n
    }
  };
}
function xc(e) {
  return {
    seconds: null,
    rounds: null,
    turns: null,
    startTime: null,
    startRound: null,
    startTurn: null,
    combat: null,
    ...e
  };
}
function Sr(e, t, r, n, o, a) {
  return {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    conditionId: t.id,
    conditionLabel: t.label,
    effectId: r,
    created: n,
    refreshed: o,
    requestedRounds: a.requestedRounds,
    combatDurationApplied: a.combatDurationApplied,
    warning: a.warning
  };
}
function Uc(e, t) {
  const r = Gn(e);
  if (!r.conditionId || !Bc(r)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && r.combatId === t.combatId);
  if (jc(e)) return !0;
  const n = Qc();
  return !n?.id || r.combatId && r.combatId !== n.id ? !0 : !de(r.startRound) || !de(r.requestedRounds) || !de(n.round) ? !1 : n.round >= r.startRound + r.requestedRounds;
}
function Bc(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && de(e.requestedRounds);
}
function jc(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const r = t.remaining;
  return typeof r == "number" && Number.isFinite(r) && r <= 0;
}
function Gn(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {};
  return {
    conditionId: mt(e, "conditionId"),
    requestedRounds: Pr(e, "requestedRounds") ?? ft(t.rounds),
    combatDurationApplied: Xe(e, "combatDurationApplied"),
    combatId: mt(e, "combatId") ?? Mt(t.combat),
    startRound: Pr(e, "startRound") ?? ft(t.startRound),
    deleteOnExpire: Xe(e, "deleteOnExpire"),
    expiresWithCombat: Xe(e, "expiresWithCombat")
  };
}
function qc(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Hc(e, t) {
  return zn(e, t)[0] ?? null;
}
function zn(e, t) {
  return Ot(e).filter((r) => Kc(r) === t);
}
async function Er(e, t) {
  const r = t.id ?? null, n = r ? Vc(e, r) : t;
  if (!n) return "missing";
  try {
    return await Promise.resolve(n.delete?.()), "deleted";
  } catch (o) {
    if (Gc(o)) return "missing";
    throw o;
  }
}
function Vc(e, t) {
  return Ot(e).find((r) => r.id === t) ?? null;
}
function Gc(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function zc() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const r of t.contents)
      Ce(e, r);
  typeof t?.forEach == "function" && t.forEach((r) => {
    Ce(e, r);
  });
  for (const r of Wc())
    Ce(e, r.actor), Ce(e, r.document?.actor);
  return Array.from(e.values());
}
function Ce(e, t) {
  if (!Yc(t)) return;
  const n = Mt(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(n, t);
}
function Wc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ot(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Kc(e) {
  return mt(e, "conditionId");
}
function mt(e, t) {
  return Mt(e.getFlag?.(l, t));
}
function Pr(e, t) {
  return ft(e.getFlag?.(l, t));
}
function Xe(e, t) {
  return e.getFlag?.(l, t) === !0;
}
function Mt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ft(e) {
  return de(e) ? Math.trunc(e) : null;
}
function Yc(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Qc() {
  return game.combat ?? null;
}
function de(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Xc() {
  return game.user?.id ?? null;
}
const Zc = {
  id: "vulnerable",
  label: "Vulnerável",
  icon: "icons/svg/downgrade.svg",
  description: "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.",
  definitionVersion: "1.0.0",
  changes: []
};
class Jc {
  definitions = /* @__PURE__ */ new Map();
  constructor(t) {
    for (const r of t)
      this.definitions.set(r.id, r);
  }
  list() {
    return Array.from(this.definitions.values()).map(Lr);
  }
  get(t) {
    const r = this.definitions.get(t);
    return r ? h(Lr(r)) : m({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
}
function el() {
  return new Jc([Zc]);
}
function Lr(e) {
  return {
    ...e,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
const tl = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Wn = `${l}-inline-roll-neutralized`, rl = `${l}-inline-roll-notice`, Ft = `data-${l}-inline-roll-neutralized`, Nr = `data-${l}-inline-roll-notice`, nl = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Dr(e) {
  const t = yl(e.message), r = await ol(e.message), n = al(t);
  return r.replacementCount + n.replacementCount > 0 && u.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: e.item.id ?? null,
    itemName: e.item.name ?? "Item sem nome",
    messageId: t,
    contentReplacementCount: r.replacementCount,
    renderedReplacementCount: n.replacementCount
  }), {
    messageId: t,
    contentUpdated: r.updated,
    contentReplacementCount: r.replacementCount,
    renderedReplacementCount: n.replacementCount
  };
}
async function ol(e) {
  const t = pl(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = il(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await gl(t, r.content), replacementCount: r.replacementCount };
}
function al(e) {
  const t = e ? hl(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = Kn(t);
  return r > 0 && Yn(dl(t)), { replacementCount: r };
}
function il(e) {
  const t = sl(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = Kn(r.content), o = t.replacementCount + n;
  return o === 0 ? { content: e, replacementCount: 0 } : (Yn(r.content), { content: r.innerHTML, replacementCount: o });
}
function sl(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, o) => (t += 1, ll(o.trim()))), replacementCount: t };
}
function Kn(e) {
  const t = cl(e);
  for (const r of t)
    r.replaceWith(ul(ml(r)));
  return t.length;
}
function cl(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(tl))
    r.getAttribute(Ft) !== "true" && t.add(r);
  return Array.from(t);
}
function ll(e) {
  return `<span class="${Wn}" ${Ft}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Al(e)}</span>`;
}
function ul(e) {
  const t = document.createElement("span");
  return t.classList.add(Wn), t.setAttribute(Ft, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Yn(e) {
  if (e.querySelector?.(`[${Nr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(rl), t.setAttribute(Nr, "true"), t.textContent = nl, e.append(t);
}
function dl(e) {
  return e.querySelector(".message-content") ?? e;
}
function ml(e) {
  const r = e.getAttribute("data-formula") ?? fl(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function fl(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function pl(e) {
  return e && typeof e == "object" ? e : null;
}
async function gl(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return u.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function hl(e) {
  const t = bl(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function yl(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Al(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function bl(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const vr = "occultism";
function Rl(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Tl(e) {
  const t = Rl(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await kl(e, vr);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await xn(r);
  const n = $l(r);
  return {
    skill: vr,
    skillLabel: "Ocultismo",
    roll: r,
    formula: Cl(r),
    total: n,
    difficulty: t,
    success: n >= t,
    diceBreakdown: _l(r)
  };
}
async function kl(e, t) {
  const r = e;
  if (typeof r.rollSkill != "function")
    return null;
  const n = await Promise.resolve(
    r.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return wl(n);
}
function wl(e) {
  return Or(e) ? e : Array.isArray(e) ? e.find(Or) ?? null : null;
}
function Or(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Cl(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function $l(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function _l(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(Il);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Il(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function Sl(e) {
  return {
    header: {
      eyebrow: wt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Dl(e.ritual)
    },
    forms: e.variantOptions.map((t) => El(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: Nl(e.automationStatus ?? "assisted")
  };
}
function El(e, t) {
  const r = Pl(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Ll(t) : "—",
    details: r
  };
}
function Pl(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Ll(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function Nl(e) {
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
function Dl(e) {
  const t = e.system, r = [Ol(t?.element), vl(t?.circle)].filter(Ml);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function vl(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Ol(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function Ml(e) {
  return typeof e == "string" && e.length > 0;
}
const Qn = ["base", "discente", "verdadeiro"];
function Xn(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Ee(e) {
  return typeof e == "string" && Qn.includes(e);
}
const { ApplicationV2: Fl } = foundry.applications.api;
class me extends Fl {
  constructor(t, r) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = r, this.model = Sl(t), this.selectedVariant = this.model.forms.find((n) => n.checked && n.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: me.onCast,
      cancel: me.onCancel
    }
  };
  static async request(t) {
    return new Promise((r) => {
      new me(t, r).render({ force: !0 });
    });
  }
  async _renderHTML(t, r) {
    const n = document.createElement("div");
    return n.className = "paranormal-toolkit-ritual-cast", n.innerHTML = this.renderContent(), n;
  }
  _replaceHTML(t, r, n) {
    r.replaceChildren(t);
    const o = r.querySelector(".paranormal-toolkit-ritual-cast") ?? r;
    Ul(o, (a) => {
      this.selectedVariant = a;
    }), Bl(o, (a) => {
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
          ${this.model.forms.map(xl).join("")}
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
    const r = Hl(t), n = jl(r, this.spendResource, this.selectedVariant);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function xl(e) {
  const t = e.checked ? "checked" : "", r = e.enabled ? "" : "disabled", n = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((a) => `<span>${C(a)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${n}"
      data-paranormal-toolkit-ritual-cast-form="${C(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${C(e.variant)}" ${t} ${r}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${C(e.label)}</strong>
        <em>${C(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function Ul(e, t) {
  const r = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of r)
    o.addEventListener("click", () => Mr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Mr(e, o, t));
    });
  const n = Zn(e);
  n && t(n);
}
function Mr(e, t, r) {
  const n = t.querySelector('input[name="variant"]');
  !n || n.disabled || !Ee(n.value) || (n.checked = !0, e.dataset.paranormalToolkitSelectedVariant = n.value, r(n.value), n.dispatchEvent(new Event("change", { bubbles: !0 })), Zn(e));
}
function Zn(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let r = null;
  for (const n of t) {
    const o = n.querySelector('input[name="variant"]'), a = o?.checked === !0;
    n.setAttribute("aria-checked", a ? "true" : "false"), a && Ee(o.value) && (r = o.value);
  }
  return r && (e.dataset.paranormalToolkitSelectedVariant = r), r;
}
function Bl(e, t) {
  const r = e.querySelector('input[name="spendResource"]');
  r && (t(r.checked), r.addEventListener("change", () => {
    t(r.checked);
  }));
}
function jl(e, t, r) {
  const n = ql(e) ?? r, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: n,
    spendResource: o
  };
}
function ql(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Ee(t)) return t;
  const r = e?.dataset.paranormalToolkitSelectedVariant;
  return Ee(r) ? r : null;
}
function Hl(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const r = t.closest(".paranormal-toolkit-ritual-cast");
    if (r) return r;
  }
  return null;
}
function C(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function Vl(e) {
  return me.request(e);
}
const xt = {
  label: "Padrão"
}, Gl = {
  label: "Discente",
  extraCost: 2
}, zl = {
  label: "Verdadeiro",
  extraCost: 5
};
class Wl {
  constructor(t, r, n) {
    this.workflow = t, this.resources = r, this.ritualCosts = n;
  }
  workflow;
  resources;
  ritualCosts;
  canHandle(t, r) {
    return t.item.type === "ritual" || r.steps.some((n) => n.type === "spendRitualCost");
  }
  async run(t, r) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const n = this.resolveCostPreview(t), o = wu(r), a = Ru(r, t.item, n, o), i = await Vl({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((k) => k.name),
      cost: n,
      defaultSpendResource: Eu(r),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const s = Kl(i), d = $u(r, t.item, s.variant, o), p = Rn();
    let y = null;
    if (p) {
      const k = await Ql(this.resources, t.actor, s, d, n);
      if (!k.ok)
        return {
          status: "failed",
          reason: k.reason,
          message: k.message
        };
      try {
        y = await Tl(t.actor);
      } catch (F) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: F instanceof Error ? F.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: F
        };
      }
    }
    const b = Yl(r, s, d, n, {
      includeCostSteps: !p
    });
    if (b.steps.length === 0) {
      const k = Cu(t, s), F = Fr(t.actor, y, d, n), Kt = Ur(r, s, d, n, k, y);
      return F.length > 0 ? {
        status: "ready",
        workflowContext: k,
        actions: F,
        summaryLines: Kt
      } : {
        status: "completed-without-actions",
        workflowContext: k,
        summaryLines: Kt
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
    const R = T.value.context, f = Zl(r, t, R), oe = Fr(t.actor, y, d, n), ae = Ur(r, s, d, n, R, y);
    if (!f.ok)
      return {
        status: "failed",
        reason: f.reason,
        message: f.message
      };
    const ie = [...oe, ...f.actions];
    return ie.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: R,
      summaryLines: ae
    } : {
      status: "ready",
      workflowContext: R,
      actions: ie,
      summaryLines: ae
    };
  }
  async applyAction(t) {
    return Se(this.resources, t.actor, t.resource, t.operation, t.amount);
  }
  resolveCostPreview(t) {
    if (!t.actor) return null;
    const r = this.ritualCosts.getCost({
      actor: t.actor,
      ritual: t.item
    });
    return r.ok ? r.value : null;
  }
}
function Kl(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function Yl(e, t, r, n, o) {
  const a = [], i = t.spendResource === !0;
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || Ut(s) && (!o.includeCostSteps || !i) || a.push(Xl(s, r));
  return o.includeCostSteps && i && n && Pu(r.extraCost) && a.push({
    type: "spendResource",
    actor: "self",
    resource: n.resource,
    amount: r.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: a
  };
}
async function Ql(e, t, r, n, o) {
  if (r.spendResource !== !0) return { ok: !0 };
  const a = ye(o, n);
  if (!a)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (a.amount <= 0) return { ok: !0 };
  const i = await e.spend(t, a.resource, a.amount);
  return i.ok ? { ok: !0 } : {
    ok: !1,
    reason: i.error.reason,
    message: i.error.message
  };
}
function Xl(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function Fr(e, t, r, n) {
  if (!t || t.success) return [];
  const o = ye(n, r);
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
function Zl(e, t, r) {
  const n = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const a = Ie(o, r);
    if (!a.ok)
      return {
        ok: !1,
        reason: a.error.reason,
        message: a.error.message
      };
    const i = su(o.actor, t);
    if (i.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const s of i)
      n.push(...Jl(e, o, s, a.value));
  }
  return { ok: !0, actions: n };
}
function Jl(e, t, r, n) {
  if (!nu(e, t))
    return [xr(t, r, n)];
  const o = iu();
  return Jn(e).map((a) => {
    const i = ou(n, a);
    return xr(t, r, i, {
      option: a,
      choiceGroupId: o
    });
  });
}
function xr(e, t, r, n) {
  const o = t.name ?? "Ator sem nome", a = ru(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: eu(e, o, r, n?.option),
    executedLabel: tu(e, o, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function eu(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function tu(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function ru(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function nu(e, t) {
  return t.operation === "damage" && t.resource === "PV" && Jn(e).length > 1;
}
function Jn(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function ou(e, t) {
  const r = e * t.multiplier, n = au(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function au(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function iu() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function su(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function Ur(e, t, r, n, o, a = null) {
  return [
    `Forma: ${Xn(t.variant)}`,
    lu(t, r, n),
    ...cu(a),
    ...Object.values(o.rolls).flatMap(uu),
    ...du(e.resistance),
    ...Au(r)
  ];
}
function cu(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function lu(e, t, r) {
  const n = ye(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function uu(e) {
  const r = [`${bu(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = mu(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${yu(e.damageType)}`), r;
}
function du(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function mu(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const r = [];
  let n = "+";
  for (const o of t) {
    if (!o || typeof o != "object") continue;
    const a = o;
    if (a.operator === "+" || a.operator === "-") {
      n = a.operator;
      continue;
    }
    const i = fu(a);
    i && (hu(r, i.operator ?? n, i.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function fu(e) {
  const t = pu(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : gu(e);
}
function pu(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function gu(e) {
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
function hu(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function yu(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Au(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function bu(e) {
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
function Ru(e, t, r, n) {
  return Qn.map((o) => {
    const a = eo(e, t, o, n), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? Xn(o),
      enabled: i,
      details: a ? Tu(a, r, n) : [],
      finalCostText: a ? ku(r, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function Tu(e, t, r) {
  const n = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? n.push(o.join(", ")) : r && n.push("efeito manual");
  const a = ye(t, e);
  return n.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), n;
}
function ye(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function ku(e, t) {
  const r = ye(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function wu(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Ut);
}
function Cu(e, t) {
  return Hn({
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
function $u(e, t, r, n) {
  return eo(e, t, r, n) ?? xt;
}
function eo(e, t, r, n) {
  const o = e.ritualForms?.[r] ?? null;
  return o || (n ? Iu(t, r) ? _u(r) : null : r === "base" ? xt : null);
}
function _u(e) {
  switch (e) {
    case "base":
      return xt;
    case "discente":
      return Gl;
    case "verdadeiro":
      return zl;
  }
}
function Iu(e, t) {
  if (t === "base") return !0;
  const r = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Su(foundry.utils.getProperty(e, r));
}
function Su(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Eu(e) {
  return e.steps.some(Ut);
}
function Ut(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Pu(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Lu(e, t) {
  const r = await Nu(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: vu(r),
    total: Ou(r),
    diceBreakdown: Mu(r)
  };
}
function to(e) {
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
async function Nu(e, t) {
  const r = e;
  if (typeof r.rollSkill != "function")
    return null;
  const n = await Promise.resolve(
    r.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return Du(n);
}
function Du(e) {
  return Br(e) ? e : Array.isArray(e) ? e.find(Br) ?? null : null;
}
function Br(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function vu(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Ou(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Mu(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(Fu);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Fu(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const ro = "itemUsePrompts", no = "chatCard", xe = "data-paranormal-toolkit-prompt-id", Ue = "data-paranormal-toolkit-pending-id", Bt = "data-paranormal-toolkit-executed-label", pt = "data-paranormal-toolkit-choice-group", oo = "data-paranormal-toolkit-skipped-label", jr = "data-paranormal-toolkit-action-section", qr = "data-paranormal-toolkit-detail-key", Hr = "data-paranormal-toolkit-roll-card", jt = "data-paranormal-toolkit-roll-detail-toggle", ao = "data-paranormal-toolkit-roll-detail-id", io = "data-paranormal-toolkit-resistance-roll-button", so = "data-paranormal-toolkit-resistance-skill", co = "data-paranormal-toolkit-resistance-skill-label", lo = "data-paranormal-toolkit-resistance-target-actor-id", uo = "data-paranormal-toolkit-resistance-target-name", mo = "data-paranormal-toolkit-resistance-roll-result", Vr = "data-paranormal-toolkit-system-card-replaced", xu = `[${Ue}]`, Uu = `[${jt}]`, Bu = `[${io}]`, gt = `${l}-chat-enrichment`, g = `${l}-item-use-prompt`, ju = `${g}__actions`, Gr = `${g}__details`, fo = `${g}__summary`, qu = `${g}__title`, po = `${g}__button--executed`, zr = `${g}__roll-card`;
let Wr = !1, ht = null;
const E = /* @__PURE__ */ new Map(), Hu = [0, 100, 500, 1500, 3e3], Vu = 3e4, Gu = [0, 100, 500, 1500, 3e3];
function zu(e) {
  if (ht = e, Wr) {
    Yr(e);
    return;
  }
  const t = (r, n) => {
    ho(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Wr = !0, Yr(e);
}
async function Kr(e) {
  const t = go(e);
  E.set(e.pendingId, t), await Vt(t) || _o(t), yo(e.pendingId);
}
async function Wu(e) {
  const t = go({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", E.set(e.pendingId, t), await Vt(t) || _o(t), yo(e.pendingId);
}
async function Ze(e, t) {
  const r = E.get(e);
  E.delete(e), r && await zd(r, t);
}
function qt(e) {
  const t = No();
  for (const r of t) {
    const n = M(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function Ku(e, t) {
  const r = qt(e);
  if (!r) return;
  const n = M(r.message), o = n[e];
  o && (n[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await re(r.message, n));
}
async function Yu(e, t, r) {
  if (!t) return;
  const n = qt(e);
  if (!n) return;
  const o = M(n.message);
  let a = !1;
  for (const [i, s] of Object.entries(o))
    i !== e && s.choiceGroupId === t && (o[i] = {
      ...s,
      executedLabel: r ?? s.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await re(n.message, o);
}
function go(e) {
  const t = B(e.context.message), r = e.context.targets.find((i) => Rt(i)), n = r ? Rt(r) : null, o = e.resistanceTargetActor ?? n, a = e.resistanceTargetName ?? r?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Td(e.context),
    executed: !1
  };
}
function ho(e, t, r) {
  Gd();
  const n = je(t);
  if (!n) return;
  const o = qd(e, n);
  o.length > 0 && Pe(n);
  for (const a of o)
    yt(n, a);
  Ro(n, r), At(n), bt(n);
}
function Yr(e) {
  for (const t of Gu)
    globalThis.setTimeout(() => {
      Qu(e);
    }, t);
}
function Qu(e) {
  for (const t of Xu()) {
    const r = Be(t);
    Zu(r) && ho(r, t, e);
  }
}
function Xu() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function Zu(e) {
  return e ? Gt(e) ? !0 : Kd(e).length > 0 : !1;
}
function yo(e) {
  const t = E.get(e);
  if (!t) return;
  const r = t.messageId ? Hd(t.messageId) : null;
  if (r) {
    en(r, t), Pe(r), yt(r, t), Qr(r), At(r), bt(r);
    return;
  }
  if (t.messageId) {
    kt(t);
    return;
  }
  const n = Vd(t);
  if (n) {
    en(n, t), Pe(n), yt(n, t), Qr(n), At(n), bt(n);
    return;
  }
  kt(t);
}
function Qr(e) {
  ht && Ro(e, ht);
}
function Pe(e) {
  const t = Ju();
  e.classList.toggle(`${g}--system-card-replaced`, t);
  const r = bo(e);
  if (!r || (r.classList.toggle(`${g}__host--system-card-replaced`, t), !t) || r.getAttribute(Vr) === "true") return;
  const n = r.querySelector(`.${gt}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(Vr, "true");
}
function Ju() {
  try {
    return Na() === "replace";
  } catch {
    return !1;
  }
}
function yt(e, t) {
  if (Pe(e), e.querySelector(`[${xe}="${ne(t.pendingId)}"]`)) return;
  const r = ed(e, t);
  rd(r, t), hd(r, yd(t)).append(Rd(t));
}
function ed(e, t) {
  const r = e.querySelector(`.${gt}`);
  if (r)
    return r;
  const n = document.createElement("section");
  n.classList.add(gt, g);
  const o = document.createElement("header");
  o.classList.add(`${g}__header`);
  const a = document.createElement("span");
  a.classList.add(`${g}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(qu), i.textContent = td(t);
  const s = document.createElement("span");
  return s.classList.add(fo), s.textContent = t.summary, o.append(a, i, s), n.append(o), wd(e).append(n), n;
}
function td(e) {
  const t = $(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function rd(e, t) {
  const r = t.summaryLines ?? [], n = Co(r, t);
  if (n) {
    nd(e, n, t);
    return;
  }
  Ad(e, r);
}
function nd(e, t, r) {
  if (e.querySelector(`[${Hr}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(zr, `${zr}--${t.intent}`), n.setAttribute(Hr, "true"), t.castingCheck && Xr(n, ad(t.castingCheck), r.pendingId, "casting"), od(t) && Xr(n, id(t), r.pendingId, "effect"), dd(n, t), md(n, t, r), gd(n, t), e.append(n);
}
function od(e) {
  return e.intent !== "casting";
}
function ad(e) {
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
function id(e) {
  const t = e.intent === "healing" ? "Cura" : e.intent === "damage" ? "Dano" : e.label, r = e.damageType ? `${e.damageType}` : null;
  return {
    kind: "effect",
    title: t,
    label: e.label,
    formula: e.formula,
    total: e.total,
    diceBreakdown: e.diceBreakdown,
    description: r,
    detailRows: [
      { label: "Fórmula", value: e.formula },
      ...e.diceBreakdown ? [{ label: "Dados", value: e.diceBreakdown }] : [],
      ...e.damageType ? [{ label: "Tipo", value: e.damageType }] : []
    ]
  };
}
function Xr(e, t, r, n) {
  const o = document.createElement("section");
  o.classList.add(
    `${g}__workflow-section`,
    `${g}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${g}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${g}__workflow-section-header`);
  const i = document.createElement("strong");
  if (i.textContent = t.title, a.append(i), t.statusLabel) {
    const s = document.createElement("span");
    s.classList.add(`${g}__workflow-section-status`), s.textContent = t.statusLabel, a.append(s);
  }
  if (o.append(a), t.description) {
    const s = document.createElement("span");
    s.classList.add(`${g}__workflow-section-description`), s.textContent = t.description, o.append(s);
  }
  sd(o, t), pd(o, t.detailRows, r, n, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function sd(e, t) {
  const r = document.createElement("div");
  r.classList.add(`${g}__workflow-roll`);
  const n = document.createElement("span");
  n.classList.add(`${g}__workflow-roll-formula`), n.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${g}__workflow-roll-total`), o.textContent = String(t.total), r.append(n, o);
  const a = cd(t.formula, t.diceBreakdown);
  a && r.append(a), e.append(r);
}
function cd(e, t) {
  const r = ld(t);
  if (r.length === 0) return null;
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-dice-tray`);
  for (const o of ud(r, e)) {
    const a = document.createElement("span");
    a.classList.add(`${g}__workflow-die`), o.active || a.classList.add(`${g}__workflow-die--inactive`), a.textContent = String(o.value), n.append(a);
  }
  return n;
}
function ld(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((n) => Number(n.trim())).filter((n) => Number.isFinite(n)).map((n) => Math.trunc(n)) : [];
}
function ud(e, t) {
  if (e.length <= 1) return e.map((n) => ({ value: n, active: !0 }));
  const r = t.toLowerCase();
  return r.includes("kh") ? Zr(e, "highest") : r.includes("kl") ? Zr(e, "lowest") : e.map((n) => ({ value: n, active: !0 }));
}
function Zr(e, t) {
  const r = t === "highest" ? Math.max(...e) : Math.min(...e);
  let n = !1;
  return e.map((o) => {
    const a = !n && o === r;
    return a && (n = !0), { value: o, active: a };
  });
}
function dd(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(mm);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__roll-meta`);
  for (const o of r) {
    const a = document.createElement("span");
    a.classList.add(`${g}__roll-meta-pill`), a.textContent = o, n.append(a);
  }
  e.append(n);
}
function md(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${g}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = fd(t, r);
  o.append(a), i && o.append(i);
  const s = document.createElement("span");
  s.classList.add(`${g}__resistance-description`), s.textContent = t.resistance, n.append(o, s), t.resistanceRollResult && n.append(Ao(t.resistanceRollResult)), e.append(n);
}
function fd(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${g}__resistance-roll-button`), r.setAttribute(xe, t.pendingId), r.setAttribute(io, "true"), r.setAttribute(so, e.resistanceSkill), r.setAttribute(co, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(lo, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(uo, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${g}__resistance-roll-button--rolled`), r.setAttribute(mo, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${g}__resistance-roll-fallback`), o.textContent = "d20", r.append(n, o), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function Ao(e) {
  const t = document.createElement("span");
  return t.classList.add(`${g}__resistance-roll-result`), t.textContent = ko(e), t;
}
function pd(e, t, r, n, o) {
  const a = t.filter((p) => p.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${r}-roll-details-${n}`, s = document.createElement("button");
  s.type = "button", s.classList.add(`${g}__roll-detail-toggle`), s.setAttribute(jt, i), s.setAttribute("aria-expanded", "false"), s.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${g}__roll-detail-list`), d.setAttribute(ao, i), d.hidden = !0;
  for (const p of a) {
    const y = document.createElement("dt");
    y.textContent = p.label;
    const b = document.createElement("dd");
    b.textContent = p.value, d.append(y, b);
  }
  e.append(s, d);
}
function gd(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__workflow-notes`);
  for (const n of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = n, r.append(o);
  }
  e.append(r);
}
function hd(e, t) {
  const r = `[${jr}="${ne(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const o = document.createElement("div");
  o.classList.add(ju), o.setAttribute(jr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${g}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function yd(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = Co(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Ad(e, t) {
  if (t.length === 0) return;
  const r = bd(e);
  for (const n of t) {
    const o = fm(n);
    if (r.querySelector(`[${qr}="${ne(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = n, a.setAttribute(qr, o), r.append(a);
  }
}
function bd(e) {
  const t = e.querySelector(`.${Gr}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(Gr), e.append(r), r;
}
function Rd(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${g}__button`), t.setAttribute(xe, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(po), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Ue, e.pendingId), t.setAttribute(Bt, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(pt, e.choiceGroupId), t.setAttribute(oo, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Td(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = kd(e);
  return `${t} → ${r}`;
}
function kd(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function wd(e) {
  return bo(e) ?? e;
}
function bo(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Ro(e, t) {
  const r = je(e);
  if (!r) return;
  const n = r.querySelectorAll(xu);
  for (const o of n)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Fd(o, t);
    }));
}
function At(e) {
  const t = je(e);
  if (!t) return;
  const r = t.querySelectorAll(Uu);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      Cd(t, n);
    }));
}
function bt(e) {
  const t = je(e);
  if (!t) return;
  const r = t.querySelectorAll(Bu);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      $d(t, n);
    }));
}
function Cd(e, t) {
  const r = t.getAttribute(jt);
  if (!r) return;
  const n = e.querySelector(`[${ao}="${ne(r)}"]`);
  if (!n) return;
  const o = n.hidden;
  n.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function $d(e, t) {
  const r = t.getAttribute(xe), n = t.getAttribute(so), o = t.getAttribute(co) ?? (n ? to(n) : "Resistência");
  if (!r || !n) return;
  const a = Sd(e, r), i = Ed(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const s = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Lu(i, n);
    await vd(d.roll);
    const p = {
      skill: n,
      skillLabel: o,
      formula: d.formula,
      total: d.total,
      targetName: i.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: d.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    _d(t, p), Id(t, p), Od(r, p), await Md(e, r, p);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1;
  }
}
function _d(e, t) {
  e.classList.add(`${g}__resistance-roll-button--rolled`), e.setAttribute(mo, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Id(e, t) {
  const r = e.closest(`.${g}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${g}__resistance-roll-result`), o = n ?? Ao(t);
  if (n) {
    n.textContent = ko(t);
    return;
  }
  r.append(o);
}
function Sd(e, t) {
  const r = E.get(t);
  if (r) return r;
  const n = Be(e);
  return M(n)[t] ?? null;
}
function Ed(e, t) {
  const r = e?.resistanceTargetActor;
  if (D(r)) return r;
  const o = e?.context?.targets.map(Rt).find(D) ?? null;
  if (o) return o;
  const a = t.getAttribute(lo) ?? e?.resistanceTargetActorId ?? null, i = a ? Ld(a) : null;
  return i || Nd(
    t.getAttribute(uo) ?? e?.resistanceTargetName ?? Pd(t)
  );
}
function Pd(e) {
  const r = e.closest(`.${g}`)?.querySelector(`.${fo}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const o = r.split(n), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function Rt(e) {
  const t = e.actor;
  if (D(t)) return t;
  const r = e.token, n = pe(r);
  if (n) return n;
  const o = e.document;
  return pe(o);
}
function pe(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (D(t)) return t;
  const r = e.document?.actor;
  return D(r) ? r : null;
}
function Ld(e) {
  const r = game.actors?.get?.(e);
  return D(r) ? r : To().map((a) => pe(a)).find((a) => a?.id === e) ?? null;
}
function Nd(e) {
  const t = Z(e);
  if (!t) return null;
  const r = To().filter((a) => Z(Dd(a)) === t).map((a) => pe(a)).find(D) ?? null;
  if (r) return r;
  const o = game.actors?.find?.((a) => D(a) && Z(a.name) === t);
  return D(o) ? o : null;
}
function To() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Dd(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : pe(e)?.name ?? null;
}
function Z(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function D(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ko(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function vd(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Od(e, t) {
  const r = E.get(e);
  r && (r.resistanceRollResult = t);
}
async function Md(e, t, r) {
  const n = Be(e);
  if (n)
    try {
      const o = M(n), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: r
      }, await re(n, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Be(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return O(n?.get?.(r));
}
async function Fd(e, t) {
  const r = e.getAttribute(Ue);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    wo(e, e.getAttribute(Bt) ?? "✓ Automação aplicada"), xd(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function wo(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(po), e.removeAttribute(Ue), e.removeAttribute(Bt);
}
function xd(e) {
  const t = e.getAttribute(pt);
  if (!t) return;
  const r = e.closest(`.${g}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${pt}="${ne(t)}"]`;
  for (const o of r.querySelectorAll(n)) {
    if (o === e) continue;
    const a = o.getAttribute(oo) ?? "✓ Outra opção escolhida";
    wo(o, a);
  }
}
function Co(e, t) {
  const r = e.map(Ht).filter(um), n = r.find((f) => f.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const o = $(e, "Forma"), a = $(e, "Custo"), i = $(e, "Dados") ?? $(e, `Dados (${n.label})`), s = $(e, "Tipo"), d = $(e, "Resistência"), p = $(e, "Resistência Perícia"), y = $(e, "Resistência Rótulo") ?? (p ? to(p) : null), b = $o(e, "Observação"), T = e.filter((f) => jd(f, n)), R = Ud(e);
  return {
    ...n,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: i,
    damageType: s,
    resistance: d,
    resistanceSkill: p,
    resistanceSkillLabel: y,
    notes: b,
    details: T,
    castingCheck: R,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function Ud(e) {
  const t = e.map(Ht).find((a) => a?.intent === "casting") ?? null, r = $(e, "Conjuração DT"), n = $(e, "Conjuração Resultado");
  if (!t || !r || !n) return null;
  const o = Number(r);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: $(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: n.toLowerCase() === "sucesso",
    diceBreakdown: $(e, "Dados (Conjuração)")
  } : null;
}
function Ht(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, n, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: r,
    formula: n,
    total: a,
    intent: Bd(r)
  } : null;
}
function Bd(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function $(e, t) {
  return $o(e, t)[0] ?? null;
}
function $o(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const o = n.slice(r.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function jd(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Ht(e) ? !1 : e.trim().length > 0;
}
function qd(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of E.values())
    Tt(n, e, t) && r.set(n.pendingId, n);
  for (const n of Wd(e))
    Tt(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, o) => n.createdAt - o.createdAt);
}
function Tt(e, t, r) {
  const n = B(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !Jr(r, "itemId", e.itemId) ? !1 : !e.actorId || Jr(r, "actorId", e.actorId);
}
function Jr(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${pm(t)}`;
  for (const o of e.querySelectorAll(`[${n}]`))
    if (o.getAttribute(n) === r)
      return !0;
  return !1;
}
function Hd(e) {
  const t = ne(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Vd(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Tt(e, null, t))
      return t;
  return null;
}
function Gd() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of E.entries())
    e - n.createdAt > t && E.delete(r);
}
async function en(e, t) {
  const r = Be(e);
  if (!r) return !1;
  try {
    const n = M(r);
    return n[t.pendingId] = zt(t, B(r)), await re(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function Vt(e) {
  const t = Eo(e);
  if (!t) return !1;
  try {
    const r = M(t);
    return r[e.pendingId] = zt(e, B(t)), await re(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function _o(e) {
  for (const t of Hu)
    globalThis.setTimeout(() => {
      kt(e);
    }, t);
}
async function kt(e) {
  const t = Eo(e);
  if (Gt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const n = await Vt(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function zd(e, t) {
  const r = So(e.context.message);
  if (r)
    try {
      const n = M(r), o = n[e.pendingId] ?? zt(e, B(r));
      n[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await re(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function Wd(e) {
  return Object.values(M(O(e))).filter(Ae);
}
function M(e) {
  if (!e) return {};
  const t = {}, r = Gt(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, o] of Object.entries(Io(e)))
    t[n] ??= o;
  return t;
}
function Kd(e) {
  return Object.values(Io(O(e))).filter(Ae);
}
function Io(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, ro);
  if (!J(t))
    return {};
  const r = {};
  for (const [n, o] of Object.entries(t))
    Ae(o) && (r[n] = o);
  return r;
}
async function re(e, t) {
  typeof e.setFlag == "function" && (await Qd(e, t), await Yd(e, t));
}
async function Yd(e, t) {
  await Promise.resolve(e.setFlag?.(l, ro, t));
}
function Gt(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, no);
  return cm(t) ? t : null;
}
async function Qd(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(Ae).sort((a, i) => a.createdAt - i.createdAt);
  if (r.length === 0) return;
  const n = r[0];
  if (!n) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...r.map((a) => a.createdAt)),
    messageId: n.messageId ?? B(e) ?? null,
    source: {
      actorId: n.actorId,
      actorName: Xd(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(l, no, o));
}
function Xd(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function zt(e, t) {
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
function So(e) {
  const t = O(e);
  if (t?.setFlag)
    return t;
  const r = Zd(e);
  if (r?.setFlag)
    return r;
  const n = B(e);
  if (!n) return null;
  const o = game.messages;
  return O(o?.get?.(n));
}
function Zd(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(O).find((r) => typeof r?.setFlag == "function") ?? null;
}
function Eo(e) {
  const t = So(e.context.message);
  if (t) return t;
  const r = e.messageId ? Jd(e.messageId) : null;
  if (r) return r;
  const n = No().slice().reverse();
  return n.find((o) => em(o, e)) ?? n.find((o) => tm(o, e)) ?? null;
}
function Jd(e) {
  const t = game.messages;
  return O(t?.get?.(e));
}
function em(e, t) {
  const r = B(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!Po(e, t)) return !1;
  const o = Lo(e);
  return !t.actorId || !o || o === t.actorId;
}
function tm(e, t) {
  if (!nm(e, t)) return !1;
  const r = Lo(e);
  return t.actorId && r === t.actorId ? !0 : Po(e, t);
}
function Po(e, t) {
  const r = Z(rm(e));
  if (!r) return !1;
  const n = Z(t.itemName);
  if (n && r.includes(n)) return !0;
  const o = Z(t.itemId);
  return !!(o && r.includes(o));
}
function rm(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Lo(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function nm(e, t) {
  const r = om(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= Vu;
}
function om(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function O(e) {
  return e && typeof e == "object" ? e : null;
}
function Ae(e) {
  return J(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && _(e.messageId) && _(e.itemId) && _(e.actorId) && _(e.itemName) && G(e.resistanceTargetActorId) && G(e.resistanceTargetName) && lm(e.resistanceRollResult) && am(e.actionPayload) && Je(e.title) && Je(e.buttonLabel) && Je(e.executedLabel) && G(e.choiceGroupId) && G(e.skippedLabel) && G(e.actionSectionId) && G(e.actionSectionTitle) && dm(e.summaryLines) : !1;
}
function am(e) {
  return e == null ? !0 : J(e) ? e.kind === "resource-operation" && _(e.actorId) && _(e.actorUuid) && typeof e.actorName == "string" && im(e.resource) && sm(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function im(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function sm(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function cm(e) {
  return J(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && _(e.messageId) && J(e.source) && _(e.source.actorId) && _(e.source.actorName) && _(e.source.itemId) && _(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Ae) : !1;
}
function lm(e) {
  return e == null ? !0 : J(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && G(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function um(e) {
  return e !== null;
}
function J(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function _(e) {
  return e === null || typeof e == "string";
}
function Je(e) {
  return e === void 0 || typeof e == "string";
}
function G(e) {
  return e == null || typeof e == "string";
}
function dm(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function mm(e) {
  return typeof e == "string" && e.length > 0;
}
function No() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(O).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(O).filter((n) => n !== null) : [];
}
function je(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function B(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function fm(e) {
  return e.trim().toLowerCase();
}
function pm(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ne(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const tn = 1e3;
class gm {
  constructor(t, r, n, o) {
    this.workflow = t, this.resources = r, this.debugOutput = o, this.ritualAssistant = new Wl(t, r, n);
  }
  workflow;
  resources;
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
      settings: tr(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = tr();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = Ct(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && hm(t.item) && r.executionMode === "ask") {
        await this.handleGenericRitual(t);
        return;
      }
      const o = n.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, o, n.error.reason), n.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: n.error.message,
        data: n.error
      });
      return;
    }
    if (await Dr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: tt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(t), r.executionMode) {
      case "ask":
        await this.handleAskMode(t, n.value);
        return;
      case "automatic":
        await this.executeAutomation(t, n.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const r = this.pendingExecutions.get(t);
    if (!r)
      return this.executePersistedPendingAutomation(t);
    if (r.kind === "workflow")
      return this.pendingExecutions.delete(t), await Ze(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const n = await this.ritualAssistant.applyAction(r.action);
    return n.ok ? (r.workflowContext.resourceTransactions.push(n.value), this.pendingExecutions.delete(t), await Ze(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(n), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = qt(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, o = bm(n);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const a = await Se(this.resources, o, n.resource, n.operation, n.amount);
    return a.ok ? (await Ku(t), await Yu(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (zu((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await Dr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: tt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, ym(t.item));
  }
  async handleAssistedRitual(t, r) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const n = await this.ritualAssistant.run(t, r);
    switch (n.status) {
      case "cancelled":
        this.setAttempt(t, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(t, "failed", n.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: n.message,
          data: n.cause ?? n
        }), ui.notifications?.warn(`Paranormal Toolkit: ${n.message}`);
        return;
      case "completed-without-actions":
        await this.registerCompletedRitualCard(t, n.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), u.info("Ritual assistido concluído sem ações pendentes.", K(n.workflowContext));
        return;
      case "ready":
        await this.registerAssistedResourceActions(t, n.workflowContext, n.actions, n.summaryLines);
        return;
    }
  }
  async resolveAlternativeResourceActions(t) {
    const r = t.action.choiceGroupId;
    if (!r) return;
    const n = Array.from(this.pendingExecutions.entries()).filter(([, o]) => o.kind === "resource-action" && o.action.choiceGroupId === r);
    for (const [o, a] of n)
      a.kind === "resource-action" && (this.pendingExecutions.delete(o), await Ze(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, r) {
    const n = rt();
    await Wu({
      pendingId: n,
      context: t,
      mode: "ask",
      title: "Paranormal Toolkit · Ritual",
      buttonLabel: "Ritual conjurado",
      executedLabel: "✓ Ritual conjurado",
      actionSectionId: "ritual-log",
      actionSectionTitle: "Registro",
      summaryLines: r
    });
  }
  async registerAssistedResourceActions(t, r, n, o) {
    let a;
    for (const i of n) {
      const s = rt();
      a ??= s, this.pendingExecutions.set(s, {
        kind: "resource-action",
        id: s,
        action: i,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await Kr({
        pendingId: s,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: i.label,
        executedLabel: i.executedLabel,
        choiceGroupId: i.choiceGroupId ?? null,
        skippedLabel: i.choiceGroupResolvedLabel ?? null,
        actionSectionId: i.actionSectionId,
        actionSectionTitle: i.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: i.actor,
        resistanceTargetActorId: i.actor.id ?? null,
        resistanceTargetName: i.actorName,
        actionPayload: Am(i)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), u.info("Ritual assistido preparado com ações pendentes.", K(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = rt();
    this.pendingExecutions.set(n, {
      kind: "workflow",
      id: n,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Kr({
      pendingId: n,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", n);
  }
  async executeAutomation(t, r, n) {
    this.setAttempt(t, "running");
    const o = await this.workflow.runAutomation(r, {
      sourceActor: t.actor,
      sourceToken: t.token,
      item: t.item,
      targets: t.targets,
      flags: {
        itemUse: {
          source: t.source,
          executionMode: n
        }
      }
    });
    if (!o.ok) {
      this.setAttempt(t, "failed", o.error.reason), this.handleAutomationFailure(o.error);
      return;
    }
    this.setAttempt(t, "completed"), u.info("Automação executada por uso normal de item.", K(o.value.context));
  }
  handleAutomationFailure(t) {
    const r = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      u.warn(r, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      u.error(r, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    u.warn(r, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    u.warn(`Ação assistida falhou: ${t.error.message}`, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const r = Date.now(), n = rn(t);
    for (const [a, i] of this.recentExecutionKeys.entries())
      r - i > tn && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(n);
    return o !== void 0 && r - o <= tn;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(rn(t), Date.now());
  }
  setAttempt(t, r, n, o) {
    this.lastAttempt = tt(t, r, n, o);
  }
}
function hm(e) {
  return e.type === "ritual";
}
function ym(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Am(e) {
  return {
    kind: "resource-operation",
    actorId: e.actor.id ?? null,
    actorUuid: e.actor.uuid ?? null,
    actorName: e.actorName,
    resource: e.resource,
    operation: e.operation,
    amount: e.amount
  };
}
function bm(e) {
  const t = e.actorUuid ? Rm(e.actorUuid) : null;
  if (ee(t)) return t;
  const r = e.actorId ? Tm(e.actorId) : null;
  return r || km(e.actorName);
}
function Rm(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Tm(e) {
  const r = game.actors?.get?.(e);
  if (ee(r)) return r;
  for (const n of Do()) {
    const o = Wt(n);
    if (o?.id === e) return o;
  }
  return null;
}
function km(e) {
  const t = et(e);
  if (!t) return null;
  for (const o of Do()) {
    const a = wm(o);
    if (et(a) === t) {
      const i = Wt(o);
      if (i) return i;
    }
  }
  const n = game.actors?.find?.((o) => ee(o) && et(o.name) === t);
  return ee(n) ? n : null;
}
function Do() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function wm(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : Wt(e)?.name ?? null;
}
function Wt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ee(t)) return t;
  const r = e.document?.actor;
  return ee(r) ? r : null;
}
function et(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ee(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function tt(e, t, r, n) {
  return {
    source: e.source,
    status: t,
    reason: r,
    pendingId: n,
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
function rn(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function rt() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Cm {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], o = [], a = he(t);
    for (const i of r) {
      const s = i.itemId ? a.find((y) => y.id === i.itemId) ?? null : null, d = i.match?.preset ?? null;
      if (!s || !d) {
        o.push(i);
        continue;
      }
      await this.automationBinder.applyPreset(s, d);
      const p = await this.itemPatches.applyPresetItemPatch(s, d);
      n.push({
        itemId: s.id ?? null,
        itemName: s.name ?? "Ritual sem nome",
        presetId: d.id,
        presetLabel: d.label,
        previousStatus: i.status,
        itemPatch: p
      });
    }
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      applied: n,
      skipped: o
    };
  }
}
class $m {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = he(t).map((s) => this.analyzeRitual(s)), n = r.filter($e("upToDate")), o = r.filter($e("available")), a = r.filter($e("outdated")), i = r.filter($e("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: r.length,
      upToDate: n,
      available: o,
      outdated: a,
      unsupported: i,
      canApply: o.length > 0 || a.length > 0
    };
  }
  getApplicableEntries(t) {
    const r = this.analyzeActor(t);
    return [...r.available, ...r.outdated];
  }
  analyzeRitual(t) {
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = _m(t);
    return r ? n ? n.source.type !== "preset" ? se({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Automação manual encontrada. Preset sugerido: ${r.preset.label}.`
    }) : n.source.presetId === r.preset.id && n.source.presetVersion === r.preset.version ? se({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Preset ${r.preset.label} v${r.preset.version} já aplicado.`
    }) : se({
      ritual: t,
      status: "outdated",
      match: r,
      flag: n,
      reason: Im(n, r.preset)
    }) : se({
      ritual: t,
      status: "available",
      match: r,
      flag: n,
      reason: `Preset encontrado: ${r.preset.label}.`
    }) : se({
      ritual: t,
      status: "unsupported",
      match: r,
      flag: n,
      reason: n ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function se(e) {
  const t = e.flag?.source, r = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? De(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function _m(e) {
  const t = e.getFlag(l, "automation");
  return $t(t) ? t : null;
}
function Im(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function $e(e) {
  return (t) => t.status === e;
}
class Sm {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), n = It(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: r,
      data: n,
      flags: {
        [l]: {
          resourceTransaction: n
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, r) {
    const n = this.createWorkflowSummaryContent(t, r), o = K(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: n,
      data: o,
      flags: {
        [l]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const r = A(t.actorName), n = A(t.resource), o = A(nn(t)), a = A(Pm(t));
    return `
      <section class="${l}-card ${l}-resource-card">
        <header class="${l}-card__header">
          <strong>${o}</strong>
          <span>${r}</span>
        </header>
        <div class="${l}-card__body">
          <p><strong>${a}:</strong> ${t.appliedAmount}</p>
          <p><strong>${n}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, r) {
    const n = A(r.title ?? "Automação"), o = r.message ? `<p>${A(r.message)}</p>` : "", a = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), i = A(t.item.name ?? "Item sem nome"), s = t.targets.length > 0 ? t.targets.map((f) => A(f.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (f) => `<li><strong>${A(f.id)}:</strong> ${A(f.formula)} = ${f.total} <em>(${A(Em(f.intent))})</em>${f.damageType ? ` — ${A(f.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (f) => `<li><strong>${A(f.itemName)}:</strong> ${f.circle}º círculo — ${f.amount} ${A(f.resource)} (${A(Lm(f.source))})</li>`
    ), y = t.damageInstances.map(
      (f) => `<li><strong>${A(f.targetActorName)}:</strong> bruto ${f.rawAmount}${f.damageType ? ` ${A(f.damageType)}` : ""} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), b = t.healingInstances.map(
      (f) => `<li><strong>${A(f.targetActorName)}:</strong> bruto ${f.rawAmount} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (f) => `<li><strong>${A(f.actorName)}:</strong> ${A(nn(f))} — ${f.before.value}/${f.before.max} &rarr; ${f.after.value}/${f.after.max}</li>`
    ), R = t.phases.map((f) => A(f)).join(" &rarr; ");
    return `
      <section class="${l}-card ${l}-workflow-card">
        <header class="${l}-card__header">
          <strong>${n}</strong>
          <span>${i}</span>
        </header>
        <div class="${l}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${s}</p>
          ${p.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${p.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p><strong>Cura:</strong></p><ul>${b.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p class="${l}-workflow-card__phases"><strong>Fases:</strong> ${R}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Em(e) {
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
function nn(e) {
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
function Pm(e) {
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
function Lm(e) {
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
function Nm() {
  const e = new Ls(), t = new $c(e), r = new vs(), n = new Fs(r), o = new Xs(e), a = new Js(), i = a.registerMany(da());
  if (!i.ok)
    throw new Error(i.error.message);
  const s = new Zs(), d = new Ys(), p = el(), y = new Mc(p), b = new $m(a), T = new Cm(b, s, d), R = new Ec(), f = new Sm(R), oe = new Sc(), ae = new wc(t, n, f, oe), ie = new Ic(ae, oe), k = new gm(ie, t, n, R);
  return k.addStrategy(new Ws((F) => k.handleItemUsed(F))), {
    ordem: o,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: n,
    resources: t,
    automationRegistry: a,
    automationBinder: s,
    itemPatches: d,
    conditionRegistry: p,
    conditions: y,
    debugOutput: R,
    chatMessages: f,
    workflowHooks: oe,
    automation: ae,
    workflow: ie,
    itemUseIntegration: k,
    ritualPresetDiagnostic: b,
    ritualPresetApplications: T
  };
}
const { ApplicationV2: Dm } = foundry.applications.api;
class Le extends Dm {
  constructor(t, r) {
    super({
      id: `${l}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Presets de rituais: ${t.name ?? "Ator"}`
      }
    }), this.actor = t, this.services = r;
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
      apply: Le.onApply,
      cancel: Le.onCancel
    }
  };
  async _renderHTML(t, r) {
    const n = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), o = document.createElement("div");
    return o.className = "paranormal-toolkit-preset-manager", o.innerHTML = this.renderContent(n), o;
  }
  _replaceHTML(t, r, n) {
    r.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${P(wt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${P(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${nt("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${nt("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${nt("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
    const t = this.lastApplicationResult.applied.length, r = this.lastApplicationResult.skipped.length, n = r > 0 ? ` ${r} pendente(s) não puderam ser aplicados.` : "";
    return `
      <div class="paranormal-toolkit-preset-manager__result">
        <strong>Aplicação concluída.</strong>
        <span>${t} preset(s) aplicado(s).${n}</span>
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
        const n = this.lastApplicationResult.applied.length;
        ui.notifications?.info(`Paranormal Toolkit: ${n} preset(s) aplicado(s) em ${this.actor.name ?? "ator"}.`);
      } finally {
        this.isApplying = !1, await this.render({ force: !0 });
      }
    }
  }
  static async onCancel(t) {
    t.preventDefault(), await this.close();
  }
}
function nt(e, t, r, n) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${n}"></i>
        <span>${P(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? vm(r) : Mm(t)}
    </section>
  `;
}
function vm(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Om).join("")}</ol>`;
}
function Om(e) {
  const t = e.preset, r = t ? `${t.label} v${t.version}` : "Sem preset", n = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${P(e.appliedPresetId)} v${P(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${P(e.itemName)}</strong>
        <span>${P(e.reason)}</span>
        ${n}
      </div>
      <em>${P(r)}</em>
    </li>
  `;
}
function Mm(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${P({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function P(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const Ne = `${l}.manageRitualPresets`, on = `__${l}_ritualPresetHeaderControlRegistered`, Fm = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function xm(e) {
  const t = globalThis;
  if (!t[on]) {
    for (const r of Fm)
      Hooks.on(r, (n, o) => {
        Um(n, o, e);
      });
    t[on] = !0, u.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Um(e, t, r) {
  Array.isArray(t) && jm(e) && (Bm(e, r), !t.some((n) => n.action === Ne) && t.push({
    action: Ne,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), vo(e, r);
    }
  }));
}
function Bm(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Ne] && (e.options.actions[Ne] = (r) => {
    r.preventDefault(), r.stopPropagation(), vo(e, t);
  }));
}
function jm(e) {
  if (!game.user?.isGM) return !1;
  const t = Oo(e);
  return t ? t.type === "agent" && he(t).length > 0 : !1;
}
function vo(e, t) {
  const r = Oo(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Le(r, t).render({ force: !0 });
}
function Oo(e) {
  return an(e.actor) ? e.actor : an(e.document) ? e.document : null;
}
function an(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let W = null;
Hooks.once("init", () => {
  ca(), La(), di(), Ps(), u.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!or.isSupportedSystem()) {
    u.warn(
      `Sistema não suportado: ${or.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  W = Nm(), W.itemUseIntegration.registerStrategies(), ii(W.conditions), Ha(W), ei(), Qa(), xm(W), u.info("Inicializado para o sistema Ordem Paranormal."), u.info(`API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${wt} inicializado.`);
});
function qm() {
  if (!W)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return W;
}
export {
  qm as getToolkitServices
};
//# sourceMappingURL=main.js.map
