const c = "paranormal-toolkit", pt = "Paranormal Toolkit", lo = "ordemparanormal";
class fe {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Ee(e) {
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
function gt(e) {
  const t = e.getFlag(c, "automation");
  return t == null ? f({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : ht(t) ? h(t.definition) : f({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function uo(e) {
  return ht(e.getFlag(c, "automation"));
}
function ht(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && fo(t.source) && mo(t.definition);
}
function mo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && _(t.label) && Array.isArray(t.steps) && t.steps.every(po);
}
function fo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? _(t.presetId) && _(t.presetVersion) && _(t.appliedAt) : t.type === "manual" ? _(t.label) && _(t.appliedAt) : !1;
}
function po(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return go(t);
    case "spendRitualCost":
      return ho(t);
    case "rollFormula":
      return yo(t);
    case "modifyResource":
      return Ao(t);
    case "chatCard":
      return Ro(t);
    default:
      return !1;
  }
}
function go(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ur(t);
}
function ho(e) {
  return e.type === "spendRitualCost";
}
function yo(e) {
  const t = e;
  return t.type === "rollFormula" && _(t.id) && _(t.formula) && (t.intent === void 0 || wo(t.intent)) && (t.damageType === void 0 || _(t.damageType));
}
function Ao(e) {
  const t = e;
  return t.type === "modifyResource" && bo(t.actor) && ko(t.resource) && To(t.operation) && Ur(t);
}
function Ro(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Ur(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || _(e.amountFrom);
}
function bo(e) {
  return e === "self" || e === "target";
}
function ko(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function To(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function wo(e) {
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
    if (_o(t))
      return Array.from(t).filter(Ft);
  }
  return [];
}
function $o(e) {
  return yt(e)[0] ?? null;
}
function Co(e) {
  return yt(e).find(uo) ?? null;
}
function _o(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ft(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function pe(e) {
  return yt(e).filter((t) => t.type === "ritual");
}
function xr(e) {
  return pe(e)[0] ?? null;
}
function So(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Ee);
      return l.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = ie("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = Ae(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(Bt);
      return l.info(`Presets encontrados para ${r.name}.`, n), n;
    },
    async applyPresetToFirstRitual(t) {
      const r = ie("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!r) return;
      const n = Ae(r);
      if (!n) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await Xe(e, n, o.value);
      l.info(`Preset ${o.value.id} aplicado em ${n.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = ie("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const r = Ae(t);
      if (!r) return;
      const n = e.automationRegistry.findForItem(r)[0];
      if (!n) {
        l.warn(`Nenhum preset compatível encontrado para ${r.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${r.name}.`);
        return;
      }
      const o = await Xe(e, r, n.preset);
      l.info(`Melhor preset aplicado em ${r.name}.`, { match: Bt(n), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${n.preset.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Ut(e);
    },
    async applyBestPresetsToActorRituals() {
      return Ut(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = ie("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = Ae(t);
      r && (await e.automationBinder.clear(r), l.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function Ut(e) {
  const t = ie("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = pe(t);
  if (r.length === 0)
    return l.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), xt(t);
  const n = xt(t, r.length);
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
    n.applied.push(Io(o, a, s));
  }
  return l.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), Po(n), n;
}
async function Xe(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function Io(e, t, r) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Ee(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: r.applied,
    itemPatchReason: r.applied ? void 0 : r.reason
  };
}
function xt(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Po(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", r = e.applied.some((n) => n.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${r}${t}.`
  );
}
function Bt(e) {
  return {
    preset: Ee(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function ie(e) {
  const t = fe.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ae(e) {
  const t = xr(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function G(e) {
  return e ? {
    id: e.id,
    source: {
      ...Eo(e.sourceActor),
      token: e.sourceToken
    },
    item: Lo(e.item),
    targets: e.targets.map(Do),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: jt(e.rollRequests, Br),
    rolls: jt(e.rolls, No),
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
function Eo(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Lo(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Do(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Br(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function No(e) {
  return {
    ...Br(e),
    total: e.total
  };
}
function jt(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function vo(e) {
  return {
    getSelected() {
      return fe.getSelectedActor();
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
    Oo(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    l.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  l.info(`${t} realizado:`, At(a));
}
function B(e) {
  const t = fe.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Oo(e) {
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
function Mo() {
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
  await game.settings.set(c, L[e], t);
}
function Re(e, t) {
  game.settings.register(c, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function be(e) {
  return game.settings.get(c, e) === !0;
}
function Fo() {
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
const jr = "ritual.costOnly", Hr = "ritual.simpleHealing", Uo = "ritual.eletrocussao", qr = "ritual.simpleDamage", Vr = "generic.simpleHealing", zr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function xo() {
  return [
    Bo(),
    jo(),
    Ho(),
    qo(),
    Vo()
  ];
}
function Bo() {
  return {
    id: jr,
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
function jo() {
  return {
    id: Hr,
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
    automation: Gr(),
    itemPatch: Go()
  };
}
function Ho() {
  return {
    id: Uo,
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
    automation: zo(),
    itemPatch: Wo()
  };
}
function qo() {
  return {
    id: qr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: Rt()
  };
}
function Vo() {
  return {
    id: Vr,
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
function Gr(e = "2d8+2") {
  return Wr(
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
function zo() {
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
  return Wr(
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
function Go() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: zr,
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
function Wo() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: zr,
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
function Wr(e, t, r) {
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
function Kr() {
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
function Ko(e) {
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
        if (!Xo(t, r)) {
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
      const n = e.automationRegistry.require(jr);
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
      if (!Ht(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Hr);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: Gr(t)
      }), l.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
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
      const o = e.automationRegistry.require(qr);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: Rt(t)
      }), l.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = j("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = H(t);
      r && await Yo(e, t, r);
    }
  };
}
async function Yo(e, t, r) {
  const n = gt(r);
  if (!n.ok) {
    l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: Kr(),
    item: r,
    targets: bt()
  });
  if (!o.ok) {
    Qo(o.error);
    return;
  }
  l.info("Automação de ritual executada com sucesso.", G(o.value.context));
}
function Qo(e) {
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
  const t = fe.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function H(e) {
  const t = xr(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Xo(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Ht(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Zo = ["disabled", "ask", "automatic"], Jo = ["buttons", "confirm"], Yr = "ask";
function ea(e) {
  return typeof e == "string" && Zo.includes(e);
}
function ta(e) {
  return typeof e == "string" && Jo.includes(e);
}
function ra(e) {
  return ea(e) ? e : ta(e) ? "ask" : Yr;
}
const na = ["keep", "replace"], Qr = "keep", oa = !0, D = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function aa() {
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
    default: Yr
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
    default: Qr
  }), game.settings.register(c, D.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: oa
  }), game.settings.register(c, D.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function qt() {
  const e = ra(game.settings.get(c, D.executionMode)), t = Zr(game.settings.get(c, D.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: Xr()
  };
}
function sa() {
  return Zr(game.settings.get(c, D.systemCardMode));
}
function Xr() {
  return game.settings.get(c, D.ritualCastingCheckEnabled) === !0;
}
async function q(e) {
  await game.settings.set(c, D.executionMode, e);
}
function Zr(e) {
  return na.includes(e) ? e : Qr;
}
function ia(e) {
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
const ca = [
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
function la(e) {
  return {
    phases() {
      return ca;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Ue("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = Co(t);
      if (!r) {
        l.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
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
      if (!ma(r)) {
        l.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = da(r) ?? Ue("Nenhum ator encontrado para executar automação do item.");
      n && await Vt(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Ue("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = $o(t);
      if (!r) {
        l.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(Vr);
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
async function Vt(e, t, r) {
  const n = gt(r);
  if (!n.ok) {
    l.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: Kr(),
    item: r,
    targets: bt()
  });
  if (!o.ok) {
    ua(o.error);
    return;
  }
  l.info("Automação executada com sucesso.", G(o.value.context));
}
function ua(e) {
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
function Ue(e) {
  const t = fe.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function da(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ma(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function fa(e) {
  const t = vo(e), r = So(e), n = Ko(e), o = la(e), a = Fo(), s = ia(e);
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
function pa(e) {
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
    debug: fa(e)
  }, r = globalThis;
  return r[c] = t, r.ParanormalToolkit = t, t;
}
class zt {
  static isSupportedSystem() {
    return game.system.id === lo;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function ga() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: Z(t.id),
    actorId: Z(t.actor?.id),
    sceneId: Z(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Jr() {
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
function ha(e, t = Jr()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function ya(e) {
  if (!ba(e)) return null;
  const t = e.getFlag(c, "workflow");
  return Ra(t) ? t : null;
}
function Aa() {
  return `flags.${c}.workflow`;
}
function Gt(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${c}`), r = foundry.utils.getProperty(e, `_source.flags.${c}`);
  return t !== void 0 || r !== void 0;
}
function Wt(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Je(t) || Je(r);
}
function Ra(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function ba(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function Z(e) {
  return Je(e) ? e : null;
}
function Je(e) {
  return typeof e == "string" && e.length > 0;
}
function ka() {
  const e = (t, r) => {
    Ta(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Ta(e, t) {
  const r = ya(e);
  if (!r || r.targets.length === 0) return;
  const n = $a(t);
  if (!n || n.querySelector(`.${c}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(wa(r));
}
function wa(e) {
  const t = document.createElement("section");
  t.classList.add(`${c}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(Kt("Origem", e.source.name)), t.append(Kt("Alvo", e.targets.map((n) => n.name).join(", "))), t;
}
function Kt(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${c}-chat-enrichment__row`);
  const n = document.createElement("span");
  n.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, r.append(n, o), r;
}
function $a(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ca() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!_a(n) || !Sa(e) || Gt(e) || Gt(t)) return;
    const o = ga();
    if (o.length === 0 || !Wt(e) && !Wt(t)) return;
    const a = Jr();
    e.updateSource({
      [Aa()]: ha(o, a)
    }), l.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function _a(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Sa(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const en = {
  enabled: "dice.animations.enabled"
};
function Ia() {
  game.settings.register(c, en.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Pa() {
  return {
    enabled: game.settings.get(c, en.enabled) === !0
  };
}
const Ea = "chatCard", Yt = "data-paranormal-toolkit-prompt-id", u = `${c}-item-use-prompt`, La = `.${u}__title`, tn = `.${u}__header`, Da = `.${u}__roll-card`, Na = `.${u}__roll-meta`, va = `.${u}__roll-meta-pill`, Oa = `.${u}__resistance`, Ma = `.${u}__resistance-header`, rn = `.${u}__resistance-description`, Fa = `.${u}__resistance-roll-button`, Ua = `.${u}__resistance-roll-result`, Qt = `${u}__resistance-content`, nn = `.${u}__workflow-section`, on = `.${u}__workflow-roll`, an = `${u}__workflow-roll--dice-open`, sn = `.${u}__workflow-roll-formula`, cn = `${u}__workflow-roll-formula--toggle`, kt = `.${u}__workflow-dice-tray`, xa = `.${u}__roll-detail-toggle`, Ba = `.${u}__roll-detail-list`, ja = `.${u}__ritual-element-badge`, Ha = `.${u}__ritual-metadata`;
function qa(e) {
  for (const t of Array.from(e.querySelectorAll(nn)))
    for (const r of Array.from(t.querySelectorAll(`${xa}, ${Ba}`)))
      r.remove();
}
function Va(e) {
  for (const t of Array.from(e.querySelectorAll(Oa)))
    za(t);
}
function za(e) {
  const t = e.querySelector(Ma), r = e.querySelector(rn), n = e.querySelector(Fa), o = e.querySelector(Ua);
  if (!n || !t && !r && !o) return;
  const a = Ga(e, n);
  t && t.parentElement !== a && a.append(t), r && r.parentElement !== a && a.append(r), o && o.parentElement !== a && !n.contains(o) && a.append(o), n.parentElement !== e && e.append(n);
}
function Ga(e, t) {
  const r = e.querySelector(`.${Qt}`);
  if (r) return r;
  const n = document.createElement("div");
  return n.classList.add(Qt), e.insertBefore(n, t.parentElement === e ? t : e.firstChild), n;
}
function Xt(e) {
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
  const r = Wa(e, t);
  return we(r);
}
function Wa(e, t) {
  return t.split(".").reduce((r, n) => Le(r) ? r[n] : null, e);
}
function Ka(e, t) {
  const r = e.indexOf(":");
  return r < 0 || de(e.slice(0, r)) !== de(t) ? null : re(e.slice(r + 1));
}
function we(e) {
  return typeof e == "string" ? re(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Le(e) {
  return !!e && typeof e == "object";
}
function Ya(e) {
  return typeof e == "string";
}
function De(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function re(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function de(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function et(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function U(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function ln(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Qa(e) {
  for (const t of Array.from(e.querySelectorAll(Da))) {
    const r = ns(t);
    Xa(t), r && (Za(t, r), Ja(t, r));
  }
}
function Xa(e) {
  for (const t of Array.from(e.querySelectorAll(Na)))
    t.remove();
}
function Za(e, t) {
  const n = e.closest(`.${u}`)?.querySelector(tn) ?? null, o = n?.querySelector(La) ?? null, a = n ?? e, s = a.querySelector(ja);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const i = s ?? document.createElement("span");
  if (i.className = bs(t.elementTone), i.textContent = Rs(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", i);
      return;
    }
    a.prepend(i);
  }
}
function Ja(e, t) {
  const r = es(e);
  ts(e, r);
  const n = rs(t);
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
  const a = e.querySelector(nn);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function es(e) {
  return e.closest(`.${u}`)?.querySelector(tn) ?? null;
}
function ts(e, t) {
  const r = [e, t].filter((n) => n !== null);
  for (const n of r)
    for (const o of Array.from(n.querySelectorAll(Ha)))
      o.remove();
}
function rs(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${et(e.target)}` : null,
    e.duration ? `Duração: ${et(e.duration)}` : null,
    e.resistance ? `Resistência: ${ln(e.resistance)}` : null
  ].filter(De);
}
function ns(e) {
  const t = os(e), r = us(e), o = (t ? ls(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = wt(S(o, "element")), i = v("op.elementChoices", s) ?? Zt(z(a, "Elemento")) ?? Zt(r.damageType), d = s ?? ks(i), g = S(o, "circle") ?? z(a, "Círculo"), y = fs(o) ?? z(a, "Alvo"), R = ys(o, "duration", "op.durationChoices") ?? z(a, "Duração"), b = ds(e) ?? gs(o) ?? z(a, "Resistência"), k = ms(a) ?? r.cost, m = {
    elementLabel: i,
    elementTone: d,
    circle: g,
    cost: k,
    target: y,
    duration: R,
    resistance: b
  };
  return As(m) ? m : null;
}
function os(e) {
  const t = as(e);
  if (!t) return null;
  const r = t.getFlag?.(c, Ea), n = is(r);
  if (n.length === 0) return null;
  const o = ss(e);
  if (o.size > 0) {
    const a = n.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return n.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function as(e) {
  const r = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return r ? Tt()?.messages?.get?.(r) ?? null : null;
}
function ss(e) {
  const t = e.closest(`.${u}`) ?? e, r = /* @__PURE__ */ new Set();
  for (const n of Array.from(t.querySelectorAll(`[${Yt}]`))) {
    const o = n.getAttribute(Yt)?.trim();
    o && r.add(o);
  }
  return r;
}
function is(e) {
  if (!Le(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(cs).filter((r) => r !== null) : [];
}
function cs(e) {
  return Le(e) ? {
    pendingId: we(e.pendingId),
    actorId: we(e.actorId),
    itemId: we(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Ya) : []
  } : null;
}
function ls(e) {
  if (!e.itemId) return null;
  const t = Tt(), n = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return n || (t?.items?.get?.(e.itemId) ?? null);
}
function us(e) {
  let t = null, r = null;
  for (const n of Array.from(e.querySelectorAll(va))) {
    const o = re(n.textContent);
    if (!o) continue;
    const a = Ka(o, "Tipo");
    a && (r = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: r };
}
function ds(e) {
  const t = re(e.querySelector(rn)?.textContent);
  return t ? ln(t) : null;
}
function z(e, t) {
  const r = de(t);
  for (const n of e) {
    const o = n.indexOf(":");
    if (!(o < 0 || de(n.slice(0, o)) !== r))
      return re(n.slice(o + 1));
  }
  return null;
}
function ms(e) {
  const t = z(e, "Custo") ?? z(e, "PE");
  return t || (e.map(re).find((r) => typeof r == "string" && /\b(P[ED]|PE|PD)\b/iu.test(r)) ?? null);
}
function fs(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return ps(e) ?? v("op.targetChoices", t) ?? "Área";
  const r = v("op.targetChoices", t) ?? U(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, r].filter(De).join(" ");
}
function ps(e) {
  const t = S(e, "area.name"), r = S(e, "area.size"), n = S(e, "area.type"), o = t ? v("op.areaChoices", t) ?? U(t) : null, a = n ? v("op.areaTypeChoices", n) ?? U(n) : null;
  return o ? r ? a ? `${o} ${r}m ${et(a)}` : `${o} ${r}m` : o : null;
}
function gs(e) {
  const t = S(e, "skillResis"), r = S(e, "resistance");
  if (!t || !r) return null;
  const n = v("op.skill", t) ?? U(t), o = hs(r);
  return [n, o].filter(De).join(" ");
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
function Rs(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function bs(e) {
  return [
    `${u}__ritual-element-badge`,
    e ? `${u}__ritual-element-badge--${e}` : null
  ].filter(De).join(" ");
}
function wt(e) {
  const t = de(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Zt(e) {
  const t = wt(e);
  return t ? v("op.elementChoices", t) ?? U(t) : e ? U(e) : null;
}
function ks(e) {
  return wt(e);
}
function v(e, t) {
  if (!t) return null;
  const r = `${e}.${t}`, n = Tt()?.i18n?.localize?.(r);
  return !n || n === r ? null : n;
}
const Jt = "data-paranormal-toolkit-dice-toggle-enhanced";
function Ts(e) {
  for (const t of Array.from(e.querySelectorAll(on)))
    un(t);
}
function ws(e) {
  const t = mn(e.target);
  if (!t) return;
  const r = $t(t);
  r && (e.preventDefault(), dn(r, t));
}
function $s(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = mn(e.target);
  if (!t) return;
  const r = $t(t);
  r && (e.preventDefault(), dn(r, t));
}
function un(e) {
  const t = e.querySelector(kt);
  if (!t) return;
  const r = e.querySelector(sn);
  if (r && r.getAttribute(Jt) !== "true" && (r.setAttribute(Jt, "true"), r.classList.add(cn), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", "false"), r.title = "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title), t.hidden = !0, !r.querySelector("i"))) {
    const n = document.createElement("i");
    n.classList.add("fa-solid", "fa-chevron-down"), n.setAttribute("aria-hidden", "true"), r.append(n);
  }
}
function dn(e, t) {
  const r = e.querySelector(kt);
  if (!r) return;
  const n = !e.classList.contains(an);
  Cs(e, t, r, n);
}
function Cs(e, t, r, n) {
  e.classList.toggle(an, n), r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.title = n ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !n), o.classList.toggle("fa-chevron-up", n));
}
function mn(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(sn);
  if (!t) return null;
  const r = $t(t);
  return r ? (un(r), t.classList.contains(cn) ? t : null) : null;
}
function $t(e) {
  const t = e.closest(on);
  return t && t.querySelector(kt) ? t : null;
}
const er = `${c}-workflow-dice-toggle-styles`;
function _s() {
  if (document.getElementById(er)) return;
  const e = document.createElement("style");
  e.id = er, e.textContent = `
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
const Ss = [0, 100, 500, 1500, 3e3];
let tr = !1, xe = null;
function Is() {
  if (!tr) {
    tr = !0, _s(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ce(Xt(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ce(Xt(t));
    }), Hooks.once("ready", () => {
      ce(document), Ps();
    }), document.addEventListener("click", ws), document.addEventListener("keydown", $s);
    for (const e of Ss)
      globalThis.setTimeout(() => ce(document), e);
  }
}
function Ps() {
  xe || !document.body || (xe = new MutationObserver((e) => {
    for (const t of e)
      for (const r of Array.from(t.addedNodes))
        (r instanceof HTMLElement || r instanceof DocumentFragment) && ce(r);
  }), xe.observe(document.body, { childList: !0, subtree: !0 }));
}
function ce(e) {
  e && (qa(e), Qa(e), Va(e), Ts(e));
}
function Es() {
  Is();
}
const le = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, fn = {
  PV: "system.attributes.hp"
}, tt = {
  PV: [le.PV, fn.PV],
  SAN: [le.SAN],
  PE: [le.PE],
  PD: [le.PD]
}, rt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Ls {
  getResource(t, r) {
    const n = rr(t, r);
    if (!n.ok)
      return f(n.error);
    const o = n.value, a = `${o}.value`, s = `${o}.max`, i = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, s), g = or(t, r, a, i, "valor atual");
    if (g) return f(g);
    const y = or(t, r, s, d, "valor máximo");
    return y ? f(y) : h({
      value: i,
      max: d
    });
  }
  async updateResourceValue(t, r, n) {
    const o = rr(t, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: n });
  }
}
function rr(e, t) {
  const r = Ds(e.type, t);
  if (r && nr(e, r))
    return h(r);
  const n = tt[t].find(
    (o) => nr(e, o)
  );
  return n ? h(n) : f({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Ns(e, t),
    path: tt[t].join(" | ")
  });
}
function Ds(e, t) {
  return e === "threat" ? fn[t] ?? null : e === "agent" ? le[t] : null;
}
function nr(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function Ns(e, t) {
  const r = e.type ?? "unknown", n = tt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function or(e, t, r, n, o) {
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
    const { path: n, value: o } = r, a = Os(o);
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
function Os(e) {
  if (ar(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (ar(r))
      return r;
  }
  return null;
}
function ar(e) {
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
      return f({
        ...r.error,
        actor: t.actor
      });
    const n = r.value, o = Us(t.ritual, n);
    return o.ok ? o.value ? h(o.value) : h({
      resource: "PE",
      amount: Ms[n],
      source: "default-by-circle",
      circle: n
    }) : f(o.error);
  }
}
function Us(e, t) {
  const r = e.getFlag(c, "ritual.cost");
  return r == null ? { ok: !0, value: null } : xs(r) ? {
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
function xs(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Be = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Bs(e) {
  if (!Gs(e.item)) return null;
  const t = nt(e.actor) ? e.actor : js(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: qs(e.token) ?? Hs(t),
    targets: bt(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function js(e) {
  const t = e;
  return nt(t.actor) ? t.actor : nt(e.parent) ? e.parent : null;
}
function Hs(e) {
  const t = Vs(e) ?? zs(e);
  return t ? pn(t) : null;
}
function qs(e) {
  return ot(e) ? pn(e) : null;
}
function Vs(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return ot(r) ? r : (t.getActiveTokens?.() ?? []).find(ot) ?? null;
}
function zs(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function pn(e) {
  const t = e.actor ?? null;
  return {
    tokenId: je(e.id),
    actorId: je(t?.id),
    sceneId: je(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Gs(e) {
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
class Ws {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Be.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, l.info(`${Be.ITEM_USED} registrado como fonte de uso de item.`));
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
      l.warn(`${Be.ITEM_USED} disparou sem payload de item válido.`, t);
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
    if (!n) return He("missing-item-patch");
    if (t.type !== "ritual") return He("unsupported-item-type");
    const o = Qs(n);
    return Object.keys(o).length === 0 ? He("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Qs(e) {
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
    await t.unsetFlag(c, "automation");
  }
  async writeAutomationFlag(t, r) {
    await this.clear(t), await t.setFlag(c, "automation", r);
  }
}
class Js {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = ei(t);
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
    return this.list().map((r) => ti(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function ei(e) {
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
function ti(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = ri(o, t);
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
function ri(e, t) {
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
      const r = sr(t.name), n = e.names.map(sr).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = ni(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function sr(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function ni(e) {
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
    const r = Ne(e.amountFrom);
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
function Ne(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const oi = "dice-so-nice";
async function gn(e) {
  if (!Pa().enabled || !ai()) return;
  const t = si();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      l.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function ai() {
  return game.modules.get(oi)?.active === !0;
}
function si() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function ii(e, t, r) {
  if (!ir(e.id) || !ir(e.formula))
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
    await gn(o);
    const i = {
      ...r.rollRequests[e.id] ?? hn(e, t),
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
function hn(e, t) {
  const r = e.intent ?? ci(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function ci(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function ir(e) {
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
function li(e) {
  const { step: t, context: r, transaction: n, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = di(t, r, n, o);
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
    const s = mi(t, r, n, o);
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
function di(e, t, r, n) {
  const o = Ne(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: yn(t.id, "damage", n, t.damageInstances.length),
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
function mi(e, t, r, n) {
  const o = Ne(e.amountFrom);
  return {
    id: yn(t.id, "healing", n, t.healingInstances.length),
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
function yn(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function fi(e, t, r) {
  const n = Ne(e.amountFrom), o = n ? t.rolls[n] : void 0;
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
function pi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", r, { stepIndex: n, step: t, metadata: o }), An("before", e), cr("before", e), cr("resolve", e);
}
function gi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("apply", r, { stepIndex: n, step: t, metadata: o }), An("apply", e);
}
function hi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", r, { stepIndex: n, step: t, metadata: o });
}
function An(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t, i = yi(e, r.operation);
  i && s.emit(i, n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function cr(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function yi(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Ai(e, t, r) {
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
async function Ri(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return bi(e, t);
    case "spendRitualCost":
      return ki(e, t);
  }
}
async function bi(e, t) {
  const { context: r, resources: n } = e, o = $e(t, r);
  return o.ok ? Rn(await n.spend(r.sourceActor, t.resource, o.value), r) : f(o.error);
}
async function ki(e, t) {
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
  }), Rn(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function Rn(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), h(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), f({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Ti(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: o, execute: a } = e, s = wi(t);
  for (const d of s.before)
    o.emit(d, r, { stepIndex: n, step: t });
  const i = await a();
  if (!i.ok)
    return i;
  for (const d of s.after)
    o.emit(d, r, { stepIndex: n, step: t });
  return i;
}
function wi(e) {
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
class $i {
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
        return Ti({
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
    const o = await Ri({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? h(void 0) : f({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const o = hn(t, n);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, n, t);
    const a = await this.runRollFormulaStep(t, r, n);
    if (!a.ok)
      return a;
    const s = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, n, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: o, rollResult: s }), h(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const o = await ii(t, n, r);
    return o.ok ? h(void 0) : f({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const o = $e(t, r);
    if (!o.ok)
      return f({ ...o.error, stepIndex: n, step: t, context: r });
    const a = fi(t, r, o.value);
    pi({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), gi({
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
      li({
        step: t,
        context: r,
        transaction: g.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return hi({
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
    const o = await Ai(this.messages, t, r);
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
    const i = Ci(t, r.intent);
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
function Ci(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class _i {
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
function bn(e) {
  return {
    id: Si(),
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
function Si() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ii {
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
    const n = bn(r);
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
class Pi {
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
class Ei {
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
      whisper: Li(),
      flags: {
        ...t.flags,
        [c]: {
          ...Di(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && l.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = Ze();
    if (!n.enabled)
      return;
    const o = r.notification ?? lr(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, o);
  }
  emitConsole(t, r) {
    const n = lr(r);
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
function lr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function Li() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Di(e) {
  const t = e?.[c];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const Ni = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", kn = `${c}-inline-roll-neutralized`, vi = `${c}-inline-roll-notice`, Ct = `data-${c}-inline-roll-neutralized`, ur = `data-${c}-inline-roll-notice`, Oi = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function dr(e) {
  const t = Yi(e.message), r = await Mi(e.message), n = Fi(t);
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
async function Mi(e) {
  const t = Gi(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = Ui(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await Wi(t, r.content), replacementCount: r.replacementCount };
}
function Fi(e) {
  const t = e ? Ki(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = Tn(t);
  return r > 0 && wn(qi(t)), { replacementCount: r };
}
function Ui(e) {
  const t = xi(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = Tn(r.content), o = t.replacementCount + n;
  return o === 0 ? { content: e, replacementCount: 0 } : (wn(r.content), { content: r.innerHTML, replacementCount: o });
}
function xi(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, o) => (t += 1, ji(o.trim()))), replacementCount: t };
}
function Tn(e) {
  const t = Bi(e);
  for (const r of t)
    r.replaceWith(Hi(Vi(r)));
  return t.length;
}
function Bi(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(Ni))
    r.getAttribute(Ct) !== "true" && t.add(r);
  return Array.from(t);
}
function ji(e) {
  return `<span class="${kn}" ${Ct}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Qi(e)}</span>`;
}
function Hi(e) {
  const t = document.createElement("span");
  return t.classList.add(kn), t.setAttribute(Ct, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function wn(e) {
  if (e.querySelector?.(`[${ur}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(vi), t.setAttribute(ur, "true"), t.textContent = Oi, e.append(t);
}
function qi(e) {
  return e.querySelector(".message-content") ?? e;
}
function Vi(e) {
  const r = e.getAttribute("data-formula") ?? zi(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function zi(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Gi(e) {
  return e && typeof e == "object" ? e : null;
}
async function Wi(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return l.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function Ki(e) {
  const t = Xi(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Yi(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Qi(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Xi(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const mr = "occultism";
function Zi(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Ji(e) {
  const t = Zi(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await ec(e, mr);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await gn(r);
  const n = nc(r);
  return {
    skill: mr,
    skillLabel: "Ocultismo",
    roll: r,
    formula: rc(r),
    total: n,
    difficulty: t,
    success: n >= t,
    diceBreakdown: oc(r)
  };
}
async function ec(e, t) {
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
  return tc(n);
}
function tc(e) {
  return fr(e) ? e : Array.isArray(e) ? e.find(fr) ?? null : null;
}
function fr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function rc(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function nc(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function oc(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(ac);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function ac(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function sc(e) {
  return {
    header: {
      eyebrow: pt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: dc(e.ritual)
    },
    forms: e.variantOptions.map((t) => ic(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: uc(e.automationStatus ?? "assisted")
  };
}
function ic(e, t) {
  const r = cc(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? lc(t) : "—",
    details: r
  };
}
function cc(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function lc(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function uc(e) {
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
function dc(e) {
  const t = e.system, r = [fc(t?.element), mc(t?.circle)].filter(pc);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function mc(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function fc(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function pc(e) {
  return typeof e == "string" && e.length > 0;
}
const $n = ["base", "discente", "verdadeiro"];
function Cn(e) {
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
  return typeof e == "string" && $n.includes(e);
}
const { ApplicationV2: gc } = foundry.applications.api;
class ue extends gc {
  constructor(t, r) {
    super({
      id: `${c}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = r, this.model = sc(t), this.selectedVariant = this.model.forms.find((n) => n.checked && n.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: ue.onCast,
      cancel: ue.onCancel
    }
  };
  static async request(t) {
    return new Promise((r) => {
      new ue(t, r).render({ force: !0 });
    });
  }
  async _renderHTML(t, r) {
    const n = document.createElement("div");
    return n.className = "paranormal-toolkit-ritual-cast", n.innerHTML = this.renderContent(), n;
  }
  _replaceHTML(t, r, n) {
    r.replaceChildren(t);
    const o = r.querySelector(".paranormal-toolkit-ritual-cast") ?? r;
    yc(o, (a) => {
      this.selectedVariant = a;
    }), Ac(o, (a) => {
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
          ${this.model.forms.map(hc).join("")}
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
    const r = kc(t), n = Rc(r, this.spendResource, this.selectedVariant);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function hc(e) {
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
function yc(e, t) {
  const r = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of r)
    o.addEventListener("click", () => pr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), pr(e, o, t));
    });
  const n = _n(e);
  n && t(n);
}
function pr(e, t, r) {
  const n = t.querySelector('input[name="variant"]');
  !n || n.disabled || !_e(n.value) || (n.checked = !0, e.dataset.paranormalToolkitSelectedVariant = n.value, r(n.value), n.dispatchEvent(new Event("change", { bubbles: !0 })), _n(e));
}
function _n(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let r = null;
  for (const n of t) {
    const o = n.querySelector('input[name="variant"]'), a = o?.checked === !0;
    n.setAttribute("aria-checked", a ? "true" : "false"), a && _e(o.value) && (r = o.value);
  }
  return r && (e.dataset.paranormalToolkitSelectedVariant = r), r;
}
function Ac(e, t) {
  const r = e.querySelector('input[name="spendResource"]');
  r && (t(r.checked), r.addEventListener("change", () => {
    t(r.checked);
  }));
}
function Rc(e, t, r) {
  const n = bc(e) ?? r, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: n,
    spendResource: o
  };
}
function bc(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (_e(t)) return t;
  const r = e?.dataset.paranormalToolkitSelectedVariant;
  return _e(r) ? r : null;
}
function kc(e) {
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
async function Tc(e) {
  return ue.request(e);
}
const _t = {
  label: "Padrão"
}, wc = {
  label: "Discente",
  extraCost: 2
}, $c = {
  label: "Verdadeiro",
  extraCost: 5
};
class Cc {
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
    const n = this.resolveCostPreview(t), o = rl(r), a = Jc(r, t.item, n, o), s = await Tc({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((P) => P.name),
      cost: n,
      defaultSpendResource: cl(r),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const i = _c(s), d = ol(r, t.item, i.variant, o), g = Xr();
    let y = null;
    if (g) {
      const P = await Ic(this.resources, t.actor, i, d, n);
      if (!P.ok)
        return {
          status: "failed",
          reason: P.reason,
          message: P.message
        };
      try {
        y = await Ji(t.actor);
      } catch (K) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: K instanceof Error ? K.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: K
        };
      }
    }
    const R = Sc(r, i, d, n, {
      includeCostSteps: !g
    });
    if (R.steps.length === 0) {
      const P = nl(t, i), K = gr(t.actor, y, d, n), Mt = yr(r, i, d, n, P, y);
      return K.length > 0 ? {
        status: "ready",
        workflowContext: P,
        actions: K,
        summaryLines: Mt
      } : {
        status: "completed-without-actions",
        workflowContext: P,
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
    const k = b.value.context, m = Ec(r, t, k), he = gr(t.actor, y, d, n), W = yr(r, i, d, n, k, y);
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
function _c(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function Sc(e, t, r, n, o) {
  const a = [], s = t.spendResource === !0;
  for (const i of e.steps)
    i.type === "modifyResource" || i.type === "chatCard" || St(i) && (!o.includeCostSteps || !s) || a.push(Pc(i, r));
  return o.includeCostSteps && s && n && ll(r.extraCost) && a.push({
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
async function Ic(e, t, r, n, o) {
  if (r.spendResource !== !0) return { ok: !0 };
  const a = ne(o, n);
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
function Pc(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function gr(e, t, r, n) {
  if (!t || t.success) return [];
  const o = ne(n, r);
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
function Ec(e, t, r) {
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
    const s = xc(o.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(...Lc(e, o, i, a.value));
  }
  return { ok: !0, actions: n };
}
function Lc(e, t, r, n) {
  if (!Oc(e, t))
    return [hr(t, r, n)];
  const o = Uc();
  return Sn(e).map((a) => {
    const s = Mc(n, a);
    return hr(t, r, s, {
      option: a,
      choiceGroupId: o
    });
  });
}
function hr(e, t, r, n) {
  const o = t.name ?? "Ator sem nome", a = vc(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: Dc(e, o, r, n?.option),
    executedLabel: Nc(e, o, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function Dc(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function Nc(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function vc(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Oc(e, t) {
  return t.operation === "damage" && t.resource === "PV" && Sn(e).length > 1;
}
function Sn(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Mc(e, t) {
  const r = e * t.multiplier, n = Fc(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function Fc(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Uc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function xc(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function yr(e, t, r, n, o, a = null) {
  return [
    `Forma: ${Cn(t.variant)}`,
    Hc(t, r, n),
    ...jc(a),
    ...Bc(a, r, n),
    ...Object.values(o.rolls).flatMap(qc),
    ...Vc(e.resistance),
    ...Xc(r)
  ];
}
function Bc(e, t, r) {
  if (!e || e.success) return [];
  const n = ne(r, t);
  return !n || n.amount <= 0 ? ["Falha de conjuração: dano na SAN não resolvido."] : [`Falha de conjuração: aplicar ${n.amount} SAN no conjurador.`];
}
function jc(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Hc(e, t, r) {
  const n = ne(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function qc(e) {
  const r = [`${Zc(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = zc(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${Qc(e.damageType)}`), r;
}
function Vc(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function zc(e) {
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
    const s = Gc(a);
    s && (Yc(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function Gc(e) {
  const t = Wc(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Kc(e);
}
function Wc(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function Kc(e) {
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
function Yc(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function Qc(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Xc(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Zc(e) {
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
function Jc(e, t, r, n) {
  return $n.map((o) => {
    const a = In(e, t, o, n), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? Cn(o),
      enabled: s,
      details: a ? el(a, r, n) : [],
      finalCostText: a ? tl(r, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function el(e, t, r) {
  const n = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? n.push(o.join(", ")) : r && n.push("efeito manual");
  const a = ne(t, e);
  return n.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), n;
}
function ne(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function tl(e, t) {
  const r = ne(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function rl(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(St);
}
function nl(e, t) {
  return bn({
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
function ol(e, t, r, n) {
  return In(e, t, r, n) ?? _t;
}
function In(e, t, r, n) {
  const o = e.ritualForms?.[r] ?? null;
  return o || (n ? sl(t, r) ? al(r) : null : r === "base" ? _t : null);
}
function al(e) {
  switch (e) {
    case "base":
      return _t;
    case "discente":
      return wc;
    case "verdadeiro":
      return $c;
  }
}
function sl(e, t) {
  if (t === "base") return !0;
  const r = t === "discente" ? "system.studentForm" : "system.trueForm";
  return il(foundry.utils.getProperty(e, r));
}
function il(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function cl(e) {
  return e.steps.some(St);
}
function St(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function ll(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function ul(e, t) {
  const r = await dl(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: fl(r),
    total: pl(r),
    diceBreakdown: gl(r)
  };
}
function Pn(e) {
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
async function dl(e, t) {
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
  return ml(n);
}
function ml(e) {
  return Ar(e) ? e : Array.isArray(e) ? e.find(Ar) ?? null : null;
}
function Ar(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function fl(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function pl(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function gl(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(hl);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function hl(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const En = "itemUsePrompts", Ln = "chatCard", ve = "data-paranormal-toolkit-prompt-id", Oe = "data-paranormal-toolkit-pending-id", It = "data-paranormal-toolkit-executed-label", at = "data-paranormal-toolkit-choice-group", Dn = "data-paranormal-toolkit-skipped-label", Rr = "data-paranormal-toolkit-action-section", br = "data-paranormal-toolkit-detail-key", kr = "data-paranormal-toolkit-roll-card", Pt = "data-paranormal-toolkit-roll-detail-toggle", Nn = "data-paranormal-toolkit-roll-detail-id", vn = "data-paranormal-toolkit-resistance-roll-button", On = "data-paranormal-toolkit-resistance-skill", Mn = "data-paranormal-toolkit-resistance-skill-label", Fn = "data-paranormal-toolkit-resistance-target-actor-id", Un = "data-paranormal-toolkit-resistance-target-name", xn = "data-paranormal-toolkit-resistance-roll-result", Tr = "data-paranormal-toolkit-system-card-replaced", yl = `[${Oe}]`, Al = `[${Pt}]`, Rl = `[${vn}]`, st = `${c}-chat-enrichment`, p = `${c}-item-use-prompt`, bl = `${p}__actions`, wr = `${p}__details`, Bn = `${p}__summary`, kl = `${p}__title`, jn = `${p}__button--executed`, $r = `${p}__roll-card`;
let Cr = !1, it = null;
const I = /* @__PURE__ */ new Map(), Tl = [0, 100, 500, 1500, 3e3], wl = 3e4, $l = [0, 100, 500, 1500, 3e3];
function Cl(e) {
  if (it = e, Cr) {
    Sr(e);
    return;
  }
  const t = (r, n) => {
    qn(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Cr = !0, Sr(e);
}
async function _r(e) {
  const t = Hn(e);
  I.set(e.pendingId, t), await Dt(t) || Jn(t), Vn(e.pendingId);
}
async function _l(e) {
  const t = Hn({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", I.set(e.pendingId, t), await Dt(t) || Jn(t), Vn(e.pendingId);
}
async function ze(e, t) {
  const r = I.get(e);
  I.delete(e), r && await Cu(r, t);
}
function Et(e) {
  const t = ao();
  for (const r of t) {
    const n = M(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function Sl(e, t) {
  const r = Et(e);
  if (!r) return;
  const n = M(r.message), o = n[e];
  o && (n[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await oe(r.message, n));
}
async function Il(e, t, r) {
  if (!t) return;
  const n = Et(e);
  if (!n) return;
  const o = M(n.message);
  let a = !1;
  for (const [s, i] of Object.entries(o))
    s !== e && i.choiceGroupId === t && (o[s] = {
      ...i,
      executedLabel: r ?? i.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await oe(n.message, o);
}
function Hn(e) {
  const t = x(e.context.message), r = e.context.targets.find((s) => dt(s)), n = r ? dt(r) : null, o = e.resistanceTargetActor ?? n, a = e.resistanceTargetName ?? r?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: eu(e.context),
    executed: !1
  };
}
function qn(e, t, r) {
  $u();
  const n = Fe(t);
  if (!n) return;
  const o = ku(e, n);
  o.length > 0 && Se(n);
  for (const a of o)
    ct(n, a);
  Wn(n, r), lt(n), ut(n);
}
function Sr(e) {
  for (const t of $l)
    globalThis.setTimeout(() => {
      Pl(e);
    }, t);
}
function Pl(e) {
  for (const t of El()) {
    const r = Me(t);
    Ll(r) && qn(r, t, e);
  }
}
function El() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function Ll(e) {
  return e ? Nt(e) ? !0 : Su(e).length > 0 : !1;
}
function Vn(e) {
  const t = I.get(e);
  if (!t) return;
  const r = t.messageId ? Tu(t.messageId) : null;
  if (r) {
    Dr(r, t), Se(r), ct(r, t), Ir(r), lt(r), ut(r);
    return;
  }
  if (t.messageId) {
    ft(t);
    return;
  }
  const n = wu(t);
  if (n) {
    Dr(n, t), Se(n), ct(n, t), Ir(n), lt(n), ut(n);
    return;
  }
  ft(t);
}
function Ir(e) {
  it && Wn(e, it);
}
function Se(e) {
  const t = Dl();
  e.classList.toggle(`${p}--system-card-replaced`, t);
  const r = Gn(e);
  if (!r || (r.classList.toggle(`${p}__host--system-card-replaced`, t), !t) || r.getAttribute(Tr) === "true") return;
  const n = r.querySelector(`.${st}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(Tr, "true");
}
function Dl() {
  try {
    return sa() === "replace";
  } catch {
    return !1;
  }
}
function ct(e, t) {
  if (Se(e), e.querySelector(`[${ve}="${ae(t.pendingId)}"]`)) return;
  const r = Nl(e, t);
  Ol(r, t), Yl(r, Ql(t)).append(Jl(t));
}
function Nl(e, t) {
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
  s.classList.add(kl), s.textContent = vl(t);
  const i = document.createElement("span");
  return i.classList.add(Bn), i.textContent = t.summary, o.append(a, s, i), n.append(o), ru(e).append(n), n;
}
function vl(e) {
  const t = $(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function Ol(e, t) {
  const r = t.summaryLines ?? [], n = Xn(r, t);
  if (n) {
    Ml(e, n, t);
    return;
  }
  Xl(e, r);
}
function Ml(e, t, r) {
  if (e.querySelector(`[${kr}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add($r, `${$r}--${t.intent}`), n.setAttribute(kr, "true"), t.castingCheck && Pr(n, Ul(t.castingCheck), r.pendingId, "casting"), Fl(t) && Pr(n, xl(t), r.pendingId, "effect"), Vl(n, t), zl(n, t, r), Kl(n, t), e.append(n);
}
function Fl(e) {
  return e.intent !== "casting";
}
function Ul(e) {
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
function xl(e) {
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
function Pr(e, t, r, n) {
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
  Bl(o, t), Wl(o, t.detailRows, r, n, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Bl(e, t) {
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-roll`);
  const n = document.createElement("span");
  n.classList.add(`${p}__workflow-roll-formula`), n.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${p}__workflow-roll-total`), o.textContent = String(t.total), r.append(n, o);
  const a = jl(t.formula, t.diceBreakdown);
  a && r.append(a), e.append(r);
}
function jl(e, t) {
  const r = Hl(t);
  if (r.length === 0) return null;
  const n = document.createElement("div");
  n.classList.add(`${p}__workflow-dice-tray`);
  for (const o of ql(r, e)) {
    const a = document.createElement("span");
    a.classList.add(`${p}__workflow-die`), o.active || a.classList.add(`${p}__workflow-die--inactive`), a.textContent = String(o.value), n.append(a);
  }
  return n;
}
function Hl(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((n) => Number(n.trim())).filter((n) => Number.isFinite(n)).map((n) => Math.trunc(n)) : [];
}
function ql(e, t) {
  if (e.length <= 1) return e.map((n) => ({ value: n, active: !0 }));
  const r = t.toLowerCase();
  return r.includes("kh") ? Er(e, "highest") : r.includes("kl") ? Er(e, "lowest") : e.map((n) => ({ value: n, active: !0 }));
}
function Er(e, t) {
  const r = t === "highest" ? Math.max(...e) : Math.min(...e);
  let n = !1;
  return e.map((o) => {
    const a = !n && o === r;
    return a && (n = !0), { value: o, active: a };
  });
}
function Vl(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(zu);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__roll-meta`);
  for (const o of r) {
    const a = document.createElement("span");
    a.classList.add(`${p}__roll-meta-pill`), a.textContent = o, n.append(a);
  }
  e.append(n);
}
function zl(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${p}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = Gl(t, r);
  o.append(a), s && o.append(s);
  const i = document.createElement("span");
  i.classList.add(`${p}__resistance-description`), i.textContent = t.resistance, n.append(o, i), t.resistanceRollResult && n.append(zn(t.resistanceRollResult)), e.append(n);
}
function Gl(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${p}__resistance-roll-button`), r.setAttribute(ve, t.pendingId), r.setAttribute(vn, "true"), r.setAttribute(On, e.resistanceSkill), r.setAttribute(Mn, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(Fn, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(Un, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${p}__resistance-roll-button--rolled`), r.setAttribute(xn, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${p}__resistance-roll-fallback`), o.textContent = "d20", r.append(n, o), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function zn(e) {
  const t = document.createElement("span");
  return t.classList.add(`${p}__resistance-roll-result`), t.textContent = Yn(e), t;
}
function Wl(e, t, r, n, o) {
  const a = t.filter((g) => g.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${r}-roll-details-${n}`, i = document.createElement("button");
  i.type = "button", i.classList.add(`${p}__roll-detail-toggle`), i.setAttribute(Pt, s), i.setAttribute("aria-expanded", "false"), i.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${p}__roll-detail-list`), d.setAttribute(Nn, s), d.hidden = !0;
  for (const g of a) {
    const y = document.createElement("dt");
    y.textContent = g.label;
    const R = document.createElement("dd");
    R.textContent = g.value, d.append(y, R);
  }
  e.append(i, d);
}
function Kl(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-notes`);
  for (const n of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = n, r.append(o);
  }
  e.append(r);
}
function Yl(e, t) {
  const r = `[${Rr}="${ae(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const o = document.createElement("div");
  o.classList.add(bl), o.setAttribute(Rr, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${p}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function Ql(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = Xn(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Xl(e, t) {
  if (t.length === 0) return;
  const r = Zl(e);
  for (const n of t) {
    const o = Gu(n);
    if (r.querySelector(`[${br}="${ae(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = n, a.setAttribute(br, o), r.append(a);
  }
}
function Zl(e) {
  const t = e.querySelector(`.${wr}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(wr), e.append(r), r;
}
function Jl(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${p}__button`), t.setAttribute(ve, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(jn), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Oe, e.pendingId), t.setAttribute(It, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(at, e.choiceGroupId), t.setAttribute(Dn, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function eu(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = tu(e);
  return `${t} → ${r}`;
}
function tu(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function ru(e) {
  return Gn(e) ?? e;
}
function Gn(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Wn(e, t) {
  const r = Fe(e);
  if (!r) return;
  const n = r.querySelectorAll(yl);
  for (const o of n)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      hu(o, t);
    }));
}
function lt(e) {
  const t = Fe(e);
  if (!t) return;
  const r = t.querySelectorAll(Al);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      nu(t, n);
    }));
}
function ut(e) {
  const t = Fe(e);
  if (!t) return;
  const r = t.querySelectorAll(Rl);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      ou(t, n);
    }));
}
function nu(e, t) {
  const r = t.getAttribute(Pt);
  if (!r) return;
  const n = e.querySelector(`[${Nn}="${ae(r)}"]`);
  if (!n) return;
  const o = n.hidden;
  n.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function ou(e, t) {
  const r = t.getAttribute(ve), n = t.getAttribute(On), o = t.getAttribute(Mn) ?? (n ? Pn(n) : "Resistência");
  if (!r || !n) return;
  const a = iu(e, r), s = cu(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await ul(s, n);
    await fu(d.roll);
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
    au(t, g), su(t, g), pu(r, g), await gu(e, r, g);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function au(e, t) {
  e.classList.add(`${p}__resistance-roll-button--rolled`), e.setAttribute(xn, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function su(e, t) {
  const r = e.closest(`.${p}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${p}__resistance-roll-result`), o = n ?? zn(t);
  if (n) {
    n.textContent = Yn(t);
    return;
  }
  r.append(o);
}
function iu(e, t) {
  const r = I.get(t);
  if (r) return r;
  const n = Me(e);
  return M(n)[t] ?? null;
}
function cu(e, t) {
  const r = e?.resistanceTargetActor;
  if (N(r)) return r;
  const o = e?.context?.targets.map(dt).find(N) ?? null;
  if (o) return o;
  const a = t.getAttribute(Fn) ?? e?.resistanceTargetActorId ?? null, s = a ? uu(a) : null;
  return s || du(
    t.getAttribute(Un) ?? e?.resistanceTargetName ?? lu(t)
  );
}
function lu(e) {
  const r = e.closest(`.${p}`)?.querySelector(`.${Bn}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const o = r.split(n), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function dt(e) {
  const t = e.actor;
  if (N(t)) return t;
  const r = e.token, n = me(r);
  if (n) return n;
  const o = e.document;
  return me(o);
}
function me(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (N(t)) return t;
  const r = e.document?.actor;
  return N(r) ? r : null;
}
function uu(e) {
  const r = game.actors?.get?.(e);
  return N(r) ? r : Kn().map((a) => me(a)).find((a) => a?.id === e) ?? null;
}
function du(e) {
  const t = J(e);
  if (!t) return null;
  const r = Kn().filter((a) => J(mu(a)) === t).map((a) => me(a)).find(N) ?? null;
  if (r) return r;
  const o = game.actors?.find?.((a) => N(a) && J(a.name) === t);
  return N(o) ? o : null;
}
function Kn() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function mu(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : me(e)?.name ?? null;
}
function J(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function N(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Yn(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function fu(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function pu(e, t) {
  const r = I.get(e);
  r && (r.resistanceRollResult = t);
}
async function gu(e, t, r) {
  const n = Me(e);
  if (n)
    try {
      const o = M(n), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: r
      }, await oe(n, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Me(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return O(n?.get?.(r));
}
async function hu(e, t) {
  const r = e.getAttribute(Oe);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    Qn(e, e.getAttribute(It) ?? "✓ Automação aplicada"), yu(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function Qn(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(jn), e.removeAttribute(Oe), e.removeAttribute(It);
}
function yu(e) {
  const t = e.getAttribute(at);
  if (!t) return;
  const r = e.closest(`.${p}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${at}="${ae(t)}"]`;
  for (const o of r.querySelectorAll(n)) {
    if (o === e) continue;
    const a = o.getAttribute(Dn) ?? "✓ Outra opção escolhida";
    Qn(o, a);
  }
}
function Xn(e, t) {
  const r = e.map(Lt).filter(qu), n = r.find((m) => m.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const o = $(e, "Forma"), a = $(e, "Custo"), s = $(e, "Dados") ?? $(e, `Dados (${n.label})`), i = $(e, "Tipo"), d = $(e, "Resistência"), g = $(e, "Resistência Perícia"), y = $(e, "Resistência Rótulo") ?? (g ? Pn(g) : null), R = Zn(e, "Observação"), b = e.filter((m) => bu(m, n)), k = Au(e);
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
function Au(e) {
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
    intent: Ru(r)
  } : null;
}
function Ru(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function $(e, t) {
  return Zn(e, t)[0] ?? null;
}
function Zn(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const o = n.slice(r.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function bu(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Lt(e) ? !1 : e.trim().length > 0;
}
function ku(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of I.values())
    mt(n, e, t) && r.set(n.pendingId, n);
  for (const n of _u(e))
    mt(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, o) => n.createdAt - o.createdAt);
}
function mt(e, t, r) {
  const n = x(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !Lr(r, "itemId", e.itemId) ? !1 : !e.actorId || Lr(r, "actorId", e.actorId);
}
function Lr(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${Wu(t)}`;
  for (const o of e.querySelectorAll(`[${n}]`))
    if (o.getAttribute(n) === r)
      return !0;
  return !1;
}
function Tu(e) {
  const t = ae(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function wu(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (mt(e, null, t))
      return t;
  return null;
}
function $u() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of I.entries())
    e - n.createdAt > t && I.delete(r);
}
async function Dr(e, t) {
  const r = Me(e);
  if (!r) return !1;
  try {
    const n = M(r);
    return n[t.pendingId] = vt(t, x(r)), await oe(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function Dt(e) {
  const t = ro(e);
  if (!t) return !1;
  try {
    const r = M(t);
    return r[e.pendingId] = vt(e, x(t)), await oe(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function Jn(e) {
  for (const t of Tl)
    globalThis.setTimeout(() => {
      ft(e);
    }, t);
}
async function ft(e) {
  const t = ro(e);
  if (Nt(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const n = await Dt(e);
  return n || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), n;
}
async function Cu(e, t) {
  const r = to(e.context.message);
  if (r)
    try {
      const n = M(r), o = n[e.pendingId] ?? vt(e, x(r));
      n[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await oe(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function _u(e) {
  return Object.values(M(O(e))).filter(ge);
}
function M(e) {
  if (!e) return {};
  const t = {}, r = Nt(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, o] of Object.entries(eo(e)))
    t[n] ??= o;
  return t;
}
function Su(e) {
  return Object.values(eo(O(e))).filter(ge);
}
function eo(e) {
  if (!e) return {};
  const t = e.getFlag?.(c, En);
  if (!ee(t))
    return {};
  const r = {};
  for (const [n, o] of Object.entries(t))
    ge(o) && (r[n] = o);
  return r;
}
async function oe(e, t) {
  typeof e.setFlag == "function" && (await Pu(e, t), await Iu(e, t));
}
async function Iu(e, t) {
  await Promise.resolve(e.setFlag?.(c, En, t));
}
function Nt(e) {
  if (!e) return null;
  const t = e.getFlag?.(c, Ln);
  return ju(t) ? t : null;
}
async function Pu(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(ge).sort((a, s) => a.createdAt - s.createdAt);
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
      actorName: Eu(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(c, Ln, o));
}
function Eu(e) {
  if (!e.includes("→")) return e.trim() || null;
  const r = e.split("→")[0]?.trim();
  return r && r.length > 0 ? r : null;
}
function vt(e, t) {
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
function to(e) {
  const t = O(e);
  if (t?.setFlag)
    return t;
  const r = Lu(e);
  if (r?.setFlag)
    return r;
  const n = x(e);
  if (!n) return null;
  const o = game.messages;
  return O(o?.get?.(n));
}
function Lu(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(O).find((r) => typeof r?.setFlag == "function") ?? null;
}
function ro(e) {
  const t = to(e.context.message);
  if (t) return t;
  const r = e.messageId ? Du(e.messageId) : null;
  if (r) return r;
  const n = ao().slice().reverse();
  return n.find((o) => Nu(o, e)) ?? n.find((o) => vu(o, e)) ?? null;
}
function Du(e) {
  const t = game.messages;
  return O(t?.get?.(e));
}
function Nu(e, t) {
  const r = x(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!no(e, t)) return !1;
  const o = oo(e);
  return !t.actorId || !o || o === t.actorId;
}
function vu(e, t) {
  if (!Mu(e, t)) return !1;
  const r = oo(e);
  return t.actorId && r === t.actorId ? !0 : no(e, t);
}
function no(e, t) {
  const r = J(Ou(e));
  if (!r) return !1;
  const n = J(t.itemName);
  if (n && r.includes(n)) return !0;
  const o = J(t.itemId);
  return !!(o && r.includes(o));
}
function Ou(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function oo(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Mu(e, t) {
  const r = Fu(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= wl;
}
function Fu(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function O(e) {
  return e && typeof e == "object" ? e : null;
}
function ge(e) {
  return ee(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && C(e.messageId) && C(e.itemId) && C(e.actorId) && C(e.itemName) && V(e.resistanceTargetActorId) && V(e.resistanceTargetName) && Hu(e.resistanceRollResult) && Uu(e.actionPayload) && Ge(e.title) && Ge(e.buttonLabel) && Ge(e.executedLabel) && V(e.choiceGroupId) && V(e.skippedLabel) && V(e.actionSectionId) && V(e.actionSectionTitle) && Vu(e.summaryLines) : !1;
}
function Uu(e) {
  return e == null ? !0 : ee(e) ? e.kind === "resource-operation" && C(e.actorId) && C(e.actorUuid) && typeof e.actorName == "string" && xu(e.resource) && Bu(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function xu(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Bu(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function ju(e) {
  return ee(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && C(e.messageId) && ee(e.source) && C(e.source.actorId) && C(e.source.actorName) && C(e.source.itemId) && C(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ge) : !1;
}
function Hu(e) {
  return e == null ? !0 : ee(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && V(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function qu(e) {
  return e !== null;
}
function ee(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function C(e) {
  return e === null || typeof e == "string";
}
function Ge(e) {
  return e === void 0 || typeof e == "string";
}
function V(e) {
  return e == null || typeof e == "string";
}
function Vu(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function zu(e) {
  return typeof e == "string" && e.length > 0;
}
function ao() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(O).filter((n) => n !== null);
  const r = e.values;
  return typeof r == "function" ? Array.from(r.call(e)).map(O).filter((n) => n !== null) : [];
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
function x(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function Gu(e) {
  return e.trim().toLowerCase();
}
function Wu(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ae(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Nr = 1e3;
class Ku {
  constructor(t, r, n, o) {
    this.workflow = t, this.resources = r, this.debugOutput = o, this.ritualAssistant = new Cc(t, r, n);
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
      if (n.error.reason === "missing-automation" && Yu(t.item) && r.executionMode === "ask") {
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
    if (await dr(t), !t.actor) {
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
      return this.pendingExecutions.delete(t), await ze(t), await this.executeAutomation(r.context, r.definition, r.mode), !0;
    const n = await this.ritualAssistant.applyAction(r.action);
    return n.ok ? (r.workflowContext.resourceTransactions.push(n.value), this.pendingExecutions.delete(t), await ze(t), await this.resolveAlternativeResourceActions(r), this.setAttempt(r.context, "completed"), !0) : (this.handleResourceActionFailure(n), !1);
  }
  async executePersistedPendingAutomation(t) {
    const r = Et(t);
    if (!r?.prompt.actionPayload)
      return ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada."), !1;
    const n = r.prompt.actionPayload, o = Zu(n);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const a = await Ce(this.resources, o, n.resource, n.operation, n.amount);
    return a.ok ? (await Sl(t), await Il(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Cl((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await dr(t), !t.actor) {
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
    this.markExecution(t), await this.handleAssistedRitual(t, Qu(t.item));
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
      a.kind === "resource-action" && (this.pendingExecutions.delete(o), await ze(
        o,
        a.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, r) {
    const n = Ye();
    await _l({
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
      }), await _r({
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
        actionPayload: Xu(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), l.info("Ritual assistido preparado com ações pendentes.", G(r));
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
    }), await _r({
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
    const r = Date.now(), n = vr(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      r - s > Nr && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(n);
    return o !== void 0 && r - o <= Nr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(vr(t), Date.now());
  }
  setAttempt(t, r, n, o) {
    this.lastAttempt = Ke(t, r, n, o);
  }
}
function Yu(e) {
  return e.type === "ritual";
}
function Qu(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Xu(e) {
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
function Zu(e) {
  const t = e.actorUuid ? Ju(e.actorUuid) : null;
  if (te(t)) return t;
  const r = e.actorId ? ed(e.actorId) : null;
  return r || td(e.actorName);
}
function Ju(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function ed(e) {
  const r = game.actors?.get?.(e);
  if (te(r)) return r;
  for (const n of so()) {
    const o = Ot(n);
    if (o?.id === e) return o;
  }
  return null;
}
function td(e) {
  const t = We(e);
  if (!t) return null;
  for (const o of so()) {
    const a = rd(o);
    if (We(a) === t) {
      const s = Ot(o);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((o) => te(o) && We(o.name) === t);
  return te(n) ? n : null;
}
function so() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function rd(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : Ot(e)?.name ?? null;
}
function Ot(e) {
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
function vr(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function Ye() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class nd {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], o = [], a = pe(t);
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
class od {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = pe(t).map((i) => this.analyzeRitual(i)), n = r.filter(Te("upToDate")), o = r.filter(Te("available")), a = r.filter(Te("outdated")), s = r.filter(Te("unsupported"));
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
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = ad(t);
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
      reason: sd(n, r.preset)
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
    preset: e.match ? Ee(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function ad(e) {
  const t = e.getFlag(c, "automation");
  return ht(t) ? t : null;
}
function sd(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Te(e) {
  return (t) => t.status === e;
}
class id {
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
    const r = A(t.actorName), n = A(t.resource), o = A(Or(t)), a = A(ld(t));
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
      (m) => `<li><strong>${A(m.id)}:</strong> ${A(m.formula)} = ${m.total} <em>(${A(cd(m.intent))})</em>${m.damageType ? ` — ${A(m.damageType)}` : ""}</li>`
    ), g = t.ritualCosts.map(
      (m) => `<li><strong>${A(m.itemName)}:</strong> ${m.circle}º círculo — ${m.amount} ${A(m.resource)} (${A(ud(m.source))})</li>`
    ), y = t.damageInstances.map(
      (m) => `<li><strong>${A(m.targetActorName)}:</strong> bruto ${m.rawAmount}${m.damageType ? ` ${A(m.damageType)}` : ""} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), R = t.healingInstances.map(
      (m) => `<li><strong>${A(m.targetActorName)}:</strong> bruto ${m.rawAmount} &rarr; final ${m.finalAmount} &rarr; aplicado ${m.appliedAmount}</li>`
    ), b = t.resourceTransactions.map(
      (m) => `<li><strong>${A(m.actorName)}:</strong> ${A(Or(m))} — ${m.before.value}/${m.before.max} &rarr; ${m.after.value}/${m.after.max}</li>`
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
function cd(e) {
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
function Or(e) {
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
function ld(e) {
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
function ud(e) {
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
function dd() {
  const e = new Ls(), t = new _i(e), r = new vs(), n = new Fs(r), o = new Xs(e), a = new Js(), s = a.registerMany(xo());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new Zs(), d = new Ys(), g = new od(a), y = new nd(g, i, d), R = new Ei(), b = new id(R), k = new Pi(), m = new $i(t, n, b, k), he = new Ii(m, k), W = new Ku(he, t, n, R);
  return W.addStrategy(new Ws((ye) => W.handleItemUsed(ye))), {
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
const { ApplicationV2: md } = foundry.applications.api;
class Ie extends md {
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${E(pt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${E(t.actorName)}</strong></p>
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
        <span>${E(e)}</span>
        <small>${r.length}</small>
      </h3>
      ${r.length > 0 ? fd(r) : gd(t)}
    </section>
  `;
}
function fd(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(pd).join("")}</ol>`;
}
function pd(e) {
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
function gd(e) {
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
const Pe = `${c}.manageRitualPresets`, Mr = `__${c}_ritualPresetHeaderControlRegistered`, hd = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function yd(e) {
  const t = globalThis;
  if (!t[Mr]) {
    for (const r of hd)
      Hooks.on(r, (n, o) => {
        Ad(n, o, e);
      });
    t[Mr] = !0, l.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Ad(e, t, r) {
  Array.isArray(t) && bd(e) && (Rd(e, r), !t.some((n) => n.action === Pe) && t.push({
    action: Pe,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), io(e, r);
    }
  }));
}
function Rd(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Pe] && (e.options.actions[Pe] = (r) => {
    r.preventDefault(), r.stopPropagation(), io(e, t);
  }));
}
function bd(e) {
  if (!game.user?.isGM) return !1;
  const t = co(e);
  return t ? t.type === "agent" && pe(t).length > 0 : !1;
}
function io(e, t) {
  const r = co(e);
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
function co(e) {
  return Fr(e.actor) ? e.actor : Fr(e.document) ? e.document : null;
}
function Fr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let Q = null;
Hooks.once("init", () => {
  Mo(), aa(), Ia(), Es(), l.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!zt.isSupportedSystem()) {
    l.warn(
      `Sistema não suportado: ${zt.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Q = dd(), Q.itemUseIntegration.registerStrategies(), pa(Q), Ca(), ka(), yd(Q), l.info("Inicializado para o sistema Ordem Paranormal."), l.info(`API de debug disponível em globalThis["${c}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${pt} inicializado.`);
});
function kd() {
  if (!Q)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Q;
}
export {
  kd as getToolkitServices
};
//# sourceMappingURL=main.js.map
