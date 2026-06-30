const u = "paranormal-toolkit", Lt = "Paranormal Toolkit", ea = "ordemparanormal";
class Re {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function He(e) {
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
function y(e) {
  return { ok: !0, value: e };
}
function p(e) {
  return { ok: !1, error: e };
}
function vt(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : Ot(t) ? y(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function ta(e) {
  return Ot(e.getFlag(u, "automation"));
}
function Ot(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && ra(t.source) && na(t.definition);
}
function na(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && C(t.label) && Array.isArray(t.steps) && t.steps.every(oa) && (t.conditionApplications === void 0 || ua(t.conditionApplications));
}
function ra(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? C(t.presetId) && C(t.presetVersion) && C(t.appliedAt) : t.type === "manual" ? C(t.label) && C(t.appliedAt) : !1;
}
function oa(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return aa(t);
    case "spendRitualCost":
      return ia(t);
    case "rollFormula":
      return sa(t);
    case "modifyResource":
      return ca(t);
    case "chatCard":
      return la(t);
    default:
      return !1;
  }
}
function aa(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Tr(t);
}
function ia(e) {
  return e.type === "spendRitualCost";
}
function sa(e) {
  const t = e;
  return t.type === "rollFormula" && C(t.id) && C(t.formula) && (t.intent === void 0 || ha(t.intent)) && (t.damageType === void 0 || C(t.damageType));
}
function ca(e) {
  const t = e;
  return t.type === "modifyResource" && Rr(t.actor) && pa(t.resource) && ga(t.operation) && Tr(t) && (t.damageType === void 0 || t.damageType === null || C(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function la(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function ua(e) {
  return Array.isArray(e) && e.every(da);
}
function da(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return C(t.id) && Rr(t.actor) && C(t.conditionId) && (t.label === void 0 || C(t.label)) && (t.duration === void 0 || t.duration === null || ma(t.duration)) && (t.source === void 0 || C(t.source)) && (t.actionSectionId === void 0 || C(t.actionSectionId)) && (t.actionSectionTitle === void 0 || C(t.actionSectionTitle)) && (t.executedLabel === void 0 || C(t.executedLabel));
}
function ma(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || ya(t.rounds)) && (t.expiry === void 0 || t.expiry === null || fa(t.expiry));
}
function fa(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Tr(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || C(e.amountFrom);
}
function Rr(e) {
  return e === "self" || e === "target";
}
function pa(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function ga(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function ha(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function ya(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function C(e) {
  return typeof e == "string" && e.length > 0;
}
function Mt(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(on);
    if (Ta(t))
      return Array.from(t).filter(on);
  }
  return [];
}
function Aa(e) {
  return Mt(e)[0] ?? null;
}
function ba(e) {
  return Mt(e).find(ta) ?? null;
}
function Ta(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function on(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ke(e) {
  return Mt(e).filter((t) => t.type === "ritual");
}
function kr(e) {
  return ke(e)[0] ?? null;
}
function Ra(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(He);
      return l.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = pe("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = we(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(cn);
      return l.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = pe("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = we(n);
      if (!r) return;
      const o = e.automationRegistry.require(t);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      const a = await gt(e, r, o.value);
      l.info(`Preset ${o.value.id} aplicado em ${r.name}.`, { itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${o.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = pe("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = we(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        l.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const o = await gt(e, n, r.preset);
      l.info(`Melhor preset aplicado em ${n.name}.`, { match: cn(r), itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return an(e);
    },
    async applyBestPresetsToActorRituals() {
      return an(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = pe("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = we(t);
      n && (await e.automationBinder.clear(n), l.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function an(e) {
  const t = pe("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = ke(t);
  if (n.length === 0)
    return l.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), sn(t);
  const r = sn(t, n.length);
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
    const i = await gt(e, o, a.preset);
    r.applied.push(ka(o, a, i));
  }
  return l.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Ca(r), r;
}
async function gt(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function ka(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: He(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function sn(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Ca(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function cn(e) {
  return {
    preset: He(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function pe(e) {
  const t = Re.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function we(e) {
  const t = kr(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function X(e) {
  return e ? {
    id: e.id,
    source: {
      ...Ia(e.sourceActor),
      token: e.sourceToken
    },
    item: wa(e.item),
    targets: e.targets.map($a),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: ln(e.rollRequests, Cr),
    rolls: ln(e.rolls, _a),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Ft),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Ft(e) {
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
function Ia(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function wa(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function $a(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Cr(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function _a(e) {
  return {
    ...Cr(e),
    total: e.total
  };
}
function ln(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function Ea(e) {
  return {
    getSelected() {
      return Re.getSelectedActor();
    },
    logResources() {
      const t = z(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      l.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && l.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await ee(
        e,
        "Gasto de PE",
        z("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await ee(
        e,
        "Gasto de PD",
        z("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await ee(
        e,
        "Dano em PV",
        z("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await ee(
        e,
        "Cura de PV",
        z("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await ee(
        e,
        "Dano em SAN",
        z("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await ee(
        e,
        "Recuperação de SAN",
        z("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function ee(e, t, n, r) {
  if (!n) return;
  const o = await r(n);
  if (!o.ok) {
    Sa(o.error);
    return;
  }
  const a = o.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: a });
  } catch (i) {
    l.error(`${t} realizado, mas falhou ao criar o chat card.`, i), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  l.info(`${t} realizado:`, Ft(a));
}
function z(e) {
  const t = Re.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Sa(e) {
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
const v = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function Da() {
  $e(v.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), $e(v.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), $e(v.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), $e(v.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function ht() {
  return {
    enabled: _e(v.enabled),
    console: _e(v.console),
    ui: _e(v.ui),
    chat: _e(v.chat)
  };
}
async function j(e, t) {
  await game.settings.set(u, v[e], t);
}
function $e(e, t) {
  game.settings.register(u, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function _e(e) {
  return game.settings.get(u, e) === !0;
}
function Pa() {
  return {
    status() {
      return ht();
    },
    async enable() {
      await j("enabled", !0);
    },
    async disable() {
      await j("enabled", !1);
    },
    async enableConsole() {
      await j("console", !0);
    },
    async disableConsole() {
      await j("console", !1);
    },
    async enableUi() {
      await j("ui", !0);
    },
    async disableUi() {
      await j("ui", !1);
    },
    async enableChat() {
      await j("chat", !0);
    },
    async disableChat() {
      await j("chat", !1);
    }
  };
}
const Ir = "ritual.costOnly", wr = "ritual.simpleHealing", Na = "ritual.eletrocussao", $r = "ritual.simpleDamage", _r = "generic.simpleHealing", Er = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function La() {
  return [
    va(),
    Oa(),
    Ma(),
    Fa(),
    xa()
  ];
}
function va() {
  return {
    id: Ir,
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
function Oa() {
  return {
    id: wr,
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
    automation: Sr(),
    itemPatch: Ba()
  };
}
function Ma() {
  return {
    id: Na,
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
    automation: Ua(),
    itemPatch: ja()
  };
}
function Fa() {
  return {
    id: $r,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: xt()
  };
}
function xa() {
  return {
    id: _r,
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
function Sr(e = "2d8+2") {
  return Dr(
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
function Ua() {
  return {
    ...xt("3d6", {
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
function xt(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", o = t.damageType ?? "generic", a = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Dr(
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
function Ba() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: Er,
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
function ja() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: Er,
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
function Dr(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function Ut() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: te(t.id),
    actorId: te(t.actor?.id),
    sceneId: te(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function Pr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: te(e.id),
    actorId: te(t?.id),
    sceneId: te(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function te(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function qa(e) {
  return {
    logFirstRitualCost() {
      const t = G("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = W(t);
      if (!n) return;
      const r = e.ritualCosts.getCost({ actor: t, ritual: n });
      if (!r.ok) {
        l.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      l.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: n.name,
        cost: r.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${n.name} custa ${r.value.amount} ${r.value.resource} (${r.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, n = "PE") {
      const r = G("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const o = W(r);
      if (o) {
        if (!za(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await o.setFlag(u, "ritual.cost", {
          resource: n,
          amount: t
        }), l.info(`Custo customizado aplicado em ${o.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${o.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = G("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = W(t);
      n && (await n.unsetFlag(u, "ritual.cost"), l.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = G("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = W(t);
      if (!n) return;
      const r = e.automationRegistry.require(Ir);
      if (!r.ok) {
        l.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), l.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = G("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = W(n);
      if (!r) return;
      if (!un(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const o = e.automationRegistry.require(wr);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: Sr(t)
      }), l.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = G("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = W(n);
      if (!r) return;
      if (!un(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const o = e.automationRegistry.require($r);
      if (!o.ok) {
        l.warn(o.error.message, o.error), ui.notifications?.warn(`Paranormal Toolkit: ${o.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, o.value, {
        definition: xt(t)
      }), l.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = G("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = W(t);
      n && await Ha(e, t, n);
    }
  };
}
async function Ha(e, t, n) {
  const r = vt(n);
  if (!r.ok) {
    l.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Pr(),
    item: n,
    targets: Ut()
  });
  if (!o.ok) {
    Va(o.error);
    return;
  }
  l.info("Automação de ritual executada com sucesso.", X(o.value.context));
}
function Va(e) {
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
function G(e) {
  const t = Re.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function W(e) {
  const t = kr(e);
  return t || (l.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function za(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function un(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Ga = ["disabled", "ask", "automatic"], Wa = ["buttons", "confirm"], Nr = "ask";
function Ka(e) {
  return typeof e == "string" && Ga.includes(e);
}
function Ya(e) {
  return typeof e == "string" && Wa.includes(e);
}
function Qa(e) {
  return Ka(e) ? e : Ya(e) ? "ask" : Nr;
}
const Za = ["keep", "replace"], Lr = "keep", Xa = !0, O = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Ja() {
  game.settings.register(u, O.executionMode, {
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
    default: Nr
  }), game.settings.register(u, O.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Lr
  }), game.settings.register(u, O.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Xa
  }), game.settings.register(u, O.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function dn() {
  const e = Qa(game.settings.get(u, O.executionMode)), t = Or(game.settings.get(u, O.systemCardMode));
  return {
    executionMode: e,
    systemCardMode: t,
    ritualCastingCheckEnabled: vr()
  };
}
function ei() {
  return Or(game.settings.get(u, O.systemCardMode));
}
function vr() {
  return game.settings.get(u, O.ritualCastingCheckEnabled) === !0;
}
async function K(e) {
  await game.settings.set(u, O.executionMode, e);
}
function Or(e) {
  return Za.includes(e) ? e : Lr;
}
function ti(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await K("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await K("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await K(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await K("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await K("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await K("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await K("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const ni = [
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
function ri(e) {
  return {
    phases() {
      return ni;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Xe("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = ba(t);
      if (!n) {
        l.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await mn(e, t, n);
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
      if (!ii(n)) {
        l.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = ai(n) ?? Xe("Nenhum ator encontrado para executar automação do item.");
      r && await mn(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Xe("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Aa(t);
      if (!n) {
        l.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(_r);
        if (!r.ok) {
          l.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(n, r.value), l.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (r) {
        l.error("Falha ao configurar automação de teste no item.", r), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function mn(e, t, n) {
  const r = vt(n);
  if (!r.ok) {
    l.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const o = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Pr(),
    item: n,
    targets: Ut()
  });
  if (!o.ok) {
    oi(o.error);
    return;
  }
  l.info("Automação executada com sucesso.", X(o.value.context));
}
function oi(e) {
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
function Xe(e) {
  const t = Re.getSelectedActor();
  return t || (l.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ai(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ii(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function si(e) {
  const t = Ea(e), n = Ra(e), r = qa(e), o = ri(e), a = Pa(), i = ti(e);
  return {
    actor: t,
    automation: n,
    ritual: r,
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
function ci(e) {
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
      const r = fn();
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
      return li(o), o;
    },
    removeFromSelectedTokens: async (t) => {
      const n = fn();
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
      return di(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function fn() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const a = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(a, r);
  }
  return Array.from(t.values());
}
function li(e) {
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
function di(e) {
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
function mi(e) {
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
    conditions: ci(e.conditions),
    debug: si(e)
  }, n = globalThis;
  return n[u] = t, n.ParanormalToolkit = t, t;
}
class pn {
  static isSupportedSystem() {
    return game.system.id === ea;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function fi() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ne(t.id),
    actorId: ne(t.actor?.id),
    sceneId: ne(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Mr() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: ne(e.id),
    actorId: ne(t?.id),
    sceneId: ne(e.scene?.id),
    name: n
  };
}
function pi(e, t = Mr()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function gi(e) {
  if (!Ai(e)) return null;
  const t = e.getFlag(u, "workflow");
  return yi(t) ? t : null;
}
function hi() {
  return `flags.${u}.workflow`;
}
function gn(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), n = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || n !== void 0;
}
function hn(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return yt(t) || yt(n);
}
function yi(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Ai(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ne(e) {
  return yt(e) ? e : null;
}
function yt(e) {
  return typeof e == "string" && e.length > 0;
}
function bi() {
  const e = (t, n) => {
    Ti(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Ti(e, t) {
  const n = gi(e);
  if (!n || n.targets.length === 0) return;
  const r = ki(t);
  if (!r || r.querySelector(`.${u}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Ri(n));
}
function Ri(e) {
  const t = document.createElement("section");
  t.classList.add(`${u}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(yn("Origem", e.source.name)), t.append(yn("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function yn(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${u}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const o = document.createElement("span");
  return o.textContent = t, n.append(r, o), n;
}
function ki(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Ci() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!Ii(r) || !wi(e) || gn(e) || gn(t)) return;
    const o = fi();
    if (o.length === 0 || !hn(e) && !hn(t)) return;
    const a = Mr();
    e.updateSource({
      [hi()]: pi(o, a)
    }), l.info("Targets capturados para ChatMessage.", { source: a, targets: o });
  });
}
function Ii(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function wi(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let An = !1, Je = !1, et = !1, Ee = null;
const $i = 1e3, _i = 750, Ei = 1e3;
function Si(e) {
  An || (Hooks.on("combatTurnChange", (t) => {
    Pi(e, bn(t));
  }), Hooks.on("deleteCombat", (t) => {
    Ni(e, bn(t));
  }), An = !0, Di(e));
}
function Di(e) {
  Ve() && (Je || (Je = !0, globalThis.setTimeout(() => {
    Je = !1, Bt(e, "ready");
  }, $i)));
}
function Pi(e, t) {
  Ve() && t && (Ee && globalThis.clearTimeout(Ee), Ee = globalThis.setTimeout(() => {
    Ee = null, Bt(e, "combat-turn-change", t);
  }, _i));
}
function Ni(e, t) {
  Ve() && t && (et || (et = !0, globalThis.setTimeout(() => {
    et = !1, Bt(e, "combat-deleted", t);
  }, Ei)));
}
async function Bt(e, t, n) {
  if (Ve())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && l.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const o of r.failures)
        l.warn(o.message);
    } catch (r) {
      l.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function Ve() {
  return game.user?.isGM === !0;
}
function bn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Fr = {
  enabled: "dice.animations.enabled"
};
function Li() {
  game.settings.register(u, Fr.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function vi() {
  return {
    enabled: game.settings.get(u, Fr.enabled) === !0
  };
}
const Oi = "chatCard", Tn = "data-paranormal-toolkit-prompt-id", c = `${u}-item-use-prompt`, Mi = `.${c}__title`, xr = `.${c}__header`, Fi = `.${c}__roll-card`, xi = `.${c}__roll-meta`, Ui = `.${c}__roll-meta-pill`, Bi = `.${c}__resistance`, ji = `.${c}__resistance-header`, Ur = `.${c}__resistance-description`, qi = `.${c}__resistance-roll-button`, Hi = `.${c}__resistance-roll-result`, Rn = `${c}__resistance-content`, Br = `.${c}__workflow-section`, jr = `.${c}__workflow-roll`, qr = `${c}__workflow-roll--dice-open`, Hr = `.${c}__workflow-roll-formula`, Vr = `${c}__workflow-roll-formula--toggle`, jt = `.${c}__workflow-dice-tray`, Vi = `.${c}__roll-detail-toggle`, zi = `.${c}__roll-detail-list`, Gi = `.${c}__ritual-element-badge`, Wi = `.${c}__ritual-metadata`, Ki = "casting-backlash", Yi = "data-paranormal-toolkit-action-section", Qi = "data-paranormal-toolkit-prompt-id", Zi = "data-paranormal-toolkit-pending-id", kn = "data-paranormal-toolkit-casting-backlash-enhanced", Cn = `.${c}`, Xi = `.${c}__workflow-section--casting`, Ji = `.${c}__workflow-section-header`, es = `.${c}__workflow-notes`, ts = `[${Yi}="${Ki}"]`, In = `${c}__workflow-section-title-row`, ns = `${c}__workflow-section-header--casting-backlash`, zr = `${c}__casting-backlash-button`;
function rs(e) {
  for (const t of os(e))
    as(t), us(t);
}
function os(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Cn) && t.add(e);
  for (const n of e.querySelectorAll(Cn))
    t.add(n);
  return Array.from(t);
}
function as(e) {
  const t = e.querySelector(ts);
  if (!t) return;
  const n = is(t);
  if (!n) return;
  const r = e.querySelector(`${Xi} ${Ji}`);
  r && (r.classList.add(ns), ss(r), cs(n), r.append(n), t.remove());
}
function is(e) {
  return e.querySelector(
    `button[${Zi}], button[${Qi}]`
  );
}
function ss(e) {
  const t = e.querySelector(`:scope > .${In}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(In);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const o of r)
    o !== n && (o instanceof HTMLButtonElement && o.classList.contains(zr) || n.append(o));
  return n;
}
function cs(e) {
  if (e.getAttribute(kn) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = ls(t, e.disabled);
  e.classList.add(zr), e.setAttribute(kn, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function ls(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function us(e) {
  for (const t of e.querySelectorAll(es)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function ds(e) {
  for (const t of Array.from(e.querySelectorAll(Br)))
    for (const n of Array.from(t.querySelectorAll(`${Vi}, ${zi}`)))
      n.remove();
}
function ms(e) {
  for (const t of Array.from(e.querySelectorAll(Bi)))
    fs(t);
}
function fs(e) {
  const t = e.querySelector(ji), n = e.querySelector(Ur), r = e.querySelector(qi), o = e.querySelector(Hi);
  if (!r || !t && !n && !o) return;
  const a = ps(e, r);
  t && t.parentElement !== a && a.append(t), n && n.parentElement !== a && a.append(n), o && o.parentElement !== a && !r.contains(o) && a.append(o), r.parentElement !== e && e.append(r);
}
function ps(e, t) {
  const n = e.querySelector(`.${Rn}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Rn), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function wn(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function qt() {
  const e = globalThis.game;
  return ze(e) ? e : null;
}
function S(e, t) {
  const n = gs(e, t);
  return Ne(n);
}
function gs(e, t) {
  return t.split(".").reduce((n, r) => ze(n) ? n[r] : null, e);
}
function hs(e, t) {
  const n = e.indexOf(":");
  return n < 0 || be(e.slice(0, n)) !== be(t) ? null : se(e.slice(n + 1));
}
function Ne(e) {
  return typeof e == "string" ? se(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function ze(e) {
  return !!e && typeof e == "object";
}
function ys(e) {
  return typeof e == "string";
}
function Ge(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function se(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function be(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function At(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function H(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Gr(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function As(e) {
  for (const t of Array.from(e.querySelectorAll(Fi))) {
    const n = ws(t);
    bs(t), n && (Ts(t, n), Rs(t, n));
  }
}
function bs(e) {
  for (const t of Array.from(e.querySelectorAll(xi)))
    t.remove();
}
function Ts(e, t) {
  const r = e.closest(`.${c}`)?.querySelector(xr) ?? null, o = r?.querySelector(Mi) ?? null, a = r ?? e, i = a.querySelector(Gi);
  if (!t.elementLabel) {
    i?.remove();
    return;
  }
  const s = i ?? document.createElement("span");
  if (s.className = qs(t.elementTone), s.textContent = js(t), !i) {
    if (o?.parentElement === a) {
      o.insertAdjacentElement("afterend", s);
      return;
    }
    a.prepend(s);
  }
}
function Rs(e, t) {
  const n = ks(e);
  Cs(e, n);
  const r = Is(t);
  if (r.length === 0) return;
  const o = document.createElement("div");
  o.classList.add(`${c}__ritual-metadata`);
  for (const i of r) {
    const s = document.createElement("span");
    s.classList.add(`${c}__ritual-metadata-chip`), s.textContent = i, o.append(s);
  }
  if (n) {
    const i = n.querySelector(`.${c}__summary`);
    if (i?.parentElement === n) {
      i.insertAdjacentElement("afterend", o);
      return;
    }
    n.append(o);
    return;
  }
  const a = e.querySelector(Br);
  if (a) {
    e.insertBefore(o, a);
    return;
  }
  e.prepend(o);
}
function ks(e) {
  return e.closest(`.${c}`)?.querySelector(xr) ?? null;
}
function Cs(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const o of Array.from(r.querySelectorAll(Wi)))
      o.remove();
}
function Is(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${At(e.target)}` : null,
    e.duration ? `Duração: ${At(e.duration)}` : null,
    e.resistance ? `Resistência: ${Gr(e.resistance)}` : null
  ].filter(Ge);
}
function ws(e) {
  const t = $s(e), n = Ns(e), o = (t ? Ps(t) : null)?.system ?? null, a = t?.summaryLines ?? [], i = Ht(S(o, "element")), s = F("op.elementChoices", i) ?? $n(Q(a, "Elemento")) ?? $n(n.damageType), d = i ?? Hs(s), m = S(o, "circle") ?? Q(a, "Círculo"), f = Os(o) ?? Q(a, "Alvo"), b = Us(o, "duration", "op.durationChoices") ?? Q(a, "Duração"), R = Ls(e) ?? Fs(o) ?? Q(a, "Resistência"), k = vs(a) ?? n.cost, g = {
    elementLabel: s,
    elementTone: d,
    circle: m,
    cost: k,
    target: f,
    duration: b,
    resistance: R
  };
  return Bs(g) ? g : null;
}
function $s(e) {
  const t = _s(e);
  if (!t) return null;
  const n = t.getFlag?.(u, Oi), r = Ss(n);
  if (r.length === 0) return null;
  const o = Es(e);
  if (o.size > 0) {
    const a = r.find((i) => i.pendingId && o.has(i.pendingId));
    if (a) return a;
  }
  return r.find((a) => a.itemId || a.summaryLines.length > 0) ?? null;
}
function _s(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? qt()?.messages?.get?.(n) ?? null : null;
}
function Es(e) {
  const t = e.closest(`.${c}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${Tn}]`))) {
    const o = r.getAttribute(Tn)?.trim();
    o && n.add(o);
  }
  return n;
}
function Ss(e) {
  if (!ze(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Ds).filter((n) => n !== null) : [];
}
function Ds(e) {
  return ze(e) ? {
    pendingId: Ne(e.pendingId),
    actorId: Ne(e.actorId),
    itemId: Ne(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(ys) : []
  } : null;
}
function Ps(e) {
  if (!e.itemId) return null;
  const t = qt(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Ns(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(Ui))) {
    const o = se(r.textContent);
    if (!o) continue;
    const a = hs(o, "Tipo");
    a && (n = a), !t && /\b(P[ED]|PE|PD)\b/iu.test(o) && (t = o);
  }
  return { cost: t, damageType: n };
}
function Ls(e) {
  const t = se(e.querySelector(Ur)?.textContent);
  return t ? Gr(t) : null;
}
function Q(e, t) {
  const n = be(t);
  for (const r of e) {
    const o = r.indexOf(":");
    if (!(o < 0 || be(r.slice(0, o)) !== n))
      return se(r.slice(o + 1));
  }
  return null;
}
function vs(e) {
  const t = Q(e, "Custo") ?? Q(e, "PE");
  return t || (e.map(se).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Os(e) {
  const t = S(e, "target");
  if (!t) return null;
  if (t === "area")
    return Ms(e) ?? F("op.targetChoices", t) ?? "Área";
  const n = F("op.targetChoices", t) ?? H(t);
  return [t === "people" || t === "creatures" ? S(e, "targetQtd") : null, n].filter(Ge).join(" ");
}
function Ms(e) {
  const t = S(e, "area.name"), n = S(e, "area.size"), r = S(e, "area.type"), o = t ? F("op.areaChoices", t) ?? H(t) : null, a = r ? F("op.areaTypeChoices", r) ?? H(r) : null;
  return o ? n ? a ? `${o} ${n}m ${At(a)}` : `${o} ${n}m` : o : null;
}
function Fs(e) {
  const t = S(e, "skillResis"), n = S(e, "resistance");
  if (!t || !n) return null;
  const r = F("op.skill", t) ?? H(t), o = xs(n);
  return [r, o].filter(Ge).join(" ");
}
function xs(e) {
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
      return F("op.resistanceChoices", e) ?? H(e);
  }
}
function Us(e, t, n) {
  const r = S(e, t);
  return r ? F(n, r) ?? H(r) : null;
}
function Bs(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function js(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function qs(e) {
  return [
    `${c}__ritual-element-badge`,
    e ? `${c}__ritual-element-badge--${e}` : null
  ].filter(Ge).join(" ");
}
function Ht(e) {
  const t = be(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function $n(e) {
  const t = Ht(e);
  return t ? F("op.elementChoices", t) ?? H(t) : e ? H(e) : null;
}
function Hs(e) {
  return Ht(e);
}
function F(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = qt()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const _n = "data-paranormal-toolkit-dice-toggle-enhanced";
function Vs(e) {
  for (const t of Array.from(e.querySelectorAll(jr)))
    Wr(t);
}
function zs(e) {
  const t = Yr(e.target);
  if (!t) return;
  const n = Vt(t);
  n && (e.preventDefault(), Kr(n, t));
}
function Gs(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Yr(e.target);
  if (!t) return;
  const n = Vt(t);
  n && (e.preventDefault(), Kr(n, t));
}
function Wr(e) {
  const t = e.querySelector(jt);
  if (!t) return;
  const n = e.querySelector(Hr);
  if (n && n.getAttribute(_n) !== "true" && (n.setAttribute(_n, "true"), n.classList.add(Vr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Kr(e, t) {
  const n = e.querySelector(jt);
  if (!n) return;
  const r = !e.classList.contains(qr);
  Ws(e, t, n, r);
}
function Ws(e, t, n, r) {
  e.classList.toggle(qr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const o = t.querySelector("i");
  o && (o.classList.toggle("fa-chevron-down", !r), o.classList.toggle("fa-chevron-up", r));
}
function Yr(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Hr);
  if (!t) return null;
  const n = Vt(t);
  return n ? (Wr(n), t.classList.contains(Vr) ? t : null) : null;
}
function Vt(e) {
  const t = e.closest(jr);
  return t && t.querySelector(jt) ? t : null;
}
const En = `${u}-workflow-dice-toggle-styles`;
function Ks() {
  if (document.getElementById(En)) return;
  const e = document.createElement("style");
  e.id = En, e.textContent = `
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
const Ys = [0, 100, 500, 1500, 3e3];
let Sn = !1, tt = null;
function Qs() {
  if (!Sn) {
    Sn = !0, Ks(), Hooks.on("renderChatMessageHTML", (e, t) => {
      ge(wn(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      ge(wn(t));
    }), Hooks.once("ready", () => {
      ge(document), Zs();
    }), document.addEventListener("click", zs), document.addEventListener("keydown", Gs);
    for (const e of Ys)
      globalThis.setTimeout(() => ge(document), e);
  }
}
function Zs() {
  tt || !document.body || (tt = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && ge(n);
  }), tt.observe(document.body, { childList: !0, subtree: !0 }));
}
function ge(e) {
  e && (ds(e), As(e), ms(e), Vs(e), rs(e));
}
function Xs() {
  Qs();
}
const Js = {
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
}, ec = new Set(
  Object.values(Js)
), tc = {
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
function nc(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = rc(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = tc[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : ec.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function Qr(e) {
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
function rc(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class oc {
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
    const i = [], s = /* @__PURE__ */ new Set();
    let d = null;
    for (const [m, f] of t.instances.entries()) {
      const b = ac(f, m);
      if (!b.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const R = nc(f.damageType);
      if (!R.ok)
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(f.damageType)}.`,
          instance: f,
          damageType: f.damageType
        });
      if (b.amount === 0) {
        i.push(
          ic(b.id, f, R.value)
        );
        continue;
      }
      try {
        const k = await Promise.resolve(
          a.call(n, b.amount, {
            damageType: R.value ?? void 0,
            ignoreRD: f.ignoreResistance === !0,
            nonLethal: f.nonLethal === !0
          })
        );
        for (const N of cc(k.conditions))
          s.add(N);
        const g = sc(k.newPV);
        g !== null && (d = g), i.push({
          id: b.id,
          label: f.label ?? Qr(R.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: b.amount,
          finalDamage: Dn(k.finalDamage, b.amount),
          blocked: Dn(k.blocked, 0),
          damageType: f.damageType ? String(f.damageType) : null,
          systemDamageType: R.value,
          ignoreResistance: f.ignoreResistance === !0,
          nonLethal: f.nonLethal === !0
        });
      } catch (k) {
        return p({
          actor: n,
          actorId: o,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: f,
          cause: k
        });
      }
    }
    return y({
      actor: n,
      actorId: o,
      actorName: r,
      totalRawDamage: i.reduce(
        (m, f) => m + f.inputAmount,
        0
      ),
      totalFinalDamage: i.reduce(
        (m, f) => m + f.finalDamage,
        0
      ),
      totalBlocked: i.reduce(
        (m, f) => m + f.blocked,
        0
      ),
      newPV: d,
      conditions: Array.from(s),
      instances: i,
      source: t.source ?? null,
      originUuid: t.originUuid ?? null
    });
  }
}
function ac(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function ic(e, t, n) {
  return {
    id: e,
    label: t.label ?? Qr(n),
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
function Dn(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function sc(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function cc(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
const he = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Zr = {
  PV: "system.attributes.hp"
}, bt = {
  PV: [he.PV, Zr.PV],
  SAN: [he.SAN],
  PE: [he.PE],
  PD: [he.PD]
}, Tt = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class lc {
  getResource(t, n) {
    const r = Pn(t, n);
    if (!r.ok)
      return p(r.error);
    const o = r.value, a = `${o}.value`, i = `${o}.max`, s = foundry.utils.getProperty(t, a), d = foundry.utils.getProperty(t, i), m = Ln(t, n, a, s, "valor atual");
    if (m) return p(m);
    const f = Ln(t, n, i, d, "valor máximo");
    return f ? p(f) : y({
      value: s,
      max: d
    });
  }
  async updateResourceValue(t, n, r) {
    const o = Pn(t, n);
    if (!o.ok)
      throw new Error(o.error.message);
    await t.update({ [`${o.value}.value`]: r });
  }
}
function Pn(e, t) {
  const n = uc(e.type, t);
  if (n && Nn(e, n))
    return y(n);
  const r = bt[t].find(
    (o) => Nn(e, o)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: dc(e, t),
    path: bt[t].join(" | ")
  });
}
function uc(e, t) {
  return e === "threat" ? Zr[t] ?? null : e === "agent" ? he[t] : null;
}
function Nn(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function dc(e, t) {
  const n = e.type ?? "unknown", r = bt[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function Ln(e, t, n, r, o) {
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
class mc {
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
      const i = Tt.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${i.join(", ")}.`,
        ritual: t,
        paths: [...i]
      });
    }
    const { path: r, value: o } = n, a = fc(o);
    return a ? y(a) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(o)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: o
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Tt.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function fc(e) {
  if (vn(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (vn(n))
      return n;
  }
  return null;
}
function vn(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const pc = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class gc {
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
    const r = n.value, o = hc(t.ritual, r);
    return o.ok ? o.value ? y(o.value) : y({
      resource: "PE",
      amount: pc[r],
      source: "default-by-circle",
      circle: r
    }) : p(o.error);
  }
}
function hc(e, t) {
  const n = e.getFlag(u, "ritual.cost");
  return n == null ? { ok: !0, value: null } : yc(n) ? {
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
function yc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const nt = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Ac(e) {
  if (!Ic(e.item)) return null;
  const t = Rt(e.actor) ? e.actor : bc(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Rc(e.token) ?? Tc(t),
    targets: Ut(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function bc(e) {
  const t = e;
  return Rt(t.actor) ? t.actor : Rt(e.parent) ? e.parent : null;
}
function Tc(e) {
  const t = kc(e) ?? Cc(e);
  return t ? Xr(t) : null;
}
function Rc(e) {
  return kt(e) ? Xr(e) : null;
}
function kc(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return kt(n) ? n : (t.getActiveTokens?.() ?? []).find(kt) ?? null;
}
function Cc(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Xr(e) {
  const t = e.actor ?? null;
  return {
    tokenId: rt(e.id),
    actorId: rt(t?.id),
    sceneId: rt(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Ic(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Rt(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function kt(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function rt(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class wc {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(nt.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, l.info(`${nt.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Ac($c(t));
    if (!n) {
      l.warn(`${nt.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function $c(e) {
  return e && typeof e == "object" ? e : {};
}
class _c {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return ot("missing-item-patch");
    if (t.type !== "ritual") return ot("unsupported-item-type");
    const o = Ec(r);
    return Object.keys(o).length === 0 ? ot("empty-update") : (await t.update(o), {
      applied: !0,
      updateData: o
    });
  }
}
function Ec(e) {
  const t = {};
  w(t, "name", e.name), w(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (w(t, "system.circle", n.circle), w(t, "system.element", n.element), w(t, "system.target", n.target), w(t, "system.targetQtd", n.targetQuantity), w(t, "system.execution", n.execution), w(t, "system.range", n.range), w(t, "system.duration", n.duration), w(t, "system.skillResis", n.resistanceSkill), w(t, "system.resistance", n.resistance), w(t, "system.studentForm", n.studentForm), w(t, "system.trueForm", n.trueForm)), t;
}
function w(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function ot(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Sc {
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
    return this.getNumber(t, Tt.ritual.dt, 0);
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
class Dc {
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
class Pc {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Nc(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, at(t)), y(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const o = this.register(r);
      if (!o.ok)
        return o;
      n.push(o.value);
    }
    return y(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? at(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? y(n) : p({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(at);
  }
  findForItem(t) {
    return this.list().map((n) => Lc(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Nc(e) {
  return !it(e.id) || !it(e.version) || !it(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function Lc(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const o of e.matchers) {
    const a = vc(o, t);
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
function vc(e, t) {
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
      const n = On(t.name), r = e.names.map(On).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Oc(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function On(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Oc(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function at(e) {
  return structuredClone(e);
}
function it(e) {
  return typeof e == "string" && e.length > 0;
}
function Me(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = We(e.amountFrom);
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
    }) : y(o);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function We(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
const Mc = "dice-so-nice";
async function Jr(e) {
  if (!vi().enabled || !Fc()) return;
  const t = xc();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      l.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Fc() {
  return game.modules.get(Mc)?.active === !0;
}
function xc() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
async function Uc(e, t, n) {
  if (!Mn(e.id) || !Mn(e.formula))
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
    await Jr(o);
    const s = {
      ...n.rollRequests[e.id] ?? eo(e, t),
      total: a,
      roll: o
    };
    return n.rolls[e.id] = s, y(s);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function eo(e, t) {
  const n = e.intent ?? Bc(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType,
    sourceStepIndex: t
  };
}
function Bc(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Mn(e) {
  return typeof e == "string" && e.length > 0;
}
async function Fe(e, t, n, r, o) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? Se(t, n, r, o) : e.spend(t, n, o);
    case "damage":
      return n !== "PV" && n !== "SAN" ? Se(t, n, r, o) : e.damage(t, n, o);
    case "heal":
      return n !== "PV" ? Se(t, n, r, o) : e.heal(t, n, o);
    case "recover":
      return n !== "SAN" ? Se(t, n, r, o) : e.recover(t, n, o);
  }
}
function Se(e, t, n, r) {
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
function jc(e) {
  const { step: t, context: n, transaction: r, stepIndex: o, lifecycle: a } = e;
  if (t.operation === "damage") {
    const i = qc(t, n, r, o);
    n.damageInstances.push(i), a.emit("afterDamageResolution", n, {
      stepIndex: o,
      step: t,
      damage: i,
      resourceTransaction: r,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount,
        damageType: i.damageType
      }
    }), a.emit("afterApplyDamage", n, {
      stepIndex: o,
      step: t,
      damage: i,
      resourceTransaction: r,
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
    const i = Hc(t, n, r, o);
    n.healingInstances.push(i), a.emit("afterApplyHealing", n, {
      stepIndex: o,
      step: t,
      healing: i,
      resourceTransaction: r,
      metadata: {
        rawAmount: i.rawAmount,
        finalAmount: i.finalAmount,
        appliedAmount: i.appliedAmount
      }
    });
  }
}
function qc(e, t, n, r) {
  const o = We(e.amountFrom), a = o ? t.rolls[o] : void 0;
  return {
    id: to(t.id, "damage", r, t.damageInstances.length),
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
function Hc(e, t, n, r) {
  const o = We(e.amountFrom);
  return {
    id: to(t.id, "healing", r, t.healingInstances.length),
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
function to(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function Vc(e, t, n) {
  const r = We(e.amountFrom), o = r ? t.rolls[r] : void 0;
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
function zc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("beforeApply", n, { stepIndex: r, step: t, metadata: o }), no("before", e), Fn("before", e), Fn("resolve", e);
}
function Gc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("apply", n, { stepIndex: r, step: t, metadata: o }), no("apply", e);
}
function Wc(e) {
  const { step: t, context: n, stepIndex: r, metadata: o, lifecycle: a } = e;
  a.emit("afterApply", n, { stepIndex: r, step: t, metadata: o });
}
function no(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t, s = Kc(e, n.operation);
  s && i.emit(s, r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Fn(e, t) {
  const { step: n, context: r, stepIndex: o, metadata: a, lifecycle: i } = t;
  n.operation === "damage" && i.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: o,
    step: n,
    metadata: a
  });
}
function Kc(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function Yc(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), y(void 0);
  } catch (r) {
    return p({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function Qc(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return Zc(e, t);
    case "spendRitualCost":
      return Xc(e, t);
  }
}
async function Zc(e, t) {
  const { context: n, resources: r } = e, o = Me(t, n);
  return o.ok ? ro(await r.spend(n.sourceActor, t.resource, o.value), n) : p(o.error);
}
async function Xc(e, t) {
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
  const i = a.value;
  return n.ritualCosts.push({
    ...i,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), ro(await r.spend(n.sourceActor, i.resource, i.amount), n, t);
}
function ro(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Jc(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: o, execute: a } = e, i = el(t);
  for (const d of i.before)
    o.emit(d, n, { stepIndex: r, step: t });
  const s = await a();
  if (!s.ok)
    return s;
  for (const d of i.after)
    o.emit(d, n, { stepIndex: r, step: t });
  return s;
}
function el(e) {
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
class tl {
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
    return y({ definition: t, context: n });
  }
  async runStep(t, n, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, r);
      default:
        return Jc({
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
    const o = await Qc({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const o = eo(t, r);
    n.rollRequests[o.id] = o, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("before", o, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: o }), this.emitSpecificRollPhase("roll", o, n, r, t);
    const a = await this.runRollFormulaStep(t, n, r);
    if (!a.ok)
      return a;
    const i = n.rolls[o.id];
    return this.emitSpecificRollPhase("after", o, n, r, t, i), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: o, rollResult: i }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const o = await Uc(t, r, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const o = Me(t, n);
    if (!o.ok)
      return p({ ...o.error, stepIndex: r, step: t, context: n });
    const a = Vc(t, n, o.value);
    zc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), Gc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    });
    const i = this.resolveActors(t.actor, n);
    if (i.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const s of i) {
      const d = await Fe(this.resources, s, t.resource, t.operation, o.value), m = this.handleResourceOperationResult(d, n, r, t);
      if (!m.ok)
        return m;
      jc({
        step: t,
        context: n,
        transaction: m.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Wc({
      step: t,
      context: n,
      stepIndex: r,
      metadata: a,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const o = Me(t, n);
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
    for (const i of a) {
      const s = await Fe(this.resources, i, t.resource, t.operation, o.value), d = this.handleResourceOperationResult(s, n, r, t);
      if (!d.ok)
        return d;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const o = await Yc(this.messages, t, n);
    return o.ok ? y(void 0) : p({ ...o.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, o) {
    return t.ok ? (n.resourceTransactions.push(t.value), y(t.value)) : p({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: o,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, o, a, i) {
    const s = nl(t, n.intent);
    s && this.lifecycle.emit(s, r, {
      stepIndex: o,
      step: a,
      rollRequest: n,
      rollResult: i
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
function nl(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class rl {
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
    const i = a.value, s = this.calculate(r, i, o);
    if (!s.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: s.error.reason,
        message: s.error.message,
        requestedAmount: o,
        current: i.value,
        required: o
      });
    const { afterValue: d, appliedAmount: m } = s.value, f = {
      value: d,
      max: i.max
    };
    try {
      d !== i.value && await this.adapter.updateResourceValue(t, n, d);
    } catch (b) {
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "update-failed",
        message: `Falha ao atualizar ${n} no ator.`,
        requestedAmount: o,
        current: i.value,
        required: o,
        cause: b
      });
    }
    return y({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: o,
      appliedAmount: m,
      before: i,
      after: f
    });
  }
  calculate(t, n, r) {
    switch (t) {
      case "spend":
        return n.value < r ? p({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${n.value}; custo: ${r}.`
        }) : y({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const o = Math.max(0, n.value - r);
        return y({
          afterValue: o,
          appliedAmount: n.value - o
        });
      }
      case "heal":
      case "recover": {
        const o = Math.min(n.max, n.value + r);
        return y({
          afterValue: o,
          appliedAmount: o - n.value
        });
      }
    }
  }
}
function oo(e) {
  return {
    id: ol(),
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
function ol() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class al {
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
    return X(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = oo(n);
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
class il {
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
class sl {
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
    const n = ht();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: cl(),
      flags: {
        ...t.flags,
        [u]: {
          ...ll(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && l.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = ht();
    if (!r.enabled)
      return;
    const o = n.notification ?? xn(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, o);
  }
  emitConsole(t, n) {
    const r = xn(n);
    switch (t) {
      case "info":
        l.info(r, n.data ?? "");
        return;
      case "warn":
        l.warn(r, n.data ?? "");
        return;
      case "error":
        l.error(r, n.data ?? "");
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
function xn(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function cl() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function ll(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function ul(e, t) {
  const n = yl(e?.rounds);
  if (!n)
    return Un(null);
  const r = e?.anchor ?? ao(t);
  if (!r)
    return {
      ...Un(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const o = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: dl(),
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
function ao(e) {
  const t = Al();
  if (!t?.id || !io(t.round)) return null;
  const n = gl(t), r = ml(e, n) ?? pl(t), o = q(r?.id), a = Tl(r?.initiative), i = fl(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: o,
    round: t.round,
    turn: i,
    initiative: a,
    time: bl()
  };
}
function dl() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function Un(e) {
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
function ml(e, t) {
  return e?.id ? t.find((n) => hl(n) === e.id) ?? null : null;
}
function fl(e, t, n) {
  const r = q(t?.id);
  if (r) {
    const o = n.findIndex((a) => a.id === r);
    if (o >= 0) return o;
  }
  return Rl(e.turn) ? e.turn : null;
}
function pl(e) {
  return Le(e.combatant) ? e.combatant : null;
}
function gl(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(Le);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(Le);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(Le);
  }
  return [];
}
function hl(e) {
  return q(e.actor?.id) ?? q(e.actorId) ?? q(e.token?.actor?.id) ?? q(e.token?.actorId) ?? q(e.document?.actor?.id) ?? q(e.document?.actorId);
}
function yl(e) {
  return io(e) ? Math.trunc(e) : null;
}
function Al() {
  return game.combat ?? null;
}
function bl() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Le(e) {
  return !!(e && typeof e == "object");
}
function q(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Tl(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function io(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Rl(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class kl {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? y(n.value) : p({
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
    if (!Nl(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const o = n.value, a = ul(t.duration, r), i = Cl(o, t, a), d = t.refreshExisting ?? !0 ? Ll(r, o.id) : null;
    if (d)
      try {
        return await Promise.resolve(d.update?.(i)), y(Bn(r, o, d.id ?? null, !1, !0, a));
      } catch (m) {
        return p({
          actor: r,
          actorId: r.id ?? null,
          actorName: r.name ?? "Ator sem nome",
          conditionId: o.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
          cause: m
        });
      }
    try {
      const f = (await r.createEmbeddedDocuments("ActiveEffect", [i]))[0]?.id ?? null;
      return y(Bn(r, o, f, !0, !1, a));
    } catch (m) {
      return p({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: o.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${o.label} em ${r.name ?? "ator sem nome"}.`,
        cause: m
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
    const r = this.resolveCanonicalConditionId(t.conditionId), o = co(n, r);
    let a = 0;
    try {
      for (const i of o)
        await jn(n, i) === "deleted" && (a += 1);
    } catch (i) {
      return p({
        actor: n,
        actorId: n.id ?? null,
        actorName: n.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "delete-failed",
        message: `Falha ao remover condição ${t.conditionId} de ${n.name ?? "ator sem nome"}.`,
        cause: i
      });
    }
    return y({
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
    const n = Ml(), r = [];
    let o = 0, a = 0;
    for (const i of n) {
      const s = zt(i);
      o += s.length;
      for (const d of s) {
        if (!$l(d, t)) continue;
        const m = so(d);
        try {
          await jn(i, d) === "deleted" && (a += 1);
        } catch (f) {
          r.push({
            actorId: i.id ?? null,
            actorName: i.name ?? "Ator sem nome",
            effectId: d.id ?? null,
            conditionId: m.conditionId,
            message: `Falha ao remover condição expirada ${m.conditionId ?? d.name ?? "desconhecida"} de ${i.name ?? "ator sem nome"}.`,
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
function Cl(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Gl(),
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
    duration: Il(n.duration),
    start: wl(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [u]: r
    }
  };
}
function Il(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function wl(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: zl(),
    ...e
  };
}
function Bn(e, t, n, r, o, a) {
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
function $l(e, t) {
  const n = so(e);
  if (!n.conditionId || !_l(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Vl();
  return n.durationMode === "combatantTurn" || El(n) ? Dl(n, r) : Sl(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !D(n.startRound) || !D(n.requestedRounds) || !D(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function _l(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && D(e.requestedRounds);
}
function El(e) {
  return !!(e.combatDurationApplied && D(e.requestedRounds) && D(e.startRound) && (e.startCombatantId || xe(e.startTurn)));
}
function Sl(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Dl(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !D(e.startRound) || !D(e.requestedRounds) || !D(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Pl(t);
  return e.startCombatantId ? r === e.startCombatantId : xe(e.startTurn) && xe(t.turn) ? t.turn === e.startTurn : !1;
}
function Pl(e) {
  return re(e.combatant?.id);
}
function so(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: ve(e, "conditionId"),
    requestedRounds: qn(e, "requestedRounds") ?? ye(t.value) ?? ye(t.rounds),
    combatDurationApplied: st(e, "combatDurationApplied"),
    combatId: ve(e, "combatId") ?? re(n.combat) ?? re(t.combat),
    startCombatantId: ve(e, "startCombatantId") ?? re(n.combatant),
    startInitiative: Bl(e, "startInitiative") ?? lo(n.initiative),
    startRound: qn(e, "startRound") ?? ye(n.round) ?? ye(t.startRound),
    startTurn: Ul(e, "startTurn") ?? Ct(n.turn) ?? Ct(t.startTurn),
    expiryEvent: jl(e, "expiryEvent") ?? uo(t.expiry),
    durationMode: ql(e, "durationMode"),
    deleteOnExpire: st(e, "deleteOnExpire"),
    expiresWithCombat: st(e, "expiresWithCombat")
  };
}
function Nl(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Ll(e, t) {
  return co(e, t)[0] ?? null;
}
function co(e, t) {
  return zt(e).filter((n) => xl(n) === t);
}
async function jn(e, t) {
  const n = t.id ?? null, r = n ? vl(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (o) {
    if (Ol(o)) return "missing";
    throw o;
  }
}
function vl(e, t) {
  return zt(e).find((n) => n.id === t) ?? null;
}
function Ol(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Ml() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      De(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    De(e, n);
  });
  for (const n of Fl())
    De(e, n.actor), De(e, n.document?.actor);
  return Array.from(e.values());
}
function De(e, t) {
  if (!Hl(t)) return;
  const r = re(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Fl() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function zt(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function xl(e) {
  return ve(e, "conditionId");
}
function ve(e, t) {
  return re(J(e, t));
}
function qn(e, t) {
  return ye(J(e, t));
}
function Ul(e, t) {
  return Ct(J(e, t));
}
function Bl(e, t) {
  return lo(J(e, t));
}
function jl(e, t) {
  return uo(J(e, t));
}
function ql(e, t) {
  const n = J(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function st(e, t) {
  return J(e, t) === !0;
}
function J(e, t) {
  const n = e.getFlag?.(u, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const o = r[u];
  if (!(!o || typeof o != "object"))
    return o[t];
}
function re(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function ye(e) {
  return D(e) ? Math.trunc(e) : null;
}
function Ct(e) {
  return xe(e) ? Math.trunc(e) : null;
}
function lo(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function uo(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Hl(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Vl() {
  return game.combat ?? null;
}
function zl() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function D(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function xe(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Gl() {
  return game.user?.id ?? null;
}
const Wl = "icons/svg/downgrade.svg", Kl = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function A(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Wl,
    description: Kl,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Yl = A({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), Ql = A({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Zl = A({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), Xl = A({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), Jl = A({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), eu = A({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), tu = A({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), nu = A({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), ru = A({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), ou = A({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), au = A({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), iu = A({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), su = A({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), cu = A({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), lu = A({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), uu = A({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), du = A({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), mu = A({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), fu = A({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), pu = A({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), gu = A({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), hu = A({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), yu = A({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Au = A({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), bu = A({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Tu = A({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Ru = A({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), ku = A({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), Cu = A({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Iu = A({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), wu = A({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), $u = A({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), _u = A({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Eu = A({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Su = [
  Yl,
  Ql,
  Zl,
  Xl,
  Jl,
  eu,
  tu,
  nu,
  ru,
  ou,
  au,
  iu,
  su,
  cu,
  lu,
  uu,
  du,
  mu,
  fu,
  pu,
  gu,
  hu,
  yu,
  Au,
  bu,
  Tu,
  Ru,
  ku,
  Cu,
  Iu,
  wu,
  $u,
  _u,
  Eu
];
class Du {
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
    return Array.from(this.definitions.values()).map(Hn);
  }
  get(t) {
    const n = this.lookup.get(Vn(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(Hn(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Vn(t);
    r && this.lookup.set(r, n);
  }
}
function Pu() {
  return new Du(Su);
}
function Hn(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Vn(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
const Nu = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", mo = `${u}-inline-roll-neutralized`, Lu = `${u}-inline-roll-notice`, Gt = `data-${u}-inline-roll-neutralized`, zn = `data-${u}-inline-roll-notice`, vu = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function Gn(e) {
  const t = Ku(e.message), n = await Ou(e.message), r = Mu(t);
  return n.replacementCount + r.replacementCount > 0 && l.info("Rolagens inline neutralizadas para item automatizado.", {
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
async function Ou(e) {
  const t = zu(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = Fu(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Gu(t, n.content), replacementCount: n.replacementCount };
}
function Mu(e) {
  const t = e ? Wu(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = fo(t);
  return n > 0 && po(qu(t)), { replacementCount: n };
}
function Fu(e) {
  const t = xu(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = fo(n.content), o = t.replacementCount + r;
  return o === 0 ? { content: e, replacementCount: 0 } : (po(n.content), { content: n.innerHTML, replacementCount: o });
}
function xu(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, o) => (t += 1, Bu(o.trim()))), replacementCount: t };
}
function fo(e) {
  const t = Uu(e);
  for (const n of t)
    n.replaceWith(ju(Hu(n)));
  return t.length;
}
function Uu(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(Nu))
    n.getAttribute(Gt) !== "true" && t.add(n);
  return Array.from(t);
}
function Bu(e) {
  return `<span class="${mo}" ${Gt}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${Yu(e)}</span>`;
}
function ju(e) {
  const t = document.createElement("span");
  return t.classList.add(mo), t.setAttribute(Gt, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function po(e) {
  if (e.querySelector?.(`[${zn}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Lu), t.setAttribute(zn, "true"), t.textContent = vu, e.append(t);
}
function qu(e) {
  return e.querySelector(".message-content") ?? e;
}
function Hu(e) {
  const n = e.getAttribute("data-formula") ?? Vu(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Vu(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function zu(e) {
  return e && typeof e == "object" ? e : null;
}
async function Gu(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return l.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function Wu(e) {
  const t = Qu(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Ku(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function Yu(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Qu(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Wn = "occultism";
function Zu(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Xu(e) {
  const t = Zu(e);
  if (t === null)
    throw new Error("Não foi possível ler a DT de ritual do conjurador.");
  const n = await Ju(e, Wn);
  if (!n)
    throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
  await Jr(n);
  const r = nd(n);
  return {
    skill: Wn,
    skillLabel: "Ocultismo",
    roll: n,
    formula: td(n),
    total: r,
    difficulty: t,
    success: r >= t,
    diceBreakdown: rd(n)
  };
}
async function Ju(e, t) {
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
  return ed(r);
}
function ed(e) {
  return Kn(e) ? e : Array.isArray(e) ? e.find(Kn) ?? null : null;
}
function Kn(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function td(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function nd(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function rd(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(od);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function od(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
function ad(e) {
  return {
    header: {
      eyebrow: Lt,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: ud(e.ritual)
    },
    forms: e.variantOptions.map((t) => id(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: ld(e.automationStatus ?? "assisted")
  };
}
function id(e, t) {
  const n = sd(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? cd(t) : "—",
    details: n
  };
}
function sd(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function cd(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function ld(e) {
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
function ud(e) {
  const t = e.system, n = [md(t?.element), dd(t?.circle)].filter(fd);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function dd(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function md(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  const t = e.trim();
  return `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`;
}
function fd(e) {
  return typeof e == "string" && e.length > 0;
}
const go = ["base", "discente", "verdadeiro"];
function ho(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Ue(e) {
  return typeof e == "string" && go.includes(e);
}
const { ApplicationV2: pd } = foundry.applications.api;
class Ae extends pd {
  constructor(t, n) {
    super({
      id: `${u}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.input = t, this.resolveRequest = n, this.model = ad(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
  }
  input;
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
      cast: Ae.onCast,
      cancel: Ae.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new Ae(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const o = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    hd(o, (a) => {
      this.selectedVariant = a;
    }), yd(o, (a) => {
      this.spendResource = a;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${$(this.model.header.eyebrow)}</p>
        <div>
          <h2>${$(this.model.header.title)}</h2>
          <p>${$(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(gd).join("")}
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
          <div><dt>Custo base</dt><dd>${$(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${$(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${$(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${$(this.model.automation.title)}</strong></p>
        <p>${$(this.model.automation.description)}</p>
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
    const n = Td(t), r = Ad(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function gd(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", o = e.details.map((a) => `<span>${$(a)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${$(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${$(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${$(e.label)}</strong>
        <em>${$(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${o}</span>
    </label>
  `;
}
function hd(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const o of n)
    o.addEventListener("click", () => Yn(e, o, t)), o.addEventListener("keydown", (a) => {
      a.key !== "Enter" && a.key !== " " || (a.preventDefault(), Yn(e, o, t));
    });
  const r = yo(e);
  r && t(r);
}
function Yn(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Ue(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), yo(e));
}
function yo(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const o = r.querySelector('input[name="variant"]'), a = o?.checked === !0;
    r.setAttribute("aria-checked", a ? "true" : "false"), a && Ue(o.value) && (n = o.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function yd(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function Ad(e, t, n) {
  const r = bd(e) ?? n, o = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: o
  };
}
function bd(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Ue(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Ue(n) ? n : null;
}
function Td(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function $(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function Rd(e) {
  return Ae.request(e);
}
const Wt = {
  label: "Padrão"
}, kd = {
  label: "Discente",
  extraCost: 2
}, Cd = {
  label: "Verdadeiro",
  extraCost: 5
};
class Id {
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
    const r = this.resolveCostPreview(t), o = fm(n), a = um(
      n,
      t.item,
      r,
      o
    ), i = await Rd({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((I) => I.name),
      cost: r,
      defaultSpendResource: bm(n),
      variantOptions: a,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!i)
      return { status: "cancelled" };
    const s = wd(i), d = gm(
      n,
      t.item,
      s.variant,
      o
    ), m = vr();
    let f = null;
    if (m) {
      const I = await _d(
        this.resources,
        t.actor,
        s,
        d,
        r
      );
      if (!I.ok)
        return {
          status: "failed",
          reason: I.reason,
          message: I.message
        };
      try {
        f = await Xu(
          t.actor
        );
      } catch (B) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: B instanceof Error ? B.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: B
        };
      }
    }
    const b = $d(
      n,
      s,
      d,
      r,
      {
        includeCostSteps: !m
      }
    );
    if (b.steps.length === 0) {
      const I = pm(
        t,
        s
      ), B = Qn(
        t.actor,
        f,
        d,
        r
      ), rn = Zn(
        n,
        s,
        d,
        r,
        I,
        f
      );
      return B.length > 0 ? {
        status: "ready",
        workflowContext: I,
        actions: B,
        summaryLines: rn
      } : {
        status: "completed-without-actions",
        workflowContext: I,
        summaryLines: rn
      };
    }
    const R = await this.workflow.runAutomation(b, {
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
    const k = R.value.context, g = vd(
      n,
      t,
      k
    ), N = Sd(
      n,
      t
    ), ue = Qn(
      t.actor,
      f,
      d,
      r
    ), de = Zn(
      n,
      s,
      d,
      r,
      k,
      f
    );
    if (!g.ok)
      return {
        status: "failed",
        reason: g.reason,
        message: g.message
      };
    if (!N.ok)
      return {
        status: "failed",
        reason: N.reason,
        message: N.message
      };
    const me = [
      ...ue,
      ...g.actions,
      ...N.actions
    ];
    return me.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: k,
      summaryLines: de
    } : {
      status: "ready",
      workflowContext: k,
      actions: me,
      summaryLines: de
    };
  }
  async applyAction(t) {
    return Fe(
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
function wd(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function $d(e, t, n, r, o) {
  const a = [], i = t.spendResource === !0;
  for (const s of e.steps)
    s.type === "modifyResource" || s.type === "chatCard" || Kt(s) && (!o.includeCostSteps || !i) || a.push(Ed(s, n));
  return o.includeCostSteps && i && r && Tm(n.extraCost) && a.push({
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
async function _d(e, t, n, r, o) {
  if (n.spendResource !== !0) return { ok: !0 };
  const a = Ce(o, r);
  if (!a)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (a.amount <= 0) return { ok: !0 };
  const i = await e.spend(
    t,
    a.resource,
    a.amount
  );
  return i.ok ? { ok: !0 } : {
    ok: !1,
    reason: i.error.reason,
    message: i.error.message
  };
}
function Ed(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function Qn(e, t, n, r) {
  if (!t || t.success) return [];
  const o = Ce(r, n);
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
function Sd(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const o = Ao(r.actor, t);
    if (o.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    for (const a of o) {
      const i = ao(a);
      n.push(
        Dd(
          r,
          a,
          t.item,
          i
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function Dd(e, t, n, r) {
  const o = t.name ?? "Ator sem nome", a = e.label ?? Ld(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: o,
    conditionId: e.conditionId,
    conditionLabel: a,
    duration: Pd(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: Nd(a, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${a} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function Pd(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function Nd(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Ld(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function vd(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Map();
  for (const a of e.steps) {
    if (a.type !== "modifyResource") continue;
    const i = Me(a, n);
    if (!i.ok)
      return {
        ok: !1,
        reason: i.error.reason,
        message: i.error.message
      };
    const s = Ao(a.actor, t);
    if (s.length === 0)
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    for (const d of s) {
      if (Od(a)) {
        Md(
          o,
          d,
          Fd(a, n, i.value)
        );
        continue;
      }
      r.push(Ud(a, d, i.value));
    }
  }
  for (const a of o.values())
    r.push(
      ...xd(
        e,
        t.item,
        a.actor,
        a.entries
      )
    );
  return { ok: !0, actions: r };
}
function Od(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function Md(e, t, n) {
  const r = Hd(t), o = e.get(r);
  if (o) {
    o.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function Fd(e, t, n) {
  const r = Vd(e.amountFrom), o = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? o ?? null,
    sourceRollId: r
  };
}
function xd(e, t, n, r) {
  const o = Kd(e), a = o.length > 1 ? Zd() : void 0;
  return o.map((i) => {
    const s = r.map(
      (m, f) => {
        const b = Yd(m.amount, i);
        return {
          id: Bd(m, i, f),
          amount: b,
          damageType: m.damageType,
          sourceRollId: m.sourceRollId,
          ignoreResistance: m.step.ignoreResistance === !0
        };
      }
    ), d = s.reduce(
      (m, f) => m + f.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: s,
      label: jd(d, i, o.length > 1),
      executedLabel: qd(
        n.name ?? "Ator sem nome",
        i,
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
function Ud(e, t, n) {
  const r = t.name ?? "Ator sem nome", o = Wd(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: zd(e, r, n),
    executedLabel: Gd(e, r),
    actionSectionId: o.id,
    actionSectionTitle: o.title
  };
}
function Bd(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function jd(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function qd(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function Hd(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function Vd(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function zd(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function Gd(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function Wd(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function Kd(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function Yd(e, t) {
  const n = e * t.multiplier, r = Qd(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function Qd(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function Zd() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Ao(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function Zn(e, t, n, r, o, a = null) {
  return [
    `Forma: ${ho(t.variant)}`,
    Jd(t, n, r),
    ...Xd(a),
    ...Object.values(o.rolls).flatMap(em),
    ...tm(e.resistance),
    ...cm(n)
  ];
}
function Xd(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function Jd(e, t, n) {
  const r = Ce(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function em(e) {
  const n = [`${lm(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = nm(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${sm(e.damageType)}`), n;
}
function tm(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function nm(e) {
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
    const i = rm(a);
    i && (im(
      n,
      i.operator ?? r,
      i.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function rm(e) {
  const t = om(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : am(e);
}
function om(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function am(e) {
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
function im(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function sm(e) {
  return e.length === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function cm(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function lm(e) {
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
function um(e, t, n, r) {
  return go.map((o) => {
    const a = bo(
      e,
      t,
      o,
      r
    ), i = a !== null;
    return {
      variant: o,
      label: a?.label ?? ho(o),
      enabled: i,
      details: a ? dm(a, n, r) : [],
      finalCostText: a ? mm(n, a) : null,
      unavailableReason: i ? void 0 : "não disponível neste ritual"
    };
  });
}
function dm(e, t, n) {
  const r = [], o = Object.values(e.rollFormulaOverrides ?? {});
  o.length > 0 ? r.push(o.join(", ")) : n && r.push("efeito manual");
  const a = Ce(t, e);
  return r.push(
    a ? `Custo final: ${a.amount} ${a.resource}` : "Custo final não resolvido"
  ), r;
}
function Ce(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function mm(e, t) {
  const n = Ce(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function fm(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(Kt);
}
function pm(e, t) {
  return oo({
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
function gm(e, t, n, r) {
  return bo(e, t, n, r) ?? Wt;
}
function bo(e, t, n, r) {
  const o = e.ritualForms?.[n] ?? null;
  return o || (r ? ym(t, n) ? hm(n) : null : n === "base" ? Wt : null);
}
function hm(e) {
  switch (e) {
    case "base":
      return Wt;
    case "discente":
      return kd;
    case "verdadeiro":
      return Cd;
  }
}
function ym(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return Am(foundry.utils.getProperty(e, n));
}
function Am(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function bm(e) {
  return e.steps.some(Kt);
}
function Kt(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function Tm(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
async function Rm(e, t) {
  const n = await km(e, t);
  if (!n)
    throw new Error(`Não foi possível rolar a resistência ${t} pelo sistema Ordem.`);
  return {
    roll: n,
    formula: Im(n),
    total: wm(n),
    diceBreakdown: $m(n)
  };
}
function To(e) {
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
async function km(e, t) {
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
  return Cm(r);
}
function Cm(e) {
  return Xn(e) ? e : Array.isArray(e) ? e.find(Xn) ?? null : null;
}
function Xn(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Im(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function wm(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function $m(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(_m);
  if (!n) return null;
  const o = (Array.isArray(n.results) ? n.results : []).flatMap((a) => {
    if (!a || typeof a != "object") return [];
    const i = a.result;
    return typeof i == "number" && Number.isFinite(i) ? [Math.trunc(i)] : [];
  });
  return o.length > 0 ? `(${o.join(", ")})` : null;
}
function _m(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Ro = "itemUsePrompts", ko = "chatCard", Ke = "data-paranormal-toolkit-prompt-id", Ye = "data-paranormal-toolkit-pending-id", Yt = "data-paranormal-toolkit-executed-label", It = "data-paranormal-toolkit-choice-group", Co = "data-paranormal-toolkit-skipped-label", Jn = "data-paranormal-toolkit-action-section", er = "data-paranormal-toolkit-detail-key", tr = "data-paranormal-toolkit-roll-card", Qt = "data-paranormal-toolkit-roll-detail-toggle", Io = "data-paranormal-toolkit-roll-detail-id", wo = "data-paranormal-toolkit-resistance-roll-button", $o = "data-paranormal-toolkit-resistance-skill", _o = "data-paranormal-toolkit-resistance-skill-label", Eo = "data-paranormal-toolkit-resistance-target-actor-id", So = "data-paranormal-toolkit-resistance-target-name", Do = "data-paranormal-toolkit-resistance-roll-result", nr = "data-paranormal-toolkit-system-card-replaced", Em = `[${Ye}]`, Sm = `[${Qt}]`, Dm = `[${wo}]`, wt = `${u}-chat-enrichment`, h = `${u}-item-use-prompt`, Pm = `${h}__actions`, rr = `${h}__details`, Po = `${h}__summary`, Nm = `${h}__title`, No = `${h}__button--executed`, or = `${h}__roll-card`;
let ar = !1, $t = null;
const P = /* @__PURE__ */ new Map(), Lm = [0, 100, 500, 1500, 3e3], vm = 3e4, Om = [0, 100, 500, 1500, 3e3];
function Mm(e) {
  if ($t = e, ar) {
    sr(e);
    return;
  }
  const t = (n, r) => {
    vo(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), ar = !0, sr(e);
}
async function ir(e) {
  const t = Lo(e);
  P.set(e.pendingId, t), await Jt(t) || Vo(t), Oo(e.pendingId);
}
async function Fm(e) {
  const t = Lo({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", P.set(e.pendingId, t), await Jt(t) || Vo(t), Oo(e.pendingId);
}
async function ct(e, t) {
  const n = P.get(e);
  P.delete(e), n && await Ff(n, t);
}
function Zt(e) {
  const t = Qo();
  for (const n of t) {
    const r = U(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function xm(e, t) {
  const n = Zt(e);
  if (!n) return;
  const r = U(n.message), o = r[e];
  o && (r[e] = {
    ...o,
    executedLabel: o.executedLabel,
    executed: !0
  }, await ce(n.message, r));
}
async function Um(e, t, n) {
  if (!t) return;
  const r = Zt(e);
  if (!r) return;
  const o = U(r.message);
  let a = !1;
  for (const [i, s] of Object.entries(o))
    i !== e && s.choiceGroupId === t && (o[i] = {
      ...s,
      executedLabel: n ?? s.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, a = !0);
  a && await ce(r.message, o);
}
function Lo(e) {
  const t = V(e.context.message), n = e.context.targets.find((i) => Dt(i)), r = n ? Dt(n) : null, o = e.resistanceTargetActor ?? r, a = e.resistanceTargetName ?? n?.name ?? o?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: mf(e.context),
    executed: !1
  };
}
function vo(e, t, n) {
  Mf();
  const r = Ze(t);
  if (!r) return;
  const o = Lf(e, r);
  o.length > 0 && Be(r);
  for (const a of o)
    _t(r, a);
  xo(r, n), Et(r), St(r);
}
function sr(e) {
  for (const t of Om)
    globalThis.setTimeout(() => {
      Bm(e);
    }, t);
}
function Bm(e) {
  for (const t of jm()) {
    const n = Qe(t);
    qm(n) && vo(n, t, e);
  }
}
function jm() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function qm(e) {
  return e ? en(e) ? !0 : Uf(e).length > 0 : !1;
}
function Oo(e) {
  const t = P.get(e);
  if (!t) return;
  const n = t.messageId ? vf(t.messageId) : null;
  if (n) {
    mr(n, t), Be(n), _t(n, t), cr(n), Et(n), St(n);
    return;
  }
  if (t.messageId) {
    Nt(t);
    return;
  }
  const r = Of(t);
  if (r) {
    mr(r, t), Be(r), _t(r, t), cr(r), Et(r), St(r);
    return;
  }
  Nt(t);
}
function cr(e) {
  $t && xo(e, $t);
}
function Be(e) {
  const t = Hm();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Fo(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(nr) === "true") return;
  const r = n.querySelector(`.${wt}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(nr, "true");
}
function Hm() {
  try {
    return ei() === "replace";
  } catch {
    return !1;
  }
}
function _t(e, t) {
  if (Be(e), e.querySelector(`[${Ke}="${le(t.pendingId)}"]`)) return;
  const n = Vm(e, t);
  Gm(n, t), sf(n, cf(t)).append(df(t));
}
function Vm(e, t) {
  const n = e.querySelector(`.${wt}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(wt, h);
  const o = document.createElement("header");
  o.classList.add(`${h}__header`);
  const a = document.createElement("span");
  a.classList.add(`${h}__kicker`), a.textContent = "Paranormal Toolkit";
  const i = document.createElement("strong");
  i.classList.add(Nm), i.textContent = zm(t);
  const s = document.createElement("span");
  return s.classList.add(Po), s.textContent = t.summary, o.append(a, i, s), r.append(o), pf(e).append(r), r;
}
function zm(e) {
  const t = _(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function Gm(e, t) {
  const n = t.summaryLines ?? [], r = qo(n, t);
  if (r) {
    Wm(e, r, t);
    return;
  }
  lf(e, n);
}
function Wm(e, t, n) {
  if (e.querySelector(`[${tr}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(or, `${or}--${t.intent}`), r.setAttribute(tr, "true"), t.castingCheck && lr(r, Ym(t.castingCheck), n.pendingId, "casting"), Km(t) && lr(r, Qm(t), n.pendingId, "effect"), tf(r, t), nf(r, t, n), af(r, t), e.append(r);
}
function Km(e) {
  return e.intent !== "casting";
}
function Ym(e) {
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
function Qm(e) {
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
function lr(e, t, n, r) {
  const o = document.createElement("section");
  o.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && o.classList.add(`${h}__workflow-section--${t.status}`);
  const a = document.createElement("div");
  a.classList.add(`${h}__workflow-section-header`);
  const i = document.createElement("strong");
  if (i.textContent = t.title, a.append(i), t.statusLabel) {
    const s = document.createElement("span");
    s.classList.add(`${h}__workflow-section-status`), s.textContent = t.statusLabel, a.append(s);
  }
  if (o.append(a), t.description) {
    const s = document.createElement("span");
    s.classList.add(`${h}__workflow-section-description`), s.textContent = t.description, o.append(s);
  }
  Zm(o, t), of(o, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(o);
}
function Zm(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const o = document.createElement("strong");
  o.classList.add(`${h}__workflow-roll-total`), o.textContent = String(t.total), n.append(r, o);
  const a = Xm(t.formula, t.diceBreakdown);
  a && n.append(a), e.append(n);
}
function Xm(e, t) {
  const n = Jm(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const o of ef(n, e)) {
    const a = document.createElement("span");
    a.classList.add(`${h}__workflow-die`), o.active || a.classList.add(`${h}__workflow-die--inactive`), a.textContent = String(o.value), r.append(a);
  }
  return r;
}
function Jm(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function ef(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ur(e, "highest") : n.includes("kl") ? ur(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ur(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((o) => {
    const a = !r && o === n;
    return a && (r = !0), { value: o, active: a };
  });
}
function tf(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(rp);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const o of n) {
    const a = document.createElement("span");
    a.classList.add(`${h}__roll-meta-pill`), a.textContent = o, r.append(a);
  }
  e.append(r);
}
function nf(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const o = document.createElement("div");
  o.classList.add(`${h}__resistance-header`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const i = rf(t, n);
  o.append(a), i && o.append(i);
  const s = document.createElement("span");
  s.classList.add(`${h}__resistance-description`), s.textContent = t.resistance, r.append(o, s), t.resistanceRollResult && r.append(Mo(t.resistanceRollResult)), e.append(r);
}
function rf(e, t) {
  if (!e.resistanceSkill) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Ke, t.pendingId), n.setAttribute(wo, "true"), n.setAttribute($o, e.resistanceSkill), n.setAttribute(_o, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Eo, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(So, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Do, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  return o.classList.add(`${h}__resistance-roll-fallback`), o.textContent = "d20", n.append(r, o), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Mo(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = Bo(e), t;
}
function of(e, t, n, r, o) {
  const a = t.filter((m) => m.value.trim().length > 0);
  if (a.length === 0) return;
  const i = `${n}-roll-details-${r}`, s = document.createElement("button");
  s.type = "button", s.classList.add(`${h}__roll-detail-toggle`), s.setAttribute(Qt, i), s.setAttribute("aria-expanded", "false"), s.textContent = o;
  const d = document.createElement("dl");
  d.classList.add(`${h}__roll-detail-list`), d.setAttribute(Io, i), d.hidden = !0;
  for (const m of a) {
    const f = document.createElement("dt");
    f.textContent = m.label;
    const b = document.createElement("dd");
    b.textContent = m.value, d.append(f, b);
  }
  e.append(s, d);
}
function af(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const o = document.createElement("span");
    o.textContent = r, n.append(o);
  }
  e.append(n);
}
function sf(e, t) {
  const n = `[${Jn}="${le(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const o = document.createElement("div");
  o.classList.add(Pm), o.setAttribute(Jn, t.id);
  const a = document.createElement("strong");
  return a.classList.add(`${h}__actions-title`), a.textContent = t.title, o.append(a), e.append(o), o;
}
function cf(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = qo(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function lf(e, t) {
  if (t.length === 0) return;
  const n = uf(e);
  for (const r of t) {
    const o = op(r);
    if (n.querySelector(`[${er}="${le(o)}"]`)) continue;
    const a = document.createElement("li");
    a.textContent = r, a.setAttribute(er, o), n.append(a);
  }
}
function uf(e) {
  const t = e.querySelector(`.${rr}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(rr), e.append(n), n;
}
function df(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(Ke, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(No), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Ye, e.pendingId), t.setAttribute(Yt, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(It, e.choiceGroupId), t.setAttribute(Co, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function mf(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = ff(e);
  return `${t} → ${n}`;
}
function ff(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function pf(e) {
  return Fo(e) ?? e;
}
function Fo(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function xo(e, t) {
  const n = Ze(e);
  if (!n) return;
  const r = n.querySelectorAll(Em);
  for (const o of r)
    o.dataset.paranormalToolkitBound !== "true" && (o.dataset.paranormalToolkitBound = "true", o.addEventListener("click", () => {
      Ef(o, t);
    }));
}
function Et(e) {
  const t = Ze(e);
  if (!t) return;
  const n = t.querySelectorAll(Sm);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      gf(t, r);
    }));
}
function St(e) {
  const t = Ze(e);
  if (!t) return;
  const n = t.querySelectorAll(Dm);
  for (const r of n)
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      hf(t, r);
    }));
}
function gf(e, t) {
  const n = t.getAttribute(Qt);
  if (!n) return;
  const r = e.querySelector(`[${Io}="${le(n)}"]`);
  if (!r) return;
  const o = r.hidden;
  r.hidden = !o, t.setAttribute("aria-expanded", o ? "true" : "false"), t.textContent = o ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function hf(e, t) {
  const n = t.getAttribute(Ke), r = t.getAttribute($o), o = t.getAttribute(_o) ?? (r ? To(r) : "Resistência");
  if (!n || !r) return;
  const a = bf(e, n), i = Tf(a, t);
  if (!i) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const s = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await Rm(i, r);
    await wf(d.roll);
    const m = {
      skill: r,
      skillLabel: o,
      formula: d.formula,
      total: d.total,
      targetName: i.name ?? a?.resistanceTargetName ?? "alvo",
      diceBreakdown: d.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    yf(t, m), Af(t, m), $f(n, m), await _f(e, n, m);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", d), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${o}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1;
  }
}
function yf(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Do, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function Af(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), o = r ?? Mo(t);
  if (r) {
    r.textContent = Bo(t);
    return;
  }
  n.append(o);
}
function bf(e, t) {
  const n = P.get(t);
  if (n) return n;
  const r = Qe(e);
  return U(r)[t] ?? null;
}
function Tf(e, t) {
  const n = e?.resistanceTargetActor;
  if (M(n)) return n;
  const o = e?.context?.targets.map(Dt).find(M) ?? null;
  if (o) return o;
  const a = t.getAttribute(Eo) ?? e?.resistanceTargetActorId ?? null, i = a ? kf(a) : null;
  return i || Cf(
    t.getAttribute(So) ?? e?.resistanceTargetName ?? Rf(t)
  );
}
function Rf(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Po}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const o = n.split(r), a = o[o.length - 1]?.trim();
  return a && a.length > 0 ? a : null;
}
function Dt(e) {
  const t = e.actor;
  if (M(t)) return t;
  const n = e.token, r = Te(n);
  if (r) return r;
  const o = e.document;
  return Te(o);
}
function Te(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (M(t)) return t;
  const n = e.document?.actor;
  return M(n) ? n : null;
}
function kf(e) {
  const n = game.actors?.get?.(e);
  return M(n) ? n : Uo().map((a) => Te(a)).find((a) => a?.id === e) ?? null;
}
function Cf(e) {
  const t = oe(e);
  if (!t) return null;
  const n = Uo().filter((a) => oe(If(a)) === t).map((a) => Te(a)).find(M) ?? null;
  if (n) return n;
  const o = game.actors?.find?.((a) => M(a) && oe(a.name) === t);
  return M(o) ? o : null;
}
function Uo() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function If(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Te(e)?.name ?? null;
}
function oe(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function M(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Bo(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function wf(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function $f(e, t) {
  const n = P.get(e);
  n && (n.resistanceRollResult = t);
}
async function _f(e, t, n) {
  const r = Qe(e);
  if (r)
    try {
      const o = U(r), a = o[t];
      if (!a) return;
      o[t] = {
        ...a,
        resistanceRollResult: n
      }, await ce(r, o);
    } catch (o) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", o);
    }
}
function Qe(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return x(r?.get?.(n));
}
async function Ef(e, t) {
  const n = e.getAttribute(Ye);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    jo(e, e.getAttribute(Yt) ?? "✓ Automação aplicada"), Sf(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function jo(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(No), e.removeAttribute(Ye), e.removeAttribute(Yt);
}
function Sf(e) {
  const t = e.getAttribute(It);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${It}="${le(t)}"]`;
  for (const o of n.querySelectorAll(r)) {
    if (o === e) continue;
    const a = o.getAttribute(Co) ?? "✓ Outra opção escolhida";
    jo(o, a);
  }
}
function qo(e, t) {
  const n = e.map(Xt).filter(tp), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const o = _(e, "Forma"), a = _(e, "Custo"), i = _(e, "Dados") ?? _(e, `Dados (${r.label})`), s = _(e, "Tipo"), d = _(e, "Resistência"), m = _(e, "Resistência Perícia"), f = _(e, "Resistência Rótulo") ?? (m ? To(m) : null), b = Ho(e, "Observação"), R = e.filter((g) => Nf(g, r)), k = Df(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: o,
    cost: a,
    diceBreakdown: i,
    damageType: s,
    resistance: d,
    resistanceSkill: m,
    resistanceSkillLabel: f,
    notes: b,
    details: R,
    castingCheck: k,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function Df(e) {
  const t = e.map(Xt).find((a) => a?.intent === "casting") ?? null, n = _(e, "Conjuração DT"), r = _(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const o = Number(n);
  return Number.isFinite(o) ? {
    label: t.formula,
    formula: _(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(o),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: _(e, "Dados (Conjuração)")
  } : null;
}
function Xt(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, o] = t, a = Number(o);
  return Number.isFinite(a) ? {
    label: n,
    formula: r,
    total: a,
    intent: Pf(n)
  } : null;
}
function Pf(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function _(e, t) {
  return Ho(e, t)[0] ?? null;
}
function Ho(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const o = r.slice(n.length).trim();
    return o.length > 0 ? [o] : [];
  });
}
function Nf(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Xt(e) ? !1 : e.trim().length > 0;
}
function Lf(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of P.values())
    Pt(r, e, t) && n.set(r.pendingId, r);
  for (const r of xf(e))
    Pt(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, o) => r.createdAt - o.createdAt);
}
function Pt(e, t, n) {
  const r = V(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !dr(n, "itemId", e.itemId) ? !1 : !e.actorId || dr(n, "actorId", e.actorId);
}
function dr(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${ap(t)}`;
  for (const o of e.querySelectorAll(`[${r}]`))
    if (o.getAttribute(r) === n)
      return !0;
  return !1;
}
function vf(e) {
  const t = le(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function Of(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (Pt(e, null, t))
      return t;
  return null;
}
function Mf() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of P.entries())
    e - r.createdAt > t && P.delete(n);
}
async function mr(e, t) {
  const n = Qe(e);
  if (!n) return !1;
  try {
    const r = U(n);
    return r[t.pendingId] = tn(t, V(n)), await ce(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Jt(e) {
  const t = Wo(e);
  if (!t) return !1;
  try {
    const n = U(t);
    return n[e.pendingId] = tn(e, V(t)), await ce(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function Vo(e) {
  for (const t of Lm)
    globalThis.setTimeout(() => {
      Nt(e);
    }, t);
}
async function Nt(e) {
  const t = Wo(e);
  if (en(t)?.prompts.some((o) => o.pendingId === e.pendingId))
    return !0;
  const r = await Jt(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function Ff(e, t) {
  const n = Go(e.context.message);
  if (n)
    try {
      const r = U(n), o = r[e.pendingId] ?? tn(e, V(n));
      r[e.pendingId] = {
        ...o,
        executedLabel: t ?? o.executedLabel,
        executed: !0
      }, await ce(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function xf(e) {
  return Object.values(U(x(e))).filter(Ie);
}
function U(e) {
  if (!e) return {};
  const t = {}, n = en(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, o] of Object.entries(zo(e)))
    t[r] ??= o;
  return t;
}
function Uf(e) {
  return Object.values(zo(x(e))).filter(Ie);
}
function zo(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, Ro);
  if (!ae(t))
    return {};
  const n = {};
  for (const [r, o] of Object.entries(t))
    Ie(o) && (n[r] = o);
  return n;
}
async function ce(e, t) {
  typeof e.setFlag == "function" && (await jf(e, t), await Bf(e, t));
}
async function Bf(e, t) {
  await Promise.resolve(e.setFlag?.(u, Ro, t));
}
function en(e) {
  if (!e) return null;
  const t = e.getFlag?.(u, ko);
  return Jf(t) ? t : null;
}
async function jf(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(Ie).sort((a, i) => a.createdAt - i.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const o = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((a) => a.createdAt)),
    messageId: r.messageId ?? V(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: qf(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(u, ko, o));
}
function qf(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function tn(e, t) {
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
function Go(e) {
  const t = x(e);
  if (t?.setFlag)
    return t;
  const n = Hf(e);
  if (n?.setFlag)
    return n;
  const r = V(e);
  if (!r) return null;
  const o = game.messages;
  return x(o?.get?.(r));
}
function Hf(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(x).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Wo(e) {
  const t = Go(e.context.message);
  if (t) return t;
  const n = e.messageId ? Vf(e.messageId) : null;
  if (n) return n;
  const r = Qo().slice().reverse();
  return r.find((o) => zf(o, e)) ?? r.find((o) => Gf(o, e)) ?? null;
}
function Vf(e) {
  const t = game.messages;
  return x(t?.get?.(e));
}
function zf(e, t) {
  const n = V(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Ko(e, t)) return !1;
  const o = Yo(e);
  return !t.actorId || !o || o === t.actorId;
}
function Gf(e, t) {
  if (!Kf(e, t)) return !1;
  const n = Yo(e);
  return t.actorId && n === t.actorId ? !0 : Ko(e, t);
}
function Ko(e, t) {
  const n = oe(Wf(e));
  if (!n) return !1;
  const r = oe(t.itemName);
  if (r && n.includes(r)) return !0;
  const o = oe(t.itemId);
  return !!(o && n.includes(o));
}
function Wf(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Yo(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function Kf(e, t) {
  const n = Yf(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= vm;
}
function Yf(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function x(e) {
  return e && typeof e == "object" ? e : null;
}
function Ie(e) {
  return ae(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && E(e.messageId) && E(e.itemId) && E(e.actorId) && E(e.itemName) && Y(e.resistanceTargetActorId) && Y(e.resistanceTargetName) && ep(e.resistanceRollResult) && Qf(e.actionPayload) && lt(e.title) && lt(e.buttonLabel) && lt(e.executedLabel) && Y(e.choiceGroupId) && Y(e.skippedLabel) && Y(e.actionSectionId) && Y(e.actionSectionTitle) && np(e.summaryLines) : !1;
}
function Qf(e) {
  return e == null ? !0 : ae(e) ? e.kind === "resource-operation" && E(e.actorId) && E(e.actorUuid) && typeof e.actorName == "string" && Zf(e.resource) && Xf(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function Zf(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Xf(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function Jf(e) {
  return ae(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && E(e.messageId) && ae(e.source) && E(e.source.actorId) && E(e.source.actorName) && E(e.source.itemId) && E(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(Ie) : !1;
}
function ep(e) {
  return e == null ? !0 : ae(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && Y(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function tp(e) {
  return e !== null;
}
function ae(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function E(e) {
  return e === null || typeof e == "string";
}
function lt(e) {
  return e === void 0 || typeof e == "string";
}
function Y(e) {
  return e == null || typeof e == "string";
}
function np(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function rp(e) {
  return typeof e == "string" && e.length > 0;
}
function Qo() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(x).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(x).filter((r) => r !== null) : [];
}
function Ze(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function V(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function op(e) {
  return e.trim().toLowerCase();
}
function ap(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function le(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const fr = 1e3;
class ip {
  constructor(t, n, r, o, a, i) {
    this.workflow = t, this.resources = n, this.damage = o, this.conditions = a, this.debugOutput = i, this.ritualAssistant = new Id(
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
      settings: dn(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = dn();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = vt(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && pp(t.item) && n.executionMode === "ask") {
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
    if (await Gn(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: mt(t, "failed", "missing-actor")
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
      return this.pendingExecutions.delete(t), await ct(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await ct(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Zt(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, o = yp(r);
    if (!o)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const a = await Fe(
      this.resources,
      o,
      r.resource,
      r.operation,
      r.amount
    );
    return a.ok ? (await xm(t), await Um(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(a), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (Mm(
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
    if (await Gn(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: mt(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      gp(t.item)
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
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), l.info(
          "Ritual assistido concluído sem ações pendentes.",
          X(r.workflowContext)
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
      return o.ok ? (fp(n, o.value), await sp(o.value), {
        ok: !0,
        executedLabel: cp(o.value)
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
    const n = ut(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, o]) => o.kind === "assisted-action" && ut(o.action) === n);
    for (const [o, a] of r)
      a.kind === "assisted-action" && a.id !== t.id && (this.pendingExecutions.delete(o), await ct(
        o,
        gr(a.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = ft();
    await Fm({
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
    for (const i of r) {
      const s = ft();
      a ??= s, this.pendingExecutions.set(s, {
        kind: "assisted-action",
        id: s,
        action: i,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await ir({
        pendingId: s,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: i.label,
        executedLabel: i.executedLabel,
        choiceGroupId: ut(i),
        skippedLabel: gr(i),
        actionSectionId: i.actionSectionId,
        actionSectionTitle: i.actionSectionTitle,
        summaryLines: o,
        resistanceTargetActor: i.actor,
        resistanceTargetActorId: i.actor.id ?? null,
        resistanceTargetName: i.actorName,
        actionPayload: hp(i)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      a
    ), l.info(
      "Ritual assistido preparado com ações pendentes.",
      X(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = ft();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await ir({
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
    this.setAttempt(t, "completed"), l.info(
      "Automação executada por uso normal de item.",
      X(o.value.context)
    );
  }
  handleAutomationFailure(t) {
    const n = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      l.warn(n, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      l.error(n, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    l.warn(n, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    l.warn(
      `Ação assistida falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  handleDamageActionFailure(t) {
    l.warn(`Ação assistida de dano falhou: ${t.message}`, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleConditionActionFailure(t) {
    l.warn(
      `Ação assistida de condição falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const n = Date.now(), r = hr(t);
    for (const [a, i] of this.recentExecutionKeys.entries())
      n - i > fr && this.recentExecutionKeys.delete(a);
    const o = this.recentExecutionKeys.get(r);
    return o !== void 0 && n - o <= fr;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(hr(t), Date.now());
  }
  setAttempt(t, n, r, o) {
    this.lastAttempt = mt(
      t,
      n,
      r,
      o
    );
  }
}
async function sp(e) {
  const t = mp();
  if (t.length !== 0)
    try {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: e.actor }),
        whisper: t,
        content: lp(e)
      });
    } catch (n) {
      l.warn("Não foi possível criar o resumo de dano para o GM.", n);
    }
}
function cp(e) {
  const t = e.totalBlocked > 0 ? ` (RD ${e.totalBlocked})` : "";
  return `✓ ${e.totalFinalDamage} PV aplicado${t}`;
}
function lp(e) {
  const t = e.instances.map((i) => {
    const s = i.blocked > 0 ? ` <span class="muted">(RD ${i.blocked})</span>` : "";
    return `<li><strong>${Oe(i.label ?? "Dano")}</strong>: ${i.inputAmount} → ${i.finalDamage} PV${s}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", o = up(e), a = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Oe(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${Oe(e.actorName)}</strong></p>
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
function up(e) {
  const t = dp(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const o = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Oe(o)}</li>`;
}
function dp(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = pr(n?.value);
  return r === null ? null : {
    value: r,
    max: pr(n?.max)
  };
}
function pr(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function mp() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function Oe(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
function ut(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function gr(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function fp(e, t) {
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
function pp(e) {
  return e.type === "ritual";
}
function gp(e) {
  return {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function hp(e) {
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
function yp(e) {
  const t = e.actorUuid ? Ap(e.actorUuid) : null;
  if (ie(t)) return t;
  const n = e.actorId ? bp(e.actorId) : null;
  return n || Tp(e.actorName);
}
function Ap(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function bp(e) {
  const n = game.actors?.get?.(e);
  if (ie(n)) return n;
  for (const r of Zo()) {
    const o = nn(r);
    if (o?.id === e) return o;
  }
  return null;
}
function Tp(e) {
  const t = dt(e);
  if (!t) return null;
  for (const o of Zo()) {
    const a = Rp(o);
    if (dt(a) === t) {
      const i = nn(o);
      if (i) return i;
    }
  }
  const r = game.actors?.find?.(
    (o) => ie(o) && dt(o.name) === t
  );
  return ie(r) ? r : null;
}
function Zo() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Rp(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : nn(e)?.name ?? null;
}
function nn(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ie(t)) return t;
  const n = e.document?.actor;
  return ie(n) ? n : null;
}
function dt(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function ie(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function mt(e, t, n, r) {
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
function hr(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function ft() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class kp {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], o = [], a = ke(t);
    for (const i of n) {
      const s = i.itemId ? a.find((f) => f.id === i.itemId) ?? null : null, d = i.match?.preset ?? null;
      if (!s || !d) {
        o.push(i);
        continue;
      }
      await this.automationBinder.applyPreset(s, d);
      const m = await this.itemPatches.applyPresetItemPatch(s, d);
      r.push({
        itemId: s.id ?? null,
        itemName: s.name ?? "Ritual sem nome",
        presetId: d.id,
        presetLabel: d.label,
        previousStatus: i.status,
        itemPatch: m
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
class Cp {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = ke(t).map((s) => this.analyzeRitual(s)), r = n.filter(Pe("upToDate")), o = n.filter(Pe("available")), a = n.filter(Pe("outdated")), i = n.filter(Pe("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: o,
      outdated: a,
      unsupported: i,
      canApply: o.length > 0 || a.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = Ip(t);
    return n ? r ? r.source.type !== "preset" ? fe({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? fe({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : fe({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: wp(r, n.preset)
    }) : fe({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : fe({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function fe(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? He(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function Ip(e) {
  const t = e.getFlag(u, "automation");
  return Ot(t) ? t : null;
}
function wp(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function Pe(e) {
  return (t) => t.status === e;
}
class $p {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = Ft(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), o = X(t);
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
    const n = T(t.actorName), r = T(t.resource), o = T(yr(t)), a = T(Ep(t));
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
    const r = T(n.title ?? "Automação"), o = n.message ? `<p>${T(n.message)}</p>` : "", a = T(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), i = T(t.item.name ?? "Item sem nome"), s = t.targets.length > 0 ? t.targets.map((g) => T(g.name)).join(", ") : "Nenhum", d = Object.values(t.rolls).map(
      (g) => `<li><strong>${T(g.id)}:</strong> ${T(g.formula)} = ${g.total} <em>(${T(_p(g.intent))})</em>${g.damageType ? ` — ${T(g.damageType)}` : ""}</li>`
    ), m = t.ritualCosts.map(
      (g) => `<li><strong>${T(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${T(g.resource)} (${T(Sp(g.source))})</li>`
    ), f = t.damageInstances.map(
      (g) => `<li><strong>${T(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${T(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), b = t.healingInstances.map(
      (g) => `<li><strong>${T(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), R = t.resourceTransactions.map(
      (g) => `<li><strong>${T(g.actorName)}:</strong> ${T(yr(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), k = t.phases.map((g) => T(g)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${r}</strong>
          <span>${i}</span>
        </header>
        <div class="${u}-card__body">
          ${o}
          <p><strong>Origem:</strong> ${a}</p>
          <p><strong>Alvo:</strong> ${s}</p>
          ${m.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${m.join("")}</ul>` : ""}
          ${d.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Dano:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p><strong>Cura:</strong></p><ul>${b.join("")}</ul>` : ""}
          ${R.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${R.join("")}</ul>` : ""}
          ${k.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${k}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function _p(e) {
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
function yr(e) {
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
function Ep(e) {
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
function Sp(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function T(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function Dp() {
  const e = new lc(), t = new rl(e), n = new oc(), r = new mc(), o = new gc(r), a = new Sc(e), i = new Pc(), s = i.registerMany(
    La()
  );
  if (!s.ok)
    throw new Error(s.error.message);
  const d = new Dc(), m = new _c(), f = Pu(), b = new kl(f), R = new Cp(
    i
  ), k = new kp(
    R,
    d,
    m
  ), g = new sl(), N = new $p(g), ue = new il(), de = new tl(
    t,
    o,
    N,
    ue
  ), me = new al(de, ue), I = new ip(
    me,
    t,
    o,
    n,
    b,
    g
  );
  return I.addStrategy(
    new wc(
      (B) => I.handleItemUsed(B)
    )
  ), {
    ordem: a,
    resourceAdapter: e,
    ritualAdapter: r,
    ritualCosts: o,
    resources: t,
    damage: n,
    automationRegistry: i,
    automationBinder: d,
    itemPatches: m,
    conditionRegistry: f,
    conditions: b,
    debugOutput: g,
    chatMessages: N,
    workflowHooks: ue,
    automation: de,
    workflow: me,
    itemUseIntegration: I,
    ritualPresetDiagnostic: R,
    ritualPresetApplications: k
  };
}
const { ApplicationV2: Pp } = foundry.applications.api;
class je extends Pp {
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
      apply: je.onApply,
      cancel: je.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${L(Lt)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${L(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${pt("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${pt("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${pt("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function pt(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${L(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Np(n) : vp(t)}
    </section>
  `;
}
function Np(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Lp).join("")}</ol>`;
}
function Lp(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${L(e.appliedPresetId)} v${L(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${L(e.itemName)}</strong>
        <span>${L(e.reason)}</span>
        ${r}
      </div>
      <em>${L(n)}</em>
    </li>
  `;
}
function vp(e) {
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
const qe = `${u}.manageRitualPresets`, Ar = `__${u}_ritualPresetHeaderControlRegistered`, Op = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Mp(e) {
  const t = globalThis;
  if (!t[Ar]) {
    for (const n of Op)
      Hooks.on(n, (r, o) => {
        Fp(r, o, e);
      });
    t[Ar] = !0, l.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function Fp(e, t, n) {
  Array.isArray(t) && Up(e) && (xp(e, n), !t.some((r) => r.action === qe) && t.push({
    action: qe,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Xo(e, n);
    }
  }));
}
function xp(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[qe] && (e.options.actions[qe] = (n) => {
    n.preventDefault(), n.stopPropagation(), Xo(e, t);
  }));
}
function Up(e) {
  if (!game.user?.isGM) return !1;
  const t = Jo(e);
  return t ? t.type === "agent" && ke(t).length > 0 : !1;
}
function Xo(e, t) {
  const n = Jo(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new je(n, t).render({ force: !0 });
}
function Jo(e) {
  return br(e.actor) ? e.actor : br(e.document) ? e.document : null;
}
function br(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
let Z = null;
Hooks.once("init", () => {
  Da(), Ja(), Li(), Xs(), l.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!pn.isSupportedSystem()) {
    l.warn(
      `Sistema não suportado: ${pn.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  Z = Dp(), Z.itemUseIntegration.registerStrategies(), Si(Z.conditions), mi(Z), Ci(), bi(), Mp(Z), l.info("Inicializado para o sistema Ordem Paranormal."), l.info(`API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`), ui.notifications?.info(`${Lt} inicializado.`);
});
function Bp() {
  if (!Z)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return Z;
}
export {
  Bp as getToolkitServices
};
//# sourceMappingURL=main.js.map
