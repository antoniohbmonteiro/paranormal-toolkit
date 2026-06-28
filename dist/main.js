const c = "paranormal-toolkit", tr = "Paranormal Toolkit", rr = "ordemparanormal";
class V {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function ye(e) {
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
class i {
  static info(t, ...r) {
    console.log(`${c} | ${t}`, ...r);
  }
  static warn(t, ...r) {
    console.warn(`${c} | ${t}`, ...r);
  }
  static error(t, ...r) {
    console.error(`${c} | ${t}`, ...r);
  }
}
function f(e) {
  return { ok: !0, value: e };
}
function l(e) {
  return { ok: !1, error: e };
}
function Ae(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? l({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : mt(t) ? f(t.definition) : l({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function ar(e) {
  return mt(e.getFlag(c, "automation"));
}
function mt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && or(t.source) && nr(t.definition);
}
function nr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && b(t.label) && Array.isArray(t.steps) && t.steps.every(sr);
}
function or(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? b(t.presetId) && b(t.presetVersion) && b(t.appliedAt) : t.type === "manual" ? b(t.label) && b(t.appliedAt) : !1;
}
function sr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return ir(t);
    case "spendRitualCost":
      return ur(t);
    case "rollFormula":
      return cr(t);
    case "modifyResource":
      return lr(t);
    case "chatCard":
      return mr(t);
    default:
      return !1;
  }
}
function ir(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && dt(t);
}
function ur(e) {
  return e.type === "spendRitualCost";
}
function cr(e) {
  const t = e;
  return t.type === "rollFormula" && b(t.id) && b(t.formula) && (t.intent === void 0 || gr(t.intent)) && (t.damageType === void 0 || b(t.damageType));
}
function lr(e) {
  const t = e;
  return t.type === "modifyResource" && dr(t.actor) && fr(t.resource) && pr(t.operation) && dt(t);
}
function mr(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function dt(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || b(e.amountFrom);
}
function dr(e) {
  return e === "self" || e === "target";
}
function fr(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function pr(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function gr(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function b(e) {
  return typeof e == "string" && e.length > 0;
}
function Re(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(Se);
    if (Ar(t))
      return Array.from(t).filter(Se);
  }
  return [];
}
function hr(e) {
  return Re(e)[0] ?? null;
}
function yr(e) {
  return Re(e).find(ar) ?? null;
}
function Ar(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Se(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ft(e) {
  return Re(e).filter((t) => t.type === "ritual");
}
function pt(e) {
  return ft(e)[0] ?? null;
}
function Rr(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(ye);
      return i.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = L("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = j(t);
      if (!r) return [];
      const a = e.automationRegistry.findForItem(r).map(De);
      return i.info(`Presets encontrados para ${r.name}.`, a), a;
    },
    async applyPresetToFirstRitual(t) {
      const r = L("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const a = j(r);
      if (!a) return;
      const n = e.automationRegistry.require(t);
      if (!n.ok) {
        i.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      const o = await ae(e, a, n.value);
      i.info(`Preset ${n.value.id} aplicado em ${a.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.value.label} aplicado em ${a.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = L("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = j(t);
      if (!r) return;
      const a = e.automationRegistry.findForItem(r)[0];
      if (!a) {
        i.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const n = await ae(e, r, a.preset);
      i.info(`Melhor preset aplicado em ${r.name}.`, { match: De(a), itemPatch: n }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Ee(e);
    },
    async applyBestPresetsToActorRituals() {
      return Ee(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = L("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = j(t);
      r && (await e.automationBinder.clear(r), i.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function Ee(e) {
  const t = L("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = ft(t);
  if (r.length === 0)
    return i.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), ve(t);
  const a = ve(t, r.length);
  for (const n of r) {
    const o = e.automationRegistry.findForItem(n)[0];
    if (!o) {
      a.skipped.push({
        itemId: n.id ?? null,
        itemName: n.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await ae(e, n, o.preset);
    a.applied.push(br(n, o, s));
  }
  return i.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, a), wr(a), a;
}
async function ae(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function br(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: ye(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function ve(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function wr(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((a) => a.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function De(e) {
  return {
    preset: ye(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function L(e) {
  const t = V.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function j(e) {
  const t = pt(e);
  return t || (i.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function S(e) {
  return e ? {
    id: e.id,
    source: {
      ...kr(e.sourceActor),
      token: e.sourceToken
    },
    item: Tr(e.item),
    targets: e.targets.map(Pr),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: _e(e.rollRequests, gt),
    rolls: _e(e.rolls, $r),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(be),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function be(e) {
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
function kr(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Tr(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Pr(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function gt(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function $r(e) {
  return {
    ...gt(e),
    total: e.total
  };
}
function _e(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, a]) => [r, t(a)]));
}
function Cr(e) {
  return {
    getSelected() {
      return V.getSelectedActor();
    },
    logResources() {
      const t = P(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const r = e.ordem.getActorSnapshot(t);
      i.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && i.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(t) {
      await v(
        e,
        "Gasto de PE",
        P("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await v(
        e,
        "Gasto de PD",
        P("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await v(
        e,
        "Dano em PV",
        P("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await v(
        e,
        "Cura de PV",
        P("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await v(
        e,
        "Dano em SAN",
        P("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await v(
        e,
        "Recuperação de SAN",
        P("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function v(e, t, r, a) {
  if (!r) return;
  const n = await a(r);
  if (!n.ok) {
    Ir(n.error);
    return;
  }
  const o = n.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    i.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  i.info(`${t} realizado:`, be(o));
}
function P(e) {
  const t = V.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ir(e) {
  if (e.reason === "update-failed") {
    i.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    i.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  i.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const w = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Sr() {
  q(w.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), q(w.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), q(w.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), q(w.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function ne() {
  return {
    enabled: B(w.enabled),
    console: B(w.console),
    ui: B(w.ui),
    chat: B(w.chat)
  };
}
async function k(e, t) {
  await game.settings.set(c, w[e], t);
}
function q(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function B(e) {
  return game.settings.get(c, e) === !0;
}
function Er() {
  return {
    status() {
      return ne();
    },
    async enable() {
      await k("enabled", !0);
    },
    async disable() {
      await k("enabled", !1);
    },
    async enableConsole() {
      await k("console", !0);
    },
    async disableConsole() {
      await k("console", !1);
    },
    async enableUi() {
      await k("ui", !0);
    },
    async disableUi() {
      await k("ui", !1);
    },
    async enableChat() {
      await k("chat", !0);
    },
    async disableChat() {
      await k("chat", !1);
    }
  };
}
const ht = "ritual.costOnly", yt = "ritual.simpleHealing", vr = "ritual.eletrocussao", At = "ritual.simpleDamage", Rt = "generic.simpleHealing", bt = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Dr() {
  return [
    _r(),
    Nr(),
    Or(),
    Fr(),
    Lr()
  ];
}
function _r() {
  return {
    id: ht,
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
function Nr() {
  return {
    id: yt,
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
    automation: wt(),
    itemPatch: Ur()
  };
}
function Or() {
  return {
    id: vr,
    version: "1.0.0",
    label: "Eletrocussão",
    description: "Preset inicial de dano de energia. Gasta o custo do ritual, rola dano conforme a forma escolhida e prepara ação assistida para aplicar dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["eletrocussao", "eletrocucao"]
      }
    ],
    automation: Mr(),
    itemPatch: Vr()
  };
}
function Fr() {
  return {
    id: At,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: we()
  };
}
function Lr() {
  return {
    id: Rt,
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
function wt(e = "2d8+2") {
  return kt(
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
function Mr() {
  return {
    ...we("1d8", {
      label: "Eletrocussão",
      title: "Eletrocussão",
      damageType: "energia",
      message: "Gasta o custo do ritual, rola dano de energia e prepara aplicação de dano em PV do alvo. Resistência deve ser resolvida manualmente por enquanto."
    }),
    ritualForms: {
      base: {
        label: "Padrão",
        rollFormulaOverrides: {
          damage: "1d8"
        }
      },
      discente: {
        label: "Discente",
        extraCost: 2,
        rollFormulaOverrides: {
          damage: "3d8"
        }
      },
      verdadeiro: {
        label: "Verdadeiro",
        extraCost: 5,
        rollFormulaOverrides: {
          damage: "6d8"
        },
        notes: ["Se o alvo falhar na Fortitude, aplique Atordoado por 1 rodada manualmente."]
      }
    }
  };
}
function we(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", a = t.title ?? "Ritual de dano simples", n = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return kt(
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
          damageType: n
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
          title: a,
          message: o
        }
      ]
    },
    "damage",
    e
  );
}
function Ur() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: bt,
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
function Vr() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: bt,
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
function kt(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((a) => a.type !== "rollFormula" || a.id !== t ? a : {
      ...a,
      formula: r
    })
  };
}
function ke() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: _(t.id),
    actorId: _(t.actor?.id),
    sceneId: _(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Tt() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: _(e.id),
    actorId: _(t?.id),
    sceneId: _(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function _(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function jr(e) {
  return {
    logFirstRitualCost() {
      const t = $("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const r = C(t);
      if (!r) return;
      const a = e.ritualCosts.getCost({ actor: t, ritual: r });
      if (!a.ok) {
        i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      i.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: r.name,
        cost: a.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${r.name} custa ${a.value.amount} ${a.value.resource} (${a.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, r = "PE") {
      const a = $("Nenhum ator encontrado para configurar custo customizado.");
      if (!a) return;
      const n = C(a);
      if (n) {
        if (!Hr(t, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await n.setFlag(c, "ritual.cost", {
          resource: r,
          amount: t
        }), i.info(`Custo customizado aplicado em ${n.name}.`, { resource: r, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${n.name} agora custa ${t} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = $("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = C(t);
      r && (await r.unsetFlag(c, "ritual.cost"), i.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = $("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = C(t);
      if (!r) return;
      const a = e.automationRegistry.require(ht);
      if (!a.ok) {
        i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value), i.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = $("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const a = C(r);
      if (!a) return;
      if (!Ne(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const n = e.automationRegistry.require(yt);
      if (!n.ok) {
        i.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, n.value, {
        definition: wt(t)
      }), i.info(`Preset de cura simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${a.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = $("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const a = C(r);
      if (!a) return;
      if (!Ne(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const n = e.automationRegistry.require(At);
      if (!n.ok) {
        i.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(a, n.value, {
        definition: we(t)
      }), i.info(`Preset de dano simples aplicado ao ritual: ${a.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${a.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = $("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = C(t);
      r && await qr(e, t, r);
    }
  };
}
async function qr(e, t, r) {
  const a = Ae(r);
  if (!a.ok) {
    i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const n = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: Tt(),
    item: r,
    targets: ke()
  });
  if (!n.ok) {
    Br(n.error);
    return;
  }
  i.info("Automação de ritual executada com sucesso.", S(n.value.context));
}
function Br(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    i.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    i.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  i.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function $(e) {
  const t = V.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function C(e) {
  const t = pt(e);
  return t || (i.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Hr(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Ne(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const xr = ["disabled", "ask", "automatic"], zr = ["buttons", "confirm"], Pt = "ask";
function Wr(e) {
  return typeof e == "string" && xr.includes(e);
}
function Gr(e) {
  return typeof e == "string" && zr.includes(e);
}
function Kr(e) {
  return Wr(e) ? e : Gr(e) ? "ask" : Pt;
}
const z = {
  executionMode: "itemUse.executionMode",
  autoRun: "itemUse.autoRun.enabled"
};
function Yr() {
  game.settings.register(c, z.executionMode, {
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
    default: Pt
  }), game.settings.register(c, z.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Oe() {
  return {
    executionMode: Kr(game.settings.get(c, z.executionMode))
  };
}
async function I(e) {
  await game.settings.set(c, z.executionMode, e);
}
function Qr(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await I("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await I("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await I(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await I("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await I("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await I("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await I("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Xr = [
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
function Zr(e) {
  return {
    phases() {
      return Xr;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Q("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = yr(t);
      if (!r) {
        i.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Fe(e, t, r);
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
      if (!ta(r)) {
        i.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const a = ea(r) ?? Q("Nenhum ator encontrado para executar automação do item.");
      a && await Fe(e, a, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Q("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = hr(t);
      if (!r) {
        i.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const a = e.automationRegistry.require(Rt);
        if (!a.ok) {
          i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(r, a.value), i.info(`Preset de teste aplicado ao item: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${r.name}.`);
      } catch (a) {
        i.error("Falha ao configurar automação de teste no item.", a), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function Fe(e, t, r) {
  const a = Ae(r);
  if (!a.ok) {
    i.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
    return;
  }
  const n = await e.workflow.runAutomation(a.value, {
    sourceActor: t,
    sourceToken: Tt(),
    item: r,
    targets: ke()
  });
  if (!n.ok) {
    Jr(n.error);
    return;
  }
  i.info("Automação executada com sucesso.", S(n.value.context));
}
function Jr(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    i.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    i.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  i.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Q(e) {
  const t = V.getSelectedActor();
  return t || (i.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ea(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ta(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ra(e) {
  const t = Cr(e), r = Rr(e), a = jr(e), n = Zr(e), o = Er(), s = Qr(e);
  return {
    actor: t,
    automation: r,
    ritual: a,
    workflow: n,
    output: o,
    itemUseIntegration: s,
    getSelectedActor() {
      return t.getSelected();
    },
    logSelectedActorResources() {
      t.logResources();
    },
    async spendSelectedActorPE(u) {
      await t.spendPE(u);
    }
  };
}
function aa(e) {
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
    debug: ra(e)
  }, r = globalThis;
  return r[c] = t, r.ParanormalToolkit = t, t;
}
class Le {
  static isSupportedSystem() {
    return game.system.id === rr;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function na() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: N(t.id),
    actorId: N(t.actor?.id),
    sceneId: N(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function $t() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, r = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: N(e.id),
    actorId: N(t?.id),
    sceneId: N(e.scene?.id),
    name: r
  };
}
function oa(e, t = $t()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function sa(e) {
  if (!ca(e)) return null;
  const t = e.getFlag(c, "workflow");
  return ua(t) ? t : null;
}
function ia() {
  return `flags.${c}.workflow`;
}
function Me(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), r = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || r !== void 0;
}
function Ue(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return oe(t) || oe(r);
}
function ua(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function ca(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function N(e) {
  return oe(e) ? e : null;
}
function oe(e) {
  return typeof e == "string" && e.length > 0;
}
function la() {
  const e = (t, r) => {
    ma(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function ma(e, t) {
  const r = sa(e);
  if (!r || r.targets.length === 0) return;
  const a = fa(t);
  if (!a || a.querySelector(`.${c}-chat-enrichment`)) return;
  (a.querySelector(".message-content") ?? a).append(da(r));
}
function da(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(Ve("Origem", e.source.name)), t.append(Ve("Alvo", e.targets.map((a) => a.name).join(", "))), t;
}
function Ve(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${c}-chat-enrichment__row`);
  const a = document.createElement("span");
  a.textContent = `${e}: `;
  const n = document.createElement("span");
  return n.textContent = t, r.append(a, n), r;
}
function fa(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function pa() {
  Hooks.on("preCreateChatMessage", (e, t, r, a) => {
    if (!ga(a) || !ha(e) || Me(e) || Me(t)) return;
    const n = na();
    if (n.length === 0 || !Ue(e) && !Ue(t)) return;
    const o = $t();
    e.updateSource({
      [ia()]: oa(n, o)
    }), i.info("Targets capturados para ChatMessage.", { source: o, targets: n });
  });
}
function ga(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function ha(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const Ct = {
  enabled: "dice.animations.enabled"
};
function ya() {
  game.settings.register(c, Ct.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Aa() {
  return {
    enabled: game.settings.get(c, Ct.enabled) === !0
  };
}
const M = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, It = {
  PV: "system.attributes.hp"
}, se = {
  PV: [M.PV, It.PV],
  SAN: [M.SAN],
  PE: [M.PE],
  PD: [M.PD]
}, ie = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Ra {
  getResource(t, r) {
    const a = je(t, r);
    if (!a.ok)
      return l(a.error);
    const n = a.value, o = `${n}.value`, s = `${n}.max`, u = foundry.utils.getProperty(t, o), d = foundry.utils.getProperty(t, s), p = Be(t, r, o, u, "valor atual");
    if (p) return l(p);
    const y = Be(t, r, s, d, "valor máximo");
    return y ? l(y) : f({
      value: u,
      max: d
    });
  }
  async updateResourceValue(t, r, a) {
    const n = je(t, r);
    if (!n.ok)
      throw new Error(n.error.message);
    await t.update({ [`${n.value}.value`]: a });
  }
}
function je(e, t) {
  const r = ba(e.type, t);
  if (r && qe(e, r))
    return f(r);
  const a = se[t].find(
    (n) => qe(e, n)
  );
  return a ? f(a) : l({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: wa(e, t),
    path: se[t].join(" | ")
  });
}
function ba(e, t) {
  return e === "threat" ? It[t] ?? null : e === "agent" ? M[t] : null;
}
function qe(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), a = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof a == "number" && Number.isFinite(a);
}
function wa(e, t) {
  const r = e.type ?? "unknown", a = se[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${a}.`;
}
function Be(e, t, r, a, n) {
  return a == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${n} de ${t} não encontrado: ${r}.`,
    path: r,
    value: a
  } : typeof a != "number" || !Number.isFinite(a) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${n} de ${t} em ${r}.`,
    path: r,
    value: a
  } : null;
}
class ka {
  isRitual(t) {
    return t.type === "ritual";
  }
  getCircle(t) {
    if (!this.isRitual(t))
      return l({
        reason: "not-a-ritual",
        message: `Item ${t.name ?? "sem nome"} não é um ritual.`,
        ritual: t
      });
    const r = this.readCircleFromKnownPaths(t);
    if (!r) {
      const s = ie.ritualItem.circleCandidates;
      return l({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: a, value: n } = r, o = Ta(n);
    return o ? f(o) : l({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${a}: ${String(n)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: a,
      value: n
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of ie.ritualItem.circleCandidates) {
      const a = foundry.utils.getProperty(t, r);
      if (a != null)
        return { path: r, value: a };
    }
    return null;
  }
}
function Ta(e) {
  if (He(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (He(r))
      return r;
  }
  return null;
}
function He(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Pa = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class $a {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const r = this.ritualAdapter.getCircle(t.ritual);
    if (!r.ok)
      return l({
        ...r.error,
        actor: t.actor
      });
    const a = r.value, n = Ca(t.ritual, a);
    return n.ok ? n.value ? f(n.value) : f({
      resource: "PE",
      amount: Pa[a],
      source: "default-by-circle",
      circle: a
    }) : l(n.error);
  }
}
function Ca(e, t) {
  const r = e.getFlag(c, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Ia(r) ? {
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
function Ia(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const X = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Sa(e) {
  if (!Oa(e.item)) return null;
  const t = ue(e.actor) ? e.actor : Ea(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Da(e.token) ?? va(t),
    targets: ke(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Ea(e) {
  const t = e;
  return ue(t.actor) ? t.actor : ue(e.parent) ? e.parent : null;
}
function va(e) {
  const t = _a(e) ?? Na(e);
  return t ? St(t) : null;
}
function Da(e) {
  return ce(e) ? St(e) : null;
}
function _a(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return ce(r) ? r : (t.getActiveTokens?.() ?? []).find(ce) ?? null;
}
function Na(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function St(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Z(e.id),
    actorId: Z(t?.id),
    sceneId: Z(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Oa(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ue(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function ce(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Z(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Fa {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(X.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, i.info(`${X.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = Sa(La(t));
    if (!r) {
      i.warn(`${X.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function La(e) {
  return e && typeof e == "object" ? e : {};
}
class Ma {
  async applyPresetItemPatch(t, r) {
    const a = r.itemPatch;
    if (!a) return J("missing-item-patch");
    if (t.type !== "ritual") return J("unsupported-item-type");
    const n = Ua(a);
    return Object.keys(n).length === 0 ? J("empty-update") : (await t.update(n), {
      applied: !0,
      updateData: n
    });
  }
}
function Ua(e) {
  const t = {};
  A(t, "name", e.name), A(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (A(t, "system.circle", r.circle), A(t, "system.element", r.element), A(t, "system.target", r.target), A(t, "system.targetQtd", r.targetQuantity), A(t, "system.execution", r.execution), A(t, "system.range", r.range), A(t, "system.duration", r.duration), A(t, "system.skillResis", r.resistanceSkill), A(t, "system.resistance", r.resistance), A(t, "system.studentForm", r.studentForm), A(t, "system.trueForm", r.trueForm)), t;
}
function A(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function J(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Va {
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
    return this.getNumber(t, ie.ritual.dt, 0);
  }
  getResources(t) {
    const r = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, a = [];
    for (const n of ["PV", "SAN", "PE", "PD"]) {
      const o = this.resourceAdapter.getResource(t, n);
      o.ok ? r[n] = o.value : a.push(o.error);
    }
    return { values: r, errors: a };
  }
  getNumber(t, r, a) {
    const n = foundry.utils.getProperty(t, r);
    return typeof n == "number" && Number.isFinite(n) ? n : a;
  }
}
class ja {
  async applyPreset(t, r, a = {}) {
    const n = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: r.id,
        presetVersion: r.version,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: a.definition ?? r.automation
    };
    return await this.writeAutomationFlag(t, n), n;
  }
  async applyManualDefinition(t, r, a = r.label) {
    const n = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: a,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: r
    };
    return await this.writeAutomationFlag(t, n), n;
  }
  async clear(t) {
    await t.unsetFlag(c, "automation");
  }
  async writeAutomationFlag(t, r) {
    await this.clear(t), await t.setFlag(c, "automation", r);
  }
}
class qa {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = Ba(t);
    return r.ok ? this.presets.has(t.id) ? l({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, ee(t)), f(t)) : r;
  }
  registerMany(t) {
    const r = [];
    for (const a of t) {
      const n = this.register(a);
      if (!n.ok)
        return n;
      r.push(n.value);
    }
    return f(r);
  }
  get(t) {
    const r = this.presets.get(t);
    return r ? ee(r) : null;
  }
  require(t) {
    const r = this.get(t);
    return r ? f(r) : l({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(ee);
  }
  findForItem(t) {
    return this.list().map((r) => Ha(r, t)).filter((r) => r !== null).sort((r, a) => a.score - r.score || r.preset.id.localeCompare(a.preset.id));
  }
}
function Ba(e) {
  return !te(e.id) || !te(e.version) || !te(e.label) ? l({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? l({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : f(e);
}
function Ha(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let a = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    a += 10, r.push(`itemType:${t.type}`);
  }
  for (const n of e.matchers) {
    const o = xa(n, t);
    if (!o.matches)
      return null;
    a += o.score, r.push(o.reason);
  }
  return {
    preset: e,
    score: a,
    reasons: r
  };
}
function xa(e, t) {
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
      const r = xe(t.name), a = e.names.map(xe).includes(r);
      return {
        matches: a,
        score: a ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = za(t), a = r !== null && e.circles.includes(r);
      return {
        matches: a,
        score: a ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function xe(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function za(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function ee(e) {
  return structuredClone(e);
}
function te(e) {
  return typeof e == "string" && e.length > 0;
}
function W(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? l({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : f(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = K(e.amountFrom);
    if (!r)
      return l({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const a = t.rolls[r];
    if (!a)
      return l({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${r}.`
      });
    const n = Math.trunc(a.total);
    return !Number.isInteger(n) || n <= 0 ? l({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${r} não gerou um amount positivo.`
    }) : f(n);
  }
  return l({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function K(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const Wa = "dice-so-nice";
async function Ga(e) {
  if (!Aa().enabled || !Ka()) return;
  const t = Ya();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      i.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function Ka() {
  return game.modules.get(Wa)?.active === !0;
}
function Ya() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Qa(e, t, r) {
  if (!ze(e.id) || !ze(e.formula))
    return l({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const a = new Roll(e.formula), n = await Promise.resolve(a.evaluate()), o = n.total;
    if (typeof o != "number" || !Number.isFinite(o))
      return l({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await Ga(n);
    const u = {
      ...r.rollRequests[e.id] ?? Et(e, t),
      total: o,
      roll: n
    };
    return r.rolls[e.id] = u, f(u);
  } catch (a) {
    return l({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: a
    });
  }
}
function Et(e, t) {
  const r = e.intent ?? Xa(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function Xa(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function ze(e) {
  return typeof e == "string" && e.length > 0;
}
async function le(e, t, r, a, n) {
  switch (a) {
    case "spend":
      return r !== "PE" && r !== "PD" ? H(t, r, a, n) : e.spend(t, r, n);
    case "damage":
      return r !== "PV" && r !== "SAN" ? H(t, r, a, n) : e.damage(t, r, n);
    case "heal":
      return r !== "PV" ? H(t, r, a, n) : e.heal(t, r, n);
    case "recover":
      return r !== "SAN" ? H(t, r, a, n) : e.recover(t, r, n);
  }
}
function H(e, t, r, a) {
  return l({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    resource: t,
    operation: r,
    reason: "invalid-resource-operation",
    message: `Operação ${r} não é válida para ${t}.`,
    requestedAmount: a
  });
}
function Za(e) {
  const { step: t, context: r, transaction: a, stepIndex: n, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = Ja(t, r, a, n);
    r.damageInstances.push(s), o.emit("afterDamageResolution", r, {
      stepIndex: n,
      step: t,
      damage: s,
      resourceTransaction: a,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), o.emit("afterApplyDamage", r, {
      stepIndex: n,
      step: t,
      damage: s,
      resourceTransaction: a,
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
    const s = en(t, r, a, n);
    r.healingInstances.push(s), o.emit("afterApplyHealing", r, {
      stepIndex: n,
      step: t,
      healing: s,
      resourceTransaction: a,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount
      }
    });
  }
}
function Ja(e, t, r, a) {
  const n = K(e.amountFrom), o = n ? t.rolls[n] : void 0;
  return {
    id: vt(t.id, "damage", a, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: n ?? void 0,
    damageType: o?.damageType,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function en(e, t, r, a) {
  const n = K(e.amountFrom);
  return {
    id: vt(t.id, "healing", a, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: r.actorId,
    targetActorName: r.actorName,
    rollId: n ?? void 0,
    rawAmount: r.requestedAmount,
    finalAmount: r.requestedAmount,
    appliedAmount: r.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function vt(e, t, r, a) {
  return `${e}.${t}.${r}.${a}`;
}
function tn(e, t, r) {
  const a = K(e.amountFrom), n = a ? t.rolls[a] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    amountFrom: e.amountFrom,
    rollId: a,
    rollIntent: n?.intent,
    damageType: n?.damageType
  };
}
function rn(e) {
  const { step: t, context: r, stepIndex: a, metadata: n, lifecycle: o } = e;
  o.emit("beforeApply", r, { stepIndex: a, step: t, metadata: n }), Dt("before", e), We("before", e), We("resolve", e);
}
function an(e) {
  const { step: t, context: r, stepIndex: a, metadata: n, lifecycle: o } = e;
  o.emit("apply", r, { stepIndex: a, step: t, metadata: n }), Dt("apply", e);
}
function nn(e) {
  const { step: t, context: r, stepIndex: a, metadata: n, lifecycle: o } = e;
  o.emit("afterApply", r, { stepIndex: a, step: t, metadata: n });
}
function Dt(e, t) {
  const { step: r, context: a, stepIndex: n, metadata: o, lifecycle: s } = t, u = on(e, r.operation);
  u && s.emit(u, a, {
    stepIndex: n,
    step: r,
    metadata: o
  });
}
function We(e, t) {
  const { step: r, context: a, stepIndex: n, metadata: o, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", a, {
    stepIndex: n,
    step: r,
    metadata: o
  });
}
function on(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function sn(e, t, r) {
  try {
    return await e.createWorkflowSummaryMessage(r, t), f(void 0);
  } catch (a) {
    return l({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: a
    });
  }
}
async function un(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return cn(e, t);
    case "spendRitualCost":
      return ln(e, t);
  }
}
async function cn(e, t) {
  const { context: r, resources: a } = e, n = W(t, r);
  return n.ok ? _t(await a.spend(r.sourceActor, t.resource, n.value), r) : l(n.error);
}
async function ln(e, t) {
  const { context: r, resources: a, ritualCosts: n } = e, o = n.getCost({
    actor: r.sourceActor,
    ritual: r.item
  });
  if (!o.ok)
    return l({
      reason: "ritual-cost-failed",
      message: o.error.message,
      cause: o.error
    });
  const s = o.value;
  return r.ritualCosts.push({
    ...s,
    itemId: r.item.id ?? null,
    itemName: r.item.name ?? "Ritual sem nome"
  }), _t(await a.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function _t(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), f(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), l({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function mn(e) {
  const { step: t, context: r, stepIndex: a, lifecycle: n, execute: o } = e, s = dn(t);
  for (const d of s.before)
    n.emit(d, r, { stepIndex: a, step: t });
  const u = await o();
  if (!u.ok)
    return u;
  for (const d of s.after)
    n.emit(d, r, { stepIndex: a, step: t });
  return u;
}
function dn(e) {
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
class fn {
  constructor(t, r, a, n) {
    this.resources = t, this.ritualCosts = r, this.messages = a, this.lifecycle = n;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, r) {
    if (t.steps.length === 0)
      return l({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: r
      });
    for (const [a, n] of t.steps.entries()) {
      const o = await this.runStep(n, r, a);
      if (!o.ok)
        return o;
    }
    return f({ definition: t, context: r });
  }
  async runStep(t, r, a) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, r, a);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, r, a);
      default:
        return mn({
          step: t,
          context: r,
          stepIndex: a,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(t, r, a)
        });
    }
  }
  async executeStep(t, r, a) {
    switch (t.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(t, r, a);
      case "rollFormula":
        return this.runRollFormulaStep(t, r, a);
      case "modifyResource":
        return this.runModifyResourceStep(t, r, a);
      case "chatCard":
        return this.runChatCardStep(t, r, a);
      default:
        return l({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: a,
          step: t,
          context: r
        });
    }
  }
  async runCostStep(t, r, a) {
    const n = await un({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return n.ok ? f(void 0) : l({ ...n.error, stepIndex: a, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, a) {
    const n = Et(t, a);
    r.rollRequests[n.id] = n, this.lifecycle.emit("beforeRoll", r, { stepIndex: a, step: t, rollRequest: n }), this.emitSpecificRollPhase("before", n, r, a, t), this.lifecycle.emit("roll", r, { stepIndex: a, step: t, rollRequest: n }), this.emitSpecificRollPhase("roll", n, r, a, t);
    const o = await this.runRollFormulaStep(t, r, a);
    if (!o.ok)
      return o;
    const s = r.rolls[n.id];
    return this.emitSpecificRollPhase("after", n, r, a, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: a, step: t, rollRequest: n, rollResult: s }), f(void 0);
  }
  async runRollFormulaStep(t, r, a) {
    const n = await Qa(t, a, r);
    return n.ok ? f(void 0) : l({ ...n.error, stepIndex: a, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, a) {
    const n = W(t, r);
    if (!n.ok)
      return l({ ...n.error, stepIndex: a, step: t, context: r });
    const o = tn(t, r, n.value);
    rn({
      step: t,
      context: r,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), an({
      step: t,
      context: r,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, r);
    if (s.length === 0)
      return l({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: t,
        context: r
      });
    for (const u of s) {
      const d = await le(this.resources, u, t.resource, t.operation, n.value), p = this.handleResourceOperationResult(d, r, a, t);
      if (!p.ok)
        return p;
      Za({
        step: t,
        context: r,
        transaction: p.value,
        stepIndex: a,
        lifecycle: this.lifecycle
      });
    }
    return nn({
      step: t,
      context: r,
      stepIndex: a,
      metadata: o,
      lifecycle: this.lifecycle
    }), f(void 0);
  }
  async runModifyResourceStep(t, r, a) {
    const n = W(t, r);
    if (!n.ok)
      return l({ ...n.error, stepIndex: a, step: t, context: r });
    const o = this.resolveActors(t.actor, r);
    if (o.length === 0)
      return l({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: a,
        step: t,
        context: r
      });
    for (const s of o) {
      const u = await le(this.resources, s, t.resource, t.operation, n.value), d = this.handleResourceOperationResult(u, r, a, t);
      if (!d.ok)
        return d;
    }
    return f(void 0);
  }
  async runChatCardStep(t, r, a) {
    const n = await sn(this.messages, t, r);
    return n.ok ? f(void 0) : l({ ...n.error, stepIndex: a, step: t, context: r });
  }
  handleResourceOperationResult(t, r, a, n) {
    return t.ok ? (r.resourceTransactions.push(t.value), f(t.value)) : l({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: a,
      step: n,
      context: r,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, r, a, n, o, s) {
    const u = pn(t, r.intent);
    u && this.lifecycle.emit(u, a, {
      stepIndex: n,
      step: o,
      rollRequest: r,
      rollResult: s
    });
  }
  resolveActors(t, r) {
    switch (t) {
      case "self":
        return [r.sourceActor];
      case "target":
        return r.targets.flatMap((a) => a.actor ? [a.actor] : []);
    }
  }
}
function pn(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class gn {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async spend(t, r, a) {
    return this.execute(t, r, "spend", a);
  }
  async damage(t, r, a) {
    return this.execute(t, r, "damage", a);
  }
  async heal(t, r, a) {
    return this.execute(t, r, "heal", a);
  }
  async recover(t, r, a) {
    return this.execute(t, r, "recover", a);
  }
  async execute(t, r, a, n) {
    if (!Number.isInteger(n) || n <= 0)
      return l({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: n
      });
    const o = this.adapter.getResource(t, r);
    if (!o.ok)
      return l({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: o.error.reason,
        message: o.error.message,
        requestedAmount: n,
        path: o.error.path,
        value: o.error.value
      });
    const s = o.value, u = this.calculate(a, s, n);
    if (!u.ok)
      return l({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: u.error.reason,
        message: u.error.message,
        requestedAmount: n,
        current: s.value,
        required: n
      });
    const { afterValue: d, appliedAmount: p } = u.value, y = {
      value: d,
      max: s.max
    };
    try {
      d !== s.value && await this.adapter.updateResourceValue(t, r, d);
    } catch (R) {
      return l({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: r,
        operation: a,
        reason: "update-failed",
        message: `Falha ao atualizar ${r} no ator.`,
        requestedAmount: n,
        current: s.value,
        required: n,
        cause: R
      });
    }
    return f({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: r,
      operation: a,
      requestedAmount: n,
      appliedAmount: p,
      before: s,
      after: y
    });
  }
  calculate(t, r, a) {
    switch (t) {
      case "spend":
        return r.value < a ? l({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${r.value}; custo: ${a}.`
        }) : f({
          afterValue: r.value - a,
          appliedAmount: a
        });
      case "damage": {
        const n = Math.max(0, r.value - a);
        return f({
          afterValue: n,
          appliedAmount: r.value - n
        });
      }
      case "heal":
      case "recover": {
        const n = Math.min(r.max, r.value + a);
        return f({
          afterValue: n,
          appliedAmount: n - r.value
        });
      }
    }
  }
}
function hn(e) {
  return {
    id: yn(),
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
function yn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class An {
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
    return S(this.lastContext);
  }
  async runAutomation(t, r) {
    const a = hn(r);
    this.lastContext = a, this.hooks.emit("created", a, {
      metadata: {
        definitionLabel: t.label,
        itemId: a.item.id ?? null,
        itemName: a.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", a), this.hooks.emit("resolveTargets", a, {
      metadata: {
        targetCount: a.targets.length
      }
    });
    const n = await this.automation.run(t, a);
    return n.ok ? (this.hooks.emit("completed", a), n) : (this.emitFailed(a, n.error), n);
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
class Rn {
  emit(t, r, a = {}) {
    const n = {
      phase: t,
      context: r,
      stepIndex: a.stepIndex,
      step: a.step,
      rollRequest: a.rollRequest,
      rollResult: a.rollResult,
      damage: a.damage,
      healing: a.healing,
      resourceTransaction: a.resourceTransaction,
      metadata: a.metadata
    };
    return r.phases.push(t), r.lifecycleEvents.push({
      phase: t,
      stepIndex: a.stepIndex,
      stepType: a.step?.type,
      rollId: a.rollRequest?.id ?? a.rollResult?.id,
      rollIntent: a.rollRequest?.intent ?? a.rollResult?.intent,
      damageId: a.damage?.id,
      healingId: a.healing?.id,
      resourceOperation: a.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${c}.workflow.${t}`, n), Hooks.callAll(`${c}.workflow.phase`, n), n;
  }
}
class bn {
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
    const r = ne();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: wn(),
      flags: {
        ...t.flags,
        [c]: {
          ...kn(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && i.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const a = ne();
    if (!a.enabled)
      return;
    const n = r.notification ?? Ge(r);
    a.console && this.emitConsole(t, r), a.ui && this.emitUi(t, n);
  }
  emitConsole(t, r) {
    const a = Ge(r);
    switch (t) {
      case "info":
        i.info(a, r.data ?? "");
        return;
      case "warn":
        i.warn(a, r.data ?? "");
        return;
      case "error":
        i.error(a, r.data ?? "");
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
function Ge(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function wn() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function kn(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const Tn = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Nt = `${c}-inline-roll-neutralized`, Pn = `${c}-inline-roll-notice`, Te = `data-${c}-inline-roll-neutralized`, Ke = `data-${c}-inline-roll-notice`, $n = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Cn(e) {
  const t = jn(e.message), r = await In(e.message), a = Sn(t);
  return r.replacementCount + a.replacementCount > 0 && i.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: e.item.id ?? null,
    itemName: e.item.name ?? "Item sem nome",
    messageId: t,
    contentReplacementCount: r.replacementCount,
    renderedReplacementCount: a.replacementCount
  }), {
    messageId: t,
    contentUpdated: r.updated,
    contentReplacementCount: r.replacementCount,
    renderedReplacementCount: a.replacementCount
  };
}
async function In(e) {
  const t = Mn(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = En(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await Un(t, r.content), replacementCount: r.replacementCount };
}
function Sn(e) {
  const t = e ? Vn(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = Ot(t);
  return r > 0 && Ft(On(t)), { replacementCount: r };
}
function En(e) {
  const t = vn(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const a = Ot(r.content), n = t.replacementCount + a;
  return n === 0 ? { content: e, replacementCount: 0 } : (Ft(r.content), { content: r.innerHTML, replacementCount: n });
}
function vn(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (a, n) => (t += 1, _n(n.trim()))), replacementCount: t };
}
function Ot(e) {
  const t = Dn(e);
  for (const r of t)
    r.replaceWith(Nn(Fn(r)));
  return t.length;
}
function Dn(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(Tn))
    r.getAttribute(Te) !== "true" && t.add(r);
  return Array.from(t);
}
function _n(e) {
  return `<span class="${Nt}" ${Te}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${qn(e)}</span>`;
}
function Nn(e) {
  const t = document.createElement("span");
  return t.classList.add(Nt), t.setAttribute(Te, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Ft(e) {
  if (e.querySelector?.(`[${Ke}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Pn), t.setAttribute(Ke, "true"), t.textContent = $n, e.append(t);
}
function On(e) {
  return e.querySelector(".message-content") ?? e;
}
function Fn(e) {
  const r = e.getAttribute("data-formula") ?? Ln(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function Ln(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Mn(e) {
  return e && typeof e == "object" ? e : null;
}
async function Un(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return i.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function Vn(e) {
  const t = Bn(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function jn(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function qn(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Bn(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Lt = ["base", "discente", "verdadeiro"];
function Mt(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Hn(e) {
  return typeof e == "string" && Lt.includes(e);
}
async function xn(e) {
  const t = Qn();
  return t ? new Promise((r) => {
    let a = !1;
    const n = (o) => {
      a || (a = !0, r(o));
    };
    new t({
      title: `Conjurar ${e.ritual.name ?? "ritual"}`,
      content: zn(e),
      default: "cast",
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: () => n(null)
        },
        cast: {
          icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
          label: "Conjurar",
          callback: (o) => n(Gn(o, e.defaultSpendResource))
        }
      },
      close: () => n(null)
    }).render(!0);
  }) : (ui.notifications?.warn("Paranormal Toolkit: Dialog não disponível. Usando opções padrão do ritual."), {
    variant: "base",
    spendResource: e.defaultSpendResource
  });
}
function zn(e) {
  const t = e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado", r = e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido", a = e.defaultSpendResource ? "checked" : "";
  return `
    <form class="paranormal-toolkit-ritual-cast-dialog">
      <p class="paranormal-toolkit-ritual-cast-dialog__hint">
        Configure a conjuração antes do Toolkit gastar recurso, rolar dados ou preparar ações no chat.
      </p>

      <aside class="paranormal-toolkit-ritual-cast-dialog__warning" role="note">
        <strong>Aviso temporário</strong>
        <span>
          O Toolkit ainda não consegue impedir completamente as rolagens inline da descrição nem bloquear o card original antes desta confirmação. Use o resultado oficial exibido pelo Paranormal Toolkit.
        </span>
      </aside>

      <fieldset class="paranormal-toolkit-ritual-cast-dialog__fieldset">
        <legend>Forma</legend>
        ${e.variantOptions.map(Wn).join("")}
      </fieldset>

      <label class="paranormal-toolkit-ritual-cast-dialog__checkbox">
        <input type="checkbox" name="spendResource" ${a}>
        Gastar PE/PD automaticamente
      </label>

      <dl class="paranormal-toolkit-ritual-cast-dialog__summary">
        <div><dt>Custo base previsto</dt><dd>${O(r)}</dd></div>
        <div><dt>Conjurador</dt><dd>${O(e.actor.name ?? "Ator sem nome")}</dd></div>
        <div><dt>Alvos</dt><dd>${O(t)}</dd></div>
      </dl>
    </form>
  `;
}
function Wn(e) {
  const t = e.variant === "base" ? "checked" : "", r = e.enabled ? "" : "disabled", a = e.enabled ? "" : e.unavailableReason ?? "não disponível neste ritual", n = [...e.details, a].filter((s) => s.length > 0).join(" · ");
  return `
    <label class="paranormal-toolkit-ritual-cast-dialog__variant${e.enabled ? "" : " paranormal-toolkit-ritual-cast-dialog__variant--disabled"}">
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-main">
        <input type="radio" name="variant" value="${O(e.variant)}" ${t} ${r}>
        <strong>${O(e.label)}</strong>
      </span>
      <span class="paranormal-toolkit-ritual-cast-dialog__variant-details">${O(n)}</span>
    </label>
  `;
}
function Gn(e, t) {
  const r = Yn(e), a = Kn(r), n = r?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: a,
    spendResource: n
  };
}
function Kn(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return Hn(t) ? t : "base";
}
function Yn(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Qn() {
  return globalThis.Dialog ?? null;
}
function O(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const Ut = {
  label: "Padrão"
};
class Xn {
  constructor(t, r, a) {
    this.workflow = t, this.resources = r, this.ritualCosts = a;
  }
  workflow;
  resources;
  ritualCosts;
  canHandle(t, r) {
    return t.item.type === "ritual" || r.steps.some((a) => a.type === "spendRitualCost");
  }
  async run(t, r) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const a = this.resolveCostPreview(t), n = yo(r, a), o = await xn({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((T) => T.name),
      cost: a,
      defaultSpendResource: bo(r),
      variantOptions: n
    });
    if (!o)
      return { status: "cancelled" };
    const s = Ro(r, o.variant), u = Zn(r, o, s, a);
    if (u.steps.length === 0)
      return {
        status: "failed",
        reason: "empty-preparation",
        message: "O ritual não possui custo ou rolagem para preparar antes das ações no chat."
      };
    const d = await this.workflow.runAutomation(u, {
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
          variant: o.variant,
          spendResource: o.spendResource
        }
      }
    });
    if (!d.ok)
      return {
        status: "failed",
        reason: d.error.reason,
        message: d.error.message,
        cause: d.error
      };
    const p = d.value.context, y = eo(r, t, p), R = oo(o, s, a, p);
    return y.ok ? y.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: p,
      summaryLines: R
    } : {
      status: "ready",
      workflowContext: p,
      actions: y.actions,
      summaryLines: R
    } : {
      status: "failed",
      reason: y.reason,
      message: y.message
    };
  }
  async applyAction(t) {
    return le(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function Zn(e, t, r, a) {
  const n = [];
  for (const o of e.steps)
    o.type === "modifyResource" || o.type === "chatCard" || jt(o) && !t.spendResource || n.push(Jn(o, r));
  return t.spendResource && a && qt(r.extraCost) && n.push({
    type: "spendResource",
    actor: "self",
    resource: a.resource,
    amount: r.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: n
  };
}
function Jn(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function eo(e, t, r) {
  const a = [];
  for (const n of e.steps) {
    if (n.type !== "modifyResource") continue;
    const o = W(n, r);
    if (!o.ok)
      return {
        ok: !1,
        reason: o.error.reason,
        message: o.error.message
      };
    const s = no(n.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const u of s)
      a.push(to(n, u, o.value));
  }
  return { ok: !0, actions: a };
}
function to(e, t, r) {
  const a = t.name ?? "Ator sem nome";
  return {
    kind: "resource-operation",
    actor: t,
    actorName: a,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: ro(e, a, r),
    executedLabel: ao(e, a)
  };
}
function ro(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${t} em ${r} PV` : e.operation === "damage" ? `Aplicar ${r} de dano em ${t}` : e.operation === "recover" ? `Recuperar ${r} ${e.resource} de ${t}` : e.operation === "spend" ? `Gastar ${r} ${e.resource} de ${t}` : `Aplicar ${r} ${e.resource} em ${t}`;
}
function ao(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function no(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function oo(e, t, r, a) {
  return [
    `Forma: ${Mt(e.variant)}`,
    so(e, t, r),
    ...Object.values(a.rolls).flatMap(io),
    ...go(t)
  ];
}
function so(e, t, r) {
  const a = t.extraCost ?? 0;
  return r ? e.spendResource ? a > 0 ? `Custo: ${r.amount + a} ${r.resource} gasto (${r.amount} base + ${a} extra)` : `Custo: ${r.amount} ${r.resource} gasto` : a > 0 ? `Custo: ${r.amount} ${r.resource} + ${a} extra não gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? a > 0 ? `Custo: não resolvido (+${a} extra)` : "Custo: não resolvido" : "Custo: não gasto";
}
function io(e) {
  const r = [`${ho(e)}: ${e.formula} = ${Math.trunc(e.total)}`], a = uo(e.roll);
  return a && r.push(`Dados: ${a}`), e.damageType && r.push(`Tipo: ${po(e.damageType)}`), r;
}
function uo(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const r = [];
  let a = "+";
  for (const n of t) {
    if (!n || typeof n != "object") continue;
    const o = n;
    if (o.operator === "+" || o.operator === "-") {
      a = o.operator;
      continue;
    }
    const s = co(o);
    s && (fo(r, s.operator ?? a, s.value), a = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function co(e) {
  const t = lo(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : mo(e);
}
function lo(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function mo(e) {
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
function fo(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function po(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function go(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function ho(e) {
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
function yo(e, t) {
  return Lt.map((r) => {
    const a = Vt(e, r), n = r === "base" || a !== null, o = a ?? (r === "base" ? Ut : null);
    return {
      variant: r,
      label: o?.label ?? Mt(r),
      enabled: n,
      details: o ? Ao(o, t) : [],
      unavailableReason: n ? void 0 : "não disponível neste ritual"
    };
  });
}
function Ao(e, t) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {});
  return a.length > 0 && r.push(a.join(", ")), qt(e.extraCost) ? r.push(t ? `+${e.extraCost} ${t.resource}` : `+${e.extraCost} PE/PD`) : r.push("custo base"), r;
}
function Ro(e, t) {
  return Vt(e, t) ?? Ut;
}
function Vt(e, t) {
  return e.ritualForms?.[t] ?? null;
}
function bo(e) {
  return e.steps.some(jt);
}
function jt(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function qt(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Bt = "itemUsePrompts", Ht = "data-paranormal-toolkit-prompt-id", G = "data-paranormal-toolkit-pending-id", me = "data-paranormal-toolkit-executed-label", Ye = "data-paranormal-toolkit-detail-key", Qe = "data-paranormal-toolkit-roll-card", Pe = "data-paranormal-toolkit-roll-detail-toggle", xt = "data-paranormal-toolkit-roll-detail-id", wo = `[${G}]`, ko = `[${Pe}]`, Xe = `${c}-chat-enrichment`, h = `${c}-item-use-prompt`, Ze = `${h}__actions`, Je = `${h}__details`, To = `${h}__summary`, Po = `${h}__title`, zt = `${h}__button--executed`, et = `${h}__roll-card`;
let tt = !1, de = null;
const E = /* @__PURE__ */ new Map();
function $o(e) {
  de = e, !tt && (Hooks.on("renderChatMessageHTML", (t, r) => {
    Io(t, r, e);
  }), tt = !0);
}
async function rt(e) {
  const t = Co(e);
  E.set(e.pendingId, t), await Zo(t), So(e.pendingId);
}
async function at(e) {
  const t = E.get(e);
  E.delete(e), t && await Jo(t);
}
function Co(e) {
  const t = Ie(e.context.message);
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    summary: jo(e.context),
    executed: !1
  };
}
function Io(e, t, r) {
  Xo();
  const a = Ce(t);
  if (!a) return;
  const n = Ko(e, a);
  for (const o of n)
    fe(a, o);
  Wt(a, r), pe(a);
}
function So(e) {
  const t = E.get(e);
  if (!t) return;
  const r = t.messageId ? Yo(t.messageId) : null;
  if (r) {
    fe(r, t), nt(r), pe(r);
    return;
  }
  if (t.messageId) return;
  const a = Qo(t);
  a && (fe(a, t), nt(a), pe(a));
}
function nt(e) {
  de && Wt(e, de);
}
function fe(e, t) {
  if (e.querySelector(`[${Ht}="${Y(t.pendingId)}"]`)) return;
  const r = Eo(e, t);
  Do(r, t), Lo(r).append(Vo(t));
}
function Eo(e, t) {
  const r = e.querySelector(`.${Xe}`);
  if (r)
    return r;
  const a = document.createElement("section");
  a.classList.add(Xe, h);
  const n = document.createElement("header");
  n.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Po), s.textContent = vo(t);
  const u = document.createElement("span");
  return u.classList.add(To), u.textContent = t.summary, n.append(o, s, u), a.append(n), Bo(e).append(a), a;
}
function vo(e) {
  const t = D(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function Do(e, t) {
  const r = t.summaryLines ?? [], a = zo(r, t);
  if (a) {
    _o(e, a, t.pendingId);
    return;
  }
  Mo(e, r);
}
function _o(e, t, r) {
  if (e.querySelector(`[${Qe}="true"]`)) return;
  const a = document.createElement("article");
  a.classList.add(et, `${et}--${t.intent}`), a.setAttribute(Qe, "true");
  const n = document.createElement("div");
  n.classList.add(`${h}__roll-summary`);
  const o = document.createElement("span");
  o.classList.add(`${h}__roll-chip`, `${h}__roll-chip--${t.intent}`), o.textContent = t.label.toUpperCase();
  const s = document.createElement("strong");
  s.classList.add(`${h}__roll-total`), s.textContent = String(t.total);
  const u = document.createElement("span");
  u.classList.add(`${h}__roll-formula`), u.textContent = t.formula, n.append(o, s, u), a.append(n), No(a, t), Oo(a, t, r), e.append(a);
}
function No(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(as);
  if (r.length === 0) return;
  const a = document.createElement("div");
  a.classList.add(`${h}__roll-meta`);
  for (const n of r) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = n, a.append(o);
  }
  e.append(a);
}
function Oo(e, t, r) {
  const a = Fo(t);
  if (a.length === 0) return;
  const n = `${r}-roll-details`, o = document.createElement("button");
  o.type = "button", o.classList.add(`${h}__roll-detail-toggle`), o.setAttribute(Pe, n), o.setAttribute("aria-expanded", "false"), o.textContent = "▸ Ver detalhes";
  const s = document.createElement("dl");
  s.classList.add(`${h}__roll-detail-list`), s.setAttribute(xt, n), s.hidden = !0;
  for (const u of a) {
    const d = document.createElement("dt");
    d.textContent = u.label;
    const p = document.createElement("dd");
    p.textContent = u.value, s.append(d, p);
  }
  e.append(o, s);
}
function Fo(e) {
  const t = [
    { label: "Fórmula", value: e.formula }
  ];
  e.diceBreakdown && t.push({ label: "Dados", value: e.diceBreakdown }), e.damageType && t.push({ label: "Tipo", value: e.damageType }), e.form && t.push({ label: "Forma", value: e.form }), e.cost && t.push({ label: "Custo", value: e.cost });
  for (const r of e.notes)
    t.push({ label: "Observação", value: r });
  for (const r of e.details)
    t.push({ label: "Detalhe", value: r });
  return t;
}
function Lo(e) {
  const t = e.querySelector(`.${Ze}`);
  if (t)
    return t;
  const r = document.createElement("div");
  return r.classList.add(Ze), e.append(r), r;
}
function Mo(e, t) {
  if (t.length === 0) return;
  const r = Uo(e);
  for (const a of t) {
    const n = ns(a);
    if (r.querySelector(`[${Ye}="${Y(n)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = a, o.setAttribute(Ye, n), r.append(o);
  }
}
function Uo(e) {
  const t = e.querySelector(`.${Je}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(Je), e.append(r), r;
}
function Vo(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(Ht, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(zt), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(G, e.pendingId), t.setAttribute(me, e.executedLabel ?? "✓ Automação aplicada"), t);
}
function jo(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = qo(e);
  return `${t} → ${r}`;
}
function qo(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Bo(e) {
  return e.querySelector(".message-content") ?? e;
}
function Wt(e, t) {
  const r = Ce(e);
  if (!r) return;
  const a = r.querySelectorAll(wo);
  for (const n of a)
    n.dataset.paranormalToolkitBound !== "true" && (n.dataset.paranormalToolkitBound = "true", n.addEventListener("click", () => {
      xo(n, t);
    }));
}
function pe(e) {
  const t = Ce(e);
  if (!t) return;
  const r = t.querySelectorAll(ko);
  for (const a of r)
    a.dataset.paranormalToolkitRollDetailsBound !== "true" && (a.dataset.paranormalToolkitRollDetailsBound = "true", a.addEventListener("click", () => {
      Ho(t, a);
    }));
}
function Ho(e, t) {
  const r = t.getAttribute(Pe);
  if (!r) return;
  const a = e.querySelector(`[${xt}="${Y(r)}"]`);
  if (!a) return;
  const n = a.hidden;
  a.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.textContent = n ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function xo(e, t) {
  const r = e.getAttribute(G);
  if (!r) return;
  e.disabled = !0;
  const a = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    e.textContent = e.getAttribute(me) ?? "✓ Automação aplicada", e.classList.add(zt), e.removeAttribute(G), e.removeAttribute(me);
    return;
  }
  e.disabled = !1, e.textContent = a;
}
function zo(e, t) {
  const r = e.map(Gt).find(ts);
  if (!r) return null;
  const a = D(e, "Forma"), n = D(e, "Custo"), o = D(e, "Dados") ?? D(e, `Dados (${r.label})`), s = D(e, "Tipo"), u = Kt(e, "Observação"), d = e.filter((p) => Go(p, r));
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: a,
    cost: n,
    diceBreakdown: o,
    damageType: s,
    notes: u,
    details: d
  };
}
function Gt(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, a, n] = t, o = Number(n);
  return Number.isFinite(o) ? {
    label: r,
    formula: a,
    total: o,
    intent: Wo(r)
  } : null;
}
function Wo(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : "generic";
}
function D(e, t) {
  return Kt(e, t)[0] ?? null;
}
function Kt(e, t) {
  const r = `${t}:`;
  return e.flatMap((a) => {
    if (!a.startsWith(r)) return [];
    const n = a.slice(r.length).trim();
    return n.length > 0 ? [n] : [];
  });
}
function Go(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Observação:") || Gt(e) ? !1 : e.trim().length > 0;
}
function Ko(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const a of E.values())
    ge(a, e, t) && r.set(a.pendingId, a);
  for (const a of es(e))
    ge(a, e, t) && !r.has(a.pendingId) && r.set(a.pendingId, a);
  return Array.from(r.values()).sort((a, n) => a.createdAt - n.createdAt);
}
function ge(e, t, r) {
  const a = Ie(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === a : !e.itemId || !ot(r, "itemId", e.itemId) ? !1 : !e.actorId || ot(r, "actorId", e.actorId);
}
function ot(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const a = `data-${os(t)}`;
  for (const n of e.querySelectorAll(`[${a}]`))
    if (n.getAttribute(a) === r)
      return !0;
  return !1;
}
function Yo(e) {
  const t = Y(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Qo(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (ge(e, null, t))
      return t;
  return null;
}
function Xo() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, a] of E.entries())
    e - a.createdAt > t && E.delete(r);
}
async function Zo(e) {
  const t = Xt(e.context.message);
  if (t)
    try {
      const r = $e(t);
      r[e.pendingId] = Qt(e), await Yt(t, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r);
    }
}
async function Jo(e) {
  const t = Xt(e.context.message);
  if (t)
    try {
      const r = $e(t), a = r[e.pendingId] ?? Qt(e);
      r[e.pendingId] = {
        ...a,
        executed: !0
      }, await Yt(t, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function es(e) {
  return Object.values($e(he(e))).filter(Zt);
}
function $e(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, Bt);
  if (!Jt(t))
    return {};
  const r = {};
  for (const [a, n] of Object.entries(t))
    Zt(n) && (r[a] = n);
  return r;
}
async function Yt(e, t) {
  typeof e.setFlag == "function" && await Promise.resolve(e.setFlag(c, Bt, t));
}
function Qt(e) {
  return {
    schemaVersion: 1,
    pendingId: e.pendingId,
    mode: e.mode,
    title: e.title,
    buttonLabel: e.buttonLabel,
    executedLabel: e.executedLabel,
    summaryLines: e.summaryLines ? [...e.summaryLines] : void 0,
    createdAt: e.createdAt,
    messageId: e.messageId,
    itemId: e.itemId,
    actorId: e.actorId,
    itemName: e.itemName,
    summary: e.summary,
    executed: e.executed
  };
}
function Xt(e) {
  const t = he(e);
  if (t?.setFlag)
    return t;
  const r = Ie(e);
  if (!r) return null;
  const a = game.messages;
  return he(a?.get?.(r));
}
function he(e) {
  return e && typeof e == "object" ? e : null;
}
function Zt(e) {
  return Jt(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && x(e.messageId) && x(e.itemId) && x(e.actorId) && x(e.itemName) && re(e.title) && re(e.buttonLabel) && re(e.executedLabel) && rs(e.summaryLines) : !1;
}
function ts(e) {
  return e !== null;
}
function Jt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function x(e) {
  return e === null || typeof e == "string";
}
function re(e) {
  return e === void 0 || typeof e == "string";
}
function rs(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function as(e) {
  return typeof e == "string" && e.length > 0;
}
function Ce(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ie(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function ns(e) {
  return e.trim().toLowerCase();
}
function os(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Y(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const st = 1e3;
class ss {
  constructor(t, r, a, n) {
    this.workflow = t, this.debugOutput = n, this.ritualAssistant = new Xn(t, r, a);
  }
  workflow;
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
      settings: Oe(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = Oe();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const a = Ae(t.item);
    if (!a.ok) {
      const n = a.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, n, a.error.reason), a.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: a.error.message,
        data: a.error
      });
      return;
    }
    if (await Cn(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: it(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(t), r.executionMode) {
      case "ask":
        await this.handleAskMode(t, a.value);
        return;
      case "automatic":
        await this.executeAutomation(t, a.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const r = this.pendingExecutions.get(t);
    if (!r)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    if (r.kind === "workflow")
      return this.pendingExecutions.delete(t), await at(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const a = await this.ritualAssistant.applyAction(r.action);
    return a.ok ? (r.workflowContext.resourceTransactions.push(a.value), this.pendingExecutions.delete(t), await at(t), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || ($o((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleAssistedRitual(t, r) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const a = await this.ritualAssistant.run(t, r);
    switch (a.status) {
      case "cancelled":
        this.setAttempt(t, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(t, "failed", a.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: a.message,
          data: a.cause ?? a
        }), ui.notifications?.warn(`Paranormal Toolkit: ${a.message}`);
        return;
      case "completed-without-actions":
        this.setAttempt(t, "completed", "ritual-assisted-no-actions"), i.info("Ritual assistido concluído sem ações pendentes.", S(a.workflowContext));
        return;
      case "ready":
        await this.registerAssistedResourceActions(t, a.workflowContext, a.actions, a.summaryLines);
        return;
    }
  }
  async registerAssistedResourceActions(t, r, a, n) {
    let o;
    for (const s of a) {
      const u = ct();
      o ??= u, this.pendingExecutions.set(u, {
        kind: "resource-action",
        id: u,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await rt({
        pendingId: u,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        summaryLines: n
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", o), i.info("Ritual assistido preparado com ações pendentes.", S(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const a = ct();
    this.pendingExecutions.set(a, {
      kind: "workflow",
      id: a,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await rt({
      pendingId: a,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", a);
  }
  async executeAutomation(t, r, a) {
    this.setAttempt(t, "running");
    const n = await this.workflow.runAutomation(r, {
      sourceActor: t.actor,
      sourceToken: t.token,
      item: t.item,
      targets: t.targets,
      flags: {
        itemUse: {
          source: t.source,
          executionMode: a
        }
      }
    });
    if (!n.ok) {
      this.setAttempt(t, "failed", n.error.reason), this.handleAutomationFailure(n.error);
      return;
    }
    this.setAttempt(t, "completed"), i.info("Automação executada por uso normal de item.", S(n.value.context));
  }
  handleAutomationFailure(t) {
    const r = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      i.warn(r, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      i.error(r, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    i.warn(r, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    i.warn(`Ação assistida falhou: ${t.error.message}`, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const r = Date.now(), a = ut(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      r - s > st && this.recentExecutionKeys.delete(o);
    const n = this.recentExecutionKeys.get(a);
    return n !== void 0 && r - n <= st;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(ut(t), Date.now());
  }
  setAttempt(t, r, a, n) {
    this.lastAttempt = it(t, r, a, n);
  }
}
function it(e, t, r, a) {
  return {
    source: e.source,
    status: t,
    reason: r,
    pendingId: a,
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
function ut(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function ct() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class is {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), a = be(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: r,
      data: a,
      flags: {
        [c]: {
          resourceTransaction: a
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, r) {
    const a = this.createWorkflowSummaryContent(t, r), n = S(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: a,
      data: n,
      flags: {
        [c]: {
          workflowSummary: n
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const r = g(t.actorName), a = g(t.resource), n = g(lt(t)), o = g(cs(t));
    return `
      <section class="${c}-card ${c}-resource-card">
        <header class="${c}-card__header">
          <strong>${n}</strong>
          <span>${r}</span>
        </header>
        <div class="${c}-card__body">
          <p><strong>${o}:</strong> ${t.appliedAmount}</p>
          <p><strong>${a}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, r) {
    const a = g(r.title ?? "Automação"), n = r.message ? `<p>${g(r.message)}</p>` : "", o = g(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = g(t.item.name ?? "Item sem nome"), u = t.targets.length > 0 ? t.targets.map((m) => g(m.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (m) => `<li><strong>${g(m.id)}:</strong> ${g(m.formula)} = ${m.total} <em>(${g(us(m.intent))})</em>${m.damageType ? ` — ${g(m.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (m) => `<li><strong>${g(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${g(m.resource)} (${g(ls(m.source))})</li>`
    ), y = t.damageInstances.map(
      (m) => `<li><strong>${g(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${g(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), R = t.healingInstances.map(
      (m) => `<li><strong>${g(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (m) => `<li><strong>${g(m.actorName)}:</strong> ${g(lt(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), F = t.phases.map((m) => g(m)).join(" &rarr; ");
    return `
      <section class="${c}-card ${c}-workflow-card">
        <header class="${c}-card__header">
          <strong>${a}</strong>
          <span>${s}</span>
        </header>
        <div class="${c}-card__body">
          ${n}
          <p><strong>Origem:</strong> ${o}</p>
          <p><strong>Alvo:</strong> ${u}</p>
          ${p.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${p.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Cura:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${F.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${F}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function us(e) {
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
function lt(e) {
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
function cs(e) {
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
function ls(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function g(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function ms() {
  const e = new Ra(), t = new gn(e), r = new ka(), a = new $a(r), n = new Va(e), o = new qa(), s = o.registerMany(Dr());
  if (!s.ok)
    throw new Error(s.error.message);
  const u = new ja(), d = new Ma(), p = new bn(), y = new is(p), R = new Rn(), T = new fn(t, a, y, R), F = new An(T, R), m = new ss(F, t, a, p);
  return m.addStrategy(new Fa((er) => m.handleItemUsed(er))), {
    ordem: n,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: a,
    resources: t,
    automationRegistry: o,
    automationBinder: u,
    itemPatches: d,
    debugOutput: p,
    chatMessages: y,
    workflowHooks: R,
    automation: T,
    workflow: F,
    itemUseIntegration: m
  };
}
let U = null;
Hooks.once("init", () => {
  Sr(), Yr(), ya(), i.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Le.isSupportedSystem()) {
    i.warn(
      `Sistema não suportado: ${Le.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  U = ms(), U.itemUseIntegration.registerStrategies(), aa(U), pa(), la(), i.info("Inicializado para o sistema Ordem Paranormal."), i.info(`API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${tr} inicializado.`);
});
function ds() {
  if (!U)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return U;
}
export {
  ds as getToolkitServices
};
//# sourceMappingURL=main.js.map
