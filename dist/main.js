const l = "paranormal-toolkit", pt = "Paranormal Toolkit", bo = "ordemparanormal";
class pe {
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
function m(e) {
  return { ok: !1, error: e };
}
function gt(e) {
  const t = e.getFlag(l, "automation");
  return t == null ? m({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : ht(t) ? h(t.definition) : m({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Ro(e) {
  return ht(e.getFlag(l, "automation"));
}
function ht(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && To(t.source) && ko(t.definition);
}
function ko(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && S(t.label) && Array.isArray(t.steps) && t.steps.every(wo);
}
function To(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? S(t.presetId) && S(t.presetVersion) && S(t.appliedAt) : t.type === "manual" ? S(t.label) && S(t.appliedAt) : !1;
}
function wo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Co(t);
    case "spendRitualCost":
      return $o(t);
    case "rollFormula":
      return _o(t);
    case "modifyResource":
      return So(t);
    case "chatCard":
      return Io(t);
    default:
      return !1;
  }
}
function Co(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Vr(t);
}
function $o(e) {
  return e.type === "spendRitualCost";
}
function _o(e) {
  const t = e;
  return t.type === "rollFormula" && S(t.id) && S(t.formula) && (t.intent === void 0 || No(t.intent)) && (t.damageType === void 0 || S(t.damageType));
}
function So(e) {
  const t = e;
  return t.type === "modifyResource" && Eo(t.actor) && Po(t.resource) && Lo(t.operation) && Vr(t);
}
function Io(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Vr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || S(e.amountFrom);
}
function Eo(e) {
  return e === "self" || e === "target";
}
function Po(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Lo(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function No(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function S(e) {
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
    if (Oo(t))
      return Array.from(t).filter(Ft);
  }
  return [];
}
function Do(e) {
  return yt(e)[0] ?? null;
}
function vo(e) {
  return yt(e).find(Ro) ?? null;
}
function Oo(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ft(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ge(e) {
  return yt(e).filter((t) => t.type === "ritual");
}
function Gr(e) {
  return ge(e)[0] ?? null;
}
function Mo(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Pe);
      return u.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = ce("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const r = Ae(t);
      if (!r) return [];
      const n = e.automationRegistry.findForItem(r).map(Bt);
      return u.info(`Presets encontrados para ${r.name}.`, n), n;
    },
    async applyPresetToFirstRitual(t) {
      const r = ce("Nenhum ator encontrado para aplicar preset de ritual.");
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
      const t = ce("Nenhum ator encontrado para aplicar melhor preset de ritual.");
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
      const t = ce("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const r = Ae(t);
      r && (await e.automationBinder.clear(r), u.info(`Automação removida do ritual ${r.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${r.name}.`));
    }
  };
}
async function xt(e) {
  const t = ce("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const r = ge(t);
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
    n.applied.push(Fo(o, a, s));
  }
  return u.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, n), xo(n), n;
}
async function Xe(e, t, r) {
  return await e.automationBinder.applyPreset(t, r), e.itemPatches.applyPresetItemPatch(t, r);
}
function Fo(e, t, r) {
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
function xo(e) {
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
function ce(e) {
  const t = pe.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ae(e) {
  const t = Gr(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function W(e) {
  return e ? {
    id: e.id,
    source: {
      ...Uo(e.sourceActor),
      token: e.sourceToken
    },
    item: Bo(e.item),
    targets: e.targets.map(jo),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: jt(e.rollRequests, zr),
    rolls: jt(e.rolls, qo),
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
function Uo(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Bo(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function jo(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function zr(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function qo(e) {
  return {
    ...zr(e),
    total: e.total
  };
}
function jt(e, t) {
  return Object.fromEntries(Object.entries(e).map(([r, n]) => [r, t(n)]));
}
function Ho(e) {
  return {
    getSelected() {
      return pe.getSelectedActor();
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
    Vo(o.error);
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
function j(e) {
  const t = pe.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Vo(e) {
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
function Go() {
  be(L.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), be(L.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), be(L.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), be(L.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Ze() {
  return {
    enabled: Re(L.enabled),
    console: Re(L.console),
    ui: Re(L.ui),
    chat: Re(L.chat)
  };
}
async function x(e, t) {
  await game.settings.set(l, L[e], t);
}
function be(e, t) {
  game.settings.register(l, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Re(e) {
  return game.settings.get(l, e) === !0;
}
function zo() {
  return {
    status() {
      return Ze();
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
const Wr = "ritual.costOnly", Kr = "ritual.simpleHealing", Wo = "ritual.eletrocussao", Yr = "ritual.simpleDamage", Qr = "generic.simpleHealing", Xr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Ko() {
  return [
    Yo(),
    Qo(),
    Xo(),
    Zo(),
    Jo()
  ];
}
function Yo() {
  return {
    id: Wr,
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
function Qo() {
  return {
    id: Kr,
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
    automation: Zr(),
    itemPatch: ta()
  };
}
function Xo() {
  return {
    id: Wo,
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
    automation: ea(),
    itemPatch: ra()
  };
}
function Zo() {
  return {
    id: Yr,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: bt()
  };
}
function Jo() {
  return {
    id: Qr,
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
function Zr(e = "2d8+2") {
  return Jr(
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
function ea() {
  return {
    ...bt("3d6", {
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
function bt(e = "1d8", t = {}) {
  const r = t.label ?? "Ritual de dano simples", n = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Jr(
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
function ta() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Xr,
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
function ra() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Xr,
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
function Jr(e, t, r) {
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
function en() {
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
function na(e) {
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
        if (!sa(t, r)) {
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
      const n = e.automationRegistry.require(Wr);
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
      if (!qt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Kr);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: Zr(t)
      }), u.info(`Preset de cura simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${n.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const r = q("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!r) return;
      const n = H(r);
      if (!n) return;
      if (!qt(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Yr);
      if (!o.ok) {
        u.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, o.value, {
        definition: bt(t)
      }), u.info(`Preset de dano simples aplicado ao ritual: ${n.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${n.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = q("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const r = H(t);
      r && await oa(e, t, r);
    }
  };
}
async function oa(e, t, r) {
  const n = gt(r);
  if (!n.ok) {
    u.warn(n.error.message, n.error), ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(n.value, {
    sourceActor: t,
    sourceToken: en(),
    item: r,
    targets: Rt()
  });
  if (!o.ok) {
    aa(o.error);
    return;
  }
  u.info("Automação de ritual executada com sucesso.", W(o.value.context));
}
function aa(e) {
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
  const t = pe.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function H(e) {
  const t = Gr(e);
  return t || (u.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function sa(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function qt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const ia = ["disabled", "ask", "automatic"], ca = ["buttons", "confirm"], tn = "ask";
function la(e) {
  return typeof e == "string" && ia.includes(e);
}
function ua(e) {
  return typeof e == "string" && ca.includes(e);
}
function da(e) {
  return la(e) ? e : ua(e) ? "ask" : tn;
}
const ma = ["keep", "replace"], rn = "keep", fa = !0, N = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function pa() {
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
    default: tn
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
    default: rn
  }), game.settings.register(l, N.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: fa
  }), game.settings.register(l, N.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Ht() {
  const e = da(game.settings.get(l, N.executionMode)), t = on(game.settings.get(l, N.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: nn()
  };
}
function ga() {
  return on(game.settings.get(l, N.systemCardMode));
}
function nn() {
  return game.settings.get(l, N.ritualCastingCheckEnabled) === !0;
}
async function V(e) {
  await game.settings.set(l, N.executionMode, e);
}
function on(e) {
  return ma.includes(e) ? e : rn;
}
function ha(e) {
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
const ya = [
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
function Aa(e) {
  return {
    phases() {
      return ya;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = xe("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const r = vo(t);
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
      if (!ka(r)) {
        u.warn(`UUID não resolveu para um Item: ${t}`, r), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const n = Ra(r) ?? xe("Nenhum ator encontrado para executar automação do item.");
      n && await Vt(e, n, r);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = xe("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const r = Do(t);
      if (!r) {
        u.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const n = e.automationRegistry.require(Qr);
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
    sourceToken: en(),
    item: r,
    targets: Rt()
  });
  if (!o.ok) {
    ba(o.error);
    return;
  }
  u.info("Automação executada com sucesso.", W(o.value.context));
}
function ba(e) {
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
  const t = pe.getSelectedActor();
  return t || (u.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ra(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ka(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ta(e) {
  const t = Ho(e), r = Mo(e), n = na(e), o = Aa(e), a = zo(), s = ha(e);
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
function wa(e) {
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
      const n = Gt();
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
      return Ca(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const r = Gt();
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
      return $a(n), n;
    }
  };
}
function Gt() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const r of e) {
    const n = r.actor ?? r.document?.actor ?? null;
    if (!n) continue;
    const a = n.uuid ?? null ?? n.id ?? n.name ?? `selected-${t.size}`;
    t.set(a, n);
  }
  return Array.from(t.values());
}
function Ca(e) {
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
function $a(e) {
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
function _a(e) {
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
    conditions: wa(e.conditions),
    debug: Ta(e)
  }, r = globalThis;
  return r[l] = t, r.ParanormalToolkit = t, t;
}
class zt {
  static isSupportedSystem() {
    return game.system.id === bo;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Sa() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: X(t.id),
    actorId: X(t.actor?.id),
    sceneId: X(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function an() {
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
function Ia(e, t = an()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Ea(e) {
  if (!Na(e)) return null;
  const t = e.getFlag(l, "workflow");
  return La(t) ? t : null;
}
function Pa() {
  return `flags.${l}.workflow`;
}
function Wt(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${l}`), r = foundry.utils.getProperty(e, `_source.flags.${l}`);
  return t !== void 0 || r !== void 0;
}
function Kt(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), r = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Je(t) || Je(r);
}
function La(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Na(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function X(e) {
  return Je(e) ? e : null;
}
function Je(e) {
  return typeof e == "string" && e.length > 0;
}
function Da() {
  const e = (t, r) => {
    va(t, r);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function va(e, t) {
  const r = Ea(e);
  if (!r || r.targets.length === 0) return;
  const n = Ma(t);
  if (!n || n.querySelector(`.${l}-chat-enrichment`)) return;
  (n.querySelector(".message-content") ?? n).append(Oa(r));
}
function Oa(e) {
  const t = document.createElement("section");
  t.classList.add(`${l}-chat-enrichment`);
  const r = document.createElement("strong");
  return r.textContent = "Paranormal Toolkit", t.append(r), e.source && t.append(Yt("Origem", e.source.name)), t.append(Yt("Alvo", e.targets.map((n) => n.name).join(", "))), t;
}
function Yt(e, t) {
  const r = document.createElement("p");
  r.classList.add(`${l}-chat-enrichment__row`);
  const n = document.createElement("span");
  n.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, r.append(n, o), r;
}
function Ma(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Fa() {
  Hooks.on("preCreateChatMessage", (e, t, r, n) => {
    if (!xa(n) || !Ua(e) || Wt(e) || Wt(t)) return;
    const o = Sa();
    if (o.length === 0 || !Kt(e) && !Kt(t)) return;
    const a = an();
    e.updateSource({
      [Pa()]: Ia(o, a)
    }), u.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function xa(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Ua(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
const sn = {
  enabled: "dice.animations.enabled"
};
function Ba() {
  game.settings.register(l, sn.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function ja() {
  return {
    enabled: game.settings.get(l, sn.enabled) === !0
  };
}
const qa = "chatCard", Qt = "data-paranormal-toolkit-prompt-id", c = `${l}-item-use-prompt`, Ha = `.${c}__title`, cn = `.${c}__header`, Va = `.${c}__roll-card`, Ga = `.${c}__roll-meta`, za = `.${c}__roll-meta-pill`, Wa = `.${c}__resistance`, Ka = `.${c}__resistance-header`, ln = `.${c}__resistance-description`, Ya = `.${c}__resistance-roll-button`, Qa = `.${c}__resistance-roll-result`, Xt = `${c}__resistance-content`, un = `.${c}__workflow-section`, dn = `.${c}__workflow-roll`, mn = `${c}__workflow-roll--dice-open`, fn = `.${c}__workflow-roll-formula`, pn = `${c}__workflow-roll-formula--toggle`, kt = `.${c}__workflow-dice-tray`, Xa = `.${c}__roll-detail-toggle`, Za = `.${c}__roll-detail-list`, Ja = `.${c}__ritual-element-badge`, es = `.${c}__ritual-metadata`, ts = "casting-backlash", rs = "data-paranormal-toolkit-action-section", ns = "data-paranormal-toolkit-prompt-id", os = "data-paranormal-toolkit-pending-id", Zt = "data-paranormal-toolkit-casting-backlash-enhanced", Jt = `.${c}`, as = `.${c}__workflow-section--casting`, ss = `.${c}__workflow-section-header`, is = `.${c}__workflow-notes`, cs = `[${rs}="${ts}"]`, er = `${c}__workflow-section-title-row`, ls = `${c}__workflow-section-header--casting-backlash`, gn = `${c}__casting-backlash-button`;
function us(e) {
  for (const t of ds(e))
    ms(t), ys(t);
}
function ds(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Jt) && t.add(e);
  for (const r of e.querySelectorAll(Jt))
    t.add(r);
  return Array.from(t);
}
function ms(e) {
  const t = e.querySelector(cs);
  if (!t) return;
  const r = fs(t);
  if (!r) return;
  const n = e.querySelector(`${as} ${ss}`);
  n && (n.classList.add(ls), ps(n), gs(r), n.append(r), t.remove());
}
function fs(e) {
  return e.querySelector(
    `button[${os}], button[${ns}]`
  );
}
function ps(e) {
  const t = e.querySelector(`:scope > .${er}`);
  if (t) return t;
  const r = document.createElement("div");
  r.classList.add(er);
  const n = Array.from(e.childNodes);
  e.prepend(r);
  for (const o of n)
    o !== r && (o instanceof HTMLButtonElement && o.classList.contains(gn) || r.append(o));
  return r;
}
function gs(e) {
  if (e.getAttribute(Zt) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", r = hs(t, e.disabled);
  e.classList.add(gn), e.setAttribute(Zt, "true"), e.setAttribute("title", r), e.setAttribute("aria-label", r);
}
function hs(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function ys(e) {
  for (const t of e.querySelectorAll(is)) {
    for (const r of Array.from(t.children))
      (r.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && r.remove();
    t.children.length === 0 && t.remove();
  }
}
function As(e) {
  for (const t of Array.from(e.querySelectorAll(un)))
    for (const r of Array.from(t.querySelectorAll(`${Xa}, ${Za}`)))
      r.remove();
}
function bs(e) {
  for (const t of Array.from(e.querySelectorAll(Wa)))
    Rs(t);
}
function Rs(e) {
  const t = e.querySelector(Ka), r = e.querySelector(ln), n = e.querySelector(Ya), o = e.querySelector(Qa);
  if (!n || !t && !r && !o) return;
  const a = ks(e, n);
  t && t.parentElement !== a && a.append(t), r && r.parentElement !== a && a.append(r), o && o.parentElement !== a && !n.contains(o) && a.append(o), n.parentElement !== e && e.append(n);
}
function ks(e, t) {
  const r = e.querySelector(`.${Xt}`);
  if (r) return r;
  const n = document.createElement("div");
  return n.classList.add(Xt), e.insertBefore(n, t.parentElement === e ? t : e.firstChild), n;
}
function tr(e) {
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
function I(e, t) {
  const r = Ts(e, t);
  return we(r);
}
function Ts(e, t) {
  return t.split(".").reduce((r, n) => Le(r) ? r[n] : null, e);
}
function ws(e, t) {
  const r = e.indexOf(":");
  return r < 0 || me(e.slice(0, r)) !== me(t) ? null : te(e.slice(r + 1));
}
function we(e) {
  return typeof e == "string" ? te(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Le(e) {
  return !!e && typeof e == "object";
}
function Cs(e) {
  return typeof e == "string";
}
function Ne(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function te(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function me(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function et(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function U(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function hn(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function $s(e) {
  for (const t of Array.from(e.querySelectorAll(Va))) {
    const r = Ns(t);
    _s(t), r && (Ss(t, r), Is(t, r));
  }
}
function _s(e) {
  for (const t of Array.from(e.querySelectorAll(Ga)))
    t.remove();
}
function Ss(e, t) {
  const n = e.closest(`.${c}`)?.querySelector(cn) ?? null, o = n?.querySelector(Ha) ?? null, a = n ?? e, s = a.querySelector(Ja);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const i = s ?? document.createElement("span");
  if (i.className = Ys(t.elementTone), i.textContent = Ks(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", i);
      return;
    }
    a.prepend(i);
  }
}
function Is(e, t) {
  const r = Es(e);
  Ps(e, r);
  const n = Ls(t);
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
  const a = e.querySelector(un);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function Es(e) {
  return e.closest(`.${c}`)?.querySelector(cn) ?? null;
}
function Ps(e, t) {
  const r = [e, t].filter((n) => n !== null);
  for (const n of r)
    for (const o of Array.from(n.querySelectorAll(es)))
      o.remove();
}
function Ls(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${et(e.target)}` : null,
    e.duration ? `Duração: ${et(e.duration)}` : null,
    e.resistance ? `Resistência: ${hn(e.resistance)}` : null
  ].filter(Ne);
}
function Ns(e) {
  const t = Ds(e), r = Us(e), o = (t ? xs(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = wt(I(o, "element")), i = v("op.elementChoices", s) ?? rr(z(a, "Elemento")) ?? rr(r.damageType), d = s ?? Qs(i), g = I(o, "circle") ?? z(a, "Círculo"), y = qs(o) ?? z(a, "Alvo"), b = zs(o, "duration", "op.durationChoices") ?? z(a, "Duração"), k = Bs(e) ?? Vs(o) ?? z(a, "Resistência"), R = js(a) ?? r.cost, f = {
    elementLabel: i,
    elementTone: d,
    circle: g,
    cost: R,
    target: y,
    duration: b,
    resistance: k
  };
  return Ws(f) ? f : null;
}
function Ds(e) {
  const t = vs(e);
  if (!t) return null;
  const r = t.getFlag?.(l, qa), n = Ms(r);
  if (n.length === 0) return null;
  const o = Os(e);
  if (o.size > 0) {
    const a = n.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return n.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function vs(e) {
  const r = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return r ? Tt()?.messages?.get?.(r) ?? null : null;
}
function Os(e) {
  const t = e.closest(`.${c}`) ?? e, r = /* @__PURE__ */ new Set();
  for (const n of Array.from(t.querySelectorAll(`[${Qt}]`))) {
    const o = n.getAttribute(Qt)?.trim();
    o && r.add(o);
  }
  return r;
}
function Ms(e) {
  if (!Le(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Fs).filter((r) => r !== null) : [];
}
function Fs(e) {
  return Le(e) ? {
    pendingId: we(e.pendingId),
    actorId: we(e.actorId),
    itemId: we(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Cs) : []
  } : null;
}
function xs(e) {
  if (!e.itemId) return null;
  const t = Tt(), n = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return n || (t?.items?.get?.(e.itemId) ?? null);
}
function Us(e) {
  let t = null, r = null;
  for (const n of Array.from(e.querySelectorAll(za))) {
    const o = te(n.textContent);
    if (!o) continue;
    const a = ws(o, "Tipo");
    a && (r = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: r };
}
function Bs(e) {
  const t = te(e.querySelector(ln)?.textContent);
  return t ? hn(t) : null;
}
function z(e, t) {
  const r = me(t);
  for (const n of e) {
    const o = n.indexOf(":");
    if (!(o < 0 || me(n.slice(0, o)) !== r))
      return te(n.slice(o + 1));
  }
  return null;
}
function js(e) {
  const t = z(e, "Custo") ?? z(e, "PE");
  return t || (e.map(te).find((r) => typeof r == "string" && /\b(P[ED]|PE|PD)\b/iu.test(r)) ?? null);
}
function qs(e) {
  const t = I(e, "target");
  if (!t) return null;
  if (t === "area")
    return Hs(e) ?? v("op.targetChoices", t) ?? "Área";
  const r = v("op.targetChoices", t) ?? U(t);
  return [t === "people" || t === "creatures" ? I(e, "targetQtd") : null, r].filter(Ne).join(" ");
}
function Hs(e) {
  const t = I(e, "area.name"), r = I(e, "area.size"), n = I(e, "area.type"), o = t ? v("op.areaChoices", t) ?? U(t) : null, a = n ? v("op.areaTypeChoices", n) ?? U(n) : null;
  return o ? r ? a ? `${o} ${r}m ${et(a)}` : `${o} ${r}m` : o : null;
}
function Vs(e) {
  const t = I(e, "skillResis"), r = I(e, "resistance");
  if (!t || !r) return null;
  const n = v("op.skill", t) ?? U(t), o = Gs(r);
  return [n, o].filter(Ne).join(" ");
}
function Gs(e) {
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
function zs(e, t, r) {
  const n = I(e, t);
  return n ? v(r, n) ?? U(n) : null;
}
function Ws(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Ks(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Ys(e) {
  return [
    `${c}__ritual-element-badge`,
    e ? `${c}__ritual-element-badge--${e}` : null
  ].filter(Ne).join(" ");
}
function wt(e) {
  const t = me(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function rr(e) {
  const t = wt(e);
  return t ? v("op.elementChoices", t) ?? U(t) : e ? U(e) : null;
}
function Qs(e) {
  return wt(e);
}
function v(e, t) {
  if (!t) return null;
  const r = `${e}.${t}`, n = Tt()?.i18n?.localize?.(r);
  return !n || n === r ? null : n;
}
const nr = "data-paranormal-toolkit-dice-toggle-enhanced";
function Xs(e) {
  for (const t of Array.from(e.querySelectorAll(dn)))
    yn(t);
}
function Zs(e) {
  const t = bn(e.target);
  if (!t) return;
  const r = Ct(t);
  r && (e.preventDefault(), An(r, t));
}
function Js(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = bn(e.target);
  if (!t) return;
  const r = Ct(t);
  r && (e.preventDefault(), An(r, t));
}
function yn(e) {
  const t = e.querySelector(kt);
  if (!t) return;
  const r = e.querySelector(fn);
  if (r && r.getAttribute(nr) !== "true" && (r.setAttribute(nr, "true"), r.classList.add(pn), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", "false"), r.title = "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title), t.hidden = !0, !r.querySelector("i"))) {
    const n = document.createElement("i");
    n.classList.add("fa-solid", "fa-chevron-down"), n.setAttribute("aria-hidden", "true"), r.append(n);
  }
}
function An(e, t) {
  const r = e.querySelector(kt);
  if (!r) return;
  const n = !e.classList.contains(mn);
  ei(e, t, r, n);
}
function ei(e, t, r, n) {
  e.classList.toggle(mn, n), r.hidden = !n, t.setAttribute("aria-expanded", n ? "true" : "false"), t.title = n ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !n), o.classList.toggle("fa-chevron-up", n));
}
function bn(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(fn);
  if (!t) return null;
  const r = Ct(t);
  return r ? (yn(r), t.classList.contains(pn) ? t : null) : null;
}
function Ct(e) {
  const t = e.closest(dn);
  return t && t.querySelector(kt) ? t : null;
}
const or = `${l}-workflow-dice-toggle-styles`;
function ti() {
  if (document.getElementById(or)) return;
  const e = document.createElement("style");
  e.id = or, e.textContent = `
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
const ri = [0, 100, 500, 1500, 3e3];
let ar = !1, Ue = null;
function ni() {
  if (!ar) {
    ar = !0, ti(), Hooks.on("renderChatMessageHTML", (e, t) => {
      le(tr(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      le(tr(t));
    }), Hooks.once("ready", () => {
      le(document), oi();
    }), document.addEventListener("click", Zs), document.addEventListener("keydown", Js);
    for (const e of ri)
      globalThis.setTimeout(() => le(document), e);
  }
}
function oi() {
  Ue || !document.body || (Ue = new MutationObserver((e) => {
    for (const t of e)
      for (const r of Array.from(t.addedNodes))
        (r instanceof HTMLElement || r instanceof DocumentFragment) && le(r);
  }), Ue.observe(document.body, { childList: !0, subtree: !0 }));
}
function le(e) {
  e && (As(e), $s(e), bs(e), Xs(e), us(e));
}
function ai() {
  ni();
}
const ue = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Rn = {
  PV: "system.attributes.hp"
}, tt = {
  PV: [ue.PV, Rn.PV],
  SAN: [ue.SAN],
  PE: [ue.PE],
  PD: [ue.PD]
}, rt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class si {
  getResource(t, r) {
    const n = sr(t, r);
    if (!n.ok)
      return m(n.error);
    const o = n.value, a = `${o}.value`, s = `${o}.max`, i = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, s), g = cr(t, r, a, i, "valor atual");
    if (g) return m(g);
    const y = cr(t, r, s, d, "valor máximo");
    return y ? m(y) : h({
      value: i,
      max: d
    });
  }
  async updateResourceValue(t, r, n) {
    const o = sr(t, r);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: n });
  }
}
function sr(e, t) {
  const r = ii(e.type, t);
  if (r && ir(e, r))
    return h(r);
  const n = tt[t].find(
    (o) => ir(e, o)
  );
  return n ? h(n) : m({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: ci(e, t),
    path: tt[t].join(" | ")
  });
}
function ii(e, t) {
  return e === "threat" ? Rn[t] ?? null : e === "agent" ? ue[t] : null;
}
function ir(e, t) {
  const r = foundry.utils.getProperty(e, `${t}.value`), n = foundry.utils.getProperty(e, `${t}.max`);
  return typeof r == "number" && Number.isFinite(r) && typeof n == "number" && Number.isFinite(n);
}
function ci(e, t) {
  const r = e.type ?? "unknown", n = tt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${r}). Paths testados: ${n}.`;
}
function cr(e, t, r, n, o) {
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
class li {
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
      const s = rt.ritualItem.circleCandidates;
      return m({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: n, value: o } = r, a = di(o);
    return a ? h(a) : m({
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
function di(e) {
  if (lr(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const r = Number(t);
    if (lr(r))
      return r;
  }
  return null;
}
function lr(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const mi = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class fi {
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
    const n = r.value, o = pi(t.ritual, n);
    return o.ok ? o.value ? h(o.value) : h({
      resource: "PE",
      amount: mi[n],
      source: "default-by-circle",
      circle: n
    }) : m(o.error);
  }
}
function pi(e, t) {
  const r = e.getFlag(l, "ritual.cost");
  return r == null ? { ok: !0, value: null } : gi(r) ? {
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
function gi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Be = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function hi(e) {
  if (!Ti(e.item)) return null;
  const t = nt(e.actor) ? e.actor : yi(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: bi(e.token) ?? Ai(t),
    targets: Rt(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function yi(e) {
  const t = e;
  return nt(t.actor) ? t.actor : nt(e.parent) ? e.parent : null;
}
function Ai(e) {
  const t = Ri(e) ?? ki(e);
  return t ? kn(t) : null;
}
function bi(e) {
  return ot(e) ? kn(e) : null;
}
function Ri(e) {
  if (!e) return null;
  const t = e, r = t.token;
  return ot(r) ? r : (t.getActiveTokens?.() ?? []).find(ot) ?? null;
}
function ki(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function kn(e) {
  const t = e.actor ?? null;
  return {
    tokenId: je(e.id),
    actorId: je(t?.id),
    sceneId: je(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Ti(e) {
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
class wi {
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
    const r = hi(Ci(t));
    if (!r) {
      u.warn(`${Be.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(r);
  }
}
function Ci(e) {
  return e && typeof e == "object" ? e : {};
}
class $i {
  async applyPresetItemPatch(t, r) {
    const n = r.itemPatch;
    if (!n) return qe("missing-item-patch");
    if (t.type !== "ritual") return qe("unsupported-item-type");
    const o = _i(n);
    return Object.keys(o).length === 0 ? qe("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function _i(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const r = e.ritual;
  return r && (w(t, "system.circle", r.circle), w(t, "system.element", r.element), w(t, "system.target", r.target), w(t, "system.targetQtd", r.targetQuantity), w(t, "system.execution", r.execution), w(t, "system.range", r.range), w(t, "system.duration", r.duration), w(t, "system.skillResis", r.resistanceSkill), w(t, "system.resistance", r.resistance), w(t, "system.studentForm", r.studentForm), w(t, "system.trueForm", r.trueForm)), t;
}
function w(e, t, r) {
  r !== void 0 && (e[t] = r);
}
function qe(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Si {
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
class Ii {
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
class Ei {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const r = Pi(t);
    return r.ok ? this.presets.has(t.id) ? m({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, He(t)), h(t)) : r;
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
    return r ? He(r) : null;
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
    return Array.from(this.presets.values()).map(He);
  }
  findForItem(t) {
    return this.list().map((r) => Li(r, t)).filter((r) => r !== null).sort((r, n) => n.score - r.score || r.preset.id.localeCompare(n.preset.id));
  }
}
function Pi(e) {
  return !Ve(e.id) || !Ve(e.version) || !Ve(e.label) ? m({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? m({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : h(e);
}
function Li(e, t) {
  if (e.matchers.length === 0)
    return null;
  const r = [];
  let n = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    n += 10, r.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = Ni(o, t);
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
function Ni(e, t) {
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
      const r = ur(t.name), n = e.names.map(ur).includes(r);
      return {
        matches: n,
        score: n ? 100 : 0,
        reason: `normalizedName:${r}`
      };
    }
    case "ritualCircle": {
      const r = Di(t), n = r !== null && e.circles.includes(r);
      return {
        matches: n,
        score: n ? 20 : 0,
        reason: `ritualCircle:${r ?? "unknown"}`
      };
    }
  }
}
function ur(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Di(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), r = typeof t == "string" ? Number(t) : t;
  return r === 1 || r === 2 || r === 3 || r === 4 ? r : null;
}
function He(e) {
  return structuredClone(e);
}
function Ve(e) {
  return typeof e == "string" && e.length > 0;
}
function Ce(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? m({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : h(e.amount);
  if (typeof e.amountFrom == "string") {
    const r = De(e.amountFrom);
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
function De(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const vi = "dice-so-nice";
async function Tn(e) {
  if (!ja().enabled || !Oi()) return;
  const t = Mi();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (r) {
      u.warn("Não foi possível animar a rolagem com Dice So Nice.", r);
    }
}
function Oi() {
  return game.modules.get(vi)?.active === !0;
}
function Mi() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Fi(e, t, r) {
  if (!dr(e.id) || !dr(e.formula))
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
    await Tn(o);
    const i = {
      ...r.rollRequests[e.id] ?? wn(e, t),
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
function wn(e, t) {
  const r = e.intent ?? xi(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: r,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function xi(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function dr(e) {
  return typeof e == "string" && e.length > 0;
}
async function $e(e, t, r, n, o) {
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
function Ui(e) {
  const { step: t, context: r, transaction: n, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = Bi(t, r, n, o);
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
    const s = ji(t, r, n, o);
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
function Bi(e, t, r, n) {
  const o = De(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: Cn(t.id, "damage", n, t.damageInstances.length),
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
function ji(e, t, r, n) {
  const o = De(e.amountFrom);
  return {
    id: Cn(t.id, "healing", n, t.healingInstances.length),
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
function Cn(e, t, r, n) {
  return `${e}.${t}.${r}.${n}`;
}
function qi(e, t, r) {
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
function Hi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", r, { stepIndex: n, step: t, metadata: o }), $n("before", e), mr("before", e), mr("resolve", e);
}
function Vi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("apply", r, { stepIndex: n, step: t, metadata: o }), $n("apply", e);
}
function Gi(e) {
  const { step: t, context: r, stepIndex: n, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", r, { stepIndex: n, step: t, metadata: o });
}
function $n(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t, i = zi(e, r.operation);
  i && s.emit(i, n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function mr(e, t) {
  const { step: r, context: n, stepIndex: o, metadata: a, lifecycle: s } = t;
  r.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", n, {
    stepIndex: o,
    step: r,
    metadata: a
  });
}
function zi(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Wi(e, t, r) {
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
async function Ki(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Yi(e, t);
    case "spendRitualCost":
      return Qi(e, t);
  }
}
async function Yi(e, t) {
  const { context: r, resources: n } = e, o = Ce(t, r);
  return o.ok ? _n(await n.spend(r.sourceActor, t.resource, o.value), r) : m(o.error);
}
async function Qi(e, t) {
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
  }), _n(await n.spend(r.sourceActor, s.resource, s.amount), r, t);
}
function _n(e, t, r) {
  return e.ok ? (t.resourceTransactions.push(e.value), h(void 0)) : (r?.type === "spendRitualCost" && t.ritualCosts.pop(), m({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Xi(e) {
  const { step: t, context: r, stepIndex: n, lifecycle: o, execute: a } = e, s = Zi(t);
  for (const d of s.before)
    o.emit(d, r, { stepIndex: n, step: t });
  const i = await a();
  if (!i.ok)
    return i;
  for (const d of s.after)
    o.emit(d, r, { stepIndex: n, step: t });
  return i;
}
function Zi(e) {
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
class Ji {
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
        return Xi({
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
    const o = await Ki({
      step: t,
      context: r,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? h(void 0) : m({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runRollFormulaStepWithLifecycle(t, r, n) {
    const o = wn(t, n);
    r.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, r, n, t), this.lifecycle.emit("roll", r, { stepIndex: n, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, r, n, t);
    const a = await this.runRollFormulaStep(t, r, n);
    if (!a.ok)
      return a;
    const s = r.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, r, n, t, s), this.lifecycle.emit("afterRoll", r, { stepIndex: n, step: t, rollRequest: o, rollResult: s }), h(void 0);
  }
  async runRollFormulaStep(t, r, n) {
    const o = await Fi(t, n, r);
    return o.ok ? h(void 0) : m({ ...o.error, stepIndex: n, step: t, context: r });
  }
  async runModifyResourceStepWithLifecycle(t, r, n) {
    const o = Ce(t, r);
    if (!o.ok)
      return m({ ...o.error, stepIndex: n, step: t, context: r });
    const a = qi(t, r, o.value);
    Hi({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), Vi({
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
      const d = await $e(this.resources, i, t.resource, t.operation, o.value), g = this.handleResourceOperationResult(d, r, n, t);
      if (!g.ok)
        return g;
      Ui({
        step: t,
        context: r,
        transaction: g.value,
        stepIndex: n,
        lifecycle: this.lifecycle
      });
    }
    return Gi({
      step: t,
      context: r,
      stepIndex: n,
      metadata: a,
      lifecycle: this.lifecycle
    }), h(void 0);
  }
  async runModifyResourceStep(t, r, n) {
    const o = Ce(t, r);
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
      const i = await $e(this.resources, s, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(i, r, n, t);
      if (!d.ok)
        return d;
    }
    return h(void 0);
  }
  async runChatCardStep(t, r, n) {
    const o = await Wi(this.messages, t, r);
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
    const i = ec(t, r.intent);
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
function ec(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class tc {
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
    const { afterValue: d, appliedAmount: g } = i.value, y = {
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
      appliedAmount: g,
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
function Sn(e) {
  return {
    id: rc(),
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
function rc() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class nc {
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
    const n = Sn(r);
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
class oc {
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
class ac {
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
      whisper: sc(),
      flags: {
        ...t.flags,
        [l]: {
          ...ic(t.flags),
          debugOutput: !0
        }
      }
    }), r.console && t.data !== void 0 && u.info("Debug chat criado.", t.data), !0);
  }
  emit(t, r) {
    const n = Ze();
    if (!n.enabled)
      return;
    const o = r.notification ?? fr(r);
    n.console && this.emitConsole(t, r), n.ui && this.emitUi(t, o);
  }
  emitConsole(t, r) {
    const n = fr(r);
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
function fr(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function sc() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function ic(e) {
  const t = e?.[l];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function cc(e) {
  const t = lc(e?.rounds);
  if (!t)
    return {
      duration: {},
      requestedRounds: null,
      combatDurationApplied: !1,
      warning: null
    };
  const r = uc();
  return !r?.id || !In(r.round) ? {
    duration: {},
    requestedRounds: t,
    combatDurationApplied: !1,
    warning: `Duração de ${t} rodada(s) ignorada porque não há combate ativo.`
  } : {
    duration: {
      rounds: t,
      startRound: r.round,
      startTurn: dc(r.turn) ? r.turn : 0,
      combat: r.id
    },
    requestedRounds: t,
    combatDurationApplied: !0,
    warning: null
  };
}
function lc(e) {
  return In(e) ? Math.trunc(e) : null;
}
function uc() {
  return game.combat ?? null;
}
function In(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function dc(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class mc {
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
    if (!gc(n))
      return m({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = r.value, a = cc(t.duration), s = fc(o, t, a), d = t.refreshExisting ?? !0 ? hc(n, o.id) : null;
    if (d)
      try {
        return await Promise.resolve(d.update?.(s)), h(pr(n, o, d.id ?? null, !1, !0, a));
      } catch (g) {
        return m({
          actor: n,
          actorId: n.id ?? null,
          actorName: n.name ?? "Ator sem nome",
          conditionId: o.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${o.label} em ${n.name ?? "ator sem nome"}.`,
          cause: g
        });
      }
    try {
      const y = (await n.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return h(pr(n, o, y, !0, !1, a));
    } catch (g) {
      return m({
        actor: n,
        actorId: n.id ?? null,
        actorName: n.name ?? "Ator sem nome",
        conditionId: o.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${o.label} em ${n.name ?? "ator sem nome"}.`,
        cause: g
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
    const n = En(r, t.conditionId);
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
}
function fc(e, t, r) {
  const n = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: bc(),
    requestedRounds: r.requestedRounds,
    combatDurationApplied: r.combatDurationApplied
  };
  return {
    name: e.label,
    icon: e.icon,
    description: e.description,
    origin: t.originUuid ?? void 0,
    disabled: !1,
    transfer: !1,
    changes: e.changes.map((o) => ({ ...o })),
    duration: pc(r.duration),
    flags: {
      [l]: n
    }
  };
}
function pc(e) {
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
function pr(e, t, r, n, o, a) {
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
function gc(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function hc(e, t) {
  return En(e, t)[0] ?? null;
}
function En(e, t) {
  return yc(e).filter((r) => Ac(r) === t);
}
function yc(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Ac(e) {
  const t = e.getFlag?.(l, "conditionId");
  return typeof t == "string" ? t : null;
}
function bc() {
  return game.user?.id ?? null;
}
const Rc = {
  id: "vulnerable",
  label: "Vulnerável",
  icon: "icons/svg/downgrade.svg",
  description: "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.",
  definitionVersion: "1.0.0",
  changes: []
};
class kc {
  definitions = /* @__PURE__ */ new Map();
  constructor(t) {
    for (const r of t)
      this.definitions.set(r.id, r);
  }
  list() {
    return Array.from(this.definitions.values()).map(gr);
  }
  get(t) {
    const r = this.definitions.get(t);
    return r ? h(gr(r)) : m({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
}
function Tc() {
  return new kc([Rc]);
}
function gr(e) {
  return {
    ...e,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
const wc = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", Pn = `${l}-inline-roll-neutralized`, Cc = `${l}-inline-roll-notice`, $t = `data-${l}-inline-roll-neutralized`, hr = `data-${l}-inline-roll-notice`, $c = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function yr(e) {
  const t = Uc(e.message), r = await _c(e.message), n = Sc(t);
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
async function _c(e) {
  const t = Mc(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const r = Ic(t.content);
  return r.replacementCount === 0 || r.content === t.content ? { updated: !1, replacementCount: r.replacementCount } : { updated: await Fc(t, r.content), replacementCount: r.replacementCount };
}
function Sc(e) {
  const t = e ? xc(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const r = Ln(t);
  return r > 0 && Nn(Dc(t)), { replacementCount: r };
}
function Ic(e) {
  const t = Ec(e), r = document.createElement("template");
  r.innerHTML = t.content;
  const n = Ln(r.content), o = t.replacementCount + n;
  return o === 0 ? { content: e, replacementCount: 0 } : (Nn(r.content), { content: r.innerHTML, replacementCount: o });
}
function Ec(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (n, o) => (t += 1, Lc(o.trim()))), replacementCount: t };
}
function Ln(e) {
  const t = Pc(e);
  for (const r of t)
    r.replaceWith(Nc(vc(r)));
  return t.length;
}
function Pc(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.querySelectorAll(wc))
    r.getAttribute($t) !== "true" && t.add(r);
  return Array.from(t);
}
function Lc(e) {
  return `<span class="${Pn}" ${$t}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Bc(e)}</span>`;
}
function Nc(e) {
  const t = document.createElement("span");
  return t.classList.add(Pn), t.setAttribute($t, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Nn(e) {
  if (e.querySelector?.(`[${hr}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Cc), t.setAttribute(hr, "true"), t.textContent = $c, e.append(t);
}
function Dc(e) {
  return e.querySelector(".message-content") ?? e;
}
function vc(e) {
  const r = e.getAttribute("data-formula") ?? Oc(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return r && r.length > 0 ? r : "rolagem inline";
}
function Oc(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Mc(e) {
  return e && typeof e == "object" ? e : null;
}
async function Fc(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (r) {
    return u.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", r), !1;
  }
}
function xc(e) {
  const t = jc(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Uc(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Bc(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function jc(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ar = "occultism";
function qc(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Hc(e) {
  const t = qc(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const r = await Vc(e, Ar);
  if (!r)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Tn(r);
  const n = Wc(r);
  return {
    skill: Ar,
    skillLabel: "Ocultismo",
    roll: r,
    formula: zc(r),
    total: n,
    difficulty: t,
    success: n >= t,
    diceBreakdown: Kc(r)
  };
}
async function Vc(e, t) {
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
  return Gc(n);
}
function Gc(e) {
  return br(e) ? e : Array.isArray(e) ? e.find(br) ?? null : null;
}
function br(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function zc(e) {
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
function Qc(e) {
  return {
    header: {
      eyebrow: pt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: tl(e.ritual)
    },
    forms: e.variantOptions.map((t) => Xc(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: el(e.automationStatus ?? "assisted")
  };
}
function Xc(e, t) {
  const r = Zc(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Jc(t) : "—",
    details: r
  };
}
function Zc(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Jc(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function el(e) {
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
function tl(e) {
  const t = e.system, r = [nl(t?.element), rl(t?.circle)].filter(ol);
  return r.length > 0 ? r.join(" • ") : "Conjuração de ritual";
}
function rl(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function nl(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function ol(e) {
  return typeof e == "string" && e.length > 0;
}
const Dn = ["base", "discente", "verdadeiro"];
function vn(e) {
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
  return typeof e == "string" && Dn.includes(e);
}
const { ApplicationV2: al } = foundry.applications.api;
class de extends al {
  constructor(t, r) {
    super({
      id: `${l}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = r, this.model = Qc(t), this.selectedVariant = this.model.forms.find((n) => n.checked && n.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: de.onCast,
      cancel: de.onCancel
    }
  };
  static async request(t) {
    return new Promise((r) => {
      new de(t, r).render({ force: !0 });
    });
  }
  async _renderHTML(t, r) {
    const n = document.createElement("div");
    return n.className = "paranormal-toolkit-ritual-cast", n.innerHTML = this.renderContent(), n;
  }
  _replaceHTML(t, r, n) {
    r.replaceChildren(t);
    const o = r.querySelector(".paranormal-toolkit-ritual-cast") ?? r;
    il(o, (a) => {
      this.selectedVariant = a;
    }), cl(o, (a) => {
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
          ${this.model.forms.map(sl).join("")}
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
    const r = dl(t), n = ll(r, this.spendResource, this.selectedVariant);
    this.settle(n), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function sl(e) {
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
function il(e, t) {
  const r = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of r)
    o.addEventListener("click", () => Rr(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Rr(e, o, t));
    });
  const n = On(e);
  n && t(n);
}
function Rr(e, t, r) {
  const n = t.querySelector('input[name="variant"]');
  !n || n.disabled || !_e(n.value) || (n.checked = !0, e.dataset.paranormalToolkitSelectedVariant = n.value, r(n.value), n.dispatchEvent(new Event("change", { bubbles: !0 })), On(e));
}
function On(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let r = null;
  for (const n of t) {
    const o = n.querySelector('input[name="variant"]'), a = o?.checked === !0;
    n.setAttribute("aria-checked", a ? "true" : "false"), a && _e(o.value) && (r = o.value);
  }
  return r && (e.dataset.paranormalToolkitSelectedVariant = r), r;
}
function cl(e, t) {
  const r = e.querySelector('input[name="spendResource"]');
  r && (t(r.checked), r.addEventListener("change", () => {
    t(r.checked);
  }));
}
function ll(e, t, r) {
  const n = ul(e) ?? r, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: n,
    spendResource: o
  };
}
function ul(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (_e(t)) return t;
  const r = e?.dataset.paranormalToolkitSelectedVariant;
  return _e(r) ? r : null;
}
function dl(e) {
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
async function ml(e) {
  return de.request(e);
}
const _t = {
  label: "Padrão"
}, fl = {
  label: "Discente",
  extraCost: 2
}, pl = {
  label: "Verdadeiro",
  extraCost: 5
};
class gl {
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
    const n = this.resolveCostPreview(t), o = Gl(r), a = ql(r, t.item, n, o), s = await ml({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((T) => T.name),
      cost: n,
      defaultSpendResource: Xl(r),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const i = hl(s), d = Wl(r, t.item, i.variant, o), g = nn();
    let y = null;
    if (g) {
      const T = await Al(this.resources, t.actor, i, d, n);
      if (!T.ok)
        return {
          status: "failed",
          reason: T.reason,
          message: T.message
        };
      try {
        y = await Hc(t.actor);
      } catch (F) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: F instanceof Error ? F.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: F
        };
      }
    }
    const b = yl(r, i, d, n, {
      includeCostSteps: !g
    });
    if (b.steps.length === 0) {
      const T = zl(t, i), F = kr(t.actor, y, d, n), Mt = wr(r, i, d, n, T, y);
      return F.length > 0 ? {
        status: "ready",
        workflowContext: T,
        actions: F,
        summaryLines: Mt
      } : {
        status: "completed-without-actions",
        workflowContext: T,
        summaryLines: Mt
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
    const R = k.value.context, f = Rl(r, t, R), oe = kr(t.actor, y, d, n), ae = wr(r, i, d, n, R, y);
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
    return $e(this.resources, t.actor, t.resource, t.operation, t.amount);
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
function hl(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function yl(e, t, r, n, o) {
  const a = [], s = t.spendResource === !0;
  for (const i of e.steps)
    i.type === "modifyResource" || i.type === "chatCard" || St(i) && (!o.includeCostSteps || !s) || a.push(bl(i, r));
  return o.includeCostSteps && s && n && Zl(r.extraCost) && a.push({
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
async function Al(e, t, r, n, o) {
  if (r.spendResource !== !0) return { ok: !0 };
  const a = he(o, n);
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
function bl(e, t) {
  if (e.type !== "rollFormula") return e;
  const r = t.rollFormulaOverrides?.[e.id];
  return r ? {
    ...e,
    formula: r
  } : e;
}
function kr(e, t, r, n) {
  if (!t || t.success) return [];
  const o = he(n, r);
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
function Rl(e, t, r) {
  const n = [];
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const a = Ce(o, r);
    if (!a.ok)
      return {
        ok: !1,
        reason: a.error.reason,
        message: a.error.message
      };
    const s = El(o.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const i of s)
      n.push(...kl(e, o, i, a.value));
  }
  return { ok: !0, actions: n };
}
function kl(e, t, r, n) {
  if (!$l(e, t))
    return [Tr(t, r, n)];
  const o = Il();
  return Mn(e).map((a) => {
    const s = _l(n, a);
    return Tr(t, r, s, {
      option: a,
      choiceGroupId: o
    });
  });
}
function Tr(e, t, r, n) {
  const o = t.name ?? "Ator sem nome", a = Cl(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: o,
    resource: e.resource,
    operation: e.operation,
    amount: r,
    label: Tl(e, o, r, n?.option),
    executedLabel: wl(e, o, n?.option),
    choiceGroupId: n?.choiceGroupId,
    choiceGroupResolvedLabel: n ? "✓ Outra opção escolhida" : void 0,
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function Tl(e, t, r, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${r} PV` : e.operation === "damage" ? n ? `${n.id === "normal" ? "Normal" : n.label}: ${r} PV` : `Dano: ${r} PV` : e.operation === "recover" ? `Recuperar ${r} ${e.resource}` : e.operation === "spend" ? `Gastar ${r} ${e.resource}` : `Aplicar ${r} ${e.resource}`;
}
function wl(e, t, r) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? r ? `✓ ${r.id === "normal" ? "dano normal" : r.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Cl(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function $l(e, t) {
  return t.operation === "damage" && t.resource === "PV" && Mn(e).length > 1;
}
function Mn(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function _l(e, t) {
  const r = e * t.multiplier, n = Sl(r, t.rounding ?? "floor");
  return Math.max(0, n);
}
function Sl(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Il() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function El(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap((r) => r.actor ? [r.actor] : []);
  }
}
function wr(e, t, r, n, o, a = null) {
  return [
    `Forma: ${vn(t.variant)}`,
    Ll(t, r, n),
    ...Pl(a),
    ...Object.values(o.rolls).flatMap(Nl),
    ...Dl(e.resistance),
    ...Bl(r)
  ];
}
function Pl(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Ll(e, t, r) {
  const n = he(r, t);
  return n ? e.spendResource ? `Custo: ${n.amount} ${n.resource} gasto` : `Custo: ${n.amount} ${n.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Nl(e) {
  const r = [`${jl(e)}: ${e.formula} = ${Math.trunc(e.total)}`], n = vl(e.roll);
  return n && r.push(`Dados: ${n}`), e.damageType && r.push(`Tipo: ${Ul(e.damageType)}`), r;
}
function Dl(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function vl(e) {
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
    const s = Ol(a);
    s && (xl(r, s.operator ?? n, s.value), n = "+");
  }
  return r.length > 0 ? r.join(" ") : null;
}
function Ol(e) {
  const t = Ml(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Fl(e);
}
function Ml(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const r = t;
    return typeof r.result != "number" || !Number.isFinite(r.result) ? [] : r.active !== !1 && r.discarded !== !0 ? [String(r.result)] : [];
  }) : [];
}
function Fl(e) {
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
function xl(e, t, r) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${r}` : r);
    return;
  }
  e.push(`${t} ${r}`);
}
function Ul(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Bl(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function jl(e) {
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
function ql(e, t, r, n) {
  return Dn.map((o) => {
    const a = Fn(e, t, o, n), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? vn(o),
      enabled: s,
      details: a ? Hl(a, r, n) : [],
      finalCostText: a ? Vl(r, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function Hl(e, t, r) {
  const n = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? n.push(o.join(", ")) : r && n.push("efeito manual");
  const a = he(t, e);
  return n.push(a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"), n;
}
function he(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function Vl(e, t) {
  const r = he(e, t);
  return r ? `${r.amount} ${r.resource}` : null;
}
function Gl(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(St);
}
function zl(e, t) {
  return Sn({
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
function Wl(e, t, r, n) {
  return Fn(e, t, r, n) ?? _t;
}
function Fn(e, t, r, n) {
  const o = e.ritualForms?.[r] ?? null;
  return o || (n ? Yl(t, r) ? Kl(r) : null : r === "base" ? _t : null);
}
function Kl(e) {
  switch (e) {
    case "base":
      return _t;
    case "discente":
      return fl;
    case "verdadeiro":
      return pl;
  }
}
function Yl(e, t) {
  if (t === "base") return !0;
  const r = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Ql(foundry.utils.getProperty(e, r));
}
function Ql(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Xl(e) {
  return e.steps.some(St);
}
function St(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Zl(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Jl(e, t) {
  const r = await eu(e, t);
  if (!r)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: r,
    formula: ru(r),
    total: nu(r),
    diceBreakdown: ou(r)
  };
}
function xn(e) {
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
async function eu(e, t) {
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
  return tu(n);
}
function tu(e) {
  return Cr(e) ? e : Array.isArray(e) ? e.find(Cr) ?? null : null;
}
function Cr(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function ru(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function nu(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function ou(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const r = t.find(au);
  if (!r) return null;
  const o = (Array.isArray(r.results) ? r.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function au(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Un = "itemUsePrompts", Bn = "chatCard", ve = "data-paranormal-toolkit-prompt-id", Oe = "data-paranormal-toolkit-pending-id", It = "data-paranormal-toolkit-executed-label", at = "data-paranormal-toolkit-choice-group", jn = "data-paranormal-toolkit-skipped-label", $r = "data-paranormal-toolkit-action-section", _r = "data-paranormal-toolkit-detail-key", Sr = "data-paranormal-toolkit-roll-card", Et = "data-paranormal-toolkit-roll-detail-toggle", qn = "data-paranormal-toolkit-roll-detail-id", Hn = "data-paranormal-toolkit-resistance-roll-button", Vn = "data-paranormal-toolkit-resistance-skill", Gn = "data-paranormal-toolkit-resistance-skill-label", zn = "data-paranormal-toolkit-resistance-target-actor-id", Wn = "data-paranormal-toolkit-resistance-target-name", Kn = "data-paranormal-toolkit-resistance-roll-result", Ir = "data-paranormal-toolkit-system-card-replaced", su = `[${Oe}]`, iu = `[${Et}]`, cu = `[${Hn}]`, st = `${l}-chat-enrichment`, p = `${l}-item-use-prompt`, lu = `${p}__actions`, Er = `${p}__details`, Yn = `${p}__summary`, uu = `${p}__title`, Qn = `${p}__button--executed`, Pr = `${p}__roll-card`;
let Lr = !1, it = null;
const E = /* @__PURE__ */ new Map(), du = [0, 100, 500, 1500, 3e3], mu = 3e4, fu = [0, 100, 500, 1500, 3e3];
function pu(e) {
  if (it = e, Lr) {
    Dr(e);
    return;
  }
  const t = (r, n) => {
    Zn(r, n, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Lr = !0, Dr(e);
}
async function Nr(e) {
  const t = Xn(e);
  E.set(e.pendingId, t), await Nt(t) || co(t), Jn(e.pendingId);
}
async function gu(e) {
  const t = Xn({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", E.set(e.pendingId, t), await Nt(t) || co(t), Jn(e.pendingId);
}
async function Ge(e, t) {
  const r = E.get(e);
  E.delete(e), r && await pd(r, t);
}
function Pt(e) {
  const t = go();
  for (const r of t) {
    const n = M(r)[e];
    if (n) return { message: r, prompt: n };
  }
  return null;
}
async function hu(e, t) {
  const r = Pt(e);
  if (!r) return;
  const n = M(r.message), o = n[e];
  o && (n[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await re(r.message, n));
}
async function yu(e, t, r) {
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
function Xn(e) {
  const t = B(e.context.message), r = e.context.targets.find((s) => dt(s)), n = r ? dt(r) : null, o = e.resistanceTargetActor ?? n, a = e.resistanceTargetName ?? r?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Hu(e.context),
    executed: !1
  };
}
function Zn(e, t, r) {
  fd();
  const n = Fe(t);
  if (!n) return;
  const o = ud(e, n);
  o.length > 0 && Se(n);
  for (const a of o)
    ct(n, a);
  ro(n, r), lt(n), ut(n);
}
function Dr(e) {
  for (const t of fu)
    globalThis.setTimeout(() => {
      Au(e);
    }, t);
}
function Au(e) {
  for (const t of bu()) {
    const r = Me(t);
    Ru(r) && Zn(r, t, e);
  }
}
function bu() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const r = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    r.dataset.messageId && e.add(r);
  }
  return Array.from(e);
}
function Ru(e) {
  return e ? Dt(e) ? !0 : hd(e).length > 0 : !1;
}
function Jn(e) {
  const t = E.get(e);
  if (!t) return;
  const r = t.messageId ? dd(t.messageId) : null;
  if (r) {
    xr(r, t), Se(r), ct(r, t), vr(r), lt(r), ut(r);
    return;
  }
  if (t.messageId) {
    ft(t);
    return;
  }
  const n = md(t);
  if (n) {
    xr(n, t), Se(n), ct(n, t), vr(n), lt(n), ut(n);
    return;
  }
  ft(t);
}
function vr(e) {
  it && ro(e, it);
}
function Se(e) {
  const t = ku();
  e.classList.toggle(`${p}--system-card-replaced`, t);
  const r = to(e);
  if (!r || (r.classList.toggle(`${p}__host--system-card-replaced`, t), !t) || r.getAttribute(Ir) === "true") return;
  const n = r.querySelector(`.${st}`);
  n ? r.replaceChildren(n) : r.replaceChildren(), r.setAttribute(Ir, "true");
}
function ku() {
  try {
    return ga() === "replace";
  } catch {
    return !1;
  }
}
function ct(e, t) {
  if (Se(e), e.querySelector(`[${ve}="${ne(t.pendingId)}"]`)) return;
  const r = Tu(e, t);
  Cu(r, t), xu(r, Uu(t)).append(qu(t));
}
function Tu(e, t) {
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
  s.classList.add(uu), s.textContent = wu(t);
  const i = document.createElement("span");
  return i.classList.add(Yn), i.textContent = t.summary, o.append(a, s, i), n.append(o), Gu(e).append(n), n;
}
function wu(e) {
  const t = $(e.summaryLines ?? [], "Forma"), r = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${r} • ${t}` : r;
}
function Cu(e, t) {
  const r = t.summaryLines ?? [], n = so(r, t);
  if (n) {
    $u(e, n, t);
    return;
  }
  Bu(e, r);
}
function $u(e, t, r) {
  if (e.querySelector(`[${Sr}="true"]`)) return;
  const n = document.createElement("article");
  n.classList.add(Pr, `${Pr}--${t.intent}`), n.setAttribute(Sr, "true"), t.castingCheck && Or(n, Su(t.castingCheck), r.pendingId, "casting"), _u(t) && Or(n, Iu(t), r.pendingId, "effect"), Du(n, t), vu(n, t, r), Fu(n, t), e.append(n);
}
function _u(e) {
  return e.intent !== "casting";
}
function Su(e) {
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
function Iu(e) {
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
function Or(e, t, r, n) {
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
  Eu(o, t), Mu(o, t.detailRows, r, n, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Eu(e, t) {
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-roll`);
  const n = document.createElement("span");
  n.classList.add(`${p}__workflow-roll-formula`), n.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${p}__workflow-roll-total`), o.textContent = String(t.total), r.append(n, o);
  const a = Pu(t.formula, t.diceBreakdown);
  a && r.append(a), e.append(r);
}
function Pu(e, t) {
  const r = Lu(t);
  if (r.length === 0) return null;
  const n = document.createElement("div");
  n.classList.add(`${p}__workflow-dice-tray`);
  for (const o of Nu(r, e)) {
    const a = document.createElement("span");
    a.classList.add(`${p}__workflow-die`), o.active || a.classList.add(`${p}__workflow-die--inactive`), a.textContent = String(o.value), n.append(a);
  }
  return n;
}
function Lu(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((n) => Number(n.trim())).filter((n) => Number.isFinite(n)).map((n) => Math.trunc(n)) : [];
}
function Nu(e, t) {
  if (e.length <= 1) return e.map((n) => ({ value: n, active: !0 }));
  const r = t.toLowerCase();
  return r.includes("kh") ? Mr(e, "highest") : r.includes("kl") ? Mr(e, "lowest") : e.map((n) => ({ value: n, active: !0 }));
}
function Mr(e, t) {
  const r = t === "highest" ? Math.max(...e) : Math.min(...e);
  let n = !1;
  return e.map((o) => {
    const a = !n && o === r;
    return a && (n = !0), { value: o, active: a };
  });
}
function Du(e, t) {
  const r = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(vd);
  if (r.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__roll-meta`);
  for (const o of r) {
    const a = document.createElement("span");
    a.classList.add(`${p}__roll-meta-pill`), a.textContent = o, n.append(a);
  }
  e.append(n);
}
function vu(e, t, r) {
  if (!t.resistance) return;
  const n = document.createElement("div");
  n.classList.add(`${p}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${p}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = Ou(t, r);
  o.append(a), s && o.append(s);
  const i = document.createElement("span");
  i.classList.add(`${p}__resistance-description`), i.textContent = t.resistance, n.append(o, i), t.resistanceRollResult && n.append(eo(t.resistanceRollResult)), e.append(n);
}
function Ou(e, t) {
  if (!e.resistanceSkill) return null;
  const r = document.createElement("button");
  if (r.type = "button", r.classList.add(`${p}__resistance-roll-button`), r.setAttribute(ve, t.pendingId), r.setAttribute(Hn, "true"), r.setAttribute(Vn, e.resistanceSkill), r.setAttribute(Gn, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && r.setAttribute(zn, t.resistanceTargetActorId), t.resistanceTargetName && r.setAttribute(Wn, t.resistanceTargetName), e.resistanceRollResult)
    return r.classList.add(`${p}__resistance-roll-button--rolled`), r.setAttribute(Kn, String(e.resistanceRollResult.total)), r.textContent = String(e.resistanceRollResult.total), r.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, r.setAttribute("aria-label", r.title), r;
  const n = document.createElement("i");
  n.classList.add("fa-solid", "fa-dice-d20"), n.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${p}__resistance-roll-fallback`), o.textContent = "d20", r.append(n, o), r.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, r.setAttribute("aria-label", r.title), r;
}
function eo(e) {
  const t = document.createElement("span");
  return t.classList.add(`${p}__resistance-roll-result`), t.textContent = oo(e), t;
}
function Mu(e, t, r, n, o) {
  const a = t.filter((g) => g.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${r}-roll-details-${n}`, i = document.createElement("button");
  i.type = "button", i.classList.add(`${p}__roll-detail-toggle`), i.setAttribute(Et, s), i.setAttribute("aria-expanded", "false"), i.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${p}__roll-detail-list`), d.setAttribute(qn, s), d.hidden = !0;
  for (const g of a) {
    const y = document.createElement("dt");
    y.textContent = g.label;
    const b = document.createElement("dd");
    b.textContent = g.value, d.append(y, b);
  }
  e.append(i, d);
}
function Fu(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${p}__workflow-notes`);
  for (const n of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = n, r.append(o);
  }
  e.append(r);
}
function xu(e, t) {
  const r = `[${$r}="${ne(t.id)}"]`, n = e.querySelector(r);
  if (n)
    return n;
  const o = document.createElement("div");
  o.classList.add(lu), o.setAttribute($r, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${p}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function Uu(e) {
  const t = e.actionSectionId?.trim(), r = e.actionSectionTitle?.trim();
  if (t && r)
    return { id: t, title: r };
  const n = so(e.summaryLines ?? [], e);
  return n?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : n?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Bu(e, t) {
  if (t.length === 0) return;
  const r = ju(e);
  for (const n of t) {
    const o = Od(n);
    if (r.querySelector(`[${_r}="${ne(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = n, a.setAttribute(_r, o), r.append(a);
  }
}
function ju(e) {
  const t = e.querySelector(`.${Er}`);
  if (t)
    return t;
  const r = document.createElement("ul");
  return r.classList.add(Er), e.append(r), r;
}
function qu(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${p}__button`), t.setAttribute(ve, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Qn), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Oe, e.pendingId), t.setAttribute(It, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(at, e.choiceGroupId), t.setAttribute(jn, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Hu(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", r = Vu(e);
  return `${t} → ${r}`;
}
function Vu(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Gu(e) {
  return to(e) ?? e;
}
function to(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function ro(e, t) {
  const r = Fe(e);
  if (!r) return;
  const n = r.querySelectorAll(su);
  for (const o of n)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      ad(o, t);
    }));
}
function lt(e) {
  const t = Fe(e);
  if (!t) return;
  const r = t.querySelectorAll(iu);
  for (const n of r)
    n.dataset.paranormalToolkitRollDetailsBound !== "true" && (n.dataset.paranormalToolkitRollDetailsBound = "true", n.addEventListener("click", () => {
      zu(t, n);
    }));
}
function ut(e) {
  const t = Fe(e);
  if (!t) return;
  const r = t.querySelectorAll(cu);
  for (const n of r)
    n.dataset.paranormalToolkitResistanceRollBound !== "true" && (n.dataset.paranormalToolkitResistanceRollBound = "true", n.addEventListener("click", () => {
      Wu(t, n);
    }));
}
function zu(e, t) {
  const r = t.getAttribute(Et);
  if (!r) return;
  const n = e.querySelector(`[${qn}="${ne(r)}"]`);
  if (!n) return;
  const o = n.hidden;
  n.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Wu(e, t) {
  const r = t.getAttribute(ve), n = t.getAttribute(Vn), o = t.getAttribute(Gn) ?? (n ? xn(n) : "Resistência");
  if (!r || !n) return;
  const a = Qu(e, r), s = Xu(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const i = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Jl(s, n);
    await rd(d.roll);
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
    Ku(t, g), Yu(t, g), nd(r, g), await od(e, r, g);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = i;
  } finally {
    t.disabled = !1;
  }
}
function Ku(e, t) {
  e.classList.add(`${p}__resistance-roll-button--rolled`), e.setAttribute(Kn, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Yu(e, t) {
  const r = e.closest(`.${p}__resistance`);
  if (!r) return;
  const n = r.querySelector(`.${p}__resistance-roll-result`), o = n ?? eo(t);
  if (n) {
    n.textContent = oo(t);
    return;
  }
  r.append(o);
}
function Qu(e, t) {
  const r = E.get(t);
  if (r) return r;
  const n = Me(e);
  return M(n)[t] ?? null;
}
function Xu(e, t) {
  const r = e?.resistanceTargetActor;
  if (D(r)) return r;
  const o = e?.context?.targets.map(dt).find(D) ?? null;
  if (o) return o;
  const a = t.getAttribute(zn) ?? e?.resistanceTargetActorId ?? null, s = a ? Ju(a) : null;
  return s || ed(
    t.getAttribute(Wn) ?? e?.resistanceTargetName ?? Zu(t)
  );
}
function Zu(e) {
  const r = e.closest(`.${p}`)?.querySelector(`.${Yn}`)?.textContent ?? null;
  if (!r) return null;
  const n = "→";
  if (!r.includes(n)) return null;
  const o = r.split(n), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function dt(e) {
  const t = e.actor;
  if (D(t)) return t;
  const r = e.token, n = fe(r);
  if (n) return n;
  const o = e.document;
  return fe(o);
}
function fe(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (D(t)) return t;
  const r = e.document?.actor;
  return D(r) ? r : null;
}
function Ju(e) {
  const r = game.actors?.get?.(e);
  return D(r) ? r : no().map((a) => fe(a)).find((a) => a?.id === e) ?? null;
}
function ed(e) {
  const t = Z(e);
  if (!t) return null;
  const r = no().filter((a) => Z(td(a)) === t).map((a) => fe(a)).find(D) ?? null;
  if (r) return r;
  const o = game.actors?.find?.((a) => D(a) && Z(a.name) === t);
  return D(o) ? o : null;
}
function no() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function td(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : fe(e)?.name ?? null;
}
function Z(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function D(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function oo(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function rd(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function nd(e, t) {
  const r = E.get(e);
  r && (r.resistanceRollResult = t);
}
async function od(e, t, r) {
  const n = Me(e);
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
function Me(e) {
  const r = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!r) return null;
  const n = game.messages;
  return O(n?.get?.(r));
}
async function ad(e, t) {
  const r = e.getAttribute(Oe);
  if (!r) return;
  e.disabled = !0;
  const n = e.textContent;
  if (e.textContent = "Aplicando...", await t(r)) {
    ao(e, e.getAttribute(It) ?? "✓ Automação aplicada"), sd(e);
    return;
  }
  e.disabled = !1, e.textContent = n;
}
function ao(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Qn), e.removeAttribute(Oe), e.removeAttribute(It);
}
function sd(e) {
  const t = e.getAttribute(at);
  if (!t) return;
  const r = e.closest(`.${p}`) ?? e.parentElement;
  if (!r) return;
  const n = `[${at}="${ne(t)}"]`;
  for (const o of r.querySelectorAll(n)) {
    if (o === e) continue;
    const a = o.getAttribute(jn) ?? "✓ Outra opção escolhida";
    ao(o, a);
  }
}
function so(e, t) {
  const r = e.map(Lt).filter(Nd), n = r.find((f) => f.intent !== "casting") ?? r[0] ?? null;
  if (!n) return null;
  const o = $(e, "Forma"), a = $(e, "Custo"), s = $(e, "Dados") ?? $(e, `Dados (${n.label})`), i = $(e, "Tipo"), d = $(e, "Resistência"), g = $(e, "Resistência Perícia"), y = $(e, "Resistência Rótulo") ?? (g ? xn(g) : null), b = io(e, "Observação"), k = e.filter((f) => ld(f, n)), R = id(e);
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
    notes: b,
    details: k,
    castingCheck: R,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function id(e) {
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
    intent: cd(r)
  } : null;
}
function cd(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function $(e, t) {
  return io(e, t)[0] ?? null;
}
function io(e, t) {
  const r = `${t}:`;
  return e.flatMap((n) => {
    if (!n.startsWith(r)) return [];
    const o = n.slice(r.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function ld(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Lt(e) ? !1 : e.trim().length > 0;
}
function ud(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of E.values())
    mt(n, e, t) && r.set(n.pendingId, n);
  for (const n of gd(e))
    mt(n, e, t) && !r.has(n.pendingId) && r.set(n.pendingId, n);
  return Array.from(r.values()).sort((n, o) => n.createdAt - o.createdAt);
}
function mt(e, t, r) {
  const n = B(t) ?? r.dataset.messageId ?? null;
  return e.messageId ? e.messageId === n : !e.itemId || !Fr(r, "itemId", e.itemId) ? !1 : !e.actorId || Fr(r, "actorId", e.actorId);
}
function Fr(e, t, r) {
  if (e.dataset[t] === r)
    return !0;
  const n = `data-${Md(t)}`;
  for (const o of e.querySelectorAll(`[${n}]`))
    if (o.getAttribute(n) === r)
      return !0;
  return !1;
}
function dd(e) {
  const t = ne(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function md(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (mt(e, null, t))
      return t;
  return null;
}
function fd() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [r, n] of E.entries())
    e - n.createdAt > t && E.delete(r);
}
async function xr(e, t) {
  const r = Me(e);
  if (!r) return !1;
  try {
    const n = M(r);
    return n[t.pendingId] = vt(t, B(r)), await re(r, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", n), !1;
  }
}
async function Nt(e) {
  const t = mo(e);
  if (!t) return !1;
  try {
    const r = M(t);
    return r[e.pendingId] = vt(e, B(t)), await re(t, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", r), !1;
  }
}
function co(e) {
  for (const t of du)
    globalThis.setTimeout(() => {
      ft(e);
    }, t);
}
async function ft(e) {
  const t = mo(e);
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
async function pd(e, t) {
  const r = uo(e.context.message);
  if (r)
    try {
      const n = M(r), o = n[e.pendingId] ?? vt(e, B(r));
      n[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await re(r, n);
    } catch (n) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", n);
    }
}
function gd(e) {
  return Object.values(M(O(e))).filter(ye);
}
function M(e) {
  if (!e) return {};
  const t = {}, r = Dt(e);
  for (const n of r?.prompts ?? [])
    t[n.pendingId] = n;
  for (const [n, o] of Object.entries(lo(e)))
    t[n] ??= o;
  return t;
}
function hd(e) {
  return Object.values(lo(O(e))).filter(ye);
}
function lo(e) {
  if (!e) return {};
  const t = e.getFlag?.(l, Un);
  if (!J(t))
    return {};
  const r = {};
  for (const [n, o] of Object.entries(t))
    ye(o) && (r[n] = o);
  return r;
}
async function re(e, t) {
  typeof e.setFlag == "function" && (await Ad(e, t), await yd(e, t));
}
async function yd(e, t) {
  await Promise.resolve(e.setFlag?.(l, Un, t));
}
function Dt(e) {
  if (!e) return null;
  const t = e.getFlag?.(l, Bn);
  return Pd(t) ? t : null;
}
async function Ad(e, t) {
  if (typeof e.setFlag != "function") return;
  const r = Object.values(t).filter(ye).sort((a, s) => a.createdAt - s.createdAt);
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
      actorName: bd(n.summary),
      itemId: n.itemId,
      itemName: n.itemName
    },
    prompts: r
  };
  await Promise.resolve(e.setFlag(l, Bn, o));
}
function bd(e) {
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
function uo(e) {
  const t = O(e);
  if (t?.setFlag)
    return t;
  const r = Rd(e);
  if (r?.setFlag)
    return r;
  const n = B(e);
  if (!n) return null;
  const o = game.messages;
  return O(o?.get?.(n));
}
function Rd(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(O).find((r) => typeof r?.setFlag == "function") ?? null;
}
function mo(e) {
  const t = uo(e.context.message);
  if (t) return t;
  const r = e.messageId ? kd(e.messageId) : null;
  if (r) return r;
  const n = go().slice().reverse();
  return n.find((o) => Td(o, e)) ?? n.find((o) => wd(o, e)) ?? null;
}
function kd(e) {
  const t = game.messages;
  return O(t?.get?.(e));
}
function Td(e, t) {
  const r = B(e);
  if (t.messageId && r === t.messageId) return !0;
  if (!fo(e, t)) return !1;
  const o = po(e);
  return !t.actorId || !o || o === t.actorId;
}
function wd(e, t) {
  if (!$d(e, t)) return !1;
  const r = po(e);
  return t.actorId && r === t.actorId ? !0 : fo(e, t);
}
function fo(e, t) {
  const r = Z(Cd(e));
  if (!r) return !1;
  const n = Z(t.itemName);
  if (n && r.includes(n)) return !0;
  const o = Z(t.itemId);
  return !!(o && r.includes(o));
}
function Cd(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function po(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function $d(e, t) {
  const r = _d(e);
  return r === null ? !1 : Math.abs(r - t.createdAt) <= mu;
}
function _d(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const r = e._stats?.modifiedTime;
  return typeof r == "number" && Number.isFinite(r) ? r : null;
}
function O(e) {
  return e && typeof e == "object" ? e : null;
}
function ye(e) {
  return J(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && _(e.messageId) && _(e.itemId) && _(e.actorId) && _(e.itemName) && G(e.resistanceTargetActorId) && G(e.resistanceTargetName) && Ld(e.resistanceRollResult) && Sd(e.actionPayload) && ze(e.title) && ze(e.buttonLabel) && ze(e.executedLabel) && G(e.choiceGroupId) && G(e.skippedLabel) && G(e.actionSectionId) && G(e.actionSectionTitle) && Dd(e.summaryLines) : !1;
}
function Sd(e) {
  return e == null ? !0 : J(e) ? e.kind === "resource-operation" && _(e.actorId) && _(e.actorUuid) && typeof e.actorName == "string" && Id(e.resource) && Ed(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Id(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Ed(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Pd(e) {
  return J(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && _(e.messageId) && J(e.source) && _(e.source.actorId) && _(e.source.actorName) && _(e.source.itemId) && _(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(ye) : !1;
}
function Ld(e) {
  return e == null ? !0 : J(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && G(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Nd(e) {
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
function G(e) {
  return e == null || typeof e == "string";
}
function Dd(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function vd(e) {
  return typeof e == "string" && e.length > 0;
}
function go() {
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
function B(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function Od(e) {
  return e.trim().toLowerCase();
}
function Md(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function ne(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Ur = 1e3;
class Fd {
  constructor(t, r, n, o) {
    this.workflow = t, this.resources = r, this.debugOutput = o, this.ritualAssistant = new gl(t, r, n);
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
      settings: Ht(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const r = Ht();
    if (r.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const n = gt(t.item);
    if (!n.ok) {
      if (n.error.reason === "missing-automation" && xd(t.item) && r.executionMode === "ask") {
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
    if (await yr(t), !t.actor) {
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
    const n = r.prompt.actionPayload, o = jd(n);
    if (!o)
      return ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${n.actorName} para aplicar a ação persistida.`), !1;
    const a = await $e(this.resources, o, n.resource, n.operation, n.amount);
    return a.ok ? (await hu(t), await yu(
      t,
      r.prompt.choiceGroupId,
      r.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (pu((t) => this.executePendingAutomation(t)), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, r) {
    if (this.ritualAssistant.canHandle(t, r)) {
      await this.handleAssistedRitual(t, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, r);
  }
  async handleGenericRitual(t) {
    if (await yr(t), !t.actor) {
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
    this.markExecution(t), await this.handleAssistedRitual(t, Ud(t.item));
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
        await this.registerCompletedRitualCard(t, n.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), u.info("Ritual assistido concluído sem ações pendentes.", W(n.workflowContext));
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
    await gu({
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
      }), await Nr({
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
        actionPayload: Bd(s)
      });
    }
    this.setAttempt(t, "pending", "ritual-assisted-actions", a), u.info("Ritual assistido preparado com ações pendentes.", W(r));
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
    }), await Nr({
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
    this.setAttempt(t, "completed"), u.info("Automação executada por uso normal de item.", W(o.value.context));
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
    const r = Date.now(), n = Br(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      r - s > Ur && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(n);
    return o !== void 0 && r - o <= Ur;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Br(t), Date.now());
  }
  setAttempt(t, r, n, o) {
    this.lastAttempt = Ke(t, r, n, o);
  }
}
function xd(e) {
  return e.type === "ritual";
}
function Ud(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function Bd(e) {
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
function jd(e) {
  const t = e.actorUuid ? qd(e.actorUuid) : null;
  if (ee(t)) return t;
  const r = e.actorId ? Hd(e.actorId) : null;
  return r || Vd(e.actorName);
}
function qd(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function Hd(e) {
  const r = game.actors?.get?.(e);
  if (ee(r)) return r;
  for (const n of ho()) {
    const o = Ot(n);
    if (o?.id === e) return o;
  }
  return null;
}
function Vd(e) {
  const t = We(e);
  if (!t) return null;
  for (const o of ho()) {
    const a = Gd(o);
    if (We(a) === t) {
      const s = Ot(o);
      if (s) return s;
    }
  }
  const n = game.actors?.find?.((o) => ee(o) && We(o.name) === t);
  return ee(n) ? n : null;
}
function ho() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Gd(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const r = e.document?.name;
  return typeof r == "string" ? r : Ot(e)?.name ?? null;
}
function Ot(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ee(t)) return t;
  const r = e.document?.actor;
  return ee(r) ? r : null;
}
function We(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ee(e) {
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
function Br(e) {
  const t = e.actor?.id ?? "no-actor", r = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${r}`;
}
function Ye() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class zd {
  constructor(t, r, n) {
    this.diagnostic = t, this.automationBinder = r, this.itemPatches = n;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const r = this.diagnostic.getApplicableEntries(t), n = [], o = [], a = ge(t);
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
class Wd {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const r = ge(t).map((i) => this.analyzeRitual(i)), n = r.filter(Te("upToDate")), o = r.filter(Te("available")), a = r.filter(Te("outdated")), s = r.filter(Te("unsupported"));
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
    const r = this.automationRegistry.findForItem(t)[0] ?? null, n = Kd(t);
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
      reason: Yd(n, r.preset)
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
    preset: e.match ? Pe(e.match.preset) : null,
    appliedPresetId: r?.presetId ?? null,
    appliedPresetVersion: r?.presetVersion ?? null,
    reason: e.reason
  };
}
function Kd(e) {
  const t = e.getFlag(l, "automation");
  return ht(t) ? t : null;
}
function Yd(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Te(e) {
  return (t) => t.status === e;
}
class Qd {
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
    const n = this.createWorkflowSummaryContent(t, r), o = W(t);
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
    const r = A(t.actorName), n = A(t.resource), o = A(jr(t)), a = A(Zd(t));
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
      (f) => `<li><strong>${A(f.id)}:</strong> ${A(f.formula)} = ${f.total} <em>(${A(Xd(f.intent))})</em>${f.damageType ? ` — ${A(f.damageType)}` : ""}</li>`
    ), g = t.ritualCosts.map(
      (f) => `<li><strong>${A(f.itemName)}:</strong> ${f.circle}º círculo — ${f.amount} ${A(f.resource)} (${A(Jd(f.source))})</li>`
    ), y = t.damageInstances.map(
      (f) => `<li><strong>${A(f.targetActorName)}:</strong> bruto ${f.rawAmount}${f.damageType ? ` ${A(f.damageType)}` : ""} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), b = t.healingInstances.map(
      (f) => `<li><strong>${A(f.targetActorName)}:</strong> bruto ${f.rawAmount} &rarr; final ${f.finalAmount} &rarr; aplicado ${f.appliedAmount}</li>`
    ), k = t.resourceTransactions.map(
      (f) => `<li><strong>${A(f.actorName)}:</strong> ${A(jr(f))} — ${f.before.value}/${f.before.max} &rarr; ${f.after.value}/${f.after.max}</li>`
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
          ${g.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${g.join("")}</ul>` : ""}
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
function Xd(e) {
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
function jr(e) {
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
function Zd(e) {
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
function Jd(e) {
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
function em() {
  const e = new si(), t = new tc(e), r = new li(), n = new fi(r), o = new Si(e), a = new Ei(), s = a.registerMany(Ko());
  if (!s.ok)
    throw new Error(s.error.message);
  const i = new Ii(), d = new $i(), g = Tc(), y = new mc(g), b = new Wd(a), k = new zd(b, i, d), R = new ac(), f = new Qd(R), oe = new oc(), ae = new Ji(t, n, f, oe), se = new nc(ae, oe), T = new Fd(se, t, n, R);
  return T.addStrategy(new wi((F) => T.handleItemUsed(F))), {
    ordem: o,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: n,
    resources: t,
    automationRegistry: a,
    automationBinder: i,
    itemPatches: d,
    conditionRegistry: g,
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
const { ApplicationV2: tm } = foundry.applications.api;
class Ie extends tm {
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
      ${r.length > 0 ? rm(r) : om(t)}
    </section>
  `;
}
function rm(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(nm).join("")}</ol>`;
}
function nm(e) {
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
function om(e) {
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
const Ee = `${l}.manageRitualPresets`, qr = `__${l}_ritualPresetHeaderControlRegistered`, am = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function sm(e) {
  const t = globalThis;
  if (!t[qr]) {
    for (const r of am)
      Hooks.on(r, (n, o) => {
        im(n, o, e);
      });
    t[qr] = !0, u.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function im(e, t, r) {
  Array.isArray(t) && lm(e) && (cm(e, r), !t.some((n) => n.action === Ee) && t.push({
    action: Ee,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (n) => {
      n.preventDefault(), n.stopPropagation(), yo(e, r);
    }
  }));
}
function cm(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Ee] && (e.options.actions[Ee] = (r) => {
    r.preventDefault(), r.stopPropagation(), yo(e, t);
  }));
}
function lm(e) {
  if (!game.user?.isGM) return !1;
  const t = Ao(e);
  return t ? t.type === "agent" && ge(t).length > 0 : !1;
}
function yo(e, t) {
  const r = Ao(e);
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
function Ao(e) {
  return Hr(e.actor) ? e.actor : Hr(e.document) ? e.document : null;
}
function Hr(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let Y = null;
Hooks.once("init", () => {
  Go(), pa(), Ba(), ai(), u.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!zt.isSupportedSystem()) {
    u.warn(
      `Sistema não suportado: ${zt.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Y = em(), Y.itemUseIntegration.registerStrategies(), _a(Y), Fa(), Da(), sm(Y), u.info("Inicializado para o sistema Ordem Paranormal."), u.info(`API de debug disponível em globalThis["${l}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${pt} inicializado.`);
});
function um() {
  if (!Y)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Y;
}
export {
  um as getToolkitServices
};
//# sourceMappingURL=main.js.map
