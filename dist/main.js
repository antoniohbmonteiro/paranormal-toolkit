const u = "paranormal-toolkit", or = "Paranormal Toolkit", ql = "ordemparanormal";
class Ye {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Lt(e) {
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
class f {
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
function Qe(e) {
  const t = e.getFlag(u, "automation");
  return t == null ? p({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : ir(t) ? y(t.definition) : p({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function Gl(e) {
  return ir(e.getFlag(u, "automation"));
}
function ir(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && jl(t.source) && zl(t.definition);
}
function zl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && $(t.label) && Array.isArray(t.steps) && t.steps.every(Vl) && (t.conditionApplications === void 0 || Zl(t.conditionApplications));
}
function jl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? $(t.presetId) && $(t.presetVersion) && $(t.appliedAt) : t.type === "manual" ? $(t.label) && $(t.appliedAt) : !1;
}
function Vl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return Hl(t);
    case "spendRitualCost":
      return Wl(t);
    case "rollFormula":
      return Kl(t);
    case "modifyResource":
      return Yl(t);
    case "chatCard":
      return Ql(t);
    default:
      return !1;
  }
}
function Hl(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ho(t);
}
function Wl(e) {
  return e.type === "spendRitualCost";
}
function Kl(e) {
  const t = e;
  return t.type === "rollFormula" && $(t.id) && $(t.formula) && (t.intent === void 0 || ac(t.intent)) && (t.damageType === void 0 || $(t.damageType));
}
function Yl(e) {
  const t = e;
  return t.type === "modifyResource" && Wo(t.actor) && nc(t.resource) && rc(t.operation) && Ho(t) && (t.damageType === void 0 || t.damageType === null || $(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function Ql(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function Zl(e) {
  return Array.isArray(e) && e.every(Xl);
}
function Xl(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return $(t.id) && Wo(t.actor) && $(t.conditionId) && (t.label === void 0 || $(t.label)) && (t.duration === void 0 || t.duration === null || ec(t.duration)) && (t.source === void 0 || $(t.source)) && (t.actionSectionId === void 0 || $(t.actionSectionId)) && (t.actionSectionTitle === void 0 || $(t.actionSectionTitle)) && (t.executedLabel === void 0 || $(t.executedLabel)) && (t.applyOnResistance === void 0 || Jl(t.applyOnResistance));
}
function Jl(e) {
  return e === "failure" || e === "success" || e === "always";
}
function ec(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || oc(t.rounds)) && (t.expiry === void 0 || t.expiry === null || tc(t.expiry));
}
function tc(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Ho(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || $(e.amountFrom);
}
function Wo(e) {
  return e === "self" || e === "target";
}
function nc(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function rc(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function ac(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function oc(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function $(e) {
  return typeof e == "string" && e.length > 0;
}
function sr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(ta);
    if (lc(t))
      return Array.from(t).filter(ta);
  }
  return [];
}
function ic(e) {
  return sr(e)[0] ?? null;
}
function sc(e) {
  return sr(e).find(Gl) ?? null;
}
function lc(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function ta(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Ze(e) {
  return sr(e).filter((t) => t.type === "ritual");
}
function Ko(e) {
  return Ze(e)[0] ?? null;
}
function cc(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Lt);
      return f.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = Fe("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = at(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(aa);
      return f.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = Fe("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = at(n);
      if (!r) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await An(e, r, a.value);
      f.info(`Preset ${a.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = Fe("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = at(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        f.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await An(e, n, r.preset);
      f.info(`Melhor preset aplicado em ${n.name}.`, { match: aa(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return na(e);
    },
    async applyBestPresetsToActorRituals() {
      return na(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = Fe("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = at(t);
      n && (await e.automationBinder.clear(n), f.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function na(e) {
  const t = Fe("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = Ze(t);
  if (n.length === 0)
    return f.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), ra(t);
  const r = ra(t, n.length);
  for (const a of n) {
    const o = e.automationRegistry.findForItem(a)[0];
    if (!o) {
      r.skipped.push({
        itemId: a.id ?? null,
        itemName: a.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }
    const s = await An(e, a, o.preset);
    r.applied.push(uc(a, o, s));
  }
  return f.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), dc(r), r;
}
async function An(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function uc(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Lt(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function ra(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function dc(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function aa(e) {
  return {
    preset: Lt(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function Fe(e) {
  const t = Ye.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function at(e) {
  const t = Ko(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function re(e) {
  return e ? {
    id: e.id,
    source: {
      ...mc(e.sourceActor),
      token: e.sourceToken
    },
    item: fc(e.item),
    targets: e.targets.map(pc),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: oa(e.rollRequests, Yo),
    rolls: oa(e.rolls, gc),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(lr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function lr(e) {
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
function mc(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function fc(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function pc(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Yo(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function gc(e) {
  return {
    ...Yo(e),
    total: e.total
  };
}
function oa(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function hc(e) {
  return {
    getSelected() {
      return Ye.getSelectedActor();
    },
    logResources() {
      const t = Q(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      f.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && f.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await de(
        e,
        "Gasto de PE",
        Q("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await de(
        e,
        "Gasto de PD",
        Q("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await de(
        e,
        "Dano em PV",
        Q("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await de(
        e,
        "Cura de PV",
        Q("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await de(
        e,
        "Dano em SAN",
        Q("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await de(
        e,
        "Recuperação de SAN",
        Q("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function de(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    bc(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    f.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  f.info(`${t} realizado:`, lr(o));
}
function Q(e) {
  const t = Ye.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function bc(e) {
  if (e.reason === "update-failed") {
    f.error(e.message, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "resource-path-not-found" || e.reason === "invalid-resource-value") {
    f.error("Falha de adapter ao ler recurso.", e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  f.warn(`Operação de recurso não realizada: ${e.message}`, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
const B = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function yc() {
  ot(B.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), ot(B.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), ot(B.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), ot(B.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Tn() {
  return {
    enabled: it(B.enabled),
    console: it(B.console),
    ui: it(B.ui),
    chat: it(B.chat)
  };
}
async function V(e, t) {
  await game.settings.set(u, B[e], t);
}
function ot(e, t) {
  game.settings.register(u, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function it(e) {
  return game.settings.get(u, e) === !0;
}
function _c() {
  return {
    status() {
      return Tn();
    },
    async enable() {
      await V("enabled", !0);
    },
    async disable() {
      await V("enabled", !1);
    },
    async enableConsole() {
      await V("console", !0);
    },
    async disableConsole() {
      await V("console", !1);
    },
    async enableUi() {
      await V("ui", !0);
    },
    async disableUi() {
      await V("ui", !1);
    },
    async enableChat() {
      await V("chat", !0);
    },
    async disableChat() {
      await V("chat", !1);
    }
  };
}
const Qo = "ritual.costOnly", Zo = "ritual.simpleHealing", Ac = "ritual.eletrocussao", Tc = "ritual.definhar", Xo = "ritual.simpleDamage", Jo = "generic.simpleHealing", cr = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function Rc() {
  return [
    $c(),
    kc(),
    wc(),
    Ec(),
    Ic(),
    Cc()
  ];
}
function $c() {
  return {
    id: Qo,
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
function kc() {
  return {
    id: Zo,
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
    automation: ei(),
    itemPatch: Dc()
  };
}
function wc() {
  return {
    id: Ac,
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
    automation: Sc(),
    itemPatch: Pc()
  };
}
function Ec() {
  return {
    id: Tc,
    version: "1.0.0",
    label: "Definhar",
    description: "Preset assistido da forma Padrão: gasta o custo do ritual, rola Fortitude e aplica Fatigado na falha ou Vulnerável no sucesso.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["definhar"]
      }
    ],
    automation: Lc(),
    itemPatch: vc()
  };
}
function Ic() {
  return {
    id: Xo,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: ur()
  };
}
function Cc() {
  return {
    id: Jo,
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
function ei(e = "2d8+2") {
  return ti(
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
function Sc() {
  return {
    ...ur("3d6", {
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
function Lc() {
  return {
    version: 1,
    label: "Definhar",
    ritualForms: {
      base: {
        label: "Padrão"
      }
    },
    resistance: {
      skill: "resilience",
      label: "Fortitude",
      effect: "reducesByHalf",
      summary: "Fortitude parcial: falha aplica Fatigado; sucesso aplica Vulnerável."
    },
    conditionApplications: [
      {
        id: "definhar-fatigued",
        actor: "target",
        conditionId: "fatigued",
        label: "Fatigado",
        source: "ritual.definhar",
        actionSectionId: "apply-effects",
        actionSectionTitle: "Aplicar efeito",
        executedLabel: "✓ Fatigado aplicado",
        applyOnResistance: "failure"
      },
      {
        id: "definhar-vulnerable",
        actor: "target",
        conditionId: "vulnerable",
        label: "Vulnerável",
        source: "ritual.definhar",
        actionSectionId: "apply-effects",
        actionSectionTitle: "Aplicar efeito",
        executedLabel: "✓ Vulnerável aplicado",
        applyOnResistance: "success"
      }
    ],
    steps: [
      {
        type: "spendRitualCost"
      },
      {
        type: "chatCard",
        title: "Definhar",
        message: "Gasta o custo do ritual e prepara aplicação assistida de condição conforme a resistência do alvo."
      }
    ]
  };
}
function ur(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return ti(
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
          damageType: a
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
          message: o
        }
      ]
    },
    "damage",
    e
  );
}
function Dc() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: cr,
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
function vc() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: cr,
    ritual: {
      circle: 1,
      element: "death",
      execution: "default",
      range: "medium",
      target: "creatures",
      targetQuantity: "1",
      duration: "instantaneous",
      resistanceSkill: "resilience",
      resistance: "reducesByHalf",
      studentForm: !1,
      trueForm: !1
    }
  };
}
function Pc() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: cr,
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
function ti(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function dr() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: pe(t.id),
    actorId: pe(t.actor?.id),
    sceneId: pe(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome",
    actor: t.actor ?? null
  }));
}
function ni() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: pe(e.id),
    actorId: pe(t?.id),
    sceneId: pe(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function pe(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Nc(e) {
  return {
    logFirstRitualCost() {
      const t = Z("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = X(t);
      if (!n) return;
      const r = e.ritualCosts.getCost({ actor: t, ritual: n });
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      f.info("Custo do primeiro ritual:", {
        actor: t.name,
        ritual: n.name,
        cost: r.value
      }), ui.notifications?.info(
        `Paranormal Toolkit: ${n.name} custa ${r.value.amount} ${r.value.resource} (${r.value.circle}º círculo).`
      );
    },
    async setCustomCostOnFirstRitual(t, n = "PE") {
      const r = Z("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const a = X(r);
      if (a) {
        if (!Mc(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await a.setFlag(u, "ritual.cost", {
          resource: n,
          amount: t
        }), f.info(`Custo customizado aplicado em ${a.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${a.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = Z("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = X(t);
      n && (await n.unsetFlag(u, "ritual.cost"), f.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = Z("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = X(t);
      if (!n) return;
      const r = e.automationRegistry.require(Qo);
      if (!r.ok) {
        f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = Z("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = X(n);
      if (!r) return;
      if (!ia(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(Zo);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: ei(t)
      }), f.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = Z("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = X(n);
      if (!r) return;
      if (!ia(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(Xo);
      if (!a.ok) {
        f.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: ur(t)
      }), f.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = Z("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = X(t);
      n && await Oc(e, t, n);
    }
  };
}
async function Oc(e, t, n) {
  const r = Qe(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: ni(),
    item: n,
    targets: dr()
  });
  if (!a.ok) {
    xc(a.error);
    return;
  }
  f.info("Automação de ritual executada com sucesso.", re(a.value.context));
}
function xc(e) {
  const t = `Automação de ritual falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    f.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    f.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  f.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Z(e) {
  const t = Ye.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function X(e) {
  const t = Ko(e);
  return t || (f.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Mc(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function ia(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const Fc = ["strict", "open"], ri = "strict";
function Bc(e) {
  return Fc.includes(e) ? e : ri;
}
function Uc(e) {
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
function Dt(e, t) {
  return e === "strict" && t.kind === "pending";
}
const qc = ["disabled", "ask", "automatic"], Gc = ["buttons", "confirm"], ai = "ask";
function zc(e) {
  return typeof e == "string" && qc.includes(e);
}
function jc(e) {
  return typeof e == "string" && Gc.includes(e);
}
function Vc(e) {
  return zc(e) ? e : jc(e) ? "ask" : ai;
}
const Hc = ["keep", "replace"], Wc = ["manual", "assisted"], oi = "keep", ii = "assisted", Kc = !0, w = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function Yc() {
  game.settings.register(u, w.executionMode, {
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
    default: ai
  }), game.settings.register(u, w.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: oi
  }), game.settings.register(u, w.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: ii
  }), game.settings.register(u, w.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: ri
  }), game.settings.register(u, w.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Kc
  }), game.settings.register(u, w.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function sa() {
  const e = Vc(game.settings.get(u, w.executionMode)), t = li(game.settings.get(u, w.systemCardMode)), n = ci(game.settings.get(u, w.damageResolutionMode)), r = mr();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: si()
  };
}
function Qc() {
  return li(game.settings.get(u, w.systemCardMode));
}
function Zc() {
  return ci(game.settings.get(u, w.damageResolutionMode));
}
function mr() {
  return Bc(game.settings.get(u, w.resistanceGateMode));
}
function si() {
  return game.settings.get(u, w.ritualCastingCheckEnabled) === !0;
}
async function J(e) {
  await game.settings.set(u, w.executionMode, e);
}
function li(e) {
  return Hc.includes(e) ? e : oi;
}
function ci(e) {
  return Wc.includes(e) ? e : ii;
}
function Xc(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await J("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await J("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await J(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await J("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await J("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await J("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await J("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const Jc = [
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
function eu(e) {
  return {
    phases() {
      return Jc;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = Qt("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = sc(t);
      if (!n) {
        f.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await la(e, t, n);
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
      if (!ru(n)) {
        f.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = nu(n) ?? Qt("Nenhum ator encontrado para executar automação do item.");
      r && await la(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = Qt("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = ic(t);
      if (!n) {
        f.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Jo);
        if (!r.ok) {
          f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
          return;
        }
        await e.automationBinder.applyPreset(n, r.value), f.info(`Preset de teste aplicado ao item: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${n.name}.`);
      } catch (r) {
        f.error("Falha ao configurar automação de teste no item.", r), ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}
async function la(e, t, n) {
  const r = Qe(n);
  if (!r.ok) {
    f.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: ni(),
    item: n,
    targets: dr()
  });
  if (!a.ok) {
    tu(a.error);
    return;
  }
  f.info("Automação executada com sucesso.", re(a.value.context));
}
function tu(e) {
  const t = `Automação falhou: ${e.message}`;
  if (e.reason === "resource-operation-failed") {
    f.warn(t, e.cause ?? e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  if (e.reason === "chat-card-failed") {
    f.error(t, e.cause ?? e), ui.notifications?.error(`Paranormal Toolkit: ${e.message}`);
    return;
  }
  f.warn(t, e), ui.notifications?.warn(`Paranormal Toolkit: ${e.message}`);
}
function Qt(e) {
  const t = Ye.getSelectedActor();
  return t || (f.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function nu(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function ru(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function au(e) {
  const t = hc(e), n = cc(e), r = Nc(e), a = eu(e), o = _c(), s = Xc(e);
  return {
    actor: t,
    automation: n,
    ritual: r,
    workflow: a,
    output: o,
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
function ou(e) {
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
      const r = ca();
      if (r.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição."), [];
      const a = await Promise.all(
        r.map(
          (o) => e.applyCondition({
            actor: o,
            conditionId: t,
            duration: n.duration,
            originUuid: n.originUuid,
            source: n.source ?? "api.applyToSelectedTokens",
            refreshExisting: n.refreshExisting
          })
        )
      );
      return iu(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = ca();
      if (n.length === 0)
        return ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para remover a condição."), [];
      const r = await Promise.all(
        n.map(
          (a) => e.removeCondition({
            actor: a,
            conditionId: t
          })
        )
      );
      return su(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function ca() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function iu(e) {
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
function su(e) {
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
function lu(e) {
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
    conditions: ou(e.conditions),
    debug: au(e)
  }, n = globalThis;
  return n[u] = t, n.ParanormalToolkit = t, t;
}
class ua {
  static isSupportedSystem() {
    return game.system.id === ql;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function cu() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ge(t.id),
    actorId: ge(t.actor?.id),
    sceneId: ge(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function di() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: ge(e.id),
    actorId: ge(t?.id),
    sceneId: ge(e.scene?.id),
    name: n
  };
}
function uu(e, t = di()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function du(e) {
  if (!pu(e)) return null;
  const t = e.getFlag(u, "workflow");
  return fu(t) ? t : null;
}
function mu() {
  return `flags.${u}.workflow`;
}
function da(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${u}`), n = foundry.utils.getProperty(e, `_source.flags.${u}`);
  return t !== void 0 || n !== void 0;
}
function ma(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Rn(t) || Rn(n);
}
function fu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function pu(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ge(e) {
  return Rn(e) ? e : null;
}
function Rn(e) {
  return typeof e == "string" && e.length > 0;
}
function gu() {
  const e = (t, n) => {
    hu(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function hu(e, t) {
  const n = du(e);
  if (!n || n.targets.length === 0) return;
  const r = yu(t);
  if (!r || r.querySelector(`.${u}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(bu(n));
}
function bu(e) {
  const t = document.createElement("section");
  t.classList.add(`${u}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(fa("Origem", e.source.name)), t.append(fa("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function fa(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${u}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const a = document.createElement("span");
  return a.textContent = t, n.append(r, a), n;
}
function yu(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function _u() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!Au(r) || !Tu(e) || da(e) || da(t)) return;
    const a = cu();
    if (a.length === 0 || !ma(e) && !ma(t)) return;
    const o = di();
    e.updateSource({
      [mu()]: uu(a, o)
    }), f.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function Au(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function Tu(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let pa = !1, Zt = !1, Xt = !1, st = null;
const Ru = 1e3, $u = 750, ku = 1e3;
function wu(e) {
  pa || (Hooks.on("combatTurnChange", (t) => {
    Iu(e, ga(t));
  }), Hooks.on("deleteCombat", (t) => {
    Cu(e, ga(t));
  }), pa = !0, Eu(e));
}
function Eu(e) {
  vt() && (Zt || (Zt = !0, globalThis.setTimeout(() => {
    Zt = !1, fr(e, "ready");
  }, Ru)));
}
function Iu(e, t) {
  vt() && t && (st && globalThis.clearTimeout(st), st = globalThis.setTimeout(() => {
    st = null, fr(e, "combat-turn-change", t);
  }, $u));
}
function Cu(e, t) {
  vt() && t && (Xt || (Xt = !0, globalThis.setTimeout(() => {
    Xt = !1, fr(e, "combat-deleted", t);
  }, ku)));
}
async function fr(e, t, n) {
  if (vt())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && f.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const a of r.failures)
        f.warn(a.message);
    } catch (r) {
      f.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function vt() {
  return game.user?.isGM === !0;
}
function ga(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const mi = {
  enabled: "dice.animations.enabled"
};
function Su() {
  game.settings.register(u, mi.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function Lu() {
  return {
    enabled: game.settings.get(u, mi.enabled) === !0
  };
}
const Pt = "chatCard", ha = "data-paranormal-toolkit-prompt-id", i = `${u}-item-use-prompt`, Du = `.${i}__title`, fi = `.${i}__header`, vu = `.${i}__roll-card`, Pu = `.${i}__roll-meta`, Nu = `.${i}__roll-meta-pill`, pr = `.${i}__resistance`, Ou = `.${i}__resistance-header`, pi = `.${i}__resistance-description`, Nt = `.${i}__resistance-roll-button`, gi = `.${i}__resistance-roll-result`, ba = `${i}__resistance-content`, hi = `.${i}__workflow-section`, bi = `.${i}__workflow-roll`, gr = `${i}__workflow-roll--dice-open`, hr = `.${i}__workflow-roll-formula`, br = `${i}__workflow-roll-formula--toggle`, Ot = `.${i}__workflow-dice-tray`, xu = `.${i}__roll-detail-toggle`, Mu = `.${i}__roll-detail-list`, Fu = `.${i}__ritual-element-badge`, Bu = `.${i}__ritual-metadata`, Uu = "casting-backlash", qu = "data-paranormal-toolkit-action-section", Gu = "data-paranormal-toolkit-prompt-id", zu = "data-paranormal-toolkit-pending-id", ya = "data-paranormal-toolkit-casting-backlash-enhanced", _a = `.${i}`, ju = `.${i}__workflow-section--casting`, Vu = `.${i}__workflow-section-header`, Hu = `.${i}__workflow-notes`, Wu = `[${qu}="${Uu}"]`, Aa = `${i}__workflow-section-title-row`, Ku = `${i}__workflow-section-header--casting-backlash`, yi = `${i}__casting-backlash-button`;
function Yu(e) {
  for (const t of Qu(e))
    Zu(t), nd(t);
}
function Qu(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(_a) && t.add(e);
  for (const n of e.querySelectorAll(_a))
    t.add(n);
  return Array.from(t);
}
function Zu(e) {
  const t = e.querySelector(Wu);
  if (!t) return;
  const n = Xu(t);
  if (!n) return;
  const r = e.querySelector(`${ju} ${Vu}`);
  r && (r.classList.add(Ku), Ju(r), ed(n), r.append(n), t.remove());
}
function Xu(e) {
  return e.querySelector(
    `button[${zu}], button[${Gu}]`
  );
}
function Ju(e) {
  const t = e.querySelector(`:scope > .${Aa}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Aa);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(yi) || n.append(a));
  return n;
}
function ed(e) {
  if (e.getAttribute(ya) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = td(t, e.disabled);
  e.classList.add(yi), e.setAttribute(ya, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function td(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function nd(e) {
  for (const t of e.querySelectorAll(Hu)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function rd(e) {
  for (const t of Array.from(e.querySelectorAll(hi)))
    for (const n of Array.from(t.querySelectorAll(`${xu}, ${Mu}`)))
      n.remove();
}
const ad = {
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
}, od = new Set(
  Object.values(ad)
), id = {
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
function sd(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = ld(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = id[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : od.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function _i(e) {
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
function ld(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Ai {
  async applyDamage(t) {
    const n = t.actor, r = n.name ?? "Ator sem nome", a = n.id ?? null;
    if (!Array.isArray(t.instances) || t.instances.length === 0)
      return p({
        actor: n,
        actorId: a,
        actorName: r,
        reason: "empty-damage",
        message: "Nenhuma instância de dano foi informada."
      });
    const o = n.applyDamage;
    if (typeof o != "function")
      return p({
        actor: n,
        actorId: a,
        actorName: r,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const s = [], l = /* @__PURE__ */ new Set();
    let c = null;
    for (const [d, m] of t.instances.entries()) {
      const b = cd(m, d);
      if (!b.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: m
        });
      const T = sd(m.damageType);
      if (!T.ok)
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(m.damageType)}.`,
          instance: m,
          damageType: m.damageType
        });
      if (b.amount === 0) {
        s.push(
          ud(b.id, m, T.value)
        );
        continue;
      }
      try {
        const A = await Promise.resolve(
          o.call(n, b.amount, {
            damageType: T.value ?? void 0,
            ignoreRD: m.ignoreResistance === !0,
            nonLethal: m.nonLethal === !0
          })
        );
        for (const j of md(A.conditions))
          l.add(j);
        const g = dd(A.newPV);
        g !== null && (c = g), s.push({
          id: b.id,
          label: m.label ?? _i(T.value),
          sourceRollId: m.sourceRollId ?? null,
          inputAmount: b.amount,
          finalDamage: Ta(A.finalDamage, b.amount),
          blocked: Ta(A.blocked, 0),
          damageType: m.damageType ? String(m.damageType) : null,
          systemDamageType: T.value,
          ignoreResistance: m.ignoreResistance === !0,
          nonLethal: m.nonLethal === !0
        });
      } catch (A) {
        return p({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: m,
          cause: A
        });
      }
    }
    return y({
      actor: n,
      actorId: a,
      actorName: r,
      totalRawDamage: s.reduce(
        (d, m) => d + m.inputAmount,
        0
      ),
      totalFinalDamage: s.reduce(
        (d, m) => d + m.finalDamage,
        0
      ),
      totalBlocked: s.reduce(
        (d, m) => d + m.blocked,
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
function cd(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function ud(e, t, n) {
  return {
    id: e,
    label: t.label ?? _i(n),
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
function Ta(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function dd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function md(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class yr {
  async rollResistance(t) {
    const n = await pd(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? ae(t.skill),
      roll: n,
      formula: hd(n),
      total: bd(n),
      diceBreakdown: yd(n)
    };
  }
  getSkillLabel(t) {
    return ae(t);
  }
}
async function fd(e, t) {
  return new yr().rollResistance({ actor: e, skill: t });
}
function ae(e) {
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
async function pd(e, t) {
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
  return gd(r);
}
function gd(e) {
  return Ra(e) ? e : Array.isArray(e) ? e.find(Ra) ?? null : null;
}
function Ra(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function hd(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function bd(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function yd(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(_d);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function _d(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class Ti {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class Ri {
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
function Ad(e, t) {
  const n = Id(e?.rounds);
  if (!n)
    return $a(null);
  const r = e?.anchor ?? $i(t);
  if (!r)
    return {
      ...$a(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: Td(),
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
    expiryEvent: a,
    durationMode: "combatantTurn",
    warning: null
  };
}
function $i(e) {
  const t = Cd();
  if (!t?.id || !ki(t.round)) return null;
  const n = wd(t), r = Rd(e, n) ?? kd(t), a = H(r?.id), o = Ld(r?.initiative), s = $d(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: Sd()
  };
}
function Td() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function $a(e) {
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
function Rd(e, t) {
  return e?.id ? t.find((n) => Ed(n) === e.id) ?? null : null;
}
function $d(e, t, n) {
  const r = H(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return Dd(e.turn) ? e.turn : null;
}
function kd(e) {
  return mt(e.combatant) ? e.combatant : null;
}
function wd(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(mt);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(mt);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(mt);
  }
  return [];
}
function Ed(e) {
  return H(e.actor?.id) ?? H(e.actorId) ?? H(e.token?.actor?.id) ?? H(e.token?.actorId) ?? H(e.document?.actor?.id) ?? H(e.document?.actorId);
}
function Id(e) {
  return ki(e) ? Math.trunc(e) : null;
}
function Cd() {
  return game.combat ?? null;
}
function Sd() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function mt(e) {
  return !!(e && typeof e == "object");
}
function H(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Ld(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ki(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Dd(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class wi {
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
    if (!qd(r))
      return p({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = Ad(t.duration, r), s = vd(a, t, o), c = t.refreshExisting ?? !0 ? Gd(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), y(ka(r, a, c.id ?? null, !1, !0, o));
      } catch (d) {
        return p({
          actor: r,
          actorId: r.id ?? null,
          actorName: r.name ?? "Ator sem nome",
          conditionId: a.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${a.label} em ${r.name ?? "ator sem nome"}.`,
          cause: d
        });
      }
    try {
      const m = (await r.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return y(ka(r, a, m, !0, !1, o));
    } catch (d) {
      return p({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: a.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${a.label} em ${r.name ?? "ator sem nome"}.`,
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
    const r = this.resolveCanonicalConditionId(t.conditionId), a = Ii(n, r);
    let o = 0;
    try {
      for (const s of a)
        await wa(n, s) === "deleted" && (o += 1);
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
    return y({
      actor: n,
      actorId: n.id ?? null,
      actorName: n.name ?? "Ator sem nome",
      conditionId: r,
      removed: o
    });
  }
  resolveCanonicalConditionId(t) {
    const n = this.registry.get(t);
    return n.ok ? n.value.id : t;
  }
  async cleanupExpiredConditions(t = {}) {
    const n = Vd(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = _r(s);
      a += l.length;
      for (const c of l) {
        if (!Od(c, t)) continue;
        const d = Ei(c);
        try {
          await wa(s, c) === "deleted" && (o += 1);
        } catch (m) {
          r.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: c.id ?? null,
            conditionId: d.conditionId,
            message: `Falha ao remover condição expirada ${d.conditionId ?? c.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
            cause: m
          });
        }
      }
    }
    return {
      reason: t.reason ?? "manual",
      scannedActors: n.length,
      scannedEffects: a,
      removedEffects: o,
      failures: r
    };
  }
}
function vd(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: tm(),
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
    changes: e.changes.map((a) => ({ ...a })),
    duration: Pd(n.duration),
    start: Nd(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [u]: r
    }
  };
}
function Pd(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function Nd(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: em(),
    ...e
  };
}
function ka(e, t, n, r, a, o) {
  return {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    conditionId: t.id,
    conditionLabel: t.label,
    effectId: n,
    created: r,
    refreshed: a,
    requestedRounds: o.requestedRounds,
    combatDurationApplied: o.combatDurationApplied,
    warning: o.warning
  };
}
function Od(e, t) {
  const n = Ei(e);
  if (!n.conditionId || !xd(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = Jd();
  return n.durationMode === "combatantTurn" || Md(n) ? Bd(n, r) : Fd(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !P(n.startRound) || !P(n.requestedRounds) || !P(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function xd(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && P(e.requestedRounds);
}
function Md(e) {
  return !!(e.combatDurationApplied && P(e.requestedRounds) && P(e.startRound) && (e.startCombatantId || yt(e.startTurn)));
}
function Fd(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Bd(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !P(e.startRound) || !P(e.requestedRounds) || !P(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Ud(t);
  return e.startCombatantId ? r === e.startCombatantId : yt(e.startTurn) && yt(t.turn) ? t.turn === e.startTurn : !1;
}
function Ud(e) {
  return he(e.combatant?.id);
}
function Ei(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: ft(e, "conditionId"),
    requestedRounds: Ea(e, "requestedRounds") ?? Be(t.value) ?? Be(t.rounds),
    combatDurationApplied: Jt(e, "combatDurationApplied"),
    combatId: ft(e, "combatId") ?? he(n.combat) ?? he(t.combat),
    startCombatantId: ft(e, "startCombatantId") ?? he(n.combatant),
    startInitiative: Yd(e, "startInitiative") ?? Ci(n.initiative),
    startRound: Ea(e, "startRound") ?? Be(n.round) ?? Be(t.startRound),
    startTurn: Kd(e, "startTurn") ?? $n(n.turn) ?? $n(t.startTurn),
    expiryEvent: Qd(e, "expiryEvent") ?? Si(t.expiry),
    durationMode: Zd(e, "durationMode"),
    deleteOnExpire: Jt(e, "deleteOnExpire"),
    expiresWithCombat: Jt(e, "expiresWithCombat")
  };
}
function qd(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function Gd(e, t) {
  return Ii(e, t)[0] ?? null;
}
function Ii(e, t) {
  return _r(e).filter((n) => Wd(n) === t);
}
async function wa(e, t) {
  const n = t.id ?? null, r = n ? zd(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (jd(a)) return "missing";
    throw a;
  }
}
function zd(e, t) {
  return _r(e).find((n) => n.id === t) ?? null;
}
function jd(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Vd() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      lt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    lt(e, n);
  });
  for (const n of Hd())
    lt(e, n.actor), lt(e, n.document?.actor);
  return Array.from(e.values());
}
function lt(e, t) {
  if (!Xd(t)) return;
  const r = he(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Hd() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function _r(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Wd(e) {
  return ft(e, "conditionId");
}
function ft(e, t) {
  return he(se(e, t));
}
function Ea(e, t) {
  return Be(se(e, t));
}
function Kd(e, t) {
  return $n(se(e, t));
}
function Yd(e, t) {
  return Ci(se(e, t));
}
function Qd(e, t) {
  return Si(se(e, t));
}
function Zd(e, t) {
  const n = se(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function Jt(e, t) {
  return se(e, t) === !0;
}
function se(e, t) {
  const n = e.getFlag?.(u, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const a = r[u];
  if (!(!a || typeof a != "object"))
    return a[t];
}
function he(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Be(e) {
  return P(e) ? Math.trunc(e) : null;
}
function $n(e) {
  return yt(e) ? Math.trunc(e) : null;
}
function Ci(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Si(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Xd(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function Jd() {
  return game.combat ?? null;
}
function em() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function P(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function yt(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function tm() {
  return game.user?.id ?? null;
}
const nm = "icons/svg/downgrade.svg", rm = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function _(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? nm,
    description: rm,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const am = _({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), om = _({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), im = _({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), sm = _({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), lm = _({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), cm = _({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), um = _({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), dm = _({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), mm = _({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), fm = _({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), pm = _({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), gm = _({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), hm = _({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), bm = _({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), ym = _({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), _m = _({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), Am = _({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), Tm = _({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), Rm = _({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), $m = _({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), km = _({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), wm = _({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), Em = _({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), Im = _({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), Cm = _({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), Sm = _({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), Lm = _({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), Dm = _({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), vm = _({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), Pm = _({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), Nm = _({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), Om = _({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), xm = _({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), Mm = _({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Fm = [
  am,
  om,
  im,
  sm,
  lm,
  cm,
  um,
  dm,
  mm,
  fm,
  pm,
  gm,
  hm,
  bm,
  ym,
  _m,
  Am,
  Tm,
  Rm,
  $m,
  km,
  wm,
  Em,
  Im,
  Cm,
  Sm,
  Lm,
  Dm,
  vm,
  Pm,
  Nm,
  Om,
  xm,
  Mm
];
class Bm {
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
    return Array.from(this.definitions.values()).map(Ia);
  }
  get(t) {
    const n = this.lookup.get(Ca(t)), r = n ? this.definitions.get(n) : null;
    return r ? y(Ia(r)) : p({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Ca(t);
    r && this.lookup.set(r, n);
  }
}
function Li() {
  return new Bm(Fm);
}
function Ia(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Ca(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function Re(e) {
  return e.applyOnResistance ?? "failure";
}
function Di(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function vi(e, t) {
  const n = Re(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function Pi(e) {
  const t = Re(e);
  return t === "failure" || t === "success";
}
function Um(e, t, n, r) {
  const a = e.filter((c) => vi(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => Re(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((d) => r(d) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const qm = {
  available: "Aplicar dano",
  availableCompact: "Dano",
  waitingResistance: "Role resistência",
  waitingResistanceCompact: "Role res.",
  resisted: "Aplicar metade",
  resistedCompact: "½ dano",
  applied: "Dano aplicado",
  appliedCompact: "Aplicado",
  unavailable: "Dano indisponível",
  unavailableCompact: "Sem dano"
}, Gm = {
  available: "Aplicar efeito",
  availableCompact: "Efeito",
  waitingResistance: "Role resistência",
  waitingResistanceCompact: "Role res.",
  resisted: "Resistiu ao efeito",
  resistedCompact: "Resistiu",
  applied: "Efeito aplicado",
  appliedCompact: "Aplicado",
  unavailable: "Efeito indisponível",
  unavailableCompact: "Sem efeito"
};
function zm(e) {
  return Oi(e, qm, !1);
}
function jm(e) {
  return Oi(e, Gm, !e.allowsSuccessfulResistance);
}
function Ie(e) {
  return e.kind === "waiting-resistance";
}
function Ni(e) {
  return e.kind === "resisted";
}
function Oi(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? me("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? me("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || Dt(e.resistanceGateMode, e.resistanceState) ? me(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? me("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : me("available", !0, r.available, r.availableCompact, null);
}
function me(e, t, n, r, a) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: a
  };
}
const Ue = "data-paranormal-toolkit-prompt-id", Vm = "data-paranormal-toolkit-resistance-roll-result", Hm = "Conjuração DT";
function Wm(e) {
  const t = e.querySelector(Nt)?.getAttribute(Vm), n = Ve(t);
  if (n !== null) return n;
  const r = e.querySelector(gi)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Ve(a?.[1] ?? null);
}
function xi(e) {
  const t = Mi(e), n = Qm(t);
  if (n !== null) return n;
  const r = Zm(t);
  return r !== null ? r : Xm(e);
}
function Km(e) {
  const t = Mi(e);
  return t ? {
    actorId: en(t.actorId),
    itemId: en(t.itemId),
    itemName: en(t.itemName)
  } : null;
}
function Ym(e) {
  const t = e.getAttribute(Ue);
  if (!t) return null;
  const n = Fi(e), r = Bi(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => xt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function W(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function kn(e) {
  return W(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Qm(e) {
  const t = ef(e);
  return t.length === 0 ? null : Ve(tf(t, Hm));
}
function Zm(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : Sa(r, ["system", "ritual", "DT"]) ?? Sa(r, ["system", "ritual", "dt"]);
}
function Xm(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Ve(n?.[1] ?? null);
}
function Mi(e) {
  const t = Jm(e);
  if (!t) return null;
  const n = Fi(e), r = Bi(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => xt(o) ? o.pendingId === t : !1) ?? null;
}
function Jm(e) {
  return (e.closest(`[${Ue}]`) ?? e.querySelector(`[${Ue}]`) ?? e.parentElement?.querySelector(`[${Ue}]`) ?? null)?.getAttribute(Ue) ?? null;
}
function Fi(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return nf(a) ? a : null;
}
function Bi(e) {
  const t = e?.getFlag?.(u, Pt);
  return xt(t) ? t : null;
}
function ef(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function tf(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function Sa(e, t) {
  let n = e;
  for (const r of t) {
    if (!xt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Ve(typeof n == "string" ? n : null);
}
function Ve(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function nf(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function xt(e) {
  return !!(e && typeof e == "object");
}
function en(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Mt(e) {
  return Ui({
    hasResistance: !!e.querySelector(pr),
    difficulty: xi(e),
    resistanceTotal: Wm(e)
  });
}
function rf(e) {
  if (!e.hasResistance || e.difficulty === null)
    return Ui({
      hasResistance: e.hasResistance,
      difficulty: e.difficulty,
      resistanceTotal: null
    });
  if (e.status === "pending")
    return {
      hasResistance: !0,
      difficulty: e.difficulty,
      total: null,
      state: {
        kind: "pending",
        difficulty: e.difficulty
      }
    };
  const t = e.total ?? 0;
  return {
    hasResistance: !0,
    difficulty: e.difficulty,
    total: t,
    state: {
      kind: e.status === "succeeded" ? "succeeded" : "failed",
      difficulty: e.difficulty,
      total: t
    }
  };
}
function Ui(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Uc(e)
  };
}
function le() {
  return game.user?.isGM === !0;
}
function oe() {
  return le();
}
function af(e) {
  const t = Dt(e.resistanceGateMode, e.resistanceState), n = of(e.resistanceState, e.hasDamage), r = sf(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = zm({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = jm({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.effectAlreadyApplied,
    unavailable: !e.hasEffect,
    allowsSuccessfulResistance: !!e.effectCanApplyOnSuccessfulResistance,
    requiresResolvedResistance: !!e.effectRequiresResolvedResistance
  });
  return {
    canShowApplyDamage: e.isGM && e.hasDamage,
    canShowApplyEffect: e.isGM && e.hasEffect,
    damageActionState: a,
    effectActionState: o,
    damageMode: n,
    effectMode: r,
    blocksPendingResistance: t
  };
}
function of(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function sf(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Ar(e) {
  const t = e.isGM ?? oe();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: af({
      isGM: t,
      resistanceGateMode: e.resistanceGateMode,
      resistanceState: e.resistanceState,
      hasDamage: e.damage !== null,
      hasEffect: e.effect !== null,
      damageAlreadyApplied: e.damageAlreadyApplied,
      effectAlreadyApplied: e.effectAlreadyApplied,
      effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
      effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
    })
  };
}
function lf(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = uf(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function cf(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function uf(e, t) {
  const n = df(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of mf(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function df(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function mf(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? La(e, "highest") : n.includes("kl") ? La(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function La(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const ff = "data-paranormal-toolkit-resistance-skill", pf = "data-paranormal-toolkit-resistance-skill-label", qi = "pending", Tr = "success", Rr = "failure", Gi = "rolled";
function gf(e) {
  const t = Af(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? yf(e.damageSection) : null, r = Da(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = hf(e.rollCard).map((o, s) => {
    const l = bf(o, s), c = e.resistanceResults.get(l) ?? null, d = wf(c, t?.difficulty ?? null), m = e.damageApplications.get(l) ?? null, b = e.effectApplications.get(l) ?? null, T = rf({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: Sf(d)
    }).state, A = Da(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      Di(T)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: d,
      resistanceResult: c,
      damageApplication: m,
      effectApplication: b,
      effect: A,
      assistedActions: Ar({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: T,
        damage: n,
        effect: A,
        damageAlreadyApplied: !!m,
        effectAlreadyApplied: !!b,
        effectCanApplyOnSuccessfulResistance: A?.applyOnResistance === "success" || A?.applyOnResistance === "always",
        effectRequiresResolvedResistance: A ? Pi(A) : !1
      })
    };
  });
  return a.length <= 1 || !n && !r ? null : {
    rollCard: e.rollCard,
    targets: a,
    damage: n,
    effect: r,
    resistance: t
  };
}
function hf(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((a) => a.trim()).filter((a) => a.length > 0 && zi(a) !== "nenhum alvo") : [];
}
function bf(e, t) {
  return `${zi(e)}:${t}`;
}
function yf(e) {
  const t = Ef(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: Cf(e),
    formula: If(e) ?? "—",
    total: t,
    diceBreakdown: cf(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Da(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: _f(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: Re(o)
  } : null;
}
function _f(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function Af(e, t) {
  const n = Tf(t), r = Rf(n)?.textContent?.trim(), a = $f(n), o = a?.getAttribute(ff) ?? null, s = a?.getAttribute(pf) ?? (o ? ae(o) : null);
  return !r && !o ? null : {
    description: r ?? "Resistência do alvo.",
    formula: kf(n)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: s,
    difficulty: xi(e)
  };
}
function Tf(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function Rf(e) {
  return $r(e, `.${i}__resistance-description`);
}
function $f(e) {
  return $r(e, Nt);
}
function kf(e) {
  return $r(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function $r(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function wf(e, t) {
  return e ? t === null ? Gi : e.total >= t ? Tr : Rr : qi;
}
function Ef(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function If(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function Cf(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function zi(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function Sf(e) {
  return e === Tr ? "succeeded" : e === Rr ? "failed" : "pending";
}
function ji(e) {
  if (!e) return null;
  const t = e.actorId ? vf(e.actorId) : null, n = t ? Lf(t, e.itemId, e.itemName) : null;
  return n || Df(e.itemId, e.itemName);
}
function Lf(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (be(o)) return o;
  }
  const a = _t(n);
  if (a) {
    const o = r?.find?.((s) => be(s) ? _t(s.name) === a : !1);
    if (be(o)) return o;
  }
  return null;
}
function Df(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (be(a)) return a;
  }
  const r = _t(t);
  if (r) {
    const a = n?.find?.((o) => be(o) ? _t(o.name) === r : !1);
    if (be(a)) return a;
  }
  return null;
}
function vf(e) {
  const n = game.actors?.get?.(e);
  return Pf(n) ? n : null;
}
function Pf(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function be(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function _t(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function kr(e) {
  const t = tn(e);
  if (!t) return null;
  const n = Nf().filter((o) => tn(Of(o)) === t).map((o) => Vi(o)).find(ze) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => ze(o) && tn(o.name) === t);
  return ze(a) ? a : null;
}
function Nf() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function Of(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Vi(e)?.name ?? null;
}
function Vi(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (ze(t)) return t;
  const n = e.document?.actor;
  return ze(n) ? n : null;
}
function ze(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function tn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Hi(e) {
  const t = Bf();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: xf(e)
  });
}
function xf(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${pt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = Mf(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${pt(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${pt(e.actorName)}</strong></p>
      <ul>
        ${t}
        ${n}
        ${r}
        ${a}
        ${o}
      </ul>
    </div>
  `;
}
function Mf(e) {
  const t = Ff(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${pt(a)}</li>`;
}
function Ff(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = va(n?.value);
  return r === null ? null : {
    value: r,
    max: va(n?.max)
  };
}
function va(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Bf() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function pt(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function Uf(e) {
  await Hi(qf(e));
}
function qf(e) {
  if (Gf(e)) return e;
  const t = e.finalDamage + e.blocked;
  return {
    actor: e.actor,
    actorId: e.actor.id ?? null,
    actorName: e.targetName,
    totalRawDamage: t,
    totalFinalDamage: e.finalDamage,
    totalBlocked: e.blocked,
    newPV: null,
    conditions: [],
    instances: [
      {
        id: "multi-target-damage",
        label: "Dano",
        sourceRollId: null,
        inputAmount: t,
        finalDamage: e.finalDamage,
        blocked: e.blocked,
        damageType: null,
        systemDamageType: null,
        ignoreResistance: !1,
        nonLethal: !1
      }
    ],
    source: "item-use.multi-target-damage",
    originUuid: null
  };
}
function Gf(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function Wi(e) {
  return e.mode, `✓ ${Ki(e.inputAmount)} PV`;
}
function zf(e) {
  const t = Ki(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Ki(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class jf {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? oe()) !== !0 ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "permission-denied",
        message: "Apenas o Mestre pode aplicar dano assistido."
      }
    } : Dt(t.resistanceGateMode, t.resistanceState) ? {
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
class Vf {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? oe()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : Dt(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
      t,
      t.resistanceState.kind === "pending" || t.resistanceState.kind === "none" ? "resistance-pending" : "resistance-outcome-mismatch",
      t.resistanceState.kind === "pending" || t.resistanceState.kind === "none" ? "Role a resistência do alvo antes de aplicar efeito." : "O resultado da resistência não permite aplicar este efeito."
    ) : t.resistanceState.kind === "succeeded" && !t.allowSuccessfulResistance ? this.block(t, "resistance-succeeded", "Este alvo resistiu ao efeito.") : this.conditions.applyCondition({
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
class Hf {
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
const Wf = `.${i}__actions`, wr = `.${i}__actions-title`, $e = `.${i}__button`, Kf = "data-paranormal-toolkit-action-section", Yf = `${i}__button--executed`, Qf = "data-paranormal-toolkit-executed-label";
function Yi(e) {
  return W(e.querySelector(wr)?.textContent);
}
function Zf(e, t) {
  const n = e.querySelector(wr);
  n && (n.textContent = t);
}
function Xe(e, t) {
  const n = W(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return W(a) === n;
  }) ?? null;
}
function Er(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function ce(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const ct = "data-paranormal-toolkit-prompt-id", Qi = "multiTargetResistanceResults", Zi = "multiTargetDamageApplications", Xi = "multiTargetEffectApplications";
function Xf(e) {
  const t = /* @__PURE__ */ new Map(), r = Ft(e)?.[Qi];
  if (!O(r)) return t;
  for (const [a, o] of Object.entries(r))
    op(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Jf(e, t) {
  await Ir(e, Qi, t.targetId, t);
}
function ep(e) {
  const t = /* @__PURE__ */ new Map(), r = Ft(e)?.[Zi];
  if (!O(r)) return t;
  for (const [a, o] of Object.entries(r))
    ip(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function tp(e, t) {
  await Ir(
    e,
    Zi,
    t.targetId,
    t
  );
}
function np(e) {
  const t = /* @__PURE__ */ new Map(), r = Ft(e)?.[Xi];
  if (!O(r)) return t;
  for (const [a, o] of Object.entries(r))
    lp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function rp(e, t) {
  await Ir(
    e,
    Xi,
    t.targetId,
    t
  );
}
function ap(e) {
  const t = Ft(e);
  return t ? {
    actorId: nn(t.actorId),
    itemId: nn(t.itemId),
    itemName: nn(t.itemName)
  } : null;
}
async function Ir(e, t, n, r) {
  const a = Ji(e);
  if (!a) return;
  const o = es(e), s = ts(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((d) => {
    if (!O(d) || d.pendingId !== a) return d;
    const m = O(d[t]) ? d[t] : {};
    return l = !0, {
      ...d,
      [t]: {
        ...m,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(o.setFlag?.(u, Pt, {
    ...s,
    prompts: c
  }));
}
function Ft(e) {
  const t = Ji(e);
  if (!t) return null;
  const n = es(e), r = ts(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => O(o) ? o.pendingId === t : !1) ?? null;
}
function Ji(e) {
  return (e.closest(`[${ct}]`) ?? e.querySelector(`[${ct}]`) ?? e.parentElement?.querySelector(`[${ct}]`) ?? null)?.getAttribute(ct) ?? null;
}
function es(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return cp(a) ? a : null;
}
function ts(e) {
  const t = e?.getFlag?.(u, Pt);
  return O(t) ? t : null;
}
function op(e) {
  return O(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function ip(e) {
  return O(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && sp(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function sp(e) {
  return e === "normal" || e === "half";
}
function lp(e) {
  return O(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function nn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function cp(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function O(e) {
  return !!(e && typeof e == "object");
}
const up = "data-paranormal-toolkit-resistance-skill", dp = "data-paranormal-toolkit-resistance-skill-label", wn = "data-paranormal-toolkit-multi-target-section", Cr = "data-paranormal-toolkit-multi-target-damage-info", ns = "data-paranormal-toolkit-multi-target-effect-info", rs = "data-paranormal-toolkit-multi-target-toggle", as = "data-paranormal-toolkit-multi-target-details", v = "data-paranormal-toolkit-multi-target-target", mp = "data-paranormal-toolkit-multi-target-state", En = "data-paranormal-toolkit-multi-target-roll-total", In = "data-paranormal-toolkit-multi-target-roll-formula", gt = "data-paranormal-toolkit-multi-target-roll-dice", Cn = "data-paranormal-toolkit-multi-target-roll-skill", Sn = "data-paranormal-toolkit-multi-target-roll-skill-label", Ln = "data-paranormal-toolkit-multi-target-roll-target-name", Dn = "data-paranormal-toolkit-multi-target-roll-rolled-at", vn = "data-paranormal-toolkit-multi-target-damage-mode", Pn = "data-paranormal-toolkit-multi-target-damage-input-amount", Pa = "data-paranormal-toolkit-multi-target-damage-final-amount", Na = "data-paranormal-toolkit-multi-target-damage-blocked", Nn = "data-paranormal-toolkit-multi-target-damage-target-name", On = "data-paranormal-toolkit-multi-target-damage-applied-at", xn = "data-paranormal-toolkit-multi-target-effect-condition-id", Mn = "data-paranormal-toolkit-multi-target-effect-condition-label", Fn = "data-paranormal-toolkit-multi-target-effect-effect-id", Bn = "data-paranormal-toolkit-multi-target-effect-created", Un = "data-paranormal-toolkit-multi-target-effect-refreshed", qn = "data-paranormal-toolkit-multi-target-effect-target-name", Gn = "data-paranormal-toolkit-multi-target-effect-applied-at", fp = new wi(Li()), pp = new Ti(new Ai()), gp = new Ri(new yr()), hp = new Hf(gp), bp = new jf(pp), yp = new Vf(fp), _p = qi, Ce = Tr, Je = Rr, Ap = Gi;
function Tp(e) {
  const t = os(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), Lp(e);
  const n = Dp(e.rollCard, t), r = vp(e.rollCard, t);
  !n && r && mg(e.rollCard, r, e.effectSection);
  const a = Fp(e.rollCard);
  return ls(a, t), cg(
    e.rollCard,
    a,
    Pp(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && fg(e.rollCard, r, a), !0;
}
function os(e) {
  return gf({
    ...e,
    resistanceResults: kp(e.rollCard),
    damageApplications: wp(e.rollCard),
    effectApplications: Ep(e.rollCard),
    resolveTargetConditionApplication: Rp,
    resistanceGateMode: Lr()
  });
}
function Rp(e, t, n) {
  const r = ap(e), a = ji(r);
  if (!a) return null;
  const o = Qe(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = $p(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function $p(e, t, n) {
  const r = Um(
    e,
    n,
    t,
    rn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = rn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => rn(s) === a)) ?? null : null;
}
function kp(e) {
  const t = Xf(e);
  for (const [n, r] of Sp(e))
    t.set(n, r);
  return t;
}
function wp(e) {
  const t = ep(e);
  for (const [n, r] of Cp(e))
    t.set(n, r);
  return t;
}
function Ep(e) {
  const t = np(e);
  for (const [n, r] of Ip(e))
    t.set(n, r);
  return t;
}
function Ip(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${v}]`)) {
    const r = n.getAttribute(v), a = n.getAttribute(xn), o = n.getAttribute(Mn), s = n.getAttribute(Fn), l = Ma(n.getAttribute(Bn)), c = Ma(n.getAttribute(Un)), d = n.getAttribute(qn), m = n.getAttribute(Gn);
    !r || !a || !o || l === null || c === null || !d || !m || t.set(r, {
      targetId: r,
      targetName: d,
      conditionId: a,
      conditionLabel: o,
      effectId: s && s.length > 0 ? s : null,
      created: l,
      refreshed: c,
      appliedAt: m
    });
  }
  return t;
}
function Cp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${v}]`)) {
    const r = n.getAttribute(v), a = n.getAttribute(vn), o = ys(n.getAttribute(Pn)), s = n.getAttribute(Nn), l = n.getAttribute(On);
    !r || !hg(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function Sp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${v}]`)) {
    const r = n.getAttribute(v), a = ys(n.getAttribute(En)), o = n.getAttribute(In), s = n.getAttribute(Cn), l = n.getAttribute(Sn), c = n.getAttribute(Ln), d = n.getAttribute(Dn);
    !r || a === null || !o || !s || !l || !c || !d || t.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: a,
      diceBreakdown: n.getAttribute(gt),
      rolledAt: d
    });
  }
  return t;
}
function Lp(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function Dp(e, t) {
  if (!t.damage)
    return is(e)?.remove(), null;
  const n = Np(e);
  return Op(n, t.damage), Mp(e, n), n;
}
function vp(e, t) {
  if (!t.effect)
    return bs(e)?.remove(), null;
  const n = ug(e);
  return dg(n, t.effect), n;
}
function Pp(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : Xe(e, "Conjuração");
}
function Np(e) {
  const t = is(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Cr, "true"), n;
}
function is(e) {
  return e.querySelector(`[${Cr}="true"]`);
}
function Op(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(ss(t.formula, t.total, t.diceBreakdown));
}
function ss(e, t, n, r = !1) {
  const a = lf({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return xp(a, r), a;
}
function xp(e, t) {
  const n = e.querySelector(Ot), r = e.querySelector(hr);
  if (!n || !r) return;
  e.classList.toggle(gr, t), n.hidden = !t, r.classList.add(br), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function Mp(e, t) {
  const n = Xe(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Fp(e) {
  const t = e.querySelector(`[${wn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(wn, "true"), n;
}
function ls(e, t) {
  const n = Bp(e);
  e.replaceChildren(Up(t), Gp(t, n));
}
function Bp(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${v}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(v)).filter(gg)
  );
}
function Up(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = qp(e.targets), t.append(n, r), t;
}
function qp(e) {
  const t = e.length, n = e.filter((l) => l.state === Je).length, r = e.filter((l) => l.state === Ce).length, a = e.filter((l) => l.state === _p).length, o = e.filter((l) => l.state === Ap).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function Gp(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(zp(r, e, t.has(r.id)));
  return n;
}
function zp(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(v, e.id), r.setAttribute(mp, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), cs(r, e.resistanceResult), us(r, e.damageApplication), ds(r, e.effectApplication);
  const a = jp(e, t, r), o = og(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    xa(s.target) || Oa(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || xa(s.target) || (s.preventDefault(), Oa(r));
  }), r.append(a, o), r;
}
function cs(e, t) {
  if (!t) {
    e.removeAttribute(En), e.removeAttribute(In), e.removeAttribute(gt), e.removeAttribute(Cn), e.removeAttribute(Sn), e.removeAttribute(Ln), e.removeAttribute(Dn);
    return;
  }
  e.setAttribute(En, String(t.total)), e.setAttribute(In, t.formula), e.setAttribute(Cn, t.skill), e.setAttribute(Sn, t.skillLabel), e.setAttribute(Ln, t.targetName), e.setAttribute(Dn, t.rolledAt), t.diceBreakdown ? e.setAttribute(gt, t.diceBreakdown) : e.removeAttribute(gt);
}
function us(e, t) {
  if (!t) {
    e.removeAttribute(vn), e.removeAttribute(Pn), e.removeAttribute(Pa), e.removeAttribute(Na), e.removeAttribute(Nn), e.removeAttribute(On);
    return;
  }
  e.setAttribute(vn, t.mode), e.setAttribute(Pn, String(t.inputAmount)), e.removeAttribute(Pa), e.removeAttribute(Na), e.setAttribute(Nn, t.targetName), e.setAttribute(On, t.appliedAt);
}
function ds(e, t) {
  if (!t) {
    e.removeAttribute(xn), e.removeAttribute(Mn), e.removeAttribute(Fn), e.removeAttribute(Bn), e.removeAttribute(Un), e.removeAttribute(qn), e.removeAttribute(Gn);
    return;
  }
  e.setAttribute(xn, t.conditionId), e.setAttribute(Mn, t.conditionLabel), e.setAttribute(Fn, t.effectId ?? ""), e.setAttribute(Bn, String(t.created)), e.setAttribute(Un, String(t.refreshed)), e.setAttribute(qn, t.targetName), e.setAttribute(Gn, t.appliedAt);
}
function jp(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = Vp(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Hp(e, t.resistance);
  Qp(l, n, e, t);
  const c = ag(n);
  a.append(o, s, l, c);
  const d = document.createElement("div");
  return d.classList.add(`${i}__target-summary-actions`), gs(d, [
    ms(e, t, "compact"),
    ps(e, t, "compact")
  ]), r.append(a, d), r;
}
function Vp(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Hp(e, t) {
  if (!le())
    return Wp(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Yp(e, t)), t?.skill && (n.setAttribute(up, t.skill), n.setAttribute(dp, t.skillLabel ?? ae(t.skill))), !t?.skill)
    return n.disabled = !0, n.title = "Resistência não configurada", n.textContent = "—", n;
  if (n.title = e.resistanceResult ? `Rolar ${t.skillLabel ?? t.skill} novamente` : `Rolar ${t.skillLabel ?? t.skill} de ${e.name}`, !e.resistanceResult) {
    const o = document.createElement("i");
    o.classList.add("fa-solid", "fa-dice-d20"), o.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    return s.classList.add(`${i}__target-resistance-fallback`), s.textContent = "d20", n.append(o, s), n;
  }
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Ce ? "✓" : e.state === Je ? "✕" : "", n.append(r, a), n;
}
function Wp(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Kp(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Ce ? "✓" : e.state === Je ? "✕" : "", n.append(r, a), n;
}
function Kp(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Ce ? "sucesso" : e.state === Je ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function Yp(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Ce ? "sucesso" : e.state === Je ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Qp(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !le() || e.addEventListener("click", (a) => {
    a.stopPropagation(), Zp(t, e, n, r);
  });
}
async function Zp(e, t, n, r) {
  if (!le()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? ae(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = kr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const d = await hp.execute({ actor: l, skill: o, skillLabel: s });
    await pg(d.roll);
    const m = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      skill: o,
      skillLabel: s,
      formula: d.formula,
      total: d.total,
      diceBreakdown: d.diceBreakdown,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    cs(e, m);
    try {
      await Jf(r.rollCard, m);
    } catch (b) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", b);
    }
    Sr(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function Sr(e) {
  const t = e.closest(`[${wn}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = os({
    rollCard: n,
    damageSection: Xp(n) ?? Xe(n, "Dano"),
    effectSection: Jp(n)
  });
  r && ls(t, r);
}
function Xp(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Cr) !== "true") ?? null;
}
function Jp(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function eg(e) {
  return Ie(e.assistedActions.policy.damageActionState);
}
function tg(e) {
  return Ie(e.assistedActions.policy.effectActionState);
}
function Lr() {
  try {
    return mr();
  } catch {
    return "strict";
  }
}
function ms(e, t, n) {
  if (e.damageApplication)
    return M(
      "✓",
      Wi({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Ie(r))
    return M(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = fs(a, t.damage);
  if (o === null)
    return M(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = zf({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, d = M(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return d.title = `Aplicar ${s} em ${e.name}`, d.setAttribute("aria-label", d.title), d.addEventListener("click", (m) => {
    m.stopPropagation();
    const b = d.closest(`[${v}]`);
    b && ng(b, d, e, t);
  }), d;
}
function fs(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function ng(e, t, n, r) {
  if (n.damageApplication) return;
  if (eg(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = fs(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = kr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const d = await bp.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: Lr(),
      resistanceState: n.assistedActions.resistanceState
    });
    if (!d.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${d.error.message}`), t.innerHTML = c;
      return;
    }
    const m = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      mode: o,
      inputAmount: s,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    us(e, m);
    try {
      await tp(r.rollCard, m);
    } catch (b) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", b);
    }
    try {
      await Uf(d.value);
    } catch (b) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", b);
    }
    Sr(e);
  } catch (d) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", d), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function ps(e, t, n) {
  const r = e.assistedActions.policy.effectActionState, a = e.effect ?? t.effect;
  if (!a)
    return M(
      "✦",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--disabled`],
      !0
    );
  if (e.effectApplication)
    return M(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (Ie(r))
    return M(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (Ni(r))
    return M(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = M(
    "✦",
    n === "full" ? `Aplicar ${a.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${a.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${v}]`);
    l && rg(l, o, e, t);
  }), o;
}
async function rg(e, t, n, r) {
  if (n.effectApplication) return;
  if (tg(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar efeito.");
    return;
  }
  if (n.assistedActions.policy.effectMode === "resisted") {
    ui.notifications?.warn?.("Paranormal Toolkit: este alvo resistiu ao efeito.");
    return;
  }
  const a = n.effect ?? r.effect;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui efeito estruturado para aplicar.");
    return;
  }
  const o = kr(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await yp.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: Lr(),
      resistanceState: n.assistedActions.resistanceState,
      allowSuccessfulResistance: a.applyOnResistance === "success" || a.applyOnResistance === "always",
      requiredResistanceOutcome: a.applyOnResistance === "success" ? "succeeded" : a.applyOnResistance === "failure" ? "failed" : null
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
    ds(e, c);
    try {
      await rp(r.rollCard, c);
    } catch (d) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", d);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), Sr(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function gs(e, t) {
  for (const n of t)
    n && e.append(n);
}
function M(e, t, n, r) {
  const a = document.createElement("button");
  a.type = "button", a.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), a.disabled = r;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, a.append(o, s), a;
}
function ag(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(rs, "true"), t.setAttribute("aria-hidden", "true"), hs(e, t), t;
}
function Oa(e) {
  const t = e.querySelector(`[${as}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${rs}="true"]`);
  r && hs(e, r);
}
function hs(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function xa(e) {
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
function og(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(as, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = ig(e, t.resistance);
  s && r.append(s);
  const l = sg(e, t.resistance), c = lg(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function ig(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Ce ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function sg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = ss(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function lg(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), gs(n, [
    ms(e, t, "full"),
    ps(e, t, "full")
  ]), n;
}
function cg(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function ug(e) {
  const t = bs(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(ns, "true"), n;
}
function bs(e) {
  return e.querySelector(`[${ns}="true"]`);
}
function dg(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  r.textContent = "Efeito", n.append(r);
  const a = document.createElement("div");
  a.classList.add(`${i}__effect-info-body`);
  const o = document.createElement("span");
  o.classList.add(`${i}__effect-info-label`), o.textContent = t.label;
  const s = document.createElement("span");
  s.classList.add(`${i}__effect-info-hint`), s.textContent = "Aplicação por alvo", a.append(o, s), e.append(n, a);
}
function mg(e, t, n) {
  const r = n?.parentElement === e ? n : Xe(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function fg(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function rn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function pg(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function gg(e) {
  return typeof e == "string" && e.length > 0;
}
function hg(e) {
  return e === "normal" || e === "half";
}
function Ma(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function ys(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const Fa = "data-paranormal-toolkit-card-layout-refresh-bound";
function bg(e) {
  const t = e.rollCard.querySelector(Nt);
  t && t.getAttribute(Fa) !== "true" && (t.setAttribute(Fa, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const ye = "data-paranormal-toolkit-prompt-id", yg = "apply-damage", _g = "data-paranormal-toolkit-multi-target-damage-info";
function Ag(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(_g) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function Tg(e) {
  const t = $g(e);
  return t.find((n) => n.getAttribute(Kf) === yg) ?? t.find((n) => Yi(n) === "aplicar danos") ?? null;
}
function Rg(e) {
  const t = _s(e), n = Ba(t);
  return n || Ba(kg(e));
}
function Ba(e) {
  return e.find((t) => {
    const n = Yi(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function $g(e) {
  const t = _s(e);
  return t.length > 0 ? t : Dr(e);
}
function _s(e) {
  const t = Ig(e);
  return t ? Dr(e).filter((n) => Eg(n, t)) : [];
}
function kg(e) {
  const t = As(e);
  if (!t) return [];
  const n = wg(e, t);
  return Dr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => Ts(e, r)).filter((r) => !n || Cg(r, n));
}
function Dr(e) {
  const t = As(e);
  return t ? Array.from(t.querySelectorAll(Wf)) : [];
}
function As(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function wg(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && Ts(e, n)) ?? null;
}
function Eg(e, t) {
  return e.getAttribute(ye) === t ? !0 : Array.from(e.querySelectorAll(`[${ye}]`)).some((n) => n.getAttribute(ye) === t);
}
function Ig(e) {
  return e.getAttribute(ye) ?? e.querySelector(`[${ye}]`)?.getAttribute(ye) ?? null;
}
function Ts(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Cg(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function Sg(e) {
  const t = Rs(), n = Mt(e.rollCard).state, r = Ar({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = Ie(a), s = Ni(a);
  return e.applied ? xe({
    kind: "applied",
    visible: !0,
    enabled: !1,
    applied: !0,
    waitingForResistance: o,
    resisted: s,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: a,
    resistanceState: n
  }) : r.policy.canShowApplyEffect ? xe(o ? {
    kind: "waiting-resistance",
    visible: !0,
    enabled: !1,
    applied: !1,
    waitingForResistance: !0,
    resisted: !1,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: a,
    resistanceState: n
  } : s ? {
    kind: "resisted",
    visible: !0,
    enabled: !1,
    applied: !1,
    waitingForResistance: !1,
    resisted: !0,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: a,
    resistanceState: n
  } : {
    kind: "applicable",
    visible: !0,
    enabled: !0,
    applied: !1,
    waitingForResistance: !1,
    resisted: !1,
    applicable: !0,
    effectLabel: e.effectLabel,
    actionState: a,
    resistanceState: n
  }) : xe({
    kind: "hidden",
    visible: !1,
    enabled: !1,
    applied: !1,
    waitingForResistance: o,
    resisted: s,
    applicable: !1,
    effectLabel: e.effectLabel,
    actionState: a,
    resistanceState: n
  });
}
function xe(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function Lg(e) {
  const { rollCard: t } = e, n = Pg(), r = Rs(), a = Mt(t).state, o = Ar({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Ie(s), c = vg(e);
  if (c)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: k(
        "normal",
        c === "normal",
        !1,
        c === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: k(
        "half",
        c === "half",
        !1,
        c === "half",
        !!e.halfButtonSkipped
      ),
      summary: Dg(a)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: k("normal", !1, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: k("half", !1, !1, !1, !!e.halfButtonSkipped, s.label),
      summary: {
        state: l ? "pending" : "manual",
        message: l ? s.reason : null
      }
    };
  if (l)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: k("normal", !0, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: k("half", !1, !1, !1, !!e.halfButtonSkipped),
      summary: {
        state: "pending",
        message: s.reason ?? "Role resistência para aplicar dano."
      }
    };
  if (n !== "assisted")
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: k("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: k("half", !0, !0, !1, !!e.halfButtonSkipped, s.label),
      summary: {
        state: l ? "pending" : "manual",
        message: l ? s.reason ?? "Role resistência para aplicar dano." : null
      }
    };
  if (a.kind === "none")
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: k("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: k("half", !0, !0, !1, !!e.halfButtonSkipped),
      summary: {
        state: "manual",
        message: "Sem DT confiável: escolha manualmente."
      }
    };
  if (a.kind === "pending")
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: k("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: k("half", !1, !1, !1, !!e.halfButtonSkipped),
      summary: {
        state: "pending",
        message: l ? s.reason ?? "Role resistência para aplicar dano." : null
      }
    };
  const d = a.kind === "succeeded";
  return {
    mode: n,
    canShowApplyDamage: !0,
    waitingForResistance: l,
    resistanceState: a,
    actionState: s,
    normalButton: k("normal", !d, !d, !1, !!e.normalButtonSkipped),
    halfButton: k("half", d, d, !1, !!e.halfButtonSkipped),
    summary: {
      state: d ? "resisted" : "failed",
      message: d ? `Resistiu: ${a.total} vs DT ${a.difficulty}.` : `Falhou: ${a.total} vs DT ${a.difficulty}.`
    }
  };
}
function Dg(e) {
  return e.kind === "succeeded" ? {
    state: "resisted",
    message: `Resistiu: ${e.total} vs DT ${e.difficulty}.`
  } : e.kind === "failed" ? {
    state: "failed",
    message: `Falhou: ${e.total} vs DT ${e.difficulty}.`
  } : {
    state: "manual",
    message: null
  };
}
function k(e, t, n, r, a, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: r,
    skipped: a,
    waitingLabel: o
  };
}
function vg(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function Pg() {
  try {
    return Zc();
  } catch {
    return "assisted";
  }
}
function Rs() {
  try {
    return mr();
  } catch {
    return "strict";
  }
}
const Ng = "data-paranormal-toolkit-damage-resolution-state", Ua = "data-paranormal-toolkit-damage-icon-enhanced", vr = "data-paranormal-toolkit-damage-original-label", Og = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, $s = "Outra opção escolhida";
function xg(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Zf(t, "Aplicar dano"), Mg(e, t);
}
function Mg(e, t) {
  const n = Array.from(t.querySelectorAll($e)), r = Ga(n, "normal"), a = Ga(n, "half");
  if (!r || !a) {
    Fg(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  za(r, "normal"), za(a, "half");
  const o = Lg({
    rollCard: e,
    normalButtonApplied: At(r),
    halfButtonApplied: At(a),
    normalButtonSkipped: zn(r),
    halfButtonSkipped: zn(a)
  });
  if (!o.canShowApplyDamage) {
    ja(r), ja(a), Va(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), qa(r, o.normalButton), qa(a, o.halfButton), Va(t, o.summary.state, o.summary.message);
}
function qa(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    Ug(e, t.visible), qg(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function Fg(e) {
  for (const t of e)
    zn(t) && t.remove();
}
function At(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes($s);
}
function zn(e) {
  return e.textContent?.includes($s) ?? !1;
}
function Ga(e, t) {
  const n = Og[t];
  return e.find((r) => n.test(Bg(r))) ?? null;
}
function Bg(e) {
  return [
    e.getAttribute(vr),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function za(e, t) {
  if (e.getAttribute(Ua) === "true") return;
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
  ), e.setAttribute(Ua, "true"), e.setAttribute(vr, n), e.setAttribute("aria-label", n), e.replaceChildren(r, ce(n));
}
function ja(e) {
  At(e) || e.remove();
}
function Ug(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function qg(e, t, n, r = "Role resistência") {
  if (!At(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(ce(r));
      return;
    }
    e.removeAttribute("aria-disabled"), Gg(e, n);
  }
}
function Gg(e, t) {
  const n = e.getAttribute(vr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(zg(t), ce(n)));
}
function zg(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function Va(e, t, n) {
  e.setAttribute(Ng, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(wr)?.after(a);
}
const He = "data-paranormal-toolkit-effect-icon-enhanced", ke = "data-paranormal-toolkit-effect-action-compacted", Bt = "data-paranormal-toolkit-effect-resistance-gate", Pr = "data-paranormal-toolkit-effect-section", Nr = "data-paranormal-toolkit-effect-label";
function jg(e) {
  return e.querySelector(`[${Pr}="true"]`);
}
function Vg(e) {
  const t = Wg(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? Yg(), r = ah(n, e.sourceActions, t);
  return r && n.setAttribute(Nr, r), Qg(n, t, r), nh(e.rollCard, n, e.after ?? e.fallbackAfter), rh(e.sourceActions, n), n;
}
function Hg(e, t) {
  const n = t.querySelector($e);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = Is(t, n, r), o = ks(e, n), s = Sg({
    rollCard: e,
    effectLabel: a,
    applied: xr(n, r),
    effectCanApplyOnSuccessfulResistance: o ? Re(o) === "success" || Re(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? Pi(o) : !1
  });
  if (s.applied) {
    ih(n);
    return;
  }
  if (!s.visible) {
    sh(n);
    return;
  }
  if (s.waitingForResistance) {
    lh(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    ch(n, s.compactLabel);
    return;
  }
  uh(n), Es(n, s.displayLabel);
}
function Wg(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll($e) ?? []), n = Array.from(e.existingSection?.querySelectorAll($e) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : Kg(e.rollCard, r) ?? r[0] ?? null;
}
function Kg(e, t) {
  const n = Mt(e).state, r = Di(n), a = ws(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = ks(e, o, a);
    if (s && vi(s, r)) return o;
  }
  return null;
}
function ks(e, t, n = ws(e)) {
  const r = Or(t, t.textContent?.trim() ?? ""), a = kn(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => kn(s) === a)) ?? null : null;
}
function ws(e) {
  const t = ji(Km(e));
  if (!t) return [];
  const n = Qe(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function Yg() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Pr, "true"), e;
}
function Qg(e, t, n) {
  e.setAttribute(Pr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = Zg(e), a = Xg(r);
  a.textContent = "Efeito";
  const o = Jg(e, r), s = eh(o);
  s.textContent = dh(n ?? Is(e, t, t.textContent?.trim() ?? ""));
  const l = th(o);
  t.parentElement !== l && l.append(t);
  for (const d of Array.from(l.querySelectorAll($e)))
    d.hidden = d !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !xr(t, c) && !oh(t, c) && Es(t, n ?? c);
}
function Zg(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function Xg(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function Jg(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function eh(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function th(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function nh(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function rh(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector($e)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function ah(e, t, n) {
  const r = e.getAttribute(Nr);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || Or(n, n.textContent?.trim() ?? "");
}
function Or(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && W(n) !== "efeito aplicado") return n;
  const r = Ym(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && W(a) !== "aplicado" ? a : null;
}
function xr(e, t) {
  return e.classList.contains(Yf) || W(t).includes("aplicado");
}
function oh(e, t) {
  const n = e.getAttribute(Bt);
  if (n === "pending" || n === "resisted") return !0;
  const r = kn(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function Es(e, t) {
  e.getAttribute(ke) === "true" && e.getAttribute(He) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(ke, "true"), e.setAttribute(He, "true"), e.setAttribute(Qf, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Er("✦", `${i}__button-icon--effect`),
    ce("Aplicar")
  ));
}
function ih(e) {
  e.getAttribute(ke) === "true" && W(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(ke, "true"), e.setAttribute(He, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Er("✓", `${i}__button-icon--effect-applied`),
    ce("Aplicado")
  ));
}
function Is(e, t, n) {
  const r = e.getAttribute(Nr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Or(t, n) ?? n;
}
function sh(e) {
  xr(e, e.textContent?.trim() ?? "") || e.remove();
}
function lh(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(ke), e.removeAttribute(He), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Bt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(ce(t));
}
function ch(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(ke), e.removeAttribute(He), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Bt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Er("✓", `${i}__button-icon--effect-resisted`),
    ce(t)
  );
}
function uh(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Bt), e.removeAttribute("aria-disabled");
}
function dh(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const mh = "data-paranormal-toolkit-card-layout-normalized";
function fh(e) {
  const t = ph(e.rollCard), n = gh(t);
  return bg({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function ph(e) {
  return {
    rollCard: e,
    damageSection: Ag(e),
    resistance: e.querySelector(pr),
    damageActions: Tg(e),
    effectActionSource: Rg(e),
    effectSection: jg(e)
  };
}
function gh(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(mh, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = Xe(t, "Conjuração"), c = hh({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), xg(t, a));
  const d = Vg({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: bh(n, c),
    fallbackAfter: l
  });
  return d && Hg(t, d), d;
}
function hh(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function bh(e, t) {
  return e ?? t;
}
const Cs = [0, 80, 180, 400, 900, 1600, 3e3], Ha = /* @__PURE__ */ new WeakSet();
function yh(e) {
  Ss(e), _h(e);
}
function Ss(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    Ls(t);
}
function _h(e) {
  if (!Ha.has(e)) {
    Ha.add(e);
    for (const t of Cs)
      globalThis.setTimeout(() => {
        Ss(e);
      }, t);
  }
}
function Ls(e) {
  const t = fh({
    rollCard: e,
    refreshDelaysMs: Cs,
    onRefresh: () => Ls(e)
  });
  Tp({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const Ah = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function Th(e) {
  for (const t of Array.from(e.querySelectorAll(pr)))
    Rh(t);
  yh(e);
}
function Rh(e) {
  const t = e.querySelector(Ou), n = e.querySelector(pi), r = e.querySelector(Nt), a = e.querySelector(gi);
  if (!r || !t && !n && !a) return;
  const o = $h(e, r);
  t && t.parentElement !== o && o.append(t), n && n.parentElement !== o && o.append(n), a && (a.parentElement !== e && !r.contains(a) && e.append(a), kh(a)), Sh(r), r.parentElement !== e && e.append(r);
}
function $h(e, t) {
  const n = e.querySelector(`.${ba}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(ba), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function kh(e) {
  const t = wh(e.textContent ?? "");
  t && (e.setAttribute(Ah, "true"), e.replaceChildren(Ch(t)));
}
function wh(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = Eh(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function Eh(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: Ih(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function Ih(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function Ch(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = Lh(e);
  return r && t.append(r), t;
}
function Sh(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = Mt(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const r = n.kind === "succeeded" ? "succeeded" : "failed", a = r === "succeeded" ? "✓" : "✕", o = r === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${r}`), e.textContent = `${n.total} ${a}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function Lh(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of Dh(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function Dh(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Wa(e, "highest") : n.includes("kl") ? Wa(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Wa(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function Ka(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Mr() {
  const e = globalThis.game;
  return Ut(e) ? e : null;
}
function N(e, t) {
  const n = vh(e, t);
  return ht(n);
}
function vh(e, t) {
  return t.split(".").reduce((n, r) => Ut(n) ? n[r] : null, e);
}
function Ph(e, t) {
  const n = e.indexOf(":");
  return n < 0 || We(e.slice(0, n)) !== We(t) ? null : Se(e.slice(n + 1));
}
function ht(e) {
  return typeof e == "string" ? Se(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Ut(e) {
  return !!e && typeof e == "object";
}
function Nh(e) {
  return typeof e == "string";
}
function qt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Se(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function We(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function jn(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function K(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function Ds(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function Oh(e) {
  for (const t of Array.from(e.querySelectorAll(vu))) {
    const n = Gh(t);
    xh(t), n && (Mh(t, n), Fh(t, n));
  }
}
function xh(e) {
  for (const t of Array.from(e.querySelectorAll(Pu)))
    t.remove();
}
function Mh(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(fi) ?? null, a = r?.querySelector(Du) ?? null, o = r ?? e, s = o.querySelector(Fu);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = ob(t.elementTone), l.textContent = ab(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function Fh(e, t) {
  const n = Bh(e);
  Uh(e, n);
  const r = qh(t);
  if (r.length === 0) return;
  const a = document.createElement("div");
  a.classList.add(`${i}__ritual-metadata`);
  for (const s of r) {
    const l = document.createElement("span");
    l.classList.add(`${i}__ritual-metadata-chip`), l.textContent = s, a.append(l);
  }
  if (n) {
    const s = n.querySelector(`.${i}__summary`);
    if (s?.parentElement === n) {
      s.insertAdjacentElement("afterend", a);
      return;
    }
    n.append(a);
    return;
  }
  const o = e.querySelector(hi);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function Bh(e) {
  return e.closest(`.${i}`)?.querySelector(fi) ?? null;
}
function Uh(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(Bu)))
      a.remove();
}
function qh(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${jn(e.target)}` : null,
    e.duration ? `Duração: ${jn(e.duration)}` : null,
    e.resistance ? `Resistência: ${Ds(e.resistance)}` : null
  ].filter(qt);
}
function Gh(e) {
  const t = zh(e), n = Yh(e), a = (t ? Kh(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = Fr(N(a, "element")), l = q("op.elementChoices", s) ?? Ya(te(o, "Elemento")) ?? Ya(n.damageType), c = s ?? ib(l), d = N(a, "circle") ?? te(o, "Círculo"), m = Xh(a) ?? te(o, "Alvo"), b = nb(a, "duration", "op.durationChoices") ?? te(o, "Duração"), T = Qh(e) ?? eb(a) ?? te(o, "Resistência"), A = Zh(o) ?? n.cost, g = {
    elementLabel: l,
    elementTone: c,
    circle: d,
    cost: A,
    target: m,
    duration: b,
    resistance: T
  };
  return rb(g) ? g : null;
}
function zh(e) {
  const t = jh(e);
  if (!t) return null;
  const n = t.getFlag?.(u, Pt), r = Hh(n);
  if (r.length === 0) return null;
  const a = Vh(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function jh(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Mr()?.messages?.get?.(n) ?? null : null;
}
function Vh(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${ha}]`))) {
    const a = r.getAttribute(ha)?.trim();
    a && n.add(a);
  }
  return n;
}
function Hh(e) {
  if (!Ut(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Wh).filter((n) => n !== null) : [];
}
function Wh(e) {
  return Ut(e) ? {
    pendingId: ht(e.pendingId),
    actorId: ht(e.actorId),
    itemId: ht(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(Nh) : []
  } : null;
}
function Kh(e) {
  if (!e.itemId) return null;
  const t = Mr(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function Yh(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(Nu))) {
    const a = Se(r.textContent);
    if (!a) continue;
    const o = Ph(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function Qh(e) {
  const t = Se(e.querySelector(pi)?.textContent);
  return t ? Ds(t) : null;
}
function te(e, t) {
  const n = We(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || We(r.slice(0, a)) !== n))
      return Se(r.slice(a + 1));
  }
  return null;
}
function Zh(e) {
  const t = te(e, "Custo") ?? te(e, "PE");
  return t || (e.map(Se).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Xh(e) {
  const t = N(e, "target");
  if (!t) return null;
  if (t === "area")
    return Jh(e) ?? q("op.targetChoices", t) ?? "Área";
  const n = q("op.targetChoices", t) ?? K(t);
  return [t === "people" || t === "creatures" ? N(e, "targetQtd") : null, n].filter(qt).join(" ");
}
function Jh(e) {
  const t = N(e, "area.name"), n = N(e, "area.size"), r = N(e, "area.type"), a = t ? q("op.areaChoices", t) ?? K(t) : null, o = r ? q("op.areaTypeChoices", r) ?? K(r) : null;
  return a ? n ? o ? `${a} ${n}m ${jn(o)}` : `${a} ${n}m` : a : null;
}
function eb(e) {
  const t = N(e, "skillResis"), n = N(e, "resistance");
  if (!t || !n) return null;
  const r = q("op.skill", t) ?? K(t), a = tb(n);
  return [r, a].filter(qt).join(" ");
}
function tb(e) {
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
      return q("op.resistanceChoices", e) ?? K(e);
  }
}
function nb(e, t, n) {
  const r = N(e, t);
  return r ? q(n, r) ?? K(r) : null;
}
function rb(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function ab(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function ob(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(qt).join(" ");
}
function Fr(e) {
  const t = We(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function Ya(e) {
  const t = Fr(e);
  return t ? q("op.elementChoices", t) ?? K(t) : e ? K(e) : null;
}
function ib(e) {
  return Fr(e);
}
function q(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Mr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const Qa = "data-paranormal-toolkit-dice-toggle-enhanced";
function sb(e) {
  for (const t of Array.from(e.querySelectorAll(bi)))
    vs(t);
}
function lb(e) {
  const t = Ns(e.target);
  if (!t) return;
  const n = Br(t);
  n && (e.preventDefault(), Ps(n, t));
}
function cb(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = Ns(e.target);
  if (!t) return;
  const n = Br(t);
  n && (e.preventDefault(), Ps(n, t));
}
function vs(e) {
  const t = e.querySelector(Ot);
  if (!t) return;
  const n = e.querySelector(hr);
  if (n && n.getAttribute(Qa) !== "true" && (n.setAttribute(Qa, "true"), n.classList.add(br), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function Ps(e, t) {
  const n = e.querySelector(Ot);
  if (!n) return;
  const r = !e.classList.contains(gr);
  ub(e, t, n, r);
}
function ub(e, t, n, r) {
  e.classList.toggle(gr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function Ns(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(hr);
  if (!t) return null;
  const n = Br(t);
  return n ? (vs(n), t.classList.contains(br) ? t : null) : null;
}
function Br(e) {
  const t = e.closest(bi);
  return t && t.querySelector(Ot) ? t : null;
}
const Za = `${u}-workflow-dice-toggle-styles`;
function db() {
  if (document.getElementById(Za)) return;
  const e = document.createElement("style");
  e.id = Za, e.textContent = `
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

.${i}__resistance > .${i}__resistance-roll-button--succeeded {
  border-color: rgba(34, 116, 70, 0.34);
  background: rgba(52, 168, 83, 0.12);
  color: #1f6f43;
}

.${i}__resistance > .${i}__resistance-roll-button--failed {
  border-color: rgba(150, 45, 52, 0.34);
  background: rgba(189, 54, 62, 0.12);
  color: #8f2f36;
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
const mb = [0, 100, 500, 1500, 3e3];
let Xa = !1, an = null;
function fb() {
  if (!Xa) {
    Xa = !0, db(), Hooks.on("renderChatMessageHTML", (e, t) => {
      qe(Ka(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      qe(Ka(t));
    }), Hooks.once("ready", () => {
      qe(document), pb();
    }), document.addEventListener("click", lb), document.addEventListener("keydown", cb);
    for (const e of mb)
      globalThis.setTimeout(() => qe(document), e);
  }
}
function pb() {
  an || !document.body || (an = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && qe(n);
  }), an.observe(document.body, { childList: !0, subtree: !0 }));
}
function qe(e) {
  e && (rd(e), Oh(e), Th(e), sb(e), Yu(e));
}
function gb() {
  fb();
}
const hb = "data-paranormal-toolkit-action-section", bb = "ritual-log", yb = ".paranormal-toolkit-item-use-prompt__actions", _b = ".paranormal-toolkit-item-use-prompt__actions-title", Ab = [0, 100, 500, 1500];
let Ja = !1;
function Tb() {
  if (Ja) return;
  const e = (t, n) => {
    eo(wb(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), eo(document), Ja = !0;
}
function eo(e) {
  for (const t of Ab)
    globalThis.setTimeout(() => Rb(e), t);
}
function Rb(e) {
  $b(e), kb(e);
}
function $b(e) {
  for (const t of e.querySelectorAll(
    `[${hb}="${bb}"]`
  ))
    t.remove();
}
function kb(e) {
  for (const t of e.querySelectorAll(yb)) {
    if (to(t.querySelector(_b)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => to(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function wb(e) {
  if (e instanceof HTMLElement || Eb(e))
    return e;
  if (Ib(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function Eb(e) {
  return e instanceof HTMLElement;
}
function Ib(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function to(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Ge = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, Os = {
  PV: "system.attributes.hp"
}, Vn = {
  PV: [Ge.PV, Os.PV],
  SAN: [Ge.SAN],
  PE: [Ge.PE],
  PD: [Ge.PD]
}, Hn = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class Cb {
  getResource(t, n) {
    const r = no(t, n);
    if (!r.ok)
      return p(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), d = ao(t, n, o, l, "valor atual");
    if (d) return p(d);
    const m = ao(t, n, s, c, "valor máximo");
    return m ? p(m) : y({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = no(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function no(e, t) {
  const n = Sb(e.type, t);
  if (n && ro(e, n))
    return y(n);
  const r = Vn[t].find(
    (a) => ro(e, a)
  );
  return r ? y(r) : p({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: Lb(e, t),
    path: Vn[t].join(" | ")
  });
}
function Sb(e, t) {
  return e === "threat" ? Os[t] ?? null : e === "agent" ? Ge[t] : null;
}
function ro(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function Lb(e, t) {
  const n = e.type ?? "unknown", r = Vn[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function ao(e, t, n, r, a) {
  return r == null ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: `Path de ${a} de ${t} não encontrado: ${n}.`,
    path: n,
    value: r
  } : typeof r != "number" || !Number.isFinite(r) ? {
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "invalid-resource-value",
    message: `Valor inválido para ${a} de ${t} em ${n}.`,
    path: n,
    value: r
  } : null;
}
class Db {
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
      const s = Hn.ritualItem.circleCandidates;
      return p({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = vb(a);
    return o ? y(o) : p({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of Hn.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function vb(e) {
  if (oo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (oo(n))
      return n;
  }
  return null;
}
function oo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const Pb = "dice-so-nice";
async function xs(e) {
  if (!Nb() || !Ob()) return;
  const t = xb();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      f.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function Nb() {
  try {
    return Lu().enabled;
  } catch {
    return !1;
  }
}
function Ob() {
  return game.modules?.get?.(Pb)?.active === !0;
}
function xb() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const io = "occultism";
class Ms {
  getDifficulty(t) {
    return Mb(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await Bb(t, io);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await xs(r);
    const a = Gb(r);
    return {
      skill: io,
      skillLabel: "Ocultismo",
      roll: r,
      formula: qb(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: zb(r)
    };
  }
}
function Mb(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function Fb(e) {
  return new Ms().rollCastingCheck(e);
}
async function Bb(e, t) {
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
  return Ub(r);
}
function Ub(e) {
  return so(e) ? e : Array.isArray(e) ? e.find(so) ?? null : null;
}
function so(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function qb(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Gb(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function zb(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(jb);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function jb(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Vb = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Hb {
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
    const r = n.value, a = Wb(t.ritual, r);
    return a.ok ? a.value ? y(a.value) : y({
      resource: "PE",
      amount: Vb[r],
      source: "default-by-circle",
      circle: r
    }) : p(a.error);
  }
}
function Wb(e, t) {
  const n = e.getFlag(u, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Kb(n) ? {
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
function Kb(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const on = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function Yb(e) {
  if (!ty(e.item)) return null;
  const t = Wn(e.actor) ? e.actor : Qb(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Xb(e.token) ?? Zb(t),
    targets: dr(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Qb(e) {
  const t = e;
  return Wn(t.actor) ? t.actor : Wn(e.parent) ? e.parent : null;
}
function Zb(e) {
  const t = Jb(e) ?? ey(e);
  return t ? Fs(t) : null;
}
function Xb(e) {
  return Kn(e) ? Fs(e) : null;
}
function Jb(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return Kn(n) ? n : (t.getActiveTokens?.() ?? []).find(Kn) ?? null;
}
function ey(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function Fs(e) {
  const t = e.actor ?? null;
  return {
    tokenId: sn(e.id),
    actorId: sn(t?.id),
    sceneId: sn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function ty(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Wn(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function Kn(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function sn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class ny {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(on.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, f.info(`${on.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = Yb(ry(t));
    if (!n) {
      f.warn(`${on.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function ry(e) {
  return e && typeof e == "object" ? e : {};
}
class ay {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return ln("missing-item-patch");
    if (t.type !== "ritual") return ln("unsupported-item-type");
    const a = oy(r);
    return Object.keys(a).length === 0 ? ln("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function oy(e) {
  const t = {};
  E(t, "name", e.name), E(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (E(t, "system.circle", n.circle), E(t, "system.element", n.element), E(t, "system.target", n.target), E(t, "system.targetQtd", n.targetQuantity), E(t, "system.execution", n.execution), E(t, "system.range", n.range), E(t, "system.duration", n.duration), E(t, "system.skillResis", n.resistanceSkill), E(t, "system.resistance", n.resistance), E(t, "system.studentForm", n.studentForm), E(t, "system.trueForm", n.trueForm)), t;
}
function E(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function ln(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class iy {
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
    return this.getNumber(t, Hn.ritual.dt, 0);
  }
  getResources(t) {
    const n = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    }, r = [];
    for (const a of ["PV", "SAN", "PE", "PD"]) {
      const o = this.resourceAdapter.getResource(t, a);
      o.ok ? n[a] = o.value : r.push(o.error);
    }
    return { values: n, errors: r };
  }
  getNumber(t, n, r) {
    const a = foundry.utils.getProperty(t, n);
    return typeof a == "number" && Number.isFinite(a) ? a : r;
  }
}
class sy {
  async applyPreset(t, n, r = {}) {
    const a = {
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
    return await this.writeAutomationFlag(t, a), a;
  }
  async applyManualDefinition(t, n, r = n.label) {
    const a = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: r,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        appliedBy: game.user?.id ?? null
      },
      definition: n
    };
    return await this.writeAutomationFlag(t, a), a;
  }
  async clear(t) {
    await t.unsetFlag(u, "automation");
  }
  async writeAutomationFlag(t, n) {
    await this.clear(t), await t.setFlag(u, "automation", n);
  }
}
class ly {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = cy(t);
    return n.ok ? this.presets.has(t.id) ? p({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, cn(t)), y(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const a = this.register(r);
      if (!a.ok)
        return a;
      n.push(a.value);
    }
    return y(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? cn(n) : null;
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
    return Array.from(this.presets.values()).map(cn);
  }
  findForItem(t) {
    return this.list().map((n) => uy(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function cy(e) {
  return !un(e.id) || !un(e.version) || !un(e.label) ? p({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? p({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : y(e);
}
function uy(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = dy(a, t);
    if (!o.matches)
      return null;
    r += o.score, n.push(o.reason);
  }
  return {
    preset: e,
    score: r,
    reasons: n
  };
}
function dy(e, t) {
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
      const n = lo(t.name), r = e.names.map(lo).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = my(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function lo(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function my(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function cn(e) {
  return structuredClone(e);
}
function un(e) {
  return typeof e == "string" && e.length > 0;
}
function Tt(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? p({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : y(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = Gt(e.amountFrom);
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
    const a = Math.trunc(r.total);
    return !Number.isInteger(a) || a <= 0 ? p({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : y(a);
  }
  return p({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Gt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function fy(e, t, n) {
  if (!co(e.id) || !co(e.formula))
    return p({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(e.formula), a = await Promise.resolve(r.evaluate()), o = a.total;
    if (typeof o != "number" || !Number.isFinite(o))
      return p({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await xs(a);
    const l = {
      ...n.rollRequests[e.id] ?? Bs(e, t),
      total: o,
      roll: a
    };
    return n.rolls[e.id] = l, y(l);
  } catch (r) {
    return p({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function Bs(e, t) {
  const n = e.intent ?? py(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function py(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function co(e) {
  return typeof e == "string" && e.length > 0;
}
async function Rt(e, t, n, r, a) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? ut(t, n, r, a) : e.spend(t, n, a);
    case "damage":
      return n !== "PV" && n !== "SAN" ? ut(t, n, r, a) : e.damage(t, n, a);
    case "heal":
      return n !== "PV" ? ut(t, n, r, a) : e.heal(t, n, a);
    case "recover":
      return n !== "SAN" ? ut(t, n, r, a) : e.recover(t, n, a);
  }
}
function ut(e, t, n, r) {
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
function gy(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = hy(t, n, r, a);
    n.damageInstances.push(s), o.emit("afterDamageResolution", n, {
      stepIndex: a,
      step: t,
      damage: s,
      resourceTransaction: r,
      metadata: {
        rawAmount: s.rawAmount,
        finalAmount: s.finalAmount,
        appliedAmount: s.appliedAmount,
        damageType: s.damageType
      }
    }), o.emit("afterApplyDamage", n, {
      stepIndex: a,
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
    const s = by(t, n, r, a);
    n.healingInstances.push(s), o.emit("afterApplyHealing", n, {
      stepIndex: a,
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
function hy(e, t, n, r) {
  const a = Gt(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: Us(t.id, "damage", r, t.damageInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: a ?? void 0,
    damageType: o?.damageType,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function by(e, t, n, r) {
  const a = Gt(e.amountFrom);
  return {
    id: Us(t.id, "healing", r, t.healingInstances.length),
    source: t.item.type === "ritual" ? "ritual" : "automation",
    sourceId: t.item.id ?? null,
    sourceName: t.item.name ?? "Item sem nome",
    targetActorId: n.actorId,
    targetActorName: n.actorName,
    rollId: a ?? void 0,
    rawAmount: n.requestedAmount,
    finalAmount: n.requestedAmount,
    appliedAmount: n.appliedAmount,
    tags: ["workflow", "resource", e.resource]
  };
}
function Us(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function yy(e, t, n) {
  const r = Gt(e.amountFrom), a = r ? t.rolls[r] : void 0;
  return {
    actorSelector: e.actor,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    amountFrom: e.amountFrom,
    rollId: r,
    rollIntent: a?.intent,
    damageType: a?.damageType
  };
}
function _y(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), qs("before", e), uo("before", e), uo("resolve", e);
}
function Ay(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), qs("apply", e);
}
function Ty(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function qs(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = Ry(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function uo(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function Ry(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function $y(e, t, n) {
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
async function ky(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return wy(e, t);
    case "spendRitualCost":
      return Ey(e, t);
  }
}
async function wy(e, t) {
  const { context: n, resources: r } = e, a = Tt(t, n);
  return a.ok ? Gs(await r.spend(n.sourceActor, t.resource, a.value), n) : p(a.error);
}
async function Ey(e, t) {
  const { context: n, resources: r, ritualCosts: a } = e, o = a.getCost({
    actor: n.sourceActor,
    ritual: n.item
  });
  if (!o.ok)
    return p({
      reason: "ritual-cost-failed",
      message: o.error.message,
      cause: o.error
    });
  const s = o.value;
  return n.ritualCosts.push({
    ...s,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), Gs(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function Gs(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), y(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), p({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function Iy(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = Cy(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function Cy(e) {
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
class Sy {
  constructor(t, n, r, a) {
    this.resources = t, this.ritualCosts = n, this.messages = r, this.lifecycle = a;
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
    for (const [r, a] of t.steps.entries()) {
      const o = await this.runStep(a, n, r);
      if (!o.ok)
        return o;
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
        return Iy({
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
    const a = await ky({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = Bs(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), y(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await fy(t, r, n);
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = Tt(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = yy(t, n, a.value);
    _y({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), Ay({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
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
      const c = await Rt(this.resources, l, t.resource, t.operation, a.value), d = this.handleResourceOperationResult(c, n, r, t);
      if (!d.ok)
        return d;
      gy({
        step: t,
        context: n,
        transaction: d.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return Ty({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), y(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = Tt(t, n);
    if (!a.ok)
      return p({ ...a.error, stepIndex: r, step: t, context: n });
    const o = this.resolveActors(t.actor, n);
    if (o.length === 0)
      return p({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const s of o) {
      const l = await Rt(this.resources, s, t.resource, t.operation, a.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return y(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await $y(this.messages, t, n);
    return a.ok ? y(void 0) : p({ ...a.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, a) {
    return t.ok ? (n.resourceTransactions.push(t.value), y(t.value)) : p({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: a,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, a, o, s) {
    const l = Ly(t, n.intent);
    l && this.lifecycle.emit(l, r, {
      stepIndex: a,
      step: o,
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
function Ly(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class Dy {
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
  async execute(t, n, r, a) {
    if (!Number.isInteger(a) || a <= 0)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: a
      });
    const o = this.adapter.getResource(t, n);
    if (!o.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: o.error.reason,
        message: o.error.message,
        requestedAmount: a,
        path: o.error.path,
        value: o.error.value
      });
    const s = o.value, l = this.calculate(r, s, a);
    if (!l.ok)
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: l.error.reason,
        message: l.error.message,
        requestedAmount: a,
        current: s.value,
        required: a
      });
    const { afterValue: c, appliedAmount: d } = l.value, m = {
      value: c,
      max: s.max
    };
    try {
      c !== s.value && await this.adapter.updateResourceValue(t, n, c);
    } catch (b) {
      return p({
        actor: t,
        actorId: t.id ?? null,
        actorName: t.name ?? "Ator sem nome",
        resource: n,
        operation: r,
        reason: "update-failed",
        message: `Falha ao atualizar ${n} no ator.`,
        requestedAmount: a,
        current: s.value,
        required: a,
        cause: b
      });
    }
    return y({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: a,
      appliedAmount: d,
      before: s,
      after: m
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
        const a = Math.max(0, n.value - r);
        return y({
          afterValue: a,
          appliedAmount: n.value - a
        });
      }
      case "heal":
      case "recover": {
        const a = Math.min(n.max, n.value + r);
        return y({
          afterValue: a,
          appliedAmount: a - n.value
        });
      }
    }
  }
}
class vy {
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
function zs(e) {
  return {
    id: Py(),
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
function Py() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class Ny {
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
    return re(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = zs(n);
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
    const a = await this.automation.run(t, r);
    return a.ok ? (this.hooks.emit("completed", r), a) : (this.emitFailed(r, a.error), a);
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
class Oy {
  emit(t, n, r = {}) {
    const a = {
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
    }), Hooks.callAll(`${u}.workflow.${t}`, a), Hooks.callAll(`${u}.workflow.phase`, a), a;
  }
}
class xy {
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
    const n = Tn();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: My(),
      flags: {
        ...t.flags,
        [u]: {
          ...Fy(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && f.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = Tn();
    if (!r.enabled)
      return;
    const a = n.notification ?? mo(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = mo(n);
    switch (t) {
      case "info":
        f.info(r, n.data ?? "");
        return;
      case "warn":
        f.warn(r, n.data ?? "");
        return;
      case "error":
        f.error(r, n.data ?? "");
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
function mo(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function My() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function Fy(e) {
  const t = e?.[u];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const By = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", js = `${u}-inline-roll-neutralized`, Uy = `${u}-inline-roll-notice`, Ur = `data-${u}-inline-roll-neutralized`, fo = `data-${u}-inline-roll-notice`, qy = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function po(e) {
  const t = t_(e.message), n = await Gy(e.message), r = zy(t);
  return n.replacementCount + r.replacementCount > 0 && f.info("Rolagens inline neutralizadas para item automatizado.", {
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
async function Gy(e) {
  const t = Xy(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = jy(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await Jy(t, n.content), replacementCount: n.replacementCount };
}
function zy(e) {
  const t = e ? e_(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = Vs(t);
  return n > 0 && Hs(Yy(t)), { replacementCount: n };
}
function jy(e) {
  const t = Vy(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = Vs(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (Hs(n.content), { content: n.innerHTML, replacementCount: a });
}
function Vy(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, Wy(a.trim()))), replacementCount: t };
}
function Vs(e) {
  const t = Hy(e);
  for (const n of t)
    n.replaceWith(Ky(Qy(n)));
  return t.length;
}
function Hy(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(By))
    n.getAttribute(Ur) !== "true" && t.add(n);
  return Array.from(t);
}
function Wy(e) {
  return `<span class="${js}" ${Ur}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${n_(e)}</span>`;
}
function Ky(e) {
  const t = document.createElement("span");
  return t.classList.add(js), t.setAttribute(Ur, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Hs(e) {
  if (e.querySelector?.(`[${fo}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add(Uy), t.setAttribute(fo, "true"), t.textContent = qy, e.append(t);
}
function Yy(e) {
  return e.querySelector(".message-content") ?? e;
}
function Qy(e) {
  const n = e.getAttribute("data-formula") ?? Zy(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function Zy(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function Xy(e) {
  return e && typeof e == "object" ? e : null;
}
async function Jy(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return f.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function e_(e) {
  const t = r_(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function t_(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function n_(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function r_(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const $t = "ritualRollConfig", _e = "ritual-roll";
function zt() {
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
function Ws(e) {
  const t = e.getFlag(u, $t);
  return Yn(t);
}
function Ks(e) {
  return Ws(e) ?? zt();
}
async function a_(e, t) {
  const n = Yn(t) ?? Yn({
    ...zt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(u, $t, n), n;
}
async function o_(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, u, $t));
    return;
  }
  await e.setFlag(u, $t, null);
}
function Yn(e) {
  if (!jt(e)) return null;
  const t = f_(e.intent);
  if (!t) return null;
  const n = zt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: kt(e.damageType),
    utilityLabel: kt(e.utilityLabel) ?? n.utilityLabel,
    note: qr(e.note),
    forms: p_(e.forms)
  };
}
function i_(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function s_(e) {
  const t = Ws(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = l_(t, n), a = [
    { type: "spendRitualCost" },
    r,
    ...c_(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: a,
    ritualForms: d_(e, t),
    resistance: t.intent === "damage" ? Ys(e) : void 0
  };
}
function l_(e, t) {
  const n = {
    type: "rollFormula",
    id: _e,
    formula: t,
    intent: m_(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function c_(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${_e}.total`,
          ...u_(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${_e}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function u_(e) {
  return e ? { damageType: e } : {};
}
function d_(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [_e]: n
      }
    }
  };
  return go(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [_e]: t.forms.discente.formula.trim()
    }
  }), go(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [_e]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Ys(e) {
  const t = Qs(e), n = kt(t.skillResis), r = kt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const a = g_(n);
  return {
    skill: n,
    label: a,
    effect: "reducesByHalf",
    summary: `${a} reduz à metade`
  };
}
function m_(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function f_(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function p_(e) {
  const t = zt();
  return jt(e) ? {
    base: dn(e.base),
    discente: dn(e.discente),
    verdadeiro: dn(e.verdadeiro)
  } : t.forms;
}
function dn(e) {
  return jt(e) ? { formula: qr(e.formula) } : { formula: "" };
}
function go(e, t) {
  const n = Qs(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return h_(r);
}
function Qs(e) {
  const t = e.system;
  return jt(t) ? t : {};
}
function g_(e) {
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
function h_(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function qr(e) {
  return typeof e == "string" ? e.trim() : "";
}
function kt(e) {
  const t = qr(e);
  return t.length > 0 ? t : null;
}
function jt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function b_(e) {
  switch (y_(e)) {
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
      return __(String(e ?? ""));
  }
}
function y_(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function __(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function A_(e) {
  return {
    header: {
      eyebrow: or,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: w_(e.ritual)
    },
    forms: e.variantOptions.map((t) => T_(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome",
      targetText: e.targetNames.length > 0 ? e.targetNames.join(", ") : "Nenhum alvo selecionado"
    },
    automation: k_(e.automationStatus ?? "assisted")
  };
}
function T_(e, t) {
  const n = R_(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? $_(t) : "—",
    details: n
  };
}
function R_(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function $_(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function k_(e) {
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
function w_(e) {
  const t = e.system, n = [I_(t?.element), E_(t?.circle)].filter(L_);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function E_(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function I_(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (C_(e)) {
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
      return S_(e);
  }
}
function C_(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function S_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function L_(e) {
  return typeof e == "string" && e.length > 0;
}
const Zs = ["base", "discente", "verdadeiro"];
function Xs(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function wt(e) {
  return typeof e == "string" && Zs.includes(e);
}
const { ApplicationV2: D_ } = foundry.applications.api;
class je extends D_ {
  constructor(t, n) {
    super({
      id: `${u}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = A_(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
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
      cast: je.onCast,
      cancel: je.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new je(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    P_(a, (o) => {
      this.selectedVariant = o;
    }), N_(a, (o) => {
      this.spendResource = o;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${I(this.model.header.eyebrow)}</p>
        <div>
          <h2>${I(this.model.header.title)}</h2>
          <p>${I(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(v_).join("")}
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
          <div><dt>Custo base</dt><dd>${I(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${I(this.model.cost.casterName)}</dd></div>
          <div><dt>Alvos</dt><dd>${I(this.model.cost.targetText)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__automation paranormal-toolkit-ritual-cast__automation--${this.model.automation.status}">
        <h3>Automação</h3>
        <p><strong>${I(this.model.automation.title)}</strong></p>
        <p>${I(this.model.automation.description)}</p>
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
    const n = M_(t), r = O_(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function v_(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", a = e.details.map((o) => `<span>${I(o)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${I(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${I(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${I(e.label)}</strong>
        <em>${I(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${a}</span>
    </label>
  `;
}
function P_(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => ho(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), ho(e, a, t));
    });
  const r = Js(e);
  r && t(r);
}
function ho(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !wt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Js(e));
}
function Js(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && wt(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function N_(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function O_(e, t, n) {
  const r = x_(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t;
  return {
    variant: r,
    spendResource: a
  };
}
function x_(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (wt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return wt(n) ? n : null;
}
function M_(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function I(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function F_(e) {
  return je.request(e);
}
const Gr = {
  label: "Padrão"
}, B_ = {
  label: "Discente",
  extraCost: 2
}, U_ = {
  label: "Verdadeiro",
  extraCost: 5
};
class q_ {
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
    const r = this.resolveCostPreview(t), a = LA(n), o = IA(
      n,
      t.item,
      r,
      a
    ), s = await F_({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((S) => S.name),
      cost: r,
      defaultSpendResource: xA(n),
      variantOptions: o,
      automationStatus: a ? "generic" : "assisted"
    });
    if (!s)
      return { status: "cancelled" };
    const l = G_(s), c = vA(
      n,
      t.item,
      l.variant,
      a
    ), d = si();
    let m = null;
    if (d) {
      const S = await j_(
        this.resources,
        t.actor,
        l,
        c,
        r
      );
      if (!S.ok)
        return {
          status: "failed",
          reason: S.reason,
          message: S.message
        };
      try {
        m = await Fb(
          t.actor
        );
      } catch (L) {
        return {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: L instanceof Error ? L.message : "Não foi possível rolar Ocultismo para conjurar o ritual.",
          cause: L
        };
      }
    }
    const b = z_(
      n,
      l,
      c,
      r,
      {
        includeCostSteps: !d
      }
    );
    if (b.steps.length === 0) {
      const S = DA(
        t,
        l
      ), L = yo(
        n,
        t
      ), Oe = bo(
        t.actor,
        m,
        c,
        r
      ), rt = _o(
        n,
        l,
        c,
        r,
        S,
        t,
        m
      );
      if (!L.ok)
        return {
          status: "failed",
          reason: L.reason,
          message: L.message
        };
      const ea = [
        ...Oe,
        ...L.actions
      ];
      return ea.length > 0 ? {
        status: "ready",
        workflowContext: S,
        actions: ea,
        summaryLines: rt
      } : {
        status: "completed-without-actions",
        workflowContext: S,
        summaryLines: rt
      };
    }
    const T = await this.workflow.runAutomation(b, {
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
    const A = T.value.context, g = Q_(
      n,
      t,
      A
    ), j = yo(
      n,
      t
    ), Pe = bo(
      t.actor,
      m,
      c,
      r
    ), Ne = _o(
      n,
      l,
      c,
      r,
      A,
      t,
      m
    );
    if (!g.ok)
      return {
        status: "failed",
        reason: g.reason,
        message: g.message
      };
    if (!j.ok)
      return {
        status: "failed",
        reason: j.reason,
        message: j.message
      };
    const ue = [
      ...Pe,
      ...g.actions,
      ...j.actions
    ];
    return ue.length === 0 ? {
      status: "completed-without-actions",
      workflowContext: A,
      summaryLines: Ne
    } : {
      status: "ready",
      workflowContext: A,
      actions: ue,
      summaryLines: Ne
    };
  }
  async applyAction(t) {
    return Rt(
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
function G_(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0
  };
}
function z_(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || jr(l) && (!a.includeCostSteps || !s) || o.push(V_(l, n));
  return a.includeCostSteps && s && r && MA(n.extraCost) && o.push({
    type: "spendResource",
    actor: "self",
    resource: r.resource,
    amount: n.extraCost
  }), {
    ...e,
    label: `${e.label} · Conjuração assistida`,
    steps: o
  };
}
async function j_(e, t, n, r, a) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = et(a, r);
  if (!o)
    return {
      ok: !1,
      reason: "ritual-cost-unresolved",
      message: "Não foi possível resolver o custo do ritual."
    };
  if (o.amount <= 0) return { ok: !0 };
  const s = await e.spend(
    t,
    o.resource,
    o.amount
  );
  return s.ok ? { ok: !0 } : {
    ok: !1,
    reason: s.error.reason,
    message: s.error.message
  };
}
function V_(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function bo(e, t, n, r) {
  if (!t || t.success) return [];
  const a = et(r, n);
  if (!a || a.amount <= 0) return [];
  const o = e.name ?? "Ator sem nome";
  return [
    {
      kind: "resource-operation",
      actor: e,
      actorName: o,
      resource: "SAN",
      operation: "damage",
      amount: a.amount,
      label: `Aplicar ${a.amount} SAN`,
      executedLabel: "✓ Dano na SAN aplicado",
      actionSectionId: "casting-backlash",
      actionSectionTitle: "Dano na sanidade"
    }
  ];
}
function yo(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = zr(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = $i(o);
      n.push(
        H_(
          r,
          o,
          t.item,
          s
        )
      );
    }
  }
  return { ok: !0, actions: n };
}
function H_(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? Y_(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: W_(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: K_(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function W_(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function K_(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function Y_(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function Q_(e, t, n) {
  const r = [], a = /* @__PURE__ */ new Map();
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const s = Tt(o, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = zr(o.actor, t);
    if (l.length === 0) {
      if (o.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const c of l) {
      if (Z_(o)) {
        X_(
          a,
          c,
          J_(o, n, s.value)
        );
        continue;
      }
      r.push(tA(o, c, s.value));
    }
  }
  for (const o of a.values())
    r.push(
      ...eA(
        e,
        t.item,
        o.actor,
        o.entries
      )
    );
  return { ok: !0, actions: r };
}
function Z_(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function X_(e, t, n) {
  const r = oA(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function J_(e, t, n) {
  const r = iA(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function eA(e, t, n, r) {
  const a = uA(e), o = a.length > 1 ? fA() : void 0;
  return a.map((s) => {
    const l = r.map(
      (d, m) => {
        const b = dA(d.amount, s);
        return {
          id: nA(d, s, m),
          amount: b,
          damageType: d.damageType,
          sourceRollId: d.sourceRollId,
          ignoreResistance: d.step.ignoreResistance === !0
        };
      }
    ), c = l.reduce(
      (d, m) => d + m.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: l,
      label: rA(c, s, a.length > 1),
      executedLabel: aA(
        n.name ?? "Ator sem nome",
        s,
        a.length > 1
      ),
      choiceGroupId: o,
      choiceGroupResolvedLabel: o ? "✓ Outra opção escolhida" : void 0,
      actionSectionId: "apply-damage",
      actionSectionTitle: "Aplicar danos",
      source: "item-use.damage-action",
      originUuid: t.uuid ?? null
    };
  });
}
function tA(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = cA(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: sA(e, r, n),
    executedLabel: lA(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function nA(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function rA(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function aA(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function oA(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function iA(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function sA(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function lA(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function cA(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function uA(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function dA(e, t) {
  const n = e * t.multiplier, r = mA(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function mA(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function fA() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function zr(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function _o(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${Xs(t.variant)}`,
    bA(t, n, r),
    ...hA(s),
    ...Object.values(a.rolls).flatMap(yA),
    ...pA(e, o),
    ..._A(e.resistance),
    ...wA(n)
  ];
}
function pA(e, t) {
  return gA(e) ? zr("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function gA(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function hA(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function bA(e, t, n) {
  const r = et(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function yA(e) {
  const n = [`${EA(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = AA(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${b_(e.damageType)}`), n;
}
function _A(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function AA(e) {
  if (!e || typeof e != "object") return null;
  const t = e.terms;
  if (!Array.isArray(t)) return null;
  const n = [];
  let r = "+";
  for (const a of t) {
    if (!a || typeof a != "object") continue;
    const o = a;
    if (o.operator === "+" || o.operator === "-") {
      r = o.operator;
      continue;
    }
    const s = TA(o);
    s && (kA(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function TA(e) {
  const t = RA(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : $A(e);
}
function RA(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function $A(e) {
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
function kA(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function wA(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function EA(e) {
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
function IA(e, t, n, r) {
  return Zs.map((a) => {
    const o = el(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? Xs(a),
      enabled: s,
      details: o ? CA(o, n, r) : [],
      finalCostText: o ? SA(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function CA(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {});
  a.length > 0 ? r.push(a.join(", ")) : n && r.push("efeito manual");
  const o = et(t, e);
  return r.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), r;
}
function et(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function SA(e, t) {
  const n = et(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function LA(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(jr);
}
function DA(e, t) {
  return zs({
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
function vA(e, t, n, r) {
  return el(e, t, n, r) ?? Gr;
}
function el(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? NA(t, n) ? PA(n) : null : n === "base" ? Gr : null);
}
function PA(e) {
  switch (e) {
    case "base":
      return Gr;
    case "discente":
      return B_;
    case "verdadeiro":
      return U_;
  }
}
function NA(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return OA(foundry.utils.getProperty(e, n));
}
function OA(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function xA(e) {
  return e.steps.some(jr);
}
function jr(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function MA(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const tl = "itemUsePrompts", nl = "chatCard", Vt = "data-paranormal-toolkit-prompt-id", Ht = "data-paranormal-toolkit-pending-id", Vr = "data-paranormal-toolkit-executed-label", Qn = "data-paranormal-toolkit-choice-group", rl = "data-paranormal-toolkit-skipped-label", Et = "data-paranormal-toolkit-action-section", Ao = "data-paranormal-toolkit-detail-key", To = "data-paranormal-toolkit-roll-card", Hr = "data-paranormal-toolkit-roll-detail-toggle", al = "data-paranormal-toolkit-roll-detail-id", ol = "data-paranormal-toolkit-resistance-roll-button", il = "data-paranormal-toolkit-resistance-skill", sl = "data-paranormal-toolkit-resistance-skill-label", ll = "data-paranormal-toolkit-resistance-target-actor-id", cl = "data-paranormal-toolkit-resistance-target-name", ul = "data-paranormal-toolkit-resistance-roll-result", Ro = "data-paranormal-toolkit-system-card-replaced", FA = `[${Ht}]`, BA = `[${Hr}]`, UA = `[${ol}]`, Zn = `${u}-chat-enrichment`, h = `${u}-item-use-prompt`, qA = `${h}__actions`, $o = `${h}__details`, dl = `${h}__summary`, GA = `${h}__title`, ml = `${h}__button--executed`, ko = `${h}__roll-card`;
let wo = !1, Xn = null;
const x = /* @__PURE__ */ new Map(), zA = [0, 100, 500, 1500, 3e3], jA = 3e4, VA = [0, 100, 500, 1500, 3e3];
function HA(e) {
  if (Xn = e, wo) {
    Io(e);
    return;
  }
  const t = (n, r) => {
    pl(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), wo = !0, Io(e);
}
async function Eo(e) {
  const t = fl(e);
  x.set(e.pendingId, t), await Yr(t) || El(t), gl(e.pendingId);
}
async function WA(e) {
  const t = fl({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", x.set(e.pendingId, t), await Yr(t) || El(t), gl(e.pendingId);
}
async function mn(e, t) {
  const n = x.get(e);
  x.delete(e), n && await WT(n, t);
}
function Wr(e) {
  const t = vl();
  for (const n of t) {
    const r = z(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function KA(e, t) {
  const n = Wr(e);
  if (!n) return;
  const r = z(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await Le(n.message, r));
}
async function YA(e, t, n) {
  if (!t) return;
  const r = Wr(e);
  if (!r) return;
  const a = z(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await Le(r.message, a);
}
function fl(e) {
  const t = Y(e.context.message), n = e.context.targets.find((s) => nr(s)), r = n ? nr(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
  return {
    ...e,
    createdAt: Date.now(),
    messageId: t,
    itemId: e.context.item.id ?? null,
    actorId: e.context.actor?.id ?? null,
    itemName: e.context.item.name ?? null,
    resistanceTargetActorId: e.resistanceTargetActorId ?? a?.id ?? null,
    resistanceTargetName: o,
    resistanceRollResult: null,
    actionPayload: e.actionPayload ?? null,
    choiceGroupId: e.choiceGroupId ?? null,
    skippedLabel: e.skippedLabel ?? null,
    actionSectionId: e.actionSectionId ?? null,
    actionSectionTitle: e.actionSectionTitle ?? null,
    summary: RT(e.context),
    executed: !1
  };
}
function pl(e, t, n) {
  HT();
  const r = Kt(t);
  if (!r) return;
  const a = zT(e, r);
  a.length > 0 && It(r);
  for (const o of a)
    Jn(r, o);
  Al(r, n), er(r), tr(r);
}
function Io(e) {
  for (const t of VA)
    globalThis.setTimeout(() => {
      QA(e);
    }, t);
}
function QA(e) {
  for (const t of ZA()) {
    const n = Wt(t);
    XA(n) && pl(n, t, e);
  }
}
function ZA() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function XA(e) {
  return e ? Qr(e) ? !0 : YT(e).length > 0 : !1;
}
function gl(e) {
  const t = x.get(e);
  if (!t) return;
  const n = t.messageId ? jT(t.messageId) : null;
  if (n) {
    vo(n, t), It(n), Jn(n, t), Co(n), er(n), tr(n);
    return;
  }
  if (t.messageId) {
    ar(t);
    return;
  }
  const r = VT(t);
  if (r) {
    vo(r, t), It(r), Jn(r, t), Co(r), er(r), tr(r);
    return;
  }
  ar(t);
}
function Co(e) {
  Xn && Al(e, Xn);
}
function It(e) {
  const t = JA();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = _l(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Ro) === "true") return;
  const r = n.querySelector(`.${Zn}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Ro, "true");
}
function JA() {
  try {
    return Qc() === "replace";
  } catch {
    return !1;
  }
}
function Jn(e, t) {
  if (It(e), e.querySelector(`[${Vt}="${De(t.pendingId)}"]`)) return;
  const n = tT(e, t);
  rT(n, t);
  const r = yT(t);
  if (eT(r)) return;
  bT(n, r).append(TT(t));
}
function eT(e) {
  return bl(e.id) && !oe();
}
function hl(e) {
  const n = e.closest(`[${Et}]`)?.getAttribute(Et) ?? null;
  return bl(n) && !oe();
}
function bl(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function tT(e, t) {
  const n = e.querySelector(`.${Zn}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(Zn, h);
  const a = document.createElement("header");
  a.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(GA), s.textContent = nT(t);
  const l = document.createElement("span");
  return l.classList.add(dl), l.textContent = t.summary, a.append(o, s, l), r.append(a), kT(e).append(r), r;
}
function nT(e) {
  const t = C(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function rT(e, t) {
  const n = t.summaryLines ?? [], r = kl(n, t);
  if (r) {
    aT(e, r, t);
    return;
  }
  _T(e, n);
}
function aT(e, t, n) {
  if (e.querySelector(`[${To}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(ko, `${ko}--${t.intent}`), r.setAttribute(To, "true"), t.castingCheck && So(r, iT(t.castingCheck), n.pendingId, "casting"), oT(t) && So(r, sT(t), n.pendingId, "effect"), mT(r, t), fT(r, t, n), hT(r, t), e.append(r);
}
function oT(e) {
  return e.intent !== "casting";
}
function iT(e) {
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
function sT(e) {
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
function So(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(
    `${h}__workflow-section`,
    `${h}__workflow-section--${t.kind}`
  ), t.status && a.classList.add(`${h}__workflow-section--${t.status}`);
  const o = document.createElement("div");
  o.classList.add(`${h}__workflow-section-header`);
  const s = document.createElement("strong");
  if (s.textContent = t.title, o.append(s), t.statusLabel) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-status`), l.textContent = t.statusLabel, o.append(l);
  }
  if (a.append(o), t.description) {
    const l = document.createElement("span");
    l.classList.add(`${h}__workflow-section-description`), l.textContent = t.description, a.append(l);
  }
  lT(a, t), gT(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function lT(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = cT(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function cT(e, t) {
  const n = uT(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of dT(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function uT(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function dT(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Lo(e, "highest") : n.includes("kl") ? Lo(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Lo(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function mT(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(fR);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function fT(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = pT(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(yl(t.resistanceRollResult)), e.append(r);
}
function pT(e, t) {
  if (!e.resistanceSkill || !le()) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(Vt, t.pendingId), n.setAttribute(ol, "true"), n.setAttribute(il, e.resistanceSkill), n.setAttribute(sl, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(ll, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(cl, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(ul, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function yl(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = Rl(e), t;
}
function gT(e, t, n, r, a) {
  const o = t.filter((d) => d.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(Hr, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(al, s), c.hidden = !0;
  for (const d of o) {
    const m = document.createElement("dt");
    m.textContent = d.label;
    const b = document.createElement("dd");
    b.textContent = d.value, c.append(m, b);
  }
  e.append(l, c);
}
function hT(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function bT(e, t) {
  const n = `[${Et}="${De(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(qA), a.setAttribute(Et, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function yT(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = kl(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function _T(e, t) {
  if (t.length === 0) return;
  const n = AT(e);
  for (const r of t) {
    const a = pR(r);
    if (n.querySelector(`[${Ao}="${De(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(Ao, a), n.append(o);
  }
}
function AT(e) {
  const t = e.querySelector(`.${$o}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add($o), e.append(n), n;
}
function TT(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(Vt, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(ml), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(Ht, e.pendingId), t.setAttribute(Vr, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(Qn, e.choiceGroupId), t.setAttribute(rl, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function RT(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = $T(e);
  return `${t} → ${n}`;
}
function $T(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function kT(e) {
  return _l(e) ?? e;
}
function _l(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Al(e, t) {
  const n = Kt(e);
  if (!n) return;
  const r = n.querySelectorAll(FA);
  for (const a of r) {
    if (hl(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      FT(a, t);
    }));
  }
}
function er(e) {
  const t = Kt(e);
  if (!t) return;
  const n = t.querySelectorAll(BA);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      wT(t, r);
    }));
}
function tr(e) {
  const t = Kt(e);
  if (!t) return;
  const n = t.querySelectorAll(UA);
  for (const r of n) {
    if (!le()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      ET(t, r);
    }));
  }
}
function wT(e, t) {
  const n = t.getAttribute(Hr);
  if (!n) return;
  const r = e.querySelector(`[${al}="${De(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function ET(e, t) {
  if (!le()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(Vt), r = t.getAttribute(il), a = t.getAttribute(sl) ?? (r ? ae(r) : "Resistência");
  if (!n || !r) return;
  const o = ST(e, n), s = LT(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await fd(s, r);
    await OT(c.roll);
    const d = {
      skill: r,
      skillLabel: a,
      formula: c.formula,
      total: c.total,
      targetName: s.name ?? o?.resistanceTargetName ?? "alvo",
      diceBreakdown: c.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    IT(t, d), CT(t, d), xT(n, d), await MT(e, n, d);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function IT(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(ul, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function CT(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? yl(t);
  if (r) {
    r.textContent = Rl(t);
    return;
  }
  n.append(a);
}
function ST(e, t) {
  const n = x.get(t);
  if (n) return n;
  const r = Wt(e);
  return z(r)[t] ?? null;
}
function LT(e, t) {
  const n = e?.resistanceTargetActor;
  if (U(n)) return n;
  const a = e?.context?.targets.map(nr).find(U) ?? null;
  if (a) return a;
  const o = t.getAttribute(ll) ?? e?.resistanceTargetActorId ?? null, s = o ? vT(o) : null;
  return s || PT(
    t.getAttribute(cl) ?? e?.resistanceTargetName ?? DT(t)
  );
}
function DT(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${dl}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function nr(e) {
  const t = e.actor;
  if (U(t)) return t;
  const n = e.token, r = Ke(n);
  if (r) return r;
  const a = e.document;
  return Ke(a);
}
function Ke(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (U(t)) return t;
  const n = e.document?.actor;
  return U(n) ? n : null;
}
function vT(e) {
  const n = game.actors?.get?.(e);
  return U(n) ? n : Tl().map((o) => Ke(o)).find((o) => o?.id === e) ?? null;
}
function PT(e) {
  const t = Ae(e);
  if (!t) return null;
  const n = Tl().filter((o) => Ae(NT(o)) === t).map((o) => Ke(o)).find(U) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => U(o) && Ae(o.name) === t);
  return U(a) ? a : null;
}
function Tl() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function NT(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Ke(e)?.name ?? null;
}
function Ae(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function U(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Rl(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function OT(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function xT(e, t) {
  const n = x.get(e);
  n && (n.resistanceRollResult = t);
}
async function MT(e, t, n) {
  const r = Wt(e);
  if (r)
    try {
      const a = z(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await Le(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function Wt(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return G(r?.get?.(n));
}
async function FT(e, t) {
  if (hl(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(Ht);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    $l(e, e.getAttribute(Vr) ?? "✓ Automação aplicada"), BT(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function $l(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(ml), e.removeAttribute(Ht), e.removeAttribute(Vr);
}
function BT(e) {
  const t = e.getAttribute(Qn);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${Qn}="${De(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(rl) ?? "✓ Outra opção escolhida";
    $l(a, o);
  }
}
function kl(e, t) {
  const n = e.map(Kr).filter(dR), r = n.find((g) => g.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = C(e, "Forma"), o = C(e, "Custo"), s = C(e, "Dados") ?? C(e, `Dados (${r.label})`), l = C(e, "Tipo"), c = C(e, "Resistência"), d = C(e, "Resistência Perícia"), m = C(e, "Resistência Rótulo") ?? (d ? ae(d) : null), b = wl(e, "Observação"), T = e.filter((g) => GT(g, r)), A = UT(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: a,
    cost: o,
    diceBreakdown: s,
    damageType: l,
    resistance: c,
    resistanceSkill: d,
    resistanceSkillLabel: m,
    notes: b,
    details: T,
    castingCheck: A,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function UT(e) {
  const t = e.map(Kr).find((o) => o?.intent === "casting") ?? null, n = C(e, "Conjuração DT"), r = C(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const a = Number(n);
  return Number.isFinite(a) ? {
    label: t.formula,
    formula: C(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: C(e, "Dados (Conjuração)")
  } : null;
}
function Kr(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: qT(n)
  } : null;
}
function qT(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function C(e, t) {
  return wl(e, t)[0] ?? null;
}
function wl(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function GT(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || Kr(e) ? !1 : e.trim().length > 0;
}
function zT(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of x.values())
    rr(r, e, t) && n.set(r.pendingId, r);
  for (const r of KT(e))
    rr(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function rr(e, t, n) {
  const r = Y(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !Do(n, "itemId", e.itemId) ? !1 : !e.actorId || Do(n, "actorId", e.actorId);
}
function Do(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${gR(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function jT(e) {
  const t = De(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function VT(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (rr(e, null, t))
      return t;
  return null;
}
function HT() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of x.entries())
    e - r.createdAt > t && x.delete(n);
}
async function vo(e, t) {
  const n = Wt(e);
  if (!n) return !1;
  try {
    const r = z(n);
    return r[t.pendingId] = Zr(t, Y(n)), await Le(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function Yr(e) {
  const t = Sl(e);
  if (!t) return !1;
  try {
    const n = z(t);
    return n[e.pendingId] = Zr(e, Y(t)), await Le(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function El(e) {
  for (const t of zA)
    globalThis.setTimeout(() => {
      ar(e);
    }, t);
}
async function ar(e) {
  const t = Sl(e);
  if (Qr(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await Yr(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function WT(e, t) {
  const n = Cl(e.context.message);
  if (n)
    try {
      const r = z(n), a = r[e.pendingId] ?? Zr(e, Y(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await Le(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function KT(e) {
  return Object.values(z(G(e))).filter(tt);
}
function z(e) {
  if (!e) return {};
  const t = {}, n = Qr(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(Il(e)))
    t[r] ??= a;
  return t;
}
function YT(e) {
  return Object.values(Il(G(e))).filter(tt);
}
function Il(e) {
  if (!e) return {};
  const t = e.getFlag?.(u, tl);
  if (!we(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    tt(a) && (n[r] = a);
  return n;
}
async function Le(e, t) {
  typeof e.setFlag == "function" && (await ZT(e, t), await QT(e, t));
}
async function QT(e, t) {
  await Promise.resolve(e.setFlag?.(u, tl, t));
}
function Qr(e) {
  if (!e) return null;
  const t = e.getFlag?.(u, nl);
  return cR(t) ? t : null;
}
async function ZT(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(tt).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: r.messageId ?? Y(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: XT(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(u, nl, a));
}
function XT(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function Zr(e, t) {
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
function Cl(e) {
  const t = G(e);
  if (t?.setFlag)
    return t;
  const n = JT(e);
  if (n?.setFlag)
    return n;
  const r = Y(e);
  if (!r) return null;
  const a = game.messages;
  return G(a?.get?.(r));
}
function JT(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(G).find((n) => typeof n?.setFlag == "function") ?? null;
}
function Sl(e) {
  const t = Cl(e.context.message);
  if (t) return t;
  const n = e.messageId ? eR(e.messageId) : null;
  if (n) return n;
  const r = vl().slice().reverse();
  return r.find((a) => tR(a, e)) ?? r.find((a) => nR(a, e)) ?? null;
}
function eR(e) {
  const t = game.messages;
  return G(t?.get?.(e));
}
function tR(e, t) {
  const n = Y(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!Ll(e, t)) return !1;
  const a = Dl(e);
  return !t.actorId || !a || a === t.actorId;
}
function nR(e, t) {
  if (!aR(e, t)) return !1;
  const n = Dl(e);
  return t.actorId && n === t.actorId ? !0 : Ll(e, t);
}
function Ll(e, t) {
  const n = Ae(rR(e));
  if (!n) return !1;
  const r = Ae(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Ae(t.itemId);
  return !!(a && n.includes(a));
}
function rR(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function Dl(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function aR(e, t) {
  const n = oR(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= jA;
}
function oR(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function G(e) {
  return e && typeof e == "object" ? e : null;
}
function tt(e) {
  return we(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && D(e.messageId) && D(e.itemId) && D(e.actorId) && D(e.itemName) && ee(e.resistanceTargetActorId) && ee(e.resistanceTargetName) && uR(e.resistanceRollResult) && iR(e.actionPayload) && fn(e.title) && fn(e.buttonLabel) && fn(e.executedLabel) && ee(e.choiceGroupId) && ee(e.skippedLabel) && ee(e.actionSectionId) && ee(e.actionSectionTitle) && mR(e.summaryLines) : !1;
}
function iR(e) {
  return e == null ? !0 : we(e) ? e.kind === "resource-operation" && D(e.actorId) && D(e.actorUuid) && typeof e.actorName == "string" && sR(e.resource) && lR(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function sR(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function lR(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function cR(e) {
  return we(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && D(e.messageId) && we(e.source) && D(e.source.actorId) && D(e.source.actorName) && D(e.source.itemId) && D(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(tt) : !1;
}
function uR(e) {
  return e == null ? !0 : we(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && ee(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function dR(e) {
  return e !== null;
}
function we(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function D(e) {
  return e === null || typeof e == "string";
}
function fn(e) {
  return e === void 0 || typeof e == "string";
}
function ee(e) {
  return e == null || typeof e == "string";
}
function mR(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function fR(e) {
  return typeof e == "string" && e.length > 0;
}
function vl() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(G).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(G).filter((r) => r !== null) : [];
}
function Kt(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function Y(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function pR(e) {
  return e.trim().toLowerCase();
}
function gR(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function De(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const Po = 1e3;
class hR {
  constructor(t, n, r, a, o, s) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new q_(
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
      settings: sa(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = sa();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = Qe(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && $R(t.item) && n.executionMode === "ask") {
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
    if (await po(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: hn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = yR(
      t.item,
      r.value
    );
    switch (n.executionMode) {
      case "ask":
        await this.handleAskMode(t, a);
        return;
      case "automatic":
        await this.executeAutomation(t, a, "automatic");
        return;
    }
  }
  async executePendingAutomation(t) {
    const n = this.pendingExecutions.get(t);
    if (!n)
      return this.executePersistedPendingAutomation(t);
    if (n.kind === "workflow")
      return this.pendingExecutions.delete(t), await mn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await mn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = Wr(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = ER(r);
    if (!a)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await Rt(
      this.resources,
      a,
      r.resource,
      r.operation,
      r.amount
    );
    return o.ok ? (await KA(t), await YA(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (HA(
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
    if (await po(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: hn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      kR(t.item)
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
        await this.registerCompletedRitualCard(t, r.summaryLines), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), f.info(
          "Ritual assistido concluído sem ações pendentes.",
          re(r.workflowContext)
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
      const a = await this.ritualAssistant.applyAction(t);
      return a.ok ? (n.resourceTransactions.push(a.value), { ok: !0 }) : (this.handleResourceActionFailure(a), { ok: !1 });
    }
    if (t.kind === "damage-application") {
      if (!oe())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const a = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return a.ok ? (RR(n, a.value), await Hi(a.value), {
        ok: !0,
        executedLabel: bR(a.value)
      }) : (this.handleDamageActionFailure(a.error), { ok: !1 });
    }
    if (!oe())
      return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar efeito assistido."), { ok: !1 };
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
    const n = pn(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && pn(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await mn(
        a,
        No(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = bn();
    await WA({
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
  async registerAssistedActions(t, n, r, a) {
    let o;
    for (const s of r) {
      const l = bn();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Eo({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: pn(s),
        skippedLabel: No(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: wR(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), f.info(
      "Ritual assistido preparado com ações pendentes.",
      re(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = bn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Eo({
      pendingId: r,
      context: t,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    }), this.setAttempt(t, "pending", "execution-mode-ask", r);
  }
  async executeAutomation(t, n, r) {
    this.setAttempt(t, "running");
    const a = await this.workflow.runAutomation(n, {
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
    if (!a.ok) {
      this.setAttempt(t, "failed", a.error.reason), this.handleAutomationFailure(a.error);
      return;
    }
    this.setAttempt(t, "completed"), f.info(
      "Automação executada por uso normal de item.",
      re(a.value.context)
    );
  }
  handleAutomationFailure(t) {
    const n = `Automação por uso de item falhou: ${t.message}`;
    if (t.reason === "resource-operation-failed") {
      f.warn(n, t.cause ?? t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    if (t.reason === "chat-card-failed") {
      f.error(n, t.cause ?? t), ui.notifications?.error(`Paranormal Toolkit: ${t.message}`);
      return;
    }
    f.warn(n, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleResourceActionFailure(t) {
    f.warn(
      `Ação assistida falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  handleDamageActionFailure(t) {
    f.warn(`Ação assistida de dano falhou: ${t.message}`, t), ui.notifications?.warn(`Paranormal Toolkit: ${t.message}`);
  }
  handleConditionActionFailure(t) {
    f.warn(
      `Ação assistida de condição falhou: ${t.error.message}`,
      t.error
    ), ui.notifications?.warn(`Paranormal Toolkit: ${t.error.message}`);
  }
  isDuplicate(t) {
    const n = Date.now(), r = Oo(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > Po && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= Po;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(Oo(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = hn(
      t,
      n,
      r,
      a
    );
  }
}
function bR(e) {
  return Wi({ inputAmount: e.totalRawDamage });
}
function yR(e, t) {
  if (t.resistance || !_R(t))
    return t;
  const n = Ys(e);
  return n ? { ...t, resistance: n } : t;
}
function _R(e) {
  return AR(e) && !TR(e);
}
function AR(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function TR(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function pn(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function No(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function RR(e, t) {
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
function $R(e) {
  return e.type === "ritual";
}
function kR(e) {
  return s_(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function wR(e) {
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
function ER(e) {
  const t = e.actorUuid ? IR(e.actorUuid) : null;
  if (Ee(t)) return t;
  const n = e.actorId ? CR(e.actorId) : null;
  return n || SR(e.actorName);
}
function IR(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function CR(e) {
  const n = game.actors?.get?.(e);
  if (Ee(n)) return n;
  for (const r of Pl()) {
    const a = Xr(r);
    if (a?.id === e) return a;
  }
  return null;
}
function SR(e) {
  const t = gn(e);
  if (!t) return null;
  for (const a of Pl()) {
    const o = LR(a);
    if (gn(o) === t) {
      const s = Xr(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Ee(a) && gn(a.name) === t
  );
  return Ee(r) ? r : null;
}
function Pl() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function LR(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : Xr(e)?.name ?? null;
}
function Xr(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ee(t)) return t;
  const n = e.document?.actor;
  return Ee(n) ? n : null;
}
function gn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Ee(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function hn(e, t, n, r) {
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
function Oo(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function bn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class DR {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], a = [], o = Ze(t);
    for (const s of n) {
      const l = s.itemId ? o.find((m) => m.id === s.itemId) ?? null : null, c = s.match?.preset ?? null;
      if (!l || !c) {
        a.push(s);
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
      skipped: a
    };
  }
}
class vR {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = Ze(t).map((l) => this.analyzeRitual(l)), r = n.filter(dt("upToDate")), a = n.filter(dt("available")), o = n.filter(dt("outdated")), s = n.filter(dt("unsupported"));
    return {
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      total: n.length,
      upToDate: r,
      available: a,
      outdated: o,
      unsupported: s,
      canApply: a.length > 0 || o.length > 0
    };
  }
  getApplicableEntries(t) {
    const n = this.analyzeActor(t);
    return [...n.available, ...n.outdated];
  }
  analyzeRitual(t) {
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = PR(t);
    return n ? r ? r.source.type !== "preset" ? Me({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? Me({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : Me({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: NR(r, n.preset)
    }) : Me({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : Me({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Me(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? Lt(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function PR(e) {
  const t = e.getFlag(u, "automation");
  return ir(t) ? t : null;
}
function NR(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function dt(e) {
  return (t) => t.status === e;
}
class OR {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = lr(t.transaction);
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
    const r = this.createWorkflowSummaryContent(t, n), a = re(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: r,
      data: a,
      flags: {
        [u]: {
          workflowSummary: a
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const n = R(t.actorName), r = R(t.resource), a = R(xo(t)), o = R(MR(t));
    return `
      <section class="${u}-card ${u}-resource-card">
        <header class="${u}-card__header">
          <strong>${a}</strong>
          <span>${n}</span>
        </header>
        <div class="${u}-card__body">
          <p><strong>${o}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, n) {
    const r = R(n.title ?? "Automação"), a = n.message ? `<p>${R(n.message)}</p>` : "", o = R(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = R(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((g) => R(g.name)).join(", ") : "Nenhum", c = Object.values(t.rolls).map(
      (g) => `<li><strong>${R(g.id)}:</strong> ${R(g.formula)} = ${g.total} <em>(${R(xR(g.intent))})</em>${g.damageType ? ` — ${R(g.damageType)}` : ""}</li>`
    ), d = t.ritualCosts.map(
      (g) => `<li><strong>${R(g.itemName)}:</strong> ${g.circle}º círculo — ${g.amount} ${R(g.resource)} (${R(FR(g.source))})</li>`
    ), m = t.damageInstances.map(
      (g) => `<li><strong>${R(g.targetActorName)}:</strong> bruto ${g.rawAmount}${g.damageType ? ` ${R(g.damageType)}` : ""} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), b = t.healingInstances.map(
      (g) => `<li><strong>${R(g.targetActorName)}:</strong> bruto ${g.rawAmount} &rarr; final ${g.finalAmount} &rarr; aplicado ${g.appliedAmount}</li>`
    ), T = t.resourceTransactions.map(
      (g) => `<li><strong>${R(g.actorName)}:</strong> ${R(xo(g))} — ${g.before.value}/${g.before.max} &rarr; ${g.after.value}/${g.after.max}</li>`
    ), A = t.phases.map((g) => R(g)).join(" &rarr; ");
    return `
      <section class="${u}-card ${u}-workflow-card">
        <header class="${u}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${u}-card__body">
          ${a}
          <p><strong>Origem:</strong> ${o}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${d.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${d.join("")}</ul>` : ""}
          ${c.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${c.join("")}</ul>` : ""}
          ${m.length > 0 ? `<p><strong>Dano:</strong></p><ul>${m.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p><strong>Cura:</strong></p><ul>${b.join("")}</ul>` : ""}
          ${T.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${T.join("")}</ul>` : ""}
          ${A.length > 0 ? `<p class="${u}-workflow-card__phases"><strong>Fases:</strong> ${A}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function xR(e) {
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
function xo(e) {
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
function MR(e) {
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
function FR(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function R(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function BR() {
  const e = new Cb(), t = new Dy(e), n = new Ti(new Ai()), r = new Ri(new yr()), a = new vy(new Ms()), o = new Db(), s = new Hb(o), l = new iy(e), c = new ly(), d = c.registerMany(
    Rc()
  );
  if (!d.ok)
    throw new Error(d.error.message);
  const m = new sy(), b = new ay(), T = Li(), A = new wi(T), g = new vR(
    c
  ), j = new DR(
    g,
    m,
    b
  ), Pe = new xy(), Ne = new OR(Pe), ue = new Oy(), S = new Sy(
    t,
    s,
    Ne,
    ue
  ), L = new Ny(S, ue), Oe = new hR(
    L,
    t,
    s,
    n,
    A,
    Pe
  );
  return Oe.addStrategy(
    new ny(
      (rt) => Oe.handleItemUsed(rt)
    )
  ), {
    ordem: l,
    resourceAdapter: e,
    ritualAdapter: o,
    ritualCosts: s,
    resources: t,
    damage: n,
    resistance: r,
    ritualCasting: a,
    automationRegistry: c,
    automationBinder: m,
    itemPatches: b,
    conditionRegistry: T,
    conditions: A,
    debugOutput: Pe,
    chatMessages: Ne,
    workflowHooks: ue,
    automation: S,
    workflow: L,
    itemUseIntegration: Oe,
    ritualPresetDiagnostic: g,
    ritualPresetApplications: j
  };
}
const { ApplicationV2: UR } = foundry.applications.api;
class Ct extends UR {
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
      apply: Ct.onApply,
      cancel: Ct.onCancel
    }
  };
  async _renderHTML(t, n) {
    const r = this.services.ritualPresetDiagnostic.analyzeActor(this.actor), a = document.createElement("div");
    return a.className = "paranormal-toolkit-preset-manager", a.innerHTML = this.renderContent(r), a;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
  }
  renderContent(t) {
    return `
      <header class="paranormal-toolkit-preset-manager__header">
        <div>
          <p class="paranormal-toolkit-preset-manager__eyebrow">${F(or)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${F(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${yn("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${yn("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${yn("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function yn(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${F(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? qR(n) : zR(t)}
    </section>
  `;
}
function qR(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(GR).join("")}</ol>`;
}
function GR(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${F(e.appliedPresetId)} v${F(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${F(e.itemName)}</strong>
        <span>${F(e.reason)}</span>
        ${r}
      </div>
      <em>${F(n)}</em>
    </li>
  `;
}
function zR(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${F({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function F(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const St = `${u}.manageRitualPresets`, Mo = `__${u}_ritualPresetHeaderControlRegistered`, jR = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function VR(e) {
  const t = globalThis;
  if (!t[Mo]) {
    for (const n of jR)
      Hooks.on(n, (r, a) => {
        HR(r, a, e);
      });
    t[Mo] = !0, f.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function HR(e, t, n) {
  Array.isArray(t) && KR(e) && (WR(e, n), !t.some((r) => r.action === St) && t.push({
    action: St,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), Nl(e, n);
    }
  }));
}
function WR(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[St] && (e.options.actions[St] = (n) => {
    n.preventDefault(), n.stopPropagation(), Nl(e, t);
  }));
}
function KR(e) {
  if (!game.user?.isGM) return !1;
  const t = Ol(e);
  return t ? t.type === "agent" && Ze(t).length > 0 : !1;
}
function Nl(e, t) {
  const n = Ol(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Ct(n, t).render({ force: !0 });
}
function Ol(e) {
  return Fo(e.actor) ? e.actor : Fo(e.document) ? e.document : null;
}
function Fo(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const xl = "data-paranormal-toolkit-ritual-roll-config", nt = "data-paranormal-toolkit-ritual-roll-field", ie = "data-paranormal-toolkit-ritual-roll-action", Bo = `__${u}_ritualRollConfigBlockRegistered`, YR = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], QR = [
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
function ZR() {
  const e = globalThis;
  if (!e[Bo]) {
    XR();
    for (const t of YR)
      Hooks.on(t, (...n) => {
        JR(n[0], n[1]);
      });
    e[Bo] = !0, f.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function XR() {
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
function JR(e, t) {
  const n = f$(e);
  if (!n || n.type !== "ritual") return;
  const r = h$(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  t$(a);
  const o = Fl(n), s = Ks(n), l = p$(n), c = n$(n, s, o, l);
  l$(c, n, o, l), e$(a, c), Jr(c);
}
function e$(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function t$(e) {
  for (const t of Array.from(e.querySelectorAll(`[${xl}]`)))
    t.remove();
}
function n$(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${u}-ritual-roll-config`), a.setAttribute(xl, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${u}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${u}-ritual-roll-config__title`), s.append(Uo("strong", "Paranormal Toolkit")), s.append(Uo("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${u}-ritual-roll-config__badge`), l.textContent = Ul(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${u}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const d = document.createElement("div");
  d.classList.add(`${u}-ritual-roll-config__fields`), d.append(r$(t, r)), d.append(a$(t, r)), d.append(o$(t, r)), a.append(d), a.append(i$(t, n, r)), a.append(s$(r));
  const m = document.createElement("p");
  return m.classList.add(`${u}-ritual-roll-config__status`), m.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(m), a;
}
function r$(e, t) {
  const n = Yt("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(nt, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = i_(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function a$(e, t) {
  const n = Yt("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(nt, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of QR) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function o$(e, t) {
  const n = Yt("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(nt, "utilityLabel"), n.append(r), n;
}
function i$(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${u}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${u}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${u}-ritual-roll-config__forms-grid`), o.append(_n("base", "Padrão", e.forms.base.formula, !0, n)), o.append(_n("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(_n("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function _n(e, t, n, r, a) {
  const o = Yt(t);
  o.classList.add(`${u}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(nt, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function s$(e) {
  const t = document.createElement("div");
  t.classList.add(`${u}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(ie, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(ie, "clear"), t.append(n, r), t;
}
function Yt(e) {
  const t = document.createElement("label");
  t.classList.add(`${u}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function Uo(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function l$(e, t, n, r) {
  ve(e, "intent")?.addEventListener("change", () => Jr(e)), zo(e, "system.studentForm")?.addEventListener("change", () => qo(e, t)), zo(e, "system.trueForm")?.addEventListener("change", () => qo(e, t)), e.querySelector(`[${ie}="save"]`)?.addEventListener("click", () => {
    r && c$(e, t, n);
  }), e.querySelector(`[${ie}="clear"]`)?.addEventListener("click", () => {
    r && u$(e, t);
  });
}
async function c$(e, t, n) {
  const r = e.querySelector(`[${ie}="save"]`);
  r?.setAttribute("disabled", "true"), Te(e, "Salvando configuração...");
  try {
    const a = d$(e, n);
    await a_(t, a), Ml(e, a), Te(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), Te(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function u$(e, t) {
  const n = e.querySelector(`[${ie}="clear"]`);
  n?.setAttribute("disabled", "true"), Te(e, "Limpando configuração...");
  try {
    await o_(t);
    const r = Ks(t);
    m$(e, r), Ml(e, r), Te(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), Te(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function Ml(e, t) {
  const n = e.querySelector(`.${u}-ritual-roll-config__badge`);
  n && (n.textContent = Ul(t) ? "Configurada" : "Rascunho");
}
function d$(e, t) {
  return {
    schemaVersion: 1,
    intent: Bl(ve(e, "intent")?.value),
    damageType: jo(e, "damageType"),
    utilityLabel: jo(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: bt(e, "formula.base") },
      discente: { formula: bt(e, "formula.discente") },
      verdadeiro: { formula: bt(e, "formula.verdadeiro") }
    }
  };
}
function m$(e, t) {
  fe(e, "intent", t.intent), fe(e, "damageType", t.damageType ?? ""), fe(e, "utilityLabel", t.utilityLabel ?? "Resultado"), fe(e, "formula.base", t.forms.base.formula), fe(e, "formula.discente", t.forms.discente.formula), fe(e, "formula.verdadeiro", t.forms.verdadeiro.formula), Jr(e);
}
function Jr(e) {
  const t = Bl(ve(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function qo(e, t) {
  const n = Fl(t);
  Go(e, "discente", n.discente), Go(e, "verdadeiro", n.verdadeiro);
}
function Go(e, t, n) {
  const r = ve(e, `formula.${t}`);
  if (!r) return;
  const a = !e.querySelector(`[${ie}="save"]`)?.disabled;
  r.disabled = !a || !n;
  const o = r.closest(`.${u}-ritual-roll-config__field`), s = o?.querySelector("small");
  if (o) {
    if (n) {
      s?.remove();
      return;
    }
    if (!s) {
      const l = document.createElement("small");
      l.textContent = "Indisponível neste ritual.", o.append(l);
    }
  }
}
function Te(e, t) {
  const n = e.querySelector(`.${u}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function Fl(e) {
  const t = g$(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function f$(e) {
  return Vo(e.item) ? e.item : Vo(e.document) ? e.document : null;
}
function p$(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function g$(e) {
  const t = e.system;
  return b$(t) ? t : {};
}
function zo(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function ve(e, t) {
  return e.querySelector(`[${nt}="${y$(t)}"]`);
}
function bt(e, t) {
  return ve(e, t)?.value.trim() ?? "";
}
function jo(e, t) {
  const n = bt(e, t);
  return n.length > 0 ? n : null;
}
function fe(e, t, n) {
  const r = ve(e, t);
  r && (r.value = n);
}
function Bl(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function Ul(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function h$(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function Vo(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function b$(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function y$(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let ne = null;
Hooks.once("init", () => {
  yc(), Yc(), Su(), gb(), f.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!ua.isSupportedSystem()) {
    f.warn(
      `Sistema não suportado: ${ua.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  ne = BR(), ne.itemUseIntegration.registerStrategies(), wu(ne.conditions), lu(ne), _u(), gu(), Tb(), VR(ne), ZR(), f.info("Inicializado para o sistema Ordem Paranormal."), f.info(
    `API de debug disponível em globalThis["${u}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${or} inicializado.`);
});
function _$() {
  if (!ne)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return ne;
}
export {
  _$ as getToolkitServices
};
//# sourceMappingURL=main.js.map
