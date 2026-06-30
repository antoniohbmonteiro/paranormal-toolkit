const c = "paranormal-toolkit", dt = "Paranormal Toolkit", no = "ordemparanormal";
class ue {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function $e(e) {
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
function mt(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? f({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : ft(t) ? h(t.definition) : f({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function oo(e) {
  return ft(e.getFlag(c, "automation"));
}
function ft(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && so(t.source) && ao(t.definition);
}
function ao(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && _(t.label) && Array.isArray(t.steps) && t.steps.every(io);
}
function so(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? _(t.presetId) && _(t.presetVersion) && _(t.appliedAt) : t.type === "manual" ? _(t.label) && _(t.appliedAt) : !1;
}
function io(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return co(t);
    case "spendRitualCost":
      return lo(t);
    case "rollFormula":
      return uo(t);
    case "modifyResource":
      return mo(t);
    case "chatCard":
      return fo(t);
    default:
      return !1;
  }
}
function co(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Lr(t);
}
function lo(e) {
  return e.type === "spendRitualCost";
}
function uo(e) {
  const t = e;
  return t.type === "rollFormula" && _(t.id) && _(t.formula) && (t.intent === void 0 || yo(t.intent)) && (t.damageType === void 0 || _(t.damageType));
}
function mo(e) {
  const t = e;
  return t.type === "modifyResource" && po(t.actor) && go(t.resource) && ho(t.operation) && Lr(t);
}
function fo(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Lr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || _(e.amountFrom);
}
function po(e) {
  return e === "self" || e === "target";
}
function go(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function ho(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function yo(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function _(e) {
  return typeof e == "string" && e.length > 0;
}
function pt(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(Dt);
    if (bo(t))
      return Array.from(t).filter(Dt);
  }
  return [];
}
function Ao(e) {
  return pt(e)[0] ?? null;
}
function Ro(e) {
  return pt(e).find(oo) ?? null;
}
function bo(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Dt(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function de(e) {
  return pt(e).filter((t) => t.type === "ritual");
}
function Dr(e) {
  return de(e)[0] ?? null;
}
function ko(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map($e);
      return l.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = oe("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = fe(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(Ot);
      return l.info(`Presets encontrados para ${r.name}.`, n), n;
    },
    async applyPresetToFirstRitual(t) {
      const r = oe("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const n = fe(r);
      if (!n) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await Ke(e, n, o.value);
      l.info(`Preset ${o.value.id} aplicado em ${n.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = oe("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = fe(t);
      if (!r) return;
      const n = e.automationRegistry.findForItem(r)[0];
      if (!n) {
        l.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const o = await Ke(e, r, n.preset);
      l.info(`Melhor preset aplicado em ${r.name}.`, { match: Ot(n), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Nt(e);
    },
    async applyBestPresetsToActorRituals() {
      return Nt(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = oe("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = fe(t);
      r && (await e.automationBinder.clear(r), l.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function Nt(e) {
  const t = oe("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = de(t);
  if (r.length === 0)
    return l.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), vt(t);
  const n = vt(t, r.length);
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
    const s = await Ke(e, o, a.preset);
    n.applied.push(To(o, a, s));
  }
  return l.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), wo(n), n;
}
async function Ke(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function To(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: $e(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function vt(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function wo(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((n) => n.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function Ot(e) {
  return {
    preset: $e(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function oe(e) {
  const t = ue.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function fe(e) {
  const t = Dr(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function G(e) {
  return e ? {
    id: e.id,
    source: {
      ...$o(e.sourceActor),
      token: e.sourceToken
    },
    item: Co(e.item),
    targets: e.targets.map(_o),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Mt(e.rollRequests, Nr),
    rolls: Mt(e.rolls, So),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(gt),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function gt(e) {
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
function $o(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Co(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function _o(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Nr(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function So(e) {
  return {
    ...Nr(e),
    total: e.total
  };
}
function Mt(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function Io(e) {
  return {
    getSelected() {
      return ue.getSelectedActor();
    },
    logResources() {
      const t = B(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const r = e.ordem.getActorSnapshot(t);
      l.info("Recursos do ator selecionado:", r), r.resourceErrors.length > 0 && l.warn("Alguns recursos não puderam ser lidos pelo adapter.", r.resourceErrors);
    },
    async spendPE(t) {
      await W(
        e,
        "Gasto de PE",
        B("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await W(
        e,
        "Gasto de PD",
        B("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await W(
        e,
        "Dano em PV",
        B("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await W(
        e,
        "Cura de PV",
        B("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await W(
        e,
        "Dano em SAN",
        B("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await W(
        e,
        "Recuperação de SAN",
        B("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function W(e, t, r, n) {
  if (!r) return;
  const o = await n(r);
  if (!o.ok) {
    Po(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    l.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  l.info(`${t} realizado:`, gt(a));
}
function B(e) {
  const t = ue.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Po(e) {
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
function Eo() {
  pe(L.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), pe(L.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), pe(L.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), pe(L.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Ye() {
  return {
    enabled: ge(L.enabled),
    console: ge(L.console),
    ui: ge(L.ui),
    chat: ge(L.chat)
  };
}
async function F(e, t) {
  await game.settings.set(c, L[e], t);
}
function pe(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function ge(e) {
  return game.settings.get(c, e) === !0;
}
function Lo() {
  return {
    status() {
      return Ye();
    },
    async enable() {
      await F("enabled", !0);
    },
    async disable() {
      await F("enabled", !1);
    },
    async enableConsole() {
      await F("console", !0);
    },
    async disableConsole() {
      await F("console", !1);
    },
    async enableUi() {
      await F("ui", !0);
    },
    async disableUi() {
      await F("ui", !1);
    },
    async enableChat() {
      await F("chat", !0);
    },
    async disableChat() {
      await F("chat", !1);
    }
  };
}
const vr = "ritual.costOnly", Or = "ritual.simpleHealing", Do = "ritual.eletrocussao", Mr = "ritual.simpleDamage", Fr = "generic.simpleHealing", Ur = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function No() {
  return [
    vo(),
    Oo(),
    Mo(),
    Fo(),
    Uo()
  ];
}
function vo() {
  return {
    id: vr,
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
function Oo() {
  return {
    id: Or,
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
    automation: xr(),
    itemPatch: Bo()
  };
}
function Mo() {
  return {
    id: Do,
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
    automation: xo(),
    itemPatch: jo()
  };
}
function Fo() {
  return {
    id: Mr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: ht()
  };
}
function Uo() {
  return {
    id: Fr,
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
function xr(e = "2d8+2") {
  return Br(
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
function xo() {
  return {
    ...ht("1d8", {
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
function ht(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Br(
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
function Bo() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Ur,
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
function jo() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Ur,
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
function Br(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((n) => n.type !== "rollFormula" || n.id !== t ? n : {
      ...n,
      formula: r
    })
  };
}
function yt() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Y(t.id),
    actorId: Y(t.actor?.id),
    sceneId: Y(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function jr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: Y(e.id),
    actorId: Y(t?.id),
    sceneId: Y(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Y(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ho(e) {
  return {
    logFirstRitualCost() {
      const t = j("Nenhum ator encontrado para consultar custo de ritual.");
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
      const n = j("Nenhum ator encontrado para configurar custo customizado.");
      if (!n) return;
      const o = H(n);
      if (o) {
        if (!Vo(t, r)) {
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
      const t = j("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = H(t);
      r && (await r.unsetFlag(c, "ritual.cost"), l.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = j("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = H(t);
      if (!r) return;
      const n = e.automationRegistry.require(vr);
      if (!n.ok) {
        l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value), l.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = j("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const n = H(r);
      if (!n) return;
      if (!Ft(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Or);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: xr(t)
      }), l.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = j("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = H(r);
      if (!n) return;
      if (!Ft(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Mr);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: ht(t)
      }), l.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = j("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = H(t);
      r && await qo(e, t, r);
    }
  };
}
async function qo(e, t, r) {
  const n = mt(r);
  if (!n.ok) {
    l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: jr(),
    item: r,
    targets: yt()
  });
  if (!o.ok) {
    zo(o.error);
    return;
  }
  l.info("Automação de ritual executada com sucesso.", G(o.value.context));
}
function zo(e) {
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
function j(e) {
  const t = ue.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function H(e) {
  const t = Dr(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Vo(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Ft(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Go = ["disabled", "ask", "automatic"], Wo = ["buttons", "confirm"], Hr = "ask";
function Ko(e) {
  return typeof e == "string" && Go.includes(e);
}
function Yo(e) {
  return typeof e == "string" && Wo.includes(e);
}
function Qo(e) {
  return Ko(e) ? e : Yo(e) ? "ask" : Hr;
}
const Xo = ["keep", "replace"], qr = "keep", Zo = !0, D = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Jo() {
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
    default: Hr
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
    default: qr
  }), game.settings.register(c, D.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Zo
  }), game.settings.register(c, D.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Ut() {
  const e = Qo(game.settings.get(c, D.executionMode)), t = Vr(game.settings.get(c, D.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: zr()
  };
}
function ea() {
  return Vr(game.settings.get(c, D.systemCardMode));
}
function zr() {
  return game.settings.get(c, D.ritualCastingCheckEnabled) === !0;
}
async function q(e) {
  await game.settings.set(c, D.executionMode, e);
}
function Vr(e) {
  return Xo.includes(e) ? e : qr;
}
function ta(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await q("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await q("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await q(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await q("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await q("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await q("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await q("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const ra = [
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
function na(e) {
  return {
    phases() {
      return ra;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = ve("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = Ro(t);
      if (!r) {
        l.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await xt(e, t, r);
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
      if (!sa(r)) {
        l.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = aa(r) ?? ve("Nenhum ator encontrado para executar automação do item.");
      n && await xt(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = ve("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = Ao(t);
      if (!r) {
        l.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(Fr);
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
async function xt(e, t, r) {
  const n = mt(r);
  if (!n.ok) {
    l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: jr(),
    item: r,
    targets: yt()
  });
  if (!o.ok) {
    oa(o.error);
    return;
  }
  l.info("Automação executada com sucesso.", G(o.value.context));
}
function oa(e) {
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
function ve(e) {
  const t = ue.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function aa(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function sa(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ia(e) {
  const t = Io(e), r = ko(e), n = Ho(e), o = na(e), a = Lo(), s = ta(e);
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
function ca(e) {
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
    debug: ia(e)
  }, r = globalThis;
  return r[c] = t, r.ParanormalToolkit = t, t;
}
class Bt {
  static isSupportedSystem() {
    return game.system.id === no;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function la() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Q(t.id),
    actorId: Q(t.actor?.id),
    sceneId: Q(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Gr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, r = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: Q(e.id),
    actorId: Q(t?.id),
    sceneId: Q(e.scene?.id),
    name: r
  };
}
function ua(e, t = Gr()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function da(e) {
  if (!pa(e)) return null;
  const t = e.getFlag(c, "workflow");
  return fa(t) ? t : null;
}
function ma() {
  return `flags.${c}.workflow`;
}
function jt(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), r = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || r !== void 0;
}
function Ht(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Qe(t) || Qe(r);
}
function fa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function pa(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function Q(e) {
  return Qe(e) ? e : null;
}
function Qe(e) {
  return typeof e == "string" && e.length > 0;
}
function ga() {
  const e = (t, r) => {
    ha(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function ha(e, t) {
  const r = da(e);
  if (!r || r.targets.length === 0) return;
  const n = Aa(t);
  if (!n || n.querySelector(`.${c}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(ya(r));
}
function ya(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(qt("Origem", e.source.name)), t.append(qt("Alvo", e.targets.map((n) => n.name).join(", "))), t;
}
function qt(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${c}-chat-enrichment__row`);
  const n = document.createElement("span");
  n.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, r.append(n, o), r;
}
function Aa(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ra() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!ba(n) || !ka(e) || jt(e) || jt(t)) return;
    const o = la();
    if (o.length === 0 || !Ht(e) && !Ht(t)) return;
    const a = Gr();
    e.updateSource({
      [ma()]: ua(o, a)
    }), l.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function ba(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function ka(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const Wr = {
  enabled: "dice.animations.enabled"
};
function Ta() {
  game.settings.register(c, Wr.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function wa() {
  return {
    enabled: game.settings.get(c, Wr.enabled) === !0
  };
}
const $a = "chatCard", zt = "data-paranormal-toolkit-prompt-id", u = `${c}-item-use-prompt`, Ca = `.${u}__title`, Kr = `.${u}__header`, _a = `.${u}__roll-card`, Sa = `.${u}__roll-meta`, Ia = `.${u}__roll-meta-pill`, Pa = `.${u}__resistance`, Ea = `.${u}__resistance-header`, Yr = `.${u}__resistance-description`, La = `.${u}__resistance-roll-button`, Da = `.${u}__resistance-roll-result`, Vt = `${u}__resistance-content`, Qr = `.${u}__workflow-section`, Xr = `.${u}__workflow-roll`, Zr = `${u}__workflow-roll--dice-open`, Jr = `.${u}__workflow-roll-formula`, en = `${u}__workflow-roll-formula--toggle`, At = `.${u}__workflow-dice-tray`, Na = `.${u}__roll-detail-toggle`, va = `.${u}__roll-detail-list`, Oa = `.${u}__ritual-element-badge`, Ma = `.${u}__ritual-metadata`, Gt = "data-paranormal-toolkit-dice-toggle-enhanced", Wt = `${c}-workflow-dice-toggle-styles`, Fa = [0, 100, 500, 1500, 3e3];
let Kt = !1, Oe = null;
function Ua() {
  if (!Kt) {
    Kt = !0, xa(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ae(Qt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ae(Qt(t));
    }), Hooks.once("ready", () => {
      ae(document), Ha();
    }), document.addEventListener("click", Ba), document.addEventListener("keydown", ja);
    for (const e of Fa)
      globalThis.setTimeout(() => ae(document), e);
  }
}
function xa() {
  if (document.getElementById(Wt)) return;
  const e = document.createElement("style");
  e.id = Wt, e.textContent = `
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
function Ba(e) {
  const t = nn(e.target);
  if (!t) return;
  const r = bt(t);
  r && (e.preventDefault(), rn(r, t));
}
function ja(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = nn(e.target);
  if (!t) return;
  const r = bt(t);
  r && (e.preventDefault(), rn(r, t));
}
function Ha() {
  Oe || !document.body || (Oe = new MutationObserver((e) => {
    for (const t of e)
      for (const r of Array.from(t.addedNodes))
        (r instanceof HTMLElement || r instanceof DocumentFragment) && ae(r);
  }), Oe.observe(document.body, { childList: !0, subtree: !0 }));
}
function ae(e) {
  if (e) {
    Va(e), Ga(e), qa(e);
    for (const t of Array.from(e.querySelectorAll(Xr)))
      tn(t);
  }
}
function qa(e) {
  for (const t of Array.from(e.querySelectorAll(Pa))) {
    const r = t.querySelector(Ea), n = t.querySelector(Yr), o = t.querySelector(La), a = t.querySelector(Da);
    if (!o || !r && !n && !a) continue;
    const s = za(t, o);
    r && r.parentElement !== s && s.append(r), n && n.parentElement !== s && s.append(n), a && a.parentElement !== s && !o.contains(a) && s.append(a), o.parentElement !== t && t.append(o);
  }
}
function za(e, t) {
  const r = e.querySelector(`.${Vt}`);
  if (r) return r;
  const n = document.createElement("div");
  return n.classList.add(Vt), e.insertBefore(n, t.parentElement === e ? t : e.firstChild), n;
}
function Va(e) {
  for (const t of Array.from(e.querySelectorAll(Qr)))
    for (const r of Array.from(t.querySelectorAll(`${Na}, ${va}`)))
      r.remove();
}
function Ga(e) {
  for (const t of Array.from(e.querySelectorAll(_a))) {
    const r = Ja(t);
    Wa(t), r && (Ka(t, r), Ya(t, r));
  }
}
function Wa(e) {
  for (const t of Array.from(e.querySelectorAll(Sa)))
    t.remove();
}
function Ka(e, t) {
  const n = e.closest(`.${u}`)?.querySelector(Kr) ?? null, o = n?.querySelector(Ca) ?? null, a = n ?? e, s = a.querySelector(Oa);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const i = s ?? document.createElement("span");
  if (i.className = hs(t.elementTone), i.textContent = gs(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", i);
      return;
    }
    a.prepend(i);
  }
}
function Ya(e, t) {
  const r = Qa(e);
  Xa(e, r);
  const n = Za(t);
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
  const a = e.querySelector(Qr);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function Qa(e) {
  return e.closest(`.${u}`)?.querySelector(Kr) ?? null;
}
function Xa(e, t) {
  const r = [e, t].filter((n) => n !== null);
  for (const n of r)
    for (const o of Array.from(n.querySelectorAll(Ma)))
      o.remove();
}
function Za(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Xe(e.target)}` : null,
    e.duration ? `Duração: ${Xe(e.duration)}` : null,
    e.resistance ? `Resistência: ${on(e.resistance)}` : null
  ].filter(_e);
}
function Ja(e) {
  const t = es(e), r = ss(e), o = (t ? as(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = Rt(S(o, "element")), i = v("op.elementChoices", s) ?? Yt(V(a, "Elemento")) ?? Yt(r.damageType), m = s ?? ys(i), g = S(o, "circle") ?? V(a, "Círculo"), y = ls(o) ?? V(a, "Alvo"), R = fs(o, "duration", "op.durationChoices") ?? V(a, "Duração"), b = is(e) ?? ds(o) ?? V(a, "Resistência"), k = cs(a) ?? r.cost, d = {
    elementLabel: i,
    elementTone: m,
    circle: g,
    cost: k,
    target: y,
    duration: R,
    resistance: b
  };
  return ps(d) ? d : null;
}
function es(e) {
  const t = ts(e);
  if (!t) return null;
  const r = t.getFlag?.(c, $a), n = ns(r);
  if (n.length === 0) return null;
  const o = rs(e);
  if (o.size > 0) {
    const a = n.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return n.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function ts(e) {
  const r = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return r ? kt()?.messages?.get?.(r) ?? null : null;
}
function rs(e) {
  const t = e.closest(`.${u}`) ?? e, r = /* @__PURE__ */ new Set();
  for (const n of Array.from(t.querySelectorAll(`[${zt}]`))) {
    const o = n.getAttribute(zt)?.trim();
    o && r.add(o);
  }
  return r;
}
function ns(e) {
  if (!Ce(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(os).filter((r) => r !== null) : [];
}
function os(e) {
  return Ce(e) ? {
    pendingId: Ae(e.pendingId),
    actorId: Ae(e.actorId),
    itemId: Ae(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(ks) : []
  } : null;
}
function as(e) {
  if (!e.itemId) return null;
  const t = kt(), n = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return n || (t?.items?.get?.(e.itemId) ?? null);
}
function ss(e) {
  let t = null, r = null;
  for (const n of Array.from(e.querySelectorAll(Ia))) {
    const o = ee(n.textContent);
    if (!o) continue;
    const a = bs(o, "Tipo");
    a && (r = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: r };
}
function is(e) {
  const t = ee(e.querySelector(Yr)?.textContent);
  return t ? on(t) : null;
}
function V(e, t) {
  const r = ce(t);
  for (const n of e) {
    const o = n.indexOf(":");
    if (!(o < 0 || ce(n.slice(0, o)) !== r))
      return ee(n.slice(o + 1));
  }
  return null;
}
function cs(e) {
  const t = V(e, "Custo") ?? V(e, "PE");
  return t || (e.map(ee).find((r) => typeof r == "string" && /\b(P[ED]|PE|PD)\b/iu.test(r)) ?? null);
}
function ls(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return us(e) ?? v("op.targetChoices", t) ?? "Área";
  const r = v("op.targetChoices", t) ?? U(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, r].filter(_e).join(" ");
}
function us(e) {
  const t = S(e, "area.name"), r = S(e, "area.size"), n = S(e, "area.type"), o = t ? v("op.areaChoices", t) ?? U(t) : null, a = n ? v("op.areaTypeChoices", n) ?? U(n) : null;
  return o ? r ? a ? `${o} ${r}m ${Xe(a)}` : `${o} ${r}m` : o : null;
}
function ds(e) {
  const t = S(e, "skillResis"), r = S(e, "resistance");
  if (!t || !r) return null;
  const n = v("op.skill", t) ?? U(t), o = ms(r);
  return [n, o].filter(_e).join(" ");
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
    `${u}__ritual-element-badge`,
    e ? `${u}__ritual-element-badge--${e}` : null
  ].filter(_e).join(" ");
}
function Rt(e) {
  const t = ce(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Yt(e) {
  const t = Rt(e);
  return t ? v("op.elementChoices", t) ?? U(t) : e ? U(e) : null;
}
function ys(e) {
  return Rt(e);
}
function v(e, t) {
  if (!t) return null;
  const r = `${e}.${t}`, n = kt()?.i18n?.localize?.(r);
  return !n || n === r ? null : n;
}
function tn(e) {
  const t = e.querySelector(At);
  if (!t) return;
  const r = e.querySelector(Jr);
  if (r && r.getAttribute(Gt) !== "true" && (r.setAttribute(Gt, "true"), r.classList.add(en), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", "false"), r.title = "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title), t.hidden = !0, !r.querySelector("i"))) {
    const n = document.createElement("i");
    n.classList.add("fa-solid", "fa-chevron-down"), n.setAttribute("aria-hidden", "true"), r.append(n);
  }
}
function rn(e, t) {
  const r = e.querySelector(At);
  if (!r) return;
  const n = !e.classList.contains(Zr);
  As(e, t, r, n);
}
function As(e, t, r, n) {
  e.classList.toggle(Zr, n), r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.title = n ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !n), o.classList.toggle("fa-chevron-up", n));
}
function nn(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Jr);
  if (!t) return null;
  const r = bt(t);
  return r ? (tn(r), t.classList.contains(en) ? t : null) : null;
}
function bt(e) {
  const t = e.closest(Xr);
  return t && t.querySelector(At) ? t : null;
}
function S(e, t) {
  const r = Rs(e, t);
  return Ae(r);
}
function Rs(e, t) {
  return t.split(".").reduce((r, n) => Ce(r) ? r[n] : null, e);
}
function bs(e, t) {
  const r = e.indexOf(":");
  return r < 0 || ce(e.slice(0, r)) !== ce(t) ? null : ee(e.slice(r + 1));
}
function kt() {
  const e = globalThis.game;
  return Ce(e) ? e : null;
}
function Qt(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Ae(e) {
  return typeof e == "string" ? ee(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Ce(e) {
  return !!e && typeof e == "object";
}
function ks(e) {
  return typeof e == "string";
}
function _e(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function ee(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function ce(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Xe(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function U(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function on(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
const se = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, an = {
  PV: "system.attributes.hp"
}, Ze = {
  PV: [se.PV, an.PV],
  SAN: [se.SAN],
  PE: [se.PE],
  PD: [se.PD]
}, Je = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Ts {
  getResource(t, r) {
    const n = Xt(t, r);
    if (!n.ok)
      return f(n.error);
    const o = n.value, a = `${o}.value`, s = `${o}.max`, i = foundry.utils.getProperty(t, a), m = foundry.utils.getProperty(t, s), g = Jt(t, r, a, i, "valor atual");
    if (g) return f(g);
    const y = Jt(t, r, s, m, "valor máximo");
    return y ? f(y) : h({
      value: i,
      max: m
    });
  }
  async updateResourceValue(t, r, n) {
    const o = Xt(t, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: n });
  }
}
function Xt(e, t) {
  const r = ws(e.type, t);
  if (r && Zt(e, r))
    return h(r);
  const n = Ze[t].find(
    (o) => Zt(e, o)
  );
  return n ? h(n) : f({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: $s(e, t),
    path: Ze[t].join(" | ")
  });
}
function ws(e, t) {
  return e === "threat" ? an[t] ?? null : e === "agent" ? se[t] : null;
}
function Zt(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function $s(e, t) {
  const r = e.type ?? "unknown", n = Ze[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function Jt(e, t, r, n, o) {
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
class Cs {
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
      const s = Je.ritualItem.circleCandidates;
      return f({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: n, value: o } = r, a = _s(o);
    return a ? h(a) : f({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${n}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: n,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of Je.ritualItem.circleCandidates) {
      const n = foundry.utils.getProperty(t, r);
      if (n != null)
        return { path: r, value: n };
    }
    return null;
  }
}
function _s(e) {
  if (er(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (er(r))
      return r;
  }
  return null;
}
function er(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Ss = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Is {
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
    const n = r.value, o = Ps(t.ritual, n);
    return o.ok ? o.value ? h(o.value) : h({
      resource: "PE",
      amount: Ss[n],
      source: "default-by-circle",
      circle: n
    }) : f(o.error);
  }
}
function Ps(e, t) {
  const r = e.getFlag(c, "ritual.cost");
  return r == null ? { ok: !0, value: null } : Es(r) ? {
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
function Es(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Me = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ls(e) {
  if (!Fs(e.item)) return null;
  const t = et(e.actor) ? e.actor : Ds(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: vs(e.token) ?? Ns(t),
    targets: yt(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Ds(e) {
  const t = e;
  return et(t.actor) ? t.actor : et(e.parent) ? e.parent : null;
}
function Ns(e) {
  const t = Os(e) ?? Ms(e);
  return t ? sn(t) : null;
}
function vs(e) {
  return tt(e) ? sn(e) : null;
}
function Os(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return tt(r) ? r : (t.getActiveTokens?.() ?? []).find(tt) ?? null;
}
function Ms(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function sn(e) {
  const t = e.actor ?? null;
  return {
    tokenId: Fe(e.id),
    actorId: Fe(t?.id),
    sceneId: Fe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Fs(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function et(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function tt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function Fe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Us {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Me.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, l.info(`${Me.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = Ls(xs(t));
    if (!r) {
      l.warn(`${Me.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function xs(e) {
  return e && typeof e == "object" ? e : {};
}
class Bs {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return Ue("missing-item-patch");
    if (t.type !== "ritual") return Ue("unsupported-item-type");
    const o = js(n);
    return Object.keys(o).length === 0 ? Ue("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function js(e) {
  const t = {};
  T(t, "name", e.name), T(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (T(t, "system.circle", r.circle), T(t, "system.element", r.element), T(t, "system.target", r.target), T(t, "system.targetQtd", r.targetQuantity), T(t, "system.execution", r.execution), T(t, "system.range", r.range), T(t, "system.duration", r.duration), T(t, "system.skillResis", r.resistanceSkill), T(t, "system.resistance", r.resistance), T(t, "system.studentForm", r.studentForm), T(t, "system.trueForm", r.trueForm)), t;
}
function T(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function Ue(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Hs {
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
    return this.getNumber(t, Je.ritual.dt, 0);
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
class qs {
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
class zs {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = Vs(t);
    return r.ok ? this.presets.has(t.id) ? f({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, xe(t)), h(t)) : r;
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
    return r ? xe(r) : null;
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
    return Array.from(this.presets.values()).map(xe);
  }
  findForItem(t) {
    return this.list().map((r) => Gs(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function Vs(e) {
  return !Be(e.id) || !Be(e.version) || !Be(e.label) ? f({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? f({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : h(e);
}
function Gs(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = Ws(o, t);
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
function Ws(e, t) {
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
      const r = tr(t.name), n = e.names.map(tr).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Ks(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function tr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Ks(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function xe(e) {
  return structuredClone(e);
}
function Be(e) {
  return typeof e == "string" && e.length > 0;
}
function Re(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? f({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : h(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = Se(e.amountFrom);
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
function Se(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const Ys = "dice-so-nice";
async function cn(e) {
  if (!wa().enabled || !Qs()) return;
  const t = Xs();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      l.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function Qs() {
  return game.modules.get(Ys)?.active === !0;
}
function Xs() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Zs(e, t, r) {
  if (!rr(e.id) || !rr(e.formula))
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
    await cn(o);
    const i = {
      ...r.rollRequests[e.id] ?? ln(e, t),
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
function ln(e, t) {
  const r = e.intent ?? Js(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function Js(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function rr(e) {
  return typeof e == "string" && e.length > 0;
}
async function be(e, t, r, n, o) {
  switch (n) {
    case "spend":
      return r !== "PE" && r !== "PD" ? he(t, r, n, o) : e.spend(t, r, o);
    case "damage":
      return r !== "PV" && r !== "SAN" ? he(t, r, n, o) : e.damage(t, r, o);
    case "heal":
      return r !== "PV" ? he(t, r, n, o) : e.heal(t, r, o);
    case "recover":
      return r !== "SAN" ? he(t, r, n, o) : e.recover(t, r, o);
  }
}
function he(e, t, r, n) {
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
function ei(e) {
  const { step: t, context: r, transaction: n, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = ti(t, r, n, o);
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
    const s = ri(t, r, n, o);
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
function ti(e, t, r, n) {
  const o = Se(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: un(t.id, "damage", n, t.damageInstances.length),
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
function ri(e, t, r, n) {
  const o = Se(e.amountFrom);
  return {
    id: un(t.id, "healing", n, t.healingInstances.length),
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
function un(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function ni(e, t, r) {
  const n = Se(e.amountFrom), o = n ? t.rolls[n] : void 0;
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
function oi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", r, { stepIndex: n, step: t, metadata: o }), dn("before", e), nr("before", e), nr("resolve", e);
}
function ai(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("apply", r, { stepIndex: n, step: t, metadata: o }), dn("apply", e);
}
function si(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", r, { stepIndex: n, step: t, metadata: o });
}
function dn(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t, i = ii(e, r.operation);
  i && s.emit(i, n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function nr(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function ii(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function ci(e, t, r) {
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
async function li(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return di(e, t);
    case "spendRitualCost":
      return mi(e, t);
  }
}
async function di(e, t) {
  const { context: r, resources: n } = e, o = Re(t, r);
  return o.ok ? mn(await n.spend(r.sourceActor, t.resource, o.value), r) : f(o.error);
}
async function mi(e, t) {
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
  }), mn(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function mn(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), h(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), f({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function fi(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: o, execute: a } = e, s = pi(t);
  for (const m of s.before)
    o.emit(m, r, { stepIndex: n, step: t });
  const i = await a();
  if (!i.ok)
    return i;
  for (const m of s.after)
    o.emit(m, r, { stepIndex: n, step: t });
  return i;
}
function pi(e) {
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
class gi {
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
        return fi({
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
    const o = await li({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? h(void 0) : f({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const o = ln(t, n);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, n, t);
    const a = await this.runRollFormulaStep(t, r, n);
    if (!a.ok)
      return a;
    const s = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, n, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: o, rollResult: s }), h(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const o = await Zs(t, n, r);
    return o.ok ? h(void 0) : f({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const o = Re(t, r);
    if (!o.ok)
      return f({ ...o.error, stepIndex: n, step: t, context: r });
    const a = ni(t, r, o.value);
    oi({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), ai({
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
      const m = await be(this.resources, i, t.resource, t.operation, o.value), g = this.handleResourceOperationResult(m, r, n, t);
      if (!g.ok)
        return g;
      ei({
        step: t,
        context: r,
        transaction: g.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return si({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), h(void 0);
  }
  async runModifyResourceStep(t, r, n) {
    const o = Re(t, r);
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
      const i = await be(this.resources, s, t.resource, t.operation, o.value), m = this.handleResourceOperationResult(i, r, n, t);
      if (!m.ok)
        return m;
    }
    return h(void 0);
  }
  async runChatCardStep(t, r, n) {
    const o = await ci(this.messages, t, r);
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
    const i = hi(t, r.intent);
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
function hi(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class yi {
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
    const { afterValue: m, appliedAmount: g } = i.value, y = {
      value: m,
      max: s.max
    };
    try {
      m !== s.value && await this.adapter.updateResourceValue(t, r, m);
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
function fn(e) {
  return {
    id: Ai(),
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
function Ai() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ri {
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
    return G(this.lastContext);
  }
  async runAutomation(t, r) {
    const n = fn(r);
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
class bi {
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
class ki {
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
    const r = Ye();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Ti(),
      flags: {
        ...t.flags,
        [c]: {
          ...wi(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && l.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = Ye();
    if (!n.enabled)
      return;
    const o = r.notification ?? or(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, o);
  }
  emitConsole(t, r) {
    const n = or(r);
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
function or(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Ti() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function wi(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const $i = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", pn = `${c}-inline-roll-neutralized`, Ci = `${c}-inline-roll-notice`, Tt = `data-${c}-inline-roll-neutralized`, ar = `data-${c}-inline-roll-notice`, _i = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function sr(e) {
  const t = Bi(e.message), r = await Si(e.message), n = Ii(t);
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
async function Si(e) {
  const t = Fi(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = Pi(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await Ui(t, r.content), replacementCount: r.replacementCount };
}
function Ii(e) {
  const t = e ? xi(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = gn(t);
  return r > 0 && hn(vi(t)), { replacementCount: r };
}
function Pi(e) {
  const t = Ei(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = gn(r.content), o = t.replacementCount + n;
  return o === 0 ? { content: e, replacementCount: 0 } : (hn(r.content), { content: r.innerHTML, replacementCount: o });
}
function Ei(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, o) => (t += 1, Di(o.trim()))), replacementCount: t };
}
function gn(e) {
  const t = Li(e);
  for (const r of t)
    r.replaceWith(Ni(Oi(r)));
  return t.length;
}
function Li(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll($i))
    r.getAttribute(Tt) !== "true" && t.add(r);
  return Array.from(t);
}
function Di(e) {
  return `<span class="${pn}" ${Tt}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${ji(e)}</span>`;
}
function Ni(e) {
  const t = document.createElement("span");
  return t.classList.add(pn), t.setAttribute(Tt, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function hn(e) {
  if (e.querySelector?.(`[${ar}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Ci), t.setAttribute(ar, "true"), t.textContent = _i, e.append(t);
}
function vi(e) {
  return e.querySelector(".message-content") ?? e;
}
function Oi(e) {
  const r = e.getAttribute("data-formula") ?? Mi(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function Mi(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Fi(e) {
  return e && typeof e == "object" ? e : null;
}
async function Ui(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return l.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function xi(e) {
  const t = Hi(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Bi(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function ji(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Hi(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const ir = "occultism";
function qi(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function zi(e) {
  const t = qi(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await Vi(e, ir);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await cn(r);
  const n = Ki(r);
  return {
    skill: ir,
    skillLabel: "Ocultismo",
    roll: r,
    formula: Wi(r),
    total: n,
    difficulty: t,
    success: n >= t,
    diceBreakdown: Yi(r)
  };
}
async function Vi(e, t) {
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
  return Gi(n);
}
function Gi(e) {
  return cr(e) ? e : Array.isArray(e) ? e.find(cr) ?? null : null;
}
function cr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Wi(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Ki(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Yi(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(Qi);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Qi(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const yn = ["base", "discente", "verdadeiro"];
function An(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Xi(e) {
  return typeof e == "string" && yn.includes(e);
}
const { ApplicationV2: Zi } = foundry.applications.api;
class ie extends Zi {
  constructor(t, r) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = r;
  }
  input;
  resolveRequest;
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
      cast: ie.onCast,
      cancel: ie.onCancel
    }
  };
  static async request(t) {
    return new Promise((r) => {
      new ie(t, r).render({ force: !0 });
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
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${C(dt)}</p>
        <div>
          <h2>${C(t)}</h2>
          <p>${C(ac(this.input.ritual))}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.input.variantOptions.map((a) => Ji(a, this.input.cost)).join("")}
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
          <div><dt>Custo base</dt><dd>${C(n)}</dd></div>
          <div><dt>Conjurador</dt><dd>${C(this.input.actor.name ?? "Ator sem nome")}</dd></div>
          <div><dt>Alvos</dt><dd>${C(r)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.input.automationStatus ?? "assisted"}">
        <h3>Automação</h3>
        ${tc(this.input)}
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
    const r = oc(t), n = rc(r, this.input.defaultSpendResource);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function Ji(e, t) {
  const r = e.variant === "base" ? "checked" : "", n = e.enabled ? "" : "disabled", o = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", a = e.finalCostText ?? ec(t), s = [...e.details, e.enabled ? "" : e.unavailableReason ?? "não disponível neste ritual"].filter((i) => i.trim().length > 0).filter((i) => !i.toLocaleLowerCase().startsWith("custo final")).map((i) => `<span>${C(i)}</span>`).join("");
  return `
    <label class="paranormal-toolkit-ritual-cast__form${o}">
      <input type="radio" name="variant" value="${C(e.variant)}" ${r} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${C(e.label)}</strong>
        <em>${C(a)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${s}</span>
    </label>
  `;
}
function ec(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function tc(e) {
  return e.automationStatus === "generic" ? `
      <p><strong>Sem automação configurada.</strong></p>
      <p>O Toolkit vai registrar a conjuração e gastar o recurso escolhido. Rolagens, dano, resistência e efeitos continuam manuais.</p>
    ` : `
    <p><strong>Automação assistida disponível.</strong></p>
    <p>O Toolkit vai preparar custo, rolagens e ações assistidas no card persistente do chat.</p>
  `;
}
function rc(e, t) {
  const r = nc(e), n = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: n
  };
}
function nc(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  return Xi(t) ? t : "base";
}
function oc(e) {
  return (e.currentTarget instanceof HTMLElement ? e.currentTarget : null)?.closest(".paranormal-toolkit-ritual-cast") ?? null;
}
function ac(e) {
  const t = e.system, r = [ic(t?.element), sc(t?.circle)].filter(cc);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function sc(e) {
  return typeof e != "number" || !Number.isFinite(e) ? null : `${e}º Círculo`;
}
function ic(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function cc(e) {
  return typeof e == "string" && e.length > 0;
}
function C(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function lc(e) {
  return ie.request(e);
}
const Rn = {
  label: "Padrão"
};
class uc {
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
    const n = this.resolveCostPreview(t), o = Mc(r, n), a = await lc({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((d) => d.name),
      cost: n,
      defaultSpendResource: jc(r),
      variantOptions: o,
      automationStatus: xc(r) ? "generic" : "assisted"
    });
    if (!a)
      return { status: "cancelled" };
    const s = Bc(r, a.variant), i = zr();
    let m = null;
    if (i) {
      const d = await mc(this.resources, t.actor, a, s, n);
      if (!d.ok)
        return {
          status: "failed",
          reason: d.reason,
          message: d.message
        };
      try {
        m = await zi(t.actor);
      } catch (P) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: P instanceof Error ? P.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: P
        };
      }
      if (!m.success) {
        const P = ur(t, a);
        return {
          status: "completed-without-actions",
          workflowContext: P,
          summaryLines: je(r, a, s, n, P, m, {
            effectStopped: !0
          })
        };
      }
    }
    const g = dc(r, a, s, n, {
      includeCostSteps: !i
    });
    if (g.steps.length === 0) {
      const d = ur(t, a);
      return {
        status: "completed-without-actions",
        workflowContext: d,
        summaryLines: je(r, a, s, n, d, m)
      };
    }
    const y = await this.workflow.runAutomation(g, {
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
    if (!y.ok)
      return {
        status: "failed",
        reason: y.error.reason,
        message: y.error.message,
        cause: y.error
      };
    const R = y.value.context, b = pc(r, t, R), k = je(r, a, s, n, R, m);
    return b.ok ? b.actions.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: R,
      summaryLines: k
    } : {
      status: "ready",
      workflowContext: R,
      actions: b.actions,
      summaryLines: k
    } : {
      status: "failed",
      reason: b.reason,
      message: b.message
    };
  }
  async applyAction(t) {
    return be(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function dc(e, t, r, n, o) {
  const a = [];
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || wt(s) && (!o.includeCostSteps || !t.spendResource) || a.push(fc(s, r));
  return o.includeCostSteps && t.spendResource && n && Hc(r.extraCost) && a.push({
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
async function mc(e, t, r, n, o) {
  if (!r.spendResource) return { ok: !0 };
  const a = Ie(o, n);
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
function fc(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function pc(e, t, r) {
  const n = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const a = Re(o, r);
    if (!a.ok)
      return {
        ok: !1,
        reason: a.error.reason,
        message: a.error.message
      };
    const s = wc(o.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(...gc(e, o, i, a.value));
  }
  return { ok: !0, actions: n };
}
function gc(e, t, r, n) {
  if (!Rc(e, t))
    return [lr(t, r, n)];
  const o = Tc();
  return bn(e).map((a) => {
    const s = bc(n, a);
    return lr(t, r, s, {
      option: a,
      choiceGroupId: o
    });
  });
}
function lr(e, t, r, n) {
  const o = t.name ?? "Ator sem nome", a = Ac(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: hc(e, o, r, n?.option),
    executedLabel: yc(e, o, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function hc(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function yc(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Ac(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Rc(e, t) {
  return t.operation === "damage" && t.resource === "PV" && bn(e).length > 1;
}
function bn(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function bc(e, t) {
  const r = e * t.multiplier, n = kc(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function kc(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Tc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function wc(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function je(e, t, r, n, o, a = null, s = {}) {
  const i = s.effectStopped === !0;
  return [
    `Forma: ${An(t.variant)}`,
    Cc(t, r, n),
    ...$c(a),
    ...i ? [] : Object.values(o.rolls).flatMap(_c),
    ...i ? [] : Sc(e.resistance),
    ...vc(r),
    ...i ? ["Observação: O efeito do ritual não foi resolvido porque a conjuração falhou."] : []
  ];
}
function $c(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Cc(e, t, r) {
  const n = Ie(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function _c(e) {
  const r = [`${Oc(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = Ic(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${Nc(e.damageType)}`), r;
}
function Sc(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function Ic(e) {
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
    const s = Pc(a);
    s && (Dc(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function Pc(e) {
  const t = Ec(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Lc(e);
}
function Ec(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function Lc(e) {
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
function Dc(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function Nc(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function vc(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Oc(e) {
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
function Mc(e, t) {
  return yn.map((r) => {
    const n = kn(e, r), o = r === "base" || n !== null, a = n ?? (r === "base" ? Rn : null);
    return {
      variant: r,
      label: a?.label ?? An(r),
      enabled: o,
      details: a ? Fc(a, t) : [],
      finalCostText: a ? Uc(t, a) : null,
      unavailableReason: o ? void 0 : "não disponível neste ritual"
    };
  });
}
function Fc(e, t) {
  const r = [], n = Object.values(e.rollFormulaOverrides ?? {});
  n.length > 0 && r.push(n.join(", "));
  const o = Ie(t, e);
  return r.push(o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"), r;
}
function Ie(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function Uc(e, t) {
  const r = Ie(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function xc(e) {
  return !e.ritualForms && !e.resistance && e.steps.length > 0 && e.steps.every(wt);
}
function ur(e, t) {
  return fn({
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
function Bc(e, t) {
  return kn(e, t) ?? Rn;
}
function kn(e, t) {
  return e.ritualForms?.[t] ?? null;
}
function jc(e) {
  return e.steps.some(wt);
}
function wt(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Hc(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function qc(e, t) {
  const r = await zc(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: Gc(r),
    total: Wc(r),
    diceBreakdown: Kc(r)
  };
}
function Tn(e) {
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
async function zc(e, t) {
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
  return Vc(n);
}
function Vc(e) {
  return dr(e) ? e : Array.isArray(e) ? e.find(dr) ?? null : null;
}
function dr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Gc(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Wc(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Kc(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(Yc);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Yc(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const wn = "itemUsePrompts", $n = "chatCard", Pe = "data-paranormal-toolkit-prompt-id", Ee = "data-paranormal-toolkit-pending-id", $t = "data-paranormal-toolkit-executed-label", rt = "data-paranormal-toolkit-choice-group", Cn = "data-paranormal-toolkit-skipped-label", mr = "data-paranormal-toolkit-action-section", fr = "data-paranormal-toolkit-detail-key", pr = "data-paranormal-toolkit-roll-card", Ct = "data-paranormal-toolkit-roll-detail-toggle", _n = "data-paranormal-toolkit-roll-detail-id", Sn = "data-paranormal-toolkit-resistance-roll-button", In = "data-paranormal-toolkit-resistance-skill", Pn = "data-paranormal-toolkit-resistance-skill-label", En = "data-paranormal-toolkit-resistance-target-actor-id", Ln = "data-paranormal-toolkit-resistance-target-name", Dn = "data-paranormal-toolkit-resistance-roll-result", gr = "data-paranormal-toolkit-system-card-replaced", Qc = `[${Ee}]`, Xc = `[${Ct}]`, Zc = `[${Sn}]`, nt = `${c}-chat-enrichment`, p = `${c}-item-use-prompt`, Jc = `${p}__actions`, hr = `${p}__details`, Nn = `${p}__summary`, el = `${p}__title`, vn = `${p}__button--executed`, yr = `${p}__roll-card`;
let Ar = !1, ot = null;
const I = /* @__PURE__ */ new Map(), tl = [0, 100, 500, 1500, 3e3], rl = 3e4, nl = [0, 100, 500, 1500, 3e3];
function ol(e) {
  if (ot = e, Ar) {
    br(e);
    return;
  }
  const t = (r, n) => {
    Mn(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Ar = !0, br(e);
}
async function Rr(e) {
  const t = On(e);
  I.set(e.pendingId, t), await It(t) || Gn(t), Fn(e.pendingId);
}
async function al(e) {
  const t = On({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", I.set(e.pendingId, t), await It(t) || Gn(t), Fn(e.pendingId);
}
async function He(e, t) {
  const r = I.get(e);
  I.delete(e), r && await ou(r, t);
}
function _t(e) {
  const t = Zn();
  for (const r of t) {
    const n = M(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function sl(e, t) {
  const r = _t(e);
  if (!r) return;
  const n = M(r.message), o = n[e];
  o && (n[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await te(r.message, n));
}
async function il(e, t, r) {
  if (!t) return;
  const n = _t(e);
  if (!n) return;
  const o = M(n.message);
  let a = !1;
  for (const [s, i] of Object.entries(o))
    s !== e && i.choiceGroupId === t && (o[s] = {
      ...i,
      executedLabel: r ?? i.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await te(n.message, o);
}
function On(e) {
  const t = x(e.context.message), r = e.context.targets.find((s) => ct(s)), n = r ? ct(r) : null, o = e.resistanceTargetActor ?? n, a = e.resistanceTargetName ?? r?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Nl(e.context),
    executed: !1
  };
}
function Mn(e, t, r) {
  nu();
  const n = De(t);
  if (!n) return;
  const o = eu(e, n);
  o.length > 0 && ke(n);
  for (const a of o)
    at(n, a);
  Bn(n, r), st(n), it(n);
}
function br(e) {
  for (const t of nl)
    globalThis.setTimeout(() => {
      cl(e);
    }, t);
}
function cl(e) {
  for (const t of ll()) {
    const r = Le(t);
    ul(r) && Mn(r, t, e);
  }
}
function ll() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function ul(e) {
  return e ? Pt(e) ? !0 : su(e).length > 0 : !1;
}
function Fn(e) {
  const t = I.get(e);
  if (!t) return;
  const r = t.messageId ? tu(t.messageId) : null;
  if (r) {
    Cr(r, t), ke(r), at(r, t), kr(r), st(r), it(r);
    return;
  }
  if (t.messageId) {
    ut(t);
    return;
  }
  const n = ru(t);
  if (n) {
    Cr(n, t), ke(n), at(n, t), kr(n), st(n), it(n);
    return;
  }
  ut(t);
}
function kr(e) {
  ot && Bn(e, ot);
}
function ke(e) {
  const t = dl();
  e.classList.toggle(`${p}--system-card-replaced`, t);
  const r = xn(e);
  if (!r || (r.classList.toggle(`${p}__host--system-card-replaced`, t), !t) || r.getAttribute(gr) === "true") return;
  const n = r.querySelector(`.${nt}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(gr, "true");
}
function dl() {
  try {
    return ea() === "replace";
  } catch {
    return !1;
  }
}
function at(e, t) {
  if (ke(e), e.querySelector(`[${Pe}="${re(t.pendingId)}"]`)) return;
  const r = ml(e, t);
  pl(r, t), Il(r, Pl(t)).append(Dl(t));
}
function ml(e, t) {
  const r = e.querySelector(`.${nt}`);
  if (r)
    return r;
  const n = document.createElement("section");
  n.classList.add(nt, p);
  const o = document.createElement("header");
  o.classList.add(`${p}__header`);
  const a = document.createElement("span");
  a.classList.add(`${p}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(el), s.textContent = fl(t);
  const i = document.createElement("span");
  return i.classList.add(Nn), i.textContent = t.summary, o.append(a, s, i), n.append(o), Ol(e).append(n), n;
}
function fl(e) {
  const t = w(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function pl(e, t) {
  const r = t.summaryLines ?? [], n = zn(r, t);
  if (n) {
    gl(e, n, t);
    return;
  }
  El(e, r);
}
function gl(e, t, r) {
  if (e.querySelector(`[${pr}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(yr, `${yr}--${t.intent}`), n.setAttribute(pr, "true"), t.castingCheck && Tr(n, yl(t.castingCheck), r.pendingId, "casting"), hl(t) && Tr(n, Al(t), r.pendingId, "effect"), wl(n, t), $l(n, t, r), Sl(n, t), e.append(n);
}
function hl(e) {
  return e.intent !== "casting";
}
function yl(e) {
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
function Al(e) {
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
function Tr(e, t, r, n) {
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
  Rl(o, t), _l(o, t.detailRows, r, n, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Rl(e, t) {
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-roll`);
  const n = document.createElement("span");
  n.classList.add(`${p}__workflow-roll-formula`), n.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${p}__workflow-roll-total`), o.textContent = String(t.total), r.append(n, o);
  const a = bl(t.formula, t.diceBreakdown);
  a && r.append(a), e.append(r);
}
function bl(e, t) {
  const r = kl(t);
  if (r.length === 0) return null;
  const n = document.createElement("div");
  n.classList.add(`${p}__workflow-dice-tray`);
  for (const o of Tl(r, e)) {
    const a = document.createElement("span");
    a.classList.add(`${p}__workflow-die`), o.active || a.classList.add(`${p}__workflow-die--inactive`), a.textContent = String(o.value), n.append(a);
  }
  return n;
}
function kl(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((n) => Number(n.trim())).filter((n) => Number.isFinite(n)).map((n) => Math.trunc(n)) : [];
}
function Tl(e, t) {
  if (e.length <= 1) return e.map((n) => ({ value: n, active: !0 }));
  const r = t.toLowerCase();
  return r.includes("kh") ? wr(e, "highest") : r.includes("kl") ? wr(e, "lowest") : e.map((n) => ({ value: n, active: !0 }));
}
function wr(e, t) {
  const r = t === "highest" ? Math.max(...e) : Math.min(...e);
  let n = !1;
  return e.map((o) => {
    const a = !n && o === r;
    return a && (n = !0), { value: o, active: a };
  });
}
function wl(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter($u);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__roll-meta`);
  for (const o of r) {
    const a = document.createElement("span");
    a.classList.add(`${p}__roll-meta-pill`), a.textContent = o, n.append(a);
  }
  e.append(n);
}
function $l(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${p}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = Cl(t, r);
  o.append(a), s && o.append(s);
  const i = document.createElement("span");
  i.classList.add(`${p}__resistance-description`), i.textContent = t.resistance, n.append(o, i), t.resistanceRollResult && n.append(Un(t.resistanceRollResult)), e.append(n);
}
function Cl(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${p}__resistance-roll-button`), r.setAttribute(Pe, t.pendingId), r.setAttribute(Sn, "true"), r.setAttribute(In, e.resistanceSkill), r.setAttribute(Pn, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(En, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(Ln, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${p}__resistance-roll-button--rolled`), r.setAttribute(Dn, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${p}__resistance-roll-fallback`), o.textContent = "d20", r.append(n, o), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function Un(e) {
  const t = document.createElement("span");
  return t.classList.add(`${p}__resistance-roll-result`), t.textContent = Hn(e), t;
}
function _l(e, t, r, n, o) {
  const a = t.filter((g) => g.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${r}-roll-details-${n}`, i = document.createElement("button");
  i.type = "button", i.classList.add(`${p}__roll-detail-toggle`), i.setAttribute(Ct, s), i.setAttribute("aria-expanded", "false"), i.textContent = o;
  const m = document.createElement("dl");
  m.classList.add(`${p}__roll-detail-list`), m.setAttribute(_n, s), m.hidden = !0;
  for (const g of a) {
    const y = document.createElement("dt");
    y.textContent = g.label;
    const R = document.createElement("dd");
    R.textContent = g.value, m.append(y, R);
  }
  e.append(i, m);
}
function Sl(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-notes`);
  for (const n of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = n, r.append(o);
  }
  e.append(r);
}
function Il(e, t) {
  const r = `[${mr}="${re(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const o = document.createElement("div");
  o.classList.add(Jc), o.setAttribute(mr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${p}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function Pl(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = zn(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function El(e, t) {
  if (t.length === 0) return;
  const r = Ll(e);
  for (const n of t) {
    const o = Cu(n);
    if (r.querySelector(`[${fr}="${re(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = n, a.setAttribute(fr, o), r.append(a);
  }
}
function Ll(e) {
  const t = e.querySelector(`.${hr}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(hr), e.append(r), r;
}
function Dl(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${p}__button`), t.setAttribute(Pe, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(vn), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Ee, e.pendingId), t.setAttribute($t, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(rt, e.choiceGroupId), t.setAttribute(Cn, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Nl(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = vl(e);
  return `${t} → ${r}`;
}
function vl(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Ol(e) {
  return xn(e) ?? e;
}
function xn(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Bn(e, t) {
  const r = De(e);
  if (!r) return;
  const n = r.querySelectorAll(Qc);
  for (const o of n)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Yl(o, t);
    }));
}
function st(e) {
  const t = De(e);
  if (!t) return;
  const r = t.querySelectorAll(Xc);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      Ml(t, n);
    }));
}
function it(e) {
  const t = De(e);
  if (!t) return;
  const r = t.querySelectorAll(Zc);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      Fl(t, n);
    }));
}
function Ml(e, t) {
  const r = t.getAttribute(Ct);
  if (!r) return;
  const n = e.querySelector(`[${_n}="${re(r)}"]`);
  if (!n) return;
  const o = n.hidden;
  n.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Fl(e, t) {
  const r = t.getAttribute(Pe), n = t.getAttribute(In), o = t.getAttribute(Pn) ?? (n ? Tn(n) : "Resistência");
  if (!r || !n) return;
  const a = Bl(e, r), s = jl(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const m = await qc(s, n);
    await Gl(m.roll);
    const g = {
      skill: n,
      skillLabel: o,
      formula: m.formula,
      total: m.total,
      targetName: s.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: m.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Ul(t, g), xl(t, g), Wl(r, g), await Kl(e, r, g);
  } catch (m) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", m), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function Ul(e, t) {
  e.classList.add(`${p}__resistance-roll-button--rolled`), e.setAttribute(Dn, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function xl(e, t) {
  const r = e.closest(`.${p}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${p}__resistance-roll-result`), o = n ?? Un(t);
  if (n) {
    n.textContent = Hn(t);
    return;
  }
  r.append(o);
}
function Bl(e, t) {
  const r = I.get(t);
  if (r) return r;
  const n = Le(e);
  return M(n)[t] ?? null;
}
function jl(e, t) {
  const r = e?.resistanceTargetActor;
  if (N(r)) return r;
  const o = e?.context?.targets.map(ct).find(N) ?? null;
  if (o) return o;
  const a = t.getAttribute(En) ?? e?.resistanceTargetActorId ?? null, s = a ? ql(a) : null;
  return s || zl(
    t.getAttribute(Ln) ?? e?.resistanceTargetName ?? Hl(t)
  );
}
function Hl(e) {
  const r = e.closest(`.${p}`)?.querySelector(`.${Nn}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const o = r.split(n), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function ct(e) {
  const t = e.actor;
  if (N(t)) return t;
  const r = e.token, n = le(r);
  if (n) return n;
  const o = e.document;
  return le(o);
}
function le(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (N(t)) return t;
  const r = e.document?.actor;
  return N(r) ? r : null;
}
function ql(e) {
  const r = game.actors?.get?.(e);
  return N(r) ? r : jn().map((a) => le(a)).find((a) => a?.id === e) ?? null;
}
function zl(e) {
  const t = X(e);
  if (!t) return null;
  const r = jn().filter((a) => X(Vl(a)) === t).map((a) => le(a)).find(N) ?? null;
  if (r) return r;
  const o = game.actors?.find?.((a) => N(a) && X(a.name) === t);
  return N(o) ? o : null;
}
function jn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Vl(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : le(e)?.name ?? null;
}
function X(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function N(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Hn(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Gl(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Wl(e, t) {
  const r = I.get(e);
  r && (r.resistanceRollResult = t);
}
async function Kl(e, t, r) {
  const n = Le(e);
  if (n)
    try {
      const o = M(n), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: r
      }, await te(n, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Le(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return O(n?.get?.(r));
}
async function Yl(e, t) {
  const r = e.getAttribute(Ee);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    qn(e, e.getAttribute($t) ?? "✓ Automação aplicada"), Ql(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function qn(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(vn), e.removeAttribute(Ee), e.removeAttribute($t);
}
function Ql(e) {
  const t = e.getAttribute(rt);
  if (!t) return;
  const r = e.closest(`.${p}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${rt}="${re(t)}"]`;
  for (const o of r.querySelectorAll(n)) {
    if (o === e) continue;
    const a = o.getAttribute(Cn) ?? "✓ Outra opção escolhida";
    qn(o, a);
  }
}
function zn(e, t) {
  const r = e.map(St).filter(Tu), n = r.find((d) => d.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const o = w(e, "Forma"), a = w(e, "Custo"), s = w(e, "Dados") ?? w(e, `Dados (${n.label})`), i = w(e, "Tipo"), m = w(e, "Resistência"), g = w(e, "Resistência Perícia"), y = w(e, "Resistência Rótulo") ?? (g ? Tn(g) : null), R = Vn(e, "Observação"), b = e.filter((d) => Jl(d, n)), k = Xl(e);
  return {
    ...n,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: s,
    damageType: i,
    resistance: m,
    resistanceSkill: g,
    resistanceSkillLabel: y,
    notes: R,
    details: b,
    castingCheck: k,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function Xl(e) {
  const t = e.map(St).find((a) => a?.intent === "casting") ?? null, r = w(e, "Conjuração DT"), n = w(e, "Conjuração Resultado");
  if (!t || !r || !n) return null;
  const o = Number(r);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: w(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: n.toLowerCase() === "sucesso",
    diceBreakdown: w(e, "Dados (Conjuração)")
  } : null;
}
function St(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, n, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: r,
    formula: n,
    total: a,
    intent: Zl(r)
  } : null;
}
function Zl(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function w(e, t) {
  return Vn(e, t)[0] ?? null;
}
function Vn(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const o = n.slice(r.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Jl(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || St(e) ? !1 : e.trim().length > 0;
}
function eu(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of I.values())
    lt(n, e, t) && r.set(n.pendingId, n);
  for (const n of au(e))
    lt(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, o) => n.createdAt - o.createdAt);
}
function lt(e, t, r) {
  const n = x(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !$r(r, "itemId", e.itemId) ? !1 : !e.actorId || $r(r, "actorId", e.actorId);
}
function $r(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${_u(t)}`;
  for (const o of e.querySelectorAll(`[${n}]`))
    if (o.getAttribute(n) === r)
      return !0;
  return !1;
}
function tu(e) {
  const t = re(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function ru(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (lt(e, null, t))
      return t;
  return null;
}
function nu() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of I.entries())
    e - n.createdAt > t && I.delete(r);
}
async function Cr(e, t) {
  const r = Le(e);
  if (!r) return !1;
  try {
    const n = M(r);
    return n[t.pendingId] = Et(t, x(r)), await te(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function It(e) {
  const t = Yn(e);
  if (!t) return !1;
  try {
    const r = M(t);
    return r[e.pendingId] = Et(e, x(t)), await te(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function Gn(e) {
  for (const t of tl)
    globalThis.setTimeout(() => {
      ut(e);
    }, t);
}
async function ut(e) {
  const t = Yn(e);
  if (Pt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const n = await It(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function ou(e, t) {
  const r = Kn(e.context.message);
  if (r)
    try {
      const n = M(r), o = n[e.pendingId] ?? Et(e, x(r));
      n[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await te(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function au(e) {
  return Object.values(M(O(e))).filter(me);
}
function M(e) {
  if (!e) return {};
  const t = {}, r = Pt(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, o] of Object.entries(Wn(e)))
    t[n] ??= o;
  return t;
}
function su(e) {
  return Object.values(Wn(O(e))).filter(me);
}
function Wn(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, wn);
  if (!Z(t))
    return {};
  const r = {};
  for (const [n, o] of Object.entries(t))
    me(o) && (r[n] = o);
  return r;
}
async function te(e, t) {
  typeof e.setFlag == "function" && (await cu(e, t), await iu(e, t));
}
async function iu(e, t) {
  await Promise.resolve(e.setFlag?.(c, wn, t));
}
function Pt(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, $n);
  return bu(t) ? t : null;
}
async function cu(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(me).sort((a, s) => a.createdAt - s.createdAt);
  if (r.length === 0) return;
  const n = r[0];
  if (!n) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...r.map((a) => a.createdAt)),
    messageId: n.messageId ?? x(e) ?? null,
    source: {
      actorId: n.actorId,
      actorName: lu(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(c, $n, o));
}
function lu(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function Et(e, t) {
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
function Kn(e) {
  const t = O(e);
  if (t?.setFlag)
    return t;
  const r = uu(e);
  if (r?.setFlag)
    return r;
  const n = x(e);
  if (!n) return null;
  const o = game.messages;
  return O(o?.get?.(n));
}
function uu(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(O).find((r) => typeof r?.setFlag == "function") ?? null;
}
function Yn(e) {
  const t = Kn(e.context.message);
  if (t) return t;
  const r = e.messageId ? du(e.messageId) : null;
  if (r) return r;
  const n = Zn().slice().reverse();
  return n.find((o) => mu(o, e)) ?? n.find((o) => fu(o, e)) ?? null;
}
function du(e) {
  const t = game.messages;
  return O(t?.get?.(e));
}
function mu(e, t) {
  const r = x(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!Qn(e, t)) return !1;
  const o = Xn(e);
  return !t.actorId || !o || o === t.actorId;
}
function fu(e, t) {
  if (!gu(e, t)) return !1;
  const r = Xn(e);
  return t.actorId && r === t.actorId ? !0 : Qn(e, t);
}
function Qn(e, t) {
  const r = X(pu(e));
  if (!r) return !1;
  const n = X(t.itemName);
  if (n && r.includes(n)) return !0;
  const o = X(t.itemId);
  return !!(o && r.includes(o));
}
function pu(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Xn(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function gu(e, t) {
  const r = hu(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= rl;
}
function hu(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function O(e) {
  return e && typeof e == "object" ? e : null;
}
function me(e) {
  return Z(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && $(e.messageId) && $(e.itemId) && $(e.actorId) && $(e.itemName) && z(e.resistanceTargetActorId) && z(e.resistanceTargetName) && ku(e.resistanceRollResult) && yu(e.actionPayload) && qe(e.title) && qe(e.buttonLabel) && qe(e.executedLabel) && z(e.choiceGroupId) && z(e.skippedLabel) && z(e.actionSectionId) && z(e.actionSectionTitle) && wu(e.summaryLines) : !1;
}
function yu(e) {
  return e == null ? !0 : Z(e) ? e.kind === "resource-operation" && $(e.actorId) && $(e.actorUuid) && typeof e.actorName == "string" && Au(e.resource) && Ru(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Au(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ru(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function bu(e) {
  return Z(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && $(e.messageId) && Z(e.source) && $(e.source.actorId) && $(e.source.actorName) && $(e.source.itemId) && $(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(me) : !1;
}
function ku(e) {
  return e == null ? !0 : Z(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && z(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Tu(e) {
  return e !== null;
}
function Z(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function $(e) {
  return e === null || typeof e == "string";
}
function qe(e) {
  return e === void 0 || typeof e == "string";
}
function z(e) {
  return e == null || typeof e == "string";
}
function wu(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function $u(e) {
  return typeof e == "string" && e.length > 0;
}
function Zn() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(O).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(O).filter((n) => n !== null) : [];
}
function De(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function x(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function Cu(e) {
  return e.trim().toLowerCase();
}
function _u(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function re(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const _r = 1e3;
class Su {
  constructor(t, r, n, o) {
    this.workflow = t, this.resources = r, this.debugOutput = o, this.ritualAssistant = new uc(t, r, n);
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
      settings: Ut(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = Ut();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = mt(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && Iu(t.item) && r.executionMode === "ask") {
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
    if (await sr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ve(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await He(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const n = await this.ritualAssistant.applyAction(r.action);
    return n.ok ? (r.workflowContext.resourceTransactions.push(n.value), this.pendingExecutions.delete(t), await He(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(n), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = _t(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, o = Lu(n);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const a = await be(this.resources, o, n.resource, n.operation, n.amount);
    return a.ok ? (await sl(t), await il(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (ol((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await sr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ve(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, Pu(t.item));
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
        await this.registerCompletedRitualCard(t, n.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), l.info("Ritual assistido concluído sem ações pendentes.", G(n.workflowContext));
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
      a.kind === "resource-action" && (this.pendingExecutions.delete(o), await He(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, r) {
    const n = Ge();
    await al({
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
      const i = Ge();
      a ??= i, this.pendingExecutions.set(i, {
        kind: "resource-action",
        id: i,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await Rr({
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
        actionPayload: Eu(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), l.info("Ritual assistido preparado com ações pendentes.", G(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = Ge();
    this.pendingExecutions.set(n, {
      kind: "workflow",
      id: n,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Rr({
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
    this.setAttempt(t, "completed"), l.info("Automação executada por uso normal de item.", G(o.value.context));
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
    const r = Date.now(), n = Sr(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      r - s > _r && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(n);
    return o !== void 0 && r - o <= _r;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Sr(t), Date.now());
  }
  setAttempt(t, r, n, o) {
    this.lastAttempt = Ve(t, r, n, o);
  }
}
function Iu(e) {
  return e.type === "ritual";
}
function Pu(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Eu(e) {
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
function Lu(e) {
  const t = e.actorUuid ? Du(e.actorUuid) : null;
  if (J(t)) return t;
  const r = e.actorId ? Nu(e.actorId) : null;
  return r || vu(e.actorName);
}
function Du(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Nu(e) {
  const r = game.actors?.get?.(e);
  if (J(r)) return r;
  for (const n of Jn()) {
    const o = Lt(n);
    if (o?.id === e) return o;
  }
  return null;
}
function vu(e) {
  const t = ze(e);
  if (!t) return null;
  for (const o of Jn()) {
    const a = Ou(o);
    if (ze(a) === t) {
      const s = Lt(o);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((o) => J(o) && ze(o.name) === t);
  return J(n) ? n : null;
}
function Jn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Ou(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : Lt(e)?.name ?? null;
}
function Lt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (J(t)) return t;
  const r = e.document?.actor;
  return J(r) ? r : null;
}
function ze(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function J(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ve(e, t, r, n) {
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
function Sr(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function Ge() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Mu {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], o = [], a = de(t);
    for (const s of r) {
      const i = s.itemId ? a.find((y) => y.id === s.itemId) ?? null : null, m = s.match?.preset ?? null;
      if (!i || !m) {
        o.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(i, m);
      const g = await this.itemPatches.applyPresetItemPatch(i, m);
      n.push({
        itemId: i.id ?? null,
        itemName: i.name ?? "Ritual sem nome",
        presetId: m.id,
        presetLabel: m.label,
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
class Fu {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = de(t).map((i) => this.analyzeRitual(i)), n = r.filter(ye("upToDate")), o = r.filter(ye("available")), a = r.filter(ye("outdated")), s = r.filter(ye("unsupported"));
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
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = Uu(t);
    return r ? n ? n.source.type !== "preset" ? ne({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Automação manual encontrada. Preset sugerido: ${r.preset.label}.`
    }) : n.source.presetId === r.preset.id && n.source.presetVersion === r.preset.version ? ne({
      ritual: t,
      status: "upToDate",
      match: r,
      flag: n,
      reason: `Preset ${r.preset.label} v${r.preset.version} já aplicado.`
    }) : ne({
      ritual: t,
      status: "outdated",
      match: r,
      flag: n,
      reason: xu(n, r.preset)
    }) : ne({
      ritual: t,
      status: "available",
      match: r,
      flag: n,
      reason: `Preset encontrado: ${r.preset.label}.`
    }) : ne({
      ritual: t,
      status: "unsupported",
      match: r,
      flag: n,
      reason: n ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function ne(e) {
  const t = e.flag?.source, r = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? $e(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function Uu(e) {
  const t = e.getFlag(c, "automation");
  return ft(t) ? t : null;
}
function xu(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function ye(e) {
  return (t) => t.status === e;
}
class Bu {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), n = gt(t.transaction);
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
    const n = this.createWorkflowSummaryContent(t, r), o = G(t);
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
    const r = A(t.actorName), n = A(t.resource), o = A(Ir(t)), a = A(Hu(t));
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
    const n = A(r.title ?? "Automação"), o = r.message ? `<p>${A(r.message)}</p>` : "", a = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = A(t.item.name ?? "Item sem nome"), i = t.targets.length > 0 ? t.targets.map((d) => A(d.name)).join(", ") : "Nenhum", m = Object.values(t.rolls).map(
      (d) => `<li><strong>${A(d.id)}:</strong> ${A(d.formula)} = ${d.total} <em>(${A(ju(d.intent))})</em>${d.damageType ? ` — ${A(d.damageType)}` : ""}</li>`
    ), g = t.ritualCosts.map(
      (d) => `<li><strong>${A(d.itemName)}:</strong> ${d.circle}º círculo — ${d.amount} ${A(d.resource)} (${A(qu(d.source))})</li>`
    ), y = t.damageInstances.map(
      (d) => `<li><strong>${A(d.targetActorName)}:</strong> bruto ${d.rawAmount}${d.damageType ? ` ${A(d.damageType)}` : ""} &rarr; final ${d.finalAmount} &rarr; aplicado ${d.appliedAmount}</li>`
    ), R = t.healingInstances.map(
      (d) => `<li><strong>${A(d.targetActorName)}:</strong> bruto ${d.rawAmount} &rarr; final ${d.finalAmount} &rarr; aplicado ${d.appliedAmount}</li>`
    ), b = t.resourceTransactions.map(
      (d) => `<li><strong>${A(d.actorName)}:</strong> ${A(Ir(d))} — ${d.before.value}/${d.before.max} &rarr; ${d.after.value}/${d.after.max}</li>`
    ), k = t.phases.map((d) => A(d)).join(" &rarr; ");
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
          ${m.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${m.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Cura:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${b.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p class="${c}-workflow-card__phases"><strong>Fases:</strong> ${k}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function ju(e) {
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
function Ir(e) {
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
function Hu(e) {
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
function qu(e) {
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
function zu() {
  const e = new Ts(), t = new yi(e), r = new Cs(), n = new Is(r), o = new Hs(e), a = new zs(), s = a.registerMany(No());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new qs(), m = new Bs(), g = new Fu(a), y = new Mu(g, i, m), R = new ki(), b = new Bu(R), k = new bi(), d = new gi(t, n, b, k), P = new Ri(d, k), Ne = new Su(P, t, n, R);
  return Ne.addStrategy(new Us((ro) => Ne.handleItemUsed(ro))), {
    ordem: o,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: n,
    resources: t,
    automationRegistry: a,
    automationBinder: i,
    itemPatches: m,
    debugOutput: R,
    chatMessages: b,
    workflowHooks: k,
    automation: d,
    workflow: P,
    itemUseIntegration: Ne,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: y
  };
}
const { ApplicationV2: Vu } = foundry.applications.api;
class Te extends Vu {
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
      apply: Te.onApply,
      cancel: Te.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${E(dt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${E(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${We("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${We("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${We("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function We(e, t, r, n) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${n}"></i>
        <span>${E(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? Gu(r) : Ku(t)}
    </section>
  `;
}
function Gu(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Wu).join("")}</ol>`;
}
function Wu(e) {
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
function Ku(e) {
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
const we = `${c}.manageRitualPresets`, Pr = `__${c}_ritualPresetHeaderControlRegistered`, Yu = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Qu(e) {
  const t = globalThis;
  if (!t[Pr]) {
    for (const r of Yu)
      Hooks.on(r, (n, o) => {
        Xu(n, o, e);
      });
    t[Pr] = !0, l.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Xu(e, t, r) {
  Array.isArray(t) && Ju(e) && (Zu(e, r), !t.some((n) => n.action === we) && t.push({
    action: we,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), eo(e, r);
    }
  }));
}
function Zu(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[we] && (e.options.actions[we] = (r) => {
    r.preventDefault(), r.stopPropagation(), eo(e, t);
  }));
}
function Ju(e) {
  if (!game.user?.isGM) return !1;
  const t = to(e);
  return t ? t.type === "agent" && de(t).length > 0 : !1;
}
function eo(e, t) {
  const r = to(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Te(r, t).render({ force: !0 });
}
function to(e) {
  return Er(e.actor) ? e.actor : Er(e.document) ? e.document : null;
}
function Er(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let K = null;
Hooks.once("init", () => {
  Eo(), Jo(), Ta(), Ua(), l.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Bt.isSupportedSystem()) {
    l.warn(
      `Sistema não suportado: ${Bt.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  K = zu(), K.itemUseIntegration.registerStrategies(), ca(K), Ra(), ga(), Qu(K), l.info("Inicializado para o sistema Ordem Paranormal."), l.info(`API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${dt} inicializado.`);
});
function ed() {
  if (!K)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return K;
}
export {
  ed as getToolkitServices
};
//# sourceMappingURL=main.js.map
