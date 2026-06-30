const c = "paranormal-toolkit", ft = "Paranormal Toolkit", so = "ordemparanormal";
class me {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Se(e) {
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
function pt(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? f({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : gt(t) ? h(t.definition) : f({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function io(e) {
  return gt(e.getFlag(c, "automation"));
}
function gt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && lo(t.source) && co(t.definition);
}
function co(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && S(t.label) && Array.isArray(t.steps) && t.steps.every(uo);
}
function lo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? S(t.presetId) && S(t.presetVersion) && S(t.appliedAt) : t.type === "manual" ? S(t.label) && S(t.appliedAt) : !1;
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
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Or(t);
}
function fo(e) {
  return e.type === "spendRitualCost";
}
function po(e) {
  const t = e;
  return t.type === "rollFormula" && S(t.id) && S(t.formula) && (t.intent === void 0 || bo(t.intent)) && (t.damageType === void 0 || S(t.damageType));
}
function go(e) {
  const t = e;
  return t.type === "modifyResource" && yo(t.actor) && Ao(t.resource) && Ro(t.operation) && Or(t);
}
function ho(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Or(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || S(e.amountFrom);
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
function S(e) {
  return typeof e == "string" && e.length > 0;
}
function ht(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(Ot);
    if (wo(t))
      return Array.from(t).filter(Ot);
  }
  return [];
}
function ko(e) {
  return ht(e)[0] ?? null;
}
function To(e) {
  return ht(e).find(io) ?? null;
}
function wo(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ot(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function fe(e) {
  return ht(e).filter((t) => t.type === "ritual");
}
function Mr(e) {
  return fe(e)[0] ?? null;
}
function $o(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Se);
      return l.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = se("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = ge(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(Ut);
      return l.info(`Presets encontrados para ${r.name}.`, n), n;
    },
    async applyPresetToFirstRitual(t) {
      const r = se("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const n = ge(r);
      if (!n) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await Qe(e, n, o.value);
      l.info(`Preset ${o.value.id} aplicado em ${n.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = se("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = ge(t);
      if (!r) return;
      const n = e.automationRegistry.findForItem(r)[0];
      if (!n) {
        l.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const o = await Qe(e, r, n.preset);
      l.info(`Melhor preset aplicado em ${r.name}.`, { match: Ut(n), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Mt(e);
    },
    async applyBestPresetsToActorRituals() {
      return Mt(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = se("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = ge(t);
      r && (await e.automationBinder.clear(r), l.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function Mt(e) {
  const t = se("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = fe(t);
  if (r.length === 0)
    return l.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Ft(t);
  const n = Ft(t, r.length);
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
    const s = await Qe(e, o, a.preset);
    n.applied.push(Co(o, a, s));
  }
  return l.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), _o(n), n;
}
async function Qe(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function Co(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Se(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function Ft(e, t = 0) {
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
function Ut(e) {
  return {
    preset: Se(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function se(e) {
  const t = me.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ge(e) {
  const t = Mr(e);
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
    rollRequests: xt(e.rollRequests, Fr),
    rolls: xt(e.rolls, Eo),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(yt),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function yt(e) {
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
function Fr(e) {
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
    ...Fr(e),
    total: e.total
  };
}
function xt(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function Lo(e) {
  return {
    getSelected() {
      return me.getSelectedActor();
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
  l.info(`${t} realizado:`, yt(a));
}
function j(e) {
  const t = me.getSelectedActor();
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
const L = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function No() {
  he(L.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), he(L.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), he(L.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), he(L.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Xe() {
  return {
    enabled: ye(L.enabled),
    console: ye(L.console),
    ui: ye(L.ui),
    chat: ye(L.chat)
  };
}
async function U(e, t) {
  await game.settings.set(c, L[e], t);
}
function he(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function ye(e) {
  return game.settings.get(c, e) === !0;
}
function vo() {
  return {
    status() {
      return Xe();
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
const Ur = "ritual.costOnly", xr = "ritual.simpleHealing", Oo = "ritual.eletrocussao", Br = "ritual.simpleDamage", jr = "generic.simpleHealing", qr = `
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
    id: Ur,
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
    id: xr,
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
    itemPatch: Ho()
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
    automation: qo(),
    itemPatch: Vo()
  };
}
function Bo() {
  return {
    id: Br,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: At()
  };
}
function jo() {
  return {
    id: jr,
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
  return Vr(
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
function qo() {
  return {
    ...At("1d8", {
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
function At(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Vr(
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
function Ho() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: qr,
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
    descriptionHtml: qr,
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
function Vr(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((n) => n.type !== "rollFormula" || n.id !== t ? n : {
      ...n,
      formula: r
    })
  };
}
function Rt() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Q(t.id),
    actorId: Q(t.actor?.id),
    sceneId: Q(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function zr() {
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
function zo(e) {
  return {
    logFirstRitualCost() {
      const t = q("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const r = H(t);
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
      const n = q("Nenhum ator encontrado para configurar custo customizado.");
      if (!n) return;
      const o = H(n);
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
      const t = q("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = H(t);
      r && (await r.unsetFlag(c, "ritual.cost"), l.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = q("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = H(t);
      if (!r) return;
      const n = e.automationRegistry.require(Ur);
      if (!n.ok) {
        l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value), l.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = q("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const n = H(r);
      if (!n) return;
      if (!Bt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(xr);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: Hr(t)
      }), l.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = q("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = H(r);
      if (!n) return;
      if (!Bt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Br);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: At(t)
      }), l.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = q("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = H(t);
      r && await Go(e, t, r);
    }
  };
}
async function Go(e, t, r) {
  const n = pt(r);
  if (!n.ok) {
    l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: zr(),
    item: r,
    targets: Rt()
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
function q(e) {
  const t = me.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function H(e) {
  const t = Mr(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Ko(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Bt(e) {
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
const ea = ["keep", "replace"], Wr = "keep", ta = !0, D = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function ra() {
  game.settings.register(c, D.executionMode, {
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
  }), game.settings.register(c, D.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Wr
  }), game.settings.register(c, D.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: ta
  }), game.settings.register(c, D.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function jt() {
  const e = Jo(game.settings.get(c, D.executionMode)), t = Yr(game.settings.get(c, D.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: Kr()
  };
}
function na() {
  return Yr(game.settings.get(c, D.systemCardMode));
}
function Kr() {
  return game.settings.get(c, D.ritualCastingCheckEnabled) === !0;
}
async function V(e) {
  await game.settings.set(c, D.executionMode, e);
}
function Yr(e) {
  return ea.includes(e) ? e : Wr;
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
      const t = Me("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = To(t);
      if (!r) {
        l.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await qt(e, t, r);
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
      const n = ca(r) ?? Me("Nenhum ator encontrado para executar automação do item.");
      n && await qt(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Me("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = ko(t);
      if (!r) {
        l.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(jr);
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
async function qt(e, t, r) {
  const n = pt(r);
  if (!n.ok) {
    l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: zr(),
    item: r,
    targets: Rt()
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
function Me(e) {
  const t = me.getSelectedActor();
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
  const t = Lo(e), r = $o(e), n = zo(e), o = sa(e), a = vo(), s = oa(e);
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
function Qr() {
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
function fa(e, t = Qr()) {
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
function Vt(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), r = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || r !== void 0;
}
function zt(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Ze(t) || Ze(r);
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
  return Ze(e) ? e : null;
}
function Ze(e) {
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
    if (!wa(n) || !$a(e) || Vt(e) || Vt(t)) return;
    const o = ma();
    if (o.length === 0 || !zt(e) && !zt(t)) return;
    const a = Qr();
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
const Xr = {
  enabled: "dice.animations.enabled"
};
function Ca() {
  game.settings.register(c, Xr.enabled, {
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
    enabled: game.settings.get(c, Xr.enabled) === !0
  };
}
const Sa = "chatCard", Wt = "data-paranormal-toolkit-prompt-id", u = `${c}-item-use-prompt`, Ia = `.${u}__title`, Zr = `.${u}__header`, Pa = `.${u}__roll-card`, Ea = `.${u}__roll-meta`, La = `.${u}__roll-meta-pill`, Da = `.${u}__resistance`, Na = `.${u}__resistance-header`, Jr = `.${u}__resistance-description`, va = `.${u}__resistance-roll-button`, Oa = `.${u}__resistance-roll-result`, Kt = `${u}__resistance-content`, en = `.${u}__workflow-section`, tn = `.${u}__workflow-roll`, rn = `${u}__workflow-roll--dice-open`, nn = `.${u}__workflow-roll-formula`, on = `${u}__workflow-roll-formula--toggle`, bt = `.${u}__workflow-dice-tray`, Ma = `.${u}__roll-detail-toggle`, Fa = `.${u}__roll-detail-list`, Ua = `.${u}__ritual-element-badge`, xa = `.${u}__ritual-metadata`;
function Ba(e) {
  for (const t of Array.from(e.querySelectorAll(en)))
    for (const r of Array.from(t.querySelectorAll(`${Ma}, ${Fa}`)))
      r.remove();
}
function ja(e) {
  for (const t of Array.from(e.querySelectorAll(Da)))
    qa(t);
}
function qa(e) {
  const t = e.querySelector(Na), r = e.querySelector(Jr), n = e.querySelector(va), o = e.querySelector(Oa);
  if (!n || !t && !r && !o) return;
  const a = Ha(e, n);
  t && t.parentElement !== a && a.append(t), r && r.parentElement !== a && a.append(r), o && o.parentElement !== a && !n.contains(o) && a.append(o), n.parentElement !== e && e.append(n);
}
function Ha(e, t) {
  const r = e.querySelector(`.${Kt}`);
  if (r) return r;
  const n = document.createElement("div");
  return n.classList.add(Kt), e.insertBefore(n, t.parentElement === e ? t : e.firstChild), n;
}
function Yt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function kt() {
  const e = globalThis.game;
  return Ie(e) ? e : null;
}
function I(e, t) {
  const r = Va(e, t);
  return be(r);
}
function Va(e, t) {
  return t.split(".").reduce((r, n) => Ie(r) ? r[n] : null, e);
}
function za(e, t) {
  const r = e.indexOf(":");
  return r < 0 || ue(e.slice(0, r)) !== ue(t) ? null : te(e.slice(r + 1));
}
function be(e) {
  return typeof e == "string" ? te(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Ie(e) {
  return !!e && typeof e == "object";
}
function Ga(e) {
  return typeof e == "string";
}
function Pe(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function te(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function ue(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Je(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function x(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function an(e) {
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
  const n = e.closest(`.${u}`)?.querySelector(Zr) ?? null, o = n?.querySelector(Ia) ?? null, a = n ?? e, s = a.querySelector(Ua);
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
  const a = e.querySelector(en);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function Xa(e) {
  return e.closest(`.${u}`)?.querySelector(Zr) ?? null;
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
    e.target ? `Alvo: ${Je(e.target)}` : null,
    e.duration ? `Duração: ${Je(e.duration)}` : null,
    e.resistance ? `Resistência: ${an(e.resistance)}` : null
  ].filter(Pe);
}
function es(e) {
  const t = ts(e), r = is(e), o = (t ? ss(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = Tt(I(o, "element")), i = v("op.elementChoices", s) ?? Qt(G(a, "Elemento")) ?? Qt(r.damageType), d = s ?? As(i), g = I(o, "circle") ?? G(a, "Círculo"), y = us(o) ?? G(a, "Alvo"), R = ps(o, "duration", "op.durationChoices") ?? G(a, "Duração"), b = cs(e) ?? ms(o) ?? G(a, "Resistência"), k = ls(a) ?? r.cost, m = {
    elementLabel: i,
    elementTone: d,
    circle: g,
    cost: k,
    target: y,
    duration: R,
    resistance: b
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
  return r ? kt()?.messages?.get?.(r) ?? null : null;
}
function ns(e) {
  const t = e.closest(`.${u}`) ?? e, r = /* @__PURE__ */ new Set();
  for (const n of Array.from(t.querySelectorAll(`[${Wt}]`))) {
    const o = n.getAttribute(Wt)?.trim();
    o && r.add(o);
  }
  return r;
}
function os(e) {
  if (!Ie(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(as).filter((r) => r !== null) : [];
}
function as(e) {
  return Ie(e) ? {
    pendingId: be(e.pendingId),
    actorId: be(e.actorId),
    itemId: be(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Ga) : []
  } : null;
}
function ss(e) {
  if (!e.itemId) return null;
  const t = kt(), n = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return n || (t?.items?.get?.(e.itemId) ?? null);
}
function is(e) {
  let t = null, r = null;
  for (const n of Array.from(e.querySelectorAll(La))) {
    const o = te(n.textContent);
    if (!o) continue;
    const a = za(o, "Tipo");
    a && (r = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: r };
}
function cs(e) {
  const t = te(e.querySelector(Jr)?.textContent);
  return t ? an(t) : null;
}
function G(e, t) {
  const r = ue(t);
  for (const n of e) {
    const o = n.indexOf(":");
    if (!(o < 0 || ue(n.slice(0, o)) !== r))
      return te(n.slice(o + 1));
  }
  return null;
}
function ls(e) {
  const t = G(e, "Custo") ?? G(e, "PE");
  return t || (e.map(te).find((r) => typeof r == "string" && /\b(P[ED]|PE|PD)\b/iu.test(r)) ?? null);
}
function us(e) {
  const t = I(e, "target");
  if (!t) return null;
  if (t === "area")
    return ds(e) ?? v("op.targetChoices", t) ?? "Área";
  const r = v("op.targetChoices", t) ?? x(t);
  return [t === "people" || t === "creatures" ? I(e, "targetQtd") : null, r].filter(Pe).join(" ");
}
function ds(e) {
  const t = I(e, "area.name"), r = I(e, "area.size"), n = I(e, "area.type"), o = t ? v("op.areaChoices", t) ?? x(t) : null, a = n ? v("op.areaTypeChoices", n) ?? x(n) : null;
  return o ? r ? a ? `${o} ${r}m ${Je(a)}` : `${o} ${r}m` : o : null;
}
function ms(e) {
  const t = I(e, "skillResis"), r = I(e, "resistance");
  if (!t || !r) return null;
  const n = v("op.skill", t) ?? x(t), o = fs(r);
  return [n, o].filter(Pe).join(" ");
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
      return v("op.resistanceChoices", e) ?? x(e);
  }
}
function ps(e, t, r) {
  const n = I(e, t);
  return n ? v(r, n) ?? x(n) : null;
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
  ].filter(Pe).join(" ");
}
function Tt(e) {
  const t = ue(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Qt(e) {
  const t = Tt(e);
  return t ? v("op.elementChoices", t) ?? x(t) : e ? x(e) : null;
}
function As(e) {
  return Tt(e);
}
function v(e, t) {
  if (!t) return null;
  const r = `${e}.${t}`, n = kt()?.i18n?.localize?.(r);
  return !n || n === r ? null : n;
}
const Xt = "data-paranormal-toolkit-dice-toggle-enhanced";
function Rs(e) {
  for (const t of Array.from(e.querySelectorAll(tn)))
    sn(t);
}
function bs(e) {
  const t = ln(e.target);
  if (!t) return;
  const r = wt(t);
  r && (e.preventDefault(), cn(r, t));
}
function ks(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = ln(e.target);
  if (!t) return;
  const r = wt(t);
  r && (e.preventDefault(), cn(r, t));
}
function sn(e) {
  const t = e.querySelector(bt);
  if (!t) return;
  const r = e.querySelector(nn);
  if (r && r.getAttribute(Xt) !== "true" && (r.setAttribute(Xt, "true"), r.classList.add(on), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", "false"), r.title = "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title), t.hidden = !0, !r.querySelector("i"))) {
    const n = document.createElement("i");
    n.classList.add("fa-solid", "fa-chevron-down"), n.setAttribute("aria-hidden", "true"), r.append(n);
  }
}
function cn(e, t) {
  const r = e.querySelector(bt);
  if (!r) return;
  const n = !e.classList.contains(rn);
  Ts(e, t, r, n);
}
function Ts(e, t, r, n) {
  e.classList.toggle(rn, n), r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.title = n ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !n), o.classList.toggle("fa-chevron-up", n));
}
function ln(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(nn);
  if (!t) return null;
  const r = wt(t);
  return r ? (sn(r), t.classList.contains(on) ? t : null) : null;
}
function wt(e) {
  const t = e.closest(tn);
  return t && t.querySelector(bt) ? t : null;
}
const Zt = `${c}-workflow-dice-toggle-styles`;
function ws() {
  if (document.getElementById(Zt)) return;
  const e = document.createElement("style");
  e.id = Zt, e.textContent = `
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
let Jt = !1, Fe = null;
function Cs() {
  if (!Jt) {
    Jt = !0, ws(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ie(Yt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ie(Yt(t));
    }), Hooks.once("ready", () => {
      ie(document), _s();
    }), document.addEventListener("click", bs), document.addEventListener("keydown", ks);
    for (const e of $s)
      globalThis.setTimeout(() => ie(document), e);
  }
}
function _s() {
  Fe || !document.body || (Fe = new MutationObserver((e) => {
    for (const t of e)
      for (const r of Array.from(t.addedNodes))
        (r instanceof HTMLElement || r instanceof DocumentFragment) && ie(r);
  }), Fe.observe(document.body, { childList: !0, subtree: !0 }));
}
function ie(e) {
  e && (Ba(e), Wa(e), ja(e), Rs(e));
}
function Ss() {
  Cs();
}
const ce = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, un = {
  PV: "system.attributes.hp"
}, et = {
  PV: [ce.PV, un.PV],
  SAN: [ce.SAN],
  PE: [ce.PE],
  PD: [ce.PD]
}, tt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Is {
  getResource(t, r) {
    const n = er(t, r);
    if (!n.ok)
      return f(n.error);
    const o = n.value, a = `${o}.value`, s = `${o}.max`, i = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, s), g = rr(t, r, a, i, "valor atual");
    if (g) return f(g);
    const y = rr(t, r, s, d, "valor máximo");
    return y ? f(y) : h({
      value: i,
      max: d
    });
  }
  async updateResourceValue(t, r, n) {
    const o = er(t, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: n });
  }
}
function er(e, t) {
  const r = Ps(e.type, t);
  if (r && tr(e, r))
    return h(r);
  const n = et[t].find(
    (o) => tr(e, o)
  );
  return n ? h(n) : f({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Es(e, t),
    path: et[t].join(" | ")
  });
}
function Ps(e, t) {
  return e === "threat" ? un[t] ?? null : e === "agent" ? ce[t] : null;
}
function tr(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function Es(e, t) {
  const r = e.type ?? "unknown", n = et[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function rr(e, t, r, n, o) {
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
      const s = tt.ritualItem.circleCandidates;
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
    for (const r of tt.ritualItem.circleCandidates) {
      const n = foundry.utils.getProperty(t, r);
      if (n != null)
        return { path: r, value: n };
    }
    return null;
  }
}
function Ds(e) {
  if (nr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (nr(r))
      return r;
  }
  return null;
}
function nr(e) {
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
const Ue = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Fs(e) {
  if (!Hs(e.item)) return null;
  const t = rt(e.actor) ? e.actor : Us(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Bs(e.token) ?? xs(t),
    targets: Rt(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Us(e) {
  const t = e;
  return rt(t.actor) ? t.actor : rt(e.parent) ? e.parent : null;
}
function xs(e) {
  const t = js(e) ?? qs(e);
  return t ? dn(t) : null;
}
function Bs(e) {
  return nt(e) ? dn(e) : null;
}
function js(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return nt(r) ? r : (t.getActiveTokens?.() ?? []).find(nt) ?? null;
}
function qs(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function dn(e) {
  const t = e.actor ?? null;
  return {
    tokenId: xe(e.id),
    actorId: xe(t?.id),
    sceneId: xe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Hs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function rt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function nt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function xe(e) {
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
    this.registered || (Hooks.on(Ue.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, l.info(`${Ue.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = Fs(zs(t));
    if (!r) {
      l.warn(`${Ue.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function zs(e) {
  return e && typeof e == "object" ? e : {};
}
class Gs {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return Be("missing-item-patch");
    if (t.type !== "ritual") return Be("unsupported-item-type");
    const o = Ws(n);
    return Object.keys(o).length === 0 ? Be("empty-update") : (await t.update(o), {
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
function Be(e) {
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
    return this.getNumber(t, tt.ritual.dt, 0);
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
    }) : (this.presets.set(t.id, je(t)), h(t)) : r;
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
    return r ? je(r) : null;
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
    return Array.from(this.presets.values()).map(je);
  }
  findForItem(t) {
    return this.list().map((r) => Zs(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function Xs(e) {
  return !qe(e.id) || !qe(e.version) || !qe(e.label) ? f({
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
      const r = or(t.name), n = e.names.map(or).includes(r);
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
function or(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function ei(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function je(e) {
  return structuredClone(e);
}
function qe(e) {
  return typeof e == "string" && e.length > 0;
}
function ke(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? f({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : h(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = Ee(e.amountFrom);
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
function Ee(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const ti = "dice-so-nice";
async function mn(e) {
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
  if (!ar(e.id) || !ar(e.formula))
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
    await mn(o);
    const i = {
      ...r.rollRequests[e.id] ?? fn(e, t),
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
function fn(e, t) {
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
function ar(e) {
  return typeof e == "string" && e.length > 0;
}
async function Te(e, t, r, n, o) {
  switch (n) {
    case "spend":
      return r !== "PE" && r !== "PD" ? Ae(t, r, n, o) : e.spend(t, r, o);
    case "damage":
      return r !== "PV" && r !== "SAN" ? Ae(t, r, n, o) : e.damage(t, r, o);
    case "heal":
      return r !== "PV" ? Ae(t, r, n, o) : e.heal(t, r, o);
    case "recover":
      return r !== "SAN" ? Ae(t, r, n, o) : e.recover(t, r, o);
  }
}
function Ae(e, t, r, n) {
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
  const o = Ee(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: pn(t.id, "damage", n, t.damageInstances.length),
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
  const o = Ee(e.amountFrom);
  return {
    id: pn(t.id, "healing", n, t.healingInstances.length),
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
function pn(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function li(e, t, r) {
  const n = Ee(e.amountFrom), o = n ? t.rolls[n] : void 0;
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
  a.emit("beforeApply", r, { stepIndex: n, step: t, metadata: o }), gn("before", e), sr("before", e), sr("resolve", e);
}
function mi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("apply", r, { stepIndex: n, step: t, metadata: o }), gn("apply", e);
}
function fi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", r, { stepIndex: n, step: t, metadata: o });
}
function gn(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t, i = pi(e, r.operation);
  i && s.emit(i, n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function sr(e, t) {
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
  const { context: r, resources: n } = e, o = ke(t, r);
  return o.ok ? hn(await n.spend(r.sourceActor, t.resource, o.value), r) : f(o.error);
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
  }), hn(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function hn(e, t, r) {
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
    const o = fn(t, n);
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
    const o = ke(t, r);
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
      const d = await Te(this.resources, i, t.resource, t.operation, o.value), g = this.handleResourceOperationResult(d, r, n, t);
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
    const o = ke(t, r);
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
      const i = await Te(this.resources, s, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(i, r, n, t);
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
    const { afterValue: d, appliedAmount: g } = i.value, y = {
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
      after: y
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
function yn(e) {
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
    const n = yn(r);
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
    const r = Xe();
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
    const n = Xe();
    if (!n.enabled)
      return;
    const o = r.notification ?? ir(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, o);
  }
  emitConsole(t, r) {
    const n = ir(r);
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
function ir(e) {
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
const Ei = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", An = `${c}-inline-roll-neutralized`, Li = `${c}-inline-roll-notice`, $t = `data-${c}-inline-roll-neutralized`, cr = `data-${c}-inline-roll-notice`, Di = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function lr(e) {
  const t = Gi(e.message), r = await Ni(e.message), n = vi(t);
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
  const t = Hi(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = Oi(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await Vi(t, r.content), replacementCount: r.replacementCount };
}
function vi(e) {
  const t = e ? zi(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = Rn(t);
  return r > 0 && bn(Bi(t)), { replacementCount: r };
}
function Oi(e) {
  const t = Mi(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = Rn(r.content), o = t.replacementCount + n;
  return o === 0 ? { content: e, replacementCount: 0 } : (bn(r.content), { content: r.innerHTML, replacementCount: o });
}
function Mi(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, o) => (t += 1, Ui(o.trim()))), replacementCount: t };
}
function Rn(e) {
  const t = Fi(e);
  for (const r of t)
    r.replaceWith(xi(ji(r)));
  return t.length;
}
function Fi(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(Ei))
    r.getAttribute($t) !== "true" && t.add(r);
  return Array.from(t);
}
function Ui(e) {
  return `<span class="${An}" ${$t}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Wi(e)}</span>`;
}
function xi(e) {
  const t = document.createElement("span");
  return t.classList.add(An), t.setAttribute($t, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function bn(e) {
  if (e.querySelector?.(`[${cr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Li), t.setAttribute(cr, "true"), t.textContent = Di, e.append(t);
}
function Bi(e) {
  return e.querySelector(".message-content") ?? e;
}
function ji(e) {
  const r = e.getAttribute("data-formula") ?? qi(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function qi(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Hi(e) {
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
function zi(e) {
  const t = Ki(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Gi(e) {
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
const ur = "occultism";
function Yi(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Qi(e) {
  const t = Yi(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await Xi(e, ur);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await mn(r);
  const n = ec(r);
  return {
    skill: ur,
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
  return dr(e) ? e : Array.isArray(e) ? e.find(dr) ?? null : null;
}
function dr(e) {
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
      eyebrow: ft,
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
const kn = ["base", "discente", "verdadeiro"];
function Tn(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function we(e) {
  return typeof e == "string" && kn.includes(e);
}
const { ApplicationV2: mc } = foundry.applications.api;
class le extends mc {
  constructor(t, r) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = r, this.model = nc(t), this.selectedVariant = this.model.forms.find((n) => n.checked && n.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
  }
  input;
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
      cast: le.onCast,
      cancel: le.onCancel
    }
  };
  static async request(t) {
    return new Promise((r) => {
      new le(t, r).render({ force: !0 });
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
    }), gc(o, (a) => {
      this.spendResource = a;
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
    const r = Ac(t), n = hc(r, this.spendResource, this.selectedVariant);
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
    o.addEventListener("click", () => mr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), mr(e, o, t));
    });
  const n = wn(e);
  n && t(n);
}
function mr(e, t, r) {
  const n = t.querySelector('input[name="variant"]');
  !n || n.disabled || !we(n.value) || (n.checked = !0, e.dataset.paranormalToolkitSelectedVariant = n.value, r(n.value), n.dispatchEvent(new Event("change", { bubbles: !0 })), wn(e));
}
function wn(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let r = null;
  for (const n of t) {
    const o = n.querySelector('input[name="variant"]'), a = o?.checked === !0;
    n.setAttribute("aria-checked", a ? "true" : "false"), a && we(o.value) && (r = o.value);
  }
  return r && (e.dataset.paranormalToolkitSelectedVariant = r), r;
}
function gc(e, t) {
  const r = e.querySelector('input[name="spendResource"]');
  r && (t(r.checked), r.addEventListener("change", () => {
    t(r.checked);
  }));
}
function hc(e, t, r) {
  const n = yc(e) ?? r, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: n,
    spendResource: o
  };
}
function yc(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (we(t)) return t;
  const r = e?.dataset.paranormalToolkitSelectedVariant;
  return we(r) ? r : null;
}
function Ac(e) {
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
async function Rc(e) {
  return le.request(e);
}
const Ct = {
  label: "Padrão"
}, bc = {
  label: "Discente",
  extraCost: 2
}, kc = {
  label: "Verdadeiro",
  extraCost: 5
};
class Tc {
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
    const n = this.resolveCostPreview(t), o = Zc(r), a = Yc(r, t.item, n, o), s = await Rc({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((C) => C.name),
      cost: n,
      defaultSpendResource: nl(r),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const i = wc(s), d = Jc(r, t.item, i.variant, o), g = Kr();
    let y = null;
    if (g) {
      const C = await Cc(this.resources, t.actor, i, d, n);
      if (!C.ok)
        return {
          status: "failed",
          reason: C.reason,
          message: C.message
        };
      try {
        y = await Qi(t.actor);
      } catch (F) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: F instanceof Error ? F.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: F
        };
      }
      if (!y.success) {
        const F = pr(t, i);
        return {
          status: "completed-without-actions",
          workflowContext: F,
          summaryLines: He(r, i, d, n, F, y, {
            effectStopped: !0
          })
        };
      }
    }
    const R = $c(r, i, d, n, {
      includeCostSteps: !g
    });
    if (R.steps.length === 0) {
      const C = pr(t, i);
      return {
        status: "completed-without-actions",
        workflowContext: C,
        summaryLines: He(r, i, d, n, C, y)
      };
    }
    const b = await this.workflow.runAutomation(R, {
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
    if (!b.ok)
      return {
        status: "failed",
        reason: b.error.reason,
        message: b.error.message,
        cause: b.error
      };
    const k = b.value.context, m = Sc(r, t, k), oe = He(r, i, d, n, k, y);
    return m.ok ? m.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: k,
      summaryLines: oe
    } : {
      status: "ready",
      workflowContext: k,
      actions: m.actions,
      summaryLines: oe
    } : {
      status: "failed",
      reason: m.reason,
      message: m.message
    };
  }
  async applyAction(t) {
    return Te(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function wc(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function $c(e, t, r, n, o) {
  const a = [], s = t.spendResource === !0;
  for (const i of e.steps)
    i.type === "modifyResource" || i.type === "chatCard" || _t(i) && (!o.includeCostSteps || !s) || a.push(_c(i, r));
  return o.includeCostSteps && s && n && ol(r.extraCost) && a.push({
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
async function Cc(e, t, r, n, o) {
  if (r.spendResource !== !0) return { ok: !0 };
  const a = Le(o, n);
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
function _c(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function Sc(e, t, r) {
  const n = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const a = ke(o, r);
    if (!a.ok)
      return {
        ok: !1,
        reason: a.error.reason,
        message: a.error.message
      };
    const s = Mc(o.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(...Ic(e, o, i, a.value));
  }
  return { ok: !0, actions: n };
}
function Ic(e, t, r, n) {
  if (!Dc(e, t))
    return [fr(t, r, n)];
  const o = Oc();
  return $n(e).map((a) => {
    const s = Nc(n, a);
    return fr(t, r, s, {
      option: a,
      choiceGroupId: o
    });
  });
}
function fr(e, t, r, n) {
  const o = t.name ?? "Ator sem nome", a = Lc(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: Pc(e, o, r, n?.option),
    executedLabel: Ec(e, o, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function Pc(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function Ec(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Lc(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Dc(e, t) {
  return t.operation === "damage" && t.resource === "PV" && $n(e).length > 1;
}
function $n(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Nc(e, t) {
  const r = e * t.multiplier, n = vc(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function vc(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Oc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Mc(e, t) {
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
    `Forma: ${Tn(t.variant)}`,
    Uc(t, r, n),
    ...Fc(a),
    ...i ? [] : Object.values(o.rolls).flatMap(xc),
    ...i ? [] : Bc(e.resistance),
    ...Wc(r),
    ...i ? ["Observação: O efeito do ritual não foi resolvido porque a conjuração falhou."] : []
  ];
}
function Fc(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Uc(e, t, r) {
  const n = Le(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function xc(e) {
  const r = [`${Kc(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = jc(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${Gc(e.damageType)}`), r;
}
function Bc(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function jc(e) {
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
    const s = qc(a);
    s && (zc(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function qc(e) {
  const t = Hc(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Vc(e);
}
function Hc(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function Vc(e) {
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
function zc(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function Gc(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Wc(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Kc(e) {
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
function Yc(e, t, r, n) {
  return kn.map((o) => {
    const a = Cn(e, t, o, n), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? Tn(o),
      enabled: s,
      details: a ? Qc(a, r, n) : [],
      finalCostText: a ? Xc(r, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function Qc(e, t, r) {
  const n = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? n.push(o.join(", ")) : r && n.push("efeito manual");
  const a = Le(t, e);
  return n.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), n;
}
function Le(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function Xc(e, t) {
  const r = Le(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function Zc(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(_t);
}
function pr(e, t) {
  return yn({
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
function Jc(e, t, r, n) {
  return Cn(e, t, r, n) ?? Ct;
}
function Cn(e, t, r, n) {
  const o = e.ritualForms?.[r] ?? null;
  return o || (n ? tl(t, r) ? el(r) : null : r === "base" ? Ct : null);
}
function el(e) {
  switch (e) {
    case "base":
      return Ct;
    case "discente":
      return bc;
    case "verdadeiro":
      return kc;
  }
}
function tl(e, t) {
  if (t === "base") return !0;
  const r = t === "discente" ? "system.studentForm" : "system.trueForm";
  return rl(foundry.utils.getProperty(e, r));
}
function rl(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function nl(e) {
  return e.steps.some(_t);
}
function _t(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function ol(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function al(e, t) {
  const r = await sl(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: cl(r),
    total: ll(r),
    diceBreakdown: ul(r)
  };
}
function _n(e) {
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
async function sl(e, t) {
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
  return il(n);
}
function il(e) {
  return gr(e) ? e : Array.isArray(e) ? e.find(gr) ?? null : null;
}
function gr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function cl(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function ll(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function ul(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(dl);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function dl(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Sn = "itemUsePrompts", In = "chatCard", De = "data-paranormal-toolkit-prompt-id", Ne = "data-paranormal-toolkit-pending-id", St = "data-paranormal-toolkit-executed-label", ot = "data-paranormal-toolkit-choice-group", Pn = "data-paranormal-toolkit-skipped-label", hr = "data-paranormal-toolkit-action-section", yr = "data-paranormal-toolkit-detail-key", Ar = "data-paranormal-toolkit-roll-card", It = "data-paranormal-toolkit-roll-detail-toggle", En = "data-paranormal-toolkit-roll-detail-id", Ln = "data-paranormal-toolkit-resistance-roll-button", Dn = "data-paranormal-toolkit-resistance-skill", Nn = "data-paranormal-toolkit-resistance-skill-label", vn = "data-paranormal-toolkit-resistance-target-actor-id", On = "data-paranormal-toolkit-resistance-target-name", Mn = "data-paranormal-toolkit-resistance-roll-result", Rr = "data-paranormal-toolkit-system-card-replaced", ml = `[${Ne}]`, fl = `[${It}]`, pl = `[${Ln}]`, at = `${c}-chat-enrichment`, p = `${c}-item-use-prompt`, gl = `${p}__actions`, br = `${p}__details`, Fn = `${p}__summary`, hl = `${p}__title`, Un = `${p}__button--executed`, kr = `${p}__roll-card`;
let Tr = !1, st = null;
const P = /* @__PURE__ */ new Map(), yl = [0, 100, 500, 1500, 3e3], Al = 3e4, Rl = [0, 100, 500, 1500, 3e3];
function bl(e) {
  if (st = e, Tr) {
    $r(e);
    return;
  }
  const t = (r, n) => {
    Bn(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Tr = !0, $r(e);
}
async function wr(e) {
  const t = xn(e);
  P.set(e.pendingId, t), await Lt(t) || Qn(t), jn(e.pendingId);
}
async function kl(e) {
  const t = xn({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await Lt(t) || Qn(t), jn(e.pendingId);
}
async function Ve(e, t) {
  const r = P.get(e);
  P.delete(e), r && await bu(r, t);
}
function Pt(e) {
  const t = ro();
  for (const r of t) {
    const n = M(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function Tl(e, t) {
  const r = Pt(e);
  if (!r) return;
  const n = M(r.message), o = n[e];
  o && (n[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await re(r.message, n));
}
async function wl(e, t, r) {
  if (!t) return;
  const n = Pt(e);
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
function xn(e) {
  const t = B(e.context.message), r = e.context.targets.find((s) => ut(s)), n = r ? ut(r) : null, o = e.resistanceTargetActor ?? n, a = e.resistanceTargetName ?? r?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Yl(e.context),
    executed: !1
  };
}
function Bn(e, t, r) {
  Ru();
  const n = Oe(t);
  if (!n) return;
  const o = hu(e, n);
  o.length > 0 && $e(n);
  for (const a of o)
    it(n, a);
  Vn(n, r), ct(n), lt(n);
}
function $r(e) {
  for (const t of Rl)
    globalThis.setTimeout(() => {
      $l(e);
    }, t);
}
function $l(e) {
  for (const t of Cl()) {
    const r = ve(t);
    _l(r) && Bn(r, t, e);
  }
}
function Cl() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function _l(e) {
  return e ? Dt(e) ? !0 : Tu(e).length > 0 : !1;
}
function jn(e) {
  const t = P.get(e);
  if (!t) return;
  const r = t.messageId ? yu(t.messageId) : null;
  if (r) {
    Pr(r, t), $e(r), it(r, t), Cr(r), ct(r), lt(r);
    return;
  }
  if (t.messageId) {
    mt(t);
    return;
  }
  const n = Au(t);
  if (n) {
    Pr(n, t), $e(n), it(n, t), Cr(n), ct(n), lt(n);
    return;
  }
  mt(t);
}
function Cr(e) {
  st && Vn(e, st);
}
function $e(e) {
  const t = Sl();
  e.classList.toggle(`${p}--system-card-replaced`, t);
  const r = Hn(e);
  if (!r || (r.classList.toggle(`${p}__host--system-card-replaced`, t), !t) || r.getAttribute(Rr) === "true") return;
  const n = r.querySelector(`.${at}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(Rr, "true");
}
function Sl() {
  try {
    return na() === "replace";
  } catch {
    return !1;
  }
}
function it(e, t) {
  if ($e(e), e.querySelector(`[${De}="${ne(t.pendingId)}"]`)) return;
  const r = Il(e, t);
  El(r, t), Vl(r, zl(t)).append(Kl(t));
}
function Il(e, t) {
  const r = e.querySelector(`.${at}`);
  if (r)
    return r;
  const n = document.createElement("section");
  n.classList.add(at, p);
  const o = document.createElement("header");
  o.classList.add(`${p}__header`);
  const a = document.createElement("span");
  a.classList.add(`${p}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(hl), s.textContent = Pl(t);
  const i = document.createElement("span");
  return i.classList.add(Fn), i.textContent = t.summary, o.append(a, s, i), n.append(o), Xl(e).append(n), n;
}
function Pl(e) {
  const t = $(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function El(e, t) {
  const r = t.summaryLines ?? [], n = Kn(r, t);
  if (n) {
    Ll(e, n, t);
    return;
  }
  Gl(e, r);
}
function Ll(e, t, r) {
  if (e.querySelector(`[${Ar}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(kr, `${kr}--${t.intent}`), n.setAttribute(Ar, "true"), t.castingCheck && _r(n, Nl(t.castingCheck), r.pendingId, "casting"), Dl(t) && _r(n, vl(t), r.pendingId, "effect"), xl(n, t), Bl(n, t, r), Hl(n, t), e.append(n);
}
function Dl(e) {
  return e.intent !== "casting";
}
function Nl(e) {
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
function vl(e) {
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
function _r(e, t, r, n) {
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
  Ol(o, t), ql(o, t.detailRows, r, n, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Ol(e, t) {
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-roll`);
  const n = document.createElement("span");
  n.classList.add(`${p}__workflow-roll-formula`), n.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${p}__workflow-roll-total`), o.textContent = String(t.total), r.append(n, o);
  const a = Ml(t.formula, t.diceBreakdown);
  a && r.append(a), e.append(r);
}
function Ml(e, t) {
  const r = Fl(t);
  if (r.length === 0) return null;
  const n = document.createElement("div");
  n.classList.add(`${p}__workflow-dice-tray`);
  for (const o of Ul(r, e)) {
    const a = document.createElement("span");
    a.classList.add(`${p}__workflow-die`), o.active || a.classList.add(`${p}__workflow-die--inactive`), a.textContent = String(o.value), n.append(a);
  }
  return n;
}
function Fl(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((n) => Number(n.trim())).filter((n) => Number.isFinite(n)).map((n) => Math.trunc(n)) : [];
}
function Ul(e, t) {
  if (e.length <= 1) return e.map((n) => ({ value: n, active: !0 }));
  const r = t.toLowerCase();
  return r.includes("kh") ? Sr(e, "highest") : r.includes("kl") ? Sr(e, "lowest") : e.map((n) => ({ value: n, active: !0 }));
}
function Sr(e, t) {
  const r = t === "highest" ? Math.max(...e) : Math.min(...e);
  let n = !1;
  return e.map((o) => {
    const a = !n && o === r;
    return a && (n = !0), { value: o, active: a };
  });
}
function xl(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(Bu);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__roll-meta`);
  for (const o of r) {
    const a = document.createElement("span");
    a.classList.add(`${p}__roll-meta-pill`), a.textContent = o, n.append(a);
  }
  e.append(n);
}
function Bl(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${p}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = jl(t, r);
  o.append(a), s && o.append(s);
  const i = document.createElement("span");
  i.classList.add(`${p}__resistance-description`), i.textContent = t.resistance, n.append(o, i), t.resistanceRollResult && n.append(qn(t.resistanceRollResult)), e.append(n);
}
function jl(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${p}__resistance-roll-button`), r.setAttribute(De, t.pendingId), r.setAttribute(Ln, "true"), r.setAttribute(Dn, e.resistanceSkill), r.setAttribute(Nn, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(vn, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(On, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${p}__resistance-roll-button--rolled`), r.setAttribute(Mn, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${p}__resistance-roll-fallback`), o.textContent = "d20", r.append(n, o), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function qn(e) {
  const t = document.createElement("span");
  return t.classList.add(`${p}__resistance-roll-result`), t.textContent = Gn(e), t;
}
function ql(e, t, r, n, o) {
  const a = t.filter((g) => g.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${r}-roll-details-${n}`, i = document.createElement("button");
  i.type = "button", i.classList.add(`${p}__roll-detail-toggle`), i.setAttribute(It, s), i.setAttribute("aria-expanded", "false"), i.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${p}__roll-detail-list`), d.setAttribute(En, s), d.hidden = !0;
  for (const g of a) {
    const y = document.createElement("dt");
    y.textContent = g.label;
    const R = document.createElement("dd");
    R.textContent = g.value, d.append(y, R);
  }
  e.append(i, d);
}
function Hl(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-notes`);
  for (const n of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = n, r.append(o);
  }
  e.append(r);
}
function Vl(e, t) {
  const r = `[${hr}="${ne(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const o = document.createElement("div");
  o.classList.add(gl), o.setAttribute(hr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${p}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function zl(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = Kn(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Gl(e, t) {
  if (t.length === 0) return;
  const r = Wl(e);
  for (const n of t) {
    const o = ju(n);
    if (r.querySelector(`[${yr}="${ne(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = n, a.setAttribute(yr, o), r.append(a);
  }
}
function Wl(e) {
  const t = e.querySelector(`.${br}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(br), e.append(r), r;
}
function Kl(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${p}__button`), t.setAttribute(De, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Un), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Ne, e.pendingId), t.setAttribute(St, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(ot, e.choiceGroupId), t.setAttribute(Pn, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Yl(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = Ql(e);
  return `${t} → ${r}`;
}
function Ql(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Xl(e) {
  return Hn(e) ?? e;
}
function Hn(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Vn(e, t) {
  const r = Oe(e);
  if (!r) return;
  const n = r.querySelectorAll(ml);
  for (const o of n)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      du(o, t);
    }));
}
function ct(e) {
  const t = Oe(e);
  if (!t) return;
  const r = t.querySelectorAll(fl);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      Zl(t, n);
    }));
}
function lt(e) {
  const t = Oe(e);
  if (!t) return;
  const r = t.querySelectorAll(pl);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      Jl(t, n);
    }));
}
function Zl(e, t) {
  const r = t.getAttribute(It);
  if (!r) return;
  const n = e.querySelector(`[${En}="${ne(r)}"]`);
  if (!n) return;
  const o = n.hidden;
  n.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Jl(e, t) {
  const r = t.getAttribute(De), n = t.getAttribute(Dn), o = t.getAttribute(Nn) ?? (n ? _n(n) : "Resistência");
  if (!r || !n) return;
  const a = ru(e, r), s = nu(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await al(s, n);
    await cu(d.roll);
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
    eu(t, g), tu(t, g), lu(r, g), await uu(e, r, g);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function eu(e, t) {
  e.classList.add(`${p}__resistance-roll-button--rolled`), e.setAttribute(Mn, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function tu(e, t) {
  const r = e.closest(`.${p}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${p}__resistance-roll-result`), o = n ?? qn(t);
  if (n) {
    n.textContent = Gn(t);
    return;
  }
  r.append(o);
}
function ru(e, t) {
  const r = P.get(t);
  if (r) return r;
  const n = ve(e);
  return M(n)[t] ?? null;
}
function nu(e, t) {
  const r = e?.resistanceTargetActor;
  if (N(r)) return r;
  const o = e?.context?.targets.map(ut).find(N) ?? null;
  if (o) return o;
  const a = t.getAttribute(vn) ?? e?.resistanceTargetActorId ?? null, s = a ? au(a) : null;
  return s || su(
    t.getAttribute(On) ?? e?.resistanceTargetName ?? ou(t)
  );
}
function ou(e) {
  const r = e.closest(`.${p}`)?.querySelector(`.${Fn}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const o = r.split(n), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function ut(e) {
  const t = e.actor;
  if (N(t)) return t;
  const r = e.token, n = de(r);
  if (n) return n;
  const o = e.document;
  return de(o);
}
function de(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (N(t)) return t;
  const r = e.document?.actor;
  return N(r) ? r : null;
}
function au(e) {
  const r = game.actors?.get?.(e);
  return N(r) ? r : zn().map((a) => de(a)).find((a) => a?.id === e) ?? null;
}
function su(e) {
  const t = Z(e);
  if (!t) return null;
  const r = zn().filter((a) => Z(iu(a)) === t).map((a) => de(a)).find(N) ?? null;
  if (r) return r;
  const o = game.actors?.find?.((a) => N(a) && Z(a.name) === t);
  return N(o) ? o : null;
}
function zn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function iu(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : de(e)?.name ?? null;
}
function Z(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function N(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Gn(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function cu(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function lu(e, t) {
  const r = P.get(e);
  r && (r.resistanceRollResult = t);
}
async function uu(e, t, r) {
  const n = ve(e);
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
function ve(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return O(n?.get?.(r));
}
async function du(e, t) {
  const r = e.getAttribute(Ne);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    Wn(e, e.getAttribute(St) ?? "✓ Automação aplicada"), mu(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function Wn(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Un), e.removeAttribute(Ne), e.removeAttribute(St);
}
function mu(e) {
  const t = e.getAttribute(ot);
  if (!t) return;
  const r = e.closest(`.${p}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${ot}="${ne(t)}"]`;
  for (const o of r.querySelectorAll(n)) {
    if (o === e) continue;
    const a = o.getAttribute(Pn) ?? "✓ Outra opção escolhida";
    Wn(o, a);
  }
}
function Kn(e, t) {
  const r = e.map(Et).filter(Uu), n = r.find((m) => m.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const o = $(e, "Forma"), a = $(e, "Custo"), s = $(e, "Dados") ?? $(e, `Dados (${n.label})`), i = $(e, "Tipo"), d = $(e, "Resistência"), g = $(e, "Resistência Perícia"), y = $(e, "Resistência Rótulo") ?? (g ? _n(g) : null), R = Yn(e, "Observação"), b = e.filter((m) => gu(m, n)), k = fu(e);
  return {
    ...n,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: s,
    damageType: i,
    resistance: d,
    resistanceSkill: g,
    resistanceSkillLabel: y,
    notes: R,
    details: b,
    castingCheck: k,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function fu(e) {
  const t = e.map(Et).find((a) => a?.intent === "casting") ?? null, r = $(e, "Conjuração DT"), n = $(e, "Conjuração Resultado");
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
function Et(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, n, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: r,
    formula: n,
    total: a,
    intent: pu(r)
  } : null;
}
function pu(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function $(e, t) {
  return Yn(e, t)[0] ?? null;
}
function Yn(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const o = n.slice(r.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function gu(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Et(e) ? !1 : e.trim().length > 0;
}
function hu(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of P.values())
    dt(n, e, t) && r.set(n.pendingId, n);
  for (const n of ku(e))
    dt(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, o) => n.createdAt - o.createdAt);
}
function dt(e, t, r) {
  const n = B(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !Ir(r, "itemId", e.itemId) ? !1 : !e.actorId || Ir(r, "actorId", e.actorId);
}
function Ir(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${qu(t)}`;
  for (const o of e.querySelectorAll(`[${n}]`))
    if (o.getAttribute(n) === r)
      return !0;
  return !1;
}
function yu(e) {
  const t = ne(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Au(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (dt(e, null, t))
      return t;
  return null;
}
function Ru() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of P.entries())
    e - n.createdAt > t && P.delete(r);
}
async function Pr(e, t) {
  const r = ve(e);
  if (!r) return !1;
  try {
    const n = M(r);
    return n[t.pendingId] = Nt(t, B(r)), await re(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function Lt(e) {
  const t = Jn(e);
  if (!t) return !1;
  try {
    const r = M(t);
    return r[e.pendingId] = Nt(e, B(t)), await re(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function Qn(e) {
  for (const t of yl)
    globalThis.setTimeout(() => {
      mt(e);
    }, t);
}
async function mt(e) {
  const t = Jn(e);
  if (Dt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const n = await Lt(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function bu(e, t) {
  const r = Zn(e.context.message);
  if (r)
    try {
      const n = M(r), o = n[e.pendingId] ?? Nt(e, B(r));
      n[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await re(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function ku(e) {
  return Object.values(M(O(e))).filter(pe);
}
function M(e) {
  if (!e) return {};
  const t = {}, r = Dt(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, o] of Object.entries(Xn(e)))
    t[n] ??= o;
  return t;
}
function Tu(e) {
  return Object.values(Xn(O(e))).filter(pe);
}
function Xn(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, Sn);
  if (!J(t))
    return {};
  const r = {};
  for (const [n, o] of Object.entries(t))
    pe(o) && (r[n] = o);
  return r;
}
async function re(e, t) {
  typeof e.setFlag == "function" && (await $u(e, t), await wu(e, t));
}
async function wu(e, t) {
  await Promise.resolve(e.setFlag?.(c, Sn, t));
}
function Dt(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, In);
  return Mu(t) ? t : null;
}
async function $u(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(pe).sort((a, s) => a.createdAt - s.createdAt);
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
      actorName: Cu(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(c, In, o));
}
function Cu(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function Nt(e, t) {
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
function Zn(e) {
  const t = O(e);
  if (t?.setFlag)
    return t;
  const r = _u(e);
  if (r?.setFlag)
    return r;
  const n = B(e);
  if (!n) return null;
  const o = game.messages;
  return O(o?.get?.(n));
}
function _u(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(O).find((r) => typeof r?.setFlag == "function") ?? null;
}
function Jn(e) {
  const t = Zn(e.context.message);
  if (t) return t;
  const r = e.messageId ? Su(e.messageId) : null;
  if (r) return r;
  const n = ro().slice().reverse();
  return n.find((o) => Iu(o, e)) ?? n.find((o) => Pu(o, e)) ?? null;
}
function Su(e) {
  const t = game.messages;
  return O(t?.get?.(e));
}
function Iu(e, t) {
  const r = B(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!eo(e, t)) return !1;
  const o = to(e);
  return !t.actorId || !o || o === t.actorId;
}
function Pu(e, t) {
  if (!Lu(e, t)) return !1;
  const r = to(e);
  return t.actorId && r === t.actorId ? !0 : eo(e, t);
}
function eo(e, t) {
  const r = Z(Eu(e));
  if (!r) return !1;
  const n = Z(t.itemName);
  if (n && r.includes(n)) return !0;
  const o = Z(t.itemId);
  return !!(o && r.includes(o));
}
function Eu(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function to(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Lu(e, t) {
  const r = Du(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= Al;
}
function Du(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function O(e) {
  return e && typeof e == "object" ? e : null;
}
function pe(e) {
  return J(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && _(e.messageId) && _(e.itemId) && _(e.actorId) && _(e.itemName) && z(e.resistanceTargetActorId) && z(e.resistanceTargetName) && Fu(e.resistanceRollResult) && Nu(e.actionPayload) && ze(e.title) && ze(e.buttonLabel) && ze(e.executedLabel) && z(e.choiceGroupId) && z(e.skippedLabel) && z(e.actionSectionId) && z(e.actionSectionTitle) && xu(e.summaryLines) : !1;
}
function Nu(e) {
  return e == null ? !0 : J(e) ? e.kind === "resource-operation" && _(e.actorId) && _(e.actorUuid) && typeof e.actorName == "string" && vu(e.resource) && Ou(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function vu(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ou(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Mu(e) {
  return J(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && _(e.messageId) && J(e.source) && _(e.source.actorId) && _(e.source.actorName) && _(e.source.itemId) && _(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(pe) : !1;
}
function Fu(e) {
  return e == null ? !0 : J(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Uu(e) {
  return e !== null;
}
function J(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function _(e) {
  return e === null || typeof e == "string";
}
function ze(e) {
  return e === void 0 || typeof e == "string";
}
function z(e) {
  return e == null || typeof e == "string";
}
function xu(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function Bu(e) {
  return typeof e == "string" && e.length > 0;
}
function ro() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(O).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(O).filter((n) => n !== null) : [];
}
function Oe(e) {
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
function ju(e) {
  return e.trim().toLowerCase();
}
function qu(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ne(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Er = 1e3;
class Hu {
  constructor(t, r, n, o) {
    this.workflow = t, this.resources = r, this.debugOutput = o, this.ritualAssistant = new Tc(t, r, n);
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
      settings: jt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = jt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = pt(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && Vu(t.item) && r.executionMode === "ask") {
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
    if (await lr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: We(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await Ve(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const n = await this.ritualAssistant.applyAction(r.action);
    return n.ok ? (r.workflowContext.resourceTransactions.push(n.value), this.pendingExecutions.delete(t), await Ve(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(n), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = Pt(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, o = Wu(n);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const a = await Te(this.resources, o, n.resource, n.operation, n.amount);
    return a.ok ? (await Tl(t), await wl(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (bl((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await lr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: We(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, zu(t.item));
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
      a.kind === "resource-action" && (this.pendingExecutions.delete(o), await Ve(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, r) {
    const n = Ke();
    await kl({
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
      const i = Ke();
      a ??= i, this.pendingExecutions.set(i, {
        kind: "resource-action",
        id: i,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await wr({
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
        actionPayload: Gu(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), l.info("Ritual assistido preparado com ações pendentes.", W(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = Ke();
    this.pendingExecutions.set(n, {
      kind: "workflow",
      id: n,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await wr({
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
    const r = Date.now(), n = Lr(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      r - s > Er && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(n);
    return o !== void 0 && r - o <= Er;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Lr(t), Date.now());
  }
  setAttempt(t, r, n, o) {
    this.lastAttempt = We(t, r, n, o);
  }
}
function Vu(e) {
  return e.type === "ritual";
}
function zu(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Gu(e) {
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
function Wu(e) {
  const t = e.actorUuid ? Ku(e.actorUuid) : null;
  if (ee(t)) return t;
  const r = e.actorId ? Yu(e.actorId) : null;
  return r || Qu(e.actorName);
}
function Ku(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Yu(e) {
  const r = game.actors?.get?.(e);
  if (ee(r)) return r;
  for (const n of no()) {
    const o = vt(n);
    if (o?.id === e) return o;
  }
  return null;
}
function Qu(e) {
  const t = Ge(e);
  if (!t) return null;
  for (const o of no()) {
    const a = Xu(o);
    if (Ge(a) === t) {
      const s = vt(o);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((o) => ee(o) && Ge(o.name) === t);
  return ee(n) ? n : null;
}
function no() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Xu(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : vt(e)?.name ?? null;
}
function vt(e) {
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
function We(e, t, r, n) {
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
function Lr(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function Ke() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Zu {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], o = [], a = fe(t);
    for (const s of r) {
      const i = s.itemId ? a.find((y) => y.id === s.itemId) ?? null : null, d = s.match?.preset ?? null;
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
class Ju {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = fe(t).map((i) => this.analyzeRitual(i)), n = r.filter(Re("upToDate")), o = r.filter(Re("available")), a = r.filter(Re("outdated")), s = r.filter(Re("unsupported"));
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
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = ed(t);
    return r ? n ? n.source.type !== "preset" ? ae({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Automação manual encontrada. Preset sugerido: ${r.preset.label}.`
    }) : n.source.presetId === r.preset.id && n.source.presetVersion === r.preset.version ? ae({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Preset ${r.preset.label} v${r.preset.version} já aplicado.`
    }) : ae({
      ritual: t,
      status: "outdated",
      match: r,
      flag: n,
      reason: td(n, r.preset)
    }) : ae({
      ritual: t,
      status: "available",
      match: r,
      flag: n,
      reason: `Preset encontrado: ${r.preset.label}.`
    }) : ae({
      ritual: t,
      status: "unsupported",
      match: r,
      flag: n,
      reason: n ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function ae(e) {
  const t = e.flag?.source, r = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? Se(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function ed(e) {
  const t = e.getFlag(c, "automation");
  return gt(t) ? t : null;
}
function td(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Re(e) {
  return (t) => t.status === e;
}
class rd {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), n = yt(t.transaction);
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
    const r = A(t.actorName), n = A(t.resource), o = A(Dr(t)), a = A(od(t));
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
    const n = A(r.title ?? "Automação"), o = r.message ? `<p>${A(r.message)}</p>` : "", a = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = A(t.item.name ?? "Item sem nome"), i = t.targets.length > 0 ? t.targets.map((m) => A(m.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (m) => `<li><strong>${A(m.id)}:</strong> ${A(m.formula)} = ${m.total} <em>(${A(nd(m.intent))})</em>${m.damageType ? ` — ${A(m.damageType)}` : ""}</li>`
    ), g = t.ritualCosts.map(
      (m) => `<li><strong>${A(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${A(m.resource)} (${A(ad(m.source))})</li>`
    ), y = t.damageInstances.map(
      (m) => `<li><strong>${A(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${A(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), R = t.healingInstances.map(
      (m) => `<li><strong>${A(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), b = t.resourceTransactions.map(
      (m) => `<li><strong>${A(m.actorName)}:</strong> ${A(Dr(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), k = t.phases.map((m) => A(m)).join(" &rarr; ");
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
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Cura:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${b.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${k}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function nd(e) {
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
function Dr(e) {
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
function od(e) {
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
function ad(e) {
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
function sd() {
  const e = new Is(), t = new wi(e), r = new Ls(), n = new vs(r), o = new Ks(e), a = new Qs(), s = a.registerMany(Mo());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new Ys(), d = new Gs(), g = new Ju(a), y = new Zu(g, i, d), R = new Si(), b = new rd(R), k = new _i(), m = new ki(t, n, b, k), oe = new Ci(m, k), C = new Hu(oe, t, n, R);
  return C.addStrategy(new Vs((F) => C.handleItemUsed(F))), {
    ordem: o,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: n,
    resources: t,
    automationRegistry: a,
    automationBinder: i,
    itemPatches: d,
    debugOutput: R,
    chatMessages: b,
    workflowHooks: k,
    automation: m,
    workflow: oe,
    itemUseIntegration: C,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: y
  };
}
const { ApplicationV2: id } = foundry.applications.api;
class Ce extends id {
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
      apply: Ce.onApply,
      cancel: Ce.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${E(ft)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${E(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Ye("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Ye("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Ye("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Ye(e, t, r, n) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${n}"></i>
        <span>${E(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? cd(r) : ud(t)}
    </section>
  `;
}
function cd(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(ld).join("")}</ol>`;
}
function ld(e) {
  const t = e.preset, r = t ? `${t.label} v${t.version}` : "Sem preset", n = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${E(e.appliedPresetId)} v${E(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${E(e.itemName)}</strong>
        <span>${E(e.reason)}</span>
        ${n}
      </div>
      <em>${E(r)}</em>
    </li>
  `;
}
function ud(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${E({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function E(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const _e = `${c}.manageRitualPresets`, Nr = `__${c}_ritualPresetHeaderControlRegistered`, dd = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function md(e) {
  const t = globalThis;
  if (!t[Nr]) {
    for (const r of dd)
      Hooks.on(r, (n, o) => {
        fd(n, o, e);
      });
    t[Nr] = !0, l.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function fd(e, t, r) {
  Array.isArray(t) && gd(e) && (pd(e, r), !t.some((n) => n.action === _e) && t.push({
    action: _e,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), oo(e, r);
    }
  }));
}
function pd(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[_e] && (e.options.actions[_e] = (r) => {
    r.preventDefault(), r.stopPropagation(), oo(e, t);
  }));
}
function gd(e) {
  if (!game.user?.isGM) return !1;
  const t = ao(e);
  return t ? t.type === "agent" && fe(t).length > 0 : !1;
}
function oo(e, t) {
  const r = ao(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Ce(r, t).render({ force: !0 });
}
function ao(e) {
  return vr(e.actor) ? e.actor : vr(e.document) ? e.document : null;
}
function vr(e) {
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
  Y = sd(), Y.itemUseIntegration.registerStrategies(), da(Y), Ta(), Aa(), md(Y), l.info("Inicializado para o sistema Ordem Paranormal."), l.info(`API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${ft} inicializado.`);
});
function hd() {
  if (!Y)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Y;
}
export {
  hd as getToolkitServices
};
//# sourceMappingURL=main.js.map
