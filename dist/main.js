const u = "paranormal-toolkit", tt = "Paranormal Toolkit", Fn = "ordemparanormal";
class oe {
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
class c {
  static info(t, ...r) {
    console.log(`${u} | ${t}`, ...r);
  }
  static warn(t, ...r) {
    console.warn(`${u} | ${t}`, ...r);
  }
  static error(t, ...r) {
    console.error(`${u} | ${t}`, ...r);
  }
}
function g(e) {
  return { ok: !0, value: e };
}
function m(e) {
  return { ok: !1, error: e };
}
function rt(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? m({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : nt(t) ? g(t.definition) : m({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Un(e) {
  return nt(e.getFlag(u, "automation"));
}
function nt(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && jn(t.source) && Bn(t.definition);
}
function Bn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && C(t.label) && Array.isArray(t.steps) && t.steps.every(xn);
}
function jn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? C(t.presetId) && C(t.presetVersion) && C(t.appliedAt) : t.type === "manual" ? C(t.label) && C(t.appliedAt) : !1;
}
function xn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Hn(t);
    case "spendRitualCost":
      return Vn(t);
    case "rollFormula":
      return Gn(t);
    case "modifyResource":
      return qn(t);
    case "chatCard":
      return Wn(t);
    default:
      return !1;
  }
}
function Hn(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && gr(t);
}
function Vn(e) {
  return e.type === "spendRitualCost";
}
function Gn(e) {
  const t = e;
  return t.type === "rollFormula" && C(t.id) && C(t.formula) && (t.intent === void 0 || Qn(t.intent)) && (t.damageType === void 0 || C(t.damageType));
}
function qn(e) {
  const t = e;
  return t.type === "modifyResource" && zn(t.actor) && Kn(t.resource) && Yn(t.operation) && gr(t);
}
function Wn(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function gr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || C(e.amountFrom);
}
function zn(e) {
  return e === "self" || e === "target";
}
function Kn(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Yn(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Qn(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function C(e) {
  return typeof e == "string" && e.length > 0;
}
function ot(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(bt);
    if (Jn(t))
      return Array.from(t).filter(bt);
  }
  return [];
}
function Xn(e) {
  return ot(e)[0] ?? null;
}
function Zn(e) {
  return ot(e).find(Un) ?? null;
}
function Jn(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function bt(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ae(e) {
  return ot(e).filter((t) => t.type === "ritual");
}
function hr(e) {
  return ae(e)[0] ?? null;
}
function eo(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(ye);
      return c.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = J("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = ie(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(wt);
      return c.info(`Presets encontrados para ${r.name}.`, n), n;
    },
    async applyPresetToFirstRitual(t) {
      const r = J("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const n = ie(r);
      if (!n) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        c.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await Be(e, n, o.value);
      c.info(`Preset ${o.value.id} aplicado em ${n.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = J("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = ie(t);
      if (!r) return;
      const n = e.automationRegistry.findForItem(r)[0];
      if (!n) {
        c.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const o = await Be(e, r, n.preset);
      c.info(`Melhor preset aplicado em ${r.name}.`, { match: wt(n), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return kt(e);
    },
    async applyBestPresetsToActorRituals() {
      return kt(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = J("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = ie(t);
      r && (await e.automationBinder.clear(r), c.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function kt(e) {
  const t = J("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = ae(t);
  if (r.length === 0)
    return c.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Tt(t);
  const n = Tt(t, r.length);
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
    const s = await Be(e, o, a.preset);
    n.applied.push(to(o, a, s));
  }
  return c.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), ro(n), n;
}
async function Be(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function to(e, t, r) {
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
function Tt(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function ro(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((n) => n.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function wt(e) {
  return {
    preset: ye(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function J(e) {
  const t = oe.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ie(e) {
  const t = hr(e);
  return t || (c.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function H(e) {
  return e ? {
    id: e.id,
    source: {
      ...no(e.sourceActor),
      token: e.sourceToken
    },
    item: oo(e.item),
    targets: e.targets.map(ao),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: $t(e.rollRequests, yr),
    rolls: $t(e.rolls, so),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(at),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function at(e) {
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
function no(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function oo(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function ao(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function yr(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function so(e) {
  return {
    ...yr(e),
    total: e.total
  };
}
function $t(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function io(e) {
  return {
    getSelected() {
      return oe.getSelectedActor();
    },
    logResources() {
      const t = F(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const r = e.ordem.getActorSnapshot(t);
      c.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && c.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(t) {
      await V(
        e,
        "Gasto de PE",
        F("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await V(
        e,
        "Gasto de PD",
        F("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await V(
        e,
        "Dano em PV",
        F("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await V(
        e,
        "Cura de PV",
        F("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await V(
        e,
        "Dano em SAN",
        F("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await V(
        e,
        "Recuperação de SAN",
        F("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function V(e, t, r, n) {
  if (!r) return;
  const o = await n(r);
  if (!o.ok) {
    co(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    c.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  c.info(`${t} realizado:`, at(a));
}
function F(e) {
  const t = oe.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function co(e) {
  if (e.reason === "update-failed") {
    c.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    c.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  c.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const E = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function uo() {
  ce(E.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), ce(E.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), ce(E.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), ce(E.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function je() {
  return {
    enabled: ue(E.enabled),
    console: ue(E.console),
    ui: ue(E.ui),
    chat: ue(E.chat)
  };
}
async function v(e, t) {
  await game.settings.set(u, E[e], t);
}
function ce(e, t) {
  game.settings.register(u, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function ue(e) {
  return game.settings.get(u, e) === !0;
}
function lo() {
  return {
    status() {
      return je();
    },
    async enable() {
      await v("enabled", !0);
    },
    async disable() {
      await v("enabled", !1);
    },
    async enableConsole() {
      await v("console", !0);
    },
    async disableConsole() {
      await v("console", !1);
    },
    async enableUi() {
      await v("ui", !0);
    },
    async disableUi() {
      await v("ui", !1);
    },
    async enableChat() {
      await v("chat", !0);
    },
    async disableChat() {
      await v("chat", !1);
    }
  };
}
const Ar = "ritual.costOnly", Rr = "ritual.simpleHealing", mo = "ritual.eletrocussao", br = "ritual.simpleDamage", kr = "generic.simpleHealing", Tr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function fo() {
  return [
    po(),
    go(),
    ho(),
    yo(),
    Ao()
  ];
}
function po() {
  return {
    id: Ar,
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
function go() {
  return {
    id: Rr,
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
    automation: wr(),
    itemPatch: bo()
  };
}
function ho() {
  return {
    id: mo,
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
    automation: Ro(),
    itemPatch: ko()
  };
}
function yo() {
  return {
    id: br,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: st()
  };
}
function Ao() {
  return {
    id: kr,
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
function wr(e = "2d8+2") {
  return $r(
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
function Ro() {
  return {
    ...st("1d8", {
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
function st(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return $r(
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
function bo() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Tr,
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
function ko() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Tr,
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
function $r(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((n) => n.type !== "rollFormula" || n.id !== t ? n : {
      ...n,
      formula: r
    })
  };
}
function it() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: q(t.id),
    actorId: q(t.actor?.id),
    sceneId: q(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Cr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: q(e.id),
    actorId: q(t?.id),
    sceneId: q(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function q(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function To(e) {
  return {
    logFirstRitualCost() {
      const t = U("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const r = B(t);
      if (!r) return;
      const n = e.ritualCosts.getCost({ actor: t, ritual: r });
      if (!n.ok) {
        c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      c.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: r.name,
        cost: n.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${r.name} custa ${n.value.amount} ${n.value.resource} (${n.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, r = "PE") {
      const n = U("Nenhum ator encontrado para configurar custo customizado.");
      if (!n) return;
      const o = B(n);
      if (o) {
        if (!Co(t, r)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(u, "ritual.cost", {
          resource: r,
          amount: t
        }), c.info(`Custo customizado aplicado em ${o.name}.`, { resource: r, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${r}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = U("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = B(t);
      r && (await r.unsetFlag(u, "ritual.cost"), c.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = U("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = B(t);
      if (!r) return;
      const n = e.automationRegistry.require(Ar);
      if (!n.ok) {
        c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value), c.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = U("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const n = B(r);
      if (!n) return;
      if (!Ct(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Rr);
      if (!o.ok) {
        c.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: wr(t)
      }), c.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = U("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = B(r);
      if (!n) return;
      if (!Ct(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(br);
      if (!o.ok) {
        c.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: st(t)
      }), c.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = U("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = B(t);
      r && await wo(e, t, r);
    }
  };
}
async function wo(e, t, r) {
  const n = rt(r);
  if (!n.ok) {
    c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: Cr(),
    item: r,
    targets: it()
  });
  if (!o.ok) {
    $o(o.error);
    return;
  }
  c.info("Automação de ritual executada com sucesso.", H(o.value.context));
}
function $o(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    c.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    c.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  c.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function U(e) {
  const t = oe.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function B(e) {
  const t = hr(e);
  return t || (c.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Co(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Ct(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Po = ["disabled", "ask", "automatic"], Io = ["buttons", "confirm"], Pr = "ask";
function So(e) {
  return typeof e == "string" && Po.includes(e);
}
function Eo(e) {
  return typeof e == "string" && Io.includes(e);
}
function _o(e) {
  return So(e) ? e : Eo(e) ? "ask" : Pr;
}
const Lo = ["keep", "replace"], Ir = "keep", Do = !0, _ = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function No() {
  game.settings.register(u, _.executionMode, {
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
    default: Pr
  }), game.settings.register(u, _.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Ir
  }), game.settings.register(u, _.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Do
  }), game.settings.register(u, _.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Pt() {
  const e = _o(game.settings.get(u, _.executionMode)), t = Er(game.settings.get(u, _.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: Sr()
  };
}
function vo() {
  return Er(game.settings.get(u, _.systemCardMode));
}
function Sr() {
  return game.settings.get(u, _.ritualCastingCheckEnabled) === !0;
}
async function j(e) {
  await game.settings.set(u, _.executionMode, e);
}
function Er(e) {
  return Lo.includes(e) ? e : Ir;
}
function Oo(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await j("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await j("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await j(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await j("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await j("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await j("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await j("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Mo = [
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
function Fo(e) {
  return {
    phases() {
      return Mo;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Ce("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = Zn(t);
      if (!r) {
        c.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await It(e, t, r);
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
      if (!jo(r)) {
        c.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = Bo(r) ?? Ce("Nenhum ator encontrado para executar automação do item.");
      n && await It(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Ce("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = Xn(t);
      if (!r) {
        c.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(kr);
        if (!n.ok) {
          c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(r, n.value), c.info(`Preset de teste aplicado ao item: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${r.name}.`);
      } catch (n) {
        c.error("Falha ao configurar automação de teste no item.", n), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function It(e, t, r) {
  const n = rt(r);
  if (!n.ok) {
    c.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: Cr(),
    item: r,
    targets: it()
  });
  if (!o.ok) {
    Uo(o.error);
    return;
  }
  c.info("Automação executada com sucesso.", H(o.value.context));
}
function Uo(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    c.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    c.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  c.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Ce(e) {
  const t = oe.getSelectedActor();
  return t || (c.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Bo(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function jo(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function xo(e) {
  const t = io(e), r = eo(e), n = To(e), o = Fo(e), a = lo(), s = Oo(e);
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
function Ho(e) {
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
    debug: xo(e)
  }, r = globalThis;
  return r[u] = t, r.ParanormalToolkit = t, t;
}
class St {
  static isSupportedSystem() {
    return game.system.id === Fn;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Vo() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: W(t.id),
    actorId: W(t.actor?.id),
    sceneId: W(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function _r() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, r = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: W(e.id),
    actorId: W(t?.id),
    sceneId: W(e.scene?.id),
    name: r
  };
}
function Go(e, t = _r()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function qo(e) {
  if (!Ko(e)) return null;
  const t = e.getFlag(u, "workflow");
  return zo(t) ? t : null;
}
function Wo() {
  return `flags.${u}.workflow`;
}
function Et(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), r = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || r !== void 0;
}
function _t(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return xe(t) || xe(r);
}
function zo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Ko(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function W(e) {
  return xe(e) ? e : null;
}
function xe(e) {
  return typeof e == "string" && e.length > 0;
}
function Yo() {
  const e = (t, r) => {
    Qo(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Qo(e, t) {
  const r = qo(e);
  if (!r || r.targets.length === 0) return;
  const n = Zo(t);
  if (!n || n.querySelector(`.${u}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(Xo(r));
}
function Xo(e) {
  const t = document.createElement("section");
  t.classList.add(`${u}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(Lt("Origem", e.source.name)), t.append(Lt("Alvo", e.targets.map((n) => n.name).join(", "))), t;
}
function Lt(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${u}-chat-enrichment__row`);
  const n = document.createElement("span");
  n.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, r.append(n, o), r;
}
function Zo(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Jo() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!ea(n) || !ta(e) || Et(e) || Et(t)) return;
    const o = Vo();
    if (o.length === 0 || !_t(e) && !_t(t)) return;
    const a = _r();
    e.updateSource({
      [Wo()]: Go(o, a)
    }), c.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function ea(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function ta(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const Lr = {
  enabled: "dice.animations.enabled"
};
function ra() {
  game.settings.register(u, Lr.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function na() {
  return {
    enabled: game.settings.get(u, Lr.enabled) === !0
  };
}
const O = `${u}-item-use-prompt`, oa = `.${O}__workflow-section`, Dr = `.${O}__workflow-roll`, Nr = `${O}__workflow-roll--dice-open`, vr = `.${O}__workflow-roll-formula`, Or = `${O}__workflow-roll-formula--toggle`, ct = `.${O}__workflow-dice-tray`, aa = `.${O}__roll-detail-toggle`, sa = `.${O}__roll-detail-list`, Dt = "data-paranormal-toolkit-dice-toggle-enhanced", ia = [0, 100, 500, 1500, 3e3];
let Nt = !1, Pe = null;
function ca() {
  if (!Nt) {
    Nt = !0, Hooks.on("renderChatMessageHTML", (e, t) => {
      ee(vt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ee(vt(t));
    }), Hooks.once("ready", () => {
      ee(document), da();
    }), document.addEventListener("click", ua), document.addEventListener("keydown", la);
    for (const e of ia)
      globalThis.setTimeout(() => ee(document), e);
  }
}
function ua(e) {
  const t = Ur(e.target);
  if (!t) return;
  const r = ut(t);
  r && (e.preventDefault(), Fr(r, t));
}
function la(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Ur(e.target);
  if (!t) return;
  const r = ut(t);
  r && (e.preventDefault(), Fr(r, t));
}
function da() {
  Pe || !document.body || (Pe = new MutationObserver((e) => {
    for (const t of e)
      for (const r of t.addedNodes)
        (r instanceof HTMLElement || r instanceof DocumentFragment) && ee(r);
  }), Pe.observe(document.body, { childList: !0, subtree: !0 }));
}
function ee(e) {
  if (e) {
    ma(e);
    for (const t of e.querySelectorAll(Dr))
      Mr(t);
  }
}
function ma(e) {
  for (const t of e.querySelectorAll(oa))
    for (const r of t.querySelectorAll(`${aa}, ${sa}`))
      r.remove();
}
function Mr(e) {
  const t = e.querySelector(ct);
  if (!t) return;
  const r = e.querySelector(vr);
  if (r && r.getAttribute(Dt) !== "true" && (r.setAttribute(Dt, "true"), r.classList.add(Or), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", "false"), r.title = "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title), t.hidden = !0, !r.querySelector("i"))) {
    const n = document.createElement("i");
    n.classList.add("fa-solid", "fa-chevron-down"), n.setAttribute("aria-hidden", "true"), r.append(n);
  }
}
function Fr(e, t) {
  const r = e.querySelector(ct);
  if (!r) return;
  const n = !e.classList.contains(Nr);
  fa(e, t, r, n);
}
function fa(e, t, r, n) {
  e.classList.toggle(Nr, n), r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.title = n ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !n), o.classList.toggle("fa-chevron-up", n));
}
function Ur(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(vr);
  if (!t) return null;
  const r = ut(t);
  return r ? (Mr(r), t.classList.contains(Or) ? t : null) : null;
}
function ut(e) {
  const t = e.closest(Dr);
  return t && t.querySelector(ct) ? t : null;
}
function vt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
const te = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Br = {
  PV: "system.attributes.hp"
}, He = {
  PV: [te.PV, Br.PV],
  SAN: [te.SAN],
  PE: [te.PE],
  PD: [te.PD]
}, Ve = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class pa {
  getResource(t, r) {
    const n = Ot(t, r);
    if (!n.ok)
      return m(n.error);
    const o = n.value, a = `${o}.value`, s = `${o}.max`, i = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, s), p = Ft(t, r, a, i, "valor atual");
    if (p) return m(p);
    const h = Ft(t, r, s, d, "valor máximo");
    return h ? m(h) : g({
      value: i,
      max: d
    });
  }
  async updateResourceValue(t, r, n) {
    const o = Ot(t, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: n });
  }
}
function Ot(e, t) {
  const r = ga(e.type, t);
  if (r && Mt(e, r))
    return g(r);
  const n = He[t].find(
    (o) => Mt(e, o)
  );
  return n ? g(n) : m({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: ha(e, t),
    path: He[t].join(" | ")
  });
}
function ga(e, t) {
  return e === "threat" ? Br[t] ?? null : e === "agent" ? te[t] : null;
}
function Mt(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function ha(e, t) {
  const r = e.type ?? "unknown", n = He[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function Ft(e, t, r, n, o) {
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
class ya {
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
      const s = Ve.ritualItem.circleCandidates;
      return m({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: n, value: o } = r, a = Aa(o);
    return a ? g(a) : m({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${n}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: n,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of Ve.ritualItem.circleCandidates) {
      const n = foundry.utils.getProperty(t, r);
      if (n != null)
        return { path: r, value: n };
    }
    return null;
  }
}
function Aa(e) {
  if (Ut(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (Ut(r))
      return r;
  }
  return null;
}
function Ut(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Ra = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class ba {
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
    const n = r.value, o = ka(t.ritual, n);
    return o.ok ? o.value ? g(o.value) : g({
      resource: "PE",
      amount: Ra[n],
      source: "default-by-circle",
      circle: n
    }) : m(o.error);
  }
}
function ka(e, t) {
  const r = e.getFlag(u, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Ta(r) ? {
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
function Ta(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Ie = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function wa(e) {
  if (!Ea(e.item)) return null;
  const t = Ge(e.actor) ? e.actor : $a(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Pa(e.token) ?? Ca(t),
    targets: it(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function $a(e) {
  const t = e;
  return Ge(t.actor) ? t.actor : Ge(e.parent) ? e.parent : null;
}
function Ca(e) {
  const t = Ia(e) ?? Sa(e);
  return t ? jr(t) : null;
}
function Pa(e) {
  return qe(e) ? jr(e) : null;
}
function Ia(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return qe(r) ? r : (t.getActiveTokens?.() ?? []).find(qe) ?? null;
}
function Sa(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function jr(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Se(e.id),
    actorId: Se(t?.id),
    sceneId: Se(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Ea(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ge(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function qe(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Se(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class _a {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Ie.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, c.info(`${Ie.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = wa(La(t));
    if (!r) {
      c.warn(`${Ie.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function La(e) {
  return e && typeof e == "object" ? e : {};
}
class Da {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return Ee("missing-item-patch");
    if (t.type !== "ritual") return Ee("unsupported-item-type");
    const o = Na(n);
    return Object.keys(o).length === 0 ? Ee("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Na(e) {
  const t = {};
  b(t, "name", e.name), b(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (b(t, "system.circle", r.circle), b(t, "system.element", r.element), b(t, "system.target", r.target), b(t, "system.targetQtd", r.targetQuantity), b(t, "system.execution", r.execution), b(t, "system.range", r.range), b(t, "system.duration", r.duration), b(t, "system.skillResis", r.resistanceSkill), b(t, "system.resistance", r.resistance), b(t, "system.studentForm", r.studentForm), b(t, "system.trueForm", r.trueForm)), t;
}
function b(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function Ee(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class va {
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
    return this.getNumber(t, Ve.ritual.dt, 0);
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
class Oa {
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
    await t.unsetFlag(u, "automation");
  }
  async writeAutomationFlag(t, r) {
    await this.clear(t), await t.setFlag(u, "automation", r);
  }
}
class Ma {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = Fa(t);
    return r.ok ? this.presets.has(t.id) ? m({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, _e(t)), g(t)) : r;
  }
  registerMany(t) {
    const r = [];
    for (const n of t) {
      const o = this.register(n);
      if (!o.ok)
        return o;
      r.push(o.value);
    }
    return g(r);
  }
  get(t) {
    const r = this.presets.get(t);
    return r ? _e(r) : null;
  }
  require(t) {
    const r = this.get(t);
    return r ? g(r) : m({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(_e);
  }
  findForItem(t) {
    return this.list().map((r) => Ua(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function Fa(e) {
  return !Le(e.id) || !Le(e.version) || !Le(e.label) ? m({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? m({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : g(e);
}
function Ua(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = Ba(o, t);
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
function Ba(e, t) {
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
      const r = Bt(t.name), n = e.names.map(Bt).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = ja(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function Bt(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function ja(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function _e(e) {
  return structuredClone(e);
}
function Le(e) {
  return typeof e == "string" && e.length > 0;
}
function me(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? m({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : g(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = Ae(e.amountFrom);
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
    }) : g(o);
  }
  return m({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Ae(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const xa = "dice-so-nice";
async function xr(e) {
  if (!na().enabled || !Ha()) return;
  const t = Va();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      c.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function Ha() {
  return game.modules.get(xa)?.active === !0;
}
function Va() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Ga(e, t, r) {
  if (!jt(e.id) || !jt(e.formula))
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
    await xr(o);
    const i = {
      ...r.rollRequests[e.id] ?? Hr(e, t),
      total: a,
      roll: o
    };
    return r.rolls[e.id] = i, g(i);
  } catch (n) {
    return m({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: n
    });
  }
}
function Hr(e, t) {
  const r = e.intent ?? qa(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function qa(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function jt(e) {
  return typeof e == "string" && e.length > 0;
}
async function fe(e, t, r, n, o) {
  switch (n) {
    case "spend":
      return r !== "PE" && r !== "PD" ? le(t, r, n, o) : e.spend(t, r, o);
    case "damage":
      return r !== "PV" && r !== "SAN" ? le(t, r, n, o) : e.damage(t, r, o);
    case "heal":
      return r !== "PV" ? le(t, r, n, o) : e.heal(t, r, o);
    case "recover":
      return r !== "SAN" ? le(t, r, n, o) : e.recover(t, r, o);
  }
}
function le(e, t, r, n) {
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
function Wa(e) {
  const { step: t, context: r, transaction: n, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = za(t, r, n, o);
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
    const s = Ka(t, r, n, o);
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
function za(e, t, r, n) {
  const o = Ae(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: Vr(t.id, "damage", n, t.damageInstances.length),
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
function Ka(e, t, r, n) {
  const o = Ae(e.amountFrom);
  return {
    id: Vr(t.id, "healing", n, t.healingInstances.length),
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
function Vr(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function Ya(e, t, r) {
  const n = Ae(e.amountFrom), o = n ? t.rolls[n] : void 0;
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
function Qa(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", r, { stepIndex: n, step: t, metadata: o }), Gr("before", e), xt("before", e), xt("resolve", e);
}
function Xa(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("apply", r, { stepIndex: n, step: t, metadata: o }), Gr("apply", e);
}
function Za(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", r, { stepIndex: n, step: t, metadata: o });
}
function Gr(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t, i = Ja(e, r.operation);
  i && s.emit(i, n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function xt(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function Ja(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function es(e, t, r) {
  try {
    return await e.createWorkflowSummaryMessage(r, t), g(void 0);
  } catch (n) {
    return m({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: n
    });
  }
}
async function ts(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return rs(e, t);
    case "spendRitualCost":
      return ns(e, t);
  }
}
async function rs(e, t) {
  const { context: r, resources: n } = e, o = me(t, r);
  return o.ok ? qr(await n.spend(r.sourceActor, t.resource, o.value), r) : m(o.error);
}
async function ns(e, t) {
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
  }), qr(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function qr(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), g(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), m({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function os(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: o, execute: a } = e, s = as(t);
  for (const d of s.before)
    o.emit(d, r, { stepIndex: n, step: t });
  const i = await a();
  if (!i.ok)
    return i;
  for (const d of s.after)
    o.emit(d, r, { stepIndex: n, step: t });
  return i;
}
function as(e) {
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
class ss {
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
    return g({ definition: t, context: r });
  }
  async runStep(t, r, n) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, r, n);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, r, n);
      default:
        return os({
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
    const o = await ts({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? g(void 0) : m({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const o = Hr(t, n);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, n, t);
    const a = await this.runRollFormulaStep(t, r, n);
    if (!a.ok)
      return a;
    const s = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, n, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: o, rollResult: s }), g(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const o = await Ga(t, n, r);
    return o.ok ? g(void 0) : m({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const o = me(t, r);
    if (!o.ok)
      return m({ ...o.error, stepIndex: n, step: t, context: r });
    const a = Ya(t, r, o.value);
    Qa({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), Xa({
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
      const d = await fe(this.resources, i, t.resource, t.operation, o.value), p = this.handleResourceOperationResult(d, r, n, t);
      if (!p.ok)
        return p;
      Wa({
        step: t,
        context: r,
        transaction: p.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return Za({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), g(void 0);
  }
  async runModifyResourceStep(t, r, n) {
    const o = me(t, r);
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
      const i = await fe(this.resources, s, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(i, r, n, t);
      if (!d.ok)
        return d;
    }
    return g(void 0);
  }
  async runChatCardStep(t, r, n) {
    const o = await es(this.messages, t, r);
    return o.ok ? g(void 0) : m({ ...o.error, stepIndex: n, step: t, context: r });
  }
  handleResourceOperationResult(t, r, n, o) {
    return t.ok ? (r.resourceTransactions.push(t.value), g(t.value)) : m({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: n,
      step: o,
      context: r,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, r, n, o, a, s) {
    const i = is(t, r.intent);
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
function is(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class cs {
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
    const { afterValue: d, appliedAmount: p } = i.value, h = {
      value: d,
      max: s.max
    };
    try {
      d !== s.value && await this.adapter.updateResourceValue(t, r, d);
    } catch (A) {
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
        cause: A
      });
    }
    return g({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: r,
      operation: n,
      requestedAmount: o,
      appliedAmount: p,
      before: s,
      after: h
    });
  }
  calculate(t, r, n) {
    switch (t) {
      case "spend":
        return r.value < n ? m({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${r.value}; custo: ${n}.`
        }) : g({
          afterValue: r.value - n,
          appliedAmount: n
        });
      case "damage": {
        const o = Math.max(0, r.value - n);
        return g({
          afterValue: o,
          appliedAmount: r.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(r.max, r.value + n);
        return g({
          afterValue: o,
          appliedAmount: o - r.value
        });
      }
    }
  }
}
function Wr(e) {
  return {
    id: us(),
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
function us() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class ls {
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
    return H(this.lastContext);
  }
  async runAutomation(t, r) {
    const n = Wr(r);
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
class ds {
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
    }), Hooks.callAll(`${u}.workflow.${t}`, o), Hooks.callAll(`${u}.workflow.phase`, o), o;
  }
}
class ms {
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
    const r = je();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: fs(),
      flags: {
        ...t.flags,
        [u]: {
          ...ps(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && c.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = je();
    if (!n.enabled)
      return;
    const o = r.notification ?? Ht(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, o);
  }
  emitConsole(t, r) {
    const n = Ht(r);
    switch (t) {
      case "info":
        c.info(n, r.data ?? "");
        return;
      case "warn":
        c.warn(n, r.data ?? "");
        return;
      case "error":
        c.error(n, r.data ?? "");
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
function Ht(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function fs() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function ps(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const gs = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", zr = `${u}-inline-roll-neutralized`, hs = `${u}-inline-roll-notice`, lt = `data-${u}-inline-roll-neutralized`, Vt = `data-${u}-inline-roll-notice`, ys = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Gt(e) {
  const t = Ls(e.message), r = await As(e.message), n = Rs(t);
  return r.replacementCount + n.replacementCount > 0 && c.info("Rolagens inline neutralizadas para item automatizado.", {
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
async function As(e) {
  const t = Ss(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = bs(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await Es(t, r.content), replacementCount: r.replacementCount };
}
function Rs(e) {
  const t = e ? _s(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = Kr(t);
  return r > 0 && Yr(Cs(t)), { replacementCount: r };
}
function bs(e) {
  const t = ks(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = Kr(r.content), o = t.replacementCount + n;
  return o === 0 ? { content: e, replacementCount: 0 } : (Yr(r.content), { content: r.innerHTML, replacementCount: o });
}
function ks(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, o) => (t += 1, ws(o.trim()))), replacementCount: t };
}
function Kr(e) {
  const t = Ts(e);
  for (const r of t)
    r.replaceWith($s(Ps(r)));
  return t.length;
}
function Ts(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(gs))
    r.getAttribute(lt) !== "true" && t.add(r);
  return Array.from(t);
}
function ws(e) {
  return `<span class="${zr}" ${lt}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Ds(e)}</span>`;
}
function $s(e) {
  const t = document.createElement("span");
  return t.classList.add(zr), t.setAttribute(lt, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Yr(e) {
  if (e.querySelector?.(`[${Vt}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(hs), t.setAttribute(Vt, "true"), t.textContent = ys, e.append(t);
}
function Cs(e) {
  return e.querySelector(".message-content") ?? e;
}
function Ps(e) {
  const r = e.getAttribute("data-formula") ?? Is(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function Is(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Ss(e) {
  return e && typeof e == "object" ? e : null;
}
async function Es(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return c.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function _s(e) {
  const t = Ns(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Ls(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Ds(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Ns(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const qt = "occultism";
function vs(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Os(e) {
  const t = vs(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await Ms(e, qt);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await xr(r);
  const n = Bs(r);
  return {
    skill: qt,
    skillLabel: "Ocultismo",
    roll: r,
    formula: Us(r),
    total: n,
    difficulty: t,
    success: n >= t,
    diceBreakdown: js(r)
  };
}
async function Ms(e, t) {
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
  return Fs(n);
}
function Fs(e) {
  return Wt(e) ? e : Array.isArray(e) ? e.find(Wt) ?? null : null;
}
function Wt(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Us(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Bs(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function js(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(xs);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function xs(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Qr = ["base", "discente", "verdadeiro"];
function Xr(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Hs(e) {
  return typeof e == "string" && Qr.includes(e);
}
const { ApplicationV2: Vs } = foundry.applications.api;
class re extends Vs {
  constructor(t, r) {
    super({
      id: `${u}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = r;
  }
  input;
  resolveRequest;
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
      cast: re.onCast,
      cancel: re.onCancel
    }
  };
  static async request(t) {
    return new Promise((r) => {
      new re(t, r).render({ force: !0 });
    });
  }
  async _renderHTML(t, r) {
    const n = document.createElement("div");
    return n.className = "paranormal-toolkit-ritual-cast", n.innerHTML = this.renderContent(), n;
  }
  _replaceHTML(t, r, n) {
    r.replaceChildren(t);
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    const t = this.input.ritual.name ?? "Ritual sem nome", r = this.input.targetNames.length > 0 ? this.input.targetNames.join(", ") : "Nenhum alvo selecionado", n = this.input.cost ? `${this.input.cost.amount} ${this.input.cost.resource}` : "não resolvido", o = this.input.defaultSpendResource ? "checked" : "";
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${$(tt)}</p>
        <div>
          <h2>${$(t)}</h2>
          <p>${$(Qs(this.input.ritual))}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.input.variantOptions.map((a) => Gs(a, this.input.cost)).join("")}
        </div>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--cost">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Custo</h3>
          <label class="paranormal-toolkit-ritual-cast__spend-toggle">
            <input type="checkbox" name="spendResource" ${o}>
            <span>Gastar ao conjurar</span>
          </label>
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary">
          <div><dt>Custo base</dt><dd>${$(n)}</dd></div>
          <div><dt>Conjurador</dt><dd>${$(this.input.actor.name ?? "Ator sem nome")}</dd></div>
          <div><dt>Alvos</dt><dd>${$(r)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.input.automationStatus ?? "assisted"}">
        <h3>Automação</h3>
        ${Ws(this.input)}
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
    const r = Ys(t), n = zs(r, this.input.defaultSpendResource);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function Gs(e, t) {
  const r = e.variant === "base" ? "checked" : "", n = e.enabled ? "" : "disabled", o = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", a = e.finalCostText ?? qs(t), s = [...e.details, e.enabled ? "" : e.unavailableReason ?? "não disponível neste ritual"].filter((i) => i.trim().length > 0).filter((i) => !i.toLocaleLowerCase().startsWith("custo final")).map((i) => `<span>${$(i)}</span>`).join("");
  return `
    <label class="paranormal-toolkit-ritual-cast__form${o}">
      <input type="radio" name="variant" value="${$(e.variant)}" ${r} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${$(e.label)}</strong>
        <em>${$(a)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${s}</span>
    </label>
  `;
}
function qs(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function Ws(e) {
  return e.automationStatus === "generic" ? `
      <p><strong>Sem automação configurada.</strong></p>
      <p>O Toolkit vai registrar a conjuração e gastar o recurso escolhido. Rolagens, dano, resistência e efeitos continuam manuais.</p>
    ` : `
    <p><strong>Automação assistida disponível.</strong></p>
    <p>O Toolkit vai preparar custo, rolagens e ações assistidas no card persistente do chat.</p>
  `;
}
function zs(e, t) {
  const r = Ks(e), n = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: n
  };
}
function Ks(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return Hs(t) ? t : "base";
}
function Ys(e) {
  return (e.currentTarget instanceof HTMLElement ? e.currentTarget : null)?.closest(".paranormal-toolkit-ritual-cast") ?? null;
}
function Qs(e) {
  const t = e.system, r = [Zs(t?.element), Xs(t?.circle)].filter(Js);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function Xs(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : `${e}º Círculo`;
}
function Zs(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function Js(e) {
  return typeof e == "string" && e.length > 0;
}
function $(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function ei(e) {
  return re.request(e);
}
const Zr = {
  label: "Padrão"
};
class ti {
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
    const n = this.resolveCostPreview(t), o = Si(r, n), a = await ei({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((l) => l.name),
      cost: n,
      defaultSpendResource: Ni(r),
      variantOptions: o,
      automationStatus: Li(r) ? "generic" : "assisted"
    });
    if (!a)
      return { status: "cancelled" };
    const s = Di(r, a.variant), i = Sr();
    let d = null;
    if (i) {
      const l = await ni(this.resources, t.actor, a, s, n);
      if (!l.ok)
        return {
          status: "failed",
          reason: l.reason,
          message: l.message
        };
      try {
        d = await Os(t.actor);
      } catch (I) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: I instanceof Error ? I.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: I
        };
      }
      if (!d.success) {
        const I = Kt(t, a);
        return {
          status: "completed-without-actions",
          workflowContext: I,
          summaryLines: De(r, a, s, n, I, d, {
            effectStopped: !0
          })
        };
      }
    }
    const p = ri(r, a, s, n, {
      includeCostSteps: !i
    });
    if (p.steps.length === 0) {
      const l = Kt(t, a);
      return {
        status: "completed-without-actions",
        workflowContext: l,
        summaryLines: De(r, a, s, n, l, d)
      };
    }
    const h = await this.workflow.runAutomation(p, {
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
          variant: a.variant,
          spendResource: a.spendResource
        }
      }
    });
    if (!h.ok)
      return {
        status: "failed",
        reason: h.error.reason,
        message: h.error.message,
        cause: h.error
      };
    const A = h.value.context, R = ai(r, t, A), T = De(r, a, s, n, A, d);
    return R.ok ? R.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: A,
      summaryLines: T
    } : {
      status: "ready",
      workflowContext: A,
      actions: R.actions,
      summaryLines: T
    } : {
      status: "failed",
      reason: R.reason,
      message: R.message
    };
  }
  async applyAction(t) {
    return fe(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function ri(e, t, r, n, o) {
  const a = [];
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || dt(s) && (!o.includeCostSteps || !t.spendResource) || a.push(oi(s, r));
  return o.includeCostSteps && t.spendResource && n && vi(r.extraCost) && a.push({
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
async function ni(e, t, r, n, o) {
  if (!r.spendResource) return { ok: !0 };
  const a = Re(o, n);
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
function oi(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function ai(e, t, r) {
  const n = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const a = me(o, r);
    if (!a.ok)
      return {
        ok: !1,
        reason: a.error.reason,
        message: a.error.message
      };
    const s = gi(o.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(...si(e, o, i, a.value));
  }
  return { ok: !0, actions: n };
}
function si(e, t, r, n) {
  if (!di(e, t))
    return [zt(t, r, n)];
  const o = pi();
  return Jr(e).map((a) => {
    const s = mi(n, a);
    return zt(t, r, s, {
      option: a,
      choiceGroupId: o
    });
  });
}
function zt(e, t, r, n) {
  const o = t.name ?? "Ator sem nome", a = li(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: ii(e, o, r, n?.option),
    executedLabel: ci(e, o, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function ii(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function ci(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function li(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function di(e, t) {
  return t.operation === "damage" && t.resource === "PV" && Jr(e).length > 1;
}
function Jr(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function mi(e, t) {
  const r = e * t.multiplier, n = fi(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function fi(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function pi() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function gi(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function De(e, t, r, n, o, a = null, s = {}) {
  const i = s.effectStopped === !0;
  return [
    `Forma: ${Xr(t.variant)}`,
    yi(t, r, n),
    ...hi(a),
    ...i ? [] : Object.values(o.rolls).flatMap(Ai),
    ...i ? [] : Ri(e.resistance),
    ...Pi(r),
    ...i ? ["Observação: O efeito do ritual não foi resolvido porque a conjuração falhou."] : []
  ];
}
function hi(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function yi(e, t, r) {
  const n = Re(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Ai(e) {
  const r = [`${Ii(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = bi(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${Ci(e.damageType)}`), r;
}
function Ri(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function bi(e) {
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
    const s = ki(a);
    s && ($i(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function ki(e) {
  const t = Ti(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : wi(e);
}
function Ti(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function wi(e) {
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
function $i(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function Ci(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Pi(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Ii(e) {
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
function Si(e, t) {
  return Qr.map((r) => {
    const n = en(e, r), o = r === "base" || n !== null, a = n ?? (r === "base" ? Zr : null);
    return {
      variant: r,
      label: a?.label ?? Xr(r),
      enabled: o,
      details: a ? Ei(a, t) : [],
      finalCostText: a ? _i(t, a) : null,
      unavailableReason: o ? void 0 : "não disponível neste ritual"
    };
  });
}
function Ei(e, t) {
  const r = [], n = Object.values(e.rollFormulaOverrides ?? {});
  n.length > 0 && r.push(n.join(", "));
  const o = Re(t, e);
  return r.push(o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"), r;
}
function Re(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function _i(e, t) {
  const r = Re(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function Li(e) {
  return !e.ritualForms && !e.resistance && e.steps.length > 0 && e.steps.every(dt);
}
function Kt(e, t) {
  return Wr({
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
function Di(e, t) {
  return en(e, t) ?? Zr;
}
function en(e, t) {
  return e.ritualForms?.[t] ?? null;
}
function Ni(e) {
  return e.steps.some(dt);
}
function dt(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function vi(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Oi(e, t) {
  const r = await Mi(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: Ui(r),
    total: Bi(r),
    diceBreakdown: ji(r)
  };
}
function tn(e) {
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
async function Mi(e, t) {
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
  return Fi(n);
}
function Fi(e) {
  return Yt(e) ? e : Array.isArray(e) ? e.find(Yt) ?? null : null;
}
function Yt(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Ui(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Bi(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function ji(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(xi);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function xi(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const rn = "itemUsePrompts", nn = "chatCard", be = "data-paranormal-toolkit-prompt-id", ke = "data-paranormal-toolkit-pending-id", mt = "data-paranormal-toolkit-executed-label", We = "data-paranormal-toolkit-choice-group", on = "data-paranormal-toolkit-skipped-label", Qt = "data-paranormal-toolkit-action-section", Xt = "data-paranormal-toolkit-detail-key", Zt = "data-paranormal-toolkit-roll-card", ft = "data-paranormal-toolkit-roll-detail-toggle", an = "data-paranormal-toolkit-roll-detail-id", sn = "data-paranormal-toolkit-resistance-roll-button", cn = "data-paranormal-toolkit-resistance-skill", un = "data-paranormal-toolkit-resistance-skill-label", ln = "data-paranormal-toolkit-resistance-target-actor-id", dn = "data-paranormal-toolkit-resistance-target-name", mn = "data-paranormal-toolkit-resistance-roll-result", Jt = "data-paranormal-toolkit-system-card-replaced", Hi = `[${ke}]`, Vi = `[${ft}]`, Gi = `[${sn}]`, ze = `${u}-chat-enrichment`, f = `${u}-item-use-prompt`, qi = `${f}__actions`, er = `${f}__details`, fn = `${f}__summary`, Wi = `${f}__title`, pn = `${f}__button--executed`, tr = `${f}__roll-card`;
let rr = !1, Ke = null;
const P = /* @__PURE__ */ new Map(), zi = [0, 100, 500, 1500, 3e3], Ki = 3e4, Yi = [0, 100, 500, 1500, 3e3];
function Qi(e) {
  if (Ke = e, rr) {
    or(e);
    return;
  }
  const t = (r, n) => {
    hn(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), rr = !0, or(e);
}
async function nr(e) {
  const t = gn(e);
  P.set(e.pendingId, t), await ht(t) || Pn(t), yn(e.pendingId);
}
async function Xi(e) {
  const t = gn({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await ht(t) || Pn(t), yn(e.pendingId);
}
async function Ne(e, t) {
  const r = P.get(e);
  P.delete(e), r && await Qc(r, t);
}
function pt(e) {
  const t = Dn();
  for (const r of t) {
    const n = N(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function Zi(e, t) {
  const r = pt(e);
  if (!r) return;
  const n = N(r.message), o = n[e];
  o && (n[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await Q(r.message, n));
}
async function Ji(e, t, r) {
  if (!t) return;
  const n = pt(e);
  if (!n) return;
  const o = N(n.message);
  let a = !1;
  for (const [s, i] of Object.entries(o))
    s !== e && i.choiceGroupId === t && (o[s] = {
      ...i,
      executedLabel: r ?? i.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await Q(n.message, o);
}
function gn(e) {
  const t = M(e.context.message), r = e.context.targets.find((s) => Ze(s)), n = r ? Ze(r) : null, o = e.resistanceTargetActor ?? n, a = e.resistanceTargetName ?? r?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Cc(e.context),
    executed: !1
  };
}
function hn(e, t, r) {
  Yc();
  const n = we(t);
  if (!n) return;
  const o = Wc(e, n);
  o.length > 0 && pe(n);
  for (const a of o)
    Ye(n, a);
  bn(n, r), Qe(n), Xe(n);
}
function or(e) {
  for (const t of Yi)
    globalThis.setTimeout(() => {
      ec(e);
    }, t);
}
function ec(e) {
  for (const t of tc()) {
    const r = Te(t);
    rc(r) && hn(r, t, e);
  }
}
function tc() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function rc(e) {
  return e ? yt(e) ? !0 : Zc(e).length > 0 : !1;
}
function yn(e) {
  const t = P.get(e);
  if (!t) return;
  const r = t.messageId ? zc(t.messageId) : null;
  if (r) {
    ur(r, t), pe(r), Ye(r, t), ar(r), Qe(r), Xe(r);
    return;
  }
  if (t.messageId) {
    et(t);
    return;
  }
  const n = Kc(t);
  if (n) {
    ur(n, t), pe(n), Ye(n, t), ar(n), Qe(n), Xe(n);
    return;
  }
  et(t);
}
function ar(e) {
  Ke && bn(e, Ke);
}
function pe(e) {
  const t = nc();
  e.classList.toggle(`${f}--system-card-replaced`, t);
  const r = Rn(e);
  if (!r || (r.classList.toggle(`${f}__host--system-card-replaced`, t), !t) || r.getAttribute(Jt) === "true") return;
  const n = r.querySelector(`.${ze}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(Jt, "true");
}
function nc() {
  try {
    return vo() === "replace";
  } catch {
    return !1;
  }
}
function Ye(e, t) {
  if (pe(e), e.querySelector(`[${be}="${X(t.pendingId)}"]`)) return;
  const r = oc(e, t);
  sc(r, t), bc(r, kc(t)).append($c(t));
}
function oc(e, t) {
  const r = e.querySelector(`.${ze}`);
  if (r)
    return r;
  const n = document.createElement("section");
  n.classList.add(ze, f);
  const o = document.createElement("header");
  o.classList.add(`${f}__header`);
  const a = document.createElement("span");
  a.classList.add(`${f}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(Wi), s.textContent = ac(t);
  const i = document.createElement("span");
  return i.classList.add(fn), i.textContent = t.summary, o.append(a, s, i), n.append(o), Ic(e).append(n), n;
}
function ac(e) {
  const t = k(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function sc(e, t) {
  const r = t.summaryLines ?? [], n = $n(r, t);
  if (n) {
    ic(e, n, t);
    return;
  }
  Tc(e, r);
}
function ic(e, t, r) {
  if (e.querySelector(`[${Zt}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(tr, `${tr}--${t.intent}`), n.setAttribute(Zt, "true"), t.castingCheck && sr(n, uc(t.castingCheck), r.pendingId, "casting"), cc(t) && sr(n, lc(t), r.pendingId, "effect"), gc(n, t), hc(n, t, r), Rc(n, t), e.append(n);
}
function cc(e) {
  return e.intent !== "casting";
}
function uc(e) {
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
function lc(e) {
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
function sr(e, t, r, n) {
  const o = document.createElement("section");
  o.classList.add(
    `${f}__workflow-section`,
    `${f}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${f}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${f}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, a.append(s), t.statusLabel) {
    const i = document.createElement("span");
    i.classList.add(`${f}__workflow-section-status`), i.textContent = t.statusLabel, a.append(i);
  }
  if (o.append(a), t.description) {
    const i = document.createElement("span");
    i.classList.add(`${f}__workflow-section-description`), i.textContent = t.description, o.append(i);
  }
  dc(o, t), Ac(o, t.detailRows, r, n, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function dc(e, t) {
  const r = document.createElement("div");
  r.classList.add(`${f}__workflow-roll`);
  const n = document.createElement("span");
  n.classList.add(`${f}__workflow-roll-formula`), n.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${f}__workflow-roll-total`), o.textContent = String(t.total), r.append(n, o);
  const a = mc(t.formula, t.diceBreakdown);
  a && r.append(a), e.append(r);
}
function mc(e, t) {
  const r = fc(t);
  if (r.length === 0) return null;
  const n = document.createElement("div");
  n.classList.add(`${f}__workflow-dice-tray`);
  for (const o of pc(r, e)) {
    const a = document.createElement("span");
    a.classList.add(`${f}__workflow-die`), o.active || a.classList.add(`${f}__workflow-die--inactive`), a.textContent = String(o.value), n.append(a);
  }
  return n;
}
function fc(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((n) => Number(n.trim())).filter((n) => Number.isFinite(n)).map((n) => Math.trunc(n)) : [];
}
function pc(e, t) {
  if (e.length <= 1) return e.map((n) => ({ value: n, active: !0 }));
  const r = t.toLowerCase();
  return r.includes("kh") ? ir(e, "highest") : r.includes("kl") ? ir(e, "lowest") : e.map((n) => ({ value: n, active: !0 }));
}
function ir(e, t) {
  const r = t === "highest" ? Math.max(...e) : Math.min(...e);
  let n = !1;
  return e.map((o) => {
    const a = !n && o === r;
    return a && (n = !0), { value: o, active: a };
  });
}
function gc(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(hu);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${f}__roll-meta`);
  for (const o of r) {
    const a = document.createElement("span");
    a.classList.add(`${f}__roll-meta-pill`), a.textContent = o, n.append(a);
  }
  e.append(n);
}
function hc(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${f}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${f}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = yc(t, r);
  o.append(a), s && o.append(s);
  const i = document.createElement("span");
  i.classList.add(`${f}__resistance-description`), i.textContent = t.resistance, n.append(o, i), t.resistanceRollResult && n.append(An(t.resistanceRollResult)), e.append(n);
}
function yc(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${f}__resistance-roll-button`), r.setAttribute(be, t.pendingId), r.setAttribute(sn, "true"), r.setAttribute(cn, e.resistanceSkill), r.setAttribute(un, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(ln, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(dn, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${f}__resistance-roll-button--rolled`), r.setAttribute(mn, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${f}__resistance-roll-fallback`), o.textContent = "d20", r.append(n, o), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function An(e) {
  const t = document.createElement("span");
  return t.classList.add(`${f}__resistance-roll-result`), t.textContent = Tn(e), t;
}
function Ac(e, t, r, n, o) {
  const a = t.filter((p) => p.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${r}-roll-details-${n}`, i = document.createElement("button");
  i.type = "button", i.classList.add(`${f}__roll-detail-toggle`), i.setAttribute(ft, s), i.setAttribute("aria-expanded", "false"), i.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${f}__roll-detail-list`), d.setAttribute(an, s), d.hidden = !0;
  for (const p of a) {
    const h = document.createElement("dt");
    h.textContent = p.label;
    const A = document.createElement("dd");
    A.textContent = p.value, d.append(h, A);
  }
  e.append(i, d);
}
function Rc(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${f}__workflow-notes`);
  for (const n of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = n, r.append(o);
  }
  e.append(r);
}
function bc(e, t) {
  const r = `[${Qt}="${X(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const o = document.createElement("div");
  o.classList.add(qi), o.setAttribute(Qt, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${f}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function kc(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = $n(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Tc(e, t) {
  if (t.length === 0) return;
  const r = wc(e);
  for (const n of t) {
    const o = yu(n);
    if (r.querySelector(`[${Xt}="${X(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = n, a.setAttribute(Xt, o), r.append(a);
  }
}
function wc(e) {
  const t = e.querySelector(`.${er}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(er), e.append(r), r;
}
function $c(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${f}__button`), t.setAttribute(be, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(pn), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(ke, e.pendingId), t.setAttribute(mt, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(We, e.choiceGroupId), t.setAttribute(on, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Cc(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = Pc(e);
  return `${t} → ${r}`;
}
function Pc(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Ic(e) {
  return Rn(e) ?? e;
}
function Rn(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function bn(e, t) {
  const r = we(e);
  if (!r) return;
  const n = r.querySelectorAll(Hi);
  for (const o of n)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      xc(o, t);
    }));
}
function Qe(e) {
  const t = we(e);
  if (!t) return;
  const r = t.querySelectorAll(Vi);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      Sc(t, n);
    }));
}
function Xe(e) {
  const t = we(e);
  if (!t) return;
  const r = t.querySelectorAll(Gi);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      Ec(t, n);
    }));
}
function Sc(e, t) {
  const r = t.getAttribute(ft);
  if (!r) return;
  const n = e.querySelector(`[${an}="${X(r)}"]`);
  if (!n) return;
  const o = n.hidden;
  n.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Ec(e, t) {
  const r = t.getAttribute(be), n = t.getAttribute(cn), o = t.getAttribute(un) ?? (n ? tn(n) : "Resistência");
  if (!r || !n) return;
  const a = Dc(e, r), s = Nc(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Oi(s, n);
    await Uc(d.roll);
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
    _c(t, p), Lc(t, p), Bc(r, p), await jc(e, r, p);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function _c(e, t) {
  e.classList.add(`${f}__resistance-roll-button--rolled`), e.setAttribute(mn, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Lc(e, t) {
  const r = e.closest(`.${f}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${f}__resistance-roll-result`), o = n ?? An(t);
  if (n) {
    n.textContent = Tn(t);
    return;
  }
  r.append(o);
}
function Dc(e, t) {
  const r = P.get(t);
  if (r) return r;
  const n = Te(e);
  return N(n)[t] ?? null;
}
function Nc(e, t) {
  const r = e?.resistanceTargetActor;
  if (L(r)) return r;
  const o = e?.context?.targets.map(Ze).find(L) ?? null;
  if (o) return o;
  const a = t.getAttribute(ln) ?? e?.resistanceTargetActorId ?? null, s = a ? Oc(a) : null;
  return s || Mc(
    t.getAttribute(dn) ?? e?.resistanceTargetName ?? vc(t)
  );
}
function vc(e) {
  const r = e.closest(`.${f}`)?.querySelector(`.${fn}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const o = r.split(n), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function Ze(e) {
  const t = e.actor;
  if (L(t)) return t;
  const r = e.token, n = ne(r);
  if (n) return n;
  const o = e.document;
  return ne(o);
}
function ne(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (L(t)) return t;
  const r = e.document?.actor;
  return L(r) ? r : null;
}
function Oc(e) {
  const r = game.actors?.get?.(e);
  return L(r) ? r : kn().map((a) => ne(a)).find((a) => a?.id === e) ?? null;
}
function Mc(e) {
  const t = z(e);
  if (!t) return null;
  const r = kn().filter((a) => z(Fc(a)) === t).map((a) => ne(a)).find(L) ?? null;
  if (r) return r;
  const o = game.actors?.find?.((a) => L(a) && z(a.name) === t);
  return L(o) ? o : null;
}
function kn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Fc(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : ne(e)?.name ?? null;
}
function z(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function L(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Tn(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Uc(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Bc(e, t) {
  const r = P.get(e);
  r && (r.resistanceRollResult = t);
}
async function jc(e, t, r) {
  const n = Te(e);
  if (n)
    try {
      const o = N(n), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: r
      }, await Q(n, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Te(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return D(n?.get?.(r));
}
async function xc(e, t) {
  const r = e.getAttribute(ke);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    wn(e, e.getAttribute(mt) ?? "✓ Automação aplicada"), Hc(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function wn(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(pn), e.removeAttribute(ke), e.removeAttribute(mt);
}
function Hc(e) {
  const t = e.getAttribute(We);
  if (!t) return;
  const r = e.closest(`.${f}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${We}="${X(t)}"]`;
  for (const o of r.querySelectorAll(n)) {
    if (o === e) continue;
    const a = o.getAttribute(on) ?? "✓ Outra opção escolhida";
    wn(o, a);
  }
}
function $n(e, t) {
  const r = e.map(gt).filter(pu), n = r.find((l) => l.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const o = k(e, "Forma"), a = k(e, "Custo"), s = k(e, "Dados") ?? k(e, `Dados (${n.label})`), i = k(e, "Tipo"), d = k(e, "Resistência"), p = k(e, "Resistência Perícia"), h = k(e, "Resistência Rótulo") ?? (p ? tn(p) : null), A = Cn(e, "Observação"), R = e.filter((l) => qc(l, n)), T = Vc(e);
  return {
    ...n,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: s,
    damageType: i,
    resistance: d,
    resistanceSkill: p,
    resistanceSkillLabel: h,
    notes: A,
    details: R,
    castingCheck: T,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function Vc(e) {
  const t = e.map(gt).find((a) => a?.intent === "casting") ?? null, r = k(e, "Conjuração DT"), n = k(e, "Conjuração Resultado");
  if (!t || !r || !n) return null;
  const o = Number(r);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: k(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: n.toLowerCase() === "sucesso",
    diceBreakdown: k(e, "Dados (Conjuração)")
  } : null;
}
function gt(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, n, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: r,
    formula: n,
    total: a,
    intent: Gc(r)
  } : null;
}
function Gc(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function k(e, t) {
  return Cn(e, t)[0] ?? null;
}
function Cn(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const o = n.slice(r.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function qc(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || gt(e) ? !1 : e.trim().length > 0;
}
function Wc(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of P.values())
    Je(n, e, t) && r.set(n.pendingId, n);
  for (const n of Xc(e))
    Je(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, o) => n.createdAt - o.createdAt);
}
function Je(e, t, r) {
  const n = M(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !cr(r, "itemId", e.itemId) ? !1 : !e.actorId || cr(r, "actorId", e.actorId);
}
function cr(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${Au(t)}`;
  for (const o of e.querySelectorAll(`[${n}]`))
    if (o.getAttribute(n) === r)
      return !0;
  return !1;
}
function zc(e) {
  const t = X(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Kc(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Je(e, null, t))
      return t;
  return null;
}
function Yc() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of P.entries())
    e - n.createdAt > t && P.delete(r);
}
async function ur(e, t) {
  const r = Te(e);
  if (!r) return !1;
  try {
    const n = N(r);
    return n[t.pendingId] = At(t, M(r)), await Q(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function ht(e) {
  const t = En(e);
  if (!t) return !1;
  try {
    const r = N(t);
    return r[e.pendingId] = At(e, M(t)), await Q(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function Pn(e) {
  for (const t of zi)
    globalThis.setTimeout(() => {
      et(e);
    }, t);
}
async function et(e) {
  const t = En(e);
  if (yt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const n = await ht(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function Qc(e, t) {
  const r = Sn(e.context.message);
  if (r)
    try {
      const n = N(r), o = n[e.pendingId] ?? At(e, M(r));
      n[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await Q(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function Xc(e) {
  return Object.values(N(D(e))).filter(se);
}
function N(e) {
  if (!e) return {};
  const t = {}, r = yt(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, o] of Object.entries(In(e)))
    t[n] ??= o;
  return t;
}
function Zc(e) {
  return Object.values(In(D(e))).filter(se);
}
function In(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, rn);
  if (!K(t))
    return {};
  const r = {};
  for (const [n, o] of Object.entries(t))
    se(o) && (r[n] = o);
  return r;
}
async function Q(e, t) {
  typeof e.setFlag == "function" && (await eu(e, t), await Jc(e, t));
}
async function Jc(e, t) {
  await Promise.resolve(e.setFlag?.(u, rn, t));
}
function yt(e) {
  if (!e) return null;
  const t = e.getFlag?.(u, nn);
  return mu(t) ? t : null;
}
async function eu(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(se).sort((a, s) => a.createdAt - s.createdAt);
  if (r.length === 0) return;
  const n = r[0];
  if (!n) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...r.map((a) => a.createdAt)),
    messageId: n.messageId ?? M(e) ?? null,
    source: {
      actorId: n.actorId,
      actorName: tu(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(u, nn, o));
}
function tu(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function At(e, t) {
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
function Sn(e) {
  const t = D(e);
  if (t?.setFlag)
    return t;
  const r = ru(e);
  if (r?.setFlag)
    return r;
  const n = M(e);
  if (!n) return null;
  const o = game.messages;
  return D(o?.get?.(n));
}
function ru(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(D).find((r) => typeof r?.setFlag == "function") ?? null;
}
function En(e) {
  const t = Sn(e.context.message);
  if (t) return t;
  const r = e.messageId ? nu(e.messageId) : null;
  if (r) return r;
  const n = Dn().slice().reverse();
  return n.find((o) => ou(o, e)) ?? n.find((o) => au(o, e)) ?? null;
}
function nu(e) {
  const t = game.messages;
  return D(t?.get?.(e));
}
function ou(e, t) {
  const r = M(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!_n(e, t)) return !1;
  const o = Ln(e);
  return !t.actorId || !o || o === t.actorId;
}
function au(e, t) {
  if (!iu(e, t)) return !1;
  const r = Ln(e);
  return t.actorId && r === t.actorId ? !0 : _n(e, t);
}
function _n(e, t) {
  const r = z(su(e));
  if (!r) return !1;
  const n = z(t.itemName);
  if (n && r.includes(n)) return !0;
  const o = z(t.itemId);
  return !!(o && r.includes(o));
}
function su(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Ln(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function iu(e, t) {
  const r = cu(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= Ki;
}
function cu(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function D(e) {
  return e && typeof e == "object" ? e : null;
}
function se(e) {
  return K(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && w(e.messageId) && w(e.itemId) && w(e.actorId) && w(e.itemName) && x(e.resistanceTargetActorId) && x(e.resistanceTargetName) && fu(e.resistanceRollResult) && uu(e.actionPayload) && ve(e.title) && ve(e.buttonLabel) && ve(e.executedLabel) && x(e.choiceGroupId) && x(e.skippedLabel) && x(e.actionSectionId) && x(e.actionSectionTitle) && gu(e.summaryLines) : !1;
}
function uu(e) {
  return e == null ? !0 : K(e) ? e.kind === "resource-operation" && w(e.actorId) && w(e.actorUuid) && typeof e.actorName == "string" && lu(e.resource) && du(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function lu(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function du(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function mu(e) {
  return K(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && w(e.messageId) && K(e.source) && w(e.source.actorId) && w(e.source.actorName) && w(e.source.itemId) && w(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(se) : !1;
}
function fu(e) {
  return e == null ? !0 : K(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && x(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function pu(e) {
  return e !== null;
}
function K(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function w(e) {
  return e === null || typeof e == "string";
}
function ve(e) {
  return e === void 0 || typeof e == "string";
}
function x(e) {
  return e == null || typeof e == "string";
}
function gu(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function hu(e) {
  return typeof e == "string" && e.length > 0;
}
function Dn() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(D).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(D).filter((n) => n !== null) : [];
}
function we(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function M(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function yu(e) {
  return e.trim().toLowerCase();
}
function Au(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function X(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const lr = 1e3;
class Ru {
  constructor(t, r, n, o) {
    this.workflow = t, this.resources = r, this.debugOutput = o, this.ritualAssistant = new ti(t, r, n);
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
      settings: Pt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = Pt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = rt(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && bu(t.item) && r.executionMode === "ask") {
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
    if (await Gt(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Me(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await Ne(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const n = await this.ritualAssistant.applyAction(r.action);
    return n.ok ? (r.workflowContext.resourceTransactions.push(n.value), this.pendingExecutions.delete(t), await Ne(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(n), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = pt(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, o = wu(n);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const a = await fe(this.resources, o, n.resource, n.operation, n.amount);
    return a.ok ? (await Zi(t), await Ji(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Qi((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await Gt(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Me(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, ku(t.item));
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
        await this.registerCompletedRitualCard(t, n.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), c.info("Ritual assistido concluído sem ações pendentes.", H(n.workflowContext));
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
      a.kind === "resource-action" && (this.pendingExecutions.delete(o), await Ne(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, r) {
    const n = Fe();
    await Xi({
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
      const i = Fe();
      a ??= i, this.pendingExecutions.set(i, {
        kind: "resource-action",
        id: i,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await nr({
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
        actionPayload: Tu(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), c.info("Ritual assistido preparado com ações pendentes.", H(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = Fe();
    this.pendingExecutions.set(n, {
      kind: "workflow",
      id: n,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await nr({
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
    this.setAttempt(t, "completed"), c.info("Automação executada por uso normal de item.", H(o.value.context));
  }
  handleAutomationFailure(t) {
    const r = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      c.warn(r, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      c.error(r, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    c.warn(r, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    c.warn(`Ação assistida falhou: ${t.error.message}`, t.error), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const r = Date.now(), n = dr(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      r - s > lr && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(n);
    return o !== void 0 && r - o <= lr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(dr(t), Date.now());
  }
  setAttempt(t, r, n, o) {
    this.lastAttempt = Me(t, r, n, o);
  }
}
function bu(e) {
  return e.type === "ritual";
}
function ku(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Tu(e) {
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
function wu(e) {
  const t = e.actorUuid ? $u(e.actorUuid) : null;
  if (Y(t)) return t;
  const r = e.actorId ? Cu(e.actorId) : null;
  return r || Pu(e.actorName);
}
function $u(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Cu(e) {
  const r = game.actors?.get?.(e);
  if (Y(r)) return r;
  for (const n of Nn()) {
    const o = Rt(n);
    if (o?.id === e) return o;
  }
  return null;
}
function Pu(e) {
  const t = Oe(e);
  if (!t) return null;
  for (const o of Nn()) {
    const a = Iu(o);
    if (Oe(a) === t) {
      const s = Rt(o);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((o) => Y(o) && Oe(o.name) === t);
  return Y(n) ? n : null;
}
function Nn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Iu(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : Rt(e)?.name ?? null;
}
function Rt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Y(t)) return t;
  const r = e.document?.actor;
  return Y(r) ? r : null;
}
function Oe(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Y(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Me(e, t, r, n) {
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
function dr(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function Fe() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Su {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], o = [], a = ae(t);
    for (const s of r) {
      const i = s.itemId ? a.find((h) => h.id === s.itemId) ?? null : null, d = s.match?.preset ?? null;
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
class Eu {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = ae(t).map((i) => this.analyzeRitual(i)), n = r.filter(de("upToDate")), o = r.filter(de("available")), a = r.filter(de("outdated")), s = r.filter(de("unsupported"));
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
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = _u(t);
    return r ? n ? n.source.type !== "preset" ? Z({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Automação manual encontrada. Preset sugerido: ${r.preset.label}.`
    }) : n.source.presetId === r.preset.id && n.source.presetVersion === r.preset.version ? Z({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Preset ${r.preset.label} v${r.preset.version} já aplicado.`
    }) : Z({
      ritual: t,
      status: "outdated",
      match: r,
      flag: n,
      reason: Lu(n, r.preset)
    }) : Z({
      ritual: t,
      status: "available",
      match: r,
      flag: n,
      reason: `Preset encontrado: ${r.preset.label}.`
    }) : Z({
      ritual: t,
      status: "unsupported",
      match: r,
      flag: n,
      reason: n ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Z(e) {
  const t = e.flag?.source, r = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? ye(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function _u(e) {
  const t = e.getFlag(u, "automation");
  return nt(t) ? t : null;
}
function Lu(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function de(e) {
  return (t) => t.status === e;
}
class Du {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), n = at(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: r,
      data: n,
      flags: {
        [u]: {
          resourceTransaction: n
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, r) {
    const n = this.createWorkflowSummaryContent(t, r), o = H(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: n,
      data: o,
      flags: {
        [u]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const r = y(t.actorName), n = y(t.resource), o = y(mr(t)), a = y(vu(t));
    return `
      <section class="${u}-card ${u}-resource-card">
        <header class="${u}-card__header">
          <strong>${o}</strong>
          <span>${r}</span>
        </header>
        <div class="${u}-card__body">
          <p><strong>${a}:</strong> ${t.appliedAmount}</p>
          <p><strong>${n}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, r) {
    const n = y(r.title ?? "Automação"), o = r.message ? `<p>${y(r.message)}</p>` : "", a = y(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = y(t.item.name ?? "Item sem nome"), i = t.targets.length > 0 ? t.targets.map((l) => y(l.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (l) => `<li><strong>${y(l.id)}:</strong> ${y(l.formula)} = ${l.total} <em>(${y(Nu(l.intent))})</em>${l.damageType ? ` — ${y(l.damageType)}` : ""}</li>`
    ), p = t.ritualCosts.map(
      (l) => `<li><strong>${y(l.itemName)}:</strong> ${l.circle}º círculo — ${l.amount} ${y(l.resource)} (${y(Ou(l.source))})</li>`
    ), h = t.damageInstances.map(
      (l) => `<li><strong>${y(l.targetActorName)}:</strong> bruto ${l.rawAmount}${l.damageType ? ` ${y(l.damageType)}` : ""} &rarr; final ${l.finalAmount} &rarr; aplicado ${l.appliedAmount}</li>`
    ), A = t.healingInstances.map(
      (l) => `<li><strong>${y(l.targetActorName)}:</strong> bruto ${l.rawAmount} &rarr; final ${l.finalAmount} &rarr; aplicado ${l.appliedAmount}</li>`
    ), R = t.resourceTransactions.map(
      (l) => `<li><strong>${y(l.actorName)}:</strong> ${y(mr(l))} — ${l.before.value}/${l.before.max} &rarr; ${l.after.value}/${l.after.max}</li>`
    ), T = t.phases.map((l) => y(l)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${n}</strong>
          <span>${s}</span>
        </header>
        <div class="${u}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${i}</p>
          ${p.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${p.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${h.length > 0 ? `<p><strong>Dano:</strong></p><ul>${h.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p><strong>Cura:</strong></p><ul>${A.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${T}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Nu(e) {
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
function mr(e) {
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
function vu(e) {
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
function Ou(e) {
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
function Mu() {
  const e = new pa(), t = new cs(e), r = new ya(), n = new ba(r), o = new va(e), a = new Ma(), s = a.registerMany(fo());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new Oa(), d = new Da(), p = new Eu(a), h = new Su(p, i, d), A = new ms(), R = new Du(A), T = new ds(), l = new ss(t, n, R, T), I = new ls(l, T), $e = new Ru(I, t, n, A);
  return $e.addStrategy(new _a((Mn) => $e.handleItemUsed(Mn))), {
    ordem: o,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: n,
    resources: t,
    automationRegistry: a,
    automationBinder: i,
    itemPatches: d,
    debugOutput: A,
    chatMessages: R,
    workflowHooks: T,
    automation: l,
    workflow: I,
    itemUseIntegration: $e,
    ritualPresetDiagnostic: p,
    ritualPresetApplications: h
  };
}
const { ApplicationV2: Fu } = foundry.applications.api;
class ge extends Fu {
  constructor(t, r) {
    super({
      id: `${u}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
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
      apply: ge.onApply,
      cancel: ge.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${S(tt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${S(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Ue("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Ue("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Ue("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Ue(e, t, r, n) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${n}"></i>
        <span>${S(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? Uu(r) : ju(t)}
    </section>
  `;
}
function Uu(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Bu).join("")}</ol>`;
}
function Bu(e) {
  const t = e.preset, r = t ? `${t.label} v${t.version}` : "Sem preset", n = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${S(e.appliedPresetId)} v${S(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${S(e.itemName)}</strong>
        <span>${S(e.reason)}</span>
        ${n}
      </div>
      <em>${S(r)}</em>
    </li>
  `;
}
function ju(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${S({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function S(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const he = `${u}.manageRitualPresets`, fr = `__${u}_ritualPresetHeaderControlRegistered`, xu = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Hu(e) {
  const t = globalThis;
  if (!t[fr]) {
    for (const r of xu)
      Hooks.on(r, (n, o) => {
        Vu(n, o, e);
      });
    t[fr] = !0, c.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Vu(e, t, r) {
  Array.isArray(t) && qu(e) && (Gu(e, r), !t.some((n) => n.action === he) && t.push({
    action: he,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), vn(e, r);
    }
  }));
}
function Gu(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[he] && (e.options.actions[he] = (r) => {
    r.preventDefault(), r.stopPropagation(), vn(e, t);
  }));
}
function qu(e) {
  if (!game.user?.isGM) return !1;
  const t = On(e);
  return t ? t.type === "agent" && ae(t).length > 0 : !1;
}
function vn(e, t) {
  const r = On(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new ge(r, t).render({ force: !0 });
}
function On(e) {
  return pr(e.actor) ? e.actor : pr(e.document) ? e.document : null;
}
function pr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let G = null;
Hooks.once("init", () => {
  uo(), No(), ra(), ca(), c.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!St.isSupportedSystem()) {
    c.warn(
      `Sistema não suportado: ${St.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  G = Mu(), G.itemUseIntegration.registerStrategies(), Ho(G), Jo(), Yo(), Hu(G), c.info("Inicializado para o sistema Ordem Paranormal."), c.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${tt} inicializado.`);
});
function Wu() {
  if (!G)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return G;
}
export {
  Wu as getToolkitServices
};
//# sourceMappingURL=main.js.map
