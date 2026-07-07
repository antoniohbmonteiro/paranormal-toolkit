const d = "paranormal-toolkit", Ar = "Paranormal Toolkit", gc = "ordemparanormal";
class rt {
  static getSelectedActor() {
    return (canvas?.tokens?.controlled ?? [])[0]?.actor ?? game.user?.character ?? null;
  }
}
function Ft(e) {
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
    console.log(`${d} | ${t}`, ...n);
  }
  static warn(t, ...n) {
    console.warn(`${d} | ${t}`, ...n);
  }
  static error(t, ...n) {
    console.error(`${d} | ${t}`, ...n);
  }
}
function A(e) {
  return { ok: !0, value: e };
}
function g(e) {
  return { ok: !1, error: e };
}
function at(e) {
  const t = bi(e);
  return t.ok ? A(t.value.definition) : t;
}
function bi(e) {
  const t = e.getFlag(d, "automation");
  return t == null ? g({
    reason: "missing-automation",
    message: `Item ${e.name} não possui automação do Paranormal Toolkit.`
  }) : _r(t) ? A(t) : g({
    reason: "invalid-automation",
    message: `Automação do item ${e.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
    value: t
  });
}
function hc(e) {
  return _r(e.getFlag(d, "automation"));
}
function _r(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.schemaVersion === 1 && bc(t.source) && yc(t.definition);
}
function yc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && R(t.label) && Array.isArray(t.steps) && t.steps.every(Ac) && (t.ritualForms === void 0 || kc(t.ritualForms)) && (t.conditionApplications === void 0 || Lc(t.conditionApplications));
}
function bc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "preset" ? R(t.presetId) && R(t.presetVersion) && R(t.appliedAt) : t.type === "manual" ? R(t.label) && R(t.appliedAt) : !1;
}
function Ac(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  switch (t.type) {
    case "spendResource":
      return _c(t);
    case "spendRitualCost":
      return Tc(t);
    case "rollFormula":
      return Rc(t);
    case "modifyResource":
      return $c(t);
    case "chatCard":
      return wc(t);
    default:
      return !1;
  }
}
function _c(e) {
  const t = e;
  return t.type === "spendResource" && t.actor === "self" && (t.resource === "PE" || t.resource === "PD") && Ai(t);
}
function Tc(e) {
  return e.type === "spendRitualCost";
}
function Rc(e) {
  const t = e;
  return t.type === "rollFormula" && R(t.id) && R(t.formula) && (t.intent === void 0 || Mc(t.intent)) && (t.damageType === void 0 || R(t.damageType));
}
function $c(e) {
  const t = e;
  return t.type === "modifyResource" && _i(t.actor) && xc(t.resource) && Oc(t.operation) && Ai(t) && (t.damageType === void 0 || t.damageType === null || R(t.damageType)) && (t.ignoreResistance === void 0 || typeof t.ignoreResistance == "boolean");
}
function wc(e) {
  const t = e;
  return t.type === "chatCard" && (t.title === void 0 || typeof t.title == "string") && (t.message === void 0 || typeof t.message == "string");
}
function kc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = /* @__PURE__ */ new Set([
    "base",
    "discente",
    "verdadeiro"
  ]);
  return Object.entries(t).every(
    ([r, a]) => n.has(r) && Ec(a)
  );
}
function Ec(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.label === void 0 || R(t.label)) && (t.extraCost === void 0 || Bc(t.extraCost)) && (t.rollFormulaOverrides === void 0 || qc(t.rollFormulaOverrides)) && (t.notes === void 0 || Uc(t.notes)) && (t.targeting === void 0 || Ic(t.targeting));
}
function Ic(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return Sc(t.mode) && R(t.label) && (t.optionLabel === void 0 || R(t.optionLabel)) && (t.optional === void 0 || typeof t.optional == "boolean") && (t.defaultEnabled === void 0 || typeof t.defaultEnabled == "boolean") && (t.template === void 0 || Cc(t.template));
}
function Cc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return t.shape === "ray" && (t.distance === void 0 || t.distance === null || _a(t.distance)) && (t.width === void 0 || t.width === null || _a(t.width));
}
function Sc(e) {
  return e === "selectedTokens" || e === "lineArea";
}
function Lc(e) {
  return Array.isArray(e) && e.every(vc);
}
function vc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return R(t.id) && _i(t.actor) && R(t.conditionId) && (t.label === void 0 || R(t.label)) && (t.duration === void 0 || t.duration === null || Pc(t.duration)) && (t.source === void 0 || R(t.source)) && (t.actionSectionId === void 0 || R(t.actionSectionId)) && (t.actionSectionTitle === void 0 || R(t.actionSectionTitle)) && (t.executedLabel === void 0 || R(t.executedLabel)) && (t.applyOnResistance === void 0 || Dc(t.applyOnResistance));
}
function Dc(e) {
  return e === "failure" || e === "success" || e === "always";
}
function Pc(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.rounds === void 0 || t.rounds === null || Fc(t.rounds)) && (t.expiry === void 0 || t.expiry === null || Nc(t.expiry));
}
function Nc(e) {
  return e === "turnStart" || e === "turnEnd";
}
function Ai(e) {
  return typeof e.amount == "number" && Number.isInteger(e.amount) && e.amount > 0 || R(e.amountFrom);
}
function _i(e) {
  return e === "self" || e === "target";
}
function xc(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function Oc(e) {
  return e === "spend" || e === "damage" || e === "heal" || e === "recover";
}
function Mc(e) {
  return e === "attack" || e === "damage" || e === "healing" || e === "resistance" || e === "skill" || e === "ritual" || e === "generic";
}
function Fc(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Bc(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function _a(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0;
}
function R(e) {
  return typeof e == "string" && e.length > 0;
}
function Uc(e) {
  return Array.isArray(e) && e.every(R);
}
function qc(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : Object.entries(e).every(
    ([t, n]) => R(t) && R(n)
  );
}
function Tr(e) {
  const t = e.items;
  if (Array.isArray(t))
    return t;
  if (t && typeof t == "object") {
    const n = t;
    if (Array.isArray(n.contents))
      return n.contents.filter(Ta);
    if (zc(t))
      return Array.from(t).filter(Ta);
  }
  return [];
}
function Gc(e) {
  return Tr(e)[0] ?? null;
}
function jc(e) {
  return Tr(e).find(hc) ?? null;
}
function zc(e) {
  return !!(e && typeof e == "object" && Symbol.iterator in e);
}
function Ta(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function ot(e) {
  return Tr(e).filter((t) => t.type === "ritual");
}
function Ti(e) {
  return ot(e)[0] ?? null;
}
function Vc(e) {
  return {
    listPresets() {
      const t = e.automationRegistry.list().map(Ft);
      return m.info("Presets de automação registrados.", t), t;
    },
    findPresetsForFirstRitual() {
      const t = He("Nenhum ator encontrado para buscar presets de ritual.");
      if (!t) return [];
      const n = ut(t);
      if (!n) return [];
      const r = e.automationRegistry.findForItem(n).map(wa);
      return m.info(`Presets encontrados para ${n.name}.`, r), r;
    },
    async applyPresetToFirstRitual(t) {
      const n = He("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!n) return;
      const r = ut(n);
      if (!r) return;
      const a = e.automationRegistry.require(t);
      if (!a.ok) {
        m.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      const o = await Dn(e, r, a.value);
      m.info(`Preset ${a.value.id} aplicado em ${r.name}.`, { itemPatch: o }), ui.notifications?.info(`Paranormal Toolkit: preset ${a.value.label} aplicado em ${r.name}.`);
    },
    async applyBestPresetToFirstRitual() {
      const t = He("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!t) return;
      const n = ut(t);
      if (!n) return;
      const r = e.automationRegistry.findForItem(n)[0];
      if (!r) {
        m.warn(`Nenhum preset compatível encontrado para ${n.name}.`), ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${n.name}.`);
        return;
      }
      const a = await Dn(e, n, r.preset);
      m.info(`Melhor preset aplicado em ${n.name}.`, { match: wa(r), itemPatch: a }), ui.notifications?.info(`Paranormal Toolkit: preset ${r.preset.label} aplicado em ${n.name}.`);
    },
    async applyBestPresetToAllRituals() {
      return Ra(e);
    },
    async applyBestPresetsToActorRituals() {
      return Ra(e);
    },
    async clearAutomationFromFirstRitual() {
      const t = He("Nenhum ator encontrado para limpar automação de ritual.");
      if (!t) return;
      const n = ut(t);
      n && (await e.automationBinder.clear(n), m.info(`Automação removida do ritual ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação removida de ${n.name}.`));
    }
  };
}
async function Ra(e) {
  const t = He("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!t) return null;
  const n = ot(t);
  if (n.length === 0)
    return m.warn(`Ator ${t.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), $a(t);
  const r = $a(t, n.length);
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
    const s = await Dn(e, a, o.preset);
    r.applied.push(Hc(a, o, s));
  }
  return m.info(`Presets aplicados em rituais de ${t.name ?? "ator sem nome"}.`, r), Wc(r), r;
}
async function Dn(e, t, n) {
  return await e.automationBinder.applyPreset(t, n), e.itemPatches.applyPresetItemPatch(t, n);
}
function Hc(e, t, n) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Ritual sem nome",
    preset: Ft(t.preset),
    score: t.score,
    reasons: [...t.reasons],
    automationApplied: !0,
    itemPatchApplied: n.applied,
    itemPatchReason: n.applied ? void 0 : n.reason
  };
}
function $a(e, t = 0) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    total: t,
    applied: [],
    skipped: []
  };
}
function Wc(e) {
  const t = e.skipped.length > 0 ? `, ${e.skipped.length} sem preset compatível` : "", n = e.applied.some((r) => r.itemPatchApplied) ? " com dados visíveis atualizados" : "";
  ui.notifications?.info(
    `Paranormal Toolkit: ${e.applied.length}/${e.total} presets aplicados em rituais${n}${t}.`
  );
}
function wa(e) {
  return {
    preset: Ft(e.preset),
    score: e.score,
    reasons: [...e.reasons]
  };
}
function He(e) {
  const t = rt.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ut(e) {
  const t = Ti(e);
  return t || (m.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function ue(e) {
  return e ? {
    id: e.id,
    source: {
      ...Kc(e.sourceActor),
      token: e.sourceToken
    },
    item: Yc(e.item),
    targets: e.targets.map(Qc),
    phases: [...e.phases],
    lifecycleEvents: e.lifecycleEvents.map((t) => ({ ...t })),
    rollRequests: ka(e.rollRequests, Ri),
    rolls: ka(e.rolls, Zc),
    ritualCosts: e.ritualCosts.map((t) => ({ ...t })),
    damageInstances: e.damageInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    healingInstances: e.healingInstances.map((t) => ({ ...t, tags: [...t.tags] })),
    resourceTransactions: e.resourceTransactions.map(Rr),
    flagKeys: Object.keys(e.flags)
  } : null;
}
function Rr(e) {
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
function Kc(e) {
  return {
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown"
  };
}
function Yc(e) {
  return {
    itemId: e.id ?? null,
    itemName: e.name ?? "Item sem nome",
    itemType: e.type ?? "unknown",
    itemUuid: e.uuid ?? null
  };
}
function Qc(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name,
    actorName: e.actor?.name,
    actorType: e.actor?.type
  };
}
function Ri(e) {
  return {
    id: e.id,
    formula: e.formula,
    intent: e.intent,
    damageType: e.damageType,
    sourceStepIndex: e.sourceStepIndex
  };
}
function Zc(e) {
  return {
    ...Ri(e),
    total: e.total
  };
}
function ka(e, t) {
  return Object.fromEntries(Object.entries(e).map(([n, r]) => [n, t(r)]));
}
function Xc(e) {
  return {
    getSelected() {
      return rt.getSelectedActor();
    },
    logResources() {
      const t = ne(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );
      if (!t) return;
      const n = e.ordem.getActorSnapshot(t);
      m.info("Recursos do ator selecionado:", n), n.resourceErrors.length > 0 && m.warn("Alguns recursos não puderam ser lidos pelo adapter.", n.resourceErrors);
    },
    async spendPE(t) {
      await Te(
        e,
        "Gasto de PE",
        ne("Nenhum ator encontrado para gastar PE."),
        (n) => e.resources.spend(n, "PE", t)
      );
    },
    async spendPD(t) {
      await Te(
        e,
        "Gasto de PD",
        ne("Nenhum ator encontrado para gastar PD."),
        (n) => e.resources.spend(n, "PD", t)
      );
    },
    async damagePV(t) {
      await Te(
        e,
        "Dano em PV",
        ne("Nenhum ator encontrado para causar dano em PV."),
        (n) => e.resources.damage(n, "PV", t)
      );
    },
    async healPV(t) {
      await Te(
        e,
        "Cura de PV",
        ne("Nenhum ator encontrado para curar PV."),
        (n) => e.resources.heal(n, "PV", t)
      );
    },
    async damageSAN(t) {
      await Te(
        e,
        "Dano em SAN",
        ne("Nenhum ator encontrado para causar dano em SAN."),
        (n) => e.resources.damage(n, "SAN", t)
      );
    },
    async recoverSAN(t) {
      await Te(
        e,
        "Recuperação de SAN",
        ne("Nenhum ator encontrado para recuperar SAN."),
        (n) => e.resources.recover(n, "SAN", t)
      );
    }
  };
}
async function Te(e, t, n, r) {
  if (!n) return;
  const a = await r(n);
  if (!a.ok) {
    Jc(a.error);
    return;
  }
  const o = a.value;
  try {
    await e.chatMessages.createResourceOperationMessage({ transaction: o });
  } catch (s) {
    m.error(`${t} realizado, mas falhou ao criar o chat card.`, s), ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }
  m.info(`${t} realizado:`, Rr(o));
}
function ne(e) {
  const t = rt.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Jc(e) {
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
const z = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
};
function eu() {
  dt(z.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: !1
  }), dt(z.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: !0
  }), dt(z.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: !0
  }), dt(z.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: !1
  });
}
function Pn() {
  return {
    enabled: mt(z.enabled),
    console: mt(z.console),
    ui: mt(z.ui),
    chat: mt(z.chat)
  };
}
async function Q(e, t) {
  await game.settings.set(d, z[e], t);
}
function dt(e, t) {
  game.settings.register(d, e, {
    name: t.name,
    hint: t.hint,
    scope: "world",
    config: !0,
    type: Boolean,
    default: t.default
  });
}
function mt(e) {
  return game.settings.get(d, e) === !0;
}
function tu() {
  return {
    status() {
      return Pn();
    },
    async enable() {
      await Q("enabled", !0);
    },
    async disable() {
      await Q("enabled", !1);
    },
    async enableConsole() {
      await Q("console", !0);
    },
    async disableConsole() {
      await Q("console", !1);
    },
    async enableUi() {
      await Q("ui", !0);
    },
    async disableUi() {
      await Q("ui", !1);
    },
    async enableChat() {
      await Q("chat", !0);
    },
    async disableChat() {
      await Q("chat", !1);
    }
  };
}
const $i = "ritual.costOnly", wi = "ritual.simpleHealing", nu = "ritual.eletrocussao", ru = "ritual.definhar", ki = "ritual.simpleDamage", Ei = "generic.simpleHealing", $r = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;
function au() {
  return [
    ou(),
    iu(),
    su(),
    lu(),
    cu(),
    uu()
  ];
}
function ou() {
  return {
    id: $i,
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
function iu() {
  return {
    id: wi,
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
    automation: Ii(),
    itemPatch: fu()
  };
}
function su() {
  return {
    id: nu,
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
    automation: du(),
    itemPatch: gu()
  };
}
function lu() {
  return {
    id: ru,
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
    automation: mu(),
    itemPatch: pu()
  };
}
function cu() {
  return {
    id: ki,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: wr()
  };
}
function uu() {
  return {
    id: Ei,
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
function Ii(e = "2d8+2") {
  return Ci(
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
function du() {
  return {
    ...wr("3d6", {
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
        },
        targeting: {
          mode: "lineArea",
          label: "Linha",
          optionLabel: "Usar linha na cena",
          optional: !0,
          defaultEnabled: !0,
          template: {
            shape: "ray"
          }
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
function mu() {
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
function wr(e = "1d8", t = {}) {
  const n = t.label ?? "Ritual de dano simples", r = t.title ?? "Ritual de dano simples", a = t.damageType ?? "generic", o = t.message ?? "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";
  return Ci(
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
function fu() {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: $r,
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
function pu() {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: $r,
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
function gu() {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: $r,
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
function Ci(e, t, n) {
  return {
    ...e,
    steps: e.steps.map((r) => r.type !== "rollFormula" || r.id !== t ? r : {
      ...r,
      formula: n
    })
  };
}
function kr() {
  return Array.from(game.user?.targets ?? []).map(Si);
}
function Si(e) {
  return {
    tokenId: we(e.id),
    actorId: we(e.actor?.id),
    sceneId: we(e.scene?.id),
    name: e.name ?? e.actor?.name ?? "Alvo sem nome",
    actor: e.actor ?? null
  };
}
function Li() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null;
  return {
    tokenId: we(e.id),
    actorId: we(t?.id),
    sceneId: we(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function we(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function hu(e) {
  return {
    logFirstRitualCost() {
      const t = re("Nenhum ator encontrado para consultar custo de ritual.");
      if (!t) return;
      const n = ae(t);
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
      const r = re("Nenhum ator encontrado para configurar custo customizado.");
      if (!r) return;
      const a = ae(r);
      if (a) {
        if (!Au(t, n)) {
          ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
          return;
        }
        await a.setFlag(d, "ritual.cost", {
          resource: n,
          amount: t
        }), m.info(`Custo customizado aplicado em ${a.name}.`, { resource: n, amount: t }), ui.notifications?.info(`Paranormal Toolkit: ${a.name} agora custa ${t} ${n}.`);
      }
    },
    async clearCustomCostOnFirstRitual() {
      const t = re("Nenhum ator encontrado para limpar custo customizado.");
      if (!t) return;
      const n = ae(t);
      n && (await n.unsetFlag(d, "ritual.cost"), m.info(`Custo customizado removido de ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${n.name}.`));
    },
    async setTestCostAutomationOnFirstRitual() {
      const t = re("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!t) return;
      const n = ae(t);
      if (!n) return;
      const r = e.automationRegistry.require($i);
      if (!r.ok) {
        m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(n, r.value), m.info(`Preset de custo aplicado ao ritual: ${n.name}.`), ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${n.name}.`);
    },
    async setTestHealingAutomationOnFirstRitual(t = "2d8+2") {
      const n = re("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!n) return;
      const r = ae(n);
      if (!r) return;
      if (!Ea(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }
      const a = e.automationRegistry.require(wi);
      if (!a.ok) {
        m.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: Ii(t)
      }), m.info(`Preset de cura simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${r.name}.`);
    },
    async setTestDamageAutomationOnFirstRitual(t = "1d8") {
      const n = re("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!n) return;
      const r = ae(n);
      if (!r) return;
      if (!Ea(t)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }
      const a = e.automationRegistry.require(ki);
      if (!a.ok) {
        m.warn(a.error.message, a.error), ui.notifications?.warn(`Paranormal Toolkit: ${a.error.message}`);
        return;
      }
      await e.automationBinder.applyPreset(r, a.value, {
        definition: wr(t)
      }), m.info(`Preset de dano simples aplicado ao ritual: ${r.name}.`, { formula: t }), ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${r.name}.`);
    },
    async runFirstRitualAutomation() {
      const t = re("Nenhum ator encontrado para executar automação de ritual.");
      if (!t) return;
      const n = ae(t);
      n && await yu(e, t, n);
    }
  };
}
async function yu(e, t, n) {
  const r = at(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Li(),
    item: n,
    targets: kr()
  });
  if (!a.ok) {
    bu(a.error);
    return;
  }
  m.info("Automação de ritual executada com sucesso.", ue(a.value.context));
}
function bu(e) {
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
function re(e) {
  const t = rt.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function ae(e) {
  const t = Ti(e);
  return t || (m.warn(`Ator ${e.name ?? "sem nome"} não possui rituais.`), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais."), null);
}
function Au(e, t) {
  return Number.isInteger(e) && e > 0 && (t === "PE" || t === "PD");
}
function Ea(e) {
  return typeof e == "string" && e.trim().length > 0;
}
const _u = ["strict", "open"], vi = "strict";
function Tu(e) {
  return _u.includes(e) ? e : vi;
}
function Ru(e) {
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
function Bt(e, t) {
  return e === "strict" && t.kind === "pending";
}
const $u = ["disabled", "ask", "automatic"], wu = ["buttons", "confirm"], Di = "ask";
function ku(e) {
  return typeof e == "string" && $u.includes(e);
}
function Eu(e) {
  return typeof e == "string" && wu.includes(e);
}
function Iu(e) {
  return ku(e) ? e : Eu(e) ? "ask" : Di;
}
const Cu = ["keep", "replace"], Su = ["manual", "assisted"], Pi = "keep", Ni = "assisted", Lu = !0, S = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  damageResolutionMode: "itemUse.damageResolutionMode",
  resistanceGateMode: "itemUse.resistanceGateMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
};
function vu() {
  game.settings.register(d, S.executionMode, {
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
    default: Di
  }), game.settings.register(d, S.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    },
    default: Pi
  }), game.settings.register(d, S.damageResolutionMode, {
    name: "Resolução de dano com resistência",
    hint: "Controla se o card mantém botões manuais de dano ou se usa a resistência rolada para sugerir um único botão de aplicação.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      assisted: "Assistida",
      manual: "Manual"
    },
    default: Ni
  }), game.settings.register(d, S.resistanceGateMode, {
    name: "Aplicação antes da resistência",
    hint: "Controla se ações de dano e efeito ficam bloqueadas até a resistência ser rolada ou se o mestre pode aplicar manualmente antes disso.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      strict: "Bloquear até rolar resistência",
      open: "Permitir aplicação manual sem resistência"
    },
    default: vi
  }), game.settings.register(d, S.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: Lu
  }), game.settings.register(d, S.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  });
}
function Ia() {
  const e = Iu(game.settings.get(d, S.executionMode)), t = Oi(game.settings.get(d, S.systemCardMode)), n = Mi(game.settings.get(d, S.damageResolutionMode)), r = Er();
  return {
    executionMode: e,
    systemCardMode: t,
    damageResolutionMode: n,
    resistanceGateMode: r,
    ritualCastingCheckEnabled: xi()
  };
}
function Du() {
  return Oi(game.settings.get(d, S.systemCardMode));
}
function Pu() {
  return Mi(game.settings.get(d, S.damageResolutionMode));
}
function Er() {
  return Tu(game.settings.get(d, S.resistanceGateMode));
}
function xi() {
  return game.settings.get(d, S.ritualCastingCheckEnabled) === !0;
}
async function oe(e) {
  await game.settings.set(d, S.executionMode, e);
}
function Oi(e) {
  return Cu.includes(e) ? e : Pi;
}
function Mi(e) {
  return Su.includes(e) ? e : Ni;
}
function Nu(e) {
  return {
    status() {
      return e.itemUseIntegration.status();
    },
    async enable() {
      await oe("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async disable() {
      await oe("disabled"), ui.notifications?.info("Paranormal Toolkit: automação ao usar item desativada.");
    },
    async setMode(t) {
      await oe(t), ui.notifications?.info(`Paranormal Toolkit: modo de automação ao usar item alterado para ${t}.`);
    },
    async ask() {
      await oe("ask"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo perguntar no chat.");
    },
    async buttons() {
      await oe("ask"), ui.notifications?.info("Paranormal Toolkit: modo buttons foi substituído por ask/perguntar no chat.");
    },
    async confirm() {
      await oe("ask"), ui.notifications?.info("Paranormal Toolkit: modo confirm foi substituído por ask/perguntar no chat.");
    },
    async automatic() {
      await oe("automatic"), ui.notifications?.info("Paranormal Toolkit: automações ao usar item em modo automático.");
    }
  };
}
const xu = [
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
function Ou(e) {
  return {
    phases() {
      return xu;
    },
    lastContext() {
      return e.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation() {
      const t = sn("Nenhum ator encontrado para executar automação.");
      if (!t) return;
      const n = jc(t);
      if (!n) {
        m.warn("Nenhum item com automação encontrado no ator selecionado."), ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }
      await Ca(e, t, n);
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
      if (!Bu(n)) {
        m.warn(`UUID não resolveu para um Item: ${t}`, n), ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }
      const r = Fu(n) ?? sn("Nenhum ator encontrado para executar automação do item.");
      r && await Ca(e, r, n);
    },
    async setTestHealingAutomationOnFirstItem() {
      const t = sn("Nenhum ator encontrado para configurar automação de teste.");
      if (!t) return;
      const n = Gc(t);
      if (!n) {
        m.warn("Ator selecionado não possui itens."), ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }
      try {
        const r = e.automationRegistry.require(Ei);
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
async function Ca(e, t, n) {
  const r = at(n);
  if (!r.ok) {
    m.warn(r.error.message, r.error), ui.notifications?.warn(`Paranormal Toolkit: ${r.error.message}`);
    return;
  }
  const a = await e.workflow.runAutomation(r.value, {
    sourceActor: t,
    sourceToken: Li(),
    item: n,
    targets: kr()
  });
  if (!a.ok) {
    Mu(a.error);
    return;
  }
  m.info("Automação executada com sucesso.", ue(a.value.context));
}
function Mu(e) {
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
function sn(e) {
  const t = rt.getSelectedActor();
  return t || (m.warn(e), ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado."), null);
}
function Fu(e) {
  const t = e.parent;
  return t instanceof Actor ? t : null;
}
function Bu(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function Uu(e) {
  const t = Xc(e), n = Vc(e), r = hu(e), a = Ou(e), o = tu(), s = Nu(e);
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
const At = {
  ritual: {
    castStarted: "paranormal-toolkit.ritual.cast.started",
    areaResolved: "paranormal-toolkit.ritual.area.resolved",
    castFinished: "paranormal-toolkit.ritual.cast.finished"
  }
};
function qu(e) {
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
      const r = Sa();
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
      return Gu(a), a;
    },
    removeFromSelectedTokens: async (t) => {
      const n = Sa();
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
      return ju(r), r;
    },
    cleanupExpired: (t = {}) => e.cleanupExpiredConditions({
      ...t,
      reason: t.reason ?? "manual"
    })
  };
}
function Sa() {
  const e = canvas.tokens?.controlled ?? [], t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = n.actor ?? n.document?.actor ?? null;
    if (!r) continue;
    const o = r.uuid ?? null ?? r.id ?? r.name ?? `selected-${t.size}`;
    t.set(o, r);
  }
  return Array.from(t.values());
}
function Gu(e) {
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
function ju(e) {
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
function zu(e) {
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
    conditions: qu(e.conditions),
    debug: Uu(e),
    hooks: At
  }, n = globalThis;
  return n[d] = t, n.ParanormalToolkit = t, t;
}
class La {
  static isSupportedSystem() {
    return game.system.id === gc;
  }
  static getCurrentSystemId() {
    return game.system.id;
  }
}
function Vu() {
  return Array.from(game.user?.targets ?? []).map((t) => ({
    tokenId: ke(t.id),
    actorId: ke(t.actor?.id),
    sceneId: ke(t.scene?.id),
    name: t.name ?? t.actor?.name ?? "Alvo sem nome"
  }));
}
function Fi() {
  const e = canvas?.tokens?.controlled?.[0];
  if (!e) return null;
  const t = e.actor ?? null, n = e.name ?? t?.name ?? "Origem sem nome";
  return {
    tokenId: ke(e.id),
    actorId: ke(t?.id),
    sceneId: ke(e.scene?.id),
    name: n
  };
}
function Hu(e, t = Fi()) {
  return {
    version: 1,
    kind: "chat-targets",
    source: t,
    targets: e
  };
}
function Wu(e) {
  if (!Qu(e)) return null;
  const t = e.getFlag(d, "workflow");
  return Yu(t) ? t : null;
}
function Ku() {
  return `flags.${d}.workflow`;
}
function va(e) {
  if (!e || typeof e != "object") return !1;
  const t = foundry.utils.getProperty(e, `flags.${d}`), n = foundry.utils.getProperty(e, `_source.flags.${d}`);
  return t !== void 0 || n !== void 0;
}
function Da(e) {
  const t = foundry.utils.getProperty(e, "speaker.actor"), n = foundry.utils.getProperty(e, "_source.speaker.actor");
  return Nn(t) || Nn(n);
}
function Yu(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.version === 1 && t.kind === "chat-targets" && (t.source === null || typeof t.source == "object") && Array.isArray(t.targets);
}
function Qu(e) {
  return !!(e && typeof e == "object" && "getFlag" in e);
}
function ke(e) {
  return Nn(e) ? e : null;
}
function Nn(e) {
  return typeof e == "string" && e.length > 0;
}
function Zu() {
  const e = (t, n) => {
    Xu(t, n);
  };
  Hooks.on("renderChatMessageHTML", e);
}
function Xu(e, t) {
  const n = Wu(e);
  if (!n || n.targets.length === 0) return;
  const r = ed(t);
  if (!r || r.querySelector(`.${d}-chat-enrichment`)) return;
  (r.querySelector(".message-content") ?? r).append(Ju(n));
}
function Ju(e) {
  const t = document.createElement("section");
  t.classList.add(`${d}-chat-enrichment`);
  const n = document.createElement("strong");
  return n.textContent = "Paranormal Toolkit", t.append(n), e.source && t.append(Pa("Origem", e.source.name)), t.append(Pa("Alvo", e.targets.map((r) => r.name).join(", "))), t;
}
function Pa(e, t) {
  const n = document.createElement("p");
  n.classList.add(`${d}-chat-enrichment__row`);
  const r = document.createElement("span");
  r.textContent = `${e}: `;
  const a = document.createElement("span");
  return a.textContent = t, n.append(r, a), n;
}
function ed(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function td() {
  Hooks.on("preCreateChatMessage", (e, t, n, r) => {
    if (!nd(r) || !rd(e) || va(e) || va(t)) return;
    const a = Vu();
    if (a.length === 0 || !Da(e) && !Da(t)) return;
    const o = Fi();
    e.updateSource({
      [Ku()]: Hu(a, o)
    }), m.info("Targets capturados para ChatMessage.", { source: o, targets: a });
  });
}
function nd(e) {
  const t = game.user?.id;
  return !t || typeof e != "string" ? !0 : e === t;
}
function rd(e) {
  return !!(e && typeof e == "object" && "updateSource" in e);
}
let Na = !1, ln = !1, cn = !1, ft = null;
const ad = 1e3, od = 750, id = 1e3;
function sd(e) {
  Na || (Hooks.on("combatTurnChange", (t) => {
    cd(e, xa(t));
  }), Hooks.on("deleteCombat", (t) => {
    ud(e, xa(t));
  }), Na = !0, ld(e));
}
function ld(e) {
  Ut() && (ln || (ln = !0, globalThis.setTimeout(() => {
    ln = !1, Ir(e, "ready");
  }, ad)));
}
function cd(e, t) {
  Ut() && t && (ft && globalThis.clearTimeout(ft), ft = globalThis.setTimeout(() => {
    ft = null, Ir(e, "combat-turn-change", t);
  }, od));
}
function ud(e, t) {
  Ut() && t && (cn || (cn = !0, globalThis.setTimeout(() => {
    cn = !1, Ir(e, "combat-deleted", t);
  }, id)));
}
async function Ir(e, t, n) {
  if (Ut())
    try {
      const r = await e.cleanupExpiredConditions({
        reason: t,
        combatId: n ?? null,
        removeAllForCombat: t === "combat-deleted"
      });
      r.removedEffects > 0 && m.info(
        `Condition Engine removeu ${r.removedEffects} efeito(s) expirado(s). Motivo: ${t}.`
      );
      for (const a of r.failures)
        m.warn(a.message);
    } catch (r) {
      m.warn("Condition Engine não conseguiu limpar condições expiradas.", r);
    }
}
function Ut() {
  return game.user?.isGM === !0;
}
function xa(e) {
  if (!e || typeof e != "object") return null;
  const t = e.id;
  return typeof t == "string" && t.length > 0 ? t : null;
}
const Bi = {
  enabled: "dice.animations.enabled"
};
function dd() {
  game.settings.register(d, Bi.enabled, {
    name: "Animar rolagens com Dice So Nice",
    hint: "Quando o Dice So Nice estiver ativo, anima as rolagens feitas pelo Paranormal Toolkit sem criar mensagens extras no chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function md() {
  return {
    enabled: game.settings.get(d, Bi.enabled) === !0
  };
}
const qt = "chatCard", Oa = "data-paranormal-toolkit-prompt-id", i = `${d}-item-use-prompt`, fd = `.${i}__title`, Ui = `.${i}__header`, pd = `.${i}__roll-card`, gd = `.${i}__roll-meta`, hd = `.${i}__roll-meta-pill`, Cr = `.${i}__resistance`, yd = `.${i}__resistance-header`, qi = `.${i}__resistance-description`, Gt = `.${i}__resistance-roll-button`, Gi = `.${i}__resistance-roll-result`, Ma = `${i}__resistance-content`, ji = `.${i}__workflow-section`, zi = `.${i}__workflow-roll`, Sr = `${i}__workflow-roll--dice-open`, Lr = `.${i}__workflow-roll-formula`, vr = `${i}__workflow-roll-formula--toggle`, jt = `.${i}__workflow-dice-tray`, bd = `.${i}__roll-detail-toggle`, Ad = `.${i}__roll-detail-list`, _d = `.${i}__ritual-element-badge`, Td = `.${i}__ritual-metadata`, Rd = "casting-backlash", $d = "data-paranormal-toolkit-action-section", wd = "data-paranormal-toolkit-prompt-id", kd = "data-paranormal-toolkit-pending-id", Fa = "data-paranormal-toolkit-casting-backlash-enhanced", Ba = `.${i}`, Ed = `.${i}__workflow-section--casting`, Id = `.${i}__workflow-section-header`, Cd = `.${i}__workflow-notes`, Sd = `[${$d}="${Rd}"]`, Ua = `${i}__workflow-section-title-row`, Ld = `${i}__workflow-section-header--casting-backlash`, Vi = `${i}__casting-backlash-button`;
function vd(e) {
  for (const t of Dd(e))
    Pd(t), Fd(t);
}
function Dd(e) {
  const t = /* @__PURE__ */ new Set();
  e instanceof HTMLElement && e.matches(Ba) && t.add(e);
  for (const n of e.querySelectorAll(Ba))
    t.add(n);
  return Array.from(t);
}
function Pd(e) {
  const t = e.querySelector(Sd);
  if (!t) return;
  const n = Nd(t);
  if (!n) return;
  const r = e.querySelector(`${Ed} ${Id}`);
  r && (r.classList.add(Ld), xd(r), Od(n), r.append(n), t.remove());
}
function Nd(e) {
  return e.querySelector(
    `button[${kd}], button[${wd}]`
  );
}
function xd(e) {
  const t = e.querySelector(`:scope > .${Ua}`);
  if (t) return t;
  const n = document.createElement("div");
  n.classList.add(Ua);
  const r = Array.from(e.childNodes);
  e.prepend(n);
  for (const a of r)
    a !== n && (a instanceof HTMLButtonElement && a.classList.contains(Vi) || n.append(a));
  return n;
}
function Od(e) {
  if (e.getAttribute(Fa) === "true") return;
  const t = e.textContent?.trim() || "Aplicar dano na SAN", n = Md(t, e.disabled);
  e.classList.add(Vi), e.setAttribute(Fa, "true"), e.setAttribute("title", n), e.setAttribute("aria-label", n);
}
function Md(e, t) {
  return t ? "Dano na SAN já aplicado" : `${e.toLocaleLowerCase().includes("san") ? e : `${e} na SAN`} no conjurador`;
}
function Fd(e) {
  for (const t of e.querySelectorAll(Cd)) {
    for (const n of Array.from(t.children))
      (n.textContent?.trim() ?? "").startsWith("Falha de conjuração:") && n.remove();
    t.children.length === 0 && t.remove();
  }
}
function Bd(e) {
  for (const t of Array.from(e.querySelectorAll(ji)))
    for (const n of Array.from(t.querySelectorAll(`${bd}, ${Ad}`)))
      n.remove();
}
const Ud = {
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
}, qd = new Set(
  Object.values(Ud)
), Gd = {
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
function jd(e) {
  if (e == null)
    return { ok: !0, value: null, normalized: null };
  const t = zd(e);
  if (!t)
    return { ok: !0, value: null, normalized: null };
  const n = Gd[t];
  return n !== void 0 ? { ok: !0, value: n, normalized: t } : qd.has(e) ? { ok: !0, value: e, normalized: t } : { ok: !1, input: e, normalized: t };
}
function Hi(e) {
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
function zd(e) {
  const t = e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
class Wi {
  async applyDamage(t) {
    const n = t.actor, r = n.name ?? "Ator sem nome", a = n.id ?? null;
    if (!Array.isArray(t.instances) || t.instances.length === 0)
      return g({
        actor: n,
        actorId: a,
        actorName: r,
        reason: "empty-damage",
        message: "Nenhuma instância de dano foi informada."
      });
    const o = n.applyDamage;
    if (typeof o != "function")
      return g({
        actor: n,
        actorId: a,
        actorName: r,
        reason: "unsupported-actor",
        message: "O sistema Ordem atual não expõe actor.applyDamage para este ator."
      });
    const s = [], l = /* @__PURE__ */ new Set();
    let c = null;
    for (const [u, f] of t.instances.entries()) {
      const y = Vd(f, u);
      if (!y.ok)
        return g({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "invalid-amount",
          message: "A quantidade de dano deve ser um inteiro maior ou igual a zero.",
          instance: f
        });
      const $ = jd(f.damageType);
      if (!$.ok)
        return g({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "unknown-damage-type",
          message: `Tipo de dano não reconhecido pelo adapter de Ordem: ${String(f.damageType)}.`,
          instance: f,
          damageType: f.damageType
        });
      if (y.amount === 0) {
        s.push(
          Hd(y.id, f, $.value)
        );
        continue;
      }
      try {
        const b = await Promise.resolve(
          o.call(n, y.amount, {
            damageType: $.value ?? void 0,
            ignoreRD: f.ignoreResistance === !0,
            nonLethal: f.nonLethal === !0
          })
        );
        for (const T of Kd(b.conditions))
          l.add(T);
        const p = Wd(b.newPV);
        p !== null && (c = p), s.push({
          id: y.id,
          label: f.label ?? Hi($.value),
          sourceRollId: f.sourceRollId ?? null,
          inputAmount: y.amount,
          finalDamage: qa(b.finalDamage, y.amount),
          blocked: qa(b.blocked, 0),
          damageType: f.damageType ? String(f.damageType) : null,
          systemDamageType: $.value,
          ignoreResistance: f.ignoreResistance === !0,
          nonLethal: f.nonLethal === !0
        });
      } catch (b) {
        return g({
          actor: n,
          actorId: a,
          actorName: r,
          reason: "application-failed",
          message: `Falha ao aplicar dano em ${r}.`,
          instance: f,
          cause: b
        });
      }
    }
    return A({
      actor: n,
      actorId: a,
      actorName: r,
      totalRawDamage: s.reduce(
        (u, f) => u + f.inputAmount,
        0
      ),
      totalFinalDamage: s.reduce(
        (u, f) => u + f.finalDamage,
        0
      ),
      totalBlocked: s.reduce(
        (u, f) => u + f.blocked,
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
function Vd(e, t) {
  if (!Number.isFinite(e.amount)) return { ok: !1 };
  const n = Math.max(0, Math.trunc(e.amount));
  return n < 0 ? { ok: !1 } : {
    ok: !0,
    id: e.id ?? `damage-${t + 1}`,
    amount: n
  };
}
function Hd(e, t, n) {
  return {
    id: e,
    label: t.label ?? Hi(n),
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
function qa(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function Wd(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Kd(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.length > 0
  ) : [];
}
class Dr {
  async rollResistance(t) {
    const n = await Qd(t.actor, t.skill);
    if (!n)
      throw new Error(`Não foi possível rolar a resistência ${t.skill} pelo sistema Ordem.`);
    return {
      skill: t.skill,
      skillLabel: t.skillLabel ?? me(t.skill),
      roll: n,
      formula: Xd(n),
      total: Jd(n),
      diceBreakdown: em(n)
    };
  }
  getSkillLabel(t) {
    return me(t);
  }
}
async function Yd(e, t) {
  return new Dr().rollResistance({ actor: e, skill: t });
}
function me(e) {
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
async function Qd(e, t) {
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
  return Zd(r);
}
function Zd(e) {
  return Ga(e) ? e : Array.isArray(e) ? e.find(Ga) ?? null : null;
}
function Ga(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function Xd(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function Jd(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function em(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(tm);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function tm(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
class Ki {
  constructor(t) {
    this.adapter = t;
  }
  adapter;
  async applyDamage(t) {
    return this.adapter.applyDamage(t);
  }
}
class Yi {
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
function nm(e, t) {
  const n = cm(e?.rounds);
  if (!n)
    return ja(null);
  const r = e?.anchor ?? Qi(t);
  if (!r)
    return {
      ...ja(n),
      warning: `Duração de ${n} rodada(s) ignorada porque não há combate ativo.`
    };
  const a = e?.expiry ?? "turnStart";
  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: rm(),
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
function Qi(e) {
  const t = um();
  if (!t?.id || !Zi(t.round)) return null;
  const n = sm(t), r = am(e, n) ?? im(t), a = Z(r?.id), o = mm(r?.initiative), s = om(t, r, n);
  return {
    mode: "combatantTurn",
    combatId: t.id,
    combatantId: a,
    round: t.round,
    turn: s,
    initiative: o,
    time: dm()
  };
}
function rm() {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}
function ja(e) {
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
function am(e, t) {
  return e?.id ? t.find((n) => lm(n) === e.id) ?? null : null;
}
function om(e, t, n) {
  const r = Z(t?.id);
  if (r) {
    const a = n.findIndex((o) => o.id === r);
    if (a >= 0) return a;
  }
  return fm(e.turn) ? e.turn : null;
}
function im(e) {
  return _t(e.combatant) ? e.combatant : null;
}
function sm(e) {
  const t = e.combatants;
  if (Array.isArray(t)) return t.filter(_t);
  if (t && typeof t == "object") {
    const n = t.contents;
    if (Array.isArray(n)) return n.filter(_t);
    const r = t.values;
    if (typeof r == "function")
      return Array.from(r.call(t)).filter(_t);
  }
  return [];
}
function lm(e) {
  return Z(e.actor?.id) ?? Z(e.actorId) ?? Z(e.token?.actor?.id) ?? Z(e.token?.actorId) ?? Z(e.document?.actor?.id) ?? Z(e.document?.actorId);
}
function cm(e) {
  return Zi(e) ? Math.trunc(e) : null;
}
function um() {
  return game.combat ?? null;
}
function dm() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function _t(e) {
  return !!(e && typeof e == "object");
}
function Z(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function mm(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Zi(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function fm(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
class Xi {
  constructor(t) {
    this.registry = t;
  }
  registry;
  listConditions() {
    return this.registry.list();
  }
  getCondition(t) {
    const n = this.registry.get(t);
    return n.ok ? A(n.value) : g({
      conditionId: t,
      reason: "condition-not-found",
      message: n.error.message
    });
  }
  async applyCondition(t) {
    const n = this.registry.get(t.conditionId);
    if (!n.ok)
      return g({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "condition-not-found",
        message: n.error.message
      });
    const r = t.actor;
    if (!$m(r))
      return g({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${t.actor?.name ?? "sem nome"}.`
      });
    const a = n.value, o = nm(t.duration, r), s = pm(a, t, o), c = t.refreshExisting ?? !0 ? wm(r, a.id) : null;
    if (c)
      try {
        return await Promise.resolve(c.update?.(s)), A(za(r, a, c.id ?? null, !1, !0, o));
      } catch (u) {
        return g({
          actor: r,
          actorId: r.id ?? null,
          actorName: r.name ?? "Ator sem nome",
          conditionId: a.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${a.label} em ${r.name ?? "ator sem nome"}.`,
          cause: u
        });
      }
    try {
      const f = (await r.createEmbeddedDocuments("ActiveEffect", [s]))[0]?.id ?? null;
      return A(za(r, a, f, !0, !1, o));
    } catch (u) {
      return g({
        actor: r,
        actorId: r.id ?? null,
        actorName: r.name ?? "Ator sem nome",
        conditionId: a.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${a.label} em ${r.name ?? "ator sem nome"}.`,
        cause: u
      });
    }
  }
  async removeCondition(t) {
    const n = t.actor;
    if (!n || typeof n != "object")
      return g({
        actor: t.actor,
        actorId: t.actor?.id ?? null,
        actorName: t.actor?.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "invalid-actor",
        message: "Ator inválido para remover condição."
      });
    const r = this.resolveCanonicalConditionId(t.conditionId), a = es(n, r);
    let o = 0;
    try {
      for (const s of a)
        await Va(n, s) === "deleted" && (o += 1);
    } catch (s) {
      return g({
        actor: n,
        actorId: n.id ?? null,
        actorName: n.name ?? "Ator sem nome",
        conditionId: t.conditionId,
        reason: "delete-failed",
        message: `Falha ao remover condição ${t.conditionId} de ${n.name ?? "ator sem nome"}.`,
        cause: s
      });
    }
    return A({
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
    const n = Im(), r = [];
    let a = 0, o = 0;
    for (const s of n) {
      const l = Pr(s);
      a += l.length;
      for (const c of l) {
        if (!ym(c, t)) continue;
        const u = Ji(c);
        try {
          await Va(s, c) === "deleted" && (o += 1);
        } catch (f) {
          r.push({
            actorId: s.id ?? null,
            actorName: s.name ?? "Ator sem nome",
            effectId: c.id ?? null,
            conditionId: u.conditionId,
            message: `Falha ao remover condição expirada ${u.conditionId ?? c.name ?? "desconhecida"} de ${s.name ?? "ator sem nome"}.`,
            cause: f
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
function pm(e, t, n) {
  const r = {
    schemaVersion: 1,
    conditionId: e.id,
    conditionLabel: e.label,
    definitionVersion: e.definitionVersion,
    source: t.source ?? null,
    originUuid: t.originUuid ?? null,
    appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
    appliedByUserId: Mm(),
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
    duration: gm(n.duration),
    start: hm(n.start),
    showIcon: 2,
    statuses: [e.id],
    flags: {
      [d]: r
    }
  };
}
function gm(e) {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...e
  };
}
function hm(e) {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: Om(),
    ...e
  };
}
function za(e, t, n, r, a, o) {
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
function ym(e, t) {
  const n = Ji(e);
  if (!n.conditionId || !bm(n)) return !1;
  if (t.removeAllForCombat === !0)
    return !!(t.combatId && n.combatId === t.combatId);
  const r = xm();
  return n.durationMode === "combatantTurn" || Am(n) ? Tm(n, r) : _m(e) || !r?.id || n.combatId && n.combatId !== r.id ? !0 : !M(n.startRound) || !M(n.requestedRounds) || !M(r.round) ? !1 : r.round >= n.startRound + n.requestedRounds;
}
function bm(e) {
  return e.deleteOnExpire || e.expiresWithCombat ? !0 : e.combatDurationApplied && M(e.requestedRounds);
}
function Am(e) {
  return !!(e.combatDurationApplied && M(e.requestedRounds) && M(e.startRound) && (e.startCombatantId || Et(e.startTurn)));
}
function _m(e) {
  const t = e.duration;
  if (!t || typeof t != "object") return !1;
  if (t.expired === !0) return !0;
  const n = t.remaining;
  return typeof n == "number" && Number.isFinite(n) && n <= 0;
}
function Tm(e, t) {
  if (!t?.id || e.combatId && e.combatId !== t.id || !M(e.startRound) || !M(e.requestedRounds) || !M(t.round)) return !1;
  const n = e.startRound + e.requestedRounds;
  if (t.round < n) return !1;
  if (t.round > n) return !0;
  const r = Rm(t);
  return e.startCombatantId ? r === e.startCombatantId : Et(e.startTurn) && Et(t.turn) ? t.turn === e.startTurn : !1;
}
function Rm(e) {
  return Ee(e.combatant?.id);
}
function Ji(e) {
  const t = e.duration && typeof e.duration == "object" ? e.duration : {}, n = e.start && typeof e.start == "object" ? e.start : {};
  return {
    conditionId: Tt(e, "conditionId"),
    requestedRounds: Ha(e, "requestedRounds") ?? We(t.value) ?? We(t.rounds),
    combatDurationApplied: un(e, "combatDurationApplied"),
    combatId: Tt(e, "combatId") ?? Ee(n.combat) ?? Ee(t.combat),
    startCombatantId: Tt(e, "startCombatantId") ?? Ee(n.combatant),
    startInitiative: vm(e, "startInitiative") ?? ts(n.initiative),
    startRound: Ha(e, "startRound") ?? We(n.round) ?? We(t.startRound),
    startTurn: Lm(e, "startTurn") ?? xn(n.turn) ?? xn(t.startTurn),
    expiryEvent: Dm(e, "expiryEvent") ?? ns(t.expiry),
    durationMode: Pm(e, "durationMode"),
    deleteOnExpire: un(e, "deleteOnExpire"),
    expiresWithCombat: un(e, "expiresWithCombat")
  };
}
function $m(e) {
  return !!(e && typeof e.createEmbeddedDocuments == "function");
}
function wm(e, t) {
  return es(e, t)[0] ?? null;
}
function es(e, t) {
  return Pr(e).filter((n) => Sm(n) === t);
}
async function Va(e, t) {
  const n = t.id ?? null, r = n ? km(e, n) : t;
  if (!r) return "missing";
  try {
    return await Promise.resolve(r.delete?.()), "deleted";
  } catch (a) {
    if (Em(a)) return "missing";
    throw a;
  }
}
function km(e, t) {
  return Pr(e).find((n) => n.id === t) ?? null;
}
function Em(e) {
  const t = e instanceof Error ? e.message : String(e);
  return t.includes("does not exist in the EmbeddedCollectionDelta collection") || t.includes("does not exist in the EmbeddedCollection collection");
}
function Im() {
  const e = /* @__PURE__ */ new Map(), t = game.actors;
  if (Array.isArray(t?.contents))
    for (const n of t.contents)
      pt(e, n);
  typeof t?.forEach == "function" && t.forEach((n) => {
    pt(e, n);
  });
  for (const n of Cm())
    pt(e, n.actor), pt(e, n.document?.actor);
  return Array.from(e.values());
}
function pt(e, t) {
  if (!Nm(t)) return;
  const r = Ee(t.uuid) ?? t.id ?? t.name ?? `actor-${e.size}`;
  e.set(r, t);
}
function Cm() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function Pr(e) {
  const t = e.effects;
  return t ? Array.isArray(t) ? t : Array.isArray(t.contents) ? t.contents : typeof t.filter == "function" ? t.filter(() => !0) : [] : [];
}
function Sm(e) {
  return Tt(e, "conditionId");
}
function Tt(e, t) {
  return Ee(ge(e, t));
}
function Ha(e, t) {
  return We(ge(e, t));
}
function Lm(e, t) {
  return xn(ge(e, t));
}
function vm(e, t) {
  return ts(ge(e, t));
}
function Dm(e, t) {
  return ns(ge(e, t));
}
function Pm(e, t) {
  const n = ge(e, t);
  return n === "combatantTurn" || n === "sourceTurn" ? "combatantTurn" : "none";
}
function un(e, t) {
  return ge(e, t) === !0;
}
function ge(e, t) {
  const n = e.getFlag?.(d, t);
  if (n !== void 0) return n;
  const r = e.flags;
  if (!r || typeof r != "object") return;
  const a = r[d];
  if (!(!a || typeof a != "object"))
    return a[t];
}
function Ee(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function We(e) {
  return M(e) ? Math.trunc(e) : null;
}
function xn(e) {
  return Et(e) ? Math.trunc(e) : null;
}
function ts(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ns(e) {
  return e === "turnStart" || e === "turnEnd" ? e : null;
}
function Nm(e) {
  return !!(e && typeof e == "object" && "effects" in e);
}
function xm() {
  return game.combat ?? null;
}
function Om() {
  const e = game.time?.worldTime;
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function M(e) {
  return typeof e == "number" && Number.isInteger(e) && e > 0;
}
function Et(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0;
}
function Mm() {
  return game.user?.id ?? null;
}
const Fm = "icons/svg/downgrade.svg", Bm = "Condição informativa gerenciada pelo Paranormal Toolkit. A automação mecânica será adicionada em versão futura.";
function _(e) {
  return {
    id: e.id,
    aliases: e.aliases ?? [],
    label: e.label,
    icon: e.icon ?? Fm,
    description: Bm,
    definitionVersion: e.definitionVersion ?? "1.0.0",
    changes: []
  };
}
const Um = _({
  id: "shaken",
  label: "Abalado",
  aliases: ["abalado"]
}), qm = _({
  id: "frightened",
  label: "Apavorado",
  aliases: ["apavorado"]
}), Gm = _({
  id: "confused",
  label: "Confuso",
  aliases: ["confuso"]
}), jm = _({
  id: "insane",
  label: "Enlouquecido",
  aliases: ["enlouquecido"]
}), zm = _({
  id: "exhausted",
  label: "Exausto",
  aliases: ["exausto"]
}), Vm = _({
  id: "fatigued",
  label: "Fatigado",
  aliases: ["fatigado"]
}), Hm = _({
  id: "frustrated",
  label: "Frustrado",
  aliases: ["frustrado"]
}), Wm = _({
  id: "dazed",
  label: "Pasmo",
  aliases: ["pasmo"]
}), Km = _({
  id: "blinded",
  label: "Cego",
  aliases: ["cego"]
}), Ym = _({
  id: "debilitated",
  label: "Debilitado",
  aliases: ["debilitado"]
}), Qm = _({
  id: "dehydrated",
  label: "Desidratado",
  aliases: ["desidratado"]
}), Zm = _({
  id: "diseased",
  label: "Doente",
  aliases: ["doente"]
}), Xm = _({
  id: "poisoned",
  label: "Envenenado",
  aliases: ["envenenado"]
}), Jm = _({
  id: "starving",
  label: "Esfomeado",
  aliases: ["esfomeado"]
}), ef = _({
  id: "stabbed",
  label: "Esfaqueado",
  aliases: ["esfaqueado"]
}), tf = _({
  id: "weakened",
  label: "Fraco",
  aliases: ["fraco"]
}), nf = _({
  id: "bleeding",
  label: "Sangrando",
  aliases: ["sangrando"]
}), rf = _({
  id: "deafened",
  label: "Surdo",
  aliases: ["surdo"]
}), af = _({
  id: "grabbed",
  label: "Agarrado",
  aliases: ["agarrado"]
}), of = _({
  id: "prone",
  label: "Caído",
  aliases: ["caido", "caído"]
}), sf = _({
  id: "flatFooted",
  label: "Desprevenido",
  aliases: ["desprevenido"]
}), lf = _({
  id: "entangled",
  label: "Enredado",
  aliases: ["enredado"]
}), cf = _({
  id: "flanked",
  label: "Flanqueado",
  aliases: ["flanqueado"]
}), uf = _({
  id: "immobilized",
  label: "Imóvel",
  aliases: ["imovel", "imóvel"]
}), df = _({
  id: "slowed",
  label: "Lento",
  aliases: ["lento"]
}), mf = _({
  id: "dazzled",
  label: "Ofuscado",
  aliases: ["ofuscado"]
}), ff = _({
  id: "paralyzed",
  label: "Paralisado",
  aliases: ["paralisado"]
}), pf = _({
  id: "restrained",
  label: "Preso",
  aliases: ["preso"]
}), gf = _({
  id: "vulnerable",
  label: "Vulnerável",
  aliases: ["vulneravel", "vulnerável"]
}), hf = _({
  id: "suffocating",
  label: "Asfixiado",
  aliases: ["asfixiado"]
}), yf = _({
  id: "unconscious",
  label: "Inconsciente",
  aliases: ["inconsciente"]
}), bf = _({
  id: "helpless",
  label: "Indefeso",
  aliases: ["indefeso"]
}), Af = _({
  id: "dying",
  label: "Morrendo",
  aliases: ["morrendo"]
}), _f = _({
  id: "petrified",
  label: "Petrificado",
  aliases: ["petrificado"]
}), Tf = [
  Um,
  qm,
  Gm,
  jm,
  zm,
  Vm,
  Hm,
  Wm,
  Km,
  Ym,
  Qm,
  Zm,
  Xm,
  Jm,
  ef,
  tf,
  nf,
  rf,
  af,
  of,
  sf,
  lf,
  cf,
  uf,
  df,
  mf,
  ff,
  pf,
  gf,
  hf,
  yf,
  bf,
  Af,
  _f
];
class Rf {
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
    return Array.from(this.definitions.values()).map(Wa);
  }
  get(t) {
    const n = this.lookup.get(Ka(t)), r = n ? this.definitions.get(n) : null;
    return r ? A(Wa(r)) : g({
      reason: "condition-not-found",
      conditionId: t,
      message: `Condição não registrada no Paranormal Toolkit: ${t}.`
    });
  }
  registerLookup(t, n) {
    const r = Ka(t);
    r && this.lookup.set(r, n);
  }
}
function rs() {
  return new Rf(Tf);
}
function Wa(e) {
  return {
    ...e,
    aliases: e.aliases ? [...e.aliases] : void 0,
    changes: e.changes.map((t) => ({ ...t }))
  };
}
function Ka(e) {
  return e.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}
function De(e) {
  return e.applyOnResistance ?? "failure";
}
function as(e) {
  return e.kind === "succeeded" ? "success" : e.kind === "failed" ? "failure" : null;
}
function os(e, t) {
  const n = De(e);
  return n === "always" ? !0 : t ? n === t : !1;
}
function is(e) {
  const t = De(e);
  return t === "failure" || t === "success";
}
function $f(e, t, n, r) {
  const a = e.filter((c) => os(c, t));
  if (a.length === 0)
    return t ? null : e[0] ?? null;
  const o = t ? a.filter((c) => De(c) === t) : [], s = o.length > 0 ? o : a;
  if (s.length === 1) return s[0] ?? null;
  const l = r(n);
  return l ? s.find((c) => [c.label, c.conditionId].some((u) => r(u) === l)) ?? s[0] ?? null : s[0] ?? null;
}
const wf = {
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
}, kf = {
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
function Ef(e) {
  return ls(e, wf, !1);
}
function If(e) {
  return ls(e, kf, !e.allowsSuccessfulResistance);
}
function Me(e) {
  return e.kind === "waiting-resistance";
}
function ss(e) {
  return e.kind === "resisted";
}
function ls(e, t, n) {
  const r = { ...t, ...e.labels };
  return e.alreadyApplied ? Re("applied", !1, r.applied, r.appliedCompact, null) : e.unavailable ? Re("unavailable", !1, r.unavailable, r.unavailableCompact, r.unavailable) : e.requiresResolvedResistance && (e.resistanceState.kind === "pending" || e.resistanceState.kind === "none") || Bt(e.resistanceGateMode, e.resistanceState) ? Re(
    "waiting-resistance",
    !1,
    r.waitingResistance,
    r.waitingResistanceCompact,
    "Role a resistência antes de aplicar esta ação."
  ) : n && e.resistanceState.kind === "succeeded" ? Re("resisted", !1, r.resisted, r.resistedCompact, r.resisted) : Re("available", !0, r.available, r.availableCompact, null);
}
function Re(e, t, n, r, a) {
  return {
    kind: e,
    enabled: t,
    label: n,
    compactLabel: r,
    reason: a
  };
}
const Ke = "data-paranormal-toolkit-prompt-id", Cf = "data-paranormal-toolkit-resistance-roll-result", Sf = "Conjuração DT";
function Lf(e) {
  const t = e.querySelector(Gt)?.getAttribute(Cf), n = Je(t);
  if (n !== null) return n;
  const r = e.querySelector(Gi)?.textContent ?? null, a = r ? /=\s*(-?\d+)\s*$/u.exec(r) : null;
  return Je(a?.[1] ?? null);
}
function cs(e) {
  const t = us(e), n = Pf(t);
  if (n !== null) return n;
  const r = Nf(t);
  return r !== null ? r : xf(e);
}
function vf(e) {
  const t = us(e);
  return t ? {
    actorId: dn(t.actorId),
    itemId: dn(t.itemId),
    itemName: dn(t.itemName)
  } : null;
}
function Df(e) {
  const t = e.getAttribute(Ke);
  if (!t) return null;
  const n = ds(e), r = ms(n), s = (Array.isArray(r?.prompts) ? r.prompts : []).find((l) => zt(l) ? l.pendingId === t : !1)?.buttonLabel;
  return typeof s == "string" && s.trim().length > 0 ? s.trim() : null;
}
function X(e) {
  return e?.trim().toLocaleLowerCase() ?? "";
}
function On(e) {
  return X(e).normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function Pf(e) {
  const t = Mf(e);
  return t.length === 0 ? null : Je(Ff(t, Sf));
}
function Nf(e) {
  const t = typeof e?.actorId == "string" ? e.actorId : null;
  if (!t) return null;
  const r = game.actors?.get?.(t);
  return !r || typeof r != "object" ? null : Ya(r, ["system", "ritual", "DT"]) ?? Ya(r, ["system", "ritual", "dt"]);
}
function xf(e) {
  const t = Array.from(e.querySelectorAll(`.${i}__workflow-section--casting .${i}__workflow-section-description`)).map((r) => r.textContent).find((r) => typeof r == "string" && r.includes("DT"));
  if (!t) return null;
  const n = /\bDT\s*(-?\d+)\b/iu.exec(t);
  return Je(n?.[1] ?? null);
}
function us(e) {
  const t = Of(e);
  if (!t) return null;
  const n = ds(e), r = ms(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => zt(o) ? o.pendingId === t : !1) ?? null;
}
function Of(e) {
  return (e.closest(`[${Ke}]`) ?? e.querySelector(`[${Ke}]`) ?? e.parentElement?.querySelector(`[${Ke}]`) ?? null)?.getAttribute(Ke) ?? null;
}
function ds(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Bf(a) ? a : null;
}
function ms(e) {
  const t = e?.getFlag?.(d, qt);
  return zt(t) ? t : null;
}
function Mf(e) {
  return Array.isArray(e?.summaryLines) ? e.summaryLines.filter((t) => typeof t == "string") : [];
}
function Ff(e, t) {
  const n = `${t}:`;
  for (const r of e) {
    if (!r.startsWith(n)) continue;
    const a = r.slice(n.length).trim();
    if (a.length > 0) return a;
  }
  return null;
}
function Ya(e, t) {
  let n = e;
  for (const r of t) {
    if (!zt(n)) return null;
    n = n[r];
  }
  return typeof n == "number" ? Math.trunc(n) : Je(typeof n == "string" ? n : null);
}
function Je(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
function Bf(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function zt(e) {
  return !!(e && typeof e == "object");
}
function dn(e) {
  return typeof e == "string" && e.trim().length > 0 ? e : null;
}
function Vt(e) {
  return fs({
    hasResistance: !!e.querySelector(Cr),
    difficulty: cs(e),
    resistanceTotal: Lf(e)
  });
}
function Uf(e) {
  if (!e.hasResistance || e.difficulty === null)
    return fs({
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
function fs(e) {
  return {
    hasResistance: e.hasResistance,
    difficulty: e.difficulty,
    total: e.resistanceTotal,
    state: Ru(e)
  };
}
function he() {
  return game.user?.isGM === !0;
}
function fe() {
  return he();
}
function qf(e) {
  const t = Bt(e.resistanceGateMode, e.resistanceState), n = Gf(e.resistanceState, e.hasDamage), r = jf(e.resistanceState, e.hasEffect, !!e.effectCanApplyOnSuccessfulResistance), a = Ef({
    resistanceGateMode: e.resistanceGateMode,
    resistanceState: e.resistanceState,
    alreadyApplied: e.damageAlreadyApplied,
    unavailable: !e.hasDamage
  }), o = If({
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
function Gf(e, t) {
  return t ? e.kind === "succeeded" ? "half" : "normal" : null;
}
function jf(e, t, n = !1) {
  return t ? e.kind === "succeeded" && !n ? "resisted" : "applicable" : "unavailable";
}
function Nr(e) {
  const t = e.isGM ?? fe();
  return {
    targetId: e.targetId,
    targetName: e.targetName,
    resistanceState: e.resistanceState,
    damage: e.damage,
    effect: e.effect,
    policy: qf({
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
function zf(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-roll`, ...e.classNames ?? []);
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula;
  const r = document.createElement("strong");
  r.classList.add(`${i}__workflow-roll-total`), r.textContent = e.total === null ? "—" : String(e.total), t.append(n, r);
  const a = Hf(e.formula, e.diceBreakdown ?? null);
  return a && t.append(a), t;
}
function Vf(e) {
  const t = Array.from(e?.querySelectorAll(`.${i}__workflow-die`) ?? []).map((n) => n.textContent?.trim() ?? "").filter((n) => n.length > 0);
  return t.length > 0 ? `(${t.join(", ")})` : null;
}
function Hf(e, t) {
  const n = Wf(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${i}__workflow-dice-tray`);
  for (const a of Kf(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${i}__workflow-die`), a.active || o.classList.add(`${i}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function Wf(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function Kf(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? Qa(e, "highest") : n.includes("kl") ? Qa(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function Qa(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
const Yf = "data-paranormal-toolkit-resistance-skill", Qf = "data-paranormal-toolkit-resistance-skill-label", ps = "pending", xr = "success", Or = "failure", gs = "rolled";
function Zf(e) {
  const t = np(e.rollCard, [
    e.damageSection,
    e.effectSection,
    e.rollCard
  ]), n = e.damageSection ? ep(e.damageSection) : null, r = Za(e.rollCard, e.effectSection, e.resolveTargetConditionApplication, null), a = Xf(e.rollCard).map((o, s) => {
    const l = Jf(o, s), c = e.resistanceResults.get(l) ?? null, u = sp(c, t?.difficulty ?? null), f = e.damageApplications.get(l) ?? null, y = e.effectApplications.get(l) ?? null, $ = Uf({
      hasResistance: !!t,
      difficulty: t?.difficulty ?? null,
      total: c?.total ?? null,
      status: dp(u)
    }).state, b = Za(
      e.rollCard,
      e.effectSection,
      e.resolveTargetConditionApplication,
      as($)
    ) ?? r;
    return {
      id: l,
      name: o,
      state: u,
      resistanceResult: c,
      damageApplication: f,
      effectApplication: y,
      effect: b,
      assistedActions: Nr({
        targetId: l,
        targetName: o,
        resistanceGateMode: e.resistanceGateMode,
        resistanceState: $,
        damage: n,
        effect: b,
        damageAlreadyApplied: !!f,
        effectAlreadyApplied: !!y,
        effectCanApplyOnSuccessfulResistance: b?.applyOnResistance === "success" || b?.applyOnResistance === "always",
        effectRequiresResolvedResistance: b ? is(b) : !1
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
function Xf(e) {
  const n = e.closest(`.${i}`)?.querySelector(`.${i}__summary`)?.textContent ?? "", [, r] = n.split("→");
  return r ? r.split(",").map((a) => a.trim()).filter((a) => a.length > 0 && hs(a) !== "nenhum alvo") : [];
}
function Jf(e, t) {
  return `${hs(e)}:${t}`;
}
function ep(e) {
  const t = lp(e), n = t !== null ? Math.floor(t / 2) : null;
  return {
    typeLabel: up(e),
    formula: cp(e) ?? "—",
    total: t,
    diceBreakdown: Vf(e),
    normalAmount: t,
    halfAmount: n,
    normalLabel: t !== null ? `Normal: ${t} PV` : "Normal: —",
    normalCompactLabel: t !== null ? `${t} PV` : "—",
    halfLabel: n !== null ? `Metade: ${n} PV` : null,
    halfCompactLabel: n !== null ? `½ ${n} PV` : null
  };
}
function Za(e, t, n, r) {
  const a = t?.querySelector(`.${i}__effect-section-label`)?.textContent?.trim(), o = n(e, a ?? null, r);
  return o ? {
    label: a && a.length > 0 ? a : o.conditionLabel,
    conditionId: o.conditionId,
    conditionLabel: o.conditionLabel,
    duration: tp(o.duration),
    source: o.source,
    originUuid: o.originUuid,
    applyOnResistance: De(o)
  } : null;
}
function tp(e) {
  return e ? {
    rounds: e.rounds ?? null,
    expiry: e.expiry ?? null
  } : null;
}
function np(e, t) {
  const n = rp(t), r = ap(n)?.textContent?.trim(), a = op(n), o = a?.getAttribute(Yf) ?? null, s = a?.getAttribute(Qf) ?? (o ? me(o) : null);
  return !r && !o ? null : {
    description: r ?? "Resistência do alvo.",
    formula: ip(n)?.textContent?.trim() ?? null,
    skill: o,
    skillLabel: s,
    difficulty: cs(e)
  };
}
function rp(e) {
  const t = [];
  for (const n of e)
    !n || t.includes(n) || t.push(n);
  return t;
}
function ap(e) {
  return Mr(e, `.${i}__resistance-description`);
}
function op(e) {
  return Mr(e, Gt);
}
function ip(e) {
  return Mr(
    e,
    `.${i}__resistance .${i}__workflow-roll-formula`
  );
}
function Mr(e, t) {
  for (const n of e) {
    const r = n.querySelector(t);
    if (r) return r;
  }
  return null;
}
function sp(e, t) {
  return e ? t === null ? gs : e.total >= t ? xr : Or : ps;
}
function lp(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-total`)?.textContent?.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d-]/gu, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function cp(e) {
  const t = e?.querySelector(`.${i}__workflow-roll-formula`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function up(e) {
  const t = e?.querySelector(`.${i}__workflow-section-description`)?.textContent?.trim();
  return t && t.length > 0 ? t : null;
}
function hs(e) {
  return e?.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim().toLocaleLowerCase() ?? "";
}
function dp(e) {
  return e === xr ? "succeeded" : e === Or ? "failed" : "pending";
}
function ys(e) {
  if (!e) return null;
  const t = e.actorId ? pp(e.actorId) : null, n = t ? mp(t, e.itemId, e.itemName) : null;
  return n || fp(e.itemId, e.itemName);
}
function mp(e, t, n) {
  const r = e.items;
  if (t) {
    const o = r?.get?.(t);
    if (Ie(o)) return o;
  }
  const a = It(n);
  if (a) {
    const o = r?.find?.((s) => Ie(s) ? It(s.name) === a : !1);
    if (Ie(o)) return o;
  }
  return null;
}
function fp(e, t) {
  const n = game.items;
  if (e) {
    const a = n?.get?.(e);
    if (Ie(a)) return a;
  }
  const r = It(t);
  if (r) {
    const a = n?.find?.((o) => Ie(o) ? It(o.name) === r : !1);
    if (Ie(a)) return a;
  }
  return null;
}
function pp(e) {
  const n = game.actors?.get?.(e);
  return gp(n) ? n : null;
}
function gp(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ie(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && typeof e.name == "string");
}
function It(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Fr(e) {
  const t = mn(e);
  if (!t) return null;
  const n = hp().filter((o) => mn(yp(o)) === t).map((o) => bs(o)).find(Ze) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => Ze(o) && mn(o.name) === t);
  return Ze(a) ? a : null;
}
function hp() {
  const t = globalThis.canvas?.tokens?.placeables;
  return Array.isArray(t) ? t : [];
}
function yp(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : bs(e)?.name ?? null;
}
function bs(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Ze(t)) return t;
  const n = e.document?.actor;
  return Ze(n) ? n : null;
}
function Ze(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function mn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function As(e) {
  const t = Tp();
  t.length !== 0 && await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: e.actor }),
    whisper: t,
    content: bp(e)
  });
}
function bp(e) {
  const t = e.instances.map((s) => {
    const l = s.blocked > 0 ? ` <span class="muted">(RD ${s.blocked})</span>` : "";
    return `<li><strong>${Rt(s.label ?? "Dano")}</strong>: ${s.inputAmount} → ${s.finalDamage} PV${l}</li>`;
  }).join(""), n = e.instances.length > 1 ? `<li><strong>Total aplicado</strong>: ${e.totalFinalDamage} PV</li>` : "", r = e.totalBlocked > 0 ? `<li><strong>RD bloqueou</strong>: ${e.totalBlocked}</li>` : "", a = Ap(e), o = e.conditions.length > 0 ? `<li><strong>Condições sugeridas</strong>: ${Rt(e.conditions.join(", "))}</li>` : "";
  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${Rt(e.actorName)}</strong></p>
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
function Ap(e) {
  const t = _p(e.actor), n = e.newPV ?? t?.value ?? null, r = t?.max ?? null;
  if (n === null) return "";
  const a = r === null ? `${n}` : `${n}/${r}`;
  return `<li><strong>PV atual</strong>: ${Rt(a)}</li>`;
}
function _p(e) {
  const t = e.system, n = e.type === "threat" ? t.attributes?.hp : t.PV, r = Xa(n?.value);
  return r === null ? null : {
    value: r,
    max: Xa(n?.max)
  };
}
function Xa(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Tp() {
  return game.users.filter((e) => e.isGM).map((e) => e.id).filter((e) => typeof e == "string" && e.length > 0);
}
function Rt(e) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return e.replace(/[&<>"']/gu, (n) => t[n] ?? n);
}
async function Rp(e) {
  await As($p(e));
}
function $p(e) {
  if (wp(e)) return e;
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
function wp(e) {
  return "instances" in e && Array.isArray(e.instances) && "totalFinalDamage" in e && "totalBlocked" in e;
}
function _s(e) {
  return e.mode, `✓ ${Ts(e.inputAmount)} PV`;
}
function kp(e) {
  const t = Ts(e.inputAmount);
  return e.compact ? e.mode === "half" ? `½ ${t} PV` : `${t} PV` : e.mode === "half" ? `Metade: ${t} PV` : `Normal: ${t} PV`;
}
function Ts(e) {
  return Number.isFinite(e) ? Math.max(0, Math.trunc(e)) : 0;
}
class Ep {
  constructor(t) {
    this.damage = t;
  }
  damage;
  async execute(t) {
    return (t.isGM ?? fe()) !== !0 ? {
      ok: !1,
      error: {
        actor: t.actor,
        actorId: t.actor.id ?? null,
        actorName: t.actor.name ?? "Ator sem nome",
        reason: "permission-denied",
        message: "Apenas o Mestre pode aplicar dano assistido."
      }
    } : Bt(t.resistanceGateMode, t.resistanceState) ? {
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
class Ip {
  constructor(t) {
    this.conditions = t;
  }
  conditions;
  async execute(t) {
    return (t.isGM ?? fe()) !== !0 ? this.block(t, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.") : Bt(t.resistanceGateMode, t.resistanceState) ? this.block(t, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.") : t.requiredResistanceOutcome && t.resistanceState.kind !== t.requiredResistanceOutcome ? this.block(
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
class Cp {
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
const Sp = `.${i}__actions`, Br = `.${i}__actions-title`, Pe = `.${i}__button`, Lp = "data-paranormal-toolkit-action-section", vp = `${i}__button--executed`, Dp = "data-paranormal-toolkit-executed-label";
function Rs(e) {
  return X(e.querySelector(Br)?.textContent);
}
function Pp(e, t) {
  const n = e.querySelector(Br);
  n && (n.textContent = t);
}
function it(e, t) {
  const n = X(t);
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((r) => {
    const a = r.querySelector(`.${i}__workflow-section-header strong`)?.textContent;
    return X(a) === n;
  }) ?? null;
}
function Ur(e, t) {
  const n = document.createElement("span");
  return n.classList.add(`${i}__button-icon`, t), n.setAttribute("aria-hidden", "true"), n.textContent = e, n;
}
function ye(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__button-label`), t.textContent = e, t;
}
const gt = "data-paranormal-toolkit-prompt-id", $s = "multiTargetResistanceResults", ws = "multiTargetDamageApplications", ks = "multiTargetEffectApplications";
function Np(e) {
  const t = /* @__PURE__ */ new Map(), r = Ht(e)?.[$s];
  if (!B(r)) return t;
  for (const [a, o] of Object.entries(r))
    qp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function xp(e, t) {
  await qr(e, $s, t.targetId, t);
}
function Op(e) {
  const t = /* @__PURE__ */ new Map(), r = Ht(e)?.[ws];
  if (!B(r)) return t;
  for (const [a, o] of Object.entries(r))
    Gp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Mp(e, t) {
  await qr(
    e,
    ws,
    t.targetId,
    t
  );
}
function Fp(e) {
  const t = /* @__PURE__ */ new Map(), r = Ht(e)?.[ks];
  if (!B(r)) return t;
  for (const [a, o] of Object.entries(r))
    zp(o) && o.targetId === a && t.set(a, o);
  return t;
}
async function Bp(e, t) {
  await qr(
    e,
    ks,
    t.targetId,
    t
  );
}
function Up(e) {
  const t = Ht(e);
  return t ? {
    actorId: fn(t.actorId),
    itemId: fn(t.itemId),
    itemName: fn(t.itemName)
  } : null;
}
async function qr(e, t, n, r) {
  const a = Es(e);
  if (!a) return;
  const o = Is(e), s = Cs(o);
  if (!o || !s || !Array.isArray(s.prompts)) return;
  let l = !1;
  const c = s.prompts.map((u) => {
    if (!B(u) || u.pendingId !== a) return u;
    const f = B(u[t]) ? u[t] : {};
    return l = !0, {
      ...u,
      [t]: {
        ...f,
        [n]: r
      }
    };
  });
  l && await Promise.resolve(o.setFlag?.(d, qt, {
    ...s,
    prompts: c
  }));
}
function Ht(e) {
  const t = Es(e);
  if (!t) return null;
  const n = Is(e), r = Cs(n);
  return (Array.isArray(r?.prompts) ? r.prompts : []).find((o) => B(o) ? o.pendingId === t : !1) ?? null;
}
function Es(e) {
  return (e.closest(`[${gt}]`) ?? e.querySelector(`[${gt}]`) ?? e.parentElement?.querySelector(`[${gt}]`) ?? null)?.getAttribute(gt) ?? null;
}
function Is(e) {
  const n = e.closest("[data-message-id]")?.dataset.messageId ?? null;
  if (!n) return null;
  const a = game.messages?.get?.(n);
  return Vp(a) ? a : null;
}
function Cs(e) {
  const t = e?.getFlag?.(d, qt);
  return B(t) ? t : null;
}
function qp(e) {
  return B(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && (typeof e.diceBreakdown == "string" || e.diceBreakdown === null) && typeof e.rolledAt == "string" : !1;
}
function Gp(e) {
  return B(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && jp(e.mode) && typeof e.inputAmount == "number" && Number.isFinite(e.inputAmount) && typeof e.appliedAt == "string" : !1;
}
function jp(e) {
  return e === "normal" || e === "half";
}
function zp(e) {
  return B(e) ? typeof e.targetId == "string" && typeof e.targetName == "string" && typeof e.conditionId == "string" && typeof e.conditionLabel == "string" && (typeof e.effectId == "string" || e.effectId === null) && typeof e.created == "boolean" && typeof e.refreshed == "boolean" && typeof e.appliedAt == "string" : !1;
}
function fn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
function Vp(e) {
  return !!(e && typeof e == "object" && typeof e.getFlag == "function");
}
function B(e) {
  return !!(e && typeof e == "object");
}
const Hp = "data-paranormal-toolkit-resistance-skill", Wp = "data-paranormal-toolkit-resistance-skill-label", Mn = "data-paranormal-toolkit-multi-target-section", Gr = "data-paranormal-toolkit-multi-target-damage-info", Ss = "data-paranormal-toolkit-multi-target-effect-info", Ls = "data-paranormal-toolkit-multi-target-toggle", vs = "data-paranormal-toolkit-multi-target-details", N = "data-paranormal-toolkit-multi-target-target", Kp = "data-paranormal-toolkit-multi-target-state", Fn = "data-paranormal-toolkit-multi-target-roll-total", Bn = "data-paranormal-toolkit-multi-target-roll-formula", $t = "data-paranormal-toolkit-multi-target-roll-dice", Un = "data-paranormal-toolkit-multi-target-roll-skill", qn = "data-paranormal-toolkit-multi-target-roll-skill-label", Gn = "data-paranormal-toolkit-multi-target-roll-target-name", jn = "data-paranormal-toolkit-multi-target-roll-rolled-at", zn = "data-paranormal-toolkit-multi-target-damage-mode", Vn = "data-paranormal-toolkit-multi-target-damage-input-amount", Ja = "data-paranormal-toolkit-multi-target-damage-final-amount", eo = "data-paranormal-toolkit-multi-target-damage-blocked", Hn = "data-paranormal-toolkit-multi-target-damage-target-name", Wn = "data-paranormal-toolkit-multi-target-damage-applied-at", Kn = "data-paranormal-toolkit-multi-target-effect-condition-id", Yn = "data-paranormal-toolkit-multi-target-effect-condition-label", Qn = "data-paranormal-toolkit-multi-target-effect-effect-id", Zn = "data-paranormal-toolkit-multi-target-effect-created", Xn = "data-paranormal-toolkit-multi-target-effect-refreshed", Jn = "data-paranormal-toolkit-multi-target-effect-target-name", er = "data-paranormal-toolkit-multi-target-effect-applied-at", Yp = new Xi(rs()), Qp = new Ki(new Wi()), Zp = new Yi(new Dr()), Xp = new Cp(Zp), Jp = new Ep(Qp), eg = new Ip(Yp), tg = ps, Fe = xr, st = Or, ng = gs;
function rg(e) {
  const t = Ds(e);
  if (!t) return !1;
  e.rollCard.classList.add(`${i}__roll-card--multi-target`), mg(e);
  const n = fg(e.rollCard, t), r = pg(e.rollCard, t);
  !n && r && Kg(e.rollCard, r, e.effectSection);
  const a = _g(e.rollCard);
  return xs(a, t), Vg(
    e.rollCard,
    a,
    gg(e.rollCard, {
      damageInfo: n,
      effectInfo: r,
      effectSection: e.effectSection
    })
  ), n && r && Yg(e.rollCard, r, a), !0;
}
function Ds(e) {
  return Zf({
    ...e,
    resistanceResults: ig(e.rollCard),
    damageApplications: sg(e.rollCard),
    effectApplications: lg(e.rollCard),
    resolveTargetConditionApplication: ag,
    resistanceGateMode: zr()
  });
}
function ag(e, t, n) {
  const r = Up(e), a = ys(r);
  if (!a) return null;
  const o = at(a);
  if (!o.ok) return null;
  const s = (o.value.conditionApplications ?? []).filter((c) => c.actor === "target");
  if (s.length === 0) return null;
  const l = og(s, t, n);
  return l ? {
    conditionId: l.conditionId,
    conditionLabel: l.label ?? l.conditionId,
    duration: l.duration ?? null,
    source: l.source ?? "item-use.condition-action",
    originUuid: a.uuid ?? null,
    applyOnResistance: l.applyOnResistance ?? "failure"
  } : null;
}
function og(e, t, n) {
  const r = $f(
    e,
    n,
    t,
    pn
  );
  if (r) return r;
  if (e.length === 1) return e[0] ?? null;
  if (!t) return null;
  const a = pn(t);
  return a ? e.find((o) => [
    o.label,
    o.conditionId
  ].some((s) => pn(s) === a)) ?? null : null;
}
function ig(e) {
  const t = Np(e);
  for (const [n, r] of dg(e))
    t.set(n, r);
  return t;
}
function sg(e) {
  const t = Op(e);
  for (const [n, r] of ug(e))
    t.set(n, r);
  return t;
}
function lg(e) {
  const t = Fp(e);
  for (const [n, r] of cg(e))
    t.set(n, r);
  return t;
}
function cg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${N}]`)) {
    const r = n.getAttribute(N), a = n.getAttribute(Kn), o = n.getAttribute(Yn), s = n.getAttribute(Qn), l = ro(n.getAttribute(Zn)), c = ro(n.getAttribute(Xn)), u = n.getAttribute(Jn), f = n.getAttribute(er);
    !r || !a || !o || l === null || c === null || !u || !f || t.set(r, {
      targetId: r,
      targetName: u,
      conditionId: a,
      conditionLabel: o,
      effectId: s && s.length > 0 ? s : null,
      created: l,
      refreshed: c,
      appliedAt: f
    });
  }
  return t;
}
function ug(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${N}]`)) {
    const r = n.getAttribute(N), a = n.getAttribute(zn), o = Vs(n.getAttribute(Vn)), s = n.getAttribute(Hn), l = n.getAttribute(Wn);
    !r || !Xg(a) || o === null || !s || !l || t.set(r, {
      targetId: r,
      targetName: s,
      mode: a,
      inputAmount: o,
      appliedAt: l
    });
  }
  return t;
}
function dg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.querySelectorAll(`[${N}]`)) {
    const r = n.getAttribute(N), a = Vs(n.getAttribute(Fn)), o = n.getAttribute(Bn), s = n.getAttribute(Un), l = n.getAttribute(qn), c = n.getAttribute(Gn), u = n.getAttribute(jn);
    !r || a === null || !o || !s || !l || !c || !u || t.set(r, {
      targetId: r,
      targetName: c,
      skill: s,
      skillLabel: l,
      formula: o,
      total: a,
      diceBreakdown: n.getAttribute($t),
      rolledAt: u
    });
  }
  return t;
}
function mg(e) {
  e.damageSection?.classList.add(`${i}__workflow-section--multi-target-source`), e.effectSection?.classList.add(`${i}__workflow-section--multi-target-effect-source`);
}
function fg(e, t) {
  if (!t.damage)
    return Ps(e)?.remove(), null;
  const n = hg(e);
  return yg(n, t.damage), Ag(e, n), n;
}
function pg(e, t) {
  if (!t.effect)
    return zs(e)?.remove(), null;
  const n = Hg(e);
  return Wg(n, t.effect), n;
}
function gg(e, t) {
  return t.damageInfo?.parentElement === e ? t.damageInfo : t.effectInfo?.parentElement === e ? t.effectInfo : t.effectSection?.parentElement === e ? t.effectSection : it(e, "Conjuração");
}
function hg(e) {
  const t = Ps(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect`,
    `${i}__workflow-section--damage-info`
  ), n.setAttribute(Gr, "true"), n;
}
function Ps(e) {
  return e.querySelector(`[${Gr}="true"]`);
}
function yg(e, t) {
  e.replaceChildren();
  const n = document.createElement("div");
  n.classList.add(`${i}__workflow-section-header`);
  const r = document.createElement("strong");
  if (r.textContent = "Dano", n.append(r), e.append(n), t.typeLabel) {
    const a = document.createElement("span");
    a.classList.add(`${i}__workflow-section-description`), a.textContent = t.typeLabel, e.append(a);
  }
  e.append(Ns(t.formula, t.total, t.diceBreakdown));
}
function Ns(e, t, n, r = !1) {
  const a = zf({
    formula: e,
    total: t,
    diceBreakdown: n,
    classNames: [`${i}__workflow-roll--compact-info`]
  });
  return bg(a, r), a;
}
function bg(e, t) {
  const n = e.querySelector(jt), r = e.querySelector(Lr);
  if (!n || !r) return;
  e.classList.toggle(Sr, t), n.hidden = !t, r.classList.add(vr), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-expanded", t ? "true" : "false"), r.title = t ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", r.setAttribute("aria-label", r.title);
  const a = r.querySelector("i") ?? document.createElement("i");
  a.classList.add("fa-solid"), a.classList.toggle("fa-chevron-down", !t), a.classList.toggle("fa-chevron-up", t), a.setAttribute("aria-hidden", "true"), a.parentElement || r.append(a);
}
function Ag(e, t) {
  const n = it(e, "Conjuração");
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function _g(e) {
  const t = e.querySelector(`[${Mn}="true"]`);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--targets`
  ), n.setAttribute(Mn, "true"), n;
}
function xs(e, t) {
  const n = Tg(e);
  e.replaceChildren(Rg(t), wg(t, n));
}
function Tg(e) {
  return new Set(
    Array.from(e.querySelectorAll(`[${N}]`)).filter((t) => t.getAttribute("aria-expanded") === "true").map((t) => t.getAttribute(N)).filter(Zg)
  );
}
function Rg(e) {
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-section-header`, `${i}__targets-header`);
  const n = document.createElement("strong");
  n.textContent = "Alvos";
  const r = document.createElement("span");
  return r.classList.add(`${i}__targets-status`), r.textContent = $g(e.targets), t.append(n, r), t;
}
function $g(e) {
  const t = e.length, n = e.filter((l) => l.state === st).length, r = e.filter((l) => l.state === Fe).length, a = e.filter((l) => l.state === tg).length, o = e.filter((l) => l.state === ng).length, s = [`${t} ${t === 1 ? "alvo" : "alvos"}`];
  return n > 0 && s.push(`${n} ${n === 1 ? "falha" : "falhas"}`), r > 0 && s.push(`${r} ${r === 1 ? "sucesso" : "sucessos"}`), a > 0 && s.push(`${a} ${a === 1 ? "pendente" : "pendentes"}`), o > 0 && s.push(`${o} ${o === 1 ? "rolado" : "rolados"}`), s.join(" • ");
}
function wg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__targets-list`);
  for (const r of e.targets)
    n.append(kg(r, e, t.has(r.id)));
  return n;
}
function kg(e, t, n) {
  const r = document.createElement("article");
  r.classList.add(`${i}__target-row`, `${i}__target-row--${e.state}`), e.damageApplication && r.classList.add(`${i}__target-row--damage-applied`), e.effectApplication && r.classList.add(`${i}__target-row--effect-applied`), r.setAttribute(N, e.id), r.setAttribute(Kp, e.state), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("role", "button"), r.setAttribute("tabindex", "0"), r.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes de ${e.name}`), Os(r, e.resistanceResult), Ms(r, e.damageApplication), Fs(r, e.effectApplication);
  const a = Eg(e, t, r), o = qg(e, t);
  return o.hidden = !n, r.addEventListener("click", (s) => {
    no(s.target) || to(r);
  }), r.addEventListener("keydown", (s) => {
    s.key !== "Enter" && s.key !== " " || no(s.target) || (s.preventDefault(), to(r));
  }), r.append(a, o), r;
}
function Os(e, t) {
  if (!t) {
    e.removeAttribute(Fn), e.removeAttribute(Bn), e.removeAttribute($t), e.removeAttribute(Un), e.removeAttribute(qn), e.removeAttribute(Gn), e.removeAttribute(jn);
    return;
  }
  e.setAttribute(Fn, String(t.total)), e.setAttribute(Bn, t.formula), e.setAttribute(Un, t.skill), e.setAttribute(qn, t.skillLabel), e.setAttribute(Gn, t.targetName), e.setAttribute(jn, t.rolledAt), t.diceBreakdown ? e.setAttribute($t, t.diceBreakdown) : e.removeAttribute($t);
}
function Ms(e, t) {
  if (!t) {
    e.removeAttribute(zn), e.removeAttribute(Vn), e.removeAttribute(Ja), e.removeAttribute(eo), e.removeAttribute(Hn), e.removeAttribute(Wn);
    return;
  }
  e.setAttribute(zn, t.mode), e.setAttribute(Vn, String(t.inputAmount)), e.removeAttribute(Ja), e.removeAttribute(eo), e.setAttribute(Hn, t.targetName), e.setAttribute(Wn, t.appliedAt);
}
function Fs(e, t) {
  if (!t) {
    e.removeAttribute(Kn), e.removeAttribute(Yn), e.removeAttribute(Qn), e.removeAttribute(Zn), e.removeAttribute(Xn), e.removeAttribute(Jn), e.removeAttribute(er);
    return;
  }
  e.setAttribute(Kn, t.conditionId), e.setAttribute(Yn, t.conditionLabel), e.setAttribute(Qn, t.effectId ?? ""), e.setAttribute(Zn, String(t.created)), e.setAttribute(Xn, String(t.refreshed)), e.setAttribute(Jn, t.targetName), e.setAttribute(er, t.appliedAt);
}
function Eg(e, t, n) {
  const r = document.createElement("div");
  r.classList.add(`${i}__target-summary`);
  const a = document.createElement("div");
  a.classList.add(`${i}__target-summary-main`);
  const o = Ig(e), s = document.createElement("strong");
  s.classList.add(`${i}__target-name`), s.textContent = e.name;
  const l = Cg(e, t.resistance);
  Dg(l, n, e, t);
  const c = Ug(n);
  a.append(o, s, l, c);
  const u = document.createElement("div");
  return u.classList.add(`${i}__target-summary-actions`), Gs(u, [
    Bs(e, t, "compact"),
    qs(e, t, "compact")
  ]), r.append(a, u), r;
}
function Ig(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-avatar`), t.setAttribute("aria-hidden", "true"), t.textContent = e.name.trim().charAt(0).toLocaleUpperCase() || "?", t;
}
function Cg(e, t) {
  if (!he())
    return Sg(e, t);
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", vg(e, t)), t?.skill && (n.setAttribute(Hp, t.skill), n.setAttribute(Wp, t.skillLabel ?? me(t.skill))), !t?.skill)
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
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Fe ? "✓" : e.state === st ? "✕" : "", n.append(r, a), n;
}
function Sg(e, t) {
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-button`, `${i}__target-resistance-button--${e.state}`), n.setAttribute("aria-label", Lg(e, t)), !e.resistanceResult)
    return n.textContent = "—", n;
  const r = document.createElement("span");
  r.classList.add(`${i}__target-resistance-total`), r.textContent = String(e.resistanceResult.total);
  const a = document.createElement("span");
  return a.classList.add(`${i}__target-resistance-mark`), a.setAttribute("aria-hidden", "true"), a.textContent = e.state === Fe ? "✓" : e.state === st ? "✕" : "", n.append(r, a), n;
}
function Lg(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `${n} de ${e.name}: pendente.`;
  const r = e.state === Fe ? "sucesso" : e.state === st ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}.`;
}
function vg(e, t) {
  const n = t?.skillLabel ?? t?.skill ?? "resistência";
  if (!e.resistanceResult) return `Rolar ${n} de ${e.name}`;
  const r = e.state === Fe ? "sucesso" : e.state === st ? "falha" : "resultado";
  return `${n} de ${e.name}: ${e.resistanceResult.total}, ${r}. Rolar novamente`;
}
function Dg(e, t, n, r) {
  !(e instanceof HTMLButtonElement) || !he() || e.addEventListener("click", (a) => {
    a.stopPropagation(), Pg(t, e, n, r);
  });
}
async function Pg(e, t, n, r) {
  if (!he()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const a = r.resistance, o = a?.skill, s = a?.skillLabel ?? (o ? me(o) : "Resistência");
  if (!o) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }
  const l = Fr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para rolar resistência.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-resistance-button--rolling`);
  const c = t.innerHTML;
  t.textContent = "...";
  try {
    const u = await Xp.execute({ actor: l, skill: o, skillLabel: s });
    await Qg(u.roll);
    const f = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      skill: o,
      skillLabel: s,
      formula: u.formula,
      total: u.total,
      diceBreakdown: u.diceBreakdown,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Os(e, f);
    try {
      await xp(r.rollCard, f);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", y);
    }
    jr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${s} de ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-resistance-button--rolling`);
  }
}
function jr(e) {
  const t = e.closest(`[${Mn}="true"]`), n = e.closest(`.${i}__roll-card`);
  if (!t || !n) return;
  const r = Ds({
    rollCard: n,
    damageSection: Ng(n) ?? it(n, "Dano"),
    effectSection: xg(n)
  });
  r && xs(t, r);
}
function Ng(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section--multi-target-source`)).find((t) => t.getAttribute(Gr) !== "true") ?? null;
}
function xg(e) {
  return e.querySelector(`.${i}__workflow-section--multi-target-effect-source`);
}
function Og(e) {
  return Me(e.assistedActions.policy.damageActionState);
}
function Mg(e) {
  return Me(e.assistedActions.policy.effectActionState);
}
function zr() {
  try {
    return Er();
  } catch {
    return "strict";
  }
}
function Bs(e, t, n) {
  if (e.damageApplication)
    return G(
      "✓",
      _s({ inputAmount: e.damageApplication.inputAmount, mode: e.damageApplication.mode }),
      [`${i}__target-action--damage`, `${i}__target-action--applied`],
      !0
    );
  const r = e.assistedActions.policy.damageActionState;
  if (!e.assistedActions.policy.canShowApplyDamage)
    return null;
  if (Me(r))
    return G(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--damage`, `${i}__target-action--waiting-damage`],
      !0
    );
  const a = e.assistedActions.policy.damageMode ?? "normal";
  if (!t.damage) return null;
  const o = Us(a, t.damage);
  if (o === null)
    return G(
      "⚡",
      "Dano indisponível",
      [`${i}__target-action--damage`, `${i}__target-action--disabled`],
      !0
    );
  const s = kp({ inputAmount: o, mode: a, compact: n === "compact" }), l = a === "half" ? "🛡️" : "⚡", c = a === "half" ? `${i}__target-action--half-damage` : `${i}__target-action--normal-damage`, u = G(
    l,
    s,
    [`${i}__target-action--damage`, c],
    !1
  );
  return u.title = `Aplicar ${s} em ${e.name}`, u.setAttribute("aria-label", u.title), u.addEventListener("click", (f) => {
    f.stopPropagation();
    const y = u.closest(`[${N}]`);
    y && Fg(y, u, e, t);
  }), u;
}
function Us(e, t) {
  return e === "half" ? t.halfAmount : t.normalAmount;
}
async function Fg(e, t, n, r) {
  if (n.damageApplication) return;
  if (Og(n)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }
  const a = r.damage;
  if (!a) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }
  const o = n.assistedActions.policy.damageMode ?? "normal", s = Us(o, a);
  if (s === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }
  const l = Fr(n.name);
  if (!l) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar dano.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const c = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const u = await Jp.execute({
      actor: l,
      amount: s,
      damageType: a.typeLabel,
      label: o === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: zr(),
      resistanceState: n.assistedActions.resistanceState
    });
    if (!u.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${u.error.message}`), t.innerHTML = c;
      return;
    }
    const f = {
      targetId: n.id,
      targetName: l.name ?? n.name,
      mode: o,
      inputAmount: s,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    Ms(e, f);
    try {
      await Mp(r.rollCard, f);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", y);
    }
    try {
      await Rp(u.value);
    } catch (y) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", y);
    }
    jr(e);
  } catch (u) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", u), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${n.name}.`), t.innerHTML = c;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function qs(e, t, n) {
  const r = e.assistedActions.policy.effectActionState, a = e.effect ?? t.effect;
  if (!a)
    return G(
      "✦",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--disabled`],
      !0
    );
  if (e.effectApplication)
    return G(
      "✓",
      n === "full" ? `${e.effectApplication.conditionLabel} aplicado` : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--effect-applied`],
      !0
    );
  if (Me(r))
    return G(
      "◇",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--waiting-effect`],
      !0
    );
  if (ss(r))
    return G(
      "✓",
      n === "full" ? r.label : r.compactLabel,
      [`${i}__target-action--effect`, `${i}__target-action--resisted`],
      !0
    );
  if (!e.assistedActions.policy.canShowApplyEffect)
    return null;
  const o = G(
    "✦",
    n === "full" ? `Aplicar ${a.conditionLabel}` : "Efeito",
    [`${i}__target-action--effect`, `${i}__target-action--pending-effect`],
    !1
  );
  return o.title = `Aplicar ${a.conditionLabel} em ${e.name}`, o.setAttribute("aria-label", o.title), o.addEventListener("click", (s) => {
    s.stopPropagation();
    const l = o.closest(`[${N}]`);
    l && Bg(l, o, e, t);
  }), o;
}
async function Bg(e, t, n, r) {
  if (n.effectApplication) return;
  if (Mg(n)) {
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
  const o = Fr(n.name);
  if (!o) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${n.name} para aplicar efeito.`);
    return;
  }
  t.disabled = !0, t.classList.add(`${i}__target-action--applying`);
  const s = t.innerHTML;
  t.textContent = "Aplicando...";
  try {
    const l = await eg.execute({
      actor: o,
      conditionId: a.conditionId,
      duration: a.duration,
      originUuid: a.originUuid,
      source: a.source,
      resistanceGateMode: zr(),
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
    Fs(e, c);
    try {
      await Bp(r.rollCard, c);
    } catch (u) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", u);
    }
    l.value.warning && ui.notifications?.warn?.(`Paranormal Toolkit: ${l.value.warning}`), jr(e);
  } catch (l) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", l), ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${n.name}.`), t.innerHTML = s;
  } finally {
    t.disabled = !1, t.classList.remove(`${i}__target-action--applying`);
  }
}
function Gs(e, t) {
  for (const n of t)
    n && e.append(n);
}
function G(e, t, n, r) {
  const a = document.createElement("button");
  a.type = "button", a.classList.add(`${i}__target-action`, `${i}__target-action--pending`, ...n), a.disabled = r;
  const o = document.createElement("span");
  o.classList.add(`${i}__target-action-icon`), o.setAttribute("aria-hidden", "true"), o.textContent = e;
  const s = document.createElement("span");
  return s.classList.add(`${i}__target-action-label`), s.textContent = t, a.append(o, s), a;
}
function Ug(e) {
  const t = document.createElement("span");
  return t.classList.add(`${i}__target-toggle`), t.setAttribute(Ls, "true"), t.setAttribute("aria-hidden", "true"), js(e, t), t;
}
function to(e) {
  const t = e.querySelector(`[${vs}="true"]`);
  if (!t) return;
  const n = t.hidden;
  t.hidden = !n, e.setAttribute("aria-expanded", n ? "true" : "false"), e.setAttribute("aria-label", `${n ? "Fechar" : "Abrir"} detalhes do alvo`);
  const r = e.querySelector(`[${Ls}="true"]`);
  r && js(e, r);
}
function js(e, t) {
  const n = e.getAttribute("aria-expanded") === "true";
  t.textContent = n ? "⌃" : "⌄";
}
function no(e) {
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
function qg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-details`), n.setAttribute(vs, "true");
  const r = document.createElement("div");
  r.classList.add(`${i}__target-resistance-details`);
  const a = document.createElement("strong");
  a.textContent = "Resistência";
  const o = document.createElement("span");
  o.textContent = t.resistance?.description ?? "Resistência pendente.", r.append(a, o);
  const s = Gg(e, t.resistance);
  s && r.append(s);
  const l = jg(e, t.resistance), c = zg(e, t);
  return n.append(r, l, c), n.setAttribute("aria-label", `Detalhes de ${e.name}`), n;
}
function Gg(e, t) {
  if (!e.resistanceResult) return null;
  const n = document.createElement("span");
  if (n.classList.add(`${i}__target-resistance-outcome`), t?.difficulty === null || t?.difficulty === void 0)
    return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total}`, n;
  const r = e.state === Fe ? "sucesso" : "falha";
  return n.textContent = `${e.resistanceResult.skillLabel}: ${e.resistanceResult.total} vs DT ${t.difficulty} — ${r}`, n;
}
function jg(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${i}__target-resistance-roll`);
  const r = e.resistanceResult?.formula ?? t?.formula ?? "—", a = e.resistanceResult?.total ?? null, o = Ns(
    r,
    a,
    e.resistanceResult?.diceBreakdown ?? null,
    e.resistanceResult !== null
  );
  return n.append(o), n;
}
function zg(e, t) {
  const n = document.createElement("div");
  return n.classList.add(`${i}__target-details-actions`), Gs(n, [
    Bs(e, t, "full"),
    qs(e, t, "full")
  ]), n;
}
function Vg(e, t, n) {
  if (!n) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Hg(e) {
  const t = zs(e);
  if (t) return t;
  const n = document.createElement("section");
  return n.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-info`
  ), n.setAttribute(Ss, "true"), n;
}
function zs(e) {
  return e.querySelector(`[${Ss}="true"]`);
}
function Wg(e, t) {
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
function Kg(e, t, n) {
  const r = n?.parentElement === e ? n : it(e, "Conjuração");
  if (!r) {
    e.prepend(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === r || e.insertBefore(t, r.nextElementSibling);
}
function Yg(e, t, n) {
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function pn(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
async function Qg(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function Zg(e) {
  return typeof e == "string" && e.length > 0;
}
function Xg(e) {
  return e === "normal" || e === "half";
}
function ro(e) {
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
function Vs(e) {
  if (!e) return null;
  const t = Number(e);
  return Number.isFinite(t) ? Math.trunc(t) : null;
}
const ao = "data-paranormal-toolkit-card-layout-refresh-bound";
function Jg(e) {
  const t = e.rollCard.querySelector(Gt);
  t && t.getAttribute(ao) !== "true" && (t.setAttribute(ao, "true"), t.addEventListener("click", () => {
    for (const n of e.refreshDelaysMs)
      globalThis.setTimeout(e.onRefresh, n);
  }));
}
const Ce = "data-paranormal-toolkit-prompt-id", eh = "apply-damage", th = "data-paranormal-toolkit-multi-target-damage-info";
function nh(e) {
  return Array.from(e.querySelectorAll(`.${i}__workflow-section`)).find((t) => t.getAttribute(th) === "true" ? !1 : t.querySelector(`.${i}__workflow-section-header strong`)?.textContent?.trim().toLocaleLowerCase() === "dano") ?? null;
}
function rh(e) {
  const t = oh(e);
  return t.find((n) => n.getAttribute(Lp) === eh) ?? t.find((n) => Rs(n) === "aplicar danos") ?? null;
}
function ah(e) {
  const t = Hs(e), n = oo(t);
  return n || oo(ih(e));
}
function oo(e) {
  return e.find((t) => {
    const n = Rs(t);
    return n === "aplicar efeito" || n === "efeito";
  }) ?? null;
}
function oh(e) {
  const t = Hs(e);
  return t.length > 0 ? t : Vr(e);
}
function Hs(e) {
  const t = ch(e);
  return t ? Vr(e).filter((n) => lh(n, t)) : [];
}
function ih(e) {
  const t = Ws(e);
  if (!t) return [];
  const n = sh(e, t);
  return Vr(e).filter((r) => !r.closest(`.${i}__roll-card`)).filter((r) => Ks(e, r)).filter((r) => !n || uh(r, n));
}
function Vr(e) {
  const t = Ws(e);
  return t ? Array.from(t.querySelectorAll(Sp)) : [];
}
function Ws(e) {
  return e.closest(`.${i}`) ?? e.parentElement;
}
function sh(e, t) {
  return Array.from(t.querySelectorAll(`.${i}__roll-card`)).find((n) => n !== e && Ks(e, n)) ?? null;
}
function lh(e, t) {
  return e.getAttribute(Ce) === t ? !0 : Array.from(e.querySelectorAll(`[${Ce}]`)).some((n) => n.getAttribute(Ce) === t);
}
function ch(e) {
  return e.getAttribute(Ce) ?? e.querySelector(`[${Ce}]`)?.getAttribute(Ce) ?? null;
}
function Ks(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function uh(e, t) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
}
function dh(e) {
  const t = Ys(), n = Vt(e.rollCard).state, r = Nr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: t,
    resistanceState: n,
    damage: null,
    effect: { conditionLabel: e.effectLabel },
    effectCanApplyOnSuccessfulResistance: e.effectCanApplyOnSuccessfulResistance,
    effectRequiresResolvedResistance: e.effectRequiresResolvedResistance
  }), a = r.policy.effectActionState, o = Me(a), s = ss(a);
  return e.applied ? ze({
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
  }) : r.policy.canShowApplyEffect ? ze(o ? {
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
  }) : ze({
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
function ze(e) {
  return {
    ...e,
    displayLabel: e.effectLabel,
    actionLabel: e.actionState.label,
    compactLabel: e.actionState.compactLabel,
    reason: e.actionState.reason
  };
}
function mh(e) {
  const { rollCard: t } = e, n = gh(), r = Ys(), a = Vt(t).state, o = Nr({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode: r,
    resistanceState: a,
    damage: { normalAmount: null, halfAmount: null },
    effect: null
  }), s = o.policy.damageActionState, l = Me(s), c = ph(e);
  if (c)
    return {
      mode: n,
      canShowApplyDamage: !0,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: C(
        "normal",
        c === "normal",
        !1,
        c === "normal",
        !!e.normalButtonSkipped
      ),
      halfButton: C(
        "half",
        c === "half",
        !1,
        c === "half",
        !!e.halfButtonSkipped
      ),
      summary: fh(a)
    };
  if (!o.policy.canShowApplyDamage)
    return {
      mode: n,
      canShowApplyDamage: !1,
      waitingForResistance: l,
      resistanceState: a,
      actionState: s,
      normalButton: C("normal", !1, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: C("half", !1, !1, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: C("normal", !0, !1, !1, !!e.normalButtonSkipped, s.label),
      halfButton: C("half", !1, !1, !1, !!e.halfButtonSkipped),
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
      normalButton: C("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: C("half", !0, !0, !1, !!e.halfButtonSkipped, s.label),
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
      normalButton: C("normal", !0, !0, !1, !!e.normalButtonSkipped),
      halfButton: C("half", !0, !0, !1, !!e.halfButtonSkipped),
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
      normalButton: C("normal", !0, !0, !1, !!e.normalButtonSkipped, s.label),
      halfButton: C("half", !1, !1, !1, !!e.halfButtonSkipped),
      summary: {
        state: "pending",
        message: l ? s.reason ?? "Role resistência para aplicar dano." : null
      }
    };
  const u = a.kind === "succeeded";
  return {
    mode: n,
    canShowApplyDamage: !0,
    waitingForResistance: l,
    resistanceState: a,
    actionState: s,
    normalButton: C("normal", !u, !u, !1, !!e.normalButtonSkipped),
    halfButton: C("half", u, u, !1, !!e.halfButtonSkipped),
    summary: {
      state: u ? "resisted" : "failed",
      message: u ? `Resistiu: ${a.total} vs DT ${a.difficulty}.` : `Falhou: ${a.total} vs DT ${a.difficulty}.`
    }
  };
}
function fh(e) {
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
function C(e, t, n, r, a, o) {
  return {
    kind: e,
    visible: t,
    enabled: n,
    applied: r,
    skipped: a,
    waitingLabel: o
  };
}
function ph(e) {
  return e.normalButtonApplied ? "normal" : e.halfButtonApplied ? "half" : null;
}
function gh() {
  try {
    return Pu();
  } catch {
    return "assisted";
  }
}
function Ys() {
  try {
    return Er();
  } catch {
    return "strict";
  }
}
const hh = "data-paranormal-toolkit-damage-resolution-state", io = "data-paranormal-toolkit-damage-icon-enhanced", Hr = "data-paranormal-toolkit-damage-original-label", yh = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
}, Qs = "Outra opção escolhida";
function bh(e, t) {
  t.classList.add(`${i}__actions--embedded`, `${i}__actions--damage-resolution`), Pp(t, "Aplicar dano"), Ah(e, t);
}
function Ah(e, t) {
  const n = Array.from(t.querySelectorAll(Pe)), r = lo(n, "normal"), a = lo(n, "half");
  if (!r || !a) {
    _h(n), t.classList.add(`${i}__actions--compact`);
    return;
  }
  co(r, "normal"), co(a, "half");
  const o = mh({
    rollCard: e,
    normalButtonApplied: Ct(r),
    halfButtonApplied: Ct(a),
    normalButtonSkipped: tr(r),
    halfButtonSkipped: tr(a)
  });
  if (!o.canShowApplyDamage) {
    uo(r), uo(a), mo(t, o.summary.state, o.summary.message);
    return;
  }
  t.classList.toggle(`${i}__actions--assisted`, o.mode === "assisted"), t.classList.toggle(`${i}__actions--manual`, o.mode !== "assisted"), so(r, o.normalButton), so(a, o.halfButton), mo(t, o.summary.state, o.summary.message);
}
function so(e, t) {
  if (!t.applied) {
    if (!t.visible && t.skipped) {
      e.remove();
      return;
    }
    Rh(e, t.visible), $h(e, t.enabled, t.kind, t.waitingLabel);
  }
}
function _h(e) {
  for (const t of e)
    tr(t) && t.remove();
}
function Ct(e) {
  const t = e.textContent?.trim() ?? "";
  return t.startsWith("✓") && !t.includes(Qs);
}
function tr(e) {
  return e.textContent?.includes(Qs) ?? !1;
}
function lo(e, t) {
  const n = yh[t];
  return e.find((r) => n.test(Th(r))) ?? null;
}
function Th(e) {
  return [
    e.getAttribute(Hr),
    e.getAttribute("aria-label"),
    e.textContent
  ].filter((t) => !!t).join(" ");
}
function co(e, t) {
  if (e.getAttribute(io) === "true") return;
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
  ), e.setAttribute(io, "true"), e.setAttribute(Hr, n), e.setAttribute("aria-label", n), e.replaceChildren(r, ye(n));
}
function uo(e) {
  Ct(e) || e.remove();
}
function Rh(e, t) {
  e.hidden = !t, e.classList.toggle(`${i}__button--damage-resolution-selected`, t);
}
function $h(e, t, n, r = "Role resistência") {
  if (!Ct(e)) {
    if (e.disabled = !t, e.classList.toggle(`${i}__button--damage-resolution-waiting`, !t), !t) {
      e.setAttribute("aria-disabled", "true"), e.setAttribute("aria-label", r), e.replaceChildren(ye(r));
      return;
    }
    e.removeAttribute("aria-disabled"), wh(e, n);
  }
}
function wh(e, t) {
  const n = e.getAttribute(Hr) ?? e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "";
  !n || n === "Role resistência" || (e.setAttribute("aria-label", n), e.replaceChildren(kh(t), ye(n)));
}
function kh(e) {
  const t = document.createElement("i");
  return t.classList.add(
    "fa-solid",
    e === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${i}__button-icon`
  ), t.setAttribute("aria-hidden", "true"), t;
}
function mo(e, t, n) {
  e.setAttribute(hh, t);
  const r = e.querySelector(`.${i}__damage-resolution-summary`);
  if (!n) {
    r?.remove();
    return;
  }
  const a = r ?? document.createElement("span");
  a.classList.add(`${i}__damage-resolution-summary`), a.textContent = n, r || e.querySelector(Br)?.after(a);
}
const et = "data-paranormal-toolkit-effect-icon-enhanced", Ne = "data-paranormal-toolkit-effect-action-compacted", Wt = "data-paranormal-toolkit-effect-resistance-gate", Wr = "data-paranormal-toolkit-effect-section", Kr = "data-paranormal-toolkit-effect-label";
function Eh(e) {
  return e.querySelector(`[${Wr}="true"]`);
}
function Ih(e) {
  const t = Sh(e);
  if (!t) return e.existingSection;
  const n = e.existingSection ?? vh(), r = Uh(n, e.sourceActions, t);
  return r && n.setAttribute(Kr, r), Dh(n, t, r), Fh(e.rollCard, n, e.after ?? e.fallbackAfter), Bh(e.sourceActions, n), n;
}
function Ch(e, t) {
  const n = t.querySelector(Pe);
  if (!n) return;
  const r = n.textContent?.trim() ?? "", a = el(t, n, r), o = Zs(e, n), s = dh({
    rollCard: e,
    effectLabel: a,
    applied: Qr(n, r),
    effectCanApplyOnSuccessfulResistance: o ? De(o) === "success" || De(o) === "always" : !1,
    effectRequiresResolvedResistance: o ? is(o) : !1
  });
  if (s.applied) {
    Gh(n);
    return;
  }
  if (!s.visible) {
    jh(n);
    return;
  }
  if (s.waitingForResistance) {
    zh(n, s.actionLabel);
    return;
  }
  if (s.resisted) {
    Vh(n, s.compactLabel);
    return;
  }
  Hh(n), Js(n, s.displayLabel);
}
function Sh(e) {
  const t = Array.from(e.sourceActions?.querySelectorAll(Pe) ?? []), n = Array.from(e.existingSection?.querySelectorAll(Pe) ?? []), r = [...t, ...n];
  return r.length === 0 ? null : Lh(e.rollCard, r) ?? r[0] ?? null;
}
function Lh(e, t) {
  const n = Vt(e).state, r = as(n), a = Xs(e);
  if (a.length === 0) return null;
  for (const o of t) {
    const s = Zs(e, o, a);
    if (s && os(s, r)) return o;
  }
  return null;
}
function Zs(e, t, n = Xs(e)) {
  const r = Yr(t, t.textContent?.trim() ?? ""), a = On(r);
  return a ? n.find((o) => [o.label, o.conditionId].some((s) => On(s) === a)) ?? null : null;
}
function Xs(e) {
  const t = ys(vf(e));
  if (!t) return [];
  const n = at(t);
  return n.ok ? (n.value.conditionApplications ?? []).filter((r) => r.actor === "target") : [];
}
function vh() {
  const e = document.createElement("section");
  return e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.setAttribute(Wr, "true"), e;
}
function Dh(e, t, n) {
  e.setAttribute(Wr, "true"), e.classList.add(
    `${i}__workflow-section`,
    `${i}__workflow-section--effect-action`
  ), e.classList.remove(`${i}__actions`, `${i}__actions--effect-resolution`);
  const r = Ph(e), a = Nh(r);
  a.textContent = "Efeito";
  const o = xh(e, r), s = Oh(o);
  s.textContent = Wh(n ?? el(e, t, t.textContent?.trim() ?? ""));
  const l = Mh(o);
  t.parentElement !== l && l.append(t);
  for (const u of Array.from(l.querySelectorAll(Pe)))
    u.hidden = u !== t;
  t.hidden = !1;
  const c = t.textContent?.trim() ?? "";
  !Qr(t, c) && !qh(t, c) && Js(t, n ?? c);
}
function Ph(e) {
  const t = e.querySelector(`:scope > .${i}__workflow-section-header`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__workflow-section-header`), e.prepend(n), n;
}
function Nh(e) {
  const t = e.querySelector("strong");
  if (t) return t;
  const n = document.createElement("strong");
  return e.append(n), n;
}
function xh(e, t) {
  const n = e.querySelector(`:scope > .${i}__effect-section-body`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(`${i}__effect-section-body`), t.after(r), r;
}
function Oh(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-label`);
  if (t) return t;
  const n = document.createElement("span");
  return n.classList.add(`${i}__effect-section-label`), e.prepend(n), n;
}
function Mh(e) {
  const t = e.querySelector(`:scope > .${i}__effect-section-action`);
  if (t) return t;
  const n = document.createElement("div");
  return n.classList.add(`${i}__effect-section-action`), e.append(n), n;
}
function Fh(e, t, n) {
  if (!n) {
    if (t.parentElement === e && t.nextElementSibling === null) return;
    e.append(t);
    return;
  }
  t.parentElement === e && t.previousElementSibling === n || e.insertBefore(t, n.nextElementSibling);
}
function Bh(e, t) {
  if (!(!e || e === t)) {
    if (e.querySelector(Pe)) {
      e.hidden = !0, e.setAttribute("aria-hidden", "true");
      return;
    }
    e.remove();
  }
}
function Uh(e, t, n) {
  const r = e.getAttribute(Kr);
  if (r && r.trim().length > 0) return r.trim();
  const a = t?.querySelector(`.${i}__effect-resolution-label`)?.textContent?.trim();
  return a || Yr(n, n.textContent?.trim() ?? "");
}
function Yr(e, t) {
  const n = e.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (n && X(n) !== "efeito aplicado") return n;
  const r = Df(e);
  if (r) return r;
  const a = t.replace(/^✓\s*/u, "").replace(/\s+aplicad[oa]$/iu, "").trim();
  return a.length > 0 && X(a) !== "aplicado" ? a : null;
}
function Qr(e, t) {
  return e.classList.contains(vp) || X(t).includes("aplicado");
}
function qh(e, t) {
  const n = e.getAttribute(Wt);
  if (n === "pending" || n === "resisted") return !0;
  const r = On(t);
  return r.includes("resistiu") || r.includes("role resistencia");
}
function Js(e, t) {
  e.getAttribute(Ne) === "true" && e.getAttribute(et) === "true" || (e.disabled = !1, e.classList.add(`${i}__button--effect-resolution-action`), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ne, "true"), e.setAttribute(et, "true"), e.setAttribute(Dp, "✓ Aplicado"), e.setAttribute("aria-label", `Aplicar ${t}`), e.replaceChildren(
    Ur("✦", `${i}__button-icon--effect`),
    ye("Aplicar")
  ));
}
function Gh(e) {
  e.getAttribute(Ne) === "true" && X(e.textContent) === "✓ aplicado" || (e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-applied`), e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.setAttribute(Ne, "true"), e.setAttribute(et, "true"), e.setAttribute("aria-label", "Efeito aplicado"), e.replaceChildren(
    Ur("✓", `${i}__button-icon--effect-applied`),
    ye("Aplicado")
  ));
}
function el(e, t, n) {
  const r = e.getAttribute(Kr) ?? e.querySelector(`.${i}__effect-section-label`)?.textContent?.trim();
  return r && r.trim().length > 0 ? r.trim() : Yr(t, n) ?? n;
}
function jh(e) {
  Qr(e, e.textContent?.trim() ?? "") || e.remove();
}
function zh(e, t = "Role resistência") {
  e.disabled = !0, e.setAttribute("aria-disabled", "true"), e.removeAttribute(Ne), e.removeAttribute(et), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-resisted`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-waiting`), e.setAttribute(Wt, "pending"), e.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito"), e.replaceChildren(ye(t));
}
function Vh(e, t = "Resistiu") {
  e.disabled = !0, e.removeAttribute(Ne), e.removeAttribute(et), e.classList.remove(
    `${i}__button--effect-resolution-applied`,
    `${i}__button--effect-resolution-waiting`
  ), e.classList.add(`${i}__button--effect-resolution-action`, `${i}__button--effect-resolution-resisted`), e.setAttribute(Wt, "resisted"), e.setAttribute("aria-label", "O alvo resistiu ao efeito"), e.replaceChildren(
    Ur("✓", `${i}__button-icon--effect-resisted`),
    ye(t)
  );
}
function Hh(e) {
  e.classList.remove(
    `${i}__button--effect-resolution-waiting`,
    `${i}__button--effect-resolution-resisted`
  ), e.removeAttribute(Wt), e.removeAttribute("aria-disabled");
}
function Wh(e) {
  return e.replace(/\s*:\s*/u, " · ");
}
const Kh = "data-paranormal-toolkit-card-layout-normalized";
function Yh(e) {
  const t = Qh(e.rollCard), n = Zh(t);
  return Jg({
    rollCard: e.rollCard,
    refreshDelaysMs: e.refreshDelaysMs,
    onRefresh: e.onRefresh
  }), {
    damageSection: t.damageSection,
    effectSection: n ?? t.effectSection
  };
}
function Qh(e) {
  return {
    rollCard: e,
    damageSection: nh(e),
    resistance: e.querySelector(Cr),
    damageActions: rh(e),
    effectActionSource: ah(e),
    effectSection: Eh(e)
  };
}
function Zh(e) {
  const {
    rollCard: t,
    damageSection: n,
    resistance: r,
    damageActions: a,
    effectActionSource: o,
    effectSection: s
  } = e;
  t.setAttribute(Kh, "true"), t.classList.add(`${i}__roll-card--structured`);
  const l = it(t, "Conjuração"), c = Xh({
    rollCard: t,
    damageSection: n,
    resistance: r,
    fallbackAfter: l
  });
  n && a && (a.parentElement !== n && n.append(a), bh(t, a));
  const u = Ih({
    rollCard: t,
    existingSection: s,
    sourceActions: o,
    after: Jh(n, c),
    fallbackAfter: l
  });
  return u && Ch(t, u), u;
}
function Xh(e) {
  const { rollCard: t, damageSection: n, resistance: r, fallbackAfter: a } = e;
  return r ? n ? (r.parentElement !== n && n.append(r), n) : a ? (r.parentElement === t && r.previousElementSibling === a || t.insertBefore(r, a.nextElementSibling), r) : ((r.parentElement !== t || r.previousElementSibling !== null) && t.prepend(r), r) : null;
}
function Jh(e, t) {
  return e ?? t;
}
const tl = [0, 80, 180, 400, 900, 1600, 3e3], fo = /* @__PURE__ */ new WeakSet();
function ey(e) {
  nl(e), ty(e);
}
function nl(e) {
  for (const t of Array.from(e.querySelectorAll(`.${i}__roll-card`)))
    rl(t);
}
function ty(e) {
  if (!fo.has(e)) {
    fo.add(e);
    for (const t of tl)
      globalThis.setTimeout(() => {
        nl(e);
      }, t);
  }
}
function rl(e) {
  const t = Yh({
    rollCard: e,
    refreshDelaysMs: tl,
    onRefresh: () => rl(e)
  });
  rg({
    rollCard: e,
    damageSection: t.damageSection,
    effectSection: t.effectSection
  });
}
const ny = "data-paranormal-toolkit-resistance-roll-result-enhanced";
function ry(e) {
  for (const t of Array.from(e.querySelectorAll(Cr)))
    ay(t);
  ey(e);
}
function ay(e) {
  const t = e.querySelector(yd), n = e.querySelector(qi), r = e.querySelector(Gt), a = e.querySelector(Gi);
  if (!r || !t && !n && !a) return;
  const o = oy(e, r);
  t && t.parentElement !== o && o.append(t), n && n.parentElement !== o && o.append(n), a && (a.parentElement !== e && !r.contains(a) && e.append(a), iy(a)), dy(r), r.parentElement !== e && e.append(r);
}
function oy(e, t) {
  const n = e.querySelector(`.${Ma}`);
  if (n) return n;
  const r = document.createElement("div");
  return r.classList.add(Ma), e.insertBefore(r, t.parentElement === e ? t : e.firstChild), r;
}
function iy(e) {
  const t = sy(e.textContent ?? "");
  t && (e.setAttribute(ny, "true"), e.replaceChildren(uy(t)));
}
function sy(e) {
  const t = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(e);
  if (!t) return null;
  const [, n, r, a] = t, o = n?.trim() ?? "Resistência", s = Number(a);
  if (!Number.isFinite(s)) return null;
  const { formula: l, diceValues: c } = ly(r ?? "");
  return l ? {
    skillLabel: o,
    formula: l,
    total: Math.trunc(s),
    diceValues: c
  } : null;
}
function ly(e) {
  const t = e.trim(), n = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(t);
  return n ? {
    formula: n[1]?.trim() ?? t,
    diceValues: cy(n[2] ?? "")
  } : { formula: t, diceValues: [] };
}
function cy(e) {
  return e.split(",").map((t) => Number(t.trim())).filter((t) => Number.isFinite(t)).map((t) => Math.trunc(t));
}
function uy(e) {
  const t = document.createElement("div");
  t.classList.add(
    `${i}__workflow-roll`,
    `${i}__resistance-workflow-roll`
  ), t.setAttribute("data-paranormal-toolkit-resistance-total", String(e.total));
  const n = document.createElement("span");
  n.classList.add(`${i}__workflow-roll-formula`), n.textContent = e.formula, n.title = `${e.skillLabel}: ${e.formula}`, t.append(n);
  const r = my(e);
  return r && t.append(r), t;
}
function dy(e) {
  e.classList.remove(
    `${i}__resistance-roll-button--succeeded`,
    `${i}__resistance-roll-button--failed`
  );
  const t = e.closest(`.${i}__roll-card`);
  if (!t) return;
  const n = Vt(t).state;
  if (n.kind !== "succeeded" && n.kind !== "failed") return;
  const r = n.kind === "succeeded" ? "succeeded" : "failed", a = r === "succeeded" ? "✓" : "✕", o = r === "succeeded" ? "sucesso" : "falha";
  e.classList.add(`${i}__resistance-roll-button--${r}`), e.textContent = `${n.total} ${a}`, e.title = `${e.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${n.total}, ${o}. Rolar novamente`, e.setAttribute("aria-label", e.title);
}
function my(e) {
  if (e.diceValues.length === 0) return null;
  const t = document.createElement("div");
  t.classList.add(`${i}__workflow-dice-tray`);
  for (const n of fy(e.diceValues, e.formula)) {
    const r = document.createElement("span");
    r.classList.add(`${i}__workflow-die`), n.active || r.classList.add(`${i}__workflow-die--inactive`), r.textContent = String(n.value), t.append(r);
  }
  return t;
}
function fy(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? po(e, "highest") : n.includes("kl") ? po(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function po(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function go(e) {
  if (e instanceof Document || e instanceof HTMLElement || e instanceof DocumentFragment)
    return e;
  if (!e || typeof e != "object") return null;
  const t = e;
  return t[0] instanceof HTMLElement ? t[0] : null;
}
function Zr() {
  const e = globalThis.game;
  return Kt(e) ? e : null;
}
function F(e, t) {
  const n = py(e, t);
  return wt(n);
}
function py(e, t) {
  return t.split(".").reduce((n, r) => Kt(n) ? n[r] : null, e);
}
function gy(e, t) {
  const n = e.indexOf(":");
  return n < 0 || tt(e.slice(0, n)) !== tt(t) ? null : Be(e.slice(n + 1));
}
function wt(e) {
  return typeof e == "string" ? Be(e) : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}
function Kt(e) {
  return !!e && typeof e == "object";
}
function hy(e) {
  return typeof e == "string";
}
function Yt(e) {
  return typeof e == "string" && e.trim().length > 0;
}
function Be(e) {
  if (!e) return null;
  const t = e.replace(/\s+/gu, " ").trim();
  return t.length > 0 ? t : null;
}
function tt(e) {
  return (e ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]+/giu, "").toLowerCase();
}
function nr(e) {
  return e.length === 0 ? e : e[0].toLocaleLowerCase("pt-BR") + e.slice(1);
}
function J(e) {
  return e.replace(/([a-z])([A-Z])/gu, "$1 $2").replace(/[_-]+/gu, " ").trim().replace(/\S+/gu, (t) => t[0].toLocaleUpperCase("pt-BR") + t.slice(1).toLocaleLowerCase("pt-BR"));
}
function al(e) {
  return e.replace(/[.。]+$/u, "").trim();
}
function yy(e) {
  for (const t of Array.from(e.querySelectorAll(pd))) {
    const n = wy(t);
    by(t), n && (Ay(t, n), _y(t, n));
  }
}
function by(e) {
  for (const t of Array.from(e.querySelectorAll(gd)))
    t.remove();
}
function Ay(e, t) {
  const r = e.closest(`.${i}`)?.querySelector(Ui) ?? null, a = r?.querySelector(fd) ?? null, o = r ?? e, s = o.querySelector(_d);
  if (!t.elementLabel) {
    s?.remove();
    return;
  }
  const l = s ?? document.createElement("span");
  if (l.className = qy(t.elementTone), l.textContent = Uy(t), !s) {
    if (a?.parentElement === o) {
      a.insertAdjacentElement("afterend", l);
      return;
    }
    o.prepend(l);
  }
}
function _y(e, t) {
  const n = Ty(e);
  Ry(e, n);
  const r = $y(t);
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
  const o = e.querySelector(ji);
  if (o) {
    e.insertBefore(a, o);
    return;
  }
  e.prepend(a);
}
function Ty(e) {
  return e.closest(`.${i}`)?.querySelector(Ui) ?? null;
}
function Ry(e, t) {
  const n = [e, t].filter((r) => r !== null);
  for (const r of n)
    for (const a of Array.from(r.querySelectorAll(Td)))
      a.remove();
}
function $y(e) {
  return [
    e.cost,
    e.target ? `Alvo: ${nr(e.target)}` : null,
    e.duration ? `Duração: ${nr(e.duration)}` : null,
    e.resistance ? `Resistência: ${al(e.resistance)}` : null
  ].filter(Yt);
}
function wy(e) {
  const t = ky(e), n = vy(e), a = (t ? Ly(t) : null)?.system ?? null, o = t?.summaryLines ?? [], s = Xr(F(a, "element")), l = H("op.elementChoices", s) ?? ho(se(o, "Elemento")) ?? ho(n.damageType), c = s ?? Gy(l), u = F(a, "circle") ?? se(o, "Círculo"), f = Ny(a) ?? se(o, "Alvo"), y = Fy(a, "duration", "op.durationChoices") ?? se(o, "Duração"), $ = Dy(e) ?? Oy(a) ?? se(o, "Resistência"), b = Py(o) ?? n.cost, p = {
    elementLabel: l,
    elementTone: c,
    circle: u,
    cost: b,
    target: f,
    duration: y,
    resistance: $
  };
  return By(p) ? p : null;
}
function ky(e) {
  const t = Ey(e);
  if (!t) return null;
  const n = t.getFlag?.(d, qt), r = Cy(n);
  if (r.length === 0) return null;
  const a = Iy(e);
  if (a.size > 0) {
    const o = r.find((s) => s.pendingId && a.has(s.pendingId));
    if (o) return o;
  }
  return r.find((o) => o.itemId || o.summaryLines.length > 0) ?? null;
}
function Ey(e) {
  const n = e.closest(".chat-message[data-message-id], [data-message-id]")?.dataset.messageId;
  return n ? Zr()?.messages?.get?.(n) ?? null : null;
}
function Iy(e) {
  const t = e.closest(`.${i}`) ?? e, n = /* @__PURE__ */ new Set();
  for (const r of Array.from(t.querySelectorAll(`[${Oa}]`))) {
    const a = r.getAttribute(Oa)?.trim();
    a && n.add(a);
  }
  return n;
}
function Cy(e) {
  if (!Kt(e)) return [];
  const t = e.prompts;
  return Array.isArray(t) ? t.map(Sy).filter((n) => n !== null) : [];
}
function Sy(e) {
  return Kt(e) ? {
    pendingId: wt(e.pendingId),
    actorId: wt(e.actorId),
    itemId: wt(e.itemId),
    summaryLines: Array.isArray(e.summaryLines) ? e.summaryLines.filter(hy) : []
  } : null;
}
function Ly(e) {
  if (!e.itemId) return null;
  const t = Zr(), r = (e.actorId ? t?.actors?.get?.(e.actorId) : null)?.items?.get?.(e.itemId);
  return r || (t?.items?.get?.(e.itemId) ?? null);
}
function vy(e) {
  let t = null, n = null;
  for (const r of Array.from(e.querySelectorAll(hd))) {
    const a = Be(r.textContent);
    if (!a) continue;
    const o = gy(a, "Tipo");
    o && (n = o), !t && /\b(P[ED]|PE|PD)\b/iu.test(a) && (t = a);
  }
  return { cost: t, damageType: n };
}
function Dy(e) {
  const t = Be(e.querySelector(qi)?.textContent);
  return t ? al(t) : null;
}
function se(e, t) {
  const n = tt(t);
  for (const r of e) {
    const a = r.indexOf(":");
    if (!(a < 0 || tt(r.slice(0, a)) !== n))
      return Be(r.slice(a + 1));
  }
  return null;
}
function Py(e) {
  const t = se(e, "Custo") ?? se(e, "PE");
  return t || (e.map(Be).find((n) => typeof n == "string" && /\b(P[ED]|PE|PD)\b/iu.test(n)) ?? null);
}
function Ny(e) {
  const t = F(e, "target");
  if (!t) return null;
  if (t === "area")
    return xy(e) ?? H("op.targetChoices", t) ?? "Área";
  const n = H("op.targetChoices", t) ?? J(t);
  return [t === "people" || t === "creatures" ? F(e, "targetQtd") : null, n].filter(Yt).join(" ");
}
function xy(e) {
  const t = F(e, "area.name"), n = F(e, "area.size"), r = F(e, "area.type"), a = t ? H("op.areaChoices", t) ?? J(t) : null, o = r ? H("op.areaTypeChoices", r) ?? J(r) : null;
  return a ? n ? o ? `${a} ${n}m ${nr(o)}` : `${a} ${n}m` : a : null;
}
function Oy(e) {
  const t = F(e, "skillResis"), n = F(e, "resistance");
  if (!t || !n) return null;
  const r = H("op.skill", t) ?? J(t), a = My(n);
  return [r, a].filter(Yt).join(" ");
}
function My(e) {
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
      return H("op.resistanceChoices", e) ?? J(e);
  }
}
function Fy(e, t, n) {
  const r = F(e, t);
  return r ? H(n, r) ?? J(r) : null;
}
function By(e) {
  return !!(e.elementLabel || e.cost || e.target || e.duration || e.resistance);
}
function Uy(e) {
  const t = e.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return e.circle ? `${t} ${e.circle}` : t;
}
function qy(e) {
  return [
    `${i}__ritual-element-badge`,
    e ? `${i}__ritual-element-badge--${e}` : null
  ].filter(Yt).join(" ");
}
function Xr(e) {
  const t = tt(e);
  return t === "sangue" || t === "blood" || t === "blooddamage" ? "blood" : t === "morte" || t === "death" || t === "deathdamage" ? "death" : t === "conhecimento" || t === "knowledge" || t === "knowledgedamage" ? "knowledge" : t === "energia" || t === "energy" || t === "energydamage" ? "energy" : t === "medo" || t === "fear" || t === "feardamage" ? "fear" : null;
}
function ho(e) {
  const t = Xr(e);
  return t ? H("op.elementChoices", t) ?? J(t) : e ? J(e) : null;
}
function Gy(e) {
  return Xr(e);
}
function H(e, t) {
  if (!t) return null;
  const n = `${e}.${t}`, r = Zr()?.i18n?.localize?.(n);
  return !r || r === n ? null : r;
}
const yo = "data-paranormal-toolkit-dice-toggle-enhanced";
function jy(e) {
  for (const t of Array.from(e.querySelectorAll(zi)))
    ol(t);
}
function zy(e) {
  const t = sl(e.target);
  if (!t) return;
  const n = Jr(t);
  n && (e.preventDefault(), il(n, t));
}
function Vy(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = sl(e.target);
  if (!t) return;
  const n = Jr(t);
  n && (e.preventDefault(), il(n, t));
}
function ol(e) {
  const t = e.querySelector(jt);
  if (!t) return;
  const n = e.querySelector(Lr);
  if (n && n.getAttribute(yo) !== "true" && (n.setAttribute(yo, "true"), n.classList.add(vr), n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", "false"), n.title = "Mostrar dados da rolagem", n.setAttribute("aria-label", n.title), t.hidden = !0, !n.querySelector("i"))) {
    const r = document.createElement("i");
    r.classList.add("fa-solid", "fa-chevron-down"), r.setAttribute("aria-hidden", "true"), n.append(r);
  }
}
function il(e, t) {
  const n = e.querySelector(jt);
  if (!n) return;
  const r = !e.classList.contains(Sr);
  Hy(e, t, n, r);
}
function Hy(e, t, n, r) {
  e.classList.toggle(Sr, r), n.hidden = !r, t.setAttribute("aria-expanded", r ? "true" : "false"), t.title = r ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem", t.setAttribute("aria-label", t.title);
  const a = t.querySelector("i");
  a && (a.classList.toggle("fa-chevron-down", !r), a.classList.toggle("fa-chevron-up", r));
}
function sl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.closest(Lr);
  if (!t) return null;
  const n = Jr(t);
  return n ? (ol(n), t.classList.contains(vr) ? t : null) : null;
}
function Jr(e) {
  const t = e.closest(zi);
  return t && t.querySelector(jt) ? t : null;
}
const bo = `${d}-workflow-dice-toggle-styles`;
function Wy() {
  if (document.getElementById(bo)) return;
  const e = document.createElement("style");
  e.id = bo, e.textContent = `
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
const Ky = [0, 100, 500, 1500, 3e3];
let Ao = !1, gn = null;
function Yy() {
  if (!Ao) {
    Ao = !0, Wy(), Hooks.on("renderChatMessageHTML", (e, t) => {
      Ye(go(t));
    }), Hooks.on("renderChatMessage", (e, t) => {
      Ye(go(t));
    }), Hooks.once("ready", () => {
      Ye(document), Qy();
    }), document.addEventListener("click", zy), document.addEventListener("keydown", Vy);
    for (const e of Ky)
      globalThis.setTimeout(() => Ye(document), e);
  }
}
function Qy() {
  gn || !document.body || (gn = new MutationObserver((e) => {
    for (const t of e)
      for (const n of Array.from(t.addedNodes))
        (n instanceof HTMLElement || n instanceof DocumentFragment) && Ye(n);
  }), gn.observe(document.body, { childList: !0, subtree: !0 }));
}
function Ye(e) {
  e && (Bd(e), yy(e), ry(e), jy(e), vd(e));
}
function Zy() {
  Yy();
}
const Xy = "data-paranormal-toolkit-action-section", Jy = "ritual-log", eb = ".paranormal-toolkit-item-use-prompt__actions", tb = ".paranormal-toolkit-item-use-prompt__actions-title", nb = [0, 100, 500, 1500];
let _o = !1;
function rb() {
  if (_o) return;
  const e = (t, n) => {
    To(sb(n) ?? document);
  };
  Hooks.on("renderChatMessageHTML", e), Hooks.on("renderChatMessage", e), To(document), _o = !0;
}
function To(e) {
  for (const t of nb)
    globalThis.setTimeout(() => ab(e), t);
}
function ab(e) {
  ob(e), ib(e);
}
function ob(e) {
  for (const t of e.querySelectorAll(
    `[${Xy}="${Jy}"]`
  ))
    t.remove();
}
function ib(e) {
  for (const t of e.querySelectorAll(eb)) {
    if (Ro(t.querySelector(tb)?.textContent ?? "") !== "registro") continue;
    Array.from(
      t.querySelectorAll("button"),
      (o) => Ro(o.textContent ?? "")
    ).some((o) => o.includes("ritual conjurado")) && t.remove();
  }
}
function sb(e) {
  if (e instanceof HTMLElement || lb(e))
    return e;
  if (cb(e)) {
    const t = e[0];
    return t instanceof HTMLElement ? t : null;
  }
  return null;
}
function lb(e) {
  return e instanceof HTMLElement;
}
function cb(e) {
  return typeof e == "object" && e !== null && 0 in e;
}
function Ro(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim().toLocaleLowerCase();
}
const Qe = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
}, ll = {
  PV: "system.attributes.hp"
}, rr = {
  PV: [Qe.PV, ll.PV],
  SAN: [Qe.SAN],
  PE: [Qe.PE],
  PD: [Qe.PD]
}, ar = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  }
};
class ub {
  getResource(t, n) {
    const r = $o(t, n);
    if (!r.ok)
      return g(r.error);
    const a = r.value, o = `${a}.value`, s = `${a}.max`, l = foundry.utils.getProperty(t, o), c = foundry.utils.getProperty(t, s), u = ko(t, n, o, l, "valor atual");
    if (u) return g(u);
    const f = ko(t, n, s, c, "valor máximo");
    return f ? g(f) : A({
      value: l,
      max: c
    });
  }
  async updateResourceValue(t, n, r) {
    const a = $o(t, n);
    if (!a.ok)
      throw new Error(a.error.message);
    await t.update({ [`${a.value}.value`]: r });
  }
}
function $o(e, t) {
  const n = db(e.type, t);
  if (n && wo(e, n))
    return A(n);
  const r = rr[t].find(
    (a) => wo(e, a)
  );
  return r ? A(r) : g({
    actor: e,
    actorId: e.id ?? null,
    actorName: e.name ?? "Ator sem nome",
    actorType: e.type ?? "unknown",
    resource: t,
    reason: "resource-path-not-found",
    message: mb(e, t),
    path: rr[t].join(" | ")
  });
}
function db(e, t) {
  return e === "threat" ? ll[t] ?? null : e === "agent" ? Qe[t] : null;
}
function wo(e, t) {
  const n = foundry.utils.getProperty(e, `${t}.value`), r = foundry.utils.getProperty(e, `${t}.max`);
  return typeof n == "number" && Number.isFinite(n) && typeof r == "number" && Number.isFinite(r);
}
function mb(e, t) {
  const n = e.type ?? "unknown", r = rr[t].join(", ");
  return `${t} não encontrado no ator ${e.name ?? "sem nome"} (${n}). Paths testados: ${r}.`;
}
function ko(e, t, n, r, a) {
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
class fb {
  isRitual(t) {
    return t.type === "ritual";
  }
  getCircle(t) {
    if (!this.isRitual(t))
      return g({
        reason: "not-a-ritual",
        message: `Item ${t.name ?? "sem nome"} não é um ritual.`,
        ritual: t
      });
    const n = this.readCircleFromKnownPaths(t);
    if (!n) {
      const s = ar.ritualItem.circleCandidates;
      return g({
        reason: "ritual-circle-not-found",
        message: `Círculo do ritual não encontrado. Paths testados: ${s.join(", ")}.`,
        ritual: t,
        paths: [...s]
      });
    }
    const { path: r, value: a } = n, o = pb(a);
    return o ? A(o) : g({
      reason: "invalid-ritual-circle",
      message: `Círculo do ritual inválido em ${r}: ${String(a)}. Esperado 1, 2, 3 ou 4.`,
      ritual: t,
      path: r,
      value: a
    });
  }
  readCircleFromKnownPaths(t) {
    for (const n of ar.ritualItem.circleCandidates) {
      const r = foundry.utils.getProperty(t, n);
      if (r != null)
        return { path: n, value: r };
    }
    return null;
  }
}
function pb(e) {
  if (Eo(e))
    return e;
  if (typeof e == "string") {
    const t = e.trim();
    if (!/^\d+$/.test(t))
      return null;
    const n = Number(t);
    if (Eo(n))
      return n;
  }
  return null;
}
function Eo(e) {
  return e === 1 || e === 2 || e === 3 || e === 4;
}
const gb = "dice-so-nice";
async function cl(e) {
  if (!hb() || !yb()) return;
  const t = bb();
  if (t?.showForRoll)
    try {
      await Promise.resolve(t.showForRoll(e, game.user, !0));
    } catch (n) {
      m.warn("Não foi possível animar a rolagem com Dice So Nice.", n);
    }
}
function hb() {
  try {
    return md().enabled;
  } catch {
    return !1;
  }
}
function yb() {
  return game.modules?.get?.(gb)?.active === !0;
}
function bb() {
  const t = game.dice3d;
  return !t || typeof t != "object" ? null : t;
}
const Io = "occultism";
class ul {
  getDifficulty(t) {
    return Ab(t);
  }
  async rollCastingCheck(t) {
    const n = this.getDifficulty(t);
    if (n === null)
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    const r = await Tb(t, Io);
    if (!r)
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    await cl(r);
    const a = wb(r);
    return {
      skill: Io,
      skillLabel: "Ocultismo",
      roll: r,
      formula: $b(r),
      total: a,
      difficulty: n,
      success: a >= n,
      diceBreakdown: kb(r)
    };
  }
}
function Ab(e) {
  const t = e.system?.ritual?.DT;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : null;
}
async function _b(e) {
  return new ul().rollCastingCheck(e);
}
async function Tb(e, t) {
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
  return Rb(r);
}
function Rb(e) {
  return Co(e) ? e : Array.isArray(e) ? e.find(Co) ?? null : null;
}
function Co(e) {
  return !!(e && typeof e == "object" && "evaluate" in e && "total" in e);
}
function $b(e) {
  const t = e.formula;
  return typeof t == "string" && t.trim().length > 0 ? t : "rolagem";
}
function wb(e) {
  const t = e.total;
  return typeof t == "number" && Number.isFinite(t) ? Math.trunc(t) : 0;
}
function kb(e) {
  const t = e.dice;
  if (!Array.isArray(t)) return null;
  const n = t.find(Eb);
  if (!n) return null;
  const a = (Array.isArray(n.results) ? n.results : []).flatMap((o) => {
    if (!o || typeof o != "object") return [];
    const s = o.result;
    return typeof s == "number" && Number.isFinite(s) ? [Math.trunc(s)] : [];
  });
  return a.length > 0 ? `(${a.join(", ")})` : null;
}
function Eb(e) {
  return !!(e && typeof e == "object" && e.faces === 20);
}
const Ib = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};
class Cb {
  constructor(t) {
    this.ritualAdapter = t;
  }
  ritualAdapter;
  getCost(t) {
    const n = this.ritualAdapter.getCircle(t.ritual);
    if (!n.ok)
      return g({
        ...n.error,
        actor: t.actor
      });
    const r = n.value, a = Sb(t.ritual, r);
    return a.ok ? a.value ? A(a.value) : A({
      resource: "PE",
      amount: Ib[r],
      source: "default-by-circle",
      circle: r
    }) : g(a.error);
  }
}
function Sb(e, t) {
  const n = e.getFlag(d, "ritual.cost");
  return n == null ? { ok: !0, value: null } : Lb(n) ? {
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
function Lb(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return (t.resource === "PE" || t.resource === "PD") && typeof t.amount == "number" && Number.isInteger(t.amount) && t.amount > 0;
}
const hn = {
  ITEM_USED: "ordemparanormal.itemUsed"
};
function vb(e) {
  if (!Mb(e.item)) return null;
  const t = or(e.actor) ? e.actor : Db(e.item);
  return {
    source: "ordem-item-used-hook",
    actor: t,
    item: e.item,
    token: Nb(e.token) ?? Pb(t),
    targets: kr(),
    message: e.message,
    chatMessageData: e.chatMessageData
  };
}
function Db(e) {
  const t = e;
  return or(t.actor) ? t.actor : or(e.parent) ? e.parent : null;
}
function Pb(e) {
  const t = xb(e) ?? Ob(e);
  return t ? dl(t) : null;
}
function Nb(e) {
  return ir(e) ? dl(e) : null;
}
function xb(e) {
  if (!e) return null;
  const t = e, n = t.token;
  return ir(n) ? n : (t.getActiveTokens?.() ?? []).find(ir) ?? null;
}
function Ob(e) {
  return e ? canvas?.tokens?.controlled?.find((t) => t.actor?.id === e.id) ?? null : null;
}
function dl(e) {
  const t = e.actor ?? null;
  return {
    tokenId: yn(e.id),
    actorId: yn(t?.id),
    sceneId: yn(e.scene?.id),
    name: e.name ?? t?.name ?? "Origem sem nome"
  };
}
function Mb(e) {
  return !!(e && typeof e == "object" && "getFlag" in e && "setFlag" in e);
}
function or(e) {
  return !!(e && typeof e == "object" && "update" in e && "items" in e);
}
function ir(e) {
  return !!(e && typeof e == "object" && ("actor" in e || "id" in e || "name" in e));
}
function yn(e) {
  return typeof e == "string" && e.length > 0 ? e : null;
}
class Fb {
  constructor(t) {
    this.onItemUsed = t;
  }
  onItemUsed;
  id = "ordem-item-used-hook";
  registered = !1;
  register() {
    this.registered || (Hooks.on(hn.ITEM_USED, (t) => {
      this.handleHook(t);
    }), this.registered = !0, m.info(`${hn.ITEM_USED} registrado como fonte de uso de item.`));
  }
  status() {
    return {
      id: this.id,
      registered: this.registered
    };
  }
  async handleHook(t) {
    const n = vb(Bb(t));
    if (!n) {
      m.warn(`${hn.ITEM_USED} disparou sem payload de item válido.`, t);
      return;
    }
    await this.onItemUsed(n);
  }
}
function Bb(e) {
  return e && typeof e == "object" ? e : {};
}
class Ub {
  async applyPresetItemPatch(t, n) {
    const r = n.itemPatch;
    if (!r) return bn("missing-item-patch");
    if (t.type !== "ritual") return bn("unsupported-item-type");
    const a = qb(r);
    return Object.keys(a).length === 0 ? bn("empty-update") : (await t.update(a), {
      applied: !0,
      updateData: a
    });
  }
}
function qb(e) {
  const t = {};
  L(t, "name", e.name), L(t, "system.description", e.descriptionHtml);
  const n = e.ritual;
  return n && (L(t, "system.circle", n.circle), L(t, "system.element", n.element), L(t, "system.target", n.target), L(t, "system.targetQtd", n.targetQuantity), L(t, "system.execution", n.execution), L(t, "system.range", n.range), L(t, "system.duration", n.duration), L(t, "system.skillResis", n.resistanceSkill), L(t, "system.resistance", n.resistance), L(t, "system.studentForm", n.studentForm), L(t, "system.trueForm", n.trueForm)), t;
}
function L(e, t, n) {
  n !== void 0 && (e[t] = n);
}
function bn(e) {
  return {
    applied: !1,
    reason: e,
    updateData: {}
  };
}
class Gb {
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
    return this.getNumber(t, ar.ritual.dt, 0);
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
class jb {
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
    await t.unsetFlag(d, "automation");
  }
  async writeAutomationFlag(t, n) {
    await this.clear(t), await t.setFlag(d, "automation", n);
  }
}
class zb {
  presets = /* @__PURE__ */ new Map();
  register(t) {
    const n = Vb(t);
    return n.ok ? this.presets.has(t.id) ? g({
      reason: "duplicate-preset",
      message: `Preset de automação duplicado: ${t.id}.`,
      presetId: t.id
    }) : (this.presets.set(t.id, An(t)), A(t)) : n;
  }
  registerMany(t) {
    const n = [];
    for (const r of t) {
      const a = this.register(r);
      if (!a.ok)
        return a;
      n.push(a.value);
    }
    return A(n);
  }
  get(t) {
    const n = this.presets.get(t);
    return n ? An(n) : null;
  }
  require(t) {
    const n = this.get(t);
    return n ? A(n) : g({
      reason: "preset-not-found",
      message: `Preset de automação não encontrado: ${t}.`,
      presetId: t
    });
  }
  list() {
    return Array.from(this.presets.values()).map(An);
  }
  findForItem(t) {
    return this.list().map((n) => Hb(n, t)).filter((n) => n !== null).sort((n, r) => r.score - n.score || n.preset.id.localeCompare(r.preset.id));
  }
}
function Vb(e) {
  return !_n(e.id) || !_n(e.version) || !_n(e.label) ? g({
    reason: "invalid-preset",
    message: "Preset de automação precisa de id, version e label válidos.",
    presetId: e.id
  }) : !e.automation || e.automation.version !== 1 || !Array.isArray(e.automation.steps) ? g({
    reason: "invalid-preset",
    message: `Preset ${e.id} possui definição de automação inválida.`,
    presetId: e.id
  }) : A(e);
}
function Hb(e, t) {
  if (e.matchers.length === 0)
    return null;
  const n = [];
  let r = 0;
  if (e.itemTypes.length > 0) {
    if (!e.itemTypes.includes(t.type)) return null;
    r += 10, n.push(`itemType:${t.type}`);
  }
  for (const a of e.matchers) {
    const o = Wb(a, t);
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
function Wb(e, t) {
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
      const n = So(t.name), r = e.names.map(So).includes(n);
      return {
        matches: r,
        score: r ? 100 : 0,
        reason: `normalizedName:${n}`
      };
    }
    case "ritualCircle": {
      const n = Kb(t), r = n !== null && e.circles.includes(n);
      return {
        matches: r,
        score: r ? 20 : 0,
        reason: `ritualCircle:${n ?? "unknown"}`
      };
    }
  }
}
function So(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
function Kb(e) {
  const t = foundry.utils.getProperty(e, "system.circle"), n = typeof t == "string" ? Number(t) : t;
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null;
}
function An(e) {
  return structuredClone(e);
}
function _n(e) {
  return typeof e == "string" && e.length > 0;
}
function St(e, t) {
  if (typeof e.amount == "number")
    return !Number.isInteger(e.amount) || e.amount <= 0 ? g({
      reason: "invalid-amount-source",
      message: "Amount precisa ser um inteiro positivo."
    }) : A(e.amount);
  if (typeof e.amountFrom == "string") {
    const n = Qt(e.amountFrom);
    if (!n)
      return g({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${e.amountFrom}. Use o formato rollId.total.`
      });
    const r = t.rolls[n];
    if (!r)
      return g({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${n}.`
      });
    const a = Math.trunc(r.total);
    return !Number.isInteger(a) || a <= 0 ? g({
      reason: "invalid-amount-source",
      message: `Total da rolagem ${n} não gerou um amount positivo.`
    }) : A(a);
  }
  return g({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}
function Qt(e) {
  return e ? /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(e)?.groups?.rollId ?? null : null;
}
async function Yb(e, t, n) {
  if (!Lo(e.id) || !Lo(e.formula))
    return g({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  try {
    const r = new Roll(e.formula), a = await Promise.resolve(r.evaluate()), o = a.total;
    if (typeof o != "number" || !Number.isFinite(o))
      return g({
        reason: "roll-failed",
        message: `A rolagem ${e.id} não retornou um total numérico válido.`
      });
    await cl(a);
    const l = {
      ...n.rollRequests[e.id] ?? ml(e, t),
      total: o,
      roll: a
    };
    return n.rolls[e.id] = l, A(l);
  } catch (r) {
    return g({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${e.formula}.`,
      cause: r
    });
  }
}
function ml(e, t) {
  const n = e.intent ?? Qb(e.id);
  return {
    id: e.id,
    formula: e.formula,
    intent: n,
    damageType: e.damageType ?? void 0,
    sourceStepIndex: t
  };
}
function Qb(e) {
  const t = e.toLowerCase();
  return t.includes("damage") || t.includes("dano") ? "damage" : t.includes("healing") || t.includes("heal") || t.includes("cura") ? "healing" : t.includes("attack") || t.includes("ataque") ? "attack" : t.includes("resistance") || t.includes("resistencia") || t.includes("resistência") ? "resistance" : "generic";
}
function Lo(e) {
  return typeof e == "string" && e.length > 0;
}
async function Lt(e, t, n, r, a) {
  switch (r) {
    case "spend":
      return n !== "PE" && n !== "PD" ? ht(t, n, r, a) : e.spend(t, n, a);
    case "damage":
      return n !== "PV" && n !== "SAN" ? ht(t, n, r, a) : e.damage(t, n, a);
    case "heal":
      return n !== "PV" ? ht(t, n, r, a) : e.heal(t, n, a);
    case "recover":
      return n !== "SAN" ? ht(t, n, r, a) : e.recover(t, n, a);
  }
}
function ht(e, t, n, r) {
  return g({
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
function Zb(e) {
  const { step: t, context: n, transaction: r, stepIndex: a, lifecycle: o } = e;
  if (t.operation === "damage") {
    const s = Xb(t, n, r, a);
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
    const s = Jb(t, n, r, a);
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
function Xb(e, t, n, r) {
  const a = Qt(e.amountFrom), o = a ? t.rolls[a] : void 0;
  return {
    id: fl(t.id, "damage", r, t.damageInstances.length),
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
function Jb(e, t, n, r) {
  const a = Qt(e.amountFrom);
  return {
    id: fl(t.id, "healing", r, t.healingInstances.length),
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
function fl(e, t, n, r) {
  return `${e}.${t}.${n}.${r}`;
}
function eA(e, t, n) {
  const r = Qt(e.amountFrom), a = r ? t.rolls[r] : void 0;
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
function tA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("beforeApply", n, { stepIndex: r, step: t, metadata: a }), pl("before", e), vo("before", e), vo("resolve", e);
}
function nA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("apply", n, { stepIndex: r, step: t, metadata: a }), pl("apply", e);
}
function rA(e) {
  const { step: t, context: n, stepIndex: r, metadata: a, lifecycle: o } = e;
  o.emit("afterApply", n, { stepIndex: r, step: t, metadata: a });
}
function pl(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t, l = aA(e, n.operation);
  l && s.emit(l, r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function vo(e, t) {
  const { step: n, context: r, stepIndex: a, metadata: o, lifecycle: s } = t;
  n.operation === "damage" && s.emit(e === "before" ? "beforeDamageResolution" : "damageResolution", r, {
    stepIndex: a,
    step: n,
    metadata: o
  });
}
function aA(e, t) {
  return t === "damage" ? e === "before" ? "beforeApplyDamage" : e === "apply" ? "applyDamage" : "afterApplyDamage" : t === "heal" ? e === "before" ? "beforeApplyHealing" : e === "apply" ? "applyHealing" : "afterApplyHealing" : null;
}
async function oA(e, t, n) {
  try {
    return await e.createWorkflowSummaryMessage(n, t), A(void 0);
  } catch (r) {
    return g({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause: r
    });
  }
}
async function iA(e) {
  const { step: t } = e;
  switch (t.type) {
    case "spendResource":
      return sA(e, t);
    case "spendRitualCost":
      return lA(e, t);
  }
}
async function sA(e, t) {
  const { context: n, resources: r } = e, a = St(t, n);
  return a.ok ? gl(await r.spend(n.sourceActor, t.resource, a.value), n) : g(a.error);
}
async function lA(e, t) {
  const { context: n, resources: r, ritualCosts: a } = e, o = a.getCost({
    actor: n.sourceActor,
    ritual: n.item
  });
  if (!o.ok)
    return g({
      reason: "ritual-cost-failed",
      message: o.error.message,
      cause: o.error
    });
  const s = o.value;
  return n.ritualCosts.push({
    ...s,
    itemId: n.item.id ?? null,
    itemName: n.item.name ?? "Ritual sem nome"
  }), gl(await r.spend(n.sourceActor, s.resource, s.amount), n, t);
}
function gl(e, t, n) {
  return e.ok ? (t.resourceTransactions.push(e.value), A(void 0)) : (n?.type === "spendRitualCost" && t.ritualCosts.pop(), g({
    reason: "resource-operation-failed",
    message: e.error.message,
    cause: e.error
  }));
}
async function cA(e) {
  const { step: t, context: n, stepIndex: r, lifecycle: a, execute: o } = e, s = uA(t);
  for (const c of s.before)
    a.emit(c, n, { stepIndex: r, step: t });
  const l = await o();
  if (!l.ok)
    return l;
  for (const c of s.after)
    a.emit(c, n, { stepIndex: r, step: t });
  return l;
}
function uA(e) {
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
class dA {
  constructor(t, n, r, a) {
    this.resources = t, this.ritualCosts = n, this.messages = r, this.lifecycle = a;
  }
  resources;
  ritualCosts;
  messages;
  lifecycle;
  async run(t, n) {
    if (t.steps.length === 0)
      return g({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context: n
      });
    for (const [r, a] of t.steps.entries()) {
      const o = await this.runStep(a, n, r);
      if (!o.ok)
        return o;
    }
    return A({ definition: t, context: n });
  }
  async runStep(t, n, r) {
    switch (t.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(t, n, r);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(t, n, r);
      default:
        return cA({
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
        return g({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex: r,
          step: t,
          context: n
        });
    }
  }
  async runCostStep(t, n, r) {
    const a = await iA({
      step: t,
      context: n,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });
    return a.ok ? A(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runRollFormulaStepWithLifecycle(t, n, r) {
    const a = ml(t, r);
    n.rollRequests[a.id] = a, this.lifecycle.emit("beforeRoll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("before", a, n, r, t), this.lifecycle.emit("roll", n, { stepIndex: r, step: t, rollRequest: a }), this.emitSpecificRollPhase("roll", a, n, r, t);
    const o = await this.runRollFormulaStep(t, n, r);
    if (!o.ok)
      return o;
    const s = n.rolls[a.id];
    return this.emitSpecificRollPhase("after", a, n, r, t, s), this.lifecycle.emit("afterRoll", n, { stepIndex: r, step: t, rollRequest: a, rollResult: s }), A(void 0);
  }
  async runRollFormulaStep(t, n, r) {
    const a = await Yb(t, r, n);
    return a.ok ? A(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  async runModifyResourceStepWithLifecycle(t, n, r) {
    const a = St(t, n);
    if (!a.ok)
      return g({ ...a.error, stepIndex: r, step: t, context: n });
    const o = eA(t, n, a.value);
    tA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), nA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    });
    const s = this.resolveActors(t.actor, n);
    if (s.length === 0)
      return g({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const l of s) {
      const c = await Lt(this.resources, l, t.resource, t.operation, a.value), u = this.handleResourceOperationResult(c, n, r, t);
      if (!u.ok)
        return u;
      Zb({
        step: t,
        context: n,
        transaction: u.value,
        stepIndex: r,
        lifecycle: this.lifecycle
      });
    }
    return rA({
      step: t,
      context: n,
      stepIndex: r,
      metadata: o,
      lifecycle: this.lifecycle
    }), A(void 0);
  }
  async runModifyResourceStep(t, n, r) {
    const a = St(t, n);
    if (!a.ok)
      return g({ ...a.error, stepIndex: r, step: t, context: n });
    const o = this.resolveActors(t.actor, n);
    if (o.length === 0)
      return g({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex: r,
        step: t,
        context: n
      });
    for (const s of o) {
      const l = await Lt(this.resources, s, t.resource, t.operation, a.value), c = this.handleResourceOperationResult(l, n, r, t);
      if (!c.ok)
        return c;
    }
    return A(void 0);
  }
  async runChatCardStep(t, n, r) {
    const a = await oA(this.messages, t, n);
    return a.ok ? A(void 0) : g({ ...a.error, stepIndex: r, step: t, context: n });
  }
  handleResourceOperationResult(t, n, r, a) {
    return t.ok ? (n.resourceTransactions.push(t.value), A(t.value)) : g({
      reason: "resource-operation-failed",
      message: t.error.message,
      stepIndex: r,
      step: a,
      context: n,
      cause: t.error
    });
  }
  emitSpecificRollPhase(t, n, r, a, o, s) {
    const l = mA(t, n.intent);
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
function mA(e, t) {
  return t === "damage" ? e === "before" ? "beforeDamageRoll" : e === "roll" ? "damageRoll" : "afterDamageRoll" : t === "healing" ? e === "before" ? "beforeHealingRoll" : e === "roll" ? "healingRoll" : "afterHealingRoll" : null;
}
class fA {
  emitCastStarted(t) {
    Hooks.callAll(At.ritual.castStarted, t);
  }
  emitAreaResolved(t) {
    Hooks.callAll(At.ritual.areaResolved, t);
  }
  emitCastFinished(t) {
    Hooks.callAll(At.ritual.castFinished, t);
  }
}
class pA {
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
      return g({
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
      return g({
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
      return g({
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
    const { afterValue: c, appliedAmount: u } = l.value, f = {
      value: c,
      max: s.max
    };
    try {
      c !== s.value && await this.adapter.updateResourceValue(t, n, c);
    } catch (y) {
      return g({
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
        cause: y
      });
    }
    return A({
      actor: t,
      actorId: t.id ?? null,
      actorName: t.name ?? "Ator sem nome",
      resource: n,
      operation: r,
      requestedAmount: a,
      appliedAmount: u,
      before: s,
      after: f
    });
  }
  calculate(t, n, r) {
    switch (t) {
      case "spend":
        return n.value < r ? g({
          reason: "insufficient-resource",
          message: `Recurso insuficiente. Atual: ${n.value}; custo: ${r}.`
        }) : A({
          afterValue: n.value - r,
          appliedAmount: r
        });
      case "damage": {
        const a = Math.max(0, n.value - r);
        return A({
          afterValue: a,
          appliedAmount: n.value - a
        });
      }
      case "heal":
      case "recover": {
        const a = Math.min(n.max, n.value + r);
        return A({
          afterValue: a,
          appliedAmount: a - n.value
        });
      }
    }
  }
}
class gA {
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
function hl(e) {
  return {
    id: hA(),
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
function hA() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class yA {
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
    return ue(this.lastContext);
  }
  async runAutomation(t, n) {
    const r = hl(n);
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
class bA {
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
    }), Hooks.callAll(`${d}.workflow.${t}`, a), Hooks.callAll(`${d}.workflow.phase`, a), a;
  }
}
class AA {
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
    const n = Pn();
    return !n.enabled || !n.chat ? !1 : (await ChatMessage.create({
      speaker: t.speaker,
      content: t.content,
      whisper: _A(),
      flags: {
        ...t.flags,
        [d]: {
          ...TA(t.flags),
          debugOutput: !0
        }
      }
    }), n.console && t.data !== void 0 && m.info("Debug chat criado.", t.data), !0);
  }
  emit(t, n) {
    const r = Pn();
    if (!r.enabled)
      return;
    const a = n.notification ?? Do(n);
    r.console && this.emitConsole(t, n), r.ui && this.emitUi(t, a);
  }
  emitConsole(t, n) {
    const r = Do(n);
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
function Do(e) {
  return e.message ? `${e.title}: ${e.message}` : e.title;
}
function _A() {
  const e = game.users?.filter((t) => t.isGM === !0 && t.id).map((t) => t.id) ?? [];
  return e.length > 0 ? e : game.user?.id ? [game.user.id] : [];
}
function TA(e) {
  const t = e?.[d];
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const RA = ".inline-roll, .inline-result, a[data-roll], span[data-roll]", yl = `${d}-inline-roll-neutralized`, $A = `${d}-inline-roll-notice`, ea = `data-${d}-inline-roll-neutralized`, Po = `data-${d}-inline-roll-notice`, wA = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";
async function No(e) {
  const t = FA(e.message), n = await kA(e.message), r = EA(t);
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
async function kA(e) {
  const t = xA(e);
  if (!t || typeof t.content != "string")
    return { updated: !1, replacementCount: 0 };
  const n = IA(t.content);
  return n.replacementCount === 0 || n.content === t.content ? { updated: !1, replacementCount: n.replacementCount } : { updated: await OA(t, n.content), replacementCount: n.replacementCount };
}
function EA(e) {
  const t = e ? MA(e) : null;
  if (!t)
    return { replacementCount: 0 };
  const n = bl(t);
  return n > 0 && Al(DA(t)), { replacementCount: n };
}
function IA(e) {
  const t = CA(e), n = document.createElement("template");
  n.innerHTML = t.content;
  const r = bl(n.content), a = t.replacementCount + r;
  return a === 0 ? { content: e, replacementCount: 0 } : (Al(n.content), { content: n.innerHTML, replacementCount: a });
}
function CA(e) {
  let t = 0;
  return { content: e.replace(/\[\[([^\[\]]+)\]\]/g, (r, a) => (t += 1, LA(a.trim()))), replacementCount: t };
}
function bl(e) {
  const t = SA(e);
  for (const n of t)
    n.replaceWith(vA(PA(n)));
  return t.length;
}
function SA(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.querySelectorAll(RA))
    n.getAttribute(ea) !== "true" && t.add(n);
  return Array.from(t);
}
function LA(e) {
  return `<span class="${yl}" ${ea}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${BA(e)}</span>`;
}
function vA(e) {
  const t = document.createElement("span");
  return t.classList.add(yl), t.setAttribute(ea, "true"), t.title = "Rolagem inline ignorada pelo Paranormal Toolkit", t.textContent = e, t;
}
function Al(e) {
  if (e.querySelector?.(`[${Po}="true"]`)) return;
  const t = document.createElement("p");
  t.classList.add($A), t.setAttribute(Po, "true"), t.textContent = wA, e.append(t);
}
function DA(e) {
  return e.querySelector(".message-content") ?? e;
}
function PA(e) {
  const n = e.getAttribute("data-formula") ?? NA(e.getAttribute("data-roll")) ?? e.textContent?.trim().replace(/\s+/g, " ");
  return n && n.length > 0 ? n : "rolagem inline";
}
function NA(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return typeof t.formula == "string" && t.formula.length > 0 ? t.formula : null;
  } catch {
    return null;
  }
}
function xA(e) {
  return e && typeof e == "object" ? e : null;
}
async function OA(e, t) {
  if (typeof e.update != "function")
    return !1;
  try {
    return await Promise.resolve(e.update({ content: t })), !0;
  } catch (n) {
    return m.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", n), !1;
  }
}
function MA(e) {
  const t = UA(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function FA(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : null;
}
function BA(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function UA(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const vt = "ritualRollConfig", Se = "ritual-roll";
function Zt() {
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
function _l(e) {
  const t = e.getFlag(d, vt);
  return sr(t);
}
function Tl(e) {
  return _l(e) ?? Zt();
}
async function qA(e, t) {
  const n = sr(t) ?? sr({
    ...Zt(),
    ...t
  });
  if (!n)
    throw new Error("Configuração de rolagem do ritual inválida.");
  return await e.setFlag(d, vt, n), n;
}
async function GA(e) {
  const t = e.unsetFlag;
  if (typeof t == "function") {
    await Promise.resolve(t.call(e, d, vt));
    return;
  }
  await e.setFlag(d, vt, null);
}
function sr(e) {
  if (!Xt(e)) return null;
  const t = QA(e.intent);
  if (!t) return null;
  const n = Zt();
  return {
    schemaVersion: 1,
    intent: t,
    damageType: Dt(e.damageType),
    utilityLabel: Dt(e.utilityLabel) ?? n.utilityLabel,
    note: ta(e.note),
    forms: ZA(e.forms)
  };
}
function jA(e) {
  switch (e) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}
function zA(e) {
  const t = _l(e);
  if (!t) return null;
  const n = t.forms.base.formula.trim();
  if (!n) return null;
  const r = VA(t, n), a = [
    { type: "spendRitualCost" },
    r,
    ...HA(t)
  ];
  return {
    version: 1,
    label: `Fórmula de ${e.name ?? "ritual"}`,
    steps: a,
    ritualForms: KA(e, t),
    resistance: t.intent === "damage" ? Rl(e) : void 0
  };
}
function VA(e, t) {
  const n = {
    type: "rollFormula",
    id: Se,
    formula: t,
    intent: YA(e.intent)
  };
  return e.intent === "damage" && e.damageType && (n.damageType = e.damageType), n;
}
function HA(e) {
  switch (e.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${Se}.total`,
          ...WA(e.damageType)
        }
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${Se}.total`
        }
      ];
    case "utility":
      return [];
  }
}
function WA(e) {
  return e ? { damageType: e } : {};
}
function KA(e, t) {
  const n = t.forms.base.formula.trim(), r = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [Se]: n
      }
    }
  };
  return xo(e, "discente") && t.forms.discente.formula.trim() && (r.discente = {
    label: "Discente",
    extraCost: 2,
    rollFormulaOverrides: {
      [Se]: t.forms.discente.formula.trim()
    }
  }), xo(e, "verdadeiro") && t.forms.verdadeiro.formula.trim() && (r.verdadeiro = {
    label: "Verdadeiro",
    extraCost: 5,
    rollFormulaOverrides: {
      [Se]: t.forms.verdadeiro.formula.trim()
    }
  }), r;
}
function Rl(e) {
  const t = $l(e), n = Dt(t.skillResis), r = Dt(t.resistance);
  if (!n || r !== "reducesByHalf") return;
  const a = XA(n);
  return {
    skill: n,
    label: a,
    effect: "reducesByHalf",
    summary: `${a} reduz à metade`
  };
}
function YA(e) {
  switch (e) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
  }
}
function QA(e) {
  return e === "damage" || e === "healing" || e === "utility" ? e : null;
}
function ZA(e) {
  const t = Zt();
  return Xt(e) ? {
    base: Tn(e.base),
    discente: Tn(e.discente),
    verdadeiro: Tn(e.verdadeiro)
  } : t.forms;
}
function Tn(e) {
  return Xt(e) ? { formula: ta(e.formula) } : { formula: "" };
}
function xo(e, t) {
  const n = $l(e), r = t === "discente" ? n.studentForm : n.trueForm;
  return JA(r);
}
function $l(e) {
  const t = e.system;
  return Xt(t) ? t : {};
}
function XA(e) {
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
function JA(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function ta(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Dt(e) {
  const t = ta(e);
  return t.length > 0 ? t : null;
}
function Xt(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function e_(e) {
  return 20 + Math.max(0, Math.trunc(e));
}
function t_(e) {
  switch (n_(e)) {
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
      return r_(String(e ?? ""));
  }
}
function n_(e) {
  if (e == null) return null;
  const t = String(e).trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return t.length > 0 ? t : null;
}
function r_(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : "Sem tipo";
}
function a_() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `ritual-cast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function o_(e) {
  return {
    ...na(e),
    type: "ritual.cast.started"
  };
}
function i_(e) {
  return {
    ...na(e),
    type: "ritual.area.resolved",
    area: e.area
  };
}
function s_(e) {
  return {
    ...na(e),
    type: "ritual.cast.finished",
    status: e.status,
    ...e.reason ? { reason: e.reason } : {},
    ...e.message ? { message: e.message } : {}
  };
}
function l_(e) {
  if (e.type === "preset") {
    const t = de(e.presetId);
    return {
      type: "preset",
      presetId: t,
      presetVersion: de(e.presetVersion),
      label: null,
      fxEligible: t !== null
    };
  }
  return e.type === "manual" ? {
    type: "manual",
    presetId: null,
    presetVersion: null,
    label: de(e.label),
    fxEligible: !1
  } : e.type === "generic" ? {
    type: "generic",
    presetId: null,
    presetVersion: null,
    label: null,
    fxEligible: !1
  } : {
    type: "unknown",
    presetId: null,
    presetVersion: null,
    label: null,
    fxEligible: !1
  };
}
function c_(e) {
  const t = g_(e), n = h_(e), r = b_(n) ?? { x: 0, y: 0, width: 0, height: 0 }, a = A_(n) ?? T_(r), o = $_(canvas?.grid?.size);
  return {
    type: "rectangleRay",
    sceneId: R_(e, t),
    regionId: Mo(t?.id) ?? Mo(e.id),
    gridSize: o,
    bounds: {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height
    },
    shape: {
      x: D(a.x) ?? 0,
      y: D(a.y) ?? 0,
      width: D(a.width) ?? r.width,
      height: D(a.height) ?? r.height,
      direction: D(a.direction) ?? 0,
      elevation: D(a.elevation)
    },
    center: {
      x: r.x + r.width / 2,
      y: r.y + r.height / 2
    },
    ray: {
      start: null,
      end: null
    },
    source: "lineArea",
    targetingMode: "lineArea"
  };
}
function na(e) {
  const t = l_(e.automationSource), n = e.targets ?? e.context.targets;
  return {
    version: 1,
    castId: e.castId,
    sceneId: e.context.token?.sceneId ?? canvas?.scene?.id ?? null,
    timestamp: Date.now(),
    automation: t,
    caster: {
      actor: {
        id: e.context.actor?.id ?? null,
        uuid: e.context.actor?.uuid ?? null,
        name: e.context.actor?.name ?? null
      },
      token: m_(e.context.token)
    },
    item: {
      id: e.context.item.id ?? null,
      uuid: e.context.item.uuid ?? null,
      name: e.context.item.name,
      type: e.context.item.type
    },
    ritual: u_(e.context.item, e.form, e.formLabel, t),
    targets: n.map(f_),
    documents: {
      actor: e.context.actor,
      token: null,
      item: e.context.item
    }
  };
}
function u_(e, t, n, r) {
  return {
    name: e.name,
    slug: Rn(e, "system.slug") ?? Rn(e, "slug"),
    presetId: r.presetId,
    presetVersion: r.presetVersion,
    element: Rn(e, "system.element"),
    circle: p_(e),
    form: d_(t),
    formLabel: n
  };
}
function d_(e) {
  switch (e) {
    case "discente":
      return "student";
    case "verdadeiro":
      return "true";
    case "base":
      return "standard";
  }
}
function m_(e) {
  return e ? {
    id: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  } : null;
}
function f_(e) {
  return {
    tokenId: e.tokenId,
    actorId: e.actorId,
    sceneId: e.sceneId,
    name: e.name
  };
}
function p_(e) {
  const t = foundry.utils.getProperty(e, "system.circle") ?? foundry.utils.getProperty(e, "system.ritual.circle");
  return typeof t == "number" && Number.isFinite(t) ? t : de(t);
}
function Rn(e, t) {
  return de(foundry.utils.getProperty(e, t));
}
function de(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}
function g_(e) {
  return "document" in e && e.document ? e.document : e;
}
function h_(e) {
  return [
    e,
    y_(e),
    "document" in e ? e.document : null,
    "document" in e ? e.document?.object : null
  ].filter(wl);
}
function y_(e) {
  return "object" in e && wl(e.object) ? e.object : null;
}
function wl(e) {
  return !!(e && typeof e == "object");
}
function b_(e) {
  const t = e.map((n) => n.bounds);
  for (const n of t) {
    if (!n) continue;
    const r = D(n.x), a = D(n.y), o = D(n.width), s = D(n.height);
    if (!(r === null || a === null || o === null || s === null))
      return { x: r, y: a, width: o, height: s };
  }
  return null;
}
function A_(e) {
  for (const t of e) {
    const n = __(t).find((r) => r.type === "rectangle") ?? null;
    if (n) return n;
  }
  return null;
}
function __(e) {
  if (!e || typeof e != "object") return [];
  const t = e.shapes;
  if (Array.isArray(t)) return t.filter(Oo);
  const n = e.toObject;
  if (typeof n != "function") return [];
  const r = n.call(e);
  return Array.isArray(r?.shapes) ? r.shapes.filter(Oo) : [];
}
function Oo(e) {
  return !!(e && typeof e == "object" && typeof e.type == "string");
}
function T_(e) {
  return {
    type: "rectangle",
    x: 0,
    y: 0,
    width: e.width,
    height: e.height,
    direction: 0,
    elevation: null
  };
}
function R_(e, t) {
  return $n(e, "parent.id") ?? $n(e, "document.parent.id") ?? $n(t, "parent.id") ?? canvas?.scene?.id ?? null;
}
function $n(e, t) {
  return de(foundry.utils.getProperty(e, t));
}
function Mo(e) {
  return de(e);
}
function D(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function $_(e) {
  const t = D(e);
  return t !== null && t > 0 ? t : null;
}
class w_ {
  validateCanvasState() {
    return !canvas || canvas.ready !== !0 ? {
      ok: !1,
      reason: "canvas-unavailable",
      message: "Canvas não está pronto para selecionar alvos por linha."
    } : canvas.scene ? { ok: !0 } : {
      ok: !1,
      reason: "scene-unavailable",
      message: "Nenhuma cena ativa para selecionar alvos por linha."
    };
  }
  warn(t) {
    ui.notifications?.warn(`Paranormal Toolkit: ${t}`);
  }
}
class Jt {
  canPlaceRegions() {
    return !canvas || canvas.ready !== !0 ? {
      ok: !1,
      reason: "canvas-unavailable",
      message: "Canvas não está pronto para selecionar alvos por Region."
    } : canvas.scene ? typeof canvas.regions?.placeRegion != "function" ? {
      ok: !1,
      reason: "region-layer-unavailable",
      message: "A camada de Regions do Foundry não está disponível para selecionar alvos."
    } : { ok: !0 } : {
      ok: !1,
      reason: "scene-unavailable",
      message: "Nenhuma cena ativa para selecionar alvos por Region."
    };
  }
  async placeRegion(t, n = {}) {
    return canvas?.regions?.placeRegion(t, n) ?? null;
  }
  getTokensInBounds(t) {
    const n = canvas?.tokens?.quadtree?.getObjects?.(t);
    return n ? Array.from(n) : this.getSceneTokens();
  }
  async deleteRegionDocumentById(t) {
    await canvas?.scene?.deleteEmbeddedDocuments?.("Region", [t]);
  }
  getSceneTokens() {
    return canvas?.tokens?.placeables ?? [];
  }
  getUserTargetIds() {
    return Array.from(game.user?.targets ?? []).flatMap((t) => {
      const n = t.id ?? t.document?.id ?? null;
      return n ? [n] : [];
    });
  }
  updateUserTargets(t) {
    this.updateUserTargetState(t), this.updateTokenTargetVisuals(t);
  }
  updateUserTargetState(t) {
    game.user?.updateTokenTargets?.(t), game.user?.broadcastActivity?.({ targets: t });
  }
  updateTokenTargetVisuals(t) {
    const n = new Set(t);
    for (const r of this.getSceneTokens()) {
      if (typeof r.setTarget != "function") continue;
      const a = r.id ?? r.document?.id ?? null;
      r.setTarget(!!(a && n.has(a)), {
        user: game.user ?? void 0,
        releaseOthers: !1,
        groupSelection: !0
      });
    }
  }
  getGridSize() {
    const t = canvas?.grid?.size;
    return typeof t == "number" && Number.isFinite(t) && t > 0 ? t : null;
  }
  getUserColor() {
    const t = game.user?.color;
    return typeof t == "string" && t.length > 0 ? t : null;
  }
  warn(t) {
    ui.notifications?.warn(`Paranormal Toolkit: ${t}`);
  }
  error(t) {
    ui.notifications?.error(`Paranormal Toolkit: ${t}`);
  }
}
const k_ = "Não foi possível remover a Region temporária da linha. Remova-a manualmente da cena.";
class E_ {
  constructor(t = new Jt()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async deleteCreatedRegion(t) {
    const n = I_(t, this.foundryAdapter);
    for (const r of n)
      try {
        await r.run(), r.method;
        return;
      } catch {
        r.method;
      }
    this.foundryAdapter.warn(k_);
  }
}
function I_(e, t) {
  const n = [], r = C_(e), a = Fo(r), o = Fo(e);
  if (typeof r?.delete == "function") {
    const s = r.delete.bind(r);
    n.push({ method: "document.delete", run: s });
  }
  if (typeof e.delete == "function") {
    const s = e.delete.bind(e);
    n.push({ method: "region.delete", run: s });
  }
  return a && n.push({
    method: "scene.deleteEmbeddedDocuments(document.id)",
    run: () => t.deleteRegionDocumentById(a)
  }), o && o !== a && n.push({
    method: "scene.deleteEmbeddedDocuments(region.id)",
    run: () => t.deleteRegionDocumentById(o)
  }), n;
}
function C_(e) {
  return S_(e) ? e.document ?? null : e;
}
function S_(e) {
  return "bounds" in e;
}
function Fo(e) {
  return typeof e?.id == "string" && e.id.length > 0 ? e.id : null;
}
const L_ = 100, v_ = 12;
class D_ {
  constructor(t = new Jt()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  async placeLine(t = { shape: "rectangleRay" }, n = {}) {
    const r = this.foundryAdapter.canPlaceRegions();
    if (!r.ok)
      return {
        status: "failed",
        reason: r.reason,
        message: r.message
      };
    try {
      const a = this.foundryAdapter.getGridSize() ?? L_, o = M_(n), s = await this.foundryAdapter.placeRegion(
        P_(t, this.foundryAdapter.getUserColor(), a),
        {
          create: !0,
          allowRotation: !0,
          ...o
        }
      );
      return s ? {
        status: "confirmed",
        region: s,
        wasCreated: !0
      } : {
        status: "cancelled",
        reason: "region-placement-cancelled"
      };
    } catch (a) {
      return {
        status: "failed",
        reason: "region-placement-failed",
        message: O_(a)
      };
    }
  }
}
function P_(e, t, n) {
  return {
    name: "Ritual: Linha de efeito",
    color: t ?? void 0,
    displayMeasurements: !0,
    highlightMode: "coverage",
    flags: {
      [d]: {
        temporary: !0,
        purpose: "ritual-line-targeting"
      }
    },
    shapes: [N_(e, n)]
  };
}
function N_(e, t) {
  const n = x_(e, t);
  return {
    type: "rectangle",
    x: 0,
    y: 0,
    width: n.length,
    height: n.width,
    direction: e.direction ?? 0,
    elevation: e.elevation ?? 0
  };
}
function x_(e, t) {
  return {
    length: Bo(e.length, v_, t),
    width: Bo(e.width, 1, t)
  };
}
function Bo(e, t, n) {
  return (typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t) * n;
}
function O_(e) {
  const t = "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";
  return e instanceof Error && e.message.trim().length > 0 ? `${t} (${e.message})` : t;
}
function M_(e) {
  const t = (n) => {
    const r = F_(n);
    r && e.onChange?.(r);
  };
  return {
    onChange: t,
    onMove: t,
    onRotate: t
  };
}
function F_(e) {
  return B_(e) ? {
    document: e.document,
    preview: e.preview ?? null,
    shape: e.shape ?? null
  } : { document: e };
}
function B_(e) {
  return !!(e && typeof e == "object" && "document" in e && e.document);
}
class U_ {
  constructor(t = new Jt()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  lastAppliedTargetIds = null;
  captureCurrentTargets() {
    const t = this.foundryAdapter.getUserTargetIds();
    return this.lastAppliedTargetIds = t, { targetIds: t };
  }
  previewTargets(t) {
    this.applyTargets(Uo(t));
  }
  keepPreviewTargets(t) {
    this.applyTargets(Uo(t));
  }
  restorePreviousTargets(t) {
    this.applyTargets(t.targetIds), this.lastAppliedTargetIds = null;
  }
  applyTargets(t) {
    const n = q_(t);
    G_(this.lastAppliedTargetIds, n) || (this.lastAppliedTargetIds = n, this.foundryAdapter.updateUserTargets(n));
  }
}
function Uo(e) {
  return e.flatMap((t) => {
    const n = t.id ?? t.document?.id ?? null;
    return n ? [n] : [];
  });
}
function q_(e) {
  return Array.from(new Set(e));
}
function G_(e, t) {
  return !e || e.length !== t.length ? !1 : e.every((n, r) => n === t[r]);
}
class j_ {
  constructor(t = new Jt()) {
    this.foundryAdapter = t;
  }
  foundryAdapter;
  resolveTargets(t) {
    const n = this.resolveTargetTokens(t);
    return {
      ...n,
      targets: n.tokens.map(Si)
    };
  }
  resolvePreviewTargetTokens(t) {
    return this.resolveFirstRegionCandidate(z_(t), "preview");
  }
  resolveTargetTokens(t) {
    return this.resolveFirstRegionCandidate(V_(t), "final");
  }
  resolveFirstRegionCandidate(t, n) {
    t.map((r) => ({
      source: r.source,
      hasBounds: lr(r.region)
    }));
    for (const r of t) {
      if (!lr(r.region)) continue;
      const a = this.resolveRegionObjectTargetTokens(r.region);
      return r.source, a.tokens.length, a;
    }
    return { tokens: [], source: "regionObjectUnavailable" };
  }
  resolveRegionObjectTargetTokens(t) {
    if (!t.bounds) return { tokens: [], source: "regionObjectUnavailable" };
    const n = this.foundryAdapter.getTokensInBounds(t.bounds), r = W_(
      n.filter((a) => !a.actor || typeof a.document?.testInsideRegion != "function" ? !1 : a.document.testInsideRegion(t))
    );
    return n.length, r.length, { tokens: r, source: "regionObject" };
  }
}
function z_(e) {
  return [
    { source: "document", region: ce(e.document) },
    { source: "document.object", region: ce(e.document.object) },
    { source: "preview", region: ce(e.preview) },
    { source: "preview.document.object", region: ce(e.preview?.document?.object) }
  ];
}
function V_(e) {
  return [
    { source: "input", region: ce(e) },
    { source: "input.object", region: H_(e) ? ce(e.object) : null },
    { source: "input.document.object", region: kl(e) ? ce(e.document?.object) : null }
  ];
}
function ce(e) {
  return lr(e) ? e : null;
}
function lr(e) {
  if (!e || typeof e != "object") return !1;
  const t = e.bounds;
  if (!t || typeof t != "object") return !1;
  const n = t;
  return yt(n.x) && yt(n.y) && yt(n.width) && yt(n.height);
}
function kl(e) {
  return "document" in e && "bounds" in e;
}
function H_(e) {
  return !kl(e);
}
function W_(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = n.uuid ?? n.id ?? n.document?.uuid ?? n.document?.id ?? n.name;
    return r ? t.has(r) ? !1 : (t.add(r), !0) : !0;
  });
}
function yt(e) {
  return typeof e == "number" && Number.isFinite(e);
}
const K_ = "Nenhum alvo encontrado na linha.";
class Y_ {
  constructor(t = new D_(), n = new j_(), r = new E_(), a = new U_(), o = new w_()) {
    this.regionLinePlacement = t, this.regionTargetResolver = n, this.regionCleanup = r, this.regionTargetPreview = a, this.foundryAdapter = o;
  }
  regionLinePlacement;
  regionTargetResolver;
  regionCleanup;
  regionTargetPreview;
  foundryAdapter;
  async resolvePreCastTargets(t) {
    const n = t.castOptions.areaTargeting;
    if (!n || !n.enabled || n.mode === "selectedTokens")
      return {
        status: "confirmed",
        targets: t.currentTargets
      };
    if (n.mode === "lineArea") {
      const r = this.regionTargetPreview.captureCurrentTargets(), a = () => {
        this.regionTargetPreview.restorePreviousTargets(r);
      }, o = await this.regionLinePlacement.placeLine(
        {
          shape: "rectangleRay",
          length: t.formTargeting?.template?.distance,
          width: t.formTargeting?.template?.width
        },
        {
          onChange: (s) => {
            try {
              const l = this.regionTargetResolver.resolvePreviewTargetTokens(s);
              this.regionTargetPreview.previewTargets(l.tokens);
            } catch {
              this.regionTargetPreview.previewTargets([]);
            }
          }
        }
      );
      if (o.status === "cancelled")
        return a(), o;
      if (o.status === "failed")
        return a(), this.foundryAdapter.warn(o.message), o;
      try {
        const s = this.regionTargetResolver.resolveTargets(o.region), l = c_(o.region);
        return s.targets.length === 0 ? (a(), this.foundryAdapter.warn(K_), {
          status: "cancelled",
          reason: "no-targets-found"
        }) : (this.regionTargetPreview.keepPreviewTargets(s.tokens), {
          status: "confirmed",
          targets: s.targets,
          areaSnapshot: l
        });
      } catch (s) {
        a();
        const l = Q_(s);
        return this.foundryAdapter.warn(l), {
          status: "failed",
          reason: "region-resolution-failed",
          message: l
        };
      } finally {
        o.wasCreated && await this.regionCleanup.deleteCreatedRegion(o.region);
      }
    }
    return {
      status: "failed",
      reason: "unsupported-targeting-mode",
      message: "Modo de seleção de alvos não suportado."
    };
  }
}
function Q_(e) {
  return e instanceof Error && e.message.trim().length > 0 ? `Falha ao resolver os alvos da linha: ${e.message}` : "Falha ao resolver os alvos da linha.";
}
function Z_(e) {
  return {
    header: {
      eyebrow: Ar,
      title: e.ritual.name ?? "Ritual sem nome",
      subtitle: oT(e.ritual)
    },
    forms: e.variantOptions.map((t) => X_(t, e.cost)),
    cost: {
      spendResourceChecked: e.defaultSpendResource,
      baseCostText: e.cost ? `${e.cost.amount} ${e.cost.resource}` : "não resolvido",
      casterName: e.actor.name ?? "Ator sem nome"
    },
    targets: tT(e.targetNames, e.variantOptions, e.ritual),
    automation: aT(e.automationStatus ?? "assisted")
  };
}
function X_(e, t) {
  const n = J_(e);
  return {
    variant: e.variant,
    label: e.label,
    enabled: e.enabled,
    checked: e.variant === "base",
    costText: e.enabled ? e.finalCostText ?? eT(t) : "—",
    details: n
  };
}
function J_(e) {
  return e.enabled ? e.details.map((t) => t.trim()).filter((t) => t.length > 0).filter((t) => !t.toLocaleLowerCase().startsWith("custo final")) : [e.unavailableReason ?? "não disponível neste ritual"];
}
function eT(e) {
  return e ? `${e.amount} ${e.resource}` : "custo não resolvido";
}
function tT(e, t, n) {
  const r = e.map((a) => a.trim()).filter((a) => a.length > 0);
  return {
    targetNames: r,
    targetText: r.length > 0 ? r.join(", ") : "Nenhum alvo selecionado.",
    hasTargets: r.length > 0,
    forms: t.map((a) => nT(a, n))
  };
}
function nT(e, t) {
  const n = e.targeting ?? rT(t, e.variant), r = n?.mode === "lineArea" ? "lineArea" : "selectedTokens";
  return {
    variant: e.variant,
    mode: r,
    modeLabel: n?.label ?? "Alvos selecionados",
    lineOptionLabel: r === "lineArea" && n?.optional === !0 ? n.optionLabel ?? "Usar linha na cena" : null,
    helperText: r === "lineArea" && n?.optional === !0 ? "Desmarque para usar os alvos selecionados manualmente." : null,
    showLineToggle: r === "lineArea" && n?.optional === !0,
    lineEnabledByDefault: n?.defaultEnabled === !0,
    checked: e.variant === "base"
  };
}
function rT(e, t) {
  const n = at(e);
  if (n.ok)
    return n.value.ritualForms?.[t]?.targeting;
}
function aT(e) {
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
function oT(e) {
  const t = e.system, n = [sT(t?.element), iT(t?.circle)].filter(uT);
  return n.length > 0 ? n.join(" • ") : "Conjuração de ritual";
}
function iT(e) {
  const t = typeof e == "string" ? Number(e) : e;
  return typeof t != "number" || !Number.isFinite(t) ? null : `${t}º Círculo`;
}
function sT(e) {
  if (typeof e != "string" || e.trim().length === 0) return null;
  switch (lT(e)) {
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
      return cT(e);
  }
}
function lT(e) {
  return e.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}
function cT(e) {
  const t = e.trim();
  return t ? `${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}` : null;
}
function uT(e) {
  return typeof e == "string" && e.length > 0;
}
const El = ["base", "discente", "verdadeiro"];
function ra(e) {
  switch (e) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}
function Pt(e) {
  return typeof e == "string" && El.includes(e);
}
const { ApplicationV2: dT } = foundry.applications.api;
class Xe extends dT {
  constructor(t, n) {
    super({
      id: `${d}-ritual-cast-${t.actor.id ?? foundry.utils.randomID()}-${t.ritual.id ?? foundry.utils.randomID()}`,
      window: {
        title: `Conjurar ${t.ritual.name ?? "ritual"}`
      }
    }), this.resolveRequest = n, this.model = Z_(t), this.selectedVariant = this.model.forms.find((r) => r.checked && r.enabled)?.variant ?? "base", this.spendResource = this.model.cost.spendResourceChecked;
  }
  resolveRequest;
  model;
  selectedVariant = "base";
  spendResource = !0;
  isResolved = !1;
  static DEFAULT_OPTIONS = {
    id: `${d}-ritual-cast`,
    classes: [d, "paranormal-toolkit-ritual-cast-app"],
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
      cast: Xe.onCast,
      cancel: Xe.onCancel
    }
  };
  static async request(t) {
    return new Promise((n) => {
      new Xe(t, n).render({ force: !0 });
    });
  }
  async _renderHTML(t, n) {
    const r = document.createElement("div");
    return r.className = "paranormal-toolkit-ritual-cast", r.innerHTML = this.renderContent(), r;
  }
  _replaceHTML(t, n, r) {
    n.replaceChildren(t);
    const a = n.querySelector(".paranormal-toolkit-ritual-cast") ?? n;
    pT(a, (o) => {
      this.selectedVariant = o, cr(a, o);
    }), cr(a, this.selectedVariant), gT(a, (o) => {
      this.spendResource = o;
    });
  }
  async close(t) {
    return this.settle(null), super.close(t);
  }
  renderContent() {
    return `
      <header class="paranormal-toolkit-ritual-cast__header">
        <p class="paranormal-toolkit-ritual-cast__eyebrow">${k(this.model.header.eyebrow)}</p>
        <div>
          <h2>${k(this.model.header.title)}</h2>
          <p>${k(this.model.header.subtitle)}</p>
        </div>
      </header>

      <section class="paranormal-toolkit-ritual-cast__panel">
        <h3>Forma</h3>
        <div class="paranormal-toolkit-ritual-cast__forms" role="radiogroup" aria-label="Forma do ritual">
          ${this.model.forms.map(mT).join("")}
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
          <div><dt>Custo base</dt><dd>${k(this.model.cost.baseCostText)}</dd></div>
          <div><dt>Conjurador</dt><dd>${k(this.model.cost.casterName)}</dd></div>
        </dl>
      </section>

      <section class="paranormal-toolkit-ritual-cast__panel paranormal-toolkit-ritual-cast__panel--targets">
        <div class="paranormal-toolkit-ritual-cast__panel-heading">
          <h3>Alvos</h3>
          <span class="paranormal-toolkit-ritual-cast__automation-note paranormal-toolkit-ritual-cast__automation-note--${this.model.automation.status}">
            ${k(this.model.automation.title)}
          </span>
        </div>
        <div class="paranormal-toolkit-ritual-cast__targeting-forms">
          ${this.model.targets.forms.map(fT).join("")}
        </div>
        <dl class="paranormal-toolkit-ritual-cast__summary paranormal-toolkit-ritual-cast__summary--targets">
          <div class="paranormal-toolkit-ritual-cast__summary-targets"><dt>Alvos atuais</dt><dd>${k(this.model.targets.targetText)}</dd></div>
        </dl>
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
    const n = AT(t), r = hT(n, this.spendResource, this.selectedVariant);
    this.settle(r), await this.close();
  }
  static async onCancel(t) {
    t.preventDefault(), this.settle(null), await this.close();
  }
  settle(t) {
    this.isResolved || (this.isResolved = !0, this.resolveRequest(t));
  }
}
function mT(e) {
  const t = e.checked ? "checked" : "", n = e.enabled ? "" : "disabled", r = e.enabled ? "" : " paranormal-toolkit-ritual-cast__form--disabled", a = e.details.map((o) => `<span>${k(o)}</span>`).join("");
  return `
    <label
      class="paranormal-toolkit-ritual-cast__form${r}"
      data-paranormal-toolkit-ritual-cast-form="${k(e.variant)}"
      role="radio"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.enabled ? "false" : "true"}"
      tabindex="${e.enabled ? "0" : "-1"}"
    >
      <input type="radio" name="variant" value="${k(e.variant)}" ${t} ${n}>
      <span class="paranormal-toolkit-ritual-cast__form-main">
        <strong>${k(e.label)}</strong>
        <em>${k(e.costText)}</em>
      </span>
      <span class="paranormal-toolkit-ritual-cast__form-details">${a}</span>
    </label>
  `;
}
function fT(e) {
  const t = e.checked ? "" : "hidden", n = e.showLineToggle && e.lineOptionLabel ? `
        <label class="paranormal-toolkit-ritual-cast__targeting-line-toggle">
            <input
              type="checkbox"
              name="areaTargeting-${k(e.variant)}"
              ${e.lineEnabledByDefault ? "checked" : ""}
              data-paranormal-toolkit-area-targeting-line-toggle
            >
            <span>
              <strong>${k(e.lineOptionLabel)}</strong>
              ${e.helperText ? `<em>${k(e.helperText)}</em>` : ""}
            </span>
        </label>
      ` : "";
  return `
    <div
      class="paranormal-toolkit-ritual-cast__targeting-form"
      data-paranormal-toolkit-targeting-form="${k(e.variant)}"
      data-paranormal-toolkit-targeting-mode="${k(e.mode)}"
      ${t}
    >
      <dl class="paranormal-toolkit-ritual-cast__summary paranormal-toolkit-ritual-cast__summary--targeting-mode">
        <div><dt>Modo</dt><dd>${k(e.modeLabel)}</dd></div>
      </dl>
      ${n}
    </div>
  `;
}
function pT(e, t) {
  const n = Array.from(e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]"));
  for (const a of n)
    a.addEventListener("click", () => qo(e, a, t)), a.addEventListener("keydown", (o) => {
      o.key !== "Enter" && o.key !== " " || (o.preventDefault(), qo(e, a, t));
    });
  const r = Il(e);
  r && t(r);
}
function qo(e, t, n) {
  const r = t.querySelector('input[name="variant"]');
  !r || r.disabled || !Pt(r.value) || (r.checked = !0, e.dataset.paranormalToolkitSelectedVariant = r.value, n(r.value), r.dispatchEvent(new Event("change", { bubbles: !0 })), Il(e), cr(e, r.value));
}
function Il(e) {
  const t = e.querySelectorAll("[data-paranormal-toolkit-ritual-cast-form]");
  let n = null;
  for (const r of t) {
    const a = r.querySelector('input[name="variant"]'), o = a?.checked === !0;
    r.setAttribute("aria-checked", o ? "true" : "false"), o && Pt(a.value) && (n = a.value);
  }
  return n && (e.dataset.paranormalToolkitSelectedVariant = n), n;
}
function cr(e, t) {
  const n = e.querySelectorAll("[data-paranormal-toolkit-targeting-form]");
  for (const r of n) {
    const a = r.dataset.paranormalToolkitTargetingForm === t;
    r.hidden = !a;
  }
}
function gT(e, t) {
  const n = e.querySelector('input[name="spendResource"]');
  n && (t(n.checked), n.addEventListener("change", () => {
    t(n.checked);
  }));
}
function hT(e, t, n) {
  const r = bT(e) ?? n, a = e?.querySelector('input[name="spendResource"]')?.checked ?? t, o = yT(e, r);
  return {
    variant: r,
    spendResource: a,
    areaTargeting: o
  };
}
function yT(e, t) {
  const n = e?.querySelector(
    `[data-paranormal-toolkit-targeting-form="${t}"]`
  );
  return n?.dataset.paranormalToolkitTargetingMode === "lineArea" ? n?.querySelector(
    "[data-paranormal-toolkit-area-targeting-line-toggle]"
  )?.checked === !0 ? { mode: "lineArea", enabled: !0 } : { mode: "selectedTokens", enabled: !1 } : { mode: "selectedTokens", enabled: !1 };
}
function bT(e) {
  const t = e?.querySelector('input[name="variant"]:checked')?.value;
  if (Pt(t)) return t;
  const n = e?.dataset.paranormalToolkitSelectedVariant;
  return Pt(n) ? n : null;
}
function AT(e) {
  for (const t of [e.currentTarget, e.target, ...e.composedPath()]) {
    if (!(t instanceof HTMLElement)) continue;
    const n = t.closest(".paranormal-toolkit-ritual-cast");
    if (n) return n;
  }
  return null;
}
function k(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
async function _T(e) {
  return Xe.request(e);
}
const aa = {
  label: "Padrão"
}, TT = {
  label: "Discente",
  extraCost: 2
}, RT = {
  label: "Verdadeiro",
  extraCost: 5
};
class $T {
  constructor(t, n, r, a) {
    this.workflow = t, this.resources = n, this.ritualCosts = r, this.ritualEvents = a;
  }
  workflow;
  resources;
  ritualCosts;
  ritualEvents;
  areaTargeting = new Y_();
  canHandle(t, n) {
    return t.item.type === "ritual" || n.steps.some((r) => r.type === "spendRitualCost");
  }
  async run(t, n, r) {
    if (!t.actor)
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    const a = this.resolveCostPreview(t), o = gR(n), s = mR(
      n,
      t.item,
      a,
      o
    ), l = await _T({
      actor: t.actor,
      ritual: t.item,
      targetNames: t.targets.map((E) => E.name),
      cost: a,
      defaultSpendResource: TR(n),
      variantOptions: s,
      automationStatus: o ? "generic" : "assisted"
    });
    if (!l)
      return { status: "cancelled" };
    const c = wT(l), u = yR(
      n,
      t.item,
      c.variant,
      o
    ), f = a_(), y = u.label ?? ra(c.variant), $ = (E = t.targets) => ({
      castId: f,
      context: t,
      automationSource: r,
      form: c.variant,
      formLabel: y,
      targets: E
    }), b = (E, I = t.targets, _e = {}) => {
      this.ritualEvents.emitCastFinished(
        s_({
          ...$(I),
          status: E,
          ..._e
        })
      );
    };
    this.ritualEvents.emitCastStarted(
      o_($())
    );
    const p = await this.areaTargeting.resolvePreCastTargets({
      castOptions: c,
      formTargeting: u.targeting,
      currentTargets: t.targets
    });
    if (p.status === "cancelled")
      return b("cancelled", t.targets, { reason: p.reason }), { status: "cancelled" };
    if (p.status === "failed")
      return b("failed", t.targets, {
        reason: p.reason,
        message: p.message
      }), {
        status: "failed",
        reason: p.reason,
        message: p.message
      };
    const T = kT(
      t,
      p.targets
    );
    p.areaSnapshot && this.ritualEvents.emitAreaResolved(
      i_({
        ...$(p.targets),
        area: p.areaSnapshot
      })
    );
    const be = xi();
    let Y = null;
    if (be) {
      const E = await IT(
        this.resources,
        T.actor,
        c,
        u,
        a
      );
      if (!E.ok)
        return b("failed", T.targets, {
          reason: E.reason,
          message: E.message
        }), {
          status: "failed",
          reason: E.reason,
          message: E.message
        };
      try {
        const I = await _b(
          T.actor
        );
        Y = ST(
          I,
          u,
          a
        );
      } catch (I) {
        const _e = I instanceof Error ? I.message : "Não foi possível rolar Ocultismo para conjurar o ritual.";
        return b("failed", T.targets, {
          reason: "ritual-casting-check-failed",
          message: _e
        }), {
          status: "failed",
          reason: "ritual-casting-check-failed",
          message: _e,
          cause: I
        };
      }
    }
    const Ae = ET(
      n,
      c,
      u,
      a,
      {
        includeCostSteps: !be
      }
    );
    if (Ae.steps.length === 0) {
      const E = hR(
        T,
        c
      ), I = jo(
        n,
        T
      ), _e = Go(
        T.actor,
        Y,
        u,
        a
      ), ba = zo(
        n,
        c,
        u,
        a,
        E,
        T,
        Y
      );
      if (!I.ok)
        return b("failed", T.targets, {
          reason: I.reason,
          message: I.message
        }), {
          status: "failed",
          reason: I.reason,
          message: I.message
        };
      const Aa = [
        ..._e,
        ...I.actions
      ];
      return Aa.length > 0 ? (b("ready", T.targets), {
        status: "ready",
        workflowContext: E,
        itemUseContext: T,
        actions: Aa,
        summaryLines: ba
      }) : (b("completed-without-actions", T.targets), {
        status: "completed-without-actions",
        workflowContext: E,
        itemUseContext: T,
        summaryLines: ba
      });
    }
    const x = await this.workflow.runAutomation(Ae, {
      sourceActor: T.actor,
      sourceToken: T.token,
      item: T.item,
      targets: T.targets,
      flags: {
        itemUse: {
          source: T.source,
          executionMode: "ask"
        },
        ritualCast: {
          variant: c.variant,
          spendResource: c.spendResource
        }
      }
    });
    if (!x.ok)
      return b("failed", T.targets, {
        reason: x.error.reason,
        message: x.error.message
      }), {
        status: "failed",
        reason: x.error.reason,
        message: x.error.message,
        cause: x.error
      };
    const te = x.value.context, q = xT(
      n,
      T,
      te
    ), O = jo(
      n,
      T
    ), on = Go(
      T.actor,
      Y,
      u,
      a
    ), ha = zo(
      n,
      c,
      u,
      a,
      te,
      T,
      Y
    );
    if (!q.ok)
      return b("failed", T.targets, {
        reason: q.reason,
        message: q.message
      }), {
        status: "failed",
        reason: q.reason,
        message: q.message
      };
    if (!O.ok)
      return b("failed", T.targets, {
        reason: O.reason,
        message: O.message
      }), {
        status: "failed",
        reason: O.reason,
        message: O.message
      };
    const ya = [
      ...on,
      ...q.actions,
      ...O.actions
    ];
    return ya.length === 0 ? (b("completed-without-actions", T.targets), {
      status: "completed-without-actions",
      workflowContext: te,
      itemUseContext: T,
      summaryLines: ha
    }) : (b("ready", T.targets), {
      status: "ready",
      workflowContext: te,
      itemUseContext: T,
      actions: ya,
      summaryLines: ha
    });
  }
  async applyAction(t) {
    return Lt(
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
function wT(e) {
  return {
    variant: e.variant,
    spendResource: e.spendResource === !0,
    areaTargeting: e.areaTargeting
  };
}
function kT(e, t) {
  return {
    ...e,
    targets: t
  };
}
function ET(e, t, n, r, a) {
  const o = [], s = t.spendResource === !0;
  for (const l of e.steps)
    l.type === "modifyResource" || l.type === "chatCard" || ia(l) && (!a.includeCostSteps || !s) || o.push(CT(l, n));
  return a.includeCostSteps && s && r && RR(n.extraCost) && o.push({
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
async function IT(e, t, n, r, a) {
  if (n.spendResource !== !0) return { ok: !0 };
  const o = Ue(a, r);
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
function CT(e, t) {
  if (e.type !== "rollFormula") return e;
  const n = t.rollFormulaOverrides?.[e.id];
  return n ? {
    ...e,
    formula: n
  } : e;
}
function ST(e, t, n) {
  const a = LT(n, t) ?? e.difficulty;
  return {
    ...e,
    difficulty: a,
    success: e.total >= a
  };
}
function LT(e, t) {
  const n = Ue(e, t);
  return n ? e_(n.amount) : null;
}
function Go(e, t, n, r) {
  if (!t || t.success) return [];
  const a = Ue(r, n);
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
function jo(e, t) {
  const n = [];
  for (const r of e.conditionApplications ?? []) {
    const a = oa(r.actor, t);
    if (a.length === 0) {
      if (r.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: `Nenhum alvo válido encontrado para aplicar ${r.label ?? r.conditionId}.`
      };
    }
    for (const o of a) {
      const s = Qi(o);
      n.push(
        vT(
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
function vT(e, t, n, r) {
  const a = t.name ?? "Ator sem nome", o = e.label ?? NT(e.conditionId);
  return {
    kind: "condition-application",
    actor: t,
    actorName: a,
    conditionId: e.conditionId,
    conditionLabel: o,
    duration: DT(
      e.duration ?? null,
      r
    ),
    source: e.source ?? null,
    originUuid: n.uuid ?? null,
    label: PT(o, e.duration),
    executedLabel: e.executedLabel ?? `✓ ${o} aplicado`,
    actionSectionId: e.actionSectionId ?? "apply-effects",
    actionSectionTitle: e.actionSectionTitle ?? "Aplicar efeito"
  };
}
function DT(e, t) {
  return e ? {
    ...e,
    expiry: e.expiry ?? "turnStart",
    anchor: t
  } : null;
}
function PT(e, t) {
  const n = t?.rounds;
  if (typeof n == "number" && Number.isInteger(n) && n > 0) {
    const r = n === 1 ? "1 rodada" : `${n} rodadas`;
    return `${e}: ${r}`;
  }
  return e;
}
function NT(e) {
  const t = e.trim();
  return t.length === 0 ? "Condição" : t.split(/[._-]+/u).filter((n) => n.length > 0).map((n) => `${n.charAt(0).toLocaleUpperCase()}${n.slice(1)}`).join(" ");
}
function xT(e, t, n) {
  const r = [], a = /* @__PURE__ */ new Map();
  for (const o of e.steps) {
    if (o.type !== "modifyResource") continue;
    const s = St(o, n);
    if (!s.ok)
      return {
        ok: !1,
        reason: s.error.reason,
        message: s.error.message
      };
    const l = oa(o.actor, t);
    if (l.length === 0) {
      if (o.actor === "target") continue;
      return {
        ok: !1,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }
    for (const c of l) {
      if (OT(o)) {
        MT(
          a,
          c,
          FT(o, n, s.value)
        );
        continue;
      }
      r.push(UT(o, c, s.value));
    }
  }
  for (const o of a.values())
    r.push(
      ...BT(
        e,
        t.item,
        o.actor,
        o.entries
      )
    );
  return { ok: !0, actions: r };
}
function OT(e) {
  return e.operation === "damage" && e.resource === "PV";
}
function MT(e, t, n) {
  const r = zT(t), a = e.get(r);
  if (a) {
    a.entries.push(n);
    return;
  }
  e.set(r, {
    actor: t,
    entries: [n]
  });
}
function FT(e, t, n) {
  const r = VT(e.amountFrom), a = r ? t.rolls[r]?.damageType : void 0;
  return {
    step: e,
    amount: n,
    damageType: e.damageType ?? a ?? null,
    sourceRollId: r
  };
}
function BT(e, t, n, r) {
  const a = YT(e), o = a.length > 1 ? XT() : void 0;
  return a.map((s) => {
    const l = r.map(
      (u, f) => {
        const y = QT(u.amount, s);
        return {
          id: qT(u, s, f),
          amount: y,
          damageType: u.damageType,
          sourceRollId: u.sourceRollId,
          ignoreResistance: u.step.ignoreResistance === !0
        };
      }
    ), c = l.reduce(
      (u, f) => u + f.amount,
      0
    );
    return {
      kind: "damage-application",
      actor: n,
      actorName: n.name ?? "Ator sem nome",
      instances: l,
      label: GT(c, s, a.length > 1),
      executedLabel: jT(
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
function UT(e, t, n) {
  const r = t.name ?? "Ator sem nome", a = KT(e);
  return {
    kind: "resource-operation",
    actor: t,
    actorName: r,
    resource: e.resource,
    operation: e.operation,
    amount: n,
    label: HT(e, r, n),
    executedLabel: WT(e, r),
    actionSectionId: a.id,
    actionSectionTitle: a.title
  };
}
function qT(e, t, n) {
  return `${e.sourceRollId ?? `damage-${n + 1}`}:${n + 1}:${t.id}`;
}
function GT(e, t, n) {
  return n ? `${t.id === "normal" ? "Normal" : t.label}: ${e} PV` : `Dano: ${e} PV`;
}
function jT(e, t, n) {
  return n ? `✓ ${t.id === "normal" ? "dano normal" : t.label.toLowerCase()} aplicado` : `✓ Dano aplicado em ${e}`;
}
function zT(e) {
  return e.uuid ?? e.id ?? e.name ?? `actor-${Math.random().toString(36).slice(2)}`;
}
function VT(e) {
  const t = e?.trim();
  if (!t) return null;
  if (t.endsWith(".total"))
    return t.slice(0, -6);
  const [n] = t.split(".");
  return n && n.length > 0 ? n : null;
}
function HT(e, t, n) {
  return e.operation === "heal" && e.resource === "PV" ? `Curar ${n} PV` : e.operation === "damage" ? `Dano: ${n} ${e.resource}` : e.operation === "recover" ? `Recuperar ${n} ${e.resource}` : e.operation === "spend" ? `Gastar ${n} ${e.resource}` : `Aplicar ${n} ${e.resource}`;
}
function WT(e, t) {
  return e.operation === "heal" && e.resource === "PV" ? `✓ ${t} curado` : e.operation === "damage" ? `✓ Dano aplicado em ${t}` : e.operation === "recover" ? `✓ ${t} recuperado` : e.operation === "spend" ? `✓ Recurso gasto de ${t}` : "✓ Ação aplicada";
}
function KT(e) {
  return e.operation === "damage" && e.resource === "PV" ? { id: "apply-damage", title: "Aplicar danos" } : e.operation === "heal" && e.resource === "PV" ? { id: "apply-healing", title: "Aplicar cura" } : e.operation === "recover" || e.operation === "spend" ? { id: "apply-resources", title: "Aplicar recursos" } : { id: "actions", title: "Ações" };
}
function YT(e) {
  const t = e.resistance?.damageApplications;
  return t && t.length > 0 ? t : e.resistance?.effect === "reducesByHalf" ? [
    { id: "normal", label: "Dano normal", multiplier: 1 },
    { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
  ] : [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}
function QT(e, t) {
  const n = e * t.multiplier, r = ZT(
    n,
    t.rounding ?? "floor"
  );
  return Math.max(0, r);
}
function ZT(e, t) {
  switch (t) {
    case "ceil":
      return Math.ceil(e);
    case "round":
      return Math.round(e);
    case "floor":
      return Math.floor(e);
  }
}
function XT() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function oa(e, t) {
  switch (e) {
    case "self":
      return t.actor ? [t.actor] : [];
    case "target":
      return t.targets.flatMap(
        (n) => n.actor ? [n.actor] : []
      );
  }
}
function zo(e, t, n, r, a, o, s = null) {
  return [
    `Forma: ${ra(t.variant)}`,
    nR(t, n, r),
    ...tR(s),
    ...Object.values(a.rolls).flatMap(rR),
    ...JT(e, o),
    ...aR(e.resistance),
    ...uR(n)
  ];
}
function JT(e, t) {
  return eR(e) ? oa("target", t).length > 0 ? [] : [
    "Aplicação manual: nenhum alvo com ficha foi selecionado; use o resultado do card manualmente."
  ] : [];
}
function eR(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target"
  ) || (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function tR(e) {
  return e ? [
    `Conjuração: ${e.skillLabel} = ${Math.trunc(e.total)}`,
    `Conjuração Fórmula: ${e.formula}`,
    `Conjuração DT: ${e.difficulty}`,
    `Conjuração Resultado: ${e.success ? "Sucesso" : "Falha"}`,
    ...e.diceBreakdown ? [`Dados (Conjuração): ${e.diceBreakdown}`] : []
  ] : [];
}
function nR(e, t, n) {
  const r = Ue(n, t);
  return r ? e.spendResource ? `Custo: ${r.amount} ${r.resource} gasto` : `Custo: ${r.amount} ${r.resource} não gasto` : e.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
}
function rR(e) {
  const n = [`${dR(e)}: ${e.formula} = ${Math.trunc(e.total)}`], r = oR(e.roll);
  return r && n.push(`Dados: ${r}`), e.damageType && n.push(`Tipo: ${t_(e.damageType)}`), n;
}
function aR(e) {
  return e ? [
    `Resistência: ${e.summary}`,
    `Resistência Perícia: ${e.skill}`,
    `Resistência Rótulo: ${e.label}`
  ] : [];
}
function oR(e) {
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
    const s = iR(o);
    s && (cR(
      n,
      s.operator ?? r,
      s.value
    ), r = "+");
  }
  return n.length > 0 ? n.join(" ") : null;
}
function iR(e) {
  const t = sR(e);
  return t.length > 0 ? { value: `(${t.join(", ")})` } : lR(e);
}
function sR(e) {
  return Array.isArray(e.results) ? e.results.flatMap((t) => {
    if (!t || typeof t != "object") return [];
    const n = t;
    return typeof n.result != "number" || !Number.isFinite(n.result) ? [] : n.active !== !1 && n.discarded !== !0 ? [String(n.result)] : [];
  }) : [];
}
function lR(e) {
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
function cR(e, t, n) {
  if (e.length === 0) {
    e.push(t === "-" ? `- ${n}` : n);
    return;
  }
  e.push(`${t} ${n}`);
}
function uR(e) {
  return (e.notes ?? []).map((t) => `Observação: ${t}`);
}
function dR(e) {
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
function mR(e, t, n, r) {
  return El.map((a) => {
    const o = Cl(
      e,
      t,
      a,
      r
    ), s = o !== null;
    return {
      variant: a,
      label: o?.label ?? ra(a),
      enabled: s,
      details: o ? fR(o, n, r) : [],
      finalCostText: o ? pR(n, o) : null,
      unavailableReason: s ? void 0 : "não disponível neste ritual"
    };
  });
}
function fR(e, t, n) {
  const r = [], a = Object.values(e.rollFormulaOverrides ?? {});
  a.length > 0 ? r.push(a.join(", ")) : n && r.push("efeito manual");
  const o = Ue(t, e);
  return r.push(
    o ? `Custo final: ${o.amount} ${o.resource}` : "Custo final não resolvido"
  ), r;
}
function Ue(e, t) {
  return e ? {
    resource: e.resource,
    amount: e.amount + (t.extraCost ?? 0)
  } : null;
}
function pR(e, t) {
  const n = Ue(e, t);
  return n ? `${n.amount} ${n.resource}` : null;
}
function gR(e) {
  return !e.resistance && e.steps.length > 0 && e.steps.every(ia);
}
function hR(e, t) {
  return hl({
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
function yR(e, t, n, r) {
  return Cl(e, t, n, r) ?? aa;
}
function Cl(e, t, n, r) {
  const a = e.ritualForms?.[n] ?? null;
  return a || (r ? AR(t, n) ? bR(n) : null : n === "base" ? aa : null);
}
function bR(e) {
  switch (e) {
    case "base":
      return aa;
    case "discente":
      return TT;
    case "verdadeiro":
      return RT;
  }
}
function AR(e, t) {
  if (t === "base") return !0;
  const n = t === "discente" ? "system.studentForm" : "system.trueForm";
  return _R(foundry.utils.getProperty(e, n));
}
function _R(e) {
  return e === !0 || e === "true" || e === 1 || e === "1";
}
function TR(e) {
  return e.steps.some(ia);
}
function ia(e) {
  return e.type === "spendResource" || e.type === "spendRitualCost";
}
function RR(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0;
}
const Sl = "itemUsePrompts", Ll = "chatCard", en = "data-paranormal-toolkit-prompt-id", tn = "data-paranormal-toolkit-pending-id", sa = "data-paranormal-toolkit-executed-label", ur = "data-paranormal-toolkit-choice-group", vl = "data-paranormal-toolkit-skipped-label", Nt = "data-paranormal-toolkit-action-section", Vo = "data-paranormal-toolkit-detail-key", Ho = "data-paranormal-toolkit-roll-card", la = "data-paranormal-toolkit-roll-detail-toggle", Dl = "data-paranormal-toolkit-roll-detail-id", Pl = "data-paranormal-toolkit-resistance-roll-button", Nl = "data-paranormal-toolkit-resistance-skill", xl = "data-paranormal-toolkit-resistance-skill-label", Ol = "data-paranormal-toolkit-resistance-target-actor-id", Ml = "data-paranormal-toolkit-resistance-target-name", Fl = "data-paranormal-toolkit-resistance-roll-result", Wo = "data-paranormal-toolkit-system-card-replaced", $R = `[${tn}]`, wR = `[${la}]`, kR = `[${Pl}]`, dr = `${d}-chat-enrichment`, h = `${d}-item-use-prompt`, ER = `${h}__actions`, Ko = `${h}__details`, Bl = `${h}__summary`, IR = `${h}__title`, Ul = `${h}__button--executed`, Yo = `${h}__roll-card`;
let Qo = !1, mr = null;
const U = /* @__PURE__ */ new Map(), CR = [0, 100, 500, 1500, 3e3], SR = 3e4, LR = [0, 100, 500, 1500, 3e3];
function vR(e) {
  if (mr = e, Qo) {
    Xo(e);
    return;
  }
  const t = (n, r) => {
    Gl(n, r, e);
  };
  Hooks.on("renderChatMessageHTML", t), Hooks.on("renderChatMessage", t), Qo = !0, Xo(e);
}
async function Zo(e) {
  const t = ql(e);
  U.set(e.pendingId, t), await da(t) || ec(t), jl(e.pendingId);
}
async function DR(e) {
  const t = ql({
    ...e,
    actionPayload: null
  });
  t.executed = !0, t.executedLabel = e.executedLabel ?? "✓ Ritual conjurado", U.set(e.pendingId, t), await da(t) || ec(t), jl(e.pendingId);
}
async function wn(e, t) {
  const n = U.get(e);
  U.delete(e), n && await D$(n, t);
}
function ca(e) {
  const t = ic();
  for (const n of t) {
    const r = K(n)[e];
    if (r) return { message: n, prompt: r };
  }
  return null;
}
async function PR(e, t) {
  const n = ca(e);
  if (!n) return;
  const r = K(n.message), a = r[e];
  a && (r[e] = {
    ...a,
    executedLabel: a.executedLabel,
    executed: !0
  }, await qe(n.message, r));
}
async function NR(e, t, n) {
  if (!t) return;
  const r = ca(e);
  if (!r) return;
  const a = K(r.message);
  let o = !1;
  for (const [s, l] of Object.entries(a))
    s !== e && l.choiceGroupId === t && (a[s] = {
      ...l,
      executedLabel: n ?? l.skippedLabel ?? "✓ Outra opção escolhida",
      executed: !0
    }, o = !0);
  o && await qe(r.message, a);
}
function ql(e) {
  const t = ee(e.context.message), n = e.context.targets.find((s) => hr(s)), r = n ? hr(n) : null, a = e.resistanceTargetActor ?? r, o = e.resistanceTargetName ?? n?.name ?? a?.name ?? e.context.targets[0]?.name ?? null;
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
    summary: s$(e.context),
    executed: !1
  };
}
function Gl(e, t, n) {
  v$();
  const r = rn(t);
  if (!r) return;
  const a = C$(e, r);
  a.length > 0 && xt(r);
  for (const o of a)
    fr(r, o);
  Kl(r, n), pr(r), gr(r);
}
function Xo(e) {
  for (const t of LR)
    globalThis.setTimeout(() => {
      xR(e);
    }, t);
}
function xR(e) {
  for (const t of OR()) {
    const n = nn(t);
    MR(n) && Gl(n, t, e);
  }
}
function OR() {
  const e = /* @__PURE__ */ new Set();
  for (const t of document.querySelectorAll(".chat-message[data-message-id], [data-message-id]")) {
    const n = t.classList.contains("chat-message") ? t : t.closest(".chat-message") ?? t;
    n.dataset.messageId && e.add(n);
  }
  return Array.from(e);
}
function MR(e) {
  return e ? ma(e) ? !0 : N$(e).length > 0 : !1;
}
function jl(e) {
  const t = U.get(e);
  if (!t) return;
  const n = t.messageId ? S$(t.messageId) : null;
  if (n) {
    ri(n, t), xt(n), fr(n, t), Jo(n), pr(n), gr(n);
    return;
  }
  if (t.messageId) {
    br(t);
    return;
  }
  const r = L$(t);
  if (r) {
    ri(r, t), xt(r), fr(r, t), Jo(r), pr(r), gr(r);
    return;
  }
  br(t);
}
function Jo(e) {
  mr && Kl(e, mr);
}
function xt(e) {
  const t = FR();
  e.classList.toggle(`${h}--system-card-replaced`, t);
  const n = Wl(e);
  if (!n || (n.classList.toggle(`${h}__host--system-card-replaced`, t), !t) || n.getAttribute(Wo) === "true") return;
  const r = n.querySelector(`.${dr}`);
  r ? n.replaceChildren(r) : n.replaceChildren(), n.setAttribute(Wo, "true");
}
function FR() {
  try {
    return Du() === "replace";
  } catch {
    return !1;
  }
}
function fr(e, t) {
  if (xt(e), e.querySelector(`[${en}="${Ge(t.pendingId)}"]`)) return;
  const n = UR(e, t);
  GR(n, t);
  const r = r$(t);
  if (BR(r)) return;
  n$(n, r).append(i$(t));
}
function BR(e) {
  return Vl(e.id) && !fe();
}
function zl(e) {
  const n = e.closest(`[${Nt}]`)?.getAttribute(Nt) ?? null;
  return Vl(n) && !fe();
}
function Vl(e) {
  return e === "apply-damage" || e === "apply-effects";
}
function UR(e, t) {
  const n = e.querySelector(`.${dr}`);
  if (n)
    return n;
  const r = document.createElement("section");
  r.classList.add(dr, h);
  const a = document.createElement("header");
  a.classList.add(`${h}__header`);
  const o = document.createElement("span");
  o.classList.add(`${h}__kicker`), o.textContent = "Paranormal Toolkit";
  const s = document.createElement("strong");
  s.classList.add(IR), s.textContent = qR(t);
  const l = document.createElement("span");
  return l.classList.add(Bl), l.textContent = t.summary, a.append(o, s, l), r.append(a), c$(e).append(r), r;
}
function qR(e) {
  const t = v(e.summaryLines ?? [], "Forma"), n = e.itemName ?? e.title ?? "Automação assistida";
  return t ? `${n} • ${t}` : n;
}
function GR(e, t) {
  const n = t.summaryLines ?? [], r = Xl(n, t);
  if (r) {
    jR(e, r, t);
    return;
  }
  a$(e, n);
}
function jR(e, t, n) {
  if (e.querySelector(`[${Ho}="true"]`)) return;
  const r = document.createElement("article");
  r.classList.add(Yo, `${Yo}--${t.intent}`), r.setAttribute(Ho, "true"), t.castingCheck && ei(r, VR(t.castingCheck), n.pendingId, "casting"), zR(t) && ei(r, HR(t), n.pendingId, "effect"), ZR(r, t), XR(r, t, n), t$(r, t), e.append(r);
}
function zR(e) {
  return e.intent !== "casting";
}
function VR(e) {
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
function HR(e) {
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
function ei(e, t, n, r) {
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
  WR(a, t), e$(a, t.detailRows, n, r, `▸ Detalhes de ${t.title.toLowerCase()}`), e.append(a);
}
function WR(e, t) {
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-roll`);
  const r = document.createElement("span");
  r.classList.add(`${h}__workflow-roll-formula`), r.textContent = t.formula;
  const a = document.createElement("strong");
  a.classList.add(`${h}__workflow-roll-total`), a.textContent = String(t.total), n.append(r, a);
  const o = KR(t.formula, t.diceBreakdown);
  o && n.append(o), e.append(n);
}
function KR(e, t) {
  const n = YR(t);
  if (n.length === 0) return null;
  const r = document.createElement("div");
  r.classList.add(`${h}__workflow-dice-tray`);
  for (const a of QR(n, e)) {
    const o = document.createElement("span");
    o.classList.add(`${h}__workflow-die`), a.active || o.classList.add(`${h}__workflow-die--inactive`), o.textContent = String(a.value), r.append(o);
  }
  return r;
}
function YR(e) {
  return e ? (/\(([^)]+)\)/u.exec(e)?.[1] ?? e).split(",").map((r) => Number(r.trim())).filter((r) => Number.isFinite(r)).map((r) => Math.trunc(r)) : [];
}
function QR(e, t) {
  if (e.length <= 1) return e.map((r) => ({ value: r, active: !0 }));
  const n = t.toLowerCase();
  return n.includes("kh") ? ti(e, "highest") : n.includes("kl") ? ti(e, "lowest") : e.map((r) => ({ value: r, active: !0 }));
}
function ti(e, t) {
  const n = t === "highest" ? Math.max(...e) : Math.min(...e);
  let r = !1;
  return e.map((a) => {
    const o = !r && a === n;
    return o && (r = !0), { value: a, active: o };
  });
}
function ZR(e, t) {
  const n = [
    t.form ? `Forma: ${t.form}` : null,
    t.cost,
    t.damageType ? `Tipo: ${t.damageType}` : null
  ].filter(X$);
  if (n.length === 0) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__roll-meta`);
  for (const a of n) {
    const o = document.createElement("span");
    o.classList.add(`${h}__roll-meta-pill`), o.textContent = a, r.append(o);
  }
  e.append(r);
}
function XR(e, t, n) {
  if (!t.resistance) return;
  const r = document.createElement("div");
  r.classList.add(`${h}__resistance`);
  const a = document.createElement("div");
  a.classList.add(`${h}__resistance-header`);
  const o = document.createElement("strong");
  o.textContent = "Resistência";
  const s = JR(t, n);
  a.append(o), s && a.append(s);
  const l = document.createElement("span");
  l.classList.add(`${h}__resistance-description`), l.textContent = t.resistance, r.append(a, l), t.resistanceRollResult && r.append(Hl(t.resistanceRollResult)), e.append(r);
}
function JR(e, t) {
  if (!e.resistanceSkill || !he()) return null;
  const n = document.createElement("button");
  if (n.type = "button", n.classList.add(`${h}__resistance-roll-button`), n.setAttribute(en, t.pendingId), n.setAttribute(Pl, "true"), n.setAttribute(Nl, e.resistanceSkill), n.setAttribute(xl, e.resistanceSkillLabel ?? e.resistanceSkill), t.resistanceTargetActorId && n.setAttribute(Ol, t.resistanceTargetActorId), t.resistanceTargetName && n.setAttribute(Ml, t.resistanceTargetName), e.resistanceRollResult)
    return n.classList.add(`${h}__resistance-roll-button--rolled`), n.setAttribute(Fl, String(e.resistanceRollResult.total)), n.textContent = String(e.resistanceRollResult.total), n.title = `Rolar ${e.resistanceRollResult.skillLabel} novamente`, n.setAttribute("aria-label", n.title), n;
  const r = document.createElement("i");
  r.classList.add("fa-solid", "fa-dice-d20"), r.setAttribute("aria-hidden", "true");
  const a = document.createElement("span");
  return a.classList.add(`${h}__resistance-roll-fallback`), a.textContent = "d20", n.append(r, a), n.title = `Rolar ${e.resistanceSkillLabel ?? e.resistanceSkill} do alvo`, n.setAttribute("aria-label", n.title), n;
}
function Hl(e) {
  const t = document.createElement("span");
  return t.classList.add(`${h}__resistance-roll-result`), t.textContent = Ql(e), t;
}
function e$(e, t, n, r, a) {
  const o = t.filter((u) => u.value.trim().length > 0);
  if (o.length === 0) return;
  const s = `${n}-roll-details-${r}`, l = document.createElement("button");
  l.type = "button", l.classList.add(`${h}__roll-detail-toggle`), l.setAttribute(la, s), l.setAttribute("aria-expanded", "false"), l.textContent = a;
  const c = document.createElement("dl");
  c.classList.add(`${h}__roll-detail-list`), c.setAttribute(Dl, s), c.hidden = !0;
  for (const u of o) {
    const f = document.createElement("dt");
    f.textContent = u.label;
    const y = document.createElement("dd");
    y.textContent = u.value, c.append(f, y);
  }
  e.append(l, c);
}
function t$(e, t) {
  if (t.notes.length === 0 && t.details.length === 0) return;
  const n = document.createElement("div");
  n.classList.add(`${h}__workflow-notes`);
  for (const r of [...t.notes, ...t.details]) {
    const a = document.createElement("span");
    a.textContent = r, n.append(a);
  }
  e.append(n);
}
function n$(e, t) {
  const n = `[${Nt}="${Ge(t.id)}"]`, r = e.querySelector(n);
  if (r)
    return r;
  const a = document.createElement("div");
  a.classList.add(ER), a.setAttribute(Nt, t.id);
  const o = document.createElement("strong");
  return o.classList.add(`${h}__actions-title`), o.textContent = t.title, a.append(o), e.append(a), a;
}
function r$(e) {
  const t = e.actionSectionId?.trim(), n = e.actionSectionTitle?.trim();
  if (t && n)
    return { id: t, title: n };
  const r = Xl(e.summaryLines ?? [], e);
  return r?.intent === "damage" ? { id: "apply-damage", title: "Aplicar danos" } : r?.intent === "healing" ? { id: "apply-healing", title: "Aplicar cura" } : { id: "actions", title: "Ações" };
}
function a$(e, t) {
  if (t.length === 0) return;
  const n = o$(e);
  for (const r of t) {
    const a = J$(r);
    if (n.querySelector(`[${Vo}="${Ge(a)}"]`)) continue;
    const o = document.createElement("li");
    o.textContent = r, o.setAttribute(Vo, a), n.append(o);
  }
}
function o$(e) {
  const t = e.querySelector(`.${Ko}`);
  if (t)
    return t;
  const n = document.createElement("ul");
  return n.classList.add(Ko), e.append(n), n;
}
function i$(e) {
  const t = document.createElement("button");
  return t.type = "button", t.classList.add(`${h}__button`), t.setAttribute(en, e.pendingId), e.executed ? (t.disabled = !0, t.textContent = e.executedLabel ?? "✓ Automação aplicada", t.classList.add(Ul), t) : (t.textContent = e.buttonLabel ?? "Aplicar automação", t.setAttribute(tn, e.pendingId), t.setAttribute(sa, e.executedLabel ?? "✓ Automação aplicada"), e.choiceGroupId && (t.setAttribute(ur, e.choiceGroupId), t.setAttribute(vl, e.skippedLabel ?? "✓ Outra opção escolhida")), t);
}
function s$(e) {
  const t = e.actor?.name ?? e.token?.name ?? "Origem não resolvida", n = l$(e);
  return `${t} → ${n}`;
}
function l$(e) {
  return e.targets.length > 0 ? e.targets.map((t) => t.name).join(", ") : "nenhum alvo";
}
function c$(e) {
  return Wl(e) ?? e;
}
function Wl(e) {
  return e.classList.contains("message-content") ? e : e.querySelector(".message-content");
}
function Kl(e, t) {
  const n = rn(e);
  if (!n) return;
  const r = n.querySelectorAll($R);
  for (const a of r) {
    if (zl(a)) {
      a.remove();
      continue;
    }
    a.dataset.paranormalToolkitBound !== "true" && (a.dataset.paranormalToolkitBound = "true", a.addEventListener("click", () => {
      $$(a, t);
    }));
  }
}
function pr(e) {
  const t = rn(e);
  if (!t) return;
  const n = t.querySelectorAll(wR);
  for (const r of n)
    r.dataset.paranormalToolkitRollDetailsBound !== "true" && (r.dataset.paranormalToolkitRollDetailsBound = "true", r.addEventListener("click", () => {
      u$(t, r);
    }));
}
function gr(e) {
  const t = rn(e);
  if (!t) return;
  const n = t.querySelectorAll(kR);
  for (const r of n) {
    if (!he()) {
      r.remove();
      continue;
    }
    r.dataset.paranormalToolkitResistanceRollBound !== "true" && (r.dataset.paranormalToolkitResistanceRollBound = "true", r.addEventListener("click", () => {
      d$(t, r);
    }));
  }
}
function u$(e, t) {
  const n = t.getAttribute(la);
  if (!n) return;
  const r = e.querySelector(`[${Dl}="${Ge(n)}"]`);
  if (!r) return;
  const a = r.hidden;
  r.hidden = !a, t.setAttribute("aria-expanded", a ? "true" : "false"), t.textContent = a ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}
async function d$(e, t) {
  if (!he()) {
    t.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }
  const n = t.getAttribute(en), r = t.getAttribute(Nl), a = t.getAttribute(xl) ?? (r ? me(r) : "Resistência");
  if (!n || !r) return;
  const o = p$(e, n), s = g$(o, t);
  if (!s) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }
  t.disabled = !0;
  const l = t.innerHTML;
  t.textContent = "...";
  try {
    const c = await Yd(s, r);
    await _$(c.roll);
    const u = {
      skill: r,
      skillLabel: a,
      formula: c.formula,
      total: c.total,
      targetName: s.name ?? o?.resistanceTargetName ?? "alvo",
      diceBreakdown: c.diceBreakdown,
      usedFallbackBonus: !1,
      rolledAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    m$(t, u), f$(t, u), T$(n, u), await R$(e, n, u);
  } catch (c) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", c), ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${a}.`), t.innerHTML = l;
  } finally {
    t.disabled = !1;
  }
}
function m$(e, t) {
  e.classList.add(`${h}__resistance-roll-button--rolled`), e.setAttribute(Fl, String(t.total)), e.textContent = String(t.total), e.title = `Rolar ${t.skillLabel} novamente`, e.setAttribute("aria-label", e.title);
}
function f$(e, t) {
  const n = e.closest(`.${h}__resistance`);
  if (!n) return;
  const r = n.querySelector(`.${h}__resistance-roll-result`), a = r ?? Hl(t);
  if (r) {
    r.textContent = Ql(t);
    return;
  }
  n.append(a);
}
function p$(e, t) {
  const n = U.get(t);
  if (n) return n;
  const r = nn(e);
  return K(r)[t] ?? null;
}
function g$(e, t) {
  const n = e?.resistanceTargetActor;
  if (V(n)) return n;
  const a = e?.context?.targets.map(hr).find(V) ?? null;
  if (a) return a;
  const o = t.getAttribute(Ol) ?? e?.resistanceTargetActorId ?? null, s = o ? y$(o) : null;
  return s || b$(
    t.getAttribute(Ml) ?? e?.resistanceTargetName ?? h$(t)
  );
}
function h$(e) {
  const n = e.closest(`.${h}`)?.querySelector(`.${Bl}`)?.textContent ?? null;
  if (!n) return null;
  const r = "→";
  if (!n.includes(r)) return null;
  const a = n.split(r), o = a[a.length - 1]?.trim();
  return o && o.length > 0 ? o : null;
}
function hr(e) {
  const t = e.actor;
  if (V(t)) return t;
  const n = e.token, r = nt(n);
  if (r) return r;
  const a = e.document;
  return nt(a);
}
function nt(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (V(t)) return t;
  const n = e.document?.actor;
  return V(n) ? n : null;
}
function y$(e) {
  const n = game.actors?.get?.(e);
  return V(n) ? n : Yl().map((o) => nt(o)).find((o) => o?.id === e) ?? null;
}
function b$(e) {
  const t = Le(e);
  if (!t) return null;
  const n = Yl().filter((o) => Le(A$(o)) === t).map((o) => nt(o)).find(V) ?? null;
  if (n) return n;
  const a = game.actors?.find?.((o) => V(o) && Le(o.name) === t);
  return V(a) ? a : null;
}
function Yl() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function A$(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : nt(e)?.name ?? null;
}
function Le(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function V(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Ql(e) {
  const t = e.diceBreakdown ? ` ${e.diceBreakdown}` : "";
  return `${e.skillLabel}: ${e.formula}${t} = ${e.total}`;
}
async function _$(e) {
  const t = game.dice3d;
  typeof t?.showForRoll == "function" && await Promise.resolve(t.showForRoll(e, game.user, !0));
}
function T$(e, t) {
  const n = U.get(e);
  n && (n.resistanceRollResult = t);
}
async function R$(e, t, n) {
  const r = nn(e);
  if (r)
    try {
      const a = K(r), o = a[t];
      if (!o) return;
      a[t] = {
        ...o,
        resistanceRollResult: n
      }, await qe(r, a);
    } catch (a) {
      console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", a);
    }
}
function nn(e) {
  const n = (e.closest("[data-message-id]") ?? e).dataset.messageId ?? null;
  if (!n) return null;
  const r = game.messages;
  return W(r?.get?.(n));
}
async function $$(e, t) {
  if (zl(e)) {
    e.remove(), ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar ações assistidas.");
    return;
  }
  const n = e.getAttribute(tn);
  if (!n) return;
  e.disabled = !0;
  const r = e.textContent;
  if (e.textContent = "Aplicando...", await t(n)) {
    Zl(e, e.getAttribute(sa) ?? "✓ Automação aplicada"), w$(e);
    return;
  }
  e.disabled = !1, e.textContent = r;
}
function Zl(e, t) {
  e.disabled = !0, e.textContent = t, e.classList.add(Ul), e.removeAttribute(tn), e.removeAttribute(sa);
}
function w$(e) {
  const t = e.getAttribute(ur);
  if (!t) return;
  const n = e.closest(`.${h}`) ?? e.parentElement;
  if (!n) return;
  const r = `[${ur}="${Ge(t)}"]`;
  for (const a of n.querySelectorAll(r)) {
    if (a === e) continue;
    const o = a.getAttribute(vl) ?? "✓ Outra opção escolhida";
    Zl(a, o);
  }
}
function Xl(e, t) {
  const n = e.map(ua).filter(Q$), r = n.find((p) => p.intent !== "casting") ?? n[0] ?? null;
  if (!r) return null;
  const a = v(e, "Forma"), o = v(e, "Custo"), s = v(e, "Dados") ?? v(e, `Dados (${r.label})`), l = v(e, "Tipo"), c = v(e, "Resistência"), u = v(e, "Resistência Perícia"), f = v(e, "Resistência Rótulo") ?? (u ? me(u) : null), y = Jl(e, "Observação"), $ = e.filter((p) => I$(p, r)), b = k$(e);
  return {
    ...r,
    itemName: t.itemName ?? t.title ?? "Automação assistida",
    form: a,
    cost: o,
    diceBreakdown: s,
    damageType: l,
    resistance: c,
    resistanceSkill: u,
    resistanceSkillLabel: f,
    notes: y,
    details: $,
    castingCheck: b,
    resistanceRollResult: t.resistanceRollResult ?? null
  };
}
function k$(e) {
  const t = e.map(ua).find((o) => o?.intent === "casting") ?? null, n = v(e, "Conjuração DT"), r = v(e, "Conjuração Resultado");
  if (!t || !n || !r) return null;
  const a = Number(n);
  return Number.isFinite(a) ? {
    label: t.formula,
    formula: v(e, "Conjuração Fórmula") ?? t.formula,
    total: t.total,
    difficulty: Math.trunc(a),
    success: r.toLowerCase() === "sucesso",
    diceBreakdown: v(e, "Dados (Conjuração)")
  } : null;
}
function ua(e) {
  const t = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem|Conjuração):\s*(.+?)\s*=\s*(-?\d+)/u.exec(e.trim());
  if (!t) return null;
  const [, n, r, a] = t, o = Number(a);
  return Number.isFinite(o) ? {
    label: n,
    formula: r,
    total: o,
    intent: E$(n)
  } : null;
}
function E$(e) {
  return e === "Cura" ? "healing" : e === "Dano" ? "damage" : e === "Conjuração" ? "casting" : "generic";
}
function v(e, t) {
  return Jl(e, t)[0] ?? null;
}
function Jl(e, t) {
  const n = `${t}:`;
  return e.flatMap((r) => {
    if (!r.startsWith(n)) return [];
    const a = r.slice(n.length).trim();
    return a.length > 0 ? [a] : [];
  });
}
function I$(e, t) {
  return e.startsWith("Forma:") || e.startsWith("Custo:") || e.startsWith("Dados:") || e.startsWith(`Dados (${t.label}):`) || e.startsWith("Tipo:") || e.startsWith("Resistência:") || e.startsWith("Resistência Perícia:") || e.startsWith("Resistência Rótulo:") || e.startsWith("Observação:") || e.startsWith("Conjuração Fórmula:") || e.startsWith("Conjuração DT:") || e.startsWith("Conjuração Resultado:") || e.startsWith("Dados (Conjuração):") || ua(e) ? !1 : e.trim().length > 0;
}
function C$(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of U.values())
    yr(r, e, t) && n.set(r.pendingId, r);
  for (const r of P$(e))
    yr(r, e, t) && !n.has(r.pendingId) && n.set(r.pendingId, r);
  return Array.from(n.values()).sort((r, a) => r.createdAt - a.createdAt);
}
function yr(e, t, n) {
  const r = ee(t) ?? n.dataset.messageId ?? null;
  return e.messageId ? e.messageId === r : !e.itemId || !ni(n, "itemId", e.itemId) ? !1 : !e.actorId || ni(n, "actorId", e.actorId);
}
function ni(e, t, n) {
  if (e.dataset[t] === n)
    return !0;
  const r = `data-${ew(t)}`;
  for (const a of e.querySelectorAll(`[${r}]`))
    if (a.getAttribute(r) === n)
      return !0;
  return !1;
}
function S$(e) {
  const t = Ge(e);
  return document.querySelector(
    `.chat-message[data-message-id="${t}"], [data-message-id="${t}"]`
  );
}
function L$(e) {
  for (const t of document.querySelectorAll(".chat-message, [data-message-id]"))
    if (yr(e, null, t))
      return t;
  return null;
}
function v$() {
  const e = Date.now(), t = 300 * 1e3;
  for (const [n, r] of U.entries())
    e - r.createdAt > t && U.delete(n);
}
async function ri(e, t) {
  const n = nn(e);
  if (!n) return !1;
  try {
    const r = K(n);
    return r[t.pendingId] = fa(t, ee(n)), await qe(n, r), !0;
  } catch (r) {
    return console.warn("Paranormal Toolkit: não foi possível persistir card assistido no chat renderizado.", r), !1;
  }
}
async function da(e) {
  const t = rc(e);
  if (!t) return !1;
  try {
    const n = K(t);
    return n[e.pendingId] = fa(e, ee(t)), await qe(t, n), !0;
  } catch (n) {
    return console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", n), !1;
  }
}
function ec(e) {
  for (const t of CR)
    globalThis.setTimeout(() => {
      br(e);
    }, t);
}
async function br(e) {
  const t = rc(e);
  if (ma(t)?.prompts.some((a) => a.pendingId === e.pendingId))
    return !0;
  const r = await da(e);
  return r || console.warn("Paranormal Toolkit: ainda não encontrei a ChatMessage para persistir o card estruturado.", {
    pendingId: e.pendingId,
    itemId: e.itemId,
    itemName: e.itemName,
    actorId: e.actorId,
    messageId: e.messageId
  }), r;
}
async function D$(e, t) {
  const n = nc(e.context.message);
  if (n)
    try {
      const r = K(n), a = r[e.pendingId] ?? fa(e, ee(n));
      r[e.pendingId] = {
        ...a,
        executedLabel: t ?? a.executedLabel,
        executed: !0
      }, await qe(n, r);
    } catch (r) {
      console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", r);
    }
}
function P$(e) {
  return Object.values(K(W(e))).filter(lt);
}
function K(e) {
  if (!e) return {};
  const t = {}, n = ma(e);
  for (const r of n?.prompts ?? [])
    t[r.pendingId] = r;
  for (const [r, a] of Object.entries(tc(e)))
    t[r] ??= a;
  return t;
}
function N$(e) {
  return Object.values(tc(W(e))).filter(lt);
}
function tc(e) {
  if (!e) return {};
  const t = e.getFlag?.(d, Sl);
  if (!xe(t))
    return {};
  const n = {};
  for (const [r, a] of Object.entries(t))
    lt(a) && (n[r] = a);
  return n;
}
async function qe(e, t) {
  typeof e.setFlag == "function" && (await O$(e, t), await x$(e, t));
}
async function x$(e, t) {
  await Promise.resolve(e.setFlag?.(d, Sl, t));
}
function ma(e) {
  if (!e) return null;
  const t = e.getFlag?.(d, Ll);
  return K$(t) ? t : null;
}
async function O$(e, t) {
  if (typeof e.setFlag != "function") return;
  const n = Object.values(t).filter(lt).sort((o, s) => o.createdAt - s.createdAt);
  if (n.length === 0) return;
  const r = n[0];
  if (!r) return;
  const a = {
    schemaVersion: 1,
    kind: "item-use",
    createdAt: Math.min(...n.map((o) => o.createdAt)),
    messageId: r.messageId ?? ee(e) ?? null,
    source: {
      actorId: r.actorId,
      actorName: M$(r.summary),
      itemId: r.itemId,
      itemName: r.itemName
    },
    prompts: n
  };
  await Promise.resolve(e.setFlag(d, Ll, a));
}
function M$(e) {
  if (!e.includes("→")) return e.trim() || null;
  const n = e.split("→")[0]?.trim();
  return n && n.length > 0 ? n : null;
}
function fa(e, t) {
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
function nc(e) {
  const t = W(e);
  if (t?.setFlag)
    return t;
  const n = F$(e);
  if (n?.setFlag)
    return n;
  const r = ee(e);
  if (!r) return null;
  const a = game.messages;
  return W(a?.get?.(r));
}
function F$(e) {
  return !e || typeof e != "object" ? null : [
    e.document,
    e.message,
    e.chatMessage
  ].map(W).find((n) => typeof n?.setFlag == "function") ?? null;
}
function rc(e) {
  const t = nc(e.context.message);
  if (t) return t;
  const n = e.messageId ? B$(e.messageId) : null;
  if (n) return n;
  const r = ic().slice().reverse();
  return r.find((a) => U$(a, e)) ?? r.find((a) => q$(a, e)) ?? null;
}
function B$(e) {
  const t = game.messages;
  return W(t?.get?.(e));
}
function U$(e, t) {
  const n = ee(e);
  if (t.messageId && n === t.messageId) return !0;
  if (!ac(e, t)) return !1;
  const a = oc(e);
  return !t.actorId || !a || a === t.actorId;
}
function q$(e, t) {
  if (!j$(e, t)) return !1;
  const n = oc(e);
  return t.actorId && n === t.actorId ? !0 : ac(e, t);
}
function ac(e, t) {
  const n = Le(G$(e));
  if (!n) return !1;
  const r = Le(t.itemName);
  if (r && n.includes(r)) return !0;
  const a = Le(t.itemId);
  return !!(a && n.includes(a));
}
function G$(e) {
  const t = e.content;
  return typeof t == "string" ? t : null;
}
function oc(e) {
  const t = e.speaker;
  return typeof t?.actor == "string" && t.actor.length > 0 ? t.actor : null;
}
function j$(e, t) {
  const n = z$(e);
  return n === null ? !1 : Math.abs(n - t.createdAt) <= SR;
}
function z$(e) {
  const t = e.timestamp;
  if (typeof t == "number" && Number.isFinite(t)) return t;
  const n = e._stats?.modifiedTime;
  return typeof n == "number" && Number.isFinite(n) ? n : null;
}
function W(e) {
  return e && typeof e == "object" ? e : null;
}
function lt(e) {
  return xe(e) ? e.schemaVersion === 1 && typeof e.pendingId == "string" && e.mode === "ask" && typeof e.createdAt == "number" && typeof e.summary == "string" && typeof e.executed == "boolean" && P(e.messageId) && P(e.itemId) && P(e.actorId) && P(e.itemName) && ie(e.resistanceTargetActorId) && ie(e.resistanceTargetName) && Y$(e.resistanceRollResult) && V$(e.actionPayload) && kn(e.title) && kn(e.buttonLabel) && kn(e.executedLabel) && ie(e.choiceGroupId) && ie(e.skippedLabel) && ie(e.actionSectionId) && ie(e.actionSectionTitle) && Z$(e.summaryLines) : !1;
}
function V$(e) {
  return e == null ? !0 : xe(e) ? e.kind === "resource-operation" && P(e.actorId) && P(e.actorUuid) && typeof e.actorName == "string" && H$(e.resource) && W$(e.operation) && typeof e.amount == "number" && Number.isFinite(e.amount) : !1;
}
function H$(e) {
  return e === "PV" || e === "SAN" || e === "PE" || e === "PD";
}
function W$(e) {
  return e === "damage" || e === "heal" || e === "recover" || e === "spend";
}
function K$(e) {
  return xe(e) ? e.schemaVersion === 1 && e.kind === "item-use" && typeof e.createdAt == "number" && P(e.messageId) && xe(e.source) && P(e.source.actorId) && P(e.source.actorName) && P(e.source.itemId) && P(e.source.itemName) && Array.isArray(e.prompts) && e.prompts.every(lt) : !1;
}
function Y$(e) {
  return e == null ? !0 : xe(e) ? typeof e.skill == "string" && typeof e.skillLabel == "string" && typeof e.formula == "string" && typeof e.total == "number" && Number.isFinite(e.total) && typeof e.targetName == "string" && ie(e.diceBreakdown) && (e.usedFallbackBonus === void 0 || typeof e.usedFallbackBonus == "boolean") && typeof e.rolledAt == "string" : !1;
}
function Q$(e) {
  return e !== null;
}
function xe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function P(e) {
  return e === null || typeof e == "string";
}
function kn(e) {
  return e === void 0 || typeof e == "string";
}
function ie(e) {
  return e == null || typeof e == "string";
}
function Z$(e) {
  return e === void 0 || Array.isArray(e) && e.every((t) => typeof t == "string");
}
function X$(e) {
  return typeof e == "string" && e.length > 0;
}
function ic() {
  const e = game.messages;
  if (!e || typeof e != "object") return [];
  const t = e.contents;
  if (Array.isArray(t))
    return t.map(W).filter((r) => r !== null);
  const n = e.values;
  return typeof n == "function" ? Array.from(n.call(e)).map(W).filter((r) => r !== null) : [];
}
function rn(e) {
  if (e instanceof HTMLElement)
    return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement)
      return t[0];
  }
  return null;
}
function ee(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.id == "string" && t.id.length > 0 ? t.id : typeof t._id == "string" && t._id.length > 0 ? t._id : null;
}
function J$(e) {
  return e.trim().toLowerCase();
}
function ew(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Ge(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
const ai = 1e3;
class tw {
  constructor(t, n, r, a, o, s, l) {
    this.workflow = t, this.resources = n, this.damage = a, this.conditions = o, this.debugOutput = s, this.ritualAssistant = new $T(
      t,
      n,
      r,
      l
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
      settings: Ia(),
      strategies: this.strategies.map((t) => t.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size
    };
  }
  async handleItemUsed(t) {
    const n = Ia();
    if (n.executionMode === "disabled") {
      this.setAttempt(t, "skipped", "execution-mode-disabled");
      return;
    }
    const r = bi(t.item);
    if (!r.ok) {
      if (r.error.reason === "missing-automation" && lw(t.item) && n.executionMode === "ask") {
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
    if (await No(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Cn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t);
    const a = rw(
      t.item,
      r.value.definition
    );
    switch (n.executionMode) {
      case "ask":
        await this.handleAskMode(t, a, r.value.source);
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
      return this.pendingExecutions.delete(t), await wn(t), await this.executeAutomation(
        n.context,
        n.definition,
        n.mode
      ), !0;
    const r = await this.executeAssistedAction(
      n.action,
      n.workflowContext
    );
    return r.ok ? (this.pendingExecutions.delete(t), await wn(
      t,
      r.executedLabel
    ), await this.resolveAlternativeActions(n), this.setAttempt(n.context, "completed"), !0) : !1;
  }
  async executePersistedPendingAutomation(t) {
    const n = ca(t);
    if (!n?.prompt.actionPayload)
      return ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada."
      ), !1;
    const r = n.prompt.actionPayload, a = dw(r);
    if (!a)
      return ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${r.actorName} para aplicar a ação persistida.`
      ), !1;
    const o = await Lt(
      this.resources,
      a,
      r.resource,
      r.operation,
      r.amount
    );
    return o.ok ? (await PR(t), await NR(
      t,
      n.prompt.choiceGroupId,
      n.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    ), !0) : (this.handleResourceActionFailure(o), !1);
  }
  registerPromptRenderer() {
    this.promptRendererRegistered || (vR(
      (t) => this.executePendingAutomation(t)
    ), this.promptRendererRegistered = !0);
  }
  async handleAskMode(t, n, r) {
    if (this.ritualAssistant.canHandle(t, n)) {
      await this.handleAssistedRitual(t, n, r);
      return;
    }
    await this.createPendingWorkflowPrompt(t, n);
  }
  async handleGenericRitual(t) {
    if (await No(t), !t.actor) {
      this.setAttempt(t, "failed", "missing-actor"), this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${t.item.name}.`,
        data: Cn(t, "failed", "missing-actor")
      });
      return;
    }
    if (this.isDuplicate(t)) {
      this.setAttempt(t, "skipped", "duplicate-window");
      return;
    }
    this.markExecution(t), await this.handleAssistedRitual(
      t,
      cw(t.item),
      { type: "generic" }
    );
  }
  async handleAssistedRitual(t, n, r) {
    this.setAttempt(t, "running", "ritual-assisted-cast");
    const a = await this.ritualAssistant.run(t, n, r);
    switch (a.status) {
      case "cancelled":
        this.setAttempt(t, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(t, "failed", a.reason), this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: a.message,
          data: a.cause ?? a
        }), ui.notifications?.warn(`Paranormal Toolkit: ${a.message}`);
        return;
      case "completed-without-actions":
        await this.registerCompletedRitualCard(
          a.itemUseContext,
          a.summaryLines
        ), this.setAttempt(t, "completed", "ritual-assisted-no-actions"), m.info(
          "Ritual assistido concluído sem ações pendentes.",
          ue(a.workflowContext)
        );
        return;
      case "ready":
        await this.registerAssistedActions(
          a.itemUseContext,
          a.workflowContext,
          a.actions,
          a.summaryLines
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
      if (!fe())
        return ui.notifications?.warn("Paranormal Toolkit: apenas o Mestre pode aplicar dano assistido."), { ok: !1 };
      const a = await this.damage.applyDamage({
        actor: t.actor,
        instances: t.instances,
        source: t.source,
        originUuid: t.originUuid
      });
      return a.ok ? (sw(n, a.value), await As(a.value), {
        ok: !0,
        executedLabel: nw(a.value)
      }) : (this.handleDamageActionFailure(a.error), { ok: !1 });
    }
    if (!fe())
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
    const n = En(t.action);
    if (!n) return;
    const r = Array.from(
      this.pendingExecutions.entries()
    ).filter(([, a]) => a.kind === "assisted-action" && En(a.action) === n);
    for (const [a, o] of r)
      o.kind === "assisted-action" && o.id !== t.id && (this.pendingExecutions.delete(a), await wn(
        a,
        oi(o.action) ?? "✓ Outra opção escolhida"
      ));
  }
  async registerCompletedRitualCard(t, n) {
    const r = Sn();
    await DR({
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
      const l = Sn();
      o ??= l, this.pendingExecutions.set(l, {
        kind: "assisted-action",
        id: l,
        action: s,
        context: t,
        workflowContext: n,
        createdAt: Date.now()
      }), await Zo({
        pendingId: l,
        context: t,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: s.label,
        executedLabel: s.executedLabel,
        choiceGroupId: En(s),
        skippedLabel: oi(s),
        actionSectionId: s.actionSectionId,
        actionSectionTitle: s.actionSectionTitle,
        summaryLines: a,
        resistanceTargetActor: s.actor,
        resistanceTargetActorId: s.actor.id ?? null,
        resistanceTargetName: s.actorName,
        actionPayload: uw(s)
      });
    }
    this.setAttempt(
      t,
      "pending",
      "ritual-assisted-actions",
      o
    ), m.info(
      "Ritual assistido preparado com ações pendentes.",
      ue(n)
    );
  }
  async createPendingWorkflowPrompt(t, n) {
    const r = Sn();
    this.pendingExecutions.set(r, {
      kind: "workflow",
      id: r,
      definition: n,
      context: t,
      mode: "ask",
      createdAt: Date.now()
    }), await Zo({
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
    this.setAttempt(t, "completed"), m.info(
      "Automação executada por uso normal de item.",
      ue(a.value.context)
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
    const n = Date.now(), r = ii(t);
    for (const [o, s] of this.recentExecutionKeys.entries())
      n - s > ai && this.recentExecutionKeys.delete(o);
    const a = this.recentExecutionKeys.get(r);
    return a !== void 0 && n - a <= ai;
  }
  markExecution(t) {
    this.recentExecutionKeys.set(ii(t), Date.now());
  }
  setAttempt(t, n, r, a) {
    this.lastAttempt = Cn(
      t,
      n,
      r,
      a
    );
  }
}
function nw(e) {
  return _s({ inputAmount: e.totalRawDamage });
}
function rw(e, t) {
  if (t.resistance || !aw(t))
    return t;
  const n = Rl(e);
  return n ? { ...t, resistance: n } : t;
}
function aw(e) {
  return ow(e) && !iw(e);
}
function ow(e) {
  return (e.conditionApplications ?? []).some(
    (t) => t.actor === "target"
  );
}
function iw(e) {
  return e.steps.some(
    (t) => t.type === "modifyResource" && t.actor === "target" && t.resource === "PV" && t.operation === "damage"
  );
}
function En(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupId ?? null;
}
function oi(e) {
  return e.kind !== "resource-operation" && e.kind !== "damage-application" ? null : e.choiceGroupResolvedLabel ?? null;
}
function sw(e, t) {
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
function lw(e) {
  return e.type === "ritual";
}
function cw(e) {
  return zA(e) ?? {
    version: 1,
    label: `Conjuração de ${e.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }]
  };
}
function uw(e) {
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
function dw(e) {
  const t = e.actorUuid ? mw(e.actorUuid) : null;
  if (Oe(t)) return t;
  const n = e.actorId ? fw(e.actorId) : null;
  return n || pw(e.actorName);
}
function mw(e) {
  const t = globalThis.fromUuidSync;
  if (typeof t != "function") return null;
  try {
    return t(e);
  } catch {
    return null;
  }
}
function fw(e) {
  const n = game.actors?.get?.(e);
  if (Oe(n)) return n;
  for (const r of sc()) {
    const a = pa(r);
    if (a?.id === e) return a;
  }
  return null;
}
function pw(e) {
  const t = In(e);
  if (!t) return null;
  for (const a of sc()) {
    const o = gw(a);
    if (In(o) === t) {
      const s = pa(a);
      if (s) return s;
    }
  }
  const r = game.actors?.find?.(
    (a) => Oe(a) && In(a.name) === t
  );
  return Oe(r) ? r : null;
}
function sc() {
  const e = canvas?.tokens?.placeables;
  return Array.isArray(e) ? e : [];
}
function gw(e) {
  if (!e || typeof e != "object") return null;
  const t = e.name;
  if (typeof t == "string") return t;
  const n = e.document?.name;
  return typeof n == "string" ? n : pa(e)?.name ?? null;
}
function pa(e) {
  if (!e || typeof e != "object") return null;
  const t = e.actor;
  if (Oe(t)) return t;
  const n = e.document?.actor;
  return Oe(n) ? n : null;
}
function In(e) {
  const t = e?.trim().toLocaleLowerCase();
  return t && t.length > 0 ? t : null;
}
function Oe(e) {
  return !!(e && typeof e == "object" && "system" in e);
}
function Cn(e, t, n, r) {
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
function ii(e) {
  const t = e.actor?.id ?? "no-actor", n = e.item.uuid ?? e.item.id ?? e.item.name ?? "unknown-item";
  return `${t}:${n}`;
}
function Sn() {
  const e = globalThis.crypto;
  return e?.randomUUID ? e.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
class hw {
  constructor(t, n, r) {
    this.diagnostic = t, this.automationBinder = n, this.itemPatches = r;
  }
  diagnostic;
  automationBinder;
  itemPatches;
  async applyPending(t) {
    const n = this.diagnostic.getApplicableEntries(t), r = [], a = [], o = ot(t);
    for (const s of n) {
      const l = s.itemId ? o.find((f) => f.id === s.itemId) ?? null : null, c = s.match?.preset ?? null;
      if (!l || !c) {
        a.push(s);
        continue;
      }
      await this.automationBinder.applyPreset(l, c);
      const u = await this.itemPatches.applyPresetItemPatch(l, c);
      r.push({
        itemId: l.id ?? null,
        itemName: l.name ?? "Ritual sem nome",
        presetId: c.id,
        presetLabel: c.label,
        previousStatus: s.status,
        itemPatch: u
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
class yw {
  constructor(t) {
    this.automationRegistry = t;
  }
  automationRegistry;
  analyzeActor(t) {
    const n = ot(t).map((l) => this.analyzeRitual(l)), r = n.filter(bt("upToDate")), a = n.filter(bt("available")), o = n.filter(bt("outdated")), s = n.filter(bt("unsupported"));
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
    const n = this.automationRegistry.findForItem(t)[0] ?? null, r = bw(t);
    return n ? r ? r.source.type !== "preset" ? Ve({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Automação manual encontrada. Preset sugerido: ${n.preset.label}.`
    }) : r.source.presetId === n.preset.id && r.source.presetVersion === n.preset.version ? Ve({
      ritual: t,
      status: "upToDate",
      match: n,
      flag: r,
      reason: `Preset ${n.preset.label} v${n.preset.version} já aplicado.`
    }) : Ve({
      ritual: t,
      status: "outdated",
      match: n,
      flag: r,
      reason: Aw(r, n.preset)
    }) : Ve({
      ritual: t,
      status: "available",
      match: n,
      flag: r,
      reason: `Preset encontrado: ${n.preset.label}.`
    }) : Ve({
      ritual: t,
      status: "unsupported",
      match: n,
      flag: r,
      reason: r ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
    });
  }
}
function Ve(e) {
  const t = e.flag?.source, n = t?.type === "preset" ? t : null;
  return {
    itemId: e.ritual.id ?? null,
    itemName: e.ritual.name ?? "Ritual sem nome",
    status: e.status,
    match: e.match,
    preset: e.match ? Ft(e.match.preset) : null,
    appliedPresetId: n?.presetId ?? null,
    appliedPresetVersion: n?.presetVersion ?? null,
    reason: e.reason
  };
}
function bw(e) {
  const t = e.getFlag(d, "automation");
  return _r(t) ? t : null;
}
function Aw(e, t) {
  return e.source.type !== "preset" ? `Automação existente pode ser substituída pelo preset ${t.label}.` : e.source.presetId !== t.id ? `Preset aplicado (${e.source.presetId}) difere do preset atual sugerido (${t.id}).` : `Preset ${t.label} aplicado em v${e.source.presetVersion}; versão atual é v${t.version}.`;
}
function bt(e) {
  return (t) => t.status === e;
}
class _w {
  constructor(t) {
    this.debugOutput = t;
  }
  debugOutput;
  async createResourceOperationMessage(t) {
    const n = this.createResourceOperationContent(t.transaction), r = Rr(t.transaction);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.transaction.actor }),
      content: n,
      data: r,
      flags: {
        [d]: {
          resourceTransaction: r
        }
      }
    });
  }
  async createWorkflowSummaryMessage(t, n) {
    const r = this.createWorkflowSummaryContent(t, n), a = ue(t);
    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: t.sourceActor }),
      content: r,
      data: a,
      flags: {
        [d]: {
          workflowSummary: a
        }
      }
    });
  }
  createResourceOperationContent(t) {
    const n = w(t.actorName), r = w(t.resource), a = w(si(t)), o = w(Rw(t));
    return `
      <section class="${d}-card ${d}-resource-card">
        <header class="${d}-card__header">
          <strong>${a}</strong>
          <span>${n}</span>
        </header>
        <div class="${d}-card__body">
          <p><strong>${o}:</strong> ${t.appliedAmount}</p>
          <p><strong>${r}:</strong> ${t.before.value}/${t.before.max} &rarr; ${t.after.value}/${t.after.max}</p>
        </div>
      </section>
    `;
  }
  createWorkflowSummaryContent(t, n) {
    const r = w(n.title ?? "Automação"), a = n.message ? `<p>${w(n.message)}</p>` : "", o = w(t.sourceToken?.name ?? t.sourceActor.name ?? "Origem sem nome"), s = w(t.item.name ?? "Item sem nome"), l = t.targets.length > 0 ? t.targets.map((p) => w(p.name)).join(", ") : "Nenhum", c = Object.values(t.rolls).map(
      (p) => `<li><strong>${w(p.id)}:</strong> ${w(p.formula)} = ${p.total} <em>(${w(Tw(p.intent))})</em>${p.damageType ? ` — ${w(p.damageType)}` : ""}</li>`
    ), u = t.ritualCosts.map(
      (p) => `<li><strong>${w(p.itemName)}:</strong> ${p.circle}º círculo — ${p.amount} ${w(p.resource)} (${w($w(p.source))})</li>`
    ), f = t.damageInstances.map(
      (p) => `<li><strong>${w(p.targetActorName)}:</strong> bruto ${p.rawAmount}${p.damageType ? ` ${w(p.damageType)}` : ""} &rarr; final ${p.finalAmount} &rarr; aplicado ${p.appliedAmount}</li>`
    ), y = t.healingInstances.map(
      (p) => `<li><strong>${w(p.targetActorName)}:</strong> bruto ${p.rawAmount} &rarr; final ${p.finalAmount} &rarr; aplicado ${p.appliedAmount}</li>`
    ), $ = t.resourceTransactions.map(
      (p) => `<li><strong>${w(p.actorName)}:</strong> ${w(si(p))} — ${p.before.value}/${p.before.max} &rarr; ${p.after.value}/${p.after.max}</li>`
    ), b = t.phases.map((p) => w(p)).join(" &rarr; ");
    return `
      <section class="${d}-card ${d}-workflow-card">
        <header class="${d}-card__header">
          <strong>${r}</strong>
          <span>${s}</span>
        </header>
        <div class="${d}-card__body">
          ${a}
          <p><strong>Origem:</strong> ${o}</p>
          <p><strong>Alvo:</strong> ${l}</p>
          ${u.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${u.join("")}</ul>` : ""}
          ${c.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${c.join("")}</ul>` : ""}
          ${f.length > 0 ? `<p><strong>Dano:</strong></p><ul>${f.join("")}</ul>` : ""}
          ${y.length > 0 ? `<p><strong>Cura:</strong></p><ul>${y.join("")}</ul>` : ""}
          ${$.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${$.join("")}</ul>` : ""}
          ${b.length > 0 ? `<p class="${d}-workflow-card__phases"><strong>Fases:</strong> ${b}</p>` : ""}
        </div>
      </section>
    `;
  }
}
function Tw(e) {
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
function si(e) {
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
function Rw(e) {
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
function $w(e) {
  switch (e) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return e;
  }
}
function w(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function ww() {
  const e = new ub(), t = new pA(e), n = new Ki(new Wi()), r = new Yi(new Dr()), a = new gA(new ul()), o = new fb(), s = new Cb(o), l = new Gb(e), c = new zb(), u = c.registerMany(
    au()
  );
  if (!u.ok)
    throw new Error(u.error.message);
  const f = new jb(), y = new Ub(), $ = rs(), b = new Xi($), p = new yw(
    c
  ), T = new hw(
    p,
    f,
    y
  ), be = new AA(), Y = new _w(be), Ae = new bA(), x = new fA(), te = new dA(
    t,
    s,
    Y,
    Ae
  ), q = new yA(te, Ae), O = new tw(
    q,
    t,
    s,
    n,
    b,
    be,
    x
  );
  return O.addStrategy(
    new Fb(
      (on) => O.handleItemUsed(on)
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
    automationBinder: f,
    itemPatches: y,
    conditionRegistry: $,
    conditions: b,
    debugOutput: be,
    chatMessages: Y,
    workflowHooks: Ae,
    ritualEvents: x,
    automation: te,
    workflow: q,
    itemUseIntegration: O,
    ritualPresetDiagnostic: p,
    ritualPresetApplications: T
  };
}
const { ApplicationV2: kw } = foundry.applications.api;
class Ot extends kw {
  constructor(t, n) {
    super({
      id: `${d}-ritual-preset-manager-${t.id ?? foundry.utils.randomID()}`,
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
    id: `${d}-ritual-preset-manager`,
    classes: [d, "paranormal-toolkit-ritual-preset-manager"],
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
      apply: Ot.onApply,
      cancel: Ot.onCancel
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
          <p class="paranormal-toolkit-preset-manager__eyebrow">${j(Ar)}</p>
          <h2>Gerenciar presets de rituais</h2>
          <p>Ator: <strong>${j(t.actorName)}</strong></p>
        </div>
        ${this.renderSummary(t)}
      </header>

      ${this.renderLastResult()}

      <div class="paranormal-toolkit-preset-manager__sections">
        ${Ln("Prontos para aplicar", "available", t.available, "fa-solid fa-plus")}
        ${Ln("Desatualizados", "outdated", t.outdated, "fa-solid fa-rotate")}
        ${Ln("Automatizados", "upToDate", t.upToDate, "fa-solid fa-check")}
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
function Ln(e, t, n, r) {
  return `
    <section class="paranormal-toolkit-preset-manager__section paranormal-toolkit-preset-manager__section--${t}">
      <h3>
        <i class="${r}"></i>
        <span>${j(e)}</span>
        <small>${n.length}</small>
      </h3>
      ${n.length > 0 ? Ew(n) : Cw(t)}
    </section>
  `;
}
function Ew(e) {
  return `<ol class="paranormal-toolkit-preset-manager__list">${e.map(Iw).join("")}</ol>`;
}
function Iw(e) {
  const t = e.preset, n = t ? `${t.label} v${t.version}` : "Sem preset", r = e.appliedPresetId ? `<span class="paranormal-toolkit-preset-manager__applied">Aplicado: ${j(e.appliedPresetId)} v${j(e.appliedPresetVersion ?? "?")}</span>` : "";
  return `
    <li class="paranormal-toolkit-preset-manager__entry">
      <div>
        <strong>${j(e.itemName)}</strong>
        <span>${j(e.reason)}</span>
        ${r}
      </div>
      <em>${j(n)}</em>
    </li>
  `;
}
function Cw(e) {
  return `<p class="paranormal-toolkit-preset-manager__empty">${j({
    available: "Nenhum ritual pendente com preset conhecido.",
    outdated: "Nenhum ritual desatualizado encontrado.",
    upToDate: "Nenhum ritual automatizado ainda.",
    unsupported: "Nenhum ritual sem preset conhecido."
  }[e])}</p>`;
}
function j(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
const Mt = `${d}.manageRitualPresets`, li = `__${d}_ritualPresetHeaderControlRegistered`, Sw = [
  "getHeaderControlsOrdemActorSheet",
  "getHeaderControlsActorSheetV2",
  "getHeaderControlsDocumentSheetV2"
];
function Lw(e) {
  const t = globalThis;
  if (!t[li]) {
    for (const n of Sw)
      Hooks.on(n, (r, a) => {
        vw(r, a, e);
      });
    t[li] = !0, m.info("Ação de presets de rituais registrada no menu da ficha de ator.");
  }
}
function vw(e, t, n) {
  Array.isArray(t) && Pw(e) && (Dw(e, n), !t.some((r) => r.action === Mt) && t.push({
    action: Mt,
    icon: "fa-solid fa-wand-magic-sparkles",
    label: "Gerenciar presets de rituais",
    visible: !0,
    onClick: (r) => {
      r.preventDefault(), r.stopPropagation(), lc(e, n);
    }
  }));
}
function Dw(e, t) {
  e.options && (e.options.actions ??= {}, !e.options.actions[Mt] && (e.options.actions[Mt] = (n) => {
    n.preventDefault(), n.stopPropagation(), lc(e, t);
  }));
}
function Pw(e) {
  if (!game.user?.isGM) return !1;
  const t = cc(e);
  return t ? t.type === "agent" && ot(t).length > 0 : !1;
}
function lc(e, t) {
  const n = cc(e);
  if (!n) {
    ui.notifications?.warn("Paranormal Toolkit: não foi possível identificar o ator desta ficha.");
    return;
  }
  if (!game.user?.isGM) {
    ui.notifications?.warn("Paranormal Toolkit: apenas o mestre pode gerenciar presets de rituais.");
    return;
  }
  new Ot(n, t).render({ force: !0 });
}
function cc(e) {
  return ci(e.actor) ? e.actor : ci(e.document) ? e.document : null;
}
function ci(e) {
  return !!(e && typeof e == "object" && "items" in e && "type" in e);
}
const uc = "data-paranormal-toolkit-ritual-roll-config", ct = "data-paranormal-toolkit-ritual-roll-field", pe = "data-paranormal-toolkit-ritual-roll-action", di = `__${d}_ritualRollConfigBlockRegistered`, Nw = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2"
], xw = [
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
function Ow() {
  const e = globalThis;
  if (!e[di]) {
    Mw();
    for (const t of Nw)
      Hooks.on(t, (...n) => {
        Fw(n[0], n[1]);
      });
    e[di] = !0, m.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
  }
}
function Mw() {
  const e = `${d}-ritual-roll-config-inline-style`;
  if (document.getElementById(e)) return;
  const t = document.createElement("style");
  t.id = e, t.textContent = `
.${d}-ritual-roll-config {
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
.${d}-ritual-roll-config__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.${d}-ritual-roll-config__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.${d}-ritual-roll-config__title strong {
  color: rgba(89, 36, 42, 0.96);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}
.${d}-ritual-roll-config__title span {
  font-size: 0.9rem;
  font-weight: 800;
}
.${d}-ritual-roll-config__badge {
  border: 1px solid rgba(89, 36, 42, 0.25);
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.36);
  color: rgba(89, 36, 42, 0.9);
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
}
.${d}-ritual-roll-config__hint,
.${d}-ritual-roll-config__status {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.35;
  opacity: 0.8;
}
.${d}-ritual-roll-config__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.${d}-ritual-roll-config__forms-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.${d}-ritual-roll-config__forms-title {
  color: rgba(24, 19, 18, 0.9);
  font-size: 0.8rem;
  font-weight: 900;
}
.${d}-ritual-roll-config__forms-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.${d}-ritual-roll-config__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: left;
}
.${d}-ritual-roll-config__field input,
.${d}-ritual-roll-config__field select,
.${d}-ritual-roll-config__field textarea {
  width: 100%;
  min-width: 0;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
}
.${d}-ritual-roll-config__field textarea {
  resize: vertical;
}
.${d}-ritual-roll-config__field small {
  color: rgba(89, 36, 42, 0.78);
  font-size: 0.72rem;
  font-weight: 700;
}
.${d}-ritual-roll-config__form-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 7px;
  padding: 7px;
  background: rgba(255, 255, 255, 0.28);
}
.${d}-ritual-roll-config__form-card:has(input:disabled) {
  opacity: 0.72;
}
.${d}-ritual-roll-config__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.${d}-ritual-roll-config__actions button {
  width: auto;
  margin: 0;
}
.${d}-ritual-roll-config [hidden] {
  display: none !important;
}
@media (max-width: 620px) {
  .${d}-ritual-roll-config__fields,
  .${d}-ritual-roll-config__forms-grid {
    grid-template-columns: 1fr;
  }
}
`, document.head.append(t);
}
function Fw(e, t) {
  const n = Xw(e);
  if (!n || n.type !== "ritual") return;
  const r = tk(t);
  if (!r) return;
  const a = r.querySelector('section[data-tab="ritualAttr"]');
  if (!a) return;
  Uw(a);
  const o = mc(n), s = Tl(n), l = Jw(n), c = qw(n, s, o, l);
  Ww(c, n, o, l), Bw(a, c), ga(c);
}
function Bw(e, t) {
  const n = e.querySelector('input[name="system.studentForm"]')?.closest(".resource.grid");
  if (n?.parentElement) {
    n.insertAdjacentElement("afterend", t);
    return;
  }
  (e.querySelector(".content-item.scrollable") ?? e).append(t);
}
function Uw(e) {
  for (const t of Array.from(e.querySelectorAll(`[${uc}]`)))
    t.remove();
}
function qw(e, t, n, r) {
  const a = document.createElement("section");
  a.classList.add(`${d}-ritual-roll-config`), a.setAttribute(uc, e.uuid ?? e.id ?? "ritual");
  const o = document.createElement("header");
  o.classList.add(`${d}-ritual-roll-config__header`);
  const s = document.createElement("div");
  s.classList.add(`${d}-ritual-roll-config__title`), s.append(mi("strong", "Paranormal Toolkit")), s.append(mi("span", "Fórmula de rolagem"));
  const l = document.createElement("span");
  l.classList.add(`${d}-ritual-roll-config__badge`), l.textContent = pc(t) ? "Configurada" : "Rascunho", o.append(s, l), a.append(o);
  const c = document.createElement("p");
  c.classList.add(`${d}-ritual-roll-config__hint`), c.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.", a.append(c);
  const u = document.createElement("div");
  u.classList.add(`${d}-ritual-roll-config__fields`), u.append(Gw(t, r)), u.append(jw(t, r)), u.append(zw(t, r)), a.append(u), a.append(Vw(t, n, r)), a.append(Hw(r));
  const f = document.createElement("p");
  return f.classList.add(`${d}-ritual-roll-config__status`), f.textContent = r ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.", a.append(f), a;
}
function Gw(e, t) {
  const n = an("Tipo da rolagem"), r = document.createElement("select");
  r.setAttribute(ct, "intent"), r.disabled = !t;
  for (const a of ["damage", "healing", "utility"]) {
    const o = document.createElement("option");
    o.value = a, o.textContent = jA(a), o.selected = e.intent === a, r.append(o);
  }
  return n.append(r), n;
}
function jw(e, t) {
  const n = an("Tipo de dano");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");
  const r = document.createElement("select");
  r.setAttribute(ct, "damageType"), r.disabled = !t;
  const a = document.createElement("option");
  a.value = "", a.textContent = "—", a.selected = !e.damageType, r.append(a);
  for (const o of xw) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, s.selected = e.damageType === o.value, r.append(s);
  }
  return n.append(r), n;
}
function zw(e, t) {
  const n = an("Rótulo de utilidade");
  n.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");
  const r = document.createElement("input");
  return r.type = "text", r.placeholder = "Resultado", r.value = e.utilityLabel ?? "Resultado", r.disabled = !t, r.setAttribute(ct, "utilityLabel"), n.append(r), n;
}
function Vw(e, t, n) {
  const r = document.createElement("section");
  r.classList.add(`${d}-ritual-roll-config__forms-section`);
  const a = document.createElement("strong");
  a.classList.add(`${d}-ritual-roll-config__forms-title`), a.textContent = "Fórmulas por forma", r.append(a);
  const o = document.createElement("div");
  return o.classList.add(`${d}-ritual-roll-config__forms-grid`), o.append(vn("base", "Padrão", e.forms.base.formula, !0, n)), o.append(vn("discente", "Discente", e.forms.discente.formula, t.discente, n)), o.append(vn("verdadeiro", "Verdadeiro", e.forms.verdadeiro.formula, t.verdadeiro, n)), r.append(o), r;
}
function vn(e, t, n, r, a) {
  const o = an(t);
  o.classList.add(`${d}-ritual-roll-config__form-card`), o.dataset.ritualRollForm = e;
  const s = document.createElement("input");
  if (s.type = "text", s.placeholder = e === "base" ? "Ex.: 3d6" : "Ex.: 6d6", s.value = n, s.disabled = !a || !r, s.setAttribute(ct, `formula.${e}`), o.append(s), !r) {
    const l = document.createElement("small");
    l.textContent = "Indisponível neste ritual.", o.append(l);
  }
  return o;
}
function Hw(e) {
  const t = document.createElement("div");
  t.classList.add(`${d}-ritual-roll-config__actions`);
  const n = document.createElement("button");
  n.type = "button", n.textContent = "Salvar fórmula", n.disabled = !e, n.setAttribute(pe, "save");
  const r = document.createElement("button");
  return r.type = "button", r.textContent = "Limpar", r.disabled = !e, r.setAttribute(pe, "clear"), t.append(n, r), t;
}
function an(e) {
  const t = document.createElement("label");
  t.classList.add(`${d}-ritual-roll-config__field`);
  const n = document.createElement("span");
  return n.textContent = e, t.append(n), t;
}
function mi(e, t) {
  const n = document.createElement(e);
  return n.textContent = t, n;
}
function Ww(e, t, n, r) {
  je(e, "intent")?.addEventListener("change", () => ga(e)), gi(e, "system.studentForm")?.addEventListener("change", () => fi(e, t)), gi(e, "system.trueForm")?.addEventListener("change", () => fi(e, t)), e.querySelector(`[${pe}="save"]`)?.addEventListener("click", () => {
    r && Kw(e, t, n);
  }), e.querySelector(`[${pe}="clear"]`)?.addEventListener("click", () => {
    r && Yw(e, t);
  });
}
async function Kw(e, t, n) {
  const r = e.querySelector(`[${pe}="save"]`);
  r?.setAttribute("disabled", "true"), ve(e, "Salvando configuração...");
  try {
    const a = Qw(e, n);
    await qA(t, a), dc(e, a), ve(e, "Configuração salva."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (a) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", a), ve(e, "Não foi possível salvar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    r?.removeAttribute("disabled");
  }
}
async function Yw(e, t) {
  const n = e.querySelector(`[${pe}="clear"]`);
  n?.setAttribute("disabled", "true"), ve(e, "Limpando configuração...");
  try {
    await GA(t);
    const r = Tl(t);
    Zw(e, r), dc(e, r), ve(e, "Configuração removida."), ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (r) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", r), ve(e, "Não foi possível limpar a configuração."), ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    n?.removeAttribute("disabled");
  }
}
function dc(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__badge`);
  n && (n.textContent = pc(t) ? "Configurada" : "Rascunho");
}
function Qw(e, t) {
  return {
    schemaVersion: 1,
    intent: fc(je(e, "intent")?.value),
    damageType: hi(e, "damageType"),
    utilityLabel: hi(e, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: kt(e, "formula.base") },
      discente: { formula: kt(e, "formula.discente") },
      verdadeiro: { formula: kt(e, "formula.verdadeiro") }
    }
  };
}
function Zw(e, t) {
  $e(e, "intent", t.intent), $e(e, "damageType", t.damageType ?? ""), $e(e, "utilityLabel", t.utilityLabel ?? "Resultado"), $e(e, "formula.base", t.forms.base.formula), $e(e, "formula.discente", t.forms.discente.formula), $e(e, "formula.verdadeiro", t.forms.verdadeiro.formula), ga(e);
}
function ga(e) {
  const t = fc(je(e, "intent")?.value), n = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-damage-row="true"]'), r = e.querySelectorAll('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');
  for (const a of Array.from(n))
    a.hidden = t !== "damage";
  for (const a of Array.from(r))
    a.hidden = t !== "utility";
}
function fi(e, t) {
  const n = mc(t);
  pi(e, "discente", n.discente), pi(e, "verdadeiro", n.verdadeiro);
}
function pi(e, t, n) {
  const r = je(e, `formula.${t}`);
  if (!r) return;
  const a = !e.querySelector(`[${pe}="save"]`)?.disabled;
  r.disabled = !a || !n;
  const o = r.closest(`.${d}-ritual-roll-config__field`), s = o?.querySelector("small");
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
function ve(e, t) {
  const n = e.querySelector(`.${d}-ritual-roll-config__status`);
  n && (n.textContent = t);
}
function mc(e) {
  const t = ek(e);
  return {
    base: !0,
    discente: t.studentForm === !0,
    verdadeiro: t.trueForm === !0
  };
}
function Xw(e) {
  return yi(e.item) ? e.item : yi(e.document) ? e.document : null;
}
function Jw(e) {
  return !!(game.user?.isGM || e.isOwner === !0);
}
function ek(e) {
  const t = e.system;
  return nk(t) ? t : {};
}
function gi(e, t) {
  return e.closest('[data-tab="ritualAttr"]')?.querySelector(`input[name="${t}"]`) ?? null;
}
function je(e, t) {
  return e.querySelector(`[${ct}="${rk(t)}"]`);
}
function kt(e, t) {
  return je(e, t)?.value.trim() ?? "";
}
function hi(e, t) {
  const n = kt(e, t);
  return n.length > 0 ? n : null;
}
function $e(e, t, n) {
  const r = je(e, t);
  r && (r.value = n);
}
function fc(e) {
  return e === "healing" || e === "utility" ? e : "damage";
}
function pc(e) {
  return Object.values(e.forms).some((t) => t.formula.trim().length > 0);
}
function tk(e) {
  if (e instanceof HTMLElement) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (t[0] instanceof HTMLElement) return t[0];
    if (t.element instanceof HTMLElement) return t.element;
  }
  return null;
}
function yi(e) {
  return !!(e && typeof e == "object" && "type" in e && "system" in e && "getFlag" in e && "setFlag" in e);
}
function nk(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function rk(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
let le = null;
Hooks.once("init", () => {
  eu(), vu(), dd(), Zy(), m.info("Inicializando módulo.");
});
Hooks.once("ready", () => {
  if (!La.isSupportedSystem()) {
    m.warn(
      `Sistema não suportado: ${La.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }
  le = ww(), le.itemUseIntegration.registerStrategies(), sd(le.conditions), zu(le), td(), Zu(), rb(), Lw(le), Ow(), m.info("Inicializado para o sistema Ordem Paranormal."), m.info(
    `API de debug disponível em globalThis["${d}"] e globalThis.ParanormalToolkit.`
  ), ui.notifications?.info(`${Ar} inicializado.`);
});
function ak() {
  if (!le)
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  return le;
}
export {
  ak as getToolkitServices
};
//# sourceMappingURL=main.js.map
