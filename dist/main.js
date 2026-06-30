const l = "paranormal-toolkit", kt = "Paranormal Toolkit", Do = "ordemparanormal";
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
function Tt(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? m({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : wt(t) ? h(t.definition) : m({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function vo(e) {
  return wt(e.getFlag(l, "automation"));
}
function wt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && Mo(t.source) && Oo(t.definition);
}
function Oo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && I(t.label) && Array.isArray(t.steps) && t.steps.every(Fo);
}
function Mo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? I(t.presetId) && I(t.presetVersion) && I(t.appliedAt) : t.type === "manual" ? I(t.label) && I(t.appliedAt) : !1;
}
function Fo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return xo(t);
    case "spendRitualCost":
      return Uo(t);
    case "rollFormula":
      return Bo(t);
    case "modifyResource":
      return jo(t);
    case "chatCard":
      return qo(t);
    default:
      return !1;
  }
}
function xo(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && rn(t);
}
function Uo(e) {
  return e.type === "spendRitualCost";
}
function Bo(e) {
  const t = e;
  return t.type === "rollFormula" && I(t.id) && I(t.formula) && (t.intent === void 0 || Go(t.intent)) && (t.damageType === void 0 || I(t.damageType));
}
function jo(e) {
  const t = e;
  return t.type === "modifyResource" && Ho(t.actor) && Vo(t.resource) && zo(t.operation) && rn(t);
}
function qo(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function rn(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || I(e.amountFrom);
}
function Ho(e) {
  return e === "self" || e === "target";
}
function Vo(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function zo(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Go(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function I(e) {
  return typeof e == "string" && e.length > 0;
}
function Ct(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(Gt);
    if (Yo(t))
      return Array.from(t).filter(Gt);
  }
  return [];
}
function Wo(e) {
  return Ct(e)[0] ?? null;
}
function Ko(e) {
  return Ct(e).find(vo) ?? null;
}
function Yo(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Gt(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function he(e) {
  return Ct(e).filter((t) => t.type === "ritual");
}
function nn(e) {
  return he(e)[0] ?? null;
}
function Qo(e) {
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
      const n = e.automationRegistry.findForItem(r).map(Yt);
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
      const a = await rt(e, n, o.value);
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
      const o = await rt(e, r, n.preset);
      u.info(`Melhor preset aplicado em ${r.name}.`, { match: Yt(n), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Wt(e);
    },
    async applyBestPresetsToActorRituals() {
      return Wt(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = ce("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = be(t);
      r && (await e.automationBinder.clear(r), u.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function Wt(e) {
  const t = ce("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = he(t);
  if (r.length === 0)
    return u.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Kt(t);
  const n = Kt(t, r.length);
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
    const i = await rt(e, o, a.preset);
    n.applied.push(Xo(o, a, i));
  }
  return u.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), Zo(n), n;
}
async function rt(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function Xo(e, t, r) {
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
function Kt(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Zo(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((n) => n.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function Yt(e) {
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
  const t = nn(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function K(e) {
  return e ? {
    id: e.id,
    source: {
      ...Jo(e.sourceActor),
      token: e.sourceToken
    },
    item: ea(e.item),
    targets: e.targets.map(ta),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Qt(e.rollRequests, on),
    rolls: Qt(e.rolls, ra),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map($t),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function $t(e) {
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
function Jo(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function ea(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function ta(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function on(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function ra(e) {
  return {
    ...on(e),
    total: e.total
  };
}
function Qt(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function na(e) {
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
    oa(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (i) {
    u.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  u.info(`${t} realizado:`, $t(a));
}
function j(e) {
  const t = ge.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function oa(e) {
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
function aa() {
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
function nt() {
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
function ia() {
  return {
    status() {
      return nt();
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
const an = "ritual.costOnly", sn = "ritual.simpleHealing", sa = "ritual.eletrocussao", cn = "ritual.simpleDamage", ln = "generic.simpleHealing", un = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function ca() {
  return [
    la(),
    ua(),
    da(),
    ma(),
    fa()
  ];
}
function la() {
  return {
    id: an,
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
function ua() {
  return {
    id: sn,
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
    automation: dn(),
    itemPatch: ga()
  };
}
function da() {
  return {
    id: sa,
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
    automation: pa(),
    itemPatch: ha()
  };
}
function ma() {
  return {
    id: cn,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: _t()
  };
}
function fa() {
  return {
    id: ln,
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
function dn(e = "2d8+2") {
  return mn(
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
function pa() {
  return {
    ..._t("3d6", {
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
function _t(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return mn(
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
function ga() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: un,
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
function ha() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: un,
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
function mn(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((n) => n.type !== "rollFormula" || n.id !== t ? n : {
      ...n,
      formula: r
    })
  };
}
function It() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Q(t.id),
    actorId: Q(t.actor?.id),
    sceneId: Q(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function fn() {
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
function ya(e) {
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
        if (!Ra(t, r)) {
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
      const n = e.automationRegistry.require(an);
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
      if (!Xt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(sn);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: dn(t)
      }), u.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = q("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = H(r);
      if (!n) return;
      if (!Xt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(cn);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: _t(t)
      }), u.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = q("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = H(t);
      r && await Aa(e, t, r);
    }
  };
}
async function Aa(e, t, r) {
  const n = Tt(r);
  if (!n.ok) {
    u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: fn(),
    item: r,
    targets: It()
  });
  if (!o.ok) {
    ba(o.error);
    return;
  }
  u.info("Automação de ritual executada com sucesso.", K(o.value.context));
}
function ba(e) {
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
  const t = nn(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ra(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Xt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const ka = ["disabled", "ask", "automatic"], Ta = ["buttons", "confirm"], pn = "ask";
function wa(e) {
  return typeof e == "string" && ka.includes(e);
}
function Ca(e) {
  return typeof e == "string" && Ta.includes(e);
}
function $a(e) {
  return wa(e) ? e : Ca(e) ? "ask" : pn;
}
const _a = ["keep", "replace"], gn = "keep", Ia = !0, N = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Sa() {
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
    default: pn
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
    default: gn
  }), game.settings.register(l, N.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Ia
  }), game.settings.register(l, N.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Zt() {
  const e = $a(game.settings.get(l, N.executionMode)), t = yn(game.settings.get(l, N.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: hn()
  };
}
function Ea() {
  return yn(game.settings.get(l, N.systemCardMode));
}
function hn() {
  return game.settings.get(l, N.ritualCastingCheckEnabled) === !0;
}
async function V(e) {
  await game.settings.set(l, N.executionMode, e);
}
function yn(e) {
  return _a.includes(e) ? e : gn;
}
function Pa(e) {
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
const La = [
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
function Na(e) {
  return {
    phases() {
      return La;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Be("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = Ko(t);
      if (!r) {
        u.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Jt(e, t, r);
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
      if (!Oa(r)) {
        u.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = va(r) ?? Be("Nenhum ator encontrado para executar automação do item.");
      n && await Jt(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Be("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = Wo(t);
      if (!r) {
        u.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(ln);
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
async function Jt(e, t, r) {
  const n = Tt(r);
  if (!n.ok) {
    u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: fn(),
    item: r,
    targets: It()
  });
  if (!o.ok) {
    Da(o.error);
    return;
  }
  u.info("Automação executada com sucesso.", K(o.value.context));
}
function Da(e) {
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
function va(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Oa(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ma(e) {
  const t = na(e), r = Qo(e), n = ya(e), o = Na(e), a = ia(), i = Pa(e);
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
function Fa(e) {
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
      const n = er();
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
      return xa(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const r = er();
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
      return Ua(n), n;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function er() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const r of e) {
    const n = r.actor ?? r.document?.actor ?? null;
    if (!n) continue;
    const a = n.uuid ?? null ?? n.id ?? n.name ?? `selected-${t.size}`;
    t.set(a, n);
  }
  return Array.from(t.values());
}
function xa(e) {
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
function Ua(e) {
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
function Ba(e) {
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
    conditions: Fa(e.conditions),
    debug: Ma(e)
  }, r = globalThis;
  return r[l] = t, r.ParanormalToolkit = t, t;
}
class tr {
  static isSupportedSystem() {
    return game.system.id === Do;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function ja() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: X(t.id),
    actorId: X(t.actor?.id),
    sceneId: X(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function An() {
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
function qa(e, t = An()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Ha(e) {
  if (!Ga(e)) return null;
  const t = e.getFlag(l, "workflow");
  return za(t) ? t : null;
}
function Va() {
  return `flags.${l}.workflow`;
}
function rr(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${l}`), r = foundry.utils.getProperty(e, `_source.flags.${l}`);
  return t !== void 0 || r !== void 0;
}
function nr(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return ot(t) || ot(r);
}
function za(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Ga(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function X(e) {
  return ot(e) ? e : null;
}
function ot(e) {
  return typeof e == "string" && e.length > 0;
}
function Wa() {
  const e = (t, r) => {
    Ka(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Ka(e, t) {
  const r = Ha(e);
  if (!r || r.targets.length === 0) return;
  const n = Qa(t);
  if (!n || n.querySelector(`.${l}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(Ya(r));
}
function Ya(e) {
  const t = document.createElement("section");
  t.classList.add(`${l}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(or("Origem", e.source.name)), t.append(or("Alvo", e.targets.map((n) => n.name).join(", "))), t;
}
function or(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${l}-chat-enrichment__row`);
  const n = document.createElement("span");
  n.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, r.append(n, o), r;
}
function Qa(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Xa() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!Za(n) || !Ja(e) || rr(e) || rr(t)) return;
    const o = ja();
    if (o.length === 0 || !nr(e) && !nr(t)) return;
    const a = An();
    e.updateSource({
      [Va()]: qa(o, a)
    }), u.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Za(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Ja(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let ar = !1, je = !1, qe = !1;
const ei = 1e3, ti = 1e3;
function ri(e) {
  ar || (Hooks.on("deleteCombat", (t) => {
    oi(e, ai(t));
  }), ar = !0, ni(e));
}
function ni(e) {
  je || (je = !0, globalThis.setTimeout(() => {
    je = !1, bn(e, "ready");
  }, ei));
}
function oi(e, t) {
  t && (qe || (qe = !0, globalThis.setTimeout(() => {
    qe = !1, bn(e, "combat-deleted", t);
  }, ti)));
}
async function bn(e, t, r) {
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
function ai(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Rn = {
  enabled: "dice.animations.enabled"
};
function ii() {
  game.settings.register(l, Rn.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function si() {
  return {
    enabled: game.settings.get(l, Rn.enabled) === !0
  };
}
const ci = "chatCard", ir = "data-paranormal-toolkit-prompt-id", c = `${l}-item-use-prompt`, li = `.${c}__title`, kn = `.${c}__header`, di = `.${c}__roll-card`, mi = `.${c}__roll-meta`, fi = `.${c}__roll-meta-pill`, pi = `.${c}__resistance`, gi = `.${c}__resistance-header`, Tn = `.${c}__resistance-description`, hi = `.${c}__resistance-roll-button`, yi = `.${c}__resistance-roll-result`, sr = `${c}__resistance-content`, wn = `.${c}__workflow-section`, Cn = `.${c}__workflow-roll`, $n = `${c}__workflow-roll--dice-open`, _n = `.${c}__workflow-roll-formula`, In = `${c}__workflow-roll-formula--toggle`, St = `.${c}__workflow-dice-tray`, Ai = `.${c}__roll-detail-toggle`, bi = `.${c}__roll-detail-list`, Ri = `.${c}__ritual-element-badge`, ki = `.${c}__ritual-metadata`, Ti = "casting-backlash", wi = "data-paranormal-toolkit-action-section", Ci = "data-paranormal-toolkit-prompt-id", $i = "data-paranormal-toolkit-pending-id", cr = "data-paranormal-toolkit-casting-backlash-enhanced", lr = `.${c}`, _i = `.${c}__workflow-section--casting`, Ii = `.${c}__workflow-section-header`, Si = `.${c}__workflow-notes`, Ei = `[${wi}="${Ti}"]`, ur = `${c}__workflow-section-title-row`, Pi = `${c}__workflow-section-header--casting-backlash`, Sn = `${c}__casting-backlash-button`;
function Li(e) {
  for (const t of Ni(e))
    Di(t), xi(t);
}
function Ni(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(lr) && t.add(e);
  for (const r of e.querySelectorAll(lr))
    t.add(r);
  return Array.from(t);
}
function Di(e) {
  const t = e.querySelector(Ei);
  if (!t) return;
  const r = vi(t);
  if (!r) return;
  const n = e.querySelector(`${_i} ${Ii}`);
  n && (n.classList.add(Pi), Oi(n), Mi(r), n.append(r), t.remove());
}
function vi(e) {
  return e.querySelector(
    `button[${$i}], button[${Ci}]`
  );
}
function Oi(e) {
  const t = e.querySelector(`:scope > .${ur}`);
  if (t) return t;
  const r = document.createElement("div");
  r.classList.add(ur);
  const n = Array.from(e.childNodes);
  e.prepend(r);
  for (const o of n)
    o !== r && (o instanceof HTMLButtonElement && o.classList.contains(Sn) || r.append(o));
  return r;
}
function Mi(e) {
  if (e.getAttribute(cr) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", r = Fi(t, e.disabled);
  e.classList.add(Sn), e.setAttribute(cr, "true"), e.setAttribute("title", r), e.setAttribute("aria-label", r);
}
function Fi(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function xi(e) {
  for (const t of e.querySelectorAll(Si)) {
    for (const r of Array.from(t.children))
      (r.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && r.remove();
    t.children.length === 0 && t.remove();
  }
}
function Ui(e) {
  for (const t of Array.from(e.querySelectorAll(wn)))
    for (const r of Array.from(t.querySelectorAll(`${Ai}, ${bi}`)))
      r.remove();
}
function Bi(e) {
  for (const t of Array.from(e.querySelectorAll(pi)))
    ji(t);
}
function ji(e) {
  const t = e.querySelector(gi), r = e.querySelector(Tn), n = e.querySelector(hi), o = e.querySelector(yi);
  if (!n || !t && !r && !o) return;
  const a = qi(e, n);
  t && t.parentElement !== a && a.append(t), r && r.parentElement !== a && a.append(r), o && o.parentElement !== a && !n.contains(o) && a.append(o), n.parentElement !== e && e.append(n);
}
function qi(e, t) {
  const r = e.querySelector(`.${sr}`);
  if (r) return r;
  const n = document.createElement("div");
  return n.classList.add(sr), e.insertBefore(n, t.parentElement === e ? t : e.firstChild), n;
}
function dr(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Et() {
  const e = globalThis.game;
  return De(e) ? e : null;
}
function S(e, t) {
  const r = Hi(e, t);
  return $e(r);
}
function Hi(e, t) {
  return t.split(".").reduce((r, n) => De(r) ? r[n] : null, e);
}
function Vi(e, t) {
  const r = e.indexOf(":");
  return r < 0 || fe(e.slice(0, r)) !== fe(t) ? null : te(e.slice(r + 1));
}
function $e(e) {
  return typeof e == "string" ? te(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function De(e) {
  return !!e && typeof e == "object";
}
function zi(e) {
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
function at(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function U(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function En(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Gi(e) {
  for (const t of Array.from(e.querySelectorAll(di))) {
    const r = Ji(t);
    Wi(t), r && (Ki(t, r), Yi(t, r));
  }
}
function Wi(e) {
  for (const t of Array.from(e.querySelectorAll(mi)))
    t.remove();
}
function Ki(e, t) {
  const n = e.closest(`.${c}`)?.querySelector(kn) ?? null, o = n?.querySelector(li) ?? null, a = n ?? e, i = a.querySelector(Ri);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const s = i ?? document.createElement("span");
  if (s.className = hs(t.elementTone), s.textContent = gs(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", s);
      return;
    }
    a.prepend(s);
  }
}
function Yi(e, t) {
  const r = Qi(e);
  Xi(e, r);
  const n = Zi(t);
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
  const a = e.querySelector(wn);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function Qi(e) {
  return e.closest(`.${c}`)?.querySelector(kn) ?? null;
}
function Xi(e, t) {
  const r = [e, t].filter((n) => n !== null);
  for (const n of r)
    for (const o of Array.from(n.querySelectorAll(ki)))
      o.remove();
}
function Zi(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${at(e.target)}` : null,
    e.duration ? `Duração: ${at(e.duration)}` : null,
    e.resistance ? `Resistência: ${En(e.resistance)}` : null
  ].filter(ve);
}
function Ji(e) {
  const t = es(e), r = is(e), o = (t ? as(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = Pt(S(o, "element")), s = v("op.elementChoices", i) ?? mr(G(a, "Elemento")) ?? mr(r.damageType), d = i ?? ys(s), p = S(o, "circle") ?? G(a, "Círculo"), y = ls(o) ?? G(a, "Alvo"), b = fs(o, "duration", "op.durationChoices") ?? G(a, "Duração"), k = ss(e) ?? ds(o) ?? G(a, "Resistência"), R = cs(a) ?? r.cost, f = {
    elementLabel: s,
    elementTone: d,
    circle: p,
    cost: R,
    target: y,
    duration: b,
    resistance: k
  };
  return ps(f) ? f : null;
}
function es(e) {
  const t = ts(e);
  if (!t) return null;
  const r = t.getFlag?.(l, ci), n = ns(r);
  if (n.length === 0) return null;
  const o = rs(e);
  if (o.size > 0) {
    const a = n.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return n.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function ts(e) {
  const r = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return r ? Et()?.messages?.get?.(r) ?? null : null;
}
function rs(e) {
  const t = e.closest(`.${c}`) ?? e, r = /* @__PURE__ */ new Set();
  for (const n of Array.from(t.querySelectorAll(`[${ir}]`))) {
    const o = n.getAttribute(ir)?.trim();
    o && r.add(o);
  }
  return r;
}
function ns(e) {
  if (!De(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(os).filter((r) => r !== null) : [];
}
function os(e) {
  return De(e) ? {
    pendingId: $e(e.pendingId),
    actorId: $e(e.actorId),
    itemId: $e(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(zi) : []
  } : null;
}
function as(e) {
  if (!e.itemId) return null;
  const t = Et(), n = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return n || (t?.items?.get?.(e.itemId) ?? null);
}
function is(e) {
  let t = null, r = null;
  for (const n of Array.from(e.querySelectorAll(fi))) {
    const o = te(n.textContent);
    if (!o) continue;
    const a = Vi(o, "Tipo");
    a && (r = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: r };
}
function ss(e) {
  const t = te(e.querySelector(Tn)?.textContent);
  return t ? En(t) : null;
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
function cs(e) {
  const t = G(e, "Custo") ?? G(e, "PE");
  return t || (e.map(te).find((r) => typeof r == "string" && /\b(P[ED]|PE|PD)\b/iu.test(r)) ?? null);
}
function ls(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return us(e) ?? v("op.targetChoices", t) ?? "Área";
  const r = v("op.targetChoices", t) ?? U(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, r].filter(ve).join(" ");
}
function us(e) {
  const t = S(e, "area.name"), r = S(e, "area.size"), n = S(e, "area.type"), o = t ? v("op.areaChoices", t) ?? U(t) : null, a = n ? v("op.areaTypeChoices", n) ?? U(n) : null;
  return o ? r ? a ? `${o} ${r}m ${at(a)}` : `${o} ${r}m` : o : null;
}
function ds(e) {
  const t = S(e, "skillResis"), r = S(e, "resistance");
  if (!t || !r) return null;
  const n = v("op.skill", t) ?? U(t), o = ms(r);
  return [n, o].filter(ve).join(" ");
}
function ms(e) {
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
function fs(e, t, r) {
  const n = S(e, t);
  return n ? v(r, n) ?? U(n) : null;
}
function ps(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function gs(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function hs(e) {
  return [
    `${c}__ritual-element-badge`,
    e ? `${c}__ritual-element-badge--${e}` : null
  ].filter(ve).join(" ");
}
function Pt(e) {
  const t = fe(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function mr(e) {
  const t = Pt(e);
  return t ? v("op.elementChoices", t) ?? U(t) : e ? U(e) : null;
}
function ys(e) {
  return Pt(e);
}
function v(e, t) {
  if (!t) return null;
  const r = `${e}.${t}`, n = Et()?.i18n?.localize?.(r);
  return !n || n === r ? null : n;
}
const fr = "data-paranormal-toolkit-dice-toggle-enhanced";
function As(e) {
  for (const t of Array.from(e.querySelectorAll(Cn)))
    Pn(t);
}
function bs(e) {
  const t = Nn(e.target);
  if (!t) return;
  const r = Lt(t);
  r && (e.preventDefault(), Ln(r, t));
}
function Rs(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Nn(e.target);
  if (!t) return;
  const r = Lt(t);
  r && (e.preventDefault(), Ln(r, t));
}
function Pn(e) {
  const t = e.querySelector(St);
  if (!t) return;
  const r = e.querySelector(_n);
  if (r && r.getAttribute(fr) !== "true" && (r.setAttribute(fr, "true"), r.classList.add(In), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", "false"), r.title = "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title), t.hidden = !0, !r.querySelector("i"))) {
    const n = document.createElement("i");
    n.classList.add("fa-solid", "fa-chevron-down"), n.setAttribute("aria-hidden", "true"), r.append(n);
  }
}
function Ln(e, t) {
  const r = e.querySelector(St);
  if (!r) return;
  const n = !e.classList.contains($n);
  ks(e, t, r, n);
}
function ks(e, t, r, n) {
  e.classList.toggle($n, n), r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.title = n ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !n), o.classList.toggle("fa-chevron-up", n));
}
function Nn(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(_n);
  if (!t) return null;
  const r = Lt(t);
  return r ? (Pn(r), t.classList.contains(In) ? t : null) : null;
}
function Lt(e) {
  const t = e.closest(Cn);
  return t && t.querySelector(St) ? t : null;
}
const pr = `${l}-workflow-dice-toggle-styles`;
function Ts() {
  if (document.getElementById(pr)) return;
  const e = document.createElement("style");
  e.id = pr, e.textContent = `
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
const ws = [0, 100, 500, 1500, 3e3];
let gr = !1, He = null;
function Cs() {
  if (!gr) {
    gr = !0, Ts(), Hooks.on("renderChatMessageHTML", (e, t) => {
      le(dr(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      le(dr(t));
    }), Hooks.once("ready", () => {
      le(document), $s();
    }), document.addEventListener("click", bs), document.addEventListener("keydown", Rs);
    for (const e of ws)
      globalThis.setTimeout(() => le(document), e);
  }
}
function $s() {
  He || !document.body || (He = new MutationObserver((e) => {
    for (const t of e)
      for (const r of Array.from(t.addedNodes))
        (r instanceof HTMLElement || r instanceof DocumentFragment) && le(r);
  }), He.observe(document.body, { childList: !0, subtree: !0 }));
}
function le(e) {
  e && (Ui(e), Gi(e), Bi(e), As(e), Li(e));
}
function _s() {
  Cs();
}
const ue = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Dn = {
  PV: "system.attributes.hp"
}, it = {
  PV: [ue.PV, Dn.PV],
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
class Is {
  getResource(t, r) {
    const n = hr(t, r);
    if (!n.ok)
      return m(n.error);
    const o = n.value, a = `${o}.value`, i = `${o}.max`, s = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, i), p = Ar(t, r, a, s, "valor atual");
    if (p) return m(p);
    const y = Ar(t, r, i, d, "valor máximo");
    return y ? m(y) : h({
      value: s,
      max: d
    });
  }
  async updateResourceValue(t, r, n) {
    const o = hr(t, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: n });
  }
}
function hr(e, t) {
  const r = Ss(e.type, t);
  if (r && yr(e, r))
    return h(r);
  const n = it[t].find(
    (o) => yr(e, o)
  );
  return n ? h(n) : m({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Es(e, t),
    path: it[t].join(" | ")
  });
}
function Ss(e, t) {
  return e === "threat" ? Dn[t] ?? null : e === "agent" ? ue[t] : null;
}
function yr(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function Es(e, t) {
  const r = e.type ?? "unknown", n = it[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function Ar(e, t, r, n, o) {
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
class Ps {
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
      const i = st.ritualItem.circleCandidates;
      return m({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: n, value: o } = r, a = Ls(o);
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
function Ls(e) {
  if (br(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (br(r))
      return r;
  }
  return null;
}
function br(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Ns = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Ds {
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
    const n = r.value, o = vs(t.ritual, n);
    return o.ok ? o.value ? h(o.value) : h({
      resource: "PE",
      amount: Ns[n],
      source: "default-by-circle",
      circle: n
    }) : m(o.error);
  }
}
function vs(e, t) {
  const r = e.getFlag(l, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Os(r) ? {
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
function Os(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Ve = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ms(e) {
  if (!qs(e.item)) return null;
  const t = ct(e.actor) ? e.actor : Fs(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Us(e.token) ?? xs(t),
    targets: It(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Fs(e) {
  const t = e;
  return ct(t.actor) ? t.actor : ct(e.parent) ? e.parent : null;
}
function xs(e) {
  const t = Bs(e) ?? js(e);
  return t ? vn(t) : null;
}
function Us(e) {
  return lt(e) ? vn(e) : null;
}
function Bs(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return lt(r) ? r : (t.getActiveTokens?.() ?? []).find(lt) ?? null;
}
function js(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function vn(e) {
  const t = e.actor ?? null;
  return {
    tokenId: ze(e.id),
    actorId: ze(t?.id),
    sceneId: ze(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function qs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ct(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function lt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function ze(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Hs {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Ve.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, u.info(`${Ve.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = Ms(Vs(t));
    if (!r) {
      u.warn(`${Ve.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function Vs(e) {
  return e && typeof e == "object" ? e : {};
}
class zs {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return Ge("missing-item-patch");
    if (t.type !== "ritual") return Ge("unsupported-item-type");
    const o = Gs(n);
    return Object.keys(o).length === 0 ? Ge("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Gs(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (w(t, "system.circle", r.circle), w(t, "system.element", r.element), w(t, "system.target", r.target), w(t, "system.targetQtd", r.targetQuantity), w(t, "system.execution", r.execution), w(t, "system.range", r.range), w(t, "system.duration", r.duration), w(t, "system.skillResis", r.resistanceSkill), w(t, "system.resistance", r.resistance), w(t, "system.studentForm", r.studentForm), w(t, "system.trueForm", r.trueForm)), t;
}
function w(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function Ge(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Ws {
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
class Ks {
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
class Ys {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = Qs(t);
    return r.ok ? this.presets.has(t.id) ? m({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, We(t)), h(t)) : r;
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
    return r ? We(r) : null;
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
    return Array.from(this.presets.values()).map(We);
  }
  findForItem(t) {
    return this.list().map((r) => Xs(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function Qs(e) {
  return !Ke(e.id) || !Ke(e.version) || !Ke(e.label) ? m({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? m({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : h(e);
}
function Xs(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = Zs(o, t);
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
function Zs(e, t) {
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
      const r = Rr(t.name), n = e.names.map(Rr).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Js(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function Rr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Js(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function We(e) {
  return structuredClone(e);
}
function Ke(e) {
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
const ec = "dice-so-nice";
async function On(e) {
  if (!si().enabled || !tc()) return;
  const t = rc();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      u.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function tc() {
  return game.modules.get(ec)?.active === !0;
}
function rc() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function nc(e, t, r) {
  if (!kr(e.id) || !kr(e.formula))
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
    await On(o);
    const s = {
      ...r.rollRequests[e.id] ?? Mn(e, t),
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
function Mn(e, t) {
  const r = e.intent ?? oc(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function oc(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function kr(e) {
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
function ac(e) {
  const { step: t, context: r, transaction: n, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = ic(t, r, n, o);
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
    const i = sc(t, r, n, o);
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
function ic(e, t, r, n) {
  const o = Oe(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: Fn(t.id, "damage", n, t.damageInstances.length),
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
function sc(e, t, r, n) {
  const o = Oe(e.amountFrom);
  return {
    id: Fn(t.id, "healing", n, t.healingInstances.length),
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
function Fn(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function cc(e, t, r) {
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
function lc(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", r, { stepIndex: n, step: t, metadata: o }), xn("before", e), Tr("before", e), Tr("resolve", e);
}
function uc(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("apply", r, { stepIndex: n, step: t, metadata: o }), xn("apply", e);
}
function dc(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", r, { stepIndex: n, step: t, metadata: o });
}
function xn(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: i } = t, s = mc(e, r.operation);
  s && i.emit(s, n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function Tr(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: i } = t;
  r.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function mc(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function fc(e, t, r) {
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
async function pc(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return gc(e, t);
    case "spendRitualCost":
      return hc(e, t);
  }
}
async function gc(e, t) {
  const { context: r, resources: n } = e, o = _e(t, r);
  return o.ok ? Un(await n.spend(r.sourceActor, t.resource, o.value), r) : m(o.error);
}
async function hc(e, t) {
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
  }), Un(await n.spend(r.sourceActor, i.resource, i.amount), r, t);
}
function Un(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), h(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), m({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function yc(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: o, execute: a } = e, i = Ac(t);
  for (const d of i.before)
    o.emit(d, r, { stepIndex: n, step: t });
  const s = await a();
  if (!s.ok)
    return s;
  for (const d of i.after)
    o.emit(d, r, { stepIndex: n, step: t });
  return s;
}
function Ac(e) {
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
class bc {
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
        return yc({
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
    const o = await pc({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? h(void 0) : m({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const o = Mn(t, n);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, n, t);
    const a = await this.runRollFormulaStep(t, r, n);
    if (!a.ok)
      return a;
    const i = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, n, t, i), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: o, rollResult: i }), h(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const o = await nc(t, n, r);
    return o.ok ? h(void 0) : m({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const o = _e(t, r);
    if (!o.ok)
      return m({ ...o.error, stepIndex: n, step: t, context: r });
    const a = cc(t, r, o.value);
    lc({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), uc({
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
      const d = await Ie(this.resources, s, t.resource, t.operation, o.value), p = this.handleResourceOperationResult(d, r, n, t);
      if (!p.ok)
        return p;
      ac({
        step: t,
        context: r,
        transaction: p.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return dc({
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
    for (const i of a) {
      const s = await Ie(this.resources, i, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(s, r, n, t);
      if (!d.ok)
        return d;
    }
    return h(void 0);
  }
  async runChatCardStep(t, r, n) {
    const o = await fc(this.messages, t, r);
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
    const s = Rc(t, r.intent);
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
function Rc(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class kc {
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
function Bn(e) {
  return {
    id: Tc(),
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
function Tc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class wc {
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
    const n = Bn(r);
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
class Cc {
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
class $c {
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
    const r = nt();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: _c(),
      flags: {
        ...t.flags,
        [l]: {
          ...Ic(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && u.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = nt();
    if (!n.enabled)
      return;
    const o = r.notification ?? wr(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, o);
  }
  emitConsole(t, r) {
    const n = wr(r);
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
function wr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function _c() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Ic(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function Sc(e) {
  const t = Ec(e?.rounds);
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
  const r = Pc();
  if (!r?.id || !jn(r.round))
    return {
      duration: {},
      requestedRounds: t,
      combatDurationApplied: !1,
      combatId: null,
      startRound: null,
      startTurn: null,
      warning: `Duração de ${t} rodada(s) ignorada porque não há combate ativo.`
    };
  const n = Lc(r.turn) ? r.turn : 0;
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
function Ec(e) {
  return jn(e) ? Math.trunc(e) : null;
}
function Pc() {
  return game.combat ?? null;
}
function jn(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Lc(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class Nc {
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
    if (!xc(n))
      return m({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = r.value, a = Sc(t.duration), i = Dc(o, t, a), d = t.refreshExisting ?? !0 ? Uc(n, o.id) : null;
    if (d)
      try {
        return await Promise.resolve(d.update?.(i)), h(Cr(n, o, d.id ?? null, !1, !0, a));
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
      return h(Cr(n, o, y, !0, !1, a));
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
    const n = Hn(r, t.conditionId);
    let o = 0;
    try {
      for (const a of n)
        await $r(r, a) === "deleted" && (o += 1);
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
    const r = qc(), n = [];
    let o = 0, a = 0;
    for (const i of r) {
      const s = Nt(i);
      o += s.length;
      for (const d of s) {
        if (!Oc(d, t)) continue;
        const p = qn(d);
        try {
          await $r(i, d) === "deleted" && (a += 1);
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
function Dc(e, t, r) {
  const n = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Wc(),
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
    duration: vc(r.duration),
    flags: {
      [l]: n
    }
  };
}
function vc(e) {
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
function Cr(e, t, r, n, o, a) {
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
function Oc(e, t) {
  const r = qn(e);
  if (!r.conditionId || !Mc(r)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && r.combatId === t.combatId);
  if (Fc(e)) return !0;
  const n = Gc();
  return !n?.id || r.combatId && r.combatId !== n.id ? !0 : !de(r.startRound) || !de(r.requestedRounds) || !de(n.round) ? !1 : n.round >= r.startRound + r.requestedRounds;
}
function Mc(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && de(e.requestedRounds);
}
function Fc(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const r = t.remaining;
  return typeof r == "number" && Number.isFinite(r) && r <= 0;
}
function qn(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {};
  return {
    conditionId: ut(e, "conditionId"),
    requestedRounds: _r(e, "requestedRounds") ?? dt(t.rounds),
    combatDurationApplied: Ye(e, "combatDurationApplied"),
    combatId: ut(e, "combatId") ?? Dt(t.combat),
    startRound: _r(e, "startRound") ?? dt(t.startRound),
    deleteOnExpire: Ye(e, "deleteOnExpire"),
    expiresWithCombat: Ye(e, "expiresWithCombat")
  };
}
function xc(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Uc(e, t) {
  return Hn(e, t)[0] ?? null;
}
function Hn(e, t) {
  return Nt(e).filter((r) => Vc(r) === t);
}
async function $r(e, t) {
  const r = t.id ?? null, n = r ? Bc(e, r) : t;
  if (!n) return "missing";
  try {
    return await Promise.resolve(n.delete?.()), "deleted";
  } catch (o) {
    if (jc(o)) return "missing";
    throw o;
  }
}
function Bc(e, t) {
  return Nt(e).find((r) => r.id === t) ?? null;
}
function jc(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function qc() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const r of t.contents)
      we(e, r);
  typeof t?.forEach == "function" && t.forEach((r) => {
    we(e, r);
  });
  for (const r of Hc())
    we(e, r.actor), we(e, r.document?.actor);
  return Array.from(e.values());
}
function we(e, t) {
  if (!zc(t)) return;
  const n = Dt(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(n, t);
}
function Hc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Nt(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Vc(e) {
  return ut(e, "conditionId");
}
function ut(e, t) {
  return Dt(e.getFlag?.(l, t));
}
function _r(e, t) {
  return dt(e.getFlag?.(l, t));
}
function Ye(e, t) {
  return e.getFlag?.(l, t) === !0;
}
function Dt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function dt(e) {
  return de(e) ? Math.trunc(e) : null;
}
function zc(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Gc() {
  return game.combat ?? null;
}
function de(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Wc() {
  return game.user?.id ?? null;
}
const Kc = {
  id: "vulnerable",
  label: "Vulnerável",
  icon: "icons/svg/downgrade.svg",
  description: "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.",
  definitionVersion: "1.0.0",
  changes: []
};
class Yc {
  definitions = /* @__PURE__ */ new Map();
  constructor(t) {
    for (const r of t)
      this.definitions.set(r.id, r);
  }
  list() {
    return Array.from(this.definitions.values()).map(Ir);
  }
  get(t) {
    const r = this.definitions.get(t);
    return r ? h(Ir(r)) : m({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
}
function Qc() {
  return new Yc([Kc]);
}
function Ir(e) {
  return {
    ...e,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
const Xc = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Vn = `${l}-inline-roll-neutralized`, Zc = `${l}-inline-roll-notice`, vt = `data-${l}-inline-roll-neutralized`, Sr = `data-${l}-inline-roll-notice`, Jc = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Er(e) {
  const t = fl(e.message), r = await el(e.message), n = tl(t);
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
async function el(e) {
  const t = ul(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = rl(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await dl(t, r.content), replacementCount: r.replacementCount };
}
function tl(e) {
  const t = e ? ml(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = zn(t);
  return r > 0 && Gn(sl(t)), { replacementCount: r };
}
function rl(e) {
  const t = nl(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = zn(r.content), o = t.replacementCount + n;
  return o === 0 ? { content: e, replacementCount: 0 } : (Gn(r.content), { content: r.innerHTML, replacementCount: o });
}
function nl(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, o) => (t += 1, al(o.trim()))), replacementCount: t };
}
function zn(e) {
  const t = ol(e);
  for (const r of t)
    r.replaceWith(il(cl(r)));
  return t.length;
}
function ol(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(Xc))
    r.getAttribute(vt) !== "true" && t.add(r);
  return Array.from(t);
}
function al(e) {
  return `<span class="${Vn}" ${vt}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${pl(e)}</span>`;
}
function il(e) {
  const t = document.createElement("span");
  return t.classList.add(Vn), t.setAttribute(vt, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Gn(e) {
  if (e.querySelector?.(`[${Sr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Zc), t.setAttribute(Sr, "true"), t.textContent = Jc, e.append(t);
}
function sl(e) {
  return e.querySelector(".message-content") ?? e;
}
function cl(e) {
  const r = e.getAttribute("data-formula") ?? ll(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function ll(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function ul(e) {
  return e && typeof e == "object" ? e : null;
}
async function dl(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return u.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function ml(e) {
  const t = gl(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function fl(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function pl(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function gl(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Pr = "occultism";
function hl(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function yl(e) {
  const t = hl(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await Al(e, Pr);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await On(r);
  const n = kl(r);
  return {
    skill: Pr,
    skillLabel: "Ocultismo",
    roll: r,
    formula: Rl(r),
    total: n,
    difficulty: t,
    success: n >= t,
    diceBreakdown: Tl(r)
  };
}
async function Al(e, t) {
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
  return bl(n);
}
function bl(e) {
  return Lr(e) ? e : Array.isArray(e) ? e.find(Lr) ?? null : null;
}
function Lr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Rl(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function kl(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Tl(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(wl);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function wl(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function Cl(e) {
  return {
    header: {
      eyebrow: kt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: El(e.ritual)
    },
    forms: e.variantOptions.map((t) => $l(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: Sl(e.automationStatus ?? "assisted")
  };
}
function $l(e, t) {
  const r = _l(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Il(t) : "—",
    details: r
  };
}
function _l(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Il(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function Sl(e) {
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
function El(e) {
  const t = e.system, r = [Ll(t?.element), Pl(t?.circle)].filter(Nl);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function Pl(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Ll(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function Nl(e) {
  return typeof e == "string" && e.length > 0;
}
const Wn = ["base", "discente", "verdadeiro"];
function Kn(e) {
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
  return typeof e == "string" && Wn.includes(e);
}
const { ApplicationV2: Dl } = foundry.applications.api;
class me extends Dl {
  constructor(t, r) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = r, this.model = Cl(t), this.selectedVariant = this.model.forms.find((n) => n.checked && n.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    Ol(o, (a) => {
      this.selectedVariant = a;
    }), Ml(o, (a) => {
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
          ${this.model.forms.map(vl).join("")}
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
    const r = Ul(t), n = Fl(r, this.spendResource, this.selectedVariant);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function vl(e) {
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
function Ol(e, t) {
  const r = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of r)
    o.addEventListener("click", () => Nr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Nr(e, o, t));
    });
  const n = Yn(e);
  n && t(n);
}
function Nr(e, t, r) {
  const n = t.querySelector('input[name="variant"]');
  !n || n.disabled || !Se(n.value) || (n.checked = !0, e.dataset.paranormalToolkitSelectedVariant = n.value, r(n.value), n.dispatchEvent(new Event("change", { bubbles: !0 })), Yn(e));
}
function Yn(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let r = null;
  for (const n of t) {
    const o = n.querySelector('input[name="variant"]'), a = o?.checked === !0;
    n.setAttribute("aria-checked", a ? "true" : "false"), a && Se(o.value) && (r = o.value);
  }
  return r && (e.dataset.paranormalToolkitSelectedVariant = r), r;
}
function Ml(e, t) {
  const r = e.querySelector('input[name="spendResource"]');
  r && (t(r.checked), r.addEventListener("change", () => {
    t(r.checked);
  }));
}
function Fl(e, t, r) {
  const n = xl(e) ?? r, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: n,
    spendResource: o
  };
}
function xl(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Se(t)) return t;
  const r = e?.dataset.paranormalToolkitSelectedVariant;
  return Se(r) ? r : null;
}
function Ul(e) {
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
async function Bl(e) {
  return me.request(e);
}
const Ot = {
  label: "Padrão"
}, jl = {
  label: "Discente",
  extraCost: 2
}, ql = {
  label: "Verdadeiro",
  extraCost: 5
};
class Hl {
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
    const n = this.resolveCostPreview(t), o = bu(r), a = hu(r, t.item, n, o), i = await Bl({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((T) => T.name),
      cost: n,
      defaultSpendResource: $u(r),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const s = Vl(i), d = ku(r, t.item, s.variant, o), p = hn();
    let y = null;
    if (p) {
      const T = await Gl(this.resources, t.actor, s, d, n);
      if (!T.ok)
        return {
          status: "failed",
          reason: T.reason,
          message: T.message
        };
      try {
        y = await yl(t.actor);
      } catch (F) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: F instanceof Error ? F.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: F
        };
      }
    }
    const b = zl(r, s, d, n, {
      includeCostSteps: !p
    });
    if (b.steps.length === 0) {
      const T = Ru(t, s), F = Dr(t.actor, y, d, n), zt = Or(r, s, d, n, T, y);
      return F.length > 0 ? {
        status: "ready",
        workflowContext: T,
        actions: F,
        summaryLines: zt
      } : {
        status: "completed-without-actions",
        workflowContext: T,
        summaryLines: zt
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
          variant: s.variant,
          spendResource: s.spendResource
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
    const R = k.value.context, f = Kl(r, t, R), oe = Dr(t.actor, y, d, n), ae = Or(r, s, d, n, R, y);
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
function Vl(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function zl(e, t, r, n, o) {
  const a = [], i = t.spendResource === !0;
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || Mt(s) && (!o.includeCostSteps || !i) || a.push(Wl(s, r));
  return o.includeCostSteps && i && n && _u(r.extraCost) && a.push({
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
async function Gl(e, t, r, n, o) {
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
function Wl(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function Dr(e, t, r, n) {
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
function Kl(e, t, r) {
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
    const i = nu(o.actor, t);
    if (i.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const s of i)
      n.push(...Yl(e, o, s, a.value));
  }
  return { ok: !0, actions: n };
}
function Yl(e, t, r, n) {
  if (!Jl(e, t))
    return [vr(t, r, n)];
  const o = ru();
  return Qn(e).map((a) => {
    const i = eu(n, a);
    return vr(t, r, i, {
      option: a,
      choiceGroupId: o
    });
  });
}
function vr(e, t, r, n) {
  const o = t.name ?? "Ator sem nome", a = Zl(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: Ql(e, o, r, n?.option),
    executedLabel: Xl(e, o, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function Ql(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function Xl(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Zl(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Jl(e, t) {
  return t.operation === "damage" && t.resource === "PV" && Qn(e).length > 1;
}
function Qn(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function eu(e, t) {
  const r = e * t.multiplier, n = tu(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function tu(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function ru() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function nu(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function Or(e, t, r, n, o, a = null) {
  return [
    `Forma: ${Kn(t.variant)}`,
    au(t, r, n),
    ...ou(a),
    ...Object.values(o.rolls).flatMap(iu),
    ...su(e.resistance),
    ...pu(r)
  ];
}
function ou(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function au(e, t, r) {
  const n = ye(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function iu(e) {
  const r = [`${gu(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = cu(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${fu(e.damageType)}`), r;
}
function su(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function cu(e) {
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
    const i = lu(a);
    i && (mu(r, i.operator ?? n, i.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function lu(e) {
  const t = uu(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : du(e);
}
function uu(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function du(e) {
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
function mu(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function fu(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function pu(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function gu(e) {
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
function hu(e, t, r, n) {
  return Wn.map((o) => {
    const a = Xn(e, t, o, n), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? Kn(o),
      enabled: i,
      details: a ? yu(a, r, n) : [],
      finalCostText: a ? Au(r, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function yu(e, t, r) {
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
function Au(e, t) {
  const r = ye(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function bu(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Mt);
}
function Ru(e, t) {
  return Bn({
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
function ku(e, t, r, n) {
  return Xn(e, t, r, n) ?? Ot;
}
function Xn(e, t, r, n) {
  const o = e.ritualForms?.[r] ?? null;
  return o || (n ? wu(t, r) ? Tu(r) : null : r === "base" ? Ot : null);
}
function Tu(e) {
  switch (e) {
    case "base":
      return Ot;
    case "discente":
      return jl;
    case "verdadeiro":
      return ql;
  }
}
function wu(e, t) {
  if (t === "base") return !0;
  const r = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Cu(foundry.utils.getProperty(e, r));
}
function Cu(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function $u(e) {
  return e.steps.some(Mt);
}
function Mt(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function _u(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Iu(e, t) {
  const r = await Su(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: Pu(r),
    total: Lu(r),
    diceBreakdown: Nu(r)
  };
}
function Zn(e) {
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
async function Su(e, t) {
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
  return Eu(n);
}
function Eu(e) {
  return Mr(e) ? e : Array.isArray(e) ? e.find(Mr) ?? null : null;
}
function Mr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Pu(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Lu(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Nu(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(Du);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Du(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Jn = "itemUsePrompts", eo = "chatCard", Me = "data-paranormal-toolkit-prompt-id", Fe = "data-paranormal-toolkit-pending-id", Ft = "data-paranormal-toolkit-executed-label", mt = "data-paranormal-toolkit-choice-group", to = "data-paranormal-toolkit-skipped-label", Fr = "data-paranormal-toolkit-action-section", xr = "data-paranormal-toolkit-detail-key", Ur = "data-paranormal-toolkit-roll-card", xt = "data-paranormal-toolkit-roll-detail-toggle", ro = "data-paranormal-toolkit-roll-detail-id", no = "data-paranormal-toolkit-resistance-roll-button", oo = "data-paranormal-toolkit-resistance-skill", ao = "data-paranormal-toolkit-resistance-skill-label", io = "data-paranormal-toolkit-resistance-target-actor-id", so = "data-paranormal-toolkit-resistance-target-name", co = "data-paranormal-toolkit-resistance-roll-result", Br = "data-paranormal-toolkit-system-card-replaced", vu = `[${Fe}]`, Ou = `[${xt}]`, Mu = `[${no}]`, ft = `${l}-chat-enrichment`, g = `${l}-item-use-prompt`, Fu = `${g}__actions`, jr = `${g}__details`, lo = `${g}__summary`, xu = `${g}__title`, uo = `${g}__button--executed`, qr = `${g}__roll-card`;
let Hr = !1, pt = null;
const E = /* @__PURE__ */ new Map(), Uu = [0, 100, 500, 1500, 3e3], Bu = 3e4, ju = [0, 100, 500, 1500, 3e3];
function qu(e) {
  if (pt = e, Hr) {
    zr(e);
    return;
  }
  const t = (r, n) => {
    fo(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Hr = !0, zr(e);
}
async function Vr(e) {
  const t = mo(e);
  E.set(e.pendingId, t), await jt(t) || wo(t), po(e.pendingId);
}
async function Hu(e) {
  const t = mo({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", E.set(e.pendingId, t), await jt(t) || wo(t), po(e.pendingId);
}
async function Qe(e, t) {
  const r = E.get(e);
  E.delete(e), r && await qd(r, t);
}
function Ut(e) {
  const t = Eo();
  for (const r of t) {
    const n = M(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function Vu(e, t) {
  const r = Ut(e);
  if (!r) return;
  const n = M(r.message), o = n[e];
  o && (n[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await re(r.message, n));
}
async function zu(e, t, r) {
  if (!t) return;
  const n = Ut(e);
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
function mo(e) {
  const t = B(e.context.message), r = e.context.targets.find((i) => At(i)), n = r ? At(r) : null, o = e.resistanceTargetActor ?? n, a = e.resistanceTargetName ?? r?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: yd(e.context),
    executed: !1
  };
}
function fo(e, t, r) {
  jd();
  const n = Ue(t);
  if (!n) return;
  const o = xd(e, n);
  o.length > 0 && Ee(n);
  for (const a of o)
    gt(n, a);
  yo(n, r), ht(n), yt(n);
}
function zr(e) {
  for (const t of ju)
    globalThis.setTimeout(() => {
      Gu(e);
    }, t);
}
function Gu(e) {
  for (const t of Wu()) {
    const r = xe(t);
    Ku(r) && fo(r, t, e);
  }
}
function Wu() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function Ku(e) {
  return e ? qt(e) ? !0 : Vd(e).length > 0 : !1;
}
function po(e) {
  const t = E.get(e);
  if (!t) return;
  const r = t.messageId ? Ud(t.messageId) : null;
  if (r) {
    Qr(r, t), Ee(r), gt(r, t), Gr(r), ht(r), yt(r);
    return;
  }
  if (t.messageId) {
    Rt(t);
    return;
  }
  const n = Bd(t);
  if (n) {
    Qr(n, t), Ee(n), gt(n, t), Gr(n), ht(n), yt(n);
    return;
  }
  Rt(t);
}
function Gr(e) {
  pt && yo(e, pt);
}
function Ee(e) {
  const t = Yu();
  e.classList.toggle(`${g}--system-card-replaced`, t);
  const r = ho(e);
  if (!r || (r.classList.toggle(`${g}__host--system-card-replaced`, t), !t) || r.getAttribute(Br) === "true") return;
  const n = r.querySelector(`.${ft}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(Br, "true");
}
function Yu() {
  try {
    return Ea() === "replace";
  } catch {
    return !1;
  }
}
function gt(e, t) {
  if (Ee(e), e.querySelector(`[${Me}="${ne(t.pendingId)}"]`)) return;
  const r = Qu(e, t);
  Zu(r, t), md(r, fd(t)).append(hd(t));
}
function Qu(e, t) {
  const r = e.querySelector(`.${ft}`);
  if (r)
    return r;
  const n = document.createElement("section");
  n.classList.add(ft, g);
  const o = document.createElement("header");
  o.classList.add(`${g}__header`);
  const a = document.createElement("span");
  a.classList.add(`${g}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(xu), i.textContent = Xu(t);
  const s = document.createElement("span");
  return s.classList.add(lo), s.textContent = t.summary, o.append(a, i, s), n.append(o), bd(e).append(n), n;
}
function Xu(e) {
  const t = $(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function Zu(e, t) {
  const r = t.summaryLines ?? [], n = ko(r, t);
  if (n) {
    Ju(e, n, t);
    return;
  }
  pd(e, r);
}
function Ju(e, t, r) {
  if (e.querySelector(`[${Ur}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(qr, `${qr}--${t.intent}`), n.setAttribute(Ur, "true"), t.castingCheck && Wr(n, td(t.castingCheck), r.pendingId, "casting"), ed(t) && Wr(n, rd(t), r.pendingId, "effect"), sd(n, t), cd(n, t, r), dd(n, t), e.append(n);
}
function ed(e) {
  return e.intent !== "casting";
}
function td(e) {
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
function rd(e) {
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
function Wr(e, t, r, n) {
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
  nd(o, t), ud(o, t.detailRows, r, n, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function nd(e, t) {
  const r = document.createElement("div");
  r.classList.add(`${g}__workflow-roll`);
  const n = document.createElement("span");
  n.classList.add(`${g}__workflow-roll-formula`), n.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${g}__workflow-roll-total`), o.textContent = String(t.total), r.append(n, o);
  const a = od(t.formula, t.diceBreakdown);
  a && r.append(a), e.append(r);
}
function od(e, t) {
  const r = ad(t);
  if (r.length === 0) return null;
  const n = document.createElement("div");
  n.classList.add(`${g}__workflow-dice-tray`);
  for (const o of id(r, e)) {
    const a = document.createElement("span");
    a.classList.add(`${g}__workflow-die`), o.active || a.classList.add(`${g}__workflow-die--inactive`), a.textContent = String(o.value), n.append(a);
  }
  return n;
}
function ad(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((n) => Number(n.trim())).filter((n) => Number.isFinite(n)).map((n) => Math.trunc(n)) : [];
}
function id(e, t) {
  if (e.length <= 1) return e.map((n) => ({ value: n, active: !0 }));
  const r = t.toLowerCase();
  return r.includes("kh") ? Kr(e, "highest") : r.includes("kl") ? Kr(e, "lowest") : e.map((n) => ({ value: n, active: !0 }));
}
function Kr(e, t) {
  const r = t === "highest" ? Math.max(...e) : Math.min(...e);
  let n = !1;
  return e.map((o) => {
    const a = !n && o === r;
    return a && (n = !0), { value: o, active: a };
  });
}
function sd(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(cm);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__roll-meta`);
  for (const o of r) {
    const a = document.createElement("span");
    a.classList.add(`${g}__roll-meta-pill`), a.textContent = o, n.append(a);
  }
  e.append(n);
}
function cd(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${g}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${g}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = ld(t, r);
  o.append(a), i && o.append(i);
  const s = document.createElement("span");
  s.classList.add(`${g}__resistance-description`), s.textContent = t.resistance, n.append(o, s), t.resistanceRollResult && n.append(go(t.resistanceRollResult)), e.append(n);
}
function ld(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${g}__resistance-roll-button`), r.setAttribute(Me, t.pendingId), r.setAttribute(no, "true"), r.setAttribute(oo, e.resistanceSkill), r.setAttribute(ao, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(io, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(so, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${g}__resistance-roll-button--rolled`), r.setAttribute(co, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${g}__resistance-roll-fallback`), o.textContent = "d20", r.append(n, o), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function go(e) {
  const t = document.createElement("span");
  return t.classList.add(`${g}__resistance-roll-result`), t.textContent = bo(e), t;
}
function ud(e, t, r, n, o) {
  const a = t.filter((p) => p.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${r}-roll-details-${n}`, s = document.createElement("button");
  s.type = "button", s.classList.add(`${g}__roll-detail-toggle`), s.setAttribute(xt, i), s.setAttribute("aria-expanded", "false"), s.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${g}__roll-detail-list`), d.setAttribute(ro, i), d.hidden = !0;
  for (const p of a) {
    const y = document.createElement("dt");
    y.textContent = p.label;
    const b = document.createElement("dd");
    b.textContent = p.value, d.append(y, b);
  }
  e.append(s, d);
}
function dd(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${g}__workflow-notes`);
  for (const n of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = n, r.append(o);
  }
  e.append(r);
}
function md(e, t) {
  const r = `[${Fr}="${ne(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const o = document.createElement("div");
  o.classList.add(Fu), o.setAttribute(Fr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${g}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function fd(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = ko(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function pd(e, t) {
  if (t.length === 0) return;
  const r = gd(e);
  for (const n of t) {
    const o = lm(n);
    if (r.querySelector(`[${xr}="${ne(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = n, a.setAttribute(xr, o), r.append(a);
  }
}
function gd(e) {
  const t = e.querySelector(`.${jr}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(jr), e.append(r), r;
}
function hd(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${g}__button`), t.setAttribute(Me, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(uo), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Fe, e.pendingId), t.setAttribute(Ft, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(mt, e.choiceGroupId), t.setAttribute(to, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function yd(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = Ad(e);
  return `${t} → ${r}`;
}
function Ad(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function bd(e) {
  return ho(e) ?? e;
}
function ho(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function yo(e, t) {
  const r = Ue(e);
  if (!r) return;
  const n = r.querySelectorAll(vu);
  for (const o of n)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Dd(o, t);
    }));
}
function ht(e) {
  const t = Ue(e);
  if (!t) return;
  const r = t.querySelectorAll(Ou);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      Rd(t, n);
    }));
}
function yt(e) {
  const t = Ue(e);
  if (!t) return;
  const r = t.querySelectorAll(Mu);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      kd(t, n);
    }));
}
function Rd(e, t) {
  const r = t.getAttribute(xt);
  if (!r) return;
  const n = e.querySelector(`[${ro}="${ne(r)}"]`);
  if (!n) return;
  const o = n.hidden;
  n.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function kd(e, t) {
  const r = t.getAttribute(Me), n = t.getAttribute(oo), o = t.getAttribute(ao) ?? (n ? Zn(n) : "Resistência");
  if (!r || !n) return;
  const a = Cd(e, r), i = $d(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const s = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Iu(i, n);
    await Pd(d.roll);
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
    Td(t, p), wd(t, p), Ld(r, p), await Nd(e, r, p);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1;
  }
}
function Td(e, t) {
  e.classList.add(`${g}__resistance-roll-button--rolled`), e.setAttribute(co, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function wd(e, t) {
  const r = e.closest(`.${g}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${g}__resistance-roll-result`), o = n ?? go(t);
  if (n) {
    n.textContent = bo(t);
    return;
  }
  r.append(o);
}
function Cd(e, t) {
  const r = E.get(t);
  if (r) return r;
  const n = xe(e);
  return M(n)[t] ?? null;
}
function $d(e, t) {
  const r = e?.resistanceTargetActor;
  if (D(r)) return r;
  const o = e?.context?.targets.map(At).find(D) ?? null;
  if (o) return o;
  const a = t.getAttribute(io) ?? e?.resistanceTargetActorId ?? null, i = a ? Id(a) : null;
  return i || Sd(
    t.getAttribute(so) ?? e?.resistanceTargetName ?? _d(t)
  );
}
function _d(e) {
  const r = e.closest(`.${g}`)?.querySelector(`.${lo}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const o = r.split(n), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function At(e) {
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
function Id(e) {
  const r = game.actors?.get?.(e);
  return D(r) ? r : Ao().map((a) => pe(a)).find((a) => a?.id === e) ?? null;
}
function Sd(e) {
  const t = Z(e);
  if (!t) return null;
  const r = Ao().filter((a) => Z(Ed(a)) === t).map((a) => pe(a)).find(D) ?? null;
  if (r) return r;
  const o = game.actors?.find?.((a) => D(a) && Z(a.name) === t);
  return D(o) ? o : null;
}
function Ao() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ed(e) {
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
function bo(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Pd(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Ld(e, t) {
  const r = E.get(e);
  r && (r.resistanceRollResult = t);
}
async function Nd(e, t, r) {
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
async function Dd(e, t) {
  const r = e.getAttribute(Fe);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    Ro(e, e.getAttribute(Ft) ?? "✓ Automação aplicada"), vd(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function Ro(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(uo), e.removeAttribute(Fe), e.removeAttribute(Ft);
}
function vd(e) {
  const t = e.getAttribute(mt);
  if (!t) return;
  const r = e.closest(`.${g}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${mt}="${ne(t)}"]`;
  for (const o of r.querySelectorAll(n)) {
    if (o === e) continue;
    const a = o.getAttribute(to) ?? "✓ Outra opção escolhida";
    Ro(o, a);
  }
}
function ko(e, t) {
  const r = e.map(Bt).filter(im), n = r.find((f) => f.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const o = $(e, "Forma"), a = $(e, "Custo"), i = $(e, "Dados") ?? $(e, `Dados (${n.label})`), s = $(e, "Tipo"), d = $(e, "Resistência"), p = $(e, "Resistência Perícia"), y = $(e, "Resistência Rótulo") ?? (p ? Zn(p) : null), b = To(e, "Observação"), k = e.filter((f) => Fd(f, n)), R = Od(e);
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
    details: k,
    castingCheck: R,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function Od(e) {
  const t = e.map(Bt).find((a) => a?.intent === "casting") ?? null, r = $(e, "Conjuração DT"), n = $(e, "Conjuração Resultado");
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
function Bt(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, n, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: r,
    formula: n,
    total: a,
    intent: Md(r)
  } : null;
}
function Md(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function $(e, t) {
  return To(e, t)[0] ?? null;
}
function To(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const o = n.slice(r.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Fd(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Bt(e) ? !1 : e.trim().length > 0;
}
function xd(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of E.values())
    bt(n, e, t) && r.set(n.pendingId, n);
  for (const n of Hd(e))
    bt(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, o) => n.createdAt - o.createdAt);
}
function bt(e, t, r) {
  const n = B(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !Yr(r, "itemId", e.itemId) ? !1 : !e.actorId || Yr(r, "actorId", e.actorId);
}
function Yr(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${um(t)}`;
  for (const o of e.querySelectorAll(`[${n}]`))
    if (o.getAttribute(n) === r)
      return !0;
  return !1;
}
function Ud(e) {
  const t = ne(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Bd(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (bt(e, null, t))
      return t;
  return null;
}
function jd() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of E.entries())
    e - n.createdAt > t && E.delete(r);
}
async function Qr(e, t) {
  const r = xe(e);
  if (!r) return !1;
  try {
    const n = M(r);
    return n[t.pendingId] = Ht(t, B(r)), await re(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function jt(e) {
  const t = _o(e);
  if (!t) return !1;
  try {
    const r = M(t);
    return r[e.pendingId] = Ht(e, B(t)), await re(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function wo(e) {
  for (const t of Uu)
    globalThis.setTimeout(() => {
      Rt(e);
    }, t);
}
async function Rt(e) {
  const t = _o(e);
  if (qt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const n = await jt(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function qd(e, t) {
  const r = $o(e.context.message);
  if (r)
    try {
      const n = M(r), o = n[e.pendingId] ?? Ht(e, B(r));
      n[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await re(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function Hd(e) {
  return Object.values(M(O(e))).filter(Ae);
}
function M(e) {
  if (!e) return {};
  const t = {}, r = qt(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, o] of Object.entries(Co(e)))
    t[n] ??= o;
  return t;
}
function Vd(e) {
  return Object.values(Co(O(e))).filter(Ae);
}
function Co(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, Jn);
  if (!J(t))
    return {};
  const r = {};
  for (const [n, o] of Object.entries(t))
    Ae(o) && (r[n] = o);
  return r;
}
async function re(e, t) {
  typeof e.setFlag == "function" && (await Gd(e, t), await zd(e, t));
}
async function zd(e, t) {
  await Promise.resolve(e.setFlag?.(l, Jn, t));
}
function qt(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, eo);
  return om(t) ? t : null;
}
async function Gd(e, t) {
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
      actorName: Wd(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(l, eo, o));
}
function Wd(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function Ht(e, t) {
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
function $o(e) {
  const t = O(e);
  if (t?.setFlag)
    return t;
  const r = Kd(e);
  if (r?.setFlag)
    return r;
  const n = B(e);
  if (!n) return null;
  const o = game.messages;
  return O(o?.get?.(n));
}
function Kd(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(O).find((r) => typeof r?.setFlag == "function") ?? null;
}
function _o(e) {
  const t = $o(e.context.message);
  if (t) return t;
  const r = e.messageId ? Yd(e.messageId) : null;
  if (r) return r;
  const n = Eo().slice().reverse();
  return n.find((o) => Qd(o, e)) ?? n.find((o) => Xd(o, e)) ?? null;
}
function Yd(e) {
  const t = game.messages;
  return O(t?.get?.(e));
}
function Qd(e, t) {
  const r = B(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!Io(e, t)) return !1;
  const o = So(e);
  return !t.actorId || !o || o === t.actorId;
}
function Xd(e, t) {
  if (!Jd(e, t)) return !1;
  const r = So(e);
  return t.actorId && r === t.actorId ? !0 : Io(e, t);
}
function Io(e, t) {
  const r = Z(Zd(e));
  if (!r) return !1;
  const n = Z(t.itemName);
  if (n && r.includes(n)) return !0;
  const o = Z(t.itemId);
  return !!(o && r.includes(o));
}
function Zd(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function So(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Jd(e, t) {
  const r = em(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= Bu;
}
function em(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function O(e) {
  return e && typeof e == "object" ? e : null;
}
function Ae(e) {
  return J(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && _(e.messageId) && _(e.itemId) && _(e.actorId) && _(e.itemName) && z(e.resistanceTargetActorId) && z(e.resistanceTargetName) && am(e.resistanceRollResult) && tm(e.actionPayload) && Xe(e.title) && Xe(e.buttonLabel) && Xe(e.executedLabel) && z(e.choiceGroupId) && z(e.skippedLabel) && z(e.actionSectionId) && z(e.actionSectionTitle) && sm(e.summaryLines) : !1;
}
function tm(e) {
  return e == null ? !0 : J(e) ? e.kind === "resource-operation" && _(e.actorId) && _(e.actorUuid) && typeof e.actorName == "string" && rm(e.resource) && nm(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function rm(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function nm(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function om(e) {
  return J(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && _(e.messageId) && J(e.source) && _(e.source.actorId) && _(e.source.actorName) && _(e.source.itemId) && _(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Ae) : !1;
}
function am(e) {
  return e == null ? !0 : J(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function im(e) {
  return e !== null;
}
function J(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function _(e) {
  return e === null || typeof e == "string";
}
function Xe(e) {
  return e === void 0 || typeof e == "string";
}
function z(e) {
  return e == null || typeof e == "string";
}
function sm(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function cm(e) {
  return typeof e == "string" && e.length > 0;
}
function Eo() {
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
function lm(e) {
  return e.trim().toLowerCase();
}
function um(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ne(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Xr = 1e3;
class dm {
  constructor(t, r, n, o) {
    this.workflow = t, this.resources = r, this.debugOutput = o, this.ritualAssistant = new Hl(t, r, n);
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
      settings: Zt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = Zt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = Tt(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && mm(t.item) && r.executionMode === "ask") {
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
    if (await Er(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Je(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await Qe(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const n = await this.ritualAssistant.applyAction(r.action);
    return n.ok ? (r.workflowContext.resourceTransactions.push(n.value), this.pendingExecutions.delete(t), await Qe(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(n), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = Ut(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, o = gm(n);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const a = await Ie(this.resources, o, n.resource, n.operation, n.amount);
    return a.ok ? (await Vu(t), await zu(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (qu((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await Er(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Je(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, fm(t.item));
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
      a.kind === "resource-action" && (this.pendingExecutions.delete(o), await Qe(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, r) {
    const n = et();
    await Hu({
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
      const s = et();
      a ??= s, this.pendingExecutions.set(s, {
        kind: "resource-action",
        id: s,
        action: i,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await Vr({
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
        actionPayload: pm(i)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), u.info("Ritual assistido preparado com ações pendentes.", K(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = et();
    this.pendingExecutions.set(n, {
      kind: "workflow",
      id: n,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Vr({
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
    const r = Date.now(), n = Zr(t);
    for (const [a, i] of this.recentExecutionKeys.entries())
      r - i > Xr && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(n);
    return o !== void 0 && r - o <= Xr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Zr(t), Date.now());
  }
  setAttempt(t, r, n, o) {
    this.lastAttempt = Je(t, r, n, o);
  }
}
function mm(e) {
  return e.type === "ritual";
}
function fm(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function pm(e) {
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
function gm(e) {
  const t = e.actorUuid ? hm(e.actorUuid) : null;
  if (ee(t)) return t;
  const r = e.actorId ? ym(e.actorId) : null;
  return r || Am(e.actorName);
}
function hm(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function ym(e) {
  const r = game.actors?.get?.(e);
  if (ee(r)) return r;
  for (const n of Po()) {
    const o = Vt(n);
    if (o?.id === e) return o;
  }
  return null;
}
function Am(e) {
  const t = Ze(e);
  if (!t) return null;
  for (const o of Po()) {
    const a = bm(o);
    if (Ze(a) === t) {
      const i = Vt(o);
      if (i) return i;
    }
  }
  const n = game.actors?.find?.((o) => ee(o) && Ze(o.name) === t);
  return ee(n) ? n : null;
}
function Po() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function bm(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : Vt(e)?.name ?? null;
}
function Vt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ee(t)) return t;
  const r = e.document?.actor;
  return ee(r) ? r : null;
}
function Ze(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ee(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Je(e, t, r, n) {
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
function Zr(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function et() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Rm {
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
class km {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = he(t).map((s) => this.analyzeRitual(s)), n = r.filter(Ce("upToDate")), o = r.filter(Ce("available")), a = r.filter(Ce("outdated")), i = r.filter(Ce("unsupported"));
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
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = Tm(t);
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
      reason: wm(n, r.preset)
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
    preset: e.match ? Ne(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function Tm(e) {
  const t = e.getFlag(l, "automation");
  return wt(t) ? t : null;
}
function wm(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Ce(e) {
  return (t) => t.status === e;
}
class Cm {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), n = $t(t.transaction);
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
    const r = A(t.actorName), n = A(t.resource), o = A(Jr(t)), a = A(_m(t));
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
      (f) => `<li><strong>${A(f.id)}:</strong> ${A(f.formula)} = ${f.total} <em>(${A($m(f.intent))})</em>${f.damageType ? ` — ${A(f.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (f) => `<li><strong>${A(f.itemName)}:</strong> ${f.circle}º círculo — ${f.amount} ${A(f.resource)} (${A(Im(f.source))})</li>`
    ), y = t.damageInstances.map(
      (f) => `<li><strong>${A(f.targetActorName)}:</strong> bruto ${f.rawAmount}${f.damageType ? ` ${A(f.damageType)}` : ""} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), b = t.healingInstances.map(
      (f) => `<li><strong>${A(f.targetActorName)}:</strong> bruto ${f.rawAmount} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), k = t.resourceTransactions.map(
      (f) => `<li><strong>${A(f.actorName)}:</strong> ${A(Jr(f))} — ${f.before.value}/${f.before.max} &rarr; ${f.after.value}/${f.after.max}</li>`
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
          ${k.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${k.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p class="${l}-workflow-card__phases"><strong>Fases:</strong> ${R}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function $m(e) {
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
function Jr(e) {
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
function _m(e) {
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
function Im(e) {
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
function Sm() {
  const e = new Is(), t = new kc(e), r = new Ps(), n = new Ds(r), o = new Ws(e), a = new Ys(), i = a.registerMany(ca());
  if (!i.ok)
    throw new Error(i.error.message);
  const s = new Ks(), d = new zs(), p = Qc(), y = new Nc(p), b = new km(a), k = new Rm(b, s, d), R = new $c(), f = new Cm(R), oe = new Cc(), ae = new bc(t, n, f, oe), ie = new wc(ae, oe), T = new dm(ie, t, n, R);
  return T.addStrategy(new Hs((F) => T.handleItemUsed(F))), {
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
    itemUseIntegration: T,
    ritualPresetDiagnostic: b,
    ritualPresetApplications: k
  };
}
const { ApplicationV2: Em } = foundry.applications.api;
class Pe extends Em {
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${P(kt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${P(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${tt("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${tt("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${tt("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function tt(e, t, r, n) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${n}"></i>
        <span>${P(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? Pm(r) : Nm(t)}
    </section>
  `;
}
function Pm(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Lm).join("")}</ol>`;
}
function Lm(e) {
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
function Nm(e) {
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
const Le = `${l}.manageRitualPresets`, en = `__${l}_ritualPresetHeaderControlRegistered`, Dm = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function vm(e) {
  const t = globalThis;
  if (!t[en]) {
    for (const r of Dm)
      Hooks.on(r, (n, o) => {
        Om(n, o, e);
      });
    t[en] = !0, u.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Om(e, t, r) {
  Array.isArray(t) && Fm(e) && (Mm(e, r), !t.some((n) => n.action === Le) && t.push({
    action: Le,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), Lo(e, r);
    }
  }));
}
function Mm(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Le] && (e.options.actions[Le] = (r) => {
    r.preventDefault(), r.stopPropagation(), Lo(e, t);
  }));
}
function Fm(e) {
  if (!game.user?.isGM) return !1;
  const t = No(e);
  return t ? t.type === "agent" && he(t).length > 0 : !1;
}
function Lo(e, t) {
  const r = No(e);
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
function No(e) {
  return tn(e.actor) ? e.actor : tn(e.document) ? e.document : null;
}
function tn(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let W = null;
Hooks.once("init", () => {
  aa(), Sa(), ii(), _s(), u.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!tr.isSupportedSystem()) {
    u.warn(
      `Sistema não suportado: ${tr.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  W = Sm(), W.itemUseIntegration.registerStrategies(), ri(W.conditions), Ba(W), Xa(), Wa(), vm(W), u.info("Inicializado para o sistema Ordem Paranormal."), u.info(`API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${kt} inicializado.`);
});
function xm() {
  if (!W)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return W;
}
export {
  xm as getToolkitServices
};
//# sourceMappingURL=main.js.map
