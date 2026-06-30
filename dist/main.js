const c = "paranormal-toolkit", mt = "Paranormal Toolkit", so = "ordemparanormal";
class de {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function _e(e) {
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
class l {
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
function h(e) {
  return { ok: !0, value: e };
}
function f(e) {
  return { ok: !1, error: e };
}
function ft(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? f({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : pt(t) ? h(t.definition) : f({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function io(e) {
  return pt(e.getFlag(c, "automation"));
}
function pt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && lo(t.source) && co(t.definition);
}
function co(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && I(t.label) && Array.isArray(t.steps) && t.steps.every(uo);
}
function lo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? I(t.presetId) && I(t.presetVersion) && I(t.appliedAt) : t.type === "manual" ? I(t.label) && I(t.appliedAt) : !1;
}
function uo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return mo(t);
    case "spendRitualCost":
      return fo(t);
    case "rollFormula":
      return po(t);
    case "modifyResource":
      return go(t);
    case "chatCard":
      return ho(t);
    default:
      return !1;
  }
}
function mo(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && vr(t);
}
function fo(e) {
  return e.type === "spendRitualCost";
}
function po(e) {
  const t = e;
  return t.type === "rollFormula" && I(t.id) && I(t.formula) && (t.intent === void 0 || bo(t.intent)) && (t.damageType === void 0 || I(t.damageType));
}
function go(e) {
  const t = e;
  return t.type === "modifyResource" && yo(t.actor) && Ao(t.resource) && Ro(t.operation) && vr(t);
}
function ho(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function vr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || I(e.amountFrom);
}
function yo(e) {
  return e === "self" || e === "target";
}
function Ao(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ro(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function bo(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function I(e) {
  return typeof e == "string" && e.length > 0;
}
function gt(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(vt);
    if (wo(t))
      return Array.from(t).filter(vt);
  }
  return [];
}
function ko(e) {
  return gt(e)[0] ?? null;
}
function To(e) {
  return gt(e).find(io) ?? null;
}
function wo(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function vt(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function me(e) {
  return gt(e).filter((t) => t.type === "ritual");
}
function Or(e) {
  return me(e)[0] ?? null;
}
function $o(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(_e);
      return l.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = ae("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = pe(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(Ft);
      return l.info(`Presets encontrados para ${r.name}.`, n), n;
    },
    async applyPresetToFirstRitual(t) {
      const r = ae("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const n = pe(r);
      if (!n) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await Ye(e, n, o.value);
      l.info(`Preset ${o.value.id} aplicado em ${n.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = ae("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = pe(t);
      if (!r) return;
      const n = e.automationRegistry.findForItem(r)[0];
      if (!n) {
        l.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const o = await Ye(e, r, n.preset);
      l.info(`Melhor preset aplicado em ${r.name}.`, { match: Ft(n), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Ot(e);
    },
    async applyBestPresetsToActorRituals() {
      return Ot(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = ae("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = pe(t);
      r && (await e.automationBinder.clear(r), l.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function Ot(e) {
  const t = ae("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = me(t);
  if (r.length === 0)
    return l.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Mt(t);
  const n = Mt(t, r.length);
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
    const s = await Ye(e, o, a.preset);
    n.applied.push(Co(o, a, s));
  }
  return l.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), _o(n), n;
}
async function Ye(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function Co(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: _e(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function Mt(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function _o(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((n) => n.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function Ft(e) {
  return {
    preset: _e(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function ae(e) {
  const t = de.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function pe(e) {
  const t = Or(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function W(e) {
  return e ? {
    id: e.id,
    source: {
      ...So(e.sourceActor),
      token: e.sourceToken
    },
    item: Io(e.item),
    targets: e.targets.map(Po),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Ut(e.rollRequests, Mr),
    rolls: Ut(e.rolls, Eo),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(ht),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function ht(e) {
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
function So(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Io(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Po(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Mr(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Eo(e) {
  return {
    ...Mr(e),
    total: e.total
  };
}
function Ut(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function Lo(e) {
  return {
    getSelected() {
      return de.getSelectedActor();
    },
    logResources() {
      const t = j(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const r = e.ordem.getActorSnapshot(t);
      l.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && l.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(t) {
      await K(
        e,
        "Gasto de PE",
        j("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await K(
        e,
        "Gasto de PD",
        j("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await K(
        e,
        "Dano em PV",
        j("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await K(
        e,
        "Cura de PV",
        j("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await K(
        e,
        "Dano em SAN",
        j("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await K(
        e,
        "Recuperação de SAN",
        j("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function K(e, t, r, n) {
  if (!r) return;
  const o = await n(r);
  if (!o.ok) {
    Do(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    l.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  l.info(`${t} realizado:`, ht(a));
}
function j(e) {
  const t = de.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Do(e) {
  if (e.reason === "update-failed") {
    l.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    l.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  l.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const D = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function No() {
  ge(D.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), ge(D.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), ge(D.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), ge(D.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Qe() {
  return {
    enabled: he(D.enabled),
    console: he(D.console),
    ui: he(D.ui),
    chat: he(D.chat)
  };
}
async function U(e, t) {
  await game.settings.set(c, D[e], t);
}
function ge(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function he(e) {
  return game.settings.get(c, e) === !0;
}
function vo() {
  return {
    status() {
      return Qe();
    },
    async enable() {
      await U("enabled", !0);
    },
    async disable() {
      await U("enabled", !1);
    },
    async enableConsole() {
      await U("console", !0);
    },
    async disableConsole() {
      await U("console", !1);
    },
    async enableUi() {
      await U("ui", !0);
    },
    async disableUi() {
      await U("ui", !1);
    },
    async enableChat() {
      await U("chat", !0);
    },
    async disableChat() {
      await U("chat", !1);
    }
  };
}
const Fr = "ritual.costOnly", Ur = "ritual.simpleHealing", Oo = "ritual.eletrocussao", xr = "ritual.simpleDamage", Br = "generic.simpleHealing", jr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Mo() {
  return [
    Fo(),
    Uo(),
    xo(),
    Bo(),
    jo()
  ];
}
function Fo() {
  return {
    id: Fr,
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
function Uo() {
  return {
    id: Ur,
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
    automation: Hr(),
    itemPatch: qo()
  };
}
function xo() {
  return {
    id: Oo,
    version: "1.1.0",
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
    automation: Ho(),
    itemPatch: Vo()
  };
}
function Bo() {
  return {
    id: xr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: yt()
  };
}
function jo() {
  return {
    id: Br,
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
function Hr(e = "2d8+2") {
  return qr(
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
function Ho() {
  return {
    ...yt("1d8", {
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
function yt(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return qr(
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
function qo() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: jr,
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
function Vo() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: jr,
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
function qr(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((n) => n.type !== "rollFormula" || n.id !== t ? n : {
      ...n,
      formula: r
    })
  };
}
function At() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Q(t.id),
    actorId: Q(t.actor?.id),
    sceneId: Q(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Vr() {
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
function Go(e) {
  return {
    logFirstRitualCost() {
      const t = H("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const r = q(t);
      if (!r) return;
      const n = e.ritualCosts.getCost({ actor: t, ritual: r });
      if (!n.ok) {
        l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      l.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: r.name,
        cost: n.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${r.name} custa ${n.value.amount} ${n.value.resource} (${n.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, r = "PE") {
      const n = H("Nenhum ator encontrado para configurar custo customizado.");
      if (!n) return;
      const o = q(n);
      if (o) {
        if (!Ko(t, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(c, "ritual.cost", {
          resource: r,
          amount: t
        }), l.info(`Custo customizado aplicado em ${o.name}.`, { resource: r, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = H("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = q(t);
      r && (await r.unsetFlag(c, "ritual.cost"), l.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = H("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = q(t);
      if (!r) return;
      const n = e.automationRegistry.require(Fr);
      if (!n.ok) {
        l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value), l.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = H("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const n = q(r);
      if (!n) return;
      if (!xt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Ur);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: Hr(t)
      }), l.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = H("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = q(r);
      if (!n) return;
      if (!xt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(xr);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: yt(t)
      }), l.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = H("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = q(t);
      r && await zo(e, t, r);
    }
  };
}
async function zo(e, t, r) {
  const n = ft(r);
  if (!n.ok) {
    l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: Vr(),
    item: r,
    targets: At()
  });
  if (!o.ok) {
    Wo(o.error);
    return;
  }
  l.info("Automação de ritual executada com sucesso.", W(o.value.context));
}
function Wo(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    l.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    l.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  l.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function H(e) {
  const t = de.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function q(e) {
  const t = Or(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ko(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function xt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Yo = ["disabled", "ask", "automatic"], Qo = ["buttons", "confirm"], Gr = "ask";
function Xo(e) {
  return typeof e == "string" && Yo.includes(e);
}
function Zo(e) {
  return typeof e == "string" && Qo.includes(e);
}
function Jo(e) {
  return Xo(e) ? e : Zo(e) ? "ask" : Gr;
}
const ea = ["keep", "replace"], zr = "keep", ta = !0, N = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function ra() {
  game.settings.register(c, N.executionMode, {
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
    default: Gr
  }), game.settings.register(c, N.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: zr
  }), game.settings.register(c, N.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: ta
  }), game.settings.register(c, N.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Bt() {
  const e = Jo(game.settings.get(c, N.executionMode)), t = Kr(game.settings.get(c, N.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: Wr()
  };
}
function na() {
  return Kr(game.settings.get(c, N.systemCardMode));
}
function Wr() {
  return game.settings.get(c, N.ritualCastingCheckEnabled) === !0;
}
async function V(e) {
  await game.settings.set(c, N.executionMode, e);
}
function Kr(e) {
  return ea.includes(e) ? e : zr;
}
function oa(e) {
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
const aa = [
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
function sa(e) {
  return {
    phases() {
      return aa;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Oe("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = To(t);
      if (!r) {
        l.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await jt(e, t, r);
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
      if (!la(r)) {
        l.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = ca(r) ?? Oe("Nenhum ator encontrado para executar automação do item.");
      n && await jt(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Oe("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = ko(t);
      if (!r) {
        l.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(Br);
        if (!n.ok) {
          l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(r, n.value), l.info(`Preset de teste aplicado ao item: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${r.name}.`);
      } catch (n) {
        l.error("Falha ao configurar automação de teste no item.", n), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function jt(e, t, r) {
  const n = ft(r);
  if (!n.ok) {
    l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: Vr(),
    item: r,
    targets: At()
  });
  if (!o.ok) {
    ia(o.error);
    return;
  }
  l.info("Automação executada com sucesso.", W(o.value.context));
}
function ia(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    l.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    l.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  l.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Oe(e) {
  const t = de.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ca(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function la(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ua(e) {
  const t = Lo(e), r = $o(e), n = Go(e), o = sa(e), a = vo(), s = oa(e);
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
function da(e) {
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
    debug: ua(e)
  }, r = globalThis;
  return r[c] = t, r.ParanormalToolkit = t, t;
}
class Ht {
  static isSupportedSystem() {
    return game.system.id === so;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function ma() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: X(t.id),
    actorId: X(t.actor?.id),
    sceneId: X(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Yr() {
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
function fa(e, t = Yr()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function pa(e) {
  if (!ya(e)) return null;
  const t = e.getFlag(c, "workflow");
  return ha(t) ? t : null;
}
function ga() {
  return `flags.${c}.workflow`;
}
function qt(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), r = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || r !== void 0;
}
function Vt(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Xe(t) || Xe(r);
}
function ha(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function ya(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function X(e) {
  return Xe(e) ? e : null;
}
function Xe(e) {
  return typeof e == "string" && e.length > 0;
}
function Aa() {
  const e = (t, r) => {
    Ra(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Ra(e, t) {
  const r = pa(e);
  if (!r || r.targets.length === 0) return;
  const n = ka(t);
  if (!n || n.querySelector(`.${c}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(ba(r));
}
function ba(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(Gt("Origem", e.source.name)), t.append(Gt("Alvo", e.targets.map((n) => n.name).join(", "))), t;
}
function Gt(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${c}-chat-enrichment__row`);
  const n = document.createElement("span");
  n.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, r.append(n, o), r;
}
function ka(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ta() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!wa(n) || !$a(e) || qt(e) || qt(t)) return;
    const o = ma();
    if (o.length === 0 || !Vt(e) && !Vt(t)) return;
    const a = Yr();
    e.updateSource({
      [ga()]: fa(o, a)
    }), l.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function wa(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function $a(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const Qr = {
  enabled: "dice.animations.enabled"
};
function Ca() {
  game.settings.register(c, Qr.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function _a() {
  return {
    enabled: game.settings.get(c, Qr.enabled) === !0
  };
}
const Sa = "chatCard", zt = "data-paranormal-toolkit-prompt-id", u = `${c}-item-use-prompt`, Ia = `.${u}__title`, Xr = `.${u}__header`, Pa = `.${u}__roll-card`, Ea = `.${u}__roll-meta`, La = `.${u}__roll-meta-pill`, Da = `.${u}__resistance`, Na = `.${u}__resistance-header`, Zr = `.${u}__resistance-description`, va = `.${u}__resistance-roll-button`, Oa = `.${u}__resistance-roll-result`, Wt = `${u}__resistance-content`, Jr = `.${u}__workflow-section`, en = `.${u}__workflow-roll`, tn = `${u}__workflow-roll--dice-open`, rn = `.${u}__workflow-roll-formula`, nn = `${u}__workflow-roll-formula--toggle`, Rt = `.${u}__workflow-dice-tray`, Ma = `.${u}__roll-detail-toggle`, Fa = `.${u}__roll-detail-list`, Ua = `.${u}__ritual-element-badge`, xa = `.${u}__ritual-metadata`;
function Ba(e) {
  for (const t of Array.from(e.querySelectorAll(Jr)))
    for (const r of Array.from(t.querySelectorAll(`${Ma}, ${Fa}`)))
      r.remove();
}
function ja(e) {
  for (const t of Array.from(e.querySelectorAll(Da)))
    Ha(t);
}
function Ha(e) {
  const t = e.querySelector(Na), r = e.querySelector(Zr), n = e.querySelector(va), o = e.querySelector(Oa);
  if (!n || !t && !r && !o) return;
  const a = qa(e, n);
  t && t.parentElement !== a && a.append(t), r && r.parentElement !== a && a.append(r), o && o.parentElement !== a && !n.contains(o) && a.append(o), n.parentElement !== e && e.append(n);
}
function qa(e, t) {
  const r = e.querySelector(`.${Wt}`);
  if (r) return r;
  const n = document.createElement("div");
  return n.classList.add(Wt), e.insertBefore(n, t.parentElement === e ? t : e.firstChild), n;
}
function Kt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function bt() {
  const e = globalThis.game;
  return Se(e) ? e : null;
}
function P(e, t) {
  const r = Va(e, t);
  return Re(r);
}
function Va(e, t) {
  return t.split(".").reduce((r, n) => Se(r) ? r[n] : null, e);
}
function Ga(e, t) {
  const r = e.indexOf(":");
  return r < 0 || le(e.slice(0, r)) !== le(t) ? null : te(e.slice(r + 1));
}
function Re(e) {
  return typeof e == "string" ? te(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Se(e) {
  return !!e && typeof e == "object";
}
function za(e) {
  return typeof e == "string";
}
function Ie(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function te(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function le(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Ze(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function x(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function on(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Wa(e) {
  for (const t of Array.from(e.querySelectorAll(Pa))) {
    const r = es(t);
    Ka(t), r && (Ya(t, r), Qa(t, r));
  }
}
function Ka(e) {
  for (const t of Array.from(e.querySelectorAll(Ea)))
    t.remove();
}
function Ya(e, t) {
  const n = e.closest(`.${u}`)?.querySelector(Xr) ?? null, o = n?.querySelector(Ia) ?? null, a = n ?? e, s = a.querySelector(Ua);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const i = s ?? document.createElement("span");
  if (i.className = ys(t.elementTone), i.textContent = hs(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", i);
      return;
    }
    a.prepend(i);
  }
}
function Qa(e, t) {
  const r = Xa(e);
  Za(e, r);
  const n = Ja(t);
  if (n.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${u}__ritual-metadata`);
  for (const s of n) {
    const i = document.createElement("span");
    i.classList.add(`${u}__ritual-metadata-chip`), i.textContent = s, o.append(i);
  }
  if (r) {
    const s = r.querySelector(`.${u}__summary`);
    if (s?.parentElement === r) {
      s.insertAdjacentElement("afterend", o);
      return;
    }
    r.append(o);
    return;
  }
  const a = e.querySelector(Jr);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function Xa(e) {
  return e.closest(`.${u}`)?.querySelector(Xr) ?? null;
}
function Za(e, t) {
  const r = [e, t].filter((n) => n !== null);
  for (const n of r)
    for (const o of Array.from(n.querySelectorAll(xa)))
      o.remove();
}
function Ja(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Ze(e.target)}` : null,
    e.duration ? `Duração: ${Ze(e.duration)}` : null,
    e.resistance ? `Resistência: ${on(e.resistance)}` : null
  ].filter(Ie);
}
function es(e) {
  const t = ts(e), r = is(e), o = (t ? ss(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = kt(P(o, "element")), i = O("op.elementChoices", s) ?? Yt(z(a, "Elemento")) ?? Yt(r.damageType), d = s ?? As(i), g = P(o, "circle") ?? z(a, "Círculo"), A = us(o) ?? z(a, "Alvo"), R = ps(o, "duration", "op.durationChoices") ?? z(a, "Duração"), k = cs(e) ?? ms(o) ?? z(a, "Resistência"), b = ls(a) ?? r.cost, m = {
    elementLabel: i,
    elementTone: d,
    circle: g,
    cost: b,
    target: A,
    duration: R,
    resistance: k
  };
  return gs(m) ? m : null;
}
function ts(e) {
  const t = rs(e);
  if (!t) return null;
  const r = t.getFlag?.(c, Sa), n = os(r);
  if (n.length === 0) return null;
  const o = ns(e);
  if (o.size > 0) {
    const a = n.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return n.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function rs(e) {
  const r = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return r ? bt()?.messages?.get?.(r) ?? null : null;
}
function ns(e) {
  const t = e.closest(`.${u}`) ?? e, r = /* @__PURE__ */ new Set();
  for (const n of Array.from(t.querySelectorAll(`[${zt}]`))) {
    const o = n.getAttribute(zt)?.trim();
    o && r.add(o);
  }
  return r;
}
function os(e) {
  if (!Se(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(as).filter((r) => r !== null) : [];
}
function as(e) {
  return Se(e) ? {
    pendingId: Re(e.pendingId),
    actorId: Re(e.actorId),
    itemId: Re(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(za) : []
  } : null;
}
function ss(e) {
  if (!e.itemId) return null;
  const t = bt(), n = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return n || (t?.items?.get?.(e.itemId) ?? null);
}
function is(e) {
  let t = null, r = null;
  for (const n of Array.from(e.querySelectorAll(La))) {
    const o = te(n.textContent);
    if (!o) continue;
    const a = Ga(o, "Tipo");
    a && (r = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: r };
}
function cs(e) {
  const t = te(e.querySelector(Zr)?.textContent);
  return t ? on(t) : null;
}
function z(e, t) {
  const r = le(t);
  for (const n of e) {
    const o = n.indexOf(":");
    if (!(o < 0 || le(n.slice(0, o)) !== r))
      return te(n.slice(o + 1));
  }
  return null;
}
function ls(e) {
  const t = z(e, "Custo") ?? z(e, "PE");
  return t || (e.map(te).find((r) => typeof r == "string" && /\b(P[ED]|PE|PD)\b/iu.test(r)) ?? null);
}
function us(e) {
  const t = P(e, "target");
  if (!t) return null;
  if (t === "area")
    return ds(e) ?? O("op.targetChoices", t) ?? "Área";
  const r = O("op.targetChoices", t) ?? x(t);
  return [t === "people" || t === "creatures" ? P(e, "targetQtd") : null, r].filter(Ie).join(" ");
}
function ds(e) {
  const t = P(e, "area.name"), r = P(e, "area.size"), n = P(e, "area.type"), o = t ? O("op.areaChoices", t) ?? x(t) : null, a = n ? O("op.areaTypeChoices", n) ?? x(n) : null;
  return o ? r ? a ? `${o} ${r}m ${Ze(a)}` : `${o} ${r}m` : o : null;
}
function ms(e) {
  const t = P(e, "skillResis"), r = P(e, "resistance");
  if (!t || !r) return null;
  const n = O("op.skill", t) ?? x(t), o = fs(r);
  return [n, o].filter(Ie).join(" ");
}
function fs(e) {
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
      return O("op.resistanceChoices", e) ?? x(e);
  }
}
function ps(e, t, r) {
  const n = P(e, t);
  return n ? O(r, n) ?? x(n) : null;
}
function gs(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function hs(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function ys(e) {
  return [
    `${u}__ritual-element-badge`,
    e ? `${u}__ritual-element-badge--${e}` : null
  ].filter(Ie).join(" ");
}
function kt(e) {
  const t = le(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Yt(e) {
  const t = kt(e);
  return t ? O("op.elementChoices", t) ?? x(t) : e ? x(e) : null;
}
function As(e) {
  return kt(e);
}
function O(e, t) {
  if (!t) return null;
  const r = `${e}.${t}`, n = bt()?.i18n?.localize?.(r);
  return !n || n === r ? null : n;
}
const Qt = "data-paranormal-toolkit-dice-toggle-enhanced";
function Rs(e) {
  for (const t of Array.from(e.querySelectorAll(en)))
    an(t);
}
function bs(e) {
  const t = cn(e.target);
  if (!t) return;
  const r = Tt(t);
  r && (e.preventDefault(), sn(r, t));
}
function ks(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = cn(e.target);
  if (!t) return;
  const r = Tt(t);
  r && (e.preventDefault(), sn(r, t));
}
function an(e) {
  const t = e.querySelector(Rt);
  if (!t) return;
  const r = e.querySelector(rn);
  if (r && r.getAttribute(Qt) !== "true" && (r.setAttribute(Qt, "true"), r.classList.add(nn), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", "false"), r.title = "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title), t.hidden = !0, !r.querySelector("i"))) {
    const n = document.createElement("i");
    n.classList.add("fa-solid", "fa-chevron-down"), n.setAttribute("aria-hidden", "true"), r.append(n);
  }
}
function sn(e, t) {
  const r = e.querySelector(Rt);
  if (!r) return;
  const n = !e.classList.contains(tn);
  Ts(e, t, r, n);
}
function Ts(e, t, r, n) {
  e.classList.toggle(tn, n), r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.title = n ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !n), o.classList.toggle("fa-chevron-up", n));
}
function cn(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(rn);
  if (!t) return null;
  const r = Tt(t);
  return r ? (an(r), t.classList.contains(nn) ? t : null) : null;
}
function Tt(e) {
  const t = e.closest(en);
  return t && t.querySelector(Rt) ? t : null;
}
const Xt = `${c}-workflow-dice-toggle-styles`;
function ws() {
  if (document.getElementById(Xt)) return;
  const e = document.createElement("style");
  e.id = Xt, e.textContent = `
.${u}__workflow-section .${u}__roll-detail-toggle,
.${u}__workflow-section .${u}__roll-detail-list {
  display: none !important;
}

.${u}__workflow-roll:not(.${u}__workflow-roll--dice-open) .${u}__workflow-dice-tray,
.${u}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${u}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${u}__workflow-roll-formula--toggle:hover,
.${u}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${u}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${u}__header .${u}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${u}__ritual-element-badge {
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

.${u}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${u}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${u}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${u}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${u}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${u}__header .${u}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${u}__roll-card > .${u}__ritual-metadata {
  display: none !important;
}

.${u}__ritual-metadata-chip {
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

.${u}__resistance {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 34px;
  grid-template-areas: "content button";
  align-items: center !important;
  column-gap: 0.62rem;
  row-gap: 0;
  padding: 0.56rem 0.58rem !important;
}

.${u}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${u}__resistance-content .${u}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${u}__resistance-content .${u}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${u}__resistance-content .${u}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${u}__resistance > .${u}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: center;
}

.${u}__resistance-content .${u}__resistance-roll-result {
  margin-top: 0;
}
`, document.head.append(e);
}
const $s = [0, 100, 500, 1500, 3e3];
let Zt = !1, Me = null;
function Cs() {
  if (!Zt) {
    Zt = !0, ws(), Hooks.on("renderChatMessageHTML", (e, t) => {
      se(Kt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      se(Kt(t));
    }), Hooks.once("ready", () => {
      se(document), _s();
    }), document.addEventListener("click", bs), document.addEventListener("keydown", ks);
    for (const e of $s)
      globalThis.setTimeout(() => se(document), e);
  }
}
function _s() {
  Me || !document.body || (Me = new MutationObserver((e) => {
    for (const t of e)
      for (const r of Array.from(t.addedNodes))
        (r instanceof HTMLElement || r instanceof DocumentFragment) && se(r);
  }), Me.observe(document.body, { childList: !0, subtree: !0 }));
}
function se(e) {
  e && (Ba(e), Wa(e), ja(e), Rs(e));
}
function Ss() {
  Cs();
}
const ie = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, ln = {
  PV: "system.attributes.hp"
}, Je = {
  PV: [ie.PV, ln.PV],
  SAN: [ie.SAN],
  PE: [ie.PE],
  PD: [ie.PD]
}, et = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Is {
  getResource(t, r) {
    const n = Jt(t, r);
    if (!n.ok)
      return f(n.error);
    const o = n.value, a = `${o}.value`, s = `${o}.max`, i = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, s), g = tr(t, r, a, i, "valor atual");
    if (g) return f(g);
    const A = tr(t, r, s, d, "valor máximo");
    return A ? f(A) : h({
      value: i,
      max: d
    });
  }
  async updateResourceValue(t, r, n) {
    const o = Jt(t, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: n });
  }
}
function Jt(e, t) {
  const r = Ps(e.type, t);
  if (r && er(e, r))
    return h(r);
  const n = Je[t].find(
    (o) => er(e, o)
  );
  return n ? h(n) : f({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Es(e, t),
    path: Je[t].join(" | ")
  });
}
function Ps(e, t) {
  return e === "threat" ? ln[t] ?? null : e === "agent" ? ie[t] : null;
}
function er(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function Es(e, t) {
  const r = e.type ?? "unknown", n = Je[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function tr(e, t, r, n, o) {
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
class Ls {
  isRitual(t) {
    return t.type === "ritual";
  }
  getCircle(t) {
    if (!this.isRitual(t))
      return f({
        reason: "not-a-ritual",
        message: `Item ${t.name ?? "sem nome"} não é um ritual.`,
        ritual: t
      });
    const r = this.readCircleFromKnownPaths(t);
    if (!r) {
      const s = et.ritualItem.circleCandidates;
      return f({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: n, value: o } = r, a = Ds(o);
    return a ? h(a) : f({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${n}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: n,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of et.ritualItem.circleCandidates) {
      const n = foundry.utils.getProperty(t, r);
      if (n != null)
        return { path: r, value: n };
    }
    return null;
  }
}
function Ds(e) {
  if (rr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (rr(r))
      return r;
  }
  return null;
}
function rr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Ns = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class vs {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const r = this.ritualAdapter.getCircle(t.ritual);
    if (!r.ok)
      return f({
        ...r.error,
        actor: t.actor
      });
    const n = r.value, o = Os(t.ritual, n);
    return o.ok ? o.value ? h(o.value) : h({
      resource: "PE",
      amount: Ns[n],
      source: "default-by-circle",
      circle: n
    }) : f(o.error);
  }
}
function Os(e, t) {
  const r = e.getFlag(c, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Ms(r) ? {
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
function Ms(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Fe = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Fs(e) {
  if (!qs(e.item)) return null;
  const t = tt(e.actor) ? e.actor : Us(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Bs(e.token) ?? xs(t),
    targets: At(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Us(e) {
  const t = e;
  return tt(t.actor) ? t.actor : tt(e.parent) ? e.parent : null;
}
function xs(e) {
  const t = js(e) ?? Hs(e);
  return t ? un(t) : null;
}
function Bs(e) {
  return rt(e) ? un(e) : null;
}
function js(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return rt(r) ? r : (t.getActiveTokens?.() ?? []).find(rt) ?? null;
}
function Hs(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function un(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Ue(e.id),
    actorId: Ue(t?.id),
    sceneId: Ue(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function qs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function tt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function rt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Ue(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Vs {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Fe.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, l.info(`${Fe.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = Fs(Gs(t));
    if (!r) {
      l.warn(`${Fe.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function Gs(e) {
  return e && typeof e == "object" ? e : {};
}
class zs {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return xe("missing-item-patch");
    if (t.type !== "ritual") return xe("unsupported-item-type");
    const o = Ws(n);
    return Object.keys(o).length === 0 ? xe("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Ws(e) {
  const t = {};
  T(t, "name", e.name), T(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (T(t, "system.circle", r.circle), T(t, "system.element", r.element), T(t, "system.target", r.target), T(t, "system.targetQtd", r.targetQuantity), T(t, "system.execution", r.execution), T(t, "system.range", r.range), T(t, "system.duration", r.duration), T(t, "system.skillResis", r.resistanceSkill), T(t, "system.resistance", r.resistance), T(t, "system.studentForm", r.studentForm), T(t, "system.trueForm", r.trueForm)), t;
}
function T(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function xe(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Ks {
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
    return this.getNumber(t, et.ritual.dt, 0);
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
class Ys {
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
    await t.unsetFlag(c, "automation");
  }
  async writeAutomationFlag(t, r) {
    await this.clear(t), await t.setFlag(c, "automation", r);
  }
}
class Qs {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = Xs(t);
    return r.ok ? this.presets.has(t.id) ? f({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, Be(t)), h(t)) : r;
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
    return r ? Be(r) : null;
  }
  require(t) {
    const r = this.get(t);
    return r ? h(r) : f({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(Be);
  }
  findForItem(t) {
    return this.list().map((r) => Zs(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function Xs(e) {
  return !je(e.id) || !je(e.version) || !je(e.label) ? f({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? f({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : h(e);
}
function Zs(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = Js(o, t);
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
function Js(e, t) {
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
      const r = nr(t.name), n = e.names.map(nr).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = ei(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function nr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function ei(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function Be(e) {
  return structuredClone(e);
}
function je(e) {
  return typeof e == "string" && e.length > 0;
}
function be(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? f({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : h(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = Pe(e.amountFrom);
    if (!r)
      return f({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const n = t.rolls[r];
    if (!n)
      return f({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${r}.`
      });
    const o = Math.trunc(n.total);
    return !Number.isInteger(o) || o <= 0 ? f({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${r} não gerou um amount positivo.`
    }) : h(o);
  }
  return f({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Pe(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const ti = "dice-so-nice";
async function dn(e) {
  if (!_a().enabled || !ri()) return;
  const t = ni();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      l.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function ri() {
  return game.modules.get(ti)?.active === !0;
}
function ni() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function oi(e, t, r) {
  if (!or(e.id) || !or(e.formula))
    return f({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const n = new Roll(e.formula), o = await Promise.resolve(n.evaluate()), a = o.total;
    if (typeof a != "number" || !Number.isFinite(a))
      return f({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await dn(o);
    const i = {
      ...r.rollRequests[e.id] ?? mn(e, t),
      total: a,
      roll: o
    };
    return r.rolls[e.id] = i, h(i);
  } catch (n) {
    return f({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: n
    });
  }
}
function mn(e, t) {
  const r = e.intent ?? ai(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function ai(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function or(e) {
  return typeof e == "string" && e.length > 0;
}
async function ke(e, t, r, n, o) {
  switch (n) {
    case "spend":
      return r !== "PE" && r !== "PD" ? ye(t, r, n, o) : e.spend(t, r, o);
    case "damage":
      return r !== "PV" && r !== "SAN" ? ye(t, r, n, o) : e.damage(t, r, o);
    case "heal":
      return r !== "PV" ? ye(t, r, n, o) : e.heal(t, r, o);
    case "recover":
      return r !== "SAN" ? ye(t, r, n, o) : e.recover(t, r, o);
  }
}
function ye(e, t, r, n) {
  return f({
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
function si(e) {
  const { step: t, context: r, transaction: n, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = ii(t, r, n, o);
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
    const s = ci(t, r, n, o);
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
function ii(e, t, r, n) {
  const o = Pe(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: fn(t.id, "damage", n, t.damageInstances.length),
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
function ci(e, t, r, n) {
  const o = Pe(e.amountFrom);
  return {
    id: fn(t.id, "healing", n, t.healingInstances.length),
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
function fn(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function li(e, t, r) {
  const n = Pe(e.amountFrom), o = n ? t.rolls[n] : void 0;
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
function di(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", r, { stepIndex: n, step: t, metadata: o }), pn("before", e), ar("before", e), ar("resolve", e);
}
function mi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("apply", r, { stepIndex: n, step: t, metadata: o }), pn("apply", e);
}
function fi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", r, { stepIndex: n, step: t, metadata: o });
}
function pn(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t, i = pi(e, r.operation);
  i && s.emit(i, n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function ar(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function pi(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function gi(e, t, r) {
  try {
    return await e.createWorkflowSummaryMessage(r, t), h(void 0);
  } catch (n) {
    return f({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: n
    });
  }
}
async function hi(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return yi(e, t);
    case "spendRitualCost":
      return Ai(e, t);
  }
}
async function yi(e, t) {
  const { context: r, resources: n } = e, o = be(t, r);
  return o.ok ? gn(await n.spend(r.sourceActor, t.resource, o.value), r) : f(o.error);
}
async function Ai(e, t) {
  const { context: r, resources: n, ritualCosts: o } = e, a = o.getCost({
    actor: r.sourceActor,
    ritual: r.item
  });
  if (!a.ok)
    return f({
      reason: "ritual-cost-failed",
      message: a.error.message,
      cause: a.error
    });
  const s = a.value;
  return r.ritualCosts.push({
    ...s,
    itemId: r.item.id ?? null,
    itemName: r.item.name ?? "Ritual sem nome"
  }), gn(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function gn(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), h(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), f({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Ri(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: o, execute: a } = e, s = bi(t);
  for (const d of s.before)
    o.emit(d, r, { stepIndex: n, step: t });
  const i = await a();
  if (!i.ok)
    return i;
  for (const d of s.after)
    o.emit(d, r, { stepIndex: n, step: t });
  return i;
}
function bi(e) {
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
class ki {
  constructor(t, r, n, o) {
    this.resources = t, this.ritualCosts = r, this.messages = n, this.lifecycle = o;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, r) {
    if (t.steps.length === 0)
      return f({
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
        return Ri({
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
        return f({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: n,
          step: t,
          context: r
        });
    }
  }
  async runCostStep(t, r, n) {
    const o = await hi({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? h(void 0) : f({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const o = mn(t, n);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, n, t);
    const a = await this.runRollFormulaStep(t, r, n);
    if (!a.ok)
      return a;
    const s = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, n, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: o, rollResult: s }), h(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const o = await oi(t, n, r);
    return o.ok ? h(void 0) : f({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const o = be(t, r);
    if (!o.ok)
      return f({ ...o.error, stepIndex: n, step: t, context: r });
    const a = li(t, r, o.value);
    di({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), mi({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, r);
    if (s.length === 0)
      return f({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: n,
        step: t,
        context: r
      });
    for (const i of s) {
      const d = await ke(this.resources, i, t.resource, t.operation, o.value), g = this.handleResourceOperationResult(d, r, n, t);
      if (!g.ok)
        return g;
      si({
        step: t,
        context: r,
        transaction: g.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return fi({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), h(void 0);
  }
  async runModifyResourceStep(t, r, n) {
    const o = be(t, r);
    if (!o.ok)
      return f({ ...o.error, stepIndex: n, step: t, context: r });
    const a = this.resolveActors(t.actor, r);
    if (a.length === 0)
      return f({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: n,
        step: t,
        context: r
      });
    for (const s of a) {
      const i = await ke(this.resources, s, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(i, r, n, t);
      if (!d.ok)
        return d;
    }
    return h(void 0);
  }
  async runChatCardStep(t, r, n) {
    const o = await gi(this.messages, t, r);
    return o.ok ? h(void 0) : f({ ...o.error, stepIndex: n, step: t, context: r });
  }
  handleResourceOperationResult(t, r, n, o) {
    return t.ok ? (r.resourceTransactions.push(t.value), h(t.value)) : f({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: n,
      step: o,
      context: r,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, r, n, o, a, s) {
    const i = Ti(t, r.intent);
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
function Ti(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class wi {
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
      return f({
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
      return f({
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
      return f({
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
    const { afterValue: d, appliedAmount: g } = i.value, A = {
      value: d,
      max: s.max
    };
    try {
      d !== s.value && await this.adapter.updateResourceValue(t, r, d);
    } catch (R) {
      return f({
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
        cause: R
      });
    }
    return h({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: r,
      operation: n,
      requestedAmount: o,
      appliedAmount: g,
      before: s,
      after: A
    });
  }
  calculate(t, r, n) {
    switch (t) {
      case "spend":
        return r.value < n ? f({
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
function hn(e) {
  return {
    id: $i(),
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
function $i() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ci {
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
    return W(this.lastContext);
  }
  async runAutomation(t, r) {
    const n = hn(r);
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
class _i {
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
    }), Hooks.callAll(`${c}.workflow.${t}`, o), Hooks.callAll(`${c}.workflow.phase`, o), o;
  }
}
class Si {
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
    const r = Qe();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Ii(),
      flags: {
        ...t.flags,
        [c]: {
          ...Pi(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && l.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = Qe();
    if (!n.enabled)
      return;
    const o = r.notification ?? sr(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, o);
  }
  emitConsole(t, r) {
    const n = sr(r);
    switch (t) {
      case "info":
        l.info(n, r.data ?? "");
        return;
      case "warn":
        l.warn(n, r.data ?? "");
        return;
      case "error":
        l.error(n, r.data ?? "");
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
function sr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Ii() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Pi(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const Ei = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", yn = `${c}-inline-roll-neutralized`, Li = `${c}-inline-roll-notice`, wt = `data-${c}-inline-roll-neutralized`, ir = `data-${c}-inline-roll-notice`, Di = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function cr(e) {
  const t = zi(e.message), r = await Ni(e.message), n = vi(t);
  return r.replacementCount + n.replacementCount > 0 && l.info("Rolagens inline neutralizadas para item automatizado.", {
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
async function Ni(e) {
  const t = qi(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = Oi(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await Vi(t, r.content), replacementCount: r.replacementCount };
}
function vi(e) {
  const t = e ? Gi(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = An(t);
  return r > 0 && Rn(Bi(t)), { replacementCount: r };
}
function Oi(e) {
  const t = Mi(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = An(r.content), o = t.replacementCount + n;
  return o === 0 ? { content: e, replacementCount: 0 } : (Rn(r.content), { content: r.innerHTML, replacementCount: o });
}
function Mi(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, o) => (t += 1, Ui(o.trim()))), replacementCount: t };
}
function An(e) {
  const t = Fi(e);
  for (const r of t)
    r.replaceWith(xi(ji(r)));
  return t.length;
}
function Fi(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(Ei))
    r.getAttribute(wt) !== "true" && t.add(r);
  return Array.from(t);
}
function Ui(e) {
  return `<span class="${yn}" ${wt}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Wi(e)}</span>`;
}
function xi(e) {
  const t = document.createElement("span");
  return t.classList.add(yn), t.setAttribute(wt, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Rn(e) {
  if (e.querySelector?.(`[${ir}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Li), t.setAttribute(ir, "true"), t.textContent = Di, e.append(t);
}
function Bi(e) {
  return e.querySelector(".message-content") ?? e;
}
function ji(e) {
  const r = e.getAttribute("data-formula") ?? Hi(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function Hi(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function qi(e) {
  return e && typeof e == "object" ? e : null;
}
async function Vi(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return l.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function Gi(e) {
  const t = Ki(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function zi(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Wi(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Ki(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const lr = "occultism";
function Yi(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Qi(e) {
  const t = Yi(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await Xi(e, lr);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await dn(r);
  const n = ec(r);
  return {
    skill: lr,
    skillLabel: "Ocultismo",
    roll: r,
    formula: Ji(r),
    total: n,
    difficulty: t,
    success: n >= t,
    diceBreakdown: tc(r)
  };
}
async function Xi(e, t) {
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
  return Zi(n);
}
function Zi(e) {
  return ur(e) ? e : Array.isArray(e) ? e.find(ur) ?? null : null;
}
function ur(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Ji(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function ec(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function tc(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(rc);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function rc(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function nc(e) {
  return {
    header: {
      eyebrow: mt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: cc(e.ritual)
    },
    forms: e.variantOptions.map((t) => oc(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: ic(e.automationStatus ?? "assisted")
  };
}
function oc(e, t) {
  const r = ac(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? sc(t) : "—",
    details: r
  };
}
function ac(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function sc(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function ic(e) {
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
function cc(e) {
  const t = e.system, r = [uc(t?.element), lc(t?.circle)].filter(dc);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function lc(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function uc(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function dc(e) {
  return typeof e == "string" && e.length > 0;
}
const bn = ["base", "discente", "verdadeiro"];
function kn(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Te(e) {
  return typeof e == "string" && bn.includes(e);
}
const { ApplicationV2: mc } = foundry.applications.api;
class ce extends mc {
  constructor(t, r) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = r, this.model = nc(t), this.selectedVariant = this.model.forms.find((n) => n.checked && n.enabled)?.variant ?? "base";
  }
  input;
  resolveRequest;
  model;
  selectedVariant = "base";
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
      cast: ce.onCast,
      cancel: ce.onCancel
    }
  };
  static async request(t) {
    return new Promise((r) => {
      new ce(t, r).render({ force: !0 });
    });
  }
  async _renderHTML(t, r) {
    const n = document.createElement("div");
    return n.className = "paranormal-toolkit-ritual-cast", n.innerHTML = this.renderContent(), n;
  }
  _replaceHTML(t, r, n) {
    r.replaceChildren(t);
    const o = r.querySelector(".paranormal-toolkit-ritual-cast") ?? r;
    pc(o, (a) => {
      this.selectedVariant = a;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${w(this.model.header.eyebrow)}</p>
        <div>
          <h2>${w(this.model.header.title)}</h2>
          <p>${w(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(fc).join("")}
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
          <div><dt>Custo base</dt><dd>${w(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${w(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${w(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${w(this.model.automation.title)}</strong></p>
        <p>${w(this.model.automation.description)}</p>
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
    const r = yc(t), n = gc(r, this.input.defaultSpendResource, this.selectedVariant);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function fc(e) {
  const t = e.checked ? "checked" : "", r = e.enabled ? "" : "disabled", n = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((a) => `<span>${w(a)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${n}"
      data-paranormal-toolkit-ritual-cast-form="${w(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${w(e.variant)}" ${t} ${r}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${w(e.label)}</strong>
        <em>${w(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function pc(e, t) {
  const r = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of r)
    o.addEventListener("click", () => dr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), dr(e, o, t));
    });
  const n = Tn(e);
  n && t(n);
}
function dr(e, t, r) {
  const n = t.querySelector('input[name="variant"]');
  !n || n.disabled || !Te(n.value) || (n.checked = !0, e.dataset.paranormalToolkitSelectedVariant = n.value, r(n.value), n.dispatchEvent(new Event("change", { bubbles: !0 })), Tn(e));
}
function Tn(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let r = null;
  for (const n of t) {
    const o = n.querySelector('input[name="variant"]'), a = o?.checked === !0;
    n.setAttribute("aria-checked", a ? "true" : "false"), a && Te(o.value) && (r = o.value);
  }
  return r && (e.dataset.paranormalToolkitSelectedVariant = r), r;
}
function gc(e, t, r) {
  const n = hc(e) ?? r, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: n,
    spendResource: o
  };
}
function hc(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Te(t)) return t;
  const r = e?.dataset.paranormalToolkitSelectedVariant;
  return Te(r) ? r : null;
}
function yc(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const r = t.closest(".paranormal-toolkit-ritual-cast");
    if (r) return r;
  }
  return null;
}
function w(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function Ac(e) {
  return ce.request(e);
}
const $t = {
  label: "Padrão"
}, Rc = {
  label: "Discente",
  extraCost: 2
}, bc = {
  label: "Verdadeiro",
  extraCost: 5
};
class kc {
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
    const n = this.resolveCostPreview(t), o = Qc(r), a = Wc(r, t.item, n, o), s = await Ac({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((C) => C.name),
      cost: n,
      defaultSpendResource: tl(r),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const i = Xc(r, t.item, s.variant, o), d = Wr();
    let g = null;
    if (d) {
      const C = await wc(this.resources, t.actor, s, i, n);
      if (!C.ok)
        return {
          status: "failed",
          reason: C.reason,
          message: C.message
        };
      try {
        g = await Qi(t.actor);
      } catch (S) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: S instanceof Error ? S.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: S
        };
      }
      if (!g.success) {
        const S = fr(t, s);
        return {
          status: "completed-without-actions",
          workflowContext: S,
          summaryLines: He(r, s, i, n, S, g, {
            effectStopped: !0
          })
        };
      }
    }
    const A = Tc(r, s, i, n, {
      includeCostSteps: !d
    });
    if (A.steps.length === 0) {
      const C = fr(t, s);
      return {
        status: "completed-without-actions",
        workflowContext: C,
        summaryLines: He(r, s, i, n, C, g)
      };
    }
    const R = await this.workflow.runAutomation(A, {
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
    if (!R.ok)
      return {
        status: "failed",
        reason: R.error.reason,
        message: R.error.message,
        cause: R.error
      };
    const k = R.value.context, b = Cc(r, t, k), m = He(r, s, i, n, k, g);
    return b.ok ? b.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: k,
      summaryLines: m
    } : {
      status: "ready",
      workflowContext: k,
      actions: b.actions,
      summaryLines: m
    } : {
      status: "failed",
      reason: b.reason,
      message: b.message
    };
  }
  async applyAction(t) {
    return ke(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function Tc(e, t, r, n, o) {
  const a = [];
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || Ct(s) && (!o.includeCostSteps || !t.spendResource) || a.push($c(s, r));
  return o.includeCostSteps && t.spendResource && n && rl(r.extraCost) && a.push({
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
async function wc(e, t, r, n, o) {
  if (!r.spendResource) return { ok: !0 };
  const a = Ee(o, n);
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
function $c(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function Cc(e, t, r) {
  const n = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const a = be(o, r);
    if (!a.ok)
      return {
        ok: !1,
        reason: a.error.reason,
        message: a.error.message
      };
    const s = vc(o.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(..._c(e, o, i, a.value));
  }
  return { ok: !0, actions: n };
}
function _c(e, t, r, n) {
  if (!Ec(e, t))
    return [mr(t, r, n)];
  const o = Nc();
  return wn(e).map((a) => {
    const s = Lc(n, a);
    return mr(t, r, s, {
      option: a,
      choiceGroupId: o
    });
  });
}
function mr(e, t, r, n) {
  const o = t.name ?? "Ator sem nome", a = Pc(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: Sc(e, o, r, n?.option),
    executedLabel: Ic(e, o, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function Sc(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function Ic(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Pc(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Ec(e, t) {
  return t.operation === "damage" && t.resource === "PV" && wn(e).length > 1;
}
function wn(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Lc(e, t) {
  const r = e * t.multiplier, n = Dc(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function Dc(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Nc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function vc(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function He(e, t, r, n, o, a = null, s = {}) {
  const i = s.effectStopped === !0;
  return [
    `Forma: ${kn(t.variant)}`,
    Mc(t, r, n),
    ...Oc(a),
    ...i ? [] : Object.values(o.rolls).flatMap(Fc),
    ...i ? [] : Uc(e.resistance),
    ...Gc(r),
    ...i ? ["Observação: O efeito do ritual não foi resolvido porque a conjuração falhou."] : []
  ];
}
function Oc(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Mc(e, t, r) {
  const n = Ee(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Fc(e) {
  const r = [`${zc(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = xc(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${Vc(e.damageType)}`), r;
}
function Uc(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function xc(e) {
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
    const s = Bc(a);
    s && (qc(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function Bc(e) {
  const t = jc(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Hc(e);
}
function jc(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function Hc(e) {
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
function qc(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function Vc(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Gc(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function zc(e) {
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
function Wc(e, t, r, n) {
  return bn.map((o) => {
    const a = $n(e, t, o, n), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? kn(o),
      enabled: s,
      details: a ? Kc(a, r, n) : [],
      finalCostText: a ? Yc(r, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function Kc(e, t, r) {
  const n = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? n.push(o.join(", ")) : r && n.push("efeito manual");
  const a = Ee(t, e);
  return n.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), n;
}
function Ee(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function Yc(e, t) {
  const r = Ee(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function Qc(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Ct);
}
function fr(e, t) {
  return hn({
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
function Xc(e, t, r, n) {
  return $n(e, t, r, n) ?? $t;
}
function $n(e, t, r, n) {
  const o = e.ritualForms?.[r] ?? null;
  return o || (n ? Jc(t, r) ? Zc(r) : null : r === "base" ? $t : null);
}
function Zc(e) {
  switch (e) {
    case "base":
      return $t;
    case "discente":
      return Rc;
    case "verdadeiro":
      return bc;
  }
}
function Jc(e, t) {
  if (t === "base") return !0;
  const r = t === "discente" ? "system.studentForm" : "system.trueForm";
  return el(foundry.utils.getProperty(e, r));
}
function el(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function tl(e) {
  return e.steps.some(Ct);
}
function Ct(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function rl(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function nl(e, t) {
  const r = await ol(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: sl(r),
    total: il(r),
    diceBreakdown: cl(r)
  };
}
function Cn(e) {
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
async function ol(e, t) {
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
  return al(n);
}
function al(e) {
  return pr(e) ? e : Array.isArray(e) ? e.find(pr) ?? null : null;
}
function pr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function sl(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function il(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function cl(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(ll);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function ll(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const _n = "itemUsePrompts", Sn = "chatCard", Le = "data-paranormal-toolkit-prompt-id", De = "data-paranormal-toolkit-pending-id", _t = "data-paranormal-toolkit-executed-label", nt = "data-paranormal-toolkit-choice-group", In = "data-paranormal-toolkit-skipped-label", gr = "data-paranormal-toolkit-action-section", hr = "data-paranormal-toolkit-detail-key", yr = "data-paranormal-toolkit-roll-card", St = "data-paranormal-toolkit-roll-detail-toggle", Pn = "data-paranormal-toolkit-roll-detail-id", En = "data-paranormal-toolkit-resistance-roll-button", Ln = "data-paranormal-toolkit-resistance-skill", Dn = "data-paranormal-toolkit-resistance-skill-label", Nn = "data-paranormal-toolkit-resistance-target-actor-id", vn = "data-paranormal-toolkit-resistance-target-name", On = "data-paranormal-toolkit-resistance-roll-result", Ar = "data-paranormal-toolkit-system-card-replaced", ul = `[${De}]`, dl = `[${St}]`, ml = `[${En}]`, ot = `${c}-chat-enrichment`, p = `${c}-item-use-prompt`, fl = `${p}__actions`, Rr = `${p}__details`, Mn = `${p}__summary`, pl = `${p}__title`, Fn = `${p}__button--executed`, br = `${p}__roll-card`;
let kr = !1, at = null;
const E = /* @__PURE__ */ new Map(), gl = [0, 100, 500, 1500, 3e3], hl = 3e4, yl = [0, 100, 500, 1500, 3e3];
function Al(e) {
  if (at = e, kr) {
    wr(e);
    return;
  }
  const t = (r, n) => {
    xn(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), kr = !0, wr(e);
}
async function Tr(e) {
  const t = Un(e);
  E.set(e.pendingId, t), await Et(t) || Yn(t), Bn(e.pendingId);
}
async function Rl(e) {
  const t = Un({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", E.set(e.pendingId, t), await Et(t) || Yn(t), Bn(e.pendingId);
}
async function qe(e, t) {
  const r = E.get(e);
  E.delete(e), r && await Au(r, t);
}
function It(e) {
  const t = to();
  for (const r of t) {
    const n = F(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function bl(e, t) {
  const r = It(e);
  if (!r) return;
  const n = F(r.message), o = n[e];
  o && (n[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await re(r.message, n));
}
async function kl(e, t, r) {
  if (!t) return;
  const n = It(e);
  if (!n) return;
  const o = F(n.message);
  let a = !1;
  for (const [s, i] of Object.entries(o))
    s !== e && i.choiceGroupId === t && (o[s] = {
      ...i,
      executedLabel: r ?? i.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await re(n.message, o);
}
function Un(e) {
  const t = B(e.context.message), r = e.context.targets.find((s) => lt(s)), n = r ? lt(r) : null, o = e.resistanceTargetActor ?? n, a = e.resistanceTargetName ?? r?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Wl(e.context),
    executed: !1
  };
}
function xn(e, t, r) {
  yu();
  const n = ve(t);
  if (!n) return;
  const o = pu(e, n);
  o.length > 0 && we(n);
  for (const a of o)
    st(n, a);
  qn(n, r), it(n), ct(n);
}
function wr(e) {
  for (const t of yl)
    globalThis.setTimeout(() => {
      Tl(e);
    }, t);
}
function Tl(e) {
  for (const t of wl()) {
    const r = Ne(t);
    $l(r) && xn(r, t, e);
  }
}
function wl() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function $l(e) {
  return e ? Lt(e) ? !0 : bu(e).length > 0 : !1;
}
function Bn(e) {
  const t = E.get(e);
  if (!t) return;
  const r = t.messageId ? gu(t.messageId) : null;
  if (r) {
    Ir(r, t), we(r), st(r, t), $r(r), it(r), ct(r);
    return;
  }
  if (t.messageId) {
    dt(t);
    return;
  }
  const n = hu(t);
  if (n) {
    Ir(n, t), we(n), st(n, t), $r(n), it(n), ct(n);
    return;
  }
  dt(t);
}
function $r(e) {
  at && qn(e, at);
}
function we(e) {
  const t = Cl();
  e.classList.toggle(`${p}--system-card-replaced`, t);
  const r = Hn(e);
  if (!r || (r.classList.toggle(`${p}__host--system-card-replaced`, t), !t) || r.getAttribute(Ar) === "true") return;
  const n = r.querySelector(`.${ot}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(Ar, "true");
}
function Cl() {
  try {
    return na() === "replace";
  } catch {
    return !1;
  }
}
function st(e, t) {
  if (we(e), e.querySelector(`[${Le}="${ne(t.pendingId)}"]`)) return;
  const r = _l(e, t);
  Il(r, t), Hl(r, ql(t)).append(zl(t));
}
function _l(e, t) {
  const r = e.querySelector(`.${ot}`);
  if (r)
    return r;
  const n = document.createElement("section");
  n.classList.add(ot, p);
  const o = document.createElement("header");
  o.classList.add(`${p}__header`);
  const a = document.createElement("span");
  a.classList.add(`${p}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(pl), s.textContent = Sl(t);
  const i = document.createElement("span");
  return i.classList.add(Mn), i.textContent = t.summary, o.append(a, s, i), n.append(o), Yl(e).append(n), n;
}
function Sl(e) {
  const t = $(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function Il(e, t) {
  const r = t.summaryLines ?? [], n = Wn(r, t);
  if (n) {
    Pl(e, n, t);
    return;
  }
  Vl(e, r);
}
function Pl(e, t, r) {
  if (e.querySelector(`[${yr}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(br, `${br}--${t.intent}`), n.setAttribute(yr, "true"), t.castingCheck && Cr(n, Ll(t.castingCheck), r.pendingId, "casting"), El(t) && Cr(n, Dl(t), r.pendingId, "effect"), Fl(n, t), Ul(n, t, r), jl(n, t), e.append(n);
}
function El(e) {
  return e.intent !== "casting";
}
function Ll(e) {
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
function Dl(e) {
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
function Cr(e, t, r, n) {
  const o = document.createElement("section");
  o.classList.add(
    `${p}__workflow-section`,
    `${p}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${p}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${p}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, a.append(s), t.statusLabel) {
    const i = document.createElement("span");
    i.classList.add(`${p}__workflow-section-status`), i.textContent = t.statusLabel, a.append(i);
  }
  if (o.append(a), t.description) {
    const i = document.createElement("span");
    i.classList.add(`${p}__workflow-section-description`), i.textContent = t.description, o.append(i);
  }
  Nl(o, t), Bl(o, t.detailRows, r, n, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Nl(e, t) {
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-roll`);
  const n = document.createElement("span");
  n.classList.add(`${p}__workflow-roll-formula`), n.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${p}__workflow-roll-total`), o.textContent = String(t.total), r.append(n, o);
  const a = vl(t.formula, t.diceBreakdown);
  a && r.append(a), e.append(r);
}
function vl(e, t) {
  const r = Ol(t);
  if (r.length === 0) return null;
  const n = document.createElement("div");
  n.classList.add(`${p}__workflow-dice-tray`);
  for (const o of Ml(r, e)) {
    const a = document.createElement("span");
    a.classList.add(`${p}__workflow-die`), o.active || a.classList.add(`${p}__workflow-die--inactive`), a.textContent = String(o.value), n.append(a);
  }
  return n;
}
function Ol(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((n) => Number(n.trim())).filter((n) => Number.isFinite(n)).map((n) => Math.trunc(n)) : [];
}
function Ml(e, t) {
  if (e.length <= 1) return e.map((n) => ({ value: n, active: !0 }));
  const r = t.toLowerCase();
  return r.includes("kh") ? _r(e, "highest") : r.includes("kl") ? _r(e, "lowest") : e.map((n) => ({ value: n, active: !0 }));
}
function _r(e, t) {
  const r = t === "highest" ? Math.max(...e) : Math.min(...e);
  let n = !1;
  return e.map((o) => {
    const a = !n && o === r;
    return a && (n = !0), { value: o, active: a };
  });
}
function Fl(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Uu);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__roll-meta`);
  for (const o of r) {
    const a = document.createElement("span");
    a.classList.add(`${p}__roll-meta-pill`), a.textContent = o, n.append(a);
  }
  e.append(n);
}
function Ul(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${p}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = xl(t, r);
  o.append(a), s && o.append(s);
  const i = document.createElement("span");
  i.classList.add(`${p}__resistance-description`), i.textContent = t.resistance, n.append(o, i), t.resistanceRollResult && n.append(jn(t.resistanceRollResult)), e.append(n);
}
function xl(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${p}__resistance-roll-button`), r.setAttribute(Le, t.pendingId), r.setAttribute(En, "true"), r.setAttribute(Ln, e.resistanceSkill), r.setAttribute(Dn, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(Nn, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(vn, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${p}__resistance-roll-button--rolled`), r.setAttribute(On, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${p}__resistance-roll-fallback`), o.textContent = "d20", r.append(n, o), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function jn(e) {
  const t = document.createElement("span");
  return t.classList.add(`${p}__resistance-roll-result`), t.textContent = Gn(e), t;
}
function Bl(e, t, r, n, o) {
  const a = t.filter((g) => g.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${r}-roll-details-${n}`, i = document.createElement("button");
  i.type = "button", i.classList.add(`${p}__roll-detail-toggle`), i.setAttribute(St, s), i.setAttribute("aria-expanded", "false"), i.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${p}__roll-detail-list`), d.setAttribute(Pn, s), d.hidden = !0;
  for (const g of a) {
    const A = document.createElement("dt");
    A.textContent = g.label;
    const R = document.createElement("dd");
    R.textContent = g.value, d.append(A, R);
  }
  e.append(i, d);
}
function jl(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-notes`);
  for (const n of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = n, r.append(o);
  }
  e.append(r);
}
function Hl(e, t) {
  const r = `[${gr}="${ne(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const o = document.createElement("div");
  o.classList.add(fl), o.setAttribute(gr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${p}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function ql(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = Wn(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Vl(e, t) {
  if (t.length === 0) return;
  const r = Gl(e);
  for (const n of t) {
    const o = xu(n);
    if (r.querySelector(`[${hr}="${ne(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = n, a.setAttribute(hr, o), r.append(a);
  }
}
function Gl(e) {
  const t = e.querySelector(`.${Rr}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(Rr), e.append(r), r;
}
function zl(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${p}__button`), t.setAttribute(Le, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Fn), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(De, e.pendingId), t.setAttribute(_t, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(nt, e.choiceGroupId), t.setAttribute(In, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Wl(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = Kl(e);
  return `${t} → ${r}`;
}
function Kl(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Yl(e) {
  return Hn(e) ?? e;
}
function Hn(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function qn(e, t) {
  const r = ve(e);
  if (!r) return;
  const n = r.querySelectorAll(ul);
  for (const o of n)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      lu(o, t);
    }));
}
function it(e) {
  const t = ve(e);
  if (!t) return;
  const r = t.querySelectorAll(dl);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      Ql(t, n);
    }));
}
function ct(e) {
  const t = ve(e);
  if (!t) return;
  const r = t.querySelectorAll(ml);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      Xl(t, n);
    }));
}
function Ql(e, t) {
  const r = t.getAttribute(St);
  if (!r) return;
  const n = e.querySelector(`[${Pn}="${ne(r)}"]`);
  if (!n) return;
  const o = n.hidden;
  n.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Xl(e, t) {
  const r = t.getAttribute(Le), n = t.getAttribute(Ln), o = t.getAttribute(Dn) ?? (n ? Cn(n) : "Resistência");
  if (!r || !n) return;
  const a = eu(e, r), s = tu(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await nl(s, n);
    await su(d.roll);
    const g = {
      skill: n,
      skillLabel: o,
      formula: d.formula,
      total: d.total,
      targetName: s.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: d.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Zl(t, g), Jl(t, g), iu(r, g), await cu(e, r, g);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function Zl(e, t) {
  e.classList.add(`${p}__resistance-roll-button--rolled`), e.setAttribute(On, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Jl(e, t) {
  const r = e.closest(`.${p}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${p}__resistance-roll-result`), o = n ?? jn(t);
  if (n) {
    n.textContent = Gn(t);
    return;
  }
  r.append(o);
}
function eu(e, t) {
  const r = E.get(t);
  if (r) return r;
  const n = Ne(e);
  return F(n)[t] ?? null;
}
function tu(e, t) {
  const r = e?.resistanceTargetActor;
  if (v(r)) return r;
  const o = e?.context?.targets.map(lt).find(v) ?? null;
  if (o) return o;
  const a = t.getAttribute(Nn) ?? e?.resistanceTargetActorId ?? null, s = a ? nu(a) : null;
  return s || ou(
    t.getAttribute(vn) ?? e?.resistanceTargetName ?? ru(t)
  );
}
function ru(e) {
  const r = e.closest(`.${p}`)?.querySelector(`.${Mn}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const o = r.split(n), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function lt(e) {
  const t = e.actor;
  if (v(t)) return t;
  const r = e.token, n = ue(r);
  if (n) return n;
  const o = e.document;
  return ue(o);
}
function ue(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (v(t)) return t;
  const r = e.document?.actor;
  return v(r) ? r : null;
}
function nu(e) {
  const r = game.actors?.get?.(e);
  return v(r) ? r : Vn().map((a) => ue(a)).find((a) => a?.id === e) ?? null;
}
function ou(e) {
  const t = Z(e);
  if (!t) return null;
  const r = Vn().filter((a) => Z(au(a)) === t).map((a) => ue(a)).find(v) ?? null;
  if (r) return r;
  const o = game.actors?.find?.((a) => v(a) && Z(a.name) === t);
  return v(o) ? o : null;
}
function Vn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function au(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : ue(e)?.name ?? null;
}
function Z(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function v(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Gn(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function su(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function iu(e, t) {
  const r = E.get(e);
  r && (r.resistanceRollResult = t);
}
async function cu(e, t, r) {
  const n = Ne(e);
  if (n)
    try {
      const o = F(n), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: r
      }, await re(n, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Ne(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return M(n?.get?.(r));
}
async function lu(e, t) {
  const r = e.getAttribute(De);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    zn(e, e.getAttribute(_t) ?? "✓ Automação aplicada"), uu(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function zn(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Fn), e.removeAttribute(De), e.removeAttribute(_t);
}
function uu(e) {
  const t = e.getAttribute(nt);
  if (!t) return;
  const r = e.closest(`.${p}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${nt}="${ne(t)}"]`;
  for (const o of r.querySelectorAll(n)) {
    if (o === e) continue;
    const a = o.getAttribute(In) ?? "✓ Outra opção escolhida";
    zn(o, a);
  }
}
function Wn(e, t) {
  const r = e.map(Pt).filter(Mu), n = r.find((m) => m.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const o = $(e, "Forma"), a = $(e, "Custo"), s = $(e, "Dados") ?? $(e, `Dados (${n.label})`), i = $(e, "Tipo"), d = $(e, "Resistência"), g = $(e, "Resistência Perícia"), A = $(e, "Resistência Rótulo") ?? (g ? Cn(g) : null), R = Kn(e, "Observação"), k = e.filter((m) => fu(m, n)), b = du(e);
  return {
    ...n,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: s,
    damageType: i,
    resistance: d,
    resistanceSkill: g,
    resistanceSkillLabel: A,
    notes: R,
    details: k,
    castingCheck: b,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function du(e) {
  const t = e.map(Pt).find((a) => a?.intent === "casting") ?? null, r = $(e, "Conjuração DT"), n = $(e, "Conjuração Resultado");
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
function Pt(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, n, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: r,
    formula: n,
    total: a,
    intent: mu(r)
  } : null;
}
function mu(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function $(e, t) {
  return Kn(e, t)[0] ?? null;
}
function Kn(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const o = n.slice(r.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function fu(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Pt(e) ? !1 : e.trim().length > 0;
}
function pu(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of E.values())
    ut(n, e, t) && r.set(n.pendingId, n);
  for (const n of Ru(e))
    ut(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, o) => n.createdAt - o.createdAt);
}
function ut(e, t, r) {
  const n = B(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !Sr(r, "itemId", e.itemId) ? !1 : !e.actorId || Sr(r, "actorId", e.actorId);
}
function Sr(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${Bu(t)}`;
  for (const o of e.querySelectorAll(`[${n}]`))
    if (o.getAttribute(n) === r)
      return !0;
  return !1;
}
function gu(e) {
  const t = ne(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function hu(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (ut(e, null, t))
      return t;
  return null;
}
function yu() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of E.entries())
    e - n.createdAt > t && E.delete(r);
}
async function Ir(e, t) {
  const r = Ne(e);
  if (!r) return !1;
  try {
    const n = F(r);
    return n[t.pendingId] = Dt(t, B(r)), await re(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function Et(e) {
  const t = Zn(e);
  if (!t) return !1;
  try {
    const r = F(t);
    return r[e.pendingId] = Dt(e, B(t)), await re(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function Yn(e) {
  for (const t of gl)
    globalThis.setTimeout(() => {
      dt(e);
    }, t);
}
async function dt(e) {
  const t = Zn(e);
  if (Lt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const n = await Et(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function Au(e, t) {
  const r = Xn(e.context.message);
  if (r)
    try {
      const n = F(r), o = n[e.pendingId] ?? Dt(e, B(r));
      n[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await re(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function Ru(e) {
  return Object.values(F(M(e))).filter(fe);
}
function F(e) {
  if (!e) return {};
  const t = {}, r = Lt(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, o] of Object.entries(Qn(e)))
    t[n] ??= o;
  return t;
}
function bu(e) {
  return Object.values(Qn(M(e))).filter(fe);
}
function Qn(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, _n);
  if (!J(t))
    return {};
  const r = {};
  for (const [n, o] of Object.entries(t))
    fe(o) && (r[n] = o);
  return r;
}
async function re(e, t) {
  typeof e.setFlag == "function" && (await Tu(e, t), await ku(e, t));
}
async function ku(e, t) {
  await Promise.resolve(e.setFlag?.(c, _n, t));
}
function Lt(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, Sn);
  return vu(t) ? t : null;
}
async function Tu(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(fe).sort((a, s) => a.createdAt - s.createdAt);
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
      actorName: wu(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(c, Sn, o));
}
function wu(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function Dt(e, t) {
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
function Xn(e) {
  const t = M(e);
  if (t?.setFlag)
    return t;
  const r = $u(e);
  if (r?.setFlag)
    return r;
  const n = B(e);
  if (!n) return null;
  const o = game.messages;
  return M(o?.get?.(n));
}
function $u(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(M).find((r) => typeof r?.setFlag == "function") ?? null;
}
function Zn(e) {
  const t = Xn(e.context.message);
  if (t) return t;
  const r = e.messageId ? Cu(e.messageId) : null;
  if (r) return r;
  const n = to().slice().reverse();
  return n.find((o) => _u(o, e)) ?? n.find((o) => Su(o, e)) ?? null;
}
function Cu(e) {
  const t = game.messages;
  return M(t?.get?.(e));
}
function _u(e, t) {
  const r = B(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!Jn(e, t)) return !1;
  const o = eo(e);
  return !t.actorId || !o || o === t.actorId;
}
function Su(e, t) {
  if (!Pu(e, t)) return !1;
  const r = eo(e);
  return t.actorId && r === t.actorId ? !0 : Jn(e, t);
}
function Jn(e, t) {
  const r = Z(Iu(e));
  if (!r) return !1;
  const n = Z(t.itemName);
  if (n && r.includes(n)) return !0;
  const o = Z(t.itemId);
  return !!(o && r.includes(o));
}
function Iu(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function eo(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Pu(e, t) {
  const r = Eu(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= hl;
}
function Eu(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function M(e) {
  return e && typeof e == "object" ? e : null;
}
function fe(e) {
  return J(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && _(e.messageId) && _(e.itemId) && _(e.actorId) && _(e.itemName) && G(e.resistanceTargetActorId) && G(e.resistanceTargetName) && Ou(e.resistanceRollResult) && Lu(e.actionPayload) && Ve(e.title) && Ve(e.buttonLabel) && Ve(e.executedLabel) && G(e.choiceGroupId) && G(e.skippedLabel) && G(e.actionSectionId) && G(e.actionSectionTitle) && Fu(e.summaryLines) : !1;
}
function Lu(e) {
  return e == null ? !0 : J(e) ? e.kind === "resource-operation" && _(e.actorId) && _(e.actorUuid) && typeof e.actorName == "string" && Du(e.resource) && Nu(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Du(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Nu(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function vu(e) {
  return J(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && _(e.messageId) && J(e.source) && _(e.source.actorId) && _(e.source.actorName) && _(e.source.itemId) && _(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(fe) : !1;
}
function Ou(e) {
  return e == null ? !0 : J(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && G(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Mu(e) {
  return e !== null;
}
function J(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function _(e) {
  return e === null || typeof e == "string";
}
function Ve(e) {
  return e === void 0 || typeof e == "string";
}
function G(e) {
  return e == null || typeof e == "string";
}
function Fu(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Uu(e) {
  return typeof e == "string" && e.length > 0;
}
function to() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(M).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(M).filter((n) => n !== null) : [];
}
function ve(e) {
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
function xu(e) {
  return e.trim().toLowerCase();
}
function Bu(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ne(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Pr = 1e3;
class ju {
  constructor(t, r, n, o) {
    this.workflow = t, this.resources = r, this.debugOutput = o, this.ritualAssistant = new kc(t, r, n);
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
      settings: Bt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = Bt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = ft(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && Hu(t.item) && r.executionMode === "ask") {
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
    if (await cr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: ze(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await qe(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const n = await this.ritualAssistant.applyAction(r.action);
    return n.ok ? (r.workflowContext.resourceTransactions.push(n.value), this.pendingExecutions.delete(t), await qe(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(n), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = It(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, o = Gu(n);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const a = await ke(this.resources, o, n.resource, n.operation, n.amount);
    return a.ok ? (await bl(t), await kl(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Al((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await cr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: ze(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, qu(t.item));
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
        await this.registerCompletedRitualCard(t, n.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), l.info("Ritual assistido concluído sem ações pendentes.", W(n.workflowContext));
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
      a.kind === "resource-action" && (this.pendingExecutions.delete(o), await qe(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, r) {
    const n = We();
    await Rl({
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
      const i = We();
      a ??= i, this.pendingExecutions.set(i, {
        kind: "resource-action",
        id: i,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await Tr({
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
        actionPayload: Vu(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), l.info("Ritual assistido preparado com ações pendentes.", W(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = We();
    this.pendingExecutions.set(n, {
      kind: "workflow",
      id: n,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Tr({
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
    this.setAttempt(t, "completed"), l.info("Automação executada por uso normal de item.", W(o.value.context));
  }
  handleAutomationFailure(t) {
    const r = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      l.warn(r, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      l.error(r, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    l.warn(r, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    l.warn(`Ação assistida falhou: ${t.error.message}`, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const r = Date.now(), n = Er(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      r - s > Pr && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(n);
    return o !== void 0 && r - o <= Pr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Er(t), Date.now());
  }
  setAttempt(t, r, n, o) {
    this.lastAttempt = ze(t, r, n, o);
  }
}
function Hu(e) {
  return e.type === "ritual";
}
function qu(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Vu(e) {
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
function Gu(e) {
  const t = e.actorUuid ? zu(e.actorUuid) : null;
  if (ee(t)) return t;
  const r = e.actorId ? Wu(e.actorId) : null;
  return r || Ku(e.actorName);
}
function zu(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Wu(e) {
  const r = game.actors?.get?.(e);
  if (ee(r)) return r;
  for (const n of ro()) {
    const o = Nt(n);
    if (o?.id === e) return o;
  }
  return null;
}
function Ku(e) {
  const t = Ge(e);
  if (!t) return null;
  for (const o of ro()) {
    const a = Yu(o);
    if (Ge(a) === t) {
      const s = Nt(o);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((o) => ee(o) && Ge(o.name) === t);
  return ee(n) ? n : null;
}
function ro() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Yu(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : Nt(e)?.name ?? null;
}
function Nt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ee(t)) return t;
  const r = e.document?.actor;
  return ee(r) ? r : null;
}
function Ge(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ee(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function ze(e, t, r, n) {
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
function Er(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function We() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Qu {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], o = [], a = me(t);
    for (const s of r) {
      const i = s.itemId ? a.find((A) => A.id === s.itemId) ?? null : null, d = s.match?.preset ?? null;
      if (!i || !d) {
        o.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(i, d);
      const g = await this.itemPatches.applyPresetItemPatch(i, d);
      n.push({
        itemId: i.id ?? null,
        itemName: i.name ?? "Ritual sem nome",
        presetId: d.id,
        presetLabel: d.label,
        previousStatus: s.status,
        itemPatch: g
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
class Xu {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = me(t).map((i) => this.analyzeRitual(i)), n = r.filter(Ae("upToDate")), o = r.filter(Ae("available")), a = r.filter(Ae("outdated")), s = r.filter(Ae("unsupported"));
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
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = Zu(t);
    return r ? n ? n.source.type !== "preset" ? oe({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Automação manual encontrada. Preset sugerido: ${r.preset.label}.`
    }) : n.source.presetId === r.preset.id && n.source.presetVersion === r.preset.version ? oe({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Preset ${r.preset.label} v${r.preset.version} já aplicado.`
    }) : oe({
      ritual: t,
      status: "outdated",
      match: r,
      flag: n,
      reason: Ju(n, r.preset)
    }) : oe({
      ritual: t,
      status: "available",
      match: r,
      flag: n,
      reason: `Preset encontrado: ${r.preset.label}.`
    }) : oe({
      ritual: t,
      status: "unsupported",
      match: r,
      flag: n,
      reason: n ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function oe(e) {
  const t = e.flag?.source, r = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? _e(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function Zu(e) {
  const t = e.getFlag(c, "automation");
  return pt(t) ? t : null;
}
function Ju(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Ae(e) {
  return (t) => t.status === e;
}
class ed {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), n = ht(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: r,
      data: n,
      flags: {
        [c]: {
          resourceTransaction: n
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, r) {
    const n = this.createWorkflowSummaryContent(t, r), o = W(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: n,
      data: o,
      flags: {
        [c]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const r = y(t.actorName), n = y(t.resource), o = y(Lr(t)), a = y(rd(t));
    return `
      <section class="${c}-card ${c}-resource-card">
        <header class="${c}-card__header">
          <strong>${o}</strong>
          <span>${r}</span>
        </header>
        <div class="${c}-card__body">
          <p><strong>${a}:</strong> ${t.appliedAmount}</p>
          <p><strong>${n}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, r) {
    const n = y(r.title ?? "Automação"), o = r.message ? `<p>${y(r.message)}</p>` : "", a = y(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = y(t.item.name ?? "Item sem nome"), i = t.targets.length > 0 ? t.targets.map((m) => y(m.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (m) => `<li><strong>${y(m.id)}:</strong> ${y(m.formula)} = ${m.total} <em>(${y(td(m.intent))})</em>${m.damageType ? ` — ${y(m.damageType)}` : ""}</li>`
    ), g = t.ritualCosts.map(
      (m) => `<li><strong>${y(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${y(m.resource)} (${y(nd(m.source))})</li>`
    ), A = t.damageInstances.map(
      (m) => `<li><strong>${y(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${y(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), R = t.healingInstances.map(
      (m) => `<li><strong>${y(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), k = t.resourceTransactions.map(
      (m) => `<li><strong>${y(m.actorName)}:</strong> ${y(Lr(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), b = t.phases.map((m) => y(m)).join(" &rarr; ");
    return `
      <section class="${c}-card ${c}-workflow-card">
        <header class="${c}-card__header">
          <strong>${n}</strong>
          <span>${s}</span>
        </header>
        <div class="${c}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${i}</p>
          ${g.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${g.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Dano:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Cura:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${k.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${b}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function td(e) {
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
function Lr(e) {
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
function rd(e) {
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
function nd(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function y(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function od() {
  const e = new Is(), t = new wi(e), r = new Ls(), n = new vs(r), o = new Ks(e), a = new Qs(), s = a.registerMany(Mo());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new Ys(), d = new zs(), g = new Xu(a), A = new Qu(g, i, d), R = new Si(), k = new ed(R), b = new _i(), m = new ki(t, n, k, b), C = new Ci(m, b), S = new ju(C, t, n, R);
  return S.addStrategy(new Vs((ao) => S.handleItemUsed(ao))), {
    ordem: o,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: n,
    resources: t,
    automationRegistry: a,
    automationBinder: i,
    itemPatches: d,
    debugOutput: R,
    chatMessages: k,
    workflowHooks: b,
    automation: m,
    workflow: C,
    itemUseIntegration: S,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: A
  };
}
const { ApplicationV2: ad } = foundry.applications.api;
class $e extends ad {
  constructor(t, r) {
    super({
      id: `${c}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
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
      apply: $e.onApply,
      cancel: $e.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${L(mt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${L(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Ke("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Ke("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Ke("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Ke(e, t, r, n) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${n}"></i>
        <span>${L(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? sd(r) : cd(t)}
    </section>
  `;
}
function sd(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(id).join("")}</ol>`;
}
function id(e) {
  const t = e.preset, r = t ? `${t.label} v${t.version}` : "Sem preset", n = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${L(e.appliedPresetId)} v${L(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${L(e.itemName)}</strong>
        <span>${L(e.reason)}</span>
        ${n}
      </div>
      <em>${L(r)}</em>
    </li>
  `;
}
function cd(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${L({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function L(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const Ce = `${c}.manageRitualPresets`, Dr = `__${c}_ritualPresetHeaderControlRegistered`, ld = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function ud(e) {
  const t = globalThis;
  if (!t[Dr]) {
    for (const r of ld)
      Hooks.on(r, (n, o) => {
        dd(n, o, e);
      });
    t[Dr] = !0, l.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function dd(e, t, r) {
  Array.isArray(t) && fd(e) && (md(e, r), !t.some((n) => n.action === Ce) && t.push({
    action: Ce,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), no(e, r);
    }
  }));
}
function md(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Ce] && (e.options.actions[Ce] = (r) => {
    r.preventDefault(), r.stopPropagation(), no(e, t);
  }));
}
function fd(e) {
  if (!game.user?.isGM) return !1;
  const t = oo(e);
  return t ? t.type === "agent" && me(t).length > 0 : !1;
}
function no(e, t) {
  const r = oo(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new $e(r, t).render({ force: !0 });
}
function oo(e) {
  return Nr(e.actor) ? e.actor : Nr(e.document) ? e.document : null;
}
function Nr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let Y = null;
Hooks.once("init", () => {
  No(), ra(), Ca(), Ss(), l.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Ht.isSupportedSystem()) {
    l.warn(
      `Sistema não suportado: ${Ht.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Y = od(), Y.itemUseIntegration.registerStrategies(), da(Y), Ta(), Aa(), ud(Y), l.info("Inicializado para o sistema Ordem Paranormal."), l.info(`API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${mt} inicializado.`);
});
function pd() {
  if (!Y)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Y;
}
export {
  pd as getToolkitServices
};
//# sourceMappingURL=main.js.map
