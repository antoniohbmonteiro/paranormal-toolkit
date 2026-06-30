const l = "paranormal-toolkit", Rt = "Paranormal Toolkit", Po = "ordemparanormal";
class ge {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Ne(e) {
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
function kt(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? m({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Tt(t) ? h(t.definition) : m({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Lo(e) {
  return Tt(e.getFlag(l, "automation"));
}
function Tt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Do(t.source) && No(t.definition);
}
function No(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && I(t.label) && Array.isArray(t.steps) && t.steps.every(vo);
}
function Do(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? I(t.presetId) && I(t.presetVersion) && I(t.appliedAt) : t.type === "manual" ? I(t.label) && I(t.appliedAt) : !1;
}
function vo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Oo(t);
    case "spendRitualCost":
      return Mo(t);
    case "rollFormula":
      return Fo(t);
    case "modifyResource":
      return xo(t);
    case "chatCard":
      return Uo(t);
    default:
      return !1;
  }
}
function Oo(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Jr(t);
}
function Mo(e) {
  return e.type === "spendRitualCost";
}
function Fo(e) {
  const t = e;
  return t.type === "rollFormula" && I(t.id) && I(t.formula) && (t.intent === void 0 || Ho(t.intent)) && (t.damageType === void 0 || I(t.damageType));
}
function xo(e) {
  const t = e;
  return t.type === "modifyResource" && Bo(t.actor) && jo(t.resource) && qo(t.operation) && Jr(t);
}
function Uo(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Jr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || I(e.amountFrom);
}
function Bo(e) {
  return e === "self" || e === "target";
}
function jo(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function qo(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Ho(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function I(e) {
  return typeof e == "string" && e.length > 0;
}
function wt(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(Vt);
    if (Go(t))
      return Array.from(t).filter(Vt);
  }
  return [];
}
function Vo(e) {
  return wt(e)[0] ?? null;
}
function zo(e) {
  return wt(e).find(Lo) ?? null;
}
function Go(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Vt(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function he(e) {
  return wt(e).filter((t) => t.type === "ritual");
}
function en(e) {
  return he(e)[0] ?? null;
}
function Wo(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Ne);
      return u.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = ce("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = be(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(Wt);
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
      const a = await tt(e, n, o.value);
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
      const o = await tt(e, r, n.preset);
      u.info(`Melhor preset aplicado em ${r.name}.`, { match: Wt(n), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return zt(e);
    },
    async applyBestPresetsToActorRituals() {
      return zt(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = ce("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = be(t);
      r && (await e.automationBinder.clear(r), u.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function zt(e) {
  const t = ce("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = he(t);
  if (r.length === 0)
    return u.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Gt(t);
  const n = Gt(t, r.length);
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
    const s = await tt(e, o, a.preset);
    n.applied.push(Ko(o, a, s));
  }
  return u.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), Yo(n), n;
}
async function tt(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function Ko(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Ne(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function Gt(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Yo(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((n) => n.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function Wt(e) {
  return {
    preset: Ne(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function ce(e) {
  const t = ge.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function be(e) {
  const t = en(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function K(e) {
  return e ? {
    id: e.id,
    source: {
      ...Qo(e.sourceActor),
      token: e.sourceToken
    },
    item: Xo(e.item),
    targets: e.targets.map(Zo),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Kt(e.rollRequests, tn),
    rolls: Kt(e.rolls, Jo),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Ct),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Ct(e) {
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
function Qo(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Xo(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Zo(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function tn(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Jo(e) {
  return {
    ...tn(e),
    total: e.total
  };
}
function Kt(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function ea(e) {
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
    ta(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    u.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  u.info(`${t} realizado:`, Ct(a));
}
function j(e) {
  const t = ge.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ta(e) {
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
function ra() {
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
function rt() {
  return {
    enabled: ke(L.enabled),
    console: ke(L.console),
    ui: ke(L.ui),
    chat: ke(L.chat)
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
function ke(e) {
  return game.settings.get(l, e) === !0;
}
function na() {
  return {
    status() {
      return rt();
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
const rn = "ritual.costOnly", nn = "ritual.simpleHealing", oa = "ritual.eletrocussao", on = "ritual.simpleDamage", an = "generic.simpleHealing", sn = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function aa() {
  return [
    sa(),
    ia(),
    ca(),
    la(),
    ua()
  ];
}
function sa() {
  return {
    id: rn,
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
function ia() {
  return {
    id: nn,
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
    automation: cn(),
    itemPatch: ma()
  };
}
function ca() {
  return {
    id: oa,
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
    automation: da(),
    itemPatch: fa()
  };
}
function la() {
  return {
    id: on,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: $t()
  };
}
function ua() {
  return {
    id: an,
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
function cn(e = "2d8+2") {
  return ln(
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
function da() {
  return {
    ...$t("3d6", {
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
function $t(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return ln(
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
function ma() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: sn,
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
function fa() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: sn,
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
function ln(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((n) => n.type !== "rollFormula" || n.id !== t ? n : {
      ...n,
      formula: r
    })
  };
}
function _t() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Q(t.id),
    actorId: Q(t.actor?.id),
    sceneId: Q(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function un() {
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
function pa(e) {
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
        if (!ya(t, r)) {
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
      const n = e.automationRegistry.require(rn);
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
      if (!Yt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(nn);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: cn(t)
      }), u.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = q("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = H(r);
      if (!n) return;
      if (!Yt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(on);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: $t(t)
      }), u.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = q("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = H(t);
      r && await ga(e, t, r);
    }
  };
}
async function ga(e, t, r) {
  const n = kt(r);
  if (!n.ok) {
    u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: un(),
    item: r,
    targets: _t()
  });
  if (!o.ok) {
    ha(o.error);
    return;
  }
  u.info("Automação de ritual executada com sucesso.", K(o.value.context));
}
function ha(e) {
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
  const t = en(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ya(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Yt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Aa = ["disabled", "ask", "automatic"], ba = ["buttons", "confirm"], dn = "ask";
function Ra(e) {
  return typeof e == "string" && Aa.includes(e);
}
function ka(e) {
  return typeof e == "string" && ba.includes(e);
}
function Ta(e) {
  return Ra(e) ? e : ka(e) ? "ask" : dn;
}
const wa = ["keep", "replace"], mn = "keep", Ca = !0, N = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function $a() {
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
    default: dn
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
    default: mn
  }), game.settings.register(l, N.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Ca
  }), game.settings.register(l, N.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Qt() {
  const e = Ta(game.settings.get(l, N.executionMode)), t = pn(game.settings.get(l, N.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: fn()
  };
}
function _a() {
  return pn(game.settings.get(l, N.systemCardMode));
}
function fn() {
  return game.settings.get(l, N.ritualCastingCheckEnabled) === !0;
}
async function V(e) {
  await game.settings.set(l, N.executionMode, e);
}
function pn(e) {
  return wa.includes(e) ? e : mn;
}
function Ia(e) {
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
const Sa = [
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
function Ea(e) {
  return {
    phases() {
      return Sa;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Be("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = zo(t);
      if (!r) {
        u.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Xt(e, t, r);
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
      if (!Na(r)) {
        u.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = La(r) ?? Be("Nenhum ator encontrado para executar automação do item.");
      n && await Xt(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Be("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = Vo(t);
      if (!r) {
        u.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(an);
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
async function Xt(e, t, r) {
  const n = kt(r);
  if (!n.ok) {
    u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: un(),
    item: r,
    targets: _t()
  });
  if (!o.ok) {
    Pa(o.error);
    return;
  }
  u.info("Automação executada com sucesso.", K(o.value.context));
}
function Pa(e) {
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
function Be(e) {
  const t = ge.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function La(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Na(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Da(e) {
  const t = ea(e), r = Wo(e), n = pa(e), o = Ea(e), a = na(), s = Ia(e);
  return {
    actor: t,
    automation: r,
    ritual: n,
    workflow: o,
    output: a,
    itemUseIntegration: s,
    getSelectedActor() {
      return t.getSelected();
    },
    logSelectedActorResources() {
      t.logResources();
    },
    async spendSelectedActorPE(i) {
      await t.spendPE(i);
    }
  };
}
function va(e) {
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
      const n = Zt();
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
      return Oa(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const r = Zt();
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
      return Ma(n), n;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Zt() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const r of e) {
    const n = r.actor ?? r.document?.actor ?? null;
    if (!n) continue;
    const a = n.uuid ?? null ?? n.id ?? n.name ?? `selected-${t.size}`;
    t.set(a, n);
  }
  return Array.from(t.values());
}
function Oa(e) {
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
function Ma(e) {
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
function Fa(e) {
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
    conditions: va(e.conditions),
    debug: Da(e)
  }, r = globalThis;
  return r[l] = t, r.ParanormalToolkit = t, t;
}
class Jt {
  static isSupportedSystem() {
    return game.system.id === Po;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function xa() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: X(t.id),
    actorId: X(t.actor?.id),
    sceneId: X(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function gn() {
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
function Ua(e, t = gn()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Ba(e) {
  if (!Ha(e)) return null;
  const t = e.getFlag(l, "workflow");
  return qa(t) ? t : null;
}
function ja() {
  return `flags.${l}.workflow`;
}
function er(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${l}`), r = foundry.utils.getProperty(e, `_source.flags.${l}`);
  return t !== void 0 || r !== void 0;
}
function tr(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return nt(t) || nt(r);
}
function qa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Ha(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function X(e) {
  return nt(e) ? e : null;
}
function nt(e) {
  return typeof e == "string" && e.length > 0;
}
function Va() {
  const e = (t, r) => {
    za(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function za(e, t) {
  const r = Ba(e);
  if (!r || r.targets.length === 0) return;
  const n = Wa(t);
  if (!n || n.querySelector(`.${l}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(Ga(r));
}
function Ga(e) {
  const t = document.createElement("section");
  t.classList.add(`${l}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(rr("Origem", e.source.name)), t.append(rr("Alvo", e.targets.map((n) => n.name).join(", "))), t;
}
function rr(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${l}-chat-enrichment__row`);
  const n = document.createElement("span");
  n.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, r.append(n, o), r;
}
function Wa(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ka() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!Ya(n) || !Qa(e) || er(e) || er(t)) return;
    const o = xa();
    if (o.length === 0 || !tr(e) && !tr(t)) return;
    const a = gn();
    e.updateSource({
      [ja()]: Ua(o, a)
    }), u.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Ya(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Qa(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let nr = !1;
function Xa(e) {
  nr || (Hooks.on("updateCombat", () => {
    je(e, "combat-updated");
  }), Hooks.on("deleteCombat", (t) => {
    je(e, "combat-deleted", Za(t));
  }), nr = !0, je(e, "ready"));
}
async function je(e, t, r) {
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
function Za(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const hn = {
  enabled: "dice.animations.enabled"
};
function Ja() {
  game.settings.register(l, hn.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function es() {
  return {
    enabled: game.settings.get(l, hn.enabled) === !0
  };
}
const ts = "chatCard", or = "data-paranormal-toolkit-prompt-id", c = `${l}-item-use-prompt`, rs = `.${c}__title`, yn = `.${c}__header`, ns = `.${c}__roll-card`, os = `.${c}__roll-meta`, as = `.${c}__roll-meta-pill`, ss = `.${c}__resistance`, is = `.${c}__resistance-header`, An = `.${c}__resistance-description`, cs = `.${c}__resistance-roll-button`, ls = `.${c}__resistance-roll-result`, ar = `${c}__resistance-content`, bn = `.${c}__workflow-section`, Rn = `.${c}__workflow-roll`, kn = `${c}__workflow-roll--dice-open`, Tn = `.${c}__workflow-roll-formula`, wn = `${c}__workflow-roll-formula--toggle`, It = `.${c}__workflow-dice-tray`, us = `.${c}__roll-detail-toggle`, ds = `.${c}__roll-detail-list`, ms = `.${c}__ritual-element-badge`, fs = `.${c}__ritual-metadata`, ps = "casting-backlash", gs = "data-paranormal-toolkit-action-section", hs = "data-paranormal-toolkit-prompt-id", ys = "data-paranormal-toolkit-pending-id", sr = "data-paranormal-toolkit-casting-backlash-enhanced", ir = `.${c}`, As = `.${c}__workflow-section--casting`, bs = `.${c}__workflow-section-header`, Rs = `.${c}__workflow-notes`, ks = `[${gs}="${ps}"]`, cr = `${c}__workflow-section-title-row`, Ts = `${c}__workflow-section-header--casting-backlash`, Cn = `${c}__casting-backlash-button`;
function ws(e) {
  for (const t of Cs(e))
    $s(t), Ps(t);
}
function Cs(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(ir) && t.add(e);
  for (const r of e.querySelectorAll(ir))
    t.add(r);
  return Array.from(t);
}
function $s(e) {
  const t = e.querySelector(ks);
  if (!t) return;
  const r = _s(t);
  if (!r) return;
  const n = e.querySelector(`${As} ${bs}`);
  n && (n.classList.add(Ts), Is(n), Ss(r), n.append(r), t.remove());
}
function _s(e) {
  return e.querySelector(
    `button[${ys}], button[${hs}]`
  );
}
function Is(e) {
  const t = e.querySelector(`:scope > .${cr}`);
  if (t) return t;
  const r = document.createElement("div");
  r.classList.add(cr);
  const n = Array.from(e.childNodes);
  e.prepend(r);
  for (const o of n)
    o !== r && (o instanceof HTMLButtonElement && o.classList.contains(Cn) || r.append(o));
  return r;
}
function Ss(e) {
  if (e.getAttribute(sr) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", r = Es(t, e.disabled);
  e.classList.add(Cn), e.setAttribute(sr, "true"), e.setAttribute("title", r), e.setAttribute("aria-label", r);
}
function Es(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Ps(e) {
  for (const t of e.querySelectorAll(Rs)) {
    for (const r of Array.from(t.children))
      (r.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && r.remove();
    t.children.length === 0 && t.remove();
  }
}
function Ls(e) {
  for (const t of Array.from(e.querySelectorAll(bn)))
    for (const r of Array.from(t.querySelectorAll(`${us}, ${ds}`)))
      r.remove();
}
function Ns(e) {
  for (const t of Array.from(e.querySelectorAll(ss)))
    Ds(t);
}
function Ds(e) {
  const t = e.querySelector(is), r = e.querySelector(An), n = e.querySelector(cs), o = e.querySelector(ls);
  if (!n || !t && !r && !o) return;
  const a = vs(e, n);
  t && t.parentElement !== a && a.append(t), r && r.parentElement !== a && a.append(r), o && o.parentElement !== a && !n.contains(o) && a.append(o), n.parentElement !== e && e.append(n);
}
function vs(e, t) {
  const r = e.querySelector(`.${ar}`);
  if (r) return r;
  const n = document.createElement("div");
  return n.classList.add(ar), e.insertBefore(n, t.parentElement === e ? t : e.firstChild), n;
}
function lr(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function St() {
  const e = globalThis.game;
  return De(e) ? e : null;
}
function S(e, t) {
  const r = Os(e, t);
  return $e(r);
}
function Os(e, t) {
  return t.split(".").reduce((r, n) => De(r) ? r[n] : null, e);
}
function Ms(e, t) {
  const r = e.indexOf(":");
  return r < 0 || fe(e.slice(0, r)) !== fe(t) ? null : te(e.slice(r + 1));
}
function $e(e) {
  return typeof e == "string" ? te(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function De(e) {
  return !!e && typeof e == "object";
}
function Fs(e) {
  return typeof e == "string";
}
function ve(e) {
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
function ot(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function U(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function $n(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function xs(e) {
  for (const t of Array.from(e.querySelectorAll(ns))) {
    const r = zs(t);
    Us(t), r && (Bs(t, r), js(t, r));
  }
}
function Us(e) {
  for (const t of Array.from(e.querySelectorAll(os)))
    t.remove();
}
function Bs(e, t) {
  const n = e.closest(`.${c}`)?.querySelector(yn) ?? null, o = n?.querySelector(rs) ?? null, a = n ?? e, s = a.querySelector(ms);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const i = s ?? document.createElement("span");
  if (i.className = ci(t.elementTone), i.textContent = ii(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", i);
      return;
    }
    a.prepend(i);
  }
}
function js(e, t) {
  const r = qs(e);
  Hs(e, r);
  const n = Vs(t);
  if (n.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${c}__ritual-metadata`);
  for (const s of n) {
    const i = document.createElement("span");
    i.classList.add(`${c}__ritual-metadata-chip`), i.textContent = s, o.append(i);
  }
  if (r) {
    const s = r.querySelector(`.${c}__summary`);
    if (s?.parentElement === r) {
      s.insertAdjacentElement("afterend", o);
      return;
    }
    r.append(o);
    return;
  }
  const a = e.querySelector(bn);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function qs(e) {
  return e.closest(`.${c}`)?.querySelector(yn) ?? null;
}
function Hs(e, t) {
  const r = [e, t].filter((n) => n !== null);
  for (const n of r)
    for (const o of Array.from(n.querySelectorAll(fs)))
      o.remove();
}
function Vs(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${ot(e.target)}` : null,
    e.duration ? `Duração: ${ot(e.duration)}` : null,
    e.resistance ? `Resistência: ${$n(e.resistance)}` : null
  ].filter(ve);
}
function zs(e) {
  const t = Gs(e), r = Zs(e), o = (t ? Xs(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = Et(S(o, "element")), i = v("op.elementChoices", s) ?? ur(G(a, "Elemento")) ?? ur(r.damageType), d = s ?? li(i), p = S(o, "circle") ?? G(a, "Círculo"), y = ti(o) ?? G(a, "Alvo"), b = ai(o, "duration", "op.durationChoices") ?? G(a, "Duração"), k = Js(e) ?? ni(o) ?? G(a, "Resistência"), R = ei(a) ?? r.cost, f = {
    elementLabel: i,
    elementTone: d,
    circle: p,
    cost: R,
    target: y,
    duration: b,
    resistance: k
  };
  return si(f) ? f : null;
}
function Gs(e) {
  const t = Ws(e);
  if (!t) return null;
  const r = t.getFlag?.(l, ts), n = Ys(r);
  if (n.length === 0) return null;
  const o = Ks(e);
  if (o.size > 0) {
    const a = n.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return n.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function Ws(e) {
  const r = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return r ? St()?.messages?.get?.(r) ?? null : null;
}
function Ks(e) {
  const t = e.closest(`.${c}`) ?? e, r = /* @__PURE__ */ new Set();
  for (const n of Array.from(t.querySelectorAll(`[${or}]`))) {
    const o = n.getAttribute(or)?.trim();
    o && r.add(o);
  }
  return r;
}
function Ys(e) {
  if (!De(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Qs).filter((r) => r !== null) : [];
}
function Qs(e) {
  return De(e) ? {
    pendingId: $e(e.pendingId),
    actorId: $e(e.actorId),
    itemId: $e(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Fs) : []
  } : null;
}
function Xs(e) {
  if (!e.itemId) return null;
  const t = St(), n = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return n || (t?.items?.get?.(e.itemId) ?? null);
}
function Zs(e) {
  let t = null, r = null;
  for (const n of Array.from(e.querySelectorAll(as))) {
    const o = te(n.textContent);
    if (!o) continue;
    const a = Ms(o, "Tipo");
    a && (r = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: r };
}
function Js(e) {
  const t = te(e.querySelector(An)?.textContent);
  return t ? $n(t) : null;
}
function G(e, t) {
  const r = fe(t);
  for (const n of e) {
    const o = n.indexOf(":");
    if (!(o < 0 || fe(n.slice(0, o)) !== r))
      return te(n.slice(o + 1));
  }
  return null;
}
function ei(e) {
  const t = G(e, "Custo") ?? G(e, "PE");
  return t || (e.map(te).find((r) => typeof r == "string" && /\b(P[ED]|PE|PD)\b/iu.test(r)) ?? null);
}
function ti(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return ri(e) ?? v("op.targetChoices", t) ?? "Área";
  const r = v("op.targetChoices", t) ?? U(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, r].filter(ve).join(" ");
}
function ri(e) {
  const t = S(e, "area.name"), r = S(e, "area.size"), n = S(e, "area.type"), o = t ? v("op.areaChoices", t) ?? U(t) : null, a = n ? v("op.areaTypeChoices", n) ?? U(n) : null;
  return o ? r ? a ? `${o} ${r}m ${ot(a)}` : `${o} ${r}m` : o : null;
}
function ni(e) {
  const t = S(e, "skillResis"), r = S(e, "resistance");
  if (!t || !r) return null;
  const n = v("op.skill", t) ?? U(t), o = oi(r);
  return [n, o].filter(ve).join(" ");
}
function oi(e) {
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
function ai(e, t, r) {
  const n = S(e, t);
  return n ? v(r, n) ?? U(n) : null;
}
function si(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function ii(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function ci(e) {
  return [
    `${c}__ritual-element-badge`,
    e ? `${c}__ritual-element-badge--${e}` : null
  ].filter(ve).join(" ");
}
function Et(e) {
  const t = fe(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function ur(e) {
  const t = Et(e);
  return t ? v("op.elementChoices", t) ?? U(t) : e ? U(e) : null;
}
function li(e) {
  return Et(e);
}
function v(e, t) {
  if (!t) return null;
  const r = `${e}.${t}`, n = St()?.i18n?.localize?.(r);
  return !n || n === r ? null : n;
}
const dr = "data-paranormal-toolkit-dice-toggle-enhanced";
function di(e) {
  for (const t of Array.from(e.querySelectorAll(Rn)))
    _n(t);
}
function mi(e) {
  const t = Sn(e.target);
  if (!t) return;
  const r = Pt(t);
  r && (e.preventDefault(), In(r, t));
}
function fi(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Sn(e.target);
  if (!t) return;
  const r = Pt(t);
  r && (e.preventDefault(), In(r, t));
}
function _n(e) {
  const t = e.querySelector(It);
  if (!t) return;
  const r = e.querySelector(Tn);
  if (r && r.getAttribute(dr) !== "true" && (r.setAttribute(dr, "true"), r.classList.add(wn), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", "false"), r.title = "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title), t.hidden = !0, !r.querySelector("i"))) {
    const n = document.createElement("i");
    n.classList.add("fa-solid", "fa-chevron-down"), n.setAttribute("aria-hidden", "true"), r.append(n);
  }
}
function In(e, t) {
  const r = e.querySelector(It);
  if (!r) return;
  const n = !e.classList.contains(kn);
  pi(e, t, r, n);
}
function pi(e, t, r, n) {
  e.classList.toggle(kn, n), r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.title = n ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !n), o.classList.toggle("fa-chevron-up", n));
}
function Sn(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Tn);
  if (!t) return null;
  const r = Pt(t);
  return r ? (_n(r), t.classList.contains(wn) ? t : null) : null;
}
function Pt(e) {
  const t = e.closest(Rn);
  return t && t.querySelector(It) ? t : null;
}
const mr = `${l}-workflow-dice-toggle-styles`;
function gi() {
  if (document.getElementById(mr)) return;
  const e = document.createElement("style");
  e.id = mr, e.textContent = `
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
const hi = [0, 100, 500, 1500, 3e3];
let fr = !1, qe = null;
function yi() {
  if (!fr) {
    fr = !0, gi(), Hooks.on("renderChatMessageHTML", (e, t) => {
      le(lr(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      le(lr(t));
    }), Hooks.once("ready", () => {
      le(document), Ai();
    }), document.addEventListener("click", mi), document.addEventListener("keydown", fi);
    for (const e of hi)
      globalThis.setTimeout(() => le(document), e);
  }
}
function Ai() {
  qe || !document.body || (qe = new MutationObserver((e) => {
    for (const t of e)
      for (const r of Array.from(t.addedNodes))
        (r instanceof HTMLElement || r instanceof DocumentFragment) && le(r);
  }), qe.observe(document.body, { childList: !0, subtree: !0 }));
}
function le(e) {
  e && (Ls(e), xs(e), Ns(e), di(e), ws(e));
}
function bi() {
  yi();
}
const ue = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, En = {
  PV: "system.attributes.hp"
}, at = {
  PV: [ue.PV, En.PV],
  SAN: [ue.SAN],
  PE: [ue.PE],
  PD: [ue.PD]
}, st = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Ri {
  getResource(t, r) {
    const n = pr(t, r);
    if (!n.ok)
      return m(n.error);
    const o = n.value, a = `${o}.value`, s = `${o}.max`, i = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, s), p = hr(t, r, a, i, "valor atual");
    if (p) return m(p);
    const y = hr(t, r, s, d, "valor máximo");
    return y ? m(y) : h({
      value: i,
      max: d
    });
  }
  async updateResourceValue(t, r, n) {
    const o = pr(t, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: n });
  }
}
function pr(e, t) {
  const r = ki(e.type, t);
  if (r && gr(e, r))
    return h(r);
  const n = at[t].find(
    (o) => gr(e, o)
  );
  return n ? h(n) : m({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Ti(e, t),
    path: at[t].join(" | ")
  });
}
function ki(e, t) {
  return e === "threat" ? En[t] ?? null : e === "agent" ? ue[t] : null;
}
function gr(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function Ti(e, t) {
  const r = e.type ?? "unknown", n = at[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function hr(e, t, r, n, o) {
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
class wi {
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
      const s = st.ritualItem.circleCandidates;
      return m({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: n, value: o } = r, a = Ci(o);
    return a ? h(a) : m({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${n}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: n,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of st.ritualItem.circleCandidates) {
      const n = foundry.utils.getProperty(t, r);
      if (n != null)
        return { path: r, value: n };
    }
    return null;
  }
}
function Ci(e) {
  if (yr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (yr(r))
      return r;
  }
  return null;
}
function yr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const $i = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class _i {
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
    const n = r.value, o = Ii(t.ritual, n);
    return o.ok ? o.value ? h(o.value) : h({
      resource: "PE",
      amount: $i[n],
      source: "default-by-circle",
      circle: n
    }) : m(o.error);
  }
}
function Ii(e, t) {
  const r = e.getFlag(l, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Si(r) ? {
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
function Si(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const He = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ei(e) {
  if (!Oi(e.item)) return null;
  const t = it(e.actor) ? e.actor : Pi(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Ni(e.token) ?? Li(t),
    targets: _t(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Pi(e) {
  const t = e;
  return it(t.actor) ? t.actor : it(e.parent) ? e.parent : null;
}
function Li(e) {
  const t = Di(e) ?? vi(e);
  return t ? Pn(t) : null;
}
function Ni(e) {
  return ct(e) ? Pn(e) : null;
}
function Di(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return ct(r) ? r : (t.getActiveTokens?.() ?? []).find(ct) ?? null;
}
function vi(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Pn(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Ve(e.id),
    actorId: Ve(t?.id),
    sceneId: Ve(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Oi(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function it(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function ct(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Ve(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Mi {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(He.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, u.info(`${He.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = Ei(Fi(t));
    if (!r) {
      u.warn(`${He.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function Fi(e) {
  return e && typeof e == "object" ? e : {};
}
class xi {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return ze("missing-item-patch");
    if (t.type !== "ritual") return ze("unsupported-item-type");
    const o = Ui(n);
    return Object.keys(o).length === 0 ? ze("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Ui(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (w(t, "system.circle", r.circle), w(t, "system.element", r.element), w(t, "system.target", r.target), w(t, "system.targetQtd", r.targetQuantity), w(t, "system.execution", r.execution), w(t, "system.range", r.range), w(t, "system.duration", r.duration), w(t, "system.skillResis", r.resistanceSkill), w(t, "system.resistance", r.resistance), w(t, "system.studentForm", r.studentForm), w(t, "system.trueForm", r.trueForm)), t;
}
function w(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function ze(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Bi {
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
    return this.getNumber(t, st.ritual.dt, 0);
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
class ji {
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
class qi {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = Hi(t);
    return r.ok ? this.presets.has(t.id) ? m({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Ge(t)), h(t)) : r;
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
    return r ? Ge(r) : null;
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
    return Array.from(this.presets.values()).map(Ge);
  }
  findForItem(t) {
    return this.list().map((r) => Vi(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function Hi(e) {
  return !We(e.id) || !We(e.version) || !We(e.label) ? m({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? m({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : h(e);
}
function Vi(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = zi(o, t);
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
function zi(e, t) {
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
      const r = Ar(t.name), n = e.names.map(Ar).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Gi(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function Ar(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Gi(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function Ge(e) {
  return structuredClone(e);
}
function We(e) {
  return typeof e == "string" && e.length > 0;
}
function _e(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? m({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : h(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = Oe(e.amountFrom);
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
function Oe(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const Wi = "dice-so-nice";
async function Ln(e) {
  if (!es().enabled || !Ki()) return;
  const t = Yi();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      u.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function Ki() {
  return game.modules.get(Wi)?.active === !0;
}
function Yi() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Qi(e, t, r) {
  if (!br(e.id) || !br(e.formula))
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
    await Ln(o);
    const i = {
      ...r.rollRequests[e.id] ?? Nn(e, t),
      total: a,
      roll: o
    };
    return r.rolls[e.id] = i, h(i);
  } catch (n) {
    return m({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: n
    });
  }
}
function Nn(e, t) {
  const r = e.intent ?? Xi(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function Xi(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function br(e) {
  return typeof e == "string" && e.length > 0;
}
async function Ie(e, t, r, n, o) {
  switch (n) {
    case "spend":
      return r !== "PE" && r !== "PD" ? Te(t, r, n, o) : e.spend(t, r, o);
    case "damage":
      return r !== "PV" && r !== "SAN" ? Te(t, r, n, o) : e.damage(t, r, o);
    case "heal":
      return r !== "PV" ? Te(t, r, n, o) : e.heal(t, r, o);
    case "recover":
      return r !== "SAN" ? Te(t, r, n, o) : e.recover(t, r, o);
  }
}
function Te(e, t, r, n) {
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
function Zi(e) {
  const { step: t, context: r, transaction: n, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = Ji(t, r, n, o);
    r.damageInstances.push(s), a.emit("afterDamageResolution", r, {
      stepIndex: o,
      step: t,
      damage: s,
      resourceTransaction: n,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), a.emit("afterApplyDamage", r, {
      stepIndex: o,
      step: t,
      damage: s,
      resourceTransaction: n,
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
    const s = ec(t, r, n, o);
    r.healingInstances.push(s), a.emit("afterApplyHealing", r, {
      stepIndex: o,
      step: t,
      healing: s,
      resourceTransaction: n,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount
      }
    });
  }
}
function Ji(e, t, r, n) {
  const o = Oe(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: Dn(t.id, "damage", n, t.damageInstances.length),
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
function ec(e, t, r, n) {
  const o = Oe(e.amountFrom);
  return {
    id: Dn(t.id, "healing", n, t.healingInstances.length),
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
function Dn(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function tc(e, t, r) {
  const n = Oe(e.amountFrom), o = n ? t.rolls[n] : void 0;
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
function rc(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", r, { stepIndex: n, step: t, metadata: o }), vn("before", e), Rr("before", e), Rr("resolve", e);
}
function nc(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("apply", r, { stepIndex: n, step: t, metadata: o }), vn("apply", e);
}
function oc(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", r, { stepIndex: n, step: t, metadata: o });
}
function vn(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t, i = ac(e, r.operation);
  i && s.emit(i, n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function Rr(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function ac(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function sc(e, t, r) {
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
async function ic(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return cc(e, t);
    case "spendRitualCost":
      return lc(e, t);
  }
}
async function cc(e, t) {
  const { context: r, resources: n } = e, o = _e(t, r);
  return o.ok ? On(await n.spend(r.sourceActor, t.resource, o.value), r) : m(o.error);
}
async function lc(e, t) {
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
  const s = a.value;
  return r.ritualCosts.push({
    ...s,
    itemId: r.item.id ?? null,
    itemName: r.item.name ?? "Ritual sem nome"
  }), On(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function On(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), h(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), m({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function uc(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: o, execute: a } = e, s = dc(t);
  for (const d of s.before)
    o.emit(d, r, { stepIndex: n, step: t });
  const i = await a();
  if (!i.ok)
    return i;
  for (const d of s.after)
    o.emit(d, r, { stepIndex: n, step: t });
  return i;
}
function dc(e) {
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
class mc {
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
        return uc({
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
    const o = await ic({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? h(void 0) : m({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const o = Nn(t, n);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, n, t);
    const a = await this.runRollFormulaStep(t, r, n);
    if (!a.ok)
      return a;
    const s = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, n, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: o, rollResult: s }), h(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const o = await Qi(t, n, r);
    return o.ok ? h(void 0) : m({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const o = _e(t, r);
    if (!o.ok)
      return m({ ...o.error, stepIndex: n, step: t, context: r });
    const a = tc(t, r, o.value);
    rc({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), nc({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, r);
    if (s.length === 0)
      return m({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: n,
        step: t,
        context: r
      });
    for (const i of s) {
      const d = await Ie(this.resources, i, t.resource, t.operation, o.value), p = this.handleResourceOperationResult(d, r, n, t);
      if (!p.ok)
        return p;
      Zi({
        step: t,
        context: r,
        transaction: p.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return oc({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), h(void 0);
  }
  async runModifyResourceStep(t, r, n) {
    const o = _e(t, r);
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
    for (const s of a) {
      const i = await Ie(this.resources, s, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(i, r, n, t);
      if (!d.ok)
        return d;
    }
    return h(void 0);
  }
  async runChatCardStep(t, r, n) {
    const o = await sc(this.messages, t, r);
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
  emitSpecificRollPhase(t, r, n, o, a, s) {
    const i = fc(t, r.intent);
    i && this.lifecycle.emit(i, n, {
      stepIndex: o,
      step: a,
      rollRequest: r,
      rollResult: s
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
function fc(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class pc {
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
    const s = a.value, i = this.calculate(n, s, o);
    if (!i.ok)
      return m({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: n,
        reason: i.error.reason,
        message: i.error.message,
        requestedAmount: o,
        current: s.value,
        required: o
      });
    const { afterValue: d, appliedAmount: p } = i.value, y = {
      value: d,
      max: s.max
    };
    try {
      d !== s.value && await this.adapter.updateResourceValue(t, r, d);
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
        current: s.value,
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
      before: s,
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
function Mn(e) {
  return {
    id: gc(),
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
function gc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class hc {
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
    const n = Mn(r);
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
class yc {
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
class Ac {
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
    const r = rt();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: bc(),
      flags: {
        ...t.flags,
        [l]: {
          ...Rc(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && u.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = rt();
    if (!n.enabled)
      return;
    const o = r.notification ?? kr(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, o);
  }
  emitConsole(t, r) {
    const n = kr(r);
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
function kr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function bc() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Rc(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function kc(e) {
  const t = Tc(e?.rounds);
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
  const r = wc();
  if (!r?.id || !Fn(r.round))
    return {
      duration: {},
      requestedRounds: t,
      combatDurationApplied: !1,
      combatId: null,
      startRound: null,
      startTurn: null,
      warning: `Duração de ${t} rodada(s) ignorada porque não há combate ativo.`
    };
  const n = Cc(r.turn) ? r.turn : 0;
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
function Tc(e) {
  return Fn(e) ? Math.trunc(e) : null;
}
function wc() {
  return game.combat ?? null;
}
function Fn(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Cc(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class $c {
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
    if (!Lc(n))
      return m({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = r.value, a = kc(t.duration), s = _c(o, t, a), d = t.refreshExisting ?? !0 ? Nc(n, o.id) : null;
    if (d)
      try {
        return await Promise.resolve(d.update?.(s)), h(Tr(n, o, d.id ?? null, !1, !0, a));
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
      const y = (await n.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return h(Tr(n, o, y, !0, !1, a));
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
    const n = Un(r, t.conditionId);
    try {
      for (const o of n)
        await Promise.resolve(o.delete?.());
    } catch (o) {
      return m({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "delete-failed",
        message: `Falha ao remover condição ${t.conditionId} de ${r.name ?? "ator sem nome"}.`,
        cause: o
      });
    }
    return h({
      actor: r,
      actorId: r.id ?? null,
      actorName: r.name ?? "Ator sem nome",
      conditionId: t.conditionId,
      removed: n.length
    });
  }
  async cleanupExpiredConditions(t = {}) {
    const r = Dc(), n = [];
    let o = 0, a = 0;
    for (const s of r) {
      const i = Bn(s);
      o += i.length;
      for (const d of i) {
        if (!Sc(d, t)) continue;
        const p = xn(d);
        try {
          await Promise.resolve(d.delete?.()), a += 1;
        } catch (y) {
          n.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: d.id ?? null,
            conditionId: p.conditionId,
            message: `Falha ao remover condição expirada ${p.conditionId ?? d.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
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
function _c(e, t, r) {
  const n = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: xc(),
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
    duration: Ic(r.duration),
    flags: {
      [l]: n
    }
  };
}
function Ic(e) {
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
function Tr(e, t, r, n, o, a) {
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
function Sc(e, t) {
  const r = xn(e);
  if (!r.conditionId || !Ec(r)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && r.combatId === t.combatId);
  if (Pc(e)) return !0;
  const n = Fc();
  return !n?.id || r.combatId && r.combatId !== n.id ? !0 : !de(r.startRound) || !de(r.requestedRounds) || !de(n.round) ? !1 : n.round >= r.startRound + r.requestedRounds;
}
function Ec(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && de(e.requestedRounds);
}
function Pc(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const r = t.remaining;
  return typeof r == "number" && Number.isFinite(r) && r <= 0;
}
function xn(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {};
  return {
    conditionId: lt(e, "conditionId"),
    requestedRounds: wr(e, "requestedRounds") ?? ut(t.rounds),
    combatDurationApplied: Ke(e, "combatDurationApplied"),
    combatId: lt(e, "combatId") ?? Lt(t.combat),
    startRound: wr(e, "startRound") ?? ut(t.startRound),
    deleteOnExpire: Ke(e, "deleteOnExpire"),
    expiresWithCombat: Ke(e, "expiresWithCombat")
  };
}
function Lc(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Nc(e, t) {
  return Un(e, t)[0] ?? null;
}
function Un(e, t) {
  return Bn(e).filter((r) => Oc(r) === t);
}
function Dc() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const r of t.contents)
      we(e, r);
  typeof t?.forEach == "function" && t.forEach((r) => {
    we(e, r);
  });
  for (const r of vc())
    we(e, r.actor), we(e, r.document?.actor);
  return Array.from(e.values());
}
function we(e, t) {
  if (!Mc(t)) return;
  const n = Lt(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(n, t);
}
function vc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Bn(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Oc(e) {
  return lt(e, "conditionId");
}
function lt(e, t) {
  return Lt(e.getFlag?.(l, t));
}
function wr(e, t) {
  return ut(e.getFlag?.(l, t));
}
function Ke(e, t) {
  return e.getFlag?.(l, t) === !0;
}
function Lt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ut(e) {
  return de(e) ? Math.trunc(e) : null;
}
function Mc(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Fc() {
  return game.combat ?? null;
}
function de(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function xc() {
  return game.user?.id ?? null;
}
const Uc = {
  id: "vulnerable",
  label: "Vulnerável",
  icon: "icons/svg/downgrade.svg",
  description: "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.",
  definitionVersion: "1.0.0",
  changes: []
};
class Bc {
  definitions = /* @__PURE__ */ new Map();
  constructor(t) {
    for (const r of t)
      this.definitions.set(r.id, r);
  }
  list() {
    return Array.from(this.definitions.values()).map(Cr);
  }
  get(t) {
    const r = this.definitions.get(t);
    return r ? h(Cr(r)) : m({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
}
function jc() {
  return new Bc([Uc]);
}
function Cr(e) {
  return {
    ...e,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
const qc = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", jn = `${l}-inline-roll-neutralized`, Hc = `${l}-inline-roll-notice`, Nt = `data-${l}-inline-roll-neutralized`, $r = `data-${l}-inline-roll-notice`, Vc = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function _r(e) {
  const t = ol(e.message), r = await zc(e.message), n = Gc(t);
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
async function zc(e) {
  const t = tl(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = Wc(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await rl(t, r.content), replacementCount: r.replacementCount };
}
function Gc(e) {
  const t = e ? nl(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = qn(t);
  return r > 0 && Hn(Zc(t)), { replacementCount: r };
}
function Wc(e) {
  const t = Kc(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = qn(r.content), o = t.replacementCount + n;
  return o === 0 ? { content: e, replacementCount: 0 } : (Hn(r.content), { content: r.innerHTML, replacementCount: o });
}
function Kc(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, o) => (t += 1, Qc(o.trim()))), replacementCount: t };
}
function qn(e) {
  const t = Yc(e);
  for (const r of t)
    r.replaceWith(Xc(Jc(r)));
  return t.length;
}
function Yc(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(qc))
    r.getAttribute(Nt) !== "true" && t.add(r);
  return Array.from(t);
}
function Qc(e) {
  return `<span class="${jn}" ${Nt}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${al(e)}</span>`;
}
function Xc(e) {
  const t = document.createElement("span");
  return t.classList.add(jn), t.setAttribute(Nt, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Hn(e) {
  if (e.querySelector?.(`[${$r}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Hc), t.setAttribute($r, "true"), t.textContent = Vc, e.append(t);
}
function Zc(e) {
  return e.querySelector(".message-content") ?? e;
}
function Jc(e) {
  const r = e.getAttribute("data-formula") ?? el(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function el(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function tl(e) {
  return e && typeof e == "object" ? e : null;
}
async function rl(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return u.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function nl(e) {
  const t = sl(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function ol(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function al(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function sl(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ir = "occultism";
function il(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function cl(e) {
  const t = il(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await ll(e, Ir);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Ln(r);
  const n = ml(r);
  return {
    skill: Ir,
    skillLabel: "Ocultismo",
    roll: r,
    formula: dl(r),
    total: n,
    difficulty: t,
    success: n >= t,
    diceBreakdown: fl(r)
  };
}
async function ll(e, t) {
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
  return ul(n);
}
function ul(e) {
  return Sr(e) ? e : Array.isArray(e) ? e.find(Sr) ?? null : null;
}
function Sr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function dl(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function ml(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function fl(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(pl);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function pl(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function gl(e) {
  return {
    header: {
      eyebrow: Rt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Rl(e.ritual)
    },
    forms: e.variantOptions.map((t) => hl(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: bl(e.automationStatus ?? "assisted")
  };
}
function hl(e, t) {
  const r = yl(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Al(t) : "—",
    details: r
  };
}
function yl(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Al(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function bl(e) {
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
function Rl(e) {
  const t = e.system, r = [Tl(t?.element), kl(t?.circle)].filter(wl);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function kl(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Tl(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function wl(e) {
  return typeof e == "string" && e.length > 0;
}
const Vn = ["base", "discente", "verdadeiro"];
function zn(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Se(e) {
  return typeof e == "string" && Vn.includes(e);
}
const { ApplicationV2: Cl } = foundry.applications.api;
class me extends Cl {
  constructor(t, r) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = r, this.model = gl(t), this.selectedVariant = this.model.forms.find((n) => n.checked && n.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    _l(o, (a) => {
      this.selectedVariant = a;
    }), Il(o, (a) => {
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
          ${this.model.forms.map($l).join("")}
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
    const r = Pl(t), n = Sl(r, this.spendResource, this.selectedVariant);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function $l(e) {
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
function _l(e, t) {
  const r = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of r)
    o.addEventListener("click", () => Er(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Er(e, o, t));
    });
  const n = Gn(e);
  n && t(n);
}
function Er(e, t, r) {
  const n = t.querySelector('input[name="variant"]');
  !n || n.disabled || !Se(n.value) || (n.checked = !0, e.dataset.paranormalToolkitSelectedVariant = n.value, r(n.value), n.dispatchEvent(new Event("change", { bubbles: !0 })), Gn(e));
}
function Gn(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let r = null;
  for (const n of t) {
    const o = n.querySelector('input[name="variant"]'), a = o?.checked === !0;
    n.setAttribute("aria-checked", a ? "true" : "false"), a && Se(o.value) && (r = o.value);
  }
  return r && (e.dataset.paranormalToolkitSelectedVariant = r), r;
}
function Il(e, t) {
  const r = e.querySelector('input[name="spendResource"]');
  r && (t(r.checked), r.addEventListener("change", () => {
    t(r.checked);
  }));
}
function Sl(e, t, r) {
  const n = El(e) ?? r, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: n,
    spendResource: o
  };
}
function El(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Se(t)) return t;
  const r = e?.dataset.paranormalToolkitSelectedVariant;
  return Se(r) ? r : null;
}
function Pl(e) {
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
async function Ll(e) {
  return me.request(e);
}
const Dt = {
  label: "Padrão"
}, Nl = {
  label: "Discente",
  extraCost: 2
}, Dl = {
  label: "Verdadeiro",
  extraCost: 5
};
class vl {
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
    const n = this.resolveCostPreview(t), o = uu(r), a = iu(r, t.item, n, o), s = await Ll({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((T) => T.name),
      cost: n,
      defaultSpendResource: hu(r),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const i = Ol(s), d = mu(r, t.item, i.variant, o), p = fn();
    let y = null;
    if (p) {
      const T = await Fl(this.resources, t.actor, i, d, n);
      if (!T.ok)
        return {
          status: "failed",
          reason: T.reason,
          message: T.message
        };
      try {
        y = await cl(t.actor);
      } catch (F) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: F instanceof Error ? F.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: F
        };
      }
    }
    const b = Ml(r, i, d, n, {
      includeCostSteps: !p
    });
    if (b.steps.length === 0) {
      const T = du(t, i), F = Pr(t.actor, y, d, n), Ht = Nr(r, i, d, n, T, y);
      return F.length > 0 ? {
        status: "ready",
        workflowContext: T,
        actions: F,
        summaryLines: Ht
      } : {
        status: "completed-without-actions",
        workflowContext: T,
        summaryLines: Ht
      };
    }
    const k = await this.workflow.runAutomation(b, {
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
          variant: i.variant,
          spendResource: i.spendResource
        }
      }
    });
    if (!k.ok)
      return {
        status: "failed",
        reason: k.error.reason,
        message: k.error.message,
        cause: k.error
      };
    const R = k.value.context, f = Ul(r, t, R), oe = Pr(t.actor, y, d, n), ae = Nr(r, i, d, n, R, y);
    if (!f.ok)
      return {
        status: "failed",
        reason: f.reason,
        message: f.message
      };
    const se = [...oe, ...f.actions];
    return se.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: R,
      summaryLines: ae
    } : {
      status: "ready",
      workflowContext: R,
      actions: se,
      summaryLines: ae
    };
  }
  async applyAction(t) {
    return Ie(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function Ol(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function Ml(e, t, r, n, o) {
  const a = [], s = t.spendResource === !0;
  for (const i of e.steps)
    i.type === "modifyResource" || i.type === "chatCard" || vt(i) && (!o.includeCostSteps || !s) || a.push(xl(i, r));
  return o.includeCostSteps && s && n && yu(r.extraCost) && a.push({
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
async function Fl(e, t, r, n, o) {
  if (r.spendResource !== !0) return { ok: !0 };
  const a = ye(o, n);
  if (!a)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (a.amount <= 0) return { ok: !0 };
  const s = await e.spend(t, a.resource, a.amount);
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function xl(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function Pr(e, t, r, n) {
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
function Ul(e, t, r) {
  const n = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const a = _e(o, r);
    if (!a.ok)
      return {
        ok: !1,
        reason: a.error.reason,
        message: a.error.message
      };
    const s = Kl(o.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(...Bl(e, o, i, a.value));
  }
  return { ok: !0, actions: n };
}
function Bl(e, t, r, n) {
  if (!Vl(e, t))
    return [Lr(t, r, n)];
  const o = Wl();
  return Wn(e).map((a) => {
    const s = zl(n, a);
    return Lr(t, r, s, {
      option: a,
      choiceGroupId: o
    });
  });
}
function Lr(e, t, r, n) {
  const o = t.name ?? "Ator sem nome", a = Hl(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: jl(e, o, r, n?.option),
    executedLabel: ql(e, o, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function jl(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function ql(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Hl(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Vl(e, t) {
  return t.operation === "damage" && t.resource === "PV" && Wn(e).length > 1;
}
function Wn(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function zl(e, t) {
  const r = e * t.multiplier, n = Gl(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function Gl(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Wl() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Kl(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function Nr(e, t, r, n, o, a = null) {
  return [
    `Forma: ${zn(t.variant)}`,
    Ql(t, r, n),
    ...Yl(a),
    ...Object.values(o.rolls).flatMap(Xl),
    ...Zl(e.resistance),
    ...au(r)
  ];
}
function Yl(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Ql(e, t, r) {
  const n = ye(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Xl(e) {
  const r = [`${su(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = Jl(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${ou(e.damageType)}`), r;
}
function Zl(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function Jl(e) {
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
    const s = eu(a);
    s && (nu(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function eu(e) {
  const t = tu(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : ru(e);
}
function tu(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function ru(e) {
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
function nu(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function ou(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function au(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function su(e) {
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
function iu(e, t, r, n) {
  return Vn.map((o) => {
    const a = Kn(e, t, o, n), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? zn(o),
      enabled: s,
      details: a ? cu(a, r, n) : [],
      finalCostText: a ? lu(r, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function cu(e, t, r) {
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
function lu(e, t) {
  const r = ye(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function uu(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(vt);
}
function du(e, t) {
  return Mn({
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
function mu(e, t, r, n) {
  return Kn(e, t, r, n) ?? Dt;
}
function Kn(e, t, r, n) {
  const o = e.ritualForms?.[r] ?? null;
  return o || (n ? pu(t, r) ? fu(r) : null : r === "base" ? Dt : null);
}
function fu(e) {
  switch (e) {
    case "base":
      return Dt;
    case "discente":
      return Nl;
    case "verdadeiro":
      return Dl;
  }
}
function pu(e, t) {
  if (t === "base") return !0;
  const r = t === "discente" ? "system.studentForm" : "system.trueForm";
  return gu(foundry.utils.getProperty(e, r));
}
function gu(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function hu(e) {
  return e.steps.some(vt);
}
function vt(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function yu(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Au(e, t) {
  const r = await bu(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: ku(r),
    total: Tu(r),
    diceBreakdown: wu(r)
  };
}
function Yn(e) {
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
async function bu(e, t) {
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
  return Ru(n);
}
function Ru(e) {
  return Dr(e) ? e : Array.isArray(e) ? e.find(Dr) ?? null : null;
}
function Dr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function ku(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Tu(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function wu(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(Cu);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Cu(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Qn = "itemUsePrompts", Xn = "chatCard", Me = "data-paranormal-toolkit-prompt-id", Fe = "data-paranormal-toolkit-pending-id", Ot = "data-paranormal-toolkit-executed-label", dt = "data-paranormal-toolkit-choice-group", Zn = "data-paranormal-toolkit-skipped-label", vr = "data-paranormal-toolkit-action-section", Or = "data-paranormal-toolkit-detail-key", Mr = "data-paranormal-toolkit-roll-card", Mt = "data-paranormal-toolkit-roll-detail-toggle", Jn = "data-paranormal-toolkit-roll-detail-id", eo = "data-paranormal-toolkit-resistance-roll-button", to = "data-paranormal-toolkit-resistance-skill", ro = "data-paranormal-toolkit-resistance-skill-label", no = "data-paranormal-toolkit-resistance-target-actor-id", oo = "data-paranormal-toolkit-resistance-target-name", ao = "data-paranormal-toolkit-resistance-roll-result", Fr = "data-paranormal-toolkit-system-card-replaced", $u = `[${Fe}]`, _u = `[${Mt}]`, Iu = `[${eo}]`, mt = `${l}-chat-enrichment`, g = `${l}-item-use-prompt`, Su = `${g}__actions`, xr = `${g}__details`, so = `${g}__summary`, Eu = `${g}__title`, io = `${g}__button--executed`, Ur = `${g}__roll-card`;
let Br = !1, ft = null;
const E = /* @__PURE__ */ new Map(), Pu = [0, 100, 500, 1500, 3e3], Lu = 3e4, Nu = [0, 100, 500, 1500, 3e3];
function Du(e) {
  if (ft = e, Br) {
    qr(e);
    return;
  }
  const t = (r, n) => {
    lo(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Br = !0, qr(e);
}
async function jr(e) {
  const t = co(e);
  E.set(e.pendingId, t), await Ut(t) || Ro(t), uo(e.pendingId);
}
async function vu(e) {
  const t = co({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", E.set(e.pendingId, t), await Ut(t) || Ro(t), uo(e.pendingId);
}
async function Ye(e, t) {
  const r = E.get(e);
  E.delete(e), r && await Dd(r, t);
}
function Ft(e) {
  const t = _o();
  for (const r of t) {
    const n = M(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function Ou(e, t) {
  const r = Ft(e);
  if (!r) return;
  const n = M(r.message), o = n[e];
  o && (n[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await re(r.message, n));
}
async function Mu(e, t, r) {
  if (!t) return;
  const n = Ft(e);
  if (!n) return;
  const o = M(n.message);
  let a = !1;
  for (const [s, i] of Object.entries(o))
    s !== e && i.choiceGroupId === t && (o[s] = {
      ...i,
      executedLabel: r ?? i.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await re(n.message, o);
}
function co(e) {
  const t = B(e.context.message), r = e.context.targets.find((s) => yt(s)), n = r ? yt(r) : null, o = e.resistanceTargetActor ?? n, a = e.resistanceTargetName ?? r?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: cd(e.context),
    executed: !1
  };
}
function lo(e, t, r) {
  Nd();
  const n = Ue(t);
  if (!n) return;
  const o = Ed(e, n);
  o.length > 0 && Ee(n);
  for (const a of o)
    pt(n, a);
  po(n, r), gt(n), ht(n);
}
function qr(e) {
  for (const t of Nu)
    globalThis.setTimeout(() => {
      Fu(e);
    }, t);
}
function Fu(e) {
  for (const t of xu()) {
    const r = xe(t);
    Uu(r) && lo(r, t, e);
  }
}
function xu() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function Uu(e) {
  return e ? Bt(e) ? !0 : Od(e).length > 0 : !1;
}
function uo(e) {
  const t = E.get(e);
  if (!t) return;
  const r = t.messageId ? Pd(t.messageId) : null;
  if (r) {
    Wr(r, t), Ee(r), pt(r, t), Hr(r), gt(r), ht(r);
    return;
  }
  if (t.messageId) {
    bt(t);
    return;
  }
  const n = Ld(t);
  if (n) {
    Wr(n, t), Ee(n), pt(n, t), Hr(n), gt(n), ht(n);
    return;
  }
  bt(t);
}
function Hr(e) {
  ft && po(e, ft);
}
function Ee(e) {
  const t = Bu();
  e.classList.toggle(`${g}--system-card-replaced`, t);
  const r = fo(e);
  if (!r || (r.classList.toggle(`${g}__host--system-card-replaced`, t), !t) || r.getAttribute(Fr) === "true") return;
  const n = r.querySelector(`.${mt}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(Fr, "true");
}
function Bu() {
  try {
    return _a() === "replace";
  } catch {
    return !1;
  }
}
function pt(e, t) {
  if (Ee(e), e.querySelector(`[${Me}="${ne(t.pendingId)}"]`)) return;
  const r = ju(e, t);
  Hu(r, t), nd(r, od(t)).append(id(t));
}
function ju(e, t) {
  const r = e.querySelector(`.${mt}`);
  if (r)
    return r;
  const n = document.createElement("section");
  n.classList.add(mt, g);
  const o = document.createElement("header");
  o.classList.add(`${g}__header`);
  const a = document.createElement("span");
  a.classList.add(`${g}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Eu), s.textContent = qu(t);
  const i = document.createElement("span");
  return i.classList.add(so), i.textContent = t.summary, o.append(a, s, i), n.append(o), ud(e).append(n), n;
}
function qu(e) {
  const t = $(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function Hu(e, t) {
  const r = t.summaryLines ?? [], n = Ao(r, t);
  if (n) {
    Vu(e, n, t);
    return;
  }
  ad(e, r);
}
function Vu(e, t, r) {
  if (e.querySelector(`[${Mr}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(Ur, `${Ur}--${t.intent}`), n.setAttribute(Mr, "true"), t.castingCheck && Vr(n, Gu(t.castingCheck), r.pendingId, "casting"), zu(t) && Vr(n, Wu(t), r.pendingId, "effect"), Zu(n, t), Ju(n, t, r), rd(n, t), e.append(n);
}
function zu(e) {
  return e.intent !== "casting";
}
function Gu(e) {
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
function Wu(e) {
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
function Vr(e, t, r, n) {
  const o = document.createElement("section");
  o.classList.add(
    `${g}__workflow-section`,
    `${g}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${g}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${g}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, a.append(s), t.statusLabel) {
    const i = document.createElement("span");
    i.classList.add(`${g}__workflow-section-status`), i.textContent = t.statusLabel, a.append(i);
  }
  if (o.append(a), t.description) {
    const i = document.createElement("span");
    i.classList.add(`${g}__workflow-section-description`), i.textContent = t.description, o.append(i);
  }
  Ku(o, t), td(o, t.detailRows, r, n, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Ku(e, t) {
  const r = document.createElement("div");
  r.classList.add(`${g}__workflow-roll`);
  const n = document.createElement("span");
  n.classList.add(`${g}__workflow-roll-formula`), n.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${g}__workflow-roll-total`), o.textContent = String(t.total), r.append(n, o);
  const a = Yu(t.formula, t.diceBreakdown);
  a && r.append(a), e.append(r);
}
function Yu(e, t) {
  const r = Qu(t);
  if (r.length === 0) return null;
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-dice-tray`);
  for (const o of Xu(r, e)) {
    const a = document.createElement("span");
    a.classList.add(`${g}__workflow-die`), o.active || a.classList.add(`${g}__workflow-die--inactive`), a.textContent = String(o.value), n.append(a);
  }
  return n;
}
function Qu(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((n) => Number(n.trim())).filter((n) => Number.isFinite(n)).map((n) => Math.trunc(n)) : [];
}
function Xu(e, t) {
  if (e.length <= 1) return e.map((n) => ({ value: n, active: !0 }));
  const r = t.toLowerCase();
  return r.includes("kh") ? zr(e, "highest") : r.includes("kl") ? zr(e, "lowest") : e.map((n) => ({ value: n, active: !0 }));
}
function zr(e, t) {
  const r = t === "highest" ? Math.max(...e) : Math.min(...e);
  let n = !1;
  return e.map((o) => {
    const a = !n && o === r;
    return a && (n = !0), { value: o, active: a };
  });
}
function Zu(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Jd);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__roll-meta`);
  for (const o of r) {
    const a = document.createElement("span");
    a.classList.add(`${g}__roll-meta-pill`), a.textContent = o, n.append(a);
  }
  e.append(n);
}
function Ju(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${g}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = ed(t, r);
  o.append(a), s && o.append(s);
  const i = document.createElement("span");
  i.classList.add(`${g}__resistance-description`), i.textContent = t.resistance, n.append(o, i), t.resistanceRollResult && n.append(mo(t.resistanceRollResult)), e.append(n);
}
function ed(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${g}__resistance-roll-button`), r.setAttribute(Me, t.pendingId), r.setAttribute(eo, "true"), r.setAttribute(to, e.resistanceSkill), r.setAttribute(ro, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(no, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(oo, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${g}__resistance-roll-button--rolled`), r.setAttribute(ao, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${g}__resistance-roll-fallback`), o.textContent = "d20", r.append(n, o), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function mo(e) {
  const t = document.createElement("span");
  return t.classList.add(`${g}__resistance-roll-result`), t.textContent = ho(e), t;
}
function td(e, t, r, n, o) {
  const a = t.filter((p) => p.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${r}-roll-details-${n}`, i = document.createElement("button");
  i.type = "button", i.classList.add(`${g}__roll-detail-toggle`), i.setAttribute(Mt, s), i.setAttribute("aria-expanded", "false"), i.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${g}__roll-detail-list`), d.setAttribute(Jn, s), d.hidden = !0;
  for (const p of a) {
    const y = document.createElement("dt");
    y.textContent = p.label;
    const b = document.createElement("dd");
    b.textContent = p.value, d.append(y, b);
  }
  e.append(i, d);
}
function rd(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__workflow-notes`);
  for (const n of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = n, r.append(o);
  }
  e.append(r);
}
function nd(e, t) {
  const r = `[${vr}="${ne(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const o = document.createElement("div");
  o.classList.add(Su), o.setAttribute(vr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${g}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function od(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = Ao(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function ad(e, t) {
  if (t.length === 0) return;
  const r = sd(e);
  for (const n of t) {
    const o = em(n);
    if (r.querySelector(`[${Or}="${ne(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = n, a.setAttribute(Or, o), r.append(a);
  }
}
function sd(e) {
  const t = e.querySelector(`.${xr}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(xr), e.append(r), r;
}
function id(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${g}__button`), t.setAttribute(Me, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(io), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Fe, e.pendingId), t.setAttribute(Ot, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(dt, e.choiceGroupId), t.setAttribute(Zn, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function cd(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = ld(e);
  return `${t} → ${r}`;
}
function ld(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function ud(e) {
  return fo(e) ?? e;
}
function fo(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function po(e, t) {
  const r = Ue(e);
  if (!r) return;
  const n = r.querySelectorAll($u);
  for (const o of n)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Cd(o, t);
    }));
}
function gt(e) {
  const t = Ue(e);
  if (!t) return;
  const r = t.querySelectorAll(_u);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      dd(t, n);
    }));
}
function ht(e) {
  const t = Ue(e);
  if (!t) return;
  const r = t.querySelectorAll(Iu);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      md(t, n);
    }));
}
function dd(e, t) {
  const r = t.getAttribute(Mt);
  if (!r) return;
  const n = e.querySelector(`[${Jn}="${ne(r)}"]`);
  if (!n) return;
  const o = n.hidden;
  n.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function md(e, t) {
  const r = t.getAttribute(Me), n = t.getAttribute(to), o = t.getAttribute(ro) ?? (n ? Yn(n) : "Resistência");
  if (!r || !n) return;
  const a = gd(e, r), s = hd(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Au(s, n);
    await kd(d.roll);
    const p = {
      skill: n,
      skillLabel: o,
      formula: d.formula,
      total: d.total,
      targetName: s.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: d.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    fd(t, p), pd(t, p), Td(r, p), await wd(e, r, p);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function fd(e, t) {
  e.classList.add(`${g}__resistance-roll-button--rolled`), e.setAttribute(ao, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function pd(e, t) {
  const r = e.closest(`.${g}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${g}__resistance-roll-result`), o = n ?? mo(t);
  if (n) {
    n.textContent = ho(t);
    return;
  }
  r.append(o);
}
function gd(e, t) {
  const r = E.get(t);
  if (r) return r;
  const n = xe(e);
  return M(n)[t] ?? null;
}
function hd(e, t) {
  const r = e?.resistanceTargetActor;
  if (D(r)) return r;
  const o = e?.context?.targets.map(yt).find(D) ?? null;
  if (o) return o;
  const a = t.getAttribute(no) ?? e?.resistanceTargetActorId ?? null, s = a ? Ad(a) : null;
  return s || bd(
    t.getAttribute(oo) ?? e?.resistanceTargetName ?? yd(t)
  );
}
function yd(e) {
  const r = e.closest(`.${g}`)?.querySelector(`.${so}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const o = r.split(n), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function yt(e) {
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
function Ad(e) {
  const r = game.actors?.get?.(e);
  return D(r) ? r : go().map((a) => pe(a)).find((a) => a?.id === e) ?? null;
}
function bd(e) {
  const t = Z(e);
  if (!t) return null;
  const r = go().filter((a) => Z(Rd(a)) === t).map((a) => pe(a)).find(D) ?? null;
  if (r) return r;
  const o = game.actors?.find?.((a) => D(a) && Z(a.name) === t);
  return D(o) ? o : null;
}
function go() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Rd(e) {
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
function ho(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function kd(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Td(e, t) {
  const r = E.get(e);
  r && (r.resistanceRollResult = t);
}
async function wd(e, t, r) {
  const n = xe(e);
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
function xe(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return O(n?.get?.(r));
}
async function Cd(e, t) {
  const r = e.getAttribute(Fe);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    yo(e, e.getAttribute(Ot) ?? "✓ Automação aplicada"), $d(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function yo(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(io), e.removeAttribute(Fe), e.removeAttribute(Ot);
}
function $d(e) {
  const t = e.getAttribute(dt);
  if (!t) return;
  const r = e.closest(`.${g}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${dt}="${ne(t)}"]`;
  for (const o of r.querySelectorAll(n)) {
    if (o === e) continue;
    const a = o.getAttribute(Zn) ?? "✓ Outra opção escolhida";
    yo(o, a);
  }
}
function Ao(e, t) {
  const r = e.map(xt).filter(Xd), n = r.find((f) => f.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const o = $(e, "Forma"), a = $(e, "Custo"), s = $(e, "Dados") ?? $(e, `Dados (${n.label})`), i = $(e, "Tipo"), d = $(e, "Resistência"), p = $(e, "Resistência Perícia"), y = $(e, "Resistência Rótulo") ?? (p ? Yn(p) : null), b = bo(e, "Observação"), k = e.filter((f) => Sd(f, n)), R = _d(e);
  return {
    ...n,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: s,
    damageType: i,
    resistance: d,
    resistanceSkill: p,
    resistanceSkillLabel: y,
    notes: b,
    details: k,
    castingCheck: R,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function _d(e) {
  const t = e.map(xt).find((a) => a?.intent === "casting") ?? null, r = $(e, "Conjuração DT"), n = $(e, "Conjuração Resultado");
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
function xt(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, n, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: r,
    formula: n,
    total: a,
    intent: Id(r)
  } : null;
}
function Id(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function $(e, t) {
  return bo(e, t)[0] ?? null;
}
function bo(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const o = n.slice(r.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Sd(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || xt(e) ? !1 : e.trim().length > 0;
}
function Ed(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of E.values())
    At(n, e, t) && r.set(n.pendingId, n);
  for (const n of vd(e))
    At(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, o) => n.createdAt - o.createdAt);
}
function At(e, t, r) {
  const n = B(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !Gr(r, "itemId", e.itemId) ? !1 : !e.actorId || Gr(r, "actorId", e.actorId);
}
function Gr(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${tm(t)}`;
  for (const o of e.querySelectorAll(`[${n}]`))
    if (o.getAttribute(n) === r)
      return !0;
  return !1;
}
function Pd(e) {
  const t = ne(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Ld(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (At(e, null, t))
      return t;
  return null;
}
function Nd() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of E.entries())
    e - n.createdAt > t && E.delete(r);
}
async function Wr(e, t) {
  const r = xe(e);
  if (!r) return !1;
  try {
    const n = M(r);
    return n[t.pendingId] = jt(t, B(r)), await re(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function Ut(e) {
  const t = wo(e);
  if (!t) return !1;
  try {
    const r = M(t);
    return r[e.pendingId] = jt(e, B(t)), await re(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function Ro(e) {
  for (const t of Pu)
    globalThis.setTimeout(() => {
      bt(e);
    }, t);
}
async function bt(e) {
  const t = wo(e);
  if (Bt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const n = await Ut(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function Dd(e, t) {
  const r = To(e.context.message);
  if (r)
    try {
      const n = M(r), o = n[e.pendingId] ?? jt(e, B(r));
      n[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await re(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function vd(e) {
  return Object.values(M(O(e))).filter(Ae);
}
function M(e) {
  if (!e) return {};
  const t = {}, r = Bt(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, o] of Object.entries(ko(e)))
    t[n] ??= o;
  return t;
}
function Od(e) {
  return Object.values(ko(O(e))).filter(Ae);
}
function ko(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, Qn);
  if (!J(t))
    return {};
  const r = {};
  for (const [n, o] of Object.entries(t))
    Ae(o) && (r[n] = o);
  return r;
}
async function re(e, t) {
  typeof e.setFlag == "function" && (await Fd(e, t), await Md(e, t));
}
async function Md(e, t) {
  await Promise.resolve(e.setFlag?.(l, Qn, t));
}
function Bt(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, Xn);
  return Yd(t) ? t : null;
}
async function Fd(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(Ae).sort((a, s) => a.createdAt - s.createdAt);
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
      actorName: xd(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(l, Xn, o));
}
function xd(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function jt(e, t) {
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
function To(e) {
  const t = O(e);
  if (t?.setFlag)
    return t;
  const r = Ud(e);
  if (r?.setFlag)
    return r;
  const n = B(e);
  if (!n) return null;
  const o = game.messages;
  return O(o?.get?.(n));
}
function Ud(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(O).find((r) => typeof r?.setFlag == "function") ?? null;
}
function wo(e) {
  const t = To(e.context.message);
  if (t) return t;
  const r = e.messageId ? Bd(e.messageId) : null;
  if (r) return r;
  const n = _o().slice().reverse();
  return n.find((o) => jd(o, e)) ?? n.find((o) => qd(o, e)) ?? null;
}
function Bd(e) {
  const t = game.messages;
  return O(t?.get?.(e));
}
function jd(e, t) {
  const r = B(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!Co(e, t)) return !1;
  const o = $o(e);
  return !t.actorId || !o || o === t.actorId;
}
function qd(e, t) {
  if (!Vd(e, t)) return !1;
  const r = $o(e);
  return t.actorId && r === t.actorId ? !0 : Co(e, t);
}
function Co(e, t) {
  const r = Z(Hd(e));
  if (!r) return !1;
  const n = Z(t.itemName);
  if (n && r.includes(n)) return !0;
  const o = Z(t.itemId);
  return !!(o && r.includes(o));
}
function Hd(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function $o(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Vd(e, t) {
  const r = zd(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= Lu;
}
function zd(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function O(e) {
  return e && typeof e == "object" ? e : null;
}
function Ae(e) {
  return J(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && _(e.messageId) && _(e.itemId) && _(e.actorId) && _(e.itemName) && z(e.resistanceTargetActorId) && z(e.resistanceTargetName) && Qd(e.resistanceRollResult) && Gd(e.actionPayload) && Qe(e.title) && Qe(e.buttonLabel) && Qe(e.executedLabel) && z(e.choiceGroupId) && z(e.skippedLabel) && z(e.actionSectionId) && z(e.actionSectionTitle) && Zd(e.summaryLines) : !1;
}
function Gd(e) {
  return e == null ? !0 : J(e) ? e.kind === "resource-operation" && _(e.actorId) && _(e.actorUuid) && typeof e.actorName == "string" && Wd(e.resource) && Kd(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Wd(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Kd(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Yd(e) {
  return J(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && _(e.messageId) && J(e.source) && _(e.source.actorId) && _(e.source.actorName) && _(e.source.itemId) && _(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Ae) : !1;
}
function Qd(e) {
  return e == null ? !0 : J(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Xd(e) {
  return e !== null;
}
function J(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function _(e) {
  return e === null || typeof e == "string";
}
function Qe(e) {
  return e === void 0 || typeof e == "string";
}
function z(e) {
  return e == null || typeof e == "string";
}
function Zd(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Jd(e) {
  return typeof e == "string" && e.length > 0;
}
function _o() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(O).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(O).filter((n) => n !== null) : [];
}
function Ue(e) {
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
function em(e) {
  return e.trim().toLowerCase();
}
function tm(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ne(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Kr = 1e3;
class rm {
  constructor(t, r, n, o) {
    this.workflow = t, this.resources = r, this.debugOutput = o, this.ritualAssistant = new vl(t, r, n);
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
      settings: Qt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = Qt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = kt(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && nm(t.item) && r.executionMode === "ask") {
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
    if (await _r(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ze(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await Ye(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const n = await this.ritualAssistant.applyAction(r.action);
    return n.ok ? (r.workflowContext.resourceTransactions.push(n.value), this.pendingExecutions.delete(t), await Ye(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(n), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = Ft(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, o = sm(n);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const a = await Ie(this.resources, o, n.resource, n.operation, n.amount);
    return a.ok ? (await Ou(t), await Mu(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Du((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await _r(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ze(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, om(t.item));
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
      a.kind === "resource-action" && (this.pendingExecutions.delete(o), await Ye(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, r) {
    const n = Je();
    await vu({
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
    for (const s of n) {
      const i = Je();
      a ??= i, this.pendingExecutions.set(i, {
        kind: "resource-action",
        id: i,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await jr({
        pendingId: i,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: s.choiceGroupId ?? null,
        skippedLabel: s.choiceGroupResolvedLabel ?? null,
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: am(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), u.info("Ritual assistido preparado com ações pendentes.", K(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = Je();
    this.pendingExecutions.set(n, {
      kind: "workflow",
      id: n,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await jr({
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
    const r = Date.now(), n = Yr(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      r - s > Kr && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(n);
    return o !== void 0 && r - o <= Kr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Yr(t), Date.now());
  }
  setAttempt(t, r, n, o) {
    this.lastAttempt = Ze(t, r, n, o);
  }
}
function nm(e) {
  return e.type === "ritual";
}
function om(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function am(e) {
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
function sm(e) {
  const t = e.actorUuid ? im(e.actorUuid) : null;
  if (ee(t)) return t;
  const r = e.actorId ? cm(e.actorId) : null;
  return r || lm(e.actorName);
}
function im(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function cm(e) {
  const r = game.actors?.get?.(e);
  if (ee(r)) return r;
  for (const n of Io()) {
    const o = qt(n);
    if (o?.id === e) return o;
  }
  return null;
}
function lm(e) {
  const t = Xe(e);
  if (!t) return null;
  for (const o of Io()) {
    const a = um(o);
    if (Xe(a) === t) {
      const s = qt(o);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((o) => ee(o) && Xe(o.name) === t);
  return ee(n) ? n : null;
}
function Io() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function um(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : qt(e)?.name ?? null;
}
function qt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ee(t)) return t;
  const r = e.document?.actor;
  return ee(r) ? r : null;
}
function Xe(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ee(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ze(e, t, r, n) {
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
function Yr(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function Je() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class dm {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], o = [], a = he(t);
    for (const s of r) {
      const i = s.itemId ? a.find((y) => y.id === s.itemId) ?? null : null, d = s.match?.preset ?? null;
      if (!i || !d) {
        o.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(i, d);
      const p = await this.itemPatches.applyPresetItemPatch(i, d);
      n.push({
        itemId: i.id ?? null,
        itemName: i.name ?? "Ritual sem nome",
        presetId: d.id,
        presetLabel: d.label,
        previousStatus: s.status,
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
class mm {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = he(t).map((i) => this.analyzeRitual(i)), n = r.filter(Ce("upToDate")), o = r.filter(Ce("available")), a = r.filter(Ce("outdated")), s = r.filter(Ce("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: r.length,
      upToDate: n,
      available: o,
      outdated: a,
      unsupported: s,
      canApply: o.length > 0 || a.length > 0
    };
  }
  getApplicableEntries(t) {
    const r = this.analyzeActor(t);
    return [...r.available, ...r.outdated];
  }
  analyzeRitual(t) {
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = fm(t);
    return r ? n ? n.source.type !== "preset" ? ie({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Automação manual encontrada. Preset sugerido: ${r.preset.label}.`
    }) : n.source.presetId === r.preset.id && n.source.presetVersion === r.preset.version ? ie({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Preset ${r.preset.label} v${r.preset.version} já aplicado.`
    }) : ie({
      ritual: t,
      status: "outdated",
      match: r,
      flag: n,
      reason: pm(n, r.preset)
    }) : ie({
      ritual: t,
      status: "available",
      match: r,
      flag: n,
      reason: `Preset encontrado: ${r.preset.label}.`
    }) : ie({
      ritual: t,
      status: "unsupported",
      match: r,
      flag: n,
      reason: n ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function ie(e) {
  const t = e.flag?.source, r = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? Ne(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function fm(e) {
  const t = e.getFlag(l, "automation");
  return Tt(t) ? t : null;
}
function pm(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Ce(e) {
  return (t) => t.status === e;
}
class gm {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), n = Ct(t.transaction);
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
    const r = A(t.actorName), n = A(t.resource), o = A(Qr(t)), a = A(ym(t));
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
    const n = A(r.title ?? "Automação"), o = r.message ? `<p>${A(r.message)}</p>` : "", a = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = A(t.item.name ?? "Item sem nome"), i = t.targets.length > 0 ? t.targets.map((f) => A(f.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (f) => `<li><strong>${A(f.id)}:</strong> ${A(f.formula)} = ${f.total} <em>(${A(hm(f.intent))})</em>${f.damageType ? ` — ${A(f.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (f) => `<li><strong>${A(f.itemName)}:</strong> ${f.circle}º círculo — ${f.amount} ${A(f.resource)} (${A(Am(f.source))})</li>`
    ), y = t.damageInstances.map(
      (f) => `<li><strong>${A(f.targetActorName)}:</strong> bruto ${f.rawAmount}${f.damageType ? ` ${A(f.damageType)}` : ""} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), b = t.healingInstances.map(
      (f) => `<li><strong>${A(f.targetActorName)}:</strong> bruto ${f.rawAmount} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), k = t.resourceTransactions.map(
      (f) => `<li><strong>${A(f.actorName)}:</strong> ${A(Qr(f))} — ${f.before.value}/${f.before.max} &rarr; ${f.after.value}/${f.after.max}</li>`
    ), R = t.phases.map((f) => A(f)).join(" &rarr; ");
    return `
      <section class="${l}-card ${l}-workflow-card">
        <header class="${l}-card__header">
          <strong>${n}</strong>
          <span>${s}</span>
        </header>
        <div class="${l}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${i}</p>
          ${p.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${p.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p><strong>Cura:</strong></p><ul>${b.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${k.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p class="${l}-workflow-card__phases"><strong>Fases:</strong> ${R}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function hm(e) {
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
function Qr(e) {
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
function ym(e) {
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
function Am(e) {
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
function bm() {
  const e = new Ri(), t = new pc(e), r = new wi(), n = new _i(r), o = new Bi(e), a = new qi(), s = a.registerMany(aa());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new ji(), d = new xi(), p = jc(), y = new $c(p), b = new mm(a), k = new dm(b, i, d), R = new Ac(), f = new gm(R), oe = new yc(), ae = new mc(t, n, f, oe), se = new hc(ae, oe), T = new rm(se, t, n, R);
  return T.addStrategy(new Mi((F) => T.handleItemUsed(F))), {
    ordem: o,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: n,
    resources: t,
    automationRegistry: a,
    automationBinder: i,
    itemPatches: d,
    conditionRegistry: p,
    conditions: y,
    debugOutput: R,
    chatMessages: f,
    workflowHooks: oe,
    automation: ae,
    workflow: se,
    itemUseIntegration: T,
    ritualPresetDiagnostic: b,
    ritualPresetApplications: k
  };
}
const { ApplicationV2: Rm } = foundry.applications.api;
class Pe extends Rm {
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
      apply: Pe.onApply,
      cancel: Pe.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${P(Rt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${P(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${et("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${et("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${et("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function et(e, t, r, n) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${n}"></i>
        <span>${P(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? km(r) : wm(t)}
    </section>
  `;
}
function km(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Tm).join("")}</ol>`;
}
function Tm(e) {
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
function wm(e) {
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
const Le = `${l}.manageRitualPresets`, Xr = `__${l}_ritualPresetHeaderControlRegistered`, Cm = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function $m(e) {
  const t = globalThis;
  if (!t[Xr]) {
    for (const r of Cm)
      Hooks.on(r, (n, o) => {
        _m(n, o, e);
      });
    t[Xr] = !0, u.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function _m(e, t, r) {
  Array.isArray(t) && Sm(e) && (Im(e, r), !t.some((n) => n.action === Le) && t.push({
    action: Le,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), So(e, r);
    }
  }));
}
function Im(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Le] && (e.options.actions[Le] = (r) => {
    r.preventDefault(), r.stopPropagation(), So(e, t);
  }));
}
function Sm(e) {
  if (!game.user?.isGM) return !1;
  const t = Eo(e);
  return t ? t.type === "agent" && he(t).length > 0 : !1;
}
function So(e, t) {
  const r = Eo(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Pe(r, t).render({ force: !0 });
}
function Eo(e) {
  return Zr(e.actor) ? e.actor : Zr(e.document) ? e.document : null;
}
function Zr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let W = null;
Hooks.once("init", () => {
  ra(), $a(), Ja(), bi(), u.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Jt.isSupportedSystem()) {
    u.warn(
      `Sistema não suportado: ${Jt.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  W = bm(), W.itemUseIntegration.registerStrategies(), Xa(W.conditions), Fa(W), Ka(), Va(), $m(W), u.info("Inicializado para o sistema Ordem Paranormal."), u.info(`API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Rt} inicializado.`);
});
function Em() {
  if (!W)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return W;
}
export {
  Em as getToolkitServices
};
//# sourceMappingURL=main.js.map
