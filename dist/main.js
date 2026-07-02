const u = "paranormal-toolkit", Jn = "Paranormal Toolkit", cl = "ordemparanormal";
class je {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Rt(e) {
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
class m {
  static info(t, ...n) {
    console.log(`${u} | ${t}`, ...n);
  }
  static warn(t, ...n) {
    console.warn(`${u} | ${t}`, ...n);
  }
  static error(t, ...n) {
    console.error(`${u} | ${t}`, ...n);
  }
}
function _(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function kt(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : er(t) ? _(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function ul(e) {
  return er(e.getFlag(u, "automation"));
}
function er(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && ml(t.source) && dl(t.definition);
}
function dl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(fl) && (t.conditionApplications === void 0 || yl(t.conditionApplications));
}
function ml(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function fl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return pl(t);
    case "spendRitualCost":
      return gl(t);
    case "rollFormula":
      return hl(t);
    case "modifyResource":
      return _l(t);
    case "chatCard":
      return bl(t);
    default:
      return !1;
  }
}
function pl(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ea(t);
}
function gl(e) {
  return e.type === "spendRitualCost";
}
function hl(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || wl(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function _l(e) {
  const t = e;
  return t.type === "modifyResource" && Ia(t.actor) && Rl(t.resource) && kl(t.operation) && Ea(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function bl(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function yl(e) {
  return Array.isArray(e) && e.every(Al);
}
function Al(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && Ia(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || Tl(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel));
}
function Tl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || El(t.rounds)) && (t.expiry === void 0 || t.expiry === null || $l(t.expiry));
}
function $l(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Ea(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function Ia(e) {
  return e === "self" || e === "target";
}
function Rl(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function kl(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function wl(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function El(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function tr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(qr);
    if (Sl(t))
      return Array.from(t).filter(qr);
  }
  return [];
}
function Il(e) {
  return tr(e)[0] ?? null;
}
function Cl(e) {
  return tr(e).find(ul) ?? null;
}
function Sl(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function qr(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ve(e) {
  return tr(e).filter((t) => t.type === "ritual");
}
function Ca(e) {
  return Ve(e)[0] ?? null;
}
function Ll(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Rt);
      return m.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Ne("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = Ze(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(jr);
      return m.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Ne("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = Ze(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await pn(e, r, o.value);
      m.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Ne("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = Ze(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        m.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await pn(e, n, r.preset);
      m.info(`Melhor preset aplicado em ${n.name}.`, { match: jr(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Gr(e);
    },
    async applyBestPresetsToActorRituals() {
      return Gr(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Ne("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = Ze(t);
      n && (await e.automationBinder.clear(n), m.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Gr(e) {
  const t = Ne("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Ve(t);
  if (n.length === 0)
    return m.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), zr(t);
  const r = zr(t, n.length);
  for (const o of n) {
    const a = e.automationRegistry.findForItem(o)[0];
    if (!a) {
      r.skipped.push({
        itemId: o.id ?? null,
        itemName: o.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await pn(e, o, a.preset);
    r.applied.push(Dl(o, a, s));
  }
  return m.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Pl(r), r;
}
async function pn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Dl(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Rt(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function zr(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Pl(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function jr(e) {
  return {
    preset: Rt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Ne(e) {
  const t = je.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Ze(e) {
  const t = Ca(e);
  return t || (m.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ie(e) {
  return e ? {
    id: e.id,
    source: {
      ...vl(e.sourceActor),
      token: e.sourceToken
    },
    item: Nl(e.item),
    targets: e.targets.map(xl),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: Vr(e.rollRequests, Sa),
    rolls: Vr(e.rolls, Ol),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(nr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function nr(e) {
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
function vl(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Nl(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function xl(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Sa(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Ol(e) {
  return {
    ...Sa(e),
    total: e.total
  };
}
function Vr(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function Ml(e) {
  return {
    getSelected() {
      return je.getSelectedActor();
    },
    logResources() {
      const t = X(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      m.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && m.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await fe(
        e,
        "Gasto de PE",
        X("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await fe(
        e,
        "Gasto de PD",
        X("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await fe(
        e,
        "Dano em PV",
        X("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await fe(
        e,
        "Cura de PV",
        X("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await fe(
        e,
        "Dano em SAN",
        X("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await fe(
        e,
        "Recuperação de SAN",
        X("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function fe(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    Fl(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (s) {
    m.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  m.info(`${t} realizado:`, nr(a));
}
function X(e) {
  const t = je.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Fl(e) {
  if (e.reason === "update-failed") {
    m.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    m.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  m.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const F = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Ul() {
  Xe(F.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), Xe(F.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), Xe(F.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), Xe(F.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function gn() {
  return {
    enabled: Je(F.enabled),
    console: Je(F.console),
    ui: Je(F.ui),
    chat: Je(F.chat)
  };
}
async function H(e, t) {
  await game.settings.set(u, F[e], t);
}
function Xe(e, t) {
  game.settings.register(u, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function Je(e) {
  return game.settings.get(u, e) === !0;
}
function Bl() {
  return {
    status() {
      return gn();
    },
    async enable() {
      await H("enabled", !0);
    },
    async disable() {
      await H("enabled", !1);
    },
    async enableConsole() {
      await H("console", !0);
    },
    async disableConsole() {
      await H("console", !1);
    },
    async enableUi() {
      await H("ui", !0);
    },
    async disableUi() {
      await H("ui", !1);
    },
    async enableChat() {
      await H("chat", !0);
    },
    async disableChat() {
      await H("chat", !1);
    }
  };
}
const La = "ritual.costOnly", Da = "ritual.simpleHealing", ql = "ritual.eletrocussao", Pa = "ritual.simpleDamage", va = "generic.simpleHealing", Na = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Gl() {
  return [
    zl(),
    jl(),
    Vl(),
    Hl(),
    Wl()
  ];
}
function zl() {
  return {
    id: La,
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
function jl() {
  return {
    id: Da,
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
    automation: xa(),
    itemPatch: Yl()
  };
}
function Vl() {
  return {
    id: ql,
    version: "1.4.1",
    label: "Eletrocussão",
    description: "Preset inicial de dano de eletricidade. Gasta o custo do ritual, rola 3d6/6d6/8d6 conforme a forma escolhida e prepara ações assistidas para aplicar dano via adapter do sistema e Vulnerável por 1 rodada no alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["eletrocussao", "eletrocucao"]
      }
    ],
    automation: Kl(),
    itemPatch: Ql()
  };
}
function Hl() {
  return {
    id: Pa,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: rr()
  };
}
function Wl() {
  return {
    id: va,
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
function xa(e = "2d8+2") {
  return Oa(
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
function Kl() {
  return {
    ...rr("3d6", {
      label: "Eletrocussão",
      title: "Eletrocussão",
      damageType: "electric",
      message: "Gasta o custo do ritual, rola dano de eletricidade e prepara aplicação de dano em PV do alvo pelo adapter do sistema. Resistência deve ser resolvida manualmente por enquanto."
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
    conditionApplications: [
      {
        id: "eletrocussao-vulnerable",
        actor: "target",
        conditionId: "vulnerable",
        label: "Vulnerável",
        duration: {
          rounds: 1
        },
        source: "ritual.eletrocussao",
        actionSectionId: "apply-effects",
        actionSectionTitle: "Aplicar efeito",
        executedLabel: "✓ Vulnerável aplicado"
      }
    ],
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
        notes: [
          "Se o alvo falhar na Fortitude, aplique Atordoado por 1 rodada manualmente."
        ]
      }
    }
  };
}
function rr(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Oa(
    {
      version: 1,
      label: n,
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
          title: r,
          message: a
        }
      ]
    },
    "damage",
    e
  );
}
function Yl() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Na,
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
function Ql() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Na,
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
function Oa(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function or() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ge(t.id),
    actorId: ge(t.actor?.id),
    sceneId: ge(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Ma() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: ge(e.id),
    actorId: ge(t?.id),
    sceneId: ge(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ge(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Zl(e) {
  return {
    logFirstRitualCost() {
      const t = J("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = ee(t);
      if (!n) return;
      const r = e.ritualCosts.getCost({ actor: t, ritual: n });
      if (!r.ok) {
        m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      m.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: n.name,
        cost: r.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${n.name} custa ${r.value.amount} ${r.value.resource} (${r.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, n = "PE") {
      const r = J("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = ee(r);
      if (o) {
        if (!ec(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(u, "ritual.cost", {
          resource: n,
          amount: t
        }), m.info(`Custo customizado aplicado em ${o.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = J("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = ee(t);
      n && (await n.unsetFlag(u, "ritual.cost"), m.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = J("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = ee(t);
      if (!n) return;
      const r = e.automationRegistry.require(La);
      if (!r.ok) {
        m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), m.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = J("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = ee(n);
      if (!r) return;
      if (!Hr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(Da);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: xa(t)
      }), m.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = J("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = ee(n);
      if (!r) return;
      if (!Hr(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require(Pa);
      if (!o.ok) {
        m.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: rr(t)
      }), m.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = J("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = ee(t);
      n && await Xl(e, t, n);
    }
  };
}
async function Xl(e, t, n) {
  const r = kt(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ma(),
    item: n,
    targets: or()
  });
  if (!o.ok) {
    Jl(o.error);
    return;
  }
  m.info("Automação de ritual executada com sucesso.", ie(o.value.context));
}
function Jl(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    m.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    m.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  m.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function J(e) {
  const t = je.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ee(e) {
  const t = Ca(e);
  return t || (m.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ec(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Hr(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const tc = ["strict", "open"], Fa = "strict";
function nc(e) {
  return tc.includes(e) ? e : Fa;
}
function Ua(e) {
  return !e.hasResistance || e.difficulty === null ? { kind: "none" } : e.resistanceTotal === null ? {
    kind: "pending",
    difficulty: e.difficulty
  } : e.resistanceTotal >= e.difficulty ? {
    kind: "succeeded",
    difficulty: e.difficulty,
    total: e.resistanceTotal
  } : {
    kind: "failed",
    difficulty: e.difficulty,
    total: e.resistanceTotal
  };
}
function He(e, t) {
  return e === "strict" && t.kind === "pending";
}
const rc = ["disabled", "ask", "automatic"], oc = ["buttons", "confirm"], Ba = "ask";
function ac(e) {
  return typeof e == "string" && rc.includes(e);
}
function ic(e) {
  return typeof e == "string" && oc.includes(e);
}
function sc(e) {
  return ac(e) ? e : ic(e) ? "ask" : Ba;
}
const lc = ["keep", "replace"], cc = ["manual", "assisted"], qa = "keep", Ga = "assisted", uc = !0, k = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function dc() {
  game.settings.register(u, k.executionMode, {
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
    default: Ba
  }), game.settings.register(u, k.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: qa
  }), game.settings.register(u, k.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: Ga
  }), game.settings.register(u, k.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: Fa
  }), game.settings.register(u, k.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: uc
  }), game.settings.register(u, k.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Wr() {
  const e = sc(game.settings.get(u, k.executionMode)), t = ja(game.settings.get(u, k.systemCardMode)), n = Va(game.settings.get(u, k.damageResolutionMode)), r = wt();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: za()
  };
}
function mc() {
  return ja(game.settings.get(u, k.systemCardMode));
}
function fc() {
  return Va(game.settings.get(u, k.damageResolutionMode));
}
function wt() {
  return nc(game.settings.get(u, k.resistanceGateMode));
}
function za() {
  return game.settings.get(u, k.ritualCastingCheckEnabled) === !0;
}
async function te(e) {
  await game.settings.set(u, k.executionMode, e);
}
function ja(e) {
  return lc.includes(e) ? e : qa;
}
function Va(e) {
  return cc.includes(e) ? e : Ga;
}
function pc(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await te("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await te("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await te(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await te("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await te("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await te("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await te("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const gc = [
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
function hc(e) {
  return {
    phases() {
      return gc;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Wt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = Cl(t);
      if (!n) {
        m.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Kr(e, t, n);
    },
    async runSelectedItemAutomation() {
      await this.runFirstAutomation();
    },
    async runItemAutomationByUuid(t) {
      if (!t || typeof t != "string") {
        ui.notifications?.warn("Paranormal Toolkit: UUID inválido.");
        return;
      }
      const n = await fromUuid(t);
      if (!yc(n)) {
        m.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = bc(n) ?? Wt("Nenhum ator encontrado para executar automação do item.");
      r && await Kr(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Wt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Il(t);
      if (!n) {
        m.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(va);
        if (!r.ok) {
          m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(n, r.value), m.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (r) {
        m.error("Falha ao configurar automação de teste no item.", r), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function Kr(e, t, n) {
  const r = kt(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Ma(),
    item: n,
    targets: or()
  });
  if (!o.ok) {
    _c(o.error);
    return;
  }
  m.info("Automação executada com sucesso.", ie(o.value.context));
}
function _c(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    m.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    m.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  m.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Wt(e) {
  const t = je.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function bc(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function yc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ac(e) {
  const t = Ml(e), n = Ll(e), r = Zl(e), o = hc(e), a = Bl(), s = pc(e);
  return {
    actor: t,
    automation: n,
    ritual: r,
    workflow: o,
    output: a,
    itemUseIntegration: s,
    getSelectedActor() {
      return t.getSelected();
    },
    logSelectedActorResources() {
      t.logResources();
    },
    async spendSelectedActorPE(l) {
      await t.spendPE(l);
    }
  };
}
function Tc(e) {
  return {
    list: () => e.listConditions(),
    get: (t) => {
      const n = e.getCondition(t);
      return n.ok ? n.value : null;
    },
    applyToActor: (t, n, r = {}) => e.applyCondition({
      actor: t,
      conditionId: n,
      duration: r.duration,
      originUuid: r.originUuid,
      source: r.source ?? "api.applyToActor",
      refreshExisting: r.refreshExisting
    }),
    removeFromActor: (t, n) => e.removeCondition({
      actor: t,
      conditionId: n
    }),
    applyToSelectedTokens: async (t, n = {}) => {
      const r = Yr();
      if (r.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const o = await Promise.all(
        r.map(
          (a) => e.applyCondition({
            actor: a,
            conditionId: t,
            duration: n.duration,
            originUuid: n.originUuid,
            source: n.source ?? "api.applyToSelectedTokens",
            refreshExisting: n.refreshExisting
          })
        )
      );
      return $c(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Yr();
      if (n.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para remover a condição."), [];
      const r = await Promise.all(
        n.map(
          (o) => e.removeCondition({
            actor: o,
            conditionId: t
          })
        )
      );
      return Rc(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Yr() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function $c(e) {
  let t = 0;
  for (const n of e) {
    if (n.ok) {
      t += 1, n.value.warning && ui.notifications?.warn(`Paranormal Toolkit: ${n.value.warning}`);
      continue;
    }
    ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
  }
  t > 0 && ui.notifications?.info(`Paranormal Toolkit: condição aplicada em ${t} ator(es).`);
}
function Rc(e) {
  let t = 0;
  for (const n of e) {
    if (n.ok) {
      t += n.value.removed;
      continue;
    }
    ui.notifications?.warn(`Paranormal Toolkit: ${n.error.message}`);
  }
  ui.notifications?.info(`Paranormal Toolkit: ${t} efeito(s) removido(s).`);
}
function kc(e) {
  const t = {
    services: e,
    ordem: e.ordem,
    resources: e.resources,
    damage: e.damage,
    ritualCosts: e.ritualCosts,
    automation: e.automation,
    automationRegistry: e.automationRegistry,
    automationBinder: e.automationBinder,
    workflow: e.workflow,
    itemUseIntegration: e.itemUseIntegration,
    conditions: Tc(e.conditions),
    debug: Ac(e)
  }, n = globalThis;
  return n[u] = t, n.ParanormalToolkit = t, t;
}
class Qr {
  static isSupportedSystem() {
    return game.system.id === cl;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function wc() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: he(t.id),
    actorId: he(t.actor?.id),
    sceneId: he(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Ha() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: he(e.id),
    actorId: he(t?.id),
    sceneId: he(e.scene?.id),
    name: n
  };
}
function Ec(e, t = Ha()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Ic(e) {
  if (!Lc(e)) return null;
  const t = e.getFlag(u, "workflow");
  return Sc(t) ? t : null;
}
function Cc() {
  return `flags.${u}.workflow`;
}
function Zr(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), n = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || n !== void 0;
}
function Xr(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return hn(t) || hn(n);
}
function Sc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Lc(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function he(e) {
  return hn(e) ? e : null;
}
function hn(e) {
  return typeof e == "string" && e.length > 0;
}
function Dc() {
  const e = (t, n) => {
    Pc(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Pc(e, t) {
  const n = Ic(e);
  if (!n || n.targets.length === 0) return;
  const r = Nc(t);
  if (!r || r.querySelector(`.${u}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(vc(n));
}
function vc(e) {
  const t = document.createElement("section");
  t.classList.add(`${u}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Jr("Origem", e.source.name)), t.append(Jr("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Jr(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${u}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function Nc(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function xc() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!Oc(r) || !Mc(e) || Zr(e) || Zr(t)) return;
    const o = wc();
    if (o.length === 0 || !Xr(e) && !Xr(t)) return;
    const a = Ha();
    e.updateSource({
      [Cc()]: Ec(o, a)
    }), m.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Oc(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Mc(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let eo = !1, Kt = !1, Yt = !1, et = null;
const Fc = 1e3, Uc = 750, Bc = 1e3;
function qc(e) {
  eo || (Hooks.on("combatTurnChange", (t) => {
    zc(e, to(t));
  }), Hooks.on("deleteCombat", (t) => {
    jc(e, to(t));
  }), eo = !0, Gc(e));
}
function Gc(e) {
  Et() && (Kt || (Kt = !0, globalThis.setTimeout(() => {
    Kt = !1, ar(e, "ready");
  }, Fc)));
}
function zc(e, t) {
  Et() && t && (et && globalThis.clearTimeout(et), et = globalThis.setTimeout(() => {
    et = null, ar(e, "combat-turn-change", t);
  }, Uc));
}
function jc(e, t) {
  Et() && t && (Yt || (Yt = !0, globalThis.setTimeout(() => {
    Yt = !1, ar(e, "combat-deleted", t);
  }, Bc)));
}
async function ar(e, t, n) {
  if (Et())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && m.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const o of r.failures)
        m.warn(o.message);
    } catch (r) {
      m.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function Et() {
  return game.user?.isGM === !0;
}
function to(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Wa = {
  enabled: "dice.animations.enabled"
};
function Vc() {
  game.settings.register(u, Wa.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Hc() {
  return {
    enabled: game.settings.get(u, Wa.enabled) === !0
  };
}
const It = "chatCard", no = "data-paranormal-toolkit-prompt-id", i = `${u}-item-use-prompt`, Wc = `.${i}__title`, Ka = `.${i}__header`, Kc = `.${i}__roll-card`, Yc = `.${i}__roll-meta`, Qc = `.${i}__roll-meta-pill`, Ct = `.${i}__resistance`, Zc = `.${i}__resistance-header`, Ya = `.${i}__resistance-description`, St = `.${i}__resistance-roll-button`, Qa = `.${i}__resistance-roll-result`, ro = `${i}__resistance-content`, Za = `.${i}__workflow-section`, Xa = `.${i}__workflow-roll`, ir = `${i}__workflow-roll--dice-open`, sr = `.${i}__workflow-roll-formula`, lr = `${i}__workflow-roll-formula--toggle`, Lt = `.${i}__workflow-dice-tray`, Xc = `.${i}__roll-detail-toggle`, Jc = `.${i}__roll-detail-list`, eu = `.${i}__ritual-element-badge`, tu = `.${i}__ritual-metadata`, nu = "casting-backlash", ru = "data-paranormal-toolkit-action-section", ou = "data-paranormal-toolkit-prompt-id", au = "data-paranormal-toolkit-pending-id", oo = "data-paranormal-toolkit-casting-backlash-enhanced", ao = `.${i}`, iu = `.${i}__workflow-section--casting`, su = `.${i}__workflow-section-header`, lu = `.${i}__workflow-notes`, cu = `[${ru}="${nu}"]`, io = `${i}__workflow-section-title-row`, uu = `${i}__workflow-section-header--casting-backlash`, Ja = `${i}__casting-backlash-button`;
function du(e) {
  for (const t of mu(e))
    fu(t), bu(t);
}
function mu(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(ao) && t.add(e);
  for (const n of e.querySelectorAll(ao))
    t.add(n);
  return Array.from(t);
}
function fu(e) {
  const t = e.querySelector(cu);
  if (!t) return;
  const n = pu(t);
  if (!n) return;
  const r = e.querySelector(`${iu} ${su}`);
  r && (r.classList.add(uu), gu(r), hu(n), r.append(n), t.remove());
}
function pu(e) {
  return e.querySelector(
    `button[${au}], button[${ou}]`
  );
}
function gu(e) {
  const t = e.querySelector(`:scope > .${io}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(io);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(Ja) || n.append(o));
  return n;
}
function hu(e) {
  if (e.getAttribute(oo) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = _u(t, e.disabled);
  e.classList.add(Ja), e.setAttribute(oo, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function _u(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function bu(e) {
  for (const t of e.querySelectorAll(lu)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function yu(e) {
  for (const t of Array.from(e.querySelectorAll(Za)))
    for (const n of Array.from(t.querySelectorAll(`${Xc}, ${Jc}`)))
      n.remove();
}
const xe = "data-paranormal-toolkit-prompt-id", Au = "data-paranormal-toolkit-resistance-roll-result", Tu = "Conjuração DT";
function ei(e) {
  const t = e.querySelector(St)?.getAttribute(Au), n = Be(t);
  if (n !== null) return n;
  const r = e.querySelector(Qa)?.textContent ?? null, o = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Be(o?.[1] ?? null);
}
function cr(e) {
  const t = Iu(e), n = ku(t);
  if (n !== null) return n;
  const r = wu(t);
  return r !== null ? r : Eu(e);
}
function $u(e) {
  const t = e.getAttribute(xe);
  if (!t) return null;
  const n = ti(e), r = ni(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => Dt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function Y(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Ru(e) {
  return Y(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function ku(e) {
  const t = Su(e);
  return t.length === 0 ? null : Be(Lu(t, Tu));
}
function wu(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : so(r, ["system", "ritual", "DT"]) ?? so(r, ["system", "ritual", "dt"]);
}
function Eu(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Be(n?.[1] ?? null);
}
function Iu(e) {
  const t = Cu(e);
  if (!t) return null;
  const n = ti(e), r = ni(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => Dt(a) ? a.pendingId === t : !1) ?? null;
}
function Cu(e) {
  return (e.closest(`[${xe}]`) ?? e.querySelector(`[${xe}]`) ?? e.parentElement?.querySelector(`[${xe}]`) ?? null)?.getAttribute(xe) ?? null;
}
function ti(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return Du(o) ? o : null;
}
function ni(e) {
  const t = e?.getFlag?.(u, It);
  return Dt(t) ? t : null;
}
function Su(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Lu(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const o = r.slice(n.length).trim();
    if (o.length > 0) return o;
  }
  return null;
}
function so(e, t) {
  let n = e;
  for (const r of t) {
    if (!Dt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Be(typeof n == "string" ? n : null);
}
function Be(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Du(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function Dt(e) {
  return !!(e && typeof e == "object");
}
const Pu = `.${i}__actions`, ur = `.${i}__actions-title`, ft = `.${i}__button`, vu = "data-paranormal-toolkit-action-section", Nu = `${i}__button--executed`, xu = "data-paranormal-toolkit-executed-label";
function ri(e) {
  return Y(e.querySelector(ur)?.textContent);
}
function Ou(e, t) {
  const n = e.querySelector(ur);
  n && (n.textContent = t);
}
function Pt(e, t) {
  const n = Y(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const o = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return Y(o) === n;
  }) ?? null;
}
function dr(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function ce(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const Mu = "data-paranormal-toolkit-damage-resolution-state", lo = "data-paranormal-toolkit-damage-icon-enhanced", oi = "data-paranormal-toolkit-damage-original-label", Fu = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
};
function Uu(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Ou(t, "Aplicar dano"), Bu(e, t);
}
function Bu(e, t) {
  const n = Array.from(t.querySelectorAll(ft)), r = co(n, "normal"), o = co(n, "half");
  if (!r || !o) {
    t.classList.add(`${i}__actions--compact`);
    return;
  }
  uo(r, "normal"), uo(o, "half");
  const a = ju(), s = Vu(), l = qu(e), c = He(s, l);
  if (t.classList.toggle(`${i}__actions--assisted`, a === "assisted"), t.classList.toggle(`${i}__actions--manual`, a !== "assisted"), a !== "assisted") {
    W(r, !0), W(o, !0), ne(r, !c, "normal"), ne(o, !c, "half"), tt(
      t,
      c ? "pending" : "manual",
      c ? "Role resistência para aplicar dano." : null
    );
    return;
  }
  if (l.kind === "none") {
    W(r, !0), W(o, !0), ne(r, !0, "normal"), ne(o, !0, "half"), tt(t, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }
  if (l.kind === "pending") {
    W(r, !0), W(o, !1), ne(r, !c, "normal"), tt(
      t,
      "pending",
      c ? "Role resistência para aplicar dano." : null
    );
    return;
  }
  const d = l.kind === "succeeded";
  W(r, !d), W(o, d), ne(r, !d, "normal"), ne(o, d, "half"), tt(
    t,
    d ? "resisted" : "failed",
    d ? `Resistiu: ${l.total} vs DT ${l.difficulty}.` : `Falhou: ${l.total} vs DT ${l.difficulty}.`
  );
}
function qu(e) {
  return Ua({
    hasResistance: !!e.querySelector(Ct),
    difficulty: cr(e),
    resistanceTotal: ei(e)
  });
}
function co(e, t) {
  const n = Fu[t];
  return e.find((r) => n.test(r.textContent ?? "")) ?? null;
}
function uo(e, t) {
  if (e.getAttribute(lo) === "true") return;
  const n = e.textContent?.trim() ?? "";
  if (!n || n.startsWith("✓")) return;
  const r = document.createElement("i");
  r.classList.add(
    "fa-solid",
    t === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), r.setAttribute("aria-hidden", "true"), e.classList.add(
    `${i}__button--damage-resolution-action`,
    `${i}__button--damage-resolution-${t}`
  ), e.setAttribute(lo, "true"), e.setAttribute(oi, n), e.setAttribute("aria-label", n), e.replaceChildren(r, ce(n));
}
function W(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function ne(e, t, n) {
  if (!e.textContent?.trim().startsWith("✓")) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", "Role resistência para aplicar dano"), e.replaceChildren(ce("Role resistência"));
      return;
    }
    e.removeAttribute("aria-disabled"), Gu(e, n);
  }
}
function Gu(e, t) {
  const n = e.getAttribute(oi) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(zu(t), ce(n)));
}
function zu(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function tt(e, t, n) {
  e.setAttribute(Mu, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const o = r ?? document.createElement("span");
  o.classList.add(`${i}__damage-resolution-summary`), o.textContent = n, r || e.querySelector(ur)?.after(o);
}
function ju() {
  try {
    return fc();
  } catch {
    return "assisted";
  }
}
function Vu() {
  try {
    return wt();
  } catch {
    return "strict";
  }
}
const qe = "data-paranormal-toolkit-effect-icon-enhanced", ke = "data-paranormal-toolkit-effect-action-compacted", vt = "data-paranormal-toolkit-effect-resistance-gate", mr = "data-paranormal-toolkit-effect-section", fr = "data-paranormal-toolkit-effect-label";
function Hu(e) {
  return e.querySelector(`[${mr}="true"]`);
}
function Wu(e) {
  const t = Yu(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? Qu(), r = ad(n, e.sourceActions, t);
  return r && n.setAttribute(fr, r), Zu(n, t, r), rd(e.rollCard, n, e.after ?? e.fallbackAfter), od(e.sourceActions, n), n;
}
function Ku(e, t) {
  const n = t.querySelector(ft);
  if (!n) return;
  const r = n.textContent?.trim() ?? "";
  if (ii(n, r)) {
    sd(n);
    return;
  }
  const o = si(t, n, r), a = ld(e);
  if (a.kind === "none") {
    pr(n), Nt(n, o);
    return;
  }
  if (a.kind === "pending") {
    if (He(fd(), a)) {
      cd(n);
      return;
    }
    dd(n, o);
    return;
  }
  if (a.kind === "succeeded") {
    ud(n);
    return;
  }
  md(n, o);
}
function Yu(e) {
  return e.sourceActions?.querySelector(ft) ?? e.existingSection?.querySelector(ft) ?? null;
}
function Qu() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(mr, "true"), e;
}
function Zu(e, t, n) {
  e.setAttribute(mr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = Xu(e), o = Ju(r);
  o.textContent = "Efeito";
  const a = ed(e, r), s = td(a);
  s.textContent = pd(n ?? si(e, t, t.textContent?.trim() ?? ""));
  const l = nd(a);
  t.parentElement !== l && l.append(t);
  const c = t.textContent?.trim() ?? "";
  !ii(t, c) && !id(t, c) && Nt(t, n ?? c);
}
function Xu(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function Ju(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function ed(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function td(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function nd(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function rd(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function od(e, t) {
  !e || e === t || e.remove();
}
function ad(e, t, n) {
  const r = e.getAttribute(fr);
  if (r && r.trim().length > 0) return r.trim();
  const o = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return o || ai(n, n.textContent?.trim() ?? "");
}
function ai(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && Y(n) !== "efeito aplicado") return n;
  const r = $u(e);
  if (r) return r;
  const o = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return o.length > 0 && Y(o) !== "aplicado" ? o : null;
}
function ii(e, t) {
  return e.classList.contains(Nu) || Y(t).includes("aplicado");
}
function id(e, t) {
  const n = e.getAttribute(vt);
  if (n === "pending" || n === "resisted") return !0;
  const r = Ru(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function Nt(e, t) {
  e.getAttribute(ke) === "true" && e.getAttribute(qe) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(ke, "true"), e.setAttribute(qe, "true"), e.setAttribute(xu, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    dr("✦", `${i}__button-icon--effect`),
    ce("Aplicar")
  ));
}
function sd(e) {
  e.getAttribute(ke) === "true" && Y(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(ke, "true"), e.setAttribute(qe, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    dr("✓", `${i}__button-icon--effect-applied`),
    ce("Aplicado")
  ));
}
function si(e, t, n) {
  const r = e.getAttribute(fr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : ai(t, n) ?? n;
}
function ld(e) {
  return Ua({
    hasResistance: !!e.querySelector(Ct),
    difficulty: cr(e),
    resistanceTotal: ei(e)
  });
}
function cd(e) {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(ke), e.removeAttribute(qe), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(vt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(ce("Role resistência"));
}
function ud(e) {
  e.disabled = !0, e.removeAttribute(ke), e.removeAttribute(qe), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(vt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    dr("✓", `${i}__button-icon--effect-resisted`),
    ce("Resistiu")
  );
}
function dd(e, t) {
  pr(e), Nt(e, t);
}
function md(e, t) {
  pr(e), Nt(e, t);
}
function pr(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(vt), e.removeAttribute("aria-disabled");
}
function fd() {
  try {
    return wt();
  } catch {
    return "strict";
  }
}
function pd(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const gd = {
  cutting: "cuttingDamage",
  impact: "impactDamage",
  piercing: "piercingDamage",
  ballistic: "ballisticDamage",
  blood: "bloodDamage",
  death: "deathDamage",
  knowledge: "knowledgeDamage",
  energy: "energyDamage",
  fear: "fearDamage",
  fire: "fireDamage",
  cold: "coldDamage",
  electric: "eletricDamage",
  chemical: "chemicalDamage",
  mental: "mentalDamage"
}, hd = new Set(
  Object.values(gd)
), _d = {
  generic: null,
  none: null,
  indefinido: null,
  semtipo: null,
  untyped: null,
  cutting: "cuttingDamage",
  corte: "cuttingDamage",
  cuttingdamage: "cuttingDamage",
  impact: "impactDamage",
  impacto: "impactDamage",
  impactdamage: "impactDamage",
  piercing: "piercingDamage",
  perfurante: "piercingDamage",
  perfuracao: "piercingDamage",
  perfuração: "piercingDamage",
  piercingdamage: "piercingDamage",
  ballistic: "ballisticDamage",
  balistico: "ballisticDamage",
  balístico: "ballisticDamage",
  ballisticdamage: "ballisticDamage",
  blood: "bloodDamage",
  sangue: "bloodDamage",
  blooddamage: "bloodDamage",
  death: "deathDamage",
  morte: "deathDamage",
  deathdamage: "deathDamage",
  knowledge: "knowledgeDamage",
  conhecimento: "knowledgeDamage",
  knowledgedamage: "knowledgeDamage",
  energy: "energyDamage",
  energia: "energyDamage",
  energydamage: "energyDamage",
  fear: "fearDamage",
  medo: "fearDamage",
  feardamage: "fearDamage",
  fire: "fireDamage",
  fogo: "fireDamage",
  firedamage: "fireDamage",
  cold: "coldDamage",
  frio: "coldDamage",
  colddamage: "coldDamage",
  electric: "eletricDamage",
  eletrico: "eletricDamage",
  elétrico: "eletricDamage",
  eletrica: "eletricDamage",
  elétrica: "eletricDamage",
  eletricidade: "eletricDamage",
  electricidade: "eletricDamage",
  electricdamage: "eletricDamage",
  eletricdamage: "eletricDamage",
  chemical: "chemicalDamage",
  quimico: "chemicalDamage",
  químico: "chemicalDamage",
  quimica: "chemicalDamage",
  química: "chemicalDamage",
  chemicaldamage: "chemicalDamage",
  mental: "mentalDamage",
  ment: "mentalDamage",
  mentaldamage: "mentalDamage"
};
function bd(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = yd(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = _d[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : hd.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function li(e) {
  switch (e) {
    case "cuttingDamage":
      return "Corte";
    case "impactDamage":
      return "Impacto";
    case "piercingDamage":
      return "Perfurante";
    case "ballisticDamage":
      return "Balístico";
    case "bloodDamage":
      return "Sangue";
    case "deathDamage":
      return "Morte";
    case "knowledgeDamage":
      return "Conhecimento";
    case "energyDamage":
      return "Energia";
    case "fearDamage":
      return "Medo";
    case "fireDamage":
      return "Fogo";
    case "coldDamage":
      return "Frio";
    case "eletricDamage":
      return "Eletricidade";
    case "chemicalDamage":
      return "Químico";
    case "mentalDamage":
      return "Mental";
    case null:
      return "Sem tipo";
  }
}
function yd(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class ci {
  async applyDamage(t) {
    const n = t.actor, r = n.name ?? "Ator sem nome", o = n.id ?? null;
    if (!Array.isArray(t.instances) || t.instances.length === 0)
      return p({
        actor: n,
        actorId: o,
        actorName: r,
        reason: "empty-damage",
        message: "Nenhuma instância de dano foi informada."
      });
    const a = n.applyDamage;
    if (typeof a != "function")
      return p({
        actor: n,
        actorId: o,
        actorName: r,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const s = [], l = /* @__PURE__ */ new Set();
    let c = null;
    for (const [d, f] of t.instances.entries()) {
      const y = Ad(f, d);
      if (!y.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const T = bd(f.damageType);
      if (!T.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(f.damageType)}.`,
          instance: f,
          damageType: f.damageType
        });
      if (y.amount === 0) {
        s.push(
          Td(y.id, f, T.value)
        );
        continue;
      }
      try {
        const $ = await Promise.resolve(
          a.call(n, y.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: f.ignoreResistance === !0,
            nonLethal: f.nonLethal === !0
          })
        );
        for (const V of Rd($.conditions))
          l.add(V);
        const g = $d($.newPV);
        g !== null && (c = g), s.push({
          id: y.id,
          label: f.label ?? li(T.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: mo($.finalDamage, y.amount),
          blocked: mo($.blocked, 0),
          damageType: f.damageType ? String(f.damageType) : null,
          systemDamageType: T.value,
          ignoreResistance: f.ignoreResistance === !0,
          nonLethal: f.nonLethal === !0
        });
      } catch ($) {
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: f,
          cause: $
        });
      }
    }
    return _({
      actor: n,
      actorId: o,
      actorName: r,
      totalRawDamage: s.reduce(
        (d, f) => d + f.inputAmount,
        0
      ),
      totalFinalDamage: s.reduce(
        (d, f) => d + f.finalDamage,
        0
      ),
      totalBlocked: s.reduce(
        (d, f) => d + f.blocked,
        0
      ),
      newPV: c,
      conditions: Array.from(l),
      instances: s,
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
function Ad(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Td(e, t, n) {
  return {
    id: e,
    label: t.label ?? li(n),
    sourceRollId: t.sourceRollId ?? null,
    inputAmount: 0,
    finalDamage: 0,
    blocked: 0,
    damageType: t.damageType ? String(t.damageType) : null,
    systemDamageType: n,
    ignoreResistance: t.ignoreResistance === !0,
    nonLethal: t.nonLethal === !0
  };
}
function mo(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function $d(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Rd(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class gr {
  async rollResistance(t) {
    const n = await wd(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? se(t.skill),
      roll: n,
      formula: Id(n),
      total: Cd(n),
      diceBreakdown: Sd(n)
    };
  }
  getSkillLabel(t) {
    return se(t);
  }
}
async function kd(e, t) {
  return new gr().rollResistance({ actor: e, skill: t });
}
function se(e) {
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
async function wd(e, t) {
  const n = e;
  if (typeof n.rollSkill != "function")
    return null;
  const r = await Promise.resolve(
    n.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return Ed(r);
}
function Ed(e) {
  return fo(e) ? e : Array.isArray(e) ? e.find(fo) ?? null : null;
}
function fo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Id(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Cd(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function Sd(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Ld);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function Ld(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class di {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class mi {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async rollResistance(t) {
    const n = t.skillLabel ?? this.adapter.getSkillLabel?.(t.skill) ?? t.skill, r = await this.adapter.rollResistance({ ...t, skillLabel: n });
    return {
      ...r,
      skill: r.skill || t.skill,
      skillLabel: r.skillLabel || n
    };
  }
  getSkillLabel(t) {
    return this.adapter.getSkillLabel?.(t) ?? t;
  }
}
function Dd(e, t) {
  const n = Fd(e?.rounds);
  if (!n)
    return po(null);
  const r = e?.anchor ?? fi(t);
  if (!r)
    return {
      ...po(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Pd(),
    start: {
      combat: r.combatId,
      combatant: r.combatantId,
      initiative: r.initiative,
      round: r.round,
      turn: r.turn,
      time: r.time
    },
    requestedRounds: n,
    combatDurationApplied: !0,
    combatId: r.combatId,
    startCombatantId: r.combatantId,
    startInitiative: r.initiative,
    startRound: r.round,
    startTurn: r.turn,
    expiryEvent: o,
    durationMode: "combatantTurn",
    warning: null
  };
}
function fi(e) {
  const t = Ud();
  if (!t?.id || !pi(t.round)) return null;
  const n = Od(t), r = vd(e, n) ?? xd(t), o = K(r?.id), a = qd(r?.initiative), s = Nd(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: s,
    initiative: a,
    time: Bd()
  };
}
function Pd() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function po(e) {
  return {
    duration: {},
    start: {},
    requestedRounds: e,
    combatDurationApplied: !1,
    combatId: null,
    startCombatantId: null,
    startInitiative: null,
    startRound: null,
    startTurn: null,
    expiryEvent: null,
    durationMode: "none",
    warning: null
  };
}
function vd(e, t) {
  return e?.id ? t.find((n) => Md(n) === e.id) ?? null : null;
}
function Nd(e, t, n) {
  const r = K(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return Gd(e.turn) ? e.turn : null;
}
function xd(e) {
  return it(e.combatant) ? e.combatant : null;
}
function Od(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(it);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(it);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(it);
  }
  return [];
}
function Md(e) {
  return K(e.actor?.id) ?? K(e.actorId) ?? K(e.token?.actor?.id) ?? K(e.token?.actorId) ?? K(e.document?.actor?.id) ?? K(e.document?.actorId);
}
function Fd(e) {
  return pi(e) ? Math.trunc(e) : null;
}
function Ud() {
  return game.combat ?? null;
}
function Bd() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function it(e) {
  return !!(e && typeof e == "object");
}
function K(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function qd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function pi(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Gd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class gi {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? _(n.value) : p({
      conditionId: t,
      reason: "condition-not-found",
      message: n.error.message
    });
  }
  async applyCondition(t) {
    const n = this.registry.get(t.conditionId);
    if (!n.ok)
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "condition-not-found",
        message: n.error.message
      });
    const r = t.actor;
    if (!Xd(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = Dd(t.duration, r), s = zd(o, t, a), c = t.refreshExisting ?? !0 ? Jd(r, o.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), _(go(r, o, c.id ?? null, !1, !0, a));
      } catch (d) {
        return p({
          actor: r,
          actorId: r.id ?? null,
          actorName: r.name ?? "Ator sem nome",
          conditionId: o.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
          cause: d
        });
      }
    try {
      const f = (await r.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return _(go(r, o, f, !0, !1, a));
    } catch (d) {
      return p({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: o.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
        cause: d
      });
    }
  }
  async removeCondition(t) {
    const n = t.actor;
    if (!n || typeof n != "object")
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: "Ator inválido para remover condição."
      });
    const r = this.resolveCanonicalConditionId(t.conditionId), o = _i(n, r);
    let a = 0;
    try {
      for (const s of o)
        await ho(n, s) === "deleted" && (a += 1);
    } catch (s) {
      return p({
        actor: n,
        actorId: n.id ?? null,
        actorName: n.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "delete-failed",
        message: `Falha ao remover condição ${t.conditionId} de ${n.name ?? "ator sem nome"}.`,
        cause: s
      });
    }
    return _({
      actor: n,
      actorId: n.id ?? null,
      actorName: n.name ?? "Ator sem nome",
      conditionId: r,
      removed: a
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = nm(), r = [];
    let o = 0, a = 0;
    for (const s of n) {
      const l = hr(s);
      o += l.length;
      for (const c of l) {
        if (!Hd(c, t)) continue;
        const d = hi(c);
        try {
          await ho(s, c) === "deleted" && (a += 1);
        } catch (f) {
          r.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: c.id ?? null,
            conditionId: d.conditionId,
            message: `Falha ao remover condição expirada ${d.conditionId ?? c.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
            cause: f
          });
        }
      }
    }
    return {
      reason: t.reason ?? "manual",
      scannedActors: n.length,
      scannedEffects: o,
      removedEffects: a,
      failures: r
    };
  }
}
function zd(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: mm(),
    requestedRounds: n.requestedRounds,
    combatDurationApplied: n.combatDurationApplied,
    combatId: n.combatId,
    startCombatantId: n.startCombatantId,
    startInitiative: n.startInitiative,
    startRound: n.startRound,
    startTurn: n.startTurn,
    expiryEvent: n.expiryEvent,
    durationMode: n.durationMode,
    deleteOnExpire: n.combatDurationApplied,
    expiresWithCombat: n.combatDurationApplied
  };
  return {
    name: e.label,
    icon: e.icon,
    img: e.icon,
    description: e.description,
    origin: t.originUuid ?? void 0,
    disabled: !1,
    transfer: !1,
    changes: e.changes.map((o) => ({ ...o })),
    duration: jd(n.duration),
    start: Vd(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [u]: r
    }
  };
}
function jd(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Vd(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: dm(),
    ...e
  };
}
function go(e, t, n, r, o, a) {
  return {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    conditionId: t.id,
    conditionLabel: t.label,
    effectId: n,
    created: r,
    refreshed: o,
    requestedRounds: a.requestedRounds,
    combatDurationApplied: a.combatDurationApplied,
    warning: a.warning
  };
}
function Hd(e, t) {
  const n = hi(e);
  if (!n.conditionId || !Wd(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = um();
  return n.durationMode === "combatantTurn" || Kd(n) ? Qd(n, r) : Yd(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !D(n.startRound) || !D(n.requestedRounds) || !D(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function Wd(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && D(e.requestedRounds);
}
function Kd(e) {
  return !!(e.combatDurationApplied && D(e.requestedRounds) && D(e.startRound) && (e.startCombatantId || pt(e.startTurn)));
}
function Yd(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Qd(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !D(e.startRound) || !D(e.requestedRounds) || !D(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Zd(t);
  return e.startCombatantId ? r === e.startCombatantId : pt(e.startTurn) && pt(t.turn) ? t.turn === e.startTurn : !1;
}
function Zd(e) {
  return _e(e.combatant?.id);
}
function hi(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: st(e, "conditionId"),
    requestedRounds: _o(e, "requestedRounds") ?? Oe(t.value) ?? Oe(t.rounds),
    combatDurationApplied: Qt(e, "combatDurationApplied"),
    combatId: st(e, "combatId") ?? _e(n.combat) ?? _e(t.combat),
    startCombatantId: st(e, "startCombatantId") ?? _e(n.combatant),
    startInitiative: im(e, "startInitiative") ?? bi(n.initiative),
    startRound: _o(e, "startRound") ?? Oe(n.round) ?? Oe(t.startRound),
    startTurn: am(e, "startTurn") ?? _n(n.turn) ?? _n(t.startTurn),
    expiryEvent: sm(e, "expiryEvent") ?? yi(t.expiry),
    durationMode: lm(e, "durationMode"),
    deleteOnExpire: Qt(e, "deleteOnExpire"),
    expiresWithCombat: Qt(e, "expiresWithCombat")
  };
}
function Xd(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Jd(e, t) {
  return _i(e, t)[0] ?? null;
}
function _i(e, t) {
  return hr(e).filter((n) => om(n) === t);
}
async function ho(e, t) {
  const n = t.id ?? null, r = n ? em(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (tm(o)) return "missing";
    throw o;
  }
}
function em(e, t) {
  return hr(e).find((n) => n.id === t) ?? null;
}
function tm(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function nm() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      nt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    nt(e, n);
  });
  for (const n of rm())
    nt(e, n.actor), nt(e, n.document?.actor);
  return Array.from(e.values());
}
function nt(e, t) {
  if (!cm(t)) return;
  const r = _e(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function rm() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function hr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function om(e) {
  return st(e, "conditionId");
}
function st(e, t) {
  return _e(ue(e, t));
}
function _o(e, t) {
  return Oe(ue(e, t));
}
function am(e, t) {
  return _n(ue(e, t));
}
function im(e, t) {
  return bi(ue(e, t));
}
function sm(e, t) {
  return yi(ue(e, t));
}
function lm(e, t) {
  const n = ue(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Qt(e, t) {
  return ue(e, t) === !0;
}
function ue(e, t) {
  const n = e.getFlag?.(u, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const o = r[u];
  if (!(!o || typeof o != "object"))
    return o[t];
}
function _e(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Oe(e) {
  return D(e) ? Math.trunc(e) : null;
}
function _n(e) {
  return pt(e) ? Math.trunc(e) : null;
}
function bi(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function yi(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function cm(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function um() {
  return game.combat ?? null;
}
function dm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function D(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function pt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function mm() {
  return game.user?.id ?? null;
}
const fm = "icons/svg/downgrade.svg", pm = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function b(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? fm,
    description: pm,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const gm = b({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), hm = b({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), _m = b({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), bm = b({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), ym = b({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Am = b({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Tm = b({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), $m = b({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Rm = b({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), km = b({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), wm = b({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Em = b({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Im = b({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Cm = b({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), Sm = b({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), Lm = b({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Dm = b({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Pm = b({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), vm = b({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), Nm = b({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), xm = b({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), Om = b({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Mm = b({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Fm = b({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Um = b({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Bm = b({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), qm = b({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Gm = b({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), zm = b({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), jm = b({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), Vm = b({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Hm = b({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Wm = b({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Km = b({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Ym = [
  gm,
  hm,
  _m,
  bm,
  ym,
  Am,
  Tm,
  $m,
  Rm,
  km,
  wm,
  Em,
  Im,
  Cm,
  Sm,
  Lm,
  Dm,
  Pm,
  vm,
  Nm,
  xm,
  Om,
  Mm,
  Fm,
  Um,
  Bm,
  qm,
  Gm,
  zm,
  jm,
  Vm,
  Hm,
  Wm,
  Km
];
class Qm {
  definitions = /* @__PURE__ */ new Map();
  lookup = /* @__PURE__ */ new Map();
  constructor(t) {
    for (const n of t) {
      this.definitions.set(n.id, n), this.registerLookup(n.id, n.id), this.registerLookup(n.label, n.id);
      for (const r of n.aliases ?? [])
        this.registerLookup(r, n.id);
    }
  }
  list() {
    return Array.from(this.definitions.values()).map(bo);
  }
  get(t) {
    const n = this.lookup.get(yo(t)), r = n ? this.definitions.get(n) : null;
    return r ? _(bo(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = yo(t);
    r && this.lookup.set(r, n);
  }
}
function Ai() {
  return new Qm(Ym);
}
function bo(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function yo(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
class Zm {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return He(t.resistanceGateMode, t.resistanceState) ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "resistance-pending",
        message: "Role a resistência do alvo antes de aplicar dano."
      }
    } : this.damage.applyDamage({
      actor: t.actor,
      instances: [
        {
          amount: t.amount,
          damageType: t.damageType,
          label: t.label,
          sourceRollId: t.sourceRollId ?? null,
          ignoreResistance: !1
        }
      ],
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
class Xm {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return He(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.resistanceState.kind === "succeeded" ? this.block(t, "resistance-succeeded", "Este alvo resistiu ao efeito.") : this.conditions.applyCondition({
      actor: t.actor,
      conditionId: t.conditionId,
      duration: t.duration ?? null,
      originUuid: t.originUuid ?? null,
      source: t.source ?? null
    });
  }
  block(t, n, r) {
    return {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: n,
        message: r
      }
    };
  }
}
class Jm {
  constructor(t) {
    this.resistance = t;
  }
  resistance;
  async execute(t) {
    return this.resistance.rollResistance({
      actor: t.actor,
      skill: t.skill,
      skillLabel: t.skillLabel
    });
  }
}
function ef(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const o = nf(e.formula, e.diceBreakdown ?? null);
  return o && t.append(o), t;
}
function tf(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function nf(e, t) {
  const n = rf(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const o of of(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-die`), o.active || a.classList.add(`${i}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function rf(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function of(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Ao(e, "highest") : n.includes("kl") ? Ao(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Ao(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
const rt = "data-paranormal-toolkit-prompt-id", Ti = "multiTargetResistanceResults", $i = "multiTargetDamageApplications", Ri = "multiTargetEffectApplications";
function af(e) {
  const t = /* @__PURE__ */ new Map(), r = xt(e)?.[Ti];
  if (!v(r)) return t;
  for (const [o, a] of Object.entries(r))
    ff(a) && a.targetId === o && t.set(o, a);
  return t;
}
async function sf(e, t) {
  await _r(e, Ti, t.targetId, t);
}
function lf(e) {
  const t = /* @__PURE__ */ new Map(), r = xt(e)?.[$i];
  if (!v(r)) return t;
  for (const [o, a] of Object.entries(r))
    pf(a) && a.targetId === o && t.set(o, a);
  return t;
}
async function cf(e, t) {
  await _r(
    e,
    $i,
    t.targetId,
    t
  );
}
function uf(e) {
  const t = /* @__PURE__ */ new Map(), r = xt(e)?.[Ri];
  if (!v(r)) return t;
  for (const [o, a] of Object.entries(r))
    hf(a) && a.targetId === o && t.set(o, a);
  return t;
}
async function df(e, t) {
  await _r(
    e,
    Ri,
    t.targetId,
    t
  );
}
function mf(e) {
  const t = xt(e);
  return t ? {
    actorId: Zt(t.actorId),
    itemId: Zt(t.itemId),
    itemName: Zt(t.itemName)
  } : null;
}
async function _r(e, t, n, r) {
  const o = ki(e);
  if (!o) return;
  const a = wi(e), s = Ei(a);
  if (!a || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((d) => {
    if (!v(d) || d.pendingId !== o) return d;
    const f = v(d[t]) ? d[t] : {};
    return l = !0, {
      ...d,
      [t]: {
        ...f,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(a.setFlag?.(u, It, {
    ...s,
    prompts: c
  }));
}
function xt(e) {
  const t = ki(e);
  if (!t) return null;
  const n = wi(e), r = Ei(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((a) => v(a) ? a.pendingId === t : !1) ?? null;
}
function ki(e) {
  return (e.closest(`[${rt}]`) ?? e.querySelector(`[${rt}]`) ?? e.parentElement?.querySelector(`[${rt}]`) ?? null)?.getAttribute(rt) ?? null;
}
function wi(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const o = game.messages?.get?.(n);
  return _f(o) ? o : null;
}
function Ei(e) {
  const t = e?.getFlag?.(u, It);
  return v(t) ? t : null;
}
function ff(e) {
  return v(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function pf(e) {
  return v(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && gf(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.finalDamage == "number" && Number.isFinite(e.finalDamage) && typeof e.blocked == "number" && Number.isFinite(e.blocked) && typeof e.appliedAt == "string" : !1;
}
function gf(e) {
  return e === "normal" || e === "half";
}
function hf(e) {
  return v(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function Zt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function _f(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function v(e) {
  return !!(e && typeof e == "object");
}
const Ii = "data-paranormal-toolkit-resistance-skill", Ci = "data-paranormal-toolkit-resistance-skill-label", bn = "data-paranormal-toolkit-multi-target-section", br = "data-paranormal-toolkit-multi-target-damage-info", Si = "data-paranormal-toolkit-multi-target-effect-info", Li = "data-paranormal-toolkit-multi-target-toggle", Di = "data-paranormal-toolkit-multi-target-details", L = "data-paranormal-toolkit-multi-target-target", bf = "data-paranormal-toolkit-multi-target-state", yn = "data-paranormal-toolkit-multi-target-roll-total", An = "data-paranormal-toolkit-multi-target-roll-formula", lt = "data-paranormal-toolkit-multi-target-roll-dice", Tn = "data-paranormal-toolkit-multi-target-roll-skill", $n = "data-paranormal-toolkit-multi-target-roll-skill-label", Rn = "data-paranormal-toolkit-multi-target-roll-target-name", kn = "data-paranormal-toolkit-multi-target-roll-rolled-at", wn = "data-paranormal-toolkit-multi-target-damage-mode", En = "data-paranormal-toolkit-multi-target-damage-input-amount", In = "data-paranormal-toolkit-multi-target-damage-final-amount", Cn = "data-paranormal-toolkit-multi-target-damage-blocked", Sn = "data-paranormal-toolkit-multi-target-damage-target-name", Ln = "data-paranormal-toolkit-multi-target-damage-applied-at", Dn = "data-paranormal-toolkit-multi-target-effect-condition-id", Pn = "data-paranormal-toolkit-multi-target-effect-condition-label", vn = "data-paranormal-toolkit-multi-target-effect-effect-id", Nn = "data-paranormal-toolkit-multi-target-effect-created", xn = "data-paranormal-toolkit-multi-target-effect-refreshed", On = "data-paranormal-toolkit-multi-target-effect-target-name", Mn = "data-paranormal-toolkit-multi-target-effect-applied-at", yf = new gi(Ai()), Af = new di(new ci()), Tf = new mi(new gr()), $f = new Jm(Tf), Rf = new Zm(Af), kf = new Xm(yf), Pi = "pending", z = "success", We = "failure", vi = "rolled";
function wf(e) {
  const t = Ni(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), Hf(e);
  const n = Wf(e.rollCard);
  Yf(n, t.damage), Zf(e.rollCard, n);
  const r = Xf(e.rollCard);
  if (Oi(r, t), Ap(e.rollCard, r, n), t.effect) {
    const o = Tp(e.rollCard);
    $p(o, t.effect), Rp(e.rollCard, o, r);
  } else
    Vi(e.rollCard)?.remove();
  return !0;
}
function Ni(e) {
  const t = xf(e.rollCard, e.damageSection), n = Of(e.rollCard), r = Mf(e.rollCard), o = Ff(e.rollCard), a = Ef(e.rollCard).map((s, l) => {
    const c = Cp(s, l), d = n.get(c) ?? null;
    return {
      id: c,
      name: s,
      state: Gf(d, t?.difficulty ?? null),
      resistanceResult: d,
      damageApplication: r.get(c) ?? null,
      effectApplication: o.get(c) ?? null
    };
  });
  return a.length <= 1 || !e.damageSection ? null : {
    rollCard: e.rollCard,
    targets: a,
    damage: If(e.damageSection),
    effect: Cf(e.rollCard, e.effectSection),
    resistance: t
  };
}
function Ef(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((o) => o.trim()).filter((o) => o.length > 0 && Wi(o) !== "nenhum alvo") : [];
}
function If(e) {
  const t = zf(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: Vf(e),
    formula: jf(e) ?? "—",
    total: t,
    diceBreakdown: tf(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Cf(e, t) {
  const n = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), r = Sf(e, n ?? null);
  return r ? {
    label: n && n.length > 0 ? n : r.conditionLabel,
    conditionId: r.conditionId,
    conditionLabel: r.conditionLabel,
    duration: Df(r.duration),
    source: r.source,
    originUuid: r.originUuid
  } : null;
}
function Sf(e, t) {
  const n = mf(e), r = Pf(n);
  if (!r) return null;
  const o = kt(r);
  if (!o.ok) return null;
  const a = (o.value.conditionApplications ?? []).filter((l) => l.actor === "target");
  if (a.length === 0) return null;
  const s = Lf(a, t);
  return s ? {
    conditionId: s.conditionId,
    conditionLabel: s.label ?? s.conditionId,
    duration: s.duration ?? null,
    source: s.source ?? "item-use.condition-action",
    originUuid: r.uuid ?? null
  } : null;
}
function Lf(e, t) {
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const n = U(t);
  return n ? e.find((r) => [
    r.label,
    r.conditionId
  ].some((o) => U(o) === n)) ?? null : null;
}
function Df(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function Pf(e) {
  if (!e) return null;
  const t = e.actorId ? Ep(e.actorId) : null, n = t ? vf(t, e.itemId, e.itemName) : null;
  return n || Nf(e.itemId, e.itemName);
}
function vf(e, t, n) {
  const r = e.items;
  if (t) {
    const a = r?.get?.(t);
    if (ye(a)) return a;
  }
  const o = U(n);
  if (o) {
    const a = r?.find?.((s) => ye(s) ? U(s.name) === o : !1);
    if (ye(a)) return a;
  }
  return null;
}
function Nf(e, t) {
  const n = game.items;
  if (e) {
    const o = n?.get?.(e);
    if (ye(o)) return o;
  }
  const r = U(t);
  if (r) {
    const o = n?.find?.((a) => ye(a) ? U(a.name) === r : !1);
    if (ye(o)) return o;
  }
  return null;
}
function xf(e, t) {
  const n = t?.querySelector(`.${i}__resistance-description`)?.textContent?.trim(), r = t?.querySelector(St) ?? null, o = r?.getAttribute(Ii) ?? null, a = r?.getAttribute(Ci) ?? (o ? se(o) : null);
  return !n && !o ? null : {
    description: n ?? "Resistência do alvo.",
    formula: t?.querySelector(`.${i}__resistance .${i}__workflow-roll-formula`)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: a,
    difficulty: cr(e)
  };
}
function Of(e) {
  const t = af(e);
  for (const [n, r] of qf(e))
    t.set(n, r);
  return t;
}
function Mf(e) {
  const t = lf(e);
  for (const [n, r] of Bf(e))
    t.set(n, r);
  return t;
}
function Ff(e) {
  const t = uf(e);
  for (const [n, r] of Uf(e))
    t.set(n, r);
  return t;
}
function Uf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = n.getAttribute(Dn), a = n.getAttribute(Pn), s = n.getAttribute(vn), l = Ro(n.getAttribute(Nn)), c = Ro(n.getAttribute(xn)), d = n.getAttribute(On), f = n.getAttribute(Mn);
    !r || !o || !a || l === null || c === null || !d || !f || t.set(r, {
      targetId: r,
      targetName: d,
      conditionId: o,
      conditionLabel: a,
      effectId: s && s.length > 0 ? s : null,
      created: l,
      refreshed: c,
      appliedAt: f
    });
  }
  return t;
}
function Bf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = n.getAttribute(wn), a = ct(n.getAttribute(En)), s = ct(n.getAttribute(In)), l = ct(n.getAttribute(Cn)), c = n.getAttribute(Sn), d = n.getAttribute(Ln);
    !r || !Lp(o) || a === null || s === null || l === null || !c || !d || t.set(r, {
      targetId: r,
      targetName: c,
      mode: o,
      inputAmount: a,
      finalDamage: s,
      blocked: l,
      appliedAt: d
    });
  }
  return t;
}
function qf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${L}]`)) {
    const r = n.getAttribute(L), o = ct(n.getAttribute(yn)), a = n.getAttribute(An), s = n.getAttribute(Tn), l = n.getAttribute($n), c = n.getAttribute(Rn), d = n.getAttribute(kn);
    !r || o === null || !a || !s || !l || !c || !d || t.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: a,
      total: o,
      diceBreakdown: n.getAttribute(lt),
      rolledAt: d
    });
  }
  return t;
}
function Gf(e, t) {
  return e ? t === null ? vi : e.total >= t ? z : We : Pi;
}
function zf(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function jf(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Vf(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Hf(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Wf(e) {
  const t = Kf(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(br, "true"), n;
}
function Kf(e) {
  return e.querySelector(`[${br}="true"]`);
}
function Yf(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-section-description`), o.textContent = t.typeLabel, e.append(o);
  }
  e.append(xi(t.formula, t.total, t.diceBreakdown));
}
function xi(e, t, n, r = !1) {
  const o = ef({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return Qf(o, r), o;
}
function Qf(e, t) {
  const n = e.querySelector(Lt), r = e.querySelector(sr);
  if (!n || !r) return;
  e.classList.toggle(ir, t), n.hidden = !t, r.classList.add(lr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const o = r.querySelector("i") ?? document.createElement("i");
  o.classList.add("fa-solid"), o.classList.toggle("fa-chevron-down", !t), o.classList.toggle("fa-chevron-up", t), o.setAttribute("aria-hidden", "true"), o.parentElement || r.append(o);
}
function Zf(e, t) {
  const n = Pt(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Xf(e) {
  const t = e.querySelector(`[${bn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(bn, "true"), n;
}
function Oi(e, t) {
  const n = Jf(e);
  e.replaceChildren(ep(t), np(t, n));
}
function Jf(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${L}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(L)).filter(Sp)
  );
}
function ep(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = tp(e.targets), t.append(n, r), t;
}
function tp(e) {
  const t = e.length, n = e.filter((l) => l.state === We).length, r = e.filter((l) => l.state === z).length, o = e.filter((l) => l.state === Pi).length, a = e.filter((l) => l.state === vi).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), o > 0 && s.push(`${o} ${o === 1 ? "pendente" : "pendentes"}`), a > 0 && s.push(`${a} ${a === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function np(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(rp(r, e, t.has(r.id)));
  return n;
}
function rp(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(L, e.id), r.setAttribute(bf, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Mi(r, e.resistanceResult), Fi(r, e.damageApplication), Ui(r, e.effectApplication);
  const o = op(e, t, r), a = hp(e, t);
  return a.hidden = !n, r.addEventListener("click", (s) => {
    $o(s.target) || To(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || $o(s.target) || (s.preventDefault(), To(r));
  }), r.append(o, a), r;
}
function Mi(e, t) {
  if (!t) {
    e.removeAttribute(yn), e.removeAttribute(An), e.removeAttribute(lt), e.removeAttribute(Tn), e.removeAttribute($n), e.removeAttribute(Rn), e.removeAttribute(kn);
    return;
  }
  e.setAttribute(yn, String(t.total)), e.setAttribute(An, t.formula), e.setAttribute(Tn, t.skill), e.setAttribute($n, t.skillLabel), e.setAttribute(Rn, t.targetName), e.setAttribute(kn, t.rolledAt), t.diceBreakdown ? e.setAttribute(lt, t.diceBreakdown) : e.removeAttribute(lt);
}
function Fi(e, t) {
  if (!t) {
    e.removeAttribute(wn), e.removeAttribute(En), e.removeAttribute(In), e.removeAttribute(Cn), e.removeAttribute(Sn), e.removeAttribute(Ln);
    return;
  }
  e.setAttribute(wn, t.mode), e.setAttribute(En, String(t.inputAmount)), e.setAttribute(In, String(t.finalDamage)), e.setAttribute(Cn, String(t.blocked)), e.setAttribute(Sn, t.targetName), e.setAttribute(Ln, t.appliedAt);
}
function Ui(e, t) {
  if (!t) {
    e.removeAttribute(Dn), e.removeAttribute(Pn), e.removeAttribute(vn), e.removeAttribute(Nn), e.removeAttribute(xn), e.removeAttribute(On), e.removeAttribute(Mn);
    return;
  }
  e.setAttribute(Dn, t.conditionId), e.setAttribute(Pn, t.conditionLabel), e.setAttribute(vn, t.effectId ?? ""), e.setAttribute(Nn, String(t.created)), e.setAttribute(xn, String(t.refreshed)), e.setAttribute(On, t.targetName), e.setAttribute(Mn, t.appliedAt);
}
function op(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const o = document.createElement("div");
  o.classList.add(`${i}__target-summary-main`);
  const a = ap(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = ip(e, t.resistance);
  lp(l, n, e, t);
  const c = gp(n);
  o.append(a, s, l, c);
  const d = document.createElement("div");
  return d.classList.add(`${i}__target-summary-actions`), d.append(
    Bi(e, t, "compact"),
    zi(e, t, "compact")
  ), r.append(o, d), r;
}
function ap(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function ip(e, t) {
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", sp(e, t)), t?.skill && (n.setAttribute(Ii, t.skill), n.setAttribute(Ci, t.skillLabel ?? se(t.skill))), !t?.skill)
    return n.disabled = !0, n.title = "Resistência não configurada", n.textContent = "—", n;
  if (n.title = e.resistanceResult ? `Rolar ${t.skillLabel ?? t.skill} novamente` : `Rolar ${t.skillLabel ?? t.skill} de ${e.name}`, !e.resistanceResult) {
    const a = document.createElement("i");
    a.classList.add("fa-solid", "fa-dice-d20"), a.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    return s.classList.add(`${i}__target-resistance-fallback`), s.textContent = "d20", n.append(a, s), n;
  }
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const o = document.createElement("span");
  return o.classList.add(`${i}__target-resistance-mark`), o.setAttribute("aria-hidden", "true"), o.textContent = e.state === z ? "✓" : e.state === We ? "✕" : "", n.append(r, o), n;
}
function sp(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === z ? "sucesso" : e.state === We ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function lp(e, t, n, r) {
  e.addEventListener("click", (o) => {
    o.stopPropagation(), cp(t, e, n, r);
  });
}
async function cp(e, t, n, r) {
  const o = r.resistance, a = o?.skill, s = o?.skillLabel ?? (a ? se(a) : "Resistência");
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = $r(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await $f.execute({ actor: l, skill: a, skillLabel: s });
    await Ip(d.roll);
    const f = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      skill: a,
      skillLabel: s,
      formula: d.formula,
      total: d.total,
      diceBreakdown: d.diceBreakdown,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Mi(e, f);
    try {
      await sf(r.rollCard, f);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", y);
    }
    yr(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function yr(e) {
  const t = e.closest(`[${bn}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Ni({
    rollCard: n,
    damageSection: up(n) ?? Pt(n, "Dano"),
    effectSection: dp(n)
  });
  r && Oi(t, r);
}
function up(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(br) !== "true") ?? null;
}
function dp(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Ot(e, t) {
  return He(
    Tr(),
    Ar(e, t)
  );
}
function Ar(e, t) {
  if (!t.resistance) return { kind: "none" };
  const n = t.resistance.difficulty ?? 0, r = e.resistanceResult?.total ?? 0;
  return e.state === z ? { kind: "succeeded", difficulty: n, total: r } : e.state === We ? { kind: "failed", difficulty: n, total: r } : { kind: "pending", difficulty: n };
}
function Tr() {
  try {
    return wt();
  } catch {
    return "strict";
  }
}
function Bi(e, t, n) {
  if (e.damageApplication)
    return O(
      "✓",
      mp(e.damageApplication, n),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  if (Ot(e, t))
    return O(
      "◇",
      n === "full" ? "Role resistência primeiro" : "Role res.",
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const r = qi(e), o = Gi(r, t.damage);
  if (o === null)
    return O(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const a = r === "half" ? n === "full" ? t.damage.halfLabel ?? `Metade: ${o} PV` : t.damage.halfCompactLabel ?? `½ ${o} PV` : n === "full" ? t.damage.normalLabel : t.damage.normalCompactLabel, s = r === "half" ? "🛡️" : "⚡", l = r === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, c = O(
    s,
    a,
    [`${i}__target-action--damage`, l],
    !1
  );
  return c.title = `Aplicar ${a} em ${e.name}`, c.setAttribute("aria-label", c.title), c.addEventListener("click", (d) => {
    d.stopPropagation();
    const f = c.closest(`[${L}]`);
    f && fp(f, c, e, t);
  }), c;
}
function mp(e, t) {
  const n = e.blocked > 0 ? ` (RD ${e.blocked})` : "";
  return t === "compact" ? `${e.finalDamage} PV` : `Dano aplicado: ${e.finalDamage} PV${n}`;
}
function qi(e) {
  return e.state === z ? "half" : "normal";
}
function Gi(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function fp(e, t, n, r) {
  if (n.damageApplication) return;
  if (Ot(n, r)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const o = qi(n), a = Gi(o, r.damage);
  if (a === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const s = $r(n.name);
  if (!s) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const l = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const c = await Rf.execute({
      actor: s,
      amount: a,
      damageType: r.damage.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Tr(),
      resistanceState: Ar(n, r)
    });
    if (!c.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${c.error.message}`), t.innerHTML = l;
      return;
    }
    const d = {
      targetId: n.id,
      targetName: s.name ?? n.name,
      mode: o,
      inputAmount: a,
      finalDamage: c.value.totalFinalDamage,
      blocked: c.value.totalBlocked,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Fi(e, d);
    try {
      await cf(r.rollCard, d);
    } catch (f) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", f);
    }
    ui.notifications?.info?.(`Paranormal Toolkit: ${d.finalDamage} PV aplicado em ${d.targetName}.`), yr(e);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", c), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function zi(e, t, n) {
  if (!t.effect)
    return O(
      "✦",
      "Sem efeito",
      [`${i}__target-action--effect`, `${i}__target-action--disabled`],
      !0
    );
  if (e.effectApplication)
    return O(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : "Aplicado",
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (Ot(e, t))
    return O(
      "◇",
      n === "full" ? "Role resistência primeiro" : "Role res.",
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (e.state === z)
    return O(
      "✓",
      n === "full" ? "Resistiu ao efeito" : "Resistiu",
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  const r = O(
    "✦",
    n === "full" ? `Aplicar ${t.effect.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return r.title = `Aplicar ${t.effect.conditionLabel} em ${e.name}`, r.setAttribute("aria-label", r.title), r.addEventListener("click", (o) => {
    o.stopPropagation();
    const a = r.closest(`[${L}]`);
    a && pp(a, r, e, t);
  }), r;
}
async function pp(e, t, n, r) {
  if (n.effectApplication) return;
  if (Ot(n, r)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar efeito.");
    return;
  }
  if (n.state === z) {
    ui.notifications?.warn?.("Paranormal Toolkit: este alvo resistiu ao efeito.");
    return;
  }
  const o = r.effect;
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui efeito estruturado para aplicar.");
    return;
  }
  const a = $r(n.name);
  if (!a) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await kf.execute({
      actor: a,
      conditionId: o.conditionId,
      duration: o.duration,
      originUuid: o.originUuid,
      source: o.source,
      resistanceGateMode: Tr(),
      resistanceState: Ar(n, r)
    });
    if (!l.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${l.error.message}`), t.innerHTML = s;
      return;
    }
    const c = {
      targetId: n.id,
      targetName: l.value.actorName,
      conditionId: l.value.conditionId,
      conditionLabel: l.value.conditionLabel,
      effectId: l.value.effectId,
      created: l.value.created,
      refreshed: l.value.refreshed,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Ui(e, c);
    try {
      await df(r.rollCard, c);
    } catch (d) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", d);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), ui.notifications?.info?.(`Paranormal Toolkit: ${c.conditionLabel} aplicado em ${c.targetName}.`), yr(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function O(e, t, n, r) {
  const o = document.createElement("button");
  o.type = "button", o.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), o.disabled = r;
  const a = document.createElement("span");
  a.classList.add(`${i}__target-action-icon`), a.setAttribute("aria-hidden", "true"), a.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, o.append(a, s), o;
}
function gp(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Li, "true"), t.setAttribute("aria-hidden", "true"), ji(e, t), t;
}
function To(e) {
  const t = e.querySelector(`[${Di}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Li}="true"]`);
  r && ji(e, r);
}
function ji(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function $o(e) {
  return e instanceof HTMLElement ? !!e.closest([
    "button",
    "a",
    "input",
    "select",
    "textarea",
    `.${i}__workflow-roll`,
    `.${i}__workflow-roll-formula`,
    `.${i}__workflow-dice-tray`
  ].join(", ")) : !1;
}
function hp(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(Di, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const a = document.createElement("span");
  a.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(o, a);
  const s = _p(e, t.resistance);
  s && r.append(s);
  const l = bp(e, t.resistance), c = yp(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function _p(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === z ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function bp(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", o = e.resistanceResult?.total ?? null, a = xi(
    r,
    o,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(a), n;
}
function yp(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), n.append(
    Bi(e, t, "full"),
    zi(e, t, "full")
  ), n;
}
function Ap(e, t, n) {
  const r = n.parentElement === e ? n : Pt(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function Tp(e) {
  const t = Vi(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Si, "true"), n;
}
function Vi(e) {
  return e.querySelector(`[${Si}="true"]`);
}
function $p(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  r.textContent = "Efeito", n.append(r);
  const o = document.createElement("div");
  o.classList.add(`${i}__effect-info-body`);
  const a = document.createElement("span");
  a.classList.add(`${i}__effect-info-label`), a.textContent = t.label;
  const s = document.createElement("span");
  s.classList.add(`${i}__effect-info-hint`), s.textContent = "Aplicação por alvo", o.append(a, s), e.append(n, o);
}
function Rp(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function $r(e) {
  const t = U(e);
  if (!t) return null;
  const n = kp().filter((a) => U(wp(a)) === t).map((a) => Hi(a)).find(be) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => be(a) && U(a.name) === t);
  return be(o) ? o : null;
}
function kp() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function wp(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Hi(e)?.name ?? null;
}
function Hi(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (be(t)) return t;
  const n = e.document?.actor;
  return be(n) ? n : null;
}
function be(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ep(e) {
  const n = game.actors?.get?.(e);
  return be(n) ? n : null;
}
function ye(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function U(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Ip(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Cp(e, t) {
  return `${t}-${Wi(e).replace(/[^a-z0-9]+/gu, "-")}`;
}
function Wi(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function Sp(e) {
  return typeof e == "string" && e.length > 0;
}
function Lp(e) {
  return e === "normal" || e === "half";
}
function Ro(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function ct(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Ae = "data-paranormal-toolkit-prompt-id", Dp = "data-paranormal-toolkit-card-layout-normalized", ko = "data-paranormal-toolkit-card-layout-refresh-bound", Pp = "apply-damage", vp = "data-paranormal-toolkit-multi-target-damage-info", Ki = [0, 80, 180, 400, 900, 1600, 3e3], wo = /* @__PURE__ */ new WeakSet();
function Np(e) {
  Yi(e), xp(e);
}
function Yi(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    Zi(Qi(t));
}
function xp(e) {
  if (!wo.has(e)) {
    wo.add(e);
    for (const t of Ki)
      globalThis.setTimeout(() => {
        Yi(e);
      }, t);
  }
}
function Qi(e) {
  return {
    rollCard: e,
    damageSection: Op(e),
    resistance: e.querySelector(Ct),
    damageActions: Mp(e),
    effectActionSource: Fp(e),
    effectSection: Hu(e)
  };
}
function Zi(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: o,
    effectActionSource: a,
    effectSection: s
  } = e;
  t.setAttribute(Dp, "true"), t.classList.add(`${i}__roll-card--structured`), n && r && r.parentElement !== n && n.append(r), n && o && (o.parentElement !== n && n.append(o), Uu(t, o));
  const l = Wu({
    rollCard: t,
    existingSection: s,
    sourceActions: a,
    after: n,
    fallbackAfter: Pt(t, "Conjuração")
  });
  l && Ku(t, l), wf({
    rollCard: t,
    damageSection: n,
    effectSection: l ?? s
  }), Vp(t);
}
function Op(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(vp) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function Mp(e) {
  const t = Up(e);
  return t.find((n) => n.getAttribute(vu) === Pp) ?? t.find((n) => ri(n) === "aplicar danos") ?? null;
}
function Fp(e) {
  const t = Xi(e), n = Eo(t);
  return n || Eo(Bp(e));
}
function Eo(e) {
  return e.find((t) => {
    const n = ri(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function Up(e) {
  const t = Xi(e);
  return t.length > 0 ? t : Rr(e);
}
function Xi(e) {
  const t = zp(e);
  return t ? Rr(e).filter((n) => Gp(n, t)) : [];
}
function Bp(e) {
  const t = Ji(e);
  if (!t) return [];
  const n = qp(e, t);
  return Rr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => es(e, r)).filter((r) => !n || jp(r, n));
}
function Rr(e) {
  const t = Ji(e);
  return t ? Array.from(t.querySelectorAll(Pu)) : [];
}
function Ji(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function qp(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && es(e, n)) ?? null;
}
function Gp(e, t) {
  return e.getAttribute(Ae) === t ? !0 : Array.from(e.querySelectorAll(`[${Ae}]`)).some((n) => n.getAttribute(Ae) === t);
}
function zp(e) {
  return e.getAttribute(Ae) ?? e.querySelector(`[${Ae}]`)?.getAttribute(Ae) ?? null;
}
function es(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function jp(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Vp(e) {
  const t = e.querySelector(St);
  t && t.getAttribute(ko) !== "true" && (t.setAttribute(ko, "true"), t.addEventListener("click", () => {
    for (const n of Ki)
      globalThis.setTimeout(() => {
        Zi(Qi(e));
      }, n);
  }));
}
const Hp = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function Wp(e) {
  for (const t of Array.from(e.querySelectorAll(Ct)))
    Kp(t);
  Np(e);
}
function Kp(e) {
  const t = e.querySelector(Zc), n = e.querySelector(Ya), r = e.querySelector(St), o = e.querySelector(Qa);
  if (!r || !t && !n && !o) return;
  const a = Yp(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && (o.parentElement !== e && !r.contains(o) && e.append(o), Qp(o)), r.parentElement !== e && e.append(r);
}
function Yp(e, t) {
  const n = e.querySelector(`.${ro}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(ro), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function Qp(e) {
  const t = Zp(e.textContent ?? "");
  t && (e.setAttribute(Hp, "true"), e.replaceChildren(eg(t)));
}
function Zp(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, o] = t, a = n?.trim() ?? "Resistência", s = Number(o);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = Xp(r ?? "");
  return l ? {
    skillLabel: a,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function Xp(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Jp(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Jp(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function eg(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = tg(e);
  return r && t.append(r), t;
}
function tg(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of ng(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function ng(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Io(e, "highest") : n.includes("kl") ? Io(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Io(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Co(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function kr() {
  const e = globalThis.game;
  return Mt(e) ? e : null;
}
function P(e, t) {
  const n = rg(e, t);
  return ut(n);
}
function rg(e, t) {
  return t.split(".").reduce((n, r) => Mt(n) ? n[r] : null, e);
}
function og(e, t) {
  const n = e.indexOf(":");
  return n < 0 || Ge(e.slice(0, n)) !== Ge(t) ? null : Ie(e.slice(n + 1));
}
function ut(e) {
  return typeof e == "string" ? Ie(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Mt(e) {
  return !!e && typeof e == "object";
}
function ag(e) {
  return typeof e == "string";
}
function Ft(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Ie(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function Ge(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function Fn(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function Q(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function ts(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function ig(e) {
  for (const t of Array.from(e.querySelectorAll(Kc))) {
    const n = fg(t);
    sg(t), n && (lg(t, n), cg(t, n));
  }
}
function sg(e) {
  for (const t of Array.from(e.querySelectorAll(Yc)))
    t.remove();
}
function lg(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(Ka) ?? null, o = r?.querySelector(Wc) ?? null, a = r ?? e, s = a.querySelector(eu);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = Lg(t.elementTone), l.textContent = Sg(t), !s) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", l);
      return;
    }
    a.prepend(l);
  }
}
function cg(e, t) {
  const n = ug(e);
  dg(e, n);
  const r = mg(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${i}__ritual-metadata`);
  for (const s of r) {
    const l = document.createElement("span");
    l.classList.add(`${i}__ritual-metadata-chip`), l.textContent = s, o.append(l);
  }
  if (n) {
    const s = n.querySelector(`.${i}__summary`);
    if (s?.parentElement === n) {
      s.insertAdjacentElement("afterend", o);
      return;
    }
    n.append(o);
    return;
  }
  const a = e.querySelector(Za);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function ug(e) {
  return e.closest(`.${i}`)?.querySelector(Ka) ?? null;
}
function dg(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(tu)))
      o.remove();
}
function mg(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${Fn(e.target)}` : null,
    e.duration ? `Duração: ${Fn(e.duration)}` : null,
    e.resistance ? `Resistência: ${ts(e.resistance)}` : null
  ].filter(Ft);
}
function fg(e) {
  const t = pg(e), n = Ag(e), o = (t ? yg(t) : null)?.system ?? null, a = t?.summaryLines ?? [], s = wr(P(o, "element")), l = q("op.elementChoices", s) ?? So(oe(a, "Elemento")) ?? So(n.damageType), c = s ?? Dg(l), d = P(o, "circle") ?? oe(a, "Círculo"), f = Rg(o) ?? oe(a, "Alvo"), y = Ig(o, "duration", "op.durationChoices") ?? oe(a, "Duração"), T = Tg(e) ?? wg(o) ?? oe(a, "Resistência"), $ = $g(a) ?? n.cost, g = {
    elementLabel: l,
    elementTone: c,
    circle: d,
    cost: $,
    target: f,
    duration: y,
    resistance: T
  };
  return Cg(g) ? g : null;
}
function pg(e) {
  const t = gg(e);
  if (!t) return null;
  const n = t.getFlag?.(u, It), r = _g(n);
  if (r.length === 0) return null;
  const o = hg(e);
  if (o.size > 0) {
    const a = r.find((s) => s.pendingId && o.has(s.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function gg(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? kr()?.messages?.get?.(n) ?? null : null;
}
function hg(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${no}]`))) {
    const o = r.getAttribute(no)?.trim();
    o && n.add(o);
  }
  return n;
}
function _g(e) {
  if (!Mt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(bg).filter((n) => n !== null) : [];
}
function bg(e) {
  return Mt(e) ? {
    pendingId: ut(e.pendingId),
    actorId: ut(e.actorId),
    itemId: ut(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(ag) : []
  } : null;
}
function yg(e) {
  if (!e.itemId) return null;
  const t = kr(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Ag(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(Qc))) {
    const o = Ie(r.textContent);
    if (!o) continue;
    const a = og(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function Tg(e) {
  const t = Ie(e.querySelector(Ya)?.textContent);
  return t ? ts(t) : null;
}
function oe(e, t) {
  const n = Ge(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || Ge(r.slice(0, o)) !== n))
      return Ie(r.slice(o + 1));
  }
  return null;
}
function $g(e) {
  const t = oe(e, "Custo") ?? oe(e, "PE");
  return t || (e.map(Ie).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Rg(e) {
  const t = P(e, "target");
  if (!t) return null;
  if (t === "area")
    return kg(e) ?? q("op.targetChoices", t) ?? "Área";
  const n = q("op.targetChoices", t) ?? Q(t);
  return [t === "people" || t === "creatures" ? P(e, "targetQtd") : null, n].filter(Ft).join(" ");
}
function kg(e) {
  const t = P(e, "area.name"), n = P(e, "area.size"), r = P(e, "area.type"), o = t ? q("op.areaChoices", t) ?? Q(t) : null, a = r ? q("op.areaTypeChoices", r) ?? Q(r) : null;
  return o ? n ? a ? `${o} ${n}m ${Fn(a)}` : `${o} ${n}m` : o : null;
}
function wg(e) {
  const t = P(e, "skillResis"), n = P(e, "resistance");
  if (!t || !n) return null;
  const r = q("op.skill", t) ?? Q(t), o = Eg(n);
  return [r, o].filter(Ft).join(" ");
}
function Eg(e) {
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
      return q("op.resistanceChoices", e) ?? Q(e);
  }
}
function Ig(e, t, n) {
  const r = P(e, t);
  return r ? q(n, r) ?? Q(r) : null;
}
function Cg(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Sg(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function Lg(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Ft).join(" ");
}
function wr(e) {
  const t = Ge(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function So(e) {
  const t = wr(e);
  return t ? q("op.elementChoices", t) ?? Q(t) : e ? Q(e) : null;
}
function Dg(e) {
  return wr(e);
}
function q(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = kr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Lo = "data-paranormal-toolkit-dice-toggle-enhanced";
function Pg(e) {
  for (const t of Array.from(e.querySelectorAll(Xa)))
    ns(t);
}
function vg(e) {
  const t = os(e.target);
  if (!t) return;
  const n = Er(t);
  n && (e.preventDefault(), rs(n, t));
}
function Ng(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = os(e.target);
  if (!t) return;
  const n = Er(t);
  n && (e.preventDefault(), rs(n, t));
}
function ns(e) {
  const t = e.querySelector(Lt);
  if (!t) return;
  const n = e.querySelector(sr);
  if (n && n.getAttribute(Lo) !== "true" && (n.setAttribute(Lo, "true"), n.classList.add(lr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function rs(e, t) {
  const n = e.querySelector(Lt);
  if (!n) return;
  const r = !e.classList.contains(ir);
  xg(e, t, n, r);
}
function xg(e, t, n, r) {
  e.classList.toggle(ir, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function os(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(sr);
  if (!t) return null;
  const n = Er(t);
  return n ? (ns(n), t.classList.contains(lr) ? t : null) : null;
}
function Er(e) {
  const t = e.closest(Xa);
  return t && t.querySelector(Lt) ? t : null;
}
const Do = `${u}-workflow-dice-toggle-styles`;
function Og() {
  if (document.getElementById(Do)) return;
  const e = document.createElement("style");
  e.id = Do, e.textContent = `
.${i}__workflow-section .${i}__roll-detail-toggle,
.${i}__workflow-section .${i}__roll-detail-list {
  display: none !important;
}

.${i}__workflow-roll:not(.${i}__workflow-roll--dice-open) .${i}__workflow-dice-tray,
.${i}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${i}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${i}__workflow-roll-formula--toggle:hover,
.${i}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${i}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${i}__header .${i}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${i}__ritual-element-badge {
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

.${i}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${i}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${i}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${i}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${i}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${i}__header .${i}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${i}__roll-card > .${i}__ritual-metadata {
  display: none !important;
}

.${i}__ritual-metadata-chip {
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

.${i}__resistance {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 34px;
  grid-template-areas:
    "content button"
    "result result";
  align-items: start !important;
  column-gap: 0.62rem;
  row-gap: 0.36rem;
  padding: 0.56rem 0.58rem !important;
}

.${i}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${i}__resistance-content .${i}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${i}__resistance-content .${i}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${i}__resistance-content .${i}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${i}__resistance > .${i}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: start;
}

.${i}__resistance > .${i}__resistance-roll-result,
.${i}__resistance-content .${i}__resistance-roll-result {
  grid-area: result;
  display: block;
  min-width: 0;
  width: 100%;
  margin-top: 0;
}

.${i}__resistance-workflow-roll {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 0.34rem;
}

.${i}__resistance-workflow-roll .${i}__workflow-roll-formula {
  display: inline-flex;
  width: 100%;
  max-width: 100%;
  min-height: 1.78rem;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

.${i}__resistance-workflow-roll .${i}__workflow-roll-formula i {
  margin-left: auto;
}

.${i}__resistance-workflow-roll .${i}__workflow-dice-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
  border-top: 1px solid rgba(79, 55, 42, 0.12);
  padding-top: 0.34rem;
}

.${i}__resistance-workflow-roll .${i}__workflow-die {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.22rem;
  min-height: 1.22rem;
  border: 1px solid rgba(82, 57, 25, 0.18);
  border-radius: 999px;
  padding: 0 0.27rem;
  background: rgba(255, 255, 255, 0.64);
  color: rgba(36, 27, 24, 0.9);
  font-family: var(--font-mono, monospace);
  font-size: 0.7rem;
  font-weight: 800;
  line-height: 1;
  box-sizing: border-box;
}

.${i}__resistance-workflow-roll .${i}__workflow-die--inactive {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(36, 27, 24, 0.46);
  opacity: 0.58;
}
.${i}__workflow-section--casting .${i}__workflow-section-header--casting-backlash {
  grid-template-columns: minmax(0, 1fr) 34px;
}

.${i}__workflow-section-title-row {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.38rem;
}

.${i}__workflow-section-title-row .${i}__workflow-section-status {
  flex: 0 0 auto;
}

.${i}__casting-backlash-button {
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

.${i}__casting-backlash-button::before {
  content: "↪";
  font-size: 1rem;
  font-weight: 950;
  line-height: 1;
}

.${i}__casting-backlash-button:hover,
.${i}__casting-backlash-button:focus {
  border-color: rgba(125, 39, 43, 0.66) !important;
  background: rgba(143, 62, 67, 0.94) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 0 0 2px rgba(125, 39, 43, 0.16) !important;
  outline: none !important;
}

.${i}__casting-backlash-button:disabled {
  cursor: default !important;
  opacity: 0.78 !important;
}

.${i}__casting-backlash-button.${i}__button--executed::before {
  content: "✓";
}

/* 0.21.2 — Resolução de dano integrada no bloco de Dano */
.${i}__workflow-section--effect .${i}__resistance {
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.48rem 0.52rem !important;
  background: rgba(255, 246, 229, 0.52) !important;
  box-shadow: none !important;
}

.${i}__workflow-section--effect .${i}__resistance-content {
  gap: 0.22rem !important;
}

.${i}__workflow-section--effect .${i}__resistance-header strong {
  display: inline !important;
  margin: 0 !important;
}

.${i}__workflow-section--effect .${i}__resistance-description {
  font-size: 0.75rem !important;
  line-height: 1.25 !important;
}

.${i}__actions--embedded {
  margin-top: 0.46rem !important;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${i}__actions--compact,
.${i}__actions--damage-resolution {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center !important;
  gap: 0.34rem !important;
}

.${i}__actions--damage-resolution .${i}__actions-title {
  grid-column: 1 / -1;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.02rem !important;
  color: rgba(71, 47, 34, 0.62) !important;
  font-size: 0.68rem !important;
  font-weight: 900 !important;
  letter-spacing: 0.045em !important;
  line-height: 1 !important;
  text-align: center;
  text-transform: uppercase !important;
}

.${i}__actions--damage-resolution .${i}__actions-title::before,
.${i}__actions--damage-resolution .${i}__actions-title::after {
  content: "";
  display: block;
  border-top: 1px solid rgba(79, 55, 42, 0.16);
}

.${i}__damage-resolution-summary {
  grid-column: 1 / -1;
  margin: -0.04rem 0 0.02rem;
  color: rgba(54, 39, 31, 0.64);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.24;
  text-align: center;
}

.${i}__actions--damage-resolution .${i}__button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: none !important;
  height: auto !important;
  min-height: 1.85rem !important;
  max-height: none !important;
  margin: 0 !important;
  border-radius: 7px !important;
  padding: 0.34rem 0.52rem !important;
  font-size: 0.76rem !important;
  font-weight: 900 !important;
  line-height: 1.1 !important;
  gap: 0.34rem !important;
  white-space: normal !important;
  aspect-ratio: auto !important;
}

.${i}__actions--damage-resolution .${i}__button-icon {
  flex: 0 0 auto;
  font-size: 0.78rem;
  line-height: 1;
  opacity: 0.88;
}

.${i}__actions--damage-resolution .${i}__button-label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="pending"] .${i}__button,
.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${i}__button,
.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${i}__button {
  grid-column: 1 / -1;
}

.${i}__actions--damage-resolution .${i}__button[hidden] {
  display: none !important;
}

.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="resisted"] .${i}__damage-resolution-summary {
  color: rgba(34, 93, 55, 0.84);
}

.${i}__actions--damage-resolution[data-paranormal-toolkit-damage-resolution-state="failed"] .${i}__damage-resolution-summary {
  color: rgba(112, 44, 44, 0.82);
}

.${i}__actions--effect-resolution {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "title button"
    "label button";
  align-items: center !important;
  gap: 0.18rem 0.52rem !important;
  margin-top: 0.52rem !important;
  border: 1px solid rgba(127, 88, 39, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.54rem 0.58rem !important;
  background: rgba(255, 250, 238, 0.58) !important;
  box-shadow: none !important;
}

.${i}__actions--effect-resolution .${i}__actions-title {
  grid-area: title;
  margin: 0 !important;
  color: rgba(107, 78, 35, 0.95) !important;
  font-size: 0.78rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.055em !important;
  line-height: 1 !important;
  text-transform: uppercase !important;
}

.${i}__effect-resolution-label {
  grid-area: label;
  min-width: 0;
  color: rgba(36, 27, 24, 0.9);
  font-size: 0.82rem;
  font-weight: 850;
  line-height: 1.22;
  overflow-wrap: anywhere;
}

.${i}__actions--effect-resolution .${i}__button {
  grid-area: button;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: auto !important;
  min-width: 5rem !important;
  max-width: 7rem !important;
  min-height: 1.9rem !important;
  margin: 0 !important;
  border-radius: 7px !important;
  padding: 0.34rem 0.62rem !important;
  font-size: 0.78rem !important;
  font-weight: 900 !important;
  line-height: 1.1 !important;
  white-space: nowrap !important;
  aspect-ratio: auto !important;
}

/* 0.21.4 — Card compacto de efeito e botão com brilho */
.${i}__actions--effect-resolution {
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${i}__actions--effect-resolution .${i}__button {
  gap: 0.34rem !important;
  border-color: rgba(123, 72, 73, 0.42) !important;
  background: rgba(228, 214, 209, 0.74) !important;
  color: rgba(42, 30, 27, 0.94) !important;
}

.${i}__actions--effect-resolution .${i}__button:hover,
.${i}__actions--effect-resolution .${i}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${i}__button-icon--effect {
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
  transform: translateY(-0.02rem);
}

.${i}__button--effect-resolution-action .${i}__button-label {
  line-height: 1;
}

/* 0.21.5 — Efeito dentro do card principal e estado aplicado compacto */
/* 0.21.6 — Aproxima o Efeito do bloco de Dano para manter o ritmo visual do card */
/* 0.21.7 — Normaliza Efeito como seção irmã de Dano, sem margem herdada de actions */
.${i}__roll-card > .${i}__actions--effect-resolution {
  margin: 0 !important;
}

.${i}__roll-card > .${i}__workflow-section--effect + .${i}__actions--effect-resolution {
  margin-top: 0 !important;
}

.${i}__actions--effect-resolution.${i}__workflow-section {
  align-items: center !important;
}

.${i}__actions--effect-resolution .${i}__button--executed,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${i}__button-icon--effect-applied {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.8 — Efeito condicionado ao resultado da resistência */
.${i}__actions--effect-resolution .${i}__button--effect-resolution-waiting,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted {
  color: rgba(34, 93, 55, 0.84) !important;
}

.${i}__button-icon--effect-resisted {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

/* 0.21.9 — Estados bloqueados de efeito não devem parecer clicáveis */
.${i}__actions--effect-resolution .${i}__button--effect-resolution-waiting:hover,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-waiting:focus,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:hover,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:focus,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-waiting:disabled,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:disabled {
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  cursor: default !important;
}

.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:hover,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:focus,
.${i}__actions--effect-resolution .${i}__button--effect-resolution-resisted:disabled {
  color: rgba(34, 93, 55, 0.84) !important;
}

/* 0.22.0 — Card estruturado: remove moldura externa e mantém cards internos */
.${i}__roll-card--structured {
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.${i}__roll-card--structured > .${i}__workflow-section,
.${i}__roll-card--structured > .${i}__actions--effect-resolution {
  margin-inline: 0 !important;
}

.${i}__roll-card--structured > .${i}__workflow-section + .${i}__workflow-section,
.${i}__roll-card--structured > .${i}__workflow-section + .${i}__actions--effect-resolution,
.${i}__roll-card--structured > .${i}__actions--effect-resolution + .${i}__workflow-section {
  margin-top: 0.28rem !important;
}

.${i}__roll-card--structured > .${i}__roll-meta,
.${i}__roll-card--structured > .${i}__workflow-notes {
  margin-inline: 0.08rem !important;
}

/* 0.22.2 — Unifica ritmo e tipografia do card de Efeito com Conjuração/Dano */
.${i}__roll-card--structured {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.18rem !important;
}

.${i}__roll-card--structured > .${i}__workflow-section,
.${i}__roll-card--structured > .${i}__actions--effect-resolution {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.${i}__roll-card--structured > .${i}__actions--effect-resolution {
  gap: 0.14rem 0.5rem !important;
  padding: 0.54rem 0.58rem !important;
}

.${i}__roll-card--structured > .${i}__actions--effect-resolution .${i}__actions-title {
  display: block !important;
  font-family: inherit !important;
  font-size: 0.74rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 950 !important;
  letter-spacing: 0.075em !important;
  line-height: 1.08 !important;
  text-transform: uppercase !important;
}

.${i}__roll-card--structured > .${i}__actions--effect-resolution .${i}__effect-resolution-label {
  font-family: inherit !important;
  font-size: 0.81rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 800 !important;
  line-height: 1.18 !important;
}

.${i}__roll-card--structured > .${i}__actions--effect-resolution .${i}__button {
  align-self: center !important;
}

/* 0.22.3 — Efeito como workflow-section real, sem card legado de actions */
.${i}__roll-card--structured {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.18rem !important;
}

.${i}__roll-card--structured > .${i}__workflow-section,
.${i}__roll-card--structured > .${i}__workflow-section--effect-action {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.${i}__workflow-section--effect-action {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "header button"
    "label button";
  align-items: center !important;
  gap: 0.14rem 0.5rem !important;
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${i}__workflow-section--effect-action > .${i}__workflow-section-header {
  grid-area: header;
  min-width: 0;
  margin: 0 !important;
}

.${i}__workflow-section--effect-action > .${i}__workflow-section-header strong {
  color: rgba(107, 78, 35, 0.95) !important;
  font-family: inherit !important;
  font-size: 0.74rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 950 !important;
  letter-spacing: 0.075em !important;
  line-height: 1.08 !important;
  text-transform: uppercase !important;
}

.${i}__effect-section-body {
  display: contents !important;
}

.${i}__effect-section-label {
  grid-area: label;
  min-width: 0;
  color: rgba(36, 27, 24, 0.9);
  font-family: inherit !important;
  font-size: 0.81rem !important;
  font-style: normal !important;
  font-variant: normal !important;
  font-weight: 800 !important;
  line-height: 1.18 !important;
  overflow-wrap: anywhere;
}

.${i}__effect-section-action {
  grid-area: button;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  justify-self: end !important;
  align-self: center !important;
  min-width: 0;
}

.${i}__workflow-section--effect-action .${i}__button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: auto !important;
  min-width: 5rem !important;
  max-width: 7rem !important;
  min-height: 1.9rem !important;
  margin: 0 !important;
  border-radius: 7px !important;
  padding: 0.34rem 0.62rem !important;
  border-color: rgba(123, 72, 73, 0.42) !important;
  background: rgba(228, 214, 209, 0.74) !important;
  color: rgba(42, 30, 27, 0.94) !important;
  font-size: 0.78rem !important;
  font-weight: 900 !important;
  line-height: 1.1 !important;
  gap: 0.34rem !important;
  white-space: nowrap !important;
  aspect-ratio: auto !important;
}

.${i}__workflow-section--effect-action .${i}__button:hover,
.${i}__workflow-section--effect-action .${i}__button:focus {
  border-color: rgba(123, 72, 73, 0.62) !important;
  background: rgba(220, 199, 194, 0.86) !important;
  box-shadow: 0 0 0 2px rgba(151, 111, 45, 0.14) !important;
  outline: none !important;
}

.${i}__workflow-section--effect-action .${i}__button--executed,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-applied {
  min-width: 5.15rem !important;
  max-width: 6.25rem !important;
  border-color: rgba(96, 75, 45, 0.32) !important;
  background: rgba(236, 226, 210, 0.76) !important;
  color: rgba(45, 35, 29, 0.82) !important;
  opacity: 0.94 !important;
}

.${i}__workflow-section--effect-action .${i}__button--effect-resolution-waiting,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted {
  min-width: 5.15rem !important;
  max-width: 6.75rem !important;
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  color: rgba(45, 35, 29, 0.72) !important;
  opacity: 0.88 !important;
  cursor: default !important;
}

.${i}__workflow-section--effect-action .${i}__button--effect-resolution-waiting:hover,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-waiting:focus,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-waiting:disabled,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted:hover,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted:focus,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted:disabled {
  border-color: rgba(96, 75, 45, 0.28) !important;
  background: rgba(239, 230, 216, 0.72) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  cursor: default !important;
}

.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted:hover,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted:focus,
.${i}__workflow-section--effect-action .${i}__button--effect-resolution-resisted:disabled {
  color: rgba(34, 93, 55, 0.84) !important;
}

/* 0.23.0 — Multi-target ritual card visual model */
.${i}__roll-card--multi-target
  > .${i}__workflow-section--multi-target-source,
.${i}__roll-card--multi-target
  > .${i}__workflow-section--multi-target-effect-source {
  display: none !important;
}

.${i}__workflow-section--targets {
  border-color: rgba(143, 54, 62, 0.24) !important;
  border-left: 3px solid rgba(133, 49, 59, 0.68) !important;
  background: linear-gradient(180deg, rgba(255, 248, 245, 0.84), rgba(250, 239, 235, 0.52)) !important;
}

.${i}__targets-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 0.5rem !important;
}

.${i}__workflow-section--targets
  .${i}__workflow-section-header strong {
  color: rgba(117, 48, 58, 0.94) !important;
}

.${i}__targets-status {
  display: inline-flex !important;
  align-items: center !important;
  min-width: 0 !important;
  border: 1px solid rgba(120, 61, 50, 0.14) !important;
  border-radius: 999px !important;
  padding: 0.14rem 0.48rem !important;
  background: rgba(255, 255, 255, 0.44) !important;
  color: rgba(36, 27, 24, 0.82) !important;
  font-size: 0.72rem !important;
  font-weight: 900 !important;
  line-height: 1 !important;
  white-space: nowrap !important;
}

.${i}__targets-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.3rem !important;
  margin-top: 0.42rem !important;
}

.${i}__target-row {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.34rem !important;
  border: 1px solid rgba(143, 54, 62, 0.16) !important;
  border-radius: 8px !important;
  padding: 0.38rem !important;
  background: rgba(255, 255, 255, 0.34) !important;
  cursor: pointer !important;
}

.${i}__target-row:focus-visible {
  outline: 2px solid rgba(143, 54, 62, 0.34) !important;
  outline-offset: 2px !important;
}

.${i}__target-summary {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.32rem !important;
  min-width: 0 !important;
}

.${i}__target-summary-main {
  display: grid !important;
  grid-template-columns: auto minmax(0, 1fr) auto auto !important;
  align-items: center !important;
  gap: 0.34rem !important;
  min-width: 0 !important;
}

.${i}__target-summary-actions {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
  align-items: center !important;
  gap: 0.34rem !important;
  min-width: 0 !important;
}

.${i}__target-row[aria-expanded="true"] .${i}__target-summary-actions {
  display: none !important;
}

.${i}__target-avatar {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 1.62rem !important;
  height: 1.62rem !important;
  border: 1px solid rgba(139, 95, 48, 0.28) !important;
  border-radius: 999px !important;
  background: radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.92), rgba(231, 213, 194, 0.78)) !important;
  color: rgba(88, 56, 42, 0.8) !important;
  flex: 0 0 auto !important;
  font-size: 0.72rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

.${i}__target-name {
  min-width: 0 !important;
  color: rgba(36, 27, 24, 0.94) !important;
  font-size: 0.88rem !important;
  font-weight: 950 !important;
  line-height: 1.12 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${i}__target-resistance-button,
.${i}__target-action {
  appearance: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 0 !important;
  margin: 0 !important;
  border-style: solid !important;
  border-width: 1px !important;
  box-shadow: none !important;
  font-family: inherit !important;
  line-height: 1 !important;
}

.${i}__target-resistance-button {
  width: 2.08rem !important;
  height: 1.82rem !important;
  border-color: rgba(123, 72, 73, 0.38) !important;
  border-radius: 7px !important;
  background: rgba(255, 252, 247, 0.74) !important;
  color: rgba(58, 45, 39, 0.84) !important;
  font-size: 0.76rem !important;
  font-weight: 950 !important;
  cursor: default !important;
}

.${i}__target-resistance-button i {
  font-size: 0.88rem !important;
}

.${i}__target-resistance-fallback {
  display: none !important;
}

.${i}__target-action {
  min-height: 1.82rem !important;
  border-color: rgba(123, 72, 73, 0.34) !important;
  border-radius: 7px !important;
  padding: 0.28rem 0.36rem !important;
  background: rgba(228, 214, 209, 0.64) !important;
  color: rgba(42, 30, 27, 0.82) !important;
  font-size: 0.72rem !important;
  font-weight: 900 !important;
  gap: 0.22rem !important;
  opacity: 0.74 !important;
  white-space: nowrap !important;
  cursor: default !important;
}

.${i}__target-action:disabled {
  opacity: 0.74 !important;
}

.${i}__target-summary-actions .${i}__target-action {
  width: 100% !important;
}

.${i}__target-action-icon {
  font-size: 0.82rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
}

.${i}__target-action-label {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${i}__target-toggle {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 1.1rem !important;
  color: rgba(36, 27, 24, 0.78) !important;
  font-size: 1rem !important;
  font-weight: 950 !important;
  line-height: 1 !important;
  pointer-events: none !important;
  user-select: none !important;
}

.${i}__target-details {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  gap: 0.36rem !important;
  border: 1px solid rgba(151, 111, 45, 0.22) !important;
  border-radius: 8px !important;
  padding: 0.48rem !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.76), rgba(255, 245, 219, 0.42)) !important;
}

.${i}__target-details[hidden] {
  display: none !important;
}

.${i}__target-resistance-details {
  grid-column: 1 / -1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0.12rem !important;
  min-width: 0 !important;
}

.${i}__target-resistance-details strong {
  color: rgba(107, 78, 35, 0.96) !important;
  font-size: 0.74rem !important;
  font-weight: 950 !important;
  letter-spacing: 0.075em !important;
  line-height: 1.08 !important;
  text-transform: uppercase !important;
}

.${i}__target-resistance-details span {
  color: rgba(36, 27, 24, 0.84) !important;
  font-size: 0.78rem !important;
  font-weight: 700 !important;
  line-height: 1.22 !important;
}

.${i}__target-formula {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  min-height: 1.82rem !important;
  min-width: 0 !important;
  border: 1px solid rgba(66, 47, 34, 0.18) !important;
  border-radius: 6px !important;
  padding: 0.28rem 0.46rem !important;
  background: rgba(255, 255, 255, 0.62) !important;
  color: rgba(36, 27, 24, 0.9) !important;
  font-size: 0.78rem !important;
  font-weight: 800 !important;
  line-height: 1 !important;
  gap: 0.46rem !important;
}

.${i}__target-formula span {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.${i}__target-formula i {
  flex: 0 0 auto !important;
  font-size: 0.62rem !important;
  opacity: 0.68 !important;
}

.${i}__target-details-actions {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 0.32rem !important;
  grid-column: 1 / -1 !important;
}

.${i}__target-details-actions .${i}__target-action {
  justify-content: center !important;
  width: 100% !important;
  min-height: 2rem !important;
  padding-inline: 0.5rem !important;
}

.${i}__target-details-actions .${i}__target-action-label {
  overflow: visible !important;
  text-overflow: clip !important;
}

.${i}__workflow-section--effect-info {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  align-items: center !important;
  gap: 0.14rem 0.5rem !important;
  border-color: rgba(151, 111, 45, 0.26) !important;
  border-left: 3px solid rgba(151, 111, 45, 0.66) !important;
  background: linear-gradient(180deg, rgba(255, 251, 240, 0.82), rgba(255, 245, 219, 0.58)) !important;
}

.${i}__workflow-section--effect-info
  > .${i}__workflow-section-header strong {
  color: rgba(107, 78, 35, 0.95) !important;
}

.${i}__effect-info-body {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.12rem !important;
  min-width: 0 !important;
}

.${i}__effect-info-label {
  color: rgba(36, 27, 24, 0.9) !important;
  font-size: 0.81rem !important;
  font-weight: 850 !important;
  line-height: 1.18 !important;
  overflow-wrap: anywhere !important;
}

.${i}__effect-info-hint {
  color: rgba(36, 27, 24, 0.68) !important;
  font-size: 0.74rem !important;
  font-weight: 700 !important;
  line-height: 1.1 !important;
}

`, document.head.append(e);
}
const Mg = [0, 100, 500, 1500, 3e3];
let Po = !1, Xt = null;
function Fg() {
  if (!Po) {
    Po = !0, Og(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Me(Co(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Me(Co(t));
    }), Hooks.once("ready", () => {
      Me(document), Ug();
    }), document.addEventListener("click", vg), document.addEventListener("keydown", Ng);
    for (const e of Mg)
      globalThis.setTimeout(() => Me(document), e);
  }
}
function Ug() {
  Xt || !document.body || (Xt = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Me(n);
  }), Xt.observe(document.body, { childList: !0, subtree: !0 }));
}
function Me(e) {
  e && (yu(e), ig(e), Wp(e), Pg(e), du(e));
}
function Bg() {
  Fg();
}
const qg = "data-paranormal-toolkit-action-section", Gg = "ritual-log", zg = ".paranormal-toolkit-item-use-prompt__actions", jg = ".paranormal-toolkit-item-use-prompt__actions-title", Vg = [0, 100, 500, 1500];
let vo = !1;
function Hg() {
  if (vo) return;
  const e = (t, n) => {
    No(Qg(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), No(document), vo = !0;
}
function No(e) {
  for (const t of Vg)
    globalThis.setTimeout(() => Wg(e), t);
}
function Wg(e) {
  Kg(e), Yg(e);
}
function Kg(e) {
  for (const t of e.querySelectorAll(
    `[${qg}="${Gg}"]`
  ))
    t.remove();
}
function Yg(e) {
  for (const t of e.querySelectorAll(zg)) {
    if (xo(t.querySelector(jg)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (a) => xo(a.textContent ?? "")
    ).some((a) => a.includes("ritual conjurado")) && t.remove();
  }
}
function Qg(e) {
  if (e instanceof HTMLElement || Zg(e))
    return e;
  if (Xg(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Zg(e) {
  return e instanceof HTMLElement;
}
function Xg(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function xo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Fe = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, as = {
  PV: "system.attributes.hp"
}, Un = {
  PV: [Fe.PV, as.PV],
  SAN: [Fe.SAN],
  PE: [Fe.PE],
  PD: [Fe.PD]
}, Bn = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Jg {
  getResource(t, n) {
    const r = Oo(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, s = `${o}.max`, l = foundry.utils.getProperty(t, a), c = foundry.utils.getProperty(t, s), d = Fo(t, n, a, l, "valor atual");
    if (d) return p(d);
    const f = Fo(t, n, s, c, "valor máximo");
    return f ? p(f) : _({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const o = Oo(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function Oo(e, t) {
  const n = eh(e.type, t);
  if (n && Mo(e, n))
    return _(n);
  const r = Un[t].find(
    (o) => Mo(e, o)
  );
  return r ? _(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: th(e, t),
    path: Un[t].join(" | ")
  });
}
function eh(e, t) {
  return e === "threat" ? as[t] ?? null : e === "agent" ? Fe[t] : null;
}
function Mo(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function th(e, t) {
  const n = e.type ?? "unknown", r = Un[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Fo(e, t, n, r, o) {
  return r == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${o} de ${t} não encontrado: ${n}.`,
    path: n,
    value: r
  } : typeof r != "number" || !Number.isFinite(r) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${o} de ${t} em ${n}.`,
    path: n,
    value: r
  } : null;
}
class nh {
  isRitual(t) {
    return t.type === "ritual";
  }
  getCircle(t) {
    if (!this.isRitual(t))
      return p({
        reason: "not-a-ritual",
        message: `Item ${t.name ?? "sem nome"} não é um ritual.`,
        ritual: t
      });
    const n = this.readCircleFromKnownPaths(t);
    if (!n) {
      const s = Bn.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: o } = n, a = rh(o);
    return a ? _(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Bn.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function rh(e) {
  if (Uo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Uo(n))
      return n;
  }
  return null;
}
function Uo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const oh = "dice-so-nice";
async function is(e) {
  if (!ah() || !ih()) return;
  const t = sh();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      m.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function ah() {
  try {
    return Hc().enabled;
  } catch {
    return !1;
  }
}
function ih() {
  return game.modules?.get?.(oh)?.active === !0;
}
function sh() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Bo = "occultism";
class ss {
  getDifficulty(t) {
    return lh(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await uh(t, Bo);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await is(r);
    const o = fh(r);
    return {
      skill: Bo,
      skillLabel: "Ocultismo",
      roll: r,
      formula: mh(r),
      total: o,
      difficulty: n,
      success: o >= n,
      diceBreakdown: ph(r)
    };
  }
}
function lh(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function ch(e) {
  return new ss().rollCastingCheck(e);
}
async function uh(e, t) {
  const n = e;
  if (typeof n.rollSkill != "function")
    return null;
  const r = await Promise.resolve(
    n.rollSkill(
      { skill: t },
      { configure: !1 },
      {
        create: !1,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );
  return dh(r);
}
function dh(e) {
  return qo(e) ? e : Array.isArray(e) ? e.find(qo) ?? null : null;
}
function qo(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function mh(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function fh(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function ph(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(gh);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const s = a.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function gh(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const hh = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class _h {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const n = this.ritualAdapter.getCircle(t.ritual);
    if (!n.ok)
      return p({
        ...n.error,
        actor: t.actor
      });
    const r = n.value, o = bh(t.ritual, r);
    return o.ok ? o.value ? _(o.value) : _({
      resource: "PE",
      amount: hh[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function bh(e, t) {
  const n = e.getFlag(u, "ritual.cost");
  return n == null ? { ok: !0, value: null } : yh(n) ? {
    ok: !0,
    value: {
      resource: n.resource,
      amount: n.amount,
      source: "custom-flag",
      circle: t
    }
  } : {
    ok: !1,
    error: {
      reason: "invalid-custom-cost",
      message: `Custo customizado do ritual ${e.name ?? "sem nome"} é inválido.`,
      ritual: e,
      value: n
    }
  };
}
function yh(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const Jt = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ah(e) {
  if (!Eh(e.item)) return null;
  const t = qn(e.actor) ? e.actor : Th(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Rh(e.token) ?? $h(t),
    targets: or(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Th(e) {
  const t = e;
  return qn(t.actor) ? t.actor : qn(e.parent) ? e.parent : null;
}
function $h(e) {
  const t = kh(e) ?? wh(e);
  return t ? ls(t) : null;
}
function Rh(e) {
  return Gn(e) ? ls(e) : null;
}
function kh(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Gn(n) ? n : (t.getActiveTokens?.() ?? []).find(Gn) ?? null;
}
function wh(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function ls(e) {
  const t = e.actor ?? null;
  return {
    tokenId: en(e.id),
    actorId: en(t?.id),
    sceneId: en(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Eh(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function qn(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Gn(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function en(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Ih {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(Jt.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, m.info(`${Jt.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Ah(Ch(t));
    if (!n) {
      m.warn(`${Jt.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Ch(e) {
  return e && typeof e == "object" ? e : {};
}
class Sh {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return tn("missing-item-patch");
    if (t.type !== "ritual") return tn("unsupported-item-type");
    const o = Lh(r);
    return Object.keys(o).length === 0 ? tn("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Lh(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (w(t, "system.circle", n.circle), w(t, "system.element", n.element), w(t, "system.target", n.target), w(t, "system.targetQtd", n.targetQuantity), w(t, "system.execution", n.execution), w(t, "system.range", n.range), w(t, "system.duration", n.duration), w(t, "system.skillResis", n.resistanceSkill), w(t, "system.resistance", n.resistance), w(t, "system.studentForm", n.studentForm), w(t, "system.trueForm", n.trueForm)), t;
}
function w(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function tn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Dh {
  constructor(t) {
    this.resourceAdapter = t;
  }
  resourceAdapter;
  getActorSnapshot(t) {
    const n = this.getResources(t);
    return {
      id: t.id ?? null,
      name: t.name ?? "Ator sem nome",
      type: t.type ?? "unknown",
      resources: n.values,
      resourceErrors: n.errors,
      ritualDT: this.getRitualDT(t)
    };
  }
  getRitualDT(t) {
    return this.getNumber(t, Bn.ritual.dt, 0);
  }
  getResources(t) {
    const n = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, r = [];
    for (const o of ["PV", "SAN", "PE", "PD"]) {
      const a = this.resourceAdapter.getResource(t, o);
      a.ok ? n[o] = a.value : r.push(a.error);
    }
    return { values: n, errors: r };
  }
  getNumber(t, n, r) {
    const o = foundry.utils.getProperty(t, n);
    return typeof o == "number" && Number.isFinite(o) ? o : r;
  }
}
class Ph {
  async applyPreset(t, n, r = {}) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "preset",
        presetId: n.id,
        presetVersion: n.version,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: r.definition ?? n.automation
    };
    return await this.writeAutomationFlag(t, o), o;
  }
  async applyManualDefinition(t, n, r = n.label) {
    const o = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: r,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: n
    };
    return await this.writeAutomationFlag(t, o), o;
  }
  async clear(t) {
    await t.unsetFlag(u, "automation");
  }
  async writeAutomationFlag(t, n) {
    await this.clear(t), await t.setFlag(u, "automation", n);
  }
}
class vh {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Nh(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, nn(t)), _(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const o = this.register(r);
      if (!o.ok)
        return o;
      n.push(o.value);
    }
    return _(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? nn(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? _(n) : p({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(nn);
  }
  findForItem(t) {
    return this.list().map((n) => xh(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Nh(e) {
  return !rn(e.id) || !rn(e.version) || !rn(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : _(e);
}
function xh(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = Oh(o, t);
    if (!a.matches)
      return null;
    r += a.score, n.push(a.reason);
  }
  return {
    preset: e,
    score: r,
    reasons: n
  };
}
function Oh(e, t) {
  switch (e.type) {
    case "itemType": {
      const n = e.itemTypes.includes(t.type);
      return {
        matches: n,
        score: n ? 10 : 0,
        reason: `itemType:${t.type}`
      };
    }
    case "normalizedName": {
      const n = Go(t.name), r = e.names.map(Go).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Mh(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function Go(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Mh(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function nn(e) {
  return structuredClone(e);
}
function rn(e) {
  return typeof e == "string" && e.length > 0;
}
function gt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : _(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = Ut(e.amountFrom);
    if (!n)
      return p({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const r = t.rolls[n];
    if (!r)
      return p({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${n}.`
      });
    const o = Math.trunc(r.total);
    return !Number.isInteger(o) || o <= 0 ? p({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : _(o);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Ut(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function Fh(e, t, n) {
  if (!zo(e.id) || !zo(e.formula))
    return p({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(e.formula), o = await Promise.resolve(r.evaluate()), a = o.total;
    if (typeof a != "number" || !Number.isFinite(a))
      return p({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await is(o);
    const l = {
      ...n.rollRequests[e.id] ?? cs(e, t),
      total: a,
      roll: o
    };
    return n.rolls[e.id] = l, _(l);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function cs(e, t) {
  const n = e.intent ?? Uh(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function Uh(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function zo(e) {
  return typeof e == "string" && e.length > 0;
}
async function ht(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? ot(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? ot(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? ot(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? ot(t, n, r, o) : e.recover(t, n, o);
  }
}
function ot(e, t, n, r) {
  return p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    resource: t,
    operation: n,
    reason: "invalid-resource-operation",
    message: `Operação ${n} não é válida para ${t}.`,
    requestedAmount: r
  });
}
function Bh(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const s = qh(t, n, r, o);
    n.damageInstances.push(s), a.emit("afterDamageResolution", n, {
      stepIndex: o,
      step: t,
      damage: s,
      resourceTransaction: r,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), a.emit("afterApplyDamage", n, {
      stepIndex: o,
      step: t,
      damage: s,
      resourceTransaction: r,
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
    const s = Gh(t, n, r, o);
    n.healingInstances.push(s), a.emit("afterApplyHealing", n, {
      stepIndex: o,
      step: t,
      healing: s,
      resourceTransaction: r,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount
      }
    });
  }
}
function qh(e, t, n, r) {
  const o = Ut(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: us(t.id, "damage", r, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    damageType: a?.damageType,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Gh(e, t, n, r) {
  const o = Ut(e.amountFrom);
  return {
    id: us(t.id, "healing", r, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: o ?? void 0,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function us(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function zh(e, t, n) {
  const r = Ut(e.amountFrom), o = r ? t.rolls[r] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    amountFrom: e.amountFrom,
    rollId: r,
    rollIntent: o?.intent,
    damageType: o?.damageType
  };
}
function jh(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), ds("before", e), jo("before", e), jo("resolve", e);
}
function Vh(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), ds("apply", e);
}
function Hh(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function ds(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = t, l = Wh(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function jo(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Wh(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Kh(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), _(void 0);
  } catch (r) {
    return p({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function Yh(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Qh(e, t);
    case "spendRitualCost":
      return Zh(e, t);
  }
}
async function Qh(e, t) {
  const { context: n, resources: r } = e, o = gt(t, n);
  return o.ok ? ms(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function Zh(e, t) {
  const { context: n, resources: r, ritualCosts: o } = e, a = o.getCost({
    actor: n.sourceActor,
    ritual: n.item
  });
  if (!a.ok)
    return p({
      reason: "ritual-cost-failed",
      message: a.error.message,
      cause: a.error
    });
  const s = a.value;
  return n.ritualCosts.push({
    ...s,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), ms(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function ms(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), _(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Xh(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, s = Jh(t);
  for (const c of s.before)
    o.emit(c, n, { stepIndex: r, step: t });
  const l = await a();
  if (!l.ok)
    return l;
  for (const c of s.after)
    o.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function Jh(e) {
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
class e_ {
  constructor(t, n, r, o) {
    this.resources = t, this.ritualCosts = n, this.messages = r, this.lifecycle = o;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, n) {
    if (t.steps.length === 0)
      return p({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: n
      });
    for (const [r, o] of t.steps.entries()) {
      const a = await this.runStep(o, n, r);
      if (!a.ok)
        return a;
    }
    return _({ definition: t, context: n });
  }
  async runStep(t, n, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, r);
      default:
        return Xh({
          step: t,
          context: n,
          stepIndex: r,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(t, n, r)
        });
    }
  }
  async executeStep(t, n, r) {
    switch (t.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(t, n, r);
      case "rollFormula":
        return this.runRollFormulaStep(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStep(t, n, r);
      case "chatCard":
        return this.runChatCardStep(t, n, r);
      default:
        return p({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: r,
          step: t,
          context: n
        });
    }
  }
  async runCostStep(t, n, r) {
    const o = await Yh({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? _(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = cs(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const s = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: s }), _(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await Fh(t, r, n);
    return o.ok ? _(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = gt(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = zh(t, n, o.value);
    jh({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), Vh({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, n);
    if (s.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const l of s) {
      const c = await ht(this.resources, l, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(c, n, r, t);
      if (!d.ok)
        return d;
      Bh({
        step: t,
        context: n,
        transaction: d.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Hh({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), _(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = gt(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = this.resolveActors(t.actor, n);
    if (a.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const s of a) {
      const l = await ht(this.resources, s, t.resource, t.operation, o.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return _(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await Kh(this.messages, t, n);
    return o.ok ? _(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, o) {
    return t.ok ? (n.resourceTransactions.push(t.value), _(t.value)) : p({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: o,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, o, a, s) {
    const l = t_(t, n.intent);
    l && this.lifecycle.emit(l, r, {
      stepIndex: o,
      step: a,
      rollRequest: n,
      rollResult: s
    });
  }
  resolveActors(t, n) {
    switch (t) {
      case "self":
        return [n.sourceActor];
      case "target":
        return n.targets.flatMap((r) => r.actor ? [r.actor] : []);
    }
  }
}
function t_(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class n_ {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async spend(t, n, r) {
    return this.execute(t, n, "spend", r);
  }
  async damage(t, n, r) {
    return this.execute(t, n, "damage", r);
  }
  async heal(t, n, r) {
    return this.execute(t, n, "heal", r);
  }
  async recover(t, n, r) {
    return this.execute(t, n, "recover", r);
  }
  async execute(t, n, r, o) {
    if (!Number.isInteger(o) || o <= 0)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: o
      });
    const a = this.adapter.getResource(t, n);
    if (!a.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: a.error.reason,
        message: a.error.message,
        requestedAmount: o,
        path: a.error.path,
        value: a.error.value
      });
    const s = a.value, l = this.calculate(r, s, o);
    if (!l.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: l.error.reason,
        message: l.error.message,
        requestedAmount: o,
        current: s.value,
        required: o
      });
    const { afterValue: c, appliedAmount: d } = l.value, f = {
      value: c,
      max: s.max
    };
    try {
      c !== s.value && await this.adapter.updateResourceValue(t, n, c);
    } catch (y) {
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "update-failed",
        message: `Falha ao atualizar ${n} no ator.`,
        requestedAmount: o,
        current: s.value,
        required: o,
        cause: y
      });
    }
    return _({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: o,
      appliedAmount: d,
      before: s,
      after: f
    });
  }
  calculate(t, n, r) {
    switch (t) {
      case "spend":
        return n.value < r ? p({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${n.value}; custo: ${r}.`
        }) : _({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const o = Math.max(0, n.value - r);
        return _({
          afterValue: o,
          appliedAmount: n.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(n.max, n.value + r);
        return _({
          afterValue: o,
          appliedAmount: o - n.value
        });
      }
    }
  }
}
class r_ {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async rollCastingCheck(t) {
    return this.adapter.rollCastingCheck(t);
  }
  getDifficulty(t) {
    return this.adapter.getDifficulty?.(t) ?? null;
  }
}
function fs(e) {
  return {
    id: o_(),
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
function o_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class a_ {
  constructor(t, n) {
    this.automation = t, this.hooks = n;
  }
  automation;
  hooks;
  lastContext = null;
  getLastContext() {
    return this.lastContext;
  }
  getLastDebugSnapshot() {
    return ie(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = fs(n);
    this.lastContext = r, this.hooks.emit("created", r, {
      metadata: {
        definitionLabel: t.label,
        itemId: r.item.id ?? null,
        itemName: r.item.name ?? "Item sem nome"
      }
    }), this.hooks.emit("beforeItemUse", r), this.hooks.emit("resolveTargets", r, {
      metadata: {
        targetCount: r.targets.length
      }
    });
    const o = await this.automation.run(t, r);
    return o.ok ? (this.hooks.emit("completed", r), o) : (this.emitFailed(r, o.error), o);
  }
  emitFailed(t, n) {
    this.hooks.emit("failed", t, {
      stepIndex: n.stepIndex,
      step: n.step,
      metadata: {
        reason: n.reason,
        message: n.message
      }
    });
  }
}
class i_ {
  emit(t, n, r = {}) {
    const o = {
      phase: t,
      context: n,
      stepIndex: r.stepIndex,
      step: r.step,
      rollRequest: r.rollRequest,
      rollResult: r.rollResult,
      damage: r.damage,
      healing: r.healing,
      resourceTransaction: r.resourceTransaction,
      metadata: r.metadata
    };
    return n.phases.push(t), n.lifecycleEvents.push({
      phase: t,
      stepIndex: r.stepIndex,
      stepType: r.step?.type,
      rollId: r.rollRequest?.id ?? r.rollResult?.id,
      rollIntent: r.rollRequest?.intent ?? r.rollResult?.intent,
      damageId: r.damage?.id,
      healingId: r.healing?.id,
      resourceOperation: r.resourceTransaction?.operation,
      timestamp: Date.now()
    }), Hooks.callAll(`${u}.workflow.${t}`, o), Hooks.callAll(`${u}.workflow.phase`, o), o;
  }
}
class s_ {
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
    const n = gn();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: l_(),
      flags: {
        ...t.flags,
        [u]: {
          ...c_(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && m.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = gn();
    if (!r.enabled)
      return;
    const o = n.notification ?? Vo(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = Vo(n);
    switch (t) {
      case "info":
        m.info(r, n.data ?? "");
        return;
      case "warn":
        m.warn(r, n.data ?? "");
        return;
      case "error":
        m.error(r, n.data ?? "");
        return;
    }
  }
  emitUi(t, n) {
    switch (t) {
      case "info":
        ui.notifications?.info(`Paranormal Toolkit: ${n}`);
        return;
      case "warn":
        ui.notifications?.warn(`Paranormal Toolkit: ${n}`);
        return;
      case "error":
        ui.notifications?.error(`Paranormal Toolkit: ${n}`);
        return;
    }
  }
}
function Vo(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function l_() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function c_(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const u_ = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", ps = `${u}-inline-roll-neutralized`, d_ = `${u}-inline-roll-notice`, Ir = `data-${u}-inline-roll-neutralized`, Ho = `data-${u}-inline-roll-notice`, m_ = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Wo(e) {
  const t = E_(e.message), n = await f_(e.message), r = p_(t);
  return n.replacementCount + r.replacementCount > 0 && m.info("Rolagens inline neutralizadas para item automatizado.", {
    itemId: e.item.id ?? null,
    itemName: e.item.name ?? "Item sem nome",
    messageId: t,
    contentReplacementCount: n.replacementCount,
    renderedReplacementCount: r.replacementCount
  }), {
    messageId: t,
    contentUpdated: n.updated,
    contentReplacementCount: n.replacementCount,
    renderedReplacementCount: r.replacementCount
  };
}
async function f_(e) {
  const t = R_(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = g_(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await k_(t, n.content), replacementCount: n.replacementCount };
}
function p_(e) {
  const t = e ? w_(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = gs(t);
  return n > 0 && hs(A_(t)), { replacementCount: n };
}
function g_(e) {
  const t = h_(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = gs(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (hs(n.content), { content: n.innerHTML, replacementCount: o });
}
function h_(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, b_(o.trim()))), replacementCount: t };
}
function gs(e) {
  const t = __(e);
  for (const n of t)
    n.replaceWith(y_(T_(n)));
  return t.length;
}
function __(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(u_))
    n.getAttribute(Ir) !== "true" && t.add(n);
  return Array.from(t);
}
function b_(e) {
  return `<span class="${ps}" ${Ir}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${I_(e)}</span>`;
}
function y_(e) {
  const t = document.createElement("span");
  return t.classList.add(ps), t.setAttribute(Ir, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function hs(e) {
  if (e.querySelector?.(`[${Ho}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(d_), t.setAttribute(Ho, "true"), t.textContent = m_, e.append(t);
}
function A_(e) {
  return e.querySelector(".message-content") ?? e;
}
function T_(e) {
  const n = e.getAttribute("data-formula") ?? $_(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function $_(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function R_(e) {
  return e && typeof e == "object" ? e : null;
}
async function k_(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return m.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function w_(e) {
  const t = C_(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function E_(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function I_(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function C_(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const _t = "ritualRollConfig", Te = "ritual-roll";
function Bt() {
  return {
    schemaVersion: 1,
    intent: "damage",
    damageType: null,
    utilityLabel: "Resultado",
    note: "",
    forms: {
      base: { formula: "" },
      discente: { formula: "" },
      verdadeiro: { formula: "" }
    }
  };
}
function _s(e) {
  const t = e.getFlag(u, _t);
  return zn(t);
}
function bs(e) {
  return _s(e) ?? Bt();
}
async function S_(e, t) {
  const n = zn(t) ?? zn({
    ...Bt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(u, _t, n), n;
}
async function L_(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, u, _t));
    return;
  }
  await e.setFlag(u, _t, null);
}
function zn(e) {
  if (!qt(e)) return null;
  const t = U_(e.intent);
  if (!t) return null;
  const n = Bt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: bt(e.damageType),
    utilityLabel: bt(e.utilityLabel) ?? n.utilityLabel,
    note: Cr(e.note),
    forms: B_(e.forms)
  };
}
function D_(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function P_(e) {
  const t = _s(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = v_(t, n), o = [
    { type: "spendRitualCost" },
    r,
    ...N_(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: o,
    ritualForms: O_(e, t),
    resistance: t.intent === "damage" ? M_(e) : void 0
  };
}
function v_(e, t) {
  const n = {
    type: "rollFormula",
    id: Te,
    formula: t,
    intent: F_(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function N_(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Te}.total`,
          ...x_(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${Te}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function x_(e) {
  return e ? { damageType: e } : {};
}
function O_(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [Te]: n
      }
    }
  };
  return Ko(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [Te]: t.forms.discente.formula.trim()
    }
  }), Ko(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [Te]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function M_(e) {
  const t = ys(e), n = bt(t.skillResis), r = bt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const o = q_(n);
  return {
    skill: n,
    label: o,
    effect: "reducesByHalf",
    summary: `${o} reduz à metade`
  };
}
function F_(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function U_(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function B_(e) {
  const t = Bt();
  return qt(e) ? {
    base: on(e.base),
    discente: on(e.discente),
    verdadeiro: on(e.verdadeiro)
  } : t.forms;
}
function on(e) {
  return qt(e) ? { formula: Cr(e.formula) } : { formula: "" };
}
function Ko(e, t) {
  const n = ys(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return G_(r);
}
function ys(e) {
  const t = e.system;
  return qt(t) ? t : {};
}
function q_(e) {
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
function G_(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function Cr(e) {
  return typeof e == "string" ? e.trim() : "";
}
function bt(e) {
  const t = Cr(e);
  return t.length > 0 ? t : null;
}
function qt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function z_(e) {
  switch (j_(e)) {
    case "cutting":
    case "cuttingdamage":
    case "corte":
      return "Corte";
    case "impact":
    case "impactdamage":
    case "impacto":
      return "Impacto";
    case "piercing":
    case "piercingdamage":
    case "perfurante":
      return "Perfurante";
    case "ballistic":
    case "ballisticdamage":
    case "balistico":
      return "Balístico";
    case "blood":
    case "blooddamage":
    case "sangue":
      return "Sangue";
    case "death":
    case "deathdamage":
    case "morte":
      return "Morte";
    case "knowledge":
    case "knowledgedamage":
    case "conhecimento":
      return "Conhecimento";
    case "energy":
    case "energydamage":
    case "energia":
      return "Energia";
    case "fear":
    case "feardamage":
    case "medo":
      return "Medo";
    case "fire":
    case "firedamage":
    case "fogo":
      return "Fogo";
    case "cold":
    case "colddamage":
    case "frio":
      return "Frio";
    case "electric":
    case "electricdamage":
    case "eletricdamage":
    case "eletricodamage":
    case "eletricidade":
    case "eletrico":
    case "eletrica":
      return "Eletricidade";
    case "chemical":
    case "chemicaldamage":
    case "quimico":
    case "quimica":
      return "Químico";
    case "mental":
    case "mentaldamage":
      return "Mental";
    case null:
      return "Sem tipo";
    default:
      return V_(String(e ?? ""));
  }
}
function j_(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function V_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function H_(e) {
  return {
    header: {
      eyebrow: Jn,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: Z_(e.ritual)
    },
    forms: e.variantOptions.map((t) => W_(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: Q_(e.automationStatus ?? "assisted")
  };
}
function W_(e, t) {
  const n = K_(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? Y_(t) : "—",
    details: n
  };
}
function K_(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function Y_(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function Q_(e) {
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
function Z_(e) {
  const t = e.system, n = [J_(t?.element), X_(t?.circle)].filter(nb);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function X_(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function J_(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (eb(e)) {
    case "blood":
    case "op.elementchoices.blood":
      return "Sangue";
    case "death":
    case "op.elementchoices.death":
      return "Morte";
    case "knowledge":
    case "op.elementchoices.knowledge":
      return "Conhecimento";
    case "energy":
    case "op.elementchoices.energy":
      return "Energia";
    case "fear":
    case "op.elementchoices.fear":
      return "Medo";
    default:
      return tb(e);
  }
}
function eb(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function tb(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function nb(e) {
  return typeof e == "string" && e.length > 0;
}
const As = ["base", "discente", "verdadeiro"];
function Ts(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function yt(e) {
  return typeof e == "string" && As.includes(e);
}
const { ApplicationV2: rb } = foundry.applications.api;
class Ue extends rb {
  constructor(t, n) {
    super({
      id: `${u}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = H_(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
  }
  resolveRequest;
  model;
  selectedVariant = "base";
  spendResource = !0;
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
      cast: Ue.onCast,
      cancel: Ue.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new Ue(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    ab(o, (a) => {
      this.selectedVariant = a;
    }), ib(o, (a) => {
      this.spendResource = a;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${E(this.model.header.eyebrow)}</p>
        <div>
          <h2>${E(this.model.header.title)}</h2>
          <p>${E(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(ob).join("")}
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
          <div><dt>Custo base</dt><dd>${E(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${E(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${E(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${E(this.model.automation.title)}</strong></p>
        <p>${E(this.model.automation.description)}</p>
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
    const n = cb(t), r = sb(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function ob(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((a) => `<span>${E(a)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${E(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${E(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${E(e.label)}</strong>
        <em>${E(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function ab(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Yo(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Yo(e, o, t));
    });
  const r = $s(e);
  r && t(r);
}
function Yo(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !yt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), $s(e));
}
function $s(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && yt(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function ib(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function sb(e, t, n) {
  const r = lb(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function lb(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (yt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return yt(n) ? n : null;
}
function cb(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function E(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function ub(e) {
  return Ue.request(e);
}
const Sr = {
  label: "Padrão"
}, db = {
  label: "Discente",
  extraCost: 2
}, mb = {
  label: "Verdadeiro",
  extraCost: 5
};
class fb {
  constructor(t, n, r) {
    this.workflow = t, this.resources = n, this.ritualCosts = r;
  }
  workflow;
  resources;
  ritualCosts;
  canHandle(t, n) {
    return t.item.type === "ritual" || n.steps.some((r) => r.type === "spendRitualCost");
  }
  async run(t, n) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const r = this.resolveCostPreview(t), o = ry(n), a = ey(
      n,
      t.item,
      r,
      o
    ), s = await ub({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((C) => C.name),
      cost: r,
      defaultSpendResource: cy(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = pb(s), c = ay(
      n,
      t.item,
      l.variant,
      o
    ), d = za();
    let f = null;
    if (d) {
      const C = await hb(
        this.resources,
        t.actor,
        l,
        c,
        r
      );
      if (!C.ok)
        return {
          status: "failed",
          reason: C.reason,
          message: C.message
        };
      try {
        f = await ch(
          t.actor
        );
      } catch (x) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: x instanceof Error ? x.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: x
        };
      }
    }
    const y = gb(
      n,
      l,
      c,
      r,
      {
        includeCostSteps: !d
      }
    );
    if (y.steps.length === 0) {
      const C = oy(
        t,
        l
      ), x = Qo(
        t.actor,
        f,
        c,
        r
      ), me = Zo(
        n,
        l,
        c,
        r,
        C,
        t,
        f
      );
      return x.length > 0 ? {
        status: "ready",
        workflowContext: C,
        actions: x,
        summaryLines: me
      } : {
        status: "completed-without-actions",
        workflowContext: C,
        summaryLines: me
      };
    }
    const T = await this.workflow.runAutomation(y, {
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
          variant: l.variant,
          spendResource: l.spendResource
        }
      }
    });
    if (!T.ok)
      return {
        status: "failed",
        reason: T.error.reason,
        message: T.error.message,
        cause: T.error
      };
    const $ = T.value.context, g = Rb(
      n,
      t,
      $
    ), V = bb(
      n,
      t
    ), De = Qo(
      t.actor,
      f,
      c,
      r
    ), Pe = Zo(
      n,
      l,
      c,
      r,
      $,
      t,
      f
    );
    if (!g.ok)
      return {
        status: "failed",
        reason: g.reason,
        message: g.message
      };
    if (!V.ok)
      return {
        status: "failed",
        reason: V.reason,
        message: V.message
      };
    const de = [
      ...De,
      ...g.actions,
      ...V.actions
    ];
    return de.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: $,
      summaryLines: Pe
    } : {
      status: "ready",
      workflowContext: $,
      actions: de,
      summaryLines: Pe
    };
  }
  async applyAction(t) {
    return ht(
      this.resources,
      t.actor,
      t.resource,
      t.operation,
      t.amount
    );
  }
  resolveCostPreview(t) {
    if (!t.actor) return null;
    const n = this.ritualCosts.getCost({
      actor: t.actor,
      ritual: t.item
    });
    return n.ok ? n.value : null;
  }
}
function pb(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function gb(e, t, n, r, o) {
  const a = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || Dr(l) && (!o.includeCostSteps || !s) || a.push(_b(l, n));
  return o.includeCostSteps && s && r && uy(n.extraCost) && a.push({
    type: "spendResource",
    actor: "self",
    resource: r.resource,
    amount: n.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: a
  };
}
async function hb(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Ke(o, r);
  if (!a)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (a.amount <= 0) return { ok: !0 };
  const s = await e.spend(
    t,
    a.resource,
    a.amount
  );
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function _b(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Qo(e, t, n, r) {
  if (!t || t.success) return [];
  const o = Ke(r, n);
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
function bb(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = Lr(r.actor, t);
    if (o.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const a of o) {
      const s = fi(a);
      n.push(
        yb(
          r,
          a,
          t.item,
          s
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function yb(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? $b(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: Ab(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Tb(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Ab(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Tb(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function $b(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Rb(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const s = gt(a, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = Lr(a.actor, t);
    if (l.length === 0) {
      if (a.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const c of l) {
      if (kb(a)) {
        wb(
          o,
          c,
          Eb(a, n, s.value)
        );
        continue;
      }
      r.push(Cb(a, c, s.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...Ib(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function kb(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function wb(e, t, n) {
  const r = Pb(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Eb(e, t, n) {
  const r = vb(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function Ib(e, t, n, r) {
  const o = Mb(e), a = o.length > 1 ? Bb() : void 0;
  return o.map((s) => {
    const l = r.map(
      (d, f) => {
        const y = Fb(d.amount, s);
        return {
          id: Sb(d, s, f),
          amount: y,
          damageType: d.damageType,
          sourceRollId: d.sourceRollId,
          ignoreResistance: d.step.ignoreResistance === !0
        };
      }
    ), c = l.reduce(
      (d, f) => d + f.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: l,
      label: Lb(c, s, o.length > 1),
      executedLabel: Db(
        n.name ?? "Ator sem nome",
        s,
        o.length > 1
      ),
      choiceGroupId: a,
      choiceGroupResolvedLabel: a ? "✓ Outra opção escolhida" : void 0,
      actionSectionId: "apply-damage",
      actionSectionTitle: "Aplicar danos",
      source: "item-use.damage-action",
      originUuid: t.uuid ?? null
    };
  });
}
function Cb(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = Ob(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: Nb(e, r, n),
    executedLabel: xb(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function Sb(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function Lb(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function Db(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Pb(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function vb(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function Nb(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function xb(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Ob(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Mb(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Fb(e, t) {
  const n = e * t.multiplier, r = Ub(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function Ub(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Bb() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Lr(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Zo(e, t, n, r, o, a, s = null) {
  return [
    `Forma: ${Ts(t.variant)}`,
    jb(t, n, r),
    ...zb(s),
    ...Object.values(o.rolls).flatMap(Vb),
    ...qb(e, a),
    ...Hb(e.resistance),
    ...Xb(n)
  ];
}
function qb(e, t) {
  return Gb(e) ? Lr("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function Gb(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function zb(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function jb(e, t, n) {
  const r = Ke(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function Vb(e) {
  const n = [`${Jb(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = Wb(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${z_(e.damageType)}`), n;
}
function Hb(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function Wb(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const n = [];
  let r = "+";
  for (const o of t) {
    if (!o || typeof o != "object") continue;
    const a = o;
    if (a.operator === "+" || a.operator === "-") {
      r = a.operator;
      continue;
    }
    const s = Kb(a);
    s && (Zb(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function Kb(e) {
  const t = Yb(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : Qb(e);
}
function Yb(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function Qb(e) {
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
function Zb(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function Xb(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function Jb(e) {
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
function ey(e, t, n, r) {
  return As.map((o) => {
    const a = Rs(
      e,
      t,
      o,
      r
    ), s = a !== null;
    return {
      variant: o,
      label: a?.label ?? Ts(o),
      enabled: s,
      details: a ? ty(a, n, r) : [],
      finalCostText: a ? ny(n, a) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function ty(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = Ke(t, e);
  return r.push(
    a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"
  ), r;
}
function Ke(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function ny(e, t) {
  const n = Ke(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function ry(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Dr);
}
function oy(e, t) {
  return fs({
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
function ay(e, t, n, r) {
  return Rs(e, t, n, r) ?? Sr;
}
function Rs(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? sy(t, n) ? iy(n) : null : n === "base" ? Sr : null);
}
function iy(e) {
  switch (e) {
    case "base":
      return Sr;
    case "discente":
      return db;
    case "verdadeiro":
      return mb;
  }
}
function sy(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return ly(foundry.utils.getProperty(e, n));
}
function ly(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function cy(e) {
  return e.steps.some(Dr);
}
function Dr(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function uy(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const ks = "itemUsePrompts", ws = "chatCard", Gt = "data-paranormal-toolkit-prompt-id", zt = "data-paranormal-toolkit-pending-id", Pr = "data-paranormal-toolkit-executed-label", jn = "data-paranormal-toolkit-choice-group", Es = "data-paranormal-toolkit-skipped-label", Xo = "data-paranormal-toolkit-action-section", Jo = "data-paranormal-toolkit-detail-key", ea = "data-paranormal-toolkit-roll-card", vr = "data-paranormal-toolkit-roll-detail-toggle", Is = "data-paranormal-toolkit-roll-detail-id", Cs = "data-paranormal-toolkit-resistance-roll-button", Ss = "data-paranormal-toolkit-resistance-skill", Ls = "data-paranormal-toolkit-resistance-skill-label", Ds = "data-paranormal-toolkit-resistance-target-actor-id", Ps = "data-paranormal-toolkit-resistance-target-name", vs = "data-paranormal-toolkit-resistance-roll-result", ta = "data-paranormal-toolkit-system-card-replaced", dy = `[${zt}]`, my = `[${vr}]`, fy = `[${Cs}]`, Vn = `${u}-chat-enrichment`, h = `${u}-item-use-prompt`, py = `${h}__actions`, na = `${h}__details`, Ns = `${h}__summary`, gy = `${h}__title`, xs = `${h}__button--executed`, ra = `${h}__roll-card`;
let oa = !1, Hn = null;
const N = /* @__PURE__ */ new Map(), hy = [0, 100, 500, 1500, 3e3], _y = 3e4, by = [0, 100, 500, 1500, 3e3];
function yy(e) {
  if (Hn = e, oa) {
    ia(e);
    return;
  }
  const t = (n, r) => {
    Ms(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), oa = !0, ia(e);
}
async function aa(e) {
  const t = Os(e);
  N.set(e.pendingId, t), await Or(t) || Ws(t), Fs(e.pendingId);
}
async function Ay(e) {
  const t = Os({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", N.set(e.pendingId, t), await Or(t) || Ws(t), Fs(e.pendingId);
}
async function an(e, t) {
  const n = N.get(e);
  N.delete(e), n && await yA(n, t);
}
function Nr(e) {
  const t = Js();
  for (const n of t) {
    const r = j(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function Ty(e, t) {
  const n = Nr(e);
  if (!n) return;
  const r = j(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await Ce(n.message, r));
}
async function $y(e, t, n) {
  if (!t) return;
  const r = Nr(e);
  if (!r) return;
  const o = j(r.message);
  let a = !1;
  for (const [s, l] of Object.entries(o))
    s !== e && l.choiceGroupId === t && (o[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await Ce(r.message, o);
}
function Os(e) {
  const t = Z(e.context.message), n = e.context.targets.find((s) => Qn(s)), r = n ? Qn(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: Ky(e.context),
    executed: !1
  };
}
function Ms(e, t, n) {
  bA();
  const r = Vt(t);
  if (!r) return;
  const o = gA(e, r);
  o.length > 0 && At(r);
  for (const a of o)
    Wn(r, a);
  qs(r, n), Kn(r), Yn(r);
}
function ia(e) {
  for (const t of by)
    globalThis.setTimeout(() => {
      Ry(e);
    }, t);
}
function Ry(e) {
  for (const t of ky()) {
    const n = jt(t);
    wy(n) && Ms(n, t, e);
  }
}
function ky() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function wy(e) {
  return e ? Mr(e) ? !0 : TA(e).length > 0 : !1;
}
function Fs(e) {
  const t = N.get(e);
  if (!t) return;
  const n = t.messageId ? hA(t.messageId) : null;
  if (n) {
    da(n, t), At(n), Wn(n, t), sa(n), Kn(n), Yn(n);
    return;
  }
  if (t.messageId) {
    Xn(t);
    return;
  }
  const r = _A(t);
  if (r) {
    da(r, t), At(r), Wn(r, t), sa(r), Kn(r), Yn(r);
    return;
  }
  Xn(t);
}
function sa(e) {
  Hn && qs(e, Hn);
}
function At(e) {
  const t = Ey();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Bs(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(ta) === "true") return;
  const r = n.querySelector(`.${Vn}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(ta, "true");
}
function Ey() {
  try {
    return mc() === "replace";
  } catch {
    return !1;
  }
}
function Wn(e, t) {
  if (At(e), e.querySelector(`[${Gt}="${Se(t.pendingId)}"]`)) return;
  const n = Iy(e, t);
  Sy(n, t), zy(n, jy(t)).append(Wy(t));
}
function Iy(e, t) {
  const n = e.querySelector(`.${Vn}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Vn, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(gy), s.textContent = Cy(t);
  const l = document.createElement("span");
  return l.classList.add(Ns), l.textContent = t.summary, o.append(a, s, l), r.append(o), Qy(e).append(r), r;
}
function Cy(e) {
  const t = I(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Sy(e, t) {
  const n = t.summaryLines ?? [], r = Vs(n, t);
  if (r) {
    Ly(e, r, t);
    return;
  }
  Vy(e, n);
}
function Ly(e, t, n) {
  if (e.querySelector(`[${ea}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(ra, `${ra}--${t.intent}`), r.setAttribute(ea, "true"), t.castingCheck && la(r, Py(t.castingCheck), n.pendingId, "casting"), Dy(t) && la(r, vy(t), n.pendingId, "effect"), Fy(r, t), Uy(r, t, n), Gy(r, t), e.append(r);
}
function Dy(e) {
  return e.intent !== "casting";
}
function Py(e) {
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
function vy(e) {
  const t = e.intent === "healing" ? "Cura" : e.intent === "damage" ? "Dano" : e.label, n = e.damageType ? `${e.damageType}` : null;
  return {
    kind: "effect",
    title: t,
    label: e.label,
    formula: e.formula,
    total: e.total,
    diceBreakdown: e.diceBreakdown,
    description: n,
    detailRows: [
      { label: "Fórmula", value: e.formula },
      ...e.diceBreakdown ? [{ label: "Dados", value: e.diceBreakdown }] : [],
      ...e.damageType ? [{ label: "Tipo", value: e.damageType }] : []
    ]
  };
}
function la(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${h}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, a.append(s), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, a.append(l);
  }
  if (o.append(a), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, o.append(l);
  }
  Ny(o, t), qy(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Ny(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = xy(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function xy(e, t) {
  const n = Oy(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of My(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function Oy(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function My(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ca(e, "highest") : n.includes("kl") ? ca(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ca(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function Fy(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(UA);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function Uy(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const s = By(t, n);
  o.append(a), s && o.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(o, l), t.resistanceRollResult && r.append(Us(t.resistanceRollResult)), e.append(r);
}
function By(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Gt, t.pendingId), n.setAttribute(Cs, "true"), n.setAttribute(Ss, e.resistanceSkill), n.setAttribute(Ls, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Ds, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Ps, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(vs, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Us(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = zs(e), t;
}
function qy(e, t, n, r, o) {
  const a = t.filter((d) => d.value.trim().length > 0);
  if (a.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(vr, s), l.setAttribute("aria-expanded", "false"), l.textContent = o;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Is, s), c.hidden = !0;
  for (const d of a) {
    const f = document.createElement("dt");
    f.textContent = d.label;
    const y = document.createElement("dd");
    y.textContent = d.value, c.append(f, y);
  }
  e.append(l, c);
}
function Gy(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function zy(e, t) {
  const n = `[${Xo}="${Se(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(py), o.setAttribute(Xo, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function jy(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = Vs(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function Vy(e, t) {
  if (t.length === 0) return;
  const n = Hy(e);
  for (const r of t) {
    const o = BA(r);
    if (n.querySelector(`[${Jo}="${Se(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(Jo, o), n.append(a);
  }
}
function Hy(e) {
  const t = e.querySelector(`.${na}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(na), e.append(n), n;
}
function Wy(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(Gt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(xs), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(zt, e.pendingId), t.setAttribute(Pr, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(jn, e.choiceGroupId), t.setAttribute(Es, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function Ky(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = Yy(e);
  return `${t} → ${n}`;
}
function Yy(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function Qy(e) {
  return Bs(e) ?? e;
}
function Bs(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function qs(e, t) {
  const n = Vt(e);
  if (!n) return;
  const r = n.querySelectorAll(dy);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      uA(o, t);
    }));
}
function Kn(e) {
  const t = Vt(e);
  if (!t) return;
  const n = t.querySelectorAll(my);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      Zy(t, r);
    }));
}
function Yn(e) {
  const t = Vt(e);
  if (!t) return;
  const n = t.querySelectorAll(fy);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      Xy(t, r);
    }));
}
function Zy(e, t) {
  const n = t.getAttribute(vr);
  if (!n) return;
  const r = e.querySelector(`[${Is}="${Se(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function Xy(e, t) {
  const n = t.getAttribute(Gt), r = t.getAttribute(Ss), o = t.getAttribute(Ls) ?? (r ? se(r) : "Resistência");
  if (!n || !r) return;
  const a = tA(e, n), s = nA(a, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await kd(s, r);
    await sA(c.roll);
    const d = {
      skill: r,
      skillLabel: o,
      formula: c.formula,
      total: c.total,
      targetName: s.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: c.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Jy(t, d), eA(t, d), lA(n, d), await cA(e, n, d);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function Jy(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(vs, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function eA(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Us(t);
  if (r) {
    r.textContent = zs(t);
    return;
  }
  n.append(o);
}
function tA(e, t) {
  const n = N.get(t);
  if (n) return n;
  const r = jt(e);
  return j(r)[t] ?? null;
}
function nA(e, t) {
  const n = e?.resistanceTargetActor;
  if (B(n)) return n;
  const o = e?.context?.targets.map(Qn).find(B) ?? null;
  if (o) return o;
  const a = t.getAttribute(Ds) ?? e?.resistanceTargetActorId ?? null, s = a ? oA(a) : null;
  return s || aA(
    t.getAttribute(Ps) ?? e?.resistanceTargetName ?? rA(t)
  );
}
function rA(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Ns}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function Qn(e) {
  const t = e.actor;
  if (B(t)) return t;
  const n = e.token, r = ze(n);
  if (r) return r;
  const o = e.document;
  return ze(o);
}
function ze(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (B(t)) return t;
  const n = e.document?.actor;
  return B(n) ? n : null;
}
function oA(e) {
  const n = game.actors?.get?.(e);
  return B(n) ? n : Gs().map((a) => ze(a)).find((a) => a?.id === e) ?? null;
}
function aA(e) {
  const t = $e(e);
  if (!t) return null;
  const n = Gs().filter((a) => $e(iA(a)) === t).map((a) => ze(a)).find(B) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => B(a) && $e(a.name) === t);
  return B(o) ? o : null;
}
function Gs() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function iA(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : ze(e)?.name ?? null;
}
function $e(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function B(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function zs(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function sA(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function lA(e, t) {
  const n = N.get(e);
  n && (n.resistanceRollResult = t);
}
async function cA(e, t, n) {
  const r = jt(e);
  if (r)
    try {
      const o = j(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await Ce(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function jt(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return G(r?.get?.(n));
}
async function uA(e, t) {
  const n = e.getAttribute(zt);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    js(e, e.getAttribute(Pr) ?? "✓ Automação aplicada"), dA(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function js(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(xs), e.removeAttribute(zt), e.removeAttribute(Pr);
}
function dA(e) {
  const t = e.getAttribute(jn);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${jn}="${Se(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(Es) ?? "✓ Outra opção escolhida";
    js(o, a);
  }
}
function Vs(e, t) {
  const n = e.map(xr).filter(MA), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = I(e, "Forma"), a = I(e, "Custo"), s = I(e, "Dados") ?? I(e, `Dados (${r.label})`), l = I(e, "Tipo"), c = I(e, "Resistência"), d = I(e, "Resistência Perícia"), f = I(e, "Resistência Rótulo") ?? (d ? se(d) : null), y = Hs(e, "Observação"), T = e.filter((g) => pA(g, r)), $ = mA(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: s,
    damageType: l,
    resistance: c,
    resistanceSkill: d,
    resistanceSkillLabel: f,
    notes: y,
    details: T,
    castingCheck: $,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function mA(e) {
  const t = e.map(xr).find((a) => a?.intent === "casting") ?? null, n = I(e, "Conjuração DT"), r = I(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: I(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: I(e, "Dados (Conjuração)")
  } : null;
}
function xr(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: fA(n)
  } : null;
}
function fA(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function I(e, t) {
  return Hs(e, t)[0] ?? null;
}
function Hs(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function pA(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || xr(e) ? !1 : e.trim().length > 0;
}
function gA(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of N.values())
    Zn(r, e, t) && n.set(r.pendingId, r);
  for (const r of AA(e))
    Zn(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Zn(e, t, n) {
  const r = Z(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !ua(n, "itemId", e.itemId) ? !1 : !e.actorId || ua(n, "actorId", e.actorId);
}
function ua(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${qA(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function hA(e) {
  const t = Se(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function _A(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Zn(e, null, t))
      return t;
  return null;
}
function bA() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of N.entries())
    e - r.createdAt > t && N.delete(n);
}
async function da(e, t) {
  const n = jt(e);
  if (!n) return !1;
  try {
    const r = j(n);
    return r[t.pendingId] = Fr(t, Z(n)), await Ce(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Or(e) {
  const t = Qs(e);
  if (!t) return !1;
  try {
    const n = j(t);
    return n[e.pendingId] = Fr(e, Z(t)), await Ce(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Ws(e) {
  for (const t of hy)
    globalThis.setTimeout(() => {
      Xn(e);
    }, t);
}
async function Xn(e) {
  const t = Qs(e);
  if (Mr(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await Or(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function yA(e, t) {
  const n = Ys(e.context.message);
  if (n)
    try {
      const r = j(n), o = r[e.pendingId] ?? Fr(e, Z(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await Ce(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function AA(e) {
  return Object.values(j(G(e))).filter(Ye);
}
function j(e) {
  if (!e) return {};
  const t = {}, n = Mr(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(Ks(e)))
    t[r] ??= o;
  return t;
}
function TA(e) {
  return Object.values(Ks(G(e))).filter(Ye);
}
function Ks(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, ks);
  if (!we(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Ye(o) && (n[r] = o);
  return n;
}
async function Ce(e, t) {
  typeof e.setFlag == "function" && (await RA(e, t), await $A(e, t));
}
async function $A(e, t) {
  await Promise.resolve(e.setFlag?.(u, ks, t));
}
function Mr(e) {
  if (!e) return null;
  const t = e.getFlag?.(u, ws);
  return xA(t) ? t : null;
}
async function RA(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Ye).sort((a, s) => a.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((a) => a.createdAt)),
    messageId: r.messageId ?? Z(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: kA(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(u, ws, o));
}
function kA(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Fr(e, t) {
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
function Ys(e) {
  const t = G(e);
  if (t?.setFlag)
    return t;
  const n = wA(e);
  if (n?.setFlag)
    return n;
  const r = Z(e);
  if (!r) return null;
  const o = game.messages;
  return G(o?.get?.(r));
}
function wA(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(G).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Qs(e) {
  const t = Ys(e.context.message);
  if (t) return t;
  const n = e.messageId ? EA(e.messageId) : null;
  if (n) return n;
  const r = Js().slice().reverse();
  return r.find((o) => IA(o, e)) ?? r.find((o) => CA(o, e)) ?? null;
}
function EA(e) {
  const t = game.messages;
  return G(t?.get?.(e));
}
function IA(e, t) {
  const n = Z(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Zs(e, t)) return !1;
  const o = Xs(e);
  return !t.actorId || !o || o === t.actorId;
}
function CA(e, t) {
  if (!LA(e, t)) return !1;
  const n = Xs(e);
  return t.actorId && n === t.actorId ? !0 : Zs(e, t);
}
function Zs(e, t) {
  const n = $e(SA(e));
  if (!n) return !1;
  const r = $e(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = $e(t.itemId);
  return !!(o && n.includes(o));
}
function SA(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Xs(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function LA(e, t) {
  const n = DA(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= _y;
}
function DA(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function G(e) {
  return e && typeof e == "object" ? e : null;
}
function Ye(e) {
  return we(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && S(e.messageId) && S(e.itemId) && S(e.actorId) && S(e.itemName) && re(e.resistanceTargetActorId) && re(e.resistanceTargetName) && OA(e.resistanceRollResult) && PA(e.actionPayload) && sn(e.title) && sn(e.buttonLabel) && sn(e.executedLabel) && re(e.choiceGroupId) && re(e.skippedLabel) && re(e.actionSectionId) && re(e.actionSectionTitle) && FA(e.summaryLines) : !1;
}
function PA(e) {
  return e == null ? !0 : we(e) ? e.kind === "resource-operation" && S(e.actorId) && S(e.actorUuid) && typeof e.actorName == "string" && vA(e.resource) && NA(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function vA(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function NA(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function xA(e) {
  return we(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && S(e.messageId) && we(e.source) && S(e.source.actorId) && S(e.source.actorName) && S(e.source.itemId) && S(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Ye) : !1;
}
function OA(e) {
  return e == null ? !0 : we(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && re(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function MA(e) {
  return e !== null;
}
function we(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function S(e) {
  return e === null || typeof e == "string";
}
function sn(e) {
  return e === void 0 || typeof e == "string";
}
function re(e) {
  return e == null || typeof e == "string";
}
function FA(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function UA(e) {
  return typeof e == "string" && e.length > 0;
}
function Js() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(G).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(G).filter((r) => r !== null) : [];
}
function Vt(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Z(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function BA(e) {
  return e.trim().toLowerCase();
}
function qA(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Se(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const ma = 1e3;
class GA {
  constructor(t, n, r, o, a, s) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = s, this.ritualAssistant = new fb(
      t,
      n,
      r
    );
  }
  workflow;
  resources;
  damage;
  conditions;
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
      settings: Wr(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Wr();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = kt(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && QA(t.item) && n.executionMode === "ask") {
        await this.handleGenericRitual(t);
        return;
      }
      const o = r.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(t, o, r.error.reason), r.error.reason === "invalid-automation" && this.debugOutput.warn({
        title: "Automação de item inválida",
        message: r.error.message,
        data: r.error
      });
      return;
    }
    if (await Wo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: un(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    switch (this.markExecution(t), n.executionMode) {
      case "ask":
        await this.handleAskMode(t, r.value);
        return;
      case "automatic":
        await this.executeAutomation(t, r.value, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const n = this.pendingExecutions.get(t);
    if (!n)
      return this.executePersistedPendingAutomation(t);
    if (n.kind === "workflow")
      return this.pendingExecutions.delete(t), await an(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await an(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Nr(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = JA(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await ht(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await Ty(t), await $y(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (yy(
      (t) => this.executePendingAutomation(t)
    ), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, n) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await Wo(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: un(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      ZA(t.item)
    );
  }
  async handleAssistedRitual(t, n) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const r = await this.ritualAssistant.run(t, n);
    switch (r.status) {
      case "cancelled":
        this.setAttempt(t, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(t, "failed", r.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: r.message,
          data: r.cause ?? r
        }), ui.notifications?.warn(`Paranormal Toolkit: ${r.message}`);
        return;
      case "completed-without-actions":
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), m.info(
          "Ritual assistido concluído sem ações pendentes.",
          ie(r.workflowContext)
        );
        return;
      case "ready":
        await this.registerAssistedActions(
          t,
          r.workflowContext,
          r.actions,
          r.summaryLines
        );
        return;
    }
  }
  async executeAssistedAction(t, n) {
    if (t.kind === "resource-operation") {
      const o = await this.ritualAssistant.applyAction(t);
      return o.ok ? (n.resourceTransactions.push(o.value), { ok: !0 }) : (this.handleResourceActionFailure(o), { ok: !1 });
    }
    if (t.kind === "damage-application") {
      const o = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return o.ok ? (YA(n, o.value), await zA(o.value), {
        ok: !0,
        executedLabel: jA(o.value)
      }) : (this.handleDamageActionFailure(o.error), { ok: !1 });
    }
    const r = await this.conditions.applyCondition({
      actor: t.actor,
      conditionId: t.conditionId,
      duration: t.duration,
      originUuid: t.originUuid,
      source: t.source ?? "item-use.condition-action"
    });
    return r.ok ? (r.value.warning && ui.notifications?.warn(`Paranormal Toolkit: ${r.value.warning}`), { ok: !0 }) : (this.handleConditionActionFailure(r), { ok: !1 });
  }
  async resolveAlternativeActions(t) {
    const n = ln(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && ln(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== t.id && (this.pendingExecutions.delete(o), await an(
        o,
        pa(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = dn();
    await Ay({
      pendingId: r,
      context: t,
      mode: "ask",
      title: "Paranormal Toolkit · Ritual",
      buttonLabel: "Ritual conjurado",
      executedLabel: "✓ Ritual conjurado",
      actionSectionId: "ritual-log",
      actionSectionTitle: "Registro",
      summaryLines: n
    });
  }
  async registerAssistedActions(t, n, r, o) {
    let a;
    for (const s of r) {
      const l = dn();
      a ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await aa({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: ln(s),
        skippedLabel: pa(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: XA(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      a
    ), m.info(
      "Ritual assistido preparado com ações pendentes.",
      ie(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = dn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await aa({
      pendingId: r,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", r);
  }
  async executeAutomation(t, n, r) {
    this.setAttempt(t, "running");
    const o = await this.workflow.runAutomation(n, {
      sourceActor: t.actor,
      sourceToken: t.token,
      item: t.item,
      targets: t.targets,
      flags: {
        itemUse: {
          source: t.source,
          executionMode: r
        }
      }
    });
    if (!o.ok) {
      this.setAttempt(t, "failed", o.error.reason), this.handleAutomationFailure(o.error);
      return;
    }
    this.setAttempt(t, "completed"), m.info(
      "Automação executada por uso normal de item.",
      ie(o.value.context)
    );
  }
  handleAutomationFailure(t) {
    const n = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      m.warn(n, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      m.error(n, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    m.warn(n, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    m.warn(
      `Ação assistida falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  handleDamageActionFailure(t) {
    m.warn(`Ação assistida de dano falhou: ${t.message}`, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleConditionActionFailure(t) {
    m.warn(
      `Ação assistida de condição falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const n = Date.now(), r = ga(t);
    for (const [a, s] of this.recentExecutionKeys.entries())
      n - s > ma && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= ma;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(ga(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = un(
      t,
      n,
      r,
      o
    );
  }
}
async function zA(e) {
  const t = KA();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: VA(e)
      });
    } catch (n) {
      m.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function jA(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function VA(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${dt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = HA(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${dt(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${dt(e.actorName)}</strong></p>
      <ul>
        ${t}
        ${n}
        ${r}
        ${o}
        ${a}
      </ul>
    </div>
  `;
}
function HA(e) {
  const t = WA(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${dt(o)}</li>`;
}
function WA(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = fa(n?.value);
  return r === null ? null : {
    value: r,
    max: fa(n?.max)
  };
}
function fa(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function KA() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function dt(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function ln(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function pa(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function YA(e, t) {
  for (const n of t.instances)
    e.damageInstances.push({
      id: n.id,
      source: "ritual",
      sourceId: t.originUuid,
      sourceName: t.source ?? "Dano assistido",
      targetActorId: t.actorId,
      targetActorName: t.actorName,
      rollId: n.sourceRollId ?? void 0,
      damageType: n.damageType ?? n.systemDamageType ?? void 0,
      rawAmount: n.inputAmount,
      resistance: n.blocked > 0 ? n.blocked : void 0,
      finalAmount: n.finalDamage,
      appliedAmount: n.finalDamage,
      tags: ["ordem-apply-damage"]
    });
}
function QA(e) {
  return e.type === "ritual";
}
function ZA(e) {
  return P_(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function XA(e) {
  return e.kind === "damage-application" || e.kind !== "resource-operation" ? null : {
    kind: "resource-operation",
    actorId: e.actor.id ?? null,
    actorUuid: e.actor.uuid ?? null,
    actorName: e.actorName,
    resource: e.resource,
    operation: e.operation,
    amount: e.amount
  };
}
function JA(e) {
  const t = e.actorUuid ? eT(e.actorUuid) : null;
  if (Ee(t)) return t;
  const n = e.actorId ? tT(e.actorId) : null;
  return n || nT(e.actorName);
}
function eT(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function tT(e) {
  const n = game.actors?.get?.(e);
  if (Ee(n)) return n;
  for (const r of el()) {
    const o = Ur(r);
    if (o?.id === e) return o;
  }
  return null;
}
function nT(e) {
  const t = cn(e);
  if (!t) return null;
  for (const o of el()) {
    const a = rT(o);
    if (cn(a) === t) {
      const s = Ur(o);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (o) => Ee(o) && cn(o.name) === t
  );
  return Ee(r) ? r : null;
}
function el() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function rT(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ur(e)?.name ?? null;
}
function Ur(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ee(t)) return t;
  const n = e.document?.actor;
  return Ee(n) ? n : null;
}
function cn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ee(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function un(e, t, n, r) {
  return {
    source: e.source,
    status: t,
    reason: n,
    pendingId: r,
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
function ga(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function dn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class oT {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = Ve(t);
    for (const s of n) {
      const l = s.itemId ? a.find((f) => f.id === s.itemId) ?? null : null, c = s.match?.preset ?? null;
      if (!l || !c) {
        o.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(l, c);
      const d = await this.itemPatches.applyPresetItemPatch(l, c);
      r.push({
        itemId: l.id ?? null,
        itemName: l.name ?? "Ritual sem nome",
        presetId: c.id,
        presetLabel: c.label,
        previousStatus: s.status,
        itemPatch: d
      });
    }
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      applied: r,
      skipped: o
    };
  }
}
class aT {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Ve(t).map((l) => this.analyzeRitual(l)), r = n.filter(at("upToDate")), o = n.filter(at("available")), a = n.filter(at("outdated")), s = n.filter(at("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: o,
      outdated: a,
      unsupported: s,
      canApply: o.length > 0 || a.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = iT(t);
    return n ? r ? r.source.type !== "preset" ? ve({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? ve({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : ve({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: sT(r, n.preset)
    }) : ve({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : ve({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function ve(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? Rt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function iT(e) {
  const t = e.getFlag(u, "automation");
  return er(t) ? t : null;
}
function sT(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function at(e) {
  return (t) => t.status === e;
}
class lT {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = nr(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: n,
      data: r,
      flags: {
        [u]: {
          resourceTransaction: r
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, n) {
    const r = this.createWorkflowSummaryContent(t, n), o = ie(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: r,
      data: o,
      flags: {
        [u]: {
          workflowSummary: o
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const n = A(t.actorName), r = A(t.resource), o = A(ha(t)), a = A(uT(t));
    return `
      <section class="${u}-card ${u}-resource-card">
        <header class="${u}-card__header">
          <strong>${o}</strong>
          <span>${n}</span>
        </header>
        <div class="${u}-card__body">
          <p><strong>${a}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, n) {
    const r = A(n.title ?? "Automação"), o = n.message ? `<p>${A(n.message)}</p>` : "", a = A(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = A(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((g) => A(g.name)).join(", ") : "Nenhum", c = Object.values(t.rolls).map(
      (g) => `<li><strong>${A(g.id)}:</strong> ${A(g.formula)} = ${g.total} <em>(${A(cT(g.intent))})</em>${g.damageType ? ` — ${A(g.damageType)}` : ""}</li>`
    ), d = t.ritualCosts.map(
      (g) => `<li><strong>${A(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${A(g.resource)} (${A(dT(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${A(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), y = t.healingInstances.map(
      (g) => `<li><strong>${A(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${A(g.actorName)}:</strong> ${A(ha(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), $ = t.phases.map((g) => A(g)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${u}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${d.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${c.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${c.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Dano:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Cura:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${$.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${$}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function cT(e) {
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
function ha(e) {
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
function uT(e) {
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
function dT(e) {
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
function mT() {
  const e = new Jg(), t = new n_(e), n = new di(new ci()), r = new mi(new gr()), o = new r_(new ss()), a = new nh(), s = new _h(a), l = new Dh(e), c = new vh(), d = c.registerMany(
    Gl()
  );
  if (!d.ok)
    throw new Error(d.error.message);
  const f = new Ph(), y = new Sh(), T = Ai(), $ = new gi(T), g = new aT(
    c
  ), V = new oT(
    g,
    f,
    y
  ), De = new s_(), Pe = new lT(De), de = new i_(), C = new e_(
    t,
    s,
    Pe,
    de
  ), x = new a_(C, de), me = new GA(
    x,
    t,
    s,
    n,
    $,
    De
  );
  return me.addStrategy(
    new Ih(
      (ll) => me.handleItemUsed(ll)
    )
  ), {
    ordem: l,
    resourceAdapter: e,
    ritualAdapter: a,
    ritualCosts: s,
    resources: t,
    damage: n,
    resistance: r,
    ritualCasting: o,
    automationRegistry: c,
    automationBinder: f,
    itemPatches: y,
    conditionRegistry: T,
    conditions: $,
    debugOutput: De,
    chatMessages: Pe,
    workflowHooks: de,
    automation: C,
    workflow: x,
    itemUseIntegration: me,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: V
  };
}
const { ApplicationV2: fT } = foundry.applications.api;
class Tt extends fT {
  constructor(t, n) {
    super({
      id: `${u}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Presets de rituais: ${t.name ?? "Ator"}`
      }
    }), this.actor = t, this.services = n;
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
      apply: Tt.onApply,
      cancel: Tt.onCancel
    }
  };
  async _renderHTML(t, n) {
    const r = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), o = document.createElement("div");
    return o.className = "paranormal-toolkit-preset-manager", o.innerHTML = this.renderContent(r), o;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${M(Jn)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${M(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${mn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${mn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${mn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
    const t = this.lastApplicationResult.applied.length, n = this.lastApplicationResult.skipped.length, r = n > 0 ? ` ${n} pendente(s) não puderam ser aplicados.` : "";
    return `
      <div class="paranormal-toolkit-preset-manager__result">
        <strong>Aplicação concluída.</strong>
        <span>${t} preset(s) aplicado(s).${r}</span>
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
        const r = this.lastApplicationResult.applied.length;
        ui.notifications?.info(`Paranormal Toolkit: ${r} preset(s) aplicado(s) em ${this.actor.name ?? "ator"}.`);
      } finally {
        this.isApplying = !1, await this.render({ force: !0 });
      }
    }
  }
  static async onCancel(t) {
    t.preventDefault(), await this.close();
  }
}
function mn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${M(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? pT(n) : hT(t)}
    </section>
  `;
}
function pT(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(gT).join("")}</ol>`;
}
function gT(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${M(e.appliedPresetId)} v${M(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${M(e.itemName)}</strong>
        <span>${M(e.reason)}</span>
        ${r}
      </div>
      <em>${M(n)}</em>
    </li>
  `;
}
function hT(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${M({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function M(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const $t = `${u}.manageRitualPresets`, _a = `__${u}_ritualPresetHeaderControlRegistered`, _T = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function bT(e) {
  const t = globalThis;
  if (!t[_a]) {
    for (const n of _T)
      Hooks.on(n, (r, o) => {
        yT(r, o, e);
      });
    t[_a] = !0, m.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function yT(e, t, n) {
  Array.isArray(t) && TT(e) && (AT(e, n), !t.some((r) => r.action === $t) && t.push({
    action: $t,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), tl(e, n);
    }
  }));
}
function AT(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[$t] && (e.options.actions[$t] = (n) => {
    n.preventDefault(), n.stopPropagation(), tl(e, t);
  }));
}
function TT(e) {
  if (!game.user?.isGM) return !1;
  const t = nl(e);
  return t ? t.type === "agent" && Ve(t).length > 0 : !1;
}
function tl(e, t) {
  const n = nl(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Tt(n, t).render({ force: !0 });
}
function nl(e) {
  return ba(e.actor) ? e.actor : ba(e.document) ? e.document : null;
}
function ba(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const rl = "data-paranormal-toolkit-ritual-roll-config", Qe = "data-paranormal-toolkit-ritual-roll-field", le = "data-paranormal-toolkit-ritual-roll-action", ya = `__${u}_ritualRollConfigBlockRegistered`, $T = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], RT = [
  { value: "cutting", label: "Corte" },
  { value: "impact", label: "Impacto" },
  { value: "piercing", label: "Perfurante" },
  { value: "ballistic", label: "Balístico" },
  { value: "blood", label: "Sangue" },
  { value: "death", label: "Morte" },
  { value: "knowledge", label: "Conhecimento" },
  { value: "energy", label: "Energia" },
  { value: "fear", label: "Medo" },
  { value: "fire", label: "Fogo" },
  { value: "cold", label: "Frio" },
  { value: "electric", label: "Eletricidade" },
  { value: "chemical", label: "Químico" },
  { value: "mental", label: "Mental" }
];
function kT() {
  const e = globalThis;
  if (!e[ya]) {
    wT();
    for (const t of $T)
      Hooks.on(t, (...n) => {
        ET(n[0], n[1]);
      });
    e[ya] = !0, m.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function wT() {
  const e = `${u}-ritual-roll-config-inline-style`;
  if (document.getElementById(e)) return;
  const t = document.createElement("style");
  t.id = e, t.textContent = `
.${u}-ritual-roll-config {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  border: 1px solid rgba(89, 36, 42, 0.28);
  border-left: 4px solid rgba(89, 36, 42, 0.78);
  border-radius: 8px;
  padding: 10px;
  background: linear-gradient(180deg, rgba(248, 244, 237, 0.96), rgba(234, 226, 214, 0.98));
  color: rgba(24, 19, 18, 0.94);
}
.${u}-ritual-roll-config__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.${u}-ritual-roll-config__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.${u}-ritual-roll-config__title strong {
  color: rgba(89, 36, 42, 0.96);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}
.${u}-ritual-roll-config__title span {
  font-size: 0.9rem;
  font-weight: 800;
}
.${u}-ritual-roll-config__badge {
  border: 1px solid rgba(89, 36, 42, 0.25);
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.36);
  color: rgba(89, 36, 42, 0.9);
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
}
.${u}-ritual-roll-config__hint,
.${u}-ritual-roll-config__status {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.35;
  opacity: 0.8;
}
.${u}-ritual-roll-config__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.${u}-ritual-roll-config__forms-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.${u}-ritual-roll-config__forms-title {
  color: rgba(24, 19, 18, 0.9);
  font-size: 0.8rem;
  font-weight: 900;
}
.${u}-ritual-roll-config__forms-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.${u}-ritual-roll-config__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: left;
}
.${u}-ritual-roll-config__field input,
.${u}-ritual-roll-config__field select,
.${u}-ritual-roll-config__field textarea {
  width: 100%;
  min-width: 0;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
}
.${u}-ritual-roll-config__field textarea {
  resize: vertical;
}
.${u}-ritual-roll-config__field small {
  color: rgba(89, 36, 42, 0.78);
  font-size: 0.72rem;
  font-weight: 700;
}
.${u}-ritual-roll-config__form-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 7px;
  padding: 7px;
  background: rgba(255, 255, 255, 0.28);
}
.${u}-ritual-roll-config__form-card:has(input:disabled) {
  opacity: 0.72;
}
.${u}-ritual-roll-config__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.${u}-ritual-roll-config__actions button {
  width: auto;
  margin: 0;
}
.${u}-ritual-roll-config [hidden] {
  display: none !important;
}
@media (max-width: 620px) {
  .${u}-ritual-roll-config__fields,
  .${u}-ritual-roll-config__forms-grid {
    grid-template-columns: 1fr;
  }
}
`, document.head.append(t);
}
function ET(e, t) {
  const n = BT(e);
  if (!n || n.type !== "ritual") return;
  const r = zT(t);
  if (!r) return;
  const o = r.querySelector('section[data-tab="ritualAttr"]');
  if (!o) return;
  CT(o);
  const a = al(n), s = bs(n), l = qT(n), c = ST(n, s, a, l);
  xT(c, n, a, l), IT(o, c), Br(c);
}
function IT(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function CT(e) {
  for (const t of Array.from(e.querySelectorAll(`[${rl}]`)))
    t.remove();
}
function ST(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(`${u}-ritual-roll-config`), o.setAttribute(rl, e.uuid ?? e.id ?? "ritual");
  const a = document.createElement("header");
  a.classList.add(`${u}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${u}-ritual-roll-config__title`), s.append(Aa("strong", "Paranormal Toolkit")), s.append(Aa("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${u}-ritual-roll-config__badge`), l.textContent = sl(t) ? "Configurada" : "Rascunho", a.append(s, l), o.append(a);
  const c = document.createElement("p");
  c.classList.add(`${u}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", o.append(c);
  const d = document.createElement("div");
  d.classList.add(`${u}-ritual-roll-config__fields`), d.append(LT(t, r)), d.append(DT(t, r)), d.append(PT(t, r)), o.append(d), o.append(vT(t, n, r)), o.append(NT(r));
  const f = document.createElement("p");
  return f.classList.add(`${u}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", o.append(f), o;
}
function LT(e, t) {
  const n = Ht("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(Qe, "intent"), r.disabled = !t;
  for (const o of ["damage", "healing", "utility"]) {
    const a = document.createElement("option");
    a.value = o, a.textContent = D_(o), a.selected = e.intent === o, r.append(a);
  }
  return n.append(r), n;
}
function DT(e, t) {
  const n = Ht("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(Qe, "damageType"), r.disabled = !t;
  const o = document.createElement("option");
  o.value = "", o.textContent = "—", o.selected = !e.damageType, r.append(o);
  for (const a of RT) {
    const s = document.createElement("option");
    s.value = a.value, s.textContent = a.label, s.selected = e.damageType === a.value, r.append(s);
  }
  return n.append(r), n;
}
function PT(e, t) {
  const n = Ht("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(Qe, "utilityLabel"), n.append(r), n;
}
function vT(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${u}-ritual-roll-config__forms-section`);
  const o = document.createElement("strong");
  o.classList.add(`${u}-ritual-roll-config__forms-title`), o.textContent = "Fórmulas por forma", r.append(o);
  const a = document.createElement("div");
  return a.classList.add(`${u}-ritual-roll-config__forms-grid`), a.append(fn("base", "Padrão", e.forms.base.formula, !0, n)), a.append(fn("discente", "Discente", e.forms.discente.formula, t.discente, n)), a.append(fn("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(a), r;
}
function fn(e, t, n, r, o) {
  const a = Ht(t);
  a.classList.add(`${u}-ritual-roll-config__form-card`), a.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !o || !r, s.setAttribute(Qe, `formula.${e}`), a.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", a.append(l);
  }
  return a;
}
function NT(e) {
  const t = document.createElement("div");
  t.classList.add(`${u}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(le, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(le, "clear"), t.append(n, r), t;
}
function Ht(e) {
  const t = document.createElement("label");
  t.classList.add(`${u}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Aa(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function xT(e, t, n, r) {
  Le(e, "intent")?.addEventListener("change", () => Br(e)), Ra(e, "system.studentForm")?.addEventListener("change", () => Ta(e, t)), Ra(e, "system.trueForm")?.addEventListener("change", () => Ta(e, t)), e.querySelector(`[${le}="save"]`)?.addEventListener("click", () => {
    r && OT(e, t, n);
  }), e.querySelector(`[${le}="clear"]`)?.addEventListener("click", () => {
    r && MT(e, t);
  });
}
async function OT(e, t, n) {
  const r = e.querySelector(`[${le}="save"]`);
  r?.setAttribute("disabled", "true"), Re(e, "Salvando configuração...");
  try {
    const o = FT(e, n);
    await S_(t, o), ol(e, o), Re(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (o) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", o), Re(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function MT(e, t) {
  const n = e.querySelector(`[${le}="clear"]`);
  n?.setAttribute("disabled", "true"), Re(e, "Limpando configuração...");
  try {
    await L_(t);
    const r = bs(t);
    UT(e, r), ol(e, r), Re(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Re(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function ol(e, t) {
  const n = e.querySelector(`.${u}-ritual-roll-config__badge`);
  n && (n.textContent = sl(t) ? "Configurada" : "Rascunho");
}
function FT(e, t) {
  return {
    schemaVersion: 1,
    intent: il(Le(e, "intent")?.value),
    damageType: ka(e, "damageType"),
    utilityLabel: ka(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: mt(e, "formula.base") },
      discente: { formula: mt(e, "formula.discente") },
      verdadeiro: { formula: mt(e, "formula.verdadeiro") }
    }
  };
}
function UT(e, t) {
  pe(e, "intent", t.intent), pe(e, "damageType", t.damageType ?? ""), pe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), pe(e, "formula.base", t.forms.base.formula), pe(e, "formula.discente", t.forms.discente.formula), pe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Br(e);
}
function Br(e) {
  const t = il(Le(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const o of Array.from(n))
    o.hidden = t !== "damage";
  for (const o of Array.from(r))
    o.hidden = t !== "utility";
}
function Ta(e, t) {
  const n = al(t);
  $a(e, "discente", n.discente), $a(e, "verdadeiro", n.verdadeiro);
}
function $a(e, t, n) {
  const r = Le(e, `formula.${t}`);
  if (!r) return;
  const o = !e.querySelector(`[${le}="save"]`)?.disabled;
  r.disabled = !o || !n;
  const a = r.closest(`.${u}-ritual-roll-config__field`), s = a?.querySelector("small");
  if (a) {
    if (n) {
      s?.remove();
      return;
    }
    if (!s) {
      const l = document.createElement("small");
      l.textContent = "Indisponível neste ritual.", a.append(l);
    }
  }
}
function Re(e, t) {
  const n = e.querySelector(`.${u}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function al(e) {
  const t = GT(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function BT(e) {
  return wa(e.item) ? e.item : wa(e.document) ? e.document : null;
}
function qT(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function GT(e) {
  const t = e.system;
  return jT(t) ? t : {};
}
function Ra(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function Le(e, t) {
  return e.querySelector(`[${Qe}="${VT(t)}"]`);
}
function mt(e, t) {
  return Le(e, t)?.value.trim() ?? "";
}
function ka(e, t) {
  const n = mt(e, t);
  return n.length > 0 ? n : null;
}
function pe(e, t, n) {
  const r = Le(e, t);
  r && (r.value = n);
}
function il(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function sl(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function zT(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function wa(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function jT(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function VT(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let ae = null;
Hooks.once("init", () => {
  Ul(), dc(), Vc(), Bg(), m.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!Qr.isSupportedSystem()) {
    m.warn(
      `Sistema não suportado: ${Qr.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  ae = mT(), ae.itemUseIntegration.registerStrategies(), qc(ae.conditions), kc(ae), xc(), Dc(), Hg(), bT(ae), kT(), m.info("Inicializado para o sistema Ordem Paranormal."), m.info(
    `API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Jn} inicializado.`);
});
function HT() {
  if (!ae)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return ae;
}
export {
  HT as getToolkitServices
};
//# sourceMappingURL=main.js.map
