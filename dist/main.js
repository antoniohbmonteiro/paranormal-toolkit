const l = "paranormal-toolkit", pt = "Paranormal Toolkit", po = "ordemparanormal";
class me {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Pe(e) {
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
function f(e) {
  return { ok: !1, error: e };
}
function gt(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? f({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : ht(t) ? h(t.definition) : f({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function go(e) {
  return ht(e.getFlag(l, "automation"));
}
function ht(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && yo(t.source) && ho(t.definition);
}
function ho(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && _(t.label) && Array.isArray(t.steps) && t.steps.every(Ao);
}
function yo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? _(t.presetId) && _(t.presetVersion) && _(t.appliedAt) : t.type === "manual" ? _(t.label) && _(t.appliedAt) : !1;
}
function Ao(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Ro(t);
    case "spendRitualCost":
      return bo(t);
    case "rollFormula":
      return ko(t);
    case "modifyResource":
      return To(t);
    case "chatCard":
      return wo(t);
    default:
      return !1;
  }
}
function Ro(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && jr(t);
}
function bo(e) {
  return e.type === "spendRitualCost";
}
function ko(e) {
  const t = e;
  return t.type === "rollFormula" && _(t.id) && _(t.formula) && (t.intent === void 0 || So(t.intent)) && (t.damageType === void 0 || _(t.damageType));
}
function To(e) {
  const t = e;
  return t.type === "modifyResource" && $o(t.actor) && Co(t.resource) && _o(t.operation) && jr(t);
}
function wo(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function jr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || _(e.amountFrom);
}
function $o(e) {
  return e === "self" || e === "target";
}
function Co(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function _o(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function So(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function _(e) {
  return typeof e == "string" && e.length > 0;
}
function yt(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const r = t;
    if (Array.isArray(r.contents))
      return r.contents.filter(Ft);
    if (Po(t))
      return Array.from(t).filter(Ft);
  }
  return [];
}
function Io(e) {
  return yt(e)[0] ?? null;
}
function Eo(e) {
  return yt(e).find(go) ?? null;
}
function Po(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ft(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function fe(e) {
  return yt(e).filter((t) => t.type === "ritual");
}
function Hr(e) {
  return fe(e)[0] ?? null;
}
function Lo(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Pe);
      return u.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = se("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = Ae(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(Bt);
      return u.info(`Presets encontrados para ${r.name}.`, n), n;
    },
    async applyPresetToFirstRitual(t) {
      const r = se("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const n = Ae(r);
      if (!n) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await Xe(e, n, o.value);
      u.info(`Preset ${o.value.id} aplicado em ${n.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = se("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = Ae(t);
      if (!r) return;
      const n = e.automationRegistry.findForItem(r)[0];
      if (!n) {
        u.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const o = await Xe(e, r, n.preset);
      u.info(`Melhor preset aplicado em ${r.name}.`, { match: Bt(n), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return xt(e);
    },
    async applyBestPresetsToActorRituals() {
      return xt(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = se("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = Ae(t);
      r && (await e.automationBinder.clear(r), u.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function xt(e) {
  const t = se("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = fe(t);
  if (r.length === 0)
    return u.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), Ut(t);
  const n = Ut(t, r.length);
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
    const s = await Xe(e, o, a.preset);
    n.applied.push(No(o, a, s));
  }
  return u.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), Do(n), n;
}
async function Xe(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function No(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Pe(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function Ut(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Do(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((n) => n.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function Bt(e) {
  return {
    preset: Pe(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function se(e) {
  const t = me.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ae(e) {
  const t = Hr(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function z(e) {
  return e ? {
    id: e.id,
    source: {
      ...Oo(e.sourceActor),
      token: e.sourceToken
    },
    item: vo(e.item),
    targets: e.targets.map(Mo),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: jt(e.rollRequests, qr),
    rolls: jt(e.rolls, Fo),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(At),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function At(e) {
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
function Oo(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function vo(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Mo(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function qr(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Fo(e) {
  return {
    ...qr(e),
    total: e.total
  };
}
function jt(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function xo(e) {
  return {
    getSelected() {
      return me.getSelectedActor();
    },
    logResources() {
      const t = B(
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
        B("Nenhum ator encontrado para gastar PE."),
        (r) => e.resources.spend(r, "PE", t)
      );
    },
    async spendPD(t) {
      await Y(
        e,
        "Gasto de PD",
        B("Nenhum ator encontrado para gastar PD."),
        (r) => e.resources.spend(r, "PD", t)
      );
    },
    async damagePV(t) {
      await Y(
        e,
        "Dano em PV",
        B("Nenhum ator encontrado para causar dano em PV."),
        (r) => e.resources.damage(r, "PV", t)
      );
    },
    async healPV(t) {
      await Y(
        e,
        "Cura de PV",
        B("Nenhum ator encontrado para curar PV."),
        (r) => e.resources.heal(r, "PV", t)
      );
    },
    async damageSAN(t) {
      await Y(
        e,
        "Dano em SAN",
        B("Nenhum ator encontrado para causar dano em SAN."),
        (r) => e.resources.damage(r, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Y(
        e,
        "Recuperação de SAN",
        B("Nenhum ator encontrado para recuperar SAN."),
        (r) => e.resources.recover(r, "SAN", t)
      );
    }
  };
}
async function Y(e, t, r, n) {
  if (!r) return;
  const o = await n(r);
  if (!o.ok) {
    Uo(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    u.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  u.info(`${t} realizado:`, At(a));
}
function B(e) {
  const t = me.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Uo(e) {
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
function Bo() {
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
function Ze() {
  return {
    enabled: be(L.enabled),
    console: be(L.console),
    ui: be(L.ui),
    chat: be(L.chat)
  };
}
async function F(e, t) {
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
function be(e) {
  return game.settings.get(l, e) === !0;
}
function jo() {
  return {
    status() {
      return Ze();
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
const Vr = "ritual.costOnly", Gr = "ritual.simpleHealing", Ho = "ritual.eletrocussao", zr = "ritual.simpleDamage", Wr = "generic.simpleHealing", Kr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function qo() {
  return [
    Vo(),
    Go(),
    zo(),
    Wo(),
    Ko()
  ];
}
function Vo() {
  return {
    id: Vr,
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
function Go() {
  return {
    id: Gr,
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
    automation: Yr(),
    itemPatch: Qo()
  };
}
function zo() {
  return {
    id: Ho,
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
    automation: Yo(),
    itemPatch: Xo()
  };
}
function Wo() {
  return {
    id: zr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Rt()
  };
}
function Ko() {
  return {
    id: Wr,
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
function Yr(e = "2d8+2") {
  return Qr(
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
function Yo() {
  return {
    ...Rt("1d8", {
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
function Rt(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Qr(
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
function Qo() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Kr,
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
function Xo() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Kr,
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
function Qr(e, t, r) {
  return {
    ...e,
    steps: e.steps.map((n) => n.type !== "rollFormula" || n.id !== t ? n : {
      ...n,
      formula: r
    })
  };
}
function bt() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: X(t.id),
    actorId: X(t.actor?.id),
    sceneId: X(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Xr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: X(e.id),
    actorId: X(t?.id),
    sceneId: X(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function X(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Zo(e) {
  return {
    logFirstRitualCost() {
      const t = j("Nenhum ator encontrado para consultar custo de ritual.");
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
      const n = j("Nenhum ator encontrado para configurar custo customizado.");
      if (!n) return;
      const o = H(n);
      if (o) {
        if (!ta(t, r)) {
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
      const t = j("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const r = H(t);
      r && (await r.unsetFlag(l, "ritual.cost"), u.info(`Custo customizado removido de ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${r.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = j("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const r = H(t);
      if (!r) return;
      const n = e.automationRegistry.require(Vr);
      if (!n.ok) {
        u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, n.value), u.info(`Preset de custo aplicado ao ritual: ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${r.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const r = j("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!r) return;
      const n = H(r);
      if (!n) return;
      if (!Ht(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Gr);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: Yr(t)
      }), u.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = j("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = H(r);
      if (!n) return;
      if (!Ht(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(zr);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: Rt(t)
      }), u.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = j("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = H(t);
      r && await Jo(e, t, r);
    }
  };
}
async function Jo(e, t, r) {
  const n = gt(r);
  if (!n.ok) {
    u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: Xr(),
    item: r,
    targets: bt()
  });
  if (!o.ok) {
    ea(o.error);
    return;
  }
  u.info("Automação de ritual executada com sucesso.", z(o.value.context));
}
function ea(e) {
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
function j(e) {
  const t = me.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function H(e) {
  const t = Hr(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ta(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Ht(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const ra = ["disabled", "ask", "automatic"], na = ["buttons", "confirm"], Zr = "ask";
function oa(e) {
  return typeof e == "string" && ra.includes(e);
}
function aa(e) {
  return typeof e == "string" && na.includes(e);
}
function sa(e) {
  return oa(e) ? e : aa(e) ? "ask" : Zr;
}
const ia = ["keep", "replace"], Jr = "keep", ca = !0, N = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function la() {
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
    default: Zr
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
    default: Jr
  }), game.settings.register(l, N.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: ca
  }), game.settings.register(l, N.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function qt() {
  const e = sa(game.settings.get(l, N.executionMode)), t = tn(game.settings.get(l, N.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: en()
  };
}
function ua() {
  return tn(game.settings.get(l, N.systemCardMode));
}
function en() {
  return game.settings.get(l, N.ritualCastingCheckEnabled) === !0;
}
async function q(e) {
  await game.settings.set(l, N.executionMode, e);
}
function tn(e) {
  return ia.includes(e) ? e : Jr;
}
function da(e) {
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
const ma = [
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
function fa(e) {
  return {
    phases() {
      return ma;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = xe("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = Eo(t);
      if (!r) {
        u.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Vt(e, t, r);
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
      if (!ha(r)) {
        u.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = ga(r) ?? xe("Nenhum ator encontrado para executar automação do item.");
      n && await Vt(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = xe("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = Io(t);
      if (!r) {
        u.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(Wr);
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
async function Vt(e, t, r) {
  const n = gt(r);
  if (!n.ok) {
    u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: Xr(),
    item: r,
    targets: bt()
  });
  if (!o.ok) {
    pa(o.error);
    return;
  }
  u.info("Automação executada com sucesso.", z(o.value.context));
}
function pa(e) {
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
function xe(e) {
  const t = me.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ga(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ha(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ya(e) {
  const t = xo(e), r = Lo(e), n = Zo(e), o = fa(e), a = jo(), s = da(e);
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
function Aa(e) {
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
    debug: ya(e)
  }, r = globalThis;
  return r[l] = t, r.ParanormalToolkit = t, t;
}
class Gt {
  static isSupportedSystem() {
    return game.system.id === po;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Ra() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Z(t.id),
    actorId: Z(t.actor?.id),
    sceneId: Z(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function rn() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, r = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: Z(e.id),
    actorId: Z(t?.id),
    sceneId: Z(e.scene?.id),
    name: r
  };
}
function ba(e, t = rn()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function ka(e) {
  if (!$a(e)) return null;
  const t = e.getFlag(l, "workflow");
  return wa(t) ? t : null;
}
function Ta() {
  return `flags.${l}.workflow`;
}
function zt(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${l}`), r = foundry.utils.getProperty(e, `_source.flags.${l}`);
  return t !== void 0 || r !== void 0;
}
function Wt(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Je(t) || Je(r);
}
function wa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function $a(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function Z(e) {
  return Je(e) ? e : null;
}
function Je(e) {
  return typeof e == "string" && e.length > 0;
}
function Ca() {
  const e = (t, r) => {
    _a(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function _a(e, t) {
  const r = ka(e);
  if (!r || r.targets.length === 0) return;
  const n = Ia(t);
  if (!n || n.querySelector(`.${l}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(Sa(r));
}
function Sa(e) {
  const t = document.createElement("section");
  t.classList.add(`${l}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(Kt("Origem", e.source.name)), t.append(Kt("Alvo", e.targets.map((n) => n.name).join(", "))), t;
}
function Kt(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${l}-chat-enrichment__row`);
  const n = document.createElement("span");
  n.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, r.append(n, o), r;
}
function Ia(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ea() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!Pa(n) || !La(e) || zt(e) || zt(t)) return;
    const o = Ra();
    if (o.length === 0 || !Wt(e) && !Wt(t)) return;
    const a = rn();
    e.updateSource({
      [Ta()]: ba(o, a)
    }), u.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Pa(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function La(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const nn = {
  enabled: "dice.animations.enabled"
};
function Na() {
  game.settings.register(l, nn.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Da() {
  return {
    enabled: game.settings.get(l, nn.enabled) === !0
  };
}
const Oa = "chatCard", Yt = "data-paranormal-toolkit-prompt-id", c = `${l}-item-use-prompt`, va = `.${c}__title`, on = `.${c}__header`, Ma = `.${c}__roll-card`, Fa = `.${c}__roll-meta`, xa = `.${c}__roll-meta-pill`, Ua = `.${c}__resistance`, Ba = `.${c}__resistance-header`, an = `.${c}__resistance-description`, ja = `.${c}__resistance-roll-button`, Ha = `.${c}__resistance-roll-result`, Qt = `${c}__resistance-content`, sn = `.${c}__workflow-section`, cn = `.${c}__workflow-roll`, ln = `${c}__workflow-roll--dice-open`, un = `.${c}__workflow-roll-formula`, dn = `${c}__workflow-roll-formula--toggle`, kt = `.${c}__workflow-dice-tray`, qa = `.${c}__roll-detail-toggle`, Va = `.${c}__roll-detail-list`, Ga = `.${c}__ritual-element-badge`, za = `.${c}__ritual-metadata`, Wa = "casting-backlash", Ka = "data-paranormal-toolkit-action-section", Ya = "data-paranormal-toolkit-prompt-id", Qa = "data-paranormal-toolkit-pending-id", Xt = "data-paranormal-toolkit-casting-backlash-enhanced", Zt = `.${c}`, Xa = `.${c}__workflow-section--casting`, Za = `.${c}__workflow-section-header`, Ja = `.${c}__workflow-notes`, es = `[${Ka}="${Wa}"]`, Jt = `${c}__workflow-section-title-row`, ts = `${c}__workflow-section-header--casting-backlash`, mn = `${c}__casting-backlash-button`;
function rs(e) {
  for (const t of ns(e))
    os(t), ls(t);
}
function ns(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Zt) && t.add(e);
  for (const r of e.querySelectorAll(Zt))
    t.add(r);
  return Array.from(t);
}
function os(e) {
  const t = e.querySelector(es);
  if (!t) return;
  const r = as(t);
  if (!r) return;
  const n = e.querySelector(`${Xa} ${Za}`);
  n && (n.classList.add(ts), ss(n), is(r), n.append(r), t.remove());
}
function as(e) {
  return e.querySelector(
    `button[${Qa}], button[${Ya}]`
  );
}
function ss(e) {
  const t = e.querySelector(`:scope > .${Jt}`);
  if (t) return t;
  const r = document.createElement("div");
  r.classList.add(Jt);
  const n = Array.from(e.childNodes);
  e.prepend(r);
  for (const o of n)
    o !== r && (o instanceof HTMLButtonElement && o.classList.contains(mn) || r.append(o));
  return r;
}
function is(e) {
  if (e.getAttribute(Xt) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", r = cs(t, e.disabled);
  e.classList.add(mn), e.setAttribute(Xt, "true"), e.setAttribute("title", r), e.setAttribute("aria-label", r);
}
function cs(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function ls(e) {
  for (const t of e.querySelectorAll(Ja)) {
    for (const r of Array.from(t.children))
      (r.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && r.remove();
    t.children.length === 0 && t.remove();
  }
}
function us(e) {
  for (const t of Array.from(e.querySelectorAll(sn)))
    for (const r of Array.from(t.querySelectorAll(`${qa}, ${Va}`)))
      r.remove();
}
function ds(e) {
  for (const t of Array.from(e.querySelectorAll(Ua)))
    ms(t);
}
function ms(e) {
  const t = e.querySelector(Ba), r = e.querySelector(an), n = e.querySelector(ja), o = e.querySelector(Ha);
  if (!n || !t && !r && !o) return;
  const a = fs(e, n);
  t && t.parentElement !== a && a.append(t), r && r.parentElement !== a && a.append(r), o && o.parentElement !== a && !n.contains(o) && a.append(o), n.parentElement !== e && e.append(n);
}
function fs(e, t) {
  const r = e.querySelector(`.${Qt}`);
  if (r) return r;
  const n = document.createElement("div");
  return n.classList.add(Qt), e.insertBefore(n, t.parentElement === e ? t : e.firstChild), n;
}
function er(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Tt() {
  const e = globalThis.game;
  return Le(e) ? e : null;
}
function S(e, t) {
  const r = ps(e, t);
  return we(r);
}
function ps(e, t) {
  return t.split(".").reduce((r, n) => Le(r) ? r[n] : null, e);
}
function gs(e, t) {
  const r = e.indexOf(":");
  return r < 0 || ue(e.slice(0, r)) !== ue(t) ? null : re(e.slice(r + 1));
}
function we(e) {
  return typeof e == "string" ? re(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Le(e) {
  return !!e && typeof e == "object";
}
function hs(e) {
  return typeof e == "string";
}
function Ne(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function re(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function ue(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function et(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function x(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function fn(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function ys(e) {
  for (const t of Array.from(e.querySelectorAll(Ma))) {
    const r = $s(t);
    As(t), r && (Rs(t, r), bs(t, r));
  }
}
function As(e) {
  for (const t of Array.from(e.querySelectorAll(Fa)))
    t.remove();
}
function Rs(e, t) {
  const n = e.closest(`.${c}`)?.querySelector(on) ?? null, o = n?.querySelector(va) ?? null, a = n ?? e, s = a.querySelector(Ga);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const i = s ?? document.createElement("span");
  if (i.className = js(t.elementTone), i.textContent = Bs(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", i);
      return;
    }
    a.prepend(i);
  }
}
function bs(e, t) {
  const r = ks(e);
  Ts(e, r);
  const n = ws(t);
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
  const a = e.querySelector(sn);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function ks(e) {
  return e.closest(`.${c}`)?.querySelector(on) ?? null;
}
function Ts(e, t) {
  const r = [e, t].filter((n) => n !== null);
  for (const n of r)
    for (const o of Array.from(n.querySelectorAll(za)))
      o.remove();
}
function ws(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${et(e.target)}` : null,
    e.duration ? `Duração: ${et(e.duration)}` : null,
    e.resistance ? `Resistência: ${fn(e.resistance)}` : null
  ].filter(Ne);
}
function $s(e) {
  const t = Cs(e), r = Ls(e), o = (t ? Ps(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = wt(S(o, "element")), i = O("op.elementChoices", s) ?? tr(G(a, "Elemento")) ?? tr(r.damageType), d = s ?? Hs(i), g = S(o, "circle") ?? G(a, "Círculo"), y = Os(o) ?? G(a, "Alvo"), R = xs(o, "duration", "op.durationChoices") ?? G(a, "Duração"), b = Ns(e) ?? Ms(o) ?? G(a, "Resistência"), k = Ds(a) ?? r.cost, m = {
    elementLabel: i,
    elementTone: d,
    circle: g,
    cost: k,
    target: y,
    duration: R,
    resistance: b
  };
  return Us(m) ? m : null;
}
function Cs(e) {
  const t = _s(e);
  if (!t) return null;
  const r = t.getFlag?.(l, Oa), n = Is(r);
  if (n.length === 0) return null;
  const o = Ss(e);
  if (o.size > 0) {
    const a = n.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return n.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function _s(e) {
  const r = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return r ? Tt()?.messages?.get?.(r) ?? null : null;
}
function Ss(e) {
  const t = e.closest(`.${c}`) ?? e, r = /* @__PURE__ */ new Set();
  for (const n of Array.from(t.querySelectorAll(`[${Yt}]`))) {
    const o = n.getAttribute(Yt)?.trim();
    o && r.add(o);
  }
  return r;
}
function Is(e) {
  if (!Le(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Es).filter((r) => r !== null) : [];
}
function Es(e) {
  return Le(e) ? {
    pendingId: we(e.pendingId),
    actorId: we(e.actorId),
    itemId: we(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(hs) : []
  } : null;
}
function Ps(e) {
  if (!e.itemId) return null;
  const t = Tt(), n = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return n || (t?.items?.get?.(e.itemId) ?? null);
}
function Ls(e) {
  let t = null, r = null;
  for (const n of Array.from(e.querySelectorAll(xa))) {
    const o = re(n.textContent);
    if (!o) continue;
    const a = gs(o, "Tipo");
    a && (r = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: r };
}
function Ns(e) {
  const t = re(e.querySelector(an)?.textContent);
  return t ? fn(t) : null;
}
function G(e, t) {
  const r = ue(t);
  for (const n of e) {
    const o = n.indexOf(":");
    if (!(o < 0 || ue(n.slice(0, o)) !== r))
      return re(n.slice(o + 1));
  }
  return null;
}
function Ds(e) {
  const t = G(e, "Custo") ?? G(e, "PE");
  return t || (e.map(re).find((r) => typeof r == "string" && /\b(P[ED]|PE|PD)\b/iu.test(r)) ?? null);
}
function Os(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return vs(e) ?? O("op.targetChoices", t) ?? "Área";
  const r = O("op.targetChoices", t) ?? x(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, r].filter(Ne).join(" ");
}
function vs(e) {
  const t = S(e, "area.name"), r = S(e, "area.size"), n = S(e, "area.type"), o = t ? O("op.areaChoices", t) ?? x(t) : null, a = n ? O("op.areaTypeChoices", n) ?? x(n) : null;
  return o ? r ? a ? `${o} ${r}m ${et(a)}` : `${o} ${r}m` : o : null;
}
function Ms(e) {
  const t = S(e, "skillResis"), r = S(e, "resistance");
  if (!t || !r) return null;
  const n = O("op.skill", t) ?? x(t), o = Fs(r);
  return [n, o].filter(Ne).join(" ");
}
function Fs(e) {
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
function xs(e, t, r) {
  const n = S(e, t);
  return n ? O(r, n) ?? x(n) : null;
}
function Us(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Bs(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function js(e) {
  return [
    `${c}__ritual-element-badge`,
    e ? `${c}__ritual-element-badge--${e}` : null
  ].filter(Ne).join(" ");
}
function wt(e) {
  const t = ue(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function tr(e) {
  const t = wt(e);
  return t ? O("op.elementChoices", t) ?? x(t) : e ? x(e) : null;
}
function Hs(e) {
  return wt(e);
}
function O(e, t) {
  if (!t) return null;
  const r = `${e}.${t}`, n = Tt()?.i18n?.localize?.(r);
  return !n || n === r ? null : n;
}
const rr = "data-paranormal-toolkit-dice-toggle-enhanced";
function qs(e) {
  for (const t of Array.from(e.querySelectorAll(cn)))
    pn(t);
}
function Vs(e) {
  const t = hn(e.target);
  if (!t) return;
  const r = $t(t);
  r && (e.preventDefault(), gn(r, t));
}
function Gs(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = hn(e.target);
  if (!t) return;
  const r = $t(t);
  r && (e.preventDefault(), gn(r, t));
}
function pn(e) {
  const t = e.querySelector(kt);
  if (!t) return;
  const r = e.querySelector(un);
  if (r && r.getAttribute(rr) !== "true" && (r.setAttribute(rr, "true"), r.classList.add(dn), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", "false"), r.title = "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title), t.hidden = !0, !r.querySelector("i"))) {
    const n = document.createElement("i");
    n.classList.add("fa-solid", "fa-chevron-down"), n.setAttribute("aria-hidden", "true"), r.append(n);
  }
}
function gn(e, t) {
  const r = e.querySelector(kt);
  if (!r) return;
  const n = !e.classList.contains(ln);
  zs(e, t, r, n);
}
function zs(e, t, r, n) {
  e.classList.toggle(ln, n), r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.title = n ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !n), o.classList.toggle("fa-chevron-up", n));
}
function hn(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(un);
  if (!t) return null;
  const r = $t(t);
  return r ? (pn(r), t.classList.contains(dn) ? t : null) : null;
}
function $t(e) {
  const t = e.closest(cn);
  return t && t.querySelector(kt) ? t : null;
}
const nr = `${l}-workflow-dice-toggle-styles`;
function Ws() {
  if (document.getElementById(nr)) return;
  const e = document.createElement("style");
  e.id = nr, e.textContent = `
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
const Ks = [0, 100, 500, 1500, 3e3];
let or = !1, Ue = null;
function Ys() {
  if (!or) {
    or = !0, Ws(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ie(er(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ie(er(t));
    }), Hooks.once("ready", () => {
      ie(document), Qs();
    }), document.addEventListener("click", Vs), document.addEventListener("keydown", Gs);
    for (const e of Ks)
      globalThis.setTimeout(() => ie(document), e);
  }
}
function Qs() {
  Ue || !document.body || (Ue = new MutationObserver((e) => {
    for (const t of e)
      for (const r of Array.from(t.addedNodes))
        (r instanceof HTMLElement || r instanceof DocumentFragment) && ie(r);
  }), Ue.observe(document.body, { childList: !0, subtree: !0 }));
}
function ie(e) {
  e && (us(e), ys(e), ds(e), qs(e), rs(e));
}
function Xs() {
  Ys();
}
const ce = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, yn = {
  PV: "system.attributes.hp"
}, tt = {
  PV: [ce.PV, yn.PV],
  SAN: [ce.SAN],
  PE: [ce.PE],
  PD: [ce.PD]
}, rt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Zs {
  getResource(t, r) {
    const n = ar(t, r);
    if (!n.ok)
      return f(n.error);
    const o = n.value, a = `${o}.value`, s = `${o}.max`, i = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, s), g = ir(t, r, a, i, "valor atual");
    if (g) return f(g);
    const y = ir(t, r, s, d, "valor máximo");
    return y ? f(y) : h({
      value: i,
      max: d
    });
  }
  async updateResourceValue(t, r, n) {
    const o = ar(t, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: n });
  }
}
function ar(e, t) {
  const r = Js(e.type, t);
  if (r && sr(e, r))
    return h(r);
  const n = tt[t].find(
    (o) => sr(e, o)
  );
  return n ? h(n) : f({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: ei(e, t),
    path: tt[t].join(" | ")
  });
}
function Js(e, t) {
  return e === "threat" ? yn[t] ?? null : e === "agent" ? ce[t] : null;
}
function sr(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function ei(e, t) {
  const r = e.type ?? "unknown", n = tt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function ir(e, t, r, n, o) {
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
class ti {
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
      const s = rt.ritualItem.circleCandidates;
      return f({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: n, value: o } = r, a = ri(o);
    return a ? h(a) : f({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${n}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: n,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const r of rt.ritualItem.circleCandidates) {
      const n = foundry.utils.getProperty(t, r);
      if (n != null)
        return { path: r, value: n };
    }
    return null;
  }
}
function ri(e) {
  if (cr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (cr(r))
      return r;
  }
  return null;
}
function cr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const ni = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class oi {
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
    const n = r.value, o = ai(t.ritual, n);
    return o.ok ? o.value ? h(o.value) : h({
      resource: "PE",
      amount: ni[n],
      source: "default-by-circle",
      circle: n
    }) : f(o.error);
  }
}
function ai(e, t) {
  const r = e.getFlag(l, "ritual.cost");
  return r == null ? { ok: !0, value: null } : si(r) ? {
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
function si(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Be = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function ii(e) {
  if (!pi(e.item)) return null;
  const t = nt(e.actor) ? e.actor : ci(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: di(e.token) ?? li(t),
    targets: bt(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function ci(e) {
  const t = e;
  return nt(t.actor) ? t.actor : nt(e.parent) ? e.parent : null;
}
function li(e) {
  const t = mi(e) ?? fi(e);
  return t ? An(t) : null;
}
function di(e) {
  return ot(e) ? An(e) : null;
}
function mi(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return ot(r) ? r : (t.getActiveTokens?.() ?? []).find(ot) ?? null;
}
function fi(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function An(e) {
  const t = e.actor ?? null;
  return {
    tokenId: je(e.id),
    actorId: je(t?.id),
    sceneId: je(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function pi(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function nt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function ot(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function je(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class gi {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Be.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, u.info(`${Be.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const r = ii(hi(t));
    if (!r) {
      u.warn(`${Be.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function hi(e) {
  return e && typeof e == "object" ? e : {};
}
class yi {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return He("missing-item-patch");
    if (t.type !== "ritual") return He("unsupported-item-type");
    const o = Ai(n);
    return Object.keys(o).length === 0 ? He("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Ai(e) {
  const t = {};
  T(t, "name", e.name), T(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (T(t, "system.circle", r.circle), T(t, "system.element", r.element), T(t, "system.target", r.target), T(t, "system.targetQtd", r.targetQuantity), T(t, "system.execution", r.execution), T(t, "system.range", r.range), T(t, "system.duration", r.duration), T(t, "system.skillResis", r.resistanceSkill), T(t, "system.resistance", r.resistance), T(t, "system.studentForm", r.studentForm), T(t, "system.trueForm", r.trueForm)), t;
}
function T(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function He(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Ri {
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
    return this.getNumber(t, rt.ritual.dt, 0);
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
class bi {
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
class ki {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = Ti(t);
    return r.ok ? this.presets.has(t.id) ? f({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, qe(t)), h(t)) : r;
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
    return r ? qe(r) : null;
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
    return Array.from(this.presets.values()).map(qe);
  }
  findForItem(t) {
    return this.list().map((r) => wi(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function Ti(e) {
  return !Ve(e.id) || !Ve(e.version) || !Ve(e.label) ? f({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? f({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : h(e);
}
function wi(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = $i(o, t);
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
function $i(e, t) {
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
      const r = lr(t.name), n = e.names.map(lr).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Ci(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function lr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Ci(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function qe(e) {
  return structuredClone(e);
}
function Ve(e) {
  return typeof e == "string" && e.length > 0;
}
function $e(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? f({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : h(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = De(e.amountFrom);
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
function De(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const _i = "dice-so-nice";
async function Rn(e) {
  if (!Da().enabled || !Si()) return;
  const t = Ii();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      u.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function Si() {
  return game.modules.get(_i)?.active === !0;
}
function Ii() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Ei(e, t, r) {
  if (!ur(e.id) || !ur(e.formula))
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
    await Rn(o);
    const i = {
      ...r.rollRequests[e.id] ?? bn(e, t),
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
function bn(e, t) {
  const r = e.intent ?? Pi(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function Pi(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function ur(e) {
  return typeof e == "string" && e.length > 0;
}
async function Ce(e, t, r, n, o) {
  switch (n) {
    case "spend":
      return r !== "PE" && r !== "PD" ? ke(t, r, n, o) : e.spend(t, r, o);
    case "damage":
      return r !== "PV" && r !== "SAN" ? ke(t, r, n, o) : e.damage(t, r, o);
    case "heal":
      return r !== "PV" ? ke(t, r, n, o) : e.heal(t, r, o);
    case "recover":
      return r !== "SAN" ? ke(t, r, n, o) : e.recover(t, r, o);
  }
}
function ke(e, t, r, n) {
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
function Li(e) {
  const { step: t, context: r, transaction: n, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = Ni(t, r, n, o);
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
    const s = Di(t, r, n, o);
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
function Ni(e, t, r, n) {
  const o = De(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: kn(t.id, "damage", n, t.damageInstances.length),
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
function Di(e, t, r, n) {
  const o = De(e.amountFrom);
  return {
    id: kn(t.id, "healing", n, t.healingInstances.length),
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
function kn(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function Oi(e, t, r) {
  const n = De(e.amountFrom), o = n ? t.rolls[n] : void 0;
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
function vi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", r, { stepIndex: n, step: t, metadata: o }), Tn("before", e), dr("before", e), dr("resolve", e);
}
function Mi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("apply", r, { stepIndex: n, step: t, metadata: o }), Tn("apply", e);
}
function Fi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", r, { stepIndex: n, step: t, metadata: o });
}
function Tn(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t, i = xi(e, r.operation);
  i && s.emit(i, n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function dr(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function xi(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Ui(e, t, r) {
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
async function Bi(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return ji(e, t);
    case "spendRitualCost":
      return Hi(e, t);
  }
}
async function ji(e, t) {
  const { context: r, resources: n } = e, o = $e(t, r);
  return o.ok ? wn(await n.spend(r.sourceActor, t.resource, o.value), r) : f(o.error);
}
async function Hi(e, t) {
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
  }), wn(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function wn(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), h(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), f({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function qi(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: o, execute: a } = e, s = Vi(t);
  for (const d of s.before)
    o.emit(d, r, { stepIndex: n, step: t });
  const i = await a();
  if (!i.ok)
    return i;
  for (const d of s.after)
    o.emit(d, r, { stepIndex: n, step: t });
  return i;
}
function Vi(e) {
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
class Gi {
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
        return qi({
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
    const o = await Bi({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? h(void 0) : f({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const o = bn(t, n);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, n, t);
    const a = await this.runRollFormulaStep(t, r, n);
    if (!a.ok)
      return a;
    const s = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, n, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: o, rollResult: s }), h(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const o = await Ei(t, n, r);
    return o.ok ? h(void 0) : f({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const o = $e(t, r);
    if (!o.ok)
      return f({ ...o.error, stepIndex: n, step: t, context: r });
    const a = Oi(t, r, o.value);
    vi({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), Mi({
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
      const d = await Ce(this.resources, i, t.resource, t.operation, o.value), g = this.handleResourceOperationResult(d, r, n, t);
      if (!g.ok)
        return g;
      Li({
        step: t,
        context: r,
        transaction: g.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return Fi({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), h(void 0);
  }
  async runModifyResourceStep(t, r, n) {
    const o = $e(t, r);
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
      const i = await Ce(this.resources, s, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(i, r, n, t);
      if (!d.ok)
        return d;
    }
    return h(void 0);
  }
  async runChatCardStep(t, r, n) {
    const o = await Ui(this.messages, t, r);
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
    const i = zi(t, r.intent);
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
function zi(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Wi {
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
function $n(e) {
  return {
    id: Ki(),
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
function Ki() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Yi {
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
    return z(this.lastContext);
  }
  async runAutomation(t, r) {
    const n = $n(r);
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
class Qi {
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
class Xi {
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
    const r = Ze();
    return !r.enabled || !r.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: Zi(),
      flags: {
        ...t.flags,
        [l]: {
          ...Ji(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && u.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = Ze();
    if (!n.enabled)
      return;
    const o = r.notification ?? mr(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, o);
  }
  emitConsole(t, r) {
    const n = mr(r);
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
function mr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Zi() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Ji(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const ec = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Cn = `${l}-inline-roll-neutralized`, tc = `${l}-inline-roll-notice`, Ct = `data-${l}-inline-roll-neutralized`, fr = `data-${l}-inline-roll-notice`, rc = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function pr(e) {
  const t = hc(e.message), r = await nc(e.message), n = oc(t);
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
async function nc(e) {
  const t = fc(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = ac(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await pc(t, r.content), replacementCount: r.replacementCount };
}
function oc(e) {
  const t = e ? gc(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = _n(t);
  return r > 0 && Sn(uc(t)), { replacementCount: r };
}
function ac(e) {
  const t = sc(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = _n(r.content), o = t.replacementCount + n;
  return o === 0 ? { content: e, replacementCount: 0 } : (Sn(r.content), { content: r.innerHTML, replacementCount: o });
}
function sc(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, o) => (t += 1, cc(o.trim()))), replacementCount: t };
}
function _n(e) {
  const t = ic(e);
  for (const r of t)
    r.replaceWith(lc(dc(r)));
  return t.length;
}
function ic(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(ec))
    r.getAttribute(Ct) !== "true" && t.add(r);
  return Array.from(t);
}
function cc(e) {
  return `<span class="${Cn}" ${Ct}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${yc(e)}</span>`;
}
function lc(e) {
  const t = document.createElement("span");
  return t.classList.add(Cn), t.setAttribute(Ct, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Sn(e) {
  if (e.querySelector?.(`[${fr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(tc), t.setAttribute(fr, "true"), t.textContent = rc, e.append(t);
}
function uc(e) {
  return e.querySelector(".message-content") ?? e;
}
function dc(e) {
  const r = e.getAttribute("data-formula") ?? mc(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function mc(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function fc(e) {
  return e && typeof e == "object" ? e : null;
}
async function pc(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return u.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function gc(e) {
  const t = Ac(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function hc(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function yc(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Ac(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const gr = "occultism";
function Rc(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function bc(e) {
  const t = Rc(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await kc(e, gr);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Rn(r);
  const n = $c(r);
  return {
    skill: gr,
    skillLabel: "Ocultismo",
    roll: r,
    formula: wc(r),
    total: n,
    difficulty: t,
    success: n >= t,
    diceBreakdown: Cc(r)
  };
}
async function kc(e, t) {
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
  return Tc(n);
}
function Tc(e) {
  return hr(e) ? e : Array.isArray(e) ? e.find(hr) ?? null : null;
}
function hr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function wc(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function $c(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Cc(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(_c);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function _c(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function Sc(e) {
  return {
    header: {
      eyebrow: pt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Nc(e.ritual)
    },
    forms: e.variantOptions.map((t) => Ic(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: Lc(e.automationStatus ?? "assisted")
  };
}
function Ic(e, t) {
  const r = Ec(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Pc(t) : "—",
    details: r
  };
}
function Ec(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Pc(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function Lc(e) {
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
function Nc(e) {
  const t = e.system, r = [Oc(t?.element), Dc(t?.circle)].filter(vc);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function Dc(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function Oc(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function vc(e) {
  return typeof e == "string" && e.length > 0;
}
const In = ["base", "discente", "verdadeiro"];
function En(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function _e(e) {
  return typeof e == "string" && In.includes(e);
}
const { ApplicationV2: Mc } = foundry.applications.api;
class le extends Mc {
  constructor(t, r) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = r, this.model = Sc(t), this.selectedVariant = this.model.forms.find((n) => n.checked && n.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
    xc(o, (a) => {
      this.selectedVariant = a;
    }), Uc(o, (a) => {
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
          ${this.model.forms.map(Fc).join("")}
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
    const r = Hc(t), n = Bc(r, this.spendResource, this.selectedVariant);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function Fc(e) {
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
function xc(e, t) {
  const r = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of r)
    o.addEventListener("click", () => yr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), yr(e, o, t));
    });
  const n = Pn(e);
  n && t(n);
}
function yr(e, t, r) {
  const n = t.querySelector('input[name="variant"]');
  !n || n.disabled || !_e(n.value) || (n.checked = !0, e.dataset.paranormalToolkitSelectedVariant = n.value, r(n.value), n.dispatchEvent(new Event("change", { bubbles: !0 })), Pn(e));
}
function Pn(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let r = null;
  for (const n of t) {
    const o = n.querySelector('input[name="variant"]'), a = o?.checked === !0;
    n.setAttribute("aria-checked", a ? "true" : "false"), a && _e(o.value) && (r = o.value);
  }
  return r && (e.dataset.paranormalToolkitSelectedVariant = r), r;
}
function Uc(e, t) {
  const r = e.querySelector('input[name="spendResource"]');
  r && (t(r.checked), r.addEventListener("change", () => {
    t(r.checked);
  }));
}
function Bc(e, t, r) {
  const n = jc(e) ?? r, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: n,
    spendResource: o
  };
}
function jc(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (_e(t)) return t;
  const r = e?.dataset.paranormalToolkitSelectedVariant;
  return _e(r) ? r : null;
}
function Hc(e) {
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
async function qc(e) {
  return le.request(e);
}
const _t = {
  label: "Padrão"
}, Vc = {
  label: "Discente",
  extraCost: 2
}, Gc = {
  label: "Verdadeiro",
  extraCost: 5
};
class zc {
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
    const n = this.resolveCostPreview(t), o = Tl(r), a = Rl(r, t.item, n, o), s = await qc({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((E) => E.name),
      cost: n,
      defaultSpendResource: Il(r),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const i = Wc(s), d = $l(r, t.item, i.variant, o), g = en();
    let y = null;
    if (g) {
      const E = await Yc(this.resources, t.actor, i, d, n);
      if (!E.ok)
        return {
          status: "failed",
          reason: E.reason,
          message: E.message
        };
      try {
        y = await bc(t.actor);
      } catch (K) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: K instanceof Error ? K.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: K
        };
      }
    }
    const R = Kc(r, i, d, n, {
      includeCostSteps: !g
    });
    if (R.steps.length === 0) {
      const E = wl(t, i), K = Ar(t.actor, y, d, n), Mt = br(r, i, d, n, E, y);
      return K.length > 0 ? {
        status: "ready",
        workflowContext: E,
        actions: K,
        summaryLines: Mt
      } : {
        status: "completed-without-actions",
        workflowContext: E,
        summaryLines: Mt
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
    const k = b.value.context, m = Xc(r, t, k), he = Ar(t.actor, y, d, n), W = br(r, i, d, n, k, y);
    if (!m.ok)
      return {
        status: "failed",
        reason: m.reason,
        message: m.message
      };
    const ye = [...he, ...m.actions];
    return ye.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: k,
      summaryLines: W
    } : {
      status: "ready",
      workflowContext: k,
      actions: ye,
      summaryLines: W
    };
  }
  async applyAction(t) {
    return Ce(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function Wc(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function Kc(e, t, r, n, o) {
  const a = [], s = t.spendResource === !0;
  for (const i of e.steps)
    i.type === "modifyResource" || i.type === "chatCard" || St(i) && (!o.includeCostSteps || !s) || a.push(Qc(i, r));
  return o.includeCostSteps && s && n && El(r.extraCost) && a.push({
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
async function Yc(e, t, r, n, o) {
  if (r.spendResource !== !0) return { ok: !0 };
  const a = pe(o, n);
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
function Qc(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function Ar(e, t, r, n) {
  if (!t || t.success) return [];
  const o = pe(n, r);
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
function Xc(e, t, r) {
  const n = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const a = $e(o, r);
    if (!a.ok)
      return {
        ok: !1,
        reason: a.error.reason,
        message: a.error.message
      };
    const s = sl(o.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(...Zc(e, o, i, a.value));
  }
  return { ok: !0, actions: n };
}
function Zc(e, t, r, n) {
  if (!rl(e, t))
    return [Rr(t, r, n)];
  const o = al();
  return Ln(e).map((a) => {
    const s = nl(n, a);
    return Rr(t, r, s, {
      option: a,
      choiceGroupId: o
    });
  });
}
function Rr(e, t, r, n) {
  const o = t.name ?? "Ator sem nome", a = tl(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: Jc(e, o, r, n?.option),
    executedLabel: el(e, o, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function Jc(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function el(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function tl(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function rl(e, t) {
  return t.operation === "damage" && t.resource === "PV" && Ln(e).length > 1;
}
function Ln(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function nl(e, t) {
  const r = e * t.multiplier, n = ol(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function ol(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function al() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function sl(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function br(e, t, r, n, o, a = null) {
  return [
    `Forma: ${En(t.variant)}`,
    cl(t, r, n),
    ...il(a),
    ...Object.values(o.rolls).flatMap(ll),
    ...ul(e.resistance),
    ...yl(r)
  ];
}
function il(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function cl(e, t, r) {
  const n = pe(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function ll(e) {
  const r = [`${Al(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = dl(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${hl(e.damageType)}`), r;
}
function ul(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function dl(e) {
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
    const s = ml(a);
    s && (gl(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function ml(e) {
  const t = fl(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : pl(e);
}
function fl(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function pl(e) {
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
function gl(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function hl(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function yl(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Al(e) {
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
function Rl(e, t, r, n) {
  return In.map((o) => {
    const a = Nn(e, t, o, n), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? En(o),
      enabled: s,
      details: a ? bl(a, r, n) : [],
      finalCostText: a ? kl(r, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function bl(e, t, r) {
  const n = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? n.push(o.join(", ")) : r && n.push("efeito manual");
  const a = pe(t, e);
  return n.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), n;
}
function pe(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function kl(e, t) {
  const r = pe(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function Tl(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(St);
}
function wl(e, t) {
  return $n({
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
function $l(e, t, r, n) {
  return Nn(e, t, r, n) ?? _t;
}
function Nn(e, t, r, n) {
  const o = e.ritualForms?.[r] ?? null;
  return o || (n ? _l(t, r) ? Cl(r) : null : r === "base" ? _t : null);
}
function Cl(e) {
  switch (e) {
    case "base":
      return _t;
    case "discente":
      return Vc;
    case "verdadeiro":
      return Gc;
  }
}
function _l(e, t) {
  if (t === "base") return !0;
  const r = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Sl(foundry.utils.getProperty(e, r));
}
function Sl(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Il(e) {
  return e.steps.some(St);
}
function St(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function El(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Pl(e, t) {
  const r = await Ll(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: Dl(r),
    total: Ol(r),
    diceBreakdown: vl(r)
  };
}
function Dn(e) {
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
async function Ll(e, t) {
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
  return Nl(n);
}
function Nl(e) {
  return kr(e) ? e : Array.isArray(e) ? e.find(kr) ?? null : null;
}
function kr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Dl(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Ol(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function vl(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(Ml);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Ml(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const On = "itemUsePrompts", vn = "chatCard", Oe = "data-paranormal-toolkit-prompt-id", ve = "data-paranormal-toolkit-pending-id", It = "data-paranormal-toolkit-executed-label", at = "data-paranormal-toolkit-choice-group", Mn = "data-paranormal-toolkit-skipped-label", Tr = "data-paranormal-toolkit-action-section", wr = "data-paranormal-toolkit-detail-key", $r = "data-paranormal-toolkit-roll-card", Et = "data-paranormal-toolkit-roll-detail-toggle", Fn = "data-paranormal-toolkit-roll-detail-id", xn = "data-paranormal-toolkit-resistance-roll-button", Un = "data-paranormal-toolkit-resistance-skill", Bn = "data-paranormal-toolkit-resistance-skill-label", jn = "data-paranormal-toolkit-resistance-target-actor-id", Hn = "data-paranormal-toolkit-resistance-target-name", qn = "data-paranormal-toolkit-resistance-roll-result", Cr = "data-paranormal-toolkit-system-card-replaced", Fl = `[${ve}]`, xl = `[${Et}]`, Ul = `[${xn}]`, st = `${l}-chat-enrichment`, p = `${l}-item-use-prompt`, Bl = `${p}__actions`, _r = `${p}__details`, Vn = `${p}__summary`, jl = `${p}__title`, Gn = `${p}__button--executed`, Sr = `${p}__roll-card`;
let Ir = !1, it = null;
const I = /* @__PURE__ */ new Map(), Hl = [0, 100, 500, 1500, 3e3], ql = 3e4, Vl = [0, 100, 500, 1500, 3e3];
function Gl(e) {
  if (it = e, Ir) {
    Pr(e);
    return;
  }
  const t = (r, n) => {
    Wn(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Ir = !0, Pr(e);
}
async function Er(e) {
  const t = zn(e);
  I.set(e.pendingId, t), await Nt(t) || no(t), Kn(e.pendingId);
}
async function zl(e) {
  const t = zn({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", I.set(e.pendingId, t), await Nt(t) || no(t), Kn(e.pendingId);
}
async function Ge(e, t) {
  const r = I.get(e);
  I.delete(e), r && await Gu(r, t);
}
function Pt(e) {
  const t = lo();
  for (const r of t) {
    const n = M(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function Wl(e, t) {
  const r = Pt(e);
  if (!r) return;
  const n = M(r.message), o = n[e];
  o && (n[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await ne(r.message, n));
}
async function Kl(e, t, r) {
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
  a && await ne(n.message, o);
}
function zn(e) {
  const t = U(e.context.message), r = e.context.targets.find((s) => dt(s)), n = r ? dt(r) : null, o = e.resistanceTargetActor ?? n, a = e.resistanceTargetName ?? r?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: bu(e.context),
    executed: !1
  };
}
function Wn(e, t, r) {
  Vu();
  const n = Fe(t);
  if (!n) return;
  const o = ju(e, n);
  o.length > 0 && Se(n);
  for (const a of o)
    ct(n, a);
  Xn(n, r), lt(n), ut(n);
}
function Pr(e) {
  for (const t of Vl)
    globalThis.setTimeout(() => {
      Yl(e);
    }, t);
}
function Yl(e) {
  for (const t of Ql()) {
    const r = Me(t);
    Xl(r) && Wn(r, t, e);
  }
}
function Ql() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function Xl(e) {
  return e ? Dt(e) ? !0 : Wu(e).length > 0 : !1;
}
function Kn(e) {
  const t = I.get(e);
  if (!t) return;
  const r = t.messageId ? Hu(t.messageId) : null;
  if (r) {
    vr(r, t), Se(r), ct(r, t), Lr(r), lt(r), ut(r);
    return;
  }
  if (t.messageId) {
    ft(t);
    return;
  }
  const n = qu(t);
  if (n) {
    vr(n, t), Se(n), ct(n, t), Lr(n), lt(n), ut(n);
    return;
  }
  ft(t);
}
function Lr(e) {
  it && Xn(e, it);
}
function Se(e) {
  const t = Zl();
  e.classList.toggle(`${p}--system-card-replaced`, t);
  const r = Qn(e);
  if (!r || (r.classList.toggle(`${p}__host--system-card-replaced`, t), !t) || r.getAttribute(Cr) === "true") return;
  const n = r.querySelector(`.${st}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(Cr, "true");
}
function Zl() {
  try {
    return ua() === "replace";
  } catch {
    return !1;
  }
}
function ct(e, t) {
  if (Se(e), e.querySelector(`[${Oe}="${oe(t.pendingId)}"]`)) return;
  const r = Jl(e, t);
  tu(r, t), gu(r, hu(t)).append(Ru(t));
}
function Jl(e, t) {
  const r = e.querySelector(`.${st}`);
  if (r)
    return r;
  const n = document.createElement("section");
  n.classList.add(st, p);
  const o = document.createElement("header");
  o.classList.add(`${p}__header`);
  const a = document.createElement("span");
  a.classList.add(`${p}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(jl), s.textContent = eu(t);
  const i = document.createElement("span");
  return i.classList.add(Vn), i.textContent = t.summary, o.append(a, s, i), n.append(o), Tu(e).append(n), n;
}
function eu(e) {
  const t = $(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function tu(e, t) {
  const r = t.summaryLines ?? [], n = to(r, t);
  if (n) {
    ru(e, n, t);
    return;
  }
  yu(e, r);
}
function ru(e, t, r) {
  if (e.querySelector(`[${$r}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(Sr, `${Sr}--${t.intent}`), n.setAttribute($r, "true"), t.castingCheck && Nr(n, ou(t.castingCheck), r.pendingId, "casting"), nu(t) && Nr(n, au(t), r.pendingId, "effect"), uu(n, t), du(n, t, r), pu(n, t), e.append(n);
}
function nu(e) {
  return e.intent !== "casting";
}
function ou(e) {
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
function au(e) {
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
function Nr(e, t, r, n) {
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
  su(o, t), fu(o, t.detailRows, r, n, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function su(e, t) {
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-roll`);
  const n = document.createElement("span");
  n.classList.add(`${p}__workflow-roll-formula`), n.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${p}__workflow-roll-total`), o.textContent = String(t.total), r.append(n, o);
  const a = iu(t.formula, t.diceBreakdown);
  a && r.append(a), e.append(r);
}
function iu(e, t) {
  const r = cu(t);
  if (r.length === 0) return null;
  const n = document.createElement("div");
  n.classList.add(`${p}__workflow-dice-tray`);
  for (const o of lu(r, e)) {
    const a = document.createElement("span");
    a.classList.add(`${p}__workflow-die`), o.active || a.classList.add(`${p}__workflow-die--inactive`), a.textContent = String(o.value), n.append(a);
  }
  return n;
}
function cu(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((n) => Number(n.trim())).filter((n) => Number.isFinite(n)).map((n) => Math.trunc(n)) : [];
}
function lu(e, t) {
  if (e.length <= 1) return e.map((n) => ({ value: n, active: !0 }));
  const r = t.toLowerCase();
  return r.includes("kh") ? Dr(e, "highest") : r.includes("kl") ? Dr(e, "lowest") : e.map((n) => ({ value: n, active: !0 }));
}
function Dr(e, t) {
  const r = t === "highest" ? Math.max(...e) : Math.min(...e);
  let n = !1;
  return e.map((o) => {
    const a = !n && o === r;
    return a && (n = !0), { value: o, active: a };
  });
}
function uu(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(dd);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__roll-meta`);
  for (const o of r) {
    const a = document.createElement("span");
    a.classList.add(`${p}__roll-meta-pill`), a.textContent = o, n.append(a);
  }
  e.append(n);
}
function du(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${p}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = mu(t, r);
  o.append(a), s && o.append(s);
  const i = document.createElement("span");
  i.classList.add(`${p}__resistance-description`), i.textContent = t.resistance, n.append(o, i), t.resistanceRollResult && n.append(Yn(t.resistanceRollResult)), e.append(n);
}
function mu(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${p}__resistance-roll-button`), r.setAttribute(Oe, t.pendingId), r.setAttribute(xn, "true"), r.setAttribute(Un, e.resistanceSkill), r.setAttribute(Bn, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(jn, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(Hn, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${p}__resistance-roll-button--rolled`), r.setAttribute(qn, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${p}__resistance-roll-fallback`), o.textContent = "d20", r.append(n, o), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function Yn(e) {
  const t = document.createElement("span");
  return t.classList.add(`${p}__resistance-roll-result`), t.textContent = Jn(e), t;
}
function fu(e, t, r, n, o) {
  const a = t.filter((g) => g.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${r}-roll-details-${n}`, i = document.createElement("button");
  i.type = "button", i.classList.add(`${p}__roll-detail-toggle`), i.setAttribute(Et, s), i.setAttribute("aria-expanded", "false"), i.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${p}__roll-detail-list`), d.setAttribute(Fn, s), d.hidden = !0;
  for (const g of a) {
    const y = document.createElement("dt");
    y.textContent = g.label;
    const R = document.createElement("dd");
    R.textContent = g.value, d.append(y, R);
  }
  e.append(i, d);
}
function pu(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-notes`);
  for (const n of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = n, r.append(o);
  }
  e.append(r);
}
function gu(e, t) {
  const r = `[${Tr}="${oe(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const o = document.createElement("div");
  o.classList.add(Bl), o.setAttribute(Tr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${p}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function hu(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = to(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function yu(e, t) {
  if (t.length === 0) return;
  const r = Au(e);
  for (const n of t) {
    const o = md(n);
    if (r.querySelector(`[${wr}="${oe(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = n, a.setAttribute(wr, o), r.append(a);
  }
}
function Au(e) {
  const t = e.querySelector(`.${_r}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(_r), e.append(r), r;
}
function Ru(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${p}__button`), t.setAttribute(Oe, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Gn), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(ve, e.pendingId), t.setAttribute(It, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(at, e.choiceGroupId), t.setAttribute(Mn, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function bu(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = ku(e);
  return `${t} → ${r}`;
}
function ku(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Tu(e) {
  return Qn(e) ?? e;
}
function Qn(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Xn(e, t) {
  const r = Fe(e);
  if (!r) return;
  const n = r.querySelectorAll(Fl);
  for (const o of n)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Mu(o, t);
    }));
}
function lt(e) {
  const t = Fe(e);
  if (!t) return;
  const r = t.querySelectorAll(xl);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      wu(t, n);
    }));
}
function ut(e) {
  const t = Fe(e);
  if (!t) return;
  const r = t.querySelectorAll(Ul);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      $u(t, n);
    }));
}
function wu(e, t) {
  const r = t.getAttribute(Et);
  if (!r) return;
  const n = e.querySelector(`[${Fn}="${oe(r)}"]`);
  if (!n) return;
  const o = n.hidden;
  n.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function $u(e, t) {
  const r = t.getAttribute(Oe), n = t.getAttribute(Un), o = t.getAttribute(Bn) ?? (n ? Dn(n) : "Resistência");
  if (!r || !n) return;
  const a = Su(e, r), s = Iu(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Pl(s, n);
    await Du(d.roll);
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
    Cu(t, g), _u(t, g), Ou(r, g), await vu(e, r, g);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function Cu(e, t) {
  e.classList.add(`${p}__resistance-roll-button--rolled`), e.setAttribute(qn, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function _u(e, t) {
  const r = e.closest(`.${p}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${p}__resistance-roll-result`), o = n ?? Yn(t);
  if (n) {
    n.textContent = Jn(t);
    return;
  }
  r.append(o);
}
function Su(e, t) {
  const r = I.get(t);
  if (r) return r;
  const n = Me(e);
  return M(n)[t] ?? null;
}
function Iu(e, t) {
  const r = e?.resistanceTargetActor;
  if (D(r)) return r;
  const o = e?.context?.targets.map(dt).find(D) ?? null;
  if (o) return o;
  const a = t.getAttribute(jn) ?? e?.resistanceTargetActorId ?? null, s = a ? Pu(a) : null;
  return s || Lu(
    t.getAttribute(Hn) ?? e?.resistanceTargetName ?? Eu(t)
  );
}
function Eu(e) {
  const r = e.closest(`.${p}`)?.querySelector(`.${Vn}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const o = r.split(n), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function dt(e) {
  const t = e.actor;
  if (D(t)) return t;
  const r = e.token, n = de(r);
  if (n) return n;
  const o = e.document;
  return de(o);
}
function de(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (D(t)) return t;
  const r = e.document?.actor;
  return D(r) ? r : null;
}
function Pu(e) {
  const r = game.actors?.get?.(e);
  return D(r) ? r : Zn().map((a) => de(a)).find((a) => a?.id === e) ?? null;
}
function Lu(e) {
  const t = J(e);
  if (!t) return null;
  const r = Zn().filter((a) => J(Nu(a)) === t).map((a) => de(a)).find(D) ?? null;
  if (r) return r;
  const o = game.actors?.find?.((a) => D(a) && J(a.name) === t);
  return D(o) ? o : null;
}
function Zn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Nu(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : de(e)?.name ?? null;
}
function J(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function D(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Jn(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function Du(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Ou(e, t) {
  const r = I.get(e);
  r && (r.resistanceRollResult = t);
}
async function vu(e, t, r) {
  const n = Me(e);
  if (n)
    try {
      const o = M(n), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: r
      }, await ne(n, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Me(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return v(n?.get?.(r));
}
async function Mu(e, t) {
  const r = e.getAttribute(ve);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    eo(e, e.getAttribute(It) ?? "✓ Automação aplicada"), Fu(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function eo(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Gn), e.removeAttribute(ve), e.removeAttribute(It);
}
function Fu(e) {
  const t = e.getAttribute(at);
  if (!t) return;
  const r = e.closest(`.${p}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${at}="${oe(t)}"]`;
  for (const o of r.querySelectorAll(n)) {
    if (o === e) continue;
    const a = o.getAttribute(Mn) ?? "✓ Outra opção escolhida";
    eo(o, a);
  }
}
function to(e, t) {
  const r = e.map(Lt).filter(ld), n = r.find((m) => m.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const o = $(e, "Forma"), a = $(e, "Custo"), s = $(e, "Dados") ?? $(e, `Dados (${n.label})`), i = $(e, "Tipo"), d = $(e, "Resistência"), g = $(e, "Resistência Perícia"), y = $(e, "Resistência Rótulo") ?? (g ? Dn(g) : null), R = ro(e, "Observação"), b = e.filter((m) => Bu(m, n)), k = xu(e);
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
function xu(e) {
  const t = e.map(Lt).find((a) => a?.intent === "casting") ?? null, r = $(e, "Conjuração DT"), n = $(e, "Conjuração Resultado");
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
function Lt(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, r, n, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: r,
    formula: n,
    total: a,
    intent: Uu(r)
  } : null;
}
function Uu(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function $(e, t) {
  return ro(e, t)[0] ?? null;
}
function ro(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const o = n.slice(r.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Bu(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Lt(e) ? !1 : e.trim().length > 0;
}
function ju(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of I.values())
    mt(n, e, t) && r.set(n.pendingId, n);
  for (const n of zu(e))
    mt(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, o) => n.createdAt - o.createdAt);
}
function mt(e, t, r) {
  const n = U(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !Or(r, "itemId", e.itemId) ? !1 : !e.actorId || Or(r, "actorId", e.actorId);
}
function Or(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${fd(t)}`;
  for (const o of e.querySelectorAll(`[${n}]`))
    if (o.getAttribute(n) === r)
      return !0;
  return !1;
}
function Hu(e) {
  const t = oe(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function qu(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (mt(e, null, t))
      return t;
  return null;
}
function Vu() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of I.entries())
    e - n.createdAt > t && I.delete(r);
}
async function vr(e, t) {
  const r = Me(e);
  if (!r) return !1;
  try {
    const n = M(r);
    return n[t.pendingId] = Ot(t, U(r)), await ne(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function Nt(e) {
  const t = so(e);
  if (!t) return !1;
  try {
    const r = M(t);
    return r[e.pendingId] = Ot(e, U(t)), await ne(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function no(e) {
  for (const t of Hl)
    globalThis.setTimeout(() => {
      ft(e);
    }, t);
}
async function ft(e) {
  const t = so(e);
  if (Dt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const n = await Nt(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function Gu(e, t) {
  const r = ao(e.context.message);
  if (r)
    try {
      const n = M(r), o = n[e.pendingId] ?? Ot(e, U(r));
      n[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await ne(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function zu(e) {
  return Object.values(M(v(e))).filter(ge);
}
function M(e) {
  if (!e) return {};
  const t = {}, r = Dt(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, o] of Object.entries(oo(e)))
    t[n] ??= o;
  return t;
}
function Wu(e) {
  return Object.values(oo(v(e))).filter(ge);
}
function oo(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, On);
  if (!ee(t))
    return {};
  const r = {};
  for (const [n, o] of Object.entries(t))
    ge(o) && (r[n] = o);
  return r;
}
async function ne(e, t) {
  typeof e.setFlag == "function" && (await Yu(e, t), await Ku(e, t));
}
async function Ku(e, t) {
  await Promise.resolve(e.setFlag?.(l, On, t));
}
function Dt(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, vn);
  return id(t) ? t : null;
}
async function Yu(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(ge).sort((a, s) => a.createdAt - s.createdAt);
  if (r.length === 0) return;
  const n = r[0];
  if (!n) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...r.map((a) => a.createdAt)),
    messageId: n.messageId ?? U(e) ?? null,
    source: {
      actorId: n.actorId,
      actorName: Qu(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(l, vn, o));
}
function Qu(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function Ot(e, t) {
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
function ao(e) {
  const t = v(e);
  if (t?.setFlag)
    return t;
  const r = Xu(e);
  if (r?.setFlag)
    return r;
  const n = U(e);
  if (!n) return null;
  const o = game.messages;
  return v(o?.get?.(n));
}
function Xu(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(v).find((r) => typeof r?.setFlag == "function") ?? null;
}
function so(e) {
  const t = ao(e.context.message);
  if (t) return t;
  const r = e.messageId ? Zu(e.messageId) : null;
  if (r) return r;
  const n = lo().slice().reverse();
  return n.find((o) => Ju(o, e)) ?? n.find((o) => ed(o, e)) ?? null;
}
function Zu(e) {
  const t = game.messages;
  return v(t?.get?.(e));
}
function Ju(e, t) {
  const r = U(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!io(e, t)) return !1;
  const o = co(e);
  return !t.actorId || !o || o === t.actorId;
}
function ed(e, t) {
  if (!rd(e, t)) return !1;
  const r = co(e);
  return t.actorId && r === t.actorId ? !0 : io(e, t);
}
function io(e, t) {
  const r = J(td(e));
  if (!r) return !1;
  const n = J(t.itemName);
  if (n && r.includes(n)) return !0;
  const o = J(t.itemId);
  return !!(o && r.includes(o));
}
function td(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function co(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function rd(e, t) {
  const r = nd(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= ql;
}
function nd(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function v(e) {
  return e && typeof e == "object" ? e : null;
}
function ge(e) {
  return ee(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && C(e.messageId) && C(e.itemId) && C(e.actorId) && C(e.itemName) && V(e.resistanceTargetActorId) && V(e.resistanceTargetName) && cd(e.resistanceRollResult) && od(e.actionPayload) && ze(e.title) && ze(e.buttonLabel) && ze(e.executedLabel) && V(e.choiceGroupId) && V(e.skippedLabel) && V(e.actionSectionId) && V(e.actionSectionTitle) && ud(e.summaryLines) : !1;
}
function od(e) {
  return e == null ? !0 : ee(e) ? e.kind === "resource-operation" && C(e.actorId) && C(e.actorUuid) && typeof e.actorName == "string" && ad(e.resource) && sd(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function ad(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function sd(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function id(e) {
  return ee(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && C(e.messageId) && ee(e.source) && C(e.source.actorId) && C(e.source.actorName) && C(e.source.itemId) && C(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ge) : !1;
}
function cd(e) {
  return e == null ? !0 : ee(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && V(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function ld(e) {
  return e !== null;
}
function ee(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function C(e) {
  return e === null || typeof e == "string";
}
function ze(e) {
  return e === void 0 || typeof e == "string";
}
function V(e) {
  return e == null || typeof e == "string";
}
function ud(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function dd(e) {
  return typeof e == "string" && e.length > 0;
}
function lo() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(v).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(v).filter((n) => n !== null) : [];
}
function Fe(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function U(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function md(e) {
  return e.trim().toLowerCase();
}
function fd(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function oe(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Mr = 1e3;
class pd {
  constructor(t, r, n, o) {
    this.workflow = t, this.resources = r, this.debugOutput = o, this.ritualAssistant = new zc(t, r, n);
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
      settings: qt(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = qt();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = gt(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && gd(t.item) && r.executionMode === "ask") {
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
    if (await pr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ke(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await Ge(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const n = await this.ritualAssistant.applyAction(r.action);
    return n.ok ? (r.workflowContext.resourceTransactions.push(n.value), this.pendingExecutions.delete(t), await Ge(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(n), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = Pt(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, o = Ad(n);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const a = await Ce(this.resources, o, n.resource, n.operation, n.amount);
    return a.ok ? (await Wl(t), await Kl(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Gl((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await pr(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Ke(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(t, hd(t.item));
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
        await this.registerCompletedRitualCard(t, n.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), u.info("Ritual assistido concluído sem ações pendentes.", z(n.workflowContext));
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
      a.kind === "resource-action" && (this.pendingExecutions.delete(o), await Ge(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, r) {
    const n = Ye();
    await zl({
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
      const i = Ye();
      a ??= i, this.pendingExecutions.set(i, {
        kind: "resource-action",
        id: i,
        action: s,
        context: t,
        workflowContext: r,
        createdAt: Date.now()
      }), await Er({
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
        actionPayload: yd(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), u.info("Ritual assistido preparado com ações pendentes.", z(r));
  }
  async createPendingWorkflowPrompt(t, r) {
    const n = Ye();
    this.pendingExecutions.set(n, {
      kind: "workflow",
      id: n,
      definition: r,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Er({
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
    this.setAttempt(t, "completed"), u.info("Automação executada por uso normal de item.", z(o.value.context));
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
    const r = Date.now(), n = Fr(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      r - s > Mr && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(n);
    return o !== void 0 && r - o <= Mr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Fr(t), Date.now());
  }
  setAttempt(t, r, n, o) {
    this.lastAttempt = Ke(t, r, n, o);
  }
}
function gd(e) {
  return e.type === "ritual";
}
function hd(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function yd(e) {
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
function Ad(e) {
  const t = e.actorUuid ? Rd(e.actorUuid) : null;
  if (te(t)) return t;
  const r = e.actorId ? bd(e.actorId) : null;
  return r || kd(e.actorName);
}
function Rd(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function bd(e) {
  const r = game.actors?.get?.(e);
  if (te(r)) return r;
  for (const n of uo()) {
    const o = vt(n);
    if (o?.id === e) return o;
  }
  return null;
}
function kd(e) {
  const t = We(e);
  if (!t) return null;
  for (const o of uo()) {
    const a = Td(o);
    if (We(a) === t) {
      const s = vt(o);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((o) => te(o) && We(o.name) === t);
  return te(n) ? n : null;
}
function uo() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Td(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : vt(e)?.name ?? null;
}
function vt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (te(t)) return t;
  const r = e.document?.actor;
  return te(r) ? r : null;
}
function We(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function te(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ke(e, t, r, n) {
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
function Fr(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function Ye() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class wd {
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
class $d {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = fe(t).map((i) => this.analyzeRitual(i)), n = r.filter(Te("upToDate")), o = r.filter(Te("available")), a = r.filter(Te("outdated")), s = r.filter(Te("unsupported"));
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
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = Cd(t);
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
      reason: _d(n, r.preset)
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
    preset: e.match ? Pe(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function Cd(e) {
  const t = e.getFlag(l, "automation");
  return ht(t) ? t : null;
}
function _d(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Te(e) {
  return (t) => t.status === e;
}
class Sd {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const r = this.createResourceOperationContent(t.transaction), n = At(t.transaction);
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
    const n = this.createWorkflowSummaryContent(t, r), o = z(t);
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
    const r = A(t.actorName), n = A(t.resource), o = A(xr(t)), a = A(Ed(t));
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
    const n = A(r.title ?? "Automação"), o = r.message ? `<p>${A(r.message)}</p>` : "", a = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = A(t.item.name ?? "Item sem nome"), i = t.targets.length > 0 ? t.targets.map((m) => A(m.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (m) => `<li><strong>${A(m.id)}:</strong> ${A(m.formula)} = ${m.total} <em>(${A(Id(m.intent))})</em>${m.damageType ? ` — ${A(m.damageType)}` : ""}</li>`
    ), g = t.ritualCosts.map(
      (m) => `<li><strong>${A(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${A(m.resource)} (${A(Pd(m.source))})</li>`
    ), y = t.damageInstances.map(
      (m) => `<li><strong>${A(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${A(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), R = t.healingInstances.map(
      (m) => `<li><strong>${A(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), b = t.resourceTransactions.map(
      (m) => `<li><strong>${A(m.actorName)}:</strong> ${A(xr(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
    ), k = t.phases.map((m) => A(m)).join(" &rarr; ");
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
          ${g.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${g.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Dano:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Cura:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${b.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p class="${l}-workflow-card__phases"><strong>Fases:</strong> ${k}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Id(e) {
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
function xr(e) {
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
function Ed(e) {
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
function Pd(e) {
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
function Ld() {
  const e = new Zs(), t = new Wi(e), r = new ti(), n = new oi(r), o = new Ri(e), a = new ki(), s = a.registerMany(qo());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new bi(), d = new yi(), g = new $d(a), y = new wd(g, i, d), R = new Xi(), b = new Sd(R), k = new Qi(), m = new Gi(t, n, b, k), he = new Yi(m, k), W = new pd(he, t, n, R);
  return W.addStrategy(new gi((ye) => W.handleItemUsed(ye))), {
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
    workflow: he,
    itemUseIntegration: W,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: y
  };
}
const { ApplicationV2: Nd } = foundry.applications.api;
class Ie extends Nd {
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
      apply: Ie.onApply,
      cancel: Ie.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${P(pt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${P(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Qe("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Qe("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Qe("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Qe(e, t, r, n) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${n}"></i>
        <span>${P(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? Dd(r) : vd(t)}
    </section>
  `;
}
function Dd(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Od).join("")}</ol>`;
}
function Od(e) {
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
function vd(e) {
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
const Ee = `${l}.manageRitualPresets`, Ur = `__${l}_ritualPresetHeaderControlRegistered`, Md = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Fd(e) {
  const t = globalThis;
  if (!t[Ur]) {
    for (const r of Md)
      Hooks.on(r, (n, o) => {
        xd(n, o, e);
      });
    t[Ur] = !0, u.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function xd(e, t, r) {
  Array.isArray(t) && Bd(e) && (Ud(e, r), !t.some((n) => n.action === Ee) && t.push({
    action: Ee,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), mo(e, r);
    }
  }));
}
function Ud(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Ee] && (e.options.actions[Ee] = (r) => {
    r.preventDefault(), r.stopPropagation(), mo(e, t);
  }));
}
function Bd(e) {
  if (!game.user?.isGM) return !1;
  const t = fo(e);
  return t ? t.type === "agent" && fe(t).length > 0 : !1;
}
function mo(e, t) {
  const r = fo(e);
  if (!r) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Ie(r, t).render({ force: !0 });
}
function fo(e) {
  return Br(e.actor) ? e.actor : Br(e.document) ? e.document : null;
}
function Br(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let Q = null;
Hooks.once("init", () => {
  Bo(), la(), Na(), Xs(), u.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Gt.isSupportedSystem()) {
    u.warn(
      `Sistema não suportado: ${Gt.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Q = Ld(), Q.itemUseIntegration.registerStrategies(), Aa(Q), Ea(), Ca(), Fd(Q), u.info("Inicializado para o sistema Ordem Paranormal."), u.info(`API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${pt} inicializado.`);
});
function jd() {
  if (!Q)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Q;
}
export {
  jd as getToolkitServices
};
//# sourceMappingURL=main.js.map
